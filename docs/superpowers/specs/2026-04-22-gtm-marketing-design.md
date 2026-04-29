# Sherpa Pros — GTM & Fundraising Design Spec

**Date:** 2026-04-22
**Author:** Phyrom (via brainstorming with Claude)
**Status:** Approved — ready for implementation planning
**Next:** `superpowers:writing-plans` to break Phase 0 into an executable implementation plan

---

## 1. Executive Summary

Sherpa Pros is **the national licensed-trade marketplace** (international vision), built by a working general contractor (HJD Builders) to solve the two problems lead-gen platforms (Angi, Thumbtack, TaskRabbit, Handy) structurally cannot: **verified licensed work** and **code-aware matching**. The platform is already built — web, mobile, 8 APIs live, 37 service categories nationwide, Wiseman code intelligence, Dispatch Wiseman matching.

This document specifies the Go-To-Market plan to move from built product to funded, scaled business across five phases spanning 18+ months — beginning with a four-metro Phase 1 launch and scaling to national coverage by Series B and international expansion thereafter.

**Key constraint:** zero starting budget. The GTM plan is simultaneously the fundraising vehicle. Phase 0 (first 90 days) runs four parallel funding tracks while launching a live-transacting 10+ pro beta cohort, creating the traction artifacts that unlock Phase 1 execution capital.

**Phase 1 launch markets** (operational starting point, not brand identity): Portsmouth NH, Manchester NH, Portland ME, Boston MA metro (four metros parallel). Boston enters with a specialty-only positioning (heat pumps, EV chargers, electrical panel upgrades, old-house specialists, triple-decker exteriors) to avoid head-to-head competition with entrenched lead-gen incumbents in their home market.

**Brand identity:** national (international roadmap). Launch geography is a Phase 1/2/3 sequence, not the brand. Every external surface speaks to Sherpa Pros as the national licensed-trade marketplace — homeowners and contractors anywhere should see themselves in it.

**Positioning:** *"The licensed-trade marketplace that thinks like a contractor. Built by a working GC. Code-aware. Permit-aware. Rebate-aware."*

**Product portfolio (announced 2026-04-24, expanded 2026-04-25):** Sherpa Pros is now a **six-product brand** under one umbrella: (1) **Sherpa Marketplace** — the existing dispatch + match platform (Project + Quick Job modes); (2) **Sherpa Hub** — physical pro pickup locations for job kits, supplies, and branded gear (designed in `docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md`); (3) **Sherpa Home** (NEW) — homeowner subscription tier offering discounts and faster SLAs; (4) **Sherpa Success Manager** (NEW) — managed-service white-glove tier for PMs, multi-property owners, and high-end homeowners; (5) **Sherpa Rewards** (LIVE) — points-based loyalty program with a 21-item redemption catalog, fulfilled in real money via the Tremendous API (gift cards, prepaid debit, charity donations); (6) **Sherpa Flex** (LIVE) — a 5th pro tier (18% fee, per-project platform liability insurance included) that opens a side-hustle path for skilled tradespeople without an LLC, jobs under $5,000 only. Marketplace is live in Phase 0 beta; Rewards and Sherpa Flex shipped to production 2026-04-25 (commits `08b1a5f` + `a4b455a`); Home and Manager are Phase 1 launch designs. See §3.5 for the full product matrix and cross-product flywheel, and §5 for the full **5-tier pro economics** (Founding Pro 5% · Gold 8% · Silver/Bronze 12% · Sherpa Flex 18% with insurance) plus the **Tremendous-backed loyalty layer** that compounds pro retention across every tier.

**Confirmed primary domain:** `https://www.thesherpapros.com/` — every external surface uses this URL. The legacy `sherpa-pros-platform.vercel.app` URL is deprecated as of 2026-04-24 and is internal-only (Vercel deployment URL).

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

### 2.3 Phase 1 launch-metro specialty lanes (operational wedge, not brand)

The same underserved-trade pattern exists in every major US metro (heat-pump install backlogs, EV charger demand, panel upgrade chokepoints, pre-1950 housing requiring specialty work). Sherpa Pros enters each new metro through whichever 3–5 of these lanes are most acute locally — proven first in Boston, then templated nationally.

**Boston Phase 1 specialty lanes** (national platforms can't filter for these):

1. **Heat-pump installations** — EPA cert + electrical panel upgrades + significant utility/state rebates (in Boston: Mass Save program, $10K+ per-home)
2. **EV charger installations** — licensed electrician + panel upgrade; high-density urban charging demand
3. **Electrical panel upgrades** — gateway trade for HP + EV + solar; massive backlog in every major metro
4. **Old-house specialists** — plaster/lath (50%+ of pre-1950 housing nationwide — Boston/NYC/Philly/SF brownstones, Victorians, row houses, historic restoration)
5. **Triple-decker / multi-family exterior** — local building code + permit-critical (Boston-specific in Phase 1; New York City brownstones, Chicago two-flats, Philadelphia row houses follow same pattern)

Sherpa Pros wins these lanes because the Wiseman layer validates national codes (NEC, IRC) plus state and municipal codes (MA Electrical, NH RSA, NYC DOB, etc.) — Dispatch Wiseman matches on license, cert, and skill regardless of geography.

---

## 3. Positioning & Brand Narrative

### 3.1 Hero message

The brand has TWO canonical hero messages — they serve different surfaces and both are correct in their context.

**Public marketing surface (live splash, social ads, landing pages):**

> *Where every project finds the right pro.*

This is the conversion-anchored homeowner-facing tagline. It appears on the public splash at `https://www.thesherpapros.com/` (waitlist landing) and across paid acquisition. **Locked 2026-04-25** per backend production deployment (commit `9537007` rebrand tagline).

**Investor / partner / brand-bible surface (decks, one-pagers, Wefunder, press kit):**

> *The licensed-trade marketplace that thinks like a contractor.*
> *Built by a working GC. Code-aware. Permit-aware. Rebate-aware.*

This is the strategic positioning anchor that explains what we are and why we win. Used in pitch deck slide 1, the executive one-pager, the Wefunder page, all founder-voice press placements.

### 3.1.1 Rotating tagline rotation (homeowner splash)

The public splash at `/` rotates seven taglines via `<HeroTagline>` (5-second rotation). These are paired to specific value propositions and may be reused across social copy when a longer-form headline is needed:

1. *Verified pros. Verified quotes. Verified results.* — trust positioning
2. *One place for the hire, the work, and the money.* — workflow positioning
3. *The right pro. The right price. The proof to back it up.* — outcome positioning
4. *Find the pro. Fund the job. Track every dollar.* — control positioning
5. *From the first quote to the final walkthrough.* — end-to-end positioning
6. *Real pros. Real quotes. Real accountability.* — anti-Angi positioning
7. *The right trade. The right terms. The right outcome.* — match positioning

**Brand rule:** the rotating taglines may appear individually on social posts, but the canonical splash hero is always *"Where every project finds the right pro."* Don't replace it with a rotating variant.

### 3.2 Audience-specific sub-positioning

Updated 2026-04-24: audience expanded from 4 to 5 segments. Homeowners now split into two tiers (Subscription / White Glove). New B2B2C "Companies" segment added pending Phyrom scope clarification.

| Audience | Message | Proof |
|---|---|---|
| Property Management Companies | *"Work orders, preferred vendors, unit-level finance — one platform replaces the 40-vendor spreadsheet."* | PM tier ($4 → $1.50/unit), CapEx/OpEx classification, NOI impact, vendor scorecard, compliance auto-tracked |
| Multi-Property Owners | *"Sherpa Pros for the landlord who's not a property manager but owns 2-15 doors."* | Per-property dashboards, unit-level finance, Schedule E auto-prep, preferred-pro lists |
| Trades / Pros | *"Jobs. Not leads. Get paid for work, not for paying to bid."* | 5% take, instant Stripe, QBO sync, Wisetack, Zinc, Uber Connect |
| Companies (employees w/ available time) | TBD — see clarification flag below | TBD pending segment scope lock |
| Homeowners — Subscription (Sherpa Home) | *"$X/month for faster service, member-priced quotes, Sherpa-on-call."* | Subscription tier — see Wave 6.3 brief being written in parallel |
| Homeowners — White Glove (Sherpa Manager) | *"Your dedicated home manager handles every project end-to-end."* | Concierge, Account Manager assigned, SLA-backed response, white-glove |

**Clarification flag — "Companies with employees with available time":** This is a NEW B2B2C segment. Three possible interpretations:

1. **Employee-benefit play** — companies offer Sherpa Pros memberships as a perk to employees (ClassPass-for-home-services model). Employer pays; employee uses subsidized homeowner-side services.
2. **Workforce-utilization play** — companies whose tradespeople employees have downtime (slow weeks, weather days, between-jobs gaps) can earn additional income on Sherpa Pros, with their employer's blessing. Employer captures a revenue share or improved retention.
3. **Both** — bidirectional B2B2C: a company sponsors Sherpa Home memberships for office staff AND lists its trades crew for utilization-fill jobs.

**SCOPE: needs Phyrom clarification — defaulting to employee-benefit interpretation in Phase 1, validating in Phase 1 user research.** Workforce-utilization interpretation has 1099/W-2 classification implications (R5) that must be re-scoped if it becomes the lead motion.

**Critical:** audience messages still reference *use cases* (PM, landlord, pro, employer, homeowner-tier), not *regions*. Every market has all five segments. The launch sequence is operational; the audience is national.

**Audience-to-product mapping (cross-reference §3.5):**
- Property Management Companies → Marketplace + Manager (PM tier upsell)
- Multi-Property Owners → Marketplace + Manager (lighter-touch)
- Trades / Pros → Marketplace + Hub
- Companies (employees w/ time) → Home (employee-benefit) and/or Marketplace (workforce-utilization)
- Homeowners — Subscription → Home + Marketplace
- Homeowners — White Glove → Manager + Home + Marketplace

### 3.3 Voice & principles

**Tone:** plainspoken, direct, tradesperson-friendly, dry, zero marketing-speak. 8th-grade reading level.

**We always say:** Licensed · Verified · Code-aware · Built by a contractor · Local / Neighbor · Jobs, not leads · National

**We never say:** "Wiseman" externally · Gig / Task · "Uber for X" externally · "AI-powered" as the headline · Disrupt / Revolutionize · Jargon abbreviations (CO, SOV, AR — always spell out) · "New England marketplace" / "NE-only" / region-anchored brand language (the brand is national; launch geography is a Phase 1/2/3 sequence, not the identity) · **"the Sherpa Pros app"** — ambiguous now that we have multiple products (Marketplace, Hub, Home, Manager). Always say which product: "Sherpa Marketplace," "Sherpa Home," etc.

**Founder story is the lead hook.** A working contractor built the platform he wished existed — Phyrom is the founder of HJD Builders LLC in New Hampshire (his origin is real and specific; the brand he built is national). The founder story leads slide 1 of every deck, line 1 of every pro recruit, paragraph 1 of every PR placement. Phyrom-is-a-real-NH-GC builds trust; Sherpa Pros-is-NE-only does not. Lead with the founder; do not cap the brand.

### 3.4 Geographic brand rules

- **Brand:** always national (with international roadmap). Sherpa Pros is THE national licensed-trade marketplace.
- **Launch geography:** named operationally where relevant (e.g., "Phase 1 launches in Portsmouth, Manchester, Portland, and Boston"), never as a brand cap.
- **Founder origin:** "working New Hampshire general contractor" — true, specific, builds trust. Reference Phyrom's NH-GC identity freely; this is biography, not brand cap.
- **Pricing bands:** keep per-metro operational pricing (NH/ME band, MA band, NYC band as we add them). These are real cost-of-labor differences, not brand statements.
- **State-specific operational notes:** keep grant programs (MassCEC), trade associations (NHHBA, MEHBA), supply houses (FW Webb), licensing (MA Office of Consumer Affairs) — these are how the work gets done in our launch markets, not brand identity.
- **Domain:** confirmed as `https://www.thesherpapros.com/` — use this everywhere external (decks, ads, email signatures, press, app store listings, partnership collateral). Never reference `sherpa-pros-platform.vercel.app` (deprecated as of 2026-04-24, that's the Vercel internal URL).

### 3.5 Product Portfolio

Sherpa Pros is a multi-product brand. Each product solves a distinct customer problem; together they form a flywheel. Underneath the six products, three platform-level capabilities (Sherpa Threads · Sherpa Smart Scan · Sherpa Mobile) span every product — see §3.5.1 below for the capability layer detail.

| Product | What it is | Primary audience | Pricing model | Status |
|---|---|---|---|---|
| **Sherpa Marketplace** | Dispatch + match platform. Project mode (bidding) + Quick Job mode (pre-priced). The Uber/DoorDash for licensed trades. | All segments | 5% take rate (10% post-beta) on completed jobs | LIVE — Phase 0 beta |
| **Sherpa Hub** | Physical locations where pros pick up job kits, supplies, branded gear. Hub-and-spoke model. | Trades / Pros | Free for Founding Pros (kit subsidy); membership/per-pickup fee post-beta | DESIGNED — `docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md` |
| **Sherpa Home** | Homeowner subscription. Discounts + faster SLAs + member benefits. | Homeowners (residential) | $X/month or $Y/year (see Wave 6.3 brief) | NEW — Phase 1 launch design |
| **Sherpa Success Manager** | Managed-service tier — dedicated human owns the customer relationship. | Property Managers (PM tier upsell), Multi-Property Owners, White Glove homeowners, large Companies | $Z/month per account or % of managed portfolio (see Wave 6.3 brief) | NEW — Phase 1/2 launch design |
| **Sherpa Rewards** | Points-based loyalty program for pros. Earn on every job, review, photo upload, on-time arrival, monthly Sherpa Score tier bonus, and successful pro referrals. Redeem from a 21-item catalog (branded apparel, Milwaukee/DeWalt/Festool tools, gift cards, experiences) plus Gold-Exclusive items unlocked at Gold Sherpa Score. | Trades / Pros (every tier earns; Founding Pros + Gold tier maximize loyalty value) | No subscription fee — funded by platform margin; redemptions fulfilled via **Tremendous API** (gift cards, prepaid debit, charity donations) at real cash cost per redemption | **LIVE** — `/pro/rewards` shipped 2026-04-25 (commits `08b1a5f` + `a4b455a`) |
| **Sherpa Flex** | A 5th pro tier purpose-built for the side-hustle / moonlighter path. **18% service fee** (vs Standard 12% vs Gold 8%) — premium fee covers $1M per-project platform liability insurance. **No LLC required**, **no personal insurance required**, jobs under **$5,000 only**, background check required. | Skilled tradespeople with a W-2 day job · moonlighters · construction-company employees with available time · pros who want to test the platform before forming an LLC | 18% take rate, no subscription. Insurance funded out of the 6% premium over Standard tier. | **LIVE** — `/pro/flex` shipped 2026-04-25 (commit `08b1a5f`) |

**Cross-product flywheel:**
- Marketplace acquires homeowners + pros → Home subscription up-sells homeowners → Manager up-sells PM/Multi-Owner/White-Glove
- Hub creates supply-side moat (pros come for the kits + gear, stay for the jobs)
- Manager service creates account stickiness + introduces Marketplace + Home to the portfolio
- **Sherpa Rewards** runs underneath Marketplace + Sherpa Flex — every job, review, and on-time arrival mints points; loyalty compounds across every pro tier and feeds the Sherpa Score climb
- **Sherpa Flex** is the entry-level on-ramp (no LLC, jobs <$5K) → pro upgrades to own insurance + LLC → drops to 12% Standard tier → climbs Sherpa Score → reaches Gold (8% + 4hr early job access)
- All six products share one identity (national licensed-trade marketplace), one brand bible, one founder

**Naming convention rules:**
- Always "Sherpa" + ProductName (Sherpa Marketplace, Sherpa Hub, Sherpa Home, Sherpa Success Manager, Sherpa Rewards, Sherpa Flex)
- "Sherpa Pros" remains the umbrella brand (not a product name)
- **LOCKED 2026-04-25:** the white-glove product is **Sherpa Success Manager** (per backend deployment commit `6097f83`). Drop "Account Manager" and "Sherpa Account/Success Manager" usage everywhere — they are deprecated.
- **LOCKED 2026-04-25:** the side-hustle pro tier is **Sherpa Flex** (always with the "Sherpa" prefix — never "Flex tier" or "Flex" alone in external surfaces).
- **LOCKED 2026-04-25:** the loyalty program is **Sherpa Rewards** (capitalized as a program name). Lowercase "rewards" refers to individual catalog items; "Sherpa Rewards" refers to the program.
- **LOCKED 2026-04-25:** the in-app messaging surface is **Sherpa Threads** (not "the chat," not "messages") — work-order-attached threading that bridges to Short Message Service (SMS).
- **LOCKED 2026-04-25:** the document + photo + receipt scanning surface is **Sherpa Smart Scan** (Optical Character Recognition / OCR is the underlying tech but never the headline).
- **LOCKED 2026-04-25:** the native iOS + Android app is **Sherpa Mobile** (iOS in TestFlight beta as of 2026-04-25, bundle ID `com.thesherpapros.app`; Android via Expo).
- Don't say: "the Sherpa Pros app" (which app?) — say: "Sherpa Marketplace" or "Sherpa Home" or whichever product. **Sherpa Mobile** is the OK shorthand only when the conversation is specifically about the native-app shell across products.

### 3.5.1 Platform Capability Layer (shipped 2026-04-25)

The six products share a common capability layer — eight platform-wide features that span every product, but are not products themselves. The first three (Sherpa Threads · Sherpa Smart Scan · Sherpa Mobile) shipped in commits `67ccfc8`, `8933f67`, `60781c1`, and `2f1eec4`. The five additions below shipped in the 2026-04-25 wave (RBAC middleware, audit logs, /flex landing page, splash feature showcase, multi-trade dispatch + materials orchestration). Marketing copy should reference each capability by name inside the relevant product story, not as standalone products.

- **Sherpa Threads — In-app chat with Short Message Service (SMS) sync.** Three-role messaging (pro to client to Property Manager) with read receipts, conversation list, file attachments, and bi-directional Twilio SMS sync. When a client doesn't open the app, the thread sends an SMS; the client's SMS reply lands back in-app. Eliminates the "I'll text you" leakage that costs marketplaces their data, gives both parties an audit trail for disputes, and on the Property Manager tier attaches every thread to its work order. Surfaces in **Sherpa Marketplace** (pro to client), **Sherpa Hub** (Property Manager work-order threads), and **Sherpa Success Manager** (the dedicated human owns the thread on the customer's behalf).
- **Sherpa Smart Scan — Optical Character Recognition (OCR) for documents, photos, and receipts.** One scanning surface with three components: Document Scanner (permits, blueprints, contracts), Photo Analyzer (job-site photos to measurements + conditions), and Receipt Scanner (receipts + invoices). Receipts auto-categorize for tax — Schedule C lines for pros, Capital Expenditure (CapEx) versus Operating Expenditure (OpEx) split for Property Managers. Surfaces in **Sherpa Marketplace** (pro tax tools), **Sherpa Hub** (Property Manager finance + work-order spend tagging — the most-praised feature in PM demos per §10 R5), **Sherpa Home** (homeowner uploads rebate paperwork or permits for instant parsing), and **Sherpa Success Manager** (annual tax-prep handled for the customer).
- **Sherpa Mobile — Native iOS + Android.** Bundle ID `com.thesherpapros.app`. iOS in TestFlight beta as of 2026-04-25, Android via Expo. App Store Connect ID configured, EAS configured for TestFlight submission. Surfaces in **Sherpa Marketplace** (the pro app — pros work in the field, not at a desktop) and **Sherpa Home** (the subscriber app — homeowners reach for their phone, not their laptop). **Sherpa Hub Property Manager dashboards stay web-first by design** (Property Managers do real reporting work on a desktop). **Sherpa Success Manager** is human-led so there is no Manager-side mobile app — the customer-facing Mobile app is what the Manager uses to communicate.
- **Sherpa Guard — Role-Based Access Control (RBAC) middleware + audit logs.** Next.js middleware at `src/middleware.ts` intercepts every `/pro/*`, `/client/*`, `/pm/*`, and `/admin/*` route, reads the role from the active session, and routes the user to the right dashboard (wrong role redirects with a toast; unauthenticated redirects to `/sign-in`; `/admin/*` requires an admin permission flag because admin is a permission layer, not a role). Underneath that, an `audit_logs` table records every load-bearing action — sign-in, role change, access granted or revoked, reward redeemed, pro verified or rejected, job created, material approved, dispatch triggered — with user identifier, target type and identifier, JavaScript Object Notation (JSON) metadata, IP address, and timestamp. Admin view at `/admin/logs` is filterable by action, user, and date range. **Strategic value:** enterprise compliance baseline — Service Organization Control 2 (SOC 2) audit-trail control satisfied out of the box, dispute-resolution paper trail when a $14K kitchen job goes sideways, and a credible signal for any institutional-capital Limited Partner (LP) doing diligence. Required to land the 5,000+ unit Property Manager cohort. Surfaces in **all six products** because it is platform-level.
- **Sherpa Flex Landing — `/flex` route + acquisition funnel.** Live landing page at `/flex` ("Do work on the side? We've got you covered.") plus updated splash-page ecosystem section and updated invite pages. **Strategic value:** opens a paid acquisition channel separate from the full-time pro funnel — side-bandwidth tradespeople (W-2 employees with available time, moonlighters, construction-company employees) now have a dedicated front door. Feeds the Sherpa Flex tier directly. Surfaces in **Sherpa Marketplace** (pro acquisition top-of-funnel).
- **Sherpa Splash — Public capability showcase.** The splash page now displays the full lineup of platform capabilities: Sherpa Score, Sherpa Rewards, Sherpa Smart Scan, Sherpa Threads, Maintenance, Finance Hub, Payment Protection, code-verified quotes, 37 trade categories, Sherpa Success Manager, plus the new **Sherpa Dispatch** model and **Multi-Trade Coordination**. **Strategic value:** the public surface now sells the full differentiator instead of one product at a time. Conversion lift from a clearer value proposition. Surfaces in **all six products** as the marketing front door.
- **Sherpa Dispatch — Multi-trade coordination + timeline.** Multi-trade jobs (e.g., a kitchen renovation: demo → plumbing rough-in → electrical rough-in → drywall → cabinet → counter → trim → paint) get a dispatch timeline that auto-schedules the handoffs between trades, surfaces blocked work, and re-sequences when a trade slips. Single-trade jobs run straight through; multi-trade jobs become **whole-project orchestration** instead of seven uncoordinated marketplace transactions. **Strategic value:** the layer that turns single-job marketplaces into whole-project orchestration. Sherpa Pros stops competing with Angi/Thumbtack/TaskRabbit on labor matching alone and starts competing with **dispatch desks** (the project-coordination layer). Surfaces in **Sherpa Marketplace** (multi-trade jobs), **Sherpa Hub** (Property Manager multi-trade work orders), and **Sherpa Success Manager** (the human owns the timeline on the customer's behalf).
- **Sherpa Materials — Materials orchestration (Wiseman Materials + Zinc + Uber Direct).** **Internal name "Wiseman Materials"; customer-facing surface is "Sherpa Materials" or "Smart Materials" — never expose "Wiseman" externally.** The materials endpoint auto-derives the parts list from the job specification + applicable code requirements + the assembly catalog. Zinc Application Programming Interface (API) handles programmatic procurement from Amazon Business and supplier catalogs. Uber Direct (Uber Connect for same-day delivery) drops the materials at the job site. Pro and client both approve the line-item list before order via the approval-flow user interface (UI); the job detail materials tab shows line-item visibility, status, and delivery Estimated Time of Arrival (ETA). **Strategic value:** the platform's Stripe-Connect moment — Sherpa Pros now competes with **FW Webb + Grainger + DoorDash + every dispatch desk** as a vertically-integrated labor + materials + delivery + coordination layer. Materials Total Addressable Market (TAM) alone is approximately $540 billion in the US (residential + light-commercial trade materials, industry estimate). See §3.5.2 below for the materials-orchestration layer detail. Surfaces in **Sherpa Marketplace** (every job that requires materials), **Sherpa Hub** (Property Manager work-order materials lines), and **Sherpa Home** (homeowners can approve materials for their own job).

### 3.5.2 Materials Orchestration Layer (shipped 2026-04-25)

The Wiseman Materials + Zinc + Uber Direct stack is more than a feature — it is a **strategic shift** in what Sherpa Pros is. Before this layer, Sherpa Pros was a labor marketplace. After this layer, Sherpa Pros is a **labor + materials + delivery + coordination layer** under one orchestration plane.

**The single coordinated stack:**

1. **Wiseman Materials (internal name; "Sherpa Materials" / "Smart Materials" externally).** The job specification + the relevant code requirements + the assembly catalog auto-derive the materials list. No manual takeoff. No copy-paste from a supplier catalog. The pro reviews and adjusts; the client approves.
2. **Zinc API procurement.** Programmatic ordering from Amazon Business and supplier catalogs. The platform places the order against the approved list. Real supplier invoice flows through the platform.
3. **Uber Direct delivery.** Same-day delivery to the job site via the Uber Direct (formerly Uber Connect) network. The pro doesn't burn 90 minutes on a supply-house run; the materials show up while they're working the previous trade's handoff.
4. **Approval flow + job detail materials tab.** Pro and client both approve the line-item list before order. Job detail surfaces line-item status and delivery ETA so nobody has to ask "where are the cabinets?"

**Why this is the category-defining shift.** Traditional labor marketplaces (Angi, Thumbtack, TaskRabbit, Houzz Pro) cap out at a 10-15% take rate on labor only. Materials are a separate transaction the customer handles themselves at Home Depot or Lowe's, with no margin to the marketplace. Sherpa Pros moves materials through the platform, captures a transparent **8-12% coordination fee** (lower than traditional dealer markup), and adds a durable per-job revenue line on top of labor commission. The materials TAM is roughly $540 billion in the US (industry estimate, residential + light-commercial trade materials) — orders of magnitude larger than the labor-marketplace TAM. See `docs/pitch/tam-sam-som.md` for the full Materials Supply Chain TAM expansion.

**The new comp set.** Sherpa Pros is no longer competing only with labor marketplaces. The new competitive set splits across four layers — labor marketplaces (Angi, Thumbtack, TaskRabbit, Houzz Pro), materials supply (FW Webb, Grainger, Home Depot Pro, Lowe's ProDesk, Build.com, supplyhouse.com), last-mile delivery (Uber Direct, DoorDash Drive, Roadie), and project coordination (BuildBook, BuilderTrend, JobNimbus, Procore for light commercial) — and Sherpa Pros is the only player vertically integrating all four under one orchestration plane. See `docs/pitch/competitive-analysis.md` for the per-layer comp matrix.

---

## 4. Phased GTM Execution

### 4.1 Timeline overview

| Phase | Months | Budget | Burn | Focus |
|---|---|---|---|---|
| Phase 0 | 0–3 | ~$0 in / $3–5K out | Minimal | Fundraise + 10-pro beta |
| Phase 1 | 3–6 | $250–500K first close | $25–35K/mo | Lean launch — first 4 metros (NH/ME/MA) + specialty wedge |
| Phase 2 | 6–12 | $750K–1.5M Seed | $60–80K/mo | Scaled 4-metro footprint, PM tier signed |
| Phase 3 | 12–18 | $3–7M Series A | $150–200K/mo | Multi-region expansion (Northeast US + NYC specialty) **— HARD 6-MO BOUND** |
| Phase 4 | 18+ | $15M+ Series B+ | Dependent on raise size | National scale + international expansion preparation |

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

### 5.2 Finance model — full 5-tier pro economics (updated 2026-04-25)

**Beta cohort (90-day beta — unchanged):** $0 subscription + **5% take rate** on completed jobs. Beta cohort is grandfathered into the Founding Pro tier forever.

**Phase 1+ pro economics — five tiers** (set by **Sherpa Score** plus the **Sherpa Flex** side-hustle path):

| Tier | Service Fee | Path | Notes |
|---|---|---|---|
| **Founding Pro** | **5% forever** | Beta cohort lock — Phase 0 only | Lock requires the pro to maintain Gold-tier Sherpa Score post-beta (loyalty floor) |
| **Sherpa Score Gold** | **8%** + 4-hour early job access | Standard pro, 80+ Sherpa Score | Gold also unlocks Sherpa Rewards Gold-Exclusive catalog items |
| **Sherpa Score Silver** | **12%** | Standard pro, 60–79 Sherpa Score | Default Standard-tier rate |
| **Sherpa Score Bronze** | **12%** | Standard pro, <60 Sherpa Score | Default Standard-tier rate; Sherpa Rewards monthly tier-bonus is smallest at this tier |
| **Sherpa Flex** | **18%** (insurance included) | Side-hustle path, **no LLC required**, jobs **<$5K only**, background check required | The 6% premium over Standard funds $1M per-project platform liability insurance. Upgrade path: Flex pro acquires own insurance + LLC → drops to 12% Standard → climbs Sherpa Score to 8% Gold |

**Why this works.** The beta-period 5% take is unchanged — Founding Pros are protected. Phase 1+ introduces the Sherpa Score-driven Gold/Silver/Bronze split (gamified loyalty + clear path to lower fees) **and** the Sherpa Flex 18%-with-insurance side-hustle alternative for the pros who don't yet have an LLC or their own insurance. Together these five tiers cover the entire supply-side market — from full-time licensed contractors with their own insurance (8–12%) to the W-2 tradesperson who wants to take side jobs without the legal-entity overhead (18% with insurance handled). The platform gets supply liquidity at every commitment level; the pro gets a transparent climb path.

**Founding Pros:** Beta cohort grandfathered at 5% take forever (if they stay) — permanent recruiting hook and loyalty lock. **Sherpa Rewards** layers on top of every tier — every job, review, photo upload, and on-time arrival mints points regardless of tier, with a monthly Sherpa Score tier-bonus (Gold > Silver > Bronze) that compounds loyalty without changing the underlying take rate.

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
| R5 | 1099 vs W-2 worker classification challenge | All | High → **Medium** (downgraded 2026-04-25) | Cease & desist from MA AG / NH DOL | Pros are independently licensed contractors w/ own insurance — defensible. Legal opinion W4. **Sherpa Flex (LIVE 2026-04-25) structurally addresses the highest-risk workforce-utilization scenarios:** per-project platform liability insurance + sub-$5K job ceiling + explicit independent-contractor framing remove the wage-redirection / employer-of-record gray areas that previously gated the "Companies with employees with available time" segment Interpretation B. Side-hustle pros pick their own jobs, set their own schedules, and the platform — not the day-job employer — owns the per-project insurance. |
| R6 | Pro fraud or dispute spike (insurance event) | All | High | >2% job dispute rate | Platform liability insurance (~$800/yr); 4.5★ floor; 7-day Stripe hold |
| R7 | Angi / Thumbtack copy specialty positioning | 2/3 | Medium | Competitor "licensed only" or "Mass Save certified" launch | Wiseman code intelligence is the moat — not licensable. Fast USPTO on Old-House Verified. Exclusive utility partnerships. |
| R8 | Phyrom burnout (single-point-of-failure) | 0/1 | Critical | Missed weekly milestones | 60-hr/wk hard cap; Upwork US offloads 30% lowest-leverage; AI agents draft deck/research |
| R9 | Beta → paying conversion drop at M4 | 1 | Medium | >30% pro churn at price step-up | Founding Pros keep 5% forever (promised); new pros enter at 10%; half-price grandfathering = recruiting hook |
| R10 | 4-metro execution complexity | 2 | Medium | 2 of 4 metros <50% of plan at M9 | Concentrate on top 2 performing metros; reduce paid spend on laggers; don't force a metro that isn't taking |

### 10.1 Open Decisions (capability layer)

| # | Decision | Phase | Why it matters | Working answer (pending Phyrom lock) |
|---|---|---|---|---|
| **R6 (Open Decision)** | **Sherpa Threads — Phase 1 chat retention policy.** How long do we keep in-app threads + Short Message Service (SMS) sync logs? | 1 | Construction-record retention norms run **7 years** (matches Schedule C audit window + the typical state statute-of-limitations ceiling for residential construction defects). The Property Manager tier may want **longer** for litigation defense — multi-year property-management litigation can outlast 7-year retention. Too-short = audit / dispute exposure. Too-long = storage cost + Twilio archival cost + General Data Protection Regulation (GDPR) / California Consumer Privacy Act (CCPA) deletion-request complexity. | **Working default: 7 years** baseline retention for all tiers (matches construction-record norms). **Property Manager + Sherpa Success Manager tiers: opt-in extension to 10 years** for litigation defense (storage cost passed through in tier pricing). Customer-initiated deletion request always honored within 30 days regardless of tier. Lock with attorney before Phase 1 launch (`docs/operations/attorney-engagement-package.md` scope item). |
| **R7 (Open Decision)** | **Sherpa Materials — materials margin model.** Markup model versus cost-plus model versus flat coordination fee on every materials order routed through Wiseman Materials + Zinc + Uber Direct. | 1 | This is a brand-new revenue line and the wrong shape kills trust on both sides of the marketplace. **Markup** (mark the supplier price up on the receipt) hides the real cost from the pro and the client and risks looking like a supply-house in disguise. **Cost-plus** (show the supplier invoice, add a transparent platform fee) is closer to the "Built by a contractor" voice and matches how real general contractors invoice materials to their clients. **Flat fee per order** (e.g., $25 per order regardless of basket size) is the simplest to communicate but breaks on small kits and overcharges on big jobs. The wrong model also breaks the per-job economics — the materials line is the durability play (recurring per-job revenue, not per-pro subscription), so it has to be defensible long-term, not a one-quarter take-rate gimmick. | **Working default: cost-plus** with the supplier invoice surfaced transparently on the job + an **8-12% coordination fee** added on top (lower than traditional dealer markup; matches GC norms). The 8% floor applies to high-volume Property Manager and Sherpa Success Manager tiers; the 12% ceiling applies to one-off Sherpa Home homeowner orders. Always show the line-item supplier invoice + the coordination fee broken out separately so neither pro nor client feels marked-up-against. Revisit at Phase 2 once the first $1M of materials throughput has gone through the platform — adjust the band based on actual delivery + procurement cost recovery. |
| **R8 (Open Decision)** | **Sherpa Guard — audit log retention.** How long do we keep `audit_logs` rows (sign-in, role change, access granted/revoked, reward redeemed, pro verified/rejected, job created, material approved, dispatch triggered)? | 1 | Audit logs are the dispute-resolution paper trail when a $14K kitchen job goes sideways and the SOC 2 audit-trail control evidence when an institutional-capital LP runs diligence. Construction-record retention runs 7 years (matches Schedule C audit window + state statute-of-limitations for residential construction defects). Property Managers and Sherpa Success Manager customers may want longer for litigation defense — multi-year property-management litigation can outlast 7-year retention. Storage cost is low (Postgres rows, not files) so the cost side of the trade-off is mostly compliance + privacy-request complexity rather than dollars. | **Working default: 7 years** baseline retention for all tiers (matches construction-record norms and the Sherpa Threads retention policy in R6 above). **Property Manager + Sherpa Success Manager tiers: opt-in extension to 10 years** for litigation defense. Customer-initiated deletion request always honored within 30 days regardless of tier (the audit log itself records the deletion event, so the deletion is itself audited). Lock with attorney before Phase 1 launch alongside the R6 Threads-retention policy — same attorney engagement scope. |

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
