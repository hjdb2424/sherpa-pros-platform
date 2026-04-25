# NSF SBIR Phase I — Sherpa Pros Application Draft

**Program:** National Science Foundation Small Business Innovation Research (SBIR) Phase I — America's Seed Fund
**Award size:** Up to $305,000 (Phase I); Phase II up to $1.5M follow-on
**Sponsor URL:** https://seedfund.nsf.gov/
**Applicant:** Sherpa Pros LLC (Phyrom, Founder)
**Draft date:** 2026-04-22
**Status:** DRAFT — Project Pitch first (≤3 pages, rolling), full proposal if invited (15-page structure included)

---

## 1. Program at a Glance

The NSF SBIR program funds high-risk, high-impact deep-tech R&D at US small businesses. The two-stage gating model is **Project Pitch first** (≤3 pages, free, rolling submission, ~30-day NSF feedback) — and only if invited does the company file the full proposal. This is structurally favorable for Sherpa Pros: the Project Pitch is a low-effort screen that either confirms NSF interest in the AI/ML research commercialization angle or returns clear "not a fit" feedback in weeks.

**Why Sherpa Pros qualifies for NSF SBIR (and NOT for general "small business marketplace" funding):**

The eligible NSF SBIR research thread is the **code-aware quote-validation engine** — specifically, the NLP/ML problem of mapping unstructured contractor quote text and homeowner job descriptions onto structured building-code requirements (NEC, IRC, MA Electrical Code, NH RSA) and program-eligibility rules (Mass Save, IRA § 25C/25D, utility programs) in real time, at scale, with explainable validation outputs. This is **deep tech**, not a marketplace UI play. NSF reviewers fund research, not GTM.

**Wiseman is the internal name for the code-aware engine; this proposal calls it the "code-aware quote-validation system" or "platform code intelligence" externally** (per Sherpa Pros brand bible / GTM spec §3.3).

---

## 2. Required Documents Checklist

### Stage 1 — Project Pitch (≤3 pages)
- [ ] Project Pitch document (3 pages max — see §5)
- [ ] Company information (legal name, EIN, DUNS, SAM.gov registration)
- [ ] Founder bio + technical lead bio (Phyrom)
- [ ] No budget required at Project Pitch stage

### Stage 2 — Full Proposal (only if invited; 15-page Project Description max)
- [ ] Project Summary (1 page)
- [ ] Project Description (15 pages max — Intellectual Merit, Broader Impacts, R&D Plan, Commercialization Plan)
- [ ] References Cited
- [ ] Biographical Sketches (PI + Co-PIs)
- [ ] Budget (NSF-approved categories)
- [ ] Budget Justification
- [ ] Current and Pending Support
- [ ] Facilities, Equipment, and Other Resources
- [ ] Letters of Support (commercial validation; recommended: Mass Save HPIN contractor + property-management firm + utility CVC informal letter)
- [ ] Commercialization Plan (separate; explicit market path post-Phase I)
- [ ] Data Management Plan
- [ ] Postdoctoral Researcher Mentoring Plan (if applicable — likely N/A)
- [ ] Letters of Commitment for any subawardees or consultants

### Pre-submission registrations (do these immediately — they take time)
- [ ] SAM.gov entity registration (active and current — **2–4 weeks first time**, must be done before Project Pitch acceptance)
- [ ] NSF Research.gov account for Phyrom as PI
- [ ] DUNS / UEI number assigned to Sherpa Pros LLC

---

## 3. Eligibility Verification

| Criterion | Sherpa Pros status | Cite |
|---|---|---|
| US small business (≤500 employees, >50% US-owned) | Yes — 1 founder | NSF SBIR rules |
| For-profit | Yes — Sherpa Pros LLC | — |
| US-based research | Yes — code-corpus + R&D in NH/MA | GTM spec §1 |
| PI (Phyrom) employed by company ≥51% time | Yes — Phyrom is full-time founder | GTM spec §7 |
| Project is research-based (not just product development) | Yes — AI/ML for code mapping + program eligibility inference is genuine research; explainability of code-validation outputs is an open problem | This document §5 |
| SAM.gov registration active | **Action item — register if not done.** 2–4 weeks lead time. | sam.gov |
| NSF Research.gov PI account | **Action item** | research.gov |

**Verdict:** Eligible. Register SAM.gov and Research.gov **immediately** — these are the long-lead items that gate everything.

---

## 4. Project Title

**"Code-Aware Quote Validation: Real-Time NLP/ML Mapping of Contractor Estimates to Multi-Jurisdictional Building Codes and Program-Eligibility Rules for Residential Construction"**

---

## 5. STAGE 1 — Project Pitch (≤3 Pages, Draft)

> *NSF Project Pitch format: ≤3 pages total. Standard sections: Technology Innovation, Technical Objectives & Challenges, Market Opportunity, Company & Team. Submit at https://seedfund.nsf.gov/project-pitch/.*

### 5.1 Technology Innovation (≈1 page)

Residential construction in the United States is governed by a tangled, jurisdiction-specific web of building codes (National Electrical Code, International Residential Code, state-specific overlays such as Massachusetts Electrical Code 527 CMR 12.00 and New Hampshire RSA 155-A) and incentive program rules (Mass Save, IRA § 25C/25D, Eversource/National Grid utility programs, and 50+ state-level rebate programs). A single residential project — a heat-pump install, an electrical panel upgrade, an EV-charger install — can span 3–6 of these regulatory frames simultaneously.

Today, contractors author quotes manually in unstructured text (PDFs, spreadsheets, emails); homeowners receive them; neither party has any tractable way to validate that the quoted scope is code-compliant, that the quoted materials meet program-eligibility rules, or that all available rebates are stacked. The result: estimated 40%+ of residential heat-pump quotes in MA fail first-pass program eligibility check at the rebate-paperwork stage [MA EEAC 2025 contractor survey, citation pending verification — but consistent with field-reported rework rates].

**Sherpa Pros' proposed innovation:** A real-time NLP/ML system that ingests an unstructured contractor quote and an unstructured homeowner job description, parses both onto a structured intermediate representation, and validates them against (a) jurisdiction-specific building-code rule libraries, (b) federal and state incentive program eligibility rules, and (c) permit-requirement matrices — producing an **explainable validation output** (specific code citation, specific rule, specific gap) that both contractor and homeowner can act on.

This is not a static rule engine. It requires:
1. **Code corpus parsing** at scale (192 codes, 480K entries currently cataloged across NEC + IRC + state + 284 NH municipal jurisdictions — work to date is foundational; SBIR funds the MA + ME + RI + CT extension and the federal incentive layer)
2. **NLP entity extraction** from contractor quotes that frequently lack structure (line-item descriptions, materials specs, labor categories)
3. **ML-driven rule-applicability inference** — given a job's location, scope, and existing conditions, which subset of the corpus applies? (open research problem at the intersection of legal NLP and construction informatics)
4. **Explainability layer** — the output must cite specific code subsections in plain language so both contractor and homeowner can verify and learn (open research problem in explainable NLP)

### 5.2 Technical Objectives & Challenges (≈1 page)

**Phase I R&D objectives (12 months, $305K):**

1. **Object 1 — Multi-jurisdiction code corpus pipeline.** Extend the cataloged code corpus to cover MA Electrical Code (527 CMR 12.00), MA State Building Code (780 CMR), Mass Save program rules, Eversource and National Grid utility-program rules, IRA § 25C/25D, and at least 50 MA municipal overlays. Validate corpus completeness against a held-out test set of 100 historical MA quotes.

2. **Object 2 — Quote-to-structured-IR NLP pipeline.** Build a quote-parsing pipeline that ingests unstructured contractor quotes (PDF, image-OCR, plaintext) and outputs a structured intermediate representation (line items, quantities, materials specs, labor categories, jurisdiction tags). Target: F1 ≥ 0.85 on entity extraction against human-annotated test set.

3. **Object 3 — Rule-applicability inference engine.** Given a structured job representation, infer the applicable rule subset from the corpus. Use retrieval-augmented generation (RAG) with embedded code subsections + LLM reasoning over jurisdictional precedence (federal → state → municipal). Target: precision ≥ 0.90 / recall ≥ 0.80 on rule-applicability against expert-annotated test cases.

4. **Object 4 — Explainable validation output.** Produce contractor-facing and homeowner-facing validation reports that cite specific code subsections, specific rule violations, specific missing program-eligibility line items, in plain 8th-grade-reading-level English with the underlying code citation as a clickable footnote. Target: 80%+ contractor + homeowner satisfaction with explainability (NPS-style measurement on a 5-point scale).

**Technical challenges:**

- **Legal NLP at the intersection of code corpora and construction informatics is an under-researched domain.** Academic NLP work on legal-text retrieval is mostly contracts and litigation; building codes have specific structural properties (cross-references, jurisdictional overrides, version drift) that require new approaches.
- **Hallucination control in incentive-program rule application is high-stakes** — incorrectly stacking a rebate that is not actually claimable creates real financial exposure for the homeowner. Phase I will design and validate hallucination-reduction techniques specific to this domain (code-grounded RAG with citation enforcement; refusal-to-answer when confidence is below threshold).
- **Real-time latency at the dispatch step.** A homeowner-facing quote review must validate in under 3 seconds end-to-end. This is non-trivial for retrieval over a 480K-entry-and-growing corpus with multi-jurisdictional rule chaining.

### 5.3 Market Opportunity (≈0.5 page)

US residential remodeling + repair = **$524B/year** (Harvard JCHS LIRA 2025) [tam-sam-som §2.1]. Even capturing 1 basis point (0.01%) of TAM = $52M GMV. New England 6-state residential SAM = ~$17–23B/year [tam-sam-som §3.1]. Boston metro alone produces 10,000–14,000 small-residential building permits per year (Boston ISD Open Data).

Sherpa Pros' commercialization vehicle is the operational marketplace — www.thesherpapros.com, live, built on Next.js 16 + Stripe Connect + Neon Postgres + PostGIS — at a 5%–10% take rate vs. lead-gen platforms' effective $400–$800 per closed job. **The code-aware quote-validation system is the moat that makes the marketplace defensible.** Without it, Sherpa Pros is a thinner competitor to Angi. With it, Sherpa Pros plants a flag in the empty "licensed + code-aware + true marketplace" quadrant (per competitive analysis matrix).

### 5.4 Company & Team (≈0.5 page)

**Sherpa Pros LLC** is a Delaware/NH-domiciled small business; founder and PI Phyrom is a 12+ year working New Hampshire general contractor and the founder of HJD Builders LLC. The platform is built and operational. Phyrom holds the dual position of (a) the operator who knows the code-validation problem from the contractor side daily, and (b) the technical founder who has architected and shipped the live platform. Phase I funding hires a senior ML engineer + part-time NLP research consultant for the 12-month R&D program.

---

## 6. STAGE 2 — Full Proposal Outline (15 Pages, If Invited)

> *Use only if NSF invites the full proposal after Project Pitch acceptance. The 15-page Project Description is the central artifact; supporting documents are uploaded separately. Below is the section-by-section outline Phyrom should fill in over 4–6 weeks of writing.*

### 6.1 Project Summary (1 page, separate from 15-page limit)

- **Overview:** 1 paragraph — the code-aware quote-validation problem and the proposed innovation.
- **Intellectual Merit:** 1 paragraph — the NLP/ML research contributions (legal-text retrieval over building codes; explainable rule-applicability inference; hallucination control in incentive-program reasoning).
- **Broader Impacts:** 1 paragraph — accelerated MA decarbonization (Mass Save HP throughput); reduced consumer harm from lead-gen-platform deposit theft; defensive moat for licensed-trade workers vs. lead-gen platforms.

### 6.2 Project Description (15 pages max, NSF order)

**Section 1 — Significance and Innovation (≈3 pages)**
- The labor-shortage / decarbonization-rebate / AI-now convergence (per investor deck slide 3 + GTM spec §2.1)
- The empty quadrant: licensed + code-aware + marketplace (competitive analysis §1)
- Why now (NLP/RAG state of the art is 2025-mature; codes are increasingly digitized; rebate programs are at peak funding)
- Why this team (founder = working GC who lived the problem)

**Section 2 — Technical Discussion and R&D Plan (≈7 pages)**
- 2.1 Overview of the four research objectives (per Project Pitch §5.2)
- 2.2 Object 1 detailed plan — corpus pipeline, jurisdictional overlay handling, version-drift management, validation methodology
- 2.3 Object 2 detailed plan — quote-parsing NLP architecture, training data strategy (synthesize from HJD historical quotes + crowdsource via beta cohort), evaluation framework
- 2.4 Object 3 detailed plan — RAG architecture with code-citation enforcement, jurisdictional-precedence resolution, evaluation against expert-annotated test cases
- 2.5 Object 4 detailed plan — explainability layer, plain-language generation with citation backing, user-study validation (n=30 contractor + n=30 homeowner)
- 2.6 Risks and mitigations table

**Section 3 — Commercialization Plan (≈3 pages — or move to separate doc per NSF format)**
- Live operational marketplace (www.thesherpapros.com) is the commercialization vehicle
- 5%–10% take rate, $49/mo subscription, $4–$1.50/unit PM tier
- Phase 1 → 2 → 3 → 4 GTM trajectory (per GTM spec §4)
- Customer pipeline: HJD Builders network (founding pros), Mass Save Network application, NHHBA + MEHBA, Boston supply-house partnerships
- Competitive moat (per competitive analysis §6 defensibility)
- Anticipated Phase II R&D (Wiseman federation across all 50 states; insurance-claim integration; PM CapEx/OpEx integration; offline mobile inference)

**Section 4 — Company and Team (≈1 page)**
- Phyrom bio + 12 years GC + technical lead role
- Phase I hires (Senior ML Engineer + part-time NLP consultant)
- Advisor pipeline (NFX-shaped marketplace operator; NE trades veteran; construction tech VC partner)

**Section 5 — Facilities, Equipment, and Other Resources (≈1 page)**
- Cloud infra (Vercel, Neon, AWS for ML training)
- Code corpus (192 codes, 480K entries already assembled)
- Beta cohort access (real-world quote data with consent)
- HJD Builders historical quote archive (training data)

### 6.3 References Cited (separate, no page limit)
- NSF SBIR review pays attention to references. Cite legal-NLP, RAG, explainable-AI, construction-informatics, building-code-research, and marketplace-economics literature.

### 6.4 Budget (Separate Excel Workbook)

**Phase I total: $305,000 over 12 months (NSF SBIR Phase I cap is $305,000 — confirm current cap with NSF program officer; historically has stepped from $275K → $305K in recent years).**

| Category | Detail | Phase I ask |
|---|---|---|
| **Senior Personnel** | Phyrom (PI, 50% effort × 12 mo) | $90,000 |
| **Other Personnel** | Senior ML/NLP Engineer (1.0 FTE × 12 mo loaded $130K/yr) | $130,000 |
| | Part-time NLP research consultant (200 hr × $200/hr) | $40,000 |
| **Fringe Benefits** | 22% on personnel | (rolled into loaded rates above) |
| **Equipment** | (None — cloud-based) | $0 |
| **Travel** | NSF program officer site visit + NeurIPS or ACL travel + MA pro recruitment | $5,000 |
| **Other Direct Costs** | Cloud compute (training + inference) | $10,000 |
| | Annotation labor (code-corpus expert annotators, ~400 hr × $40/hr) | $16,000 |
| | NSF participant compensation (user studies, n=60 × $50) | $3,000 |
| **Subawards** | (None planned at Phase I) | $0 |
| **Indirect Costs** | NSF Phase I de minimis 10% | $11,000 |
| **TOTAL** | | **$305,000** |

### 6.5 Data Management Plan
- Code corpus: NSF-aligned open-access publication of derived rule-applicability test sets (anonymized) at end of Phase I
- Quote training data: anonymized + consented; not openly published; available to NSF reviewers under NDA on request
- Model weights: proprietary; not openly published

---

## 7. Milestone Schedule (Phase I, 12 months)

| Milestone | Target | Success criterion | Deliverable |
|---|---|---|---|
| SAM.gov + Research.gov registrations active | Pre-submission | Active | Registration confirmation |
| Project Pitch submitted | Month 0 | Acknowledged | Pitch acceptance/rejection email |
| Project Pitch invited; full proposal submission | Month 2 | If invited | Full 15-page proposal |
| Award decision | Month 6 (typical NSF cycle) | Award signed | Grant agreement |
| Object 1 — MA + NE corpus complete | Month 9 (3 mo post-award) | Corpus passes 100-quote held-out validation | Internal validation report |
| Object 2 — quote-parsing NLP F1 ≥ 0.85 | Month 12 | Held-out test set | Technical report |
| Object 3 — rule-applicability precision ≥ 0.90 / recall ≥ 0.80 | Month 15 | Expert-annotated test cases | Technical report |
| Object 4 — explainability satisfaction ≥ 80% | Month 17 | n=60 user study | Technical report + user-study findings |
| Phase I final report + Phase II proposal submission | Month 18 | NSF Phase I final report submitted; Phase II proposal in flight | Final report + Phase II application |

---

## 8. Submission Instructions

- **Project Pitch portal:** https://seedfund.nsf.gov/project-pitch/ — rolling submission (no deadline)
- **Project Pitch turnaround:** NSF aims for 30 days to invite/decline; in practice 4–8 weeks
- **Full proposal portal:** Research.gov (PI account required)
- **Full proposal deadlines:** NSF SBIR Phase I has approximately 2 windows per year (typically March and September). Invited proposals must be submitted at the next applicable window.
- **Contact:** NSF SBIR Program Director assigned by topic area at Project Pitch acceptance; for general inquiries: sbir@nsf.gov
- **Pre-submission outreach:** Encouraged. Email a 1-paragraph proposal summary to sbir@nsf.gov asking for the Program Director assignment for the relevant topic. Build relationship before Project Pitch.

---

## 9. Tips & Gotchas

1. **SAM.gov registration is the gating long-lead item.** First-time registration takes 2–4 weeks. Start immediately. Without it, NSF cannot disburse funds even if awarded.
2. **The Project Pitch is your screen.** Don't bury the research-novelty claim. NSF funds research, not GTM. Lead the Project Pitch with the legal-NLP-over-codes innovation and the explainable-AI hallucination-control problem. Save the marketplace TAM for the Commercialization Plan.
3. **NSF SBIR is research-grade. The full proposal must read like a research proposal**, not a startup deck. Cite academic literature. Define test sets and evaluation metrics. Discuss prior art honestly.
4. **Commercial validation matters in Phase I.** Letters of support from a Mass Save HPIN contractor, a property-management firm, and (informally) a utility CVC strengthen the Commercialization Plan.
5. **Phase II eligibility flows from Phase I performance.** A clean Phase I final report unlocks the $1.5M Phase II application — which is the real prize. Treat Phase I as the on-ramp.
6. **Phase I cap has stepped up over time.** Confirm current cap with NSF program officer before locking budget. Recent years: $275K → $305K.
7. **NSF accepts modular proposals where parts of the work are subcontracted to academic labs.** If an NLP lab at MIT or Northeastern wants to collaborate, that's a positive signal. Phyrom should explore this in Phase I planning.
8. **Avoid "Wiseman" externally** — call it "code-aware quote validation system" or "platform code intelligence" (per Sherpa Pros brand bible / GTM spec §3.3). This is a hard rule even in a research proposal.
9. **MA START Grant stacks with NSF SBIR** ($100K → $500K R3 per GTM spec §6.1). Plan to file MA START immediately upon NSF Phase I award notification.

---

## 10. Eligibility Blocker — Phyrom Confirmation Required

**SAM.gov registration must be active before submission can convert to award.** Confirm registration status at sam.gov; if not registered, initiate immediately (2–4 weeks first time).

**Research.gov PI account for Phyrom** must be created before full proposal submission. ~1 hour to set up; do this in week 1.

Beyond the registration items, the only structural question is whether Phyrom is comfortable framing the code-aware engine as primarily R&D (rather than as production software). The NSF reviewer wants to see open research problems and proposed methods, not a polished product. The framing in §5 above leans into the research angle while acknowledging the live-platform commercialization vehicle. **Phyrom should review §5 carefully and confirm comfort with the research-first framing before submission.**

---

**End of draft. Phyrom: register SAM.gov today, confirm research-first framing, and submit Project Pitch within 30 days. Full proposal effort begins only if invited.**
