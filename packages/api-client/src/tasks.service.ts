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
    // Only return group tasks still in 'assigned' status (the originals, not personal copies)
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .in('target_group', groups)
      .eq('status', 'assigned')
      .order('created_at', { ascending: false });
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };

    let groupTasks = (data ?? []) as unknown as Task[];

    // If userId provided, exclude group tasks the user has already submitted (has a personal copy)
    if (userId && groupTasks.length > 0) {
      const { data: myTasks } = await this.supabase
        .from('tasks')
        .select('title, assigned_by')
        .eq('assigned_to', userId)
        .in('status', ['submitted', 'approved', 'rejected']);

      if (myTasks && myTasks.length > 0) {
        const submittedKeys = new Set(
          myTasks.map((t: any) => `${t.title}::${t.assigned_by}`),
        );
        groupTasks = groupTasks.filter(
          (t) => !submittedKeys.has(`${t.title}::${t.assigned_by}`),
        );
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
        const { data: clone, error: cloneError } = await this.supabase
          .from('tasks')
          .insert({
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
          })
          .select()
          .single();

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

  async deleteTask(taskId: string): Promise<ApiResponse<null>> {
    // Fetch the task first to check if it's a group task
    const { data: task } = await this.supabase
      .from('tasks')
      .select('title, assigned_by, target_group')
      .eq('id', taskId)
      .single();

    // Delete the task itself
    const { error } = await this.supabase.from('tasks').delete().eq('id', taskId);
    if (error) return { data: null, error: { code: 'DELETE_FAILED', message: error.message } };

    // If it was a group task, also delete all personal copies (cloned submissions)
    if (task?.target_group) {
      await this.supabase
        .from('tasks')
        .delete()
        .eq('title', task.title)
        .eq('assigned_by', task.assigned_by)
        .is('target_group', null);
    }

    return { data: null, error: null };
  }
}
