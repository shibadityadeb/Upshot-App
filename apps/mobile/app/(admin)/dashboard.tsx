import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Event } from '@upshot/types';
import { colors, DarkBg, DarkBgSecondary, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { LoadingScreen } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

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
  { label: 'New Task', iconName: 'add-circle-outline', route: '/(admin)/create-task', description: 'Assign to team', color: colors.primary },
  { label: 'Campus Cartel', iconName: 'shield-checkmark-outline', route: '/(admin)/campus-cartel', description: 'Review applications', color: colors.campusCartelGreen },
  { label: 'Manage Codes', iconName: 'key-outline', route: '/(admin)/people', description: 'Ambassador codes', color: colors.warning, params: { tab: 'codes' } },
  { label: 'Ambassadors', iconName: 'star-outline', route: '/(admin)/people', description: 'View all', color: '#8B5CF6', params: { tab: 'ambassadors' } },
];

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    pendingApprovals: 0,
    totalEvents: 0,
    ambassadors: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

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

    } catch {
      Alert.alert('Error', 'Failed to load dashboard data.');
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero header with stats */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{getFirstName(user?.full_name)}</Text>
            </View>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>
                {getFirstName(user?.full_name).charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <TouchableOpacity
              style={[styles.statCard, styles.statCardAccent]}
              onPress={() => router.push('/(admin)/events' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.statTop}>
                <View style={[styles.statDot, { backgroundColor: '#FCD34D' }]} />
                <Text style={styles.statLabelLight}>Pending</Text>
              </View>
              <Text style={styles.statValueLight}>{stats.pendingApprovals}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => router.push('/(admin)/events' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.statTop}>
                <View style={[styles.statDot, { backgroundColor: '#60A5FA' }]} />
                <Text style={styles.statLabelLight}>Events</Text>
              </View>
              <Text style={styles.statValueLight}>{stats.totalEvents}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => router.push('/(admin)/people' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.statTop}>
                <View style={[styles.statDot, { backgroundColor: '#34D399' }]} />
                <Text style={styles.statLabelLight}>Ambassadors</Text>
              </View>
              <Text style={styles.statValueLight}>{stats.ambassadors}</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Hero
  hero: {
    backgroundColor: DarkBg,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: Font.medium,
  },
  userName: {
    fontSize: 28,
    fontWeight: Font.black,
    color: '#FFFFFF',
    marginTop: 2,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: DarkBgSecondary,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statCardAccent: {
    borderColor: 'rgba(252,211,77,0.2)',
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statLabelLight: {
    fontSize: 11,
    fontWeight: Font.semibold,
    color: 'rgba(255,255,255,0.7)',
  },
  statValueLight: {
    fontSize: 26,
    fontWeight: Font.black,
    color: '#FFFFFF',
    letterSpacing: -0.5,
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
    fontWeight: Font.semibold,
    color: colors.primary,
    marginBottom: 14,
  },

  // Event rows
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  eventDateBadge: {
    backgroundColor: colors.primary + '12',
    borderRadius: 10,
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
    color: colors.primary,
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
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
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
