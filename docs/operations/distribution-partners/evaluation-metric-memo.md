---
title: Distribution-Partner Pilot — Evaluation Metric Memo
date: 2026-04-26
status: draft
owner: Phyrom (Founder, Sherpa Pros LLC)
audience: Sherpa Pros + distribution-partner joint executive sponsors
references:
  - docs/operations/distribution-partners/distribution-partner-pitch-deck.md (Slides 4, 13)
  - docs/operations/distribution-partners/loi-template-distribution-partner.md (§8 Performance Gates)
  - docs/operations/fw-webb-partnership/09-pilot-success-metrics.md
  - docs/operations/fw-webb-partnership/04-fw-webb-economic-model.md
---

# Distribution-Partner Pilot — Evaluation Metric Memo

## Purpose

Define what success looks like for a Sherpa Hub × distribution-partner pilot at **90 / 180 / 365 days post-LOI**. Partner-agnostic: applies to FW Webb, Ferguson, 84 Lumber, Rexel USA, and any future distribution-partner pilot.

This memo is the **single source of truth** for joint quarterly review (QBR) gate decisions and post-pilot expansion go/no-go.

---

## Headline metric

**Incremental pro-account revenue per pilot branch vs control branches.**

Definition: 12-month-trailing pro-account-attributed sales per Pilot Branch (counter + delivery + Sherpa-Materials-orchestrated combined), minus 12-month-trailing pro-account-attributed sales per matched control branch, normalized by branch baseline volume.

Target: **+25% vs control by Day 365** (per LOI §8 partner-side gate).

This is the metric that justifies the partner's space, the partner's time, and the partner's exclusivity.

---

## 3 secondary metrics

| # | Metric | Why it matters | Day-365 target |
|---|---|---|---|
| 1 | **Pilot-Branch pro-account churn reduction (vs control)** | Tests the "stickiness" thesis from Slide 1 of the pitch — sticky pros are what's actually being sold | **-4 percentage points** |
| 2 | **Sherpa Materials orchestration GM% retained at partner** | Tests whether the preferred-vendor 7%-band routing actually preserves margin | **>=18% blended GM** |
| 3 | **Hub member share-of-wallet captured by partner** | Tests whether the co-location actually shifts the 2-3-distributor pattern → 1-default-distributor outcome | **>=65% of member's category spend at partner** |

Each is independently meaningful. None is gameable without dragging the others down.

---

## 90-day milestones (Day 0 = LOI signature)

| Day | Milestone | Owner |
|---|---|---|
| 30 | Mutual NDA signed; Branch Site Schedules drafted | Both Parties' counsel |
| 45 | Control branches selected + baseline data feed established | Partner data team + Sherpa Pros analytics |
| 60 | Branch Site Schedules signed for all 5 Pilot Branches | Both Parties' real-estate teams |
| 75 | Buildout permits filed for Hub #1 + Hub #2 | Sherpa Pros |
| 90 | Hub #1 buildout begins | Sherpa Pros |

Day-90 review = **construction kickoff confirmed** + **measurement instrumentation live**. No revenue metrics yet.

---

## 180-day milestones (Pilot Month 6 — interim QBR)

This is the pilot's first **go / no-go checkpoint** per LOI §8.

| Metric | Day-180 floor | Day-180 target |
|---|---|---|
| Hubs operational | 4 of 5 | **5 of 5** |
| Active members per Hub | 30 | 40 |
| Materials volume per Hub ($/mo) | $15,000 | $20,000 |
| On-time delivery % | 92% | 95% |
| Pilot-Branch foot-traffic vs control | +8% | +12% |
| Pilot-Branch supply purchase volume vs control | +15% | +20% |
| Member NPS | 40 | 50 |

If the 180-day floors are missed, the LOI's §9.3 underperformance clause activates and Parties meet within 60 days to renegotiate.

---

## 365-day milestones (Pilot Month 12 — final QBR + expansion decision)

This determines the post-pilot expansion path per LOI §9.

| Metric | Day-365 floor | Day-365 target |
|---|---|---|
| **Headline: Pilot-Branch pro-revenue lift vs control** | **+18%** | **+25%** |
| Hubs operational | 5 of 5 | 5 of 5 |
| Cumulative active members (network) | 300 | 400 |
| Cumulative materials volume (cumul through M12) | $1.0M | **$1.5M** |
| On-time delivery % | 94% | 97% |
| Pilot-Branch NPS improvement (vs baseline) | +8 pts | **+10 pts** |
| Pilot-Branch pro-account churn reduction | -3 pts | **-4 pts** |
| Per-branch net incremental EBITDA | $130K | **$165K-$210K** |

Pilot exit score (per `09-pilot-success-metrics.md` methodology):
- **>=95%** → expand to 25 Hubs Year-2 + accelerate to 50+ Year-3
- **80%-94%** → expand to 25 Hubs Year-2 (plan case)
- **70%-79%** → selective expansion (3 best Hubs)
- **50%-69%** → 6-month pilot extension
- **<50%** → pilot wind-down

---

## Measurement instrumentation

### Sherpa Pros side (existing platform)
- `members`, `member_visits`, `member_nps_responses` tables
- `materials_orders`, `hub_materials_staging`, `hub_returns` tables
- `hub_metrics_daily` nightly rollup (per `06-per-hub-pl-dashboard-spec.md`)
- Per-Hub P&L Dashboard surfaces all member + materials metrics in real time

### Partner side (data feed required)
- Monthly Pilot-Branch sales summary (anonymized pro-account level)
- Monthly Control-Branch sales summary (matched same month)
- Monthly pro-account churn data (Pilot + Control)
- Quarterly Pilot-Branch NPS survey results

Per LOI §6.3, partner provides this monthly. Manual or EDI depending on integration phase.

### Joint integration (during pilot)
- Shared QBR data pack — Sherpa Pros analytics team produces; both Parties' executive sponsors review
- Real-time dashboard access — partner exec sponsor reads Sherpa Pros' Network Ops Dashboard (per `07-network-wide-ops-dashboard-spec.md`)

---

## Joint quarterly review cadence

| Cadence | Owner | Audience | Output |
|---|---|---|---|
| **Daily** | Hub Manager | Hub Manager + Sherpa Network Ops | Per-Hub dashboard refresh |
| **Weekly** | Hub Manager → Partner Regional VP | Both Parties' regional ops | Weekly metrics rollup |
| **Monthly** | Sherpa Network Ops | Both Parties' analytics teams | Monthly P&L close + gate progress |
| **Quarterly** | Joint executive sponsors | Phyrom + Partner executive sponsor | **QBR** — formal gate review + corrective actions |
| **Pilot M6** | Joint executive sponsors | Both Parties' leadership | Interim go/no-go on pilot continuation |
| **Pilot M12** | Joint executive sponsors | Both Parties' leadership + counsel | **Pilot exit decision** per LOI §9 |

QBR agenda is templatized in Exhibit D of the LOI. Same template across all distribution-partner pilots.
