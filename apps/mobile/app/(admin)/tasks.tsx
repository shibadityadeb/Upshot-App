import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Task } from '@upshot/types';
import { colors, DarkBg, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import {
  Button,
  Card,
  CoinBadge,
  EmptyState,
  FilterPills,
  StatusBadge,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

type TaskFilter = 'all' | 'assigned' | 'submitted' | 'approved' | 'rejected';

const TASK_FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function AdminTasks() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const result = await api.tasks.getAllTasksAdmin();
      if (result.data) setTasks(result.data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadTasks();
  }, [loadTasks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTasks();
  }, [loadTasks]);

  const handleApprove = useCallback(
    async (taskId: string) => {
      if (!user) return;
      setActionLoading(taskId + 'approve');
      try {
        const result = await api.tasks.reviewTask(taskId, user.id, true);
        if (result.error) Alert.alert('Error', result.error.message);
        else await loadTasks();
      } finally {
        setActionLoading(null);
      }
    },
    [user, loadTasks],
  );

  const handleReject = useCallback(
    (taskId: string) => {
      if (!user) return;
      if (Platform.OS === 'ios') {
        Alert.prompt('Reject Task', 'Enter a review note (optional)', async (note) => {
          setActionLoading(taskId + 'reject');
          try {
            const result = await api.tasks.reviewTask(taskId, user.id, false, note ?? undefined);
            if (result.error) Alert.alert('Error', result.error.message);
            else await loadTasks();
          } finally {
            setActionLoading(null);
          }
        }, 'plain-text');
      } else {
        Alert.alert('Reject Task', 'Task will be rejected.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: async () => {
              setActionLoading(taskId + 'reject');
              try {
                await api.tasks.reviewTask(taskId, user.id, false);
                await loadTasks();
              } finally {
                setActionLoading(null);
              }
            },
          },
        ]);
      }
    },
    [user, loadTasks],
  );

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const pendingCount = tasks.filter((t) => t.status === 'submitted').length;

  const renderTask = ({ item }: { item: Task }) => {
    const isSubmitted = item.status === 'submitted';
    const approvingThis = actionLoading === item.id + 'approve';
    const rejectingThis = actionLoading === item.id + 'reject';
    const isActioning = approvingThis || rejectingThis;

    return (
      <Card style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle} numberOfLines={2}>{item.title}</Text>
          <StatusBadge status={item.status} />
        </View>

        {!!(item as any).description && (
          <Text style={styles.taskDesc} numberOfLines={2}>{(item as any).description}</Text>
        )}

        <View style={styles.taskMeta}>
          <CoinBadge amount={(item as any).coin_value ?? (item as any).coin_reward ?? 0} />
          {!!(item as any).due_date && (
            <View style={styles.dueDateWrap}>
              <Ionicons name="calendar-outline" size={11} color={colors.textSecondary} />
              <Text style={styles.dueDate}>
                Due {new Date((item as any).due_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </Text>
            </View>
          )}
        </View>

        {isSubmitted && (
          <View style={styles.actionRow}>
            <Button
              title="Approve"
              variant="primary"
              size="sm"
              style={styles.actionBtn}
              onPress={() => handleApprove(item.id)}
              disabled={isActioning}
              loading={approvingThis}
            />
            <Button
              title="Reject"
              variant="outline"
              size="sm"
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(item.id)}
              disabled={isActioning}
              loading={rejectingThis}
            />
          </View>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Dark hero header */}
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroTitle}>Tasks</Text>
            <Text style={styles.heroSub}>
              {pendingCount > 0 ? `${pendingCount} pending review` : `${tasks.length} total`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(admin)/create-task' as any)}
            activeOpacity={0.75}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter pills */}
      <FilterPills
        options={TASK_FILTERS.map(f => ({ label: f.label, value: f.key }))}
        activeValue={filter}
        onChange={(v) => setFilter(v as TaskFilter)}
      />

      {/* List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="checkbox-outline"
            title={filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            subtitle={filter === 'all' ? 'Create a task to get started' : 'No tasks match this filter'}
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

  // Hero
  hero: {
    backgroundColor: DarkBg,
    paddingHorizontal: Gap.base,
    paddingTop: 32,
    paddingBottom: 20,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // List
  listContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: 80,
    flexGrow: 1,
  },
  taskCard: {
    marginBottom: Gap.sm,
    padding: Gap.base,
    borderRadius: radius.lg,
    ...shadow.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
    marginBottom: Gap.sm,
  },
  taskTitle: {
    flex: 1,
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    lineHeight: 22,
  },
  taskDesc: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: Gap.sm,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    marginTop: Gap.xs,
  },
  dueDateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginTop: Gap.md,
  },
  actionBtn: {
    flex: 1,
  },
  rejectBtn: {
    borderColor: colors.error,
  },
});
