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
import { Button, Input } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { colors, Font, FontSize, Gap, spacing } from '../../src/constants/theme';
import type { RegisterStudentPayload } from '@upshot/types';

const LOGO = require('../../assets/logo.png') as number;
const TOTAL_STEPS = 2;

export default function RegisterScreen() {
  const router = useRouter();
  const { registerStudent, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);

  // Step 1 — Account
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 — Professional + optional code
  const [profession, setProfession] = useState('');
  const [orgName, setOrgName] = useState('');
  const [ambassadorCode, setAmbassadorCode] = useState('');

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
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'At least 8 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(2);
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(1);
    }
  };

  const handleRegister = async () => {
    const payload: RegisterStudentPayload = {
      email: email.trim(),
      password,
      full_name: fullName.trim(),
      profession: profession.trim() || undefined,
      organisation_name: orgName.trim() || undefined,
      ambassador_code: ambassadorCode.trim() || undefined,
    };
    try {
      // Navigation is handled by (auth)/_layout.tsx Redirect when user state updates
      await registerStudent(payload);
    } catch (e) {
      console.warn('[Register] registerStudent threw:', e);
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

          {step === 1 && (
            <>
              <Text style={styles.formTitle}>Create your account</Text>
              <Text style={styles.formSubtitle}>Step 1 of 2 — Basic information</Text>
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
                placeholder="you@example.com"
                value={email}
                onChangeText={(t) => { clearField('email'); setEmail(t); }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={fieldErrors.email}
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
              <Text style={styles.formTitle}>Professional details</Text>
              <Text style={styles.formSubtitle}>Step 2 of 2 — Optional, you can skip</Text>
              <Input
                label="Profession"
                placeholder="e.g. Marketing Manager, Founder, Student"
                value={profession}
                onChangeText={setProfession}
                autoCapitalize="words"
              />
              <Input
                label="Company / Organisation"
                placeholder="e.g. Acme Corp, IIT Delhi, Freelance"
                value={orgName}
                onChangeText={setOrgName}
                autoCapitalize="words"
              />
              <View style={styles.divider} />
              <Text style={styles.referralLabel}>Have a referral code?</Text>
              <Input
                label="Ambassador Code (optional)"
                placeholder="e.g. AMIT2F4C"
                value={ambassadorCode}
                onChangeText={setAmbassadorCode}
                autoCapitalize="characters"
              />
              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                style={styles.actionBtn}
              />
              <Button
                title="Skip and Register"
                onPress={handleRegister}
                variant="ghost"
                loading={isLoading}
                disabled={isLoading}
                style={styles.skipBtn}
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
  dot: {
    height: 8,
    borderRadius: 4,
  },
  active: {
    width: 28,
    backgroundColor: colors.accent,
  },
  past: {
    width: 28,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  inactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingBottom: Gap.lg,
    paddingHorizontal: Gap.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: Gap.sm,
    paddingRight: Gap.base,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: FontSize.body,
    fontWeight: Font.medium,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Gap.sm,
  },
  logoBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoImage: {
    width: 130,
    height: 34,
  },
  formSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  formContent: {
    padding: Gap.xl,
    paddingTop: Gap.xxl,
  },
  formTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: 4,
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
  errorText: {
    color: colors.error,
    fontSize: FontSize.body,
    flex: 1,
  },
  errorDismiss: {
    color: colors.error,
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    marginLeft: Gap.sm,
  },
  toggleText: {
    color: colors.primary,
    fontWeight: Font.semibold,
    fontSize: FontSize.small,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: Gap.base,
  },
  referralLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
    marginBottom: Gap.sm,
  },
  actionBtn: {
    marginTop: Gap.sm,
  },
  skipBtn: {
    marginTop: Gap.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Gap.xxl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: FontSize.body,
  },
  footerLink: {
    color: colors.primary,
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
  },
});
