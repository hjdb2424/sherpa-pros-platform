# Service Abstraction Layer + Twilio SDK Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the migration-ready service abstraction skeleton (`src/lib/services/`) and wire the real Twilio Conversations SDK into the existing messaging stack so the platform can send real SMS/in-app messages instead of returning mock stubs.

**Architecture:** Additive — keep `src/lib/communication/` (already conforms to the `CommunicationService` interface) and introduce `src/lib/services/` as the umbrella for all integration getters. `getMessagingService()` initially re-exports the existing `communicationService` const so we get spec-compliant call sites without a 11-file refactor; future integrations (Stripe, R2) are written fresh inside `services/`. Twilio SDK calls replace the `// TODO` stubs in `src/lib/communication/twilio-service.ts`. DB persistence for conversations/messages is OUT OF SCOPE — the existing in-memory `conversationCache` stays until a follow-up plan adds migration 012 with `conversations` + `messages` tables.

**Tech Stack:** Next.js 16 (App Router) · TypeScript strict · Twilio Node SDK · Vitest · Drizzle ORM (no schema changes in this plan).

**Source spec:** `docs/superpowers/specs/2026-04-25-production-launch-hub-architecture-design.md` (sections 1, 3, and 8).

---

## File Structure

**Create:**

| Path | Responsibility |
|---|---|
| `src/lib/services/interfaces.ts` | Re-exports of all service interfaces, single import point for consumers |
| `src/lib/services/messaging/index.ts` | `getMessagingService()` — env-aware getter returning `CommunicationService` |
| `src/lib/services/README.md` | One-page guide: how to add a new service to the umbrella |
| `src/lib/communication/__tests__/twilio-service.test.ts` | Vitest suite for the real Twilio implementation (mocks the `twilio` SDK) |
| `src/lib/services/__tests__/messaging.test.ts` | Vitest suite for `getMessagingService()` env switching |
| `src/app/api/health/route.ts` | `GET /api/health` — service status JSON |

**Modify:**

| Path | Change |
|---|---|
| `package.json` | Add `twilio: ^5.x` dependency |
| `src/lib/communication/twilio-service.ts` | Replace TODO stubs (lines 34-37, 65-82, 111-117, 138-150, 176-179, 197-200, 211-216) with real Twilio Conversations API calls; keep the in-memory `conversationCache` |
| `src/app/api/chat/webhook/route.ts` | Add real signature validation (replace TODO at lines 16-22) using `twilio.validateRequest` |

**Out of scope (followup plans):**

- DB migration for `conversations` + `messages` tables — currently in-memory only
- Stripe Connect (own plan)
- Cloudflare R2 storage (own plan)
- `getDeliveryService()`, `getPaymentService()`, `getStorageService()`, `getQueueService()` — interfaces only, no implementations until each integration is wired

---

## Task 1: Create services/ directory skeleton + interfaces

**Files:**
- Create: `src/lib/services/interfaces.ts`
- Create: `src/lib/services/README.md`

- [ ] **Step 1: Write the interfaces re-export file**

Create `src/lib/services/interfaces.ts`:

```typescript
/**
 * Sherpa Pros — Service Interfaces
 *
 * Single import point for all integration interfaces.
 * Each `services/<name>/index.ts` exports a `getXService()` function that
 * picks a real or mock implementation based on env.
 *
 * Pattern from spec: 2026-04-25-production-launch-hub-architecture-design.md
 */

// Messaging — already implemented in src/lib/communication/
export type {
  CommunicationService as MessagingService,
  Conversation,
  Message,
  ConversationStatus,
  ConversationEvent,
  ConversationEventType,
  ParticipantRole,
} from '@/lib/communication/types';

// Future interfaces — these get filled in as each integration lands.
// Each interface lives next to its implementation, then is re-exported here.
//
// Tracked in followup plans:
// - PaymentService     (Stripe Connect)
// - StorageService     (Cloudflare R2)
// - DeliveryService    (Uber Connect / DoorDash Drive)
// - QueueService       (in-process → QStash)
// - HubService         (warehouse inventory)
```

- [ ] **Step 2: Write the README**

Create `src/lib/services/README.md`:

```markdown
# Services Layer

Migration-ready integration umbrella. Each external integration lives in its
own subdirectory and exports a `getXService()` function that picks the
implementation based on environment variables.

## Adding a new integration

1. Define the interface in `<name>/types.ts` (or re-export an existing one in
   `interfaces.ts`).
2. Implement the real adapter in `<name>/<provider>-service.ts`.
3. Implement the mock in `<name>/mock-service.ts`.
4. Export `getXService()` from `<name>/index.ts` that returns real if creds
   are set, mock otherwise.
5. Add the interface to `interfaces.ts`.
6. Add the service to `/api/health/route.ts`.

## Why this pattern?

Vercel → containers migration is a config flip, not a refactor. No business
logic touches infrastructure directly — every page/component imports from
`@/lib/services/...` not from a vendor SDK.
```

- [ ] **Step 3: Verify the file compiles in isolation**

Run: `cd ~/sherpa-pros-platform && npx tsc --noEmit src/lib/services/interfaces.ts`

Expected: no output (success) — the type re-exports resolve against existing `src/lib/communication/types.ts`.

- [ ] **Step 4: Commit**

```bash
cd ~/sherpa-pros-platform
git add src/lib/services/interfaces.ts src/lib/services/README.md
git commit -m "feat(services): add migration-ready service abstraction skeleton

Spec section 1: docs/superpowers/specs/2026-04-25-production-launch-hub-architecture-design.md"
```

---

## Task 2: Implement getMessagingService() with TDD

**Files:**
- Create: `src/lib/services/__tests__/messaging.test.ts`
- Create: `src/lib/services/messaging/index.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/services/__tests__/messaging.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getMessagingService } from '../messaging';
import { mockService } from '@/lib/communication/mock-service';
import { twilioService } from '@/lib/communication/twilio-service';

describe('getMessagingService', () => {
  const originalSid = process.env.TWILIO_ACCOUNT_SID;

  afterEach(() => {
    if (originalSid === undefined) {
      delete process.env.TWILIO_ACCOUNT_SID;
    } else {
      process.env.TWILIO_ACCOUNT_SID = originalSid;
    }
  });

  it('returns the mock service when TWILIO_ACCOUNT_SID is unset', () => {
    delete process.env.TWILIO_ACCOUNT_SID;
    expect(getMessagingService()).toBe(mockService);
  });

  it('returns the Twilio service when TWILIO_ACCOUNT_SID is set', () => {
    process.env.TWILIO_ACCOUNT_SID = 'AC_test_sid';
    expect(getMessagingService()).toBe(twilioService);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/lib/services/__tests__/messaging.test.ts`

Expected: FAIL — module `../messaging` not found.

- [ ] **Step 3: Write the implementation**

Create `src/lib/services/messaging/index.ts`:

```typescript
/**
 * Sherpa Pros — Messaging Service
 *
 * Picks Twilio if TWILIO_ACCOUNT_SID is set, mock otherwise.
 * Returns the canonical CommunicationService implementation from
 * src/lib/communication/ (which already conforms to the interface).
 */

import type { MessagingService } from '@/lib/services/interfaces';
import { mockService } from '@/lib/communication/mock-service';
import { twilioService } from '@/lib/communication/twilio-service';

export function getMessagingService(): MessagingService {
  if (process.env.TWILIO_ACCOUNT_SID) {
    return twilioService;
  }
  return mockService;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/lib/services/__tests__/messaging.test.ts`

Expected: PASS — 2 tests green.

- [ ] **Step 5: Commit**

```bash
cd ~/sherpa-pros-platform
git add src/lib/services/messaging/index.ts src/lib/services/__tests__/messaging.test.ts
git commit -m "feat(services): add getMessagingService() with env-based selection"
```

---

## Task 3: Add /api/health endpoint

**Files:**
- Create: `src/app/api/health/route.ts`

- [ ] **Step 1: Write the route**

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

/**
 * GET /api/health
 *
 * Returns the status of every external service. Becomes the container
 * health probe when migrated off Vercel.
 *
 * Spec section 8: 2026-04-25-production-launch-hub-architecture-design.md
 */
export async function GET() {
  const services: Record<string, { status: 'up' | 'unconfigured'; mode?: string }> = {
    database: {
      status: process.env.DATABASE_URL ? 'up' : 'unconfigured',
    },
    stripe: {
      status: process.env.STRIPE_SECRET_KEY ? 'up' : 'unconfigured',
      mode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')
        ? 'live'
        : process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')
          ? 'test'
          : undefined,
    },
    twilio: {
      status: process.env.TWILIO_ACCOUNT_SID ? 'up' : 'unconfigured',
      mode: process.env.TWILIO_ACCOUNT_SID ? 'real' : 'mock',
    },
    zinc: {
      status: process.env.ZINC_API_KEY ? 'up' : 'unconfigured',
    },
    storage: {
      status: process.env.R2_ACCESS_KEY_ID ? 'up' : 'unconfigured',
    },
  };

  const allUp = Object.values(services).every((s) => s.status === 'up');

  return NextResponse.json(
    {
      status: allUp ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services,
    },
    { status: 200 },
  );
}
```

- [ ] **Step 2: Verify the route works**

In one terminal: `cd ~/sherpa-pros-platform && npm run dev`

In another: `curl http://localhost:3000/api/health | head -40`

Expected: JSON response with `status` (healthy or degraded) and a `services` object listing every key shown above.

- [ ] **Step 3: Stop the dev server (Ctrl-C in the dev terminal).**

- [ ] **Step 4: Commit**

```bash
cd ~/sherpa-pros-platform
git add src/app/api/health/route.ts
git commit -m "feat(services): add /api/health endpoint with per-service status

Spec section 8: 2026-04-25-production-launch-hub-architecture-design.md"
```

---

## Task 4: Install Twilio SDK package

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install the package**

Run: `cd ~/sherpa-pros-platform && npm install twilio@^5.3.0`

Expected: `+ twilio@5.x.x` in stdout, no errors.

- [ ] **Step 2: Verify it landed in package.json**

Run: `grep '"twilio":' package.json`

Expected: `"twilio": "^5.3.0"` (or newer 5.x).

- [ ] **Step 3: Verify build still passes**

Run: `cd ~/sherpa-pros-platform && npm run build 2>&1 | tail -20`

Expected: build succeeds (no type errors). The TODO stubs in `twilio-service.ts` will still be there — they don't import the package yet.

- [ ] **Step 4: Commit**

```bash
cd ~/sherpa-pros-platform
git add package.json package-lock.json
git commit -m "chore(deps): add twilio SDK ^5.3.0 for Conversations API"
```

---

## Task 5: Wire real Twilio client + createConversation (TDD)

**Files:**
- Create: `src/lib/communication/__tests__/twilio-service.test.ts`
- Modify: `src/lib/communication/twilio-service.ts` (replace `getTwilioClient()` and `createConversation`)

- [ ] **Step 1: Write the failing test**

Create `src/lib/communication/__tests__/twilio-service.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoisted mock — twilio SDK swap before twilio-service.ts imports it
vi.mock('twilio', () => {
  const participantsCreate = vi.fn().mockResolvedValue({ sid: 'PA_mock' });
  const conversationsCreate = vi.fn().mockResolvedValue({
    sid: 'CH_mock_sid',
    friendlyName: 'mock',
    participants: () => ({ create: participantsCreate }),
  });
  const messagesCreate = vi.fn().mockResolvedValue({
    sid: 'IM_mock',
    body: 'hi',
    author: 'user_1',
    dateCreated: new Date('2026-04-26T00:00:00Z'),
  });
  const messagesList = vi.fn().mockResolvedValue([]);
  const conversationUpdate = vi.fn().mockResolvedValue({ sid: 'CH_mock_sid' });

  const conversationsAccessor = (sid: string) => ({
    sid,
    messages: { create: messagesCreate, list: messagesList },
    update: conversationUpdate,
    participants: (identity: string) => ({
      update: vi.fn().mockResolvedValue({ identity }),
    }),
  });
  conversationsAccessor.create = conversationsCreate;

  const factory = vi.fn().mockReturnValue({
    conversations: {
      v1: {
        conversations: conversationsAccessor,
      },
    },
  });
  return { default: factory, __esModule: true };
});

beforeEach(() => {
  process.env.TWILIO_ACCOUNT_SID = 'AC_test';
  process.env.TWILIO_AUTH_TOKEN = 'token_test';
});

describe('twilioService.createConversation', () => {
  it('creates a Twilio Conversation and returns a typed Conversation', async () => {
    const { twilioService } = await import('../twilio-service');
    const conv = await twilioService.createConversation('job_1', 'pro_1', 'client_1');

    expect(conv.jobId).toBe('job_1');
    expect(conv.proUserId).toBe('pro_1');
    expect(conv.clientUserId).toBe('client_1');
    expect(conv.twilioSid).toBe('CH_mock_sid');
    expect(conv.status).toBe('active');
  });

  it('throws when credentials are missing', async () => {
    delete process.env.TWILIO_ACCOUNT_SID;
    vi.resetModules();
    const { twilioService } = await import('../twilio-service');
    await expect(
      twilioService.createConversation('job_1', 'pro_1', 'client_1'),
    ).rejects.toThrow(/credentials not configured/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/lib/communication/__tests__/twilio-service.test.ts`

Expected: FAIL — `createConversation` returns `CH_placeholder_*` instead of `CH_mock_sid` (the current TODO stub builds the SID from a string template, not from the SDK).

- [ ] **Step 3: Replace the client + createConversation with real SDK calls**

In `src/lib/communication/twilio-service.ts`, replace lines 24-38 (the `getTwilioClient` function) with:

```typescript
import Twilio from 'twilio';

type TwilioClient = ReturnType<typeof Twilio>;

let cachedClient: TwilioClient | null = null;

function getTwilioClient(): TwilioClient {
  if (cachedClient) return cachedClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      'Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.',
    );
  }

  cachedClient = Twilio(accountSid, authToken);
  return cachedClient;
}
```

In the same file, replace the `createConversation` body (currently lines 61-99 — the function with the `TODO: Actual Twilio Conversations API call` block) with:

```typescript
  async createConversation(jobId, proId, clientId) {
    const client = getTwilioClient();
    const id = generateId('conv');

    const twilioConv = await client.conversations.v1.conversations.create({
      friendlyName: `Job ${jobId} — Pro ↔ Client`,
      uniqueName: id,
      attributes: JSON.stringify({ jobId, proId, clientId }),
    });

    await client.conversations.v1
      .conversations(twilioConv.sid)
      .participants.create({
        identity: proId,
        attributes: JSON.stringify({ role: 'pro', displayName: 'Pro' }),
      });

    await client.conversations.v1
      .conversations(twilioConv.sid)
      .participants.create({
        identity: clientId,
        attributes: JSON.stringify({ role: 'client', displayName: 'Client' }),
      });

    const conversation: Conversation = {
      id,
      jobId,
      proUserId: proId,
      clientUserId: clientId,
      twilioSid: twilioConv.sid,
      status: 'active',
      createdAt: new Date(),
      closedAt: null,
    };

    conversationCache.set(id, conversation);
    return conversation;
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/lib/communication/__tests__/twilio-service.test.ts`

Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
cd ~/sherpa-pros-platform
git add src/lib/communication/twilio-service.ts src/lib/communication/__tests__/twilio-service.test.ts
git commit -m "feat(messaging): wire real Twilio Conversations.create + participants

Replaces TODO stub in createConversation. In-memory conversationCache stays
until DB persistence lands in followup plan."
```

---

## Task 6: Wire sendMessage with real Twilio call (TDD)

**Files:**
- Modify: `src/lib/communication/__tests__/twilio-service.test.ts` (add suite)
- Modify: `src/lib/communication/twilio-service.ts` (replace `sendMessage` TODO)

- [ ] **Step 1: Add the failing test**

Append to `src/lib/communication/__tests__/twilio-service.test.ts`:

```typescript
describe('twilioService.sendMessage', () => {
  beforeEach(() => {
    process.env.TWILIO_ACCOUNT_SID = 'AC_test';
    process.env.TWILIO_AUTH_TOKEN = 'token_test';
    vi.resetModules();
  });

  it('posts the message via Conversations.messages.create', async () => {
    const { twilioService } = await import('../twilio-service');
    const conv = await twilioService.createConversation('job_2', 'pro_2', 'client_2');
    const msg = await twilioService.sendMessage(conv.id, 'pro_2', 'hello');

    expect(msg.body).toBe('hi'); // from the mock
    expect(msg.senderId).toBe('user_1'); // mock returns author='user_1'
    expect(msg.conversationId).toBe(conv.id);
  });

  it('throws when conversation does not exist', async () => {
    const { twilioService } = await import('../twilio-service');
    await expect(
      twilioService.sendMessage('does_not_exist', 'pro_2', 'hello'),
    ).rejects.toThrow(/Conversation not found/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/lib/communication/__tests__/twilio-service.test.ts -t sendMessage`

Expected: FAIL — current stub builds an in-memory message, not from the SDK return value, so `msg.body` is `'hello'` not `'hi'`.

- [ ] **Step 3: Replace sendMessage TODO with real SDK call**

In `src/lib/communication/twilio-service.ts`, replace the `sendMessage` body (currently the function around lines 101-129 with `TODO: Actual Twilio API call`) with:

```typescript
  async sendMessage(conversationId, senderId, body) {
    const client = getTwilioClient();
    const conversation = conversationCache.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }
    if (conversation.status !== 'active') {
      throw new Error(`Conversation is ${conversation.status}`);
    }
    if (!conversation.twilioSid) {
      throw new Error(`Conversation ${conversationId} has no Twilio SID`);
    }

    const twilioMsg = await client.conversations.v1
      .conversations(conversation.twilioSid)
      .messages.create({
        author: senderId,
        body,
      });

    const message: Message = {
      id: twilioMsg.sid,
      conversationId,
      senderId: twilioMsg.author ?? senderId,
      body: twilioMsg.body ?? body,
      createdAt: twilioMsg.dateCreated ?? new Date(),
      readAt: null,
    };

    return message;
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/lib/communication/__tests__/twilio-service.test.ts -t sendMessage`

Expected: PASS — both new tests green.

- [ ] **Step 5: Commit**

```bash
cd ~/sherpa-pros-platform
git add src/lib/communication/twilio-service.ts src/lib/communication/__tests__/twilio-service.test.ts
git commit -m "feat(messaging): wire real Twilio Conversations.messages.create"
```

---

## Task 7: Wire getMessages with real Twilio call (TDD)

**Files:**
- Modify: `src/lib/communication/__tests__/twilio-service.test.ts` (add suite)
- Modify: `src/lib/communication/twilio-service.ts` (replace `getMessages` TODO)

- [ ] **Step 1: Add the failing test**

Append to `src/lib/communication/__tests__/twilio-service.test.ts`:

```typescript
describe('twilioService.getMessages', () => {
  beforeEach(() => {
    process.env.TWILIO_ACCOUNT_SID = 'AC_test';
    process.env.TWILIO_AUTH_TOKEN = 'token_test';
    vi.resetModules();
  });

  it('returns mapped messages from the Twilio API', async () => {
    // Adjust the mock to return one message
    vi.doMock('twilio', () => {
      const factory = vi.fn().mockReturnValue({
        conversations: {
          v1: {
            conversations: Object.assign(
              (sid: string) => ({
                sid,
                messages: {
                  list: vi.fn().mockResolvedValue([
                    {
                      sid: 'IM_one',
                      body: 'hello',
                      author: 'pro_x',
                      dateCreated: new Date('2026-04-26T01:00:00Z'),
                    },
                  ]),
                  create: vi.fn(),
                },
                update: vi.fn(),
                participants: vi.fn(),
              }),
              {
                create: vi.fn().mockResolvedValue({
                  sid: 'CH_x',
                  participants: () => ({ create: vi.fn().mockResolvedValue({}) }),
                }),
              },
            ),
          },
        },
      });
      return { default: factory, __esModule: true };
    });

    const { twilioService } = await import('../twilio-service');
    const conv = await twilioService.createConversation('job_3', 'pro_3', 'client_3');
    const msgs = await twilioService.getMessages(conv.id);

    expect(msgs).toHaveLength(1);
    expect(msgs[0].body).toBe('hello');
    expect(msgs[0].senderId).toBe('pro_x');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/lib/communication/__tests__/twilio-service.test.ts -t getMessages`

Expected: FAIL — current stub returns `[]` regardless.

- [ ] **Step 3: Replace getMessages TODO with real SDK call**

In `src/lib/communication/twilio-service.ts`, replace the `getMessages` body (function around lines 131-154) with:

```typescript
  async getMessages(conversationId, limit = 50, _before) {
    const client = getTwilioClient();
    const conversation = conversationCache.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }
    if (!conversation.twilioSid) {
      return [];
    }

    const result = await client.conversations.v1
      .conversations(conversation.twilioSid)
      .messages.list({ limit, order: 'desc' });

    return result.map((m: { sid: string; body: string | null; author: string | null; dateCreated: Date | null }) => ({
      id: m.sid,
      conversationId,
      senderId: m.author ?? 'unknown',
      body: m.body ?? '',
      createdAt: m.dateCreated ?? new Date(),
      readAt: null,
    }));
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/lib/communication/__tests__/twilio-service.test.ts -t getMessages`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd ~/sherpa-pros-platform
git add src/lib/communication/twilio-service.ts src/lib/communication/__tests__/twilio-service.test.ts
git commit -m "feat(messaging): wire real Twilio Conversations.messages.list"
```

---

## Task 8: Wire closeConversation + markRead with real Twilio calls

**Files:**
- Modify: `src/lib/communication/twilio-service.ts` (replace remaining TODO stubs)

- [ ] **Step 1: Replace closeConversation TODO**

In `src/lib/communication/twilio-service.ts`, replace the `closeConversation` body (function around lines 169-184) with:

```typescript
  async closeConversation(conversationId) {
    const client = getTwilioClient();
    const conversation = conversationCache.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    if (conversation.twilioSid) {
      await client.conversations.v1
        .conversations(conversation.twilioSid)
        .update({ state: 'closed' });
    }

    conversation.status = 'closed';
    conversation.closedAt = new Date();
    return conversation;
  },
```

- [ ] **Step 2: Replace markRead TODO**

In the same file, replace the `markRead` body (around lines 205-217) with:

```typescript
  async markRead(conversationId, userId) {
    const client = getTwilioClient();
    const conversation = conversationCache.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }
    if (!conversation.twilioSid) {
      return;
    }

    const messages = await client.conversations.v1
      .conversations(conversation.twilioSid)
      .messages.list({ limit: 1, order: 'desc' });

    if (messages.length === 0) return;

    const latestIndex = messages[0].index;
    await client.conversations.v1
      .conversations(conversation.twilioSid)
      .participants(userId)
      .update({ lastReadMessageIndex: latestIndex });
  },
```

- [ ] **Step 3: Verify all twilio-service tests still pass**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/lib/communication/__tests__/twilio-service.test.ts`

Expected: PASS — all suites green (no new tests added; existing mocks already cover update/participants).

- [ ] **Step 4: Verify build passes**

Run: `cd ~/sherpa-pros-platform && npm run build 2>&1 | tail -10`

Expected: build succeeds, no type errors. (Note: `messages[0].index` may need a type cast if the SDK types complain — if so, cast the access expression: `(messages[0] as { index: number }).index`.)

- [ ] **Step 5: Commit**

```bash
cd ~/sherpa-pros-platform
git add src/lib/communication/twilio-service.ts
git commit -m "feat(messaging): wire real Twilio close + markRead

All TODO stubs in twilio-service.ts are now real SDK calls."
```

---

## Task 9: Add Twilio webhook signature validation (TDD)

**Files:**
- Create: `src/app/api/chat/webhook/__tests__/route.test.ts`
- Modify: `src/app/api/chat/webhook/route.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/api/chat/webhook/__tests__/route.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('twilio', () => {
  const validateRequest = vi.fn();
  const factory = vi.fn();
  // expose validateRequest on default export to match `Twilio.validateRequest`
  return {
    default: Object.assign(factory, { validateRequest }),
    __esModule: true,
    validateRequest,
  };
});

beforeEach(() => {
  process.env.TWILIO_AUTH_TOKEN = 'token_test';
  vi.resetModules();
});

describe('POST /api/chat/webhook signature validation', () => {
  it('rejects requests without a valid Twilio signature', async () => {
    const twilio = await import('twilio');
    (twilio.validateRequest as ReturnType<typeof vi.fn>).mockReturnValue(false);

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/chat/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-twilio-signature': 'bad',
      },
      body: 'EventType=onMessageAdded&ConversationSid=CH_x',
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('accepts requests with a valid Twilio signature', async () => {
    const twilio = await import('twilio');
    (twilio.validateRequest as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/chat/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-twilio-signature': 'good',
      },
      body: 'EventType=onMessageAdded&ConversationSid=CH_x&Author=pro&Body=hi',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/app/api/chat/webhook/__tests__/route.test.ts`

Expected: FAIL — current route does not validate signatures, so the "rejects bad signature" test gets 200 instead of 403.

- [ ] **Step 3: Add signature validation**

In `src/app/api/chat/webhook/route.ts`, replace the function body. The full new file content:

```typescript
import { NextResponse } from 'next/server';
import Twilio from 'twilio';

/**
 * POST /api/chat/webhook
 * Twilio webhook for incoming Conversations events.
 *
 * Twilio posts here when:
 * - A new message is added (onMessageAdded)
 * - A participant joins/leaves
 * - A conversation state changes
 *
 * Signature is validated using Twilio.validateRequest. The shared secret
 * is TWILIO_AUTH_TOKEN. Bad signatures get 403.
 */
export async function POST(request: Request) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const signature = request.headers.get('x-twilio-signature');

  // Twilio sends form-encoded by default; capture raw body once.
  const contentType = request.headers.get('content-type') ?? '';
  let body: Record<string, unknown>;
  let paramsForSig: Record<string, string> = {};

  try {
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      const entries = Object.fromEntries(formData.entries());
      body = entries;
      paramsForSig = Object.fromEntries(
        Object.entries(entries).map(([k, v]) => [k, String(v)]),
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Could not parse webhook body' },
      { status: 400 },
    );
  }

  // Validate signature when token + signature are present.
  // In dev with no TWILIO_AUTH_TOKEN we skip (mock mode).
  if (authToken && signature) {
    const valid = Twilio.validateRequest(
      authToken,
      signature,
      request.url,
      paramsForSig,
    );
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
  } else if (authToken && !signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 403 });
  }

  const eventType = body['EventType'] as string | undefined;

  switch (eventType) {
    case 'onMessageAdded': {
      const conversationSid = body['ConversationSid'] as string;
      const author = body['Author'] as string;
      const messageBody = body['Body'] as string;
      console.log(
        `[webhook] New message in ${conversationSid} from ${author}: ${messageBody?.substring(0, 50)}`,
      );
      // Persistence + push notifications land in followup plan (DB migration).
      break;
    }

    case 'onConversationStateUpdated': {
      const conversationSid = body['ConversationSid'] as string;
      const state = body['StateTo'] as string;
      console.log(
        `[webhook] Conversation ${conversationSid} state -> ${state}`,
      );
      break;
    }

    case 'onParticipantAdded':
    case 'onParticipantRemoved': {
      const conversationSid = body['ConversationSid'] as string;
      const identity = body['Identity'] as string;
      console.log(
        `[webhook] ${eventType} in ${conversationSid}: ${identity}`,
      );
      break;
    }

    default:
      console.log(`[webhook] Unhandled event: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ~/sherpa-pros-platform && npx vitest run src/app/api/chat/webhook/__tests__/route.test.ts`

Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
cd ~/sherpa-pros-platform
git add src/app/api/chat/webhook/route.ts src/app/api/chat/webhook/__tests__/route.test.ts
git commit -m "feat(messaging): validate Twilio webhook signature

Replaces TODO stub. Returns 403 on bad/missing signature when
TWILIO_AUTH_TOKEN is set. Skips validation in mock mode."
```

---

## Task 10: Smoke test the full path locally

**Files:** No file changes — verification only.

- [ ] **Step 1: Verify mock-mode end-to-end**

Run: `cd ~/sherpa-pros-platform && npm run dev` in one terminal.

In another terminal:

```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

Expected: `services.twilio.mode == "mock"` and `services.database.status == "up"` (or similar based on env).

- [ ] **Step 2: Verify the messaging service picks the mock**

In a Node REPL or a quick script:

```bash
cd ~/sherpa-pros-platform
node --input-type=module -e "
  const { getMessagingService } = await import('./src/lib/services/messaging/index.ts');
  const svc = getMessagingService();
  const conv = await svc.createConversation('job_smoke', 'pro_smoke', 'client_smoke');
  console.log('conv twilioSid:', conv.twilioSid);
  // null means we got the mock — expected when TWILIO_ACCOUNT_SID is unset
"
```

Expected: `conv twilioSid: null` (mock mode).

If TypeScript/ESM resolution complains, skip this step — the unit tests already prove the wiring.

- [ ] **Step 3: Stop dev server (Ctrl-C in dev terminal).**

- [ ] **Step 4: Run full test suite**

Run: `cd ~/sherpa-pros-platform && npx vitest run 2>&1 | tail -20`

Expected: all tests pass — at minimum the two new files (`twilio-service.test.ts`, `messaging.test.ts`, `webhook/__tests__/route.test.ts`) plus the existing 5 test files (commission, project-vetter, scoring, documentation-engine, xactimate-bridge). No regressions.

- [ ] **Step 5: Verify production build**

Run: `cd ~/sherpa-pros-platform && npm run build 2>&1 | tail -15`

Expected: build succeeds. `/api/health` and `/api/chat/webhook` show in the route list.

- [ ] **Step 6: Push the branch**

```bash
cd ~/sherpa-pros-platform
git status
git push origin main
```

Expected: all 9 commits land on remote `main`.

---

## Known Limitations (followup-tracked)

These are intentional out-of-scope items, NOT placeholders:

1. **In-memory `conversationCache` in `twilio-service.ts`** — conversations are lost on server restart. Followup plan: add migration 012 with `conversations` + `messages` tables, swap the Map for `db.query.conversations`.
2. **Webhook persistence** — `onMessageAdded` only logs. Followup plan persists incoming messages to DB and triggers push notifications.
3. **`getDeliveryService()`, `getPaymentService()`, `getStorageService()`, `getQueueService()`** — interfaces tracked in `services/interfaces.ts` comments only. Stripe Connect, R2, and queue work each get their own plan.
4. **Twilio SMS sync (in-app ↔ SMS)** — webhook receives messages, but routing them as SMS to the other party's phone requires phone-number provisioning per conversation (Twilio Proxy or Messaging Service mapping). Tracked in followup plan.

---

## Spec Coverage

| Spec section | Tasks |
|---|---|
| §1 Service abstraction layer (pattern, directory, env-based selection) | 1, 2 |
| §3 Real messaging — install package, replace TODO stubs, webhook | 4, 5, 6, 7, 8, 9 |
| §8 Health check endpoint | 3 |
| §9 Migration path (the abstraction itself enables this) | 1 (foundation) |

Spec sections 2 (Stripe Connect), 4 (R2 storage), 5 (Hub), 6 (DB migrations 011/012), 7 (rollout) are out of scope — each gets its own plan.
