# Platform Scale Architecture — Sherpa Pros Phase 4+ Infrastructure Design

> "Every Pro verified. Every project validated. Every region resilient. The marketplace that scales like Stripe and stays compliant like Plaid."

**Repo:** `hjdb2424/sherpa-pros-platform`
**Date:** 2026-04-25
**Status:** Approved — staged rollout starts Q3 2026
**Author:** Backend Architect (advisor to Phyrom)
**Companion plan:** `docs/superpowers/plans/2026-04-25-platform-scale-architecture-plan.md`
**Related specs:** `docs/superpowers/specs/2026-04-13-sherpa-pros-platform-design.md` (MVP), `docs/superpowers/specs/2026-04-25-rbac-roles-dispatch-marketing-design.md` (RBAC)

---

## 1. Executive Summary

### Current State (Q2 2026)

Sherpa Pros runs as a single-region Next.js 16 application on Vercel (US-East default region), backed by a single Neon Postgres primary (us-east-1) with PostGIS for geospatial dispatch. Authentication is fully managed by Clerk. Payments run through Stripe Connect Express. Masked communication runs through Twilio. The platform has shipped 6 products plus 8 platform capabilities (14 brand surfaces) including Sherpa Guard (RBAC + audit logs), Sherpa Dispatch (multi-trade coordination), Sherpa Materials (codes engine + Zinc API + Uber Direct), and Sherpa Mobile (TestFlight build via Expo).

Phase 1 target: ~10,000 monthly active users (MAU), ~1,000 jobs per month, US-only, single primary region. Current architecture comfortably handles this load with significant headroom.

### Target State (Phase 4, late 2028)

- **Geography:** Multi-region across US-East, US-West, Canada (ca-central-1), European Union (eu-central-1), United Kingdom (eu-west-2), and Australia (ap-southeast-2)
- **Scale:** 1M+ MAU at Phase 4A entry, growing toward 5M+ MAU by Phase 4D
- **Compliance:** Service Organization Control 2 (SOC 2) Type 2 certified, General Data Protection Regulation (GDPR) compliant, Personal Information Protection and Electronic Documents Act (PIPEDA) compliant, UK GDPR compliant, Australian Privacy Principles (APP) compliant
- **Reliability:** 99.95% uptime Service Level Agreement (SLA), Recovery Point Objective (RPO) of 15 minutes, Recovery Time Objective (RTO) of 4 hours regional, 24 hours catastrophic
- **Performance:** Sub-200ms P95 dispatch latency from any supported region, sub-2s P95 payment success, sub-500ms P95 API responses globally

### Migration Philosophy

**Incremental, not big-bang.** Every architectural change ships behind a feature flag, runs in shadow mode, and graduates to production only after observability confirms parity. Vercel Rolling Releases plus LaunchDarkly (or Vercel Edge Config for simple flags) make this safe. We never rewrite — we extend, measure, and harden.

The four-phase rollout (4A through 4D) maps cleanly onto the international expansion timeline (separate spec). SOC 2 Type 1 lands first (Q2 2027), Type 2 follows after a 12-month observation window (Q2 2028), and Canadian region setup (Phase 4B) is gated on Type 1 to satisfy enterprise property-management buyer requirements.

---

## 2. Current Architecture Inventory

### Stack As Deployed (April 2026)

```
                                  +------------------------+
                                  |      Vercel Edge       |
                                  |  (global CDN, default) |
                                  +-----------+------------+
                                              |
                                              v
+--------------+        +-----------------------------------+        +-----------------+
| Cloudflare?  |  -->   | Vercel Functions (Fluid Compute)  |  -->   |   Clerk Auth    |
|  (NOT YET)   |        | Next.js 16 App Router (Node 24)   |        |  (managed)      |
+--------------+        | src/app/api/* + middleware.ts     |        +-----------------+
                        | Sherpa Guard RBAC at edge         |
                        +------+----------+--------+--------+
                               |          |        |
                               v          v        v
                        +----------+ +--------+ +--------+
                        |   Neon   | | Stripe | | Twilio |
                        | Postgres | |Connect | | masked |
                        | + PostGIS| | Express|  | SMS    |
                        | us-east-1| | (US)   | +--------+
                        | (single  | +--------+
                        |  primary)|
                        +----+-----+
                             |
                             v
                        +----------+
                        | Drizzle  |
                        |   ORM    |
                        +----------+
```

### Layer Breakdown

| Layer | Component | Status | Scale Concern |
|---|---|---|---|
| Edge | Vercel global CDN | Solid | None at current load |
| Compute | Vercel Functions (Fluid Compute, Node 24 LTS, 300s timeout default) | Solid | Cold-start risk above 100 RPS sustained |
| Auth | Clerk-managed (Google OAuth, email link) | Solid | Pricing scales linearly past 10K MAU; revisit at 100K |
| Routing | Next.js 16 App Router middleware (`src/middleware.ts`) — Sherpa Guard RBAC | Solid (just shipped) | Middleware runs Node.js (not Edge) per Vercel knowledge update — full library access available |
| Data | Neon Postgres + PostGIS, single primary us-east-1 | Solid for Phase 1, single point of failure | No read replicas, no cross-region failover, no formal sharding |
| ORM | Drizzle (TypeScript schema in `src/db/drizzle-schema.ts`) | Solid | Schema is well-designed; partitioning needs planning |
| Migrations | Raw SQL in `src/db/migrations/00X_*.sql` | Solid | 010 migrations shipped; need automated forward/back testing |
| Audit | `audit_logs` table (migration 008) plus `src/lib/audit.ts` helper | Solid (Sherpa Guard) | Will need partitioning past ~100M rows |
| Dispatch | `src/lib/dispatch/` (multi-trade, materials, deliveries) | Solid (just shipped) | Latency budget needs measurement under multi-region load |
| Payments | Stripe Connect Express (US-only) | Solid for US | Need per-country Stripe Connect platforms for international |
| Messaging | Twilio masked SMS (auto-fallback to mock) | Solid | Twilio Messaging Service per region for international |
| Maps | Google Maps JavaScript API + `@vis.gl/react-google-maps` | Solid | Quota review at 100K+ MAU |
| Mobile | Expo + EAS, iOS TestFlight (`com.thesherpapros.app`), Android via Expo | Solid | Native push notifications (Apple Push Notification Service / APNS, Firebase Cloud Messaging / FCM) needed at scale |
| Observability | Vercel built-in logs + analytics, no APM, no synthetic monitors | **Gap** | Critical for SLA enforcement |
| Rate limiting | Vercel default per-deployment limits | **Gap** | No per-user, per-endpoint, or per-tier policy |
| WAF | None | **Gap** | DDoS exposure at launch day |
| Secrets | Vercel environment variables | OK for now | Migrate to dedicated secrets manager at Phase 3 scale |
| Backup | Neon Point-in-Time Recovery (PITR) 7 days on Pro plan | **Gap** for compliance | RPO formalization needed |
| Disaster recovery | None documented | **Gap** | Required before Type 1 audit |

### What Is Solid

The foundational schema, the Sherpa Guard RBAC + audit log primitives (migrations 008-010), the Drizzle-typed query layer, the Clerk auth boundary, and the lazy Stripe initialization pattern all set us up well for scale. The team has been disciplined about server-component-first rendering and integer-cents money handling. These are not the things that need to evolve.

### What Needs To Evolve

Single-region database, no read replicas, no formal observability, no rate limiting beyond Vercel defaults, no Web Application Firewall (WAF), no formal disaster recovery (DR) plan, no compliance posture beyond ad-hoc good practice. Each is addressed below.

---

## 3. Multi-Region Strategy

We grow regionally in four phases, gated on traction and compliance milestones rather than calendar dates. Each phase adds compute and data in a new geography, leaves the previous regions untouched, and keeps PII jurisdictional.

### Phase 4A — US-West Expansion (Months 19-24)

**Trigger:** Sustained traffic from west-coast metros (LA, San Francisco Bay, Seattle, Phoenix) crossing 15% of total dispatch volume, or P95 dispatch latency from those regions exceeding 400ms.

**Scope:**
- Add Vercel automatic regional routing (Vercel handles this with Fluid Compute — functions execute in the region closest to the user)
- Add Neon read replica in `us-west-2` (Oregon) for read-heavy traffic (Pro search, job-listing browse, dashboards)
- Keep Neon primary in `us-east-1` for all writes; writes always route to primary, reads route to nearest replica via Drizzle replica-aware client
- No data residency boundary — US data is one logical jurisdiction

**Why now:** Most cost-effective scale move. Vercel handles compute regionalization automatically. Neon read replicas are a managed-service config change, not a migration.

### Phase 4B — Canada (Months 25-30)

**Trigger:** SOC 2 Type 1 certified (gating requirement for Canadian PM enterprise sales), and Canadian beta cohort committed (10+ Canadian pros recruited via Toronto/Vancouver hubs).

**Scope:**
- New Neon database in `ca-central-1` (Montreal) — separate database, NOT a replica of US primary
- Vercel functions execute in Canadian region for Canadian traffic
- Stripe Connect platform registered in Canada (separate from US platform — Stripe requires per-country platform accounts)
- Twilio Canadian phone numbers + Canadian Messaging Service
- All Canadian PII (users, jobs, audit logs, materials, deliveries) stays in Canada per PIPEDA
- Codes engine (provincial building codes for Ontario, Quebec, BC) deployed as global read-only via CDN — no PII

**Cross-region access pattern:** Phyrom (US-based admin) viewing the Canadian admin panel reads through a routed admin proxy that respects data-residency rules. Aggregate analytics (count of jobs, count of users) are anonymized and pushed nightly to a US analytics warehouse via cross-border data-processing agreement (signed with Canadian customers at sign-up).

### Phase 4C — European Union (Months 31-36)

**Trigger:** EU partner secured (likely a Spanish or German construction-industry partner per the international expansion spec), and SOC 2 Type 2 certified (most EU enterprise buyers require it for vendor onboarding).

**Scope:**
- New Neon database in `eu-central-1` (Frankfurt) — separate database
- Vercel functions in EU region
- Stripe Connect platform for EU (covers SEPA, supports per-country payouts via Connect)
- Twilio EU Messaging Service (German, French, Spanish, Italian phone numbers)
- All EU PII stays in EU per GDPR Articles 44-49 (cross-border transfer rules)
- Cookie consent and Data Subject Access Request (DSAR) flow added across all EU surfaces (defer details to International Expansion spec)
- Codes engine extended with EU building-code metadata (Eurocodes plus per-country amendments)

### Phase 4D — UK + Australia (Months 37-42)

**Trigger:** Phase 4C operationally stable for 6+ months; international team (Sherpa Hub International or franchise model — see those specs) in place.

**Scope:**
- UK: Either Neon `eu-west-2` (London) — UK GDPR substantially mirrors EU GDPR, but post-Brexit UK is a separate jurisdiction. Recommend separate UK database to future-proof against any UK-specific data laws.
- Australia: Neon `ap-southeast-2` (Sydney). Australian Privacy Act 1988 + Australian Privacy Principles. Distance from US/EU regions makes single-region critical for latency.

### Per-Region Service Map

| Service | US | Canada | EU | UK | AU |
|---|---|---|---|---|---|
| Authentication (Clerk) | Global | Global | Global (EU instance) | Global | Global |
| Compute (Vercel) | Multi-region (East+West) | Regional | Regional | Regional | Regional |
| Primary database (Neon) | us-east-1 + us-west-2 replica | ca-central-1 | eu-central-1 | eu-west-2 | ap-southeast-2 |
| Payments (Stripe Connect) | US platform | CA platform | EU platform | UK platform | AU platform |
| Messaging (Twilio) | US Messaging Service | CA Messaging Service | EU Messaging Service | UK Messaging Service | AU Messaging Service |
| Codes engine ("Sherpa codes engine") | Global read-only via CDN | Global read-only via CDN | Global read-only via CDN | Global read-only via CDN | Global read-only via CDN |
| Materials engine ("Sherpa Materials engine") | US (Zinc API + Uber Direct) | CA (separate supplier integrations) | EU (regional suppliers, defer to international spec) | UK | AU |
| Maps (Google) | Global | Global | Global | Global | Global |
| Mobile (Expo / EAS) | Global build, regional API endpoints | | | | |

**Global-vs-regional rule:** Anything containing PII is regional. Anything that does not (codes, brand assets, marketing pages, Sherpa codes engine read-only metadata) is global via CDN.

---

## 4. Database Scaling Strategy

### Sharding Decision: Shard by `metro_id`

**Recommendation: shard by metro_id (each Hub or operational metro = one logical shard) starting in Phase 4A pilot, fully rolled out by Phase 4B.**

Why metro_id beats alternatives:
- **By user_id:** Loses geospatial locality. Dispatch queries (PostGIS `ST_DWithin`) must hit one shard, not 30.
- **By tenant_id:** No multi-tenancy concept in Sherpa Pros — each user is independent.
- **By region:** Too coarse. New England would be one shard at 5M+ users; we'd shard the shard later.
- **By metro_id:** Natural locality (a Boston job involves Boston pros and Boston materials). Cross-metro joins are rare. Hubs map cleanly to shards. Sherpa Hub spec already treats metro as a first-class concept.

**Implementation path: Citus extension on Postgres (recommended) over pg_partman + Foreign Data Wrapper (FDW).**

Citus is a Postgres extension (not a separate database) that automatically distributes tables across worker nodes, supports cross-shard SELECTs transparently, and is now first-class on Neon (via the Citus-on-Neon beta as of late 2025). The pg_partman + FDW alternative requires hand-rolling cross-shard joins and is brittle past ~50 shards.

```sql
-- Phase 4A: enable Citus on the primary (Neon Citus tier)
CREATE EXTENSION citus;

-- Distribute the jobs table by metro_id
SELECT create_distributed_table('jobs', 'metro_id');

-- Distribute related tables along the same key (co-located shards)
SELECT create_distributed_table('bids', 'metro_id', colocate_with => 'jobs');
SELECT create_distributed_table('dispatch_events', 'metro_id', colocate_with => 'jobs');
SELECT create_distributed_table('materials_orders', 'metro_id', colocate_with => 'jobs');
SELECT create_distributed_table('deliveries', 'metro_id', colocate_with => 'jobs');

-- Reference tables (read-only, replicated to every node)
SELECT create_reference_table('skills_catalog');
SELECT create_reference_table('codes_metadata');
SELECT create_reference_table('hubs');
```

### Cross-Shard Audit Log Queries

The one place cross-shard joins are unavoidable is the audit log (admin reviewing all sign-ins for a user across metros). Solution: keep `audit_logs` as a **reference table** in Citus (replicated to every node — small enough to not hurt write throughput) until it grows past ~50M rows, then move to weekly partitioning + a read replica dedicated to compliance queries.

### Read Replicas Per Region

Every region gets at least one read replica in addition to the primary. Replica routing happens at the ORM layer:

```typescript
// src/db/index.ts — replica-aware Drizzle client
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const primary = neon(process.env.DATABASE_URL_PRIMARY!);
const replica = neon(process.env.DATABASE_URL_REPLICA!);

export const dbWrite = drizzle(primary);
export const dbRead = drizzle(replica);

// Convention: dbWrite for INSERT/UPDATE/DELETE, dbRead for SELECT
// Exception: read-after-write — use dbWrite for SELECT immediately after INSERT
```

### Connection Pooling

Neon's built-in pooler (PgBouncer-compatible, transaction mode) handles Phase 1-3 scale. For Phase 4+ when concurrent connections exceed 10K, add a self-managed PgBouncer in front of Neon for finer pool tuning (per-region, per-application-tier pools). Vercel Functions are inherently bursty — the pooler matters more than the database.

### Hot / Warm / Cold Tiering

| Tier | Age | Storage | Access Pattern |
|---|---|---|---|
| Hot | 0-90 days | Primary database (Neon) | Synchronous reads + writes |
| Warm | 90-365 days | Archive read replica (Neon, read-only) | Async reads (dashboards, reports) — query latency target <2s |
| Cold | 365+ days | S3 archive (Parquet + Iceberg metadata) | Restore-on-demand for compliance queries; query latency target <60s |

Migration daemon runs nightly: copies rows past 90 days from hot to warm (UPDATE SET in place via partition swap), copies rows past 365 days to S3 + DELETE from warm, and emits an `archive_event` audit log entry per row archived. Restore path: a single CLI command pulls a date range back into a temporary Postgres table for compliance-team review.

### Materialized Views For Analytics

Dashboards (admin investor-metrics, hub manager performance, pro-leaderboard) read from materialized views, not raw tables. Refresh nightly at 02:00 UTC per region.

```sql
CREATE MATERIALIZED VIEW mv_hub_metrics_daily AS
SELECT
  hub_id,
  date_trunc('day', created_at) AS day,
  COUNT(*) FILTER (WHERE status = 'completed') AS jobs_completed,
  SUM(amount_cents) FILTER (WHERE status = 'completed') AS gmv_cents,
  AVG(EXTRACT(EPOCH FROM (matched_at - created_at))) AS avg_dispatch_seconds_p50,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (matched_at - created_at))) AS dispatch_seconds_p95
FROM jobs
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY hub_id, day;

CREATE INDEX ON mv_hub_metrics_daily (hub_id, day DESC);
```

### Partitioning Strategy

| Table | Partition By | Partition Cadence | Retention |
|---|---|---|---|
| `jobs` | `created_at` | Monthly | 7 years (legal hold) |
| `audit_logs` | `created_at` | Weekly | 7 years default, 10 years for PM-tier opt-in |
| `messages` (Sherpa Threads) | `conversation_id` (hash) | 32 hash buckets | 7 years default, 10 years for PM opt-in |
| `dispatch_events` | `created_at` | Monthly | 2 years (operational), then archive |
| `materials_orders` | `created_at` | Monthly | 7 years (financial) |
| `deliveries` | `created_at` | Monthly | 3 years |
| `bids` | `job_id` (hash) | 16 hash buckets | Tied to job retention |
| `payments` | `created_at` | Monthly | 7 years (financial) |

Partition creation runs ahead 3 months via cron job (Vercel Cron Job hitting a `/api/admin/maintenance/create-partitions` endpoint, idempotent). Old partitions detached and archived per the cold-tier policy above.

---

## 5. API Gateway, Rate Limiting, and DDoS Protection

### Stack Recommendation

```
Public traffic
      |
      v
+-------------------+
|   Cloudflare Pro  |  -- WAF rules, DDoS mitigation, per-IP throttling
+-------------------+
      |
      v
+-------------------+
|   Vercel Edge     |  -- Vercel BotID at edge (GA Jun 2025 per knowledge update)
+-------------------+
      |
      v
+-------------------+
| Vercel Functions  |  -- Upstash Redis rate-limit middleware (per-user, per-tier)
+-------------------+
      |
      v
+-------------------+
| Sherpa Guard RBAC |  -- src/middleware.ts (already shipped)
+-------------------+
```

### Rate Limiting via Upstash Redis at the Edge

Recommend Upstash Redis (serverless, edge-replicated, pay-per-request) over Redis on Vercel Marketplace for cost predictability and global availability. Implementation in `src/middleware.ts`:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const tiers = {
  anonymous: new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(60, '1 m') }),
  client:    new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(300, '1 m') }),
  pro:       new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(1000, '1 m') }),
  pm_admin:  new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(3000, '1 m') }),
  // Integration partners: custom limits provisioned per contract via API
};

// In middleware.ts (after Sherpa Guard RBAC tier resolution):
const limiter = tiers[userTier ?? 'anonymous'];
const { success, remaining, reset } = await limiter.limit(`${userTier}:${userId ?? ip}`);
if (!success) {
  return new Response('Rate limited', { status: 429, headers: { 'Retry-After': String(reset) } });
}
```

### Per-Tier Rate Limits

| Tier | Requests / minute | Burst | Notes |
|---|---|---|---|
| Anonymous (no auth) | 60 | 90 | Per-IP, mostly marketing pages |
| Authenticated client | 300 | 450 | Job posting, bid review, messaging |
| Pro | 1000 | 1500 | High-frequency dashboard polling, photo uploads |
| PM admin | 3000 | 4500 | Bulk operations, multi-property dashboards |
| API integration partner | Custom | Custom | Per-contract, provisioned via admin UI |

Limits surface to clients as `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` response headers.

### DDoS Protection — Cloudflare Pro in Front of Vercel

Cloudflare Pro ($20/mo per zone) gives us: layer-3/4 DDoS auto-mitigation, layer-7 challenge for suspicious traffic, custom WAF rules, country-level blocking (we never expect Russia/North Korea traffic — soft-block). Cloudflare and Vercel both terminate TLS; we configure Cloudflare in "full strict" mode with origin certificates so the edge-to-origin hop is also encrypted.

Cloudflare Enterprise upgrade ($5K/mo) becomes worthwhile at Phase 4B+ for: priority routing, dedicated support during incident, and custom argo-tunnel options.

### WAF Rules (Day 1)

| Rule | Action | Notes |
|---|---|---|
| Block known SQL injection patterns | Block | OWASP managed ruleset |
| Block known Cross-Site Scripting (XSS) patterns | Block | OWASP managed ruleset |
| Block HTTP request smuggling | Block | OWASP managed ruleset |
| Rate-limit POST /api/jobs to 10/min/IP | Challenge | Anti-spam job creation |
| Rate-limit POST /api/auth to 5/min/IP | Block | Anti-credential-stuffing |
| Block User-Agent matching scrapers (`scrapy`, `wget` outside allowlist) | Challenge | Allows legitimate curl/postman with auth header |
| Block requests missing `Origin` header on `/api/*` | Block | Browser-issued requests always have Origin |
| Geographic block: countries with no Sherpa Pros service AND no inbound business | Block | Configurable via Cloudflare Edge Config |

### Vercel BotID

Vercel BotID (GA June 2025 per the knowledge update) provides edge-level bot scoring without requiring CAPTCHA. We enable it on:
- `/sign-up` (block bot account creation)
- `POST /api/jobs` (block scraped job-posting attempts)
- `POST /api/waitlist` (block list spam)

Score threshold: 0.7 → challenge with Cloudflare Turnstile, 0.9 → block outright.

---

## 6. Observability Stack

### Recommendation: Datadog Through Phase 4A, Re-evaluate at 1M MAU

**Datadog wins on time-to-insight.** Single pane of glass for Application Performance Monitoring (APM), logs, metrics, Real User Monitoring (RUM), synthetic monitors, and Database Monitoring. Native Vercel integration. Native Postgres integration. Native Stripe integration. Pre-built dashboards for everything we use.

**Cost crossover happens around 1M MAU** (Datadog's per-host APM pricing plus log retention costs scale roughly linearly with traffic). At that point we re-evaluate OpenTelemetry → Grafana Cloud (open standards, cheaper at high volume, more setup work). Decision matrix:

| Stage | MAU | Monthly cost (estimated) | Recommendation |
|---|---|---|---|
| Phase 1-2 | <100K | $300-1,500/mo | Datadog Free tier through Pro tier |
| Phase 3 | 100K-1M | $1,500-15,000/mo | Datadog Pro |
| Phase 4A+ | 1M-5M | $15K-60K/mo Datadog vs $5K-20K/mo OTel + Grafana Cloud | Run cost analysis; default OTel if Datadog crosses 4x Grafana cost |

### Required Dashboards (Day 1)

These ship before public Phase 4A launch:

1. **Dispatch latency dashboard** — P50/P95/P99 from job creation to first pro notification, per metro, per urgency tier (Emergency/Standard/Flexible), per shard. Alert on P95 > 500ms for 5 min.
2. **Payment success rate dashboard** — Stripe Connect transaction success / failure / refund per region per hour. Alert on success rate < 98% for 15 min.
3. **Job-creation funnel dashboard** — wizard step completion rates, drop-off per step, per source (web/mobile/PWA). Diagnoses UX regressions.
4. **Pro response rate dashboard** — % of dispatched pros who accept within urgency-tier window. Alert on response rate < 60% for 1 hour (signal of supply imbalance in a metro).
5. **Audit log ingestion rate dashboard** — count of `audit_logs` rows written per minute per action type. Alert on zero ingestion for 5 min (signals Sherpa Guard middleware regression).
6. **Error rate per route dashboard** — 5xx error rate per `/api/*` route, per region. Alert on >1% errors for 5 min.
7. **Database connection pool saturation** — pool utilization %, queue depth, slow query count. Alert on >80% saturation for 10 min.
8. **Cost dashboard** — daily Vercel invocation count, Neon compute-hours, Datadog ingestion volume, Stripe fees. Pages on-call when daily run-rate exceeds budget by 25%.

### Service Level Objectives (SLOs)

| SLO | Target | Measurement Window | Error Budget Burn Alerts |
|---|---|---|---|
| Uptime | 99.95% | 30 days | 25% / 50% / 75% / 100% burn rate |
| P95 dispatch latency | <500ms | 7 days | Alert at >700ms for 30 min sustained |
| P95 payment success | <2s | 7 days | Alert at >3s for 15 min sustained |
| Job-creation wizard completion | >85% | 7 days | Alert on >5% drop week-over-week |
| Audit log delivery success | 100% (zero loss) | Always | Alert on any single drop |

Error budget for 99.95% uptime over 30 days = ~21.6 minutes of allowed downtime. We page on-call when 25% of that budget burns in any rolling 24-hour window.

---

## 7. Site Reliability Engineering (SRE) Practices

### On-Call Rotation

Phase 1-3 (founding-team scale): Phyrom + 1 senior engineer share on-call, week-on / week-off. Sustainable only because traffic is low. Pages route to PagerDuty (recommended over Opsgenie for the better mobile experience and Slack integration).

Phase 4A entry: hire dedicated Site Reliability Engineer (#5 hire on platform team). Move to 5-engineer rotation, week-long shifts, formal handoff every Monday at 10:00 ET. Compensation: on-call pay $400/week passive + $200/page during business hours, $400/page after-hours, capped at $5K/week. Sustainable rotation requires minimum 5 humans — anything less is a burnout pipeline.

### Runbook Discipline

**Every alert has a runbook link in its description.** No exceptions. Runbooks live in `docs/runbooks/{slo-name}.md` and follow this template:

```markdown
# Runbook: <SLO violation name>

## Severity classification
SEV1 / SEV2 / SEV3 (criteria below)

## Detection
- Datadog alert: <link>
- Symptoms users see: <description>

## Immediate triage (first 5 minutes)
1. Confirm scope (region, % of users affected)
2. Check status pages: Vercel, Neon, Clerk, Stripe, Twilio, Cloudflare
3. Check recent deploys (vercel.com/sherpa-pros/deployments)
4. ...

## Mitigation
- Quick fix (rollback / feature-flag kill / scale-up)
- Long-term fix (link to follow-up issue)

## Comms
- Status page update template: <link>
- Customer email template (if SEV1): <link>

## Postmortem
- Required for SEV1 / SEV2 within 48 hrs
- Template: docs/templates/postmortem.md
```

### Incident Severity Classification

| Severity | Definition | Page Whom | SLA to Mitigate |
|---|---|---|---|
| SEV1 | Platform-wide outage OR data loss OR security breach affecting >100 users | Phyrom + on-call + CTO | 30 min ack, 2 hr mitigation |
| SEV2 | Regional outage OR core feature broken (dispatch, payments, sign-up) | On-call + manager | 1 hr ack, 4 hr mitigation |
| SEV3 | Degraded performance OR non-core feature broken | On-call | 4 hr ack, 24 hr mitigation |
| SEV4 | Cosmetic OR low-impact bug | Filed as ticket, no page | Next sprint |

### Postmortem Discipline (Blameless Culture)

Every SEV1/SEV2 gets a blameless postmortem within 48 hours, written by the on-call who handled it, reviewed by Phyrom, published internally. Template covers: timeline, root cause (5 whys), what went well, what went badly, action items with owner and due date. **No naming-and-shaming.** The goal is institutional learning, not individual punishment.

### Change Management

- **No Friday deploys.** Engineering culture rule, exceptions require written CTO approval.
- **Deploy windows:** Mon-Thu 10:00-16:00 ET. Off-hours deploys require on-call notification and feature flag.
- **Feature flags via Vercel Edge Config (simple flags) or LaunchDarkly (complex targeting).** Every new feature ships behind a flag; default off; gradual rollout 1% → 10% → 50% → 100% with observability check at each gate.
- **Rolling Releases via Vercel Rolling Releases** (managed feature) for big-bang deploys we can't avoid (database migration, dependency upgrade). Phased traffic shift with auto-rollback on error rate spike.
- **Deployment audit trail.** Every Vercel deployment links to git commit, PR, deployer identity, environment. Stored 7 years for SOC 2.

### Chaos Engineering (Phase 4B+)

Quarterly Game Day: controlled failure injection in a staging environment that mirrors production. Scenarios: kill primary database (test failover), kill one region's Vercel functions (test traffic shift), inject 500ms latency into Stripe webhook (test retry behavior), corrupt one row of `audit_logs` (test data integrity alarms). Document outcomes in runbooks. We hire chaos-engineering tooling (Gremlin or LitmusChaos) at Phase 4C.

---

## 8. SOC 2 Type 2 Readiness Checklist

Sherpa Guard (RBAC + audit logs, just shipped) and Clerk-managed auth give us a strong starting position. The full Type 2 controls map and remediation plan below.

### Recommended Vendors

- **Compliance automation:** Vanta (recommended) over Drata. Vanta has stronger Vercel + Neon + Clerk + Stripe integrations out of the box; Drata is slightly cheaper but more setup work.
- **Auditor:** Schellman (recommended) or A-LIGN. Both are AICPA-registered, both have construction-tech client experience. Schellman has better Datadog/Stripe integration.
- **Pen test firm:** Trail of Bits (premium) or Bishop Fox (premium-mid). Engaged annually, scope = full external + internal network + web app + mobile app.
- **Bug bounty:** HackerOne (recommended over Bugcrowd) — better signal-to-noise, better triage support.

### Timeline

- **Type 1:** Issuable in 90 days from Vanta engagement (controls implemented + observation period not required for Type 1)
- **Type 2:** Requires 12 months of operating effectiveness observation. Earliest achievable: Type 1 + 12 months = ~Q2 2028 if we start Type 1 work Q3 2026.

### Trust Service Criteria (TSC) Coverage

SOC 2 covers up to 5 TSC categories. We commit to **Security** (mandatory) plus **Availability** plus **Confidentiality** at Type 1. We add **Processing Integrity** (relevant to payments) and **Privacy** (relevant to GDPR alignment) at Type 2.

### Control Map

| Control Category | Status | Phase 4 Action |
|---|---|---|
| **Access management** | Sherpa Guard RBAC shipped | Quarterly access review (auto via Vanta), document principle of least privilege, MFA required for all admin |
| **Vendor management** | Ad-hoc | Catalog all vendors (Vercel, Neon, Clerk, Stripe, Twilio, Datadog, Cloudflare, Upstash, Vanta), collect SOC 2 reports annually, maintain Vendor Risk Register in Vanta |
| **Change management** | Git + PR review | Document PR-required policy, automated test gating in CI, deployment audit trail (Vercel logs), infrastructure change tickets in linear or Jira |
| **Incident response** | None documented | Document incident procedures (see SRE section above), run tabletop exercise quarterly, postmortem rigor enforced |
| **Security awareness training** | None | Annual mandatory training for all employees and contractors via KnowBe4 or Curricula. Includes phishing simulation. |
| **Encryption in transit** | TLS 1.3 via Vercel | Document policy, enforce minimum TLS 1.3 in Cloudflare config, enforce TLS for all internal service hops |
| **Encryption at rest** | Vercel + Neon manage | Document key management (Vercel uses AWS KMS, Neon uses AWS KMS), document key rotation policy (annual minimum) |
| **Backup + restore** | Neon PITR 7 days | Extend to 30 days (Neon paid tier), test restore quarterly, document RPO 15 min / RTO 4 hr |
| **Pen testing** | None | Annual external pen test starting Phase 4A |
| **Vulnerability management** | None | Snyk or Dependabot weekly review, automated PR creation for high/critical CVEs, SLA: critical patched <7 days, high <30 days |
| **Logging + monitoring** | Vercel logs only | Datadog full APM + log retention 1 year hot + 7 years cold (S3) |
| **Audit log integrity** | `audit_logs` table | Daily integrity check (count + checksum), append-only enforced at DB level (no DELETE/UPDATE permission) |
| **Data classification** | Implicit | Document data classification (Public / Internal / Confidential / Restricted), tag all tables in Drizzle schema comments |
| **Personnel security** | Background checks for contractors via Checkr | Extend to all employees, document policy |

### Vanta Integration

Vanta connects to: Vercel, Neon, Clerk, Stripe, AWS (for any future AWS resources), GitHub (PR review evidence), Datadog (alerting evidence), Slack (incident comms evidence), Google Workspace (MFA enforcement evidence). Coverage gap: Twilio (we'll add manual evidence collection for Twilio access reviews).

---

## 9. Data Residency Framework

The principle: **PII never crosses borders.** Aggregate analytics may cross borders only after anonymization and only under signed cross-border data processing agreements (DPAs).

### Per-Region Data Boundary

| Region | Database | What Lives Here | Cross-Border Reads Allowed? |
|---|---|---|---|
| US | Neon `us-east-1` (primary) + `us-west-2` (replica) | All US user PII, jobs, audit, payments, materials, deliveries | Yes (admin proxy with audit) |
| Canada | Neon `ca-central-1` | All Canadian user PII | No PII reads from outside CA. Anonymized analytics OK. |
| EU | Neon `eu-central-1` | All EU user PII | No PII reads from outside EU. Anonymized analytics OK. |
| UK | Neon `eu-west-2` | All UK user PII | No PII reads from outside UK. Anonymized analytics OK. |
| AU | Neon `ap-southeast-2` | All AU user PII | No PII reads from outside AU. Anonymized analytics OK. |

### Global Services (No PII)

These cross borders freely via CDN: brand assets, marketing pages, Sherpa codes engine read-only metadata, Sherpa Materials engine SKU catalog (without per-user pricing), platform docs.

### Cross-Border Analytics Pipeline

Every region runs a nightly aggregation job that produces anonymized analytics:
- Job count by category by metro by day (no user IDs)
- Pro count by skill by metro by week (no user IDs)
- GMV by region by day (no individual transactions)
- NPS distribution by region by month (no respondent IDs)

Anonymized aggregates ship to a single US-based analytics warehouse (BigQuery or ClickHouse on Vercel — TBD per cost analysis at scale). Customer DPAs disclose this aggregation explicitly.

### GDPR / PIPEDA / APP Specifics

Defer detailed regulatory analysis to the **International Expansion** spec. Architecture-level requirements addressed here:
- Right to erasure: hard-delete user PII within 30 days of request, retain anonymized audit-log entry referencing the deletion
- Data portability: export user data as JSON via `/api/me/export` (PM-tier-only initially, expanded by Phase 4B)
- DPA acceptance: required at sign-up for all non-US users, version-tracked in DB
- Cookie consent: required for EU/UK users, runs via OneTrust or Cookiebot (deferred decision)

---

## 10. Disaster Recovery (DR) and Business Continuity Plan (BCP)

### Backup Cadence

- **Continuous:** Postgres Write-Ahead Log (WAL) streamed to S3 every 60 seconds (Neon PITR plus our own backup destination)
- **Nightly:** Full snapshot per region, retained 30 days
- **Weekly:** Full snapshot exported to cross-region S3 bucket (us-west-2 backup of us-east-1, eu-west-1 backup of eu-central-1, etc.), retained 90 days
- **Monthly:** Full snapshot exported to cold storage (S3 Glacier Deep Archive), retained 7 years for compliance

### Targets

| Metric | Phase 1-3 Target | Phase 4 Target |
|---|---|---|
| Recovery Point Objective (RPO) | 1 hour | 15 minutes |
| Recovery Time Objective (RTO) — regional outage | 24 hours | 4 hours |
| Recovery Time Objective (RTO) — full DR scenario | 7 days | 24 hours |
| Failover testing cadence | Annual | Quarterly |

### Multi-Region Failover Automation

- **Compute failover:** Vercel handles automatically with Fluid Compute (functions execute in nearest healthy region; if a region fails, traffic shifts to next-nearest within seconds, no human intervention)
- **Database failover:** Neon manages primary failover within `us-east-1` automatically. Cross-region failover (e.g., `us-east-1` permanently down → promote `us-west-2` replica to primary) is manual and requires SEV1 incident declaration. Documented runbook in `docs/runbooks/db-cross-region-failover.md`.

### BCP Scenarios

| Scenario | Detection | Mitigation | Owner |
|---|---|---|---|
| Single AWS region down | Datadog synthetics fail in region | Vercel auto-routes; Neon manual promote of cross-region replica | On-call SRE |
| Database corruption | Daily integrity check fails OR user reports inconsistent data | Point-in-Time Recovery (PITR) to last-known-good timestamp; replay any lost work from audit logs | DBA + on-call |
| Security breach | SIEM alert (Datadog Security Monitoring) OR vulnerability disclosure OR pen test | Containment (revoke credentials, kill suspicious sessions), customer notification per per-jurisdiction breach laws, regulator notification per GDPR Article 33 (72 hours), postmortem | Phyrom + legal |
| Key vendor outage (Stripe / Clerk / Twilio) | Vendor status page + Datadog third-party-API monitor | Graceful degradation (queue payments, defer auth, fall back to email). Customer-facing status page. | On-call + comms |
| Key-person event (Phyrom unavailable for 7+ days) | Manual or automatic via 3-day no-checkin trigger | Pre-published succession plan: COO assumes operational decisions, CTO assumes engineering decisions, board notified. Phyrom maintains "in case of bus" doc with all critical access references and contact tree. | Board |
| DDoS at scale | Cloudflare alert + Vercel function invocation spike | Cloudflare auto-mitigation + manual rule deployment + Cloudflare Enterprise hotline if Pro plan | On-call + Cloudflare support |
| Catastrophic data loss (ransomware on backup destination) | Anomalous deletion patterns in S3 | Restore from cold-storage Glacier backup (RTO 24 hr) + customer comms + insurance claim | Phyrom + legal + insurance |

### Quarterly DR Testing

Game Day cadence (Phase 4A+): every quarter, on-call team executes one DR scenario in a staging environment that mirrors production at scale. Outcomes documented in `docs/dr-test-results/{date}.md`. Findings feed back into runbook updates.

---

## 11. Security Hardening Beyond SOC 2

### Secrets Management Migration

**Phase 1-3:** Vercel environment variables (encrypted at rest via AWS KMS, accessible only to Vercel runtime).

**Phase 4A+:** Migrate production secrets to AWS Secrets Manager (recommended) or HashiCorp Vault (more flexibility, more setup). Reasons:
- Per-environment scoping (production / staging / dev) with stricter ACLs
- Automatic rotation (database credentials, API keys) on configurable schedule
- Audit trail of secret access (compliance requirement)
- Integration with multi-region: secrets replicated to each region's Vercel runtime

Recommendation: AWS Secrets Manager. Reasons: simpler operational model, tight Neon integration (Neon now offers native AWS Secrets Manager rotation as of late 2025), ~$0.40/secret/month (negligible).

### Dependency Scanning

- **Snyk** (recommended) over Dependabot. Snyk catches more vulnerabilities, has better triage UI, and produces SOC-2-acceptable evidence reports.
- Automated PR creation for high/critical CVEs
- Weekly review of medium CVEs in Monday SRE sync
- SLA: critical CVE patched <7 days, high <30 days, medium <90 days

### Supply Chain Security

- **Software Bill of Materials (SBOM)** generated per release via Vercel build hook (CycloneDX format)
- **Sigstore signing** of release artifacts (Phase 4B+, becomes meaningful when we publish public APIs / SDKs)
- **Lockfile integrity** enforced in CI (no `npm install` without `npm ci`)
- **Vendored audit:** monthly review of any new third-party dependency before merge

### Penetration Testing

- **Annual external pen test** by Trail of Bits or Bishop Fox starting Phase 4A
- **Quarterly internal red-team exercise** Phase 4B+ (we contract a part-time red-teamer or use Cobalt Strike subscription)
- Scope per engagement: web app, mobile app (iOS + Android), API, internal infrastructure, social engineering simulation
- Findings tracked in Vanta with remediation SLA

### Bug Bounty Program

Launched on HackerOne at Phase 4A entry. Initial scope:
- In-scope: `*.thesherpapros.com` web surface, mobile apps, public APIs
- Out-of-scope: third-party services (Vercel, Neon, Stripe), DoS attacks, social engineering
- Payout tiers: Critical $5K-$15K, High $1K-$5K, Medium $300-$1K, Low $100-$300
- Triage SLA: ack <48 hours, fix critical <7 days

### Customer-Facing Security Page

`/security` page documenting:
- Compliance posture (SOC 2 status, GDPR, PIPEDA, APP)
- Encryption (in-transit, at-rest)
- Vulnerability disclosure: `security@thesherpapros.com` with PGP key
- Bug bounty link
- Sub-processors list (Vercel, Neon, Clerk, Stripe, Twilio, Cloudflare, etc.)
- Incident history (last 12 months, public-facing)

---

## 12. Cost-of-Scale Model

Estimated infrastructure cost per phase. Excludes salaries, marketing, professional services. All figures are monthly.

| Phase | MAU | Jobs/mo | Vercel | Neon | Clerk | Stripe (% take, not flat) | Twilio | Cloudflare | Datadog | Other | **Total** | $/MAU |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Phase 1 (current) | 10K | 1K | $20 (Pro) | $69 (Pro) | $25 (Pro) | passes through | $50 | $0 (free) | $0 (free) | $135 (misc) | **~$300** | $0.030 |
| Phase 2 | 100K | 10K | $200 (Pro+ functions) | $500 (Scale) | $300 (Pro+) | passes through | $500 | $20 (Pro) | $300 (Pro) | $1,180 (misc) | **~$3,000** | $0.030 |
| Phase 3 | 500K | 50K | $1,500 (Enterprise) | $3,000 (Scale + Citus) | $1,500 | passes through | $2,500 | $200 (Pro+) | $3,000 (Pro APM) | $3,300 (misc) | **~$15,000** | $0.030 |
| Phase 4A | 1M | 100K | $6,000 (Enterprise multi-region) | $15,000 (multi-region + replicas) | $5,000 | passes through | $5,000 | $5,000 (Enterprise) | $10,000 (Pro APM + RUM) | $13,000 (Vanta + bug bounty + Snyk + Upstash + AWS Secrets + dedicated DBA tooling) | **~$59,000** | $0.059 |
| Phase 4D | 5M | 500K | $30,000 (international multi-region) | $80,000 (5 regions + replicas + Citus + archive) | $25,000 | passes through | $30,000 | $20,000 (Enterprise + WAF custom) | $50,000 (Pro APM + RUM + multi-region) | $65,000 (full security stack + 24/7 SRE tooling + observability + DR drills) | **~$300,000** | $0.060 |

### Operating Leverage Trend

Cost per MAU stays roughly flat $0.03 through Phases 1-3, then doubles to $0.06 at Phase 4A entry (multi-region step-change), then plateaus through 4D. Despite raw infrastructure cost growing 1000x from Phase 1 to Phase 4D, cost per MAU only doubles — meaningful operating leverage for the unit economics story to investors.

### Cost-Optimization Levers (Phase 4+)

- **Reserved capacity** for Vercel + Neon + Datadog (typical 30-40% savings for committed annual spend)
- **Cross-region traffic routing rules** to keep US traffic on cheapest US region
- **Cold-tier migration** of older audit logs / completed jobs to S3 Glacier (massive storage cost reduction)
- **Datadog log filtering** at edge — drop debug-level logs in production, only keep info+
- **Vercel Bandwidth Optimization** (image optimization, automatic CDN caching)

---

## 13. Migration Path From Current to Multi-Region

Step-by-step path from today's single-region MVP to the Phase 4D global state. Each step is independently shippable and rollback-safe.

### Step 1 — Q3 2026 — Add US-West Vercel + Neon Read Replica

- Vercel: nothing to do — Fluid Compute already handles regional routing automatically
- Neon: add `us-west-2` read replica via Neon dashboard (single-click, ~30 min provisioning)
- Code: introduce replica-aware Drizzle client (`src/db/index.ts` exporting `dbWrite` + `dbRead`)
- Migrate read-heavy routes to `dbRead`: pro search, job browse, dashboards
- Validate via Datadog: dispatch latency from west-coast metros drops below 200ms

### Step 2 — Q4 2026 — Implement Metro-Based Sharding (Pilot, 2 Metros)

- Enable Citus extension on Neon primary
- Migrate `jobs`, `bids`, `dispatch_events`, `materials_orders`, `deliveries` to distributed tables sharded by `metro_id`
- Pilot with 2 metros: Boston + Portsmouth (low-traffic, easy to reason about)
- Add shard-rebalancing runbook
- Validate: dispatch query latency unchanged or improved, cross-shard query count <5% of total

### Step 3 — Q1 2027 — Cloudflare WAF + Upstash Rate Limiting + Datadog Full

- Cloudflare Pro plan, configure WAF rules per Section 5
- Upstash Redis provisioned, integrate `@upstash/ratelimit` into `src/middleware.ts`
- Datadog full APM rolled out with dashboards from Section 6
- All SLOs documented and alerting configured

### Step 4 — Q2 2027 — SOC 2 Type 1 Certified

- Vanta engaged Q3 2026, controls implemented Q4 2026, audit Q1 2027, report issued Q2 2027
- All controls from Section 8 evidenced

### Step 5 — Q3 2027 — Add Canadian Region (International Expansion Alignment)

- Neon `ca-central-1` provisioned, separate database
- Vercel functions in CA region
- Stripe Connect Canadian platform live
- Twilio CA Messaging Service live
- DPA acceptance flow live for Canadian users
- First Canadian beta cohort onboarded

### Step 6 — Q4 2027 — SOC 2 Type 2 Certified

- 12-month observation period from Type 1 completes
- Type 2 report issued — gating for EU enterprise sales

### Step 7 — Q1-Q2 2028 — Add EU Region for International Launch

- Neon `eu-central-1` provisioned
- Cookie consent + GDPR compliance flow live
- EU partner go-live coordinated with International Expansion plan
- First EU beta cohort onboarded

### Step 8 — Q3 2028+ — UK + Australia

- Repeat the regional template for `eu-west-2` (UK) and `ap-southeast-2` (AU)
- Operational maturity should make each new region take ~3 months end-to-end vs the 6 months for first international (Canada)

---

## 14. Risk Register — Top 10

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Database scaling unknowns at >100M rows (Citus performance, materialized view refresh windows) | Medium | High | Load test in staging at projected 18-month scale, hire DBA Phase 4A, fallback path to pg_partman documented |
| 2 | Multi-region consistency challenges (eventual consistency surprising users) | Medium | Medium | Document read-after-write rules, default writes route to primary, add user-visible "syncing..." UI for cross-region edge cases |
| 3 | Observability cost runaway (Datadog log ingest hitting $50K/mo unexpectedly) | High | Medium | Daily cost dashboard with paging at 25% over budget, log filtering at edge, sample high-volume routes |
| 4 | SOC 2 audit finding remediation cost (auditor demands controls we did not budget for) | Medium | Medium | Engage Vanta + Schellman early for pre-audit scoping call, build buffer into Q1 2027 budget |
| 5 | Key-person dependency on Phyrom + 1-2 senior engineers | High | Critical | Document everything in runbooks, hire CTO and VP Eng by Phase 4A, succession plan published, "in case of bus" doc updated quarterly |
| 6 | Vendor lock-in (Vercel, Neon, Clerk specifically) | Medium | High | Maintain abstraction layers in code (no Vercel-specific APIs leaking past `src/lib/`), annually review portability cost, contract terms include data-export guarantees |
| 7 | GDPR fines for data-residency mistakes | Low | Critical | Architectural enforcement (separate databases per region make accidental cross-border PII writes nearly impossible), legal review at each new region, DPO appointed before EU launch |
| 8 | DDoS attack on launch day (high-profile media coverage) | Medium | High | Cloudflare Pro + WAF live before any major launch, pre-arranged Cloudflare Enterprise hotline contact, capacity headroom 5x normal |
| 9 | Key-dependency CVE zero-day (Next.js, Drizzle, Postgres) | Medium | High | Snyk monitoring, on-call SLA for critical CVEs <7 days, Vercel auto-patches managed runtime, Neon auto-patches Postgres |
| 10 | ML/AI-feature bias in Sherpa Score (legal exposure if score correlates with protected class) | Medium | Critical | Bias audit before any Sherpa Score goes live to clients, third-party fairness review by Phase 4B, documented model card, opt-out path for pros, never expose score to clients as a single number — only as ranking input |

---

## 15. Open Decisions

Decisions deferred for explicit resolution by Phyrom + advisors before Phase 4A entry.

1. **Datadog vs OpenTelemetry + Grafana Cloud** at the 1M MAU threshold. Default: Datadog through 1M MAU, evaluate at the threshold. Decision owner: Phyrom + CTO when hired.
2. **Snyk vs Dependabot** for dependency scanning. Default: Snyk for SOC 2 evidence quality. Revisit if Snyk pricing exceeds 2x Dependabot value.
3. **When to hire dedicated DBA** — recommend Phase 4A trigger (1M MAU OR 100M total rows in any one table). Decision owner: Phyrom.
4. **When to hire dedicated SRE** — recommend Phase 4A trigger (multi-region rollout OR 99.95% SLA committed to enterprise customers). Decision owner: Phyrom.
5. **When to migrate any workload off Vercel** — currently no plan to. Trigger would be: Vercel pricing exceeds 3x equivalent self-hosted at 5M+ MAU, OR a workload pattern Vercel cannot serve (long-running async jobs >300s — solvable via Vercel Workflow DevKit, see Vercel knowledge update).
6. **Sharding strategy detail: Citus vs pg_partman + FDW**. Default: Citus. Revisit if Neon pulls Citus-on-Neon out of beta and pricing surprises us.
7. **Secrets management vendor: AWS Secrets Manager vs HashiCorp Vault**. Default: AWS Secrets Manager for simplicity. Revisit if we adopt Kubernetes anywhere (then Vault becomes more attractive).
8. **WAF: Cloudflare WAF vs Vercel Firewall**. Default: Cloudflare Pro for proven track record at scale. Vercel Firewall is improving fast; revisit at Phase 4A.
9. **Bug bounty platform: HackerOne vs Bugcrowd**. Default: HackerOne. Revisit only if HackerOne triage quality drops below acceptable threshold.
10. **Backup destination: Neon-managed vs custom S3 bucket**. Default: both (defense in depth). Cost is negligible at our scale.

---

## Cross-References to Parallel Specs

- **International Expansion** (per-country regulatory specifics, language localization, Stripe Connect per-country onboarding, GDPR/UK GDPR/APP details): defer
- **Franchise Model** (per-franchise tech stack, white-label vs shared infrastructure, franchise-specific RBAC): defer
- **Sherpa Hub Integration** (hub-specific infrastructure: POS, inventory management, IoT for materials tracking, real-time delivery telemetry): defer

This spec covers only the platform-layer infrastructure that all three downstream specs depend on. Decisions made here (multi-region database strategy, sharding by metro_id, observability stack, SOC 2 readiness) are inputs to the other three specs.

---

**End of spec — implementation plan: `docs/superpowers/plans/2026-04-25-platform-scale-architecture-plan.md`**
