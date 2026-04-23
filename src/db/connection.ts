/**
 * Neon Serverless Database Connection
 *
 * Uses @neondatabase/serverless Pool for connection pooling optimized
 * for serverless environments (Vercel Functions). Each invocation reuses
 * the pool within the same warm instance and releases cleanly on cold starts.
 *
 * All initialization is lazy — importing this module will NOT crash when
 * DATABASE_URL is absent. The error surfaces only when a query runs.
 */

import { Pool, neon } from "@neondatabase/serverless";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Add it to .env.local or your Vercel project settings.",
    );
  }
  return url;
}

/**
 * Connection pool for transactional / multi-statement use.
 * Re-used across warm serverless invocations.
 */
let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: getDatabaseUrl() });
  }
  return _pool;
}

/**
 * One-shot SQL tagged-template function powered by Neon's HTTP driver.
 * Ideal for simple queries that don't need a persistent connection.
 * Lazily initialized to avoid crashing when DATABASE_URL is not set.
 *
 * @example
 * const rows = await getSql()`SELECT * FROM users WHERE id = ${userId}`;
 */
let _sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (!_sql) {
    _sql = neon(getDatabaseUrl());
  }
  return _sql;
}

/**
 * Execute a parameterized query against the pool and return typed rows.
 *
 * @param text  - SQL query string with $1, $2, ... placeholders
 * @param params - Parameter values bound to placeholders
 * @returns Typed array of result rows
 *
 * @example
 * const users = await query<User>('SELECT * FROM users WHERE role = $1', ['pro']);
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result.rows as T[];
}
