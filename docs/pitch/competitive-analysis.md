# Sherpa Pros — Competitive Analysis Matrix

**Date:** 2026-04-22
**Audience:** Investor data room (Wave 1 pitch artifacts)
**Author:** product-trend-researcher (research compiled from public 2024–2026 sources)

---

## 1. Executive Summary

The home-services platform market is dominated by lead-gen pay-to-play models (Angi, Thumbtack), task-based gig models (TaskRabbit, Handy), and designer/inspiration marketplaces (Houzz). All have well-documented structural weaknesses around licensed-trade verification, code/permit awareness, and contractor economics. State-run installer-finders (Mass Save) cover only a narrow segment of trades (energy efficiency) and offer no marketplace mechanics — no dispatch, no escrow, no review system, no scheduling.

**The "licensed + code-aware + true marketplace" quadrant is empty.** Sherpa Pros plants the flag there with built-in code-aware quote validation (NEC, IRC, MA Electrical, NH RSA), permit-awareness, rebate-awareness, and a 5–10% take-rate model that is roughly half the effective cost of Angi/Thumbtack lead-gen.

**Update 2026-04-25 — vertical integration shipped.** With the materials orchestration layer (Wiseman Materials + Zinc Application Programming Interface (API) + Uber Direct same-day delivery) and the multi-trade dispatch + timeline shipped on 2026-04-25, the comparison frame changes. Sherpa Pros is no longer just a labor marketplace competing with Angi/Thumbtack/TaskRabbit. It is a **vertically-integrated labor + materials + delivery + coordination layer** competing across four formerly-separate categories. See §1.5 below for the new comp-set framing — the per-competitor matrix in §2 still applies inside the labor-marketplace layer, but it is now one of four layers Sherpa Pros covers.

---

## 1.5 Vertical Integration — Labor + Materials + Delivery + Coordination

**The category-defining shift.** Until 2026-04-25, Sherpa Pros was best understood as the next-generation labor marketplace — better than Angi on take-rate, better than Thumbtack on lead-blast economics, better than TaskRabbit on licensed-trade depth. After 2026-04-25, the shorthand for what Sherpa Pros is changes from *labor marketplace* to *labor + materials + delivery + coordination layer under one orchestration plane*. The new competitive set splits into **four layers**:

| Layer | What it does | Incumbent leaders | What Sherpa Pros ships |
|---|---|---|---|
| **1. Labor marketplace** | Match a homeowner / Property Manager to a licensed pro | Angi, Thumbtack, TaskRabbit, Houzz Pro | **Sherpa Marketplace** — single-pro dispatch, code-aware quote validation, 5–10% take rate, Stripe Connect escrow |
| **2. Materials supply** | Source the parts the job needs and get them to the job site | FW Webb, Grainger, Home Depot Pro, Lowe's ProDesk, Build.com, supplyhouse.com | **Sherpa Materials** — Wiseman Materials auto-derives the parts list from job spec + code + assembly catalog; Zinc API procures from Amazon Business + supplier catalogs; transparent supplier invoice + 8-12% coordination fee (lower than dealer markup) |
| **3. Last-mile delivery** | Same-day delivery of materials to the job site | Uber Direct, DoorDash Drive, Roadie | **Uber Direct** integrated as the delivery rail inside Sherpa Materials — pro doesn't burn 90 minutes on a supply-house run |
| **4. Project coordination** | Sequence multi-trade work, manage handoffs, track blockers | BuildBook, BuilderTrend, JobNimbus, Procore (light commercial) | **Sherpa Dispatch** — multi-trade timeline auto-schedules handoffs (e.g., kitchen renovation: demo → plumbing rough-in → electrical rough-in → drywall → cabinet → counter → trim → paint), surfaces blocked work, re-sequences when a trade slips |

**Sherpa Pros is the only player vertically integrating all four layers under one orchestration plane.** Each incumbent in the table above is single-layer by design — they do their layer well, they do not own the customer relationship across the other three layers. The coordination cost the homeowner / Property Manager pays today is exactly the cost Sherpa Pros eliminates by integrating across the four.

### 1.5.1 Per-Layer Moat Comparison

| Layer | Incumbent's moat | Why Sherpa Pros' integrated offering wins inside this layer |
|---|---|---|
| **Labor** | Angi/Thumbtack: paid acquisition + brand recognition. TaskRabbit: IKEA partnership. Houzz Pro: SaaS contractor lock-in. | All four incumbents are single-trade-job platforms — a homeowner asks for a plumber, gets a plumber. None of them coordinate the *other six trades* on a kitchen renovation. Sherpa Dispatch wins on multi-trade because the incumbents structurally can't ship it without the materials + coordination layers. |
| **Materials** | FW Webb / Grainger: warehouse footprint + supplier relationships. Home Depot Pro / Lowe's ProDesk: retail footprint + Pro account credit lines. Build.com / supplyhouse.com: e-commerce convenience. | All five materials incumbents require the contractor or homeowner to **already know what to order** — they sell catalogs, not derived parts lists. Wiseman Materials auto-derives the list from job spec + code + assembly catalog. The contractor-facing value is "we figured out what you need" instead of "search our catalog." That derivation requires owning the labor + dispatch layers, which the incumbents do not. |
| **Last-mile delivery** | Uber Direct / DoorDash Drive / Roadie: driver network + delivery technology. | These are infrastructure providers, not consumer brands in this category. Sherpa Pros uses Uber Direct as the rail (no need to compete with it) and wraps it in the job context — the homeowner sees "your cabinets arrive Wednesday at 10 AM" inside the same app where they approved the parts list. The integration is the moat; the rail is commodity. |
| **Project coordination** | BuildBook / BuilderTrend / JobNimbus: SaaS contractor stack. Procore: large-commercial scale + real-time collaboration. | All four coordination tools assume the contractor **already has the labor + materials secured** — they are management overlays, not sourcing platforms. Sherpa Dispatch is sourcing + sequencing in one surface. Procore would have to acquire a labor marketplace and a materials catalog to ship the equivalent; the SaaS challengers would have to build supply across both to ship the equivalent. |

**Combined moat:** the four-layer integration is itself a moat. An incumbent in any single layer would need to build or acquire across the other three, which is structurally hard (different business models, different customer bases, different unit economics). Vertical integration in two-sided marketplaces is famously hard to copy because each layer's economics depend on the others.

### 1.5.2 Take-Rate Implication of Vertical Integration

Single-layer labor marketplaces cap out at a **10–15% take rate on labor only.** Sherpa Pros stacks revenue lines across the four layers:

- **5–12% labor commission** (Sherpa Flex 18%, Standard 12%, Gold 8%) on the labor side
- **8–12% materials coordination fee** on the materials side (transparent supplier invoice + coordination fee broken out, lower than traditional dealer markup, working assumption per GTM spec §10.1 R7)
- **Sherpa Home subscription** revenue from homeowners
- **Sherpa Success Manager retainer** revenue from Property Manager / Multi-Property Owner / White-Glove customers

**Blended take rate per job: 18–25%** with the materials line being the durability play (recurring per-job revenue, not per-pro subscription). Per-job materials-to-labor ratio runs ~60/40 materials-to-labor for trade work, so each $10K labor job has roughly $15K of materials passing through Sherpa Materials. See `docs/pitch/tam-sam-som.md` Vertical Integration Multiplier callout.

---

## 1.6 Compliance + Audit Posture as a Competitive Moat

**The data-handling gap.** Angi, Thumbtack, TaskRabbit, Houzz Pro, and Handy were built as pre-Service Organization Control 2 (SOC 2), pre-General Data Protection Regulation (GDPR) consumer marketplaces — the data flow was "blast lead to many pros, hand off to phone / email, no further visibility." None of them ship a per-action audit log against the work order. None of them ship Role-Based Access Control (RBAC) middleware that enforces tier-appropriate dashboard routing across roles like *pro · client · Property Manager · admin*. The contractor reviews of all five platforms are full of "I never know what happened to that lead" / "they sold my information to my competitor" / "I can't get the call recording back" — all symptoms of weak data-handling architecture.

**Sherpa Guard is the answer Sherpa Pros ships out of the box.** Per `docs/operations/sherpa-product-portfolio.md` §2.7.4, Sherpa Guard combines RBAC middleware (session-aware route enforcement on `/pro/*`, `/client/*`, `/pm/*`, `/admin/*` with admin as a permission flag, not a role) with an `audit_logs` table that records every load-bearing action — sign-in, role change, access granted, access revoked, reward redeemed, pro verified, pro rejected, job created, material approved, dispatch triggered — with user identifier, target type and identifier, JavaScript Object Notation (JSON) metadata, IP address, and timestamp. Admin view at `/admin/logs` is filterable by action, user, and date range.

**Why this is a moat (not just a feature).** Three reasons:

1. **Property Manager (PM) cohort gating.** The 5,000+ unit PM cohort — the highest-Annual Recurring Revenue (ARR) target on the Sherpa Pros customer map — runs internal compliance reviews before they sign any vendor contract. Sherpa Guard satisfies the audit-trail control out of the box; lead-gen incumbents fail it on day one. Without Sherpa Guard, the PM cohort cannot be sold to enterprise-style buyers — they would have to take Sherpa Pros through a 9-12 month custom-compliance build first. With Sherpa Guard, the cohort is addressable from day one.
2. **Institutional-capital Limited Partner (LP) diligence.** Any institutional-capital fund (Insight, Bessemer, Andreessen, the family offices behind a Series A) runs Service Organization Control 2 (SOC 2) audit-trail-control checks on portfolio investments. Sherpa Guard makes the diligence answer "yes, here is the table and here is the admin view" instead of "we are working on it." Saves 3-6 months of go-to-market on the institutional-tier cohort.
3. **Dispute defensibility per job.** When a $14K kitchen job goes sideways and the homeowner disputes the materials approval or the dispatch decision, Sherpa Pros has the per-event audit log to settle the dispute. Lead-gen incumbents do not — which is why their dispute-resolution function relies on subjective phone-call-based mediation and runs a several-percent loss rate per disputed transaction.

**Defensibility against incumbent retrofit.** Could Angi or Thumbtack ship Sherpa Guard? Technically, yes — RBAC middleware and an audit log table are standard patterns. **Practically, no**, because the audit log is only useful if the platform owns the work order, the thread, the materials approval, and the dispatch event in one data model. Lead-gen incumbents fragment those events across the pro's personal phone (the call), the pro's personal email (the lead), the homeowner's bank (the payment), and the pro's accounting tool (the invoice) — there is no single data model to log against. Retrofitting would require re-architecting around the work order as the spine, which is a multi-year build that doesn't improve the lead-fee economics that pay the bills today. So the moat holds.

---

## 2. Comparison Matrix

| # | Competitor | Founded / Status | Latest Revenue or Valuation | Business Model | Trade Coverage | Code / Permit / Rebate Awareness | Documented Weaknesses | Sherpa Pros Structural Advantage |
|---|---|---|---|---|---|---|---|---|
| 1 | **Angi (NASDAQ: ANGI)** | 1995 (as Angie's List); merged with HomeAdvisor 2017; spun off from IAC Q2 2025 [^1] | **FY2025 revenue $1.03B** (down 13% YoY from $1.19B FY2024) [^2] | Lead-gen (pay-per-lead, $30–$100/lead, often shared with up to 40 competitors); Angi Pro subscription starts $200/mo [^3]; consumer "Angi Key" membership discontinued Aug 14, 2025 | Broad / unskilled-leaning; weak licensed-trade verification | None. No code intelligence, no permit assist, no rebate matching | BBB: not accredited; ~1,800+ complaints 2023–2026 [^4]; Trustpilot 2.1/5 with thousands of 1-star pro reviews; Vermont AG settlement Oct 2025 ($100K over misleading "Certified Pro" terminology) [^4]; ~30% cancellation penalty on remaining contract balance | (a) 5% take-rate (10% post-beta) vs. effective Angi cost often $400–$800 per closed job; (b) code-aware quote validation with permit and rebate matching; (c) "Jobs not leads" — exclusive matching, not shared lead-blast |
| 2 | **Thumbtack** | 2008; private | **~$400M revenue FY2024** [^5]; **$3.2B valuation** (June 2021 round, $275M); $75M debt financing July 2024 from SVB; total raised ~$699M [^6] | Lead-gen: pros pay variable per-quote price; consumers post job; pros buy contact | Broad services (handyman → pet sitting → tutoring); some licensed trades but no verification depth | None. No code/permit/rebate intelligence | Documented contractor-deposit-theft cases ($300–$6,500 per BBB/Sitejabber/PissedConsumer) [^7]; widely-reported fake leads (invalid phone, non-existent customers); BBB pattern-of-complaints review completed Nov 2025; Thumbtack does not mediate "price disagreements" with deposit-keeping contractors [^7] | (a) Stripe Connect escrow with 7-day hold reduces deposit-theft risk; (b) license + insurance verified before listing; (c) no shared/blasted leads — single matched dispatch |
| 3 | **TaskRabbit** | 2008; **acquired by IKEA 2017** | **~$75M revenue 2025** [^8] (private subsidiary; not separately disclosed in IKEA financials). Effective fee load ~22.5% of tasker pay (15% service fee + 7.5% trust & support fee) [^8] | Hybrid: hourly tasker rates + 15% service fee + 7.5% trust/support fee + peak pricing; IKEA assembly on flat per-item pricing | Unskilled tasks (assembly, moving, errands, cleaning, handyman). **Does not cover licensed trades** (electrical, plumbing, HVAC, roofing) | None. Not relevant — not a licensed-trade platform | High effective fee (~22.5%); last-minute cancellations widely reported; IKEA-flat-rate roll-out cut tasker earnings on assembly tasks; not built for code-bound or permitted work | (a) Different category — Sherpa Pros doesn't compete with IKEA assembly. (b) When TaskRabbit users need licensed work (electrical for ceiling fan, plumbing for dishwasher), they have nowhere to go inside the platform — Sherpa Pros captures that referral. |
| 4 | **Handy** | 2012; **acquired by ANGI Homeservices 2018 for $165.5M** [^9] | Not separately disclosed since acquisition (rolled into ANGI consolidated revenue) | Subscription + per-task; pre-priced cleaning, handyman, basic installs | Narrow: cleaning, handyman, basic furniture/TV installs. Limited licensed-trade coverage | None | Limited trade coverage means most homeowner-significant projects (heat pump, panel upgrade, roof, plumbing rough-in) cannot be booked; ANGI parent absorbs strategic priority away from Handy | (a) Sherpa Pros covers the licensed-trade depth Handy explicitly avoids; (b) we own the high-ticket workflow ($5K–$50K jobs) where Handy stops at ~$300 tasks |
| 5 | **Houzz** | 2009; private | **~$4B valuation** (per CB Insights / PitchBook synthesis); $614M total raised from Sequoia / NEA / GGV [^10]; reports of valuation soft markdowns in recent secondary filings [^11]; 2024 industry-wide design-firm revenue decline [^12] | Two products: (a) Houzz consumer marketplace (free directory + lead-gen); (b) **Houzz Pro SaaS** at $59–$999/mo per seat [^13] | Designers, architects, design-build firms; weaker on standalone trades | None at the matching layer | Houzz Pro has 1.03★ BBB average across 500+ complaints in 3 years [^14]; Sitejabber 2.5★ over 159 reviews; contractors report $5K+ spend with zero leads [^14]; lead-blast model (customers contact many pros from one listing); platform is built for inspiration discovery, not execution dispatch | (a) Houzz competes on aspirational visuals and project software; Sherpa Pros competes on **completing the job today**; (b) code-aware quote validation is execution-grade (code/permit), not portfolio-grade; (c) Sherpa Pros' contractor economics are radically better |
| 6 | **Mass Save Find-an-Installer** | Utility-funded program-administered tool (Eversource, National Grid, Unitil, Cape Light Compact, Berkshire Gas, Liberty Utilities, NSTAR Gas) | N/A — non-commercial program tool | **Basic listing only.** Zip-code search returns EPA-certified Heat Pump Installer Network (HPIN), Home Performance Contractors (HPC), Independent Installation Contractors (IIC) [^15] | **Energy efficiency only:** heat pumps, HPC contractors, insulation/air-sealing IICs | Yes — but only for Mass Save program scope. EPA cert verified. | No marketplace mechanics: no dispatch, no escrow, no scheduling, no quotes, no reviews, no in-app messaging, no payment, no permit assist, no rebate calculator, no matching algorithm. It is a static listing. | (a) Sherpa Pros becomes the **execution layer** Mass Save's listing is missing — apply for the Mass Save Network to inherit its funnel, then provide the dispatch/escrow/review layer the program does not; (b) Old-House Verified, EV charger, panel upgrade, triple-decker exterior categories Mass Save does not cover at all |

---

## 3. Capability Heatmap (rapid-scan version)

| Capability | Angi | Thumbtack | TaskRabbit | Handy | Houzz | Mass Save | **Sherpa Pros** |
|---|---|---|---|---|---|---|---|
| Licensed-trade verification | weak | weak | n/a | weak | weak | yes (energy only) | **yes (full)** |
| Code intelligence (NEC/IRC/state) | no | no | no | no | no | partial | **yes (code-aware quote validation)** |
| Permit-aware quoting | no | no | no | no | no | no | **yes** |
| Rebate-aware (Mass Save / NEEP) | no | no | no | no | no | yes | **yes** |
| Escrow / payment protection | no | no | yes (limited) | yes | no | no | **yes (Stripe Connect 7-day hold)** |
| Single-pro dispatch (vs. lead-blast) | no | no | yes | yes | no | no | **yes (single-match dispatch engine)** |
| Take-rate vs. lead-fee | lead-fee | lead-fee | 22.5% effective | 15–20% | lead-fee + SaaS | n/a | **5–10% take** |
| Trade-show / GC-network credibility | corporate | corporate | corporate | corporate | corporate | utility | **founder-built by working GC** |
| Mobile-first dispatch UX | partial | partial | yes | yes | no | no | **yes (Uber-style map)** |
| Property Manager (PM) tier | no | no | no | no | no | no | **yes (CapEx/OpEx, NOI)** |

---

## 4. Documented Weaknesses — Citations Bank

- **Angi BBB un-accredited / 1,800+ complaints / 2.1★ Trustpilot / VT AG settlement Oct 2025**: see [^4]
- **Thumbtack deposit-theft pattern, fake leads, BBB pattern-of-complaints review Nov 2025**: see [^7]
- **TaskRabbit effective fee load 22.5%**: see [^8]
- **Houzz Pro 1.03★ BBB / 500+ complaints / contractors paying $5K+ with zero leads**: see [^14]
- **Handy strategic deprioritization post-ANGI acquisition**: see [^9]
- **Mass Save Find-an-Installer is a static listing, not a marketplace**: see [^15]

---

## 5. What We Don't Compete On

We deliberately do not compete in the following adjacencies. Stating this clearly de-risks the pitch ("they understand their lane"):

1. **TaskRabbit-style assembly and errands.** IKEA assembly, furniture moves, dog-walking, errands, virtual tasks. This is gig-economy unskilled labor. We will not build this category. When a Sherpa Pros homeowner needs IKEA-style assembly, we link out to TaskRabbit.
2. **Houzz-style designer portfolios and aspirational mood-boarding.** Designer-led discovery, project galleries, "save to ideabook." Houzz owns this. Belle Vie (sister property under HJD) handles the design-concierge layer — Sherpa Pros is purely execution.
3. **Home Depot / Lowe's "Pro Services" installation programs.** Big-box-driven installs (carpet, water heater, dishwasher) are tied to retail purchase channels. Different acquisition motion. Potential **partnership** (materials integration via Zinc), not competition.
4. **Pure SaaS for contractors (Houzz Pro, Buildertrend, JobNimbus).** We do not sell a contractor CRM. Pros use Sherpa Pros to **get jobs**, not to manage their non-Sherpa book.
5. **National handyman chains (Mr. Handyman, Ace Handyman, Neighborly).** Franchise plays with W-2 tradespeople. Different supply-side model. Sherpa Pros aggregates **independent licensed pros**.
6. **Insurance-tied repair networks (Servpro, Belfor, Travelers Home Repair Network).** Catastrophe restoration is its own world with carrier referral lock-in. **Future partnership opportunity** (Phase 4) — not Phase 1–3 competition.
7. **Lead-gen for new home construction (BuildZoom for permits, NewHomeSource for builders).** New-construction GC selection is a months-long, six-figure relationship sale. We focus on remodel + repair + installation jobs $500–$50K.

**The discipline:** Sherpa Pros is the national licensed-trade execution layer for **post-purchase, in-place residential and small-commercial work** — launching first in NH, ME, and MA, expanding nationally. Anything outside that frame is partnership territory or out-of-scope.

---

## 6. Defensibility Summary (one sentence per moat)

1. **Code-aware quote validation (NEC, IRC, MA Electrical, NH RSA, 192 codes, 480K entries, 284 NH municipalities)** is a multi-year build no national lead-gen incumbent has incentive to replicate — it does not improve their lead-fee economics.
2. **Founder-as-GC narrative** (Phyrom of HJD Builders — actively building in NH) is unforgeable trust signal vs. corporate platforms.
3. **Mass Save Network application + Eversource/National Grid Turnkey relationships** create utility-funnel lock-in that competitors cannot enter without state-level certification.
4. **5% take rate (Founding Pros forever)** vs. Angi's effective $400–$800/closed-job lead spend creates a permanent supply-side cost advantage.
5. **Old-House Verified USPTO trademark** (filing W4 of Phase 0) creates defensible branded category for pre-1950 Boston/triple-decker work that no platform currently owns.

---

## Footnotes / Sources

[^1]: [Angi Inc. Investor Relations — Quarterly Earnings](https://ir.angi.com/quarterly-earnings) | [Angi Inc. Wikipedia entry — IAC spin-off](https://en.wikipedia.org/wiki/Angi_Inc.)

[^2]: [Angi Inc. Q4/FY 2025 results synthesis from Quartr](https://quartr.com/companies/angi-inc_3895) and [Angi IR Q3 2025 release](https://ir.angi.com/static-files/f756dfd9-c9eb-4e66-9753-b8e170977ea9). FY2025 revenue $1,030.5M, down 13% from $1,185.1M FY2024.

[^3]: [Angi Pro pricing — fitsmallbusiness.com](https://fitsmallbusiness.com/what-is-angis-list/) and [Angi Pro Reviews — savullc.com](https://savullc.com/angi-pro-reviews/)

[^4]: [Angi BBB Complaints page](https://www.bbb.org/us/in/indianapolis/profile/contractor-referral/angi-0382-3041007/complaints) | [Angi Leads Trustpilot (2.3/5, "Poor")](https://www.trustpilot.com/review/homeadvisorpros.com) | [Angi Leads Reviews From Contractors 2025 — Hook Agency](https://hookagency.com/blog/angi-leads-reviews/) | Vermont AG October 2025 settlement summary referenced in [Adapt Digital 2026 platform comparison](https://adaptdigitalsolutions.com/articles/homeadvisor-vs-angieslist-vs-houzz-vs-porch-vs-thumbtack-vs-yelp-vs-bark/)

[^5]: [Thumbtack revenue $400M FY2024 — Latka / Fast Company synthesis](https://getlatka.com/companies/thumbtack.com)

[^6]: [Thumbtack PitchBook profile](https://pitchbook.com/profiles/company/53601-76) | [$275M / $3.2B valuation announcement — Thumbtack Press](https://press.thumbtack.com/announcements/thumbtack-secures-275-million-investment-at-3-2-billion-valuation/) | [Thumbtack Wikipedia](https://en.wikipedia.org/wiki/Thumbtack_(company)) | [Tracxn Thumbtack funding rounds](https://tracxn.com/d/companies/thumbtack/__YyXUgoRyyiejQpXK9d0b-8n_AD3aqN6ZhrwDIHLemP8/funding-and-investors)

[^7]: [Thumbtack BBB Complaints page](https://www.bbb.org/us/ca/san-francisco/profile/internet-service/thumbtack-inc-1116-367066/complaints) | [Thumbtack Sitejabber reviews (1,534)](https://www.sitejabber.com/reviews/thumbtack.com) | [PissedConsumer 4.1K Thumbtack complaints](https://thumbtack.pissedconsumer.com/review.html) | [Consumer Affairs page 4](https://www.consumeraffairs.com/homeowners/thumbtack.html?page=4)

[^8]: [TaskRabbit business model + revenue breakdown — Oyelabs](https://oyelabs.com/taskrabbit-business-model/) | [TaskRabbit IKEA flat-rate pricing — TaskRabbit Support](https://support.taskrabbit.com/hc/en-us/articles/24513108035085-Task-Based-Pricing-Model-for-Clients-at-IKEA-Stores-and-Online) | [TaskRabbit Wikipedia](https://en.wikipedia.org/wiki/Taskrabbit) | TaskRabbit ~$75M 2025 revenue figure: [InfoStride business-model breakdown](https://infostride.com/taskrabbit-business-model/) [NEEDS VERIFICATION — IKEA does not separately disclose; cross-reference via Statista/PitchBook before final IC presentation]

[^9]: [ANGI acquires Handy for $165.5M — IBJ](https://www.ibj.com/articles/70878-angi-homeservices-buying-handy-in-effort-to-dominate-home-renovations) | [Handy + HomeAdvisor + Angie's List blog](https://www.handy.com/blog/handylife/handy-homeadvisor-angies-list)

[^10]: [Houzz CB Insights profile](https://www.cbinsights.com/company/houzz/financials) | [Houzz PitchBook profile](https://pitchbook.com/profiles/company/51270-13)

[^11]: [Houzz, Inc. valuation markdown filing — Prime Unicorn Index](https://www.primeunicornindex.com/houzz-inc-valuation-to-fall-after-latest-filing/)

[^12]: [Houzz 2024 industry decline — Furniture World](https://www.furninfo.com/furniture-industry-news/24531) | [2025 U.S. Houzz State of the Industry](https://www.houzz.com/magazine/2025-u-s-houzz-state-of-the-industry-stsetivw-vs~180175249)

[^13]: [Houzz Pro pricing](https://www.houzz.com/houzz-pro/pricing) | [Capterra Houzz Pro pricing breakdown](https://www.capterra.com/p/199689/Houzz-Pro/pricing/)

[^14]: [Houzz Pro Sitejabber reviews (159)](https://www.sitejabber.com/reviews/pro.houzz.com) | [Houzz BBB Complaints page (1.03★, 500+ complaints)](https://www.bbb.org/us/ca/palo-alto/profile/bulletin-board/houzz-1216-263825/complaints) | [Houzz of Cards — BuildBook critique](https://buildbook.co/blog/houzz-of-cards-the-unfortunate-truth-about-marketplaces-for-small-contractors) | [HookAgency Houzz Pro contractor reviews](https://hookagency.com/blog/houzz-pro-reviews/)

[^15]: [Mass Save Find a Contractor](https://www.masssave.com/residential/find-a-contractor) | [Mass Save Heat Pump Installer Search](https://www.masssave.com/residential/find-a-contractor/find-a-heat-pump-installer) | [Mass Save Trade Partners — Heat Pump Installers](https://www.masssave.com/trade-partners/contractors/heat-pump-installers)
