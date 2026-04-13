/**
 * Drizzle ORM Instance
 *
 * Configured with the Neon serverless driver for use in Vercel Functions.
 * Import `db` anywhere you need typed, composable queries.
 */

import { drizzle } from "drizzle-orm/neon-serverless";
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
export const db = drizzle(getPool(), { schema });
