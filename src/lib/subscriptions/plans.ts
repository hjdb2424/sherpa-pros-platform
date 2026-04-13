/**
 * Sherpa Pros Platform — Subscription Plan Definitions
 *
 * Defines the three subscription tiers and provides helpers
 * for plan lookup, comparison, and feature matrix generation.
 */

import type {
  SubscriptionPlan,
  SubscriptionTier,
  FeatureComparison,
} from './types';
import {
  PRICING,
  SLA_WINDOWS,
  SLA_COMPLIANCE_THRESHOLD,
  SLA_VIOLATION_GRACE_PERIOD_DAYS,
  SLA_MAX_VIOLATIONS_BEFORE_SUSPENSION,
} from './types';

// ---------------------------------------------------------------------------
// Plan Definitions
// ---------------------------------------------------------------------------

const STANDARD_PLAN: SubscriptionPlan = {
  tier: 'standard',
  name: 'Standard',
  description: 'Get started on the platform. Licensed, insured, and vetted pros.',
  monthlyPriceCents: PRICING.STANDARD_MONTHLY_CENTS,
  stripePriceId: null,
  features: [
    'Listed on marketplace',
    'Receive job notifications',
    'Submit bids on jobs',
    'Basic profile & portfolio',
    'Standard commission rates',
    'Weekly payouts',
  ],
  requirements: [
    {
      id: 'req-license',
      label: 'Valid Contractor License',
      description: 'Active state contractor license for your trade',
      category: 'license',
    },
    {
      id: 'req-insurance-gl',
      label: 'General Liability Insurance',
      description: 'Minimum $1M general liability coverage',
      category: 'insurance',
    },
    {
      id: 'req-vetting',
      label: 'Background Check Passed',
      description: 'Platform vetting and background verification',
      category: 'license',
    },
  ],
  sla: null,
  badge: {
    color: 'gray',
    label: 'Standard',
    icon: 'shield',
  },
  earnings: {
    averageMonthly: 2_100,
    multiplierVsStandard: 1,
  },
};

const EMERGENCY_READY_PLAN: SubscriptionPlan = {
  tier: 'emergency_ready',
  name: 'Emergency Ready',
  description:
    'Priority dispatch for emergency jobs. IICRC certified with guaranteed response times.',
  monthlyPriceCents: PRICING.EMERGENCY_READY_MONTHLY_CENTS,
  stripePriceId: 'price_emergency_ready_monthly', // TODO: Replace with actual Stripe Price ID
  features: [
    'Everything in Standard',
    'Priority emergency dispatch',
    '4-hour response guarantee',
    'Featured in emergency search',
    'Reduced commission rates',
    'Instant payouts available',
    'Priority support line',
    'Emergency job badge on profile',
  ],
  requirements: [
    ...STANDARD_PLAN.requirements,
    {
      id: 'req-iicrc',
      label: 'IICRC Certification',
      description: 'Active IICRC certification in at least one discipline',
      category: 'certification',
    },
    {
      id: 'req-sla-4hr',
      label: '4-Hour SLA Guarantee',
      description: 'Commit to responding within 4 hours to emergency dispatches',
      category: 'training',
    },
  ],
  sla: {
    responseWindowMinutes: SLA_WINDOWS.emergency_ready,
    complianceThresholdPercent: SLA_COMPLIANCE_THRESHOLD,
    violationGracePeriodDays: SLA_VIOLATION_GRACE_PERIOD_DAYS,
    maxViolationsBeforeSuspension: SLA_MAX_VIOLATIONS_BEFORE_SUSPENSION,
  },
  badge: {
    color: 'amber',
    label: 'Emergency Ready',
    icon: 'bolt',
  },
  earnings: {
    averageMonthly: 8_400,
    multiplierVsStandard: 4,
  },
};

const RESTORATION_CERTIFIED_PLAN: SubscriptionPlan = {
  tier: 'restoration_certified',
  name: 'Restoration Certified',
  description:
    'Top-tier restoration pros. WRT/ASD/FSRT certified, Xactimate trained, fastest response.',
  monthlyPriceCents: PRICING.RESTORATION_CERTIFIED_MONTHLY_CENTS,
  stripePriceId: 'price_restoration_certified_monthly', // TODO: Replace with actual Stripe Price ID
  features: [
    'Everything in Emergency Ready',
    '2-hour response guarantee',
    'Insurance-direct referrals',
    'Xactimate estimate integration',
    'Lowest commission rates',
    'Dedicated account manager',
    'Featured placement in all searches',
    'Restoration specialist badge',
    'Priority for high-value jobs',
    'Monthly performance bonuses',
  ],
  requirements: [
    ...EMERGENCY_READY_PLAN.requirements,
    {
      id: 'req-wrt',
      label: 'IICRC WRT Certification',
      description: 'Water Damage Restoration Technician certification',
      category: 'certification',
    },
    {
      id: 'req-asd',
      label: 'IICRC ASD Certification',
      description: 'Applied Structural Drying certification',
      category: 'certification',
    },
    {
      id: 'req-fsrt',
      label: 'IICRC FSRT Certification',
      description: 'Fire and Smoke Restoration Technician certification',
      category: 'certification',
    },
    {
      id: 'req-xactimate',
      label: 'Xactimate Training',
      description: 'Completed Xactimate estimating software training',
      category: 'training',
    },
  ],
  sla: {
    responseWindowMinutes: SLA_WINDOWS.restoration_certified,
    complianceThresholdPercent: SLA_COMPLIANCE_THRESHOLD,
    violationGracePeriodDays: SLA_VIOLATION_GRACE_PERIOD_DAYS,
    maxViolationsBeforeSuspension: SLA_MAX_VIOLATIONS_BEFORE_SUSPENSION,
  },
  badge: {
    color: 'yellow',
    label: 'Restoration Certified',
    icon: 'star',
  },
  earnings: {
    averageMonthly: 14_200,
    multiplierVsStandard: 7,
  },
};

// ---------------------------------------------------------------------------
// Plan Registry
// ---------------------------------------------------------------------------

const PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  standard: STANDARD_PLAN,
  emergency_ready: EMERGENCY_READY_PLAN,
  restoration_certified: RESTORATION_CERTIFIED_PLAN,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get a single plan definition by tier.
 */
export function getPlanByTier(tier: SubscriptionTier): SubscriptionPlan {
  const plan = PLANS[tier];
  if (!plan) {
    throw new Error(`Unknown subscription tier: ${tier}`);
  }
  return plan;
}

/**
 * Get all plans ordered from lowest to highest tier.
 */
export function getAllPlans(): SubscriptionPlan[] {
  return [STANDARD_PLAN, EMERGENCY_READY_PLAN, RESTORATION_CERTIFIED_PLAN];
}

/**
 * Generate a feature comparison matrix for display in plan selection UI.
 */
export function comparePlans(): FeatureComparison[] {
  return [
    { feature: 'Listed on marketplace', standard: true, emergencyReady: true, restorationCertified: true },
    { feature: 'Receive job notifications', standard: true, emergencyReady: true, restorationCertified: true },
    { feature: 'Submit bids on jobs', standard: true, emergencyReady: true, restorationCertified: true },
    { feature: 'Basic profile & portfolio', standard: true, emergencyReady: true, restorationCertified: true },
    { feature: 'Weekly payouts', standard: true, emergencyReady: true, restorationCertified: true },
    { feature: 'Priority emergency dispatch', standard: false, emergencyReady: true, restorationCertified: true },
    { feature: 'Featured in emergency search', standard: false, emergencyReady: true, restorationCertified: true },
    { feature: 'Reduced commission rates', standard: false, emergencyReady: true, restorationCertified: true },
    { feature: 'Instant payouts', standard: false, emergencyReady: true, restorationCertified: true },
    { feature: 'Priority support line', standard: false, emergencyReady: true, restorationCertified: true },
    { feature: '4-hour response guarantee', standard: false, emergencyReady: true, restorationCertified: true },
    { feature: 'Insurance-direct referrals', standard: false, emergencyReady: false, restorationCertified: true },
    { feature: 'Xactimate integration', standard: false, emergencyReady: false, restorationCertified: true },
    { feature: 'Lowest commission rates', standard: false, emergencyReady: false, restorationCertified: true },
    { feature: 'Dedicated account manager', standard: false, emergencyReady: false, restorationCertified: true },
    { feature: '2-hour response guarantee', standard: false, emergencyReady: false, restorationCertified: true },
    { feature: 'Monthly performance bonuses', standard: false, emergencyReady: false, restorationCertified: true },
  ];
}

/**
 * Check if a tier upgrade is valid (can only go up, not down via upgrade).
 */
export function isValidUpgrade(
  currentTier: SubscriptionTier,
  targetTier: SubscriptionTier,
): boolean {
  const tierOrder: SubscriptionTier[] = ['standard', 'emergency_ready', 'restoration_certified'];
  return tierOrder.indexOf(targetTier) > tierOrder.indexOf(currentTier);
}

/**
 * Check if a tier change is a downgrade.
 */
export function isDowngrade(
  currentTier: SubscriptionTier,
  targetTier: SubscriptionTier,
): boolean {
  const tierOrder: SubscriptionTier[] = ['standard', 'emergency_ready', 'restoration_certified'];
  return tierOrder.indexOf(targetTier) < tierOrder.indexOf(currentTier);
}
