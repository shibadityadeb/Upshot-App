import type { Config } from 'tailwindcss';

/**
 * Mirrors apps/mobile/src/constants/theme.ts so the portal and the app read as
 * one product. Lime is a background only — text on it is always ink, never
 * white and never lime.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: '#A6CE39',
          dark: '#8FB82E',
          tint: '#EEF6D6',
        },
        ink: {
          DEFAULT: '#0E0E0E',
          soft: '#1A1D1E',
          mid: '#26292A',
        },
        canvas: '#F6F6F1',
        surface: '#FFFFFF',
        surfaceAlt: '#F1F1EC',
        muted: '#5F6660',
        faint: '#9AA09A',
        line: '#E7E7E0',
        lineStrong: '#D8D8CF',
        danger: '#E5484D',
        ok: '#3E9B4F',
        warn: '#E5941B',
        info: '#3B82F6',
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(26,29,30,0.05)',
        lift: '0 4px 14px rgba(26,29,30,0.07)',
      },
    },
  },
  plugins: [],
};

export default config;
