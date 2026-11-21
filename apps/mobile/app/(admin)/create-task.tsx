import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createApiClient } from '@upshot/api-client';
import type { TaskTargetGroup } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { Button, Input } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

const TARGET_GROUPS: { value: TaskTargetGroup; label: string }[] = [
  { value: 'campus_cartel', label: 'Campus Cartel' },
  { value: 'students', label: 'Students' },
  { value: 'ambassadors', label: 'Ambassadors' },
];

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdminCreateTask() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetGroup, setTargetGroup] = useState<TaskTargetGroup>('campus_cartel');
  const [coinReward, setCoinReward] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!user) return;
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation', 'Description is required.');
      return;
    }
    const coins = parseInt(coinReward, 10);
    if (!coinReward.trim() || isNaN(coins) || coins <= 0) {
      Alert.alert('Validation', 'Please enter a valid coin reward.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.tasks.createTask(user.id, {
        title: title.trim(),
        description: description.trim(),
        target_group: targetGroup,
        coin_value: coins,
        due_date: formatDate(dueDate),
      });

      if (result.error) {
        showError(result.error);
      } else {
        Alert.alert('Success', 'Task created successfully!', [
          {
            text: 'OK',
            // replace, not back: the form should not sit in the stack behind the
            // list, and back() depended on where the user happened to come from.
            // The list reloads itself on focus, so the new task is there.
            onPress: () => router.replace('/(admin)/tasks'),
          },
        ]);
      }
    } catch (e) {
      console.error('[CREATE_TASK] exception:', e);
      showError(e, { context: 'Failed to create task' });
    } finally {
      setSubmitting(false);
    }
  }, [user, title, description, targetGroup, coinReward, dueDate, router]);

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Lime liquid header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
          <View style={[styles.headerRow, columnStyle]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={20} color={colors.ink} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Create Task</Text>
              <Text style={styles.headerSubtitle}>Assign a new task and reward</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, columnStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Task details */}
          <Text style={styles.sectionLabel}>Task Details</Text>
          <View style={styles.card}>
            <Input
              label="Title *"
              placeholder="Task title"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
            />
            <Input
              label="Description *"
              placeholder="Describe what needs to be done..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Audience */}
          <Text style={styles.sectionLabel}>Assign To</Text>
          <View style={styles.card}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Assign To *</Text>
              <View style={styles.pickerRow}>
                {TARGET_GROUPS.map((group) => (
                  <TouchableOpacity
                    key={group.value}
                    style={[
                      styles.pickerOption,
                      targetGroup === group.value && styles.pickerOptionActive,
                    ]}
                    onPress={() => setTargetGroup(group.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        targetGroup === group.value && styles.pickerOptionTextActive,
                      ]}
                    >
                      {group.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Reward & date */}
          <Text style={styles.sectionLabel}>Reward & Due Date</Text>
          <View style={styles.card}>
            <Input
              label="Coin Reward *"
              placeholder="e.g. 50"
              value={coinReward}
              onChangeText={setCoinReward}
              keyboardType="numeric"
            />

            <View style={styles.pickerWrapperLast}>
              <Text style={styles.pickerLabel}>Due Date *</Text>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowDatePicker(!showDatePicker)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.dateBtnText}>{formatDateDisplay(dueDate)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date()}
                  onChange={(_event: any, selectedDate: Date | undefined) => {
                    if (selectedDate) setDueDate(selectedDate);
                  }}
                />
              )}
            </View>
          </View>

          <Button
            title="Create Task"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(14,14,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.7,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: '#2c3326',
    marginTop: 3,
    fontWeight: Font.semibold,
  },
  scrollContent: {
    padding: Gap.base,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Gap.sm,
    marginLeft: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.base,
    marginBottom: Gap.lg,
    ...shadow.sm,
  },
  pickerWrapper: {
    marginBottom: Gap.base,
  },
  pickerWrapperLast: {
    marginBottom: 0,
  },
  pickerLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.medium,
    color: colors.text,
    marginBottom: 6,
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.sm,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  pickerOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerOptionText: {
    fontSize: FontSize.small,
    fontWeight: Font.medium,
    color: colors.textSecondary,
  },
  pickerOptionTextActive: {
    color: colors.onPrimary,
    fontWeight: Font.bold,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dateBtnText: {
    fontSize: FontSize.body,
    color: colors.text,
  },
  submitBtn: {
    marginTop: Gap.md,
  },
});
