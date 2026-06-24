import type { PrismaClient } from '@upshot/database';
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
  constructor(private prisma: PrismaClient) {}

  async getApprovedEvents(
    page: number = 1,
    perPage: number = 20,
    category?: string,
  ): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const where = {
      status: 'approved' as const,
      ...(category ? { category } : {}),
    };

    const [data, count] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: { company: true },
        orderBy: { eventDate: 'asc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: {
        data: data as unknown as Event[],
        count,
        page,
        per_page: perPage,
        total_pages: Math.ceil(count / perPage),
      },
      error: null,
    };
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { company: true },
    });
    if (!event) return { data: null, error: { code: 'NOT_FOUND', message: 'Event not found' } };
    return { data: event as unknown as Event, error: null };
  }

  async getCompanyEvents(companyId: string): Promise<ApiResponse<Event[]>> {
    const events = await this.prisma.event.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    return { data: events as unknown as Event[], error: null };
  }

  async getAllEventsAdmin(status?: string): Promise<ApiResponse<Event[]>> {
    const events = await this.prisma.event.findMany({
      where: status ? { status: status as any } : undefined,
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    });
    return { data: events as unknown as Event[], error: null };
  }

  async createEvent(
    companyId: string,
    userId: string,
    payload: CreateEventPayload,
  ): Promise<ApiResponse<Event>> {
    const event = await this.prisma.event.create({
      data: {
        title: payload.title,
        description: payload.description,
        companyId,
        eventDate: new Date(payload.event_date),
        eventTime: payload.event_time ? new Date(`1970-01-01T${payload.event_time}`) : null,
        location: payload.location,
        locationUrl: payload.location_url ?? null,
        category: payload.category,
        bannerUrl: payload.banner_url ?? null,
        maxAttendees: payload.max_attendees ?? null,
        currentAttendees: 0,
        status: 'pending',
        requirements: payload.requirements ?? null,
        coinReward: payload.coin_reward,
        createdBy: userId,
      },
    });
    return { data: event as unknown as Event, error: null };
  }

  async updateEventStatus(
    eventId: string,
    adminId: string,
    payload: UpdateEventStatusPayload,
  ): Promise<ApiResponse<Event>> {
    const event = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        status: payload.status,
        approvedBy: adminId,
        approvedAt: new Date(),
        rejectionReason: payload.rejection_reason ?? null,
      },
      include: { company: true },
    });

    // Notify the event creator
    const statusText = payload.status === 'approved' ? 'approved' : 'rejected';
    await this.prisma.notification.create({
      data: {
        userId: event.createdBy,
        title: `Event ${statusText}`,
        body: `Your event "${event.title}" has been ${statusText}.`,
        type: 'event_status',
        referenceId: eventId,
      },
    });

    return { data: event as unknown as Event, error: null };
  }

  async applyForEvent(
    eventId: string,
    userId: string,
    note?: string,
  ): Promise<ApiResponse<EventApplication>> {
    const application = await this.prisma.eventApplication.create({
      data: {
        eventId,
        userId,
        status: 'pending',
        note: note ?? null,
      },
    });
    return { data: application as unknown as EventApplication, error: null };
  }

  async getMyApplications(userId: string): Promise<ApiResponse<EventApplication[]>> {
    const applications = await this.prisma.eventApplication.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { appliedAt: 'desc' },
    });
    return { data: applications as unknown as EventApplication[], error: null };
  }

  async getEventApplications(eventId: string): Promise<ApiResponse<EventApplication[]>> {
    const applications = await this.prisma.eventApplication.findMany({
      where: { eventId },
      include: { user: true },
      orderBy: { appliedAt: 'desc' },
    });
    return { data: applications as unknown as EventApplication[], error: null };
  }

  async updateApplicationStatus(
    applicationId: string,
    adminId: string,
    status: ApplicationStatus,
  ): Promise<ApiResponse<EventApplication>> {
    const application = await this.prisma.eventApplication.update({
      where: { id: applicationId },
      data: {
        status: status as any,
        reviewedAt: new Date(),
        reviewedBy: adminId,
      },
    });
    return { data: application as unknown as EventApplication, error: null };
  }

  async withdrawApplication(applicationId: string): Promise<ApiResponse<EventApplication>> {
    const application = await this.prisma.eventApplication.update({
      where: { id: applicationId },
      data: { status: 'withdrawn' },
    });
    return { data: application as unknown as EventApplication, error: null };
  }
}
