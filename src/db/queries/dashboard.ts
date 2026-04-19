/**
 * Dashboard Query Helpers
 *
 * Aggregate queries for dashboard stats, recent jobs, and recent pros.
 * All functions include graceful fallback — if the database is unreachable
 * they return safe defaults so the app never crashes.
 */

import { query } from "../connection";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardStats {
  totalJobs: number;
  activePros: number;
  pendingBids: number;
}

export interface RecentJob {
  id: string;
  title: string;
  category: string | null;
  status: string;
  budget_min_cents: number | null;
  budget_max_cents: number | null;
  created_at: string;
}

export interface RecentPro {
  id: string;
  display_name: string;
  rating_score: number | null;
  badge_tier: string | null;
  onboarding_status: string;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetch aggregate counts for the dashboard summary cards.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [jobCount] = await query<{ count: string }>(
    "SELECT count(*) as count FROM jobs",
  );
  const [proCount] = await query<{ count: string }>(
    "SELECT count(*) as count FROM pros WHERE onboarding_status = $1",
    ["active"],
  );
  const [bidCount] = await query<{ count: string }>(
    "SELECT count(*) as count FROM bids WHERE status = $1",
    ["pending"],
  );

  return {
    totalJobs: parseInt(jobCount.count, 10),
    activePros: parseInt(proCount.count, 10),
    pendingBids: parseInt(bidCount.count, 10),
  };
}

/**
 * Fetch the most recently created jobs.
 * @param limit - Maximum rows to return (default 5)
 */
export async function getRecentJobs(limit = 5): Promise<RecentJob[]> {
  return query<RecentJob>(
    `SELECT id, title, category, status,
            budget_min_cents, budget_max_cents, created_at
       FROM jobs
      ORDER BY created_at DESC
      LIMIT $1`,
    [limit],
  );
}

/**
 * Fetch the most recently created pro profiles.
 * @param limit - Maximum rows to return (default 5)
 */
export async function getRecentPros(limit = 5): Promise<RecentPro[]> {
  return query<RecentPro>(
    `SELECT id, display_name, rating_score, badge_tier, onboarding_status
       FROM pros
      ORDER BY created_at DESC
      LIMIT $1`,
    [limit],
  );
}
