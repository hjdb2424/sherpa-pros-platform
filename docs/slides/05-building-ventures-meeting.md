---
marp: true
theme: sherpa-pros-editorial
paginate: true
size: 16:9
header: 'Sherpa Pros × Building Ventures · Partner Meeting'
footer: 'Sherpa Pros · Confidential · For Building Ventures partner review'
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Sherpa Pros × Building Ventures

## The licensed-trade marketplace your portfolio is missing.

<div class="meta-strip">
<span>For: [BV PARTNER NAME] — Building Ventures</span>
<span>Phyrom · Founder · HJD Builders LLC</span>
<span>Boston · 30-minute partner meeting · [MEETING DATE]</span>
</div>

<!-- ASSET REQUIRED: cover treatment — clean cream field with Sherpa Pros wordmark upper-left and Building Ventures wordmark upper-right (separated by thin sky-blue diagonal). Source: pull BV wordmark from buildingventures.com press kit; Phyrom approves visual co-branding before send. Dimensions: 1920x1080. -->

---

<!-- _class: divider -->

## I.

# The Founder

---

# Why I'm in this room.

I'm **Phyrom.** I run **HJD Builders**, a licensed general contractor in New Hampshire. **Twelve-plus years** building houses on the tools — not from a deck, from a jobsite.

I built **Sherpa Pros** because the platforms my crew gets pitched every week — Angi, Thumbtack, TaskRabbit, Handy — sell us leads we can't afford and send homeowners to people who shouldn't be touching their wiring.

So I built the licensed-trade marketplace I needed:

- **Code-aware quote validation** — every quote checked against National Electrical Code (NEC), International Residential Code (IRC), Massachusetts Electrical, and New Hampshire RSA before the homeowner sees it
- **Instant pro dispatch** — single matched pro, not a leads-blast to 40 bidders
- **Jobs, not leads** — no lead-gen tax. 5% take during beta, 10% at scale.

We're at **[X jobs / month]** and growing across NH, ME, and Boston specialty lanes.

![bg right:40%](placeholder-phyrom-jobsite.jpg)

<!-- ASSET REQUIRED: NH jobsite portrait of Phyrom — same photo used in investor pitch deck for visual continuity. Source: Phyrom captures on jobsite. Dimensions: 1080x1920 vertical. -->

---

<!-- _class: quote -->

> Building Ventures is the Boston-anchored Built-Environment partner who'd recognize this for what it is.

**— Phyrom · Founder, HJD Builders LLC**

---

<!-- _class: divider -->

## II.

# The Thesis Match

---

# Sherpa Pros maps onto three bets you've already placed.

<div class="bv-portfolio-grid">

### UpCodes
*Heather Widman, board.*
**Code intelligence is a real moat** — not a feature, a defensibility argument.
**→ Our code-aware quote validation engine reads NEC, IRC, MA Electrical, NH RSA in real time. We are UpCodes' thesis applied to the residential transaction layer.**

### BuildFactory
*BV-led seed, late 2025.*
**Marketplace structure works in the built environment.**
**→ Same business-model shape, opposite end of the supply chain. BuildFactory is the offsite/prefab marketplace. Sherpa Pros is the residential-licensed-trade analog.**

### Built Robotics
*BV portfolio.*
**Labor augmentation on the supply side.**
**→ We are labor allocation on the marketplace side. Same MA labor shortage (2.5% unemployment, project times 7→11 months). Opposite solution surface.**

</div>

**You've already invested twice in this thesis (UpCodes + BuildFactory). Sherpa Pros is the consumer-facing proof point — the residential trade marketplace your portfolio is missing.**

<span class="caption">Sources: BV portfolio per buildingventures.com (accessed 2026-04-22) · BuildFactory investment per BV Winter 2025 newsletter · UpCodes board involvement per Heather Widman BV bio.</span>

---

<!-- _class: divider -->

## III.

# The Problem

---

# The lead-gen tax — documented, getting worse.

Lead-gen platforms are extracting **$400–$800 per closed job** from contractors. The licensed-work failures are documented and getting worse.

| Platform | What it costs the pro | What it fails the homeowner |
|---|---|---|
| **Angi** | Lead fees often shared with up to 40 competitors | BBB un-accredited · Vermont Attorney General settlement October 2025 |
| **Thumbtack** | Pros buy contact for jobs that ghost | Documented contractor-deposit-theft pattern · BBB pattern-of-complaints November 2025 |
| **TaskRabbit** | 22.5% effective fee load | Doesn't cover licensed trades at all |
| **Mass Save Find-an-Installer** | (free, but no transaction layer) | Static utility listing · no dispatch, no escrow, no review · 3–6 month wait |

Massachusetts has the **largest construction labor shortage in the nation** *(2.5% construction unemployment, lowest in 17+ years).* That's demand-side pull, not a saturated market.

---

<!-- _class: bignumber -->

# $400–$800

## What a contractor pays Angi for one closed job. Sherpa Pros take rate on a $5K job: **$250.**

---

# The category-creating wedge.

Two axes. Four quadrants. The top-right one is empty — until now.

|  | **Lead-gen / pay-to-bid** | **Marketplace / code-aware** |
|---|---|---|
| **Unskilled / generalist** | Angi · Thumbtack · TaskRabbit · Handy | *(no clean entrant)* |
| **Licensed / verified** | *(no incumbent serves this lane)* | **UpCodes · BuildFactory · ★ Sherpa Pros** |

**The pattern Building Ventures has placed twice:**

- **UpCodes** — the **reference layer** for code intelligence (architects, engineers, GCs)
- **BuildFactory** — the **supply-chain marketplace** for offsite/prefab construction
- **Sherpa Pros** — the **residential-execution marketplace** that uses code intelligence to validate every transaction

**You've already invested twice in the licensed + code-aware + marketplace quadrant. Sherpa Pros is the consumer-facing proof point — the residential homeowner is the missing endpoint that closes the loop.**

---

<!-- _class: divider -->

## IV.

# The Product

---

<!-- _class: split -->

# Live product walkthrough.

Web at **www.thesherpapros.com**. Mobile in TestFlight (iOS) and PWA (Android).

Built on Next.js 16 · Stripe Connect · Neon PostgreSQL + PostGIS · Clerk · Twilio.

**Three flows. All real. All production.**

**1. Code-aware quote validation** — homeowner sees green "Code-checked" badge, one flagged line item.
**2. Instant dispatch** — pro inbox, one matched job, code-validated estimate range, one-tap accept.
**3. Stripe Connect payout** — completed job, 5% take displayed, payout scheduled.

![bg right:50%](placeholder-product-composite.jpg)

<!-- ASSET REQUIRED: composite product still — three iPhone frames overlapping on cream field. (1) Homeowner-facing quote with green "Code-checked" badge. (2) Pro inbox showing one matched job. (3) Stripe Connect payout view showing 5% take. Source: Phyrom captures fresh from production within 24h of meeting. Dimensions: 1920x1080 composite, transparent background. -->

---

<!-- _class: divider -->

## V.

# The Boston Wedge

---

# Boston specialty lanes — Phase 1, not Phase 5.

Five lanes the national lead-gen platforms structurally cannot serve. **Boston is your home market. These lanes are our Phase 1.**

| Lane | Why national platforms can't filter for it | Why we can |
|---|---|---|
| **Mass Save heat-pump installations** | EPA cert + electrical panel upgrade verification + rebate workflow ($10,000+ in 2026) | Mass Save Network application + code-aware permit-and-rebate engine |
| **EV charger installations** | Licensed electrician + often paired panel upgrade ($2K–$8K) | Single-dispatch captures both jobs (charger + panel) in one flow |
| **Electrical panel upgrades** | Gateway trade for heat-pump + EV + solar; massive backlog | Code engine reads NEC + MA Electrical; verified pro at onboarding |
| **Old-house specialists** | Plaster/lath (50%+ of pre-1950 Boston housing), slate roofs, brownstone repointing | Old-House Verified badge (USPTO trademark filing in flight) |
| **Triple-decker exteriors** | Boston-specific code, ISD permits, liability-critical | Code engine reads MA + Boston ISD permit data |

**Boston is your office. Boston is our Phase 1 specialty wedge. We're a one-hour drive from the meeting room you're sitting in.**

---

<!-- _class: divider -->

## VI.

# Traction

---

<!-- _class: bignumber -->

# [X]

## Active beta pros across 9 trade categories, 3 states (NH · ME · MA).

<!-- ASSET REQUIRED: Phyrom replaces [X] with live Stripe Connect dashboard count within 24h of meeting. -->

---

<!-- _class: bignumber -->

# $[Z]

## Gross Merchandise Value transacted via Stripe Connect escrow in the first 60 days.

<!-- ASSET REQUIRED: Phyrom replaces [Z] with live Stripe Connect dashboard total within 24h of meeting. -->

---

# Code engine in production.

| Metric | Count |
|---|---|
| Code-aware quote validations run | **[count]** |
| Code violations caught before homeowner saw the quote | **[count]** |
| Average dollar value protected per validation | **$[amount]** |
| Permits flagged for assist | **[count]** |

**Cohort composition (11 pros total):**
NH/Seacoast — 2 GCs (HJD network), 2 handymen, 1 plumber, 1 HVAC/heat-pump specialist.
ME/Portland — 1 painter, 1 landscaper.
MA/Boston specialty — 1 licensed electrician (EV/panel/Mass Save cert), 1 old-house specialist, 1 roofer.

<span class="caption">Phyrom: replace [bracketed] numbers with live Stripe Connect dashboard + dispatch logs + NPS survey results within 24 hours of the meeting. Date the slide.</span>

---

<!-- _class: divider -->

## VII.

# Why Building Ventures

---

# Four reasons it's BV — not the next firm on the list.

**1. Boston-anchored Built-Environment specialist.**
Your firm's mission: *"take the waste out of the building trades."* (Devitte, Boston Globe 2022.) **The waste in residential trades is the lead-gen tax. We cut it in half.**

**2. Operator-mentor depth we can't get elsewhere.**
UpCodes (code intelligence) · BuildFactory (built-environment marketplace) · Suffolk Tech BOOST cohort network. **No other firm on our list has all three reference points already in portfolio.**

**3. NE expansion playbook benefits from Mayra's operating background.**
Mayra Arntz has actual jobsite project-controls experience *(ex-HoloBuilder, Stanley X)*. We're going to scale across New England before we touch any other region. **That's an operating problem, not a deck problem.**

**4. One-hour drive from your office.**
Phyrom is in NH; the platform's first three metros are Portsmouth, Manchester, Portland. Boston specialty lanes are Phase 1. **Real-time partnership at sapling stage isn't a phone call — it's a coffee.**

---

# What we're building toward.

| Phase | Months | Footprint | Trigger to next phase |
|---|---|---|---|
| **Phase 1 — Lean Launch** | 3–6 | Portsmouth + Manchester + Portland + Boston specialty | 50+ pros · 200+ jobs · $200K+ GMV · 1 PM anchor · NPS >50 |
| **Phase 2 — Scaled Launch** | 6–12 | Full 4-metro execution | 200+ pros · $1M+ GMV · take rate stable at 10% |
| **Phase 3 — Regional Expansion** | 12–18 | + Providence, Hartford, NYC specialty (Brooklyn brownstones, Manhattan pre-war) | 6 metros · $5M+ GMV · 3 PM chains · 1 utility partner |
| **Phase 4 — National Scale** | 18+ | Philadelphia · Washington DC · SF Bay · Chicago specialty lanes first | Series B raised; strategic acquisition optionality |

**Series A trigger: Month 12.** We trigger on milestones, not on calendar. The phases are written so the next round is funded by the previous round's proof — not by hope.

---

# Use of funds — honest about what we won't spend on.

### What we WILL spend on (Months 3–12)
- **2 Pro Success Managers** (NH/ME + MA, $8K/mo loaded each)
- **1 Client Concierge** (remote NE, part-time)
- **Paid acquisition test** (Meta + TikTok, $5–8K/mo)
- **Google Ads** (Boston specialty keywords, $3–5K/mo)
- **Platform liability insurance + legal** (1099 worker-class opinion, OpenSign templates, USPTO Old-House Verified filing — ~$15K one-time)
- **Phyrom salary** (first paid month after first close — 60-hr/wk hard cap)

### What we will NOT spend on
- **Brand redesign or rebrand.** The brand is plainspoken on purpose. We are not building a Houzz.
- **National launch in the first 12 months.** Phase 1 metros + Boston specialty only. Discipline beats ambition.
- **A second product** (Property Manager tier waits until Phase 2 anchor signed).
- **Conference sponsorship blitz.** Two trade shows max (JLC Live New England, NH Home & Garden).
- **A full marketing team.** AI agents handle content production; humans handle relationships.

---

<!-- _class: lead -->
<!-- _paginate: false -->

# The Ask.

## **$[X]–$[Y] anchor seed.**

*Building Ventures leads with $[X]. We close $[Y total] by [date].*

We'd start working with you the day the term sheet is signed.

<div class="meta-strip">
<span>Phyrom · HJD Builders LLC · Sherpa Pros</span>
<span>poum@hjd.builders</span>
<span>www.thesherpapros.com</span>
</div>

> Next step ask: a follow-up partner meeting within 14 days, with a live walk-through on the platform of one job end-to-end. **Phyrom drives to Boston. You pick the date.**

<!-- ASSET REQUIRED: QR code linking to www.thesherpapros.com (or a BV-specific data-room URL if Phyrom sets one up). Generate at qr-code-generator.com. Place in lower-right corner. Dimensions: 400x400px, navy on cream. -->
