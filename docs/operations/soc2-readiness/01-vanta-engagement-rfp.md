---
title: Vanta Engagement RFP — SOC 2 Compliance Automation Platform
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead hire (Q3 2026)
references:
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
  - docs/superpowers/plans/2026-04-25-platform-scale-architecture-plan.md (WS6)
  - docs/operations/soc2-readiness/02-schellman-engagement-rfp.md
  - docs/operations/soc2-readiness/04-vendor-risk-register.md
soc2_controls: [CC1.1, CC1.2, CC1.3, CC1.4, CC2.1, CC3.1, CC3.2, CC4.1, CC5.1, CC6.1, CC6.2, CC6.3, CC7.1, CC7.2, CC8.1, CC9.1]
---

# Vanta Engagement RFP

## 1. Executive Summary

Sherpa Pros is a two-sided GTM marketplace (Next.js 16 / Neon Postgres / Clerk auth / Stripe Connect / Vercel) that dispatches verified construction trades to homeowners and PMs across the Northeast US. We are pursuing **SOC 2 Type 1 in Q4 2026 (90 days from contract)** and **SOC 2 Type 2 in Q4 2027** to unlock enterprise PM contracts (national homebuilders, REITs, multifamily operators) and to satisfy data-processing requirements from our payment, identity, and dispatch vendors.

This RFP solicits proposals from compliance-automation platforms to manage our SOC 2 readiness, evidence collection, vendor risk, employee training, and ongoing monitoring. **Recommended vendor: Vanta.** Alternative under evaluation: **Drata.**

## 2. Company Context

- **Company**: Sherpa Pros (operated by HJD Builders LLC)
- **Headcount today**: 1 (founder/owner Phyrom, NH-based)
- **Headcount projection**: 6 by end of Q3 2026 (1 SRE/Compliance, 2 senior engineers, 1 ops, 1 marketplace ops, 1 customer concierge)
- **Hosting**: Vercel (compute), Neon Postgres (database), AWS (Secrets Manager + S3 backup), Cloudflare (WAF)
- **Auth + identity**: Clerk + Okta or Google Workspace SSO
- **Payment processor**: Stripe Connect (payment protection + payouts)
- **Customer base at audit start**: 10-pro beta cohort plus closed homeowner pilot in metro Atkinson NH
- **Regulated data classes**: PII (homeowners + pros), payment instruments (tokenized via Stripe), homeowner property data, audit logs (7-year retention per Sherpa Guard policy)

## 3. Scope of Work

### 3.1 Year 1 (2026-Q3 through 2027-Q2)

- [ ] SOC 2 Trust Services Criteria mapping for Security, Availability, Confidentiality (Privacy + Processing Integrity optional Year 2)
- [ ] Automated evidence collection from: Vercel, Neon, Clerk, Stripe, AWS (Secrets Manager + IAM), Cloudflare, Datadog, GitHub, Linear, PagerDuty
- [ ] Pre-built control library mapped to Sherpa Guard middleware + audit_logs table
- [ ] Vendor risk register automation (start with 14 vendors per `04-vendor-risk-register.md`)
- [ ] Employee security awareness training (annual + onboarding modules; SOC 2 CC1.4 evidence)
- [ ] Background check integration (Checkr or equivalent) for new hires
- [ ] Policy template library (access mgmt, change mgmt, incident response, encryption, BCP/DR — minimum 18 policies)
- [ ] Continuous control monitoring with automated alerts when controls fail
- [ ] Auditor portal for Schellman to pull evidence directly without manual handoffs
- [ ] Trust Center / public security page (subdomain `trust.thesherpapros.com`)
- [ ] SOC 2 Type 1 audit support (Q4 2026)

### 3.2 Year 2 (2027-Q3 onward)

- [ ] SOC 2 Type 2 audit support (12-month observation window beginning Q4 2026)
- [ ] HIPAA readiness assessment (optional — for future health-related home services)
- [ ] ISO 27001 readiness assessment (optional — for international expansion)
- [ ] Penetration test coordination (annual, third-party, pre-Type 2)
- [ ] Customer security questionnaire automation (Whistic or built-in)

## 4. Pricing Targets

| Year | Target Range | Notes |
|------|--------------|-------|
| Year 1 | **$20K – $30K** | Includes Type 1 readiness, 25 employees pricing tier, all 8 framework integrations |
| Year 2+ | **$15K – $25K** | Renewal pricing; assumes no scope expansion beyond SOC 2 |
| Add-on: HIPAA module | $5K – $8K | Defer to 2028 |
| Add-on: ISO 27001 module | $8K – $12K | Defer to 2028 |
| Add-on: Pen test coordination | $0 (included) | Vendor coordinates third-party pen test we contract separately ($15K-$25K external) |

## 5. Selection Criteria + Scoring Matrix

| Criterion | Weight | Vanta target score | Drata target score |
|-----------|--------|--------------------|--------------------|
| Native integrations with our stack (Vercel, Neon, Clerk, Stripe, AWS, Cloudflare, Datadog, GitHub) | 25% | 9/10 | 9/10 |
| Auditor familiarity (Schellman pre-existing relationship) | 15% | 10/10 (preferred Schellman partner) | 8/10 |
| Pricing fit ($20-30K Y1 cap) | 15% | 8/10 | 8/10 |
| Time-to-Type-1 (90 days from contract) | 15% | 9/10 | 9/10 |
| Trust Center quality + customization | 10% | 9/10 | 8/10 |
| Continuous control monitoring depth | 10% | 9/10 | 9/10 |
| Employee training UX | 5% | 8/10 | 8/10 |
| Vendor risk module depth | 5% | 9/10 | 8/10 |

**Recommendation**: Engage **Vanta** as primary. Schellman has a long-standing partnership with Vanta which streamlines auditor-vendor handoffs and reduces evidence-collection friction during the Type 1 sprint.

## 6. Required Vendor Deliverables in Proposal

- [ ] Pricing for Year 1 + Year 2 with 6-employee, 25-employee, and 50-employee tiers
- [ ] Implementation timeline (target: kickoff to audit-ready in 90 days)
- [ ] List of integrations with named connectors for each item in Section 3.1
- [ ] Customer references: 3 SaaS startups under 25 employees who completed SOC 2 Type 1 within 120 days
- [ ] Confirmed Schellman partnership and named auditor liaison
- [ ] Sample Trust Center page from a comparable customer
- [ ] Annual security training catalog (modules covered, average completion time, languages supported)
- [ ] Data residency: confirm US-only data processing for Vanta tenant
- [ ] Vanta's own SOC 2 Type 2 report (current within 12 months)
- [ ] Standard MSA + DPA with redline tolerance

## 7. Timeline

| Milestone | Target Date |
|-----------|-------------|
| RFP issued | 2026-05-01 |
| Vendor demos completed | 2026-05-15 |
| Vendor selection | 2026-05-22 |
| Contract signed | 2026-06-01 |
| Vanta kickoff + integrations live | 2026-06-08 |
| Policy library finalized | 2026-06-22 |
| Employee training rolled out | 2026-07-06 |
| Pre-audit gap assessment | 2026-08-15 |
| Schellman fieldwork begins | 2026-09-15 |
| SOC 2 Type 1 report delivered | 2026-12-15 |
| Type 2 observation window opens | 2026-09-15 |

## 8. Decision Authority

- **Decision owner**: Phyrom (founder)
- **Signoff required from**: Future SRE/Compliance hire (target Q3 2026); legal counsel reviews MSA + DPA
- **Budget approval**: Tied to Phase 0 fundraise close (see `project_sherpa_pros_gtm_phase_0.md`)

## 9. Submission Instructions

Email proposals to `compliance@thesherpapros.com` (alias to Phyrom inbox until SRE hire). Subject line: `RFP — Sherpa Pros Compliance Automation`. PDF preferred. Q&A window 2026-05-01 to 2026-05-08; questions answered in batch on 2026-05-09.
