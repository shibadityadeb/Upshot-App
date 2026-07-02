import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createApiClient } from '@upshot/api-client';
import type { Vertical, Event, Task, UnfilteredVideo } from '@upshot/types';
import { colors, verticalColors, DarkBg, Font, FontSize, Gap, radius, shadow } from '../../../src/constants/theme';
import { Button, Card, EmptyState, LoadingScreen, CoinBadge, StatusBadge } from '../../../src/components/common';
import { useAuthStore } from '../../../src/store/auth.store';
import { uploadEventImage } from '../../../src/utils/uploadEventImage';

const api = createApiClient();

const VERTICAL_FALLBACKS: Record<string, Vertical> = {
  'unfiltered': {
    id: '1',
    name: 'Unfiltered',
    slug: 'unfiltered',
    tagline: 'Real conversations with leaders who are changing the game',
    color: '#6D28D9',
    is_active: true,
    sort_order: 1,
    created_at: '',
  },
  'campus-cartel': {
    id: '2',
    name: 'Campus Cartel',
    slug: 'campus-cartel',
    tagline: "India's largest student ambassador and campus network",
    color: '#059669',
    is_active: true,
    sort_order: 2,
    created_at: '',
  },
  'irise': {
    id: '3',
    name: 'iRISE',
    slug: 'irise',
    tagline: 'Celebrating women who lead, inspire and transform',
    color: '#D97706',
    is_active: true,
    sort_order: 3,
    created_at: '',
  },
  'ibelieve': {
    id: '4',
    name: 'iBelieve',
    slug: 'ibelieve',
    tagline: 'Where entrepreneurs and business leaders connect',
    color: '#DC2626',
    is_active: true,
    sort_order: 4,
    created_at: '',
  },
};

export default function VerticalDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const user = useAuthStore((s) => s.user);

  const [vertical, setVertical] = useState<Vertical | null>(null);
  const [verticalEvents, setVerticalEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Unfiltered videos state ─────────────────────────────
  const [unfilteredVideos, setUnfilteredVideos] = useState<UnfilteredVideo[]>([]);
  const [unfilteredChannelUrl, setUnfilteredChannelUrl] = useState<string | null>(null);

  // ─── Campus Cartel student state ─────────────────────────
  const [studentStatus, setStudentStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [isAmbassador, setIsAmbassador] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  // ─── Task submission state ───────────────────────────────
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [submissionImageUri, setSubmissionImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const v = await api.verticals.getVerticalBySlug(slug);
        setVertical(v);
        try {
          const { data: eventsData } = await (api as any).supabase
            .from('events')
            .select('*, companies(*)')
            .eq('status', 'approved')
            .eq('vertical_id', v.id)
            .order('event_date', { ascending: true })
            .limit(20);
          if (eventsData) setVerticalEvents(eventsData as Event[]);
        } catch (e) {
          console.warn('Failed to load vertical events', e);
        }
      } catch {
        const fallback = VERTICAL_FALLBACKS[slug] ?? null;
        setVertical(fallback);
      }

      // Load unfiltered videos independently
      if (slug === 'unfiltered') {
        try {
          const { data: videosData } = await api.unfiltered.getVideos(10);
          if (videosData) {
            setUnfilteredVideos(videosData);
            const withChannel = videosData.find((v) => v.channel_url);
            if (withChannel) setUnfilteredChannelUrl(withChannel.channel_url);
          }
        } catch (e) {
          console.warn('Failed to load unfiltered videos', e);
        }
      }

      setLoading(false);
    }
    if (slug) load();
  }, [slug]);

  // ─── Check campus cartel student status on focus ─────────
  const isCampusCartel = slug === 'campus-cartel';

  useFocusEffect(
    useCallback(() => {
      if (!isCampusCartel || !user?.id) return;

      // Check student status
      api.supabase
        .from('students')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          setStudentStatus(data?.status ?? 'none');

          if (data?.status === 'approved') {
            // Load tasks
            setTasksLoading(true);
            api.tasks.getMyTasks(user.id).then(({ data: tasksData }) => {
              setTasks(tasksData ?? []);
              setTasksLoading(false);
            });

            // Check ambassador status
            api.ambassadors.getMyAmbassadorProfile(user.id).then(({ data: amb }) => {
              setIsAmbassador(!!amb);
            });

            // Load wallet balance
            api.coins.getWalletBalance(user.id).then(({ data: wallet }) => {
              setWalletBalance(wallet?.current_balance ?? 0);
            });
          }
        });
    }, [user?.id, isCampusCartel]),
  );

  // ─── Task submission handlers ────────────────────────────
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
      setSubmissionImageUri(result.assets[0].uri);
    }
  }, []);

  const handleSubmitTask = useCallback(async (taskId: string) => {
    if (!submissionNote.trim()) {
      Alert.alert('Required', 'Please describe what you did for this task.');
      return;
    }
    if (!user?.id) return;

    setSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (submissionImageUri) {
        imageUrl = await uploadEventImage(submissionImageUri, user.id);
      }

      const { error } = await api.tasks.submitTask(taskId, {
        submission_note: submissionNote.trim(),
        submission_url: imageUrl ?? undefined,
      });
      if (error) throw new Error(error.message);

      Alert.alert('Submitted!', 'Your task submission has been sent for admin review.');
      setExpandedTaskId(null);
      setSubmissionNote('');
      setSubmissionImageUri(null);

      // Refresh tasks
      const { data: tasksData } = await api.tasks.getMyTasks(user.id);
      setTasks(tasksData ?? []);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to submit task.');
    } finally {
      setSubmitting(false);
    }
  }, [submissionNote, submissionImageUri, user?.id]);

  // ─── Ambassador code claim ───────────────────────────────
  const [ambassadorCodeInput, setAmbassadorCodeInput] = useState('');
  const [claimingCode, setClaimingCode] = useState(false);

  const handleClaimAmbassadorCode = useCallback(async () => {
    const code = ambassadorCodeInput.trim().toUpperCase();
    if (!code) {
      Alert.alert('Enter Code', 'Please enter the ambassador code provided by admin.');
      return;
    }
    if (!user?.id) return;

    setClaimingCode(true);
    try {
      await api.ambassadors.claimCode(code, user.id);
      setIsAmbassador(true);
      setAmbassadorCodeInput('');
      Alert.alert('Congratulations!', 'You are now a Campus Cartel Ambassador!');
    } catch (e) {
      Alert.alert('Invalid Code', e instanceof Error ? e.message : 'This code is invalid or already used.');
    } finally {
      setClaimingCode(false);
    }
  }, [ambassadorCodeInput, user?.id]);

  if (loading) {
    return <LoadingScreen />;
  }

  const verticalColor = vertical?.color ?? DarkBg;
  const isApprovedStudent = isCampusCartel && studentStatus === 'approved';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={[styles.hero, { backgroundColor: verticalColor }]}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>UBM</Text>
            <Text style={styles.heroName}>{vertical?.name ?? ''}</Text>
            {vertical?.tagline ? (
              <Text style={styles.heroTagline}>{vertical.tagline}</Text>
            ) : null}
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* ─── APPROVED STUDENT DASHBOARD ─────────────────── */}
          {isApprovedStudent ? (
            <>
              {/* Wallet & Stats */}
              <View style={styles.dashboardHeader}>
                <Text style={styles.dashboardTitle}>Student Dashboard</Text>
                <View style={styles.walletPill}>
                  <Ionicons name="diamond" size={14} color="#92400E" />
                  <Text style={styles.walletText}>{walletBalance} coins</Text>
                </View>
              </View>

              {/* Ambassador Section */}
              <View style={styles.ambassadorSection}>
                {isAmbassador ? (
                  <View style={styles.ambassadorBadge}>
                    <Ionicons name="shield-checkmark" size={18} color={verticalColors.campusCartel} />
                    <Text style={styles.ambassadorBadgeText}>Already an Ambassador</Text>
                  </View>
                ) : (
                  <View style={styles.ambassadorCodeSection}>
                    <TouchableOpacity
                      style={styles.beAmbassadorBtn}
                      onPress={() => setExpandedTaskId(expandedTaskId === '__ambassador__' ? null : '__ambassador__')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="shield-outline" size={18} color={verticalColors.campusCartel} />
                      <Text style={styles.beAmbassadorText}>Be an Ambassador</Text>
                      <Ionicons
                        name={expandedTaskId === '__ambassador__' ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={verticalColors.campusCartel}
                      />
                    </TouchableOpacity>

                    {expandedTaskId === '__ambassador__' && (
                      <View style={styles.ambassadorDropdown}>
                        <Text style={styles.ambassadorCodeLabel}>Enter your ambassador code</Text>
                        <View style={styles.ambassadorCodeRow}>
                          <View style={styles.ambassadorCodeInputWrapper}>
                            <Ionicons name="key-outline" size={16} color={colors.textSecondary} />
                            <TextInput
                              style={styles.ambassadorCodeInput}
                              placeholder="Enter code e.g. UBM-XXXX"
                              placeholderTextColor={colors.textLight}
                              value={ambassadorCodeInput}
                              onChangeText={(t) => setAmbassadorCodeInput(t.toUpperCase())}
                              autoCapitalize="characters"
                              autoCorrect={false}
                            />
                          </View>
                          <TouchableOpacity
                            style={[styles.ambassadorClaimBtn, claimingCode && { opacity: 0.6 }]}
                            onPress={handleClaimAmbassadorCode}
                            activeOpacity={0.8}
                            disabled={claimingCode}
                          >
                            {claimingCode ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <Text style={styles.ambassadorClaimText}>Claim</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Tasks */}
              <Text style={styles.eventsHeading}>Your Tasks</Text>
              {tasksLoading ? (
                <ActivityIndicator size="small" color={verticalColors.campusCartel} style={{ marginVertical: 20 }} />
              ) : tasks.length === 0 ? (
                <EmptyState
                  iconName="clipboard-outline"
                  title="No tasks yet"
                  subtitle="New tasks will appear here when assigned by admin"
                />
              ) : (
                tasks.map((task) => {
                  const isExpanded = expandedTaskId === task.id;
                  const canSubmit = task.status === 'assigned' || task.status === 'in_progress';

                  return (
                    <View key={task.id} style={styles.taskCard}>
                      <TouchableOpacity
                        style={styles.taskHeader}
                        onPress={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.taskHeaderLeft}>
                          <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                          <View style={styles.taskMeta}>
                            <StatusBadge status={task.status} />
                            <CoinBadge amount={task.coin_value} />
                          </View>
                        </View>
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={styles.taskExpanded}>
                          <Text style={styles.taskDescription}>{task.description}</Text>

                          {task.due_date && (
                            <Text style={styles.taskDue}>
                              Due: {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Text>
                          )}

                          {task.status === 'approved' && (
                            <View style={styles.taskApprovedNote}>
                              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                              <Text style={styles.taskApprovedText}>
                                Task approved! {task.coin_value} coins rewarded.
                              </Text>
                            </View>
                          )}

                          {task.status === 'submitted' && (
                            <View style={styles.taskSubmittedNote}>
                              <Ionicons name="time-outline" size={16} color={colors.primary} />
                              <Text style={styles.taskSubmittedText}>
                                Submission under review by admin.
                              </Text>
                            </View>
                          )}

                          {task.status === 'rejected' && task.review_note && (
                            <View style={styles.taskRejectedNote}>
                              <Ionicons name="alert-circle" size={16} color={colors.error} />
                              <Text style={styles.taskRejectedText}>
                                Rejected: {task.review_note}
                              </Text>
                            </View>
                          )}

                          {canSubmit && (
                            <View style={styles.submissionForm}>
                              <Text style={styles.submissionLabel}>Submit your work</Text>
                              <TextInput
                                style={styles.submissionInput}
                                placeholder="Describe what you did..."
                                placeholderTextColor={colors.textLight}
                                value={submissionNote}
                                onChangeText={setSubmissionNote}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                              />

                              <TouchableOpacity
                                style={styles.imagePickerBtn}
                                onPress={pickImage}
                                activeOpacity={0.8}
                              >
                                <Ionicons name="camera-outline" size={18} color={verticalColors.campusCartel} />
                                <Text style={styles.imagePickerText}>
                                  {submissionImageUri ? 'Change Screenshot' : 'Attach Screenshot / Image'}
                                </Text>
                              </TouchableOpacity>

                              {submissionImageUri && (
                                <View style={styles.imagePreviewContainer}>
                                  <Image
                                    source={{ uri: submissionImageUri }}
                                    style={styles.imagePreview}
                                    resizeMode="cover"
                                  />
                                  <TouchableOpacity
                                    style={styles.removeImageBtn}
                                    onPress={() => setSubmissionImageUri(null)}
                                  >
                                    <Ionicons name="close-circle" size={22} color={colors.error} />
                                  </TouchableOpacity>
                                </View>
                              )}

                              <TouchableOpacity
                                style={[styles.submitTaskBtn, submitting && { opacity: 0.6 }]}
                                onPress={() => handleSubmitTask(task.id)}
                                activeOpacity={0.8}
                                disabled={submitting}
                              >
                                {submitting ? (
                                  <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                  <>
                                    <Ionicons name="send" size={14} color="#fff" />
                                    <Text style={styles.submitTaskBtnText}>Submit Task</Text>
                                  </>
                                )}
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </>
          ) : (
            <>
              {/* Campus Cartel CTA — only show if NOT approved */}
              {isCampusCartel && (
                <Card
                  style={[
                    styles.campusCartelCard,
                    {
                      backgroundColor: verticalColors.campus_cartel + '15',
                      borderLeftColor: verticalColors.campus_cartel,
                    },
                  ]}
                >
                  <Text style={styles.campusCartelTitle}>Join Campus Cartel</Text>
                  <Text style={styles.campusCartelSubtitle}>
                    Become part of India's fastest-growing student ambassador network
                  </Text>
                  <Text style={styles.campusCartelStepsTitle}>How it works:</Text>
                  <View>
                    <Text style={styles.campusCartelStep}>① Register as a student</Text>
                    <Text style={[styles.campusCartelStep, styles.campusCartelStepSpaced]}>
                      ② Get your unique ambassador code
                    </Text>
                    <Text style={[styles.campusCartelStep, styles.campusCartelStepSpaced]}>
                      ③ Earn rewards for every campus activation
                    </Text>
                  </View>
                  <Button
                    title={studentStatus === 'pending' ? 'Application Pending...' : studentStatus === 'rejected' ? 'Re-apply' : 'Register now'}
                    variant="primary"
                    size="sm"
                    style={styles.campusCartelButton}
                    onPress={() => router.push('/campus-cartel-apply' as any)}
                  />
                </Card>
              )}
            </>
          )}

          {/* ─── UNFILTERED VIDEOS ─────────────────────────── */}
          {slug === 'unfiltered' && (
            <>
              <View style={styles.unfilteredHeader}>
                <Text style={styles.eventsHeading}>Conversations</Text>
                {unfilteredChannelUrl && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(unfilteredChannelUrl)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.seeAllText, { color: verticalColors.unfiltered }]}>See all →</Text>
                  </TouchableOpacity>
                )}
              </View>

              {unfilteredVideos.length === 0 ? (
                <View style={styles.unfilteredEmpty}>
                  <Ionicons name="videocam-outline" size={36} color={colors.textLight} />
                  <Text style={styles.unfilteredEmptyText}>Conversations coming soon</Text>
                </View>
              ) : (
                unfilteredVideos.map((video) => {
                  const thumb = video.thumbnail_url || '';
                  return (
                    <TouchableOpacity
                      key={video.id}
                      style={styles.unfilteredCard}
                      onPress={() => Linking.openURL(video.youtube_url)}
                      activeOpacity={0.8}
                    >
                      {!!thumb && (
                        <Image
                          source={{ uri: thumb }}
                          style={styles.unfilteredThumb}
                          resizeMode="cover"
                        />
                      )}
                      <View style={styles.unfilteredPlayOverlay}>
                        <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.9)" />
                      </View>
                      <View style={styles.unfilteredCardBody}>
                        <Text style={styles.unfilteredCardTitle} numberOfLines={2}>{video.title}</Text>
                        {!!video.description && (
                          <Text style={styles.unfilteredCardDesc} numberOfLines={2}>{video.description}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </>
          )}

          {/* Events — hidden for Unfiltered and Campus Cartel */}
          {slug !== 'unfiltered' && slug !== 'campus-cartel' && (
            <>
              <Text style={styles.eventsHeading}>Events</Text>
              {verticalEvents.length === 0 ? (
                <EmptyState
                  title="No events yet"
                  subtitle={`${vertical?.name ?? 'This vertical'} events coming soon`}
                />
              ) : (
                verticalEvents.map((ev) => (
                  <TouchableOpacity
                    key={ev.id}
                    style={styles.eventCard}
                    onPress={() => router.push(`/(people)/apply/${ev.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.eventColorBar, { backgroundColor: verticalColor }]} />
                    <View style={styles.eventBody}>
                      <Text style={styles.eventTitle} numberOfLines={2}>{ev.title}</Text>
                      <Text style={styles.eventMeta}>
                        {new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                      {!!ev.location && (
                        <Text style={styles.eventLocation} numberOfLines={1}>{ev.location}</Text>
                      )}
                      <View style={styles.eventFooter}>
                        <CoinBadge amount={ev.coin_reward} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },

  // Hero
  hero: {
    height: 260,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: 52,
    paddingLeft: 16,
    zIndex: 10,
  },
  heroContent: {
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  heroLabel: {
    fontSize: 11,
    letterSpacing: 4,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
  },
  heroName: {
    fontSize: 34,
    fontWeight: '800',
    color: 'white',
    marginTop: 8,
  },
  heroTagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    lineHeight: 22,
  },

  // Content area
  contentArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // Campus Cartel CTA
  campusCartelCard: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
  },
  campusCartelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  campusCartelSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  campusCartelStepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  campusCartelStep: {
    fontSize: 13,
    color: colors.text,
    marginTop: 8,
  },
  campusCartelStepSpaced: {
    marginTop: 4,
  },
  campusCartelButton: {
    marginTop: 16,
  },

  // Dashboard
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: Font.bold,
    color: colors.text,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  walletText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#92400E',
  },

  // Ambassador
  ambassadorSection: {
    marginBottom: 20,
  },
  ambassadorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: verticalColors.campusCartel + '15',
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: verticalColors.campusCartel + '30',
  },
  ambassadorBadgeText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: verticalColors.campusCartel,
  },
  ambassadorCodeSection: {
    gap: 0,
  },
  beAmbassadorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: verticalColors.campusCartel + '12',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: verticalColors.campusCartel + '30',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  beAmbassadorText: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: verticalColors.campusCartel,
  },
  ambassadorDropdown: {
    marginTop: 8,
    gap: 8,
  },
  ambassadorCodeLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.text,
  },
  ambassadorCodeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ambassadorCodeInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
  },
  ambassadorCodeInput: {
    flex: 1,
    fontSize: FontSize.body,
    color: colors.text,
    paddingVertical: 0,
  },
  ambassadorClaimBtn: {
    backgroundColor: verticalColors.campusCartel,
    borderRadius: radius.lg,
    paddingHorizontal: 20,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  ambassadorClaimText: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: '#fff',
  },

  // Tasks
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
    ...shadow.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  taskHeaderLeft: {
    flex: 1,
    gap: 8,
  },
  taskTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    lineHeight: 21,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskExpanded: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  taskDescription: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  taskDue: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    marginBottom: 8,
  },
  taskApprovedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.success + '15',
    borderRadius: radius.md,
    padding: 10,
    marginTop: 4,
  },
  taskApprovedText: {
    fontSize: FontSize.small,
    color: colors.success,
    fontWeight: Font.semibold,
  },
  taskSubmittedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary + '15',
    borderRadius: radius.md,
    padding: 10,
    marginTop: 4,
  },
  taskSubmittedText: {
    fontSize: FontSize.small,
    color: colors.primary,
    fontWeight: Font.semibold,
  },
  taskRejectedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.error + '15',
    borderRadius: radius.md,
    padding: 10,
    marginTop: 4,
  },
  taskRejectedText: {
    fontSize: FontSize.small,
    color: colors.error,
    fontWeight: Font.medium,
  },

  // Submission form
  submissionForm: {
    marginTop: 12,
    gap: 10,
  },
  submissionLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.text,
  },
  submissionInput: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: FontSize.body,
    color: colors.text,
    minHeight: 80,
  },
  imagePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: verticalColors.campusCartel + '12',
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: verticalColors.campusCartel + '30',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    fontSize: FontSize.small,
    color: verticalColors.campusCartel,
    fontWeight: Font.semibold,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  submitTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: verticalColors.campusCartel,
    borderRadius: radius.md,
    paddingVertical: 12,
    ...shadow.sm,
  },
  submitTaskBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: '#fff',
  },

  // Events heading
  eventsHeading: {
    fontSize: 18,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },

  // Event cards in vertical
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  eventColorBar: {
    width: 3,
  },
  eventBody: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: Font.bold,
    color: colors.text,
    lineHeight: 21,
  },
  eventMeta: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  eventLocation: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  eventFooter: {
    marginTop: Gap.xs,
  },

  // Unfiltered videos
  unfilteredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  seeAllText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
  },
  unfilteredEmpty: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  unfilteredEmptyText: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
  },
  unfilteredCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    ...shadow.sm,
  },
  unfilteredThumb: {
    width: '100%',
    height: 190,
  },
  unfilteredPlayOverlay: {
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  unfilteredCardBody: {
    padding: 12,
    gap: 4,
  },
  unfilteredCardTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    lineHeight: 21,
  },
  unfilteredCardDesc: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
