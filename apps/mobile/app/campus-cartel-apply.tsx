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
import { colors, Font, FontSize, Gap, radius, shadow, verticalColors } from '../src/constants/theme';
import { useAuthStore } from '../src/store/auth.store';
import { useDebounce } from '../src/hooks/useDebounce';

const api = createApiClient();
const GREEN = verticalColors.campusCartel;

type CodeState = 'idle' | 'checking' | 'valid' | 'invalid';
type ScreenState = 'form' | 'checking-existing' | 'already-applied' | 'editing' | 'success';

export default function CampusCartelApply() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [screen, setScreen] = useState<ScreenState>('checking-existing');

  // ─── Form state ──────────────────────────────────────────────
  const [email, setEmail] = useState(user?.email ?? '');
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [college, setCollege] = useState('');
  const [ambassadorCode, setAmbassadorCode] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [existingCollege, setExistingCollege] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ─── Check if already applied (re-checks on every focus) ─────
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) {
        setScreen('form');
        return;
      }
      // Don't reset to checking if user is actively editing
      setScreen((prev) => prev === 'editing' ? prev : 'checking-existing');
      api.supabase
        .from('students')
        .select('id, college, city, state, ambassador_code')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          setScreen((prev) => {
            if (prev === 'editing') return prev;
            if (data) {
              setExistingCollege(data.college ?? '');
              setCollege(data.college ?? '');
              setCity(data.city ?? '');
              setStateName(data.state ?? '');
              setAmbassadorCode(data.ambassador_code ?? '');
              return 'already-applied';
            }
            return 'form';
          });
        });
    }, [user?.id]),
  );

  // ─── Ambassador code validation ──────────────────────────────
  const [codeState, setCodeState] = useState<CodeState>('idle');
  const [validatedAmbassadorId, setValidatedAmbassadorId] = useState<string | null>(null);
  const debouncedCode = useDebounce(ambassadorCode.trim().toUpperCase(), 500);

  useEffect(() => {
    if (!debouncedCode) {
      setCodeState('idle');
      setValidatedAmbassadorId(null);
      return;
    }
    setCodeState('checking');
    api.ambassadors.validateReferralCode(debouncedCode).then(({ data }) => {
      if (data?.valid && data.ambassador_id) {
        setCodeState('valid');
        setValidatedAmbassadorId(data.ambassador_id);
      } else {
        setCodeState('invalid');
        setValidatedAmbassadorId(null);
      }
    });
  }, [debouncedCode]);

  const isNormalStudent = codeState !== 'valid';

  // ─── Submit ───────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!email.trim()) return 'Please enter your student email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.';
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!college.trim()) return 'Please enter your college name.';
    if (isNormalStudent && !city.trim()) return 'Please enter your city.';
    if (isNormalStudent && !stateName.trim()) return 'Please enter your state.';
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
      const { error } = await api.supabase.from('students').upsert(
        {
          user_id: user.id,
          college: college.trim(),
          ambassador_code: validatedAmbassadorId ? ambassadorCode.trim().toUpperCase() : null,
          referred_by: validatedAmbassadorId ?? null,
          city: isNormalStudent ? city.trim() : null,
          state: isNormalStudent ? stateName.trim() : null,
          status: 'pending',
        },
        { onConflict: 'user_id' },
      );
      if (error) throw new Error(error.message);

      if (validatedAmbassadorId) {
        await api.supabase.rpc('increment_referral_count', {
          ambassador_row_id: validatedAmbassadorId,
        });
      }

      setScreen('success');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }, [email, fullName, college, ambassadorCode, city, stateName, validatedAmbassadorId, isNormalStudent, user]);

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
    if (!user?.id) return;
    Alert.alert(
      'Withdraw Application',
      'Are you sure you want to withdraw your Campus Cartel application? You can re-apply later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            setWithdrawing(true);
            try {
              const { error, count } = await api.supabase
                .from('students')
                .delete({ count: 'exact' })
                .eq('user_id', user.id);
              if (error) throw new Error(error.message);
              if (count === 0) {
                Alert.alert(
                  'Unable to Withdraw',
                  'Could not delete the application. Please contact support or try again later.',
                );
                return;
              }
              router.back();
            } catch (e) {
              Alert.alert('Error', e instanceof Error ? e.message : 'Failed to withdraw. Please try again.');
            } finally {
              setWithdrawing(false);
            }
          },
        },
      ],
    );
  }, [user?.id, router]);

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
          <Text style={styles.successHeadline}>{isEditing ? 'Updated!' : "You're in the Cartel!"}</Text>
          <Text style={styles.successBody}>
            {isEditing
              ? 'Your application has been updated and sent back for review. We\'ll let you know once it\'s approved.'
              : "Welcome to India's fastest growing student ambassador network. We'll be in touch soon with next steps."}
          </Text>

          <View style={styles.successCards}>
            {[
              { icon: 'people-outline', label: '2000+ Students', sub: 'Join the community' },
              { icon: 'trophy-outline', label: 'Earn Rewards', sub: 'For every referral' },
              { icon: 'flash-outline', label: 'Exclusive Events', sub: 'Members only access' },
            ].map((c) => (
              <View key={c.label} style={styles.successCard}>
                <Ionicons name={c.icon as any} size={20} color={GREEN} />
                <Text style={styles.successCardLabel}>{c.label}</Text>
                <Text style={styles.successCardSub}>{c.sub}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.successBtn} onPress={() => { setIsEditing(false); router.back(); }} activeOpacity={0.8}>
            <Text style={styles.successBtnText}>Back to Home</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Already applied screen ───────────────────────────────────
  if (screen === 'already-applied') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <View style={[styles.successIconRing, { backgroundColor: '#F59E0B' }]}>
            <Ionicons name="hourglass-outline" size={44} color="#fff" />
          </View>
          <Text style={styles.successEyebrow}>APPLICATION SUBMITTED</Text>
          <Text style={styles.successHeadline}>Under Review</Text>
          <Text style={styles.successBody}>
            {existingCollege
              ? `Your application from ${existingCollege} has been submitted.`
              : 'Your Campus Cartel application has been submitted.'}
            {'\n'}Our admin team is reviewing it — we'll let you know once it's approved.
          </Text>

          <View style={[styles.alreadyBadge]}>
            <Ionicons name="mail-outline" size={16} color={colors.primary} />
            <Text style={styles.alreadyBadgeText}>{user?.email ?? email}</Text>
          </View>

          <TouchableOpacity
            style={[styles.successBtn, { backgroundColor: GREEN }]}
            onPress={() => { setIsEditing(true); setScreen('editing'); }}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
            <Text style={styles.successBtnText}>Edit Application</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.successBtn, { backgroundColor: colors.primary, marginTop: Gap.sm }]} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={styles.successBtnText}>Go Back</Text>
            <Ionicons name="arrow-back" size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw} activeOpacity={0.7} disabled={withdrawing}>
            {withdrawing ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={16} color={colors.error} />
                <Text style={styles.withdrawBtnText}>Withdraw Application</Text>
              </>
            )}
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
          <TouchableOpacity style={styles.backBtn} onPress={() => { if (isEditing) { setIsEditing(false); setScreen('already-applied'); } else { router.back(); } }} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>CAMPUS CARTEL</Text>
            <Text style={styles.headline}>{isEditing ? 'Update Application' : 'Join the Network'}</Text>
            <Text style={styles.subheadline}>{isEditing ? 'Edit your details below' : "India's fastest growing student community"}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="people" size={22} color={GREEN} />
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

          <Text style={styles.sectionLabel}>Personal Details</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Your full name" placeholderTextColor={colors.textLight} value={fullName} onChangeText={setFullName} autoCapitalize="words" returnKeyType="next" />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Student Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="your@college.edu" placeholderTextColor={colors.textLight} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" returnKeyType="next" />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>College / University</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="school-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="e.g. Delhi University" placeholderTextColor={colors.textLight} value={college} onChangeText={setCollege} autoCapitalize="words" returnKeyType="next" />
            </View>
          </View>

          <Text style={styles.sectionLabel}>Ambassador Code</Text>
          <Text style={styles.sectionHint}>Have a code from a Campus Cartel ambassador? Enter it to get referred and earn bonus rewards.</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Ambassador Code <Text style={styles.optional}>(optional)</Text></Text>
            <View style={[styles.inputWrapper, codeState === 'valid' && styles.inputValid, codeState === 'invalid' && styles.inputInvalid]}>
              <Ionicons name="gift-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={[styles.input, { textTransform: 'uppercase' }]} placeholder="e.g. JOHN1A2B" placeholderTextColor={colors.textLight} value={ambassadorCode} onChangeText={(t) => setAmbassadorCode(t.toUpperCase())} autoCapitalize="characters" autoCorrect={false} returnKeyType="done" />
              <View style={styles.codeStatus}>{codeIcon()}</View>
            </View>
            {codeHint() && <Text style={[styles.codeHintText, { color: codeHint()!.color }]}>{codeHint()!.text}</Text>}
          </View>

          {isNormalStudent && (
            <>
              <Text style={styles.sectionLabel}>Your Location</Text>
              <Text style={styles.sectionHint}>Help us connect you with nearby events and opportunities.</Text>
              <View style={styles.row}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>City</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="location-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="e.g. Mumbai" placeholderTextColor={colors.textLight} value={city} onChangeText={setCity} autoCapitalize="words" returnKeyType="next" />
                  </View>
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>State</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="map-outline" size={16} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="e.g. Maharashtra" placeholderTextColor={colors.textLight} value={stateName} onChangeText={setStateName} autoCapitalize="words" returnKeyType="done" />
                  </View>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleSubmit} activeOpacity={0.8} disabled={submitting}>
            {submitting ? <ActivityIndicator size="small" color="#fff" /> : (
              <>
                <Text style={styles.submitBtnText}>{isEditing ? 'Update Application' : 'Apply to Campus Cartel'}</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>By applying, you agree to be part of the Upshot Brand Media Campus Cartel network.</Text>
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
    backgroundColor: colors.dark,
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: Gap.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Gap.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  headerText: { flex: 1 },
  eyebrow: { fontSize: FontSize.xs, fontWeight: Font.bold, color: GREEN, letterSpacing: 1.5, marginBottom: 4 },
  headline: { fontSize: FontSize.h1, fontWeight: Font.black, color: colors.surface, lineHeight: 28 },
  subheadline: { fontSize: FontSize.small, color: 'rgba(255,255,255,0.5)', marginTop: 3 },
  badge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(4,120,87,0.15)',
    borderWidth: 1, borderColor: 'rgba(4,120,87,0.3)',
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
  row: { flexDirection: 'row', gap: Gap.sm },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Gap.sm, backgroundColor: GREEN, borderRadius: radius.xl,
    height: 52, marginTop: Gap.xl, ...shadow.md,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: FontSize.h3, fontWeight: Font.bold, color: '#fff' },
  disclaimer: { fontSize: FontSize.xs, color: colors.textLight, textAlign: 'center', marginTop: Gap.base, lineHeight: 16 },
});
