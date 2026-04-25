# Y Combinator — Application Draft

**Status:** DRAFT — Phyrom edit pass required before submission
**Drafted:** 2026-04-22
**Priority:** Tier-1 brand + cheap to apply (per GTM spec §6.2)

---

## 1. Application URL & Open Status

- **Program page:** https://www.ycombinator.com/apply
- **Apply portal:** https://www.ycombinator.com/apply (single Typeform-style application)
- **Cycle:** Two batches per year — **Winter** (apply Sep, batch starts Jan) and **Summer** (apply Mar, batch starts Jun). YC also accepts **off-cycle applications year-round** for the next batch. Apply immediately regardless of cycle position — late applicants are reviewed if standout.
- **Investment:** **$500K** standard deal — $125K SAFE (post-money cap, 7% equity-equivalent) + $375K MFN SAFE (most-favored-nation, no cap).
- **Effective dilution:** ~7% at the YC cap, plus the MFN SAFE converts at the next priced round's cap. Practical post-YC pre-Seed Phyrom equity: ~93%; post-Seed often ~85% depending on round size.
- **Format:** 3-month batch in SF Bay Area (in-person attendance encouraged). Demo Day at end. Lifetime YC alumni network access.
- **Decision timeline:** Application → in-person interview within 2–4 weeks of submission → decision within 24 hours of interview. Famously fast.

---

## 2. Required Materials Checklist

YC's application is famously short. **Do not over-prepare.** Required:

- [ ] Founder application (this doc — 12 short answers)
- [ ] 1-minute founder video (YC's app form has an upload field — required)
- [ ] Live demo link: https://www.thesherpapros.com
- [ ] LinkedIn URL for founder
- [ ] Optional but encouraged: warm intro from a YC alum

**No deck required.** Do not attach one even though it's tempting. YC reads the form, watches the video, clicks the demo. That's the funnel.

---

## 3. Application Narrative — YC's Exact Question Format

YC questions evolve slightly each batch. The structure below mirrors the W26/S26 application. **Verify exact field names on https://www.ycombinator.com/apply before submission.**

### Q: Company name

**Sherpa Pros**

### Q: Company URL

https://www.thesherpapros.com

### Q: Describe what your company does in 50 characters or less

Licensed-trade marketplace for New England, by a GC.

### Q: Describe what your company does in more detail

Sherpa Pros is the national licensed-trade marketplace (international roadmap), launching first in NH, ME, and MA. Homeowners and property managers post jobs (electrical, plumbing, HVAC, roofing, GC, specialty). We dispatch a single verified pro — license + insurance checked — and validate the quote against code (NEC, IRC, MA Electrical, NH RSA, 284 NH municipal codes) before the homeowner sees it. Pros pay 5% on completed jobs in beta (10% standard) instead of paying for leads. Homeowners pay nothing. Property managers pay $1.50/unit/month for the PM tier.

Live web + iOS TestFlight + Android PWA. Built by a working New Hampshire GC.

### Q: Where do you live now, and where will the company be based after YC?

Phyrom lives in New Hampshire. The company is incorporated and operated from New Hampshire. We will relocate temporarily to the Bay Area for the YC batch and return to NH after Demo Day. **The marketplace is national in ambition; the launch sequence is New England-first because that is where the founder operates and where the demand pull is most acute — that operational concentration is the moat, not a brand cap.** Most accelerator applicants treat geography as a soft signal; for us it is a strategic commitment to win the launch metros first, then template the playbook nationally.

### Q: How long have the founders known each other and how did you meet? Have any of you ever worked together before?

Solo founder. Phyrom has been operating HJD Builders LLC in New Hampshire for 12+ years. Sherpa Pros is a direct outgrowth of HJD's daily contractor experience — built by Phyrom + AI agents during 18 months of solo development against a daily list of "things lead-gen platforms get wrong on my crew."

### Q: What problem are you solving?

Licensed contractors waste money buying leads they can't afford from Angi and Thumbtack, and homeowners get matched to people who shouldn't be touching their electrical panel or their gas line. Massachusetts has the largest construction labor shortage in the nation: 2.5% construction unemployment, 30% of residential workers 55+, project completion times 7→11 months. The market needs a marketplace that gets licensed work done at sustainable contractor economics. Incumbents structurally cannot pivot — their entire P&L runs on lead-share, not completed work.

### Q: What's new about what you make?

Three things no consumer-facing residential-services platform does:
1. Every quote is validated against code in real time before the homeowner sees it. NEC, IRC, MA Electrical, NH RSA, 284 NH municipal codes. Catches missing permits, wrong materials, below-code minimums.
2. Every pro is license + insurance verified at onboarding and re-checked on renewal. No "find a guy."
3. Permit + rebate awareness baked into dispatch (Mass Save heat pumps, National Grid Turnkey EV, panel upgrades).

The code-intelligence layer required three years of working-GC operational knowledge encoded into software. Not buildable by a software-only founder.

### Q: Why did you pick this idea to work on? Do you have domain expertise in this area? How do you know people need what you're making?

I'm a working general contractor in New Hampshire. I've been pitched Angi and Thumbtack and Houzz Pro every week for ten years. I've watched homeowners get burned by unlicensed pros sent by these platforms. I've lost guys on my crew because they couldn't afford lead fees anymore. The platform isn't a market thesis — it's the tool I needed.

People need it because the alternatives are objectively broken: Angi has 1,800+ BBB complaints and lost a Vermont AG settlement in October 2025 over misleading "Certified Pro" terminology; Thumbtack has documented deposit-theft complaints; TaskRabbit doesn't cover licensed trades; Houzz Pro is 1.03★ on the BBB across 500+ complaints. The licensed + code-aware + true-marketplace quadrant is empty.

### Q: Who are your competitors, and who might become competitors? Who do you fear most?

**Direct:** Angi (NASDAQ: ANGI, FY2025 revenue $1.03B, declining), Thumbtack ($3.2B 2021 valuation, $400M FY2024 revenue), Handy (ANGI subsidiary), Houzz Pro ($59–$999/mo SaaS, 1.03★ BBB), TaskRabbit (IKEA subsidiary, ~$75M, doesn't cover licensed trades).

**Adjacent:** Mass Save Find-an-Installer (utility-funded static listing, no marketplace mechanics), Home Depot/Lowe's Pro Services (retail-tied installs).

**Who I fear:** A Stripe-funded marketplace founder who decides to verticalize on licensed trades. The defense is (a) the code intelligence layer requires working-GC knowledge to design, (b) Old-House Verified USPTO trademark filing W4, (c) NE-utility partnership lock-in (Mass Save Network application in flight).

I do not fear Angi or Thumbtack pivoting. They cannot. Their entire revenue model is lead-share.

### Q: What's your progress so far?

- Platform live at https://www.thesherpapros.com + iOS TestFlight + Android PWA. Built on Next.js 16, Stripe Connect, Neon Postgres + PostGIS, Clerk, Twilio.
- `[X beta pros]` active across 9 trade categories in 3 states (NH, ME, MA). `[Y jobs]` posted in first 60 days. `[$Z GMV]` transacted. `[N%]` matched <2 hours. Pro NPS `[score]`. Code violations caught: `[count]`.
- HJD Builders direct client list + NHHBA + MEHBA pre-seeding Phase 1 demand.
- In flight: Mass Save Network application, Old-House Verified USPTO filing, MassCEC + NSF SBIR submissions.

### Q: How will you make money?

Three revenue lines stack:
- **Marketplace take:** 5% (beta) → 10% (standard) → 12–15% (Phase 3). Tied to outcome, not bid clicks.
- **Pro subscription:** $49/month standard. Predictable recurring revenue.
- **PM tier:** $1.50/unit/month at scale, replaces $4/unit incumbent vendor-management tools, multi-year contracts.

Unit economics: standard pro doing $8K GMV/month = $849/month (sub + take). 200 pros = $2.0M ARR before PM tier. PM anchor at 1,000 units = $1.5K/year per anchor; 3 anchors = $4.5M ARR Phase 3.

### Q: How big is the market?

TAM ~$731B/year (US residential remodeling $524B per JCHS LIRA 2026 + US commercial property maintenance $207.5B per Market Research Future). SAM ~$32B/year NE 6-state. SOM (18-mo) $5M+ GMV across 4 metros = <0.06% of four-metro SAM. Mass Save heat-pump installs alone are ~$300M MA pipeline/year.

### Q: How do you know you're going to win?

Three reasons:
1. **Founder-market fit is unforgeable.** No incumbent platform employs working contractors. The code intelligence layer required three years of jobsite knowledge to design. A software-only competitor would need to rebuild from a contractor's daily problem set, which takes years.
2. **Macro tailwinds are converging.** Mass Save 2026 rebates, MA labor shortage, AI code-validation production-grade — all in the same 12-month window. We plant the flag now or somebody else does in 24 months.
3. **Capital efficiency.** Single founder, built product, beta cohort transacting on $0 outside capital today. Whatever we do with YC's $500K is purely accelerative — we are not gated on it.

### Q: How are you driving customer acquisition?

Three channels active in Phase 0:
1. **Founder-led recruiting** — HJD Builders client list + NHHBA + MEHBA introductions. Warm side seeded.
2. **Phyrom LinkedIn founder voice campaign** — "Jobs. Not leads." 90-day editorial.
3. **NH/ME supply-house flyers** (Lowe's Pro, Rockler, FW Webb) — physical-world contractor recruiting.

Phase 1 adds paid social ($5–8K/mo Meta + TikTok homeowner-targeted), Google Ads on Boston specialty keywords, local PR (Seacoast Online, NHPR, Boston Globe Real Estate), trade shows (JLC Live New England), Mass Save Network listing.

### Q: Equity breakdown

Phyrom — 100% common, no SAFEs outstanding.

### Q: Anything else we should know?

I am still on jobsites in New Hampshire while Sherpa Pros is in beta. I built this because I needed it. The product is real, the founder-market fit is unforgeable, and the Phase 1 launch metros (Portsmouth NH + Manchester NH + Portland ME) are markets YC has not funded a vertical specialist for. We do not need YC's money to survive Phase 0. We want YC because the YC alumni network compresses the Mass Save / utility / PM-anchor partnerships we are otherwise grinding out cold — and the same alumni network is the multiplier when we expand the playbook into every other US metro.

---

## 4. Founder-Story Angle (YC-Specific)

YC's review filter has been unchanged for a decade: **product, founder, market — in that order.** YC partners (especially Garry Tan, Dalton Caldwell, Diana Hu) explicitly look for founders who **"are obviously the person who should build this."** Phyrom checks every box.

**The hook:** "Working New Hampshire general contractor, building the platform he wished existed, with a code-aware engine no software-only founder could have designed."

YC partners read 10,000+ applications/year. The single signal they bias toward is "I cannot believe this person exists." A working GC who builds the right thing is exactly that signal. **Lead with it in the 1-minute video. Lead with it in the Q1 description. Lead with it in the closing "anything else" answer.**

**1-minute video tips:**
- Phone-shot, no studio, on a NH jobsite. Tools visible. Hard hat optional but on-brand.
- Open: "Hi, I'm Phyrom. I run HJD Builders in NH. I built Sherpa Pros because lead-gen platforms don't work for licensed trades — and I'd know, because I've been pitched all of them." 
- Middle: "Here's what we do." Show the live platform on phone screen.
- Close: "I'm a working contractor. I built this. We're transacting today. We want YC because the alumni network gets us to Mass Save and utility partnerships in months, not years."

**No script.** YC partners can smell a script.

**Apply solo.** YC has historically preferred 2+ founders, but they have funded notable solo founders. A working-GC solo founder with a built product is a feature, not a bug, at this stage. Do not invent a "founding team" that doesn't exist.

---

## 5. Equity / Dilution Analysis

**YC standard 2024+ deal:**
- $125K SAFE at **$1.785M post-money cap** = 7% equity-equivalent
- $375K MFN SAFE — no cap, "most favored nation" — converts at the cap of the next priced round (or any other SAFE issued before the priced round, whichever is best for YC)

**Practical dilution:**
- At the YC $125K cap alone: 7% pre-Seed
- The $375K MFN SAFE converts at the Seed cap. If Seed closes at $10M post-money cap, the $375K converts to 3.75% additional dilution at Seed.
- **Combined effective YC dilution at Seed close: ~10.75%** (7% from $125K cap + 3.75% from $375K MFN at Seed cap).

**Post-YC + Seed cap table (modeling $10M post-money Seed at $1.5M raise):**

| Stakeholder | Post-YC pre-Seed | Post-Seed |
|---|---|---|
| Phyrom (founder) | ~93% | ~75% |
| YC (combined SAFEs) | ~7% | ~11% |
| Seed lead + co-investors | 0% | ~13% (on $1.5M / $10M post) |
| Option pool (10% reserved) | 0% | 10% (set at Seed) |

Phyrom retains 75% post-Seed — strong founder control through Series A.

**If stacked with Suffolk + Techstars + Wefunder:**

| Stakeholder | Pre-Seed (all four stacked) |
|---|---|
| Phyrom | ~74% |
| YC | ~7% |
| Suffolk | ~5% |
| Techstars | ~6% common (SAFE deferred) |
| Wefunder | ~2% |
| Option pool (deferred to Seed) | 0% |

Stack is mathematically defensible.

**The cost-benefit calculation:** YC dilution is the highest of the equity-taking accelerators on a per-dollar basis when MFN SAFE is included. **It is justified only if** the alumni network specifically delivers (a) Mass Save / utility partnership warm intros, (b) marketplace-operator advisor placement (NFX founders are YC alumni), and (c) the brand-halo effect on the Seed raise. Historically YC alumni do convert into all three at meaningful rates.

**Decision rule:** if accepted, take YC. The brand alone moves the Seed close from possible to likely.

---

## 6. Reviewer-Bias Tips for YC

1. **Concision is a virtue.** YC partners read 10,000+ applications. Every answer above is bounded to ~75 words. Do not exceed. A 200-word "what does your company do" is an immediate dismissal signal.

2. **Plain talk only.** No "AI-powered." No "disrupt." No "synergy." YC partners explicitly mock corporate-speak. Phyrom's natural voice is the right voice.

3. **The 1-minute video is the actual application.** YC partners watch every video. Most read the form afterward. Phone-shot, jobsite, no script.

4. **Founder-market fit is the entire game at pre-seed.** Lead with "I'm a working GC" in three places: Q1 description, Q5 ("why did you pick this"), Q14 ("anything else"). Repetition is a feature.

5. **Specific numbers > vague claims.** "$300M MA Mass Save heat-pump pipeline" beats "huge market." "1,800+ BBB complaints against Angi" beats "incumbents are weak." Pull numbers from the TAM/SAM doc and the competitive analysis matrix.

6. **Apply for an interview, not for funding.** YC partners decide who to interview, not who to fund, from the application. The interview is where the funding decision happens. **The application's job is to earn an interview, not close a round.** Optimize for interest, not for completeness.

7. **Solo-founder framing.** Address the solo-founder question head-on in Q5. Frame it as discipline, capital efficiency, and proof of execution. Do not apologize. Do not invent co-founders.

8. **Apply now regardless of batch cycle.** YC accepts off-cycle. Late applications are reviewed if standout. Submit immediately rather than waiting for the official Winter/Summer window.

9. **One warm intro from a YC alum is worth 10x the cold app.** If anyone in the HJD Builders client network or NHHBA / MEHBA board is a YC alum, ask for a single-line forwarded intro. This is the highest-leverage pre-submission action.

10. **Demo Day is the second selection event.** YC partners pick whom to spotlight at Demo Day based on momentum during the batch. **If accepted, hit Phase 1 hires + first PM-tier anchor by Week 8 of the batch** to earn that spotlight. Don't rest on acceptance.

---

## 7. Submission Checklist Before Hitting Send

- [ ] Phyrom personally rewrites Q5 (founder origin) and Q14 (anything else) in his own voice
- [ ] Real beta cohort numbers replace `[X / Y / Z]` placeholders (date-stamped)
- [ ] 1-minute founder video shot on a NH jobsite, phone-propped, no script
- [ ] No "Wiseman" anywhere — "code-aware quote validation" externally
- [ ] No "AI-powered," "disrupt," "revolutionize," "Uber for X" anywhere
- [ ] LinkedIn URL fully populated
- [ ] Demo link verified working at https://www.thesherpapros.com
- [ ] Application bookmarked for off-cycle resubmission if rejected — YC explicitly invites reapplication next batch
- [ ] Warm intro from any YC alum requested via HJD / NHHBA / MEHBA network if available
