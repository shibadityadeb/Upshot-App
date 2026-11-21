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
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { WorkforceProfile } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import {
  Button,
  CoinBadge,
  Input,
  RoleBadge,
  roleBadgeMeta,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

const INFO_ROWS = (user: any) => [
  { label: 'Full Name', value: user?.full_name ?? '—' },
  { label: 'Email', value: user?.email ?? '—' },
  { label: 'City', value: user?.city ?? '—' },
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
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [balance, setBalance] = useState(0);
  const [workforceProfile, setWorkforceProfile] = useState<WorkforceProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Badge state
  const [badges, setBadges] = useState<string[]>([]);
  const [hasAmbassadorCode, setHasAmbassadorCode] = useState(false);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.full_name ?? '');
  const [editCity, setEditCity] = useState(user?.city ?? '');
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
          studentHasCode = true;
        }
      }

      // The category badge is not something you earn — it's who you are, so it
      // always shows.
      earnedBadges.push(user.role);

      const { data: hostData } = await (api as any).supabase
        .from('events')
        .select('id')
        .eq('created_by', user.id)
        .eq('status', 'approved')
        .limit(1);
      if (hostData && hostData.length > 0) {
        earnedBadges.push('host');
      }

      // A profile shows one of two categories, and hosting is something a
      // community member does rather than a category of its own — so a member
      // who has hosted resolves to the same label twice. Collapse by label
      // instead of stacking identical chips.
      const seen = new Set<string>();
      const uniqueBadges = earnedBadges.filter((role) => {
        const { label } = roleBadgeMeta(role);
        if (seen.has(label)) return false;
        seen.add(label);
        return true;
      });

      setBadges(uniqueBadges);
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
      setEditCity(user?.city ?? '');
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
        api.auth.updateProfile(user.id, { full_name: editName.trim(), city: editCity.trim() || null }),
        api.workforce.upsertProfile(user.id, {
          bio: editBio.trim() || undefined,
          full_name: editName.trim(),
        } as any),
      ]);
      if (authRes.error) {
        showError(authRes.error);
      } else {
        Alert.alert('Saved', 'Profile updated successfully.');
        setIsEditing(false);
        await load();
      }
    } finally {
      setSaving(false);
    }
  }, [user, editName, editCity, editBio, load]);

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

  const showCoinBadge = balance > 0 || (user.role === 'student' && hasAmbassadorCode) || user.role === 'ambassador';
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
          {/* ── LIME LIQUID HEADER ── */}
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
            <View style={[columnStyle, { alignItems: 'center' }]}>
              <View style={styles.avatar}>
                {user.avatar_url ? (
                  <Image source={{ uri: user.avatar_url }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarText}>
                    {(user.full_name ?? 'U').trim().charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text style={styles.headerName}>{user.full_name ?? 'User'}</Text>
              <Text style={styles.headerEmail}>{user.email}</Text>
              {(badges.length > 0 || showCoinBadge) && (
                <View style={styles.badgeRow}>
                  {badges.map((b) => (
                    <RoleBadge key={b} role={b} size="md" />
                  ))}
                  {showCoinBadge && <CoinBadge amount={balance} />}
                </View>
              )}
            </View>
          </View>

          <View style={columnStyle}>
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
                  label="City"
                  placeholder="Your city (for events near you)"
                  value={editCity}
                  onChangeText={setEditCity}
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
            <Ionicons name="log-out-outline" size={18} color="#991B1B" />
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
          </View>
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

  // ── Lime liquid header ──
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.65)',
    marginTop: 8,
    ...shadow.md,
  },
  avatarImg: { width: 78, height: 78, borderRadius: 39 },
  avatarText: { fontSize: 32, fontWeight: Font.black, color: '#FFFFFF' },
  headerName: {
    fontSize: 23,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 12,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  headerEmail: {
    fontSize: 13,
    color: 'rgba(14,14,14,0.6)',
    marginBottom: 14,
    fontWeight: '600',
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

  // ── Profile info card ──
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    overflow: 'hidden',
    ...shadow.sm,
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
    fontWeight: '700',
    color: colors.ink,
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
    borderRadius: radius.full,
    paddingVertical: 15,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
  },
});
