import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { AmbassadorCode, CreateAmbassadorCodePayload, Vertical } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { verticalColors } from '../../src/constants/theme';
import { Button, Card, EmptyState, Input } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

type FilterKey = 'all' | 'active' | 'claimed' | 'inactive';

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'claimed', label: 'Claimed' },
  { key: 'inactive', label: 'Inactive' },
];

interface VerticalOption {
  id: string | null;
  slug?: string;
  name: string;
  color: string;
  accent: string;
}

const STATIC_VERTICAL_OPTIONS: VerticalOption[] = [
  { id: null, name: 'None', color: colors.border, accent: colors.textSecondary },
  { id: 'unfiltered', slug: 'unfiltered', name: 'Unfiltered', color: verticalColors.unfiltered + '20', accent: verticalColors.unfiltered },
  { id: 'campus-cartel', slug: 'campus-cartel', name: 'Campus Cartel', color: verticalColors.campusCartel + '20', accent: verticalColors.campusCartel },
  { id: 'irise', slug: 'irise', name: 'iRISE', color: verticalColors.irise + '20', accent: verticalColors.irise },
  { id: 'ibelieve', slug: 'ibelieve', name: 'iBelieve', color: verticalColors.ibelieve + '20', accent: verticalColors.ibelieve },
];

export default function AmbassadorCodesScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [codes, setCodes] = useState<AmbassadorCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterKey>('all');

  // DB verticals for slug→id mapping
  const [dbVerticals, setDbVerticals] = useState<Vertical[]>([]);
  const [verticalOptions, setVerticalOptions] = useState<VerticalOption[]>(STATIC_VERTICAL_OPTIONS);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [codeType, setCodeType] = useState<'random' | 'custom'>('random');
  const [customCode, setCustomCode] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<VerticalOption>(STATIC_VERTICAL_OPTIONS[0]);
  const [notes, setNotes] = useState('');
  const [generating, setGenerating] = useState(false);

  // Success state
  const [generatedCode, setGeneratedCode] = useState<AmbassadorCode | null>(null);

  const loadVerticals = useCallback(async () => {
    try {
      const { data } = await (api as any).supabase.from('verticals').select('id, name, slug, color');
      if (data && data.length > 0) {
        setDbVerticals(data as Vertical[]);
        // Build vertical options with real UUIDs
        const mapped: VerticalOption[] = [
          { id: null, name: 'None', color: colors.border, accent: colors.textSecondary },
          ...STATIC_VERTICAL_OPTIONS.slice(1).map((opt) => {
            const dbV = (data as Vertical[]).find((v) => v.slug === opt.slug);
            return {
              ...opt,
              id: dbV ? dbV.id : opt.id,
            };
          }),
        ];
        setVerticalOptions(mapped);
      }
    } catch (e) {
      console.warn('Failed to load verticals', e);
    }
  }, []);

  const loadCodes = useCallback(async () => {
    try {
      const data = await api.ambassadors.getAllCodes();
      setCodes(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadVerticals(), loadCodes()]);
  }, [loadVerticals, loadCodes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCodes();
  }, [loadCodes]);

  const filteredCodes = codes.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'active') return c.is_active && !c.is_claimed;
    if (filter === 'claimed') return c.is_claimed;
    if (filter === 'inactive') return !c.is_active;
    return true;
  });

  const handleGenerate = useCallback(async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const payload: CreateAmbassadorCodePayload = {
        code_type: codeType,
        custom_code: codeType === 'custom' ? customCode : undefined,
        vertical_id: selectedVertical.id ?? undefined,
        notes: notes.trim() || undefined,
      };
      const result = await api.ambassadors.generateCode(user.id, payload);
      setGeneratedCode(result);
      await loadCodes();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to generate code');
    } finally {
      setGenerating(false);
    }
  }, [user, codeType, customCode, selectedVertical, notes, loadCodes]);

  const handleCopy = useCallback(async (code: string) => {
    try {
      await Share.share({ message: code });
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleDeactivate = useCallback((codeId: string, code: string) => {
    Alert.alert(
      'Deactivate Code',
      `Deactivate "${code}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.ambassadors.deactivateCode(codeId);
              await loadCodes();
            } catch (e: any) {
              Alert.alert('Error', e?.message ?? 'Failed to deactivate');
            }
          },
        },
      ],
    );
  }, [loadCodes]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setGeneratedCode(null);
    setCodeType('random');
    setCustomCode('');
    setSelectedVertical(verticalOptions[0]);
    setNotes('');
  }, [verticalOptions]);

  const getVerticalAccent = (code: AmbassadorCode): string => {
    if (!code.vertical) return colors.textSecondary;
    const match = verticalOptions.find((v) => v.id === code.vertical_id);
    return match?.accent ?? colors.textSecondary;
  };

  const getVerticalBg = (code: AmbassadorCode): string => {
    if (!code.vertical) return colors.border;
    const match = verticalOptions.find((v) => v.id === code.vertical_id);
    return match?.color ?? colors.border;
  };

  const renderCode = ({ item }: { item: AmbassadorCode }) => {
    const isActive = item.is_active && !item.is_claimed;
    const isClaimed = item.is_claimed;
    const isInactive = !item.is_active;
    const accent = getVerticalAccent(item);
    const vBg = getVerticalBg(item);

    const statusColor = isClaimed ? colors.success : isActive ? colors.primary : colors.textSecondary;
    const statusLabel = isClaimed ? 'Claimed' : isActive ? 'Active' : 'Inactive';

    const createdDate = new Date(item.created_at).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

    return (
      <Card style={styles.codeCard}>
        <View style={styles.codeHeader}>
          <Text style={styles.codeText}>{item.code}</Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.typeBadge, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.typeBadgeText, { color: colors.primary }]}>
              {item.code_type === 'custom' ? 'Custom' : 'Random'}
            </Text>
          </View>
          {item.vertical && (
            <View style={[styles.verticalBadge, { backgroundColor: vBg }]}>
              <Text style={[styles.verticalBadgeText, { color: accent }]}>
                {(item.vertical as any).name ?? 'Vertical'}
              </Text>
            </View>
          )}
        </View>

        {isClaimed && item.assigned_user && (
          <Text style={styles.claimedBy}>
            Claimed by {(item.assigned_user as any).full_name ?? (item.assigned_user as any).email}
          </Text>
        )}

        {item.notes ? (
          <Text style={styles.notesText} numberOfLines={2}>{item.notes}</Text>
        ) : null}

        <View style={styles.codeFooter}>
          <Text style={styles.issuedDate}>Issued {createdDate}</Text>
          <View style={styles.codeActions}>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() => handleCopy(item.code)}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={14} color={colors.primary} />
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
            {isActive && (
              <TouchableOpacity
                style={styles.deactivateBtn}
                onPress={() => handleDeactivate(item.id, item.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.deactivateBtnText}>Deactivate</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.screenTitle}>Ambassador Codes</Text>
          <Text style={styles.screenSubtitle}>Generate and manage invite codes</Text>
        </View>
      </View>

      {/* Generate Button */}
      <View style={styles.generateContainer}>
        <Button
          title="Generate New Code"
          onPress={() => setModalVisible(true)}
          icon={<Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />}
        />
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTER_OPTIONS.map((opt) => {
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

      {/* Codes List */}
      <FlatList
        data={filteredCodes}
        keyExtractor={(item) => item.id}
        renderItem={renderCode}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="key-outline"
            title="No codes found"
            subtitle="Generate your first ambassador code above"
          />
        }
      />

      {/* Generate Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {generatedCode ? (
              /* Success view */
              <View>
                <Text style={styles.modalTitle}>Code Generated!</Text>
                <Text style={styles.modalSubtitle}>Share this code with your ambassador</Text>

                <View style={styles.generatedCodeBox}>
                  <Text style={styles.generatedCodeText}>{generatedCode.code}</Text>
                  <View style={[styles.statusPill, { backgroundColor: colors.success + '20', marginTop: Gap.sm }]}>
                    <Text style={[styles.statusText, { color: colors.success }]}>Active · Ready to use</Text>
                  </View>
                  {generatedCode.vertical && (
                    <Text style={styles.generatedVertical}>
                      Linked to {(generatedCode.vertical as any).name}
                    </Text>
                  )}
                </View>

                <Button
                  title="Copy Code"
                  variant="outline"
                  onPress={() => handleCopy(generatedCode.code)}
                  icon={<Ionicons name="copy-outline" size={16} color={colors.primary} />}
                  style={styles.modalBtn}
                />
                <Button
                  title="Done"
                  onPress={closeModal}
                  style={styles.modalBtn}
                />
              </View>
            ) : (
              /* Form view */
              <View>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>Generate New Code</Text>
                  <TouchableOpacity onPress={closeModal} activeOpacity={0.7}>
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>Create an ambassador invite code</Text>

                {/* Code type selector */}
                <Text style={styles.sectionLabel}>Code Type</Text>
                <View style={styles.typeRow}>
                  {(['random', 'custom'] as const).map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.typeOption, codeType === t && styles.typeOptionActive]}
                      onPress={() => setCodeType(t)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.typeOptionText, codeType === t && styles.typeOptionTextActive]}>
                        {t === 'random' ? 'Random (UBM-XXXX-XXXX)' : 'Custom'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {codeType === 'custom' && (
                  <Input
                    label="Custom Code"
                    placeholder="e.g. CAMPUS2024"
                    value={customCode}
                    onChangeText={(t) => setCustomCode(t.toUpperCase().replace(/\s+/g, '-'))}
                    autoCapitalize="characters"
                  />
                )}

                {/* Vertical picker */}
                <Text style={styles.sectionLabel}>Link to Vertical (optional)</Text>
                <View style={styles.verticalPicker}>
                  {verticalOptions.map((v) => (
                    <TouchableOpacity
                      key={v.name}
                      style={[
                        styles.verticalChip,
                        { backgroundColor: v.color },
                        selectedVertical.name === v.name && { borderWidth: 2, borderColor: v.accent },
                      ]}
                      onPress={() => setSelectedVertical(v)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.verticalChipText, { color: v.accent }]}>{v.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Input
                  label="Notes (optional)"
                  placeholder="e.g. For campus ambassador program batch 2"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                />

                <Button
                  title="Save to Database"
                  onPress={handleGenerate}
                  loading={generating}
                  disabled={generating || (codeType === 'custom' && customCode.trim().length < 4)}
                  style={styles.modalBtn}
                />
                <Button
                  title="Cancel"
                  variant="ghost"
                  onPress={closeModal}
                  style={styles.modalBtn}
                />
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    paddingHorizontal: Gap.base,
    paddingTop: Gap.base,
    paddingBottom: Gap.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  headerText: {
    flex: 1,
  },
  screenTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: colors.text,
  },
  screenSubtitle: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: 1,
  },
  generateContainer: {
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.sm,
  },
  filterRow: {
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.sm,
    gap: Gap.sm,
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
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.surface,
  },
  listContent: {
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    flexGrow: 1,
  },
  codeCard: {
    marginBottom: Gap.sm,
    padding: Gap.base,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Gap.sm,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    letterSpacing: 1,
    flex: 1,
    marginRight: Gap.sm,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    flexWrap: 'wrap',
    marginBottom: Gap.sm,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  typeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
  },
  verticalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  verticalBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
  },
  claimedBy: {
    fontSize: FontSize.small,
    color: colors.success,
    fontWeight: Font.medium,
    marginBottom: Gap.xs,
  },
  notesText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Gap.xs,
  },
  codeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Gap.sm,
    paddingTop: Gap.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  issuedDate: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  codeActions: {
    flexDirection: 'row',
    gap: Gap.sm,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.primary + '15',
  },
  copyBtnText: {
    fontSize: FontSize.xs,
    color: colors.primary,
    fontWeight: Font.semibold,
  },
  deactivateBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.error + '15',
  },
  deactivateBtnText: {
    fontSize: FontSize.xs,
    color: colors.error,
    fontWeight: Font.semibold,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContent: {
    padding: Gap.xl,
    paddingTop: Gap.xxl,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Gap.sm,
  },
  modalTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    marginBottom: Gap.lg,
  },
  sectionLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.text,
    marginBottom: Gap.sm,
  },
  typeRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginBottom: Gap.base,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.border,
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: colors.primary,
  },
  typeOptionText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  typeOptionTextActive: {
    color: colors.surface,
  },
  verticalPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.sm,
    marginBottom: Gap.base,
  },
  verticalChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  verticalChipText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
  },
  modalBtn: {
    marginTop: Gap.sm,
  },
  generatedCodeBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: Gap.xl,
    alignItems: 'center',
    marginBottom: Gap.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
  },
  generatedCodeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 28,
    fontWeight: Font.bold,
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
  },
  generatedVertical: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: Gap.sm,
  },
});
