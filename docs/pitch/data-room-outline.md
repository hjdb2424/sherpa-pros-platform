# Sherpa Pros — Investor Data Room Outline (v1)

**Owner:** Phyrom
**Use:** Weekend-walkable checklist. Build out before Series A meetings open.
**Status:** Draft — items marked TODO require Phyrom attention.

---

## 1. Cap Table + 409a

**What investors will ask for:** Current cap table (clean), 409a valuation, prior round terms (Wefunder + angels), option pool status, vesting schedule for founder + early hires.

**What to put in the room:**
- Current cap table spreadsheet (founder %, Wefunder investor list, angels, option pool reserved).
- Wefunder round documents (subscription agreement, terms, closing schedule).
- 409a valuation report (most recent, pre-Series-A).
- Founder vesting schedule + IP assignment.
- Pro-forma cap table at $12M Series A close (target).

**Where it lives today:**
- Cap table: TODO — not formalized in a spreadsheet yet. Carta or Pulley account to be opened pre-Series-A.
- Wefunder docs: live on Wefunder platform, downloadable.
- 409a: TODO — not commissioned. ~$2K-$4K through Carta/Eqvista. Order in Week 1.

**Still missing:** 409a, formalized cap-table tool (Carta), pro-forma post-Series-A cap table.

---

## 2. Financials — Current + Projections

**What investors will ask for:** P&L (last 6-12 months), balance sheet, cash position, burn rate, revenue/GMV by month, financial projections Y1-Y3 + Y4-Y5 sketch.

**What to put in the room:**
- P&L monthly (last 6+ months) — beta cohort revenue, Stripe fees, Twilio costs, hosting, Phyrom comp.
- Balance sheet (current).
- Cash position + burn rate (12-month rolling forward).
- Y1-Y3 financial model (per Slide 17 of v2 deck).
- Y4-Y5 sketch (Phase 4 directional, see Series C deck appendix).
- Hub Item 19 economics workbook.
- Beta finance model (ties to Slide 13 unit economics).

**Where it lives today:**
- QuickBooks (HJD Builders ledger — separate, not Sherpa Pros).
- Beta finance model: ~/sherpa-pros-platform/docs/finance/ (TODO confirm path).
- Hub Item 19 workbook: ~/sherpa-pros-platform/docs/finance/hub-item-19-economics.xlsx (TODO confirm).

**Still missing:** Standalone Sherpa Pros P&L (separate from HJD Builders), formalized cash flow statement, Y4-Y5 sketch deliverable.

---

## 3. Customer Cohort Metrics

**What investors will ask for:** Pro cohort retention curves, homeowner cohort retention, GMV per pro by cohort, take rate by job category, NPS, churn, repeat-job rate.

**What to put in the room:**
- Pro cohort table — month of signup × retention % × jobs completed × GMV.
- Homeowner cohort table — same shape.
- NPS survey results (founding pros NPS 71 — confirmed Phase 0).
- Take rate by job type (electrical, HVAC, plumbing, multi-trade).
- Repeat-job and referral rates.
- Code Intelligence Layer telemetry (1,200+ live validations, 78% auto-fix acceptance — per Slide 10).

**Where it lives today:**
- Production Postgres (Neon) + Mixpanel/PostHog if installed.
- Migration 005 telemetry: ~/sherpa-pros-platform/db/migrations/005_*.sql — confirm.

**Still missing:** Formalized cohort dashboard (Mode/Hex/Metabase), NPS results documented in PDF, take-rate breakdown by category exported.

---

## 4. Tech Architecture

**What investors will ask for:** Architecture diagram, tech stack, scalability plan, security posture, AI/ML approach, code repo access (read-only with NDA).

**What to put in the room:**
- Architecture diagram (one-page, all 14 surfaces + 8 capabilities).
- Tech stack rundown (Next.js 16, Stripe Connect, Neon Postgres + PostGIS, Clerk, Twilio, Vercel — per CLAUDE.md).
- AI/ML roadmap doc (`docs/superpowers/specs/2026-04-26-ai-ml-roadmap-design.md`).
- Code repo read-only access (GitHub, post-NDA).
- Security architecture (auth, RBAC, payment compliance, license verification).
- Scalability + disaster recovery plan.

**Where it lives today:**
- CLAUDE.md (tech stack summary).
- AI/ML roadmap doc — exists.
- Architecture diagram: TODO — not drawn yet. ~1 day of work.
- Code repo: github.com/hjdb2424/sherpa-pros-platform (private).

**Still missing:** One-page architecture diagram for non-engineering investor audience, formal security writeup, scalability plan in PDF.

---

## 5. Legal — Incorporation + IP + Contracts

**What investors will ask for:** Cert of incorporation, bylaws, founder IP assignment, key contracts (FW Webb LOI, commercial PM pilot, Stripe Connect terms), trademark filings.

**What to put in the room:**
- Delaware Cert of Incorporation (or current state if not yet flipped — flip before Series A).
- Bylaws.
- Founder IP assignment (full Sherpa Pros codebase + IP transferred from Phyrom personal/HJD Builders to Sherpa Pros entity).
- FW Webb Hub #1 LOI.
- Commercial PM pilot agreement (NDA-protected).
- Stripe Connect platform agreement.
- Twilio + Clerk + Neon vendor agreements.
- "Sherpa Pros" trademark filing (USPTO).

**Where it lives today:**
- Incorporation: TODO — confirm Delaware C-Corp filed. If not, do this Week 1.
- IP assignment: TODO — required for Series A.
- Trademark: TODO — file pre-Series-A.
- LOIs and contracts: in personal email + Drive — needs consolidation.

**Still missing:** Almost everything is in personal email or local files. Consolidate into a "Legal" folder in the data room. Engage a startup-experienced attorney (Cooley, Wilson Sonsini, Gunderson, or NH-local startup counsel) by Week 2.

---

## 6. Team — Resumes + Bios

**What investors will ask for:** Founder resume + bio, advisor list, planned first 6-8 hires with role specs, any signed offer letters.

**What to put in the room:**
- Phyrom resume + 1-page founder bio.
- Phyrom GC license + insurance documentation.
- Advisor list (target 3-5 by Series A) with bios.
- Job specs for first 6 Series-A hires (per Slide 16).
- Any signed offer letters or LOIs from candidate hires.

**Where it lives today:**
- Resume: TODO — not in canonical form. Draft this weekend.
- Advisor list: TODO — empty. Begin recruiting in Week 1.
- Job specs: partial in Phase 4 org-design doc. Adapt for Series A scope.

**Still missing:** Formal resume PDF, advisor bench, job specs for first 6 hires.

---

## 7. GTM — This Deck + Supporting

**What investors will ask for:** Pitch deck (this v2), one-pager, market analysis, competitive landscape, customer testimonials, demo video.

**What to put in the room:**
- Sherpa Pros Deck v2 (this document).
- Sherpa Pros One-Pager v1 (`docs/pitch/sherpa-pros-onepager-v1.md`).
- TAM-SAM-SOM analysis (`docs/pitch/tam-sam-som.md`).
- Competitive analysis (`docs/pitch/competitive-analysis.md`).
- Brand audit (`docs/pitch/brand-audit.md`).
- 2-3 founding-pro testimonial quotes (with permission).
- 60-90s product demo video (TODO — record on Sherpa Mobile + Sherpa Home).

**Where it lives today:**
- All textual GTM docs: `~/sherpa-pros-platform/docs/pitch/`.
- One-pager: exists.
- Demo video: TODO — record this week.

**Still missing:** Demo video, founding-pro testimonial quotes (with sign-off), distributor (FW Webb) testimonial.

---

## 8. Compliance — Insurance + SOC 2 + FDD Prep

**What investors will ask for:** Current insurance (general liability, E&O, cyber), SOC 2 status (Phase 4 target), franchise disclosure document (FDD) prep status (Phase 4), any regulatory filings.

**What to put in the room:**
- General liability + E&O + cyber insurance policy summaries.
- SOC 2 readiness assessment (target: Type 2 by M30).
- FDD prep timeline (target: Phase 4 M24+).
- License verification API vendor agreements.
- Stripe + Twilio + Clerk subprocessor agreements.

**Where it lives today:**
- Insurance: HJD Builders has GL — TODO confirm Sherpa Pros entity has its own.
- SOC 2: not started — engage Vanta or Drata in Phase 1.
- FDD: not started — Phase 4 trigger.

**Still missing:** Sherpa-Pros-entity-specific insurance, SOC 2 readiness gap analysis, vendor subprocessor map.

---

## Weekend execution order (Phyrom action list)

1. **Day 1 (highest leverage):** Cap table draft in Carta + commission 409a + Delaware incorporation confirmation + IP assignment.
2. **Day 1 PM:** Architecture diagram (one-page) + founder resume PDF + advisor target list (5 names + outreach drafts).
3. **Day 2 AM:** Standalone Sherpa Pros P&L from QuickBooks + Y1-Y3 financial model (lift from v2 deck Slide 17).
4. **Day 2 PM:** Demo video recording (Sherpa Mobile + Sherpa Home) + founding-pro testimonial outreach.
5. **Week 1 Monday:** Engage startup attorney + Vanta SOC 2 readiness scoping call + trademark filing.

Total weekend lift: ~14 hours focused work to get the data room from 30% complete to 80% complete. The remaining 20% comes in the first two weeks of Series A conversations as investors request specific items.
