import { View, Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';

const HERO_LIQUID = require('../../assets/hero-liquid.png');

export default function CompanyEvents() {
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  return (
    <View style={styles.container}>
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={columnStyle}>
          <Text style={styles.headerTitle}>My Events</Text>
        </View>
      </View>

      <View style={[styles.body, columnStyle]}>
        <View style={styles.card}>
          <View style={styles.iconBadge}>
            <Text style={styles.emoji}>📅</Text>
          </View>
          <Text style={styles.subtitle}>Phase 3 coming soon</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerTitle: { fontSize: FontSize.display, fontWeight: Font.black, color: colors.ink, letterSpacing: -0.7 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Gap.base },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: Gap.xxl,
    paddingHorizontal: Gap.base,
    alignItems: 'center',
    ...shadow.sm,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.base,
  },
  emoji: { fontSize: 36 },
  subtitle: { fontSize: FontSize.body, color: colors.textSecondary, fontWeight: Font.semibold },
});
