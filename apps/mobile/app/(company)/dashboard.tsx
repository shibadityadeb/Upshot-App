import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
  shadow,
} from '../../src/constants/theme';
import {
  Card,
  Badge,
  StatusBadge,
  Button,
  LoadingScreen,
  StatCard,
  EmptyState,
} from '../../src/components/common';
import type { Event, Company } from '@upshot/types';

const api = createApiClient();

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Dark editorial header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {/* Left: greeting + company name */}
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.companyName}>{company?.name ?? 'Your Company'}</Text>
          </View>
          {/* Right: verified / pending pill */}
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
        {/* UBM watermark */}
        <Text style={styles.watermark}>UBM</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* No company — onboarding */}
        {noCompany ? (
          <View style={styles.onboardingWrapper}>
            <Card style={styles.onboardingCard}>
              <Text style={styles.onboardingTitle}>Complete your company profile</Text>
              <Text style={styles.onboardingSubtitle}>
                Set up your company details so UBM can start matching you with the right talent.
              </Text>
              <Button
                title="Go to profile"
                variant="primary"
                style={{ marginTop: spacing.md }}
                onPress={() => router.push('/(company)/profile')}
              />
            </Card>
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
                  icon="📋"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    backgroundColor: DarkBg,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  companyName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  verifiedPill: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  verifiedText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '700',
  },
  pendingPill: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pendingText: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '700',
  },
  watermark: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    fontSize: 48,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.04)',
  },

  // ── Scroll ────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: 100,
  },

  // ── Stats grid ────────────────────────────────────────────
  statsSection: {
    backgroundColor: colors.background,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },

  // ── Recent projects ───────────────────────────────────────
  projectsSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  projectCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    overflow: 'hidden',
    borderLeftWidth: 3,
    // borderLeftColor is set inline
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  projectRowMeta: {
    marginTop: 6,
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  projectDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  applicantsText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  rejectionReason: {
    fontSize: 12,
    color: colors.error,
    fontStyle: 'italic',
    marginTop: 4,
  },
  viewTeamLink: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 6,
    fontWeight: '600',
  },

  // ── Post requirement CTA ──────────────────────────────────
  ctaSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    backgroundColor: colors.surface,
  },
  ctaCard: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 20,
  },
  ctaTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ctaSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    height: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },

  // ── No company onboarding ─────────────────────────────────
  onboardingWrapper: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  onboardingCard: {
    padding: 20,
    alignItems: 'center',
  },
  onboardingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
});
