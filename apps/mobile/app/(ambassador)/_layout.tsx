import { Stack } from 'expo-router';

export default function AmbassadorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="referrals" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
