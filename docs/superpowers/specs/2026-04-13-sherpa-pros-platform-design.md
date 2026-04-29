# Sherpa Pros Platform — Full Design Spec

> "Every Pro verified. Every project validated. The only marketplace that actually understands construction."

**Repo:** `hjdb2424/sherpa-pros-platform`
**Date:** 2026-04-13
**Status:** Approved — ready for implementation

---

## 1. Platform Identity & Users

### Mission
Uber for construction. An online marketplace connecting vetted contractors, handymen, and clients — with AI-powered construction intelligence that no competitor can replicate.

### User Types

| | Pro (Contractor / Handyman) | Client |
|---|---|---|
| **Who** | Licensed contractors, handymen, specialty trades | Homeowners, property managers, businesses |
| **Vetting** | License + insurance + background check (Checkr) + hybrid human/auto review | Valid payment method + AI project validation (Wiseman-powered) |
| **Onboarding** | Application → auto-checks → human approval → profile build → go live | Sign up → add payment → post first job (vetted by Dispatch Wiseman) |
| **Distinction** | Contractors and handymen are the SAME role — they bid on different project types/scale | N/A |

### Hub & Spoke Geography

```
New England Regional Office
├── NH Hubs
│   ├── Portsmouth/Seacoast
│   ├── Manchester/Nashua
│   └── Concord/Lakes Region
├── ME Hubs
│   ├── Portland/South Coast
│   ├── Lewiston/Auburn
│   └── Bangor
└── MA Hubs
    ├── Boston Metro
    ├── Worcester
    ├── Lowell/Lawrence
    └── Springfield
```

- Pro has a **home hub** + **travel radius** — sees home hub jobs first, then adjacent
- Hub boundaries are invisible to clients — seamless experience
- Regional office handles overlap via Dispatch Wiseman
- Hub threshold (dispatch vs bid cutoff) is configurable per hub

---

## 2. Core Loop — Hybrid Marketplace

### Two Flows Based on Hub-Configurable Threshold (Default $500)

#### Small Jobs (Below Threshold) — Auto-Dispatch

```
Client posts job → Selects urgency (Emergency/Standard/Flexible)
→ Guided wizard: category → scope → photos → Wiseman validates + fills gaps
→ Dispatch Wiseman scores Pros

Emergency: Top 3 Pros notified simultaneously, first accept wins, premium rate
Standard:  Top Pro gets 15 min → decline → next Pro → decline → next Pro
Flexible:  Top 3 notified, 2hr window to accept, best match wins

Fallback: 6 declines OR 2 hours with no accept → converts to open bid

→ Pro accepts → Light onboarding checklist → Work done
→ Photos uploaded → Client approves → Payment released → Both rate
```

#### Large Jobs (Above Threshold) — Competitive Bidding

```
Client posts job → Guided wizard (detailed: scope, timeline, budget range)
→ Wiseman validates (budget reality, permits, scope feasibility)
→ Dispatch Wiseman selects top 5-8 qualified Pros to see the job
→ <3 bids after 48hrs? Open to next tier of Pros automatically

→ Pros submit bids (Pricing Wiseman validates: <15% deviation = green)
→ Client reviews bids (platform recommendation highlighted)
→ Client selects Pro → Milestone schedule created → Full onboarding checklist
→ Work by milestone → Photos + inspection per milestone → Payment released
→ Final walkthrough → Offboarding checklist → Both rate
```

### Urgency Tiers

| Tier | Response Target | Rate Impact | Example |
|------|----------------|-------------|---------|
| Emergency | Hours | Premium (1.5x platform suggested) | Burst pipe, no heat in winter |
| Standard | 1-3 days | Market rate | Broken fence, appliance install |
| Flexible | 1-2 weeks | May see lower bids | Paint bedroom, landscaping |

### Wiseman Intelligence at Every Step

| Checkpoint | Wiseman | What It Does |
|-----------|---------|-------------|
| Job posted | Pricing | Flags unrealistic budgets, suggests ranges |
| Job posted | Code | Auto-identifies permits by jurisdiction |
| Job input | AI Wizard | Parses description, fills gaps, asks smart follow-ups |
| Pro matching | Dispatch | Scores on rating, distance, skills, availability, history, hub load |
| Dispatch fallback | Dispatch | After 6 declines, converts to open bid with expanded Pro pool |
| Bid submitted | Pricing | Validates quote against market rate |
| Job starts | Checklist | Tiered: required gates for large, guided for small |
| Job completes | Checklist | Offboarding, inspection verification |

### Trust & Safety

- Masked communication via Twilio — neither side sees real contact info
- Dispute resolution: auto-mediation → regional office → human review
- Bilateral ratings — Pros rate Clients too. Bad clients lose visibility.
- Strike system — graduated: warning → visibility reduction → pause → deactivation
- Hub-configurable thresholds — Boston vs rural NH can have different dispatch/bid cutoffs

---

## 3. Dispatch Wiseman — The Matching Brain

First Wiseman that lives in Sherpa Pros, not BldSync. Consumes data from other Wisemen but owns all marketplace matching logic.

### Scoring Algorithm

```
Dispatch Score = Σ (weight × normalized_factor)

├── Pro Rating (0.25)         — visibility score from rating algorithm
│                               Time-decay weighted, 90-day half-life
├── Distance (0.20)           — PostGIS ST_DWithin from job site
│                               0-15min = 1.0, 15-30 = 0.8, 30-60 = 0.5, 60+ = 0.2
├── Skills Match (0.20)       — trade/specialty alignment to job category
│                               Exact match = 1.0, adjacent trade = 0.6, general = 0.3
├── Availability (0.15)       — calendar says free on requested dates
│                               Available = 1.0, partial conflict = 0.5, booked = 0.0
├── Response History (0.10)   — accept rate + speed of response
│                               >80% accept + <5min avg = 1.0, decays from there
├── Hub Load Balance (0.05)   — prevent one Pro from hogging all jobs
│                               Active jobs < 3 = 1.0, 3-5 = 0.7, 5+ = 0.3
└── Client Preference (0.05)  — repeat hire boost, saved/favorited Pros
                                Previously hired = 1.5x boost
```

### Hub Overlap Resolution

```
Job in overlap zone (e.g., Nashua — between Manchester + Lowell hubs)

1. Dispatch Wiseman scores ALL qualified Pros across overlapping hubs
2. Hub affiliation is NOT a factor — pure merit + proximity
3. Regional office gets visibility into cross-hub assignments
4. If Pro consistently works outside home hub → platform suggests hub transfer
```

### New User Boost
- First 60 days: 1.3x score multiplier, linear taper to 1.0x
- Ensures new Pros get early visibility to build ratings

### Anti-Gaming
- Score recalculated nightly (2 AM batch) + real-time on key events
- Cherry-picking detection: declining >50% of dispatches in 30 days → warning
- Bid-and-ghost detection: winning bid but not starting work → strike

### Geo Stack

```
├── PostGIS: ST_DWithin for radius matching, ST_Distance for scoring
├── Mapbox GL JS + react-map-gl: map display (Uber's own library)
├── Google Places Autocomplete: address input (rural NH accuracy)
├── deck.gl: hub boundary visualization, service area overlays
└── Mapbox Geocoding API: address → coordinates
```

---

## 4. Payments, Payment Protection & Money Flow

### Payment Architecture

```
Client pays → Stripe Connect → Mercury Treasury (~4% APY)
                                    │
                Job completes       │
                    ↓               │
            Stripe Connect splits:  │
            ├── Pro payout         ←─┘
            ├── Sherpa Pros commission
            └── Stripe fees (~2.9% + $0.30)
```

### Flow by Job Type

**Small Jobs (<$500):**
Client card authorized at booking → held in Mercury Treasury → Pro completes → photos → client approves (or 48hr auto-approve) → Stripe Connect releases payment minus commission.

**Large Jobs ($500+, milestone-based):**
Each milestone funded separately → Mercury Treasury holds → Pro completes milestone → photos + inspection → payment released → repeat until final walkthrough → offboarding checklist → done.

### Fee Structure

| Fee | Amount | Who Pays | Notes |
|-----|--------|----------|-------|
| Pro Commission (<$500) | 15% | Pro | Deducted from payout |
| Pro Commission ($500-$5K) | 12% | Pro | Sliding scale |
| Pro Commission ($5K-$25K) | 10% | Pro | Attracts bigger projects |
| Pro Commission ($25K+) | 8% | Pro | Enterprise tier |
| Client Service Fee | 5% | Client | Added to job total |
| Emergency Premium | Platform keeps 20% of surge markup | Client | 1.5x-2x premium rate |
| Instant Payout | 1% per transfer | Pro | Optional, Stripe built-in |
| Cancellation Fee | $25 flat | Either side | <24hr notice |
| Insurance/Restoration Commission | 6-8% | Pro | Lower because volume + payment guaranteed |
| Background Check | Absorbed | Platform | CAC — differentiator vs charging Pros |

**NOT charging:** Featured/boosted listings (breaks "vetted not paid" brand), lead fees, subscription fees.

### Revenue Example ($5K Job)

```
Client pays:         $5,000 + $250 service fee = $5,250
Pro receives:        $5,000 - $500 commission = $4,500
Sherpa Pros earns:   $500 + $250 = $750
Stripe fees:         ~$153
Net to Sherpa Pros:  ~$597 (11.4% effective take rate)
Plus: Mercury interest on float
```

### Checklists (Tiered)

**Large Jobs ($500+) — Required Gates:**

Onboarding: Pro confirms scope, client confirms start date, milestone schedule agreed + funded, permits identified (Code Wiseman), insurance current, site access details, pre-work photos.

Offboarding: Pro marks complete, finished photos, client walkthrough, punch list resolved, final inspection passed (if permits), client signs off, payment released, both sides rate.

**Small Jobs (<$500) — Guided, Skippable:**

Onboarding: confirm scope + timeline, pre-work photo optional.
Offboarding: completion photo optional (boosts Pro rating), client confirms (or 48hr auto-approve), both sides rate.

---

## 5. Emergency, Restoration & Insurance — Premium Tier

### Market Opportunity
- $60-80B/year residential restoration (water, fire, mold, storm)
- 70% is insurance-funded — guaranteed payment
- No marketplace has cracked insurance MRN integration — whitespace

### Pro Tiers

| Tier | Requirements | Retainer | Access |
|------|-------------|----------|--------|
| Standard Pro | Licensed, insured, vetted | None | Normal marketplace jobs |
| Emergency Ready | Standard + IICRC certified + 4hr SLA | $200-$500/mo | Emergency dispatch, premium rates |
| Restoration Certified | Emergency Ready + WRT/ASD/FSRT + Xactimate | $500-$1,000/mo | Insurance network jobs, guaranteed volume, 6-8% commission |

### Insurance Integration Path

```
Phase 1 (Launch):    Direct referral — homeowner hires Sherpa Pro after filing claim
Phase 2 (6 months):  TPA relationships — pitch Contractor Connection, Alacrity, Sedgwick
Phase 3 (12 months): Managed Repair Network — insurers dispatch through Sherpa Pros
```

### Platform Requirements for Insurance

- IICRC certification tracking in Pro profiles
- Xactimate .esc file ingestion → auto-bid generation (Pricing Wiseman validates)
- SLA enforcement: 2hr contact, 4hr on-site for emergency tier
- Mandatory before/during/after photo documentation
- Insurance-grade per-job reporting for claim approval

### Bilateral Vetting

Projects are vetted too — Wiseman AI validates budget, scope, permit requirements before Pros see them. Protects Pros from lowball scams, impossible scope, and ghost clients.

---

## 6. Tech Stack

```
Frontend:       Next.js 16 App Router + Tailwind 4 + PWA manifest
Backend:        Next.js Server Actions + API Routes (Vercel Functions)
Database:       Neon PostgreSQL + PostGIS (Vercel Marketplace)
Auth:           Clerk (Vercel Marketplace — Pro vs Client roles)
Maps:           Mapbox GL JS + react-map-gl + deck.gl
Geocoding:      Mapbox Geocoding API + Google Places Autocomplete
Real-time:      Vercel Functions + Pusher/Ably for live bids/chat
Payments:       Stripe Connect (marketplace splits + instant payouts)
Settlement:     Mercury Treasury (~4% APY on held funds)
SMS:            Twilio (masked communication)
Background:     Checkr API ($30/Pro)
AI:             Vercel AI SDK + BldSync Wiseman APIs
Deploy:         Vercel (one push = live)
Monitoring:     Vercel Analytics + custom dashboards
```

### Wiseman Integration

Sherpa Pros calls BldSync Wiseman APIs over HTTP:

```
POST bldsync-api/wiseman/pricing/validate-budget
POST bldsync-api/wiseman/code/permit-check
POST bldsync-api/wiseman/checklist/generate
```

Dispatch Wiseman lives IN Sherpa Pros (first Wiseman outside BldSync).

---

## 7. Competitive Moats

| Moat | Description |
|------|-------------|
| Vetted Not Paid | Prove quality to get listed. No pay-to-play. |
| Wiseman Intelligence | AI validates budgets, bids, permits. No competitor has construction-specific pricing/code data. |
| Exclusive Leads | Dispatch Wiseman picks the RIGHT Pros. Not shared leads. |
| Career Platform | Pro's license, insurance, portfolio, reviews, ratings, earnings, schedule all live on platform. High switching cost. |
| Insurance Network | MRN integration is $60-80B whitespace no marketplace has cracked. |

---

## 8. Go-To-Market

### Phase 0: Seed Supply (Weeks 1-8)
- 8-12 vetted Pros per hub across 4+ trades
- Tactics: permit pull lists, supply house partnerships, trade associations, job site recruiting, HJD network
- Referral: $50 signup + $75 first job + $100 fifth job = $225 max per referred Pro
- Launch hubs: Portsmouth NH, Manchester NH, Portland ME

### Phase 1: Soft Launch (Weeks 8-16)
- First 50-100 completed jobs, documented with photos + testimonials
- Channels: property manager partnerships, realtor referrals, Nextdoor, HJD client overflow
- Build proof portfolio for Phase 2 marketing + Phase 3 insurance pitch

### Phase 2: Paid Growth (Months 4-8)
- Google Local Services Ads ($25-$50 CPA), SEO, Facebook/Instagram (before/after content)
- Expand to 6 hubs (add Concord NH, Lewiston ME, Lowell MA)
- Target: 500+ completed jobs, unit economics proven

### Phase 3: Insurance & Emergency (Months 6-18)
- Launch Emergency Ready tier with retainers
- Build 50+ emergency job portfolio
- Target regional TPAs (Crawford, Sedgwick, Pilot Catastrophe)
- Pilot: 10 claims in one hub → prove model → first MRN contract

### Phase 4: Scale (Month 12+)
- All 10+ hubs active, 500+ Pros, 1-2 TPA relationships
- Expansion: RI, VT, CT

### Key Metrics

| Metric | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|--------|---------|---------|---------|---------|
| Active Pros | 30-50 | 100-200 | 200-350 | 500+ |
| Completed jobs/mo | 20-50 | 100-300 | 300-500 | 1,000+ |
| Active hubs | 3 | 6 | 8 | 10+ |
| Monthly revenue | $2-5K | $15-40K | $50-100K | $200K+ |

---

## 9. Investor Strategy

### Timeline

```
Month 0-4:   Bootstrap ($25-40K) — build platform, recruit 50 Pros, first 100 jobs
Month 4-6:   Pre-seed ($250-500K SAFE) — proof: $50K+/mo GMV, NPS >40
Month 8-12:  Seed ($1.5-3M at $10-15M post) — proof: $150K+/mo GMV, insurance pilot
```

### Investor Metrics Targets

| Metric | Seed Target |
|--------|------------|
| GMV/month | $100-200K |
| Blended take rate | 12-15% |
| Liquidity (3+ bids in 24hr) | >60% |
| Client NPS | >50 |
| Pro NPS | >40 |
| Client repeat (12mo) | >30% |
| Pro retention (6mo) | >70% |

### The Pitch

"Every competitor sells leads. We sell verified project completion. Contractors build careers on our platform. We're the only marketplace that actually understands construction — powered by AI that validates every budget, bid, and permit requirement. And we're building the first tech-native Managed Repair Network for insurers — a $60-80B market no startup has cracked."

---

## 10. Revenue Streams

```
1. Marketplace commissions (8-15% sliding scale)
2. Client service fee (5%)
3. Emergency premium (20% of surge markup)
4. Pro retainers ($200-$1,000/mo for emergency/insurance tiers)
5. Instant payout fees (1%)
6. Cancellation fees ($25)
7. Mercury Treasury interest on settlement float
8. Future: Insurance MRN dispatch fees
```

---

## Appendix: Reference Repos

| Repo | Stars | Use |
|------|-------|-----|
| visgl/react-map-gl | ~8K | Uber-built React wrapper for Mapbox |
| visgl/deck.gl | ~12K | Hub boundary polygons, heatmaps |
| ManjiCoder/Uber-Next-App | — | Dispatch UI reference |
| achris-alonzo30/uber-clone | — | Full booking flow reference |

## Appendix: BldSync Sherpa Pros Module

Existing module at `~/BldSync/sherpa-pros/` with 500+ tests. Key components to port/reference:
- Rating algorithm (7-factor, time-decay, strike system)
- Matching engine (PostGIS, composite scoring)
- Job state machine (8 states)
- Notification system (BullMQ, 11 event types)
- Twilio masked communication
- Availability calendar
- Review/response system
- Leaderboard
