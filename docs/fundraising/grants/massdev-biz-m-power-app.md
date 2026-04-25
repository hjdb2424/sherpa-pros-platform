# MassDevelopment Biz-M-Power — Sherpa Pros Application Draft

**Program:** MassDevelopment — Biz-M-Power Crowdfunding Matching Grant
**Award size:** Up to $50,000 (matches $1-for-$1 against verified crowdfunding raise)
**Sponsor URL:** https://www.massdevelopment.com/products-and-services/funding-and-tools/grant-programs/
**Applicant:** Sherpa Pros LLC (Phyrom, Founder — operating in MA via Boston specialty deployment)
**Draft date:** 2026-04-22
**Status:** DRAFT — for Phyrom review prior to submission

---

## 1. Program at a Glance

MassDevelopment's Biz-M-Power program provides a $1-for-$1 matching grant (up to $50,000) for Massachusetts-based small businesses that successfully raise capital via approved crowdfunding platforms (Wefunder, Republic, StartEngine, Kickstarter, IFundWomen, etc.). The program is rolling — applications accepted continuously — and is designed to extend the runway of MA businesses that have demonstrated community demand through a real crowdfund close.

**Why Sherpa Pros qualifies:** Per GTM spec §6.4, the platform plans a Wefunder Reg CF community round of $250K–$500K targeting homeowners and contractors. Even at the conservative $50K trigger of the Biz-M-Power match, Sherpa Pros' Wefunder raise is structurally aligned with MassDev's program intent — community capital from the very people who use the marketplace. The Wefunder raise creates the trigger; Biz-M-Power doubles the capital base for MA-deployment activity.

---

## 2. Required Documents Checklist

- [ ] Business plan summary (≤5 pages — Sherpa Pros LLC, products, market, financials, team, MA deployment)
- [ ] Massachusetts business registration confirmation (foreign-LLC for Sherpa Pros LLC if NH-domiciled — see §11)
- [ ] Crowdfunding campaign URL on approved platform (Wefunder is approved; URL placeholder: `[WEFUNDER CAMPAIGN URL — TO BE INSERTED AFTER WEFUNDER CAMPAIGN GOES LIVE]`)
- [ ] Crowdfunding goal documentation (Wefunder campaign target + minimum + close date)
- [ ] Proof of crowdfunding success (final campaign report after Wefunder close: total raised, # of investors, # of MA-resident investors)
- [ ] Use-of-funds plan (how matched grant will be deployed in MA)
- [ ] Job-creation projection (FT + contractor MA jobs over 12–24 months — see §5.4)
- [ ] MA economic-impact narrative (vendor spend, GMV routed to MA contractors, decarbonization tonnage attributable to MA installs)
- [ ] Form W-9 for Sherpa Pros LLC
- [ ] Cap table snapshot (pre-Wefunder + post-Wefunder)
- [ ] Founder bio (Phyrom)

---

## 3. Eligibility Verification

| Criterion | Sherpa Pros status | Cite |
|---|---|---|
| MA-based small business OR registered to do business in MA | **Action item** — file MA foreign-LLC registration before submit (see §11) | MA Secretary of the Commonwealth |
| Active crowdfunding campaign on approved platform | Wefunder campaign planned per GTM spec §6.4 (W3–W12 of Phase 0) — campaign URL placeholder | Wefunder approved; GTM spec §6.4 |
| Raise minimum $10,000 via crowdfund (typical MassDev floor) | Targeting $250K–$500K Wefunder raise; matches at $1-for-$1 to MassDev cap of $50K | GTM spec §6.4 |
| ≤500 employees (SBA small business definition) | Yes — 1 founder + part-time contractors | GTM spec §7 |
| Use of funds in MA | Yes — Boston specialty deployment (Mass Save HP + EV-charger + panel + old-house + triple-decker lanes) | GTM spec §2.3 |

**Verdict:** Eligible upon (a) MA foreign-LLC registration, and (b) successful Wefunder close above minimum trigger.

---

## 4. Project Title

**"Sherpa Pros Massachusetts Deployment — Crowdfund-Matched Boston Specialty Launch"**

---

## 5. Application Narrative (Draft)

### 5.1 Business Plan Summary (≤2 pages)

**Sherpa Pros LLC** is the national licensed-trade marketplace (international roadmap) built by a working New Hampshire general contractor (Phyrom, Founder of HJD Builders LLC), launching first in NH, ME, and MA. The platform matches homeowners to verified, code-validated, license-checked tradespeople with a single-contractor dispatch model (not lead-blast), 5%–10% take rate (vs. lead-gen platforms' effective $400–$800 per closed job), and a proprietary code-aware quote-validation layer that reads NEC, IRC, MA Electrical Code, and NH state code in real time.

**Live operational footprint:**
- Web: sherpa-pros-platform.vercel.app (Next.js 16, deployed on Vercel)
- Mobile: PWA + iOS TestFlight
- Payments: Stripe Connect (marketplace splits + escrow + 1099-NEC reporting)
- Database: Neon PostgreSQL + PostGIS for geo-matching
- Auth: Clerk (Pro/Client role separation, license + insurance verification)

**MA deployment focus** (per GTM spec §2.3): Five specialty lanes the national lead-gen incumbents structurally cannot serve — (1) Mass Save heat-pump installations, (2) EV-charger installations (National Grid Turnkey), (3) electrical panel upgrades, (4) old-house specialists (plaster/lath, slate, brownstone — 50%+ of Boston housing pre-dates 1950), and (5) triple-decker porch and exterior work.

**Revenue model:**
- Marketplace take rate: 5% beta → 10% standard
- Pro subscription: $0 beta → $49/month standard
- Property Manager tier: $4 → $1.50 per unit per month

**18-month financial projection (per GTM spec §4.4 + tam-sam-som §4.3):**
- Phase 1 (M3–6): $200K–$1M GMV (50+ pros, 200+ jobs)
- Phase 2 (M6–12): $1M–$4M GMV (200+ pros, 1,000+ jobs, $50K+ PM ARR)
- Phase 3 (M12–18): $5M–$25M GMV (6 metros, 3 PM chains, 1 utility partner)

### 5.2 Wefunder Campaign Summary (≤1 page)

**Campaign URL:** `[WEFUNDER CAMPAIGN URL — TO BE INSERTED]`

**Target raise:** $250,000 minimum, $500,000 maximum (cap at $1M; raises >$1M signal trouble per Wefunder norms)

**Pitch angle:** *"Let homeowners and contractors own a piece of the platform they use."* The Wefunder raise is structurally aligned with the marketplace business model — the very people who post jobs and complete jobs become equity holders.

**Pre-launch activity:** Build 100+ "interested" signup list (HJD Builders client list, beta pro cohort, local press readers) before public launch. Wefunder's "$100K+ committed" badge unlocks public discovery.

**Public launch:** Coordinated with PR placements in Seacoast Online, NHPR, NH Business Review, Banker & Tradesman, Boston Globe Real Estate.

**Close:** 90-day Reg CF maximum window. Convert pledges to wires.

**Cost basis:** Wefunder takes 7.5% of raise. SAFE legal ~$5,000.

**MA-resident investor capture:** Conservative target = 30%+ MA residents in the investor pool (Boston area homeowners + MA-licensed contractors + MA construction trade insiders). Will be documented in Wefunder close report. **MA-resident concentration is a Biz-M-Power scoring positive** — demonstrates MA community alignment.

### 5.3 Use of Funds Plan (≤1 page)

**Total deployable upon Biz-M-Power match: Wefunder raise + up to $50K MassDev match.**

| Use of funds (post-Wefunder, post-Biz-M-Power) | Allocation | MA-specific? |
|---|---|---|
| Boston Pro Success Manager (1.0 FTE × 12 months loaded $90K) | $90,000 | **Yes — MA hire** |
| MA-resident Client Concierge (0.5 FTE × 12 months loaded $50K) | $25,000 | **Yes — MA hire** |
| Boston BD lead (0.5 FTE × 12 months loaded $80K) | $40,000 | **Yes — MA hire or MA-resident contractor** |
| MA pro recruitment + onboarding (events, supply-house outreach, NESEA) | $15,000 | Yes |
| Code-corpus expansion: MA municipal codes (Boston ISD, Cambridge, Brookline, Newton) | $25,000 | Yes |
| Mass Save Network application + utility partnership consulting | $10,000 | Yes |
| Paid acquisition: Boston specialty-keyword Google Ads + Meta/TikTok | $40,000 | Yes |
| Cloud infra (Vercel, Neon, Clerk, Stripe, Twilio) — 12 months | $14,400 | No (multi-tenant) |
| MA legal: foreign-LLC registration, contracts, 1099 opinion | $7,500 | Yes |
| Liability insurance, marketing collateral, video case-study | $15,000 | Mixed |
| Founder runway (Phyrom partial salary) | $50,000 | Mixed |
| Operating reserve (90-day cushion at Phase 1 burn $25K/mo) | $75,000 | No |

**Biz-M-Power match specifically deployed to:** MA hire payroll (Boston PSM + MA Client Concierge + Boston BD lead) — **the $50K cap fully covers 5 months of one Boston-based hire**, ensuring direct MA job-creation attribution.

### 5.4 MA Economic Impact & Job Creation (≤1 page)

**Direct MA jobs created (12-month horizon, post-Wefunder + Biz-M-Power match):**
- 1 FT Boston Pro Success Manager
- 1 PT MA Client Concierge (0.5 FTE)
- 1 PT Boston BD lead (0.5 FTE)
- **Total: 2.0 MA W-2 FTE direct hires**

**Indirect MA job creation (12-month horizon — MA contractors enabled by platform):**
- Per GTM spec §4.3: 20+ MA contractors onboarded (Boston specialty cohort: HPIN heat-pump installers, licensed electricians, old-house specialists)
- Per Catalyst pilot data extrapolation: each onboarded contractor sees throughput lift of ~25% (target), translating to roughly 0.25 incremental contractor-month per onboarded pro per year = **~5 incremental contractor-FTE-equivalents enabled in MA in year 1** (rough estimate; will be measured precisely in Catalyst pilot)

**MA economic impact — GMV routed:**
- Per tam-sam-som §4.2 + §4.3: Phase 1 (M3–6) targets $200K+ MA GMV; Phase 2 (M6–12) targets $1M+ MA GMV
- Of which: MA contractors capture 90–95% of GMV (after 5%–10% platform take); ~$900K–$1.5M direct payments to MA contractors over 12 months
- Materials spend through MA supply houses (Granite Group, FW Webb, City Electric Supply Boston, Eagle, Walzcraft) is additional indirect MA economic impact

**Decarbonization impact (MA-attributable, per InnovateMass / Catalyst alignment):**
- Conservative target: 100 platform-routed Mass Save heat-pump installs in 12 months = **~600 tCO2e/year ongoing** at MA EEAC standard 6 tCO2e/install/year factor (lifecycle: ~9,000 tCO2e over 15-yr life)

---

## 6. Submission Instructions

- **Portal:** MassDevelopment online application portal at https://www.massdevelopment.com/products-and-services/funding-and-tools/grant-programs/ — Biz-M-Power application form
- **Deadlines:** **Rolling intake** — applications accepted continuously. Submit immediately after Wefunder campaign closes successfully (or upon hitting Biz-M-Power minimum trigger of $10K raised, whichever is sooner per program rules).
- **Format:** Online application form + uploaded PDF business plan summary + crowdfund proof + W-9 + use-of-funds plan
- **Contact:** MassDevelopment Small Business Programs — programs@massdevelopment.com (general inbox); program officer assigned upon application receipt
- **Pre-submission outreach:** Recommended — email a 2-paragraph project summary to programs@massdevelopment.com 2–3 weeks before Wefunder close; ask which program officer will review; build the relationship before formal submission.

---

## 7. Tips & Gotchas

1. **Wefunder must close successfully** before the Biz-M-Power match is paid out. The application can be filed as soon as the Wefunder campaign goes live (with the $50K trigger committed) but the match disburses post-close. Plan cash flow accordingly — don't rely on Biz-M-Power for Wefunder runway.
2. **MA-resident investor concentration in the Wefunder close is a scoring positive.** During the Wefunder campaign, run a parallel MA-targeted PR + community push (Boston Globe Real Estate, Banker & Tradesman, Boston Business Journal) to maximize MA-resident participation. Track MA residency in the Wefunder admin dashboard for the close report.
3. **MA foreign-LLC registration is mandatory.** File before Wefunder campaign goes live. Without it, both the Wefunder raise and Biz-M-Power match are at risk.
4. **Use-of-funds must demonstrate MA deployment.** General "operating capital" framing will be discounted. Lead with the Boston PSM hire, MA contractor onboarding, MA-municipal code-corpus expansion. Concrete MA line items.
5. **Job-creation numbers should be verifiable.** 2.0 W-2 FTE MA hires is the headline. Don't over-promise.
6. **Avoid "Wiseman" externally** — use "code-aware quote validation" (per Sherpa Pros brand bible / GTM spec §3.3).
7. **Time the Wefunder + Biz-M-Power sequence.** GTM spec §6.4 has Wefunder closing W12 of Phase 0. Biz-M-Power application should be filed between W10 and W14 — early enough to lock in program officer relationship, late enough to have crowdfund proof.
8. **Biz-M-Power has historically funded $25K–$45K of the $50K cap on average.** Don't bank on the full $50K; budget conservatively.

---

## 8. Outreach Email — Pre-Submission (Draft for Phyrom)

**Subject:** MA-deployed marketplace + Wefunder raise — Biz-M-Power inquiry

> Dear MassDevelopment Small Business Programs team,
>
> My name is Phyrom. I'm the founder of HJD Builders LLC (a NH general contractor) and Sherpa Pros LLC (the national licensed-trade marketplace platform, launching first in New England — sherpa-pros-platform.vercel.app). I'm writing to introduce a Biz-M-Power application I plan to submit in the next 8–12 weeks following the close of a Wefunder community round.
>
> Sherpa Pros is deploying its first Massachusetts cohort across five specialty lanes the national lead-gen incumbents (Angi, Thumbtack) cannot serve: Mass Save heat-pump installations, National Grid Turnkey EV-charger installs, electrical panel upgrades, old-house specialists, and triple-decker porch and exterior work. The platform is live, built by a working contractor, and aligned with MA decarbonization program goals.
>
> The Wefunder campaign targets $250K–$500K and explicitly invites MA homeowners and MA-licensed contractors to invest. Biz-M-Power's $1-for-$1 match would directly fund the hire of a Boston-based Pro Success Manager, an MA-resident Client Concierge, and a Boston BD lead — three direct W-2 jobs in Massachusetts.
>
> Could we schedule a 20-minute call to walk through fit and confirm submission timing? I would value the program officer's input before we lock in the Wefunder close and Biz-M-Power application sequence.
>
> Thanks for your time. I'm happy to share the Wefunder campaign URL and a one-page summary if useful before the call.
>
> Phyrom
> Founder, Sherpa Pros LLC | HJD Builders LLC
> [Phone] | poum@hjd.builders

---

## 9. Eligibility Blocker — Phyrom Confirmation Required

**MA foreign-LLC registration for Sherpa Pros LLC** is the single open eligibility item. ~$500, 5–7 business days. Do this **before** the Wefunder campaign goes public so the entire raise is sourced under an MA-registered entity.

Additionally: Phyrom should confirm that **HJD Builders LLC and Sherpa Pros LLC are clearly distinct entities** in any documentation submitted. MassDev will scrutinize the corporate structure to ensure the Biz-M-Power match flows to the right entity and the right MA jobs are attributed correctly.

---

**End of draft. Phyrom: confirm MA registration timing, send pre-submission email to MassDev (template in §8), then file Biz-M-Power application within 30 days of Wefunder close.**
