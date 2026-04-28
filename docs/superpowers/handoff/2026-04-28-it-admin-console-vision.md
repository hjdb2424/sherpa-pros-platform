# IT Admin Console — Vision & Backlog

**Date:** 2026-04-28
**Status:** Vision capture, not yet spec'd
**Owner:** Phyrom
**Related work shipped today:** `docs/superpowers/specs/2026-04-27-it-admin-portal-design.md` (auth + audit hardening of existing /admin/* pages)

---

## What this doc is

Today's work hardened the existing `/admin/*` pages (audit logs, investor metrics, dataroom access list, rewards, pro verifications) with real Clerk-backed RBAC, persistent audit logging, metadata scrubbing, break-glass recovery, etc. After clicking through it, Phyrom flagged that **the existing 5 pages don't match his actual vision for an "IT admin console."**

His exact words:

> "system admin will be working on the access list, modules, data performance, etc. not client project related."

This doc captures what an IT admin console *should* be at Sherpa Pros, distinct from the marketplace-operations surfaces that already live under `/admin/*`.

## The conceptual split

| Surface | Audience | Lives at | Status |
|---|---|---|---|
| **Marketplace operations** — pro verifications, reward redemptions, investor data room grants, audit logs | Founder + future ops/support staff | `/admin/*` (existing) | Hardened today (Phase 1 of the IT admin portal v1 spec) |
| **IT / SRE control plane** — modules, data performance, environment, infrastructure, integrations | Founder + future SRE/devops staff | TBD — likely `/sysadmin/*` or `/console/*` to disambiguate | **Not built. This doc is the seed.** |

The first surface is "running the marketplace business." The second is "running the platform that runs the business." They share an admin tier (super) but have different jobs and different consumers.

## What "IT admin console" should contain (Phyrom's mental model)

Phyrom's words cited "modules, data performance, environment, etc." Expanding from there based on what's typical for a platform of Sherpa Pros' shape:

### 1. Module / feature management
- **List of installed modules** with version, status (enabled/disabled), last-deployed date.
- **Toggle a module** on/off without a deploy (feature flags as the underlying mechanism — likely Vercel Edge Config per spec round 2 review, with a DB mirror for audit).
- **Per-module configuration** — settings that live alongside the module without polluting global env vars.
- Modules in the current Sherpa Pros stack include (examples): dispatch wiseman, payments commission engine, Twilio messaging, Zinc materials engine, Uber Direct, QBO bookkeeping, Wiseman bridge to BldSync, OCR service, Stripe Connect, Clerk auth.

### 2. Data performance / DB observability
- **Query performance dashboard** — slow queries, p95 latencies, index usage on hot tables (audit_logs, jobs, payments, etc.).
- **Table size + growth** — rows per table, growth rate (especially for audit_logs which the spec calls out as an unbounded-write surface).
- **Connection pool health** — Neon connection count vs limit.
- **Migration history** — what's applied, what's pending, when each ran.
- **Drizzle migration runner UI** (super-only) for planned migrations vs hot-deploy.

### 3. Environment / configuration
- **Read-only env-var inspector** (was deferred in v1 spec §2 as overkill since Vercel UI does it; reconsider if there's value in a unified view across Vercel/Clerk/Neon/Stripe configs all in one place).
- **Config drift detection** — compare what env vars are set across Production / Preview / Development tiers.
- **Secrets rotation tracker** — when was each secret last rotated, when's it due, who rotated it.

### 4. Integration health (deferred in v1 spec §2)
- **Live status panel for outbound integrations** — Twilio, Zinc, Uber Direct, QBO, Stripe Connect, Clerk, Google Maps. Each shows: last successful call, last failed call, error rate over the last hour/day, retry queue depth.
- **Synthetic probes** — periodic test calls to each integration to detect outages before users do.
- **Outbound idempotency-key viewer** — for replay-safe debugging when an integration call needs investigation.
- **One-click resend / retry** — gated by super-admin, audit-logged, rate-limited.

### 5. Background jobs / cron / queue
- **List of scheduled crons** (Vercel cron, plus any ad-hoc workers) with last-run timestamp and outcome.
- **Job execution history** — which crons ran when, succeeded/failed, duration.
- **Manual re-trigger** for a cron that missed.

### 6. Deployments / releases
- **Recent deploys** — Vercel deployment list, who triggered each, build duration, current status.
- **Promote / rollback** UI tied to Vercel API.
- **Build log access** for the last N deploys.

### 7. User session management (system-admin scope)
- **Active session count** by tier and role.
- **Force sign-out** for a user (dovetails with the existing Task 6 grantAdmin/revokeAdmin sessions revocation pattern).

### 8. Logs / observability
- **Application log stream** (Vercel logs API or Logflare).
- **Error tracking dashboard** — top errors by frequency, last seen, affected users.
- **Audit log search** — already exists at `/admin/logs`; could be cross-linked from the IT admin shell.

### 9. Backup / restore
- **DB backup status** — when's the last automated snapshot, which DB has it, recovery time objective.
- **Manual backup trigger** for pre-deploy or pre-migration safety.

## What this is NOT

- Not the marketplace ops console (verifications queue, reward grants, etc.) — that's `/admin/*` which already exists and was hardened today.
- Not customer-facing support tooling (impersonation, account-lookup-for-support) — that's a separate "Support console" use case that should be its own thing.
- Not a no-code app builder. The IT admin console manages the platform, doesn't extend it.

## Open questions (to resolve when this becomes a spec)

1. **Where does it live?** `/sysadmin`, `/console`, `/platform`, `/it`, or extend `/admin` with a sub-namespace like `/admin/sys/*`?
2. **Who has access?** Today's matrix has `super` and `support`. IT admin would likely be `super`-only initially, with a future `sre` or `devops` tier.
3. **What's the priority order across the 9 surfaces above?** Some have higher business value (integration health is critical for catching outages), some are nice-to-have (deployments — Vercel UI does this fine).
4. **Build vs buy split?** Modules + integration health + observability could each be standalone OSS tools (Plausible for analytics, Logflare for logs, etc.) — should the IT admin console be a thin shell linking to those, or should it absorb the data into a unified UI?
5. **Tie-in to the IT admin portal v1 work?** Today's audit logging, break-glass, and admin_grants table are all things this console would surface. The auth gate is reusable as-is.

## Suggested next step

When ready to scope this, run the brainstorming skill on this doc:

```
I want to spec the IT admin console for Sherpa Pros. Read:
1. ~/sherpa-pros-platform/docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md
2. ~/sherpa-pros-platform/docs/superpowers/specs/2026-04-27-it-admin-portal-design.md (the existing /admin/* hardening, which this builds on)
Then start the brainstorm.
```

The brainstorm should narrow the 9 surfaces to a v1 "thin slice" the way today's session narrowed "full operational console" → "middle slice + surgical cut."

## Files this would interact with

- `src/lib/auth/admin.ts` — reusable RBAC (already built)
- `src/lib/auth/admin-grants.ts` — reusable grant/revoke pattern (already built)
- `src/lib/audit.ts` — existing audit log writer (now persisting to DB)
- New: `src/app/(dashboard)/sysadmin/*` — likely location for the new console pages
- New: `src/app/api/sysadmin/*` — supporting API routes
- New: `src/lib/sysadmin/*` — module registry, integration health probes, perf-query helpers
