/**
 * Database Performance Configuration
 *
 * Connection pool settings optimized for Neon serverless on Vercel,
 * pagination defaults, and caching TTLs for hot query paths.
 */

// ---------------------------------------------------------------------------
// Connection Pool — Neon Serverless
// ---------------------------------------------------------------------------

export const DB_POOL_CONFIG = {
  /** Maximum connections in the pool (Neon free tier: 20 max) */
  max: 10,

  /** Idle connection timeout in seconds — release unused connections */
  idleTimeoutMillis: 30_000,

  /** Connection acquisition timeout in seconds */
  connectionTimeoutMillis: 10_000,

  /**
   * Keep-alive interval (ms) — prevents Neon from closing idle sockets.
   * Neon serverless driver handles this internally, but set as fallback.
   */
  keepAliveIntervalMillis: 60_000,

  /**
   * Statement timeout (ms) — kill queries running longer than 30s.
   * Prevents runaway queries from holding connections.
   */
  statementTimeoutMillis: 30_000,
} as const;

// ---------------------------------------------------------------------------
// Pagination Defaults
// ---------------------------------------------------------------------------

export const PAGINATION = {
  /** Default page size for list endpoints */
  defaultLimit: 25,

  /** Maximum allowed page size (prevents abuse) */
  maxLimit: 100,

  /** Default page number */
  defaultPage: 1,
} as const;

/**
 * Parse pagination params from URLSearchParams with safe defaults.
 * Returns 0-indexed offset for SQL LIMIT/OFFSET.
 */
export function parsePagination(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  offset: number;
} {
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const rawLimit = parseInt(
    searchParams.get("limit") || String(PAGINATION.defaultLimit),
    10,
  );

  const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
  const limit = Math.min(
    PAGINATION.maxLimit,
    Math.max(1, isNaN(rawLimit) ? PAGINATION.defaultLimit : rawLimit),
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Build a standard pagination response envelope.
 */
export function paginationMeta(
  page: number,
  limit: number,
  total: number,
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

// ---------------------------------------------------------------------------
// Cache TTLs (seconds) — for future Upstash Redis integration
// ---------------------------------------------------------------------------

export const CACHE_TTL = {
  /** Dashboard aggregate stats (counts, sums) — refresh every minute */
  dashboardStats: 60,

  /** Pro profile detail — refresh every 5 minutes */
  proProfile: 300,

  /** Hub/service area data — refresh hourly */
  serviceArea: 3_600,

  /** Trade categories / service catalog — refresh daily */
  serviceCatalog: 86_400,

  /** Tax year summary — refresh every 10 minutes */
  taxSummary: 600,

  /** Compliance status — refresh every 15 minutes */
  complianceStatus: 900,

  /** Leaderboard / pro rankings — refresh every 5 minutes */
  leaderboard: 300,
} as const;

// ---------------------------------------------------------------------------
// Query Pattern Hints — document the most common hot paths
// ---------------------------------------------------------------------------

export const QUERY_PATTERNS = {
  /**
   * Spatial: Find pros within radius of a point.
   * Uses GiST index on pros.location via ST_DWithin.
   * Expected: <50ms for radius queries within a hub.
   */
  prosByLocation: `
    SELECT p.* FROM pros p
    INNER JOIN pro_trades pt ON pt.pro_id = p.id
    WHERE pt.trade_category = $1
      AND p.onboarding_status = 'active'
      AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, $4)
    ORDER BY p.visibility_score DESC, p.rating_score DESC
    LIMIT $5
  `,

  /**
   * Jobs marketplace: Recent open jobs by status.
   * Uses composite index idx_jobs_status_created.
   * Expected: <20ms for the first page.
   */
  jobsByStatus: `
    SELECT * FROM jobs
    WHERE status = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `,

  /**
   * Dashboard: Aggregate job stats per status.
   * Lightweight COUNT query, no heavy JOINs.
   * Candidate for 60s cache.
   */
  dashboardStats: `
    SELECT status, COUNT(*) as count
    FROM jobs
    WHERE client_user_id = $1
    GROUP BY status
  `,

  /**
   * PM triage: Work orders by priority.
   * Uses composite index idx_work_orders_priority_status.
   * Expected: <30ms for a single property.
   */
  workOrderTriage: `
    SELECT * FROM work_orders
    WHERE property_id = $1
    ORDER BY
      CASE priority WHEN 'emergency' THEN 0 WHEN 'urgent' THEN 1 ELSE 2 END,
      created_at DESC
    LIMIT $2 OFFSET $3
  `,

  /**
   * Tax: Expense summary by category for a year.
   * Uses composite index idx_tax_expenses_user_year_category.
   * Expected: <20ms.
   */
  expenseSummary: `
    SELECT category, COUNT(*) as count, SUM(amount_cents) as total_cents
    FROM tax_expenses
    WHERE user_id = $1 AND tax_year = $2
    GROUP BY category
  `,
} as const;
