# Sherpa Pros — Quick Job Lane (Small Jobs $200–$1,500)

**Date:** 2026-04-24
**Status:** Draft v1 — needs Phyrom + Pro Success Manager review before launch
**Source spec:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` (this is a Phase 1 amendment — small jobs were under-specified)
**Companion docs:**
- `docs/operations/liability-insurance-framework.md`
- `docs/operations/embedded-protection-products.md`

---

## 1. The Gap

Phyrom's question: *"What about small $250 paint-a-wall projects (1–2 hours), or $500–$750 toilet installs?"*

The spec is heavily tuned for **Project mode** — multi-bid, code-aware, Wiseman-validated jobs in the $5K–$50K range (kitchen remodels, heat pumps, electrical panel upgrades, old-house specialty work). That's the moat and the investor pitch.

**But:** the marketplace ALSO needs small-job liquidity, and the current model breaks for them:

| Current model element | Works for $25K kitchen | Breaks for $250 wall paint |
|---|---|---|
| 3-bid bidding flow | ✅ Yes | ❌ Wastes 3 pros' time on a 2hr job |
| Wiseman code-aware quote validation | ✅ Critical (NEC, IRC, permits) | ❌ Painting a wall doesn't need NEC |
| 7-day Stripe hold | ✅ Sensible | ❌ Customer paid same day, pro wants money tomorrow |
| Project Protection $89 (paid insurance) | ✅ 0.4% of $25K — easy upsell | ❌ 36% of $250 — ridiculous |
| Permit-aware workflow | ✅ Often required | ❌ Toilet swap usually no permit |
| Tier 2 dispute (re-match w/ pro) | ✅ Worth $500 mobilization | ❌ Replacement pro costs more than the job |
| Concierge proactive outreach for >$10K jobs | ✅ Right threshold | ❌ Wrong audience |
| Rating threshold gating (4.5★) | ✅ Right severity | ✅ Right severity |
| 5%/10% take rate | ✅ $1,250–$2,500 take | ✅ $12.50–$25 take (still works) |

**Spec contradiction to acknowledge:** §5 of `competitive-analysis.md` says we don't compete with TaskRabbit-style assembly. **That's still true** — TaskRabbit's median task is $50–$150 unskilled (assembly, moving, errands). But $250 paint-a-wall and $500–$750 toilet-install are **light licensed work** in a different category — Angi and Thumbtack handle these poorly, and TaskRabbit doesn't cover them at all.

**The category we own:** $200–$1,500 light licensed jobs that need a real handyman / plumber / painter / electrician but don't need a full project flow.

---

## 2. Why Small Jobs Matter (Don't Cede This Lane)

| Reason | Detail |
|---|---|
| **Liquidity** | Small jobs are 5–10× more frequent than big jobs. Pro engagement + review velocity + matching algorithm training data all benefit. |
| **Acquisition** | Most homeowners try a platform with a $200 small job before trusting it with a $25K kitchen remodel. **Small jobs are the funnel into big jobs.** |
| **Pro retention** | Handymen, plumbers, painters need volume. A pro who only gets 2 big jobs a year leaves the platform. A pro who gets 8 small jobs/month stays. |
| **LTV per customer** | Same homeowner does 3 small jobs + 1 big job per year. Multiplies revenue per acquisition. |
| **Defense vs Angi/Thumbtack/Handy** | These platforms own the small-job lead-gen revenue today (~50% of their volume). Cede this and we leave their economics intact. |
| **Founding Pro variety** | Beta cohort needs handyman/painter/light-trade pros for liquidity, not just specialty (heat pump, EV, panel). Currently under-specified. |

**Strategic answer:** YES, build the Quick Job lane. But as a **distinct product mode** with its own UX, dispatch, pricing, insurance — not a half-broken version of the Project flow.

---

## 3. Two Product Modes

| | **Project mode** (existing) | **Quick Job mode** (new) |
|---|---|---|
| **Job size** | $1,500+ typical, up to $50K+ | $200–$1,500 |
| **Examples** | Kitchen remodel, heat pump install, panel upgrade, full repaint, roof replacement, old-house specialty | Toilet install, faucet swap, drywall patch, single-wall paint, ceiling fan install, GFCI outlet, leaky valve replacement, garbage disposal install |
| **Customer flow** | Post job → describe scope → 3 pros bid → customer picks → Wiseman validates → schedule → payment protection → complete → 7-day hold → release | Pick from menu → see flat price + ETA → confirm pro → confirmed within 30 min → completed within 24–48hr → instant release |
| **Pricing model** | Pro bids, Wiseman validates fairness | Sherpa Pros sets price band per task per metro; pro opts in to lane |
| **Match style** | Multi-bid (2–3 pros), customer picks | Match-and-go (1 pro auto-assigned, customer confirms) |
| **Wiseman code validation** | YES (NEC, IRC, MA Electrical, NH RSA, permits) | LIGHT (basic safety + obvious-mistake catch only — full validation overhead not warranted) |
| **Permit handling** | Permit-aware workflow, pro pulls | None for most (toilet swap, paint, drywall — no permit). Flag jobs that need permits — kick to Project mode. |
| **Stripe hold** | 7-day | 24-hour (or instant on first-job-completion) |
| **Free Work Guarantee** | $5K cap, 30-day window | $1K cap, 14-day window (scaled down) |
| **Paid Project Protection** | Available ($89/$249) | Not offered (premium > 20% of job is silly) |
| **Take rate** | 5%/10% | 5%/10% (same — small change matters less per job, more per volume) |
| **Customer base** | High-intent homeowners + PMs | Same + impulse-need homeowners ("just need someone to fix the toilet today") |
| **Pro base** | Licensed specialty (electrician, plumber, HVAC, GC) | Handyman, painter, light-plumber, light-electrician, sole-prop tradesperson |

---

## 4. The Quick Job Catalog (Phase 1 Launch Menu)

**Pre-priced flat-rate menu — Sherpa Pros sets the price band per metro based on local labor rates (per HomeGuide / Fixr / Thumbtack 2026 averages).** Pro opts into the lane and accepts the rate (or proposes a counter for unusual scope).

### Bathroom

| Task | Estimated time | NH/ME price | MA price | Notes |
|---|---|---|---|---|
| Toilet install (customer-supplied toilet) | 1.5–2 hr | $250–$350 | $325–$450 | Most jobs no permit; flag old-house if cast-iron drain |
| Toilet replacement (Sherpa Pros supplies via Zinc) | 2–3 hr | $500–$750 | $650–$950 | Includes new toilet $200–$400 |
| Faucet replacement (bath or kitchen) | 1–1.5 hr | $150–$250 | $200–$325 | Customer-supplied faucet |
| Garbage disposal install | 1–2 hr | $200–$300 | $275–$400 | Customer-supplied unit |
| Toilet flapper / fill valve repair | 30–60 min | $125–$175 | $150–$225 | Service-call fee + parts |

### Painting

| Task | Estimated time | NH/ME price | MA price | Notes |
|---|---|---|---|---|
| Single accent wall paint (≤120 sqft) | 1.5–2 hr | $200–$275 | $275–$350 | Customer-supplied paint |
| Single room paint (walls only, ≤200 sqft) | 4–5 hr | $400–$600 | $525–$725 | Customer-supplied paint |
| Single room paint + ceiling | 5–7 hr | $550–$750 | $700–$925 | Customer-supplied paint |
| Touch-up + minor patching (per visit) | 1–2 hr | $175–$275 | $225–$350 | Includes small drywall patches |

### Drywall / Patching

| Task | Estimated time | NH/ME price | MA price | Notes |
|---|---|---|---|---|
| Small patch (≤6"× 6") + paint blend | 1.5–2 hr | $200–$300 | $275–$400 | One-trip if paint matches |
| Medium patch (≤24" × 24") + sand + prime | 2–3 hr | $300–$425 | $400–$550 | May need 2 trips for cure |
| Lath-and-plaster spot repair (Boston specialty) | 2–4 hr | n/a | $400–$650 | **Old-House Verified pros only** |

### Electrical (light — single-circuit work)

| Task | Estimated time | NH/ME price | MA price | Notes |
|---|---|---|---|---|
| Ceiling fan install (existing wiring) | 1.5–2 hr | $200–$300 | $275–$400 | Customer-supplied fan |
| GFCI outlet replacement | 30–45 min | $125–$175 | $175–$225 | **Licensed electrician required** |
| Light fixture swap (existing wiring) | 30–60 min | $125–$175 | $175–$225 | Customer-supplied fixture |
| Smart switch / dimmer install | 30–60 min | $125–$200 | $175–$250 | Per location |

### Plumbing (light)

| Task | Estimated time | NH/ME price | MA price | Notes |
|---|---|---|---|---|
| Leaky valve / shutoff replacement | 1–2 hr | $200–$325 | $275–$425 | Common emergency call |
| Trap or supply line replacement (under sink) | 1–1.5 hr | $175–$275 | $225–$350 | |
| Garbage disposal repair (no replacement) | 1 hr | $150–$225 | $200–$300 | Diagnostic + reset usually |

### Light handyman / general

| Task | Estimated time | NH/ME price | MA price | Notes |
|---|---|---|---|---|
| TV mount install (drywall) | 1 hr | $150–$225 | $200–$275 | Customer-supplied mount |
| TV mount install (brick / lath-plaster) | 1.5–2 hr | $200–$300 | $275–$375 | Higher skill |
| Door knob / deadbolt replacement | 30–45 min | $100–$150 | $135–$200 | Per door |
| Smoke / CO detector swap | 30 min/unit | $75–$125 | $100–$150 | Per unit |
| Window blind install | 30–60 min | $100–$175 | $135–$225 | Per window |

**Out of scope for Quick Job lane (kick to Project mode):**
- Anything requiring a permit (most full-bath, kitchen, electrical panel work)
- Anything requiring multi-trade coordination
- Anything where Wiseman flags code complexity
- Heat pump work, EV charger install, panel upgrades (Boston specialty lanes — Project mode)
- Any structural change

---

## 5. Pricing Model & Take Rate

**Sherpa Pros sets the price band** per task per metro (initially: NH/ME band, MA band; later: hyper-local by zip code as data accumulates).

**Pro options:**
1. **Accept-as-priced:** pro opts into lane, takes any job in scope at the displayed price. Highest visibility.
2. **Counter-quote:** pro can adjust ±15% per job (system warns customer if above standard). Reduces match priority.
3. **Decline:** pro skips, system finds next pro. No penalty.

**Take rate:**
- Same as Project mode: **5% beta / 10% standard**
- $250 wall paint × 10% = $25 take
- $500 toilet install × 10% = $50 take

**Why same take rate, not higher:** Quick Job depends on volume + pro acceptance. Higher take = pros leave the lane. The volume is the play.

**Service-call fee handling:** For very small jobs (<$150), Sherpa Pros can structure as **flat $40 service call + per-task add-ons** (matching industry norm). E.g., "Service call $50 + smoke detector swap $50 each — 3 detectors = $200 total."

**Trip charge:** Sherpa Pros' service area is 45-mile radius from Portsmouth; we don't add per-mile trip charges within service area (creates customer surprise at checkout). Outside service area = different conversation entirely.

---

## 6. Insurance & Protection (Adjusted for Small Jobs)

### Free Work Guarantee — scaled down for Quick Job

- **Cap:** $1,000 per job (vs $5,000 for Project mode)
- **Window:** 14 days post-completion (vs 30 days for Project mode)
- **Coverage:** workmanship defect, leak immediately after work, paint failure, obvious-mistake reversal
- **Why scaled down:** $5K cap on a $250 job is 20× the job value — customer-friendly but creates moral hazard. $1K cap is 4× the job value, generous but reasonable.

### Paid Project Protection — NOT OFFERED in Quick Job mode

- $89 premium on a $250 job is 36% of job value. Customer would (rightly) decline.
- White-label MGAs won't underwrite low-premium short-duration policies — minimum premium typically $35–$50.
- Skip this product line for Quick Jobs entirely.

### NEW — "Same-Day Guarantee" (light add-on protection for Quick Jobs)

Optional $9 add-on at checkout:
- If pro is more than 30 minutes late to scheduled window → automatic $25 credit
- If pro can't complete within agreed time → free re-book + first-rebook $0 platform fee
- If job fails work-quality check → priority re-match within 4 hours

**Why this works at $9:** customer values predictability above all for small jobs. Same-Day Guarantee converts on the predictability promise. ~30% attach rate plausible.

**Backend:** Self-insured by Sherpa Pros (no MGA needed at $9 premium — lower than MGA threshold). Treat as platform fee, not insurance product.

**Revenue:** $9 × 30% attach × 200 Quick Jobs/mo = **$540/mo** (small but pure margin).

---

## 7. Dispatch & Workflow

### Customer flow (target: <90 seconds from app open to confirmed pro)

```
1. Customer opens Sherpa Pros app
2. Taps "Quick Job" tab (vs "Project")
3. Picks task from menu (2 taps): "Bathroom" → "Toilet install"
4. Confirms address + preferred time window (today / tomorrow / this week)
5. Sees price + ETA: "$325 — Mike R. can be there at 2pm today"
6. Optional: add Same-Day Guarantee ($9)
7. Stripe charge confirmed (24hr hold)
8. Pro confirmation push notification → customer sees "Mike confirmed, ETA 2:00pm"
9. Pro arrives, completes work, marks done in app
10. Customer rates 1–5 stars + photo of result (within 14 days)
11. Stripe releases to pro 24hr after completion (sooner with pro request)
```

### Pro flow (target: <30 seconds to accept or decline)

```
1. Pro receives push notification: "Quick Job: Toilet install $325, 2.4 mi away, today 2pm"
2. Pro sees: customer photo (optional), task description, materials list, ETA
3. Pro taps Accept (or Decline + reason for system learning)
4. If accepted: customer notified within 30 seconds
5. Pro arrives, photo-uploads pre-work (validates address + scope)
6. Completes work, photo-uploads post-work
7. Marks done; payment released within 24hr
```

### What NOT to do

- ❌ No multi-bid (defeats the speed promise)
- ❌ No full Wiseman code validation (overhead for jobs that don't need it; LIGHT validation only — flag obvious safety issues)
- ❌ No 7-day Stripe hold (kills pro acceptance — they want money tomorrow)
- ❌ No mandatory permit-pull workflow (auto-route to Project mode if Wiseman flags permit need)

### Engineering scope (T1, ~3 weeks)

- New screens: Quick Job tab, task menu, pre-priced quote screen, confirmation flow
- New API: `src/app/api/quick-job/quote/route.ts`, `/api/quick-job/dispatch/route.ts`
- New tables: `quick_job_catalog` (taskCode, metro, priceBandMin, priceBandMax, estimatedDuration), `quick_job_pros` (proId, taskCode, optedIn, lastJobAt)
- Stripe Connect modification: 24hr hold variant
- Pro app: push-notification accept/decline flow
- Customer app: rapid 5-step booking flow

---

## 8. Pro Side — Who Opts Into Quick Job Lane

**Two pro types per spec §5.1 cohort:**

1. **Project-only pros** — specialists (heat pump installer, master electrician, master plumber). High-ticket work, code-heavy. Don't opt into Quick Jobs unless slow week.
2. **Quick Job pros** — handymen, painters, light-plumbers, sole-prop tradespeople. Volume play. Opt into all Quick Jobs in their service area + skill match.
3. **Both-mode pros** — most pros opt into BOTH lanes. Take Quick Jobs to fill schedule between Project work.

**Onboarding additions:**
- Pro picks which Quick Job categories they accept (bathroom, painting, drywall, light electrical, light plumbing, handyman)
- Pro confirms acceptance of standard pricing band per category
- Pro sets daily Quick Job acceptance cap (e.g., "max 3 Quick Jobs/day")
- Existing license + insurance verification still applies (but lower coverage acceptable for handyman scope)

**Insurance note for Quick Job pros:**
- General handyman pros may carry lower CGL ($500K vs $1M for Project pros)
- Quick Job lane requires CGL minimum $500K, less than Project mode minimum $1M
- Track separately in `pro_insurance_certificates` table

---

## 9. Beta Cohort Impact

**Spec §5.1 currently has 10–12 beta pros, heavily skewed to specialty:**
- 2 GCs (HJD network) — Project
- 2 handymen — could do BOTH
- 1 plumber — BOTH
- 1 HVAC / heat-pump specialist — Project
- 1 painter — could do BOTH
- 1 landscaper — Project (seasonal)
- 1 licensed electrician — Project + light Quick Job
- 1 old-house specialist — Project
- 1 roofer — Project

**Expanded recommendation: add 4–5 Quick-Job-dedicated pros** (total cohort 14–17 pros):
- +1 dedicated handyman (Boston metro — high Quick Job density)
- +1 painter focused on small projects (NH/ME)
- +1 light plumber (Manchester or Portsmouth — high call volume)
- +1 light electrician (Boston suburbs — ceiling fans + GFCIs + smart switches)
- +1 cleaning / move-in-ready handyman (PM tier crossover)

**Why expand cohort:**
- Quick Job lane needs high pro density to deliver <30-min match promise
- Acquiring small-job pros is EASIER than specialty (lower onboarding bar, faster decision, 5% take is very competitive vs Angi $400+ effective lead cost)
- Each Quick Job pro generates 5–8x more transactions than a Project pro → faster traction data for fundraise

**Updated Phase 0 beta cohort target: 15+ pros (was 10+).**

---

## 10. Revenue Projections

### Phase 0 (Months 0-3, beta cohort)
- Project mode: ~30 jobs at avg $5K = $150K GMV × 5% = $7.5K take
- Quick Job mode (if launched): ~100 jobs at avg $400 = $40K GMV × 5% = $2K take
- Same-Day Guarantee: 30 sales × $9 = $270 platform fee
- **Total: $9.8K take in 60 days** (vs $7.5K Project-only — adds 30% to revenue)

### Phase 1 (Months 3-6, post-first-close)
- Project: 200 jobs × avg $5K × 10% = $100K take/mo
- Quick Job: 500 jobs × avg $400 × 10% = $20K take/mo
- Same-Day Guarantee: 150 × $9 = $1.35K/mo
- Project Protection (paid): 30% × 200 × $32 = $1.9K/mo
- **Total: $123K take/mo by Month 6**

### Phase 2 (Months 6-12)
- Project: 1,000 jobs × $5K × 10% = $500K take/mo
- Quick Job: 4,000 jobs × $400 × 10% = $160K take/mo (volume kicks in)
- Same-Day Guarantee: 1,200 × $9 = $10.8K/mo
- **Quick Job becomes ~25% of platform revenue at Phase 2 scale**

### Strategic value beyond direct revenue
- Quick Job becomes the **acquisition funnel** for Project work (homeowner does $250 wall paint → comes back for $25K kitchen remodel 6 months later)
- Quick Job becomes the **liquidity engine** for the matching algorithm (more jobs = better match data)
- Quick Job becomes the **defense** vs Angi/Thumbtack/Handy in their owned category
- Quick Job becomes the **PM tier killer feature** — property managers love same-day reliable handyman dispatch (toilets break, smoke detectors fail, every week)

---

## 11. Brand Consistency Check

**Risk:** Quick Job lane could dilute the "licensed-trade marketplace" positioning if not handled carefully.

**Mitigation in messaging:**
- Quick Job pros are STILL licensed (where state requires) — handyman license, electrician for electrical, plumber for plumbing
- Pre-priced menu emphasizes professionalism: "Our menu prices include a licensed pro — no surprise fees"
- Compare to Angi/Thumbtack: "$50 vs $400+ in lead-gen costs hidden in their pricing"
- Compare to TaskRabbit: "Real licensed plumber, not a tasker"
- Same Brand Guardian rules apply (no Wiseman externally, no AI-powered headline, no surname for Phyrom)

**What we can claim:**
- ✅ "Licensed plumber for $325 toilet install — confirmed in 30 minutes"
- ✅ "Same-day painters who actually paint walls correctly"
- ✅ "Licensed electricians for ceiling fans and GFCIs at handyman prices"

**What we can't claim:**
- ❌ "Sherpa Pros = licensed-only" (true for Project, mostly true for Quick Job — handyman general work is unlicensed in many states)
- ❌ "Code-validated" for every Quick Job (light validation only, not full Wiseman)

**Headline rewrite for the Quick Job tab:**
> *"Real licensed pros. Pre-priced. Confirmed in 30 minutes. The handyman lane Angi can't deliver."*

---

## 12. What This Changes in the Plan

**Phase 0:**
- §5.1 beta cohort: expand from 10-12 to **15+** (add 4-5 Quick Job pros)
- §5.4 tech gates: add Quick Job lane infrastructure as Phase 1 task (DON'T block Phase 0 on it)

**Phase 1 (add new Workstream L — Quick Job Lane):**
- L1: Define Quick Job catalog with metro-specific pricing (use the table in §4 above as starting point)
- L2: Engineering build (T1, ~3 weeks): catalog, dispatch, pricing API, customer + pro flows, Stripe 24hr-hold variant
- L3: Recruit 4-5 Quick Job pros to expand cohort (T2 / T3 from handoff doc)
- L4: Soft-launch Quick Job tab to existing beta customers (Month 4)
- L5: Public launch Quick Job tab (Month 5)
- L6: Same-Day Guarantee A/B test ($9 add-on at checkout)
- L7: Measure attach rate, time-to-match, customer satisfaction lift, Project-mode-conversion rate (Quick Job → Project upsell)

**Phase 2:**
- Expand Quick Job catalog based on Phase 1 attach data
- Hyper-local pricing (zip code level)
- PM tier integration: PM dispatches Quick Jobs to preferred-vendor list with one tap
- Subscription model: "Sherpa Pros Quick Job Plus" — $19/mo for fixed discount on all Quick Jobs

---

## 13. Open Questions for Phyrom

1. **Brand position:** is "Quick Job" the right name? Alternatives: "Same-Day," "Express," "Handyman Lane," "Sherpa Now." Test with 5 beta customers + 5 beta pros.

2. **Catalog scope:** the §4 menu has ~30 tasks. Too many or too few for launch? Recommend launching with 12 most common (toilet install, faucet swap, wall paint, drywall patch, ceiling fan, GFCI, garbage disposal, smoke/CO detector, TV mount, door knob, light fixture, leaky valve), expand quarterly.

3. **Pro-side acceptance rate:** what minimum acceptance rate (% of offered Quick Jobs accepted) qualifies a pro to stay in the lane? Recommend 50% acceptance to maintain "30-minute match" promise.

4. **Pricing-band overrides:** when a pro counter-quotes (e.g., toilet install $400 instead of $325), should customer see both options ("standard $325 / Mike's quote $400 — slightly higher due to old plumbing")? Or auto-decline and find next pro? UX trade-off.

5. **Service-call-fee minimum:** for very small jobs (<$150), do we charge a Sherpa Pros service-call fee + per-task pricing, or pure flat-rate? Industry standard is service-call fee. Recommend yes for brand professionalism (avoids race-to-bottom on tiny jobs).

6. **Material handling:** customer-supplied vs Sherpa Pros-supplied via Zinc integration. Toilet install $250 (customer-supplied) vs $700 (Sherpa Pros supplies). Should both options live in catalog?

7. **PM tier interaction:** does PM tier get Quick Job at a different rate (volume discount)? Recommended yes: PM gets 7% take rate on Quick Jobs (vs 10% for individual customers). Locks PM in.

8. **Existing competitive analysis update needed:** spec §5 of `competitive-analysis.md` says "we don't compete with TaskRabbit assembly." That's still true. But add explicit clarification: "We DO compete with Angi/Thumbtack/Handy on small licensed jobs ($200–$1,500). Quick Job lane is the wedge."

---

## 14. Suggested First Step

**Phase 0 (now):** No code work needed. But amend two things:

1. **Beta cohort recruiting (Workstream B in handoff doc):** expand target from 10-12 to 15+ pros, add the 4-5 Quick Job pro types listed in §9. Tell T2/T3/T5 marketing/ops terminals to recruit a wider mix.

2. **Spec amendment:** add a "Quick Job lane" callout to spec §5 (Beta Cohort) acknowledging that the cohort serves both Project and Quick Job modes; the Quick Job lane launches in Phase 1 once base infrastructure is proven.

**Phase 1 kickoff (after first close):** open this doc, design the catalog with Phyrom's input, brief T1 engineering on the 3-week build, brief T5 marketing on Quick Job tab launch.

---

## 15. References

**Pricing data:**
- [HomeGuide 2026 Handyman Hourly Rates](https://homeguide.com/costs/handyman-prices) — $48-$115/hr range
- [Fixr 2026 Handyman Cost Guide](https://www.fixr.com/costs/handyman) — service call fee $40-$75
- [HomeAdvisor 2026 Handyman Price List](https://www.homeadvisor.com/cost/handyman/) — flat-rate $150-$600 typical
- [Angi 2026 Toilet Installation Cost](https://www.angi.com/articles/how-much-does-toilet-installation-cost.htm)
- [Homewyse 2026 Toilet Install Calculator](https://www.homewyse.com/services/cost_to_install_toilet.html)
- [HouseCall Pro Handyman Pricing Guide 2026](https://www.housecallpro.com/resources/how-to-price-handyman-jobs/)

**Competitor pre-priced models:**
- [HomeAdvisor Fixed Price Services](https://www.homeadvisor.com/) — owned by Angi
- [Thumbtack Instant Match](https://www.thumbtack.com/) — auto-assignment, +40% impressions in 2026
- Handy flat-rate booking — limited public 2026 data; legacy model still ~$99 for 2 hours

---

## 16. Last Updated

**2026-04-24** — Draft v1 by Claude. Needs Phyrom + first-Pro-Success-Manager review before launch. Add Workstream L (Quick Job Lane) to handoff doc — but L is a Phase 1 workstream, not Phase 0 (same as Workstream K — Embedded Protection Products). Amend spec §5.1 beta cohort to expand to 15+ pros and acknowledge the Quick Job lane.
