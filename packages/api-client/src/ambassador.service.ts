import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse, Ambassador, Student, AmbassadorTier } from '@upshot/types';

export class AmbassadorService {
  constructor(private supabase: SupabaseClient) {}

  async getMyAmbassadorProfile(userId: string): Promise<ApiResponse<Ambassador>> {
    const { data, error } = await this.supabase
      .from('ambassadors')
      .select('*, profiles(*)')
      .eq('user_id', userId)
      .single();
    if (error || !data) return { data: null, error: { code: 'NOT_FOUND', message: 'Ambassador not found' } };
    return { data: data as unknown as Ambassador, error: null };
  }

  async getAllAmbassadors(): Promise<ApiResponse<Ambassador[]>> {
    const { data, error } = await this.supabase
      .from('ambassadors')
      .select('*, profiles(*)')
      .order('total_coins_earned', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Ambassador[], error: null };
  }

  async createAmbassador(userId: string, fullName: string): Promise<ApiResponse<Ambassador>> {
    const { data: codeData, error: rpcError } = await this.supabase.rpc('generate_referral_code', {
      full_name: fullName,
    });
    if (rpcError) return { data: null, error: { code: 'RPC_FAILED', message: rpcError.message } };
    const referralCode = codeData as string;

    const { data, error } = await this.supabase
      .from('ambassadors')
      .insert({
        user_id: userId,
        referral_code: referralCode,
        referral_count: 0,
        total_coins_earned: 0,
        tier: 'bronze',
        is_active: true,
      })
      .select('*, profiles(*)')
      .single();
    if (error) return { data: null, error: { code: 'CREATE_FAILED', message: error.message } };

    await this.supabase.from('profiles').update({ role: 'ambassador' }).eq('id', userId);

    return { data: data as unknown as Ambassador, error: null };
  }

  async validateReferralCode(code: string): Promise<ApiResponse<{ valid: boolean; ambassador_id: string | null }>> {
    const { data, error } = await this.supabase
      .from('ambassadors')
      .select('id')
      .eq('referral_code', code)
      .eq('is_active', true)
      .single();
    if (error || !data) return { data: { valid: false, ambassador_id: null }, error: null };
    return { data: { valid: true, ambassador_id: data.id }, error: null };
  }

  async updateAmbassadorTier(ambassadorId: string): Promise<ApiResponse<Ambassador>> {
    const { data: current, error: fetchError } = await this.supabase
      .from('ambassadors')
      .select('total_coins_earned')
      .eq('id', ambassadorId)
      .single();
    if (fetchError || !current) return { data: null, error: { code: 'NOT_FOUND', message: 'Ambassador not found' } };

    const earned = current.total_coins_earned;
    let tier: AmbassadorTier;
    if (earned >= 10000) tier = 'platinum';
    else if (earned >= 5000) tier = 'gold';
    else if (earned >= 2000) tier = 'silver';
    else tier = 'bronze';

    const { data, error } = await this.supabase
      .from('ambassadors')
      .update({ tier })
      .eq('id', ambassadorId)
      .select('*, profiles(*)')
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as Ambassador, error: null };
  }

  async deactivateAmbassador(ambassadorId: string): Promise<ApiResponse<Ambassador>> {
    const { data, error } = await this.supabase
      .from('ambassadors')
      .update({ is_active: false })
      .eq('id', ambassadorId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as Ambassador, error: null };
  }

  async getAmbassadorStudents(ambassadorId: string): Promise<ApiResponse<Student[]>> {
    const { data, error } = await this.supabase
      .from('students')
      .select('*, profiles(*)')
      .eq('referred_by', ambassadorId)
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Student[], error: null };
  }
}
