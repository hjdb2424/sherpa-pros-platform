# Sherpa Pros — Investor Deck v1

**Audience:** Pre-seed / seed VCs (Built World tier 1), accelerators (Suffolk Technologies, Techstars ConstructionTech, Y Combinator), MA/NH non-dilutive grant reviewers, and Wefunder community-round investors.
**Length:** 10 slides. SCQA arc: Situation (2,3) → Complication (2) → Question (4) → Answer (5–10).
**Founder voice:** Phyrom, working New Hampshire general contractor (HJD Builders LLC). Plain talk. No marketing-speak.
**Date:** 2026-04-22

---

## Slide 1 — Hero / Founder Hook

**Title:** Built by a working contractor for the contractors he works with every day.

**Body:**
Hi, I'm Phyrom. I run HJD Builders, a licensed general contractor in New Hampshire. I built Sherpa Pros because the platforms my crew gets pitched every week — Angi, Thumbtack, TaskRabbit, Handy — sell us leads we can't afford and send homeowners to people who shouldn't be touching their wiring or their gas line.

So I built the tool I wished existed. **Jobs, not leads. Licensed only. Built by a contractor.**

**Suggested visual:**
Full-bleed photo of Phyrom on a real NH jobsite, tools in hand, no stock photo. Lower-third with three tags: `Licensed` · `Verified` · `Code-aware`. Sherpa Pros wordmark bottom-right.

**Presenter notes:**
Open as the founder, not the CEO. Do not put a logo first — put a person first. Pause after "Built by a contractor." Investors fund founders who lived the problem; this slide proves you did. Per spec §3.3, "founder story is the lead hook" — keep it on slide 1, line 1, of every deck.

---

## Slide 2 — Problem

**Title:** Lead-gen wastes contractors' money and fails homeowners on licensed work.

**Body:**
The platforms most homeowners try first are built on a broken model: contractors pay to bid, homeowners get matched to whoever paid the most, and licensed work gets handled by people who shouldn't be doing it.

- **Angi** — 41% of users report inconsistent service quality. Not rated by the BBB. Lead-share fatigue is so bad pros are publicly quitting. (per spec §2.2)
- **Thumbtack** — Reported deposit-theft losses of $300–$1,600 per incident. (per spec §2.2)
- **TaskRabbit** — 35% platform fee. Last-minute cancellations. Doesn't cover licensed trades at all. (per spec §2.2)
- **Handy** — Limited trade coverage. Zero code intelligence.

**And it's about to get worse.** Massachusetts has the **largest construction labor shortage in the nation**. 2.5% construction unemployment — lowest in 17+ years. Project completion times stretched from 7 to 11 months. (per spec §2.1) Carpenters, electricians, and roofers are the most acute shortages — and those are exactly the licensed trades the lead-gen platforms can't filter for.

**Suggested visual:**
Four-quadrant matrix: x-axis "Lead-gen ↔ Marketplace", y-axis "Unskilled ↔ Licensed". Angi, Thumbtack, TaskRabbit, Handy clustered in the bottom-left "lead-gen + unskilled" quadrant. The top-right "licensed + marketplace" quadrant is **empty** — labeled in big type: *"This is where we plant the flag."* (per spec §2.2)

**Presenter notes:**
Read the four bullets fast. Land hard on the empty quadrant. The four incumbents have a combined market cap of over $5B and they all share one structural blind spot — none of them can verify a license, validate a quote against code, or pull a permit. That's the gap.

---

## Slide 3 — Why Now

**Title:** Three tailwinds converging in 2026 — and the window is open right now.

**Body:**

1. **Mass Save heat-pump money is hitting the street.** $10K+ per-home rebates for licensed installers with EPA cert + electrical panel upgrades. (per spec §2.3) National platforms can't filter for "Mass Save certified." We can.

2. **30% of MA residential construction workers are 55+.** (vs. 26% nationally — per spec §2.1) The contractors retiring this decade are the ones homeowners trust. The replacement cohort needs a platform that delivers jobs, not pay-to-bid noise.

3. **AI is finally good enough to do the code work.** A code-aware quote validator that reads NEC, IRC, MA Electrical, and NH RSA in real time was a research paper in 2022. It's a working product on our platform today.

**Suggested visual:**
Three vertical timeline columns: "Rebate dollars activating" (Mass Save 2026), "Trades workforce aging out" (30% over 55), "AI code-validation viable" (2026). All three arrows converge on a single point labeled **"Sherpa Pros · 2026."**

**Presenter notes:**
Investors hear "why now" on every deck and almost no one earns it. We earn it because the rebate dollar (demand), the labor shortage (supply pressure), and the AI capability (product) all turned the corner in the same 12-month window. Miss this window and somebody else will fill the licensed-marketplace quadrant in 24 months.

---

## Slide 4 — Solution

**Title:** Jobs, not leads. Licensed only. Code-aware. Permit-aware. Rebate-aware.

**Body:**
Sherpa Pros is the licensed-trade marketplace that thinks like a contractor. (per spec §3.1)

Four things no lead-gen platform does, and none of them can copy without a structural rebuild:

- **Jobs, not leads.** Contractors get paid for completed work, not for the chance to bid. 5% take during beta, 10% at scale (per spec §5.2) — about half the all-in cost a contractor pays Angi today.
- **Licensed only.** License + insurance verified at onboarding. Re-checked on renewal. No "find a guy" matchmaking.
- **Code-aware quote validation.** Every quote is checked against NEC, IRC, MA Electrical, and NH state code (RSA) before the homeowner sees it. Catches missing line items, wrong materials, code violations.
- **Permit-aware and rebate-aware.** The platform knows which jobs need a permit, which qualify for Mass Save / National Grid / EV-charger rebates, and walks both sides through it.

**Suggested visual:**
Side-by-side comparison table. Left column "Lead-gen platforms" (red Xs on Licensed verified, Code-aware, Permit-aware, Rebate-aware, Jobs-not-leads). Right column "Sherpa Pros" (green checks on all five). Tagline below: *"The licensed-trade marketplace that thinks like a contractor."*

**Presenter notes:**
The internal name for the code engine is "Wiseman" — never say that word externally. Externally always say "code-aware quote validation" or "code intelligence layer." (per spec §3.3) The Wiseman layer is the moat — not licensable, not easy to clone — because it required a working GC + a 3-year codebase to build.

---

## Slide 5 — Product Demo

**Title:** Live platform. Real jobs flowing today.

**Body:**
Web at [sherpa-pros-platform.vercel.app](https://sherpa-pros-platform.vercel.app). Mobile via TestFlight (iOS) and PWA (Android). Built on Next.js 16, Stripe Connect for marketplace splits, Neon Postgres + PostGIS for location matching, Clerk for verified pro/client roles. (per CLAUDE.md tech stack)

**Three flows to walk through live:**

1. **Homeowner posts a job in 60 seconds.** Photo, address, scope. Dispatch matching surfaces 2–3 licensed pros within minutes.
2. **Pro receives a vetted job, not a lead.** Sees scope, location, code-validated estimate range, and one-tap accept. No bidding war.
3. **Code-aware quote validation runs in the background.** Catches missing electrical permit on a panel upgrade. Flags a quote that's $1,200 below code-compliant minimum on a heat-pump install. Homeowner sees a "code-checked" badge on the quote.

**Suggested visual:**
Three stacked mobile-frame screenshots from the live platform: (a) post-job wizard, (b) pro inbox with one accepted job + one declined, (c) homeowner-facing quote with the green "code-checked" badge. Bottom strip: tech-stack chips (Next.js · Stripe Connect · PostGIS · Clerk · Twilio).

**Presenter notes:**
**Capture three real screenshots from sherpa-pros-platform.vercel.app before the pitch — do not use mockups.** Live software is the single biggest credibility lever a pre-seed founder has. Walk the room through one job end-to-end in under 90 seconds. Reminder: the on-screen badge says **"Code-checked"** — never "Wiseman-checked." (per spec §3.3 + CLAUDE.md naming rule)

---

## Slide 6 — Market

**Title:** New England first. Boston specialty next. National specialty after that.

**Body:**

**Total Addressable Market (TAM):** US residential trades services — over $500B annually across the licensed categories Sherpa Pros covers (electrical, plumbing, HVAC, roofing, GC, specialty).

**Serviceable Addressable Market (SAM):** New England + NYC residential + light-commercial licensed trades — roughly $40–60B annually across our footprint.

**Serviceable Obtainable Market (SOM) — 18 months:**

- **Northern Triangle** (Portsmouth NH, Manchester NH, Portland ME) — full marketplace. (per spec §1)
- **Boston metro** — 5 specialty lanes only, to avoid the head-on lead-gen knife fight: Mass Save heat pumps, EV chargers, electrical panel upgrades, old-house specialists, triple-decker exteriors. (per spec §2.3)
- **NYC specialty beachhead** (months 14–18) — Old-House Verified for Brooklyn brownstones and Manhattan pre-war buildings only. (per spec §4.5)
- **PM tier** — property management chains as enterprise upside, $4 → $1.50 per unit per month. (per spec §3.2)

**Suggested visual:**
US map zoomed to the Northeast. NH/ME/MA highlighted in solid amber (Phase 1–2 — full marketplace). Boston has 5 specialty-lane pins overlaid (heat pump, EV, panel, old-house, triple-decker). RI/CT highlighted in lighter amber (Phase 3). NYC has a single "Old-House Verified" pin (Phase 3, specialty-only). Side panel: TAM $500B+ / SAM $40–60B / SOM-18mo $5M+ GMV.

**Presenter notes:**
Don't oversell the SOM number. Investors discount any SOM over 5% of SAM in 18 months. The honest play is: we go deep in the Northern Triangle where the founder lives, win specialty lanes in Boston that the incumbents structurally can't, and treat NYC as a beachhead — not a flag-plant.

---

## Slide 7 — Business Model

**Title:** Three revenue lines. Take rate is the floor. Subscription and PM tier are the ceiling.

**Body:**

| Revenue line | Beta pricing | Standard pricing | Why it works |
|---|---|---|---|
| **Marketplace take rate** | 5% of completed job | 10% of completed job (per spec §5.2) | Roughly half a contractor's all-in Angi cost. Tied to outcome, not bid clicks. |
| **Pro subscription** | $0 | **$49 / month** per pro (per spec §5.2) | Predictable recurring revenue. Funded by the value of vetted, code-checked jobs. |
| **Property Manager tier** | — | **$4 → $1.50 per unit per month** (per spec §3.2) | Recurring enterprise revenue. Multi-year contracts. NOI-impacting product. |

**Founding Pros** (the first 10–12 beta pros) keep 5% take **forever** — permanent recruiting hook and loyalty lock. (per spec §5.2)

**Unit economics back-of-the-envelope:** A typical beta pro doing $8K GMV per month at 5% take is $400 / month in revenue per pro. At standard pricing ($49 sub + 10% take on $8K GMV) that's $849 / month per pro. 200 pros at standard pricing is $2.0M ARR before the PM tier turns on.

**Suggested visual:**
Three-column revenue stack diagram. Bottom block (foundation): 10% take rate. Middle block: $49/mo Pro subscription. Top block: PM tier $4–$1.50/unit. Side annotation: "Founding Pros locked at 5% forever — moat against churn at price step-up."

**Presenter notes:**
Three revenue lines is the whole story. Investors love marketplaces with subscription floors and enterprise upside — that's NFX-shaped (network effects + recurring). Be ready for the question "why won't Angi just drop their take rate?" Answer: they can't, because their entire P&L runs on lead-share. We're a fundamentally different cost structure.

---

## Slide 8 — Traction

**Title:** Beta cohort live. Real GMV. Real NPS.

**Body:**

**Beta cohort (per spec §5.1):**
- `[X beta pros]` active across 9 trade categories, 3 states (NH, ME, MA)
- `[Y jobs]` posted in first 60 days
- `[$Z GMV]` transacted (Gross Merchandise Value)
- `[N%]` of jobs matched in under 2 hours
- Pro NPS: `[score]` · Client NPS: `[score]` (target >50, per spec §4.3)
- Code-aware quote validations run: `[count]` · code violations caught: `[count]`

**Cohort composition:**
NH/Seacoast — 2 GCs (HJD network), 2 handymen, 1 plumber, 1 HVAC / heat-pump specialist.
ME/Portland — 1 painter, 1 landscaper.
MA/Boston specialty — 1 licensed electrician (EV / panel / Mass Save cert), 1 old-house specialist (plaster / masonry / slate), 1 roofer.

**Pro testimonials:** `[quote 1 — beta pro, trade, metro]` · `[quote 2]` · `[quote 3]`

**Suggested visual:**
Six big-number tiles in a 2×3 grid (pros, jobs, GMV, match-time, NPS, code-violations-caught). One pull-quote from a beta pro, headshot + name + trade + metro. Map inset showing pin clusters in Portsmouth, Portland, and Boston.

**Presenter notes:**
**Drop in real numbers from the live Stripe Connect dashboard, the dispatch logs, and the weekly NPS survey before every pitch.** Date the slide. If GMV is small, lean on liquidity (match time, fill rate) and quality (NPS, code catches). Investors at this stage care about slope, not size — show 4 weeks of week-over-week growth if the absolute numbers are small.

---

## Slide 9 — Team + Advisors

**Title:** A working contractor as founder. Specialist hires lined up. Advisors slotted.

**Body:**

**Founder — Phyrom** (founder, HJD Builders LLC, NH)
12+ years as a working general contractor in New Hampshire. Built and operates a multi-project residential GC business. Lived the lead-gen problem from the buy side every day for a decade. Founder of Sherpa Pros and the broader BldSync platform that powers the code-aware layer.

**Phase 1 hires (post-first-close, per spec §4.3 + §7):**
- **Pro Success Manager** (covers NH/ME) — onboarding, retention, weekly pro check-ins
- **Client Concierge** (part-time, remote NE) — proactive homeowner support, dispute triage
- **Business Development** (NH/ME first, MA at Phase 2) — supply-house partnerships, NHHBA + MEHBA

**Advisor slots (open — actively recruiting):**
- Marketplace operator (NFX-shaped, two-sided platform veteran)
- New England trades veteran (NHHBA / MEHBA / MA AGC board member)
- Construction tech VC partner (Building Ventures, Brick & Mortar, Foundamental — warm intros open)
- Insurance / risk advisor (1099 vs W-2 worker classification, per spec §10 R5)

**Suggested visual:**
Three columns: Founder (Phyrom — headshot, one-line bio), Phase 1 Hires (3 boxes with role + start date), Advisors (4 slots — open, photo silhouettes).

**Presenter notes:**
Don't pretend the team is bigger than it is. A solo working-GC founder with a built product is a feature, not a bug, at pre-seed — it proves capital efficiency. The advisor slots being open is honest and creates a "where I need you" moment with the room. Per spec §10 R8, the burnout risk is named explicitly — show investors you've planned for it (60-hr cap, AI agent leverage, Upwork US offload).

---

## Slide 10 — Ask + Use of Funds + 90-Day Milestones

**Title:** Phase 0 exit gate. We trigger Phase 1 the moment any one of three doors opens.

**Body:**

**Ask:** **Phase 0 exit triggers on any one of these three** (per spec §4.2 + §12):
- $250K+ non-dilutive committed (MassCEC, NSF SBIR, MA SBTA, MassDev Biz-M-Power), **OR**
- $500K+ Wefunder + angel soft-circled, **OR**
- Tier-1 accelerator acceptance (Y Combinator, Techstars ConstructionTech, Suffolk Technologies, Building Ventures Studio)

**Use of funds — first $500K (Phase 1, months 3–6):**
- 1 Pro Success Manager (NH/ME) — `~$8K/mo loaded`
- 1 part-time Client Concierge (remote NE) — `~$3K/mo`
- Paid acquisition test (Meta + TikTok homeowner-targeted) — $5–8K/mo (per spec §4.3)
- Google Ads on Boston specialty keywords — $3–5K/mo
- Platform liability insurance, legal (1099 opinion, OpenSign templates, USPTO Old-House Verified filing) — `~$15K one-time`
- Phyrom salary (first paid month) + 60-hr/wk cap

**90-day milestones (Phase 0 exit-gate proof):**
1. Stripe Connect live; 10+ active beta pros transacting; first $25K+ GMV
2. Pitch deck + 1-pager + data room shipped to 50+ investors
3. First non-dilutive grant submitted (MassCEC Catalyst + NSF SBIR Phase I)
4. Wefunder community-round page live with $100K+ soft-committed
5. Suffolk Technologies + Techstars ConstructionTech + YC + Building Ventures conversations open

**Suggested visual:**
Three-door diagram (the three exit-gate triggers, each labeled with $ amount and source). Below: a single-row 90-day Gantt with the 5 milestones plotted on a 12-week timeline. Bottom-right CTA: **"Open the door that fits you. We close on the first one."**

**Presenter notes:**
Close on the founder, not the ask. Last line should be: *"I'm a working contractor. I've built the platform I wished existed. The first door that opens is the one we walk through. Help us pick the door."* Then leave a beat. Per spec §4.2, the parallel-track funding model is the differentiator — we are not betting the company on any one investor saying yes.

---

## Appendix (optional slides — not in main 10)

- **A1.** Wiseman code-intelligence architecture (technical deep-dive — "code-aware layer" externally) — for technical due diligence rooms
- **A2.** Risks & mitigations matrix (per spec §10) — for partner-meeting follow-up
- **A3.** 5-year financial model (TAM/SAM/SOM build) — for term-sheet conversations
- **A4.** Competitive analysis matrix (Angi / Thumbtack / TaskRabbit / Handy / Sherpa Pros) — for partner-meeting follow-up
- **A5.** Phase 0 → Phase 4 timeline + funding stack (per spec §4.1) — for board-prep / Series A roadmap

---

## Brand Guardian Pre-Send Checklist

Before this deck leaves the building:

- [ ] Slide 1 opens with Phyrom personally (founder story is the lead hook — per spec §3.3)
- [ ] No instance of the word "Wiseman" anywhere visible to the investor (internal name only — per spec §3.3 + CLAUDE.md)
- [ ] No instance of "gig," "task," "Uber for X," "AI-powered" as a headline, "disrupt," or "revolutionize" (per spec §3.3)
- [ ] Every abbreviation spelled out on first use: GMV (Gross Merchandise Value), NPS (Net Promoter Score), CAC, LTV, NHHBA, MEHBA, ARR, MRR (per spec §3.3 + §5.5)
- [ ] All traction-slide placeholders (`[X beta pros]`, `[$Y GMV]`, etc.) replaced with real numbers from Stripe + dispatch logs + NPS survey, dated to within 7 days of the pitch
- [ ] Three real screenshots captured from sherpa-pros-platform.vercel.app for slide 5 (no mockups)
- [ ] Tone reads at 8th-grade level — no corporate-speak, no jargon (per spec §3.3)
- [ ] Founder closing line on slide 10 lands as the contractor, not the CEO
