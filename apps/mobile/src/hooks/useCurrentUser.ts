import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/auth.store';

export function useCurrentUser() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { user, isLoading };
}

/**
 * Imperative auth gate for screens outside a guarded route group.
 *
 * Keyed on `status`, never on a bare null user: redirecting while the persisted
 * session is still being restored is what sent signed-in people to the login
 * screen. Route groups are guarded declaratively in their `_layout`; prefer that.
 */
export function useRequireAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/(auth)/login');
    }
  }, [status, router]);

  return { user, status, isReady: status !== 'loading' };
}
