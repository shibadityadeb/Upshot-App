import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../constants/theme';
import { FauxGradient } from './FauxGradient';

export interface FeaturedSlide {
  key: string;
  badge: string;
  /** Title text; the `accent` word is appended in lime. */
  title: string;
  accent?: string;
  description: string;
  cta: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

const AUTO_ADVANCE_MS = 5000;

/**
 * Large, swipeable promotional carousel for the home screen. Snaps per card,
 * peeks the next card, auto-advances on a timer, and pauses autoplay while the
 * user is interacting.
 */
export function FeaturedCarousel({
  slides,
  horizontalPadding,
  containerWidth,
}: {
  slides: FeaturedSlide[];
  horizontalPadding: number;
  /** The capped content width (from useResponsive) so cards never overflow on tablets. */
  containerWidth: number;
}) {
  const cardWidth = Math.round(containerWidth - horizontalPadding - 44);
  const gap = Gap.base;
  const snap = cardWidth + gap;

  const listRef = useRef<FlatList<FeaturedSlide>>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const interacting = useRef(false);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      if (interacting.current) return;
      const next = (indexRef.current + 1) % slides.length;
      listRef.current?.scrollToOffset({ offset: next * snap, animated: true });
      setIndex(next);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length, snap]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / snap);
    if (!Number.isNaN(i)) setIndex(Math.max(0, Math.min(i, slides.length - 1)));
    interacting.current = false;
  };

  return (
    <FlatList
      ref={listRef}
      data={slides}
      keyExtractor={(s) => s.key}
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={snap}
      snapToAlignment="start"
      contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
      ItemSeparatorComponent={() => <View style={{ width: gap }} />}
      onScrollBeginDrag={() => {
        interacting.current = true;
      }}
      onMomentumScrollEnd={onMomentumEnd}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={item.onPress}
          style={[styles.card, { width: cardWidth }]}
        >
          <Image source={item.image} style={styles.image} resizeMode="cover" />
          <FauxGradient side="left" maxOpacity={0.86} coverage={1} />
          <View style={styles.badge}>
            <Ionicons name="star" size={12} color="#E8A41D" />
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
          <View style={styles.inner}>
            <Text style={styles.title}>
              {item.title}
              {item.accent ? <Text style={styles.accent}>{item.accent}</Text> : null}
            </Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>{item.cta}</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.ink} />
            </View>
          </View>
          <View style={styles.dots}>
            {slides.map((s, i) => (
              <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const CARD_HEIGHT = 286;

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: colors.ink,
    ...shadow.lg,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  badge: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FCEFC9',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    color: '#8a6d16',
  },
  inner: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 50,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  accent: {
    color: colors.primary,
  },
  desc: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: 230,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  ctaText: {
    fontSize: FontSize.small,
    fontWeight: Font.black,
    color: colors.ink,
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
});
