import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { colors, Font, FontSize, Gap, shadow } from '../../constants/theme';
import { PressableScale } from './PressableScale';

interface WorkshopCardProps {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  onPress: () => void;
}

/**
 * Clean white row card: copy on the left, photo on the right.
 */
export function WorkshopCard({
  image,
  title,
  subtitle,
  onPress,
}: WorkshopCardProps) {
  return (
    <PressableScale
      onPress={onPress}
      style={styles.card}
      accessibilityLabel={`${title} — explore workshops`}
    >
      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <Text style={styles.explore}>Explore →</Text>
      </View>
      <Image source={image} style={styles.image} resizeMode="cover" />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.base,
    gap: Gap.base,
    minHeight: 128,
    ...shadow.sm,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 4,
  },
  explore: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.ink,
    marginTop: Gap.md,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
  },
});
