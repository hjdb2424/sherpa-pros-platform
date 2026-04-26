---
title: Canadian Region Setup Runbook
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire + future privacy counsel
references:
  - 10-region-aware-db-routing.md
  - 12-gdpr-readiness-and-dsar-flow.md
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
phase: 4 international Year 1 (Q3 2027 — post-Wave F)
---

# Canadian Region Setup

## Goal

Open Sherpa Pros to Canadian users with data residency in Canada (PIPEDA — Personal Information Protection and Electronic Documents Act compliance), Stripe payouts to Canadian bank accounts, and a clean operational handoff so an English/French-bilingual support tier can serve them.

## Pre-flight checklist

- [ ] Privacy counsel review of PIPEDA + provincial privacy laws (Quebec Law 25 in particular is stricter than federal PIPEDA).
- [ ] Translation: privacy notice, terms, in-app strings to French (Quebec compliance — French must be at least as prominent as English).
- [ ] Stripe Canadian Connect platform application approved.
- [ ] Twilio Canadian numbers procured (10DLC equivalent in Canada).
- [ ] Resend (or SendGrid) deliverability validated in Canada.

## Provisioning steps

### 1. Database — Neon `ca-central-1` (Toronto)

- [ ] Create new Neon project `sherpa-pros-ca` in `ca-central-1`.
- [ ] Apply all migrations 001 → latest from the US schema (Drizzle-Kit with `--out` pointed at the Canadian connection string).
- [ ] Configure backup retention to 30 days (matches US).
- [ ] Enable pg_partman extension for the Canadian audit_logs partitioning.
- [ ] Store connection string in 1Password vault `Sherpa Pros / Database / Canada`.
- [ ] Set `DATABASE_URL_CA` in Vercel production env.

### 2. Vercel function regions

Vercel does not currently offer a Canadian region. Two options:

- **Option A (recommended Phase 4 Year 1):** keep functions in `iad1`. Accept ~80ms cross-border DB hop to Toronto. PII does not transit because the data stays in the Canadian DB; the function is just an executor. Verify with privacy counsel that "data in transit through US infrastructure" is acceptable under PIPEDA when the data destination is Canada (it generally is, with TLS in transit).
- **Option B (Phase 4 Year 2):** deploy a Cloudflare Worker (which has Canadian PoPs — Points of Presence) as a frontend / proxy if PIPEDA scope tightens around in-transit data.

Decision recorded in ADR `docs/operations/multi-region-rollout/03-citus-vs-pgpartman-adr.md` style; revisit annually.

### 3. Auth — Clerk

- [ ] Single Clerk organization (no separate Canadian Clerk instance). Region tagged via Clerk public metadata `region: "ca"`.
- [ ] Clerk handles its own data residency for auth artifacts; verify Clerk's PIPEDA compliance posture in their trust documentation.
- [ ] Onboarding flow detects Canadian phone or IP and sets `region: "ca"` in metadata; user can override.

### 4. Payments — Stripe Connect Canadian platform

- [ ] Apply for a separate Stripe Connect platform for Canada (Stripe requires this for CAD payouts).
- [ ] Submit business verification (Hunter James Designs LLC or new Canadian entity if required by Stripe — confirm with counsel; some platforms require a Canadian operating entity).
- [ ] Configure CAD as base currency for Canadian Connect accounts.
- [ ] Test deposit + payout flow on Stripe test mode end-to-end.
- [ ] Update commission engine to handle CAD with Canadian sales tax (GST/HST/QST as applicable).

### 5. Migration of any pre-launch Canadian users

If we have any Canadian users on the US instance pre-launch (e.g., test accounts):

- [ ] Email them disclosing the move 14 days in advance.
- [ ] Off-hours batch migrate their records to Canadian Neon (per the migration process in `10-region-aware-db-routing.md`).
- [ ] Deactivate US-side records (kept for audit retention only).
- [ ] Confirm in writing once migration complete.

### 6. Telemetry + monitoring

- [ ] Datadog tag `region:ca` on all Canadian metrics.
- [ ] Separate PagerDuty escalation for Canadian-impacting incidents (same on-call team Phase 4A, separated when team grows).
- [ ] Statuspage component for Canadian region.

### 7. Twilio + Resend for Canadian users

- [ ] Twilio Canadian long codes or short codes registered (Canadian Anti-Spam Legislation, CASL, applies to SMS marketing — transactional is fine).
- [ ] Resend domain verification for canadian-region email.
- [ ] Update opt-in flow to comply with CASL (express consent required for marketing email; transactional is implied consent).

### 8. Customer support

- [ ] Bilingual (English + Quebec French) support staff or contractor.
- [ ] French-language help center content for top 20 articles.
- [ ] Support hours covering Eastern + Pacific Canadian time zones.

## Smoke test plan

Before public launch in Canada:

- [ ] Sign up a Canadian test user → verify region metadata set to `ca`.
- [ ] Post a job from the test user → verify written to Canadian Neon (check pg_stat_activity).
- [ ] Stripe test payment → verify it routes to Canadian Connect platform.
- [ ] Twilio test SMS → verify sent from Canadian number.
- [ ] Audit log entry on every event → verify written to Canadian audit_logs.
- [ ] Privacy notice + terms display in French when locale is `fr-CA`.

## Cost impact (estimated)

| Item | Monthly cost (USD) |
| --- | --- |
| Neon Canadian primary | ~$120 (smaller initial size) |
| Stripe Connect Canadian platform | $0 base + per-transaction fees |
| Twilio Canadian numbers | ~$20 |
| Resend Canadian domain | included |
| Translation (one-time) | ~$5,000 one-time, then ~$500/mo for ongoing copy |
| Bilingual support contractor | ~$3,000/mo |
| **Total ongoing** | **~$3,640/mo** |

## Rollout sequencing

- [ ] **Week -8:** legal + privacy counsel engagement, translations begin.
- [ ] **Week -6:** Stripe Connect application submitted.
- [ ] **Week -4:** Neon Canada provisioned, schema migrated.
- [ ] **Week -2:** smoke tests on staging + production.
- [ ] **Week 0:** soft launch with 10 invited Canadian users.
- [ ] **Week +4:** open marketing in 1 metro (Toronto).
- [ ] **Week +12:** open all major Canadian metros (Toronto, Vancouver, Montreal, Calgary, Ottawa).

## Rollback

If something goes wrong:

- [ ] Disable Canadian sign-ups via LaunchDarkly flag `signups-canada-enabled-prod`.
- [ ] Existing Canadian users continue to function on Canadian Neon.
- [ ] Investigate, fix, retry.

## Open questions

- Does Hunter James Designs LLC need a Canadian subsidiary or business registration for Stripe + tax purposes? Counsel decision required.
- Quebec Law 25 — confirm we meet "Privacy Officer" requirement (a designated individual, named publicly, reachable). Phyrom or appointed delegate.
- Cross-border emergency dispatch (Canadian client, US pro near border) — out of scope for Phase 4 Year 1.
