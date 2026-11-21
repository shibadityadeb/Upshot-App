import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import { useAuthStore } from '../../src/store/auth.store';
import {
  colors,
  Font,
  FontSize,
  Gap,
  radius,
  shadow,
  useResponsive,
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
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

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
    <View style={styles.container}>
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={columnStyle}>
          <Text style={styles.headerTitle}>My Projects</Text>
          <Text style={styles.headerSubtitle}>Track your submissions</Text>
        </View>
      </View>

      {/* Filter pills */}
      <View style={[styles.filterArea, columnStyle]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
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
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={[styles.scrollContent, columnStyle]}
      >
        {sortedEvents.length === 0 ? (
          <EmptyState
            iconName="folder-open-outline"
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
                <View style={[styles.row, { marginTop: 8 }]}>
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

        <View style={{ height: Gap.xl }} />
      </ScrollView>
    </View>
  );
}

const HERO_LIQUID = require('../../assets/hero-liquid.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerTitle: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.7,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: '#2c3326',
    marginTop: 3,
    fontWeight: Font.semibold,
  },
  filterArea: {
    paddingTop: Gap.md,
  },
  filtersRow: {
    paddingHorizontal: Gap.base,
    gap: Gap.sm,
    alignItems: 'center',
  },
  filterPill: {
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: Font.semibold,
  },
  filterPillTextActive: {
    color: colors.onPrimary,
    fontWeight: Font.black,
  },
  filterPillTextInactive: {
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.base,
    paddingBottom: 40,
    flexGrow: 1,
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    marginBottom: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    ...shadow.sm,
  },
  cardInner: {
    padding: Gap.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Gap.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: FontSize.h3,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    fontWeight: Font.medium,
  },
  applicantsText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontWeight: Font.medium,
    marginTop: 8,
  },
  approvedBox: {
    backgroundColor: colors.success + '15',
    borderRadius: radius.lg,
    padding: Gap.md,
    marginTop: Gap.md,
  },
  approvedText: {
    fontSize: FontSize.small,
    color: colors.success,
    fontWeight: Font.bold,
  },
  viewTeamLink: {
    fontSize: FontSize.small,
    color: colors.ink,
    marginTop: 4,
    fontWeight: Font.black,
  },
  rejectedBox: {
    backgroundColor: colors.error + '15',
    borderRadius: radius.lg,
    padding: Gap.md,
    marginTop: Gap.md,
  },
  rejectedTitle: {
    fontSize: FontSize.small,
    color: colors.error,
    fontWeight: Font.bold,
  },
  rejectedReason: {
    fontSize: FontSize.xs,
    color: colors.error,
    fontStyle: 'italic',
    marginTop: 2,
  },
  resubmitBtn: {
    marginTop: Gap.sm,
    alignSelf: 'flex-start',
  },
  pendingBox: {
    backgroundColor: colors.warning + '15',
    borderRadius: radius.lg,
    padding: Gap.md,
    marginTop: Gap.md,
  },
  pendingText: {
    fontSize: FontSize.xs,
    color: colors.warning,
    fontWeight: Font.bold,
  },
});
