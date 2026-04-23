/**
 * Drizzle ORM Instance
 *
 * Configured with the Neon serverless driver for use in Vercel Functions.
 * Import `db` anywhere you need typed, composable queries.
 *
 * Lazily initialized — importing this module does NOT crash when
 * DATABASE_URL is absent. The error surfaces only when a query runs.
 */

import { drizzle } from "drizzle-orm/neon-serverless";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import { getPool } from "./connection";
import * as schema from "./drizzle-schema";

/**
 * Drizzle database instance with full schema awareness.
 * Supports relational queries, type-safe inserts, updates, and deletes.
 *
 * @example
 * import { db } from '@/db/drizzle';
 * import { users } from '@/db/drizzle-schema';
 * const allUsers = await db.select().from(users);
 */
let _db: NeonDatabase<typeof schema> | null = null;

export function getDb(): NeonDatabase<typeof schema> {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

// Proxy that lazily initializes db on first access
export const db: NeonDatabase<typeof schema> = new Proxy(
  {} as NeonDatabase<typeof schema>,
  {
    get(_target, prop, receiver) {
      const realDb = getDb();
      const val = Reflect.get(realDb, prop, receiver);
      return typeof val === "function" ? val.bind(realDb) : val;
    },
  },
);
