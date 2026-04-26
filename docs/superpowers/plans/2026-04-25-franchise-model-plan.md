# Sherpa Pros Franchise Model — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a fully-compliant Franchise Disclosure Document (FDD), the regulatory infrastructure to sell franchises in launch states, the operational infrastructure to support the first cohort of Phase 4 franchisees, and the international-readiness foundation to add Master Franchisees in Phase 5.

**Phase:** Phase 3 (franchise design begins) through Phase 4 Year 1 (first 3–5 sold franchises).

**Architecture:** Six parallel work streams executed concurrently. Critical-path dependencies: WS1 (FDD development) gates WS2 (state registration) and WS3 (pilot franchisee selection). WS4 (training program) and WS5 (operations support infrastructure) run in parallel with WS1–WS3. WS6 (international master-franchise readiness) runs in parallel as a Phase 5 prep stream. Weekly review cadence with Phyrom + Vice President of Franchise Development.

**Source spec:** `docs/superpowers/specs/2026-04-25-franchise-model-design.md`

**Companion specs (parallel work streams):**
- `docs/superpowers/specs/2026-04-25-international-expansion-design.md`
- `docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md`
- `docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md`

**Owners:**
- **P** = Phyrom (founder, Chief Executive Officer; final approval on all FDD content + franchisee selection)
- **VPFD** = Vice President of Franchise Development (Phase 4 Year 1 hire; lead owner of WS1 + WS3)
- **VPOPS** = Vice President of Operations (lead owner of WS4 + WS5)
- **CFO** = Chief Financial Officer (owner of audit firm engagement, Item 19 substantiation)
- **LEGAL** = Outside Franchise Attorney (lead drafter of FDD per WS1 Task 1)
- **AUDIT** = Outside CPA Firm (Item 21 audited financials)
- **AI** = Claude sub-agent dispatch (parallelized for research, document drafting, comparison analysis)

---

## Work Stream 1 — FDD Development (Lead: VPFD + LEGAL + CFO)

**Goal:** Deliver an FTC-compliant FDD Version 1.0 ready for state registration filings and franchisee delivery.

### Task WS1-1: Engage franchise attorney

**Owner:** P + VPFD
**Files:**
- Create: `docs/franchise/attorney-engagement/2026-04-25-franchise-attorney-rfp.md` (Request for Proposal)
- Create: `docs/franchise/attorney-engagement/2026-04-25-franchise-attorney-shortlist.md`
- Create: `docs/franchise/attorney-engagement/2026-04-25-franchise-attorney-engagement-letter-signed.pdf` (placeholder for signed scan)

- [ ] **Step 1:** Draft Franchise Attorney Request for Proposal scoping FDD Version 1.0 development, state registrations in 14 registration states + 4 business-opportunity states, ongoing FDD annual update, FAC charter drafting, franchise relationship law compliance review.
- [ ] **Step 2:** Send RFP to four candidate firms — Spadea Lanard & Lignana, DLA Piper Franchise Group, Faegre Drinker Biddle & Reath, Lathrop GPM.
- [ ] **Step 3:** Schedule 60-minute scoping call with each firm. Score on: franchise depth, marketplace-platform comparable experience, fee structure, response time, named partner availability.
- [ ] **Step 4:** Select preferred firm, negotiate engagement letter (capped fee structure preferred; estimated $80K–$120K for FDD Version 1.0).

**Deliverable:** Signed engagement letter on file.
**Acceptance:** Firm formally engaged with kick-off scheduled.
**Dependencies:** None (start immediately).

---

### Task WS1-2: Engage audit firm

**Owner:** CFO + P
**Files:**
- Create: `docs/franchise/audit-engagement/2026-04-25-audit-firm-rfp.md`
- Create: `docs/franchise/audit-engagement/2026-04-25-audit-firm-engagement-letter-signed.pdf`

- [ ] **Step 1:** Draft Audit Firm Request for Proposal scoping audited financial statements for Sherpa Pros LLC for Fiscal Years 2025 + 2026 + 2027 (and ongoing annual audit).
- [ ] **Step 2:** Send RFP to four candidate firms — Marcum, BDO USA, RSM US, Aprio.
- [ ] **Step 3:** Score on: franchise audit experience, fee structure, geographic location (Boston-based preferred), partner accessibility.
- [ ] **Step 4:** Select preferred firm; negotiate engagement letter (estimated $20K–$30K per fiscal year).

**Deliverable:** Signed engagement letter.
**Acceptance:** Firm engaged; first-year audit kick-off scheduled.
**Dependencies:** Sherpa Pros LLC must have organized books for the fiscal year being audited.

---

### Task WS1-3: Compile Item 1 (Franchisor + Affiliates) draft

**Owner:** VPFD + P
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-01-franchisor-affiliates-draft.md`

- [ ] **Step 1:** Document Sherpa Pros LLC formation, state of incorporation, principal office address, federal Employer Identification Number (EIN), business activity.
- [ ] **Step 2:** Document HJD Builders LLC affiliate relationship and disclose explanation of why founder's working contracting business is a competitive advantage rather than a conflict.
- [ ] **Step 3:** Disclose any other affiliated entities (real estate holding, intellectual property holding) if applicable.
- [ ] **Step 4:** Send draft to LEGAL for FTC-compliance review.

**Deliverable:** Item 1 first draft.
**Acceptance:** LEGAL accepts draft as ready for FDD compilation.
**Dependencies:** WS1-1.

---

### Task WS1-4: Compile Item 2 (Business Experience) draft

**Owner:** VPFD + P
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-02-business-experience-draft.md`

- [ ] **Step 1:** Phyrom drafts five-year work-history biography (must be complete and accurate including surname; this is a public document at FDD delivery).
- [ ] **Step 2:** Each Phase 4 executive hire (VPOPS, CFO, VPFD, Chief Marketing Officer) drafts five-year work-history biography upon hire.
- [ ] **Step 3:** Each named officer signs disclosure that no material franchise-industry violation, securities violation, fraud claim, criminal conviction, or bankruptcy occurred in the last 10 years.
- [ ] **Step 4:** Send draft to LEGAL.

**Deliverable:** Item 2 first draft with all then-current officer biographies.
**Acceptance:** LEGAL accepts.
**Dependencies:** WS1-1; ongoing as new executives hired.

---

### Task WS1-5: Compile Item 3 (Litigation) draft

**Owner:** P + LEGAL
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-03-litigation-draft.md`

- [ ] **Step 1:** P discloses every pending or concluded litigation matter involving Sherpa Pros LLC, HJD Builders LLC, and every named officer for the past 10 years.
- [ ] **Step 2:** LEGAL applies materiality test (FTC threshold + state-by-state thresholds) and produces final disclosure language.
- [ ] **Step 3:** If any HJD Builders contracting-business matter exceeds materiality, draft disclosure language with explanation of why the matter does not affect franchise viability.

**Deliverable:** Item 3 first draft.
**Acceptance:** LEGAL accepts.
**Dependencies:** WS1-1.

---

### Task WS1-6: Compile Item 4 (Bankruptcy) draft

**Owner:** P + LEGAL
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-04-bankruptcy-draft.md`

- [ ] **Step 1:** Each named officer + Sherpa Pros LLC + HJD Builders LLC discloses any bankruptcy filing in the last 10 years (target: zero).
- [ ] **Step 2:** LEGAL produces final disclosure (likely "None" if target met).

**Deliverable:** Item 4 first draft.
**Acceptance:** LEGAL accepts.
**Dependencies:** WS1-1.

---

### Task WS1-7: Compile Items 5 + 6 (Initial Fees + Other Fees) draft

**Owner:** CFO + VPFD + LEGAL
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-05-initial-fees-draft.md`
- Create: `docs/franchise/fdd-drafts/Item-06-other-fees-draft.md`

- [ ] **Step 1:** Confirm fee schedule from §4 of source spec ($45K single Hub / $125K Area Development / $300K Metro Master / $25K Pro Network) and verify CFO acceptance of unit economics.
- [ ] **Step 2:** Compile Item 6 fee table (royalty, marketing fund, technology fee, renewal, transfer, audit, training-additional, convention, local marketing minimum).
- [ ] **Step 3:** LEGAL applies state-specific fee disclosure formatting (some states require additional fee categorization).

**Deliverable:** Item 5 + Item 6 drafts.
**Acceptance:** LEGAL + CFO approve.
**Dependencies:** WS1-1.

---

### Task WS1-8: Compile Item 7 (Estimated Initial Investment) draft

**Owner:** CFO + VPOPS + VPFD
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-07-initial-investment-draft.md`
- Create: `docs/franchise/item-07-substantiation/2026-04-25-hub1-build-cost-actuals.md` (Hub #1 actual buildout costs as substantiation)

- [ ] **Step 1:** Compile actual Hub #1 (Atkinson NH) buildout cost detail by line item.
- [ ] **Step 2:** Survey 3 commercial real estate brokers in Phase 4 launch markets (NH/ME/MA/VT) for current per-square-foot lease rates.
- [ ] **Step 3:** Compile equipment vendor quotes (Point of Sale, computers, security, signage, racking).
- [ ] **Step 4:** Compile initial inventory cost estimate from Sherpa Materials catalog.
- [ ] **Step 5:** Build low-end and high-end Item 7 table; verify totals match $185K–$420K range from source spec.
- [ ] **Step 6:** Send to LEGAL with Hub #1 substantiation file.

**Deliverable:** Item 7 first draft + substantiation file.
**Acceptance:** LEGAL + CFO approve; substantiation file is auditable.
**Dependencies:** WS1-1; Hub #1 must have completed buildout.

---

### Task WS1-9: Compile Item 8 (Sources of Products and Services) draft

**Owner:** VPOPS + LEGAL
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-08-sources-of-products-draft.md`

- [ ] **Step 1:** Document required-source list (Sherpa Materials orchestration for kit inventory; FW Webb partnership; Wurth Louis and Company; Best Tile; Walzcraft; Eagle drawers; Richelieu hardware; Hafele cabinet hardware; Rubio Monocoat; corporate-approved branded gear vendor).
- [ ] **Step 2:** Disclose franchisor rebate income from approved suppliers (estimated 2–4 percent of franchisee inventory purchases).
- [ ] **Step 3:** LEGAL refines disclosure language to comply with FTC Item 8 requirements.

**Deliverable:** Item 8 first draft.
**Acceptance:** LEGAL accepts.
**Dependencies:** WS1-1; corporate supplier accounts must be in place.

---

### Task WS1-10: Compile Item 11 (Franchisor's Assistance, Advertising, Computer Systems, Training) draft

**Owner:** VPOPS + VPFD + LEGAL
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-11-franchisor-assistance-draft.md`

- [ ] **Step 1:** Document pre-opening assistance, opening assistance, ongoing assistance, computer systems list, training program syllabus (cross-reference WS4 task series).
- [ ] **Step 2:** Specify training-program contact-hour totals (80-hour initial + 40-hour on-site + 32-hour annual continuing education + 24-hour Annual Summit).
- [ ] **Step 3:** Disclose required hardware list and corporate-licensed software list.
- [ ] **Step 4:** LEGAL finalizes language.

**Deliverable:** Item 11 first draft.
**Acceptance:** LEGAL + VPOPS approve.
**Dependencies:** WS1-1; WS4-1 (training curriculum design must be far enough along to specify contact hours).

---

### Task WS1-11: Compile Item 12 (Territory) draft

**Owner:** VPFD + LEGAL
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-12-territory-draft.md`

- [ ] **Step 1:** Document protected radius rules (5/15/30-mile by metro/suburban/rural per United States Census Bureau density tier).
- [ ] **Step 2:** Document Right of First Refusal language.
- [ ] **Step 3:** Document overlap zone rules (corporate retains digital product rights; per-pro engagement royalty allocation).
- [ ] **Step 4:** LEGAL refines language to avoid territory-dispute litigation risk (the most common franchise litigation category).

**Deliverable:** Item 12 first draft.
**Acceptance:** LEGAL accepts.
**Dependencies:** WS1-1.

---

### Task WS1-12: Compile Item 13 + 14 (Trademarks + Proprietary Information) drafts

**Owner:** LEGAL + P
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-13-trademarks-draft.md`
- Create: `docs/franchise/fdd-drafts/Item-14-proprietary-info-draft.md`

- [ ] **Step 1:** File or update USPTO trademark applications for: "Sherpa Pros," "Sherpa Hub," Sherpa Pros logo, "Old-House Verified," "Sherpa Marketplace," "Sherpa Home," "Sherpa Success Manager," "Sherpa Rewards," "Sherpa Flex," "Sherpa Threads," "Sherpa Smart Scan," "Sherpa Mobile," "Sherpa Guard," "Sherpa Dispatch," "Sherpa Materials."
- [ ] **Step 2:** Document trade-secret assets — codes engine, Materials engine, Dispatch matching algorithm, Sherpa Score algorithm — without disclosing the trade secret itself (the disclosure references the existence and importance, not the implementation).
- [ ] **Step 3:** File patent applications for matching algorithm + materials orchestration (started Phase 3; updated per Phase 4 Year 1).
- [ ] **Step 4:** LEGAL drafts Items 13 + 14.

**Deliverable:** Items 13 + 14 first drafts.
**Acceptance:** LEGAL accepts.
**Dependencies:** WS1-1; USPTO filings ongoing.

---

### Task WS1-13: Compile Items 15–18 drafts

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-15-operation-obligation-draft.md`
- Create: `docs/franchise/fdd-drafts/Item-16-restrictions-on-sales-draft.md`
- Create: `docs/franchise/fdd-drafts/Item-17-renewal-termination-transfer-draft.md`
- Create: `docs/franchise/fdd-drafts/Item-18-public-figures-draft.md`

- [ ] **Step 1:** Item 15 — full-time on-site operation obligation language (no absentee owners in Phase 4 Years 1–3).
- [ ] **Step 2:** Item 16 — restrictions on what franchisee may sell + non-compete language.
- [ ] **Step 3:** Item 17 — renewal, termination, transfer, dispute resolution language. State-by-state addenda for franchise relationship law states (NJ, CA, MN, etc.).
- [ ] **Step 4:** Item 18 — public figures (likely "None" for Version 1.0).

**Deliverable:** Items 15–18 first drafts.
**Acceptance:** LEGAL accepts.
**Dependencies:** WS1-1.

---

### Task WS1-14: Compile Item 19 (Financial Performance Representations) draft

**Owner:** CFO + LEGAL + VPFD
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-19-financial-performance-draft.md`
- Create: `docs/franchise/item-19-substantiation/2026-04-25-hub1-financials-Y1.md`
- Create: `docs/franchise/item-19-substantiation/2026-04-25-hub1-financials-Y2.md` (when available)

- [ ] **Step 1:** Compile Hub #1 (Atkinson NH) actual operating financials by month (revenue, COGS, OpEx, EBITDA).
- [ ] **Step 2:** Map Hub #1 actuals to Item 19 disclosure tables (Year 1 ramp, Year 2 maturity).
- [ ] **Step 3:** Document substantiation methodology (single-Hub corporate reference + comparable-franchise industry data for Years 2 + 3).
- [ ] **Step 4:** LEGAL drafts Item 19 with required FTC caveats (forward-looking statements language, no-guarantee language, individual results disclaimer).
- [ ] **Step 5:** Independent franchise counsel second-opinion review (this is the highest-litigation-risk Item).

**Deliverable:** Item 19 first draft + substantiation files.
**Acceptance:** LEGAL + independent franchise counsel both approve.
**Dependencies:** WS1-1; Hub #1 must have at least 12 months of operating data.

---

### Task WS1-15: Compile Items 20–23 drafts

**Owner:** LEGAL + VPFD + CFO
**Files:**
- Create: `docs/franchise/fdd-drafts/Item-20-outlets-info-draft.md`
- Create: `docs/franchise/fdd-drafts/Item-21-financial-statements-draft.md`
- Create: `docs/franchise/fdd-drafts/Item-22-contracts-draft.md` (with sample Franchise Agreement, Area Development Agreement, etc., as exhibits)
- Create: `docs/franchise/fdd-drafts/Item-23-receipts-draft.md`

- [ ] **Step 1:** Item 20 — current franchise outlet count + projected openings + transfer/termination/non-renewal/reacquisition tables (likely sparse for Year 1; will populate over time).
- [ ] **Step 2:** Item 21 — attach audited financial statements from WS1-2.
- [ ] **Step 3:** Item 22 — attach sample contracts (Sherpa Hub Franchise Agreement, Area Development Agreement, Pro Network Franchise Agreement, Metro Master Franchise Agreement, Site Selection Addendum, Lease Rider, Brand License, Software License, Confidentiality, Personal Guaranty).
- [ ] **Step 4:** Item 23 — two-receipt-page format per FTC requirement.

**Deliverable:** Items 20–23 first drafts + sample contracts.
**Acceptance:** LEGAL accepts.
**Dependencies:** WS1-1, WS1-2 (audited statements), WS1-7 to WS1-14 (sample contract terms reflect Items 5–18).

---

### Task WS1-16: Compile FDD Version 1.0 + independent second-opinion review

**Owner:** LEGAL + VPFD + P
**Files:**
- Create: `docs/franchise/fdd-final/2026-XX-XX-FDD-v1.0.pdf`
- Create: `docs/franchise/fdd-final/2026-XX-XX-FDD-v1.0-cover-letter-from-counsel.pdf`

- [ ] **Step 1:** LEGAL compiles all 23 Items into FTC-compliant FDD format (paginated, consistent typography, table-of-contents, exhibits).
- [ ] **Step 2:** Engage independent franchise counsel for second-opinion compliance review (separate firm from LEGAL).
- [ ] **Step 3:** Address second-opinion comments.
- [ ] **Step 4:** P + VPFD final approval.
- [ ] **Step 5:** Issue FDD Version 1.0.

**Deliverable:** FDD Version 1.0 ready for state filings + franchisee delivery.
**Acceptance:** Both LEGAL and independent counsel issue compliance opinion letters.
**Dependencies:** WS1-3 through WS1-15 all complete.

---

## Work Stream 2 — State Registration + Compliance (Lead: VPFD + LEGAL)

### Task WS2-1: Build state registration calendar + filing matrix

**Owner:** VPFD + LEGAL
**Files:**
- Create: `docs/franchise/state-registration/2026-04-25-state-filing-matrix.md`
- Create: `docs/franchise/state-registration/2026-04-25-state-renewal-calendar.ics`

- [ ] **Step 1:** Build per-state filing matrix: filing fee, attorney fee estimate, expected review time, renewal cadence, renewal fee, contact at state regulator.
- [ ] **Step 2:** Build renewal-calendar with 90-day pre-renewal alerts for every state.
- [ ] **Step 3:** Document priority order: Phase 4 Year 2 (NY, RI, MD, VA), Phase 4 Year 3 (10 remaining registration states + 4 business-opportunity states).

**Deliverable:** State filing matrix + renewal calendar.
**Acceptance:** VPFD signs off; calendar entries set in corporate calendar system.
**Dependencies:** None.

---

### Task WS2-2: File New York FDD registration

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/state-registration/NY/2026-XX-XX-NY-FDD-application.pdf`
- Create: `docs/franchise/state-registration/NY/2026-XX-XX-NY-AG-correspondence.md`

- [ ] **Step 1:** LEGAL prepares New York Attorney General registration filing per New York Franchise Sales Act.
- [ ] **Step 2:** Submit filing with $750 filing fee.
- [ ] **Step 3:** Respond to NY AG reviewer comments (typical 60–90 day review cycle).
- [ ] **Step 4:** Receive Effective Date letter; flag in corporate calendar.

**Deliverable:** New York registration effective.
**Acceptance:** Effective Date letter on file.
**Dependencies:** WS1-16 (FDD Version 1.0 issued).

---

### Task WS2-3: File Rhode Island FDD registration

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/state-registration/RI/2026-XX-XX-RI-FDD-application.pdf`

- [ ] **Step 1:** LEGAL prepares Rhode Island Department of Business Regulation filing.
- [ ] **Step 2:** Submit with $500 filing fee.
- [ ] **Step 3:** Receive Effective Date.

**Deliverable:** Rhode Island registration effective.
**Acceptance:** Effective Date on file.
**Dependencies:** WS1-16.

---

### Task WS2-4: File Maryland + Virginia FDD registrations

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/state-registration/MD/2026-XX-XX-MD-FDD-application.pdf`
- Create: `docs/franchise/state-registration/VA/2026-XX-XX-VA-FDD-application.pdf`

- [ ] **Step 1:** LEGAL prepares both filings ($500 each).
- [ ] **Step 2:** Submit to Maryland Securities Division + Virginia State Corporation Commission.
- [ ] **Step 3:** Receive Effective Dates.

**Deliverable:** Maryland + Virginia registrations effective.
**Acceptance:** Effective Dates on file.
**Dependencies:** WS1-16.

---

### Task WS2-5: File business-opportunity notice in Florida + Texas

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/state-registration/FL/2026-XX-XX-FL-business-opp-notice.pdf`
- Create: `docs/franchise/state-registration/TX/2026-XX-XX-TX-business-opp-notice.pdf`

- [ ] **Step 1:** Prepare Florida Annual Business Opportunity Filing ($100) and Texas Business Opportunity Act notice ($0).
- [ ] **Step 2:** Submit.

**Deliverable:** Florida + Texas notices on file.
**Acceptance:** State acknowledgment letters received.
**Dependencies:** WS1-16.

---

### Task WS2-6: Register in remaining 10 FDD-registration states (Phase 4 Year 3)

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/state-registration/[STATE]/2027-XX-XX-[STATE]-FDD-application.pdf` for each of: California, Hawaii, Illinois, Indiana, Michigan, Minnesota, North Dakota, South Dakota, Washington, Wisconsin

- [ ] **Step 1:** LEGAL prepares per-state filings (estimated $4,575 in filing fees + $15K–$25K attorney fees total).
- [ ] **Step 2:** Submit all 10 filings within Phase 4 Year 3 Quarter 1.
- [ ] **Step 3:** Address state-by-state reviewer comments.
- [ ] **Step 4:** Receive Effective Dates; populate state filing matrix.

**Deliverable:** All 14 FDD-registration states registered.
**Acceptance:** Effective Dates on file for all 10 remaining states.
**Dependencies:** WS1-16; WS2-2 to WS2-5 (proves filing process).

---

### Task WS2-7: Annual FDD update + state renewal cycle

**Owner:** VPFD + LEGAL + AUDIT
**Files:**
- Create: `docs/franchise/fdd-final/2027-XX-XX-FDD-v2.0.pdf` (annual update)
- Update: `docs/franchise/state-registration/2026-04-25-state-renewal-calendar.ics`

- [ ] **Step 1:** Audited financial statements for prior fiscal year delivered by AUDIT within 90 days of year-end.
- [ ] **Step 2:** LEGAL updates FDD Items 1, 2, 3, 4, 19, 20, 21 to reflect current-year data.
- [ ] **Step 3:** File annual renewal in every registration state on its specific renewal cadence.
- [ ] **Step 4:** Distribute updated FDD to every prospective franchisee in pipeline.

**Deliverable:** Annual FDD update issued; all state renewals current.
**Acceptance:** Zero state filings out of compliance.
**Dependencies:** WS1-16; WS2-2 through WS2-6 (initial registrations).

---

## Work Stream 3 — Pilot Franchisee Selection (Lead: VPFD + P)

### Task WS3-1: Build franchise-prospect website

**Owner:** VPFD + Marketing team
**Files:**
- Create: `src/app/franchise/page.tsx` (franchise.thesherpapros.com landing page)
- Create: `src/app/franchise/inquiry/page.tsx` (Franchise Inquiry Form)
- Create: `src/app/franchise/economics/page.tsx` (per-Hub economics overview — Item 19 redacted public version)
- Create: `src/app/franchise/discovery-day/page.tsx` (Discovery Day calendar + signup)

- [ ] **Step 1:** Design franchise.thesherpapros.com landing page using thesherpapros design system (read `references/DESIGN.md` first).
- [ ] **Step 2:** Build Franchise Inquiry Form (industry experience, net worth, cash to invest, target market, timing).
- [ ] **Step 3:** Build per-Hub economics overview page (must NOT make earnings claims that exceed Item 19 — coordinate with LEGAL).
- [ ] **Step 4:** Build Discovery Day calendar + signup.
- [ ] **Step 5:** Wire form submissions to corporate Customer Relationship Management (CRM) for VPFD intake.

**Deliverable:** Franchise prospect website live.
**Acceptance:** All four routes pass build; VPFD can receive and track inquiries.
**Dependencies:** None for design; LEGAL review required before per-Hub economics page goes live.

---

### Task WS3-2: Build 7-stage screening process documentation

**Owner:** VPFD + LEGAL
**Files:**
- Create: `docs/franchise/screening/2026-04-25-7-stage-screening-process.md`
- Create: `docs/franchise/screening/templates/stage-1-inquiry-auto-response.md`
- Create: `docs/franchise/screening/templates/stage-2-discovery-call-script.md`
- Create: `docs/franchise/screening/templates/stage-3-mutual-NDA.docx`
- Create: `docs/franchise/screening/templates/stage-4-FDD-delivery-cover-letter.md`
- Create: `docs/franchise/screening/templates/stage-5-discovery-day-agenda.md`
- Create: `docs/franchise/screening/templates/stage-6-references-background-check-form.md`
- Create: `docs/franchise/screening/templates/stage-7-final-approval-committee-template.md`

- [ ] **Step 1:** Document each stage with entry criteria, deliverables, exit criteria, time-to-next-stage.
- [ ] **Step 2:** Draft template documents for each stage.
- [ ] **Step 3:** LEGAL reviews mutual NDA + FDD delivery cover letter (FTC waiting-period trigger) for compliance.
- [ ] **Step 4:** Configure CRM stages to mirror the 7-stage process.

**Deliverable:** 7-stage screening process documented + templated.
**Acceptance:** VPFD can run a prospect through all 7 stages with documented templates.
**Dependencies:** WS1-16 (FDD must exist for Stage 4); WS3-1 (intake mechanism).

---

### Task WS3-3: Identify Hub #2 candidate franchisees in NH/ME/MA/VT

**Owner:** VPFD + P
**Files:**
- Create: `docs/franchise/prospect-pipeline/2026-04-25-phase-4-prospect-list.md`

- [ ] **Step 1:** Source candidate prospects from: HJD Builders contractor network, NH Home Builders Association, Maine Builders Association, FW Webb supply-house manager network, ex-Big-Box pro-desk manager LinkedIn search, local trade-association executive director outreach.
- [ ] **Step 2:** Build prospect list with name, current role, target market, estimated net worth band, source of referral.
- [ ] **Step 3:** VPFD personally outreaches top 20 prospects via warm intro.
- [ ] **Step 4:** Schedule Stage 2 Discovery Calls.

**Deliverable:** Phase 4 Year 1 prospect pipeline of 20+ qualified prospects.
**Acceptance:** Minimum 5 prospects in Stage 2 within 90 days; minimum 3 prospects in Stage 5 within 180 days.
**Dependencies:** WS3-2.

---

### Task WS3-4: Configure background check + credit check vendor accounts

**Owner:** VPFD
**Files:**
- Create: `docs/franchise/screening/vendor-accounts/2026-04-25-hireright-account-setup.md`
- Create: `docs/franchise/screening/vendor-accounts/2026-04-25-boefly-credit-check-setup.md`

- [ ] **Step 1:** Set up HireRight (or comparable) corporate account for prospect background checks.
- [ ] **Step 2:** Set up BoeFly account for credit check + franchise lending evaluation.
- [ ] **Step 3:** Document per-prospect cost ($550 application processing fee charged to prospect; covers actual vendor costs).

**Deliverable:** Background + credit check vendors operational.
**Acceptance:** Test run passes for one HJD-internal candidate.
**Dependencies:** WS3-2.

---

### Task WS3-5: Run first 3 prospects through full 7-stage screening

**Owner:** VPFD + P + LEGAL
**Files:**
- Create: `docs/franchise/prospect-pipeline/2026-XX-XX-prospect-001-file.md`
- Create: `docs/franchise/prospect-pipeline/2026-XX-XX-prospect-002-file.md`
- Create: `docs/franchise/prospect-pipeline/2026-XX-XX-prospect-003-file.md`

- [ ] **Step 1:** Move first 3 qualified prospects through Stages 1–7.
- [ ] **Step 2:** Document edge cases and screening process refinements as they emerge.
- [ ] **Step 3:** Convene Franchise Approval Committee (P + VPFD + VPOPS + CFO) for Stage 7 unanimous-approval vote.

**Deliverable:** First 3 franchise sales completed (or documented Reject decisions for prospects who do not pass screening).
**Acceptance:** First sold Franchise Agreement executed.
**Dependencies:** WS1-16, WS2-2 to WS2-5 (registered in target state), WS3-1 to WS3-4.

---

## Work Stream 4 — Franchisee Training Program (Lead: VPOPS)

### Task WS4-1: Design 80-hour initial training curriculum

**Owner:** VPOPS + VPFD
**Files:**
- Create: `docs/franchise/training/2026-04-25-initial-training-curriculum.md`
- Create: `docs/franchise/training/curriculum/module-01-platform-operations.md`
- Create: `docs/franchise/training/curriculum/module-02-hub-operations.md`
- Create: `docs/franchise/training/curriculum/module-03-pro-recruiting-onboarding.md`
- Create: `docs/franchise/training/curriculum/module-04-codes-literacy.md`
- Create: `docs/franchise/training/curriculum/module-05-materials-orchestration.md`
- Create: `docs/franchise/training/curriculum/module-06-customer-service.md`
- Create: `docs/franchise/training/curriculum/module-07-compliance-brand-standards.md`
- Create: `docs/franchise/training/curriculum/module-08-marketing-local.md`
- Create: `docs/franchise/training/curriculum/module-09-financial-management.md`
- Create: `docs/franchise/training/curriculum/module-10-final-assessment.md`

- [ ] **Step 1:** Build 10-module curriculum with 8-hour modules (total 80 hours).
- [ ] **Step 2:** Each module specifies: learning objectives, content outline, hands-on exercises, knowledge check, completion criteria.
- [ ] **Step 3:** Module 4 (codes literacy) references the codes intelligence layer internally; never expose "Wiseman" externally — use "Sherpa codes engine" in franchisee-facing materials.
- [ ] **Step 4:** Module 10 final assessment determines pass/fail; passing score required to operate Hub.

**Deliverable:** 10-module training curriculum.
**Acceptance:** VPOPS + VPFD sign off; first prospect successfully completes pilot training run.
**Dependencies:** None.

---

### Task WS4-2: Build training facility at Hub #1 (Atkinson NH)

**Owner:** VPOPS + P
**Files:**
- Create: `docs/franchise/training/facility/2026-04-25-hub1-training-room-fitout.md`

- [ ] **Step 1:** Design 600-square-foot training room (12-seat classroom + 2 demo benches per Hub #1 spec §1).
- [ ] **Step 2:** Equipment manifest: 12 student stations, projector, whiteboard, demo workbench with all Sherpa codes engine + Sherpa Materials access points, sample kit assembly station, Hub Point of Sale demo terminal.
- [ ] **Step 3:** Buildout (target: complete by Phase 3 Year 1 Quarter 4 to support first franchisee training in Phase 4 Year 1).

**Deliverable:** Training room operational at Hub #1.
**Acceptance:** First training cohort completes without facility issues.
**Dependencies:** Hub #1 must be operational.

---

### Task WS4-3: Develop Sherpa Brand Standards Manual + Sherpa Operations Manual

**Owner:** VPOPS + Brand team
**Files:**
- Create: `docs/franchise/manuals/2026-04-25-sherpa-brand-standards-manual.md`
- Create: `docs/franchise/manuals/2026-04-25-sherpa-operations-manual.md`

- [ ] **Step 1:** Brand Standards Manual: signage, exterior, interior, uniform, customer touchpoints, marketing collateral, brand voice, do/don't list. References §3.3 of the GTM spec for voice.
- [ ] **Step 2:** Operations Manual: opening and closing procedures, Point of Sale workflows, inventory management, kit assembly procedures, equipment rental procedures, training event procedures, customer service procedures, financial reporting procedures.
- [ ] **Step 3:** Versioning system (Brand Standards updates pushed quarterly; Operations Manual updates pushed monthly when material).

**Deliverable:** Brand Standards Manual + Operations Manual Version 1.0.
**Acceptance:** VPOPS + Phyrom approve.
**Dependencies:** None.

---

### Task WS4-4: Build 8 quarterly continuing education courses

**Owner:** VPOPS
**Files:**
- Create: `docs/franchise/training/quarterly-courses/2026-04-25-course-catalog.md`

- [ ] **Step 1:** Design course rotation: advanced pro retention, code-update bulletin, materials-supplier negotiation, marketing campaign templates, financial benchmarking, customer-dispute resolution, hiring + management, technology-roadmap update.
- [ ] **Step 2:** Each course: 2-hour Online format; recording archive; live Q&A with subject-matter expert.
- [ ] **Step 3:** Schedule first cycle for Phase 4 Year 1 Quarter 1.

**Deliverable:** 8-course catalog + first-cycle schedule.
**Acceptance:** First course delivered with first franchisee cohort.
**Dependencies:** WS3-5 (first franchisees need to be onboarded before continuing education matters).

---

## Work Stream 5 — Operations Support Infrastructure (Lead: VPOPS + VPFD)

### Task WS5-1: Build franchisee performance dashboard

**Owner:** VPOPS + Engineering
**Files:**
- Create: `src/app/admin/franchise/performance/page.tsx` (corporate-side dashboard)
- Create: `src/app/franchise-portal/dashboard/page.tsx` (franchisee-side dashboard)
- Create: `src/app/api/franchise/performance/route.ts` (Application Programming Interface)
- Create: `db/migrations/franchise/2026-04-25-add-franchise-tables.sql`

- [ ] **Step 1:** Define performance metrics: monthly gross revenue, COGS, OpEx, EBITDA, royalty paid, marketing fund paid, technology fee paid, local marketing spend, pro-recruiting velocity, customer satisfaction score, Brand Compliance Score, software adoption score.
- [ ] **Step 2:** Build database tables (franchisee, franchise_agreement, franchise_monthly_pnl, franchise_compliance_audit, franchise_brand_audit).
- [ ] **Step 3:** Build API endpoints that aggregate Point of Sale data + Sherpa Marketplace data + Sherpa Materials data into per-franchisee dashboards.
- [ ] **Step 4:** Build corporate-side comparison dashboard (all franchisees ranked by each metric).
- [ ] **Step 5:** Build franchisee-side dashboard (their own data + benchmarks against system average).

**Deliverable:** Performance dashboards live for first franchisee cohort.
**Acceptance:** First franchisee can see their data in real-time; corporate can run system-wide reports.
**Dependencies:** WS1-7 (Items 5 + 6 royalty/fee structure must be locked).

---

### Task WS5-2: Configure Marketing Fund management

**Owner:** Chief Marketing Officer + CFO + VPFD
**Files:**
- Create: `docs/franchise/marketing-fund/2026-04-25-marketing-fund-charter.md`
- Create: `docs/franchise/marketing-fund/2026-04-25-marketing-fund-spending-rules.md`
- Create: `db/migrations/franchise/2026-04-25-add-marketing-fund-table.sql`

- [ ] **Step 1:** Charter the Marketing Fund (segregated bank account; 2 percent of gross revenue from every franchisee + corporate Hub).
- [ ] **Step 2:** Define spending rules (60 percent national brand campaigns, 25 percent regional co-op, 15 percent franchise-system lead generation).
- [ ] **Step 3:** Build quarterly Marketing Fund report template (income, expenditure, fund balance) — distributed to every franchisee + FAC.
- [ ] **Step 4:** Configure ACH auto-debit of monthly Marketing Fund contributions.

**Deliverable:** Marketing Fund operational.
**Acceptance:** First-quarter contributions collected; first quarterly report published.
**Dependencies:** WS3-5 (first franchisee must have signed Franchise Agreement).

---

### Task WS5-3: Configure royalty + technology fee auto-debit

**Owner:** CFO + VPFD
**Files:**
- Create: `docs/franchise/royalty-collection/2026-04-25-royalty-ach-auto-debit-setup.md`

- [ ] **Step 1:** Configure Stripe ACH or comparable for monthly auto-debit of royalty (6/8 percent of franchisee gross revenue), Marketing Fund (2 percent), Technology Fee ($200 flat).
- [ ] **Step 2:** Auto-generate monthly statement to franchisee 5 business days before debit date.
- [ ] **Step 3:** Build dispute / correction workflow for revenue reconciliation.

**Deliverable:** Royalty + fee auto-debit operational.
**Acceptance:** First debit cycle clears for first franchisee.
**Dependencies:** WS3-5.

---

### Task WS5-4: Charter Franchise Advisory Council (FAC)

**Owner:** P + VPFD
**Files:**
- Create: `docs/franchise/fac/2026-04-25-fac-charter.md`
- Create: `docs/franchise/fac/2026-04-25-fac-election-process.md`
- Create: `docs/franchise/fac/2026-04-25-fac-meeting-cadence.ics`

- [ ] **Step 1:** Trigger FAC charter when 5 active franchisees signed (or earlier if corporate elects).
- [ ] **Step 2:** Document composition, voting structure, term limits, meeting cadence per source spec §12.
- [ ] **Step 3:** Build election process (annual election; nominations open 60 days before; ballots distributed to all franchisees).
- [ ] **Step 4:** Schedule first FAC meeting.

**Deliverable:** FAC operational.
**Acceptance:** First FAC meeting held with 5 elected franchisee representatives.
**Dependencies:** WS3-5 plus 4 additional franchise sales.

---

### Task WS5-5: Build franchise compliance monitoring

**Owner:** VPFD + LEGAL
**Files:**
- Create: `docs/franchise/compliance/2026-04-25-compliance-monitoring-framework.md`
- Create: `docs/franchise/compliance/2026-04-25-mystery-shopper-program.md`

- [ ] **Step 1:** Document compliance monitoring framework: Brand Compliance Score (quarterly mystery-shopper audit + signage audit + uniform audit + customer touchpoint audit); Software Adoption Score (codes engine usage + Materials engine usage + Dispatch usage + Smart Scan usage); Operations Compliance Score (kit-assembly procedure + equipment-rental procedure + training delivery procedure).
- [ ] **Step 2:** Engage mystery-shopper vendor for quarterly audits.
- [ ] **Step 3:** Build cure-period framework (first violation: written notice + 30-day cure; repeated violations: written notice + 15-day cure + path to termination).
- [ ] **Step 4:** Tie compliance scores to franchise renewal eligibility (Item 17).

**Deliverable:** Compliance monitoring operational.
**Acceptance:** First mystery-shopper audit completed within 90 days of first Hub opening.
**Dependencies:** WS3-5.

---

## Work Stream 6 — International Master-Franchise Readiness (Lead: VPFD + LEGAL)

> **Defer detailed country-by-country execution to** `docs/superpowers/specs/2026-04-25-international-expansion-design.md`. **WS6 below covers only the franchise-program-specific readiness items.**

### Task WS6-1: Research Canada provincial Franchise Acts

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/international/canada/2026-04-25-canada-provincial-franchise-act-summary.md`

- [ ] **Step 1:** Research Ontario Arthur Wishart Act (Franchise Disclosure), Alberta Franchises Act, Prince Edward Island Franchises Act, Manitoba Franchises Act, New Brunswick Franchises Act.
- [ ] **Step 2:** Build per-province disclosure-document requirements summary.
- [ ] **Step 3:** Engage Canadian franchise counsel (recommended: Cassels Brock & Blackwell or Osler Hoskin & Harcourt for Ontario; provincial-specific counsel for others).

**Deliverable:** Canada provincial franchise compliance brief.
**Acceptance:** VPFD can speak to Canada Master Franchisee compliance requirements.
**Dependencies:** None.

---

### Task WS6-2: Research United Kingdom British Franchise Association (BFA) Code

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/international/uk/2026-04-25-uk-bfa-code-summary.md`
- Create: `docs/franchise/international/uk/2026-04-25-bfa-membership-application.md`

- [ ] **Step 1:** Research BFA Code of Ethics + BFA Membership criteria.
- [ ] **Step 2:** Apply for BFA Provisional Membership (entry-level UK franchise credibility signal).
- [ ] **Step 3:** Engage UK franchise counsel (recommended: Hamilton Pratt or Field Fisher).

**Deliverable:** UK BFA membership application submitted.
**Acceptance:** BFA Provisional Membership granted.
**Dependencies:** None.

---

### Task WS6-3: Research Australian Franchising Code of Conduct

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/international/australia/2026-04-25-au-franchising-code-summary.md`

- [ ] **Step 1:** Research Australian Franchising Code of Conduct (mandatory under Competition and Consumer Act); Australian Disclosure Document requirements; Australian cooling-off period; Australian dispute-resolution mechanism.
- [ ] **Step 2:** Engage Australian franchise counsel (recommended: DC Strategy Lawyers or MST Lawyers).
- [ ] **Step 3:** Build Australian Disclosure Document outline (analogous to FDD).

**Deliverable:** Australia Franchising Code compliance brief.
**Acceptance:** VPFD can speak to Australia Master Franchisee compliance requirements.
**Dependencies:** None.

---

### Task WS6-4: Build International Master Franchisee qualification matrix

**Owner:** VPFD + P + LEGAL
**Files:**
- Create: `docs/franchise/international/2026-04-25-international-master-franchisee-qualification-matrix.md`

- [ ] **Step 1:** Define qualification criteria: country-market experience, multi-unit franchise track record, country-currency net worth equivalents (USD-equivalent $5M+ liquid net worth recommended floor), management capacity for sub-franchise development, country-specific regulatory compliance capability.
- [ ] **Step 2:** Define disqualification criteria.
- [ ] **Step 3:** Document Master Franchisee fee structure per country market size (Canada $750K, UK $1.2M, Australia $850K, Mexico $500K reference points; refine with international-expansion spec authors).

**Deliverable:** International Master Franchisee qualification matrix.
**Acceptance:** VPFD + P sign off; matrix is consistent with international-expansion spec.
**Dependencies:** Coordination with international-expansion spec authors.

---

### Task WS6-5: Build International Master Franchise Agreement template

**Owner:** LEGAL + VPFD
**Files:**
- Create: `docs/franchise/international/2026-04-25-international-master-franchise-agreement-template.md`

- [ ] **Step 1:** LEGAL drafts International Master Franchise Agreement template covering: country-wide territory exclusivity, Master Franchisee development schedule (number of sub-Hubs over 10 years), Master Franchisee fee structure, royalty, marketing fund, sub-franchise-royalty split, country-level FDD-equivalent compliance obligation, brand standards compliance, software license, dispute resolution under London Court of International Arbitration (LCIA) Rules.
- [ ] **Step 2:** Per-country counsel reviews template.

**Deliverable:** International Master Franchise Agreement template Version 1.0.
**Acceptance:** LEGAL + per-country counsel issue compliance opinion.
**Dependencies:** WS6-1 to WS6-4.

---

## Cross-Stream Coordination

**Weekly review:** every Monday, 60 minutes — P + VPFD + VPOPS + CFO + Chief Marketing Officer. Agenda: WS1 milestone status, WS2 state filing status, WS3 prospect-pipeline movement, WS4 training-program readiness, WS5 operations-infrastructure delivery, WS6 international research progress, risk-register update.

**Monthly milestone gate:** end of each month, P approves or holds the next month's go-forward based on previous month deliverable acceptance.

**Quarterly Franchise Program Strategic Review:** P + Board (when Board exists) reviews aggregate franchise program economics versus plan; adjusts royalty rates, Initial Franchise Fee, territory rules, or recruiting strategy if material variance.

---

## Critical-Path Summary

| Milestone | Target Date | Gating Tasks |
|---|---|---|
| FDD Version 1.0 issued | Phase 3 Year 1 Quarter 4 | WS1-1 through WS1-16 |
| First state registrations effective (NY, RI, MD, VA) | Phase 4 Year 1 Quarter 2 | WS1-16 + WS2-2 to WS2-5 |
| First franchise sale | Phase 4 Year 1 Quarter 3 | WS1-16 + WS2-2 + WS3-1 to WS3-5 + WS4-1 to WS4-3 |
| First Hub Grand Opening | Phase 4 Year 1 Quarter 4 | First franchise sale + WS5-1 + 90-day onboarding playbook |
| FAC chartered | Phase 4 Year 2 Quarter 2 | 5 sold franchises (multiple WS3-5 cycles) |
| All 14 FDD-registration states registered | Phase 4 Year 3 Quarter 4 | WS2-6 |
| First International Master Franchise Agreement signed | Phase 5 Year 1 | WS6-1 to WS6-5 + international-expansion spec execution |

---

## Acceptance for Plan as a Whole

This plan is complete when:
1. FDD Version 1.0 is issued and accepted by both LEGAL and independent franchise counsel.
2. Sherpa Pros LLC is registered as a franchisor in at least the four Phase 4 Year 2 priority states (NY, RI, MD, VA).
3. At least 3 Sherpa Hub franchises are sold and operating in Phase 4 Year 1 launch states (NH/ME/MA/VT).
4. Franchisee Performance Dashboard is live with at least 90 days of operating data per franchisee.
5. Marketing Fund + royalty auto-debit operational and reconciled monthly.
6. Compliance monitoring framework operational with at least one completed mystery-shopper audit cycle per franchisee.
7. International Master Franchise Agreement template Version 1.0 reviewed by per-country counsel and ready for first Master Franchisee outreach in Phase 5.
