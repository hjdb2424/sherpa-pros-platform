import {
  getAcceptedBidForJob,
  getUserByProId,
  getCapturedTotalForJob,
  getPendingPaymentForMilestone,
  insertPendingPayment,
  setPaymentIntentId,
  deletePaymentRow,
} from '@/db/queries/payments';
import { getUserById } from '@/db/queries/users';
import { getJob } from '@/db/queries/jobs';
import { getMilestone } from '@/db/queries/milestones';
import { getPaymentService } from '@/lib/services/payments';

export type CaptureError =
  | 'unauthorized'
  | 'not_owner'
  | 'job_not_fundable'
  | 'milestone_not_pending'
  | 'milestone_not_in_job'
  | 'job_has_no_accepted_bid'
  | 'pro_not_verified'
  | 'beta_cap_exceeded';

export type CaptureResult =
  | { ok: true; clientSecret: string; paymentRowId: string; paymentIntentId: string }
  | { ok: true; alreadyFunded: true }
  | { ok: false; error: CaptureError; meta?: Record<string, unknown> };

export interface CaptureInput {
  clientUserId: string;
  jobId: string;
  milestoneId: string;
  amountCents: number;
}

const TERMINAL_JOB_STATES = new Set(['cancelled', 'completed']);
const BETA_CAP_CENTS = 50000;

export async function runCaptureForMilestone(input: CaptureInput): Promise<CaptureResult> {
  // Gate 1: auth + user exists
  const dbUser = await getUserById(input.clientUserId);
  if (!dbUser) {
    return { ok: false, error: 'unauthorized' };
  }

  // Gate 2: ownership
  const job = await getJob(input.jobId);
  if (!job) {
    return { ok: false, error: 'unauthorized' };
  }
  if (job.clientUserId !== input.clientUserId) {
    return { ok: false, error: 'not_owner' };
  }

  // Gate 3: job state
  if (TERMINAL_JOB_STATES.has(job.status)) {
    return { ok: false, error: 'job_not_fundable' };
  }

  // Gate 4: milestone exists, belongs to job, is pending
  const milestone = await getMilestone(input.milestoneId);
  if (!milestone) {
    return { ok: false, error: 'milestone_not_in_job' };
  }
  if (milestone.jobId !== input.jobId) {
    return { ok: false, error: 'milestone_not_in_job' };
  }
  if (milestone.status !== 'pending') {
    return { ok: false, error: 'milestone_not_pending' };
  }

  // Gate 5: accepted bid exists (resolves the pro)
  const bid = await getAcceptedBidForJob(input.jobId);
  if (!bid) {
    return { ok: false, error: 'job_has_no_accepted_bid' };
  }

  // Gate 6: pro is verified (stripe_account_status === 'active')
  const proUser = await getUserByProId(bid.proId);
  if (!proUser || proUser.stripeAccountStatus !== 'active') {
    return {
      ok: false,
      error: 'pro_not_verified',
      meta: { proName: proUser?.email ?? 'the pro' },
    };
  }

  // Gate 7: beta cap
  const captured = await getCapturedTotalForJob(input.jobId);
  if (captured + input.amountCents > BETA_CAP_CENTS) {
    return {
      ok: false,
      error: 'beta_cap_exceeded',
      meta: { limit: BETA_CAP_CENTS, currentTotal: captured },
    };
  }

  // Reuse-pending: if a pending row exists, check its Stripe-side state.
  const existingPending = await getPendingPaymentForMilestone(
    input.jobId,
    input.milestoneId,
    input.clientUserId,
  );
  if (existingPending && existingPending.stripePaymentIntentId) {
    const paymentService = getPaymentService();
    const intent = await paymentService.retrievePaymentIntent(
      existingPending.stripePaymentIntentId,
    );
    if (intent.status === 'succeeded') {
      return { ok: true, alreadyFunded: true };
    }
    if (intent.status === 'canceled') {
      // Stale row — delete and fall through to new-intent creation.
      await deletePaymentRow(existingPending.id);
    } else if (
      intent.status === 'requires_payment_method' ||
      intent.status === 'requires_confirmation' ||
      intent.status === 'processing'
    ) {
      if (!intent.client_secret) {
        throw new Error(`PaymentIntent ${intent.id} missing client_secret`);
      }
      return {
        ok: true,
        clientSecret: intent.client_secret,
        paymentRowId: existingPending.id,
        paymentIntentId: intent.id,
      };
    } else {
      console.error(
        `[capture] unexpected PaymentIntent status ${intent.status} for ${intent.id}`,
      );
      throw new Error(`unexpected PaymentIntent status: ${intent.status}`);
    }
  }

  // New PaymentIntent path
  const paymentRowId = crypto.randomUUID();
  const insertResult = await insertPendingPayment({
    id: paymentRowId,
    jobId: input.jobId,
    milestoneId: input.milestoneId,
    payerUserId: input.clientUserId,
    payeeUserId: proUser.id,
    amountCents: input.amountCents,
  });
  if (!insertResult.inserted) {
    // Race lost — re-enter reuse-pending logic with the row that won.
    return runCaptureForMilestone(input);
  }

  const paymentService = getPaymentService();
  let captureResult;
  try {
    captureResult = await paymentService.capturePayment({
      paymentRowId,
      amountCents: input.amountCents,
      description: `Job ${input.jobId} milestone ${input.milestoneId}`,
      metadata: {
        jobId: input.jobId,
        milestoneId: input.milestoneId,
        paymentRowId,
      },
    });
  } catch (err) {
    await deletePaymentRow(paymentRowId);
    throw err;
  }
  await setPaymentIntentId(paymentRowId, captureResult.paymentIntentId);

  return {
    ok: true,
    clientSecret: captureResult.clientSecret,
    paymentRowId,
    paymentIntentId: captureResult.paymentIntentId,
  };
}
