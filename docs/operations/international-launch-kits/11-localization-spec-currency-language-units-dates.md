---
title: International Localization Specification
date: 2026-04-25
status: draft
owner: Sherpa Pros Engineering Lead + Country GMs
wave: F — International Country Launch Kits
---

# International Localization Specification

> Specification for currency, language, units of measure, date formats, trade nomenclature, and brand handling across the four locked international markets: Canada (Year 1), United Kingdom (UK) (Year 2), Australia (AU) (Year 3), European Union (EU) pilot Berlin (Year 4-5).

## Principles

1. **One Sherpa Pros umbrella brand globally.** No country sub-brands. Per the brand bible's national-to-international identity rule.
2. **Locale = country + language + region**, not country alone (Canada is en-CA + fr-CA; future EU rollout adds fr-FR, it-IT, es-ES, etc.).
3. **Defaults via IP geolocation**, **overrideable by user profile preference**.
4. **Multi-currency native via Stripe Connect** per country (see `09-stripe-connect-per-country-setup-and-fx.md`).
5. **Translate; don't transliterate.** Native speakers + trade-specialist review on every locale.

---

## Currency

| Country / locale | Currency | International Organization for Standardization (ISO) 4217 code | Display format | Example |
|---|---|---|---|---|
| United States | US Dollar | USD | `$X,XXX.XX` (en-US) | $1,250.00 |
| Canada | Canadian Dollar | CAD | `$X,XXX.XX` (en-CA) or `X XXX,XX $` (fr-CA per Office québécois de la langue française (OQLF)) | CA$1,250.00 / 1 250,00 $ CA |
| United Kingdom | British Pound | GBP | `£X,XXX.XX` (en-GB) | £1,250.00 |
| Australia | Australian Dollar | AUD | `$X,XXX.XX` (en-AU) | A$1,250.00 |
| EU pilot — Germany | Euro | EUR | `X.XXX,XX €` (de-DE) | 1.250,00 € |

### Implementation

- Prices stored in **integer minor units** (cents-equivalent of local currency, like Stripe).
- Display via `Intl.NumberFormat(locale, { style: 'currency', currency })` or equivalent server-side i18n library.
- **Cross-currency display** (e.g., showing USD-equivalent for Canadian pros viewing US-denominated reference data) is opt-in only; default is single-currency per locale.

### Pricing parity strategy

- Local pricing per market — **do not** convert US Dollar prices at spot FX. Each country GM sets local-currency pricing tiers based on local market research + parity benchmarking.

---

## Language

### Day-1 language per country

| Country | Day-1 language | Add-on language | Add-on timing |
|---|---|---|---|
| United States | English (en-US) | Spanish (es-US) | Already roadmapped (US Phase 4+) |
| Canada | English (en-CA) | French (fr-CA, Quebec) | **Start of Canada Year 2** (Quebec metro launch) |
| United Kingdom | English (en-GB) | (none required) | — |
| Australia | English (en-AU) | (none required) | — |
| EU pilot Germany | German (de-DE) | English (en-DE for HQ + comms) | English Day 1 (alongside German) |
| **Future EU rollout** | French, Italian, Spanish, Dutch, etc. | per country | **Deferred** — evaluate per country at second-EU-country selection |

### Translation vendor + process

| Function | Vendor recommendation |
|---|---|
| Translation Management System (TMS) | **Lokalise** (preferred) or **Smartling** |
| Machine translation (first pass) | **DeepL Pro** (especially strong for fr-CA and de-DE) |
| Native + trade-specialist review | Country-specific freelance trade-specialist translator pool, sourced via TMS |

### Quality gates

- 100% native-speaker review of all marketing + Sherpa-app surfaces.
- 100% trade-specialist review of trade nomenclature + codes-engine surfaces.
- Quarterly user-feedback review with country GM.
- Locale-specific User Acceptance Testing (UAT) before any locale Go-Live.

---

## Units of measure

| Country | Construction-trade convention | Default |
|---|---|---|
| United States | Imperial (feet, inches, pounds, gallons, °F) | Imperial |
| Canada | **Imperial in construction trades** (despite formal metrification); some metric in commercial / engineered | **Imperial default**, metric toggle |
| United Kingdom | **Imperial in construction trades** (despite formal metrification — UK construction widely uses feet/inches alongside metric) | **Imperial default**, metric toggle |
| Australia | Metric (millimetres, metres, kilograms, litres, °C) | Metric |
| EU pilot Germany | Metric | Metric |

### Implementation

- Per-jurisdiction toggle in user profile (default per IP geolocation).
- Conversion library handles unit transforms; canonical storage in **metric minor units** internally; display per user preference.
- Codes-engine citations preserve source units (e.g., a Canadian electrical code citing CSA C22.1 in metric stays metric in display).

---

## Date format

| Locale | Format | Example |
|---|---|---|
| en-US | MM/DD/YYYY | 04/25/2026 |
| en-CA | DD/MM/YYYY default; YYYY-MM-DD ISO 8601 also widely used in government + business | 25/04/2026 or 2026-04-25 |
| fr-CA | YYYY-MM-DD (Office québécois de la langue française recommendation) | 2026-04-25 |
| en-GB | DD/MM/YYYY | 25/04/2026 |
| en-AU | DD/MM/YYYY | 25/04/2026 |
| de-DE | DD.MM.YYYY | 25.04.2026 |

### Implementation

- `Intl.DateTimeFormat(locale)` or equivalent; do not hardcode formats.
- Time zones: per-locale default + user override. Sherpa Pros internal data canonical Coordinated Universal Time (UTC); display per user.

---

## Trade nomenclature

Construction-industry vocabulary varies materially across English-speaking markets. Trade nomenclature must be localized **above and beyond** general translation.

| Concept | en-US | en-CA | en-GB | en-AU |
|---|---|---|---|---|
| Trade pros | "trade pros" / "tradesmen" | "trade pros" / "tradespeople" | "tradespeople" / "tradesmen" | "tradies" |
| Homeowners | "homeowners" | "homeowners" | "homeowners" / "homeowners" | "homeowners" |
| General contractor (lead trade-coordinator) | "GC" / "general contractor" | "general contractor" | "main contractor" | "head contractor" / "builder" |
| Trade-supply store | "supply house" | "supply house" / "trade desk" | "builders' merchant" | "trade outlet" |
| Quote / estimate | "estimate" | "estimate" | "quote" / "estimate" | "quote" |
| Job-site safety officer | "site safety officer" | "site safety officer" | "site safety manager" | "site safety supervisor" |
| Permit | "permit" | "permit" | "planning permission" / "building control approval" | "approval" / "permit" |
| Inspection | "inspection" | "inspection" | "building control inspection" | "council inspection" |
| Payment terms | "Net 30" | "Net 30" | "30 days end of month" | "Net 30" |

### Implementation

- Locale-specific glossary maintained per market in TMS (Lokalise / Smartling).
- Country GM signs off glossary at Phase 0 of country launch.
- Glossary review quarterly with country trade-association partners.

### EU pilot German nomenclature notes

| Concept | German term |
|---|---|
| Trade pros | "Handwerker" (skilled craftspeople — for Anlage A regulated trades) / "Gewerbetreibende" (general tradespeople) |
| Master craftsman | "Meister" (Meisterbrief required for Anlage A trades under Handwerksordnung) |
| Customer / client | "Kunde" / "Kundin" |
| Quote | "Angebot" |
| Invoice | "Rechnung" |
| Building permit | "Baugenehmigung" |
| Inspection | "Bauabnahme" |

---

## Trademark filings (per country)

Per `10-canada-entity-formation-and-compliance.md` Phase 3 (Canada is exemplar; same pattern for UK / AU / EU pilot).

| Country | Trademark office | Recommended filing timing |
|---|---|---|
| Canada | **Canadian Intellectual Property Office (CIPO)** | 6-12 months before Canada launch |
| United Kingdom | **United Kingdom Intellectual Property Office (UKIPO)** | 6-12 months before UK launch |
| Australia | **IP Australia** | 6-12 months before AU launch |
| EU pilot | **European Union Intellectual Property Office (EUIPO)** (covers all 27 EU member states with one mark) + **Deutsches Patent- und Markenamt (DPMA — German Patent and Trade Mark Office)** as backup national registration | 6-12 months before EU pilot launch |

### Marks to file (per country)

- **Sherpa Pros** wordmark (primary)
- **Sherpa Pros logo** (figurative mark)
- **Sherpa Marketplace** wordmark
- **Sherpa Hub** wordmark
- (Sherpa Materials engine + Sherpa codes engine: internal use; consider filing only if used externally as product names)

### Filing classes (Nice Classification, applicable across CIPO / UKIPO / IP Australia / EUIPO)

- Class 35 — Advertising, business management, marketplace services
- Class 36 — Insurance, financial services
- Class 37 — Construction services
- Class 42 — Computer software, Software-as-a-Service (SaaS)
- Class 45 — Legal / regulatory services

### Per-country trademark filing budget

| Country | Budget per country (USD) |
|---|---|
| Canada (CIPO) | $5,000 – $12,000 |
| United Kingdom (UKIPO) | $4,000 – $10,000 |
| Australia (IP Australia) | $4,000 – $10,000 |
| EU pilot (EUIPO + DPMA) | $7,000 – $18,000 (EUIPO is more expensive but covers all EU) |
| **4-country trademark total** | **USD $20,000 – $50,000** |

---

## Brand variants — single umbrella, no sub-brands

Per locked brand bible: **do NOT create country sub-brands** (e.g., do NOT create "Sherpa Pros Canada" as a distinct brand identity). Instead:

- One global "Sherpa Pros" brand with country-disambiguation in legal entity name + footer + locale switcher.
- Country GMs lead **brand-marketing voice adaptation** per market (e.g., AU prefers more direct casual tone than UK; EU pilot Germany prefers more formal "Sie" pronoun than en-US informal tone).
- Brand bible centrally owned by Sherpa Pros HQ Marketing; country-specific tone-of-voice annexes added per country at launch.

---

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Translation quality regression as content scales | TMS-managed glossary + 100% native review + quarterly country GM signoff |
| Locale fragmentation (Quebec French regulatory carve-outs) | Quebec handled as distinct locale + counsel signoff before Quebec launch |
| Currency-display ambiguity ("$" without country prefix is confusing in en-CA / en-AU) | Always disambiguate currency in display ("CA$" / "A$" / "US$") |
| Trade nomenclature mismatch (e.g., calling AU tradies "tradesmen") | Country GM signs off glossary at Phase 0; trade-association partner review |
| Trademark conflict in country (existing "Sherpa" mark holder) | Counsel-conducted clearance search 12+ months before filing; alternative class strategy where conflicts found |

---

*Maintained jointly by Engineering Lead + Country GMs; signed off by COO at each country launch.*
