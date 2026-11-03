import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ApiResponse,
  SponsorInquiry,
  CreateSponsorInquiryPayload,
  SponsorInquiryStatus,
} from '@upshot/types';

export class SponsorsService {
  constructor(private supabase: SupabaseClient) {}

  /** Someone offers to sponsor an event. */
  async submitInquiry(
    userId: string,
    payload: CreateSponsorInquiryPayload,
  ): Promise<ApiResponse<SponsorInquiry>> {
    const { data, error } = await this.supabase
      .from('sponsor_inquiries')
      .insert({
        user_id: userId,
        event_id: payload.event_id,
        company_name: payload.company_name,
        contact_name: payload.contact_name,
        email: payload.email,
        phone: payload.phone,
        website: payload.website ?? null,
        why_sponsor: payload.why_sponsor,
        message: payload.message ?? null,
        status: 'pending',
      })
      .select()
      .single();
    if (error) return { data: null, error: { code: 'CREATE_FAILED', message: error.message } };
    return { data: data as unknown as SponsorInquiry, error: null };
  }

  /** The submitter's own sponsor inquiries. */
  async getMyInquiries(userId: string): Promise<ApiResponse<SponsorInquiry[]>> {
    const { data, error } = await this.supabase
      .from('sponsor_inquiries')
      .select('*, event:events(id, title, event_date, location)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as SponsorInquiry[], error: null };
  }

  /** Admin: all sponsor inquiries with the event and submitter profile. */
  async getAllInquiriesAdmin(): Promise<ApiResponse<SponsorInquiry[]>> {
    const { data, error } = await this.supabase
      .from('sponsor_inquiries')
      .select(
        '*, event:events(id, title, event_date, location), user:profiles!user_id(id, full_name, email, avatar_url)',
      )
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as SponsorInquiry[], error: null };
  }

  /** Admin: update the review status of a sponsor inquiry. */
  async updateInquiryStatus(
    inquiryId: string,
    adminId: string,
    status: SponsorInquiryStatus,
    adminNote?: string,
  ): Promise<ApiResponse<SponsorInquiry>> {
    const { data, error } = await this.supabase
      .from('sponsor_inquiries')
      .update({
        status,
        admin_note: adminNote ?? null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', inquiryId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as SponsorInquiry, error: null };
  }
}
