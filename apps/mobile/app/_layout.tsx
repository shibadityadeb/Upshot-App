import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../src/store/auth.store';

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="(company)" options={{ headerShown: false }} />
      <Stack.Screen name="(people)" options={{ headerShown: false }} />
      <Stack.Screen name="(ambassador)" options={{ headerShown: false }} />
      <Stack.Screen name="(shared)" options={{ headerShown: false }} />
    </Stack>
  );
}
