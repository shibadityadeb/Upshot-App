import React, { useCallback, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { SponsorInquiry, SponsorInquiryStatus } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { FilterPills } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const api = createApiClient();

const STATUS_STYLE: Record<SponsorInquiryStatus, { bg: string; fg: string; label: string }> = {
  pending: { bg: '#FEF3C7', fg: '#92400E', label: 'New' },
  contacted: { bg: '#DBEAFE', fg: '#1E40AF', label: 'Contacted' },
  accepted: { bg: '#DCF5E1', fg: '#2C6E38', label: 'Accepted' },
  declined: { bg: '#FEE2E2', fg: '#991B1B', label: 'Declined' },
};

type Filter = 'pending' | 'contacted' | 'accepted' | 'declined' | 'all';

export default function AdminSponsorsScreen() {
  const user = useAuthStore((s) => s.user);

  const [inquiries, setInquiries] = useState<SponsorInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('pending');

  const load = useCallback(async () => {
    const { data, error } = await api.sponsors.getAllInquiriesAdmin();
    if (error) showError(error);
    setInquiries(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const count = (s: Filter) =>
    s === 'all' ? inquiries.length : inquiries.filter((i) => i.status === s).length;
  const visible = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);

  const handleSetStatus = useCallback(
    (inq: SponsorInquiry, status: SponsorInquiryStatus) => {
      if (!user?.id) return;
      const verb = status === 'accepted' ? 'Accept' : status === 'contacted' ? 'Mark as contacted' : 'Decline';
      Alert.alert(`${verb}?`, inq.company_name, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: verb,
          style: status === 'declined' ? 'destructive' : 'default',
          onPress: async () => {
            const { error } = await api.sponsors.updateInquiryStatus(inq.id, user.id, status);
            if (error) { showError(error); return; }
            load();
          },
        },
      ]);
    },
    [user?.id, load],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Sponsors</Text>
        <Text style={styles.heroSub}>
          {count('pending')} new · {inquiries.length} total
        </Text>
      </View>

      <FilterPills
        options={[
          { label: `New (${count('pending')})`, value: 'pending' },
          { label: 'Contacted', value: 'contacted' },
          { label: 'Accepted', value: 'accepted' },
          { label: 'Declined', value: 'declined' },
          { label: 'All', value: 'all' },
        ]}
        activeValue={filter}
        onChange={(v) => setFilter(v as Filter)}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color={colors.ink} style={{ marginTop: 40 }} />
        ) : visible.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No sponsor inquiries</Text>
            <Text style={styles.emptySubtitle}>
              When someone taps Sponsor on a workshop, it shows up here
            </Text>
          </View>
        ) : (
          visible.map((inq) => {
            const s = STATUS_STYLE[inq.status];
            return (
              <View key={inq.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.company}>{inq.company_name}</Text>
                    <Text style={styles.eventName} numberOfLines={1}>
                      For: {inq.event?.title ?? 'Event'}
                    </Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
                    <Text style={[styles.statusPillText, { color: s.fg }]}>{s.label}</Text>
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>WHY SPONSOR</Text>
                  <Text style={styles.fieldValue}>{inq.why_sponsor}</Text>
                </View>
                {!!inq.message && (
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>MESSAGE</Text>
                    <Text style={styles.fieldValue}>{inq.message}</Text>
                  </View>
                )}

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>CONTACT</Text>
                  <Text style={styles.fieldValue}>{inq.contact_name}</Text>
                </View>
                <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`mailto:${inq.email}`)}>
                  <Ionicons name="mail-outline" size={14} color={colors.info} />
                  <Text style={styles.contactLink} selectable>{inq.email}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${inq.phone}`)}>
                  <Ionicons name="call-outline" size={14} color={colors.info} />
                  <Text style={styles.contactLink} selectable>{inq.phone}</Text>
                </TouchableOpacity>
                {!!inq.website && (
                  <View style={styles.contactRow}>
                    <Ionicons name="globe-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.contactText} selectable numberOfLines={1}>{inq.website}</Text>
                  </View>
                )}

                <Text style={styles.date}>
                  {new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>

                {inq.status !== 'accepted' && inq.status !== 'declined' && (
                  <View style={styles.actions}>
                    {inq.status === 'pending' && (
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.actionContacted]}
                        onPress={() => handleSetStatus(inq, 'contacted')}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionContactedText}>Contacted</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionAccept]}
                      onPress={() => handleSetStatus(inq, 'accepted')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.actionAcceptText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionDecline]}
                      onPress={() => handleSetStatus(inq, 'declined')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.actionDeclineText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  scrollArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: Gap.base, paddingBottom: 100, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTitle: { fontSize: 28, fontWeight: Font.black, color: colors.ink, letterSpacing: -0.5 },
  heroSub: { fontSize: FontSize.small, color: 'rgba(14,14,14,0.6)', marginTop: 2, fontWeight: Font.medium },

  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.text },
  emptySubtitle: { fontSize: FontSize.small, color: colors.textSecondary, textAlign: 'center' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.base,
    marginBottom: Gap.sm,
    ...shadow.sm,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Gap.sm, marginBottom: Gap.md },
  company: { fontSize: FontSize.h3, fontWeight: Font.black, color: colors.text, letterSpacing: -0.3 },
  eventName: { fontSize: FontSize.small, color: colors.textSecondary, marginTop: 2 },
  statusPill: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusPillText: { fontSize: FontSize.xs, fontWeight: Font.bold, letterSpacing: 0.3 },
  field: { marginBottom: Gap.sm },
  fieldLabel: {
    fontSize: FontSize.micro,
    fontWeight: Font.bold,
    color: colors.textLight,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  fieldValue: { fontSize: FontSize.body, color: colors.text, lineHeight: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  contactLink: { fontSize: FontSize.small, color: colors.info, flex: 1 },
  contactText: { fontSize: FontSize.small, color: colors.textSecondary, flex: 1 },
  date: { fontSize: FontSize.xs, color: colors.textLight, marginTop: Gap.sm },

  actions: { flexDirection: 'row', gap: Gap.sm, marginTop: Gap.md },
  actionBtn: {
    flex: 1,
    height: 42,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContacted: { backgroundColor: colors.ink },
  actionContactedText: { fontSize: FontSize.small, fontWeight: Font.bold, color: '#FFFFFF' },
  actionAccept: { backgroundColor: colors.primary },
  actionAcceptText: { fontSize: FontSize.small, fontWeight: Font.bold, color: colors.onPrimary },
  actionDecline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  actionDeclineText: { fontSize: FontSize.small, fontWeight: Font.bold, color: colors.error },
});
