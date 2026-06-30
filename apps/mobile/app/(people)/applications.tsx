import React, { useCallback, useEffect, useState } from 'react';
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
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { EventApplication } from '@upshot/types';
import { Ionicons } from '@expo/vector-icons';
import { colors, Font, FontSize, Gap, radius, shadow, verticalColors } from '../../src/constants/theme';
import { Button, Card, EmptyState, StatusBadge } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();
const GREEN = verticalColors.campusCartel;

type StudentRecord = {
  id: string;
  college: string | null;
  city: string | null;
  state: string | null;
  ambassador_code: string | null;
  referred_by: string | null;
  created_at: string;
  profession: string | null;
};

export default function PeopleApplications() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // ─── Campus Cartel application ───────────────────────────────
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [studentLoading, setStudentLoading] = useState(true);

  // ─── Event applications ──────────────────────────────────────
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawingIds, setWithdrawingIds] = useState<Set<string>>(new Set());

  const loadStudent = useCallback(async () => {
    if (!user?.id) { setStudentLoading(false); return; }
    const { data } = await api.supabase
      .from('students')
      .select('id, college, city, state, ambassador_code, referred_by, created_at, profession')
      .eq('user_id', user.id)
      .maybeSingle();
    setStudent(data ?? null);
    setStudentLoading(false);
  }, [user?.id]);

  const loadApplications = useCallback(async () => {
    if (!user) return;
    try {
      const result = await api.events.getMyApplications(user.id);
      if (result.data) setApplications(result.data);
    } catch (e) {
      console.warn(e);
    } finally {
      setAppLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { loadStudent(); }, [loadStudent]);
  useEffect(() => { loadApplications(); }, [loadApplications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStudent();
    loadApplications();
  }, [loadStudent, loadApplications]);

  const handleWithdraw = useCallback(async (appId: string) => {
    setWithdrawingIds((prev) => new Set(prev).add(appId));
    try {
      await api.events.withdrawApplication(appId);
      await loadApplications();
    } finally {
      setWithdrawingIds((prev) => { const s = new Set(prev); s.delete(appId); return s; });
    }
  }, [loadApplications]);

  const confirmWithdraw = useCallback((appId: string) => {
    Alert.alert('Withdraw Application', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Withdraw', style: 'destructive', onPress: () => handleWithdraw(appId) },
    ]);
  }, [handleWithdraw]);

  if (studentLoading && appLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Dark header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.headerSubtitle}>Track your submissions</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* ── Campus Cartel Section ── */}
        <Text style={styles.sectionTitle}>Campus Cartel</Text>

        {studentLoading ? (
          <View style={styles.miniLoader}>
            <ActivityIndicator size="small" color={GREEN} />
          </View>
        ) : student ? (
          <View style={styles.ccCard}>
            {/* Header row */}
            <View style={styles.ccCardHeader}>
              <View style={styles.ccIconBadge}>
                <Ionicons name="people" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ccCardTitle}>Campus Cartel</Text>
                <Text style={styles.ccCardSub}>Application submitted</Text>
              </View>
              <View style={styles.ccStatusBadge}>
                <Ionicons name="checkmark-circle" size={14} color={GREEN} />
                <Text style={styles.ccStatusText}>Active</Text>
              </View>
            </View>

            <View style={styles.ccDivider} />

            {/* Details grid */}
            <View style={styles.ccDetailsGrid}>
              <View style={styles.ccDetailItem}>
                <Ionicons name="school-outline" size={14} color={colors.textSecondary} />
                <View>
                  <Text style={styles.ccDetailLabel}>College</Text>
                  <Text style={styles.ccDetailValue}>{student.college ?? '—'}</Text>
                </View>
              </View>

              {(student.city || student.state) && (
                <View style={styles.ccDetailItem}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <View>
                    <Text style={styles.ccDetailLabel}>Location</Text>
                    <Text style={styles.ccDetailValue}>
                      {[student.city, student.state].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                </View>
              )}

              {student.ambassador_code && (
                <View style={styles.ccDetailItem}>
                  <Ionicons name="gift-outline" size={14} color={colors.textSecondary} />
                  <View>
                    <Text style={styles.ccDetailLabel}>Referred via</Text>
                    <Text style={[styles.ccDetailValue, { color: GREEN, fontWeight: Font.bold }]}>
                      {student.ambassador_code}
                    </Text>
                  </View>
                </View>
              )}

              {!student.ambassador_code && (
                <View style={styles.ccDetailItem}>
                  <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
                  <View>
                    <Text style={styles.ccDetailLabel}>Type</Text>
                    <Text style={styles.ccDetailValue}>Regular Student</Text>
                  </View>
                </View>
              )}

              <View style={styles.ccDetailItem}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                <View>
                  <Text style={styles.ccDetailLabel}>Applied on</Text>
                  <Text style={styles.ccDetailValue}>
                    {new Date(student.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.ccEditBtn}
              onPress={() => router.push('/campus-cartel-apply' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={14} color={GREEN} />
              <Text style={styles.ccEditBtnText}>Update Application</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.ccEmptyCard}
            onPress={() => router.push('/campus-cartel-apply' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.ccIconBadge, { backgroundColor: colors.border }]}>
              <Ionicons name="people-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ccEmptyTitle}>Join Campus Cartel</Text>
              <Text style={styles.ccEmptySub}>India's fastest growing student network</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>
        )}

        {/* ── Event Applications Section ── */}
        <Text style={[styles.sectionTitle, { marginTop: Gap.xl }]}>Event Applications</Text>

        {appLoading ? (
          <View style={styles.miniLoader}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : applications.length === 0 ? (
          <EmptyState
            iconName="document-text-outline"
            title="No event applications yet"
            subtitle="Discover opportunities and start applying"
          />
        ) : (
          applications.map((app) => {
            const isWithdrawing = withdrawingIds.has(app.id);
            return (
              <Card key={app.id} style={styles.appCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.eventTitle} numberOfLines={2}>{app.event?.title ?? 'Event'}</Text>
                  <StatusBadge status={app.status} />
                </View>

                {!!app.event?.location && (
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.eventMeta} numberOfLines={1}>{app.event.location}</Text>
                  </View>
                )}

                {!!app.event?.event_date && (
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.eventMeta}>
                      {new Date(app.event.event_date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </Text>
                  </View>
                )}

                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={13} color={colors.textLight} />
                  <Text style={styles.appliedDate}>
                    Applied {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>

                {!!app.note && <Text style={styles.noteText} numberOfLines={2}>{app.note}</Text>}

                {app.status === 'pending' && (
                  <View style={styles.actionRow}>
                    <Button title="Withdraw" onPress={() => confirmWithdraw(app.id)} variant="outline" size="sm" loading={isWithdrawing} disabled={isWithdrawing} />
                  </View>
                )}
                {app.status === 'approved' && <Text style={styles.approvedText}>You are confirmed!</Text>}
                {app.status === 'rejected' && !!(app as any).rejection_reason && (
                  <Text style={styles.rejectedNote}>{(app as any).rejection_reason}</Text>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: Gap.base, paddingTop: Gap.md, paddingBottom: 100 },

  header: {
    backgroundColor: colors.dark,
    paddingTop: Gap.lg,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
  },
  headerTitle: { fontSize: FontSize.h1, fontWeight: Font.black, color: colors.surface },
  headerSubtitle: { fontSize: FontSize.small, color: 'rgba(255,255,255,0.55)', marginTop: 2 },

  sectionTitle: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Gap.sm,
    marginTop: Gap.md,
  },

  miniLoader: { paddingVertical: Gap.xl, alignItems: 'center' },

  // ── Campus Cartel card ──────────────────────────────────────
  ccCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: Gap.base,
    borderWidth: 1.5,
    borderColor: GREEN + '33',
    ...shadow.md,
  },
  ccCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Gap.md },
  ccIconBadge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center',
  },
  ccCardTitle: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.text },
  ccCardSub: { fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 1 },
  ccStatusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: GREEN + '15', borderRadius: radius.full,
    paddingHorizontal: Gap.sm, paddingVertical: 4,
  },
  ccStatusText: { fontSize: FontSize.xs, fontWeight: Font.bold, color: GREEN },
  ccDivider: { height: 1, backgroundColor: colors.border, marginVertical: Gap.md },
  ccDetailsGrid: { gap: Gap.md },
  ccDetailItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Gap.sm },
  ccDetailLabel: { fontSize: FontSize.xs, color: colors.textLight, marginBottom: 1 },
  ccDetailValue: { fontSize: FontSize.small, fontWeight: Font.medium, color: colors.text },
  ccEditBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Gap.xs, marginTop: Gap.md, paddingVertical: Gap.sm,
    borderRadius: radius.lg, borderWidth: 1, borderColor: GREEN + '44',
    backgroundColor: GREEN + '0A',
  },
  ccEditBtnText: { fontSize: FontSize.small, fontWeight: Font.semibold, color: GREEN },

  // ── Campus Cartel empty state ───────────────────────────────
  ccEmptyCard: {
    flexDirection: 'row', alignItems: 'center', gap: Gap.md,
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: Gap.base, borderWidth: 1, borderColor: colors.border,
    ...shadow.sm,
  },
  ccEmptyTitle: { fontSize: FontSize.body, fontWeight: Font.semibold, color: colors.text },
  ccEmptySub: { fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 },

  // ── Event applications ──────────────────────────────────────
  appCard: { marginBottom: Gap.sm, padding: Gap.base },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Gap.sm, marginBottom: Gap.sm },
  eventTitle: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.text, flex: 1, lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  eventMeta: { fontSize: FontSize.small, color: colors.textSecondary, flex: 1 },
  appliedDate: { fontSize: FontSize.xs, color: colors.textLight },
  noteText: { fontSize: FontSize.small, color: colors.textSecondary, fontStyle: 'italic', marginTop: Gap.xs },
  actionRow: { marginTop: Gap.sm, flexDirection: 'row' },
  approvedText: { marginTop: Gap.sm, fontSize: FontSize.body, fontWeight: Font.semibold, color: colors.success },
  rejectedNote: { marginTop: Gap.sm, fontSize: FontSize.small, color: colors.error, fontStyle: 'italic' },
});
