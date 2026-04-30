# Session Handoff — 2026-04-30

This is a handoff for the next session. Documents what actually happened. No speculation.

---

## Mission

Resumed from `docs/superpowers/handoff/2026-04-29-session-handoff.md`. Yesterday's session left the Clerk same-origin proxy half-done (PR #4 merged with code + Vercel env var, but Clerk Dashboard side never registered). Today's user-reported symptom: sign-in completely broken in every browser after a system restart, blocking new-user onboarding.

---

## Bugs found, in the order they surfaced

The reported bug ("can't sign in") turned out to be a chain of seven distinct integration-config failures, each masking the next. Documenting all seven so the next session has the full root-cause history.

### 1. Clerk same-origin proxy returned `host_invalid` in production

ClerkJS (with `proxyUrl=https://www.thesherpapros.com/__clerk` baked into the bundle) routed every frontend-API call through the proxy path. The proxy forwarded to Clerk's backend, which rejected with `host_invalid` because the proxy URL was never registered on Clerk's Dashboard side. The user pasted the live error response (`{"errors":[{"message":"Invalid host","code":"host_invalid","clerk_trace_id":"..."}]}`) which confirmed the diagnosis.

**Fix (commit `c3f8d6c`):** `src/app/layout.tsx` drops the `proxyUrl` prop on `<ClerkProvider>` and removes the `clerkProxyUrl = process.env.NEXT_PUBLIC_CLERK_PROXY_URL` read. `src/proxy.ts` drops `frontendApiProxy: { enabled: true }` from the `clerkMiddleware` options.

### 2. Vercel env var still leaked through after the runtime revert

After commit 1 deployed, scanning the live JS chunks showed `thesherpapros.com/__clerk` still baked in. Cause: `@clerk/nextjs/dist/.../mergeNextClerkPropsWithEnv.js` reads the env var directly:

```js
proxyUrl: props.proxyUrl || process.env.NEXT_PUBLIC_CLERK_PROXY_URL || ""
```

An empty `proxyUrl` prop can't override a Vercel env-var setting (both are falsy under `||`). The SDK falls back to the env var regardless of what the app's code passes.

**Fix (commit `cf4b35d`):** `next.config.ts` adds an `env` block forcing `NEXT_PUBLIC_CLERK_PROXY_URL: ""` at build time. Next.js inlines this into the client bundle BEFORE the Clerk SDK reads `process.env`, neutralizing the fallback. Also bonus-busts chunk hashes so cached browsers re-fetch fresh JS.

### 3. Account Portal redirect on protected-route hits

Once sign-in could load again, hitting any protected route (e.g., `/pro/dashboard`) redirected unauthenticated users to `https://accounts.thesherpapros.com/sign-in` (Clerk's hosted Account Portal) instead of the in-app `/sign-in` route. Confirmed via chrome-devtools-mcp: `GET /pro/dashboard → 302 → accounts.thesherpapros.com/sign-in?...`. Cause: without an explicit `signInUrl`, Clerk's middleware defaults to the Portal subdomain.

**Fix attempt 1 (commit `2217820`):** `next.config.ts` adds `NEXT_PUBLIC_CLERK_SIGN_IN_URL: "/sign-in"` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL: "/sign-up"` to the `env` block. This fixed the **client** bundle but did NOT fix the server middleware — the Account Portal redirect still happened.

### 4. next.config `env` only affects client bundle, not server runtime

The fix in #3 inlines values at build time into client JS, but `auth.protect()` runs on **Vercel Edge** at runtime and reads `process.env` separately. Vercel's runtime env doesn't have `NEXT_PUBLIC_CLERK_SIGN_IN_URL` set, so Clerk's middleware kept defaulting to the Account Portal.

**Fix (commit `b88b77c`):** `src/proxy.ts` passes `signInUrl: "/sign-in"` and `signUpUrl: "/sign-up"` directly to `clerkMiddleware()`. Also passes `unauthenticatedUrl: new URL("/sign-in", request.url).toString()` to `auth.protect()`. These take precedence over both env vars and the Portal default.

### 5. Lost `redirect_url` query param on the protected-route bounce

After fix #4, `/pro/dashboard` correctly redirected to `/sign-in`, but **without** the original target as a query param. After sign-in, users would land on Clerk's default destination instead of the page they were trying to reach.

**Fix (commit `387c127`):** `src/proxy.ts` builds `signInUrl.searchParams.set("redirect_url", request.url)` before passing to `auth.protect({ unauthenticatedUrl })`.

### 6. Signed-in users with no role cookie looped between `/sign-in` and `/pro/dashboard`

End-to-end sign-in via chrome-devtools-mcp showed Clerk's `attempt_second_factor` API returning `status: "complete"` with `created_session_id` set — sign-in DID succeed. But the page didn't navigate to `/pro/dashboard`. Diagnosis: `proxy.ts:enforceRBAC` had a "no role cookie → redirect to `/sign-in`" branch. Authenticated users without a `sherpa-role` cookie were sent to `/sign-in`, where Clerk re-detected the active session... and bounced them back. Loop.

**Fix (commit `d361977`):** Collapsed the two no-role branches into a single redirect to `/select-role` (with a self-loop guard `if (pathname === "/select-role") return null`). When Clerk is configured, by the time `enforceRBAC` runs the user has already passed `auth.protect()` — they ARE authenticated, just need to pick a role.

### 7. `setUserRole` server action wrote Clerk publicMetadata but not the cookie

After fix #6, `/pro/dashboard` correctly redirected to `/select-role`. The user clicked "I'm a Pro". `select-role/actions.ts:setUserRole` updated `publicMetadata.role = "pro"` via Clerk Backend API and called `redirect(getDashboardPath(role))`. But `proxy.ts:enforceRBAC` checks `request.cookies.get("sherpa-role")?.value` — and that cookie was never set. So the redirect to `/pro/dashboard` triggered another `enforceRBAC` → still no cookie → redirect to `/select-role` → loop.

**Fix (commit `45b8693`):** `setUserRole` now writes `cookies().set("sherpa-role", role, {...})` before the `redirect()`. Direct `/pro/dashboard` navigation after this confirmed the cookie + role pair landed on the dashboard.

---

## After all 7 fixes: end-to-end sign-in verified

Driven through chrome-devtools-mcp with real credentials (`poum@hjd.builders`):

1. `/pro/dashboard` (signed-out) → 302 → `/sign-in?redirect_url=...`
2. Email entered + Continue → `/sign-in/factor-one` (password step)
3. Password entered + Continue → `/sign-in/factor-two` (Clerk-issued email OTP)
4. OTP entered + Continue → Clerk's `attempt_second_factor` returns `status: "complete"` with `created_session_id: sess_3D5DCEvTKxZErQPWTgM4tKFMIRl`
5. Direct nav to `/pro/dashboard` → middleware → `/select-role` (no role cookie yet)
6. Click "I'm a Pro" → `setUserRole("pro")` writes Clerk metadata + cookie
7. Land on `/pro/dashboard` with full UI: incoming dispatch alert, active jobs, earnings ($2,850 this week / $3,325 pending), Sherpa Points 7,225, etc.

Screenshot saved at `/tmp/sp-dashboard.png` during the session.

---

## /simplify pass on the auth-fix changes

After end-to-end verification, ran the `simplify` skill which dispatched three parallel agents (reuse, quality, efficiency) against the 4 modified files. Aggregated findings → applied 8 fixes in commits `9d8a5e8` + `90b11a2`:

- **Hot-path:** `clerkMiddleware()` and `createRouteMatcher` were rebuilt on every request inside `withClerk()`. Hoisted into `loadClerkHandler()` memoized at module scope; first request pays the cost, all subsequent requests reuse the cached handler.
- **Reuse:** Replaced `["pro","client","pm"].includes(currentRole)` with `isValidRole()` and `` `/${currentRole}/dashboard` `` with `getDashboardPath()`, both already exported from `src/lib/auth/roles.ts`.
- **Reuse:** Derived `ROUTE_ROLES` keys from the `ROLES` constant instead of hardcoded strings.
- **Cleanup:** Removed dead `__clerk` path from middleware matcher (proxy permanently disabled).
- **Comments:** Trimmed WHAT-style comments in `next.config.ts` and `proxy.ts`'s `clerkMiddleware` options block, kept only WHY (loop hazard, server-vs-client env split).
- **Concurrency:** `setUserRole` now runs `auth()` and `clerkClient()` in parallel via `Promise.all`.
- **Tech debt marker:** Added a `TODO(auth)` comment in `actions.ts:24-29` describing the cookie-vs-publicMetadata duplication and the fresh-device migration that's still owed.
- **TypeScript fix-up (commit `90b11a2`):** First refactor commit broke the build with a too-narrow `ClerkHandler` return type. Vercel deploy failed; logs showed `Type 'NextMiddlewareResult | Promise<NextMiddlewareResult>' is not assignable to type 'Promise<Response | undefined>'`. Replaced manual type with `ReturnType<typeof loadClerkHandler>` so inference handles it.

**Skipped findings (out of scope for tonight):** cookie-name constant extraction across 7 files, signin-URL central constant across 30+ files, admin-sentinel typed-discriminator refactor, removing the `require()` pattern in `layout.tsx`.

---

## Verification gate output

Ran `superpowers:verification-before-completion` after the cleanup. Evidence collected:

| Check | Command | Result |
|---|---|---|
| Tests | `npx vitest run` | 17 files, 232/232 pass, 746ms |
| Local matches origin | `git rev-parse HEAD` vs `git ls-remote origin main` | both `90b11a2f02ee42e3e6a2e19824f819596f014150` |
| Vercel deploy | `gh api .../commits/main/status` | `state: success` |
| Live page | `curl -sI https://www.thesherpapros.com/sign-in` | `HTTP/2 200` |
| `/pro/dashboard` (Pro) | live fetch with session cookies | 200, no redirect |
| `/client/dashboard` (Pro) | live fetch | 200, redirected to `/pro/dashboard` (wrong-role) |
| `/pm/dashboard` (Pro) | live fetch | 200, redirected to `/pro/dashboard` (wrong-role) |
| `/admin` (Pro, no admin flag) | live fetch | 200, redirected to `/pro/dashboard` (no admin → fallback) |
| `/sign-up` on local domain | live fetch | 200, no redirect, on `www.thesherpapros.com` |
| `/select-role` accessible | live fetch | 200, no redirect (self-loop guard works) |

Pre-existing TypeScript errors in `src/app/api/stripe/webhook/__tests__/route.test.ts` (NODE_ENV assignment) and `src/db/queries/__tests__/payments.test.ts` (recursive type) — unrelated to today's auth work and not blocking the build (Vitest still runs them green).

---

## Files changed today

| File | Effect |
|---|---|
| `src/proxy.ts` | Reverted same-origin proxy; passed `signInUrl`/`signUpUrl` + `unauthenticatedUrl`; preserved `redirect_url`; collapsed RBAC no-role branches → `/select-role`; replaced inline role-check + dashboard-path with helpers from `lib/auth/roles.ts`; memoized Clerk handler at module scope; removed dead `__clerk` matcher entry |
| `src/app/layout.tsx` | Removed `proxyUrl` prop on `<ClerkProvider>` + the `clerkProxyUrl` env read |
| `next.config.ts` | Added `env` block forcing `NEXT_PUBLIC_CLERK_PROXY_URL=""`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"`. (User also added `turbopack.root` pin earlier in the session for an unrelated local-dev issue.) |
| `src/app/(auth)/select-role/actions.ts` | Parallelized `auth()` + `clerkClient()`; mirrors role to `sherpa-role` cookie alongside Clerk publicMetadata; documented TODO for fresh-device migration |

---

## Commits on `main` from this session

```
90b11a2 fix(auth): widen ClerkHandler return type via inferred ReturnType
9d8a5e8 refactor(auth): apply /simplify findings to today's auth-fix changes
45b8693 fix(auth): set sherpa-role cookie alongside Clerk publicMetadata
d361977 fix(auth): missing role cookie should send to /select-role, not /sign-in
387c127 fix(auth): preserve redirect_url on protected-route sign-in bounce
b88b77c fix(auth): pass signInUrl/unauthenticatedUrl to clerkMiddleware
2217820 fix(auth): route Clerk to local /sign-in instead of Account Portal
cf4b35d fix(auth): force NEXT_PUBLIC_CLERK_PROXY_URL empty at build time
c3f8d6c fix(auth): revert Clerk same-origin proxy — sign-in blocked across all browsers
```

Plus the previous-session handoff commit `3191bb0` for context.

---

## What's pending

### 1. Cookie ↔ publicMetadata sync gap (TODO in `actions.ts:24`)

`proxy.ts:enforceRBAC` checks the `sherpa-role` cookie. `setUserRole` now writes both Clerk publicMetadata AND the cookie. But on a **fresh device** or after a user clears cookies, they sign in successfully, hit a protected route, and `enforceRBAC` bounces them to `/select-role` to re-pick. They get in (one extra click), so it's not a launch blocker — but it's suboptimal UX.

The proper fix: middleware reads `auth().sessionClaims.metadata.role` (or fetches via `getAuth()`) and lazily backfills the cookie when the cookie is missing but the metadata has a role. Affects `src/proxy.ts` only. Estimated 30-60 min including a test.

### 2. Pre-existing TypeScript errors in test files

```
src/app/api/stripe/webhook/__tests__/route.test.ts(51,15): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
src/db/queries/__tests__/payments.test.ts(222,19): error TS2502: 'tx' is referenced directly or indirectly in its own type annotation.
```

Both unrelated to today's auth work. Tests still pass via Vitest because vitest uses its own transform pipeline. Worth fixing for `npx tsc --noEmit` cleanliness, but not blocking.

### 3. The Clerk same-origin proxy was REVERTED, not fixed

The original goal of PR #4 was to enable sign-in for privacy browsers (Brave Shields, Safari ITP, Chrome incognito w/ 3PCP enabled). That goal is NOT met — sign-in works in normal browsers but cross-site cookie blocking will still affect a small percentage of privacy-conscious users.

Re-enabling the proxy correctly requires (per yesterday's handoff):
- Either change Clerk primary domain to `www.thesherpapros.com` (Dashboard warns of downtime)
- Or add a Vercel `www → apex` redirect, change env var to apex, register apex proxy URL on Clerk
- Or use Clerk's Backend API to register the proxy URL programmatically

Project memory at `~/.claude/projects/-Users-poum/memory/project_sherpa_pros_clerk_proxy_disabled.md` documents that re-enabling requires removing the `next.config.ts` env override AND registering the proxy URL on Clerk first.

---

## What I recommend the next session does first

1. **Run the Plan 2a smoke test that's been deferred two sessions in a row** — sign in (now works), seed a milestone in production Neon, navigate to `/client/my-jobs/<jobId>/milestones/<milestoneId>/fund`, run a real $25 transaction, refund. The actual mission for the past two days that finally has working sign-in.
2. **Close the cookie/publicMetadata sync gap** (~30-60 min) so returning users on different devices don't have to re-pick role.
3. Decide on the privacy-browser proxy work. Lowest risk: Vercel `www → apex` redirect + env var to apex + register apex proxy URL on Clerk. Defer if no users complain.

---

## Things to be careful about next session

- The `require("@clerk/nextjs")` pattern in `src/app/layout.tsx` is still intentional and still fragile. Yesterday's handoff already warned not to "clean it up" — the warning still stands.
- The Vercel env var `NEXT_PUBLIC_CLERK_PROXY_URL` may still be set on Vercel. The `next.config.ts` `env` override neutralizes it at build time. **Both** must be removed if/when re-enabling the proxy.
- `DATABASE_URL` parsing quirks from yesterday's handoff (`\n` literal at end of `.env.local`) still apply.
- Local Neon and production Neon are still the same branch — destructive psql commands hit production.
- The chrome-devtools-mcp Chrome profile picked up the Clerk session during this session. If next session re-uses it, you may already be signed in; if you want to test a fresh-device flow, clear cookies first via `evaluate_script` running `document.cookie.split(';').forEach(c => document.cookie = c.split('=')[0] + "=; Max-Age=0; Domain=.thesherpapros.com")`.
