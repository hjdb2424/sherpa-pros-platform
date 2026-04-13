// =============================================================================
// Dispatch Wiseman — Barrel Export
// The AI matching brain of Sherpa Pros marketplace
// =============================================================================

// Types
export type {
  // Geographic & Hub
  GeoPoint,
  Hub,
  HubConfig,

  // Pro
  TradeCategory,
  AvailabilityStatus,
  IICRCCertification,
  ProCertification,
  ResponseHistory,
  ProProfile,

  // Job
  JobUrgency,
  ThresholdType,
  JobPosting,
  JobScope,

  // Client-Pro
  ClientProHistory,

  // Scoring
  ScoringWeights,
  FactorBreakdown,
  DispatchScore,

  // Dispatch
  DispatchType,
  FallbackReason,
  DispatchResult,

  // Events
  DispatchEventType,
  DispatchEvent,

  // Anti-Gaming
  ViolationType,
  StrikeLevel,
  AntiGamingViolation,
  AntiGamingReport,

  // Distance
  ProDistanceInput,
} from './types';

// Scoring
export {
  DEFAULT_WEIGHTS,
  normalizeRating,
  normalizeDistance,
  normalizeSkillsMatch,
  normalizeAvailability,
  normalizeResponseHistory,
  normalizeHubLoadBalance,
  normalizeClientPreference,
  calculateNewUserBoost,
  calculateDispatchScore,
  rankPros,
} from './scoring';

// Dispatcher
export {
  DEFAULT_HUB_CONFIG,
  dispatch,
  dispatchSmallJob,
  dispatchLargeJob,
  handleFallback,
  resolveHubOverlap,
} from './dispatcher';
export type { DispatchContext } from './dispatcher';

// Anti-Gaming
export {
  detectCherryPicking,
  detectBidAndGhost,
  detectRatingManipulation,
  determineStrikeLevel,
  detectAntiGaming,
} from './anti-gaming';
export type {
  ProDispatchActivity,
  ProBidActivity,
  ProStrikeHistory,
} from './anti-gaming';
