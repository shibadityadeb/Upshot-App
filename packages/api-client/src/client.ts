import { createClient, SupabaseClient, SupportedStorage } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * React Native has no `window.localStorage`, so supabase-js falls back to an
 * in-memory store and the session is lost every time the JS context restarts.
 * AsyncStorage is already a dependency of the mobile app; resolve it lazily so
 * this package keeps working in Node (scripts, type-checking) where it is absent.
 */
function resolveStorage(): SupportedStorage | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@react-native-async-storage/async-storage');
    return (mod.default ?? mod) as SupportedStorage;
  } catch {
    return undefined;
  }
}

export function getSupabaseClient(
  url?: string,
  anonKey?: string,
): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = url ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = anonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase credentials. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  const storage = resolveStorage();

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Persist to AsyncStorage on device so the session survives an app restart.
      ...(storage ? { storage } : {}),
      persistSession: true,
      autoRefreshToken: true,
      // There is no browser URL to read a session out of; deep links are handled
      // explicitly by AuthService.completeAuthFromUrl().
      detectSessionInUrl: false,
    },
  });
  return supabaseInstance;
}

export function resetClients(): void {
  supabaseInstance = null;
}
