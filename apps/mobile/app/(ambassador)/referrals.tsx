import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Ambassador, Student } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { AvatarCircle, LoadingScreen, EmptyState, StatCard } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();

export default function AmbassadorReferrals() {
  const user = useAuthStore((s) => s.user);

  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cartel referrals
  const [cartelReferrals, setCartelReferrals] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const ambassadorResult = await api.ambassadors.getMyAmbassadorProfile(user.id);
      if (ambassadorResult.data) {
        setAmbassador(ambassadorResult.data);
        const referralCode = ambassadorResult.data.referral_code;
        const [studentsResult, cartelResult] = await Promise.all([
          api.ambassadors.getAmbassadorStudents(ambassadorResult.data.id),
          referralCode
            ? api.campusCartel.getAmbassadorReferrals(referralCode)
            : Promise.resolve({ data: [], error: null }),
        ]);
        if (studentsResult.data) {
          const sorted = [...studentsResult.data].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setStudents(sorted);
        }
        if (cartelResult.data) {
          setCartelReferrals(cartelResult.data);
        }
      }
    } catch {
      showError(null, { context: 'Failed to load referrals.' });
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleCopy = async () => {
    if (!ambassador?.referral_code) return;
    await Clipboard.setStringAsync(ambassador.referral_code);
    Alert.alert('Copied!', 'Referral code copied');
  };

  const handleShare = () => {
    if (!ambassador?.referral_code) return;
    Share.share({
      message: `Join Campus Cartel using my code ${ambassador.referral_code} with UBM \u{1F393}`,
    });
  };

  if (loading) return <LoadingScreen />;

  // Combine students + cartel referrals for display
  const allReferrals = [
    ...students.map((s) => ({
      id: s.id,
      name: s.user?.full_name ?? 'Student',
      avatarUrl: s.user?.avatar_url,
      college: s.profession ?? s.college ?? 'Member',
      date: s.created_at,
      coins: 0,
    })),
    ...cartelReferrals
      .filter((cr) => !students.some((s) => s.user_id === cr.user_id))
      .map((cr) => ({
        id: cr.id,
        name: cr.profile?.full_name ?? 'Member',
        avatarUrl: cr.profile?.avatar_url,
        college: cr.college ?? 'Member',
        date: cr.joined_at,
        coins: 0,
      })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = search.trim()
    ? allReferrals.filter((r) =>
        r.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : allReferrals;

  // Stats
  const thisMonth = allReferrals.filter((r) => {
    const d = new Date(r.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Dark header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Referrals</Text>
          {allReferrals.length > 0 && (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{allReferrals.length} total</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerSubtitle}>People who joined using your code</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatCard label="Total Referred" value={allReferrals.length} color={colors.primary} />
        <StatCard label="This Month" value={thisMonth} color={colors.success} />
        <StatCard label="Network Coins" value={ambassador?.total_coins_earned ?? 0} color={colors.warning} />
      </View>

      {/* Referral code card */}
      {ambassador && (
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
          <Text style={styles.codeValue}>{ambassador.referral_code}</Text>
          <View style={styles.codeActions}>
            <TouchableOpacity style={styles.codeBtn} onPress={handleCopy} activeOpacity={0.7}>
              <Ionicons name="copy-outline" size={16} color={colors.primary} />
              <Text style={styles.codeBtnText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.codeBtn} onPress={handleShare} activeOpacity={0.7}>
              <Ionicons name="share-outline" size={16} color={colors.primary} />
              <Text style={styles.codeBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Search bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={16} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor={colors.textLight}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={
          filtered.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filtered.length === 0 ? (
          <EmptyState
            iconName="people-outline"
            title={search.trim() ? 'No results found' : 'No referrals yet'}
            subtitle={
              search.trim()
                ? 'Try a different name'
                : 'Share your referral code to bring people in'
            }
          />
        ) : (
          <View style={styles.listCard}>
            {filtered.map((ref, idx) => (
              <View key={ref.id}>
                <View style={styles.studentRow}>
                  <AvatarCircle
                    name={ref.name}
                    size={44}
                    avatarUrl={ref.avatarUrl}
                  />
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName} numberOfLines={1}>
                      {ref.name}
                    </Text>
                    <Text style={styles.studentSub} numberOfLines={1}>
                      {ref.college}
                    </Text>
                  </View>
                  <Text style={styles.studentDate}>
                    {new Date(ref.date).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short',
                    })}
                  </Text>
                </View>
                {idx < filtered.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingTop: Gap.lg,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: 'rgba(14,14,14,0.6)',
    marginTop: 2,
    fontWeight: Font.medium,
  },
  countPill: {
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  countText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.base,
  },

  // Code card
  codeCard: {
    backgroundColor: colors.surface,
    marginHorizontal: Gap.base,
    borderRadius: radius.lg,
    padding: Gap.lg,
    alignItems: 'center',
    marginBottom: Gap.md,
    ...shadow.sm,
  },
  codeLabel: {
    fontSize: FontSize.micro,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  codeValue: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.text,
    letterSpacing: 4,
    marginTop: Gap.sm,
    marginBottom: Gap.base,
  },
  codeActions: {
    flexDirection: 'row',
    gap: Gap.md,
  },
  codeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.sm,
  },
  codeBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.ink,
  },

  // Search
  searchSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: Gap.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Gap.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.body,
    color: colors.text,
    paddingVertical: 11,
  },

  // List
  listContainer: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: 100,
  },
  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: Gap.md,
  },
  studentInfo: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 14,
    fontWeight: Font.bold,
    color: colors.text,
  },
  studentSub: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
  },
  studentDate: {
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
});
