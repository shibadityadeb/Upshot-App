import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { LeaderboardEntry, CampusCartelStats, CampusCartelStatus, CampusCartelMember } from '@upshot/api-client';
import type { Task } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { Button, Input, CoinBadge } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

type ScreenState = 'loading' | 'not_applied' | 'pending' | 'rejected' | 'approved';

export default function CampusCartelScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [currentApp, setCurrentApp] = useState<CampusCartelMember | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [stats, setStats] = useState<CampusCartelStats | null>(null);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);

  // Join form state
  const [code, setCode] = useState('');
  const [codeValid, setCodeValid] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(false);
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [city, setCity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [appResult, statsResult] = await Promise.all([
        api.campusCartel.getApplicationStatus(user.id),
        api.campusCartel.getStats(),
      ]);
      if (statsResult.data) setStats(statsResult.data);

      const app = appResult.data;
      setCurrentApp(app);
      if (!app) {
        setScreenState('not_applied');
      } else if (app.status === 'approved') {
        setScreenState('approved');
        const [rankResult, tasksResult] = await Promise.all([
          api.campusCartel.getMyRank(user.id),
          api.tasks.getMyPendingTasks(user.id),
        ]);
        if (rankResult.data) setMyRank(rankResult.data);
        if (tasksResult.data) setPendingTasks(tasksResult.data.slice(0, 3));
      } else if (app.status === 'rejected') {
        setScreenState('rejected');
      } else {
        setScreenState('pending');
      }
    } catch {
      setScreenState('not_applied');
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Debounced code validation
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = code.trim();
    if (trimmed.length < 3) {
      setCodeValid(null);
      return;
    }
    setValidating(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await api.ambassadors.validateReferralCode(trimmed);
        setCodeValid(result.data?.valid ?? false);
      } catch {
        setCodeValid(false);
      }
      setValidating(false);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [code]);

  const handleApply = async () => {
    if (!user) return;
    const trimmed = code.trim();
    if (trimmed && codeValid === false) {
      Alert.alert('Invalid Code', 'The ambassador code you entered is invalid.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.campusCartel.applyForCampusCartel(
        user.id,
        trimmed || undefined,
        college || undefined,
        course || undefined,
        undefined,
        city || undefined,
      );
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        setJustApplied(true);
        setScreenState('pending');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
    setSubmitting(false);
  };

  const handleWithdraw = () => {
    if (!currentApp) return;
    Alert.alert(
      'Withdraw Application',
      'Are you sure? You can re-apply later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            setWithdrawing(true);
            try {
              await api.supabase
                .from('campus_cartel_members')
                .delete()
                .eq('id', currentApp.id);
              setCurrentApp(null);
              setScreenState('not_applied');
              setCode('');
              setCollege('');
              setCourse('');
              setCity('');
              setCodeValid(null);
              setJustApplied(false);
            } catch {
              Alert.alert('Error', 'Failed to withdraw.');
            }
            setWithdrawing(false);
          },
        },
      ],
    );
  };

  if (screenState === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.campusCartelGreen} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.campusCartelGreen} />
        }
      >
        {/* ── Dark emerald header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerEyebrow}>CAMPUS CARTEL</Text>
          <Text style={styles.headerTitle}>
            India's student{'\n'}network
          </Text>
          {stats && (
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Ionicons name="people-outline" size={14} color={colors.campusCartelTint} />
                <Text style={styles.statText}>{stats.memberCount} members</Text>
              </View>
              <View style={styles.statPill}>
                <Ionicons name="school-outline" size={14} color={colors.campusCartelTint} />
                <Text style={styles.statText}>{stats.uniqueColleges} colleges</Text>
              </View>
              <View style={styles.statPill}>
                <Ionicons name="diamond-outline" size={14} color={colors.campusCartelTint} />
                <Text style={styles.statText}>{stats.totalCoins} coins</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Main content ── */}
        <View style={styles.cardSection}>
          {screenState === 'not_applied' && (
            /* ── Application form ── */
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Apply to Campus Cartel</Text>
              <Text style={styles.cardSubtitle}>
                Fill in your details to apply. Ambassador code is optional.
              </Text>

              <Input
                label="Ambassador Code (optional)"
                placeholder="e.g. JOHN1234"
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
                rightElement={
                  validating ? (
                    <ActivityIndicator size="small" color={colors.textSecondary} />
                  ) : codeValid === true ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  ) : codeValid === false ? (
                    <Ionicons name="close-circle" size={20} color={colors.error} />
                  ) : null
                }
                error={codeValid === false ? 'Invalid code' : undefined}
              />
              <Input
                label="College (optional)"
                placeholder="Your college name"
                value={college}
                onChangeText={setCollege}
              />
              <Input
                label="Course (optional)"
                placeholder="e.g. B.Tech, MBA"
                value={course}
                onChangeText={setCourse}
              />
              <Input
                label="City (optional)"
                placeholder="Your city"
                value={city}
                onChangeText={setCity}
              />

              <Button
                title={submitting ? 'Submitting...' : 'Submit Application'}
                onPress={handleApply}
                loading={submitting}
                disabled={submitting || codeValid === false}
                style={{ backgroundColor: colors.campusCartelGreen }}
              />
            </View>
          )}

          {screenState === 'pending' && (
            /* ── Pending review state ── */
            <View style={styles.card}>
              {justApplied && (
                <View style={styles.successBanner}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.campusCartelGreen} />
                  <Text style={styles.successText}>Application submitted!</Text>
                </View>
              )}

              <View style={styles.pendingIconWrap}>
                <Ionicons name="hourglass-outline" size={48} color={colors.campusCartelGreen} />
              </View>
              <Text style={styles.pendingTitle}>Application Under Review</Text>
              <Text style={styles.pendingSubtitle}>
                Your application is being reviewed by an admin.{'\n'}You'll be notified once it's approved.
              </Text>

              <View style={styles.pendingTip}>
                <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.pendingTipText}>
                  Pull down to refresh and check your status
                </Text>
              </View>

              <View style={styles.pendingActions}>
                <TouchableOpacity
                  style={styles.editAppBtn}
                  onPress={() => router.push('/campus-cartel-apply' as any)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={16} color={colors.campusCartelGreen} />
                  <Text style={styles.editAppBtnText}>Edit Application</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.withdrawBtn}
                  onPress={handleWithdraw}
                  activeOpacity={0.7}
                  disabled={withdrawing}
                >
                  {withdrawing ? (
                    <ActivityIndicator size="small" color={colors.error} />
                  ) : (
                    <>
                      <Ionicons name="close-circle-outline" size={16} color={colors.error} />
                      <Text style={styles.withdrawBtnText}>Withdraw Application</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {screenState === 'rejected' && (
            /* ── Rejected state ── */
            <View style={styles.card}>
              <View style={styles.pendingIconWrap}>
                <Ionicons name="close-circle-outline" size={48} color={colors.error} />
              </View>
              <Text style={styles.pendingTitle}>Application Not Approved</Text>
              <Text style={styles.pendingSubtitle}>
                Unfortunately your application was not approved.{'\n'}Contact your ambassador for more information.
              </Text>

              <View style={styles.pendingActions}>
                <TouchableOpacity
                  style={styles.editAppBtn}
                  onPress={() => router.push('/campus-cartel-apply' as any)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={16} color={colors.campusCartelGreen} />
                  <Text style={styles.editAppBtnText}>Re-apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {screenState === 'approved' && (
            /* ── Member view ── */
            <View style={styles.card}>
              <View style={styles.memberBadgeRow}>
                <View style={styles.memberBadge}>
                  <Ionicons name="shield-checkmark" size={14} color={colors.campusCartelGreen} />
                  <Text style={styles.memberBadgeText}>MEMBER</Text>
                </View>
              </View>

              <View style={styles.memberStatsRow}>
                <View style={styles.memberStatItem}>
                  <Text style={styles.memberStatValue}>{myRank?.current_balance ?? 0}</Text>
                  <Text style={styles.memberStatLabel}>My Coins</Text>
                </View>
                <View style={styles.memberStatDivider} />
                <View style={styles.memberStatItem}>
                  <Text style={styles.memberStatValue}>
                    {myRank ? `#${myRank.rank}` : '--'}
                  </Text>
                  <Text style={styles.memberStatLabel}>My Rank</Text>
                </View>
              </View>

              {/* Pending tasks preview */}
              {pendingTasks.length > 0 && (
                <View style={styles.tasksPreview}>
                  <Text style={styles.tasksPreviewTitle}>Pending Assignments</Text>
                  {pendingTasks.map((task) => (
                    <TouchableOpacity
                      key={task.id}
                      style={styles.taskRow}
                      onPress={() => router.push(`/(people)/task/${task.id}` as any)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.taskInfo}>
                        <Text style={styles.taskName} numberOfLines={1}>{task.title}</Text>
                        <CoinBadge amount={task.coin_value} />
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Button
                title="View Leaderboard"
                onPress={() => router.push('/(people)/leaderboard' as any)}
                variant="outline"
                style={{ borderColor: colors.campusCartelGreen, marginTop: Gap.base }}
                icon={<Ionicons name="trophy-outline" size={16} color={colors.campusCartelGreen} />}
              />
            </View>
          )}
        </View>

        {/* ── How it works ── */}
        <View style={styles.howSection}>
          <Text style={styles.howTitle}>How it works</Text>
          {[
            { step: '1', icon: 'document-text-outline' as const, title: 'Apply with a code', desc: 'Get an ambassador code and submit your application' },
            { step: '2', icon: 'checkmark-done-outline' as const, title: 'Get approved', desc: 'An admin will review and approve your application' },
            { step: '3', icon: 'checkbox-outline' as const, title: 'Complete assignments', desc: 'Do tasks assigned by admins to earn coins' },
            { step: '4', icon: 'trophy-outline' as const, title: 'Climb the leaderboard', desc: 'Earn more coins to rise in the rankings' },
          ].map((item) => (
            <View key={item.step} style={styles.howRow}>
              <View style={styles.howIconCircle}>
                <Ionicons name={item.icon} size={18} color={colors.campusCartelGreen} />
              </View>
              <View style={styles.howInfo}>
                <Text style={styles.howStepTitle}>{item.title}</Text>
                <Text style={styles.howStepDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    backgroundColor: colors.campusCartelGreen,
    paddingTop: Gap.sm,
    paddingBottom: Gap.xl,
    paddingHorizontal: Gap.base,
  },
  backBtn: {
    marginBottom: Gap.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2.5,
    marginBottom: Gap.sm,
  },
  headerTitle: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: '#FFFFFF',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.sm,
    marginTop: Gap.lg,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
    color: colors.campusCartelTint,
  },

  // Card section
  cardSection: {
    paddingHorizontal: Gap.base,
    marginTop: -Gap.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: Gap.lg,
    ...shadow.md,
  },
  cardTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: Gap.xs,
  },
  cardSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    marginBottom: Gap.lg,
  },

  // Success banner
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    backgroundColor: colors.campusCartelTint,
    borderRadius: radius.lg,
    padding: Gap.md,
    marginBottom: Gap.base,
  },
  successText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.campusCartelText,
  },

  // Pending state
  pendingIconWrap: {
    alignItems: 'center',
    marginBottom: Gap.base,
    marginTop: Gap.md,
  },
  pendingTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: Gap.sm,
  },
  pendingSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Gap.lg,
  },
  pendingTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    justifyContent: 'center',
  },
  pendingTipText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
  },
  pendingActions: {
    marginTop: Gap.lg,
    gap: Gap.sm,
  },
  editAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.xs,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.campusCartelGreen + '44',
    backgroundColor: colors.campusCartelGreen + '0A',
  },
  editAppBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.campusCartelGreen,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.xs,
    paddingVertical: 10,
  },
  withdrawBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.error,
  },

  // Member view
  memberBadgeRow: {
    marginBottom: Gap.lg,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    backgroundColor: colors.campusCartelTint,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  memberBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.campusCartelGreen,
    letterSpacing: 1.5,
  },
  memberStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingVertical: Gap.lg,
    paddingHorizontal: Gap.xl,
  },
  memberStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  memberStatValue: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.text,
  },
  memberStatLabel: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memberStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },

  // Tasks preview
  tasksPreview: {
    marginTop: Gap.lg,
  },
  tasksPreviewTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: Gap.md,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Gap.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  taskInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: Gap.sm,
  },
  taskName: {
    fontSize: FontSize.body,
    fontWeight: Font.medium,
    color: colors.text,
    flex: 1,
    marginRight: Gap.sm,
  },

  // How it works
  howSection: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
  },
  howTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: Gap.base,
  },
  howRow: {
    flexDirection: 'row',
    gap: Gap.md,
    marginBottom: Gap.lg,
  },
  howIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.campusCartelTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howInfo: {
    flex: 1,
  },
  howStepTitle: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.text,
  },
  howStepDesc: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
