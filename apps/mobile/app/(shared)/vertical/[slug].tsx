import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Vertical, ContentPost } from '@upshot/types';
import { colors, verticalColors, DarkBg, radius } from '../../../src/constants/theme';
import { Button, Card, Badge, EmptyState, LoadingScreen } from '../../../src/components/common';

const api = createApiClient();

type TabValue = 'all' | 'episodes' | 'events' | 'recaps';

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

const TABS: { label: string; value: TabValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Episodes', value: 'episodes' },
  { label: 'Events', value: 'events' },
  { label: 'Recaps', value: 'recaps' },
];

function formatDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatContentType(type: string): string {
  switch (type) {
    case 'episode': return 'Episode';
    case 'event_recap': return 'Event';
    case 'article': return 'Article';
    default: return type.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  }
}

export default function VerticalDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [vertical, setVertical] = useState<Vertical | null>(null);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const v = await api.verticals.getVerticalBySlug(slug);
        setVertical(v);
        const p = await api.verticals.getPostsByVertical(v.id, 20);
        setPosts(p);
      } catch {
        const fallback = VERTICAL_FALLBACKS[slug] ?? null;
        setVertical(fallback);
      }
      setLoading(false);
    }
    if (slug) load();
  }, [slug]);

  if (loading) {
    return <LoadingScreen />;
  }

  const verticalColor = vertical?.color ?? DarkBg;

  const filteredPosts: ContentPost[] = (() => {
    switch (activeTab) {
      case 'episodes':
        return posts.filter((p) => p.content_type === 'episode');
      case 'events':
        return posts.filter((p) => p.content_type === 'event_recap');
      case 'recaps':
        return posts.filter(
          (p) => p.content_type === 'event_recap' || p.content_type === 'article'
        );
      default:
        return posts;
    }
  })();

  const isCampusCartel = vertical?.slug === 'campus-cartel';

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

        {/* Content Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <TouchableOpacity
                  key={tab.value}
                  onPress={() => setActiveTab(tab.value)}
                  activeOpacity={0.7}
                  style={[
                    styles.tab,
                    isActive
                      ? { backgroundColor: verticalColor }
                      : { backgroundColor: 'transparent' },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive ? styles.tabTextActive : styles.tabTextInactive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Campus Cartel CTA */}
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
                title="Register now"
                variant="primary"
                size="sm"
                style={styles.campusCartelButton}
                onPress={() => router.push('/(auth)/register')}
              />
            </Card>
          )}

          {/* Posts */}
          {filteredPosts.length === 0 ? (
            <EmptyState
              title={`No ${activeTab === 'all' ? 'content' : activeTab} yet`}
              subtitle={`${vertical?.name ?? 'This vertical'} content coming soon`}
            />
          ) : (
            filteredPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                {/* Left colored bar */}
                <View style={[styles.postColorBar, { backgroundColor: verticalColor }]} />

                {/* Post content */}
                <View style={styles.postBody}>
                  {/* Top row: badge + date */}
                  <View style={styles.postTopRow}>
                    <Badge
                      label={formatContentType(post.content_type)}
                      color={verticalColor}
                    />
                    {post.published_at ? (
                      <Text style={styles.postDate}>{formatDate(post.published_at)}</Text>
                    ) : null}
                  </View>

                  {/* Title */}
                  <Text style={styles.postTitle} numberOfLines={2}>
                    {post.title}
                  </Text>

                  {/* Speaker name */}
                  {post.speaker_name ? (
                    <Text style={styles.postSpeakerName}>
                      {'with ' + post.speaker_name}
                    </Text>
                  ) : null}

                  {/* Speaker role */}
                  {post.speaker_role ? (
                    <Text style={styles.postSpeakerRole}>{post.speaker_role}</Text>
                  ) : null}
                </View>

                {/* Cover image */}
                {post.cover_url ? (
                  <Image
                    source={{ uri: post.cover_url }}
                    style={styles.postCover}
                    resizeMode="cover"
                  />
                ) : null}
              </View>
            ))
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

  // Tabs
  tabsWrapper: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    marginRight: 8,
  },
  tabText: {
    fontSize: 13,
  },
  tabTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  tabTextInactive: {
    color: colors.textSecondary,
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

  // Post card
  postCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postColorBar: {
    width: 3,
  },
  postBody: {
    flex: 1,
    padding: 12,
  },
  postTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 6,
  },
  postSpeakerName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  postSpeakerRole: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  postCover: {
    width: 80,
    height: '100%' as unknown as number,
  },
});
