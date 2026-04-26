---
title: Stripe Connect Per-Country Setup + Foreign Exchange (FX) Hedging
date: 2026-04-25
status: draft
owner: CEO Phyrom (Phase 4A) / Chief Financial Officer (CFO) (Phase 4B+) + Country GMs
wave: F — International Country Launch Kits
---

# Stripe Connect Per-Country Setup + Foreign Exchange (FX) Strategy

> Payment-rail and currency-management runbook for the four locked international markets: Canada, United Kingdom (UK), Australia (AU), European Union (EU) pilot Berlin.

## Goal

Per-country Stripe Connect platform live by Country Year 1 launch (6 months ahead of pro onboarding starts), with clean local-currency take-rate collection and US Dollar (USD) sweep to Sherpa Pros HQ for consolidation.

## Per-country Stripe Connect platform setup

| Country | Stripe entity | Primary currency | Cross-border / multi-currency notes |
|---|---|---|---|
| **Canada** | Stripe Canada (Stripe Payments Canada Ltd.) | Canadian Dollar (CAD) | Native cross-border CAD ↔ USD with embedded foreign-exchange (FX); Interac e-Transfer payouts available for pros |
| **United Kingdom** | Stripe UK (Stripe Payments UK Limited) | British Pound (GBP) | Post-Brexit, **separate platform from EU**; supports GBP, USD, EUR collection with FX |
| **Australia** | Stripe Australia (Stripe Payments Australia Pty Ltd) | Australian Dollar (AUD) | Native AUD payouts; supports New Zealand Dollar (NZD) cross-border for future NZ expansion |
| **EU pilot** | Stripe EU (Stripe Payments Europe Limited, headquartered Ireland) | Euro (EUR) | **One Stripe EU platform serves entire European Economic Area (EEA)** via Single Euro Payments Area (SEPA); German Value-Added Tax (VAT) registration mandatory; cross-border EU rollout (France, Netherlands, Austria) requires no additional Stripe platform — just per-country tax registrations |

## Connect account types

| Account type | Sherpa Pros usage | Why |
|---|---|---|
| **Standard** (Stripe-hosted onboarding, full Stripe-managed compliance) | **Phase 4 international Phase 1 — recommended** | Lowest operational lift, fastest to launch, Stripe handles Know Your Customer (KYC) + tax form distribution |
| **Express** (Stripe-hosted onboarding, partial platform branding) | Phase 4B graduation candidate (Year 3+ international) | More branded experience, still Stripe-managed compliance |
| **Custom** (full platform control, platform owns onboarding + UI + KYC obligations) | Far-future, post-Series A international | Maximum control + brand experience, but heavy compliance burden |

**Locked decision:** **Standard accounts for all 4 international launches.** Reassess Express graduation in Year 3 of each country.

## Per-country onboarding requirements (for the Sherpa Pros Connect platform itself)

Each country Sherpa Pros entity (created per `10-canada-entity-formation-and-compliance.md` and equivalents) must complete Stripe Connect platform onboarding as the platform operator. Standard requirements:

| Requirement | Canada | UK | Australia | EU pilot Germany |
|---|---|---|---|---|
| **Tax identification number** | Business Number (BN) + Goods and Services Tax (GST) / Harmonized Sales Tax (HST) registration | UK Company Number (Companies House) + Value Added Tax (VAT) number | Australian Business Number (ABN) + Goods and Services Tax (GST) registration | Handelsregister (Commercial Register) number + Umsatzsteuer-Identifikationsnummer (USt-IdNr — VAT ID) |
| **Business registration** | Federal CBCA (Canada Business Corporations Act) incorporation | Companies Act 2006 incorporation | Corporations Act 2001 (Pty Ltd) registration | Gesellschaft mit beschränkter Haftung (GmbH) registration with Handelsregister |
| **Beneficial owner KYC** | Phyrom + ≥ 25% UBO disclosure | Persons of Significant Control (PSC) register | Beneficial owner disclosure | Wirtschaftlich Berechtigter (Beneficial Owner) registration in Transparenzregister |
| **Bank account in country** | Canadian bank (Royal Bank of Canada (RBC), Toronto-Dominion Bank (TD), Bank of Montreal (BMO), Scotiabank, or fintech equivalent (Wise Business)) | UK bank (HSBC, Barclays, NatWest, or fintech equivalent (Wise Business, Revolut Business)) | Australian bank (Commonwealth Bank, Westpac, ANZ, NAB, or Wise Business) | German bank (Deutsche Bank, Commerzbank, N26 Business, Wise Business) |
| **Director residency** | 25% Canadian-resident directors required (CBCA) | No statutory residency rule | No statutory residency rule | No statutory residency, but local Geschäftsführer (Managing Director) strongly recommended |
| **Stripe platform Letter of Intent (LOI)** signed | Yes | Yes | Yes | Yes |

## Pro onboarding to country Connect platform

For each pro (independent contractor) onboarded to a country Sherpa Pros marketplace:

| Field | Canada | UK | Australia | EU pilot Germany |
|---|---|---|---|---|
| Tax ID | Social Insurance Number (SIN) (sole-prop) or Business Number (incorp) | National Insurance number + Unique Taxpayer Reference (UTR) (sole trader) or Company Number (limited) | Australian Business Number (ABN) + Tax File Number (TFN) | Steueridentifikationsnummer + USt-IdNr (if VAT-registered) |
| Bank for payouts | Canadian bank account | UK bank account | Australian bank account | German / SEPA-zone bank account |
| KYC documents | Government photo ID + proof of address | Government photo ID + proof of address | Government photo ID + proof of address | Personalausweis (national ID) + Meldebescheinigung (residence registration) |
| Tax form distribution | Stripe issues T4A (Statement of Pension, Retirement, Annuity, and Other Income) | Stripe issues annual earnings summary; pro self-files Self Assessment | Stripe issues annual payment summary | Stripe issues annual earnings summary; pro self-files Einkommensteuererklärung |

## Take-rate collection model

- Sherpa Pros take rate is collected in **local currency** at point of transaction.
- Collected funds are held in country Stripe Connect platform balance.
- **Monthly sweep** to USD-denominated Sherpa Pros HQ operating account.
- **FX exposure** is the gap between local-currency collection date and USD sweep date.

## Foreign-exchange (FX) hedging strategy

### Phase 1 — Pre-launch + early launch (monthly volume < USD $200K equivalent per country)

- **Strategy:** spot conversion via Wise Business or Convera (formerly Western Union Business) at sweep time.
- **Rationale:** transaction volume too low to justify forward contracts; spot is cheaper net-of-fee at low volumes.
- **Cost:** ~0.4-0.6% Wise Business fee on top of mid-market rate; far cheaper than commercial bank wire FX (~1.5-3.0%).

### Phase 2 — Scaled launch (monthly volume USD $200K – $1M equivalent per country)

- **Strategy:** **30-day FX forward contracts** locked in monthly with FX vendor (Wise Business at lower volumes; Convera or commercial bank treasury desk above ~USD $500K monthly).
- **Rationale:** hedges 30-day exposure; locks in budgeted CAD/GBP/AUD/EUR rates for HQ planning.
- **Cost:** 0.2-0.5% forward premium / discount above spot, depending on currency pair + tenor.

### Phase 3 — Mature (monthly volume > USD $1M equivalent per country)

- **Strategy:** **30/60/90-day rolling forward stack** + treasury function (in-house or outsourced via fintech treasury services like Hedgeflows, Bound, or Embedded Finance).
- **Rationale:** smooths multi-month earnings; supports CFO budgeting and Board reporting.
- **Cost:** 0.2-0.4% forward premium + treasury overhead.

### FX vendor recommendation

| Vendor | Best for | Notes |
|---|---|---|
| **Wise Business** | Phase 1 + Phase 2 (any country) | Mid-market FX rates + transparent fees; multi-currency receiving accounts available; ideal for spot + small forwards |
| **Convera** (ex-Western Union Business) | Phase 2 (mid-volume) | Established corporate FX; strong forward contract pricing |
| **Commercial bank treasury** (RBC Capital Markets, Barclays Treasury, Westpac Institutional, Deutsche Bank Treasury) | Phase 3 (mature) | Best institutional pricing at scale; bundles with credit + cash management |
| **Hedgeflows / Bound** (fintech treasury) | Phase 3 alternative | Treasury-as-a-service; lower overhead than building in-house treasury |

## Stripe local fees (pass-through to ledger only — not marked up to pros / clients)

| Country | Stripe local fee | Sherpa Pros markup |
|---|---|---|
| Canada | 2.9% + CAD $0.30 per transaction | **None** (pass-through) |
| UK | 1.5% + GBP £0.20 per transaction (UK domestic cards) | **None** |
| Australia | 1.7% + AUD $0.30 per transaction (AU domestic cards) | **None** |
| EU pilot | 1.5% + EUR €0.25 per transaction (EEA cards) | **None** |

> Higher fees apply to non-domestic cards in each country (typically 2.9-3.5% + cross-border fee). All fees disclosed to pros + clients in pricing transparency. Sherpa Pros take rate sits on top of Stripe fees.

## VAT / GST / HST / PST collection

| Country | Tax | Rate | Marketplace obligation |
|---|---|---|---|
| Canada | Goods and Services Tax (GST) federal | 5% | Marketplace collects + remits |
| Canada | Harmonized Sales Tax (HST) Ontario, NB, NL, NS, PEI | 13% – 15% | Marketplace collects + remits per province |
| Canada | Provincial Sales Tax (PST) BC, SK, MB | 6% – 7% | Per-province registration + collection |
| Canada | Quebec Sales Tax (QST) | 9.975% | Separate Quebec Revenue Agency (Revenu Québec) registration |
| UK | Value Added Tax (VAT) | 20% standard | Marketplace collects + remits via HMRC |
| Australia | Goods and Services Tax (GST) | 10% | Marketplace collects + remits via Australian Taxation Office (ATO) |
| EU pilot Germany | Umsatzsteuer (VAT) | 19% standard | Marketplace collects + remits via Bundeszentralamt für Steuern; **EU One-Stop-Shop (OSS)** simplifies cross-border EU rollout |

## Per-country setup budget

| Line item | Budget per country (USD) |
|---|---|
| Stripe Connect platform onboarding (legal + accounting time) | $5,000 – $10,000 |
| Local bank account opening (legal + accounting) | $3,000 – $7,000 |
| FX vendor setup (Wise Business, Convera, etc.) | $2,000 – $5,000 |
| Tax registration (VAT / GST / HST) (per-jurisdiction tax counsel) | $5,000 – $15,000 |
| Initial tax compliance system integration | $10,000 – $25,000 |
| **Total per country** | **USD $25,000 – $62,000** |

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| FX moves materially against USD between collection and sweep | Forward-contract hedging at scale (Phase 2 onward); shorten sweep cadence at high volatility |
| Stripe denies platform onboarding for marketplace use case | Engage Stripe Partnerships team early (12+ months); pre-clear use case in writing |
| VAT / GST collection misregistration triggers penalty | Engage in-country tax counsel from Day 1; tax-engine partner (Avalara, Vertex, or local equivalent) |
| Pro KYC failure rate too high in country | Pre-test KYC flow with 5-pro pilot before scaled launch; offer human-assisted KYC fallback |
| Quebec QST registration overlooked | Explicit Quebec carve-out in Canada compliance checklist |
| EU pilot OSS misregistration | German tax counsel signoff before any EU cross-border |

---

*Owned by CEO Phyrom (Phase 4A); transitioned to CFO once CFO seat is filled.*
