import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, Font } from '../constants/theme';

// The tab bar's content (icons + labels) needs ~56pt. The old layouts hardcoded
// height: 66 / paddingBottom: 10 and never read the device safe-area, so on
// Android phones with a gesture/home-indicator bar the system inset ate the
// bottom padding and clipped the labels — the Play Store cut-off bug. Growing
// the bar by the real inset keeps the whole bar above the system navigation on
// every device while staying identical (66 / 10) where there is no inset.
const CONTENT_HEIGHT = 56;
const MIN_PADDING_BOTTOM = 10;

/** Inset-aware tab bar style — single source of truth for all role layouts. */
export function useTabBarStyle() {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(MIN_PADDING_BOTTOM, insets.bottom);
  return {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: CONTENT_HEIGHT + paddingBottom,
    paddingBottom,
    paddingTop: 8,
  };
}

export const TAB_LABEL_STYLE = {
  fontSize: 10,
  fontWeight: Font.bold,
  letterSpacing: 0.3,
  marginTop: 3,
} as const;
