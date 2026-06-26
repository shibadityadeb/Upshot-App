import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, Font, FontSize, Gap } from '../../src/constants/theme';
import { AvatarCircle, Button, RoleTag } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

export default function AdminSettings() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dark identity header */}
        <View style={styles.identitySection}>
          <AvatarCircle name={user.full_name ?? 'Admin'} size={72} />
          <Text style={styles.identityName}>{user.full_name ?? 'Admin User'}</Text>
          <Text style={styles.identityEmail}>{user.email}</Text>
          <View style={styles.adminPill}>
            <Text style={styles.adminPillText}>ADMINISTRATOR</Text>
          </View>
        </View>

        {/* Account details */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT DETAILS</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, { color: user.is_active ? colors.success : colors.error }]}>
                {user.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <View style={styles.rowSep} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Role</Text>
              <RoleTag role={user.role} />
            </View>
            {!!user.phone && (
              <>
                <View style={styles.rowSep} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{user.phone}</Text>
                </View>
              </>
            )}
            <View style={styles.rowSep} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Member since</Text>
              <Text style={styles.detailValue}>
                {new Date(user.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>App</Text>
              <Text style={styles.detailValue}>Upshot Brand Media</Text>
            </View>
            <View style={styles.rowSep} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },

  // Section
  section: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: Gap.sm,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
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
  rowSep: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },

  // Sign out
  signOutSection: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
  },
});
