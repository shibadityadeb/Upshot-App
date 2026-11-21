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
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { Ambassador, Task } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { LoadingScreen } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

const TIER_THRESHOLDS: Record<string, number> = { newbie: 0, bronze: 500, silver: 1000, gold: 2500, legend: 5000 };
const TIER_ORDER = ['newbie', 'bronze', 'silver', 'gold', 'legend'] as const;
const TIER_COLORS: Record<string, string> = {
  newbie: '#6B7280',
  bronze: '#CD7F32',
  silver: '#9CA3AF',
  gold: '#F59E0B',
  legend: '#8B5CF6',
};
const TIER_ICONS: Record<string, string> = {
  newbie: 'leaf-outline',
  bronze: 'shield-outline',
  silver: 'shield-half-outline',
  gold: 'shield',
  legend: 'diamond',
};

// DB stores 'platinum', UI shows 'legend'; DB 'bronze' with 0 coins shows 'newbie'
function dbTierToDisplay(dbTier: string, coins: number): string {
  if (dbTier === 'platinum') return 'legend';
  if (dbTier === 'bronze' && coins < 500) return 'newbie';
  return dbTier;
}

function getCurrentTier(coins: number): string {
  if (coins >= TIER_THRESHOLDS.legend) return 'legend';
  if (coins >= TIER_THRESHOLDS.gold) return 'gold';
  if (coins >= TIER_THRESHOLDS.silver) return 'silver';
  if (coins >= TIER_THRESHOLDS.bronze) return 'bronze';
  return 'newbie';
}

export default function AmbassadorDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const ambassadorResult = await api.ambassadors.getMyAmbassadorProfile(user.id);

      if (ambassadorResult.data) {
        let ambData = ambassadorResult.data;

        // Generate a unique referral code if missing or not in UBM- format
        const rc = ambData.referral_code;
        const hasValidCode = typeof rc === 'string' && rc.length > 3 && rc.startsWith('UBM-');
        if (!hasValidCode) {
          // Try DB RPC first, fall back to client-side generation
          let newCode: string;
          try {
            const { data: generated, error: rpcErr } = await api.supabase.rpc('generate_random_code');
            if (rpcErr || !generated) throw new Error('RPC failed');
            newCode = generated as string;
          } catch {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let part1 = '', part2 = '';
            for (let i = 0; i < 4; i++) {
              part1 += chars[Math.floor(Math.random() * chars.length)];
              part2 += chars[Math.floor(Math.random() * chars.length)];
            }
            newCode = `UBM-${part1}-${part2}`;
          }
          const { error: updateErr } = await api.supabase
            .from('ambassadors')
            .update({ referral_code: newCode })
            .eq('id', ambData.id);
          if (!updateErr) {
            ambData = { ...ambData, referral_code: newCode };
          }
        }

        setAmbassador(ambData);
      }

      // Load personal tasks plus group tasks for campus cartel / ambassadors
      try {
        const [myResult, groupResult] = await Promise.all([
          api.tasks.getMyPendingTasks(user.id),
          api.tasks.getTasksForGroup(['campus_cartel', 'ambassadors'], user.id),
        ]);
        const myTasks = myResult.data ?? [];
        const ids = new Set(myTasks.map((t) => t.id));
        const groupTasks = (groupResult.data ?? []).filter((t) => !ids.has(t.id));
        setTasks([...myTasks, ...groupTasks]);
      } catch {
        // silent
      }
    } catch {
      showError(null, { context: 'Failed to load dashboard data.' });
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
    Alert.alert('Copied!', 'Referral code copied to clipboard.');
  };

  const handleShare = () => {
    if (!ambassador?.referral_code) return;
    Share.share({
      message: `Join Upshot Brand Media! Use my referral code: ${ambassador.referral_code}`,
    });
  };

  if (loading) return <LoadingScreen />;

  const totalEarned = ambassador?.total_coins_earned ?? 0;
  const currentTier = ambassador ? dbTierToDisplay(ambassador.tier, totalEarned) : getCurrentTier(totalEarned);
  const tierColor = TIER_COLORS[currentTier];
  const currentTierIdx = TIER_ORDER.indexOf(currentTier as any);
  const nextTier = TIER_ORDER[currentTierIdx + 1] ?? null;
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : null;
  const progress = nextThreshold ? Math.min(1, totalEarned / nextThreshold) : 1;

  const pendingTasks = tasks.filter((t) => t.status === 'assigned');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.ink} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Lime liquid hero ── */}
        <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
          <Image source={HERO_LIQUID} style={styles.heroBg} resizeMode="cover" />
          <View style={columnStyle}>
            {/* Ambassadors are community members too — this drops back into the
                people area (its layout admits the ambassador role). */}
            <TouchableOpacity
              onPress={() => router.replace('/(people)/events' as any)}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={colors.ink} />
            </TouchableOpacity>

            <Text style={styles.heroEyebrow}>AMBASSADOR</Text>
            <Text style={styles.heroName}>{user?.full_name ?? 'Ambassador'}</Text>

            <View style={[styles.tierChip, { borderColor: tierColor }]}>
              <Ionicons name={TIER_ICONS[currentTier] as any} size={13} color={tierColor} />
              <Text style={[styles.tierChipText, { color: tierColor }]}>
                {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
              </Text>
            </View>

            {/* Referral code */}
            <View style={styles.codeBlock}>
              <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
              <View style={styles.codeRow}>
                <Text style={styles.codeValue} numberOfLines={1} adjustsFontSizeToFit>
                  {ambassador?.referral_code ?? '------'}
                </Text>
                <TouchableOpacity onPress={handleCopy} style={styles.codeAction} activeOpacity={0.7}>
                  <Ionicons name="copy-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.codeActionText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleShare} activeOpacity={0.7} style={styles.shareBtn}>
              <Ionicons name="share-social-outline" size={15} color="#FFFFFF" />
              <Text style={styles.shareBtnText}>Share your code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={columnStyle}>
          {/* ── Stats ── */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIconWrap, { backgroundColor: colors.primaryTint }]}>
                <Ionicons name="people-outline" size={18} color={colors.ink} />
              </View>
              <Text style={styles.statValue}>{ambassador?.referral_count ?? 0}</Text>
              <Text style={styles.statLabel}>Referrals</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconWrap, { backgroundColor: '#FDF0D5' }]}>
                <Ionicons name="diamond-outline" size={18} color="#E3A017" />
              </View>
              <Text style={styles.statValue}>{totalEarned}</Text>
              <Text style={styles.statLabel}>Coins Earned</Text>
            </View>
          </View>

          {/* ── Coins Info ── */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={16} color={colors.campusCartelGreen} />
            <Text style={styles.infoText}>12 referrals = 20 coins</Text>
          </View>

          {/* ── Tier Progress ── */}
          <View style={styles.card}>
            <View style={styles.progressHeader}>
              <Text style={styles.cardTitle}>
                {nextTier
                  ? `Progress to ${nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}`
                  : 'Maximum tier reached'}
              </Text>
              <Text style={styles.progressCount}>
                {totalEarned} / {nextThreshold ?? '---'} coins
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: tierColor }]}
              />
            </View>
            <View style={styles.tierLegend}>
              {TIER_ORDER.map((t) => (
                <View key={t} style={styles.tierLegendItem}>
                  <View style={[styles.tierLegendDot, { backgroundColor: TIER_COLORS[t] }]} />
                  <Text style={styles.tierLegendLabel}>
                    {t.charAt(0).toUpperCase() + t.slice(1)} ({TIER_THRESHOLDS[t]})
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Tasks — full list lives on its own page ── */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/(ambassador)/tasks' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.tasksLinkRow}>
              <View style={styles.tasksLinkIcon}>
                <Ionicons name="checkbox-outline" size={20} color={colors.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Tasks</Text>
                <Text style={styles.tasksLinkSub}>
                  {pendingTasks.length > 0
                    ? `${pendingTasks.length} pending task${pendingTasks.length !== 1 ? 's' : ''} for you`
                    : 'No pending tasks right now'}
                </Text>
              </View>
              {pendingTasks.length > 0 && (
                <View style={styles.tasksLinkBadge}>
                  <Text style={styles.tasksLinkBadgeText}>{pendingTasks.length}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </View>
          </TouchableOpacity>

          {/* ── Referrals summary (count only — referred people stay private) ── */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="person-add-outline" size={18} color={colors.ink} />
              <Text style={styles.cardTitle}>Referrals</Text>
            </View>
            <View style={styles.referralSummary}>
              <Text style={styles.referralCount}>{ambassador?.referral_count ?? 0}</Text>
              <Text style={styles.referralHint}>
                {(ambassador?.referral_count ?? 0) === 0
                  ? 'Share your referral code to get started'
                  : `${(ambassador?.referral_count ?? 0) === 1 ? 'person has' : 'people have'} joined with your code`}
              </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Hero (lime liquid) ──
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  heroBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.md,
  },
  heroEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    color: '#2c3326',
    letterSpacing: 2.5,
    marginBottom: Gap.xs,
  },
  heroName: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.7,
  },
  tierChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: Gap.md,
  },
  tierChipText: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    letterSpacing: 0.5,
  },
  codeBlock: {
    marginTop: Gap.lg,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: radius.xl,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
  },
  codeLabel: {
    fontSize: FontSize.micro,
    color: '#2c3326',
    fontWeight: Font.black,
    letterSpacing: 2,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    marginTop: 4,
  },
  codeValue: {
    flex: 1,
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: 2,
  },
  codeAction: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  codeActionText: {
    fontSize: FontSize.small,
    color: '#FFFFFF',
    fontWeight: Font.black,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    marginTop: Gap.base,
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  shareBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },

  // ── Stats Grid ──
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Gap.base,
    paddingTop: Gap.lg,
    paddingBottom: Gap.sm,
    gap: Gap.sm,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    padding: Gap.base,
    alignItems: 'center',
    ...shadow.sm,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.sm,
  },
  statValue: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    fontWeight: Font.semibold,
    marginTop: 2,
  },

  // ── Info card ──
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    marginHorizontal: Gap.base,
    marginTop: Gap.sm,
    backgroundColor: colors.campusCartelTint,
    borderRadius: radius.lg,
    paddingHorizontal: Gap.md,
    paddingVertical: Gap.sm,
  },
  infoText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.campusCartelText,
  },

  // ── Cards ──
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    marginHorizontal: Gap.base,
    marginTop: Gap.md,
    padding: Gap.base,
    ...shadow.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    marginBottom: Gap.md,
  },
  cardTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.3,
  },

  // ── Progress ──
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.sm,
  },
  progressCount: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    fontWeight: Font.semibold,
  },
  progressBarBg: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: radius.full,
  },
  tierLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.sm,
    marginTop: Gap.md,
  },
  tierLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tierLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tierLegendLabel: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    fontWeight: Font.medium,
  },

  // ── Tasks link ──
  tasksLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
  },
  tasksLinkIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksLinkSub: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontWeight: Font.medium,
    marginTop: 2,
  },
  tasksLinkBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  tasksLinkBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },
  referralSummary: {
    alignItems: 'center',
    paddingVertical: Gap.lg,
  },
  referralCount: {
    fontSize: 44,
    fontWeight: Font.black,
    color: colors.ink,
    lineHeight: 50,
    letterSpacing: -1,
  },
  referralHint: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontWeight: Font.medium,
    marginTop: 4,
    textAlign: 'center',
  },
});
