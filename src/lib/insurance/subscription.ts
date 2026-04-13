/**
 * Sherpa Pros Platform — Pro Subscription & Retainer Management
 *
 * Manages Pro subscription tiers for emergency/insurance work.
 * Higher tiers require more certifications and stricter SLA compliance
 * but unlock premium job access and higher visibility.
 *
 * ALL monetary values are INTEGER CENTS. $1.00 = 100 cents.
 */

import type {
  SubscriptionTier,
  SubscriptionRequirement,
  SubscriptionBenefit,
  SubscriptionDetails,
  SLAComplianceResult,
  IICRCCert,
} from './types';

// ---------------------------------------------------------------------------
// Subscription Tier Definitions
// ---------------------------------------------------------------------------

const TIER_REQUIREMENTS: Record<SubscriptionTier, SubscriptionRequirement> = {
  standard: {
    tier: 'standard',
    min_rating: 300, // 0-500 scale
    required_certs: [],
    recommended_certs: [],
    max_response_minutes: 60,
    min_accept_rate: 70,
    min_completed_jobs: 5,
    insurance_required: true,
    background_check_required: true,
  },
  emergency_ready: {
    tier: 'emergency_ready',
    min_rating: 375,
    required_certs: ['WRT'] as IICRCCert[],
    recommended_certs: ['ASD'] as IICRCCert[],
    max_response_minutes: 30,
    min_accept_rate: 85,
    min_completed_jobs: 25,
    insurance_required: true,
    background_check_required: true,
  },
  restoration_certified: {
    tier: 'restoration_certified',
    min_rating: 425,
    required_certs: ['WRT', 'FSRT'] as IICRCCert[],
    recommended_certs: ['ASD', 'AMRT', 'OCT'] as IICRCCert[],
    max_response_minutes: 15,
    min_accept_rate: 90,
    min_completed_jobs: 75,
    insurance_required: true,
    background_check_required: true,
  },
};

const TIER_BENEFITS: Record<SubscriptionTier, SubscriptionBenefit[]> = {
  standard: [
    { name: 'Standard Job Access', description: 'Access to all standard dispatch jobs in your hub' },
    { name: 'Platform Profile', description: 'Verified Pro profile visible to clients' },
    { name: 'Payment Processing', description: 'Stripe Connect payouts with standard commission rates' },
    { name: 'Basic Analytics', description: 'Job history and earnings dashboard' },
  ],
  emergency_ready: [
    { name: 'Emergency Job Priority', description: 'First-tier priority for emergency dispatch jobs' },
    { name: 'After-Hours Dispatch', description: 'Receive dispatch requests outside business hours' },
    { name: 'Emergency Premium', description: 'Earn emergency surge pricing (1.5x-2x base rate)' },
    { name: 'Insurance Network', description: 'Listed in carrier-approved contractor network' },
    { name: 'Priority Support', description: 'Direct line to platform support team' },
    { name: 'Advanced Analytics', description: 'Response time tracking and performance insights' },
    { name: 'Certification Badge', description: 'Emergency Ready badge on profile' },
  ],
  restoration_certified: [
    { name: 'Insurance Job Exclusive', description: 'Exclusive access to insurance restoration jobs' },
    { name: 'Carrier Direct', description: 'Direct referrals from insurance carrier partners' },
    { name: 'Supplement Support', description: 'Xactimate comparison tools and supplement generation' },
    { name: 'Documentation Engine', description: 'Full IICRC-compliant documentation package generation' },
    { name: 'Premium Commission', description: 'Reduced platform commission rate (8% vs 12%)' },
    { name: 'Priority Dispatch', description: 'Top-tier priority in all dispatch queues' },
    { name: 'Marketing Boost', description: 'Featured placement in client search results' },
    { name: 'Dedicated Account Manager', description: 'Personal account manager for job support' },
    { name: 'Restoration Certified Badge', description: 'Premium certification badge on profile' },
    { name: 'Training Access', description: 'Free access to IICRC prep materials and webinars' },
  ],
};

// ---------------------------------------------------------------------------
// Base Monthly Fees (cents) — varies by hub
// ---------------------------------------------------------------------------

/**
 * Hub-based fee tiers. Higher-cost markets command higher retainer fees
 * because Pros earn more per job in those areas.
 */
const HUB_FEE_MULTIPLIERS: Record<string, number> = {
  'hub-boston': 1.5,
  'hub-cambridge': 1.5,
  'hub-portsmouth': 1.1,
  'hub-nashua': 1.05,
  'hub-manchester': 1.0,
  'hub-concord': 0.9,
  'hub-portland': 1.0,
  'hub-burlington': 0.95,
  'hub-providence': 1.2,
  'hub-worcester': 1.15,
};

const BASE_MONTHLY_FEES: Record<SubscriptionTier, number> = {
  standard: 4_900, // $49/month
  emergency_ready: 14_900, // $149/month
  restoration_certified: 29_900, // $299/month
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the requirements for a subscription tier.
 */
export function getSubscriptionRequirements(
  tier: SubscriptionTier
): SubscriptionRequirement {
  return { ...TIER_REQUIREMENTS[tier] };
}

/**
 * Validates whether a Pro meets the requirements for a given tier.
 *
 * @param proProfile - Pro's current profile data
 * @param tier - Target subscription tier
 * @returns Object with pass/fail and specific gaps
 */
export function validateProForTier(
  proProfile: {
    rating: number;
    certs: string[];
    avg_response_minutes: number;
    accept_rate: number;
    completed_jobs: number;
    has_insurance: boolean;
    background_check_passed: boolean;
  },
  tier: SubscriptionTier
): { eligible: boolean; gaps: string[] } {
  const req = TIER_REQUIREMENTS[tier];
  const gaps: string[] = [];

  if (proProfile.rating < req.min_rating) {
    gaps.push(
      `Rating ${proProfile.rating} is below minimum ${req.min_rating} for ${tier}`
    );
  }

  for (const cert of req.required_certs) {
    if (!proProfile.certs.includes(cert)) {
      gaps.push(`Missing required IICRC certification: ${cert}`);
    }
  }

  if (proProfile.avg_response_minutes > req.max_response_minutes) {
    gaps.push(
      `Average response time ${proProfile.avg_response_minutes}min exceeds maximum ${req.max_response_minutes}min`
    );
  }

  if (proProfile.accept_rate < req.min_accept_rate) {
    gaps.push(
      `Accept rate ${proProfile.accept_rate}% is below minimum ${req.min_accept_rate}%`
    );
  }

  if (proProfile.completed_jobs < req.min_completed_jobs) {
    gaps.push(
      `${proProfile.completed_jobs} completed jobs is below minimum ${req.min_completed_jobs}`
    );
  }

  if (req.insurance_required && !proProfile.has_insurance) {
    gaps.push('Active liability insurance is required');
  }

  if (req.background_check_required && !proProfile.background_check_passed) {
    gaps.push('Background check must be passed');
  }

  return {
    eligible: gaps.length === 0,
    gaps,
  };
}

/**
 * Calculates the monthly retainer fee for a tier in a specific hub.
 *
 * @param tier - Subscription tier
 * @param hub - Hub identifier (e.g., "hub-boston", "hub-manchester")
 * @returns Monthly fee in cents
 */
export function calculateRetainerFee(
  tier: SubscriptionTier,
  hub: string
): number {
  const baseFee = BASE_MONTHLY_FEES[tier];
  const hubMultiplier = HUB_FEE_MULTIPLIERS[hub] ?? 1.0;
  return Math.round(baseFee * hubMultiplier);
}

/**
 * Checks whether a Pro met their SLA commitments during a given period.
 *
 * SLA compliance means:
 * - Responded to dispatches within the tier's max_response_minutes
 * - Maintained accept rate above tier minimum
 * - Compliance rate >= 90% to remain in good standing
 *
 * @param dispatches - Array of dispatch records for the period
 * @param tier - Pro's current subscription tier
 * @returns SLA compliance result
 */
export function checkSLACompliance(
  proId: string,
  dispatches: {
    responded_at: Date | null;
    dispatched_at: Date;
    accepted: boolean;
  }[],
  tier: SubscriptionTier,
  periodStart: Date,
  periodEnd: Date
): SLAComplianceResult {
  const req = TIER_REQUIREMENTS[tier];
  const maxResponseMs = req.max_response_minutes * 60 * 1000;

  let onTime = 0;
  let late = 0;
  let missed = 0;

  for (const dispatch of dispatches) {
    if (!dispatch.responded_at) {
      missed++;
      continue;
    }

    const responseMs =
      dispatch.responded_at.getTime() - dispatch.dispatched_at.getTime();

    if (responseMs <= maxResponseMs) {
      onTime++;
    } else {
      late++;
    }
  }

  const total = dispatches.length;
  const complianceRate = total > 0 ? Math.round((onTime / total) * 100) : 100;

  return {
    pro_id: proId,
    period_start: periodStart,
    period_end: periodEnd,
    total_dispatches: total,
    on_time_responses: onTime,
    late_responses: late,
    missed_responses: missed,
    compliance_rate: complianceRate,
    compliant: complianceRate >= 90,
  };
}

/**
 * Returns the benefits list for a given subscription tier.
 */
export function getSubscriptionBenefits(
  tier: SubscriptionTier
): SubscriptionBenefit[] {
  return [...TIER_BENEFITS[tier]];
}

/**
 * Returns complete subscription details including requirements, fee, and benefits.
 */
export function getSubscriptionDetails(
  tier: SubscriptionTier,
  hub: string
): SubscriptionDetails {
  return {
    tier,
    monthly_fee_cents: calculateRetainerFee(tier, hub),
    requirements: getSubscriptionRequirements(tier),
    benefits: getSubscriptionBenefits(tier),
  };
}

/**
 * Returns all available tiers in ascending order.
 */
export function getAllTiers(): SubscriptionTier[] {
  return ['standard', 'emergency_ready', 'restoration_certified'];
}
