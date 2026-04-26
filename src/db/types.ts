// =============================================================================
// Sherpa Pros Platform — Database Types
// Auto-generated from schema.sql — keep in sync
// =============================================================================

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type UserRole = "pro" | "client" | "pm" | "tenant";

export type UserSubtype = string | null; // e.g., role-specific subtypes

export type VerificationStatus = "pending" | "approved" | "rejected";

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

export type JobMaterialStatus =
  | "recommended"
  | "approved"
  | "ordered"
  | "delivered"
  | "cancelled";

export type MaterialOrderStatus =
  | "pending"
  | "confirmed"
  | "ready_for_pickup"
  | "picked_up"
  | "cancelled";

export type DeliveryRequestStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "delivered"
  | "cancelled";

export type SupplierSource = "manual" | "wiseman" | "api";

// ---------------------------------------------------------------------------
// PM (Property Management) Enums
// ---------------------------------------------------------------------------

export type PropertyType =
  | "multi_family"
  | "commercial"
  | "mixed_use"
  | "hoa"
  | "vacation_rental"
  | "senior_living";

export type UnitStatus = "occupied" | "vacant" | "make_ready" | "offline";

export type WorkOrderPriority = "routine" | "urgent" | "emergency";

export type WorkOrderStatus =
  | "new"
  | "approved"
  | "dispatched"
  | "in_progress"
  | "completed"
  | "invoiced"
  | "closed";

export type ExpenseType = "opex" | "capex";

export type WorkOrderSubmitter = "tenant" | "pm" | "auto";

export type MaintenanceFrequency = "monthly" | "quarterly" | "semi_annual" | "annual";

export type MakeReadyStatus =
  | "pending"
  | "in_progress"
  | "punch_list"
  | "final_inspection"
  | "ready"
  | "listed";

export type ComplianceItemType =
  | "fire_extinguisher"
  | "boiler_inspection"
  | "lead_paint"
  | "elevator"
  | "backflow"
  | "fire_alarm";

export type ComplianceStatus = "current" | "due_soon" | "overdue" | "completed";

// ---------------------------------------------------------------------------
// Row types — what you get back from SELECT *
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  subtype: string | null;
  is_admin: boolean;
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
  verification_status: VerificationStatus;
  verification_reviewed_at: Date | null;
  verification_notes: string | null;
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
  parent_job_id: string | null;
  sequence_order: number;
  trade_required: string | null;
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

// ---------------------------------------------------------------------------
// Pro Skills, Work Photos, References (Migration 007)
// ---------------------------------------------------------------------------

export interface ProSkill {
  id: string;
  pro_id: string;
  skill_key: string;
  skill_category: string;
  created_at: Date;
}

export interface ProWorkPhoto {
  id: string;
  pro_id: string;
  url: string;
  caption: string | null;
  uploaded_at: Date;
}

export interface ProReference {
  id: string;
  pro_id: string;
  ref_name: string;
  ref_phone: string;
  ref_relationship: string | null;
  verified: boolean;
  created_at: Date;
}

export type ProSkillInsert = Omit<ProSkill, "id" | "created_at">;

export type ProWorkPhotoInsert = Omit<ProWorkPhoto, "id" | "uploaded_at">;

export type ProReferenceInsert = Omit<ProReference, "id" | "created_at">;

// ---------------------------------------------------------------------------
// Audit Logs (Migration 008)
// ---------------------------------------------------------------------------

export interface AuditLog {
  id: string;
  user_id: string | null;
  email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: Date;
}

export type AuditLogInsert = Omit<AuditLog, "id" | "created_at">;

// ---------------------------------------------------------------------------
// Job Materials, Material Orders, Delivery Requests (Migration 010)
// ---------------------------------------------------------------------------

export interface JobMaterial {
  id: string;
  job_id: string;
  material_name: string;
  quantity: number;
  unit: string;
  estimated_cost_cents: number | null;
  supplier_source: string;
  supplier_product_id: string | null;
  status: string;
  wiseman_note: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface MaterialOrder {
  id: string;
  job_id: string;
  supplier_api: string;
  external_order_id: string | null;
  status: string;
  total_cents: number | null;
  items_count: number | null;
  pickup_address: string | null;
  pickup_instructions: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DeliveryRequest {
  id: string;
  material_order_id: string;
  uber_delivery_id: string | null;
  pickup_address: string;
  dropoff_address: string;
  status: string;
  eta_minutes: number | null;
  actual_delivery_at: Date | null;
  cost_cents: number | null;
  created_at: Date;
  updated_at: Date;
}

export type JobMaterialInsert = Omit<
  JobMaterial,
  "id" | "created_at" | "updated_at"
>;

export type MaterialOrderInsert = Omit<
  MaterialOrder,
  "id" | "created_at" | "updated_at"
>;

export type DeliveryRequestInsert = Omit<
  DeliveryRequest,
  "id" | "created_at" | "updated_at"
>;

// ---------------------------------------------------------------------------
// PM Row Types
// ---------------------------------------------------------------------------

export interface Property {
  id: string;
  pm_user_id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  property_type: PropertyType;
  unit_count: number;
  total_sqft: number | null;
  year_built: number | null;
  monthly_budget_cents: number | null;
  reserve_fund_cents: number | null;
  location: unknown;
  created_at: Date;
  updated_at: Date;
}

export interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  status: UnitStatus;
  tenant_user_id: string | null;
  monthly_rent_cents: number | null;
  lease_start: Date | null;
  lease_end: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface WorkOrder {
  id: string;
  property_id: string;
  unit_id: string | null;
  pm_user_id: string;
  tenant_user_id: string | null;
  assigned_pro_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  sla_hours: number | null;
  budget_cents: number | null;
  actual_cost_cents: number | null;
  expense_type: ExpenseType | null;
  po_number: string | null;
  submitted_by: WorkOrderSubmitter;
  photos: unknown[];
  created_at: Date;
  dispatched_at: Date | null;
  completed_at: Date | null;
  updated_at: Date;
}

export interface PreferredVendor {
  id: string;
  pm_user_id: string;
  pro_id: string;
  trade_category: string;
  negotiated_rate_cents: number | null;
  priority_rank: number;
  insurance_verified: boolean;
  insurance_expiry: Date | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface MaintenanceSchedule {
  id: string;
  property_id: string;
  unit_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  frequency: MaintenanceFrequency;
  next_due: Date;
  last_completed: Date | null;
  estimated_cost_cents: number | null;
  preferred_vendor_id: string | null;
  auto_dispatch: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MakeReady {
  id: string;
  unit_id: string;
  property_id: string;
  vacate_date: Date;
  target_ready_date: Date;
  actual_ready_date: Date | null;
  status: MakeReadyStatus;
  punch_list: Array<{ item: string; status: string }>;
  total_cost_cents: number | null;
  work_order_ids: string[];
  created_at: Date;
  updated_at: Date;
}

export interface ComplianceItem {
  id: string;
  property_id: string;
  item_type: ComplianceItemType;
  description: string | null;
  due_date: Date;
  completed_date: Date | null;
  status: ComplianceStatus;
  certificate_url: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

// ---------------------------------------------------------------------------
// PM Insert Types
// ---------------------------------------------------------------------------

export type PropertyInsert = Omit<Property, "id" | "created_at" | "updated_at">;

export type UnitInsert = Omit<Unit, "id" | "created_at" | "updated_at">;

export type WorkOrderInsert = Omit<
  WorkOrder,
  "id" | "created_at" | "updated_at" | "dispatched_at" | "completed_at"
>;

export type PreferredVendorInsert = Omit<
  PreferredVendor,
  "id" | "created_at" | "updated_at"
>;

export type MaintenanceScheduleInsert = Omit<
  MaintenanceSchedule,
  "id" | "created_at" | "updated_at"
>;

export type MakeReadyInsert = Omit<MakeReady, "id" | "created_at" | "updated_at">;

export type ComplianceItemInsert = Omit<
  ComplianceItem,
  "id" | "created_at" | "updated_at"
>;
