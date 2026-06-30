import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, Font, FontSize, Gap, radius } from '../../constants/theme';

interface Props {
  segments: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function SegmentedControl({ segments, activeIndex, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {segments.map((seg, i) => (
        <TouchableOpacity
          key={seg}
          style={[styles.pill, i === activeIndex && styles.pillActive]}
          onPress={() => onChange(i)}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, i === activeIndex && styles.labelActive]}>{seg}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.sm,
    gap: Gap.sm,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.surface,
  },
});
