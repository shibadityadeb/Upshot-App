import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse } from '@upshot/types';

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
  state: string | null;
  joined_at: string;
  is_active: boolean;
  status: CampusCartelStatus;
}

export class CampusCartelService {
  constructor(private supabase: SupabaseClient) {}



  /**
   * Community-wide Campus Cartel totals.
   *
   * Counted through a SECURITY DEFINER RPC (migration 024) rather than by querying
   * campus_cartel_members directly: ccm_select_own restricts SELECT to the caller's
   * own row, so a direct count always came back as "1 member, 1 college".
   */
  async getStats(): Promise<ApiResponse<CampusCartelStats>> {
    const { data, error } = await this.supabase.rpc('get_campus_cartel_stats');
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };

    // The RPC returns TABLE(...), so PostgREST hands back a single-row array.
    const row = Array.isArray(data) ? data[0] : data;
    return {
      data: {
        memberCount: Number(row?.member_count ?? 0),
        uniqueColleges: Number(row?.unique_colleges ?? 0),
        totalCoins: Number(row?.total_coins ?? 0),
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
    state?: string,
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
        state: state ?? null,
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
    state?: string,
  ): Promise<ApiResponse<CampusCartelMember>> {
    return this.applyForCampusCartel(userId, code, college, course, yearOfStudy, city, state);
  }

  /** Update an existing pending/rejected application */
  async updateApplication(
    memberId: string,
    updates: { college?: string; course?: string; city?: string; state?: string; ambassador_code?: string | null },
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
    if ('state' in updates) payload.state = updates.state ?? null;
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
  /**
   * Claim an admin-issued ambassador code and turn the holder into an ambassador.
   *
   * No-op unless `code` names an active, unclaimed row in `ambassador_codes`, so
   * personal referral codes and already-claimed codes fall straight through.
   */
  private async promoteToAmbassador(userId: string, code: string): Promise<void> {
    const cleanCode = code.trim().toUpperCase();

    const { data: codeRecord } = await this.supabase
      .from('ambassador_codes')
      .select('id, code_type, issued_by')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .eq('is_claimed', false)
      .maybeSingle();
    if (!codeRecord) return;

    const { data: existingAmb } = await this.supabase
      .from('ambassadors')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    if (existingAmb) return;

    // The code is minted by the database (migration 025): generate_random_code()
    // now retries until the candidate collides with neither an existing personal
    // code nor an admin-issued one, and a BEFORE INSERT trigger fills it in if it
    // is missing. No client-side fallback — a hand-rolled code would be unchecked
    // for uniqueness and in the wrong shape.
    const { error: ambError } = await this.supabase.from('ambassadors').insert({
      user_id: userId,
      code_type: codeRecord.code_type,
      issued_by: codeRecord.issued_by,
    });
    // Leave the code unclaimed if the record could not be created, so the promotion
    // can be retried rather than burning the code on a half-finished state.
    if (ambError) return;

    await this.supabase.from('profiles').update({ role: 'ambassador' }).eq('id', userId);

    await this.supabase
      .from('ambassador_codes')
      .update({ is_claimed: true, assigned_to: userId, claimed_at: new Date().toISOString() })
      .eq('id', codeRecord.id);
  }

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

      // An admin-issued code makes the applicant an ambassador on approval.
      //
      // applyForCampusCartel() accepts codes from `ambassador_codes` but only
      // validates them — it never claimed the code or created the ambassador
      // record, so applying with one granted membership and nothing else. Signing
      // up with the same code (registerStudent) did promote, leaving two paths
      // that disagreed. This mirrors the signup path at approval time.
      await this.promoteToAmbassador(member.user_id, member.ambassador_code);
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
