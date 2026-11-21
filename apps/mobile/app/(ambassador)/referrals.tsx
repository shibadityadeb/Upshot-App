import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Ambassador, Student } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { LoadingScreen, StatCard } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

export default function AmbassadorReferrals() {
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
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

  // Only counts are shown — the referred people themselves stay private.
  const referralDates = [
    ...students.map((s) => s.created_at),
    ...cartelReferrals
      .filter((cr) => !students.some((s) => s.user_id === cr.user_id))
      .map((cr) => cr.joined_at),
  ];

  const totalReferrals = referralDates.length;
  const thisMonth = referralDates.filter((dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <View style={styles.safeArea}>
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={columnStyle}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Referrals</Text>
            {totalReferrals > 0 && (
              <View style={styles.countPill}>
                <Text style={styles.countText}>{totalReferrals} total</Text>
              </View>
            )}
          </View>
          <Text style={styles.headerSubtitle}>How many people joined using your code</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.listContainer, columnStyle]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard label="Total Referred" value={totalReferrals} color={colors.primary} />
          <StatCard label="This Month" value={thisMonth} color={colors.success} />
          <StatCard label="Network Coins" value={ambassador?.total_coins_earned ?? 0} color={colors.warning} />
        </View>

        {/* Referral code card */}
        {ambassador && (
          <View style={styles.codeCard}>
            <View style={styles.codeIcon}>
              <Ionicons name="gift-outline" size={20} color={colors.ink} />
            </View>
            <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
            <Text style={styles.codeValue}>{ambassador.referral_code}</Text>
            <View style={styles.codeActions}>
              <TouchableOpacity style={styles.codeBtn} onPress={handleCopy} activeOpacity={0.85}>
                <Ionicons name="copy-outline" size={16} color={colors.onPrimary} />
                <Text style={styles.codeBtnText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.codeBtnDark} onPress={handleShare} activeOpacity={0.85}>
                <Ionicons name="share-outline" size={16} color="#FFFFFF" />
                <Text style={styles.codeBtnDarkText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header (lime liquid)
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.7,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: '#2c3326',
    marginTop: 3,
    fontWeight: Font.semibold,
  },
  countPill: {
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  countText: {
    fontSize: FontSize.small,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },

  // List
  listContainer: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xs,
    paddingBottom: 100,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    paddingVertical: Gap.base,
  },

  // Code card
  codeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    padding: Gap.lg,
    alignItems: 'center',
    marginBottom: Gap.md,
    ...shadow.sm,
  },
  codeIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.md,
  },
  codeLabel: {
    fontSize: FontSize.micro,
    fontWeight: Font.black,
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  codeValue: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
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
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: Gap.lg,
    paddingVertical: Gap.sm,
  },
  codeBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.black,
    color: colors.onPrimary,
  },
  codeBtnDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: Gap.lg,
    paddingVertical: Gap.sm,
  },
  codeBtnDarkText: {
    fontSize: FontSize.body,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },
});
