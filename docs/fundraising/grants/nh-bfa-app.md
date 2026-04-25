# NH BFA + NH Innovation Voucher — Sherpa Pros Application Drafts (Two-Part)

**Programs:**
- **Part A:** New Hampshire Innovation Voucher (up to $15,000 R&D matching grant; administered through UNH or Dartmouth research partner)
- **Part B:** New Hampshire Business Finance Authority (BFA) Microloan (up to $25,000 working capital; CAPLine 7(a) or BFA Capital Access Program as relevant vehicle)

**Applicant:** Sherpa Pros LLC (Phyrom, Founder) — NH-domiciled, NH-operating
**Parent operations:** HJD Builders LLC (NH-based general contractor, Phyrom's operating company)
**Draft date:** 2026-04-22
**Status:** DRAFT — for Phyrom review prior to submission

---

## 1. Programs at a Glance

**Part A — NH Innovation Voucher** funds small NH-based businesses doing R&D with a New Hampshire research partner (most commonly UNH, Dartmouth, or an NH-based research lab). The voucher is a **matching grant** (typically 50%) — Sherpa Pros contributes $15K of R&D value, the voucher contributes up to $15K, totaling $30K toward a bounded R&D engagement with an NH research partner.

**Part B — NH BFA Microloan** provides working-capital debt (not equity) up to $25K for NH-based small businesses that are either too new or too thin for traditional bank underwriting. Interest rates and terms vary by BFA program vehicle; the Capital Access Program (CAP) and the Business Finance Authority's Direct Lending facility are the two most relevant. This is **debt**, not grant — but the BFA programs price below-market and specifically target early-stage NH businesses creating NH jobs.

**Why Sherpa Pros qualifies for both:**
- **NH-domiciled**. Phyrom + HJD Builders are NH-based. Sherpa Pros LLC is NH-registered.
- **NH-job creating.** Phase 1 plans on-ramp for an NH/ME Pro Success Manager role (per GTM spec §4.3), plus ongoing engagement with NHHBA + MEHBA. The NH tech-hire footprint grows to 2–3 direct NH hires by Phase 2.
- **Genuine R&D content** (for the voucher): the code-corpus work for NH state code (RSA 155-A) and the 284 NH municipal jurisdictions is real R&D that benefits from UNH or Dartmouth research-partner engagement (code-structural-parsing NLP; jurisdictional-overlay data modeling).

---

## 2. PART A — NH Innovation Voucher Application Draft

### 2.1 Required Documents Checklist

- [ ] NH Innovation Voucher application (state portal; check current form at https://www.nheconomy.com/ or the relevant NH Department of Business and Economic Affairs page)
- [ ] NH research partner engagement letter (UNH, Dartmouth, or other NH-eligible lab — confirms scope, deliverables, cost, timeline; see §2.5 for recommended partners)
- [ ] Statement of work between Sherpa Pros and research partner (joint document)
- [ ] Sherpa Pros NH business registration proof
- [ ] Form W-9 for Sherpa Pros LLC
- [ ] Founder bio (Phyrom)
- [ ] R&D budget showing 50% match from Sherpa Pros + 50% voucher

### 2.2 Eligibility Verification

| Criterion | Sherpa Pros status | Cite |
|---|---|---|
| NH-domiciled for-profit | Yes — Sherpa Pros LLC NH-registered; Phyrom NH-resident | — |
| ≤500 employees | Yes — 1 founder + part-time contractors | GTM spec §7 |
| R&D partner engagement with NH research institution | **Action item** — establish formal engagement with UNH (Center for Advanced Sensors / CS department) or Dartmouth (Tuck or Computer Science) | §2.5 below |
| R&D project with defined deliverables | Yes — code-corpus NLP research + NH state code validation; see §2.4 | — |
| 50% cash match available | Yes — founder labor in-kind OR matched by Wefunder soft-circle | GTM spec §6.4 |

### 2.3 Project Title

**"NH State and Municipal Building Code Corpus — NLP Parsing, Jurisdictional Overlay Modeling, and Validation Research"**

### 2.4 Application Narrative (Draft, ≤3 Pages)

**Project overview.** Sherpa Pros maintains a code-aware quote-validation engine (internal: the code-intelligence layer) that reads building codes — NEC, IRC, MA Electrical Code, NH RSA, plus 284 NH municipal overlays — in real time to validate contractor quotes against residential project scopes. The NH portion of this corpus is the most complete state-level coverage in the platform today: 284 NH municipalities cataloged, NH RSA 155-A indexed, Building Official Certification and Licensure Board decisions ingested.

**R&D objectives for the Innovation Voucher engagement (6 months):**

1. **Validate NH code-corpus completeness against held-out NH municipal test set.** Pull 100 historical NH residential jobs (from HJD Builders archive + NH beta pro cohort), run the validation engine against each, measure false-negative rate (missed code-applicability), annotate with NH research-partner expert review.

2. **Develop NH-specific jurisdictional-overlay data model.** NH has unique state-municipal overlay semantics — 284 distinct municipal code-adoption patterns, some reference NFPA directly, some reference IRC + NH RSA, some have local amendments. A formal data model is an open research problem.

3. **Benchmark NLP parsing of NH RSA chapters against industry baseline.** Legal-text retrieval research typically benchmarks on contracts or statutes; building codes have different structural properties (cross-references, enumerated lists, jurisdictional precedence). Publish benchmark results as a deliverable.

4. **Train a research assistant (NH student or post-doc).** Secondary goal: provide NH-student research opportunity with a live commercial problem. Voucher + research-partner engagement unlocks NH-student-hours and NH-research-network relationships.

**Deliverables (to NH Dept of Business and Economic Affairs + research partner):**
- Technical report: NH code-corpus validation results + false-negative analysis
- Formal NH jurisdictional-overlay data-model specification (publicly publishable)
- Benchmark results: NLP parsing of NH RSA chapters (publicly publishable)
- Research-assistant hour log (NH student or post-doc time)

**NH job creation from this R&D:** The voucher-funded research assistant is a direct NH hire (via the research partner's payroll, not Sherpa Pros). Sherpa Pros' post-voucher hiring plan (Phase 1, months 3–6) includes an NH/ME Pro Success Manager role which the voucher engagement helps justify with documented R&D traction.

### 2.5 Recommended NH Research Partners

1. **UNH Center for Advanced Sensors / UNH Computer Science Department** — best fit for NLP + data-modeling engagement; likely path is a 6-month faculty-advised research assistantship for a graduate student. Contact: UNH CS chair via unh.edu/cs.

2. **Dartmouth Computer Science** — alternative if UNH scheduling doesn't line up; Dartmouth CS has strong NLP research (various groups). Slightly less direct fit because Dartmouth is in Hanover (less NH-population-center access to HJD network).

3. **UNH Paul College of Business and Economics** — if the voucher emphasis shifts toward marketplace economics or contractor business-model research rather than code-corpus NLP, UNH Business is a fit. Less aligned with the code-corpus R&D frame but a valid alternative.

**Recommended:** Start with UNH Computer Science. Reach out to the department chair or a named NLP-focused faculty member. Offer a structured 6-month project with clear deliverables.

### 2.6 Outreach Email — UNH Computer Science (Draft for Phyrom)

**To:** UNH CS department chair (find current name at unh.edu/cs)
**Subject:** NH Innovation Voucher R&D engagement — building-code NLP research

> Dear Professor [Chair],
>
> My name is Phyrom. I'm the founder of Sherpa Pros LLC, a New Hampshire-domiciled licensed-trade marketplace platform (www.thesherpapros.com), and the founder of HJD Builders LLC (a working NH GC).
>
> I'm writing to explore a structured 6-month research engagement between Sherpa Pros and a UNH faculty-advised student or post-doc, funded through the NH Innovation Voucher program. The research project is well-bounded: NLP parsing of NH state (RSA 155-A) and 284 NH municipal building-code overlays, with specific published deliverables on code-corpus validation and jurisdictional data modeling.
>
> Sherpa Pros maintains a production code-corpus already (192 codes, 480K entries, 284 NH municipalities). The Innovation Voucher engagement would (a) validate the NH portion rigorously against expert review, (b) produce a publicly publishable data-model specification and NLP benchmark, and (c) create a funded NH-student research opportunity with a live commercial problem.
>
> Could we schedule a 30-minute call to scope the engagement and identify a faculty advisor? I would welcome your advice on the best-fit faculty and student match. I'm happy to share the live platform, a technical overview of the corpus, and the Innovation Voucher application template in advance of the call.
>
> Thank you for your time.
>
> Phyrom
> Founder, Sherpa Pros LLC | HJD Builders LLC
> [Phone] | poum@hjd.builders

### 2.7 Budget (NH Innovation Voucher)

**Total R&D engagement cost: $30,000 over 6 months ($15,000 voucher + $15,000 Sherpa Pros match)**

| Category | Detail | Voucher | Sherpa Pros match | Total |
|---|---|---|---|---|
| UNH research assistant (graduate student, 10 hr/wk × 26 wk × $25/hr) | Direct research labor | $6,500 | $0 | $6,500 |
| UNH faculty advisor (0.05 FTE × 6 mo) | Advising | $4,500 | $0 | $4,500 |
| Corpus annotation labor (NH codes expert, ~80 hr × $40/hr) | Expert annotation | $3,200 | $0 | $3,200 |
| Cloud compute (training + inference for benchmark) | Infra | $800 | $0 | $800 |
| Phyrom PI time (in-kind, fully loaded $185/hr × 80 hr) | Founder match | $0 | $14,800 | $14,800 |
| Sherpa Pros code-corpus access + maintenance | In-kind corpus use | $0 | $200 | $200 |
| **TOTAL** | | **$15,000** | **$15,000** | **$30,000** |

### 2.8 Milestone Schedule (NH Innovation Voucher)

| Milestone | Target | Deliverable |
|---|---|---|
| UNH partner engagement letter signed | Month 1 | Engagement letter |
| Voucher award decision | Month 1–2 | Agreement |
| NH corpus validation protocol + held-out test set | Month 3 | Protocol doc |
| Preliminary results: false-negative rate | Month 4 | Technical memo |
| Final validation report + jurisdictional data model | Month 6 | Public technical report |
| NLP benchmark results | Month 6 | Benchmark paper draft |

---

## 3. PART B — NH BFA Microloan Application Draft

### 3.1 Required Documents Checklist

- [ ] NH BFA loan application form (state portal: https://nhbfa.com/ — confirm which product: CAP, Direct Lending, or 504)
- [ ] Business plan (5–10 pages — reuse MassDev summary, add NH-specific detail)
- [ ] 3-year financial projection (revenue, expenses, cash flow, loan repayment schedule)
- [ ] Most recent personal financial statement (Phyrom — net worth, liabilities, real estate)
- [ ] Most recent 2 years personal tax returns (Phyrom — federal only; NH has no state income tax)
- [ ] Sherpa Pros LLC organizational documents (operating agreement, certificate of formation)
- [ ] NH business registration
- [ ] Use-of-funds plan (working capital deployment)
- [ ] Personal guarantee acknowledgment (BFA microloans typically require personal guarantee from founder)
- [ ] Form W-9 for Sherpa Pros LLC
- [ ] References (2 banking or business references)

### 3.2 Eligibility Verification

| Criterion | Sherpa Pros status | Cite |
|---|---|---|
| NH-domiciled for-profit | Yes | — |
| Unable or difficult to secure traditional bank financing | Yes — pre-revenue early-stage | GTM spec §4.2 |
| Personal guarantee acceptable to founder | **Phyrom confirmation required** — see §3.6 | — |
| NH job creation or NH economic impact | Yes — NH Pro Success Manager role planned in Phase 1 | GTM spec §4.3 |
| Creditworthiness (basic business + personal credit review) | Phyrom credit baseline required; BFA thresholds typically 650+ personal FICO | — |

### 3.3 Loan Request

**Amount requested:** $25,000 (BFA microloan cap; exact product varies — target the Capital Access Program or Direct Lending facility depending on current BFA offerings)

**Use of funds:** Working capital — Phase 0 operating expenses. Specifically:
- Apple Developer + Google Play annual fees
- USPTO Old-House Verified trademark filing + legal
- Platform liability insurance (~$800/yr)
- Cloud infra (Vercel, Neon, Clerk, Stripe, Twilio) — 6 months
- Beta pro onboarding travel + supply-house outreach (NH + ME)
- MA foreign-LLC filing
- 1099 vs W-2 legal opinion
- Phyrom partial runway (first paid month, partial)

**Repayment term:** 36 months (3 years) — aligns with Phase 1 → Phase 2 revenue ramp per GTM spec §4

**Projected repayment cash flow:** Per GTM spec §4.4, Phase 2 exit targets $1M+ annualized GMV. At 10% standard take rate, Phase 2 net revenue is $100K/yr. A $25K microloan at BFA below-market rate (est. 6–8% APR) amortizing over 36 months is $760–$800/month — well within post-Phase-1 cash flow.

### 3.4 Narrative (Draft, ≤2 Pages)

**Summary of business.** Sherpa Pros LLC is a New Hampshire-domiciled licensed-trade marketplace platform. It matches New Hampshire, Maine, and Massachusetts homeowners to verified licensed tradespeople (electricians, plumbers, HVAC, heat-pump installers, general contractors, handymen, old-house specialists). It is built by Phyrom, a 12-year working NH general contractor, with a single-contractor dispatch model, verified license + insurance at onboarding, real-time code-aware quote validation, and a marketplace fee model (5% beta, 10% standard) that returns roughly half the effective lead-gen cost to contractors.

**The platform is already built and operational.** Web at www.thesherpapros.com, mobile via TestFlight + PWA, Stripe Connect + Neon Postgres + Clerk auth all live. Beta cohort onboarding is underway in NH Seacoast (2 HJD-network GCs, 2 handymen, 1 plumber, 1 heat-pump specialist).

**Why a BFA microloan now.** Sherpa Pros is in Phase 0 of an 18-month GTM plan (see GTM spec §4.1). Phase 0 runs parallel non-dilutive tracks (MassCEC Catalyst + InnovateMass, NSF SBIR, MA SBTA, MassDev Biz-M-Power, Wefunder Reg CF community round) but those awards and raises close in 60–120+ day cycles. A $25K BFA microloan provides **bridge working capital during Phase 0** so that critical-path items — Apple Developer, platform liability insurance, USPTO trademark, 1099 vs W-2 legal opinion, MA foreign-LLC, cloud infra, beta pro onboarding travel — are not delayed waiting on grant award cycles.

**NH job creation.** Phase 1 (months 3–6 post first-close) hires an NH/ME Pro Success Manager role (1.0 FTE) based in or serving NH. Phase 2 (months 6–12) adds a second NH/ME BD rep. The BFA microloan funds runway directly supporting these NH hire trajectories.

**Repayment plan.** Month 0–6: interest-only servicing from founder personal funds (Phyrom's HJD Builders draw). Month 6–36: full P&I servicing from Sherpa Pros platform revenue as take-rate and subscription revenue scale. Balloon eliminated; amortizing 36-month term.

**Personal guarantee.** Phyrom is prepared to personally guarantee the loan, subject to standard BFA personal-guarantee terms.

### 3.5 Submission Instructions (Both Parts)

**Part A — NH Innovation Voucher:**
- **Portal:** https://www.nheconomy.com/ → Innovation Voucher program page; confirm current application portal with NH Business and Economic Affairs.
- **Deadlines:** Rolling intake; awards decided on periodic review cycle (typically monthly or quarterly).
- **Contact:** NH Department of Business and Economic Affairs (NHBEA) program officer — find current contact at nheconomy.com.
- **Pre-submission outreach:** Recommended. Email NHBEA program officer with 1-paragraph summary + UNH partner confirmation 3 weeks before formal filing.

**Part B — NH BFA Microloan:**
- **Portal:** https://nhbfa.com/ → Business Finance Authority loan application; confirm which product (CAP, Direct Lending, 504) best fits $25K working-capital ask with BFA loan officer.
- **Deadlines:** Rolling intake.
- **Contact:** NH BFA loan officer (call BFA main line to be routed).
- **Pre-submission outreach:** Schedule a 30-minute call with an NH BFA loan officer BEFORE formal submission. The BFA underwriting process is relationship-heavy; a warm intake is meaningfully better than cold.

### 3.6 Tips & Gotchas

1. **Innovation Voucher requires the NH research-partner engagement letter upfront.** Don't submit the voucher application without UNH (or Dartmouth) having agreed in writing to the engagement. The engagement letter is the gating document.
2. **BFA microloan typically requires personal guarantee from founder.** Phyrom should confirm comfort with this. Alternative: see if BFA has a no-PG product (rare but possible).
3. **BFA interest rate is below market but not zero.** Budget ~6–8% APR range. Run repayment cash flow carefully against Phase 1 → Phase 2 revenue.
4. **Phyrom's personal credit score matters for BFA.** Pull personal credit report before BFA call. Address any issues if possible before formal application.
5. **Innovation Voucher is a 50% match — make sure the Sherpa Pros contribution is documentable.** Founder in-kind time at fully loaded rate is typically acceptable; document the rate basis.
6. **Avoid "Wiseman" externally** — call the research engagement "building-code NLP research" or "code-corpus validation research" (per Sherpa Pros brand bible / GTM spec §3.3).
7. **The BFA microloan is the simplest approval in this packet for a relationship-ready founder.** The NH BFA prides itself on approving NH-native small businesses. Phyrom's HJD Builders + Sherpa Pros + local NH-resident status is exactly the profile the program was designed for. Don't over-engineer the application.
8. **NH Innovation Voucher and BFA microloan DO NOT conflict.** Apply for both in parallel.
9. **Both programs are NH-native — Phyrom's NH-resident + NH-operating footprint is the thing.** Lead every conversation with the 12-year NH GC background and the HJD Builders parent. That's the relationship that unlocks both doors.

### 3.7 Eligibility Blocker — Phyrom Confirmation Required

Three items:

1. **UNH (or Dartmouth) research-partner engagement letter** — required for Innovation Voucher. Send the §2.6 outreach email within 30 days. If UNH scheduling doesn't work, switch to Dartmouth.

2. **Personal guarantee acceptance** — required for BFA microloan (in most cases). Phyrom should confirm comfort with this before scheduling the BFA intake call.

3. **Personal credit report pull** — Phyrom should pull his personal credit report before the BFA call. Most BFA microloans require 650+ FICO; address any issues if possible.

---

**End of draft. Phyrom: send the UNH outreach email (§2.6) and schedule the NH BFA loan-officer intake call within 30 days. Stack both applications in parallel.**
