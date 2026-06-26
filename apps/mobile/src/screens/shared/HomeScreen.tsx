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
  EmptyState,
  LoadingScreen,
} from '../../components/common';
import { useAuthStore } from '../../store/auth.store';

const api = createApiClient();

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
      {/* ─── Section 1: Hero ─────────────────────────────────── */}
      <View style={styles.hero}>
        {/* Top row */}
        <View style={styles.heroTopRow}>
          <View style={styles.heroLogoBadge}>
            <Image source={LOGO} style={styles.heroLogo} resizeMode="contain" />
          </View>
          <View style={styles.timePill}>
            <Text style={styles.timePillText}>{timeOfDay}</Text>
          </View>
        </View>

        {/* Headline block */}
        <View style={styles.heroHeadlineBlock}>
          <Text style={styles.heroHeadlineLine}>Conversations.</Text>
          <Text style={styles.heroHeadlineLine}>Communities.</Text>
          <Text style={[styles.heroHeadlineLine, styles.heroHeadlineAccent]}>
            Experiences.
          </Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.heroSubtitle}>
          India's leading Media & Community Network
        </Text>

        {/* Tag row */}
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

      {/* ─── Section 2: Verticals Grid ──────────────────────── */}
      <View style={styles.verticalsSection}>
        <Text style={styles.verticalsSectionTitle}>Our Verticals</Text>
        <View style={styles.verticalsGrid}>
          {verticals.map((vertical) => (
            <TouchableOpacity
              key={vertical.id}
              style={[styles.verticalGridCard, { backgroundColor: vertical.color }]}
              onPress={() => router.push(`/(shared)/vertical/${vertical.slug}` as any)}
              activeOpacity={0.82}
            >
              <View style={styles.verticalGridCircle} />
              <Text style={styles.verticalGridName}>{vertical.name}</Text>
              <Text style={styles.verticalGridTagline}>
                {vertical.tagline ?? ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ─── Section 3: From Unfiltered ─────────────────────── */}
      <View style={styles.unfilteredSection}>
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
              <Ionicons name="mic-outline" size={20} color="#5B21B6" />
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

      {/* ─── Section 4: Open Opportunities ──────────────────── */}
      <View style={styles.opportunitiesSection}>
        <SectionHeader
          title="Open opportunities"
          action
          actionLabel="See all"
          onAction={() => router.push('/(people)/opportunities' as any)}
        />

        {recentEvents.length === 0 ? (
          <EmptyState
            iconName="briefcase-outline"
            title="No live projects right now"
            subtitle={'New opportunities are posted weekly.\nCheck back soon.'}
          />
        ) : (
          <>
            {recentEvents.slice(0, 3).map((event) => (
              <View key={event.id} style={styles.opportunityCardWrapper}>
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
              onPress={() => router.push('/(people)/opportunities' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllLink}>See all opportunities →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ─── Section 5: Campus Cartel Banner ────────────────── */}
      <View style={styles.campusCartelBanner}>
        <Text style={styles.campusCartelLabel}>CAMPUS CARTEL</Text>
        <Text style={styles.campusCartelHeadline}>
          Join India's fastest growing student network
        </Text>
        <Text style={styles.campusCartelStats}>
          150+ colleges · 2000+ students
        </Text>
        <TouchableOpacity
          style={styles.campusCartelBtn}
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.8}
        >
          <Text style={styles.campusCartelBtnText}>Join the network →</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Section 6: iRISE + iBelieve Row ────────────────── */}
      <View style={styles.dualRow}>
        <TouchableOpacity
          style={[styles.dualCard, { backgroundColor: verticalColors.irise, borderWidth: 1, borderColor: 'rgba(180,83,9,0.35)' }]}
          onPress={() => router.push('/(shared)/vertical/irise')}
          activeOpacity={0.85}
        >
          <Text style={[styles.dualCardName, { color: '#F59E0B' }]}>iRISE</Text>
          <Text style={styles.dualCardTagline}>
            {FALLBACK_VERTICALS[2].tagline}
          </Text>
          <Text style={[styles.dualCardExplore, { color: 'rgba(245,158,11,0.8)' }]}>Explore →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dualCard, { backgroundColor: verticalColors.ibelieve, borderWidth: 1, borderColor: 'rgba(185,28,28,0.35)' }]}
          onPress={() => router.push('/(shared)/vertical/ibelieve')}
          activeOpacity={0.85}
        >
          <Text style={[styles.dualCardName, { color: '#F87171' }]}>iBelieve</Text>
          <Text style={styles.dualCardTagline}>
            {FALLBACK_VERTICALS[3].tagline}
          </Text>
          <Text style={[styles.dualCardExplore, { color: 'rgba(248,113,113,0.8)' }]}>Explore →</Text>
        </TouchableOpacity>
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
    paddingBottom: 100,
  },

  // ── Hero ──────────────────────────────────────────────────
  hero: {
    paddingBottom: 24,
    backgroundColor: DarkBg,
  },
  heroTopRow: {
    paddingTop: 52,
    paddingHorizontal: 20,
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
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  heroHeadlineBlock: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  heroHeadlineLine: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 40,
    color: '#FFFFFF',
  },
  heroHeadlineAccent: {
    color: '#7BC55A',
  },
  heroSubtitle: {
    paddingHorizontal: 20,
    marginTop: 10,
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: Font.regular,
  },
  heroTagsScroll: {
    marginTop: 16,
  },
  heroTagsContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  heroTag: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
  },
  heroTagText: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.6)',
  },

  // ── Verticals Grid ────────────────────────────────────────
  verticalsSection: {
    backgroundColor: '#F0F0F5',
    paddingTop: Gap.xl,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
  },
  verticalsSectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    marginBottom: Gap.md,
  },
  verticalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  verticalGridCard: {
    width: '48%',
    minHeight: 90,
    borderRadius: 14,
    padding: 14,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  verticalGridCircle: {
    position: 'absolute',
    bottom: -16,
    right: -16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  verticalGridName: {
    fontSize: 14,
    fontWeight: Font.bold,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  verticalGridTagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 3,
    lineHeight: 14,
  },

  // ── From Unfiltered ───────────────────────────────────────
  unfilteredSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: Gap.xl,
    paddingHorizontal: Gap.base,
  },
  unfilteredTeaser: {
    backgroundColor: '#F5F0FF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#5B21B6',
  },
  unfilteredTeaserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unfilteredTeaserLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#5B21B6',
  },
  unfilteredTeaserBody: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 8,
  },
  featuredContent: {
    paddingVertical: 4,
    gap: 12,
  },

  // ── Open Opportunities ────────────────────────────────────
  opportunitiesSection: {
    backgroundColor: '#F0F0F5',
    paddingTop: Gap.xl,
    paddingHorizontal: Gap.base,
  },
  opportunityCardWrapper: {
    marginBottom: 10,
  },
  seeAllLink: {
    fontSize: FontSize.body,
    color: colors.primary,
    fontWeight: Font.semibold,
    textAlign: 'center',
    padding: Gap.base,
  },

  // ── Campus Cartel Banner ──────────────────────────────────
  campusCartelBanner: {
    backgroundColor: '#0C1F15',
    borderRadius: 0,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  campusCartelLabel: {
    fontSize: 10,
    fontWeight: Font.bold,
    color: 'rgba(123,197,90,0.8)',
    letterSpacing: 3,
  },
  campusCartelHeadline: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
    marginTop: 6,
  },
  campusCartelStats: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
  campusCartelBtn: {
    height: 38,
    backgroundColor: 'rgba(123,197,90,0.15)',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(123,197,90,0.4)',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  campusCartelBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#7BC55A',
  },

  // ── iRISE + iBelieve Dual Row ─────────────────────────────
  dualRow: {
    padding: Gap.base,
    flexDirection: 'row',
    gap: 10,
    marginTop: 0,
  },
  dualCard: {
    flex: 1,
    height: 110,
    borderRadius: 14,
    padding: 16,
    overflow: 'hidden',
  },
  dualCardName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dualCardTagline: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  dualCardExplore: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#FFFFFF',
    marginTop: 16,
  },
});
