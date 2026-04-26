---
title: US-West Neon Read Replica Setup Runbook
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire
references:
  - 01-drizzle-replica-aware-client.md
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
phase: 4A — Q3 2026
---

# US-West Read Replica Setup

## Goal

Stand up a Neon Postgres read replica in `us-west-2` (Oregon) so Vercel Functions deployed to `sfo1` (San Francisco) can serve reads from the same coast. Cuts P95 read latency for West Coast metros (Seattle, Portland, San Francisco, San Diego, Phoenix) from ~120ms to under 35ms.

## Pre-flight checklist

- [ ] Neon project on a paid tier that supports read replicas (Scale plan minimum).
- [ ] Vercel project deployed and serving traffic from `iad1` only.
- [ ] Replica-aware Drizzle client (`lib/db/client.ts`) merged but not yet routing (replica env unset).
- [ ] Datadog (or chosen Application Performance Monitoring vendor) hooked up to Neon metrics.
- [ ] PagerDuty service for `db-replication` exists.

## Provisioning steps

- [ ] **1. Create the replica branch.**
  - In the Neon console: Project → Branches → "Create branch" → choose **"Read replica"** → region `us-west-2` → parent: production primary.
  - Same Postgres major version as primary (currently 16).
  - Compute: start at `0.5 CU` autoscaled to `2 CU`. Adjust after 2 weeks of telemetry.
- [ ] **2. Capture the replica connection string.**
  - Use the pooled endpoint (suffix `-pooler.us-west-2.aws.neon.tech`).
  - Store in 1Password vault `Sherpa Pros / Database / Replicas`.
- [ ] **3. Configure Vercel function regions.**
  - In `vercel.json`: `"regions": ["iad1", "sfo1"]`.
  - Per-route region pinning is not required initially — Vercel routes to the closest region by default.
- [ ] **4. Set environment variables in Vercel.**
  - `DATABASE_READ_URL_US_WEST=<pooled replica string>` for production.
  - Leave preview/dev empty so replica is production-only.
- [ ] **5. Disable automatic failover.**
  - Replica must be **read-only** — Phase 4A operates manual failover only. Automated failover is a Phase 4B+ change once we have a documented failover playbook.
- [ ] **6. Smoke test (see below) before announcing rollout.**

## Replication lag monitoring

Targets:

- **Healthy:** lag < 2 seconds
- **Warn (Datadog alert, no page):** lag > 5 seconds for 3 consecutive minutes
- **Page (PagerDuty SEV3):** lag > 30 seconds for 1 minute

Datadog monitor query:

```
avg(last_5m):avg:postgresql.replication.lag_seconds{env:prod,replica:us-west-2} > 30
```

Lag spike playbook → see runbook 11 in `06-runbook-templates-and-12-runbooks.md`.

## Smoke test plan

Run from a sfo1-pinned ephemeral Vercel function (`/api/_admin/replica-smoke`):

- [ ] **Read latency:** 100 sequential `SELECT id FROM jobs LIMIT 1` queries; assert P95 < 50ms.
- [ ] **Write latency:** 10 sequential inserts to a throwaway `_smoke_test` table via `getWriteDb()`; assert P95 < 350ms.
- [ ] **Replication propagation:** insert via primary; poll replica every 100ms for the row; record propagation time; assert < 2s.
- [ ] **Stale-read guard:** within one request context, write then immediately read; assert read is served by primary (check `pg_stat_activity` `application_name`).
- [ ] **Failover drill (controlled, off-hours):** simulate replica outage by removing `DATABASE_READ_URL_US_WEST`; redeploy; verify all reads fall back to primary with no user impact.

## Rollout sequencing

- [ ] **Day 0:** Replica provisioned, env vars set in production, traffic still 100% primary (replica reads disabled by feature flag).
- [ ] **Day 1:** Enable replica reads for 5% of `getReadDb()` calls via LaunchDarkly flag `db-read-replica-rollout-prod`. Monitor for 24 hours.
- [ ] **Day 3:** Increase to 25% if no anomalies.
- [ ] **Day 7:** 100% replica reads from `sfo1` functions. Primary reads only when stale-read guard fires or `iad1` functions.
- [ ] **Day 14:** Review cost + latency telemetry; adjust replica compute size.

## Cost impact

Phase 1-2 baseline (estimated):

| Item | Monthly cost (USD) |
| --- | --- |
| Neon replica compute (0.5–2 CU autoscaled) | $40–$60 |
| Cross-region data transfer (writes from sfo1 → iad1) | $10–$20 |
| Datadog Postgres integration uplift | $10 |
| **Total** | **~$80/mo** |

Scales linearly with read volume. At ~50K daily active users plan to bump to ~$250/mo.

## Rollback plan

- [ ] Disable LaunchDarkly flag `db-read-replica-rollout-prod` → 0%.
- [ ] Replica continues running but receives no traffic.
- [ ] Investigate, fix, retry rollout from 5%.
- [ ] If replica must be deleted: Neon console → branch → delete (replica only; primary unaffected).
