---
title: Day-1 Datadog Dashboards Specification
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - docs/operations/soc2-readiness/09-datadog-provisioning-runbook.md
  - docs/operations/soc2-readiness/06-incident-response-procedures.md
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
soc2_controls: [CC7.1, CC7.2]
---

# Day-1 Datadog Dashboards Specification

## 1. Purpose

Defines the eight Day-1 dashboards required for Sherpa Pros production observability, monitoring, and SOC 2 evidence. All dashboards provisioned via Datadog Terraform provider for version control and reproducibility.

## 2. Conventions

- All dashboards use a shared template variable bar: `env`, `metro`, `trade_category`, `pro_tier`, `time_range`
- Default time range: **last 4 hours**
- Each dashboard has saved views for: 1h, 24h, 7d, 30d
- Each panel cites the metric name, tag dimensions, and link to relevant runbook
- Threshold lines drawn for SLO targets (green/yellow/red bands)

---

## D1: Dispatch Latency

**Purpose**: Track time-to-pro-match performance. The dispatch loop is our core differentiator vs Angi/Thumbtack.

**Owner**: Engineering — dispatch lead

**SLO**: P95 < 500ms within metro; P99 < 1s

| Panel | Metric | Type | Tags / Filters | Time ranges |
|-------|--------|------|----------------|-------------|
| Latency timeseries | `sherpa.dispatch.match_latency_ms` | line; P50/P95/P99 | by `metro`, `trade_category` | 1h / 24h / 7d / 30d |
| Latency by metro (top 10) | same | bar (P95) | groupby `metro`, top 10 | 24h |
| Latency by trade category | same | heatmap | groupby `trade_category` | 24h |
| Sherpa-score recompute time | `sherpa.dispatch.score_compute_ms` | line; P50/P95 | n/a | 24h |
| Match-set size distribution | `sherpa.dispatch.match_set_size` | histogram | n/a | 24h |
| Failed dispatch count | `sherpa.dispatch.failure` (count) | timeseries | by `reason` | 24h |
| Slow-dispatch trace samples | APM trace search `service:sherpa-pros-app operation:dispatch.match_pros @duration:>500ms` | log/trace stream | live | 1h |

**Drill-down**: Click any P95 spike → APM trace explorer pre-filtered to that minute window.

**Alerts wired**: P95 >500ms 5min (SEV3); P95 >1s 5min (SEV2). See `09-datadog-provisioning-runbook.md`.

---

## D2: Payment Success Funnel

**Purpose**: End-to-end payment flow visibility. Stripe Connect escrow is mission-critical; any silent failure costs trust + revenue.

**Owner**: Engineering — payments lead

**SLO**: Payment intent → succeeded conversion >95%; webhook signature verification 100%

| Panel | Metric | Type | Filters | Time ranges |
|-------|--------|------|---------|-------------|
| Funnel | `sherpa.payment.intent_created` → `sherpa.payment.intent_succeeded` → `sherpa.escrow.held` → `sherpa.escrow.released` | funnel viz | last 24h | 1h / 24h / 7d / 30d |
| Drop-off rate per stage | derived from funnel counts | bar | n/a | 24h |
| Payment failure count by reason | `sherpa.payment.failure` | timeseries stacked | by `reason` (Stripe error code) | 24h |
| Webhook signature failure | `sherpa.stripe.webhook_signature_failure` | timeseries | n/a | 24h |
| Escrow balance | `sherpa.escrow.balance_cents` | line gauge | n/a | 7d |
| Refund count | `sherpa.payment.refund_initiated` | timeseries | by `reason` | 7d |
| Time-to-payout for pros | `sherpa.payout.completion_seconds` | distribution | by `pro_tier` | 7d |
| Stripe API error rate | `sherpa.external.stripe_api_error` | timeseries | by `endpoint` | 24h |

**Drill-down**: Funnel drop-off → trace search for last 100 failed sessions.

**Alerts wired**: Payment success rate <95% 10min (SEV1); webhook signature failure >1% (SEV2).

---

## D3: Job Creation Funnel

**Purpose**: Two-sided marketplace funnel — job posted by homeowner all the way to payment release.

**Owner**: Product + Engineering

**SLO**: Posted → bid received >80% within 30 min; accepted → completed >90%

| Panel | Metric | Type | Filters | Time ranges |
|-------|--------|------|---------|-------------|
| Full funnel | `sherpa.job_funnel.posted` → `bid_received` → `bid_accepted` → `job_started` → `job_completed` → `payment_released` | funnel viz | by `metro` | 24h / 7d / 30d |
| Drop-off per stage | derived | bar with % | n/a | 7d |
| Time-in-stage P50/P95 | per-stage timing metrics | line | by stage | 7d |
| Funnel by metro | same | small multiples | top 10 metros | 7d |
| Funnel by trade | same | small multiples | top 10 trades | 7d |
| Cancellation rate | `sherpa.job.cancelled` | timeseries | by `cancel_reason` | 7d |
| Re-bid rate (pro re-bids accepted) | `sherpa.bid.rebid` | timeseries | n/a | 7d |
| Conversion: posted → released | derived | gauge | n/a | 30d |

**Drill-down**: Click any stage drop-off → list of dropped sessions with deep links to session replay.

---

## D4: Pro Response Rate

**Purpose**: Marketplace health indicator. Slow pro response = poor homeowner experience. Tier-based response rate is the foundation of Sherpa Score.

**Owner**: Marketplace ops

**SLO**: Founding tier <5min P50; Gold <15min P50; Silver <60min P50; Bronze <4hr P50

| Panel | Metric | Type | Filters | Time ranges |
|-------|--------|------|---------|-------------|
| Response time distribution | `sherpa.bid.response_time_seconds` | histogram | by `pro_tier` | 24h / 7d / 30d |
| Response time P50 by tier | same | line | groupby `pro_tier` | 7d |
| Response rate (% of dispatched jobs answered) | `sherpa.dispatch.responded / sherpa.dispatch.sent` | percentage line | by `pro_tier` | 7d |
| Pros active in last 24h | `sherpa.pro.active` | gauge | by `metro`, `tier` | 24h |
| Pros without response in 7d | `sherpa.pro.dormant_count` | bar | by `metro`, `tier` | 7d |
| First-bid race time | `sherpa.bid.first_bid_seconds` | distribution | by `metro` | 7d |
| Founding-tier exclusive window respect | `sherpa.dispatch.tier_window_violation` | timeseries | n/a | 7d |
| Per-pro response rate top/bottom 20 | per-pro tag aggregation | table | groupby `pro_id` | 30d |

**Drill-down**: Per-pro table → pro profile + history of dispatches.

---

## D5: Audit Log Ingestion

**Purpose**: Audit log writes are SOC 2 evidence. Any drop-to-zero is a SEV2. Action-type breakdown surfaces unusual activity.

**Owner**: Compliance lead

**SLO**: Audit log write rate never drops to 0 for >60 seconds during business activity

| Panel | Metric | Type | Filters | Time ranges |
|-------|--------|------|---------|-------------|
| Total audit log write rate | `sherpa.audit_log.write` | timeseries | n/a | 1h / 24h / 7d |
| Writes by action type | same | stacked timeseries | groupby `action` | 24h |
| Top 20 actions (24h) | same | table | groupby `action`, count | 24h |
| Anomaly detection: write rate | Datadog Anomaly Monitor | line with anomaly band | n/a | 24h |
| Decryption events (Tier 1) | `sherpa.audit_log.write` filtered `action:data.decrypt.tier1` | timeseries | by `actor_role`, `resource_type` | 24h |
| Privileged actions | filter `action:account.* OR action:role.* OR action:deploy.*` | timeseries + table | groupby `actor_user_id` | 7d |
| Failed audit writes (DB error) | `sherpa.audit_log.write_failure` | timeseries | n/a | 24h |
| Audit log table row count | `sherpa.db.audit_logs.row_count` | line gauge | n/a | 30d |

**Drill-down**: Anomaly spike → log explorer pre-filtered to that minute with `audit:true` tag.

**Alerts wired**: write rate=0 for 60s (SEV2); write_failure>0 (SEV2).

---

## D6: Error Rate per Route

**Purpose**: Surfaces failing user-facing endpoints. Per-route slicing isolates regressions.

**Owner**: Engineering on-call

**SLO**: Per-route 5xx rate <1%; per-route 4xx rate <5% (excluding auth challenges)

| Panel | Metric | Type | Filters | Time ranges |
|-------|--------|------|---------|-------------|
| Overall error rate | `trace.http.request.errors / trace.http.request.hits` | percentage line | n/a | 1h / 24h |
| 5xx rate per route | same filtered status:5* | timeseries | groupby `resource_name` | 24h |
| 4xx rate per route | same filtered status:4* | timeseries | groupby `resource_name` | 24h |
| Top 20 error routes (5xx) | same | table | groupby `resource_name` desc count | 24h |
| Top 20 error routes (4xx) | same | table | groupby `resource_name` desc count | 24h |
| Top exceptions (last 1h) | error tracking | error issue list | n/a | 1h |
| New errors introduced (last deploy) | error tracking filtered by `version` | issue list | last deploy SHA | since deploy |
| Status code distribution | trace request count | pie | groupby `status_code` | 24h |

**Drill-down**: Any error route → APM trace search → individual trace flame graph.

**Alerts wired**: per-route 5xx >5% 5min (SEV2).

---

## D7: DB Connection Pool Saturation

**Purpose**: Neon connection-pool exhaustion is one of the most common scaling outages for serverless apps. Early detection prevents incidents.

**Owner**: Engineering — DB lead

**SLO**: Pool utilization <70% sustained; query P95 <100ms

| Panel | Metric | Type | Filters | Time ranges |
|-------|--------|------|---------|-------------|
| Pool utilization % | `sherpa.db.connection_pool.utilization_pct` | line gauge | by `pool_endpoint` | 1h / 24h |
| Active connections | `sherpa.db.connections.active` | line | by `endpoint` | 24h |
| Idle connections | `sherpa.db.connections.idle` | line | n/a | 24h |
| Connection acquisition latency P95 | `sherpa.db.connection.acquire_ms` P95 | line | n/a | 24h |
| Query duration P50/P95/P99 | `trace.pg.query.duration` | line | n/a | 24h |
| Slow query log (>500ms) | trace search `service:sherpa-pros-app @sql.duration:>500` | trace stream | live | 1h |
| Top 20 slowest queries (24h) | same | table | groupby `sql.statement` desc P95 | 24h |
| Neon plan utilization | `neon.compute.cu_seconds` | line | n/a | 7d |
| Connection errors | `sherpa.db.connection.error` | timeseries | by `error_type` | 24h |

**Drill-down**: Pool spike → query log filtered to that window for top consumers.

**Alerts wired**: utilization >80% 10min (SEV3); >95% 5min (SEV2).

---

## D8: Sherpa Score Distribution

**Purpose**: Sherpa Score is the marketplace's reputation primitive. Distribution shape, drift, and outliers tell us about marketplace health and any scoring bugs.

**Owner**: Marketplace ops + Engineering

**SLO**: Score distribution stable week-over-week; tier ratios within target bands

| Panel | Metric | Type | Filters | Time ranges |
|-------|--------|------|---------|-------------|
| Score histogram (current) | query `pros.sherpa_score` | histogram | n/a | snapshot |
| Score distribution by tier | same | bar | groupby `tier` | snapshot |
| Tier breakdown count | same | pie + counts | tier: Founding / Gold / Silver / Bronze / Flex | snapshot |
| Score change events (last 24h) | `sherpa.score.changed` | timeseries | by `change_reason` | 24h |
| Average score by metro | derived | bar (top 10) | by `metro` | snapshot |
| Score-trigger events (job complete, dispute, no-show) | `sherpa.score.trigger` | stacked timeseries | by `trigger_type` | 7d |
| Pros at tier boundaries (within 5 pts of next/prev tier) | derived | table | groupby `pro_id` | snapshot |
| Score recompute job duration | `sherpa.score.recompute_seconds` | line | n/a | 7d |
| Score drift week-over-week | derived | line | n/a | 30d |

**Drill-down**: Per-pro click → pro profile + score history audit trail.

---

## 3. Provisioning via Terraform

```hcl
# terraform/datadog/dashboards.tf (illustrative)
resource "datadog_dashboard_json" "d1_dispatch_latency" {
  dashboard = file("${path.module}/dashboards/d1-dispatch-latency.json")
}

resource "datadog_dashboard_json" "d2_payment_funnel" {
  dashboard = file("${path.module}/dashboards/d2-payment-funnel.json")
}

# ... d3 through d8

# Shared template variables module
module "shared_template_vars" {
  source = "./modules/template-vars"
}
```

Dashboard JSON exported from Datadog UI then committed; changes via PR per `05-change-management-policy.md`.

## 4. Acceptance Criteria

- [ ] All 8 dashboards live in production Datadog
- [ ] All dashboards loaded via Terraform
- [ ] All dashboards include shared template variables
- [ ] All dashboards have saved 1h / 24h / 7d / 30d time-range views
- [ ] All threshold lines reflect SLO targets
- [ ] All alerts referenced wire to PagerDuty + Slack
- [ ] Compliance read-only role can view all 8 dashboards
- [ ] Vanta evidence collection includes weekly screenshots of D5 (Audit Log Ingestion) as control evidence

## 5. Maintenance

- **Owner**: SRE / Compliance lead (Phyrom interim) for D5; Engineering owners per dashboard for others
- **Review cadence**: Monthly during Phase 1, quarterly Phase 2+
- **Change control**: Edits via PR → Terraform plan → apply via CI/CD
