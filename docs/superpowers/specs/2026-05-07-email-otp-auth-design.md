# Email OTP Auth — Build 12 Design

**Date:** 2026-05-07
**Status:** Approved (Phyrom, 2026-05-07)
**Build target:** 12

## Problem

Closed-beta auth currently gates on `access_list.email`. Users authenticate via three providers — email, Google OAuth (web), Apple SIWA (mobile) — and each provider returns a different email for the same human. Apple SIWA returns the iCloud email, which rarely matches the invite email an admin entered into `access_list`. Result: SIWA fails for almost all testers. Confirmed for Phyrom on Build 11.

## Goal

Enable every tester to sign in via at least one provider without per-tester admin work. Keep email gating on `access_list` for security.

## Design — Option B (selected)

Three doors. Email is the *guaranteed* path; Apple/Google are best-effort one-tap.

```
┌──────────────────────────────────────────────────────┐
│ Apple "Sign in with Apple" (mobile only)             │
│   → check email vs access_list                       │
│   → succeeds for testers whose iCloud == invite      │
│   → fails for everyone else (UI: "use email below")  │
├──────────────────────────────────────────────────────┤
│ Google "Continue with Google" (web only)             │
│   → check email vs access_list                       │
│   → succeeds for Gmail-invited testers               │
├──────────────────────────────────────────────────────┤
│ Email "Send me a code" (NEW — primary path)          │
│   1. type invite email                               │
│   2. backend checks access_list                      │
│   3. backend emails 6-digit code via Resend          │
│   4. user enters code in app                         │
│   5. backend verifies, returns user info             │
└──────────────────────────────────────────────────────┘
```

## Components

### Backend (Next.js)

**New endpoints:**

- `POST /api/auth/email/request-code` — body `{email}`. Validates format, looks up `access_list` (returns 200 `{ok:true}` regardless of membership to prevent enumeration), generates a 6-digit code, hashes it, inserts an `email_codes` row with 10-minute expiry, sends email via Resend. Rate limit: 5 requests per email per hour.

- `POST /api/auth/email/verify-code` — body `{email, code}`. Looks up `email_codes` for the email where `consumed_at IS NULL AND expires_at > NOW()`. Compares hash. On match: marks consumed, looks up `access_list`, returns `{ok:true, name, defaultRole}` (same shape as `/api/auth/check-email`). On miss: increments `attempts`, returns `{ok:false, error: 'invalid_code', attemptsLeft}`. Locks code after 5 wrong attempts.

**New libs:**

- `src/lib/auth/email-codes.ts` — pure functions: `generateCode()`, `hashCode(code)`, `validateCode(input, stored_hash)`. Uses Node's `crypto.subtle.digest('SHA-256', ...)`.

- `src/lib/auth/email-sender.ts` — `sendOtpEmail({to, code, name?})`. Wraps Resend call with branded HTML template. Returns `{ok: bool}`. Mirrors the pattern at `src/app/api/admin/send-invite/route.ts:26-44`.

**New schema (migration `015_email_codes.sql`):**

```sql
CREATE TABLE IF NOT EXISTS email_codes (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL,
  code_hash   TEXT NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  consumed_at TIMESTAMP,
  attempts    INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_codes_active
  ON email_codes(email, consumed_at, expires_at);

CREATE INDEX IF NOT EXISTS idx_email_codes_rate_limit
  ON email_codes(email, created_at);
```

### Mobile (React Native)

- `mobile/app/(auth)/sign-in.tsx` — convert from single-step (email→fetch→navigate) to two-step:
  - Step 1: email field + "Send me a code" button → POST `/api/auth/email/request-code` → on `ok` advance to step 2
  - Step 2: 6-digit code input + "Verify" button → POST `/api/auth/email/verify-code` → on `ok` call `signIn()` and navigate
  - Apple SIWA button stays at top, unchanged.

- `mobile/components/auth/CodeInput.tsx` — new shared component: 6 boxes side-by-side, auto-focus next on type, supports clipboard paste (split paste across boxes), backspace clears+focuses prior, returns the assembled string via `onComplete` prop.

### Web (Next.js)

- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` — mirror the two-step shape. Google OAuth button stays. Same `<CodeInput>` shape but using HTML/Tailwind.

## Data flow

```
[Mobile or Web]                  [Backend]              [Resend]      [Neon]
   │                                │                     │             │
   ├─ POST /email/request-code ────▶│                     │             │
   │  {email}                       ├─ validate format    │             │
   │                                ├─ check access_list ──────────────▶│
   │                                │  (don't leak membership)          │
   │                                ├─ rate-limit check (5/hr) ────────▶│
   │                                ├─ generate 6-digit code            │
   │                                ├─ insert email_codes row ─────────▶│
   │                                ├─ if access_list match,            │
   │                                │  send via Resend ──▶│             │
   │◀──────── {ok: true} ──────────│                     │             │
   │                                                                    │
   │  user reads email & enters code                                    │
   │                                                                    │
   ├─ POST /email/verify-code ─────▶│                     │             │
   │  {email, code}                 ├─ select email_codes ─────────────▶│
   │                                │   WHERE email AND active          │
   │                                ├─ compare hash, increment attempts │
   │                                ├─ on match: mark consumed ────────▶│
   │                                ├─ look up access_list ────────────▶│
   │                                │◀──────── name, role ──────────────┤
   │◀── {ok, name, defaultRole} ───│                                    │
   │                                                                    │
   ├─ signIn(role, name, email) [SecureStore on mobile, cookie on web]  │
   └─ router.replace('/(role)')                                         │
```

## Error handling

| Scenario | Backend response | UI message |
|---|---|---|
| Email format invalid | 400 `{error: 'invalid_email'}` | "Please enter a valid email." |
| Email not in access_list | 200 `{ok: true}` (don't leak) — no email sent | Same success message; real test is whether code arrives. |
| Rate limit exceeded | 429 `{error: 'too_many_requests'}` | "Too many code requests. Try again in an hour." |
| Code wrong | 200 `{ok: false, error: 'invalid_code', attemptsLeft: N}` | "Invalid code. {N} attempts remaining." |
| Code expired | 200 `{ok: false, error: 'code_expired'}` | "Code expired. Request a new one." |
| Code locked (5+ wrong) | 200 `{ok: false, error: 'code_locked'}` | "Too many attempts. Request a new code." |
| Code already consumed | 200 `{ok: false, error: 'code_consumed'}` | "Code already used. Request a new one." |
| DB error | 503 | "Sign-in is temporarily unavailable." |
| Resend failure | Log error, still return 200 ok (fail-soft) | User sees "check email" but never gets it; can re-request. |

The "don't leak access_list membership" pattern (returning `ok:true` for unknown emails but not actually sending) is what GitHub does. Prevents email enumeration.

## Security

- Codes hashed with SHA-256 before storage. Never store plaintext.
- 6-digit numeric (1M space). Combined with 10-min expiry, 5-attempt limit, and rate limit, gives ~5×10⁻⁵ brute-force success per attempted email.
- Rate limit (5 requests/email/hour) prevents email-flood denial of service.
- Code expiry is 10 minutes — short enough to limit replay window, long enough to handle email-delivery delays.
- No information leak: identical 200 `{ok:true}` response whether email is on access_list or not.

## Testing

**Backend unit:**
- `email-codes.ts`: hash determinism, validate match/mismatch, rate-limit logic
- `request-code` route: invalid email rejected, valid email returns 200 even when not on access_list, rate limit enforced
- `verify-code` route: valid code accepted, expired rejected, wrong code increments attempts, 5+ wrong locks, consumed rejected

**Manual end-to-end (Phyrom on iPhone + iPad):**
- Real email path with `phyrom24@gmail.com` → check Resend deliverability → enter code → verify routing to `/(client)` (since Phyrom's row is `res_multi`)
- Wrong code → see "X attempts remaining"
- Wait 11 min → "code expired"
- Request second code → first code rejected as `code_consumed` (or new code supersedes — TBD by impl)
- SIWA still works for Phyrom IF his iCloud email is on access_list (separate flow, unchanged)

## Effort breakdown

| Phase | Hours |
|---|---|
| Schema migration + email-codes lib + email-sender lib | 1 |
| Backend endpoints (request-code + verify-code) | 1 |
| Mobile UI (two-step sign-in + CodeInput component) | 0.75 |
| Web UI (mirror) | 0.5 |
| Backend tests | 0.5 |
| Integration + manual verification | 0.5 |
| Build 12 + auto-submit | 0.5 (cloud) |
| **Total** | **~4.75 hours** |

## Out of scope (deferred to post-beta)

- Provider linking via Apple `sub` / Google `sub` claim (Option C from brainstorm). If an Apple/Google email isn't in access_list, user just falls back to email — no claim flow yet.
- Magic-link variant (URL with token rather than 6-digit code). Sticking with code for simpler mobile UX.
- "Remember me" / longer sessions. Existing SecureStore behavior unchanged.
- Password fallback. There are no passwords in the system.
- Resend deliverability hardening (DKIM/SPF/DMARC verification). Assumed already done since `invite@thesherpapros.com` works.

## Implementation strategy — three parallel agents in worktrees

Each agent works in its own git worktree against this spec, commits to its branch, returns summary. Controller merges branches into main, runs lint+typecheck on combined state, commits, pushes, then cuts Build 12.

- **Backend agent** → `.worktrees/email-otp-backend` branch `email-otp-backend`. Owns: migration, libs, endpoints, backend tests.
- **Mobile agent** → `.worktrees/email-otp-mobile` branch `email-otp-mobile`. Owns: sign-in.tsx, CodeInput component.
- **Web agent** → `.worktrees/email-otp-web` branch `email-otp-web`. Owns: sign-in/page.tsx.

Files touched are disjoint between agents. The API contract (request shapes, response shapes, error codes) is fully specified above so UI agents can build against it without coupling to backend impl.
