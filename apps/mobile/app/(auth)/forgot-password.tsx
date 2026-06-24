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
import { createApiClient } from '@upshot/api-client';
import { colors, typography, spacing } from '../../src/constants/theme';

const api = createApiClient();

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setError(null);
    setIsLoading(true);
    const result = await api.auth.resetPassword(email.trim());
    setIsLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else {
      setIsSent(true);
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
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
        >
          {isSent ? (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successSubtitle}>
                We've sent a password reset link to {email}
              </Text>
              <Button
                title="Back to login"
                onPress={() => router.replace('/(auth)/login')}
                variant="outline"
                style={styles.actionBtn}
              />
            </View>
          ) : (
            <>
              <Text style={styles.formTitle}>Reset password</Text>
              <Text style={styles.formSubtitle}>
                Enter your email and we will send you a reset link
              </Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={(t) => { setError(null); setEmail(t); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Button
                title="Send reset link"
                onPress={handleSend}
                loading={isLoading}
                disabled={!email.trim()}
                style={styles.actionBtn}
              />
            </>
          )}

          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            style={styles.backToLogin}
          >
            <Text style={styles.backToLoginText}>Back to login</Text>
          </TouchableOpacity>
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
    paddingHorizontal: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
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
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  actionBtn: {
    marginTop: spacing.sm,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.heading3,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backToLogin: {
    alignSelf: 'center',
    marginTop: spacing.xl,
  },
  backToLoginText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
});
