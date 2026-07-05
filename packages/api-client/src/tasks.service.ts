import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ApiResponse,
  Task,
  TaskTargetGroup,
  CreateTaskPayload,
  SubmitTaskPayload,
} from '@upshot/types';

export class TasksService {
  constructor(private supabase: SupabaseClient) {}

  async getMyTasks(userId: string): Promise<ApiResponse<Task[]>> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', userId)
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Task[], error: null };
  }

  async getTasksForGroup(groups: TaskTargetGroup[]): Promise<ApiResponse<Task[]>> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .in('target_group', groups)
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Task[], error: null };
  }

  async getAllTasksAdmin(): Promise<ApiResponse<Task[]>> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Task[], error: null };
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return { data: null, error: { code: 'NOT_FOUND', message: 'Task not found' } };
    return { data: data as unknown as Task, error: null };
  }

  async createTask(adminId: string, payload: CreateTaskPayload): Promise<ApiResponse<Task>> {
    // Build insert row — only include target_group if the column exists
    const row: Record<string, unknown> = {
      title: payload.title,
      description: payload.description,
      event_id: payload.event_id ?? null,
      assigned_to: payload.assigned_to ?? adminId,
      assigned_by: adminId,
      status: 'assigned',
      due_date: payload.due_date ?? null,
      coin_value: payload.coin_value,
    };

    // First attempt with target_group
    const { data, error } = await this.supabase
      .from('tasks')
      .insert({ ...row, target_group: payload.target_group })
      .select()
      .single();

    // If target_group column doesn't exist, retry without it
    if (error?.message?.includes('target_group')) {
      const { data: d2, error: e2 } = await this.supabase
        .from('tasks')
        .insert(row)
        .select()
        .single();
      if (e2 || !d2) return { data: null, error: { code: 'CREATE_FAILED', message: e2?.message ?? 'Failed' } };
      return { data: d2 as unknown as Task, error: null };
    }

    if (error || !data) return { data: null, error: { code: 'CREATE_FAILED', message: error?.message ?? 'Failed' } };
    return { data: data as unknown as Task, error: null };
  }

  async submitTask(taskId: string, payload: SubmitTaskPayload): Promise<ApiResponse<Task>> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({
        status: 'submitted',
        submission_url: payload.submission_url ?? null,
        submission_note: payload.submission_note ?? null,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: data as unknown as Task, error: null };
  }

  async reviewTask(
    taskId: string,
    adminId: string,
    approved: boolean,
    reviewNote?: string,
  ): Promise<ApiResponse<Task>> {
    const newStatus = approved ? 'approved' : 'rejected';

    const { data, error } = await this.supabase
      .from('tasks')
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        review_note: reviewNote ?? null,
      })
      .eq('id', taskId)
      .select()
      .single();
    if (error || !data) return { data: null, error: { code: 'UPDATE_FAILED', message: error?.message ?? 'Failed' } };

    if (approved) {
      await this.supabase.from('coin_transactions').insert({
        user_id: data.assigned_to,
        type: 'earned',
        amount: data.coin_value,
        description: `Task completed: ${data.title}`,
        reference_id: taskId,
        reference_type: 'task',
      });
    }

    await this.supabase.from('notifications').insert({
      user_id: data.assigned_to,
      title: `Task ${newStatus}`,
      body: approved
        ? `Your task "${data.title}" was approved! You earned ${data.coin_value} coins.`
        : `Your task "${data.title}" was rejected.${reviewNote ? ` Reason: ${reviewNote}` : ''}`,
      type: 'task_review',
      reference_id: taskId,
    });

    return { data: data as unknown as Task, error: null };
  }

  async deleteTask(taskId: string): Promise<ApiResponse<null>> {
    const { error } = await this.supabase.from('tasks').delete().eq('id', taskId);
    if (error) return { data: null, error: { code: 'DELETE_FAILED', message: error.message } };
    return { data: null, error: null };
  }
}
