---
title: "ADR 001: Sharding Strategy — Citus vs pg_partman vs Application-Layer"
date: 2026-04-25
status: draft (decision: Citus long-term, pg_partman Phase 4A)
owner: Phyrom + future SRE hire
references:
  - 01-drizzle-replica-aware-client.md
  - 04-sharding-pilot-migration-scripts.md
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
phase: 4A → 4B
---

# ADR 001 — Sharding Strategy for Multi-Region Scale

## Status

Proposed (target accept date: end of Phase 4A planning). Decision: **pg_partman in Phase 4A as a partitioning intermediate; Citus in Phase 4B once shard count exceeds 5.**

## Context

Sherpa Pros runs on a single Neon Postgres primary today. Locked rollout sequence:

- US-East (current)
- US-West Q3 2026
- Canada Q3 2027
- EU Q4 2027
- UK + AU 2028

Per the platform-scale spec, hot tables that grow unboundedly with metros and time:

- `jobs` — projected 10M+ rows by end of Year 2
- `messages` — projected 50M+ rows by end of Year 2
- `audit_logs` — projected 100M+ rows (7-year retention)
- `materials_orders`, `deliveries` — projected 5M+ rows by end of Year 2

Targets that drive the decision:

- P95 dispatch query latency < 500ms.
- 99.95% uptime.
- Recovery Point Objective (RPO) 15 minutes; Recovery Time Objective (RTO) 4 hours regional.
- Data residency: US data stays US, Canadian data in Canada, EU data in EU.

## Options considered

### Option A — Citus extension on Postgres

Citus is a Postgres extension that turns a Postgres cluster into a distributed database. Distributes tables across worker nodes by a shard key (here: `metro_id`).

**Pros**

- Native sharding at the database tier — application sees a single logical database.
- Cross-shard queries supported via the Citus distributed query planner.
- Distributed tables, reference tables, and local tables all coexist.
- Battle-tested at scale (Microsoft uses it for Azure Database for PostgreSQL Hyperscale).

**Cons**

- Citus is owned by Microsoft (acquired Citus Data 2019). Vendor lock-in concern.
- Requires DBA (Database Administrator) expertise to operate well — rebalancing shards, node failures, distributed deadlocks.
- Neon does not offer Citus as a managed service today; we would self-host on AWS RDS or move to Microsoft Azure for Hyperscale.
- Migration off Citus is non-trivial (logical replication of distributed tables).
- Higher baseline cost: 3-node minimum cluster (~$1500/mo) vs single Neon instance.

### Option B — pg_partman + foreign data wrapper (FDW)

`pg_partman` is a Postgres extension for declarative range/list partitioning. FDW (Foreign Data Wrapper) lets one Postgres query another Postgres as a remote table.

**Pros**

- Stays on vanilla Postgres / Neon — no vendor lock-in.
- Lower complexity for time-based partitioning (perfect for `audit_logs` and `messages` by `created_at`).
- Easy to roll back: drop partitions, no application change.
- pg_partman is in Neon's supported extension list.

**Cons**

- FDW cross-database queries are slow and break Drizzle ORM's relational query API.
- Logical partitioning only — does not solve the "all data on one box" capacity ceiling.
- Cross-shard joins require application-layer fan-out.
- Harder to reason about with metro-based sharding (would need a partition per metro, which doesn't scale to 200+ metros).

### Option C — Application-layer sharding (Drizzle-managed)

Drizzle client routes queries to one of N Postgres instances based on `metro_id` hash.

**Pros**

- Zero database extensions — works on any Postgres.
- Full control over sharding logic, rebalancing, hot-spot mitigation.
- Easy to mix shards across providers (Neon US, Neon EU, AWS RDS Canada).

**Cons**

- All cross-shard queries become application code (aggregation, joins, transactions).
- Distributed transactions are application-managed (sagas or two-phase commit). Significant complexity.
- Schema migrations must run on every shard — coordination overhead.
- High engineering cost upfront; high ongoing maintenance.

## Decision

**Phase 4A (Q3 2026 — US-West launch):** Adopt **pg_partman** for time-based partitioning of `audit_logs` and `messages` only. Keep `jobs` unsharded. Defer Citus until shard count exceeds 5.

**Phase 4B (when shard count > 5, projected late 2027 with EU + Canada + US-West-2 + US-Central + US-East):** Adopt **Citus**. Migrate `jobs`, `messages`, `materials_orders`, `deliveries` to Citus distributed tables sharded by `metro_id`. Reference tables: `metros`, `pros` (sharded by `home_metro_id`).

**Why this two-step approach:**

- pg_partman gives us 80% of the benefit (table size manageability, query performance via partition pruning) for 20% of the operational cost in Phase 4A.
- Citus introduces real DBA burden — defer until Phase 3 SRE hire (per the platform-scale plan WS5 hiring sequence) is on the team.
- Two steps de-risk the migration: validate the partition key + Drizzle integration before going distributed.

## Consequences

**Positive**

- Phase 4A ships with manageable risk and predictable cost.
- pg_partman work is reusable in Citus (Citus respects underlying partitioning).
- Application code learns to always include `metro_id` in `jobs` queries — that hygiene is exactly what Citus needs later.

**Negative**

- Two migrations instead of one (pg_partman first, Citus second). Higher total engineering cost over 18 months.
- Citus introduces vendor concentration risk (Microsoft). Mitigation: keep all schema migrations in vanilla Postgres syntax where possible; document an exit plan to a non-Citus distributed Postgres (Yugabyte, CockroachDB) as an option.
- Citus enterprise licensing (if needed for multi-tenant security features) is ~$0.20/vCPU-hour beyond the open-source community edition. Self-host Citus Community on AWS RDS to avoid licensing.

## Cost impact

| Item | Phase 4A monthly | Phase 4B monthly |
| --- | --- | --- |
| Neon US-East primary | $300 | $300 (kept for non-distributed tables) |
| Neon US-West replica | $80 | $80 |
| Citus cluster (3 worker minimum, AWS RDS r6g.xlarge) | $0 | $1500 |
| Citus enterprise license (optional) | $0 | $0 (community edition) |
| pg_partman maintenance overhead | $0 | $0 (extension is free) |
| **Total DB tier** | **~$380** | **~$1880** |

## Migration path

See `04-sharding-pilot-migration-scripts.md` for the operational runbook.

## Open questions

- Confirm Neon roadmap for Citus support (could collapse two-step approach into one).
- Validate Drizzle's schema generation on Citus distributed tables (not officially supported but should work since Citus is transparent at the SQL layer).
- Decide hosting for Citus cluster: AWS RDS (managed Postgres, self-install Citus) vs raw EC2 (full control). Recommend RDS for ops simplicity.
