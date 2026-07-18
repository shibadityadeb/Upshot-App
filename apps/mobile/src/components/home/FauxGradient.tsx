import React from 'react';
import { StyleSheet, View } from 'react-native';

const STEPS = 16;

interface FauxGradientProps {
  /** Which edge of the card the gradient is darkest on. */
  side: 'left' | 'bottom';
  /** Overlay opacity at the dark edge. */
  maxOpacity?: number;
  /** Fraction of the card the gradient covers (0–1). */
  coverage?: number;
}

/**
 * Dark scrim built from stacked translucent strips — expo-linear-gradient
 * is not a dependency of this app, so the ramp is approximated with an
 * eased opacity curve fine enough that banding isn't visible over imagery.
 */
export function FauxGradient({
  side,
  maxOpacity = 0.75,
  coverage = 0.7,
}: FauxGradientProps) {
  const strips = Array.from({ length: STEPS }, (_, i) => {
    const t = i / (STEPS - 1); // 0 at the dark edge
    return Math.pow(1 - t, 1.6) * maxOpacity;
  });
  if (side === 'bottom') strips.reverse();

  return (
    <View
      pointerEvents="none"
      style={
        side === 'left'
          ? [styles.left, { width: `${coverage * 100}%` }]
          : [styles.bottom, { height: `${coverage * 100}%` }]
      }
    >
      {strips.map((opacity, i) => (
        <View
          key={i}
          style={{ flex: 1, backgroundColor: `rgba(8,8,8,${opacity.toFixed(3)})` }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  left: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
});
