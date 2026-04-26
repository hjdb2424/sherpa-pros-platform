---
title: Runbook Framework + 12 Specific Runbooks
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire
references:
  - 05-pagerduty-oncall-setup.md
  - 07-incident-response-procedures.md
phase: 4A baseline
---

# Runbook Framework

Every alert routed via PagerDuty references one of the runbooks below. Runbooks live next to the code (this file) so they are versioned, reviewed, and never go stale silently.

## Template

```markdown
## Runbook NN — [Short Title]

**Severity ceiling:** SEV1 / SEV2 / SEV3
**Service:** [PagerDuty service name]
**Last reviewed:** YYYY-MM-DD
**Owner:** [name]

### Preconditions
What state the system is in when this runbook applies.

### Symptoms
How the on-call learns about it (alert text, dashboard, customer report).

### Customer impact
Who is affected, what they see, severity to the business.

### Immediate response (first 5 minutes)
Numbered, copy-pasteable commands. No prose.

### Mitigation steps
Bring the system back to healthy. Numbered, idempotent where possible.

### Root-cause investigation
Where to look once the bleeding stops. Pointers to dashboards, log queries, traces.

### Postmortem trigger
Conditions that require a postmortem (default: SEV1 always, SEV2 if customer-impacting > 30 min).
```

---

## Runbook 01 — Service down (full outage)

**Severity:** SEV1
**Service:** `web-mobile-app` + all dependents
**Last reviewed:** 2026-04-25
**Owner:** Phyrom (until SRE hire)

### Preconditions
Vercel production deployment is failing health checks OR all production routes return 5xx.

### Symptoms
- Datadog synthetic check `prod-homepage-5xx` fires.
- Customer reports flood the `#support` Slack channel.
- Vercel status page shows red on the project.

### Customer impact
**100% of users — total outage.** Pros cannot accept jobs. Clients cannot post jobs. Payments queued in Stripe but unprocessed.

### Immediate response
1. Acknowledge PagerDuty alert.
2. Open the war room: `/incident sev1 service-down` in Slack `#incidents`.
3. Post on Statuspage: "We are investigating an issue affecting all users."
4. Check Vercel dashboard → Deployments → is the latest deploy green?
5. If the latest deploy went red within last 30 min: **rollback** via `vercel rollback <previous-prod-url>`.

### Mitigation
1. If rollback fixes it → confirm via synthetic check → close incident, postmortem mandatory.
2. If rollback does not fix it → check Neon status, Clerk status, AWS us-east-2 status.
3. If a vendor is down → switch Statuspage to "Identified" with vendor name → wait, communicate.
4. If our code is at fault and rollback didn't help → escalate to Level 2.

### Root cause investigation
- Vercel deployment build logs.
- Sentry release for the failing version.
- Datadog APM traces filtered to last 1h, error tag.

### Postmortem trigger
Always (SEV1).

---

## Runbook 02 — Database unreachable

**Severity:** SEV1
**Service:** `database`

### Preconditions
Application can connect to Vercel but Postgres queries are timing out or returning connection errors.

### Symptoms
- Sentry: `error: connect ECONNREFUSED <neon endpoint>`
- Datadog: `postgresql.connections.active` drops to 0.
- All API routes return 500 with body `{ error: "database_unavailable" }`.

### Customer impact
Effectively a full outage. Read-only static pages still load.

### Immediate response
1. Acknowledge PagerDuty.
2. Check Neon status page (https://neonstatus.com).
3. Check `pg_stat_activity` from a known-good client if reachable.
4. If Neon outage → switch to Statuspage "Investigating", subscribe to Neon updates.
5. If our app cannot reach Neon but Neon is healthy → check Vercel function region health, IP allowlist (Neon does not use IP allowlist by default but verify), and the `DATABASE_URL` env var (was it just rotated?).

### Mitigation
1. If Neon outage → no app-side mitigation; wait for Neon. Communicate every 30 min.
2. If env var rotated incorrectly → revert in Vercel project settings, redeploy.
3. If connection pool exhausted → restart Vercel functions by triggering a redeploy of the same commit.
4. If primary is down but read replica is up → put app in read-only mode via feature flag `app-read-only-mode-prod`.

### Root cause
- Neon support ticket (paid plan includes 4-hour response).
- pg_stat_activity, pg_stat_replication snapshots.
- Vercel function logs across regions.

### Postmortem trigger
Always (SEV1).

---

## Runbook 03 — Payment processing degraded

**Severity:** SEV2
**Service:** `payments-stripe`

### Preconditions
Stripe payments succeeding < 95% of normal rate OR Stripe Connect transfer failures > 1% of attempts.

### Symptoms
- Datadog: `stripe.payment_intent.failed` rate > 5% for 5 minutes.
- Stripe dashboard shows elevated `card_declined` or `processing_error` rates.
- Pros report unpaid completed jobs.

### Customer impact
Pros not getting paid in real time. Clients cannot pay deposits. Conversion drops.

### Immediate response
1. Acknowledge PagerDuty.
2. Check Stripe status (https://status.stripe.com).
3. Check our Stripe webhook delivery success in Stripe dashboard.
4. Check Sherpa Guard audit log for an unexpected drop in `payment.succeeded` events.
5. Open Statuspage: "We are investigating delays in payment processing."

### Mitigation
1. If Stripe is degraded → mark in Statuspage, queue payments for retry (already automatic via Stripe).
2. If our webhook handler is failing → check Vercel function logs for `/api/webhooks/stripe`, verify `STRIPE_WEBHOOK_SECRET` is correct.
3. If a specific Connect account is failing → check that account's onboarding status in Stripe; pause dispatch to that pro via feature flag until resolved.

### Root cause
- Stripe API logs.
- Sentry for webhook handler errors.
- Sherpa Guard audit logs for payment events around the incident window.

### Postmortem trigger
SEV2 customer impact > 30 min OR > $5K in impacted GMV.

---

## Runbook 04 — Dispatch latency P95 > 1s

**Severity:** SEV2
**Service:** `dispatch-wiseman`

### Preconditions
Dispatch endpoint P95 latency > 1s for 5 consecutive minutes (target SLO is < 500ms).

### Symptoms
- Datadog APM: `dispatch.match.duration_ms.p95 > 1000`.
- Pros report slow incoming job notifications.

### Customer impact
Slower job assignment → pros may miss jobs to competitors → revenue at risk.

### Immediate response
1. Acknowledge PagerDuty.
2. Check Datadog dispatch dashboard — is it CPU bound, IO bound, or external?
3. Check DB connection pool saturation (see Runbook 10).
4. Check if a recent deploy introduced a regression — look at deploy timeline overlay on the latency graph.

### Mitigation
1. If recent deploy is the cause → rollback per Runbook 01 process.
2. If DB pool saturation → bump pool size temporarily, see Runbook 10.
3. If geospatial query slow → check PostGIS index health on `pros.location`, reindex if needed.
4. If matching algorithm regression → toggle feature flag `dispatch-algorithm-v2-enabled-prod` to revert to previous version.

### Root cause
- Datadog distributed tracing for slow requests.
- pg_stat_statements top queries by total_time.

### Postmortem trigger
Sustained > 1 hour.

---

## Runbook 05 — Audit log write failure

**Severity:** SEV2 (compliance impact)
**Service:** `audit-logs-sherpa-guard`

### Preconditions
Sherpa Guard audit log writes failing > 0.1% of attempts (we target zero).

### Symptoms
- Datadog: `audit.write.failed` count > 0.
- Sentry exceptions tagged `audit_write_failure`.
- Sherpa Guard dashboard shows missing entries for high-traffic events.

### Customer impact
**Compliance impact.** Missing audit entries jeopardize SOC 2, GDPR Article 30 records, and money-flow traceability.

### Immediate response
1. Acknowledge PagerDuty.
2. Page Phyrom (audit log integrity is non-negotiable).
3. Check `audit_logs` table writability (run a manual insert from a known-good client).
4. Check disk usage on Neon — partition full? Replication lag?
5. Snapshot all current audit events to S3 immediately as a backup.

### Mitigation
1. If table is unwritable due to disk → upsize Neon compute, archive old partitions per Runbook 11.
2. If a code path is silently dropping events → identify and patch within 24h, replay missed events from application logs.
3. If a third-party integration (e.g., Stripe webhook) is firing without audit entries → add to retro-fill queue.

### Root cause
Mandatory deep-dive: every dropped audit event must be accounted for in the postmortem.

### Postmortem trigger
Always (compliance).

---

## Runbook 06 — Auth/Clerk outage

**Severity:** SEV1
**Service:** `auth-clerk`

### Preconditions
Clerk authentication service is degraded or down.

### Symptoms
- New sign-ins fail.
- Existing sessions may continue (JWT cached) but token refresh fails.
- Datadog synthetic `clerk-signin-flow` red.

### Customer impact
New users cannot sign in. After ~1 hour, existing sessions also expire.

### Immediate response
1. Acknowledge PagerDuty.
2. Check Clerk status (https://status.clerk.com).
3. Post Statuspage: "We are investigating sign-in issues."
4. If Clerk widely down → wait. There is no failover for auth in Phase 4A.

### Mitigation
1. Phase 4B mitigation: cache valid JWTs longer (extend session via env var) to reduce refresh pressure.
2. Phase 4C+ mitigation: secondary auth provider (Auth0 or Descope) standby — out of scope for Phase 4A.

### Root cause
Clerk incident report.

### Postmortem trigger
Always.

---

## Runbook 07 — Materials orchestration failure (Zinc + Uber Direct)

**Severity:** SEV2
**Service:** `materials-orchestration`

### Preconditions
Materials order creation or delivery dispatch failing.

### Symptoms
- Datadog: `materials.order.create.failed` rate > 5%.
- Sentry exceptions tagged `zinc_api_error` or `uber_direct_api_error`.

### Customer impact
Pros cannot order materials through the platform. Some jobs blocked.

### Immediate response
1. Acknowledge PagerDuty.
2. Check Zinc API status, Uber Direct status.
3. Identify which vendor is failing — partial degradation is common.
4. If Zinc down: enable manual material ordering fallback via feature flag `materials-manual-fallback-prod`.

### Mitigation
1. Vendor-down: communicate via in-app banner to pros, queue orders for retry.
2. Code regression: rollback per Runbook 01.

### Root cause
Vendor logs, Sentry traces.

### Postmortem trigger
Sustained > 2 hours.

---

## Runbook 08 — Sherpa Mobile crash spike

**Severity:** SEV2
**Service:** `web-mobile-app`

### Preconditions
Mobile (PWA or native shell) crash rate > 1% of sessions.

### Symptoms
- Sentry mobile project crash rate spike.
- Datadog RUM (Real User Monitoring) error spike.

### Customer impact
Pros and clients cannot use the app reliably on mobile.

### Immediate response
1. Acknowledge PagerDuty.
2. Check Sentry for the top crash signature — is it a single root cause?
3. Check if it correlates with a recent release.
4. If a single bad release → roll forward with a hotfix (PWA caches old version, so a rollback alone won't help all users).

### Mitigation
1. Hotfix release within 4 hours.
2. Force PWA cache bust by bumping the service worker version.
3. Send push notification to affected users (if possible) to reload.

### Root cause
Sentry stack traces, repro steps from Sentry session replay.

### Postmortem trigger
Crash rate sustained > 1% for > 1 hour.

---

## Runbook 09 — Twilio/SMS sync failure

**Severity:** SEV3
**Service:** `integrations-twilio-resend`

### Preconditions
Twilio masked messaging or Resend transactional email failing > 5% of sends.

### Symptoms
- Twilio dashboard error rate spike.
- Resend webhook failures.
- Customer reports of missed notifications.

### Customer impact
Notifications delayed or missed. Not catastrophic — in-app notifications still work.

### Immediate response
1. Acknowledge PagerDuty.
2. Check Twilio + Resend status pages.
3. If single vendor down → flip feature flag `notifications-fallback-channel-prod` to use the other channel where possible.

### Mitigation
1. Wait for vendor recovery; queue messages for retry.
2. If our credentials are the issue → rotate API keys.

### Root cause
Vendor logs, Sentry.

### Postmortem trigger
Sustained > 4 hours OR repeated within 7 days.

---

## Runbook 10 — DB connection pool saturation

**Severity:** SEV2
**Service:** `database`

### Preconditions
PgBouncer (or Neon pooler) `cl_waiting` (clients waiting for a connection) > 10 for 5 minutes.

### Symptoms
- Datadog: `pgbouncer.cl_waiting > 10`.
- Application latency spike across all routes.
- Sentry exceptions tagged `connection_timeout`.

### Customer impact
App is slow but not down. Some requests time out.

### Immediate response
1. Acknowledge PagerDuty.
2. Check `pg_stat_activity` for long-running queries; kill any > 60s with `SELECT pg_terminate_backend(pid)`.
3. Check for a query pattern hammering the pool — likely a recent deploy regression.
4. Bump Neon compute size temporarily (autoscaled but max may need raising in console).

### Mitigation
1. Roll back recent deploy if it caused the regression.
2. Increase pool size in PgBouncer config.
3. Add an index if a slow query is the culprit.

### Root cause
pg_stat_statements, pg_stat_activity snapshots, Datadog APM.

### Postmortem trigger
Sustained > 1 hour OR repeats within 7 days.

---

## Runbook 11 — Cross-region replication lag > 30s

**Severity:** SEV3
**Service:** `database`

### Preconditions
US-West read replica lag > 30s for > 1 minute.

### Symptoms
- Datadog: `postgresql.replication.lag_seconds > 30`.
- US-West users may see stale data (e.g., a posted job not appearing for ~30s).

### Customer impact
Stale reads in US-West. Stale-read guard mitigates within-request inconsistency.

### Immediate response
1. Acknowledge PagerDuty.
2. Check Neon status for the replica.
3. Check primary write throughput — large bulk write?
4. Check network between regions (Neon should expose this in support).

### Mitigation
1. If a bulk write is the cause → throttle the writer or pause it temporarily.
2. If replica is unhealthy → fail back to primary by disabling LaunchDarkly flag `db-read-replica-rollout-prod`.
3. Open a Neon support ticket if lag persists > 15 minutes.

### Root cause
Neon support, application write logs.

### Postmortem trigger
Sustained > 30 minutes OR repeated within 7 days.

---

## Runbook 12 — Suspected security breach

**Severity:** SEV1 (escalates to legal + customer notification)
**Service:** `audit-logs-sherpa-guard` + all

### Preconditions
Any of: unusual data export pattern, unauthorized admin action, credential leak signal, suspicious traffic from known-bad IPs, unexpected privilege escalation.

### Symptoms
- Sherpa Guard alert: `unusual.export.volume` or `unauthorized.admin.action`.
- Customer report of compromised account.
- External threat intel notification.

### Customer impact
Potentially high. Personal data exposure is a regulatory event under GDPR (72-hr notification), CCPA, PIPEDA.

### Immediate response
1. Acknowledge PagerDuty.
2. Page Phyrom AND outside legal counsel immediately (Level 3 escalation).
3. Open SEV1 war room.
4. Snapshot all relevant logs to immutable storage (S3 with object lock).
5. Do NOT delete or modify anything in the audit trail.
6. Identify scope: how many users, what data categories, what timeframe.

### Mitigation
1. If active attack → rotate all API keys, revoke suspect sessions, enable WAF rule (Web Application Firewall) blocking the source.
2. If credential leak → force password reset for affected users.
3. If insider action → revoke access, preserve evidence chain.

### Root cause
Forensic analysis (likely with outside firm).

### Postmortem trigger
Always. Postmortem includes regulator notification timeline + customer notification timeline.

### Communication
- 72-hour GDPR notification clock starts at confirmation, not at first signal.
- Customer notification within 60 days under most US state breach laws; sooner is better.
- Templates in `07-incident-response-procedures.md`.
