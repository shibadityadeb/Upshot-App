import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/auth.store';

export function useCurrentUser() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { user, isLoading };
}

export function useRequireAuth() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/(auth)/login');
    }
  }, [isInitialized, user, router]);

  return { user, isInitialized };
}
