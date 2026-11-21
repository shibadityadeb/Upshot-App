import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
  Badge,
  StatusBadge,
  Button,
  LoadingScreen,
  StatCard,
  EmptyState,
} from '../../src/components/common';
import type { Event, Company } from '@upshot/types';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function borderColorForStatus(status: string): string {
  switch (status) {
    case 'pending': return colors.warning;
    case 'approved': return colors.success;
    case 'rejected': return colors.error;
    case 'completed': return colors.primary;
    default: return colors.border;
  }
}

export default function CompanyDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [company, setCompany] = useState<Company | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [noCompany, setNoCompany] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: companyData, error: companyError } = await api.supabase
        .from('companies')
        .select('*')
        .eq('contact_person_id', user.id)
        .single();

      if (companyError || !companyData) {
        setNoCompany(true);
        return;
      }
      setNoCompany(false);
      setCompany(companyData as Company);

      const eventsResult = await api.events.getCompanyEvents(companyData.id);
      if (eventsResult.data) {
        setEvents(eventsResult.data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingScreen />;

  const activeCount = events.filter((e) => e.status === 'approved').length;
  const pendingCount = events.filter((e) => e.status === 'pending').length;
  const totalApplicants = events.reduce((s, e) => s + (e.current_attendees ?? 0), 0);

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <View style={styles.safeArea}>
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={[styles.headerRow, columnStyle]}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.companyName} numberOfLines={1}>{company?.name ?? 'Your Company'}</Text>
          </View>
          {company?.is_verified ? (
            <View style={styles.verifiedPill}>
              <Text style={styles.verifiedText}>Verified ✓</Text>
            </View>
          ) : (
            <View style={styles.pendingPill}>
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={[styles.scrollContent, columnStyle]}
      >
        {/* No company — onboarding */}
        {noCompany ? (
          <View style={styles.onboardingCard}>
            <View style={styles.onboardingIcon}>
              <Ionicons name="business-outline" size={26} color={colors.ink} />
            </View>
            <Text style={styles.onboardingTitle}>Complete your company profile</Text>
            <Text style={styles.onboardingSubtitle}>
              Set up your company details so UBM can start matching you with the right talent.
            </Text>
            <Button
              title="Go to profile"
              variant="primary"
              style={styles.onboardingBtn}
              onPress={() => router.push('/(company)/profile')}
            />
          </View>
        ) : (
          <>
            {/* ── Stats grid ──────────────────────────────────────── */}
            <View style={styles.statsSection}>
              <View style={styles.statsRow}>
                <StatCard label="Total" value={events.length} color={colors.primary} />
                <StatCard label="Active" value={activeCount} color={colors.success} />
              </View>
              <View style={styles.statsRow}>
                <StatCard label="Pending" value={pendingCount} color={colors.warning} />
                <StatCard label="Applicants" value={totalApplicants} color={colors.info} />
              </View>
            </View>

            {/* ── Recent projects ─────────────────────────────────── */}
            <View style={styles.projectsSection}>
              <Text style={styles.sectionTitle}>Recent projects</Text>

              {events.length === 0 ? (
                <EmptyState
                  iconName="briefcase-outline"
                  title="Post your first project"
                  subtitle="Tell UBM what you need and we'll make it happen"
                  action={
                    <Button
                      title="Post a requirement"
                      variant="primary"
                      onPress={() => router.push('/(company)/post')}
                    />
                  }
                />
              ) : (
                recentEvents.map((event) => (
                  <View
                    key={event.id}
                    style={[
                      styles.projectCard,
                      { borderLeftColor: borderColorForStatus(event.status) },
                    ]}
                  >
                    {/* Row 1: title + status badge */}
                    <View style={styles.projectRow}>
                      <Text style={styles.projectTitle} numberOfLines={1}>
                        {event.title}
                      </Text>
                      <StatusBadge status={event.status} />
                    </View>

                    {/* Row 2: category badge + date */}
                    <View style={[styles.projectRow, styles.projectRowMeta]}>
                      <Badge label={event.category ?? 'Event'} color={colors.textSecondary} />
                      <Text style={styles.projectDate}>
                        {new Date(event.event_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>

                    {/* Applicants count */}
                    <Text style={styles.applicantsText}>
                      {event.current_attendees ?? 0} applied
                    </Text>

                    {/* Rejection reason */}
                    {event.status === 'rejected' && event.rejection_reason ? (
                      <Text style={styles.rejectionReason}>{event.rejection_reason}</Text>
                    ) : null}

                    {/* View team link */}
                    {event.status === 'approved' && (event.current_attendees ?? 0) > 0 ? (
                      <TouchableOpacity onPress={() => router.push('/(company)/projects')}>
                        <Text style={styles.viewTeamLink}>View team →</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ))
              )}
            </View>

            {/* ── Post requirement CTA ────────────────────────────── */}
            <View style={styles.ctaSection}>
              <View style={styles.ctaCard}>
                <Text style={styles.ctaTitle}>Ready to work with UBM?</Text>
                <Text style={styles.ctaSubtitle}>
                  Post a project requirement and our team will match you.
                </Text>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => router.push('/(company)/post')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.ctaButtonText}>Post a requirement →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
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

  // ── Header (lime liquid) ──────────────────────────────────
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSize.small,
    color: '#2c3326',
    fontWeight: Font.semibold,
  },
  companyName: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    marginTop: 2,
    letterSpacing: -0.7,
  },
  verifiedPill: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: radius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: FontSize.xs,
    color: colors.success,
    fontWeight: Font.black,
  },
  pendingPill: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: radius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  pendingText: {
    fontSize: FontSize.xs,
    color: colors.warning,
    fontWeight: Font.black,
  },

  // ── Scroll ────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: 100,
  },

  // ── Stats grid ────────────────────────────────────────────
  statsSection: {
    paddingTop: Gap.lg,
    paddingHorizontal: Gap.base,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Gap.md,
    marginBottom: Gap.md,
  },

  // ── Recent projects ───────────────────────────────────────
  projectsSection: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.sm,
  },
  sectionTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.6,
    marginBottom: 14,
  },
  projectCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Gap.md,
    overflow: 'hidden',
    borderLeftWidth: 4,
    ...shadow.sm,
    // borderLeftColor is set inline
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Gap.sm,
  },
  projectRowMeta: {
    marginTop: 8,
  },
  projectTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.black,
    color: colors.ink,
    flex: 1,
    letterSpacing: -0.3,
  },
  projectDate: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    fontWeight: Font.medium,
  },
  applicantsText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontWeight: Font.medium,
    marginTop: 8,
  },
  rejectionReason: {
    fontSize: FontSize.small,
    color: colors.error,
    fontStyle: 'italic',
    marginTop: 6,
  },
  viewTeamLink: {
    fontSize: FontSize.small,
    color: colors.ink,
    marginTop: 8,
    fontWeight: Font.black,
  },

  // ── Post requirement CTA ──────────────────────────────────
  ctaSection: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.base,
  },
  ctaCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xxl,
    padding: Gap.lg,
    overflow: 'hidden',
    ...shadow.sm,
  },
  ctaTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  ctaSubtitle: {
    fontSize: FontSize.small,
    color: '#49503f',
    marginTop: 4,
    fontWeight: Font.medium,
    lineHeight: 18,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    marginTop: Gap.base,
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    height: 44,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: FontSize.body,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },

  // ── No company onboarding ─────────────────────────────────
  onboardingCard: {
    marginHorizontal: Gap.base,
    marginTop: Gap.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.lg,
    alignItems: 'center',
    ...shadow.sm,
  },
  onboardingIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.md,
  },
  onboardingTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.black,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  onboardingSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  onboardingBtn: {
    marginTop: Gap.base,
    alignSelf: 'stretch',
  },
});
