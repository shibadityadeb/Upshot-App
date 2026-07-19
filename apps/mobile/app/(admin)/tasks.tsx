import React, { useCallback, useState } from 'react';
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
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Task } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import {
  AvatarCircle,
  Button,
  Card,
  CoinBadge,
  EmptyState,
  FilterPills,
  StatusBadge,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

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
      if (result.error) {
        console.warn('Tasks load error:', result.error);
      }
      setTasks(result.data ?? []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadTasks();
    }, [loadTasks]),
  );

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
        if (result.error) showError(result.error);
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
            if (result.error) showError(result.error);
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

  const handleDelete = useCallback(
    (task: Task) => {
      Alert.alert(
        'Delete Task',
        `Delete "${task.title}"? This removes it for everyone and cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              setActionLoading(task.id + 'delete');
              try {
                const result = await api.tasks.deleteTask(task.id);
                if (result.error) showError(result.error);
                else await loadTasks();
              } finally {
                setActionLoading(null);
              }
            },
          },
        ],
      );
    },
    [loadTasks],
  );

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const pendingCount = tasks.filter((t) => t.status === 'submitted').length;

  const renderTask = ({ item }: { item: Task }) => {
    const isSubmitted = item.status === 'submitted';
    const approvingThis = actionLoading === item.id + 'approve';
    const rejectingThis = actionLoading === item.id + 'reject';
    const deletingThis = actionLoading === item.id + 'delete';
    const isActioning = approvingThis || rejectingThis || deletingThis;
    const assignee = item.assignee;
    const assigneeName = assignee?.full_name ?? 'Unknown User';

    return (
      <Card style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.taskHeaderRight}>
            <StatusBadge status={item.status} />
            <TouchableOpacity
              onPress={() => handleDelete(item)}
              activeOpacity={0.6}
              disabled={isActioning}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {deletingThis ? (
                <ActivityIndicator size="small" color={colors.error} />
              ) : (
                <Ionicons name="trash-outline" size={16} color={colors.error} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Assignee row */}
        <View style={styles.assigneeRow}>
          <AvatarCircle name={assigneeName} size={24} avatarUrl={assignee?.avatar_url} />
          <Text style={styles.assigneeName}>{assigneeName}</Text>
          {!!item.target_group && (
            <View style={styles.groupBadge}>
              <Text style={styles.groupBadgeText}>
                {item.target_group.replace(/_/g, ' ')}
              </Text>
            </View>
          )}
        </View>

        {!!item.description && (
          <Text style={styles.taskDesc} numberOfLines={2}>{item.description}</Text>
        )}

        <View style={styles.taskMeta}>
          <CoinBadge amount={item.coin_value ?? 0} />
          {!!item.due_date && (
            <View style={styles.dueDateWrap}>
              <Ionicons name="calendar-outline" size={11} color={colors.textSecondary} />
              <Text style={styles.dueDate}>
                Due {new Date(item.due_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Submission details for submitted tasks */}
        {isSubmitted && (
          <View style={styles.submissionArea}>
            <Text style={styles.submissionByLabel}>Submitted by: {assigneeName}</Text>
            {!!item.submission_note && (
              <Text style={styles.submissionNote} numberOfLines={3}>
                {item.submission_note}
              </Text>
            )}
            {!!item.submitted_at && (
              <Text style={styles.submissionDate}>
                {new Date(item.submitted_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </View>
        )}

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
        style={styles.listArea}
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
    backgroundColor: colors.primary,
  },
  listArea: {
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
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: FontSize.small,
    color: 'rgba(14,14,14,0.6)',
    marginTop: 2,
    fontWeight: Font.medium,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.ink,
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
  taskHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Gap.sm,
  },
  assigneeName: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.text,
    flex: 1,
  },
  groupBadge: {
    backgroundColor: '#EDE9FE',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  groupBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
    color: '#6D28D9',
    textTransform: 'capitalize',
  },
  submissionArea: {
    backgroundColor: colors.success + '0D',
    borderRadius: radius.md,
    padding: Gap.sm,
    marginTop: Gap.sm,
    gap: 4,
  },
  submissionByLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: '#065F46',
  },
  submissionNote: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  submissionDate: {
    fontSize: FontSize.xs,
    color: colors.textLight,
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
