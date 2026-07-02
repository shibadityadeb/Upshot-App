import React, { useState, useEffect } from 'react';
import {
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

const LOGO = require('../../../assets/logo.png') as number;
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { Vertical, Event, UnfilteredVideo } from '@upshot/types';
import {
  colors,
  verticalColors,
  DarkBg,
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
const DIVIDER = '#E4E4E7';     // shared divider color

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

const HERO_TAGS = ['#Unfiltered', '#CampusCartel', '#iRISE', '#iBelieve'];

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [featuredVideo, setFeaturedVideo] = useState<UnfilteredVideo | null>(null);
  const [loading, setLoading] = useState(true);

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
      }
    } catch {
      /* silently use fallbacks */
    }
    setLoading(false);
  }

  const upcomingEvents = allEvents.filter((e) => !appliedIds.has(e.id));
  const joinedEvents = allEvents.filter((e) => appliedIds.has(e.id));

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
          <View style={styles.heroLogoBadge}>
            <Image source={LOGO} style={styles.heroLogo} resizeMode="contain" />
          </View>
          <View style={styles.timePill}>
            <Text style={styles.timePillText}>{timeOfDay}</Text>
          </View>
        </View>

        <View style={styles.heroHeadlineBlock}>
          <Text style={styles.heroHeadlineLine}>Conversations.</Text>
          <Text style={styles.heroHeadlineLine}>Communities.</Text>
          <Text style={[styles.heroHeadlineLine, styles.heroHeadlineAccent]}>
            Experiences.
          </Text>
        </View>

        <Text style={styles.heroSubtitle}>
          India's leading Media & Community Network
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.heroTagsScroll}
          contentContainerStyle={styles.heroTagsContent}
        >
          {HERO_TAGS.map((tag) => (
            <View key={tag} style={styles.heroTag}>
              <Text style={styles.heroTagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
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
              onPress={() => router.push(`/(shared)/vertical/${vertical.slug}` as any)}
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
            <Ionicons name="arrow-forward" size={13} color="#818CF8" />
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
            onPress={() => router.push('/campus-cartel-apply' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.campusCartelBtnText}>Join the network</Text>
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
    backgroundColor: DIVIDER,
    marginHorizontal: PAGE_H,
  },
  // ── Hero ──────────────────────────────────────────────────
  hero: {
    paddingBottom: SECTION_V,
    backgroundColor: DarkBg,
  },
  heroTopRow: {
    paddingTop: 52,
    paddingHorizontal: PAGE_H,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLogoBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroLogo: {
    width: 90,
    height: 22,
  },
  timePill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timePillText: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.6)',
  },
  heroHeadlineBlock: {
    paddingHorizontal: PAGE_H,
    marginTop: Gap.lg,
  },
  heroHeadlineLine: {
    fontSize: 34,
    fontWeight: Font.black,
    letterSpacing: -0.5,
    lineHeight: 40,
    color: '#FFFFFF',
  },
  heroHeadlineAccent: {
    color: '#7BC55A',
  },
  heroSubtitle: {
    paddingHorizontal: PAGE_H,
    marginTop: Gap.sm,
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: Font.regular,
    lineHeight: 20,
  },
  heroTagsScroll: {
    marginTop: Gap.base,
  },
  heroTagsContent: {
    paddingHorizontal: PAGE_H,
    flexDirection: 'row',
  },
  heroTag: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: Gap.sm,
  },
  heroTagText: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.6)',
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
    ...shadow.sm,
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
    backgroundColor: '#0F1629',
    borderRadius: CARD_RADIUS,
    padding: Gap.lg,
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.15)',
  },
  hostBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(129,140,248,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.md,
  },
  hostBannerEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(129,140,248,0.8)',
    letterSpacing: 2.5,
    marginBottom: Gap.sm,
  },
  hostBannerHeadline: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: Gap.xs,
  },
  hostBannerBody: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
    marginBottom: Gap.base,
  },
  hostBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    height: 36,
    backgroundColor: 'rgba(129,140,248,0.12)',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.35)',
    paddingHorizontal: Gap.base,
    alignSelf: 'flex-start',
  },
  hostBannerBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: '#818CF8',
  },

  // ── Campus Cartel Banner ──────────────────────────────────
  bannerWrapper: {
    paddingHorizontal: PAGE_H,
    paddingVertical: SECTION_V,
  },
  campusCartelBanner: {
    backgroundColor: '#0C1F15',
    borderRadius: CARD_RADIUS,
    padding: Gap.lg,
  },
  campusCartelEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: 'rgba(123,197,90,0.8)',
    letterSpacing: 2.5,
    marginBottom: Gap.sm,
  },
  campusCartelHeadline: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: Gap.xs,
  },
  campusCartelStats: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: Gap.base,
  },
  campusCartelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    height: 36,
    backgroundColor: 'rgba(123,197,90,0.12)',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(123,197,90,0.35)',
    paddingHorizontal: Gap.base,
    alignSelf: 'flex-start',
  },
  campusCartelBtnText: {
    fontSize: FontSize.small,
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
    ...shadow.sm,
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
});
