---
title: Vendor Risk Register
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
  - docs/operations/soc2-readiness/03-access-management-policy.md
  - docs/operations/soc2-readiness/01-vanta-engagement-rfp.md
soc2_controls: [CC9.2, CC1.4, CC2.3]
---

# Vendor Risk Register

## 1. Purpose

This register inventories every third-party vendor with access to Sherpa Pros customer data, infrastructure, or business operations. It satisfies SOC 2 CC9.2 (vendor risk management) and serves as the source of truth that Vanta's vendor risk module syncs to.

## 2. Risk Classification

| Criticality | Definition | Review cadence |
|-------------|------------|----------------|
| **High** | Outage = platform outage; data breach = regulated PII exposure | Annual + on contract change + on incident |
| **Medium** | Degraded service or limited PII exposure | Annual |
| **Low** | Internal tooling, no customer data | Biennial |

## 3. Vendor Register (Initial 14 Vendors)

### 3.1 Vercel — Compute / Hosting

| Field | Value |
|-------|-------|
| **Service** | Edge + serverless compute, deployment platform |
| **SOC 2** | Type 2 ✓ (current report on file) |
| **Other certs** | ISO 27001, PCI DSS Level 1, HIPAA-eligible |
| **Last review** | 2026-04-25 (initial) |
| **Next review** | 2027-04-25 |
| **Data shared** | Application code, runtime logs, customer request payloads (transient), environment variables (Tier 3 only post AWS SM migration) |
| **Criticality** | **High** |
| **Security contact** | security@vercel.com |
| **Contract renewal** | Q4 2027 (annual) |
| **DPA on file** | Yes |
| **Data residency** | US (iad1, sfo1) |
| **Compensating controls** | Cloudflare WAF in front; Sherpa Guard middleware audit logging |

### 3.2 Neon — Postgres Database

| Field | Value |
|-------|-------|
| **Service** | Managed Postgres with branching + serverless scaling |
| **SOC 2** | Type 2 ✓ |
| **Other certs** | ISO 27001 |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | All customer PII, payment metadata (tokenized), audit logs, business data |
| **Criticality** | **High** |
| **Security contact** | security@neon.tech |
| **Contract renewal** | Q3 2027 |
| **DPA on file** | Yes |
| **Data residency** | US (us-east-2 primary; us-west-2 read replica Phase 4) |
| **Compensating controls** | Encryption at rest AES-256; PITR + nightly snapshots to S3; Sherpa Guard audit log captures all writes |

### 3.3 Clerk — Authentication

| Field | Value |
|-------|-------|
| **Service** | Identity provider, MFA, session mgmt, SSO |
| **SOC 2** | Type 2 ✓ |
| **Other certs** | HIPAA-eligible |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | User PII (name, email, phone), authentication logs, session tokens |
| **Criticality** | **High** |
| **Security contact** | security@clerk.com |
| **Contract renewal** | Monthly auto-renew |
| **DPA on file** | Yes |
| **Data residency** | US |
| **Compensating controls** | MFA mandatory; session timeout 12hr; suspicious sign-in alerts wired to PagerDuty |

### 3.4 Stripe Connect — Payments + Payment Protection

| Field | Value |
|-------|-------|
| **Service** | Payment processing, payment protection, payouts to pros |
| **SOC 2** | Type 2 ✓ |
| **Other certs** | PCI DSS Level 1, ISO 27001, HIPAA-eligible |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | Payment instruments (tokenized only), homeowner billing details, pro payout details (KYC/AML data) |
| **Criticality** | **High** |
| **Security contact** | security@stripe.com |
| **Contract renewal** | N/A (per-transaction pricing) |
| **DPA on file** | Yes (Stripe DPA accepted) |
| **Data residency** | US |
| **Compensating controls** | We never store raw card data — Stripe-tokenized only; webhook signatures verified; Stripe Radar fraud detection enabled; Sherpa Guard audit log captures every payment event |

### 3.5 Twilio — SMS + Voice

| Field | Value |
|-------|-------|
| **Service** | Job dispatch SMS, pro notifications, voice fallback |
| **SOC 2** | Type 2 ✓ |
| **Other certs** | ISO 27001, HIPAA-eligible (Programmable Messaging only) |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | Phone numbers, message content (job dispatch text only — no PII beyond first name) |
| **Criticality** | **High** |
| **Security contact** | security@twilio.com |
| **Contract renewal** | Pay-as-you-go |
| **DPA on file** | Yes |
| **Data residency** | US |
| **Compensating controls** | Toll-free 10DLC registered; opt-out compliance via STOP keyword; rate limiting at Sherpa Guard layer; sub-account isolation per environment |

### 3.6 Tremendous — Rewards Fulfillment

| Field | Value |
|-------|-------|
| **Service** | Pro rewards + referral payouts (gift cards, ACH, virtual cards) |
| **SOC 2** | Type 2 ✓ (verify before contract — request current report) |
| **Other certs** | PCI DSS (verify) |
| **Last review** | 2026-04-25 (pending vendor diligence) |
| **Next review** | 2027-04-25 |
| **Data shared** | Pro names, emails, payout amounts (no banking detail; Tremendous owns the rail) |
| **Criticality** | **Medium** |
| **Security contact** | security@tremendous.com (verify) |
| **Contract renewal** | TBD on engagement |
| **DPA on file** | TBD — required before first payout |
| **Data residency** | US |
| **Compensating controls** | Webhook signatures verified; per-payout cap configured; Sherpa Guard audit log entry per payout request; daily reconciliation against ledger |

### 3.7 Zinc API — Materials Ordering

| Field | Value |
|-------|-------|
| **Service** | Programmatic ordering of construction materials from retailers (Home Depot, Lowes, Amazon Business, etc.) |
| **SOC 2** | **VERIFY before contract.** If Zinc lacks SOC 2 Type 2: |
| **Compensating controls if no SOC 2** | (a) DPA mandatory; (b) limit data shared to order line items + delivery address (no payment instruments — Zinc is invoiced separately by us); (c) Sherpa Guard audit log per order; (d) elevated quarterly vendor review instead of annual; (e) annual penetration test certification request from Zinc |
| **Last review** | 2026-04-25 (pending vendor diligence) |
| **Next review** | Quarterly until SOC 2 obtained, then annual |
| **Data shared** | Delivery addresses, materials line items, order references |
| **Criticality** | **High** (operational dependency) |
| **Security contact** | TBD |
| **Contract renewal** | TBD |
| **DPA on file** | Required before first order |
| **Data residency** | US |

### 3.8 Uber Direct — Delivery

| Field | Value |
|-------|-------|
| **Service** | Last-mile delivery for tools, materials, samples |
| **SOC 2** | **VERIFY before contract.** Uber Eats / Direct part of Uber Tech which has SOC 2 Type 2 — confirm it covers Direct API |
| **Compensating controls if uncertain** | Limit PII shared to first-name + delivery address + phone (for driver coordination); webhook signature verification; Sherpa Guard audit log per delivery request |
| **Last review** | 2026-04-25 (pending vendor diligence) |
| **Next review** | 2027-04-25 |
| **Data shared** | Recipient first name, delivery address, phone (transient for driver), package descriptors |
| **Criticality** | **Medium** |
| **Security contact** | security@uber.com |
| **Contract renewal** | Per-delivery pricing |
| **DPA on file** | Required |
| **Data residency** | US |

### 3.9 Cloudflare — WAF + Edge Protection

| Field | Value |
|-------|-------|
| **Service** | Web application firewall, DDoS, bot protection (paired with Vercel BotID), DNS |
| **SOC 2** | Type 2 ✓ |
| **Other certs** | ISO 27001, PCI DSS, FedRAMP Moderate (subset) |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | All inbound HTTP traffic metadata (URLs, headers, IPs); request bodies inspected by WAF rules transiently |
| **Criticality** | **High** |
| **Security contact** | security@cloudflare.com |
| **Contract renewal** | Annual (Pro plan today; Business tier when MAU > 100K) |
| **DPA on file** | Yes |
| **Data residency** | Global edge with US POP preference |
| **Compensating controls** | TLS 1.3 end-to-end; HSTS preload; bot management rules tuned |

### 3.10 Datadog — Observability

| Field | Value |
|-------|-------|
| **Service** | APM, logs, metrics, RUM, synthetics |
| **SOC 2** | Type 2 ✓ |
| **Other certs** | ISO 27001, HIPAA-eligible, FedRAMP Moderate, PCI DSS |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | Application logs (PII scrubbing applied at agent), performance traces, user session recordings (RUM with PII masking) |
| **Criticality** | **Medium** (observability outage degrades incident response but not customer experience) |
| **Security contact** | security@datadoghq.com |
| **Contract renewal** | Annual |
| **DPA on file** | Yes |
| **Data residency** | US (datadoghq.com) |
| **Compensating controls** | PII scrubbing rules at agent + processor; sensitive data masking in RUM; access tier separation per `03-access-management-policy.md` |

### 3.11 Vanta — Compliance Automation

| Field | Value |
|-------|-------|
| **Service** | SOC 2 evidence automation, vendor risk, employee training, Trust Center |
| **SOC 2** | Type 2 ✓ |
| **Other certs** | ISO 27001 |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | Read-only API access to: Vercel, Neon, Clerk, Stripe, AWS, Cloudflare, Datadog, GitHub, Linear, PagerDuty for evidence collection |
| **Criticality** | **Medium** (downtime delays evidence collection but no customer impact) |
| **Security contact** | security@vanta.com |
| **Contract renewal** | Annual (per `01-vanta-engagement-rfp.md`) |
| **DPA on file** | Yes |
| **Data residency** | US |
| **Compensating controls** | Read-only scopes; least-privilege OAuth grants per integration |

### 3.12 Schellman — Auditor

| Field | Value |
|-------|-------|
| **Service** | SOC 2 Type 1 + Type 2 audit firm |
| **SOC 2** | N/A (auditor, not data processor) |
| **Other certs** | AICPA-licensed CPA firm; ISO accredited |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | Read-only access to Vanta evidence portal; sample data pulls during fieldwork (anonymized where possible) |
| **Criticality** | **Low** (audit-cycle vendor; no operational dependency) |
| **Security contact** | per engagement letter |
| **Contract renewal** | Per engagement (Type 1 + Type 2 contracts separate) |
| **DPA on file** | Engagement letter includes confidentiality |
| **Data residency** | US |
| **Compensating controls** | Auditor independence; access via Vanta scoped read-only |

### 3.13 Upstash — Redis

| Field | Value |
|-------|-------|
| **Service** | Edge-compatible Redis for rate limiting, session caching, idempotency keys |
| **SOC 2** | Type 2 ✓ |
| **Other certs** | ISO 27001 |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | Rate-limit counters keyed by IP/user-id (no PII); idempotency keys (opaque); transient session lookup hashes |
| **Criticality** | **High** (rate-limit outage opens platform to abuse; mitigation via Cloudflare WAF fallback) |
| **Security contact** | security@upstash.com |
| **Contract renewal** | Pay-as-you-go |
| **DPA on file** | Yes |
| **Data residency** | US (us-east-1 + us-west-2) |
| **Compensating controls** | TLS in transit; encryption at rest; no PII keys; Cloudflare WAF as redundant rate limit |

### 3.14 AWS — Secrets Manager + S3 Backup

| Field | Value |
|-------|-------|
| **Service** | Production secrets storage; nightly + weekly cross-region DB backups (S3 + Glacier) |
| **SOC 2** | Type 2 ✓ |
| **Other certs** | ISO 27001/27017/27018, PCI DSS Level 1, HIPAA-eligible, FedRAMP High |
| **Last review** | 2026-04-25 |
| **Next review** | 2027-04-25 |
| **Data shared** | All Tier 1 + Tier 2 production secrets; full DB backups (encrypted) |
| **Criticality** | **High** |
| **Security contact** | security@aws.amazon.com |
| **Contract renewal** | Pay-as-you-go (Enterprise Support Plan TBD when spend > $5K/mo) |
| **DPA on file** | Yes (AWS DPA accepted via Service Terms) |
| **Data residency** | us-east-1 primary, us-west-2 cross-region replica |
| **Compensating controls** | KMS-encrypted secrets; IAM least privilege; CloudTrail audit log; MFA-Delete on backup buckets; lifecycle to Glacier after 90 days |

## 4. Per-Vendor Annual Review Trigger

Vanta auto-creates a review ticket 30 days before the **Next review** date for each vendor. Review checklist:

- [ ] SOC 2 Type 2 report current within last 12 months — request fresh copy
- [ ] No material adverse changes in vendor security posture (breach disclosures, board changes)
- [ ] Contract terms still aligned with our use (volume bands, geographic scope)
- [ ] Data shared still limited to documented scope
- [ ] Security contact still valid (test ping)
- [ ] DPA still aligned with current applicable laws (CCPA, evolving state laws)
- [ ] Compensating controls still operational
- [ ] Pricing renewal triggered if needed
- [ ] Termination workflow documented (off-boarding plan if vendor change required)

## 5. New Vendor Onboarding Workflow

```
[Business case] → [Security review] → [DPA negotiation] → [Pilot] → [Production cutover] → [Register entry]
```

- [ ] Business sponsor submits new-vendor proposal in Linear with use case
- [ ] Compliance lead requests SOC 2 / ISO 27001 / PCI cert as applicable
- [ ] If no SOC 2: compensating controls plan required + executive approval
- [ ] DPA negotiated and signed before production data flows
- [ ] Pilot in staging env with synthetic data
- [ ] Cutover requires Sherpa Guard audit logging integration + Datadog monitoring
- [ ] Vendor added to this register + Vanta vendor risk module

## 6. Vendor Incident Response

If a vendor reports a breach or vulnerability that affects our customer data:

- [ ] Treat as SEV1 incident — see `06-incident-response-procedures.md`
- [ ] Within 1 hour: identify scope of impact (which customers, which data)
- [ ] Within 24 hours: customer notification draft prepared if PII exposure confirmed
- [ ] Within 72 hours: customer notification sent (or sooner per state law)
- [ ] Postmortem filed in Vanta with action items and vendor relationship review
- [ ] Vendor criticality re-evaluated; may trigger replacement search

## 7. Register Maintenance

- **Owner**: Compliance lead (Phyrom until SRE hire)
- **Sync target**: Vanta vendor risk module
- **Edit cadence**: Real-time on changes; quarterly reconciliation against Vanta
- **Auditor view**: Schellman pulls register from Vanta during fieldwork
