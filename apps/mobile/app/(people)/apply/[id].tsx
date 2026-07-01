import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import type { Event } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../../src/constants/theme';
import {
  Badge,
  Button,
  CoinBadge,
  Divider,
  Input,
  StatusBadge,
} from '../../../src/components/common';
import { useAuthStore } from '../../../src/store/auth.store';

const api = createApiClient();

export default function PeopleApply() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const load = useCallback(async () => {
    if (!id || !user) return;
    try {
      const [evRes, appRes] = await Promise.all([
        api.events.getEventById(id),
        api.events.getMyApplications(user.id),
      ]);
      if (evRes.data) {
        setEvent(evRes.data);
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Event cover image */}
          {!!event.banner_url && (
            <Image
              source={{ uri: event.banner_url }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          )}

          {/* Event info */}
          <View style={styles.eventCard}>
            <View style={styles.badgeRow}>
              {!!(event as any).category && (
                <Badge label={(event as any).category} color={colors.primary} />
              )}
              {!!(event as any).vertical && (
                <Badge
                  label={(event as any).vertical.name}
                  color={(event as any).vertical.color ?? colors.primary}
                />
              )}
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{eventDate} · {eventTime}</Text>
            </View>

            {!!locationLine && (
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.metaText}>{locationLine}</Text>
              </View>
            )}

            <View style={styles.rewardRow}>
              <CoinBadge amount={event.coin_reward} />
            </View>

            {alreadyApplied && (
              <View style={styles.alreadyAppliedBanner}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.alreadyAppliedText}>You have already applied to this event</Text>
              </View>
            )}

            {!!(event as any).description && (
              <>
                <Divider />
                <Text style={styles.descriptionLabel}>About this event</Text>
                <Text style={styles.description}>{(event as any).description}</Text>
              </>
            )}
          </View>

          {/* Note input */}
          {!alreadyApplied && (
            <View style={styles.noteSection}>
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
        </ScrollView>

        {/* Apply button */}
        <View style={styles.applyFooter}>
          {alreadyApplied ? (
            <View style={styles.appliedBtn}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.appliedBtnText}>Already Applied</Text>
            </View>
          ) : (
            <Button
              title="Apply Now"
              onPress={handleApply}
              loading={applying}
              disabled={applying}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: FontSize.body,
    color: colors.error,
  },
  headerBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  coverImage: {
    width: '100%',
    height: 220,
  },
  scrollContent: {
    paddingBottom: Gap.xl,
  },
  eventCard: {
    backgroundColor: colors.surface,
    padding: Gap.base,
    gap: Gap.sm,
    marginBottom: Gap.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.xs,
  },
  eventTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: colors.text,
    lineHeight: 30,
    marginTop: Gap.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
  },
  metaText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    flex: 1,
  },
  rewardRow: {
    marginTop: Gap.xs,
  },
  alreadyAppliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    backgroundColor: colors.success + '18',
    borderRadius: radius.md,
    paddingHorizontal: Gap.md,
    paddingVertical: Gap.sm,
    marginTop: Gap.sm,
  },
  alreadyAppliedText: {
    fontSize: FontSize.small,
    color: colors.success,
    fontWeight: Font.semibold,
  },
  descriptionLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
    marginTop: Gap.sm,
    marginBottom: Gap.xs,
  },
  description: {
    fontSize: FontSize.body,
    color: colors.text,
    lineHeight: 22,
  },
  noteSection: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.sm,
  },
  applyFooter: {
    padding: Gap.base,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.md,
  },
  appliedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.sm,
    backgroundColor: colors.success + '18',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.success,
    paddingVertical: 14,
  },
  appliedBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.success,
  },
});
