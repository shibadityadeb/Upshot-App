import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { Ambassador, Student, Task } from '@upshot/types';
import { colors, DarkBg, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import {
  AvatarCircle,
  LoadingScreen,
  EmptyState,
  CoinBadge,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();

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

  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
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
        const studentsResult = await api.ambassadors.getAmbassadorStudents(ambData.id);
        if (studentsResult.data) setStudents(studentsResult.data);
      }

      // Load assigned tasks
      try {
        const tasksResult = await api.tasks.getMyPendingTasks(user.id);
        if (tasksResult.data) setTasks(tasksResult.data);
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

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const pendingTasks = tasks.filter((t) => t.status === 'assigned');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <TouchableOpacity onPress={() => router.replace('/(people)/events' as any)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
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
              <Text style={styles.codeValue}>{ambassador?.referral_code ?? '------'}</Text>
              <TouchableOpacity onPress={handleCopy} style={styles.codeAction} activeOpacity={0.7}>
                <Ionicons name="copy-outline" size={14} color="#FFFFFF" />
                <Text style={styles.codeActionText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleShare} activeOpacity={0.7} style={styles.shareBtn}>
            <Ionicons name="share-social-outline" size={15} color={colors.accent} />
            <Text style={styles.shareBtnText}>Share your code</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statIconWrap, { backgroundColor: colors.primary + '12' }]}>
              <Ionicons name="people-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{ambassador?.referral_count ?? 0}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIconWrap, { backgroundColor: colors.warning + '18' }]}>
              <Ionicons name="diamond-outline" size={18} color={colors.warning} />
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

        {/* ── Assigned Tasks ── */}
        {pendingTasks.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="checkbox-outline" size={18} color={colors.campusCartelGreen} />
              <Text style={styles.cardTitle}>Your Tasks</Text>
            </View>
            <View style={styles.miniList}>
              {pendingTasks.map((task, idx) => (
                <View key={task.id}>
                  <TouchableOpacity
                    style={styles.taskRow}
                    onPress={() => router.push(`/(people)/task/${task.id}` as any)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.miniName} numberOfLines={1}>{task.title}</Text>
                    </View>
                    <CoinBadge amount={task.coin_value ?? 0} />
                    <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
                  </TouchableOpacity>
                  {idx < pendingTasks.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Recent Referrals ── */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="person-add-outline" size={18} color={colors.primary} />
            <Text style={styles.cardTitle}>Recent Referrals</Text>
          </View>
          {recentStudents.length === 0 ? (
            <EmptyState
              iconName="people-outline"
              title="No referrals yet"
              subtitle="Share your referral code to get started"
            />
          ) : (
            <View style={styles.miniList}>
              {recentStudents.map((student, idx) => (
                <View key={student.id}>
                  <View style={styles.miniRow}>
                    <AvatarCircle name={student.user?.full_name ?? 'Student'} size={36} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.miniName} numberOfLines={1}>
                        {student.user?.full_name ?? 'Student'}
                      </Text>
                      <Text style={styles.miniSub} numberOfLines={1}>
                        {student.user?.email ?? ''}
                      </Text>
                    </View>
                    <Text style={styles.miniDate}>
                      {new Date(student.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  {idx < recentStudents.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DarkBg,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Hero ──
  hero: {
    backgroundColor: DarkBg,
    paddingTop: Gap.sm,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.md,
  },
  heroEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 2.5,
    marginBottom: Gap.xs,
  },
  heroName: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  tierChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: Gap.md,
  },
  tierChipText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    letterSpacing: 0.5,
  },
  codeBlock: {
    marginTop: Gap.lg,
  },
  codeLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: Font.bold,
    letterSpacing: 2,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    marginTop: 4,
  },
  codeValue: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  codeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  codeActionText: {
    fontSize: FontSize.small,
    color: '#FFFFFF',
    fontWeight: Font.semibold,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    marginTop: Gap.base,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(123,197,90,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(123,197,90,0.25)',
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  shareBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.accent,
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
    borderRadius: radius.xl,
    padding: Gap.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.sm,
  },
  statValue: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
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
    borderRadius: radius.xl,
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
    fontWeight: Font.bold,
    color: colors.text,
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
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
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
  },

  // ── Tasks ──
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Gap.md,
    paddingVertical: Gap.sm,
    gap: Gap.sm,
  },

  // ── Mini Lists ──
  miniList: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  miniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Gap.md,
    paddingVertical: Gap.sm,
    gap: Gap.sm,
  },
  miniName: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.text,
  },
  miniSub: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
  },
  miniDate: {
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  separator: {
    height: 0.5,
    backgroundColor: colors.border,
    marginHorizontal: Gap.md,
  },
});
