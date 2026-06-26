import type { SupabaseClient } from '@supabase/supabase-js';
import type { WorkforceProfile } from '@upshot/types';

export class WorkforceService {
  constructor(private supabase: SupabaseClient) {}

  async getMyProfile(userId: string): Promise<WorkforceProfile | null> {
    const { data } = await this.supabase
      .from('workforce_profiles')
      .select('*, user:profiles(id, full_name, email, avatar_url, role)')
      .eq('user_id', userId)
      .single();
    return data as unknown as WorkforceProfile | null;
  }

  async upsertProfile(
    userId: string,
    updates: Partial<WorkforceProfile>,
  ): Promise<WorkforceProfile> {
    const { data, error } = await this.supabase
      .from('workforce_profiles')
      .upsert({ user_id: userId, ...updates })
      .select()
      .single();
    if (error) throw error;
    return data as unknown as WorkforceProfile;
  }

  async getAvailableWorkforce(city?: string): Promise<WorkforceProfile[]> {
    let query = this.supabase
      .from('workforce_profiles')
      .select('*, user:profiles(id, full_name, email, avatar_url, role)')
      .eq('is_available', true);
    if (city) query = query.ilike('city', `%${city}%`);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as WorkforceProfile[];
  }
}
