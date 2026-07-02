import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createApiClient } from '@upshot/api-client';
import type { HostingApplication } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { StatusBadge } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { uploadEventImage } from '../../src/utils/uploadEventImage';

const api = createApiClient();

const CATEGORIES = ['Social', 'BFSI', 'Corporate', 'Other'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const SECTORS = [
  'Technology', 'Education', 'Finance', 'Healthcare', 'Media', 'Entertainment',
  'Retail', 'Manufacturing', 'Consulting', 'Non-Profit', 'Government', 'Other',
];

/* ── Picker Modal ─────────────────────────────────────────────────────────── */

function PickerModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.sheet}>
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            style={pickerStyles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[pickerStyles.option, selected === item && pickerStyles.optionActive]}
                onPress={() => { onSelect(item); onClose(); }}
                activeOpacity={0.7}
              >
                <Text style={[pickerStyles.optionText, selected === item && pickerStyles.optionTextActive]}>
                  {item}
                </Text>
                {selected === item && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

/* ── Date Picker Modal ────────────────────────────────────────────────────── */

function DatePickerModal({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean;
  onSelect: (date: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const handleSelect = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onSelect(`${year}-${m}-${d}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.sheet}>
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={dateStyles.nav}>
            <TouchableOpacity onPress={prevMonth} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={dateStyles.navTitle}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={dateStyles.weekRow}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <Text key={d} style={dateStyles.weekDay}>{d}</Text>
            ))}
          </View>
          <View style={dateStyles.grid}>
            {days.map((day, i) => (
              <View key={i} style={dateStyles.dayCell}>
                {day ? (
                  <TouchableOpacity style={dateStyles.dayBtn} onPress={() => handleSelect(day)} activeOpacity={0.7}>
                    <Text style={dateStyles.dayText}>{day}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ── Time Picker Modal ─────────────────────────────────────────────────────── */

function TimePickerModal({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean;
  onSelect: (time: string) => void;
  onClose: () => void;
}) {
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const adjustHour = (delta: number) => {
    setHour((h) => {
      const next = h + delta;
      if (next > 12) return 1;
      if (next < 1) return 12;
      return next;
    });
  };

  const adjustMinute = (delta: number) => {
    setMinute((m) => {
      const next = m + delta;
      if (next >= 60) return 0;
      if (next < 0) return 55;
      return next;
    });
  };

  const handleConfirm = () => {
    const h = String(hour).padStart(2, '0');
    const m = String(minute).padStart(2, '0');
    onSelect(`${h}:${m} ${period}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.sheet}>
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>Select Time</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={timeStyles.container}>
            <View style={timeStyles.column}>
              <TouchableOpacity onPress={() => adjustHour(1)} activeOpacity={0.7} style={timeStyles.arrowBtn}>
                <Ionicons name="chevron-up" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={timeStyles.value}>{String(hour).padStart(2, '0')}</Text>
              <TouchableOpacity onPress={() => adjustHour(-1)} activeOpacity={0.7} style={timeStyles.arrowBtn}>
                <Ionicons name="chevron-down" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={timeStyles.separator}>:</Text>
            <View style={timeStyles.column}>
              <TouchableOpacity onPress={() => adjustMinute(5)} activeOpacity={0.7} style={timeStyles.arrowBtn}>
                <Ionicons name="chevron-up" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={timeStyles.value}>{String(minute).padStart(2, '0')}</Text>
              <TouchableOpacity onPress={() => adjustMinute(-5)} activeOpacity={0.7} style={timeStyles.arrowBtn}>
                <Ionicons name="chevron-down" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={timeStyles.periodCol}>
              <TouchableOpacity
                style={[timeStyles.periodBtn, period === 'AM' && timeStyles.periodBtnActive]}
                onPress={() => setPeriod('AM')}
                activeOpacity={0.7}
              >
                <Text style={[timeStyles.periodText, period === 'AM' && timeStyles.periodTextActive]}>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[timeStyles.periodBtn, period === 'PM' && timeStyles.periodBtnActive]}
                onPress={() => setPeriod('PM')}
                activeOpacity={0.7}
              >
                <Text style={[timeStyles.periodText, period === 'PM' && timeStyles.periodTextActive]}>PM</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={timeStyles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
            <Text style={timeStyles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ── Selector Field Component ─────────────────────────────────────────────── */

function SelectorField({
  label, value, placeholder, onPress, required,
}: {
  label: string; value: string; placeholder: string; onPress: () => void; required?: boolean;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}{required ? ' *' : ''}</Text>
      <TouchableOpacity style={styles.selectorBtn} onPress={onPress} activeOpacity={0.7}>
        <Text style={[styles.selectorText, !value && { color: colors.textLight }]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );
}

/* ── Application Card ─────────────────────────────────────────────────────── */

function ApplicationCard({ app }: { app: HostingApplication }) {
  return (
    <View style={listStyles.card}>
      <View style={listStyles.cardHeader}>
        <Text style={listStyles.cardTitle} numberOfLines={2}>{app.title}</Text>
        <StatusBadge status={app.status} />
      </View>

      <View style={listStyles.metaRow}>
        <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
        <Text style={listStyles.metaText} numberOfLines={1}>
          {app.event_city && app.event_state ? `${app.event_city}, ${app.event_state}` : app.location}
        </Text>
      </View>

      {!!app.event_date && (
        <View style={listStyles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
          <Text style={listStyles.metaText}>
            {new Date(app.event_date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </Text>
        </View>
      )}

      <View style={listStyles.metaRow}>
        <Ionicons name="pricetag-outline" size={13} color={colors.textSecondary} />
        <Text style={listStyles.metaText}>{app.event_type === 'organisation' ? 'Organisation' : 'Personal'} · {app.category}</Text>
      </View>

      <View style={listStyles.metaRow}>
        <Ionicons name="time-outline" size={13} color={colors.textLight} />
        <Text style={listStyles.appliedDate}>
          Submitted {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </View>

      {app.status === 'approved' && (
        <Text style={listStyles.approvedText}>Your event has been approved!</Text>
      )}
      {app.status === 'rejected' && !!app.rejection_reason && (
        <Text style={listStyles.rejectedText}>{app.rejection_reason}</Text>
      )}
    </View>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */

export default function HostEvent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  // View mode: 'list' shows submitted applications, 'form' shows the creation form
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [myApps, setMyApps] = useState<HostingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadApplications = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const result = await api.hosting.getMyApplications(user.id);
      if (result.data) setMyApps(result.data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadApplications();
    }, [loadApplications]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadApplications();
  }, [loadApplications]);

  // Form state
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Personal details
  const [applicantName, setApplicantName] = useState(user?.full_name ?? '');
  const [applicantPhone, setApplicantPhone] = useState(user?.phone ?? '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email ?? '');
  const [eventType, setEventType] = useState<'organisation' | 'personal'>('personal');

  // Step 2: Organisation details
  const [orgLegalName, setOrgLegalName] = useState('');
  const [orgCity, setOrgCity] = useState('');
  const [orgState, setOrgState] = useState('');
  const [orgSector, setOrgSector] = useState('');
  const [orgDesignation, setOrgDesignation] = useState('');

  // Step 3: Event details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [fees, setFees] = useState('');
  const [eventCity, setEventCity] = useState('');
  const [eventState, setEventState] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState('Social');

  // Picker modals
  const [showOrgState, setShowOrgState] = useState(false);
  const [showOrgSector, setShowOrgSector] = useState(false);
  const [showEventState, setShowEventState] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const isOrg = eventType === 'organisation';
  const displayStep = step;
  const displayTotal = isOrg ? 3 : 2;

  const resetForm = useCallback(() => {
    setStep(1);
    setApplicantName(user?.full_name ?? '');
    setApplicantPhone(user?.phone ?? '');
    setApplicantEmail(user?.email ?? '');
    setEventType('personal');
    setOrgLegalName(''); setOrgCity(''); setOrgState(''); setOrgSector(''); setOrgDesignation('');
    setTitle(''); setDescription(''); setMaxAttendees(''); setFees('');
    setEventCity(''); setEventState(''); setEventDate(''); setEventTime('');
    setLocationUrl(''); setImageUri(null); setCategory('Social');
  }, [user]);

  const startNewProposal = useCallback(() => {
    resetForm();
    setMode('form');
  }, [resetForm]);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const validateStep1 = () => {
    if (!applicantName.trim()) return 'Please enter your name.';
    if (!applicantPhone.trim()) return 'Please enter your phone number.';
    if (!applicantEmail.trim()) return 'Please enter your email.';
    return null;
  };

  const validateStep2 = () => {
    if (!orgLegalName.trim()) return 'Please enter your organisation\'s legal name.';
    if (!orgCity.trim()) return 'Please enter your organisation\'s city.';
    if (!orgState) return 'Please select your organisation\'s state.';
    if (!orgSector) return 'Please select your organisation\'s sector.';
    if (!orgDesignation.trim()) return 'Please enter your designation.';
    return null;
  };

  const validateStep3 = () => {
    if (!title.trim()) return 'Please enter the event name.';
    if (!eventCity.trim()) return 'Please enter the event city.';
    if (!eventState) return 'Please select the event state.';
    if (!eventDate) return 'Please select the event date.';
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) { Alert.alert('Missing info', err); return; }
      setStep(2);
    } else if (step === 2 && isOrg) {
      const err = validateStep2();
      if (err) { Alert.alert('Missing info', err); return; }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setMode('list');
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const showEventDetails = (isOrg && step === 3) || (!isOrg && step === 2);

  const handleSubmit = useCallback(async () => {
    const err = validateStep3();
    if (err) { Alert.alert('Missing info', err); return; }
    if (!user?.id) return;
    setSubmitting(true);

    let coverUrl: string | undefined;
    let imageWarning = false;

    if (imageUri) {
      const url = await uploadEventImage(imageUri, user.id);
      if (url) {
        coverUrl = url;
      } else {
        imageWarning = true;
      }
    }

    try {
      const result = await api.hosting.submitApplication(user.id, {
        applicant_name: applicantName.trim(),
        applicant_phone: applicantPhone.trim(),
        applicant_email: applicantEmail.trim(),
        event_type: eventType,
        ...(isOrg ? {
          org_legal_name: orgLegalName.trim(),
          org_city: orgCity.trim(),
          org_state: orgState,
          org_sector: orgSector,
          org_designation: orgDesignation.trim(),
        } : {}),
        title: title.trim(),
        description: description.trim() || undefined,
        event_date: eventDate,
        event_time: eventTime.trim() || undefined,
        location: `${eventCity.trim()}, ${eventState}`,
        event_city: eventCity.trim(),
        event_state: eventState,
        location_url: locationUrl.trim() || undefined,
        category,
        max_attendees: maxAttendees ? parseInt(maxAttendees, 10) : undefined,
        fees: fees ? parseInt(fees, 10) : undefined,
        cover_image_url: coverUrl,
      });

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        const msg = imageWarning
          ? 'Your hosting application was submitted, but the image could not be uploaded.'
          : 'Your hosting application has been submitted for review!';
        Alert.alert('Submitted!', msg, [{
          text: 'OK',
          onPress: () => {
            resetForm();
            setMode('list');
            loadApplications();
          },
        }]);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [user, applicantName, applicantPhone, applicantEmail, eventType, isOrg,
    orgLegalName, orgCity, orgState, orgSector, orgDesignation,
    title, description, eventDate, eventTime, eventCity, eventState,
    locationUrl, category, maxAttendees, fees, imageUri, resetForm, loadApplications]);

  const getStepTitle = () => {
    if (step === 1) return 'Personal Details';
    if (step === 2 && isOrg) return 'Organisation Details';
    return 'Event Details';
  };

  /* ── LIST VIEW ────────────────────────────────────────────────────────────── */

  if (mode === 'list') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>HOST AN EVENT</Text>
            <Text style={styles.headerTitle}>My Proposals</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={listStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          {/* New proposal button */}
          <TouchableOpacity style={listStyles.newBtn} onPress={startNewProposal} activeOpacity={0.8}>
            <View style={listStyles.newBtnIcon}>
              <Ionicons name="add" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={listStyles.newBtnTitle}>Submit a New Event Proposal</Text>
              <Text style={listStyles.newBtnSub}>Fill in the details and submit for review</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          {/* Submitted applications */}
          {loading ? (
            <View style={listStyles.loader}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : myApps.length === 0 ? (
            <View style={listStyles.empty}>
              <Ionicons name="document-text-outline" size={48} color={colors.border} />
              <Text style={listStyles.emptyTitle}>No proposals yet</Text>
              <Text style={listStyles.emptySub}>Submit your first event proposal above</Text>
            </View>
          ) : (
            <>
              <Text style={listStyles.sectionTitle}>Submitted Proposals</Text>
              {myApps.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  /* ── FORM VIEW ────────────────────────────────────────────────────────────── */

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>HOST AN EVENT</Text>
            <Text style={styles.headerTitle}>{getStepTitle()}</Text>
          </View>
          <Text style={styles.stepIndicator}>Step {displayStep}/{displayTotal}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(displayStep / displayTotal) * 100}%` }]} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Step 1: Personal Details ─────────────────────────────────── */}
          {step === 1 && (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textLight}
                  value={applicantName}
                  onChangeText={setApplicantName}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.textLight}
                  value={applicantPhone}
                  onChangeText={setApplicantPhone}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor={colors.textLight}
                  value={applicantEmail}
                  onChangeText={setApplicantEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Event Type *</Text>
                <View style={styles.pillRow}>
                  <TouchableOpacity
                    style={[styles.typePill, eventType === 'personal' && styles.typePillActive]}
                    onPress={() => setEventType('personal')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="person-outline" size={16} color={eventType === 'personal' ? '#fff' : colors.textSecondary} />
                    <Text style={[styles.typePillText, eventType === 'personal' && styles.typePillTextActive]}>Personal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.typePill, eventType === 'organisation' && styles.typePillActive]}
                    onPress={() => setEventType('organisation')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="business-outline" size={16} color={eventType === 'organisation' ? '#fff' : colors.textSecondary} />
                    <Text style={[styles.typePillText, eventType === 'organisation' && styles.typePillTextActive]}>Organisation</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* ── Step 2: Organisation Details (only for org type) ──────────── */}
          {step === 2 && isOrg && (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Legal Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Registered organisation name"
                  placeholderTextColor={colors.textLight}
                  value={orgLegalName}
                  onChangeText={setOrgLegalName}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Organisation city"
                  placeholderTextColor={colors.textLight}
                  value={orgCity}
                  onChangeText={setOrgCity}
                  returnKeyType="next"
                />
              </View>

              <SelectorField label="State" value={orgState} placeholder="Select state" onPress={() => setShowOrgState(true)} required />
              <SelectorField label="Sector" value={orgSector} placeholder="Select sector" onPress={() => setShowOrgSector(true)} required />

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Your Designation *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Founder, Manager, Coordinator"
                  placeholderTextColor={colors.textLight}
                  value={orgDesignation}
                  onChangeText={setOrgDesignation}
                  returnKeyType="done"
                />
              </View>

              <PickerModal visible={showOrgState} title="Select State" options={INDIAN_STATES} selected={orgState} onSelect={setOrgState} onClose={() => setShowOrgState(false)} />
              <PickerModal visible={showOrgSector} title="Select Sector" options={SECTORS} selected={orgSector} onSelect={setOrgSector} onClose={() => setShowOrgSector(false)} />
            </>
          )}

          {/* ── Event Details ────────────────────────────────────────────── */}
          {showEventDetails && (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Event Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Product Launch Workshop"
                  placeholderTextColor={colors.textLight}
                  value={title}
                  onChangeText={setTitle}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Category</Text>
                <View style={styles.pillRow}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.pill, category === cat && styles.pillActive]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell people about this event..."
                  placeholderTextColor={colors.textLight}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.fieldGroup, styles.flex]}>
                  <Text style={styles.fieldLabel}>Capacity</Text>
                  <TextInput style={styles.input} placeholder="e.g. 50" placeholderTextColor={colors.textLight} value={maxAttendees} onChangeText={setMaxAttendees} keyboardType="number-pad" />
                </View>
                <View style={[styles.fieldGroup, styles.flex]}>
                  <Text style={styles.fieldLabel}>Fees (₹)</Text>
                  <TextInput style={styles.input} placeholder="0 for free" placeholderTextColor={colors.textLight} value={fees} onChangeText={setFees} keyboardType="number-pad" />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>City *</Text>
                <TextInput style={styles.input} placeholder="Event city" placeholderTextColor={colors.textLight} value={eventCity} onChangeText={setEventCity} returnKeyType="next" />
              </View>

              <SelectorField label="State" value={eventState} placeholder="Select state" onPress={() => setShowEventState(true)} required />

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Date *</Text>
                <TouchableOpacity style={styles.selectorBtn} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                  <Text style={[styles.selectorText, !eventDate && { color: colors.textLight }]}>{eventDate || 'Select date'}</Text>
                  <Ionicons name="calendar-outline" size={16} color={colors.textLight} />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Time</Text>
                <TouchableOpacity style={styles.selectorBtn} onPress={() => setShowTimePicker(true)} activeOpacity={0.7}>
                  <Text style={[styles.selectorText, !eventTime && { color: colors.textLight }]}>{eventTime || 'Select time'}</Text>
                  <Ionicons name="time-outline" size={16} color={colors.textLight} />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Google Maps Link</Text>
                <TextInput style={styles.input} placeholder="Google Maps URL (optional)" placeholderTextColor={colors.textLight} value={locationUrl} onChangeText={setLocationUrl} autoCapitalize="none" keyboardType="url" />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Cover Photo</Text>
                {imageUri ? (
                  <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                    <View style={styles.imagePreview}>
                      <Image source={{ uri: imageUri }} style={styles.previewImg} />
                      <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri(null)} activeOpacity={0.7}>
                        <Ionicons name="close-circle" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.7}>
                    <Ionicons name="camera-outline" size={28} color={colors.textLight} />
                    <Text style={styles.imagePickerText}>Add event cover photo (optional)</Text>
                    <Text style={styles.imagePickerHint}>Tap to select from your gallery</Text>
                  </TouchableOpacity>
                )}
              </View>

              <PickerModal visible={showEventState} title="Select State" options={INDIAN_STATES} selected={eventState} onSelect={setEventState} onClose={() => setShowEventState(false)} />
              <DatePickerModal visible={showDatePicker} onSelect={setEventDate} onClose={() => setShowDatePicker(false)} />
              <TimePickerModal visible={showTimePicker} onSelect={setEventTime} onClose={() => setShowTimePicker(false)} />
            </>
          )}
        </ScrollView>

        {/* Bottom button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          {!showEventDetails ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextBtn, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.nextBtnText}>Submit for Review</Text>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ── Styles ────────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  header: {
    backgroundColor: colors.dark,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerEyebrow: {
    fontSize: FontSize.xs, fontWeight: Font.bold,
    color: colors.accent, letterSpacing: 1.5, marginBottom: 2,
  },
  headerTitle: { fontSize: FontSize.h1, fontWeight: Font.bold, color: '#fff' },
  stepIndicator: {
    fontSize: FontSize.small, fontWeight: Font.semibold,
    color: 'rgba(255,255,255,0.5)',
  },

  progressBar: { height: 3, backgroundColor: colors.border },
  progressFill: { height: 3, backgroundColor: colors.primary },

  scrollContent: { padding: Gap.base, paddingBottom: 40 },

  fieldGroup: { marginBottom: Gap.lg },
  fieldLabel: {
    fontSize: FontSize.small, fontWeight: Font.semibold,
    color: colors.text, marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, height: 48,
    fontSize: FontSize.body, color: colors.text,
  },
  textArea: { height: 100, paddingTop: 12, paddingBottom: 12 },
  row: { flexDirection: 'row', gap: Gap.md },

  pillRow: { flexDirection: 'row', gap: Gap.sm, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { fontSize: 13, fontWeight: Font.semibold, color: colors.textSecondary },
  pillTextActive: { color: '#fff' },

  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  typePillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typePillText: { fontSize: 14, fontWeight: Font.semibold, color: colors.textSecondary },
  typePillTextActive: { color: '#fff' },

  selectorBtn: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, height: 48,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  selectorText: { fontSize: FontSize.body, color: colors.text },

  imagePicker: {
    borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed',
    borderRadius: radius.lg, height: 160,
    alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.surface,
  },
  imagePickerText: { fontSize: FontSize.body, fontWeight: Font.semibold, color: colors.textSecondary },
  imagePickerHint: { fontSize: FontSize.xs, color: colors.textLight },
  imagePreview: { height: 180, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#E4E4E7' },
  previewImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeImageBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12,
  },

  footer: {
    paddingHorizontal: Gap.base, paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border,
    ...shadow.md,
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Gap.sm, backgroundColor: colors.primary,
    borderRadius: radius.lg, height: 52,
  },
  nextBtnText: { fontSize: FontSize.h3, fontWeight: Font.bold, color: '#fff' },
});

const listStyles = StyleSheet.create({
  scrollContent: { paddingHorizontal: Gap.base, paddingTop: Gap.md, paddingBottom: 100 },

  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Gap.md,
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: Gap.base, marginBottom: Gap.lg,
    borderWidth: 1.5, borderColor: colors.primary + '33',
    ...shadow.md,
  },
  newBtnIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  newBtnTitle: { fontSize: FontSize.body, fontWeight: Font.bold, color: colors.text },
  newBtnSub: { fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 },

  sectionTitle: {
    fontSize: FontSize.small, fontWeight: Font.bold,
    color: colors.text, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: Gap.sm,
  },

  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: Gap.base, marginBottom: Gap.sm,
    borderWidth: 1, borderColor: colors.border,
    ...shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: Gap.sm, marginBottom: Gap.sm,
  },
  cardTitle: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.text, flex: 1, lineHeight: 22 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  metaText: { fontSize: FontSize.small, color: colors.textSecondary, flex: 1 },
  appliedDate: { fontSize: FontSize.xs, color: colors.textLight },

  approvedText: { marginTop: Gap.sm, fontSize: FontSize.body, fontWeight: Font.semibold, color: colors.success },
  rejectedText: { marginTop: Gap.sm, fontSize: FontSize.small, color: colors.error, fontStyle: 'italic' },

  loader: { paddingVertical: Gap.xxxl, alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: Gap.xxxl, gap: Gap.sm },
  emptyTitle: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.textSecondary },
  emptySub: { fontSize: FontSize.small, color: colors.textLight },
});

const pickerStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '60%', paddingBottom: 30,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Gap.base, paddingVertical: Gap.base,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { fontSize: FontSize.h2, fontWeight: Font.bold, color: colors.text },
  list: { paddingHorizontal: Gap.base },
  option: {
    paddingVertical: 14, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  optionActive: { backgroundColor: 'rgba(27,44,193,0.05)' },
  optionText: { fontSize: FontSize.body, color: colors.text },
  optionTextActive: { color: colors.primary, fontWeight: Font.semibold },
});

const dateStyles = StyleSheet.create({
  nav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Gap.base, paddingVertical: Gap.md,
  },
  navTitle: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.text },
  weekRow: { flexDirection: 'row', paddingHorizontal: Gap.sm },
  weekDay: {
    flex: 1, textAlign: 'center',
    fontSize: FontSize.xs, fontWeight: Font.semibold,
    color: colors.textLight, paddingVertical: 6,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Gap.sm, paddingBottom: Gap.base,
  },
  dayCell: {
    width: '14.28%', aspectRatio: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  dayBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  dayText: { fontSize: FontSize.body, color: colors.text },
});

const timeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Gap.xl, gap: Gap.base,
  },
  column: { alignItems: 'center', gap: Gap.sm },
  arrowBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  value: {
    fontSize: 36, fontWeight: Font.bold, color: colors.text,
    minWidth: 60, textAlign: 'center',
  },
  separator: { fontSize: 36, fontWeight: Font.bold, color: colors.text, marginBottom: 4 },
  periodCol: { gap: Gap.sm, marginLeft: Gap.md },
  periodBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.md,
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
  },
  periodBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodText: { fontSize: FontSize.body, fontWeight: Font.semibold, color: colors.textSecondary },
  periodTextActive: { color: '#fff' },
  confirmBtn: {
    marginHorizontal: Gap.base, marginBottom: Gap.base,
    backgroundColor: colors.primary, borderRadius: radius.lg, height: 48,
    alignItems: 'center', justifyContent: 'center',
  },
  confirmText: { fontSize: FontSize.h3, fontWeight: Font.bold, color: '#fff' },
});
