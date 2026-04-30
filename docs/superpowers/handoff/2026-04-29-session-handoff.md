# Session Handoff — 2026-04-29

This is a handoff for the next session. Only documents what actually happened in this session. No speculation.

---

## What shipped today

### PR #1 — `Remove legacy redirect-based Stripe Connect onboarding` (merged)

Removed the pre–Plan 1 redirect-based Stripe Connect onboarding code (`/api/stripe/connect/route.ts`, `connect/callback/route.ts`, `src/components/payments/StripeConnectButton.tsx`). Replaced the `<StripeConnectButton>` usage in `src/app/(dashboard)/pro/payments/page.tsx` with a `<Link>` to the embedded onboarding route at `/pro/onboarding/payouts`. Also fixed a stale `POST /api/stripe/connect` reference in `docs/superpowers/specs/2026-04-25-production-launch-hub-architecture-design.md` (line 139). Build, vitest, lint all clean before merge. Merged via squash.

### PR #2 — `Sweep "escrow" from internal docs and specs` (merged)

37 internal docs scrubbed. ~70 occurrences of "escrow" replaced with context-appropriate alternatives per the saved feedback rule (`feedback_marketplace_not_escrow.md`):

- "escrow" / "Escrow" → "payment protection" / "Payment Protection"
- "Sherpa Escrow" (product name) → "Sherpa Hold"
- Datadog metric names: `escrow_release` → `settlement_release`, `sherpa.escrow.*` → `sherpa.settlement.*`, `escrow.balance_cents` → `settlement.balance_cents`

Two files at `docs/operations/soc2-readiness/07-encryption-policy.md` (lines 65, 113) intentionally preserved their "escrow" references — those are crypto-context (MDM key escrow, commit-signing keys), not payment terms.

Two Important issues caught by the post-merge code review and fixed in a follow-up commit on the same PR before final merge:
- `02-schellman-engagement-rfp.md:22` had a "payment payment protection" duplicate from bulk substitution → reworded to "marketplace settlement"
- `2026-04-25-rbac-roles-dispatch-marketing-design.md:256` had a redundant trailing "payments" → trimmed

### PR #3 — `Plan 2a — Stripe Connect payment capture` (merged)

16 commits implementing the full Plan 2a spec via subagent-driven-development for some tasks and inline execution for the more mechanical tasks. Final test count: 232/232 passing, build clean.

What was built:
- Migration 013 (`payments.stripe_transfer_id` column, `stripe_events_processed` table, partial unique index `uq_payments_pending_per_milestone`)
- Drizzle schema additions
- Query helpers in `src/db/queries/payments.ts` and `src/db/queries/stripe-events.ts` (insertPendingPayment with SQLSTATE 23505 unique-violation handling, transactional `markPaymentHeld`, `getCapturedTotalForJob`, `getAcceptedBidForJob`, `getUserByProId`, plus stubs for `getJob`/`getMilestone`/`getUserById` because the original codebase did not have them)
- `PaymentService` extended with `capturePayment` and `retrievePaymentIntent` on both Stripe and mock implementations
- `runCaptureForMilestone` orchestration helper at `src/lib/payments/capture.ts` with 8 rejection gates, reuse-pending logic, new-PaymentIntent path, race recursion (capped at depth 2)
- Webhook tightening at `src/app/api/stripe/webhook/route.ts`: `STRIPE_WEBHOOK_SECRET` required outside `NODE_ENV=test` (C-4 fix), plus `payment_intent.succeeded` and `payment_intent.payment_failed` handlers
- `<PaymentElementClient>` UI component
- Funding-page Server Component at `src/app/(dashboard)/client/my-jobs/[id]/milestones/[mid]/fund/page.tsx`
- Per-milestone Fund/Funded button on the existing job-detail-content
- Handoff doc at `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md`

Two Important issues from the post-merge code review were fixed before final approval:
- The fund page passed a relative path to `stripe.confirmPayment` — switched to using `NEXT_PUBLIC_APP_URL` to build an absolute URL (matching the existing pattern in other Stripe routes)
- `markPaymentHeld` could silently no-op on a deleted row — added `AND status='pending'` predicate plus a `console.warn` when the UPDATE affects 0 rows

One workaround documented during implementation: the existing `Job` interface in `src/db/types.ts` uses snake_case keys, but Drizzle returns camelCase. The fix was to introduce `JobRow = typeof jobs.$inferSelect` and have `getJob` return that. Logged as Plan 2b followup #11 to unify the legacy `Job` interface in a future cleanup.

### Migration 013 applied

User applied via Neon SQL Editor on the single production Neon branch. The first attempt errored with "column already exists" because the local Neon and the production Neon are the same branch (the user has only one Neon branch). The user re-ran an idempotent version using `IF NOT EXISTS` clauses, which completed cleanly. Verification: 3 ✓ rows for column + table + partial index.

### Stripe live keys deployed (user-driven)

User confirmed all of these are set on Vercel Production:
- `STRIPE_SECRET_KEY` = `sk_live_*`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_*` (after a rename from the original `STRIPE_PUBLISHABLE_KEY`)
- `STRIPE_WEBHOOK_SECRET` = `whsec_*` (live)
- `NEXT_PUBLIC_APP_URL` was needed by the fund page's return-URL fix; set per the PR review

Live webhook destination registered at `https://thesherpapros.com/api/stripe/webhook` listening for `account.updated` (Plan 1 was the only event on file at the time of registration).

### Google OAuth setup (driven via Chrome MCP)

The first sign-in attempt by the user surfaced a Google "Missing required parameter: client_id" error, which led to a series of dashboard configurations driven via the chrome-devtools MCP:

1. Verified the existing OAuth client `Sherpa Pros Production` (`153096647755-5rfu...`) already had the correct authorized redirect URIs (`accounts.thesherpapros.com/v1/oauth_callback` and `clerk.thesherpapros.com/v1/oauth_callback`).
2. Generated a new client secret because Google no longer allows viewing existing secrets ("Viewing and downloading client secrets is no longer available").
3. Pasted the new secret into Clerk's Google SSO connection. Clerk auto-saves on field blur.
4. The new secret leaked into this transcript via Clerk's plaintext rendering of the field after paste.
5. Rotated the leaked secret: deleted secret #1 (`****pi_o`, original, never used), generated secret #3 (`****oeo1`), pasted into Clerk, then deleted the leaked secret #2 (`****Hcu2`).

End state in Google: only `****oeo1` is enabled. The leaked secret string in the transcript is no longer valid.

### PR #4 — `fix(auth): Clerk same-origin proxy` (merged, but incomplete — see Pending below)

Code changes only, on top of `7c93011`:
- `src/proxy.ts`: passed `frontendApiProxy: { enabled: true }` to the existing `clerkMiddleware` call and added `__clerk` to the matcher's API-routes group
- `src/app/layout.tsx`: read `NEXT_PUBLIC_CLERK_PROXY_URL` and pass it to `<ClerkProvider>` as `proxyUrl`

User set `NEXT_PUBLIC_CLERK_PROXY_URL=https://www.thesherpapros.com/__clerk` on Vercel Production (and Preview). The PR was merged.

A separate (correctly diagnosed) earlier attempt at fixing sign-in by replacing `require("@clerk/nextjs")` with a static import was reverted because it broke the production sign-in page (commit `db210e4` reverted by `c910f2d`). The original `require()` pattern is intentionally fragile-but-functional and should be left alone unless we explicitly rework the conditional-import pattern.

---

## What's pending

### 1. Plan 2a end-to-end smoke test — NOT DONE

Plan 2a Task 16 is the manual smoke test. It was never executed. The user could not get past sign-in in incognito/private browsers tonight (see the Clerk proxy section below for why). The smoke test still needs:

- Sign in to the app (any browser that can establish a session)
- Manually seed a milestone in production Neon: `INSERT INTO job_milestones (job_id, title, amount_cents, sort_order, status) VALUES ('<jobId>', 'Smoke test', 2500, 0, 'pending')` — Trigger 1 (auto-redirect after bid-accept) is still on the deferred-followups list because the bid-accept lifecycle is mocked
- Navigate to `/client/my-jobs/<jobId>/milestones/<milestoneId>/fund`, click Fund, pay $25 with a real card
- Verify in DB: `payments.status='held'`, `held_at` set, `stripe_payment_intent_id` populated; `job_milestones.status='funded'`; row in `stripe_events_processed` for the event_id
- Test the failure path with Stripe's `4000 0000 0000 0002` (decline) — row should be deleted via the `payment_intent.payment_failed` handler
- Refund the $25 in the Stripe Dashboard

### 2. Clerk same-origin proxy — Dashboard side incomplete

The code is live (PR #4 merged + Vercel env var set). What is NOT done:

- Clerk Dashboard's "Set proxy configuration" was attempted with `__clerk/` and rejected by Clerk's pre-save validation with "Clerk Frontend API cannot be accessed through the proxy URL." The proxy IS forwarding (apex and www both return HTTP 400 with `host_invalid` when fetching `/__clerk/v1/environment` directly, which means the route exists and reaches Clerk's API).
- The chicken-and-egg: Clerk's Dashboard validation tries to verify the proxy works before saving. The proxy can only return a non-error response from Clerk's API once the proxy URL is registered with Clerk. So the validation rejects.
- A second issue surfaced: Clerk's primary domain in the Dashboard is `thesherpapros.com` (no www), and the "Set proxy configuration" dialog hardcodes `https://thesherpapros.com/` as the prefix. The user-facing canonical URL is `https://www.thesherpapros.com/`. The Vercel env var was set to the www variant. This means the `Clerk-Proxy-Url` header sent by the middleware does not match what would be registered if we used the Dashboard dialog as-is.

What still needs to be decided:

- Either change Clerk's primary domain to `www.thesherpapros.com` (the Dashboard warns "Changing the domain will result in downtime" — the practical impact was not researched)
- Or set the env var to the apex URL and accept that browsers viewing `www.thesherpapros.com` make cross-origin AJAX to apex (which would still need CORS or a Vercel www→apex redirect to clean up)
- Or find an alternative route — for example, registering the proxy URL via Clerk's Backend API instead of the Dashboard dialog (not investigated)

Until the Dashboard side is registered, ClerkJS in the browser falls back to using `clerk.thesherpapros.com` directly (because the env var alone does not change anything until Clerk attributes the proxy request to the instance — the env var causes ClerkJS to send requests through the proxy, which then return `host_invalid`). So sign-in in privacy browsers is still blocked. Sign-in in non-incognito browsers should still work (cookies not blocked, ClerkJS communication is unaffected).

### 3. The leaked Google OAuth secret in this transcript

The string `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` appears in this conversation transcript. It has been **deleted in Google Cloud Console** and replaced with the new secret `****oeo1` which is now in Clerk. The leaked string can no longer authenticate against Google's API. No further action required, but worth noting in case the transcript is ever reviewed.

### 4. Plan 2b (release path) — separate followup, already documented

The handoff at `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md` covers Plan 2b scope and Plan 2a deferred followups. Nothing new to add tonight.

---

## Repo state at session end

- Branch `main` at commit `7c93011` (PR #4 merge commit)
- Vercel: latest deploy succeeded (verified earlier in the session via curl HEAD checks)
- Database: migration 013 applied to the production Neon branch
- Worktrees: `.worktrees/plan-2a-payment-capture` was removed during PR #3 cleanup
- All feature branches (`cleanup-legacy-stripe-routes`, `internal-docs-escrow-sweep`, `plan-2a-payment-capture`, `feat/clerk-same-origin-proxy`) deleted from origin and locally

---

## What I recommend the next session does first

1. **Run the Plan 2a smoke test** in a non-incognito browser (Brave normal with Shields disabled for thesherpapros.com, or regular Chrome). Email/password works for sign-in if the user is on the access list. Once a session exists, navigate to a job, seed a milestone via psql if needed, click Fund, run a real $25 transaction, refund. This was the actual mission today and it never got executed.
2. **Then tackle the Clerk proxy completion** with a fresh head. The decision tree:
   - Change Clerk primary domain to www (Dashboard → Domains → Danger zone → Change domain) and accept whatever brief downtime that causes; then register `__clerk/` cleanly; env var already matches
   - Or use Clerk's Backend API to set the proxy URL programmatically and skip the Dashboard validation
   - Or add Vercel www→apex redirect, change env var to apex, register apex proxy URL
3. After proxy is registered + working, verify sign-in succeeds in Brave incognito and Chrome incognito with 3PCP enabled. That closes the privacy-browser gap.

---

## Things to be careful about next session

- The `require("@clerk/nextjs")` pattern in `layout.tsx`, `sign-in/page.tsx`, and `sign-up/page.tsx` is intentional. It is fragile but it ships. Replacing it with static imports broke production once today (commit `db210e4` reverted by `c910f2d`). Do not "clean it up" without testing.
- `DATABASE_URL` in `.env.local` has a literal `\n` (backslash-n, two chars) at the end of the value. Parsing it with shell variable expansion drops a real newline; sourcing it with `source .env.local` produces `sslmode=require\n` which `psql` rejects. The working incantation discovered tonight is `awk -F= '/^DATABASE_URL=/ {sub(/^DATABASE_URL=/, ""); gsub(/[\r\n"]/, ""); sub(/\\n$/, ""); print; exit}' .env.local`.
- Local Neon `DATABASE_URL` and production Neon `DATABASE_URL` point to the same branch — the user has only one Neon branch. Any local `psql` command against `DATABASE_URL` operates on production data. Be aware before running anything destructive.
- The `Job` interface vs Drizzle `JobRow` mismatch was worked around by introducing `JobRow` for the Plan 2a code path. Other parts of the codebase still use the legacy `Job` interface. A unification pass is on the deferred list (Plan 2b followup #11) but may surface other type errors if attempted.
- Three things were done in MCP-driven Chrome that affect production state and should not be redone if the next session continues:
  - Google OAuth Client `153096647755-5rfu...` had its `****pi_o` and `****Hcu2` secrets deleted; only `****oeo1` is enabled
  - Clerk's Google SSO connection has the new secret set
  - Vercel env vars are all set (per user confirmation)
