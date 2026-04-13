/**
 * Sherpa Pros Platform — Payment Module
 *
 * Barrel export for the payment system.
 */

// Types
export type {
  PaymentFlow,
  CommissionTier,
  PaymentStatus,
  DisputeStatus,
  MilestonePaymentStatus,
  DisputeResolution,
  PaymentIntent,
  MilestonePayment,
  Milestone,
  Dispute,
  DisputeEvidence,
  PayoutBreakdown,
  PlatformRevenueBreakdown,
  JobType,
} from './types';

export {
  COMMISSION_TIERS,
  SERVICE_FEE_RATE,
  EMERGENCY_PREMIUM_PLATFORM_SHARE,
  INSTANT_PAYOUT_FEE_RATE,
  CANCELLATION_FEE_CENTS,
  INSURANCE_COMMISSION_RATE_MIN,
  INSURANCE_COMMISSION_RATE_MAX,
  INSURANCE_COMMISSION_RATE_DEFAULT,
} from './types';

// Commission engine
export {
  calculateCommission,
  calculateServiceFee,
  calculateEmergencyPremium,
  calculateInsuranceCommission,
  calculateInstantPayoutFee,
  calculatePayout,
  calculatePlatformRevenue,
} from './commission';

// Stripe Connect
export {
  createConnectedAccount,
  createPaymentIntent,
  holdInEscrow,
  releasePayout,
  createMilestonePayments,
  releaseMilestone,
  handleInstantPayout,
  processRefund,
} from './stripe-connect';

// Dispute resolution
export {
  createDispute,
  autoMediate,
  escalateToRegional,
  checkMediationExpiry,
  resolveDispute,
  addEvidence,
  getDispute,
  getDisputesByPayment,
} from './dispute';

export type { AutoMediationResult } from './dispute';
