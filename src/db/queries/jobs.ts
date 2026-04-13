/**
 * Job Query Helpers
 *
 * Typed CRUD operations for the jobs table.
 * Spatial queries use raw SQL for PostGIS support.
 */

import { eq, desc } from "drizzle-orm";
import { db } from "../drizzle";
import { jobs } from "../drizzle-schema";
import { query } from "../connection";
import type { Job, JobStatus } from "../types";

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
