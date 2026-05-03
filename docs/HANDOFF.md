# Sherpa Pros — Session Handoff

**Last updated:** 2026-05-02 (late evening)
**Current HEAD:** `15bcb26` on `main`, all pushed.

---

## Where things stand right now

### Web — production live ✓

`https://www.thesherpapros.com/sign-in` works for all real testers in the Neon `access_list` table. Signed in Paul, Adam, and the rejection path end-to-end via chrome-devtools today. The legacy `https://sherpa-pros-platform.vercel.app/sign-in` also serves the same up-to-date bundle.

### iOS app — fix shipped to Apple, not yet to testers ⏳

- **Build 6 / Build 7 (currently in TestFlight) → broken.** The hardcoded fixture array is baked into those bundles. Real testers cannot sign in.
- **Build 8 (submitted ~6:27 PM 2026-05-02) → has the fix.** Auto-submitted to App Store Connect via EAS. Apple is processing the binary now.
- **Earliest external testers get it: 2026-05-04 morning** (24-48hr Apple Beta Review).
- **Internal testers (Adam, Caleb, Marie, Paul, Anthony):** can install Build 8 the moment Apple finishes processing — *if* they've accepted their App Store Connect team invitations first. Status when session ended: invited, all PENDING acceptance.

### Tonight's tester messaging

> "iOS app fix is in Build 8, just submitted to Apple — should be live in TestFlight 1–2 days. Web works right now: https://www.thesherpapros.com/sign-in — open in Safari on your phone if you want to start poking around."

---

## What changed (commits 0f6bf3e + 15bcb26)

### Root cause

Both web and mobile sign-in screens used a 24-entry hardcoded `ALLOWED_EMAILS` array baked into the bundle at build time. Real testers added through `/admin/access-list` (which writes to Neon) were invisible to that check. Google OAuth worked because that path queries Neon server-side. Email allowlist was the only path on iOS (Google OAuth is a "coming soon" placeholder there).

### Fix

New server endpoint `POST /api/auth/check-email` in `src/app/api/auth/check-email/route.ts`:

- Queries `access_list` table directly.
- **Production fails closed** with HTTP 503 on Neon outage — does NOT fall through to fixtures (those are AI-generated `@test.com` filler, never trustworthy in prod).
- **Dev keeps fixture fallback** so local development without a seeded DB still works.
- Returns `{ ok: true, name, defaultRole }` or `{ ok: false, error }`.

Client surfaces:
- **Web** (`src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`): swapped sync `isEmailAllowed`/`getAccessEntry` for a `fetch` of the new endpoint. Maps granular role codes via existing `toUserRole()` helper.
- **Mobile** (`mobile/app/(auth)/sign-in.tsx`): same shape with absolute URL via new exported `API_BASE` constant. Inline `toMobileRole()` mapper (mobile has no tenant surface yet — tenant codes fall through to `/select-role`).

Bonus fix: `mobile/lib/api.ts` had two stale URLs flagged in the 2026-04-30 audit. Both corrected:
- Dev: `localhost:3001` → `localhost:3000`
- Prod: `sherpa-pros-platform.vercel.app` → `www.thesherpapros.com`

---

## Next session — pick up from here

### Immediate (when you sit down)

1. **Verify Build 8 binary processing completed.** Apple emails when done. If email landed: TestFlight tab in App Store Connect shows Build 8 as "Waiting for Review."
   - Build URL: https://expo.dev/accounts/hjdb2424/projects/sherpa-pros/builds/4bcf8cd4-9a09-451f-9693-d48018d05a42
   - Submission URL: https://expo.dev/accounts/hjdb2424/projects/sherpa-pros/submissions/421f2634-f528-441b-83a7-58b4ffac1461
2. **Drive 5 trusted testers into Internal Testing group.** Same workflow as 2026-04-30: TestFlight → Beta Testers (Internal) → "Add Testers." Only works once they've accepted their Apple team invitations.

### Within 48hr

3. **Wait for Build 8 Beta Review approval.** External testers (Nazarii) get access once approved.
4. **Privacy Policy + Support pages** at `/privacy` and `/support` per `docs/app-store-submission.md` (still required for App Store full release submission).
5. **App Store screenshots** for 4 device sizes (creative briefs in `docs/app-store-submission.md`).

### Cleanup (no rush)

6. **Tighten `lib/access-list.ts`'s `isEmailAllowedAsync`.** It still says "DB reachable but email not found — still check hardcoded as fallback" — meaning a healthy DB plus an `@test.com` filler email returns `true` in production. The new `/api/auth/check-email` route handler avoids this by branching prod-vs-dev inline, but the helper itself remains a footgun if any other code path imports it.
7. **60-day TestFlight rotation** ~2026-07-01 (60 days from Build 8). YAML in `docs/app-store-launch-runbook.md` for GitHub Actions automation.

---

## Reference: build / submit commands

```bash
# Mobile build + auto-submit (production)
cd ~/sherpa-pros-platform/mobile
eas build --platform ios --profile production --auto-submit
```

Apple credentials, ASC App ID `6763805815`, Apple Team ID `VKU3W26WK7`, EAS project `aeeb92fa-2d32-4259-a800-f2e2fe2048a7` are all wired in `eas.json`. EAS auto-increments build number with `appVersionSource: "remote"`.

---

## Verifying the fix (curl one-liners)

```bash
# Should return {"ok":true,"name":"Paul Staffier","defaultRole":"multi_view_tester"}
curl -sS -X POST https://www.thesherpapros.com/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email":"pstaffier@yahoo.com"}'

# Should return {"ok":false,"error":"not_on_list"}
curl -sS -X POST https://www.thesherpapros.com/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email":"random@example.com"}'
```

---

## Files touched this session

- `src/app/api/auth/check-email/route.ts` (new, 75 lines)
- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` (~50 lines changed)
- `mobile/app/(auth)/sign-in.tsx` (~50 lines changed)
- `mobile/lib/api.ts` (2 line URLs corrected, `API_BASE` exported)

No DB migrations. No env var changes. No breaking changes to any other auth path. Google OAuth still works exactly as before — same `/api/auth/google` → `/auth/callback` flow, same DB-backed access_list lookup.
