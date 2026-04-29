import {
  getAcceptedBidForJob,
  getUserByProId,
  getCapturedTotalForJob,
} from '@/db/queries/payments';
import { getUserById } from '@/db/queries/users';
import { getJob } from '@/db/queries/jobs';
import { getMilestone } from '@/db/queries/milestones';

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

  // Happy path lands in Task 8.
  throw new Error('Not implemented yet — see Task 8');
}
