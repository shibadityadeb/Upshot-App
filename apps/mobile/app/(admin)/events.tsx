import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import type { Event, EventStatus } from '@upshot/types';
import { colors, spacing, radius, shadow } from '../../src/constants/theme';
import {
  Button,
  Card,
  CoinBadge,
  EmptyState,
  LoadingScreen,
  StatusBadge,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

type FilterOption = 'all' | 'pending' | 'approved' | 'rejected' | 'completed';

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'completed', label: 'Completed' },
];

export default function AdminEvents() {
  const user = useAuthStore((s) => s.user);

  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    const result = await api.events.getAllEventsAdmin();
    if (result.data) {
      setEvents(result.data);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadEvents();
      setLoading(false);
    })();
  }, [loadEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  }, [loadEvents]);

  const filteredEvents = events.filter((e) => {
    const matchesFilter = filter === 'all' || e.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      ((e as any).company?.name ?? '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleApprove = useCallback(
    async (eventId: string) => {
      if (!user) return;
      setActionLoading(eventId);
      try {
        const result = await api.events.updateEventStatus(eventId, user.id, {
          status: 'approved',
        });
        if (result.error) {
          Alert.alert('Error', result.error.message);
        } else {
          await loadEvents();
          Alert.alert('Approved', 'Event approved successfully');
        }
      } finally {
        setActionLoading(null);
      }
    },
    [user, loadEvents],
  );

  const handleReject = useCallback(
    (eventId: string) => {
      if (!user) return;
      if (Platform.OS === 'ios') {
        Alert.prompt(
          'Rejection Reason',
          'Enter reason for rejection',
          async (reason) => {
            if (!reason) return;
            setActionLoading(eventId);
            try {
              const result = await api.events.updateEventStatus(eventId, user.id, {
                status: 'rejected',
                rejection_reason: reason,
              });
              if (result.error) {
                Alert.alert('Error', result.error.message);
              } else {
                await loadEvents();
                Alert.alert('Rejected', 'Event rejected');
              }
            } finally {
              setActionLoading(null);
            }
          },
          'plain-text',
        );
      } else {
        // Android fallback: show alert and use a simple confirm
        Alert.alert('Reject Event', 'This event will be rejected.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: async () => {
              setActionLoading(eventId);
              try {
                await api.events.updateEventStatus(eventId, user.id, {
                  status: 'rejected',
                  rejection_reason: 'Rejected by admin',
                });
                await loadEvents();
                Alert.alert('Rejected', 'Event rejected');
              } finally {
                setActionLoading(null);
              }
            },
          },
        ]);
      }
    },
    [user, loadEvents],
  );

  const renderEvent = ({ item }: { item: Event }) => {
    const isPending = item.status === 'pending';
    const isActioning = actionLoading === item.id;
    const company = (item as any).company;

    return (
      <Card style={styles.eventCard}>
        <View style={styles.eventRow}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.eventMeta}>
          {company?.name ?? 'Unknown Company'}
          {' · '}
          {new Date(item.event_date).toLocaleDateString()}
        </Text>
        {!!item.location && (
          <Text style={styles.eventLocation} numberOfLines={1}>
            📍 {item.location}
          </Text>
        )}
        <CoinBadge amount={item.coin_reward} />
        {isPending && (
          <View style={styles.actionRow}>
            <Button
              title={isActioning ? '...' : 'Approve'}
              variant="outline"
              size="sm"
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={() => handleApprove(item.id)}
              disabled={isActioning}
            />
            <Button
              title={isActioning ? '...' : 'Reject'}
              variant="outline"
              size="sm"
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(item.id)}
              disabled={isActioning}
            />
          </View>
        )}
      </Card>
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events or companies..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTER_OPTIONS.map((opt) => {
          const active = filter === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.filterPill, active && styles.filterPillActive]}
              onPress={() => setFilter(opt.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No events found"
            subtitle={search ? 'Try a different search term' : 'No events match this filter'}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
    ...shadow.md,
  },
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.surface,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  eventCard: {
    marginBottom: 12,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: spacing.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  eventMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
  approveBtn: {
    borderColor: colors.success,
  },
  rejectBtn: {
    borderColor: colors.error,
  },
});
