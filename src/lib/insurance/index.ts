/**
 * Sherpa Pros Platform — Insurance Documentation Engine
 *
 * Core insurance intelligence layer providing:
 * - Documentation package generation for insurance claims
 * - Xactimate .ESC file parsing and market rate comparison
 * - IICRC compliance validation and reporting
 * - Emergency-specific pricing with severity multipliers
 * - Pro subscription/retainer management for insurance work
 */

// Types
export type {
  EmergencyCategory,
  EmergencySeverity,
  IICRCCert,
  MoistureReading,
  DryingLogEntry,
  PhotoPhase,
  DocumentedPhoto,
  TimelineEventType,
  TimelineEvent,
  AffectedArea,
  EquipmentDeployed,
  MitigationReport,
  RestorationLineItem,
  RestorationEstimate,
  PermitRequirement,
  DocPackageStatus,
  InsuranceDocPackage,
  XactimateLineItem,
  XactimateClaimMeta,
  XactimateParseResult,
  RateComparisonStatus,
  RateComparisonItem,
  RateComparisonResult,
  SupplementLineItem,
  SupplementReport,
  CertRequirement,
  ComplianceCheckItem,
  ComplianceReport,
  DryingGoal,
  PriceRangeCents,
  EmergencyPriceEstimate,
  SubscriptionTier,
  SubscriptionRequirement,
  SubscriptionBenefit,
  SubscriptionDetails,
  SLAComplianceResult,
} from './types';

// Documentation Engine
export {
  createDocPackage,
  getDocPackage,
  addTimelineEvent,
  addPhoto,
  addMoistureReading,
  addDryingLogEntry,
  generateMitigationReport,
  generateRestorationEstimate,
  addPermitRequirements,
  finalizePackage,
  markSubmittedToCarrier,
  getPackageSummary,
} from './documentation-engine';

// Xactimate Bridge
export {
  parseESCFile,
  compareWithMarketRates,
  generateSupplementReport,
  estimateSupplementValue,
} from './xactimate-bridge';

// IICRC Compliance
export {
  getRequiredCerts,
  validateMitigationProtocol,
  generateComplianceReport,
  getDryingGoals,
} from './iicrc-compliance';

// Emergency Pricing
export {
  getEmergencyPriceRange,
  getEmergencyMultiplier,
  getAfterHoursSurchargeRange,
  isAfterHours,
} from './emergency-pricing';

// Subscription Management
export {
  getSubscriptionRequirements,
  validateProForTier,
  calculateRetainerFee,
  checkSLACompliance,
  getSubscriptionBenefits,
  getSubscriptionDetails,
  getAllTiers,
} from './subscription';
