/**
 * Sherpa Pros Platform — Subscription Module
 *
 * Barrel export for the subscription billing system.
 */

// Types
export type {
  SubscriptionTier,
  SubscriptionStatus,
  SubscriptionPlan,
  PlanRequirement,
  SLACommitment,
  PlanBadge,
  PlanEarnings,
  ProSubscription,
  SLAResponseRecord,
  SLAComplianceReport,
  SubscriptionWebhookEvent,
  FeatureComparison,
} from './types';

export {
  PRICING,
  SLA_WINDOWS,
  SLA_COMPLIANCE_THRESHOLD,
  SLA_VIOLATION_GRACE_PERIOD_DAYS,
  SLA_MAX_VIOLATIONS_BEFORE_SUSPENSION,
} from './types';

// Plans
export {
  getPlanByTier,
  getAllPlans,
  comparePlans,
  isValidUpgrade,
  isDowngrade,
} from './plans';

// Stripe Billing
export {
  createSubscription,
  cancelSubscription,
  upgradeSubscription,
  downgradeSubscription,
  getSubscriptionStatus,
  handleSubscriptionWebhook,
} from './stripe-billing';

// SLA Tracker
export {
  recordResponseTime,
  calculateSLACompliance,
  checkSLAViolation,
  getSLAReport,
} from './sla-tracker';
