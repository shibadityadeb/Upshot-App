import type { PrismaClient } from '@upshot/database';
import type {
  ApiResponse,
  Task,
  CreateTaskPayload,
  SubmitTaskPayload,
} from '@upshot/types';

export class TasksService {
  constructor(private prisma: PrismaClient) {}

  async getMyTasks(userId: string): Promise<ApiResponse<Task[]>> {
    const tasks = await this.prisma.task.findMany({
      where: { assignedTo: userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });
    return { data: tasks as unknown as Task[], error: null };
  }

  async getAllTasksAdmin(): Promise<ApiResponse<Task[]>> {
    const tasks = await this.prisma.task.findMany({
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });
    return { data: tasks as unknown as Task[], error: null };
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!task) return { data: null, error: { code: 'NOT_FOUND', message: 'Task not found' } };
    return { data: task as unknown as Task, error: null };
  }

  async createTask(adminId: string, payload: CreateTaskPayload): Promise<ApiResponse<Task>> {
    const task = await this.prisma.task.create({
      data: {
        title: payload.title,
        description: payload.description,
        eventId: payload.event_id ?? null,
        assignedTo: payload.assigned_to,
        assignedBy: adminId,
        status: 'assigned',
        dueDate: payload.due_date ? new Date(payload.due_date) : null,
        coinValue: payload.coin_value,
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: payload.assigned_to,
        title: 'New task assigned',
        body: `You have been assigned a new task: "${payload.title}".`,
        type: 'task_assigned',
        referenceId: task.id,
      },
    });

    return { data: task as unknown as Task, error: null };
  }

  async submitTask(taskId: string, payload: SubmitTaskPayload): Promise<ApiResponse<Task>> {
    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'submitted',
        submissionUrl: payload.submission_url ?? null,
        submissionNote: payload.submission_note ?? null,
        submittedAt: new Date(),
      },
    });
    return { data: task as unknown as Task, error: null };
  }

  async reviewTask(
    taskId: string,
    adminId: string,
    approved: boolean,
    reviewNote?: string,
  ): Promise<ApiResponse<Task>> {
    const newStatus = approved ? 'approved' : 'rejected';

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus as any,
        reviewedAt: new Date(),
        reviewNote: reviewNote ?? null,
      },
    });

    if (approved) {
      // Award coins — the DB trigger on coin_transactions updates wallet_balances
      await this.prisma.coinTransaction.create({
        data: {
          userId: task.assignedTo,
          type: 'earned',
          amount: task.coinValue,
          description: `Task completed: ${task.title}`,
          referenceId: taskId,
          referenceType: 'task',
        },
      });
    }

    await this.prisma.notification.create({
      data: {
        userId: task.assignedTo,
        title: `Task ${newStatus}`,
        body: approved
          ? `Your task "${task.title}" was approved! You earned ${task.coinValue} coins.`
          : `Your task "${task.title}" was rejected.${reviewNote ? ` Reason: ${reviewNote}` : ''}`,
        type: 'task_review',
        referenceId: taskId,
      },
    });

    return { data: task as unknown as Task, error: null };
  }

  async deleteTask(taskId: string): Promise<ApiResponse<null>> {
    await this.prisma.task.delete({ where: { id: taskId } });
    return { data: null, error: null };
  }
}
