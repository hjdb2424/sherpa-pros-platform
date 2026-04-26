---
title: Canada Codes Ingestion — Detailed Runbook (Year 1 Launch)
date: 2026-04-25
status: draft
owner: Canada Country General Manager + Sherpa Pros Engineering Lead
country: Canada
launch_year: Y1 of Phase 4 (Months 19-30)
wave: F — International Country Launch Kits
---

# Canada Codes Ingestion Runbook

> Detailed phase-by-phase runbook for ingesting Canadian building codes into the **Sherpa codes engine**. Canada is the **first international launch country** — we go deepest here, then templatize for UK, Australia, EU pilot.

## Goal

By Canada Year 1 launch end (Phase 4 Month 30), the Sherpa codes engine returns correct citation + paragraph for **≥ 95% of test code lookups** across 5 trade categories (electrical, plumbing, structural, fire, building) for **federal codes + Ontario provincial overlay + Toronto municipal overlay**.

## Phase plan

| Phase | Window | Scope |
|---|---|---|
| Phase 1 | Phase 4 Month 16 → Month 19 (M-3 to M0) | Federal baseline ingestion |
| Phase 2 | Phase 4 Month 19 → Month 22 (M0 to M+3) | Provincial overlay (4 provinces — ON, BC, AB, QC) |
| Phase 3 | Phase 4 Month 22 → Month 25 (M+3 to M+6) | Municipal overlay (Toronto, Vancouver, Montreal) |
| Phase 4 | Phase 4 Month 25+ (M+6+) | Remaining provinces + territories |

---

## Phase 1: Federal baseline (M-3 to M0)

### Vendor

**Canadian Standards Association (CSA Group)** direct — commercial license.

### Codes to ingest

| Code | Abbreviation | Trade categories |
|---|---|---|
| National Building Code of Canada | NBCC | Building, structural, fire |
| National Electrical Code Canada | CSA C22.1 | Electrical |
| National Fire Code | NFC | Fire |
| National Plumbing Code | NPC | Plumbing |
| National Energy Code of Canada for Buildings | NECB | Energy / mechanical |

### Activities

- [ ] CSA Group commercial license negotiated — confirm marketplace use rights, redistribution scope, per-organization vs per-user licensing, API access vs document download.
- [ ] Sherpa Pros Engineering ingests CSA standards into Sherpa codes engine schema.
- [ ] Build automated change-detection feed against CSA publication releases.
- [ ] Validation test set v1 built (50 federal-only test lookups across 5 trade categories).
- [ ] Sherpa codes engine returns ≥ 95% pass rate on federal baseline test set.

### Cost (Phase 1)

| Line item | Budget (CAD) |
|---|---|
| CSA Group commercial license (Year 1) | $40,000 – $60,000 |
| Engineering ingestion + schema build | $25,000 – $40,000 |
| Validation test set build | $10,000 – $15,000 |
| **Phase 1 subtotal** | **CAD $75,000 – $115,000** (USD ≈ $55,000 – $85,000) |

---

## Phase 2: Provincial overlay (M0 to M+3)

### Provinces (in priority order)

1. **Ontario** — Ontario Building Code (OBC) via Ontario Ministry of Municipal Affairs and Housing. Ontario uses **Skilled Trades Ontario** for trade certification.
2. **British Columbia** — British Columbia Building Code (BCBC) via BC Building and Safety Standards Branch. BC uses **Industry Training Authority (ITA)**.
3. **Alberta** — Alberta Building Code (ABC) via Alberta Municipal Affairs. Alberta uses **Apprenticeship and Industry Training**.
4. **Quebec** — Code de Construction du Québec (CCQ) via Régie du bâtiment du Québec (RBQ). Quebec is **French-language source** — translation pipeline required. Quebec uses **Commission de la construction du Québec (CCQ — also the certification body, distinct from the building code itself)**.

### Activities (per province)

- [ ] Provincial code commercial license or government PDF acquired.
- [ ] Engineering ingests provincial overlay into Sherpa codes engine, layered on federal baseline.
- [ ] **Quebec only:** engage translation vendor (recommend **Translatewise** or equivalent) for French-to-English ingestion; native-translator review for trade-specific nomenclature.
- [ ] Validation test set expanded by 30 lookups per province (4 provinces × 30 = 120 additional test lookups).
- [ ] Sherpa codes engine returns ≥ 95% pass rate on federal + provincial overlay test set.

### Cost (Phase 2 — 4 provinces)

| Line item | Budget (CAD) |
|---|---|
| Provincial code licenses (4 provinces) | $20,000 – $40,000 |
| Engineering ingestion + overlay build | $40,000 – $60,000 |
| Quebec French-to-English translation pipeline | $25,000 – $40,000 (one-time + maintenance) |
| Validation test set expansion | $15,000 – $20,000 |
| **Phase 2 subtotal** | **CAD $100,000 – $160,000** (USD ≈ $75,000 – $120,000) |

---

## Phase 3: Municipal overlay (M+3 to M+6)

### Municipalities

1. **Toronto** — Toronto Municipal Code (Chapter 363 Building Construction, Chapter 925 Building Permits, others)
2. **Vancouver** — Vancouver Building By-Law (VBBL — Vancouver has its own building code separate from BCBC)
3. **Montreal** — Montréal Construction Code (also French source)

### Activities (per municipality)

- [ ] Municipal code source acquired (most are free PDF download).
- [ ] Engineering ingests municipal overlay layered on provincial + federal.
- [ ] **Vancouver special case:** VBBL is materially different from BCBC and must be treated as a co-equal source, not just an overlay.
- [ ] **Montreal:** French translation pipeline reused from Phase 2.
- [ ] Validation test set expanded by 20 lookups per municipality.

### Cost (Phase 3 — 3 municipalities)

| Line item | Budget (CAD) |
|---|---|
| Municipal code acquisition (mostly free) | $0 – $5,000 |
| Engineering ingestion + overlay | $30,000 – $50,000 |
| Validation test set expansion | $10,000 – $15,000 |
| **Phase 3 subtotal** | **CAD $40,000 – $70,000** (USD ≈ $30,000 – $52,000) |

---

## Phase 4: Remaining provinces + territories (M+6 onward)

### Provinces + territories (in launch-priority order, gated by metro launches)

| Province / territory | Building code | Trade certification body |
|---|---|---|
| Nova Scotia (NS) | Nova Scotia Building Code | Nova Scotia Apprenticeship Agency |
| New Brunswick (NB) | New Brunswick Building Code | NB Apprenticeship and Occupational Certification |
| Manitoba (MB) | Manitoba Building Code | Apprenticeship Manitoba |
| Saskatchewan (SK) | Saskatchewan Construction Codes Act | Saskatchewan Apprenticeship and Trade Certification Commission |
| Newfoundland and Labrador (NL) | NL National Building Code (adopted federal) | NL Apprenticeship and Trades Certification |
| Prince Edward Island (PEI) | PEI Building Code | PEI Apprenticeship Office |
| Northwest Territories (NT) | National Building Code (adopted federal) + NT amendments | NT Apprenticeship |
| Yukon (YT) | National Building Code (adopted federal) + YT amendments | YT Apprenticeship |
| Nunavut (NU) | National Building Code (adopted federal) + NU amendments | NU Department of Family Services |

**Many adopt the federal NBCC with minor amendments**, so ingestion is cheaper per province than ON/BC/AB/QC.

### Cost (Phase 4 — 9 jurisdictions)

| Line item | Budget (CAD) |
|---|---|
| Code acquisition (mostly government, mostly free) | $5,000 – $15,000 |
| Engineering ingestion + overlay (lighter due to federal adoption) | $40,000 – $70,000 |
| Validation test set expansion | $15,000 – $25,000 |
| **Phase 4 subtotal** | **CAD $60,000 – $110,000** (USD ≈ $45,000 – $82,000) |

---

## Total Canada codes ingestion cost

| Phase | Budget (CAD) | Budget (USD ≈) |
|---|---|---|
| Phase 1 federal | $75,000 – $115,000 | $55,000 – $85,000 |
| Phase 2 provinces (4 priority) | $100,000 – $160,000 | $75,000 – $120,000 |
| Phase 3 municipal | $40,000 – $70,000 | $30,000 – $52,000 |
| Phase 4 remaining | $60,000 – $110,000 | $45,000 – $82,000 |
| **Year 1 total** | **CAD $275,000 – $455,000** | **USD ≈ $205,000 – $340,000** |

> Note: Year 1 total exceeds the per-country plan envelope of $80-150K because Canada is the **first international country and template builder** — engineering one-time costs (schema, ingestion pipeline, translation pipeline) are amortized across all subsequent countries. Steady-state Canada Year 2+ maintenance is ~CAD $30,000-50,000/year (~USD $22,000-37,000).

## Year 2+ maintenance

- [ ] Monthly automated re-ingestion checks against all CSA + provincial + municipal sources.
- [ ] 90-day diff alerts on any source change.
- [ ] Quarterly validation test re-run (full ≥ 250 test lookup set).
- [ ] Annual full code-edition re-ingestion when CSA / province publishes new edition (NBCC publishes ~5-year cycle; provincial codes ~3-5 year cycles).

## Validation test set (target ≥ 250 lookups by end of Year 1)

| Trade category | Phase 1 federal | Phase 2 provincial | Phase 3 municipal | Phase 4 remaining | Total |
|---|---|---|---|---|---|
| Electrical | 12 | 24 | 12 | 18 | 66 |
| Plumbing | 10 | 24 | 12 | 18 | 64 |
| Structural | 10 | 24 | 12 | 18 | 64 |
| Fire | 10 | 24 | 12 | 18 | 64 |
| Building (general) | 8 | 24 | 12 | 18 | 62 |
| **Total test lookups** | **50** | **120** | **60** | **90** | **320** |

Pass criterion: Sherpa codes engine returns correct citation + paragraph for ≥ 95% of test lookups (≥ 304 / 320 by end of Year 1).

## Translation pipeline (Quebec)

- **Vendor:** Translatewise (or equivalent specialist construction translation vendor).
- **Process:** Source CCQ (French) → automated machine translation (DeepL Pro or similar) → native-translator review → trade-specialist review for nomenclature → ingestion into Sherpa codes engine with bilingual citation (French source + English translation displayed).
- **Cost:** CAD $25,000 – $40,000 one-time + CAD $5,000 – $10,000 / year maintenance.
- **Quality gate:** specialist construction translator reviews 100% of translated content before publication.

## Update cadence + monitoring

- **CSA Group:** publishes amendments roughly every 12-18 months, full new editions every 5 years. Subscribe to CSA notification feeds.
- **Provinces:** publish amendments every 12-24 months, full new editions every 3-5 years. Per-province Government Gazette / official publication monitoring.
- **Municipalities:** by-law amendments more frequent (quarterly possible). Per-municipality clerk subscription.
- **Monthly re-ingestion check** automated; **quarterly full validation re-run** by Engineering + Country GM signoff.

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| CSA Group refuses marketplace-use license | Engage 12+ months ahead; offer revenue share / attribution; fall back to LawSource Canada aggregator |
| Quebec French translation quality is insufficient for trade nomenclature | Native + specialist construction translator double-review; bilingual display (French source visible) |
| Vancouver Building By-Law (VBBL) divergence from BCBC creates dual-source maintenance burden | Treat VBBL as co-equal source, separate ingestion pipeline, dedicated test lookups |
| Code editions change mid-launch and break Sherpa codes engine | 90-day diff alerts + automated re-ingestion + manual gate before publication |
| Trade certification body data (Skilled Trades Ontario, ITA BC, etc.) not codes per se but pro-vetting input | Tracked separately in pro vetting pipeline, not in codes engine |

---

*This runbook is the gold standard. UK / AU / EU pilot will reuse the phase structure with country-specific vendors per `07-codes-vendor-evaluation-framework.md`.*
