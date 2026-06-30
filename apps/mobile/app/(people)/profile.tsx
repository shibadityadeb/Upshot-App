import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { createApiClient } from '@upshot/api-client';
import type { WorkforceProfile } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import {
  AvatarCircle,
  Button,
  CoinBadge,
  Divider,
  Input,
  RoleTag,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();


export default function PeopleProfile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [balance, setBalance] = useState(0);
  const [workforceProfile, setWorkforceProfile] = useState<WorkforceProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.full_name ?? '');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const [balRes, wfRes] = await Promise.all([
        api.coins.getWalletBalance(user.id),
        api.workforce.getMyProfile(user.id),
      ]);
      if (balRes.data) setBalance(balRes.data.current_balance ?? 0);
      if (wfRes) {
        setWorkforceProfile(wfRes);
        setEditBio(wfRes.bio ?? '');
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handleToggleEdit = useCallback(() => {
    if (isEditing) {
      // Cancel — reset
      setEditName(user?.full_name ?? '');
      setEditBio(workforceProfile?.bio ?? '');
    }
    setIsEditing((prev) => !prev);
  }, [isEditing, user, workforceProfile]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    if (!editName.trim()) {
      Alert.alert('Validation', 'Full name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const [authRes] = await Promise.all([
        api.auth.updateProfile(user.id, { full_name: editName.trim() }),
        api.workforce.upsertProfile(user.id, {
          bio: editBio.trim() || undefined,
          full_name: editName.trim(),
        } as any),
      ]);
      if (authRes.error) {
        Alert.alert('Error', authRes.error.message);
      } else {
        Alert.alert('Saved', 'Profile updated successfully.');
        setIsEditing(false);
        await load();
      }
    } finally {
      setSaving(false);
    }
  }, [user, editName, editBio, load]);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }, [signOut, router]);

  if (!user) return null;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Identity header */}
          <View style={styles.identitySection}>
            <AvatarCircle name={user.full_name ?? '?'} size={80} />
            <Text style={styles.identityName}>{user.full_name ?? 'User'}</Text>
            <Text style={styles.identityEmail}>{user.email}</Text>
            <View style={styles.identityMeta}>
              <RoleTag role={user.role} />
              <CoinBadge amount={balance} />
            </View>
          </View>

          {/* Edit Profile section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <TouchableOpacity onPress={handleToggleEdit} activeOpacity={0.7}>
                <Text style={styles.editToggleText}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.editCard}>
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  value={editName}
                  onChangeText={setEditName}
                  autoCapitalize="words"
                />
                <Input
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  value={editBio}
                  onChangeText={setEditBio}
                  multiline
                  numberOfLines={3}
                />
                <Button
                  title="Save Changes"
                  onPress={handleSave}
                  loading={saving}
                  disabled={saving}
                />
              </View>
            ) : (
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Full Name</Text>
                  <Text style={styles.detailValue}>{user.full_name ?? '—'}</Text>
                </View>
                <Divider />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>{user.email}</Text>
                </View>
                {!!workforceProfile?.bio && (
                  <>
                    <Divider />
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Bio</Text>
                      <Text style={[styles.detailValue, { maxWidth: '60%' }]} numberOfLines={3}>
                        {workforceProfile.bio}
                      </Text>
                    </View>
                  </>
                )}
                <Divider />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={[styles.detailValue, { color: user.is_active ? colors.success : colors.error }]}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <Divider />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Member since</Text>
                  <Text style={styles.detailValue}>
                    {new Date(user.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Sign out */}
          <View style={styles.signOutSection}>
            <Button title="Sign Out" variant="danger" onPress={handleSignOut} />
          </View>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  identitySection: {
    backgroundColor: colors.dark,
    alignItems: 'center',
    paddingTop: Gap.xl,
    paddingBottom: Gap.xxl,
    paddingHorizontal: Gap.base,
  },
  identityName: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: colors.surface,
    marginTop: Gap.md,
    textAlign: 'center',
  },
  identityEmail: {
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 3,
    textAlign: 'center',
  },
  identityMeta: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginTop: Gap.md,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.sm,
  },
  sectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
  },
  editToggleText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.primary,
  },
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
  },
  detailLabel: {
    fontSize: FontSize.body,
    color: colors.text,
  },
  detailValue: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    fontWeight: Font.medium,
    maxWidth: '55%',
    textAlign: 'right',
  },
  signOutSection: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
  },
});
