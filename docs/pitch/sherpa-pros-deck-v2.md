---
marp: true
theme: sherpa-pros-editorial
paginate: true
title: Sherpa Pros — Series A Investor Deck v2
date: 2026-04-26
status: draft-v2
owner: Phyrom (founder)
audience: Tier-1 Series A construction-tech investors (Suffolk Technologies growth, a16z American Dynamism, Bessemer, Brick & Mortar Ventures, MetaProp, Building Ventures)
target_close: M12 (Series A) — opening conversations now
target_raise_usd: 8M-15M (target $12M)
target_post_money_usd: 40M-80M (target $60M)
references:
  - docs/pitch/sherpa-pros-deck-v1.md
  - docs/strategy/phase-4-extensions/01-series-c-pitch-deck-design.md
  - docs/superpowers/specs/2026-04-26-ai-ml-roadmap-design.md
  - docs/operations/sherpa-product-portfolio.md
brand:
  primary: "#00A9E0"
  accent:  "#FF4500"
  paper:   "#FBF7EE"
  serif:   "Fraunces"
  sans:    "Manrope"
  mono:    "JetBrains Mono"
---

<!-- _class: cover -->

# The licensed-trade marketplace that thinks like a contractor.

## Built by a working GC. Code-aware. Permit-aware. Rebate-aware.

**Sherpa Pros · Series A · 2026**

*thesherpapros.com*

<!-- Visual: Full-bleed photograph of Phyrom on a real NH jobsite. Lower-third tags: Licensed · Verified · Code-aware. Sky-blue diagonal seam motif bottom-edge. Wordmark in Fraunces, lower-right. -->

---

# Slide 2 — The contractor problem

## Pros juggle five-plus apps to run one job.

Every licensed contractor in America wakes up to the same stack: Angi for leads, QuickBooks for invoicing, a paper notebook for codes, a phone-tree for materials, group texts for scheduling, and a separate app for the homeowner. Nothing talks to anything.

- **Lead-gen tax.** Angi, Thumbtack, Networx, HomeAdvisor charge $40-$120 per lead, no job guarantee. Pros report 12-18% conversion. That's a $300-$700 cost-per-job tax before they swing a hammer.
- **No code intelligence.** None of the labor platforms validate quotes against NEC, IRC, MA Electrical, or NH RSA. Pros eat callbacks and re-permits on their own time.
- **Materials are a phone call.** Distributor pricing is opaque, lead times unknowable, and same-day delivery is a 50/50 lottery.
- **Multi-trade jobs are coordination chaos.** A panel upgrade + heat pump + service entry needs an electrician, an HVAC tech, and a permit clerk. Today that's three text threads and two no-shows.

Phyrom built Sherpa Pros after living that exact stack for ten years on real New Hampshire jobsites.

<!-- Visual: Horizontal stack of five greyed-out app icons (Angi, QuickBooks, paper, phone, text bubble) with red friction lines between each. Below: single Sherpa Pros tile in sky blue, replacing the row. -->

---

# Slide 3 — The homeowner and distributor problem

## Clients can't find verified pros. Distributors are blind to project pipeline.

**The homeowner side.** 41% of Angi users report inconsistent service quality. Thumbtack has documented deposit-theft losses of $300-$1,600 per incident. TaskRabbit charges 35% and refuses licensed trades. The category leaders all share one structural blind spot: **none can verify a license, validate a quote, or pull a permit.**

**The distributor side.** FW Webb, Grainger, Ferguson, and Home Depot Pro sell ~$120B/year of construction materials in the US — and they have zero forward visibility into which projects are actually breaking ground next week. They guess at inventory, they over-stock, and they lose 6-9% of revenue to mis-fulfilled same-day requests. Distributors are funding a whole layer of waste because the labor market is invisible to them.

We close that loop. **One platform makes the labor verifiable to homeowners and the project pipeline visible to distributors.** That's the wedge that re-prices the whole stack.

<!-- Visual: Three-circle Venn — Homeowners (left, "can't find verified pros"), Pros (center, "drowning in apps"), Distributors (right, "blind to demand"). Sherpa Pros sits in the overlap, sky-blue solid. -->

---

# Slide 4 — Why now

## Four tailwinds converging in 2026.

1. **Post-COVID labor shortage is structural, not cyclical.** MA construction unemployment is 2.5% — lowest in 17 years. 30% of MA residential construction workers are 55+. The retiring cohort is the trusted cohort. The replacements need a platform.
2. **Materials inflation has rewired distribution.** Lumber, copper, electrical, and HVAC components are up 38-72% since 2020. Distributors have consolidated (FW Webb acquiring Hilco, Ferguson absorbing regional plumbing supply). Whoever owns the labor-to-materials handoff captures the new margin.
3. **Vertical-marketplace Stripe Connect proof.** Toast for restaurants, ServiceTitan for HVAC, Faire for retail wholesale — every vertical with $100B+ in fragmented payment flow has produced a $5B+ outcome. The trade economy is the largest unclaimed vertical and it's $1.27T blended TAM.
4. **AI is finally code-literate.** A code-aware quote validator that reads NEC, IRC, MA Electrical, and NH RSA in real time was a research paper in 2022. It runs on our platform today.

**The window is open right now.** Miss it and someone else fills the licensed-marketplace quadrant inside 24 months.

<!-- Visual: Four vertical timeline columns converging on a single point labeled "Sherpa Pros · 2026." -->

---

# Slide 5 — The platform, in one map

## 14 brand surfaces. One contractor-built operating system.

**Six products** for end-users:
1. **Sherpa Marketplace** — jobs, not leads, licensed-only matching.
2. **Sherpa Hub** — physical co-located storefront at FW Webb (Phase 1 wedge).
3. **Sherpa Materials** — Sherpa Materials engine + Zinc API + Uber Direct same-day delivery.
4. **Sherpa Mobile** — pro-side iOS/Android/PWA. Job intake, time-tracking, code lookup, on-the-truck checkout.
5. **Sherpa Home** — homeowner-facing client portal for project tracking, permits, rebates.
6. **Sherpa Threads** — masked Twilio messaging that becomes a project record.

**Eight platform capabilities** powering the products:
1. **Code Intelligence Layer** (NEC, IRC, MA Electrical, NH RSA real-time).
2. **Sherpa Dispatch engine** (7-factor pro-to-job matching, multi-trade timeline coordination).
3. **Materials Orchestration Engine** (Zinc + Uber Direct + distributor APIs).
4. **Payments + Payment Protection** (Stripe Connect, marketplace splits, dispute resolution).
5. **Identity + License Verification** (Clerk + state license API integrations).
6. **Permit + Rebate Engine** (Mass Save, National Grid, EV charger, federal IRA hooks).
7. **Multi-Trade Scheduling Graph** (coordinates 2-5 trades across one project).
8. **AI/ML Trust + Pricing Layer** (per Phase 4 AI/ML roadmap).

<!-- Visual: 14-tile grid (6 products top row, 8 capabilities below) — each tile sky-blue with orange-red icon. -->

---

# Slide 6 — How a job actually flows

## Post → match → quote → validate → schedule → deliver materials → execute → pay.

Watch one real job move through the platform in eight steps:

1. Homeowner posts a panel upgrade in Sherpa Home (3-minute intake).
2. Sherpa Dispatch scores the job against 47 active licensed electricians in 22 miles. Top 3 surface within 90 seconds.
3. The first responder quotes from a phone — line items auto-populate from Sherpa Materials.
4. Code Intelligence Layer validates the quote against NEC 2023 + MA Electrical Amendment in 1.4 seconds. Two missing items flagged. Pro accepts the auto-fix.
5. Multi-Trade Scheduler holds an inspector slot via Permit Engine.
6. Sherpa Materials routes the panel + breakers + service entry kit via Uber Direct, ETA 2 hours, billed at distributor cost + Hub fee.
7. Pro executes. Twilio Threads keeps homeowner updated, masked phone numbers.
8. Stripe Connect splits the labor commission, the materials margin, the Hub fee, and the platform take. All four parties paid in <60 seconds of completion sign-off.

Eight steps. One platform. The pro never leaves the app. The homeowner never wonders. The distributor sees the ticket before it's a phone call.

<!-- Visual: Horizontal flow diagram, 8 nodes connected by sky-blue arrows, key node ("Code Intelligence Layer") highlighted in orange-red. -->

---

# Slide 7 — Vertical-integration thesis

## $1.27T blended TAM. 18-25% take rate. The Stripe Connect moment for the trade economy.

The category we are *not* in: pure-labor lead-gen platforms like Angi. They've hit a structural 10-15% take-rate ceiling — homeowners and pros revolt above that line. That's why Angi's market cap is stuck and ServiceTitan went public at a software multiple, not a marketplace one.

The category we *are* in: **vertically-integrated trade infrastructure.** We span four revenue rails on every job:

| Revenue rail | Comp set | Take per job |
|---|---|---|
| **Labor commission** | Angi, Thumbtack | 5-10% |
| **Materials margin** | FW Webb, Grainger, Ferguson | 4-7% net (after distributor cost) |
| **Same-day delivery fee** | Uber Direct, DoorDash Drive | 2-4% |
| **Software/SaaS subscription** (Pro tier) | Procore, ServiceTitan, JobNimbus | 4-6% effective |

**Blended take rate: 18-25% per job.** Without a single revenue lane crossing the revolt threshold.

**TAM math.** US residential + light-commercial construction services = $590B/year. Materials = $410B. Same-day-delivery layer = $180B. Trade SaaS = $90B. Blended TAM = **$1.27T.** Even at 1% penetration that's a $12.7B revenue ceiling — at the take rates above.

This is the Stripe Connect moment for the trade economy: payment + identity + workflow + delivery rails, sold as one platform, with the founder credibility to sign the partnerships nobody else can.

<!-- Visual: Stacked horizontal bar — four revenue rails colored sky-blue, orange-red, paper, navy. Total bar labeled "18-25%." Comp-set logos above each rail, greyscale. -->

---

# Slide 8 — Live platform demo (pro side)

## Sherpa Mobile — the operating system on the truck.

Three screenshots, three real workflows:

1. **Pro dashboard.** Active jobs, today's schedule, materials orders in transit, code lookups in last 24h, earnings YTD. One screen — no app-switching.
2. **Job intake to quote.** Pro arrives, scans the panel with Sherpa Smart Scan, line items populate, code validation runs in 1.4s, quote signs from the phone.
3. **On-truck materials checkout.** Out of 2/0 copper mid-job. Pro taps "reorder," materials engine routes via Hub or Uber Direct, ETA pinned to job calendar. Billed at distributor cost + transparent fee.

Live now at **thesherpapros.com**. iOS via TestFlight, Android via PWA. Built on Next.js 16 + Stripe Connect + Neon Postgres + PostGIS + Clerk.

<!-- Visual: Three iPhone-frame screenshots side-by-side. Each labeled with the workflow name in Fraunces caption. -->

---

# Slide 9 — Live platform demo (client + distributor side)

## Sherpa Home + Sherpa Hub — the other two seats at the table.

**Sherpa Home (homeowner).** Project posted, pros bidding, code-validated quote in plain English, permit-aware scheduling, rebate eligibility surfaced (Mass Save / National Grid / IRA), real-time job tracking like an Uber ride.

**Sherpa Hub (distributor).** First Hub co-located inside FW Webb Portsmouth, MA. Dashboard shows: 47 jobs in flight within 22 miles, 12 of them needing materials in next 48h, projected order volume by SKU. **The distributor sees the project pipeline for the first time in their history.** Sherpa Hub closes the materials loop and gives FW Webb a paid forecasting layer they have never had access to before.

<!-- Visual: Split screen — left = Sherpa Home iPhone screenshot of a homeowner tracking a heat-pump install. Right = Sherpa Hub desktop dashboard at FW Webb Portsmouth, with map of active jobs and forward inventory pull-list. -->

---

# Slide 10 — Traction

## Real signals from the beta cohort.

- **Beta cohort.** 50+ active pros across the Northern Triangle (Portsmouth, Manchester, Portland-ME). 500+ homeowner accounts. NPS 71 from founding pros (per Phase 0 metrics).
- **Wefunder community round** — closing $250K, validates founder narrative + early-believer pro network.
- **NH-region pro signups** — month-over-month signup growth tracking 25-35% off a small base. Materials engine seeded with 237 pre-priced items from migration 005 (real telemetry, not pro-forma).
- **First Hub LOI** — FW Webb Portsmouth has signed a non-binding LOI for Hub #1 co-location. (Phase 1 wedge.)
- **First commercial PM anchor** — one MA-based commercial GC has signed pilot terms for the multi-trade dispatch product (NDA in data room).
- **Code Intelligence telemetry** — Code Intelligence Layer has run 1,200+ live quote validations across the beta cohort. Avg latency 1.4s. Avg flagged issues per quote: 1.7. Pro acceptance rate of auto-fixes: 78%.

We are not pre-product. We are pre-Series-A with a working product, a paid pilot, a signed Hub LOI, and a beta cohort that wants to grow.

<!-- Visual: Four KPI tiles in sky-blue, with orange-red sparklines. -->

---

# Slide 11 — Hub model + FW Webb partnership

## The Phase 1 wedge. Co-located, not built from scratch.

**The thesis:** the fastest way to capture the materials margin is to plug into a distributor that already has $4B in regional revenue and 100+ retail locations — not to build a warehouse from zero.

**FW Webb Portsmouth (Hub #1, Phase 1).**
- Co-located inside the existing FW Webb branch.
- Sherpa Pros pros use FW Webb as their materials origin. Sherpa Materials engine routes orders. Uber Direct delivers same-day. FW Webb gets paid distributor margin + a forecasting layer it has never had.
- Sherpa Pros gets: a physical brand presence, a credentialing point ("if you're at the Hub, you're verified"), and an embedded sales relationship with every pro that walks through that door.

**The expansion path.**
- Hub #2-#10 — FW Webb co-located across NH/MA/ME/RI/CT (Phase 2-3).
- Hub #11+ — franchise model, brand-licensed to operators (Phase 4).
- Hub network at Phase 4 = 60+ locations across US + Canada Year 1.

**Why FW Webb said yes.** Phyrom is a working GC with a 10-year purchase history at FW Webb Portsmouth. The first conversation was at the contractor counter. Distributors fund what their best customers ask them to fund.

<!-- Visual: Map of New England with Hub #1 starred in sky-blue at Portsmouth. Faint outlines of Hub #2-#10 candidate locations greyed. Right side: FW Webb logo, Sherpa Pros logo, sky-blue handshake glyph. -->

---

# Slide 12 — AI/ML moat

## Code-literate, dispatch-intelligent, pricing-aware. The compound advantage.

> Once Sherpa's flywheel turns, three proprietary data assets compound into a moat no marketplace incumbent can replicate: real job-outcome data tied to licensed pros, materials-demand telemetry from every Hub-fulfilled order, and codes-and-permit history surfaced by Sherpa's code-engine lookups. Together they unlock three durable capabilities Angi, Thumbtack, and Procore structurally cannot match — better dispatch (probability of completion, not just acceptance), predictive supply (pre-staged inventory at the Hub), and codes-aware estimation (cite-back to jurisdiction-specific precedent). AI/ML is not the wedge. It is the moat that compounds after the wedge wins.

Full roadmap in `docs/superpowers/specs/2026-04-26-ai-ml-roadmap-design.md` — five pillars, three data assets, build-vs-buy disposition, 36-month hiring + cost ramp.

<!-- Visual: Layered diagram — three data-asset rings (job outcomes / materials demand / codes & permits) feeding three capability rings (dispatch ML / predictive materials / codes RAG) feeding one moat ring labeled "Compound advantage: data + code + GC credibility." -->

---

# Slide 13 — Unit economics

## Beta finance model + Phase 1 take rate.

| Metric | Beta (today) | Phase 1 (M3-6) | Phase 2 (M6-12, Series A deploy) |
|---|---|---|---|
| Avg job size (GMV) | $4,200 | $4,800 | $5,400 |
| Take rate (blended, 4-rail) | 12% | 18% | 21% |
| Net revenue per job | $504 | $864 | $1,134 |
| Gross margin (post-Stripe + Twilio) | 78% | 81% | 83% |
| Pro acquisition cost (CAC) | $42 | $85 | $140 |
| Pro lifetime value (LTV, 24-mo) | $1,800 | $4,400 | $7,200 |
| LTV/CAC | 43x | 52x | 51x |
| Payback period | 2.1 mo | 1.4 mo | 1.6 mo |

**Beta take rate is intentionally low (12%, labor-only).** Phase 1 ramps to 18% as Sherpa Materials goes live. Phase 2 hits 21% as Sherpa Hub fees and SaaS-tier subscriptions activate. **Take-rate ceiling per the vertical-integration thesis: 25%.**

LTV/CAC > 50x is real. It is also explicitly the "small-cohort beta" number — at scale we model 10-15x, which is still 3x the marketplace median.

<!-- Visual: Three-column small-multiples chart, one per phase. Each column shows GMV → Take → Net rev → LTV/CAC. Sky-blue bars, orange-red callouts. -->

---

# Slide 14 — The four-phase arc

## One brand. Four phases. Expanding footprint.

- **Phase 0 — Pre-seed (now → M3).** Wefunder $250K, beta cohort 50+ pros, FW Webb Hub #1 LOI signed, Series A conversations open.
- **Phase 1 — Lean Launch (M3-6).** Series A closed (this raise). Northern Triangle live. Hub #1 operational. 50→200 pros. $1M GMV run-rate.
- **Phase 2 — Scaled Launch (M6-12).** 4 metros in parallel. 200→500 pros. $5M GMV run-rate. Multi-trade dispatch live. First commercial PM anchor.
- **Phase 3 — Regional (M12-18).** Series B prep. +2 metros (Providence, Hartford). NYC specialty beachhead. First utility white-label (Eversource).
- **Phase 4 — National + International + Franchise (M18+).** Series B closed. Canada Y1 → UK Y2 → Australia Y3. Franchise model live. SOC 2 Type 2 by M30. Series C path.

**Series A target close: M12. Series B target: M18-24.** v2 of this deck lives in that gap.

<!-- Visual: 5-column horizontal arc (Phase 0 + Phase 1-4). Each column gets months on top, milestone in middle, GMV/pro count/metro count at bottom. -->

---

# Slide 15 — Competitive landscape

## Three categories. We span all three. Nobody else does.

| | Trust + License | Workflow + Code | Materials + Delivery | Verdict |
|---|---|---|---|---|
| **Angi / Thumbtack / Networx** | partial | none | none | Lead-gen tax. 10-15% take ceiling. |
| **Procore / ServiceTitan / BuilderTrend** | high | high (workflow only, not code) | none | Enterprise SaaS. No marketplace. |
| **FW Webb / Grainger / Home Depot Pro** | none | none | high | Materials only. No labor. |
| **Sherpa Pros** | high | high (incl. code) | high | **Only player spanning all three.** |

The reason no one has done this is the founder profile: it requires a working GC with a 10-year distributor relationship and a 3-year codebase. Phyrom is the rare intersection. That's the moat at the human level — before you even get to the AI/ML moat.

<!-- Visual: 4-row matrix table with green checks / red X. Sherpa Pros row highlighted sky-blue. -->

---

# Slide 16 — Team

## Founder-led. Builder credibility. Advisor bench in formation.

**Phyrom — Founder & CEO.**
- Working New Hampshire general contractor. Owner-operator of HJD Builders LLC.
- 10 years of jobsite, distributor, and permit-office experience in MA + NH.
- Architect of Sherpa Pros and the BldSync construction-intelligence platform (Code, Assembly, Architect, Pricing, Checklist, Dispatch).
- Sole technical + product lead through Phase 0. Series A enables the first 6-8 hires.

**Advisors — bench in formation.** [ADVISOR-LIST-TO-FILL]

**First six Series-A hires (planned).**
- VP Engineering (Hub + materials orchestration).
- Head of Pro Growth (NH/MA expansion).
- Head of Distributor Partnerships (FW Webb plus second-distributor open).
- Senior Full-Stack (Sherpa Mobile + PWA).
- Senior ML Engineer (Code Intelligence + Dispatch).
- Operations Lead (Hub #1 → Hub #2-3 ramp).

<!-- Visual: Phyrom headshot + bio block. Empty advisor card row below — three placeholder tiles in paper-white with sky-blue dashed borders, labeled "Advisor 1 · 2 · 3 — to be filled." -->

---

# Slide 17 — Financial projections (Y1-Y3)

## Phase 1 → Phase 2 → Phase 3, derived from Item 19 economics.

| | Y1 (Phase 1, M3-12) | Y2 (Phase 2-3, M12-24) | Y3 (Phase 3 close, M24-36) |
|---|---|---|---|
| Active pros | 200 | 800 | 2,400 |
| Active homeowners | 5,000 | 18,000 | 52,000 |
| Metros live | 1-2 | 4 | 6 |
| GMV (run-rate) | $5M | $24M | $80M |
| Take rate (blended) | 18% | 21% | 23% |
| Net revenue | $900K | $5.0M | $18.4M |
| Hub Y2 revenue (Item 19 Mid case) | — | $1.05M | $3.2M |
| Hub Y2 EBITDA | — | 21% | 24% |
| Cash-flow positive | — | M14-22 | sustained |
| Headcount | 8 | 24 | 56 |

**Item 19 Mid-case Hub economics (existing, validated):** Hub Y2 $1.05M revenue, 21% EBITDA, cash-flow-positive M14-22. We are running 6 Hubs by end of Y3, which is the inflection that triggers Series B.

<!-- Visual: Three-column financial table in tabular numerals (Fraunces caps, JetBrains Mono numerals). Sky-blue header row. Hub Y2 line highlighted orange-red. -->

---

# Slide 18 — The path to $50M ARR

## One slide. One model. Series A → Series B → Series C trigger.

- **End of Y1 (M12).** $5M GMV run-rate · $900K net revenue · 1-2 metros · 200 pros. **Series B prep window opens.**
- **End of Y2 (M24).** $24M GMV run-rate · $5M net revenue · 4 metros · 800 pros. **Series B target close: $20-40M at $150-250M post.**
- **End of Y3 (M36).** $80M GMV run-rate · $18M net revenue · 6 metros · 2,400 pros · Hub network of 6 · Canada Y1 cohort live. **Series C trigger ($50M ARR run-rate, see Series C deck §OKR-7).**

This deck (v2) is the document that gets us from "working product + beta + LOI" to **$12M Series A at a $60M post-money** — and unlocks the Phase 1 → Phase 2 → Phase 3 march.

<!-- Visual: Single-line ARR ramp chart Y1 → Y3, with Series A / Series B / Series C trigger markers. -->

---

<!-- _class: todo -->
<!-- USER-DECIDE: Slide 19 — Use of funds. Total raise $X (target $12M). Allocation %s. Reference ranges below. -->

# Slide 19 — Use of funds

## How the Series A gets deployed across 18-24 months.

**TODO — Phyrom to fill before any external delivery.**

| Bucket | Reference range (2025 construction-tech Series A) | [USER-FILL: % allocation] | $ amount @ $12M |
|---|---|---|---|
| Hub buildout (Hub #1 ops + Hub #2-3 ramp) | 25-35% | [USER-FILL: %] | [USER-FILL: $] |
| Engineering (platform + AI/ML + mobile) | 30-40% | [USER-FILL: %] | [USER-FILL: $] |
| GTM (pro acquisition + distributor partnerships + marketing) | 15-25% | [USER-FILL: %] | [USER-FILL: $] |
| Working capital (materials float + payroll runway) | 10-15% | [USER-FILL: %] | [USER-FILL: $] |
| Reserve (risk buffer + opportunistic) | 5-10% | [USER-FILL: %] | [USER-FILL: $] |
| **Total** | **100%** | **[USER-FILL]** | **$12M** |

*Reference ranges are 2025 construction-tech Series A medians. Final allocation reflects Phyrom's judgment on Hub buildout pace vs engineering velocity.*

<!-- Visual: Donut chart placeholder. Slices labeled with USER-FILL %. Sky-blue / orange-red / paper / navy / slate slice colors. -->

---

<!-- _class: todo -->
<!-- USER-DECIDE: Slide 20 — Cap table sketch. Pre-money + post-Series-A. -->

# Slide 20 — Cap table sketch

## Pre-money → post-Series-A.

**TODO — Phyrom to fill before any external delivery.**

| Stakeholder | Pre-money % | Post-Series-A % |
|---|---|---|
| Founder (Phyrom) | [USER-FILL: founder %] | [USER-FILL: founder %] |
| Employee option pool (post-money 12-15% target) | [USER-FILL: pool %] | [USER-FILL: pool %] |
| Prior investors (Wefunder + angels) | [USER-FILL: prior investor %] | [USER-FILL: prior investor %] |
| Series A lead + syndicate | — | [USER-FILL: Series A target %, range 18-25%] |
| **Total** | **100%** | **100%** |

*2025 construction-tech Series A reference: 18-25% dilution at $40-80M post, 12-15% post-money option pool, founder typically retains 55-70% post-Series-A.*

<!-- Visual: Two donut charts side-by-side, pre / post. -->

---

<!-- _class: todo -->
<!-- USER-DECIDE: Slide 21 — Series A ask. Target raise + valuation + runway. -->

# Slide 21 — Series A ask

## What we're raising. What it buys.

**TODO — Phyrom to fill before any external delivery.**

- **Target raise:** [USER-FILL: target raise $X, reference range $8M-$15M, suggested $12M]
- **Target post-money:** [USER-FILL: valuation cap $Y, reference range $40M-$80M, suggested $60M]
- **Target dilution:** [USER-FILL: 18-25%]
- **Runway purchased:** [USER-FILL: months Z, reference range 18-24 months]
- **Lead investor target:** Tier-1 construction tech (Suffolk Tech growth, Brick & Mortar Ventures, MetaProp, Building Ventures) or American Dynamism (a16z, Founders Fund Frontier, 8VC).
- **Strategic check candidates:** FW Webb Strategic, Home Depot Ventures, Lowe's Strategic Investments, Procore Ventures (defensive).
- **Close window target:** M12 (open conversations now).

**The math investors should hold in their head:** $12M deployed across 18-24 months gets us from beta → 4 metros → Series B-ready at $24M GMV run-rate. That's the cleanest construction-tech Series A arc in the market right now.

<!-- Visual: Single block of large Fraunces type — "$12M · $60M post · 18-24 mo runway" — flanked by sky-blue ask-and-deliverable columns. -->

---

# Slide 22 — Series B forward-look (Phase 4 vision)

## The platform compounds. Series A is the wedge.

By M24-30 we will have:
- 6+ metros live · 800-2,400 pros · $24-80M GMV run-rate.
- 6+ Hubs operational across US + Canada Y1.
- Sherpa Materials engine processing $1M+/month gross run-rate.
- AI/ML moat compounding on 50,000+ live quote validations and 10,000+ multi-trade dispatch events.
- First franchise Hub signed (Phase 4 trigger).

That's the Series B story: $20-40M raise at $150-250M post, fueling Phase 4 national + international.

For the long-arc Series C narrative — $40-80M raise at $400-800M post, $50M+ ARR trigger, Stripe-Connect-of-trade-economy positioning — see [Series C Pitch Deck Design](docs/strategy/phase-4-extensions/01-series-c-pitch-deck-design.md).

<!-- Visual: 4-step staircase chart. Pre-seed → Series A → Series B → Series C. Each step labeled with raise / valuation / trigger. Sky-blue rising line. -->

---

# Slide 23 — The international + franchise expansion

## Why this is a $400M+ post-money company by Series C.

- **Canada Y1 (M18-24).** Toronto cohort. Same regulatory model as MA/NY (provincial licensing, code-validatable).
- **UK Y2.** London + Manchester. Trade licensing structure maps to ours (Gas Safe, NICEIC, Part P).
- **Australia Y3.** Sydney + Melbourne. State-licensed trades. Same brand, same product.
- **EU pilot Y4-5.** Germany or Netherlands.
- **Franchise model live M30+.** Hub #11 onward. Brand licensed to vetted operators. Sherpa Pros captures franchise fee + ongoing royalty + materials-engine revenue share. Capital-light expansion at international scale.

The international play is *not* speculative — it's the same regulatory pattern (state/provincial licensing + trade codes) we already solve for in MA and NH. The platform's code intelligence layer ports per-region with content updates, not architecture rewrites.

<!-- Visual: World map, sky-blue dots on US (live), Canada (Y1), UK (Y2), Australia (Y3), EU (Y4-5). Franchise icons after Hub #11. -->

---

# Slide 24 — Risks + mitigations

## What can break this — and how we've already de-risked it.

| Risk | Mitigation |
|---|---|
| **Two-sided marketplace cold-start.** | Pre-seeded with 50+ founding pros + 500+ homeowner accounts. Founding-pro pricing grandfathered forever — high retention. |
| **Distributor concentration (FW Webb).** | Hub #1 with FW Webb. Hub #2 already in conversation with second distributor. Sherpa Materials engine is distributor-agnostic by design. |
| **Regulatory exposure** (multi-state licensing, payments handling, payment protection). | Stripe Connect handles payments compliance. License verification API per-state. Legal counsel engaged Phase 1. SOC 2 Type 2 by M30. |
| **Code intelligence accuracy.** | Code Intelligence Layer audited per-state by licensed inspectors. Auto-fix is opt-in, never silent. Pro retains liability — we are decision-support, not the licensed signer. |
| **AI/ML talent + cost.** | First Series-A hire is a senior ML engineer. Inference cost modeled per-job, included in unit economics (Slide 13). |
| **Macro: housing slowdown.** | Materials + multi-trade dispatch + utility white-label de-correlate revenue from new-construction housing starts. Mass Save / IRA / EV-charger rebate flow grows in any housing cycle. |

<!-- Visual: 6-row risk matrix. Sky-blue / orange-red impact-likelihood dots. -->

---

# Slide 25 — Appendix A · TAM math (deeper)

## $1.27T blended. Bottom-up + top-down reconcile.

**Bottom-up.**
- US licensed-trade labor (residential + light-commercial): ~$590B/year. Source: BLS QCEW + AGC market sizing 2025.
- Construction materials (residential + light-commercial): ~$410B/year. Source: NAHB + ABC materials index 2025.
- Same-day-delivery layer (already-existing materials, ~44% same-day-eligible): ~$180B.
- Trade SaaS (Procore + ServiceTitan + BuilderTrend + JobNimbus + long-tail): ~$90B.
- **Total: $1.27T.**

**Top-down sanity check.**
- US construction industry 2025: $2.1T total (commercial + civil + residential).
- Sherpa Pros TAM-eligible slice ≈ residential + light-commercial only ≈ 60% = $1.26T.
- Reconciles within 1% of bottom-up.

**Penetration scenarios.**
- 0.1% = $1.27B annual revenue.
- 1.0% = $12.7B annual revenue.
- Procore at peak ARR: $0.95B. ServiceTitan 2024: $0.77B. **We're targeting a category 5-10x larger than where the existing winners operate.**

---

# Slide 26 — Appendix B · Hub Item 19 economics

## Existing model, validated, conservative.

**Hub Y2 Mid-case (per Item 19 model already in data room):**
- Revenue: $1.05M.
- EBITDA: 21%.
- Cash-flow positive: M14-22.
- Operator headcount: 3-4 FTEs at Y2.
- Co-located footprint at FW Webb: ~800 sq ft.

**Why this is conservative.**
- Mid-case assumes 18% take-rate blended (we're modeling 21% by Phase 2).
- No franchise royalty captured.
- No cross-Hub network effects modeled (each Hub priced standalone).

**Hub portfolio at end of Y3:** 6 Hubs operational. 6 × $1.05M Mid = $6.3M Hub-level revenue, 21% blended EBITDA = $1.3M Hub EBITDA, before platform layer. Platform layer adds the labor commission + materials + SaaS rails on top.

---

# Slide 27 — Appendix C · Wefunder + community traction

## Why the small-check signal matters.

Wefunder $250K close validates three things investors should care about:
1. **Founder narrative resonance.** Working-GC origin story converts at small-check community level — strong leading indicator for institutional fundraise.
2. **Founding-pro investment overlap.** ~30% of Wefunder investors are also founding-cohort pros. Skin in the game on both sides.
3. **Marketing flywheel pre-built.** Each Wefunder investor is a regional brand ambassador. Phase 1 GTM gets free amplification across the Northern Triangle.

The Wefunder round is not the round. It's the proof that the *next* round earns its valuation.

---

# Slide 28 — Appendix D · Competitive deep-dive

## Why Angi can't catch us. Why Procore won't try.

- **Angi.** Public co. Lead-gen revenue model. Restructuring as we speak. Cannot pivot to marketplace + materials + code intelligence without a 3-year ground-up rebuild + a founder profile they don't have. They will buy us before they build it.
- **Thumbtack.** Last private valuation $3.2B (2021). Same structural blind spot as Angi. Has explored licensed-trade vertical multiple times, killed it twice. Operator culture is consumer-marketplace, not contractor-marketplace.
- **Procore / ServiceTitan / BuilderTrend.** Enterprise SaaS. Sell software to GCs and trade companies. Zero marketplace exposure, zero materials exposure. We're additive, not competitive — likely Series C strategic-check candidates.
- **Home Depot Pro / Lowe's Pro.** Materials-only. They've tried labor matching twice (Home Depot's HomeServices.com sale 2018, Lowe's Iris failure). Distribution + retail DNA is the wrong shape for licensed marketplace. Likely Series C strategic check.
- **FW Webb / Grainger / Ferguson.** Distributor partners, not competitors. We feed them forward-pipeline visibility they cannot build alone.

Closest threat: a well-funded second-mover that copies the surface but can't sign Phyrom-level distributor LOIs. We have a 24-month head start to lock the partnerships.

---

# Slide 29 — Contact

## Let's talk.

**Phyrom · Founder & CEO**
poum@hjd.builders
thesherpapros.com

For data-room access, financial model, or a working demo on the platform, reply to this deck or email above. Standard NDA template included in the diligence packet.

<!-- Visual: Sky-blue background, paper-white type. Phyrom photo bottom-right, jobsite portrait. Wordmark top-left. -->

---

<!-- _class: cover -->

# Built by a contractor. Backed by the trade. Now raising for what's next.

**Sherpa Pros · Series A · 2026**

*The Stripe Connect moment for the trade economy.*

<!-- Visual: Full-bleed sky-blue, orange-red diagonal seam motif, large Fraunces wordmark center, JetBrains Mono date+phase footer. -->
