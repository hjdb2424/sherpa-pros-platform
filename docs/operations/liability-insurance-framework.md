# Sherpa Pros — Liability, Insurance, Claims & Customer Satisfaction Framework

**Date:** 2026-04-24
**Status:** Draft v1 — needs attorney + broker review before publishing
**Source spec:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` (this fills a gap in §10 R5/R6 + §5.4 tech gates)

---

## 1. Why Sherpa Pros ≠ Uber / DoorDash

Uber and DoorDash invented the modern gig-marketplace insurance playbook, but Sherpa Pros' risk profile is structurally different. Don't copy their model wholesale.

| Dimension | Uber / DoorDash | Sherpa Pros |
|---|---|---|
| **Worker type** | Unskilled gig drivers, no required license | Licensed contractors (EPA, NEC, IRC, state-board) |
| **Worker carries own insurance?** | Personal auto only (no liability requirement beyond DMV) | **Required** — General Liability + Workers' Comp + Commercial Auto + state surety bond |
| **Primary risk type** | Bodily injury (auto accidents, food allergens) | **Property damage** (a wrong panel install can flood a $500K home) + bodily injury + code/regulatory violation |
| **Severity per claim** | $25K avg auto bodily injury | $5K–$500K+ per construction defect or property damage |
| **Frequency per gig** | Very low (millions of rides per accident) | Higher (any job touching gas/water/electrical/structure has real exposure) |
| **Regulatory exposure** | State PUC + DMV | Building codes (NEC, IRC, MA Electrical, NH RSA) + permits + Mass Save program rules |
| **Pre-job risk reduction** | None — driver skill/luck | **Code-aware quote validation** flags issues before work starts (this is our moat AND a liability-reducer) |

**Implication:** Sherpa Pros' insurance + dispute model can lean MORE on the pro's own coverage (which is mandatory for licensed trades anyway) and LESS on platform-funded coverage. But platform-funded **professional liability / errors & omissions** matters more (because we're matching, scoping, and validating — those are E&O exposures).

---

## 2. How Uber and DoorDash Actually Cover It (2026 Reference)

### Uber (current 2026 coverage)
- **Period 1** (app on, no ride accepted): state minimums only — $50K/$100K/$25K
- **Period 2** (ride accepted, en route): $1M auto liability + contingent comp/collision
- **Period 3** (passenger on board): $1M liability + UM/UIM + contingent comp/collision ($2,500 deductible)
- **Driver carries** personal auto + optional rideshare endorsement ($15–$30/mo)
- **Uber's coverage is excess** to driver's personal coverage
- **Disputes:** in-app refund, may withhold from driver earnings if at fault
- **Quality control:** rating floor (typically 4.6★) → deactivation
- **Tort defense:** Uber defends platform-named claims; driver-named claims go to driver's personal insurance first

### DoorDash (current 2026 coverage)
- **$1M excess auto liability** during active delivery (accept → mark delivered)
- **$1M occupational accident insurance** (no premium/deductible to dasher) — covers medical, disability ($500/wk), survivors ($150K)
- **No coverage for dasher's vehicle damage**
- **Excess** to driver's personal insurance
- **Disputes:** in-app refund, may charge back dasher

### TaskRabbit / Thumbtack / Angi (home services peers)
- **TaskRabbit:** **No insurance for taskers.** Tasker is personally responsible. Customer "Happiness Pledge" = $10K guarantee (limited).
- **Thumbtack:** $100K property damage guarantee + $1K refund-of-fee guarantee.
- **Angi:** Contractor verification only. No platform-level customer guarantee.

**The gap we exploit:** Angi/Thumbtack/TaskRabbit verify weakly and underwrite weakly because their margins are thin and their pros are heterogeneous (mix of licensed and unlicensed). Sherpa Pros only takes licensed pros — meaning every pro we list ALREADY carries the insurance their customers need. Our job is to **verify + monitor + bridge gaps + handle disputes well**.

Sources: [Uber Insurance 2026](https://www.uber.com/us/en/drive/insurance/) · [DoorDash Insurance 2026](https://therideshareguy.com/doordash-insurance/) · [Marketplace Comparison Guide 2026](https://checkthat.ai/brands/taskrabbit/alternatives) · [Construction Insurance Market 2026](https://gritinsurance.com/blog/2026-construction-insurance-market-outlook) · [Professional Liability Pricing 2026](https://www.professionalliabilityinsurancecost.com/)

---

## 3. The Four-Layer Sherpa Pros Liability Stack

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 4 — Dispute Resolution Workflow                       │
│ (in-app dispute → Concierge mediates → escalation tiers)    │
└──────────────────────────┬──────────────────────────────────┘
                           ▲
┌──────────────────────────┴──────────────────────────────────┐
│ Layer 3 — Customer Satisfaction Guarantee                   │
│ (Stripe 7-day hold + Sherpa work guarantee, $-capped)       │
└──────────────────────────┬──────────────────────────────────┘
                           ▲
┌──────────────────────────┴──────────────────────────────────┐
│ Layer 2 — Sherpa Pros Platform Insurance (excess/contingent)│
│ (CGL + Tech E&O + Cyber + Marketplace Endorsement)          │
└──────────────────────────┬──────────────────────────────────┘
                           ▲ (kicks in only when Layer 1 exhausted)
┌──────────────────────────┴──────────────────────────────────┐
│ Layer 1 — Pro's Own Insurance (PRIMARY, mandatory)          │
│ (CGL + WC + Commercial Auto + Surety Bond)                  │
└─────────────────────────────────────────────────────────────┘
```

**Default rule:** Layer 1 is always first. The pro is the liable party — they did the work. Sherpa Pros' Layer 2/3/4 only kicks in when (a) pro's coverage exhausted, (b) Sherpa Pros is named directly (matching error, scope error, platform negligence), or (c) we've made an explicit work guarantee.

---

## 4. Layer 1 — Pro's Own Insurance (Mandatory at Onboarding)

**Required from every Founding Pro before they take a single job:**

| Coverage | Minimum Limit | Why | Evidence |
|---|---|---|---|
| **Commercial General Liability (CGL)** | $1M per occurrence / $2M aggregate | Property damage + bodily injury at the jobsite | Certificate of Insurance (COI) naming Sherpa Pros LLC as Additional Insured |
| **Workers' Compensation** | Statutory state minimums | Required if pro has employees; even sole proprietors should consider for major work | COI or sole-proprietor exemption form (NH/ME/MA forms differ) |
| **Commercial Auto** | $1M combined single limit | Required for any trucks/vans used for job site travel + tool transport | COI |
| **State Surety Bond** | State-specific (NH: varies by trade; MA: $5K-$25K typical for home improvement contractors per CSL; ME: home construction registration) | Required by state to operate as a licensed contractor | Bond certificate or state license verification |
| **Tools & Equipment** *(optional but recommended)* | Pro's choice | Pro's own tool theft/damage | Self-attest |

**Verification process (per plan §A4 OpenSign beta agreement):**

1. **At onboarding:** Upload all required COIs to profile. Sherpa Pros LLC named as Additional Insured on CGL. Manual verify by ops team in Phase 0; auto-verify via API integration (e.g., NEXT Insurance, Vouch) in Phase 2+.
2. **At job acceptance:** Real-time check that COI hasn't expired (system blocks job acceptance if expired).
3. **Annually:** Auto-reminder 60 days + 30 days + 7 days before expiry. Pro is paused (cannot accept new jobs) if expiry hits without renewal.
4. **State board verification:** Quarterly check that license is still active (auto-revocation by state = auto-pause on Sherpa Pros).

**Insurance Certificate Tracking — implementation surface:**
- New table needed: `pro_insurance_certificates` (proId, type, carrier, policyNumber, effectiveDate, expiryDate, coiUrl, additionalInsuredVerified, lastCheckedAt)
- Background job: nightly expiry-check + email/SMS reminder cadence
- Profile UI: "Insurance" tab showing all current COIs + expiry countdown

---

## 5. Layer 2 — Sherpa Pros Platform Insurance

**Platform-level coverage that Sherpa Pros LLC carries.** This is what plan §A5 references but underestimates ($800/yr is way too low — accurate range is $5K–$15K/yr in Phase 0/1).

| Coverage | Recommended Limit | 2026 Estimated Annual Cost | Why |
|---|---|---|---|
| **Commercial General Liability (CGL)** | $1M/$2M | $800–$1,500 | Slip-and-fall at any Sherpa Pros office, advertising injury, basic business liability |
| **Tech Errors & Omissions (E&O) / Professional Liability** | $1M/$2M | $2,000–$5,000 | **The big one for us.** Covers claims that the platform's matching, scope generation, or quote validation was wrong → caused harm. Tied to Wiseman's code-aware claim. |
| **Cyber Liability** | $500K–$1M | $1,000–$2,500 | Data breach (pro/client PII), ransomware, regulatory notification costs |
| **Marketplace Endorsement** *(carve-out, not standalone)* | Embedded | +$500–$1,500 | Specific carve-out that the platform isn't liable as the contractor — pro is. Vouch, Embroker, Newfront all sell this for marketplace startups. |
| **Directors & Officers (D&O)** *(when board/investors join)* | $1M | $2,000–$5,000 | Defends Phyrom + future board against shareholder/investor suits. **Required at Series A.** |
| **Employment Practices Liability (EPLI)** *(post first hire)* | $500K–$1M | $800–$2,000 | Defends against wrongful termination, discrimination, harassment claims. Not needed in Phase 0 (no employees). |

**Phase 0 minimum stack (estimated annual cost: $4K–$9K):**
- CGL $1M/$2M
- Tech E&O $1M/$2M (THIS IS NON-NEGOTIABLE — it's our biggest exposure)
- Cyber $500K
- Marketplace endorsement
- *Skip* D&O until Series A
- *Skip* EPLI until first FT hire

**Brokers who specialize in tech/marketplace startups (not generic small business brokers):**
- ⭐ **Vouch Insurance** ([vouch.us](https://www.vouch.us)) — built specifically for tech/marketplace startups, all-in-one packages, Founders Fund / Y Combinator partner
- **Embroker** ([embroker.com](https://www.embroker.com)) — tech/startup focused, strong on E&O
- **Newfront** ([newfront.com](https://www.newfront.com)) — tech-broker hybrid, larger client base
- **Hiscox Small Business** — general but solid CGL pricing
- **Acrisure / Founder Shield** — specialty in venture-backed startups

**Phyrom action:** Engage Vouch (or 2 of the above for quotes) in Plan Task A5. Replace the placeholder ~$800/yr with $4K–$9K/yr realistic figure. Update R6 mitigation accordingly.

**Important construction-marketplace nuance:** because pros carry their own CGL + WC + auto, Sherpa Pros' Layer 2 is structurally CHEAPER than a similar marketplace with unlicensed/unverified workers (e.g., TaskRabbit). The pros' coverage is the big buffer.

---

## 6. Layer 3 — Customer Satisfaction Guarantee

**The Sherpa Pros Work Guarantee** (recommended structure — needs attorney sign-off):

> If a Founding Pro completes a job through Sherpa Pros and the work fails inspection, doesn't match the agreed scope, or has a code defect within 30 days of completion, we will: (1) re-match you with another verified pro to fix it at no additional platform fee, OR (2) refund your platform-paid amount up to **$5,000 per job, $25,000 per customer per year**.

**Why these caps:**
- $5K matches Thumbtack's similar "happiness pledge" (Sherpa Pros' is wider scope: covers code defects, not just dissatisfaction)
- $25K customer-year cap protects against repeat-claim abuse
- Above the cap: claim falls back to the pro's CGL ($1M+) — which is the appropriate carrier
- Beyond pro's CGL: lawsuit territory, our Tech E&O kicks in if Sherpa Pros named

**What the guarantee does NOT cover:**
- Pre-existing conditions homeowner failed to disclose
- Damage caused by homeowner's own actions (turning off water valve, etc.)
- Acts of nature (storm during install)
- Work outside of agreed scope (homeowner asked for "more")
- Cosmetic preferences ("I don't like the color") — matching color must be in scope

**Stripe Connect 7-day hold = the escrow mechanism:**
- Customer pays at job completion → funds held by Stripe for 7 days
- Pro can request earlier release via in-app button (waives dispute window)
- During 7-day window, customer can file dispute → funds frozen until resolved
- After 7 days with no dispute → auto-release to pro, guarantee window narrows but doesn't close (30-day guarantee still applies, but funded from Sherpa Pros reserve, not from holdback)

---

## 7. Layer 4 — Dispute Resolution Workflow

**Two-track resolution.** Customer files in-app dispute. Sherpa Pros Concierge triages within 24 hours.

### Track A — Quality complaints (workmanship, code defect, scope mismatch)

```
Customer files dispute (in-app, during 7-day hold or up to 30 days post-completion)
    │
    ▼
Concierge triage within 24hr — gather: photos, code-validation log, original scope, communication log
    │
    ▼
Tier 1 — Refund/credit (≤$500 platform-paid)
    Auto-approve if Wiseman code-check flagged the issue OR if pro response time >48hr
    │ (resolves in 48hr)
    │
    ▼
Tier 2 — Re-match with replacement pro at no platform fee (claim $500–$5,000)
    Sherpa Pros covers replacement pro's first $250 mobilization
    │ (resolves in 5-10 days)
    │
    ▼
Tier 3 — Sherpa Pros work guarantee invocation ($5K cap per job)
    Sherpa Pros pays customer up to $5K from reserve
    Original pro's rating drops + strike issued
    Original pro pays back via deduction from future earnings
    │ (resolves in 14-30 days)
    │
    ▼
Beyond cap — Direct claim against pro's CGL
    Customer files claim with pro's insurer (info from pro profile)
    Sherpa Pros provides Wiseman validation log + scope + communication record as evidence
    Sherpa Pros NOT named in claim (Layer 2 marketplace endorsement protects)
    │
    ▼
If Sherpa Pros named — Tech E&O kicks in
    Sherpa Pros' attorney handles defense
    Argument: code-aware validation reduced not eliminated risk; pro is independent contractor
```

### Track B — Safety incidents (injury, major property damage, regulatory violation)

- **Immediate:** pause pro from accepting new jobs (pending investigation)
- **Within 4hr:** Phyrom + attorney notified
- **Within 24hr:** customer connected to pro's CGL + WC carriers (info from profile)
- **Within 48hr:** internal incident report filed (preserves attorney-client privilege)
- **Within 7 days:** decision on pro deactivation, public statement (if needed), regulatory disclosure (if required by state)

**Evidence chain (mandatory for every job — already partially in product):**
- Wiseman code-validation log (timestamped, signed)
- Original scope of work
- Photos pre/during/post (already in product)
- Permit numbers + inspector approvals (where applicable)
- Communication log (Twilio messages — already encrypted)
- Stripe payment record
- Pro's COI on file at time of job
- License verification on file at time of job

---

## 8. Customer Satisfaction (NPS) Framework

**The proactive layer — most disputes get prevented, not resolved.**

### Scoring + monitoring

- **Weekly NPS survey** (already in plan §B4 — schema migration 005 added `nps_responses` table)
- **Per-job rating** (1-5 stars + open text, in product today)
- **Pro-side rating threshold:**
  - **<4.5★ rolling 90-day average** → automated warning + Pro Success Manager outreach
  - **<4.0★ rolling 90-day** → temporary pause (cannot accept new jobs), human review, possible coaching
  - **<3.5★ rolling 90-day** → deactivation, final payout processed
- **Single-job catastrophic floor:** any 1★ rating with property damage flag → manual incident review within 24hr (regardless of overall rating)

### Concierge proactive outreach

- **High-value job (>$10K):** Concierge proactively check-in with client at job start, mid-point, completion
- **High-risk trade (heat pump, electrical panel, structural):** Concierge proactively confirms permit pulled + inspection scheduled
- **First-time client:** Concierge sends welcome message, shares dispute process upfront ("if anything goes wrong here's what we do")
- **Repeat client (3+ jobs):** Concierge sends thank-you + asks for referral

### Investor-facing health metrics (already on the dashboard — `/admin/investor-metrics`)

- NPS time series (pro + client)
- Pro retention cohort (quality control proxy)
- Client repeat rate (satisfaction proxy)
- % jobs matched <2hr (liquidity, drives satisfaction)
- Funnel completion rate (posted → reviewed)

---

## 9. Terms of Service + Arbitration Clause + Indemnification

**Phase 0 attorney engagement (plan §A7) must produce these documents:**

1. **Terms of Service (ToS) for clients**
   - Defines Sherpa Pros' role as a marketplace, NOT the contractor
   - Limits Sherpa Pros' liability to platform-paid amount
   - Includes the work guarantee structure (Layer 3) with explicit caps + exclusions
   - **Mandatory binding arbitration clause** (avoids class actions — critical given construction's litigation pattern)
   - Class-action waiver
   - 30-day dispute window for non-safety claims
   - Choice of law: Delaware (standard for tech) or NH (Sherpa Pros LLC home state)

2. **Pro Service Agreement** (per plan §A4 OpenSign template)
   - Independent contractor classification (per plan §A7 attorney memo on 1099 vs W2)
   - Pro indemnifies Sherpa Pros for jobsite incidents
   - Pro carries the required insurance (Layer 1)
   - Sherpa Pros may withhold earnings to pay valid customer disputes
   - Mandatory binding arbitration for disputes between Sherpa Pros and pro
   - Beta-pricing grandfathering language (5% take forever for Founding Pros)

3. **Work Order Terms** (per job, accepted at bid acceptance)
   - Defines the job scope (auto-generated from Wiseman scope + pro's bid)
   - Code-validation acknowledgment (customer + pro both confirm code-aware quote)
   - Permit responsibility allocation (pro pulls; client signs)
   - Payment terms (Stripe Connect, 7-day hold)
   - 30-day work guarantee invocation procedure

**Cost estimate for attorney work (plan §A7):**
- 1099 classification opinion memo: $1,500–$3,000
- Full ToS + Pro Agreement + Work Order template package: $5,000–$10,000
- SAFE template review (Wefunder): $1,000–$2,000
- **Total Phase 0 attorney spend: ~$10K–$15K** (currently understated in plan)

---

## 10. What This Changes in the Phase 0 Plan

**Plan amendments needed (to be reflected in next spec/plan revision):**

| Plan reference | Current | Should be |
|---|---|---|
| §A5 platform liability insurance | "~$800/yr" | "$4K–$9K/yr (CGL + Tech E&O + Cyber + Marketplace endorsement, via Vouch/Embroker)" |
| §A7 attorney engagement | "$1,500–$3,000 flat fee for opinion memo" | "$10K–$15K for full Phase 0 attorney package (1099 memo + ToS + Pro Agreement + Work Order + SAFE review)" |
| §10 R6 mitigation | "Platform liability insurance (~$800/yr); 4.5★ floor; 7-day Stripe hold" | "Layered model — Layer 1 pro CGL + Layer 2 Sherpa Pros CGL/E&O/Cyber + Layer 3 work guarantee ($5K/job, $25K/customer/year cap) + Layer 4 dispute workflow with 24hr triage SLA" |
| §B (beta cohort) | Insurance certificate uploaded as agreement requirement | Add: COI must name Sherpa Pros LLC as Additional Insured + auto-expiry monitoring + state license cross-check |
| §10 R5 mitigation | "Pros are independently licensed contractors w/ own insurance" | Add: "Layer 1 Layer 2 model documented in `docs/operations/liability-insurance-framework.md`; Tech E&O is the platform's primary exposure not 1099 classification per se" |
| New §13 Phase 0 next steps | (existing) | Add: "Engage Vouch + attorney by W4; verify pros' insurance + state license at every onboarding" |

**New code work added to Plan §A:**
- **Task A8 (NEW):** Insurance Certificate Tracking
  - Add `pro_insurance_certificates` table (migration 006)
  - Add nightly expiry-check background job
  - Add "Insurance" tab to pro profile
  - Add real-time COI check at job acceptance (block if expired)
  - Add Concierge admin view of expiring COIs (60/30/7 day alerts)

- **Task A9 (NEW):** Dispute Resolution Workflow
  - Add `disputes` table (jobId, customerId, type, tier, status, resolution, payoutCents, evidenceUrls, createdAt)
  - Add `/api/disputes` POST (customer files), GET (Concierge views), PUT (Concierge resolves)
  - Add in-app dispute form on job-completion screen + 30-day post-completion access
  - Add Concierge admin view at `/admin/disputes` with triage queue

- **Task A10 (NEW):** Insurance verification API integration
  - Phase 0: manual COI upload + ops team verifies
  - Phase 1: integrate with Trust Layer / Evident / Certificial for automated COI verification
  - Phase 2: integrate with state license boards (NH OPLC, MA Office of Consumer Affairs, ME OPR) for real-time license verification

---

## 11. Implementation Checklist for Phase 0 (next 4 weeks)

- [ ] **Week 1:** Engage Vouch (or 2 brokers) for Phase 0 insurance quote — CGL + Tech E&O + Cyber + Marketplace endorsement. Target bind by W3.
- [ ] **Week 1–2:** Engage attorney (per plan §A7) for FULL package — not just 1099 memo. Scope: 1099 memo + ToS + Pro Service Agreement + Work Order template + Wefunder SAFE review. Budget: $10K–$15K.
- [ ] **Week 2:** Build `pro_insurance_certificates` table + COI upload UI + Sherpa Pros LLC Additional Insured language template (give to pros to share with their broker).
- [ ] **Week 2–3:** Build `disputes` table + Concierge admin view + customer in-app dispute form.
- [ ] **Week 3:** Update `docs/legal/founding-pro-agreement.md` with Layer 1 insurance requirements (COI naming Sherpa Pros LLC as AI, expiry monitoring consent, license re-verification consent).
- [ ] **Week 4:** Publish customer-facing "Sherpa Pros Work Guarantee" page (`/guarantee`) explaining caps + exclusions. Cross-reference from homeowner landing page + ToS.
- [ ] **Week 4:** Train Concierge (Phyrom + 1 Upwork US contractor) on the Track A + Track B dispute workflow.
- [ ] **Week 4–6:** Pilot with first 5 beta pros — actually verify their COIs, run a mock dispute end-to-end before any real customer dispute happens.

---

## 12. Open Questions for Phyrom + Attorney + Broker

1. **Work guarantee cap:** $5K/job + $25K/customer/year — too low? Too high? Compare against industry (Thumbtack $100K, TaskRabbit $10K).
2. **Reserve fund:** how much should Sherpa Pros hold in reserve to fund Layer 3 guarantees before Tech E&O kicks in? Suggest 2% of trailing-90-day GMV.
3. **Cross-state coverage:** Sherpa Pros LLC operates in NH/ME/MA initially. Do we need separate state-level licensing as a "home improvement contractor referral service"? **MA in particular** — the MA Office of Consumer Affairs regulates contractor referral platforms differently than non-MA.
4. **PM tier liability:** when Sherpa Pros sends a pro to a property manager's unit, who's the customer of record for liability? PM, owner, or tenant? This affects guarantee mechanics.
5. **Specialty lane risk concentration:** Boston specialty lanes (heat pump, EV, panel) have higher per-job stakes ($10K–$50K jobs) and more code complexity. Should the work guarantee cap be different for specialty lanes?
6. **Mass Save / National Grid partnership:** if we're a referenced installer-finder, do those programs require us to carry specific limits? (Likely yes — confirm with their legal teams during partnership outreach.)
7. **Mandatory arbitration enforceability:** ME and MA courts have been increasingly skeptical of mandatory arbitration in consumer contracts. Confirm enforceability with attorney.
8. **Class-action waiver:** same enforceability question. Especially with the AB5-style worker classification environment — pros may try to bring class actions for misclassification.

---

## 13. References

**Insurance / coverage:**
- [Uber Driver Insurance (current coverage tables)](https://www.uber.com/us/en/drive/insurance/)
- [Uber 2026 Insurance Coverage Guide — Gridwise](https://gridwise.io/blog/uber-driver-insurance)
- [DoorDash 2026 Insurance Guide — RideshareGuy](https://therideshareguy.com/doordash-insurance/)
- [DoorDash Auto Insurance (official)](https://help.doordash.com/dashers/s/article/Understanding-Auto-Insurance-Maintained-by-DoorDash)
- [Marketplace platform comparison — TaskRabbit/Thumbtack/Angi](https://checkthat.ai/brands/taskrabbit/alternatives)
- [Marketplace insurance guidance — Thimble](https://help.thimble.com/hc/en-us/articles/4401805596307-CGL-I-am-doing-a-job-for-a-marketplace-like-Handy-Thumbtack-Amazon-Home-Services-HomeAdvisor-TaskRabbit-or-Yelp-what-do-I-do-)
- [2026 Construction Insurance Market Outlook — Grit Insurance](https://gritinsurance.com/blog/2026-construction-insurance-market-outlook)
- [Professional Liability Insurance Pricing 2026](https://www.professionalliabilityinsurancecost.com/)
- [Contractor Liability Insurance Complete Guide 2026](https://contractorsliability.com/blog/what-does-contractors-liability-insurance-actually-cover-2026-complete-guide/)

**Brokers / carriers:**
- [Vouch Insurance — tech/marketplace startup specialist](https://www.vouch.us)
- [Embroker — tech-focused broker](https://www.embroker.com)
- [Newfront — tech broker hybrid](https://www.newfront.com)

**Compliance / verification services (Phase 1+):**
- [Evident — automated COI verification](https://www.evidentid.com)
- [Certificial — COI tracking for marketplaces](https://www.certificial.com)
- [Trust Layer — insurance verification API](https://www.trustlayer.io)

---

## 14. Last Updated
**2026-04-24** — Draft v1 by Claude. Needs attorney + broker review before publishing customer-facing parts. Phyrom should add this as a parallel workstream (call it Workstream J) to the Phase 0 handoff doc and assign to T1 (Engineering for code) + himself (broker + attorney engagement).
