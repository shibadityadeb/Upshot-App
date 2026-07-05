import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createApiClient } from '@upshot/api-client';
import type { TaskTargetGroup } from '@upshot/types';
import { colors, Font, FontSize, Gap } from '../../src/constants/theme';
import { Button, Input } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

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
      console.log('[CREATE_TASK] payload:', {
        adminId: user.id,
        title: title.trim(),
        target_group: targetGroup,
        coin_value: coins,
        due_date: formatDate(dueDate),
      });
      const result = await api.tasks.createTask(user.id, {
        title: title.trim(),
        description: description.trim(),
        target_group: targetGroup,
        coin_value: coins,
        due_date: formatDate(dueDate),
      });

      console.log('[CREATE_TASK] result:', JSON.stringify(result));
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        Alert.alert('Success', 'Task created successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (e) {
      console.error('[CREATE_TASK] exception:', e);
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  }, [user, title, description, targetGroup, coinReward, dueDate, router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Create Task</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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

          {/* Target Group Picker */}
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

          <Input
            label="Coin Reward *"
            placeholder="e.g. 50"
            value={coinReward}
            onChangeText={setCoinReward}
            keyboardType="numeric"
          />

          {/* Date Picker */}
          <View style={styles.pickerWrapper}>
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

          <Button
            title="Create Task"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    padding: Gap.base,
    paddingBottom: 100,
  },
  pickerWrapper: {
    marginBottom: Gap.base,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
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
    color: '#FFFFFF',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
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
