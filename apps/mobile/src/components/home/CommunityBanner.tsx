import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../constants/theme';
import { FauxGradient } from './FauxGradient';
import { PressableScale } from './PressableScale';

interface CommunityBannerProps {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  ctaLabel: string;
  onPress: () => void;
}

/**
 * Full-width promotional banner: photo background with a left scrim
 * so the copy stays readable over the image.
 */
export function CommunityBanner({
  image,
  title,
  subtitle,
  ctaLabel,
  onPress,
}: CommunityBannerProps) {
  return (
    <PressableScale
      onPress={onPress}
      style={styles.card}
      accessibilityLabel={`${title} — ${ctaLabel}`}
    >
      {/* Local require() images default to intrinsic width/height, which
          beats absolute edge constraints — size must be set explicitly. */}
      <Image
        source={image}
        style={[StyleSheet.absoluteFillObject, styles.photo]}
        resizeMode="cover"
      />

      {/* Light overall tint + narrow left ramp: keeps the people in the
          photo visible while the copy stays readable. */}
      <View pointerEvents="none" style={styles.tint} />
      <FauxGradient side="left" maxOpacity={0.55} coverage={0.6} />

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>{ctaLabel} →</Text>
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 235,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.ink,
    justifyContent: 'flex-end',
    ...shadow.md,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,8,8,0.30)',
  },
  body: {
    padding: Gap.lg,
    maxWidth: '68%',
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.primary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.88)',
    fontWeight: Font.medium,
    lineHeight: 20,
    marginTop: Gap.xs,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: Gap.base,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: Gap.lg,
    height: 42,
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.onPrimary,
  },
});
