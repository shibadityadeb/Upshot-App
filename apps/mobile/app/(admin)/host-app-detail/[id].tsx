import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { HostingApplication } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../../src/constants/theme';
import { Button, StatusBadge } from '../../../src/components/common';
import { useAuthStore } from '../../../src/store/auth.store';
import { TouchableOpacity } from 'react-native';
import { showError } from '../../../src/store/error.store';

const api = createApiClient();
const HERO_LIQUID = require('../../../assets/hero-liquid.png');

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon as any} size={16} color={colors.textSecondary} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

export default function HostAppDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [app, setApp] = useState<HostingApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadApp = useCallback(async () => {
    try {
      const { data } = await api.supabase
        .from('hosting_applications')
        .select('*, user:profiles!user_id(id, full_name, email, avatar_url)')
        .eq('id', id)
        .single();
      setApp(data as unknown as HostingApplication);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadApp(); }, [loadApp]);

  const handleApprove = useCallback(async () => {
    if (!user || !id) return;
    setActionLoading(true);
    try {
      const result = await api.hosting.approveApplication(id, user.id);
      if (result.error) {
        showError(result.error);
      } else {
        Alert.alert('Approved', 'Event has been created from this application.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } finally {
      setActionLoading(false);
    }
  }, [user, id, router]);

  const handleReject = useCallback(() => {
    if (!user || !id) return;
    if (Platform.OS === 'ios') {
      Alert.prompt('Rejection Reason', 'Enter reason (optional)', async (reason) => {
        setActionLoading(true);
        try {
          const result = await api.hosting.rejectApplication(id, user.id, reason || undefined);
          if (result.error) showError(result.error);
          else Alert.alert('Rejected', 'Application has been rejected.', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        } finally {
          setActionLoading(false);
        }
      }, 'plain-text');
    } else {
      Alert.alert('Reject Application', 'This hosting application will be rejected.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject', style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await api.hosting.rejectApplication(id, user.id, 'Rejected by admin');
              Alert.alert('Rejected', 'Application has been rejected.', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]);
    }
  }, [user, id, router]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!app) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.textSecondary }}>Application not found</Text>
      </View>
    );
  }

  const applicant = (app as any).user;
  const eventDate = new Date(app.event_date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <View style={styles.safeArea}>
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={columnStyle}>
          <TouchableOpacity style={styles.backPill} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={14} color="#fff" />
            <Text style={styles.backPillText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerEyebrow}>HOSTING APPLICATION</Text>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle} numberOfLines={2}>{app.title}</Text>
            <StatusBadge status={app.status} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, columnStyle]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        {!!app.cover_image_url && (
          <Image source={{ uri: app.cover_image_url }} style={styles.coverImage} resizeMode="cover" />
        )}

        {/* Personal Details */}
        <SectionHeader title="Personal Details" />
        <View style={styles.card}>
          <DetailRow icon="person-outline" label="Name" value={app.applicant_name} />
          <DetailRow icon="call-outline" label="Phone" value={app.applicant_phone} />
          <DetailRow icon="mail-outline" label="Email" value={app.applicant_email} />
          <DetailRow icon="briefcase-outline" label="Event Type" value={app.event_type === 'organisation' ? 'Organisation' : 'Personal'} />
          {applicant && (
            <DetailRow icon="person-circle-outline" label="Account" value={applicant.full_name ?? applicant.email} />
          )}
        </View>

        {/* Organisation Details */}
        {app.event_type === 'organisation' && (
          <>
            <SectionHeader title="Organisation Details" />
            <View style={styles.card}>
              <DetailRow icon="business-outline" label="Legal Name" value={app.org_legal_name} />
              <DetailRow icon="location-outline" label="City" value={app.org_city} />
              <DetailRow icon="map-outline" label="State" value={app.org_state} />
              <DetailRow icon="layers-outline" label="Sector" value={app.org_sector} />
              <DetailRow icon="ribbon-outline" label="Designation" value={app.org_designation} />
            </View>
          </>
        )}

        {/* Event Details */}
        <SectionHeader title="Event Details" />
        <View style={styles.card}>
          <DetailRow icon="text-outline" label="Event Name" value={app.title} />
          <DetailRow icon="pricetag-outline" label="Category" value={app.category} />
          <DetailRow icon="calendar-outline" label="Date" value={eventDate} />
          <DetailRow icon="time-outline" label="Time" value={app.event_time} />
          <DetailRow icon="location-outline" label="City" value={(app as any).event_city} />
          <DetailRow icon="map-outline" label="State" value={(app as any).event_state} />
          <DetailRow icon="navigate-outline" label="Google Maps" value={app.location_url} />
          <DetailRow icon="people-outline" label="Capacity" value={app.max_attendees ? `${app.max_attendees} attendees` : null} />
          <DetailRow icon="cash-outline" label="Fees" value={(app as any).fees != null ? `₹${(app as any).fees}` : 'Free'} />
        </View>

        {/* Description */}
        {!!app.description && (
          <>
            <SectionHeader title="Description" />
            <View style={styles.card}>
              <Text style={styles.descriptionText}>{app.description}</Text>
            </View>
          </>
        )}

        {/* Requirements */}
        {!!app.requirements && (
          <>
            <SectionHeader title="Requirements" />
            <View style={styles.card}>
              <Text style={styles.descriptionText}>{app.requirements}</Text>
            </View>
          </>
        )}

        {/* Rejection reason */}
        {app.status === 'rejected' && !!app.rejection_reason && (
          <>
            <SectionHeader title="Rejection Reason" />
            <View style={[styles.card, { borderColor: colors.error + '33' }]}>
              <Text style={[styles.descriptionText, { color: colors.error }]}>{app.rejection_reason}</Text>
            </View>
          </>
        )}

        {/* Submitted info */}
        <Text style={styles.submittedAt}>
          Submitted {new Date(app.created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </Text>

        {/* Action buttons */}
        {app.status === 'pending' && (
          <View style={styles.actionRow}>
            <Button
              title="Approve"
              variant="primary"
              style={styles.actionBtn}
              onPress={handleApprove}
              disabled={actionLoading}
              loading={actionLoading}
            />
            <Button
              title="Reject"
              variant="outline"
              style={[styles.actionBtn, { borderColor: colors.error }]}
              onPress={handleReject}
              disabled={actionLoading}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(14,14,14,0.45)',
    borderRadius: radius.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
    marginBottom: Gap.md,
  },
  backPillText: {
    fontSize: FontSize.small, fontWeight: Font.semibold, color: '#fff',
  },
  headerEyebrow: {
    fontSize: FontSize.xs, fontWeight: Font.bold,
    color: '#2c3326', letterSpacing: 1.5, marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Gap.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.display, fontWeight: Font.black, color: colors.ink, letterSpacing: -0.7, lineHeight: 34,
  },

  scroll: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: Gap.base },

  coverImage: {
    width: '100%', height: 200,
    borderRadius: radius.xl, marginBottom: Gap.base,
  },

  sectionTitle: {
    fontSize: FontSize.small, fontWeight: Font.bold,
    color: colors.text, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: Gap.sm, marginTop: Gap.base,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Gap.md,
    ...shadow.sm,
  },

  detailRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: FontSize.xs, color: colors.textLight, marginBottom: 1,
  },
  detailValue: {
    fontSize: FontSize.body, color: colors.text, fontWeight: Font.medium,
  },

  descriptionText: {
    fontSize: FontSize.body, color: colors.text, lineHeight: 20,
  },

  submittedAt: {
    fontSize: FontSize.xs, color: colors.textLight,
    textAlign: 'center', marginTop: Gap.lg, marginBottom: Gap.sm,
  },

  actionRow: {
    flexDirection: 'row', gap: Gap.md, marginTop: Gap.md,
  },
  actionBtn: { flex: 1 },
});
