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
import { createApiClient } from '@upshot/api-client';
import { colors, Font, FontSize, Gap } from '../../src/constants/theme';
import { Button, Input } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

export default function AdminCreateTask() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coinReward, setCoinReward] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taskType, setTaskType] = useState('');
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
    if (!dueDate.trim()) {
      Alert.alert('Validation', 'Due date is required.');
      return;
    }
    if (!taskType.trim()) {
      Alert.alert('Validation', 'Task type is required.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.tasks.createTask(user.id, {
        title: title.trim(),
        description: description.trim(),
        coin_reward: coins,
        due_date: dueDate.trim(),
        task_type: taskType.trim(),
      } as any);

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        Alert.alert('Success', 'Task created successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } finally {
      setSubmitting(false);
    }
  }, [user, title, description, coinReward, dueDate, taskType, router]);

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
          <Input
            label="Coin Reward *"
            placeholder="e.g. 50"
            value={coinReward}
            onChangeText={setCoinReward}
            keyboardType="numeric"
          />
          <Input
            label="Due Date *"
            placeholder="YYYY-MM-DD"
            value={dueDate}
            onChangeText={setDueDate}
            keyboardType="numbers-and-punctuation"
          />
          <Input
            label="Task Type *"
            placeholder="e.g. content, outreach, design"
            value={taskType}
            onChangeText={setTaskType}
            autoCapitalize="none"
          />

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
  submitBtn: {
    marginTop: Gap.md,
  },
});
