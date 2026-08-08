import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ApiResponse,
  HostingApplication,
  CreateHostingApplicationPayload,
  Host,
  HostedEvent,
  EventApplication,
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

  /** The host's own organisation + position record. */
  async getHostProfile(userId: string): Promise<ApiResponse<Host | null>> {
    const { data, error } = await this.supabase
      .from('hosts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? null) as unknown as Host | null, error: null };
  }

  async updateHostProfile(
    userId: string,
    updates: Partial<Omit<Host, 'id' | 'user_id' | 'is_verified' | 'created_at' | 'updated_at'>>,
  ): Promise<ApiResponse<Host>> {
    const { data, error } = await this.supabase
      .from('hosts')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as Host, error: null };
  }

  /**
   * Live events this host created, each carrying its participant counts.
   * Counts come from a second query rather than an embedded aggregate — PostgREST
   * cannot filter an embedded count by status, and we need approved vs pending split.
   */
  async getMyHostedEvents(userId: string): Promise<ApiResponse<HostedEvent[]>> {
    const { data: events, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('created_by', userId)
      .order('event_date', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };

    const list = (events ?? []) as any[];
    if (list.length === 0) return { data: [], error: null };

    const { data: apps } = await this.supabase
      .from('event_applications')
      .select('event_id, status')
      .in('event_id', list.map((e) => e.id));

    const approved = new Map<string, number>();
    const pending = new Map<string, number>();
    for (const app of (apps ?? []) as { event_id: string; status: string }[]) {
      const bucket = app.status === 'approved' ? approved : app.status === 'pending' ? pending : null;
      if (bucket) bucket.set(app.event_id, (bucket.get(app.event_id) ?? 0) + 1);
    }

    return {
      data: list.map((e) => ({
        ...e,
        approved_participants: approved.get(e.id) ?? 0,
        pending_participants: pending.get(e.id) ?? 0,
      })) as HostedEvent[],
      error: null,
    };
  }

  /**
   * Everyone who applied to one of the host's events. Readable thanks to the
   * events.created_by branch of the event_applications_select policy (migration 022).
   */
  async getEventParticipants(eventId: string): Promise<ApiResponse<EventApplication[]>> {
    const { data, error } = await this.supabase
      .from('event_applications')
      .select('*, user:profiles!user_id(*)')
      .eq('event_id', eventId)
      .order('applied_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as EventApplication[], error: null };
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
      coin_reward: 0,
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
