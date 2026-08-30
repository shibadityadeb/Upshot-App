import { createApiClient } from '@upshot/api-client';

/**
 * The same client the mobile app uses, pointed at the same Supabase project.
 *
 * The credentials are passed explicitly because the shared package falls back
 * to EXPO_PUBLIC_* env names, which Next does not expose to the browser. Session
 * storage resolves to localStorage here — the package only reaches for
 * AsyncStorage when it is actually installed.
 */
let client: ReturnType<typeof createApiClient> | null = null;

export function api() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase credentials. Copy apps/admin/.env.example to .env.local and fill it in.',
    );
  }

  client = createApiClient(url, anonKey);
  return client;
}
