---
title: Canada Entity Formation + Regulatory Compliance Runbook
date: 2026-04-25
status: draft
owner: Canada Country General Manager + Sherpa Pros General Counsel
country: Canada
launch_year: Y1 of Phase 4 (Months 19-30)
wave: F — International Country Launch Kits
---

# Canada Entity Formation + Compliance Runbook

> Detailed runbook for standing up the Canadian operating entity, regulatory + tax registrations, insurance, and trademark filings ahead of Canada Year 1 launch. Canada is the **first international country** — this runbook is the deepest, and serves as the template for UK / AU / EU pilot.

## Goal

By Phase 4 Month 18 (6 months before Canada Year 1 launch at Month 19), have **Sherpa Pros Canada Inc.** fully formed, registered, banked, insured, tax-registered, and trademarked.

## Phase plan

| Phase | Window | Scope |
|---|---|---|
| Phase 0 | Phase 4 Month 12 → 14 | Entity choice + counsel engagement |
| Phase 1 | Phase 4 Month 14 → 16 | Federal incorporation + extra-provincial registration |
| Phase 2 | Phase 4 Month 16 → 18 | Tax registrations + bank + insurance |
| Phase 3 | Phase 4 Month 18 → 22 | Trademark filings + trade-licensing research |
| Phase 4 | Phase 4 Month 22 → 30 | Post-launch ongoing compliance |

---

## Phase 0: Entity choice + counsel engagement (M12 to M14)

### Entity choice analysis

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| **Federal incorporation under Canada Business Corporations Act (CBCA)** | Operate in any province / territory under one charter; federal name protection; flexibility | 25% Canadian-resident director requirement | **Recommended** |
| **Ontario incorporation under Ontario Business Corporations Act (OBCA)** | No resident director rule (since 2021 amendment); cheaper than federal at small scale | Ontario-only name protection; need extra-provincial registration to operate elsewhere | Backup |
| **Branch of Sherpa Pros (US) parent** | No new entity | Tax + liability complexity; not generally recommended | Avoid |
| **Quebec incorporation** | Quebec presence | Quebec linguistic + governance complexity | Avoid for primary entity |

**Locked decision: federal CBCA numbered company, named "Sherpa Pros Canada Inc."** Director residency requirement met by Phyrom (if Canadian-resident) + 1 Canadian-resident advisor / board member + Canada Country GM (if Canadian-resident).

### Counsel engagement

| Function | Recommended firms |
|---|---|
| Corporate / commercial counsel | **Stikeman Elliott LLP** (Toronto), **Osler, Hoskin & Harcourt LLP** (Toronto), **Bennett Jones LLP** (Toronto / Calgary), or boutique alternative **Kalfa Law Firm** (cost-conscious option) |
| Tax counsel | **KPMG Canada** or **Deloitte Canada** tax practice |
| Privacy / data counsel | **Stikeman Elliott** privacy practice or **Osler** privacy |
| Employment / worker classification | **Hicks Morley** (national employment specialist) |
| Franchise counsel (if master-franchisee model adopted Canada) | **Cassels Brock & Blackwell LLP** franchise practice |

**Counsel engagement budget:** CAD $40,000 – $80,000 for entity formation + initial regulatory readiness.

### Activities

- [ ] Engage Stikeman Elliott (or equivalent) as primary corporate counsel.
- [ ] Confirm director slate (Phyrom + ≥ 1 Canadian-resident).
- [ ] Reserve "Sherpa Pros Canada Inc." name through Corporations Canada NUANS (Newly Updated Automated Name Search) report.

---

## Phase 1: Incorporation + extra-provincial registration (M14 to M16)

### Activities

- [ ] **Federal incorporation** under CBCA via Corporations Canada online filing.
  - Articles of Incorporation drafted by counsel.
  - Statutory minimum CAD ~$200 federal incorporation fee (DIY base fee).
- [ ] **Registered office** established in Toronto (or Ottawa as alternative).
- [ ] **First Directors Resolution** + **Bylaws** adopted.
- [ ] **Initial Return** filed with Corporations Canada within 60 days.
- [ ] **Extra-provincial registration** in each province where Sherpa Pros Canada will operate:
  - Ontario: Ontario Business Registry
  - British Columbia: BC Registries
  - Alberta: Alberta Corporate Registry
  - Quebec: Registraire des entreprises du Québec (REQ)
  - Each province imposes annual filing + small fee; **register in metro launch provinces first** (Ontario at Day 1; BC + QC + AB by Year 2 metro launches).
- [ ] **Minute book** maintained by counsel from Day 1.

### Cost (Phase 1)

| Line item | Budget (CAD) |
|---|---|
| Federal CBCA incorporation fee | $200 |
| Counsel time (incorporation + initial governance) | $15,000 – $25,000 |
| Extra-provincial registration (4 provinces) | $2,000 – $4,000 |
| Registered office (year 1 if leased through service) | $1,500 – $3,000 |
| **Phase 1 subtotal** | **CAD $19,000 – $32,000** |

---

## Phase 2: Tax + bank + insurance (M16 to M18)

### Tax registrations

| Registration | Issuer | Required when |
|---|---|---|
| **Business Number (BN)** | Canada Revenue Agency (CRA) | Day 1 |
| **GST/HST account (RT)** | CRA | Mandatory once revenue > CAD $30,000/year (we register voluntarily Day 1) |
| **Provincial Sales Tax (PST)** registration | Per-province (BC: PST online; SK; MB) | Per-province Day 1 of metro launch in that province |
| **Quebec Sales Tax (QST)** registration | Revenu Québec (separate from CRA) | When Quebec metro launches (Year 2 Canada) |
| **Payroll account (RP)** | CRA | When first Canadian employee hired (Country GM Day 1) |
| **Import-export account (RM)** | CRA | If physical materials cross borders (likely not for marketplace platform; placeholder) |
| **WSIB (Workplace Safety and Insurance Board) Ontario account** | WSIB | Day 1 of any Ontario employee work |
| **WorkSafeBC account** | WorkSafeBC | When first BC employee hired |
| **WCB Alberta account** | WCB Alberta | When first AB employee hired |
| **CNESST account** (Quebec) | Commission des normes, de l'équité, de la santé et de la sécurité du travail | When first Quebec employee hired |

### Bank account

- [ ] **Primary operating account** opened with one of: Royal Bank of Canada (RBC), Toronto-Dominion Bank (TD), Bank of Montreal (BMO), Scotiabank, or fintech alternative **Wise Business** (lower fees, multi-currency native; recommended for Phase 1).
- [ ] **Stripe Canada Connect platform bank link** completed (see `09-stripe-connect-per-country-setup-and-fx.md`).
- [ ] **Corporate credit card** (Brex Canada, Float, or bank-issued).

### Insurance broker engagement

- [ ] Engage **Marsh Canada** or **Aon Canada** or **Hub International Canada** as primary commercial insurance broker.
- [ ] **Canada-specific policies bound** before launch:
  - Commercial General Liability (CGL) — CAD $5M limits
  - Professional Liability / Errors & Omissions (E&O) — CAD $5M limits
  - Cyber Liability + Privacy Breach — CAD $5M limits (PIPEDA-driven)
  - Directors & Officers (D&O) — CAD $3M – $5M limits
  - Employment Practices Liability (EPL) — CAD $2M limits
  - Workers' compensation per province (WSIB / WorkSafeBC / WCB / CNESST) — statutory coverage
- [ ] Insurance broker briefed on Sherpa Pros pro / client liability framework (cross-reference `liability-insurance-framework.md` in repo).

### Cost (Phase 2)

| Line item | Budget (CAD) |
|---|---|
| Tax counsel + accounting setup (KPMG / Deloitte) | $20,000 – $40,000 |
| Bank account opening + corporate credit | $1,000 – $3,000 |
| Insurance broker fees + first-year premiums | $40,000 – $80,000 |
| **Phase 2 subtotal** | **CAD $61,000 – $123,000** |

---

## Phase 3: Trademark filings + trade-licensing research (M18 to M22)

### Trademark filings

- [ ] **Sherpa Pros wordmark** filed at **Canadian Intellectual Property Office (CIPO)**.
  - Classes: 35 (advertising, business services), 36 (insurance, financial), 37 (construction services), 42 (computer software), 45 (legal/regulatory).
- [ ] **Sherpa Pros logo (figurative mark)** filed at CIPO — same classes.
- [ ] **Sherpa Marketplace, Sherpa Hub, Sherpa Materials, Sherpa codes engine** subordinate marks evaluated for filing (recommend file Sherpa Marketplace + Sherpa Hub at minimum; Materials + codes engine internal-only enough to skip).
- [ ] **Domain defense**: secure sherpapros.ca, sherpapros.com.ca redirects.
- [ ] CIPO filing budget: **CAD $5,000 – $12,000** for 3-5 marks across all classes (filing fees + counsel).

### Trade-licensing research

- [ ] Per-province trade certification regime documented in operations playbook:
  - Ontario: **Skilled Trades Ontario** (replaced dissolved Ontario College of Trades 2019)
  - British Columbia: **Industry Training Authority (ITA)**
  - Alberta: **Apprenticeship and Industry Training**
  - Quebec: **Commission de la construction du Québec (CCQ)**
- [ ] Per-trade certification mapping for top 10 Canadian trades on Sherpa Pros marketplace (electrician, plumber, carpenter, drywall, framer, roofer, HVAC technician, mason, painter, general contractor).
- [ ] Pro vetting pipeline integration: API or document-upload verification of trade ticket / certificate of qualification per pro per province.

### Worker classification

- [ ] Counsel-issued memo on Canada Revenue Agency (CRA) common-law tests for **independent contractor vs employee** for Sherpa Pros pros.
- [ ] **Phase 1 default: pros are independent contractors** (mirrors US Phase 1 model).
- [ ] CRA control + integration + financial-risk + ownership-of-tools tests applied; counsel-validated playbook.
- [ ] **Quebec note:** distinct Quebec Civil Code worker-classification regime + CCQ registration may apply for certain Quebec construction trades. Specialist Quebec counsel engaged before Quebec metro launch.

### Cost (Phase 3)

| Line item | Budget (CAD) |
|---|---|
| Trademark filing fees + counsel (CIPO) | $5,000 – $12,000 |
| Trade-licensing research + integration counsel | $15,000 – $30,000 |
| Worker-classification counsel memo | $8,000 – $15,000 |
| Quebec specialist counsel (Year 2 prep) | $10,000 – $20,000 |
| **Phase 3 subtotal** | **CAD $38,000 – $77,000** |

---

## Phase 4: Post-launch ongoing compliance (M22 onward)

### Ongoing obligations

- [ ] **Annual return** to Corporations Canada (filed within 60 days of anniversary).
- [ ] **Annual extra-provincial returns** per registered province.
- [ ] **Quarterly GST/HST filings** to CRA.
- [ ] **Quarterly per-province PST / QST filings** as applicable.
- [ ] **Annual T2 Corporation Income Tax Return** to CRA.
- [ ] **WSIB / WorkSafeBC / WCB / CNESST quarterly premium reporting**.
- [ ] **PIPEDA breach reporting** within 24 hours of any reportable breach.
- [ ] **Annual D&O renewal** + insurance program renewal.
- [ ] **Annual trademark renewals** at CIPO (10-year cycle but use-status review annually).

### Cost (Phase 4 — annual)

| Line item | Budget (CAD per year) |
|---|---|
| Counsel (general retainer + ad-hoc) | $40,000 – $80,000 |
| Tax accounting + filing | $30,000 – $60,000 |
| Insurance program renewal | $40,000 – $90,000 |
| Compliance software (privacy + tax + payroll) | $15,000 – $25,000 |
| **Phase 4 annual ongoing** | **CAD $125,000 – $255,000 / year** |

---

## Total Canada entity + compliance investment

| Phase | One-time (CAD) | Year-1 ongoing (CAD) |
|---|---|---|
| Phase 0 | counsel scoping (in Phase 1 budget) | — |
| Phase 1 | $19,000 – $32,000 | — |
| Phase 2 | $61,000 – $123,000 | — |
| Phase 3 | $38,000 – $77,000 | — |
| Phase 4 ongoing | — | $125,000 – $255,000 |
| **Total Year 1** | **CAD $118,000 – $232,000** one-time + **$125,000 – $255,000** ongoing | **CAD $243,000 – $487,000 Year 1 all-in** |

USD-equivalent ≈ **$180,000 – $360,000 Canada Year 1 entity + compliance**.

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| 25% Canadian-resident director requirement triggers governance complexity | Recruit Canadian board member / advisor early; or use OBCA Ontario incorporation as fallback (no resident-director rule) |
| Quebec linguistic obligations (Charter of the French Language / Bill 101) trigger French-language requirements | Engage Quebec counsel before Quebec launch; budget for full French localization in Year 2 |
| WSIB / per-province workers' comp gap | Provincial WCB registrations completed before any in-province employee work |
| PIPEDA / Quebec Law 25 breach = significant penalty | Privacy program + breach response plan in place from Day 1; cyber insurance bound |
| Pro classification challenged by CRA | Counsel-validated playbook; written pro contracts mirror US 1099 model |
| Trademark squatting in Canada | File at CIPO 6-12 months before launch; secure .ca domain + key social handles |

---

*This runbook is the template for UK, AU, EU pilot entity formation. Each country's legal structure differs but the phase shape (entity choice → incorporation → tax/bank/insurance → trademark/licensing → ongoing) is reusable.*
