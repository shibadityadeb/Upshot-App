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
    let query = this.supabase
      .from('events')
      .select('*, companies(*)', { count: 'exact' })
      .eq('status', 'approved')
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
      .select('*, companies(*)')
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
      .select('*, companies(*)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Event[], error: null };
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
      .select('*, companies(*)')
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
      .select('*, events(*)')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as EventApplication[], error: null };
  }

  async getEventApplications(eventId: string): Promise<ApiResponse<EventApplication[]>> {
    const { data, error } = await this.supabase
      .from('event_applications')
      .select('*, profiles(*)')
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
    const { data, error } = await this.supabase
      .from('event_applications')
      .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: adminId })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as EventApplication, error: null };
  }

  async withdrawApplication(applicationId: string): Promise<ApiResponse<EventApplication>> {
    const { data, error } = await this.supabase
      .from('event_applications')
      .update({ status: 'withdrawn' })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as EventApplication, error: null };
  }
}
