import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ApiResponse,
  HostingApplication,
  CreateHostingApplicationPayload,
} from '@upshot/types';

export class HostingService {
  constructor(private supabase: SupabaseClient) {}

  async submitApplication(
    userId: string,
    payload: CreateHostingApplicationPayload,
  ): Promise<ApiResponse<HostingApplication>> {
    const { data, error } = await this.supabase
      .from('hosting_applications')
      .insert({
        user_id: userId,
        // Personal details
        applicant_name: payload.applicant_name,
        applicant_phone: payload.applicant_phone,
        applicant_email: payload.applicant_email,
        event_type: payload.event_type,
        // Organisation details
        org_legal_name: payload.org_legal_name ?? null,
        org_city: payload.org_city ?? null,
        org_state: payload.org_state ?? null,
        org_sector: payload.org_sector ?? null,
        org_designation: payload.org_designation ?? null,
        // Event details
        title: payload.title,
        description: payload.description ?? null,
        event_date: payload.event_date,
        event_time: payload.event_time ?? null,
        location: payload.location,
        event_city: payload.event_city,
        event_state: payload.event_state,
        location_url: payload.location_url ?? null,
        category: payload.category ?? 'social',
        max_attendees: payload.max_attendees ?? null,
        fees: payload.fees ?? null,
        requirements: payload.requirements ?? null,
        cover_image_url: payload.cover_image_url ?? null,
        status: 'pending',
      })
      .select()
      .single();
    if (error) return { data: null, error: { code: 'CREATE_FAILED', message: error.message } };
    return { data: data as unknown as HostingApplication, error: null };
  }

  async getMyApplications(userId: string): Promise<ApiResponse<HostingApplication[]>> {
    const { data, error } = await this.supabase
      .from('hosting_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as HostingApplication[], error: null };
  }

  async getAllApplicationsAdmin(): Promise<ApiResponse<HostingApplication[]>> {
    const { data, error } = await this.supabase
      .from('hosting_applications')
      .select('*, user:profiles!user_id(id, full_name, email, avatar_url)')
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as HostingApplication[], error: null };
  }

  async approveApplication(
    applicationId: string,
    adminId: string,
  ): Promise<ApiResponse<HostingApplication>> {
    // 1. Get the application
    const { data: app, error: fetchErr } = await this.supabase
      .from('hosting_applications')
      .select('*')
      .eq('id', applicationId)
      .single();
    if (fetchErr || !app) {
      return { data: null, error: { code: 'NOT_FOUND', message: 'Application not found' } };
    }

    // 2. Create event from the application
    const { error: eventErr } = await this.supabase.from('events').insert({
      title: app.title,
      description: app.description ?? '',
      company_id: null,
      event_date: app.event_date,
      event_time: app.event_time,
      location: app.location,
      location_url: app.location_url,
      category: app.category,
      banner_url: app.cover_image_url ?? null,
      max_attendees: app.max_attendees,
      current_attendees: 0,
      status: 'approved',
      requirements: app.requirements,
      created_by: app.user_id,
      approved_by: adminId,
      approved_at: new Date().toISOString(),
    });
    if (eventErr) {
      return { data: null, error: { code: 'EVENT_CREATE_FAILED', message: eventErr.message } };
    }

    // 3. Update application status
    const { data: updated, error: updateErr } = await this.supabase
      .from('hosting_applications')
      .update({
        status: 'approved',
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();
    if (updateErr) {
      return { data: null, error: { code: 'UPDATE_FAILED', message: updateErr.message } };
    }

    // 4. Notify user
    await this.supabase.from('notifications').insert({
      user_id: app.user_id,
      title: 'Event Approved!',
      body: `Your event "${app.title}" has been approved and is now live.`,
      type: 'hosting_approved',
      reference_id: applicationId,
    });

    return { data: updated as unknown as HostingApplication, error: null };
  }

  async rejectApplication(
    applicationId: string,
    adminId: string,
    reason?: string,
  ): Promise<ApiResponse<HostingApplication>> {
    const { data: app } = await this.supabase
      .from('hosting_applications')
      .select('user_id, title')
      .eq('id', applicationId)
      .single();

    const { data, error } = await this.supabase
      .from('hosting_applications')
      .update({
        status: 'rejected',
        rejection_reason: reason ?? 'Rejected by admin',
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };

    if (app) {
      await this.supabase.from('notifications').insert({
        user_id: app.user_id,
        title: 'Event Not Approved',
        body: `Your event "${app.title}" was not approved.${reason ? ` Reason: ${reason}` : ''}`,
        type: 'hosting_rejected',
        reference_id: applicationId,
      });
    }

    return { data: data as unknown as HostingApplication, error: null };
  }
}
