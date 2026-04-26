---
title: Feature Flags — LaunchDarkly + Vercel Edge Config
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire
references:
  - 02-us-west-replica-setup-runbook.md
  - 06-runbook-templates-and-12-runbooks.md
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
phase: 4A — usable from day one
---

# Feature Flags

## Goal

Decouple deploy from release. Every risky change ships behind a flag, gets canary-rolled with health checks, and has a kill-switch the on-call can flip in under 30 seconds.

## Tooling

- **LaunchDarkly** for server-side flag evaluation, targeting rules, audit history, RBAC (Role-Based Access Control), and rollout orchestration.
- **Vercel Edge Config** for low-latency edge reads — millisecond reads from Vercel's edge runtime without a network hop.

LaunchDarkly is the source of truth. A LaunchDarkly → Vercel Edge Config sync runs every 30s so the edge always has fresh flag values without paying per-request LaunchDarkly latency.

## Account setup

- [ ] LaunchDarkly Pro plan (~$8.33/seat/month + ~$10/1K monthly active client contexts).
- [ ] Three environments: `dev`, `preview`, `prod`.
- [ ] SSO via Clerk (or Google Workspace until Clerk SAML lands).
- [ ] Slack integration for `#flag-changes` notifications on every flag flip.

## Naming convention

```
{ team }-{ feature }-{ rollout-stage }
```

Examples:

- `dispatch-multi-trade-enabled-prod`
- `materials-zinc-fallback-enabled-prod`
- `auth-clerk-mfa-required-prod`
- `db-read-replica-rollout-prod`
- `app-read-only-mode-prod` (kill switch — see below)

Rules:

- Lowercase kebab-case.
- Always include the environment suffix to prevent cross-env mistakes.
- Include the team prefix so on-call knows who to escalate to.

## Vercel Edge Config integration

```typescript
// lib/flags/edge-config.ts
import { get } from "@vercel/edge-config";

export async function getFlag(key: string, fallback: boolean): Promise<boolean> {
  try {
    const value = await get<boolean>(key);
    return typeof value === "boolean" ? value : fallback;
  } catch {
    return fallback; // edge config unreachable → safe default
  }
}
```

Sync from LaunchDarkly to Vercel Edge Config:

- LaunchDarkly webhook → Vercel function `/api/webhooks/launchdarkly-sync` → updates Edge Config via `@vercel/edge-config-cli` SDK.
- Backup poller every 30s in case a webhook is missed.

## Server-side LaunchDarkly usage (when richer targeting needed)

```typescript
// lib/flags/launchdarkly.ts
import { init } from "launchdarkly-node-server-sdk";

let client: ReturnType<typeof init> | null = null;
export function getLDClient() {
  if (!client) {
    client = init(process.env.LAUNCHDARKLY_SDK_KEY!);
  }
  return client;
}

export async function evaluateFlag(
  key: string,
  context: { userId: string; tier: "client" | "pro" | "admin"; metroId?: string },
  fallback: boolean,
): Promise<boolean> {
  const ld = getLDClient();
  await ld.waitForInitialization({ timeout: 5 });
  return ld.variation(key, { kind: "user", key: context.userId, custom: context }, fallback);
}
```

## Rollout patterns

### Standard canary rollout (the default)

| Stage | Cohort | Wait time | Health check |
| --- | --- | --- | --- |
| 0% | none | n/a | flag created, code merged behind flag |
| 1% | random users | 24 hr | error rate, latency P95, conversion |
| 5% | random users | 24 hr | same |
| 25% | random users | 48 hr | same |
| 50% | random users | 48 hr | same |
| 100% | all users | n/a | full release |

Each stage requires sign-off from on-call eng before progressing. LaunchDarkly's "rollout schedules" automates this with manual gates.

### Targeted rollout (alternate)

For features that should land in specific metros first (e.g., dispatch v2 in Boston before everywhere):

```
Targeting rule: metroId in [boston-ma, portsmouth-nh] → 100%
Default: 0%
```

### Tier-based rollout

For features that ship to admins → pros → clients in that order:

```
Targeting rule: tier == "admin" → 100%
Targeting rule: tier == "pro" → 25%
Default (clients): 0%
```

## Kill-switch capability

Every risky change ships with an emergency kill flag. By convention these are named with a `-kill-switch` suffix or `app-<scope>-mode` form:

- `app-read-only-mode-prod` — flips entire app to read-only (writes return 503). Used in DB outage runbooks.
- `dispatch-disabled-kill-switch-prod` — pauses dispatch entirely (used if matching is corrupted).
- `payments-disabled-kill-switch-prod` — pauses Stripe charges (used if a payment regression hits).

Kill switches:

- Default to "off" (= app behaves normally).
- Flip to "on" via LaunchDarkly UI in < 30 seconds.
- Flip via `curl` against LaunchDarkly API as a fallback if the UI is down.
- Always emit a Sherpa Guard audit log entry on flip with the flipper's user ID.

## Per-tier flag access (RBAC)

LaunchDarkly RBAC + Clerk session context:

- **Engineers (any):** can flip dev environment flags.
- **Senior engineers:** can flip preview and prod flags.
- **On-call (rotating):** can flip kill switches in any environment.
- **Phyrom:** all permissions.
- **Read-only (designers, support):** view all flags, change none.

## Audit log entry per flag flip

LaunchDarkly's webhook fires on every flag change. Our webhook handler `/api/webhooks/launchdarkly-audit`:

1. Verifies LaunchDarkly signature.
2. Writes a Sherpa Guard audit entry: `{ event_type: "feature_flag.flipped", actor: <ld user>, flag: <key>, before: <value>, after: <value>, reason: <provided in LD> }`.
3. Cross-references the actor against Clerk users for incident review.

## Cost

- LaunchDarkly Pro: ~$200/mo for 5 seats + ~$50/mo for ~5K monthly active client contexts = ~$250/mo Phase 4A.
- Vercel Edge Config: included in Vercel Pro plan.
- **Total: ~$250/mo, scales with user count.**

## When NOT to use a flag

- **Single-line bugfixes** that have been peer-reviewed and tested. Flagging everything dilutes the signal.
- **Pure refactors** with no behavior change.
- **Static content updates** (marketing copy, etc.).

Rule of thumb: if it touches money, dispatch, auth, or audit logs, ship behind a flag. Otherwise judgment call.
