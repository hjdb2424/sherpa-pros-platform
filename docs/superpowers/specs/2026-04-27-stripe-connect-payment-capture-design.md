# Stripe Connect Payment Capture (Plan 2a) — Design Spec

**Date:** 2026-04-27
**Status:** Draft v2 (post-review revision; pending user approval)
**Source umbrella spec:** `docs/superpowers/specs/2026-04-25-production-launch-hub-architecture-design.md` (section 2)
**Predecessor:** `docs/superpowers/specs/2026-04-26-stripe-connect-onboarding-design.md` (Plan 1, merged 2026-04-26)
**Sequence:** Plan 2a of 2 in the Stripe Connect work. Plan 2b (release / payout, remaining 2 webhooks) ships in a future session.

## Goal

Wire the capture half of the money flow: clients can fund job milestones via embedded Stripe `<PaymentElement>` form, money holds in the platform's Stripe balance, payment status persists in `payments` table. NO release path yet — funds sit in Stripe until Plan 2b's `Transfer` logic ships.

## Out of scope (Plan 2b or later)

- `POST /api/payments/release` (Transfer to pro's connected account)
- Webhook events: `transfer.created`, `charge.dispute.created`, `payout.failed`
- Commission application at transfer time
- Pro payout dashboard view
- Admin tooling for refund/manual-resolution of stuck funds

## Constraints

- TypeScript strict. NO `any`. NO `as unknown as` in production code (test-only mock setup OK).
- Embedded `<PaymentElement>` (matching Plan 1's embedded onboarding choice).
- **Stripe charge pattern: separate charges and transfers.** PaymentIntent created on platform account with NO `transfer_data` — money stays in platform balance until Plan 2b's `transfers.create` call.
- **Payment methods: `payment_method_types: ['card']`** (NOT `automatic_payment_methods`). Live-mode rollout of additional methods (ApplePay, GooglePay, Link) is a future plan; cards-only ships fast and matches platform-activation state. Documented as intentional in this spec so the next dev knows why.
- **Saved cards: NO**. Each milestone funding renders a fresh `<PaymentElement>`. Matches construction draw rhythm; intentional per-milestone authorization. SetupIntent + Customer + off-session work is deferred.
- **Test mode for development.** Live mode unblocked by Stripe platform activation (Phyrom's async task); env var flip is the only mode switch.
- **Webhook secret policy (C-4 fix).** The mock-mode bypass that skips signature validation when `STRIPE_WEBHOOK_SECRET` is unset applies ONLY when `NODE_ENV === 'test'` (i.e., during Vitest runs). In any other environment without the secret, money-state webhook events return `503 webhook_secret_required` and refuse to mutate the DB. Local dev MUST run `stripe listen` to provide the secret. This closes the security gap where forged `payment_intent.succeeded` events could flip payments to `held` without an actual charge.

### Environment variables

(All three already in use from Plan 1; no new env vars added in 2a.)

| Variable | Scope | Test value | Live value | Used by |
|---|---|---|---|---|
| `STRIPE_SECRET_KEY` | server | `sk_test_*` | `sk_live_*` | Stripe SDK init |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | client + server | `pk_test_*` | `pk_live_*` | `loadStripe()` in `<PaymentElementClient>` |
| `STRIPE_WEBHOOK_SECRET` | server | `whsec_*` (from `stripe listen`) | `whsec_*` (prod webhook) | webhook signature validation |

## Architecture

### Two trigger paths for funding

```
TRIGGER 1: bid-accept (auto-prompt, first milestone only)
  Existing bid-accept route → after accept, also creates the job's milestones
  → redirect to /client/my-jobs/[id]/milestones/[mid]/fund (mid = first 'pending' milestone)

TRIGGER 2: per-milestone manual button
  Client lands on /client/my-jobs/[id]
  Each milestone with status='pending' shows "Fund $X →" link
  Click → /client/my-jobs/[id]/milestones/[mid]/fund
```

### Pro lookup is via bids → pros → users (C-5 fix)

The `jobs` table has NO `pro_user_id` column. The pro is associated through:
- `bids.pro_id` → `pros.id` → `pros.user_id` → `users.id`

Plan 2a's capture flow looks up the pro by:
1. Find the accepted bid: `SELECT * FROM bids WHERE job_id = $jobId AND status = 'accepted' LIMIT 1`
2. Resolve to pro user: `SELECT u.* FROM pros p JOIN users u ON u.id = p.user_id WHERE p.id = $proId`
3. Check `users.stripe_account_status === 'active'`

If no accepted bid exists for the job, capture refuses with `422 job_has_no_accepted_bid`. This is a real edge case: client could try to fund a job with no winning bid.

### Funding-page data flow

```
1. /client/my-jobs/[id]/milestones/[mid]/fund (Server Component)
   ↓
   a. Auth check via getAppUser → getUserByClerkId; redirect /sign-in on no auth
   b. Verify dbUser is the job's client; redirect /pro/dashboard if not
   c. Load job, milestone, accepted bid, pro user (via bids→pros→users)
   d. Pre-flight gates (each → render error block, NO PaymentElement):
      - Job state must allow funding (e.g. not 'cancelled' / 'completed')
      - Milestone status must be 'pending'
      - Job must have an accepted bid
      - Pro must have stripe_account_status === 'active'
      - Capture cap: sum(amount_cents WHERE job_id=$jobId AND status IN ('pending','held','released')) + this_amount ≤ 50000
   e. Reuse-pending logic with status check (C-1 fix):
      - If a payment row exists for (jobId, milestoneId, payerUserId, status='pending'):
        → fetch Stripe PaymentIntent by stripe_payment_intent_id
        → check intent.status:
            - 'succeeded' → milestone is funded but webhook hasn't landed yet →
              render "Funded ✓ — finalizing" block, do NOT render PaymentElement
            - 'canceled' → DELETE the stale row, fall through to create new
            - 'requires_payment_method' / 'requires_confirmation' / 'processing' →
              render <PaymentElementClient> with intent.client_secret
            - any other status → log + render generic error block
      - Else (no pending payment): create new (see step f)
   f. New PaymentIntent path:
      - Generate paymentRowId = crypto.randomUUID() in app code
      - INSERT payments row with id=paymentRowId, status='pending', stripe_payment_intent_id=NULL,
        payee_user_id = proUser.id (resolved via bids→pros→users in step c)
        — serialized against same-milestone duplicates by the partial unique index;
          see Concurrency section for cross-milestone race trade-off
      - On unique-violation (concurrent same-milestone request raced ahead): refetch the
        existing pending row and re-enter the reuse-pending logic from step e
      - Call paymentService.capturePayment({ paymentRowId, amountCents, description, metadata })
      - On Stripe success: UPDATE payments SET stripe_payment_intent_id=$intentId WHERE id=$paymentRowId
      - On Stripe failure: DELETE payments WHERE id=$paymentRowId, throw
      - Render <PaymentElementClient> with returned client_secret
   ↓
2. <PaymentElementClient> ('use client')
   - loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
   - <Elements stripe={...} options={{ clientSecret }}>
   - <PaymentElement />
   - Submit → stripe.confirmPayment({
       elements,
       confirmParams: { return_url: `/client/my-jobs/[id]?funded=[mid]` },
     })
   ↓
3. Stripe processes card, debits buyer, holds funds in platform balance
   ↓
4. Stripe POSTs payment_intent.succeeded to /api/stripe/webhook
   - Webhook secret guard: if mock-mode (no secret) and NODE_ENV !== 'test', return 503 (C-4 fix)
   - Validate Stripe-Signature normally (existing Plan 1 code)
   - Plan 2a adds case handlers (see "Webhook handler additions")
   ↓
5. Webhook handler updates payments + job_milestones in a transaction (I-2 fix):
   - markPaymentHeld(paymentRowId):
     - UPDATE payments SET status='held', held_at=NOW() WHERE id=$paymentRowId
     - UPDATE job_milestones SET status='funded' WHERE id=$milestoneId (looked up from payments row)
     - Single transaction
   ↓
6. Client browser redirects to return_url
   - Job-detail page reads job_milestones.status='funded' on render
   - Shows "Funded ✓" badge
```

### Critical gates at capture-time (BEFORE creating PaymentIntent)

1. **Auth + ownership.** Client must own the job.
2. **Job state.** Not in a terminal state (cancelled / completed). Use existing job state machine.
3. **Milestone state.** Status must be 'pending'. If 'funded' (set by webhook) or other, return 409 — already funded.
4. **Accepted bid exists.** If `bids` has no row with `(job_id=$jobId, status='accepted')`, return 422 `job_has_no_accepted_bid`.
5. **Pro verification.** Pro user (via accepted bid → pros → users) must have `stripe_account_status === 'active'`. If not, return 422 with body `{ error: 'pro_not_verified', proName }`. The funding page renders a friendly "this pro hasn't completed verification — they've been notified" block instead of the form. This is the granular gate Plan 1 deferred.
6. **Beta cap.** `getCapturedTotalForJob(jobId) + amountCents <= 50000`. Sum INCLUDES status 'pending', 'held', 'released' (combined with reuse-pending logic, this avoids self-block while preventing real over-cap). If exceeded, return 422 with `{ error: 'beta_cap_exceeded', limit: 50000 }`.

### Concurrency (C-2 fix — accepted-race with compensating control)

The cap-check has a known race under concurrent fund attempts on the same job. Two simultaneous funding-page loads on different milestones could both pass the cap check and both proceed.

**For Plan 2a's beta scope, we accept this race with the following compensating controls:**

1. **DB-side serialization for the same milestone.** A partial unique index `UNIQUE (job_id, milestone_id, payer_user_id) WHERE status = 'pending'` (in migration 013) prevents two concurrent fund attempts on the SAME milestone from both creating PaymentIntents. The second INSERT fails with a uniqueness violation; the handler catches it, refetches the now-existing pending row, and re-enters the reuse-pending path. This eliminates the same-milestone race entirely.

2. **Cross-milestone race acceptance.** Two concurrent funds for DIFFERENT milestones on the same job CAN both pass the cap check. With the $500 beta cap, the worst case is ~$500 of overage (a single milestone's worth) — manageable, recoverable via Stripe refund. We accept this for beta.

3. **Monitoring.** Add a `console.error` log if `getCapturedTotalForJob(jobId) > 50000` is ever observed at capture time (after the row inserts). This surfaces actual occurrences for ops review. Pre-production hardening adds a Postgres advisory lock on the job ID; deferred to followup.

A row-level lock approach (`SELECT job FOR UPDATE` inside a transaction wrapping cap-check + INSERT) is described in Followups for production hardening but not in Plan 2a's scope. Reasoning: implementing it correctly requires a transactional Drizzle pattern that doesn't currently exist in the codebase. The development cost outweighs the beta-scope risk.

### Webhook idempotency (revised)

New table `stripe_events_processed`:
- PRIMARY KEY on `event_id` (Stripe's `evt_*` ID)
- Webhook handler INSERTs before processing
- `markEventProcessed(eventId, eventType)` returns `true` if INSERT succeeded (first time), `false` if `ON CONFLICT DO NOTHING` skipped
- If `false`, the handler returns 200 without re-processing
- Stripe at-least-once delivery → duplicates ignored cleanly

This is the dedup pattern for money events.

### Two-phase commit avoidance (revised)

Pattern (now serialized via the partial unique index for same-milestone races):

1. Generate `paymentRowId = crypto.randomUUID()` in app code
2. Inside a single transaction:
   a. INSERT payments row with `id=paymentRowId, stripe_payment_intent_id=NULL, status='pending'`
   b. Catch unique-violation → reuse-pending path
3. Call `stripe.paymentIntents.create({ metadata: { paymentRowId } })`
4. UPDATE payments row to set `stripe_payment_intent_id`
5. On Stripe failure (anywhere in step 3): DELETE the orphan row

The brief window of orphan possibility is steps 2 → 5 (microseconds). The DELETE in the catch branch is best-effort cleanup. If the DELETE itself fails, the cron job (deferred followup) will catch it after 24h.

## Schema changes — migration 013

```sql
-- Migration 013: Stripe Connect Money Flow Foundations
-- - Adds stripe_transfer_id to payments (used by Plan 2b's release path)
-- - Creates stripe_events_processed for webhook idempotency
-- - Adds partial unique index for pending-payment idempotency

ALTER TABLE payments
  ADD COLUMN stripe_transfer_id VARCHAR(64);
-- Note: no index on stripe_transfer_id. The column is NULL for all Plan 2a rows
-- (B-tree indexes don't index NULLs by default), and Plan 2b will query by
-- payment_id or stripe_payment_intent_id, not transfer_id. Add an index when
-- a real query pattern emerges.

CREATE TABLE stripe_events_processed (
  event_id VARCHAR(64) PRIMARY KEY,
  event_type VARCHAR(60) NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- No additional indexes — PK covers the only operation (dedupe by event_id).
-- Add analytics indexes later if a use case appears.

-- Partial unique index: prevents two concurrent fund attempts on the same
-- (job, milestone, payer) triple from both creating PaymentIntents.
-- The second INSERT fails with a uniqueness violation; the handler catches
-- it and falls into the reuse-pending path.
CREATE UNIQUE INDEX uq_payments_pending_per_milestone
  ON payments(job_id, milestone_id, payer_user_id)
  WHERE status = 'pending';
```

The Drizzle schema at `src/db/drizzle-schema.ts` gets matching column definitions:

```typescript
// payments table — append:
stripeTransferId: varchar("stripe_transfer_id", { length: 64 }),

// new table:
export const stripeEventsProcessed = pgTable("stripe_events_processed", {
  eventId: varchar("event_id", { length: 64 }).primaryKey(),
  eventType: varchar("event_type", { length: 60 }).notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

The partial unique index is not expressible cleanly via Drizzle's index helper; the migration SQL is the source of truth. Add a comment in the Drizzle schema noting that the index exists in SQL.

### Migration 013 runbook (I-6 fix)

Plan 2a follows the same Neon manual-apply pattern as Plan 1's migration 012:

1. Author the SQL file at `src/db/migrations/013_stripe_money_flow.sql`
2. Apply to the local dev Neon branch via `psql "$DATABASE_URL" -f src/db/migrations/013_stripe_money_flow.sql`
3. Apply to the Vercel Preview Neon branch (if separate) via `psql "$NEON_PREVIEW_URL" -f ...`
4. Verify locally: `psql -c "\d payments"` shows the new column; `psql -c "\d stripe_events_processed"` shows the new table; `psql -c "\di+"` shows the partial unique index
5. **Apply to production Neon branch BEFORE merging code to main:** `psql "$NEON_PROD_URL" -f ...`
6. Merge code → Vercel auto-deploys with both schema and code in place

Migration 013 is purely additive (one nullable column, one new table, one new index). Safe under concurrent reads/writes. No table rewrite. Apply during normal traffic.

## API endpoints

### Capture: helper function, NOT an HTTP route (I-4 fix)

The Server Component at `/client/my-jobs/[id]/milestones/[mid]/fund/page.tsx` calls a helper `runCaptureForMilestone(...)` directly. NO public HTTP `POST /api/payments/capture` endpoint exists. Reasoning:

- The funding flow is fully server-rendered: page loads, server runs gates, server creates the PaymentIntent, server returns the `clientSecret` to the client.
- The client-side payment confirmation goes directly through Stripe's `<PaymentElement>` (server doesn't proxy it).
- Adding an HTTP route would require duplicating gates and adds attack surface for no benefit.
- If a future flow needs an HTTP capture entry point, Plan 2b can add it.

The helper lives at `src/lib/payments/capture.ts`:

```typescript
export type CaptureError =
  | 'unauthorized'
  | 'not_owner'
  | 'job_not_fundable'
  | 'milestone_not_pending'
  | 'milestone_not_in_job'
  | 'job_has_no_accepted_bid'
  | 'pro_not_verified'
  | 'beta_cap_exceeded';

export type CaptureResult =
  | { ok: true; clientSecret: string; paymentRowId: string; paymentIntentId: string }
  | { ok: true; alreadyFunded: true }   // PaymentIntent succeeded but webhook hasn't landed yet
  | { ok: false; error: CaptureError; meta?: Record<string, unknown> };

export async function runCaptureForMilestone(input: {
  clientUserId: string;
  jobId: string;
  milestoneId: string;
  amountCents: number;
}): Promise<CaptureResult>;
```

### Webhook handler additions (modify existing route)

The existing `src/app/api/stripe/webhook/route.ts` validates `Stripe-Signature` and handles `account.updated` (from Plan 1). Plan 2a:

1. **Tighten the mock-mode bypass (C-4 fix).** Replace the existing block that skips validation when `webhookSecret` is unset with:

```typescript
if (!webhookSecret) {
  if (process.env.NODE_ENV === 'test') {
    // Vitest runs without secrets — bypass validation for unit tests
    try {
      const parsed = JSON.parse(rawBody);
      return await handleEvent(parsed);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }
  // Any non-test env without secret = security risk for money events
  console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set in non-test env');
  return NextResponse.json({ error: 'webhook_secret_required' }, { status: 503 });
}
```

2. **Add `payment_intent.succeeded` handler:**

```typescript
case 'payment_intent.succeeded': {
  const intent = event.data.object as Stripe.PaymentIntent;
  const paymentRowId = intent.metadata?.paymentRowId;
  if (!paymentRowId) {
    console.warn(`[stripe-webhook] payment_intent.succeeded without paymentRowId metadata: ${intent.id}`);
    break;
  }
  const isFirst = await markEventProcessed(event.id, event.type);
  if (!isFirst) {
    console.log(`[stripe-webhook] duplicate payment_intent.succeeded for event ${event.id} — skipping`);
    break;
  }
  await markPaymentHeld(paymentRowId);
  console.log(`[stripe-webhook] payment_intent.succeeded → payment ${paymentRowId} held`);
  break;
}
```

3. **Add `payment_intent.payment_failed` handler (I-1 fix):**

```typescript
case 'payment_intent.payment_failed': {
  const intent = event.data.object as Stripe.PaymentIntent;
  const paymentRowId = intent.metadata?.paymentRowId;
  if (!paymentRowId) break;
  const isFirst = await markEventProcessed(event.id, event.type);
  if (!isFirst) break;
  // Delete the row rather than introduce a 'failed' status. Removes from cap calc.
  await deletePaymentRow(paymentRowId);
  console.log(`[stripe-webhook] payment_intent.payment_failed → payment ${paymentRowId} deleted`);
  break;
}
```

This handles the case where Stripe captures fail (declined card, network failure mid-flow) so the row doesn't permanently inflate the cap. We chose DELETE over a 'failed' status to avoid a schema CHECK-constraint change (`'failed'` is not currently in the constraint).

## UI components

### New: `src/components/client/PaymentElementClient.tsx`

```typescript
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  clientSecret: string;
  returnUrl: string;
}

function PaymentForm({ returnUrl }: { returnUrl: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });
    if (result.error) {
      setError(result.error.message ?? 'Payment failed');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement />
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <button
        disabled={!stripe || submitting}
        className="mt-4 px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50"
      >
        {submitting ? 'Processing...' : 'Fund milestone'}
      </button>
    </form>
  );
}

export function PaymentElementClient({ clientSecret, returnUrl }: Props) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: { colorPrimary: '#1a1a2e' },
        },
      }}
    >
      <PaymentForm returnUrl={returnUrl} />
    </Elements>
  );
}
```

### New: `src/app/(dashboard)/client/my-jobs/[id]/milestones/[mid]/fund/page.tsx`

Server Component. Reads URL params, calls `runCaptureForMilestone(...)` from `src/lib/payments/capture.ts`, switches on the result:
- `{ ok: true, alreadyFunded: true }` → render "Funded ✓ — finalizing" block
- `{ ok: true, clientSecret, ... }` → render `<PaymentElementClient clientSecret returnUrl />`
- `{ ok: false, error: 'pro_not_verified' }` → render "Pro hasn't completed verification" block
- `{ ok: false, error: 'beta_cap_exceeded' }` → render "Beta cap exceeded" block
- ... etc per CaptureError variant

### Modify: `src/app/(dashboard)/client/my-jobs/[id]/job-detail-content.tsx`

For each milestone in the rendered list, if `milestone.status === 'pending'`, add a "Fund $X →" link to `/client/my-jobs/[id]/milestones/[mid]/fund`. If `milestone.status === 'funded'`, show a "Funded ✓" badge. Existing layout/styles preserved.

### Modify: bid-accept route (existing)

The existing route that handles "client accepts pro's bid" needs to redirect to the funding page for the first milestone after creating the job's milestones. Exact path TBD via investigation in implementation phase — the spec author cannot identify it from grep alone (the bid-accept flow may be a Server Action, a route handler, or a form post). The redirect goes to `/client/my-jobs/[id]/milestones/[firstMilestoneId]/fund`.

## New @stripe packages

Plan 1 added `@stripe/connect-js` + `@stripe/react-connect-js` for embedded onboarding. Plan 2a needs `@stripe/stripe-js` + `@stripe/react-stripe-js` for the embedded `<PaymentElement>`. Different packages — Stripe Connect SDK is for marketplace components (onboarding, payouts dashboards); Stripe.js + react-stripe-js is for end-user payment forms.

## PaymentService extension

Add to `src/lib/services/payments/types.ts`:

```typescript
export interface CapturePaymentInput {
  paymentRowId: string;
  amountCents: number;
  description: string;
  metadata: {
    jobId: string;
    milestoneId: string;
    paymentRowId: string;
  };
}

export interface CapturePaymentResult {
  paymentIntentId: string;
  clientSecret: string;
}

// Extend PaymentService:
export interface PaymentService {
  ensureConnectedAccount(...): ...;
  createAccountSession(...): ...;
  // NEW in Plan 2a:
  capturePayment(input: CapturePaymentInput): Promise<CapturePaymentResult>;
}
```

Stripe service implementation:

```typescript
async capturePayment({ amountCents, description, metadata }): Promise<CapturePaymentResult> {
  const client = getStripeClient();
  const intent = await client.paymentIntents.create({
    amount: amountCents,
    currency: 'usd',
    payment_method_types: ['card'],
    description,
    metadata,
  });
  return {
    paymentIntentId: intent.id,
    clientSecret: intent.client_secret!,
  };
}
```

Mock service: returns deterministic-but-fake `pi_mock_*` and `pi_mock_*_secret` IDs.

## Query helpers

New file: `src/db/queries/payments.ts`

```typescript
// Reuse: getJob (likely exists in src/db/queries/jobs.ts; reuse if so)
export async function getJob(jobId: string): Promise<JobRow | null>;
export async function getMilestone(milestoneId: string): Promise<MilestoneRow | null>;
export async function getUserById(userId: string): Promise<UserRow | null>;

// New (C-5 fix):
export async function getAcceptedBidForJob(jobId: string): Promise<BidRow | null>;
export async function getUserByProId(proId: string): Promise<UserRow | null>;

// Capture flow:
export async function getPendingPaymentForMilestone(
  jobId: string,
  milestoneId: string,
  payerUserId: string,
): Promise<PaymentRow | null>;

export async function insertPendingPayment(input: {
  id: string; jobId: string; milestoneId: string;
  payerUserId: string; payeeUserId: string;
  amountCents: number;
}): Promise<{ inserted: true } | { inserted: false; existing: PaymentRow }>;
// Catches the unique-violation from the partial unique index.
// Returns inserted=false + existing row if conflict.

export async function setPaymentIntentId(paymentRowId: string, paymentIntentId: string): Promise<void>;
export async function deletePaymentRow(paymentRowId: string): Promise<void>;
export async function getCapturedTotalForJob(jobId: string): Promise<number>;
// Sums amount_cents WHERE job_id = $jobId AND status IN ('pending','held','released')

export async function markPaymentHeld(paymentRowId: string): Promise<void>;
// Transactionally: UPDATE payments SET status='held', held_at=NOW() AND
// UPDATE job_milestones SET status='funded' for the milestone referenced by the payment row.
// (I-2 fix.)
```

New file: `src/db/queries/stripe-events.ts`

```typescript
export async function markEventProcessed(eventId: string, eventType: string): Promise<boolean>;
// Returns true if INSERT succeeded (first time seeing this event_id)
// Returns false if ON CONFLICT (event_id) DO NOTHING skipped (duplicate)
```

## Testing strategy

| Layer | Tests | Approach |
|---|---|---|
| `paymentService.capturePayment` (Stripe) | 2 | `vi.mock('stripe')` factory; verify intent shape + return mapping |
| `paymentService.capturePayment` (mock) | 1 | Direct call; verify deterministic output |
| `runCaptureForMilestone` happy path | 1 | Mock all queries + payment service. Verify INSERT, Stripe call, success return |
| `runCaptureForMilestone` reuse-pending (intent.status='requires_payment_method') | 1 | Mock retrieves PaymentIntent, returns existing client_secret |
| `runCaptureForMilestone` reuse-pending (intent.status='succeeded') | 1 | Mock returns alreadyFunded=true, no new PaymentIntent |
| `runCaptureForMilestone` reuse-pending (intent.status='canceled') | 1 | Mock deletes stale row, falls through to create new |
| `runCaptureForMilestone` gates (each error variant) | 8 | Mock each gate failing in turn: unauthorized, not_owner, job_not_fundable, milestone_not_pending, milestone_not_in_job, job_has_no_accepted_bid, pro_not_verified, beta_cap_exceeded |
| `runCaptureForMilestone` partial-unique-index race | 1 | Mock insertPendingPayment returns inserted=false → reuse path entered |
| `payment_intent.succeeded` webhook handler | 4 | Mock queries. Cases: success, no metadata.paymentRowId (warn+200), duplicate event (idempotency), unknown payment row (warn+200) |
| `payment_intent.payment_failed` webhook handler | 2 | Cases: success (DELETE called), duplicate event (idempotency) |
| Webhook secret guard (C-4) | 2 | Cases: NODE_ENV=test bypasses, NODE_ENV=development without secret returns 503 |
| `markEventProcessed` | 2 | Mock Drizzle insert with ON CONFLICT; first call returns true, duplicate returns false |
| `markPaymentHeld` (transactional) | 1 | Mock Drizzle transaction; verify both UPDATEs called |
| `<PaymentElementClient>` | 0 | Stripe SDK coupled, no unit test possible |
| Funding page (`page.tsx`) | 0 | Server Component driving mock data; build verifies |

Total: ~27 new tests. All unit tests with mocked queries — no DB integration test infrastructure required (matches existing codebase pattern). Failure baseline preserved at 0.

### Manual end-to-end smoke

1. Set `STRIPE_SECRET_KEY=sk_test_*`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_*` in `.env.local`
2. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` in a separate terminal; copy the printed `whsec_*` to `.env.local` as `STRIPE_WEBHOOK_SECRET`
3. `npm run dev`
4. Sign up as a pro → complete onboarding (Plan 1 work, must reach `stripe_account_status='active'`)
5. Sign up as a client → post a job → accept the pro's bid
6. Auto-redirected to `/client/my-jobs/[id]/milestones/[mid]/fund`
7. Stripe `<PaymentElement>` renders inline
8. Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC, any zip
9. Submit → redirected to job detail; "Funded ✓" badge appears
10. Stripe Dashboard (test mode) shows the PaymentIntent in 'succeeded' state with funds in platform balance
11. Check `payments` table: row has status='held', heldAt set, stripe_payment_intent_id populated
12. Check `job_milestones` table: row has status='funded' (I-2 fix verification)
13. Check `stripe_events_processed`: row exists with the event_id

Test the failure path: use card `4000 0000 0000 0002` (Stripe's test card that always declines). Expect: `payment_intent.payment_failed` fires, payments row is deleted (I-1 fix verification).

## Followups (deferred)

- **Plan 2b** (release path): `releasePayout`, `Transfer.create`, `transfer.created` + `charge.dispute.created` + `payout.failed` webhooks, commission application at transfer time, pro payout dashboard
- **Admin tooling for stuck funds (I-5).** When a pro becomes restricted/disabled post-capture and never re-verifies, money is held in platform balance with no automated path back to the client. Pre-launch admin tooling required: ability to manually trigger refunds via Stripe dashboard or admin UI. Block real-money cutover on this.
- **Vercel cron to clean up stale 'pending' payments** older than 24h (matches Stripe PaymentIntent TTL). Mitigates the orphan-row window.
- **TTL on `stripe_events_processed`**: purge events older than 30 days (Stripe doesn't retry past 7).
- **Postgres advisory lock for cross-milestone cap race** (C-2 production hardening). Currently accepted-race + monitoring; production hardening adds the lock for a fully-correct cap enforcement.
- **Saved cards** for repeat clients (SetupIntent + Customer + off-session).
- **Apple Pay / Google Pay / Link** (`automatic_payment_methods`) once live mode rolls out and Stripe dashboard payment-method config is verified.
- **Granular bid-accept gate** preventing clients from accepting bids from unverified pros (orthogonal — currently gate is at fund-time).
- **Receipt emails** via `paymentIntents.create({ receipt_email: clientEmail })` (M-5 fix). Note: this is a CODE CHANGE, not a Stripe dashboard config alone. Defer to Plan 2b or a polish pass.
- **3DS / SCA challenge UX in PWA mode** (M-4). For US consumer cards, 3DS is rare; if it fires in standalone-PWA context the redirect behavior is browser-defined. Address if real customers report friction.

## Spec self-review (v2)

- ✅ Placeholder scan: zero TBDs except the bid-accept route path (genuinely needs codebase investigation in implementation phase — flagged, not glossed)
- ✅ Internal consistency: cap-includes-pending matches reuse-pending logic; webhook lookup by paymentRowId matches the no-`stripe_payment_intent_id`-index decision; `payment_method_types: ['card']` consistent across capture endpoint and Stripe service; pro lookup via bids→pros→users consistent across data flow, gates, query helpers
- ✅ Scope: Plan 2a (capture) only; release explicitly deferred to Plan 2b
- ✅ Stripe API calls match current Stripe Node SDK 22.x (`paymentIntents.create`, `paymentIntents.retrieve`)
- ✅ Idempotency: webhook dedupe via stripe_events_processed; reuse-pending prevents duplicate PaymentIntents per (job, milestone, payer); partial unique index enforces same-milestone serialization at DB level
- ✅ Error response shape consistent with Plan 1 endpoints (`{ error: string }`)
- ✅ All 5 Critical findings (C-1 through C-5) addressed with concrete fixes
- ✅ All 7 Important findings (I-1 through I-7) addressed (some via deferral with explicit followup, e.g., admin tooling, advisory lock)
- ✅ All Minor findings addressed or explicitly accepted

## Outstanding policy decision

**C-4 webhook secret policy:** the spec defaults to "require secret outside `NODE_ENV === 'test'`". Local dev developers must run `stripe listen` to get a `whsec_*`. CI tests bypass via `NODE_ENV=test`. Prod requires the secret in Vercel env. This closes the security gap where forged webhook events could flip payment status without authentication. **User confirmation requested before plan-writing proceeds.** Alternative policies (looser bypass for any non-prod env, stricter no-bypass-ever) are open for discussion.
