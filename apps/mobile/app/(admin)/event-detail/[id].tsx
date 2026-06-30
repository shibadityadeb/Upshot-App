import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Event, EventApplication } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../../src/constants/theme';
import {
  Button,
  Card,
  CoinBadge,
  Divider,
  EmptyState,
  SectionHeader,
  StatusBadge,
} from '../../../src/components/common';
import { useAuthStore } from '../../../src/store/auth.store';

const api = createApiClient();

export default function AdminEventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [event, setEvent] = useState<Event | null>(null);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [eventActioning, setEventActioning] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [evRes, appRes] = await Promise.all([
        api.events.getEventById(id),
        api.events.getEventApplications(id),
      ]);
      if (evRes.data) setEvent(evRes.data);
      else setError('Event not found');
      if (appRes.data) setApplications(appRes.data);
    } catch (e) {
      setError('Failed to load event');
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const handleEventApprove = useCallback(async () => {
    if (!user || !event) return;
    setEventActioning(true);
    try {
      const result = await api.events.updateEventStatus(event.id, user.id, { status: 'approved' });
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        await load();
      }
    } finally {
      setEventActioning(false);
    }
  }, [user, event, load]);

  const handleEventReject = useCallback(() => {
    if (!user || !event) return;
    if (Platform.OS === 'ios') {
      Alert.prompt('Rejection Reason', 'Enter reason (optional)', async (reason) => {
        setEventActioning(true);
        try {
          const result = await api.events.updateEventStatus(event.id, user.id, {
            status: 'rejected',
            rejection_reason: reason || 'Rejected by admin',
          });
          if (result.error) Alert.alert('Error', result.error.message);
          else await load();
        } finally {
          setEventActioning(false);
        }
      }, 'plain-text');
    } else {
      Alert.alert('Reject Event', 'This will reject the event.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setEventActioning(true);
            try {
              await api.events.updateEventStatus(event.id, user!.id, {
                status: 'rejected',
                rejection_reason: 'Rejected by admin',
              });
              await load();
            } finally {
              setEventActioning(false);
            }
          },
        },
      ]);
    }
  }, [user, event, load]);

  const handleAppAction = useCallback(
    async (appId: string, status: 'approved' | 'rejected') => {
      if (!user) return;
      setActionLoading(appId + status);
      try {
        const result = await api.events.updateApplicationStatus(appId, user.id, status);
        if (result.error) {
          Alert.alert('Error', result.error.message);
        } else {
          await load();
        }
      } finally {
        setActionLoading(null);
      }
    },
    [user, load],
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error ?? 'Event not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const eventDate = new Date(event.event_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const eventTime = new Date(event.event_date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const venue = (event as any).venue;
  const city = (event as any).city;
  const locationLine = venue ? `${venue}${city ? ', ' + city : ''}` : (event.location ?? '');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={styles.backText}>Events</Text>
        </TouchableOpacity>

        {/* Event info card */}
        <Card style={styles.eventCard}>
          <View style={styles.eventTitleRow}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <StatusBadge status={event.status} />
          </View>

          <Text style={styles.dateTime}>{eventDate} · {eventTime}</Text>

          {!!locationLine && (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{locationLine}</Text>
            </View>
          )}

          <CoinBadge amount={event.coin_reward} />

          {!!(event as any).description && (
            <>
              <Divider />
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.description}>{(event as any).description}</Text>
            </>
          )}

          {event.status === 'pending' && (
            <View style={styles.actionRow}>
              <Button
                title="Approve"
                variant="primary"
                size="sm"
                style={styles.actionBtn}
                onPress={handleEventApprove}
                disabled={eventActioning}
                loading={eventActioning}
              />
              <Button
                title="Reject"
                variant="outline"
                size="sm"
                style={[styles.actionBtn, styles.rejectBtn]}
                onPress={handleEventReject}
                disabled={eventActioning}
              />
            </View>
          )}
        </Card>

        {/* Applicants */}
        <View style={styles.section}>
          <SectionHeader
            title="Applicants"
            subtitle={`${applications.length} total`}
          />

          {applications.length === 0 ? (
            <EmptyState
              iconName="people-outline"
              title="No applicants yet"
              subtitle="Applications will appear here"
            />
          ) : (
            applications.map((app) => {
              const applicantName =
                (app as any).user?.full_name ??
                (app as any).profile?.full_name ??
                'Unknown';
              const isPending = app.status === 'pending';
              const approvingThis = actionLoading === app.id + 'approved';
              const rejectingThis = actionLoading === app.id + 'rejected';

              return (
                <Card key={app.id} style={styles.appCard}>
                  <View style={styles.appHeader}>
                    <Text style={styles.appName}>{applicantName}</Text>
                    <StatusBadge status={app.status} />
                  </View>
                  <Text style={styles.appDate}>
                    Applied {new Date(app.applied_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                  {!!app.note && (
                    <Text style={styles.appNote} numberOfLines={2}>{app.note}</Text>
                  )}
                  {isPending && (
                    <View style={styles.appActions}>
                      <Button
                        title="Accept"
                        variant="primary"
                        size="sm"
                        style={styles.actionBtn}
                        onPress={() => handleAppAction(app.id, 'approved')}
                        disabled={approvingThis || rejectingThis}
                        loading={approvingThis}
                      />
                      <Button
                        title="Reject"
                        variant="outline"
                        size="sm"
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => handleAppAction(app.id, 'rejected')}
                        disabled={approvingThis || rejectingThis}
                        loading={rejectingThis}
                      />
                    </View>
                  )}
                </Card>
              );
            })
          )}
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
  },
  errorText: {
    fontSize: FontSize.body,
    color: colors.error,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
  },
  backText: {
    fontSize: FontSize.body,
    color: colors.text,
    fontWeight: Font.medium,
  },
  eventCard: {
    marginHorizontal: Gap.base,
    padding: Gap.base,
    gap: Gap.sm,
    marginBottom: Gap.xl,
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    lineHeight: 26,
  },
  dateTime: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: Gap.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    marginTop: 2,
  },
  metaText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    flex: 1,
  },
  descriptionLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
    marginTop: Gap.md,
    marginBottom: Gap.xs,
  },
  description: {
    fontSize: FontSize.body,
    color: colors.text,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginTop: Gap.md,
  },
  actionBtn: {
    flex: 1,
  },
  rejectBtn: {
    borderColor: colors.error,
  },
  section: {
    paddingHorizontal: Gap.base,
  },
  appCard: {
    padding: Gap.base,
    marginBottom: Gap.sm,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Gap.sm,
    marginBottom: Gap.xs,
  },
  appName: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.text,
    flex: 1,
  },
  appDate: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    marginBottom: 4,
  },
  appNote: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Gap.xs,
  },
  appActions: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginTop: Gap.sm,
  },
});
