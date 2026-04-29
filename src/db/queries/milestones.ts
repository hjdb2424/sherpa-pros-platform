/**
 * Milestone Query Helpers
 *
 * Typed CRUD operations for the job_milestones table.
 */

import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { jobMilestones } from '../drizzle-schema';

export type MilestoneRow = typeof jobMilestones.$inferSelect;

/**
 * Get a milestone by its primary key.
 * @param id - Milestone UUID
 * @returns The milestone row or null if not found
 */
export async function getMilestone(id: string): Promise<MilestoneRow | null> {
  const rows = await db.select().from(jobMilestones).where(eq(jobMilestones.id, id)).limit(1);
  return rows[0] ?? null;
}
