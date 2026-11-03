import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse, UserRole } from '@upshot/types';

export interface AudienceStats {
  totalUsers: number;
  byRole: Record<UserRole, number>;
  /** Distinct people with at least one (non-withdrawn) event application. */
  applicants: number;
  /** Non-withdrawn event applications. */
  applications: number;
  sponsorInquiries: number;
}

const ROLES: UserRole[] = ['people', 'student', 'ambassador', 'host', 'company', 'admin'];
const PAGE = 1000;

/** Read-only counts for the admin dashboards. Relies on admin RLS. */
export class StatsService {
  constructor(private supabase: SupabaseClient) {}

  async getAudienceStats(): Promise<ApiResponse<AudienceStats>> {
    const head = { count: 'exact' as const, head: true };
    const [total, applications, sponsors, ...roleCounts] = await Promise.all([
      this.supabase.from('profiles').select('*', head),
      this.supabase.from('event_applications').select('*', head).neq('status', 'withdrawn'),
      this.supabase.from('sponsor_inquiries').select('*', head),
      ...ROLES.map((r) => this.supabase.from('profiles').select('*', head).eq('role', r)),
    ]);

    const failed = [total, applications, ...roleCounts].find((r) => r.error);
    if (failed?.error) return { data: null, error: { code: 'FETCH_FAILED', message: failed.error.message } };

    // PostgREST can't count distinct, so page through the applicant ids.
    const applicantIds = new Set<string>();
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await this.supabase
        .from('event_applications')
        .select('user_id')
        .neq('status', 'withdrawn')
        .order('id')
        .range(from, from + PAGE - 1);
      if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
      (data ?? []).forEach((row: { user_id: string }) => applicantIds.add(row.user_id));
      if (!data || data.length < PAGE) break;
    }

    const byRole = Object.fromEntries(ROLES.map((r, i) => [r, roleCounts[i].count ?? 0])) as Record<
      UserRole,
      number
    >;

    return {
      data: {
        totalUsers: total.count ?? 0,
        byRole,
        applicants: applicantIds.size,
        applications: applications.count ?? 0,
        // Missing table (migration not applied) just reads as 0.
        sponsorInquiries: sponsors.count ?? 0,
      },
      error: null,
    };
  }
}
