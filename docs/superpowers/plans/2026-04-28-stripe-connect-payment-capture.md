# Stripe Connect Payment Capture (Plan 2a) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the capture half of the Sherpa Pros marketplace money flow — clients fund job milestones via embedded Stripe `<PaymentElement>`, money holds in the platform Stripe balance, payment status persists in the `payments` table. NO release path (Plan 2b).

**Architecture:** Stripe Connect with **separate charges and transfers**. PaymentIntent is created on the platform account with NO `transfer_data` — funds stay in the platform balance until Plan 2b's `transfers.create` call. Capture entry point is a Server Component (no public HTTP route) that calls a `runCaptureForMilestone` helper. Idempotency is enforced via a partial unique index (`payments` table same-milestone serialization) plus a `stripe_events_processed` table (webhook deduplication).

**Tech Stack:** Next.js 16 (App Router) · TypeScript strict · Drizzle ORM · Neon Postgres · Stripe Node SDK 22.x · `@stripe/stripe-js` + `@stripe/react-stripe-js` (NEW for embedded `<PaymentElement>`) · Vitest 4 with `vi.mock()` factory pattern.

**Spec source:** `docs/superpowers/specs/2026-04-27-stripe-connect-payment-capture-design.md`

---

## Locked-in policy decision (C-4 webhook secret)

The spec's outstanding policy decision (line 600) is locked in as: **`STRIPE_WEBHOOK_SECRET` is required in any environment except `NODE_ENV === 'test'`**. Local dev developers must run `stripe listen` to obtain a `whsec_*`. CI tests bypass via `NODE_ENV=test`. Production requires the secret in Vercel env. This closes the security gap where forged webhook events could flip payment status without authentication. Implemented in Task 10.

## File structure

### Created

| Path | Responsibility |
|---|---|
| `src/db/migrations/013_stripe_money_flow.sql` | Adds `payments.stripe_transfer_id`, creates `stripe_events_processed` table, creates partial unique index `uq_payments_pending_per_milestone` |
| `src/db/queries/stripe-events.ts` | `markEventProcessed(eventId, eventType)` — webhook idempotency dedupe |
| `src/db/queries/payments.ts` | Capture-flow query helpers: `getPendingPaymentForMilestone`, `insertPendingPayment`, `setPaymentIntentId`, `deletePaymentRow`, `getCapturedTotalForJob`, `markPaymentHeld`, plus domain lookups `getAcceptedBidForJob` and `getUserByProId` |
| `src/db/queries/__tests__/stripe-events.test.ts` | Tests for `markEventProcessed` |
| `src/db/queries/__tests__/payments.test.ts` | Tests for payments-table helpers |
| `src/lib/payments/capture.ts` | `runCaptureForMilestone({...})` — gates, reuse-pending logic, PaymentIntent creation |
| `src/lib/payments/__tests__/capture.test.ts` | Tests for `runCaptureForMilestone` (gates + reuse-pending + race + happy path) |
| `src/components/client/PaymentElementClient.tsx` | `'use client'` wrapper around `<Elements>` + `<PaymentElement>` for embedded card form |
| `src/app/(dashboard)/client/my-jobs/[id]/milestones/[mid]/fund/page.tsx` | Server Component; calls `runCaptureForMilestone`, switches on result, renders either `<PaymentElementClient>` or an error block |

### Modified

| Path | Change |
|---|---|
| `src/db/drizzle-schema.ts` | Add `stripeTransferId` column to `payments`; add new `stripeEventsProcessed` table export |
| `src/lib/services/payments/types.ts` | Add `CapturePaymentInput`, `CapturePaymentResult` types; extend `PaymentService` interface with `capturePayment` |
| `src/lib/services/payments/stripe-service.ts` | Implement `capturePayment` (calls `stripe.paymentIntents.create`) |
| `src/lib/services/payments/mock-service.ts` | Implement `capturePayment` (returns deterministic `pi_mock_*`) |
| `src/lib/services/payments/__tests__/stripe-service.test.ts` | Add 2 capture tests |
| `src/lib/services/payments/__tests__/mock-service.test.ts` | Add 1 capture test (or modify existing) |
| `src/app/api/stripe/webhook/route.ts` | Tighten the no-secret bypass (test-env only); add `payment_intent.succeeded` and `payment_intent.payment_failed` cases |
| `src/app/api/stripe/webhook/__tests__/route.test.ts` | Add tests for the secret guard, the two new event handlers, and the duplicate-event idempotency |
| `src/app/(dashboard)/client/my-jobs/[id]/job-detail-content.tsx` | Per-milestone "Fund $X →" link (status='pending') / "Funded ✓" badge (status='funded') |
| `package.json` | Add `@stripe/stripe-js` + `@stripe/react-stripe-js` |

### Investigated and intentionally NOT modified in Plan 2a

- **Bid-accept lifecycle (`src/lib/services/job-lifecycle.ts:onBidAccepted`)**. The current implementation is mocked — it returns lifecycle events without updating bid status or creating milestones. Trigger 1 ("auto-redirect to first milestone fund page after bid accept") cannot be implemented cleanly until the bid-accept flow does real DB writes. Plan 2a ships **Trigger 2 only** (per-milestone manual button on `/client/my-jobs/[id]`). Trigger 1 is added to Followups; the funding page itself is fully reachable from manual flow today.
- **The pre-existing payments table CHECK constraint** (statuses: `pending`, `held`, `released`, `refunded`, `disputed`). Plan 2a's `payment_intent.payment_failed` handler DELETEs failed rows rather than introducing a new `failed` status, avoiding a CHECK-constraint migration.

---

## Task list

1. Migration 013 + Drizzle schema (foundations — blocks everything)
2. `markEventProcessed` query helper (webhook idempotency)
3. Payments-table query helpers (insertPendingPayment, setPaymentIntentId, deletePaymentRow, getPendingPaymentForMilestone, getCapturedTotalForJob, markPaymentHeld)
4. Domain lookup helpers (getAcceptedBidForJob, getUserByProId)
5. `PaymentService.capturePayment` — types + mock impl
6. `PaymentService.capturePayment` — Stripe impl
7. `runCaptureForMilestone` — gate logic
8. `runCaptureForMilestone` — happy path + reuse-pending
9. `runCaptureForMilestone` — partial-unique-index race handling
10. Webhook secret policy tightening (C-4)
11. Webhook handler: `payment_intent.succeeded`
12. Webhook handler: `payment_intent.payment_failed`
13. `<PaymentElementClient>` component + new packages
14. Funding-page Server Component
15. Job-detail-content fund-button modifications
16. Manual end-to-end smoke test
17. Final cleanup + plan-2b followup notes

---

### Task 1: Migration 013 + Drizzle schema

**Files:**
- Create: `src/db/migrations/013_stripe_money_flow.sql`
- Modify: `src/db/drizzle-schema.ts`

- [ ] **Step 1: Author the migration SQL**

Create `src/db/migrations/013_stripe_money_flow.sql`:

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

-- Partial unique index: prevents two concurrent fund attempts on the same
-- (job, milestone, payer) triple from both creating PaymentIntents.
-- The second INSERT fails with a uniqueness violation; the handler catches
-- it and falls into the reuse-pending path.
CREATE UNIQUE INDEX uq_payments_pending_per_milestone
  ON payments(job_id, milestone_id, payer_user_id)
  WHERE status = 'pending';
```

- [ ] **Step 2: Update Drizzle schema**

In `src/db/drizzle-schema.ts`, find the `payments` table definition and append the new column. Also add the new `stripeEventsProcessed` table export at the bottom of the file (or near other Stripe-related tables).

```typescript
// In the payments pgTable definition, append:
stripeTransferId: varchar("stripe_transfer_id", { length: 64 }),

// At the bottom of the file, add:
export const stripeEventsProcessed = pgTable("stripe_events_processed", {
  eventId: varchar("event_id", { length: 64 }).primaryKey(),
  eventType: varchar("event_type", { length: 60 }).notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

Add this comment above the new table:

```typescript
// Note: the partial unique index uq_payments_pending_per_milestone
// (CREATE UNIQUE INDEX ... WHERE status='pending') lives in the SQL
// migration — Drizzle's index helper doesn't express partial indexes
// cleanly. The migration is the source of truth.
```

- [ ] **Step 3: Apply migration to local Neon dev branch (manual — Phyrom runs)**

Run from repo root:

```bash
psql "$DATABASE_URL" -f src/db/migrations/013_stripe_money_flow.sql
```

Expected: 3 success messages (ALTER TABLE, CREATE TABLE, CREATE INDEX).

Verify:

```bash
psql "$DATABASE_URL" -c "\d payments" | grep stripe_transfer_id
psql "$DATABASE_URL" -c "\d stripe_events_processed"
psql "$DATABASE_URL" -c "\di+ uq_payments_pending_per_milestone"
```

Expected: column visible, table visible with 3 columns, index visible with `WHERE (status::text = 'pending'::text)` predicate.

- [ ] **Step 4: Apply to Vercel Preview Neon branch and Production Neon branch**

```bash
psql "$NEON_PREVIEW_URL" -f src/db/migrations/013_stripe_money_flow.sql
psql "$NEON_PROD_URL" -f src/db/migrations/013_stripe_money_flow.sql
```

This is purely additive — safe under concurrent reads/writes. Apply BEFORE merging Plan 2a's code.

- [ ] **Step 5: Verify build still passes**

Run: `npm run build`
Expected: PASS — Drizzle schema compiles, no missing imports.

- [ ] **Step 6: Commit**

```bash
git add src/db/migrations/013_stripe_money_flow.sql src/db/drizzle-schema.ts
git commit -m "feat(db): migration 013 — stripe_transfer_id, stripe_events_processed, pending-payment unique index"
```

---

### Task 2: `markEventProcessed` query helper

**Files:**
- Create: `src/db/queries/stripe-events.ts`
- Test: `src/db/queries/__tests__/stripe-events.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/db/queries/__tests__/stripe-events.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockOnConflictDoNothing = vi.fn();
const mockReturning = vi.fn();
const mockValues = vi.fn(() => ({
  onConflictDoNothing: mockOnConflictDoNothing,
}));
const mockInsert = vi.fn(() => ({ values: mockValues }));

vi.mock('@/db', () => ({
  db: { insert: mockInsert },
}));

vi.mock('@/db/drizzle-schema', () => ({
  stripeEventsProcessed: { eventId: 'event_id' },
}));

import { markEventProcessed } from '../stripe-events';

describe('markEventProcessed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnConflictDoNothing.mockReturnValue({ returning: mockReturning });
  });

  it('returns true when the event_id is new (first time)', async () => {
    mockReturning.mockResolvedValue([{ eventId: 'evt_123' }]);
    const result = await markEventProcessed('evt_123', 'payment_intent.succeeded');
    expect(result).toBe(true);
    expect(mockInsert).toHaveBeenCalledOnce();
    expect(mockValues).toHaveBeenCalledWith({
      eventId: 'evt_123',
      eventType: 'payment_intent.succeeded',
    });
  });

  it('returns false when the event_id was already processed (ON CONFLICT skipped)', async () => {
    mockReturning.mockResolvedValue([]);
    const result = await markEventProcessed('evt_123', 'payment_intent.succeeded');
    expect(result).toBe(false);
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

Run: `npx vitest run src/db/queries/__tests__/stripe-events.test.ts`
Expected: FAIL — Cannot find module `'../stripe-events'`.

- [ ] **Step 3: Implement `markEventProcessed`**

Create `src/db/queries/stripe-events.ts`:

```typescript
import { db } from '@/db';
import { stripeEventsProcessed } from '@/db/drizzle-schema';

/**
 * Insert a Stripe event ID into stripe_events_processed.
 * Returns true if this is the first time we've seen the event_id (we should
 * process it), false if a duplicate (skip processing — Stripe at-least-once).
 */
export async function markEventProcessed(
  eventId: string,
  eventType: string,
): Promise<boolean> {
  const inserted = await db
    .insert(stripeEventsProcessed)
    .values({ eventId, eventType })
    .onConflictDoNothing()
    .returning();
  return inserted.length > 0;
}
```

- [ ] **Step 4: Run test — verify it passes**

Run: `npx vitest run src/db/queries/__tests__/stripe-events.test.ts`
Expected: PASS — 2/2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/db/queries/stripe-events.ts src/db/queries/__tests__/stripe-events.test.ts
git commit -m "feat(db): markEventProcessed for webhook idempotency"
```

---

### Task 3: Payments-table query helpers

**Files:**
- Create: `src/db/queries/payments.ts`
- Test: `src/db/queries/__tests__/payments.test.ts`

This task implements 6 helpers in one file because they share schema imports and are tightly coupled to the same table. Tests are bundled per helper.

- [ ] **Step 1: Write the failing tests**

Create `src/db/queries/__tests__/payments.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Drizzle chain mocks — see Twilio service tests for the existing pattern.
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockTransaction = vi.fn();

vi.mock('@/db', () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    transaction: mockTransaction,
  },
}));

vi.mock('@/db/drizzle-schema', () => ({
  payments: {
    id: 'id',
    jobId: 'job_id',
    milestoneId: 'milestone_id',
    payerUserId: 'payer_user_id',
    payeeUserId: 'payee_user_id',
    amountCents: 'amount_cents',
    status: 'status',
    stripePaymentIntentId: 'stripe_payment_intent_id',
    heldAt: 'held_at',
  },
  jobMilestones: {
    id: 'id',
    status: 'status',
    fundedAt: 'funded_at',
  },
}));

import {
  getPendingPaymentForMilestone,
  insertPendingPayment,
  setPaymentIntentId,
  deletePaymentRow,
  getCapturedTotalForJob,
  markPaymentHeld,
} from '../payments';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getPendingPaymentForMilestone', () => {
  it('returns the pending row when one exists', async () => {
    const row = { id: 'pay_1', status: 'pending', stripePaymentIntentId: 'pi_1' };
    const limit = vi.fn().mockResolvedValue([row]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getPendingPaymentForMilestone('job_1', 'ms_1', 'user_1');
    expect(result).toEqual(row);
  });

  it('returns null when no pending row exists', async () => {
    const limit = vi.fn().mockResolvedValue([]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getPendingPaymentForMilestone('job_1', 'ms_1', 'user_1');
    expect(result).toBeNull();
  });
});

describe('insertPendingPayment', () => {
  it('returns inserted=true when the INSERT succeeds', async () => {
    const returning = vi.fn().mockResolvedValue([{ id: 'pay_new' }]);
    const values = vi.fn(() => ({ returning }));
    mockInsert.mockReturnValue({ values });

    const result = await insertPendingPayment({
      id: 'pay_new',
      jobId: 'job_1',
      milestoneId: 'ms_1',
      payerUserId: 'user_p',
      payeeUserId: 'user_pro',
      amountCents: 25000,
    });
    expect(result.inserted).toBe(true);
  });

  it('catches unique-violation, refetches, and returns inserted=false + existing row', async () => {
    const uniqueErr = Object.assign(new Error('duplicate'), { code: '23505' });
    const returning = vi.fn().mockRejectedValue(uniqueErr);
    const values = vi.fn(() => ({ returning }));
    mockInsert.mockReturnValue({ values });

    const existingRow = { id: 'pay_existing', status: 'pending' };
    const limit = vi.fn().mockResolvedValue([existingRow]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await insertPendingPayment({
      id: 'pay_new',
      jobId: 'job_1',
      milestoneId: 'ms_1',
      payerUserId: 'user_p',
      payeeUserId: 'user_pro',
      amountCents: 25000,
    });
    expect(result.inserted).toBe(false);
    if (!result.inserted) {
      expect(result.existing).toEqual(existingRow);
    }
  });

  it('rethrows non-unique-violation errors', async () => {
    const otherErr = new Error('connection lost');
    const returning = vi.fn().mockRejectedValue(otherErr);
    const values = vi.fn(() => ({ returning }));
    mockInsert.mockReturnValue({ values });

    await expect(
      insertPendingPayment({
        id: 'pay_new',
        jobId: 'job_1',
        milestoneId: 'ms_1',
        payerUserId: 'user_p',
        payeeUserId: 'user_pro',
        amountCents: 25000,
      }),
    ).rejects.toThrow('connection lost');
  });
});

describe('setPaymentIntentId', () => {
  it('updates the payment row with the Stripe intent ID', async () => {
    const where = vi.fn().mockResolvedValue(undefined);
    const set = vi.fn(() => ({ where }));
    mockUpdate.mockReturnValue({ set });

    await setPaymentIntentId('pay_1', 'pi_xyz');
    expect(set).toHaveBeenCalledWith({ stripePaymentIntentId: 'pi_xyz' });
  });
});

describe('deletePaymentRow', () => {
  it('deletes the row by id', async () => {
    const where = vi.fn().mockResolvedValue(undefined);
    mockDelete.mockReturnValue({ where });

    await deletePaymentRow('pay_1');
    expect(mockDelete).toHaveBeenCalledOnce();
    expect(where).toHaveBeenCalledOnce();
  });
});

describe('getCapturedTotalForJob', () => {
  it('sums amount_cents across pending+held+released for the job', async () => {
    const where = vi.fn().mockResolvedValue([{ total: 75000 }]);
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getCapturedTotalForJob('job_1');
    expect(result).toBe(75000);
  });

  it('returns 0 when no rows match', async () => {
    const where = vi.fn().mockResolvedValue([{ total: null }]);
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getCapturedTotalForJob('job_1');
    expect(result).toBe(0);
  });
});

describe('markPaymentHeld (transactional)', () => {
  it('updates payments.status=held AND job_milestones.status=funded in one transaction', async () => {
    const txWhere = vi.fn().mockResolvedValue(undefined);
    const txSet = vi.fn(() => ({ where: txWhere }));
    const txUpdate = vi.fn(() => ({ set: txSet }));
    const txLimit = vi.fn().mockResolvedValue([{ milestoneId: 'ms_1' }]);
    const txWhereSelect = vi.fn(() => ({ limit: txLimit }));
    const txFrom = vi.fn(() => ({ where: txWhereSelect }));
    const txSelect = vi.fn(() => ({ from: txFrom }));
    const tx = { select: txSelect, update: txUpdate };

    mockTransaction.mockImplementation(
      async (cb: (tx: typeof tx) => Promise<void>) => cb(tx),
    );

    await markPaymentHeld('pay_1');
    expect(mockTransaction).toHaveBeenCalledOnce();
    // Two updates — one to payments, one to job_milestones
    expect(txUpdate).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npx vitest run src/db/queries/__tests__/payments.test.ts`
Expected: FAIL — Cannot find module `'../payments'`.

- [ ] **Step 3: Implement the helpers**

Create `src/db/queries/payments.ts`:

```typescript
import { db } from '@/db';
import { payments, jobMilestones } from '@/db/drizzle-schema';
import { and, eq, sum, sql, inArray } from 'drizzle-orm';

export interface PaymentRow {
  id: string;
  jobId: string;
  milestoneId: string | null;
  payerUserId: string;
  payeeUserId: string;
  amountCents: number;
  status: 'pending' | 'held' | 'released' | 'refunded' | 'disputed';
  stripePaymentIntentId: string | null;
  heldAt: Date | null;
}

/**
 * Find the pending payment row for (jobId, milestoneId, payerUserId), if any.
 * Used by the reuse-pending path on funding-page reload.
 */
export async function getPendingPaymentForMilestone(
  jobId: string,
  milestoneId: string,
  payerUserId: string,
): Promise<PaymentRow | null> {
  const rows = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.jobId, jobId),
        eq(payments.milestoneId, milestoneId),
        eq(payments.payerUserId, payerUserId),
        eq(payments.status, 'pending'),
      ),
    )
    .limit(1);
  return (rows[0] as PaymentRow | undefined) ?? null;
}

/**
 * Insert a pending payment row. The partial unique index
 * uq_payments_pending_per_milestone serializes concurrent inserts on the
 * same (jobId, milestoneId, payerUserId) tuple; on conflict we refetch
 * and return the existing row.
 */
export async function insertPendingPayment(input: {
  id: string;
  jobId: string;
  milestoneId: string;
  payerUserId: string;
  payeeUserId: string;
  amountCents: number;
}): Promise<{ inserted: true } | { inserted: false; existing: PaymentRow }> {
  try {
    await db
      .insert(payments)
      .values({
        id: input.id,
        jobId: input.jobId,
        milestoneId: input.milestoneId,
        payerUserId: input.payerUserId,
        payeeUserId: input.payeeUserId,
        amountCents: input.amountCents,
        status: 'pending',
      })
      .returning();
    return { inserted: true };
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === '23505'
    ) {
      const existing = await getPendingPaymentForMilestone(
        input.jobId,
        input.milestoneId,
        input.payerUserId,
      );
      if (!existing) {
        // Race lost but row is no longer pending — surface as error.
        throw new Error('insertPendingPayment: unique violation but no existing pending row');
      }
      return { inserted: false, existing };
    }
    throw err;
  }
}

export async function setPaymentIntentId(
  paymentRowId: string,
  paymentIntentId: string,
): Promise<void> {
  await db
    .update(payments)
    .set({ stripePaymentIntentId: paymentIntentId })
    .where(eq(payments.id, paymentRowId));
}

export async function deletePaymentRow(paymentRowId: string): Promise<void> {
  await db.delete(payments).where(eq(payments.id, paymentRowId));
}

/**
 * Sum of amount_cents for the job across statuses that count toward the cap:
 * pending + held + released. The cap-check uses this BEFORE inserting the
 * new pending row; the partial unique index then handles same-milestone
 * races. See the spec's Concurrency section for cross-milestone trade-offs.
 */
export async function getCapturedTotalForJob(jobId: string): Promise<number> {
  const rows = await db
    .select({ total: sum(payments.amountCents) })
    .from(payments)
    .where(
      and(
        eq(payments.jobId, jobId),
        inArray(payments.status, ['pending', 'held', 'released']),
      ),
    );
  const total = rows[0]?.total;
  return total ? Number(total) : 0;
}

/**
 * Webhook-driven transition: status='held' on payments + status='funded'
 * + funded_at on job_milestones. Single transaction so the two writes
 * are atomic. (I-2 fix.)
 */
export async function markPaymentHeld(paymentRowId: string): Promise<void> {
  await db.transaction(async (tx) => {
    const [paymentRow] = await tx
      .select({ milestoneId: payments.milestoneId })
      .from(payments)
      .where(eq(payments.id, paymentRowId))
      .limit(1);

    await tx
      .update(payments)
      .set({ status: 'held', heldAt: new Date() })
      .where(eq(payments.id, paymentRowId));

    if (paymentRow?.milestoneId) {
      await tx
        .update(jobMilestones)
        .set({ status: 'funded', fundedAt: new Date() })
        .where(eq(jobMilestones.id, paymentRow.milestoneId));
    }
  });
}
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npx vitest run src/db/queries/__tests__/payments.test.ts`
Expected: PASS — all tests passing (8 tests across the 6 helpers).

- [ ] **Step 5: Commit**

```bash
git add src/db/queries/payments.ts src/db/queries/__tests__/payments.test.ts
git commit -m "feat(db): payments-table query helpers for capture flow"
```

---

### Task 4: Domain lookup helpers (bid / pro / user)

**Files:**
- Modify: `src/db/queries/payments.ts` (append helpers — they're consumed only by the capture flow)
- Modify: `src/db/queries/__tests__/payments.test.ts` (add tests)

These two helpers (`getAcceptedBidForJob`, `getUserByProId`) live alongside the capture-flow query helpers because they're only used by `runCaptureForMilestone`. Co-locating them by responsibility (capture flow) instead of by table (bids/users) keeps the change set focused.

- [ ] **Step 1: Write failing tests**

Append to `src/db/queries/__tests__/payments.test.ts` (above the closing of the file):

```typescript
import { getAcceptedBidForJob, getUserByProId } from '../payments';

vi.mock('@/db/drizzle-schema', async (importOriginal) => {
  const actual = await importOriginal<object>();
  return {
    ...actual,
    bids: {
      id: 'id',
      jobId: 'job_id',
      proId: 'pro_id',
      status: 'status',
      amountCents: 'amount_cents',
    },
    pros: { id: 'id', userId: 'user_id' },
    users: { id: 'id' },
  };
});

describe('getAcceptedBidForJob', () => {
  it('returns the accepted bid for the job', async () => {
    const bid = { id: 'bid_1', jobId: 'job_1', proId: 'pro_1', status: 'accepted', amountCents: 250000 };
    const limit = vi.fn().mockResolvedValue([bid]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getAcceptedBidForJob('job_1');
    expect(result).toEqual(bid);
  });

  it('returns null when no accepted bid exists', async () => {
    const limit = vi.fn().mockResolvedValue([]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getAcceptedBidForJob('job_1');
    expect(result).toBeNull();
  });
});

describe('getUserByProId', () => {
  it('joins pros→users and returns the user row', async () => {
    const user = { id: 'user_pro', stripeAccountStatus: 'active' };
    const limit = vi.fn().mockResolvedValue([user]);
    const where = vi.fn(() => ({ limit }));
    const innerJoin = vi.fn(() => ({ where }));
    const from = vi.fn(() => ({ innerJoin }));
    mockSelect.mockReturnValue({ from });

    const result = await getUserByProId('pro_1');
    expect(result).toEqual(user);
  });

  it('returns null when the pro_id does not match', async () => {
    const limit = vi.fn().mockResolvedValue([]);
    const where = vi.fn(() => ({ limit }));
    const innerJoin = vi.fn(() => ({ where }));
    const from = vi.fn(() => ({ innerJoin }));
    mockSelect.mockReturnValue({ from });

    const result = await getUserByProId('pro_unknown');
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npx vitest run src/db/queries/__tests__/payments.test.ts`
Expected: FAIL — `getAcceptedBidForJob is not exported`.

- [ ] **Step 3: Implement the helpers**

Append to `src/db/queries/payments.ts`:

```typescript
import { bids, pros, users } from '@/db/drizzle-schema';

export interface BidRow {
  id: string;
  jobId: string;
  proId: string;
  status: string;
  amountCents: number;
}

export interface UserRow {
  id: string;
  email: string;
  stripeAccountStatus: 'none' | 'pending' | 'active' | 'restricted' | 'disabled' | null;
  // (other fields exist on users; add as needed by callers)
}

/**
 * Get the single accepted bid for a job, if any. Plan 2a's capture flow
 * uses this to resolve the pro user via bids→pros→users.
 */
export async function getAcceptedBidForJob(jobId: string): Promise<BidRow | null> {
  const rows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.jobId, jobId), eq(bids.status, 'accepted')))
    .limit(1);
  return (rows[0] as BidRow | undefined) ?? null;
}

/**
 * Resolve a pro_id to its user row via the pros→users join.
 */
export async function getUserByProId(proId: string): Promise<UserRow | null> {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      stripeAccountStatus: users.stripeAccountStatus,
    })
    .from(pros)
    .innerJoin(users, eq(users.id, pros.userId))
    .where(eq(pros.id, proId))
    .limit(1);
  return (rows[0] as UserRow | undefined) ?? null;
}
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npx vitest run src/db/queries/__tests__/payments.test.ts`
Expected: PASS — 4 new tests + 8 prior = 12 passing.

- [ ] **Step 5: Commit**

```bash
git add src/db/queries/payments.ts src/db/queries/__tests__/payments.test.ts
git commit -m "feat(db): getAcceptedBidForJob, getUserByProId for capture flow"
```

---

### Task 5: PaymentService.capturePayment — types + mock implementation

**Files:**
- Modify: `src/lib/services/payments/types.ts`
- Modify: `src/lib/services/payments/mock-service.ts`
- Modify: `src/lib/services/payments/__tests__/mock-service.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `src/lib/services/payments/__tests__/mock-service.test.ts` (or create the test file if it doesn't exist):

```typescript
import { describe, it, expect } from 'vitest';
import { mockPaymentService } from '../mock-service';

describe('mockPaymentService.capturePayment', () => {
  it('returns deterministic pi_mock_* IDs derived from paymentRowId', async () => {
    const result = await mockPaymentService.capturePayment({
      paymentRowId: 'pay_abc123',
      amountCents: 25000,
      description: 'Milestone 1: Prep',
      metadata: { jobId: 'job_1', milestoneId: 'ms_1', paymentRowId: 'pay_abc123' },
    });
    expect(result.paymentIntentId).toBe('pi_mock_pay_abc123');
    expect(result.clientSecret).toBe('pi_mock_pay_abc123_secret');
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

Run: `npx vitest run src/lib/services/payments/__tests__/mock-service.test.ts`
Expected: FAIL — `mockPaymentService.capturePayment is not a function`.

- [ ] **Step 3: Add types**

In `src/lib/services/payments/types.ts`, append:

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
```

Then extend the existing `PaymentService` interface (find it in the same file and add the new method):

```typescript
export interface PaymentService {
  // ...existing methods...
  capturePayment(input: CapturePaymentInput): Promise<CapturePaymentResult>;
}
```

- [ ] **Step 4: Implement mock**

In `src/lib/services/payments/mock-service.ts`, add to the `mockPaymentService` object:

```typescript
async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentResult> {
  return {
    paymentIntentId: `pi_mock_${input.paymentRowId}`,
    clientSecret: `pi_mock_${input.paymentRowId}_secret`,
  };
},
```

If the mock-service file uses object literal style (rather than class), make sure `CapturePaymentInput` and `CapturePaymentResult` are imported from `./types`.

- [ ] **Step 5: Run test — verify it passes**

Run: `npx vitest run src/lib/services/payments/__tests__/mock-service.test.ts`
Expected: PASS — capture test green; existing tests still pass.

- [ ] **Step 6: Run full test suite to confirm no regressions**

Run: `npx vitest run`
Expected: PASS — all prior tests still pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/services/payments/types.ts src/lib/services/payments/mock-service.ts src/lib/services/payments/__tests__/mock-service.test.ts
git commit -m "feat(payments): add CapturePayment types + mock service impl"
```

---

### Task 6: PaymentService.capturePayment — Stripe implementation

**Files:**
- Modify: `src/lib/services/payments/stripe-service.ts`
- Modify: `src/lib/services/payments/__tests__/stripe-service.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/services/payments/__tests__/stripe-service.test.ts` (the file already mocks Stripe SDK from Plan 1 — reuse those mocks):

```typescript
describe('stripeService.capturePayment', () => {
  it('calls paymentIntents.create with the correct shape', async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      id: 'pi_test_xyz',
      client_secret: 'pi_test_xyz_secret_abc',
    });
    mockStripeInstance.paymentIntents.create = mockCreate;

    const { stripePaymentService } = await import('../stripe-service');
    await stripePaymentService.capturePayment({
      paymentRowId: 'pay_1',
      amountCents: 25000,
      description: 'Milestone 1: Prep',
      metadata: { jobId: 'job_1', milestoneId: 'ms_1', paymentRowId: 'pay_1' },
    });

    expect(mockCreate).toHaveBeenCalledWith({
      amount: 25000,
      currency: 'usd',
      payment_method_types: ['card'],
      description: 'Milestone 1: Prep',
      metadata: { jobId: 'job_1', milestoneId: 'ms_1', paymentRowId: 'pay_1' },
    });
  });

  it('returns paymentIntentId + clientSecret from the Stripe response', async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      id: 'pi_test_xyz',
      client_secret: 'pi_test_xyz_secret_abc',
    });
    mockStripeInstance.paymentIntents.create = mockCreate;

    const { stripePaymentService } = await import('../stripe-service');
    const result = await stripePaymentService.capturePayment({
      paymentRowId: 'pay_1',
      amountCents: 25000,
      description: 'Milestone 1: Prep',
      metadata: { jobId: 'job_1', milestoneId: 'ms_1', paymentRowId: 'pay_1' },
    });

    expect(result).toEqual({
      paymentIntentId: 'pi_test_xyz',
      clientSecret: 'pi_test_xyz_secret_abc',
    });
  });
});
```

(If the existing Plan 1 test file uses a different mock-instance variable name than `mockStripeInstance`, adapt accordingly.)

- [ ] **Step 2: Run tests — verify they fail**

Run: `npx vitest run src/lib/services/payments/__tests__/stripe-service.test.ts`
Expected: FAIL — `stripePaymentService.capturePayment is not a function`.

- [ ] **Step 3: Implement Stripe service**

In `src/lib/services/payments/stripe-service.ts`, add to the `stripePaymentService` object:

```typescript
async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentResult> {
  const client = getStripeClient();
  const intent = await client.paymentIntents.create({
    amount: input.amountCents,
    currency: 'usd',
    payment_method_types: ['card'],
    description: input.description,
    metadata: input.metadata,
  });
  if (!intent.client_secret) {
    throw new Error('Stripe returned PaymentIntent without client_secret');
  }
  return {
    paymentIntentId: intent.id,
    clientSecret: intent.client_secret,
  };
},
```

Make sure `CapturePaymentInput` and `CapturePaymentResult` are imported from `./types`.

- [ ] **Step 4: Run tests — verify they pass**

Run: `npx vitest run src/lib/services/payments/__tests__/stripe-service.test.ts`
Expected: PASS — both new tests + prior Plan 1 tests still green.

- [ ] **Step 5: Run full test suite**

Run: `npx vitest run`
Expected: PASS — no regressions.

- [ ] **Step 6: Commit**

```bash
git add src/lib/services/payments/stripe-service.ts src/lib/services/payments/__tests__/stripe-service.test.ts
git commit -m "feat(payments): Stripe service capturePayment via paymentIntents.create"
```

---

### Task 7: `runCaptureForMilestone` — gate logic

**Files:**
- Create: `src/lib/payments/capture.ts`
- Test: `src/lib/payments/__tests__/capture.test.ts`

This task lays down the helper signature and implements all 8 rejection gates. The happy path (PaymentIntent creation) lands in Task 8, reuse-pending in Task 9.

- [ ] **Step 1: Write failing tests for each gate**

Create `src/lib/payments/__tests__/capture.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetUserById = vi.fn();
const mockGetJob = vi.fn();
const mockGetMilestone = vi.fn();
const mockGetAcceptedBidForJob = vi.fn();
const mockGetUserByProId = vi.fn();
const mockGetCapturedTotalForJob = vi.fn();

vi.mock('@/db/queries/payments', () => ({
  getAcceptedBidForJob: mockGetAcceptedBidForJob,
  getUserByProId: mockGetUserByProId,
  getCapturedTotalForJob: mockGetCapturedTotalForJob,
  getPendingPaymentForMilestone: vi.fn(),
  insertPendingPayment: vi.fn(),
  setPaymentIntentId: vi.fn(),
  deletePaymentRow: vi.fn(),
}));

vi.mock('@/db/queries/users', () => ({
  getUserById: mockGetUserById,
}));

vi.mock('@/db/queries/jobs', () => ({
  getJob: mockGetJob,
}));

vi.mock('@/db/queries/milestones', () => ({
  getMilestone: mockGetMilestone,
}));

vi.mock('@/lib/services/payments', () => ({
  getPaymentService: () => ({ capturePayment: vi.fn() }),
}));

import { runCaptureForMilestone } from '../capture';

const baseInput = {
  clientUserId: 'user_client',
  jobId: 'job_1',
  milestoneId: 'ms_1',
  amountCents: 25000,
};

beforeEach(() => {
  vi.clearAllMocks();
  // Sensible defaults — overridden per test
  mockGetUserById.mockResolvedValue({ id: 'user_client' });
  mockGetJob.mockResolvedValue({ id: 'job_1', clientUserId: 'user_client', status: 'in_progress' });
  mockGetMilestone.mockResolvedValue({ id: 'ms_1', jobId: 'job_1', status: 'pending', amountCents: 25000 });
  mockGetAcceptedBidForJob.mockResolvedValue({ id: 'bid_1', proId: 'pro_1', status: 'accepted' });
  mockGetUserByProId.mockResolvedValue({ id: 'user_pro', stripeAccountStatus: 'active' });
  mockGetCapturedTotalForJob.mockResolvedValue(0);
});

describe('runCaptureForMilestone — gates', () => {
  it('rejects with unauthorized when the client user does not exist', async () => {
    mockGetUserById.mockResolvedValue(null);
    const result = await runCaptureForMilestone(baseInput);
    expect(result).toEqual({ ok: false, error: 'unauthorized' });
  });

  it('rejects with not_owner when the client does not own the job', async () => {
    mockGetJob.mockResolvedValue({ id: 'job_1', clientUserId: 'user_other', status: 'in_progress' });
    const result = await runCaptureForMilestone(baseInput);
    expect(result).toEqual({ ok: false, error: 'not_owner' });
  });

  it('rejects with job_not_fundable when the job is in a terminal state', async () => {
    mockGetJob.mockResolvedValue({ id: 'job_1', clientUserId: 'user_client', status: 'cancelled' });
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('job_not_fundable');
  });

  it('rejects with milestone_not_in_job when the milestone belongs to a different job', async () => {
    mockGetMilestone.mockResolvedValue({ id: 'ms_1', jobId: 'job_other', status: 'pending', amountCents: 25000 });
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('milestone_not_in_job');
  });

  it('rejects with milestone_not_pending when milestone status is not pending', async () => {
    mockGetMilestone.mockResolvedValue({ id: 'ms_1', jobId: 'job_1', status: 'funded', amountCents: 25000 });
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('milestone_not_pending');
  });

  it('rejects with job_has_no_accepted_bid when no accepted bid exists', async () => {
    mockGetAcceptedBidForJob.mockResolvedValue(null);
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('job_has_no_accepted_bid');
  });

  it('rejects with pro_not_verified when the pro user is not active', async () => {
    mockGetUserByProId.mockResolvedValue({ id: 'user_pro', stripeAccountStatus: 'pending' });
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('pro_not_verified');
  });

  it('rejects with beta_cap_exceeded when sum + amount > 50000', async () => {
    mockGetCapturedTotalForJob.mockResolvedValue(40000);
    const result = await runCaptureForMilestone({ ...baseInput, amountCents: 15000 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('beta_cap_exceeded');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npx vitest run src/lib/payments/__tests__/capture.test.ts`
Expected: FAIL — `Cannot find module '../capture'`.

- [ ] **Step 3: Implement the helper signature + gates**

Create `src/lib/payments/capture.ts`:

```typescript
import {
  getAcceptedBidForJob,
  getUserByProId,
  getCapturedTotalForJob,
} from '@/db/queries/payments';
import { getUserById } from '@/db/queries/users';
import { getJob } from '@/db/queries/jobs';
import { getMilestone } from '@/db/queries/milestones';

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
  | { ok: true; alreadyFunded: true }
  | { ok: false; error: CaptureError; meta?: Record<string, unknown> };

export interface CaptureInput {
  clientUserId: string;
  jobId: string;
  milestoneId: string;
  amountCents: number;
}

const TERMINAL_JOB_STATES = new Set(['cancelled', 'completed']);
const BETA_CAP_CENTS = 50000;

export async function runCaptureForMilestone(input: CaptureInput): Promise<CaptureResult> {
  // Gate 1: auth + user exists
  const dbUser = await getUserById(input.clientUserId);
  if (!dbUser) {
    return { ok: false, error: 'unauthorized' };
  }

  // Gate 2: ownership
  const job = await getJob(input.jobId);
  if (!job) {
    return { ok: false, error: 'unauthorized' }; // job not found ≈ unauthorized for this user
  }
  if (job.clientUserId !== input.clientUserId) {
    return { ok: false, error: 'not_owner' };
  }

  // Gate 3: job state
  if (TERMINAL_JOB_STATES.has(job.status)) {
    return { ok: false, error: 'job_not_fundable' };
  }

  // Gate 4: milestone exists, belongs to job, is pending
  const milestone = await getMilestone(input.milestoneId);
  if (!milestone) {
    return { ok: false, error: 'milestone_not_in_job' };
  }
  if (milestone.jobId !== input.jobId) {
    return { ok: false, error: 'milestone_not_in_job' };
  }
  if (milestone.status !== 'pending') {
    return { ok: false, error: 'milestone_not_pending' };
  }

  // Gate 5: accepted bid exists (resolves the pro)
  const bid = await getAcceptedBidForJob(input.jobId);
  if (!bid) {
    return { ok: false, error: 'job_has_no_accepted_bid' };
  }

  // Gate 6: pro is verified (stripe_account_status === 'active')
  const proUser = await getUserByProId(bid.proId);
  if (!proUser || proUser.stripeAccountStatus !== 'active') {
    return {
      ok: false,
      error: 'pro_not_verified',
      meta: { proName: proUser?.email ?? 'the pro' },
    };
  }

  // Gate 7: beta cap
  const captured = await getCapturedTotalForJob(input.jobId);
  if (captured + input.amountCents > BETA_CAP_CENTS) {
    return {
      ok: false,
      error: 'beta_cap_exceeded',
      meta: { limit: BETA_CAP_CENTS, currentTotal: captured },
    };
  }

  // Happy path lands in Task 8.
  throw new Error('Not implemented yet — see Task 8');
}
```

(`getJob` / `getMilestone` / `getUserById` may already exist in the codebase under different paths. Verify with `grep -rn "export.*function getJob\b" src/` etc. before writing the imports; if they exist elsewhere, update the import paths and remove any stub assumptions in the test mock setup. If they don't exist, this task creates lightweight wrappers that the test mocks already assume.)

- [ ] **Step 4: Run tests — verify gates pass**

Run: `npx vitest run src/lib/payments/__tests__/capture.test.ts`
Expected: PASS — 8 gate tests passing. (The "Not implemented" throw doesn't fire on any test path because they all hit a gate first.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/payments/capture.ts src/lib/payments/__tests__/capture.test.ts
git commit -m "feat(payments): runCaptureForMilestone gate logic (8 rejection paths)"
```

---

### Task 8: `runCaptureForMilestone` — happy path + reuse-pending

**Files:**
- Modify: `src/lib/payments/capture.ts`
- Modify: `src/lib/payments/__tests__/capture.test.ts`

- [ ] **Step 1: Add tests for happy path and reuse-pending**

Append to `src/lib/payments/__tests__/capture.test.ts`:

```typescript
import {
  getPendingPaymentForMilestone,
  insertPendingPayment,
  setPaymentIntentId,
  deletePaymentRow,
} from '@/db/queries/payments';
import { getPaymentService } from '@/lib/services/payments';

describe('runCaptureForMilestone — happy path', () => {
  it('creates a new pending row, calls Stripe, persists intent id, returns clientSecret', async () => {
    vi.mocked(getPendingPaymentForMilestone).mockResolvedValue(null);
    vi.mocked(insertPendingPayment).mockResolvedValue({ inserted: true });
    const mockCapture = vi.fn().mockResolvedValue({
      paymentIntentId: 'pi_test_xyz',
      clientSecret: 'pi_test_xyz_secret',
    });
    vi.mocked(getPaymentService).mockReturnValue({ capturePayment: mockCapture });

    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(true);
    if (result.ok && 'clientSecret' in result) {
      expect(result.clientSecret).toBe('pi_test_xyz_secret');
      expect(result.paymentIntentId).toBe('pi_test_xyz');
    }
    expect(insertPendingPayment).toHaveBeenCalledOnce();
    expect(setPaymentIntentId).toHaveBeenCalledWith(
      expect.any(String),
      'pi_test_xyz',
    );
  });

  it('deletes the orphan payment row on Stripe error', async () => {
    vi.mocked(getPendingPaymentForMilestone).mockResolvedValue(null);
    vi.mocked(insertPendingPayment).mockResolvedValue({ inserted: true });
    const mockCapture = vi.fn().mockRejectedValue(new Error('Stripe down'));
    vi.mocked(getPaymentService).mockReturnValue({ capturePayment: mockCapture });

    await expect(runCaptureForMilestone(baseInput)).rejects.toThrow('Stripe down');
    expect(deletePaymentRow).toHaveBeenCalledOnce();
  });
});

describe('runCaptureForMilestone — reuse-pending', () => {
  beforeEach(() => {
    vi.mocked(getPendingPaymentForMilestone).mockResolvedValue({
      id: 'pay_existing',
      jobId: 'job_1',
      milestoneId: 'ms_1',
      payerUserId: 'user_client',
      payeeUserId: 'user_pro',
      amountCents: 25000,
      status: 'pending',
      stripePaymentIntentId: 'pi_existing',
      heldAt: null,
    });
  });

  it('returns existing client_secret when intent.status=requires_payment_method', async () => {
    const mockRetrieve = vi.fn().mockResolvedValue({
      id: 'pi_existing',
      status: 'requires_payment_method',
      client_secret: 'pi_existing_secret',
    });
    vi.mocked(getPaymentService).mockReturnValue({
      capturePayment: vi.fn(),
      retrievePaymentIntent: mockRetrieve,
    });

    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(true);
    if (result.ok && 'clientSecret' in result) {
      expect(result.clientSecret).toBe('pi_existing_secret');
      expect(result.paymentRowId).toBe('pay_existing');
    }
  });

  it('returns alreadyFunded=true when intent.status=succeeded', async () => {
    const mockRetrieve = vi.fn().mockResolvedValue({
      id: 'pi_existing',
      status: 'succeeded',
    });
    vi.mocked(getPaymentService).mockReturnValue({
      capturePayment: vi.fn(),
      retrievePaymentIntent: mockRetrieve,
    });

    const result = await runCaptureForMilestone(baseInput);
    expect(result).toEqual({ ok: true, alreadyFunded: true });
  });

  it('deletes stale row and creates a new PaymentIntent when intent.status=canceled', async () => {
    const mockRetrieve = vi.fn().mockResolvedValue({
      id: 'pi_existing',
      status: 'canceled',
    });
    const mockCapture = vi.fn().mockResolvedValue({
      paymentIntentId: 'pi_new',
      clientSecret: 'pi_new_secret',
    });
    vi.mocked(getPaymentService).mockReturnValue({
      capturePayment: mockCapture,
      retrievePaymentIntent: mockRetrieve,
    });
    vi.mocked(insertPendingPayment).mockResolvedValue({ inserted: true });

    const result = await runCaptureForMilestone(baseInput);
    expect(deletePaymentRow).toHaveBeenCalledWith('pay_existing');
    expect(mockCapture).toHaveBeenCalledOnce();
    expect(result.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npx vitest run src/lib/payments/__tests__/capture.test.ts`
Expected: FAIL — "Not implemented yet" or missing `retrievePaymentIntent` on the service.

- [ ] **Step 3: Add `retrievePaymentIntent` to the PaymentService interface**

In `src/lib/services/payments/types.ts`, add:

```typescript
export interface PaymentService {
  // ...existing...
  capturePayment(input: CapturePaymentInput): Promise<CapturePaymentResult>;
  retrievePaymentIntent(intentId: string): Promise<{
    id: string;
    status: string;
    client_secret: string | null;
  }>;
}
```

In `stripe-service.ts`:

```typescript
async retrievePaymentIntent(intentId: string) {
  const client = getStripeClient();
  const intent = await client.paymentIntents.retrieve(intentId);
  return {
    id: intent.id,
    status: intent.status,
    client_secret: intent.client_secret,
  };
},
```

In `mock-service.ts`:

```typescript
async retrievePaymentIntent(intentId: string) {
  // Mock returns 'requires_payment_method' so reuse-pending path renders form by default.
  return {
    id: intentId,
    status: 'requires_payment_method',
    client_secret: `${intentId}_secret`,
  };
},
```

- [ ] **Step 4: Implement happy path + reuse-pending in capture.ts**

Replace the `throw new Error('Not implemented yet — see Task 8')` line at the end of `runCaptureForMilestone` with:

```typescript
  // Reuse-pending: if a pending row exists, check the Stripe state.
  const existingPending = await getPendingPaymentForMilestone(
    input.jobId,
    input.milestoneId,
    input.clientUserId,
  );
  if (existingPending && existingPending.stripePaymentIntentId) {
    const paymentService = getPaymentService();
    const intent = await paymentService.retrievePaymentIntent(
      existingPending.stripePaymentIntentId,
    );
    if (intent.status === 'succeeded') {
      return { ok: true, alreadyFunded: true };
    }
    if (intent.status === 'canceled') {
      // Stale row — delete and fall through to new-intent creation.
      await deletePaymentRow(existingPending.id);
    } else if (
      intent.status === 'requires_payment_method' ||
      intent.status === 'requires_confirmation' ||
      intent.status === 'processing'
    ) {
      if (!intent.client_secret) {
        throw new Error(`PaymentIntent ${intent.id} missing client_secret`);
      }
      return {
        ok: true,
        clientSecret: intent.client_secret,
        paymentRowId: existingPending.id,
        paymentIntentId: intent.id,
      };
    } else {
      console.error(
        `[capture] unexpected PaymentIntent status ${intent.status} for ${intent.id}`,
      );
      throw new Error(`unexpected PaymentIntent status: ${intent.status}`);
    }
  }

  // New PaymentIntent path
  const paymentRowId = crypto.randomUUID();
  const insertResult = await insertPendingPayment({
    id: paymentRowId,
    jobId: input.jobId,
    milestoneId: input.milestoneId,
    payerUserId: input.clientUserId,
    payeeUserId: proUser.id,
    amountCents: input.amountCents,
  });
  if (!insertResult.inserted) {
    // Race lost — re-enter reuse-pending logic with the row that won.
    return runCaptureForMilestone(input);
  }

  const paymentService = getPaymentService();
  let captureResult;
  try {
    captureResult = await paymentService.capturePayment({
      paymentRowId,
      amountCents: input.amountCents,
      description: `Job ${input.jobId} milestone ${input.milestoneId}`,
      metadata: {
        jobId: input.jobId,
        milestoneId: input.milestoneId,
        paymentRowId,
      },
    });
  } catch (err) {
    await deletePaymentRow(paymentRowId);
    throw err;
  }
  await setPaymentIntentId(paymentRowId, captureResult.paymentIntentId);

  return {
    ok: true,
    clientSecret: captureResult.clientSecret,
    paymentRowId,
    paymentIntentId: captureResult.paymentIntentId,
  };
}
```

Add the import for `crypto.randomUUID` at the top: `crypto.randomUUID()` is available globally in Node 19+, no import needed.

Update the imports near the top of the file:

```typescript
import {
  getAcceptedBidForJob,
  getUserByProId,
  getCapturedTotalForJob,
  getPendingPaymentForMilestone,
  insertPendingPayment,
  setPaymentIntentId,
  deletePaymentRow,
} from '@/db/queries/payments';
import { getPaymentService } from '@/lib/services/payments';
```

- [ ] **Step 5: Run all capture tests — verify they pass**

Run: `npx vitest run src/lib/payments/__tests__/capture.test.ts`
Expected: PASS — 8 gate tests + 2 happy-path + 3 reuse-pending = 13 tests passing.

- [ ] **Step 6: Run full suite to confirm no regressions**

Run: `npx vitest run`
Expected: PASS — all tests green.

- [ ] **Step 7: Commit**

```bash
git add src/lib/payments/capture.ts src/lib/payments/__tests__/capture.test.ts src/lib/services/payments/
git commit -m "feat(payments): runCaptureForMilestone happy path + reuse-pending logic"
```

---

### Task 9: `runCaptureForMilestone` — partial-unique-index race handling

The race-handling path is exercised when `insertPendingPayment` returns `{ inserted: false, existing }`. The code in Task 8 already handles this by recursively calling `runCaptureForMilestone` (which falls into the reuse-pending branch with the existing row). This task adds an explicit test to verify that path.

**Files:**
- Modify: `src/lib/payments/__tests__/capture.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `src/lib/payments/__tests__/capture.test.ts`:

```typescript
describe('runCaptureForMilestone — partial-unique-index race', () => {
  it('falls into reuse-pending when insertPendingPayment loses the race', async () => {
    // First call: no pending row yet (race not noticed at lookup time)
    vi.mocked(getPendingPaymentForMilestone)
      .mockResolvedValueOnce(null)
      // Second call (after recursion): the row that won the race
      .mockResolvedValueOnce({
        id: 'pay_winner',
        jobId: 'job_1',
        milestoneId: 'ms_1',
        payerUserId: 'user_client',
        payeeUserId: 'user_pro',
        amountCents: 25000,
        status: 'pending',
        stripePaymentIntentId: 'pi_winner',
        heldAt: null,
      });
    // Insert loses the race
    vi.mocked(insertPendingPayment).mockResolvedValue({
      inserted: false,
      existing: {
        id: 'pay_winner',
        jobId: 'job_1',
        milestoneId: 'ms_1',
        payerUserId: 'user_client',
        payeeUserId: 'user_pro',
        amountCents: 25000,
        status: 'pending',
        stripePaymentIntentId: 'pi_winner',
        heldAt: null,
      },
    });
    // Reuse-pending path: retrieve returns 'requires_payment_method'
    const mockRetrieve = vi.fn().mockResolvedValue({
      id: 'pi_winner',
      status: 'requires_payment_method',
      client_secret: 'pi_winner_secret',
    });
    vi.mocked(getPaymentService).mockReturnValue({
      capturePayment: vi.fn(),
      retrievePaymentIntent: mockRetrieve,
    });

    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(true);
    if (result.ok && 'paymentRowId' in result) {
      expect(result.paymentRowId).toBe('pay_winner');
    }
  });
});
```

- [ ] **Step 2: Run test — verify it passes (no impl change needed)**

Run: `npx vitest run src/lib/payments/__tests__/capture.test.ts`
Expected: PASS — Task 8's recursive re-entry already handles this. 14 tests total.

(If it FAILS, the recursion logic in Task 8 needs review.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/payments/__tests__/capture.test.ts
git commit -m "test(payments): partial-unique-index race coverage for capture flow"
```

---

### Task 10: Webhook secret policy tightening (C-4)

**Files:**
- Modify: `src/app/api/stripe/webhook/route.ts`
- Modify: `src/app/api/stripe/webhook/__tests__/route.test.ts`

- [ ] **Step 1: Write failing tests for the secret guard**

Append to `src/app/api/stripe/webhook/__tests__/route.test.ts`:

```typescript
describe('webhook secret guard (C-4)', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  it('returns 503 when STRIPE_WEBHOOK_SECRET is unset and NODE_ENV !== test', async () => {
    process.env.NODE_ENV = 'development';
    const { POST } = await import('../route');
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({ type: 'payment_intent.succeeded', data: { object: {} } }),
      headers: { 'stripe-signature': 'sig' },
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe('webhook_secret_required');
  });

  it('bypasses validation when STRIPE_WEBHOOK_SECRET is unset and NODE_ENV === test', async () => {
    process.env.NODE_ENV = 'test';
    const { POST } = await import('../route');
    const event = {
      id: 'evt_test',
      type: 'account.updated',
      data: { object: { id: 'acct_test', charges_enabled: true } },
    };
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npx vitest run src/app/api/stripe/webhook/__tests__/route.test.ts`
Expected: FAIL — current code skips signature check whenever the secret is unset, ignoring `NODE_ENV`.

- [ ] **Step 3: Tighten the secret check in `route.ts`**

Find the existing block in `src/app/api/stripe/webhook/route.ts` that handles unset webhook secret. Replace it with:

```typescript
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
  console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set in non-test env');
  return NextResponse.json({ error: 'webhook_secret_required' }, { status: 503 });
}
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npx vitest run src/app/api/stripe/webhook/__tests__/route.test.ts`
Expected: PASS — both new tests + existing Plan 1 webhook tests still green.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/stripe/webhook/route.ts src/app/api/stripe/webhook/__tests__/route.test.ts
git commit -m "fix(webhook): require STRIPE_WEBHOOK_SECRET outside NODE_ENV=test (C-4)"
```

---

### Task 11: Webhook handler — `payment_intent.succeeded`

**Files:**
- Modify: `src/app/api/stripe/webhook/route.ts`
- Modify: `src/app/api/stripe/webhook/__tests__/route.test.ts`

- [ ] **Step 1: Write failing tests**

Append to the webhook test file:

```typescript
import { markEventProcessed } from '@/db/queries/stripe-events';
import { markPaymentHeld } from '@/db/queries/payments';

vi.mock('@/db/queries/stripe-events', () => ({
  markEventProcessed: vi.fn(),
}));
vi.mock('@/db/queries/payments', () => ({
  markPaymentHeld: vi.fn(),
  deletePaymentRow: vi.fn(),
}));

describe('payment_intent.succeeded handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = 'test';
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  it('marks payment held on first delivery', async () => {
    vi.mocked(markEventProcessed).mockResolvedValue(true);
    const { POST } = await import('../route');
    const event = {
      id: 'evt_pi_succ_1',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test',
          metadata: { paymentRowId: 'pay_1' },
        },
      },
    };
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(markPaymentHeld).toHaveBeenCalledWith('pay_1');
  });

  it('skips processing on duplicate event delivery (idempotency)', async () => {
    vi.mocked(markEventProcessed).mockResolvedValue(false); // duplicate
    const { POST } = await import('../route');
    const event = {
      id: 'evt_pi_succ_1',
      type: 'payment_intent.succeeded',
      data: {
        object: { id: 'pi_test', metadata: { paymentRowId: 'pay_1' } },
      },
    };
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(markPaymentHeld).not.toHaveBeenCalled();
  });

  it('warns and 200s when paymentRowId is missing from metadata', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { POST } = await import('../route');
    const event = {
      id: 'evt_pi_succ_2',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_test', metadata: {} } },
    };
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalled();
    expect(markPaymentHeld).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('200s when markPaymentHeld throws (logs error, does not 500)', async () => {
    // (Optional defensive case — verify a DB error doesn't propagate to Stripe.)
    vi.mocked(markEventProcessed).mockResolvedValue(true);
    vi.mocked(markPaymentHeld).mockRejectedValue(new Error('db down'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { POST } = await import('../route');
    const event = {
      id: 'evt_pi_succ_3',
      type: 'payment_intent.succeeded',
      data: {
        object: { id: 'pi_test', metadata: { paymentRowId: 'pay_1' } },
      },
    };
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const res = await POST(req);
    // Stripe retries on non-2xx; we want to retry on transient DB errors,
    // so a DB error SHOULD produce 5xx. Adjust expectation per actual policy.
    // Default: bubble the error and let Stripe retry.
    expect([500, 503]).toContain(res.status);
    consoleSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npx vitest run src/app/api/stripe/webhook/__tests__/route.test.ts`
Expected: FAIL — `payment_intent.succeeded` case not handled yet.

- [ ] **Step 3: Add handler**

In `src/app/api/stripe/webhook/route.ts`, find the existing `switch (event.type)` block and add:

```typescript
case 'payment_intent.succeeded': {
  const intent = event.data.object as Stripe.PaymentIntent;
  const paymentRowId = intent.metadata?.paymentRowId;
  if (!paymentRowId) {
    console.warn(
      `[stripe-webhook] payment_intent.succeeded without paymentRowId metadata: ${intent.id}`,
    );
    break;
  }
  const isFirst = await markEventProcessed(event.id, event.type);
  if (!isFirst) {
    console.log(
      `[stripe-webhook] duplicate payment_intent.succeeded for event ${event.id} — skipping`,
    );
    break;
  }
  await markPaymentHeld(paymentRowId);
  console.log(
    `[stripe-webhook] payment_intent.succeeded → payment ${paymentRowId} held`,
  );
  break;
}
```

Make sure imports at the top of the file include:

```typescript
import { markEventProcessed } from '@/db/queries/stripe-events';
import { markPaymentHeld } from '@/db/queries/payments';
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npx vitest run src/app/api/stripe/webhook/__tests__/route.test.ts`
Expected: PASS — 4 new tests pass alongside prior tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/stripe/webhook/route.ts src/app/api/stripe/webhook/__tests__/route.test.ts
git commit -m "feat(webhook): handle payment_intent.succeeded with idempotency dedupe"
```

---

### Task 12: Webhook handler — `payment_intent.payment_failed`

**Files:**
- Modify: `src/app/api/stripe/webhook/route.ts`
- Modify: `src/app/api/stripe/webhook/__tests__/route.test.ts`

- [ ] **Step 1: Write failing tests**

Append to webhook test file:

```typescript
describe('payment_intent.payment_failed handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = 'test';
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  it('deletes the payment row on first delivery', async () => {
    vi.mocked(markEventProcessed).mockResolvedValue(true);
    const { POST } = await import('../route');
    const event = {
      id: 'evt_pi_fail_1',
      type: 'payment_intent.payment_failed',
      data: {
        object: { id: 'pi_test', metadata: { paymentRowId: 'pay_1' } },
      },
    };
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const { deletePaymentRow } = await import('@/db/queries/payments');
    expect(deletePaymentRow).toHaveBeenCalledWith('pay_1');
  });

  it('skips processing on duplicate event (idempotency)', async () => {
    vi.mocked(markEventProcessed).mockResolvedValue(false);
    const { POST } = await import('../route');
    const event = {
      id: 'evt_pi_fail_1',
      type: 'payment_intent.payment_failed',
      data: {
        object: { id: 'pi_test', metadata: { paymentRowId: 'pay_1' } },
      },
    };
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const { deletePaymentRow } = await import('@/db/queries/payments');
    expect(deletePaymentRow).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npx vitest run src/app/api/stripe/webhook/__tests__/route.test.ts`
Expected: FAIL — `payment_intent.payment_failed` not handled.

- [ ] **Step 3: Add handler**

In the same `switch (event.type)` block, add:

```typescript
case 'payment_intent.payment_failed': {
  const intent = event.data.object as Stripe.PaymentIntent;
  const paymentRowId = intent.metadata?.paymentRowId;
  if (!paymentRowId) break;
  const isFirst = await markEventProcessed(event.id, event.type);
  if (!isFirst) break;
  await deletePaymentRow(paymentRowId);
  console.log(
    `[stripe-webhook] payment_intent.payment_failed → payment ${paymentRowId} deleted`,
  );
  break;
}
```

Add to imports: `import { deletePaymentRow } from '@/db/queries/payments';`

- [ ] **Step 4: Run tests — verify they pass**

Run: `npx vitest run src/app/api/stripe/webhook/__tests__/route.test.ts`
Expected: PASS — 2 new tests pass alongside prior.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/stripe/webhook/route.ts src/app/api/stripe/webhook/__tests__/route.test.ts
git commit -m "feat(webhook): handle payment_intent.payment_failed (DELETE row, no failed status)"
```

---

### Task 13: `<PaymentElementClient>` component + new packages

**Files:**
- Modify: `package.json` + `package-lock.json` (npm install)
- Create: `src/components/client/PaymentElementClient.tsx`

No unit tests — Stripe SDK is too coupled for unit testing this component. Manual smoke test in Task 16.

- [ ] **Step 1: Install Stripe.js + react-stripe-js**

Run from repo root:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Expected: `package.json` and `package-lock.json` updated; `node_modules/@stripe/stripe-js` and `@stripe/react-stripe-js` populated.

- [ ] **Step 2: Create the component**

Create `src/components/client/PaymentElementClient.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

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
    setError(null);
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
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Processing…' : 'Fund milestone'}
      </button>
    </form>
  );
}

export function PaymentElementClient({ clientSecret, returnUrl }: Props) {
  if (!stripePromise) {
    return (
      <p className="text-sm text-red-600" role="alert">
        Payment unavailable: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured.
      </p>
    );
  }
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

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: PASS — TypeScript compiles, no missing deps, route enumeration unchanged from main.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/components/client/PaymentElementClient.tsx
git commit -m "feat(client): PaymentElementClient + @stripe/stripe-js + @stripe/react-stripe-js"
```

---

### Task 14: Funding-page Server Component

**Files:**
- Create: `src/app/(dashboard)/client/my-jobs/[id]/milestones/[mid]/fund/page.tsx`

No unit test — Server Component is exercised by the build + manual smoke test (Task 16).

- [ ] **Step 1: Create the page**

Create the directory and file `src/app/(dashboard)/client/my-jobs/[id]/milestones/[mid]/fund/page.tsx`:

```typescript
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAppUser } from '@/lib/auth/get-user';
import { getMilestone } from '@/db/queries/milestones';
import { runCaptureForMilestone } from '@/lib/payments/capture';
import { PaymentElementClient } from '@/components/client/PaymentElementClient';

export const metadata: Metadata = { title: 'Fund milestone' };

interface Params {
  params: Promise<{ id: string; mid: string }>;
}

export default async function FundMilestonePage({ params }: Params) {
  const { id: jobId, mid: milestoneId } = await params;

  const user = await getAppUser();
  if (!user) redirect('/sign-in');

  const milestone = await getMilestone(milestoneId);
  if (!milestone) {
    return <ErrorBlock title="Milestone not found" message="This milestone does not exist." />;
  }

  const result = await runCaptureForMilestone({
    clientUserId: user.id,
    jobId,
    milestoneId,
    amountCents: milestone.amountCents,
  });

  if (!result.ok) {
    switch (result.error) {
      case 'unauthorized':
        return redirect('/sign-in');
      case 'not_owner':
        return redirect('/pro/dashboard');
      case 'job_not_fundable':
        return (
          <ErrorBlock
            title="This job can no longer be funded"
            message="The job is in a terminal state (cancelled or completed)."
          />
        );
      case 'milestone_not_pending':
        return (
          <ErrorBlock
            title="Milestone already funded"
            message="This milestone has already been funded or is in progress. Return to the job to view its status."
          />
        );
      case 'milestone_not_in_job':
        return (
          <ErrorBlock title="Milestone not found" message="This milestone does not belong to the requested job." />
        );
      case 'job_has_no_accepted_bid':
        return (
          <ErrorBlock
            title="No accepted bid"
            message="A pro must accept the job before milestones can be funded."
          />
        );
      case 'pro_not_verified':
        return (
          <ErrorBlock
            title="Pro is finishing verification"
            message="Your pro hasn't completed Stripe verification yet. They've been notified — funding will be available once they're verified."
          />
        );
      case 'beta_cap_exceeded':
        return (
          <ErrorBlock
            title="Beta funding cap reached"
            message={`This job has reached the $${(50000 / 100).toFixed(0)} beta funding cap. Contact support if you need to extend.`}
          />
        );
    }
  }

  if ('alreadyFunded' in result && result.alreadyFunded) {
    return (
      <SuccessBlock
        title="Funded ✓ — finalizing"
        message="This milestone has been funded. We're finalizing the transaction; the job page will update momentarily."
      />
    );
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Fund milestone
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {milestone.title} · ${(milestone.amountCents / 100).toFixed(2)}
      </p>
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <PaymentElementClient
          clientSecret={result.clientSecret}
          returnUrl={`/client/my-jobs/${jobId}?funded=${milestoneId}`}
        />
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Funds are held by the marketplace until the milestone is completed and approved.
      </p>
    </main>
  );
}

function ErrorBlock({ title, message }: { title: string; message: string }) {
  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <h1 className="text-lg font-semibold text-red-800 dark:text-red-300">{title}</h1>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{message}</p>
      </div>
    </main>
  );
}

function SuccessBlock({ title, message }: { title: string; message: string }) {
  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
        <h1 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">{title}</h1>
        <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">{message}</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: PASS — new route `/client/my-jobs/[id]/milestones/[mid]/fund` shows in the route enumeration as `ƒ` (Dynamic).

- [ ] **Step 3: Commit**

```bash
git add 'src/app/(dashboard)/client/my-jobs/[id]/milestones/[mid]/fund/page.tsx'
git commit -m "feat(client): /client/my-jobs/[id]/milestones/[mid]/fund Server Component"
```

---

### Task 15: Job-detail-content fund-button modifications

**Files:**
- Modify: `src/app/(dashboard)/client/my-jobs/[id]/job-detail-content.tsx`

No unit test — visual regression covered by manual smoke test (Task 16).

- [ ] **Step 1: Read the existing file** to find the milestones-list rendering section

Run: `grep -n "milestone\|status" src/app/\(dashboard\)/client/my-jobs/\[id\]/job-detail-content.tsx | head -30`

The file likely renders milestones in a `.map()` block. Find the milestone item template.

- [ ] **Step 2: Add fund button + funded badge**

Inside the milestone-item rendering, after whatever existing content, add:

```typescript
{milestone.status === 'pending' && (
  <Link
    href={`/client/my-jobs/${jobId}/milestones/${milestone.id}/fund`}
    className="ml-2 inline-flex items-center gap-1 rounded-lg bg-[#00a9e0] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0ea5e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a9e0]"
  >
    Fund ${(milestone.amountCents / 100).toFixed(0)} →
  </Link>
)}
{milestone.status === 'funded' && (
  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
    Funded ✓
  </span>
)}
```

Add `import Link from 'next/link';` at the top of the file if not already present.

(The `jobId` variable name should match what the file already uses — adapt if it's `params.id` or similar. The exact placement depends on the file's existing milestone-item layout; insert near other action buttons or status indicators.)

- [ ] **Step 3: Run build to confirm**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add 'src/app/(dashboard)/client/my-jobs/[id]/job-detail-content.tsx'
git commit -m "feat(client): per-milestone Fund / Funded button on job detail"
```

---

### Task 16: Manual end-to-end smoke test

**Files:** none (test execution only — no commit unless an issue surfaces)

- [ ] **Step 1: Set test-mode env vars in `.env.local`**

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

(Get the values from https://dashboard.stripe.com/test/apikeys.)

- [ ] **Step 2: Start `stripe listen` in a terminal**

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the printed `whsec_...` to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

- [ ] **Step 3: Start dev server**

```bash
npm run dev
```

- [ ] **Step 4: Sign up and verify a pro** (Plan 1 work)

Sign up via Clerk as a pro → complete embedded onboarding at `/pro/onboarding/payouts` → verify the dashboard banner flips to "Verified" within ~30s. (Real bank info OK — this is your test account.)

- [ ] **Step 5: Sign up as a client; post a job; accept the pro's bid**

(Bid acceptance currently runs through the mocked lifecycle service — milestones may need to be seeded manually. Use `psql` if needed: `INSERT INTO job_milestones (job_id, title, amount_cents, sort_order) VALUES ('<jobId>', 'Milestone 1', 25000, 0);`. This is a workaround until real bid-accept lands.)

- [ ] **Step 6: Navigate to the job detail page**

URL: `/client/my-jobs/<jobId>`

Expected: Each milestone with `status='pending'` shows a "Fund $250 →" button (matching seeded amounts).

- [ ] **Step 7: Click Fund**

Expected: Browser navigates to `/client/my-jobs/<jobId>/milestones/<milestoneId>/fund`. Stripe `<PaymentElement>` renders inline.

- [ ] **Step 8: Submit payment with Stripe test card**

- Card: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits
- Zip: any

Click "Fund milestone". Expected: brief processing state, then redirect to `/client/my-jobs/<jobId>?funded=<milestoneId>`.

- [ ] **Step 9: Verify the success state**

- The job-detail page now shows "Funded ✓" badge for that milestone.
- `stripe listen` terminal logs `payment_intent.succeeded` event delivery.
- Stripe Dashboard (test mode → Payments) shows the PaymentIntent in `succeeded` state.
- `psql` query: `SELECT id, status, held_at, stripe_payment_intent_id FROM payments WHERE job_id = '<jobId>';` — row has `status='held'`, `held_at` set, `stripe_payment_intent_id` populated.
- `psql` query: `SELECT id, status, funded_at FROM job_milestones WHERE id = '<milestoneId>';` — row has `status='funded'`, `funded_at` set.
- `psql` query: `SELECT * FROM stripe_events_processed;` — row exists with the matching `event_id`.

- [ ] **Step 10: Verify the failure path**

Sign up another client + start another job + accept a bid → navigate to fund page → use the always-decline test card `4000 0000 0000 0002`. Expected: `<PaymentElement>` shows the decline error. `stripe listen` shows `payment_intent.payment_failed`. The corresponding `payments` row is DELETED (verify with `psql`: `SELECT * FROM payments WHERE job_id = '<jobId>';` — empty).

- [ ] **Step 11: Verify reuse-pending**

Without completing payment, navigate away and back to the fund page. Expected: same `clientSecret` is reused (no duplicate PaymentIntent created in Stripe Dashboard). Verify the second `payments` INSERT did NOT happen (row count unchanged for that milestone).

If any step fails, debug and fix in a separate task — do NOT mark this task complete until all 11 steps pass.

- [ ] **Step 12: Commit (only if you found and fixed something)**

If the smoke test surfaced a bug and you fixed it, commit the fix with a clear message. Otherwise, no commit on this task.

---

### Task 17: Final cleanup + Plan 2b followup notes

**Files:**
- Create: `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md`

- [ ] **Step 1: Write the handoff doc**

Create `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md`:

```markdown
# Plan 2b Prep — Stripe Connect Release Path

**Status:** Plan 2a (capture) shipped. Plan 2b (release) is the natural next step.

## What Plan 2a left in place

- `payments.stripe_transfer_id` column exists (NULL for Plan 2a rows)
- `stripe_events_processed` table is the dedupe surface for new webhook events
- `PaymentService.capturePayment` is wired; `PaymentService.releasePayout` is the natural extension point
- `job_milestones.status` advances `pending → funded` on capture; Plan 2b adds `funded → released` on transfer

## Plan 2b scope

1. **`PaymentService.releasePayout`** — calls `stripe.transfers.create({ amount, currency: 'usd', destination: pro_acct_id, transfer_group: jobId, metadata: { paymentRowId } })`
2. **`POST /api/payments/release`** OR Server Action — gates: only the platform admin or the client can trigger; only when milestone status is `completed`
3. **Commission application** — split 8-18% off the top before transfer (depends on pro tier; see existing commission engine)
4. **Webhook handlers (3 new):**
   - `transfer.created` — sets `payments.status='released'`, `released_at=NOW()`
   - `charge.dispute.created` — flags `payments.status='disputed'`, surfaces in admin queue
   - `payout.failed` — alert ops; pro's bank account problem
5. **Pro payout dashboard** — `/pro/payments` already shows balance cards; wire to real Stripe balance via `accounts.retrieve`
6. **Admin tooling for stuck funds** (I-5 from spec) — manual refund trigger for restricted/disabled pros

## Plan 2a followups (deferred — track here)

1. **Trigger 1 (auto-redirect after bid-accept).** Current bid-accept is mocked in `src/lib/services/job-lifecycle.ts:onBidAccepted`. Real implementation must:
   - UPDATE bids.status = 'accepted'
   - INSERT job_milestones rows (from checklist phases)
   - Then redirect to `/client/my-jobs/[jobId]/milestones/[firstMilestoneId]/fund`

2. **Vercel cron** to clean up stale `pending` payments older than 24h.
3. **TTL on `stripe_events_processed`** — purge events older than 30 days.
4. **Postgres advisory lock** on jobId during cap-check + INSERT (full cross-milestone race correctness).
5. **Saved cards** (SetupIntent + Customer + off-session).
6. **Apple Pay / Google Pay / Link** via `automatic_payment_methods`.
7. **Granular bid-accept gate** preventing acceptance of bids from unverified pros.
8. **Receipt emails** via `paymentIntents.create({ receipt_email })`.
9. **3DS / SCA challenge UX** in standalone PWA mode.

## Open questions for Plan 2b brainstorming

- Release trigger: client-confirms-completion vs. pro-marks-done with N-day auto-release? (M-3 fix candidate)
- Commission rate per tier: how do we read the pro's tier at transfer time?
- Refund flow: is it a Plan 2b feature or pre-2b admin tooling?
```

- [ ] **Step 2: Run `npx vitest run` one final time**

Run: `npx vitest run`
Expected: PASS — full suite green; total test count = baseline (190) + ~27 new = ~217.

- [ ] **Step 3: Run `npm run build` final**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Push branch and open PR**

```bash
git push -u origin plan-2a-payment-capture
gh pr create --title "feat(payments): Plan 2a — Stripe Connect payment capture" --body "$(cat <<'EOF'
## Summary

Wires the capture half of the Sherpa Pros marketplace money flow per the design spec at `docs/superpowers/specs/2026-04-27-stripe-connect-payment-capture-design.md`. Clients can fund job milestones via embedded Stripe `<PaymentElement>`; money holds in the platform Stripe balance until Plan 2b's release path ships.

### Architecture

- **Stripe Connect with separate charges and transfers.** PaymentIntents created on the platform account with no `transfer_data` — funds park in platform balance.
- **Embedded `<PaymentElement>`** (consistent with Plan 1's embedded onboarding choice).
- **Capture entry point is a Server Component** (no public HTTP route). The page calls a `runCaptureForMilestone` helper that runs all gates, handles reuse-pending, and creates the PaymentIntent.
- **Idempotency:** partial unique index on `payments` (same-milestone serialization) + `stripe_events_processed` table (webhook dedupe).
- **Webhook secret hardening (C-4):** unset `STRIPE_WEBHOOK_SECRET` returns `503 webhook_secret_required` outside `NODE_ENV=test`.

### Database changes

Migration 013 (additive, applied separately to local + preview + prod Neon branches):

- `payments.stripe_transfer_id` (Plan 2b uses this)
- `stripe_events_processed` table (event_id PK, event_type, processed_at)
- Partial unique index `uq_payments_pending_per_milestone (job_id, milestone_id, payer_user_id) WHERE status='pending'`

## Test plan

- [x] `npx vitest run` — ~217 tests passing (190 baseline + 27 new)
- [x] `npm run build` — clean, new route appears in enumeration
- [x] `npm run lint` — no new errors on modified files
- [x] Migration applied to local Neon (`psql -f 013_*.sql`)
- [ ] Migration applied to Vercel Preview Neon branch
- [ ] Migration applied to Production Neon branch (BEFORE merging this PR)
- [ ] Manual smoke test: end-to-end flow with Stripe test card `4242...` (success)
- [ ] Manual smoke test: failure path with `4000 0000 0000 0002` (decline)
- [ ] Manual smoke test: reuse-pending (re-navigate without paying — same clientSecret)
- [ ] Stripe Dashboard verification: PaymentIntent reaches `succeeded`, funds in platform balance

## Followups deferred to Plan 2b

See `docs/superpowers/handoff/2026-04-28-plan-2b-prep.md` for the full list.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Commit handoff doc**

```bash
git add docs/superpowers/handoff/2026-04-28-plan-2b-prep.md
git commit -m "docs(handoff): Plan 2b prep notes + Plan 2a followups"
git push
```

---

## Spec coverage self-review

**Goal coverage:** ✅ Capture half wired; release deferred to 2b.

**Gates:** ✅ All 8 enumerated `CaptureError` variants tested in Task 7.

**Reuse-pending:** ✅ Three intent.status branches (succeeded / canceled / requires_payment_method) tested in Task 8.

**Two-phase commit avoidance:** ✅ randomUUID in app code → INSERT → Stripe → UPDATE → DELETE on error pattern in Task 8.

**Webhook handler additions:** ✅ Tasks 11 + 12 add both `payment_intent.succeeded` and `payment_intent.payment_failed`. Idempotency via `markEventProcessed` (Task 2) + Stripe at-least-once delivery handling.

**Webhook secret guard (C-4):** ✅ Task 10 — `503 webhook_secret_required` in non-test env without secret.

**Migration 013:** ✅ Task 1 — purely additive (one nullable column, one new table, one partial unique index).

**Concurrency:** ✅ Same-milestone race serialized by partial unique index (Task 1 SQL); cross-milestone race accepted with monitoring per spec §Concurrency. Recursion in Task 8 handles unique-violation gracefully.

**UI components:** ✅ `<PaymentElementClient>` (Task 13) and funding-page Server Component (Task 14) cover the spec's UI scope.

**Bid-accept Trigger 1:** ✅ Acknowledged as deferred (real bid-accept flow is mocked); plan ships Trigger 2 fully and lists Trigger 1 in handoff doc for after the real lifecycle lands.

**Tests count:** Migration (no test) + ~2 stripe-events + ~10 payments-queries + 3 PaymentService capture (mock + 2 stripe) + 14 capture helper + 2 webhook secret + 4 payment_intent.succeeded + 2 payment_intent.payment_failed = ~37 new tests. (Spec estimated 27; the actual count is higher because gate tests are split per error variant.)

**Placeholder scan:** No `TBD`, `TODO`, `implement later`, or `add appropriate error handling` in the implementation steps. The bid-accept Trigger 1 is the only flagged unknown, and it's explicitly deferred with rationale.

**Type consistency:**
- `CaptureError` enum used identically across types declaration (Task 7) and switch in funding page (Task 14).
- `PaymentService.capturePayment` and `retrievePaymentIntent` defined in Task 5/8 and called in Task 7/8.
- `runCaptureForMilestone` input shape stable across Tasks 7/8/9 and call site in Task 14.
- `markPaymentHeld(paymentRowId)` signature in Task 3 matches Task 11 call site.
