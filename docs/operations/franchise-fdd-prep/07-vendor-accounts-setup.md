---
title: Vendor Accounts Setup — Franchise Operations Support
date: 2026-04-25
status: draft
owner: Phyrom + future Vice President of Franchise Development (VPFD) + future Chief Operating Officer (COO)
phase: Phase 4 (M18+) — Franchise Operations Infrastructure
references:
  - docs/superpowers/specs/2026-04-25-franchise-model-design.md
  - docs/superpowers/plans/2026-04-25-franchise-model-plan.md (WS3-4, WS5-2, WS5-3)
  - docs/operations/franchise-fdd-prep/05-7-stage-screening-templates.md
total_year_1_vendor_budget: $48,000–$78,000 (line-item totals below)
---

# Vendor Accounts Setup — Franchise Operations Support

## 1. Vendor Inventory + Recommendation Summary

| Vendor Category | Recommended Primary | Backup | Phase 4 Year 1 Budget |
|---|---|---|---|
| Franchise management software | FranConnect | FranchiseSoft | $12K–$18K |
| Franchise agreement e-signature | OpenSign (self-hosted, low-cost) | DocuSign | $0–$3K |
| 24/7 prospect inquiry handling | Defer to Phase 4 Year 2 (volume gating) | AnswerNet (when triggered) | $0 (Year 1) |
| Royalty + technology fee auto-debit | Stripe Connect (existing platform) | BlueSnap | < $1K platform fees |
| Marketing fund management | Separate Sherpa Pros Marketing Fund LLC + dedicated bank account + audit trail | n/a | $3K–$5K formation + $2K annual audit |
| Background check + credit check | HireRight + Experian Business | FranchiseGrade + BoeFly | $550 per prospect (reimbursed) |
| Franchise legal counsel | Spadea Lignana (per `01-attorney-evaluation-matrix.md`) | Cheng Cohen | Per `01` document budget |
| Audit firm | BDO USA Franchise Services (per `02-audit-firm-evaluation.md`) | Marcum | Per `02` document budget |

---

## 2. Franchise Management Software — FranConnect (RECOMMENDED PRIMARY)

### 2.1 Why FranConnect

- **Industry-standard** — used by 800+ franchisors including emerging-system franchisors at Sherpa Pros' scale (Years 1–5)
- **Modular** — pay only for the modules needed in Phase 4 Year 1 (Sales + Operations); add Marketing + FAC later
- **API-extensible** — integrates with Stripe Connect (royalty pulls), QuickBooks Online (corporate accounting), and HubSpot or Salesforce (lead management) without custom development
- **Compliance-ready** — FDD distribution tracking, prospect 14-day waiting period clock, state-by-state filing matrix tracking, royalty calculation + collection module
- **Reporting** — pre-built dashboards for franchisee P&L roll-up (per `03-item-19-economics-spreadsheet.md` data needs)

### 2.2 Phase 4 Year 1 Modules

| Module | Function | Estimated Annual Cost |
|---|---|---|
| Sales Module (FranConnect Sales) | Prospect pipeline (7-stage screening), FDD distribution tracking, 14-day waiting period clock, state-by-state filing matrix | $6K–$9K |
| Operations Module (FranConnect Operations) | Franchisee performance dashboard, monthly P&L upload + roll-up, royalty calculation, marketing fund tracking | $6K–$9K |
| **Total Phase 4 Year 1** | | **$12K–$18K** |

### 2.3 Phase 4 Year 2+ Add-On Modules

| Module | Function | Estimated Annual Cost |
|---|---|---|
| Marketing Module | National + regional campaign distribution, marketing fund spend tracking, co-op approval workflow | $4K–$6K |
| FAC Module | Franchise Advisory Council communication, voting, document distribution | $2K–$3K |
| Field Visits Module | Quarterly Business Review scheduling, field-visit checklists, photo upload, compliance audit | $3K–$5K |

### 2.4 Account Setup Steps (Phase 4 Year 1 Month 1)

1. Schedule FranConnect demo with their emerging-franchisor sales team
2. Request 90-day pilot at 50% standard pricing (industry-standard for emerging franchisors)
3. Configure Sherpa Pros LLC entity, brand, and product taxonomy in FranConnect
4. Configure 7-stage screening pipeline (matches `05-7-stage-screening-templates.md`)
5. Configure state-by-state filing matrix (NH/ME/MA/VT non-registration; NY/RI/MD/VA Phase 4 Year 2 priority; remaining 10 Phase 4 Year 3)
6. Configure royalty calculation logic (6% Year 1 / 8% Year 2+ + 2% Marketing Fund + $200/month Tech Fee)
7. Configure franchisee P&L upload template (matches `03-item-19-economics-spreadsheet.md` line items)
8. Train VPFD + COO + Phyrom on platform (8-hour training session)
9. Configure Single Sign-On (SSO) integration with Sherpa Pros LLC corporate Google Workspace account
10. Confirm Service Level Agreement (99.5% uptime target) + data export rights (so Sherpa Pros can leave FranConnect at any future point without data lock-in)

### 2.5 Backup: FranchiseSoft

- Smaller installed base than FranConnect (~300 franchisors)
- Lower price point ($8K–$12K Year 1 estimated)
- Less mature integration ecosystem (Stripe Connect integration less battle-tested)
- Reasonable backup if FranConnect declines, prices above budget, or won't support emerging-franchisor pilot pricing

---

## 3. Franchise Agreement E-Signature — OpenSign (RECOMMENDED PRIMARY)

### 3.1 Why OpenSign

- **Cost** — open-source, self-hostable, $0 base cost (vs DocuSign Business Pro ~$600/year per user); reference doc `reference_esign_research.md` already validated OpenSign for beta deployment
- **Control** — self-hosted means franchise agreement signing data stays on Sherpa Pros infrastructure (no third-party SaaS payment protection risk)
- **FTC compliance** — supports the audit-trail requirements for Item 23 receipt pages (date/time stamping, IP capture, signed document hash chain)
- **Scale path** — adequate for Phase 4 Years 1–3 franchise agreement volume (5–25 signings per year); migrate to DocuSeal or DocuSign at scale

### 3.2 Account Setup Steps

1. Deploy OpenSign on Sherpa Pros Vercel/DigitalOcean infrastructure (per existing platform deployment patterns)
2. Configure Sherpa Pros LLC entity branding (logo, colors, signing-page template per brand portfolio)
3. Upload all template documents from `05-7-stage-screening-templates.md`:
   - Mutual Non-Disclosure Agreement template
   - FDD receipt page (Item 23)
   - Sherpa Hub Franchise Agreement
   - Sherpa Brand License Agreement
   - Sherpa Software License Agreement
   - Personal Guaranty Agreement
4. Configure signature workflows (sequential signing for multi-party documents)
5. Configure audit log + retention policy (7 years per franchise industry standard)
6. Test full signing flow with internal staff before any prospect signing

### 3.3 Backup: DocuSign

- Mature, name-brand, $0 setup risk
- $600–$1,200/year per user pricing; 5-user team estimated $4K–$6K Year 1
- Use as backup if OpenSign deployment hits production issues or if prospect counsel insists on a name-brand e-signature (rare but possible with sophisticated franchise prospects)

---

## 4. 24/7 Franchise Prospect Inquiry Handling — DEFER TO PHASE 4 YEAR 2

### 4.1 Phase 4 Year 1 Approach

Franchise prospect inquiry volume in Phase 4 Year 1 is expected at 50–150 inquiries (per `06-hub-2-candidate-list.md` 12–15 active candidates × 4–10x funnel ratio). VPFD + Phyrom can handle inquiry response within 2 business days at this volume without third-party answering service.

### 4.2 Phase 4 Year 2 Trigger

When monthly inquiry volume exceeds 30 inquiries OR average response time exceeds 24 hours, engage 24/7 answering service to maintain Stage 1 auto-response promise.

### 4.3 Recommended Vendor: AnswerNet

- Franchise-industry-specialized answering service
- Estimated cost: $1.50–$3.00 per inquiry handled (call back, email response, screening question answer)
- 30-inquiry/month pace = $45–$90/month — small, easy expense to justify when triggered
- Backup vendor: Specialty Answering Service (SAS) — comparable pricing

### 4.4 Account Setup Steps (when triggered)

1. Issue Request for Proposal to AnswerNet + Specialty Answering Service
2. Train answering-service team on 7-stage screening flow + Sherpa Pros brand voice
3. Configure call-routing logic (qualified prospects → VPFD; out-of-scope inquiries → email response template)
4. Configure FranConnect integration (logged inquiries flow into pipeline automatically)
5. Quarterly performance review (response time, qualification accuracy, prospect feedback)

---

## 5. Royalty + Technology Fee Auto-Debit — Stripe Connect

### 5.1 Why Stripe Connect

- **Already in use** — Sherpa Pros platform already runs Stripe Connect for marketplace payments per `CLAUDE.md` tech stack
- **Compliance** — Stripe Connect supports Automated Clearing House (ACH) auto-debit with NACHA-compliant authorization workflow
- **Cost** — ACH transfer fees < 1% per transaction; cheaper than alternative franchise-collection platforms
- **Audit trail** — every royalty pull is auditable in Stripe dashboard + Sherpa Pros database (matches FDD Item 6 disclosure requirements)
- **Reconciliation** — automated reconciliation against franchisee's monthly P&L upload in FranConnect (catches underreporting per FDD Item 6 audit fee trigger)

### 5.2 Royalty + Tech Fee Collection Flow

```
1. Franchisee uploads monthly P&L to FranConnect by 15th of following month (per FDD Item 9 obligation)
2. FranConnect calculates royalty (6% Y1 / 8% Y2+) + Marketing Fund (2%) + Tech Fee ($200 flat)
3. FranConnect generates royalty invoice and pushes to Stripe Connect API
4. Stripe Connect auto-debits franchisee's authorized bank account on the 20th of the month
5. Royalty + Marketing Fund + Tech Fee land in Sherpa Pros LLC operating account (royalty + tech fee) and Sherpa Pros Marketing Fund LLC account (marketing fund) per the routing logic
6. Reconciliation report emailed to franchisee + filed in audit trail
```

### 5.3 Account Setup Steps

1. Enable Stripe Connect ACH debit for Sherpa Pros LLC (existing account; toggle ACH-debit feature flag)
2. Configure routing rules (royalty + Tech Fee → Sherpa Pros LLC operating account; Marketing Fund → Sherpa Pros Marketing Fund LLC dedicated account)
3. Build FranConnect → Stripe Connect integration (webhook on royalty calculation completion)
4. Build NACHA authorization workflow into franchisee onboarding (signed at Stage 7 with Franchise Agreement)
5. Test end-to-end with Hub #1 (corporate-owned, simulated) before first franchisee signs
6. Document escalation path for failed debits (insufficient funds, closed account, fraud alert)

### 5.4 Backup: BlueSnap

- Alternative payments platform with strong franchise-collection module
- Higher per-transaction cost than Stripe Connect
- Use only if Stripe Connect ACH-debit feature unavailable in any required state (none expected, but verify)

---

## 6. Marketing Fund Management — Separate LLC + Dedicated Bank Account

### 6.1 Why Separate LLC

- **FDD Item 11 disclosure compliance** — Marketing Fund contributions must be held in a separate fund account, not commingled with franchisor general funds
- **Annual audit requirement** — Marketing Fund spend must be auditable separately from franchisor operations (FDD Item 11 disclosure obligation; audit recommended industry-standard even when not legally mandatory)
- **Franchisee transparency** — separate LLC + bank account simplifies disclosure to franchisees of where their 2% Marketing Fund contribution is spent
- **Tax treatment** — separate-entity treatment simplifies franchisor tax filings (Marketing Fund spend is not franchisor revenue, not franchisor expense — passes through cleanly)

### 6.2 Setup Steps

1. **Form Sherpa Pros Marketing Fund LLC** (Delaware LLC, single-member managed by Sherpa Pros LLC). Estimated formation cost: $500–$1,000 plus first-year Delaware franchise tax (~$300).
2. **Open dedicated bank account** at the same banking partner as Sherpa Pros LLC (recommend Mercury or Brex for fintech-native experience; Live Oak Bank if SBA-friendly is priority). Estimated: $0 setup.
3. **Configure Stripe Connect routing** so 2% Marketing Fund pulls land in Marketing Fund LLC account, not Sherpa Pros LLC operating account.
4. **Engage independent CPA for annual Marketing Fund audit.** Recommend BDO USA Franchise Services (the same firm engaged for Sherpa Pros LLC Item 21 audit per `02-audit-firm-evaluation.md`) — coordinated audit reduces total cost. Estimated: $2K–$3K Year 1; $1.5K–$2.5K Year 2+.
5. **Establish Marketing Fund Charter document** that specifies allowable spend categories (per FDD Item 11):
   - National brand campaigns (television, podcast, paid social, public relations, search engine marketing)
   - Regional co-op campaigns (when 3+ adjacent Hubs co-fund)
   - Franchise-system lead generation (paid search to franchise prospect website)
   - Brand asset development (photography, video, design system updates)
   - Annual Franchisee Summit production costs
   - Sherpa University training facility branding
6. **Excluded spend categories** (must NOT be charged to Marketing Fund):
   - Franchisor general operations (salaries, rent, utilities)
   - Litigation costs
   - Franchisor business development unrelated to franchise sales
   - Founder personal travel or compensation
7. **FAC oversight** (when Franchise Advisory Council seated in Phase 4 Year 2 per WS5-4): FAC reviews Marketing Fund spend quarterly; FAC can challenge spend at Annual Franchisee Summit. FAC recommendation is advisory; final spend authority rests with Sherpa Pros LLC.

### 6.3 Total Year 1 Cost

- LLC formation: $500–$1,000
- First-year Delaware franchise tax: $300
- Bank account: $0
- Annual audit: $2K–$3K
- **Total Year 1: $2.8K–$4.3K**

---

## 7. Background Check + Credit Check Vendors

### 7.1 Background Check — HireRight

- Industry-standard franchise vendor
- Federal + state criminal records, sex offender registry, employment verification, education verification
- Estimated cost per check: $150–$250
- Turnaround: 3–5 business days

### 7.2 Credit Check — Experian Business + Personal

- Business credit report (if prospect has existing business)
- Personal credit report (FICO + Vantage)
- Estimated cost per check: $50–$150
- Turnaround: < 24 hours

### 7.3 Combined Application Processing Fee

- Sherpa Pros charges prospect $550 application processing fee at Stage 6
- Covers: HireRight check ($200 avg) + Experian Business + Personal ($100 avg) + VPFD review time ($250 estimated)
- Reimbursable per FDD Item 6 disclosure
- Account setup: standard franchise-industry vendor onboarding (1–2 weeks)

---

## 8. Vendor Setup Sequencing — Phase 4 Year 1 Months 1–6

| Month | Vendor Setup |
|---|---|
| Month 1 | FranConnect demo + RFP; OpenSign deployment kickoff; Stripe Connect ACH debit toggle review |
| Month 2 | FranConnect contract signed + module configuration; OpenSign template upload; Sherpa Pros Marketing Fund LLC formation |
| Month 3 | FranConnect 7-stage pipeline configured; OpenSign first internal-test signing; Marketing Fund LLC bank account active |
| Month 4 | FranConnect royalty calculation logic configured; HireRight + Experian vendor accounts active; Marketing Fund Charter ratified |
| Month 5 | End-to-end signing flow test (FranConnect → OpenSign → Stripe Connect); Marketing Fund first annual audit firm engaged |
| Month 6 | Production-ready vendor stack; first prospect Stage 1 inquiry runs through full vendor stack as live test |

## 9. Vendor Risk Notes + Open Questions

- **FranConnect contract negotiation leverage** — emerging-franchisor pilot pricing requires Sherpa Pros to commit to FranConnect for 24+ months. Negotiate data-export rights aggressively to avoid lock-in.
- **OpenSign self-hosting risk** — if Sherpa Pros loses an OpenSign instance to infrastructure failure, signed franchise agreements could become unrecoverable. Document backup + disaster recovery procedure before first production signing.
- **Stripe Connect ACH-debit timing** — confirm Stripe ACH-debit availability in every state where Sherpa Pros plans to sell franchises (no expected gaps but verify).
- **Marketing Fund audit firm conflict** — using BDO USA for both Sherpa Pros LLC Item 21 audit AND Marketing Fund LLC audit is acceptable per AICPA independence standards (separate engagements, separate financial statements). Document the engagement structure to demonstrate independence.
- **NACHA ACH-debit fraud risk** — every franchisee ACH authorization is exposure point for fraud or chargeback. Configure Stripe Connect fraud-screening rules + dual-authorization for any debit > $10K/month.
- **Vendor consolidation opportunity** — if FranConnect adds e-signature capability natively (rumored Phase 4 Year 2 product roadmap), consider consolidating from FranConnect + OpenSign to FranConnect-only. Re-evaluate Phase 4 Year 2.
