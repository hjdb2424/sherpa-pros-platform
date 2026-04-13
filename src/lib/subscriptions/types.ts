/**
 * Sherpa Pros Platform — Subscription Types
 *
 * Type definitions for the Pro retainer/subscription billing system.
 * Three tiers: Standard (free), Emergency Ready ($299/mo), Restoration Certified ($799/mo).
 * All monetary values in INTEGER CENTS.
 */

// ---------------------------------------------------------------------------
// Tier & Status Enums
// ---------------------------------------------------------------------------

export type SubscriptionTier = 'standard' | 'emergency_ready' | 'restoration_certified';

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'trialing'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid';

// ---------------------------------------------------------------------------
// Plan Definition
// ---------------------------------------------------------------------------

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  description: string;
  monthlyPriceCents: number;
  stripePriceId: string | null; // null for free Standard tier
  features: string[];
  requirements: PlanRequirement[];
  sla: SLACommitment | null; // null for Standard (no SLA)
  badge: PlanBadge;
  earnings: PlanEarnings;
}

export interface PlanRequirement {
  id: string;
  label: string;
  description: string;
  category: 'license' | 'insurance' | 'certification' | 'training' | 'equipment';
}

export interface SLACommitment {
  responseWindowMinutes: number;
  complianceThresholdPercent: number;
  violationGracePeriodDays: number;
  maxViolationsBeforeSuspension: number;
}

export interface PlanBadge {
  color: string; // Tailwind color class prefix (e.g., 'gray', 'amber', 'yellow')
  label: string;
  icon: string;
}

export interface PlanEarnings {
  averageMonthly: number; // In whole dollars for display
  multiplierVsStandard: number;
}

// ---------------------------------------------------------------------------
// Subscription Record
// ---------------------------------------------------------------------------

export interface ProSubscription {
  id: string;
  proId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  currentPeriodStart: string; // ISO date
  currentPeriodEnd: string; // ISO date
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// SLA Tracking
// ---------------------------------------------------------------------------

export interface SLAResponseRecord {
  id: string;
  proId: string;
  jobId: string;
  dispatchedAt: string; // ISO datetime
  respondedAt: string; // ISO datetime
  responseTimeMinutes: number;
  withinSLA: boolean;
  slaWindowMinutes: number;
}

export interface SLAComplianceReport {
  proId: string;
  tier: SubscriptionTier;
  periodDays: number;
  totalDispatches: number;
  withinSLA: number;
  violations: number;
  compliancePercent: number;
  averageResponseMinutes: number;
  fastestResponseMinutes: number;
  slowestResponseMinutes: number;
  isCompliant: boolean;
  responses: SLAResponseRecord[];
}

// ---------------------------------------------------------------------------
// Billing Events
// ---------------------------------------------------------------------------

export interface SubscriptionWebhookEvent {
  type:
    | 'invoice.payment_succeeded'
    | 'invoice.payment_failed'
    | 'customer.subscription.deleted'
    | 'customer.subscription.updated'
    | 'customer.subscription.created';
  subscriptionId: string;
  proId: string;
  tier: SubscriptionTier;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Feature Comparison
// ---------------------------------------------------------------------------

export interface FeatureComparison {
  feature: string;
  standard: boolean;
  emergencyReady: boolean;
  restorationCertified: boolean;
}

// ---------------------------------------------------------------------------
// Pricing Constants (integer cents)
// ---------------------------------------------------------------------------

export const PRICING = {
  STANDARD_MONTHLY_CENTS: 0,
  EMERGENCY_READY_MONTHLY_CENTS: 29_900, // $299
  RESTORATION_CERTIFIED_MONTHLY_CENTS: 79_900, // $799
} as const;

// ---------------------------------------------------------------------------
// SLA Constants
// ---------------------------------------------------------------------------

export const SLA_WINDOWS = {
  emergency_ready: 240, // 4 hours in minutes
  restoration_certified: 120, // 2 hours in minutes
} as const;

export const SLA_COMPLIANCE_THRESHOLD = 90; // percent
export const SLA_VIOLATION_GRACE_PERIOD_DAYS = 7;
export const SLA_MAX_VIOLATIONS_BEFORE_SUSPENSION = 3;
