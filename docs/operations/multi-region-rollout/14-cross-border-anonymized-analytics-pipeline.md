---
title: Cross-Border Anonymized Analytics Pipeline
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire + future privacy counsel
references:
  - 10-region-aware-db-routing.md
  - 12-gdpr-readiness-and-dsar-flow.md
phase: 4 baseline (US-only first), expanded as international regions launch
---

# Cross-Border Anonymized Analytics Pipeline

## Goal

Give leadership and data analysts a single global view of business metrics (job count, GMV, member count, materials volume) without ever moving personal information (PII) across borders. The trick is anonymization at the source plus aggregation before transmission.

## Sources

Per-region operational databases:

- US — Neon `us-east-2` (primary) + `us-west-2` (replica)
- Canada — Neon `ca-central-1`
- EU — Neon `eu-west-1`
- UK — Neon `eu-west-2`
- Australia — Neon `ap-southeast-2`

Each region is the source of truth for its own users.

## Anonymization layer

Runs **inside the source region** before any data leaves. Strict rules:

- [ ] **Drop PII fields entirely** — name, email, phone, address line, exact birthdate, exact transaction amounts at row level.
- [ ] **Geographic granularity at metro level only** — keep `metro_id`, drop street address, drop postal code if sparse enough to identify a household.
- [ ] **Age bucketed** — `age_bucket: "25-34"` not `birthdate: "1995-03-12"`.
- [ ] **Revenue bucketed** — `gmv_bucket: "$1k-$10k"` for individual records; only aggregate sums in dollars cross individual-level threshold.
- [ ] **Pseudonymize user IDs** — replace internal UUIDs with a one-way hashed pseudonym keyed per region. Hash key never leaves the region.
- [ ] **K-anonymity threshold:** any aggregate cell with fewer than 5 underlying users is suppressed (replaced with `NULL` and flagged "k<5").

## Aggregation layer

Weekly batch jobs run inside each region, output region-aggregated metrics tables:

| Metric | Granularity |
| --- | --- |
| `weekly_job_count` | region × metro × trade × week |
| `weekly_gmv_cents` | region × metro × trade × week |
| `weekly_active_pros` | region × metro × week |
| `weekly_active_clients` | region × metro × week |
| `weekly_materials_orders_count` | region × metro × week |
| `weekly_materials_gmv_cents` | region × metro × week |
| `weekly_dispatch_p95_ms` | region × week |
| `weekly_completed_job_avg_rating` | region × metro × week |

Each row carries a region tag and an anonymization-version tag so we can re-run aggregations if rules change.

## Destination — global analytics warehouse

- **Warehouse:** BigQuery (recommended over Snowflake at our scale for cost — pay per query, no idle compute).
- **Location:** US-East to align with leadership location and existing Datadog / Vercel infra.
- **Access:** read-only for analysts; service-account write for the pipeline only.

Why not the operational DB? Two reasons: (1) keeping analytics queries off production preserves performance budgets; (2) BigQuery is built for these aggregation patterns.

## Tooling

- **dbt** (data build tool) for SQL transformations. Per-region dbt project with shared macros for the anonymization rules. CI on every dbt model change.
- **Airflow or Prefect** for orchestration (or Vercel Cron for simpler weekly batches). Phase 4A: Vercel Cron is enough; Phase 4B+: Prefect or Airflow.
- **BigQuery Data Transfer Service** for region-to-warehouse moves where supported; fall back to a Vercel Cron that pulls from regional DB and pushes to BigQuery via the BigQuery client SDK.

## Pipeline shape (per region)

```
+-------------------+      +-------------------+      +-------------------+
| Operational DB    | -->  | Regional anon +   | -->  | BigQuery global   |
| (per region)      |      | aggregate (dbt)   |      | analytics ware-   |
| PII intact        |      | runs in region    |      | house (US-East)   |
+-------------------+      +-------------------+      +-------------------+
```

Step by step:

- [ ] **1.** Vercel Cron (weekly, Sunday 3am UTC) triggers `/api/_internal/analytics/run-region` for each region.
- [ ] **2.** That endpoint connects to the region's read replica (never primary, to avoid load spikes).
- [ ] **3.** Runs the dbt models that produce anonymized + aggregated rows.
- [ ] **4.** Writes those rows to a regional staging table inside the region's DB.
- [ ] **5.** Pushes from staging to BigQuery via service-account auth.
- [ ] **6.** Marks the run complete in `analytics_run_log`.

Failures retry up to 3 times then page on-call (SEV3).

## Privacy review gate

**No new metric flows cross-border without a privacy review.** Process:

- [ ] Engineer proposes a new aggregate metric in `docs/operations/multi-region-rollout/proposed-metrics.md`.
- [ ] Privacy counsel reviews against re-identification risk.
- [ ] Counsel signs off in writing or requests changes (e.g., increase k-anonymity threshold, drop a dimension).
- [ ] Implementation merged only after sign-off.

This guards against scope creep where well-meaning engineers add "just one more dimension" until aggregates become re-identifiable.

## Re-identification risk testing

Quarterly:

- [ ] Pick 10 random aggregate rows from BigQuery.
- [ ] Attempt to back-identify a specific user using only the warehouse data + public info.
- [ ] If any attempt succeeds, raise the k-anonymity threshold and re-run aggregations.
- [ ] Document attempts + results.

## What absolutely never crosses the border

For clarity, repeat from `10-region-aware-db-routing.md`:

- Individual user records.
- Individual job details (text, photos, addresses).
- Individual chat messages or attachments.
- Per-user pro performance (without aggregation).
- Stripe / payment IDs.
- Audit log entries.

If a need arises, the answer is to compute the aggregate inside the source region and ship the aggregate, never the raw data.

## Cost

| Item | Monthly cost (USD) |
| --- | --- |
| BigQuery storage (~50 GB Phase 4) | ~$1 |
| BigQuery query compute (~5 TB processed/mo) | ~$25 |
| dbt Cloud (Team plan, optional — open-source dbt-core works fine) | ~$100 (skip Phase 4 Year 1) |
| Orchestration (Vercel Cron Phase 4 Year 1) | included |
| Privacy counsel review per new metric (~5/year) | ~$500 quarterly |
| **Total Phase 4 baseline** | **~$2,000/mo** |

Scales modestly with data volume. At 10x scale: ~$5,000/mo.

## Phase 4A vs Phase 4 international

Phase 4A (US-only): the "cross-border" name is technically a misnomer until international launches. The pipeline still exists and is worth standing up early because (1) it gets the team comfortable with anonymization patterns, and (2) it produces the leadership analytics view that scales when international comes online.

Phase 4 international: each new region plugs in by replicating the regional anonymize + aggregate template, signing the relevant DPAs (Data Processing Agreements), and adding the privacy review gate to that region's metric inventory.

## Open questions

- Confirm BigQuery EU region acceptable for an EU-only analytics view if we ever want one (e.g., regulators ask for data localization on analytics too).
- Define rebuild cadence — if the anonymization rules change, do we rebuild historic aggregates? Default yes, with version stamps so historic comparisons remain valid.
- Decide whether to expose a subset of warehouse views to operations partners (Sherpa Pros operators in each region) or keep warehouse access leadership-only.
