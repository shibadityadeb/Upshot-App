import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useAuthStore } from '../src/store/auth.store';
import { colors } from '../src/constants/theme';

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Replaces expo-router's default error UI (the blue retry icon).
 * Must accept { error, retry } props per expo-router v5 contract.
 */
export function ErrorBoundary({ retry }: { error: Error; retry: () => void }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Must return null (not a View) while uninitialised —
  // expo-router layouts can only return a navigator or null.
  if (!isInitialized) return null;

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(company)" options={{ headerShown: false }} />
        <Stack.Screen name="(people)" options={{ headerShown: false }} />
        <Stack.Screen name="(ambassador)" options={{ headerShown: false }} />
        <Stack.Screen name="(shared)" options={{ headerShown: false }} />
        <Stack.Screen name="campus-cartel-apply" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
