import { db } from '@/db';
import { payments, jobMilestones } from '@/db/drizzle-schema';
import { and, eq, sum, inArray } from 'drizzle-orm';

export interface PaymentRow {
  id: string;
  jobId: string;
  milestoneId: string | null;
  payerUserId: string;
  payeeUserId: string;
  amountCents: number;
  status: 'pending' | 'held' | 'released' | 'refunded' | 'disputed';
  stripePaymentIntentId: string | null;
  heldAt: Date | null;
}

/**
 * Find the pending payment row for (jobId, milestoneId, payerUserId), if any.
 * Used by the reuse-pending path on funding-page reload.
 */
export async function getPendingPaymentForMilestone(
  jobId: string,
  milestoneId: string,
  payerUserId: string,
): Promise<PaymentRow | null> {
  const rows = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.jobId, jobId),
        eq(payments.milestoneId, milestoneId),
        eq(payments.payerUserId, payerUserId),
        eq(payments.status, 'pending'),
      ),
    )
    .limit(1);
  return (rows[0] as PaymentRow | undefined) ?? null;
}

/**
 * Insert a pending payment row. The partial unique index
 * uq_payments_pending_per_milestone serializes concurrent inserts on the
 * same (jobId, milestoneId, payerUserId) tuple; on conflict we refetch
 * and return the existing row.
 */
export async function insertPendingPayment(input: {
  id: string;
  jobId: string;
  milestoneId: string;
  payerUserId: string;
  payeeUserId: string;
  amountCents: number;
}): Promise<{ inserted: true } | { inserted: false; existing: PaymentRow }> {
  try {
    await db
      .insert(payments)
      .values({
        id: input.id,
        jobId: input.jobId,
        milestoneId: input.milestoneId,
        payerUserId: input.payerUserId,
        payeeUserId: input.payeeUserId,
        amountCents: input.amountCents,
        status: 'pending',
      })
      .returning();
    return { inserted: true };
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === '23505'
    ) {
      const existing = await getPendingPaymentForMilestone(
        input.jobId,
        input.milestoneId,
        input.payerUserId,
      );
      if (!existing) {
        throw new Error(
          'insertPendingPayment: unique violation but no existing pending row',
        );
      }
      return { inserted: false, existing };
    }
    throw err;
  }
}

export async function setPaymentIntentId(
  paymentRowId: string,
  paymentIntentId: string,
): Promise<void> {
  await db
    .update(payments)
    .set({ stripePaymentIntentId: paymentIntentId })
    .where(eq(payments.id, paymentRowId));
}

export async function deletePaymentRow(paymentRowId: string): Promise<void> {
  await db.delete(payments).where(eq(payments.id, paymentRowId));
}

/**
 * Sum of amount_cents for the job across statuses that count toward the cap:
 * pending + held + released. The cap-check uses this BEFORE inserting the
 * new pending row; the partial unique index then handles same-milestone races.
 */
export async function getCapturedTotalForJob(jobId: string): Promise<number> {
  const rows = await db
    .select({ total: sum(payments.amountCents) })
    .from(payments)
    .where(
      and(
        eq(payments.jobId, jobId),
        inArray(payments.status, ['pending', 'held', 'released']),
      ),
    );
  const total = rows[0]?.total;
  return total ? Number(total) : 0;
}

/**
 * Webhook-driven transition: status='held' on payments + status='funded'
 * + funded_at on job_milestones. Single transaction so the two writes
 * are atomic. (I-2 fix.)
 */
export async function markPaymentHeld(paymentRowId: string): Promise<void> {
  await db.transaction(async (tx) => {
    const [paymentRow] = await tx
      .select({ milestoneId: payments.milestoneId })
      .from(payments)
      .where(eq(payments.id, paymentRowId))
      .limit(1);

    await tx
      .update(payments)
      .set({ status: 'held', heldAt: new Date() })
      .where(eq(payments.id, paymentRowId));

    if (paymentRow?.milestoneId) {
      await tx
        .update(jobMilestones)
        .set({ status: 'funded', fundedAt: new Date() })
        .where(eq(jobMilestones.id, paymentRow.milestoneId));
    }
  });
}
