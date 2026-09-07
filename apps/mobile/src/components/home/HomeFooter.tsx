import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  colors,
  Font,
  FontSize,
  Gap,
  radius,
  shadow,
  Tracking,
} from '../../constants/theme';

const WEBSITE_URL = 'https://www.upshotbrandmedia.com/';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/** Social destinations, in the order they appear. Edit here to add/remove. */
const SOCIAL_LINKS: { key: string; label: string; icon: IoniconName; url: string }[] = [
  { key: 'website', label: 'Website', icon: 'globe', url: WEBSITE_URL },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: 'logo-linkedin',
    url: 'https://www.linkedin.com/company/upshotbrandmediallp/',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: 'logo-instagram',
    url: 'https://www.instagram.com/upshotbrandmedia',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: 'logo-youtube',
    url: 'https://www.youtube.com/@upshotbrandmedia',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'logo-facebook',
    url: 'https://www.facebook.com/Upshotbrandmediallp',
  },
];

async function openExternal(url: string) {
  try {
    await Linking.openURL(url);
  } catch (e) {
    console.warn('Could not open link', url, e);
  }
}

interface HomeFooterProps {
  /** Horizontal padding — passed in so it stays in step with the screen's sections. */
  paddingHorizontal: number;
}

/**
 * Closes the Home screen. Mirrors the hero's tone at a lower volume: an
 * uppercase eyebrow, an ink pill leading out to the website, and the social
 * row underneath. Ink rather than lime for the pill so it does not compete
 * with the lime "Get started" button sitting directly above it.
 */
export function HomeFooter({ paddingHorizontal }: HomeFooterProps) {
  const year = new Date().getFullYear();

  return (
    <View style={[styles.root, { paddingHorizontal }]}>
      <Text style={styles.eyebrow}>UPSHOT BRAND MEDIA</Text>

      <Text style={styles.headline}>
        Campaigns, communities and conversations across India.
      </Text>

      <Pressable
        onPress={() => openExternal(WEBSITE_URL)}
        accessibilityRole="link"
        accessibilityLabel="See our work on upshotbrandmedia.com"
        accessibilityHint="Opens the Upshot Brand Media website in your browser"
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
      >
        <Text style={styles.ctaText}>See our work</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.surface} />
      </Pressable>

      <View style={styles.socialRow}>
        {SOCIAL_LINKS.map((link) => (
          <Pressable
            key={link.key}
            onPress={() => openExternal(link.url)}
            accessibilityRole="link"
            accessibilityLabel={`Upshot on ${link.label}`}
            accessibilityHint={`Opens ${link.label} in your browser`}
            hitSlop={4}
            style={({ pressed }) => [styles.socialBtn, pressed && styles.socialBtnPressed]}
          >
            {({ pressed }) => (
              <Ionicons
                name={link.icon}
                size={18}
                color={pressed ? colors.ink : colors.inkSoft}
              />
            )}
          </Pressable>
        ))}
      </View>

      <Text style={styles.legal}>
        © {year} Upshot Brand Media LLP · Made in India
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: Gap.xl,
    paddingBottom: Gap.base,
  },
  eyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  headline: {
    marginTop: Gap.sm,
    fontSize: FontSize.h2,
    lineHeight: 26,
    fontWeight: Font.black,
    letterSpacing: -0.4,
    color: colors.ink,
    maxWidth: 320,
  },
  // Same geometry as the lime "Get started" pill above it, in ink so the two
  // read as a pair rather than a repeat.
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    height: 42,
    paddingHorizontal: Gap.lg,
    borderRadius: radius.full,
    backgroundColor: colors.ink,
    alignSelf: 'flex-start',
    marginTop: Gap.base,
    ...shadow.sm,
  },
  ctaPressed: {
    backgroundColor: colors.darkAccent,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.surface,
    letterSpacing: Tracking.wide,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    marginTop: Gap.xl,
  },
  socialBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  socialBtnPressed: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
    transform: [{ scale: 0.94 }],
  },
  legal: {
    marginTop: Gap.lg,
    fontSize: FontSize.xs,
    color: colors.textLight,
    fontWeight: Font.medium,
  },
});
