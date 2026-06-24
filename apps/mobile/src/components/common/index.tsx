import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
  type TextInputProps,
  type StyleProp,
} from 'react-native';
import { colors, typography, spacing, radius, shadow } from '../../constants/theme';

// ─── Button ──────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const buttonBg: Record<ButtonVariant, string> = {
  primary: colors.primary,
  secondary: colors.accent,
  outline: 'transparent',
  ghost: 'transparent',
  danger: colors.error,
};

const buttonTextColor: Record<ButtonVariant, string> = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  outline: colors.primary,
  ghost: colors.textSecondary,
  danger: '#FFFFFF',
};

const buttonHeight: Record<ButtonSize, number> = { sm: 36, md: 48, lg: 56 };
const buttonFontSize: Record<ButtonSize, number> = { sm: 13, md: 15, lg: 17 };

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        btnStyles.base,
        {
          backgroundColor: buttonBg[variant],
          height: buttonHeight[size],
          borderRadius: 13,
          opacity: disabled ? 0.5 : 1,
        },
        isOutline && { borderWidth: 1.5, borderColor: colors.primary },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={buttonTextColor[variant]} size="small" />
      ) : (
        <View style={btnStyles.content}>
          {icon}
          <Text
            style={[
              btnStyles.text,
              { color: buttonTextColor[variant], fontSize: buttonFontSize[size] },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const btnStyles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    fontWeight: '700',
  },
});

// ─── Input ───────────────────────────────────────────────

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  autoCapitalize?: TextInputProps['autoCapitalize'];
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  error,
  rightElement,
  style,
  autoCapitalize,
}: InputProps) {
  return (
    <View style={[inputStyles.wrapper, style]}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <View
        style={[
          inputStyles.container,
          error ? { borderColor: colors.error } : undefined,
        ]}
      >
        <TextInput
          style={[inputStyles.input, multiline && { minHeight: (numberOfLines ?? 3) * 20 }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
        />
        {rightElement && <View style={inputStyles.right}>{rightElement}</View>}
      </View>
      {error && <Text style={inputStyles.error}>{error}</Text>}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  right: {
    paddingRight: 12,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
});

// ─── Card ────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function Card({ children, style, onPress }: CardProps) {
  const content = (
    <View style={[cardStyles.base, style]}>{children}</View>
  );
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

const cardStyles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.md,
  },
});

// ─── Badge ───────────────────────────────────────────────

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
}

export function Badge({
  label,
  color = colors.primary,
  bgColor,
  size = 'sm',
}: BadgeProps) {
  const bg = bgColor ?? color + '18';
  const isMd = size === 'md';
  return (
    <View
      style={[
        badgeStyles.base,
        {
          backgroundColor: bg,
          paddingHorizontal: isMd ? 12 : 8,
          paddingVertical: isMd ? 5 : 3,
        },
      ]}
    >
      <Text
        style={[
          badgeStyles.text,
          { color, fontSize: isMd ? 13 : 11 },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});

// ─── StatusBadge ─────────────────────────────────────────

const statusColorMap: Record<string, string> = {
  pending: colors.warning,
  approved: colors.success,
  rejected: colors.error,
  draft: colors.textSecondary,
  completed: colors.primary,
  cancelled: colors.error,
  assigned: colors.info,
  submitted: colors.primary,
  in_progress: colors.warning,
  withdrawn: colors.textSecondary,
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColorMap[status] ?? colors.textSecondary;
  const label = status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  return <Badge label={label} color={color} />;
}

// ─── EmptyState ──────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.title}>{title}</Text>
      {subtitle && <Text style={emptyStyles.subtitle}>{subtitle}</Text>}
      {action && <View style={emptyStyles.action}>{action}</View>}
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  action: {
    marginTop: spacing.lg,
  },
});

// ─── Divider ─────────────────────────────────────────────

export function Divider() {
  return <View style={dividerStyle.line} />;
}

const dividerStyle = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
  },
});
