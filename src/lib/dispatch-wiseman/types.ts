// =============================================================================
// Dispatch Wiseman — Type Definitions
// The matching brain of Sherpa Pros marketplace
// =============================================================================

// -----------------------------------------------------------------------------
// Geographic & Hub Types
// -----------------------------------------------------------------------------

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Hub {
  id: string;
  name: string;
  region: string;
  center_point: GeoPoint;
  radius_km: number;
  /** Dollar threshold: below = dispatch, above = competitive bid */
  threshold_amount: number;
  config: HubConfig;
}

export interface HubConfig {
  /** Maximum simultaneous dispatches for emergency */
  emergency_dispatch_count: number;
  /** Minutes before sequential dispatch times out to next Pro */
  standard_timeout_minutes: number;
  /** Hours for flexible dispatch window */
  flexible_window_hours: number;
  /** Number of declines before fallback to open bid */
  max_declines_before_fallback: number;
  /** Hours before total timeout triggers fallback */
  fallback_timeout_hours: number;
  /** Number of Pros who see a large job */
  large_job_pro_count_min: number;
  large_job_pro_count_max: number;
  /** Hours before opening large job to next tier */
  large_job_tier_expand_hours: number;
}

// -----------------------------------------------------------------------------
// Pro Types
// -----------------------------------------------------------------------------

export type TradeCategory =
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'carpentry'
  | 'painting'
  | 'roofing'
  | 'flooring'
  | 'landscaping'
  | 'general_handyman'
  | 'masonry'
  | 'drywall'
  | 'insulation'
  | 'siding'
  | 'gutters'
  | 'windows_doors'
  | 'appliance_repair'
  | 'pest_control'
  | 'cleaning'
  | 'moving'
  | 'demolition'
  | 'concrete'
  | 'fencing'
  | 'decking'
  | 'tile'
  | 'cabinetry'
  | 'countertops'
  | 'water_damage'
  | 'fire_damage'
  | 'mold_remediation';

export type AvailabilityStatus = 'available' | 'partial' | 'booked';

export interface IICRCCertification {
  code: string; // e.g., 'WRT', 'FSRT', 'AMRT'
  name: string;
  expiration_date: string; // ISO date
  verified: boolean;
}

export interface ProCertification {
  type: string;
  issuer: string;
  license_number: string;
  state: string;
  expiration_date: string; // ISO date
  verified: boolean;
}

export interface ResponseHistory {
  /** Percentage of dispatches accepted (0-100) */
  accept_rate: number;
  /** Average response time in minutes */
  avg_response_minutes: number;
  /** Total dispatches received in last 90 days */
  total_dispatches_90d: number;
  /** Total accepted in last 90 days */
  total_accepted_90d: number;
  /** Total declined in last 90 days */
  total_declined_90d: number;
  /** Total timed out (no response) in last 90 days */
  total_timed_out_90d: number;
}

export interface ProProfile {
  id: string;
  name: string;
  hub_id: string;
  location: GeoPoint;
  trades: TradeCategory[];
  /** Visibility score 0-500, time-decay weighted with 90-day half-life */
  rating: number;
  availability: AvailabilityStatus;
  response_history: ResponseHistory;
  /** Number of currently active/in-progress jobs */
  active_jobs: number;
  certifications: ProCertification[];
  iicrc_certs: IICRCCertification[];
  /** ISO date of when the Pro was activated on the platform */
  activated_at: string;
  /** Travel radius in minutes the Pro is willing to go */
  travel_radius_minutes: number;
  /** Whether the Pro is currently in good standing */
  is_active: boolean;
}

// -----------------------------------------------------------------------------
// Job Types
// -----------------------------------------------------------------------------

export type JobUrgency = 'emergency' | 'standard' | 'flexible';

export type ThresholdType = 'dispatch' | 'bid';

export interface JobPosting {
  id: string;
  title: string;
  category: TradeCategory;
  urgency: JobUrgency;
  /** Estimated budget in dollars */
  budget: number;
  location: GeoPoint;
  hub_id: string;
  /** Determined by comparing budget to hub threshold */
  threshold_type: ThresholdType;
  description: string;
  permit_required: boolean;
  scope: JobScope;
  /** Client who posted the job */
  client_id: string;
  /** ISO date of when the job was posted */
  posted_at: string;
}

export interface JobScope {
  /** Estimated hours to complete */
  estimated_hours: number;
  /** Whether the job requires interior access */
  interior: boolean;
  /** Whether the job requires exterior access */
  exterior: boolean;
  /** Specific requirements or notes */
  requirements: string[];
  /** Preferred start date (ISO) */
  preferred_start_date?: string;
  /** Deadline date (ISO) */
  deadline_date?: string;
}

// -----------------------------------------------------------------------------
// Client-Pro History
// -----------------------------------------------------------------------------

export interface ClientProHistory {
  client_id: string;
  pro_id: string;
  /** Number of times this client has hired this Pro */
  times_hired: number;
  /** Whether the client has favorited/saved this Pro */
  is_favorited: boolean;
  /** Average rating client gave this Pro */
  avg_rating_given: number;
  /** ISO date of last job together */
  last_job_date: string;
}

// -----------------------------------------------------------------------------
// Scoring & Dispatch Result Types
// -----------------------------------------------------------------------------

export interface ScoringWeights {
  pro_rating: number;
  distance: number;
  skills_match: number;
  availability: number;
  response_history: number;
  hub_load_balance: number;
  client_preference: number;
}

export interface FactorBreakdown {
  pro_rating: { raw: number; normalized: number; weighted: number };
  distance: { raw: number; normalized: number; weighted: number };
  skills_match: { raw: number; normalized: number; weighted: number };
  availability: { raw: number; normalized: number; weighted: number };
  response_history: { raw: number; normalized: number; weighted: number };
  hub_load_balance: { raw: number; normalized: number; weighted: number };
  client_preference: { raw: number; normalized: number; weighted: number };
  new_user_boost: { multiplier: number; days_active: number };
}

export interface DispatchScore {
  pro_id: string;
  total_score: number;
  factor_breakdown: FactorBreakdown;
  rank: number;
}

export type DispatchType = 'emergency' | 'standard' | 'flexible' | 'bid' | 'fallback_bid';

export type FallbackReason = 'max_declines' | 'timeout' | 'no_qualified_pros';

export interface DispatchResult {
  job_id: string;
  ranked_pros: DispatchScore[];
  dispatch_type: DispatchType;
  fallback_triggered: boolean;
  fallback_reason?: FallbackReason;
  /** How many Pros to notify based on dispatch type */
  notify_count: number;
  /** ISO timestamp of when dispatch was calculated */
  calculated_at: string;
  /** Hub(s) involved in this dispatch */
  hub_ids: string[];
}

// -----------------------------------------------------------------------------
// Anti-Gaming Types
// -----------------------------------------------------------------------------

export type ViolationType =
  | 'cherry_picking'
  | 'bid_and_ghost'
  | 'rating_manipulation';

export type StrikeLevel = 'warning' | 'visibility_reduction' | 'pause' | 'deactivation';

export interface AntiGamingViolation {
  pro_id: string;
  violation_type: ViolationType;
  severity: StrikeLevel;
  details: string;
  detected_at: string; // ISO
  /** Data points that triggered the detection */
  evidence: Record<string, number | string>;
}

export interface AntiGamingReport {
  pro_id: string;
  violations: AntiGamingViolation[];
  current_strike_level: StrikeLevel | null;
  total_strikes: number;
  is_clean: boolean;
  checked_at: string; // ISO
}

// -----------------------------------------------------------------------------
// Dispatch Event Types (for state tracking)
// -----------------------------------------------------------------------------

export type DispatchEventType =
  | 'dispatched'
  | 'notified'
  | 'accepted'
  | 'declined'
  | 'timed_out'
  | 'fallback_triggered'
  | 'converted_to_bid'
  | 'completed'
  | 'cancelled';

export interface DispatchEvent {
  id: string;
  job_id: string;
  pro_id: string | null;
  event_type: DispatchEventType;
  metadata: Record<string, unknown>;
  created_at: string; // ISO
}

// -----------------------------------------------------------------------------
// Distance Input (pre-PostGIS — accepts computed distance)
// -----------------------------------------------------------------------------

export interface ProDistanceInput {
  pro_id: string;
  /** Pre-computed travel time in minutes from Pro to job site */
  distance_minutes: number;
}
