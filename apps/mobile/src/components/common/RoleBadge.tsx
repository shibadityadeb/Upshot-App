import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, Font } from '../../constants/theme';

/**
 * Single source of truth for how a person's category is labelled and coloured.
 *
 * A profile shows one of two categories: Community Member or Client. Students,
 * ambassadors and hosts are all community members — those are things a member
 * does, not separate kinds of account — so they share one label rather than
 * each carrying their own. Admin stays distinct because it marks Upshot staff
 * rather than a customer category.
 *
 * None of these pairings put white or lime on lime — each carries its own tint
 * and ink.
 */
const COMMUNITY_MEMBER = {
  label: 'Community Member',
  bg: colors.surfaceAlt,
  fg: colors.textSecondary,
};

export const ROLE_BADGE: Record<string, { label: string; bg: string; fg: string }> = {
  admin: { label: 'Admin', bg: '#EDE9FE', fg: '#5B21B6' },
  company: { label: 'Client', bg: '#CCFBF1', fg: '#0F766E' },
  people: COMMUNITY_MEMBER,
  student: COMMUNITY_MEMBER,
  ambassador: COMMUNITY_MEMBER,
  host: COMMUNITY_MEMBER,
};

export function roleBadgeMeta(role: string | undefined | null) {
  return ROLE_BADGE[role ?? ''] ?? COMMUNITY_MEMBER;
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
