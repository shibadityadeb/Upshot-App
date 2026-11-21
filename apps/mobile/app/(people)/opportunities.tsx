import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Event, EventApplication } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { EmptyState, StatusBadge } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { useDebounce } from '../../src/hooks/useDebounce';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

const VERTICAL_FILTERS = [
  { label: 'All', slug: null },
  { label: 'Events', slug: 'irise' },
  { label: 'Growth Solutions', slug: 'ibelieve' },
] as const;
const TIME_FILTERS = ['Upcoming', 'Past'];
const VIEWS = [
  { key: 'discover', label: 'Discover' },
  { key: 'joined', label: 'Joined' },
] as const;
type ViewKey = (typeof VIEWS)[number]['key'];

/** Joined workshops stay visible for a week after the event, then leave
    the UI only — the application rows are never touched in the DB. */
const JOINED_GRACE_MS = 7 * 24 * 60 * 60 * 1000;

export default function PeopleWorkshops() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const params = useLocalSearchParams<{ vertical?: string }>();

  const [view, setView] = useState<ViewKey>('discover');
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [verticalSlugById, setVerticalSlugById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVertical, setSelectedVertical] = useState(0);
  const [timeFilter, setTimeFilter] = useState(0);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search);

  // Time sub-filter only makes sense once a specific vertical is picked
  const subFilterEnabled = selectedVertical !== 0;

  const loadApplications = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const result = await api.events.getMyApplications(user.id);
      if (result.data) setApplications(result.data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const loadAvailableEvents = useCallback(async () => {
    try {
      const result = await api.events.getApprovedEvents(1, 50);
      if (result.data) setAvailableEvents(result.data.data);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const loadVerticals = useCallback(async () => {
    try {
      const verts = await api.verticals.getAllVerticals();
      const map: Record<string, string> = {};
      for (const v of verts) map[v.id] = v.slug;
      setVerticalSlugById(map);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    loadVerticals();
  }, [loadVerticals]);

  // Arriving from an Events/Growth Solutions page pre-selects that vertical
  useEffect(() => {
    if (!params.vertical) return;
    if (params.vertical === 'all') {
      setSelectedVertical(0);
      setView('discover');
      return;
    }
    const idx = VERTICAL_FILTERS.findIndex((v) => v.slug === params.vertical);
    if (idx > 0) {
      setSelectedVertical(idx);
      setView('discover');
    }
  }, [params.vertical]);

  // Refresh on focus so a fresh application or new workshop shows up immediately
  useFocusEffect(
    useCallback(() => {
      loadApplications();
      loadAvailableEvents();
    }, [loadApplications, loadAvailableEvents]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadApplications(), loadAvailableEvents(), loadVerticals()]);
  }, [loadApplications, loadAvailableEvents, loadVerticals]);

  const appliedEventIds = new Set(
    applications.filter((a) => a.status !== 'withdrawn').map((a) => a.event_id),
  );

  const now = Date.now();
  const joined = applications
    .filter((app) => {
      if (app.status === 'withdrawn') return false;
      if (user && app.event?.created_by === user.id) return false;
      const dateStr = app.event?.event_date;
      if (dateStr && now > new Date(dateStr).getTime() + JOINED_GRACE_MS) return false;
      const wantedSlug = VERTICAL_FILTERS[selectedVertical].slug;
      if (wantedSlug) {
        const slug = app.event?.vertical_id ? verticalSlugById[app.event.vertical_id] : undefined;
        if (slug !== wantedSlug) return false;
        const isPast = !!dateStr && new Date(dateStr).getTime() < now;
        if ((timeFilter === 1) !== isPast) return false;
      }
      const q = debouncedSearch.toLowerCase();
      if (!q) return true;
      return (
        (app.event?.title ?? '').toLowerCase().includes(q) ||
        (app.event?.location ?? '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = a.event?.event_date ?? '';
      const db = b.event?.event_date ?? '';
      const aPast = !!da && new Date(da).getTime() < now;
      const bPast = !!db && new Date(db).getTime() < now;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast ? db.localeCompare(da) : da.localeCompare(db);
    });

  const joinedCreated: EventApplication[] = availableEvents
    .filter((ev) => !!user && ev.created_by === user.id)
    .filter((ev) => {
      const wantedSlug = VERTICAL_FILTERS[selectedVertical].slug;
      if (wantedSlug) {
        const slug = ev.vertical_id ? verticalSlugById[ev.vertical_id] : undefined;
        if (slug !== wantedSlug) return false;
        const isPast = !!ev.event_date && new Date(ev.event_date).getTime() < now;
        if ((timeFilter === 1) !== isPast) return false;
      }
      const q = debouncedSearch.toLowerCase();
      if (!q) return true;
      return ev.title.toLowerCase().includes(q) || (ev.location ?? '').toLowerCase().includes(q);
    })
    .map((ev) => ({
      id: `created-${ev.id}`,
      event_id: ev.id,
      user_id: user!.id,
      status: 'approved',
      note: null,
      applied_at: ev.created_at,
      event: ev,
    } as unknown as EventApplication));

  const joinedData = [...joinedCreated, ...joined];

  const available = availableEvents.filter((ev) => {
    const wantedSlug = VERTICAL_FILTERS[selectedVertical].slug;
    if (wantedSlug) {
      const slug = ev.vertical_id ? verticalSlugById[ev.vertical_id] : undefined;
      if (slug !== wantedSlug) return false;
    }
    const q = debouncedSearch.toLowerCase();
    if (!q) return true;
    return ev.title.toLowerCase().includes(q) || (ev.location ?? '').toLowerCase().includes(q);
  });

  const verticalLabelFor = (verticalId: string | null | undefined) => {
    const slug = verticalId ? verticalSlugById[verticalId] : undefined;
    return slug === 'irise' ? 'Events' : slug === 'ibelieve' ? 'Growth Solutions' : null;
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const renderAvailable = ({ item: ev }: { item: Event }) => {
    const eventDate = ev.event_date ? new Date(ev.event_date) : null;
    const verticalLabel = verticalLabelFor(ev.vertical_id);
    const isOwner = !!user && ev.created_by === user.id;
    const hasApplied = appliedEventIds.has(ev.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(people)/apply/${ev.id}` as any)}
        activeOpacity={0.9}
      >
        {!!ev.banner_url && (
          <View style={styles.banner}>
            <Image source={{ uri: ev.banner_url }} style={styles.bannerImg} resizeMode="cover" />
            {!!verticalLabel && (
              <View style={styles.vtag}>
                <Text style={styles.vtagText}>{verticalLabel}</Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle} numberOfLines={2}>{ev.title}</Text>
            {isOwner ? (
              <View style={styles.ownerPill}>
                <Ionicons name="ribbon" size={12} color={colors.ink} />
                <Text style={styles.ownerPillText}>Created by you</Text>
              </View>
            ) : hasApplied ? (
              <View style={styles.appliedPill}>
                <Ionicons name="checkmark" size={12} color={colors.success} />
                <Text style={styles.appliedPillText}>Applied</Text>
              </View>
            ) : null}
          </View>

          {!ev.banner_url && !!verticalLabel && (
            <View style={styles.vtagInline}>
              <Text style={styles.vtagText}>{verticalLabel}</Text>
            </View>
          )}

          {!!eventDate && (
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.meta}>{formatDate(eventDate)}</Text>
            </View>
          )}
          {!!ev.location && (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.meta} numberOfLines={1}>{ev.location}</Text>
            </View>
          )}

          {isOwner ? (
            <View style={styles.goingRow}>
              <Ionicons name="people-outline" size={14} color={colors.ink} />
              <Text style={styles.goingText}>
                {(ev.current_attendees ?? 0)} participant{(ev.current_attendees ?? 0) === 1 ? '' : 's'} coming
              </Text>
            </View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.joinBtn]}
                onPress={() => router.push(`/(people)/apply/${ev.id}` as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.joinBtnText}>{hasApplied ? 'View details' : 'View & join'}</Text>
                <Ionicons name="arrow-forward" size={15} color={colors.onPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.sponsorBtn]}
                onPress={() => router.push(`/(people)/sponsor/${ev.id}` as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.sponsorBtnText}>Sponsor</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderJoined = ({ item: app }: { item: EventApplication }) => {
    const isOwner = !!user && app.event?.created_by === user.id;
    const eventDate = app.event?.event_date ? new Date(app.event.event_date) : null;
    const isPast = !!eventDate && eventDate.getTime() < Date.now();
    const verticalLabel = verticalLabelFor(app.event?.vertical_id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(people)/apply/${app.event_id}` as any)}
        activeOpacity={0.9}
      >
        {!!app.event?.banner_url && (
          <View style={styles.banner}>
            <Image source={{ uri: app.event.banner_url }} style={styles.bannerImg} resizeMode="cover" />
            {!!verticalLabel && (
              <View style={styles.vtag}>
                <Text style={styles.vtagText}>{verticalLabel}</Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle} numberOfLines={2}>{app.event?.title ?? 'Workshop'}</Text>
            {isOwner ? (
              <View style={styles.ownerPill}>
                <Ionicons name="ribbon" size={12} color={colors.ink} />
                <Text style={styles.ownerPillText}>Created by you</Text>
              </View>
            ) : (
              <StatusBadge status={app.status} />
            )}
          </View>

          {!app.event?.banner_url && !!verticalLabel && (
            <View style={styles.vtagInline}>
              <Text style={styles.vtagText}>{verticalLabel}</Text>
            </View>
          )}

          {!!eventDate && (
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.meta}>{formatDate(eventDate)}</Text>
            </View>
          )}
          {!!app.event?.location && (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.meta} numberOfLines={1}>{app.event.location}</Text>
            </View>
          )}

          {isOwner && (
            <View style={styles.goingRow}>
              <Ionicons name="people-outline" size={14} color={colors.ink} />
              <Text style={styles.goingText}>
                {(app.event?.current_attendees ?? 0)} participant{(app.event?.current_attendees ?? 0) === 1 ? '' : 's'} coming
              </Text>
            </View>
          )}
          {!isOwner && app.status === 'approved' && !isPast && (
            <Text style={styles.confirmed}>You are confirmed!</Text>
          )}
          {!isOwner && isPast && (
            <View style={styles.doneRow}>
              <Ionicons name="checkmark-done-outline" size={14} color={colors.textLight} />
              <Text style={styles.done}>Workshop completed</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  return (
    <View style={styles.container}>
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={[styles.headerRow, columnStyle]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Workshops</Text>
            <Text style={styles.headerSubtitle}>
              {view === 'discover' ? 'Find and join workshops' : 'Your joined workshops'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.hostBtn}
            onPress={() => router.push('/(people)/host-event' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.hostBtnText}>Host</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search + filters */}
      <View style={[styles.filterArea, columnStyle]}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={view === 'discover' ? 'Search workshops...' : 'Search your workshops...'}
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>

        <View style={styles.toggleRow}>
          {VIEWS.map((v) => {
            const active = view === v.key;
            return (
              <TouchableOpacity
                key={v.key}
                onPress={() => setView(v.key)}
                activeOpacity={0.8}
                style={[styles.toggle, active && styles.toggleActive]}
              >
                <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>{v.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.chipRow}>
          {VERTICAL_FILTERS.map((v, i) => {
            const active = selectedVertical === i;
            return (
              <TouchableOpacity
                key={v.label}
                onPress={() => setSelectedVertical(i)}
                activeOpacity={0.8}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{v.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {view === 'joined' && (
          <View style={styles.subChipRow}>
            {TIME_FILTERS.map((t, i) => {
              const active = subFilterEnabled && timeFilter === i;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => subFilterEnabled && setTimeFilter(i)}
                  activeOpacity={subFilterEnabled ? 0.8 : 1}
                  disabled={!subFilterEnabled}
                  style={[styles.subChip, active && styles.subChipActive, !subFilterEnabled && styles.subChipDisabled]}
                >
                  <Text style={[styles.subChipLabel, active && styles.subChipLabelActive, !subFilterEnabled && styles.subChipLabelDisabled]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <FlatList
        data={(view === 'discover' ? available : joinedData) as any[]}
        keyExtractor={(item) => item.id}
        renderItem={view === 'discover' ? (renderAvailable as any) : (renderJoined as any)}
        style={{ flex: 1 }}
        contentContainerStyle={[styles.listContent, columnStyle]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          view === 'discover' ? (
            <EmptyState
              iconName="compass-outline"
              title={debouncedSearch ? 'No results found' : 'No workshops available'}
              subtitle={debouncedSearch ? 'Try a different search term' : 'New workshops will appear here as soon as they are announced.'}
            />
          ) : (
            <EmptyState
              iconName="ribbon-outline"
              title={debouncedSearch ? 'No results found' : 'No joined workshops yet'}
              subtitle={debouncedSearch ? 'Try a different search term' : 'Join a workshop from the Discover tab and it will show up here.'}
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },

  // ── Header (lime liquid) ──
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xxl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Gap.sm },
  headerTitle: { fontSize: FontSize.display, fontWeight: Font.black, color: colors.ink, letterSpacing: -0.7 },
  headerSubtitle: { fontSize: FontSize.small, color: '#2c3326', marginTop: 3, fontWeight: Font.semibold },
  hostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  hostBtnText: { fontSize: FontSize.small, fontWeight: Font.black, color: '#fff' },

  // ── Filter area ──
  filterArea: { paddingHorizontal: Gap.base },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    marginTop: -26,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.full,
    height: 52,
    paddingHorizontal: 18,
    ...shadow.md,
  },
  searchInput: { flex: 1, fontSize: FontSize.body, color: colors.ink, paddingVertical: 0 },
  toggleRow: { flexDirection: 'row', gap: Gap.sm, marginTop: Gap.base },
  toggle: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  toggleLabel: { fontSize: FontSize.small, fontWeight: Font.bold, color: colors.textSecondary },
  toggleLabelActive: { color: '#FFFFFF' },
  chipRow: { flexDirection: 'row', gap: Gap.sm, marginTop: Gap.md, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipLabel: { fontSize: 13, fontWeight: Font.semibold, color: colors.textSecondary },
  chipLabelActive: { color: colors.onPrimary, fontWeight: Font.black },
  subChipRow: { flexDirection: 'row', gap: Gap.sm, marginTop: Gap.sm },
  subChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subChipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  subChipDisabled: { opacity: 0.35 },
  subChipLabel: { fontSize: 12, fontWeight: Font.semibold, color: colors.textSecondary },
  subChipLabelActive: { color: '#FFFFFF', fontWeight: Font.bold },
  subChipLabelDisabled: { color: colors.textLight },

  // ── List + cards ──
  listContent: { paddingHorizontal: Gap.base, paddingTop: Gap.base, paddingBottom: 110, flexGrow: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: Gap.base,
    ...shadow.sm,
  },
  banner: { height: 168, position: 'relative', backgroundColor: colors.surfaceAlt },
  bannerImg: { width: '100%', height: '100%' },
  vtag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.full,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  vtagInline: { alignSelf: 'flex-start', backgroundColor: colors.primaryTint, borderRadius: radius.full, paddingHorizontal: 11, paddingVertical: 5, marginTop: 8 },
  vtagText: { fontSize: FontSize.xs, fontWeight: Font.black, color: colors.ink },
  cardBody: { padding: Gap.base },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Gap.sm },
  cardTitle: { flex: 1, fontSize: FontSize.h2, fontWeight: Font.black, color: colors.ink, lineHeight: 24, letterSpacing: -0.3 },
  ownerPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.primaryTint, borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 5,
  },
  ownerPillText: { fontSize: FontSize.xs, fontWeight: Font.black, color: colors.ink },
  appliedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.success + '1A', borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 5,
  },
  appliedPillText: { fontSize: FontSize.xs, fontWeight: Font.black, color: colors.success },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  meta: { fontSize: FontSize.small, color: colors.textSecondary, fontWeight: Font.medium, flex: 1 },
  goingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Gap.md },
  goingText: { fontSize: FontSize.small, fontWeight: Font.bold, color: colors.ink },
  confirmed: { marginTop: Gap.md, fontSize: FontSize.body, fontWeight: Font.bold, color: colors.success },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Gap.md },
  done: { fontSize: FontSize.small, color: colors.textLight, fontWeight: Font.medium },
  actions: { flexDirection: 'row', gap: Gap.sm, marginTop: Gap.base },
  btn: { height: 44, borderRadius: radius.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  joinBtn: { flex: 2, backgroundColor: colors.primary },
  joinBtnText: { fontSize: FontSize.small, fontWeight: Font.black, color: colors.onPrimary },
  sponsorBtn: { flex: 1, backgroundColor: colors.ink },
  sponsorBtnText: { fontSize: FontSize.small, fontWeight: Font.black, color: '#FFFFFF' },
});
