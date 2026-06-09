# Handoff · 2026-05-15 (MNEMOS onboarding)

## Session goal
Onboard this existing project into MNEMOS — synthesize prior context from `docs/HANDOFF.md`, `CLAUDE.md`, `docs/TODO-MVP-FIXES.md`, and 25 commits of git history into structured `.mnemos-state.json` + curated `handoff.md` so the next session opens warm.

## Project context
Sherpa Pros Platform is a construction marketplace ("Uber for contractors") connecting clients with verified pros for on-demand trade work. Next.js 16 / App Router / Tailwind 4, Clerk auth, Stripe Connect marketplace splits, Neon Postgres + PostGIS via Drizzle, Twilio masked messaging. Live at https://sherpa-pros-platform.vercel.app. Mobile companion app via Expo (deployed via TestFlight, currently on Build 12 in submission).

## Current state (inferred from prior handoff + git log)

### Web — production live ✓
Two-step magic-code sign-in for testers in the Neon `access_list` table works. Google OAuth still works as one-tap for testers whose Google account matches their access_list entry.

### iOS — Build 12 awaiting Apple review submission ⏳
- Build 11 approved + in TestFlight as the active External build (has SIWA + onboarding fixes)
- Build 12 submitted 2026-05-07 ~15:45 with email magic-code primary auth — Apple finished binary processing, needs Phyrom to add to External Testing group and click "Submit for Review"

### Email OTP — works for Phyrom only ⚠️
`POST /api/auth/email/request-code` and `POST /api/auth/email/verify-code` live and tested. But Resend's `thesherpapros.com` domain is NOT verified, so currently using `Sherpa Pros <onboarding@resend.dev>` which only delivers to `poum@hjd.builders`. **All other testers hit 403 until DNS verification completes.**

## Blocked
- ⛔ Resend domain verification for `thesherpapros.com` (blocking all tester OTP delivery)
- ⛔ Apple "Submit for Review" click on Build 12 (Phyrom in App Store Connect)

## Next session should
1. **Resend domain verification** — Phyrom: https://resend.com/domains → Add Domain → `thesherpapros.com` → Save. Add the 3-4 DNS records (MX + SPF + DKIM, optional DMARC) to Vercel DNS, click Verify in Resend (5-30 min DNS propagation). Then 1-line change in `src/lib/auth/email-sender.ts` to revert FROM_ADDRESS to `Sherpa Pros <invite@thesherpapros.com>`.
2. **Build 12 Submit for Review** — App Store Connect → TestFlight → External Testing → group → Builds → "+" → 1.0.0 (12), fill "What to Test" with the email magic-code description from `docs/HANDOFF.md` line 43, click Submit for Review.
3. **(Optional) Tester SIWA enablement** — collect Apple ID emails from testers using Sign in with Apple and INSERT into `access_list` via SQL.
4. **MVP data scoping** (non-blocking, can parallelize) — start through the 7 data-scoping items in `docs/TODO-MVP-FIXES.md` once real DB is connected. Replace mock data filters with WHERE clauses on user_id/job_id.

## Jira sync
<!-- This project doesn't currently track work in Jira. The HANDOFF.md uses
in-line "Phyrom action items" instead. If Jira adoption begins, configure
mnemos.jira_project_key in .claude/settings.json (currently set to "SHRP" but
no tickets exist yet). -->

## Profile in use
frontend-dev (recommended MCPs: github, figma, postman, memory-keeper, context7; skills include impeccable, brainstorming, systematic-debugging)

## Notes
- **Onboarded from:** README.md (23 lines), CLAUDE.md (105 lines), AGENTS.md (5 lines), DESIGN.md (445 lines, not pulled — see file directly), `docs/HANDOFF.md` (200-line capped excerpt), `docs/TODO-MVP-FIXES.md`, 25 most recent commits.
- **Bootstrap consumed on:** 2026-05-15. Archived at `~/.mnemos/cache/sherpa-pros-platform/onboarding-bootstrap.md.consumed` (referenceable but won't re-inject at SessionStart).
- **Build 11 vs Build 12 detail:** see `docs/HANDOFF.md` lines 60-90 for commit clusters and per-stream changes — they're more detailed than what fit here.
- **Architecture detail:** see `docs/superpowers/specs/2026-04-13-sherpa-pros-platform-design.md` per CLAUDE.md footer (the full platform design spec).
- **Design system:** `DESIGN.md` (445 lines, Uber-inspired) plus 4 design-skill bundles per CLAUDE.md §"Design Skills". Read DESIGN.md before any UI work.
