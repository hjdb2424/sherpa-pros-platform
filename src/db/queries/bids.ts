/**
 * Bid Query Helpers
 *
 * Typed CRUD operations for the bids table.
 * API-facing functions include try/catch with mock data fallback.
 */

import { eq, desc } from "drizzle-orm";
import { db } from "../drizzle";
import { bids } from "../drizzle-schema";
import { query } from "../connection";
import type { Bid, BidStatus } from "../types";
import { mockMyBids } from "@/lib/mock-data/pro-data";

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

// ---------------------------------------------------------------------------
// API-facing functions with try/catch + mock fallback
// ---------------------------------------------------------------------------

export interface BidWithPro extends Bid {
  pro_display_name: string;
  pro_badge_tier: string | null;
  pro_rating_score: number | null;
}

export interface BidWithJob extends Bid {
  job_title: string;
  job_category: string | null;
  job_status: string;
}

/**
 * Get all bids on a specific job with pro details. Falls back to empty on error.
 */
export async function getBidsForJob(jobId: string): Promise<BidWithPro[]> {
  try {
    return await query<BidWithPro>(
      `SELECT b.*, p.display_name AS pro_display_name,
              p.badge_tier AS pro_badge_tier,
              p.rating_score AS pro_rating_score
         FROM bids b
         JOIN pros p ON p.id = b.pro_id
        WHERE b.job_id = $1
        ORDER BY b.created_at DESC`,
      [jobId],
    );
  } catch (error) {
    console.error("[db/queries/bids] getBidsForJob failed, returning empty:", error);
    return [];
  }
}

/**
 * Get all bids submitted by a pro with job details. Falls back to mock.
 */
export async function getBidsByPro(proId: string): Promise<BidWithJob[]> {
  try {
    return await query<BidWithJob>(
      `SELECT b.*, j.title AS job_title, j.category AS job_category, j.status AS job_status
         FROM bids b
         JOIN jobs j ON j.id = b.job_id
        WHERE b.pro_id = $1
        ORDER BY b.created_at DESC`,
      [proId],
    );
  } catch (error) {
    console.error("[db/queries/bids] getBidsByPro failed, returning mock:", error);
    return mockMyBids.map((b) => ({
      id: b.id,
      job_id: b.jobId,
      pro_id: proId,
      amount_cents: b.amount * 100,
      message: b.message,
      estimated_duration_days: parseInt(b.estimatedDuration) || null,
      wiseman_deviation_pct: null,
      status: b.status as BidStatus,
      created_at: new Date(b.submittedAt),
      updated_at: new Date(b.submittedAt),
      job_title: b.jobTitle,
      job_category: null,
      job_status: "open",
    })) as unknown as BidWithJob[];
  }
}

/**
 * Create a new bid on a job. Falls back to mock response on error.
 */
export async function createBidPosting(data: {
  jobId: string;
  proId: string;
  amountCents: number;
  message?: string;
  estimatedDurationDays?: number;
}): Promise<Bid> {
  try {
    const rows = await query<Bid>(
      `INSERT INTO bids (job_id, pro_id, amount_cents, message, estimated_duration_days, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [
        data.jobId,
        data.proId,
        data.amountCents,
        data.message ?? null,
        data.estimatedDurationDays ?? null,
      ],
    );
    return rows[0];
  } catch (error) {
    console.error("[db/queries/bids] createBidPosting failed, returning mock:", error);
    return {
      id: `mock-bid-${Date.now()}`,
      job_id: data.jobId,
      pro_id: data.proId,
      amount_cents: data.amountCents,
      message: data.message ?? null,
      estimated_duration_days: data.estimatedDurationDays ?? null,
      wiseman_deviation_pct: null,
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    } as Bid;
  }
}
