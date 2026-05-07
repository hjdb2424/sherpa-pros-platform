# Sherpa Pros — Session Handoff

**Last updated:** 2026-05-07
**Current HEAD:** `9a554c6` on `main`, all pushed.
**Latest production build:** Build 12 (`afe3e64e-a134-4371-b7f5-010ed063525d`) — submitted to App Store Connect 2026-05-07 ~15:45, awaiting "Submit for Review" click in App Store Connect.

---

## Where things stand right now

### Web — production live ✓

`https://www.thesherpapros.com/sign-in` works for all real testers in the Neon `access_list` table. Now a two-step magic-code flow: type invite email → get 6-digit code via Resend → enter code → in. Google OAuth still works as one-tap for testers whose Google account email matches their access_list entry.

### iOS app — Build 12 awaiting Apple review submission ⏳

- **Builds 6 / 7** in TestFlight currently — broken (hardcoded fixture array, doesn't recognize real testers).
- **Build 8** submitted but never approved for External — superseded.
- **Build 9** submitted but never approved for External — superseded.
- **Build 11** approved + in TestFlight as the active External build. Has SIWA + onboarding fixes.
- **Build 12** submitted 2026-05-07 ~15:45. Has email magic-code primary auth + everything from Build 11. Apple finished binary processing; needs Phyrom to add to External Testing group + click "Submit for Review."

### Email OTP — works for Phyrom only ⚠️

`POST /api/auth/email/request-code` and `POST /api/auth/email/verify-code` are live and tested. But Resend's `thesherpapros.com` domain is NOT verified, so we're temporarily using `Sherpa Pros <onboarding@resend.dev>` as the from-address. Resend's pre-verified test address only delivers to the account-owner email (`poum@hjd.builders`). **All 5 testers will hit 403 from Resend until DNS verification is done.**

---

## Immediate action items (Phyrom)

### 1. Resend domain verification (UNBLOCKS ALL TESTER OTP)

1. https://resend.com/domains → Add Domain → `thesherpapros.com` → Save
2. Resend gives 3-4 DNS records (MX + TXT for SPF + TXT for DKIM, optionally DMARC)
3. Add to Vercel DNS for `thesherpapros.com`: https://vercel.com/hjdb2424s-projects/sherpa-pros-platform/settings/domains
4. Click "Verify" in Resend (5-30 min DNS propagation)
5. Tell Claude when verified — we'll revert `FROM_ADDRESS` in `src/lib/auth/email-sender.ts` to `Sherpa Pros <invite@thesherpapros.com>` (1-line change + auto-deploy)

### 2. Build 12 → "Submit for Review" in App Store Connect

When Apple finishes binary processing (you'll get an email):
- App Store Connect → TestFlight → External Testing → [your group] → Builds → "+" → 1.0.0 (12)
- "What to Test":
  > Email magic-code sign-in (primary path). Sign-in screen now has a 6-digit code flow as the guaranteed sign-in method — type your invite email, get a code via email, enter to sign in. Apple Sign In and Google OAuth (web) still work for users whose provider email matches their access_list entry. Web has matching two-step flow.
- Click Submit for Review.

### 3. (Optional) Add tester Apple ID emails to access_list for SIWA

For any tester who wants to use Sign in with Apple, ask them what email shows on their Apple consent sheet, then add via SQL:
```sql
INSERT INTO access_list (email, name, default_role, status, invited_by, notes)
VALUES ('<their-apple-id>', '<name>', '<role>', 'active', 'self', 'Apple ID for <name>')
ON CONFLICT (email) DO UPDATE SET status = 'active';
```

Without this, SIWA fails for testers whose iCloud email differs from their invite email.

---

## What changed this session

### Build 11 (commits cluster around `aa9d73c` → `c4574c1`)

- **Sign in with Apple (mobile)** — `expo-apple-authentication` integration, native button on top per Apple HIG, calls new `POST /api/auth/apple/mobile` which decodes JWT identityToken and looks up access_list. SIWA gates on email match (separate path from "claim" flow).
- **Onboarding role-picker no longer auto-shown** — `toMobileRole()` defaults `'client'` for null/unknown role codes. `mobile/app/index.tsx` defaults to `/(client)` instead of `/select-role`. The `/select-role` screen file remains for any explicit role-switching UI.
- **Onboarding multi-select** — `mobile/components/onboarding/OnboardingWizard.tsx` switched `RadioList` → `ChipGroup` for property type, what brings you here, what's most important.
- **Web fail-closed** — `isEmailAllowedAsync` + `getAccessEntryAsync` in `src/lib/access-list.ts` no longer fall through to hardcoded fixture in prod (closes a real footgun in the Google OAuth callback).
- **Cookie Secure** — sign-in cookie now sets `Secure` flag on https.
- **`updateLastSignIn`** — now fires on email check-email path (was only Google).

### Build 12 (commits cluster around `b94f334` → `fcc5fc7`)

Built via 3 parallel agents (Backend Architect, Mobile App Builder, Frontend Developer) in git worktrees against a single spec doc (`docs/superpowers/specs/2026-05-07-email-otp-auth-design.md`). Disjoint file sets, no merge conflicts.

- **`src/db/migrations/015_email_codes.sql`** — schema for OTP codes table (idempotent, applied to live Neon)
- **`src/lib/auth/email-codes.ts`** — `generateCode()` (6-digit numeric), `hashCode()` (sha256 hex), `validateCode()`
- **`src/lib/auth/email-sender.ts`** — Resend wrapper. Currently uses `onboarding@resend.dev` workaround.
- **`POST /api/auth/email/request-code`** — validates email, looks up access_list (no-leak: returns 200 ok:true regardless), generates code, hashes, stores, sends email. Rate limit 5/email/hour.
- **`POST /api/auth/email/verify-code`** — validates code, marks consumed, returns user info `{ok, name, defaultRole}`. Locks code after 5 wrong attempts. 10-min expiry.
- **`src/__tests__/auth/email-codes.test.ts`** — 27 tests, all passing.
- **`mobile/components/auth/CodeInput.tsx`** — 6-box numeric input with paste-split, autofocus, backspace, oneTimeCode autofill.
- **`mobile/app/(auth)/sign-in.tsx`** — two-step state (`'email' | 'code'`), Apple SIWA preserved, distinguished error messages per spec table (`invalid_code` / `code_expired` / `code_locked` / `code_consumed`).
- **`src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`** — web mirror of two-step, Google OAuth preserved.

### Diagnostic endpoints (TEMPORARY — remove before public launch)

- **`GET /api/admin/env-check?debug=1`** — boolean presence of env vars (never values) + `RESEND_API_KEY_length` for sanity. `?debug=1` query gate.
- **`GET /api/admin/resend-check?debug=1&to=email&from=From%20%3Caddr%40domain%3E`** — calls Resend directly, returns raw status + body. Use to debug future Resend issues.

### Infrastructure

- **`.vercelignore`** — NEW. Excludes `.claude/`, `.worktrees/`, `mobile/`, `docs/superpowers/`, test files, `*.csv`. Fixes the 20K-files / 445MB function bundle bloat we hit when CLI-deploying.
- **DB cleanup** — 16 `@test.com` rows in `access_list` soft-deleted (status `revoked`). Hardcoded fixture in `src/lib/access-list.ts` shrunk to just `poum@hjd.builders` for dev.

---

## Auth state matrix

| Path | Status | Works for |
|---|---|---|
| Email magic-code (web + mobile) | ✅ Wired | Currently Phyrom only — Resend DNS verification blocks rest |
| Apple SIWA (mobile) | ✅ Wired | Anyone whose iCloud email is in access_list |
| Google OAuth (web) | ✅ Wired | Anyone whose Google email is in access_list |
| Google OAuth (mobile) | ❌ "Coming soon" placeholder | — Build 13 territory if needed |

## Access_list state at handoff

8 active rows (all real, all verified):
- `poum@hjd.builders` → Phyrom Oum / pro
- `phyrom24@gmail.com` → Phyrom - Client / res_multi
- `pstaffier@yahoo.com` → Paul Staffier / multi_view_tester
- `aspendr27@gmail.com` → Marie Bedard / multi_view_tester
- `ajmarocco@gmail.com` → Anthony Marocco / res_multi
- `adamolson3458@gmail.com` → Adam Olson / com_pm
- `caleb@aixiom.io` → Caleb Carter / com_pm
- `handymasters.nh@gmail.com` → Nazarii Konashuk / skilled

Plus 16 `@test.com` rows soft-deleted (status `revoked`).

---

## Followup hygiene (post-beta)

1. Move backend tests from `src/__tests__/` to repo root `__tests__/` (Next.js bundles `src/__tests__/` into `_not-found`, hence the .vercelignore exclusion patch).
2. Remove diagnostic endpoints (`/api/admin/env-check`, `/api/admin/resend-check`).
3. Apple SIWA: implement claim-flow (Option C from brainstorm) using Apple's `sub` claim — would let any Apple ID claim an existing access_list row by entering invite email + verifying via OTP. Eliminates the per-tester-Apple-ID admin work.
4. Web Apple OAuth callback at `/api/auth/apple/callback` is intentionally disabled (returns 503) per inline comments — has unfixed bugs. Mobile path is independent and functional.
5. Re-verify identityToken signatures in SIWA backend against Apple's JWKS at https://appleid.apple.com/auth/keys (currently decode-only — beta-acceptable but should harden pre-public).

## Lessons learned (worth keeping)

- **Vercel build cache + new env vars**: env vars added via `vercel env add` after a deployment require a NEW build (not just redeploy). Push a commit OR use "Redeploy" with "Use existing Build Cache" UNCHECKED.
- **Vercel CLI deploy uploads local state**: `vercel --prod` from CLI uploads working dir including untracked stuff. `.vercelignore` is now in place to prevent this.
- **Backend tests in `src/`**: Next.js bundler picks them up via dependency analysis → vitest deps blow function size. Keep tests outside `src/`.
- **Resend `onboarding@resend.dev`**: only delivers to account-owner email. Production sends require domain verification.
- **Diagnostic endpoint pattern**: when failures surface as misleading error codes (e.g., 501 with "no email service configured" that fires for both env-missing AND Resend-rejecting), build sharper diagnostics with `?debug=1` gate. Saved hours today.
- **Parallel agents in worktrees with disjoint files**: 3 agents shipped Build 12 in ~8 min wall clock vs ~4 hr sequential estimate. Spec doc as contract eliminated coordination overhead.

---

## Spec for Build 12

`docs/superpowers/specs/2026-05-07-email-otp-auth-design.md` — full architecture, components, data flow, error handling, testing strategy, effort breakdown.
