# Sherpa Pros — International Expansion Design Spec

**Date:** 2026-04-25
**Author:** Phyrom (via brainstorming with Claude)
**Status:** Draft — Phase 4+ infrastructure layer (companion specs being written in parallel: Franchise Model, Platform Scale Architecture, Sherpa Hub Integration)
**Next:** `superpowers:writing-plans` produces the executable rollout plan at `docs/superpowers/plans/2026-04-25-international-expansion-plan.md`

---

## 1. Executive Summary

Sherpa Pros has a Total Addressable Market (TAM) ceiling at home. The combined United States residential and light-commercial trades labor market plus the materials supply chain we are now vertically integrated into runs roughly $1.27 trillion (industry estimates: $730 billion labor + $540 billion materials). That is a real ceiling. International expansion to the four English-speaking and European markets identified below moves the TAM ceiling to roughly four to five times that figure. Without an international roadmap, Phase 4 hits the wall on growth multiples that institutional Series B and later investors price into our valuation. With an international roadmap, the same investors model the next ten years against a number that justifies the multiples we need.

This spec proposes a deliberate, four-country sequence — Canada (Year 1), United Kingdom (Year 2), Australia (Year 3), and a European Union pilot (Year 4 to 5) — chosen on hard rationale: regulatory similarity to the United States, English-language defaults that compress localization risk, mature Stripe Connect coverage that lets us reuse our payments stack, and a manageable codes-ingestion cost per country. Rest-of-world expansion is deferred indefinitely. The country sequence is not aspiration; it is a defensible four-step climb from the lowest-risk adjacent market to the most strategically important secondary market, in an order that lets each country fund the next.

---

## 2. Country Sequence with Rationale

The four-country priority sequence is below, with the strict rule that no country starts Phase 0 in-country until the prior country is at Phase 2 metric gates. This is sequencing, not a portfolio — international missteps compound, and a country general manager cannot rescue another country.

### 2.1 Canada — Year 1, Months 19 through 30

**Why Canada first.** Canada is the lowest-risk adjacent market on every dimension that matters. Regulatory regime is the closest analog to the United States (federal plus provincial, mirrors federal plus state). Trade licensing is provincial — Ontario, British Columbia, Alberta, and Quebec each run their own licensing body, but the ingestion model maps one-to-one to how we already handle Massachusetts, New Hampshire, Maine, and Rhode Island. Stripe Connect has full Canadian coverage with native Canadian Dollar (CAD) settlement, native Interac payment-rail support, and a mature Canada Revenue Agency (CRA) tax-reporting integration. The trades market is roughly $135 billion CAD (~$100 billion United States Dollars / USD) — significant, not trivial, and large enough to seat a full country team with positive unit economics. English-language default everywhere except Quebec, where French is mandatory under provincial law (Bill 96) and which we treat as a Year 2 follow-on localization, not a Year 1 launch blocker.

**Why this order.** Canada is the de-risking step. Every assumption in the international playbook (codes ingestion at scale, country general manager hire, multi-currency settlement, data-residency compliance) gets stress-tested at the lowest possible regulatory and cultural distance. If we cannot make Canada work, we cannot make the United Kingdom work — better to learn that with the Canadian Dollar than the British Pound.

**Market size.** Approximately $135 billion CAD trades labor market. Approximately $80 billion CAD materials. Toronto, Vancouver, Calgary, Ottawa, and Montreal account for roughly 60% of national trades spend.

**Regulatory complexity.** Medium. Provincial licensing varies meaningfully (Ontario's College of Trades versus British Columbia's Industry Training Authority versus Alberta's Apprenticeship and Industry Training). Federal Goods and Services Tax (GST) plus provincial Harmonized Sales Tax (HST) on the marketplace transaction. Workers Compensation Board (WCB) per-province requirements for any worker-classification edge cases.

**English-language advantage.** Strong. Quebec is the only carve-out. Even there, our trade pros are largely bilingual; the localization burden lands on customer-facing copy.

**Payment rails.** Stripe Connect Canada is mature. Interac e-Transfer integration is the table-stakes Canadian domestic rail. Wise (formerly TransferWise) is the FX hedge if we settle in USD on the Sherpa Pros LLC parent.

**Competitor density.** Lower than the United States. HomeStars (Canadian Angi clone) is the dominant lead-gen incumbent. No verified-licensed-trade marketplace with a code-aware matching layer exists. The empty quadrant we identified in the United States is also empty in Canada.

### 2.2 United Kingdom — Year 2, Months 31 through 42

**Why the United Kingdom second.** The United Kingdom is the highest-strategic-value English-language market after Canada, with the densest urban concentration of high-margin trade work in Europe (London alone accounts for roughly 22% of national trades spend). Regulatory regime is centralized rather than provincial, which is actually simpler than Canada once we have built the per-province playbook — one Building Regulations 2010 set, one Institution of Engineering and Technology (IET) BS 7671 wiring standard, one Health and Safety Executive (HSE) for safety. Stripe Connect United Kingdom is fully mature with native British Pound (GBP) settlement.

**Why this order.** Canada de-risks the platform; the United Kingdom proves it scales to a market that does not share our codes lineage. The United Kingdom uses its own building regulations heritage (Building Regulations 2010 plus Approved Documents A through R) — it has nothing to do with the National Electrical Code (NEC) or International Residential Code (IRC) that the Sherpa codes engine ingested for the United States and Canada. If our codes ingestion model survives that reset, the European Union pilot in Year 4 is a known-good bet.

**Market size.** Approximately £85 billion (~$110 billion USD) trades labor. Approximately £55 billion (~$70 billion USD) materials. London, Manchester, Birmingham, Bristol, and Edinburgh account for roughly 65% of national spend.

**Regulatory complexity.** Medium-high. Trades are largely self-regulated through registration schemes (Gas Safe Register for gas work — mandatory; National Inspection Council for Electrical Installation Contracting / NICEIC for electrical — voluntary but de facto required by insurers). Insurance norms differ: Public Liability Insurance is the United Kingdom equivalent of United States General Liability; £2 million minimum is industry-standard. Worker classification under Internal Revenue and Customs (HMRC) IR35 rules is a real risk that requires legal opinion before launch.

**English-language advantage.** Strong, with vocabulary differences (see §4 Localization).

**Payment rails.** Stripe Connect United Kingdom mature. Bacs Direct Debit is the table-stakes domestic settlement rail. Open Banking via Truelayer or Plaid United Kingdom is the modern layer.

**Competitor density.** High. Checkatrade, Rated People, and MyBuilder are the three established lead-gen incumbents, each with 20+ years of brand equity. Our wedge is the same as in the United States — verified licensed work plus code-aware matching plus the materials orchestration layer (which none of the United Kingdom incumbents have shipped).

### 2.3 Australia — Year 3, Months 43 through 54

**Why Australia third.** Australia is the third English-speaking market with mature payment rails (Stripe Connect Australia is fully supported with native Australian Dollar / AUD settlement). The trades labor shortage in Australia is structurally similar to the Massachusetts shortage that anchored our United States Phase 1 thesis — Australian construction completion times have stretched and tradesperson (local term: "tradie") demand has outstripped supply for the last six years. Regulatory regime is state-by-state (six states plus two territories) and maps to our United States state-by-state and Canadian province-by-province operating model.

**Why this order.** Australia is the proof point for "we have built a repeatable international launch playbook." If we can launch in Sydney, Melbourne, Brisbane, and Perth using a templated per-country runbook, we have a true international platform. Australia is also the natural launch pad for any future New Zealand expansion (shared AS/NZS standards, shared Trans-Tasman Mutual Recognition for trade licensing) but New Zealand is deferred to Year 4 or later as a low-cost incremental.

**Market size.** Approximately $95 billion AUD (~$62 billion USD) trades labor. Approximately $60 billion AUD (~$39 billion USD) materials. Sydney, Melbourne, Brisbane, and Perth account for roughly 70% of national spend.

**Regulatory complexity.** Medium-high. State-based licensing (Queensland Building and Construction Commission / QBCC, NSW Fair Trading, Victorian Building Authority / VBA, etc.). Goods and Services Tax (GST) at 10% applies to the marketplace transaction. Worker classification under the Fair Work Act and the Personal Services Income (PSI) rules is the analog to United States 1099 versus W-2 risk and requires legal opinion before launch.

**English-language advantage.** Strong, with vocabulary differences (see §4).

**Payment rails.** Stripe Connect Australia mature. Pay Anyone (BPAY) is the table-stakes Australian domestic settlement rail. New Payments Platform (NPP) handles real-time settlement.

**Competitor density.** Medium. hipages and ServiceSeeking are the two established incumbents. Both are lead-gen models. Our wedge — verified licensed plus code-aware plus materials orchestration — is structurally differentiated.

### 2.4 European Union Pilot — Year 4 through 5, Months 55 through 78

**Why the European Union fourth, and as a pilot only.** The European Union is the largest international TAM by a wide margin (~$680 billion EUR / ~$740 billion USD trades labor across the 27 member states, with Germany, France, the Netherlands, and Spain accounting for the majority). It is also the highest-complexity market we will enter — 27 separate regulatory regimes under a common European Norm (EN) harmonized standards umbrella, multi-language localization (German, French, Italian, Spanish, Polish, Dutch as the priority languages), General Data Protection Regulation (GDPR) data-residency compliance with significantly higher penalties than United States or United Kingdom equivalents, and Value Added Tax (VAT) Mini One-Stop Shop (MOSS) registration across every member state we operate in.

**Pilot scope.** One member state, one metro, one language. Working default is **Berlin, Germany** as the pilot — Germany is the European Union's largest construction market by spend, Berlin is the friendliest startup ecosystem, German is a single language with no regional dialect localization burden, and German trades regulation (Handwerksordnung — the federal trades licensing law) is centralized rather than regional. The pilot proves the European Union playbook before any expansion to a second member state. Alternative pilot candidates under open-decision review (§13): Amsterdam (English-default professional environment, smaller market), Madrid (Spanish-language unlocks Latin American expansion later, regulatory friendlier than France), Paris (highest TAM single market, hardest regulation).

**Why this order.** The European Union goes last because it is the costliest mistake. Berlin pilot in Year 4 to 5 is an option to learn, not a commitment to scale. If the pilot proves out, Years 6 through 8 unlock a member-state-by-member-state rollout. If it does not, we have spent ~$3 million and learned what a European Union scale operation requires, and we move on to deferred markets (New Zealand, Singapore, the United Arab Emirates).

**Market size.** Pilot Berlin: ~$8 billion EUR trades labor in the metro. Full Germany: ~$140 billion EUR. Full European Union: ~$680 billion EUR.

**Regulatory complexity.** Very high. Per-member-state licensing, EN harmonized standards plus per-member-state codes, GDPR data residency by member state, VAT MOSS, Posted Workers Directive for any cross-border trade dispatch, country-of-establishment rules for marketplaces.

**English-language advantage.** Weak. German pilot requires full German-language localization on day one.

**Payment rails.** Stripe Connect coverage is per-member-state — fully supported in Germany, France, Spain, Italy, the Netherlands, Belgium, Ireland, Austria. Single Euro Payments Area (SEPA) Direct Debit is the table-stakes rail.

**Competitor density.** High and fragmented. Each member state has its own incumbent (MyHammer in Germany, StarOfService in France, Bricomania in Italy). No pan-European Union licensed-trade marketplace exists with our differentiator.

### 2.5 Rest of World — Deferred

New Zealand, Singapore, the United Arab Emirates, and the rest of the English-speaking and high-income world are deferred until at least Year 6. Capital intensity, regulatory diligence cost, and country general manager talent supply do not support more than one country launch per year. The discipline is not about fewer markets eventually — it is about not missing the four that matter.

---

## 3. Per-Country Regulatory Mapping

### 3.1 Canada

- **Trade licensing regime.** Provincial. Each of Ontario, British Columbia, Alberta, Quebec, Manitoba, Saskatchewan, and the Atlantic provinces runs its own licensing authority (College of Trades in Ontario, Industry Training Authority in British Columbia, Apprenticeship and Industry Training in Alberta, Commission de la construction du Québec / CCQ in Quebec). Federal Red Seal Program harmonizes journey-level certification across provinces but does not replace provincial licensing.
- **Insurance requirements.** Provincial Workers Compensation Board (WCB) coverage mandatory for any worker classified as employee. Commercial General Liability minimum varies by province and trade — common floor is $2 million CAD aggregate, $5 million for high-risk trades. Sherpa Pros requires verified Certificate of Insurance (COI) on file before pro activation.
- **Tax treatment.** Goods and Services Tax (GST) at 5% federally plus provincial Harmonized Sales Tax (HST) (e.g., Ontario 13% combined HST, British Columbia 5% GST plus 7% Provincial Sales Tax / PST). Marketplace platform must register for GST/HST collection in any province where annual revenue exceeds $30,000 CAD. Place-of-supply rules determine which province's rate applies to each transaction.
- **Worker classification.** Independent contractor versus employee distinction governed by the Canada Revenue Agency (CRA) common-law tests (control, ownership of tools, chance of profit, risk of loss, integration). Provincial labor boards (Ontario Labour Relations Board, etc.) apply parallel tests for provincial labor-law purposes. Same structural risk as United States 1099 versus W-2 — requires Canadian counsel opinion before pro activation.
- **Payment rails.** Stripe Connect Canada with full CAD settlement. Interac e-Transfer for domestic peer-to-peer. Plaid Canada for bank linking. Wise for any United States parent settlement.
- **Data privacy regime.** Personal Information Protection and Electronic Documents Act (PIPEDA) federally. Provincial overlays in Quebec (Loi 25), Alberta (Personal Information Protection Act / PIPA), and British Columbia (PIPA). Critical: PIPEDA requires that personal information about Canadian residents be processed under Canadian law and be subject to Canadian breach-notification rules. Working assumption is data residency in Canada (defer architecture detail to platform-scale spec).

### 3.2 United Kingdom

- **Trade licensing regime.** Centralized scheme-based registration rather than license-based. Mandatory registration for gas work (Gas Safe Register — replaces the old Council for Registered Gas Installers / CORGI scheme). Voluntary but de facto required by insurers and homeowners: NICEIC for electrical, Federation of Master Builders (FMB) for general construction, Chartered Institute of Plumbing and Heating Engineering (CIPHE) for plumbing. The Sherpa codes engine treats Gas Safe and equivalent registrations as the United Kingdom analog to United States state licensure.
- **Insurance requirements.** Public Liability Insurance is the United Kingdom analog to United States Commercial General Liability — £2 million minimum is the de facto standard for residential trades, £5 million for commercial. Employers' Liability Insurance is mandatory for any pro who employs subcontractors under United Kingdom law. Professional Indemnity Insurance is required for design-and-build work.
- **Tax treatment.** Value Added Tax (VAT) at 20% standard rate, 5% reduced rate for qualifying domestic energy-saving installations. Marketplace platform must register for VAT once United Kingdom turnover exceeds £85,000 (the Making Tax Digital / MTD threshold). His Majesty's Revenue and Customs (HMRC) Domestic Reverse Charge for construction services in the Construction Industry Scheme (CIS) applies between VAT-registered contractors and adds reporting complexity that requires accounting integration on day one.
- **Worker classification.** Off-payroll working rules (IR35) determine whether a self-employed pro is taxed as employed or self-employed. Status determined by Check Employment Status for Tax (CEST) tool plus case law. Sherpa Pros is structurally a marketplace and does not employ pros — analogous defensible position to United States 1099 — but requires HMRC opinion before launch.
- **Payment rails.** Stripe Connect United Kingdom with full GBP settlement. Bacs Direct Debit and Faster Payments for domestic. Open Banking via Truelayer or Plaid United Kingdom for account verification.
- **Data privacy regime.** United Kingdom General Data Protection Regulation (UK GDPR) — substantively identical to the European Union GDPR but adopted independently post-Brexit. Information Commissioner's Office (ICO) enforcement. Data residency is not strictly mandated (United Kingdom has adequacy decisions with most major jurisdictions including the European Union and the United States via the United Kingdom extension to the European Union to United States Data Privacy Framework). Working assumption is data residency in the United Kingdom for risk management even where not strictly required.

### 3.3 Australia

- **Trade licensing regime.** State-based. Queensland Building and Construction Commission (QBCC), NSW Fair Trading, Victorian Building Authority (VBA), Building Practitioners Board (Tasmania), Building Commission Western Australia, Consumer and Business Services (South Australia). Mutual recognition under the Mutual Recognition Act allows a pro licensed in one state to operate in another after notification but not without process. The Sherpa codes engine ingests state-by-state.
- **Insurance requirements.** Public Liability Insurance ($5 million minimum is the industry standard). Workers Compensation Insurance mandatory in every state for any worker classified as employee. Home Building Compensation cover (NSW), Domestic Building Insurance (Victoria), and equivalent state-specific home-warranty insurance schemes for residential work.
- **Tax treatment.** Goods and Services Tax (GST) at 10%. Marketplace platform must register for GST once Australian turnover exceeds $75,000 AUD. Australian Business Number (ABN) required for every pro. Pay As You Go (PAYG) withholding rules apply if a pro does not provide an ABN.
- **Worker classification.** Independent contractor versus employee distinction governed by Fair Work Act 2009 multi-factor test. Personal Services Income (PSI) rules apply additional tax-treatment overlays. Same structural risk as United States 1099 — requires Australian counsel opinion before launch.
- **Payment rails.** Stripe Connect Australia with full AUD settlement. New Payments Platform (NPP) for real-time settlement. BPAY for invoice-based payments. Plaid Australia for account verification.
- **Data privacy regime.** Privacy Act 1988 with Australian Privacy Principles (APP). Office of the Australian Information Commissioner (OAIC) enforcement. Notifiable Data Breaches scheme requires breach notification within 72 hours. Cross-border disclosure restrictions under APP 8. Working assumption is data residency in Australia.

### 3.4 European Union (Berlin Pilot — Germany)

- **Trade licensing regime.** Federal Handwerksordnung (HwO — Trades and Crafts Code) governs trade licensing in Germany. 41 trades (Anlage A) require Master Craftsman (Meisterbrief) certification; 53 trades (Anlage B) are unregulated. Regional Chamber of Crafts (Handwerkskammer) administers registration. Other European Union member states have parallel but distinct regimes (France: Chambre de Métiers, Italy: Albo Imprese Artigiane, Netherlands: SBI registration). Berlin pilot ingests Handwerksordnung; pan-European Union expansion ingests per-member-state.
- **Insurance requirements.** Betriebshaftpflichtversicherung (commercial liability insurance) is industry-standard at €3 million minimum. Berufshaftpflichtversicherung (professional indemnity) for design-and-build work. Statutory accident insurance (Berufsgenossenschaft) mandatory for employees.
- **Tax treatment.** Value Added Tax / Mehrwertsteuer (VAT/MwSt) at 19% standard rate, 7% reduced. Marketplace operators are subject to the European Union Marketplace Directive (2021) requiring quarterly transaction reporting (Directive on Administrative Cooperation 7 / DAC7) for any pro earning over €2,000 EUR per year or 30+ transactions per year. VAT MOSS (Mini One-Stop Shop) registration in one member state covers obligations across all 27 (the One-Stop Shop / OSS regime).
- **Worker classification.** Scheinselbständigkeit (false self-employment) is the German analog to United States 1099 misclassification. Deutsche Rentenversicherung (German pension insurance) audit is the enforcement mechanism. Same structural risk; requires German counsel opinion before launch.
- **Payment rails.** Stripe Connect Germany with full EUR settlement. Single Euro Payments Area (SEPA) Direct Debit for domestic and cross-border European Union. Klarna and Sofort for German consumer preferences. PayPal as a Germany-specific consumer comfort layer.
- **Data privacy regime.** General Data Protection Regulation (GDPR) at the European Union level, Bundesdatenschutzgesetz (BDSG) federal overlay in Germany. Data Protection Authority (Bundesbeauftragte für den Datenschutz und die Informationsfreiheit / BfDI) federally plus 16 state-level authorities. Data residency in the European Union mandatory for any personal data processing. Schrems II decision restricts data transfer to the United States — Sherpa Pros European Union operations require data residency in the European Union (working assumption: Frankfurt or Amsterdam region; defer architecture to platform-scale spec).

---

## 4. Localization Framework

### 4.1 Currency

Multi-currency Stripe Connect, with one Stripe Connect account per country and per-country settlement in local currency. Pro payouts in local currency. Customer charges in local currency. Foreign Exchange (FX) settlement to the United States parent (Sherpa Pros LLC) handled via Wise for predictable rates and via Stripe's native FX for in-platform currency conversions. Hedging strategy deferred to Chief Financial Officer (CFO) hire (planned Phase 3 United States, Phase 4 international).

### 4.2 Language

- **Year 1 (Canada):** English-default. Quebec French as Year 2 follow-on (per provincial Bill 96 obligations, the Quebec launch cannot proceed without French localization on day one — so Quebec defers until French is ready).
- **Year 2 (United Kingdom):** English-default. No additional language work — vocabulary differences only (see §4.5).
- **Year 3 (Australia):** English-default. No additional language work — vocabulary differences only (see §4.5).
- **Year 4 to 5 (European Union pilot):** German-required day one for Berlin pilot. French (for any France expansion) and Spanish (for any Spain or Latin American expansion) deferred to Phase 5.

### 4.3 Units of measure

Per-jurisdiction switch handled at the user-account level, defaulting to the country default:
- **United States, Canada (Newfoundland and Labrador notwithstanding):** Imperial (feet, inches, pounds, gallons).
- **United Kingdom:** Mixed. Building trade still uses imperial for lumber dimensions and feet-and-inches for room measurements; metric for everything else. The Sherpa codes engine and the Sherpa Materials orchestration layer must support both per-line-item.
- **Australia, European Union:** Metric (meters, kilograms, liters).

### 4.4 Date format

- **United States:** Month-Day-Year (MM/DD/YYYY).
- **Canada:** Year-Month-Day (YYYY-MM-DD) is government-default but consumer-facing varies. Default to Day-Month-Year (DD/MM/YYYY) for consumer surfaces.
- **United Kingdom, Australia, European Union:** Day-Month-Year (DD/MM/YYYY).

### 4.5 Trade nomenclature

Vocabulary differences that change copy:
- **United States:** "trade pros," "homeowner," "general contractor / GC," "subcontractor / sub," "punch list," "change order," "permit."
- **United Kingdom:** "trades" or "tradespeople" (not "trade pros"), "homeowner" (acceptable in both regions), "main contractor" or "principal contractor" (not "general contractor"), "subcontractor" (acceptable in both), "snagging list" (not "punch list"), "variation" (not "change order"), "planning permission" plus "Building Regulations approval" (the United Kingdom split between planning and building control has no United States analog).
- **Australia:** "tradies" (acceptable colloquial; "tradespeople" formal), "homeowner" (acceptable), "head contractor" or "builder" (not "general contractor"), "subcontractor" or "subbie" (acceptable colloquial), "defects list" (not "punch list"), "variation" (not "change order"), "development approval / DA" plus "construction certificate."
- **European Union (German):** "Handwerker" (tradesperson), "Bauherr" (homeowner / building owner), "Generalunternehmer" (general contractor), "Subunternehmer" (subcontractor), "Mängelliste" (defects list), "Nachtrag" (change order / variation), "Baugenehmigung" (building permit).

### 4.6 Per-country brand variants

The Sherpa Pros umbrella national United States brand carries internationally as "Sherpa Pros" with no country sub-brand by default. Country-specific sub-brands ("Sherpa Pros Canada," etc.) appear only where required by local trademark conflict (see §13 open decisions for current trademark search status). The brand voice, color system, typography, and design system documented in `docs/operations/brand-portfolio.md` apply unchanged internationally — the brand bible is global.

---

## 5. Codes Database Localization

The Sherpa codes engine (internal name "Wiseman" — never expose externally; customer-facing surface is "code-aware quote validation" or "Sherpa codes engine") is the structural moat. International expansion requires per-country codes ingestion at scale. Estimated cost per country ranges from $80,000 to $150,000 depending on code volume, language localization, and the availability of a structured digital source (versus only PDF or only print).

### 5.1 Canada — Codes ingestion scope

- **National Building Code of Canada (NBC).** Federal model code, adopted with provincial amendments by every province.
- **Canadian Electrical Code (CEC) / National Electrical Code Canada.** CSA Group standard C22.1, adopted by every province.
- **National Plumbing Code of Canada (NPC) and National Fire Code of Canada (NFC).**
- **Per-province amendments and overlays.** Ontario Building Code (OBC) is the largest; British Columbia Building Code (BCBC), Alberta Building Code (ABC), Quebec Construction Code, etc.
- **Vendor evaluation.** UpCodes Canada coverage exists; Westlaw Canada offers structured access; CSA Group sells digital licenses directly.
- **Estimated ingestion cost.** $90,000 to $120,000 CAD over 6 months including digital license, ingestion engineering, validation against 50+ test cases, and Quebec French language localization (Year 2).

### 5.2 United Kingdom — Codes ingestion scope

- **Building Regulations 2010 plus Approved Documents A through R.** The mandatory regulations plus the guidance documents that satisfy them (Approved Document A: Structure, B: Fire safety, etc.).
- **BS 7671 IET Wiring Regulations.** The mandatory electrical installation standard, currently 18th Edition. Published by the Institution of Engineering and Technology (IET).
- **Gas Safe regulations.** The Gas Safety (Installation and Use) Regulations 1998 plus current Gas Safe Register technical bulletins.
- **Local Authority Building Control (LABC) variations.** Per-council overlays, particularly meaningful in London boroughs.
- **Vendor evaluation.** No direct UpCodes United Kingdom equivalent. The British Standards Institution (BSI) sells digital access. Construction Industry Research and Information Association (CIRIA) publishes guidance. Manual ingestion plus engineering work is the working assumption.
- **Estimated ingestion cost.** £80,000 to £110,000 (~$100,000 to $140,000 USD) over 6 months.

### 5.3 Australia — Codes ingestion scope

- **National Construction Code (NCC).** The federal model code published by the Australian Building Codes Board, adopted with state amendments.
- **AS/NZS 3000:2018 Wiring Rules.** The mandatory electrical installation standard (joint Australian and New Zealand standard).
- **Per-state amendments.** Queensland Development Code, NSW Building Code variations, etc.
- **Vendor evaluation.** Standards Australia sells digital licenses. SAI Global is the secondary vendor. Some state-government portals offer free access.
- **Estimated ingestion cost.** $100,000 to $130,000 AUD (~$65,000 to $85,000 USD) over 6 months.

### 5.4 European Union (Berlin Pilot — Germany) — Codes ingestion scope

- **EN harmonized standards.** European Norm standards published by the European Committee for Standardization (CEN), CENELEC, and the European Telecommunications Standards Institute (ETSI). Adopted with national overlays.
- **Bauordnung (German Building Code).** Federal model plus 16 state Bauordnungen (LBO). Berlin pilot ingests Berliner Bauordnung specifically.
- **DIN VDE standards.** German electrical installation standards (Deutsches Institut für Normung / German Institute for Standardization). The German parallel to BS 7671 in the United Kingdom and AS/NZS 3000 in Australia.
- **Vendor evaluation.** Beuth Verlag (DIN's commercial arm) sells digital licenses. CEN itself sells EN standards. Manual ingestion plus engineering work is the working assumption.
- **Estimated ingestion cost.** €100,000 to €140,000 (~$110,000 to $150,000 USD) over 6 to 9 months including German-language localization.

### 5.5 Total codes ingestion budget

Across all four priority countries: approximately $400,000 to $550,000 USD over Years 1 through 5. Front-loaded to Year 1 Canada (the de-risking step) and Year 4 Berlin pilot (the highest risk).

---

## 6. Talent Strategy per Country

Each country gets a four-person founding team. No country launches Phase 1 without all four hired and on-payroll for at least 60 days.

- **Country General Manager.** Executive hire. Local trade industry background mandatory (former construction-tech operator, former trades industry executive, or former marketplace executive in the country). Owns Profit and Loss (P&L), regulatory readiness, country roadmap. Reports to Phyrom (Global Chief Executive Officer / CEO) and to the Chief Operating Officer (COO) once that role is hired in Phase 3 United States.
- **Operations Lead.** Owns pro onboarding, dispute resolution, country-specific compliance, codes-engine validation. Local hire.
- **Customer Support Lead.** Owns the Sherpa Threads inbound, Sherpa Success Manager equivalent (if launched in-country), and per-country language support if applicable. Local hire.
- **Business Development Lead.** Owns pro recruiting, Property Manager pipeline, utility and trade-association partnerships, supply-house relationships. Local hire.

**Loaded annual cost per country.** $400,000 to $600,000 USD across the four hires, varying by country (United Kingdom and Australia higher than Canada; European Union pilot highest because of European employer-of-record overhead). The country General Manager alone runs $180,000 to $250,000 USD all-in including equity.

**Hiring sequence.** Country General Manager hired 6 months before in-country Phase 0 begins (lead time to assemble the rest of the team and stand up regulatory readiness). Other three hires complete during Phase 0 in-country (months 1 through 3 of country launch).

**Reporting and global structure.** Phyrom remains the single Global CEO with all country General Managers reporting to him through a future COO (planned Phase 3 United States hire). Country teams are organized by country, not by function — no global Chief Marketing Officer (CMO) sitting above country marketing leads — to keep accountability inside the country P&L.

---

## 7. Per-Country Phase 0/1/2 Launch Sequence

Each country mirrors the proven United States Phase 0 / Phase 1 / Phase 2 model, parameterized for the country.

### 7.1 In-country Phase 0 — Regulatory readiness plus payment rails (Months 1 through 3 of country launch)

- Country General Manager hired and on-payroll.
- Local entity formed (Canadian-controlled private corporation in Canada, Limited company in the United Kingdom, Proprietary Limited in Australia, Gesellschaft mit beschränkter Haftung / GmbH in Germany).
- Local Stripe Connect account live with native-currency settlement.
- Local insurance broker engaged; per-country platform liability insurance bound.
- Local counsel engaged for worker-classification opinion.
- Codes engine ingestion complete for the launch metro (Toronto for Canada, London for United Kingdom, Sydney for Australia, Berlin for European Union pilot).
- Beta cohort agreement and pro service agreement localized to country law.

### 7.2 In-country Phase 1 — Beta cohort in launch metro (Months 4 through 9 of country launch)

- 10 to 15 founding pros recruited in the launch metro. Mirrors United States Phase 0 cohort composition: heavy on trades that match country-specific underserved-trade lanes (heat pumps in Canada and the United Kingdom under net-zero policy push, electric vehicle / EV charger installs in every country, energy retrofits for European Union energy directive compliance, old-housing-stock specialty in the United Kingdom).
- Live transaction beta. Real Gross Merchandise Value (GMV).
- Country-specific traction artifacts produced for the next country's launch (the Canada Phase 1 cohort proof unlocks the United Kingdom Phase 0 hire decision).

### 7.3 In-country Phase 2 — Scaled launch in 3 to 4 metros (Months 10 through 18 of country launch)

- Expand from launch metro to 3 to 4 metros. Canada: Toronto, Vancouver, Calgary, Ottawa or Montreal (Quebec depends on French localization status). United Kingdom: London, Manchester, Birmingham, Bristol or Edinburgh. Australia: Sydney, Melbourne, Brisbane, Perth. European Union pilot: Berlin, then potentially Hamburg or Munich if the Berlin pilot validates.
- Local team scaled to 8 to 12 in-country including country-specific Pro Success Managers.
- Country-specific paid acquisition (paid social adapted to country, paid search on country-specific keywords, country-specific public relations).
- Country-level Property Manager (PM) anchor signed.
- Country breakeven targeted at Phase 2 exit.

### 7.4 In-country exit gate (triggers next-country Phase 0)

- 100+ active pros across launch metros.
- $1,000,000 USD-equivalent annualized GMV.
- Country breakeven on operating cost.
- 1+ Property Manager anchor signed.
- Country General Manager on track against retention and pro Net Promoter Score (NPS) targets.

---

## 8. International Monetization Model

Take rate adjusted per country to reflect local trade industry margin culture and competitive dynamics. The five-tier Sherpa Score economics from §5 of the United States GTM spec carry over with country-specific calibration.

| Country | Founding Pro | Gold | Silver / Bronze | Sherpa Flex equivalent | Materials coordination | Sherpa Home subscription |
|---|---|---|---|---|---|---|
| United States (baseline) | 5% | 8% | 12% | 18% | 8 to 12% | $19 / $149 USD |
| Canada | 5% | 8% | 12% | 18% | 8 to 12% | ~$25 CAD / ~$199 CAD (PPP-adjusted) |
| United Kingdom | 5% | 7% | 10% | 15% | 8 to 12% | ~£15 GBP / ~£119 GBP |
| Australia | 5% | 9% | 13% | 19% | 8 to 12% | ~$29 AUD / ~$229 AUD |
| European Union (Berlin pilot) | 5% | 7% | 10% | 15% | 8 to 12% | ~€18 EUR / ~€139 EUR |

**Why the per-country adjustments.** United Kingdom trades culture runs on lower margins than United States (typical United Kingdom trade gross margin is 15 to 25% versus United States 25 to 40%) — an 8% take rate would price Sherpa Pros out of the market, so Gold drops to 7% with Standard at 10%. Australia trade margins run slightly higher than United States (regulatory and insurance overhead is higher), so the take rate trends up. Canada is roughly at parity with the United States. European Union trades culture similar to United Kingdom on margin compression, so the United Kingdom calibration applies.

**Materials coordination at 8 to 12% holds globally.** The materials margin is structural to the cost of materials orchestration (procurement plus delivery plus coordination overhead) and does not flex with local labor market conditions.

**Sherpa Home subscription priced at Purchasing Power Parity (PPP) equivalent of the United States $19 monthly / $149 annual baseline.** Local-currency pricing rounded to clean local-currency price points, not raw FX conversion.

---

## 9. Data Residency Strategy

This section is intentionally high-level and defers architectural detail to the platform-scale-architecture spec being written in parallel.

**Working assumption.** Sherpa Pros operates a multi-region database architecture, with a database region per regulatory jurisdiction:
- **United States data:** United States region (existing — current Neon Postgres deployment).
- **Canadian data:** Canadian region (PIPEDA requirement plus provincial overlays).
- **United Kingdom data:** United Kingdom region (UK GDPR risk-management requirement).
- **Australian data:** Australian region (Privacy Act 1988 cross-border restriction risk-management).
- **European Union data:** European Union region (GDPR mandatory; Frankfurt or Amsterdam working assumption).

**Cross-region considerations.** A pro who operates in two countries (e.g., a Canadian pro who works on a project across the United States border) creates a data-residency edge case that the platform-scale spec must resolve. Working assumption: dual-account model with one country-of-operation data record per region. Defer to platform-scale spec.

**Data Subject Access Requests (DSAR) and the right to be forgotten.** GDPR, UK GDPR, PIPEDA, and APP all guarantee data subject access and deletion rights. The Sherpa Guard audit log architecture must support per-region deletion that does not break audit-log integrity. Defer to platform-scale spec.

---

## 10. International Franchising Overlay

This section is intentionally high-level and defers franchising mechanics to the franchise spec being written in parallel.

**Working assumption.** The international rollout may be 100% master-franchisee model rather than the hybrid greenfield-plus-franchise model used in the United States. The capital intensity of standing up a four-person country team plus regulatory readiness plus codes ingestion in every country is roughly $2 to $3 million USD per country in Year 1 alone — a per-country master franchisee absorbs that capital burden in exchange for an exclusive country license, accelerates the rollout, and shifts the country-General-Manager hiring problem to the franchisee.

**Trade-off.** Master franchisee rollout sacrifices unit economics (franchisee captures a meaningful share of the country's Gross Profit) in exchange for capital efficiency and speed. The right answer per country may differ — Canada (low-risk adjacent market) may justify greenfield to capture full economics; the European Union (high-risk pilot) almost certainly does not. Per-country greenfield-versus-master-franchise decision is an open decision (§13). Defer mechanics to franchise spec.

---

## 11. Budget and Capital Required

### 11.1 Phase 4 international fundraise size

Series B+ raise of approximately **$25 to $50 million USD** to fund the four-country international rollout over Years 1 through 5. Lower bound assumes master-franchise model in 3 of 4 countries (lower per-country burn). Upper bound assumes greenfield in all 4 countries.

### 11.2 Per-country burn (greenfield model)

- **First 18 months per country:** $2 to $3 million USD inclusive of:
  - Country General Manager plus 3 founding hires: $400,000 to $600,000 USD per year for 1.5 years = $600,000 to $900,000 USD.
  - Codes ingestion: $80,000 to $150,000 USD one-time.
  - Local entity formation, legal counsel, insurance broker, payment-rails setup: $100,000 to $200,000 USD one-time.
  - Phase 1 marketing budget (paid acquisition, Public Relations / PR, trade shows): $300,000 to $500,000 USD over 12 months.
  - Local office plus operating overhead: $200,000 to $400,000 USD.
  - Working capital plus contingency: $300,000 to $500,000 USD.

### 11.3 Expected unit economics breakeven

- **24 to 30 months per country.** Canada faster (lower regulatory friction, English-default, mature payment rails) — target 24 months. United Kingdom and Australia at 27 months. European Union pilot at 36 months (the pilot is not designed to break even in Year 1 — it is designed to inform the European Union expansion decision in Year 6).

### 11.4 Capital sequence

- **Year 1 (Canada):** $3 million USD allocated.
- **Year 2 (United Kingdom):** $3 million USD allocated. Canada operating at or near breakeven.
- **Year 3 (Australia):** $3 million USD allocated. Canada profitable, United Kingdom approaching breakeven.
- **Year 4 to 5 (European Union pilot):** $3 to $6 million USD allocated depending on pilot scope.
- **Reserve for opportunistic expansion plus FX hedging:** $5 to $10 million USD.

---

## 12. Risk Register

Top 10 risks for international expansion. Each risk has a Phase, Severity, Early Signal, and Mitigation.

| # | Risk | Phase | Severity | Early signal | Mitigation |
|---|---|---|---|---|---|
| IR1 | Regulatory misstep per country (worker classification challenge, marketplace operator obligation missed, codes ingestion incomplete leads to inaccurate quote validation) | All | Critical | Any cease-and-desist, regulator inquiry, or quality complaint tracing to a missed code | Per-country counsel engaged before Phase 0; codes engine validated against 50+ test cases per country before launch; in-country General Manager owns regulatory readiness as primary metric |
| IR2 | Currency / FX volatility erodes United States parent unit economics | All | High | Sustained 10%+ adverse move in CAD, GBP, AUD, or EUR against USD over a quarter | Wise FX hedging on all per-country balances; in-country settlement in local currency; quarterly hedge ratio review with CFO once that role is hired |
| IR3 | Country General Manager hire failure | All | Critical | First 90-day milestones missed; local team hires stalling; Net Promoter Score / NPS from country pros below floor | Equity-heavy compensation to attract operator-quality talent; Phyrom personally owns first General Manager search per country; 60-day onboarding before in-country Phase 0 begins |
| IR4 | Codes ingestion underestimate (cost, time, accuracy) | All | High | Ingestion budget over-run by >25%; codes-engine validation accuracy below 95% on per-country test set | Front-load Canada (lowest risk) for budget calibration; vendor evaluation before commit; budget contingency 25% on every country |
| IR5 | Payment rails gap (Stripe Connect feature missing in country, alternate provider needed) | All | Medium | Stripe Connect onboarding friction reports from country pros; missing feature blocks pro activation | Payment-rails diligence at Phase 0 per country; Adyen, Mollie, or Wise as backup providers; country-specific rail integration (Interac in Canada, Bacs in United Kingdom, BPAY in Australia, SEPA in European Union) |
| IR6 | Trademark conflicts in country | All | Medium | Local "Sherpa" or "Sherpa Pros" trademark conflict surfaces during pre-launch search | Pre-launch trademark search per country (Year 0 of country launch); per-country brand variant fallback (e.g., "Sherpa Pros UK") if conflict |
| IR7 | Cultural fit per market (United Kingdom trades distrust United States platforms, Australian tradies skeptical of marketplace models, European Union trades preference for in-country incumbent) | All | Medium-High | Pro recruiting conversion below 15% in country Phase 1; pro NPS below US baseline | In-country General Manager with local trade industry credibility; founder story localized (Phyrom-as-working-GC framing held — biography is the trust signal); local trade-association partnerships at Phase 0 |
| IR8 | International team management overhead (timezone fragmentation, communication cost, decision-making latency) | All | Medium | Decision latency on cross-country issues exceeds 5 business days | Asynchronous-first communication model (Sherpa Threads internally); weekly global ops review; quarterly in-person all-hands; COO hire before second-country Phase 0 |
| IR9 | Exchange rate exposure on Wefunder valuation and United States-listed financials | Phase 4+ | Medium | Sustained adverse FX move materially affects valuation marks | Hedging strategy plus disclosure language on Wefunder; quarterly valuation marks reflect FX as a separate line; CFO hire owns this |
| IR10 | Geopolitical risk in European Union (regulatory reversal, Brexit-style departure of a member state, GDPR enforcement action, energy crisis affecting Berlin pilot economics) | Phase 4+ | Medium-High | Specific regulatory action; member-state political shift; energy-cost shock | Pilot scope kept small; defer European Union expansion decision until pilot validates; member-state diversification once pilot proves out |

---

## 13. Open Decisions

Decisions that are not yet locked and require either Phyrom decision or in-country General Manager input once hired.

| # | Decision | Why it matters | Working answer (pending lock) |
|---|---|---|---|
| ID1 | Quebec French localization timing | Bill 96 requires French-default for any consumer-facing service in Quebec; Year 1 Canada launch can either (a) skip Quebec entirely and launch English-Canada only, or (b) defer Year 1 launch by 6 months to ship French day one. | **Working default:** skip Quebec in Year 1 (launch Toronto, Vancouver, Calgary). Quebec joins as Year 2 follow-on once French localization ships. |
| ID2 | Australia versus New Zealand split or combined | Trans-Tasman Mutual Recognition allows shared trade licensing; AS/NZS 3000 wiring rules are joint. Could launch Australia plus New Zealand together as Year 3, or defer New Zealand to Year 5+. | **Working default:** Australia only in Year 3. New Zealand deferred to Year 5+ as a low-cost incremental once Australia at Phase 2 exit. |
| ID3 | European Union pilot country choice | Berlin (Germany — largest market, friendliest regulatory, single-language) versus Amsterdam (Netherlands — English-default professional environment, smaller market, easier compliance) versus Madrid (Spain — Spanish unlocks Latin American expansion, smaller TAM). | **Working default:** Berlin. Open to Amsterdam if Berlin diligence surfaces a Schrems II data-residency blocker we cannot resolve cost-effectively. |
| ID4 | Master-franchise versus greenfield per country | Capital efficiency versus unit economics. Greenfield Canada (low-risk, capture full economics) is most defensible; greenfield European Union pilot (high-risk, conserve capital) is least defensible. | **Working default:** greenfield Canada and United Kingdom. Master franchise Australia and European Union. Lock per-country at country General Manager hire. |
| ID5 | Sherpa Hub physical-location deployment internationally | Sherpa Hub model designed for United States supply-chain dynamics. Per-country Hub economics need fresh diligence (United Kingdom: Wickes / Toolstation / Screwfix dominate the trade-counter format; Canada: Home Depot Pro and Lowe's Pro mirror United States; Australia: Bunnings dominates; European Union: Bauhaus / OBI / Hornbach / Leroy Merlin). | **Defer to Sherpa Hub Integration spec being written in parallel.** Working assumption: defer Hub launch to country Phase 2 exit, if at all. |
| ID6 | Per-country brand variant ("Sherpa Pros Canada" versus "Sherpa Pros") | Trademark search status drives this. If "Sherpa" or "Sherpa Pros" is clear in country, use the umbrella. If conflict, country sub-brand. | **Working default:** umbrella "Sherpa Pros" everywhere. Pre-launch trademark search per country at Phase 0. |
| ID7 | Codes-engine vendor strategy per country | Westlaw, UpCodes, BSI, Standards Australia, Beuth Verlag, CSA Group are vendor candidates. Buy-versus-license-versus-manual-ingest decision per country. | **Defer to codes ingestion runbook in the implementation plan.** Working assumption: license where structured digital is available; manual ingest where only PDF or print exists. |
| ID8 | International CFO hire timing | Could hire CFO at Phase 3 United States (before international begins) or at Phase 4 (when international actually fundraises). | **Working default:** Phase 3 United States hire. CFO must be in seat before Phase 4 Series B+ fundraise. |
| ID9 | Sherpa Success Manager international launch | Managed-service tier may not work in United Kingdom or Australia where homeowner expectations and labor cost differ. | **Working default:** launch Sherpa Success Manager in Canada Year 2 (after Year 1 marketplace proof). United Kingdom and Australia decision deferred to in-country General Manager. |
| ID10 | Wefunder international equivalent for community fundraise per country | Wefunder is United States-only. Crowdcube (United Kingdom), FrontFundr (Canada), Equitise (Australia), Seedrs (United Kingdom plus European Union) are country-specific equivalents. | **Defer to Phase 4 fundraising strategy.** Working default: Series B+ from institutional capital, not crowdfunding, for international expansion. |

---

## 14. Brand Bible Compliance Footer

This spec has been written under the brand bible discipline documented at `docs/operations/brand-portfolio.md`:

- **"Wiseman" never used externally.** All references to the codes intelligence layer use "Sherpa codes engine," "code-aware quote validation," or "code intelligence layer." Internal naming retained only in implementation-detail context where the engineering layer name is load-bearing.
- **All abbreviations spelled out on first use.** TAM, GMV, NPS, CFO, COO, CEO, FX, PPP, GST, HST, VAT, GDPR, PIPEDA, APP, NEC, IRC, IET, NICEIC, CIRIA, ABCB, OAIC, ICO, BfDI, P&L, DSAR, DSAR (data subject access request), CMO, CSI, MTD, OSS, MOSS, DAC7, IR35, CEST, CIS, COI, WCB, CCQ, DA, NPP, BPAY, SEPA, CEN, CENELEC, DIN, GmbH, etc. — every abbreviation paired with full term on first appearance.
- **No region-anchored brand language.** Sherpa Pros is the national licensed-trade marketplace with international roadmap. Every country in this spec is launch geography under the umbrella brand, not a regional rebrand.
- **8th-grade reading level on human-facing summaries.** Section 1 and Section 2 country rationales held to plain English. Regulatory section 3, codes section 5, and risk register section 12 are necessarily denser because the audience is operator-class.
- **Founder framing.** Phyrom remains the named founder throughout. No surname invented (none on record). "Phyrom" first reference, "Phyrom" thereafter.
- **No hype.** No "disrupt," no "revolutionize," no "AI-powered" as headline framing. Confident and specific language throughout.

---

## Appendix A — Cross-Spec References

- **Phase 4 high-level reference:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` §4.6.
- **Brand bible:** `docs/operations/brand-portfolio.md`.
- **Product portfolio:** `docs/operations/sherpa-product-portfolio.md` (Phase 4 column).
- **Franchise mechanics:** companion spec being written in parallel — defer franchising detail to that file.
- **Multi-region database architecture:** companion platform-scale spec being written in parallel — defer architecture detail to that file.
- **International Sherpa Hub deployment:** companion Sherpa Hub Integration spec being written in parallel — defer Hub detail to that file.
- **Implementation plan:** `docs/superpowers/plans/2026-04-25-international-expansion-plan.md`.
