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
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Task, TaskTargetGroup } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { LoadingScreen, EmptyState } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

function getGroupsForRole(role: string | undefined): TaskTargetGroup[] {
  switch (role) {
    case 'student':
      return ['campus_cartel', 'students'];
    case 'people':
      return ['campus_cartel', 'students'];
    default:
      return ['students'];
  }
}

export default function PeopleTasksScreen() {
  const user = useAuthStore((s) => s.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    try {
      const groups = getGroupsForRole(user.role);
      const [groupResult, myResult] = await Promise.all([
        api.tasks.getTasksForGroup(groups),
        api.tasks.getMyTasks(user.id),
      ]);
      const groupTasks = groupResult.data ?? [];
      const myTasks = myResult.data ?? [];
      const ids = new Set(myTasks.map((t) => t.id));
      const combined = [...myTasks, ...groupTasks.filter((t) => !ids.has(t.id))];
      setTasks(combined);
    } catch {
      // silently fail
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadTasks();
      setLoading(false);
    })();
  }, [loadTasks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, [loadTasks]);

  const handleSubmit = useCallback(
    async (task: Task) => {
      Alert.prompt(
        'Submit Task',
        'Add a note or link for your submission:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: async (text) => {
              setSubmittingId(task.id);
              try {
                const result = await api.tasks.submitTask(task.id, {
                  submission_note: text ?? '',
                });
                if (result.error) {
                  Alert.alert('Error', result.error.message);
                } else {
                  await loadTasks();
                }
              } finally {
                setSubmittingId(null);
              }
            },
          },
        ],
        'plain-text',
      );
    },
    [loadTasks],
  );

  if (loading) return <LoadingScreen />;

  const activeTasks = tasks.filter((t) => t.status === 'assigned');
  const submittedTasks = tasks.filter((t) => t.status === 'submitted');
  const completedTasks = tasks.filter((t) => t.status === 'approved' || t.status === 'rejected');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {tasks.length === 0 && (
          <View style={styles.section}>
            <EmptyState
              iconName="checkbox-outline"
              title="No tasks yet"
              subtitle="Tasks assigned to you will appear here."
            />
          </View>
        )}

        {activeTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Active</Text>
            {activeTasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                  <View style={styles.coinPill}>
                    <Ionicons name="diamond-outline" size={11} color="#92400E" />
                    <Text style={styles.coinText}>{task.coin_value}</Text>
                  </View>
                </View>
                <Text style={styles.taskDesc} numberOfLines={3}>{task.description}</Text>
                {task.due_date && (
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
                    <Text style={styles.metaText}>Due {task.due_date}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => handleSubmit(task)}
                  activeOpacity={0.8}
                  disabled={submittingId === task.id}
                >
                  <Text style={styles.submitBtnText}>
                    {submittingId === task.id ? 'Submitting...' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {submittedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Under Review</Text>
            {submittedTasks.map((task) => (
              <View key={task.id} style={[styles.taskCard, styles.taskCardMuted]}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>Submitted</Text>
                  </View>
                </View>
                <Text style={styles.taskDesc} numberOfLines={2}>{task.description}</Text>
              </View>
            ))}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Completed</Text>
            {completedTasks.map((task) => {
              const approved = task.status === 'approved';
              return (
                <View key={task.id} style={[styles.taskCard, styles.taskCardMuted]}>
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                    <View style={[styles.statusPill, { backgroundColor: approved ? colors.success + '18' : colors.error + '18' }]}>
                      <Text style={[styles.statusText, { color: approved ? colors.success : colors.error }]}>
                        {approved ? 'Approved' : 'Rejected'}
                      </Text>
                    </View>
                  </View>
                  {approved && (
                    <View style={styles.metaRow}>
                      <Ionicons name="diamond" size={12} color="#92400E" />
                      <Text style={styles.metaText}>+{task.coin_value} coins earned</Text>
                    </View>
                  )}
                  {task.review_note && (
                    <Text style={styles.taskDesc}>Note: {task.review_note}</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: colors.text,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.lg,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Gap.md,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: Gap.base,
    marginBottom: Gap.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  taskCardMuted: {
    opacity: 0.85,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
  },
  taskTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    flex: 1,
  },
  taskDesc: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  coinPill: {
    backgroundColor: '#FEF3C7',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: '#92400E',
  },
  statusPill: {
    backgroundColor: colors.primary + '18',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  submitBtn: {
    marginTop: Gap.md,
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Gap.xl,
  },
  submitBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },
});
