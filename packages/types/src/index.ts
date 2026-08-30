// ─── Enums ───────────────────────────────────────────────

export type UserRole = 'admin' | 'company' | 'people' | 'ambassador' | 'student' | 'host';

export type EventStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export type TaskStatus = 'assigned' | 'in_progress' | 'submitted' | 'approved' | 'rejected';

export type TransactionType = 'earned' | 'redeemed' | 'bonus' | 'penalty';

export type AmbassadorTier = 'bronze' | 'silver' | 'gold' | 'platinum';

// ─── Core Interfaces ─────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  description: string | null;
  contact_person_id: string;
  is_verified: boolean;
  can_discover_workforce: boolean;
  previous_work_description: string | null;
  logo_placeholder_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  company_id: string | null;
  company?: Company | null;
  event_date: string;
  event_time: string | null;
  location: string;
  location_url: string | null;
  category: string;
  banner_url: string | null;
  max_attendees: number | null;
  current_attendees: number;
  status: EventStatus;
  requirements: string | null;
  coin_reward: number;
  created_by: string;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  project_type: string | null;
  budget_range: string | null;
  vertical_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventApplication {
  id: string;
  event_id: string;
  event?: Event;
  user_id: string;
  user?: User;
  status: ApplicationStatus;
  note: string | null;
  applied_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export type TaskTargetGroup = 'campus_cartel' | 'students' | 'ambassadors';

export interface Task {
  id: string;
  title: string;
  description: string;
  event_id: string | null;
  event?: Event;
  assigned_to: string | null;
  assigned_by: string;
  assignee?: User;
  target_group: TaskTargetGroup | null;
  /** Set on a personal submission copy — points at the group task it was cloned from. */
  source_task_id?: string | null;
  status: TaskStatus;
  due_date: string | null;
  coin_value: number;
  submission_url: string | null;
  submission_note: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Task due dates ──────────────────────────────────────
//
// A task with a due date does not live forever. Once the date passes it is
// flagged as overdue, and after a grace window it drops out of the lists
// altogether so nobody is scrolling past work that can no longer be done.
//
// The windows differ by who is looking: the people doing the work lose sight of
// it quickly, while an admin keeps it around long enough to chase or clean up.
// Both apps import this so the two never drift apart.

export type TaskAudience = 'member' | 'admin';

/** Days between the due date passing and the task disappearing from a list. */
export const TASK_HIDE_AFTER_DUE_DAYS: Record<TaskAudience, number> = {
  member: 3,
  admin: 7,
};

/**
 * `none`    — no due date, so it never ages out
 * `ongoing` — still has time on the clock
 * `overdue` — the date has passed; shown with a badge
 * `expired` — past the grace window; hidden from the list
 */
export type TaskDueState = 'none' | 'ongoing' | 'overdue' | 'expired';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Midnight at the end of the due day, in local time.
 *
 * due_date is a plain calendar date ('2026-08-30'), so a task due today is
 * still ongoing all of today — the clock runs out when the day does. Parsing the
 * parts by hand rather than `new Date(str)` avoids that string being read as UTC
 * and shifting the deadline by a day for anyone east or west of it.
 */
function endOfDueDay(dueDate: string): number | null {
  const [y, m, d] = dueDate.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d + 1).getTime();
}

export function taskDueState(
  dueDate: string | null | undefined,
  audience: TaskAudience,
  now: number = Date.now(),
): TaskDueState {
  if (!dueDate) return 'none';

  const deadline = endOfDueDay(dueDate);
  if (deadline === null) return 'none';
  if (now < deadline) return 'ongoing';

  const hiddenFrom = deadline + TASK_HIDE_AFTER_DUE_DAYS[audience] * DAY_MS;
  return now < hiddenFrom ? 'overdue' : 'expired';
}

/**
 * Whether a task still belongs in a list.
 *
 * A task awaiting review is kept regardless of age: somebody did the work and is
 * owed an answer, and hiding it would strand the submission — the member could
 * not see it pending and the admin could not review it.
 */
export function isTaskVisible(
  task: Pick<Task, 'due_date' | 'status'>,
  audience: TaskAudience,
  now: number = Date.now(),
): boolean {
  if (task.status === 'submitted') return true;
  return taskDueState(task.due_date, audience, now) !== 'expired';
}

export interface WalletBalance {
  user_id: string;
  total_earned: number;
  total_redeemed: number;
  current_balance: number;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
}

export interface Ambassador {
  id: string;
  user_id: string;
  user?: User;
  referral_code: string;
  referral_count: number;
  total_coins_earned: number;
  tier: AmbassadorTier;
  is_active: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  user?: User;
  college: string | null;
  course: string | null;
  year_of_study: number | null;
  profession: string | null;
  organisation_name: string | null;
  ambassador_code: string | null;
  referred_by: string | null;
  status: 'pending' | 'approved' | 'rejected';
  city: string | null;
  state: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

// ─── API Wrappers ────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export type ApiResult<T> = ApiResponse<T>;

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── Form / Payload Types ────────────────────────────────

export interface CreateEventPayload {
  title: string;
  description: string;
  event_date: string;
  event_time?: string;
  location: string;
  location_url?: string;
  category: string;
  banner_url?: string;
  max_attendees?: number;
  requirements?: string;
  coin_reward: number;
  project_type?: string;
  budget_range?: string;
}

export interface UpdateEventStatusPayload {
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  event_id?: string;
  assigned_to?: string;
  target_group?: TaskTargetGroup;
  due_date?: string;
  coin_value: number;
}

export interface SubmitTaskPayload {
  submission_url?: string;
  submission_note?: string;
}

export interface RegisterStudentPayload {
  email: string;
  password: string;
  full_name: string;
  college?: string;
  course?: string;
  year_of_study?: number;
  profession?: string;
  organisation_name?: string;
  ambassador_code?: string;
}

// ─── Hosts ───────────────────────────────────────────────

export interface Host {
  id: string;
  user_id: string;
  user?: User;
  org_legal_name: string;
  org_city: string;
  org_state: string;
  org_sector: string;
  org_website: string | null;
  designation: string;
  department: string | null;
  contact_phone: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegisterHostPayload {
  // Step 1 — personal
  email: string;
  password: string;
  full_name: string;
  contact_phone: string;
  // Step 2 — company
  org_legal_name: string;
  org_city: string;
  org_state: string;
  org_sector: string;
  org_website?: string;
  // Step 3 — position
  designation: string;
  department?: string;
}

/** An event created by a host, with its live participant counts. */
export interface HostedEvent extends Event {
  approved_participants: number;
  /** Applied once the event was full — promoted automatically as seats free up. */
  waitlisted_participants: number;
}

// ─── Phase 3: Verticals, Content, Workforce ──────────────

export interface Vertical {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  color: string;
  cover_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ContentPost {
  id: string;
  vertical_id: string;
  vertical?: Vertical;
  title: string;
  subtitle?: string;
  body?: string;
  cover_url?: string;
  speaker_name?: string;
  speaker_role?: string;
  speaker_avatar_url?: string;
  content_type: 'episode' | 'article' | 'event_recap' | 'thought_leadership' | 'announcement';
  is_featured: boolean;
  published_at?: string;
  created_by?: string;
  created_at: string;
}

export interface WorkforceProfile {
  id: string;
  user_id: string;
  user?: User;
  city?: string;
  state?: string;
  bio?: string;
  skills: string[];
  experience_years: number;
  past_work_description?: string;
  portfolio_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface AmbassadorCode {
  id: string;
  code: string;
  code_type: 'random' | 'custom';
  vertical_id?: string;
  vertical?: Vertical;
  assigned_to?: string;
  assigned_user?: User;
  is_claimed: boolean;
  is_active: boolean;
  issued_by: string;
  issuer?: User;
  notes?: string;
  created_at: string;
  claimed_at?: string;
}

export interface CreateAmbassadorCodePayload {
  code_type: 'random' | 'custom';
  custom_code?: string;
  vertical_id?: string;
  notes?: string;
}

// ─── Unfiltered Videos ─────────────────────────────────

export interface UnfilteredVideo {
  id: string;
  youtube_url: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  channel_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUnfilteredVideoPayload {
  youtube_url: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  is_featured?: boolean;
  channel_url?: string;
}

// ─── Unfiltered Feature Requests (guest / podcast applications) ───────────────

export type UnfilteredFeatureRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'contacted';

export interface UnfilteredFeatureRequest {
  id: string;
  user_id: string;
  user?: User;
  full_name: string;
  email: string;
  phone: string | null;
  expertise: string | null;
  organisation: string | null;
  topic: string;
  bio: string | null;
  social_url: string | null;
  status: UnfilteredFeatureRequestStatus;
  admin_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUnfilteredFeatureRequestPayload {
  full_name: string;
  email: string;
  phone?: string;
  expertise?: string;
  organisation?: string;
  topic: string;
  bio?: string;
  social_url?: string;
}

// ─── Hosting Applications ───────────────────────────────

export type HostingApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface HostingApplication {
  id: string;
  user_id: string;
  user?: User;
  // Personal details
  applicant_name: string;
  applicant_phone: string;
  applicant_email: string;
  event_type: 'organisation' | 'personal';
  // Organisation details (null if personal)
  org_legal_name: string | null;
  org_city: string | null;
  org_state: string | null;
  org_sector: string | null;
  org_designation: string | null;
  // Event details
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string;
  event_city: string;
  event_state: string;
  location_url: string | null;
  category: string;
  max_attendees: number | null;
  fees: number | null;
  requirements: string | null;
  cover_image_url: string | null;
  status: HostingApplicationStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHostingApplicationPayload {
  // Personal details
  applicant_name: string;
  applicant_phone: string;
  applicant_email: string;
  event_type: 'organisation' | 'personal';
  // Organisation details
  org_legal_name?: string;
  org_city?: string;
  org_state?: string;
  org_sector?: string;
  org_designation?: string;
  // Event details
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  location: string;
  event_city: string;
  event_state: string;
  location_url?: string;
  category?: string;
  max_attendees?: number;
  fees?: number;
  requirements?: string;
  cover_image_url?: string;
}
