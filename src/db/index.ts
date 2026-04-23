/**
 * Database Layer — Barrel Export
 *
 * Single entry point for all database operations.
 *
 * @example
 * import { db, query, prosQueries, jobsQueries } from '@/db';
 */

// Connection primitives
export { getPool, getSql, query } from "./connection";

// Drizzle ORM instance
export { db } from "./drizzle";

// Drizzle schema (table definitions)
export * as schema from "./drizzle-schema";

// Query modules
export * as prosQueries from "./queries/pros";
export * as jobsQueries from "./queries/jobs";
export * as bidsQueries from "./queries/bids";
export * as paymentsQueries from "./queries/payments";
export * as ratingsQueries from "./queries/ratings";
