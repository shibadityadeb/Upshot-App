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
import { createApiClient } from '@upshot/api-client';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import { AvatarCircle, Button, Divider, Input, RoleTag } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

export default function AdminSettings() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

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
        Alert.alert('Error', result.error.message);
      } else {
        Alert.alert('Saved', 'Profile updated successfully.');
        setIsEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }, [user, editName, editPhone]);

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
            <AvatarCircle name={user.full_name ?? 'Admin'} size={80} avatarUrl={user.avatar_url} />
            <Text style={styles.identityName}>{user.full_name ?? 'Admin User'}</Text>
            <Text style={styles.identityEmail}>{user.email}</Text>
            <View style={styles.adminPill}>
              <Text style={styles.adminPillText}>ADMINISTRATOR</Text>
            </View>
          </View>

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
                  <Text style={styles.detailLabel}>Full Name</Text>
                  <Text style={styles.detailValue}>{user.full_name ?? '—'}</Text>
                </View>
                <Divider />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>{user.email}</Text>
                </View>
                <Divider />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Role</Text>
                  <RoleTag role={user.role} />
                </View>
                {!!user.phone && (
                  <>
                    <Divider />
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Phone</Text>
                      <Text style={styles.detailValue}>{user.phone}</Text>
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
                <Text style={styles.detailLabel}>App</Text>
                <Text style={styles.detailValue}>Upshot Brand Media</Text>
              </View>
              <Divider />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Version</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
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
  adminPill: {
    marginTop: Gap.md,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  adminPillText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.surface,
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
    fontWeight: Font.bold,
    color: colors.textSecondary,
    letterSpacing: 0.8,
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
    alignItems: 'center',
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
