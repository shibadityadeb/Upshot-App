import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse, Ambassador, Student, AmbassadorTier, AmbassadorCode, CreateAmbassadorCodePayload } from '@upshot/types';

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

  private generateReferralCode(fullName: string): string {
    const clean = fullName.trim().toUpperCase().replace(/[^A-Z]/g, '');
    const prefix = clean.slice(0, 4) || 'AMBR';
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${rand}`;
  }

  async createAmbassador(userId: string, fullName: string): Promise<ApiResponse<Ambassador>> {
    const referralCode = this.generateReferralCode(fullName);

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
    const result = await this.validateCode(code);
    return { data: { valid: result.valid, ambassador_id: result.codeData?.assigned_to ?? null }, error: null };
  }

  async generateCode(adminId: string, payload: CreateAmbassadorCodePayload): Promise<AmbassadorCode> {
    let code: string;
    if (payload.code_type === 'custom') {
      if (!payload.custom_code || payload.custom_code.trim().length < 4) {
        throw new Error('Custom code must be at least 4 characters');
      }
      code = payload.custom_code.trim().toUpperCase().replace(/\s+/g, '-');
      const { data: existing } = await this.supabase.from('ambassador_codes').select('id').eq('code', code).maybeSingle();
      if (existing) throw new Error('This code already exists. Choose a different one.');
    } else {
      const { data: generated, error: genError } = await this.supabase.rpc('generate_random_code');
      if (genError) throw genError;
      code = generated as string;
    }
    const { data, error } = await this.supabase
      .from('ambassador_codes')
      .insert({ code, code_type: payload.code_type, vertical_id: payload.vertical_id || null, issued_by: adminId, notes: payload.notes || null })
      .select('*, vertical:verticals(id, name, color, slug)')
      .single();
    if (error) throw error;
    return data as AmbassadorCode;
  }

  async getAllCodes(): Promise<AmbassadorCode[]> {
    const { data, error } = await this.supabase
      .from('ambassador_codes')
      .select('*, vertical:verticals(id, name, color, slug), assigned_user:profiles!assigned_to(id, full_name, email), issuer:profiles!issued_by(id, full_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as AmbassadorCode[];
  }

  async deactivateCode(codeId: string): Promise<void> {
    const { error } = await this.supabase.from('ambassador_codes').update({ is_active: false }).eq('id', codeId);
    if (error) throw error;
  }

  async validateCode(code: string): Promise<{ valid: boolean; codeData?: AmbassadorCode }> {
    const cleanCode = code.trim().toUpperCase();
    const { data, error } = await this.supabase
      .from('ambassador_codes')
      .select('*, vertical:verticals(id, name, color, slug)')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .eq('is_claimed', false)
      .maybeSingle();
    if (error || !data) return { valid: false };
    return { valid: true, codeData: data as AmbassadorCode };
  }

  async claimCode(code: string, userId: string): Promise<AmbassadorCode> {
    const cleanCode = code.trim().toUpperCase();
    const { data: codeData, error: findError } = await this.supabase
      .from('ambassador_codes').select('*').eq('code', cleanCode).eq('is_active', true).eq('is_claimed', false).single();
    if (findError || !codeData) throw new Error('Invalid or already used ambassador code');
    const { data, error } = await this.supabase
      .from('ambassador_codes')
      .update({ is_claimed: true, assigned_to: userId, claimed_at: new Date().toISOString() })
      .eq('id', codeData.id).select().single();
    if (error) throw error;
    const { data: existingAmbassador } = await this.supabase.from('ambassadors').select('id').eq('user_id', userId).maybeSingle();
    if (!existingAmbassador) {
      await this.supabase.from('ambassadors').insert({ user_id: userId, referral_code: cleanCode, code_type: codeData.code_type, issued_by: codeData.issued_by });
      await this.supabase.from('profiles').update({ role: 'ambassador' }).eq('id', userId);
    }
    return data as AmbassadorCode;
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
