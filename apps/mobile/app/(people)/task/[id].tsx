import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { Task } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../../src/constants/theme';
import { Button, Input, StatusBadge, CoinBadge, EmptyState } from '../../../src/components/common';
import { useAuthStore } from '../../../src/store/auth.store';
import { showError } from '../../../src/store/error.store';

const api = createApiClient();

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Submission form
  const [proofLink, setProofLink] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [linkError, setLinkError] = useState('');

  // Gate: CC membership check — ambassadors get tasks without cartel membership
  useEffect(() => {
    if (!user?.id || user.role === 'ambassador') return;
    api.campusCartel.isMember(user.id).then((m) => {
      if (!m) {
        Alert.alert('Members only', 'Join Campus Cartel to access assignments');
        router.replace('/(people)/campus-cartel' as any);
      }
    }).catch(() => {});
  }, [user]);

  const loadTask = useCallback(async () => {
    if (!id) return;
    try {
      const result = await api.tasks.getTaskById(id);
      if (result.data) {
        // Verify ownership
        if (result.data.assigned_to && result.data.assigned_to !== user?.id) {
          Alert.alert('Access denied', 'This task is not assigned to you');
          router.back();
          return;
        }
        setTask(result.data);
      } else {
        Alert.alert('Not found', 'Task not found');
        router.back();
      }
    } catch {
      showError(null, { context: 'Failed to load task' });
      router.back();
    }
  }, [id, user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadTask();
      setLoading(false);
    })();
  }, [loadTask]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTask();
    setRefreshing(false);
  }, [loadTask]);

  const handleSubmit = async () => {
    if (!task || !user) return;

    // Validate proof link
    const trimmedLink = proofLink.trim();
    if (!trimmedLink) {
      setLinkError('Proof link is required');
      return;
    }
    if (!trimmedLink.startsWith('http')) {
      setLinkError('Link must start with http');
      return;
    }
    setLinkError('');

    setSubmitting(true);
    try {
      const result = await api.tasks.submitTask(task.id, {
        submission_url: trimmedLink,
        submission_note: notes.trim() || undefined,
      }, user.id);

      if (result.error) {
        showError(result.error);
      } else {
        setSubmitted(true);
        setTask(result.data);
      }
    } catch {
      showError(null, { context: 'Failed to submit' });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.campusCartelGreen} />
      </View>
    );
  }

  if (!task) return null;

  const canSubmit =
    task.status === 'assigned' ||
    task.status === 'in_progress' ||
    task.status === 'rejected';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.campusCartelGreen} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.ink} />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>ASSIGNMENT</Text>
        </View>

        {/* Task info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{task.title}</Text>
            <CoinBadge amount={task.coin_value} />
          </View>

          <View style={styles.metaStrip}>
            <StatusBadge status={task.status} />
            {task.due_date && (
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.metaText}>
                  Due {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{task.description}</Text>

          {task.event_id && (
            <TouchableOpacity
              style={styles.eventLink}
              onPress={() => router.push(`/(people)/apply/${task.event_id}` as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="link-outline" size={14} color={colors.primary} />
              <Text style={styles.eventLinkText}>View linked event</Text>
            </TouchableOpacity>
          )}

          {/* Status-based content */}
          {task.status === 'approved' && (
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.successTitle}>Earned {task.coin_value} coins</Text>
              <Text style={styles.successSub}>This assignment has been approved</Text>
            </View>
          )}

          {task.status === 'submitted' && !submitted && (
            <View style={styles.reviewCard}>
              <Ionicons name="time-outline" size={24} color={colors.warning} />
              <Text style={styles.reviewTitle}>Under review by admin</Text>
              <Text style={styles.reviewSub}>You'll be notified once reviewed</Text>
            </View>
          )}

          {submitted && (
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.successTitle}>Submitted!</Text>
              <Text style={styles.successSub}>Admin will review your submission</Text>
            </View>
          )}

          {/* Submission form */}
          {canSubmit && !submitted && (
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Submit your work</Text>

              <Input
                label="Proof link (required)"
                placeholder="https://..."
                value={proofLink}
                onChangeText={(t) => {
                  setProofLink(t);
                  setLinkError('');
                }}
                keyboardType="url"
                autoCapitalize="none"
                error={linkError || undefined}
              />

              <Input
                label="Notes (optional)"
                placeholder="Any additional context..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />

              <Button
                title={submitting ? 'Submitting...' : 'Submit assignment'}
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting}
                style={{ backgroundColor: colors.campusCartelGreen }}
              />
            </View>
          )}

          {task.status === 'rejected' && task.review_note && (
            <View style={styles.rejectCard}>
              <Text style={styles.rejectLabel}>Review feedback</Text>
              <Text style={styles.rejectNote}>{task.review_note}</Text>
            </View>
          )}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
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
  headerLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(14,14,14,0.7)',
    letterSpacing: 2,
  },

  // Content
  content: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: colors.text,
    flex: 1,
    lineHeight: 28,
  },
  metaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    marginTop: Gap.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
  },
  description: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: Gap.lg,
  },
  eventLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    marginTop: Gap.md,
  },
  eventLinkText: {
    fontSize: FontSize.body,
    color: colors.ink,
    fontWeight: Font.bold,
  },

  // Success card
  successCard: {
    backgroundColor: colors.campusCartelTint,
    borderRadius: radius.lg,
    padding: Gap.lg,
    alignItems: 'center',
    gap: Gap.sm,
    marginTop: Gap.xl,
  },
  successTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.campusCartelText,
  },
  successSub: {
    fontSize: FontSize.body,
    color: colors.campusCartelText,
  },

  // Review card
  reviewCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.lg,
    padding: Gap.lg,
    alignItems: 'center',
    gap: Gap.sm,
    marginTop: Gap.xl,
  },
  reviewTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: '#92400E',
  },
  reviewSub: {
    fontSize: FontSize.body,
    color: '#92400E',
  },

  // Form
  formSection: {
    marginTop: Gap.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: Gap.lg,
    ...shadow.sm,
  },
  formTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: Gap.lg,
  },

  // Reject card
  rejectCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: radius.lg,
    padding: Gap.base,
    marginTop: Gap.lg,
  },
  rejectLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.error,
    letterSpacing: 1,
    marginBottom: Gap.xs,
  },
  rejectNote: {
    fontSize: FontSize.body,
    color: '#991B1B',
    lineHeight: 20,
  },
});
