import { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, SelectField } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { colors, Font, FontSize, Gap, shadow } from '../../src/constants/theme';
import { INDIAN_STATES } from '../../src/constants/india';
import { SECTORS } from '../../src/constants/host';
import type { RegisterHostPayload } from '@upshot/types';

const LOGO = require('../../assets/logo.png') as number;
const TOTAL_STEPS = 3;

const STEP_TITLES = ['Personal details', 'Company details', 'Your position'];
const STEP_SUBTITLES = [
  'Step 1 of 3 — How we reach you',
  'Step 2 of 3 — The organisation you host for',
  'Step 3 of 3 — Your role there',
];

export default function RegisterHostScreen() {
  const router = useRouter();
  const { registerHost, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);

  // Step 1 — personal
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 — company
  const [orgLegalName, setOrgLegalName] = useState('');
  const [orgCity, setOrgCity] = useState('');
  const [orgState, setOrgState] = useState('');
  const [orgSector, setOrgSector] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');

  // Step 3 — position
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearField = (field: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (error) clearError();
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    else if (phone.replace(/\D/g, '').length < 10) errs.phone = 'Enter a valid phone number';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'At least 8 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!orgLegalName.trim()) errs.orgLegalName = 'Legal name is required';
    if (!orgCity.trim()) errs.orgCity = 'City is required';
    if (!orgState) errs.orgState = 'Select a state';
    if (!orgSector) errs.orgSector = 'Select a sector';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!designation.trim()) errs.designation = 'Designation is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 1) router.back();
    else setStep(step - 1);
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;
    const payload: RegisterHostPayload = {
      email: email.trim(),
      password,
      full_name: fullName.trim(),
      contact_phone: phone.trim(),
      org_legal_name: orgLegalName.trim(),
      org_city: orgCity.trim(),
      org_state: orgState,
      org_sector: orgSector,
      org_website: orgWebsite.trim() || undefined,
      designation: designation.trim(),
      department: department.trim() || undefined,
    };
    try {
      // (auth)/_layout redirects once user state lands; index.tsx routes host → (host)/events
      await registerHost(payload);
    } catch (e) {
      console.warn('[RegisterHost] registerHost threw:', e);
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>{'← Back'}</Text>
          </TouchableOpacity>
        </View>
        <ProgressDots current={step} total={TOTAL_STEPS} />
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
          </View>
          <View style={styles.hostChip}>
            <Text style={styles.hostChipText}>HOST ACCOUNT</Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formSheet}
      >
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={clearError}>
                <Text style={styles.errorDismiss}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.formTitle}>{STEP_TITLES[step - 1]}</Text>
          <Text style={styles.formSubtitle}>{STEP_SUBTITLES[step - 1]}</Text>

          {step === 1 && (
            <>
              <Input
                label="Full Name"
                placeholder="Jane Doe"
                value={fullName}
                onChangeText={(t) => { clearField('fullName'); setFullName(t); }}
                autoCapitalize="words"
                error={fieldErrors.fullName}
              />
              <Input
                label="Email"
                placeholder="you@company.com"
                value={email}
                onChangeText={(t) => { clearField('email'); setEmail(t); }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={fieldErrors.email}
              />
              <Input
                label="Phone Number"
                placeholder="10-digit mobile number"
                value={phone}
                onChangeText={(t) => { clearField('phone'); setPhone(t); }}
                keyboardType="phone-pad"
                error={fieldErrors.phone}
              />
              <Input
                label="Password"
                placeholder="Min 8 characters"
                value={password}
                onChangeText={(t) => { clearField('password'); setPassword(t); }}
                secureTextEntry={!showPassword}
                error={fieldErrors.password}
                rightElement={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                }
              />
              <Button title="Continue" onPress={handleNext} style={styles.actionBtn} />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                label="Legal Name"
                placeholder="Registered organisation name"
                value={orgLegalName}
                onChangeText={(t) => { clearField('orgLegalName'); setOrgLegalName(t); }}
                autoCapitalize="words"
                error={fieldErrors.orgLegalName}
              />
              <Input
                label="City"
                placeholder="e.g. Bengaluru"
                value={orgCity}
                onChangeText={(t) => { clearField('orgCity'); setOrgCity(t); }}
                autoCapitalize="words"
                error={fieldErrors.orgCity}
              />
              <SelectField
                label="State"
                placeholder="Select state"
                value={orgState}
                options={[...INDIAN_STATES]}
                onSelect={(v) => { clearField('orgState'); setOrgState(v); }}
                error={fieldErrors.orgState}
              />
              <SelectField
                label="Sector"
                placeholder="Select sector"
                value={orgSector}
                options={[...SECTORS]}
                onSelect={(v) => { clearField('orgSector'); setOrgSector(v); }}
                error={fieldErrors.orgSector}
              />
              <Input
                label="Website (optional)"
                placeholder="https://yourcompany.com"
                value={orgWebsite}
                onChangeText={setOrgWebsite}
                autoCapitalize="none"
                keyboardType="url"
              />
              <Button title="Continue" onPress={handleNext} style={styles.actionBtn} />
            </>
          )}

          {step === 3 && (
            <>
              <Input
                label="Designation"
                placeholder="e.g. Founder, Events Manager"
                value={designation}
                onChangeText={(t) => { clearField('designation'); setDesignation(t); }}
                autoCapitalize="words"
                error={fieldErrors.designation}
              />
              <Input
                label="Department (optional)"
                placeholder="e.g. Marketing, Operations"
                value={department}
                onChangeText={setDepartment}
                autoCapitalize="words"
              />

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>You're signing up as</Text>
                <Text style={styles.summaryName}>{fullName.trim() || '—'}</Text>
                <Text style={styles.summaryMeta}>
                  {designation.trim() || 'Position'} at {orgLegalName.trim() || 'your organisation'}
                </Text>
                <Text style={styles.summaryHint}>
                  Host accounts can propose events. Each proposal goes to the Upshot team for
                  approval before it appears publicly.
                </Text>
              </View>

              <Button
                title="Create Host Account"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                style={styles.actionBtn}
              />
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={dotStyles.container}>
      {Array.from({ length: total }, (_, i) => {
        const isActive = i + 1 === current;
        const isPast = i + 1 < current;
        return (
          <View
            key={i}
            style={[
              dotStyles.dot,
              isActive ? dotStyles.active : isPast ? dotStyles.past : dotStyles.inactive,
            ]}
          />
        );
      })}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: Gap.base,
  },
  dot: { height: 8, borderRadius: 4 },
  active: { width: 28, backgroundColor: colors.ink },
  past: { width: 28, backgroundColor: 'rgba(14,14,14,0.5)' },
  inactive: { width: 8, backgroundColor: 'rgba(14,14,14,0.22)' },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary },
  header: {
    backgroundColor: colors.primary,
    paddingBottom: Gap.lg,
    paddingHorizontal: Gap.base,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backButton: { paddingVertical: Gap.sm, paddingRight: Gap.base },
  backText: { color: colors.ink, fontSize: FontSize.body, fontWeight: Font.semibold },
  logoContainer: { alignItems: 'center', marginTop: Gap.sm, gap: Gap.sm },
  // Capsule, matching the login header — see the note there.
  logoBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 13,
    ...shadow.md,
  },
  logoImage: { width: 130, height: 34 },
  hostChip: {
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  hostChipText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.primary,
    letterSpacing: 1.4,
  },
  formSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  formContent: { padding: Gap.xl, paddingTop: Gap.xxl },
  formTitle: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.6,
  },
  formSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    marginBottom: Gap.lg,
  },
  errorBox: {
    backgroundColor: colors.error + '18',
    borderRadius: 10,
    padding: Gap.base,
    marginBottom: Gap.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: { color: colors.error, fontSize: FontSize.body, flex: 1 },
  errorDismiss: {
    color: colors.error,
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    marginLeft: Gap.sm,
  },
  toggleText: { color: colors.ink, fontWeight: Font.bold, fontSize: FontSize.small },
  actionBtn: { marginTop: Gap.sm },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.base,
    marginTop: Gap.sm,
    marginBottom: Gap.sm,
  },
  summaryTitle: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  summaryName: { fontSize: FontSize.h2, fontWeight: Font.black, color: colors.text },
  summaryMeta: { fontSize: FontSize.small, color: colors.textSecondary, marginTop: 2 },
  summaryHint: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    marginTop: Gap.sm,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Gap.xxl,
  },
  footerText: { color: colors.textSecondary, fontSize: FontSize.body },
  footerLink: { color: colors.ink, fontSize: FontSize.body, fontWeight: Font.bold },
});
