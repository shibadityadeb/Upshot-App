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
import { Button, GoogleButton, Input } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { colors, Font, FontSize, Gap, spacing } from '../../src/constants/theme';

const LOGO = require('../../assets/logo.png') as number;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Tracked separately from the shared `isLoading` so only the button actually
  // being used shows a spinner.
  const [googleLoading, setGoogleLoading] = useState(false);

  const busy = isLoading || googleLoading;

  const handleSignIn = async () => {
    try {
      // Navigation is handled automatically by (auth)/_layout.tsx Redirect
      // when user state updates — no router.replace needed here
      await signIn(email.trim(), password);
    } catch (e) {
      // Unexpected throw — surface a visible message
      console.warn('[Login] signIn threw:', e);
    }
  };

  const handleGoogleSignIn = async () => {
    if (busy) return;
    if (error) clearError();
    setGoogleLoading(true);
    try {
      // Same as above — a successful sign-in lands the user through the
      // (auth)/_layout Redirect. Cancellation resolves false and shows nothing.
      await signInWithGoogle();
    } catch (e) {
      console.warn('[Login] signInWithGoogle threw:', e);
    } finally {
      setGoogleLoading(false);
    }
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
          <View style={styles.logoBadge}>
            <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={styles.logoTagline}>India's Community for Students & Companies</Text>
        </View>
        <Text style={styles.headerHeadline}>The network that{'\n'}gets you noticed.</Text>
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

          <TouchableOpacity
            style={styles.forgotLink}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={isLoading}
            disabled={busy || !email.trim() || !password}
            style={styles.signInBtn}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleButton
            onPress={handleGoogleSignIn}
            loading={googleLoading}
            disabled={busy}
            style={styles.googleBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Upshot? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Create account</Text>
            </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoImage: {
    width: 150,
    height: 40,
  },
  logoTagline: {
    fontSize: FontSize.small,
    color: 'rgba(14,14,14,0.6)',
    marginTop: 14,
    textAlign: 'center',
    fontWeight: Font.medium,
  },
  headerHeadline: {
    fontSize: 26,
    fontWeight: Font.black,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 30,
    letterSpacing: -0.6,
  },
  formSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
  },
  formContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
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
    color: colors.ink,
    fontWeight: '700',
    fontSize: 13,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  forgotText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  signInBtn: {
    marginBottom: spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textLight,
    letterSpacing: 1,
  },
  googleBtn: {
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
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
});
