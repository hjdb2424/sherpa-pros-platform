// =============================================================================
// Sherpa Pros Platform — Database Types
// Auto-generated from schema.sql — keep in sync
// =============================================================================

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type UserRole = "pro" | "client";

export type OnboardingStatus =
  | "draft"
  | "pending_verification"
  | "active"
  | "paused"
  | "archived";

export type BackgroundCheckStatus = "none" | "pending" | "passed" | "failed";

export type BadgeTier = "bronze" | "silver" | "gold";

export type AvailabilityStatus = "available" | "booked" | "blocked";

export type HubRegion = "NH" | "ME" | "MA";

export type JobUrgency = "emergency" | "standard" | "flexible";

export type JobStatus =
  | "draft"
  | "posted"
  | "accepting_bids"
  | "dispatching"
  | "assigned"
  | "in_progress"
  | "completed"
  | "reviewed"
  | "closed"
  | "cancelled";

export type DispatchType = "auto" | "bid";

export type MilestoneStatus =
  | "pending"
  | "funded"
  | "in_progress"
  | "completed"
  | "released";

export type PhotoPhase = "before" | "during" | "after";

export type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type DispatchResponse = "accepted" | "declined" | "expired";

export type PaymentStatus =
  | "pending"
  | "held"
  | "released"
  | "refunded"
  | "disputed";

export type DisputeStatus = "open" | "mediation" | "escalated" | "resolved";

export type ConversationStatus = "active" | "closed";

export type StrikeSeverity = "warning" | "minor" | "major" | "critical";

export type ChecklistType = "onboarding" | "offboarding";

// ---------------------------------------------------------------------------
// Row types — what you get back from SELECT *
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Hub {
  id: string;
  name: string;
  region: HubRegion;
  center: unknown; // PostGIS GEOGRAPHY — serialized by driver
  radius_km: number;
  dispatch_threshold_cents: number;
  is_active: boolean;
  config: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface Pro {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  home_hub_id: string | null;
  travel_radius_km: number;
  onboarding_status: OnboardingStatus;
  license_number: string | null;
  license_state: string | null;
  insurance_provider: string | null;
  insurance_expiry: Date | null;
  insurance_verified: boolean;
  background_check_status: BackgroundCheckStatus;
  background_check_date: Date | null;
  rating_score: number;
  visibility_score: number;
  badge_tier: BadgeTier;
  joined_at: Date;
  location: unknown; // PostGIS GEOGRAPHY
  created_at: Date;
  updated_at: Date;
}

export interface ProTrade {
  id: string;
  pro_id: string;
  trade_category: string;
  specialty: string | null;
  experience_years: number;
  is_primary: boolean;
  created_at: Date;
}

export interface ProCertification {
  id: string;
  pro_id: string;
  cert_type: string;
  cert_number: string | null;
  issuer: string;
  issued_date: Date;
  expiry_date: Date | null;
  verified: boolean;
  created_at: Date;
}

export interface ProPortfolio {
  id: string;
  pro_id: string;
  title: string;
  description: string | null;
  photos: unknown[]; // JSONB array of photo objects
  project_value: number | null; // cents
  category: string | null;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProAvailability {
  id: string;
  pro_id: string;
  date: Date | null;
  status: AvailabilityStatus;
  recurring_day_of_week: number | null; // 0=Sun, 6=Sat
  created_at: Date;
}

export interface HubPro {
  id: string;
  hub_id: string;
  pro_id: string;
  is_home_hub: boolean;
  joined_at: Date;
}

export interface Job {
  id: string;
  client_user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  urgency: JobUrgency;
  budget_min_cents: number | null;
  budget_max_cents: number | null;
  location: unknown; // PostGIS GEOGRAPHY
  address: string | null;
  hub_id: string | null;
  status: JobStatus;
  dispatch_type: DispatchType;
  permit_required: boolean;
  permit_details: Record<string, unknown>;
  wiseman_validation: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface JobMilestone {
  id: string;
  job_id: string;
  title: string;
  description: string | null;
  amount_cents: number;
  sort_order: number;
  status: MilestoneStatus;
  funded_at: Date | null;
  completed_at: Date | null;
  released_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface JobPhoto {
  id: string;
  job_id: string;
  milestone_id: string | null;
  phase: PhotoPhase;
  url: string;
  caption: string | null;
  uploaded_by: string;
  created_at: Date;
}

export interface Bid {
  id: string;
  job_id: string;
  pro_id: string;
  amount_cents: number;
  message: string | null;
  estimated_duration_days: number | null;
  wiseman_deviation_pct: number | null;
  status: BidStatus;
  created_at: Date;
  updated_at: Date;
}

export interface DispatchAttempt {
  id: string;
  job_id: string;
  pro_id: string;
  dispatch_score: number | null;
  notified_at: Date;
  responded_at: Date | null;
  response: DispatchResponse | null;
  attempt_order: number;
  created_at: Date;
}

export interface Rating {
  id: string;
  job_id: string;
  from_user_id: string;
  to_user_id: string;
  overall_score: number;
  quality: number | null;
  communication: number | null;
  timeliness: number | null;
  value: number | null;
  review_text: string | null;
  created_at: Date;
}

export interface RatingResponse {
  id: string;
  rating_id: string;
  responder_id: string;
  body: string;
  created_at: Date;
  updated_at: Date;
}

export interface Strike {
  id: string;
  pro_id: string;
  reason: string;
  severity: StrikeSeverity;
  issued_at: Date;
  resolved_at: Date | null;
  notes: string | null;
}

export interface Payment {
  id: string;
  job_id: string;
  milestone_id: string | null;
  payer_user_id: string;
  payee_user_id: string;
  amount_cents: number;
  commission_cents: number;
  service_fee_cents: number;
  stripe_payment_intent_id: string | null;
  status: PaymentStatus;
  held_at: Date | null;
  released_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentDispute {
  id: string;
  payment_id: string;
  raised_by: string;
  reason: string;
  evidence: Record<string, unknown>;
  status: DisputeStatus;
  resolution: string | null;
  resolved_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Conversation {
  id: string;
  job_id: string;
  pro_user_id: string;
  client_user_id: string;
  twilio_conversation_sid: string | null;
  status: ConversationStatus;
  created_at: Date;
  closed_at: Date | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  body: string;
  created_at: Date;
}

export interface ChecklistItem {
  label: string;
  checked: boolean;
}

export interface JobChecklist {
  id: string;
  job_id: string;
  type: ChecklistType;
  items: ChecklistItem[];
  completed_at: Date | null;
  required: boolean;
  created_at: Date;
  updated_at: Date;
}

// ---------------------------------------------------------------------------
// Insert types — omit server-generated fields
// ---------------------------------------------------------------------------

export type UserInsert = Omit<User, "id" | "created_at" | "updated_at">;

export type HubInsert = Omit<Hub, "id" | "created_at" | "updated_at">;

export type ProInsert = Omit<Pro, "id" | "created_at" | "updated_at">;

export type ProTradeInsert = Omit<ProTrade, "id" | "created_at">;

export type ProCertificationInsert = Omit<ProCertification, "id" | "created_at">;

export type ProPortfolioInsert = Omit<
  ProPortfolio,
  "id" | "created_at" | "updated_at"
>;

export type ProAvailabilityInsert = Omit<ProAvailability, "id" | "created_at">;

export type HubProInsert = Omit<HubPro, "id" | "joined_at">;

export type JobInsert = Omit<Job, "id" | "created_at" | "updated_at">;

export type JobMilestoneInsert = Omit<
  JobMilestone,
  "id" | "created_at" | "updated_at"
>;

export type JobPhotoInsert = Omit<JobPhoto, "id" | "created_at">;

export type BidInsert = Omit<Bid, "id" | "created_at" | "updated_at">;

export type DispatchAttemptInsert = Omit<DispatchAttempt, "id" | "created_at">;

export type RatingInsert = Omit<Rating, "id" | "created_at">;

export type RatingResponseInsert = Omit<
  RatingResponse,
  "id" | "created_at" | "updated_at"
>;

export type StrikeInsert = Omit<Strike, "id" | "issued_at">;

export type PaymentInsert = Omit<Payment, "id" | "created_at" | "updated_at">;

export type PaymentDisputeInsert = Omit<
  PaymentDispute,
  "id" | "created_at" | "updated_at"
>;

export type ConversationInsert = Omit<Conversation, "id" | "created_at">;

export type MessageInsert = Omit<Message, "id" | "created_at">;

export type JobChecklistInsert = Omit<
  JobChecklist,
  "id" | "created_at" | "updated_at"
>;
