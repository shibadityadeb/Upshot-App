import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, Font } from '../../constants/theme';

/**
 * Single source of truth for how a person's role is labelled and coloured.
 *
 * Shared so "who is an ambassador and who is a student" reads identically
 * wherever a person appears. None of these pairings put white or lime on lime —
 * each carries its own tint and ink.
 */
export const ROLE_BADGE: Record<string, { label: string; bg: string; fg: string }> = {
  ambassador: { label: 'Ambassador', bg: '#FEF3C7', fg: '#92400E' },
  student: { label: 'Student', bg: '#D1FAE5', fg: '#065F46' },
  host: { label: 'Host', bg: '#EDE9FE', fg: '#5B21B6' },
  admin: { label: 'Admin', bg: '#EDE9FE', fg: '#5B21B6' },
  company: { label: 'Company', bg: '#CCFBF1', fg: '#0F766E' },
  people: { label: 'Member', bg: colors.surfaceAlt, fg: colors.textSecondary },
};

export function roleBadgeMeta(role: string | undefined | null) {
  return ROLE_BADGE[role ?? ''] ?? ROLE_BADGE.people;
}

interface RoleBadgeProps {
  role: string | undefined | null;
  /** 'sm' for dense lists, 'md' for profile headers. */
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function RoleBadge({ role, size = 'sm', style }: RoleBadgeProps) {
  const meta = roleBadgeMeta(role);
  const isMd = size === 'md';
  return (
    <View
      style={[
        styles.badge,
        isMd ? styles.badgeMd : styles.badgeSm,
        { backgroundColor: meta.bg },
        style,
      ]}
    >
      <Text style={[styles.text, isMd ? styles.textMd : styles.textSm, { color: meta.fg }]}>
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 6, alignSelf: 'flex-start' },
  badgeSm: { paddingHorizontal: 7, paddingVertical: 2 },
  badgeMd: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  text: { fontWeight: Font.bold, letterSpacing: 0.4, textTransform: 'uppercase' },
  textSm: { fontSize: 9 },
  textMd: { fontSize: 11 },
});
