# Sherpa Pros International Expansion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the four-country international expansion sequence (Canada Year 1, United Kingdom Year 2, Australia Year 3, European Union pilot Year 4 to 5) defined in `docs/superpowers/specs/2026-04-25-international-expansion-design.md`. This plan covers the per-country runbook tasks, parameterized for each country, plus the foundational work that must happen once globally before any country starts Phase 0.

**Architecture:** Six parallel work streams (WS1 through WS6) executed in sequence per country. Critical path: Country General Manager hire (gates everything in-country) → Codes ingestion plus Payment rails plus Regulatory readiness (parallel) → Localization → Per-country Phase 0/1/2 launch.

**Source spec:** `docs/superpowers/specs/2026-04-25-international-expansion-design.md`

**Companion specs (do not duplicate work):**
- Franchise mechanics: companion franchise spec (in flight in parallel session).
- Multi-region database architecture: companion platform-scale spec (in flight in parallel session).
- Sherpa Hub international deployment: companion Sherpa Hub Integration spec (in flight in parallel session).

**Owners:**
- **P** = Phyrom (Global CEO; owns first General Manager search per country, owns all-country regulatory go/no-go)
- **CFO** = Chief Financial Officer (Phase 3 United States hire; owns FX strategy, international fundraise)
- **COO** = Chief Operating Officer (Phase 3 United States hire; owns country General Manager management once hired)
- **CGM** = Country General Manager (one per country; owns in-country P&L)
- **AI** = Claude sub-agent dispatch
- **LEGAL-{country}** = Per-country outside counsel

---

## Work Stream 1 — Country General Manager Hires

**Goal:** Recruit and onboard four Country General Managers, one per country, on a sequenced timeline. CGM must be in seat 6 months before in-country Phase 0 begins.

### Task WS1.1: Build Country General Manager generic job specification template

**Owner:** P + AI
**Files:**
- Create: `docs/operations/hiring/country-gm-job-spec-template.md` (NEW)

- [ ] **Step 1: Draft the template**

Capture the role definition, responsibilities, must-have qualifications, nice-to-have qualifications, compensation band ($180,000 to $250,000 USD-equivalent base plus equity), reporting structure (reports to Phyrom plus future COO), and 30/60/90-day milestones. Keep country-agnostic — country-specific overlays go in WS1.2 through WS1.5.

**Acceptance:** Template is generic enough to fork for any of the four priority countries; specific enough to surface the executive-class profile we need.

### Task WS1.2: Fork the Canada Country General Manager job specification

**Owner:** P
**Files:**
- Create: `docs/operations/hiring/country-gm-canada-job-spec.md` (NEW)

- [ ] **Step 1: Country-specific overlays**

Add Canada-specific requirements: experience with provincial trade licensing (Ontario, British Columbia, Alberta), familiarity with PIPEDA plus provincial privacy overlays, fluency in Canadian construction industry, optional French fluency for Quebec follow-on. Compensation in CAD with FX peg to base USD band.

**Acceptance:** Canada job spec ready to send to executive search firm.

### Task WS1.3: Fork the United Kingdom Country General Manager job specification

**Owner:** P
**Files:**
- Create: `docs/operations/hiring/country-gm-uk-job-spec.md` (NEW)

- [ ] **Step 1: Country-specific overlays**

Add United Kingdom-specific requirements: experience with United Kingdom trades regulation (Building Regulations 2010, Gas Safe, NICEIC), familiarity with HMRC IR35 and Construction Industry Scheme, prior marketplace or construction-tech operator background, London-based preferred. Compensation in GBP.

**Acceptance:** United Kingdom job spec ready.

### Task WS1.4: Fork the Australia Country General Manager job specification

**Owner:** P
**Files:**
- Create: `docs/operations/hiring/country-gm-australia-job-spec.md` (NEW)

- [ ] **Step 1: Country-specific overlays**

Add Australia-specific requirements: experience with state-based trade licensing (QBCC, NSW Fair Trading, VBA), familiarity with Fair Work Act independent contractor tests and Personal Services Income (PSI) rules, Sydney-based preferred. Compensation in AUD.

**Acceptance:** Australia job spec ready.

### Task WS1.5: Fork the European Union (Berlin pilot) Country General Manager job specification

**Owner:** P
**Files:**
- Create: `docs/operations/hiring/country-gm-eu-pilot-job-spec.md` (NEW)

- [ ] **Step 1: Country-specific overlays**

Add Germany-specific requirements: native German-language fluency, experience with Handwerksordnung trade regulation, familiarity with GDPR enforcement and BfDI/state DPA dynamics, Berlin-based, prior marketplace or construction-tech operator background. Compensation in EUR.

**Acceptance:** European Union pilot job spec ready.

### Task WS1.6: Executive search firm engagement

**Owner:** P
**Files:**
- Create: `docs/operations/hiring/executive-search-firm-evaluation.md` (NEW)

- [ ] **Step 1: Evaluate three executive search firms with cross-border construction-tech track record**

Candidates to evaluate: Heidrick & Struggles (global construction practice), Spencer Stuart (proptech practice), DHR Global (mid-market international). Score on cross-border experience, construction-tech-specific placements, fee structure (retained vs contingency), 90-day backstop guarantee. Document recommendation.

**Acceptance:** One firm selected with signed engagement letter; or documented decision to run search in-house with country-specific recruiting partners.

### Task WS1.7: Country General Manager recruiting playbook

**Owner:** P + AI
**Files:**
- Create: `docs/operations/hiring/country-gm-recruiting-playbook.md` (NEW)

- [ ] **Step 1: Document the recruiting funnel**

Per-country funnel: source list (LinkedIn talent pool query template, executive search shortlist, founder network referrals), screening rubric (regulatory fluency, marketplace operating experience, founder-fit), interview loop (Phyrom + future COO + technical reference call + customer reference call), reference-check protocol, offer construction including equity grant size per country (working default 0.5% to 1.0% common stock vesting four years with one-year cliff).

**Acceptance:** Playbook documented and version-controlled; ready to instantiate per country.

---

## Work Stream 2 — Codes Database Ingestion

**Goal:** Ingest the codes corpus per country into the Sherpa codes engine (internal name "Wiseman"). Per-country budget $80,000 to $150,000 USD over 6 to 9 months.

### Task WS2.1: Codes ingestion vendor evaluation framework

**Owner:** P + AI
**Files:**
- Create: `docs/operations/codes-ingestion/vendor-evaluation-framework.md` (NEW)

- [ ] **Step 1: Document the evaluation rubric**

Capture the per-country evaluation rubric: structured digital availability (yes / partial / PDF-only / print-only), licensing cost, language(s) covered, update cadence, accuracy claims, customer references in construction-tech. Apply rubric to each country's vendor candidates in WS2.2 through WS2.5.

**Acceptance:** Reusable rubric in place.

### Task WS2.2: Canada codes ingestion runbook

**Owner:** P + AI
**Files:**
- Create: `docs/operations/codes-ingestion/canada-runbook.md` (NEW)

- [ ] **Step 1: Document Canada codes scope**

Capture the codes corpus to ingest: National Building Code of Canada (NBC), Canadian Electrical Code (CEC) / CSA C22.1, National Plumbing Code, National Fire Code, Ontario Building Code (OBC), British Columbia Building Code (BCBC), Alberta Building Code (ABC), Quebec Construction Code, plus per-municipality overlays for Toronto, Vancouver, Calgary, Ottawa.

- [ ] **Step 2: Apply vendor evaluation framework**

Score CSA Group direct license, UpCodes Canada, Westlaw Canada per the WS2.1 rubric. Document recommendation.

- [ ] **Step 3: Estimate ingestion budget and timeline**

Working estimate: $90,000 to $120,000 CAD over 6 months. Document assumptions for line-item validation.

**Acceptance:** Canada runbook complete; ready to hand to ingestion engineering team at Canada Phase 0 kick-off.

### Task WS2.3: United Kingdom codes ingestion runbook

**Owner:** P + AI
**Files:**
- Create: `docs/operations/codes-ingestion/uk-runbook.md` (NEW)

- [ ] **Step 1: Document United Kingdom codes scope**

Capture: Building Regulations 2010 plus Approved Documents A through R, BS 7671 IET Wiring Regulations 18th Edition, Gas Safety (Installation and Use) Regulations 1998, Local Authority Building Control (LABC) per-borough variations for London plus Manchester, Birmingham, Bristol.

- [ ] **Step 2: Apply vendor evaluation framework**

Score British Standards Institution (BSI) direct license, IET direct license for BS 7671, manual ingestion option. Document recommendation.

- [ ] **Step 3: Estimate ingestion budget and timeline**

Working estimate: £80,000 to £110,000 over 6 months.

**Acceptance:** United Kingdom runbook complete.

### Task WS2.4: Australia codes ingestion runbook

**Owner:** P + AI
**Files:**
- Create: `docs/operations/codes-ingestion/australia-runbook.md` (NEW)

- [ ] **Step 1: Document Australia codes scope**

Capture: National Construction Code (NCC) Volumes One, Two, Three; AS/NZS 3000:2018 Wiring Rules; Queensland Development Code; NSW Building Code variations; Victorian Building Regulations.

- [ ] **Step 2: Apply vendor evaluation framework**

Score Standards Australia direct license, SAI Global, state government portals. Document recommendation.

- [ ] **Step 3: Estimate ingestion budget and timeline**

Working estimate: $100,000 to $130,000 AUD over 6 months.

**Acceptance:** Australia runbook complete.

### Task WS2.5: European Union (Berlin pilot — Germany) codes ingestion runbook

**Owner:** P + AI
**Files:**
- Create: `docs/operations/codes-ingestion/eu-pilot-germany-runbook.md` (NEW)

- [ ] **Step 1: Document Germany codes scope**

Capture: relevant EN harmonized standards (CEN, CENELEC), Berliner Bauordnung (Berlin Building Code), DIN VDE electrical installation standards, plus federal Bauproduktenverordnung product directive.

- [ ] **Step 2: Apply vendor evaluation framework**

Score Beuth Verlag (DIN's commercial arm), CEN direct license, manual ingestion. Document recommendation.

- [ ] **Step 3: Estimate ingestion budget and timeline plus German-language localization overlay**

Working estimate: €100,000 to €140,000 over 6 to 9 months including German-language localization.

**Acceptance:** European Union pilot runbook complete.

### Task WS2.6: Codes engine validation test set per country

**Owner:** P + AI
**Files:**
- Create: `docs/operations/codes-ingestion/validation-test-set-template.md` (NEW)

- [ ] **Step 1: Define the per-country validation set**

50+ test cases per country drawn from real residential and light-commercial scenarios (electrical panel upgrade, kitchen renovation, bathroom rough-in, heat pump install, EV charger install). Each test case lists the codes the engine must surface and the expected accuracy floor (95%).

**Acceptance:** Reusable template ready for per-country instantiation.

---

## Work Stream 3 — Payment Rails

**Goal:** Stand up Stripe Connect plus per-country domestic payment rails for each country before in-country Phase 0 begins.

### Task WS3.1: Stripe Connect Canada setup

**Owner:** CGM-Canada (once hired) + P
**Files:**
- Modify: `src/lib/payments/stripe.ts` (add multi-country Stripe Connect account routing)
- Create: `docs/operations/payment-rails/canada-rails.md` (NEW)

- [ ] **Step 1: Create Sherpa Pros Canada Stripe Connect account**

Use Canadian operating entity (formed in WS4.1). Configure for CAD settlement. Enable Express onboarding for pros. Validate webhook endpoint receives `account.updated`, `payout.created`, `payment_intent.succeeded` events.

- [ ] **Step 2: Add Interac e-Transfer integration**

Document Interac as the Canadian peer-to-peer rail. Validate Stripe's native Interac support or evaluate third-party providers.

- [ ] **Step 3: Document tax-collection configuration for GST and HST per province**

Stripe Tax Canada handles GST/HST collection. Configure per-province rates. Validate against test transactions.

**Acceptance:** Sherpa Pros Canada Stripe Connect live with CAD settlement, Interac, and GST/HST tax collection.

### Task WS3.2: Stripe Connect United Kingdom setup

**Owner:** CGM-UK (once hired) + P
**Files:**
- Create: `docs/operations/payment-rails/uk-rails.md` (NEW)

- [ ] **Step 1: Create Sherpa Pros United Kingdom Stripe Connect account**

Use United Kingdom operating entity (Limited company, formed in WS4.2). Configure for GBP settlement. Enable Express onboarding.

- [ ] **Step 2: Add Bacs Direct Debit and Faster Payments integration**

Document Bacs as the United Kingdom domestic rail. Validate Stripe's native Bacs support.

- [ ] **Step 3: Configure VAT collection per HMRC rules**

Stripe Tax United Kingdom handles VAT at 20%. Configure for the marketplace transaction. Document Construction Industry Scheme (CIS) Domestic Reverse Charge handling for VAT-registered pro-to-pro work.

**Acceptance:** Sherpa Pros United Kingdom Stripe Connect live with GBP settlement, Bacs, and VAT collection.

### Task WS3.3: Stripe Connect Australia setup

**Owner:** CGM-Australia (once hired) + P
**Files:**
- Create: `docs/operations/payment-rails/australia-rails.md` (NEW)

- [ ] **Step 1: Create Sherpa Pros Australia Stripe Connect account**

Use Australian operating entity (Proprietary Limited, formed in WS4.3). Configure for AUD settlement. Enable Express onboarding.

- [ ] **Step 2: Add New Payments Platform (NPP) and BPAY integration**

Document NPP for real-time settlement and BPAY for invoice-based. Validate Stripe support or evaluate third-party.

- [ ] **Step 3: Configure GST collection at 10%**

Stripe Tax Australia handles GST. Configure ABN validation for pro onboarding (pros without ABN trigger PAYG withholding).

**Acceptance:** Sherpa Pros Australia Stripe Connect live with AUD settlement, NPP, BPAY, GST collection, and ABN validation.

### Task WS3.4: Stripe Connect European Union (Berlin pilot — Germany) setup

**Owner:** CGM-EU (once hired) + P
**Files:**
- Create: `docs/operations/payment-rails/eu-pilot-germany-rails.md` (NEW)

- [ ] **Step 1: Create Sherpa Pros Deutschland Stripe Connect account**

Use German operating entity (GmbH, formed in WS4.4). Configure for EUR settlement. Enable Express onboarding.

- [ ] **Step 2: Add Single Euro Payments Area (SEPA) Direct Debit and German-specific consumer rails**

Document SEPA as the cross-border European Union rail. Add Klarna, Sofort, and PayPal as German consumer-comfort layers via Stripe.

- [ ] **Step 3: Configure VAT MOSS / OSS registration**

Register for VAT in Germany. Configure VAT MOSS / OSS to cover other European Union member states from the German registration. Stripe Tax handles per-member-state rate calculation.

- [ ] **Step 4: Configure DAC7 reporting**

European Union Marketplace Directive (DAC7) requires quarterly transaction reporting for any pro earning over €2,000 EUR per year or 30+ transactions per year. Document the data export process.

**Acceptance:** Sherpa Pros Deutschland Stripe Connect live with EUR settlement, SEPA, VAT OSS, DAC7 reporting.

### Task WS3.5: FX hedging strategy

**Owner:** CFO (once hired)
**Files:**
- Create: `docs/operations/payment-rails/fx-hedging-strategy.md` (NEW)

- [ ] **Step 1: Document the FX exposure model**

Per-country settlement in local currency; periodic conversion to USD for parent reporting. Document the Wise integration for conversion, the natural hedge from in-country operating expenses paid in local currency, and the residual USD-denominated exposure.

- [ ] **Step 2: Set hedge ratio policy**

Working default: hedge 50% of forward 6-month forecasted residual FX exposure. Quarterly review with CFO.

**Acceptance:** Hedging policy documented and ready to execute once CFO is in seat.

---

## Work Stream 4 — Regulatory Readiness

**Goal:** Per-country legal entity formation, trade-licensing research, insurance broker engagement, worker-classification opinion. Must complete before Country Phase 0 begins.

### Task WS4.1: Canada legal entity formation

**Owner:** P + LEGAL-Canada
**Files:**
- Create: `docs/operations/regulatory/canada-entity.md` (NEW)

- [ ] **Step 1: Engage Canadian outside counsel**

Working candidates: Borden Ladner Gervais (BLG), Gowling WLG, Osler Hoskin & Harcourt. Engage on entity formation, worker-classification opinion, and ongoing per-province compliance.

- [ ] **Step 2: Form Canadian operating entity**

Working default: Canadian-controlled private corporation (CCPC) federally incorporated under the Canada Business Corporations Act, with extra-provincial registration in Ontario, British Columbia, Alberta, and Quebec (when Quebec launches in Year 2).

- [ ] **Step 3: Register for federal GST and per-province HST/PST**

Threshold $30,000 CAD annual revenue in any province; Sherpa Pros will exceed this in launch month.

**Acceptance:** Canadian entity formed, registered, GST/HST configured.

### Task WS4.2: United Kingdom legal entity formation

**Owner:** P + LEGAL-UK
**Files:**
- Create: `docs/operations/regulatory/uk-entity.md` (NEW)

- [ ] **Step 1: Engage United Kingdom outside counsel**

Working candidates: Mishcon de Reya, Taylor Wessing, Bird & Bird. Engage on entity formation, IR35 worker-classification opinion, and CIS reporting setup.

- [ ] **Step 2: Form United Kingdom operating entity**

Working default: Sherpa Pros (UK) Limited, registered with Companies House.

- [ ] **Step 3: Register for VAT and Construction Industry Scheme (CIS)**

VAT registration once £85,000 turnover threshold expected. CIS registration required for any contractor-to-subcontractor payment.

**Acceptance:** United Kingdom entity formed, VAT and CIS configured.

### Task WS4.3: Australia legal entity formation

**Owner:** P + LEGAL-Australia
**Files:**
- Create: `docs/operations/regulatory/australia-entity.md` (NEW)

- [ ] **Step 1: Engage Australian outside counsel**

Working candidates: Allens, Herbert Smith Freehills, Gilbert + Tobin. Engage on entity formation, Fair Work Act independent contractor opinion, and state-by-state licensing research.

- [ ] **Step 2: Form Australian operating entity**

Working default: Sherpa Pros Australia Pty Ltd, ASIC-registered with Australian Business Number (ABN) and Tax File Number (TFN).

- [ ] **Step 3: Register for GST**

GST registration once $75,000 AUD turnover threshold expected.

**Acceptance:** Australian entity formed, ABN issued, GST configured.

### Task WS4.4: European Union (Berlin pilot — Germany) legal entity formation

**Owner:** P + LEGAL-Germany
**Files:**
- Create: `docs/operations/regulatory/eu-pilot-germany-entity.md` (NEW)

- [ ] **Step 1: Engage German outside counsel**

Working candidates: Hengeler Mueller, Gleiss Lutz, Noerr. Engage on GmbH formation, Scheinselbständigkeit (false self-employment) worker-classification opinion, and GDPR plus BDSG compliance setup.

- [ ] **Step 2: Form German operating entity**

Working default: Sherpa Pros Deutschland GmbH, registered with the Handelsregister (Commercial Register). Minimum capital €25,000.

- [ ] **Step 3: Register for VAT (MwSt) and OSS**

Standard VAT rate 19%; OSS registration via the Bundeszentralamt für Steuern covers cross-member-state VAT obligations.

- [ ] **Step 4: Appoint Data Protection Officer (DPO)**

GDPR Article 37 requires DPO designation for any entity processing personal data at scale. Working default: external DPO firm contracted.

**Acceptance:** German entity formed, VAT registered, DPO appointed.

### Task WS4.5: Per-country insurance broker engagement

**Owner:** P + CGM (once hired per country)
**Files:**
- Create: `docs/operations/regulatory/insurance-brokers.md` (NEW)

- [ ] **Step 1: Engage insurance brokers per country**

Canada: Marsh Canada or Aon Canada. United Kingdom: Lockton United Kingdom or Marsh United Kingdom. Australia: Marsh Australia or Aon Australia. European Union (Germany): Funk Gruppe or Marsh Deutschland.

- [ ] **Step 2: Bind platform liability insurance per country**

Per-country minimums: Canada $5 million CAD aggregate Commercial General Liability; United Kingdom £5 million Public Liability; Australia $10 million AUD Public Liability; Germany €5 million Betriebshaftpflicht. Working budget $5,000 to $15,000 USD per country annual.

- [ ] **Step 3: Document COI verification flow per country**

Per-country pro Certificate of Insurance verification process integrated into pro onboarding. Country-specific minimums applied.

**Acceptance:** Per-country platform liability bound; pro COI verification flow live per country.

### Task WS4.6: Per-country worker-classification opinion

**Owner:** LEGAL-{country}
**Files:**
- Create: `docs/operations/regulatory/worker-classification-opinions.md` (NEW)

- [ ] **Step 1: Engage country counsel for written worker-classification opinion**

Per country: written opinion that pros operating on Sherpa Pros are independent contractors under country-specific tests (CRA common-law test in Canada, IR35 in United Kingdom, Fair Work Act multi-factor in Australia, Scheinselbständigkeit tests in Germany). Same scope as the United States 1099 vs W-2 opinion in Phase 0.

- [ ] **Step 2: Document Sherpa Flex international equivalent per country**

Each country needs a Sherpa Flex equivalent if the side-hustle path is launched in country. Per-project platform liability insurance + sub-equivalent-of-$5,000 USD job ceiling + explicit independent-contractor framing. Defer to in-country General Manager whether Flex launches in country at all.

**Acceptance:** Written opinion on file per country; Flex international approach decided per country.

### Task WS4.7: Per-country trade licensing research

**Owner:** CGM (once hired) + AI
**Files:**
- Create: `docs/operations/regulatory/trade-licensing-research-canada.md` (NEW)
- Create: `docs/operations/regulatory/trade-licensing-research-uk.md` (NEW)
- Create: `docs/operations/regulatory/trade-licensing-research-australia.md` (NEW)
- Create: `docs/operations/regulatory/trade-licensing-research-eu-pilot-germany.md` (NEW)

- [ ] **Step 1: Document the trades licensed per country and the issuing authority**

Per country, build the trade-by-trade table (Electrician, Plumber, Heating-Ventilation-Air Conditioning / HVAC, Gas, General Builder, Roofer, etc.) with the issuing authority and the verification source. This feeds the codes engine and the pro onboarding verification flow.

**Acceptance:** Per-country trade licensing table complete and ready to integrate into pro onboarding.

---

## Work Stream 5 — Localization

**Goal:** Currency, language, units, date format, trade nomenclature per country. Localization framework lives globally; per-country localization configuration sets the per-country values.

### Task WS5.1: Multi-currency display layer

**Owner:** P + AI
**Files:**
- Create: `src/lib/i18n/currency.ts` (NEW)
- Create: `docs/operations/localization/currency.md` (NEW)

- [ ] **Step 1: Build currency-display utility**

Function `formatCurrency(amountInMinorUnits, currencyCode, locale)` returning the locale-formatted string. Handles CAD, GBP, AUD, EUR, USD. Always integer minor units (cents, pence) per the Sherpa Pros monetary rule.

- [ ] **Step 2: Update all monetary display components to call the utility**

Replace every hard-coded `$` and `USD` in `src/components/` with `formatCurrency()` keyed off user country.

**Acceptance:** Every monetary display reads from the utility; one regression test per currency passes.

### Task WS5.2: Language strategy implementation

**Owner:** P + AI
**Files:**
- Create: `src/lib/i18n/language.ts` (NEW)
- Create: `docs/operations/localization/language.md` (NEW)

- [ ] **Step 1: Document the language sequence**

Year 1 Canada English-default. Year 2 Quebec French follow-on. Year 4 to 5 Berlin pilot German required day one. French and Spanish deferred.

- [ ] **Step 2: Choose the i18n library**

Working default: `next-intl` (Next.js native plus App Router compatible). Document the alternative (`react-i18next`) and the decision rationale.

- [ ] **Step 3: Scaffold the locale-routing structure**

Add the `[locale]` segment to `src/app/`. Default locale `en-US`. Locale-aware link helper. No translation work in this task; just the routing.

**Acceptance:** Locale-routing in place; English-default for all locales; ready for per-country translation work.

### Task WS5.3: Units of measure switcher

**Owner:** P + AI
**Files:**
- Create: `src/lib/i18n/units.ts` (NEW)
- Create: `docs/operations/localization/units.md` (NEW)

- [ ] **Step 1: Build the unit-conversion utility**

Imperial-default for United States and Canada. Mixed for United Kingdom (per-line-item override). Metric for Australia and European Union. Functions: `formatLength(meters, units)`, `formatWeight(kilograms, units)`, `formatVolume(liters, units)`, `formatTemperature(celsius, units)`.

**Acceptance:** Utility used by every measurement display in materials orchestration plus codes engine.

### Task WS5.4: Date format switcher

**Owner:** P + AI
**Files:**
- Create: `src/lib/i18n/date.ts` (NEW)
- Create: `docs/operations/localization/date-format.md` (NEW)

- [ ] **Step 1: Build the date-format utility**

`formatDate(date, locale)` returning locale-formatted date string. United States MM/DD/YYYY default; United Kingdom, Canada (consumer), Australia, European Union DD/MM/YYYY default.

**Acceptance:** Every date display uses the utility; one regression test per locale passes.

### Task WS5.5: Trade nomenclature dictionary

**Owner:** P + AI + CGM (once hired per country)
**Files:**
- Create: `docs/operations/localization/trade-nomenclature.md` (NEW)
- Create: `src/lib/i18n/trade-terms.ts` (NEW)

- [ ] **Step 1: Document the per-country trade-term dictionary**

Build the lookup table for each country's correct term: "trade pros" / "tradespeople" / "tradies" / "Handwerker"; "general contractor" / "main contractor" / "head contractor" / "Generalunternehmer"; "punch list" / "snagging list" / "defects list" / "Mängelliste"; "change order" / "variation" / "Nachtrag"; "permit" / "planning permission" / "DA" / "Baugenehmigung". Apply to every country-specific copy surface.

**Acceptance:** Dictionary complete; ready for in-country General Manager review at country Phase 0.

### Task WS5.6: Per-country trademark search

**Owner:** P + LEGAL-{country}
**Files:**
- Create: `docs/operations/localization/trademark-searches.md` (NEW)

- [ ] **Step 1: Run trademark searches per country**

Canadian Intellectual Property Office (CIPO) for Canada; United Kingdom Intellectual Property Office (UKIPO) for United Kingdom; IP Australia for Australia; European Union Intellectual Property Office (EUIPO) plus Deutsches Patent- und Markenamt (DPMA) for Berlin pilot. Search "Sherpa," "Sherpa Pros," and "Sherpa" plus product names in each country's classes 35, 36, 37, 41, 42 (the relevant marketplace plus services classes).

- [ ] **Step 2: Document conflicts and per-country brand variant fallback**

If "Sherpa Pros" is clear in country, use the umbrella brand. If conflict, fall back to "Sherpa Pros {Country}" or evaluate alternative brand variant.

**Acceptance:** Per-country trademark status documented; per-country brand variant decision locked.

---

## Work Stream 6 — Per-Country Launch Playbook (Phase 0/1/2)

**Goal:** Templated, parameterized per-country launch playbook mirroring the United States Phase 0 / Phase 1 / Phase 2 model.

### Task WS6.1: Per-country launch playbook template

**Owner:** P + AI
**Files:**
- Create: `docs/operations/launch-playbook/per-country-launch-template.md` (NEW)

- [ ] **Step 1: Document the universal launch template**

Country-agnostic template covering: Phase 0 entry criteria (CGM hired, entity formed, payment rails live, codes ingested, insurance bound, worker-class opinion received), Phase 0 activities (10 to 15 founding pros recruited in launch metro), Phase 0 exit gate ($X local-currency-equivalent GMV plus pro retention floor), Phase 1 scope (3 to 4 metros), Phase 1 exit gate, Phase 2 scope (full country footprint), Phase 2 exit gate (country breakeven plus PM anchor signed).

**Acceptance:** Template ready to fork per country.

### Task WS6.2: Canada launch playbook

**Owner:** CGM-Canada (once hired) + P
**Files:**
- Create: `docs/operations/launch-playbook/canada-launch.md` (NEW)

- [ ] **Step 1: Fork the template with Canada-specific values**

Launch metro Toronto. Phase 1 metros add Vancouver, Calgary. Phase 2 adds Ottawa and Montreal (Montreal contingent on French localization). Country-specific underserved-trade lanes: heat pumps under federal Greener Homes program plus provincial rebates, EV chargers, energy retrofits.

- [ ] **Step 2: Document country-specific paid acquisition channels**

Meta plus Google in Canada with Canadian-creative work (the Canadian creative is meaningfully different from United States). Reddit Canada subreddits. Local trade-association partnerships (Canadian Home Builders Association / CHBA, Canadian Construction Association / CCA).

- [ ] **Step 3: Document country-specific Property Manager pipeline**

Working candidate list: Greystar Canada (cross-border from United States anchor), Realstar, QuadReal Property Group. Plus Canadian-specific multi-family operators.

**Acceptance:** Canada playbook ready to execute at Canada Phase 0 kick-off.

### Task WS6.3: United Kingdom launch playbook

**Owner:** CGM-UK (once hired) + P
**Files:**
- Create: `docs/operations/launch-playbook/uk-launch.md` (NEW)

- [ ] **Step 1: Fork the template with United Kingdom-specific values**

Launch metro London. Phase 1 metros add Manchester, Birmingham. Phase 2 adds Bristol and Edinburgh. Country-specific underserved-trade lanes: heat pumps under United Kingdom Boiler Upgrade Scheme, EV chargers under Electric Vehicle Homecharge Scheme, period-property restoration (Victorian and Edwardian housing stock specialty).

- [ ] **Step 2: Document country-specific paid acquisition channels**

Meta plus Google United Kingdom. Mumsnet for homeowner reach. Local trade-association partnerships (Federation of Master Builders / FMB, NICEIC, Gas Safe Register).

- [ ] **Step 3: Document country-specific Property Manager pipeline**

Working candidate list: Foxtons, Savills Property Management, Knight Frank Property Management, JLL Residential.

**Acceptance:** United Kingdom playbook ready.

### Task WS6.4: Australia launch playbook

**Owner:** CGM-Australia (once hired) + P
**Files:**
- Create: `docs/operations/launch-playbook/australia-launch.md` (NEW)

- [ ] **Step 1: Fork the template with Australia-specific values**

Launch metro Sydney. Phase 1 metros add Melbourne, Brisbane. Phase 2 adds Perth. Country-specific underserved-trade lanes: solar plus battery installs (Australian residential solar penetration is the world's highest), EV chargers, bushfire retrofit specialty in regional New South Wales and Victoria.

- [ ] **Step 2: Document country-specific paid acquisition channels**

Meta plus Google Australia. Domain.com.au and realestate.com.au partnerships for homeowner reach. Local trade-association partnerships (Master Builders Australia, Housing Industry Association / HIA).

- [ ] **Step 3: Document country-specific Property Manager pipeline**

Working candidate list: Mirvac, Stockland, Lendlease Communities, Greystar Australia.

**Acceptance:** Australia playbook ready.

### Task WS6.5: European Union pilot (Berlin) launch playbook

**Owner:** CGM-EU (once hired) + P
**Files:**
- Create: `docs/operations/launch-playbook/eu-pilot-berlin-launch.md` (NEW)

- [ ] **Step 1: Fork the template with Berlin-pilot-specific values**

Launch metro Berlin only. No Phase 1 expansion to second metro until pilot validates at Phase 2 metric gates. Country-specific underserved-trade lanes: heat pumps under Bundesförderung für effiziente Gebäude (BEG), EV chargers under KfW funding, energy-efficiency retrofits under European Union Energy Performance of Buildings Directive (EPBD).

- [ ] **Step 2: Document Germany-specific paid acquisition channels**

Meta plus Google Deutschland. Immobilienscout24 partnership for homeowner reach. Local trade-association partnerships (Zentralverband des Deutschen Handwerks / ZDH, regional Handwerkskammer Berlin).

- [ ] **Step 3: Document Germany-specific Property Manager pipeline**

Working candidate list: Vonovia, Deutsche Wohnen, Akelius Residential Property, GCP (Grand City Properties).

**Acceptance:** Berlin pilot playbook ready; explicit pilot scope (no Phase 1 expansion until pilot validates).

### Task WS6.6: Per-country traction-metric dashboard

**Owner:** CGM (once hired per country) + AI
**Files:**
- Create: `docs/operations/launch-playbook/traction-metrics-dashboard.md` (NEW)
- Modify: `src/app/admin/investor-metrics/page.tsx` (add per-country breakdown)

- [ ] **Step 1: Define per-country metric definitions**

Per country: GMV in local currency plus USD-equivalent, active pros, pro retention, NPS, match time, materials attach rate. Same definitions as the United States dashboard, parameterized per country.

- [ ] **Step 2: Add country dimension to investor metrics dashboard**

Modify the admin investor metrics page to break out by country plus aggregate global. Surface per-country exit-gate progress.

**Acceptance:** Per-country dashboard live; investor reporting reflects international footprint.

### Task WS6.7: Cross-country knowledge-transfer cadence

**Owner:** P + COO (once hired)
**Files:**
- Create: `docs/operations/launch-playbook/cross-country-cadence.md` (NEW)

- [ ] **Step 1: Document the weekly cross-country ops review**

Working default: 60-minute Monday call across all in-country General Managers plus Phyrom plus COO. Each CGM gives a 5-minute traction snapshot. Discuss cross-country issues. Quarterly in-person all-hands.

- [ ] **Step 2: Document the country-launch-postmortem template**

Each country runs a 30-day Phase 1 retrospective and a 90-day Phase 2 retrospective documenting what worked, what failed, what to change for next country. Postmortems feed the per-country launch template (WS6.1) updates.

**Acceptance:** Cadence in place by Canada Phase 0; updated per country thereafter.

---

## Critical-Path Dependencies

1. **Country General Manager hire (per country)** → unlocks every other in-country workstream → 6-month lead time before in-country Phase 0 begins.
2. **Codes ingestion complete (per country)** → unlocks Phase 1 launch in country.
3. **Payment rails live (per country)** → unlocks pro activation and beta cohort.
4. **Worker-classification opinion received (per country)** → unlocks pro activation legally.
5. **Trademark search clear (per country)** → unlocks per-country brand variant decision and marketing surface launch.
6. **Phase 4 fundraise close** → unlocks Canada Year 1 launch capital → unlocks the entire international sequence.

## Success Metrics and Phase Gates

### Per-country in-country Phase 0 exit gate
- CGM in seat, country team of 4 hired and on-payroll, regulatory readiness complete, payment rails live, codes ingested for launch metro, insurance bound, worker-class opinion received.

### Per-country in-country Phase 1 exit gate
- 50+ active pros in launch metro, $200,000 USD-equivalent GMV, 1 PM anchor in pipeline, NPS >50, pro retention >80%.

### Per-country in-country Phase 2 exit gate
- 100+ active pros across 3 to 4 metros, $1,000,000 USD-equivalent annualized GMV, country breakeven on operating cost, 1+ PM anchor signed.

### Phase 4 international portfolio exit gate (triggers Phase 5 — rest-of-world consideration)
- All 4 priority countries at or past in-country Phase 2 exit gate, OR
- 3 of 4 countries at Phase 2 plus formal decision to discontinue the 4th.

---

## Glossary

ABN = Australian Business Number · APP = Australian Privacy Principles · BCBC = British Columbia Building Code · BfDI = Bundesbeauftragte für den Datenschutz und die Informationsfreiheit · CCPC = Canadian-controlled private corporation · CEC = Canadian Electrical Code · CFO = Chief Financial Officer · CGM = Country General Manager · CIPO = Canadian Intellectual Property Office · CIS = Construction Industry Scheme · COI = Certificate of Insurance · COO = Chief Operating Officer · CRA = Canada Revenue Agency · DAC7 = Directive on Administrative Cooperation 7 · DIN = Deutsches Institut für Normung · DPA = Data Protection Authority · DPO = Data Protection Officer · DSAR = Data Subject Access Request · EUIPO = European Union Intellectual Property Office · FX = Foreign Exchange · GDPR = General Data Protection Regulation · GMV = Gross Merchandise Value · GST = Goods and Services Tax · HMRC = His Majesty's Revenue and Customs · HST = Harmonized Sales Tax · HwO = Handwerksordnung · IET = Institution of Engineering and Technology · IR35 = Off-payroll working rules · LABC = Local Authority Building Control · MOSS = Mini One-Stop Shop · MTD = Making Tax Digital · NBC = National Building Code of Canada · NCC = National Construction Code (Australia) · NEC = National Electrical Code · NICEIC = National Inspection Council for Electrical Installation Contracting · NPP = New Payments Platform · NPS = Net Promoter Score · OAIC = Office of the Australian Information Commissioner · OBC = Ontario Building Code · OSS = One-Stop Shop · PIPEDA = Personal Information Protection and Electronic Documents Act · PM = Property Manager · PPP = Purchasing Power Parity · PSI = Personal Services Income · QBCC = Queensland Building and Construction Commission · SEPA = Single Euro Payments Area · TFN = Tax File Number · UKIPO = United Kingdom Intellectual Property Office · VAT = Value Added Tax · VBA = Victorian Building Authority · WCB = Workers Compensation Board.
