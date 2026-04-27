# Stripe Connect Onboarding — Plan 1 (Foundation Slice)

**Date:** 2026-04-26
**Status:** Draft (pending user review)
**Source umbrella spec:** `docs/superpowers/specs/2026-04-25-production-launch-hub-architecture-design.md` (section 2)
**Companion runbook:** `docs/stripe-connect-platform-setup.md`
**Sequence:** Plan 1 of 2. Plan 2 (payment operations: capture, payout, remaining webhooks) will be brainstormed/spec'd in a future session.

## Goal

Wire end-to-end Stripe Connect **onboarding** so pros can verify their identity and bank info via an embedded Stripe form, with their verification status tracked in our DB and gating their ability to accept jobs. No money flows yet — Plan 2 handles that.

## Out of scope (deferred to Plan 2 or later)

- Payment capture (`PaymentIntent`)
- Payout release (`Transfer` to connected account)
- Webhook events: `payment_intent.succeeded`, `transfer.created`, `charge.dispute.created`, `payout.failed`
- $500 beta job cap (Plan 2 feature gate)
- Auto-redirect at signup completion (deferred polish)
- Pro profile page payout-info section (deferred polish)
- Admin view of onboarded pros (separate plan)
- Status-change notifications (separate plan)

## Constraints

- **Embedded onboarding** (`<ConnectAccountOnboarding>` from `@stripe/react-connect-js`), not Stripe-hosted redirect. The user prioritized seamlessness; embedded keeps pros inside the app.
- **Standard Connected Account type** (per umbrella spec section 2). Pros own their Stripe dashboards.
- **Test mode for development** (`sk_test_*`). Live mode is unblocked by Phyrom's parallel platform activation; the env var flip is the only thing that switches modes — no code change.
- **Test-mode dashboard prerequisite** ⚠️ — even in test mode, embedded onboarding requires basic Connect settings on the dashboard (platform name, branding, support URL). If `loadConnectAndInitialize` rejects with a "platform not configured" error during test, the fix is filling in those minimum fields under https://dashboard.stripe.com/test/connect/settings. Confirm during smoke test; if it bites, add to the runbook.
- **In-memory cache stays out of this work.** Conversation cache is messaging-service concern, not payment.
- **TypeScript strict.** No `any`. No `as unknown as` in production code.

### Environment variables

| Variable | Scope | Test value | Live value | Where it's used |
|---|---|---|---|---|
| `STRIPE_SECRET_KEY` | **Server only** | `sk_test_*` | `sk_live_*` | Stripe Node SDK initialization in `src/lib/services/payments/stripe-service.ts` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | **Client + Server** | `pk_test_*` | `pk_live_*` | `loadConnectAndInitialize({ publishableKey })` in `src/components/pro/ConnectOnboardingClient.tsx` |
| `STRIPE_WEBHOOK_SECRET` | **Server only** | `whsec_*` (from `stripe listen`) | `whsec_*` (from prod webhook endpoint) | `stripe.webhooks.constructEvent(...)` in `src/app/api/stripe/webhook/route.ts` |

The `NEXT_PUBLIC_*` prefix is required for any env var that must reach the browser bundle in Next.js. The publishable key is safe to expose; secret and webhook secrets must never be `NEXT_PUBLIC_*`.

## Architecture

### Data flow (pro onboarding)

```
Pro signs up (existing flow, unchanged)
  ↓
Pro lands on /pro/dashboard
  Banner reads users.stripe_account_status:
  - 'none' / 'pending'  → amber "Get verified to start earning (~3 min)"
  - 'restricted'        → red "Stripe needs more info"
  - 'active'            → "Verified ✓" (or no banner)
  - 'disabled'          → red with support contact
  Job-accept buttons disabled when status !== 'active'
  ↓ click banner
Pro hits /pro/onboarding/payouts
  Server (Server Component / route handler):
    1. POST /api/stripe/connect/account
       → ensures users.stripe_account_id is set; creates if missing
       → returns { stripeAccountId, status }
    2. POST /api/stripe/connect/account-session
       → mints Stripe AccountSession scoped to account_onboarding component
       → returns { clientSecret, expiresAt }
  Client component:
    Renders <ConnectComponentsProvider> wrapping <ConnectAccountOnboarding>
    Stripe form renders inline with Sherpa's chrome around it
  ↓ pro fills out form
Stripe (in their backend):
  1. Validates KYC, bank info, business type
  2. POSTs account.updated event to /api/stripe/webhook
     → webhook handler validates Stripe-Signature
     → looks up user by stripe_account_id
     → updates stripe_account_status based on charges_enabled / details_submitted
  ↓ pro completes (or abandons)
<ConnectAccountOnboarding> fires onExit callback
  Client navigates to /pro/dashboard
  Banner now shows updated status (webhook landed asynchronously; if not yet,
  page refresh will pick up the new status)
```

### State model

`users.stripe_account_status` is a TEXT column with these values:

| Value | Meaning | UI implication |
|---|---|---|
| `none` | Pro has not started onboarding | Show "Get verified" banner; gate job-accept |
| `pending` | Stripe is reviewing (KYC, bank verification) | Show "Verification pending — Stripe is reviewing" banner; gate job-accept |
| `active` | Pro is verified and can receive payouts | Hide banner (or show "Verified ✓" once); ungate job-accept |
| `restricted` | Stripe requires more info from the pro | Show "Stripe needs more info" banner with link back to onboarding |
| `disabled` | Stripe has disabled the account (compliance violation, etc.) | Show error banner with support contact; gate job-accept |

The status is determined from the `account.updated` webhook payload:
- `charges_enabled === true && details_submitted === true` → `active`
- `details_submitted === true && charges_enabled === false` → `pending`
- `requirements.disabled_reason !== null` → `disabled`
- `requirements.currently_due.length > 0 && details_submitted === true` → `restricted`
- otherwise → `pending`

### Service abstraction

Following the pattern established in the messaging service abstraction work (commit `b1479b6` and onward):

```
src/lib/services/payments/
  index.ts              # getPaymentService() — env-aware getter
  stripe-service.ts     # Real Stripe SDK implementation
  mock-service.ts       # In-memory mock for dev / tests
  types.ts              # PaymentService interface, StripeAccountStatus, etc.
```

`PaymentService` interface (Plan 1 scope only):

```typescript
export type StripeAccountStatus =
  | 'none' | 'pending' | 'active' | 'restricted' | 'disabled';

export interface PaymentService {
  ensureConnectedAccount(
    userId: string,
    email: string,
  ): Promise<{ stripeAccountId: string; status: StripeAccountStatus }>;

  createAccountSession(
    stripeAccountId: string,
  ): Promise<{ clientSecret: string; expiresAt: number }>;

  // Plan 2 will extend with:
  // capturePayment(jobId, amountCents): Promise<PaymentIntentResult>;
  // releasePayout(paymentId, proAccountId, commissionRate): Promise<TransferResult>;
}
```

`getPaymentService()` returns the real Stripe service when `STRIPE_SECRET_KEY` is set; mock otherwise. Same pattern as `getMessagingService()`.

The `createAccountSession` implementation must scope the session to the `account_onboarding` component (Stripe rejects sessions without explicit component scoping):

```typescript
const session = await stripe.accountSessions.create({
  account: stripeAccountId,
  components: {
    account_onboarding: { enabled: true },
  },
});
return {
  clientSecret: session.client_secret,
  expiresAt: session.expires_at,
};
```

When Plan 2 adds payment-related embedded components (e.g., `payments`, `payouts`), they'll join the same `components` object. For Plan 1, only `account_onboarding` is enabled.

## Schema changes (migration 012)

```sql
-- migration_012_stripe_connect_accounts.sql

ALTER TABLE users
  ADD COLUMN stripe_account_id VARCHAR(64),
  ADD COLUMN stripe_account_status VARCHAR(20) NOT NULL DEFAULT 'none',
  ADD COLUMN stripe_onboarded_at TIMESTAMPTZ;

CREATE INDEX idx_users_stripe_account_id ON users(stripe_account_id);

CREATE INDEX idx_users_stripe_status_pro ON users(stripe_account_status)
  WHERE role = 'pro';

COMMENT ON COLUMN users.stripe_account_status IS
  'Stripe Connected Account state: none | pending | active | restricted | disabled';
```

Notes:
- `stripe_account_id` nullable because non-pro users (clients, admin) never get one
- `stripe_account_status` defaults to `'none'` so existing rows backfill without explicit migration
- `stripe_onboarded_at` records the FIRST time status reaches `'active'` (set once, never updated on subsequent restricted/disabled transitions)
- Partial index on `stripe_account_status` for `role = 'pro'` keeps admin queries fast even as the user table grows
- Status enum stored as TEXT (not Postgres ENUM type) for cheap value additions later without DDL

The Drizzle schema at `src/db/drizzle-schema.ts` will need matching column definitions.

## API endpoints

### `POST /api/stripe/connect/account`

**Auth:** requires authenticated pro session.
**Request body:** `{}` (empty — pro identity comes from session).
**Response:** `200 { stripeAccountId: string, status: StripeAccountStatus }` or `401 Unauthorized`.

**Behavior:**
1. Read `userId` from session.
2. Read `users.stripe_account_id` from DB.
3. If non-null: return existing account + current status.
4. If null:
   - Call `paymentService.ensureConnectedAccount(userId, email)`
   - Update `users.stripe_account_id` and `stripe_account_status = 'pending'`
   - Return new account ID and status.

This endpoint is idempotent on `userId` — calling twice never creates two Stripe accounts.

### `POST /api/stripe/connect/account-session`

**Auth:** requires authenticated pro session.
**Request body:** `{}`.
**Response:** `200 { clientSecret: string, expiresAt: number }` or `401 Unauthorized` or `400 No connected account`.

**Behavior:**
1. Read `userId` from session.
2. Read `users.stripe_account_id` from DB.
3. If null: 400 `{ error: "Connected account not yet created" }` — caller should hit `/account` first.
4. If non-null: call `paymentService.createAccountSession(stripeAccountId)` and return result.

The session is short-lived (Stripe's default ~30 min). The frontend re-mints if the user idles.

### `POST /api/stripe/webhook`

**Auth:** none (public webhook).
**Validation:** `Stripe-Signature` header via `stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)`.
**Response:** `200 { received: true }` on success; `403` on signature failure; `400` on parse failure.

**Plan 1 events handled:**
- `account.updated`: look up user by event's `account` field, derive new status from event data, update `users.stripe_account_status`. If new status is `'active'` and `stripe_onboarded_at` is null, set timestamp.

**Plan 1 fallthrough:**
- Any other event type: log warning, return 200 (Stripe retries on non-2xx).

**Idempotency:** Stripe sends webhooks at-least-once. Our `account.updated` handler is idempotent for the status update (writing `'active'` twice has the same effect). The `stripe_onboarded_at` set-once logic has a benign race: two simultaneous webhooks both pass the null check and write the same timestamp — last-write-wins, no real damage. Plan 1 accepts this; future plans (Plan 2's payment events with money implications) will need stronger idempotency via Stripe's `event.id` deduplication.

Plan 2 will add handlers for `payment_intent.succeeded`, `transfer.created`, `charge.dispute.created`, `payout.failed`.

## UI components

### New: `/pro/onboarding/payouts/page.tsx`

```typescript
// Server component — preflights account creation + session minting
export default async function OnboardingPayoutsPage() {
  const userId = await getCurrentUserId(); // existing helper
  const account = await ensureConnectedAccount(userId);
  const session = await createAccountSession(account.stripeAccountId);
  return <ConnectOnboardingClient clientSecret={session.clientSecret} />;
}
```

### New: `src/components/pro/ConnectOnboardingClient.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
} from '@stripe/react-connect-js';

export function ConnectOnboardingClient() {
  const router = useRouter();
  const [stripeConnectInstance] = useState(() => {
    const fetchClientSecret = async () => {
      const res = await fetch('/api/stripe/connect/account-session', {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Could not mint AccountSession');
      }
      const { clientSecret } = await res.json();
      return clientSecret;
    };

    return loadConnectAndInitialize({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      fetchClientSecret,
      appearance: {
        variables: {
          colorPrimary: '#1a1a2e', // brand dark navy from CLAUDE.md
        },
      },
    });
  });

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectAccountOnboarding
        onExit={() => router.push('/pro/dashboard')}
      />
    </ConnectComponentsProvider>
  );
}
```

The `useState(() => ...)` initializer pattern ensures `loadConnectAndInitialize` runs exactly once per component lifecycle. `fetchClientSecret` is a callback Stripe invokes on demand (component init, session refresh) — it always hits our `/api/stripe/connect/account-session` endpoint, which has its own auth check.

The server-component sibling that renders this client component does the prerequisite work: ensuring the connected account exists. It calls `ensureConnectedAccount(userId, email)` from the payment service so that by the time the client component mounts, `users.stripe_account_id` is set and ready for the AccountSession to reference.

### Modify: `/pro/dashboard/page.tsx` (existing)

Add a `<StripeStatusBanner />` component near the top. The banner reads `users.stripe_account_status` from the session/DB and renders one of five states (or null when active).

### Modify: existing job-accept buttons (across the codebase)

Wherever a pro can accept a job, wrap the action:

```typescript
const isVerified = user.stripeAccountStatus === 'active';
<button disabled={!isVerified}>
  {isVerified ? 'Accept job' : 'Verify to accept jobs'}
</button>
```

If unverified, link the button to `/pro/onboarding/payouts`.

Locations to update (best-guess from current codebase structure):
- `src/components/pro/JobCard.tsx` (or wherever job-accept lives in the pro view)
- `src/components/maps/BottomSheet.tsx` (if accept is in the map flow)
- Any "Bid → Accept" flow

The plan will list exact files after `feature-dev:code-explorer` confirms.

## Webhook signature validation

Use Stripe's standard helper:

```typescript
const event = stripe.webhooks.constructEvent(
  rawBody,        // important: raw text, NOT JSON.parse'd
  signatureHeader,
  process.env.STRIPE_WEBHOOK_SECRET!,
);
```

Next.js 16 App Router routes give us a `Request` object — read `await request.text()` to get the raw body. Do NOT use `request.json()` here — the raw bytes must match what Stripe signed.

If signature is invalid, `constructEvent` throws. Catch and return 403.

In dev with `STRIPE_WEBHOOK_SECRET` unset (mock mode), skip validation and parse JSON directly. Document this in code with a comment.

## Testing strategy

### Vitest unit tests

| File | Tests |
|---|---|
| `src/lib/services/payments/__tests__/stripe-service.test.ts` | `ensureConnectedAccount` happy path, idempotency, missing-creds error; `createAccountSession` happy path |
| `src/lib/services/payments/__tests__/index.test.ts` | `getPaymentService()` env switch (real vs mock) |
| `src/app/api/stripe/connect/account/__tests__/route.test.ts` | First call creates account; second call returns same; unauthenticated returns 401 |
| `src/app/api/stripe/connect/account-session/__tests__/route.test.ts` | Returns session when account exists; 400 when no account; 401 unauthenticated |
| `src/app/api/stripe/webhook/__tests__/route.test.ts` | Bad signature → 403; `account.updated` event with valid signature updates DB; unknown event type → 200 + log no-op; user not found → 200 + log no-op |

Total: ~12 new tests. Failure baseline preserved at 0.

### Manual end-to-end smoke (after merge)

1. Set `STRIPE_SECRET_KEY=sk_test_*` and `STRIPE_PUBLISHABLE_KEY=pk_test_*` in `.env.local`
2. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` (separate terminal)
3. Copy printed `whsec_*` to `.env.local` as `STRIPE_WEBHOOK_SECRET`
4. `npm run dev`
5. Sign up as a pro test account
6. Click "Get verified" banner
7. Complete Stripe's onboarding form using their test data:
   - Phone: `+1 (800) 555-0123`
   - Email: any `*@example.com`
   - SSN: `000-00-0000` (Stripe test value)
   - DOB: any past date
   - Address: any US address
   - Bank: routing `110000000`, account `000123456789` (Stripe test routing/account)
8. Verify the `account.updated` webhook fires (visible in `stripe listen` output)
9. Refresh `/pro/dashboard` — banner should now show `Verified ✓`
10. Job-accept buttons should be ungated

## Migration application

**Confirmed setup** (investigated, not TBD): migrations are hand-authored SQL files in `src/db/migrations/` (existing files: `001_initial.sql` through `010_dispatch_materials_orders_deliveries.sql`). Drizzle Kit is installed and `drizzle.config.ts` is present, but it's used for the TypeScript schema only (`src/db/drizzle-schema.ts`) — not for auto-applying migrations. There's no `npm run migrate` script.

Application sequence for migration 012:

1. **Author the migration:** create `src/db/migrations/012_stripe_connect_accounts.sql` with the SQL from the schema section above.
2. **Update Drizzle schema:** edit `src/db/drizzle-schema.ts` to add the matching column types so TypeScript queries see them. Match the SQL types exactly: `varchar({ length: 64 })` for the account ID, `varchar({ length: 20 }).notNull().default('none')` for the status, `timestamp({ withTimezone: true })` for `stripe_onboarded_at`.
3. **Apply to dev DB:**
   ```bash
   psql "$DATABASE_URL" -f src/db/migrations/012_stripe_connect_accounts.sql
   ```
   Use the `DATABASE_URL` from `.env.local` (Neon connection string).
4. **Apply to Vercel Preview's Neon branch** (if Preview is using a separate branch):
   ```bash
   psql "$NEON_PREVIEW_URL" -f src/db/migrations/012_stripe_connect_accounts.sql
   ```
5. **Verify locally:** `npx drizzle-kit introspect` (or `psql -c "\d users"`) should show the three new columns.
6. **Apply to Vercel Production's Neon branch BEFORE merging code to main:**
   ```bash
   psql "$NEON_PROD_URL" -f src/db/migrations/012_stripe_connect_accounts.sql
   ```
   This is the highest-risk step — apply during low-traffic window. The migration is purely additive (adding nullable columns + indexes), so it's safe under concurrent reads/writes, but verify before merge.
7. **Merge code to main** → Vercel auto-deploys → code reads/writes the new columns.

If applying to a Neon branch and you hit "permission denied," it's likely you need the connection string with elevated permissions (Neon's "owner" role rather than the default app user).

## Followups (deferred to Plan 2 or future plans)

- **Plan 2 (payment operations):** PaymentIntent capture, Transfer release, remaining 4 webhooks, $500 beta cap
- **Auto-redirect at signup completion:** decide whether to push pros directly to onboarding or let them browse first (currently chosen: let them browse)
- **Profile-page payout section:** show pros their connected bank, payout history, status timeline
- **Admin view of onboarded pros:** filterable list at `/admin/pros/onboarding`
- **Notification on status change:** push/email when restricted or disabled
- **Webhook persistence:** currently webhook only updates `stripe_account_status`; consider a `stripe_account_events` audit table for compliance
- **Idle session refresh:** if a pro sits on the onboarding page longer than the AccountSession's ~30 min lifetime, the embedded component will fail; we should listen and remint

## Spec self-review checks

- ✅ Placeholder scan: zero TBDs. Migration runner question resolved (hand-authored SQL files in `src/db/migrations/` applied via `psql`).
- ✅ Internal consistency: status enum values match between schema, TypeScript interface, and webhook derivation logic.
- ✅ Scope: focused on Plan 1 (onboarding only); money flow explicitly deferred to Plan 2.
- ✅ Ambiguity: status values explicitly defined with derivation logic from webhook payload.
- ✅ Env vars: all three Stripe env vars listed with scope (server-only vs `NEXT_PUBLIC_*`), test/live values, and use site.
- ✅ Stripe API calls verified against `/websites/stripe` docs (current as of 2026-04-26): `loadConnectAndInitialize` signature, `accountSessions.create` with `components.account_onboarding`, `<ConnectAccountOnboarding>` props.
