import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import type { EventApplication } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import { Button, StatusBadge, EmptyState, LoadingScreen } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

type FilterOption = 'all' | 'pending' | 'approved' | 'rejected' | 'withdrawn';

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Withdrawn', value: 'withdrawn' },
];

export default function PeopleApplications() {
  const user = useAuthStore((s) => s.user);

  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawingIds, setWithdrawingIds] = useState<Set<string>>(new Set());

  const loadApplications = useCallback(async () => {
    if (!user) return;
    const result = await api.events.getMyApplications(user.id);
    if (result.data) {
      setApplications(result.data);
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadApplications();
      setLoading(false);
    })();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleWithdraw = async (appId: string) => {
    setWithdrawingIds((prev) => new Set(prev).add(appId));
    await api.events.withdrawApplication(appId);
    await loadApplications();
    setWithdrawingIds((prev) => {
      const s = new Set(prev);
      s.delete(appId);
      return s;
    });
  };

  const confirmWithdraw = (appId: string) => {
    Alert.alert('Withdraw application?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Withdraw', style: 'destructive', onPress: () => handleWithdraw(appId) },
    ]);
  };

  if (loading) return <LoadingScreen />;

  const filteredApplications =
    filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  const renderCard = ({ item: app }: { item: EventApplication }) => {
    const isWithdrawing = withdrawingIds.has(app.id);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {app.event?.title ?? 'Event'}
          </Text>
          <StatusBadge status={app.status} />
        </View>

        {app.event?.location ? (
          <Text style={styles.eventMeta} numberOfLines={1}>
            {'📍 ' + app.event.location}
          </Text>
        ) : null}

        {app.event?.event_date ? (
          <Text style={styles.eventMeta}>
            {'📅 ' + new Date(app.event.event_date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </Text>
        ) : null}

        <Text style={styles.appliedDate}>
          Applied {new Date(app.applied_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short',
          })}
        </Text>

        {app.status === 'pending' && (
          <View style={styles.actionRow}>
            <Button
              title="Withdraw"
              onPress={() => confirmWithdraw(app.id)}
              variant="outline"
              size="sm"
              loading={isWithdrawing}
              disabled={isWithdrawing}
            />
          </View>
        )}

        {app.status === 'approved' && (
          <Text style={styles.approvedText}>✓ You're in!</Text>
        )}

        {app.status === 'rejected' && app.note ? (
          <Text style={styles.rejectionNote}>{app.note}</Text>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Dark header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.headerSubtitle}>Track your submitted applications</Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterScrollWrapper}
      >
        {FILTERS.map((f) => {
          const isSelected = filter === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterPill, isSelected && styles.filterPillActive]}
              onPress={() => setFilter(f.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title={filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            subtitle={
              filter === 'all'
                ? 'Discover opportunities and start applying'
                : 'Change the filter to see other applications'
            }
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

  // Header
  header: {
    backgroundColor: colors.dark,
    paddingTop: Gap.lg,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },

  // Filter chips
  filterScrollWrapper: {
    maxHeight: 54,
    backgroundColor: colors.surface,
  },
  filterScroll: {
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.sm,
    gap: Gap.sm,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // List
  listContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: 100,
    flexGrow: 1,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
    marginBottom: Gap.sm,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: Font.bold,
    color: colors.text,
    flex: 1,
  },
  eventMeta: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  appliedDate: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
  actionRow: {
    marginTop: Gap.sm,
    flexDirection: 'row',
  },
  approvedText: {
    marginTop: Gap.sm,
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.success,
  },
  rejectionNote: {
    marginTop: Gap.sm,
    fontSize: FontSize.small,
    color: colors.error,
    fontStyle: 'italic',
  },
});
