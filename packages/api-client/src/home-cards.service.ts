import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse, HomeCard, HomeCardPayload } from '@upshot/types';

/**
 * Admin-managed "Featured Experiences" cards on the home screen. Admins control
 * the cover image, title/subtitle, redirect link, CTA, order and how many cards
 * exist; everyone else reads the active ones in order.
 */
export class HomeCardsService {
  constructor(private supabase: SupabaseClient) {}

  /** Active cards for the home screen, in admin-defined order. */
  async getActiveCards(): Promise<ApiResponse<HomeCard[]>> {
    const { data, error } = await this.supabase
      .from('home_cards')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as HomeCard[], error: null };
  }

  /** Admin: every card, active or hidden. */
  async getAllCards(): Promise<ApiResponse<HomeCard[]>> {
    const { data, error } = await this.supabase
      .from('home_cards')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as HomeCard[], error: null };
  }

  async createCard(payload: HomeCardPayload): Promise<ApiResponse<HomeCard>> {
    const { data, error } = await this.supabase
      .from('home_cards')
      .insert({ ...payload })
      .select()
      .single();
    if (error) return { data: null, error: { code: 'CREATE_FAILED', message: error.message } };
    return { data: data as unknown as HomeCard, error: null };
  }

  async updateCard(id: string, payload: Partial<HomeCardPayload>): Promise<ApiResponse<HomeCard>> {
    const { data, error } = await this.supabase
      .from('home_cards')
      .update({ ...payload })
      .eq('id', id)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as HomeCard, error: null };
  }

  async deleteCard(id: string): Promise<ApiResponse<null>> {
    const { error } = await this.supabase.from('home_cards').delete().eq('id', id);
    if (error) return { data: null, error: { code: 'DELETE_FAILED', message: error.message } };
    return { data: null, error: null };
  }
}
