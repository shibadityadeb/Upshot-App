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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createApiClient } from '@upshot/api-client';
import type { Host } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { SelectField, DatePickerModal, TimePickerModal } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { uploadEventImage } from '../../src/utils/uploadEventImage';
import { showError } from '../../src/store/error.store';
import { INDIAN_STATES } from '../../src/constants/india';
import { EVENT_CATEGORIES } from '../../src/constants/host';

const api = createApiClient();

/**
 * Host-side event proposal form.
 *
 * Unlike the old people-side flow, personal and organisation details are not
 * re-collected here — they were captured at sign-up and are read back from the
 * `hosts` record, so this screen is event details only.
 */
export default function NewEvent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const [host, setHost] = useState<Host | null>(null);
  const [loadingHost, setLoadingHost] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(EVENT_CATEGORIES[0]);
  const [maxAttendees, setMaxAttendees] = useState('');
  const [fees, setFees] = useState('');
  const [eventCity, setEventCity] = useState('');
  const [eventState, setEventState] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) { setLoadingHost(false); return; }
    api.hosting.getHostProfile(user.id)
      .then((result) => {
        if (cancelled) return;
        setHost(result.data ?? null);
        // Default the event location to the organisation's own city/state
        if (result.data) {
          setEventCity((c) => c || result.data!.org_city);
          setEventState((s) => s || result.data!.org_state);
        }
      })
      .catch(() => { /* form still works without the prefill */ })
      .finally(() => { if (!cancelled) setLoadingHost(false); });
    return () => { cancelled = true; };
  }, [user?.id]);

  const resetForm = useCallback(() => {
    setTitle(''); setDescription(''); setCategory(EVENT_CATEGORIES[0]);
    setMaxAttendees(''); setFees('');
    setEventCity(host?.org_city ?? ''); setEventState(host?.org_state ?? '');
    setEventDate(''); setEventTime(''); setLocationUrl(''); setImageUri(null);
  }, [host]);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const validate = (): string | null => {
    if (!title.trim()) return 'Please enter the event name.';
    if (!eventCity.trim()) return 'Please enter the event city.';
    if (!eventState) return 'Please select the event state.';
    if (!eventDate) return 'Please select the event date.';
    return null;
  };

  const handleSubmit = useCallback(async () => {
    const err = validate();
    if (err) { Alert.alert('Missing info', err); return; }
    if (!user?.id) return;
    if (!host) {
      showError(null, { context: 'Your host profile could not be loaded. Please try again.' });
      return;
    }

    setSubmitting(true);

    let coverUrl: string | undefined;
    let imageWarning = false;
    if (imageUri) {
      const url = await uploadEventImage(imageUri, user.id);
      if (url) coverUrl = url;
      else imageWarning = true;
    }

    try {
      // Same pipeline as before: a pending hosting_application that an admin
      // reviews. On approval the service creates the public `events` row.
      const result = await api.hosting.submitApplication(user.id, {
        applicant_name: user.full_name,
        applicant_phone: host.contact_phone ?? user.phone ?? '',
        applicant_email: user.email,
        event_type: 'organisation',
        org_legal_name: host.org_legal_name,
        org_city: host.org_city,
        org_state: host.org_state,
        org_sector: host.org_sector,
        org_designation: host.designation,
        title: title.trim(),
        description: description.trim() || undefined,
        event_date: eventDate,
        event_time: eventTime.trim() || undefined,
        location: `${eventCity.trim()}, ${eventState}`,
        event_city: eventCity.trim(),
        event_state: eventState,
        location_url: locationUrl.trim() || undefined,
        category,
        max_attendees: maxAttendees ? parseInt(maxAttendees, 10) : undefined,
        fees: fees ? parseInt(fees, 10) : undefined,
        cover_image_url: coverUrl,
      });

      if (result.error) {
        showError(result.error);
      } else {
        Alert.alert(
          'Sent for approval',
          imageWarning
            ? 'Your event was submitted, but the cover image could not be uploaded.'
            : 'Your event has been sent to the Upshot team. You\'ll be notified once it\'s approved and live.',
          [{
            text: 'OK',
            onPress: () => { resetForm(); router.push('/(host)/events'); },
          }],
        );
      }
    } catch {
      showError(null, { context: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }, [user, host, title, description, eventDate, eventTime, eventCity, eventState,
    locationUrl, category, maxAttendees, fees, imageUri, resetForm, router]);

  if (loadingHost) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>HOST AN EVENT</Text>
            <Text style={styles.headerTitle}>Event Details</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {host && (
            <View style={styles.hostBanner}>
              <Ionicons name="business-outline" size={16} color={colors.ink} />
              <Text style={styles.hostBannerText} numberOfLines={2}>
                Hosting as <Text style={styles.hostBannerStrong}>{host.org_legal_name}</Text>
                {' · '}{host.designation}
              </Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Event Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Product Launch Workshop"
              placeholderTextColor={colors.textLight}
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.pillRow}>
              {EVENT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pill, category === cat && styles.pillActive]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell people about this event..."
              placeholderTextColor={colors.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.fieldLabel}>Capacity</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 50"
                placeholderTextColor={colors.textLight}
                value={maxAttendees}
                onChangeText={setMaxAttendees}
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.fieldLabel}>Fees (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="0 for free"
                placeholderTextColor={colors.textLight}
                value={fees}
                onChangeText={setFees}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>City *</Text>
            <TextInput
              style={styles.input}
              placeholder="Event city"
              placeholderTextColor={colors.textLight}
              value={eventCity}
              onChangeText={setEventCity}
              returnKeyType="next"
            />
          </View>

          <SelectField
            label="State"
            placeholder="Select state"
            value={eventState}
            options={[...INDIAN_STATES]}
            onSelect={setEventState}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Date *</Text>
            <TouchableOpacity style={styles.selectorBtn} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
              <Text style={[styles.selectorText, !eventDate && { color: colors.textLight }]}>
                {eventDate || 'Select date'}
              </Text>
              <Ionicons name="calendar-outline" size={16} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Time</Text>
            <TouchableOpacity style={styles.selectorBtn} onPress={() => setShowTimePicker(true)} activeOpacity={0.7}>
              <Text style={[styles.selectorText, !eventTime && { color: colors.textLight }]}>
                {eventTime || 'Select time'}
              </Text>
              <Ionicons name="time-outline" size={16} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Google Maps Link</Text>
            <TextInput
              style={styles.input}
              placeholder="Google Maps URL (optional)"
              placeholderTextColor={colors.textLight}
              value={locationUrl}
              onChangeText={setLocationUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Cover Photo</Text>
            {imageUri ? (
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <View style={styles.imagePreview}>
                  <Image source={{ uri: imageUri }} style={styles.previewImg} />
                  <TouchableOpacity
                    style={styles.removeImageBtn}
                    onPress={() => setImageUri(null)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.7}>
                <Ionicons name="camera-outline" size={28} color={colors.textLight} />
                <Text style={styles.imagePickerText}>Add event cover photo (optional)</Text>
                <Text style={styles.imagePickerHint}>Tap to select from your gallery</Text>
              </TouchableOpacity>
            )}
          </View>

          <DatePickerModal
            visible={showDatePicker}
            onSelect={setEventDate}
            onClose={() => setShowDatePicker(false)}
          />
          <TimePickerModal
            visible={showTimePicker}
            onSelect={setEventTime}
            onClose={() => setShowTimePicker(false)}
          />
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={[styles.nextBtn, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <>
                <Text style={styles.nextBtnText}>Send for Approval</Text>
                <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerText: { flex: 1 },
  headerEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(14,14,14,0.6)',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.5,
  },

  scrollContent: { padding: Gap.base, paddingBottom: 40 },

  hostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.lg,
    padding: Gap.md,
    marginBottom: Gap.lg,
  },
  hostBannerText: { flex: 1, fontSize: FontSize.small, color: colors.ink },
  hostBannerStrong: { fontWeight: Font.bold },

  fieldGroup: { marginBottom: Gap.lg },
  fieldLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
    fontSize: FontSize.body,
    color: colors.text,
  },
  textArea: { height: 100, paddingTop: 12, paddingBottom: 12 },
  row: { flexDirection: 'row', gap: Gap.md },

  pillRow: { flexDirection: 'row', gap: Gap.sm, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { fontSize: 13, fontWeight: Font.semibold, color: colors.textSecondary },
  pillTextActive: { color: colors.onPrimary, fontWeight: Font.bold },

  selectorBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: { fontSize: FontSize.body, color: colors.text },

  imagePicker: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
  },
  imagePickerText: { fontSize: FontSize.body, fontWeight: Font.semibold, color: colors.textSecondary },
  imagePickerHint: { fontSize: FontSize.xs, color: colors.textLight },
  imagePreview: { height: 180, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#E4E4E7' },
  previewImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },

  footer: {
    paddingHorizontal: Gap.base,
    paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.md,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 54,
  },
  nextBtnText: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.onPrimary },
});
