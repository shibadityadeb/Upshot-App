import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { AvatarCircle, Button, Input, roleBadgeMeta } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

export default function AmbassadorProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };
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
          {/* ── Lime liquid identity header ── */}
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
            <View style={[columnStyle, { alignItems: 'center' }]}>
              <View style={styles.avatarRing}>
                <AvatarCircle name={user.full_name ?? 'Ambassador'} size={78} avatarUrl={user.avatar_url} />
              </View>
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
          </View>

          <View style={columnStyle}>
            {/* Edit form */}
            <View style={styles.card}>
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
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={[styles.detailRow, styles.detailRowBorder]}>
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
            </View>

            {/* Sign out */}
            <TouchableOpacity
              style={styles.signOutBtn}
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={18} color="#991B1B" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // ── Lime liquid header ──
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingHorizontal: Gap.lg,
    paddingBottom: Gap.xxl,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...shadow.md,
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
    fontSize: FontSize.small,
    color: '#2c3326',
    fontWeight: Font.semibold,
    marginTop: 3,
    textAlign: 'center',
  },
  ambassadorChip: {
    marginTop: Gap.md,
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  ambassadorChipText: {
    fontSize: FontSize.xs,
    color: '#FFFFFF',
    fontWeight: Font.black,
    letterSpacing: 2,
  },

  // ── Cards ──
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    marginHorizontal: Gap.base,
    marginTop: Gap.base,
    padding: Gap.base,
    ...shadow.sm,
  },
  sectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.3,
    marginBottom: Gap.md,
  },
  saveBtn: {
    marginTop: Gap.sm,
  },

  // ── Account ──
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  detailLabel: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    fontWeight: Font.medium,
  },
  detailValue: {
    fontSize: FontSize.body,
    color: colors.ink,
    fontWeight: Font.semibold,
  },

  // ── Sign out ──
  signOutBtn: {
    marginHorizontal: Gap.base,
    marginTop: Gap.base,
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
    fontWeight: Font.black,
    color: '#991B1B',
  },
});
