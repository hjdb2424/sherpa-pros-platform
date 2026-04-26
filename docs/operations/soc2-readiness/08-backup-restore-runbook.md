---
title: Backup + Restore Runbook
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - docs/operations/soc2-readiness/07-encryption-policy.md
  - docs/operations/soc2-readiness/06-incident-response-procedures.md
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
soc2_controls: [A1.2, A1.3, CC7.5]
---

# Backup + Restore Runbook

## 1. Purpose

Defines backup schedules, retention, restore procedures, RPO/RTO targets, and disaster-recovery (DR) drills for Sherpa Pros data. Satisfies SOC 2 A1.2 (system availability) and A1.3 (recovery procedures).

## 2. Backup Architecture

### 2.1 Layered backup strategy

```
[Live writes]
     │
     ▼
[Neon Postgres primary — us-east-2]
     │
     ├─── continuous WAL streaming ──▶ [Neon PITR storage — 30 days]
     │
     ├─── nightly full snapshot (3am ET) ──▶ [AWS S3 backup bucket — us-east-1]
     │                                          │
     │                                          ├─── lifecycle to S3-IA after 30 days
     │                                          ├─── lifecycle to Glacier after 90 days
     │                                          └─── Object Lock for audit_logs archive (7 years)
     │
     ├─── weekly cross-region snapshot (Sun 2am ET) ──▶ [AWS S3 backup bucket — us-west-2]
     │
     └─── (Phase 4) Neon read replica ──▶ [us-west-2 standby for failover]
```

### 2.2 Backup contents

| Source | What is backed up |
|--------|-------------------|
| Neon Postgres primary | All tables including `users`, `audit_logs`, `dispatch`, `materials_orders`, `pro_skills_verification`, etc. |
| Vercel Edge Config | Snapshot via Vercel API; stored in S3 daily |
| AWS Secrets Manager | KMS-encrypted secrets backed up via AWS Backup service (90-day retention) |
| Cloudflare WAF rules + Workers | Exported via Terraform state + Cloudflare API daily; stored in S3 |
| Datadog dashboards + monitors | Exported via Datadog API daily; stored in S3 |
| GitHub repos | GitHub native + nightly clone to S3 (defense-in-depth against account compromise) |
| Stripe data | Stripe is system of record; we store Stripe IDs only; no Stripe export needed |

## 3. Retention Policy

| Backup type | Retention | Storage class | Justification |
|-------------|-----------|---------------|---------------|
| Continuous WAL (Neon PITR) | **30 days** | Neon-managed | Operational recovery + accidental delete |
| Nightly full snapshot (S3 us-east-1) | **90 days** | S3 Standard → S3-IA at 30d | Operational + monthly compliance evidence |
| Weekly snapshot (S3 us-west-2 cross-region) | **1 year** | S3 Standard-IA → Glacier at 90d | DR + annual evidence |
| Monthly snapshot (S3 us-west-2) | **7 years** | Glacier Deep Archive | Audit trail (matches Sherpa Guard `audit_logs` retention policy) |
| Audit log archive subset (audit_logs table extracted) | **7 years immutable** | S3 Object Lock (compliance mode) | SOC 2 + state-law evidence retention |
| Vercel Edge Config snapshot | 90 days | S3 Standard | Operational |
| AWS Secrets Manager backups | 90 days | AWS Backup | Operational |
| Cloudflare config | 90 days | S3 Standard | Operational |
| Datadog config | 90 days | S3 Standard | Operational |
| GitHub clone | 90 days | S3 Standard | Account-compromise defense |

## 4. RPO + RTO Targets

| Phase | RPO (max data loss) | RTO (max downtime) | Notes |
|-------|---------------------|--------------------|-------|
| **Phase 1 (today, Q2 2026)** | **1 hour** | **24 hours** | Single-region; Neon PITR is the recovery mechanism |
| **Phase 2 (Q4 2026)** | **30 min** | **8 hours** | Add weekly cross-region snapshots; documented restore drill |
| **Phase 3 (Q2 2027)** | **15 min** | **4 hours** | Add Neon read replica in us-west-2; failover tested quarterly |
| **Phase 4 (Q4 2027)** | **5 min** | **2 hours** | Active-passive multi-region; automated failover via DNS health check |

These targets feed our Service Availability commitment in MSAs and are the basis for SLA credits.

## 5. Restore Procedures

### 5.1 Point-in-time recovery (PITR) — most common scenario

Use case: accidental table drop, bad migration, single-row corruption within last 30 days.

```
1. Open SEV2 incident per 06-incident-response-procedures.md
2. Identify exact recovery target time (timestamp UTC)
3. In Neon console (or via API):
   - Create new branch from primary at target timestamp
   - Verify data shape on the new branch
4. App-level cutover decision:
   a. Single-row recovery: extract row(s) from new branch, INSERT/UPDATE into primary, audit log
   b. Full restore: switch app DATABASE_URL to new branch, verify, then promote new branch to primary
5. Audit log entry: db.restore.pitr with target time, operator, justification
6. Postmortem within 5 business days
```

**Drilled quarterly** — see Section 7.

### 5.2 Full disaster recovery (regional outage)

Use case: us-east-2 unavailable for >2 hours.

```
1. SEV1 incident; war room opened
2. Phyrom (or designated decision-maker) declares DR failover
3. Phase 3+ procedure (with Neon read replica):
   a. Promote us-west-2 read replica to primary via Neon API
   b. Update DATABASE_URL in Vercel + AWS Secrets Manager
   c. Trigger Vercel redeploy with new env (or runtime config refresh)
   d. Cloudflare DNS health check fails over public hostname to us-west-2 origin
   e. Verify smoke test runbook (per 05-change-management-policy.md Section 7.5)
   f. Status page + customer comms per 06-incident-response-procedures.md
4. Phase 1-2 procedure (without read replica):
   a. Provision new Neon project in us-west-2
   b. Restore latest weekly snapshot from S3 us-west-2
   c. Apply WAL up to most recent backup point (data loss accepted = backup-to-failure window)
   d. Update DATABASE_URL in Vercel + AWS Secrets Manager
   e. Same smoke test + comms
5. Audit log: db.failover.dr
6. Postmortem within 5 business days; carrier notification if cyber-insurance trigger met
```

### 5.3 Audit log archive restoration (compliance scenario)

Use case: regulator request for audit trail older than 90 days; legal-hold response; historical investigation.

```
1. Compliance lead opens request ticket with case number
2. Identify date range and records needed
3. Retrieve from S3 Glacier Deep Archive — initiate Bulk Retrieval (5–12 hr) or Standard (3–5 hr)
4. Decrypt with KMS key; export to time-bound encrypted ZIP for requester
5. Audit log entry: audit_archive.restore with case number, requester, scope
6. Object Lock prevents tampering during restore (read-only access)
```

### 5.4 Single-record restoration (customer support)

Use case: customer accidentally deleted job; pro disputes a closed job.

```
1. Support eng confirms request + identifies exact record
2. Use Neon PITR to spawn branch at pre-deletion timestamp
3. SELECT the record from the branch
4. INSERT/UPDATE into primary with `restored_from_backup=true` flag
5. Audit log: data.restore.single with record ID, requester, support ticket
6. Customer notification optional (most cases require minor restore without comms)
```

## 6. Backup Verification

### 6.1 Automated daily

- [ ] Neon snapshot completion confirmed via Neon API health check; alert to PagerDuty if missed
- [ ] S3 backup object count + size compared to previous day; anomaly alert if delta >20%
- [ ] Cross-region replication lag <15 min; alert if exceeded
- [ ] AWS Backup job success confirmed for Secrets Manager
- [ ] Vercel Edge Config + Cloudflare + Datadog config exports succeed
- [ ] Datadog dashboard `Backup Health` shows green

### 6.2 Weekly automated restore test

- [ ] Provision ephemeral Neon branch from latest snapshot
- [ ] Run schema integrity check (Drizzle introspection match expected)
- [ ] Run row count sanity checks against expected ranges
- [ ] Tear down ephemeral branch
- [ ] Result logged to Vanta as evidence

## 7. Quarterly Restore Drill

**Mandatory every quarter.** Counts as SOC 2 evidence.

### 7.1 Drill schedule

| Quarter | Drill type | Window |
|---------|------------|--------|
| Q1 | PITR drill — recover table state from 7 days prior in staging | Jan 15–31 |
| Q2 | Full snapshot restore — provision new staging from S3 us-east-1 weekly | Apr 15–30 |
| Q3 | Cross-region drill — restore from S3 us-west-2 weekly | Jul 15–31 |
| Q4 | DR failover drill — full failover sim in staging environment | Oct 15–31 |

### 7.2 Drill success criteria

- [ ] Restore completed within RTO target for current Phase
- [ ] Data loss within RPO target
- [ ] Restored data passes integrity checks (row counts, audit log continuity, foreign key validity)
- [ ] Smoke test passes against restored environment
- [ ] Drill duration recorded; trend tracked quarter-over-quarter
- [ ] Sherpa Guard audit log entry: `dr.drill.completed` with results

### 7.3 Drill failure handling

- Any drill failure = postmortem within 5 business days per `06-incident-response-procedures.md`
- Failure escalates to Phyrom + senior eng for remediation plan
- Re-drill scheduled within 30 days; auditor notified

## 8. Specific Procedures

### 8.1 Neon PITR via CLI (Phase 1 quick-reference)

```bash
# Create branch at target time
neonctl branches create \
  --name "restore-$(date +%s)" \
  --parent main \
  --parent-timestamp "2026-04-25T14:00:00Z"

# Get connection string for new branch
neonctl connection-string restore-{timestamp}

# Run integrity checks
psql $NEW_BRANCH_URL -c "SELECT count(*) FROM users"
psql $NEW_BRANCH_URL -c "SELECT max(created_at) FROM audit_logs"

# Single-row extraction example
psql $NEW_BRANCH_URL -c "COPY (SELECT * FROM jobs WHERE id = 'JOB-12345') TO STDOUT"
```

### 8.2 S3 snapshot restore (full DR path)

```bash
# List available snapshots
aws s3 ls s3://sherpa-pros-backups-us-west-2/neon/ --recursive | tail -20

# Download target snapshot
aws s3 cp s3://sherpa-pros-backups-us-west-2/neon/2026-04-21-weekly.dump.gz ./

# Restore into freshly provisioned Neon project
gunzip -c 2026-04-21-weekly.dump.gz | pg_restore --dbname=$NEW_NEON_URL --no-owner --no-privileges
```

### 8.3 Audit log archive restore from Glacier Deep Archive

```bash
# Initiate Glacier retrieval (Bulk = cheaper, 5-12 hr; Standard = 3-5 hr)
aws s3api restore-object \
  --bucket sherpa-pros-audit-archive \
  --key 2024-Q1-audit-logs.parquet.gz \
  --restore-request '{"Days":7,"GlacierJobParameters":{"Tier":"Standard"}}'

# Wait for restore to complete (poll head-object until restore-status complete)
aws s3api head-object --bucket sherpa-pros-audit-archive --key 2024-Q1-audit-logs.parquet.gz

# Download
aws s3 cp s3://sherpa-pros-audit-archive/2024-Q1-audit-logs.parquet.gz ./
```

## 9. Backup Security

- All backups encrypted at rest (per `07-encryption-policy.md`)
- S3 buckets have **MFA-Delete** enabled
- S3 audit-log archive bucket uses **Object Lock in Compliance mode** (immutable for 7 years)
- KMS keys for backup encryption have explicit key policies; no `*` principal
- AWS CloudTrail logs all backup-bucket access; reviewed monthly
- Backup access requires `internal_compliance` or break-glass authorization

## 10. Cost Tracking

| Component | Estimated monthly cost (Phase 1) |
|-----------|----------------------------------|
| Neon storage + PITR | included in Neon Pro plan ($69/mo base + storage usage) |
| S3 Standard (us-east-1) | ~$23 / TB / mo |
| S3 Standard-IA (after 30d) | ~$12.5 / TB / mo |
| S3 Glacier (after 90d) | ~$4 / TB / mo |
| S3 Glacier Deep Archive (audit archive) | ~$1 / TB / mo |
| Cross-region replication transfer | ~$20 / TB transferred |
| Estimated total Phase 1 | **<$200/mo** at <1 TB total |
| Estimated total Phase 4 | **$2K-$5K/mo** at 50-100 TB total |

## 11. Maintenance

- **Owner**: SRE / Compliance lead (Phyrom interim)
- **Review cadence**: Quarterly + after each drill
- **Effective date**: 2026-06-01
