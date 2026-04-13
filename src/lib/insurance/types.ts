/**
 * Sherpa Pros Platform — Insurance Documentation Types
 *
 * Types for emergency response, IICRC compliance, Xactimate integration,
 * and insurance claim documentation packages.
 *
 * ALL monetary values are stored as INTEGER CENTS to avoid
 * floating-point rounding errors. $1.00 = 100 cents.
 */

// ---------------------------------------------------------------------------
// Emergency Classification
// ---------------------------------------------------------------------------

export type EmergencyCategory =
  | 'water_damage'
  | 'fire_smoke'
  | 'storm'
  | 'hvac'
  | 'electrical'
  | 'gas_leak'
  | 'structural';

export type EmergencySeverity = 'critical' | 'urgent' | 'same_day';

// ---------------------------------------------------------------------------
// IICRC Certifications
// ---------------------------------------------------------------------------

/**
 * IICRC certification codes recognized by carriers:
 *  WRT  — Water Restoration Technician
 *  ASD  — Applied Structural Drying
 *  FSRT — Fire & Smoke Restoration Technician
 *  AMRT — Applied Microbial Remediation Technician
 *  CCT  — Carpet Cleaning Technician
 *  OCT  — Odor Control Technician
 *  TCST — Trauma & Crime Scene Technician
 */
export type IICRCCert = 'WRT' | 'ASD' | 'FSRT' | 'AMRT' | 'CCT' | 'OCT' | 'TCST';

// ---------------------------------------------------------------------------
// Moisture & Drying Data
// ---------------------------------------------------------------------------

export interface MoistureReading {
  id: string;
  location: string; // "Living Room - North Wall"
  reading: number; // percentage
  timestamp: Date;
  equipment: string; // "Protimeter Surveymaster"
}

export interface DryingLogEntry {
  id: string;
  date: Date;
  readings: MoistureReading[];
  equipment_placed: string[]; // "4x LGR Dehumidifiers", "12x Air Movers"
  notes: string;
}

// ---------------------------------------------------------------------------
// Photo Documentation
// ---------------------------------------------------------------------------

export type PhotoPhase = 'initial' | 'during_mitigation' | 'post_mitigation' | 'restoration';

export interface DocumentedPhoto {
  id: string;
  url: string;
  phase: PhotoPhase;
  area: string; // "Basement - Southwest Corner"
  caption: string;
  timestamp: Date;
  tagged_damage: string[]; // "water damage", "mold growth", "structural"
}

// ---------------------------------------------------------------------------
// Timeline Events
// ---------------------------------------------------------------------------

export type TimelineEventType =
  | 'incident_reported'
  | 'dispatched'
  | 'pro_accepted'
  | 'en_route'
  | 'arrived_on_site'
  | 'assessment_complete'
  | 'mitigation_started'
  | 'equipment_placed'
  | 'moisture_reading'
  | 'progress_check'
  | 'mitigation_complete'
  | 'restoration_started'
  | 'restoration_complete'
  | 'final_inspection'
  | 'documentation_submitted';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: Date;
  description: string;
  actor?: string; // Pro name or system
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Mitigation Report
// ---------------------------------------------------------------------------

export interface AffectedArea {
  name: string; // "Master Bedroom"
  square_footage: number;
  damage_type: string[]; // "water damage", "mold"
  damage_class?: string; // IICRC Class 1-4
  damage_category?: string; // IICRC Category 1-3
  materials_affected: string[]; // "hardwood flooring", "drywall", "carpet"
}

export interface EquipmentDeployed {
  type: string; // "LGR Dehumidifier"
  quantity: number;
  model?: string;
  serial_numbers?: string[];
  placed_date: Date;
  removed_date?: Date;
  daily_rate_cents: number;
}

export interface MitigationReport {
  summary: string;
  affected_areas: AffectedArea[];
  equipment_deployed: EquipmentDeployed[];
  total_equipment_days: number;
  total_equipment_cost_cents: number;
  labor_hours: number;
  labor_cost_cents: number;
  materials_cost_cents: number;
  total_mitigation_cost_cents: number;
  iicrc_standards_followed: string[];
  drying_goals_met: boolean;
  completion_date?: Date;
}

// ---------------------------------------------------------------------------
// Restoration Estimate
// ---------------------------------------------------------------------------

export interface RestorationLineItem {
  id: string;
  category: string; // "Drywall", "Flooring", "Painting"
  description: string;
  quantity: number;
  unit: string; // "SF", "LF", "EA"
  unit_price_cents: number;
  total_cents: number;
  xactimate_code?: string; // Xactimate pricing code
}

export interface RestorationEstimate {
  line_items: RestorationLineItem[];
  subtotal_cents: number;
  overhead_percent: number; // typically 10%
  overhead_cents: number;
  profit_percent: number; // typically 10%
  profit_cents: number;
  tax_percent: number;
  tax_cents: number;
  total_cents: number;
  notes: string;
}

// ---------------------------------------------------------------------------
// Permit Requirements
// ---------------------------------------------------------------------------

export interface PermitRequirement {
  type: string; // "Building", "Electrical", "Plumbing"
  jurisdiction: string; // "Manchester, NH"
  required: boolean;
  estimated_cost_cents: number;
  estimated_days: number;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Insurance Documentation Package (top-level aggregate)
// ---------------------------------------------------------------------------

export type DocPackageStatus = 'draft' | 'complete' | 'submitted_to_carrier';

export interface InsuranceDocPackage {
  id: string;
  job_id: string;
  claim_number?: string;
  carrier?: string;
  policy_number?: string;

  incident: {
    category: EmergencyCategory;
    severity: EmergencySeverity;
    reported_at: Date;
    description: string;
    cause: string; // "Burst pipe in upstairs bathroom"
  };

  timeline: TimelineEvent[];
  photos: DocumentedPhoto[];
  moisture_data: MoistureReading[];
  drying_log: DryingLogEntry[];

  mitigation_report: MitigationReport | null;
  restoration_estimate: RestorationEstimate | null;
  permit_requirements: PermitRequirement[];

  generated_at: Date;
  updated_at: Date;
  status: DocPackageStatus;
}

// ---------------------------------------------------------------------------
// Xactimate Integration
// ---------------------------------------------------------------------------

export interface XactimateLineItem {
  line_number: number;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price_cents: number;
  total_cents: number;
  code?: string; // Xactimate selector code
}

export interface XactimateClaimMeta {
  claim_number: string;
  carrier: string;
  insured_name: string;
  date_of_loss: string;
  adjuster_name?: string;
  policy_number?: string;
}

export interface XactimateParseResult {
  metadata: XactimateClaimMeta;
  line_items: XactimateLineItem[];
  subtotal_cents: number;
  overhead_cents: number;
  profit_cents: number;
  tax_cents: number;
  total_cents: number;
}

export type RateComparisonStatus = 'fair' | 'underpaid' | 'overpaid';

export interface RateComparisonItem {
  line_number: number;
  description: string;
  xactimate_price_cents: number;
  market_price_cents: number;
  deviation_percent: number; // negative = underpaid
  status: RateComparisonStatus;
  regional_comparables: number; // number of comparable data points
  supplement_opportunity: boolean;
}

export interface RateComparisonResult {
  items: RateComparisonItem[];
  total_xactimate_cents: number;
  total_market_cents: number;
  total_deviation_cents: number;
  supplement_items_count: number;
  estimated_supplement_value_cents: number;
}

export interface SupplementLineItem {
  description: string;
  xactimate_amount_cents: number;
  market_rate_cents: number;
  deviation_percent: number;
  regional_comparables: number;
  justification: string;
}

export interface SupplementReport {
  claim_number: string;
  carrier: string;
  date_generated: Date;
  items: SupplementLineItem[];
  total_supplement_value_cents: number;
  supporting_photo_count: number;
  summary: string;
}

// ---------------------------------------------------------------------------
// IICRC Compliance
// ---------------------------------------------------------------------------

export interface CertRequirement {
  cert: IICRCCert;
  required: boolean; // true = must-have, false = recommended
  reason: string;
}

export interface ComplianceCheckItem {
  standard: string;
  description: string;
  passed: boolean;
  details: string;
}

export interface ComplianceReport {
  package_id: string;
  category: EmergencyCategory;
  overall_pass: boolean;
  checks: ComplianceCheckItem[];
  gaps: string[];
  recommendations: string[];
  generated_at: Date;
}

export interface DryingGoal {
  material: string;
  target_min_percent: number;
  target_max_percent: number;
  current_reading?: number;
  met: boolean;
}

// ---------------------------------------------------------------------------
// Emergency Pricing
// ---------------------------------------------------------------------------

export interface PriceRangeCents {
  min_cents: number;
  max_cents: number;
}

export interface EmergencyPriceEstimate {
  category: EmergencyCategory;
  severity: EmergencySeverity;
  base_range: PriceRangeCents;
  emergency_multiplier: number;
  after_hours_surcharge_cents: number;
  adjusted_range: PriceRangeCents;
  square_footage?: number;
  location?: string;
}

// ---------------------------------------------------------------------------
// Subscription / Retainer
// ---------------------------------------------------------------------------

export type SubscriptionTier = 'standard' | 'emergency_ready' | 'restoration_certified';

export interface SubscriptionRequirement {
  tier: SubscriptionTier;
  min_rating: number; // 0-500
  required_certs: IICRCCert[];
  recommended_certs: IICRCCert[];
  max_response_minutes: number;
  min_accept_rate: number; // 0-100
  min_completed_jobs: number;
  insurance_required: boolean;
  background_check_required: boolean;
}

export interface SubscriptionBenefit {
  name: string;
  description: string;
}

export interface SubscriptionDetails {
  tier: SubscriptionTier;
  monthly_fee_cents: number;
  requirements: SubscriptionRequirement;
  benefits: SubscriptionBenefit[];
}

export interface SLAComplianceResult {
  pro_id: string;
  period_start: Date;
  period_end: Date;
  total_dispatches: number;
  on_time_responses: number;
  late_responses: number;
  missed_responses: number;
  compliance_rate: number; // 0-100
  compliant: boolean; // must be >= 90%
}
