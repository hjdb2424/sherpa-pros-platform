# Sherpa Pros — Six-Product Brand Portfolio

**Date:** 2026-04-22 (v1) · **Updated 2026-04-25** — expanded to six products with Sherpa Rewards + Sherpa Flex going LIVE in production (commits `08b1a5f` + `a4b455a`)
**Status:** Brand-architecture spec — anchors Wave 6 GTM revisions
**Authors:** Claude (Wave 6.2) + Phyrom (review)
**Companion docs:**
- `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` (master GTM spec, §3.5 updated in parallel by Wave 6.1)
- `docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md` (Sherpa Hub design)
- `docs/operations/quick-job-lane.md` (Quick Job mode within Sherpa Marketplace)
- `docs/operations/embedded-protection-products.md` (Phase 1 paid protection products)
- `CLAUDE.md` (brand naming rules)

---

## 1. Executive Summary

Sherpa Pros is no longer a single marketplace — it is a **six-product brand under one umbrella** built by a working New Hampshire general contractor (Phyrom, HJD Builders LLC). Each product solves a distinct customer problem: **Sherpa Marketplace** is the dispatch + match engine that connects homeowners and property managers to licensed pros (Project mode + Quick Job mode); **Sherpa Hub** is the physical pickup point where pros grab kits, rent tools, and earn certifications; **Sherpa Home** is the homeowner subscription that converts one-time buyers into repeat members; **Sherpa Success Manager** is the managed-service tier where a dedicated human owns the customer relationship for PMs, multi-property owners, white-glove homeowners, and large companies; **Sherpa Rewards** (LIVE 2026-04-25) is the points-based loyalty layer that compounds pro retention across every tier, fulfilled in real money via the Tremendous API; and **Sherpa Flex** (LIVE 2026-04-25) is a 5th pro tier — 18% fee, per-project platform liability insurance included, no LLC required, jobs under $5K only — that opens a side-hustle path for skilled tradespeople who want to test the platform without forming an LLC. Together they form a flywheel: a customer enters through Marketplace, deepens through Home or Hub, and ascends to Sherpa Success Manager; a pro enters through Sherpa Flex (no LLC) or as a Standard pro, climbs the Sherpa Score ladder to Gold (8% fee), and earns Sherpa Rewards points across every job they complete — each product feeding the next, each defending a different competitor's flank, each compounding LTV.

---

## 2. Product Detail

### 2.1 Sherpa Marketplace — *the dispatch engine*

**Product positioning.** *"The licensed-trade marketplace that thinks like a contractor — Project mode for the kitchen, Quick Job mode for the toilet, both code-aware, both built by a working GC."*

**Primary audience.** Residential homeowners (Project + Quick Job).

**Secondary audience.** Property Managers, specialty / older-home owners, light-commercial buyers, contractors (supply side).

**What it does.**
- Matches verified licensed pros to homeowner jobs in two distinct lanes: **Project mode** (multi-bid, code-aware, $1.5K–$50K+) and **Quick Job mode** (pre-priced flat-rate menu, single-pro auto-assign, $200–$1,500).
- Validates scope, code compliance, permits, and rebates through the internal Wiseman intelligence layer (never exposed externally).
- Handles escrow, payouts, ratings, dispute resolution, and (Phase 1+) optional Project Protection insurance at checkout.

**Pricing model.** Beta: $0 subscription + 5% take rate. Standard: $49/mo subscription + 10% take rate. Founding Pros grandfathered at 5% forever. Same take rate across Project and Quick Job lanes.

**Status.** **LIVE.** Web + mobile + 8 APIs operational, 37 service categories nationwide, Dispatch Wiseman matching, Stripe Connect live (Phase 0 gate).

**Phase timing.**
- Phase 0 (now): Marketplace beta — Project mode primary, Quick Job lane infrastructure spec'd.
- Phase 1: Public launch across Portsmouth, Manchester, Portland, Boston (specialty wedge). Quick Job lane launches Month 4–5.
- Phase 2: National pro coverage scaling, PM tier integration tightened, Quick Job hyper-local pricing.
- Phase 3: Multi-region expansion (Providence, Hartford, NYC specialty).

**Tech / ops dependencies.** Stripe Connect, Clerk auth, Neon Postgres + PostGIS, Twilio masked messaging, Dispatch Wiseman (live), Wiseman code intelligence (BldSync API).

**Cross-product hooks.**
- → **Sherpa Home**: post-Quick-Job nudge ("you've used Sherpa Marketplace 3 times — join Sherpa Home and save 5% on every job + skip the line").
- → **Sherpa Hub**: pro side — pros earning >$X/mo or completing >Y jobs get invited to claim a Founding Pro Hub membership.
- → **Sherpa Manager**: PM tier customer growing past 50 units automatically routed to a Sherpa Manager intake call.

---

### 2.2 Sherpa Hub — *the physical pickup point*

**Product positioning.** *"Where your jobs get easier — pick up the kit, rent the tool, earn the cert. Built for working pros, not weekend warriors."*

**Primary audience.** Contractors / pros (supply side).

**Secondary audience.** Property managers (kit dispatch for in-portfolio repairs), specialty pros needing rental tools or certifications.

**What it does.**
- Operates physical Hub locations (3,000 sqft baseline: 60% warehouse, 20% showroom, 20% training classroom) where pros pick up job-matched kits, rent equipment, attend manufacturer-sponsored training, and earn certifications that flow back to their Sherpa Marketplace profile.
- Provides Sherpa-priced kits 20–30% below Home Depot retail via direct-buy supplier relationships (Schluter, Laticrete, DAP, GreenGuard).
- Acts as the pro community anchor — branded gear, in-person community, manufacturer partnerships, training revenue.

**Pricing model.** Per-transaction (kits, rentals, training) + manufacturer sponsorship revenue ($3K/event + consignment fleet at 40% off retail). Membership tier TBD (open question — could replace per-Hub fees with annual Pro Hub Membership).

**Status.** **DESIGNED.** Full physical layout, software modules (5), kit catalog (10 starter kits), rental fleet (20 tools), training calendar (12 events/yr), data model (7 tables), and manufacturer partnership pitch all spec'd. Not built.

**Phase timing.**
- Phase 0 (now): No build. Hub is a Phase 2 capital investment.
- Phase 1: Hub remains designed-but-not-built; Marketplace must hit 50+ pros + 200+ jobs first.
- Phase 2 (Q3 2026): **Hub 1 launches** — Portsmouth NH OR Boston metro (open question — see §9). Capital: ~$100K (lease + inventory + buildout).
- Phase 3: Hubs 2–3 (Manchester NH + Portland ME, then Boston/Providence). Capital: $250K.
- Phase 4: 10–20 Hubs via franchise model (Northeast corridor).

**Tech / ops dependencies.** Extends existing `hubs` table with `hub_type` config. New tables: `hub_kit_templates`, `hub_inventory`, `hub_equipment`, `hub_rentals`, `hub_training_events`, `hub_training_registrations`, `hub_kit_orders`. Integrates Stripe Connect (deposits + kit payments), `pro_certifications` (auto-populated from training), Dispatch Wiseman (Hub-proximity scoring bonus).

**Cross-product hooks.**
- ← **Sherpa Marketplace**: pro who completes Y Marketplace jobs near a physical Hub becomes a Hub member candidate; Marketplace job triggers kit pre-order at the right Hub.
- → **Sherpa Marketplace**: Hub-stocked + Hub-trained pros get Dispatch Wiseman scoring bonus, more matches, higher GMV — closing the loop.
- → **Sherpa Manager**: Hub manager (the human running each physical Hub) becomes a natural local Sherpa Manager for nearby PMs.

---

### 2.3 Sherpa Home — *the homeowner membership* (NEW)

**Product positioning.** *"Membership that actually pays for itself — discounts, faster pros, and one free emergency call a year. Built for the homeowner who does more than one project."*

**Primary audience.** Recurring residential homeowners (3+ jobs/year; older-home, larger-home, or premium homeowner segments).

**Secondary audience.** Single-property landlords ascending toward Multi-Property Owner status; specialty / older-home owners.

**What it does.**
- Annual or monthly membership granting: priority dispatch (Founding Pros respond first), free baseline Project Protection on every job, 1 free emergency call/year, annual maintenance check-up, 5% off all completed jobs.
- Bundled with embedded protection product line — backed by white-label home warranty partner (Super, 2-10, Old Republic, HomeServe).
- Acts as the LTV engine for residential homeowners — converts one-time Marketplace buyers into recurring members.

**Pricing model.** **Open question — see §9.** Working hypothesis: $19/mo OR $199/yr (~$50/yr commission per member at 25% revenue share with home warranty partner). Could alternatively be tiered (e.g., Sherpa Home Standard $19/mo, Sherpa Home Plus $49/mo with higher discount + concierge access).

**Status.** **NEW** — product brief in progress (Wave 6.3 writing detailed spec). No code yet.

**Phase timing.**
- Phase 0 (now): No build. Phyrom needs to lock pricing model first.
- Phase 1: **Public launch** — subscription billing built (Stripe recurring), home warranty partner signed, 500-member target by end of Phase 1.
- Phase 2: 5,000-member target. Tiered offerings, premium concierge add-on.
- Phase 3: Cross-sell into PM tier (homeowner becomes landlord becomes PM).
- Phase 4: National expansion alongside Marketplace.

**Tech / ops dependencies.** Stripe recurring billing (new — Marketplace currently per-transaction only), home warranty partner API integration, member-priority signal added to Dispatch Wiseman scoring, member dashboard added to client app.

**Cross-product hooks.**
- ← **Sherpa Marketplace**: post-job nudge after 2nd or 3rd job converts homeowner into Sherpa Home member.
- → **Sherpa Manager**: Sherpa Home member who acquires 2+ rental properties auto-routes to a Sherpa Manager intake.
- → **Sherpa Marketplace**: members get priority match → faster booking → higher engagement → more GMV.

---

### 2.4 Sherpa Manager — *the managed-service tier* (NEW)

**Product positioning.** *"A real person who owns your account — not a chatbot, not a portal. Built for property managers, multi-property owners, large companies, and homeowners who want hands-off."*

**Primary audience.** Property Managers (1,000+ unit chains), Multi-Property Owners (5+ rental properties), large companies (corporate facilities), white-glove residential homeowners.

**Secondary audience.** Utility partners (Mass Save, National Grid Turnkey) operating at-scale rebate programs.

**What it does.**
- Assigns a dedicated human Sherpa Manager who owns the customer relationship: vendor sourcing, work-order intake, scheduling coordination, dispute mediation, monthly reporting, NOI/CapEx tracking for PMs.
- Layers on top of Sherpa Marketplace + Sherpa Home — the Manager USES those products on the customer's behalf, the customer doesn't have to learn the apps.
- Replaces the per-vendor COI/insurance/license tracking burden, the "juggling 40 contractors in spreadsheets" PM pain point identified in §3.2 of the GTM spec.

**Pricing model.** **Open question — see §9.** Two candidates:
1. **Fixed retainer:** $499–$2,499/mo depending on portfolio size + service tier.
2. **% of managed portfolio GMV:** 3–5% on top of standard 10% take rate (so total 13–15% effective take, but customer experience is fully managed).
Likely answer: hybrid (small base retainer + variable component).

**Status.** **NEW.** No spec yet — this document is the first formal capture. Manager service overlaps with the existing PM tier in the GTM spec but is distinct: PM tier is a SaaS pricing tier ($4/unit → $1.50/unit at scale); Manager is the human-led service layer that PMs (and others) buy on top.

**Phase timing.**
- Phase 0 (now): No build, but Phyrom acts as the **Sherpa Manager prototype** for the first PM anchor (signal-collecting, workflow-discovering).
- Phase 1: First paid Sherpa Manager engagement — the Phase 1 PM anchor becomes the alpha Sherpa Manager customer. Hire 1 dedicated Manager (Pro Success Manager role evolves).
- Phase 2: **Full Manager service rollout** — 3+ PM chain anchors, 1+ Multi-Property Owner, 1+ White Glove residential, dedicated Manager team (3–5 humans), CRM minimum-viable built (probably HubSpot or similar SaaS, not custom Phase 2).
- Phase 3: White-label Manager service for utility partners (Eversource, National Grid). Manager team scales to 10+.
- Phase 4: International product expansion.

**Tech / ops dependencies.** Minimum-viable CRM (HubSpot or similar — not custom build), monthly reporting templates, integration with Marketplace job-history and Sherpa Home member status, integration with QBO for PM invoicing, integration with BldSync PM module (pre-existing — already operational at HJD Builders) for the work-order intake side.

**Cross-product hooks.**
- ← **Sherpa Marketplace** (PM tier auto-flag): PM customer growing past 50 units triggers Manager intake.
- ← **Sherpa Home** (Multi-Property Owner upgrade): Sherpa Home member with 2+ rentals triggers Manager intake.
- → **Sherpa Marketplace + Sherpa Home + Sherpa Hub**: Manager runs the customer's entire Sherpa relationship across all three products. The customer experiences ONE relationship, the brand experiences three product surfaces compounding.

---

### 2.5 Sherpa Rewards — *the loyalty engine* (LIVE)

**Product positioning.** *"Every job earns points. Real points, real money — gift cards, tools, branded gear, the things working pros actually want. Loyalty that pays."*

**Primary audience.** Trades / Pros across every tier (Founding Pro, Gold, Silver, Bronze, Sherpa Flex). Gold-tier pros maximize value via Gold-Exclusive catalog access.

**Secondary audience.** Pros considering platform-switch — Sherpa Rewards is a hard-to-copy retention moat versus Angi / Thumbtack lead-gen models.

**What it does.**
- Mints points on the actions that drive marketplace quality: **100 pts/job completed · 50 pts/5-star review · 25 pts/photo upload (before/after documentation) · 25 pts/on-time arrival · 50–200 pts/month Sherpa Score tier bonus (Bronze < Silver < Gold) · 500 pts/successful pro referral**.
- Catalog: **21 items** spanning branded apparel, tools (Milwaukee, DeWalt, Festool), gift cards, personal items, experiences. **Gold-Exclusive items** locked behind Sherpa Score Gold tier (only Gold pros can redeem the top-shelf catalog).
- Backend: redemption fulfillment via the **Tremendous API** (`src/lib/services/tremendous.ts`) — real money payout (gift cards, prepaid debit, charity donations, etc.) with sandbox + production environments. Mock mode runs when no API key is set so dev environments still preview the redemption flow.
- API surface: `GET/POST /api/rewards`, `GET /api/rewards/products`, `POST /api/rewards/webhook` (handles Tremendous order created / delivered / canceled events).
- UX: redeem confirmation modal with three states (confirm → processing → success), live point deduction, redemption history, mock-mode banner when running locally.

**Pricing model.** **No subscription fee for the pro.** Funded by platform margin. Each redemption draws real cash against the Sherpa Pros Tremendous account balance (so unit economics are: GMV × take-rate − points-redeemed × Tremendous-cost). Phase 1 budget controls: Gold-tier monthly bonus cap, redemption cooldowns, anti-gaming rate limits (already wired into `src/lib/incentives/rewards`).

**Status.** **LIVE.** `/pro/rewards` shipped 2026-04-25 (commits `08b1a5f` page + sidebar + `a4b455a` Tremendous integration). Sidebar entry uses gift icon. Score detail page (`/pro/score`) integrates point balance + 3 featured rewards.

**Phase timing.**
- Phase 0 (now, LIVE): Mock mode in dev; live Tremendous API in production with sandbox keys for the beta cohort. Beta pros begin earning points day-one.
- Phase 1: Catalog tuning based on redemption analytics; Gold-Exclusive catalog expansion; pro-referral campaign formalized as the highest-value point action.
- Phase 2: Tiered point-multiplier events (e.g., "double-points weekend" for capacity-fill); brand-partner co-funded catalog items (Milwaukee, DeWalt, Festool sponsorships).
- Phase 3: Sherpa Rewards opens to homeowner side as well (cross-product loyalty — Sherpa Home members earn points on jobs that convert to Sherpa Marketplace bookings).

**Tech / ops dependencies.** Tremendous API key (env-gated, lazy SDK init), `src/lib/incentives/rewards.ts` catalog + point-values, `src/lib/services/tremendous.ts` service wrapper, webhook signature verification, redemption history table, anti-gaming rate limiters.

**Cross-product hooks.**
- ← **Sherpa Marketplace**: every completed job, every 5-star review, every on-time arrival, every photo-doc upload mints points. Marketplace activity IS the points-earning engine.
- ← **Sherpa Flex**: Sherpa Flex pros earn points on the same schedule as Standard pros — even before they form an LLC. Sherpa Flex + Sherpa Rewards together = the lowest-friction on-ramp for new tradespeople.
- ↔ **Sherpa Score**: Sherpa Score tier (Gold/Silver/Bronze) drives the monthly point bonus and gates Gold-Exclusive catalog items. Score and Rewards are linked products — climbing Score increases the Rewards take.
- → **Sherpa Marketplace** (retention loop): Sherpa Rewards is the hard-to-copy moat that keeps pros from drifting to Angi / Thumbtack — earned-but-unredeemed point balances are real switching cost.

---

### 2.6 Sherpa Flex — *the side-hustle on-ramp* (LIVE)

**Product positioning.** *"For skilled tradespeople who do work on the side. No LLC required. No personal insurance policy required. Sherpa Pros provides per-project liability coverage built into the service fee."*

**Primary audience.**
- Skilled tradespeople with a W-2 day job — moonlighters who want side income without forming a business entity
- Construction-company employees with available time (slow weeks, weather days, between-project gaps) — directly addresses the **"Companies with employees with available time"** segment Interpretation B that was previously deferred to Phase 2 (see `docs/operations/companies-employee-time-segment.md`)
- Pros who want to test the Sherpa Pros platform before committing to LLC formation + insurance procurement

**Secondary audience.** Newly-licensed tradespeople (recent-graduate apprentices, career-switchers) who haven't yet built the financial cushion to carry their own general-liability insurance.

**What it does.**
- Standard onboarding plus skills verification (photo portfolio + knowledge quiz) plus background check.
- Every accepted job carries **per-project platform liability insurance** built in — $1M general liability per occurrence / $2M aggregate, $500K property damage, personal injury protection included. Coverage is valid only during active Sherpa Pros jobs (not the pro's day-job hours).
- Pro is a **1099 independent contractor** — same legal status as every other Sherpa Pros pro. The pro picks their own jobs, sets their own schedule.
- **Eligibility constraints:** jobs **under $5,000 only** (larger jobs require Standard insurance), pro must maintain **Bronze or higher Sherpa Score**, valid government ID + skills assessment + background check.
- Includes in-product **LLC formation guide**, **insurance quote resources** (so the pro can graduate to Standard tier when ready), and a **fee comparison chart** (18% Sherpa Flex vs 12% Standard vs 8% Gold).

**Pricing model.** **18% take rate, no subscription.** The 6% premium over the 12% Standard tier funds the per-project platform liability insurance. Net effective fee to a Sherpa Flex pro is *lower than 12% Standard once you factor in the cost of carrying their own general-liability policy* — Sherpa Flex bundles the insurance the pro would otherwise have to buy.

**Status.** **LIVE.** `/pro/flex` shipped 2026-04-25 (commit `08b1a5f`). Sidebar entry in the bottom section.

**Phase timing.**
- Phase 0 (now, LIVE): Page live, eligibility flow live, insurance binder partner contracted (per-project rider).
- Phase 1: Outreach to construction-company HR + facilities operators whose tradesperson employees want side income (the previously-deferred Interpretation B path now ships).
- Phase 2: Sherpa Flex graduate cohort metric tracked — % of Flex pros who upgrade to Standard tier within 12 months becomes a key supply-side health indicator.
- Phase 3: Sherpa Flex tier rolls out alongside national marketplace expansion; partnership channels with trade-school career-services offices and union-apprenticeship programs.

**Tech / ops dependencies.** Per-project insurance binder API (carrier integration), eligibility gate (jobs <$5K, background check, Sherpa Score floor), fee-engine differentiation (18% vs 12% vs 8% by tier), upgrade flow (Sherpa Flex → Standard when own insurance + LLC verified).

**Cross-product hooks.**
- ↔ **Sherpa Marketplace**: Sherpa Flex pros transact through the same dispatch + match surface as every other tier. Sherpa Flex is a **fee/eligibility tier**, not a parallel marketplace.
- → **Sherpa Score climb path**: Sherpa Flex pro completes jobs → Sherpa Score grows → at any point pro can acquire own insurance + LLC and drop to Standard tier (12%) → keeps climbing Score → reaches Gold (8% + 4hr early access).
- ↔ **Sherpa Rewards**: Sherpa Flex pros earn rewards points on every job, review, photo, and on-time arrival. Loyalty engine works identically across all five tiers.
- → **Companies-w/employee-time segment Interpretation B**: Sherpa Flex's per-project platform insurance + sub-$5K ceiling + explicit independent-contractor framing dissolves the worker-classification risk that previously deferred this segment to Phase 2. Construction company HR can now point tradesperson employees at Sherpa Flex as a side-income channel without joint-employer / payroll-tax exposure (see `docs/operations/companies-employee-time-segment.md` 2026-04-25 update).

---

## 3. Cross-Product Flywheel

```
                          ┌──────────────────────────────────┐
                          │      SHERPA PROS (umbrella)      │
                          └──────────────────────────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────┐
        │                                 │                             │
        ▼                                 ▼                             ▼
┌────────────────┐               ┌────────────────┐           ┌──────────────────┐
│   MARKETPLACE  │◄──────────────│      HUB       │           │  HOME (subscr.)  │
│ (LIVE, dispatch│   pro flywheel│ (DESIGNED, P2) │           │   (NEW, P1)      │
│  + match — both│               │                │           │                  │
│  Project + Quick│               │ kits • rentals │           │ priority + 5% off│
│  Job lanes)     │               │ training • cert│           │ free guarantee   │
└────────────────┘               └────────────────┘           └──────────────────┘
        ▲                                 ▲                             │
        │                                 │                             │
        │                                 │                             ▼
        │                                 │                   ┌──────────────────┐
        │                                 └───────────────────│ MANAGER (NEW, P1)│
        │     PM auto-flag (>50 units)                        │ dedicated human  │
        └─────────────────────────────────────────────────────│ owns the account │
                                                              └──────────────────┘
```

### 3.1 Homeowner journey: Marketplace → Home → Manager

A homeowner posts their first $250 Quick Job (toilet install) on **Sherpa Marketplace**. Pro shows up in 30 minutes, fixes it, customer rates 5 stars. Two months later: $25K kitchen Project (Project mode). Six months later: post-job nudge — *"You've used Sherpa Marketplace 3 times. Sherpa Home members save 5% on every job + skip the line + get free emergency calls. $19/mo."* Customer subscribes to **Sherpa Home**. Two years later: customer inherits a duplex, becomes a single-property landlord, then buys a triple-decker, then a small portfolio. Auto-routed to **Sherpa Manager** intake — *"You're managing 5 properties across 2 metros. Your Sherpa Manager handles vendor sourcing, scheduling, monthly reports, dispute mediation. $1,499/mo. Want a 30-min call?"*

### 3.2 Pro journey: Marketplace → Hub

A handyman signs up for **Sherpa Marketplace** to take Quick Jobs. After 30 days and 25 jobs, he's a top-quartile pro by NPS. System sends Hub invite — *"Pickup your kits 30% cheaper than Home Depot, rent the Festool track saw for $45/day, attend the free Schluter shower-system training next month. Founding Pro Hub Membership: $99/yr (or $0 if you're a Founding Marketplace Pro)."* Pro joins **Sherpa Hub**. Now he's stocked with kits, certified, equipped — Dispatch Wiseman gives him a Hub-proximity scoring bonus, he gets more matches, GMV compounds. Hub becomes the moat that competitors (Angi, Thumbtack, Handy) can't replicate without owning physical inventory.

### 3.3 Homeowner-to-landlord: Home → Multi-Property Owner → Manager

A **Sherpa Home** member buys a second property (rental) and a third (Airbnb). At property #3, system flags the account: *"You're managing 3+ properties. Sherpa Home doesn't fit anymore — you need Sherpa Manager. Want to talk?"* Manager intake call converts to a $999/mo fixed-retainer engagement. Customer's three properties stay on Marketplace + Home, but a human Manager runs them all.

### 3.4 PM tier upgrade: Marketplace PM tier → Manager

A Property Manager signs up for the **Sherpa Marketplace** PM tier ($4/unit/yr → $1.50/unit at scale). At 50 units, the SaaS tier still works. At 200 units, the PM is overwhelmed coordinating vendor scheduling, COI tracking, monthly reporting. Auto-flag → **Sherpa Manager** intake. PM upgrades to Manager ($1,999/mo for the full service). PM tier subscription stays (it's the underlying platform); Manager is the human layer on top.

---

## 4. Bundle / Package Opportunities

| Bundle | Composition | Audience | Pricing strategy |
|---|---|---|---|
| **Sherpa Pros Owner Bundle** | Marketplace (free) + Sherpa Home subscription | Homeowner | Sherpa Home priced standalone; Marketplace usage is free either way. Bundle is "join Home, keep using Marketplace." |
| **Sherpa Pros Pro Bundle** | Marketplace pro account + Sherpa Hub membership + **Sherpa Rewards (auto-included)** | Contractor (Standard or Gold tier) | Marketplace $49/mo + Hub $99/yr + Sherpa Rewards points-from-day-one. Bundle: "Founding Pros get Hub free for year 1 + double Rewards points for first 90 days." |
| **Sherpa Pros PM Bundle** | Marketplace PM tier + Sherpa Success Manager | Property Manager | Marketplace PM tier ($4/unit/yr → $1.50/unit at scale) + Manager retainer ($999–$2,499/mo). Bundle: discount Manager retainer if PM has >100 units on Marketplace. |
| **Sherpa Pros White Glove Bundle** | Marketplace + Sherpa Home + Sherpa Success Manager | Premium homeowner / Multi-Property Owner | Single quoted price ($299–$499/mo) wrapping all three. Most managed product. |
| **Sherpa Pros "No LLC Starter" Bundle** *(NEW)* | **Sherpa Flex** + **Sherpa Rewards** + LLC formation guide | Side-hustle / moonlighter / construction-company employee | Pro joins as Sherpa Flex (18%, insurance included, no LLC), earns Sherpa Rewards points on every job. In-product LLC formation walkthrough nudges upgrade to Standard tier when ready. Entry-level acquisition bundle for the supply side. |
| **Sherpa Pros "All Tiers Earn"** *(structural)* | Every pro tier (Founding Pro · Gold · Silver · Bronze · Sherpa Flex) earns Sherpa Rewards | All pros | Sherpa Rewards is not a separate purchase — it's a loyalty layer that runs on every transaction. Catalog tier-locking (Gold-Exclusive items) creates the only Score-driven differentiation. |

**Bundle pricing — open question.** Discount the bundle vs. standalone, OR keep prices independent and let the bundle exist as a marketing wrapper only? See §9 Q5.

---

## 5. Naming Conventions (locked — Brand Guardian uses for future audits)

**Always use:**
- "Sherpa Marketplace" (the dispatch + match product)
- "Sherpa Hub" (the physical pickup point)
- "Sherpa Home" (the homeowner membership)
- "Sherpa Manager" (the managed-service tier — pending §9 Q4 final naming)
- "Sherpa Pros" — the umbrella brand only. Never a product.

**Never use:**
- "the Sherpa Pros app" → ambiguous (which app? Marketplace? Home?). Always say which product. **NEW: BANNED.**
- "Wiseman" externally (internal code-intelligence layer; never appears in any Sherpa product name or external surface)
- "Dispatch Wiseman" externally (internal matching engine; user-facing surface is just "Sherpa Marketplace dispatch")
- "BldSync" externally (sister-brand internal platform; never appears in Sherpa product surfaces)
- "Uber for X" externally (internal shorthand only)
- "AI-powered" as a headline (the AI is the means, not the message)
- Region-anchored brand names ("Sherpa Pros New England" / "NE-only") — the brand is national; the launch sequence is operational

**Phyrom naming rules:**
- Surname **UNKNOWN** — always "Phyrom" only.
- Founder origin: "working New Hampshire general contractor" / "founder of HJD Builders LLC."
- NH origin is real biography; brand identity is national.

**Internal product names that stay internal:**
- Wiseman (any flavor — Code, Assembly, Architect, Pricing, Checklist, Dispatch)
- BldSync (the construction-management sister product; Sherpa Pros customers should never see this name)
- Sherpa Concierge / Sherpa Success Persona (SCP/SSP — internal AI-augmentation layer terminology)

---

## 6. Strategic Implications

1. **Each product needs its own positioning + brand presence.** Sherpa Home isn't a checkbox inside Marketplace — it's an audience-acquisition surface that must stand on its own. Same for Hub, same for Manager. Brand Guardian audits run per-product, not just at the umbrella level.

2. **Multi-product brand means multiple landing pages on thesherpapros.com.** Minimum: `/marketplace`, `/home`, `/pros` (the pro side of Marketplace + Hub recruiting), `/managers` (Sherpa Manager intake). Possibly `/hub` as a separate page for the physical-location product once Hub 1 launches.

3. **PR + investor narrative shifts from "another marketplace" to "multi-product platform."** Series A pitch (Phase 2 → Phase 3 raise) leads with the four-product flywheel, not just GMV growth. Defensibility argument upgrades: Angi can copy a marketplace UI; they cannot copy a Hub network + Home subscription + Manager service team simultaneously.

4. **Pricing complexity goes up sharply.** Each product needs unit-economics modeling (CAC, LTV, gross margin, attach rate), and bundle pricing needs cross-product P&L attribution. CFO/Controller hire (Phase 3) becomes more important earlier.

5. **Engineering scope increases.** Phase 1 must build: Sherpa Home subscription billing (Stripe recurring) + home warranty partner integration + Manager minimum-viable CRM. These are net-new vs. the existing Marketplace codebase. Engineering capacity allocation is a real Phase 1 decision (see §8 Risk R-eng).

6. **Brand voice unifies; product voices specialize.** Umbrella voice = founder, plainspoken, "jobs not leads." Marketplace voice = transactional + urgent. Home voice = warm + savings-focused. Hub voice = pro-to-pro, gritty, equipment-and-supplies tone. Manager voice = enterprise + trust + relationship.

---

## 7. Phase-by-Phase Product Launch Sequence

| Phase | Months | Marketplace | Hub | Home | Manager |
|---|---|---|---|---|---|
| **Phase 0** | 0–3 | **Beta live** (Project + Quick Job lane spec'd) | designed only | spec in progress (Wave 6.3) | Phyrom acts as prototype for first PM anchor |
| **Phase 1** | 3–6 | **Public launch** 4 metros (Portsmouth, Manchester, Portland, Boston specialty) + Quick Job lane goes live M4–5 | designed only | **Public launch** — subscription billing built, home warranty partner signed, 500-member target | **First paid Manager engagement** — Phase 1 PM anchor becomes alpha customer; 1 dedicated Manager hired |
| **Phase 2** | 6–12 | scaled 4-metro footprint, 1,000 jobs/mo, $1M+ GMV, take rate stable at 10% | **Hub 1 launches** Q3 2026 (Portsmouth or Boston — see §9 Q3); $100K capex; 200 registered pros, 150 kit orders/mo, 60% tool utilization | 5,000-member target; tiered offerings (Standard / Plus); premium concierge add-on | **Full Manager service rollout** — 3+ PM chain anchors, 1+ Multi-Property Owner, 1+ White Glove residential, 3–5 Manager humans on staff, MVP CRM live |
| **Phase 3** | 12–18 | 6 metros active, $5M+ GMV, 3 PM chains, 1 utility partner | Hubs 2–3 launch (Manchester + Portland, then Providence); franchise model design begins | cross-sell into PM tier, Multi-Property Owner cohort identified | white-label Manager service for utility partners (Eversource, National Grid); team scales to 10+ |
| **Phase 4** | 18+ | national scale, international expansion prep | 10–20 Hubs via franchise, Northeast corridor | national expansion alongside Marketplace | international Manager tier; Manager = exit-narrative anchor for strategic acquirer |

---

## 8. Risk Register Additions (multi-product specific — additive to GTM spec §10)

| # | Risk | Phase | Severity | Early signal | Mitigation |
|---|---|---|---|---|---|
| **R-brand** | **Brand dilution** — 4 products = 4× brand surface area; messaging gets muddled, customers don't know which Sherpa product to ask about | All | High | Customer support tickets ask "is this Sherpa Marketplace or Sherpa Home?"; landing-page bounce on `/home` because visitors expected Marketplace | Brand Guardian runs per-product audits monthly; lock naming conventions in §5 above; never say "the Sherpa Pros app" — always specify the product |
| **R-arb** | **Pricing arbitrage** — homeowner buys Sherpa Home subscription specifically to access pro discounts that are economically borne by the pro, not Sherpa Pros | 1/2 | Medium | Pro complaints about Home-member discounts cutting into job margin; Home-member jobs converting at lower margin than non-member jobs | Discounts on Home subscription are funded by Sherpa Pros margin (commission rebate), NOT by pros; pro take rate stays 5%/10% regardless of customer membership |
| **R-channel** | **Channel conflict** — PM customer with a dedicated Sherpa Manager stops using Marketplace directly because "the Manager handles it"; Marketplace usage data thins for Manager-served accounts | 2/3 | Medium | Manager-served accounts show <50% of expected Marketplace job volume; PM never logs into Marketplace directly | Manager USES Marketplace on the customer's behalf; all jobs still flow through Marketplace (it's the dispatch substrate); Manager is a relationship layer, not a parallel system |
| **R-eng** | **Engineering split-attention** — 4 products = 4 separate roadmaps competing for finite engineering time; Marketplace velocity slows because engineers are building Home billing or Manager CRM | 1/2 | High | Marketplace bug backlog grows; Phase 1 metric gates slip; engineers report burnout from context-switching | Phase 1 sequencing: Marketplace stays the priority; Sherpa Home billing is a small, focused build (Stripe recurring + 1 home warranty integration); Manager CRM is OFF-THE-SHELF (HubSpot), not custom; Hub engineering stays Phase 2 |
| **R-cannibal** | **Bundle cannibalization** — White Glove bundle revenue cannibalizes higher-margin standalone Manager revenue | 2/3 | Low | White Glove bundle attach > standalone Manager attach by 5×; standalone Manager revenue declines | Price the bundle to be a clear premium over standalone Marketplace + Home, not a discount on Manager; Manager standalone stays the highest-margin tier |
| **R-warranty** | **Home warranty partner failure** — chosen home warranty partner (Super, 2-10, Old Republic, HomeServe) loses license, raises rates, or exits market mid-Phase 1 | 1/2 | Medium | Partner downgrades from A.M. Best A-rated; partner raises commission split unfavorably; partner announces exit | Sign with two warranty partners minimum (primary + backup); contract Phase 1 carefully with out-clauses; design Sherpa Home so the warranty backend is swappable, not load-bearing on a single partner |

---

## 9. Open Questions for Phyrom

1. **Sherpa Home subscription pricing model.** Flat ($19/mo? $49/mo? $199/yr?) or % discount tier (e.g., 5% off all jobs forever for $X/mo)? Recommendation: launch with flat $19/mo (industry-standard subscription pricing, easier to communicate, easier to model unit economics); revisit tiered + % models in Phase 2 once attach data is real.

2. **Sherpa Manager pricing model.** Fixed monthly retainer ($499–$2,499/mo by portfolio size) OR % of managed portfolio GMV (3–5% on top of standard 10% take)? Recommendation: hybrid (small base retainer covers Manager human cost + variable component aligns to value delivered), but pick a model and lock for Phase 1 rather than A/B testing.

3. **Hub physical location strategy.** Own/lease standalone (~$100K capex per Hub) OR partner with existing supply houses (FW Webb, Lowe's Pro, Rockler) to put Sherpa Hub mini-counters inside their footprints (lower capex, faster scale, less brand control)? Recommendation: Hub 1 standalone (proves the model + brand) → Hub 2+ partner-embedded.

4. **Sherpa Manager naming.** "Sherpa Account Manager" vs. "Sherpa Success Manager" vs. "Sherpa Manager" — pick one, lock for Brand Guardian. Recommendation: **"Sherpa Manager"** — shortest, parses cleanly with the other three product names (Marketplace / Hub / Home / Manager), avoids the SaaS-y "Success Manager" cliché.

5. **Bundle pricing logic.** Discount for cross-product bundle purchase OR keep prices stand-alone (bundles are marketing wrappers only)? Recommendation: small bundle discount (10–15%) to drive cross-product attach in Phase 2; keep standalone prices clean.

6. **Sherpa Manager human-led or AI-augmented.** Pure human-led (high cost per customer, premium positioning) OR AI-augmented using internal SCP/SSP (Sherpa Concierge Persona / Sherpa Success Persona) from BldSync, with humans escalation-only (lower cost, more scalable, risk of feeling chatbot-y)? Recommendation: **human-led with AI-augmented backend** — customer always talks to a human, but the human uses internal AI tools to be 5× more productive. Best of both.

7. **White Glove tier — homeowner only or also offered to PM/Multi-Property Owner?** Currently spec'd as homeowner-side bundle (Marketplace + Home + Manager). Should it also exist as a PM-side or Multi-Property Owner bundle, or does PM Bundle cover that case? Recommendation: keep White Glove as homeowner-only branding to preserve the premium consumer-feel; PM Bundle handles the commercial-side case with different language.

8. **PM tier vs. Manager service — same product different label, or different products?** PM tier (in current GTM spec §3.2) is a SaaS pricing tier ($4/unit → $1.50/unit at scale) on Marketplace; Manager (this doc) is a managed-service human layer. Risk: customer/sales confusion. Recommendation: **two distinct products** — PM tier is the SaaS substrate (any PM can self-serve), Manager is the optional human layer on top (only for PMs that want hands-off). Marketing landing page must explain the difference clearly: *"PM tier is the platform you use; Sherpa Manager is the person who uses it for you."*

---

## 10. Brand-Bible Compliance Checklist (per-product)

| Rule | Marketplace | Hub | Home | Manager |
|---|---|---|---|---|
| Plainspoken / 8th-grade reading level | ✓ | ✓ | ✓ | ✓ (slightly more enterprise — but still no jargon) |
| "Licensed · Verified · Code-aware · Built by a contractor · Local · Jobs, not leads · National" — at least 3 of these on every landing page | ✓ | ✓ ("Built for working pros") | ✓ | ✓ |
| Never "Wiseman" externally | ✓ | ✓ | ✓ | ✓ |
| Never "Uber for X" externally | ✓ | ✓ | ✓ | ✓ |
| Never "AI-powered" as headline | ✓ | ✓ | ✓ | ✓ (esp. important for Manager — it's a HUMAN service, AI is hidden plumbing) |
| Never region-anchored brand language | ✓ | ✓ (per-Hub locations are operational, not brand-cap) | ✓ | ✓ |
| Phyrom surname stays UNKNOWN — "Phyrom" only | ✓ | ✓ | ✓ | ✓ |
| Founder origin: "working New Hampshire general contractor" / HJD Builders LLC | ✓ | ✓ | ✓ | ✓ |
| Never "the Sherpa Pros app" — always specify which product | ✓ | ✓ | ✓ | ✓ |

---

## 11. Last Updated

**2026-04-22** — v1 by Claude (Wave 6.2). Brand-architecture spec capturing the four-product portfolio. Companion to Wave 6.1 (GTM spec §3.5 update) and Wave 6.3 (Sherpa Home product brief). Phyrom reviews and locks naming + open-question answers before Brand Guardian runs first per-product audit.
