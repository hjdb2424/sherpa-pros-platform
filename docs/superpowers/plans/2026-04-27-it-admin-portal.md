# IT Admin Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the manual `sherpa-is-admin` cookie hack with a real Clerk-backed admin portal: 2-tier RBAC, audit logging that actually persists, break-glass recovery, plus 2 read-only operational surfaces and hardening of the 5 existing admin pages.

**Architecture:** Clerk `publicMetadata.admin_tier` is the runtime authority; `admin_grants` table is the historical audit. Sync-write-then-Clerk pattern eliminates webhook race. Append-only audit log via DB role split. Mutations write audit synchronously; sensitive reads use Vercel `waitUntil()`. All five existing admin pages get `requireAdminTier(...)` gates and continue working unchanged otherwise.

**Tech Stack:** Next.js 16 App Router, Clerk (publicMetadata + sessions), Neon Postgres + Drizzle ORM, Vercel (cron + waitUntil), vitest.

**Spec:** `docs/superpowers/specs/2026-04-27-it-admin-portal-design.md`

---

## File map (created vs modified)

**Created:**
- `src/db/migrations/013_admin_grants.sql` — admin_grants table
- `src/db/migrations/014_audit_log_persistence.sql` — wire logAudit; (no shape change)
- `src/db/migrations/015_role_split.sql` — migrator + app role + grants
- `src/lib/auth/admin.ts` — AdminTier, permission matrix, requireAdminTier
- `src/lib/auth/admin.test.ts` — matrix unit tests
- `src/lib/auth/admin-grants.ts` — grant/revoke server actions
- `src/lib/auth/admin-grants.test.ts` — sync-write happy + failure path
- `src/lib/auth/break-glass.ts` — signed-cookie helpers
- `src/lib/auth/break-glass.test.ts`
- `src/lib/audit/scrubber.ts` — metadata redaction
- `src/lib/audit/scrubber.test.ts`
- `src/app/api/clerk/webhook/route.ts` — reconciler
- `src/app/break-glass/route.ts` — break-glass endpoint
- `src/app/(dashboard)/admin/layout.tsx` — Stripe-style shell
- `src/app/(dashboard)/admin/page.tsx` — overview dashboard
- `src/app/(dashboard)/admin/users/page.tsx` — read-only users index
- `src/app/(dashboard)/admin/users/[id]/page.tsx` — user detail panel
- `src/app/(dashboard)/admin/pros/page.tsx` — read-only pros index
- `src/app/(dashboard)/admin/pros/[id]/page.tsx` — pro detail panel
- `src/app/api/admin/overview/route.ts`
- `src/app/api/admin/users/route.ts`
- `src/app/api/admin/users/[id]/route.ts`
- `src/app/api/admin/users/[id]/disable/route.ts`
- `src/app/api/admin/pros/route.ts`
- `src/app/api/admin/pros/[id]/route.ts`
- `src/app/api/cron/break-glass-synthetic/route.ts`
- `src/app/api/cron/admin-grants-drift/route.ts`
- `src/lib/stripe/admin-guard.ts` — Stripe-suspension kill switch helper (§3.10)
- `vercel.json` (or update if exists) — cron schedule
- `docs/operations/break-glass.md` — runbook entry

**Modified:**
- `src/db/drizzle-schema.ts` — add `adminGrants` table export
- `src/lib/audit.ts` — replace mock `logAudit()` with real DB insert via scrubber
- `src/lib/db.ts` — add startup-role assertion
- `src/proxy.ts` — dual-read legacy + new tier cookies, 60s max-age
- `src/app/(dashboard)/admin/access-list/page.tsx` — `requireAdminTier("support"|"super")`
- `src/app/(dashboard)/admin/investor-metrics/page.tsx` — `requireAdminTier("super")`
- `src/app/(dashboard)/admin/logs/page.tsx` — `requireAdminTier("super")`
- `src/app/(dashboard)/admin/rewards/page.tsx` — `requireAdminTier("support")`
- `src/app/(dashboard)/admin/verifications/page.tsx` — `requireAdminTier("support"|"super")` + rate-limit existing suspend action

---

## Pre-flight (do once before Task 1)

- [ ] **Verify clean working tree**

  ```bash
  cd ~/sherpa-pros-platform && git status
  ```
  Expected: nothing staged or modified beyond untracked plan/spec files already committed. If anything is dirty, stash or commit before starting.

- [ ] **Confirm vitest runs cleanly**

  ```bash
  npx vitest run --reporter=basic 2>&1 | tail -10
  ```
  Expected: tests pass (or known failures match current main — note them so we don't blame our work).

- [ ] **Confirm Drizzle migrate works locally against a dev database**

  ```bash
  npm run db:migrate 2>&1 | tail -5
  ```
  Expected: "no pending migrations" or migration ran successfully.

---

## Phase 1 — Auth gate, admin_grants, break-glass (Tasks 1–10)

### Task 1: `admin_grants` schema migration

**Files:**
- Create: `src/db/migrations/013_admin_grants.sql`
- Modify: `src/db/drizzle-schema.ts` (add `adminGrants` export at the end)

- [ ] **Step 1: Write the migration SQL**

  Create `src/db/migrations/013_admin_grants.sql`:

  ```sql
  -- Migration 013: Admin Grants
  -- Append-only history of admin tier grants and revocations.
  -- Clerk publicMetadata.admin_tier is the runtime source of truth;
  -- this table is the audit history.

  CREATE TABLE admin_grants (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id),
    tier              VARCHAR(20) NOT NULL CHECK (tier IN ('super', 'support')),
    status            VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'active', 'revoked', 'failed')),
    granted_by        UUID REFERENCES users(id),
    granted_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at        TIMESTAMPTZ,
    revoked_by        UUID REFERENCES users(id),
    revocation_reason TEXT,
    clerk_event_id    VARCHAR(64),
    failure_reason    TEXT
  );

  -- Prevent double-active grants per user
  CREATE UNIQUE INDEX uniq_admin_grants_active
    ON admin_grants(user_id)
    WHERE status = 'active' AND revoked_at IS NULL;

  CREATE INDEX idx_admin_grants_user ON admin_grants(user_id);
  CREATE INDEX idx_admin_grants_status ON admin_grants(status);
  CREATE INDEX idx_admin_grants_granted_at ON admin_grants(granted_at DESC);

  -- For webhook idempotency
  CREATE UNIQUE INDEX uniq_admin_grants_clerk_event
    ON admin_grants(clerk_event_id)
    WHERE clerk_event_id IS NOT NULL;
  ```

- [ ] **Step 2: Add Drizzle table definition**

  In `src/db/drizzle-schema.ts`, append this export (mirror style of existing tables):

  ```typescript
  export const adminGrants = pgTable(
    "admin_grants",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      userId: uuid("user_id").notNull().references(() => users.id),
      tier: varchar("tier", { length: 20 }).notNull(),
      status: varchar("status", { length: 20 }).notNull(),
      grantedBy: uuid("granted_by").references(() => users.id),
      grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
      revokedAt: timestamp("revoked_at", { withTimezone: true }),
      revokedBy: uuid("revoked_by").references(() => users.id),
      revocationReason: text("revocation_reason"),
      clerkEventId: varchar("clerk_event_id", { length: 64 }),
      failureReason: text("failure_reason"),
    },
    (table) => [
      index("idx_admin_grants_user").on(table.userId),
      index("idx_admin_grants_status").on(table.status),
      index("idx_admin_grants_granted_at").on(table.grantedAt),
    ],
  );
  ```

- [ ] **Step 3: Run the migration**

  ```bash
  npm run db:migrate
  psql "$DATABASE_URL" -c '\d admin_grants'
  ```
  Expected: table listed with all columns and 4 indexes.

- [ ] **Step 4: Commit**

  ```bash
  git add src/db/migrations/013_admin_grants.sql src/db/drizzle-schema.ts
  git commit -m "feat(admin): admin_grants schema for tier history"
  ```

---

### Task 2: Permission matrix module + `requireAdminTier`

**Files:**
- Create: `src/lib/auth/admin.ts`
- Create: `src/lib/auth/__tests__/admin.test.ts`

- [ ] **Step 1: Write the failing test**

  Create `src/lib/auth/__tests__/admin.test.ts`:

  ```typescript
  import { describe, it, expect } from "vitest";
  import { can, type AdminTier } from "../admin";

  describe("can()", () => {
    it("super has all permissions", () => {
      expect(can("super", "admin.grant")).toBe(true);
      expect(can("super", "users.disable")).toBe(true);
      expect(can("super", "audit.view")).toBe(true);
    });

    it("support has view permissions but no mutations", () => {
      expect(can("support", "users.view")).toBe(true);
      expect(can("support", "pros.view")).toBe(true);
      expect(can("support", "users.disable")).toBe(false);
      expect(can("support", "admin.grant")).toBe(false);
      expect(can("support", "audit.view")).toBe(false);
    });

    it("undefined tier denies everything", () => {
      expect(can(undefined, "users.view")).toBe(false);
    });
  });
  ```

- [ ] **Step 2: Run the test to verify it fails**

  ```bash
  npx vitest run src/lib/auth/__tests__/admin.test.ts
  ```
  Expected: fail with "Cannot find module '../admin'".

- [ ] **Step 3: Implement `src/lib/auth/admin.ts`**

  ```typescript
  import { auth, currentUser } from "@clerk/nextjs/server";
  import { redirect } from "next/navigation";

  export type AdminTier = "super" | "support";

  export type AdminAction =
    | "admin.grant" | "admin.revoke" | "admin.view_grants"
    | "users.view" | "users.list" | "users.disable"
    | "pros.view" | "pros.list"
    | "audit.view"
    | "dataroom.view_grants" | "dataroom.grant" | "dataroom.revoke"
    | "verifications.queue.view" | "verifications.approve" | "verifications.reject"
    | "rewards.view"
    | "investor-metrics.view";

  const PERMISSIONS: Record<AdminTier, Record<AdminAction, boolean>> = {
    super: {
      "admin.grant": true, "admin.revoke": true, "admin.view_grants": true,
      "users.view": true, "users.list": true, "users.disable": true,
      "pros.view": true, "pros.list": true,
      "audit.view": true,
      "dataroom.view_grants": true, "dataroom.grant": true, "dataroom.revoke": true,
      "verifications.queue.view": true, "verifications.approve": true, "verifications.reject": true,
      "rewards.view": true,
      "investor-metrics.view": true,
    },
    support: {
      "admin.grant": false, "admin.revoke": false, "admin.view_grants": false,
      "users.view": true, "users.list": true, "users.disable": false,
      "pros.view": true, "pros.list": true,
      "audit.view": false,
      "dataroom.view_grants": true, "dataroom.grant": false, "dataroom.revoke": false,
      "verifications.queue.view": true, "verifications.approve": false, "verifications.reject": false,
      "rewards.view": true,
      "investor-metrics.view": false,
    },
  };

  export function can(tier: AdminTier | undefined, action: AdminAction): boolean {
    if (!tier) return false;
    return PERMISSIONS[tier]?.[action] === true;
  }

  /**
   * Server-side gate. Reads tier from Clerk publicMetadata.
   * Use at the top of server components and API routes.
   */
  export async function requireAdminTier(min: AdminTier): Promise<{ tier: AdminTier; userId: string }> {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in?redirect=/admin");

    const user = await currentUser();
    const tier = (user?.publicMetadata?.admin_tier as AdminTier | undefined);

    if (!tier) redirect("/");

    // 'super' satisfies any minimum; 'support' satisfies only 'support'
    if (min === "super" && tier !== "super") redirect("/");
    return { tier, userId };
  }
  ```

- [ ] **Step 4: Run the test, expect pass**

  ```bash
  npx vitest run src/lib/auth/__tests__/admin.test.ts
  ```
  Expected: 3 passing tests.

- [ ] **Step 5: Commit**

  ```bash
  git add src/lib/auth/admin.ts src/lib/auth/__tests__/admin.test.ts
  git commit -m "feat(auth): admin tier permission matrix + requireAdminTier"
  ```

---

### Task 3: Wire `logAudit` to actually persist to DB (was console-log mock)

**Files:**
- Modify: `src/lib/audit.ts` (replace mock `logAudit`, keep mock-data exports for the existing /admin/logs UI)
- Create: `src/lib/audit/__tests__/audit.test.ts`

- [ ] **Step 1: Write the failing test**

  Create `src/lib/audit/__tests__/audit.test.ts`:

  ```typescript
  import { describe, it, expect, beforeEach } from "vitest";
  import { db } from "@/lib/db";
  import { auditLogs } from "@/db/drizzle-schema";
  import { eq } from "drizzle-orm";
  import { logAudit } from "@/lib/audit";

  describe("logAudit()", () => {
    beforeEach(async () => {
      await db.delete(auditLogs).where(eq(auditLogs.action, "test_action"));
    });

    it("inserts a row into audit_logs", async () => {
      await logAudit("test_action" as any, {
        email: "test@example.com",
        targetType: "user",
        metadata: { foo: "bar" },
      });

      const rows = await db.select().from(auditLogs).where(eq(auditLogs.action, "test_action"));
      expect(rows).toHaveLength(1);
      expect(rows[0].email).toBe("test@example.com");
      expect(rows[0].targetType).toBe("user");
      expect(rows[0].metadata).toEqual({ foo: "bar" });
    });
  });
  ```

- [ ] **Step 2: Run the test to verify it fails**

  ```bash
  npx vitest run src/lib/audit/__tests__/audit.test.ts
  ```
  Expected: fail because logAudit currently only console.logs.

- [ ] **Step 3: Replace mock `logAudit` with real DB insert**

  In `src/lib/audit.ts`, replace the existing `logAudit` (lines ~42–60) with:

  ```typescript
  import { db } from "@/lib/db";
  import { auditLogs } from "@/db/drizzle-schema";

  export async function logAudit(
    action: AuditAction,
    opts: {
      userId?: string;
      email?: string;
      userName?: string;
      targetType?: string;
      targetId?: string;
      metadata?: Record<string, unknown>;
      ipAddress?: string;
    } = {}
  ): Promise<void> {
    try {
      await db.insert(auditLogs).values({
        userId: opts.userId,
        email: opts.email,
        action,
        targetType: opts.targetType,
        targetId: opts.targetId,
        metadata: opts.metadata ?? {},
        ipAddress: opts.ipAddress,
      });
    } catch (err) {
      // Don't break the user's request if audit fails — log loudly so monitoring catches it.
      console.error("[AUDIT] Failed to insert audit log:", err);
    }
  }
  ```

  Leave the mock data (`buildMockEntries`, `DEMO_USERS`) in place for now — the existing `/admin/logs` page reads them; we'll wire that page to real data in Task 5.

- [ ] **Step 4: Run the test, expect pass**

  ```bash
  npx vitest run src/lib/audit/__tests__/audit.test.ts
  ```
  Expected: pass. If it fails because of DB not available in test env, set up a test database or use `process.env.NODE_ENV === 'test'` guard following whatever the existing payments/dispatch tests do.

- [ ] **Step 5: Commit**

  ```bash
  git add src/lib/audit.ts src/lib/audit/__tests__/audit.test.ts
  git commit -m "fix(audit): persist logAudit to DB instead of console.log mock"
  ```

---

### Task 4: Audit metadata scrubber

**Files:**
- Create: `src/lib/audit/scrubber.ts`
- Create: `src/lib/audit/__tests__/scrubber.test.ts`
- Modify: `src/lib/audit.ts` (call scrubber inside `logAudit`)

- [ ] **Step 1: Write the failing test**

  Create `src/lib/audit/__tests__/scrubber.test.ts`:

  ```typescript
  import { describe, it, expect } from "vitest";
  import { scrubMetadata } from "../scrubber";

  describe("scrubMetadata()", () => {
    it("redacts Stripe live secret keys by value", () => {
      const result = scrubMetadata({ note: "user pasted sk_live_abcdefghijklmnop1234567890" });
      expect(result.note).toContain("[REDACTED]");
      expect(result.note).not.toContain("sk_live_");
    });

    it("redacts JWTs by value", () => {
      const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.abc123def456";
      const result = scrubMetadata({ token: jwt });
      // 'token' is also a key-name match — value will be replaced
      expect(result.token).toBe("[REDACTED]");
    });

    it("redacts by key name regardless of value shape", () => {
      const result = scrubMetadata({ password: "hunter2", email: "x@y.z" });
      expect(result.password).toBe("[REDACTED]");
      expect(result.email).toBe("x@y.z");
    });

    it("recursively scrubs nested objects", () => {
      const result = scrubMetadata({
        outer: { inner: { authorization: "Bearer xyz" } },
      });
      expect((result.outer as any).inner.authorization).toBe("[REDACTED]");
    });

    it("returns original for non-sensitive data", () => {
      const result = scrubMetadata({ jobId: "abc", count: 5 });
      expect(result).toEqual({ jobId: "abc", count: 5 });
    });
  });
  ```

- [ ] **Step 2: Run, expect fail**

  ```bash
  npx vitest run src/lib/audit/__tests__/scrubber.test.ts
  ```

- [ ] **Step 3: Implement `src/lib/audit/scrubber.ts`**

  ```typescript
  const VALUE_PATTERNS: RegExp[] = [
    /sk_(live|test)_[A-Za-z0-9]{20,}/g,
    /pk_(live|test)_[A-Za-z0-9]+/g,
    /rk_(live|test)_[A-Za-z0-9]+/g,
    /whsec_[A-Za-z0-9]+/g,
    /Bearer [A-Za-z0-9._\-]+/g,
    /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
    /ghp_[A-Za-z0-9]+/g,
    /gho_[A-Za-z0-9]+/g,
    /sess_[A-Za-z0-9]+/g,
    /[A-Za-z0-9_-]{40,}/g, // high-entropy fallback
  ];

  const KEY_DENYLIST = new Set([
    "authorization", "cookie", "set-cookie",
    "password", "secret", "token",
    "api_key", "apikey", "private_key",
  ]);

  let scrubberHits = 0;
  export function getScrubberHitCount(): number {
    return scrubberHits;
  }

  function scrubValue(v: unknown): unknown {
    if (typeof v === "string") {
      let out = v;
      for (const p of VALUE_PATTERNS) {
        if (p.test(out)) {
          scrubberHits++;
          out = out.replace(p, "[REDACTED]");
        }
      }
      return out;
    }
    if (Array.isArray(v)) return v.map(scrubValue);
    if (v && typeof v === "object") return scrubMetadata(v as Record<string, unknown>);
    return v;
  }

  export function scrubMetadata(meta: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(meta)) {
      if (KEY_DENYLIST.has(k.toLowerCase())) {
        scrubberHits++;
        out[k] = "[REDACTED]";
      } else {
        out[k] = scrubValue(v);
      }
    }
    return out;
  }
  ```

- [ ] **Step 4: Wire scrubber into `logAudit`**

  In `src/lib/audit.ts`, update the insert to call the scrubber:

  ```typescript
  import { scrubMetadata } from "./audit/scrubber";
  // ...
  await db.insert(auditLogs).values({
    // ...
    metadata: opts.metadata ? scrubMetadata(opts.metadata) : {},
    // ...
  });
  ```

- [ ] **Step 5: Run all audit tests**

  ```bash
  npx vitest run src/lib/audit
  ```
  Expected: all pass.

- [ ] **Step 6: Commit**

  ```bash
  git add src/lib/audit/scrubber.ts src/lib/audit/__tests__/scrubber.test.ts src/lib/audit.ts
  git commit -m "feat(audit): metadata scrubber for secrets in audit log"
  ```

---

### Task 5: New `AuditAction` enum entries for admin-portal events

**Files:**
- Modify: `src/lib/audit.ts` (extend `AuditAction` union and `ALL_AUDIT_ACTIONS`)

- [ ] **Step 1: Add new actions to the union**

  In `src/lib/audit.ts`, add these to the `AuditAction` type:

  ```typescript
  export type AuditAction =
    // ... existing entries ...
    | 'admin_granted' | 'admin_revoked' | 'admin_grant_failed'
    | 'user_disabled'
    | 'break_glass_used'
    | 'admin_grants_drift_detected';
  ```

  Find the `ALL_AUDIT_ACTIONS` export (used by the /admin/logs filter) and add the same entries.

- [ ] **Step 2: Add color hints in `/admin/logs/page.tsx`**

  In `src/app/(dashboard)/admin/logs/page.tsx` `ACTION_COLORS` object, append:

  ```typescript
  admin_granted: "bg-emerald-100 text-emerald-700",
  admin_revoked: "bg-red-100 text-red-700",
  admin_grant_failed: "bg-red-100 text-red-700",
  user_disabled: "bg-red-100 text-red-700",
  break_glass_used: "bg-orange-100 text-orange-700",
  admin_grants_drift_detected: "bg-orange-100 text-orange-700",
  ```

- [ ] **Step 3: Verify build**

  ```bash
  npm run build 2>&1 | tail -20
  ```
  Expected: success, no type errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/lib/audit.ts src/app/\(dashboard\)/admin/logs/page.tsx
  git commit -m "feat(audit): new AuditAction entries for admin-portal events"
  ```

---

### Task 6: Admin grant/revoke server actions (sync-write pattern)

**Files:**
- Create: `src/lib/auth/admin-grants.ts`
- Create: `src/lib/auth/__tests__/admin-grants.test.ts`

- [ ] **Step 1: Write the failing test**

  Create `src/lib/auth/__tests__/admin-grants.test.ts`:

  ```typescript
  import { describe, it, expect, vi, beforeEach } from "vitest";
  import { grantAdmin, revokeAdmin } from "../admin-grants";
  import { db } from "@/lib/db";
  import { adminGrants } from "@/db/drizzle-schema";
  import { eq, and } from "drizzle-orm";

  // Mock Clerk
  vi.mock("@clerk/nextjs/server", () => ({
    clerkClient: vi.fn(() => Promise.resolve({
      users: {
        updateUser: vi.fn(),
        getUserList: vi.fn(),
      },
      sessions: {
        revokeSession: vi.fn(),
        getSessionList: vi.fn(() => Promise.resolve({ data: [] })),
      },
    })),
  }));

  const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";
  const TEST_GRANTOR_ID = "00000000-0000-0000-0000-000000000002";

  beforeEach(async () => {
    await db.delete(adminGrants).where(eq(adminGrants.userId, TEST_USER_ID));
  });

  describe("grantAdmin()", () => {
    it("inserts pending then flips to active on Clerk 2xx", async () => {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const mockUpdate = vi.fn().mockResolvedValue({});
      vi.mocked(clerkClient).mockResolvedValue({
        users: { updateUser: mockUpdate, getUserList: vi.fn() },
        sessions: { revokeSession: vi.fn(), getSessionList: vi.fn(() => Promise.resolve({ data: [] })) },
      } as any);

      const result = await grantAdmin({ userId: TEST_USER_ID, tier: "support", grantedBy: TEST_GRANTOR_ID });

      expect(result.status).toBe("active");
      expect(mockUpdate).toHaveBeenCalledWith(TEST_USER_ID, {
        publicMetadata: { admin_tier: "support" },
      });
      const rows = await db.select().from(adminGrants).where(eq(adminGrants.userId, TEST_USER_ID));
      expect(rows).toHaveLength(1);
      expect(rows[0].status).toBe("active");
    });

    it("marks status=failed if Clerk update throws", async () => {
      const { clerkClient } = await import("@clerk/nextjs/server");
      vi.mocked(clerkClient).mockResolvedValue({
        users: { updateUser: vi.fn().mockRejectedValue(new Error("clerk down")), getUserList: vi.fn() },
        sessions: { revokeSession: vi.fn(), getSessionList: vi.fn(() => Promise.resolve({ data: [] })) },
      } as any);

      await expect(
        grantAdmin({ userId: TEST_USER_ID, tier: "super", grantedBy: TEST_GRANTOR_ID })
      ).rejects.toThrow();

      const rows = await db.select().from(adminGrants).where(eq(adminGrants.userId, TEST_USER_ID));
      expect(rows).toHaveLength(1);
      expect(rows[0].status).toBe("failed");
      expect(rows[0].failureReason).toContain("clerk down");
    });
  });

  describe("revokeAdmin()", () => {
    it("flips active row to revoked AND calls clerk.sessions.revoke", async () => {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const mockRevoke = vi.fn().mockResolvedValue({});
      const mockGetSessions = vi.fn().mockResolvedValue({ data: [{ id: "sess_123" }] });
      vi.mocked(clerkClient).mockResolvedValue({
        users: { updateUser: vi.fn().mockResolvedValue({}), getUserList: vi.fn() },
        sessions: { revokeSession: mockRevoke, getSessionList: mockGetSessions },
      } as any);

      await db.insert(adminGrants).values({
        userId: TEST_USER_ID, tier: "support", status: "active", grantedBy: TEST_GRANTOR_ID,
      });

      await revokeAdmin({ userId: TEST_USER_ID, revokedBy: TEST_GRANTOR_ID });

      const rows = await db.select().from(adminGrants).where(
        and(eq(adminGrants.userId, TEST_USER_ID), eq(adminGrants.status, "revoked"))
      );
      expect(rows).toHaveLength(1);
      expect(mockRevoke).toHaveBeenCalledWith("sess_123");
    });
  });
  ```

- [ ] **Step 2: Run, expect fail**

  ```bash
  npx vitest run src/lib/auth/__tests__/admin-grants.test.ts
  ```

- [ ] **Step 3: Implement `src/lib/auth/admin-grants.ts`**

  ```typescript
  import "server-only";
  import { clerkClient } from "@clerk/nextjs/server";
  import { db } from "@/lib/db";
  import { adminGrants } from "@/db/drizzle-schema";
  import { eq, and } from "drizzle-orm";
  import { logAudit } from "@/lib/audit";
  import type { AdminTier } from "./admin";

  export async function grantAdmin(opts: {
    userId: string;
    tier: AdminTier;
    grantedBy: string;
  }): Promise<{ id: string; status: "active" }> {
    // Step 1: insert pending
    const [row] = await db
      .insert(adminGrants)
      .values({
        userId: opts.userId,
        tier: opts.tier,
        status: "pending",
        grantedBy: opts.grantedBy,
      })
      .returning({ id: adminGrants.id });

    // Step 2: call Clerk
    try {
      const clerk = await clerkClient();
      await clerk.users.updateUser(opts.userId, {
        publicMetadata: { admin_tier: opts.tier },
      });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      await db
        .update(adminGrants)
        .set({ status: "failed", failureReason: reason })
        .where(eq(adminGrants.id, row.id));
      await logAudit("admin_grant_failed", {
        userId: opts.grantedBy,
        targetType: "user",
        targetId: opts.userId,
        metadata: { tier: opts.tier, reason },
      });
      throw err;
    }

    // Step 3: flip to active
    await db
      .update(adminGrants)
      .set({ status: "active" })
      .where(eq(adminGrants.id, row.id));

    await logAudit("admin_granted", {
      userId: opts.grantedBy,
      targetType: "user",
      targetId: opts.userId,
      metadata: { tier: opts.tier },
    });

    return { id: row.id, status: "active" };
  }

  export async function revokeAdmin(opts: {
    userId: string;
    revokedBy: string;
    reason?: string;
  }): Promise<void> {
    await db
      .update(adminGrants)
      .set({
        status: "revoked",
        revokedAt: new Date(),
        revokedBy: opts.revokedBy,
        revocationReason: opts.reason,
      })
      .where(
        and(eq(adminGrants.userId, opts.userId), eq(adminGrants.status, "active"))
      );

    const clerk = await clerkClient();
    await clerk.users.updateUser(opts.userId, {
      publicMetadata: { admin_tier: null },
    });

    // Close the 60s cookie staleness window for compromise scenarios
    const sessions = await clerk.sessions.getSessionList({ userId: opts.userId });
    for (const sess of sessions.data) {
      await clerk.sessions.revokeSession(sess.id);
    }

    await logAudit("admin_revoked", {
      userId: opts.revokedBy,
      targetType: "user",
      targetId: opts.userId,
      metadata: { reason: opts.reason },
    });
  }
  ```

- [ ] **Step 4: Run, expect pass**

  ```bash
  npx vitest run src/lib/auth/__tests__/admin-grants.test.ts
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add src/lib/auth/admin-grants.ts src/lib/auth/__tests__/admin-grants.test.ts
  git commit -m "feat(auth): grantAdmin/revokeAdmin with sync-write pattern + session revoke"
  ```

---

### Task 7: Clerk webhook reconciler

**Files:**
- Create: `src/app/api/clerk/webhook/route.ts`

- [ ] **Step 1: Implement the webhook**

  This is greenfield (no existing webhook handler). Use the official Clerk webhook signing-verification pattern. Add `CLERK_WEBHOOK_SECRET` to Vercel env vars (separate task, mention in commit body).

  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { Webhook } from "svix";
  import { db } from "@/lib/db";
  import { adminGrants, users } from "@/db/drizzle-schema";
  import { eq, and } from "drizzle-orm";

  const SECRET = process.env.CLERK_WEBHOOK_SECRET;

  export async function POST(req: NextRequest) {
    if (!SECRET) {
      console.error("[clerk-webhook] CLERK_WEBHOOK_SECRET not set");
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");
    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const body = await req.text();
    const wh = new Webhook(SECRET);
    let evt: any;
    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (evt.type !== "user.updated") {
      return NextResponse.json({ ok: true });
    }

    const clerkUserId = evt.data.id as string;
    const tier = evt.data.public_metadata?.admin_tier as "super" | "support" | undefined;
    const eventId = svixId;

    // Look up internal user by Clerk ID (assumes users.clerk_id column exists; adapt as needed)
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkUserId)).limit(1);
    if (!user) return NextResponse.json({ ok: true });

    // Idempotency: skip if we've seen this event already
    const existing = await db
      .select()
      .from(adminGrants)
      .where(eq(adminGrants.clerkEventId, eventId))
      .limit(1);
    if (existing.length > 0) return NextResponse.json({ ok: true });

    if (tier) {
      // Reconcile: insert active row only if no active row exists for this user
      const active = await db
        .select()
        .from(adminGrants)
        .where(and(eq(adminGrants.userId, user.id), eq(adminGrants.status, "active")));
      if (active.length === 0) {
        await db.insert(adminGrants).values({
          userId: user.id,
          tier,
          status: "active",
          clerkEventId: eventId,
        });
      }
    } else {
      // Tier removed via Clerk dashboard externally — flip any active row to revoked
      await db
        .update(adminGrants)
        .set({ status: "revoked", revokedAt: new Date(), clerkEventId: eventId })
        .where(and(eq(adminGrants.userId, user.id), eq(adminGrants.status, "active")));
    }

    return NextResponse.json({ ok: true });
  }
  ```

- [ ] **Step 2: Verify svix is installed**

  ```bash
  npm ls svix 2>/dev/null || npm install svix
  ```

- [ ] **Step 3: Build**

  ```bash
  npm run build 2>&1 | tail -10
  ```
  If `users.clerkId` doesn't exist on the schema, find the actual Clerk-id column (likely `clerk_user_id` or the row is keyed by the Clerk ID directly) and adapt.

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/api/clerk/webhook/route.ts package.json package-lock.json
  git commit -m "feat(auth): Clerk webhook reconciler for admin_grants drift

  Set CLERK_WEBHOOK_SECRET in Vercel env vars. Configure webhook in
  Clerk dashboard pointing at https://thesherpapros.com/api/clerk/webhook
  for the user.updated event."
  ```

---

### Task 8: `proxy.ts` dual-read cookie cutover

**Files:**
- Modify: `src/proxy.ts`

- [ ] **Step 1: Update proxy.ts to dual-read both cookies**

  Find the admin-tier check in `enforceRBAC` (currently the block under `if (requiredRole === "admin")`). Replace it with:

  ```typescript
  if (requiredRole === "admin") {
    // Phase 1 cutover: dual-read legacy + new cookies. Legacy = super.
    const legacyAdmin = request.cookies.get("sherpa-is-admin")?.value === "true";
    const tierCookie = request.cookies.get("sherpa-admin-tier")?.value;
    const tier = tierCookie === "super" || tierCookie === "support"
      ? tierCookie
      : (legacyAdmin ? "super" : null);

    if (!tier) {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = `/${currentRole}/dashboard`;
      return NextResponse.redirect(dashUrl);
    }
    return null;
  }
  ```

  After Clerk publishes the new `sherpa-admin-tier` cookie via the proxy auth wrapper, the legacy fallback can be removed in a follow-up commit (Task 8b — separate PR after Phyrom verifies session works).

- [ ] **Step 2: Set the new cookie from the Clerk wrapper**

  Inside `withClerk`, after `await auth.protect()`, before calling `enforceRBAC`, read tier from Clerk session claims and write the cookie:

  ```typescript
  return clerkMiddleware(async (auth, request) => {
    if (isProtectedRoute(request)) {
      await auth.protect();
    }

    // Sync admin tier from Clerk publicMetadata into a 60s cookie
    const session = await auth();
    const tier = (session.sessionClaims?.publicMetadata as any)?.admin_tier;
    const res = NextResponse.next();
    if (tier === "super" || tier === "support") {
      res.cookies.set("sherpa-admin-tier", tier, {
        path: "/",
        httpOnly: false, // proxy reads on next request; client doesn't need
        sameSite: "lax",
        maxAge: 60,
      });
    }

    const rbacResponse = enforceRBAC(request as NextRequest);
    if (rbacResponse) return rbacResponse;
    return res;
  })(req, {} as any);
  ```

  Note: this requires a Clerk session-claims template that exposes `publicMetadata`. If not configured, set it via Clerk dashboard → Sessions → Customize → add `{"publicMetadata": "{{user.public_metadata}}"}`. Capture this in the runbook.

- [ ] **Step 3: Build + test the existing /admin pages still load**

  ```bash
  npm run build 2>&1 | tail -10
  npm run dev &
  # In another terminal:
  curl -I -H "Cookie: sherpa-is-admin=true; sherpa-role=client" http://localhost:3000/admin/logs
  ```
  Expected: 200 (not 302).

- [ ] **Step 4: Commit**

  ```bash
  git add src/proxy.ts
  git commit -m "feat(auth): dual-read legacy + new admin tier cookies w/ 60s TTL"
  ```

---

### Task 9: Break-glass endpoint + signed-cookie helper

**Files:**
- Create: `src/lib/auth/break-glass.ts`
- Create: `src/lib/auth/__tests__/break-glass.test.ts`
- Create: `src/app/break-glass/route.ts`
- Modify: `src/proxy.ts` (honor break-glass cookie)
- Create: `docs/operations/break-glass.md`

- [ ] **Step 1: Test the signed-cookie helper**

  Create `src/lib/auth/__tests__/break-glass.test.ts`:

  ```typescript
  import { describe, it, expect } from "vitest";
  import { signBreakGlass, verifyBreakGlass } from "../break-glass";

  describe("break-glass cookie signing", () => {
    it("verifies a valid signed value", () => {
      const signed = signBreakGlass("test-secret", Date.now() + 3600_000);
      expect(verifyBreakGlass("test-secret", signed)).toBe(true);
    });

    it("rejects expired tokens", () => {
      const signed = signBreakGlass("test-secret", Date.now() - 1000);
      expect(verifyBreakGlass("test-secret", signed)).toBe(false);
    });

    it("rejects tampered tokens", () => {
      const signed = signBreakGlass("test-secret", Date.now() + 3600_000);
      const tampered = signed.replace(/.$/, "x");
      expect(verifyBreakGlass("test-secret", tampered)).toBe(false);
    });

    it("rejects with wrong secret", () => {
      const signed = signBreakGlass("secret-a", Date.now() + 3600_000);
      expect(verifyBreakGlass("secret-b", signed)).toBe(false);
    });
  });
  ```

- [ ] **Step 2: Implement `src/lib/auth/break-glass.ts`**

  ```typescript
  import { createHmac, timingSafeEqual } from "node:crypto";

  /** Returns "<expiryMs>.<base64url-hmac>" */
  export function signBreakGlass(secret: string, expiryMs: number): string {
    const payload = String(expiryMs);
    const sig = createHmac("sha256", secret).update(payload).digest("base64url");
    return `${payload}.${sig}`;
  }

  export function verifyBreakGlass(secret: string, value: string): boolean {
    const parts = value.split(".");
    if (parts.length !== 2) return false;
    const [payload, sig] = parts;
    const expiryMs = Number(payload);
    if (!Number.isFinite(expiryMs) || expiryMs < Date.now()) return false;

    const expected = createHmac("sha256", secret).update(payload).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }
  ```

- [ ] **Step 3: Implement `/break-glass` endpoint**

  Create `src/app/break-glass/route.ts`:

  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { signBreakGlass } from "@/lib/auth/break-glass";
  import { logAudit } from "@/lib/audit";

  export async function POST(req: NextRequest) {
    if (process.env.BREAK_GLASS_ENABLED !== "true") {
      return NextResponse.json({ ok: false, reason: "disabled" }, { status: 403 });
    }
    const key = process.env.BREAK_GLASS_KEY;
    if (!key) return NextResponse.json({ ok: false }, { status: 500 });

    const provided = (await req.json().catch(() => ({})))?.key;
    if (provided !== key) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const expiry = Date.now() + 3600_000; // 1 hour
    const signed = signBreakGlass(key, expiry);

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    await logAudit("break_glass_used", {
      ipAddress: ip,
      metadata: { expiryMs: expiry },
    });

    const res = NextResponse.json({ ok: true, expiresAt: new Date(expiry).toISOString() });
    res.cookies.set("sherpa-break-glass", signed, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 3600,
    });
    return res;
  }
  ```

- [ ] **Step 4: Honor the cookie in proxy.ts**

  In `enforceRBAC`, add at the top of the `requiredRole === "admin"` branch (before the existing tier-check):

  ```typescript
  if (process.env.BREAK_GLASS_ENABLED === "true") {
    const bg = request.cookies.get("sherpa-break-glass")?.value;
    if (bg) {
      const { verifyBreakGlass } = await import("@/lib/auth/break-glass");
      if (verifyBreakGlass(process.env.BREAK_GLASS_KEY ?? "", bg)) {
        return null; // grant super access via break-glass
      }
    }
  }
  ```

- [ ] **Step 5: Write the runbook entry**

  Create `docs/operations/break-glass.md`:

  ```markdown
  # Break-Glass Recovery

  When to use: Clerk is unreachable AND you need admin access.

  ## Activation
  1. Log into Vercel → Settings → Environment Variables
  2. Set `BREAK_GLASS_ENABLED=true` (Production tier)
  3. Redeploy (`git commit --allow-empty -m "chore: enable break-glass"; git push`)
  4. From any browser, open DevTools → Console at thesherpapros.com:
     ```js
     fetch('/break-glass', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ key: 'PASTE_BREAK_GLASS_KEY_HERE' }) }).then(r => r.json()).then(console.log)
     ```
  5. Browser is now authenticated as super for 1 hour.

  ## Cleanup (mandatory after incident)
  1. Vercel → Environment Variables → set `BREAK_GLASS_ENABLED=false`
  2. ROTATE `BREAK_GLASS_KEY` to a new random value
  3. Redeploy
  4. Verify the audit log has the `break_glass_used` row with the IP that used it
  5. If anything looks wrong, revoke all sessions for compromised users via Clerk dashboard
  ```

- [ ] **Step 6: Run tests**

  ```bash
  npx vitest run src/lib/auth
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add src/lib/auth/break-glass.ts src/lib/auth/__tests__/break-glass.test.ts src/app/break-glass/route.ts src/proxy.ts docs/operations/break-glass.md
  git commit -m "feat(auth): break-glass recovery endpoint + runbook

  Set BREAK_GLASS_KEY (random 32+ chars) and BREAK_GLASS_ENABLED=false
  in Vercel env vars. Flip ENABLED to true only during a Clerk outage,
  then back to false + rotate KEY after."
  ```

---

### Task 10: Apply `requireAdminTier(...)` to all 5 existing admin pages

**Files:**
- Modify: `src/app/(dashboard)/admin/access-list/page.tsx`
- Modify: `src/app/(dashboard)/admin/investor-metrics/page.tsx`
- Modify: `src/app/(dashboard)/admin/logs/page.tsx`
- Modify: `src/app/(dashboard)/admin/rewards/page.tsx`
- Modify: `src/app/(dashboard)/admin/verifications/page.tsx`

- [ ] **Step 1: Convert each page to a server-component shell that calls the gate, then renders the existing client component**

  Each existing page is currently a `"use client"` component. To call `requireAdminTier(...)` (which uses Clerk server-side), wrap each in a server-component shell.

  Pattern (apply to each page, swap tier per spec §4.5):

  - Rename existing `page.tsx` → `client-page.tsx` (keep `"use client"` and all logic untouched).
  - Create new `page.tsx`:
    ```typescript
    import { requireAdminTier } from "@/lib/auth/admin";
    import ClientPage from "./client-page";

    export default async function Page() {
      await requireAdminTier("super"); // or "support" per matrix
      return <ClientPage />;
    }
    ```

  Tier per page (per spec §4.5):
  - access-list: `support`
  - investor-metrics: `super`
  - logs: `super`
  - rewards: `support`
  - verifications: `support`

  For pages with API routes that perform mutations (access-list grant/revoke; verifications approve/reject), also gate the API routes with `requireAdminTier("super")` at the top of the handler.

- [ ] **Step 2: Verify each page renders for an admin and 302s for a non-admin**

  ```bash
  npm run dev &
  # As an admin:
  curl -I -H "Cookie: sherpa-is-admin=true; sherpa-role=client" http://localhost:3000/admin/logs
  # Expected: 200
  # As a non-admin:
  curl -I -H "Cookie: sherpa-role=client" http://localhost:3000/admin/logs
  # Expected: 302
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add 'src/app/(dashboard)/admin/'
  git commit -m "feat(admin): gate all 5 existing admin pages with requireAdminTier"
  ```

---

## Phase 2 — Audit hardening (Task 11)

### Task 11: DB role split + append-only assertion

**Files:**
- Create: `src/db/migrations/015_role_split.sql`
- Modify: `src/lib/db.ts` (startup assertion)
- Create: `src/lib/db/__tests__/role-restriction.test.ts`

- [ ] **Step 1: Write the role-split migration**

  Create `src/db/migrations/015_role_split.sql`:

  ```sql
  -- Migration 015: DB role split for append-only audit_logs
  -- migrator: owns schema, runs migrations, full DDL+DML
  -- app:      runtime app role, INSERT+SELECT only on audit_logs

  -- Create roles if not present
  DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname='app') THEN
      CREATE ROLE app LOGIN PASSWORD 'PLACEHOLDER_REPLACE_ON_NEON';
    END IF;
  END $$;

  -- App role gets full DML on most tables
  GRANT USAGE ON SCHEMA public TO app;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app;

  -- BUT app may only INSERT and SELECT on audit_logs; no UPDATE or DELETE
  REVOKE UPDATE, DELETE ON audit_logs FROM app;

  -- Default privileges so future tables created by migrator inherit the same pattern
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app;
  ```

  **Manual step on Neon:** the role password can't be plaintext in source. After running the migration script, set the password via Neon's role management UI, then update `DATABASE_URL` in Vercel to use the new `app` role.

- [ ] **Step 2: Add startup assertion in `src/lib/db.ts`**

  Find or create `src/lib/db.ts`. Add at the bottom (after the `db` export):

  ```typescript
  if (process.env.NODE_ENV === "production") {
    // Fire-and-forget assertion; if we're connecting as the migrator role in prod, abort boot.
    (async () => {
      try {
        const result = await db.execute<{ current_user: string }>("SELECT current_user");
        const role = (result as any).rows?.[0]?.current_user ?? "";
        if (role !== "app") {
          console.error(`[db] FATAL: production must connect as 'app' role, got '${role}'`);
          process.exit(1);
        }
      } catch (err) {
        console.error("[db] startup assertion failed:", err);
      }
    })();
  }
  ```

- [ ] **Step 3: CI test asserting append-only enforcement**

  Create `src/lib/db/__tests__/role-restriction.test.ts`:

  ```typescript
  import { describe, it, expect } from "vitest";
  import { db } from "@/lib/db";
  import { auditLogs } from "@/db/drizzle-schema";
  import { eq } from "drizzle-orm";

  describe("audit_logs append-only", () => {
    it("rejects UPDATE on audit_logs as the app role", async () => {
      // This test only meaningful when DATABASE_URL points at the app role
      if (process.env.SKIP_ROLE_TEST === "true") return;

      // Insert a row to UPDATE
      const [inserted] = await db
        .insert(auditLogs)
        .values({ action: "test_update_block" })
        .returning({ id: auditLogs.id });

      let threw = false;
      try {
        await db
          .update(auditLogs)
          .set({ action: "tampered" })
          .where(eq(auditLogs.id, inserted.id));
      } catch (err: any) {
        if (String(err.message).match(/permission denied/i)) threw = true;
      }
      expect(threw).toBe(true);
    });
  });
  ```

- [ ] **Step 4: Run migration and tests**

  ```bash
  npm run db:migrate
  npx vitest run src/lib/db
  ```
  In dev, the connection still uses the postgres role, so the test will be skipped via `SKIP_ROLE_TEST=true`. In CI, point `DATABASE_URL` at the app role to actually validate.

- [ ] **Step 5: Commit**

  ```bash
  git add src/db/migrations/015_role_split.sql src/lib/db.ts src/lib/db/__tests__/role-restriction.test.ts
  git commit -m "feat(audit): append-only audit_logs via app/migrator role split

  Manual follow-up after deploy:
  - Set 'app' role password in Neon
  - Update Vercel DATABASE_URL to use the app role
  - Set SKIP_ROLE_TEST=true in dev .env, false in CI"
  ```

---

## Phase 2.5 — Stripe-suspension kill switch helper

### Task 11b: `requireStripeAdminWritesEnabled()` guardrail

**Files:**
- Create: `src/lib/stripe/admin-guard.ts`
- Create: `src/lib/stripe/__tests__/admin-guard.test.ts`

This is a forward-looking guardrail per spec §3.10. No admin payment routes exist in v1. The helper exists so any future admin-initiated payments route can drop one line at the top and refuse to write while the Stripe Connect appeal is in flight. Without this scaffold present today, a future PR could ship a money-write path during the appeal window.

- [ ] **Step 1: Test**

  Create `src/lib/stripe/__tests__/admin-guard.test.ts`:

  ```typescript
  import { describe, it, expect, beforeEach } from "vitest";
  import { requireStripeAdminWritesEnabled } from "../admin-guard";

  describe("requireStripeAdminWritesEnabled()", () => {
    beforeEach(() => { delete process.env.STRIPE_ADMIN_WRITES_ENABLED; });

    it("throws when env var is unset", () => {
      expect(() => requireStripeAdminWritesEnabled()).toThrow(/disabled/i);
    });

    it("throws when env var is 'false'", () => {
      process.env.STRIPE_ADMIN_WRITES_ENABLED = "false";
      expect(() => requireStripeAdminWritesEnabled()).toThrow();
    });

    it("returns silently when env var is 'true'", () => {
      process.env.STRIPE_ADMIN_WRITES_ENABLED = "true";
      expect(() => requireStripeAdminWritesEnabled()).not.toThrow();
    });
  });
  ```

- [ ] **Step 2: Implement**

  ```typescript
  // src/lib/stripe/admin-guard.ts
  /**
   * Call at the top of any admin-initiated server action that writes to Stripe.
   * Throws (caller should return 503) when STRIPE_ADMIN_WRITES_ENABLED !== 'true'.
   *
   * Default: kill-switch is OFF. Flip to "true" only after the Stripe Connect
   * appeal resolves favorably AND a v2 spec covers admin payment workflows.
   */
  export function requireStripeAdminWritesEnabled(): void {
    if (process.env.STRIPE_ADMIN_WRITES_ENABLED !== "true") {
      throw new Error(
        "Stripe admin writes are disabled by kill switch. " +
        "See spec 2026-04-27-it-admin-portal-design.md §3.10."
      );
    }
  }
  ```

- [ ] **Step 3: Verify + commit**

  ```bash
  npx vitest run src/lib/stripe
  git add src/lib/stripe/admin-guard.ts src/lib/stripe/__tests__/admin-guard.test.ts
  git commit -m "feat(stripe): admin-writes kill switch helper (off by default)

  Future admin-initiated payment routes must call requireStripeAdminWritesEnabled()
  at the top. Default is OFF until Stripe Connect appeal resolves."
  ```

---

## Phase 3 — `/admin` shell + overview (Tasks 12–13)

### Task 12: `/admin` shell layout

**Files:**
- Create: `src/app/(dashboard)/admin/layout.tsx`

- [ ] **Step 1: Implement the persistent sidebar layout**

  Match the existing `/admin/logs` design language (zinc + emerald, rounded-xl borders, shadow-sm cards). Server component:

  ```typescript
  import { requireAdminTier } from "@/lib/auth/admin";
  import Link from "next/link";

  const NAV = [
    { group: "OVERVIEW", items: [
      { href: "/admin", label: "Home" },
      { href: "/admin/logs", label: "Audit Logs", tier: "super" as const },
    ]},
    { group: "PEOPLE", items: [
      { href: "/admin/users", label: "Users" },
      { href: "/admin/pros", label: "Pros" },
      { href: "/admin/verifications", label: "Verifications" },
    ]},
    { group: "INVESTORS", items: [
      { href: "/admin/investor-metrics", label: "Metrics", tier: "super" as const },
      { href: "/admin/access-list", label: "Access List" },
    ]},
    { group: "QUEUE", items: [
      { href: "/admin/rewards", label: "Rewards" },
    ]},
  ];

  export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { tier } = await requireAdminTier("support");

    return (
      <div className="flex min-h-screen bg-zinc-50">
        <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-white px-4 py-6 lg:block">
          <div className="mb-6 px-2 text-sm font-bold text-zinc-900">Sherpa Admin</div>
          {NAV.map((g) => (
            <div key={g.group} className="mb-6">
              <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {g.group}
              </div>
              {g.items
                .filter((i) => !i.tier || tier === "super")
                .map((i) => (
                  <Link key={i.href} href={i.href}
                    className="block rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100">
                    {i.label}
                  </Link>
                ))}
            </div>
          ))}
          <div className="mt-auto pt-4 text-xs text-zinc-400">Tier: {tier}</div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Build + verify**

  ```bash
  npm run build 2>&1 | tail -10
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add 'src/app/(dashboard)/admin/layout.tsx'
  git commit -m "feat(admin): Stripe-style sidebar shell for /admin/*"
  ```

---

### Task 13: `/admin` overview dashboard + API

**Files:**
- Create: `src/app/(dashboard)/admin/page.tsx`
- Create: `src/app/api/admin/overview/route.ts`

- [ ] **Step 1: Implement the overview API**

  ```typescript
  // src/app/api/admin/overview/route.ts
  import { NextResponse } from "next/server";
  import { db } from "@/lib/db";
  import { pros, jobs, auditLogs } from "@/db/drizzle-schema";
  import { eq, gte, sql, desc } from "drizzle-orm";
  import { requireAdminTier } from "@/lib/auth/admin";

  export async function GET() {
    await requireAdminTier("support");

    const [pendingPros] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(pros)
      .where(eq(pros.verificationStatus, "pending"));

    const [activeJobs] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(jobs)
      .where(sql`${jobs.status} IN ('open','assigned','in_progress')`);

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const [todayEvents] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(auditLogs)
      .where(gte(auditLogs.createdAt, startOfDay));

    const recent = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    return NextResponse.json({
      pendingPros: pendingPros?.n ?? 0,
      activeJobs: activeJobs?.n ?? 0,
      todayEvents: todayEvents?.n ?? 0,
      recent,
    });
  }
  ```

  Adapt column names (`verificationStatus`, `status`) to actual schema.

- [ ] **Step 2: Implement the overview page**

  Server component that fetches via the API or via direct query (direct query is simpler — can reuse the same logic):

  ```typescript
  // src/app/(dashboard)/admin/page.tsx
  import { requireAdminTier } from "@/lib/auth/admin";
  import { db } from "@/lib/db";
  import { pros, jobs, auditLogs } from "@/db/drizzle-schema";
  import { eq, gte, sql, desc } from "drizzle-orm";
  import Link from "next/link";

  export default async function AdminHome() {
    await requireAdminTier("support");

    const [pendingPros] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(pros).where(eq(pros.verificationStatus, "pending"));
    const [activeJobs] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(jobs).where(sql`${jobs.status} IN ('open','assigned','in_progress')`);
    const startOfDay = new Date(); startOfDay.setUTCHours(0,0,0,0);
    const [todayEvents] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(auditLogs).where(gte(auditLogs.createdAt, startOfDay));
    const recent = await db
      .select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(10);

    const Card = ({ href, label, value }: { href: string; label: string; value: number }) => (
      <Link href={href} className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
        <div className="mt-2 text-3xl font-bold text-zinc-900">{value}</div>
      </Link>
    );

    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900">Dashboard</h1>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card href="/admin/verifications" label="Pending verifications" value={pendingPros?.n ?? 0} />
          <Card href="/admin/users" label="Active jobs" value={activeJobs?.n ?? 0} />
          <Card href="/admin/logs" label="Audit events today" value={todayEvents?.n ?? 0} />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-3 text-sm font-semibold text-zinc-900">Recent activity</div>
          <ul className="divide-y divide-zinc-100 text-sm">
            {recent.map((e) => (
              <li key={e.id} className="py-2">
                <span className="font-mono text-zinc-500">{new Date(e.createdAt!).toLocaleTimeString()}</span>
                {" "}<span className="font-medium text-zinc-700">{e.action}</span>
                {" "}<span className="text-zinc-500">{e.email ?? ""}</span>
              </li>
            ))}
            {recent.length === 0 && <li className="py-4 text-zinc-400">No recent activity</li>}
          </ul>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 3: Verify**

  ```bash
  npm run build 2>&1 | tail -10
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add 'src/app/(dashboard)/admin/page.tsx' src/app/api/admin/overview/route.ts
  git commit -m "feat(admin): overview dashboard with counters + recent activity"
  ```

---

## Phase 4 — `/admin/users` (Tasks 14–15)

### Task 14: Users list + detail (read-only)

**Files:**
- Create: `src/app/(dashboard)/admin/users/page.tsx`
- Create: `src/app/(dashboard)/admin/users/client-list.tsx`
- Create: `src/app/api/admin/users/route.ts`
- Create: `src/app/api/admin/users/[id]/route.ts`

- [ ] **Step 1: List API**

  ```typescript
  // src/app/api/admin/users/route.ts
  import { NextRequest, NextResponse } from "next/server";
  import { db } from "@/lib/db";
  import { users } from "@/db/drizzle-schema";
  import { sql, ilike, or, desc, gte } from "drizzle-orm";
  import { requireAdminTier } from "@/lib/auth/admin";

  export async function GET(req: NextRequest) {
    await requireAdminTier("support");

    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    const days = url.searchParams.get("days");
    const q = url.searchParams.get("q")?.trim();
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const limit = 25;
    const offset = (page - 1) * limit;

    const conds: any[] = [];
    if (role) conds.push(sql`${users.role} = ${role}`);
    if (days) {
      const since = new Date(Date.now() - Number(days) * 86400_000);
      conds.push(gte(users.createdAt, since));
    }
    if (q) conds.push(or(ilike(users.email, `%${q}%`), ilike(users.name, `%${q}%`)));

    const where = conds.length ? sql`${sql.join(conds, sql` AND `)}` : undefined;

    const [{ n }] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(users)
      .where(where as any);

    const rows = await db
      .select()
      .from(users)
      .where(where as any)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      total: n,
      page,
      totalPages: Math.max(1, Math.ceil(n / limit)),
      entries: rows,
    });
  }
  ```

- [ ] **Step 2: Detail API**

  ```typescript
  // src/app/api/admin/users/[id]/route.ts
  import { NextRequest, NextResponse } from "next/server";
  import { db } from "@/lib/db";
  import { users } from "@/db/drizzle-schema";
  import { eq } from "drizzle-orm";
  import { requireAdminTier } from "@/lib/auth/admin";

  export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await requireAdminTier("support");
    const { id } = await params;
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(user);
  }
  ```

- [ ] **Step 3: Page (server) + client list (client) — match the /admin/logs pattern**

  Page is a server-component that gates auth and renders the client component:

  ```typescript
  // src/app/(dashboard)/admin/users/page.tsx
  import { requireAdminTier } from "@/lib/auth/admin";
  import ClientList from "./client-list";

  export default async function UsersPage() {
    const { tier } = await requireAdminTier("support");
    return <ClientList tier={tier} />;
  }
  ```

  The client list mirrors `/admin/logs/page.tsx` line-by-line — same filter chips, same pagination, same desktop table + mobile card pattern. Reuse the visual components and colors.

  Implementer: copy `/admin/logs/page.tsx` as a starting skeleton and adapt the columns to user fields (email, name, role, created, last sign-in). Each row links to `/admin/users/[id]`.

- [ ] **Step 4: Build + verify**

  ```bash
  npm run build && npm run dev &
  curl -I http://localhost:3000/admin/users
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add 'src/app/(dashboard)/admin/users/' src/app/api/admin/users/
  git commit -m "feat(admin): /admin/users read-only list + detail"
  ```

---

### Task 15: User detail panel + disable action with rate limit

**Files:**
- Create: `src/app/(dashboard)/admin/users/[id]/page.tsx`
- Create: `src/app/api/admin/users/[id]/disable/route.ts`
- Create: `src/lib/rate-limit.ts`

- [ ] **Step 1: Simple in-memory rate limiter**

  ```typescript
  // src/lib/rate-limit.ts
  const buckets = new Map<string, { count: number; resetAt: number }>();

  export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; resetAt: number } {
    const now = Date.now();
    const b = buckets.get(key);
    if (!b || b.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, resetAt: now + windowMs };
    }
    if (b.count >= max) return { ok: false, resetAt: b.resetAt };
    b.count++;
    return { ok: true, resetAt: b.resetAt };
  }
  ```

  Note: in-memory limiter resets on serverless cold start. For v1 with 1 admin this is fine; document upgrade to Vercel KV when the limiter actually matters.

- [ ] **Step 2: Disable API route**

  ```typescript
  // src/app/api/admin/users/[id]/disable/route.ts
  import { NextRequest, NextResponse } from "next/server";
  import { db } from "@/lib/db";
  import { users } from "@/db/drizzle-schema";
  import { eq } from "drizzle-orm";
  import { requireAdminTier } from "@/lib/auth/admin";
  import { rateLimit } from "@/lib/rate-limit";
  import { logAudit } from "@/lib/audit";

  export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { tier, userId: actorId } = await requireAdminTier("super");
    const { id } = await params;

    const limit = rateLimit(`users.disable:${actorId}`, 5, 3600_000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: `rate limit exceeded; resets at ${new Date(limit.resetAt).toISOString()}` },
        { status: 429 }
      );
    }

    await db.update(users).set({ disabled: true }).where(eq(users.id, id));
    await logAudit("user_disabled", { userId: actorId, targetType: "user", targetId: id, metadata: { tier } });

    return NextResponse.json({ ok: true });
  }
  ```

  If `users.disabled` column doesn't exist, add it via a tiny migration `016_users_disabled.sql`:
  ```sql
  ALTER TABLE users ADD COLUMN IF NOT EXISTS disabled BOOLEAN DEFAULT FALSE;
  ```
  And add to `drizzle-schema.ts`.

- [ ] **Step 3: Detail page**

  ```typescript
  // src/app/(dashboard)/admin/users/[id]/page.tsx
  import { requireAdminTier } from "@/lib/auth/admin";
  import { db } from "@/lib/db";
  import { users } from "@/db/drizzle-schema";
  import { eq } from "drizzle-orm";
  import DisableButton from "./disable-button";
  import Link from "next/link";

  const CLERK_DASH = "https://dashboard.clerk.com";

  export default async function UserDetail({ params }: { params: Promise<{ id: string }> }) {
    const { tier } = await requireAdminTier("support");
    const { id } = await params;
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) return <div className="p-8">User not found</div>;

    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">{user.name ?? user.email}</h1>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-zinc-500">Email</dt><dd className="text-zinc-900">{user.email}</dd></div>
          <div><dt className="text-zinc-500">Role</dt><dd className="text-zinc-900">{user.role}</dd></div>
          <div><dt className="text-zinc-500">Created</dt><dd className="text-zinc-900">{new Date(user.createdAt!).toLocaleString()}</dd></div>
          <div><dt className="text-zinc-500">Disabled</dt><dd className="text-zinc-900">{user.disabled ? "yes" : "no"}</dd></div>
        </dl>
        <div className="mt-8 flex gap-3">
          <a href={`${CLERK_DASH}`} target="_blank" rel="noopener"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50">
            Edit in Clerk →
          </a>
          {tier === "super" && !user.disabled && <DisableButton userId={user.id} />}
        </div>
      </div>
    );
  }
  ```

  Create `disable-button.tsx` as a tiny client component that POSTs to the disable endpoint and shows result.

- [ ] **Step 4: Build + commit**

  ```bash
  npm run build && \
  git add 'src/app/(dashboard)/admin/users/[id]/' src/app/api/admin/users/\[id\]/disable/ src/lib/rate-limit.ts
  git commit -m "feat(admin): user detail + disable action (super-only, rate-limited 5/hr)"
  ```

---

## Phase 5 — `/admin/pros` (Task 16)

### Task 16: Pros list + detail (read-only, links to verifications)

**Files:**
- Create: `src/app/(dashboard)/admin/pros/page.tsx`
- Create: `src/app/(dashboard)/admin/pros/client-list.tsx`
- Create: `src/app/(dashboard)/admin/pros/[id]/page.tsx`
- Create: `src/app/api/admin/pros/route.ts`
- Create: `src/app/api/admin/pros/[id]/route.ts`

- [ ] **Step 1: List + detail APIs**

  Mirror Task 14's user APIs. Columns: trade(s), hub, verification status, rating, created date.

- [ ] **Step 2: Page (server) + client list**

  Mirror Task 14's pages. Detail panel includes a prominent **"Manage in Verifications →"** link to `/admin/verifications?id=${pro.id}`. **No mutation buttons on this surface.**

- [ ] **Step 3: Apply rate limit to existing `pros.suspend` at `/admin/verifications`**

  Find the existing API route handling pro suspension under `src/app/api/admin/verifications/` (or wherever it lives — likely `/admin/verifications` or `/api/pros/[id]/suspend`). Add the same `rateLimit("pros.suspend:${actorId}", 5, 3600_000)` check at the top of the handler.

- [ ] **Step 4: Build + commit**

  ```bash
  npm run build && \
  git add 'src/app/(dashboard)/admin/pros/' src/app/api/admin/pros/
  git commit -m "feat(admin): /admin/pros read-only browser + suspend rate-limit"
  ```

---

## Phase 6 — Synthetics + drift cron (Tasks 17–18)

### Task 17: Weekly break-glass synthetic

**Files:**
- Create: `src/app/api/cron/break-glass-synthetic/route.ts`
- Modify: `vercel.json`

- [ ] **Step 1: Cron handler**

  ```typescript
  // src/app/api/cron/break-glass-synthetic/route.ts
  import { NextResponse } from "next/server";
  import { db } from "@/lib/db";
  import { auditLogs } from "@/db/drizzle-schema";
  import { eq, gte, and, desc } from "drizzle-orm";

  export async function GET(req: Request) {
    if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const synthKey = process.env.BREAK_GLASS_SYNTHETIC_KEY;
    const synthUrl = process.env.BREAK_GLASS_SYNTHETIC_URL; // preview-env URL
    if (!synthKey || !synthUrl) return NextResponse.json({ ok: false, reason: "missing config" });

    // Fire the break-glass against a preview env (not production)
    const before = new Date();
    const r = await fetch(`${synthUrl}/break-glass`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: synthKey }),
    });
    if (!r.ok) {
      console.error("[cron] break-glass synthetic failed", r.status);
      return NextResponse.json({ ok: false, status: r.status });
    }

    // Verify the audit row landed (in the preview DB — read separately if multi-DB)
    const recent = await db
      .select()
      .from(auditLogs)
      .where(and(eq(auditLogs.action, "break_glass_used"), gte(auditLogs.createdAt, before)))
      .orderBy(desc(auditLogs.createdAt))
      .limit(1);

    return NextResponse.json({ ok: recent.length > 0 });
  }
  ```

- [ ] **Step 2: Schedule it in `vercel.json`**

  ```json
  {
    "crons": [
      { "path": "/api/cron/break-glass-synthetic", "schedule": "0 12 * * 1" }
    ]
  }
  ```
  Mondays at 12:00 UTC.

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/api/cron/break-glass-synthetic/ vercel.json
  git commit -m "feat(admin): weekly break-glass synthetic test cron"
  ```

---

### Task 18: Nightly admin_grants drift detection

**Files:**
- Create: `src/app/api/cron/admin-grants-drift/route.ts`
- Modify: `vercel.json` (add cron entry)

- [ ] **Step 1: Drift cron handler**

  ```typescript
  // src/app/api/cron/admin-grants-drift/route.ts
  import { NextResponse } from "next/server";
  import { db } from "@/lib/db";
  import { adminGrants, users } from "@/db/drizzle-schema";
  import { eq, and } from "drizzle-orm";
  import { clerkClient } from "@clerk/nextjs/server";
  import { logAudit } from "@/lib/audit";

  export async function GET(req: Request) {
    if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const clerk = await clerkClient();
    const list = await clerk.users.getUserList({ limit: 500 });

    const drifts: { userId: string; clerk: string | null; db: string | null }[] = [];

    for (const u of list.data) {
      const clerkTier = (u.publicMetadata?.admin_tier as string | undefined) ?? null;
      const [dbRow] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, u.id))
        .limit(1);
      if (!dbRow) continue;

      const [activeGrant] = await db
        .select()
        .from(adminGrants)
        .where(and(eq(adminGrants.userId, dbRow.id), eq(adminGrants.status, "active")))
        .limit(1);
      const dbTier = activeGrant?.tier ?? null;

      if (clerkTier !== dbTier) {
        drifts.push({ userId: dbRow.id, clerk: clerkTier, db: dbTier });
      }
    }

    if (drifts.length > 0) {
      await logAudit("admin_grants_drift_detected", {
        metadata: { count: drifts.length, drifts: drifts.slice(0, 50) },
      });
    }

    return NextResponse.json({ ok: true, drifts: drifts.length });
  }
  ```

- [ ] **Step 2: Add cron entry**

  ```json
  {
    "crons": [
      { "path": "/api/cron/break-glass-synthetic", "schedule": "0 12 * * 1" },
      { "path": "/api/cron/admin-grants-drift", "schedule": "0 9 * * *" }
    ]
  }
  ```
  9:00 UTC daily.

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/api/cron/admin-grants-drift/ vercel.json
  git commit -m "feat(admin): nightly admin_grants vs Clerk drift detection cron"
  ```

---

## Post-implementation

- [ ] **Final smoke**

  Sign in as Phyrom in production, navigate every admin route, confirm:
  - `/admin` overview loads with real numbers
  - `/admin/logs` shows real audit events from your nav (no longer mock data)
  - `/admin/users` lists, paginates, filters; "Edit in Clerk" link goes to the right place
  - `/admin/pros` lists, paginates; "Manage in Verifications" link works
  - All 5 existing admin pages still load and gate correctly
  - Try setting `BREAK_GLASS_ENABLED=true`, fire the endpoint, verify cookie + audit row, then disable + rotate

- [ ] **Remove legacy cookie support**

  After Phyrom verifies the new `sherpa-admin-tier` cookie works for his session: open a small follow-up PR that removes the legacy `sherpa-is-admin` fallback in `proxy.ts`. Single-line change.

- [ ] **Update the runbook**

  In `docs/operations/platform-admin-runbook.md`:
  - Remove "Set admin cookie" section in §7 (the manual cookie hack — now obsolete)
  - Add a "Granting admin access" section linking to `docs/operations/break-glass.md` and the new server-action procedure
  - Move the "Admin role wiring" entry out of §7's "manual today" list

  Commit:
  ```bash
  git add docs/operations/platform-admin-runbook.md
  git commit -m "docs(runbook): admin portal is shipped; cookie hack obsolete"
  ```
