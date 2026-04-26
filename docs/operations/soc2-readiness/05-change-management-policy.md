---
title: Change Management Policy
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - src/middleware.ts (Sherpa Guard RBAC)
  - src/lib/audit.ts
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
soc2_controls: [CC8.1, CC7.1, CC6.6]
---

# Change Management Policy

## 1. Purpose

This policy defines how code, infrastructure, and configuration changes are proposed, reviewed, tested, and deployed at Sherpa Pros. It satisfies SOC 2 CC8.1 (change management) and supports CC7.1 (system monitoring during change events).

## 2. Scope

Applies to:

- Application code in `src/` (Next.js App Router, components, lib, middleware)
- Database migrations in `src/db/migrations/`
- Infrastructure as Code (when adopted — Terraform / Pulumi for AWS resources)
- Vercel project configuration (env vars, redirects, edge config)
- Sherpa Guard middleware rules and audit log schema
- Cloudflare WAF rules and rate-limit configuration
- Datadog monitor / alert configuration

Out of scope (separate policies): vendor configuration changes (handled per `04-vendor-risk-register.md`), HR / personnel changes (handled per `03-access-management-policy.md`).

## 3. Change Categories

| Category | Definition | Approval requirement | Deploy window |
|----------|------------|----------------------|---------------|
| **Standard** | Pre-approved low-risk change (docs, copy, non-functional refactor) | 1 reviewer for `src/`, 0 for `docs/` | Anytime |
| **Normal** | New feature, schema change, dependency upgrade | 1 senior eng + Phyrom for payment-related | Tue–Thu, business hours |
| **Emergency** | Hotfix for SEV1/SEV2 incident | On-call eng + Phyrom verbal/written approval | Anytime; postmortem required |
| **Major** | Multi-week initiative, breaking schema change, payment flow change | Phyrom + lead eng written approval; design doc | Tue–Wed, business hours |

## 4. Pull Request Workflow

### 4.1 Branch protection (mandatory)

- `main` is the only deployable branch
- **Direct push to `main` blocked** at GitHub branch protection level
- All changes flow through PRs from feature branches
- Required PR settings:
  - [ ] Require pull request before merging
  - [ ] Require approvals: **1 for `src/` changes**, **0 for `docs/`-only changes**
  - [ ] Dismiss stale approvals when new commits pushed
  - [ ] Require review from Code Owners (CODEOWNERS file enforces senior-eng review on payment + auth + middleware paths)
  - [ ] Require status checks to pass before merging (CI suite)
  - [ ] Require branches to be up to date before merging
  - [ ] Require conversation resolution before merging
  - [ ] Require signed commits
  - [ ] Require linear history (no merge commits — squash or rebase only)
  - [ ] Include administrators (no admin bypass)

### 4.2 PR template

```markdown
## Summary
What and why (1–3 sentences)

## Risk classification
□ Standard □ Normal □ Emergency □ Major

## Affected systems
- [ ] App code
- [ ] DB schema (migration attached)
- [ ] Middleware / Sherpa Guard rules
- [ ] Payment flow
- [ ] Auth flow
- [ ] Edge config / WAF rules

## Test plan
- [ ] Unit tests added/updated
- [ ] Integration tests cover happy path + error path
- [ ] Manual QA in preview deployment
- [ ] Smoke test runbook updated if needed

## Rollback plan
How to revert if this breaks production

## Audit log impact
Does this change emit new audit events? Update `src/lib/audit.ts` action enum.
```

### 4.3 CODEOWNERS (paths requiring senior-eng review)

```
# Senior engineer required
/src/middleware.ts                  @phyrom @senior-eng-1
/src/lib/audit.ts                   @phyrom @senior-eng-1
/src/lib/payments/**                @phyrom @senior-eng-1
/src/lib/auth/**                    @phyrom @senior-eng-1
/src/db/migrations/**               @phyrom @senior-eng-1
/src/app/api/webhooks/stripe/**     @phyrom @senior-eng-1
/src/app/api/dispatch/**            @phyrom @senior-eng-1

# Compliance lead required
/docs/operations/soc2-readiness/**  @compliance-lead

# Docs anyone
/docs/**                            (no required review)
```

## 5. Continuous Integration (must pass before merge)

```yaml
# .github/workflows/ci.yml (illustrative)
jobs:
  lint:        # eslint + prettier + tsc --noEmit
  unit-test:   # vitest unit suite (target: <2 min)
  integration: # vitest + testcontainers Postgres (target: <5 min)
  e2e-smoke:   # playwright critical path (sign-in, post-job, accept-bid)
  security:
    - npm audit --production (fail on high+)
    - snyk test
    - secret-scan (gitleaks)
    - SAST (semgrep)
  migration-dry-run:
    - apply migrations against ephemeral Neon branch; assert idempotent rollback
  build:
    - next build --turbopack
```

**Merge blocked** unless all checks pass. Override requires `internal_compliance` tier override + audit-log entry.

## 6. Code Review Standards

### 6.1 Review checklist (reviewer responsibilities)

- [ ] PR description matches code change scope
- [ ] Tests cover the change with both happy and error paths
- [ ] No secrets or API keys in source
- [ ] No new vendor without `04-vendor-risk-register.md` entry
- [ ] PII handling matches encryption policy `07-encryption-policy.md`
- [ ] Audit log emits for any state-changing action on regulated data
- [ ] Sherpa Guard role-tier check enforced where customer data crossed
- [ ] No N+1 queries introduced (Drizzle query plan reviewed for new endpoints)
- [ ] Performance budget respected (route latency target maintained)
- [ ] Accessibility (a11y) basics — label, ARIA where applicable
- [ ] Telemetry — Datadog tags + log fields appropriate

### 6.2 Senior-engineer-only review for sensitive paths

Per CODEOWNERS — payment, auth, middleware, migrations, dispatch always require named senior eng.

### 6.3 Self-review prohibited

The PR author cannot approve their own PR. Separation of duties enforced by GitHub branch protection.

## 7. Deployment

### 7.1 Deployment audit trail

Every production deploy generates two audit records:

1. **Vercel deployment log** — captures git SHA, deployer, build time, region, status
2. **Sherpa Guard audit log entry** — `src/lib/audit.ts` writes `deploy.production` event with git SHA, deployer email, PR number, timestamp

Vanta pulls both as evidence. Datadog dashboard `D5: Audit Log Ingestion` tracks deploy event rate.

### 7.2 Deploy windows (Normal changes)

| Day | Window | Notes |
|-----|--------|-------|
| Mon | 10am–4pm ET | Recovery from weekend if needed |
| Tue | 9am–5pm ET | Preferred deploy day |
| Wed | 9am–5pm ET | Preferred deploy day |
| Thu | 9am–4pm ET | Last day before weekend caution |
| Fri | **No deploys** | Friday freeze (allow Mon recovery if Thursday slips) |
| Sat | **No deploys** | Weekend freeze |
| Sun | **No deploys** | Weekend freeze |

**No deploys during active SEV1 or SEV2 incidents** (unless deploy IS the remediation).

### 7.3 Deploy procedure (Normal change)

```
1. PR merged to main → Vercel auto-builds → preview environment promoted to production after CI passes
2. Vercel deploys progressively (canary 10% traffic for 5 min) — Phase 4 enhancement
3. Datadog synthetics confirm key user journeys pass within 60s of deploy
4. Audit log entry written
5. PR author monitors error rate dashboard for 30 min post-deploy
6. Postmortem auto-created if error rate >baseline by >2σ within 30 min
```

### 7.4 Rollback procedure

```
1. Vercel "Promote to Production" on previous deployment (one click)
2. If schema migration shipped: trigger migration-rollback workflow (if rollback safe)
3. If migration not safely reversible: hotfix forward via emergency change
4. Audit log entry: deploy.rollback with reason
5. PagerDuty incident opened automatically
6. Customer-facing comms only if user-visible impact >5 min
```

### 7.5 Post-deploy smoke test runbook

Run within 10 min of every production deploy.

```
□ Datadog synthetics passing (auto)
□ Sign-in flow (homeowner + pro + pm_admin) — manual or synthetic
□ Post-job → bid received → accept bid → escrow hold (synthetic)
□ Stripe webhook receipt verified in audit log
□ Twilio dispatch SMS delivery confirmed in dispatch log
□ Sherpa Guard middleware blocks unauthorized cross-tier access (synthetic test)
□ Audit log writes flowing to audit_logs table
□ Cloudflare WAF rate-limit triggers on synthetic burst
□ Datadog APM error rate within baseline
```

## 8. Database Migrations

### 8.1 Migration rules

- All schema changes via versioned SQL files in `src/db/migrations/` (current latest: `010_dispatch_materials_orders_deliveries.sql`)
- Migrations are **forward-only by default**; rollback file required if migration touches data
- Migrations applied via CI/CD pipeline, never manually
- Migration runner uses dedicated Neon role with `CREATE`/`ALTER` permissions only on app schema
- Migration audit log entry written on success: `db.migration.applied` with file name, SHA, duration

### 8.2 Migration safety patterns (mandatory)

- Add column NULL first, backfill, set NOT NULL in subsequent migration
- Add index `CONCURRENTLY` to avoid table lock
- Drop column in two phases: stop writes, deprecate read, then drop in next deploy
- Renames done as add-new + dual-write + cutover + drop-old pattern (no in-place rename)

## 9. Feature Flags

### 9.1 Tooling

- **Vercel Edge Config** for boolean flags + low-cardinality config (existing infra)
- **LaunchDarkly** for percentage rollouts + targeting rules + scheduled flips (Phase 4 adoption)

### 9.2 Flag lifecycle

- [ ] Flag created with owner + planned removal date (max 90 days)
- [ ] Flag default = OFF (opt-in rollout)
- [ ] Rollout sequence: internal users → 1% → 10% → 50% → 100% with 24-hour bake at each step (Phase 4)
- [ ] Flag removal PR created when rollout complete; tech debt ticket if not removed within 90 days
- [ ] Audit log entry on flag flip: `feature_flag.changed`

## 10. Emergency Change Workflow

For SEV1 / SEV2 hotfixes:

```
1. On-call eng identifies hotfix
2. PagerDuty incident channel: paste hotfix PR + verbal Phyrom approval (text/Slack)
3. CI must still pass (no override unless system unavailable to test)
4. Single-reviewer rule waived only if no other eng available; double-review post-hoc
5. Deploy outside normal window allowed
6. Audit log entry: deploy.emergency with incident ID
7. Postmortem within 5 business days
```

## 11. Configuration Changes (Vercel env vars, Cloudflare WAF, etc.)

- Tracked via Linear ticket + change-record entry in Vanta
- Production-impacting config changes require same approval as Normal code change
- Cloudflare WAF rule changes deployed in **Log mode for 24 hours** before Block mode
- Datadog alert threshold changes require justification in commit / Linear

## 12. Audit Log of Changes

`src/lib/audit.ts` `action` enum extension required for any new change-class event:

```typescript
// Example additions to keep change-management evidence flowing into audit_logs
type ChangeManagementAction =
  | 'deploy.production'
  | 'deploy.rollback'
  | 'deploy.emergency'
  | 'db.migration.applied'
  | 'db.migration.rolled_back'
  | 'feature_flag.changed'
  | 'config.changed.vercel'
  | 'config.changed.cloudflare'
  | 'config.changed.datadog';
```

## 13. Policy Maintenance

- **Owner**: SRE / Compliance lead (Phyrom interim)
- **Review cadence**: Annual + after any major incident
- **Effective date**: 2026-06-01
