# MassCEC InnovateMass — Sherpa Pros Application Draft

**Program:** Massachusetts Clean Energy Center (MassCEC) — InnovateMass
**Award size:** Up to $350,000 (matching cost-share required, typically 25% applicant)
**Sponsor URL:** https://www.masscec.com/program/innovatemass
**Applicant:** Sherpa Pros LLC (Phyrom, Founder — operating in MA via Boston specialty deployment; HJD Builders LLC parent operations in NH)
**Draft date:** 2026-04-22
**Status:** DRAFT — for Phyrom review prior to submission

---

## 1. Program at a Glance

InnovateMass funds Massachusetts-based clean energy technology demonstrations that have moved past prototype but require funding to install and operate at a real-world site in Massachusetts. The program targets technologies that "validate technical and business merit at a Massachusetts site." Sherpa Pros fits the **enabling-technology / market-acceleration** track: a software platform that materially accelerates the install-throughput of Mass Save heat pumps, electric panel upgrades, and EV chargers — the exact program scope that funds Massachusetts decarbonization.

**Why we win:** MA has the largest construction labor shortage in the nation (2.5% construction unemployment, lowest in 17+ years; 30% of MA residential construction workers are 55+). Heat-pump install velocity is rebate-bound on the demand side and labor-bound on the supply side. Our platform unblocks the labor-side bottleneck by matching homeowners to certified installers, validating quotes against MA Electrical Code and program eligibility before scheduling, and surfacing rebate stacking automatically. Every additional install we route is a measurable decarbonization unit MassCEC can attribute to its grant dollar.

---

## 2. Required Documents Checklist

- [ ] Project narrative (≤8 pages, NSF-style structure: Executive Summary, Project Description, Workplan, Team, Commercialization, Climate Impact)
- [ ] Detailed budget (Excel template from MassCEC; categories: Personnel, Subcontracts, Materials, Site, Travel, Indirect)
- [ ] Budget justification (1–2 pages, narrative pairing each line item to project tasks)
- [ ] Cost-share commitment letter (25% minimum; can be in-kind founder time at fully loaded rate, or matched dollars from Wefunder / VC / accelerator close)
- [ ] Massachusetts site/host letter of support (Boston-area beta pro or Mass Save HPC contractor)
- [ ] Two letters of support from MA stakeholders (recommended: a Mass Save HPC contractor + an MA homeowner who completed a heat-pump install)
- [ ] Resumes / bios for Phyrom and any technical contributors (≤2 pages each)
- [ ] MA business registration (if Sherpa Pros LLC is registered in NH only, file MA foreign-LLC registration before submit — **eligibility blocker, see §11**)
- [ ] Technology demonstration plan (separate doc, ≤4 pages — see §6)
- [ ] Key milestones with measurable success criteria (90-day, 6-month, 12-month — see §7)
- [ ] Form W-9 for Sherpa Pros LLC
- [ ] Conflict-of-interest disclosure
- [ ] Recent financial statements or projections (NSF-comparable; year 1 projection acceptable for early-stage)

---

## 3. Eligibility Verification

| Criterion | Sherpa Pros status | Cite |
|---|---|---|
| Massachusetts entity OR registered to do business in MA | **Action item.** Sherpa Pros LLC currently registered in NH. MA foreign-LLC registration required before submission. ~$500 fee, 5–7 business days. | MA Secretary of the Commonwealth filing portal |
| Project demonstrates clean energy technology in MA | Yes — Mass Save heat-pump install acceleration platform | Program scope |
| Technology past prototype stage | Yes — platform live at www.thesherpapros.com, mobile via TestFlight + PWA, Stripe Connect operational | CLAUDE.md tech stack |
| Real-world demonstration at MA site | Yes — Boston specialty deployment plan with Mass Save HPC contractors | GTM spec §2.3, §4.3 |
| 25% cost-share available | Yes — combination of (a) founder loaded labor in-kind, (b) committed Wefunder soft-circle, (c) HJD Builders match | GTM spec §6.4 |
| Project completion ≤24 months | Yes — 12-month deployment + 6-month measurement period | This document §7 |

**Verdict:** Eligible upon completion of MA foreign-LLC registration. No other structural blockers identified.

---

## 4. Project Title

**"Code-Aware Installer Throughput Acceleration for Massachusetts Heat-Pump and EV-Charger Decarbonization"**

---

## 5. Application Narrative (≤8 Pages — Draft)

### 5.1 Executive Summary (≤1 page)

Massachusetts has set the most aggressive residential decarbonization goals in the United States, anchored by the Mass Save program (75,000+ heat pumps installed since 2019, 2026 rebates of $2,650/ton capped at $8,500/whole-home install) and the National Grid Turnkey EV Charging Installation Program. These programs are demand-funded — homeowner rebates are abundant — but they are **supply-bottlenecked**: Massachusetts has the largest construction labor shortage in the nation (2.5% construction unemployment, lowest in 17+ years), 30% of MA residential construction workers are 55+, and project completion times have stretched from 7 to 11 months [WBJournal; Bisnow Boston; cited in Sherpa Pros GTM spec §2.1]. Every dollar of Mass Save rebate sits in a queue waiting for a certified installer with capacity.

Sherpa Pros is the licensed-trade marketplace built by a working New Hampshire general contractor (Phyrom, HJD Builders LLC) to address exactly this bottleneck. The platform is already operational — web at www.thesherpapros.com, mobile via TestFlight/PWA, Stripe Connect for marketplace splits, Neon Postgres + PostGIS for geo-matching, Clerk for verified pro/client roles, and a proprietary code-aware quote-validation layer that reads NEC, IRC, MA Electrical Code, and NH RSA in real time.

**InnovateMass funding will deploy Sherpa Pros across the Boston metro for three Mass Save and utility-program-aligned use cases — heat-pump installs, EV-charger installs, and electric-panel upgrades — and measure throughput improvement (installs/week per certified contractor), quote accuracy (% of quotes passing first-pass program-eligibility check), and rebate-stacking capture (% of eligible installs claiming all available federal + state + utility incentives).** The cost-share match comes from founder labor (in-kind, at fully loaded $185/hr rate), parallel non-dilutive raises (Wefunder Reg CF, MassDev Biz-M-Power), and HJD Builders bridge capital.

The funding ask is **$350,000** over 18 months. Projected outcomes by month 18: **200+ certified MA installer pros active on platform**, **400+ Mass Save / National Grid Turnkey installs routed**, **measurable installer-throughput lift** (target: 25%+ vs. status-quo lead-gen platforms), and **a published case study** documenting platform-attributable decarbonization tonnage that MassCEC can use in program reporting.

### 5.2 Problem Statement & Climate Thesis (≈1.5 pages)

**Heat-pump install velocity is decarbonization velocity.** A Mass Save air-source heat pump replacing oil or gas heat eliminates approximately 4–6 metric tons of CO2-equivalent emissions per year per household over its 15-year lifetime [MA EEAC modeling]. The 2026 Mass Save rebate structure ($8,500 cap per whole-home install) is the most generous in the country. The bottleneck is not money. The bottleneck is **labor** — specifically, the throughput of EPA-certified, NEC-compliant, MA Electrical Code-fluent contractors capable of completing the install and the often-required electrical panel upgrade.

Existing matching infrastructure is inadequate:

1. **Mass Save Find-an-Installer** is a static contractor listing — no dispatch, no scheduling, no quote validation, no escrow, no in-app messaging, no permit assist, no rebate calculator. A homeowner finds names and phone numbers and is on their own [Mass Save Trade Partners directory].
2. **Lead-gen platforms (Angi, Thumbtack, HomeAdvisor)** charge contractors $30–$100 per shared lead, do not verify EPA Heat Pump Installer Network (HPIN) status, do not validate quotes against MA Electrical Code, and do not surface rebate eligibility. The MA AG and Vermont AG have publicly settled on misleading "Certified Pro" terminology with these platforms [Vermont AG Oct 2025 settlement; Sherpa Pros competitive analysis §2].
3. **National Grid Turnkey EV** publishes program rules but routes installer matching to the homeowner's own search effort; the program does not currently have a software layer that sequences panel-upgrade + EV-charger install into a single contractor dispatch.

**Sherpa Pros' code-aware quote-validation layer** (the proprietary intelligence layer the Sherpa Pros platform runs internally) addresses each of these gaps:

- **Verified license + EPA cert + Mass Save HPIN status** is checked at pro onboarding and re-checked on annual renewal.
- **Quotes are validated against NEC 2023, MA Electrical Code (527 CMR 12.00), IRC, and Mass Save program eligibility rules** in real time before the homeowner sees them. Missing line items, wrong materials, code violations, and rebate-eligibility gaps surface with explanatory text the homeowner can read.
- **Permit assist** identifies which jobs require ISD permits in Boston and which trigger 1-year electrical inspection follow-ups under MA practice.
- **Rebate stacking** auto-checks Mass Save + Inflation Reduction Act § 25C / 25D federal credits + Eversource / National Grid utility-specific bonuses + low-income enhancements (HEAT Loan, EBE) and presents the post-rebate net cost to the homeowner during the bid review.
- **Single-contractor dispatch** (not lead-blast) means one matched installer gets the job exclusively at a 5–10% take rate vs. paying $30–$100 per shared lead.

**Climate thesis (one sentence):** *Every Mass Save heat-pump install Sherpa Pros routes that would not have happened without the platform — or that happens 30 days sooner because the platform compressed the contractor-search and quote-validation cycle — is decarbonization tonnage attributable to MassCEC's grant dollar.*

### 5.3 Technology Description (≈1.5 pages)

**Platform architecture (live, demonstrable):**

| Layer | Technology | Function |
|---|---|---|
| Frontend (web) | Next.js 16 (App Router), Tailwind CSS 4, deployed on Vercel | Homeowner job posting, pro dashboard, code-checked quote review |
| Frontend (mobile) | PWA + iOS TestFlight (Expo wrapper) | Field-pro mobile workflow |
| Auth | Clerk (Pro/Client role separation) | License verification, insurance verification, EPA cert tracking |
| Payments | Stripe Connect | Marketplace splits, 7-day escrow hold, 1099-NEC reporting for pros >$600/yr |
| Database | Neon PostgreSQL + PostGIS (Drizzle ORM) | Geo-matching, 20-table marketplace schema |
| Maps | Google Maps JavaScript API (@vis.gl/react-google-maps) | Uber-style dispatch UX |
| Communication | Twilio (masked phone + SMS) | Privacy-preserving contractor-homeowner messaging |
| Code intelligence | Proprietary code-aware quote-validation layer | NEC, IRC, MA Electrical Code, NH RSA — 192 codes, 480K entries, 284 NH municipalities cataloged; MA municipal layer expanding under InnovateMass scope |
| Dispatch | Single-pro matching (not lead-blast) | 7-factor scoring algorithm: license fit, geo, cert, capacity, rating, response time, anti-gaming |

**Innovation claim (defensible):**

The combination of (a) license + cert verification at the directory layer, (b) code-validated quoting in real time, (c) program-eligibility checking against Mass Save / National Grid program rules, and (d) single-contractor dispatch with marketplace economics is **not currently offered by any other platform serving MA homeowners**. National lead-gen platforms (Angi, Thumbtack, HomeAdvisor, Houzz Pro) have no incentive to build this — their P&L runs on lead-share volume, not install completion. Mass Save's Find-an-Installer is a static directory by design. The "licensed + code-aware + marketplace" quadrant is empty (per Sherpa Pros competitive-analysis matrix, slide 2 of investor deck).

The code-intelligence layer is the moat. It required a working general contractor + a 3-year codebase to assemble. Replicating it would require a competitor to (i) acquire the cataloged code corpus, (ii) build the validation engine that maps quote line items to code requirements, and (iii) maintain it as codes update. None of these are licensable shortcuts.

### 5.4 Massachusetts Demonstration Plan (≈1.5 pages)

**Phase 1 — Boston Specialty Cohort Onboarding (Months 0–3 of grant period):**

Recruit **20 EPA-certified Mass Save HPIN contractors** + **15 licensed electricians** + **10 old-house specialists** (panel upgrades on pre-1950 housing — 50%+ of Boston housing pre-dates 1950 per Boston Smart Plastering data) into the platform. Recruitment channels: Mass Save Network application, Eversource HPC Network referrals, NESEA / NAREE conference outreach, supply-house partnerships (Granite Group, FW Webb, City Electric Supply Boston).

**Phase 2 — Live Job Routing (Months 3–9):**

Route real jobs through the platform across three program-aligned use cases:

1. **Mass Save whole-home heat-pump installs** — full retrofit, $15K average ticket pre-rebate, $2,650/ton incentive, $8,500 max
2. **Electric panel upgrades** — gateway trade for HP + EV + solar; $3,500–$7,000 ticket; often required precondition for HP install
3. **National Grid Turnkey EV charger installs** — Level 2 hard-wired; up-front rebate covers most install costs for eligible MA customers

**Phase 3 — Measurement & Case Study (Months 9–18):**

Quantify and publish:

- Installs routed (count + GMV)
- Installer throughput lift vs. control (compare same-pro install velocity pre-platform vs. on-platform)
- Quote-validation accuracy (% of quotes passing first-pass code/program-eligibility check; % flagged for missing rebate-stack)
- Rebate-stack capture rate (% of installs claiming Mass Save + IRA + utility bonuses)
- CO2-equivalent decarbonization tonnage attributable to platform-routed installs (using MA EEAC standard emissions factors)
- Homeowner NPS, contractor NPS, dispute rate

**Demonstration site:** Boston metro (Suffolk + Middlesex + Norfolk counties initially). Sherpa Pros LLC will register as a foreign LLC in MA; MA-resident contractors do MA work.

### 5.5 Workplan & Milestones (Cross-Reference §7)

See §7 below for 90-day, 6-month, and 12-month milestone schedule with measurable success criteria.

### 5.6 Team

**Phyrom** (Founder & CEO, Sherpa Pros LLC; Founder, HJD Builders LLC) — 12+ years as a working general contractor in New Hampshire. Operates a multi-project residential GC business. Built and maintains Sherpa Pros, the broader BldSync platform that powers the code-aware layer, and the underlying code corpus (192 codes, 480K entries, 284 NH municipalities). Lived the Mass Save / Eversource / National Grid program-rule landscape from the contractor side daily.

**Phase 1 Hires (post-grant award, per GTM spec §4.3):**
- **Pro Success Manager** (covers MA + NH/ME) — onboarding, retention, weekly contractor check-ins, Mass Save Network application liaison
- **Client Concierge** (part-time, remote NE) — proactive homeowner support, dispute triage, rebate-paperwork assist
- **Boston BD lead** (engaged month 4 of grant) — supply-house partnerships, NHHBA + MEHBA + AGC MA introductions

**Advisor slots (open — actively recruiting):** New England trades veteran (NHHBA / MEHBA / AGC MA board); Mass Save program advisor (former Eversource or National Grid program manager); marketplace operator (NFX-shaped two-sided platform veteran).

### 5.7 Commercialization Plan

Sherpa Pros' business model is operational and revenue-generating from beta day one:

- **Marketplace take rate**: 5% beta → 10% standard
- **Pro subscription**: $0 beta → $49/month standard
- **Property Manager tier**: $4 → $1.50/unit/month (recurring multi-year contracts)

Per GTM spec §4.4, Phase 2 (Months 6–12) projects 200+ active pros, 1,000+ completed jobs, $1M+ annualized GMV, with Series A conversations opening Month 10–11. The InnovateMass grant runway carries the platform through this Phase 2 window with a non-dilutive cushion that strengthens both the metro density and the economic case for follow-on Series A.

**Long-term commercialization:** White-label partnerships with utility programs nationally (Eversource Ventures and National Grid Partners are named CVC targets in GTM spec §6.3). The MA demonstration becomes the case study that opens conversations with Connecticut, Rhode Island, and New York utility-program administrators.

### 5.8 Climate Impact (≈0.5 page)

Using MA EEAC standard factors (4–6 tCO2e per heat-pump install per year over 15-year life), and a target of 200 platform-routed Mass Save heat-pump installs over 18 months:

- **Direct attributable tonnage (low end):** 200 installs × 4 tCO2e/yr × 15 yr = **12,000 tCO2e lifecycle**
- **Direct attributable tonnage (high end):** 200 × 6 × 15 = **18,000 tCO2e lifecycle**
- **Throughput-multiplier tonnage** (installs that happen 30 days sooner because platform compressed the dispatch cycle): not separately attributable, but is the durable mechanism of impact

Per dollar of grant: $350K / ~$15K average install ÷ 200 installs implies **~$1,750 of grant per attributable install**, or **~$15–25 per lifecycle ton avoided** — favorable vs. typical decarbonization $/ton benchmarks ($50–$200/ton for utility-side energy efficiency).

---

## 6. Technology Demonstration Plan (Separate Doc, ≤4 Pages — Outline)

1. **Demonstration objectives** — measurable lift in installer throughput, quote accuracy, rebate-stack capture
2. **Site description** — Boston metro (Suffolk, Middlesex, Norfolk counties), virtual platform with field deployment
3. **Test cohorts** — control (baseline pre-platform installer velocity) vs. treatment (post-platform installer velocity, same contractors)
4. **Data collection plan** — Stripe Connect transaction logs, dispatch matching logs, weekly contractor + homeowner NPS surveys, code-validation engine telemetry
5. **Metric definitions and baselines** — installs/week/contractor (baseline ~1.2 from Mass Save HPIN data extrapolation, target 1.5+); first-pass quote accuracy (baseline unknown, target 85%+); rebate-stack capture (baseline ~50% per MA EEAC homeowner survey, target 90%+)
6. **Analysis and reporting cadence** — monthly internal, quarterly to MassCEC, public case study at month 18

---

## 7. Milestone Schedule

| Milestone | Target date | Measurable success criterion | Deliverable to MassCEC |
|---|---|---|---|
| Award + MA foreign-LLC registration complete | Month 1 | LLC registered, grant agreement signed | Filing receipt |
| Mass Save Network application submitted | Month 1 | Application acknowledged | Confirmation email |
| 20 MA HPIN contractors onboarded | Month 3 | 20 verified profiles live on platform | Onboarding log + sample profiles |
| First 25 MA installs routed | Month 6 | $375K+ GMV in MA; 25 installs with code-validated quotes | Stripe Connect MA-segment dashboard export |
| First public Sherpa Pros + Mass Save case-study draft | Month 9 | Draft published to MassCEC for review | Case study PDF |
| 100 MA installs routed | Month 12 | $1.5M+ MA GMV; throughput-lift measurement complete | Quarterly report + measurement appendix |
| 200 MA installs routed | Month 15 | $3M+ MA GMV; rebate-stack capture rate >85% | Quarterly report |
| 400 MA installs + final case study | Month 18 | Final report; public case study with attributed tonnage | Final report + MassCEC-co-branded case study |

**Hard 90-day measurable:** 20 MA HPIN contractors verified and onboarded, Mass Save Network application submitted, MA foreign-LLC registration complete, first 5 platform-routed Mass Save jobs in flight.

---

## 8. Budget Allocation

**Total project cost: $466,667 ($350,000 MassCEC + $116,667 cost-share at 25%)**

| Category | Detail | MassCEC ask | Cost-share | Total |
|---|---|---|---|---|
| **Personnel** | Pro Success Manager (1.0 FTE × 18 mo loaded $90K/yr) | $135,000 | $0 | $135,000 |
| | Client Concierge (0.5 FTE × 18 mo loaded $50K/yr) | $37,500 | $0 | $37,500 |
| | Boston BD lead (0.75 FTE × 12 mo loaded $80K/yr) | $60,000 | $0 | $60,000 |
| | Founder time (in-kind, fully loaded $185/hr × 600 hr) | $0 | $111,000 | $111,000 |
| **Subcontracts** | MA legal — foreign-LLC, contracts, 1099 opinion | $5,000 | $0 | $5,000 |
| | Code-corpus expansion — MA municipal codes (Boston ISD, Cambridge, Brookline, Newton) | $25,000 | $0 | $25,000 |
| | Mass Save Network application + utility partnerships consulting | $10,000 | $0 | $10,000 |
| **Materials** | Cloud infra (Vercel, Neon, Clerk, Stripe, Twilio) — 18 months | $18,000 | $0 | $18,000 |
| | Apple Developer + Google Play + USPTO Old-House Verified filing | $2,500 | $0 | $2,500 |
| **Site / Travel** | MA pro recruitment travel + field calls (Phyrom + BD lead) | $8,000 | $0 | $8,000 |
| | Trade show: NESEA Boston, JLC Live New England | $5,000 | $0 | $5,000 |
| **Other Direct** | Platform liability insurance (~$800/yr × 1.5 yr) | $1,200 | $0 | $1,200 |
| | Marketing collateral, video case-study production | $15,000 | $0 | $15,000 |
| **Indirect (10%)** | De minimis indirect rate | $27,800 | $5,667 | $33,467 |
| **TOTAL** | | **$350,000** | **$116,667** | **$466,667** |

**Cost-share narrative:** The $116,667 match comprises (a) founder time in-kind at $111,000 (600 hours × $185/hr fully loaded), and (b) HJD Builders LLC indirect support ($5,667 — office, equipment, parent-entity admin support). No monetary co-funding from outside investors is required at submission; if MassCEC requires hardened co-funding, parallel Wefunder + MassDev raises (per GTM spec §6.4) supply matching cash within the grant period.

---

## 9. Submission Instructions

- **Portal:** MassCEC online application portal at https://www.masscec.com/program/innovatemass — verify current open round before submit (program runs spring/fall cycles)
- **Deadlines:** Spring round typically closes April–May; Fall round typically closes September–October. **Phyrom should confirm next-round close date with MassCEC program staff (innovatemass@masscec.com) before finalizing budget and timeline.**
- **Format:** Project narrative as PDF, budget as Excel template (download from program page), all letters of support as separate PDFs
- **Contact:** MassCEC Innovation team — innovatemass@masscec.com (general); program officer assigned upon application opening
- **Pre-submission call recommended:** MassCEC program officers will take a 30-minute call to scope fit and answer questions before submission. Phyrom should request this call at least 3 weeks before deadline.

---

## 10. Tips & Gotchas

1. **MA presence is mandatory.** Sherpa Pros LLC must be MA-registered (foreign-LLC filing is sufficient if NH-domiciled). File this 2 weeks before submission. Reviewers will check.
2. **InnovateMass favors demonstrable hardware/software validated at MA sites.** Lead with the live platform URL and offer a live walkthrough to the program officer before submission.
3. **Climate impact must be quantified.** Use MA EEAC published emissions factors. Don't extrapolate freely — cite the source.
4. **25% cost-share can be in-kind founder time** at fully loaded rate (industry-standard $150–$200/hr for senior technical founder). Document the rate basis (W-2 equivalent + benefits + overhead). Avoid claiming founder time at investor-deck $/share rates.
5. **Letters of support matter.** Two MA stakeholder letters carry weight: one from a Mass Save HPIN contractor confirming intent to onboard, one from an MA homeowner who completed an HP install describing the dispatch-friction problem.
6. **Avoid the word "Wiseman"** in any external-facing document — call it "code-aware quote validation" or "platform code intelligence." (Per Sherpa Pros brand bible / GTM spec §3.3.)
7. **MassCEC prefers projects that lead to follow-on commercial revenue, not academic publication.** Lead the Commercialization section with the 5% take-rate revenue model and the Series A trajectory, not with white papers.
8. **Pre-submission call with MassCEC is the highest-ROI hour you can spend** on this application. Use it to test the framing and surface any program-fit concerns before writing the final narrative.

---

## 11. Eligibility Blocker — Phyrom Confirmation Required

**The single open eligibility item is MA foreign-LLC registration for Sherpa Pros LLC.** If Sherpa Pros LLC is currently registered only in NH (per founder records), MassCEC requires a Massachusetts business presence — foreign-LLC registration with the MA Secretary of the Commonwealth is sufficient (~$500 fee, 5–7 business days). Phyrom should confirm current registration status and initiate MA filing before submission.

If for strategic reasons a separate "Sherpa Pros Massachusetts LLC" or DBA is preferred over foreign-LLC registration, that pathway also satisfies eligibility but adds 2–4 weeks of legal lead time.

---

**End of draft. Phyrom: review §11 eligibility blocker, confirm MA registration status, and request the MassCEC pre-submission call before finalizing.**
