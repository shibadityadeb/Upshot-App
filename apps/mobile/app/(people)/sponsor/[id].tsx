import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Event } from '@upshot/types';
import { Button, Input } from '../../../src/components/common';
import { useAuthStore } from '../../../src/store/auth.store';
import { colors, Font, FontSize, Gap, radius } from '../../../src/constants/theme';

const api = createApiClient();

export default function SponsorEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [event, setEvent] = useState<Event | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState(user?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [whySponsor, setWhySponsor] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!id) return;
    api.events.getEventById(id).then(({ data }) => {
      if (data) setEvent(data);
    });
  }, [id]);

  const clearError = (field: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!companyName.trim()) e.companyName = 'Company name is required';
    if (!contactName.trim()) e.contactName = 'Your name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!phone.trim()) e.phone = 'Phone number is required';
    if (!whySponsor.trim()) e.whySponsor = 'Tell us why you want to sponsor';
    setErrors(e);
    const ok = Object.keys(e).length === 0;
    // Errors render at the fields; make sure the person sees them.
    if (!ok) scrollRef.current?.scrollTo({ y: 0, animated: true });
    return ok;
  };

  const handleSubmit = async () => {
    if (!user?.id || !id) return;
    if (!validate()) return;
    setSubmitting(true);
    const { error } = await api.sponsors.submitInquiry(user.id, {
      event_id: id,
      company_name: companyName.trim(),
      contact_name: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim() || undefined,
      why_sponsor: whySponsor.trim(),
      message: message.trim() || undefined,
    });
    setSubmitting(false);
    if (error) {
      setErrors({ form: "Couldn't send your details. Please try again in a moment." });
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      Alert.alert("Couldn't send", 'Something went wrong while sending your details. Please try again.');
      return;
    }
    Alert.alert(
      'Thank you for your response!',
      `Your sponsorship interest${event ? ` for ${event.title}` : ''} has been sent to the Upshot team. We'll reach out to you soon.`,
      [{ text: 'OK', onPress: () => router.back() }],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Ionicons name="star" size={20} color={colors.ink} />
          </View>
        </View>
        <Text style={styles.eyebrow}>BECOME A SPONSOR</Text>
        <Text style={styles.headline} numberOfLines={2}>
          {event?.title ?? 'Sponsor this event'}
        </Text>
        <Text style={styles.subheadline}>
          Tell us about your company and we'll get in touch.
        </Text>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {errors.form && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{errors.form}</Text>
            </View>
          )}

          <Text style={styles.sectionLabel}>Company</Text>
          <Input
            label="Company name"
            placeholder="Acme Pvt Ltd"
            value={companyName}
            onChangeText={(t) => { clearError('companyName'); setCompanyName(t); }}
            autoCapitalize="words"
            error={errors.companyName}
          />
          <Input
            label="Website (optional)"
            placeholder="https://acme.com"
            value={website}
            onChangeText={setWebsite}
            autoCapitalize="none"
            keyboardType="url"
          />

          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>Contact person</Text>
          <Input
            label="Your name"
            placeholder="Jane Doe"
            value={contactName}
            onChangeText={(t) => { clearError('contactName'); setContactName(t); }}
            autoCapitalize="words"
            error={errors.contactName}
          />
          <Input
            label="Email"
            placeholder="you@company.com"
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

          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>About the sponsorship</Text>
          <Input
            label="Why do you want to sponsor?"
            placeholder="What draws you to this event and what you hope to get out of it..."
            value={whySponsor}
            onChangeText={(t) => { clearError('whySponsor'); setWhySponsor(t); }}
            multiline
            numberOfLines={4}
            error={errors.whySponsor}
          />
          <Input
            label="Anything else? (optional)"
            placeholder="Budget, type of support, questions..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
          />

          <Button
            title={submitting ? 'Sending...' : 'Send to Upshot team'}
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.submitBtn}
          />
          <Text style={styles.footnote}>
            Your details go straight to the Upshot admin team.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  flex: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
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
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  eyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.primary,
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
    color: 'rgba(255,255,255,0.8)',
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

});
