import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface PressableScaleProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  accessibilityLabel?: string;
}

/** Card wrapper that springs down slightly while pressed. */
export function PressableScale({
  onPress,
  style,
  children,
  accessibilityLabel,
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const springTo = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => springTo(0.975)}
      onPressOut={() => springTo(1)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
