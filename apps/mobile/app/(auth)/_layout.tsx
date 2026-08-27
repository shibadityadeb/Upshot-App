import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  // Hold while the persisted session is still being restored. Redirecting here
  // on a not-yet-populated user is what bounced signed-in people to the login
  // screen; the root layout shows the splash overlay meanwhile.
  if (status === 'loading') return null;


  if (user) return <Redirect href="/" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="register-host" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
