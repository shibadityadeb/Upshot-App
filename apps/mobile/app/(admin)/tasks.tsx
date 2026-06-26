import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import type { Task, User } from '@upshot/types';
import { colors, spacing, radius, shadow } from '../../src/constants/theme';
import {
  Button,
  Card,
  CoinBadge,
  EmptyState,
  Input,
  LoadingScreen,
  StatusBadge,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

type ActiveTab = 'assignments' | 'bonus';
type TaskFilter = 'all' | 'assigned' | 'submitted' | 'approved' | 'rejected';

const TASK_FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

interface AssigneeProfile {
  full_name: string;
  email: string;
}

// ─── Assignments Tab ─────────────────────────────────────

interface AssignmentsTabProps {
  user: User;
  onCreateTask: () => void;
}

function AssignmentsTab({ user, onCreateTask }: AssignmentsTabProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [assigneeMap, setAssigneeMap] = useState<Record<string, AssigneeProfile>>({});

  const loadTasks = useCallback(async () => {
    const result = await api.tasks.getAllTasksAdmin();
    if (result.data) {
      const taskList = result.data;
      setTasks(taskList);

      const userIds = [...new Set(taskList.map((t) => t.assigned_to).filter(Boolean))];
      if (userIds.length > 0) {
        const { data: profiles } = await api.supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        const map = Object.fromEntries(
          ((profiles ?? []) as { id: string; full_name: string; email: string }[]).map((p) => [
            p.id,
            { full_name: p.full_name, email: p.email },
          ]),
        );
        setAssigneeMap(map);
      }
    }
  }, []);

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

  const handleApprove = useCallback(
    async (taskId: string) => {
      setActionLoading(taskId);
      try {
        const result = await api.tasks.reviewTask(taskId, user.id, true);
        if (result.error) {
          Alert.alert('Error', result.error.message);
        } else {
          await loadTasks();
        }
      } finally {
        setActionLoading(null);
      }
    },
    [user.id, loadTasks],
  );

  const handleReject = useCallback(
    (taskId: string) => {
      if (Platform.OS === 'ios') {
        Alert.prompt(
          'Reject Task',
          'Enter a review note (optional)',
          async (note) => {
            setActionLoading(taskId);
            try {
              const result = await api.tasks.reviewTask(taskId, user.id, false, note ?? undefined);
              if (result.error) {
                Alert.alert('Error', result.error.message);
              } else {
                await loadTasks();
              }
            } finally {
              setActionLoading(null);
            }
          },
          'plain-text',
        );
      } else {
        Alert.alert('Reject Task', 'Task will be rejected.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: async () => {
              setActionLoading(taskId);
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
    [user.id, loadTasks],
  );

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const q = search.toLowerCase();
    const assignee = assigneeMap[t.assigned_to];
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (assignee?.full_name ?? '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const renderTask = ({ item }: { item: Task }) => {
    const assignee = assigneeMap[item.assigned_to];
    const isSubmitted = item.status === 'submitted';
    const isActioning = actionLoading === item.id;

    return (
      <Card style={styles.taskCard}>
        <View style={styles.taskRow}>
          <Text style={styles.taskTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.taskAssignee}>
          {assignee?.full_name ?? 'Unknown'}
        </Text>
        <CoinBadge amount={item.coin_value} />
        {!!item.due_date && (
          <Text style={styles.taskDue}>
            Due: {new Date(item.due_date).toLocaleDateString()}
          </Text>
        )}
        {isSubmitted && (
          <View style={styles.actionRow}>
            <Button
              title={isActioning ? '...' : 'Approve'}
              variant="outline"
              size="sm"
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={() => handleApprove(item.id)}
              disabled={isActioning}
            />
            <Button
              title={isActioning ? '...' : 'Reject'}
              variant="outline"
              size="sm"
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(item.id)}
              disabled={isActioning}
            />
          </View>
        )}
      </Card>
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <View style={{ flex: 1 }}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks or assignees..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {TASK_FILTERS.map((opt) => {
          const active = filter === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.filterPill, active && styles.filterPillActive]}
              onPress={() => setFilter(opt.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState title="No tasks found" subtitle="No tasks match this filter" />
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={onCreateTask} activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Create Task Modal ────────────────────────────────────

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
  adminId: string;
}

function CreateTaskModal({ visible, onClose, onCreated, adminId }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignQuery, setAssignQuery] = useState('');
  const [assignSuggestions, setAssignSuggestions] = useState<User[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
  const [coinValue, setCoinValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setAssignQuery('');
    setAssignSuggestions([]);
    setSelectedAssignee(null);
    setCoinValue('');
    setDueDate('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAssignQueryChange = useCallback((text: string) => {
    setAssignQuery(text);
    setSelectedAssignee(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setAssignSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const { data } = await api.supabase
        .from('profiles')
        .select('id, full_name, email')
        .ilike('full_name', `%${text}%`)
        .limit(5);
      setAssignSuggestions((data as User[]) ?? []);
    }, 400);
  }, []);

  const handleSelectAssignee = useCallback((u: User) => {
    setSelectedAssignee(u);
    setAssignQuery(u.full_name ?? '');
    setAssignSuggestions([]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !description.trim() || !selectedAssignee || !coinValue.trim()) {
      Alert.alert('Missing fields', 'Please fill in title, description, assignee and coins.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.tasks.createTask(adminId, {
        title: title.trim(),
        description: description.trim(),
        assigned_to: selectedAssignee.id,
        coin_value: parseInt(coinValue, 10),
        due_date: dueDate.trim() || undefined,
      });
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        resetForm();
        onClose();
        onCreated();
      }
    } finally {
      setSubmitting(false);
    }
  }, [title, description, selectedAssignee, coinValue, dueDate, adminId, resetForm, onClose, onCreated]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Task</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Input
              label="Title *"
              placeholder="Task title"
              value={title}
              onChangeText={setTitle}
            />
            <Input
              label="Description *"
              placeholder="Describe the task..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            {/* Assignee Search */}
            <View style={{ marginBottom: spacing.md }}>
              <Text style={styles.inputLabel}>Assign To *</Text>
              <View style={styles.assignInputContainer}>
                <TextInput
                  style={styles.assignInput}
                  placeholder="Search by name..."
                  placeholderTextColor={colors.textSecondary}
                  value={assignQuery}
                  onChangeText={handleAssignQueryChange}
                  autoCapitalize="words"
                />
              </View>
              {selectedAssignee && (
                <Text style={styles.selectedAssigneeText}>
                  ✓ {selectedAssignee.full_name} ({selectedAssignee.email})
                </Text>
              )}
              {assignSuggestions.length > 0 && (
                <View style={styles.suggestionsBox}>
                  {assignSuggestions.map((u) => (
                    <TouchableOpacity
                      key={u.id}
                      style={styles.suggestionRow}
                      onPress={() => handleSelectAssignee(u)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.suggestionName}>{u.full_name}</Text>
                      <Text style={styles.suggestionEmail}>{u.email}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <Input
              label="Coin Value *"
              placeholder="e.g. 50"
              value={coinValue}
              onChangeText={setCoinValue}
              keyboardType="numeric"
            />
            <Input
              label="Due Date"
              placeholder="YYYY-MM-DD"
              value={dueDate}
              onChangeText={setDueDate}
              keyboardType="numbers-and-punctuation"
            />

            <Button
              title="Create Task"
              onPress={handleSubmit}
              loading={submitting}
              style={{ marginTop: spacing.md }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Bonus Coins Tab ──────────────────────────────────────

interface BonusCoinsTabProps {
  adminId: string;
}

function BonusCoinsTab({ adminId }: BonusCoinsTabProps) {
  const [bonusQuery, setBonusQuery] = useState('');
  const [bonusSuggestions, setBonusSuggestions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusReason, setBonusReason] = useState('');
  const [bonusLoading, setBonusLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback((text: string) => {
    setBonusQuery(text);
    setSelectedUser(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setBonusSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const { data } = await api.supabase
        .from('profiles')
        .select('id, full_name, email')
        .ilike('full_name', `%${text}%`)
        .limit(5);
      setBonusSuggestions((data as User[]) ?? []);
    }, 400);
  }, []);

  const handleSelectUser = useCallback((u: User) => {
    setSelectedUser(u);
    setBonusQuery(u.full_name ?? '');
    setBonusSuggestions([]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedUser) {
      Alert.alert('Missing', 'Please select a user');
      return;
    }
    if (!bonusAmount.trim() || isNaN(parseInt(bonusAmount, 10))) {
      Alert.alert('Invalid amount', 'Please enter a valid coin amount');
      return;
    }
    if (!bonusReason.trim()) {
      Alert.alert('Missing', 'Please enter a reason');
      return;
    }
    setBonusLoading(true);
    try {
      const result = await api.coins.addBonusCoins(
        adminId,
        selectedUser.id,
        parseInt(bonusAmount, 10),
        bonusReason.trim(),
      );
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        Alert.alert('Success', `${bonusAmount} coins added to ${selectedUser.full_name}`);
        setBonusQuery('');
        setBonusSuggestions([]);
        setSelectedUser(null);
        setBonusAmount('');
        setBonusReason('');
      }
    } finally {
      setBonusLoading(false);
    }
  }, [adminId, selectedUser, bonusAmount, bonusReason]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.bonusContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.bonusSectionTitle}>Issue Bonus Coins</Text>

      {/* User Search */}
      <View style={{ marginBottom: spacing.md }}>
        <Text style={styles.inputLabel}>Select User *</Text>
        <View style={styles.assignInputContainer}>
          <TextInput
            style={styles.assignInput}
            placeholder="Search by name..."
            placeholderTextColor={colors.textSecondary}
            value={bonusQuery}
            onChangeText={handleQueryChange}
            autoCapitalize="words"
          />
        </View>
        {selectedUser && (
          <Text style={styles.selectedAssigneeText}>
            ✓ {selectedUser.full_name} ({selectedUser.email})
          </Text>
        )}
        {bonusSuggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            {bonusSuggestions.map((u) => (
              <TouchableOpacity
                key={u.id}
                style={styles.suggestionRow}
                onPress={() => handleSelectUser(u)}
                activeOpacity={0.75}
              >
                <Text style={styles.suggestionName}>{u.full_name}</Text>
                <Text style={styles.suggestionEmail}>{u.email}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Input
        label="Amount (coins) *"
        placeholder="e.g. 100"
        value={bonusAmount}
        onChangeText={setBonusAmount}
        keyboardType="numeric"
      />
      <Input
        label="Reason / Description *"
        placeholder="Why are you issuing these coins?"
        value={bonusReason}
        onChangeText={setBonusReason}
        multiline
        numberOfLines={3}
      />

      <Button
        title="Issue Coins"
        onPress={handleSubmit}
        loading={bonusLoading}
        style={{ marginTop: spacing.sm }}
      />
    </ScrollView>
  );
}

// ─── Main Screen ─────────────────────────────────────────

export default function AdminTasks() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<ActiveTab>('assignments');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  if (!user) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Tab Toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'assignments' && styles.tabPillActive]}
          onPress={() => setActiveTab('assignments')}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabPillText, activeTab === 'assignments' && styles.tabPillTextActive]}>
            Assignments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'bonus' && styles.tabPillActive]}
          onPress={() => setActiveTab('bonus')}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabPillText, activeTab === 'bonus' && styles.tabPillTextActive]}>
            Bonus Coins
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'assignments' ? (
        <AssignmentsTab
          key={reloadKey}
          user={user}
          onCreateTask={() => setShowCreateModal(true)}
        />
      ) : (
        <BonusCoinsTab adminId={user.id} />
      )}

      <CreateTaskModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => setReloadKey((k) => k + 1)}
        adminId={user.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  tabPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  tabPillActive: {
    backgroundColor: colors.primary,
  },
  tabPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabPillTextActive: {
    color: colors.surface,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
    ...shadow.md,
  },
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.surface,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    flexGrow: 1,
  },
  taskCard: {
    marginBottom: 12,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: spacing.sm,
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  taskAssignee: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  taskDue: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
  approveBtn: {
    borderColor: colors.success,
  },
  rejectBtn: {
    borderColor: colors.error,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  fabText: {
    fontSize: 24,
    color: colors.surface,
    fontWeight: '700',
    lineHeight: 28,
  },
  // Modal
  modalSafe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  modalContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  assignInputContainer: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assignInput: {
    fontSize: 15,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  selectedAssigneeText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
    marginTop: 6,
  },
  suggestionsBox: {
    marginTop: 4,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.md,
  },
  suggestionRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  suggestionEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // Bonus Coins
  bonusContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  bonusSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
});
