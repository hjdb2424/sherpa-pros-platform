---
title: AWS Secrets Manager Migration Plan
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - docs/operations/soc2-readiness/07-encryption-policy.md
  - docs/operations/soc2-readiness/03-access-management-policy.md
  - docs/operations/soc2-readiness/05-change-management-policy.md
  - src/lib/audit.ts
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
soc2_controls: [CC6.1, CC6.7, CC7.2, CC8.1]
---

# AWS Secrets Manager Migration Plan

## 1. Purpose

Migrate Sherpa Pros production secrets from Vercel environment variables to **AWS Secrets Manager** to satisfy SOC 2 CC6 + CC7 controls around credential governance, rotation, audit, and access control. Tier 3 / non-sensitive config remains in **Vercel Edge Config**.

## 2. Why Migrate

| Driver | Vercel env vars (today) | AWS Secrets Manager (target) |
|--------|--------------------------|------------------------------|
| Audit trail of secret access | Limited (Vercel project audit log) | Full CloudTrail event per Get/Decrypt + Sherpa Guard audit entry |
| Rotation policy enforcement | Manual | Native automated rotation via Lambda + AWS Schedule |
| Separation of secrets from deployment | Coupled (env var lives with project config) | Decoupled (secrets exist independent of deploys) |
| Multi-region replication | Vercel manages internally | Explicit replication to us-west-2 with KMS multi-region keys |
| IAM-based access control | Tied to Vercel team membership | Fine-grained IAM with explicit principals + conditions |
| Access pattern observability | None | CloudTrail + Datadog metric per secret read |
| Compliance evidence | Vendor-attested | Customer-controlled; Vanta integration |
| Break-glass procedure | Manual | KMS key policy + AWS Organizations SCP |
| Cost at scale | Free | $0.40/secret/mo + $0.05/10K API calls (~$30-$100/mo at our scale) |

## 3. Migration Phases

### Phase 1 — Inventory + classify (Q2 2026, week 1)

- [ ] Export current Vercel env vars: `vercel env pull .env.production`
- [ ] Catalog every variable into spreadsheet: `name`, `current_owner`, `consumer`, `last_rotated`, `tier_classification`
- [ ] Tag each as Tier 1 / Tier 2 / Tier 3 per Section 4
- [ ] Identify any secrets currently in source code (defensive scan): `gitleaks detect`
- [ ] Identify any secrets in `.env*` files committed to repo (must be rotated immediately if found)

### Phase 2 — Provision AWS Secrets Manager (Q2 2026, week 2)

- [ ] Create AWS account dedicated to secrets if not existing (recommend dedicated security account)
- [ ] Provision KMS multi-region key `sherpa-pros-secrets-prod-key` (us-east-1 primary, us-west-2 replica)
- [ ] Create IAM role `sherpa-pros-app-prod-role` with trust policy for Vercel OIDC (GA — see Vercel docs)
- [ ] Define IAM policy granting Get/Decrypt only on `arn:aws:secretsmanager:*:*:secret:sherpa-pros/prod/*`
- [ ] Create AWS Organizations SCP preventing secret deletion without MFA + 7-day waiting period
- [ ] Enable CloudTrail to dedicated S3 bucket with Object Lock for 7-year retention

### Phase 3 — Wire AWS SDK into Next.js (Q2 2026, week 3)

- [ ] Install `@aws-sdk/client-secrets-manager` + `@aws-sdk/credential-providers`
- [ ] Configure Vercel OIDC token exchange for AWS role assumption
- [ ] Implement `lib/secrets.ts` wrapper (see Section 5)
- [ ] Add Datadog metric emit per secret access
- [ ] Add Sherpa Guard audit log emit per secret access
- [ ] Add unit tests with mocked Secrets Manager
- [ ] Add integration test against AWS in staging

### Phase 4 — Rotate Tier 1 secrets first (Q2 2026, week 4)

Rotation order to minimize blast radius:

1. **Stripe webhook signing keys** (rotate at Stripe → store new in AWS SM → cut over)
2. **Stripe Connect API keys** (same procedure)
3. **Database connection strings** (Neon — generate new role → update SM → restart functions)
4. **Clerk API keys**
5. **Twilio Auth Token + API key**
6. **AWS access keys (legacy)** — replace with IAM role assumption entirely

Each rotation:
- [ ] Generate new secret at vendor
- [ ] Store in AWS SM under canonical name (e.g., `sherpa-pros/prod/stripe/connect-api-key`)
- [ ] Deploy app code referencing new SM path
- [ ] Verify via Datadog APM that requests succeed
- [ ] Decommission old vendor key
- [ ] Remove old Vercel env var
- [ ] Audit log entry: `secret.rotated.tier1`

### Phase 5 — Tier 3 stays in Vercel Edge Config (no action)

- [ ] Confirm Tier 3 list is feature flags, public configuration, non-sensitive constants
- [ ] Document in `lib/config.ts` which path to use for which class

### Phase 6 — Tier 2 phased migration over 30 days (Q3 2026, weeks 1-4)

Tier 2 = vendor API keys with limited blast radius (Tremendous, Zinc, Uber Direct, Datadog, etc.).

- [ ] One vendor per week minimum
- [ ] Same procedure as Tier 1 but lower risk
- [ ] Datadog cost-monitor confirms no cost spike

### Phase 7 — Decommission Vercel env vars for migrated secrets (Q3 2026, week 5)

- [ ] After 30-day soak post-migration, delete Vercel env vars for all migrated secrets
- [ ] Final inventory comparison: SM secrets list vs Vercel env list
- [ ] Vanta evidence pull of new SM-based architecture
- [ ] Sign-off from Phyrom + future SRE hire

## 4. Tier Classification Matrix

| Tier | Examples | Storage | Rotation cadence |
|------|----------|---------|------------------|
| **Tier 1 — Highly Sensitive** | Stripe Connect API keys; Stripe webhook signing keys; database connection strings; Clerk API keys; Twilio Auth Token; webhook HMAC signing keys; field-encryption KMS key references; backup encryption keys | **AWS Secrets Manager** | **90 days** |
| **Tier 2 — Vendor API Keys** | Tremendous API key; Zinc API key; Uber Direct API key; Datadog API + APP key; SendGrid/Resend API key; OpenAI / Anthropic API keys (if used) | **AWS Secrets Manager** | **180 days** |
| **Tier 3 — Non-Sensitive Config** | Feature flags; analytics IDs; public site URLs; cache TTLs; UI flag toggles; copy strings; rate-limit numerical values | **Vercel Edge Config** | **As-needed** |

## 5. Code Stub — `lib/secrets.ts`

```typescript
// lib/secrets.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import { audit } from './audit';

const SECRET_PATH_PREFIX = 'sherpa-pros/prod/';

// In-memory cache — TTL 5 min to balance audit-trail granularity vs API cost
type CacheEntry = { value: string; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1000;

const client = new SecretsManagerClient({
  region: 'us-east-1',
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: process.env.AWS_SECRETS_ROLE_ARN!,
      RoleSessionName: `sherpa-pros-${process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local'}`,
      DurationSeconds: 3600,
    },
  }),
});

export interface GetSecretOptions {
  /** Skip cache and re-fetch from AWS. Use sparingly. */
  bypassCache?: boolean;
  /** Justification recorded in audit log; required in production. */
  justification: string;
  /** Caller context for audit log. */
  ctx?: { userId?: string; role?: string };
}

export async function getSecret(secretName: string, opts: GetSecretOptions): Promise<string> {
  const fullName = `${SECRET_PATH_PREFIX}${secretName}`;

  if (!opts.bypassCache) {
    const cached = cache.get(fullName);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }
  }

  const start = Date.now();
  let success = false;
  try {
    const result = await client.send(new GetSecretValueCommand({ SecretId: fullName }));
    if (!result.SecretString) {
      throw new Error(`Secret ${fullName} has no string value`);
    }

    cache.set(fullName, { value: result.SecretString, expiresAt: Date.now() + TTL_MS });
    success = true;
    return result.SecretString;
  } finally {
    const durationMs = Date.now() - start;
    // Sherpa Guard audit log entry — every secret read in production
    if (process.env.VERCEL_ENV === 'production') {
      await audit({
        action: 'secret.read',
        actor_user_id: opts.ctx?.userId ?? 'system',
        actor_role: opts.ctx?.role ?? 'system',
        resource_type: 'secret',
        resource_id: fullName,
        metadata: {
          justification: opts.justification,
          duration_ms: durationMs,
          success,
          cache_bypass: opts.bypassCache ?? false,
        },
      });
    }
  }
}

/** Invalidate a cached secret immediately — use after rotation. */
export function invalidateSecret(secretName: string): void {
  cache.delete(`${SECRET_PATH_PREFIX}${secretName}`);
}

/** Helper for typed secret access. */
export const Secrets = {
  stripeConnectKey: () => getSecret('stripe/connect-api-key', { justification: 'stripe payment processing' }),
  stripeWebhookSigning: () => getSecret('stripe/webhook-signing-key', { justification: 'stripe webhook verification' }),
  databaseUrl: () => getSecret('neon/database-url', { justification: 'application database connection' }),
  clerkSecret: () => getSecret('clerk/api-key', { justification: 'clerk auth backend' }),
  twilioAuth: () => getSecret('twilio/auth-token', { justification: 'twilio messaging' }),
  // ... etc per Tier 1 + Tier 2 inventory
};
```

### 5.1 Caching strategy

- **5-minute in-process cache** balances audit granularity vs API cost
- Cache invalidated on rotation via `invalidateSecret()` called from rotation Lambda webhook
- Vercel function cold-start triggers cache rebuild — accepted overhead

### 5.2 Caller pattern

```typescript
// Example consumer
import { Secrets } from '@/lib/secrets';

export async function chargeStripe(amount: number, customerId: string) {
  const apiKey = await Secrets.stripeConnectKey();
  // ... use apiKey
}
```

## 6. Rotation Policy

### 6.1 Tier 1 — 90 days

- Automated rotation via AWS Lambda
- Rotation Lambda must:
  1. Generate new secret at vendor (Stripe / Clerk / Twilio API)
  2. Store new version in Secrets Manager (AWSCURRENT label moves)
  3. Notify app via webhook → `invalidateSecret()` clears cache
  4. Decommission old vendor key after 24-hour overlap window
  5. Audit log entry: `secret.rotated` with secret name + version
  6. Datadog metric: `sherpa.secret.rotated`

### 6.2 Tier 2 — 180 days

- Same automated rotation path; lower frequency

### 6.3 Manual rotation (incident)

- Triggered by `secret.compromise` audit event
- Phyrom + on-call eng required to approve
- Rotation completes within 1 hour of trigger
- Old secret marked AWSPREVIOUS for 24-hour rollback window then deleted

## 7. Access Audit

### 7.1 CloudTrail capture

- All `secretsmanager:GetSecretValue` and `kms:Decrypt` events captured
- CloudTrail logs flow to dedicated S3 bucket with Object Lock (Compliance mode, 7-year retention)
- Daily CloudTrail Lake query confirms expected access pattern (Vercel app role only)

### 7.2 Sherpa Guard audit log

- Every `getSecret()` call writes `audit_logs` entry per `src/lib/audit.ts`
- Datadog dashboard `D5: Audit Log Ingestion` slices by `action:secret.read`
- Anomaly alert: secret-read rate >2× baseline → page on-call

### 7.3 Quarterly access review

- Compliance lead reviews who/what accessed which secrets
- Anomalies: secret read by unexpected service / role / time-of-day
- Findings actioned per `03-access-management-policy.md`

## 8. Break-glass

When app-level secret access is insufficient (debugging incident):

- [ ] On-call eng raises break-glass in PagerDuty incident channel
- [ ] Phyrom approves
- [ ] Temporary IAM session granted via console (4-hour TTL)
- [ ] Console session logged to CloudTrail
- [ ] Post-incident: review what was accessed; rotate if appropriate; postmortem documents

## 9. Migration Verification Checklist

- [ ] All Tier 1 + Tier 2 secrets present in AWS Secrets Manager under `sherpa-pros/prod/*`
- [ ] All Tier 1 + Tier 2 entries removed from Vercel env vars (after 30-day soak)
- [ ] All Tier 3 entries confirmed in Vercel Edge Config
- [ ] CloudTrail logging confirmed for all secret operations
- [ ] KMS multi-region key replication healthy
- [ ] IAM role + policy minimum-privilege scoped
- [ ] Vercel OIDC trust policy verified
- [ ] App functions successfully resolve secrets in staging end-to-end
- [ ] App functions successfully resolve secrets in production
- [ ] Rotation Lambda deployed for Stripe + Clerk + Twilio + Neon
- [ ] Audit log writes flowing per secret access
- [ ] Datadog cost monitor green (no spike)
- [ ] Vanta evidence collection updated to pull from AWS Secrets Manager
- [ ] Phyrom + future SRE sign-off

## 10. Cost Estimate

| Item | Monthly |
|------|---------|
| Secrets Manager — 30 secrets × $0.40 | $12 |
| Secrets Manager API calls — ~5M reads/mo (cached) | $25 |
| KMS Decrypt — 5M | $5 |
| CloudTrail — included basic, S3 storage | $5 |
| **Total estimated** | **~$50/mo Phase 1** |
| Phase 4 estimate (100 secrets, 50M reads) | **~$300/mo** |

## 11. Maintenance

- **Owner**: SRE / Compliance lead (Phyrom interim)
- **Review cadence**: Quarterly secret inventory + quarterly access review
- **Effective date**: 2026-06-15 (Phase 1 inventory) → 2026-08-31 (full migration complete)
