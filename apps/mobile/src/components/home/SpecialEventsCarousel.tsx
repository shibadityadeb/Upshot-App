import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Event } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../constants/theme';

const CARD_WIDTH = 236;
const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

interface Props {
  events: Event[];
  onPressEvent: (id: string) => void;
  /** Page horizontal padding so the first card lines up with the rest. */
  horizontalPadding: number;
}

/**
 * Horizontal "Special Events" discovery row: a photo card with a date badge and
 * optional New badge, then a white body with title, location and coin reward.
 * The next card peeks on the right so users know to swipe.
 */
export function SpecialEventsCarousel({ events, onPressEvent, horizontalPadding }: Props) {
  if (events.length === 0) return null;

  return (
    <FlatList
      data={events}
      keyExtractor={(e) => e.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + Gap.base}
      snapToAlignment="start"
      contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
      ItemSeparatorComponent={() => <View style={{ width: Gap.base }} />}
      renderItem={({ item }) => {
        const isNew = Date.now() - new Date(item.created_at).getTime() < NEW_WINDOW_MS;
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPressEvent(item.id)}
            style={styles.card}
          >
            <View style={styles.photo}>
              {item.banner_url ? (
                <Image source={{ uri: item.banner_url }} style={styles.img} resizeMode="cover" />
              ) : (
                <View style={[styles.img, styles.imgFallback]}>
                  <Text style={styles.fallbackText} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              )}
              <View style={styles.dateChip}>
                <Ionicons name="calendar-outline" size={11} color={colors.ink} />
                <Text style={styles.dateChipText}>
                  {new Date(item.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
              {isNew && (
                <View style={styles.newChip}>
                  <Text style={styles.newChipText}>New</Text>
                </View>
              )}
            </View>

            <View style={styles.body}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.metaRow}>
                <View style={styles.metaLeft}>
                  <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                  <Text style={styles.location} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
                <View style={styles.coin}>
                  <View style={styles.coinDot} />
                  <Text style={styles.coinText}>{item.coin_reward}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.sm,
  },
  photo: {
    height: 128,
    position: 'relative',
    backgroundColor: colors.surfaceAlt,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgFallback: {
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Gap.base,
  },
  fallbackText: {
    color: '#FFFFFF',
    fontSize: FontSize.h3,
    fontWeight: Font.black,
    textAlign: 'center',
  },
  dateChip: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  dateChipText: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    color: colors.ink,
  },
  newChip: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  newChipText: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    color: colors.onPrimary,
  },
  body: {
    padding: 12,
    paddingLeft: 14,
  },
  title: {
    fontSize: FontSize.h3,
    fontWeight: Font.black,
    color: colors.ink,
    marginBottom: 7,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  location: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    fontWeight: Font.semibold,
    flexShrink: 1,
  },
  coin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#E3A017',
    borderWidth: 1,
    borderColor: '#c9881a',
  },
  coinText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: '#92400E',
  },
});
