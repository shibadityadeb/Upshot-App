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
      if (ambassador_code) {
        const { data: ambassador } = await this.supabase
          .from('ambassadors')
          .select('id, referral_count')
          .eq('referral_code', ambassador_code)
          .eq('is_active', true)
          .single();
        if (ambassador) {
          ambassadorId = ambassador.id;
          await this.supabase
            .from('ambassadors')
            .update({ referral_count: ambassador.referral_count + 1 })
            .eq('id', ambassadorId);
        }
      }

      const { error: studentError } = await this.supabase.from('students').insert({
        user_id: userId,
        college: college ?? null,
        course: course ?? null,
        year_of_study: year_of_study ?? null,
        ambassador_code: ambassador_code ?? null,
        referred_by: ambassadorId,
      });
      if (studentError) throw new Error(studentError.message);
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
        role: (authUser.user_metadata?.role as UserRole) ?? 'student',
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
