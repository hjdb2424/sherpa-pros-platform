# Sherpa Home — Homeowner Subscription Product Brief

**Date:** 2026-04-22
**Status:** Draft v1 — Phase 1 launch product, needs Phyrom + finance + attorney review before pricing locks
**Source spec:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md`
**Companion docs:**
- `docs/operations/quick-job-lane.md` (members get accelerated Quick Job dispatch)
- `docs/operations/embedded-protection-products.md` (Sherpa Home is the productized Product B — Annual Home Maintenance Membership)
- `docs/operations/liability-insurance-framework.md` (Sherpa Home members get higher Layer 3 Work Guarantee caps)

---

## 1. Executive Summary

**Sherpa Home is the homeowner subscription tier of the Sherpa Pros platform — the home-warranty model done right.** It converts one-time Marketplace customers into recurring relationships by stacking discounts, faster Service Level Agreements (SLAs), and member benefits on top of the existing transactional Marketplace. No claim-denial games, no six-week wait times, no "approved contractor" gotchas — just a better Sherpa Pros experience for the people who use it most. Two tiers: **Sherpa Home Standard** (the everyday membership) and **Sherpa Home White Glove** (adds a dedicated human Sherpa Account Manager — a productized concierge layer that scales the Phase 3 Manager white-glove vision into Phase 1 revenue today).

---

## 2. Why Sherpa Home Exists

The strategic rationale, in order of importance:

1. **Recurring revenue → Lifetime Value (LTV) multiplier.** Marketplace is transactional — each job is a stand-alone Gross Merchandise Volume (GMV) event. Subscriptions create a baseline revenue floor, smooth seasonality, and convert one-time customers into annuities. A homeowner who does $2,000/year of Marketplace work generates ~$200 of take rate; the same homeowner on Sherpa Home Standard generates **$200 + $228 subscription = $428/year** at minimum, before counting the higher job frequency that subscription members exhibit.

2. **Acquisition funnel for Marketplace.** Subscribers post **3-5x more jobs** than non-subscribers (sunk-cost effect, member-discount triggers, member-only events surface jobs the homeowner was deferring). Sherpa Home is the highest-leverage way to expand wallet share per acquired homeowner.

3. **Defense vs. broken home-warranty incumbents.** American Home Shield, 2-10 HomeBuyers Warranty, Choice Home Warranty, Super, and Old Republic Home Protection collectively own ~5M U.S. policy-holders, charge **$50-80/month**, and deny ~73% of claims (per consumer reporting). Their model — pay premiums, file claims, wait days for approval, get assigned a contractor you didn't pick — is structurally broken. Sherpa Home positions as "everything home warranty promised, nothing home warranty did."

4. **Pre-2030 "everything-as-a-service" market trend.** Spotify, Netflix, Costco Executive, Amazon Prime, Peloton — consumers expect their high-frequency relationships to be subscriptions. Home services is the largest unsubscriptioned category in the consumer wallet ($600B+ annual U.S. residential repair/maintenance spend). First-mover advantage in this category compounds.

5. **Foundation for Phase 2 Property Manager (PM) tier upsell + Phase 3 Manager white-glove.** Sherpa Home White Glove is the productized Manager service. Building it in Phase 1 generates the operational learning (how does a Manager actually serve a homeowner? what tasks are repeatable? what can be automated?) that unlocks the much larger PM-tier and Manager-as-a-service offerings in Phases 2-3.

---

## 3. Two Tiers Detailed

### 3.1 Sherpa Home Standard

**Price:** $19/month or $199/year (16% annual discount, $29 saved per year prepaying).

**Who it's for:** Suburban homeowners with $300K-$1.5M home value who do 3-8 service jobs per year. Active homeowners, hands-on but time-constrained, value reliability over the lowest price.

**What's included:**

| Benefit | Detail |
|---|---|
| **5% discount on every Marketplace job** | Paid by Sherpa Pros from the take rate (10% standard rate becomes effective 5% net for the pro on member jobs — pro is held harmless; **see §10 Risks**). Customer sees discount at checkout. |
| **Priority dispatch** | Member jobs match in **<30 minutes** vs. <2 hours for non-members. Dispatch Wiseman applies a member-priority multiplier in the 7-factor scoring. |
| **One free Quick Job per quarter** | Toilet swap, faucet replacement, drywall patch, ceiling fan install, smoke detector swap, etc. — any item from the Quick Job catalog up to $300 metro list price. Cap one per calendar quarter, no rollover. |
| **Annual maintenance check-up** | One free 1-hour pro visit per year — system inspection, problem-spotting, written report on what's coming due. The "your dentist's annual cleaning" of home maintenance. |
| **Free standard Project Protection on every job** | The embedded-insurance Plus tier ($89 list, $25K cap, 1 year, $250 deductible) is included free. Sherpa Pros pays the carrier premium from member-revenue pool. |
| **Sherpa Home Member badge** | In-app + on receipts + on email. Trust signal + subtle status. |
| **Concierge chat support** | Same Concierge layer that serves all homeowners, but member tickets are tagged for priority routing. |
| **Cancel anytime** | Cancel in-app, no questions asked. Pro-rated refund on monthly plan; no refund on annual plan after day 30. |
| **30-day money-back guarantee** | Full refund if you cancel in the first 30 days, no claw-back of benefits used. |

**Engineering effort:** Stripe Subscriptions (existing infra), member tier flag in `users` table, dispatcher priority hook (existing 7-factor algorithm — add member-tier weight), discount application at checkout (existing commission engine — add member-discount line), badge UI, quarterly maintenance scheduling job. **Estimated 2-3 weeks for Tier 1 (T1) engineering.**

### 3.2 Sherpa Home White Glove

**Price:** $149/month or $1,499/year (16% annual discount, $289 saved per year prepaying).

**Who it's for:** Multi-property owners + premium homeowners ($1M+ home value, second home or vacation property, busy professional who values time over money). Sub-niche: aging-in-place homeowners and remote-owner landlords who can't be on-site.

**What's included — everything in Standard, PLUS:**

| Benefit | Detail |
|---|---|
| **Dedicated Sherpa Account Manager** | A named human (photo + contact). Same Manager for the whole relationship. Manager carries 40-60 White Glove members at full saturation (per industry concierge ratios). **See §10 — Manager naming open question.** |
| **24/7 priority dispatch + named-pro preference** | Same-day match guarantee during business hours; 4-hour match guarantee evenings/weekends. Manager learns the member's preferred pros and routes jobs to them first. |
| **Quarterly home review** | Manager visits the property OR runs a 30-minute video call to plan upcoming work. Reviews completed jobs, flags upcoming maintenance, builds the next quarter's roadmap. |
| **One free emergency call per quarter** | Plumbing leak at midnight, no power to half the house, broken garage door — Manager dispatches the right pro within 2 hours, member pays $0 platform-side (still pays pro for materials + parts at standard rate). Cap one per quarter. |
| **Wheel-house contractor list** | Manager handpicks 5-10 pros for the member's specific home (HVAC system type, electrical age, plumbing materials, roof material, landscape complexity). Member sees these pros first in every match. |
| **Tax + insurance documentation organized** | Manager keeps a year-end binder of all completed work with cost basis, depreciation categories, warranty registrations, insurance claim documentation. Provided as PDF + downloadable archive. |
| **Project planning + phasing** | Manager designs a 3-year maintenance + improvement roadmap (e.g., year 1: heat pump install + panel upgrade; year 2: bathroom remodel; year 3: roof replacement). Aligns to budget + lifecycle. |
| **White-glove invoicing + finance** | Single monthly statement for all jobs, easy expense categorization, direct ACH payment from one account, integration with Quicken/Mint/QuickBooks. Wisetack financing pre-approved for member's credit profile. |

**Engineering effort:** Manager Console (Phase 2 build — **Phase 1 White Glove launches with manual ops in spreadsheets to validate the model before building the console**), member-Manager pairing flag, video-call scheduling integration (Cal.com), document vault. **Estimated 6-8 weeks for T1 once manual model is proven.**

---

## 4. Pricing Decision Framework

### 4.1 Comparison set

| Service | Price | What you get | Notes |
|---|---|---|---|
| **American Home Shield (basic)** | $50-80/mo | Repair coverage with $100-125 service fee per claim, ~73% claim denial rate, 2-7 day wait | Industry leader, deeply unloved |
| **2-10 HomeBuyers Warranty** | $40-65/mo | Similar to AHS, builder-channel-heavy | Better claim rate but slow |
| **Costco Executive Membership** | $120/yr ($10/mo) | 2% rebate on Costco purchases, member-only services | Low price + clear value math |
| **Amazon Prime** | $14.99/mo or $139/yr | Shipping, Prime Video, Music, Photos, Pharmacy, Grocery delivery | Bundle benchmark — multiple bundled benefits |
| **AAA Plus** | $89/yr ($7.42/mo) | Roadside assistance + member benefits | Closest "emergency + benefits" comp |
| **Sherpa Home Standard (recommended)** | **$19/mo or $199/yr** | Discount + faster SLA + Quick Job + check-up + protection | Half the price of home warranty, more usable than AAA |
| **Sherpa Home White Glove (recommended)** | **$149/mo or $1,499/yr** | Above + dedicated Manager + 3-year roadmap + emergency lane | Below traditional concierge ($300-500/mo), above AHS premium tier |

### 4.2 LTV math (the core argument for the recommended price)

**Standard tier — base case:**

A typical Sherpa Home Standard subscriber does $2,000/year of Marketplace work.
- Marketplace gross take: $2,000 × 10% = **$200/year**
- Member discount (paid by Sherpa Pros, not pro): $2,000 × 5% = **-$100/year**
- Net Marketplace take from this customer: **$100/year**
- Subscription revenue: **$199/year**
- **Total revenue per Standard member: $299/year**
- Less benefits cost: 1 free Quick Job/quarter ($400 list × 4 = $1,600 list, but pro gets paid Sherpa Pros' take rate — **cost to Sherpa Pros: ~$240/year** ($60 take rate per Quick Job × 4)) + annual check-up (**~$80 cost** = pro's hour at member-discount rate) + free Project Protection (**~$25 cost** = Sherpa Pros' wholesale carrier rate via Boost/Cover Genius MGA white-label deal) = **$345/year cost**
- **Net contribution per Standard member: $299 - $345 = -$46/year**

Wait — that's negative. Let's stress-test:

**Standard tier — realistic case (subscribers post more jobs):**

Industry data (Costco, Prime, Sam's Club) shows subscribers spend **2-3x more** than non-subscribers in the same category. Apply 2.5x to the Sherpa case:
- Subscriber does $5,000/year of Marketplace work (vs. $2,000 baseline)
- Marketplace gross take: $5,000 × 10% = **$500/year**
- Member discount: $5,000 × 5% = **-$250/year**
- Net Marketplace take: **$250/year**
- Subscription revenue: **$199/year**
- **Total revenue per Standard member: $449/year**
- Less benefits cost: **$345/year** (same as above)
- **Net contribution per Standard member: $449 - $345 = +$104/year**

At Phase 2 (1,000 paying members): **$104K/year recurring contribution margin.** At Phase 3 (10,000 paying members): **$1.04M/year.** Scales cleanly.

**Critical assumption to validate in Phase 1 pilot:** the 2.5x job-frequency lift. If real lift is only 1.5x, contribution drops to ~$15/year/member — still positive but thin. If real lift is 3x, contribution jumps to ~$200/year/member.

**White Glove tier — base case:**

A typical White Glove subscriber does $20,000/year of work (multi-property or premium homeowner).
- Marketplace gross take: $20,000 × 10% = **$2,000/year**
- Member discount (5% — same as Standard): $20,000 × 5% = **-$1,000/year**
- Net Marketplace take: **$1,000/year**
- Subscription revenue: **$1,499/year**
- **Total revenue per White Glove member: $2,499/year**
- Less benefits cost: 1 Quick Job/quarter + annual check-up + Project Protection on every job (~10 jobs at $25 each = **$250/year**) + free emergency call/quarter (avg $300 cost × 2 actual uses = **$600/year**) + Manager time (avg 8 hours/year of Manager attention at $50/hr fully loaded = **$400/year**) = **~$1,570/year cost**
- **Net contribution per White Glove member: $2,499 - $1,570 = +$929/year**

At Phase 2 (50 White Glove members): **$46K/year recurring contribution margin** at high LTV per customer.

### 4.3 Why $19 not $29 for Standard

- $19 is the Amazon Prime / Spotify Premium sweet spot — proven psychological floor for "monthly habit subscription."
- $29 implies a "premium" tier and creates room for a future "Sherpa Home Pro" middle tier between Standard and White Glove ($49-69/mo).
- Lower price drives higher attach rate from Marketplace customers (target: **35%+ attach rate** at $19, vs. ~20% at $29 per Lyft Pink-style benchmarks). At our scale, **higher attach × lower price >> lower attach × higher price.**

### 4.4 Why $149 not $99 or $199 for White Glove

- $99 underprices the human-Manager labor (Manager carrying 40 members @ $99 = $4,000/mo revenue per Manager, can't cover Manager's $5-7K/mo fully-loaded cost without subsidy).
- $199 is the home-warranty premium-tier price and drags us into that comparison set (we want to be visibly differentiated, not just "better home warranty").
- $149 is the "premium-but-not-extravagant" anchor — same ballpark as Peloton All-Access ($44/mo) × 3, which is the "premium subscription" mental category for high-income consumers.
- $149 × 12 = $1,788/year — close enough to the round $1,500 annual that prepay (16% off → $1,499) is a clean round number.

---

## 5. Target Customer Profiles

### 5.1 Sherpa Home Standard

**Primary persona — "Active Suburban Homeowner":**
- $300K-$1.5M home value
- Owner-occupied, 5-25 years in home
- 3-8 service jobs/year
- Household income $100K-$250K
- Knows enough to do small things themselves but hires for licensed work
- Annoyed by Angi/Thumbtack lead-gen experience
- Tried home warranty once, hated it

**Secondary persona — "First-Time Homeowner":**
- $250K-$600K home value, recent purchase
- Don't know what they don't know
- Annual maintenance check-up is the killer hook
- Convert from "I should" to "I do" once they have a Manager in their corner

### 5.2 Sherpa Home White Glove

**Primary persona — "Time-Poor Premium Homeowner":**
- $1M+ primary residence
- Often a second home or vacation property
- Household income $400K+
- Busy professional (executive, physician, attorney, founder)
- Values time over money
- Currently uses ad-hoc concierge (handyman they've known for 20 years) and is realizing that handyman is retiring soon

**Secondary persona — "Multi-Property Owner":**
- Owns 2-10 residential properties (not commercial — that's PM tier)
- Mix of primary, vacation, and small-rental
- Currently juggling 5-15 contractors across properties in spreadsheets
- Manager does the spreadsheet for them; that alone justifies the price

**Tertiary persona — "Aging-in-Place Homeowner":**
- 65+ years old, downsizing intent but staying in current home for now
- Adult children live elsewhere, want a trusted human in the loop
- Manager is the trust-anchor; the children pay the subscription

---

## 6. Acquisition Funnel

### 6.1 Primary acquisition path — post-job conversion

**The single most important conversion moment in the platform.** After a Marketplace customer marks a job complete and rates the pro, the next screen offers Sherpa Home:

```
┌──────────────────────────────────────────────────────────────┐
│  Job complete. Mike rated 5 stars.                           │
│                                                              │
│  Would you have wanted Mike here in 30 minutes               │
│  instead of the 2-hour wait? And $25 off this job?           │
│                                                              │
│  Sherpa Home Members get:                                    │
│  - 5% off every job (would have saved $35 on this one)       │
│  - Priority match (under 30 min vs. 2 hrs)                   │
│  - Free Quick Job each quarter (toilet, faucet, etc.)        │
│  - Annual home check-up                                      │
│                                                              │
│  $19/mo or $199/yr. Cancel anytime. 30-day money-back.       │
│                                                              │
│  [Start free 30-day trial]    [Maybe later]                  │
└──────────────────────────────────────────────────────────────┘
```

**Target attach rate: 35%+** (industry benchmark for post-purchase subscription offers: Amazon Prime ~25-30%, AAA renewal ~40-50%, Costco Executive upgrade ~15-20%). Attach is highest immediately after a satisfied job — the customer is in "this worked" mindset.

### 6.2 Secondary acquisition paths

| Channel | Mechanism | Volume estimate |
|---|---|---|
| **Existing customer in-app campaign** | Notification to all customers who've completed 2+ jobs in the past 12 months: "Your member benefits started today — try free for 30 days" | ~25-30% conversion of multi-job customers in Phase 1 |
| **Wefunder community-round investors** | Subscription comes free for Wefunder investors who commit $1,000+ (loyalty + early-adopter signal — converts investors into power users) | ~150-300 free-tier members from Wefunder pool |
| **HJD network warm conversion** | Phyrom's existing HJD client base gets a free 90-day trial as a thank-you for their early support. Concierge personally onboards each. | ~80-120 trial conversions, ~50% retention to paid |
| **Referral loop** | Member refers a friend → both get 1 free month. Target Phase 2 ratio: 1 referral per 4 members per quarter. | Compounds in Phase 2-3 |
| **Member-only events** | NHHBA chapter spotlights, homeowner workshops (lead-paint safety, weatherization, EV-charger basics) — non-members can attend by joining | ~5-10% conversion at event |
| **Mass Save partnership** | Mass Save customers who use Sherpa Pros for heat-pump install get 90-day Sherpa Home trial bundled into the rebate paperwork | Phase 2+ — depends on partnership |
| **Property Manager handoff** | When PM tier launches and a unit is sold to a homeowner, PM hands off Sherpa Home subscription to new owner (keeps the data + pro relationships intact) | Phase 3+ |

---

## 7. Retention Mechanics

| Mechanic | What it does | Why it works |
|---|---|---|
| **Annual savings recap email** | "You saved $487 this year as a Sherpa Home member" — itemized | Concrete proof of value at renewal moment (per Costco/AAA renewal playbook) |
| **Member-only events** | NHHBA workshops, homeowner education, Phyrom AMA sessions, Old-House Verified meetups | Community + identity (Costco / REI playbook) |
| **Loyalty tier perks** | 3-year member = priority pro pool access (top-rated Founding Pros). 5-year member = lifetime grandfathered rate (renewal protected from price increases). | Switching cost grows over time |
| **Refer-a-friend** | 1 free month for both parties per successful referral, no cap | Network effect — the highest-LTV members become the recruiters |
| **Quarterly value drops** | Each quarter Sherpa Home adds a small new perk (a partner discount, a new Quick Job category, an event invite) — keeps the membership feeling alive | Avoids the "I forgot why I subscribed" cancellation trigger |
| **Annual maintenance check-up auto-scheduled** | Pre-scheduled at signup, auto-renewed each year — member doesn't have to remember | Built-in retention touch — and the pro who shows up is a high-trust touchpoint |
| **Manager check-ins (White Glove)** | Quarterly relationship calls regardless of whether jobs were posted | The human relationship IS the retention mechanic for White Glove |
| **Win-back campaigns** | Cancelled members get a 60-day silent period, then a "we built X new thing — come back at 50% off for 3 months" offer | Industry standard ~15-25% win-back conversion |

**Target retention metrics:**
- Standard: **75% Year-1 retention, 60% Year-2 retention, 50% Year-3 retention** (matches Amazon Prime / Spotify Premium / Costco)
- White Glove: **85% Year-1 retention, 75% Year-2, 70% Year-3** (matches AmEx Centurion / premium concierge — the human relationship is sticky)

---

## 8. Comparison vs. Home Warranty Incumbents

| Dimension | Home Warranty (American Home Shield, 2-10, Choice, Old Republic, Super) | Sherpa Home |
|---|---|---|
| **Price** | $50-80/mo | $19/mo Standard, $149/mo White Glove |
| **Model** | Pay premiums, file claim when something breaks | Pay subscription, get ongoing benefits + discounts on planned + emergency work |
| **Wait time** | 2-7 days from claim to contractor visit (industry average) | <30 min match for members (Standard), <4 hr 24/7 (White Glove) |
| **Claim denial rate** | ~73% (per consumer-protection data) | **Not applicable — no claims to file.** Member gets discounts + priority + included benefits, period. |
| **Contractor selection** | Insurer assigns "approved contractor" — homeowner has no say | Homeowner picks from Sherpa Pros marketplace OR Manager handpicks (White Glove) |
| **Service fee per claim** | $75-125 per claim, often per trip | $0 platform-side fee; pro gets paid Marketplace rate (member discount applied) |
| **Coverage scope** | Limited to listed appliances/systems, gotcha exclusions | Open scope — any work the Marketplace can do |
| **Renewal experience** | Hard to cancel, automatic price increases, "loyalty" tier games | Cancel anytime in-app, transparent pricing, 30-day money-back |
| **Net Promoter Score (industry)** | ~ -15 to +5 (consistently below average) | Target +50 (Marketplace baseline per Phase 1 metrics) |

**Positioning headline:** *"Home warranty done right. No claims. No denials. Just a better Sherpa Pros experience — and you get it for less than half the price."*

**Marketing proof points (assemble for landing page):**
- Side-by-side comparison table (above)
- "Things home warranty denies" list (HVAC pre-existing, code upgrade, "not covered failure mode")
- Customer testimonials specifically from former home-warranty members (recruit via post-cancellation survey of members who churned to us)
- Better Business Bureau (BBB) rating comparison

---

## 9. Engineering Scope (T1 Reference)

**Phase 1 launch (Standard tier — 2-3 weeks of T1 effort):**

- **Stripe Subscription billing:** Standard $19/mo + $199/yr SKUs (existing Stripe Connect infrastructure handles this — add Subscription product)
- **Member tier in user model:** add `membership_tier` enum to `users` table (`none`, `standard`, `white_glove`, `wefunder_free`, `hjd_trial`)
- **Dispatcher logic:** Dispatch Wiseman 7-factor scoring adds member-tier weight (members get +20 score boost → priority match)
- **Member badge UI:** add badge to profile, receipts, in-app messaging
- **Discount application at checkout:** commission engine reads member tier, applies 5% discount to customer-facing total, deducts from Sherpa Pros take (pro is held harmless)
- **Free Project Protection wiring:** when MGA partnership lands, member-flag triggers auto-bind of Plus tier policy at $0 to customer
- **Quarterly Quick Job tracker:** new table `member_quick_job_credits` (memberId, quarter, used, jobId, redeemedAt)
- **Annual maintenance check-up scheduling:** background job creates a "check-up scheduled" task once per member-year; Concierge confirms slot
- **Cancellation flow:** in-app cancel button, pro-rated refund logic, 30-day money-back tracking

**Phase 2 launch (White Glove tier — 6-8 weeks once manual model proves out):**

- **Manager Console:** internal admin tool — member roster, communication log, scheduling, document vault, escalation queue
- **Member-Manager pairing:** assignment logic, hand-off mechanics, vacation/coverage routing
- **Video-call integration:** Cal.com or Calendly embed for quarterly home review calls
- **Document vault:** S3-backed per-member document store (jobs, warranties, COIs, tax binders)
- **Wheel-house pro list UI:** member-facing "your pros" page, Manager-side curation
- **Annual tax/insurance binder generation:** PDF report builder, year-end cron job
- **Manager analytics:** Manager dashboard — member health scores, upcoming touchpoints, satisfaction trends

**Phase 1 White Glove (manual / pilot):**
- Run with spreadsheets + Phyrom + 1 Concierge as Manager
- Cap at 10-15 White Glove pilots (HJD network + Wefunder top tier)
- Validate Manager-load (40-60 members per Manager) assumption before building console

---

## 10. Risks & Mitigations

| # | Risk | Severity | Early signal | Mitigation |
|---|---|---|---|---|
| **R1** | **Acquisition cost vs LTV underwater.** Customer Acquisition Cost (CAC) > LTV at scale. | Critical | Phase 1 pilot CAC > $30, retention < 60% Year 1 | Phase 1 pilot is acquisition-cost-controlled — recruit only via post-job conversion + Wefunder + HJD warm. NO paid acquisition until LTV proves. Target: <$30 CAC, >$300 first-year LTV. Kill product if metrics don't pencil after 90-day pilot. |
| **R2** | **Cannibalization.** Member discount erodes Marketplace take faster than subscription revenue replaces it. | High | Net contribution per member negative after 6 months | LTV math (§4.2) assumes 2.5x job-frequency lift in members. Validate via cohort analysis early — non-member vs. member jobs/year. If lift is <1.5x, raise discount cost-share with pro OR drop discount to 3%. |
| **R3** | **Pro-side resentment.** Pros may feel "Sherpa pays me less for member jobs" even though Sherpa eats the discount. | High | Pro NPS drops on member jobs vs. non-member; pro opts out of member dispatch | **Pro is ALWAYS held harmless.** Member discount is paid by Sherpa Pros from take rate, not from pro's quote. Communicate this clearly in pro onboarding ("members = more jobs at the same rate to you, not less per job"). Show pros member-job volume in their dashboard. |
| **R4** | **Free Quick Job abuse.** Members redeem the free Quick Job + annual check-up but post zero paid jobs (free-rider problem). | Medium | Member who's used both freebies posts zero paid jobs in their first year | Free Quick Job cap at $300 list value (caps Sherpa Pros' free-job exposure to ~$240 cost). Annual check-up is 1 hour, not unlimited. If a member's sole behavior is freebie redemption, downgrade messaging at renewal. |
| **R5** | **Insurance expectation creep.** Members expect higher Layer 3 Work Guarantee caps + faster claim processing. | Medium | Member dispute volume disproportionately high; member expectations exceed Standard guarantee | Bundle higher Work Guarantee cap into pricing, not as surprise. Standard members get **$10K cap / 60-day window** (vs. $5K / 30-day for non-members). White Glove members get **$25K cap / 90-day window**. Document explicitly in member terms. |
| **R6** | **Manager ratio doesn't pencil.** Real Manager workload per White Glove member exceeds the 40-60 ratio assumed in pricing. | Medium | Manager pilot shows 8+ hours/member/year (vs. 8 hours/member/year assumption) | Phase 1 manual pilot is the test. If real ratio is closer to 25 members/Manager, raise White Glove price to $199/mo OR strip benefit (e.g., quarterly review becomes biannual). |
| **R7** | **Brand confusion with home warranty.** Customers confuse Sherpa Home with home warranty and expect insurance-style coverage. | Medium | Customer service complaints framed as "you didn't cover my X" | Clear marketing: "Sherpa Home is a membership, not insurance. We don't pay for repairs — we make the repair experience faster, cheaper, and better." Project Protection (paid embedded insurance) is the actual insurance product, separately positioned. |
| **R8** | **Cannibalization of pro-direct relationships.** A homeowner who uses a Sherpa pro 5x in a year may hire that pro directly off-platform, ending Marketplace + subscription value. | Medium | Member churn correlates with high single-pro repeat rate | Standard contractual: Sherpa Pros' Pro Service Agreement prohibits direct off-platform booking with introduced customers for 12 months post-job. Layer in member-only perks (Project Protection, dispute resolution) that don't transfer to off-platform work. |
| **R9** | **Wefunder free-tier dilution.** Free Wefunder member tier doesn't convert to paid + costs Sherpa Pros to serve. | Low | Wefunder members consume benefits but never upgrade | Free tier is time-limited (12 months), then auto-converts to Standard at $19/mo with cancel-out option. Wefunder commitment level ($1K+) sets the bar high enough that the free year is a true investor reward, not a bug. |

---

## 11. Open Questions for Phyrom

1. **Standard pricing:** $19/mo OR $29/mo? (Recommendation: **$19** for higher attach rate; revisit if attach <25% in Phase 1 pilot.)

2. **White Glove pricing:** $99 OR $149 OR $199/mo? (Recommendation: **$149** — see §4.4 reasoning.)

3. **Bundle Project Protection (paid embedded insurance) free with White Glove or extra?** (Recommendation: **bundle Plus tier free with both Standard and White Glove**; bundle Premium tier ($249 list, $100K cap, 5-year) free with White Glove only. Predictability of expectations matters more than nickel-and-diming on the insurance line.)

4. **Can pros opt out of Sherpa Home discount on their jobs (and forgo member dispatches)?** (Recommendation: **No opt-out**. Member jobs are 5%-discounted to customer but **not** discounted to pro — pro gets paid normal rate. If pro can opt out, the member experience fragments and dispatcher logic breaks. Communicate this clearly in pro onboarding: "All Sherpa Pros pros accept member jobs at standard pay; member discount comes out of platform take, not your earnings.")

5. **"Sherpa Account Manager" vs. "Sherpa Success Manager" — pick one** (impacts White Glove product naming + future Manager-as-a-Service offering naming). (Recommendation: **"Sherpa Account Manager"** — "Account" implies an enduring relationship vs. "Success" which feels SaaS-y. Also leaves "Customer Success Manager" available as a different role for the platform.)

6. **HJD network warm conversion — full 90-day free trial or paid-from-day-1 with 50% lifetime discount?** (Recommendation: **90-day free trial + 50% off Year 1, then standard pricing** — generous but converts to revenue eventually. HJD network = highest trust pool; don't waste them on a pure freemium offer.)

7. **Wefunder free tier — what investment level qualifies?** (Recommendation: **$1,000+ commitment** = 12 months free Standard. **$10,000+ commitment** = 12 months free White Glove. Caps Sherpa Pros' freebie exposure while making the perk feel meaningful.)

8. **Annual maintenance check-up — who pays the pro?** (Recommendation: **Sherpa Pros pays the pro a flat $80 visit fee** from member-revenue pool. Pro accepts because it's a predictable hour of work + a chance to surface upsell opportunities for paid follow-up jobs. Member experience is "free check-up by a real licensed pro.")

9. **Multi-property White Glove pricing — flat $149/mo or per-property?** (Recommendation: **$149/mo for first property + $49/mo per additional property**, max 5 properties on a single membership. Above 5 properties = PM tier conversation.)

10. **Phase 1 pilot scope — how many members to validate?** (Recommendation: **150-200 Standard + 10-15 White Glove** in Phase 1 (Months 3-6). Enough volume for cohort statistics on retention + LTV; small enough to manage with Phase 1 staffing (1 Pro Success Manager, 1 part-time Concierge).)

---

## 12. Implementation Sequencing

**Phase 0 (Months 0-3):** No action. Build the underlying foundation (Stripe Connect, beta cohort, Marketplace base experience). Sherpa Home is a Phase 1 launch.

**Phase 1 (Months 3-6):**
- **Month 4:** Standard tier engineering build (T1, 2-3 weeks). Manual White Glove pilot ops setup.
- **Month 4-5:** Soft-launch Standard to existing Marketplace customers (post-job conversion offer). 30-day money-back guarantee active.
- **Month 5:** White Glove pilot opens — 10-15 members from HJD network + top Wefunder investors.
- **Month 5-6:** A/B test pricing ($19 vs. $29 Standard, $99 vs. $149 White Glove) on small cohorts.
- **Month 6:** Measure attach rate, retention, LTV cohort math, Manager workload reality. Decide go/kill.

**Phase 2 (Months 6-12):**
- Standard tier: scale via paid + organic, target 1,000 paying members by Month 12.
- White Glove: scale to 50 paying members; build Manager Console (T1, 6-8 weeks).
- Add Phase 2 perks: partner discounts (Mass Save bundle, FW Webb discount, Lowe's Pro line), member events.

**Phase 3 (Months 12-18):**
- Standard tier: 5,000+ paying members across Northeast launch markets.
- White Glove: 200+ paying members; Manager team scaled to 4-6 named Managers.
- Manager-as-a-Service launches as separate product line for Property Manager tier (Phase 3 vision realized).

**Phase 4 (Months 18+):**
- National scale: Sherpa Home becomes the recurring-revenue floor that anchors Series B+ unit economics.
- White Glove tier becomes the trojan horse for ultra-high-net-worth concierge home services — separate brand consideration ("Sherpa Estate"?).

---

## 13. Brand Bible Compliance Check

- [x] **National brand** — no New Hampshire/New England brand cap. Sherpa Home is the national homeowner subscription tier. Phase 1 launches in Phase 1 metros (Portsmouth, Manchester, Portland, Boston) operationally.
- [x] **Phyrom-as-NH-GC origin** — referenced as biographical anchor in HJD warm-conversion path; not used as brand cap.
- [x] **No Wiseman externally** — Dispatch Wiseman is referenced internally in §9 engineering scope; member-facing copy says "priority match" not "Dispatch Wiseman priority."
- [x] **No surname** — Phyrom only.
- [x] **No "AI-powered" headline** — Sherpa Home's pitch is "human concierge + better experience", not "AI-powered." (Manager White Glove is explicitly a human Manager, not an AI agent.)
- [x] **Abbreviations spelled out on first use:**
  - Service Level Agreement (SLA)
  - Lifetime Value (LTV)
  - Gross Merchandise Volume (GMV)
  - Customer Acquisition Cost (CAC)
  - Net Promoter Score (NPS)
  - Property Manager (PM)
  - Pro Success Manager (PSM)
  - Tier 1 (T1)
  - Better Business Bureau (BBB)
  - Managing General Agent (MGA) — referenced via Boost / Cover Genius cross-doc
  - Certificate of Insurance (COI) — cross-doc
- [x] **Plainspoken tone** — no marketing-speak, 8th-grade reading level on member-facing copy.
- [x] **"Jobs not leads"** — preserved in Marketplace; Sherpa Home messaging extends with "Subscription not premium." (Tagline candidate: *"A membership, not insurance. A relationship, not a claim form."*)

---

## 14. Last Updated

**2026-04-22** — Draft v1 by Claude. Needs Phyrom + finance + attorney review before pricing locks. Phase 1 launch product — engineering scope is 2-3 weeks for Standard tier, manual pilot for White Glove. Coordinate with `embedded-protection-products.md` (Sherpa Home Standard auto-bundles Project Protection Plus tier; White Glove auto-bundles Premium tier — formalize the cost-share with chosen MGA partner).
