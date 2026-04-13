/**
 * Rating Query Helpers
 *
 * Typed CRUD operations for the ratings table including aggregate calculations.
 */

import { eq, sql, desc } from "drizzle-orm";
import { db } from "../drizzle";
import { ratings } from "../drizzle-schema";
import type { Rating } from "../types";

/**
 * Create a new rating for a completed job.
 * @param data - Rating creation fields matching the Drizzle schema
 * @returns The newly created rating row
 */
export async function create(
  data: typeof ratings.$inferInsert,
): Promise<Rating> {
  const rows = await db.insert(ratings).values(data).returning();
  return rows[0] as unknown as Rating;
}

/**
 * Find all ratings received by a specific user (pro), ordered by most recent first.
 * @param toUserId - The user UUID who received the ratings
 * @returns Array of rating rows for the user
 */
export async function findByPro(toUserId: string): Promise<Rating[]> {
  const rows = await db
    .select()
    .from(ratings)
    .where(eq(ratings.toUserId, toUserId))
    .orderBy(desc(ratings.createdAt));
  return rows as unknown as Rating[];
}

/**
 * Calculate the average overall rating score for a user.
 * @param toUserId - The user UUID to calculate the average for
 * @returns Average rating (1.0-5.0) or null if no ratings exist
 */
export async function calculateAverageRating(
  toUserId: string,
): Promise<number | null> {
  const result = await db
    .select({
      avg: sql<number | null>`AVG(${ratings.overallScore})::numeric(3,2)`,
    })
    .from(ratings)
    .where(eq(ratings.toUserId, toUserId));
  return result[0]?.avg ?? null;
}
