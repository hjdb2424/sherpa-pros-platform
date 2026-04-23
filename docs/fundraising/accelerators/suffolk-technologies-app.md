# Suffolk Technologies — BOOST Accelerator Application Draft

**Status:** DRAFT — Phyrom edit pass required before submission
**Drafted:** 2026-04-22
**Priority:** ⭐ TOP PRIORITY (bullseye fit per GTM spec §6.2)

---

## 1. Application URL & Open Status

- **Program page:** https://www.suffolktechnologies.com/boost
- **Apply page:** https://www.suffolktechnologies.com/apply (verify at submission)
- **Cycle:** Cohorts run roughly twice yearly (spring + fall). 8-week structured program. **VERIFY current cohort window before submitting** — Suffolk historically opens applications ~2 months before cohort kickoff. If between cycles, send a "founder intro + early-look" email to the BOOST team and ask to be notified when applications reopen.
- **Format:** Online application + intro video + optional warm intro from a Suffolk Construction exec or BOOST alum.
- **Decision timeline:** ~6–10 weeks from submission to cohort acceptance.

---

## 2. Required Materials Checklist

- [ ] Online application narrative (this doc)
- [ ] Pitch deck (link to `docs/pitch/sherpa-pros-deck-v1.md` — convert to PDF / Google Slides)
- [ ] One-pager (Brand Guardian-reviewed — produce W4 of Phase 0)
- [ ] 2–3 minute founder intro video (Phyrom on a real NH jobsite, not a Loom of slides — see §6 below for biases)
- [ ] Live demo link: https://sherpa-pros-platform.vercel.app
- [ ] Founder bio + headshot
- [ ] Cap table (clean — Phyrom 100%, no SAFEs outstanding pre-Suffolk)
- [ ] Beta cohort traction snapshot: `[X beta pros, $Y GMV, NPS Z]` — date-stamped within 7 days of submission
- [ ] Two reference contacts (1 from HJD network = client testimonial, 1 from beta cohort = pro testimonial)

---

## 3. Application Narrative

### Q: Company name + one-line description

**Sherpa Pros** — the licensed-trade marketplace for New England, built by a working general contractor.

### Q: What does Sherpa Pros do?

We connect homeowners and property managers with verified licensed pros — electricians, plumbers, HVAC, roofers, GCs, specialty trades — and we do two things that lead-gen platforms (Angi, Thumbtack, TaskRabbit, Handy) structurally cannot:

1. **Verify the license and the work.** Every pro is license-checked and insurance-verified before they list, and re-checked on renewal. No "find a guy" matchmaking.
2. **Validate the quote against code.** Every quote runs through a code-aware validator (NEC, IRC, MA Electrical, NH RSA, 284 NH municipal codes). The homeowner sees a "code-checked" badge on the bid before they accept it. We catch missing permits, wrong materials, and quotes that fall below code-compliant minimums.

Pros pay 5% of completed jobs (10% post-beta). Homeowners pay nothing. Property managers pay $1.50/unit/month for the PM tier — about a third of what they pay incumbent vendor-management tools today.

### Q: What problem are you solving?

Massachusetts has the **largest construction labor shortage in the nation**: 2.5% construction unemployment (lowest in 17+ years), 30% of MA residential construction workers are 55+ vs. 26% nationally, and project completion times have stretched from 7 to 11 months. Homeowners can't get jobs done. Pros can't afford to keep paying for leads that go to four other bidders.

The platforms that should solve this are structurally broken. Angi sells the same lead to up to 40 contractors. Thumbtack has documented deposit-theft complaints in the $300–$1,600 range per incident. TaskRabbit takes 22.5% effective and doesn't cover licensed trades at all. Houzz Pro has 1.03★ on the BBB across 500+ complaints, with contractors reporting $5K+ spend and zero leads. None of these platforms can verify a license, validate a quote against code, or pull a permit — and none of them ever will, because their P&L runs on lead-share, not completed work.

The "licensed + code-aware + true marketplace" quadrant of this market is empty. We plant the flag there.

### Q: How big is the market?

- **TAM:** ~$731B/year (US residential remodeling + repair $524B per JCHS LIRA 2026 + US commercial property maintenance $207.5B per Market Research Future).
- **SAM:** ~$32B/year across the New England 6-state footprint; ~$8.5B/year across our four Phase 1–2 metros (Boston MA, Manchester NH, Portsmouth NH, Portland ME).
- **SOM (18 months):** $5M+ GMV across the four-metro footprint (Phase 2 exit gate). This is < 0.06% of four-metro SAM — we deliberately set targets below 1 basis point of SAM to keep the trajectory defensible.
- **Sub-vertical pull:** Mass Save heat-pump installs alone are ~$300M GMV/year of MA pipeline. National Grid Turnkey EV charger installs add ~$17.5M/year. We capture a fraction of these and we hit Phase 2 numbers from one sub-vertical.

### Q: Why now?

Three tailwinds converging in the same 12-month window:

1. **Mass Save 2026 heat-pump rebates are hitting the street.** $10K+ per home. National platforms cannot filter for "Mass Save certified." We can.
2. **30% of MA residential construction workers are 55+ and retiring this decade.** The contractors homeowners trust are aging out, and the replacement cohort needs jobs, not pay-to-bid noise.
3. **AI is finally good enough to do the code work.** A code-aware quote validator that reads NEC + IRC + MA Electrical in real time was a research paper in 2022. It's a working product on our platform today.

Miss this window and somebody else will fill the licensed-marketplace quadrant in 24 months. Probably someone with worse founder-market fit.

### Q: What's your traction?

- **Platform:** Live at https://sherpa-pros-platform.vercel.app. Mobile via TestFlight (iOS) + PWA (Android). Built on Next.js 16, Stripe Connect, Neon Postgres + PostGIS, Clerk, Twilio.
- **Beta cohort:** `[X beta pros]` active across 9 trade categories in 3 states (NH, ME, MA). `[Y jobs]` posted in first 60 days. `[$Z GMV]` transacted. `[N%]` of jobs matched in under 2 hours. Pro NPS `[score]`. Code-aware validations run: `[count]`. Code violations caught before homeowner saw the quote: `[count]`.
- **Founder pipeline:** HJD Builders' direct client network + NHHBA + MEHBA introductions = warm-side recruiting and demand pre-seeded for Phase 1.
- **Mass Save Network application:** in flight. Old-House Verified USPTO trademark filing in Phase 0 W4.

### Q: Who's on the team?

**Phyrom — Founder.** 12+ years as a working licensed general contractor in New Hampshire (HJD Builders LLC). Lived the lead-gen problem from the buy side every single day for a decade. Built the platform he wished existed. Single founder at present, with Phase 1 hires (Pro Success Manager, Client Concierge, BD) lined up to start at first close.

**Why a single working-GC founder is a feature, not a bug:** capital efficiency. The product is built. The code-aware engine took three years and a contractor's daily problem-set to design. No one out-builds it without that combination.

### Q: What's your ask, and what would Suffolk Technologies bring?

**Ask:** A spot in the next BOOST cohort.

**What we want from Suffolk specifically (the things YC and Techstars cannot give us):**

1. **Suffolk Construction enterprise pilots.** Sherpa Pros' PM tier has been built but not yet anchor-validated. A Suffolk-mediated pilot with a Suffolk-managed property or a Suffolk preferred-vendor reroute through Sherpa Pros is the single highest-leverage proof point we can carry into a Seed raise.
2. **Built-environment mentor access.** The classes of advice we need most — large-GC operations, commercial real-estate vendor management, insurance/risk dynamics on multi-family portfolios — sit in the Suffolk operator network in a way they sit nowhere else.
3. **Built-environment VC introductions.** Suffolk's VC arm + portfolio overlap with Building Ventures, Brick & Mortar Ventures, Foundamental, Zacua, Schematic, Nine Four. We have a tier-1 NE-VC list (`docs/fundraising/...`) but warm intros from BOOST partners convert at a different rate than cold.
4. **Boston enterprise cred for the Mass Save / National Grid lane.** Suffolk's Boston gravitas accelerates the utility-partnership conversations we are otherwise grinding for in Phase 1–2.

**Use of the BOOST stipend / ongoing investment terms:** Phase 1 hires (1 Pro Success Manager + 1 part-time Client Concierge), paid acquisition test on Boston specialty keywords ($5–8K/month), and platform liability insurance + 1099 worker-classification legal opinion (~$15K one-time).

### Q: Anything else we should know?

I'm a working contractor. I built this because I needed it. I'm still building on jobsites in NH while Sherpa Pros is in beta. The day I take a Suffolk meeting, I'm coming straight from a project — that's the founder you're funding. The product is real, the founder-market fit is unforgeable, and the single thing that turns a strong NE marketplace play into a generational built-environment company is what BOOST gives access to: enterprise pilots, large-GC operator wisdom, and Boston gravitas. That's exactly the wrap I'm asking for.

---

## 4. Founder-Story Angle (Suffolk-Specific)

Suffolk Technologies' thesis is **operator-led built-environment startups**. Their reviewers respond to (a) founders who lived the problem on a jobsite, (b) products that fit into a real GC's workflow, and (c) startups that would benefit specifically from large-GC distribution.

**Lead with the GC angle in every sentence.** Phyrom is not a "tech founder who learned construction" or a "construction-tech consultant who built a tool." He is a working New Hampshire general contractor whose crew gets pitched these broken lead-gen platforms every week. Suffolk wants exactly that founder. Do not soften this — it is the entire moat.

**Founder video should be shot on a real jobsite.** Tools in hand. No "studio." No slide deck on screen. Suffolk's reviewers see 100s of polished VC-style pitch videos a year and almost no legitimate site videos. This is the differentiator.

---

## 5. Equity / Dilution Analysis

Suffolk Technologies BOOST historically takes a **modest equity stake** for the cohort (terms vary by cohort and are not always publicly disclosed; estimate **~3–6% on a $50K–$200K-equivalent value of program + potential follow-on**). **VERIFY current cohort terms in the BOOST application packet** before signing.

**Post-Suffolk cap table assuming ~5% Suffolk + 7% YC (if both accepted) + 7.5% Wefunder fee on $250K Reg CF + 10% reserved option pool:**

| Stakeholder | Pre-Suffolk | Post-Suffolk only | Post-Suffolk + YC + Wefunder + pool |
|---|---|---|---|
| Phyrom (founder) | 100% | 95% | ~76% |
| Suffolk Technologies | 0% | 5% | ~5% |
| Y Combinator | 0% | 0% | ~7% |
| Wefunder community | 0% | 0% | ~2% |
| Option pool (employees) | 0% | 0% | 10% |

**Key takeaway:** Suffolk equity dilution is modest relative to the strategic upside of (a) Suffolk Construction enterprise pilots and (b) Built-environment VC warm intros. **The strategic value of the BOOST cohort exceeds the equity cost by an order of magnitude** for a built-environment startup. This is the easiest "yes" on the accelerator slate if accepted.

**Conflict to manage:** if Sherpa Pros also accepts YC ($500K @ 7%) in the same window, the combined Suffolk + YC dilution still leaves Phyrom > 75% pre-Seed — well within healthy founder-control bounds for a Seed conversation 4–6 months later. Stack both if both are offered.

---

## 6. Reviewer-Bias Tips for Suffolk Technologies

1. **Operator-first, not technology-first.** Suffolk reviewers were construction operators before they were VCs. Lead every paragraph with the jobsite reality, not the AI/ML stack. Mention Wiseman/code-aware engine only after the operator narrative is established.

2. **Built-environment specificity wins over horizontal sweep.** Do not pitch "marketplace for everything." Pitch "licensed-trade marketplace for the Northern Triangle + Boston specialty lanes." Suffolk has explicitly funded vertical specialists and rejected horizontal me-toos.

3. **Suffolk Construction itself is a customer prospect.** Frame slide-7 PM tier as "this works for the Suffolk Construction-managed property portfolio" — not in those exact words, but the implication should be visible to the reviewer. They will run the math themselves.

4. **Mention Suffolk by name in the application.** Do not be coy. "We are applying to Suffolk Technologies specifically because we need (a) Suffolk Construction enterprise pilot access, (b) operator-mentor depth that sits inside the Suffolk network, (c) built-environment VC warm intros." Show you did the homework.

5. **Code-aware validation is the moat — not the AI.** Suffolk reviewers have heard "AI-powered" 1,000 times. They have not heard "we read NEC, IRC, MA Electrical, and 284 NH municipal codes in real time and catch quote violations before the homeowner sees them." Lead with the latter every time.

6. **Capital efficiency is a positive signal.** Single founder + built product + beta cohort transacting on $0 of investor capital is exactly the profile Suffolk respects. Do not apologize for the small team — frame it as discipline.

7. **The MassCEC + Mass Save story doubles your Boston credibility.** Mention the in-flight Mass Save Network application + MassCEC InnovateMass / Catalyst submissions. Suffolk reviewers know these programs by name and will treat their adoption as third-party validation.

8. **The "what we don't compete on" discipline (per `docs/pitch/competitive-analysis.md` §5) impresses sophisticated reviewers.** Mention 2–3 of these explicitly: we do not build TaskRabbit-style assembly, we do not build Houzz-style designer portfolios, we do not pursue insurance-restoration networks (Servpro / Belfor) at this stage. This is rare in pre-seed pitches and Suffolk reviewers will notice.

---

## 7. Submission Checklist Before Hitting Send

- [ ] Phyrom personally rewrites Q1, Q4, Q9 in his own voice (this draft is scaffolding only)
- [ ] Real beta numbers replace `[X / Y / Z]` placeholders (date-stamped within 7 days)
- [ ] Founder video shot on a real NH jobsite (not a Loom of slides)
- [ ] Pitch deck PDF exported and linked
- [ ] One-pager PDF Brand-Guardian-reviewed
- [ ] No instance of the word "Wiseman" anywhere in the application narrative or video — externally always "code-aware quote validation" or "code intelligence layer"
- [ ] Cap table attached (Phyrom 100% pre-investment, no outstanding SAFEs)
- [ ] Cycle window verified at https://www.suffolktechnologies.com/boost
- [ ] Suffolk-affiliated warm intro requested before submission if available (BOOST alumni in HJD/NHHBA/MEHBA network)
