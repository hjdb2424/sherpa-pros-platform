---
title: Incident Response Procedures
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - src/middleware.ts (Sherpa Guard RBAC)
  - src/lib/audit.ts
  - docs/operations/soc2-readiness/05-change-management-policy.md
  - docs/operations/soc2-readiness/09-datadog-provisioning-runbook.md
soc2_controls: [CC7.1, CC7.2, CC7.3, CC7.4, CC7.5, A1.2]
---

# Incident Response Procedures

## 1. Purpose

This document defines how Sherpa Pros detects, classifies, responds to, communicates about, and learns from incidents. It satisfies SOC 2 CC7.1–CC7.5 (system monitoring, anomaly detection, incident response) and A1.2 (system availability commitments).

## 2. Severity Classification

| SEV | Definition | Response time | Escalation |
|-----|------------|---------------|------------|
| **SEV1** | Full platform outage; confirmed data breach; payment processing down; customer PII exposed | **15 min** initial response, 24/7 | On-call → Phyrom → senior eng → legal counsel (if data breach) → cyber-insurance carrier |
| **SEV2** | Degraded service (>10% error rate); single-region outage; non-customer-facing critical system down (audit log writes failing); successful authentication brute-force pattern detected | **30 min** initial response, business hours + on-call | On-call → senior eng → Phyrom |
| **SEV3** | Limited customer impact; intermittent errors; non-critical integration outage; performance degradation within SLA tolerance | **2 hour** initial response, business hours | On-call → senior eng |
| **SEV4** | Informational; trends approaching threshold; capacity-planning signal; non-actionable anomaly | **Next business day** | Triage to backlog |

### Trigger sources for incident creation

- Datadog monitor alerts (auto-page)
- PagerDuty manual page from any engineer
- Customer report via support channel that meets SEV1/SEV2 criteria
- Vendor breach notification (treat as SEV1 until scoped)
- Sherpa Guard audit log anomaly detection

## 3. Escalation Paths

### 3.1 On-call rotation

- **Tooling**: PagerDuty
- **Rotation**: Initially Phyrom-only (Q2-Q3 2026); add SRE hire as primary on-call (Q3 2026); two-engineer follow-the-sun rotation by Q1 2027
- **Schedule**: 7-day primary, 7-day secondary
- **Acknowledgement SLA**: SEV1 within 15 min; SEV2 within 30 min; SEV3 within 2 hr

### 3.2 Escalation matrix

| Trigger | Escalates to | Within |
|---------|--------------|--------|
| SEV1 unack'd 15 min | Phyrom directly + secondary on-call | Auto |
| SEV1 + customer data exposure suspected | Legal counsel | 1 hr |
| SEV1 + customer data exposure confirmed | Cyber-insurance carrier (Coalition or At-Bay TBD) | 24 hr |
| SEV1 + Stripe payment fraud detected | Stripe support team | Same day |
| SEV1 + state/federal regulator notification required | Legal counsel + state AG portal (per state law) | Per applicable law (typically 72 hrs) |
| Vendor breach affecting our customers | Compliance lead → customer comms | 24 hr scope, 72 hr notify |

### 3.3 Decision authority

- **Phyrom** (founder): Final authority on customer comms, regulator notification, public disclosure
- **Senior eng**: Technical triage, rollback authority, break-glass DB access approval
- **Legal counsel** (engaged firm — see `attorney-engagement-package.md`): Regulator notification language, breach disclosure timing
- **Cyber-insurance carrier**: Pre-engaged response panel (forensics, PR, breach coach)

## 4. Communication Protocol

### 4.1 Internal channels

- **PagerDuty incident channel** auto-created per incident; bridges to Slack channel `#incident-{ID}`
- **Status updates** every 30 min during SEV1, every 60 min during SEV2
- **War room** voice / video bridge opened for SEV1 (Google Meet or similar)
- **Single Incident Commander (IC)** assigned per incident — usually on-call eng for SEV2/3, Phyrom or designated SRE for SEV1

### 4.2 External channels

| Channel | When | Owner |
|---------|------|-------|
| **Status page** (`status.thesherpapros.com` — Statuspage.io or Atlassian Statuspage) | SEV1/SEV2 within 15 min of confirmation; updates every 30 min | IC delegates to comms drafter |
| **Customer email** (transactional, via Resend or SendGrid) | SEV1 affecting >5% of users; SEV2 affecting specific cohort | Phyrom approves; comms drafter sends |
| **SMS to PMs / pros** (via Twilio) | SEV1 with active job impact | Phyrom approves |
| **Trust Center post** | Post-resolution disclosure for SEV1 | Compliance lead |
| **Regulator notification** | Per state breach-notification laws (NH, MA, ME, NY, CA reciprocity) | Legal counsel drafts; Phyrom signs |
| **Press / media** | Only on SEV1 with material business impact | Phyrom only |

### 4.3 Sample status-page update cadence

```
T+0:   "Investigating: We're investigating reports of [symptom]. We will provide an update by [T+30]."
T+30:  "Identified: We've identified [root cause hypothesis]. Mitigation in progress. Next update by [T+60]."
T+60:  "Mitigating: [mitigation action]. Service restoration expected by [estimate]."
T+90:  "Monitoring: Service restored. Monitoring for stability."
T+120: "Resolved: Issue resolved. Postmortem will be published within [5 business days]."
```

## 5. Customer Notification Templates

### 5.1 Data breach notification (PII exposure confirmed)

**Subject**: Important security notice regarding your Sherpa Pros account

```
Hi {first_name},

We are writing to inform you of a security incident that affected your account on {date}.

WHAT HAPPENED
{plain-English description of what occurred and when, drafted by legal + comms}

WHAT INFORMATION WAS INVOLVED
The following information related to your account may have been accessed:
{itemized list — be specific and complete; do not minimize}

WHAT WE ARE DOING
We have:
- Contained the incident as of {time}
- Engaged third-party forensic experts
- Notified relevant regulators per applicable law
- Reset {affected credentials / payment tokens / etc.}
- Implemented additional safeguards including {list}

WHAT YOU CAN DO
- {Specific recommended actions: change password, monitor statement, etc.}
- {Free credit monitoring offer if applicable; we recommend 12 months minimum}
- {Phone hotline + email for direct support}

We deeply regret this incident and are committed to maintaining your trust.

Phyrom
Founder, Sherpa Pros
phyrom@hjd.builders
```

### 5.2 Service outage notification (no PII impact)

**Subject**: Sherpa Pros service interruption — resolved

```
Hi {first_name},

Earlier today between {start_time} and {end_time} ET, Sherpa Pros experienced a service interruption that may have affected your ability to {specific impact: post jobs / receive bids / receive notifications}.

The issue was caused by {plain-English root cause} and has been fully resolved.

If a job you posted during the affected window did not receive the expected response, please {specific recovery action — usually "no action needed; we have backfilled" or "please re-post"}.

A full postmortem will be published at {trust center URL} within 5 business days.

Thank you for your patience.

Sherpa Pros
```

### 5.3 Security incident — non-breach (vulnerability disclosed)

**Subject**: Security advisory from Sherpa Pros

```
Hi {first_name},

We're writing to share that our security team identified and remediated a vulnerability in our {affected system} on {date}. We have no evidence that any customer data was accessed by unauthorized parties.

Out of an abundance of caution, we are sharing this notice and have implemented additional monitoring.

WHAT WAS THE ISSUE
{plain-English vulnerability description}

WHAT WE FIXED
{remediation summary}

WHAT YOU SHOULD DO
{recommendations: rotate API keys / update mobile app / etc., or "no action required"}

Questions: security@thesherpapros.com

Sherpa Pros Security Team
```

## 6. Incident War-Room Runbook

### 6.1 Open the room

```
1. PagerDuty triggers; on-call ack
2. Slack channel #incident-{auto-ID} created with /incident command
3. Voice bridge linked in channel topic
4. Roles assigned in channel:
   - Incident Commander (IC): drives priorities, no hands-on-keyboard
   - Tech Lead: drives technical investigation
   - Communications Lead: drafts status updates + customer comms
   - Scribe: timestamps every action in channel
5. /pageall called for SEV1 — pulls Phyrom + senior eng + legal (if PII)
```

### 6.2 During response

```
□ Every action timestamped in channel
□ Every hypothesis written down before tested ("we think X is happening because Y")
□ Mitigation prioritized over root-cause analysis (stop the bleeding first)
□ Status page updates per Section 4.3 cadence — IC owns timing
□ If considering destructive action (drop table, force logout all): IC explicit approval required + scribe records
□ If break-glass DB access needed: follow access-management policy Section 10
```

### 6.3 Resolution

```
□ Tech lead declares "mitigation complete"
□ Monitoring period 30 min minimum before "resolved"
□ IC declares resolved; status page updated
□ Channel kept open 24 hr for follow-up
□ Postmortem doc opened immediately while context fresh
□ All audit log entries reviewed for completeness
□ Customer comms sent if user-visible (per Section 4.2)
```

## 7. Postmortem Template

**Within 5 business days of any SEV1 or SEV2.** Blameless. Focus on systems, not individuals.

```markdown
# Postmortem: {Incident Title}

**Incident ID**: INC-{YYYY-MM-DD}-{NNN}
**Date / Time**: {start} – {end} ET ({duration})
**Severity**: SEV{1/2/3}
**Author**: {name}
**Status**: Draft / Reviewed / Final
**Distribution**: Internal / Customer-facing / Regulator-facing

## Summary
{2–3 sentences: what happened, who was affected, what we did}

## Impact
- **Customers affected**: {count + segments}
- **Functionality affected**: {specifics}
- **Data exposure**: {none / suspected / confirmed scope}
- **Financial impact**: {refunds, SLA credits, payment errors}
- **Reputation impact**: {social mentions, support volume}

## Timeline (all times ET)
| Time | Event |
|------|-------|
| {T+0} | First detection signal |
| {T+5} | On-call acknowledged |
| {...} | ... |
| {T+resolved} | Service restored |

## Root cause (5 whys)
1. **Why did the service degrade?** — Because X
2. **Why did X happen?** — Because Y
3. **Why did Y happen?** — Because Z
4. **Why did Z happen?** — Because W
5. **Why did W happen?** — {root systemic cause}

## Detection
- How was this detected? (alert, customer report, internal observation)
- Could we have detected sooner? What signal was available but not alerted?

## Response
- What went well in the response?
- What was slow, confusing, or missed?

## Action items
| Owner | Action | Due | Tracking |
|-------|--------|-----|----------|
| {name} | {specific, time-bound action — not "consider X"} | {date} | {Linear ticket} |

## Customer comms
- What was sent? Link to message, sent time, recipient count.
- Was timing per policy? If not, why?

## Lessons learned
{2–3 paragraphs of systemic observations — not blame}

## Appendix
- Logs, dashboards, screenshots
- Audit log entries during incident window
- Vendor incident reports if applicable
```

## 8. Anomaly Detection (CC7.2)

### 8.1 Datadog monitors providing detection

Per `09-datadog-provisioning-runbook.md`:

- P95 dispatch latency >500ms for 5 min → SEV3
- P95 dispatch latency >1s for 5 min → SEV2
- Payment success rate <95% over 10 min → SEV1
- Error rate >5% over 5 min → SEV2
- Audit log write rate drops to 0 for 60s → SEV2
- DB connection pool >80% saturation for 10 min → SEV3
- Stripe webhook signature verification failure rate >1% → SEV2
- Cloudflare WAF challenges spike >10× baseline → SEV3
- Authentication failure rate spike >5× baseline (possible brute force) → SEV2

### 8.2 Manual triggers

- Customer report verified by support
- Vendor breach disclosure
- Sherpa Guard audit log review surfaces unauthorized cross-tier access
- Engineer notices anomaly — explicit "page myself" pattern allowed

## 9. Drills + Tabletop Exercises

- **Quarterly**: full incident drill (synthetic SEV1 in staging; on-call paged; comms drafted; postmortem completed)
- **Semi-annual**: tabletop exercise covering data breach scenario with legal counsel + insurance carrier participation
- **Annual**: cross-team disaster recovery drill (full DR failover per `08-backup-restore-runbook.md`)
- All drills produce postmortems documenting playbook gaps

## 10. Regulatory Notification Quick Reference

| Trigger | Jurisdiction | Notification window |
|---------|--------------|---------------------|
| Confirmed PII breach | NH (RSA 359-C:20) | Without unreasonable delay |
| Confirmed PII breach | MA (M.G.L. 93H) | As soon as practicable + AG notice |
| Confirmed PII breach | ME (10 MRS §1346–§1349-A) | No later than 30 days; AG notice if >1000 residents |
| Confirmed PII breach | NY SHIELD Act | Most expedient time possible |
| Confirmed PCI breach | Stripe + card networks | Per Stripe agreement (typically immediate) |
| Confirmed cyber insurance trigger | Carrier (Coalition / At-Bay TBD) | Per policy (typically 72 hrs) |

Legal counsel determines exact applicability and timing; this table is reference only.

## 11. Maintenance

- **Owner**: SRE / Compliance lead (Phyrom interim)
- **Review cadence**: Annual + after each SEV1 incident
- **Effective date**: 2026-06-01
