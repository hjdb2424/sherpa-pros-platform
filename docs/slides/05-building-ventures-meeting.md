---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: #ffffff
color: #1a1a1a
header: ''
footer: 'Sherpa Pros · Building Ventures Partner Meeting · Confidential'
style: |
  section {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 22px;
    padding: 60px;
  }
  section.lead {
    text-align: center;
    background: linear-gradient(135deg, #00a9e0 0%, #0369a1 100%);
    color: white;
  }
  section.lead h1 { font-size: 60px; color: white; }
  section.lead h2 { font-size: 30px; color: rgba(255,255,255,0.92); font-weight: 400; }
  h1 { color: #00a9e0; font-size: 42px; margin-bottom: 12px; }
  h2 { color: #1a1a2e; font-size: 30px; }
  h3 { color: #1a1a2e; font-size: 22px; }
  strong { color: #00a9e0; }
  table { font-size: 17px; }
  th { background: #f0f4f8; color: #1a1a2e; }
  blockquote {
    border-left: 4px solid #00a9e0;
    padding-left: 16px;
    color: #444;
    font-style: italic;
  }
  .small { font-size: 15px; color: #666; }
  .large { font-size: 28px; }
  .center { text-align: center; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
  .callout {
    background: #f8fafc;
    border-left: 4px solid #f59e0b;
    padding: 14px 18px;
    margin: 14px 0;
    font-size: 19px;
  }
---

<!-- _class: lead -->

# Sherpa Pros + Building Ventures

## The Built-Environment marketplace you've been waiting for.

<br>

**Phyrom · Founder · HJD Builders LLC**
New Hampshire General Contractor

<br>

<span class="small">[MEETING DATE — Phyrom: fill in]
For: [Mayra Arntz / Heather Widman / Jesse Devitte] — Building Ventures
Boston · 30-minute partner meeting</span>

---

# Why I'm in this room

I'm **Phyrom**. I run **HJD Builders**, a licensed general contractor in New Hampshire. **Twelve-plus years** building houses on the tools — not from a deck, from a jobsite.

I built **Sherpa Pros** because the platforms my crew gets pitched every week — Angi, Thumbtack, TaskRabbit, Handy — sell us leads we can't afford and send homeowners to people who shouldn't be touching their wiring.

So I built the licensed-trade marketplace I needed:

- **Code-aware quote validation** — every quote checked against National Electrical Code (NEC), International Residential Code (IRC), Massachusetts Electrical, and New Hampshire RSA before the homeowner sees it
- **Instant pro dispatch** — single matched pro, not a leads-blast to 40 bidders
- **Jobs, not leads** — no lead-gen tax. 5% take during beta, 10% at scale.

We're at **[X jobs / month]** and growing across NH, ME, and Boston specialty lanes.

> I'm here because **Building Ventures is the Boston-anchored Built-Environment partner who'd recognize this for what it is.**

---

# The Building Ventures thesis match

Sherpa Pros maps directly onto three bets you've already placed.

| Your portfolio bet | What it proved | Where Sherpa Pros fits |
|---|---|---|
| **UpCodes** *(Heather Widman, board)* | Code intelligence is a real moat — not a feature, a defensibility argument | Our code-aware quote validation engine reads NEC, IRC, MA Electrical, NH RSA in real time. We are UpCodes' thesis applied to **the residential transaction layer**. |
| **BuildFactory** *(BV-led seed, late 2025)* | Marketplace structure works in the built environment | Same business-model shape, **opposite end of the supply chain**. BuildFactory is the offsite/prefab marketplace. **Sherpa Pros is the residential-licensed-trade analog.** |
| **Built Robotics** | Labor augmentation on the supply side | We are **labor allocation** on the marketplace side. Same MA labor shortage *(2.5% unemployment, project times stretched 7→11 months)*, opposite solution surface. |

<div class="callout">
You've already invested twice in this thesis (UpCodes + BuildFactory). Sherpa Pros is the consumer-facing proof point — the residential trade marketplace your portfolio is missing.
</div>

<span class="small">Sources: BV portfolio per buildingventures.com (accessed 2026-04-22); BuildFactory investment per BV Winter 2025 newsletter; UpCodes board involvement per Heather Widman BV bio.</span>

---

# The problem we solve

Lead-gen platforms are extracting **$400–$800 per closed job** from contractors. The licensed-work failures are documented and getting worse.

- **Angi** — lead fees often shared with up to 40 competitors. BBB un-accredited. Vermont Attorney General settlement October 2025.
- **Thumbtack** — documented contractor-deposit-theft pattern. BBB pattern-of-complaints review November 2025.
- **TaskRabbit** — 22.5% effective fee load. **Doesn't cover licensed trades at all.**
- **Mass Save Find-an-Installer** — static utility listing. No dispatch, no escrow, no review system. Wait times 3–6 months.
- **Boston brownstone owners** — can't filter for old-house specialists on any national platform.

Massachusetts has the **largest construction labor shortage in the nation** *(2.5% construction unemployment, lowest in 17+ years).* That's demand-side pull, not a saturated market.

<div class="callout">
<strong>Code intelligence is the moat — and your UpCodes investment proves you already believe this.</strong> What no lead-gen platform can copy is the layer that reads the code before the quote is sent.
</div>

---

# The category-creating wedge

Two axes. Four quadrants. The top-right one is empty — until now.

| | **Lead-gen / pay-to-bid** | **Marketplace / code-aware** |
|---|---|---|
| **Unskilled / generalist** | Angi · Thumbtack · TaskRabbit · Handy | (no clean entrant) |
| **Licensed / verified** | (no incumbent serves this lane) | **UpCodes · BuildFactory · Sherpa Pros** |

**The pattern Building Ventures has placed twice:**

- **UpCodes** — the **reference layer** for code intelligence (architects, engineers, GCs)
- **BuildFactory** — the **supply-chain marketplace** for offsite/prefab construction
- **Sherpa Pros** — the **residential-execution marketplace** that uses code intelligence to validate every transaction

<div class="callout">
You've already invested twice in the licensed + code-aware + marketplace quadrant. <strong>Sherpa Pros is the consumer-facing proof point</strong> — the residential homeowner is the missing endpoint that closes the loop on your built-environment portfolio.
</div>

---

# Live product walkthrough

Web at **www.thesherpapros.com**. Mobile in TestFlight (iOS) and PWA (Android). Built on Next.js 16, Stripe Connect, Neon PostgreSQL + PostGIS, Clerk, Twilio.

<div class="grid-3">

**1. Code-aware quote validation in action**
[SCREENSHOT — Phyrom: capture the homeowner-facing quote with the green "Code-checked" badge. Show one flagged line item: missing electrical permit on a panel upgrade.]

**2. Instant dispatch flow**
[SCREENSHOT — Phyrom: capture the pro inbox showing one matched job — scope, location, code-validated estimate range, one-tap accept. No bidding war.]

**3. Pro side instant payout**
[SCREENSHOT — Phyrom: capture the Stripe Connect payout view — completed job, 5% take displayed, payout scheduled. The "jobs not leads" model in one screen.]

</div>

<span class="small">All three are real flows on the production platform — not mockups. Phyrom captures fresh screenshots within 24 hours of the meeting.</span>

---

# Boston specialty wedge — Phase 1, not Phase 5

Five lanes the national lead-gen platforms structurally cannot serve. Boston is your home market. **These lanes are our Phase 1.**

| Lane | Why national platforms can't filter for it | Why we can |
|---|---|---|
| **Mass Save heat-pump installations** | Requires EPA cert + electrical panel upgrade verification + rebate workflow ($8,500/whole-home cap) | Mass Save Network application + code-aware permit-and-rebate engine |
| **EV charger installations** | Requires licensed electrician + often paired panel upgrade ($2K–$8K) | Single-dispatch captures both jobs (charger + panel) in one flow |
| **Electrical panel upgrades** | Gateway trade for heat-pump + EV + solar; massive backlog | Code engine reads NEC + MA Electrical; verifies licensed pro at onboarding |
| **Old-house specialists** | Plaster/lath (50%+ of pre-1950 Boston housing), slate roofs, brownstone repointing | Old-House Verified badge (USPTO trademark filing in flight) |
| **Triple-decker exteriors** | Boston-specific code, ISD permits, liability-critical | Code engine reads MA + Boston ISD permit data |

<div class="callout">
Boston is your office. Boston is our Phase 1 specialty wedge. <strong>We're a one-hour drive from the meeting room you're sitting in.</strong>
</div>

---

# Traction

The platform is live. Real pros, real jobs, real GMV.

<div class="grid-2">

### Beta cohort (live today)
- **[X active beta pros]** across 9 trade categories, 3 states (NH, ME, MA)
- **[Y jobs]** posted in first 60 days
- **[$Z GMV]** transacted *(Gross Merchandise Value)*
- **[N%]** of jobs matched in **under 2 hours**
- Pro Net Promoter Score (NPS): **[score]** · Client NPS: **[score]**

### Code engine in production
- Code-aware quote validations run: **[count]**
- Code violations caught before the homeowner saw the quote: **[count]**
- Average dollar value protected per validation: **$[amount]**
- Permits flagged for assist: **[count]**

</div>

**Cohort composition:** NH/Seacoast — 2 GCs (HJD network), 2 handymen, 1 plumber, 1 HVAC/heat-pump specialist. ME/Portland — 1 painter, 1 landscaper. MA/Boston specialty — 1 licensed electrician (EV/panel/Mass Save cert), 1 old-house specialist, 1 roofer.

<span class="small">Phyrom: replace [bracketed] numbers with live Stripe Connect dashboard + dispatch logs + NPS survey results within 24 hours of the meeting. Date the slide.</span>

---

# Why this raise — and why Building Ventures specifically

**The ask: anchor seed of $[X]–$[Y]** *(Phyrom: pick range based on Phase 0 exit-gate proof at meeting time — likely $750K–$1.5M).*

Why Building Ventures, specifically, and not the next firm on the list:

1. **Boston-anchored Built-Environment specialist.** You wrote the firm's mission as "take the waste out of the building trades." *(Devitte, Boston Globe 2022.)* The waste in residential trades is the lead-gen tax. We cut it in half.

2. **Operator-mentor depth we can't get elsewhere.** UpCodes (code intelligence), BuildFactory (built-environment marketplace), Suffolk Tech BOOST cohort network. **No other firm on our list has all three reference points already in portfolio.**

3. **NE expansion playbook benefits from Mayra's operating background.** Mayra Arntz has actual jobsite project-controls experience *(ex-HoloBuilder, Stanley X)*. We're going to scale across New England before we touch any other region. **That's an operating problem, not a deck problem.**

4. **One-hour drive from your office.** Phyrom is in NH; the platform's first three metros are Portsmouth, Manchester, Portland. Boston specialty lanes are Phase 1. **Real-time partnership at sapling stage isn't a phone call — it's a coffee.**

---

# What we're building toward

One slide. Phase 1 → Phase 4. Honest milestones, not ambition theater.

| Phase | Months | Footprint | Trigger to next phase |
|---|---|---|---|
| **Phase 1 — Lean Launch** | 3–6 | NE Triangle (Portsmouth + Manchester + Portland) + Boston specialty lanes | 50+ pros · 200+ jobs · $200K+ GMV · 1 PM anchor · Net Promoter Score (NPS) >50 |
| **Phase 2 — Scaled Launch** | 6–12 | Full 4-metro execution | 200+ pros · $1M+ GMV · take rate stable at 10% |
| **Phase 3 — Regional Expansion** | 12–18 | + Providence, Hartford, NYC specialty (Brooklyn brownstones, Manhattan pre-war) | 6 metros · $5M+ GMV · 3 PM chains · 1 utility partner |
| **Phase 4 — National Scale** | 18+ | Philadelphia · Washington DC · SF Bay · Chicago specialty lanes first | Series B raised; strategic acquisition optionality |

<div class="callout">
<strong>Series A trigger: Month 12.</strong> We trigger on milestones, not on calendar. The phases are written so the next round is funded by the previous round's proof — not by hope.
</div>

---

# Use of funds — honest about what we won't spend on

Specific allocation of the seed. Avoiding the "we'll do everything" trap.

<div class="grid-2">

### What we WILL spend on (Months 3–12)
- **2 Pro Success Managers** *(NH/ME + MA, $8K/mo loaded each)* — onboarding, retention, weekly pro check-ins
- **1 Client Concierge** *(remote NE, part-time)* — proactive homeowner support, dispute triage
- **Paid acquisition test** *(Meta + TikTok, homeowner-targeted, $5–8K/mo)*
- **Google Ads** *(Boston specialty keywords, $3–5K/mo)*
- **Platform liability insurance + legal** *(1099 worker-classification opinion, OpenSign templates, USPTO Old-House Verified filing — ~$15K one-time)*
- **Phyrom salary** *(first paid month after first close — 60-hr/wk hard cap)*

### What we will NOT spend on
- **Brand redesign or rebrand.** The brand is plainspoken on purpose. We are not building a Houzz.
- **National launch in the first 12 months.** Northern Triangle + Boston specialty only. Discipline beats ambition.
- **A second product** *(Property Manager tier waits until Phase 2 anchor signed)*
- **Conference sponsorship blitz.** Two trade shows max (JLC Live New England, NH Home & Garden).
- **A full marketing team.** AI agents handle content production; humans handle relationships.

</div>

---

<!-- _class: lead -->

# The ask

## **$[X]–$[Y] anchor seed.**
*Building Ventures leads with $[X]. We close $[Y total] by [date].*

<br>

We'd start working with you the day the term sheet is signed.

<br>

**Phyrom**
HJD Builders LLC · Sherpa Pros
www.thesherpapros.com
[phyrom@hjd.builders] · [phone]

<br>

<span class="small">Next step ask: a follow-up partner meeting within 14 days, with a live walk-through on the platform of one job end-to-end. Phyrom drives to Boston; you pick the date.</span>
