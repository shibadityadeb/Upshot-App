import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import { useAuthStore } from '../../src/store/auth.store';
import {
  colors,
  DarkBg,
  spacing,
  radius,
  shadow,
} from '../../src/constants/theme';
import {
  Input,
  Button,
  Badge,
  AvatarCircle,
  Divider,
  LoadingScreen,
} from '../../src/components/common';
import type { Company } from '@upshot/types';

const api = createApiClient();

export default function CompanyProfile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

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
        Alert.alert('Error', 'Failed to save changes. Please try again.');
      } else {
        Alert.alert('Saved', 'Profile updated');
        fetchCompany();
      }
    } catch {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dark editorial header */}
        <View style={styles.header}>
          <AvatarCircle
            name={company?.name ?? 'Company'}
            size={64}
            bgColor={company?.logo_placeholder_color ?? colors.primary}
          />
          <Text style={styles.companyName}>{company?.name ?? 'Your Company'}</Text>
          <Text style={styles.industryText}>{company?.industry ?? ''}</Text>
          <View style={styles.badgeRow}>
            {company?.is_verified ? (
              <Badge
                label="✓ Verified Partner"
                color={'#FFFFFF'}
                bgColor={colors.success + '33'}
                size="sm"
              />
            ) : (
              <Badge
                label="Verification pending"
                color={'rgba(255,255,255,0.5)'}
                bgColor={colors.warning + '33'}
                size="sm"
              />
            )}
          </View>
        </View>

        {/* Read-only info */}
        <View style={[styles.infoCard, styles.cardShadow]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact person</Text>
            <Text style={styles.infoValue}>{user?.full_name ?? '—'}</Text>
          </View>
          <Divider />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email ?? '—'}</Text>
          </View>
        </View>

        {/* Editable fields */}
        <View style={[styles.editCard, styles.cardShadow]}>
          <Text style={styles.editCardTitle}>Company Details</Text>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: DarkBg,
    paddingTop: 52,
    paddingHorizontal: spacing.lg,
    paddingBottom: 32,
    alignItems: 'flex-start',
  },
  companyName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
  },
  industryText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginTop: -16,
    padding: spacing.md,
  },
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginTop: 12,
    padding: spacing.md,
  },
  cardShadow: {
    ...shadow.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  editCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  signOutSection: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: 40,
  },
});
