import React, { useCallback, useState } from 'react';
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
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/auth.store';
import { uploadEventImage } from '../../src/utils/uploadEventImage';

const api = createApiClient();

const CATEGORIES = ['Social', 'BFSI', 'Corporate', 'Other'];

export default function HostEvent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Basic info
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Social');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  // Step 2: Location & capacity
  const [location, setLocation] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [coinReward, setCoinReward] = useState('');

  // Step 3: Description, image, requirements
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

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

  const validateStep1 = () => {
    if (!title.trim()) return 'Please enter an event title.';
    if (!eventDate.trim()) return 'Please enter the event date (YYYY-MM-DD).';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate.trim())) return 'Date must be in YYYY-MM-DD format.';
    return null;
  };

  const validateStep2 = () => {
    if (!location.trim()) return 'Please enter the event location.';
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) { Alert.alert('Missing info', err); return; }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { Alert.alert('Missing info', err); return; }
      setStep(3);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!user?.id) return;
    setSubmitting(true);

    let coverUrl: string | undefined;
    let imageWarning = false;

    // Upload image if selected
    if (imageUri) {
      const url = await uploadEventImage(imageUri, user.id);
      if (url) {
        coverUrl = url;
      } else {
        imageWarning = true;
      }
    }

    try {
      const result = await api.hosting.submitApplication(user.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        event_date: eventDate.trim(),
        event_time: eventTime.trim() || undefined,
        location: location.trim(),
        location_url: locationUrl.trim() || undefined,
        category,
        max_attendees: maxAttendees ? parseInt(maxAttendees, 10) : undefined,
        coin_reward: coinReward ? parseInt(coinReward, 10) : undefined,
        requirements: requirements.trim() || undefined,
        cover_image_url: coverUrl,
      });

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        const msg = imageWarning
          ? 'Your hosting application was submitted, but the image could not be uploaded.'
          : 'Your hosting application has been submitted for review!';
        Alert.alert('Submitted!', msg, [{ text: 'OK', onPress: () => router.back() }]);
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [user, title, description, eventDate, eventTime, location, locationUrl, category, maxAttendees, coinReward, requirements, imageUri, router]);

  const stepTitle = step === 1 ? 'Event Details' : step === 2 ? 'Location & Capacity' : 'Description & Image';

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => { if (step > 1) setStep(step - 1); else router.back(); }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>HOST AN EVENT</Text>
            <Text style={styles.headerTitle}>{stepTitle}</Text>
          </View>
          <Text style={styles.stepIndicator}>Step {step}/3</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Event Title *</Text>
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
                  {CATEGORIES.map((cat) => (
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

              <View style={styles.row}>
                <View style={[styles.fieldGroup, styles.flex]}>
                  <Text style={styles.fieldLabel}>Date *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textLight}
                    value={eventDate}
                    onChangeText={setEventDate}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
                <View style={[styles.fieldGroup, styles.flex]}>
                  <Text style={styles.fieldLabel}>Time</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 10:00 AM"
                    placeholderTextColor={colors.textLight}
                    value={eventTime}
                    onChangeText={setEventTime}
                  />
                </View>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Mumbai Convention Centre"
                  placeholderTextColor={colors.textLight}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Maps Link</Text>
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

              <View style={styles.row}>
                <View style={[styles.fieldGroup, styles.flex]}>
                  <Text style={styles.fieldLabel}>Max Attendees</Text>
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
                  <Text style={styles.fieldLabel}>Coin Reward</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 100"
                    placeholderTextColor={colors.textLight}
                    value={coinReward}
                    onChangeText={setCoinReward}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              {/* Image Picker */}
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

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell people about this event..."
                  placeholderTextColor={colors.textLight}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Requirements</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Any requirements for attendees (optional)"
                  placeholderTextColor={colors.textLight}
                  value={requirements}
                  onChangeText={setRequirements}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </>
          )}
        </ScrollView>

        {/* Bottom button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          {step < 3 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextBtn, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.nextBtnText}>Submit for Review</Text>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  header: {
    backgroundColor: colors.dark,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerEyebrow: {
    fontSize: FontSize.xs, fontWeight: Font.bold,
    color: colors.accent, letterSpacing: 1.5, marginBottom: 2,
  },
  headerTitle: {
    fontSize: FontSize.h1, fontWeight: Font.bold, color: '#fff',
  },
  stepIndicator: {
    fontSize: FontSize.small, fontWeight: Font.semibold,
    color: 'rgba(255,255,255,0.5)',
  },

  progressBar: {
    height: 3,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.primary,
  },

  scrollContent: {
    padding: Gap.base,
    paddingBottom: 40,
  },

  fieldGroup: { marginBottom: Gap.lg },
  fieldLabel: {
    fontSize: FontSize.small, fontWeight: Font.semibold,
    color: colors.text, marginBottom: 6,
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
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: Gap.md,
  },

  pillRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary, borderColor: colors.primary,
  },
  pillText: {
    fontSize: 13, fontWeight: Font.semibold, color: colors.textSecondary,
  },
  pillTextActive: { color: '#fff' },

  // Image picker
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
  imagePickerText: {
    fontSize: FontSize.body, fontWeight: Font.semibold, color: colors.textSecondary,
  },
  imagePickerHint: {
    fontSize: FontSize.xs, color: colors.textLight,
  },
  imagePreview: {
    height: 180,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#E4E4E7',
  },
  previewImg: {
    width: '100%', height: '100%',
    resizeMode: 'cover',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8, right: 8,
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
    borderRadius: radius.lg,
    height: 52,
  },
  nextBtnText: {
    fontSize: FontSize.h3, fontWeight: Font.bold, color: '#fff',
  },
});
