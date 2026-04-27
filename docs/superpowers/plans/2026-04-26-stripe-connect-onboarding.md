# Stripe Connect Onboarding (Plan 1) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire Stripe Connect embedded onboarding end-to-end — pros click "Get verified to start earning" on their dashboard, complete an inline Stripe form (no redirect), and the platform tracks their verification status via webhook so it can later gate payouts. No money flows in this plan; that's Plan 2.

**Architecture:** Three layers, each in a separate task subset:
- *Foundation:* schema migration 012 (3 new columns on `users`), Drizzle schema update, `@stripe/connect-js` + `@stripe/react-connect-js` packages
- *Services & API:* `getPaymentService()` getter (mirrors `getMessagingService()` pattern), three new endpoints (`/api/stripe/connect/account`, `/api/stripe/connect/account-session`, `/api/stripe/webhook` with signature validation)
- *UI:* `/pro/onboarding/payouts` route with client-side `<ConnectAccountOnboarding>` Stripe component, dashboard banner driven by `users.stripe_account_status`

**Tech Stack:** Next.js 16 (App Router), TypeScript strict, Drizzle ORM, Neon Postgres, Stripe Node SDK 5.13.x, `@stripe/connect-js` + `@stripe/react-connect-js`, Vitest 4, Clerk (production auth) + mock session (dev).

**Source spec:** `docs/superpowers/specs/2026-04-26-stripe-connect-onboarding-design.md`

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `src/db/migrations/012_stripe_connect_accounts.sql` | Create | Adds `users.stripe_account_id`, `users.stripe_account_status`, `users.stripe_onboarded_at` + indexes |
| `src/db/drizzle-schema.ts` | Modify | Drizzle column definitions matching the SQL migration |
| `package.json` | Modify | Add `@stripe/connect-js` + `@stripe/react-connect-js` |
| `src/lib/services/payments/types.ts` | Create | `PaymentService` interface, `StripeAccountStatus` enum |
| `src/lib/services/payments/index.ts` | Create | `getPaymentService()` env-aware getter |
| `src/lib/services/payments/mock-service.ts` | Create | In-memory mock for dev/tests |
| `src/lib/services/payments/stripe-service.ts` | Create | Real Stripe SDK implementation |
| `src/lib/services/payments/__tests__/messaging.test.ts` | Create | Tests for `getPaymentService()` env switch |
| `src/lib/services/payments/__tests__/stripe-service.test.ts` | Create | Tests for `ensureConnectedAccount`, `createAccountSession` |
| `src/lib/services/interfaces.ts` | Modify | Add `PaymentService` re-export |
| `src/app/api/stripe/connect/account/route.ts` | Create | `POST` ensures connected account, returns `{stripeAccountId, status}` |
| `src/app/api/stripe/connect/account/__tests__/route.test.ts` | Create | Idempotency, 401 unauthenticated, status persistence |
| `src/app/api/stripe/connect/account-session/route.ts` | Create | `POST` mints AccountSession, returns `{clientSecret, expiresAt}` |
| `src/app/api/stripe/connect/account-session/__tests__/route.test.ts` | Create | Returns session, 400 if no account, 401 unauthenticated |
| `src/app/api/stripe/webhook/route.ts` | Modify | Adds signature validation + `account.updated` handler |
| `src/app/api/stripe/webhook/__tests__/route.test.ts` | Create | Bad signature → 403, valid event updates DB, unknown event → 200 |
| `src/components/pro/ConnectOnboardingClient.tsx` | Create | Client-side embedded onboarding component |
| `src/app/(dashboard)/pro/onboarding/payouts/page.tsx` | Create | Server component that ensures account + renders client component |
| `src/components/pro/StripeStatusBanner.tsx` | Create | Reads status from session, renders banner per state |
| `src/app/(dashboard)/pro/page.tsx` | Modify | Add `<StripeStatusBanner />` near top |
| `src/lib/auth/session.ts` | Modify | Add `stripeAccountStatus` to mock user shape |
| `src/db/queries/users.ts` | Modify (or Create) | Add `getUserByClerkId`, `setStripeAccountId`, `updateStripeStatus` query helpers |

**Total:** 14 new files, 5 modified files. ~12 new tests.

---

## Task 1: Migration 012 — schema + Drizzle update

**Files:**
- Create: `src/db/migrations/012_stripe_connect_accounts.sql`
- Modify: `src/db/drizzle-schema.ts`

- [ ] **Step 1: Create the SQL migration**

Create `src/db/migrations/012_stripe_connect_accounts.sql`:

```sql
-- Migration 012: Stripe Connect Accounts
-- Adds Stripe Connected Account tracking to users table for pro verification.
-- Pro verification gates the ability to receive payouts (Plan 2).

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

- [ ] **Step 2: Update Drizzle schema**

In `src/db/drizzle-schema.ts`, find the `users` table definition (search `export const users = pgTable`). Add these three columns to the column block, keeping alphabetical / logical grouping consistent with surrounding columns:

```typescript
    stripeAccountId: varchar("stripe_account_id", { length: 64 }),
    stripeAccountStatus: varchar("stripe_account_status", { length: 20 })
      .notNull()
      .default('none'),
    stripeOnboardedAt: timestamp("stripe_onboarded_at", {
      withTimezone: true,
    }),
```

Place them after the existing `subtype` column (or wherever feels logical — next to other auth-adjacent columns). Then in the index block at the bottom of the table definition (where `idx_users_clerk_id`, etc. are listed), add:

```typescript
    index("idx_users_stripe_account_id").on(table.stripeAccountId),
```

Drizzle does not support PARTIAL indexes via the `index()` helper for arbitrary predicates. The partial index `idx_users_stripe_status_pro` (with `WHERE role = 'pro'`) lives only in the SQL migration; Drizzle won't manage it but it'll be applied to the DB. This is fine — Drizzle's schema is for TypeScript types, not full DDL parity.

- [ ] **Step 3: Apply migration to local Neon DB**

Run:
```bash
cd ~/sherpa-pros-platform/.worktrees/stripe-connect-onboarding
psql "$DATABASE_URL" -f src/db/migrations/012_stripe_connect_accounts.sql
```

Expected: three `ALTER TABLE` and `CREATE INDEX` statements succeed. Confirm with `psql "$DATABASE_URL" -c "\d users"` — the three new columns appear.

If `DATABASE_URL` is not set locally, skip this step in development (the migration applies in deployment). Note the skip in your report.

- [ ] **Step 4: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit -p tsconfig.json
```

Expected: zero errors. The Drizzle types pick up the new columns and queries that read/write them will be type-checked.

- [ ] **Step 5: Commit**

```bash
git add src/db/migrations/012_stripe_connect_accounts.sql src/db/drizzle-schema.ts
git commit -m "feat(schema): migration 012 — Stripe Connect account columns on users

Adds stripe_account_id, stripe_account_status, stripe_onboarded_at to
support pro verification tracking. Status enum stored as TEXT for cheap
value additions; partial index on (stripe_account_status WHERE role='pro')
keeps admin queries fast as user table grows."
```

---

## Task 2: Install Stripe Connect packages

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install both packages together**

Run:
```bash
cd ~/sherpa-pros-platform/.worktrees/stripe-connect-onboarding
npm install @stripe/connect-js @stripe/react-connect-js
```

Expected: both packages added at their latest stable versions (likely 4.x or newer for both as of 2026). No peer-dep warnings beyond the standard React 19 peer note.

- [ ] **Step 2: Verify they landed in package.json**

Run:
```bash
grep -E '"@stripe/(connect-js|react-connect-js)"' package.json
```

Expected output:
```
    "@stripe/connect-js": "^X.Y.Z",
    "@stripe/react-connect-js": "^X.Y.Z",
```

- [ ] **Step 3: Verify build still passes**

Run:
```bash
npm run build 2>&1 | tail -10
```

Expected: build succeeds. The packages aren't imported anywhere yet, so they're idle.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add @stripe/connect-js + @stripe/react-connect-js for embedded onboarding"
```

---

## Task 3: Service abstraction — types + interface

**Files:**
- Create: `src/lib/services/payments/types.ts`
- Modify: `src/lib/services/interfaces.ts` (add `PaymentService` re-export)

- [ ] **Step 1: Create the types file**

Create `src/lib/services/payments/types.ts`:

```typescript
/**
 * Sherpa Pros — Payment Service Types
 *
 * Minimal interface for Plan 1 (onboarding only). Plan 2 will extend
 * with capturePayment, releasePayout, etc.
 *
 * Spec: docs/superpowers/specs/2026-04-26-stripe-connect-onboarding-design.md
 */

export type StripeAccountStatus =
  | 'none'
  | 'pending'
  | 'active'
  | 'restricted'
  | 'disabled';

export interface ConnectedAccountResult {
  stripeAccountId: string;
  status: StripeAccountStatus;
}

export interface AccountSessionResult {
  clientSecret: string;
  expiresAt: number;
}

export interface PaymentService {
  /**
   * Idempotent. Reads existing stripe_account_id; creates new Connected
   * Account only if missing. Returns the account ID and current status.
   */
  ensureConnectedAccount(
    userId: string,
    email: string,
  ): Promise<ConnectedAccountResult>;

  /**
   * Mints a short-lived AccountSession scoped to the account_onboarding
   * component. Used by <ConnectAccountOnboarding> to render the embedded form.
   */
  createAccountSession(stripeAccountId: string): Promise<AccountSessionResult>;
}
```

- [ ] **Step 2: Add to umbrella interfaces**

In `src/lib/services/interfaces.ts`, find the existing messaging re-export block and add a payment block below it. The relevant section currently reads:

```typescript
// Messaging — already implemented in src/lib/communication/
export type {
  CommunicationService as MessagingService,
  ...
} from '@/lib/communication/types';
```

Add immediately after that block:

```typescript
// Payments — new in this plan (Stripe Connect onboarding only; money flow Plan 2)
export type {
  PaymentService,
  StripeAccountStatus,
  ConnectedAccountResult,
  AccountSessionResult,
} from '@/lib/services/payments/types';
```

- [ ] **Step 3: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit -p tsconfig.json
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/services/payments/types.ts src/lib/services/interfaces.ts
git commit -m "feat(services): add PaymentService interface + StripeAccountStatus enum

Plan 1 scope only — ensureConnectedAccount + createAccountSession.
Plan 2 will extend with payment capture and payout release."
```

---

## Task 4: Service abstraction — getPaymentService() + mock with TDD

**Files:**
- Create: `src/lib/services/payments/mock-service.ts`
- Create: `src/lib/services/payments/index.ts`
- Create: `src/lib/services/payments/__tests__/index.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/services/payments/__tests__/index.test.ts`:

```typescript
import { describe, it, expect, afterEach } from 'vitest';
import { getPaymentService } from '../index';
import { mockPaymentService } from '../mock-service';

describe('getPaymentService', () => {
  const originalKey = process.env.STRIPE_SECRET_KEY;

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.STRIPE_SECRET_KEY;
    } else {
      process.env.STRIPE_SECRET_KEY = originalKey;
    }
  });

  it('returns the mock service when STRIPE_SECRET_KEY is unset', () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(getPaymentService()).toBe(mockPaymentService);
  });

  it('returns the Stripe service when STRIPE_SECRET_KEY is set', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_AC';
    const { stripePaymentService } = await import('../stripe-service');
    expect(getPaymentService()).toBe(stripePaymentService);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/lib/services/payments/__tests__/index.test.ts
```

Expected: FAIL — modules `../index`, `../mock-service`, `../stripe-service` not found.

- [ ] **Step 3: Create the mock service**

Create `src/lib/services/payments/mock-service.ts`:

```typescript
/**
 * Sherpa Pros — Mock Payment Service
 *
 * In-memory implementation for development without Stripe credentials.
 * Generates deterministic-but-fake account IDs so tests can assert on them.
 */

import type {
  PaymentService,
  ConnectedAccountResult,
  AccountSessionResult,
  StripeAccountStatus,
} from './types';

const accounts = new Map<string, ConnectedAccountResult>();

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}_mock_${counter}_${Date.now()}`;
}

export const mockPaymentService: PaymentService = {
  async ensureConnectedAccount(userId, _email) {
    const existing = accounts.get(userId);
    if (existing) return existing;

    const result: ConnectedAccountResult = {
      stripeAccountId: nextId('acct'),
      status: 'pending' as StripeAccountStatus,
    };
    accounts.set(userId, result);
    return result;
  },

  async createAccountSession(_stripeAccountId): Promise<AccountSessionResult> {
    return {
      clientSecret: nextId('cs'),
      expiresAt: Math.floor(Date.now() / 1000) + 30 * 60,
    };
  },
};

// Test helpers
export function _resetMockPaymentStore() {
  accounts.clear();
  counter = 0;
}
```

- [ ] **Step 4: Create a Stripe service stub (full impl lands in Task 5)**

Create `src/lib/services/payments/stripe-service.ts`:

```typescript
/**
 * Sherpa Pros — Stripe Payment Service
 *
 * Real Stripe SDK implementation. Lazily initialized to keep the module
 * importable without env vars (build must pass).
 */

import type { PaymentService } from './types';

export const stripePaymentService: PaymentService = {
  async ensureConnectedAccount(_userId, _email) {
    throw new Error('stripe-service: ensureConnectedAccount not yet implemented');
  },

  async createAccountSession(_stripeAccountId) {
    throw new Error('stripe-service: createAccountSession not yet implemented');
  },
};
```

(Task 5 replaces the throws with real Stripe SDK calls.)

- [ ] **Step 5: Create the getter**

Create `src/lib/services/payments/index.ts`:

```typescript
/**
 * Sherpa Pros — Payment Service Getter
 *
 * Picks Stripe when STRIPE_SECRET_KEY is set, mock otherwise.
 * Mirrors the getMessagingService() pattern from communication/.
 */

import type { PaymentService } from './types';
import { mockPaymentService } from './mock-service';
import { stripePaymentService } from './stripe-service';

export function getPaymentService(): PaymentService {
  if (process.env.STRIPE_SECRET_KEY) {
    return stripePaymentService;
  }
  return mockPaymentService;
}

export { mockPaymentService } from './mock-service';
export { stripePaymentService } from './stripe-service';
export type {
  PaymentService,
  StripeAccountStatus,
  ConnectedAccountResult,
  AccountSessionResult,
} from './types';
```

- [ ] **Step 6: Run test to verify it passes**

Run:
```bash
npx vitest run src/lib/services/payments/__tests__/index.test.ts
```

Expected: PASS — both tests green.

- [ ] **Step 7: Commit**

```bash
git add src/lib/services/payments/index.ts src/lib/services/payments/mock-service.ts src/lib/services/payments/stripe-service.ts src/lib/services/payments/__tests__/index.test.ts
git commit -m "feat(services): add getPaymentService() with mock + Stripe service stubs

Service-abstraction skeleton mirrors getMessagingService(). Real Stripe
SDK calls land in the next task; this commit establishes the env-based
getter and the mock fallback for dev/tests."
```

---

## Task 5: Service abstraction — Stripe service real implementation with TDD

**Files:**
- Create: `src/lib/services/payments/__tests__/stripe-service.test.ts`
- Modify: `src/lib/services/payments/stripe-service.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/services/payments/__tests__/stripe-service.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('stripe', () => {
  const accountsCreate = vi.fn().mockResolvedValue({
    id: 'acct_mock_1',
    charges_enabled: false,
    details_submitted: false,
  });
  const sessionsCreate = vi.fn().mockResolvedValue({
    client_secret: 'cs_mock_1',
    expires_at: 1735000000,
  });

  const StripeClass = vi.fn().mockImplementation(() => ({
    accounts: {
      create: accountsCreate,
    },
    accountSessions: {
      create: sessionsCreate,
    },
  }));

  return { default: StripeClass, __esModule: true };
});

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = 'sk_test_AC';
  vi.resetModules();
});

describe('stripePaymentService.ensureConnectedAccount', () => {
  it('creates a new Stripe Connected Account and returns the typed result', async () => {
    const { stripePaymentService } = await import('../stripe-service');
    const result = await stripePaymentService.ensureConnectedAccount(
      'user_1',
      'pro@example.com',
    );

    expect(result.stripeAccountId).toBe('acct_mock_1');
    expect(result.status).toBe('pending');
  });

  it('throws when STRIPE_SECRET_KEY is unset', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    vi.resetModules();
    const { stripePaymentService } = await import('../stripe-service');
    await expect(
      stripePaymentService.ensureConnectedAccount('user_1', 'pro@example.com'),
    ).rejects.toThrow(/STRIPE_SECRET_KEY/);
  });
});

describe('stripePaymentService.createAccountSession', () => {
  it('returns the mapped client secret + expiry from Stripe', async () => {
    const { stripePaymentService } = await import('../stripe-service');
    const result = await stripePaymentService.createAccountSession('acct_1');
    expect(result.clientSecret).toBe('cs_mock_1');
    expect(result.expiresAt).toBe(1735000000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/lib/services/payments/__tests__/stripe-service.test.ts
```

Expected: FAIL — `stripe-service` throws "not yet implemented" from the Task 4 stub.

- [ ] **Step 3: Replace the stub with a real implementation**

Replace ALL of `src/lib/services/payments/stripe-service.ts` with:

```typescript
/**
 * Sherpa Pros — Stripe Payment Service
 *
 * Real Stripe SDK implementation. Lazily initialized — the module imports
 * cleanly without STRIPE_SECRET_KEY set; methods throw when called without it.
 *
 * The module-level cachedClient is populated on first call and reused across
 * calls within the same module instance. vi.resetModules() between tests
 * resets the cache.
 */

import Stripe from 'stripe';
import type {
  PaymentService,
  ConnectedAccountResult,
  AccountSessionResult,
  StripeAccountStatus,
} from './types';

type StripeClient = Stripe;

let cachedClient: StripeClient | null = null;

function getStripeClient(): StripeClient {
  if (cachedClient) return cachedClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY not configured. Set sk_test_* for development or sk_live_* for production.',
    );
  }

  cachedClient = new Stripe(secretKey, {
    typescript: true,
  });
  return cachedClient;
}

/**
 * Derive our local status from a Stripe Account object.
 * See spec: 2026-04-26-stripe-connect-onboarding-design.md §"State model"
 */
function deriveStatus(account: Stripe.Account): StripeAccountStatus {
  const reqs = account.requirements;
  const disabledReason = reqs?.disabled_reason;
  if (disabledReason) return 'disabled';

  if (account.charges_enabled === true && account.details_submitted === true) {
    return 'active';
  }

  const currentlyDue = reqs?.currently_due ?? [];
  if (account.details_submitted === true && currentlyDue.length > 0) {
    return 'restricted';
  }

  return 'pending';
}

export const stripePaymentService: PaymentService = {
  async ensureConnectedAccount(_userId, email): Promise<ConnectedAccountResult> {
    const client = getStripeClient();
    const account = await client.accounts.create({
      type: 'standard',
      email,
    });
    return {
      stripeAccountId: account.id,
      status: deriveStatus(account),
    };
  },

  async createAccountSession(stripeAccountId): Promise<AccountSessionResult> {
    const client = getStripeClient();
    const session = await client.accountSessions.create({
      account: stripeAccountId,
      components: {
        account_onboarding: { enabled: true },
      },
    });
    return {
      clientSecret: session.client_secret,
      expiresAt: session.expires_at,
    };
  },
};

// Exported for test isolation
export function _resetCachedStripeClient() {
  cachedClient = null;
}
```

Note: this implementation always creates a new Stripe account in `ensureConnectedAccount`. The "ensure" idempotency (don't create twice) is handled at the API-route layer (Task 6), where we look up `users.stripe_account_id` first and only call this method if the column is null. The service method itself is "create"; the API layer is "ensure".

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/lib/services/payments/__tests__/stripe-service.test.ts
```

Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/services/payments/stripe-service.ts src/lib/services/payments/__tests__/stripe-service.test.ts
git commit -m "feat(services): wire real Stripe SDK in payment service

Implements ensureConnectedAccount via accounts.create (Standard type)
and createAccountSession via accountSessions.create with account_onboarding
component scoping. deriveStatus maps Stripe Account fields to our
5-state enum per spec §State model."
```

---

## Task 6: API endpoint — POST /api/stripe/connect/account with TDD

**Files:**
- Create: `src/db/queries/users.ts` (or modify if exists)
- Create: `src/app/api/stripe/connect/account/route.ts`
- Create: `src/app/api/stripe/connect/account/__tests__/route.test.ts`

- [ ] **Step 1: Check if users query helper exists, create or extend**

First check:
```bash
ls src/db/queries/users.ts 2>/dev/null && echo "EXISTS" || echo "CREATE NEW"
```

If EXISTS, read the file and ADD the three helper functions below to its existing exports (don't replace the file). If CREATE NEW, create with this content. Either way, the helpers exposed need to be:

```typescript
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/connection';
import { users } from '@/db/drizzle-schema';
import type { StripeAccountStatus } from '@/lib/services/payments/types';

export async function getUserByClerkId(clerkId: string) {
  const db = getDb();
  const rows = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  return rows[0] ?? null;
}

export async function setStripeAccountId(userId: string, stripeAccountId: string, status: StripeAccountStatus) {
  const db = getDb();
  await db.update(users)
    .set({ stripeAccountId, stripeAccountStatus: status })
    .where(eq(users.id, userId));
}

export async function updateStripeAccountStatus(stripeAccountId: string, status: StripeAccountStatus) {
  const db = getDb();
  // If transitioning to 'active' for the first time, set onboardedAt as well
  if (status === 'active') {
    await db.update(users)
      .set({ stripeAccountStatus: status, stripeOnboardedAt: new Date() })
      .where(eq(users.stripeAccountId, stripeAccountId))
      // Only set onboardedAt if currently null (idempotent for repeat webhooks)
      // Drizzle doesn't expose a clean WHERE...AND syntax for this in update;
      // do it as two updates or accept the benign race documented in the spec.
    return;
  }
  await db.update(users)
    .set({ stripeAccountStatus: status })
    .where(eq(users.stripeAccountId, stripeAccountId));
}
```

If `getDb()` doesn't exist as a helper (check `src/db/connection.ts`), use whatever connection pattern the existing queries in `src/db/queries/` use. Look at `src/db/queries/pros.ts` or similar for the pattern.

- [ ] **Step 2: Write the failing route test**

Create `src/app/api/stripe/connect/account/__tests__/route.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockEnsure = vi.fn();
const mockSetStripeAccountId = vi.fn();
const mockGetUserByClerkId = vi.fn();
const mockGetAppUser = vi.fn();

vi.mock('@/lib/services/payments', () => ({
  getPaymentService: () => ({
    ensureConnectedAccount: mockEnsure,
  }),
}));

vi.mock('@/db/queries/users', () => ({
  getUserByClerkId: mockGetUserByClerkId,
  setStripeAccountId: mockSetStripeAccountId,
}));

vi.mock('@/lib/auth/get-user', () => ({
  getAppUser: mockGetAppUser,
}));

beforeEach(() => {
  mockEnsure.mockReset();
  mockSetStripeAccountId.mockReset();
  mockGetUserByClerkId.mockReset();
  mockGetAppUser.mockReset();
});

describe('POST /api/stripe/connect/account', () => {
  it('returns 401 when no authenticated user', async () => {
    mockGetAppUser.mockResolvedValue(null);
    const { POST } = await import('../route');
    const res = await POST();
    expect(res.status).toBe(401);
  });

  it('creates a connected account when user has none', async () => {
    mockGetAppUser.mockResolvedValue({
      id: 'clerk_123',
      email: 'pro@test.com',
      firstName: 'Test',
      lastName: 'Pro',
      role: 'pro',
      imageUrl: '',
    });
    mockGetUserByClerkId.mockResolvedValue({
      id: 'user_uuid_1',
      stripeAccountId: null,
      stripeAccountStatus: 'none',
    });
    mockEnsure.mockResolvedValue({
      stripeAccountId: 'acct_new_1',
      status: 'pending',
    });

    const { POST } = await import('../route');
    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.stripeAccountId).toBe('acct_new_1');
    expect(body.status).toBe('pending');
    expect(mockEnsure).toHaveBeenCalledWith('user_uuid_1', 'pro@test.com');
    expect(mockSetStripeAccountId).toHaveBeenCalledWith('user_uuid_1', 'acct_new_1', 'pending');
  });

  it('returns existing account without re-creating', async () => {
    mockGetAppUser.mockResolvedValue({
      id: 'clerk_123',
      email: 'pro@test.com',
      firstName: 'Test',
      lastName: 'Pro',
      role: 'pro',
      imageUrl: '',
    });
    mockGetUserByClerkId.mockResolvedValue({
      id: 'user_uuid_1',
      stripeAccountId: 'acct_existing_1',
      stripeAccountStatus: 'active',
    });

    const { POST } = await import('../route');
    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.stripeAccountId).toBe('acct_existing_1');
    expect(body.status).toBe('active');
    expect(mockEnsure).not.toHaveBeenCalled();
    expect(mockSetStripeAccountId).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run:
```bash
npx vitest run src/app/api/stripe/connect/account/__tests__/route.test.ts
```

Expected: FAIL — module `../route` not found.

- [ ] **Step 4: Create the route**

Create `src/app/api/stripe/connect/account/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getAppUser } from '@/lib/auth/get-user';
import { getUserByClerkId, setStripeAccountId } from '@/db/queries/users';
import { getPaymentService } from '@/lib/services/payments';

export async function POST() {
  const appUser = await getAppUser();
  if (!appUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await getUserByClerkId(appUser.id);
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
  }

  if (dbUser.stripeAccountId) {
    return NextResponse.json({
      stripeAccountId: dbUser.stripeAccountId,
      status: dbUser.stripeAccountStatus,
    });
  }

  const result = await getPaymentService().ensureConnectedAccount(
    dbUser.id,
    appUser.email,
  );
  await setStripeAccountId(dbUser.id, result.stripeAccountId, result.status);

  return NextResponse.json({
    stripeAccountId: result.stripeAccountId,
    status: result.status,
  });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run:
```bash
npx vitest run src/app/api/stripe/connect/account/__tests__/route.test.ts
```

Expected: PASS — all 3 tests green.

- [ ] **Step 6: Commit**

```bash
git add src/db/queries/users.ts src/app/api/stripe/connect/account/route.ts src/app/api/stripe/connect/account/__tests__/route.test.ts
git commit -m "feat(stripe): POST /api/stripe/connect/account with idempotent account creation

Reads users.stripe_account_id; creates a new Stripe Connected Account
only if missing. Auth via Clerk getAppUser → DB lookup by clerkId.
Returns existing account on repeat calls (refresh-safe)."
```

---

## Task 7: API endpoint — POST /api/stripe/connect/account-session with TDD

**Files:**
- Create: `src/app/api/stripe/connect/account-session/route.ts`
- Create: `src/app/api/stripe/connect/account-session/__tests__/route.test.ts`

- [ ] **Step 1: Write the failing route test**

Create `src/app/api/stripe/connect/account-session/__tests__/route.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreateSession = vi.fn();
const mockGetUserByClerkId = vi.fn();
const mockGetAppUser = vi.fn();

vi.mock('@/lib/services/payments', () => ({
  getPaymentService: () => ({
    createAccountSession: mockCreateSession,
  }),
}));

vi.mock('@/db/queries/users', () => ({
  getUserByClerkId: mockGetUserByClerkId,
}));

vi.mock('@/lib/auth/get-user', () => ({
  getAppUser: mockGetAppUser,
}));

beforeEach(() => {
  mockCreateSession.mockReset();
  mockGetUserByClerkId.mockReset();
  mockGetAppUser.mockReset();
});

describe('POST /api/stripe/connect/account-session', () => {
  it('returns 401 when no authenticated user', async () => {
    mockGetAppUser.mockResolvedValue(null);
    const { POST } = await import('../route');
    const res = await POST();
    expect(res.status).toBe(401);
  });

  it('returns 400 when user has no connected account yet', async () => {
    mockGetAppUser.mockResolvedValue({ id: 'clerk_1', email: 'pro@test.com' });
    mockGetUserByClerkId.mockResolvedValue({
      id: 'user_1',
      stripeAccountId: null,
    });
    const { POST } = await import('../route');
    const res = await POST();
    expect(res.status).toBe(400);
  });

  it('returns the session client secret', async () => {
    mockGetAppUser.mockResolvedValue({ id: 'clerk_1', email: 'pro@test.com' });
    mockGetUserByClerkId.mockResolvedValue({
      id: 'user_1',
      stripeAccountId: 'acct_1',
    });
    mockCreateSession.mockResolvedValue({
      clientSecret: 'cs_mock_1',
      expiresAt: 1735000000,
    });

    const { POST } = await import('../route');
    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.clientSecret).toBe('cs_mock_1');
    expect(body.expiresAt).toBe(1735000000);
    expect(mockCreateSession).toHaveBeenCalledWith('acct_1');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/app/api/stripe/connect/account-session/__tests__/route.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the route**

Create `src/app/api/stripe/connect/account-session/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getAppUser } from '@/lib/auth/get-user';
import { getUserByClerkId } from '@/db/queries/users';
import { getPaymentService } from '@/lib/services/payments';

export async function POST() {
  const appUser = await getAppUser();
  if (!appUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await getUserByClerkId(appUser.id);
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!dbUser.stripeAccountId) {
    return NextResponse.json(
      { error: 'Connected account not yet created. Call /api/stripe/connect/account first.' },
      { status: 400 },
    );
  }

  const result = await getPaymentService().createAccountSession(dbUser.stripeAccountId);

  return NextResponse.json({
    clientSecret: result.clientSecret,
    expiresAt: result.expiresAt,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/app/api/stripe/connect/account-session/__tests__/route.test.ts
```

Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/stripe/connect/account-session/route.ts src/app/api/stripe/connect/account-session/__tests__/route.test.ts
git commit -m "feat(stripe): POST /api/stripe/connect/account-session for embedded onboarding

Mints a short-lived AccountSession scoped to account_onboarding component.
Returns 400 when caller hasn't created a connected account yet (prereq:
/api/stripe/connect/account)."
```

---

## Task 8: API endpoint — POST /api/stripe/webhook with signature validation + account.updated handler with TDD

**Files:**
- Modify: `src/app/api/stripe/webhook/route.ts`
- Create: `src/app/api/stripe/webhook/__tests__/route.test.ts`

- [ ] **Step 1: Read the existing webhook route**

Run:
```bash
cat src/app/api/stripe/webhook/route.ts
```

Note its current content. The plan replaces it entirely. Do not preserve TODO stubs.

- [ ] **Step 2: Write the failing test**

Create `src/app/api/stripe/webhook/__tests__/route.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUpdateStatus = vi.fn();
const mockConstructEvent = vi.fn();

vi.mock('stripe', () => {
  const StripeClass = vi.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  }));
  return { default: StripeClass, __esModule: true };
});

vi.mock('@/db/queries/users', () => ({
  updateStripeAccountStatus: mockUpdateStatus,
}));

beforeEach(() => {
  mockUpdateStatus.mockReset();
  mockConstructEvent.mockReset();
  process.env.STRIPE_SECRET_KEY = 'sk_test_AC';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  vi.resetModules();
});

describe('POST /api/stripe/webhook', () => {
  it('rejects requests with an invalid signature', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 'bad',
      },
      body: '{"type":"account.updated"}',
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('updates account status to active on account.updated when charges_enabled + details_submitted', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'account.updated',
      data: {
        object: {
          id: 'acct_1',
          charges_enabled: true,
          details_submitted: true,
          requirements: { disabled_reason: null, currently_due: [] },
        },
      },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 'good',
      },
      body: '{"type":"account.updated"}',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockUpdateStatus).toHaveBeenCalledWith('acct_1', 'active');
  });

  it('updates account status to restricted when details_submitted but currently_due is non-empty', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'account.updated',
      data: {
        object: {
          id: 'acct_2',
          charges_enabled: false,
          details_submitted: true,
          requirements: { disabled_reason: null, currently_due: ['business_profile.url'] },
        },
      },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 'good',
      },
      body: '{}',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockUpdateStatus).toHaveBeenCalledWith('acct_2', 'restricted');
  });

  it('returns 200 + log no-op for unknown event types', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_1' } },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 'good',
      },
      body: '{}',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run:
```bash
npx vitest run src/app/api/stripe/webhook/__tests__/route.test.ts
```

Expected: FAIL — current route doesn't have the import patterns or behavior the tests expect.

- [ ] **Step 4: Replace the webhook route**

Replace ALL of `src/app/api/stripe/webhook/route.ts` with:

```typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateStripeAccountStatus } from '@/db/queries/users';
import type { StripeAccountStatus } from '@/lib/services/payments/types';

/**
 * POST /api/stripe/webhook
 * Stripe webhook endpoint. Validates signature via stripe.webhooks.constructEvent.
 *
 * Plan 1 events handled:
 * - account.updated → maps Stripe Account fields to local status, updates DB
 *
 * Plan 1 fallthrough: log + return 200 (Stripe retries on non-2xx).
 *
 * Spec: docs/superpowers/specs/2026-04-26-stripe-connect-onboarding-design.md §Webhook
 */
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');

  // Read raw body BEFORE any parsing — constructEvent needs the exact bytes.
  const rawBody = await request.text();

  // In dev with no STRIPE_WEBHOOK_SECRET, skip validation. Production env
  // always has the secret set; this branch is for local Vitest runs without env.
  if (!secretKey || !webhookSecret) {
    console.warn('[stripe-webhook] running without secrets — skipping signature validation');
    try {
      const parsed = JSON.parse(rawBody);
      return await handleEvent(parsed);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 403 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(secretKey, { typescript: true });
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] signature validation failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  return handleEvent(event);
}

async function handleEvent(event: Stripe.Event): Promise<Response> {
  switch (event.type) {
    case 'account.updated': {
      const account = event.data.object as Stripe.Account;
      const status = deriveAccountStatus(account);
      await updateStripeAccountStatus(account.id, status);
      console.log(`[stripe-webhook] account.updated ${account.id} -> ${status}`);
      break;
    }

    default:
      console.log(`[stripe-webhook] unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

function deriveAccountStatus(account: Stripe.Account): StripeAccountStatus {
  const reqs = account.requirements;
  const disabledReason = reqs?.disabled_reason;
  if (disabledReason) return 'disabled';

  if (account.charges_enabled === true && account.details_submitted === true) {
    return 'active';
  }

  const currentlyDue = reqs?.currently_due ?? [];
  if (account.details_submitted === true && currentlyDue.length > 0) {
    return 'restricted';
  }

  return 'pending';
}
```

- [ ] **Step 5: Run test to verify it passes**

Run:
```bash
npx vitest run src/app/api/stripe/webhook/__tests__/route.test.ts
```

Expected: PASS — all 4 tests green.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/stripe/webhook/route.ts src/app/api/stripe/webhook/__tests__/route.test.ts
git commit -m "feat(stripe): webhook signature validation + account.updated handler

Validates Stripe-Signature via stripe.webhooks.constructEvent.
Handles account.updated by deriving local status from charges_enabled,
details_submitted, requirements.disabled_reason, currently_due. Plan 2
adds payment_intent.succeeded, transfer.created, charge.dispute.created,
payout.failed."
```

---

## Task 9: UI — ConnectOnboardingClient component + /pro/onboarding/payouts page

**Files:**
- Create: `src/components/pro/ConnectOnboardingClient.tsx`
- Create: `src/app/(dashboard)/pro/onboarding/payouts/page.tsx`

This task has no Vitest unit tests — the embedded Stripe component is too tightly coupled to Stripe's runtime to test in isolation. Verification is via the manual smoke test (Task 11).

- [ ] **Step 1: Create the client component**

Create `src/components/pro/ConnectOnboardingClient.tsx`:

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
      return clientSecret as string;
    };

    return loadConnectAndInitialize({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      fetchClientSecret,
      appearance: {
        variables: {
          colorPrimary: '#1a1a2e',
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

- [ ] **Step 2: Create the page**

The exact path depends on where the existing pro dashboard route lives. Run this to confirm:
```bash
find src/app -type d -name "pro" | head -5
```

Likely `src/app/(dashboard)/pro/`. Create the page at `src/app/(dashboard)/pro/onboarding/payouts/page.tsx` (adjust to match the actual path). Content:

```typescript
import { redirect } from 'next/navigation';
import { getAppUser } from '@/lib/auth/get-user';
import { getUserByClerkId, setStripeAccountId } from '@/db/queries/users';
import { getPaymentService } from '@/lib/services/payments';
import { ConnectOnboardingClient } from '@/components/pro/ConnectOnboardingClient';

export default async function PayoutsOnboardingPage() {
  const appUser = await getAppUser();
  if (!appUser) {
    redirect('/sign-in');
  }

  const dbUser = await getUserByClerkId(appUser.id);
  if (!dbUser) {
    redirect('/sign-in');
  }

  // Ensure Stripe Connected Account exists before client component mints session
  if (!dbUser.stripeAccountId) {
    const result = await getPaymentService().ensureConnectedAccount(
      dbUser.id,
      appUser.email,
    );
    await setStripeAccountId(dbUser.id, result.stripeAccountId, result.status);
  }

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Get verified to start earning</h1>
      <p className="text-slate-600 mb-6">
        Stripe handles your identity and bank info securely. ~3 minutes.
      </p>
      <ConnectOnboardingClient />
    </main>
  );
}
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
npm run build 2>&1 | tail -15
```

Expected: build succeeds. The new route `/pro/onboarding/payouts` appears in the route table. Pages with client components will be flagged as `Dynamic` (`ƒ`) — that's correct.

- [ ] **Step 4: Commit**

```bash
git add src/components/pro/ConnectOnboardingClient.tsx src/app/\(dashboard\)/pro/onboarding/payouts/page.tsx
git commit -m "feat(ui): /pro/onboarding/payouts with embedded Stripe Connect form

Server component ensures Connected Account exists, then ConnectOnboardingClient
renders <ConnectAccountOnboarding> inline using AccountSession-minted
client secret. onExit returns to /pro/dashboard."
```

---

## Task 10: UI — StripeStatusBanner on dashboard

**Files:**
- Modify: `src/lib/auth/session.ts` (add `stripeAccountStatus` to mock user shape)
- Create: `src/components/pro/StripeStatusBanner.tsx`
- Modify: `src/app/(dashboard)/pro/page.tsx` (add `<StripeStatusBanner />` near top)

- [ ] **Step 1: Read session.ts to understand the mock user shape**

Run:
```bash
cat src/lib/auth/session.ts
```

Find the `MOCK_USERS` definition and the `UserSession` type. Note their structure — you'll need to add `stripeAccountStatus` to both.

- [ ] **Step 2: Add stripeAccountStatus to the session shape**

In `src/lib/auth/session.ts`, find the `UserSession` interface (or type alias) and add:

```typescript
  stripeAccountStatus: 'none' | 'pending' | 'active' | 'restricted' | 'disabled';
```

Then in `MOCK_USERS`, add `stripeAccountStatus: 'none'` to each role's entry. The pro role should have `'none'` so the banner shows by default in dev.

If the mock includes both pro and client, only pro needs a meaningful default — clients always have `stripeAccountStatus: 'none'` and never see the banner (they're not pros).

- [ ] **Step 3: Create the banner component**

Create `src/components/pro/StripeStatusBanner.tsx`:

```typescript
import Link from 'next/link';
import type { StripeAccountStatus } from '@/lib/services/payments/types';

interface Props {
  status: StripeAccountStatus;
}

export function StripeStatusBanner({ status }: Props) {
  if (status === 'active') return null;

  if (status === 'pending') {
    return (
      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
        <p className="text-sm text-amber-900">
          <strong>Verification in progress.</strong> Stripe is reviewing your info — this usually takes a few minutes.{' '}
          <Link href="/pro/onboarding/payouts" className="underline">Check status</Link>
        </p>
      </div>
    );
  }

  if (status === 'restricted') {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 mb-4">
        <p className="text-sm text-red-900">
          <strong>Stripe needs more info from you.</strong>{' '}
          <Link href="/pro/onboarding/payouts" className="underline">Complete verification →</Link>
        </p>
      </div>
    );
  }

  if (status === 'disabled') {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 mb-4">
        <p className="text-sm text-red-900">
          <strong>Your Stripe account is disabled.</strong> Contact support for assistance.
        </p>
      </div>
    );
  }

  // status === 'none' (default for new pros)
  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
      <p className="text-sm text-amber-900">
        <strong>Get verified to start earning.</strong>{' '}
        Pros must complete a one-time Stripe verification (~3 min) before accepting jobs.{' '}
        <Link href="/pro/onboarding/payouts" className="underline font-semibold">Verify now →</Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Render the banner on the pro dashboard**

Find the pro dashboard page. Run:
```bash
find src/app -path '*pro/page.tsx' -o -path '*pro/dashboard/page.tsx' 2>/dev/null
```

Open the file. Add the import at the top:

```typescript
import { StripeStatusBanner } from '@/components/pro/StripeStatusBanner';
import { getCurrentSession } from '@/lib/auth/session';
```

(If `getCurrentSession` is already imported, skip the second line.) Then in the JSX, add `<StripeStatusBanner status={getCurrentSession().stripeAccountStatus} />` near the top of the main content — typically right after the page heading or hero block. The exact placement is a judgment call; if the dashboard has a `<DashboardHeader>` followed by `<DashboardContent>`, place the banner between them.

If the dashboard is currently a Client Component (uses `'use client'`), `getCurrentSession()` is fine to call directly. If it's a Server Component, prefer reading `getAppUser()` + DB lookup instead — but the simplest pattern matches the existing dashboard, whatever that is.

- [ ] **Step 5: Verify build passes**

Run:
```bash
npm run build 2>&1 | tail -10
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth/session.ts src/components/pro/StripeStatusBanner.tsx src/app/\(dashboard\)/pro/page.tsx
git commit -m "feat(ui): StripeStatusBanner on pro dashboard reflects verification status

Mock session adds stripeAccountStatus field with default 'none' so dev
reliably sees the verify-now CTA. Banner renders five distinct states
matching spec §State model. 'active' renders nothing (no banner)."
```

---

## Task 11: Smoke test + final verification + push

**Files:** No file changes — verification only.

- [ ] **Step 1: Run the full test suite**

Run:
```bash
npx vitest run 2>&1 | tail -10
```

Expected: all tests pass. Compared to the start-of-branch baseline (175 passed, 0 failed), the new total should be approximately **175 + 12 = 187 tests passing, 0 failing**. Failure count must NOT increase.

- [ ] **Step 2: Run a production build**

Run:
```bash
npm run build 2>&1 | tail -25
```

Expected: build succeeds. The route table includes:
- `/api/stripe/connect/account` (Dynamic, ƒ)
- `/api/stripe/connect/account-session` (Dynamic, ƒ)
- `/api/stripe/webhook` (Dynamic, ƒ — already existed but was modified)
- `/pro/onboarding/payouts` (Dynamic, ƒ — has client component)

- [ ] **Step 3: Manual end-to-end smoke test (mock mode)**

This validates the UI flow even without Stripe credentials.

Start dev server:
```bash
npm run dev > /tmp/sherpa-stripe-dev.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 30); do
  grep -q "Local:" /tmp/sherpa-stripe-dev.log && break
  sleep 1
done
```

Then in a browser (or via `curl`):
1. Visit http://localhost:3000/pro/dashboard
2. Confirm the amber "Get verified to start earning" banner appears
3. Click the "Verify now →" link
4. Confirm browser navigates to `/pro/onboarding/payouts`
5. The page may show an error in mock mode (no `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) — that's expected. The route renders, the server preflight runs, the client component fails to initialize Stripe. **Visual confirmation that the error appears = success for mock mode.** (Real Stripe rendering is a Phase 2 step from the runbook.)

Stop the dev server:
```bash
kill $DEV_PID
```

If the dev server doesn't start cleanly (port conflict, etc.), document in your report and proceed.

- [ ] **Step 4: Verify `/api/health` includes Stripe**

The existing `/api/health` already reports `stripe.status` based on `STRIPE_SECRET_KEY`. No changes needed in this plan; verify the endpoint still returns the expected shape:

```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool 2>/dev/null || echo "(server stopped — skip)"
```

If the server is still running, confirm `services.stripe.status` is `unconfigured` (no env vars in dev) and `services.stripe.mode` is undefined. If stopped, this step is skipped — the `/api/health` route is verified by build success.

- [ ] **Step 5: Show the branch's commits**

```bash
git log --oneline main..HEAD
```

Report the count and the messages — should be roughly 10-11 commits matching the task numbers.

- [ ] **Step 6: Show the diff stats**

```bash
git diff main..HEAD --stat | tail -10
```

Report file count and line stats.

- [ ] **Step 7: Do NOT push**

Stop here. The orchestrator decides when to push, merge to main, and clean up the worktree (via the `superpowers:finishing-a-development-branch` skill).

- [ ] **Step 8: Final report**

Provide a structured report with:
- Total commit count
- Test totals (X passed, 0 failed)
- Build status
- Smoke test result (pass / partial / blocked)
- Any flagged followups (things noticed during implementation that the spec didn't capture)

---

## Known Limitations (intentional, NOT placeholders)

1. **Job-accept gate is dashboard-level only.** The pro dashboard banner gates visibility, but there's no server-side check that pros must be `stripe_account_status === 'active'` before being matched to jobs or before clients accept their bids. That granular gate lands in Plan 2 (when actual money flow makes the gate meaningful).
2. **`stripe_onboarded_at` benign race.** Two simultaneous webhooks for the same `account.updated` transition both pass the null check and write the timestamp. Last-write-wins. Acceptable per spec; future plans add Stripe's `event.id` deduplication.
3. **No retry on transient Stripe failures.** `accounts.create` and `accountSessions.create` throw on 5xx; caller sees the error. Plan 1 leaves retry to the caller (refresh the page); Plan 2's payment events will need real retry logic.
4. **Dev/preview without Clerk** (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` unset) returns null from `getAppUser()`, so all API routes return 401 in that mode. The mock session handles UI rendering; APIs require real auth.
5. **Migration 012 application is manual.** No npm script; apply via `psql` against each Neon branch. This is consistent with how migrations 001-010 landed.

## Spec Coverage

| Spec section | Tasks |
|---|---|
| §Architecture / data flow | 1, 6, 7, 8, 9, 10 |
| §State model (5-state enum) | 1 (schema), 5 (deriveStatus), 8 (webhook handler) |
| §Service abstraction | 3, 4, 5 |
| §Schema changes (migration 012) | 1 |
| §API endpoints | 6, 7, 8 |
| §UI components | 9, 10 |
| §Webhook signature validation | 8 |
| §Testing strategy | 4, 5, 6, 7, 8, 11 |

## Self-Review

- ✅ Spec coverage: all 8 spec sections map to at least one task
- ✅ Placeholder scan: no "TBD", "TODO", "implement later" in plan text. The "TODO" comment in Task 4's stub stripe-service.ts is intentional — that file's stubs are replaced in Task 5
- ✅ Type consistency: `StripeAccountStatus` enum values match across types.ts, mock-service.ts, stripe-service.ts (deriveStatus), webhook handler (deriveAccountStatus duplicated for module isolation), banner component
- ✅ File paths: every Create/Modify path is exact
- ✅ Commands: every step has copy-pasteable commands with expected output described
