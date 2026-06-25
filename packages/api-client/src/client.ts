import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

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

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export function resetClients(): void {
  supabaseInstance = null;
}
