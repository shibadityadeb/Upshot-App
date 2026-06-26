import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import { useAuthStore } from '../../src/store/auth.store';
import {
  colors,
  DarkBg,
  spacing,
  radius,
  shadow,
} from '../../src/constants/theme';
import {
  Badge,
  StatusBadge,
  Button,
  EmptyState,
  LoadingScreen,
} from '../../src/components/common';
import type { Event, Company } from '@upshot/types';

const api = createApiClient();

type FilterOption = 'All' | 'pending' | 'approved' | 'rejected' | 'completed';
const FILTERS: FilterOption[] = ['All', 'pending', 'approved', 'rejected', 'completed'];

function borderColorForStatus(status: string): string {
  switch (status) {
    case 'pending': return colors.warning;
    case 'approved': return colors.success;
    case 'rejected': return colors.error;
    case 'completed': return colors.primary;
    default: return colors.border;
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function Projects() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [company, setCompany] = useState<Company | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: companyData } = await api.supabase
        .from('companies')
        .select('*')
        .eq('contact_person_id', user.id)
        .single();

      if (!companyData) return;
      setCompany(companyData as Company);

      const eventsResult = await api.events.getCompanyEvents(companyData.id);
      if (eventsResult.data) {
        setEvents(eventsResult.data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingScreen />;

  const filteredEvents = activeFilter === 'All'
    ? events
    : events.filter((e) => e.status === activeFilter);

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Dark editorial header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Projects</Text>
        <Text style={styles.headerSubtitle}>Track your submissions</Text>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterPill,
              activeFilter === filter ? styles.filterPillActive : styles.filterPillInactive,
            ]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === filter ? styles.filterPillTextActive : styles.filterPillTextInactive,
              ]}
            >
              {filter === 'All' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {sortedEvents.length === 0 ? (
          <EmptyState
            title={activeFilter === 'All' ? 'No projects yet' : `No ${activeFilter} projects`}
            subtitle={
              activeFilter === 'All'
                ? 'Post your first requirement to get started.'
                : `You have no ${activeFilter} projects at the moment.`
            }
            action={
              activeFilter === 'All' ? (
                <Button
                  title="Post a requirement"
                  variant="primary"
                  onPress={() => router.push('/(company)/post')}
                />
              ) : undefined
            }
          />
        ) : (
          sortedEvents.map((event) => (
            <View
              key={event.id}
              style={[styles.eventCard, { borderLeftColor: borderColorForStatus(event.status) }]}
            >
              <View style={styles.cardInner}>
                {/* Title + status */}
                <View style={styles.row}>
                  <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                  <StatusBadge status={event.status} />
                </View>

                {/* Type chip + date */}
                <View style={[styles.row, { marginTop: 6 }]}>
                  {event.project_type ? (
                    <Badge label={event.project_type} color={colors.textSecondary} size="sm" />
                  ) : null}
                  <Text style={styles.dateText}>
                    Submitted {formatDate(event.created_at)}
                  </Text>
                </View>

                {/* Applicants count */}
                <Text style={styles.applicantsText}>
                  {event.current_attendees ?? 0} applied
                </Text>

                {/* Approved: team info */}
                {event.status === 'approved' && (event.current_attendees ?? 0) > 0 && (
                  <View style={styles.approvedBox}>
                    <Text style={styles.approvedText}>
                      {'✓ '}
                      {event.current_attendees} / {event.max_attendees ?? '∞'} members confirmed
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(company)/projects')}>
                      <Text style={styles.viewTeamLink}>View team →</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Rejected: reason + resubmit */}
                {event.status === 'rejected' && (
                  <View style={styles.rejectedBox}>
                    <Text style={styles.rejectedTitle}>Not approved</Text>
                    {event.rejection_reason ? (
                      <Text style={styles.rejectedReason}>{event.rejection_reason}</Text>
                    ) : null}
                    <Button
                      title="Resubmit"
                      variant="outline"
                      size="sm"
                      style={styles.resubmitBtn}
                      onPress={() => router.push('/(company)/post')}
                    />
                  </View>
                )}

                {/* Pending: under review notice */}
                {event.status === 'pending' && (
                  <View style={styles.pendingBox}>
                    <Text style={styles.pendingText}>
                      ⏳ Under review by UBM — usually within 24 hours
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: DarkBg,
    paddingTop: 52,
    paddingHorizontal: spacing.lg,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.accent,
    marginTop: 4,
  },
  filtersScroll: {
    maxHeight: 52,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  filterPill: {
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillInactive: {
    backgroundColor: colors.border,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterPillTextInactive: {
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 40,
    flexGrow: 1,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 14,
    borderLeftWidth: 4,
    ...shadow.md,
  },
  cardInner: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  applicantsText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
  approvedBox: {
    backgroundColor: colors.success + '15',
    borderRadius: radius.md,
    padding: 10,
    marginTop: 8,
  },
  approvedText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  viewTeamLink: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 4,
  },
  rejectedBox: {
    backgroundColor: colors.error + '15',
    borderRadius: radius.md,
    padding: 10,
    marginTop: 8,
  },
  rejectedTitle: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '700',
  },
  rejectedReason: {
    fontSize: 12,
    color: colors.error,
    fontStyle: 'italic',
    marginTop: 2,
  },
  resubmitBtn: {
    marginTop: 8,
  },
  pendingBox: {
    backgroundColor: colors.warning + '15',
    borderRadius: radius.md,
    padding: 8,
    marginTop: 8,
  },
  pendingText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '600',
  },
});
