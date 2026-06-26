// ─── Enums ───────────────────────────────────────────────

export type UserRole = 'admin' | 'company' | 'people' | 'ambassador' | 'student';

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
  company_id: string;
  company?: Company;
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

export interface Task {
  id: string;
  title: string;
  description: string;
  event_id: string | null;
  event?: Event;
  assigned_to: string;
  assigned_by: string;
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
  assigned_to: string;
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
