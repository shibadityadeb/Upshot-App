import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import { Button, Input } from '../src/components/common';
import { useAuthStore } from '../src/store/auth.store';
import { colors, Font, FontSize, Gap, radius, shadow } from '../src/constants/theme';

const api = createApiClient();

// Unfiltered screens follow the shared editorial theme: ink surfaces, white text.
const UNFILTERED = colors.ink;

export default function UnfilteredFeatureScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [expertise, setExpertise] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [topic, setTopic] = useState('');
  const [bio, setBio] = useState('');
  const [socialUrl, setSocialUrl] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const clearError = (field: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Your name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!phone.trim()) e.phone = 'Phone number is required';
    if (!expertise.trim()) e.expertise = 'Expertise / title is required';
    if (!organisation.trim()) e.organisation = 'Company / organisation is required';
    if (!topic.trim()) e.topic = 'Tell us what you want to talk about';
    if (!bio.trim()) e.bio = 'A short bio is required';
    if (!socialUrl.trim()) e.socialUrl = 'A social / portfolio link is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (!validate()) return;
    setSubmitting(true);
    const { error } = await api.unfiltered.submitFeatureRequest(user.id, {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      expertise: expertise.trim() || undefined,
      organisation: organisation.trim() || undefined,
      topic: topic.trim(),
      bio: bio.trim() || undefined,
      social_url: socialUrl.trim() || undefined,
    });
    setSubmitting(false);
    if (error) {
      setErrors({ form: error.message });
      return;
    }
    setSubmitted(true);
  };

  // ── Success state ──────────────────────────────────────────
  if (submitted) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.successWrap} edges={['top', 'bottom']}>
          <View style={styles.successIcon}>
            <Ionicons name="mic" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Request sent!</Text>
          <Text style={styles.successBody}>
            Thanks for your interest in Unfiltered. Our team has received your details
            and will reach out if it's a fit.
          </Text>
          <Button title="Done" onPress={() => router.back()} style={styles.successBtn} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Unfiltered header */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Ionicons name="mic" size={22} color={UNFILTERED} />
          </View>
        </View>
        <Text style={styles.eyebrow}>UNFILTERED</Text>
        <Text style={styles.headline}>Get featured on{'\n'}the podcast</Text>
        <Text style={styles.subheadline}>
          Founders, creators and leaders — pitch yourself as a guest.
        </Text>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {errors.form && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{errors.form}</Text>
            </View>
          )}

          <Text style={styles.sectionLabel}>Your details</Text>
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={fullName}
            onChangeText={(t) => { clearError('fullName'); setFullName(t); }}
            autoCapitalize="words"
            error={errors.fullName}
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={(t) => { clearError('email'); setEmail(t); }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input
            label="Phone"
            placeholder="+91 98765 43210"
            value={phone}
            onChangeText={(t) => { clearError('phone'); setPhone(t); }}
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <Input
            label="Expertise / title"
            placeholder="e.g. Founder, Designer, Athlete"
            value={expertise}
            onChangeText={(t) => { clearError('expertise'); setExpertise(t); }}
            autoCapitalize="words"
            error={errors.expertise}
          />
          <Input
            label="Company / organisation"
            placeholder="Where you work or what you run"
            value={organisation}
            onChangeText={(t) => { clearError('organisation'); setOrganisation(t); }}
            autoCapitalize="words"
            error={errors.organisation}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>Your pitch</Text>
          <Input
            label="What do you want to talk about?"
            placeholder="The topic, story or angle you'd bring to the show..."
            value={topic}
            onChangeText={(t) => { clearError('topic'); setTopic(t); }}
            multiline
            numberOfLines={4}
            error={errors.topic}
          />
          <Input
            label="A bit about you"
            placeholder="Short bio — who you are and why it matters"
            value={bio}
            onChangeText={(t) => { clearError('bio'); setBio(t); }}
            multiline
            numberOfLines={3}
            error={errors.bio}
          />
          <Input
            label="Social / portfolio link"
            placeholder="Instagram, LinkedIn or website"
            value={socialUrl}
            onChangeText={(t) => { clearError('socialUrl'); setSocialUrl(t); }}
            autoCapitalize="none"
            keyboardType="url"
            error={errors.socialUrl}
          />

          <Button
            title={submitting ? 'Submitting...' : 'Submit request'}
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.submitBtn}
          />
          <Text style={styles.footnote}>
            Your request goes straight to the Upshot team for review.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: UNFILTERED },
  flex: { flex: 1 },

  // Header
  header: {
    backgroundColor: UNFILTERED,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Gap.sm,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  eyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 2,
    marginTop: Gap.base,
    marginBottom: 4,
  },
  headline: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: '#FFFFFF',
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  subheadline: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    fontWeight: Font.medium,
  },

  // Form
  formContent: {
    backgroundColor: colors.background,
    padding: Gap.lg,
    paddingBottom: 48,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Gap.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: Gap.base,
  },
  errorBox: {
    backgroundColor: colors.error + '14',
    borderRadius: radius.md,
    padding: Gap.md,
    marginBottom: Gap.base,
  },
  errorBoxText: {
    color: colors.error,
    fontSize: FontSize.small,
    fontWeight: Font.medium,
  },
  submitBtn: {
    marginTop: Gap.sm,
  },
  footnote: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: Gap.md,
  },

  // Success
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Gap.xl,
    backgroundColor: colors.background,
  },
  successIcon: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: UNFILTERED,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Gap.lg,
    ...shadow.md,
  },
  successTitle: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.6,
    marginBottom: Gap.sm,
  },
  successBody: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Gap.xl,
  },
  successBtn: {
    alignSelf: 'stretch',
  },
});
