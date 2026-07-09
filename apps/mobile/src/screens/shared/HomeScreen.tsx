import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { Vertical, Event, UnfilteredVideo, Task } from '@upshot/types';
import {
  colors,
  verticalColors,
  Font,
  FontSize,
  Gap,
  radius,
  shadow,
} from '../../constants/theme';
import {
  SectionHeader,
  LoadingScreen,
} from '../../components/common';
import { useAuthStore } from '../../store/auth.store';

const api = createApiClient();

// ─── Design tokens (single source of truth for this screen) ─────────────────
const PAGE_H = Gap.base;       // 16 — horizontal padding for all sections
const SECTION_V = Gap.xl;      // 24 — top/bottom padding for every section
const CARD_RADIUS = 14;        // border radius applied to every card
const CARD_PAD = Gap.base;     // 16 — internal padding for every card

const FALLBACK_VERTICALS: Vertical[] = [
  {
    id: '1',
    name: 'Unfiltered',
    slug: 'unfiltered',
    tagline: 'Real conversations with leaders',
    color: verticalColors.unfiltered,
    is_active: true,
    sort_order: 1,
    created_at: '',
  },
  {
    id: '2',
    name: 'Campus Cartel',
    slug: 'campus-cartel',
    tagline: "India's student network",
    color: verticalColors.campusCartel,
    is_active: true,
    sort_order: 2,
    created_at: '',
  },
  {
    id: '3',
    name: 'iRISE',
    slug: 'irise',
    tagline: "Women's leadership platform",
    color: verticalColors.irise,
    is_active: true,
    sort_order: 3,
    created_at: '',
  },
  {
    id: '4',
    name: 'iBelieve',
    slug: 'ibelieve',
    tagline: 'Entrepreneurship network',
    color: verticalColors.ibelieve,
    is_active: true,
    sort_order: 4,
    created_at: '',
  },
];

const HERO_TAGS = ['Unfiltered', 'Campus cartel', 'iRISE', 'iBelieve'];

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning edition';
  if (hour < 17) return 'Afternoon edition';
  return 'Evening edition';
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [featuredVideo, setFeaturedVideo] = useState<UnfilteredVideo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartelMember, setIsCartelMember] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [verts, events] = await Promise.allSettled([
        api.verticals.getAllVerticals(),
        api.events.getApprovedEvents(1, 10),
      ]);

      if (verts.status === 'fulfilled' && verts.value.length > 0) {
        setVerticals(verts.value);
      } else {
        setVerticals(FALLBACK_VERTICALS);
      }

      // Load featured unfiltered video independently
      try {
        const featuredResult = await api.unfiltered.getFeaturedVideo();
        if (featuredResult.data) {
          setFeaturedVideo(featuredResult.data);
        }
      } catch (e) {
        console.warn('Failed to load featured video', e);
      }

      if (events.status === 'fulfilled' && events.value.data) {
        const eventList = events.value.data.data ?? events.value.data;
        setAllEvents(Array.isArray(eventList) ? eventList : []);
      }

      if (user) {
        const appsResult = await api.events.getMyApplications(user.id);
        if (appsResult.data) {
          setAppliedIds(new Set(appsResult.data.map((a) => a.event_id)));
        }

        // Check Campus Cartel membership first — tasks are CC-only
        try {
          const member = await api.campusCartel.isMember(user.id);
          setIsCartelMember(member);

          // Only load tasks for CC members
          if (member && (user.role === 'student' || user.role === 'people')) {
            try {
              const { data: tasksData } = await api.supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });
              setTasks((tasksData ?? []) as Task[]);
            } catch {
              // silently fail
            }
          }
        } catch {
          // silently fail
        }
      }
    } catch {
      /* silently use fallbacks */
    }
    setLoading(false);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const futureEvents = allEvents.filter((e) => e.event_date >= todayStr);
  const upcomingEvents = futureEvents.filter((e) => !appliedIds.has(e.id));
  const joinedEvents = futureEvents.filter((e) => appliedIds.has(e.id));

  if (loading) {
    return <LoadingScreen />;
  }

  const timeOfDay = getTimeOfDay();

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar barStyle="light-content" />

      {/* ─── Hero ────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroLogoText}>
            <Text style={styles.heroLogoGreen}>up</Text>
            <Text style={styles.heroLogoWhite}>shot</Text>
          </Text>
          <Text style={styles.timeText}>{timeOfDay}</Text>
        </View>

        <View style={styles.heroHeadlineBlock}>
          <Text style={styles.heroHeadlineLine}>
            Conversations,{'\n'}communities,{' '}
            <Text style={styles.heroHeadlineAccent}>experience.</Text>
          </Text>
        </View>

        <Text style={styles.heroSubtitle}>
          India's media and community network, told in four parts.
        </Text>

        {/* Gradient bar */}
        <View style={styles.heroGradientBar}>
          <View style={[styles.heroGradientSegment, { backgroundColor: '#4A90D9', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: '#5BB8A0', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: '#7BC55A', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: '#C4D94A', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: '#E8D44D', flex: 1 }]} />
        </View>

        <View style={styles.heroTagsRow}>
          {HERO_TAGS.map((tag, i) => (
            <React.Fragment key={tag}>
              {i > 0 && <Text style={styles.heroTagDot}>·</Text>}
              <Text style={styles.heroTagText}>{tag}</Text>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* ─── Our Verticals ───────────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader
          title="Our Verticals"
        />
        <View style={styles.verticalsGrid}>
          {verticals.map((vertical) => (
            <TouchableOpacity
              key={vertical.id}
              style={[styles.verticalCard, { backgroundColor: vertical.color }]}
              onPress={() => {
                if (vertical.slug === 'campus-cartel' && user?.role === 'ambassador') {
                  router.push('/(ambassador)/dashboard' as any);
                } else {
                  router.push(`/(shared)/vertical/${vertical.slug}` as any);
                }
              }}
              activeOpacity={0.82}
            >
              <View style={styles.verticalCardCircle} />
              <Text style={styles.verticalCardName}>{vertical.name}</Text>
              <Text style={styles.verticalCardTagline}>
                {vertical.tagline ?? ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ─── Unfiltered Featured Video ────────────────────────── */}
      {featuredVideo && (
        <>
          <View style={styles.divider} />
          <View style={styles.section}>
            <SectionHeader
              title="Unfiltered"
              action
              actionLabel="Show others"
              onAction={() => router.push('/(shared)/vertical/unfiltered' as any)}
            />
            <TouchableOpacity
              style={styles.featuredVideoCard}
              onPress={() => Linking.openURL(featuredVideo.youtube_url)}
              activeOpacity={0.8}
            >
              {!!featuredVideo.thumbnail_url && (
                <View>
                  <Image
                    source={{ uri: featuredVideo.thumbnail_url }}
                    style={styles.featuredVideoThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.featuredVideoPlayOverlay}>
                    <Ionicons name="play-circle" size={44} color="rgba(255,255,255,0.9)" />
                  </View>
                </View>
              )}
              <View style={styles.featuredVideoBody}>
                <View style={styles.featuredVideoPill}>
                  <Text style={styles.featuredVideoPillText}>UNFILTERED</Text>
                </View>
                <Text style={styles.featuredVideoTitle} numberOfLines={2}>{featuredVideo.title}</Text>
                {!!featuredVideo.description && (
                  <Text style={styles.featuredVideoDesc} numberOfLines={2}>{featuredVideo.description}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* ─── Joined Workshops ───────────────────────────────── */}
      {joinedEvents.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.section}>
            <SectionHeader title="Joined Workshops" />
            {joinedEvents.slice(0, 3).map((event) => {
              const eventDate = new Date(event.event_date);
              const day = eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
              const time = eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
              const venue = (event as any).venue;
              const city = (event as any).city;
              const loc = venue ? `${venue}${city ? ', ' + city : ''}` : (event.location ?? '');

              return (
                <TouchableOpacity
                  key={event.id}
                  style={styles.joinedCard}
                  onPress={() => router.push(`/(people)/apply/${event.id}` as any)}
                  activeOpacity={0.75}
                >
                  <View style={styles.joinedIconWrap}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  </View>
                  <View style={styles.joinedInfo}>
                    <Text style={styles.joinedTitle} numberOfLines={1}>{event.title}</Text>
                    <Text style={styles.joinedMeta}>{day} · {time}{loc ? ` · ${loc}` : ''}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* ─── Tasks for Campus Cartel Members ─────────────────── */}
      {isCartelMember && tasks.filter((t) => t.status === 'assigned').length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.section}>
            <SectionHeader title="Your Tasks" />
            {tasks
              .filter((t) => t.status === 'assigned')
              .slice(0, 3)
              .map((task) => (
                <View key={task.id} style={styles.taskCard}>
                  <View style={styles.taskCardHeader}>
                    <Text style={styles.taskCardTitle} numberOfLines={2}>{task.title}</Text>
                    <View style={styles.taskCoinPill}>
                      <Ionicons name="diamond-outline" size={11} color="#92400E" />
                      <Text style={styles.taskCoinText}>{task.coin_value}</Text>
                    </View>
                  </View>
                  <Text style={styles.taskCardDesc} numberOfLines={2}>{task.description}</Text>
                  {task.due_date && (
                    <View style={styles.taskMetaRow}>
                      <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
                      <Text style={styles.taskMetaText}>Due {task.due_date}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.taskSubmitBtn}
                    activeOpacity={0.8}
                    disabled={submittingTaskId === task.id}
                    onPress={() => {
                      Alert.prompt('Submit Task', 'Add a note or link:', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Submit',
                          onPress: async (text) => {
                            setSubmittingTaskId(task.id);
                            try {
                              await api.tasks.submitTask(task.id, { submission_note: text ?? '' });
                              load();
                            } finally {
                              setSubmittingTaskId(null);
                            }
                          },
                        },
                      ], 'plain-text');
                    }}
                  >
                    <Text style={styles.taskSubmitBtnText}>
                      {submittingTaskId === task.id ? 'Submitting...' : 'Submit'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </>
      )}

      <View style={styles.divider} />

      {/* ─── Upcoming Events (1 latest, not joined) ──────────── */}
      {upcomingEvents.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title="Upcoming Events"
            action
            actionLabel="See all"
            onAction={() => router.push('/(people)/opportunities' as any)}
          />
          {(() => {
            const event = upcomingEvents[0];
            const eventDate = new Date(event.event_date);
            const day = eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            const time = eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            const venue = (event as any).venue;
            const city = (event as any).city;
            const loc = venue ? `${venue}${city ? ', ' + city : ''}` : (event.location ?? '');

            return (
              <TouchableOpacity
                style={styles.upcomingCard}
                onPress={() => router.push(`/(people)/apply/${event.id}` as any)}
                activeOpacity={0.75}
              >
                {!!event.banner_url && (
                  <Image source={{ uri: event.banner_url }} style={styles.upcomingBanner} resizeMode="cover" />
                )}
                <View style={styles.upcomingBody}>
                  {!!(event as any).category && (
                    <View style={styles.upcomingCategoryPill}>
                      <Text style={styles.upcomingCategoryText}>{(event as any).category}</Text>
                    </View>
                  )}
                  <Text style={styles.upcomingTitle} numberOfLines={1}>{event.title}</Text>
                  <View style={styles.upcomingMeta}>
                    <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.upcomingMetaText}>{day} · {time}</Text>
                  </View>
                  {!!loc && (
                    <View style={styles.upcomingMeta}>
                      <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
                      <Text style={styles.upcomingMetaText} numberOfLines={1}>{loc}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })()}
        </View>
      )}

      {/* ─── Host an Event Banner ──────────────────────────────── */}
      <View style={[styles.bannerWrapper, { paddingBottom: 0 }]}>
        <View style={styles.hostBanner}>
          <View style={styles.hostBannerIcon}>
            <Ionicons name="megaphone-outline" size={22} color="#818CF8" />
          </View>
          <Text style={styles.hostBannerEyebrow}>HOST AN EVENT</Text>
          <Text style={styles.hostBannerHeadline}>
            Got an idea? Bring your event to life
          </Text>
          <Text style={styles.hostBannerBody}>
            Submit your event proposal and reach thousands of people across India.
          </Text>
          <TouchableOpacity
            style={styles.hostBannerBtn}
            onPress={() => router.push('/(people)/host-event' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.hostBannerBtnText}>Get started</Text>
            <Ionicons name="arrow-forward" size={13} color="#A5B4FC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Campus Cartel Banner ────────────────────────────── */}
      <View style={styles.bannerWrapper}>
        <View style={styles.campusCartelBanner}>
          <Text style={styles.campusCartelEyebrow}>CAMPUS CARTEL</Text>
          <Text style={styles.campusCartelHeadline}>
            Join India's fastest growing student network
          </Text>
          <Text style={styles.campusCartelStats}>
            150+ colleges · 2,000+ students
          </Text>
          <TouchableOpacity
            style={styles.campusCartelBtn}
            onPress={() => router.push(user?.role === 'ambassador' ? '/(ambassador)/dashboard' as any : '/(people)/campus-cartel' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.campusCartelBtnText}>
              {isCartelMember ? 'Go to Campus Cartel' : 'Join the network'}
            </Text>
            <Ionicons name="arrow-forward" size={13} color="#7BC55A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── iRISE + iBelieve ────────────────────────────────── */}
      <View style={styles.dualRow}>
        {([
          {
            slug: 'irise',
            name: 'iRISE',
            tagline: FALLBACK_VERTICALS[2].tagline ?? '',
            bg: verticalColors.irise,
            borderColor: 'rgba(180,83,9,0.35)',
            nameColor: '#F59E0B',
            exploreColor: 'rgba(245,158,11,0.8)',
          },
          {
            slug: 'ibelieve',
            name: 'iBelieve',
            tagline: FALLBACK_VERTICALS[3].tagline ?? '',
            bg: verticalColors.ibelieve,
            borderColor: 'rgba(185,28,28,0.35)',
            nameColor: '#F87171',
            exploreColor: 'rgba(248,113,113,0.8)',
          },
        ] as const).map((item) => (
          <TouchableOpacity
            key={item.slug}
            style={[styles.dualCard, { backgroundColor: item.bg, borderColor: item.borderColor }]}
            onPress={() => router.push(`/(shared)/vertical/${item.slug}` as any)}
            activeOpacity={0.85}
          >
            <View>
              <Text style={[styles.dualCardName, { color: item.nameColor }]}>{item.name}</Text>
              <Text style={styles.dualCardTagline}>{item.tagline}</Text>
            </View>
            <Text style={[styles.dualCardExplore, { color: item.exploreColor }]}>Explore →</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0F0F5',
  },
  contentContainer: {
    paddingBottom: 24,
  },

  // ── Shared layout primitives ───────────────────────────────
  /** Every content section uses this — consistent H-pad + V-pad */
  section: {
    paddingHorizontal: PAGE_H,
    paddingVertical: SECTION_V,
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E4E7',
    marginHorizontal: PAGE_H,
  },
  // ── Hero ──────────────────────────────────────────────────
  hero: {
    paddingBottom: SECTION_V,
    backgroundColor: '#1A1D23',
  },
  heroTopRow: {
    paddingTop: 52,
    paddingHorizontal: PAGE_H,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLogoText: {
    fontSize: 20,
    fontWeight: Font.bold,
  },
  heroLogoGreen: {
    color: '#7BC55A',
    fontWeight: Font.bold,
  },
  heroLogoWhite: {
    color: '#FFFFFF',
    fontWeight: Font.bold,
  },
  timeText: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: Font.regular,
  },
  heroHeadlineBlock: {
    paddingHorizontal: PAGE_H,
    marginTop: Gap.xl,
  },
  heroHeadlineLine: {
    fontSize: 32,
    fontWeight: Font.black,
    letterSpacing: -0.5,
    lineHeight: 40,
    color: '#FFFFFF',
  },
  heroHeadlineAccent: {
    color: '#7BC55A',
    fontStyle: 'italic',
  },
  heroSubtitle: {
    paddingHorizontal: PAGE_H,
    marginTop: Gap.md,
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: Font.regular,
    lineHeight: 22,
  },
  heroGradientBar: {
    flexDirection: 'row',
    height: 3,
    marginHorizontal: PAGE_H,
    marginTop: Gap.lg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  heroGradientSegment: {
    height: 3,
  },
  heroTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PAGE_H,
    marginTop: Gap.md,
  },
  heroTagDot: {
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
  heroTagText: {
    fontSize: FontSize.small,
    color: '#7BC55A',
    fontWeight: Font.medium,
  },

  // ── Verticals grid ────────────────────────────────────────
  verticalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.sm,
  },
  verticalCard: {
    width: '48.5%',
    minHeight: 96,
    borderRadius: CARD_RADIUS,
    padding: CARD_PAD,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  verticalCardCircle: {
    position: 'absolute',
    bottom: -16,
    right: -16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  verticalCardName: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  verticalCardTagline: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 3,
    lineHeight: 15,
  },

  // ── Upcoming Events ───────────────────────────────────────
  upcomingCard: {
    backgroundColor: colors.surface,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: Gap.sm,
  },
  upcomingBanner: {
    width: '100%',
    height: 140,
  },
  upcomingBody: {
    padding: CARD_PAD,
    gap: 4,
  },
  upcomingCategoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '14',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
  },
  upcomingCategoryText: {
    fontSize: 11,
    fontWeight: Font.semibold,
    color: colors.primary,
  },
  upcomingTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
  },
  upcomingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  upcomingMetaText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    flex: 1,
  },

  // ── Joined Workshops ──────────────────────────────────────
  joinedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.border,
    padding: CARD_PAD,
    marginBottom: Gap.sm,
    gap: Gap.md,
  },
  joinedIconWrap: {
    flexShrink: 0,
  },
  joinedInfo: {
    flex: 1,
  },
  joinedTitle: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.text,
  },
  joinedMeta: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ── Host an Event Banner ──────────────────────────────────
  hostBanner: {
    backgroundColor: '#141829',
    borderRadius: CARD_RADIUS,
    padding: Gap.lg,
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.12)',
  },
  hostBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(129,140,248,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.md,
  },
  hostBannerEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(129,140,248,0.7)',
    letterSpacing: 2.5,
    marginBottom: Gap.sm,
  },
  hostBannerHeadline: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: '#FFFFFF',
    lineHeight: 28,
    letterSpacing: -0.3,
    marginBottom: Gap.xs,
  },
  hostBannerBody: {
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 22,
    marginBottom: Gap.base,
  },
  hostBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    height: 38,
    backgroundColor: 'rgba(129,140,248,0.10)',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.25)',
    paddingHorizontal: Gap.base,
    alignSelf: 'flex-start',
  },
  hostBannerBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: '#A5B4FC',
  },

  // ── Campus Cartel Banner ──────────────────────────────────
  bannerWrapper: {
    paddingHorizontal: PAGE_H,
    paddingVertical: SECTION_V,
  },
  campusCartelBanner: {
    backgroundColor: '#111F16',
    borderRadius: CARD_RADIUS,
    padding: Gap.lg,
    borderWidth: 1,
    borderColor: 'rgba(123,197,90,0.12)',
  },
  campusCartelEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(123,197,90,0.7)',
    letterSpacing: 2.5,
    marginBottom: Gap.sm,
  },
  campusCartelHeadline: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: '#FFFFFF',
    lineHeight: 28,
    letterSpacing: -0.3,
    marginBottom: Gap.xs,
  },
  campusCartelStats: {
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: Gap.base,
  },
  campusCartelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    height: 38,
    backgroundColor: 'rgba(123,197,90,0.10)',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(123,197,90,0.25)',
    paddingHorizontal: Gap.base,
    alignSelf: 'flex-start',
  },
  campusCartelBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: '#7BC55A',
  },

  // ── iRISE + iBelieve ──────────────────────────────────────
  dualRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    paddingHorizontal: PAGE_H,
    paddingTop: Gap.base,
  },
  dualCard: {
    flex: 1,
    height: 120,
    borderRadius: CARD_RADIUS,
    padding: CARD_PAD,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  dualCardName: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    lineHeight: 24,
  },
  dualCardTagline: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
    lineHeight: 15,
  },
  dualCardExplore: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
  },

  // ── Featured Unfiltered Video ─────────────────────────────
  featuredVideoCard: {
    backgroundColor: colors.surface,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  featuredVideoThumb: {
    width: '100%',
    height: 190,
  },
  featuredVideoPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredVideoBody: {
    padding: CARD_PAD,
    gap: 4,
  },
  featuredVideoPill: {
    alignSelf: 'flex-start',
    backgroundColor: verticalColors.unfiltered + '18',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
  },
  featuredVideoPillText: {
    fontSize: 10,
    fontWeight: Font.bold,
    color: verticalColors.unfiltered,
    letterSpacing: 1,
  },
  featuredVideoTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    lineHeight: 21,
  },
  featuredVideoDesc: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // ── Tasks ─────────────────────────────────────────────────
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: CARD_RADIUS,
    padding: CARD_PAD,
    marginBottom: Gap.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
  },
  taskCardTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    flex: 1,
  },
  taskCoinPill: {
    backgroundColor: '#FEF3C7',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskCoinText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: '#92400E',
  },
  taskCardDesc: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  taskMetaText: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  taskSubmitBtn: {
    marginTop: Gap.md,
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Gap.xl,
  },
  taskSubmitBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },
});
