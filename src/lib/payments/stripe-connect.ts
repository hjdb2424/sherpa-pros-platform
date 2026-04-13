/**
 * Sherpa Pros Platform — Stripe Connect Integration
 *
 * Uses Stripe Connect with destination charges for marketplace payments.
 * All monetary values in INTEGER CENTS.
 *
 * This module contains the full logic structure with TODO placeholders
 * where actual Stripe SDK calls will be wired in.
 */

import { calculateCommission, calculateServiceFee, calculateInstantPayoutFee } from './commission';
import type {
  JobType,
  Milestone,
  MilestonePayment,
  MilestonePaymentStatus,
  PaymentIntent,
  PaymentFlow,
  PaymentStatus,
} from './types';

// ---------------------------------------------------------------------------
// Types for Stripe responses (stubs until Stripe SDK is added)
// ---------------------------------------------------------------------------

interface StripeAccountResult {
  connectAccountId: string;
  onboardingUrl: string;
}

interface StripePaymentIntentResult {
  paymentIntentId: string;
  clientSecret: string;
  status: PaymentStatus;
}

interface StripeTransferResult {
  transferId: string;
  amountCents: number;
  destinationAccountId: string;
}

interface StripePayoutResult {
  payoutId: string;
  amountCents: number;
  feeCents: number;
  arrivalDate: Date;
}

interface StripeRefundResult {
  refundId: string;
  amountCents: number;
  status: 'succeeded' | 'pending' | 'failed';
}

// ---------------------------------------------------------------------------
// Connected Account Onboarding
// ---------------------------------------------------------------------------

/**
 * Create a Stripe Connect Standard account for a Pro and generate
 * an onboarding link.
 *
 * Flow:
 *   1. Create Connect account with metadata (proId)
 *   2. Create account link for onboarding
 *   3. Store connectAccountId in our database
 *   4. Return onboarding URL for the Pro to complete KYC
 *
 * @param proId   Internal Pro user ID
 * @param email   Pro's email address
 * @returns Connect account ID + onboarding URL
 */
export async function createConnectedAccount(
  proId: string,
  email: string,
): Promise<StripeAccountResult> {
  if (!proId || !email) {
    throw new Error('proId and email are required');
  }

  // TODO: Replace with actual Stripe SDK call
  // const account = await stripe.accounts.create({
  //   type: 'standard',
  //   email,
  //   metadata: { proId, platform: 'sherpa_pros' },
  //   capabilities: {
  //     card_payments: { requested: true },
  //     transfers: { requested: true },
  //   },
  // });

  // TODO: Create onboarding link
  // const accountLink = await stripe.accountLinks.create({
  //   account: account.id,
  //   refresh_url: `${BASE_URL}/pro/onboarding/refresh?proId=${proId}`,
  //   return_url: `${BASE_URL}/pro/onboarding/complete?proId=${proId}`,
  //   type: 'account_onboarding',
  // });

  // TODO: Persist account.id to database
  // await db.update(pros).set({ stripeConnectId: account.id }).where(eq(pros.id, proId));

  const connectAccountId = `acct_placeholder_${proId}`;
  const onboardingUrl = `https://connect.stripe.com/setup/s/placeholder_${proId}`;

  return { connectAccountId, onboardingUrl };
}

// ---------------------------------------------------------------------------
// Payment Intent Creation
// ---------------------------------------------------------------------------

/**
 * Create a PaymentIntent to charge the client for a job.
 *
 * The total charge = job amount + service fee (5%).
 * Funds are captured but NOT transferred until work is verified.
 *
 * @param jobId           Internal job ID
 * @param amountCents     Job amount in cents (before service fee)
 * @param clientStripeId  Client's Stripe customer ID
 * @param jobType         Job type for commission calculation
 * @returns PaymentIntent details including client secret for frontend
 */
export async function createPaymentIntent(
  jobId: string,
  amountCents: number,
  clientStripeId: string,
  jobType: JobType = 'standard',
): Promise<StripePaymentIntentResult> {
  if (amountCents <= 0) {
    throw new RangeError('amountCents must be positive');
  }

  const serviceFeeCents = calculateServiceFee(amountCents);
  const totalChargeCents = amountCents + serviceFeeCents;
  const commissionCents = calculateCommission(amountCents, jobType);

  // TODO: Replace with actual Stripe SDK call
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: totalChargeCents,
  //   currency: 'usd',
  //   customer: clientStripeId,
  //   capture_method: 'manual',  // Hold funds, release later
  //   metadata: {
  //     jobId,
  //     jobType,
  //     baseAmountCents: amountCents.toString(),
  //     serviceFeeCents: serviceFeeCents.toString(),
  //     commissionCents: commissionCents.toString(),
  //     platform: 'sherpa_pros',
  //   },
  // });

  // TODO: Persist payment intent to database
  // await db.insert(payments).values({
  //   id: paymentIntent.id,
  //   jobId,
  //   clientStripeId,
  //   amountCents,
  //   serviceFeeCents,
  //   commissionCents,
  //   status: 'authorized',
  //   flow: amountCents >= 500_000 ? 'milestone_based' : 'pay_on_completion',
  // });

  void totalChargeCents;
  void commissionCents;

  return {
    paymentIntentId: `pi_placeholder_${jobId}`,
    clientSecret: `pi_placeholder_${jobId}_secret`,
    status: 'authorized',
  };
}

// ---------------------------------------------------------------------------
// Escrow
// ---------------------------------------------------------------------------

/**
 * Capture an authorized PaymentIntent and hold funds in escrow.
 * Called when the client confirms the job is booked.
 *
 * @param paymentIntentId  Stripe PaymentIntent ID
 * @returns Updated payment status
 */
export async function holdInEscrow(
  paymentIntentId: string,
): Promise<{ status: PaymentStatus }> {
  if (!paymentIntentId) {
    throw new Error('paymentIntentId is required');
  }

  // TODO: Replace with actual Stripe SDK call
  // const captured = await stripe.paymentIntents.capture(paymentIntentId);

  // TODO: Update database status
  // await db.update(payments)
  //   .set({ status: 'in_escrow', updatedAt: new Date() })
  //   .where(eq(payments.id, paymentIntentId));

  return { status: 'in_escrow' };
}

// ---------------------------------------------------------------------------
// Payout Release
// ---------------------------------------------------------------------------

/**
 * Release escrowed funds to the Pro's connected account, minus
 * the platform commission.
 *
 * Uses Stripe Transfer to move funds from platform to Pro.
 *
 * @param paymentIntentId      Stripe PaymentIntent ID
 * @param proConnectAccountId  Pro's Stripe Connect account ID
 * @param amountCents          Total job amount in cents
 * @param commissionCents      Platform commission in cents
 * @returns Transfer details
 */
export async function releasePayout(
  paymentIntentId: string,
  proConnectAccountId: string,
  amountCents: number,
  commissionCents: number,
): Promise<StripeTransferResult> {
  if (amountCents <= 0) {
    throw new RangeError('amountCents must be positive');
  }
  if (commissionCents < 0) {
    throw new RangeError('commissionCents must be non-negative');
  }
  if (commissionCents >= amountCents) {
    throw new RangeError('commissionCents must be less than amountCents');
  }

  const transferAmountCents = amountCents - commissionCents;

  // TODO: Replace with actual Stripe SDK call
  // const transfer = await stripe.transfers.create({
  //   amount: transferAmountCents,
  //   currency: 'usd',
  //   destination: proConnectAccountId,
  //   source_transaction: paymentIntentId,  // Link to the original charge
  //   metadata: {
  //     paymentIntentId,
  //     commissionCents: commissionCents.toString(),
  //     platform: 'sherpa_pros',
  //   },
  // });

  // TODO: Update database
  // await db.update(payments)
  //   .set({ status: 'released', updatedAt: new Date() })
  //   .where(eq(payments.id, paymentIntentId));

  return {
    transferId: `tr_placeholder_${paymentIntentId}`,
    amountCents: transferAmountCents,
    destinationAccountId: proConnectAccountId,
  };
}

// ---------------------------------------------------------------------------
// Milestone Payments
// ---------------------------------------------------------------------------

/**
 * Set up a milestone-based payment schedule for a job.
 *
 * Each milestone gets its own PaymentIntent that is authorized upfront
 * and captured when the milestone is completed and approved.
 *
 * @param jobId       Internal job ID
 * @param milestones  Array of milestone definitions
 * @returns Array of created milestone payment records
 */
export async function createMilestonePayments(
  jobId: string,
  milestones: Milestone[],
): Promise<MilestonePayment[]> {
  if (!milestones.length) {
    throw new Error('At least one milestone is required');
  }

  const totalCents = milestones.reduce((sum, m) => sum + m.amountCents, 0);
  if (totalCents <= 0) {
    throw new RangeError('Total milestone amount must be positive');
  }

  const milestonePayments: MilestonePayment[] = [];

  for (let i = 0; i < milestones.length; i++) {
    const milestone = milestones[i];

    // TODO: Create a PaymentIntent per milestone (authorized, not captured)
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: milestone.amountCents + calculateServiceFee(milestone.amountCents),
    //   currency: 'usd',
    //   capture_method: 'manual',
    //   metadata: {
    //     jobId,
    //     milestoneIndex: i.toString(),
    //     description: milestone.description,
    //     platform: 'sherpa_pros',
    //   },
    // });

    const milestonePayment: MilestonePayment = {
      id: `ms_${jobId}_${i}`,
      jobId,
      milestoneIndex: i,
      description: milestone.description,
      amountCents: milestone.amountCents,
      status: 'pending' as MilestonePaymentStatus,
      dueDate: milestone.dueDate ?? null,
      releasedAt: null,
    };

    milestonePayments.push(milestonePayment);
  }

  // TODO: Persist all milestone records to database
  // await db.insert(milestonePaymentsTable).values(milestonePayments);

  return milestonePayments;
}

/**
 * Release a single milestone payment after the work is verified.
 *
 * Captures the authorized PaymentIntent and transfers funds to the Pro.
 *
 * @param milestoneId  Internal milestone payment ID
 * @returns Updated milestone status
 */
export async function releaseMilestone(
  milestoneId: string,
): Promise<{ status: MilestonePaymentStatus; releasedAt: Date }> {
  if (!milestoneId) {
    throw new Error('milestoneId is required');
  }

  // TODO: Fetch milestone from database
  // const milestone = await db.query.milestonePayments.findFirst({
  //   where: eq(milestonePaymentsTable.id, milestoneId),
  // });
  // if (!milestone) throw new Error('Milestone not found');
  // if (milestone.status !== 'funded' && milestone.status !== 'in_escrow') {
  //   throw new Error(`Cannot release milestone in status: ${milestone.status}`);
  // }

  // TODO: Capture the PaymentIntent
  // await stripe.paymentIntents.capture(milestone.paymentIntentId);

  // TODO: Create transfer to Pro
  // const commission = calculateCommission(milestone.amountCents);
  // await stripe.transfers.create({
  //   amount: milestone.amountCents - commission,
  //   currency: 'usd',
  //   destination: proConnectAccountId,
  // });

  const releasedAt = new Date();

  // TODO: Update database
  // await db.update(milestonePaymentsTable)
  //   .set({ status: 'released', releasedAt })
  //   .where(eq(milestonePaymentsTable.id, milestoneId));

  return { status: 'released', releasedAt };
}

// ---------------------------------------------------------------------------
// Instant Payout
// ---------------------------------------------------------------------------

/**
 * Process an instant payout for a Pro. Charges a 1% fee.
 *
 * Uses Stripe Instant Payouts to send funds to the Pro's debit card
 * or bank account immediately.
 *
 * @param proConnectAccountId  Pro's Stripe Connect account ID
 * @param amountCents          Amount to pay out in cents
 * @returns Payout details including fee and arrival date
 */
export async function handleInstantPayout(
  proConnectAccountId: string,
  amountCents: number,
): Promise<StripePayoutResult> {
  if (amountCents <= 0) {
    throw new RangeError('amountCents must be positive');
  }

  const feeCents = calculateInstantPayoutFee(amountCents);
  const netPayoutCents = amountCents - feeCents;

  if (netPayoutCents <= 0) {
    throw new RangeError('Amount too small for instant payout after fee deduction');
  }

  // TODO: Replace with actual Stripe SDK call
  // const payout = await stripe.payouts.create(
  //   {
  //     amount: netPayoutCents,
  //     currency: 'usd',
  //     method: 'instant',
  //     metadata: {
  //       feeCents: feeCents.toString(),
  //       originalAmountCents: amountCents.toString(),
  //       platform: 'sherpa_pros',
  //     },
  //   },
  //   { stripeAccount: proConnectAccountId },
  // );

  // TODO: Record fee revenue
  // await db.insert(platformFees).values({
  //   type: 'instant_payout_fee',
  //   amountCents: feeCents,
  //   proConnectAccountId,
  // });

  return {
    payoutId: `po_placeholder_${proConnectAccountId}`,
    amountCents: netPayoutCents,
    feeCents,
    arrivalDate: new Date(), // Instant payouts arrive within minutes
  };
}

// ---------------------------------------------------------------------------
// Refunds
// ---------------------------------------------------------------------------

/**
 * Process a full or partial refund on a PaymentIntent.
 *
 * @param paymentIntentId  Stripe PaymentIntent ID
 * @param amountCents      Amount to refund in cents (0 = full refund)
 * @param reason           Reason for the refund
 * @returns Refund details
 */
export async function processRefund(
  paymentIntentId: string,
  amountCents: number,
  reason: string,
): Promise<StripeRefundResult> {
  if (amountCents < 0) {
    throw new RangeError('amountCents must be non-negative (0 for full refund)');
  }
  if (!reason) {
    throw new Error('Refund reason is required');
  }

  // TODO: Replace with actual Stripe SDK call
  // const refundParams: Stripe.RefundCreateParams = {
  //   payment_intent: paymentIntentId,
  //   reason: 'requested_by_customer',
  //   metadata: {
  //     internalReason: reason,
  //     platform: 'sherpa_pros',
  //   },
  // };
  // if (amountCents > 0) {
  //   refundParams.amount = amountCents;
  // }
  // const refund = await stripe.refunds.create(refundParams);

  // TODO: Update payment status in database
  // const newStatus = amountCents === 0 ? 'refunded' : 'partially_refunded';
  // await db.update(payments)
  //   .set({ status: newStatus, updatedAt: new Date() })
  //   .where(eq(payments.id, paymentIntentId));

  // TODO: If Pro was already paid, create a reversal
  // await stripe.transfers.createReversal(transferId, {
  //   amount: amountCents > 0 ? amountCents : undefined,
  // });

  return {
    refundId: `re_placeholder_${paymentIntentId}`,
    amountCents,
    status: 'succeeded',
  };
}
