import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaClient } from '@upshot/database';

let supabaseInstance: SupabaseClient | null = null;
let prismaInstance: PrismaClient | null = null;

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

export function getPrismaClient(): PrismaClient {
  if (prismaInstance) return prismaInstance;
  prismaInstance = new PrismaClient();
  return prismaInstance;
}

export function resetClients(): void {
  supabaseInstance = null;
  if (prismaInstance) {
    prismaInstance.$disconnect();
    prismaInstance = null;
  }
}
