import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, Font, FontSize, Gap, shadow } from '../../constants/theme';
import { FauxGradient } from './FauxGradient';
import { PressableScale } from './PressableScale';

interface FeaturedPodcastCardProps {
  title: string;
  subtitle?: string | null;
  thumbnailUrl: string | null;
  isNew?: boolean;
  onPress: () => void;
}

/**
 * Large editorial hero card for the featured Unfiltered episode.
 * Full-bleed thumbnail, bottom scrim, white title, play affordance.
 */
export function FeaturedPodcastCard({
  title,
  subtitle,
  thumbnailUrl,
  isNew = false,
  onPress,
}: FeaturedPodcastCardProps) {
  return (
    <PressableScale
      onPress={onPress}
      style={styles.card}
      accessibilityLabel={`Play podcast: ${title}`}
    >
      {thumbnailUrl ? (
        <Image
          source={{ uri: thumbnailUrl }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.thumbFallback]}>
          <Ionicons name="mic-outline" size={44} color="rgba(255,255,255,0.35)" />
        </View>
      )}

      <FauxGradient side="bottom" maxOpacity={0.88} coverage={0.75} />

      <View style={styles.body}>
        <View style={styles.textCol}>
          {isNew && (
            <View style={styles.newBadge}>
              <View style={styles.newDot} />
              <Text style={styles.newBadgeText}>NEW EPISODE</Text>
            </View>
          )}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.playBtn}>
          <Ionicons
            name="play"
            size={22}
            color={colors.ink}
            style={{ marginLeft: 2 }}
          />
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 250,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.ink,
    justifyContent: 'flex-end',
    ...shadow.md,
  },
  thumbFallback: {
    backgroundColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Gap.lg,
    gap: Gap.base,
  },
  textCol: {
    flex: 1,
  },
  newBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Gap.sm,
  },
  newDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  newBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.primary,
    letterSpacing: 1.6,
  },
  title: {
    fontSize: 22,
    fontWeight: Font.black,
    color: '#FFFFFF',
    lineHeight: 27,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 4,
    fontWeight: Font.medium,
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
});
