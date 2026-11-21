import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { Event, HomeCard } from '@upshot/types';
import {
  colors,
  Font,
  FontSize,
  Gap,
  radius,
  shadow,
  useResponsive,
} from '../../constants/theme';
import { LoadingScreen } from '../../components/common';
import {
  HomeFooter,
  SpecialEventsCarousel,
  FeaturedCarousel,
  type FeaturedSlide,
} from '../../components/home';
import { useAuthStore } from '../../store/auth.store';
import { rankEvents, categoryWeightsFromApplications } from '../../lib/rankEvents';

const api = createApiClient();

const PAGE_H = Gap.base;       // 16 — horizontal padding for all sections
const SECTION_V = Gap.xl;      // 24

/** Headline track-record numbers. Static copy — edit here to change them. */
const TRACK_RECORD = [
  { value: '130+', label: 'Campaigns', icon: 'calendar-outline' as const, color: '#6AA62E' },
  { value: '40+', label: 'Leaders', icon: 'people-outline' as const, color: '#8B5CF6' },
  { value: '6+', label: 'States', icon: 'location-outline' as const, color: '#6AA62E' },
];

const SPECIAL_LIMIT = 8;
// When no event is admin-starred, how many ranked events seed the Special rail
// (kept small so the Recommended rail below still has events to show).
const SPECIAL_FALLBACK = 3;

const LOGO = require('../../../assets/logo.png');
const HERO_LIQUID = require('../../../assets/hero-liquid.png');
const COINS = require('../../../assets/coins.png');
const FEAT_CONCERT = require('../../../assets/feat-concert.jpg');
const FEAT_CAMPUS = require('../../../assets/feat-campus.jpg');
const FEAT_WORKSHOP = require('../../../assets/feat-workshop.jpg');
const FEAT_UNFILTERED = require('../../../assets/feat-unfiltered.jpg');

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const r = useResponsive();

  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [homeCards, setHomeCards] = useState<HomeCard[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function onRefresh() {
    setRefreshing(true);
    await load(false);
    setRefreshing(false);
  }

  async function load(showLoader = true) {
    if (showLoader) setLoading(true);
    try {
      try {
        const res = await api.events.getApprovedEvents(1, 50);
        if (res.data) setEvents(res.data.data);
      } catch (e) {
        console.warn('Failed to load events', e);
      }
      // Admin-curated home content. Wrapped defensively so the screen still
      // works before migration 030 (the table/column) is applied — it just
      // falls back to the built-in Featured cards and ranked Special Events.
      try {
        const [cardsRes, featRes] = await Promise.all([
          api.homeCards.getActiveCards(),
          api.events.getFeaturedEvents(SPECIAL_LIMIT),
        ]);
        if (cardsRes.data) setHomeCards(cardsRes.data);
        if (featRes.data) setFeaturedEvents(featRes.data);
      } catch {
        /* pre-migration — fall back to defaults */
      }
      if (user) {
        try {
          const mine = await api.events.getMyApplications(user.id);
          if (mine.data) {
            setAppliedCategories(
              mine.data
                .filter((a) => a.status !== 'withdrawn')
                .map((a) => a.event?.category)
                .filter((c): c is string => !!c),
            );
          }
        } catch {
          /* non-fatal */
        }
      }
    } catch {
      /* use fallbacks */
    }
    setLoading(false);
  }

  // The recommendation engine orders the Special Events row. userCity stays
  // undefined until Profile gains a location field — then "near you" switches on.
  const categoryWeights = useMemo(
    () => categoryWeightsFromApplications(appliedCategories),
    [appliedCategories],
  );
  const ranked = useMemo(
    () => rankEvents(events, { appliedCategoryWeights: categoryWeights, userCity: user?.city }),
    [events, categoryWeights, user?.city],
  );

  // Special Events = events an admin has starred (is_featured). Until any are
  // starred (or before migration 030), fall back to the top-ranked events (those
  // with a banner first). The fallback is capped so the Recommended rail below
  // always has events left to show whenever there are at least two upcoming.
  const specialEvents = useMemo(() => {
    if (featuredEvents.length > 0) return featuredEvents.slice(0, SPECIAL_LIMIT);
    const withBanner = ranked.filter((e) => !!e.banner_url);
    const pool = withBanner.length >= 2 ? withBanner : ranked;
    const cap =
      ranked.length > SPECIAL_FALLBACK ? SPECIAL_FALLBACK : Math.max(1, ranked.length - 1);
    return pool.slice(0, cap);
  }, [featuredEvents, ranked]);

  // Recommended = the recommendation engine's top picks (location + interest
  // affinity + popularity + recency), minus whatever already shows in Special
  // Events so the two rails don't repeat.
  const recommendedEvents = useMemo(() => {
    const specialIds = new Set(specialEvents.map((e) => e.id));
    return ranked.filter((e) => !specialIds.has(e.id)).slice(0, SPECIAL_LIMIT);
  }, [ranked, specialEvents]);

  const go = (path: string) => router.push(path as any);
  const openLink = (link: string) => {
    if (/^https?:\/\//i.test(link)) Linking.openURL(link).catch(() => {});
    else go(link);
  };

  // Admin-managed Featured Experiences cards override the built-in defaults when
  // present (cover image, title, redirect link and CTA all come from the admin).
  const defaultSlides: FeaturedSlide[] = [
    {
      key: 'host',
      badge: 'Featured Event',
      title: 'Host Your\nEvent on ',
      accent: 'Upshot',
      description: 'Bring your idea to life and connect with the right audience.',
      cta: 'Create Event',
      image: FEAT_CONCERT,
      onPress: () => go('/(people)/host-event'),
    },
    {
      key: 'campus',
      badge: 'Community',
      title: 'Campus ',
      accent: 'Cartel',
      description: "Join India's student ambassador network.",
      cta: 'Explore Community',
      image: FEAT_CAMPUS,
      onPress: () =>
        go(user?.role === 'ambassador' ? '/(ambassador)/dashboard' : '/(people)/campus-cartel'),
    },
    {
      key: 'workshops',
      badge: 'Workshops',
      title: 'Discover\nWorkshops',
      description: 'Find experiences, learn new skills and meet new people.',
      cta: 'Explore Events',
      image: FEAT_WORKSHOP,
      onPress: () => go('/(people)/opportunities?vertical=all'),
    },
    {
      key: 'unfiltered',
      badge: 'Unfiltered',
      title: 'Unfiltered',
      description: 'Discover leadership conversations and inspiring stories.',
      cta: 'Explore More',
      image: FEAT_UNFILTERED,
      onPress: () => go('/(shared)/vertical/unfiltered'),
    },
  ];

  const featuredSlides: FeaturedSlide[] =
    homeCards.length > 0
      ? homeCards.map((c) => ({
          key: c.id,
          badge: c.badge ?? 'Featured',
          title: c.title,
          description: c.subtitle ?? '',
          cta: c.cta ?? 'Explore',
          image: c.cover_url ? { uri: c.cover_url } : FEAT_CONCERT,
          onPress: () => openLink(c.link),
        }))
      : defaultSlides;

  const quickAccess = [
    { key: 'events', label: 'Events', icon: 'calendar' as const, tint: '#EDF6D6', color: '#6AA62E', onPress: () => go('/(people)/opportunities?vertical=all') },
    { key: 'campus', label: 'Campus Cartel', icon: 'people' as const, tint: '#E1F0D4', color: '#3E7B1E', onPress: () => go('/(people)/campus-cartel') },
    { key: 'tasks', label: 'Tasks', icon: 'checkbox' as const, tint: '#E6EEFB', color: '#3B6FD4', onPress: () => go('/(people)/my-tasks') },
    { key: 'rewards', label: 'Rewards', icon: 'gift' as const, tint: '#FCEBD8', color: '#E8833A', onPress: () => go('/(people)/wallet') },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.ink} />
      }
    >
      <StatusBar barStyle="dark-content" />

      <View style={[styles.inner, { maxWidth: r.contentWidth }]}>

      {/* ─── Hero (liquid green) ─────────────────────────────── */}
      <View style={styles.hero}>
        <Image source={HERO_LIQUID} style={styles.heroBg} resizeMode="cover" />
        <View style={styles.heroTopRow}>
          <View style={styles.logoPill}>
            <Image source={LOGO} style={styles.logoImg} resizeMode="contain" />
          </View>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.bell} activeOpacity={0.8} onPress={() => {}}>
              <View style={styles.bellDot} />
              <Ionicons name="notifications-outline" size={20} color={colors.ink} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatar}
              activeOpacity={0.8}
              onPress={() => go('/(people)/profile')}
            >
              <Text style={styles.avatarText}>
                {(user?.full_name ?? 'U').trim().charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.headline}>Conversations,{'\n'}Communities, Experience.</Text>
        <Text style={styles.subtitle}>India's media and community network.</Text>

        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for events, communities..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() =>
              go(`/(people)/opportunities?vertical=all${search ? `&q=${encodeURIComponent(search)}` : ''}`)
            }
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.filterBtn}
            activeOpacity={0.8}
            onPress={() => go('/(people)/opportunities?vertical=all')}
          >
            <Ionicons name="options-outline" size={18} color={colors.ink} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Performance at a glance ─────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.perf}>
          <Text style={styles.perfLabel}>Performance at a glance</Text>
          {TRACK_RECORD.map((s) => (
            <React.Fragment key={s.label}>
              <View style={styles.perfDivider} />
              <View style={styles.perfStat}>
                <Ionicons name={s.icon} size={17} color={s.color} />
                <Text style={styles.perfValue}>{s.value}</Text>
                <Text style={styles.perfStatLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
          <TouchableOpacity
            style={styles.perfGo}
            activeOpacity={0.8}
            onPress={() => go('/(people)/opportunities?vertical=all')}
          >
            <Ionicons name="arrow-forward" size={15} color={colors.ink} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Quick access ────────────────────────────────────── */}
      <View style={[styles.section, styles.sectionTight]}>
        <View style={styles.quickRow}>
          {quickAccess.map((q) => (
            <TouchableOpacity key={q.key} style={styles.quickCard} activeOpacity={0.85} onPress={q.onPress}>
              <View style={[styles.quickIcon, { backgroundColor: q.tint }]}>
                <Ionicons name={q.icon} size={22} color={q.color} />
              </View>
              <Text style={styles.quickLabel} numberOfLines={2}>
                {q.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ─── Featured Experiences ────────────────────────────── */}
      <View style={styles.sectionNarrow}>
        <View style={styles.headerPadded}>
          <Text style={styles.sectionTitle}>Featured Experiences</Text>
        </View>
        <FeaturedCarousel slides={featuredSlides} horizontalPadding={r.gutter} containerWidth={r.contentWidth} />
      </View>

      {/* ─── Special Events ──────────────────────────────────── */}
      {specialEvents.length > 0 && (
        <View style={styles.sectionNarrow}>
          <View style={[styles.headerPadded, styles.headerRow]}>
            <Text style={styles.sectionTitle}>Special Events</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => go('/(people)/opportunities?vertical=all')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <SpecialEventsCarousel
            events={specialEvents}
            horizontalPadding={r.gutter}
            onPressEvent={(id) => go(`/(people)/apply/${id}`)}
          />
        </View>
      )}

      {/* ─── Recommended for You (recommendation engine) ─────── */}
      {recommendedEvents.length > 0 && (
        <View style={styles.sectionNarrow}>
          <View style={[styles.headerPadded, styles.headerRow]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <Text style={styles.sectionSub}>
                {user?.city ? `Events near ${user.city} & your interests` : 'Picked by your interests & what’s popular'}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => go('/(people)/opportunities?vertical=all')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <SpecialEventsCarousel
            events={recommendedEvents}
            horizontalPadding={r.gutter}
            onPressEvent={(id) => go(`/(people)/apply/${id}`)}
          />
        </View>
      )}

      {/* ─── Promo cards: Campus Cartel + Earn Rewards ───────── */}
      <View style={styles.section}>
        <View style={styles.promoRow}>
          <TouchableOpacity
            style={[styles.promo, styles.promoCampus]}
            activeOpacity={0.9}
            onPress={() =>
              go(user?.role === 'ambassador' ? '/(ambassador)/dashboard' : '/(people)/campus-cartel')
            }
          >
            <View style={styles.promoIconLime}>
              <Ionicons name="people" size={22} color="#3E7B1E" />
            </View>
            <Text style={styles.promoTitle}>Campus Cartel</Text>
            <Text style={styles.promoBody}>Join India's student ambassador network.</Text>
            <View style={styles.promoGo}>
              <Ionicons name="arrow-forward" size={15} color={colors.ink} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.promo, styles.promoRewards]}
            activeOpacity={0.9}
            onPress={() => go('/(people)/wallet')}
          >
            <View style={styles.promoIconCream}>
              <Ionicons name="gift" size={22} color="#E8833A" />
            </View>
            <Text style={styles.promoTitle}>Earn Rewards</Text>
            <Text style={styles.promoBody}>Complete tasks, earn coins & level up.</Text>
            <Image source={COINS} style={styles.promoCoins} resizeMode="contain" />
            <View style={styles.promoGo}>
              <Ionicons name="arrow-forward" size={15} color={colors.ink} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Unfiltered editorial ────────────────────────────── */}
      <View style={styles.section}>
        <View style={[styles.headerRow, { marginBottom: 14 }]}>
          <Text style={styles.sectionTitle}>Unfiltered</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => go('/(shared)/vertical/unfiltered')}>
            <Text style={styles.seeAll}>Explore →</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.unf}
          activeOpacity={0.92}
          onPress={() => go('/(shared)/vertical/unfiltered')}
        >
          <Image source={FEAT_UNFILTERED} style={styles.unfImg} resizeMode="cover" />
          <View style={styles.unfOverlay} />
          <View style={styles.unfInner}>
            <View style={styles.unfPlay}>
              <Ionicons name="play" size={22} color={colors.ink} />
            </View>
            <View style={styles.unfText}>
              <Text style={styles.unfTitle}>Leadership. Conversations. Ideas.</Text>
              <Text style={styles.unfSub}>Listen to inspiring stories on Unfiltered.</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <HomeFooter paddingHorizontal={PAGE_H} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  contentContainer: { paddingBottom: 24 },
  /** Centres + caps the content so tablets don't stretch the phone layout. */
  inner: { width: '100%', alignSelf: 'center' },

  section: { paddingHorizontal: PAGE_H, paddingTop: SECTION_V },
  sectionTight: { paddingTop: 14 },
  sectionNarrow: { paddingTop: SECTION_V },
  headerPadded: { paddingHorizontal: PAGE_H },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.6,
    marginBottom: 14,
  },
  sectionSub: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontWeight: Font.medium,
    marginTop: -10,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    marginBottom: 14,
  },

  // ── Hero ──
  hero: {
    backgroundColor: colors.primary,
    paddingBottom: Gap.xl,
    overflow: 'hidden',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  heroTopRow: {
    paddingTop: 56,
    paddingHorizontal: PAGE_H,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...shadow.md,
  },
  logoImg: { width: 92, height: 28 },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: Gap.sm },
  bell: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  bellDot: {
    position: 'absolute',
    top: 12,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: FontSize.h3, fontWeight: Font.bold },
  headline: {
    paddingHorizontal: PAGE_H,
    marginTop: Gap.lg,
    fontSize: FontSize.display,
    fontWeight: Font.black,
    letterSpacing: -0.9,
    lineHeight: 34,
    color: colors.ink,
  },
  subtitle: {
    paddingHorizontal: PAGE_H,
    marginTop: Gap.sm,
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: '#2c3326',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    marginHorizontal: PAGE_H,
    marginTop: Gap.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.full,
    height: 54,
    paddingLeft: 18,
    paddingRight: 8,
    ...shadow.md,
  },
  searchInput: { flex: 1, fontSize: FontSize.body, color: colors.ink, paddingVertical: 0 },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Performance panel ──
  perf: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 12,
    ...shadow.sm,
  },
  perfLabel: {
    fontSize: 12,
    fontWeight: Font.black,
    color: colors.ink,
    lineHeight: 15,
    letterSpacing: -0.2,
    width: 104,
    paddingRight: 6,
  },
  perfDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginVertical: 4,
    marginHorizontal: 2,
  },
  perfStat: { flex: 1, alignItems: 'center', gap: 3, paddingHorizontal: 2 },
  perfValue: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  perfStatLabel: { fontSize: FontSize.micro, color: colors.textSecondary, fontWeight: Font.semibold },
  perfGo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  // ── Quick access ──
  quickRow: { flexDirection: 'row', gap: Gap.sm },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 8,
    ...shadow.sm,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 13,
  },

  // ── Promo cards ──
  promoRow: { flexDirection: 'row', gap: Gap.base },
  promo: {
    flex: 1,
    borderRadius: radius.xl,
    padding: Gap.base,
    minHeight: 150,
    overflow: 'hidden',
  },
  promoCampus: { backgroundColor: '#C8E68C' },
  promoRewards: { backgroundColor: '#F8DcC0' },
  promoIconLime: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  promoIconCream: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  promoTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  promoBody: {
    fontSize: FontSize.xs,
    color: '#49503f',
    marginTop: 6,
    lineHeight: 16,
    maxWidth: 120,
  },
  promoGo: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  promoCoins: {
    position: 'absolute',
    right: 4,
    bottom: 2,
    width: 66,
    height: 82,
  },

  // ── Unfiltered ──
  unf: {
    height: 132,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: '#121410',
    ...shadow.md,
  },
  unfImg: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '62%',
    height: '100%',
    opacity: 0.85,
  },
  unfOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,19,9,0.5)',
  },
  unfInner: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.base,
    paddingHorizontal: 18,
  },
  unfPlay: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unfText: { flex: 1 },
  unfTitle: {
    color: '#FFFFFF',
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    letterSpacing: -0.3,
  },
  unfSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: FontSize.xs,
    marginTop: 3,
  },
});
