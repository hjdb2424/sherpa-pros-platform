# Sherpa Pros — GTM & Fundraising Design Spec

**Date:** 2026-04-22
**Author:** Phyrom (via brainstorming with Claude)
**Status:** Approved — ready for implementation planning
**Next:** `superpowers:writing-plans` to break Phase 0 into an executable implementation plan

---

## 1. Executive Summary

Sherpa Pros is the licensed-trade marketplace for New England, built by a working general contractor (HJD Builders) to solve the two problems lead-gen platforms (Angi, Thumbtack, TaskRabbit, Handy) structurally cannot: **verified licensed work** and **code-aware matching**. The platform is already built — web, mobile, 8 APIs live, 37 service categories, Wiseman code intelligence, Dispatch Wiseman matching.

This document specifies the Go-To-Market plan to move from built product to funded, scaled business across five phases spanning 18+ months.

**Key constraint:** zero starting budget. The GTM plan is simultaneously the fundraising vehicle. Phase 0 (first 90 days) runs four parallel funding tracks while launching a live-transacting 10+ pro beta cohort, creating the traction artifacts that unlock Phase 1 execution capital.

**Primary markets:** Portsmouth NH, Manchester NH, Portland ME, Boston MA metro (four metros parallel). Boston enters with a specialty-only positioning (Mass Save heat pumps, EV chargers, electrical panel upgrades, old-house specialists, triple-decker exteriors) to avoid the knife fight against entrenched national lead-gen competitors.

**Positioning:** *"The licensed-trade marketplace that thinks like a contractor. Built by a working GC. Code-aware. Permit-aware. Rebate-aware."*

---

## 2. Market Context

### 2.1 Macro tailwind

Massachusetts has the **largest construction labor shortage in the nation**. 2.5% construction unemployment (lowest in 17+ years). 30% of MA residential construction workers are 55+ (vs. 26% nationally). Project completion times have extended from 7 to 11 months. Carpenters, electricians, and roofers are the most acute shortages.

This is demand-side pull, not a saturated market. Sherpa Pros is not fighting for share of a flat pie — it is meeting unmet demand.

### 2.2 Competitive landscape — the empty quadrant

Existing platforms cluster in the "unskilled + lead-gen (pay-to-play)" quadrant:

| Platform | Model | Weaknesses |
|---|---|---|
| Angi | Lead-gen | 41% service-quality inconsistency, BBB un-rated, lead-share fatigue |
| Thumbtack | Lead-gen | Deposit-theft complaints ($300–$1,600 reported losses) |
| TaskRabbit | Task-based | 35% in fees, last-minute cancellations, doesn't cover licensed trades |
| Handy | Subscription + task | Limited trade coverage, no code intelligence |

The **"licensed + code-aware + true marketplace"** quadrant is empty. Sherpa Pros plants the flag there.

### 2.3 Boston-specific underserved lanes (specialty focus)

National platforms cannot filter for:

1. **Mass Save heat-pump installations** — EPA cert + electrical panel upgrades + $10K+ per-home rebates
2. **EV charger installations** — licensed electrician + panel upgrade; Boston goal: 5-min walk to charger
3. **Electrical panel upgrades** — gateway trade for HP + EV + solar; massive backlog
4. **Old-house specialists** — plaster/lath (50%+ of Boston housing pre-1950), slate roofs, brownstone repointing, historic restoration
5. **Triple-decker porch + exterior** — Boston-specific code, ISD permits, liability-critical

Sherpa Pros wins these lanes because the Wiseman layer already validates NEC, IRC, MA Electrical, NH RSA, and permits — and the Dispatch Wiseman matches on license, cert, and skill.

---

## 3. Positioning & Brand Narrative

### 3.1 Hero message

> *The licensed-trade marketplace that thinks like a contractor.*
> *Built by a working GC. Code-aware. Permit-aware. Rebate-aware.*

### 3.2 Audience-specific sub-positioning

| Audience | Message | Proof |
|---|---|---|
| NH/ME homeowners | *"Trusted neighbor pros. Real people, verified work, no leads-for-sale."* | License verified, insurance verified, code-checked quotes, real reviews |
| Boston homeowners | *"Licensed specialty work. Mass Save certified. Code-aware. Permit-aware. Angi can't filter for this."* | Mass Save Network badge, Old-House Verified badge, permit-assist workflow |
| Contractors | *"Jobs. Not leads. Get paid for work, not for paying to bid."* | 5% take (half Angi's effective cost), instant Stripe, QBO sync, Wisetack, Zinc, Uber Connect |
| Property Managers | *"Work orders, preferred vendors, unit-level finance in one platform. Stop juggling 40 contractors in spreadsheets."* | PM tier, CapEx/OpEx, NOI impact, vendor scorecard, $4/unit → $1.50/unit |

### 3.3 Voice & principles

**Tone:** plainspoken, direct, tradesperson-friendly, dry, zero marketing-speak. 8th-grade reading level.

**We always say:** Licensed · Verified · Code-aware · Built by a contractor · Local / Neighbor · Jobs, not leads

**We never say:** "Wiseman" externally · Gig / Task · "Uber for X" externally · "AI-powered" as the headline · Disrupt / Revolutionize · Jargon abbreviations (CO, SOV, AR — always spell out)

**Founder story is the lead hook.** A working NH GC built the platform he wished existed. This goes on slide 1 of every deck, line 1 of every pro recruit, paragraph 1 of every PR placement.

---

## 4. Phased GTM Execution

### 4.1 Timeline overview

| Phase | Months | Budget | Burn | Focus |
|---|---|---|---|---|
| Phase 0 | 0–3 | ~$0 in / $3–5K out | Minimal | Fundraise + 10-pro beta |
| Phase 1 | 3–6 | $250–500K first close | $25–35K/mo | Lean launch (Northern Triangle + Boston specialty) |
| Phase 2 | 6–12 | $750K–1.5M Seed | $60–80K/mo | Scaled 4-metro launch |
| Phase 3 | 12–18 | $3–7M Series A | $150–200K/mo | Regional expansion (RI, CT, NYC specialty) **— HARD 6-MO BOUND** |
| Phase 4 | 18+ | $15M+ Series B | Dependent on raise size | National scale / strategic exit |

### 4.2 Phase 0 — Fundraise & Prove (Months 0–3)

**Entry:** Today. Platform is built. Phyrom + HJD network + AI agents.

**Goals (all five in parallel):**
1. Beta cohort: 10+ active pros, real GMV flowing
2. Pitch deck + investor one-pager + data room ready
3. First non-dilutive grant submitted (MassCEC InnovateMass + NSF SBIR)
4. 5+ VC conversations active (Building Ventures first warm intro)
5. Wefunder community-round page live (signal-gathering $100K+ soft-commit)

**Critical activities:**

- **W1–2:** Stripe Connect live (Sherpa Pros LLC), Apple Dev paid, TODO-MVP data-scoping fixes shipped, OpenSign beta agreement templated, platform liability insurance purchased (~$800/yr)
- **W2–6:** Recruit and onboard 10 beta pros (HJD network → cold supply-house outreach)
- **W2–8:** Pitch deck via Executive Summary Generator; Brand Guardian review
- **W3–12:** Grant applications submitted; VC warm intros; YC rolling + Techstars ConstructionTech + Suffolk Technologies applications
- **W4–12:** Wefunder page + Phyrom LinkedIn founder-thread campaign ("Jobs. Not leads.")
- **W4:** Old-House Verified USPTO trademark filing (~$275)
- **W4:** Written legal opinion on 1099 vs W-2 worker classification

**Staffing:** Phyrom (all-in, 60-hr/wk cap) · 1 Upwork US SDR / pro recruiter (~15 hr/wk) · 1 Upwork US deck/content (~10 hr/wk) · AI agents (Executive Summary Generator, marketing-growth-hacker, marketing-content-creator, product-trend-researcher, data-analytics-reporter, Brand Guardian)

**Channels:** LinkedIn founder voice (Phyrom), direct pro recruiting calls, NH/ME supply-house flyers (Lowe's Pro, Rockler, FW Webb), NHHBA + MEHBA intros, Mass Save Network application

**Exit gate (any one triggers Phase 1):**
- $250K+ non-dilutive committed, **OR**
- $500K+ Wefunder + angel soft-circled, **OR**
- Tier-1 accelerator acceptance (YC / Techstars / Suffolk Technologies / Building Ventures Studio)

### 4.3 Phase 1 — Lean Launch (Months 3–6)

**Entry:** First close signed. Beta cohort converts to founding paying customers (beta pricing grandfathered forever).

**Goals:**
1. 50+ active pros across Northern Triangle (Portsmouth + Manchester + Portland)
2. Boston specialty lanes proven: 20+ completed jobs in the 5 lanes
3. 1 commercial PM anchor signed (Goal D from original brief)
4. 500+ homeowner accounts
5. Seed round teed up by Month 5

**Hires:** 1 Pro Success Mgr (covers NH/ME) · 1 part-time Client Concierge (remote NE) · Phyrom = Ops Lead + BD

**Marketing channels:**
- Paid social: Meta + TikTok @ $5–8K/mo, homeowner-targeted
- Google Ads on Boston specialty keywords (Mass Save installer, EV charger, plaster repair Boston)
- Local PR: Seacoast Online, NHPR, Boston Globe Real Estate, Portland Press Herald
- Podcast sponsorships: NH Business Review, The Contractor Fight
- Trade shows: JLC Live New England (March), NH Home & Garden Show
- Partnerships: Mass Save referenced installer listing, National Grid Turnkey, NHHBA

**Metrics gates (for Seed raise):** 50+ pros · 200+ jobs · $200K+ GMV · 1 PM anchor · NPS >50 · <2hr match time · pro retention >80%

### 4.4 Phase 2 — Scaled Launch (Months 6–12)

**Entry:** Seed closed. 4-metro parallel execution.

**Goals:**
1. 200+ active pros across all 4 metros
2. 1,000+ completed jobs, $1M+ annualized GMV
3. 3+ commercial PM anchors, recurring revenue floor
4. 5,000+ homeowner accounts
5. Series A conversations opened Month 10–11

**Hires:** 4 Pro Success Managers (1/metro) · 3 Client Concierges · 2 BD reps (NH/ME + MA) · 1 senior Ops Lead · Phyrom → CEO

**Marketing channels:**
- Full paid channel spend: $30–50K/mo, CAC-monitored
- Old-House Verified badge launched publicly, press blitz
- Mass Save co-branded landing page formalized
- TechCrunch / NH Biz Review / Boston Globe founder profile pieces
- TikTok founder series ("A GC Builds a Platform") + ProTok pro-creator program
- Referral loops live: pro→pro, client→client, both→PM

**Metric gates (for Series A):** 200+ pros · $1M+ GMV · >80% pro retention · <$150 client CAC · PM anchor ARR >$50K · take rate stable at 10%

### 4.5 Phase 3 — Regional Expansion (Months 12–18, hard 6-month bound)

**Entry:** Series A closed. 4-metro NE base profitable on unit economics.

**6-month goals (concrete, measurable):**
1. +2 metros in 60-day launches each: Providence RI (M13–14), Hartford CT (M15–16) using proven Northern Triangle playbook
2. NYC specialty-only beachhead: Old-House Verified Brooklyn brownstones + Manhattan pre-war buildings (M14–18). No general marketplace — specialty lanes only.
3. 1 utility white-label live: co-branded landing with Eversource MA/CT or National Grid NY (M14–17)
4. 3 PM chain anchors signed: regional property mgmt firms (1,000+ unit portfolios)
5. $5M+ annualized GMV across full footprint by M18
6. Series B prep complete: data room refreshed, lead investor identified by M17

**Hires:** +2 Pro Success Mgrs (RI + CT) · +1 NYC specialty BD · +1 Enterprise/PM Chain AE · +1 Partnerships Lead (utilities) · +1 VP Marketing · CFO/Controller

**Metric gates (for Series B):** 6 metros active · $5M+ GMV · 3 PM chains · 1 utility partner · 80%+ pro retention · take rate 12–15%

### 4.6 Phase 4 — National Scale (Months 18+)

- **Geographic:** Philly · DC · SF Bay Area · Chicago (specialty lanes first; full marketplace if metro economics support)
- **Enterprise:** National PM chains (Greystar HQ), insurance partnerships (Travelers Home Repair Network), NAHB national
- **Product:** White-label SaaS for utilities / state energy programs nationwide; Wiseman API as separate revenue line
- **Exit options:** Strategic acquisition (Home Depot / Lowe's / insurance carrier) or path to IPO

---

## 5. Beta Cohort & Finance Model

### 5.1 Cohort composition (10–12 pros)

**NH / Seacoast (6–7 pros):** 2 GCs (HJD network), 2 handymen (volume/liquidity), 1 plumber, 1 HVAC / heat-pump specialist

**ME / Portland (1–2 pros):** 1 painter, 1 landscaper

**MA / Boston specialty (2–3 pros):** 1 licensed electrician (EV / panel / Mass Save cert), 1 old-house specialist (plaster / masonry / slate), 1 roofer

### 5.2 Finance model (Option D — beta-discounted hybrid)

**Beta pricing (90-day beta):** $0 subscription + **5% take rate** on completed jobs

**Standard pricing (post-beta):** $49/mo subscription + **10% take rate**

**Founding Pros:** Beta cohort grandfathered at 5% take forever (if they stay) — permanent recruiting hook and loyalty lock.

### 5.3 Beta agreement terms

**Pro gets:** Full platform access · live finance model (Stripe payouts, QBO sync, Wisetack, Zinc, Uber Connect) · "Founding Pro" badge (permanent) · half-price forever · direct line to Phyrom · marketing exposure

**Pro commits to:** 90-day beta minimum · real work only · weekly 10-min feedback · 1 video testimonial + logo rights · <24hr response to client inquiries · verified license + insurance uploaded

### 5.4 Tech gates before beta opens

- [ ] Real Stripe Connect live (Sherpa Pros LLC account — 48hr)
- [ ] 1099-NEC reporting for pros >$600/yr
- [ ] QBO sync validated with real bank
- [ ] Commission engine takes 5% on job completion
- [ ] Beta Terms + Pro Service Agreement (OpenSign)
- [ ] Data-scoping fixes from `docs/TODO-MVP-FIXES.md`
- [ ] Apple Developer $99/yr paid (48hr) — TestFlight distribution
- [ ] Platform liability insurance (~$800/yr)

### 5.5 Traction metrics for pitch deck

- **Supply:** 10+ active pros (9 trades, 3 states)
- **Demand:** 30+ jobs posted in 60 days
- **Liquidity:** % jobs matched <2hr, avg bids per job
- **GMV (Gross Merchandise Value):** Total job value transacted
- **Take-rate capture:** 5% × GMV (beta rate)
- **NPS (Net Promoter Score):** Pro + Client (weekly survey)
- **Wiseman usage:** quote validations, code checks, scope approvals

**Glossary of abbreviations used in this spec:** GMV = Gross Merchandise Value · CAC = Customer Acquisition Cost · LTV = Lifetime Value · NPS = Net Promoter Score · MRR = Monthly Recurring Revenue · ARR = Annual Recurring Revenue · ASO = App Store Optimization · TAM/SAM/SOM = Total/Serviceable/Obtainable Addressable Market · CVC = Corporate Venture Capital · RBF = Revenue-Based Financing · Reg CF = Regulation Crowdfunding · SAFE = Simple Agreement for Future Equity · NHHBA/MEHBA = NH/ME Home Builders Associations · NAHB = National Association of Home Builders · NYCHA = NYC Housing Authority · DCAS = NYC Department of Citywide Administrative Services · SBTA = Small Business Technical Assistance · ISD = Boston Inspectional Services Department · PM = Property Manager · PSM = Pro Success Manager · BD = Business Development · AE = Account Executive

---

## 6. Fundraising Strategy — Four Parallel Tracks

Run all four concurrently. Whichever closes first triggers Phase 1. No serial dependency. Tracks reinforce each other (e.g., Wefunder soft-commit list becomes a trust signal in VC pitches).

### 6.1 Track A — Non-dilutive

| Program | Amount | Cycle | Fit |
|---|---|---|---|
| MassCEC InnovateMass | up to $350K | Spring/Fall | Heat-pump/EV climate tech framing |
| MassCEC Catalyst | up to $75K | Spring/Fall | ≤4 FTE early-stage prototype |
| NSF SBIR Phase I | up to $305K | Rolling (6-mo cycle) | Wiseman as AI/ML research commercialization |
| MA START Grant | $100K → $500K R3 | SBIR-linked | Stacks with NSF SBIR |
| MassDev Biz-M-Power | up to $50K | Rolling | ⭐ Matches Wefunder crowdfund |
| MA SBTA Program | up to $150K | Via nonprofit partner | Technical assistance grants |
| NH Innovation Voucher | up to $15K | Rolling | NH-based platform creating NH jobs |
| NH BFA microloan | Varies | Rolling | Easy submission |

**Max Phase 0 non-dilutive stack confirmed:** $525K ($250K Wefunder + $50K MassDev match + $75K MassCEC Catalyst + $150K MA SBTA)

**Stretch pipeline:** $1.18M (adding $305K NSF SBIR + $350K MassCEC InnovateMass)

### 6.2 Track B — Accelerators

| Program | Check | Equity | Fit |
|---|---|---|---|
| ⭐ Suffolk Technologies (Boston) | — | — | **Bullseye.** 8-wk accelerator + VC arm. Built environment. Suffolk Construction mentors. |
| ⭐ Techstars ConstructionTech | $220K | 5% | Vertical-specific. Enterprise pilots gated via network. |
| MassChallenge | up to $1M cash prize | 0% | No-brainer apply. Zero-equity. |
| Greentown Labs (Somerville) | — | Membership | Climate tech fit. Prototyping facilities. |
| The Engine (MIT) | — | Varies | Tough tech — Wiseman as deep tech angle |
| Techstars Boston | $220K | 5% | General; includes built environment |
| Y Combinator | $500K | 7% | Best brand, cheap to apply |
| 500 Global | $150K | 6% | Marketplace-friendly, Oct '26 – Feb '27 |
| Cemex Ventures Leaplab | — | Co-financed pilot | Real construction validation |
| ⭐ MetaProp (Columbia, NYC) | up to $250K | 22-wk | **NYC Phase 3 beachhead vehicle.** Apply M9–11. |

### 6.3 Track C — Pre-seed / Seed VCs

**Tier 1 — warm-intro priorities (Built World):**
- ⭐ **Building Ventures** (Boston) — first call
- Brick & Mortar Ventures (avg seed $3.94M)
- Foundamental (pre-seed/seed/A, 50%+ follow-on reserves)
- Zacua Ventures
- Schematic Ventures
- Nine Four Ventures

**Tier 2 — marketplace + general pre-seed:**
- NFX (marketplace network-effects authors)
- Version One Ventures
- Hustle Fund
- Pear VC
- Forum Ventures
- Precursor Ventures

**Tier 3 — strategic / corporate CVC (longer cycle, bigger checks):**
- Eversource Ventures (utility CVC — Mass Save fit)
- National Grid Partners (utility CVC — EV / heat-pump fit)
- Home Depot Ventures / Lowe's Ventures (materials / Zinc integration)
- Travelers Ventures (insurance angle — verified pros reduce claims)

**Tier 0 — NE-local angels (lowest friction):**
- HJD Builders high-net-worth clients and GC network
- NHHBA / MEHBA board members
- Boston angels via AngelList syndicate scout

### 6.4 Track D — Wefunder Reg CF community round

- **Why Wefunder:** $109M total platform volume in 2025, 5× Republic. Best for community/local-brand pitch. SAFE-based, simple legal.
- **Target raise:** $250–500K (cap at $1M — raises >$1M signal trouble)
- **Pitch angle:** *"Let homeowners and contractors own a piece of the platform they use."* Authentic — aligns with marketplace model.
- **Pre-launch (W3–6):** Build 100+ "interested" signup list (HJD clients, beta pros, local press readers). Soft commitment via Wefunder's "$100K+ committed" badge unlocks public launch.
- **Launch (W7–8):** Public push with PR (Seacoast Online, NHPR, NHBR, Banker & Tradesman, Boston Globe Real Estate).
- **Close (W12):** 90-day Reg CF max. Convert pledges to wires.
- **Cost:** Wefunder takes 7.5%. SAFE legal ~$5K.

### 6.5 NYC programs (Phase 2/3 transition, apply M9–11)

- ⭐ **MetaProp Accelerator** (Columbia, 22-week, up to $250K)
- ⭐ **NYCEDC Proptech Piloting Program** — NYCHA + DCAS pilots (175,000+ apartments — potential NYC beachhead vehicle)
- NYCEDC Founder Fellowship 2026
- Techstars NYC
- ERA (Entrepreneurs Roundtable)
- START-UP NY (10-year tax-free if near NY university)
- NY Empire State Innovation Matching Grants (matches SBIR)

### 6.6 90-day fundraising calendar

| Week | Non-dilutive | Accelerator | VC | Crowdfund |
|---|---|---|---|---|
| 1–2 | SBA / NH BFA intros | YC app draft | 50-firm list + warm-intro map | Wefunder FAQ |
| 3–4 | MassCEC Catalyst draft; NSF SBIR outline | ⭐ Suffolk Tech + Techstars CT + MassChallenge + YC submit | ⭐ Building Ventures warm intro | Wefunder page + legal |
| 5–6 | NSF SBIR full; NH Innovation Voucher | 500 Global; Cemex Leaplab; Greentown Labs inquiry | First 5 VC meetings | Soft-launch (signal) |
| 6–8 | **MassDev Biz-M-Power app (parallel with Wefunder)** | — | — | — |
| 7–8 | MassCEC submit (next round) | YC interviews if invited | Pitch tour (10–15 firms) | Public launch + PR |
| 9–10 | SBIR submission | Decision cycles | Term sheet conversations | Drive to $100K |
| 11–12 | Award decisions begin (3–6 mo cycle) | Accept/decline | First-close target | Reg CF close |

### 6.7 Pitch materials checklist

**Must have by W4:**
- 10-slide investor deck (Executive Summary Generator)
- 1-page summary (Brand Guardian-reviewed)
- 3-min demo video (loom of live platform)
- Founder bio + photo + headshot
- Data room (Notion / DocSend) — cap table, financials, traction

**Nice to have by W8:**
- Deep-dive technical doc (Wiseman architecture)
- 3 beta pro video testimonials
- Competitive analysis matrix
- 5-year financial model (TAM / SAM / SOM)
- Live-metrics dashboard link

---

## 7. Staffing Model

**Phase 0 (Months 0–3):** Phyrom (60-hr/wk cap) + 2 Upwork US-based contractors (SDR + deck/content) + AI agents (see Section 9). ~$3–5K/mo out-of-pocket billable.

**Phase 1 (Months 3–6):** Hire 1 Pro Success Manager (covers NH/ME) + 1 part-time Client Concierge (remote NE). Phyrom = Ops Lead + BD.

**Phase 2 (Months 6–12):** Scale to FULL sizing — 4 Pro Success Managers (1/metro) + 3 Client Concierges + 2 BD reps + 1 Ops Lead. Phyrom → CEO.

**Phase 3 (Months 12–18):** +2 PSMs (RI, CT) + 1 NYC specialty BD + 1 Enterprise AE + 1 Partnerships Lead + 1 VP Marketing + CFO/Controller.

**Staffing platforms:**
- **Phase 0:** Upwork Pro ("US only" filter), Fiverr Pro
- **Phase 1 transition:** Belay (US VAs, 1.5% acceptance), SalesRoads / Upcall (outsourced sales)
- **Phase 2+:** FT hires, Boldly / Time Etc for fractional EA support

**"Local" definition:** US-based, native English speakers. Local accent / cultural rapport matters for Pro Success Manager role (metro-assigned). Remote OK for Client Concierge, BD, Ops.

**AI does the expertise, humans do the relationships.** Wiseman handles code validation, scope generation, pricing intelligence, matching, rebate lookups. Humans handle phone calls, trust-building, dispute mediation, trade-show presence.

---

## 8. Marketing Channels by Phase

### Phase 0
- Phyrom LinkedIn founder-thread campaign ("Jobs. Not leads.")
- Direct pro recruiting calls (HJD network → cold)
- Supply-house flyers (Lowe's Pro, Rockler, FW Webb)
- NHHBA + MEHBA introductions
- Mass Save Network application

### Phase 1
- Paid social test: Meta + TikTok @ $5–8K/mo, homeowner-targeted
- Google Ads: Boston specialty keywords
- Local PR: Seacoast Online, NHPR, Boston Globe Real Estate, Portland Press Herald
- Podcast sponsorships: NH Business Review, The Contractor Fight
- Trade shows: JLC Live New England, NH Home & Garden Show
- Partnerships: Mass Save, National Grid Turnkey

### Phase 2
- Full paid channel spend: $30–50K/mo
- Old-House Verified badge launch + press blitz
- Mass Save co-branded landing page
- TechCrunch / NH Biz Review / Boston Globe founder profiles
- TikTok founder series + ProTok pro-creator program
- Two-sided referral loops (pro→pro, client→client, both→PM)

### Phase 3+
- Utility co-branded campaigns (Eversource, National Grid)
- PM chain industry events (NAA, IREM)
- NYC specialty-only targeted (Brooklyn brownstone forums, pre-war building listings)

---

## 9. Agent Deployment Plan (Post-Spec, Parallelized)

### Wave 1 — Pitch + Research (Week 1, parallel)
- **Executive Summary Generator** → 10-slide investor deck + 1-pager (SCQA + Pyramid Principle)
- **product-trend-researcher** → competitive deep-dive + TAM / SAM / SOM sizing
- **data-analytics-reporter** → investor metrics dashboard design

### Wave 2 — Marketing & Content (Week 2, parallel)
- **marketing-content-creator** → landing page copy (homeowner + pro variants), pro-recruiting email sequences, content calendar
- **marketing-social-media-strategist** → Phyrom LinkedIn 90-day editorial, B2B outreach playbook
- **Brand Guardian** → brand voice + visual consistency audit across deck + landing + app

### Wave 3 — Growth & Conversion (Week 3, parallel)
- **marketing-growth-hacker** → two-sided referral mechanics, viral loops, conversion funnel
- **App Store Optimizer** → App Store + Play Store ASO for Sherpa Pros listing

### Wave 4 — Phase 1/2 Channels (Month 3+)
- **marketing-instagram-curator** → visual portfolio storytelling, before/after content
- **marketing-tiktok-strategist** → Phyrom founder series + ProTok
- **marketing-reddit-community-builder** → r/HomeImprovement, r/Boston, r/Plumbing engagement
- **marketing-twitter-engager** → real-time founder engagement during fundraise

---

## 10. Risks & Mitigations

| # | Risk | Phase | Severity | Early signal | Mitigation |
|---|---|---|---|---|---|
| R1 | Beta pros sign up but don't transact | 0 | High | <1 job per pro per 30 days | Phyrom drives demand from HJD client list; free promo video per beta pro |
| R2 | Stripe Connect KYC delays >48hr | 0 | High | No approval by W1 | Backup rails: Tilled / Bridgepay; Mercury for banking |
| R3 | All Phase 0 funding tracks slow / fail | 0/1 | Critical | No closes by W14 | Revenue-based financing (Pipe / Capchase) once $5K MRR; Phyrom bridges from HJD for 60 more days |
| R4 | Mass Save Network application rejected | 1 | Medium | Declined or stalled >90 days | Eversource Ventures intro instead; National Grid Turnkey as alt |
| R5 | 1099 vs W-2 worker classification challenge | All | High | Cease & desist from MA AG / NH DOL | Pros are independently licensed contractors w/ own insurance — defensible. Legal opinion W4. |
| R6 | Pro fraud or dispute spike (insurance event) | All | High | >2% job dispute rate | Platform liability insurance (~$800/yr); 4.5★ floor; 7-day Stripe hold |
| R7 | Angi / Thumbtack copy specialty positioning | 2/3 | Medium | Competitor "licensed only" or "Mass Save certified" launch | Wiseman code intelligence is the moat — not licensable. Fast USPTO on Old-House Verified. Exclusive utility partnerships. |
| R8 | Phyrom burnout (single-point-of-failure) | 0/1 | Critical | Missed weekly milestones | 60-hr/wk hard cap; Upwork US offloads 30% lowest-leverage; AI agents draft deck/research |
| R9 | Beta → paying conversion drop at M4 | 1 | Medium | >30% pro churn at price step-up | Founding Pros keep 5% forever (promised); new pros enter at 10%; half-price grandfathering = recruiting hook |
| R10 | 4-metro execution complexity | 2 | Medium | 2 of 4 metros <50% of plan at M9 | Concentrate on top 2 performing metros; reduce paid spend on laggers; don't force a metro that isn't taking |

---

## 11. Critical-Path Dependencies (Phase 0)

1. **Stripe Connect live (48hr)** → unlocks finance model → unlocks beta cohort → unlocks GMV metric → unlocks investor proof
2. **Apple Dev account (48hr)** → unlocks TestFlight → unlocks mobile beta delivery
3. **Beta cohort 10+ pros (W2–6)** → unlocks GMV proof → unlocks Wefunder credibility + VC pitch traction slide
4. **Pitch deck v1 (W4)** → unlocks VC warm intros → unlocks term sheets
5. **Wefunder soft-commit list (W3–6)** → unlocks public Wefunder launch (W7) → unlocks community-round close
6. **First close (W12)** → unlocks Phase 1 hires → unlocks public launch

---

## 12. Success Metrics & Phase Gates

### Phase 0 exit gate (any one triggers Phase 1)
- $250K+ non-dilutive committed, OR
- $500K+ Wefunder + angel soft-circled, OR
- Tier-1 accelerator acceptance (YC / Techstars / Suffolk Technologies / Building Ventures Studio)

### Phase 1 exit gate (for Seed raise)
- 50+ pros · 200+ jobs · $200K+ GMV · 1 PM anchor · NPS >50 · <2hr match time · pro retention >80%

### Phase 2 exit gate (for Series A)
- 200+ pros · $1M+ GMV · >80% pro retention · <$150 client CAC · PM anchor ARR >$50K · take rate stable at 10%

### Phase 3 exit gate (for Series B)
- 6 metros active · $5M+ GMV · 3 PM chains · 1 utility partner · 80%+ pro retention · take rate 12–15%

---

## 13. Immediate Next Steps

1. Self-review this spec (Claude) for placeholders, contradictions, scope, ambiguity
2. Phyrom reviews the spec file — approves or requests revisions
3. Invoke `superpowers:writing-plans` → break Phase 0 into an executable implementation plan with concrete weekly tasks and owners
4. Deploy Wave 1 agents in parallel (Executive Summary + product-trend-researcher + data-analytics-reporter)
5. Track Phase 0 execution via TaskCreate / TaskUpdate; weekly review

---

## Appendix A — Referenced Sources

**Market / competitive:**
- [MA largest construction worker shortage — WBJournal](https://wbjournal.com/article/help-needed-massachusetts-has-the-largest-construction-worker-shortage-in-the-nation/)
- [Boston construction labor shortage worsens — Bisnow](https://www.bisnow.com/boston/news/construction-development/as-bostons-construction-labor-shortage-persists-firms-look-to-new-solutions-126075)
- [TaskRabbit alternatives & complaints — CheckThat.ai](https://checkthat.ai/brands/taskrabbit/alternatives)
- [Angi/Thumbtack lead-gen comparison 2026 — Adapt Digital](https://adaptdigitalsolutions.com/articles/homeadvisor-vs-angieslist-vs-houzz-vs-porch-vs-thumbtack-vs-yelp-vs-bark/)
- [Mass Save 2026 heat pump rebates — Endless Energy](https://goendlessenergy.com/blog/mass-save-program/mass-save-2026-heat-pump-incentives/)
- [National Grid Turnkey EV Charging Installation Program](https://www.nationalgridus.com/electric-vehicle-hub/Programs/Massachusetts/EV-Charging-Upgrade-Program)
- [Pre-1950 Boston lath-and-plaster prevalence](https://www.boston-smart-plastering.com/post/water-damage)

**Funding (non-dilutive):**
- [MassCEC Catalyst](https://www.masscec.com/program/catalyst-and-dices)
- [MassCEC InnovateMass](https://www.masscec.com/program/innovatemass)
- [MassDevelopment Biz-M-Power](https://www.massdevelopment.com/products-and-services/funding-and-tools/grant-programs/)
- [MA SBTA Program](https://www.empoweringsmallbusiness.org/sbta)
- [MA START Grant](https://www.mass.gov/info-details/eoed-programs-and-grants-business-and-innovation)

**Funding (accelerators):**
- [Suffolk Technologies](https://www.suffolktechnologies.com/)
- [MassChallenge](https://masschallenge.org/)
- [Greentown Labs](https://greentownlabs.com/)
- [Techstars Boston](https://www.techstars.com/accelerators/boston)
- [Techstars NYC](https://www.techstars.com/accelerators/nyc)
- [MetaProp Accelerator (Columbia)](https://www.metaprop.com/accelerator)

**Funding (VCs):**
- [Building Ventures](https://www.buildingventures.com/)
- [Brick & Mortar Ventures](https://brickmortar.vc/)
- [Foundamental](https://www.foundamental.com/)
- [Proptech / Construction VC list 2026 — OpenVC](https://www.openvc.app/investor-lists/construction-investors)

**Funding (crowdfunding):**
- [Wefunder vs StartEngine vs Republic 2025](https://sharkponds.com/wefunder-vs-republic-vs-startengine-2025-ultimate-comparison/)
- [2025 Crowdfunding Annual Report — Kingscrowd](https://kingscrowd.com/2025-investment-crowdfunding-annual-report/)

**Funding (NYC):**
- [NYCEDC Proptech Piloting Program](https://edc.nyc/program/proptech)
- [NYCEDC Founder Fellowship 2026](https://edc.nyc/founder-fellowship)
- [START-UP NY](https://esd.ny.gov/startup-ny-program)

**Staffing:**
- [Top VA companies 2026 — Boldly](https://boldly.com/blog/the-best-virtual-assistant-companies-in-the-us-ranked/)
- [SalesRoads / CIENCE / MarketStar comparison](https://salesbread.com/outsourced-sdr/)
