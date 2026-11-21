import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import { useAuthStore } from '../../src/store/auth.store';
import {
  colors,
  Font,
  FontSize,
  Gap,
  radius,
  shadow,
  useResponsive,
} from '../../src/constants/theme';
import {
  Input,
  Button,
  Badge,
  AvatarCircle,
  Divider,
  LoadingScreen,
  RoleBadge,
} from '../../src/components/common';
import type { Company } from '@upshot/types';
import { showError } from '../../src/store/error.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

export default function CompanyProfile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [editName, setEditName] = useState('');
  const [editIndustry, setEditIndustry] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrevWork, setEditPrevWork] = useState('');

  const fetchCompany = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.supabase
        .from('companies')
        .select('*')
        .eq('contact_person_id', user.id)
        .single();

      if (data) {
        const co = data as Company;
        setCompany(co);
        setEditName(co.name ?? '');
        setEditIndustry(co.industry ?? '');
        setEditWebsite(co.website ?? '');
        setEditDescription(co.description ?? '');
        setEditPrevWork(co.previous_work_description ?? '');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCompany();
  }, [fetchCompany]);

  const handleSave = useCallback(async () => {
    if (!company) return;
    setSaving(true);
    try {
      const { error } = await api.supabase
        .from('companies')
        .update({
          name: editName,
          industry: editIndustry,
          website: editWebsite,
          description: editDescription,
          previous_work_description: editPrevWork,
        })
        .eq('id', company.id);

      if (error) {
        showError(null, { context: 'Failed to save changes. Please try again.' });
      } else {
        Alert.alert('Saved', 'Profile updated');
        fetchCompany();
      }
    } catch {
      showError(null, { context: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  }, [company, editName, editIndustry, editWebsite, editDescription, editPrevWork, fetchCompany]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/(auth)/login');
  }, [signOut, router]);

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Lime liquid header ── */}
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
            <View style={[columnStyle, { alignItems: 'center' }]}>
              <View style={styles.avatarWrap}>
                <AvatarCircle
                  name={company?.name ?? 'Company'}
                  size={84}
                  bgColor={company?.logo_placeholder_color ?? colors.ink}
                />
              </View>
              <Text style={styles.companyName}>{company?.name ?? 'Your Company'}</Text>
              {!!company?.industry && <Text style={styles.industryText}>{company.industry}</Text>}
              <View style={styles.badgeRow}>
                <RoleBadge role="company" />
                {company?.is_verified ? (
                  <Badge
                    label="✓ Verified Partner"
                    color={colors.ink}
                    bgColor={'rgba(255,255,255,0.7)'}
                    size="sm"
                  />
                ) : (
                  <Badge
                    label="Verification pending"
                    color={colors.ink}
                    bgColor={'rgba(255,255,255,0.7)'}
                    size="sm"
                  />
                )}
              </View>
            </View>
          </View>

          <View style={columnStyle}>
            {/* Read-only info */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact person</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{user?.full_name ?? '—'}</Text>
              </View>
              <Divider />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{user?.email ?? '—'}</Text>
              </View>
            </View>

            {/* Editable fields */}
            <Text style={styles.sectionLabel}>Company Details</Text>
            <View style={styles.editCard}>
              <Input
                label="Company Name"
                value={editName}
                onChangeText={setEditName}
              />

              <Input
                label="Industry"
                value={editIndustry}
                onChangeText={setEditIndustry}
              />

              <Input
                label="Website"
                value={editWebsite}
                onChangeText={setEditWebsite}
                autoCapitalize="none"
              />

              <Input
                label="About your company"
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
                numberOfLines={4}
              />

              <Input
                label="Previous campaigns (tell UBM your story)"
                value={editPrevWork}
                onChangeText={setEditPrevWork}
                multiline
                numberOfLines={4}
              />

              <Button
                title="Save changes"
                variant="primary"
                loading={saving}
                onPress={handleSave}
              />
            </View>

            {/* Sign out */}
            <View style={styles.signOutSection}>
              <Button
                title="Sign Out"
                variant="danger"
                onPress={handleSignOut}
              />
            </View>
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
  flex: { flex: 1 },
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
  avatarWrap: {
    borderRadius: 46,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.65)',
    marginTop: 8,
    ...shadow.md,
  },
  companyName: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    marginTop: 12,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  industryText: {
    fontSize: FontSize.body,
    color: 'rgba(14,14,14,0.65)',
    marginTop: 2,
    fontWeight: Font.semibold,
  },
  badgeRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },

  // ── Cards ──
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    marginHorizontal: Gap.base,
    marginTop: Gap.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.sm,
    ...shadow.sm,
  },
  sectionLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Gap.lg,
    marginBottom: Gap.sm,
    marginLeft: Gap.base + 2,
  },
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    marginHorizontal: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.base,
    ...shadow.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Gap.md,
  },
  infoLabel: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    fontWeight: Font.medium,
  },
  infoValue: {
    fontSize: FontSize.body,
    color: colors.text,
    fontWeight: Font.semibold,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: Gap.base,
  },
  signOutSection: {
    marginHorizontal: Gap.base,
    marginTop: Gap.lg,
    marginBottom: 40,
  },
});
