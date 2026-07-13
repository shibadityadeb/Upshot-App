import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, Font } from '../../constants/theme';

const RING_SIZE = 76;

/**
 * Full-screen branded startup loader: a spinning accent arc around the
 * monogram with a pulsing wordmark, on the dark editorial background.
 * Pass `visible={false}` to fade it out; it unmounts itself when done.
 */
export function AppLoader({ visible = true }: { visible?: boolean }) {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    spinLoop.start();
    pulseLoop.start();
    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [spin, pulse]);

  useEffect(() => {
    if (!visible) {
      Animated.timing(fade, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, fade]);

  if (!mounted) return null;

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const wordmarkOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });
  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fade }]} pointerEvents="none">
      <Animated.View style={[styles.ringWrap, { transform: [{ scale: ringScale }] }]}>
        <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
        <Text style={styles.monogram}>U</Text>
      </Animated.View>
      <Animated.Text style={[styles.wordmark, { opacity: wordmarkOpacity }]}>
        UPSHOT
      </Animated.Text>
      <Text style={styles.tagline}>BRAND MEDIA</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RING_SIZE / 2,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.12)',
    borderTopColor: colors.accent,
  },
  monogram: {
    fontSize: 30,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },
  wordmark: {
    fontSize: 22,
    fontWeight: Font.black,
    color: '#FFFFFF',
    letterSpacing: 8,
  },
  tagline: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: Font.semibold,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 4,
  },
});
