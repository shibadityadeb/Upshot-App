import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Event, EventApplication } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../../src/constants/theme';
import { AvatarCircle, StatusBadge } from '../../../src/components/common';

const api = createApiClient();

type Filter = 'all' | 'going' | 'waiting' | 'removed';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'going', label: 'Going' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'removed', label: 'Removed' },
];

// 'pending' means the event was full when they applied — they are on the
// waiting list and move up on their own as seats free.
const bucketOf = (status: string): Exclude<Filter, 'all'> =>
  status === 'approved' ? 'going' : status === 'pending' ? 'waiting' : 'removed';

/**
 * Read-only participant list for one of the host's events.
 *
 * Applicants join automatically up to capacity; taking someone off the list
 * stays with admins. Readable via the events.created_by branch of the
 * event_applications_select policy (migration 022).
 */
export default function EventParticipants() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<EventApplication[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!id) { setLoading(false); setRefreshing(false); return; }
    try {
      const [eventResult, participantsResult] = await Promise.all([
        api.events.getEventById(id),
        api.hosting.getEventParticipants(id),
      ]);
      if (eventResult.data) setEvent(eventResult.data);
      if (participantsResult.data) setParticipants(participantsResult.data);
    } catch (e) {
      console.warn('[EventParticipants] load failed:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

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

  const counts = participants.reduce(
    (acc, p) => {
      acc[bucketOf(p.status)] += 1;
      return acc;
    },
    { going: 0, waiting: 0, removed: 0 },
  );

  const visible = participants.filter((p) => filter === 'all' || bucketOf(p.status) === filter);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerEyebrow}>PARTICIPANTS</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {event?.title ?? 'Event'}
          </Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{counts.going}</Text>
          <Text style={styles.summaryLabel}>Going</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {event?.max_attendees ? Math.max(event.max_attendees - counts.going, 0) : '—'}
          </Text>
          <Text style={styles.summaryLabel}>Spots left</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, counts.waiting > 0 && { color: colors.warning }]}>
            {counts.waiting}
          </Text>
          <Text style={styles.summaryLabel}>Waiting</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : visible.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={colors.border} />
            <Text style={styles.emptyTitle}>
              {filter === 'all' ? 'No one has signed up yet' : 'Nothing here'}
            </Text>
            <Text style={styles.emptySub}>
              {filter === 'all'
                ? 'People appear here the moment they join'
                : 'Try a different filter'}
            </Text>
          </View>
        ) : (
          visible.map((p) => (
            <View key={p.id} style={styles.row}>
              <AvatarCircle
                name={p.user?.full_name ?? '?'}
                avatarUrl={p.user?.avatar_url ?? undefined}
                size={42}
              />
              <View style={styles.rowBody}>
                <Text style={styles.rowName} numberOfLines={1}>
                  {p.user?.full_name ?? 'Unknown'}
                </Text>
                {!!p.user?.email && (
                  <Text style={styles.rowMeta} numberOfLines={1}>{p.user.email}</Text>
                )}
                <Text style={styles.rowDate}>
                  Applied {new Date(p.applied_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </Text>
                {!!p.note && <Text style={styles.rowNote} numberOfLines={3}>“{p.note}”</Text>}
              </View>
              <StatusBadge status={bucketOf(p.status) === 'waiting' ? 'waiting' : p.status} />
            </View>
          ))
        )}

        {!loading && participants.length > 0 && (
          <Text style={styles.footnote}>
            {counts.waiting > 0
              ? "People join automatically until the event is full; the rest wait and move up on their own as spots free. Reach out to the Upshot team if someone needs to be taken off the list."
              : 'People join automatically when they apply. Reach out to the Upshot team if someone needs to be taken off the list.'}
          </Text>
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(14,14,14,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
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

  summaryRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    paddingHorizontal: Gap.base,
    marginTop: Gap.base,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: Gap.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  summaryValue: { fontSize: FontSize.h1, fontWeight: Font.black, color: colors.text },
  summaryLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: Font.semibold,
    marginTop: 2,
    textAlign: 'center',
  },

  filterRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    paddingHorizontal: Gap.base,
    marginTop: Gap.base,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: Font.semibold, color: colors.textSecondary },
  filterTextActive: { color: colors.onPrimary, fontWeight: Font.bold },

  scrollContent: { paddingHorizontal: Gap.base, paddingTop: Gap.base, paddingBottom: 100 },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Gap.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.base,
    marginBottom: Gap.sm,
    ...shadow.sm,
  },
  rowBody: { flex: 1 },
  rowName: { fontSize: FontSize.body, fontWeight: Font.bold, color: colors.text },
  rowMeta: { fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 1 },
  rowDate: { fontSize: FontSize.xs, color: colors.textLight, marginTop: 3 },
  rowNote: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 5,
    lineHeight: 16,
  },

  footnote: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    lineHeight: 16,
    marginTop: Gap.md,
    paddingHorizontal: 2,
  },

  loader: { paddingVertical: Gap.xxxl, alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: Gap.xxxl, gap: Gap.sm },
  emptyTitle: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.textSecondary },
  emptySub: { fontSize: FontSize.small, color: colors.textLight, textAlign: 'center' },
});
