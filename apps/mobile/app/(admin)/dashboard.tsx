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
import { createApiClient } from '@upshot/api-client';
import type { Event } from '@upshot/types';
import { colors, Font, FontSize, Gap, DarkBg } from '../../src/constants/theme';
import { LoadingScreen, StatCard } from '../../src/components/common';
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

const QUICK_ACTIONS = [
  { label: 'New Task', icon: '✅', route: '/(admin)/tasks' },
  { label: 'Give Coins', icon: '🪙', route: '/(admin)/tasks' },
  { label: 'Add Company', icon: '🏢', route: '/(admin)/people' },
  { label: 'Ambassadors', icon: '🌟', route: '/(admin)/people' },
] as const;

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{getFirstName(user?.full_name)}</Text>
            </View>
            <View style={styles.adminPill}>
              <Text style={styles.adminPillText}>ADMIN</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <StatCard
              label="Pending Approvals"
              value={stats.pendingApprovals}
              color={colors.warning}
              onPress={() => router.push('/(admin)/events')}
            />
            <StatCard
              label="Total Events"
              value={stats.totalEvents}
              color={colors.primary}
              onPress={() => router.push('/(admin)/events')}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              label="Workforce"
              value={stats.workforce}
              color={colors.info}
              onPress={() => router.push('/(admin)/people')}
            />
            <StatCard
              label="Ambassadors"
              value={stats.ambassadors}
              color={colors.success}
              onPress={() => router.push('/(admin)/people')}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              label="Pending Tasks"
              value={stats.pendingTasks}
              color={colors.error}
              onPress={() => router.push('/(admin)/tasks')}
            />
            <StatCard
              label="Coins Distributed"
              value={stats.totalCoins.toLocaleString()}
              color={colors.warning}
              onPress={() => router.push('/(admin)/tasks')}
            />
          </View>
        </View>

        {/* Pending Approvals Section */}
        {stats.pendingApprovals > 0 && (
          <View style={styles.pendingSection}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Needs your review</Text>
            </View>
            {pendingEvents.map((event) => (
              <View key={event.id} style={styles.pendingCard}>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={styles.pendingMeta} numberOfLines={1}>
                    {(event as any).company?.name ?? 'Unknown Company'}
                    {' · '}
                    {new Date(event.event_date).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/(admin)/events')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.reviewText}>Review →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>Quick Actions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsRow}
          >
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickChip}
                onPress={() => router.push(action.route as Parameters<typeof router.push>[0])}
                activeOpacity={0.75}
              >
                <Text style={styles.quickChipText}>{action.icon} {action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DarkBg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    backgroundColor: DarkBg,
    paddingTop: 56,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.base,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSize.small,
    color: colors.accent,
    fontWeight: Font.semibold,
  },
  userName: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: '#FFFFFF',
    marginTop: 2,
  },
  adminPill: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  adminPillText: {
    fontSize: FontSize.xs,
    color: '#FFFFFF',
    fontWeight: Font.bold,
    letterSpacing: 1,
  },

  // Stats grid
  statsSection: {
    backgroundColor: colors.background,
    paddingHorizontal: Gap.base,
    paddingTop: Gap.base,
    paddingBottom: Gap.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },

  // Pending approvals
  pendingSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.base,
  },
  sectionTitleRow: {
    paddingTop: Gap.lg,
    paddingBottom: Gap.md,
  },
  sectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
  },
  pendingCard: {
    borderRadius: 12,
    backgroundColor: colors.surface,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Gap.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingInfo: {
    flex: 1,
    marginRight: Gap.sm,
  },
  pendingTitle: {
    fontSize: 15,
    fontWeight: Font.bold,
    color: colors.text,
  },
  pendingMeta: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reviewText: {
    fontSize: FontSize.small,
    color: colors.primary,
    fontWeight: Font.semibold,
  },

  // Quick actions
  quickSection: {
    backgroundColor: colors.background,
    padding: Gap.base,
    paddingBottom: 100,
  },
  quickTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: Gap.md,
  },
  quickActionsRow: {
    flexDirection: 'row',
  },
  quickChip: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: Gap.base,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: Gap.sm,
  },
  quickChipText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.text,
  },
});
