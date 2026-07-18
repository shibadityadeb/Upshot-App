import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { CampusCartelMember } from '@upshot/api-client';
import { colors, Font, FontSize, Gap, radius, shadow } from '../src/constants/theme';
import { useAuthStore } from '../src/store/auth.store';
import { useDebounce } from '../src/hooks/useDebounce';
import { showError } from '../src/store/error.store';

const api = createApiClient();
// Campus Cartel screens follow the shared editorial theme: ink accents.
const GREEN = colors.ink;

type CodeState = 'idle' | 'checking' | 'valid' | 'invalid';
type ScreenState = 'form' | 'checking-existing' | 'success';

export default function CampusCartelApply() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [screen, setScreen] = useState<ScreenState>('checking-existing');
  const [existingApp, setExistingApp] = useState<CampusCartelMember | null>(null);

  // ─── Form state ──────────────────────────────────────────────
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [ambassadorCode, setAmbassadorCode] = useState('');
  const [city, setCity] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // ─── Check if already applied — pre-fill form for editing ─────
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) {
        setScreen('form');
        return;
      }
      setScreen('checking-existing');
      api.campusCartel.getApplicationStatus(user.id).then(({ data }) => {
        if (data?.status === 'approved') {
          router.replace('/(people)/campus-cartel' as any);
          return;
        }
        if (data) {
          setExistingApp(data);
          setIsEditing(true);
          setCollege(data.college ?? '');
          setCourse(data.course ?? '');
          setCity(data.city ?? '');
          setAmbassadorCode(data.ambassador_code ?? '');
        }
        setScreen('form');
      });
    }, [user?.id]),
  );

  // ─── Ambassador code validation ──────────────────────────────
  const [codeState, setCodeState] = useState<CodeState>('idle');
  const debouncedCode = useDebounce(ambassadorCode.trim().toUpperCase(), 500);

  useEffect(() => {
    if (!debouncedCode) {
      setCodeState('idle');
      return;
    }
    setCodeState('checking');
    api.ambassadors.validateReferralCode(debouncedCode).then(({ data }) => {
      setCodeState(data?.valid ? 'valid' : 'invalid');
    });
  }, [debouncedCode]);

  // ─── Submit ───────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!college.trim()) return 'Please enter your college name.';
    if (ambassadorCode.trim() && codeState === 'invalid') return 'The ambassador code you entered is invalid.';
    return null;
  };

  const handleSubmit = useCallback(async () => {
    const err = validate();
    if (err) {
      Alert.alert('Missing details', err);
      return;
    }

    if (!user?.id) {
      Alert.alert(
        'One more step',
        'Please create an account first to complete your Campus Cartel application.',
        [
          { text: 'Create Account', onPress: () => router.push('/(auth)/register') },
          { text: 'Later', style: 'cancel' },
        ],
      );
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (isEditing && existingApp) {
        result = await api.campusCartel.updateApplication(existingApp.id, {
          college: college.trim() || undefined,
          course: course.trim() || undefined,
          city: city.trim() || undefined,
          ambassador_code: ambassadorCode.trim() || null,
        });
      } else {
        result = await api.campusCartel.applyForCampusCartel(
          user.id,
          ambassadorCode.trim() || undefined,
          college.trim() || undefined,
          course.trim() || undefined,
          undefined,
          city.trim() || undefined,
        );
      }
      if (result.error) {
        showError(result.error);
      } else {
        setScreen('success');
      }
    } catch (e) {
      showError(e, { context: 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  }, [college, course, ambassadorCode, city, codeState, user]);

  // ─── Code status indicator ────────────────────────────────────
  const codeIcon = () => {
    if (codeState === 'checking') return <ActivityIndicator size="small" color={colors.primary} />;
    if (codeState === 'valid') return <Ionicons name="checkmark-circle" size={18} color={colors.success} />;
    if (codeState === 'invalid') return <Ionicons name="close-circle" size={18} color={colors.error} />;
    return null;
  };

  const codeHint = () => {
    if (codeState === 'valid') return { text: 'Valid ambassador code!', color: colors.success };
    if (codeState === 'invalid') return { text: 'Code not found — please check and retry.', color: colors.error };
    return null;
  };

  const handleWithdraw = useCallback(() => {
    if (!user?.id || !existingApp) return;
    Alert.alert(
      'Withdraw Application',
      'Are you sure you want to withdraw your Campus Cartel application? You can re-apply later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await api.supabase
                .from('campus_cartel_members')
                .delete()
                .eq('id', existingApp.id);
              if (error) throw new Error(error.message);
              setExistingApp(null);
              setScreen('form');
              setCollege('');
              setCourse('');
              setCity('');
              setAmbassadorCode('');
            } catch (e) {
              showError(e, { context: 'Failed to withdraw.' });
            }
          },
        },
      ],
    );
  }, [user?.id, existingApp]);

  // ─── Loading state ────────────────────────────────────────────
  if (screen === 'checking-existing') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={GREEN} />
        </View>
      </SafeAreaView>
    );
  }

  // ─── Success screen ───────────────────────────────────────────
  if (screen === 'success') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <View style={styles.successIconRing}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </View>
          <Text style={styles.successEyebrow}>{isEditing ? 'APPLICATION UPDATED' : 'APPLICATION SUBMITTED'}</Text>
          <Text style={styles.successHeadline}>{isEditing ? 'Updated!' : 'Under Review'}</Text>
          <Text style={styles.successBody}>
            {isEditing
              ? 'Your application has been updated and sent back for review.'
              : 'Your Campus Cartel application has been submitted. An admin will review it and you\'ll be notified once approved.'}
          </Text>

          <View style={styles.successCards}>
            {[
              { icon: 'people-outline', label: '2000+ Students', sub: 'Join the community' },
              { icon: 'trophy-outline', label: 'Earn Rewards', sub: 'Complete tasks' },
              { icon: 'flash-outline', label: 'Exclusive Events', sub: 'Members only access' },
            ].map((c) => (
              <View key={c.label} style={styles.successCard}>
                <Ionicons name={c.icon as any} size={20} color={GREEN} />
                <Text style={styles.successCardLabel}>{c.label}</Text>
                <Text style={styles.successCardSub}>{c.sub}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.successBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={styles.successBtnText}>Back to Home</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>CAMPUS CARTEL</Text>
            <Text style={styles.headline}>{isEditing ? 'Update Application' : 'Apply to Join'}</Text>
            <Text style={styles.subheadline}>{isEditing ? 'Edit your details below' : "India's fastest growing student community"}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="people" size={22} color="#FFFFFF" />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { icon: 'school-outline', label: '150+ Colleges' },
              { icon: 'people-outline', label: '2000+ Students' },
              { icon: 'trophy-outline', label: 'Earn Rewards' },
            ].map((s) => (
              <View key={s.label} style={styles.statChip}>
                <Ionicons name={s.icon as any} size={14} color={GREEN} />
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Ambassador / Referral Code</Text>
          <Text style={styles.sectionHint}>Have a referral code from an ambassador? Enter it below to get referred.</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Ambassador / Referral Code <Text style={styles.optional}>(optional)</Text></Text>
            <View style={[styles.inputWrapper, codeState === 'valid' && styles.inputValid, codeState === 'invalid' && styles.inputInvalid]}>
              <Ionicons name="gift-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={[styles.input, { textTransform: 'uppercase' }]} placeholder="e.g. JOHN1A2B" placeholderTextColor={colors.textLight} value={ambassadorCode} onChangeText={(t) => setAmbassadorCode(t.toUpperCase())} autoCapitalize="characters" autoCorrect={false} returnKeyType="next" />
              <View style={styles.codeStatus}>{codeIcon()}</View>
            </View>
            {codeHint() && <Text style={[styles.codeHintText, { color: codeHint()!.color }]}>{codeHint()!.text}</Text>}
          </View>

          <Text style={styles.sectionLabel}>Your Details</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>College / University</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="school-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="e.g. Delhi University" placeholderTextColor={colors.textLight} value={college} onChangeText={setCollege} autoCapitalize="words" returnKeyType="next" />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Course <Text style={styles.optional}>(optional)</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="book-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="e.g. B.Tech, MBA" placeholderTextColor={colors.textLight} value={course} onChangeText={setCourse} autoCapitalize="words" returnKeyType="next" />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>City <Text style={styles.optional}>(optional)</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="e.g. Mumbai" placeholderTextColor={colors.textLight} value={city} onChangeText={setCity} autoCapitalize="words" returnKeyType="done" />
            </View>
          </View>

          <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleSubmit} activeOpacity={0.8} disabled={submitting}>
            {submitting ? <ActivityIndicator size="small" color="#fff" /> : (
              <>
                <Text style={styles.submitBtnText}>{isEditing ? 'Update Application' : 'Submit Application'}</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>Your application will be reviewed by an admin. You'll be notified once approved.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // ── Success / Already Applied ────────────────────────────────
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Gap.xl,
    backgroundColor: colors.background,
  },
  successIconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.xl,
    ...shadow.lg,
  },
  successEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: GREEN,
    letterSpacing: 1.5,
    marginBottom: Gap.sm,
  },
  successHeadline: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.text,
    textAlign: 'center',
    marginBottom: Gap.md,
  },
  successBody: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Gap.xl,
  },
  successCards: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginBottom: Gap.xl,
    width: '100%',
  },
  successCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: Gap.md,
    alignItems: 'center',
    gap: 4,
    ...shadow.sm,
  },
  successCardLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.text,
    textAlign: 'center',
  },
  successCardSub: {
    fontSize: FontSize.micro,
    color: colors.textLight,
    textAlign: 'center',
  },
  successBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    backgroundColor: GREEN,
    borderRadius: radius.xl,
    paddingVertical: Gap.md,
    paddingHorizontal: Gap.xl,
    ...shadow.md,
  },
  successBtnText: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: '#fff',
  },
  alreadyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingVertical: Gap.sm,
    paddingHorizontal: Gap.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Gap.xl,
  },
  alreadyBadgeText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontWeight: Font.medium,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.xs,
    marginTop: Gap.base,
    paddingVertical: Gap.sm,
  },
  withdrawBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.error,
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: Gap.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Gap.md,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(14,14,14,0.1)',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  headerText: { flex: 1 },
  eyebrow: { fontSize: FontSize.xs, fontWeight: Font.bold, color: 'rgba(14,14,14,0.6)', letterSpacing: 1.5, marginBottom: 4 },
  headline: { fontSize: FontSize.h1, fontWeight: Font.black, color: colors.ink, lineHeight: 28, letterSpacing: -0.5 },
  subheadline: { fontSize: FontSize.small, color: 'rgba(14,14,14,0.6)', marginTop: 3, fontWeight: Font.medium },
  badge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.ink,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },

  // ── Stats ────────────────────────────────────────────────────
  statsRow: { flexDirection: 'row', gap: Gap.sm, marginBottom: Gap.xl },
  statChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.surface, borderRadius: radius.md,
    paddingVertical: Gap.sm, paddingHorizontal: Gap.sm, ...shadow.sm,
  },
  statLabel: { fontSize: FontSize.xs, fontWeight: Font.semibold, color: colors.text, flexShrink: 1 },

  // ── Form ────────────────────────────────────────────────────
  form: { padding: Gap.base, paddingBottom: Gap.xxxl },
  sectionLabel: {
    fontSize: FontSize.small, fontWeight: Font.bold, color: colors.text,
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: Gap.lg, marginBottom: Gap.xs,
  },
  sectionHint: { fontSize: FontSize.small, color: colors.textSecondary, marginBottom: Gap.md, lineHeight: 18 },
  fieldGroup: { marginBottom: Gap.md },
  fieldLabel: { fontSize: FontSize.small, fontWeight: Font.semibold, color: colors.text, marginBottom: 6 },
  optional: { fontWeight: Font.regular, color: colors.textLight },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: Gap.md, height: 48, gap: Gap.sm, ...shadow.sm,
  },
  inputValid: { borderColor: colors.success },
  inputInvalid: { borderColor: colors.error },
  inputIcon: { flexShrink: 0 },
  input: { flex: 1, fontSize: FontSize.body, color: colors.text, paddingVertical: 0 },
  codeStatus: { width: 22, alignItems: 'center' },
  codeHintText: { fontSize: FontSize.xs, marginTop: 5, marginLeft: 4 },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Gap.sm, backgroundColor: GREEN, borderRadius: radius.xl,
    height: 52, marginTop: Gap.xl, ...shadow.md,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: FontSize.h3, fontWeight: Font.bold, color: '#fff' },
  disclaimer: { fontSize: FontSize.xs, color: colors.textLight, textAlign: 'center', marginTop: Gap.base, lineHeight: 16 },
});
