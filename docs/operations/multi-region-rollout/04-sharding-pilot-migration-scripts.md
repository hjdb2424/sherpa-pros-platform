---
title: Sharding Pilot Migration Scripts (jobs + messages by metro_id)
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire
references:
  - 03-citus-vs-pgpartman-adr.md
  - src/db/migrations/009_multi_trade_jobs.sql
  - src/db/migrations/010_dispatch_materials_orders_deliveries.sql
phase: 4A (pg_partman) → 4B (Citus)
---

# Sharding Pilot — Boston + Portsmouth First

## Goal

Prove the metro-scoped sharding pattern by migrating `jobs` and `messages` for two pilot metros (Boston, Portsmouth) before broad rollout. Pilot validates: Drizzle ORM (Object-Relational Mapper) compatibility, query latency, cross-shard read patterns, and the operational playbook for adding new shards.

## Pilot scope

- Metros: `boston-ma` (high volume), `portsmouth-nh` (low volume — original beta hub).
- Tables: `jobs`, `messages` (chat threads).
- NOT in scope yet: `audit_logs` (handled by pg_partman time-partitioning, see runbook 11), `materials_orders`, `deliveries`.

## Phase 4A — pg_partman intermediate (time-based partitioning of audit_logs + messages)

This is the lower-complexity start that buys time before Citus.

### DDL: enable extension and partition `audit_logs` by month

```sql
CREATE EXTENSION IF NOT EXISTS pg_partman;

-- Convert audit_logs to a partitioned table.
-- audit_logs already exists from migration 008; we recreate as partitioned and migrate data.
CREATE TABLE audit_logs_partitioned (
  LIKE audit_logs INCLUDING ALL
) PARTITION BY RANGE (created_at);

SELECT partman.create_parent(
  p_parent_table => 'public.audit_logs_partitioned',
  p_control => 'created_at',
  p_type => 'range',
  p_interval => 'monthly',
  p_premake => 6  -- pre-create 6 months of partitions
);

-- Backfill in batches of 100K to avoid long lock.
INSERT INTO audit_logs_partitioned SELECT * FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '1 day'
  ORDER BY created_at LIMIT 100000;

-- Repeat until empty, then swap names in a single transaction:
BEGIN;
ALTER TABLE audit_logs RENAME TO audit_logs_legacy;
ALTER TABLE audit_logs_partitioned RENAME TO audit_logs;
COMMIT;

-- Schedule partition maintenance via pg_cron or external scheduler:
SELECT cron.schedule('partman-maintenance', '0 3 * * *',
  $$SELECT partman.run_maintenance()$$);
```

### DDL: partition `messages` by month (same pattern)

```sql
CREATE TABLE messages_partitioned (LIKE messages INCLUDING ALL)
  PARTITION BY RANGE (created_at);
SELECT partman.create_parent(
  p_parent_table => 'public.messages_partitioned',
  p_control => 'created_at',
  p_type => 'range',
  p_interval => 'monthly',
  p_premake => 6
);
-- backfill + rename swap as above
```

### Retention policy

- `audit_logs`: 7-year retention (compliance requirement). Old partitions detached and archived to S3 Glacier monthly.
- `messages`: 18-month hot, then archived to S3 Glacier. (Confirm with privacy counsel before purging.)

## Phase 4B — Citus distributed tables for `jobs` and `messages`

Once we have 5+ metros generating substantial volume (projected late 2027), introduce Citus.

### DDL: convert `jobs` to a distributed table

```sql
-- Run on Citus coordinator node.
CREATE EXTENSION IF NOT EXISTS citus;

-- metro_id must be in primary key for distributed tables.
-- Migration 011 (forthcoming) adds metro_id to jobs if not already present.
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS metro_id TEXT NOT NULL DEFAULT 'us-east-default';
ALTER TABLE jobs DROP CONSTRAINT jobs_pkey;
ALTER TABLE jobs ADD PRIMARY KEY (metro_id, id);

-- Distribute by metro_id, hash-partitioned across worker nodes.
SELECT create_distributed_table('jobs', 'metro_id');

-- Co-locate messages with jobs so message <-> job joins stay local on a shard.
ALTER TABLE messages ADD COLUMN IF NOT EXISTS metro_id TEXT NOT NULL DEFAULT 'us-east-default';
ALTER TABLE messages DROP CONSTRAINT messages_pkey;
ALTER TABLE messages ADD PRIMARY KEY (metro_id, id);
SELECT create_distributed_table('messages', 'metro_id', colocate_with => 'jobs');

-- Reference tables (small, replicated to every node):
SELECT create_reference_table('metros');
SELECT create_reference_table('access_list');
```

### Pilot rollout: shard 2 metros

```sql
-- Step 1: backfill metro_id on existing rows.
UPDATE jobs SET metro_id = 'boston-ma' WHERE region_zip LIKE '021%' OR region_zip LIKE '022%';
UPDATE jobs SET metro_id = 'portsmouth-nh' WHERE region_zip LIKE '038%';
UPDATE jobs SET metro_id = 'us-east-default' WHERE metro_id IS NULL;

-- Step 2: validate distribution.
SELECT metro_id, count(*) FROM jobs GROUP BY metro_id ORDER BY 2 DESC;

-- Step 3: rebalance shards across worker nodes if uneven.
SELECT rebalance_table_shards('jobs');
SELECT rebalance_table_shards('messages');
```

## Application changes required

The Drizzle ORM does not enforce shard-key inclusion at compile time. We add a lint rule to do that.

- [ ] **Add ESLint rule `sherpa/require-metro-id-on-sharded-table`** in `eslint.config.js`. The rule fails on `db.select().from(jobs).where(...)` when the where clause does not reference `metro_id`. Custom AST (Abstract Syntax Tree) walker — ~80 lines.
- [ ] **Add Drizzle helper** `withMetro(metroId, query)` that mechanically appends `eq(jobs.metroId, metroId)` to the where clause.
- [ ] **Audit existing query sites** — primary culprits: `src/lib/dispatch-wiseman/`, `src/app/api/jobs/`, `src/app/api/dispatch/`.
- [ ] **Type system enforcement (stretch goal):** wrap sharded tables in a branded `Sharded<T>` type that requires `{ metroId: string }` on every query.

## Migration window

| Step | Window | User impact |
| --- | --- | --- |
| Backfill `metro_id` | Online, batched | None |
| Convert to distributed table (`create_distributed_table`) | 4–6 hours | Reads + writes blocked on those tables |
| Validate + rebalance | 30 min | None |

Schedule for a Sunday 2am-8am Eastern window. Pre-announce to all users 1 week in advance via in-app banner + email.

## Rollback plan

- [ ] If perf degrades or data corruption detected within 24 hours: `SELECT undistribute_table('jobs');` reverts to a regular Postgres table.
- [ ] Restore from pg_dump snapshot taken immediately before `create_distributed_table` if undistribute fails.
- [ ] Keep the legacy single-shard schema available for 30 days post-migration.

## Post-migration validation

- [ ] P95 query latency for `jobs` queries with `metro_id` filter must improve or hold (target: < 100ms).
- [ ] Cross-shard queries (without `metro_id`, e.g., admin dashboard counts) must complete in < 2s.
- [ ] Zero data loss (row count before == row count after).
- [ ] All 189 PM module tests pass against sharded schema.
- [ ] Smoke test on staging Citus cluster for 7 days before production cutover.
