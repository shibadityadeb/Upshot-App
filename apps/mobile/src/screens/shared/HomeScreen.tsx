import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { UnfilteredVideo } from '@upshot/types';
import {
  colors,
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
import {
  FeaturedPodcastCard,
  CommunityBanner,
  WorkshopCard,
  HomeFooter,
} from '../../components/home';
import { useAuthStore } from '../../store/auth.store';

const api = createApiClient();

// ─── Design tokens (single source of truth for this screen) ─────────────────
const PAGE_H = Gap.base;       // 16 — horizontal padding for all sections
const SECTION_V = Gap.xl;      // 24 — top/bottom padding for every section
/** The numbers from the website. Static copy — edit here to change them. */
const TRACK_RECORD = [
  { value: '120+', label: 'Campaigns Delivered' },
  { value: '40+', label: 'Industry Leaders Featured' },
  { value: '6+', label: 'Active States' },
  { value: '200+', label: 'Community Activations' },
  { value: '30+', label: 'Brand Partnerships' },
];

const LOGO = require('../../../assets/logo.png');
const CAMPUS_CARTEL_IMG = require('../../../assets/campus-cartel.jpg');
const IRISE_IMG = require('../../../assets/irise.jpg');
const IBELIEVE_IMG = require('../../../assets/ibelieve.jpg');
const ALL_WORKSHOPS_IMG = require('../../../assets/all-workshops.jpg');

// UI-only fallback shown until the admin features a video through the
// existing unfiltered API — the API result always wins when present.
const PLACEHOLDER_PODCAST = {
  youtube_url: 'https://youtu.be/z_JlWC62ZXk?si=uYprPaQ0y5HES4HG',
  title: 'Unfiltered — real conversations with leaders',
  description: 'Founders, CXOs and policymakers, unscripted.',
  thumbnail_url: 'https://img.youtube.com/vi/z_JlWC62ZXk/hqdefault.jpg',
};

/** An episode counts as "new" for two weeks after the admin adds it. */
const NEW_EPISODE_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

function youtubeThumb(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning edition';
  if (hour < 17) return 'Afternoon edition';
  return 'Evening edition';
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  // Five stats share one row. Below ~360pt (iPhone SE class) the numbers and
  // labels step down one notch so the row never wraps or feels cramped.
  const { width: windowWidth } = useWindowDimensions();

  const [featuredVideo, setFeaturedVideo] = useState<UnfilteredVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCartelMember, setIsCartelMember] = useState(false);

  useEffect(() => {
    load();
  }, [user]);

  async function onRefresh() {
    setRefreshing(true);
    await load(false);
    setRefreshing(false);
  }

  async function load(showLoader = true) {
    if (showLoader) setLoading(true);
    try {
      // Featured unfiltered video for the podcast hero card
      try {
        const featuredResult = await api.unfiltered.getFeaturedVideo();
        if (featuredResult.data) {
          setFeaturedVideo(featuredResult.data);
        }
      } catch (e) {
        console.warn('Failed to load featured video', e);
      }

      // Campus Cartel membership — drives the community banner CTA label
      if (user) {
        try {
          const member = await api.campusCartel.isMember(user.id);
          setIsCartelMember(member);
        } catch {
          // silently fail
        }
      }
    } catch {
      /* silently use fallbacks */
    }
    setLoading(false);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  const timeOfDay = getTimeOfDay();
  const compactStats = windowWidth < 360;

  const podcastTitle = featuredVideo?.title ?? PLACEHOLDER_PODCAST.title;
  const podcastSubtitle = featuredVideo
    ? featuredVideo.description
    : PLACEHOLDER_PODCAST.description;
  const podcastThumb = featuredVideo
    ? featuredVideo.thumbnail_url ?? youtubeThumb(featuredVideo.youtube_url)
    : PLACEHOLDER_PODCAST.thumbnail_url;
  const podcastUrl = featuredVideo?.youtube_url ?? PLACEHOLDER_PODCAST.youtube_url;
  const isNewEpisode =
    !!featuredVideo &&
    Date.now() - new Date(featuredVideo.created_at).getTime() < NEW_EPISODE_WINDOW_MS;

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.ink}
        />
      }
    >
      <StatusBar barStyle="dark-content" />

      {/* ─── Hero ────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroLogoBadge}>
            <Image source={LOGO} style={styles.heroLogoImage} resizeMode="contain" />
          </View>
          <Text style={styles.timeText}>{timeOfDay}</Text>
        </View>

        <View style={styles.heroHeadlineBlock}>
          <Text style={styles.heroHeadlineLine}>
            Conversations,{'\n'}communities,{' '}
            <Text style={styles.heroHeadlineAccent}>experience.</Text>
          </Text>
        </View>

        <Text style={styles.heroSubtitle}>
          India's media and community network
        </Text>

        {/* Accent bar */}
        <View style={styles.heroGradientBar}>
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.9)', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.65)', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.45)', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.28)', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.15)', flex: 1 }]} />
        </View>

        {/* The track record closes the hero. Ink on lime — the numbers carry
            at size without a second colour, and lime on lime would vanish.
            All five sit in one row, equal-width, separated by hairlines so
            the eye reads them as a single strip rather than a grid. */}
        <View style={styles.heroStatsRow}>
          {TRACK_RECORD.map((stat, index) => (
            <React.Fragment key={stat.label}>
              {index > 0 && <View style={styles.heroStatDivider} />}
              <View style={styles.heroStatCell}>
                <Text
                  style={[styles.heroStatValue, compactStats && styles.heroStatValueCompact]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {stat.value}
                </Text>
                <Text
                  style={[styles.heroStatLabel, compactStats && styles.heroStatLabelCompact]}
                  numberOfLines={3}
                >
                  {stat.label}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* ─── Featured Podcast (Unfiltered) ───────────────────── */}
      <View style={styles.section}>
        <SectionHeader
          title="Featured Podcast"
          action
          actionLabel="See all"
          onAction={() => router.push('/(shared)/vertical/unfiltered' as any)}
        />
        <FeaturedPodcastCard
          title={podcastTitle}
          subtitle={podcastSubtitle}
          thumbnailUrl={podcastThumb}
          isNew={isNewEpisode}
          onPress={() => Linking.openURL(podcastUrl)}
        />

        {/* The pitch form already existed behind the Unfiltered page and the
            applications screen; this is the way in from the home screen, next
            to the episode it is about. Kept quieter than the lime buttons
            further down so it reads as an invitation, not a third shout. */}
        <TouchableOpacity
          style={styles.featureCta}
          onPress={() => router.push('/unfiltered-feature' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.featureCtaIcon}>
            <Ionicons name="mic-outline" size={16} color={colors.ink} />
          </View>
          <View style={styles.featureCtaText}>
            <Text style={styles.featureCtaTitle}>Apply to get featured</Text>
            <Text style={styles.featureCtaSub}>Pitch yourself as a guest on the show</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* ─── Join Our Community (Campus Cartel) ──────────────── */}
      <View style={styles.section}>
        <SectionHeader title="Join Our Community" />
        <CommunityBanner
          image={CAMPUS_CARTEL_IMG}
          title="Campus Cartel"
          subtitle="India's largest student ambassador community."
          ctaLabel={isCartelMember ? 'Go to Campus Cartel' : 'Join Community'}
          onPress={() =>
            router.push(
              user?.role === 'ambassador'
                ? ('/(ambassador)/dashboard' as any)
                : ('/(people)/campus-cartel' as any),
            )
          }
        />
      </View>

      <View style={styles.divider} />

      {/* ─── Upcoming Events (Events + Growth Solutions) ────── */}
      <View style={styles.section}>
        <SectionHeader title="Upcoming Events" />
        <View style={styles.workshopList}>
          <WorkshopCard
            image={IRISE_IMG}
            title="Events"
            subtitle="Conferences, summits and meetups across India."
            onPress={() => router.push('/(people)/opportunities?vertical=irise' as any)}
          />
          <WorkshopCard
            image={IBELIEVE_IMG}
            title="Growth Solutions"
            subtitle="Programmes that help businesses and founders grow."
            onPress={() => router.push('/(people)/opportunities?vertical=ibelieve' as any)}
          />
          {/* Opens the same Workshops screen with the All filter — vertical=all is
              passed explicitly so it resets a filter left over from the cards above. */}
          <WorkshopCard
            image={ALL_WORKSHOPS_IMG}
            title="All Workshops"
            subtitle="Browse every workshop happening across India."
            onPress={() => router.push('/(people)/opportunities?vertical=all' as any)}
          />
        </View>
      </View>

      {/* ─── Host an Event Banner ──────────────────────────────── */}
      <View style={styles.bannerWrapper}>
        <View style={styles.hostBanner}>
          <View style={styles.hostBannerIcon}>
            <Ionicons name="megaphone-outline" size={22} color={colors.ink} />
          </View>
          <Text style={styles.hostBannerEyebrow}>HOST AN EVENT</Text>
          <Text style={styles.hostBannerHeadline}>
            Got an idea? Bring your event to life
          </Text>
          <Text style={styles.hostBannerBody}>
            Share your requirements & reach the right audience for your brand.
          </Text>
          <TouchableOpacity
            style={styles.hostBannerBtn}
            onPress={() => router.push('/(people)/host-event' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.hostBannerBtnText}>Get started</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ─── Footer ───────────────────────────────────────────── */}
      <HomeFooter paddingHorizontal={PAGE_H} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.border,
    marginHorizontal: PAGE_H,
  },
  // ── "Apply to get featured" row under the podcast card ────
  featureCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    marginTop: Gap.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: Gap.md,
    paddingHorizontal: Gap.base,
    ...shadow.sm,
  },
  featureCtaIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCtaText: { flex: 1 },
  featureCtaTitle: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.ink,
  },
  featureCtaSub: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  // ── Hero ──────────────────────────────────────────────────
  hero: {
    paddingBottom: Gap.xl + Gap.xs,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTopRow: {
    paddingTop: 56,
    paddingHorizontal: PAGE_H,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // A capsule rather than a box, matching the auth headers: the wordmark is
  // roughly 2.6:1, so fully rounded ends hug it where a circle would leave dead
  // space above and below. White ground keeps it off the lime hero.
  heroLogoBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    ...shadow.md,
  },
  heroLogoImage: {
    width: 96,
    height: 26,
  },
  timeText: {
    fontSize: FontSize.small,
    color: 'rgba(14,14,14,0.55)',
    fontWeight: Font.medium,
  },
  heroHeadlineBlock: {
    paddingHorizontal: PAGE_H,
    marginTop: Gap.xl,
  },
  heroHeadlineLine: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    letterSpacing: -0.5,
    lineHeight: 30,
    color: colors.ink,
  },
  heroHeadlineAccent: {
    color: colors.ink,
    fontStyle: 'italic',
  },
  heroSubtitle: {
    paddingHorizontal: PAGE_H,
    marginTop: Gap.sm,
    fontSize: FontSize.small,
    color: 'rgba(14,14,14,0.6)',
    fontWeight: Font.medium,
    lineHeight: 18,
  },
  heroGradientBar: {
    flexDirection: 'row',
    height: 3,
    marginHorizontal: PAGE_H,
    marginTop: Gap.xl,
    borderRadius: 2,
    overflow: 'hidden',
  },
  heroGradientSegment: {
    height: 3,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: PAGE_H,
    marginTop: Gap.xl,
  },
  heroStatCell: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  heroStatDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: 2,
    backgroundColor: 'rgba(14,14,14,0.18)',
  },
  heroStatValue: {
    fontSize: FontSize.h2,
    lineHeight: 24,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  heroStatValueCompact: {
    fontSize: FontSize.h3,
    lineHeight: 20,
  },
  heroStatLabel: {
    fontSize: FontSize.micro,
    lineHeight: 13,
    fontWeight: Font.medium,
    color: 'rgba(14,14,14,0.62)',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.1,
  },
  heroStatLabelCompact: {
    fontSize: 9,
    lineHeight: 12,
  },
  // ── Upcoming Events ───────────────────────────────────────
  workshopList: {
    gap: Gap.md,
  },

  // ── Host an Event Banner (white card, lime CTA) ───────────
  hostBanner: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: Gap.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  hostBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.md,
  },
  hostBannerEyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: Gap.sm,
  },
  hostBannerHeadline: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: Gap.xs,
  },
  hostBannerBody: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: Gap.base,
  },
  hostBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    height: 42,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: Gap.lg,
    alignSelf: 'flex-start',
  },
  hostBannerBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.onPrimary,
  },

  // ── Banner wrapper (Host an Event) ────────────────────────
  bannerWrapper: {
    paddingHorizontal: PAGE_H,
    paddingVertical: SECTION_V,
  },

});
