import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse, EventSource } from '@upshot/types';

/**
 * Admin control over external event sources (Ticketmaster, schema.org feeds…).
 * Config only — API keys live in the Edge Function's secrets, never here.
 */
export class EventSourcesService {
  constructor(private supabase: SupabaseClient) {}

  async list(): Promise<ApiResponse<EventSource[]>> {
    const { data, error } = await this.supabase
      .from('event_sources')
      .select('*')
      .order('name', { ascending: true });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as EventSource[], error: null };
  }

  async update(
    id: string,
    patch: Partial<Pick<EventSource, 'enabled' | 'cities' | 'categories' | 'config'>>,
  ): Promise<ApiResponse<EventSource>> {
    const { data, error } = await this.supabase
      .from('event_sources')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as EventSource, error: null };
  }

  /** Run the ingestion worker now (admin only — the Edge Function verifies the caller). */
  async syncNow(): Promise<ApiResponse<{ summary: unknown }>> {
    const { data, error } = await this.supabase.functions.invoke('ingest-events', { body: {} });
    if (error) return { data: null, error: { code: 'SYNC_FAILED', message: error.message } };
    return { data: data as { summary: unknown }, error: null };
  }
}
