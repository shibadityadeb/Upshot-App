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
import { colors, Font, FontSize, Gap } from '../../../src/constants/theme';
import { AvatarCircle, Input } from '../../../src/components/common';
import { useAuthStore } from '../../../src/store/auth.store';

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
  const [alreadyApplied, setAlreadyApplied] = useState(false);

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
        const applied = appRes.data.some((a) => a.event_id === id);
        setAlreadyApplied(applied);
      }
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
        Alert.alert('Error', result.error.message);
      } else {
        Alert.alert('Applied!', 'Your application has been submitted successfully.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
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
  const eventTime = new Date(event.event_date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const venue = (event as any).venue;
  const city = (event as any).city;
  const locationLine = venue ? `${venue}${city ? ', ' + city : ''}` : (event.location ?? '');
  const description = (event as any).description;
  const hasDescription = !!description && description !== 'N/A' && description.trim() !== '';
  const organizerName = (event as any).company?.name ?? organizer?.full_name ?? 'Unknown';
  const organizerEmail = organizer?.email ?? (event as any).company?.email;

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
            <Text style={styles.metaText}>{eventDate} · {eventTime}</Text>
          </View>

          {!!locationLine && (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{locationLine}</Text>
            </View>
          )}

          {event.coin_reward > 0 && (
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

        {/* 6 — Note input (only if not applied) */}
        {!alreadyApplied && (
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
          {alreadyApplied ? (
            <View style={styles.appliedButton}>
              <Ionicons name="checkmark-circle" size={18} color="#065F46" />
              <Text style={styles.appliedButtonText}>Already Applied</Text>
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
                <Text style={styles.applyButtonText}>Apply now</Text>
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
    color: colors.primary,
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
    height: 52,
    backgroundColor: '#1B2CC1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },
  appliedButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
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
});
