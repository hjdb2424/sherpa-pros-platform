---
title: Quarterly Game Day Playbook
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire
references:
  - 06-runbook-templates-and-12-runbooks.md
  - 07-incident-response-procedures.md
phase: 4B+ (start once SRE is on the team and runbooks are written)
---

# Quarterly Game Day Playbook

## Goal

Test runbooks, validate alerts, exercise on-call muscle memory, and find weaknesses before production does. Cadence: **once per quarter**, every quarter, no exceptions.

## Format

- **Window:** 2 hours, scheduled with at least 2 weeks notice.
- **Time of day:** Tuesday 10am Eastern (lowest weekly traffic, full team available).
- **Blast radius:** controlled. Always staging-first; production-only when explicitly pre-approved by Phyrom + IC.
- **Observability:** Datadog + Sentry + Statuspage open on the war-room dashboard throughout.
- **Roles:**
  - Game Day commander (rotates) — runs the scenario, has the kill switch.
  - On-call engineer (whoever is normally on-call that week) — responds as if real.
  - Scribe — records everything for the postmortem.
  - Observers — entire eng team can watch but cannot intervene unless the commander asks.

## Pre-flight checklist

- [ ] Scenario chosen and shared 1 week prior (no surprise to the team — surprise is dangerous; the test is response, not awareness).
- [ ] Statuspage maintenance window posted: "Internal exercise; no customer impact expected."
- [ ] Backup plan if the exercise breaks something real: how to revert.
- [ ] Postmortem doc created in advance, ready to fill in.
- [ ] Customer support team notified so they don't escalate test-generated alerts.

## Scenario library

Rotate through scenarios so we cover all SEV1/SEV2 runbooks at least once per year.

### Scenario 1 — Primary database failover

**Objective:** validate Runbook 02 (database unreachable) end-to-end on staging.
**Method:** kill the Neon staging primary via console; force failover to a standby.
**Expected response:** on-call detects within 5 min, follows runbook, app degrades to read-only via kill switch, recovery in < 30 min.
**Success criteria:** runbook executable as written, kill switch works, no manual code changes required.

### Scenario 2 — Vercel region outage simulation

**Objective:** validate the platform handles a Vercel region (e.g., `iad1`) going dark.
**Method:** disable `iad1` deployment via Vercel API on a staging deployment; observe traffic shift.
**Expected response:** Vercel routes to next region; replica-aware Drizzle picks up the local replica; latency spike but no outage.
**Success criteria:** P95 latency stays under 1s, error rate stays under 0.5%, no manual intervention required for traffic shift.

### Scenario 3 — DDoS attack simulation

**Objective:** test rate limiting + WAF + alert response.
**Method:** load-test from approved tool (k6 or Artillery) at 100x normal traffic against a staging endpoint.
**Expected response:** rate limiter kicks in, WAF blocks at the edge, alerts fire to on-call.
**Success criteria:** legitimate-looking traffic still served (we don't accidentally block ourselves), WAF rules effective, on-call alerted.

### Scenario 4 — Third-party vendor outage (Stripe / Clerk / Twilio)

**Objective:** validate vendor-down runbooks.
**Method:** in staging, swap the vendor base URL to an invalid endpoint to simulate outage.
**Expected response:** application detects, surfaces user-friendly error, queues retries where appropriate, alerts on-call.
**Success criteria:** runbook (03 / 06 / 09) works, no cascade failures.

### Scenario 5 — Data corruption restore drill

**Objective:** verify backup + restore actually works.
**Method:** corrupt a non-critical table on staging (e.g., insert garbage rows); restore from snapshot; verify.
**Expected response:** identify corruption window, halt writes, restore from snapshot, replay subsequent writes from audit log.
**Success criteria:** restore completes within 4 hours (RTO target), zero data loss beyond 15-min RPO target.

### Scenario 6 — Audit log loss recovery

**Objective:** validate Runbook 05 (audit log write failure).
**Method:** disable audit log writes on staging; generate traffic; re-enable; replay.
**Expected response:** writes detected as failed within 1 minute, alerts fire, replay queue catches up.
**Success criteria:** zero audit events permanently lost; replay within 24 hr.

### Scenario 7 — Materials supply chain disruption (Zinc API offline)

**Objective:** validate Runbook 07.
**Method:** swap Zinc API URL to invalid endpoint on staging.
**Expected response:** materials orders fail gracefully, fallback flag enables manual ordering, on-call alerted.
**Success criteria:** no orders silently dropped, customer-facing UI shows accurate state.

### Scenario 8 — On-call escalation drill

**Objective:** validate PagerDuty escalation policies.
**Method:** trigger a synthetic SEV1 alert; primary on-call deliberately does not acknowledge; observe escalation to L2 then L3.
**Expected response:** L2 paged at 5 min, L3 paged at 10 min, all escalation paths reachable.
**Success criteria:** every escalation tier responds within SLA; no missing contact info.

## Postmortem (same day)

Filled in during a 30-minute debrief immediately after the exercise:

- What went well?
- Where did the runbook diverge from reality?
- What action items came out of this? (each with owner + due date)
- What scenario do we want to run next quarter?

Action items go straight into Jira with the `game-day` label. Tracked to completion in the next ops review.

## Annual cadence

| Quarter | Scenario theme |
| --- | --- |
| Q1 | Database / data integrity (scenarios 1, 5, 6) |
| Q2 | Network / infrastructure (scenarios 2, 3) |
| Q3 | Third-party vendors (scenarios 4, 7) |
| Q4 | People / process (scenario 8 + a tabletop SEV1 with outside counsel) |

Adjust freely based on what failed in production over the year.

## Out-of-scope (Phase 4A explicitly)

- Live production chaos engineering (e.g., unannounced Chaos Monkey-style failures). Premature for our scale; revisit in Phase 5 once the platform is multi-region-stable and the team is 10+ engineers.
- Adversarial security red-team exercises. These belong with the SOC 2 Type II audit and require external pen-test firms.
