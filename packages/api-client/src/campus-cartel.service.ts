import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse } from '@upshot/types';

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  total_earned: number;
  current_balance: number;
  college: string | null;
  ambassador_code: string | null;
  ambassador_tier: string | null;
  rank: number;
}

export interface CampusCartelStats {
  memberCount: number;
  uniqueColleges: number;
  totalCoins: number;
}

export type CampusCartelStatus = 'pending' | 'approved' | 'rejected';

export interface CampusCartelMember {
  id: string;
  user_id: string;
  ambassador_code: string | null;
  college: string | null;
  course: string | null;
  year_of_study: number | null;
  city: string | null;
  joined_at: string;
  is_active: boolean;
  status: CampusCartelStatus;
}

export class CampusCartelService {
  constructor(private supabase: SupabaseClient) {}

  async getLeaderboard(limit: number = 50): Promise<ApiResponse<LeaderboardEntry[]>> {
    const { data, error } = await this.supabase
      .from('leaderboard')
      .select('*')
      .limit(limit);
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as LeaderboardEntry[], error: null };
  }

  async getMyRank(userId: string): Promise<ApiResponse<LeaderboardEntry | null>> {
    if (!userId) return { data: null, error: null };
    const { data, error } = await this.supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: data as LeaderboardEntry | null, error: null };
  }

  async getStats(): Promise<ApiResponse<CampusCartelStats>> {
    const { count: memberCount, error: e1 } = await this.supabase
      .from('campus_cartel_members')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('status', 'approved');
    if (e1) return { data: null, error: { code: 'FETCH_FAILED', message: e1.message } };

    const { data: collegeData, error: e2 } = await this.supabase
      .from('campus_cartel_members')
      .select('college')
      .eq('is_active', true)
      .eq('status', 'approved')
      .not('college', 'is', null);
    if (e2) return { data: null, error: { code: 'FETCH_FAILED', message: e2.message } };

    const uniqueColleges = collegeData
      ? new Set(collegeData.map((r: any) => r.college)).size
      : 0;

    const { data: coinData } = await this.supabase
      .from('wallet_balances')
      .select('total_earned');

    const totalCoins = coinData
      ? coinData.reduce((sum: number, r: any) => sum + (r.total_earned ?? 0), 0)
      : 0;

    return {
      data: {
        memberCount: memberCount ?? 0,
        uniqueColleges,
        totalCoins,
      },
      error: null,
    };
  }

  // ── Application flow ──────────────────────────────────────

  /** Submit an application (status = pending). No coins awarded until approved. */
  async applyForCampusCartel(
    userId: string,
    code?: string,
    college?: string,
    course?: string,
    yearOfStudy?: number,
    city?: string,
  ): Promise<ApiResponse<CampusCartelMember>> {
    if (!userId) return { data: null, error: { code: 'AUTH_REQUIRED', message: 'Not logged in' } };

    // Check if already applied
    const existing = await this.getApplicationStatus(userId);
    if (existing.data) {
      return { data: null, error: { code: 'ALREADY_APPLIED', message: 'You have already applied' } };
    }

    // Validate ambassador code if provided
    let cleanCode: string | null = null;
    if (code && code.trim()) {
      cleanCode = code.trim().toUpperCase();
      const { data: codeRow } = await this.supabase
        .from('ambassador_codes')
        .select('id, code')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();

      if (!codeRow) {
        const { data: ambRow } = await this.supabase
          .from('ambassadors')
          .select('id, referral_code')
          .eq('referral_code', cleanCode)
          .eq('is_active', true)
          .maybeSingle();
        if (!ambRow) {
          return { data: null, error: { code: 'INVALID_CODE', message: 'Invalid ambassador code' } };
        }
      }
    }

    // Insert as pending application
    const { data, error } = await this.supabase
      .from('campus_cartel_members')
      .insert({
        user_id: userId,
        ambassador_code: cleanCode,
        college: college ?? null,
        course: course ?? null,
        year_of_study: yearOfStudy ?? null,
        city: city ?? null,
        status: 'pending',
        is_active: false,
      })
      .select()
      .single();
    if (error) return { data: null, error: { code: 'CREATE_FAILED', message: error.message } };

    return { data: data as CampusCartelMember, error: null };
  }

  /** Keep backward compat — alias to applyForCampusCartel */
  async joinCampusCartel(
    userId: string,
    code?: string,
    college?: string,
    course?: string,
    yearOfStudy?: number,
    city?: string,
  ): Promise<ApiResponse<CampusCartelMember>> {
    return this.applyForCampusCartel(userId, code, college, course, yearOfStudy, city);
  }

  /** Update an existing pending/rejected application */
  async updateApplication(
    memberId: string,
    updates: { college?: string; course?: string; city?: string; ambassador_code?: string | null },
  ): Promise<ApiResponse<CampusCartelMember>> {
    // Only allow updates on pending/rejected applications
    const { data: existing } = await this.supabase
      .from('campus_cartel_members')
      .select('status')
      .eq('id', memberId)
      .single();
    if (existing && existing.status === 'approved') {
      return { data: null, error: { code: 'ALREADY_APPROVED', message: 'Cannot update an approved application' } };
    }

    // If ambassador code provided, validate it
    if (updates.ambassador_code) {
      const cleanCode = updates.ambassador_code.trim().toUpperCase();
      const { data: codeRow } = await this.supabase
        .from('ambassador_codes')
        .select('id')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();
      if (!codeRow) {
        const { data: ambRow } = await this.supabase
          .from('ambassadors')
          .select('id')
          .eq('referral_code', cleanCode)
          .eq('is_active', true)
          .maybeSingle();
        if (!ambRow) {
          return { data: null, error: { code: 'INVALID_CODE', message: 'Invalid ambassador code' } };
        }
      }
      updates.ambassador_code = cleanCode;
    }

    // Only include fields that are explicitly provided
    const payload: Record<string, any> = { status: 'pending', is_active: false };
    if ('college' in updates) payload.college = updates.college ?? null;
    if ('course' in updates) payload.course = updates.course ?? null;
    if ('city' in updates) payload.city = updates.city ?? null;
    if ('ambassador_code' in updates) payload.ambassador_code = updates.ambassador_code ?? null;

    const { data, error } = await this.supabase
      .from('campus_cartel_members')
      .update(payload)
      .eq('id', memberId)
      .select()
      .single();
    if (error || !data) return { data: null, error: { code: 'UPDATE_FAILED', message: error?.message ?? 'Failed' } };
    return { data: data as CampusCartelMember, error: null };
  }

  /** Check if user is an approved member */
  async isMember(userId: string): Promise<boolean> {
    if (!userId) return false;
    const { data } = await this.supabase
      .from('campus_cartel_members')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .eq('is_active', true)
      .maybeSingle();
    return !!data;
  }

  /** Get the user's application row (any status) */
  async getApplicationStatus(userId: string): Promise<ApiResponse<CampusCartelMember | null>> {
    if (!userId) return { data: null, error: null };
    const { data, error } = await this.supabase
      .from('campus_cartel_members')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: data as CampusCartelMember | null, error: null };
  }

  // ── Admin methods ─────────────────────────────────────────

  /** Get all applications (optionally filtered by status) */
  async getApplications(status?: CampusCartelStatus): Promise<ApiResponse<(CampusCartelMember & { profile?: any })[]>> {
    let query = this.supabase
      .from('campus_cartel_members')
      .select('*, profile:profiles!user_id(id, full_name, avatar_url, email)')
      .order('joined_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };

    return { data: (data ?? []) as any[], error: null };
  }

  /** Admin approves an application → set approved, is_active=true, award coins */
  async approveApplication(memberId: string): Promise<ApiResponse<CampusCartelMember>> {
    const { data, error } = await this.supabase
      .from('campus_cartel_members')
      .update({ status: 'approved', is_active: true })
      .eq('id', memberId)
      .select()
      .single();
    if (error || !data) return { data: null, error: { code: 'UPDATE_FAILED', message: error?.message ?? 'Failed' } };

    const member = data as CampusCartelMember;

    // Award 50 welcome bonus coins
    await this.supabase.from('coin_transactions').insert({
      user_id: member.user_id,
      type: 'bonus',
      amount: 50,
      description: 'Welcome bonus — Campus Cartel approved',
      reference_type: 'campus_cartel',
    });

    // Update students.ambassador_code if exists
    if (member.ambassador_code) {
      await this.supabase
        .from('students')
        .update({ ambassador_code: member.ambassador_code })
        .eq('user_id', member.user_id);

      // Increment ambassador referral_count
      const { data: amb } = await this.supabase
        .from('ambassadors')
        .select('id')
        .eq('referral_code', member.ambassador_code)
        .maybeSingle();
      if (amb) {
        await this.supabase.rpc('increment_referral_count', { ambassador_row_id: amb.id });
      }
    }

    // Notify user
    await this.supabase.from('notifications').insert({
      user_id: member.user_id,
      title: 'Campus Cartel Approved!',
      body: 'Your application has been approved. Welcome to Campus Cartel! You earned 50 coins.',
      type: 'campus_cartel',
    });

    return { data: member, error: null };
  }

  /** Admin rejects an application */
  async rejectApplication(memberId: string, reason?: string): Promise<ApiResponse<CampusCartelMember>> {
    const { data, error } = await this.supabase
      .from('campus_cartel_members')
      .update({ status: 'rejected', is_active: false })
      .eq('id', memberId)
      .select()
      .single();
    if (error || !data) return { data: null, error: { code: 'UPDATE_FAILED', message: error?.message ?? 'Failed' } };

    const member = data as CampusCartelMember;

    // Notify user
    await this.supabase.from('notifications').insert({
      user_id: member.user_id,
      title: 'Campus Cartel Application',
      body: `Your application was not approved.${reason ? ` Reason: ${reason}` : ''}`,
      type: 'campus_cartel',
    });

    return { data: member, error: null };
  }

  async getAmbassadorReferrals(code: string): Promise<ApiResponse<(CampusCartelMember & { profile?: any })[]>> {
    const cleanCode = code.trim().toUpperCase();
    const { data, error } = await this.supabase
      .from('campus_cartel_members')
      .select('*, profile:profiles!user_id(id, full_name, avatar_url)')
      .eq('ambassador_code', cleanCode)
      .eq('status', 'approved')
      .order('joined_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as any[], error: null };
  }
}
