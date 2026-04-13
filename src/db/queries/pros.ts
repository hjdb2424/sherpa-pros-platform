/**
 * Pro Profile Query Helpers
 *
 * Typed CRUD operations for the pros table and related sub-tables.
 * Spatial queries (findByTradeAndRadius) use raw SQL for PostGIS support.
 */

import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { pros, hubPros, proTrades } from "../drizzle-schema";
import { query } from "../connection";
import type { Pro } from "../types";

/**
 * Find a pro by their primary key.
 * @param id - Pro UUID
 * @returns The pro row or undefined if not found
 */
export async function findById(id: string): Promise<Pro | undefined> {
  const rows = await db.select().from(pros).where(eq(pros.id, id)).limit(1);
  return rows[0] as unknown as Pro | undefined;
}

/**
 * Find all pros belonging to a specific hub.
 * @param hubId - Hub UUID
 * @returns Array of pro rows linked to the hub
 */
export async function findByHub(hubId: string): Promise<Pro[]> {
  const rows = await db
    .select({ pro: pros })
    .from(hubPros)
    .innerJoin(pros, eq(hubPros.proId, pros.id))
    .where(eq(hubPros.hubId, hubId));
  return rows.map((r) => r.pro) as unknown as Pro[];
}

/**
 * Find pros by trade category within a radius of a geographic point.
 * Uses PostGIS ST_DWithin for spatial filtering.
 *
 * @param tradeCategory - Trade category to filter by (e.g. "plumbing")
 * @param lng - Longitude of the search center
 * @param lat - Latitude of the search center
 * @param radiusKm - Search radius in kilometers
 * @returns Array of pros matching the trade and radius criteria
 */
export async function findByTradeAndRadius(
  tradeCategory: string,
  lng: number,
  lat: number,
  radiusKm: number,
): Promise<Pro[]> {
  const radiusMeters = radiusKm * 1000;
  return query<Pro>(
    `SELECT p.*
     FROM pros p
     INNER JOIN pro_trades pt ON pt.pro_id = p.id
     WHERE pt.trade_category = $1
       AND p.onboarding_status = 'active'
       AND p.location IS NOT NULL
       AND ST_DWithin(
         p.location,
         ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography,
         $4
       )
     ORDER BY p.visibility_score DESC, p.rating_score DESC`,
    [tradeCategory, lng, lat, radiusMeters],
  );
}

/**
 * Update a pro's profile fields.
 * @param id - Pro UUID
 * @param data - Partial pro fields to update
 * @returns The updated pro row or undefined if not found
 */
export async function updateProfile(
  id: string,
  data: Partial<{
    displayName: string;
    bio: string | null;
    homeHubId: string | null;
    travelRadiusKm: string;
    onboardingStatus: string;
    licenseNumber: string | null;
    licenseState: string | null;
    insuranceProvider: string | null;
    insuranceExpiry: string | null;
    badgeTier: string;
  }>,
): Promise<Pro | undefined> {
  const rows = await db
    .update(pros)
    .set(data)
    .where(eq(pros.id, id))
    .returning();
  return rows[0] as unknown as Pro | undefined;
}

/**
 * Update a pro's visibility score (used by the dispatch algorithm).
 * @param id - Pro UUID
 * @param score - New visibility score (integer)
 * @returns The updated pro row or undefined if not found
 */
export async function updateVisibilityScore(
  id: string,
  score: number,
): Promise<Pro | undefined> {
  const rows = await db
    .update(pros)
    .set({ visibilityScore: score })
    .where(eq(pros.id, id))
    .returning();
  return rows[0] as unknown as Pro | undefined;
}
