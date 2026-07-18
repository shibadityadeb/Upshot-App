// ─── Colors ──────────────────────────────────────────────────────────────────
//
// UPSHOT / UBM brand — light editorial theme with lime-green accent.
// Sourced from the website: bright lime accent, near-black ink, clean
// off-white surfaces, generous rounding. No full-black backgrounds.

export const colors = {
  /** Brand accent — lime green. Use black text on top of it. */
  primary: '#A6CE39',
  primaryDark: '#8FB82E',
  primaryTint: '#EEF6D6',
  /** Text/ink color to place ON the lime primary. */
  onPrimary: '#0E0E0E',

  /** Editorial ink — the near-black used for headlines & dark chips. */
  ink: '#0E0E0E',
  inkSoft: '#1A1D1E',

  /** Secondary accent kept for backward-compat (was a muted green). */
  accent: '#0E0E0E',

  background: '#F6F6F1',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F1EC',
  text: '#0E0E0E',
  textSecondary: '#5F6660',
  textLight: '#9AA09A',
  border: '#E7E7E0',
  borderStrong: '#D8D8CF',

  error: '#E5484D',
  success: '#3E9B4F',
  warning: '#E5941B',
  info: '#3B82F6',

  // Dark editorial surfaces (used sparingly for contrast chips/overlays)
  dark: '#0E0E0E',
  darkMid: '#1A1D1E',
  darkAccent: '#26292A',

  // Campus Cartel brand
  campusCartelGreen: '#3E9B4F',
  campusCartelTint: '#E4F3E5',
  campusCartelText: '#2C6E38',
} as const;

// ─── Vertical brand colors ────────────────────────────────────────────────────

export const verticalColors = {
  unfiltered: '#5B21B6',
  campusCartel: '#3E9B4F',
  campus_cartel: '#3E9B4F', // backward-compat alias
  irise: '#92400E',
  ibelieve: '#991B1B',
  // Campus Cartel brand
  campusCartelGreen: '#3E9B4F',
  campusCartelTint: '#E4F3E5',
  campusCartelText: '#2C6E38',
} as const;

// ─── Legacy dark bg exports (kept for backward compat) ───────────────────────

export const DarkBg = '#0E0E0E';
export const DarkBgSecondary = '#1A1D1E';

// ─── Typography scale ─────────────────────────────────────────────────────────

/** Legacy numeric scale — kept for existing screens */
export const typography = {
  heading1: 28,
  heading2: 24,
  heading3: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,
} as const;

/** New semantic font-size scale */
export const FontSize = {
  hero: 40,
  display: 30,
  h1: 24,
  h2: 19,
  h3: 16,
  body: 14,
  small: 13,
  xs: 11,
  micro: 10,
} as const;

/** Font-weight tokens */
export const Font = {
  black: '900' as const,
  bold: '700' as const,
  semibold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,
};

/** Letter-spacing tokens — editorial uppercase eyebrows use `eyebrow`. */
export const Tracking = {
  tight: -0.6,
  normal: 0,
  wide: 0.3,
  eyebrow: 1.8,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

/** Legacy spacing — kept for existing screens */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** New semantic gap scale */
export const Gap = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────
//
// Website uses generous rounding on cards/panels and full pills on buttons.

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 28,
  full: 9999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadow = {
  sm: {
    shadowColor: '#1A1D1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#1A1D1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  lg: {
    shadowColor: '#1A1D1E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;
