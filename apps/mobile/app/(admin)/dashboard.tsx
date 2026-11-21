import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Event } from '@upshot/types';
import type { AudienceStats } from '@upshot/api-client';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { LoadingScreen } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const HERO_LIQUID = require('../../assets/hero-liquid.png');

const api = createApiClient();

interface DashboardStats {
  pendingApprovals: number;
  totalEvents: number;
  ambassadors: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFirstName(fullName: string | null | undefined): string {
  if (!fullName) return 'Admin';
  return fullName.trim().split(' ')[0];
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

interface QuickAction {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
  description: string;
  color: string;
  params?: Record<string, string>;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Home Cards', iconName: 'albums-outline', route: '/(admin)/home-cards', description: 'Featured home cards', color: colors.primaryDark },
  { label: 'Event Sources', iconName: 'globe-outline', route: '/(admin)/event-sources', description: 'Import free events', color: '#3B6FD4' },
  { label: 'New Task', iconName: 'add-circle-outline', route: '/(admin)/create-task', description: 'Assign to team', color: colors.ink },
  { label: 'Campus Cartel', iconName: 'shield-checkmark-outline', route: '/(admin)/campus-cartel', description: 'Review applications', color: colors.campusCartelGreen },
  { label: 'Manage Codes', iconName: 'key-outline', route: '/(admin)/people', description: 'Ambassador codes', color: colors.warning, params: { tab: 'codes' } },
  { label: 'Ambassadors', iconName: 'star-outline', route: '/(admin)/people', description: 'View all', color: '#8B5CF6', params: { tab: 'ambassadors' } },
];

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    pendingApprovals: 0,
    totalEvents: 0,
    ambassadors: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [audience, setAudience] = useState<AudienceStats | null>(null);

  const loadData = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const results = await Promise.allSettled([
        api.supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        api.supabase.from('hosting_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        api.supabase.from('events').select('*', { count: 'exact', head: true }),
        api.supabase.from('ambassadors').select('*', { count: 'exact', head: true }),
        api.supabase
          .from('events')
          .select('*, companies(name)')
          .gte('event_date', today)
          .in('status', ['approved', 'pending'])
          .order('event_date', { ascending: true })
          .limit(5),
        api.stats.getAudienceStats(),
      ]);

      const val = (i: number) => results[i].status === 'fulfilled' ? (results[i] as any).value : null;

      const pendingEventApprovals = val(0)?.count ?? 0;
      const pendingHostingApprovals = val(1)?.count ?? 0;
      const totalEvents = val(2)?.count ?? 0;
      const ambassadors = val(3)?.count ?? 0;
      const upcoming = (val(4)?.data ?? []) as Event[];

      setStats({
        pendingApprovals: pendingEventApprovals + pendingHostingApprovals,
        totalEvents,
        ambassadors,
      });
      setUpcomingEvents(upcoming);
      setAudience(val(5)?.data ?? null);

    } catch {
      showError(null, { context: 'Failed to load dashboard data.' });
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  if (loading) return <LoadingScreen />;

  const STAT_CARDS = [
    {
      key: 'pending',
      label: 'Pending',
      value: stats.pendingApprovals,
      icon: 'hourglass-outline' as const,
      accent: colors.warning,
      onPress: () => router.push('/(admin)/events' as any),
    },
    {
      key: 'events',
      label: 'Events',
      value: stats.totalEvents,
      icon: 'calendar-outline' as const,
      accent: colors.info,
      onPress: () => router.push('/(admin)/events' as any),
    },
    {
      key: 'ambassadors',
      label: 'Ambassadors',
      value: stats.ambassadors,
      icon: 'star-outline' as const,
      accent: colors.success,
      onPress: () => router.push('/(admin)/people' as any),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={[styles.heroTop, columnStyle]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{getFirstName(user?.full_name)}</Text>
          </View>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
              {getFirstName(user?.full_name).charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, columnStyle]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.ink} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stat tiles — premium surface cards, overlapping the header */}
        <View style={styles.statsRow}>
          {STAT_CARDS.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={styles.statCard}
              onPress={s.onPress}
              activeOpacity={0.85}
            >
              <View style={[styles.statIcon, { backgroundColor: s.accent + '14' }]}>
                <Ionicons name={s.icon} size={18} color={s.accent} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Users & activity */}
        {audience && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Users & activity</Text>
            <View style={styles.audienceGrid}>
              {[
                { label: 'Signed up', value: audience.totalUsers, accent: true },
                { label: 'People', value: audience.byRole.people },
                { label: 'Students', value: audience.byRole.student },
                { label: 'Ambassadors', value: audience.byRole.ambassador },
                { label: 'Hosts', value: audience.byRole.host },
                { label: 'Companies', value: audience.byRole.company },
                { label: 'Applied for an event', value: audience.applicants },
                { label: 'Applications', value: audience.applications },
                { label: 'Sponsor inquiries', value: audience.sponsorInquiries },
              ].map((t) => (
                <View key={t.label} style={[styles.audienceTile, t.accent && styles.audienceTileAccent]}>
                  <Text style={styles.audienceValue}>{t.value}</Text>
                  <Text style={styles.audienceLabel} numberOfLines={2}>{t.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Upcoming</Text>
              <TouchableOpacity onPress={() => router.push('/(admin)/events' as any)}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {upcomingEvents.map((event) => {
              const isPending = event.status === 'pending';
              const dateLabel = formatEventDate(event.event_date);
              const timeLabel = formatTime(event.event_time);
              return (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventRow}
                  onPress={() => router.push(`/(admin)/event-detail/${event.id}` as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.eventDateBadge, isPending && styles.eventDateBadgePending]}>
                    <Text style={[styles.eventDateText, isPending && styles.eventDateTextPending]}>
                      {dateLabel}
                    </Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                    <Text style={styles.eventMeta} numberOfLines={1}>
                      {timeLabel ? `${timeLabel}  ·  ` : ''}{event.location}
                    </Text>
                  </View>
                  {isPending && (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>Pending</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quick Actions</Text>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionRow}
              onPress={() => {
                if (action.params) {
                  router.push({ pathname: action.route as any, params: action.params });
                } else {
                  router.push(action.route as Parameters<typeof router.push>[0]);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '14' }]}>
                <Ionicons name={action.iconName} size={20} color={action.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionDesc}>{action.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Hero (lime liquid)
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xxl + Gap.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FontSize.small,
    color: '#2c3326',
    fontWeight: Font.semibold,
  },
  userName: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    marginTop: 2,
    letterSpacing: -0.7,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },

  // Stats — premium surface cards overlapping the header
  statsRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    paddingHorizontal: Gap.base,
    marginTop: -Gap.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingVertical: Gap.base,
    paddingHorizontal: Gap.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
    gap: 6,
    ...shadow.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.7,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },

  // Users & activity
  audienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  audienceTile: {
    width: '31%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  audienceTileAccent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  audienceValue: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  audienceLabel: {
    fontSize: 11,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.ink,
    marginBottom: 14,
  },

  // Event rows
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: Gap.base,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  eventDateBadge: {
    backgroundColor: colors.primaryTint,
    borderRadius: radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
    minWidth: 58,
    alignItems: 'center',
  },
  eventDateBadgePending: {
    backgroundColor: colors.warning + '18',
  },
  eventDateText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.ink,
  },
  eventDateTextPending: {
    color: colors.warning,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.text,
  },
  eventMeta: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pendingBadge: {
    backgroundColor: colors.warning + '18',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  pendingBadgeText: {
    fontSize: FontSize.micro,
    fontWeight: Font.bold,
    color: colors.warning,
  },

  // Quick actions
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: Gap.base,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionText: {
    flex: 1,
  },
  actionLabel: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.text,
  },
  actionDesc: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
