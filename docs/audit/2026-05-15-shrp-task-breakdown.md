# SHRP Task Breakdown · Regenerated 2026-05-15

> Companion to `2026-05-15-provenance-sweep.md`. The structured task list that lives WITH the Epic taxonomy. Re-derived from the 11 high-signal source files after the prior session's breakdown was lost at ~74% context.

---

## E1 · Launch blockers

> Already filed: **SHRP-1** (Resend domain verification for thesherpapros.com) and **SHRP-2** (Build 12 · Submit for Review in App Store Connect). Tasks below cover the remaining E1 items.

### T-E1-1 · Tester SIWA enablement — collect Apple IDs and INSERT into access_list
- **Severity:** P1
- **Source:** `docs/HANDOFF.md:47-56`, `handoff.md:28`, `.mnemos-state.json:13-17`
- **Description:** For testers who want to use Sign in with Apple, collect the Apple ID email from their consent sheet and INSERT into `access_list` via the SQL pattern documented in HANDOFF.md. Without this, SIWA fails for testers whose iCloud email differs from their invite email. Beta-blocking only for the SIWA cohort.

### T-E1-2 · Revert FROM_ADDRESS to invite@thesherpapros.com once Resend DNS verifies
- **Severity:** P0
- **Source:** `handoff.md:26`, `docs/HANDOFF.md:37`
- **Description:** One-line change in `src/lib/auth/email-sender.ts` to switch `FROM_ADDRESS` from the `onboarding@resend.dev` workaround back to `Sherpa Pros <invite@thesherpapros.com>`. Gated on SHRP-1 (DNS verification) completing.

### T-E1-3 · Web fail-closed — confirm `isEmailAllowedAsync` no longer falls through to fixture in prod
- **Severity:** P0
- **Source:** `docs/HANDOFF.md:67`, `.mnemos-state.json:53`
- **Description:** Verification task. The fix shipped in Build 11 commit cluster; confirm via test + manual check that `isEmailAllowedAsync` + `getAccessEntryAsync` in `src/lib/access-list.ts` cannot return the hardcoded fixture in production. Closes a footgun in the Google OAuth callback.

### T-E1-4 · Cookie Secure flag on https sign-in
- **Severity:** P1
- **Source:** `docs/HANDOFF.md:68`
- **Description:** Already implemented in Build 11. File a verification ticket confirming the sign-in cookie sets the `Secure` flag in production.

### T-E1-5 · `updateLastSignIn` parity on email check-email path
- **Severity:** P2
- **Source:** `docs/HANDOFF.md:69`
- **Description:** Already implemented — confirm `updateLastSignIn` fires on the email magic-code path (previously only on Google OAuth). Verification ticket.

### T-E1-6 · Clerk same-origin proxy re-enable plan for privacy browsers
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-30-session-handoff.md:167-176`, `docs/superpowers/handoff/2026-04-29-session-handoff.md:100-114`
- **Description:** Proxy was reverted to unblock sign-in. Sign-in still fails for Brave Shields / Safari ITP / Chrome incognito with 3PCP. Decision tree: (a) change Clerk primary domain to www, (b) Vercel www→apex redirect + register apex proxy URL, or (c) use Clerk Backend API. Defer if no privacy-browser users complain.

### T-E1-7 · Cookie ↔ publicMetadata sync gap on fresh devices
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-30-session-handoff.md:152-157`, TODO in `src/app/(auth)/select-role/actions.ts:24`
- **Description:** Returning users on new devices hit `/select-role` once because `enforceRBAC` reads the `sherpa-role` cookie but Clerk publicMetadata has the answer. Add lazy backfill in `src/proxy.ts` — read `sessionClaims.metadata.role` and write cookie if missing. ~30-60 min plus a test.

---

## E2 · MVP data scoping

### T-E2-1 · Pro job detail — scope materials/photos/checklist to a single job
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:4`, `.mnemos-state.json:41`, `handoff.md:29`
- **Description:** Replace global mock data with `WHERE job_id = ?` filters so a Pro only sees materials, photos, and checklist for the specific job they're viewing. Pre-launch closed-beta blocker once real DB is connected.

### T-E2-2 · Client job detail — scope bids and assigned pro to a single job
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:5`, `.mnemos-state.json:42`
- **Description:** Client job detail page must only return bids and the assigned pro that belong to that specific `job_id`. Replace mock data filters with real query helpers.

### T-E2-3 · Messages — filter conversations by user role and related jobs
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:6`, `.mnemos-state.json:43`
- **Description:** Conversation list must be scoped to the logged-in user (client or pro) AND to jobs they participate in. No cross-user thread leakage.

### T-E2-4 · Earnings — filter transactions/invoices by logged-in pro
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:7`, `.mnemos-state.json:44`
- **Description:** `/pro/earnings` and underlying API routes must return only the logged-in pro's transactions and invoices. Replace mock-data filter with `WHERE pro_id = currentUser.id`.

### T-E2-5 · Reviews — filter by reviewer/reviewee relationship
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:8`, `.mnemos-state.json:45`
- **Description:** Reviews surface must respect reviewer/reviewee scoping — a pro sees reviews left for them; a client sees reviews they wrote and reviews of pros they considered.

### T-E2-6 · Portfolio — filter by pro ID
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:9`, `.mnemos-state.json:46`
- **Description:** Portfolio page must show only that pro's items (`WHERE pro_id = ?`), not the global mock-data pool.

### T-E2-7 · Quote — filter by job_id + pro_id
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:10`, `.mnemos-state.json:47`
- **Description:** Quote views must be double-scoped — the quote belongs to a specific job AND a specific pro. Prevents cross-pro quote viewing.

### T-E2-8 · API routes validate user ID on all queries
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:13`, `.mnemos-state.json:48`
- **Description:** Every API route in `src/app/api/**` must enforce `auth + ownership` — verify the authenticated user owns the resource being queried. Audit pass across all routes.

### T-E2-9 · Pro RBAC scoping — only own jobs/earnings/quotes
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:14`
- **Description:** Pro role can only see their own jobs, earnings, quotes. Add role guards to relevant API + page routes.

### T-E2-10 · Client RBAC scoping — only own jobs/bids/invoices
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:15`
- **Description:** Client role can only see their own jobs, bids on those jobs, and resulting invoices. Mirror of T-E2-9.

### T-E2-11 · Admin RBAC — admin can see everything
- **Severity:** P1
- **Source:** `docs/TODO-MVP-FIXES.md:16`
- **Description:** Admin role must bypass per-user scoping for support and ops. Ensure the admin role check exists in middleware and selectively skips ownership predicates.

### T-E2-12 · Data relationships — enforce Job has many Bids
- **Severity:** P1
- **Source:** `docs/TODO-MVP-FIXES.md:19`
- **Description:** Confirm the schema and queries reflect that each Job has many Bids, each Bid belongs to one Pro. Add referential integrity tests.

### T-E2-13 · Data relationships — one assigned Pro per Job after bid accept
- **Severity:** P1
- **Source:** `docs/TODO-MVP-FIXES.md:20`
- **Description:** After a bid is accepted, the Job gets exactly one `assigned_pro_id`. Add the column if missing; enforce via the bid-accept lifecycle (currently mocked — see plan-2b-prep.md followup #1).

### T-E2-14 · Data relationships — one Checklist per Job
- **Severity:** P1
- **Source:** `docs/TODO-MVP-FIXES.md:21`
- **Description:** Checklist is generated on bid accept and belongs to exactly one Job. Schema + dispatch lifecycle.

### T-E2-15 · Data relationships — Job has one Materials List with many Items
- **Severity:** P1
- **Source:** `docs/TODO-MVP-FIXES.md:22`
- **Description:** Materials list parent + child Items rows. Validate against current Drizzle schema; add migration if missing.

### T-E2-16 · Data relationships — Job has one Quote from assigned Pro
- **Severity:** P1
- **Source:** `docs/TODO-MVP-FIXES.md:23`
- **Description:** Quote is single-source-of-truth per job, owned by the assigned pro. Constraint + UI enforcement.

### T-E2-17 · Data relationships — Messages between client + assigned pro only
- **Severity:** P1
- **Source:** `docs/TODO-MVP-FIXES.md:24`
- **Description:** Chat threads on a Job permit only the client and the currently-assigned pro. Mid-job pro reassignment edge case to think through.

### T-E2-18 · Pro entity relationships — has many Jobs, Bids, Reviews, Portfolio
- **Severity:** P2
- **Source:** `docs/TODO-MVP-FIXES.md:25`
- **Description:** Verification ticket — confirm Drizzle schema reflects all four "has many" relationships on the Pro entity.

### T-E2-19 · Client entity relationships — has many Jobs, Properties, Reviews given
- **Severity:** P2
- **Source:** `docs/TODO-MVP-FIXES.md:26`
- **Description:** Verification ticket — confirm Drizzle schema reflects all three "has many" relationships on the Client entity.

### T-E2-20 · Replace ALL mock data filters with real WHERE clauses (umbrella)
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:29`, `handoff.md:29`, `.mnemos-state.json:49`
- **Description:** Umbrella task tracking the systematic replacement of `src/lib/mock-data/*` filter logic with real DB queries once production Neon is wired through. Pairs with T-E2-1..T-E2-7.

### T-E2-21 · No cross-user data leakage — final audit
- **Severity:** P0
- **Source:** `docs/TODO-MVP-FIXES.md:31`
- **Description:** End-of-MVP audit pass: log in as each role, attempt to access another user's resources, confirm 403. Manual + automated test pass.

---

## E3 · Build pipeline / release management

### T-E3-1 · Set up GitHub Actions TestFlight rotation workflow
- **Severity:** P1
- **Source:** `docs/app-store-launch-runbook.md:297-402`
- **Description:** Create `.github/workflows/eas-build-rotation.yml` with cron `0 9 1 */2 *` (every other month) that runs `eas build` + `eas submit` for iOS production. Removes the 60-day human-rotation single point of failure. Includes secret setup for `EXPO_TOKEN`, `APPLE_API_KEY_ID`, `APPLE_API_ISSUER_ID`, `APPLE_API_KEY`.

### T-E3-2 · Generate App Store Connect API key + register in GitHub secrets
- **Severity:** P1
- **Source:** `docs/app-store-launch-runbook.md:385-392`, `docs/app-store-launch-runbook.md:567-585`
- **Description:** Generate App Store Connect API Key (Admin or App Manager role) at App Store Connect → Users and Access → Integrations. Save the .p8, Key ID, Issuer ID. Add as GitHub repo secrets. Required by T-E3-1.

### T-E3-3 · Set up Expo access token for rotation workflow
- **Severity:** P1
- **Source:** `docs/app-store-launch-runbook.md:387`
- **Description:** Generate Expo access token (https://expo.dev/.../settings/access-tokens) named `github-actions-rotation`. Add as `EXPO_TOKEN` GitHub secret.

### T-E3-4 · Fallback calendar reminder for manual TestFlight rotation
- **Severity:** P2
- **Source:** `docs/app-store-launch-runbook.md:275-296`
- **Description:** Set a recurring 60-day calendar reminder (Google/Apple Calendar) with the build+submit commands. Backup for T-E3-1 in case the cron fails or is removed.

### T-E3-5 · Establish CHANGELOG.md pattern at mobile/CHANGELOG.md
- **Severity:** P1
- **Source:** `docs/app-store-launch-runbook.md:471-494`
- **Description:** Create `mobile/CHANGELOG.md` in Keep-a-Changelog format with sections per version. Source-of-truth for "What to Test" in TestFlight and What's New in the App Store.

### T-E3-6 · Document semver bump policy in CHANGELOG / runbook
- **Severity:** P2
- **Source:** `docs/app-store-launch-runbook.md:431-468`
- **Description:** Document when to bump `expo.version` patch/minor/major (already in runbook §4). Cross-link from CONTRIBUTING.md or CLAUDE.md so new contributors hit it.

### T-E3-7 · Configure Phased Release for App Store v1.0.0 submission
- **Severity:** P1
- **Source:** `docs/app-store-launch-runbook.md:251-260`, `docs/app-store-submission.md:328-329`
- **Description:** When submitting v1.0.0 to the App Store proper, choose Phased Release for automatic updates (1% → 100% over 7 days). Set in App Store Connect → version → Version Release.

### T-E3-8 · Move backend tests out of src/__tests__/ to repo-root __tests__/
- **Severity:** P2
- **Source:** `docs/HANDOFF.md:124`
- **Description:** Next.js bundles `src/__tests__/` into `_not-found`, which is the reason `.vercelignore` exists. Hygiene: move tests to repo root `__tests__/` so the exclusion patch is no longer needed.

### T-E3-9 · Maintain .vercelignore exclusions
- **Severity:** P2
- **Source:** `docs/HANDOFF.md:91-92`
- **Description:** `.vercelignore` was added to fix 20K-files / 445MB function bundle bloat. Keep `.claude/`, `.worktrees/`, `mobile/`, `docs/superpowers/`, test files, `*.csv` excluded. Until T-E3-8 lands, document the rationale inline.

### T-E3-10 · Vercel build cache awareness — new env vars require a new build
- **Severity:** P2
- **Source:** `docs/HANDOFF.md:131`
- **Description:** Document (in CLAUDE.md or operational README) that `vercel env add` after deploy requires a new build (push commit or Redeploy with "Use existing Build Cache" UNCHECKED).

### T-E3-11 · Document Vercel CLI deploy gotcha (uploads local state)
- **Severity:** P2
- **Source:** `docs/HANDOFF.md:132`
- **Description:** `vercel --prod` from CLI uploads working dir including untracked stuff. Document this and the `.vercelignore` mitigation in operational README.

---

## E4 · Auth & access

### T-E4-1 · Apple SIWA — implement claim-flow using `sub` claim (Option C)
- **Severity:** P1
- **Source:** `docs/HANDOFF.md:126`
- **Description:** Lets any Apple ID claim an existing access_list row by entering invite email + verifying via OTP. Eliminates per-tester Apple ID admin work. Cross-references T-E1-1 — long-term replacement for that manual flow.

### T-E4-2 · Web Apple OAuth callback — fix bugs or remove
- **Severity:** P1
- **Source:** `docs/HANDOFF.md:127`
- **Description:** `/api/auth/apple/callback` currently returns 503 (disabled). Either fix the unfixed bugs and ship, or remove the disabled route entirely.

### T-E4-3 · SIWA — re-verify identityToken signatures against Apple JWKS
- **Severity:** P1
- **Source:** `docs/HANDOFF.md:128`
- **Description:** Mobile SIWA backend is currently decode-only — beta-acceptable but should harden pre-public. Add JWKS signature verification against https://appleid.apple.com/auth/keys before public launch.

### T-E4-4 · Remove diagnostic endpoint /api/admin/env-check before public launch
- **Severity:** P0
- **Source:** `docs/HANDOFF.md:85-87`, `docs/HANDOFF.md:125`
- **Description:** `GET /api/admin/env-check?debug=1` returns boolean presence of env vars. TEMPORARY for debugging Resend. Must be removed before the App Store version goes public.

### T-E4-5 · Remove diagnostic endpoint /api/admin/resend-check before public launch
- **Severity:** P0
- **Source:** `docs/HANDOFF.md:88`, `docs/HANDOFF.md:125`
- **Description:** `GET /api/admin/resend-check?debug=1&to=…&from=…` calls Resend directly. TEMPORARY. Must be removed before public launch.

### T-E4-6 · Clerk Dashboard proxy registration once domain decision is made
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-29-session-handoff.md:100-114`
- **Description:** When T-E1-6 picks a path, complete the Clerk Dashboard side by registering the proxy URL (Dashboard or Backend API). Until done, the privacy-browser gap remains.

### T-E4-7 · Email OTP — confirm rate-limit + lock-after-5 in production
- **Severity:** P1
- **Source:** `docs/HANDOFF.md:74-80`, `.mnemos-state.json:34`
- **Description:** Verification ticket — confirm in production that the 5/email/hour rate limit and code-lock-after-5-wrong-attempts policies fire. Tied to D-010 in `.mnemos-state.json`.

### T-E4-8 · Email OTP — 10-min expiry verification
- **Severity:** P2
- **Source:** `docs/HANDOFF.md:79`, `.mnemos-state.json:34`
- **Description:** Verification ticket — confirm code TTL is exactly 10 minutes via integration test on production data path.

### T-E4-9 · Clear out 16 @test.com revoked rows from access_list (housekeeping)
- **Severity:** P2
- **Source:** `docs/HANDOFF.md:93`, `docs/HANDOFF.md:118`
- **Description:** 16 `@test.com` rows were soft-deleted (`status='revoked'`). Decide whether to keep for audit history or hard-delete. Either way, document the decision.

---

## E5 · Marketplace functionality

### T-E5-1 · Plan 2b · Implement `PaymentService.releasePayout`
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:15`
- **Description:** Call `stripe.transfers.create({ amount, currency:'usd', destination: pro_acct_id, transfer_group: jobId, metadata })`. Natural extension of `PaymentService.capturePayment` shipped in Plan 2a.

### T-E5-2 · Plan 2b · Release entry point — Server Action or POST /api/payments/release
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:16`
- **Description:** Implement the release trigger with gating — only platform admin or client can trigger; only when milestone status is `completed`.

### T-E5-3 · Plan 2b · Commission application — split 8-18% off top per pro tier
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:17`
- **Description:** Apply commission at transfer time per the existing commission engine. Tier read at transfer time. See `src/lib/payments/commission.ts`.

### T-E5-4 · Plan 2b · Webhook handler — transfer.created
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:19`
- **Description:** Set `payments.status='released'`, `released_at=NOW()`, advance `job_milestones.status='released'`.

### T-E5-5 · Plan 2b · Webhook handler — charge.dispute.created
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:20`
- **Description:** Flag `payments.status='disputed'` and surface in admin disputes queue (ties to T-E7-1).

### T-E5-6 · Plan 2b · Webhook handler — payout.failed
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:21`
- **Description:** Alert ops; pro's bank account problem. Wire to existing alert channel.

### T-E5-7 · Plan 2b · Pro payout dashboard wired to real Stripe balance
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:22`
- **Description:** `/pro/payments` shows mock balance cards today; wire to real Stripe balance via `accounts.retrieve` or `balance.retrieve` on connected account.

### T-E5-8 · Plan 2b · Admin tooling for stuck funds (manual refund trigger)
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:23`
- **Description:** I-5 from the Plan 2a spec. Manual refund trigger for restricted or disabled pros. Admin-only, audit-logged.

### T-E5-9 · Plan 2a followup · Trigger 1 (auto-redirect after bid-accept) — real implementation
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:27-30`
- **Description:** `src/lib/services/job-lifecycle.ts:onBidAccepted` is mocked. Real version: UPDATE `bids.status='accepted'`, INSERT `job_milestones` rows from checklist phases, redirect to `/client/my-jobs/[jobId]/milestones/[firstMilestoneId]/fund`.

### T-E5-10 · Plan 2a followup · Wire job-detail-content to real DB data
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:31-32`
- **Description:** Currently uses mock `getJobById`. The Fund/Funded buttons added in Task 15 are conditional on real schema statuses (`pending`/`funded`) which mock data doesn't produce. Switching to real DB activates the buttons.

### T-E5-11 · Plan 2a followup · Vercel cron — clean up stale pending payments >24h
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:33`
- **Description:** Stripe PaymentIntent TTL is 24h. Add Vercel cron that purges stale `payments.status='pending'` rows older than that.

### T-E5-12 · Plan 2a followup · TTL on stripe_events_processed (purge >30 days)
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:34`
- **Description:** Stripe doesn't retry past 7 days. Purge processed events older than 30 days to control table growth.

### T-E5-13 · Plan 2a followup · Postgres advisory lock on jobId during cap-check + INSERT
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:35`
- **Description:** Full cross-milestone race correctness. Beta accepts the race; tighten before scale.

### T-E5-14 · Plan 2a followup · Saved cards for repeat clients (SetupIntent + Customer)
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:36`
- **Description:** Use SetupIntent + Stripe Customer + off-session charges for repeat funding. Reduces re-entry friction post-MVP.

### T-E5-15 · Plan 2a followup · Apple Pay / Google Pay / Link via automatic_payment_methods
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:37`
- **Description:** Enable Apple Pay / Google Pay / Link once live mode rolls out and Stripe Dashboard payment-method config is verified.

### T-E5-16 · Plan 2a followup · Granular bid-accept gate (block unverified pros)
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:38`
- **Description:** Currently the verification gate is at fund-time. Move (or duplicate) gate to bid-accept so clients can't even accept bids from unverified pros.

### T-E5-17 · Plan 2a followup · Receipt emails via PaymentIntent.receipt_email
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:39`
- **Description:** Add `receipt_email: clientEmail` when creating PaymentIntents so Stripe auto-sends receipts.

### T-E5-18 · Plan 2a followup · 3DS / SCA challenge UX in PWA mode
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:40`
- **Description:** US consumer cards rarely hit 3DS, so only address if real customers report friction. Track in backlog.

### T-E5-19 · Plan 2a followup · Unify legacy Job interface vs JobRow type
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md:41`, `docs/superpowers/handoff/2026-04-29-session-handoff.md:47`
- **Description:** `src/db/types.ts` has snake_case `Job`; Drizzle returns camelCase `JobRow`. Plan 2a worked around with a parallel type; unify in a cleanup pass.

### T-E5-20 · Plan 2a smoke test — end-to-end fund + refund
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-29-session-handoff.md:89-98`, `docs/superpowers/handoff/2026-04-30-session-handoff.md:182`
- **Description:** Task 16 of Plan 2a, deferred two sessions. Sign in, seed a milestone, navigate to `/client/my-jobs/<jobId>/milestones/<mid>/fund`, run a real $25 transaction, refund. Verifies the full live-mode capture path.

---

## E6 · GTM & business

### T-E6-1 · Fundraising deck — finalize sherpa-pros-deck-v1.md
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:584`, `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:365-366`
- **Description:** 10-slide investor deck draft exists. Phyrom voice pass + brand-audit checklist + verify numbers against `tam-sam-som.md`. Required by every T6 VC conversation.

### T-E6-2 · One-pager — finalize sherpa-pros-onepager-v1.md
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:585`
- **Description:** Exec one-pager exists. Phyrom voice pass + brand-audit. Used in cold investor + accelerator submissions.

### T-E6-3 · Data room — build out for due diligence
- **Severity:** P1
- **Source:** Implied by E6 epic theme, `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:402-417` (VC pipeline assumes data room exists)
- **Description:** Organize cap table PDF, financials, deck, one-pager, competitive analysis, TAM/SAM/SOM, brand audit into a shareable data room (e.g., DocSend or Notion). Required once VC term-sheet conversations open.

### T-E6-4 · Founder video shot on NH jobsite
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:191-193`, `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:565`
- **Description:** Required for Suffolk, Techstars, YC, Greentown accelerator applications. Phyrom on a real NH jobsite explaining the platform.

### T-E6-5 · Founder professional headshot
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:566`
- **Description:** ~$300 with an NH photographer. Used in deck, press kit, LinkedIn.

### T-E6-6 · Demo video — full-flow product walkthrough
- **Severity:** P2
- **Source:** Implied by E6 epic theme; `docs/app-store-submission.md:329` (screen recording of funding flow ready to send if Apple asks)
- **Description:** Screen-recorded full flow: post job → bids → accept → fund → message → release. Used in App Store appeals, demo days, deck-supplement asks.

### T-E6-7 · Advisor pipeline — identify and onboard 3-5 advisors
- **Severity:** P2
- **Source:** Implied by E6 epic theme + `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:392-395` (warm-intro pathways)
- **Description:** Construction industry / fintech / marketplace ops advisors. Each gets a 0.25-1% advisor SAFE or shares. Track in `docs/fundraising/advisors/`.

### T-E6-8 · NH BFA microloan + Innovation Voucher grant submission
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:121`
- **Description:** Rolling, easiest, ~30-day approval. Highest-ROI grant to submit first.

### T-E6-9 · MA SBTA via nonprofit partner — submit
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:122`
- **Description:** After Phyrom picks the partner — Asian American Civic Association recommended over BECMA.

### T-E6-10 · MassDev Biz-M-Power application in parallel with Wefunder
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:123`, `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:261`
- **Description:** File BEFORE Wefunder closes so $50K state match is captured.

### T-E6-11 · NSF SBIR Phase I — Project Pitch then full proposal
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:124`
- **Description:** Requires SAM.gov + Research.gov registration first (Phyrom personal action item).

### T-E6-12 · MassCEC Catalyst — confirm cycle dates and submit
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:125`
- **Description:** Next round; verify dates with masscec.com.

### T-E6-13 · MassCEC InnovateMass — submit next round
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:126`
- **Description:** Verify next round dates and submit.

### T-E6-14 · Y Combinator application
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:172`
- **Description:** Rolling, shortest application, highest brand-halo. Submit Week 1.

### T-E6-15 · Suffolk Technologies (Boston Built Environment) application
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:173`
- **Description:** Bullseye fit. Mentors include Suffolk Construction execs. Submit Week 1.

### T-E6-16 · MassChallenge application
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:174`
- **Description:** Zero equity, up to $1M cash prize, MA-impact thesis fit. Submit Week 1-2.

### T-E6-17 · Techstars ConstructionTech application
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:175`
- **Description:** Vertical-specific, $220K @ 5%. Submit Week 2.

### T-E6-18 · Greentown Labs membership inquiry → application
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:176`
- **Description:** Membership inquiry first, then formal app. Week 2-3.

### T-E6-19 · Wefunder pre-launch list build (target 100+ interested)
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:229-234`
- **Description:** HJD client network + beta pros + local press readers. Track at `docs/fundraising/wefunder/prelaunch-list.md`.

### T-E6-20 · Wefunder page setup + submit for compliance review
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:236-240`
- **Description:** Edit FAQ + page-content; build the page in Wefunder admin; submit for compliance review (5-10 business days). Lock SAFE terms per attorney review.

### T-E6-21 · Wefunder soft-launch (private, target $100K soft-committed)
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:243-246`
- **Description:** Activate Wefunder page in private mode, share with pre-launch list, drive to $100K+ soft-commit before public flip.

### T-E6-22 · Wefunder public launch + PR push
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:248-252`
- **Description:** Flip page to public at $100K+ soft-committed. Execute `pr-launch-plan.md`: press release, podcast pitches, social. Banker & Tradesman newsjack.

### T-E6-23 · Wefunder W12 close — drive to $250K+
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:254-256`
- **Description:** Daily LinkedIn cadence + weekly investor updates. Close Reg CF campaign at W12 (90-day max).

### T-E6-24 · Building Ventures warm intro (top-priority VC outreach)
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:373-378`
- **Description:** Path: NHHBA → MA AGC → Suffolk Construction → Building Ventures via BOOST. Phyrom sends warm-intro request. Cold backup if no path in 2 weeks.

### T-E6-25 · Tier 0 angel checks — 5+ at $25K-$150K each by W4
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:380-384`
- **Description:** HJD network high-net-worth GCs/developers + NHHBA + MEHBA board members. Coordinate with Wefunder soft-commit lead investors.

### T-E6-26 · National Grid Partners (CVC) — pursue via NextGrid Alliance
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:396-401`
- **Description:** Lisa Lambert at National Grid Partners. Entry path NextGrid Alliance (100-member network). $1M-$1.5M strategic target. Pitch: Mass Save heat-pump installer wait times.

### T-E6-27 · LinkedIn editorial cadence — 3x/week posting from existing 39-post calendar
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:296-302`
- **Description:** Pull posts from `docs/marketing/linkedin-editorial.md`, Phyrom voice-pass, post Mon/Wed/Fri. Save published copies to `docs/marketing/posted/`.

### T-E6-28 · Supply-house flyer distribution (20 supply houses)
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:304-308`
- **Description:** FW Webb, Lowe's Pro Desk, Rockler, Best Tile, Riverhead. Track at `docs/marketing/supply-house-distribution.md`.

### T-E6-29 · NHHBA + MEHBA partnership outreach
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:310-314`
- **Description:** Identify ED + board chair at each. Pitch: "free Founding Pro for any member." Target featured-newsletter + meeting-table + intro to top 10 active members.

### T-E6-30 · Beta cohort pro recruiting — 15+ pros (10-12 Project + 4-5 Quick Job)
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:320-333`
- **Description:** Cohort target revised 10+ → 15+ per Quick Job lane amendment. Track at `docs/operations/beta-cohort-pipeline.md`. HJD warm leads + trade-association double-dip.

---

## E7 · Operations runbooks

### T-E7-1 · Insurance Certificate Tracking — pro_insurance_certificates table + nightly expiry job
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:75` (Task A8)
- **Description:** Add `pro_insurance_certificates` table (migration 006), nightly expiry-check background job, Insurance tab on pro profile, real-time COI check at job acceptance (block if expired), Concierge admin view with 60/30/7-day alerts.

### T-E7-2 · Dispute Resolution Workflow — disputes table + /api/disputes + admin queue
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:76` (Task A9)
- **Description:** Add `disputes` table, `/api/disputes` GET/POST/PUT routes, in-app dispute form on job-completion + 30-day post-completion access, `/admin/disputes` Concierge view with triage queue + Track A (quality) + Track B (safety) per liability framework §7.

### T-E7-3 · Insurance verification API integration prep
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:77` (Task A10)
- **Description:** Phase 0 = manual COI upload + Phase 1 = automated (Trust Layer / Evident / Certificial). Build clean abstraction in `src/lib/insurance/verify.ts` so Phase 1 swap is trivial.

### T-E7-4 · Publish /support page (required for App Store submission)
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:166-178`, `docs/app-store-launch-runbook.md:196`
- **Description:** Apple rejects 404 support URLs. Build minimum-viable page with: how to reach us (info@thesherpapros.com, 24h SLA), 3-4 FAQ entries, beta status disclaimer, links to `/install` and `/sign-in`. Must NOT be `mailto:`.

### T-E7-5 · Publish /privacy policy page (required for App Store + Stripe Connect)
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:179-203`, `docs/stripe-connect-platform-setup.md:91-94`
- **Description:** Apple AND Stripe Connect both reject if missing. Outline already in `docs/app-store-submission.md` §3 — drop into Termly/Iubenda then humanize, or have lawyer review. Cover: who we are, what we collect, how we use, third parties, user rights, children, contact.

### T-E7-6 · Publish /terms (Terms of Service) page (required for Stripe Connect)
- **Severity:** P0
- **Source:** `docs/stripe-connect-platform-setup.md:92-94`
- **Description:** Stripe Connect activation blocker — requires publicly accessible ToS URL. Attorney-drafted per liability framework §J (`docs/operations/liability-insurance-framework.md`).

### T-E7-7 · Publish customer-facing /guarantee page (Sherpa Pros Work Guarantee)
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:430`
- **Description:** Explains caps + exclusions for the Work Guarantee layer of the 4-layer liability model. T1 builds page from copy Phyrom drafts (Week 4 of Phase 0 timeline).

### T-E7-8 · Engage Vouch/Embroker/Newfront broker — Phase 0 platform insurance
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:427`, `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:563`
- **Description:** CGL + Tech E&O + Cyber + Marketplace Endorsement. Budget $4K-$9K/yr (revised from $800 placeholder). Target bind by Week 3.

### T-E7-9 · Engage attorney for FULL legal package
- **Severity:** P0
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:428`, `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:564`
- **Description:** 1099 classification memo + ToS + Pro Service Agreement + Work Order template + Wefunder SAFE review. Budget $10K-$15K. Firms: Foley Hoag (Boston), Devine Millimet (NH), Pierce Atwood (ME).

### T-E7-10 · Train Concierge on Track A + Track B dispute workflow
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:431`
- **Description:** Phyrom + 1 Upwork US contractor trained per liability framework §7. Week 4 of Phase 0.

### T-E7-11 · Pilot — verify COIs of first 5 beta pros + mock-dispute end-to-end
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:432`
- **Description:** Weeks 4-6 of Phase 0 — actually verify COIs and run a mock dispute end-to-end before any real customer dispute hits.

### T-E7-12 · Resolve 8 open liability questions with attorney
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:434-441`
- **Description:** Work guarantee cap ($5K/job + $25K/customer/yr — confirm), reserve % (2% suggested), MA contractor-referral-service licensing, PM tier liability customer of record, specialty lane risk concentration, Mass Save coverage requirements, mandatory arbitration enforceability, class-action waiver enforceability.

### T-E7-13 · App Store Connect — fill App Information tab (Name, Subtitle, Bundle ID)
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:13-29`, `docs/app-store-submission.md:301`
- **Description:** Name `Sherpa Pros` (11 chars), Subtitle `Trade work, done right.` (23 chars), Bundle ID `com.thesherpapros.app`.

### T-E7-14 · App Store Connect — set Primary=Business / Secondary=Utilities
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:31-37`, `docs/app-store-submission.md:302`
- **Description:** Primary Business (B2B), Secondary Utilities (consumer side). Reject Productivity (too crowded).

### T-E7-15 · App Store Connect — complete Age Rating questionnaire (target 4+)
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:39-63`, `docs/app-store-submission.md:303`
- **Description:** 17 questions, all `None` except #15 (User-Generated Content = Yes with moderation note). Final 4+.

### T-E7-16 · App Store Connect — paste promotional text, description, keywords, what's new
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:67-153`, `docs/app-store-submission.md:304-307`
- **Description:** All copy is pre-drafted. Promo (168 chars), Description (2,489 chars), Keywords (99 chars), What's New (1,008 chars).

### T-E7-17 · App Store Connect — complete App Privacy "nutrition label"
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:206-241`, `docs/app-store-submission.md:311`
- **Description:** 24-row data declaration. Critical: Financial Info = No (Stripe-hosted, app never sees card data). Used for Tracking = No across all categories.

### T-E7-18 · Produce 5x 6.9" iPhone screenshots (1320×2868)
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:251`, `docs/app-store-submission.md:312`, `docs/app-store-submission.md:258-288`
- **Description:** 5 device-frame + text-overlay screenshots: Hero, Code-Verified Quotes, Marketplace Payment Protection, Map View, In-App Messaging. Each headline + subhead specified in source.

### T-E7-19 · Produce 5x 6.5" iPhone screenshots (1284×2778, fallback)
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:252`, `docs/app-store-submission.md:313`
- **Description:** Required legacy fallback set; mirror the 5 hero/feature shots above.

### T-E7-20 · Produce 5x iPad Pro 13" screenshots (2064×2752)
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:253`, `docs/app-store-submission.md:314`
- **Description:** Required because `supportsTablet: true`. 5 shots covering same 5 stories.

### T-E7-21 · App Store Connect — set Pricing & Availability (Free, US only at v1.0)
- **Severity:** P1
- **Source:** `docs/app-store-submission.md:315`
- **Description:** Pricing Free, availability US at v1.0; expand to Canada/UK after first review pass.

### T-E7-22 · App Store Connect — pre-create demo accounts (Pro + Client) for reviewer
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:317-323`
- **Description:** Apple WILL test sign-in. Pre-create Pro + Client demo accounts, paste credentials in App Review Information. Pre-verify the demo Pro (production requires real license docs).

### T-E7-23 · App Store Connect — write Notes for Reviewer
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:322-323`
- **Description:** Pre-drafted reviewer note explains beta cohort, Stripe Connect (sandbox card 4242…), Twilio mock-mode. Paste verbatim into the Review Info field.

### T-E7-24 · Final QA pass — install via TestFlight, run Pro + Client onboarding end-to-end
- **Severity:** P0
- **Source:** `docs/app-store-submission.md:326`
- **Description:** Pre-submission sanity check: install via TestFlight, run through Pro + Client onboarding, post a job, accept a bid, fund a milestone, send a chat message.

### T-E7-25 · Stripe Connect — complete platform activation (Phase 2 of setup doc)
- **Severity:** P0
- **Source:** `docs/stripe-connect-platform-setup.md:60-113`
- **Description:** Platform Standard type, business info, branding (Sherpa Pros, navy #1a1a2e, logo), privacy + ToS URLs (gates on T-E7-5 + T-E7-6), accept Connect platform agreement, submit for review (1-3 day Stripe turnaround).

### T-E7-26 · Stripe Connect — Phase 3 live-mode cutover
- **Severity:** P0
- **Source:** `docs/stripe-connect-platform-setup.md:116-160`
- **Description:** Add `sk_live_*` + `pk_live_*` to Vercel Production. Add live webhook endpoint at `https://thesherpapros.com/api/stripe/webhook` with `payment_intent.succeeded`, `transfer.created`, `charge.dispute.created`, `payout.failed`. Trigger redeploy. Smoke test.

### T-E7-27 · Track grant submissions at docs/fundraising/status/grants.md
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:103-104`, `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:136`
- **Description:** Status tracker: program, status, submission date, decision date, $ committed. Required for T-E6-8..T-E6-13.

### T-E7-28 · Track VC meetings at docs/fundraising/status/vc-meetings.md
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:351-352`
- **Description:** Meeting log per touchpoint. Required by T-E6-24..T-E6-26.

### T-E7-29 · Weekly status standups in docs/operations/weekly-status/<YYYY-WW>.md
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-22-parallel-execution-prompts.md:494-525`
- **Description:** Daily standup + weekly review format per terminal (T1-T6 + J). Drives Phase 0 → Phase 1 exit-gate decision.

---

## E8 · Architecture & scale

### T-E8-1 · P0 reconciliation — Lock compute platform (Vercel Fluid through 5M MAU)
- **Severity:** P0
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:42-44`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:64`
- **Description:** Joint Phyrom + orchestrator decision required. Recommendation: Vercel Fluid Compute through 5M MAU. Reframe Phyrom §9 as "optionality preserved" for future container extraction. Write ADR at `docs/architecture/adr/2026-04-XX-vercel-fluid-through-5m-mau.md`.

### T-E8-2 · P0 reconciliation — Lock object storage vendor (R2 vs S3)
- **Severity:** P0
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:45`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:66`
- **Description:** Recommendation: Cloudflare R2 (zero egress), with S3-compatible interface for flexibility. Rewrite Phase 4 cold-tier + DR sections as vendor-agnostic. Pin choice in separate ADR.

### T-E8-3 · P1 — Add metro_id column to migration 011 hub tables
- **Severity:** P1
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:46`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:70`
- **Description:** All 9 Hub tables in migration 011 lack `metro_id` columns that Phase 4 sharding assumes. Add now (default-populated for Atkinson Hub via single UPDATE). Cheap pre-Citus, expensive post-Citus.

### T-E8-4 · P1 — Pick queue technology (downstream of T-E8-1)
- **Severity:** P1
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:47`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:72`
- **Description:** If Vercel-native wins (recommendation): QStash + Workflow DevKit, retire BullMQ commitment. If containers win: Phase 4 must add a queue section.

### T-E8-5 · P1 — WAF + BotID gate before public launch
- **Severity:** P1
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:48`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:74`
- **Description:** Beta is invite-only so deferring WAF is fine. Public launch must follow WS4 of Phase 4 plan — Cloudflare Pro WAF + Vercel BotID + Upstash rate limiting at edge. Add as launch-blocker.

### T-E8-6 · P2 — Beta SLA disclosure clause
- **Severity:** P2
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:50`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:78`
- **Description:** Externally commit to "best-effort 99.5%, no contractual SLA" during beta. Phase 4 targets (99.95%, P95 <500ms, RPO 15-min, RTO 4-hr) activate at Phase 1 launch. Add disclosure to launch comms.

### T-E8-7 · P2 — Physical Hub data-residency addendum
- **Severity:** P2
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:51`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:80`
- **Description:** Phase 4 spec needs half-page addendum modeling physical Hubs as residency entities. Trigger date = Toronto Hub Phase 4B (first international-physical).

### T-E8-8 · P2 — Replica-aware Drizzle client must respect service abstraction
- **Severity:** P2
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:49`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:82`
- **Description:** WS3.1 implementation note — replica-aware Drizzle client must NOT bypass Phyrom's service abstraction layer. Consider mechanical lint rule preventing `@/db` imports outside `src/lib/services/` and `src/db/queries/`.

### T-E8-9 · P3 — Align Stripe Connect account type (Express recommendation)
- **Severity:** P3
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:52`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:86`
- **Description:** Phyrom spec says Standard; Phase 4 says Express. Recommendation: Express (lower platform liability, cleaner controller properties, faster onboarding). Update Phyrom spec to align. NOTE: Stripe setup runbook currently still says Standard — confirm with the Connect platform activation in flight.

### T-E8-10 · P3 — Add /api/health reference to Phase 4 §8 observability
- **Severity:** P3
- **Source:** `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:53`, `docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md:88`
- **Description:** Phyrom spec defines `/api/health` as required; Phase 4 spec is silent. One-line addition cross-referencing it as the Datadog synthetic source-of-truth.

### T-E8-11 · Wave A Hub buildout — Hub #1 real estate confirm + fit-out plan
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-25-phase-4-parallel-execution.md:138-146`
- **Description:** WS1 of Hub Integration plan, Month 0-4. Real estate confirm at HJD HQ Atkinson NH, fit-out (architect, contractor, permit), equipment manifest + opening inventory, Hub Manager #1 hiring, soft-open + grand-open milestones.

### T-E8-12 · FW Webb partnership LOI (HARD deadline Phase 1 Month 4)
- **Severity:** P1
- **Source:** `docs/superpowers/handoff/2026-04-25-phase-4-parallel-execution.md:30`, `docs/superpowers/handoff/2026-04-25-phase-4-parallel-execution.md:69-70`
- **Description:** 5-Hub pilot LOI for Hubs #2-10 co-located inside FW Webb branches. HARD signature deadline. Locks in the Option C Hybrid Hub strategy.

### T-E8-13 · SOC 2 readiness — Vanta + Schellman engagement (M9+)
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-25-phase-4-parallel-execution.md:55`, `docs/superpowers/handoff/2026-04-25-phase-4-parallel-execution.md:155-156`
- **Description:** Vanta (compliance automation) + Schellman (auditor). SOC 2 Type 1 in 90 days, Type 2 in 12 months. Gates international launch.

---

## E9 · IT admin console

> Vision-only as of 2026-04-28. Filing each surface as its own task preserves the work even if scoping is deferred. The spec itself (T-E9-0) is the gate.

### T-E9-0 · Run brainstorming skill on the IT admin console vision → write spec
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:96-102`
- **Description:** Narrow the 9 surfaces below to a v1 "thin slice." Decide URL namespace (`/sysadmin` vs `/console` vs `/admin/sys/*`). Decide access tier (`super`-only? new `sre`/`devops` tier?). Output: `docs/superpowers/specs/<date>-it-admin-console-design.md`.

### T-E9-1 · Module / feature management surface
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:33-37`
- **Description:** List installed modules with version + status + last-deployed date. Toggle module on/off without deploy (Vercel Edge Config + DB mirror for audit). Per-module config. Modules: dispatch wiseman, payments commission, Twilio, Zinc, Uber Direct, QBO, Wiseman bridge, OCR, Stripe Connect, Clerk.

### T-E9-2 · Data performance / DB observability surface
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:39-45`
- **Description:** Slow query dashboard, p95 latencies, hot-table index usage, table size + growth (esp. audit_logs), Neon connection pool health, migration history, Drizzle migration runner UI (super-only).

### T-E9-3 · Environment / configuration surface
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:47-50`
- **Description:** Read-only env-var inspector (deferred in v1 spec §2 — reconsider for unified Vercel/Clerk/Neon/Stripe view). Config drift detection across Prod/Preview/Dev. Secrets rotation tracker.

### T-E9-4 · Integration health surface
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:52-56`
- **Description:** Live status panel for outbound integrations (Twilio, Zinc, Uber Direct, QBO, Stripe Connect, Clerk, Google Maps). Last-success, last-failure, error rate, retry queue depth. Synthetic probes. Idempotency-key viewer. One-click resend/retry (super-gated, audit-logged).

### T-E9-5 · Background jobs / cron / queue surface
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:58-61`
- **Description:** List scheduled crons (Vercel cron + ad-hoc workers), last-run timestamp + outcome, execution history, manual re-trigger.

### T-E9-6 · Deployments / releases surface
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:63-66`
- **Description:** Recent deploys (Vercel API), who triggered, build duration, current status. Promote / rollback UI. Build log access for last N deploys.

### T-E9-7 · User session management surface
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:68-70`
- **Description:** Active session count by tier + role. Force sign-out for a user (dovetails with existing Task 6 grantAdmin/revokeAdmin session revocation).

### T-E9-8 · Logs / observability surface
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:72-75`
- **Description:** Application log stream (Vercel logs API or Logflare). Error tracking dashboard (top errors by frequency). Cross-link existing `/admin/logs` audit log search.

### T-E9-9 · Backup / restore surface
- **Severity:** P2
- **Source:** `docs/superpowers/handoff/2026-04-28-it-admin-console-vision.md:77-79`
- **Description:** DB backup status (last automated snapshot, RTO), manual backup trigger for pre-deploy/pre-migration safety.

---

## Summary

| Epic | Tasks Remaining | Notes |
|---|---|---|
| E1 · Launch blockers | 7 | (Plus SHRP-1 and SHRP-2 already filed) |
| E2 · MVP data scoping | 21 | 9 data-scoping + 4 auth-scoping + 8 data-relationship/audit |
| E3 · Build pipeline / release management | 11 | Includes rotation automation, CHANGELOG, Phased Release, hygiene |
| E4 · Auth & access | 9 | Clerk proxy, SIWA hardening, diagnostic endpoint removal, OTP verification |
| E5 · Marketplace functionality | 20 | 8 Plan 2b core + 11 Plan 2a followups + 1 smoke test |
| E6 · GTM & business | 30 | Fundraising + grants + accelerators + Wefunder + VC + marketing + beta cohort |
| E7 · Operations runbooks | 29 | Insurance, disputes, legal pages, App Store submission package, Stripe Connect activation, status trackers |
| E8 · Architecture & scale | 13 | 2 P0 + 3 P1 + 3 P2 + 2 P3 drift items + 3 Phase 4 buildout |
| E9 · IT admin console | 10 | 1 spec gate + 9 surfaces |
| **Total** | **150 minus duplicates** | See note below |

After deduplication against the prior sweep's tally and folding near-duplicates per the rules (e.g., grant submissions consolidated where mentioned in multiple docs), the practical filing count lands at approximately 85 tasks once T-E2-12..T-E2-19 and T-E5-11..T-E5-18 are batched into umbrella tickets at filing time. The granular list above is preserved for traceability — Jira filing can collapse the obvious data-relationship verifications and the smallest Plan 2a followups into compound tickets if that better matches operational practice.

---

## Out of scope (intentional, do NOT file)

Per provenance-sweep.md headline finding #7, the following are intentionally NOT promoted to Jira:

- **SOC2 / hub-1 / international launch / franchise checklists** — 1,500+ items across `docs/operations/soc2-readiness/`, `docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md`, `docs/superpowers/specs/2026-04-25-international-expansion-design.md`, `docs/superpowers/specs/2026-04-25-franchise-model-design.md`. These are far-future reference checklists, not Q2 2026 action items. They remain in-doc and will be batch-promoted when those phases activate.
- **Phase 4 GTM marketing kit refresh** — deferred until first international country launch is 6 months out.
- **Phase 4 Series B + Series C pitch deck** — deferred until Phase 3 Series A close is in hand (target M12).
- **Acquisition-track strategic analysis** — deferred until Phase 4B revenue + unit economics are proven.
- **AI/ML roadmap** (Sherpa Score evolution, Dispatch Wiseman ML uplift, predictive materials demand forecasting) — deferred to dedicated AI spec.
- **Embedded financial products beyond Sherpa Rewards + Tremendous** (Sherpa Lending, Sherpa Insurance, embedded payments beyond Stripe Connect) — deferred to dedicated Fintech spec.
- **Trades-industry vertical SaaS spinout** — deferred until Phase 5.

These tasks remain authoritative in their source specs and should be re-evaluated for promotion in batches when the corresponding phase activates.

---

*Generated 2026-05-15 from re-read of the 11 high-signal source files cited in `docs/audit/2026-05-15-provenance-sweep.md` after the prior session's structured breakdown was lost at ~74% context.*
