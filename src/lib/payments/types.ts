/**
 * Sherpa Pros Platform — Payment Types
 *
 * ALL monetary values are stored as INTEGER CENTS to avoid
 * floating-point rounding errors. $1.00 = 100 cents.
 */

// ---------------------------------------------------------------------------
// Payment Flow
// ---------------------------------------------------------------------------

/** Small jobs are paid on completion; larger jobs use milestone-based releases. */
export type PaymentFlow = 'pay_on_completion' | 'milestone_based';

// ---------------------------------------------------------------------------
// Commission Tiers (sliding scale — platform take from Pro side)
// ---------------------------------------------------------------------------

export interface CommissionTier {
  /** Inclusive lower bound in cents */
  minCents: number;
  /** Exclusive upper bound in cents (Infinity for the top tier) */
  maxCents: number;
  /** Commission rate as a decimal (0.15 = 15%) */
  rate: number;
  /** Human-readable label */
  label: string;
}

/**
 * Sliding-scale commission tiers.
 * The platform charges the Pro a percentage of the job amount.
 *
 *   < $500   → 15%
 *   $500–$5K → 12%
 *   $5K–$25K → 10%
 *   $25K+    → 8%
 */
export const COMMISSION_TIERS: readonly CommissionTier[] = [
  { minCents: 0, maxCents: 50_000, rate: 0.15, label: 'Tier 1 (<$500)' },
  { minCents: 50_000, maxCents: 500_000, rate: 0.12, label: 'Tier 2 ($500–$5K)' },
  { minCents: 500_000, maxCents: 2_500_000, rate: 0.10, label: 'Tier 3 ($5K–$25K)' },
  { minCents: 2_500_000, maxCents: Infinity, rate: 0.08, label: 'Tier 4 ($25K+)' },
] as const;

// ---------------------------------------------------------------------------
// Fee Constants
// ---------------------------------------------------------------------------

/** Service fee charged to the CLIENT on top of the job price (5%) */
export const SERVICE_FEE_RATE = 0.05;

/**
 * Emergency / surge premium — the platform keeps 20% of the surge markup.
 * Example: base $200, surge multiplier 1.5 → surge = $100 → platform keeps $20.
 */
export const EMERGENCY_PREMIUM_PLATFORM_SHARE = 0.20;

/** Instant payout fee deducted from the Pro's payout (1%) */
export const INSTANT_PAYOUT_FEE_RATE = 0.01;

/** Flat cancellation fee in cents ($25.00) */
export const CANCELLATION_FEE_CENTS = 2_500;

/** Insurance referral commission range (6–8%) */
export const INSURANCE_COMMISSION_RATE_MIN = 0.06;
export const INSURANCE_COMMISSION_RATE_MAX = 0.08;
export const INSURANCE_COMMISSION_RATE_DEFAULT = 0.07;

// ---------------------------------------------------------------------------
// Enums / Status Types
// ---------------------------------------------------------------------------

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'in_escrow'
  | 'released'
  | 'refunded'
  | 'partially_refunded'
  | 'failed'
  | 'cancelled';

export type DisputeStatus =
  | 'opened'
  | 'under_mediation'
  | 'escalated_to_regional'
  | 'resolved_full_release'
  | 'resolved_partial_release'
  | 'resolved_full_refund';

export type MilestonePaymentStatus =
  | 'pending'
  | 'funded'
  | 'in_escrow'
  | 'released'
  | 'disputed'
  | 'refunded';

export type DisputeResolution =
  | 'full_release'
  | 'partial_release'
  | 'full_refund';

// ---------------------------------------------------------------------------
// Domain Models
// ---------------------------------------------------------------------------

export interface PaymentIntent {
  id: string;
  jobId: string;
  clientStripeId: string;
  amountCents: number;
  serviceFeeCents: number;
  commissionCents: number;
  status: PaymentStatus;
  flow: PaymentFlow;
  createdAt: Date;
  updatedAt: Date;
}

export interface MilestonePayment {
  id: string;
  jobId: string;
  milestoneIndex: number;
  description: string;
  amountCents: number;
  status: MilestonePaymentStatus;
  dueDate: Date | null;
  releasedAt: Date | null;
}

export interface Milestone {
  description: string;
  amountCents: number;
  dueDate?: Date;
}

export interface Dispute {
  id: string;
  paymentId: string;
  raisedBy: 'client' | 'pro';
  reason: string;
  evidence: DisputeEvidence[];
  status: DisputeStatus;
  resolution: DisputeResolution | null;
  resolvedAmountCents: number | null;
  openedAt: Date;
  mediationDeadline: Date;
  escalatedAt: Date | null;
  resolvedAt: Date | null;
}

export interface DisputeEvidence {
  type: 'photo' | 'message' | 'checklist_status' | 'document' | 'other';
  url: string;
  description: string;
  submittedBy: 'client' | 'pro';
  submittedAt: Date;
}

export interface PayoutBreakdown {
  grossAmountCents: number;
  commissionCents: number;
  emergencyPremiumCents: number;
  insuranceCommissionCents: number;
  instantPayoutFeeCents: number;
  netPayoutCents: number;
}

export interface PlatformRevenueBreakdown {
  commissionCents: number;
  serviceFeeCents: number;
  emergencyPremiumCents: number;
  totalRevenueCents: number;
}

export type JobType = 'standard' | 'emergency' | 'insurance';
