/**
 * Bid Query Helpers
 *
 * Typed CRUD operations for the bids table.
 */

import { eq, desc } from "drizzle-orm";
import { db } from "../drizzle";
import { bids } from "../drizzle-schema";
import type { Bid, BidStatus } from "../types";

/**
 * Create a new bid on a job.
 * @param data - Bid creation fields matching the Drizzle schema
 * @returns The newly created bid row
 */
export async function create(data: typeof bids.$inferInsert): Promise<Bid> {
  const rows = await db.insert(bids).values(data).returning();
  return rows[0] as unknown as Bid;
}

/**
 * Find all bids for a specific job, ordered by most recent first.
 * @param jobId - Job UUID
 * @returns Array of bid rows for the job
 */
export async function findByJob(jobId: string): Promise<Bid[]> {
  const rows = await db
    .select()
    .from(bids)
    .where(eq(bids.jobId, jobId))
    .orderBy(desc(bids.createdAt));
  return rows as unknown as Bid[];
}

/**
 * Find all bids submitted by a specific pro, ordered by most recent first.
 * @param proId - Pro UUID
 * @returns Array of bid rows by the pro
 */
export async function findByPro(proId: string): Promise<Bid[]> {
  const rows = await db
    .select()
    .from(bids)
    .where(eq(bids.proId, proId))
    .orderBy(desc(bids.createdAt));
  return rows as unknown as Bid[];
}

/**
 * Update a bid's status (accept, reject, withdraw).
 * @param id - Bid UUID
 * @param status - New bid status
 * @returns The updated bid row or undefined if not found
 */
export async function updateStatus(
  id: string,
  status: BidStatus,
): Promise<Bid | undefined> {
  const rows = await db
    .update(bids)
    .set({ status })
    .where(eq(bids.id, id))
    .returning();
  return rows[0] as unknown as Bid | undefined;
}
