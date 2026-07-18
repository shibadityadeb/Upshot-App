import { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, Font, FontSize } from '../../constants/theme';
import { useErrorStore } from '../../store/error.store';

/**
 * Global user-facing error dialog. Mounted once in the root layout;
 * triggered from anywhere via showError() in src/store/error.store.
 */
export function ErrorPopup() {
  const visible = useErrorStore((s) => s.visible);
  const title = useErrorStore((s) => s.title);
  const message = useErrorStore((s) => s.message);
  const onRetry = useErrorStore((s) => s.onRetry);
  const hide = useErrorStore((s) => s.hide);

  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.92);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scale, opacity]);

  const handleRetry = () => {
    const retry = onRetry;
    hide();
    retry?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hide}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
          <View style={styles.iconWrap}>
            <Ionicons name="alert-circle-outline" size={30} color={colors.error} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {onRetry ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleRetry} activeOpacity={0.8}>
              <Text style={styles.primaryBtnText}>Try Again</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={onRetry ? styles.secondaryBtn : styles.primaryBtn}
            onPress={hide}
            activeOpacity={0.8}
          >
            <Text style={onRetry ? styles.secondaryBtnText : styles.primaryBtnText}>
              {onRetry ? 'Dismiss' : 'Okay, Got It'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(13, 15, 28, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  primaryBtn: {
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 9999,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: Font.bold,
  },
  secondaryBtn: {
    alignSelf: 'stretch',
    height: 44,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: Font.medium,
  },
});
