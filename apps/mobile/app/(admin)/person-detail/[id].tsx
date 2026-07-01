import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Ambassador, WalletBalance } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../../src/constants/theme';
import {
  AvatarCircle,
  Button,
  Card,
  CoinBadge,
  Divider,
  Input,
  RoleTag,
} from '../../../src/components/common';
import { useAuthStore } from '../../../src/store/auth.store';

const api = createApiClient();

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  role: string;
  phone?: string;
  is_active?: boolean;
  created_at?: string;
}

export default function AdminPersonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const adminUser = useAuthStore((s) => s.user);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bonus coins modal
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusDescription, setBonusDescription] = useState('');
  const [bonusLoading, setBonusLoading] = useState(false);

  // Ambassador actions
  const [ambLoading, setAmbLoading] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [profileRes, balRes, ambRes] = await Promise.all([
        (api as any).supabase.from('profiles').select('*').eq('id', id).single(),
        api.coins.getWalletBalance(id),
        api.ambassadors.getAllAmbassadors(),
      ]);
      if (profileRes.data) setProfile(profileRes.data as Profile);
      else setError('Profile not found');
      if (balRes.data) setBalance(balRes.data);
      if (ambRes.data) {
        const found = ambRes.data.find(
          (a: Ambassador) =>
            a.user_id === id ||
            (a as any).user?.id === id ||
            (a as any).profile?.id === id,
        );
        setAmbassador(found ?? null);
      }
    } catch (e) {
      setError('Failed to load profile');
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handleAddBonus = useCallback(async () => {
    if (!adminUser || !profile) return;
    const amount = parseInt(bonusAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!bonusDescription.trim()) {
      Alert.alert('Missing', 'Please enter a description.');
      return;
    }
    setBonusLoading(true);
    try {
      const result = await api.coins.addBonusCoins(
        adminUser.id,
        profile.id,
        amount,
        bonusDescription.trim(),
      );
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        Alert.alert('Success', `${amount} coins added to ${profile.full_name}`);
        setBonusAmount('');
        setBonusDescription('');
        setShowBonusModal(false);
        await load();
      }
    } finally {
      setBonusLoading(false);
    }
  }, [adminUser, profile, bonusAmount, bonusDescription, load]);

  const handleMakeAmbassador = useCallback(async () => {
    if (!profile) return;
    Alert.alert(
      'Make Ambassador',
      `Make ${profile.full_name} an ambassador?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setAmbLoading(true);
            try {
              const result = await api.ambassadors.createAmbassador(profile.id, profile.full_name);
              if (result.error) {
                Alert.alert('Error', result.error.message);
              } else {
                Alert.alert('Success', `${profile.full_name} is now an ambassador!`);
                await load();
              }
            } finally {
              setAmbLoading(false);
            }
          },
        },
      ],
    );
  }, [profile, load]);

  const handleDeactivateAmbassador = useCallback(async () => {
    if (!ambassador) return;
    Alert.alert(
      'Deactivate Ambassador',
      'This will deactivate the ambassador status.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            setAmbLoading(true);
            try {
              const result = await api.ambassadors.deactivateAmbassador(ambassador.id);
              if (result.error) {
                Alert.alert('Error', result.error.message);
              } else {
                Alert.alert('Done', 'Ambassador deactivated.');
                await load();
              }
            } finally {
              setAmbLoading(false);
            }
          },
        },
      ],
    );
  }, [ambassador, load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error ?? 'Profile not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={styles.backText}>People</Text>
        </TouchableOpacity>

        {/* Identity */}
        <View style={styles.identitySection}>
          <AvatarCircle name={profile.full_name ?? '?'} size={80} avatarUrl={profile.avatar_url} />
          <Text style={styles.profileName}>{profile.full_name ?? 'Unknown'}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
          <View style={styles.roleRow}>
            <RoleTag role={profile.role} />
            {ambassador && (
              <View style={styles.ambassadorBadge}>
                <Text style={styles.ambassadorBadgeText}>AMBASSADOR</Text>
              </View>
            )}
          </View>
        </View>

        {/* Wallet */}
        <Card style={styles.walletCard}>
          <Text style={styles.walletLabel}>Coin Balance</Text>
          <CoinBadge amount={balance?.current_balance ?? 0} />
          <View style={styles.walletStats}>
            <View style={styles.walletStatItem}>
              <Text style={styles.walletStatValue}>{balance?.total_earned ?? 0}</Text>
              <Text style={styles.walletStatLabel}>Earned</Text>
            </View>
            <Divider />
            <View style={styles.walletStatItem}>
              <Text style={styles.walletStatValue}>{balance?.total_redeemed ?? 0}</Text>
              <Text style={styles.walletStatLabel}>Redeemed</Text>
            </View>
          </View>
          <Button
            title="Add Bonus Coins"
            variant="outline"
            size="sm"
            onPress={() => setShowBonusModal(true)}
            style={styles.bonusBtn}
          />
        </Card>

        {/* Ambassador actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Ambassador</Text>
          {ambassador ? (
            <>
              <Text style={styles.actionsSubtitle}>
                {profile.full_name} is currently an active ambassador.
                Referral code: {ambassador.referral_code}
              </Text>
              <Button
                title="Deactivate Ambassador"
                variant="danger"
                size="sm"
                onPress={handleDeactivateAmbassador}
                loading={ambLoading}
                disabled={ambLoading}
              />
            </>
          ) : (
            <>
              <Text style={styles.actionsSubtitle}>
                {profile.full_name} is not yet an ambassador.
              </Text>
              <Button
                title="Make Ambassador"
                variant="secondary"
                size="sm"
                onPress={handleMakeAmbassador}
                loading={ambLoading}
                disabled={ambLoading}
              />
            </>
          )}
        </Card>

        {/* Account info */}
        {!!profile.created_at && (
          <Card style={styles.infoCard}>
            <Text style={styles.actionsTitle}>Account Info</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, { color: profile.is_active ? colors.success : colors.error }]}>
                {profile.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <Divider />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member since</Text>
              <Text style={styles.infoValue}>
                {new Date(profile.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Bonus Coins Modal */}
      <Modal visible={showBonusModal} animationType="slide" onRequestClose={() => setShowBonusModal(false)}>
        <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Bonus Coins</Text>
              <TouchableOpacity onPress={() => setShowBonusModal(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalSubtitle}>
                Adding coins to: {profile.full_name}
              </Text>
              <Input
                label="Amount *"
                placeholder="e.g. 100"
                value={bonusAmount}
                onChangeText={setBonusAmount}
                keyboardType="numeric"
              />
              <Input
                label="Description *"
                placeholder="Reason for bonus coins..."
                value={bonusDescription}
                onChangeText={setBonusDescription}
                multiline
                numberOfLines={3}
              />
              <Button
                title="Add Coins"
                onPress={handleAddBonus}
                loading={bonusLoading}
                disabled={bonusLoading}
                style={styles.modalSubmitBtn}
              />
            </ScrollView>
          </KeyboardAvoidingView>
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
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: FontSize.body,
    color: colors.error,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
  },
  backText: {
    fontSize: FontSize.body,
    color: colors.text,
    fontWeight: Font.medium,
  },
  identitySection: {
    alignItems: 'center',
    paddingVertical: Gap.xl,
    backgroundColor: colors.surface,
    marginBottom: Gap.sm,
  },
  profileName: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    marginTop: Gap.md,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    marginTop: 3,
    textAlign: 'center',
  },
  roleRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginTop: Gap.md,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ambassadorBadge: {
    backgroundColor: colors.warning + '18',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ambassadorBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.warning,
    letterSpacing: 0.5,
  },
  walletCard: {
    margin: Gap.base,
    padding: Gap.base,
    gap: Gap.sm,
  },
  walletLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
    marginBottom: Gap.xs,
  },
  walletStats: {
    flexDirection: 'row',
    gap: Gap.base,
    marginTop: Gap.sm,
    alignItems: 'center',
  },
  walletStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  walletStatValue: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
  },
  walletStatLabel: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bonusBtn: {
    marginTop: Gap.sm,
  },
  actionsCard: {
    marginHorizontal: Gap.base,
    marginBottom: Gap.sm,
    padding: Gap.base,
    gap: Gap.sm,
  },
  actionsTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: Gap.xs,
  },
  actionsSubtitle: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: Gap.sm,
  },
  infoCard: {
    marginHorizontal: Gap.base,
    marginBottom: Gap.sm,
    padding: Gap.base,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Gap.sm,
  },
  infoLabel: {
    fontSize: FontSize.body,
    color: colors.text,
  },
  infoValue: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    fontWeight: Font.medium,
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
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    marginBottom: Gap.base,
  },
  modalContent: {
    padding: Gap.base,
    paddingBottom: Gap.xxxl,
  },
  modalSubmitBtn: {
    marginTop: Gap.md,
  },
});
