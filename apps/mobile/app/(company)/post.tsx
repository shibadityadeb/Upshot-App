import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import { useAuthStore } from '../../src/store/auth.store';
import {
  colors,
  Font,
  FontSize,
  Gap,
  radius,
  shadow,
  useResponsive,
} from '../../src/constants/theme';
import { Button, Input } from '../../src/components/common';
import { showError } from '../../src/store/error.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

const PROJECT_TYPES = [
  'Society activation',
  'BFSI activation',
  'Retail promotion',
  'Mall activation',
  'Product launch',
  'Corporate event',
  'Campus activation',
  'Lead generation',
  'Other',
];

export default function PostRequirement() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [title, setTitle] = useState('');
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [venueName, setVenueName] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [coinReward, setCoinReward] = useState('');
  const [requirements, setRequirements] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = useCallback(() => {
    setTitle('');
    setProjectType('');
    setDescription('');
    setEventDate('');
    setEventTime('');
    setLocation('');
    setVenueName('');
    setMapsUrl('');
    setTeamSize('');
    setBudgetRange('');
    setCoinReward('');
    setRequirements('');
    setErrors({});
    setSubmitted(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!user) return;

    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Project title is required';
    if (!projectType) newErrors.projectType = 'Please select a project type';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!eventDate.trim()) newErrors.eventDate = 'Event date is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!coinReward.trim()) newErrors.coinReward = 'Coin reward is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Missing fields', 'Please fill in all required fields');
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const { data: companyResult } = await api.supabase
        .from('companies')
        .select('id')
        .eq('contact_person_id', user.id)
        .single();

      if (!companyResult) {
        showError(null, { context: 'Could not find your company profile.' });
        return;
      }

      await api.events.createEvent(companyResult.id, user.id, {
        title,
        description,
        event_date: eventDate,
        event_time: eventTime || undefined,
        location,
        location_url: mapsUrl || undefined,
        category: projectType,
        max_attendees: teamSize ? parseInt(teamSize, 10) : undefined,
        coin_reward: parseInt(coinReward, 10) || 0,
        requirements: requirements || undefined,
        budget_range: budgetRange || undefined,
        project_type: projectType,
      });

      setSubmitted(true);
    } catch {
      showError(null, { context: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }, [user, title, projectType, description, eventDate, eventTime, location, mapsUrl, teamSize, coinReward, requirements, budgetRange]);

  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={[styles.successContainer, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Requirement submitted!</Text>
          <Text style={styles.successSubtitle}>
            Our team will review this and reach out within 24 hours.
          </Text>
          <Button
            title="View my projects"
            variant="primary"
            style={styles.successBtn}
            onPress={() => router.push('/(company)/projects')}
          />
          <Button
            title="Post another"
            variant="ghost"
            style={styles.anotherBtn}
            onPress={resetForm}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Lime liquid header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
          <View style={[styles.headerRow, columnStyle]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={20} color={colors.ink} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Post a requirement</Text>
              <Text style={styles.headerSubtitle}>UBM will match you with the right team</Text>
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, columnStyle]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionLabel}>PROJECT DETAILS</Text>
          <View style={styles.card}>
            <Input
              label="Project title *"
              placeholder="e.g. Mall activation in Connaught Place"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
            />

            <Text style={styles.fieldLabel}>Project type *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsRow}
            >
              {PROJECT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pill,
                    projectType === type ? styles.pillSelected : styles.pillUnselected,
                  ]}
                  onPress={() => setProjectType(type)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pillText,
                      projectType === type ? styles.pillTextSelected : styles.pillTextUnselected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.projectType ? (
              <Text style={styles.fieldError}>{errors.projectType}</Text>
            ) : null}

            <View style={styles.fieldSpacer} />

            <Input
              label="Description *"
              placeholder="Describe what you need..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              error={errors.description}
            />
          </View>

          <Text style={styles.sectionLabel}>EVENT DETAILS</Text>
          <View style={styles.card}>
            <Input
              label="Event date *"
              placeholder="DD/MM/YYYY"
              value={eventDate}
              onChangeText={setEventDate}
              error={errors.eventDate}
            />

            <Input
              label="Event time"
              placeholder="HH:MM AM/PM"
              value={eventTime}
              onChangeText={setEventTime}
            />

            <Input
              label="City / Location *"
              placeholder="e.g. Delhi, Mumbai"
              value={location}
              onChangeText={setLocation}
              error={errors.location}
            />

            <Input
              label="Venue name or address"
              placeholder="e.g. Select Citywalk, Saket"
              value={venueName}
              onChangeText={setVenueName}
            />

            <Input
              label="Maps URL (optional)"
              placeholder="https://maps.google.com/..."
              value={mapsUrl}
              onChangeText={setMapsUrl}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.sectionLabel}>TEAM &amp; BUDGET</Text>
          <View style={styles.card}>
            <Input
              label="Team size needed"
              placeholder="e.g. 10"
              value={teamSize}
              onChangeText={setTeamSize}
              keyboardType="numeric"
            />

            <Input
              label="Budget range"
              placeholder="e.g. ₹50,000 – ₹1,00,000"
              value={budgetRange}
              onChangeText={setBudgetRange}
            />

            <Input
              label="Coin reward per participant *"
              placeholder="e.g. 100"
              value={coinReward}
              onChangeText={setCoinReward}
              keyboardType="numeric"
              error={errors.coinReward}
            />
          </View>

          <Text style={styles.sectionLabel}>REQUIREMENTS</Text>
          <View style={styles.card}>
            <Input
              label="Special requirements or notes"
              placeholder="Any dress code, language skills, etc."
              value={requirements}
              onChangeText={setRequirements}
              multiline
              numberOfLines={4}
            />
          </View>

          <Button
            title="Submit to UBM"
            variant="primary"
            loading={submitting}
            style={styles.submitBtn}
            onPress={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },

  header: {
    backgroundColor: colors.primary,
    paddingBottom: Gap.xl,
    paddingHorizontal: Gap.base,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Gap.md },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(14,14,14,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.7,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: '#2c3326',
    marginTop: 3,
    fontWeight: Font.semibold,
  },

  scrollContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.base,
    paddingBottom: 40,
  },

  sectionLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Gap.sm,
    marginTop: Gap.md,
    marginLeft: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.base,
    ...shadow.sm,
  },

  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  pillsRow: {
    paddingBottom: 4,
    gap: Gap.sm,
  },
  pill: {
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillUnselected: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  pillText: {
    fontSize: 13,
    fontWeight: Font.semibold,
  },
  pillTextSelected: {
    color: colors.onPrimary,
    fontWeight: Font.bold,
  },
  pillTextUnselected: {
    color: colors.textSecondary,
  },
  fieldError: {
    fontSize: FontSize.xs,
    color: colors.error,
    marginTop: 4,
    fontWeight: Font.medium,
  },
  fieldSpacer: { height: Gap.base },

  submitBtn: {
    marginTop: Gap.lg,
    marginBottom: 0,
  },

  // ── Success ──
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: Gap.xl,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 30,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successEmoji: {
    fontSize: 44,
    textAlign: 'center',
  },
  successTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    textAlign: 'center',
    color: colors.ink,
    marginTop: Gap.base,
    letterSpacing: -0.4,
  },
  successSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  successBtn: {
    marginTop: Gap.xl,
    marginHorizontal: 32,
    alignSelf: 'stretch',
  },
  anotherBtn: {
    marginTop: Gap.md,
  },
});
