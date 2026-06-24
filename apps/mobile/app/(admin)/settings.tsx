import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../src/constants/theme';

export default function AdminSettings() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.emoji}>⚙️</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Phase 3 coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { fontSize: typography.heading3, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
