import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { EmptyState, StatusBadge } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { useDebounce } from '../../src/hooks/useDebounce';

const api = createApiClient();

const VERTICAL_FILTERS = [
  { label: 'All', slug: null },
  { label: 'iRISE', slug: 'irise' },
  { label: 'iBelieve', slug: 'ibelieve' },
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

  // Arriving from an iRISE/iBelieve page pre-selects that vertical in Discover
  useEffect(() => {
    if (!params.vertical) return;
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
      // Events the user created are surfaced separately (joinedCreated) with a
      // "Created by you" card — don't also list them as a normal application.
      if (user && app.event?.created_by === user.id) return false;

      // 7-day post-event UI window — rows stay in the DB untouched
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
      // Upcoming first (soonest on top), then past (most recent on top)
      const da = a.event?.event_date ?? '';
      const db = b.event?.event_date ?? '';
      const aPast = !!da && new Date(da).getTime() < now;
      const bPast = !!db && new Date(db).getTime() < now;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast ? db.localeCompare(da) : da.localeCompare(db);
    });

  // Workshops this user created show up in the Joined tab too, as read-only
  // "Created by you" cards. Synthesised as applications so they reuse renderJoined.
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
      return (
        ev.title.toLowerCase().includes(q) ||
        (ev.location ?? '').toLowerCase().includes(q)
      );
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
    return (
      ev.title.toLowerCase().includes(q) ||
      (ev.location ?? '').toLowerCase().includes(q)
    );
  });

  const renderAvailable = ({ item: ev }: { item: Event }) => {
    const eventDate = ev.event_date ? new Date(ev.event_date) : null;
    const slug = ev.vertical_id ? verticalSlugById[ev.vertical_id] : undefined;
    const verticalLabel = slug === 'irise' ? 'iRISE' : slug === 'ibelieve' ? 'iBelieve' : null;
    const isOwner = !!user && ev.created_by === user.id;
    const hasApplied = appliedEventIds.has(ev.id);

    return (
      <TouchableOpacity
        style={styles.joinedCard}
        onPress={() => router.push(`/(people)/apply/${ev.id}` as any)}
        activeOpacity={0.8}
      >
        <View style={styles.joinedHeader}>
          <Text style={styles.joinedTitle} numberOfLines={2}>{ev.title}</Text>
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

        {!!verticalLabel && (
          <View style={styles.joinedTagRow}>
            <View style={styles.verticalTag}>
              <Text style={styles.verticalTagText}>{verticalLabel}</Text>
            </View>
          </View>
        )}

        {!!eventDate && (
          <View style={styles.joinedMetaRow}>
            <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.joinedMeta}>
              {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        )}

        {!!ev.location && (
          <View style={styles.joinedMetaRow}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.joinedMeta} numberOfLines={1}>{ev.location}</Text>
          </View>
        )}

        {isOwner ? (
          <View style={styles.goingRow}>
            <Ionicons name="people-outline" size={13} color={colors.ink} />
            <Text style={styles.goingText}>
              {(ev.current_attendees ?? 0)} participant{(ev.current_attendees ?? 0) === 1 ? '' : 's'} coming
            </Text>
          </View>
        ) : !hasApplied ? (
          <Text style={styles.joinLink}>View & join →</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const renderJoined = ({ item: app }: { item: EventApplication }) => {
    const isOwner = !!user && app.event?.created_by === user.id;
    const eventDate = app.event?.event_date ? new Date(app.event.event_date) : null;
    const isPast = !!eventDate && eventDate.getTime() < Date.now();
    const slug = app.event?.vertical_id ? verticalSlugById[app.event.vertical_id] : undefined;
    const verticalLabel = slug === 'irise' ? 'iRISE' : slug === 'ibelieve' ? 'iBelieve' : null;

    return (
      <TouchableOpacity
        style={styles.joinedCard}
        onPress={() => router.push(`/(people)/apply/${app.event_id}` as any)}
        activeOpacity={0.8}
      >
        <View style={styles.joinedHeader}>
          <Text style={styles.joinedTitle} numberOfLines={2}>
            {app.event?.title ?? 'Workshop'}
          </Text>
          {isOwner ? (
            <View style={styles.ownerPill}>
              <Ionicons name="ribbon" size={12} color={colors.ink} />
              <Text style={styles.ownerPillText}>Created by you</Text>
            </View>
          ) : (
            <StatusBadge status={app.status} />
          )}
        </View>

        {!!verticalLabel && (
          <View style={styles.joinedTagRow}>
            <View style={styles.verticalTag}>
              <Text style={styles.verticalTagText}>{verticalLabel}</Text>
            </View>
          </View>
        )}

        {!!eventDate && (
          <View style={styles.joinedMetaRow}>
            <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.joinedMeta}>
              {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        )}

        {!!app.event?.location && (
          <View style={styles.joinedMetaRow}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.joinedMeta} numberOfLines={1}>{app.event.location}</Text>
          </View>
        )}

        {isOwner && (
          <View style={styles.goingRow}>
            <Ionicons name="people-outline" size={13} color={colors.ink} />
            <Text style={styles.goingText}>
              {(app.event?.current_attendees ?? 0)} participant{(app.event?.current_attendees ?? 0) === 1 ? '' : 's'} coming
            </Text>
          </View>
        )}
        {!isOwner && app.status === 'approved' && !isPast && (
          <Text style={styles.joinedConfirmed}>You are confirmed!</Text>
        )}
        {!isOwner && isPast && (
          <View style={styles.joinedDoneRow}>
            <Ionicons name="checkmark-done-outline" size={14} color={colors.textLight} />
            <Text style={styles.joinedDone}>Workshop completed</Text>
          </View>
        )}
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

  return (
    <View style={styles.container}>
      {/* Lime header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <View>
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
      <View style={styles.filterBlock}>
        {/* Discover / Joined toggle */}
        <View style={styles.viewToggleRow}>
          {VIEWS.map((v) => {
            const active = view === v.key;
            return (
              <TouchableOpacity
                key={v.key}
                onPress={() => setView(v.key)}
                activeOpacity={0.75}
                style={[styles.viewToggle, active && styles.viewToggleActive]}
              >
                <Text style={[styles.viewToggleLabel, active && styles.viewToggleLabelActive]}>
                  {v.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder={view === 'discover' ? 'Search workshops...' : 'Search your workshops...'}
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.pillRow}>
          {VERTICAL_FILTERS.map((v, i) => {
            const active = selectedVertical === i;
            return (
              <TouchableOpacity
                key={v.label}
                onPress={() => setSelectedVertical(i)}
                activeOpacity={0.75}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                  {v.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {view === 'joined' && (
        <View style={styles.subPillRow}>
          {TIME_FILTERS.map((t, i) => {
            const active = subFilterEnabled && timeFilter === i;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => subFilterEnabled && setTimeFilter(i)}
                activeOpacity={subFilterEnabled ? 0.75 : 1}
                disabled={!subFilterEnabled}
                style={[
                  styles.subPill,
                  active && styles.subPillActive,
                  !subFilterEnabled && styles.subPillDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.subPillLabel,
                    active && styles.subPillLabelActive,
                    !subFilterEnabled && styles.subPillLabelDisabled,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        )}
      </View>

      {view === 'discover' ? (
        <FlatList
          data={available}
          keyExtractor={(item) => item.id}
          renderItem={renderAvailable}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              iconName="compass-outline"
              title={debouncedSearch ? 'No results found' : 'No workshops available'}
              subtitle={
                debouncedSearch
                  ? 'Try a different search term'
                  : 'New workshops will appear here as soon\nas they are announced.'
              }
            />
          }
        />
      ) : (
        <FlatList
          data={joinedData}
          keyExtractor={(item) => item.id}
          renderItem={renderJoined}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              iconName="ribbon-outline"
              title={debouncedSearch ? 'No results found' : 'No joined workshops yet'}
              subtitle={
                debouncedSearch
                  ? 'Try a different search term'
                  : 'Join a workshop from the Discover tab\nand it will show up here.'
              }
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: 'rgba(14,14,14,0.6)',
    marginTop: 2,
    fontWeight: Font.medium,
  },
  hostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  hostBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#fff',
  },
  viewToggleRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginBottom: 10,
  },
  viewToggle: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewToggleActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  viewToggleLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  viewToggleLabelActive: {
    color: '#FFFFFF',
    fontWeight: Font.bold,
  },
  appliedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.success + '1A',
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  appliedPillText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.success,
  },
  ownerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  ownerPillText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.ink,
  },
  goingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Gap.sm,
  },
  goingText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.ink,
  },
  joinLink: {
    marginTop: Gap.sm,
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.ink,
  },
  filterBlock: {
    backgroundColor: colors.surface,
    paddingHorizontal: Gap.base,
    paddingTop: 10,
    paddingBottom: Gap.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    fontSize: FontSize.body,
    color: colors.text,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 40,
  },
  pillRow: {
    paddingTop: 10,
    gap: Gap.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  pillLabelActive: {
    color: colors.onPrimary,
    fontWeight: Font.bold,
  },
  subPillRow: {
    paddingTop: Gap.sm,
    gap: Gap.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subPillActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  subPillDisabled: {
    opacity: 0.35,
  },
  subPillLabel: {
    fontSize: 12,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  subPillLabelActive: {
    color: '#FFFFFF',
    fontWeight: Font.bold,
  },
  subPillLabelDisabled: {
    color: colors.textLight,
  },
  listContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: 100,
    flexGrow: 1,
  },

  // ── Joined workshop cards ───────────────────────────────────
  joinedCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.base,
    marginBottom: Gap.sm,
    ...shadow.sm,
  },
  joinedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
  },
  joinedTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  joinedTagRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: Gap.sm,
  },
  joinedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  joinedMeta: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    flex: 1,
  },
  joinedConfirmed: {
    marginTop: Gap.sm,
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.success,
  },
  joinedDoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Gap.sm,
  },
  joinedDone: {
    fontSize: FontSize.small,
    color: colors.textLight,
    fontWeight: Font.medium,
  },
  verticalTag: {
    backgroundColor: colors.primaryTint,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verticalTagText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.ink,
  },
});
