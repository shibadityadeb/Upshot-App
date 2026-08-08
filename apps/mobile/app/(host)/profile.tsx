import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Host } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { AvatarCircle } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '—'}</Text>
    </View>
  );
}

export default function HostProfile() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const result = await api.hosting.getHostProfile(user.id);
      setHost(result.data ?? null);
    } catch (e) {
      console.warn('[HostProfile] load failed:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => { void signOut(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AvatarCircle
          name={user?.full_name ?? '?'}
          avatarUrl={user?.avatar_url ?? undefined}
          size={56}
        />
        <View style={styles.headerText}>
          <Text style={styles.headerName} numberOfLines={1}>{user?.full_name ?? 'Host'}</Text>
          <View style={styles.roleChip}>
            <Text style={styles.roleChipText}>HOST</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.card}>
              <DetailRow label="Email" value={user?.email} />
              <DetailRow label="Phone" value={host?.contact_phone ?? user?.phone} />
            </View>

            <Text style={styles.sectionTitle}>Organisation</Text>
            <View style={styles.card}>
              <DetailRow label="Legal name" value={host?.org_legal_name} />
              <DetailRow label="Sector" value={host?.org_sector} />
              <DetailRow
                label="Location"
                value={host ? `${host.org_city}, ${host.org_state}` : null}
              />
              <DetailRow label="Website" value={host?.org_website} />
            </View>

            <Text style={styles.sectionTitle}>Position</Text>
            <View style={styles.card}>
              <DetailRow label="Designation" value={host?.designation} />
              <DetailRow label="Department" value={host?.department} />
            </View>

            {host && !host.is_verified && (
              <View style={styles.verifyNotice}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.verifyNoticeText}>
                  Your organisation is not verified yet. You can still propose events — each one is
                  reviewed by the Upshot team before going live.
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
              <Ionicons name="log-out-outline" size={18} color={colors.error} />
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerText: { flex: 1, gap: 6 },
  headerName: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  roleChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleChipText: {
    fontSize: 10,
    fontWeight: Font.bold,
    color: colors.primary,
    letterSpacing: 1.2,
  },

  scrollContent: { paddingHorizontal: Gap.base, paddingTop: Gap.base, paddingBottom: 100 },

  sectionTitle: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Gap.sm,
    marginTop: Gap.md,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: Gap.base,
    ...shadow.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Gap.md,
    paddingVertical: Gap.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  detailLabel: { fontSize: FontSize.small, color: colors.textSecondary },
  detailValue: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },

  verifyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Gap.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: Gap.md,
    marginTop: Gap.lg,
  },
  verifyNoticeText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.error + '40',
    height: 50,
    marginTop: Gap.xl,
  },
  signOutText: { fontSize: FontSize.body, fontWeight: Font.bold, color: colors.error },

  loader: { paddingVertical: Gap.xxxl, alignItems: 'center' },
});
