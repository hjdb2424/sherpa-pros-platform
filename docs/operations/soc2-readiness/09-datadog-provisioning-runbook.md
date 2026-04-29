---
title: Datadog Provisioning Runbook
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - docs/operations/soc2-readiness/06-incident-response-procedures.md
  - docs/operations/soc2-readiness/10-day-1-dashboards-spec.md
  - docs/operations/soc2-readiness/03-access-management-policy.md
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
soc2_controls: [CC7.1, CC7.2, CC7.3]
---

# Datadog Provisioning Runbook

## 1. Purpose

Step-by-step setup of Datadog as Sherpa Pros' primary observability platform — APM, logs, metrics, RUM, synthetics, and alerts. Crossover to OpenTelemetry self-hosted at 1M MAU is documented in the platform-scale spec.

## 2. Account + Plan Setup

### 2.1 Account creation

- [ ] Create Datadog organization `sherpa-pros` at `app.datadoghq.com` (US1 region)
- [ ] **Plan**: Pro ($23/host/mo) for Phase 1; upgrade to Enterprise at >25 hosts or when audit trail required
- [ ] **Contracted spend cap**: $1K/mo Phase 1, $5K/mo Phase 2, $20K/mo Phase 4
- [ ] Billing tied to corporate AmEx with PagerDuty alert on threshold (per Section 8)

### 2.2 RBAC setup (CC6.1 alignment)

| Datadog role | Mapped to Sherpa Guard tier | Permissions |
|--------------|------------------------------|-------------|
| **Admin** | Phyrom + future SRE | All |
| **Standard (Engineering)** | `internal_eng` | Read all, write to non-prod monitors, write to dashboards |
| **Read-Only (Operations)** | `internal_ops` | Read all dashboards + logs |
| **Read-Only (Leadership)** | Founder + future exec | Read curated executive dashboards only (no raw logs) |
| **Read-Only (Compliance)** | `internal_compliance` | Read all (for audit evidence) |

Provisioned via Datadog SAML SSO bound to Okta or Google Workspace (per `03-access-management-policy.md`). Direct Datadog logins disabled.

## 3. Agent Installation

### 3.1 Vercel native integration (Phase 1)

Vercel + Datadog have a native integration via the Vercel Marketplace.

- [ ] Install Datadog integration from Vercel Marketplace
- [ ] OAuth approve at Vercel team level
- [ ] Set DD_SITE=`datadoghq.com` and DD_ENV per Vercel environment (`production`, `preview`)
- [ ] Verify logs flowing within 10 min in Datadog Logs Explorer
- [ ] Test trace generation by hitting `/api/healthz` and confirming span in APM

### 3.2 Phase 4 self-hosted considerations

When MAU > 1M, evaluate switching to:

- **OpenTelemetry Collector** (self-hosted) feeding either Datadog (continued vendor) OR Prometheus + Grafana + Tempo + Loki (open source)
- **Crossover decision criteria**: Datadog spend >$15K/mo OR data sovereignty requirements emerge
- **Crossover plan**: documented separately in platform-scale spec WS6

## 4. APM Instrumentation

### 4.1 Auto-instrumentation (Next.js)

- [ ] `dd-trace` auto-injected via Vercel integration on Node runtime functions
- [ ] Edge runtime functions (middleware, edge routes) instrumented via lightweight Datadog Edge SDK
- [ ] Custom service name: `sherpa-pros-app` for Next.js app, `sherpa-pros-edge` for edge middleware

### 4.2 Custom spans for critical paths

```typescript
// lib/telemetry/trace.ts (illustrative)
import tracer from 'dd-trace';

tracer.init({
  service: 'sherpa-pros-app',
  env: process.env.VERCEL_ENV,
  version: process.env.VERCEL_GIT_COMMIT_SHA,
  logInjection: true,
  runtimeMetrics: true,
});

export async function withSpan<T>(name: string, op: () => Promise<T>, tags?: Record<string, string>): Promise<T> {
  return tracer.trace(name, { tags }, op);
}
```

Critical paths to wrap:

- `dispatch.match_pros` — sherpa-score-driven matching
- `payment.create_intent` — Stripe intent creation
- `payment.settlement_release` — release on job completion
- `audit.write` — every write to `audit_logs`
- `materials.order_zinc` — Zinc API call
- `delivery.uber_direct` — Uber Direct call
- `auth.session_check` — Sherpa Guard middleware tier check

### 4.3 Distributed tracing context propagation

- All outbound HTTP calls inject Datadog trace headers
- Webhook receivers extract trace context where possible
- Stripe / Twilio / Tremendous / Zinc / Uber Direct call correlation via trace ID + idempotency key

## 5. Logs

### 5.1 Sources

- Vercel function logs (auto via integration)
- Vercel Edge middleware logs (auto)
- Sherpa Guard audit log writes — **dual-written** to `audit_logs` table AND to Datadog with tag `audit:true`
- Stripe webhook receipt + processing logs
- Twilio dispatch logs
- Materials orders + deliveries logs
- Datadog Agent logs from any future containerized services

### 5.2 PII scrubbing rules

Per `07-encryption-policy.md` Section 7.1 — applied at the Datadog agent + processor level. Verified quarterly via sample log audit.

### 5.3 Log retention

- **Standard logs**: 15 days hot, 30 days indexed (Pro plan default)
- **Audit logs (`audit:true` tag)**: 90 days indexed in Datadog + permanent archive in S3 per `08-backup-restore-runbook.md`
- **Security logs (auth failures, WAF blocks)**: 180 days indexed

## 6. Metrics

### 6.1 Auto-collected

- Next.js runtime metrics (heap, event loop lag, GC)
- HTTP request metrics per route (count, latency, status code)
- DB query metrics (via dd-trace Drizzle/PG instrumentation)

### 6.2 Custom business metrics

```typescript
// lib/telemetry/metrics.ts
import StatsD from 'hot-shots';

export const metrics = new StatsD({ prefix: 'sherpa.' });

// Examples:
metrics.timing('dispatch.match_latency_ms', durationMs, [`metro:${metro}`, `trade:${trade}`]);
metrics.increment('payment.success', 1, [`tier:${tier}`]);
metrics.increment('payment.failure', 1, [`reason:${stripeErrorCode}`]);
metrics.gauge('settlement.balance_cents', currentBalance);
metrics.histogram('bid.response_time_seconds', responseSec, [`pro_tier:${proTier}`]);
metrics.increment('job_funnel.posted', 1, [`metro:${metro}`]);
metrics.increment('job_funnel.bid_received', 1);
metrics.increment('job_funnel.accepted', 1);
metrics.increment('job_funnel.completed', 1);
metrics.increment('audit_log.write', 1, [`action:${action}`]);
```

## 7. RUM (Real User Monitoring)

- [ ] Datadog RUM SDK installed in Next.js root layout
- [ ] `defaultPrivacyLevel: 'mask-user-input'` (per encryption policy)
- [ ] Session sample rate: 100% Phase 1 (low traffic), reduce to 20% at >100K sessions/mo
- [ ] Replay sample rate: 10% of sessions, 0% on payment/KYC routes
- [ ] Error tracking enabled

## 8. Synthetics

### 8.1 Key user journey monitors

| Journey | Cadence | Locations | Alerts |
|---------|---------|-----------|--------|
| Sign-in (homeowner) | Every 5 min | us-east-1, us-west-2 | Page on 3 consecutive failures |
| Sign-in (pro) | Every 5 min | us-east-1 | Same |
| Sign-in (pm_admin) | Every 5 min | us-east-1 | Same |
| Post a job (homeowner end-to-end) | Every 15 min | us-east-1 | Page on 2 consecutive failures |
| Pro accepts a bid | Every 15 min | us-east-1 | Same |
| Stripe payment protection + release flow | Every 15 min | us-east-1 | Page on any failure |
| Sherpa Guard middleware tier check (synthetic unauthorized request) | Every 5 min | us-east-1, us-west-2 | Page if middleware allows when it should block |
| Static page (`/`, `/pricing`, `/trust`) | Every 1 min | 5 global locations | Warn on >2s LCP, page on 5xx |

## 9. Alerts Configuration

### 9.1 SLO-aligned alerts (per Incident Response Sec 8)

| Monitor | Threshold | Severity | Notify |
|---------|-----------|----------|--------|
| P95 dispatch latency | >500ms 5min | SEV3 (warn) | #eng Slack |
| P95 dispatch latency | >1s 5min | SEV2 (page) | PagerDuty primary on-call |
| Payment success rate | <95% 10min | SEV1 (page) | PagerDuty primary + Phyrom |
| Error rate per route | >5% 5min | SEV2 (page) | PagerDuty |
| DB connection pool saturation | >80% 10min | SEV3 (warn) | #eng Slack |
| DB connection pool saturation | >95% 5min | SEV2 (page) | PagerDuty |
| Audit log write rate | =0 for 60s | SEV2 (page) | PagerDuty + compliance lead |
| Stripe webhook signature failure | >1% 10min | SEV2 (page) | PagerDuty + Phyrom |
| Auth failure rate | >5× baseline 5min | SEV2 (page) | PagerDuty + compliance lead |
| Cloudflare WAF block spike | >10× baseline 10min | SEV3 (warn) | #security Slack |
| Synthetic key journey failure | >2 consecutive failures | SEV2 (page) | PagerDuty |
| Synthetic sign-in failure | >3 consecutive failures | SEV2 (page) | PagerDuty |

### 9.2 Cost monitoring alerts

| Threshold | Severity | Notify |
|-----------|----------|--------|
| Monthly Datadog spend > $1K | Warn | Phyrom email |
| Monthly Datadog spend > $2K | Warn + #ops Slack | Phyrom + ops |
| Monthly Datadog spend > $5K | Page | Phyrom + ops; trigger usage review |
| Single-day spend spike > $200 | Page | Phyrom; cardinality investigation |
| Log ingest > 100GB/day | Warn | Investigate noisy source |

### 9.3 Notification routing

- **PagerDuty integration**: Datadog → PagerDuty webhook; service mapping per severity
- **Slack channels**:
  - `#alerts-prod` — all SEV2/3 alerts
  - `#alerts-cost` — cost alerts
  - `#alerts-security` — auth + WAF alerts
- **Email**: Phyrom for all SEV1 + cost alerts

## 10. Initial Provisioning Checklist

```
□ Datadog org created (sherpa-pros, US1 region)
□ Pro plan selected with $1K/mo cap
□ SAML SSO configured (Okta or Google Workspace)
□ RBAC roles per Section 2.2
□ Vercel integration installed + verified
□ dd-trace auto-instrumentation confirmed
□ Critical-path custom spans deployed
□ PII scrubbing rules deployed at agent + processor
□ Audit log dual-write configured (DB + Datadog)
□ Custom business metrics emitted from app
□ RUM SDK in production
□ Synthetics for 8 key journeys
□ All alerts from Section 9.1 + 9.2 configured
□ PagerDuty integration verified (test page)
□ Slack channels created + integration verified
□ Cost cap enforcement confirmed
□ Day-1 dashboards (D1-D8) created per 10-day-1-dashboards-spec.md
□ Vanta integration with Datadog enabled (read-only API key)
```

## 11. OpenTelemetry Crossover Plan (Phase 4 trigger)

When MAU > 1M OR Datadog spend > $15K/mo:

- [ ] Stand up OpenTelemetry Collector in parallel with Datadog
- [ ] Dual-emit traces + metrics for 30 days
- [ ] Validate parity between Datadog and OTel pipelines
- [ ] Build Grafana + Tempo + Loki + Prometheus stack on AWS or Grafana Cloud
- [ ] Migrate dashboards from Datadog → Grafana
- [ ] Migrate alerts from Datadog → Grafana Alerting + PagerDuty
- [ ] 30-day soak; Datadog stays as backup
- [ ] Decommission Datadog after Phyrom + SRE sign-off

Detailed in platform-scale spec WS6.

## 12. Maintenance

- **Owner**: SRE / Compliance lead (Phyrom interim)
- **Review cadence**: Quarterly cost + monitor tuning
- **Effective date**: 2026-06-01
