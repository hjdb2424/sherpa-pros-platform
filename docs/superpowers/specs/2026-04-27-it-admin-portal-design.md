# IT Admin Portal — v1 Design Spec

**Date:** 2026-04-27
**Author:** Phyrom (with two-round review by Backend Architect, Infrastructure Maintainer, DevOps Automator, superpowers:code-reviewer, Studio Producer)
**Status:** Draft awaiting review
**Scope:** v1 ("middle slice with surgical cut")
**Estimated effort:** ~5 days, 6 phases shipped as 6 PRs

---

## 1. Problem statement

Today, admin access to `/admin/*` routes is granted by manually setting a cookie in DevTools:

```js
document.cookie = "sherpa-is-admin=true; path=/; max-age=2592000; samesite=lax";
```

The platform-admin runbook explicitly flags "Admin role wiring" as a top backlog item. Five admin pages (`access-list`, `investor-metrics`, `logs`, `rewards`, `verifications`) are live and used weekly by the founder, but they sit behind this cookie hack. The `users.is_admin` column exists in the database and nothing reads it. There is no per-user admin tier, no audit of admin actions beyond the existing `audit_logs` write paths in regular features, and no recovery procedure if Clerk is unreachable.

This spec replaces the cookie hack with a real auth gate, hardens the five existing pages, adds two read-only operational surfaces, and establishes the audit and break-glass primitives needed before any further admin tooling ships.

## 2. What's explicitly out of scope (v2 or later)

Each item is paired with a documented trigger so we know when to pick it up.

| Deferred item | Trigger to revisit |
|---|---|
| Payments dashboard (Stripe Connect) | When the active Stripe Connect appeal resolves |
| Integration health (Twilio/Zinc/Uber/QBO) + retry | When there is a documented production incident OR a v2 spec for outbound idempotency primitives |
| Env-var inspector | Likely never; Vercel UI already exposes this |
| Feature flags UI | When there are >10 flags in the system worth gating |
| Jobs CRUD admin surface | When the existing dispatch flow proves insufficient for a real case |
| User impersonation | Last; requires fresh-auth, auto-expire, mandatory reason field, dedicated tabletop test |
| `ops` admin tier (third tier) | When admin #3 is hired |
| Approval queues (refund-request, flag-toggle-request) | When the surfaces they approve into ship |
| In-app edits to user identity fields (name, email, role) | When Clerk dashboard becomes a friction point at scale; for now we link out |
| In-app pro verify/reject/suspend duplicates of `/admin/verifications` | Never — already exists at `/admin/verifications` |
| Monthly partitioning of `audit_logs` | When `audit_logs` exceeds 1M rows OR p95 query latency on the table exceeds 200ms |

## 3. Architecture

### 3.1 Source of truth for admin tier

Clerk `publicMetadata.admin_tier ∈ { "super", "support" }` is the runtime authority. The `proxy.ts` middleware reads it on every `/admin/*` request and copies the value into a `sherpa-admin-tier` cookie scoped to the session, with `max-age = 60` seconds. The cookie is a perf cache; Clerk is the truth.

### 3.2 Database mirror

A new `admin_grants` table records the *history* of grants and revokes for audit. Clerk holds *current* state; the DB table holds *every* state transition that ever happened.

```
admin_grants
  id                 uuid pk
  user_id            uuid references users.id
  tier               varchar(20) — 'super' | 'support'
  status             varchar(20) — 'pending' | 'active' | 'revoked' | 'failed'
  granted_by         uuid references users.id
  granted_at         timestamptz default now()
  revoked_at         timestamptz null
  revoked_by         uuid references users.id null
  revocation_reason  text null
  clerk_event_id     varchar(64) null         — for webhook idempotency
  failure_reason     text null                — populated when status='failed'

  partial unique index (user_id) WHERE status = 'active' AND revoked_at IS NULL
  index (user_id)
  index (status)
  index (granted_at)
```

The partial unique index on active grants prevents double-grant races.

### 3.3 Sync write order — the race fix

Round 1 review identified that letting the Clerk webhook write `admin_grants` creates a race where `proxy.ts` reads Clerk state before the DB mirror catches up. The reverse order is also unsafe: write Clerk first then DB, and a crash mid-flight leaves Clerk granted but no audit trail. The chosen order:

1. Server action receives `grant(userId, tier)`.
2. Insert `admin_grants` row with `status = 'pending'`.
3. Call Clerk's `users.updateUser({ publicMetadata: { admin_tier: tier } })`.
4. On Clerk 2xx: UPDATE the grant row to `status = 'active'`. Return success.
5. On Clerk 4xx/5xx: UPDATE the grant row to `status = 'failed'`, populate `failure_reason`. Surface the error to the admin. Operator can retry.

The Clerk `user.updated` webhook becomes a *reconciler*: it inserts an `admin_grants` row with `status = 'active'` only if no row with the matching `clerk_event_id` exists yet. This catches the case where the server action crashed between steps 3 and 4. A nightly cron (Phase 6) diffs Clerk state vs `admin_grants` active rows and alerts on drift.

### 3.4 Revocation

When `revoke(userId)` runs:

1. UPDATE `admin_grants` SET `status='revoked'`, `revoked_at=now()` WHERE `user_id=? AND status='active'`.
2. Call `clerk.users.updateUser({ publicMetadata: { admin_tier: null } })`.
3. **Also call `clerk.sessions.revokeSession()` for that user's active sessions.** This closes the 60-second cookie staleness window for compromise scenarios — without it, a revoked admin keeps power for up to 60s.

### 3.5 Cookie cutover

The current `proxy.ts` reads `sherpa-is-admin`. Phase 1 must dual-read both `sherpa-is-admin` (legacy, treated as `super`) AND `sherpa-admin-tier` (new) for one deploy, then a follow-up commit removes the legacy read. Without the dual-read, the founder locks himself out the moment Phase 1 ships because his existing cookie is the legacy name.

### 3.6 Permission matrix

| Action | super | support |
|---|---|---|
| `admin.grant` / `admin.revoke` | ✓ | ✗ |
| `admin.view_grants` | ✓ | ✗ |
| `users.view` / `users.list` | ✓ | ✓ |
| `users.edit` (name, email, role) | links to Clerk | ✗ |
| `users.disable` | ✓ | ✗ |
| `users.impersonate` | DEFERRED | DEFERRED |
| `pros.view` / `pros.list` | ✓ | ✓ |
| `pros.verify` / `reject` / `suspend` | via `/admin/verifications` | via `/admin/verifications` |
| `audit.view` (full log incl. PII) | ✓ | ✗ |
| `dataroom.view_grants` (existing `/admin/access-list`) | ✓ | ✓ |
| `dataroom.grant` / `revoke` (existing `/admin/access-list`) | ✓ | ✗ |
| `verifications.queue.view` (existing `/admin/verifications`) | ✓ | ✓ |
| `verifications.approve` / `reject` (existing) | ✓ | ✗ |
| `rewards.view` (existing `/admin/rewards`) | ✓ | ✓ |
| `investor-metrics.view` (existing) | ✓ | ✗ |

`audit.view` is super-only because the audit log contains user emails, IPs, and target IDs. A PII-redacted view for support is a v2 concern when there is a support hire.

### 3.7 Audit logging policy

**What is logged:** all mutations across the admin portal, plus sensitive reads (audit log views, dataroom grant list views). Page-level reads of regular surfaces are NOT logged in v1.

**Storage:** the existing `audit_logs` table at `src/db/drizzle-schema.ts:792` is reused unchanged in shape. The `@/lib/audit` helper is extended with new `AuditAction` enum values for the admin portal's mutations.

**Append-only enforcement:** Drizzle migrations run as a `migrator` Postgres role with full DDL + DML. The Next.js app connects as a separate `app` role with `INSERT, SELECT` on `audit_logs` and NO `UPDATE, DELETE`. A startup assertion in `src/lib/db.ts` queries `current_user` and aborts boot if it equals `migrator` in production. A CI test asserts that an `UPDATE audit_logs SET ...` query as the app role raises `permission denied`.

**Metadata scrubbing:** the `audit()` helper wraps inserts with a scrubber that strips both shape-matched secrets and key-named secrets:

- Value regex: `/sk_[a-zA-Z0-9]{20,}/`, `/pk_(live|test)_[a-zA-Z0-9]+/`, `/rk_(live|test)_[a-zA-Z0-9]+/`, `/whsec_[a-zA-Z0-9]+/`, `/Bearer [a-zA-Z0-9._\-]+/`, `/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/` (JWT), `/ghp_[a-zA-Z0-9]+/`, `/gho_[a-zA-Z0-9]+/`, `/sess_[a-zA-Z0-9]+/`, `/[A-Za-z0-9_-]{40,}/` (high-entropy fallback).
- Key-name scrub (case-insensitive): `authorization`, `cookie`, `set-cookie`, `password`, `secret`, `token`, `api_key`, `apikey`, `private_key`. The value is replaced with `[REDACTED]`.
- Scrubber hits increment a counter (`audit_scrubber_redactions_total`) so we notice if mistakes are being caught.

**Write path:** mutation audit writes happen synchronously in the same database transaction as the mutation itself. Sensitive-read audit writes use Vercel's `waitUntil()` to avoid blocking the response. This protects mutation auditability from instance kills while keeping read paths fast.

**No partitioning in v1.** With mutations-only at ~10–50 events/day for one admin, the audit table grows ~15K rows/year. Partitioning is added when the table exceeds 1M rows or p95 query latency on `/admin/logs` exceeds 200ms.

### 3.8 Break-glass procedure (Phase 1, not deferred)

If Clerk is unreachable, the founder must still be able to act. Phase 1 ships a documented procedure plus the code that supports it:

- A `BREAK_GLASS_KEY` env var holds a server-side secret used to sign a fallback cookie.
- A `/break-glass` endpoint (not linked from any page) accepts the key and, on match, sets a signed `sherpa-break-glass=true` cookie with `max-age=3600`.
- `proxy.ts` honors the signed cookie as `super` ONLY when the `BREAK_GLASS_ENABLED` env var is `"true"`. This env var is the kill switch — flip to `"false"` after the incident.
- Every break-glass cookie set OR honored writes a `break_glass_used` audit event with the IP.
- A documented runbook entry covers: when to use, how to rotate `BREAK_GLASS_KEY` after use, how to verify the audit row landed.

Phase 6 adds a weekly Vercel Cron job that hits `/break-glass` against a seeded preview-env admin and verifies the audit row appears, so this code path doesn't rot.

### 3.9 Rate limits

`users.disable` (Phase 4) is rate-limited to 5 invocations per hour per admin at the server-action layer, returning a 429 with a clear error message above that. This is fat-finger protection on a 10-pro beta where a runaway disable loop is a customer-visible outage. The existing `pros.suspend` action at `/admin/verifications` should get the same rate limit applied as part of Phase 5 hardening, even though no UI changes there.

### 3.10 Stripe-suspension kill switch

Even though all `payments.*` surfaces are deferred, a guardrail is added in v1: any future server action under `src/app/api/payments/**` (admin-initiated) MUST short-circuit with a 503 if `STRIPE_ADMIN_WRITES_ENABLED !== "true"`. The env var defaults to absent (i.e., off) and gets flipped on once the Stripe Connect appeal resolves favorably. This is a pre-commit safeguard to make sure no future PR accidentally ships a money-write path during the appeal window.

## 4. Surfaces shipping in v1

### 4.1 `/admin` shell

A persistent layout wrapping all `/admin/*` routes. Stripe-style left nav grouped:

```
OVERVIEW       PEOPLE         AUDIT
  Home           Users          Logs
                 Pros           Access Grants

INVESTORS      QUEUE
  Metrics        Verifications
  Access List    Rewards
```

Header shows the signed-in admin's email and tier badge. Desktop-first; on mobile (< lg breakpoint), the sidebar collapses into a top hamburger and panels render full-width.

### 4.2 `/admin` overview (Home)

A dashboard of operational counters, each linking to its source surface:

- Pending pro verifications (count + link to `/admin/verifications`)
- Active jobs (count, today)
- Today's audit events (count + link to `/admin/logs`)
- Open dataroom access requests (count, if any — currently always 0 since access is push-granted)
- Recent admin activity feed (last 10 entries from `audit_logs` filtered to admin-portal actions)

No mutations; pure read aggregation.

### 4.3 `/admin/users`

Read-only index of platform users:

- Server-side paginated list (25/page) with filter chips: role (pro/client/pm/none), created in last (7d/30d/all), email contains.
- Each row: email, name, role, created date, last sign-in (if available from Clerk).
- Click row → detail panel: full user record + "Edit in Clerk" deep link to that user's Clerk dashboard URL.
- Disable button on detail panel (super only) — fires `users.disable`, audit-logged, rate-limited.

No in-app edit of name/email/role. That's Clerk's job and we link out.

### 4.4 `/admin/pros`

Read-only index of all pros:

- Same list/filter/detail pattern as `/admin/users`, with pro-specific columns: trades, hub, verification status, rating.
- Detail panel includes a prominent "Manage in Verifications" link for any pro (verify/reject/suspend all happen there). No mutation buttons on `/admin/pros` itself — this surface is purely read-only.

### 4.5 Hardened existing pages

All five existing admin pages get the same treatment in v1:

- `requireAdminTier("support")` gate at the route level (some require `super` per the matrix in §3.6).
- Mutations on these pages get audit hooks via `@/lib/audit`.
- No other functional changes in v1. Visual polish, new features, and refactors are out of scope here.

Specifically:
- `/admin/access-list` — `requireAdminTier("support")` to view, `requireAdminTier("super")` to grant/revoke. Existing grant/revoke calls already write to audit_logs; no change.
- `/admin/investor-metrics` — `requireAdminTier("super")` (financial-adjacent).
- `/admin/logs` — `requireAdminTier("super")` (PII).
- `/admin/rewards` — `requireAdminTier("support")`.
- `/admin/verifications` — `requireAdminTier("support")` to view, `requireAdminTier("super")` to approve/reject. Existing approve/reject calls already write to audit_logs; no change.

## 5. Implementation phases (one PR each)

### Phase 1 — Auth gate + admin_grants + break-glass

- Drizzle migration: `admin_grants` table with the schema in §3.2.
- New module `src/lib/auth/admin.ts` with `AdminTier` type, `requireAdminTier(min)` helper, `can(tier, action)` checker, full permission matrix from §3.6 in code form.
- New server action `src/lib/auth/admin-grants.ts` implementing the sync-write-then-Clerk pattern from §3.3 and revoke from §3.4.
- New webhook handler at `src/app/api/clerk/webhook/route.ts` (or extend existing if present) to reconcile `admin_grants` from `user.updated` events.
- `src/proxy.ts` updated to: dual-read `sherpa-is-admin` (legacy → `super`) AND `sherpa-admin-tier` (new), 60s cookie max-age, redirect non-admins to their dashboard.
- Break-glass: `BREAK_GLASS_KEY` env var, `/break-glass` endpoint, signed-cookie helper, runbook entry under `docs/operations/`.
- Existing 5 admin pages get `requireAdminTier(...)` per §4.5.
- Test: integration test verifying grant flow end-to-end (DB pending → Clerk mock 200 → DB active), and the failure path (Clerk mock 500 → DB failed).
- Test: `proxy.ts` test verifying legacy cookie still works.

**Acceptance:** Phyrom can sign out, sign back in, and have admin access without manually setting a cookie. The legacy cookie still works for one deploy. A new admin can be granted via a server-action call (no UI yet; CLI script or direct invocation).

### Phase 2 — Audit hardening

- Drizzle migration: create `migrator` and `app` Postgres roles, grant `migrator` ownership, grant `app` `INSERT, SELECT` on `audit_logs`, REVOKE `UPDATE, DELETE` from `app`. Update Vercel `DATABASE_URL` to use the `app` role.
- Startup assertion in `src/lib/db.ts` querying `SELECT current_user` and aborting boot if it returns `migrator` in production.
- CI test in `tests/audit-append-only.test.ts` that connects as the app role and asserts `UPDATE audit_logs SET action = 'x'` raises `permission denied`.
- New `src/lib/audit/scrubber.ts` implementing the value-regex + key-name redaction from §3.7. Wire it into the existing `@/lib/audit` insert path.
- Update `@/lib/audit` to use synchronous write for mutation events and `waitUntil()` for sensitive-read events (`audit.view`, `dataroom.view_grants`, `admin.view_grants`).
- New `AuditAction` enum entries: `admin.granted`, `admin.revoked`, `admin.grant_failed`, `users.disabled`, `pros.suspended`, `break_glass_used`.

**Acceptance:** The `app` role cannot mutate `audit_logs`. The CI test proves it. Existing audit writes continue working through the scrubber (no functional regression).

### Phase 3 — `/admin` shell + overview dashboard

- New layout file `src/app/(dashboard)/admin/layout.tsx` implementing the Stripe-style sidebar from §4.1.
- New page `src/app/(dashboard)/admin/page.tsx` implementing the overview dashboard from §4.2.
- New API route `src/app/api/admin/overview/route.ts` returning the counter + recent-activity payload.
- All existing admin pages now render inside the new shell automatically (App Router layout inheritance).

**Acceptance:** Phyrom navigates to `/admin` and sees the dashboard. Sidebar nav links work. Mobile collapses to hamburger.

### Phase 4 — `/admin/users` read-only index

- New page `src/app/(dashboard)/admin/users/page.tsx` implementing the list per §4.3.
- New API route `src/app/api/admin/users/route.ts` for the paginated list.
- New API route `src/app/api/admin/users/[id]/route.ts` for the detail panel.
- New server action `src/app/api/admin/users/[id]/disable/route.ts` (super only, rate-limited per §3.9, audit-logged). This is the ONLY mutation on the users surface — Clerk's dashboard handles edits.
- Detail panel includes "Edit in Clerk" deep link constructed from the user's Clerk ID.

**Acceptance:** Phyrom lists, filters, paginates users. Clicks one, sees details, clicks "Edit in Clerk" and lands in the right Clerk dashboard URL. Disable button works and the audit row appears.

### Phase 5 — `/admin/pros` read-only index

- Same shape as Phase 4 but for the `pros` table. Lists trades + hub + verification status + rating.
- Detail panel links to `/admin/verifications?id=...` for verify/reject/suspend.
- No mutation buttons on this surface — it is intentionally read-only.

**Acceptance:** Phyrom lists, filters, paginates pros. Clicks any pro and lands on the corresponding `/admin/verifications` row.

### Phase 6 — Synthetic break-glass test + drift cron

- Vercel Cron job hitting `/break-glass` weekly against a preview environment with a seeded test admin, verifying the audit row lands. Failure pings Phyrom.
- Vercel Cron job nightly diffing Clerk admin state vs `admin_grants` active rows. Drift writes an audit event of type `admin_grants.drift_detected` and pings Phyrom.

**Acceptance:** Both crons run, both verify clean. Cron failure or drift produces a notification.

## 6. Testing strategy

- Phase 1: integration test for grant happy path + failure path. Unit test for `can(tier, action)` covering every cell in the matrix.
- Phase 2: CI test for append-only enforcement (the central new invariant). Unit test for scrubber covering each regex and each key-name.
- Phase 3: smoke test that `/admin` returns 200 for an authenticated admin and 302 for a non-admin.
- Phases 4 + 5: integration test for list pagination, detail fetch, and the `users.disable` (Phase 4) and `pros.suspend` (Phase 5 hardening of existing action) rate-limit boundary (5 OK, 6th returns 429).
- Phase 6: test the cron synthetic by triggering it manually in a preview env.

## 7. Deployment + rollback

- Each phase ships as a separate PR. Phase 1's dual-read is merged in the same PR that adds the new auth code; the legacy-cookie removal is a separate small PR after Phyrom confirms his session works on the new code path.
- A simple post-deploy smoke test in CI hits `/admin` (with a test admin token bypass set up via Clerk dev keys in preview env only) and verifies 200. Failure of the smoke test does not auto-rollback in v1; Phyrom is notified and chooses.
- Any PR diffing `src/app/(dashboard)/admin/**` or `src/proxy.ts` requires a checklist line in the PR description acknowledging admin-portal review.

## 8. Risks called out

- **Founder lockout.** Phase 1 cookie cutover is the highest-risk moment. Dual-read mitigates; the legacy-cookie-removal PR happens only after a verified working session on new code. If the dual-read still fails, break-glass is the recovery (Phase 1 ships break-glass alongside auth precisely for this reason).
- **Phantom grant on Clerk failure.** Mitigated by the `pending` → `active` state machine in §3.3. Failed grants are visible in the admin_grants table with a reason; the operator retries explicitly.
- **Audit log drift.** Mitigated by append-only enforcement + nightly reconciliation cron + drift alerts.
- **Stripe context.** No payment surfaces ship in v1. The kill-switch in §3.10 prevents accidental future writes during the appeal.
- **Scope creep during implementation.** Each phase has crisp acceptance criteria. Anything outside the phase definition gets a follow-up PR or a v2 entry in §2.

## 9. Open questions for spec review

- Per-page hardening intent on the existing 5 pages — this spec defaults all five to "auth gate + audit hooks, no other functional change." If Phyrom has specific pain on any page (e.g., investor-metrics needs a specific filter, rewards needs a specific summary), he should call it out before plan-writing so it's scoped in or explicitly deferred.
- Tier names: this spec uses `super` and `support`. If `super` reads as ambiguous with "super-admin" in other systems, `owner` and `staff` is an alternative. Cosmetic; flag if you care.
- Should break-glass require a TOTP code in addition to the env-var key? Adds friction in the worst possible moment but blocks env-var-leak attacks. Default in this spec: no TOTP. Flag if you want it.
