import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import { isTaskVisible, taskDueState } from '@upshot/types';
import type { Task } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { EmptyState, StatusBadge, CoinBadge, SegmentedControl } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();
const SEGMENTS = ['Active', 'Completed'];

export default function MyTasksScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

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
      activeOpacity={0.75}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{task.title}</Text>
        <CoinBadge amount={task.coin_value} />
      </View>
      {task.due_date &&
        (taskDueState(task.due_date, 'member') === 'overdue' ? (
          <View style={styles.overduePill}>
            <Ionicons name="alert-circle-outline" size={12} color="#991B1B" />
            <Text style={styles.overdueText}>Due date passed</Text>
          </View>
        ) : (
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              Due {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
        ))}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => router.push(`/(people)/task/${task.id}` as any)}
        activeOpacity={0.8}
      >
        <Text style={styles.submitBtnText}>Submit</Text>
        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
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
        <View style={styles.earnedRow}>
          <Ionicons name="diamond" size={14} color={colors.success} />
          <Text style={styles.earnedText}>+{task.coin_value} earned</Text>
        </View>
      )}
      {task.status === 'rejected' && task.review_note && (
        <Text style={styles.rejectNote}>{task.review_note}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Assignments</Text>
      </View>

      <SegmentedControl
        segments={SEGMENTS}
        activeIndex={activeIdx}
        onChange={setActiveIdx}
      />

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          activeIdx === 0 ? renderPending(item) : renderCompleted(item)
        }
        contentContainerStyle={styles.listContent}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingTop: Gap.sm,
    paddingBottom: Gap.lg,
    paddingHorizontal: Gap.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(14,14,14,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.5,
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
    borderRadius: radius.lg,
    padding: Gap.base,
    marginBottom: Gap.md,
    borderWidth: 0.5,
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
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    flex: 1,
  },

  // Meta
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Gap.sm,
  },
  overduePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: Gap.sm,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  overdueText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: '#991B1B',
  },
  metaText: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },

  // Submit button
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    marginTop: Gap.md,
    height: 36,
    backgroundColor: colors.campusCartelGreen,
    borderRadius: 10,
    paddingHorizontal: Gap.lg,
    alignSelf: 'flex-start',
  },
  submitBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },

  // Earned row
  earnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    marginTop: Gap.sm,
  },
  earnedText: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.success,
  },

  // Reject note
  rejectNote: {
    fontSize: FontSize.small,
    color: colors.error,
    marginTop: Gap.sm,
    lineHeight: 20,
  },
});
