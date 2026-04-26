---
title: Incident Response Procedures
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire
references:
  - 05-pagerduty-oncall-setup.md
  - 06-runbook-templates-and-12-runbooks.md
  - docs/operations/soc2-readiness/ (related)
phase: 4A baseline
---

# Incident Response Procedures

## Severity classification

| Severity | Definition | Acknowledge SLA | Update cadence | Postmortem |
| --- | --- | --- | --- | --- |
| **SEV1** | Full outage, data loss risk, security breach, payment system down. Affects > 25% of active users OR critical compliance impact. | 5 min | every 30 min | Mandatory within 48 hr |
| **SEV2** | Major degradation, single feature broken, payment delays, dispatch latency 2x SLO. Affects 5–25% of users. | 15 min | every 1 hr | Within 1 week |
| **SEV3** | Minor degradation, third-party integration intermittent, observable but not blocking. < 5% of users. | 1 hr | as needed | Optional, monthly summary |
| **SEV4** | Cosmetic, low-impact, internal tooling. | 24 hr | none | None |

Severity may be upgraded mid-incident as scope becomes clear; downgrades require incident commander approval and postmortem capture.

## Roles

- **On-call engineer** — acknowledges, executes runbook, communicates technical state. Per PagerDuty rotation.
- **Incident commander (IC)** — coordinates the response, owns external communication, decides on escalations. Separate from on-call. Phase 4A: rotates weekly among senior engineers + Phyrom. Phase 4B+: dedicated IC pool.
- **Communications lead** — drafts Statuspage updates, customer emails, internal Slack updates. Phase 4A: usually IC doubles. Phase 4B: separate role for SEV1.
- **Scribe** — records timeline in the war-room channel for the postmortem. Anyone in the channel.

## Communication protocol

### Internal

- All incidents open a Slack channel `#inc-YYYYMMDD-<short-name>` (e.g., `#inc-20260722-payments-degraded`).
- Video bridge (Zoom or Google Meet) opened automatically by the `/incident` Slack command.
- IC posts status updates pinned to the channel at the cadence above.

### External — Statuspage.io

Customer-facing status at `status.sherpapros.com` (Statuspage). Components mirror PagerDuty services.

State machine:

1. **Investigating** — within 5 min of incident open.
2. **Identified** — root cause identified (or vendor blamed).
3. **Monitoring** — fix deployed, watching for regression.
4. **Resolved** — fully back to normal.

Update copy templates live in this doc (below).

### External — customer email

For SEV1 with > 1 hour user impact, send a customer email within 24 hours of resolution. Template below.

### Regulator notification

- **GDPR (EU users):** 72 hours from confirmation of personal data breach. To the lead supervisory authority for our EU establishment (TBD on EU launch).
- **PIPEDA (Canada):** "as soon as feasible" for breaches of security safeguards involving personal information that pose a real risk of significant harm.
- **US state breach laws:** vary by state, generally 30–90 days. Phyrom + counsel decide jurisdictions per incident.

Templates below.

## War-room runbook

### Opening

- [ ] Slack `/incident sev<N> <short-name>` (custom slash command, Phase 4B; manual for now).
- [ ] Channel auto-created with topic linking to runbook + Statuspage.
- [ ] Video bridge link pinned.
- [ ] IC posts initial status: scope, suspected cause, who is doing what.

### During

- [ ] Scribe captures timeline (timestamped events) in a pinned thread.
- [ ] Action items captured as Slack reactions: `:eyes:` (investigating), `:warning:` (open issue), `:white_check_mark:` (done).
- [ ] No code commits to main during a SEV1 except the fix for the incident.

### Closing

- [ ] IC declares resolved, posts final status update.
- [ ] Statuspage marked Resolved.
- [ ] Channel preserved (don't delete) for postmortem reference.
- [ ] Postmortem doc created within 24 hr.

## Postmortem template (blameless 5-whys)

```markdown
# Postmortem — [Incident name]

**Date:** YYYY-MM-DD
**Severity:** SEV<N>
**Duration:** HH:MM customer-impact start → HH:MM resolved
**Author:** [name]
**Reviewers:** [names]

## Summary
1–2 paragraphs: what happened, customer impact, how we resolved.

## Timeline
- HH:MM — first signal
- HH:MM — alert fired
- HH:MM — on-call acknowledged
- HH:MM — IC declared SEV<N>
- HH:MM — root cause identified
- HH:MM — mitigation deployed
- HH:MM — resolved

## What went well
Bulleted list. Always include something. Praise good calls.

## What went poorly
Bulleted list. No names, focus on systems and decisions.

## 5 whys
1. Why did the customer see X? Because Y.
2. Why did Y happen? Because Z.
3. Why did Z? ...
4. ...
5. ... (root cause should bottom out around here)

## Action items
| Item | Owner | Due | Status |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

Action items must have a single owner, a due date, and a Jira ticket. Track to completion in the next ops review.

## Lessons learned
Patterns we want to apply to other systems.
```

## Customer communication templates

### Statuspage — Investigating (within 5 min)

> **[Investigating] [Component] — [Short headline]**
>
> We are investigating reports of [symptom]. Some users may experience [impact]. We will provide an update within 30 minutes.

### Statuspage — Identified

> **[Identified] [Component] — [Short headline]**
>
> We have identified the cause as [vendor outage / our deployment / configuration issue]. We are working on a fix and will update by [time].

### Statuspage — Monitoring

> **[Monitoring] [Component] — [Short headline]**
>
> A fix has been deployed and we are monitoring for any regressions. Service should be returning to normal for affected users.

### Statuspage — Resolved

> **[Resolved] [Component] — [Short headline]**
>
> The incident is resolved as of [time]. We will publish a postmortem within 48 hours.

### Customer email — service outage notice

> Subject: Service interruption on [date] — what happened
>
> Hi [first name],
>
> On [date] from [start] to [end] [timezone], some Sherpa Pros users were unable to [specific action]. We resolved the issue at [end time]. We are sorry for the disruption.
>
> What happened: [plain-English explanation, 2-3 sentences]
>
> What we are doing: [concrete change, 2-3 sentences]
>
> If you experienced [specific impact like a missed job notification], please reply to this email and we will make it right.
>
> — The Sherpa Pros team

### Customer email — payment incident notice

> Subject: Important — payment processing incident on [date]
>
> Hi [first name],
>
> Between [start] and [end] [timezone], a small percentage of payments to pros were delayed or required a retry. Your account [is / is not] affected; if affected, the impacted payment was [transaction id] and has now been [retried successfully / refunded].
>
> No card data was exposed. We have added [specific safeguard] to prevent recurrence.
>
> Questions? Reply directly to this email.
>
> — Phyrom and the Sherpa Pros team

### Customer email — data breach notice (template; legal review required before send)

> Subject: Important security notice regarding your Sherpa Pros account
>
> Hi [first name],
>
> We are writing to inform you of a security incident that may have affected your Sherpa Pros account. On [date], we [discovered / were notified of] [type of incident].
>
> What information was involved: [list of data categories with specificity]
>
> What we are doing: [containment, remediation, third-party forensics if applicable]
>
> What you should do: [reset password, enable MFA, monitor statements, etc.]
>
> For more information: [URL to FAQ + dedicated phone line]
>
> We take this seriously and apologize for the concern this may cause.
>
> — Phyrom, Founder, Sherpa Pros

### Regulator notification (GDPR Article 33) — template

Filed within 72 hours of confirmation. Includes: nature of breach, categories and approximate number of data subjects, categories and approximate number of records, contact point, likely consequences, measures taken or proposed.

Outside counsel drafts and submits.

## Drills

- Quarterly Game Day exercises (see `09-quarterly-game-day-playbook.md`).
- Annual tabletop SEV1 exercise with full team + outside counsel.
- Annual breach-response tabletop with privacy counsel.
