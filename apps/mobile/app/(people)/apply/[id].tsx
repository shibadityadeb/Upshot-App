import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Event } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius } from '../../../src/constants/theme';
import { AvatarCircle, Input } from '../../../src/components/common';
import { useAuthStore } from '../../../src/store/auth.store';
import { showError } from '../../../src/store/error.store';

const api = createApiClient();

export default function PeopleApply() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isCartelMember, setIsCartelMember] = useState(false);

  const [organizer, setOrganizer] = useState<{ full_name?: string; email?: string } | null>(null);

  const load = useCallback(async () => {
    if (!id || !user) return;
    try {
      const [evRes, appRes] = await Promise.all([
        api.events.getEventById(id),
        api.events.getMyApplications(user.id),
      ]);
      if (evRes.data) {
        setEvent(evRes.data);
        if (evRes.data.created_by) {
          const { data: profile } = await api.supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', evRes.data.created_by)
            .single();
          if (profile) setOrganizer(profile);
        }
      } else {
        setError('Event not found');
      }
      if (appRes.data) {
        const myApp = appRes.data.find((a) => a.event_id === id);
        if (myApp) setApplicationStatus(myApp.status);
      }
      try {
        const member = await api.campusCartel.isMember(user.id);
        setIsCartelMember(member);
      } catch {}

    } catch (e) {
      setError('Failed to load event');
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handleApply = useCallback(async () => {
    if (!user || !event) return;
    setApplying(true);
    try {
      const result = await api.events.applyForEvent(event.id, user.id, note.trim() || undefined);
      if (result.error) {
        showError(result.error);
      } else if (result.data?.status === 'pending') {
        // The event filled up — the database put them on the waiting list.
        setApplicationStatus('pending');
        Alert.alert(
          "You're on the waiting list",
          "This event is full. You'll be added automatically if someone drops out.",
        );
      } else {
        setApplicationStatus('approved');
        Alert.alert("You're in", 'You have been added to the attendee list for this event.');
      }
    } finally {
      setApplying(false);
    }
  }, [user, event, note, router]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.container}>
        <View style={[styles.errorBackRow, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backPill}>
            <Ionicons name="arrow-back" size={14} color="#fff" />
            <Text style={styles.backPillText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error ?? 'Event not found'}</Text>
        </View>
      </View>
    );
  }

  const eventDate = new Date(event.event_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const eventTime = event.event_time
    ? (() => {
        const [h, m] = event.event_time.split(':');
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour % 12 || 12;
        return `${h12}:${m} ${ampm}`;
      })()
    : null;
  const venue = (event as any).venue;
  const city = (event as any).city;
  const locationLine = venue ? `${venue}${city ? ', ' + city : ''}` : (event.location ?? '');
  const description = (event as any).description;
  const hasDescription = !!description && description !== 'N/A' && description.trim() !== '';
  const organizerName = (event as any).company?.name ?? organizer?.full_name ?? 'Unknown';
  const organizerEmail = organizer?.email ?? (event as any).company?.email;
  // The person who created the event can't apply to their own workshop —
  // they see an ownership badge + how many participants the admin has accepted.
  const isOwner = !!user && event.created_by === user.id;
  const participantsCount = event.current_attendees ?? 0;
  // Joining is automatic up to capacity; 'pending' means the event was full and
  // they are waiting for a seat. Someone who withdrew falls through to the
  // button and can apply again.
  const isGoing = applicationStatus === 'approved';
  const isWaiting = applicationStatus === 'pending';
  const isRejected = applicationStatus === 'rejected';
  const seatsLeft =
    event.max_attendees != null ? Math.max(event.max_attendees - participantsCount, 0) : null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1 — Hero image with overlaid back button + category */}
        <View style={styles.heroWrap}>
          {event.banner_url ? (
            <Image source={{ uri: event.banner_url }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={[styles.heroPlaceholder, { backgroundColor: colors.primary + '18' }]}>
              <Text style={styles.heroPlaceholderTitle}>{event.title}</Text>
              <Text style={styles.heroPlaceholderWatermark}>UBM</Text>
            </View>
          )}

          {/* Back pill */}
          <TouchableOpacity
            style={[styles.backPill, { top: insets.top + 8, left: 16, position: 'absolute' }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={14} color="#fff" />
            <Text style={styles.backPillText}>Back</Text>
          </TouchableOpacity>

          {/* Category chip */}
          {!!(event as any).category && (
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{(event as any).category}</Text>
            </View>
          )}
        </View>

        {/* 2 — Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{eventDate}{eventTime ? ` · ${eventTime}` : ''}</Text>
          </View>

          {!!locationLine && (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{locationLine}</Text>
            </View>
          )}

          {event.coin_reward > 0 && isCartelMember && (
            <View style={styles.coinRow}>
              <Ionicons name="diamond-outline" size={13} color="#92400E" />
              <Text style={styles.coinText}>Earn {event.coin_reward} coins</Text>
            </View>
          )}
        </View>

        {/* 3 — Organiser card */}
        {(organizer || (event as any).company) && (
          <>
            <View style={styles.separator} />
            <View style={styles.organiserBlock}>
              <Text style={styles.sectionLabel}>ORGANISED BY</Text>
              <View style={styles.organiserRow}>
                <AvatarCircle name={organizerName} size={40} />
                <View style={styles.organiserInfo}>
                  <Text style={styles.organiserName}>{organizerName}</Text>
                  {!!organizerEmail && (
                    <Text style={styles.organiserEmail}>{organizerEmail}</Text>
                  )}
                </View>
              </View>
            </View>
          </>
        )}

        {/* 5 — About section */}
        {hasDescription && (
          <View style={styles.aboutBlock}>
            <Text style={styles.sectionLabel}>ABOUT THIS EVENT</Text>
            <Text style={styles.aboutText}>{description}</Text>
          </View>
        )}

        {/* 6 — Note input (only if not already on the list and not the organiser) */}
        {!isGoing && !isWaiting && !isRejected && !isOwner && (
          <View style={styles.noteBlock}>
            <Input
              label="Note (optional)"
              placeholder="Tell them why you want to participate..."
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
            />
          </View>
        )}

        {/* 7 — Action area */}
        <View style={[styles.actionBlock, { paddingBottom: insets.bottom + 20 }]}>
          {isOwner ? (
            <View style={styles.ownerBlock}>
              <View style={styles.ownerBadge}>
                <Ionicons name="ribbon-outline" size={16} color={colors.ink} />
                <Text style={styles.ownerBadgeText}>Created by you</Text>
              </View>
              <View style={styles.participantsRow}>
                <Ionicons name="people-outline" size={18} color="#0D0D0D" />
                <Text style={styles.participantsText}>
                  {participantsCount} participant{participantsCount === 1 ? '' : 's'} coming
                </Text>
              </View>
            </View>
          ) : isGoing ? (
            <View style={styles.appliedButton}>
              <Ionicons name="checkmark-circle" size={18} color="#065F46" />
              <Text style={styles.appliedButtonText}>You're going</Text>
            </View>
          ) : isWaiting ? (
            <View style={styles.waitingBlock}>
              <View style={styles.waitingButton}>
                <Ionicons name="hourglass-outline" size={18} color="#92400E" />
                <Text style={styles.waitingButtonText}>On the waiting list</Text>
              </View>
              <Text style={styles.waitingHint}>
                This event is full. You'll be added automatically if someone drops out.
              </Text>
            </View>
          ) : isRejected ? (
            <View style={styles.rejectedButton}>
              <Ionicons name="close-circle" size={18} color="#991B1B" />
              <Text style={styles.rejectedButtonText}>Removed from this event</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.applyButton, applying && styles.applyButtonDisabled]}
              onPress={handleApply}
              disabled={applying}
              activeOpacity={0.8}
            >
              {applying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.applyButtonText}>
                  {seatsLeft === 0 ? 'Join the waiting list' : 'Apply now'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBackRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0D0D0D',
  },
  errorText: {
    fontSize: FontSize.body,
    color: colors.error,
  },

  // 1 — Hero
  heroWrap: {
    width: '100%',
    height: 260,
    backgroundColor: '#E5E7EB',
  },
  heroImage: {
    width: '100%',
    height: 260,
  },
  heroPlaceholder: {
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  heroPlaceholderTitle: {
    fontSize: 22,
    fontWeight: Font.bold,
    color: colors.ink,
    textAlign: 'center',
  },
  heroPlaceholderWatermark: {
    position: 'absolute',
    bottom: 14,
    right: 16,
    fontSize: 13,
    fontWeight: Font.bold,
    color: 'rgba(0,0,0,0.08)',
    letterSpacing: 2,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
  },
  backPillText: {
    fontSize: 13,
    fontWeight: Font.semibold,
    color: '#FFFFFF',
  },
  categoryChip: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: Font.bold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // 2 — Title block
  titleBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: Font.black,
    color: '#0D0D0D',
    lineHeight: 30,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 10,
  },
  coinText: {
    fontSize: 13,
    fontWeight: Font.semibold,
    color: '#92400E',
  },

  // 3 — Organiser
  separator: {
    height: 1,
    backgroundColor: '#F4F4F6',
    marginHorizontal: 20,
  },
  organiserBlock: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: Font.semibold,
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  organiserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  organiserInfo: {
    flex: 1,
  },
  organiserName: {
    fontSize: 15,
    fontWeight: Font.bold,
    color: '#0D0D0D',
  },
  organiserEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // 5 — About
  aboutBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  aboutText: {
    fontSize: 15,
    color: '#0D0D0D',
    lineHeight: 24,
  },

  // 6 — Note
  noteBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },

  // 7 — Action
  actionBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  applyButton: {
    width: '100%',
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerBlock: {
    width: '100%',
    borderRadius: radius.xl,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ownerBadgeText: {
    fontSize: 14,
    fontWeight: Font.bold,
    color: colors.ink,
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantsText: {
    fontSize: 16,
    fontWeight: Font.bold,
    color: '#0D0D0D',
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: Font.bold,
    color: colors.onPrimary,
  },
  appliedButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#D1FAE5',
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  appliedButtonText: {
    fontSize: 16,
    fontWeight: Font.bold,
    color: '#065F46',
  },
  waitingBlock: {
    width: '100%',
    gap: 10,
  },
  waitingButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  waitingButtonText: {
    fontSize: 16,
    fontWeight: Font.bold,
    color: '#92400E',
  },
  waitingHint: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  rejectedButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rejectedButtonText: {
    fontSize: 16,
    fontWeight: Font.bold,
    color: '#991B1B',
  },
});
