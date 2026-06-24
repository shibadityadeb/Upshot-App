import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Divider } from '../src/components/common';
import { useAuthStore } from '../src/store/auth.store';
import { createApiClient } from '@upshot/api-client';
import { colors, typography, spacing } from '../src/constants/theme';

const api = createApiClient();

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setPhone(user.phone ?? '');
    }
  }, [user]);

  const initials = (user?.full_name ?? '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveMessage(null);
    const result = await api.auth.updateProfile(user.id, {
      full_name: fullName.trim(),
      phone: phone.trim() || null,
    });
    setIsSaving(false);
    if (result.error) {
      setSaveMessage(result.error.message);
    } else {
      setSaveMessage('Profile updated!');
      await refreshUser();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Profile Settings</Text>

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <Divider />

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Your name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <Input
              label="Phone"
              placeholder="+91 98765 43210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Input
              label="Email"
              placeholder=""
              value={user?.email ?? ''}
              onChangeText={() => {}}
              autoCapitalize="none"
              style={styles.readOnly}
            />

            {saveMessage && (
              <Text
                style={[
                  styles.saveMessage,
                  { color: saveMessage.includes('updated') ? colors.success : colors.error },
                ]}
              >
                {saveMessage}
              </Text>
            )}

            <Button
              title="Save changes"
              onPress={handleSave}
              loading={isSaving}
              disabled={!fullName.trim()}
              style={styles.saveBtn}
            />
          </View>

          <View style={styles.signOutSection}>
            <Divider />
            <Button
              title="Sign out"
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.heading2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  email: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  form: {
    marginTop: spacing.lg,
  },
  readOnly: {
    opacity: 0.5,
  },
  saveMessage: {
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  saveBtn: {
    marginTop: spacing.sm,
  },
  signOutSection: {
    marginTop: spacing.xl,
  },
  signOutBtn: {
    marginTop: spacing.lg,
  },
});
