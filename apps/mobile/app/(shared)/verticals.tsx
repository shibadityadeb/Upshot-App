import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, Font, FontSize, Gap, verticalColors } from '../../src/constants/theme';

const VERTICALS = [
  {
    slug: 'unfiltered',
    name: 'Unfiltered',
    tagline: 'Real conversations with founders, CXOs and policymakers',
    description: 'Long-form leadership conversations and thought leadership content.',
    color: verticalColors.unfiltered,
    emoji: '🎙️',
  },
  {
    slug: 'campus-cartel',
    name: 'Campus Cartel',
    tagline: "India's fastest growing student network",
    description: '150+ colleges, 2000+ students building the future together.',
    color: verticalColors.campusCartel,
    emoji: '🎓',
  },
  {
    slug: 'irise',
    name: 'iRISE',
    tagline: "Women's leadership and empowerment platform",
    description: 'Celebrating and accelerating women leaders across industries.',
    color: verticalColors.irise,
    emoji: '⚡',
  },
  {
    slug: 'ibelieve',
    name: 'iBelieve',
    tagline: 'Entrepreneurship and innovation network',
    description: 'Stories, tools and community for the next generation of founders.',
    color: verticalColors.ibelieve,
    emoji: '🚀',
  },
] as const;

export default function VerticalsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Our Verticals</Text>
          <Text style={styles.headerSubtitle}>Four communities. One platform.</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {VERTICALS.map((v) => (
          <TouchableOpacity
            key={v.slug}
            style={styles.card}
            onPress={() => router.push(`/(shared)/vertical/${v.slug}` as any)}
            activeOpacity={0.82}
          >
            {/* Color bar */}
            <View style={[styles.colorBar, { backgroundColor: v.color }]} />

            {/* Content */}
            <View style={styles.cardContent}>
              <View style={styles.cardTop}>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardEmoji}>{v.emoji}</Text>
                  <Text style={styles.cardName}>{v.name}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
              </View>
              <Text style={styles.cardTagline}>{v.tagline}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {v.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            More verticals launching soon
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    backgroundColor: colors.dark,
    paddingTop: Gap.md,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Gap.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },

  // Scroll
  scrollContent: {
    padding: Gap.base,
    paddingBottom: 100,
    gap: 10,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  colorBar: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Gap.sm,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
  },
  cardEmoji: {
    fontSize: 18,
  },
  cardName: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
  },
  cardTagline: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    lineHeight: 16,
  },

  // Footer
  footer: {
    paddingVertical: Gap.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.small,
    color: colors.textLight,
  },
});
