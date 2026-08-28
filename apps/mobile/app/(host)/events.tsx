import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { HostedEvent, HostingApplication } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { StatusBadge } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/* ── Live event card ──────────────────────────────────────────────────────── */

function LiveEventCard({ event, onPress }: { event: HostedEvent; onPress: () => void }) {
  const capacity = event.max_attendees;
  const approved = event.approved_participants;
  const pct = capacity && capacity > 0 ? Math.min(100, (approved / capacity) * 100) : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {event.banner_url ? (
        <Image source={{ uri: event.banner_url }} style={styles.cardBanner} />
      ) : null}

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>{event.title}</Text>
          <StatusBadge status={event.status} />
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {formatDate(event.event_date)}{event.event_time ? ` · ${event.event_time}` : ''}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
        </View>

        {/* Participant counts — the headline number for a host */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{approved}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {capacity ? Math.max(capacity - approved, 0) : '—'}
            </Text>
            <Text style={styles.statLabel}>Spots left</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, event.waitlisted_participants > 0 && styles.statValueWaiting]}>
              {event.waitlisted_participants}
            </Text>
            <Text style={styles.statLabel}>Waiting</Text>
          </View>
        </View>

        {pct !== null && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterLink}>View participants</Text>
          <Ionicons name="chevron-forward" size={15} color={colors.ink} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ── Proposal card (not yet live) ─────────────────────────────────────────── */

function ProposalCard({ app }: { app: HostingApplication }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>{app.title}</Text>
          <StatusBadge status={app.status} />
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText}>{formatDate(app.event_date)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText} numberOfLines={1}>
            {app.event_city && app.event_state ? `${app.event_city}, ${app.event_state}` : app.location}
          </Text>
        </View>

        {app.status === 'pending' && (
          <View style={styles.noticePending}>
            <Ionicons name="time-outline" size={14} color={colors.warning} />
            <Text style={styles.noticePendingText}>
              With the Upshot team for review. You'll be notified once it's approved.
            </Text>
          </View>
        )}
        {app.status === 'rejected' && (
          <View style={styles.noticeRejected}>
            <Ionicons name="close-circle-outline" size={14} color={colors.error} />
            <Text style={styles.noticeRejectedText}>
              {app.rejection_reason || 'This proposal was not approved.'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

/* ── Screen ───────────────────────────────────────────────────────────────── */

export default function HostEvents() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const [events, setEvents] = useState<HostedEvent[]>([]);
  const [proposals, setProposals] = useState<HostingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) { setLoading(false); setRefreshing(false); return; }
    try {
      const [eventsResult, appsResult] = await Promise.all([
        api.hosting.getMyHostedEvents(user.id),
        api.hosting.getMyApplications(user.id),
      ]);
      if (eventsResult.data) setEvents(eventsResult.data);
      // Approved proposals already appear as live events — don't list them twice.
      if (appsResult.data) setProposals(appsResult.data.filter((a) => a.status !== 'approved'));
    } catch (e) {
      console.warn('[HostEvents] load failed:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const totalJoined = events.reduce((sum, e) => sum + e.approved_participants, 0);
  const isEmpty = events.length === 0 && proposals.length === 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerEyebrow}>HOSTING</Text>
          <Text style={styles.headerTitle}>My Events</Text>
        </View>
        <View style={styles.headerStat}>
          <Text style={styles.headerStatValue}>{totalJoined}</Text>
          <Text style={styles.headerStatLabel}>participants</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/(host)/new-event')}
          activeOpacity={0.85}
        >
          <View style={styles.newBtnIcon}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.newBtnTitle}>Host a New Event</Text>
            <Text style={styles.newBtnSub}>Fill in the details and send for approval</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : isEmpty ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={colors.border} />
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptySub}>Host your first event using the button above</Text>
          </View>
        ) : (
          <>
            {events.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Live Events</Text>
                {events.map((event) => (
                  <LiveEventCard
                    key={event.id}
                    event={event}
                    onPress={() => router.push(`/(host)/participants/${event.id}` as any)}
                  />
                ))}
              </>
            )}

            {proposals.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, events.length > 0 && { marginTop: Gap.lg }]}>
                  Proposals
                </Text>
                {proposals.map((app) => (
                  <ProposalCard key={app.id} app={app} />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(14,14,14,0.6)',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  headerStat: { alignItems: 'flex-end' },
  headerStatValue: { fontSize: 26, fontWeight: Font.black, color: colors.ink },
  headerStatLabel: { fontSize: FontSize.xs, color: 'rgba(14,14,14,0.6)', fontWeight: Font.semibold },

  scrollContent: { paddingHorizontal: Gap.base, paddingTop: Gap.md, paddingBottom: 100 },

  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: Gap.base,
    marginBottom: Gap.base,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadow.md,
  },
  newBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBtnTitle: { fontSize: FontSize.body, fontWeight: Font.bold, color: colors.text },
  newBtnSub: { fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 },

  sectionTitle: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Gap.sm,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    marginBottom: Gap.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.sm,
  },
  cardBanner: { width: '100%', height: 130, resizeMode: 'cover' },
  cardBody: { padding: Gap.base },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
    marginBottom: Gap.sm,
  },
  cardTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  metaText: { fontSize: FontSize.small, color: colors.textSecondary, flex: 1 },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingVertical: Gap.md,
    marginTop: Gap.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.h2, fontWeight: Font.black, color: colors.text },
  statValueWaiting: { color: colors.warning },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: Font.semibold,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: { width: 1, height: 28, backgroundColor: colors.border },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginTop: Gap.md,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    marginTop: Gap.md,
  },
  cardFooterLink: { fontSize: FontSize.small, fontWeight: Font.bold, color: colors.ink },

  noticePending: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: Gap.sm,
  },
  noticePendingText: { flex: 1, fontSize: FontSize.xs, color: colors.textSecondary, lineHeight: 16 },
  noticeRejected: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: Gap.sm,
  },
  noticeRejectedText: { flex: 1, fontSize: FontSize.xs, color: colors.error, lineHeight: 16 },

  loader: { paddingVertical: Gap.xxxl, alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: Gap.xxxl, gap: Gap.sm },
  emptyTitle: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.textSecondary },
  emptySub: { fontSize: FontSize.small, color: colors.textLight },
});
