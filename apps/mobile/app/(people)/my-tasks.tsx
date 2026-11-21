import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import { isTaskVisible, taskDueState } from '@upshot/types';
import type { Task } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { EmptyState, StatusBadge } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');
const SEGMENTS = ['Active', 'Completed'];

export default function MyTasksScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [activeIdx, setActiveIdx] = useState(0);
  const [pending, setPending] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  // Gate: check CC membership
  useEffect(() => {
    if (!user?.id) return;
    api.campusCartel.isMember(user.id).then((m) => {
      setIsMember(m);
      if (!m) router.replace('/(people)/campus-cartel' as any);
    }).catch(() => {
      setIsMember(false);
      router.replace('/(people)/campus-cartel' as any);
    });
  }, [user]);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [p, c] = await Promise.all([
        api.tasks.getMyPendingTasks(user.id),
        api.tasks.getMyCompletedTasks(user.id),
      ]);
      if (p.data) setPending(p.data);
      if (c.data) setCompleted(c.data);
    } catch {
      // silent
    }
  }, [user]);

  useEffect(() => {
    if (isMember !== true) return;
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData, isMember]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Tasks drop out three days after their due date passes — see isTaskVisible.
  const list = (activeIdx === 0 ? pending : completed).filter((t) => isTaskVisible(t, 'member'));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.campusCartelGreen} />
      </View>
    );
  }

  const renderPending = (task: Task) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(people)/task/${task.id}` as any)}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{task.title}</Text>
        <View style={styles.coinPill}>
          <View style={styles.coinDot} />
          <Text style={styles.coinText}>{task.coin_value} coins</Text>
        </View>
      </View>

      <View style={styles.metaCluster}>
        {task.due_date &&
          (taskDueState(task.due_date, 'member') === 'overdue' ? (
            <View style={styles.overduePill}>
              <Ionicons name="alert-circle" size={13} color={colors.error} />
              <Text style={styles.overdueText}>Due date passed</Text>
            </View>
          ) : (
            <View style={styles.dueChip}>
              <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.dueText}>
                Due {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </Text>
            </View>
          ))}
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>Assigned</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => router.push(`/(people)/task/${task.id}` as any)}
        activeOpacity={0.85}
      >
        <Text style={styles.submitBtnText}>Submit</Text>
        <Ionicons name="arrow-forward" size={15} color={colors.onPrimary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCompleted = (task: Task) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{task.title}</Text>
        <StatusBadge status={task.status} />
      </View>
      {task.status === 'approved' && (
        <View style={styles.earnedPill}>
          <View style={styles.coinDot} />
          <Text style={styles.earnedText}>+{task.coin_value} earned</Text>
        </View>
      )}
      {task.status === 'rejected' && task.review_note && (
        <Text style={styles.rejectNote}>{task.review_note}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={[styles.headerRow, columnStyle]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>My Assignments</Text>
            <Text style={styles.headerSubtitle}>Complete tasks, earn coins</Text>
          </View>
        </View>
      </View>

      {/* Active / Completed toggle */}
      <View style={[styles.toggleWrap, columnStyle]}>
        <View style={styles.toggleRow}>
          {SEGMENTS.map((seg, i) => {
            const active = activeIdx === i;
            return (
              <TouchableOpacity
                key={seg}
                onPress={() => setActiveIdx(i)}
                activeOpacity={0.85}
                style={[styles.toggle, active && styles.toggleActive]}
              >
                <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>{seg}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          activeIdx === 0 ? renderPending(item) : renderCompleted(item)
        }
        style={{ flex: 1 }}
        contentContainerStyle={[styles.listContent, columnStyle]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.campusCartelGreen} />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="clipboard-outline"
            title={activeIdx === 0 ? 'No active assignments' : 'No completed assignments'}
            subtitle={
              activeIdx === 0
                ? 'New tasks will appear here when assigned'
                : 'Completed and reviewed tasks show up here'
            }
          />
        }
      />
    </View>
  );
}

const GOLD = '#E3A017';
const AMBER = '#92400E';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },

  // ── Header (lime liquid) ──
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Gap.md },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(14,14,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: FontSize.display, fontWeight: Font.black, color: colors.ink, letterSpacing: -0.7 },
  headerSubtitle: { fontSize: FontSize.small, color: '#2c3326', marginTop: 3, fontWeight: Font.semibold },

  // ── Toggle ──
  toggleWrap: { paddingHorizontal: Gap.base },
  toggleRow: { flexDirection: 'row', gap: Gap.sm, marginTop: Gap.base },
  toggle: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  toggleLabel: { fontSize: FontSize.small, fontWeight: Font.bold, color: colors.textSecondary },
  toggleLabelActive: { color: '#FFFFFF' },

  // ── List ──
  listContent: { paddingHorizontal: Gap.base, paddingTop: Gap.base, paddingBottom: 110, flexGrow: 1 },

  // ── Card ──
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: Gap.base,
    marginBottom: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    color: colors.ink,
    lineHeight: 24,
    letterSpacing: -0.3,
  },

  // ── Coin (gold) ──
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  coinDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: GOLD },
  coinText: { fontSize: FontSize.xs, fontWeight: Font.black, color: AMBER },

  // ── Meta cluster (due + status) ──
  metaCluster: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Gap.sm, marginTop: Gap.md },
  dueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dueText: { fontSize: FontSize.xs, color: colors.textSecondary, fontWeight: Font.semibold },
  overduePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.error + '18',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  overdueText: { fontSize: FontSize.xs, fontWeight: Font.black, color: colors.error },
  statusPill: {
    backgroundColor: colors.info + '18',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillText: { fontSize: FontSize.xs, fontWeight: Font.black, color: colors.ink },

  // ── Submit button ──
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Gap.base,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: Gap.lg,
    alignSelf: 'flex-start',
  },
  submitBtnText: { fontSize: FontSize.small, fontWeight: Font.black, color: colors.onPrimary },

  // ── Earned (gold) ──
  earnedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: Gap.md,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  earnedText: { fontSize: FontSize.small, fontWeight: Font.black, color: AMBER },

  // ── Reject note ──
  rejectNote: {
    fontSize: FontSize.small,
    color: colors.error,
    marginTop: Gap.md,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
