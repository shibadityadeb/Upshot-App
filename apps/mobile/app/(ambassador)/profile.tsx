import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import { AvatarCircle, Button, Input, roleBadgeMeta } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();

export default function AmbassadorProfile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [editName, setEditName] = useState(user?.full_name ?? '');
  const [editPhone, setEditPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    if (!editName.trim()) {
      Alert.alert('Validation', 'Full name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const result = await api.auth.updateProfile(user.id, {
        full_name: editName.trim(),
        phone: editPhone.trim() || null,
      });
      if (result.error) {
        showError(result.error, { context: 'Failed to save profile.' });
      } else {
        Alert.alert('Saved', 'Your profile has been updated.');
      }
    } catch {
      showError(null, { context: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
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
  };

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
          {/* Dark identity header — matches ambassador dashboard style */}
          <View style={styles.identitySection}>
            <AvatarCircle name={user.full_name ?? 'Ambassador'} size={72} avatarUrl={user.avatar_url} />
            <Text style={styles.identityName}>{user.full_name ?? 'Ambassador'}</Text>
            <Text style={styles.identityEmail}>{user.email}</Text>
            {/* Being an ambassador is something a community member does, not a
                category of its own — the label comes from the shared map. */}
            <View style={styles.ambassadorChip}>
              <Text style={styles.ambassadorChipText}>
                {roleBadgeMeta(user.role).label.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Edit form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
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
              style={styles.saveBtn}
            />
          </View>

          {/* Account details */}
          <View style={styles.accountSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, { color: user.is_active ? colors.success : colors.error }]}>
                {user.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Member since</Text>
              <Text style={styles.detailValue}>
                {new Date(user.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </Text>
            </View>
            <Button
              title="Sign Out"
              onPress={handleSignOut}
              variant="danger"
              style={styles.signOutBtn}
            />
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Identity header
  identitySection: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: Gap.xl,
    paddingBottom: Gap.xxl,
    paddingHorizontal: Gap.base,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  identityName: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    marginTop: Gap.md,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  identityEmail: {
    fontSize: FontSize.body,
    color: 'rgba(14,14,14,0.6)',
    marginTop: 3,
    textAlign: 'center',
  },
  ambassadorChip: {
    marginTop: Gap.md,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  ambassadorChipText: {
    fontSize: FontSize.xs,
    color: colors.ink,
    fontWeight: Font.bold,
    letterSpacing: 2,
  },

  // Form
  formSection: {
    backgroundColor: colors.surface,
    padding: Gap.base,
    paddingTop: Gap.xl,
  },
  sectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: Gap.md,
  },
  saveBtn: {
    marginTop: Gap.sm,
  },

  // Account
  accountSection: {
    backgroundColor: colors.surface,
    marginTop: Gap.sm,
    padding: Gap.base,
    paddingTop: Gap.xl,
    paddingBottom: Gap.xxl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: FontSize.body,
    color: colors.text,
  },
  detailValue: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    fontWeight: Font.medium,
  },
  signOutBtn: {
    marginTop: Gap.xl,
  },
});
