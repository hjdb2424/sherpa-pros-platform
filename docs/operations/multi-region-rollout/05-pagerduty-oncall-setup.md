---
title: PagerDuty On-Call Setup
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire (Phase 3)
references:
  - 06-runbook-templates-and-12-runbooks.md
  - 07-incident-response-procedures.md
  - docs/superpowers/plans/2026-04-25-platform-scale-architecture-plan.md (WS5 hiring)
phase: 4A baseline; 4B fully staffed
---

# PagerDuty On-Call Setup

## Goal

Stand up a 24/7 on-call rotation across the Sherpa Pros engineering team using PagerDuty so customer-facing incidents are acknowledged within 5 minutes and mitigated within the SLOs (Service Level Objectives) defined in the platform-scale spec.

## Account setup

- [ ] PagerDuty Business plan (~$41/user/month, supports 5+ engineers, advanced rotations).
- [ ] SSO via Clerk → PagerDuty (Phase 4A: manual user provisioning is fine; Phase 4B: SCIM sync).
- [ ] Configure global notification rules: SEV1 = phone call + push + SMS, SEV2 = push + SMS, SEV3 = push only, SEV4 = email digest.

## Services (one per system in scope)

Create the following PagerDuty services. Each service has its own escalation policy and integrates with the relevant alerting source.

| Service | Source(s) | Initial severity ceiling |
| --- | --- | --- |
| `web-mobile-app` | Datadog RUM, Sentry, Vercel logs | SEV1 |
| `payments-stripe` | Stripe webhooks, Datadog APM, Sherpa Guard audit failures | SEV1 |
| `dispatch-wiseman` | Datadog APM, latency synthetics | SEV2 |
| `materials-orchestration` | Zinc API health, Uber Direct webhooks, Datadog | SEV2 |
| `auth-clerk` | Clerk status webhooks, Datadog synthetics | SEV1 |
| `database` | Neon status, replication lag monitor, pg_stat alerts | SEV1 |
| `integrations-twilio-resend` | Twilio status, Resend webhooks, delivery failure alerts | SEV3 |
| `infra-vercel` | Vercel status, deployment failure webhooks | SEV2 |
| `audit-logs-sherpa-guard` | Datadog log monitor (write failures), compliance dashboards | SEV2 |

## Escalation policies

**Default 3-level escalation** for all services unless noted:

- **Level 1 (acknowledge within 5 min):** primary on-call engineer
- **Level 2 (acknowledge within 10 min):** secondary on-call engineer + Phyrom (founder)
- **Level 3 (acknowledge within 20 min):** entire eng team + Phyrom + outside legal counsel (for security/compliance/breach incidents only)

**Exceptions:**

- `payments-stripe` — Level 2 includes finance lead in addition to secondary engineer.
- `audit-logs-sherpa-guard` — Level 2 always includes Phyrom (compliance impact).
- `database` — Level 2 includes the SRE hire (Phase 3) by default.

## Schedule

- **Phase 4A baseline (3 engineers + Phyrom):** weekly rotations, Monday 9am Eastern handoff. Phyrom is permanent backup but not primary.
- **Phase 4B (5+ engineers post-hires):** weekly primary + weekly secondary, no engineer on-call more than 1 week in 5.
- **Holiday coverage:** swap 30 days in advance via PagerDuty's "schedule overrides".
- **Vacation:** mandatory swap 14 days in advance.

Recommended configuration in PagerDuty:

```
Schedule: "Sherpa Pros Primary"
  Layer 1: weekly rotation Mon 9am ET handoff
  Restrictions: none (24/7)

Schedule: "Sherpa Pros Secondary"
  Layer 1: weekly rotation Mon 9am ET handoff (offset by 1 week from primary)
  Restrictions: none (24/7)

Schedule: "Sherpa Pros Founder Backup"
  Layer 1: Phyrom always on, used only at Level 2+
```

## Alert routing

- **Datadog → PagerDuty:** install Datadog PagerDuty integration. Each Datadog monitor specifies a `@pagerduty-<service-key>` tag in its message to route to the right service.
- **Sentry → PagerDuty:** Sentry alert rules with conditional severity (errors > 50/min → SEV2, errors > 500/min → SEV1).
- **Stripe webhooks → PagerDuty:** custom Vercel function `/api/webhooks/stripe-incidents` that translates Stripe `payment_intent.payment_failed` spike into a PagerDuty event via the Events API.
- **Vercel deployment failures → PagerDuty:** Vercel webhook → small Vercel function that filters production-only failures and emits PagerDuty events.
- **Clerk status → PagerDuty:** Clerk's status page webhooks routed via Statuspage.io integration.

## Runbook linking (mandatory)

Every alert message **must** include a runbook URL. Format:

```
[SEV2] Dispatch latency P95 > 1s
Service: dispatch-wiseman
Runbook: https://github.com/hjdb2424/sherpa-pros-platform/blob/main/docs/operations/multi-region-rollout/06-runbook-templates-and-12-runbooks.md#runbook-04-dispatch-latency
```

Without a runbook URL, the on-call engineer has no playbook → MTTM (Mean Time To Mitigate) blows up. Strict policy: **alert without runbook → close the alert and write the runbook before re-enabling.**

## Post-incident review cadence

- **SEV1:** postmortem within 48 hours, blameless 5-whys format. Owner: incident commander.
- **SEV2:** postmortem within 1 week.
- **SEV3:** monthly summary of all SEV3s in eng all-hands.
- **SEV4:** no postmortem; tracked in weekly metrics review.

Postmortem template lives in `07-incident-response-procedures.md`.

## Cost

- PagerDuty Business: $41/user/month × 5 users = ~$205/mo Phase 4A.
- Statuspage.io (for customer-facing status): $79/mo.
- **Total Phase 4A: ~$285/mo.**
