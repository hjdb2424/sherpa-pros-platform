// =============================================================================
// Wiseman Bridge — Barrel Export
// BldSync Wiseman API integration layer for Sherpa Pros Platform
// =============================================================================

// Client
export { WisemanClient, getWisemanClient } from './client';

// Project Vetter
export { ProjectVetter } from './project-vetter';

// Checklist Generator
export { ChecklistGenerator } from './checklist-generator';

// Types
export type {
  // Pricing
  PricingValidationRequest,
  PricingValidationResult,
  PricingFlag,
  // Bid
  BidValidationRequest,
  BidValidationResult,
  BidStatus,
  // Permits
  PermitCheckRequest,
  PermitCheckResult,
  // Checklists
  ChecklistGenerationRequest,
  ChecklistResult,
  ChecklistItem,
  JobSize,
  // Errors
  WisemanError,
  WisemanErrorCode,
  // Vetting
  VettingResult,
  VettingVerdict,
  ScopeAnalysis,
  BidVettingResult,
  // Config
  WisemanClientConfig,
  HealthCheckResponse,
} from './types';
