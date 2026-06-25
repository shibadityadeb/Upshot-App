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
import { Button, Input } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { colors, typography, spacing } from '../../src/constants/theme';
import type { RegisterStudentPayload } from '@upshot/types';

const TOTAL_STEPS = 3;

export default function RegisterScreen() {
  const router = useRouter();
  const { registerStudent, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);

  // Step 1
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');

  // Step 3
  const [ambassadorCode, setAmbassadorCode] = useState('');

  // Validation
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
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  const handleRegister = async (withCode: boolean) => {
    const payload: RegisterStudentPayload = {
      email: email.trim(),
      password,
      full_name: fullName.trim(),
      college: college.trim() || undefined,
      course: course.trim() || undefined,
      year_of_study: yearOfStudy ? parseInt(yearOfStudy, 10) : undefined,
      ambassador_code: withCode && ambassadorCode.trim() ? ambassadorCode.trim() : undefined,
    };
    const success = await registerStudent(payload);
    if (success) {
      router.replace('/');
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>{'<'} Back</Text>
          </TouchableOpacity>
        </View>
        <ProgressDots current={step} total={TOTAL_STEPS} />
        <View style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <Text style={styles.logoUp}>UP</Text>
            <Text style={styles.logoShot}>SHOT</Text>
          </View>
          <Text style={styles.logoBrand}>BRAND MEDIA</Text>
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
              <Text style={styles.formSubtitle}>Step 1 of 3 — Basic information</Text>
              <Input
                label="Full Name"
                placeholder="John Doe"
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
              <Input
                label="Phone (optional)"
                placeholder="+91 98765 43210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Button title="Next" onPress={handleNext} style={styles.actionBtn} />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.formTitle}>Academic details</Text>
              <Text style={styles.formSubtitle}>Step 2 of 3 — Optional, you can skip</Text>
              <Input
                label="College / Institute"
                placeholder="e.g. IIT Delhi"
                value={college}
                onChangeText={setCollege}
                autoCapitalize="words"
              />
              <Input
                label="Course"
                placeholder="e.g. B.Tech Computer Science"
                value={course}
                onChangeText={setCourse}
                autoCapitalize="words"
              />
              <Input
                label="Year of Study"
                placeholder="e.g. 2"
                value={yearOfStudy}
                onChangeText={setYearOfStudy}
                keyboardType="numeric"
              />
              <Button title="Next" onPress={handleNext} style={styles.actionBtn} />
              <Button
                title="Skip for now"
                onPress={handleNext}
                variant="ghost"
                style={styles.skipBtn}
              />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.formTitle}>Ambassador code</Text>
              <Text style={styles.formSubtitle}>Step 3 of 3 — Optional</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>🎁</Text>
                <Text style={styles.infoText}>
                  If someone referred you to Upshot, enter their ambassador code
                  below. This helps them earn rewards!
                </Text>
              </View>
              <Input
                label="Ambassador Code"
                placeholder="e.g. AMIT2F4C"
                value={ambassadorCode}
                onChangeText={setAmbassadorCode}
                autoCapitalize="characters"
              />
              <Button
                title="Create Account"
                onPress={() => handleRegister(true)}
                loading={isLoading}
                disabled={!ambassadorCode.trim()}
                style={styles.actionBtn}
              />
              <Button
                title="Skip and Register"
                onPress={() => handleRegister(false)}
                variant="ghost"
                loading={isLoading}
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
        return (
          <View
            key={i}
            style={[
              dotStyles.dot,
              isActive ? dotStyles.active : dotStyles.inactive,
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
    marginVertical: spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  active: {
    width: 28,
    backgroundColor: colors.accent,
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
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  logoRow: {
    flexDirection: 'row',
  },
  logoUp: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logoShot: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.accent,
  },
  logoBrand: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginTop: 2,
  },
  formSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  formContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  formTitle: {
    fontSize: typography.heading2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  errorBox: {
    backgroundColor: colors.error + '18',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    flex: 1,
  },
  errorDismiss: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  toggleText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.accent + '18',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actionBtn: {
    marginTop: spacing.sm,
  },
  skipBtn: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
