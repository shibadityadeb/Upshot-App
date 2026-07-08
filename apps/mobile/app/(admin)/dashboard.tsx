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
import { colors, DarkBg, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
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
  params?: Record<string, string>;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'New Task', iconName: 'checkbox-outline', route: '/(admin)/create-task', description: 'Assign to team' },
  { label: 'Campus Cartel', iconName: 'shield-checkmark-outline', route: '/(admin)/campus-cartel', description: 'Review applications' },
  { label: 'Manage Codes', iconName: 'key-outline', route: '/(admin)/people', description: 'Ambassador codes', params: { tab: 'codes' } },
  { label: 'Ambassadors', iconName: 'star-outline', route: '/(admin)/people', description: 'View all', params: { tab: 'ambassadors' } },
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

  const loadData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        api.supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        api.supabase.from('hosting_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        api.supabase.from('events').select('*', { count: 'exact', head: true }),
        api.supabase.from('ambassadors').select('*', { count: 'exact', head: true }),
        api.supabase.from('coin_transactions').select('amount').in('type', ['earned', 'bonus']),
        api.events.getAllEventsAdmin('pending'),
      ]);

      const val = (i: number) => results[i].status === 'fulfilled' ? (results[i] as any).value : null;

      const pendingEventApprovals = val(0)?.count ?? 0;
      const pendingHostingApprovals = val(1)?.count ?? 0;
      const totalEvents = val(2)?.count ?? 0;
      const ambassadors = val(3)?.count ?? 0;
      const coinsData = val(4)?.data as { amount: number }[] | null;
      const totalCoins = coinsData?.reduce((s, t) => s + t.amount, 0) ?? 0;
      const eventsResult = val(5);

      setStats({
        pendingApprovals: pendingEventApprovals + pendingHostingApprovals,
        totalEvents,
        workforce: 0,
        ambassadors,
        pendingTasks: 0,
        totalCoins,
      });

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
    { label: 'Ambassadors', value: stats.ambassadors, route: '/(admin)/people' },
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

        {/* Quick Actions */}
        <View style={styles.quickSection}>
          <Text style={styles.sectionLabel}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickCard}
                onPress={() => {
                  if (action.params) {
                    router.push({ pathname: action.route as any, params: action.params });
                  } else {
                    router.push(action.route as Parameters<typeof router.push>[0]);
                  }
                }}
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
    paddingBottom: 100,
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
