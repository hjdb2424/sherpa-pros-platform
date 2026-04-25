# Sherpa Pros — Embedded Protection Products (White-Label Insurance at Checkout)

**Date:** 2026-04-24
**Status:** Draft v1 — needs broker + attorney review before launch
**Companion doc:** `docs/operations/liability-insurance-framework.md` (4-layer liability model)
**Source spec:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md`

---

## 1. The Opportunity

Phyrom's question: *"Can we offer optional protection at checkout — like rental car insurance or tool rental damage waiver — using a white-label provider?"*

**Yes.** This is called **embedded insurance** and it's a $722B+ market by 2030. It would create:

1. **A new revenue line** — typical platform commission is **20–30% of premium**
2. **Higher customer satisfaction** — buyer feels protected, walks in confident
3. **Dispute deflection** — when something goes wrong, the insurer pays (not Sherpa Pros' reserve)
4. **Higher take rate without raising the take rate** — protection fee is on top of platform commission, not a substitute

**Important distinction from the free Work Guarantee** (Layer 3 of liability framework):

| | **Free Work Guarantee** (built-in) | **Optional Project Protection** (purchased at checkout) |
|---|---|---|
| **Cost to customer** | $0 | 3–5% of job value (or flat fee) |
| **Coverage cap** | $5K/job, $25K/customer/year | $25K–$100K+ depending on tier |
| **Window** | 30 days post-completion | 1–5 years (depending on tier) |
| **Funded by** | Sherpa Pros reserve fund | Real insurance carrier (white-label backend) |
| **What it covers** | Code defect, workmanship, scope mismatch | Above + materials + structural + consequential damage |
| **Regulated as insurance?** | No (contractual guarantee) | Yes (real insurance — needs MGA/carrier backend) |
| **Closest analogy** | Etsy Purchase Protection, Airbnb AirCover | Booking.com travel insurance, Avis LDW, Best Buy Geek Squad |

Both can coexist. Free guarantee = baseline trust. Paid protection = revenue + premium customer tier.

---

## 2. How Peers Actually Do It (2026 Reference)

### Built-in / FREE (analogous to our Work Guarantee)

| Platform | Product | What it covers | Funding |
|---|---|---|---|
| **Airbnb AirCover (host)** | $3M damage protection + $1M liability + $1M experiences/services liability + 24hr safety line + identity verification | Property damage, host liability | Funded by Airbnb fees. **Explicitly NOT insurance** — contractual program. |
| **Airbnb AirCover (guest)** | Re-booking protection if listing has issues, refund if host cancels | Guest experience failures | Same — built into commission |
| **Etsy Purchase Protection** | Up to $250 per order coverage (since 2022 update — was $250 cap on whole order, now $250 per order regardless of order size) | Lost/damaged shipments, items not as described | Funded by Etsy fees. **Explicitly NOT insurance** |
| **Thumbtack Damage Guarantee** | $100K property damage | Pro-caused damage | Self-insured by Thumbtack |
| **TaskRabbit Happiness Pledge** | $10K | Customer dissatisfaction | Self-insured by TaskRabbit |

### Optional / PAID (analogous to what we're designing)

| Platform | Product | Premium | What it covers | Backend |
|---|---|---|---|---|
| **Booking.com Travel Insurance** | Optional at checkout | ~5–8% of trip cost | Cancellation, medical, lost luggage | **Cover Genius (XCover)** white-label |
| **Wayfair Purchase Protection** | Optional at checkout | $30–$200 per item | Damage, accidental, normal wear | **Allstate** white-label |
| **eBay Protection Plus** | Optional at checkout | 3–10% of item price | Extended warranty | **Allstate / SquareTrade** white-label |
| **Avis LDW (Loss Damage Waiver)** | Optional at counter | $30–$50 per day | Vehicle damage waiver | Self-insured by Avis (not technically insurance — contractual waiver) |
| **Home Depot Tool Rental Damage Waiver** | Optional at checkout | 10% of rental cost | Tool damage during rental | Self-insured by Home Depot |
| **Best Buy Geek Squad Protection** | Optional at checkout | 8–25% of product price | Extended warranty + accidental | **AIG / Asurion** white-label |
| **Lyft Driver Protection** | Optional driver subscription | $9.95/mo | Sick days, accident protection | Driver-side benefit (different audience) |

**Pattern:** Big platforms either self-insure (Avis, Home Depot — when they have huge balance sheets) OR partner with a white-label MGA (Cover Genius, Allstate, AIG). Pre-Series A startups go MGA route — no need to build insurance regulatory infrastructure.

---

## 3. Three Product Structures for Sherpa Pros

### Product A — **Sherpa Pros Project Protection** (per-job, optional, at checkout) ⭐ START HERE

**The recommended Phase 1 launch.** Lowest complexity, fastest revenue.

**How it works:**
- After client accepts pro's bid, but before payment, customer sees:

```
┌────────────────────────────────────────────────────────────┐
│  Add Project Protection?                                   │
│                                                            │
│  ☐  Standard ($0) — Free Work Guarantee                    │
│      Up to $5,000 if work fails inspection or has          │
│      a code defect within 30 days                          │
│                                                            │
│  ☑  Plus ($89) — Project Protection                        │
│      Up to $25,000 covered for 1 year                      │
│      Includes materials + structural + consequential       │
│      Deductible: $250                                      │
│      Backed by [Carrier Name] (A.M. Best A-rated)          │
│                                                            │
│  ☐  Premium ($249) — Project Protection Plus               │
│      Up to $100,000 covered for 5 years                    │
│      Includes everything above + appliance failure         │
│      Deductible: $0                                        │
│                                                            │
│  [Continue to Pay]                                         │
└────────────────────────────────────────────────────────────┘
```

**Pricing model:** flat tiers OR percentage-of-job-value (e.g., 3% / 5% / 8%). A/B test to find conversion sweet spot.

**Backend:** White-label via Cover Genius (XCover) or Boost Insurance — they hold the carrier relationship + state licenses + claims processing. Sherpa Pros is the distribution channel.

**Revenue:** Sherpa Pros earns 20–30% commission on each policy sold. At $89 premium × 25% commission = $22 per protected job. At Phase 1 200-job/month volume × 50% attach rate × $22 = **~$2,200/mo additional revenue**. At Phase 2 1,000-job/month volume = **~$11K/mo**.

**Customer angle:** *"For the price of a tank of gas, you're protected up to $25,000 for a full year. Most claims paid in 5 days."*

### Product B — **Sherpa Pros Home Maintenance Membership** (annual, recurring) — Phase 2

**Recurring revenue, higher LTV.** Adapts the home-warranty model (2-10 HomeBuyers Warranty, American Home Shield) to a marketplace.

**How it works:**
- Annual membership (e.g., $199/yr or $19/mo)
- Includes:
  - Priority dispatch (Founding Pros respond first to members)
  - Free standard Project Protection on every job
  - 1 free emergency call per year ($300 value)
  - Annual maintenance check-up (free pro visit)
  - 5% off all completed jobs
- Backed by partnership with existing home warranty company (white-label)

**Backend options:**
- **2-10 HomeBuyers Warranty** — partner program, they handle warranty mechanics, Sherpa Pros earns 15–25% revenue share
- **Super (Best Overall Home Warranty 2026 per USA Today)** — newer, tech-forward, possible co-brand
- **Old Republic Home Protection** — established, partner-friendly
- **HomeServe** — utility-channel-focused, possible synergy with Mass Save

**Revenue:** $199/yr × 25% commission = $50/yr per member. At 500 members = **$25K/yr recurring**. Cleanest revenue line because it's a subscription.

**Why Phase 2 not Phase 1:** requires real volume to justify partnership negotiations, AND only valuable to high-frequency users (homeowners with 3+ jobs/yr).

### Product C — **PM Portfolio Protection** (B2B, recurring, multi-unit) — Phase 2/3

**Highest-LTV product line.** Targets the PM tier.

**How it works:**
- Property Manager pays per unit per year (e.g., $24/unit/year on top of $4/unit platform tier)
- Covers ALL Sherpa Pros work performed at PM's units in that year
- Higher caps ($50K–$250K per claim) because volume + B2B contract
- Includes: all Project Protection above + vendor-failure coverage + tenant-caused-damage carve-out
- Optional: commercial general liability rider for the PM (replaces their per-vendor COI tracking)

**Backend:** Specialty commercial insurance partner (NEXT Insurance, Hiscox, Vouch — different vendor than Product A; needs commercial expertise).

**Revenue:** $24/unit/yr × 25% commission = $6/unit/yr. At 5,000 units (Phase 3 target) = **$30K/yr recurring**.

**Strategic value:** locks PM into Sherpa Pros (switching cost), generates differentiation in the $4/unit competitive battle, supports the Series A "PM tier as enterprise upside" narrative.

---

## 4. White-Label Vendor Analysis (for Product A)

| Vendor | Strengths | Weaknesses | Fit for Sherpa Pros |
|---|---|---|---|
| **⭐ Cover Genius (XCover)** | All 50 US states + 60 countries; 120M+ policies sold; AI/ML dynamic pricing; powers Booking.com, Skyscanner, Wayfair, eBay; single API | Larger client preferred; may have minimum-volume requirements | **Top pick for scale** — best track record with marketplaces. Direct API integration. |
| **Boost Insurance** | API-first, fully white-labeled, MGA model (they hold licenses), startup-friendly, smaller min commitments | Smaller policy catalog than Cover Genius; newer (2017) | **Top pick for early-stage** — built for startups distributing insurance. |
| **Sure** | Strong API, services carriers + brands + marketplaces + SaaS, claims processing built-in | Less marketplace-specific examples; broader product mix means less specialized | **Solid alternative** — good if Boost or Cover Genius don't engage |
| **Bolttech** | Asia-Pacific origin, expanding US, embedded insurance focus | Less US presence than Cover Genius/Boost | Skip for US-only Phase 1 |
| **REIN** | Brands, media, carriers focus | Less marketplace focus | Skip |

**Recommendation:** Reach out to Boost Insurance + Cover Genius in parallel. Cover Genius probably won't engage at our Phase 1 scale, but worth the email; Boost is the more realistic Phase 1 partner.

**Outreach:**
- Boost: [boostinsurance.com/platform](https://boostinsurance.com/platform/) — request demo, mention "marketplace use case, Phase 1 ~200 jobs/month, scaling to 1,000/month in 12 months"
- Cover Genius: [covergenius.com](https://covergenius.com/) — same pitch, emphasize multi-state (NH/ME/MA → all 50 by Phase 4)

---

## 5. Regulatory Considerations

**The single biggest reason to use a white-label MGA: insurance is heavily regulated state-by-state.** Sherpa Pros does NOT want to:

- Get licensed as an insurance carrier (impossible at startup scale)
- Get licensed as an MGA (months of paperwork per state, costly)
- Get licensed as an Insurance Producer (lighter, but still per-state, per-line — NH/ME/MA initially is doable but tedious)

**With white-label MGA backend (Boost / Cover Genius / Sure):**
- The MGA holds all state licenses
- Sherpa Pros is the **distribution channel** — needs only a "limited lines license" or equivalent (depending on state and product type)
- Some states require Sherpa Pros to have a licensed Insurance Producer on staff (or contracted) to sell certain products — flag for attorney
- Disclosures in checkout flow (state-mandated) handled by MGA's compliance copy
- Claims handled by MGA, not Sherpa Pros (huge ops burden lifted)

**Attorney scope (add to Plan §A7 expanded engagement):**
- Confirm state licensing requirements for Sherpa Pros LLC to distribute MGA products in NH/ME/MA
- Review distribution agreement with chosen MGA
- Review checkout flow disclosure language for state compliance

**Important: do NOT confuse "Project Protection" with the free Work Guarantee** in marketing copy or legal docs. Mixing them creates regulatory risk (UDAP — Unfair and Deceptive Acts and Practices). The free guarantee is a contractual program; the paid product is real insurance. Two different products, two different sets of disclosures.

---

## 6. Revenue Model (Detailed)

### Product A — Project Protection (per-job)

**Conservative attach rate assumptions:**
- 30% attach at checkout (industry baseline for embedded insurance)
- 60% choose "Plus" tier ($89), 30% "Premium" ($249), 10% none of the above
- Avg premium: 0.6 × $89 + 0.3 × $249 = $128
- Sherpa Pros commission: 25% = **$32 per protected job**

**Phase 0/1 revenue projection (200 jobs/mo):**
- 200 × 30% attach × $32 = **$1,920/mo** (~$23K/yr) at Phase 1 baseline
- At Phase 2 1,000 jobs/mo: **$9,600/mo** (~$115K/yr)
- At Phase 3 5,000 jobs/mo: **$48K/mo** (~$576K/yr)

**Note:** This is REVENUE not gross merchandise volume — it adds to take rate without raising it.

### Product B — Annual Membership (Phase 2+)
- 500 members × $199/yr × 25% = **$25K/yr**
- 5,000 members × $199/yr × 25% = **$249K/yr** (Phase 4 target)

### Product C — PM Portfolio (Phase 2/3+)
- 5,000 units × $24/yr × 25% = **$30K/yr**
- 50,000 units (Phase 4) × $24/yr × 25% = **$300K/yr**

**Combined embedded-protection revenue line at Phase 4:** ~$1.1M/yr — meaningful contribution to Series B+ unit economics.

---

## 7. Product / UX Surface

### Where it appears in the flow

**Existing flow:**
```
Client posts job → Pro bids → Client accepts bid → Stripe payment → Pro starts work
```

**With Project Protection added:**
```
Client posts job → Pro bids → Client accepts bid →
  ┌─────────────────────────┐
  │ Add Project Protection? │  ← NEW SCREEN
  │ Standard / Plus / Premium│
  └─────────────────────────┘
→ Stripe payment (with optional protection charge bundled) →
  Stripe Connect splits: pro gets job amount – take rate,
  Sherpa Pros gets take rate, MGA gets premium minus commission →
Pro starts work
```

### Components needed (engineering scope for T1)

- New page: `src/app/(client)/jobs/[jobId]/protection/page.tsx`
- New component: `src/components/protection/ProtectionTierCard.tsx`
- New API route: `src/app/api/protection/quote/route.ts` (calls MGA API for real-time quote)
- New API route: `src/app/api/protection/purchase/route.ts` (binds policy + appends to Stripe charge)
- New table: `protection_policies` (jobId, customerId, mgaPolicyNumber, tier, premiumCents, commissionCents, status, purchasedAt, claimUrl)
- Webhook listener: MGA notifies Sherpa Pros of policy status changes (issued, claim-filed, claim-paid, lapsed)
- Profile page: customer's "My Protection" view showing all active policies + claim button

### Marketing surface

- Homeowner landing: add "Optional Project Protection" callout in trust signals row
- Job-acceptance email: mention protection availability
- Post-job email: nudge customers who declined protection ("most customers add protection for jobs over $5K — here's why")

---

## 8. What This Changes in the Phase 0/1 Plan

**Phase 0 — no change.** Embedded protection requires:
- Live transactions flowing (need Stripe Connect live)
- Beta cohort generating real claims data (informs MGA pricing model)
- Attorney engaged (already in plan §A7, expanded scope already flagged in liability framework)
- Real volume (~30+ jobs/mo) to make MGA partnership worthwhile

**Suggested Phase 1 additions (add to next plan revision):**

- **Task K1 (NEW):** Engage Boost Insurance + Cover Genius for embedded protection partnership — Phase 1 Month 4
- **Task K2 (NEW):** State licensing review with attorney — confirm Sherpa Pros LLC needs limited-lines license OR licensed Insurance Producer in NH/ME/MA — Phase 1 Month 4
- **Task K3 (NEW):** Build Project Protection checkout flow (T1 engineering, ~2 weeks) — Phase 1 Month 5
- **Task K4 (NEW):** A/B test 3-tier pricing model (Standard $0 / Plus $89 / Premium $249) — Phase 1 Month 5
- **Task K5 (NEW):** First protected jobs go live — Phase 1 Month 6
- **Task K6 (NEW):** Measure attach rate, claims rate, customer satisfaction lift — Phase 2 Month 6+

**Phase 2 additions:**
- Product B (Annual Membership) — partner with home warranty co (Super, 2-10, Old Republic)
- Product C (PM Portfolio Protection) — specialty commercial insurance partner

---

## 9. Open Questions for Phyrom + Attorney + MGA

1. **Free Guarantee vs Paid Protection differentiation in marketing** — how to NOT confuse customers? Recommended: free guarantee is "Work Guarantee" (built-in), paid is "Project Protection" (purchased). Different naming, different visual treatment.

2. **State licensing** — does Sherpa Pros LLC need a Producer license in NH/ME/MA to distribute Boost/Cover Genius products? Some MGAs handle this via "appointed agent" structure — confirm.

3. **Claims handling** — does the MGA handle claims directly with customers, or does Sherpa Pros Concierge stay in the loop? Customer experience question. Recommended: MGA handles claims, but Concierge gets notified and can intervene if customer is frustrated (don't let MGA black-box the customer).

4. **Pricing — flat tier vs % of job value** — flat tier is simpler (better attach rate) but % aligns better with risk. A/B test in Phase 1.

5. **PM tier pricing** — Product C ($24/unit/yr) is on top of base PM tier ($4/unit/yr drops to $1.50/unit at scale). Does the bundle pricing make sense, or should it be wrapped into a single "Sherpa Pros PM Pro" tier?

6. **Specialty lane risk** — heat pump, electrical panel, EV charger jobs have higher loss frequency. MGA may price them higher OR exclude them. Confirm coverage scope before committing.

7. **Founding Pro perks** — does Project Protection get cheaper for jobs done by Founding Pros (since they have higher quality)? Could be a differentiator: "Founding Pros = lower protection premiums."

8. **Tax treatment** — embedded insurance commission is typically reported as commission revenue (not insurance revenue), simpler tax treatment. Confirm with CPA.

---

## 10. Implementation Sequencing

**Phase 0 (Months 0–3):** No action. Build the underlying foundation (Stripe Connect, beta cohort, dispute workflow per liability framework).

**Phase 1 (Months 3–6):**
- Month 4: Engage Boost + Cover Genius, attorney review state licensing
- Month 5: Build Project Protection checkout flow, integrate MGA API
- Month 6: Launch with first 100 protected jobs, measure attach rate

**Phase 2 (Months 6–12):**
- Month 7–9: Optimize attach rate (A/B pricing tiers, copy variants, placement)
- Month 9–12: Pilot Product B (Annual Membership) — partner with home warranty co
- Month 9–12: Pilot Product C (PM Portfolio Protection) — partner with commercial insurance vendor

**Phase 3 (Months 12–18):**
- Scale all 3 products across 4-metro footprint + Phase 3 expansion markets (Providence, Hartford, NYC specialty)
- Renegotiate MGA commission tiers as volume grows

---

## 11. Recommended First Step

**Action item for Phase 1 kickoff (after first close):**

Email Boost Insurance with this:

> Subject: Embedded protection partnership — construction marketplace
>
> Hi [name],
>
> I'm Phyrom, founder of Sherpa Pros — the national licensed-trade marketplace for residential and small-commercial home services (international roadmap), launching first in NH, ME, and MA. We launched our beta cohort in [month] and are running ~200 jobs/month across the Phase 1 launch metros, scaling to 1,000+/month over the next 12 months.
>
> We want to add an optional Project Protection product at checkout — embedded insurance that gives customers a higher coverage cap and longer window than our built-in Work Guarantee. Tier structure tentatively: Standard (free, our guarantee) / Plus ($89, $25K cap, 1 year) / Premium ($249, $100K cap, 5 years).
>
> Looking for a white-label MGA partner that:
> - Handles the carrier relationship + state licensing in NH/ME/MA (then all 50 by 2027)
> - Offers a single API for real-time quote + bind + claims
> - Works with marketplaces at our scale (early-stage but growing)
>
> Worth a 30-min intro call this week?
>
> Thanks,
> Phyrom · Founder · Sherpa Pros · NH General Contractor · HJD Builders LLC

Same message to Cover Genius. See which engages more substantively.

---

## 12. References

**Embedded insurance vendors:**
- [Cover Genius (XCover) — embedded insurance platform](https://covergenius.com/)
- [Boost Insurance — white-label MGA platform](https://boostinsurance.com/platform/)
- [Sure — insurance API for marketplaces](https://www.sureapp.com/)
- [Bolttech — embedded insurance API](https://bolttech.io/sales/embedded-insurance-api/)
- [Cover Genius 2026 review — Open Banking Tracker](https://www.openbankingtracker.com/embedded-finance/cover-genius)
- [Embedded Insurance Approaches Tipping Point — Insurance Innovation Reporter](https://iireporter.com/embedded-insurance-approaches-tipping-point/)

**Marketplace protection examples:**
- [Airbnb AirCover for hosts (free, contractual)](https://www.airbnb.com/help/article/3733)
- [Etsy Purchase Protection program](https://help.etsy.com/hc/en-us/articles/7471925990807-Etsy-s-Purchase-Protection-Program)
- [Wayfair / eBay protection plans (paid, white-label)](https://help.thimble.com/hc/en-us/articles/4401805596307)

**Home warranty partners (Product B):**
- [American Home Shield](https://www.ahs.com/)
- [2-10 HomeBuyers Warranty](https://www.2-10.com/)
- [Super (Best Overall Home Warranty 2026 per USA Today)](https://hellosuper.com/news/best-overall-home-warranty-2026)
- [Old Republic Home Protection](https://www.orhp.com)
- [HomeServe](https://realestate.usnews.com/home-services/home-warranty/homeserve)

---

## 13. Last Updated
**2026-04-24** — Draft v1 by Claude. Needs broker + attorney review before launch. Add this as **Workstream K (Embedded Protection Products)** to the Phase 0/1 handoff doc — but DON'T spin up a parallel terminal for it yet. K is a Phase 1 workstream, not Phase 0. Phyrom should bookmark this and revisit after first close.
