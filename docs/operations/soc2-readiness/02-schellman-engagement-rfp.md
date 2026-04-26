---
title: Schellman Engagement RFP — SOC 2 Audit Services
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead hire (Q3 2026)
references:
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
  - docs/operations/soc2-readiness/01-vanta-engagement-rfp.md
soc2_controls: All Trust Services Criteria
---

# Schellman Engagement RFP

## 1. Executive Summary

Sherpa Pros seeks a SOC 2 audit firm to perform our **SOC 2 Type 1 audit in Q4 2026** and **SOC 2 Type 2 audit in Q4 2027** with optional advisory hours during the readiness phase. The platform-scale architecture spec recommends pairing **Vanta (compliance automation) with Schellman (auditor)** based on the long-standing partnership between the two vendors and Schellman's strong reputation in SaaS / fintech / proptech audits.

**Recommended auditor: Schellman.** Alternative under evaluation: **A-LIGN.**

## 2. Company Context

See `01-vanta-engagement-rfp.md` Section 2. In summary: Next.js / Neon / Clerk / Stripe Connect / Vercel SaaS platform; 1 employee today, 6 by Q3 2026; Northeast US two-sided marketplace; payment escrow flowing through Stripe Connect; 7-year audit log retention via Sherpa Guard.

## 3. Scope of Work

### 3.1 SOC 2 Type 1 — Q4 2026

- [ ] Trust Services Criteria: **Security + Availability + Confidentiality** (Privacy + Processing Integrity not in scope Year 1)
- [ ] Point-in-time control design assessment as of 2026-12-31
- [ ] Report delivery target: 2027-01-31
- [ ] Distribution rights: General use SOC 2 report shareable with prospects under NDA
- [ ] Bridge letter eligibility for the gap between Type 1 report date and Type 2 audit period
- [ ] Coordination with Vanta-collected evidence (no duplicate evidence requests)

### 3.2 SOC 2 Type 2 — Q4 2027

- [ ] Same TSC scope as Type 1 (Security + Availability + Confidentiality)
- [ ] Observation period: **2026-10-01 through 2027-09-30** (12 months)
- [ ] Fieldwork: Q4 2027
- [ ] Report delivery target: 2027-12-15
- [ ] Annual renewal cadence thereafter

### 3.3 Advisory Hours (Readiness Phase)

- [ ] **20 advisory hours** during readiness phase (Q3 2026)
- [ ] Topics covered: control design review, evidence quality review, gap remediation prioritization, auditor expectations walkthrough
- [ ] Advisory hours separate from audit fieldwork to maintain auditor independence

## 4. Pricing Targets

| Engagement | Target Range | Notes |
|------------|--------------|-------|
| SOC 2 Type 1 (Q4 2026) | **$35K – $55K** | First-year SaaS startup pricing; under 10 employees |
| SOC 2 Type 2 (Q4 2027) | **$45K – $70K** | Twelve-month observation; expanded employee count (up to 25) |
| Advisory hours (20 hrs) | $5K – $8K | Optional but recommended |
| Bridge letter (between reports) | $0 – $3K | Often included with Type 1 engagement |
| Add-on TSC (Privacy or Processing Integrity) | $10K – $15K | Defer until Year 3 if business need emerges |

**Total Year 1+2 budget**: $80K – $125K plus advisory.

## 5. Selection Criteria + Scoring Matrix

| Criterion | Weight | Schellman target score | A-LIGN target score |
|-----------|--------|------------------------|---------------------|
| AICPA-licensed CPA firm with SOC 2 specialty | 15% | 10/10 | 10/10 |
| Vanta partnership depth (named integration partner) | 20% | 10/10 | 8/10 |
| Marketplace / fintech / proptech audit experience | 15% | 9/10 | 9/10 |
| Pricing fit (under $55K Type 1) | 15% | 8/10 | 8/10 |
| Audit timeline (90-day kickoff to report) | 10% | 9/10 | 9/10 |
| Auditor reputation with enterprise buyers (national homebuilders, REITs) | 10% | 10/10 | 9/10 |
| Bridge letter availability between Type 1 and Type 2 | 5% | 9/10 | 9/10 |
| Quality of report narrative (readability for non-technical buyers) | 5% | 9/10 | 8/10 |
| Continuity (lead auditor stays across Type 1 and Type 2) | 5% | 9/10 | 8/10 |

**Recommendation**: Engage **Schellman** based on Vanta partnership depth and strong proptech audit pedigree which matches our enterprise PM buyer profile.

## 6. Required Vendor Deliverables in Proposal

- [ ] Fixed-fee pricing for Type 1 + Type 2 with optional advisory hours line item
- [ ] Named lead auditor and engagement team for both Type 1 and Type 2 (continuity)
- [ ] Sample SOC 2 Type 2 report (redacted) from a comparable SaaS marketplace
- [ ] Three customer references: SaaS startups under 50 employees that completed Type 1 + Type 2 sequentially with Schellman
- [ ] Confirmation of Vanta integration and evidence-pull workflow
- [ ] Engagement letter template
- [ ] Independence + conflict-of-interest disclosure
- [ ] Acceptance of Vanta-managed Trust Center for distribution
- [ ] Bridge letter pricing and turnaround time
- [ ] PCI Level 1 service auditor capability (future-proof; we are Stripe-tokenized today but may grow into PCI scope)

## 7. Timeline

| Milestone | Target Date |
|-----------|-------------|
| RFP issued | 2026-05-01 |
| Auditor demos / interviews | 2026-05-15 |
| Auditor selection | 2026-05-22 |
| Engagement letter signed | 2026-06-15 |
| Advisory hours block 1 (control design review) | 2026-07-15 |
| Advisory hours block 2 (gap remediation review) | 2026-08-15 |
| Pre-fieldwork readiness check | 2026-09-15 |
| **Type 2 observation window opens** | **2026-10-01** |
| Type 1 fieldwork | 2026-11-01 to 2026-12-15 |
| **Type 1 report delivered** | **2027-01-31** |
| Bridge letter (post-Type-1, pre-Type-2) | 2027-04-15 |
| Type 2 fieldwork | 2027-10-15 to 2027-12-01 |
| **Type 2 report delivered** | **2027-12-15** |

## 8. Decision Authority

- **Decision owner**: Phyrom (founder)
- **Signoff required from**: Future SRE / Compliance hire; legal counsel reviews engagement letter
- **Budget approval**: Tied to Phase 0 fundraise close

## 9. Submission Instructions

Same as Vanta RFP. Email proposals to `compliance@thesherpapros.com`. Subject: `RFP — Sherpa Pros SOC 2 Audit Services`. PDF preferred.
