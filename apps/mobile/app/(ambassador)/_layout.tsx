import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';

export default function AmbassadorLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== 'ambassador') return <Redirect href="/" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="referrals" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
