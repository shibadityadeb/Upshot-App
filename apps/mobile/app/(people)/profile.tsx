import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { createApiClient } from '@upshot/api-client';
import type { WorkforceProfile } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import {
  Button,
  CoinBadge,
  Input,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

const AVATARS = [
  'https://api.dicebear.com/9.x/adventurer/png?seed=Liam&size=128&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/adventurer/png?seed=George&size=128&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Maria&size=128&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Katherine&size=128&backgroundColor=ffdfbf',
];

const ROLE_BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  student: { bg: '#D1FAE5', text: '#065F46', label: 'Student' },
  ambassador: { bg: '#FEF3C7', text: '#92400E', label: 'Ambassador' },
  host: { bg: '#EDE9FE', text: '#5B21B6', label: 'Host' },
};

const INFO_ROWS = (user: any) => [
  { label: 'Full Name', value: user?.full_name ?? '—' },
  { label: 'Email', value: user?.email ?? '—' },
  {
    label: 'Member since',
    value: user?.created_at
      ? new Date(user.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '—',
  },
];

export default function PeopleProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [balance, setBalance] = useState(0);
  const [workforceProfile, setWorkforceProfile] = useState<WorkforceProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarIndex, setAvatarIndex] = useState(() => {
    if (user?.avatar_url) {
      const idx = AVATARS.indexOf(user.avatar_url);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  // Badge state
  const [badges, setBadges] = useState<string[]>([]);
  const [hasAmbassadorCode, setHasAmbassadorCode] = useState(false);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.full_name ?? '');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);

  const selectAvatar = useCallback(async (index: number) => {
    if (!user?.id) return;
    setAvatarIndex(index);
    const url = AVATARS[index];
    try {
      await (api as any).supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);
      await refreshUser();
    } catch (e) {
      console.warn('Failed to save avatar', e);
    }
  }, [user?.id, refreshUser]);

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

      // Badge logic
      const earnedBadges: string[] = [];
      let studentHasCode = false;

      if (user.role === 'student') {
        const { data: studentData } = await (api as any).supabase
          .from('students')
          .select('ambassador_code')
          .eq('user_id', user.id)
          .maybeSingle();
        if (studentData?.ambassador_code) {
          earnedBadges.push('student');
          studentHasCode = true;
        }
      }

      if (user.role === 'ambassador') {
        earnedBadges.push('ambassador');
      }

      const { data: hostData } = await (api as any).supabase
        .from('events')
        .select('id')
        .eq('created_by', user.id)
        .eq('status', 'approved')
        .limit(1);
      if (hostData && hostData.length > 0) {
        earnedBadges.push('host');
      }

      setBadges(earnedBadges);
      setHasAmbassadorCode(studentHasCode);
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

  const showCoinBadge = user.role === 'student' && hasAmbassadorCode;
  const rows = INFO_ROWS(user);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── DARK HEADER ── */}
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <View style={styles.mainAvatar}>
              <Image source={{ uri: AVATARS[avatarIndex] }} style={styles.mainAvatarImg} />
            </View>
            <Text style={styles.headerName}>{user.full_name ?? 'User'}</Text>
            <Text style={styles.headerEmail}>{user.email}</Text>
            {(badges.length > 0 || showCoinBadge) && (
              <View style={styles.badgeRow}>
                {badges.map((b) => {
                  const s = ROLE_BADGE_STYLES[b];
                  if (!s) return null;
                  return (
                    <View key={b} style={[styles.roleBadge, { backgroundColor: s.bg }]}>
                      <Text style={[styles.roleBadgeText, { color: s.text }]}>{s.label}</Text>
                    </View>
                  );
                })}
                {showCoinBadge && <CoinBadge amount={balance} />}
              </View>
            )}
          </View>

          {/* ── AVATAR SELECTOR CARD ── */}
          <View style={styles.avatarCard}>
            <Text style={styles.avatarCardTitle}>CHOOSE YOUR AVATAR</Text>
            <View style={styles.avatarOptions}>
              {AVATARS.map((uri, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => selectAvatar(i)}
                  activeOpacity={0.7}
                  style={[
                    styles.avatarOption,
                    avatarIndex === i && styles.avatarOptionSelected,
                  ]}
                >
                  <Image source={{ uri }} style={styles.avatarOptionImg} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── PROFILE INFO CARD ── */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Text style={styles.infoCardTitle}>Profile info</Text>
              <TouchableOpacity onPress={handleToggleEdit} activeOpacity={0.7}>
                <Text style={styles.editToggle}>{isEditing ? 'Cancel' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.editSection}>
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
              rows.map((row, i) => (
                <View
                  key={row.label}
                  style={[
                    styles.infoRow,
                    i < rows.length - 1 && styles.infoRowBorder,
                  ]}
                >
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>{row.value}</Text>
                </View>
              ))
            )}
          </View>

          {/* ── SIGN OUT ── */}
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: { paddingBottom: 100 },

  // ── Dark header ──
  header: {
    backgroundColor: colors.dark,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  mainAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#7BC55A',
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#1E2340',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainAvatarImg: { width: 82, height: 82, borderRadius: 41 },
  headerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: Font.bold,
  },

  // ── Avatar selector card ──
  avatarCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginTop: -1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  avatarOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarOptionSelected: {
    borderColor: '#7BC55A',
    backgroundColor: '#F0FAF0',
  },
  avatarOptionImg: { width: 52, height: 52, borderRadius: 26 },

  // ── Profile info card ──
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  editToggle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  editSection: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },

  // ── Sign out ──
  signOutBtn: {
    marginHorizontal: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991B1B',
  },
});
