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
import { colors, Font, FontSize, Gap, DarkBg, radius, shadow } from '../../src/constants/theme';
import { LoadingScreen } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

interface DashboardStats {
  pendingApprovals: number;
  totalEvents: number;
  workforce: number;
  ambassadors: number;
  pendingTasks: number;
  totalCoins: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function getFirstName(fullName: string | null | undefined): string {
  if (!fullName) return 'Admin';
  return fullName.trim().split(' ')[0];
}

interface QuickAction {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'New Task', iconName: 'checkbox-outline', route: '/(admin)/create-task', description: 'Assign to team' },
  { label: 'Give Coins', iconName: 'diamond-outline', route: '/(admin)/tasks', description: 'Reward members' },
  { label: 'Manage Codes', iconName: 'key-outline', route: '/(admin)/ambassador-codes', description: 'Ambassador codes' },
  { label: 'Ambassadors', iconName: 'star-outline', route: '/(admin)/people', description: 'View all' },
];

interface StatItem {
  label: string;
  value: number | string;
  route: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    pendingApprovals: 0,
    totalEvents: 0,
    workforce: 0,
    ambassadors: 0,
    pendingTasks: 0,
    totalCoins: 0,
  });
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [
        { count: pendingApprovals },
        { count: totalEvents },
        { count: workforce },
        { count: ambassadors },
        { count: pendingTasks },
        { data: coinsData },
        eventsResult,
      ] = await Promise.all([
        api.supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        api.supabase.from('events').select('*', { count: 'exact', head: true }),
        api.supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .in('role', ['people', 'student']),
        api.supabase.from('ambassadors').select('*', { count: 'exact', head: true }),
        api.supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
        api.supabase.from('coin_transactions').select('amount').in('type', ['earned', 'bonus']),
        api.events.getAllEventsAdmin('pending'),
      ]);

      const totalCoins =
        (coinsData as { amount: number }[] | null)?.reduce((s, t) => s + t.amount, 0) ?? 0;

      setStats({
        pendingApprovals: pendingApprovals ?? 0,
        totalEvents: totalEvents ?? 0,
        workforce: workforce ?? 0,
        ambassadors: ambassadors ?? 0,
        pendingTasks: pendingTasks ?? 0,
        totalCoins,
      });

      if (eventsResult.data) {
        setPendingEvents(eventsResult.data.slice(0, 5));
      }
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

  const STATS: StatItem[] = [
    { label: 'Pending Approvals', value: stats.pendingApprovals, route: '/(admin)/events' },
    { label: 'Total Events', value: stats.totalEvents, route: '/(admin)/events' },
    { label: 'Workforce', value: stats.workforce, route: '/(admin)/people' },
    { label: 'Ambassadors', value: stats.ambassadors, route: '/(admin)/people' },
    { label: 'Pending Tasks', value: stats.pendingTasks, route: '/(admin)/tasks' },
    { label: 'Coins Distributed', value: stats.totalCoins.toLocaleString(), route: '/(admin)/tasks' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Dark hero header */}
        <View style={styles.hero}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{getFirstName(user?.full_name)}</Text>
          <Text style={styles.heroSub}>UBM Admin Dashboard</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionLabel}>Overview</Text>
          <View style={styles.statsGrid}>
            {STATS.map((stat) => (
              <TouchableOpacity
                key={stat.label}
                style={styles.statCard}
                onPress={() => router.push(stat.route as Parameters<typeof router.push>[0])}
                activeOpacity={0.75}
              >
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pending Approvals */}
        {stats.pendingApprovals > 0 && (
          <View style={styles.pendingSection}>
            <Text style={styles.sectionLabel}>Needs Review</Text>
            {pendingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.pendingCard}
                onPress={() => router.push('/(admin)/events')}
                activeOpacity={0.75}
              >
                <View style={styles.pendingDot} />
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingTitle} numberOfLines={1}>{event.title}</Text>
                  <Text style={styles.pendingMeta} numberOfLines={1}>
                    {(event as any).company?.name ?? 'Unknown Company'}
                    {' · '}
                    {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickSection}>
          <Text style={styles.sectionLabel}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickCard}
                onPress={() => router.push(action.route as Parameters<typeof router.push>[0])}
                activeOpacity={0.75}
              >
                <View style={styles.quickIconWrap}>
                  <Ionicons name={action.iconName} size={22} color={colors.primary} />
                </View>
                <Text style={styles.quickLabel}>{action.label}</Text>
                <Text style={styles.quickDesc}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingBottom: 40,
  },

  // Hero
  hero: {
    backgroundColor: DarkBg,
    paddingTop: 40,
    paddingHorizontal: Gap.base,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: FontSize.small,
    color: colors.accent,
    fontWeight: Font.semibold,
    letterSpacing: 0.3,
  },
  userName: {
    fontSize: 32,
    fontWeight: Font.black,
    color: '#FFFFFF',
    marginTop: 4,
  },
  heroSub: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 4,
    letterSpacing: 0.5,
  },

  // Stats
  statsSection: {
    backgroundColor: colors.background,
    paddingHorizontal: Gap.base,
    paddingTop: Gap.lg,
    paddingBottom: Gap.sm,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Gap.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: Font.black,
    color: colors.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },

  // Pending
  pendingSection: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.lg,
    paddingBottom: Gap.sm,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: Gap.base,
    marginBottom: Gap.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Gap.md,
    ...shadow.sm,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
    flexShrink: 0,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingTitle: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.text,
  },
  pendingMeta: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Quick actions
  quickSection: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.lg,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  quickIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.sm,
  },
  quickLabel: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.text,
  },
  quickDesc: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
