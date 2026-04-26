---
title: Sherpa Pros — Phase 4 Objectives and Key Results + Measurement Framework
date: 2026-04-25
status: draft
owner: Phyrom (founder), Chief Operating Officer (Phase 4 Month 0 hire), executive team
references:
  - docs/superpowers/handoff/2026-04-25-phase-4-parallel-execution.md
  - docs/strategy/phase-4-extensions/01-series-c-pitch-deck-design.md
  - docs/strategy/phase-4-extensions/03-ai-ml-roadmap.md
  - docs/strategy/phase-4-extensions/04-embedded-fintech-roadmap.md
  - docs/strategy/phase-4-extensions/07-phase-4-org-design.md
window: Months 18-30 (Phase 4A) and Months 30-36 (Phase 4B + 4C)
review_cadence: Quarterly executive review + monthly operational review + weekly metric scan
classification: Internal — executive team + board
---

# Phase 4 Objectives and Key Results — Master Framework

## Purpose

Phase 4 spans Months 18-36 from current date (2026-04-25), a window of ~18 months. The deferred Phase 4 strategic extensions — international, franchise scale, embedded fintech, Software-as-a-Service-readiness, executive bench, organizational scale — sit on top of the Phase 4 base build (multi-region infrastructure, materials orchestration, Hub network expansion, SOC 2 Type 2). This document is the integrated Objectives and Key Results framework that aligns all of them.

Each Objective has 3-5 Key Results, an owner, a measurement cadence, and a Datadog or executive-dashboard surface where the metric lives.

---

## Objective 1 — Series B closed and capital deployed

**Objective.** Close the $20-40M Series B by Phase 4 Month 21 and deploy the capital into the four growth tracks (international, multi-region infrastructure, franchise development, reserve) with measured milestones.

| Key Result | Target | Owner | Cadence | Surface |
| --- | --- | --- | --- | --- |
| KR1.1 — Series B closed | $20M-$40M raised by Month 21 | Phyrom + Chief Financial Officer | Once at close | Board memo |
| KR1.2 — International Y1 (Canada) capital deployed | 30% of raise (~$6M-$12M) | Country General Manager Canada (M21+ hire) | Quarterly | International dashboard |
| KR1.3 — Multi-region infrastructure capital deployed | 25% of raise (~$5M-$10M) | Vice President Engineering | Quarterly | Engineering finance dashboard |
| KR1.4 — Franchise development capital deployed | 25% of raise (~$5M-$10M) | Director of Franchise (M12+ hire), Vice President Operations | Quarterly | Franchise dashboard |
| KR1.5 — Reserve maintained | 20% of raise (~$4M-$8M) preserved for opportunistic deployment | Chief Financial Officer | Monthly | Treasury report |

**Risk note.** If Series B closes below $20M, capital allocation across KR1.2-KR1.5 must rebalance — Canada launch is the highest-priority commitment and the reserve buffer is the first lever to compress.

---

## Objective 2 — International Year 1 (Canada) launched and traction validated

**Objective.** Toronto-first Canada launch hits operational and revenue milestones that prove the international model travels.

| Key Result | Target | Owner | Cadence | Surface |
| --- | --- | --- | --- | --- |
| KR2.1 — Canada Country General Manager hired | Hire closed by Month 21 | Phyrom + Director of People (M6+ hire) | Once | Hire tracker |
| KR2.2 — Toronto beta cohort | 10+ pros active by Month 24 | Country General Manager Canada | Monthly | International dashboard |
| KR2.3 — Canadian jobs completed | 50+ jobs by Month 27 | Country General Manager Canada | Weekly | International dashboard |
| KR2.4 — Canadian Gross Merchandise Value | $200K+ Canadian Gross Merchandise Value by Month 30 | Country General Manager Canada | Weekly | International dashboard |
| KR2.5 — Toronto pro retention | 75%+ at 6-month mark | Country General Manager Canada | Monthly | Pro retention cohort dashboard |

**Stretch Key Result.** Vancouver beta-cohort exploration begins by Month 30 (signal: positive Toronto trajectory + capital buffer permits second-metro investment).

---

## Objective 3 — Sherpa Hub network expanded to 6+ Hubs

**Objective.** From the 5 First Webb co-located Hubs operational at Phase 4 entry, grow to 6+ Hubs operational by Phase 4 Year 1 end (Month 30) including the first signed franchisee.

| Key Result | Target | Owner | Cadence | Surface |
| --- | --- | --- | --- | --- |
| KR3.1 — Sherpa Hub #1 (Portsmouth) grand-open | Live by Month 4 (already in flight per Phase 4 base build) | Vice President Operations (until M12 hire, then Director of Franchise) | Once | Hub dashboard |
| KR3.2 — First Webb co-located Hubs operational | 5 hubs operational by Month 18 | Vice President Operations | Quarterly | Hub dashboard |
| KR3.3 — First franchisee signed | 1 franchisee Discovery Day → Letter of Intent → signed Franchise Agreement by Month 27 | Director of Franchise | Monthly | Franchise pipeline dashboard |
| KR3.4 — Total Hubs operational | 6+ by Month 30 | Vice President Operations | Quarterly | Hub dashboard |
| KR3.5 — Hub Item 19 Financial Disclosure Document validated | Average Hub gross revenue Year 1 within Item 19 disclosed range | Director of Franchise + Chief Financial Officer | Quarterly | Hub Profit and Loss dashboard |

**Risk note.** First franchisee close is the leading indicator for the franchise model. If no Letter of Intent by Month 24, escalate to executive review and consider extending the Discovery Day pipeline (more Hub-prospect events, broader marketing fund spend).

---

## Objective 4 — SOC 2 Type 2 certification achieved

**Objective.** Demonstrate enterprise-grade security and operational discipline required for Property-Manager tier customers, insurance-carrier embedded-fintech partners, and Series C investor due-diligence.

| Key Result | Target | Owner | Cadence | Surface |
| --- | --- | --- | --- | --- |
| KR4.1 — Vanta + Schellman engaged | Both vendors engaged with statement-of-work signed by Month 9 | Vice President Engineering + General Counsel (M12+ hire) | Once | Vendor contract tracker |
| KR4.2 — SOC 2 Type 1 achieved | Type 1 report received by Month 18 | Vice President Engineering | Once | Compliance dashboard |
| KR4.3 — SOC 2 Type 2 achieved | Type 2 report received by Month 30 (12 months observation period after Type 1) | Vice President Engineering | Once | Compliance dashboard |
| KR4.4 — Security incident response time | <15 minutes from detection to acknowledgement, <60 minutes to mitigation for Severity-1 incidents | Vice President Engineering + Director of Security (Phase 5 hire) | Monthly | Security incident dashboard |

---

## Objective 5 — Multi-region infrastructure proven

**Objective.** Move from single-region (US-East) deployment to multi-region (US-East + US-West + Canada) with 99.95%+ uptime maintained throughout.

| Key Result | Target | Owner | Cadence | Surface |
| --- | --- | --- | --- | --- |
| KR5.1 — US-West replica live | Database replica + application failover live by Month 21 | Vice President Engineering | Once | Infrastructure dashboard |
| KR5.2 — Canadian region live | Canada-resident database + application live by Month 27 (data-residency requirement for Canadian operations) | Vice President Engineering + Country General Manager Canada | Once | Infrastructure dashboard |
| KR5.3 — Uptime maintained | 99.95% uptime across all regions throughout Phase 4 | Vice President Engineering | Monthly | Datadog uptime dashboard |
| KR5.4 — Cross-region failover tested | Quarterly failover drill executed and timing measured | Vice President Engineering | Quarterly | Disaster recovery test log |

**Hedge.** Multi-region adds cost (estimated $15K-$25K/month additional infrastructure spend at Phase 4 scale). Worth it for international + Property-Manager-tier customer trust.

---

## Objective 6 — Vertical integration revenue lines proven

**Objective.** Materials orchestration, Sherpa Rewards, and Sherpa Flex move from "live" to "meaningful revenue contributors."

| Key Result | Target | Owner | Cadence | Surface |
| --- | --- | --- | --- | --- |
| KR6.1 — Materials orchestration gross run-rate | $1M+/month gross run-rate by Month 27 | Vice President Operations + Materials team | Monthly | Materials dashboard |
| KR6.2 — Sherpa Rewards adoption | 1,000+ active pros earning by Month 24 | Vice President Marketing + Pro Success team | Monthly | Rewards dashboard |
| KR6.3 — Sherpa Flex adoption | 200+ side-bandwidth pros active by Month 27 | Vice President Marketing + Pro Success team | Monthly | Flex dashboard |
| KR6.4 — Sherpa Lending pilot | $500K-$1M originated in pilot metros by Month 30 | Chief Financial Officer + Head of Embedded Fintech (Phase 4 Y2 hire) | Monthly | Lending dashboard |

---

## Objective 7 — Series C ready

**Objective.** Phase 4 closes with Series C investor process opened and lead investor identified.

| Key Result | Target | Owner | Cadence | Surface |
| --- | --- | --- | --- | --- |
| KR7.1 — Annual Recurring Revenue run-rate | $50M+ Annual Recurring Revenue by Month 27 | Chief Financial Officer | Monthly | Finance dashboard |
| KR7.2 — Month-over-Month revenue growth | 25%+ Month-over-Month growth maintained throughout Phase 4 Year 2 | Chief Financial Officer + Vice President Marketing | Weekly | Growth dashboard |
| KR7.3 — Lead Series C investor identified | Lead investor terms-sheet conversation by Month 30 | Phyrom + Chief Financial Officer | Once | Corporate development tracker |
| KR7.4 — Audited financials available | Year-end Phase 4 Year 1 audited financials available for Series C diligence by Month 30 | Chief Financial Officer | Once | Audit deliverable |
| KR7.5 — SOC 2 Type 2 + data-room ready | Series C data room populated with 100% of standard line items by Month 30 | Chief Financial Officer + General Counsel | Once | Data room |

---

## Cross-cutting measurement disciplines

### Cadence

- **Weekly metric scan.** Phyrom + Chief Operating Officer + Chief Financial Officer review the executive dashboard every Monday morning. 30-minute meeting. Just-the-numbers, no narrative.
- **Monthly operational review.** Each Vice President or Director presents their Objective progress at the monthly executive operating review. 90-minute meeting. Trends, blockers, asks.
- **Quarterly board review.** Phyrom + Chief Operating Officer + Chief Financial Officer present full Objectives and Key Results scorecard at every quarterly board meeting. Format: red/yellow/green per Key Result with one-paragraph commentary.
- **Annual planning refresh.** Full Objectives and Key Results refresh at end of each Phase 4 year (Month 30 + Month 36) to align with phase transitions.

### Dashboard surfaces

All Key Results land in one of three dashboards:

1. **Executive dashboard (Datadog).** Top-line metrics: Annual Recurring Revenue, Gross Merchandise Value, Customer Acquisition Cost, pro count, job count, uptime, Series B/C status. Read by Phyrom + executive team weekly.
2. **Operational dashboards (Datadog + Mode + Tableau-cluster).** Per-Objective dashboards owned by each Vice President or Director. Read by their team weekly + reviewed at monthly operational review.
3. **Compliance + audit dashboards (Vanta + Datadog).** SOC 2 evidence collection, security incident tracking, bias-audit metrics. Read by Vice President Engineering + General Counsel monthly.

### Red/yellow/green thresholds

| Status | Definition |
| --- | --- |
| Green | Key Result on track to hit target by deadline |
| Yellow | Key Result at risk; owner has corrective plan |
| Red | Key Result will miss target; escalate to executive team for re-prioritization or resource reallocation |

A single Red Key Result triggers an emergency executive review within 5 business days. Two or more Red Key Results in the same Objective trigger a board-level escalation.

### Compensation tie-in

Executive team compensation has 30%-40% variable component tied to Objectives and Key Results achievement. Specifically:

- Phyrom: 100% variable compensation tied to Objectives 1, 2, 7 (Series B, international, Series C ready).
- Chief Operating Officer: tied to Objectives 2, 3, 6 (international, Hub network, vertical integration).
- Chief Financial Officer: tied to Objectives 1, 4, 7 (Series B, SOC 2, Series C ready).
- Vice President Engineering: tied to Objectives 4, 5 (SOC 2, multi-region).
- Vice President Marketing: tied to Objectives 6, 7 (vertical integration revenue, Annual Recurring Revenue + growth).
- Vice President Operations: tied to Objectives 3, 6 (Hub network, materials orchestration).
- Director of Franchise: tied to Objective 3 (first franchisee signed).
- Country General Manager Canada: tied to Objective 2 entirely.

---

## Out-of-scope (deferred to Phase 5 Objectives and Key Results refresh)

The following are explicitly NOT Phase 4 Objectives:

- United Kingdom Year 2 launch metrics (separate Phase 4 Year 2-3 OKR refresh once United Kingdom General Manager hired Month 21).
- Australia Year 3 launch metrics.
- Software-as-a-Service spinout revenue targets (Phase 5 territory per `05-vertical-saas-spinout-strategy.md`).
- Initial Public Offering readiness milestones (Phase 5 Year 4-5 territory).
- Mergers and Acquisitions deal flow (separate corporate development tracker per `02-acquisition-track-strategic-analysis.md`).

---

## Owner sign-off

This Objectives and Key Results framework is owned by:
- Phyrom (founder) — overall accountability
- Chief Operating Officer (Phase 4 Month 0 hire) — execution accountability
- Chief Financial Officer (Phase 4 Month 6 hire) — measurement accountability

Reviewed and updated quarterly. Major changes (adding/removing Objectives, restating targets) require board approval.
