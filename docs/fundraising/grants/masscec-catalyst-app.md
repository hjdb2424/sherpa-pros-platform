# MassCEC Catalyst — Sherpa Pros Application Draft

**Program:** Massachusetts Clean Energy Center (MassCEC) — Catalyst (and DICES early-stage track)
**Award size:** Up to $75,000
**Sponsor URL:** https://www.masscec.com/program/catalyst-and-dices
**Applicant:** Sherpa Pros LLC (Phyrom, Founder)
**Draft date:** 2026-04-22
**Status:** DRAFT — for Phyrom review prior to submission

---

## 1. Program at a Glance

MassCEC Catalyst funds Massachusetts-based early-stage climatetech companies (typically pre-seed, ≤4 FTE) with a working prototype and a clear path to a Massachusetts demonstration. The award is non-dilutive and explicitly designed to bridge the gap between prototype and the larger InnovateMass program. **Sherpa Pros qualifies on every criterion** — the platform is past prototype but pre-revenue at scale, the team is one founder + part-time contractors, and the target deployment is Boston metro Mass Save / EV-charger / panel-upgrade lanes.

**Why Catalyst before InnovateMass:** Catalyst's smaller award size and earlier-stage criteria match where Sherpa Pros sits today (Phase 0 of GTM spec). Catalyst funding closes the gap to live MA operating data, which then strengthens the InnovateMass application 6 months later. Many MassCEC-funded companies stack Catalyst → InnovateMass in this exact sequence.

---

## 2. Required Documents Checklist

- [ ] Project narrative (≤6 pages — shorter than InnovateMass; structure: Problem, Technology, MA Demonstration, Team, Budget, Milestones)
- [ ] Detailed budget (Excel template; categories per MassCEC standard)
- [ ] Budget justification (1 page narrative)
- [ ] Resumes / bios for Phyrom and any contributors (≤2 pages each)
- [ ] Massachusetts business registration confirmation (foreign-LLC for Sherpa Pros LLC — see §11)
- [ ] FTE attestation (≤4 full-time equivalents — Sherpa Pros qualifies; see §3)
- [ ] Letter of support from at least one MA stakeholder (Mass Save HPIN contractor or MA homeowner)
- [ ] Form W-9 for Sherpa Pros LLC
- [ ] Conflict-of-interest disclosure
- [ ] Cap table (simple early-stage version — founder 100%, no outside investors yet)

---

## 3. Eligibility Verification

| Criterion | Sherpa Pros status | Cite |
|---|---|---|
| MA-based or registered to do business in MA | **Action item** — file MA foreign-LLC registration before submit (see §11) | MA Secretary of the Commonwealth |
| ≤4 full-time equivalents | Yes — 1 founder (Phyrom) + part-time Upwork US contractors (SDR, deck/content) ≈ 1.4 FTE | GTM spec §7 |
| Climatetech or clean-energy demonstration in MA | Yes — Mass Save HP + National Grid Turnkey EV install acceleration | GTM spec §2.3, §4.3 |
| Pre-revenue / early-stage | Yes — beta cohort launching, no scaled revenue yet | GTM spec §4.2 |
| Working prototype | Yes — live platform at www.thesherpapros.com + mobile TestFlight/PWA | CLAUDE.md |
| Plan to demonstrate at MA site | Yes — Boston specialty cohort onboarding plan | This doc §6 |
| Project completion ≤12 months | Yes — 9-month prototype-to-pilot timeline | This doc §7 |

**Verdict:** Eligible upon MA foreign-LLC registration. Strong fit on all other criteria.

---

## 4. Project Title

**"Code-Aware Marketplace Prototype: Boston Mass Save + EV-Charger Installer Throughput Pilot"**

---

## 5. Application Narrative (≤6 Pages — Draft)

### 5.1 Executive Summary (≤0.5 page)

Sherpa Pros is a Massachusetts-eligible licensed-trade marketplace prototype that matches homeowners to certified Mass Save heat-pump installers and National Grid Turnkey EV-charger electricians, validates contractor quotes against MA Electrical Code and program-eligibility rules in real time, and surfaces stacked rebate eligibility (Mass Save + IRA federal credits + utility-specific bonuses). The platform is live (www.thesherpapros.com), built by a working New Hampshire general contractor (Phyrom, HJD Builders LLC), and ready for a focused Boston-metro demonstration.

**Catalyst funds will deploy the prototype with a 10-pro Boston specialty cohort over 9 months and produce the live operating data (installer throughput, quote accuracy, rebate-stack capture) needed to step up to the InnovateMass program at scale.**

### 5.2 Problem Statement (≈1 page)

Massachusetts has the largest construction labor shortage in the US (2.5% construction unemployment, lowest in 17+ years; 30% of MA residential construction workers are 55+; project completion times stretched from 7 to 11 months) [WBJournal; Bisnow Boston, cited in Sherpa Pros GTM spec §2.1]. Mass Save 2026 rebates ($2,650/ton, $8,500 cap) and National Grid Turnkey EV are demand-funded but supply-bottlenecked.

Existing matching infrastructure is inadequate:

- **Mass Save Find-an-Installer** is a static contractor directory with no dispatch, scheduling, payment protection, in-app messaging, permit assist, rebate calculator, or marketplace mechanics [Mass Save Trade Partners].
- **Lead-gen platforms (Angi, Thumbtack)** charge contractors $30–$100 per shared lead, do not verify EPA HPIN status, do not validate quotes against MA Electrical Code, and have well-documented quality issues (Vermont AG October 2025 settlement on misleading "Certified Pro" terminology) [Sherpa Pros competitive analysis §2].

Every Mass Save / National Grid program dollar sits in a queue waiting for a verified installer with capacity. **The Catalyst-funded prototype directly attacks this matching bottleneck.**

### 5.3 Technology & Innovation (≈1.5 pages)

**Live platform stack:** Next.js 16, Stripe Connect, Neon Postgres + PostGIS, Clerk auth, Twilio masked messaging, Google Maps dispatch UX, proprietary code-aware quote-validation engine (NEC, IRC, MA Electrical Code, NH RSA — 192 codes, 480K entries, 284 NH municipalities cataloged; MA municipal expansion is a Catalyst-funded scope item).

**The four prototype capabilities being demonstrated under Catalyst:**

1. **License + cert verification at directory layer** — license, insurance, EPA HPIN, MA Electrical license validated at onboarding, re-checked annually
2. **Code-aware quote validation** — every quote is checked against NEC 2023, MA Electrical Code (527 CMR 12.00), IRC, and Mass Save program-eligibility rules before the homeowner sees it
3. **Single-contractor dispatch** (not lead-blast) — 7-factor scoring algorithm matches one verified contractor per job at 5–10% take rate
4. **Rebate stacking** — auto-checks Mass Save + IRA § 25C / 25D + utility bonuses + low-income enhancements (HEAT Loan, EBE) and shows post-rebate net cost during bid review

**Innovation claim:** The combination of (1)–(4) is **not currently offered by any platform serving MA homeowners**. National lead-gen incumbents have no incentive to build it (their P&L runs on lead-share volume); Mass Save's directory is static by design. The licensed + code-aware + marketplace quadrant is empty.

### 5.4 Massachusetts Demonstration Plan (≈1 page)

**Phase 1 (Months 0–3): Boston Specialty Cohort Recruitment.** Onboard 10 verified MA contractors: 4 Mass Save HPIN heat-pump installers, 3 licensed electricians (panel + EV), 3 old-house specialists. Recruitment via Mass Save Network application, Eversource HPC referrals, NESEA conference outreach, supply-house partnerships (Granite Group, FW Webb, City Electric Supply Boston).

**Phase 2 (Months 3–6): Live Job Routing.** Route 25+ real Boston-metro jobs across heat-pump installs, panel upgrades, EV-charger installs. Capture full operating data: installer throughput, first-pass quote accuracy, rebate-stack capture rate, dispute rate, NPS.

**Phase 3 (Months 6–9): Measurement & Hand-Off to InnovateMass.** Compile case study; submit InnovateMass application leveraging Catalyst-funded operating data; brief MassCEC program officers on results.

### 5.5 Team

**Phyrom** (Founder & CEO, Sherpa Pros LLC; Founder, HJD Builders LLC) — 12+ years working New Hampshire general contractor. Built and maintains Sherpa Pros, the broader BldSync platform, and the underlying code corpus. Lived the Mass Save / Eversource / National Grid program-rule landscape from the contractor side.

**FTE attestation:** 1 founder full-time + 0.4 FTE Upwork US contractors (SDR + deck/content) = **1.4 FTE total. Well under 4-FTE Catalyst cap.**

### 5.6 Commercialization

Sherpa Pros' revenue model is operational: 5% beta take rate → 10% standard, $49/mo pro subscription, $4 → $1.50/unit/month PM tier. GTM spec §4.4 projects 200+ pros, 1,000+ jobs, $1M+ annualized GMV by Month 12 — Catalyst funding directly contributes to the MA portion of this trajectory and bridges to the InnovateMass scaled deployment.

---

## 6. Milestone Schedule

| Milestone | Target | Success criterion | Deliverable |
|---|---|---|---|
| MA foreign-LLC registration + grant agreement signed | Month 1 | MA filing complete | Filing receipt |
| Mass Save Network application submitted | Month 1 | Acknowledged | Confirmation email |
| 10 MA contractors onboarded | Month 3 | 10 verified profiles live | Onboarding log |
| First 10 MA jobs routed | Month 5 | $50K+ MA GMV | Stripe Connect MA-segment export |
| 25 MA jobs routed + first measurement report | Month 7 | Throughput + quote-accuracy + rebate-capture data captured | Quarterly report |
| Final case study + InnovateMass application submitted | Month 9 | Case study published; InnovateMass filing complete | Final report + InnovateMass application copy |

**Hard 90-day measurable:** 10 MA contractors onboarded, MA foreign-LLC registration complete, Mass Save Network application submitted, first 3 platform-routed Boston jobs in flight.

---

## 7. Budget

**Total project cost: $75,000 (Catalyst awards typically do NOT require cost-share, but document founder in-kind for transparency).**

| Category | Detail | Catalyst ask |
|---|---|---|
| **Personnel** | Pro Success Manager (0.5 FTE × 9 mo loaded $90K/yr) | $33,750 |
| | Client Concierge (0.25 FTE × 9 mo loaded $50K/yr) | $9,375 |
| **Subcontracts** | MA legal — foreign-LLC, contracts, 1099 opinion | $4,000 |
| | Code-corpus expansion (MA municipal: Boston ISD, Cambridge, Brookline) | $10,000 |
| | Mass Save Network application + utility partnership consulting | $5,000 |
| **Materials** | Cloud infra (Vercel, Neon, Clerk, Stripe, Twilio) — 9 months | $7,200 |
| **Travel** | MA pro recruitment travel + NESEA Boston conference | $3,000 |
| **Other Direct** | Liability insurance, marketing collateral, video case-study | $2,675 |
| **TOTAL** | | **$75,000** |

**Founder in-kind (documented for transparency, not required for match):** 300 hours × $185/hr fully loaded = **$55,500 in-kind**.

---

## 8. Submission Instructions

- **Portal:** MassCEC online application portal at https://www.masscec.com/program/catalyst-and-dices — verify current open round before submit
- **Deadlines:** Catalyst typically runs open intake + scheduled review windows (spring/fall). **Phyrom should confirm next review window with the program team (catalyst@masscec.com) before finalizing budget and timeline.**
- **Format:** Project narrative as PDF, budget as Excel template, letters of support as separate PDFs
- **Contact:** MassCEC Catalyst program team — catalyst@masscec.com
- **Pre-submission call:** MassCEC offers brief scoping calls. Recommended for any first-time applicant.

---

## 9. Tips & Gotchas

1. **MA foreign-LLC registration is the gating eligibility item.** File before submission; reviewers verify.
2. **Catalyst is the on-ramp to InnovateMass.** Use the application narrative to explicitly signal the planned Catalyst → InnovateMass progression. Reviewers like seeing a coherent multi-program plan.
3. **≤4 FTE cap is hard.** Document founder + Upwork part-time contractors carefully. Don't claim hires you haven't made.
4. **Climatetech framing is required.** Lead with the heat-pump / EV-charger / panel-upgrade decarbonization mechanism. Don't lead with "marketplace platform."
5. **Working prototype must be demonstrable.** Offer a live walkthrough to the Catalyst program officer at the pre-submission call. Do not show mockups — show the live platform.
6. **No "Wiseman" in any external doc.** Use "code-aware quote validation" or "platform code intelligence" (per Sherpa Pros brand bible / GTM spec §3.3).
7. **The 9-month timeline is the right Catalyst cadence.** Faster looks naive; slower looks like the prototype isn't ready. 9 months hits MassCEC's expectation window.
8. **One MA stakeholder letter is sufficient** — but get one from a Mass Save HPIN contractor specifically (program-program alignment matters). Sample template available on request.

---

## 10. Tracking the Catalyst → InnovateMass Sequence

| Phase | Program | Award | Use |
|---|---|---|---|
| Now (Month 0) | Catalyst submit | $75K | 10-pro Boston cohort, 9-month pilot |
| Month 9 | Catalyst close | — | Operating data captured |
| Month 10 | InnovateMass submit | $350K | 18-month scaled deployment using Catalyst data as evidence |
| Month 13 | InnovateMass award | — | Phase 2 of GTM spec funded non-dilutively |

**This stacks. Total non-dilutive MA capital across both programs: $425K.** Sherpa Pros should pursue both in sequence, not in parallel — Catalyst closure data materially de-risks the InnovateMass application.

---

## 11. Eligibility Blocker — Phyrom Confirmation Required

**MA foreign-LLC registration for Sherpa Pros LLC** — confirm current state and initiate MA filing if not already done. ~$500 fee, 5–7 business days. Without this, the Catalyst application will be returned at intake.

Beyond MA registration, no other eligibility blockers identified. Sherpa Pros is squarely in Catalyst's target profile (≤4 FTE, working prototype, MA demonstration plan, climatetech alignment).

---

**End of draft. Phyrom: confirm MA registration, schedule a Catalyst pre-submission call, and submit at the next open review window.**
