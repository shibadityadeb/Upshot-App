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
    if (!userId) return { data: [], error: null };
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', userId)
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Task[], error: null };
  }

  async getTasksForGroup(groups: TaskTargetGroup[], userId?: string): Promise<ApiResponse<Task[]>> {
    // No audience means no tasks — never fall through to an unfiltered query.
    if (groups.length === 0) return { data: [], error: null };

    // Only return group tasks still in 'assigned' status (the originals, not personal copies).
    // RLS (migration 023) independently restricts these to the caller's audience; this
    // filter just avoids fetching rows the policy would drop anyway.
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .in('target_group', groups)
      .eq('status', 'assigned')
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };

    let groupTasks = (data ?? []) as unknown as Task[];

    // Hide group tasks this user already submitted. Matched on source_task_id — the
    // old title+assigned_by key collided whenever one admin reused a title, which
    // hid an unrelated task permanently.
    if (userId && groupTasks.length > 0) {
      const { data: myCopies, error: copiesError } = await this.supabase
        .from('tasks')
        .select('source_task_id')
        .eq('assigned_to', userId)
        .not('source_task_id', 'is', null);

      if (copiesError?.message?.includes('source_task_id')) {
        // Pre-migration-023 database: fall back to the old title + assigned_by
        // match so submitted tasks still leave the list. Imprecise when one admin
        // reuses a title, which is exactly why 023 introduced source_task_id.
        const { data: legacy } = await this.supabase
          .from('tasks')
          .select('title, assigned_by')
          .eq('assigned_to', userId)
          .in('status', ['submitted', 'approved', 'rejected']);
        const keys = new Set((legacy ?? []).map((t: any) => `${t.title}::${t.assigned_by}`));
        groupTasks = groupTasks.filter((t) => !keys.has(`${t.title}::${t.assigned_by}`));
      } else if (myCopies && myCopies.length > 0) {
        const submitted = new Set(myCopies.map((t: any) => t.source_task_id as string));
        groupTasks = groupTasks.filter((t) => !submitted.has(t.id));
      }
    }

    return { data: groupTasks, error: null };
  }

  async getAllTasksAdmin(): Promise<ApiResponse<Task[]>> {
    // Fetch all tasks
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };

    const tasks = (data ?? []) as unknown as Task[];

    // Fetch assignee profiles separately (avoids ambiguous FK join issues)
    const assigneeIds = [...new Set(tasks.map((t) => t.assigned_to).filter(Boolean))] as string[];
    if (assigneeIds.length > 0) {
      const { data: profiles } = await this.supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', assigneeIds);

      if (profiles) {
        const profileMap = new Map(profiles.map((p: any) => [p.id, p]));
        for (const task of tasks as any[]) {
          task.assignee = profileMap.get(task.assigned_to) ?? null;
        }
      }
    }

    return { data: tasks, error: null };
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

  async submitTask(
    taskId: string,
    payload: SubmitTaskPayload,
    userId?: string,
  ): Promise<ApiResponse<Task>> {
    // If userId provided, verify ownership and handle group tasks
    if (userId) {
      // Fetch the task first
      const { data: task, error: fetchError } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (fetchError || !task) {
        return { data: null, error: { code: 'NOT_FOUND', message: 'Task not found' } };
      }

      // Check if already submitted/approved
      if (task.status === 'submitted' || task.status === 'approved') {
        return { data: null, error: { code: 'ALREADY_SUBMITTED', message: 'This task has already been submitted' } };
      }

      const isGroupTask = task.assigned_to !== userId && task.target_group !== null;

      if (isGroupTask) {
        // Clone: create a personal copy with the submission data
        // Original group task stays untouched for other users
        // The integrity trigger (migration 023) rewrites title/description/coin_value
        // and friends from source_task_id, so these values are a convenience for
        // older databases — the reward can no longer be set from the client.
        const row: Record<string, unknown> = {
          title: task.title,
          description: task.description,
          event_id: task.event_id,
          assigned_to: userId,
          assigned_by: task.assigned_by,
          target_group: null, // personal copy, not a group task
          status: 'submitted',
          due_date: task.due_date,
          coin_value: task.coin_value,
          submission_url: payload.submission_url ?? null,
          submission_note: payload.submission_note ?? null,
          submitted_at: new Date().toISOString(),
        };

        let { data: clone, error: cloneError } = await this.supabase
          .from('tasks')
          .insert({ ...row, source_task_id: task.id })
          .select()
          .single();

        // Databases without migration 023 have no source_task_id column. Retry
        // without it — same pattern as createTask() and target_group. Once 023 is
        // applied the first insert succeeds and the integrity trigger takes over
        // (it requires source_task_id, so this fallback stops being reachable).
        if (cloneError?.message?.includes('source_task_id')) {
          ({ data: clone, error: cloneError } = await this.supabase
            .from('tasks')
            .insert(row)
            .select()
            .single());
        }

        if (cloneError || !clone) {
          return { data: null, error: { code: 'CREATE_FAILED', message: cloneError?.message ?? 'Failed to submit' } };
        }
        return { data: clone as unknown as Task, error: null };
      }

      // Personal task: verify ownership then update in place
      if (task.assigned_to !== userId) {
        return { data: null, error: { code: 'FORBIDDEN', message: 'This task is not assigned to you' } };
      }
    }

    // Update the task (personal task or legacy call without userId)
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

  async getMyPendingTasks(userId: string): Promise<ApiResponse<Task[]>> {
    if (!userId) return { data: [], error: null };
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', userId)
      .in('status', ['assigned', 'in_progress'])
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Task[], error: null };
  }

  async getMyCompletedTasks(userId: string): Promise<ApiResponse<Task[]>> {
    if (!userId) return { data: [], error: null };
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', userId)
      .in('status', ['submitted', 'approved', 'rejected'])
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as Task[], error: null };
  }

  async deleteTask(taskId: string): Promise<ApiResponse<null>> {
    // Delete only the specified task — no cascade
    const { error } = await this.supabase.from('tasks').delete().eq('id', taskId);
    if (error) return { data: null, error: { code: 'DELETE_FAILED', message: error.message } };
    return { data: null, error: null };
  }
}
