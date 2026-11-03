import React from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Event banner that never crops: the full image is shown with `contain`,
 * over a blurred, zoomed copy of itself that fills the leftover space.
 * `insetTop` keeps the sharp image clear of e.g. the status bar.
 */
export function EventBanner({
  uri,
  height,
  insetTop = 0,
  style,
}: {
  uri: string;
  height: number;
  insetTop?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.wrap, { height }, style]}>
      <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" blurRadius={24} />
      <View style={[StyleSheet.absoluteFill, styles.dim]} />
      <Image source={{ uri }} style={[StyleSheet.absoluteFill, { top: insetTop }]} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#1A1D1E',
  },
  dim: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});
