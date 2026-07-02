import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ApiResponse,
  UnfilteredVideo,
  CreateUnfilteredVideoPayload,
} from '@upshot/types';

export class UnfilteredService {
  constructor(private supabase: SupabaseClient) {}

  /** Get the latest N videos (default 10) */
  async getVideos(limit = 10): Promise<ApiResponse<UnfilteredVideo[]>> {
    const { data, error } = await this.supabase
      .from('unfiltered_videos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as UnfilteredVideo[], error: null };
  }

  /** Get the single featured video (most recent featured, fallback to newest) */
  async getFeaturedVideo(): Promise<ApiResponse<UnfilteredVideo | null>> {
    // Try featured first
    const { data: featured } = await this.supabase
      .from('unfiltered_videos')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (featured) return { data: featured as unknown as UnfilteredVideo, error: null };

    // Fallback to newest
    const { data: newest } = await this.supabase
      .from('unfiltered_videos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return { data: (newest as unknown as UnfilteredVideo) ?? null, error: null };
  }

  /** Admin: add a new video */
  async addVideo(
    adminId: string,
    payload: CreateUnfilteredVideoPayload,
  ): Promise<ApiResponse<UnfilteredVideo>> {
    const { data, error } = await this.supabase
      .from('unfiltered_videos')
      .insert({
        youtube_url: payload.youtube_url,
        title: payload.title,
        description: payload.description ?? null,
        thumbnail_url: payload.thumbnail_url ?? null,
        is_featured: payload.is_featured ?? false,
        channel_url: payload.channel_url ?? null,
        created_by: adminId,
      })
      .select()
      .single();
    if (error) return { data: null, error: { code: 'CREATE_FAILED', message: error.message } };
    return { data: data as unknown as UnfilteredVideo, error: null };
  }

  /** Admin: delete a video */
  async deleteVideo(videoId: string): Promise<ApiResponse<null>> {
    const { error } = await this.supabase
      .from('unfiltered_videos')
      .delete()
      .eq('id', videoId);
    if (error) return { data: null, error: { code: 'DELETE_FAILED', message: error.message } };
    return { data: null, error: null };
  }

  /** Admin: toggle featured status */
  async toggleFeatured(videoId: string, isFeatured: boolean): Promise<ApiResponse<UnfilteredVideo>> {
    // If setting as featured, un-feature all others first
    if (isFeatured) {
      await this.supabase
        .from('unfiltered_videos')
        .update({ is_featured: false })
        .eq('is_featured', true);
    }
    const { data, error } = await this.supabase
      .from('unfiltered_videos')
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq('id', videoId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as UnfilteredVideo, error: null };
  }
}
