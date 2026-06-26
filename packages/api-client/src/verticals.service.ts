import type { SupabaseClient } from '@supabase/supabase-js';
import type { Vertical, ContentPost, Event } from '@upshot/types';

export class VerticalsService {
  constructor(private supabase: SupabaseClient) {}

  async getAllVerticals(): Promise<Vertical[]> {
    const { data, error } = await this.supabase
      .from('verticals')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return (data ?? []) as unknown as Vertical[];
  }

  async getVerticalBySlug(slug: string): Promise<Vertical> {
    const { data, error } = await this.supabase
      .from('verticals')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data as unknown as Vertical;
  }

  async getFeaturedPosts(limit = 6): Promise<ContentPost[]> {
    const { data, error } = await this.supabase
      .from('content_posts')
      .select('*, vertical:verticals(id, name, color, slug)')
      .eq('is_featured', true)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as ContentPost[];
  }

  async getPostsByVertical(verticalId: string, limit = 10): Promise<ContentPost[]> {
    const { data, error } = await this.supabase
      .from('content_posts')
      .select('*, vertical:verticals(id, name, color, slug)')
      .eq('vertical_id', verticalId)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as ContentPost[];
  }

  async getRecentEvents(limit = 8): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*, company:companies(id, name, logo_url), vertical:verticals(id, name, color, slug)')
      .eq('status', 'approved')
      .order('event_date', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as Event[];
  }
}
