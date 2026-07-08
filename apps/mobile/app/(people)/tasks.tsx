import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApiClient } from '@upshot/api-client';
import type { Task, TaskTargetGroup } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { LoadingScreen, EmptyState } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { uploadEventImage } from '../../src/utils/uploadEventImage';

const api = createApiClient();

const SEEN_APPROVALS_KEY = 'seen_approved_task_ids';

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
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  // Submission form state
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [submissionImageUri, setSubmissionImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Celebration modal state
  const [celebrationTask, setCelebrationTask] = useState<Task | null>(null);
  const [celebrationScale] = useState(new Animated.Value(0));

  // Check Campus Cartel membership first
  useEffect(() => {
    if (!user?.id) return;
    api.campusCartel.isMember(user.id).then(setIsMember).catch(() => setIsMember(false));
  }, [user]);

  const loadTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      const groups = getGroupsForRole(user.role);
      const [groupResult, myResult] = await Promise.all([
        api.tasks.getTasksForGroup(groups, user.id),
        api.tasks.getMyTasks(user.id),
      ]);
      const groupTasks = groupResult.data ?? [];
      const myTasks = myResult.data ?? [];
      const ids = new Set(myTasks.map((t) => t.id));
      const combined = [...myTasks, ...groupTasks.filter((t) => !ids.has(t.id))];
      setTasks(combined);
      return combined;
    } catch {
      return [];
    }
  }, [user]);

  // Check for newly approved tasks and show celebration
  const checkForApprovals = useCallback(async (taskList: Task[]) => {
    if (!taskList || taskList.length === 0) return;
    try {
      const seenRaw = await AsyncStorage.getItem(SEEN_APPROVALS_KEY);
      const seenIds: string[] = seenRaw ? JSON.parse(seenRaw) : [];
      const seenSet = new Set(seenIds);

      const newlyApproved = taskList.filter(
        (t) => t.status === 'approved' && !seenSet.has(t.id),
      );

      if (newlyApproved.length > 0) {
        // Show celebration for the first newly approved task
        setCelebrationTask(newlyApproved[0]);
        Animated.spring(celebrationScale, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }).start();

        // Mark all as seen
        const allApprovedIds = taskList
          .filter((t) => t.status === 'approved')
          .map((t) => t.id);
        await AsyncStorage.setItem(SEEN_APPROVALS_KEY, JSON.stringify(allApprovedIds));
      }
    } catch {
      // ignore storage errors
    }
  }, [celebrationScale]);

  const dismissCelebration = useCallback(() => {
    Animated.timing(celebrationScale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setCelebrationTask(null));
  }, [celebrationScale]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const loaded = await loadTasks();
      setLoading(false);
      if (loaded) checkForApprovals(loaded);
    })();
  }, [loadTasks, checkForApprovals]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const loaded = await loadTasks();
    setRefreshing(false);
    if (loaded) checkForApprovals(loaded);
  }, [loadTasks, checkForApprovals]);

  // ─── Image picker ───────────────────────────────────────
  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access in Settings to attach photos.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setSubmissionImageUri(result.assets[0].uri);
    }
  }, []);

  // ─── Submit task with photo ─────────────────────────────
  const handleSubmit = useCallback(
    async (task: Task) => {
      if (!submissionNote.trim()) {
        Alert.alert('Required', 'Please describe what you did for this task.');
        return;
      }
      if (!user?.id) return;

      setSubmitting(true);
      try {
        let imageUrl: string | null = null;
        if (submissionImageUri) {
          imageUrl = await uploadEventImage(submissionImageUri, user.id);
        }

        const result = await api.tasks.submitTask(task.id, {
          submission_note: submissionNote.trim(),
          submission_url: imageUrl ?? undefined,
        }, user.id);
        if (result.error) {
          Alert.alert('Error', result.error.message);
        } else {
          Alert.alert('Submitted!', 'Your task has been sent for admin review.');
          setExpandedTaskId(null);
          setSubmissionNote('');
          setSubmissionImageUri(null);
          await loadTasks();
        }
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Failed to submit task.');
      } finally {
        setSubmitting(false);
      }
    },
    [submissionNote, submissionImageUri, user?.id, loadTasks],
  );

  if (loading || isMember === null) return <LoadingScreen />;

  // Non-members see a join prompt instead of tasks
  if (!isMember) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tasks</Text>
        </View>
        <View style={styles.gateContainer}>
          <EmptyState
            iconName="shield-checkmark-outline"
            title="Campus Cartel members only"
            subtitle="Join Campus Cartel to access assignments and earn coins"
            action={
              <TouchableOpacity
                style={styles.joinBtn}
                onPress={() => router.push('/(people)/campus-cartel' as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.joinBtnText}>Join Campus Cartel</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  const activeTasks = tasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress');
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
            {activeTasks.map((task) => {
              const isExpanded = expandedTaskId === task.id;
              return (
                <View key={task.id} style={styles.taskCard}>
                  <TouchableOpacity
                    style={styles.taskHeaderRow}
                    onPress={() => {
                      if (isExpanded) {
                        setExpandedTaskId(null);
                        setSubmissionNote('');
                        setSubmissionImageUri(null);
                      } else {
                        setExpandedTaskId(task.id);
                        setSubmissionNote('');
                        setSubmissionImageUri(null);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.taskHeaderLeft}>
                      <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                      <View style={styles.taskMetaRow}>
                        <View style={styles.coinPill}>
                          <Ionicons name="diamond-outline" size={11} color="#92400E" />
                          <Text style={styles.coinText}>{task.coin_value}</Text>
                        </View>
                        {task.due_date && (
                          <View style={styles.duePill}>
                            <Ionicons name="calendar-outline" size={10} color={colors.textSecondary} />
                            <Text style={styles.dueText}>{task.due_date}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.expandedArea}>
                      <Text style={styles.taskDesc}>{task.description}</Text>

                      <View style={styles.submissionForm}>
                        <Text style={styles.submissionLabel}>Submit your work</Text>
                        <TextInput
                          style={styles.submissionInput}
                          placeholder="Describe what you did..."
                          placeholderTextColor={colors.textLight}
                          value={submissionNote}
                          onChangeText={setSubmissionNote}
                          multiline
                          numberOfLines={3}
                          textAlignVertical="top"
                        />

                        <TouchableOpacity
                          style={styles.imagePickerBtn}
                          onPress={pickImage}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="camera-outline" size={18} color={colors.primary} />
                          <Text style={styles.imagePickerText}>
                            {submissionImageUri ? 'Change Photo' : 'Attach Photo / Screenshot'}
                          </Text>
                        </TouchableOpacity>

                        {submissionImageUri && (
                          <View style={styles.imagePreviewContainer}>
                            <Image
                              source={{ uri: submissionImageUri }}
                              style={styles.imagePreview}
                              resizeMode="cover"
                            />
                            <TouchableOpacity
                              style={styles.removeImageBtn}
                              onPress={() => setSubmissionImageUri(null)}
                            >
                              <Ionicons name="close-circle" size={22} color={colors.error} />
                            </TouchableOpacity>
                          </View>
                        )}

                        <TouchableOpacity
                          style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                          onPress={() => handleSubmit(task)}
                          activeOpacity={0.8}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <Text style={styles.submitBtnText}>Uploading...</Text>
                          ) : (
                            <>
                              <Ionicons name="send" size={14} color="#FFFFFF" />
                              <Text style={styles.submitBtnText}>Submit Task</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {submittedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Under Review</Text>
            {submittedTasks.map((task) => (
              <View key={task.id} style={[styles.taskCard, styles.taskCardMuted]}>
                <View style={styles.taskHeaderRow}>
                  <View style={styles.taskHeaderLeft}>
                    <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                    <View style={styles.taskMetaRow}>
                      <View style={styles.statusPill}>
                        <Ionicons name="time-outline" size={10} color={colors.primary} />
                        <Text style={styles.statusText}>Under Review</Text>
                      </View>
                      <View style={styles.coinPill}>
                        <Ionicons name="diamond-outline" size={11} color="#92400E" />
                        <Text style={styles.coinText}>{task.coin_value}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                {task.submission_note && (
                  <View style={styles.submittedNoteArea}>
                    <Text style={styles.submittedNoteLabel}>Your submission:</Text>
                    <Text style={styles.submittedNoteText} numberOfLines={2}>{task.submission_note}</Text>
                  </View>
                )}
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
                  <View style={styles.taskHeaderRow}>
                    <View style={styles.taskHeaderLeft}>
                      <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                      <View style={styles.taskMetaRow}>
                        <View style={[styles.statusPill, { backgroundColor: approved ? colors.success + '18' : colors.error + '18' }]}>
                          <Ionicons
                            name={approved ? 'checkmark-circle' : 'close-circle'}
                            size={10}
                            color={approved ? colors.success : colors.error}
                          />
                          <Text style={[styles.statusText, { color: approved ? colors.success : colors.error }]}>
                            {approved ? 'Approved' : 'Rejected'}
                          </Text>
                        </View>
                        {approved && (
                          <View style={styles.earnedPill}>
                            <Ionicons name="diamond" size={11} color="#92400E" />
                            <Text style={styles.coinText}>+{task.coin_value} earned</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  {task.review_note && (
                    <View style={styles.submittedNoteArea}>
                      <Text style={styles.submittedNoteLabel}>Review note:</Text>
                      <Text style={styles.submittedNoteText}>{task.review_note}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ─── Celebration Modal ─────────────────────────────── */}
      <Modal
        visible={!!celebrationTask}
        transparent
        animationType="fade"
        onRequestClose={dismissCelebration}
      >
        <View style={styles.celebrationOverlay}>
          <Animated.View
            style={[
              styles.celebrationCard,
              { transform: [{ scale: celebrationScale }] },
            ]}
          >
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationTitle}>Congratulations!</Text>
            <Text style={styles.celebrationSubtitle}>
              Your task "{celebrationTask?.title}" has been approved!
            </Text>
            <View style={styles.celebrationCoinsRow}>
              <Ionicons name="diamond" size={22} color="#92400E" />
              <Text style={styles.celebrationCoinsText}>
                +{celebrationTask?.coin_value} coins earned
              </Text>
            </View>
            <TouchableOpacity
              style={styles.celebrationBtn}
              onPress={dismissCelebration}
              activeOpacity={0.8}
            >
              <Text style={styles.celebrationBtnText}>Awesome!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
    marginBottom: Gap.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.sm,
  },
  taskCardMuted: {
    opacity: 0.85,
  },
  taskHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Gap.base,
    gap: Gap.sm,
  },
  taskHeaderLeft: {
    flex: 1,
    gap: 6,
  },
  taskTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    flexWrap: 'wrap',
  },
  taskDesc: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: Gap.md,
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
  earnedPill: {
    backgroundColor: '#FEF3C7',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dueText: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  statusPill: {
    backgroundColor: colors.primary + '18',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
    color: colors.primary,
  },
  expandedArea: {
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.base,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: Gap.md,
  },
  submittedNoteArea: {
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.md,
  },
  submittedNoteLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
    color: colors.textLight,
    marginBottom: 2,
  },
  submittedNoteText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Submission form
  submissionForm: {
    gap: 10,
  },
  submissionLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.text,
  },
  submissionInput: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: FontSize.body,
    color: colors.text,
    minHeight: 80,
  },
  imagePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary + '0D',
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    fontSize: FontSize.small,
    color: colors.primary,
    fontWeight: Font.semibold,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: Gap.xl,
    ...shadow.sm,
  },
  submitBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },

  // Celebration modal
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...shadow.lg,
  },
  celebrationEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: Font.black,
    color: colors.text,
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  celebrationCoinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  celebrationCoinsText: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: '#92400E',
  },
  celebrationBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    ...shadow.sm,
  },
  celebrationBtnText: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },

  // Membership gate
  gateContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Gap.base,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    height: 44,
    backgroundColor: colors.campusCartelGreen,
    borderRadius: 10,
    paddingHorizontal: Gap.xl,
  },
  joinBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },
});
