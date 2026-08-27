import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Font, FontSize, Gap, radius } from '../../constants/theme';

/**
 * "Continue with Google" button.
 *
 * Follows Google's light-theme sign-in treatment — white surface, #DADCE0 hairline
 * border, #3C4043 label — rather than the app's lime `Button`, because Google's
 * branding guidelines require their own colours and forbid recolouring the mark.
 * The pill radius is kept so it still sits naturally beside the lime buttons.
 */
interface GoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function GoogleButton({
  onPress,
  loading = false,
  disabled = false,
  label = 'Continue with Google',
  style,
}: GoogleButtonProps) {
  const isInactive = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      style={[styles.button, isInactive && styles.inactive, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#3C4043" />
      ) : (
        <View style={styles.content}>
          <Ionicons name="logo-google" size={18} color="#4285F4" />
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Gap.xl,
  },
  inactive: { opacity: 0.45 },
  content: { flexDirection: 'row', alignItems: 'center', gap: Gap.sm },
  label: {
    color: '#3C4043',
    fontSize: FontSize.body,
    fontWeight: Font.bold,
  },
});
