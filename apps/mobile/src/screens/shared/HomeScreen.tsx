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
} from '../../components/home';
import { useAuthStore } from '../../store/auth.store';

const api = createApiClient();

// ─── Design tokens (single source of truth for this screen) ─────────────────
const PAGE_H = Gap.base;       // 16 — horizontal padding for all sections
const SECTION_V = Gap.xl;      // 24 — top/bottom padding for every section
const HERO_TAGS = ['Unfiltered', 'Campus cartel', 'iRISE', 'iBelieve'];

const LOGO = require('../../../assets/logo.png');
const CAMPUS_CARTEL_IMG = require('../../../assets/campus cartel.png');
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
          India's media and community network, told in four parts.
        </Text>

        {/* Accent bar */}
        <View style={styles.heroGradientBar}>
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.9)', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.65)', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.45)', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.28)', flex: 1 }]} />
          <View style={[styles.heroGradientSegment, { backgroundColor: 'rgba(14,14,14,0.15)', flex: 1 }]} />
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

      {/* ─── Upcoming Workshops (iRISE + iBelieve) ───────────── */}
      <View style={styles.section}>
        <SectionHeader title="Upcoming Workshops" />
        <View style={styles.workshopList}>
          <WorkshopCard
            image={IRISE_IMG}
            title="Women Leadership"
            subtitle="Leadership workshops designed for women."
            onPress={() => router.push('/(people)/opportunities?vertical=irise' as any)}
          />
          <WorkshopCard
            image={IBELIEVE_IMG}
            title="Entrepreneur Network"
            subtitle="Workshops and networking for entrepreneurs."
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
            Submit your event proposal and reach thousands of people across India.
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
  // ── Hero ──────────────────────────────────────────────────
  hero: {
    paddingBottom: Gap.xxl,
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
  heroLogoBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
    fontSize: 34,
    fontWeight: Font.black,
    letterSpacing: -0.8,
    lineHeight: 40,
    color: colors.ink,
  },
  heroHeadlineAccent: {
    color: colors.ink,
    fontStyle: 'italic',
  },
  heroSubtitle: {
    paddingHorizontal: PAGE_H,
    marginTop: Gap.md,
    fontSize: FontSize.body,
    color: 'rgba(14,14,14,0.6)',
    fontWeight: Font.medium,
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
    color: 'rgba(14,14,14,0.35)',
    marginHorizontal: 8,
  },
  heroTagText: {
    fontSize: FontSize.small,
    color: colors.ink,
    fontWeight: Font.bold,
  },

  // ── Upcoming Workshops ────────────────────────────────────
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
