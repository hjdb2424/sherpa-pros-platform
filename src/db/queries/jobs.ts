/**
 * Job Query Helpers
 *
 * Typed CRUD operations for the jobs table.
 * Spatial queries use raw SQL for PostGIS support.
 * API-facing functions include try/catch with mock data fallback.
 */

import { eq, desc } from "drizzle-orm";
import { db } from "../drizzle";
import { jobs } from "../drizzle-schema";
import { query } from "../connection";
import type { Job, JobStatus } from "../types";
import {
  mockAvailableJobs,
  mockActiveJobs,
  mockCompletedJobs,
} from "@/lib/mock-data/pro-data";

/**
 * Create a new job.
 * @param data - Job creation fields matching the Drizzle schema
 * @returns The newly created job row
 */
export async function create(data: typeof jobs.$inferInsert): Promise<Job> {
  const rows = await db.insert(jobs).values(data).returning();
  return rows[0] as unknown as Job;
}

/**
 * Find a job by its primary key.
 * @param id - Job UUID
 * @returns The job row or undefined if not found
 */
export async function findById(id: string): Promise<Job | undefined> {
  const rows = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return rows[0] as unknown as Job | undefined;
}

/**
 * Get a job by its primary key. Returns null (not undefined) for capture-flow compatibility.
 * @param id - Job UUID
 * @returns The job row or null if not found
 */
export async function getJob(id: string): Promise<Job | null> {
  const rows = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return (rows[0] as unknown as Job | undefined) ?? null;
}

/**
 * Find all jobs matching a given status, ordered by most recent first.
 * @param status - Job status to filter by
 * @param limit - Maximum number of results (default 50)
 * @returns Array of matching job rows
 */
export async function findByStatus(
  status: JobStatus,
  limit = 50,
): Promise<Job[]> {
  const rows = await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, status))
    .orderBy(desc(jobs.createdAt))
    .limit(limit);
  return rows as unknown as Job[];
}

/**
 * Find all jobs within a specific hub, ordered by most recent first.
 * @param hubId - Hub UUID
 * @param limit - Maximum number of results (default 50)
 * @returns Array of job rows belonging to the hub
 */
export async function findByHub(hubId: string, limit = 50): Promise<Job[]> {
  const rows = await db
    .select()
    .from(jobs)
    .where(eq(jobs.hubId, hubId))
    .orderBy(desc(jobs.createdAt))
    .limit(limit);
  return rows as unknown as Job[];
}

/**
 * Find jobs near a geographic location using PostGIS ST_DWithin.
 *
 * @param lng - Longitude of the search center
 * @param lat - Latitude of the search center
 * @param radiusKm - Search radius in kilometers
 * @param limit - Maximum number of results (default 50)
 * @returns Array of jobs within the specified radius, ordered by distance
 */
export async function findNearLocation(
  lng: number,
  lat: number,
  radiusKm: number,
  limit = 50,
): Promise<Job[]> {
  const radiusMeters = radiusKm * 1000;
  return query<Job>(
    `SELECT j.*
     FROM jobs j
     WHERE j.location IS NOT NULL
       AND j.status IN ('posted', 'accepting_bids', 'dispatching')
       AND ST_DWithin(
         j.location,
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         $3
       )
     ORDER BY ST_Distance(
       j.location,
       ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
     ) ASC
     LIMIT $4`,
    [lng, lat, radiusMeters, limit],
  );
}

/**
 * Update a job's status.
 * @param id - Job UUID
 * @param status - New status value
 * @returns The updated job row or undefined if not found
 */
export async function updateStatus(
  id: string,
  status: JobStatus,
): Promise<Job | undefined> {
  const rows = await db
    .update(jobs)
    .set({ status })
    .where(eq(jobs.id, id))
    .returning();
  return rows[0] as unknown as Job | undefined;
}

// ---------------------------------------------------------------------------
// API-facing functions with try/catch + mock fallback
// ---------------------------------------------------------------------------

export interface JobFilters {
  status?: string;
  category?: string;
  hubId?: string;
  urgency?: string;
  limit?: number;
  offset?: number;
}

export interface JobWithBidsAndMilestones extends Job {
  bids: Array<{
    id: string;
    job_id: string;
    pro_id: string;
    amount_cents: number;
    message: string | null;
    estimated_duration_days: number | null;
    status: string;
    created_at: string;
    pro_display_name: string;
    pro_badge_tier: string | null;
    pro_rating_score: number | null;
  }>;
  milestones: Array<{
    id: string;
    job_id: string;
    title: string;
    description: string | null;
    amount_cents: number;
    sort_order: number;
    status: string;
    funded_at: string | null;
    completed_at: string | null;
    released_at: string | null;
  }>;
}

function allMockJobs() {
  return [...mockAvailableJobs, ...mockActiveJobs, ...mockCompletedJobs];
}

function toJobRow(j: (typeof mockAvailableJobs)[0]) {
  return {
    id: j.id,
    client_user_id: "mock-client",
    title: j.title,
    description: j.description,
    category: j.category,
    urgency: j.urgency as Job["urgency"],
    budget_min_cents: j.budgetMin * 100,
    budget_max_cents: j.budgetMax * 100,
    location: null,
    address: j.address,
    hub_id: null,
    status: j.status as Job["status"],
    dispatch_type: j.type as Job["dispatch_type"],
    permit_required: j.permitsRequired.length > 0,
    permit_details: {},
    wiseman_validation: {},
    parent_job_id: null,
    sequence_order: 0,
    trade_required: null,
    created_at: new Date(j.postedAt),
    updated_at: new Date(j.postedAt),
  };
}

/**
 * List jobs with optional filters. Falls back to mock data on error.
 */
export async function getJobs(filters?: JobFilters): Promise<Job[]> {
  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (filters?.status) {
      conditions.push(`status = $${idx++}`);
      params.push(filters.status);
    }
    if (filters?.category) {
      conditions.push(`category = $${idx++}`);
      params.push(filters.category);
    }
    if (filters?.hubId) {
      conditions.push(`hub_id = $${idx++}`);
      params.push(filters.hubId);
    }
    if (filters?.urgency) {
      conditions.push(`urgency = $${idx++}`);
      params.push(filters.urgency);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters?.limit ?? 50;
    const offset = filters?.offset ?? 0;

    return await query<Job>(
      `SELECT * FROM jobs ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
      [...params, limit, offset],
    );
  } catch (error) {
    console.error("[db/queries/jobs] getJobs failed, returning mock:", error);
    let mocks = allMockJobs();
    if (filters?.status) mocks = mocks.filter((j) => j.status === filters.status);
    if (filters?.category) mocks = mocks.filter((j) => j.category === filters.category);
    return mocks.map(toJobRow) as unknown as Job[];
  }
}

/**
 * Get a single job by ID with its bids and milestones. Falls back to mock.
 */
export async function getJobByIdWithDetails(
  id: string,
): Promise<JobWithBidsAndMilestones | null> {
  try {
    const jobRows = await query<Job>("SELECT * FROM jobs WHERE id = $1", [id]);
    if (jobRows.length === 0) return null;

    const [bidRows, milestoneRows] = await Promise.all([
      query<JobWithBidsAndMilestones["bids"][0]>(
        `SELECT b.id, b.job_id, b.pro_id, b.amount_cents, b.message,
                b.estimated_duration_days, b.status, b.created_at,
                p.display_name AS pro_display_name,
                p.badge_tier AS pro_badge_tier,
                p.rating_score AS pro_rating_score
           FROM bids b
           JOIN pros p ON p.id = b.pro_id
          WHERE b.job_id = $1
          ORDER BY b.created_at DESC`,
        [id],
      ),
      query<JobWithBidsAndMilestones["milestones"][0]>(
        `SELECT id, job_id, title, description, amount_cents, sort_order,
                status, funded_at, completed_at, released_at
           FROM job_milestones
          WHERE job_id = $1
          ORDER BY sort_order ASC`,
        [id],
      ),
    ]);

    return {
      ...jobRows[0],
      bids: bidRows,
      milestones: milestoneRows,
    };
  } catch (error) {
    console.error("[db/queries/jobs] getJobByIdWithDetails failed, returning mock:", error);
    const mock = allMockJobs().find((j) => j.id === id);
    if (!mock) return null;
    return {
      ...toJobRow(mock),
      bids: [],
      milestones: mock.milestones.map((m, i) => ({
        id: m.id,
        job_id: mock.id,
        title: m.title,
        description: null,
        amount_cents: 0,
        sort_order: i,
        status: m.status,
        funded_at: null,
        completed_at: m.completedDate ?? null,
        released_at: null,
      })),
    } as unknown as JobWithBidsAndMilestones;
  }
}

/**
 * Get all jobs posted by a specific client. Falls back to mock.
 */
export async function getClientJobs(userId: string): Promise<Job[]> {
  try {
    return await query<Job>(
      `SELECT * FROM jobs WHERE client_user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
  } catch (error) {
    console.error("[db/queries/jobs] getClientJobs failed, returning mock:", error);
    return allMockJobs().map(toJobRow) as unknown as Job[];
  }
}

/**
 * Create a new job posting. Falls back to mock response on error.
 */
export async function createJobPosting(data: {
  clientUserId: string;
  title: string;
  description?: string;
  category?: string;
  urgency?: string;
  budgetMinCents?: number;
  budgetMaxCents?: number;
  address?: string;
  hubId?: string;
  dispatchType?: string;
  permitRequired?: boolean;
}): Promise<Job> {
  try {
    const rows = await query<Job>(
      `INSERT INTO jobs (
         client_user_id, title, description, category, urgency,
         budget_min_cents, budget_max_cents, address, hub_id,
         dispatch_type, permit_required, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'draft')
       RETURNING *`,
      [
        data.clientUserId,
        data.title,
        data.description ?? null,
        data.category ?? null,
        data.urgency ?? "standard",
        data.budgetMinCents ?? null,
        data.budgetMaxCents ?? null,
        data.address ?? null,
        data.hubId ?? null,
        data.dispatchType ?? "bid",
        data.permitRequired ?? false,
      ],
    );
    return rows[0];
  } catch (error) {
    console.error("[db/queries/jobs] createJobPosting failed, returning mock:", error);
    return {
      id: `mock-${Date.now()}`,
      client_user_id: data.clientUserId,
      title: data.title,
      description: data.description ?? null,
      category: data.category ?? null,
      urgency: (data.urgency ?? "standard") as Job["urgency"],
      budget_min_cents: data.budgetMinCents ?? null,
      budget_max_cents: data.budgetMaxCents ?? null,
      location: null,
      address: data.address ?? null,
      hub_id: data.hubId ?? null,
      status: "draft" as Job["status"],
      dispatch_type: (data.dispatchType ?? "bid") as Job["dispatch_type"],
      permit_required: data.permitRequired ?? false,
      permit_details: {},
      wiseman_validation: {},
      parent_job_id: null,
      sequence_order: 0,
      trade_required: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}
