/**
 * Sherpa Pros Platform — Commission Calculation Engine
 *
 * Every function operates exclusively in INTEGER CENTS.
 * No floating-point currency math anywhere.
 */

import {
  COMMISSION_TIERS,
  SERVICE_FEE_RATE,
  EMERGENCY_PREMIUM_PLATFORM_SHARE,
  INSTANT_PAYOUT_FEE_RATE,
  INSURANCE_COMMISSION_RATE_DEFAULT,
  type JobType,
  type PayoutBreakdown,
  type PlatformRevenueBreakdown,
} from './types';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Safe integer rounding — always Math.round to avoid sub-cent drift.
 * Uses banker's-style rounding via Math.round (rounds .5 up).
 */
function centsOf(amount: number, rate: number): number {
  return Math.round(amount * rate);
}

// ---------------------------------------------------------------------------
// Commission
// ---------------------------------------------------------------------------

/**
 * Calculate the platform commission for a given job amount using the
 * sliding-scale tier system.
 *
 * Tiers:
 *   < $500   (< 50 000¢)   → 15%
 *   $500–$5K               → 12%
 *   $5K–$25K               → 10%
 *   $25K+                  → 8%
 *
 * @param amountCents  Total job amount in cents (must be >= 0)
 * @param _jobType     Reserved for future per-type overrides
 * @returns Commission in cents
 */
export function calculateCommission(
  amountCents: number,
  _jobType: JobType = 'standard',
): number {
  if (amountCents < 0) {
    throw new RangeError('amountCents must be non-negative');
  }
  if (amountCents === 0) return 0;

  const tier = COMMISSION_TIERS.find(
    (t) => amountCents >= t.minCents && amountCents < t.maxCents,
  );

  // Fallback — should never happen given tiers go to Infinity
  const rate = tier ? tier.rate : COMMISSION_TIERS[COMMISSION_TIERS.length - 1].rate;
  return centsOf(amountCents, rate);
}

// ---------------------------------------------------------------------------
// Service fee (client-side)
// ---------------------------------------------------------------------------

/**
 * Calculate the 5% service fee charged to the CLIENT.
 *
 * @param amountCents  Base job amount in cents
 * @returns Service fee in cents
 */
export function calculateServiceFee(amountCents: number): number {
  if (amountCents < 0) {
    throw new RangeError('amountCents must be non-negative');
  }
  return centsOf(amountCents, SERVICE_FEE_RATE);
}

// ---------------------------------------------------------------------------
// Emergency premium
// ---------------------------------------------------------------------------

/**
 * Calculate the platform's share of the emergency/surge premium.
 *
 * The surge markup is:  base * (multiplier - 1)
 * The platform keeps 20% of that markup.
 *
 * @param baseCents   Base job amount in cents (before surge)
 * @param multiplier  Surge multiplier (e.g. 1.5 for a 50% surge)
 * @returns Platform's emergency premium in cents
 */
export function calculateEmergencyPremium(
  baseCents: number,
  multiplier: number,
): number {
  if (baseCents < 0) {
    throw new RangeError('baseCents must be non-negative');
  }
  if (multiplier < 1) {
    throw new RangeError('multiplier must be >= 1');
  }
  if (multiplier === 1) return 0;

  const surgeMarkupCents = centsOf(baseCents, multiplier - 1);
  return centsOf(surgeMarkupCents, EMERGENCY_PREMIUM_PLATFORM_SHARE);
}

// ---------------------------------------------------------------------------
// Insurance commission
// ---------------------------------------------------------------------------

/**
 * Calculate the insurance referral commission.
 *
 * @param premiumCents  Insurance premium amount in cents
 * @param rate          Commission rate (default 7%, range 6–8%)
 * @returns Commission in cents
 */
export function calculateInsuranceCommission(
  premiumCents: number,
  rate: number = INSURANCE_COMMISSION_RATE_DEFAULT,
): number {
  if (premiumCents < 0) {
    throw new RangeError('premiumCents must be non-negative');
  }
  if (rate < 0.06 || rate > 0.08) {
    throw new RangeError('Insurance commission rate must be between 0.06 and 0.08');
  }
  return centsOf(premiumCents, rate);
}

// ---------------------------------------------------------------------------
// Instant payout fee
// ---------------------------------------------------------------------------

/**
 * Calculate the 1% instant payout fee deducted from the Pro.
 *
 * @param amountCents  Payout amount in cents
 * @returns Fee in cents
 */
export function calculateInstantPayoutFee(amountCents: number): number {
  if (amountCents < 0) {
    throw new RangeError('amountCents must be non-negative');
  }
  return centsOf(amountCents, INSTANT_PAYOUT_FEE_RATE);
}

// ---------------------------------------------------------------------------
// Full payout calculation (net to Pro)
// ---------------------------------------------------------------------------

/**
 * Calculate the net payout a Pro receives after all deductions.
 *
 * Deductions from the Pro's gross:
 *   1. Platform commission (sliding scale)
 *   2. Emergency premium share (if emergency job)
 *   3. Insurance commission (if insurance job)
 *   4. Instant payout fee (if requested)
 *
 * @param amountCents    Total job amount in cents
 * @param jobType        'standard' | 'emergency' | 'insurance'
 * @param options.isInstantPayout  Whether Pro requested instant payout
 * @param options.emergencyMultiplier  Surge multiplier (only for emergency)
 * @param options.insurancePremiumCents  Insurance premium (only for insurance)
 * @param options.insuranceRate  Insurance commission rate (default 7%)
 * @returns Full payout breakdown in cents
 */
export function calculatePayout(
  amountCents: number,
  jobType: JobType = 'standard',
  options: {
    isInstantPayout?: boolean;
    emergencyMultiplier?: number;
    insurancePremiumCents?: number;
    insuranceRate?: number;
  } = {},
): PayoutBreakdown {
  if (amountCents < 0) {
    throw new RangeError('amountCents must be non-negative');
  }

  const commissionCents = calculateCommission(amountCents, jobType);

  let emergencyPremiumCents = 0;
  if (jobType === 'emergency' && options.emergencyMultiplier && options.emergencyMultiplier > 1) {
    // For emergency jobs, the amountCents already includes the surge.
    // We need the base to compute the premium.
    // base = amountCents / multiplier (rounded)
    const baseCents = Math.round(amountCents / options.emergencyMultiplier);
    emergencyPremiumCents = calculateEmergencyPremium(baseCents, options.emergencyMultiplier);
  }

  let insuranceCommissionCents = 0;
  if (jobType === 'insurance' && options.insurancePremiumCents) {
    insuranceCommissionCents = calculateInsuranceCommission(
      options.insurancePremiumCents,
      options.insuranceRate,
    );
  }

  const afterDeductions = amountCents - commissionCents - emergencyPremiumCents - insuranceCommissionCents;

  let instantPayoutFeeCents = 0;
  if (options.isInstantPayout) {
    instantPayoutFeeCents = calculateInstantPayoutFee(afterDeductions);
  }

  const netPayoutCents = afterDeductions - instantPayoutFeeCents;

  return {
    grossAmountCents: amountCents,
    commissionCents,
    emergencyPremiumCents,
    insuranceCommissionCents,
    instantPayoutFeeCents,
    netPayoutCents,
  };
}

// ---------------------------------------------------------------------------
// Platform revenue calculation
// ---------------------------------------------------------------------------

/**
 * Calculate total platform revenue from a job.
 *
 * Revenue sources:
 *   1. Commission from Pro (sliding scale)
 *   2. Service fee from Client (5%)
 *   3. Emergency premium share (if applicable)
 *
 * @param amountCents    Total job amount in cents
 * @param jobType        Job type
 * @param options.emergencyMultiplier  Surge multiplier (if emergency)
 * @returns Revenue breakdown in cents
 */
export function calculatePlatformRevenue(
  amountCents: number,
  jobType: JobType = 'standard',
  options: {
    emergencyMultiplier?: number;
  } = {},
): PlatformRevenueBreakdown {
  if (amountCents < 0) {
    throw new RangeError('amountCents must be non-negative');
  }

  const commissionCents = calculateCommission(amountCents, jobType);
  const serviceFeeCents = calculateServiceFee(amountCents);

  let emergencyPremiumCents = 0;
  if (jobType === 'emergency' && options.emergencyMultiplier && options.emergencyMultiplier > 1) {
    const baseCents = Math.round(amountCents / options.emergencyMultiplier);
    emergencyPremiumCents = calculateEmergencyPremium(baseCents, options.emergencyMultiplier);
  }

  return {
    commissionCents,
    serviceFeeCents,
    emergencyPremiumCents,
    totalRevenueCents: commissionCents + serviceFeeCents + emergencyPremiumCents,
  };
}
