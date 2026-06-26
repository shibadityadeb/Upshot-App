import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import { useAuthStore } from '../../src/store/auth.store';
import {
  colors,
  DarkBg,
  spacing,
  radius,
} from '../../src/constants/theme';
import { Button, Input } from '../../src/components/common';

const api = createApiClient();

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
        Alert.alert('Error', 'Could not find your company profile.');
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
      Alert.alert('Error', 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [user, title, projectType, description, eventDate, eventTime, location, mapsUrl, teamSize, coinReward, requirements, budgetRange]);

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Requirement submitted!</Text>
          <Text style={styles.successSubtitle}>
            Our team will review this and reach out within 24 hours.
          </Text>
          <Button
            title="View my projects"
            variant="outline"
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.accent} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a requirement</Text>
        <Text style={styles.headerSubtitle}>UBM will match you with the right team</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionHeader}>PROJECT DETAILS</Text>

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

          <Input
            label="Description *"
            placeholder="Describe what you need..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            error={errors.description}
          />

          <Text style={styles.sectionHeader}>EVENT DETAILS</Text>

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

          <Text style={styles.sectionHeader}>TEAM &amp; BUDGET</Text>

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

          <Text style={styles.sectionHeader}>REQUIREMENTS</Text>

          <Input
            label="Special requirements or notes"
            placeholder="Any dress code, language skills, etc."
            value={requirements}
            onChangeText={setRequirements}
            multiline
            numberOfLines={4}
          />

          <Button
            title="Submit to UBM"
            variant="primary"
            loading={submitting}
            style={styles.submitBtn}
            onPress={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: DarkBg,
    paddingTop: 52,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 14,
    color: colors.accent,
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.accent,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: spacing.lg,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  pillsRow: {
    paddingBottom: 8,
    gap: 8,
  },
  pill: {
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pillSelected: {
    backgroundColor: colors.primary,
  },
  pillUnselected: {
    backgroundColor: colors.border,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  pillTextUnselected: {
    color: colors.textSecondary,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginBottom: 8,
  },
  submitBtn: {
    marginTop: spacing.lg,
    marginBottom: 0,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  successEmoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginTop: 16,
  },
  successSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  successBtn: {
    marginTop: 32,
    marginHorizontal: 32,
    alignSelf: 'stretch',
  },
  anotherBtn: {
    marginTop: 12,
  },
});
