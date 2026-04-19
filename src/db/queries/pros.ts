/**
 * Pro Profile Query Helpers
 *
 * Typed CRUD operations for the pros table and related sub-tables.
 * Spatial queries (findByTradeAndRadius) use raw SQL for PostGIS support.
 * API-facing functions include try/catch with mock data fallback.
 */

import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { pros, hubPros, proTrades } from "../drizzle-schema";
import { query } from "../connection";
import type { Pro, ProTrade, ProCertification, ProPortfolio } from "../types";
import { MOCK_PROS } from "@/lib/mock-data/client-data";

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

// ---------------------------------------------------------------------------
// API-facing functions with try/catch + mock fallback
// ---------------------------------------------------------------------------

export interface ProFilters {
  status?: string;
  badgeTier?: string;
  tradeCategory?: string;
  hubId?: string;
  limit?: number;
  offset?: number;
}

export interface ProWithDetails extends Pro {
  trades: ProTrade[];
  certifications: ProCertification[];
  portfolio: ProPortfolio[];
}

function mockProRow(p: (typeof MOCK_PROS)[0]): Pro {
  return {
    id: p.id,
    user_id: `user-${p.id}`,
    display_name: p.name,
    bio: null,
    home_hub_id: null,
    travel_radius_km: 50,
    onboarding_status: "active",
    license_number: null,
    license_state: null,
    insurance_provider: null,
    insurance_expiry: null,
    insurance_verified: false,
    background_check_status: p.backgroundChecked ? "passed" : "none",
    background_check_date: null,
    rating_score: Math.round(p.rating * 100),
    visibility_score: 0,
    badge_tier: p.badge === "new" ? "bronze" : p.badge,
    joined_at: new Date(),
    location: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as Pro;
}

/**
 * List active pros with optional filters. Falls back to mock on error.
 */
export async function getPros(filters?: ProFilters): Promise<Pro[]> {
  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    const status = filters?.status ?? "active";
    conditions.push(`p.onboarding_status = $${idx++}`);
    params.push(status);

    if (filters?.badgeTier) {
      conditions.push(`p.badge_tier = $${idx++}`);
      params.push(filters.badgeTier);
    }
    if (filters?.hubId) {
      conditions.push(`p.home_hub_id = $${idx++}`);
      params.push(filters.hubId);
    }

    const where = `WHERE ${conditions.join(" AND ")}`;
    const limit = filters?.limit ?? 50;
    const offset = filters?.offset ?? 0;

    if (filters?.tradeCategory) {
      return await query<Pro>(
        `SELECT DISTINCT p.*
           FROM pros p
           JOIN pro_trades pt ON pt.pro_id = p.id
          ${where} AND pt.trade_category = $${idx++}
          ORDER BY p.rating_score DESC NULLS LAST
          LIMIT $${idx++} OFFSET $${idx}`,
        [...params, filters.tradeCategory, limit, offset],
      );
    }

    return await query<Pro>(
      `SELECT p.*
         FROM pros p
         ${where}
         ORDER BY p.rating_score DESC NULLS LAST
         LIMIT $${idx++} OFFSET $${idx}`,
      [...params, limit, offset],
    );
  } catch (error) {
    console.error("[db/queries/pros] getPros failed, returning mock:", error);
    return MOCK_PROS.map(mockProRow);
  }
}

/**
 * Get a single pro by ID with trades, certs, and portfolio. Falls back to mock.
 */
export async function getProByIdWithDetails(
  id: string,
): Promise<ProWithDetails | null> {
  try {
    const proRows = await query<Pro>("SELECT * FROM pros WHERE id = $1", [id]);
    if (proRows.length === 0) return null;

    const [tradeRows, certRows, portfolioRows] = await Promise.all([
      query<ProTrade>(
        `SELECT * FROM pro_trades WHERE pro_id = $1 ORDER BY is_primary DESC, experience_years DESC`,
        [id],
      ),
      query<ProCertification>(
        `SELECT * FROM pro_certifications WHERE pro_id = $1 ORDER BY verified DESC, issued_date DESC`,
        [id],
      ),
      query<ProPortfolio>(
        `SELECT * FROM pro_portfolio WHERE pro_id = $1 ORDER BY sort_order ASC`,
        [id],
      ),
    ]);

    return {
      ...proRows[0],
      trades: tradeRows,
      certifications: certRows,
      portfolio: portfolioRows,
    };
  } catch (error) {
    console.error("[db/queries/pros] getProByIdWithDetails failed, returning mock:", error);
    const mock = MOCK_PROS.find((p) => p.id === id);
    if (!mock) return null;
    return {
      ...mockProRow(mock),
      trades: mock.trades.map((t, i) => ({
        id: `trade-${i}`,
        pro_id: mock.id,
        trade_category: t,
        specialty: null,
        experience_years: 0,
        is_primary: i === 0,
        created_at: new Date(),
      })) as ProTrade[],
      certifications: [],
      portfolio: [],
    };
  }
}

/**
 * Get pros belonging to a specific hub. Falls back to mock.
 */
export async function getProsByHubId(hubId: string): Promise<Pro[]> {
  try {
    return await query<Pro>(
      `SELECT p.*
         FROM pros p
         JOIN hub_pros hp ON hp.pro_id = p.id
        WHERE hp.hub_id = $1
          AND p.onboarding_status = 'active'
        ORDER BY p.rating_score DESC NULLS LAST`,
      [hubId],
    );
  } catch (error) {
    console.error("[db/queries/pros] getProsByHubId failed, returning mock:", error);
    return MOCK_PROS.map(mockProRow);
  }
}

/**
 * Text search on display_name and trade_category. Falls back to mock.
 */
export async function searchPros(
  searchQuery: string,
  hubId?: string,
): Promise<Pro[]> {
  try {
    const pattern = `%${searchQuery}%`;

    if (hubId) {
      return await query<Pro>(
        `SELECT DISTINCT p.*
           FROM pros p
           LEFT JOIN pro_trades pt ON pt.pro_id = p.id
           JOIN hub_pros hp ON hp.pro_id = p.id
          WHERE hp.hub_id = $1
            AND p.onboarding_status = 'active'
            AND (p.display_name ILIKE $2 OR pt.trade_category ILIKE $2)
          ORDER BY p.rating_score DESC NULLS LAST
          LIMIT 50`,
        [hubId, pattern],
      );
    }

    return await query<Pro>(
      `SELECT DISTINCT p.*
         FROM pros p
         LEFT JOIN pro_trades pt ON pt.pro_id = p.id
        WHERE p.onboarding_status = 'active'
          AND (p.display_name ILIKE $1 OR pt.trade_category ILIKE $1)
        ORDER BY p.rating_score DESC NULLS LAST
        LIMIT 50`,
      [pattern],
    );
  } catch (error) {
    console.error("[db/queries/pros] searchPros failed, returning mock:", error);
    const lower = searchQuery.toLowerCase();
    return MOCK_PROS.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.trades.some((t) => t.toLowerCase().includes(lower)),
    ).map(mockProRow);
  }
}
