// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  primary: '#1B2CC1',
  accent: '#7BC55A',
  background: '#F0F0F5',
  surface: '#FFFFFF',
  text: '#0D0D0D',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E4E4E7',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#3B82F6',
  // Dark editorial surfaces
  dark: '#0D0F1C',
  darkMid: '#151929',
  darkAccent: '#1E2340',
} as const;

// ─── Vertical brand colors ────────────────────────────────────────────────────

export const verticalColors = {
  unfiltered: '#5B21B6',
  campusCartel: '#047857',
  campus_cartel: '#047857', // backward-compat alias
  irise: '#92400E',
  ibelieve: '#991B1B',
} as const;

// ─── Legacy dark bg exports (kept for backward compat) ───────────────────────

export const DarkBg = '#0D0F1C';
export const DarkBgSecondary = '#151929';

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
  hero: 36,
  display: 28,
  h1: 22,
  h2: 18,
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

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;
