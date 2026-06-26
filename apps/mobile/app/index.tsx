import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/auth.store';

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) return null;

  if (!user) return <Redirect href="/(auth)/login" />;

  switch (user.role) {
    case 'admin':
      return <Redirect href="/(admin)/dashboard" />;
    case 'company':
      return <Redirect href="/(company)/dashboard" />;
    case 'ambassador':
      return <Redirect href="/(ambassador)/dashboard" />;
    case 'student':
    case 'people':
    default:
      return <Redirect href="/(people)/events" />;
  }
}
