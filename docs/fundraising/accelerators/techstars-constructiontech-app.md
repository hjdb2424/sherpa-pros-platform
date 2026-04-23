# Techstars ConstructionTech (Powered by Hilti) — Application Draft

**Status:** DRAFT — Phyrom edit pass required before submission
**Drafted:** 2026-04-22
**Priority:** Tier-1 accelerator (per GTM spec §6.2)

---

## 1. Application URL & Open Status

- **Program page:** https://www.techstars.com/accelerators (filter: ConstructionTech / Hilti)
- **Apply page:** Techstars uses a unified F6S-hosted application portal — https://apply.techstars.com/ (verify current cohort link)
- **Cycle:** Most Techstars verticals run **two cohorts/year**. ConstructionTech (Hilti-powered) historically runs a single cohort with applications open ~3 months before kickoff. **VERIFY current cycle dates** — if rolling, submit immediately; if cohort-batched, mark the calendar and submit Day 1 of the application window (early submissions get more reviewer attention before fatigue sets in).
- **Investment:** $20K equity (6%) + $100K SAFE (post-cap) = effective **$120K + opt-in $100K convertible note** = ~$220K total at ~5% common equity exposure.
- **Format:** 13-week intensive. Mentor-driven. Demo Day at end.
- **Decision timeline:** ~8–10 weeks from submission to final cohort selection.

---

## 2. Required Materials Checklist

- [ ] Techstars / F6S application narrative (this doc)
- [ ] Founder video (60-second self-record — see §6 reviewer biases)
- [ ] Live demo link: https://sherpa-pros-platform.vercel.app
- [ ] Pitch deck PDF (link to `docs/pitch/sherpa-pros-deck-v1.md` exported)
- [ ] LinkedIn URL (Phyrom's, fully populated with HJD Builders + Sherpa Pros)
- [ ] Cap table snapshot (Phyrom 100%, no SAFEs)
- [ ] Beta cohort metrics: `[X beta pros, $Y GMV, Z% match-time, NPS N]`
- [ ] 2–3 mentor or industry references (NHHBA / MEHBA / NH licensed-trades vet)

---

## 3. Application Narrative

### Q: Company name + URL + one-line pitch

**Sherpa Pros** — https://sherpa-pros-platform.vercel.app — the licensed-trade marketplace for New England, built by a working general contractor. Jobs, not leads. Code-aware. Permit-aware. Rebate-aware.

### Q: What does your company do? (~150 words)

Sherpa Pros connects homeowners and property managers to verified licensed pros — electricians, plumbers, HVAC techs, roofers, GCs, and specialty trades — across New England. Two things make us different from Angi, Thumbtack, TaskRabbit, Handy, and Houzz Pro:

1. **Every pro is license + insurance verified** before they list, and re-checked on renewal. No "find a guy."
2. **Every quote is validated against code in real time** — NEC, IRC, MA Electrical, NH RSA, 284 NH municipal codes — before the homeowner ever sees it. We catch missing permits, wrong materials, and below-code quotes.

Pros pay 5% on completed jobs during beta (10% standard) and homeowners pay nothing. We are live with web + iOS TestFlight + PWA Android, built on Next.js 16, Stripe Connect, Neon Postgres + PostGIS, Clerk, and Twilio. Beta cohort transacting today across NH, ME, MA in 9 trade categories.

### Q: What is the problem? (~100 words)

The lead-gen platforms most homeowners try first — Angi, Thumbtack, TaskRabbit, Handy, Houzz Pro — sell the same lead to up to 40 contractors, do not verify a license, do not validate a quote, and absorb 15–25% effective from contractor revenue. Massachusetts has the **largest construction labor shortage in the nation** (2.5% construction unemployment, 30% of residential workers 55+, project completion times stretched 7→11 months). The market needs a marketplace that gets licensed work done by verified pros at sustainable contractor economics. None of the incumbents can pivot to this — their entire P&L runs on lead-share. The licensed + code-aware + true-marketplace quadrant is empty.

### Q: What is your solution? (~100 words)

We built the platform from the contractor side first. **Jobs, not leads** — exclusive single-pro dispatch instead of pay-to-bid lead-blast. **Licensed only** — every pro verified at onboarding. **Code-aware quote validation** — proprietary code intelligence layer reads NEC, IRC, MA Electrical, NH RSA in real time and flags missing permits, wrong materials, and below-code minimums. **Permit-aware + rebate-aware** — the platform knows which jobs trigger Mass Save heat-pump rebates, National Grid Turnkey EV charger rebates, and panel-upgrade gateway work. Take rate is 5–10% (vs. Angi's effective $400–$800/closed-job). Property manager tier at $1.50/unit/month. PostGIS-driven Uber-style dispatch on mobile.

### Q: Why now? (~75 words)

Three tailwinds in the same 12-month window: (1) **Mass Save 2026 heat-pump rebates** ($10K+ per home) are activating — national platforms cannot filter for "Mass Save certified," we can; (2) **30% of MA residential workers are 55+ and retiring** — replacement cohort needs jobs, not pay-to-bid noise; (3) **AI code-validation is finally production-grade** — a research paper in 2022, a working product on our platform today. The licensed-marketplace quadrant fills in 24 months either way; we plant the flag now.

### Q: Why your team? (~150 words)

**Phyrom — Founder.** 12+ years as a working licensed general contractor in NH (HJD Builders LLC). Built and operates a multi-project residential GC business. Lived the lead-gen problem on the buy side every day for a decade. Founder of Sherpa Pros and the broader BldSync platform that powers the code intelligence layer.

**Why a working-GC founder is the unfair advantage:** the code intelligence layer is not buildable by a software-only founder — it requires real-time domain judgment about which code violations matter on a jobsite vs. which are cosmetic. Three years of HJD Builders project experience is encoded in it. No incumbent platform employs working contractors. No competitor will replicate this without rebuilding from a contractor's daily problem set.

**Phase 1 hires lined up at first close:** Pro Success Manager (NH/ME), part-time Client Concierge (remote NE), BD lead. Advisor slots open and actively recruiting for marketplace operator + NE trades vet + insurance/risk specialist.

### Q: Why Techstars? Why ConstructionTech? Why Hilti? (~100 words)

Three specific asks:

1. **Hilti enterprise distribution.** Hilti's commercial GC and specialty contractor relationships are the warmest entry point we have to the Phase 2 PM-tier anchor (3 PM chains, $50K+ ARR each). A Hilti-mediated intro to one major NE property-services chain compresses our Phase 2 timeline by 6 months.
2. **Vertical mentor depth.** ConstructionTech founders are working through the same supply-side recruitment, code-validation, and insurance-classification problems we are. The cohort network is more valuable than the cash.
3. **The Techstars network of HQ partners.** Mass Save, National Grid, Eversource — utility CVCs are Phase 3 strategic capital for us. Techstars warm intros to NE utility-CVC partners convert.

### Q: What is your traction? (~100 words)

- **Platform live** at https://sherpa-pros-platform.vercel.app + iOS TestFlight + Android PWA. Built on Next.js 16, Stripe Connect, Neon Postgres + PostGIS, Clerk, Twilio.
- **Beta cohort:** `[X active pros]` across 9 trade categories in 3 states (NH, ME, MA). `[Y jobs]` in first 60 days. `[$Z GMV]` transacted. `[N%]` matched in <2 hours. Pro NPS `[score]`. Code violations caught: `[count]`.
- **Founder pipeline:** HJD Builders direct client list + NHHBA + MEHBA introductions seeded for Phase 1 demand.
- **In flight:** Mass Save Network application, Old-House Verified USPTO trademark, MassCEC + NSF SBIR submissions.

### Q: How big is the opportunity? (~75 words)

TAM ~$731B/year (US residential remodeling + commercial property maintenance). SAM ~$32B/year (NE 6-state). SOM 18-month: $5M+ GMV across 4 metros = <0.06% of four-metro SAM. Sub-vertical pull alone gets us there: Mass Save heat-pump installs are ~$300M MA pipeline/year; National Grid Turnkey EV ~$17.5M/year. We grow into a tiny fraction of an enormous, demand-pulled pie.

### Q: How will you use the Techstars investment? (~75 words)

$220K (combined equity + SAFE) funds Phase 1 hires (1 Pro Success Manager NH/ME + 1 part-time Client Concierge), paid acquisition test on Boston specialty keywords ($5–8K/month for 3 months), platform liability insurance + USPTO Old-House Verified filing + 1099 worker-classification legal opinion (~$15K one-time). The Techstars 13-week cohort runs concurrent with Phase 0 → Phase 1 transition, compressing our Seed-readiness timeline.

### Q: What is your ask of mentors? (~50 words)

(a) Hilti / large-GC distribution introductions; (b) NE utility CVC warm intros (Eversource Ventures, National Grid Partners); (c) marketplace operator (NFX-shaped, two-sided) advisor placement; (d) honest pre-Seed pitch critique from operators who have run construction-tech rounds before us.

---

## 4. Founder-Story Angle (Techstars-Specific)

Techstars' "give first" mentor culture rewards founders who **show up coachable, vulnerable, and concrete**. Avoid the YC bravado tone. Lead with what you do not yet know:

- "We need help on the Mass Save Network application timeline — anyone in the cohort with utility-program experience?"
- "1099 vs. W-2 classification for licensed trades is a live legal question for us — actively recruiting an insurance/risk advisor."
- "We have not yet anchored a PM-tier customer — Hilti's commercial network is the highest-leverage warm intro I can imagine for that."

This **honest-asks framing** is the anti-pattern to most accelerator applications, which are written as if the founder has every answer already. Techstars Managing Directors filter for founders who will use the cohort, not just stamp it on the deck.

**Founder video tip:** record 60 seconds on your phone, on a NH jobsite, no script. Phone propped against a tool. The single most common reason Techstars founder videos fail is over-production. The single most common reason they succeed is "this person is real."

---

## 5. Equity / Dilution Analysis

Techstars terms (industry standard, verify current cohort packet):
- **$20K cash for 6% common equity** (mandatory)
- **$100K SAFE** (optional but standard) — typical post-money cap $5M–$10M depending on cohort

**Post-Techstars cap table modeling:**

Assume Techstars takes 6% common + the $100K SAFE converts at a $5M post-money cap at the next priced round. At a $5M cap, $100K SAFE = ~2% additional dilution.

| Stakeholder | Pre-Techstars | Post-Techstars (program close) | Post-SAFE conversion at Seed |
|---|---|---|---|
| Phyrom (founder) | 100% | 94% | ~92% |
| Techstars (common) | 0% | 6% | 6% |
| Techstars SAFE | 0% | 0% (note) | ~2% |

**Combined dilution if stacked with Suffolk + YC (worst case scenario):**

| Stakeholder | All three accepted, post-conversion |
|---|---|
| Phyrom | ~73% |
| Suffolk Technologies | ~5% |
| YC | ~7% |
| Techstars | ~8% (6% common + ~2% SAFE) |
| 10% option pool | 10% |

Phyrom retains majority + super-voting control. Stacking is mathematically defensible.

**Key tradeoff:** Techstars dilution is the highest of the equity-taking accelerators on a per-dollar-cash basis (~$220K total at ~8% pro-forma). It is justifiable **only if** the Hilti enterprise distribution and NE utility CVC warm intros materialize. If those mentor connections are not strong in the cohort, the equity cost may exceed the strategic value. **Verify the current cohort's Hilti partner depth and utility-CVC connections before signing terms.**

---

## 6. Reviewer-Bias Tips for Techstars

1. **Vertical specificity.** Techstars verticals (ConstructionTech, AgTech, Sports, etc.) have rejected horizontal pitches in favor of deep-vertical specialists for years. Lead with "licensed-trade marketplace for New England" not "marketplace for the trades."

2. **The 60-second video matters more than the deck.** Techstars Managing Directors literally watch every video. Most decks get skimmed. **Phyrom on jobsite, phone-shot, no production = the winning video.** Do not script it.

3. **"Why us, why now" Techstars expects.** Techstars frames every application around (a) why this team uniquely, and (b) why this 12-month window uniquely. Hit both explicitly. The "Why now" answer above does this.

4. **Mentor-fit signals.** Name 2–3 specific Techstars-affiliated mentors or alumni you would want to engage if accepted. (Research the ConstructionTech mentor list ahead of submission.) This signals you have done homework on the program, not just the brand.

5. **Hilti is the strategic partner — name them in the application.** Techstars-Hilti reviewers expect founders to articulate why Hilti specifically (vs. Techstars Boston general). Suffolk Construction relationships may be at large-GC layer; Hilti is at the trade-tooling and specialty-contractor layer. Frame the ask in terms of what Hilti uniquely brings.

6. **Coachability signals.** Mention things you do not yet know. "We have not yet validated PM-tier pricing at scale." "Our cohort metrics are early — beta is 60 days in." Techstars MDs read overconfidence as a red flag at pre-seed.

7. **Application length discipline.** Techstars applications reward concision. Each answer above is bounded by word count. **Do not exceed those bounds.** A 250-word "What does your company do?" answer signals founder unable to compress.

8. **Network commits matter.** If any Techstars alum or affiliated mentor will write a sentence-long reference, get it in via the F6S form. Even one warm signal moves the application out of the cold-pile queue.

---

## 7. Submission Checklist Before Hitting Send

- [ ] Phyrom personally rewrites Q1, Q5, Q6 in his own voice (this draft is scaffolding)
- [ ] Real beta cohort numbers replace `[X / Y / Z]` placeholders (date-stamped)
- [ ] 60-second founder video shot on a NH jobsite, phone propped, no script
- [ ] Pitch deck exported as PDF and linked
- [ ] No instance of "Wiseman" anywhere — externally "code-aware quote validation" only
- [ ] LinkedIn fully populated, HJD Builders + Sherpa Pros clearly listed
- [ ] Cycle dates verified at https://www.techstars.com/accelerators
- [ ] Hilti partner depth + utility-CVC connections in current cohort verified before final sign-off
- [ ] At least one mentor or alum reference initiated via F6S
