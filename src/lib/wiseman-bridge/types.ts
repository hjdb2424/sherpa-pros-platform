// =============================================================================
// Wiseman Bridge — Type Definitions
// HTTP client types for calling BldSync Wiseman APIs
// =============================================================================

import type { TradeCategory } from '@/lib/dispatch-wiseman/types';

// -----------------------------------------------------------------------------
// Pricing Validation
// -----------------------------------------------------------------------------

export interface PricingValidationRequest {
  budget_cents: number;
  scope_description: string;
  category: TradeCategory;
  location: {
    state: string;
    municipality: string;
  };
}

export interface PricingValidationResult {
  is_realistic: boolean;
  suggested_range_min: number;
  suggested_range_max: number;
  deviation_pct: number;
  flags: PricingFlag[];
}

export type PricingFlag =
  | 'below_market'
  | 'above_market'
  | 'no_data_for_region'
  | 'seasonal_adjustment'
  | 'material_cost_spike'
  | 'labor_shortage';

// -----------------------------------------------------------------------------
// Bid Validation
// -----------------------------------------------------------------------------

export interface BidValidationRequest {
  bid_cents: number;
  job_id: string;
  category: TradeCategory;
}

export type BidStatus = 'acceptable' | 'warning' | 'suspicious';

export interface BidValidationResult {
  deviation_pct: number;
  status: BidStatus;
  market_rate_cents: number;
}

// -----------------------------------------------------------------------------
// Permit Check
// -----------------------------------------------------------------------------

export interface PermitCheckRequest {
  category: TradeCategory;
  state: string;
  municipality: string;
}

export interface PermitCheckResult {
  permit_required: boolean;
  permit_types: string[];
  code_sections: string[];
  estimated_cost_cents: number;
}

// -----------------------------------------------------------------------------
// Checklist Generation
// -----------------------------------------------------------------------------

export type JobSize = 'small' | 'large';

export interface ChecklistGenerationRequest {
  job_type: string;
  category: TradeCategory;
  job_size: JobSize;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  category: 'safety' | 'compliance' | 'quality' | 'documentation' | 'platform';
  sort_order: number;
}

export interface ChecklistResult {
  checklist_items: ChecklistItem[];
}

// -----------------------------------------------------------------------------
// Error Types
// -----------------------------------------------------------------------------

export type WisemanErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'AUTH_FAILED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export interface WisemanError {
  code: WisemanErrorCode;
  message: string;
  status_code: number | null;
  retryable: boolean;
  /** Original error for debugging */
  cause?: unknown;
}

// -----------------------------------------------------------------------------
// Vetting Types
// -----------------------------------------------------------------------------

export type VettingVerdict = 'approved' | 'needs_adjustment' | 'rejected';

export interface VettingResult {
  verdict: VettingVerdict;
  pricing: PricingValidationResult | null;
  permits: PermitCheckResult | null;
  scope_analysis: ScopeAnalysis;
  coaching_messages: string[];
  vetted_at: string;
}

export interface ScopeAnalysis {
  description_matches_category: boolean;
  confidence: number;
  suggested_category?: TradeCategory;
  flags: string[];
}

export interface BidVettingResult {
  status: BidStatus;
  deviation_pct: number;
  market_rate_cents: number;
  explanation: string;
  flagged: boolean;
}

// -----------------------------------------------------------------------------
// Health Check
// -----------------------------------------------------------------------------

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  version?: string;
  timestamp: string;
}

// -----------------------------------------------------------------------------
// Client Configuration
// -----------------------------------------------------------------------------

export interface WisemanClientConfig {
  base_url: string;
  api_key: string;
  timeout_ms: number;
  max_retries: number;
  /** Base delay in ms for exponential backoff */
  retry_base_delay_ms: number;
}
