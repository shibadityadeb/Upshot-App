import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Clipboard,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import type { Ambassador, Student } from '@upshot/types';
import { colors } from '../../src/constants/theme';
import {
  AvatarCircle,
  LoadingScreen,
  EmptyState,
  StatCard,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

const TIER_COLORS: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#9CA3AF',
  gold: '#F59E0B',
  platinum: '#8B5CF6',
};

const tierThresholds = { bronze: 0, silver: 500, gold: 2000, platinum: 5000 };
const TIER_ORDER: Array<'bronze' | 'silver' | 'gold' | 'platinum'> = [
  'bronze',
  'silver',
  'gold',
  'platinum',
];

interface LeaderboardEntry {
  user_id: string;
  total_earned: number;
  profiles: { id: string; full_name: string } | null;
}

export default function AmbassadorDashboard() {
  const user = useAuthStore((s) => s.user);

  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [ambassadorResult, leaderboardResult] = await Promise.all([
        api.ambassadors.getMyAmbassadorProfile(user.id),
        api.supabase
          .from('wallet_balances')
          .select('*, profiles(id, full_name)')
          .order('total_earned', { ascending: false })
          .limit(10),
      ]);

      if (ambassadorResult.data) {
        setAmbassador(ambassadorResult.data);
        const studentsResult = await api.ambassadors.getAmbassadorStudents(
          ambassadorResult.data.id
        );
        if (studentsResult.data) {
          setStudents(studentsResult.data);
        }
      }

      if (leaderboardResult.data) {
        setLeaderboard(leaderboardResult.data as LeaderboardEntry[]);
      }
    } catch {
      Alert.alert('Error', 'Failed to load dashboard data.');
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

  const handleCopy = () => {
    if (!ambassador) return;
    Clipboard.setString(ambassador.referral_code);
    Alert.alert('Copied!', 'Referral code copied');
  };

  const handleShare = () => {
    if (!ambassador) return;
    Share.share({
      message: `Join Upshot Brand Media! Use my referral code: ${ambassador.referral_code}`,
    });
  };

  if (loading) return <LoadingScreen />;

  const currentTierIdx = ambassador ? TIER_ORDER.indexOf(ambassador.tier) : 0;
  const nextTier = TIER_ORDER[currentTierIdx + 1] ?? null;
  const nextThreshold = nextTier ? tierThresholds[nextTier] : null;
  const totalEarned = ambassador?.total_coins_earned ?? 0;
  const progress = nextThreshold ? Math.min(1, totalEarned / nextThreshold) : 1;

  const rankInLeaderboard =
    ambassador && leaderboard.length > 0
      ? leaderboard.findIndex((e) => e.user_id === user?.id) + 1
      : 0;
  const rankDisplay = rankInLeaderboard > 0 ? `#${rankInLeaderboard}` : 'N/A';

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const topThree = leaderboard.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Identity Card */}
        <View style={styles.identityCard}>
          <Text style={styles.identityName}>{user?.full_name ?? 'Ambassador'}</Text>

          <View style={styles.ambassadorChip}>
            <Text style={styles.ambassadorChipText}>AMBASSADOR</Text>
          </View>

          <View style={styles.referralBlock}>
            <Text style={styles.referralLabel}>YOUR CODE</Text>
            <View style={styles.codeRow}>
              <Text style={styles.referralCode}>{ambassador?.referral_code ?? '------'}</Text>
              <TouchableOpacity onPress={handleCopy} style={styles.copyButton} activeOpacity={0.7}>
                <Text style={styles.copyIcon}>🔗</Text>
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {ambassador && (
            <View style={styles.tierBadgeRow}>
              <View
                style={[
                  styles.tierDot,
                  { backgroundColor: TIER_COLORS[ambassador.tier] ?? colors.warning },
                ]}
              />
              <Text style={styles.tierName}>
                {ambassador.tier.charAt(0).toUpperCase() + ambassador.tier.slice(1)}
              </Text>
              <Text style={styles.tierMeta}>
                {'· '}
                {ambassador.referral_count ?? 0}
                {' referrals · '}
                {ambassador.total_coins_earned ?? 0}
                {' coins'}
              </Text>
            </View>
          )}

          <TouchableOpacity onPress={handleShare} activeOpacity={0.7} style={styles.shareButton}>
            <View style={styles.shareButtonInner}>
              <Text style={styles.shareButtonText}>Share your code</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progress to next tier */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLeft}>
              {nextTier
                ? `Progress to ${nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}`
                : 'Maximum tier reached'}
            </Text>
            <Text style={styles.progressRight}>
              {totalEarned} / {nextThreshold ?? '∞'} coins
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: TIER_COLORS[ambassador?.tier ?? 'bronze'],
                },
              ]}
            />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            label="Total Referrals"
            value={ambassador?.referral_count ?? 0}
            color={colors.primary}
          />
          <StatCard
            label="Coins Earned"
            value={ambassador?.total_coins_earned ?? 0}
            color={colors.warning}
          />
          <StatCard
            label="Rank"
            value={rankDisplay}
            color={colors.info}
          />
        </View>

        {/* Recent Referrals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Referrals</Text>
        </View>

        {recentStudents.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <EmptyState
              icon="👥"
              title="No referrals yet"
              subtitle="Share your referral code to get started"
            />
          </View>
        ) : (
          <View style={styles.listSection}>
            <View style={styles.borderedList}>
              {recentStudents.map((student, idx) => (
                <View key={student.id}>
                  <View style={styles.referralRow}>
                    <AvatarCircle
                      name={student.user?.full_name ?? 'Student'}
                      size={40}
                    />
                    <View style={styles.referralInfo}>
                      <Text style={styles.referralName} numberOfLines={1}>
                        {student.user?.full_name ?? 'Student'}
                      </Text>
                      <Text style={styles.referralCollege} numberOfLines={1}>
                        {student.user?.email ?? ''}
                      </Text>
                    </View>
                    <Text style={styles.referralDate}>
                      {new Date(student.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  {idx < recentStudents.length - 1 && (
                    <View style={styles.rowSeparator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Ambassadors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Ambassadors</Text>
        </View>

        {topThree.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <EmptyState iconName="trophy-outline" title="No leaderboard data" />
          </View>
        ) : (
          <View style={styles.leaderSection}>
            <View style={styles.borderedList}>
              {topThree.map((entry, idx) => (
                <View key={entry.user_id ?? idx}>
                  <View style={styles.leaderRow}>
                    <View
                      style={[
                        styles.rankCircle,
                        {
                          backgroundColor:
                            idx === 0 ? '#F59E0B' : '#E4E4E7',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rankNumber,
                          {
                            color: idx === 0 ? '#FFFFFF' : colors.textSecondary,
                          },
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    </View>
                    <Text style={styles.leaderName} numberOfLines={1}>
                      {entry.profiles?.full_name ?? 'Unknown'}
                    </Text>
                    <Text style={styles.leaderCoins}>{entry.total_earned} coins</Text>
                  </View>
                  {idx < topThree.length - 1 && (
                    <View style={styles.rowSeparator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F5',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Identity card
  identityCard: {
    backgroundColor: '#0D0F1C',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  identityName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ambassadorChip: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#7BC55A',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  ambassadorChipText: {
    fontSize: 11,
    color: '#7BC55A',
    fontWeight: '700',
    letterSpacing: 2,
  },
  referralBlock: {
    marginTop: 20,
  },
  referralLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  referralCode: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  copyButton: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyIcon: {
    fontSize: 14,
  },
  copyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tierBadgeRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tierName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tierMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  shareButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  shareButtonInner: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shareButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Progress section
  progressSection: {
    backgroundColor: '#F0F0F5',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLeft: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressRight: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E4E4E7',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },

  // Stats row
  statsRow: {
    backgroundColor: '#F0F0F5',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // Section header
  sectionHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0D0D',
  },

  // List sections (recent referrals + leaderboard)
  listSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  leaderSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  borderedList: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    overflow: 'hidden',
  },

  // Empty state wrapper
  emptyWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Referral row
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D0D0D',
  },
  referralCollege: {
    fontSize: 12,
    color: '#6B7280',
  },
  referralDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Row separator
  rowSeparator: {
    height: 0.5,
    backgroundColor: '#E4E4E7',
    marginHorizontal: 14,
  },

  // Leader row
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rankCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  leaderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D0D0D',
    flex: 1,
  },
  leaderCoins: {
    fontSize: 13,
    color: '#6B7280',
  },
});
