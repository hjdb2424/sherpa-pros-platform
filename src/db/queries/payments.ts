/**
 * Payment Query Helpers
 *
 * Typed CRUD operations for the payments table including escrow balance calculation.
 */

import { eq, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { payments } from "../drizzle-schema";
import type { Payment, PaymentStatus } from "../types";

/**
 * Create a new payment record.
 * @param data - Payment creation fields matching the Drizzle schema
 * @returns The newly created payment row
 */
export async function create(
  data: typeof payments.$inferInsert,
): Promise<Payment> {
  const rows = await db.insert(payments).values(data).returning();
  return rows[0] as unknown as Payment;
}

/**
 * Find all payments for a specific job.
 * @param jobId - Job UUID
 * @returns Array of payment rows for the job
 */
export async function findByJob(jobId: string): Promise<Payment[]> {
  const rows = await db
    .select()
    .from(payments)
    .where(eq(payments.jobId, jobId));
  return rows as unknown as Payment[];
}

/**
 * Update a payment's status and set relevant timestamps.
 * @param id - Payment UUID
 * @param status - New payment status
 * @returns The updated payment row or undefined if not found
 */
export async function updateStatus(
  id: string,
  status: PaymentStatus,
): Promise<Payment | undefined> {
  const now = new Date();
  const timestampUpdates: Record<string, Date> = {};
  if (status === "held") timestampUpdates.heldAt = now;
  if (status === "released") timestampUpdates.releasedAt = now;

  const rows = await db
    .update(payments)
    .set({ status, ...timestampUpdates })
    .where(eq(payments.id, id))
    .returning();
  return rows[0] as unknown as Payment | undefined;
}

/**
 * Calculate the total escrow balance for a job (sum of held payments minus released).
 * @param jobId - Job UUID
 * @returns Escrow balance in cents
 */
export async function calculateEscrowBalance(jobId: string): Promise<number> {
  const result = await db
    .select({
      balance: sql<number>`
        COALESCE(
          SUM(CASE WHEN ${payments.status} = 'held' THEN ${payments.amountCents} ELSE 0 END) -
          SUM(CASE WHEN ${payments.status} = 'released' THEN ${payments.amountCents} ELSE 0 END),
          0
        )
      `,
    })
    .from(payments)
    .where(eq(payments.jobId, jobId));
  return result[0]?.balance ?? 0;
}
