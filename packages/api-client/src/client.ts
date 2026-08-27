import { createClient, SupabaseClient, SupportedStorage } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Persistent storage for the auth session.
 *
 * Without this, supabase-js checks `supportsLocalStorage()`, finds no
 * `window.localStorage` in React Native, and silently falls back to an
 * in-memory store — so the refresh token never reaches disk and every JS
 * restart (app relaunch, Fast Refresh, dev reload) begins signed out.
 *
 * Resolved lazily so this package still works under Node, where AsyncStorage
 * is absent — type-checking, scripts and the web export must not require it.
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

let sessionPersistenceEnabled = false;

/**
 * Whether the auth session is backed by real storage rather than memory.
 *
 * Exposed so the app can say so out loud at startup: falling back to memory is
 * silent, and the only symptom is users being signed out on every restart —
 * exactly the bug this guards against regressing.
 */
export function isSessionPersistenceEnabled(): boolean {
  return sessionPersistenceEnabled;
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
  sessionPersistenceEnabled = !!storage;

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Omitted entirely off-device so supabase-js keeps its own default.
      ...(storage ? { storage } : {}),
      persistSession: true,
      // Refreshes the access token before expiry. Paired with AppState in the
      // app layer (see auth.store) so the timer follows foreground/background.
      autoRefreshToken: true,
      // There is no browser URL to read a session out of; auth deep links are
      // handled explicitly by AuthService.completeAuthFromUrl().
      detectSessionInUrl: false,
    },
  });
  return supabaseInstance;
}

export function resetClients(): void {
  supabaseInstance = null;
}
