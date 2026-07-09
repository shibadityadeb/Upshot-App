import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse, User, UserRole, RegisterStudentPayload } from '@upshot/types';

export class AuthService {
  constructor(private supabase: SupabaseClient) {}

  async signIn(email: string, password: string): Promise<ApiResponse<{ user: User }>> {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return this.getCurrentUser();
  }

  async signUp(
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
  ): Promise<ApiResponse<{ user: User }>> {
    const { error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return this.getCurrentUser();
  }

  async registerStudent(payload: RegisterStudentPayload): Promise<ApiResponse<{ user: User }>> {
    const { email, password, full_name, college, course, year_of_study, ambassador_code } = payload;

    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: 'student' as UserRole } },
    });
    if (authError) return { data: null, error: { code: authError.name, message: authError.message } };

    const userId = authData.user?.id;
    if (!userId) return { data: null, error: { code: 'NO_USER', message: 'User creation failed' } };

    try {
      let ambassadorId: string | null = null;
      let validCodeUsed = false;
      let rewardAmbassador = false;
      if (ambassador_code) {
        const cleanCode = ambassador_code.trim().toUpperCase();
        // First try the new ambassador_codes table
        const { data: codeRecord } = await this.supabase
          .from('ambassador_codes')
          .select('id, assigned_to, issued_by, code_type')
          .eq('code', cleanCode)
          .eq('is_active', true)
          .eq('is_claimed', false)
          .maybeSingle();
        if (codeRecord) {
          validCodeUsed = true;
          // Claim the code
          await this.supabase
            .from('ambassador_codes')
            .update({ is_claimed: true, assigned_to: userId, claimed_at: new Date().toISOString() })
            .eq('id', codeRecord.id);

          // Resolve issuer's ambassador record ID for referred_by FK
          if (codeRecord.issued_by) {
            const { data: issuerAmb } = await this.supabase
              .from('ambassadors')
              .select('id, referral_count')
              .eq('user_id', codeRecord.issued_by)
              .maybeSingle();
            if (issuerAmb) {
              ambassadorId = issuerAmb.id;
              await this.supabase
                .from('ambassadors')
                .update({ referral_count: issuerAmb.referral_count + 1 })
                .eq('id', issuerAmb.id);
            }
          }

          // Make the registering user an ambassador with their own unique code
          const { data: existingAmb } = await this.supabase
            .from('ambassadors').select('id').eq('user_id', userId).maybeSingle();
          if (!existingAmb) {
            const { data: genCode } = await this.supabase.rpc('generate_random_code');
            const ownCode = (genCode as string) || `UBM-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            await this.supabase.from('ambassadors').insert({
              user_id: userId,
              referral_code: ownCode,
              code_type: codeRecord.code_type,
              issued_by: codeRecord.issued_by,
            });
            await this.supabase.from('profiles').update({ role: 'ambassador' }).eq('id', userId);
          }
        } else {
          // Personal referral code from ambassadors table — user stays a student
          const { data: ambassador } = await this.supabase
            .from('ambassadors')
            .select('id, referral_count')
            .eq('referral_code', cleanCode)
            .eq('is_active', true)
            .maybeSingle();
          if (ambassador) {
            validCodeUsed = true;
            rewardAmbassador = true;
            ambassadorId = ambassador.id;
            await this.supabase
              .from('ambassadors')
              .update({ referral_count: ambassador.referral_count + 1 })
              .eq('id', ambassadorId);
          }
        }
      }

      const cleanedCode = ambassador_code ? ambassador_code.trim().toUpperCase() : null;

      const { error: studentError } = await this.supabase.from('students').insert({
        user_id: userId,
        college: college ?? null,
        course: course ?? null,
        year_of_study: year_of_study ?? null,
        ambassador_code: cleanedCode,
        referred_by: ambassadorId,
      });
      if (studentError) throw new Error(studentError.message);

      // Auto-approve into Campus Cartel if registered with a valid ambassador code
      if (validCodeUsed) {
        await this.supabase.from('campus_cartel_members').insert({
          user_id: userId,
          ambassador_code: cleanedCode,
          college: college ?? null,
          course: course ?? null,
          year_of_study: year_of_study ?? null,
          status: 'approved',
          is_active: true,
        });
      }

      // Award 20 coins to the ambassador for each successful referral
      if (rewardAmbassador && ambassadorId) {
        await this.supabase.rpc('award_referral_coins', {
          referrer_ambassador_id: ambassadorId,
          referred_user_id: userId,
          coin_amount: 20,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Student insert failed';
      return { data: null, error: { code: 'STUDENT_INSERT', message: msg } };
    }

    return this.getCurrentUser();
  }

  async signOut(): Promise<ApiResponse<null>> {
    const { error } = await this.supabase.auth.signOut();
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return { data: null, error: null };
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return { data: data.session, error: null };
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const { data: sessionData } = await this.supabase.auth.getSession();
    const authUser = sessionData.session?.user;
    if (!authUser) return { data: null, error: { code: 'NO_SESSION', message: 'Not authenticated' } };

    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (!profile) {
      // Profile trigger may not have fired yet — build from auth metadata
      const fallback: User = {
        id: authUser.id,
        email: authUser.email ?? '',
        full_name: authUser.user_metadata?.full_name ?? '',
        avatar_url: null,
        role: (authUser.user_metadata?.role as UserRole) ?? 'people',
        phone: null,
        is_active: true,
        created_at: authUser.created_at,
        updated_at: authUser.created_at,
      };
      return { data: { user: fallback }, error: null };
    }

    return { data: { user: profile as unknown as User }, error: null };
  }

  async updateProfile(
    userId: string,
    updates: Partial<Pick<User, 'full_name' | 'avatar_url' | 'phone'>>,
  ): Promise<ApiResponse<{ user: User }>> {
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .update({
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        phone: updates.phone,
      })
      .eq('id', userId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: { user: profile as unknown as User }, error: null };
  }

  async resetPassword(email: string): Promise<ApiResponse<null>> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return { data: null, error: null };
  }
}
