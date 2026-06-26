import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import { Button, Input, AvatarCircle, RoleTag } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

export default function PeopleProfile() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const router = useRouter();

  const [editName, setEditName] = useState(user?.full_name ?? '');
  const [editPhone, setEditPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation', 'Full name cannot be empty.');
      return;
    }
    setSaving(true);
    const result = await api.auth.updateProfile(user.id, {
      full_name: editName.trim(),
      phone: editPhone.trim() || null,
    });
    if (result.error) {
      Alert.alert('Error', result.error.message);
    } else {
      Alert.alert('Saved', 'Profile updated successfully.');
    }
    setSaving(false);
  };

  const handleSignOut = () => {
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
  };

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
          {/* Dark identity header */}
          <View style={styles.identitySection}>
            <AvatarCircle name={user.full_name} size={72} />
            <Text style={styles.identityName}>{user.full_name}</Text>
            <Text style={styles.identityEmail}>{user.email}</Text>
            <View style={styles.roleTagWrapper}>
              <RoleTag role={user.role} />
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

          {/* Account */}
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
    backgroundColor: colors.dark,
    alignItems: 'center',
    paddingTop: Gap.xl,
    paddingBottom: Gap.xxl,
    paddingHorizontal: Gap.base,
  },
  identityName: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: '#FFFFFF',
    marginTop: Gap.md,
    textAlign: 'center',
  },
  identityEmail: {
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 3,
    textAlign: 'center',
  },
  roleTagWrapper: {
    marginTop: Gap.md,
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

  // Account details
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
