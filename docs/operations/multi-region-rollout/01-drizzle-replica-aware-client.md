---
title: Replica-Aware Drizzle Client (Read/Write Routing)
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire (Phase 3)
references:
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
  - docs/superpowers/plans/2026-04-25-platform-scale-architecture-plan.md (WS3)
  - src/db/drizzle.ts
  - src/db/connection.ts
phase: 4A (US-West replica) → 4B (sharding)
---

# Replica-Aware Drizzle Client

## Why this exists

Today the platform has a single primary Neon Postgres in US-East (`iad1`). To hit P95 cross-region read latency under 200ms during US-West (Wave A) launch and beyond, we need read traffic to land on the closest replica while writes always go to the primary. This guide describes the `lib/db/client.ts` wrapper that exposes `getReadDb()` and `getWriteDb()` and the migration path from the existing `db` import.

## Design goals

- Drop-in compatibility with current Drizzle ORM (Object-Relational Mapper) usage.
- Zero behavior change in single-region mode (replica env vars unset → both helpers return primary).
- Stale-read protection: if the same request just wrote to a shard, subsequent reads in that request go to the primary.
- Sub-200ms P95 cross-region read latency from US-West to US-East replica chain.

## Environment configuration

Per-region Vercel environment variables:

```
DATABASE_URL                          # primary writer (US-East / iad1)
DATABASE_READ_URL_US_EAST             # primary's local replica (optional)
DATABASE_READ_URL_US_WEST             # us-west-2 replica (Phase 4A)
DATABASE_READ_URL_CA_CENTRAL          # ca-central-1 (Phase 4 international)
DATABASE_READ_URL_EU_WEST             # eu-west-1 (Phase 4 international)
VERCEL_REGION                         # injected by Vercel runtime (e.g., sfo1, iad1)
DB_REPLICA_LAG_GUARD_MS=2000          # if last write < this ago, force primary
```

## Code stub: `lib/db/client.ts`

```typescript
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "@/db/drizzle-schema";

type RegionId = "iad1" | "sfo1" | "cdg1" | "syd1" | "yyz1";

const REPLICA_BY_REGION: Record<RegionId, string | undefined> = {
  iad1: process.env.DATABASE_READ_URL_US_EAST,
  sfo1: process.env.DATABASE_READ_URL_US_WEST,
  cdg1: process.env.DATABASE_READ_URL_EU_WEST,
  syd1: undefined, // Phase 4D
  yyz1: process.env.DATABASE_READ_URL_CA_CENTRAL,
};

const writePool = new Pool({ connectionString: process.env.DATABASE_URL });
const readPools = new Map<string, Pool>();

function getReadPool(): Pool {
  const region = (process.env.VERCEL_REGION as RegionId) || "iad1";
  const url = REPLICA_BY_REGION[region] ?? process.env.DATABASE_URL!;
  let pool = readPools.get(url);
  if (!pool) {
    pool = new Pool({ connectionString: url });
    readPools.set(url, pool);
  }
  return pool;
}

// Per-request write tracking (set by getWriteDb on commit, checked by getReadDb).
// In Vercel Functions each invocation has its own module scope, so a per-process
// AsyncLocalStorage covers a single request.
import { AsyncLocalStorage } from "node:async_hooks";

interface WriteContext {
  lastWriteAt: number;
  shardKeys: Set<string>; // metro_id values touched
}
export const writeContext = new AsyncLocalStorage<WriteContext>();

export function getWriteDb() {
  const ctx = writeContext.getStore();
  if (ctx) ctx.lastWriteAt = Date.now();
  return drizzle(writePool, { schema });
}

export function getReadDb(opts?: { metroId?: string }) {
  const ctx = writeContext.getStore();
  const guardMs = Number(process.env.DB_REPLICA_LAG_GUARD_MS ?? 2000);
  const recentWrite = ctx && Date.now() - ctx.lastWriteAt < guardMs;
  const sameShard = opts?.metroId && ctx?.shardKeys.has(opts.metroId);
  if (recentWrite && (sameShard || !opts?.metroId)) {
    return drizzle(writePool, { schema }); // stale-read protection
  }
  return drizzle(getReadPool(), { schema });
}
```

## Migration path from existing `db` import

The existing `src/db/drizzle.ts` exports `db` as a Proxy. We will:

- [ ] **Step 1.** Land `lib/db/client.ts` alongside the existing `src/db/drizzle.ts` (no removal yet).
- [ ] **Step 2.** Audit all `import { db } from "@/db/drizzle"` sites with `grep -rn` and tag each as read-only, write, or mixed.
- [ ] **Step 3.** For read-only sites (search, list, dashboard hydrations), swap to `const db = getReadDb()` inside the handler. Preserves Drizzle API surface.
- [ ] **Step 4.** For write sites, swap to `const db = getWriteDb()`. Add `metro_id` to `writeContext.shardKeys` after successful insert/update.
- [ ] **Step 5.** Wrap top-level Vercel Function handlers in `writeContext.run({ lastWriteAt: 0, shardKeys: new Set() }, async () => { ... })`.
- [ ] **Step 6.** Keep the legacy `db` proxy for one release; mark deprecated in JSDoc.
- [ ] **Step 7.** Remove legacy `db` after telemetry confirms zero call sites.

## Connection pooling guidance

- **Phase 4A (single-region + 1 replica):** Neon's built-in pooler (PgBouncer-managed) is sufficient. Connection string ends in `-pooler.us-east-2.aws.neon.tech`.
- **Phase 4B (sharded + multi-region):** Move to dedicated PgBouncer per region in transaction pooling mode. Sized at `(max_connections * 0.8) / num_functions`, default 200 conns per replica.
- **Watch for:** prepared-statement issues with PgBouncer transaction mode — Drizzle's `neon-serverless` driver avoids prepared statements by default.

## Performance targets

- P95 read latency cross-region (sfo1 function → us-west-2 replica): **< 200ms**
- P95 write latency cross-region (sfo1 function → iad1 primary): **< 350ms** (acceptable; writes are infrequent in the dispatch hot path)
- Replica lag: **< 2s typical, alert at 5s, page at 30s** (see `02-us-west-replica-setup-runbook.md`)

## Risks

| Risk | Mitigation |
| --- | --- |
| Stale read shows pro a missing job | `writeContext` forces primary for in-request reads after a write |
| Replica down → reads fail | Fallback to primary on connection error inside `getReadPool` (catch + log + retry on writePool) |
| Connection pool saturation cross-region | PgBouncer per region + circuit breaker (see runbook 10) |
| Drizzle schema drift across regions | Migrations always run against primary; replicas pick up via streaming replication |
