import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LOGO = require('../../../assets/logo.png') as number;
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { Vertical, ContentPost, Event } from '@upshot/types';
import {
  colors,
  verticalColors,
  DarkBg,
  Font,
  FontSize,
  Gap,
} from '../../constants/theme';
import {
  SectionHeader,
  ContentCard,
  OpportunityCard,
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
  const [featuredPosts, setFeaturedPosts] = useState<ContentPost[]>([]);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [verts, posts, events] = await Promise.allSettled([
        api.verticals.getAllVerticals(),
        api.verticals.getFeaturedPosts(6),
        api.verticals.getRecentEvents(4),
      ]);

      if (verts.status === 'fulfilled' && verts.value.length > 0) {
        setVerticals(verts.value);
      } else {
        setVerticals(FALLBACK_VERTICALS);
      }

      if (posts.status === 'fulfilled') setFeaturedPosts(posts.value);
      if (events.status === 'fulfilled') setRecentEvents(events.value);

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

  async function handleApply(eventId: string) {
    if (!user) return;
    setApplyingIds((prev) => new Set(prev).add(eventId));
    const result = await api.events.applyForEvent(eventId, user.id);
    if (!result.error) setAppliedIds((prev) => new Set(prev).add(eventId));
    setApplyingIds((prev) => {
      const s = new Set(prev);
      s.delete(eventId);
      return s;
    });
  }

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
          action
          actionLabel="See all"
          onAction={() => router.push('/(shared)/verticals' as any)}
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

      <View style={styles.divider} />

      {/* ─── From Unfiltered ─────────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader
          title="From Unfiltered"
          subtitle="Leadership conversations"
          titleStyle={{ color: '#5B21B6' }}
          action
          actionLabel="See all"
          onAction={() => router.push('/(shared)/vertical/unfiltered')}
        />

        {featuredPosts.length === 0 ? (
          <View style={styles.unfilteredTeaser}>
            <View style={styles.unfilteredTeaserRow}>
              <Ionicons name="mic-outline" size={18} color="#5B21B6" />
              <Text style={styles.unfilteredTeaserLabel}>Launching soon</Text>
            </View>
            <Text style={styles.unfilteredTeaserBody}>
              Real conversations with founders, CXOs and policymakers. First
              episodes dropping soon.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContent}
          >
            {featuredPosts.map((post) => (
              <ContentCard
                key={post.id}
                post={post}
                verticalColor="#5B21B6"
                onPress={() => void 0}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.divider} />

      {/* ─── Open Opportunities ──────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader
          title="Open opportunities"
          action
          actionLabel="See all"
          onAction={() => router.push('/(people)/opportunities' as any)}
        />

        {recentEvents.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="briefcase-outline" size={24} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No live projects right now</Text>
            <Text style={styles.emptySubtitle}>
              New opportunities are posted weekly. Check back soon.
            </Text>
          </View>
        ) : (
          <>
            {recentEvents.slice(0, 3).map((event) => (
              <View key={event.id} style={styles.cardGap}>
                <OpportunityCard
                  event={event}
                  onPress={() => void 0}
                  onApply={() => handleApply(event.id)}
                  hasApplied={appliedIds.has(event.id)}
                  isApplying={applyingIds.has(event.id)}
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.seeAllRow}
              onPress={() => router.push('/(people)/opportunities' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>See all opportunities</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primary} />
            </TouchableOpacity>
          </>
        )}
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
    paddingBottom: SECTION_V,  // 24px — enough clearance above the tab bar
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
  cardGap: {
    marginBottom: Gap.sm,
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

  // ── From Unfiltered ───────────────────────────────────────
  unfilteredTeaser: {
    backgroundColor: '#F5F0FF',
    borderRadius: CARD_RADIUS,
    padding: CARD_PAD,
    borderLeftWidth: 3,
    borderLeftColor: '#5B21B6',
  },
  unfilteredTeaserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    marginBottom: Gap.sm,
  },
  unfilteredTeaserLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#5B21B6',
  },
  unfilteredTeaserBody: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  featuredContent: {
    gap: Gap.sm,
    paddingVertical: 2,
  },

  // ── Open Opportunities ────────────────────────────────────
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.lg,
    alignItems: 'flex-start',
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.sm,
  },
  emptyTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    lineHeight: 20,
    maxWidth: 240,
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.xs,
    paddingVertical: Gap.sm,
    marginTop: Gap.xs,
  },
  seeAllText: {
    fontSize: FontSize.body,
    color: colors.primary,
    fontWeight: Font.semibold,
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
    paddingBottom: SECTION_V,
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
});
