---
title: GDPR Readiness + Data Subject Access Request (DSAR) Flow
date: 2026-04-25
status: draft
owner: Phyrom + future privacy counsel + future Data Protection Officer (DPO) if required
references:
  - 10-region-aware-db-routing.md
  - 13-cookie-consent-implementation.md
  - docs/operations/soc2-readiness/
phase: 4 international (EU launch Q4 2027)
---

# GDPR Readiness + DSAR Flow

## Goal

Be ready for EU launch Q4 2027 with full GDPR (General Data Protection Regulation) compliance: lawful bases identified per data category, privacy notice updated, Data Protection Impact Assessment (DPIA) completed where required, breach-notification process tested, and Data Subject Access Request (DSAR) flow functional within the 30-day legal deadline.

## GDPR readiness checklist

- [ ] **Lawful basis identified per data category** (matrix below).
- [ ] **Privacy notice updated** with EU-specific sections (right to erasure, right to portability, right to restrict processing, right to object, right not to be subject to automated decision-making, contact details for the EU representative and the supervisory authority).
- [ ] **DPIA completed** for high-risk processing activities (dispatch algorithm involving location data, payment processing involving financial data, materials orders involving address data).
- [ ] **DPO appointed** if required. Required if: large-scale processing of special-category data (we don't); systematic monitoring of data subjects on a large scale (we plausibly do — dispatch tracking). Decision: appoint a DPO before EU launch as a precaution.
- [ ] **EU representative appointed** under Article 27 since we have no EU establishment but offer services to EU residents. Engage a service like EDPO (European Data Protection Office) — ~€500/mo.
- [ ] **Records of processing activities (RoPA)** maintained per Article 30. Living document tracking every data flow.
- [ ] **Data Processing Agreements (DPAs)** signed with every sub-processor (Vercel, Neon, Clerk, Stripe, Twilio, Resend, Datadog, Sentry, PagerDuty, LaunchDarkly, etc.).
- [ ] **Breach notification process** within 72 hours to the supervisory authority — see `07-incident-response-procedures.md`.
- [ ] **Standard Contractual Clauses (SCCs)** in place for any data transfers to the US (Vercel, Neon US, etc.). Plus Data Privacy Framework (DPF) certification status check for US sub-processors.
- [ ] **Cookie consent banner** deployed — see `13-cookie-consent-implementation.md`.

## Lawful basis matrix

| Data category | Lawful basis | Notes |
| --- | --- | --- |
| **Account data** (name, email, password hash, role) | Article 6(1)(b) — performance of a contract | Required to provide the service |
| **Payment data** (Stripe customer + Connect account, payment intents, payouts) | 6(1)(b) contract + 6(1)(c) legal obligation | Tax records, anti-money-laundering retention |
| **Communications data** (in-app chat, SMS via Twilio, email via Resend) | 6(1)(b) contract + 6(1)(f) legitimate interest (operational record-keeping) | Retention 18 months hot then archival |
| **Location data** (pro current location for dispatch, job address) | 6(1)(b) contract — necessary for dispatch | Granular only while a job is active; coarser at rest |
| **Audit logs** (Sherpa Guard) | 6(1)(c) legal obligation + 6(1)(f) legitimate interest (security, fraud prevention) | 7-year retention overrides erasure |
| **Analytics data** (anonymized aggregates) | 6(1)(f) legitimate interest with opt-out | Pseudonymized at source; users can opt out |
| **Marketing data** (newsletter, promotional emails) | 6(1)(a) consent | Express opt-in required; easy unsubscribe |
| **Cookies — strictly necessary** | not-applicable (exempt under ePrivacy Directive) | Session, auth, security cookies |
| **Cookies — analytics + marketing** | 6(1)(a) consent (ePrivacy + GDPR) | Banner-gated |

This matrix is the source of truth and gets updated whenever a new data flow is added. RoPA references it.

## DPIA — when required

DPIAs are mandatory under Article 35 for "high risk" processing. Our triggers:

- **Dispatch algorithm + pro location tracking** — DPIA required (systematic monitoring).
- **Payment processing including financial profiles** — DPIA required (large-scale processing of financial data).
- **Materials orchestration involving residential addresses** — DPIA recommended.
- **Audit logs / Sherpa Guard** — DPIA recommended (large-scale).

DPIA template lives in `docs/operations/multi-region-rollout/dpia-template.md` (to be drafted with privacy counsel). Each DPIA: describe processing, assess necessity + proportionality, identify risks to data subjects, mitigations, residual risk acceptance.

## DSAR (Data Subject Access Request) flow

Under Article 15, EU users have the right to know what personal data we hold about them, why, who we share it with, and for how long. Response within 30 days (extendable to 90 with notice).

### Intake

- [ ] Dedicated email `privacy@sherpapros.com` (or `dsar@`) routed to a DSAR queue.
- [ ] In-app DSAR request form (Phase 4 Year 2) — `Settings → Privacy → Request my data`.
- [ ] Acknowledge within 5 business days.

### Identity verification

- [ ] Verify the requester is the data subject (not a stranger asking for someone else's data).
- [ ] Method: account login + email confirmation. For accounts that are deleted or compromised, fall back to a government ID check via a vendor like Persona.

### Data scope determination

- [ ] Request clarifies what data they want (full export vs. specific category).
- [ ] Default: full export of account data, payment history (transaction-level, not card details), communications, audit log entries about them, analytics events tied to their pseudonymous ID.
- [ ] Excluded: data about other users (their pro/client counterparties — redact or summarize).
- [ ] Excluded: derived/internal data not constituting personal data (rankings, scores) unless they specifically request it.

### Export generation

- [ ] Automated job hits the regional DB (per `10-region-aware-db-routing.md`) and Sherpa Guard audit log.
- [ ] Output format: machine-readable JSON + human-readable PDF summary.
- [ ] Includes: lawful basis used per data category, retention period, sub-processors with access.

### Review for third-party data

- [ ] Reviewer redacts other users' PII (names, contact info) from communications, replacing with role-based labels ("Pro #1", "Client #2").
- [ ] Reviewer flags anything unusual (e.g., a chat thread that involves 3+ parties may need additional consent to share).

### Delivery

- [ ] Encrypted ZIP (password sent via separate channel).
- [ ] Within 30 days.
- [ ] Sherpa Guard audit log entry: `dsar.fulfilled` with requester ID + delivery date.

### Right to erasure (Article 17)

When a user invokes "right to be forgotten":

- [ ] Verify identity as above.
- [ ] Determine erasure scope:
  - **Erase:** account record, profile, preferences, marketing data.
  - **Anonymize:** historical transactions (replace user ID with pseudonym; retain for audit/tax).
  - **Retain (legal hold):** audit log entries (7 years), tax-relevant transaction records (per IRS / HMRC / CRA / EU national rules), anything under active investigation.
- [ ] Communicate to user what was erased and what was retained, with legal basis for retention.
- [ ] Sherpa Guard audit log entry: `user.erased` with scope.

### Right to portability (Article 20)

- [ ] Same as DSAR but in a structured, commonly used, machine-readable format (JSON).
- [ ] Direct transmission to another controller "where technically feasible" — out of scope for Phase 4 Year 1; offer JSON export only.

### Right to restrict + object

- [ ] User can request we stop certain processing (e.g., marketing) immediately.
- [ ] Implementation: feature flags on the user's account that gate the relevant processing.

## Sub-processor management

Maintain a public list at `sherpapros.com/legal/subprocessors`:

- Vercel (US, hosting)
- Neon (US + EU + CA, database)
- Clerk (US, authentication)
- Stripe (US + EU + CA + UK + AU regional, payments)
- Twilio (US, communications)
- Resend (US, transactional email)
- Datadog (US, observability)
- Sentry (US, error tracking)
- PagerDuty (US, on-call)
- LaunchDarkly (US, feature flags)

Notify customers of new sub-processors with at least 30 days notice (typical contractual term).

## Cost

| Item | Monthly cost |
| --- | --- |
| EU representative service (e.g., EDPO) | ~€500 ($550) |
| DPO (fractional, contracted) | ~$2,000 |
| Privacy counsel retainer | ~$3,000 |
| DSAR tooling (custom + small vendor) | ~$300 |
| **Total** | **~$5,850/mo Phase 4 international** |

Plus one-time DPIA + RoPA setup: ~$15,000.

## Open questions

- Which EU member state for our lead supervisory authority? Driven by where the EU representative is established. Likely Ireland or Netherlands.
- UK GDPR (post-Brexit mirror) — same controls, separate ICO supervisory authority. Ensure the UK launch (2028) carries this scope.
- LGPD (Brazil) and similar non-EU laws — handled in a future doc when we expand beyond locked rollout regions.
