---
title: Encryption Policy
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - docs/operations/soc2-readiness/04-vendor-risk-register.md
  - docs/operations/soc2-readiness/12-aws-secrets-manager-migration.md
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
soc2_controls: [CC6.1, CC6.7, CC6.8, C1.1, C1.2]
---

# Encryption Policy

## 1. Purpose

Defines required encryption standards for Sherpa Pros data in transit and at rest, key management practices, data classification, and per-tier handling rules. Satisfies SOC 2 CC6.1 / CC6.7 / CC6.8 (logical access + transmission integrity) and Confidentiality criteria C1.1 / C1.2.

## 2. Scope

Applies to all systems storing or transmitting Sherpa Pros data including production app, Neon Postgres, Vercel Edge Config, AWS Secrets Manager, S3 backups, customer mobile sessions, vendor APIs, and employee endpoints.

## 3. Encryption in Transit

### 3.1 Required protocols

| Layer | Standard | Notes |
|-------|----------|-------|
| Public HTTPS (browser ↔ Vercel) | **TLS 1.3 minimum**; TLS 1.2 fallback only with FS ciphers | TLS 1.0 / 1.1 disabled at Cloudflare edge |
| API requests (server ↔ Stripe / Twilio / Tremendous / Zinc / Uber Direct) | TLS 1.2 minimum, TLS 1.3 preferred | Vendor SDKs enforce |
| Internal service traffic (Vercel function ↔ Neon) | TLS 1.3 with cert pinning where SDK supports | Neon enforces TLS |
| Vercel function ↔ AWS Secrets Manager | TLS 1.3 + SigV4 signed requests | AWS SDK default |
| Vercel function ↔ Upstash Redis | TLS 1.3 | Upstash enforces |
| Webhooks inbound (Stripe / Twilio / etc.) | TLS 1.2 minimum + signature verification | All webhook endpoints verify HMAC signature |
| SSH (operations) | OpenSSH with Ed25519 keys; no password auth | YubiKey-backed where supported |

### 3.2 HSTS + cert management

- **HSTS** preload list submission for `thesherpapros.com` and all subdomains
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- **Cert rotation** automated via Vercel-managed Let's Encrypt certs (90-day rotation)
- **Cert transparency** monitoring via Cloudflare CT log alerts (detects unauthorized cert issuance)
- **Certificate pinning** in mobile apps (when launched) for critical APIs only — with backup pin

### 3.3 Cipher suite policy

- **Allowed**: AEAD ciphers only (AES-GCM, ChaCha20-Poly1305)
- **Forbidden**: RC4, 3DES, MD5, SHA-1, CBC-mode without AEAD
- Verified quarterly via SSL Labs scan; target grade A+

## 4. Encryption at Rest

### 4.1 Storage layer matrix

| System | Algorithm | Key management | Notes |
|--------|-----------|----------------|-------|
| **Neon Postgres** | AES-256 (default Neon) | Neon-managed (KMS-backed) | All tables incl. `audit_logs`, `users`, payment metadata |
| **AWS S3 (DB backups)** | AES-256 SSE-KMS | Customer-managed KMS key | Lifecycle: Standard → IA → Glacier → Deep Archive over 90 days; Object Lock for audit-log archive (7 years) |
| **AWS Secrets Manager** | AES-256 SSE-KMS | Customer-managed KMS key | Per `12-aws-secrets-manager-migration.md` |
| **Vercel Edge Config** | AES-256 (Vercel-managed) | Vercel-managed | Tier 3 only — no Tier 1 secrets |
| **Vercel Build Artifacts** | AES-256 | Vercel-managed | No secrets in build output (enforced by env-var separation) |
| **Cloudflare KV** (if adopted for Phase 4) | AES-256 | Cloudflare-managed | No PII keys |
| **Upstash Redis** | AES-256 | Upstash-managed | No PII keys; rate-limit counters + idempotency only |
| **Datadog log storage** | AES-256 | Datadog-managed | PII scrubbing applied at agent + processor before storage |
| **Local employee endpoints** | FileVault (macOS) / BitLocker (Windows) | OS-managed + MDM escrow | MDM-enforced |

### 4.2 Field-level encryption (Phase 4 enhancement)

Sensitive PII fields encrypted at application layer before DB write, in addition to Neon at-rest encryption:

- Stripe Connect external account numbers (we tokenize today; field encryption adds defense-in-depth)
- Background check results (when added)
- Insurance certificate documents (encrypted blob stored in S3 with KMS key reference in DB)

Implementation pattern:

```typescript
// lib/encryption/field.ts (Phase 4 stub)
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

const kms = new KMSClient({ region: 'us-east-1' });

export async function encryptField(plaintext: string, context: Record<string, string>): Promise<string> {
  const result = await kms.send(new EncryptCommand({
    KeyId: process.env.FIELD_ENCRYPTION_KMS_KEY_ID!,
    Plaintext: Buffer.from(plaintext, 'utf-8'),
    EncryptionContext: context, // bind ciphertext to row context (e.g., user_id)
  }));
  return Buffer.from(result.CiphertextBlob!).toString('base64');
}

export async function decryptField(ciphertext: string, context: Record<string, string>): Promise<string> {
  const result = await kms.send(new DecryptCommand({
    CiphertextBlob: Buffer.from(ciphertext, 'base64'),
    EncryptionContext: context,
  }));
  return Buffer.from(result.Plaintext!).toString('utf-8');
}
```

Every encrypt/decrypt operation emits a Sherpa Guard audit log entry: `field_crypto.encrypt` / `field_crypto.decrypt` with row context.

## 5. Key Management

### 5.1 Key custody matrix

| Key class | Custodian | Rotation | Backup |
|-----------|-----------|----------|--------|
| Neon DB encryption keys | Neon | Per Neon policy | Neon-managed |
| AWS KMS keys (secrets, backups, field encryption) | AWS + Sherpa Pros account | Annual automated rotation | KMS multi-region keys to us-west-2 |
| Vercel-managed app secrets (Tier 3) | Vercel | On secret rotation | Re-create via Vercel API |
| TLS certificates | Vercel | 90 days (LE auto) | LE auto |
| GitHub commit signing keys (Ed25519) | Each developer in YubiKey | Per personnel turnover | Pubkeys recorded in GitHub; private never escrowed |
| Webhook HMAC signing keys (Stripe, Twilio, custom) | AWS Secrets Manager | 180 days | Cross-region replicated |
| Customer-managed encryption keys (CMEK option, Phase 4 enterprise tier) | Customer's AWS / GCP KMS | Customer-controlled | Customer-controlled |

### 5.2 Key access controls

- KMS key policies follow least-privilege; explicit allow-list per key
- Key rotation events logged to CloudTrail + Sherpa Guard audit log
- Key deletion guarded by KMS scheduled-deletion (7-day waiting period minimum)
- Break-glass key access requires Phyrom + senior eng dual approval (Phase 4 with AWS Organizations SCP)

### 5.3 CMEK (customer-managed encryption key) for enterprise tier

Phase 4 enterprise tier offering for national PMs / REITs with internal compliance requirements:

- Customer provisions KMS key in their AWS account
- Cross-account IAM trust permits Sherpa Pros app role to encrypt/decrypt for that customer's data
- Customer can revoke at any time → triggers customer offboarding workflow
- Documented in customer-specific MSA + DPA addendum

## 6. Data Classification

| Tier | Definition | Examples | Handling |
|------|------------|----------|----------|
| **Tier 1 — Highly Sensitive** | PII, payment data, audit logs, secrets | Homeowner full names + emails + phones + addresses; pro KYC docs; Stripe Connect tokens; audit_logs entries; employee credentials; webhook signing keys | Encrypted at rest + transit; access requires Sherpa Guard role check; access audit logged; backup retention 7 years; field-level encryption added Phase 4 for highest sensitivity |
| **Tier 2 — Business Operational** | Non-PII business data; trade catalog; pricing; dispatch metadata | Job titles, trade categories, sherpa scores (anonymized); pricing tables; dispatch routing rules | Encrypted at rest + transit; access via Sherpa Guard role check; backup retention 1 year |
| **Tier 3 — Public / Anonymized** | Marketing content; aggregated analytics; public Trust Center content | Landing page content; anonymized funnel metrics; public security page text | Encrypted in transit; at-rest encryption applied uniformly via storage defaults; backup retention per business need |

### 6.1 Per-tier handling rules

#### Tier 1

- [ ] Storage: Neon (encrypted) + S3 backups (encrypted) only — never in Edge Config or Cloudflare KV
- [ ] Logging: PII fields scrubbed before Datadog ingestion
- [ ] Display in UI: masked by default (e.g., last-4 of phone); full reveal requires explicit user action + audit log entry
- [ ] Email transmission: only via verified transactional providers with TLS-enforced delivery
- [ ] Export: encrypted ZIP with password sent out-of-band (e.g., for legal export requests)
- [ ] Retention: per service contract + audit log policy (audit logs 7 years; user PII 90 days post-account-closure unless legal hold)
- [ ] Cross-border transfer: prohibited without explicit legal review

#### Tier 2

- [ ] Storage: Neon + Edge Config (non-secret config only)
- [ ] Logging: full logging permitted
- [ ] Display in UI: standard
- [ ] Retention: 1-year default, longer per business need
- [ ] Cross-border transfer: permitted within US

#### Tier 3

- [ ] Storage: any
- [ ] Logging: full
- [ ] Display in UI: any
- [ ] Retention: per business
- [ ] Cross-border transfer: permitted

## 7. PII Scrubbing Standards

### 7.1 Logging redaction (Datadog agent + processor)

```yaml
# datadog-agent processing rules (illustrative)
log_processing_rules:
  - type: mask_sequences
    name: mask_email
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    replace_placeholder: '[EMAIL]'
  - type: mask_sequences
    name: mask_phone
    pattern: '\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}'
    replace_placeholder: '[PHONE]'
  - type: mask_sequences
    name: mask_ssn
    pattern: '\d{3}-\d{2}-\d{4}'
    replace_placeholder: '[SSN]'
  - type: mask_sequences
    name: mask_credit_card
    pattern: '\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}'
    replace_placeholder: '[CARD]'
  - type: exclude_at_match
    name: exclude_stripe_secret_keys
    pattern: 'sk_(live|test)_[a-zA-Z0-9]+'
```

### 7.2 RUM session masking

- Datadog RUM configured with `defaultPrivacyLevel: 'mask-user-input'`
- Form fields with sensitive class `data-dd-privacy="mask"` always masked
- Session replay disabled on payment + KYC routes

## 8. Encryption Standards Compliance Verification

- [ ] **Quarterly**: SSL Labs scan of public endpoints (target A+); results archived in Vanta
- [ ] **Quarterly**: AWS Trusted Advisor + Security Hub review of S3 encryption, KMS rotation, IAM key age
- [ ] **Annual**: penetration test (third-party) reviews crypto implementation
- [ ] **On migration change**: re-verify TLS protocol enforcement at each layer
- [ ] **On vendor cert change**: verify replacement cert trusted + chain valid

## 9. Decryption Audit

Every Tier 1 decryption (KMS Decrypt call, Stripe customer detail retrieval, etc.) writes an entry to `audit_logs` via `src/lib/audit.ts`:

```typescript
await audit({
  action: 'data.decrypt.tier1',
  actor_user_id: ctx.userId,
  actor_role: ctx.role,
  resource_type: 'user_pii' | 'payment_token' | 'audit_log_archive',
  resource_id: targetId,
  metadata: { kms_key_id, encryption_context, justification },
});
```

Vanta + Datadog dashboards surface anomalous decryption volume.

## 10. Maintenance

- **Owner**: SRE / Compliance lead (Phyrom interim)
- **Review cadence**: Annual + on cryptography library / vendor change
- **Effective date**: 2026-06-01
