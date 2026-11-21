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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { AvatarCircle, Button, Divider, Input, RoleTag } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

export default function AdminSettings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.full_name ?? '');
  const [editPhone, setEditPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);

  const handleToggleEdit = useCallback(() => {
    if (isEditing) {
      // Cancel — reset fields
      setEditName(user?.full_name ?? '');
      setEditPhone(user?.phone ?? '');
    }
    setIsEditing((prev) => !prev);
  }, [isEditing, user]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    if (!editName.trim()) {
      Alert.alert('Validation', 'Full name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const result = await api.auth.updateProfile(user.id, {
        full_name: editName.trim(),
        phone: editPhone.trim() || undefined,
      });
      if (result.error) {
        showError(result.error);
      } else {
        await refreshUser();
        Alert.alert('Saved', 'Profile updated successfully.');
        setIsEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }, [user, editName, editPhone, refreshUser]);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
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

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Lime liquid header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
          <View style={[styles.identityInner, columnStyle]}>
            <AvatarCircle name={user.full_name ?? 'Admin'} size={80} avatarUrl={user.avatar_url} />
            <Text style={styles.identityName}>{user.full_name ?? 'Admin User'}</Text>
            <Text style={styles.identityEmail}>{user.email}</Text>
            <View style={styles.adminPill}>
              <Text style={styles.adminPillText}>ADMINISTRATOR</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, columnStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>PROFILE</Text>
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
                  label="Phone"
                  placeholder="Your phone number"
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
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
                  <View style={styles.detailLeft}>
                    <View style={styles.rowIcon}>
                      <Ionicons name="person-outline" size={16} color={colors.ink} />
                    </View>
                    <Text style={styles.detailLabel}>Full Name</Text>
                  </View>
                  <Text style={styles.detailValue}>{user.full_name ?? '—'}</Text>
                </View>
                <Divider />
                <View style={styles.detailRow}>
                  <View style={styles.detailLeft}>
                    <View style={styles.rowIcon}>
                      <Ionicons name="mail-outline" size={16} color={colors.ink} />
                    </View>
                    <Text style={styles.detailLabel}>Email</Text>
                  </View>
                  <Text style={styles.detailValue} numberOfLines={1}>{user.email}</Text>
                </View>
                <Divider />
                <View style={styles.detailRow}>
                  <View style={styles.detailLeft}>
                    <View style={styles.rowIcon}>
                      <Ionicons name="shield-outline" size={16} color={colors.ink} />
                    </View>
                    <Text style={styles.detailLabel}>Role</Text>
                  </View>
                  <RoleTag role={user.role} />
                </View>
                {!!user.phone && (
                  <>
                    <Divider />
                    <View style={styles.detailRow}>
                      <View style={styles.detailLeft}>
                        <View style={styles.rowIcon}>
                          <Ionicons name="call-outline" size={16} color={colors.ink} />
                        </View>
                        <Text style={styles.detailLabel}>Phone</Text>
                      </View>
                      <Text style={styles.detailValue}>{user.phone}</Text>
                    </View>
                  </>
                )}
                <Divider />
                <View style={styles.detailRow}>
                  <View style={styles.detailLeft}>
                    <View style={styles.rowIcon}>
                      <Ionicons name="pulse-outline" size={16} color={colors.ink} />
                    </View>
                    <Text style={styles.detailLabel}>Status</Text>
                  </View>
                  <Text style={[styles.detailValue, { color: user.is_active ? colors.success : colors.error }]}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <Divider />
                <View style={styles.detailRow}>
                  <View style={styles.detailLeft}>
                    <View style={styles.rowIcon}>
                      <Ionicons name="time-outline" size={16} color={colors.ink} />
                    </View>
                    <Text style={styles.detailLabel}>Member since</Text>
                  </View>
                  <Text style={styles.detailValue}>
                    {new Date(user.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* About section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <View style={styles.rowIcon}>
                    <Ionicons name="phone-portrait-outline" size={16} color={colors.ink} />
                  </View>
                  <Text style={styles.detailLabel}>App</Text>
                </View>
                <Text style={styles.detailValue}>Upshot Brand Media</Text>
              </View>
              <Divider />
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <View style={styles.rowIcon}>
                    <Ionicons name="git-branch-outline" size={16} color={colors.ink} />
                  </View>
                  <Text style={styles.detailLabel}>Version</Text>
                </View>
                <Text style={styles.detailValue}>1.0.0</Text>
              </View>
            </View>
          </View>

          {/* Sign out */}
          <View style={styles.signOutSection}>
            <Button title="Sign Out" variant="danger" onPress={handleSignOut} />
          </View>
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
  scrollArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // ── Header (lime liquid) ──
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xxl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  identityInner: {
    alignItems: 'center',
    paddingTop: Gap.sm,
  },
  identityName: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    marginTop: Gap.md,
    textAlign: 'center',
    letterSpacing: -0.7,
  },
  identityEmail: {
    fontSize: FontSize.small,
    color: '#2c3326',
    marginTop: 3,
    textAlign: 'center',
    fontWeight: Font.semibold,
  },
  adminPill: {
    marginTop: Gap.md,
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  adminPillText: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    color: '#FFFFFF',
    letterSpacing: 1.5,
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
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    color: colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: Gap.sm,
  },
  editToggleText: {
    fontSize: FontSize.body,
    fontWeight: Font.black,
    color: colors.ink,
  },
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
    gap: Gap.sm,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: FontSize.body,
    color: colors.text,
    fontWeight: Font.semibold,
  },
  detailValue: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    fontWeight: Font.medium,
    maxWidth: '45%',
    textAlign: 'right',
  },
  signOutSection: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
  },
});
