import type { SupabaseClient } from '@supabase/supabase-js';
import type { PrismaClient } from '@upshot/database';
import type { ApiResponse, User, UserRole, RegisterStudentPayload } from '@upshot/types';

export class AuthService {
  constructor(
    private supabase: SupabaseClient,
    private prisma: PrismaClient,
  ) {}

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
      // Look up ambassador if referral code provided
      let ambassadorId: string | null = null;
      if (ambassador_code) {
        const ambassador = await this.prisma.ambassador.findFirst({
          where: { referralCode: ambassador_code, isActive: true },
        });
        if (ambassador) {
          ambassadorId = ambassador.id;
          await this.prisma.ambassador.update({
            where: { id: ambassadorId },
            data: { referralCount: { increment: 1 } },
          });
        }
      }

      await this.prisma.student.create({
        data: {
          userId,
          college: college ?? null,
          course: course ?? null,
          yearOfStudy: year_of_study ?? null,
          ambassadorCode: ambassador_code ?? null,
          referredBy: ambassadorId,
        },
      });
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
    const userId = sessionData.session?.user?.id;
    if (!userId) return { data: null, error: { code: 'NO_SESSION', message: 'Not authenticated' } };

    const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) return { data: null, error: { code: 'NOT_FOUND', message: 'Profile not found' } };

    return { data: { user: profile as unknown as User }, error: null };
  }

  async updateProfile(
    userId: string,
    updates: Partial<Pick<User, 'full_name' | 'avatar_url' | 'phone'>>,
  ): Promise<ApiResponse<{ user: User }>> {
    try {
      const profile = await this.prisma.profile.update({
        where: { id: userId },
        data: {
          fullName: updates.full_name,
          avatarUrl: updates.avatar_url,
          phone: updates.phone,
        },
      });
      return { data: { user: profile as unknown as User }, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Update failed';
      return { data: null, error: { code: 'UPDATE_FAILED', message: msg } };
    }
  }

  async resetPassword(email: string): Promise<ApiResponse<null>> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return { data: null, error: null };
  }
}
