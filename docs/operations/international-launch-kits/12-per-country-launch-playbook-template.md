---
title: Per-Country Launch Playbook Template
date: 2026-04-25
status: draft
owner: Country General Manager (instantiated per country)
wave: F — International Country Launch Kits
---

# Per-Country Launch Playbook — Template

> Reusable per-country launch playbook, parameterized for any country. Mirrors the Sherpa Pros United States Phase 0 / Phase 1 / Phase 2 launch model. Each country General Manager (GM) instantiates this template with country-specific values and operates against it.

## Merge fields

| Field | Description | Example (Canada Y1) |
|---|---|---|
| `{{country}}` | Country full name | Canada |
| `{{country_short}}` | Country short / ISO | CA |
| `{{currency}}` | ISO 4217 currency code | CAD |
| `{{primary_metro}}` | Phase 1 launch metro | Toronto |
| `{{secondary_metros}}` | Phase 2 expansion metros | Vancouver, Montreal, Calgary |
| `{{language_primary}}` | Day-1 operating language | English |
| `{{language_addon}}` | Year-2 add-on language | French (Quebec) |
| `{{trade_assoc_majors}}` | Major trade associations | CHBA, OHBA, CCA |
| `{{master_franchise_status}}` | Direct-operate or master-franchisee | Direct-operate Y1; reassess Y2 |
| `{{crowdfunding_platform}}` | Local equity-crowdfunding platform | FrontFundr, Equivesto |

---

## Phase shape (mirrors US Phase 0/1/2)

| Phase | Window | Focus |
|---|---|---|
| Phase 0 | Months -6 to 0 (pre-launch) | Country GM hire, entity, payments, codes, trademark, insurance, regulatory readiness, founding partners |
| Phase 1 | Months 0 to 6 | Beta launch in `{{primary_metro}}`, founding-pro + founding-client cohorts |
| Phase 2 | Months 6 to 12 | Scaled launch across 3-4 metros, paid acquisition, partnerships, seed-equivalent funding |
| Phase 3+ | Month 12+ | Sustained growth + master-franchisee development (where applicable) + secondary-country planning (in EU pilot case) |

---

## Phase 0 — Pre-launch (Month -6 to 0)

### Country GM hire
- [ ] Search firm engaged per `06-recruiting-search-firm-engagement.md`.
- [ ] 4-round interview process completed.
- [ ] GM in seat **6 months before launch**.

### Entity formation
- [ ] Local operating entity stood up per `10-canada-entity-formation-and-compliance.md` (template; country-specific runbook for `{{country}}`).
- [ ] Director slate confirmed (note: Canada CBCA requires 25% Canadian-resident; Germany strongly prefers local Geschäftsführer; UK + AU have no statutory residency rule).
- [ ] Counsel + tax accountant + insurance broker engaged.

### Payment rails
- [ ] Stripe Connect platform in `{{country}}` per `09-stripe-connect-per-country-setup-and-fx.md`.
- [ ] Local bank account opened.
- [ ] Foreign Exchange (FX) vendor engaged (Wise Business Phase 1 default).
- [ ] Tax registrations (Value-Added Tax (VAT) / Goods and Services Tax (GST) / Harmonized Sales Tax (HST) / Provincial Sales Tax (PST) per country).

### Codes ingestion
- [ ] Codes vendor selected per `07-codes-vendor-evaluation-framework.md`.
- [ ] Federal codes ingested before launch (Phase 1 of country's codes runbook — Canada: CSA Group, UK: BSI + Approved Documents, AU: ABCB, EU pilot: DIN).
- [ ] Validation test set ≥ 50 lookups passing at ≥ 95%.

### Trademark filings
- [ ] Sherpa Pros wordmark + logo + Sherpa Marketplace + Sherpa Hub filed per `11-localization-spec-currency-language-units-dates.md`.
- [ ] Local domain (.ca / .co.uk / .com.au / .de) secured.

### Insurance broker
- [ ] In-country broker engaged (Marsh / Aon / Hub or country specialist).
- [ ] All policies bound: Commercial General Liability (CGL), Professional Liability / Errors & Omissions (E&O), Cyber / Privacy, Directors & Officers (D&O), Employment Practices Liability (EPL), Workers' Comp per region.

### Regulatory readiness
- [ ] Privacy program in place (Personal Information Protection and Electronic Documents Act (PIPEDA) / United Kingdom General Data Protection Regulation (UK GDPR) / Privacy Act 1988 / GDPR-BDSG depending on country).
- [ ] Worker classification counsel memo issued.
- [ ] Trade-licensing-per-jurisdiction matrix documented.
- [ ] Building-codes engine localized.

### Master-franchisee identification (if applicable)
- [ ] For markets where master-franchisee is leading hypothesis (Australia + EU pilot), identify candidate partners.
- [ ] Specialist franchise counsel engaged.
- [ ] Franchise Disclosure Document (FDD) / equivalent prepared per country (mandatory in Australia under Franchising Code of Conduct; mandatory in 5 Canadian provinces under provincial Franchise Acts; voluntary in UK + Germany).

### Local advisor + board member recruitment
- [ ] 1-2 in-country advisors recruited (paid USD $10,000 – $25,000 advisor honorarium).
- [ ] Optional: 1 in-country board member recruited (especially valuable for Canada + UK).

---

## Phase 1 — Beta launch (Month 0 to 6)

### Beta cohort: 10-15 founding pros in `{{primary_metro}}`
- [ ] Mirror US Phase 1 cohort design (10-pro beta).
- [ ] Sourcing channels:
  - Country GM personal trade-supply network (e.g., Toronto Country GM leverages Home Depot Canada Pro Desk + RONA + Patrick Morin warm intros).
  - Trade-association partnership outreach (`{{trade_assoc_majors}}`).
  - Local trade-show presence (Canadian Construction Expo, UK Specifi, AU Sydney Build, EU pilot BAU München).
  - Founder-voice content: Phyrom + Country GM joint LinkedIn + local trade-press.

### Localization launch
- [ ] All Phase 0 localization deliverables live:
  - Currency display (`{{currency}}`).
  - Language (`{{language_primary}}`).
  - Trade nomenclature glossary signed off.
  - Date format + units.

### Founding-client recruiting
- [ ] 50+ founding clients matched in `{{primary_metro}}`.
- [ ] Sourcing channels:
  - Local press placements (real-estate + design + home-improvement publications).
  - LinkedIn founder-voice content (Phyrom + Country GM).
  - Local realtor + interior-designer partnerships.
  - Beta referral incentive program.

### Beta gov't grant applications (per country)

| Country | Candidate grants |
|---|---|
| Canada | Industrial Research Assistance Program (IRAP), Strategic Innovation Fund (SIF), Canadian Digital Adoption Program (CDAP), provincial innovation grants (e.g., Ontario's OCI Innovation Grants) |
| UK | Innovate UK Smart Grants, Help to Grow: Digital, regional growth hubs |
| Australia | Research and Development (R&D) Tax Incentive, Export Market Development Grants (EMDG), state-level innovation grants |
| EU pilot Germany | EXIST Forschungstransfer, Bundesministerium für Wirtschaft und Klimaschutz (BMWK) digital grants, EU Horizon Europe |

- [ ] Country GM submits ≥ 1 grant application within 90 days of launch.

### Local equity-crowdfunding (where applicable)

| Country | Platform |
|---|---|
| Canada | **FrontFundr** or **Equivesto** (Canadian Securities Administrators (CSA)-regulated equity crowdfunding) |
| UK | **Seedrs** or **Crowdcube** (Financial Conduct Authority (FCA)-regulated) |
| Australia | **Birchal** or **OnMarket** (Crowd-Sourced Funding (CSF) regime under Australian Securities and Investments Commission (ASIC)) |
| EU pilot Germany | **Companisto** or **Seedmatch** (EU Crowdfunding Service Providers Regulation (ECSP)) |

- [ ] Country GM evaluates local crowdfunding; if pursued, registration + offering complete within Phase 1.

### Phase 1 success criteria
- [ ] 10-15 founding pros active.
- [ ] 50+ founding clients matched, jobs completed.
- [ ] Net Promoter Score (NPS) ≥ 60.
- [ ] First Letter of Intent (LOI) with `{{trade_assoc_majors}}` partnership.

---

## Phase 2 — Scaled launch (Month 6 to 12)

### Multi-metro expansion
- [ ] Expand from `{{primary_metro}}` to 2-3 of `{{secondary_metros}}`.
- [ ] Per-metro beta cohort design replays Phase 1 (10-15 pros each).

### Paid acquisition
- [ ] Channels live: Meta (Facebook + Instagram) ads, TikTok ads, Google Search / Performance Max, country-specific channels (e.g., AU prefers Domain.com.au + RealEstate.com.au + hipages display; UK adds Checkatrade-equivalent display).
- [ ] Initial Phase 2 paid acquisition budget: USD $200,000 – $500,000 per country across 6-month Phase 2 window.

### Local PR
- [ ] In-country PR firm engaged (Edelman / Weber Shandwick / FleishmanHillard country office, or boutique).
- [ ] Phyrom + Country GM media tour at Phase 2 launch.

### Partnerships
- [ ] National trade-association partnership signed (`{{trade_assoc_majors}}` lead).
- [ ] National training-institution partnership (e.g., Canadian Apprenticeship Forum, UK Construction Industry Training Board (CITB), Master Builders Australia training arm, German Handwerkskammer).
- [ ] Supplier-network partnerships (e.g., Home Depot Canada Pro, Travis Perkins UK, Bunnings Trade AU, Bauhaus / Hornbach EU pilot).

### Seed-equivalent funding
- [ ] Country-level seed round (where applicable) — typical USD $1M – $5M-equivalent per country.
- [ ] Investor base: country-specific construction-tech and B2B SaaS investors.
  - Canada: Real Ventures, Inovia Capital, BDC Capital
  - UK: Octopus Ventures, Northzone, LocalGlobe
  - AU: Blackbird Ventures, Square Peg, AirTree
  - EU pilot Germany: Earlybird, Cherry Ventures, Holtzbrinck

### Phase 2 success criteria
- [ ] 3-4 metros live.
- [ ] 100+ active pros across country.
- [ ] 500+ jobs completed cumulative.
- [ ] Country Gross Merchandise Value (GMV) ≥ `{{currency}}` 5M annualized (varies per country — Canada CAD $7M, UK GBP £4M, AU AUD $7M, EU pilot EUR €4M).
- [ ] Country contribution margin ≥ break-even.

---

## Per-country adaptations (NOT one-size-fits-all)

### Tax + payment + regulatory specifics
- Per `09-stripe-connect-per-country-setup-and-fx.md`, `10-canada-entity-formation-and-compliance.md`, and country-specific runbooks.

### Language localization
- Per `11-localization-spec-currency-language-units-dates.md`. Note Quebec carve-out (Canada Year 2 fr-CA add-on); German Day 1 for EU pilot.

### Local brand-marketing voice
- AU prefers **direct, casual, dry-humor tone**; ex-Bunnings + ex-hipages voice models.
- UK prefers **formal-but-warm tone**; ex-FMB + ex-MyBuilder voice models.
- Canada English mostly mirrors US with slight dial-down on superlatives; Canada French (Quebec Year 2) is a distinct voice.
- EU pilot Germany prefers **formal "Sie" pronoun by default**; switches to informal "du" only for younger pro audiences (TikTok, Instagram Stories).

### Master-franchisee model decision per country

| Country | Initial direction | Rationale |
|---|---|---|
| Canada | **Direct-operate Y1; reassess Y2** | Geographically + culturally close to US; HQ direct ops viable |
| UK | **Direct-operate Y1; reassess Y2** | Single-time-zone country; mature trade-tech ecosystem; HQ direct ops viable |
| Australia | **Master-franchisee leading hypothesis** | Geographic distance + state-fragmentation make master-franchisee compelling |
| EU pilot Germany | **Master-franchisee leading hypothesis for EU rollout** (direct-operate Berlin Y1) | German Day 1 direct; EU rollout (France / Netherlands / Austria Y2-3) via master-franchisee |

---

## Per-country traction-metric dashboard

Standard Sherpa Pros metrics, surfaced per country and aggregated to global Sherpa Pros HQ dashboard:

| Metric | Definition |
|---|---|
| Pro count | Active pros (matched ≥ 1 job in last 90 days) |
| Job count | Jobs completed (cumulative + monthly) |
| Gross Merchandise Value (GMV) | Total transaction value through marketplace |
| Take rate | Sherpa Pros revenue / GMV |
| Net Promoter Score (NPS) | Pro NPS + Client NPS, separately reported |
| Time-to-match | Median minutes from client request to first pro response |
| Match rate | % of client requests matched within 24 hours |
| Repeat-client rate | % of clients with ≥ 2 completed jobs |
| Pro retention | % of pros active after 6 / 12 months |
| Country contribution margin | Country revenue – country direct costs |

### Reporting cadence
- Daily ops dashboard (Country GM + HQ COO).
- Weekly metric review (Country GM + HQ COO).
- Monthly Country Council read-out (all Country GMs + COO + CEO).
- Quarterly Board update.

---

## Phase 3+ — Sustained growth (Month 12+)

- [ ] Continued multi-metro expansion.
- [ ] Master-franchisee operationalization (where applicable).
- [ ] Secondary-country planning (specifically EU pilot Country GM scopes second EU country in Year 2 of EU pilot).
- [ ] Country product-feedback loops back into Sherpa Pros HQ product roadmap via Country Council.

---

## Risks + mitigations (per-country instantiation)

| Risk (template) | Country GM mitigation |
|---|---|
| Country GM washes out in Year 1 | 90 / 180 / 365-day performance gates, monthly Phyrom 1:1 Year 1, Board check-in 90 days |
| Local trade-association partnership fails to materialize | Backup: secondary trade-association (e.g., if CHBA fails for Canada, pivot to Canadian Construction Association (CCA)) |
| Codes ingestion delayed past launch | Phase delivery (federal Day 1, provincial / state in Phase 1, municipal in Phase 2); soft-launch in primary metro only with federal coverage |
| Stripe Connect platform onboarding rejected | Engaged Stripe Partnerships team 12+ months ahead; pre-cleared use case in writing |
| Insurance program gap discovered post-launch | Quarterly insurance program review; broker accountability + monthly claims dashboard |
| Master-franchisee underperforms or breaches contract | FDD-equivalent disclosure + clear performance termination clauses in country-specific franchise agreements |
| Country fails to hit Phase 2 funding round | Bridge from Sherpa Pros HQ + extend Phase 2 by 6 months; reassess country GM + market thesis |

---

*This template is instantiated per country at Phase 0 kickoff. Country GM owns instantiation; COO signs off.*
