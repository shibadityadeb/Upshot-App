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
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { colors, typography, spacing } from '../../src/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    const success = await signIn(email.trim(), password);
    if (success) router.replace('/');
  };

  const handleChangeEmail = (text: string) => {
    if (error) clearError();
    setEmail(text);
  };

  const handleChangePassword = (text: string) => {
    if (error) clearError();
    setPassword(text);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <Text style={styles.logoUp}>UP</Text>
            <Text style={styles.logoShot}>SHOT</Text>
          </View>
          <Text style={styles.logoBrand}>BRAND MEDIA</Text>
          <Text style={styles.logoTagline}>Your daily dose of insights & stories</Text>
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
          <Text style={styles.formTitle}>Welcome back</Text>
          <Text style={styles.formSubtitle}>Sign in to your account</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={clearError}>
                <Text style={styles.errorDismiss}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={handleChangeEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={handleChangePassword}
            secureTextEntry={!showPassword}
            rightElement={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            }
          />

          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity style={styles.forgotLink}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </Link>

          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={isLoading}
            disabled={!email.trim() || !password}
            style={styles.signInBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Upshot? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Create account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
  },
  logoUp: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logoShot: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.accent,
  },
  logoBrand: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginTop: 4,
  },
  logoTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
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
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  signInBtn: {
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
