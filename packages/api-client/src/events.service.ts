import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ApiResponse,
  Event,
  EventApplication,
  PaginatedResponse,
  CreateEventPayload,
  UpdateEventStatusPayload,
  ApplicationStatus,
} from '@upshot/types';

export class EventsService {
  constructor(private supabase: SupabaseClient) {}

  async getApprovedEvents(
    page: number = 1,
    perPage: number = 20,
    category?: string,
  ): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const today = new Date().toISOString().split('T')[0];

    let query = this.supabase
      .from('events')
      .select('*, company:companies(*), vertical:verticals(id, name, slug, color)', { count: 'exact' })
      .eq('status', 'approved')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .range((page - 1) * perPage, page * perPage - 1);

    if (category) query = query.eq('category', category);

    const { data, error, count } = await query;
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };

    return {
      data: {
        data: (data ?? []) as unknown as Event[],
        count: count ?? 0,
        page,
        per_page: perPage,
        total_pages: Math.ceil((count ?? 0) / perPage),
      },
      error: null,
    };
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*, company:companies(*), vertical:verticals(id, name, slug, color)')
      .eq('id', id)
      .single();
    if (error || !data) return { data: null, error: { code: 'NOT_FOUND', message: 'Event not found' } };
    return { data: data as unknown as Event, error: null };
  }

  async getCompanyEvents(companyId: string): Promise<ApiResponse<Event[]>> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Event[], error: null };
  }

  async getAllEventsAdmin(status?: string): Promise<ApiResponse<Event[]>> {
    let query = this.supabase
      .from('events')
      .select('*, company:companies(*), vertical:verticals(id, name, slug, color), applications:event_applications(count)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };

    // Flatten the PostgREST count embed ([{ count: n }]) into application_count
    const events = (data ?? []).map((e: any) => ({
      ...e,
      application_count: e.applications?.[0]?.count ?? 0,
    }));
    return { data: events as unknown as Event[], error: null };
  }

  async createEvent(
    companyId: string,
    userId: string,
    payload: CreateEventPayload,
  ): Promise<ApiResponse<Event>> {
    const { data, error } = await this.supabase
      .from('events')
      .insert({
        title: payload.title,
        description: payload.description,
        company_id: companyId,
        event_date: payload.event_date,
        event_time: payload.event_time ?? null,
        location: payload.location,
        location_url: payload.location_url ?? null,
        category: payload.category,
        banner_url: payload.banner_url ?? null,
        max_attendees: payload.max_attendees ?? null,
        current_attendees: 0,
        status: 'pending',
        requirements: payload.requirements ?? null,
        coin_reward: payload.coin_reward,
        created_by: userId,
      })
      .select()
      .single();
    if (error) return { data: null, error: { code: 'CREATE_FAILED', message: error.message } };
    return { data: data as unknown as Event, error: null };
  }

  async updateEventStatus(
    eventId: string,
    adminId: string,
    payload: UpdateEventStatusPayload,
  ): Promise<ApiResponse<Event>> {
    const { data, error } = await this.supabase
      .from('events')
      .update({
        status: payload.status,
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        rejection_reason: payload.rejection_reason ?? null,
      })
      .eq('id', eventId)
      .select('*, company:companies(*)')
      .single();
    if (error || !data) return { data: null, error: { code: 'UPDATE_FAILED', message: error?.message ?? 'Not found' } };

    const statusText = payload.status === 'approved' ? 'approved' : 'rejected';
    await this.supabase.from('notifications').insert({
      user_id: data.created_by,
      title: `Event ${statusText}`,
      body: `Your event "${data.title}" has been ${statusText}.`,
      type: 'event_status',
      reference_id: eventId,
    });

    return { data: data as unknown as Event, error: null };
  }

  async applyForEvent(
    eventId: string,
    userId: string,
    note?: string,
  ): Promise<ApiResponse<EventApplication>> {
    // Check for existing application to prevent duplicates
    const { data: existing } = await this.supabase
      .from('event_applications')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();
    if (existing) {
      return { data: null, error: { code: 'ALREADY_APPLIED', message: 'You have already applied for this event' } };
    }

    const { data, error } = await this.supabase
      .from('event_applications')
      .insert({ event_id: eventId, user_id: userId, status: 'pending', note: note ?? null })
      .select()
      .single();
    if (error) return { data: null, error: { code: 'APPLY_FAILED', message: error.message } };
    return { data: data as unknown as EventApplication, error: null };
  }

  async getMyApplications(userId: string): Promise<ApiResponse<EventApplication[]>> {
    const { data, error } = await this.supabase
      .from('event_applications')
      .select('*, event:events(*)')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as EventApplication[], error: null };
  }

  async getEventApplications(eventId: string): Promise<ApiResponse<EventApplication[]>> {
    // profiles is referenced by both user_id and reviewed_by — the embed must
    // name the FK or PostgREST rejects it as ambiguous and returns no rows.
    const { data, error } = await this.supabase
      .from('event_applications')
      .select('*, user:profiles!user_id(*)')
      .eq('event_id', eventId)
      .order('applied_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as EventApplication[], error: null };
  }

  async updateApplicationStatus(
    applicationId: string,
    adminId: string,
    status: ApplicationStatus,
  ): Promise<ApiResponse<EventApplication>> {
    // Get current application to know its previous status and event_id
    const { data: current } = await this.supabase
      .from('event_applications')
      .select('status, event_id, user_id')
      .eq('id', applicationId)
      .single();

    const { data, error } = await this.supabase
      .from('event_applications')
      .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: adminId })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };

    // Update current_attendees count on the event
    if (current) {
      const wasApproved = current.status === 'approved';
      const isNowApproved = status === 'approved';

      if (!wasApproved && isNowApproved) {
        await this.supabase.rpc('increment_attendees', { event_id_input: current.event_id });
      } else if (wasApproved && !isNowApproved) {
        await this.supabase.rpc('decrement_attendees', { event_id_input: current.event_id });
      }

      // Notify the applicant
      const statusLabel = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : status;
      await this.supabase.from('notifications').insert({
        user_id: current.user_id,
        title: `Application ${statusLabel}`,
        body: `Your event application has been ${statusLabel}.`,
        type: 'application_status',
        reference_id: current.event_id,
      });
    }

    return { data: data as unknown as EventApplication, error: null };
  }

  async withdrawApplication(applicationId: string, userId: string): Promise<ApiResponse<EventApplication>> {
    const { data, error } = await this.supabase
      .from('event_applications')
      .update({ status: 'withdrawn' })
      .eq('id', applicationId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as EventApplication, error: null };
  }

  async updateEventVertical(eventId: string, verticalId: string | null): Promise<void> {
    const { error } = await this.supabase.from('events').update({
      vertical_id: verticalId,
      vertical_assigned_at: new Date().toISOString(),
    }).eq('id', eventId);
    if (error) throw error;
  }
}
