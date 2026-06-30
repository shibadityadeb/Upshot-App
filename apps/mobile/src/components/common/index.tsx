import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
  type TextInputProps,
  type StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Vertical, ContentPost, Event } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../constants/theme';

// ─── Button ──────────────────────────────────────────────────────────────────

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
const buttonFontSize: Record<ButtonSize, number> = { sm: 13, md: 15, lg: 16 };

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
  const isInactive = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.75}
      style={[
        btnStyles.base,
        {
          backgroundColor: buttonBg[variant],
          height: buttonHeight[size],
          borderRadius: 10,
          opacity: isInactive ? 0.5 : 1,
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
              {
                color: buttonTextColor[variant],
                fontSize: buttonFontSize[size],
                letterSpacing: 0.3,
              },
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
    paddingHorizontal: Gap.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
  },
  text: {
    fontWeight: Font.bold,
  },
});

// ─── Input ───────────────────────────────────────────────────────────────────

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
          placeholderTextColor={colors.textLight}
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
    marginBottom: Gap.base,
  },
  label: {
    fontSize: FontSize.small,
    fontWeight: Font.medium,
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
    fontSize: FontSize.body,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  right: {
    paddingRight: 12,
  },
  error: {
    fontSize: FontSize.xs,
    color: colors.error,
    marginTop: 4,
  },
});

// ─── Card ─────────────────────────────────────────────────────────────────────

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
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
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
    borderWidth: 0.5,
    borderColor: colors.border,
    ...shadow.md,
  },
});

// ─── Badge ───────────────────────────────────────────────────────────────────

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
          { color, fontSize: isMd ? FontSize.small : FontSize.xs, letterSpacing: 0.3 },
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
    fontWeight: Font.semibold,
  },
});

// ─── StatusBadge ─────────────────────────────────────────────────────────────

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

// ─── SectionHeader ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  titleStyle?: StyleProp<TextStyle>;
  action?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  titleStyle,
  action,
  actionLabel = 'See all',
  onAction,
}: SectionHeaderProps) {
  return (
    <View style={shStyles.wrapper}>
      <View style={shStyles.left}>
        <Text style={[shStyles.title, titleStyle]}>{title}</Text>
        {subtitle ? <Text style={shStyles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action && onAction ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={shStyles.action}>{actionLabel} →</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const shStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  action: {
    fontSize: FontSize.small,
    color: colors.primary,
    fontWeight: Font.semibold,
    marginTop: 2,
  },
});

// ─── VerticalCard ─────────────────────────────────────────────────────────────

interface VerticalCardProps {
  vertical: Vertical;
  onPress: () => void;
  width?: number;
}

export function VerticalCard({ vertical, onPress, width = 112 }: VerticalCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[vcStyles.card, { width, backgroundColor: vertical.color }]}
    >
      {/* Subtle depth circle */}
      <View style={vcStyles.circle} />
      {/* Name */}
      <Text style={vcStyles.name} numberOfLines={2}>{vertical.name}</Text>
      {/* Arrow at bottom right */}
      <Text style={vcStyles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const vcStyles = StyleSheet.create({
  card: {
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 14,
    justifyContent: 'space-between',
  },
  circle: {
    position: 'absolute',
    bottom: -18,
    right: -18,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  name: {
    fontSize: 14,
    fontWeight: Font.bold,
    color: '#FFFFFF',
    lineHeight: 19,
  },
  // unused but kept for type compat
  bottomZone: {},
  separator: {},
  tagline: {},
  topZone: {},
  arrow: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: Font.bold,
    textAlign: 'right',
    marginTop: 4,
  },
});

// ─── ContentCard ─────────────────────────────────────────────────────────────

interface ContentCardProps {
  post: ContentPost;
  verticalColor?: string;
  onPress: () => void;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return '';
  }
}

export function ContentCard({ post, verticalColor = colors.primary, onPress }: ContentCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[ccStyles.card, { borderLeftColor: verticalColor }]}
    >
      {post.cover_url ? (
        <Image
          source={{ uri: post.cover_url }}
          style={ccStyles.cover}
          resizeMode="cover"
        />
      ) : null}
      <View style={ccStyles.body}>
        <View style={[ccStyles.typeChip, { backgroundColor: verticalColor + '1F' }]}>
          <Text style={[ccStyles.typeText, { color: verticalColor }]}>
            {post.content_type.replace(/_/g, ' ').toUpperCase()}
          </Text>
        </View>
        <Text style={ccStyles.title} numberOfLines={2}>{post.title}</Text>
        {post.speaker_name ? (
          <Text style={ccStyles.speaker}>with {post.speaker_name}</Text>
        ) : null}
        <View style={ccStyles.footer}>
          <Text style={ccStyles.date}>{formatDate(post.published_at)}</Text>
          <Text style={ccStyles.readMore}>Read →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const ccStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 3,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: colors.border,
    ...shadow.md,
  },
  cover: {
    width: '100%',
    height: 140,
  },
  body: {
    padding: 14,
  },
  typeChip: {
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: FontSize.micro,
    fontWeight: Font.semibold,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 15,
    fontWeight: Font.bold,
    color: colors.text,
    marginTop: 8,
    lineHeight: 21,
  },
  speaker: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
  readMore: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: Font.semibold,
  },
});

// ─── OpportunityCard ─────────────────────────────────────────────────────────

interface OpportunityCardProps {
  event: Event & { vertical?: { color: string }; company?: { name: string; is_verified?: boolean } };
  onPress: () => void;
  onApply: () => void;
  hasApplied: boolean;
  isApplying?: boolean;
}

export function OpportunityCard({
  event,
  onPress,
  onApply,
  hasApplied,
  isApplying = false,
}: OpportunityCardProps) {
  const accentColor = (event.vertical?.color) ?? colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[ocStyles.card, { borderLeftColor: accentColor }]}
    >
      <View style={ocStyles.row1}>
        <View style={[ocStyles.categoryChip, { backgroundColor: accentColor + '1F' }]}>
          <Text style={[ocStyles.categoryText, { color: accentColor }]}>
            {event.category}
          </Text>
        </View>
        <View style={ocStyles.coinPill}>
          <Ionicons name="diamond-outline" size={11} color="#92400E" />
          <Text style={ocStyles.coinText}>{event.coin_reward}</Text>
        </View>
      </View>

      <Text style={ocStyles.title} numberOfLines={2}>{event.title}</Text>

      {event.company?.name ? (
        <View style={ocStyles.companyRow}>
          <Text style={ocStyles.companyName}>{event.company.name}</Text>
          {event.company.is_verified ? (
            <>
              <Text style={ocStyles.dot}> · </Text>
              <Text style={ocStyles.verified}>Verified</Text>
            </>
          ) : null}
        </View>
      ) : null}

      <View style={ocStyles.metaRow}>
        <Ionicons name="location-outline" size={12} color={colors.textLight} />
        <Text style={ocStyles.meta}>{event.location}</Text>
        <Text style={ocStyles.metaDot}>·</Text>
        <Ionicons name="calendar-outline" size={12} color={colors.textLight} />
        <Text style={ocStyles.meta}>
          {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </Text>
      </View>

      <View style={ocStyles.footer}>
        <Text style={ocStyles.applied}>{event.current_attendees ?? 0} applied</Text>
        {hasApplied ? (
          <View style={ocStyles.appliedBtn}>
            <Text style={ocStyles.appliedBtnText}>Applied ✓</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={ocStyles.applyBtn}
            onPress={onApply}
            activeOpacity={0.8}
            disabled={isApplying}
          >
            {isApplying ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={ocStyles.applyBtnText}>Apply now</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const ocStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderLeftWidth: 4,
    paddingTop: 14,
    paddingRight: 14,
    paddingBottom: 14,
    paddingLeft: 18,
    borderWidth: 0.5,
    borderColor: colors.border,
    ...shadow.md,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryChip: {
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
    letterSpacing: 0.3,
  },
  coinPill: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: '#92400E',
  },
  title: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    marginTop: 8,
    lineHeight: 22,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  companyName: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
  },
  dot: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
  },
  verified: {
    fontSize: FontSize.xs,
    color: colors.success,
    fontWeight: Font.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  meta: {
    fontSize: 12,
    color: colors.textLight,
  },
  metaDot: {
    fontSize: 12,
    color: colors.textLight,
    marginHorizontal: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  applied: {
    fontSize: 12,
    color: colors.textLight,
  },
  applyBtn: {
    height: 34,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: FontSize.small,
    color: '#FFFFFF',
    fontWeight: Font.bold,
  },
  appliedBtn: {
    height: 34,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.success + '1F',
    borderWidth: 1,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedBtnText: {
    fontSize: FontSize.small,
    color: colors.success,
    fontWeight: Font.semibold,
  },
});

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: string;
  onPress?: () => void;
}

export function StatCard({
  label,
  value,
  color = colors.primary,
  icon,
  onPress,
}: StatCardProps) {
  const inner = (
    <View style={[scStyles.card, { borderLeftColor: color }]}>
      {icon ? <Text style={scStyles.icon}>{icon}</Text> : null}
      <Text style={[scStyles.value, { color }]}>{value}</Text>
      <Text style={scStyles.label}>{label}</Text>
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1 }}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
}

const scStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 3.5,
    paddingTop: 14,
    paddingRight: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    borderWidth: 0.5,
    borderColor: colors.border,
    flex: 1,
  },
  icon: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontSize: 20,
  },
  value: {
    fontSize: 26,
    fontWeight: Font.black,
    lineHeight: 30,
  },
  label: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    fontWeight: Font.medium,
    marginTop: 2,
  },
});

// ─── EmptyState ───────────────────────────────────────────────────────────────

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  /** Ionicons icon name */
  iconName?: IoniconName;
  /** Emoji fallback icon */
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ iconName, icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <View style={emptyStyles.container}>
      {iconName ? (
        <Ionicons name={iconName} size={36} color={colors.textSecondary} style={{ marginBottom: 12 }} />
      ) : icon ? (
        <Text style={emptyStyles.icon}>{icon}</Text>
      ) : null}
      <Text style={emptyStyles.title}>{title}</Text>
      {subtitle ? (
        <Text style={emptyStyles.subtitle}>{subtitle}</Text>
      ) : null}
      {action ? <View style={emptyStyles.action}>{action}</View> : null}
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 4,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 36,
    marginBottom: 12,
  },
  title: {
    fontSize: FontSize.h3,
    fontWeight: Font.semibold,
    color: colors.text,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 22,
    maxWidth: 260,
  },
  action: {
    marginTop: 16,
  },
});

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider() {
  return <View style={dividerStyle.line} />;
}

const dividerStyle = StyleSheet.create({
  line: {
    height: 0.5,
    backgroundColor: colors.border,
    width: '100%',
  },
});

// ─── AvatarCircle ─────────────────────────────────────────────────────────────

const AVATAR_BG = ['#EDE9FE', '#D1FAE5', '#FEF3C7', '#FEE2E2', '#DBEAFE', '#FCE7F3'];
const AVATAR_TEXT = ['#6D28D9', '#065F46', '#92400E', '#991B1B', '#1E40AF', '#9D174D'];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = name.charCodeAt(i) + ((h << 5) - h);
  }
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

interface AvatarCircleProps {
  name: string;
  size?: number;
  bgColor?: string;
  textColor?: string;
}

export function AvatarCircle({ name, size = 44, bgColor, textColor }: AvatarCircleProps) {
  const idx = hashName(name) % AVATAR_BG.length;
  const bg = bgColor ?? AVATAR_BG[idx];
  const tc = textColor ?? AVATAR_TEXT[idx];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: tc, fontSize: Math.round(size * 0.38), fontWeight: Font.bold }}>
        {initials(name)}
      </Text>
    </View>
  );
}

// ─── CoinBadge ────────────────────────────────────────────────────────────────

export function CoinBadge({ amount }: { amount: number }) {
  return (
    <View style={coinBadgeStyle.pill}>
      <Ionicons name="diamond-outline" size={11} color="#92400E" />
      <Text style={coinBadgeStyle.text}>{amount} coins</Text>
    </View>
  );
}

const coinBadgeStyle = StyleSheet.create({
  pill: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: Font.semibold,
  },
});

// ─── RoleTag ──────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  admin: '#8B5CF6',
  company: '#0D9488',
  people: '#1B2CC1',
  student: '#22C55E',
  ambassador: '#F59E0B',
};

export function RoleTag({ role }: { role: string }) {
  const color = ROLE_COLORS[role] ?? colors.textSecondary;
  const label = role.charAt(0).toUpperCase() + role.slice(1);
  return <Badge label={label} color={color} />;
}

// ─── LoadingScreen ────────────────────────────────────────────────────────────

const LOGO = require('../../../assets/logo.png') as number;

export function LoadingScreen() {
  return (
    <View style={loadingStyle.container}>
      <Image source={LOGO} style={loadingStyle.logo} resizeMode="contain" />
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
    </View>
  );
}

const loadingStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logo: {
    width: 160,
    height: 52,
  },
});
