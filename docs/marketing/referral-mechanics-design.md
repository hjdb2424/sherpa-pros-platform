# Sherpa Pros — Two-Sided Referral Mechanics Design

**Date:** 2026-04-22
**Author:** marketing-growth-hacker (for Phyrom)
**Status:** Design — pending engineering review + attorney review on Section 4
**Companion spec:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` (§4 phased GTM, §5 finance model)
**Implementation target:** Phase 1 (Months 3–6) layered on top of Founding Pro program

---

## 1. Summary Table — The Four Loops

| # | Loop | Virality (k-factor potential) | LTV uplift per successful referral | Build complexity | Fraud risk | Phase to launch |
|---|---|---|---|---|---|---|
| 1 | Pro → Pro | High (0.6–1.2) — contractors talk constantly | Medium ($1.5–4K GMV/yr per pro × 5% take = $75–200/yr commission, plus $49/mo subscription = $588 ARR) | Medium | High (incentive to fake-account) | **Phase 1 — first** |
| 2 | Client → Client | Low (0.1–0.25) — homeowners refer rarely | Low–Medium ($800–3K avg job × 10% take = $80–300 one-shot, plus repeat factor 1.4×) | Low | Low | Phase 1 — second |
| 3 | Pro → Client | Medium (0.3–0.5) — pro converts existing book | High (pro's existing client trusts them, near-zero CAC, high job-completion rate ~90%+) | Low | Low (pro's reputation is collateral) | **Phase 1 — first (tied)** |
| 4 | Client → PM | Very Low frequency (0.05–0.1) — but each conversion is huge | Very High (PM = $4/unit × 200+ units × 12 mo = $9,600 ARR floor, plus dispatched job GMV) | High (different onboarding, contract, vetting) | Medium | **Phase 2** (PM tier must be live) |

**Read this as:** Loops 1 and 3 are the Phase 1 launch pair. They share the Pro Dashboard surface, share most of the schema, and reinforce each other (pro who refers another pro is more likely to also bring their existing clients). Loop 2 is the long tail that compounds slowly. Loop 4 is the asymmetric bet — low frequency but a single conversion can pay for the entire referral program for a year.

---

## 2. Kill Criteria — When To Turn A Loop Off

Each loop has explicit shutoff thresholds. These get monitored weekly by data-analytics-reporter and reviewed by Phyrom. A loop hitting any of these conditions is paused within 7 days, investigated, then either patched or killed.

| Loop | Kill condition | Threshold | Reason |
|---|---|---|---|
| Pro → Pro | Fake-account rate | >8% of redemptions flagged as fraud over a 30-day rolling window | MLM dynamics emerging; supply-house arbitrage |
| Pro → Pro | Cohort retention | <40% of referred pros complete a 2nd job within 90 days | We're paying to acquire dead supply |
| Client → Client | Cost per acquisition | Implied CAC > $80 with redemption rate <5% | Cheaper to buy the same client on Meta |
| Pro → Client | Self-deal rate | >15% of referred clients are flagged as same-household / same-business as the referring pro | Pro is just running their existing book through the platform with no real referral |
| Client → PM | Conversion ratio | <1 PM signed per 50 referrals submitted after 6 months | Channel doesn't work; redirect to direct BD |
| ANY loop | Reward redemption cost | Total credits issued > 3% of monthly GMV | Unit economics broken; review reward structure |
| ANY loop | Disputes attributed to referral | >5% of disputes involve a referred pair | Suggests collusion or low-quality matching |

A killed loop is documented (root cause + lessons), not silently retired.

---

## 3. Brand Voice Guardrails (Apply To All Copy)

Plainspoken, 8th-grade reading level. Sounds like a contractor wrote it.

**Always say:** Jobs (not leads), Founding Pro, Half-price forever, Verified, Local, Built by a contractor

**Never say:** Wiseman (internal only), Gig, Task, Refer-and-earn, Earn unlimited rewards, Disrupt, Revolutionize, "MLM," "passive income"

**Default verbs:** *bring, send, hand off, vouch for, introduce* — never *refer-and-earn, monetize your network*

---

## 4. Regulatory Compliance — Reg CF Window (REQUIRES ATTORNEY REVIEW)

> **ATTORNEY-REVIEW-RECOMMENDED FLAG** — this section is the growth team's read of SEC rules and Wefunder's terms. Phyrom must have securities counsel sign off before launching any referral mechanic during the active Reg CF raise.

### 4.1 The concern

While a Sherpa Pros Wefunder Reg CF round is open (per GTM spec §6.4, W7–W12 of Phase 0), the SEC restricts (a) general solicitation framing that ties platform participation to investment, and (b) any "transfer of value" to investors that could be construed as compensating them for promoting the offering. The risk surface for our referral program is:

1. A user who is *also* a Wefunder investor refers another user. The credit they receive could be argued as compensation tied to their investor status.
2. Referral copy that uses words like "earn" or "bonus" near any Wefunder mention can be argued as commissioned promotion.
3. Cash-equivalent rewards (Visa cards, Venmo, direct wire) carry far more risk than platform-internal rewards.

### 4.2 Design response

The program is built so the same rules apply to investors and non-investors identically. Specifically:

- **No cash, no cash equivalents.** Rewards are platform credits, fee waivers, badge upgrades, priority dispatch — all consumable only inside Sherpa Pros.
- **No tie to investor status.** The `referrals` table does not read `wefunder_investor` status. The reward function is a pure function of (loop_type, completed_first_job, anti-fraud_passed). This is auditable.
- **Reg CF window pause switch.** A feature flag `REFERRAL_PROGRAM_REG_CF_PAUSE` exists in the admin panel. If counsel advises, all new referral attribution stops within 1 hour. Already-earned credits remain valid.
- **No referral copy in Wefunder pitch materials.** The Wefunder page does not mention referral rewards. The in-app referral surface does not mention Wefunder.
- **Disclosure language.** When the Reg CF window is open, the in-app referral surface carries a footer line: *"Sherpa Pros is currently raising investment via Wefunder. Referral rewards are platform credits and are unrelated to any investment offering. Learn more."* Counsel reviews this exact wording.

### 4.3 Open questions for counsel

1. Does a "$50 platform credit" for referring a pro qualify as "transfer of value" under Rule 506 / Reg CF if the referrer is also a Wefunder investor in Sherpa Pros?
2. Is the disclosure footer in §4.2 sufficient, or do we need an active separator (e.g., investors cannot redeem credits during the Reg CF window)?
3. Can Founding Pros who hold both a 5%-take grandfathering and a Wefunder investment freely participate in pro-to-pro referrals during the open window?
4. Does the Pro → Client loop (where a pro converts an *existing* client they already have a business relationship with) trigger any additional disclosures because the pro now has dual relationships (vendor + referrer)?

**Recommended action:** 30-minute call with the same securities counsel doing the SAFE legal work for Wefunder (estimated ~$5K legal per GTM spec §6.4). Get a memo before launch. Cost is in the noise relative to the risk of an SEC inquiry derailing the raise.

---

## 5. The Four Loops — Detailed Design

### LOOP 1 — Pro → Pro (Founding Pro refers another contractor)

**Why it matters:** Contractors talk constantly. Supply-house counters, jobsite lunches, NHHBA meetings, Facebook trade groups. A Founding Pro saying "this platform actually pays me, switch" carries 10× the weight of any ad.

#### 5.1 Trigger event

Attribution fires when the referred pro **completes their first paid job and Stripe Connect releases funds to them.** Not at signup. Not at onboarding. Not at first bid. Completed first job = real supply.

#### 5.2 Reward structure

**Referrer (the Founding Pro):**
- 1 month subscription waived ($49 value) — applied next billing cycle
- "Bring a Pro" tally on profile (public counter, social proof, badge at 5 / 10 / 25 brought)
- At 3 successfully referred pros: keeps 5% take rate forever (locked even if they would have rolled to 10%); for Founding Pros who already have 5%, this becomes 4.5% on the 4th and beyond — capped at 4% floor
- At 10 successfully referred pros: invitation to the Founding Pro Council (quarterly product feedback call with Phyrom — this is a relationship asset, not a discount)

**Referee (the new pro):**
- Onboarding fast-track (background check expedited, license verification within 48hr)
- "Founding Cohort 2" badge if joined within Phase 1 (transparent — they are not Founding Pros, but they are early)
- First 3 jobs at 5% take (matches Founding Pro for limited window)
- $0 subscription for first 60 days

**Math check (no dollar figures invented out of thin air):**
- Cost to platform per successful referral: 1 mo subscription waived to referrer ($49) + 60 days subscription waiver to referee ($98) + 5% commission give-back on referee's first 3 jobs (avg job $1,200, so 5% × $3,600 = $180) = **$327 total platform cost per successful referral**
- Average pro at steady state generates ~$2K/yr in subscription + take-rate revenue (10% × ~$1,500/mo GMV × 12 = $1,800 take + $588 sub = ~$2,388/yr per pro)
- **Payback period:** $327 / ($2,388 / 12) = **1.6 months.** Below the 6-month CAC-payback threshold from the agent success metrics. Approved.
- Compare to estimated paid-acquisition CAC for a licensed pro on Meta/LinkedIn: $400–$900 based on Phase 1 channel test budget. Referral wins on cost AND quality.

#### 5.3 Anti-fraud controls

- **One referrer per signup.** Hard FK constraint. First valid attribution wins; later claims rejected with logged collision.
- **Stripe identity collision check.** If the new pro's Stripe Connect account shares legal name OR EIN OR bank account OR SSN-last-4 with the referrer's Stripe account → flagged for manual review, reward held.
- **IP / device fingerprint dedup.** If signup device fingerprint matches the referrer's last-30-days fingerprint → flagged. Uses existing FingerprintJS or simple hash of (user-agent + screen + timezone + IP /24).
- **License-board cross-check.** Run new pro's license number against the referrer's license number in the same state; if either is on the other's "responsible party" list → reject.
- **Velocity throttle.** A single referrer can attribute at most 3 successful referrals per 30 days during Phase 1, 5 per 30 days during Phase 2. Hard cap. Caps reset; they don't compound.
- **Geographic plausibility.** New pro within 25 miles of referrer → normal. New pro >500 miles from referrer with no plausible relationship → flag for review.
- **Manual review queue** for any flagged attribution; Phyrom or Pro Success Manager clears within 5 business days.

#### 5.4 Attribution method

**Both code AND link, but code is canonical.**

- Each Founding Pro gets a 6-character alphanumeric code: `JOSE-NH`, `MIKE-12`, `ANNA-PT` (custom-letterable in admin if a pro wants something memorable; uniqueness enforced).
- Shareable deep link wraps the code: `https://sherpa.pros/p/JOSE-NH` → opens app or web with code pre-applied.
- Mobile attribution uses Branch.io-style deferred deep linking (or a self-rolled equivalent against the existing PWA). On iOS / Android web → app handoff, the code persists via signed cookie + fallback paste.
- 30-day attribution window from first click to signup. After 30 days, code expires for that visitor; they can re-enter manually if they remember.
- At signup, the code field is pre-filled if a link was used. User can also paste/type. User can clear it (with friction — confirmation modal: *"You're signing up without a referral. Sure?"*).

#### 5.5 Copy variants (3 each for A/B testing)

**In-app banner (Pro Dashboard, top, dismissible):**
1. *"Know another good pro? Bring them on. Both of you save."*
2. *"Half-price forever — and the pros you bring keep that price too. Your code: JOSE-NH"*
3. *"Tired of seeing good pros stuck on Angi? Send them your code: JOSE-NH"*

**Email subject lines (sent to existing Founding Pros at Phase 1 launch):**
1. *"Bring a pro you trust — both of you save"*
2. *"Your code is ready. Half-price for them, free month for you."*
3. *"The pros you'd hire yourself — bring them on Sherpa"*

**Share-button text (when pro taps "Share my code" in app):**
1. *"I'm on Sherpa Pros — jobs, not leads. Use JOSE-NH and we both save: [link]"*
2. *"Switched to Sherpa Pros. 5% take, no pay-to-bid. Code JOSE-NH if you sign up: [link]"*
3. *"Sherpa Pros is the marketplace built by a working GC. Use JOSE-NH: [link]"*

#### 5.6 Success metrics

- **k-factor for this loop:** target 0.4 by month 3 of Phase 1, 0.7 by month 6
- **Referral-to-active conversion** (signup → completed first job): target 35%+
- **Time to first referred action** (signup → first bid placed): target <14 days, alert at >30
- **Referral share of total new pro signups:** target 30% by end of Phase 1, 50%+ by end of Phase 2
- **Cost per acquired pro via referral vs. paid:** ratio target ≤ 0.5 (i.e., referrals at most half the cost of paid)

#### 5.7 Implementation sketch

**DB schema additions (Drizzle):**

```
referral_codes
  id, user_id (FK users), code (unique), created_at, active (bool),
  custom (bool — true if pro chose the suffix)

referrals
  id, code (FK referral_codes.code), referrer_user_id (FK users),
  referee_user_id (FK users, nullable until signup),
  loop_type (enum: pro_to_pro, client_to_client, pro_to_client, client_to_pm),
  status (enum: clicked, signed_up, first_action, completed, fraud_flagged, rewarded, killed),
  click_at, signup_at, first_action_at, completed_at, rewarded_at,
  ip_hash, device_fingerprint, attribution_metadata (jsonb),
  fraud_flags (jsonb — array of flag types triggered)

referral_rewards
  id, referral_id (FK referrals), recipient_user_id (FK users),
  reward_type (enum: subscription_waiver_months, take_rate_reduction_pct,
               platform_credit_cents, badge_upgrade, priority_dispatch_days,
               fast_track_onboarding),
  reward_value (numeric — interpretation depends on reward_type),
  granted_at, consumed_at, expires_at, status (enum: pending, active, consumed, expired, revoked)

referral_fraud_events
  id, referral_id, event_type, evidence (jsonb), reviewed_by (nullable FK users),
  decision (enum: clear, fraud, inconclusive), decided_at, notes
```

**API endpoints needed:**
- `POST /api/referrals/code` — generate or fetch the user's code
- `PATCH /api/referrals/code` — request custom suffix (admin-approved during Phase 1)
- `POST /api/referrals/attribute` — register a click (sets ip_hash, device_fingerprint)
- `POST /api/referrals/redeem` — at signup, attach code to new user (validates window, fraud flags)
- `POST /api/referrals/trigger-completion` — internal, called from Stripe webhook on first paid release; advances status to `completed` and queues reward grant
- `GET /api/referrals/me` — referrer dashboard data (count, status pipeline, rewards earned)
- `GET /api/admin/referrals/fraud-queue` — manual review surface

**UI surfaces touched:**
- `(dashboard)/pro/profile` — "Your Code" card with copy-and-share
- `(dashboard)/pro/referrals` — new route — pipeline view (clicked / signed up / completed / rewarded)
- `(marketing)` landing page — referral link recognition + pre-fill on `/sign-up`
- Email template — "First successful referral" celebration email
- Admin — fraud review queue at `/admin/referrals`

**Integration with Stripe Connect Express:** zero changes to the existing payout flow. The referral reward is applied at the *commission-engine* level (`src/lib/payments/`) — when a referee's first job pays out, the engine writes a 0% commission line for that pro's first 3 jobs instead of 5/10%. Stripe Connect itself doesn't know the referral exists. Subscription waivers apply at the Stripe subscription product level (existing $49/mo SKU gets a coupon attached for N months).

#### 5.8 Phase 1 vs Phase 2 rollout

- **Phase 1 launch:** Full mechanics, capped at 50 active codes (only Founding Pros for the first 6 weeks, then opens to all pros at 60+ days tenure). Velocity throttle at 3/30-days.
- **Phase 2 expansion:** Open to all pros from month 1 of tenure. Velocity bumps to 5/30-days. "Bring 25" badge unlocks. Founding Pro Council meets quarterly.

---

### LOOP 2 — Client → Client (homeowner refers neighbor)

**Why it matters:** Lower frequency than pro-to-pro, but the trust transfer is huge. A neighbor saying "I used Sherpa for my deck rebuild, the pro showed up on time, here's their code" beats every form of paid acquisition.

#### 5.9 Trigger event

Attribution fires when the **referred client posts their first job AND it gets matched (not just signs up).** Posting = real demand intent. Matching = the platform delivered.

Reward unlocks when the referred client's **first job completes and is rated** (5-day rating window after job close).

#### 5.10 Reward structure

**Referrer (existing client):**
- $25 platform credit applied to next job (auto-applied at checkout, max 1 credit per job, stackable up to 4 = $100)
- "Trusted Neighbor" badge on profile (visible to pros — small trust signal in the marketplace)

**Referee (new client):**
- $25 off first job (applied at job posting, requires the job to actually go to a pro and complete; refunded if job is canceled before pro acceptance)
- Skip-the-line dispatch on first job (priority queue for matching)

**Math check:**
- Total platform cost per successful referral: $25 referrer credit + $25 referee credit = **$50 total**
- Average completed job at Phase 1 maturity: estimated $1,200 GMV × 10% take = $120 commission
- **Payback per single referred job: ~2.4× covered** ($120 commission / $50 cost). And the referred client's lifetime value is 1.4× the referral cost in repeat jobs.
- Far cheaper than estimated $80–$150 client CAC on paid Google/Meta in Phase 1.

#### 5.11 Anti-fraud controls

- One referrer per signup, FK enforced.
- New client's billing address geocoded; if literal same address as referrer → flag (could be legit — roommates — but review).
- Phone-number dedup (Twilio Lookup verifies).
- Job posted by referred client must reach **bid acceptance + completion**, not just be posted. Prevents "post-and-cancel" arbitrage.
- Velocity cap: 5 referrals per client per 90 days. Above that triggers manual review.
- IP hash + device fingerprint dedup (same as Loop 1).

#### 5.12 Attribution method

Same shared infrastructure as Loop 1 — clients also get a 6-char code, shareable link, 30-day click window. Code prefix differentiates: pros get something like `JOSE-NH`, clients get `H-RACHEL` (the H prefix flags client-origin in the referral table for analytics, and prevents pros and clients from being able to claim the wrong reward type via code-collision).

#### 5.13 Copy variants

**In-app banner (Client Dashboard, after first job completes):**
1. *"Know a neighbor with a project? Send them $25 off — and get $25 too."*
2. *"Job done. If a friend needs a pro, your code is H-RACHEL."*
3. *"Refer a neighbor, both get $25 off. Code: H-RACHEL"*

**Email (sent 7 days after first job completes, if rating ≥4):**
1. Subject: *"Your $25 credit — share it with a neighbor"*
2. Subject: *"Know someone who needs a good electrician?"*
3. Subject: *"$25 for you, $25 for a friend — your Sherpa code is ready"*

**Share-button text:**
1. *"Used Sherpa Pros for [job type] — recommend it. Use H-RACHEL and we both save $25: [link]"*
2. *"My pro showed up on time and did good work. Sherpa Pros: [link] — code H-RACHEL"*
3. *"Verified pros, no Angi nonsense. H-RACHEL gets you $25 off: [link]"*

#### 5.14 Success metrics

- **k-factor:** target 0.15 by Phase 1 end, 0.25 by Phase 2 end
- **Referral-to-active conversion** (signup → posts a job): target 40%
- **Repeat factor on referred clients:** target 1.4× (referred clients post more repeat jobs than cold-acquired clients — early signal of trust quality)
- **Credit redemption rate:** target 60%+ of issued credits actually consumed within 12 months

#### 5.15 Implementation sketch

Reuses the entire schema and infrastructure from Loop 1. The `loop_type` column distinguishes. Reward type for clients adds `platform_credit_cents` (already in the enum). UI surface is `(dashboard)/client/refer` (new route, mirrors pro version). Stripe Connect untouched — credits apply at the job-posting checkout, reducing the client's payment intent amount; the pro is still paid the full agreed amount, with the credit offset against platform commission.

#### 5.16 Phase 1 vs Phase 2

- **Phase 1:** Launch in month 4 (after first 200+ jobs completed, so credit redemptions have a real job pipeline).
- **Phase 2:** Add referrer-tier escalation (5 successful referrals = "Trusted Neighbor Gold" badge + early access to new pros + free post-bump).

---

### LOOP 3 — Pro → Client (pro brings their existing client onto the platform)

**Why it matters:** This is the quiet killer. The pro is doing the de-risking *for the platform* by vouching to a client they already trust. The pro converts a customer relationship into a platform-mediated one. From the platform's POV: nearly free CAC, very high job-completion rate, embedded trust on day one.

#### 5.17 Trigger event

Attribution fires when the **referred client posts their first job AND that job is awarded to the referring pro.** This is the unique constraint of this loop — the pro must be the one who fulfills the job.

(Why this constraint? Without it, this loop is gameable: pros bring clients but the client gets matched to a different pro, defeating the "convert your existing book" purpose. With this constraint, the pro is incentivized to bring real clients and get real jobs.)

Reward unlocks when the **first job between this pro+client pair completes and is paid out via Stripe.**

#### 5.18 Reward structure

**Referring pro:**
- 0% commission (full pass-through) on the first job with this referred client
- Standard 5% (Founding) or 10% commission resumes on jobs 2+

**Referred client:**
- $0 platform fee on first job (vs. standard fee structure if any)
- Concierge onboarding (a Pro Success Manager personally walks them through their first job posting — this is a free white-glove signal)

**Math check:**
- Cost per successful conversion: $0–$120 (one job's worth of commission foregone, capped at first job)
- Lifetime value of a client converted via existing relationship: estimated 4–6 jobs over 24 months × $1,500 avg × 10% = $600–$900 take-rate revenue
- **Payback: covered on the 2nd job.** Effectively free CAC for the highest-LTV client segment.
- Compared to Loops 1 and 2: this is the highest ROI loop on a per-conversion basis. The reason it's not ranked #1 by k-factor is frequency — pros only have so many existing clients.

#### 5.19 Anti-fraud controls

- The biggest risk: pro routes their *current* paid book through the platform purely for the commission waiver, with no real net-new value. Mitigation:
  - Stripe + bank-account check: if the referred client's verified payment method has previously paid the pro **outside the platform** (cross-referenced via QBO sync if pro has linked it), flag — these are "existing relationships routed through platform," which we *want*, but only on the first job. The 0% only applies once. After that, full commission. So gaming this is naturally capped.
  - Phone + email dedup against the pro's account.
  - Self-deal check: the referred client cannot be the same legal entity (LLC, sole prop) as the pro. Cross-check legal names + EINs.
  - Manual sample audit: 10% random review of Pro→Client redemptions in Phase 1 (Phyrom or PSM listens to a 5-min recorded "how did you find out about Sherpa?" call with the new client).
- Velocity cap: 8 client referrals per pro per 90 days. Above triggers review (legitimately a pro could bring more, but at that volume we want to verify).

#### 5.20 Attribution method

The pro generates a **client-onboarding link** specific to a single referral (one-time-use): `https://sherpa.pros/c/JOSE-NH/[client-token]`. The token is a 12-char nonce tied to that specific intended client. This eliminates the "code spread on social" attack surface — the pro is pointing at a specific person, not running a public coupon.

The pro fills in a one-line "who are you bringing?" (name + phone) *before* the link is generated — this populates the client onboarding so when the client opens the link they see their name pre-filled, which is a trust signal AND a fraud check (if the new account name materially differs from what the pro entered, flag).

#### 5.21 Copy variants

**In-app surface (Pro Dashboard, "Bring a Client" card):**
1. *"Bring a client you already work with. Their first job: zero commission to you."*
2. *"Move your good clients onto Sherpa. First job is on the house — no commission, full payout."*
3. *"Send your existing client a Sherpa link. First job, you keep 100%."*

**Email to pro (during onboarding, day 7):**
1. Subject: *"Got an existing client? First job is commission-free."*
2. Subject: *"Bring your book. We don't take a cut on the first job."*
3. Subject: *"Move a client over. Zero fee on the first job, then half-price forever."*

**Pro-shares-with-client text (the pro pastes this into a text to their client):**
1. *"Hey — I started using Sherpa Pros, it handles invoicing and payments for me. Mind if I send the next job through it? Here's your link: [link]"*
2. *"I'm using Sherpa Pros for paperwork now — verified, secure payment, all in one place. Your link to set up: [link]"*
3. *"Switched to Sherpa Pros for jobs. Easier on both ends. Sign up here and we'll do the next one through it: [link]"*

#### 5.22 Success metrics

- **k-factor:** target 0.3 by Phase 1 end (each pro brings ~1 existing client on average in their first 90 days)
- **Conversion:** signup → first-job-completed: target 70% (high because the relationship pre-exists)
- **LTV ratio of Pro→Client referrals vs cold clients:** target ≥ 2.0×
- **% of pros who bring at least 1 client in first 90 days:** target 50%+

#### 5.23 Implementation sketch

Same `referrals` table. Adds a `referee_target_metadata` jsonb (stores the pro's intended client name + phone for verification). The "first job awarded to referring pro" trigger requires a new internal hook in the bid-acceptance flow:

```
On bid acceptance:
  IF job's client has a pending referral with referrer_user_id = winning_bid.pro_user_id
  AND referral.loop_type = 'pro_to_client'
  AND referral.status = 'signed_up'
  THEN advance to 'first_action'
  AND when payment releases → grant 0% commission reward to that specific payment row
```

Commission engine reads the active-rewards table at payment-release time — this is a clean integration point with the existing `src/lib/payments/` commission engine.

#### 5.24 Phase 1 vs Phase 2

- **Phase 1:** Launch with Loop 1 simultaneously. These two reinforce each other and share most code.
- **Phase 2:** Add tier — at 5 successful Pro→Client conversions, the pro unlocks "Verified Repeat Builder" badge (publicly visible signal of healthy book + platform trust).

---

### LOOP 4 — Client → PM (homeowner refers their building's property manager)

**Why it matters:** The asymmetric upside loop. A homeowner in a triple-decker mentions Sherpa to their PM. The PM signs up with a 200-unit portfolio. That's worth more than 200 individual client referrals. We don't need many of these — we need the right ones.

#### 5.25 Trigger event

Attribution fires when **the referred PM signs a paid PM-tier contract** (not at signup, not at first work order — actual paid contract). This protects against spammy PM referrals and aligns the reward with real revenue.

#### 5.26 Reward structure

**Referrer (homeowner):**
- $250 platform credit (largest single referral reward — justified by the LTV asymmetry; PM contracts at $4/unit floor are minimum $9,600 ARR)
- Lifetime "Trusted Connector" badge
- Optional: 12 months $0 platform fees on their own jobs (cap at 12 jobs)

**Referee (PM):**
- 50% off first 3 months of PM tier
- Free onboarding setup (vendor-list import, work-order template configuration — handled by the BD team, not self-serve)
- Direct line to Phyrom for first 90 days

**Math check:**
- Cost: $250 credit + ~3 mo @ 50% off PM tier (assume $4/unit × 200 units = $800/mo, 50% off × 3 mo = $1,200) = **$1,450 total platform investment per converted PM**
- Revenue: 200 units × $4/unit × 12 months × 80% retention = $7,680/yr ARR floor, plus dispatched-job GMV (estimated 100 work orders/yr × $400 avg × 10% take = $4,000/yr) = **~$11,680 ARR per converted PM**
- **Payback: ~1.5 months.** Stupidly favorable. The hard part is conversion frequency, not unit economics.

#### 5.27 Anti-fraud controls

- Verified business contact required: PM must be reachable at a domain email that resolves to a real property management entity (cross-referenced against state corporate filings — a manual step in Phase 1, automatable later via OpenCorporates API).
- Minimum portfolio size: 50+ units to qualify for the referral reward (otherwise we're paying $250 for a single-property landlord, which doesn't pencil).
- BD team verifies the PM-homeowner relationship (does the PM actually manage the homeowner's building?) before the contract is signed and the reward is paid.
- One-shot reward — the homeowner can't refer multiple PMs in 90 days. Hard cap of 2 PM referrals per homeowner per year.

#### 5.28 Attribution method

Different from Loops 1–3 because of the conversion path. A homeowner taps "Refer my PM" in their dashboard, fills out a form (PM name + email + phone + building address + estimated unit count), and submits. This generates an internal lead in the BD pipeline AND a unique attribution token. The PM is then contacted by BD (white-glove sale) within 48hr, and the homeowner is the credited referrer if a contract closes within 90 days.

This loop intentionally uses a high-touch sales motion. PMs don't sign up via consumer-grade signup flows; they sign contracts.

#### 5.29 Copy variants

**In-app surface (Client Dashboard, surfaces only if the client has rated 2+ jobs ≥4 stars AND posted address is in a multi-unit building):**
1. *"Live in a managed building? Your property manager could put their whole building on Sherpa. $250 credit if they sign on."*
2. *"Refer your building's manager. They get an easier vendor system. You get $250 in credits."*
3. *"Know your PM? Hand them off. Big buildings, fast pros, $250 to you when they sign."*

**Email to qualified clients (triggered at job-2 completion):**
1. Subject: *"Does your building have a property manager?"*
2. Subject: *"Hand off your PM — $250 credit if they sign"*
3. Subject: *"Your building manager spends hours on vendors. Let us help."*

**Share-button text (text the homeowner sends to their PM):**
1. *"My PM should look at this — work orders + verified pros + unit-level finance in one platform: [link]. Tell them I sent you."*
2. *"You're always chasing vendors. Sherpa Pros has a property-manager tier that handles all of it. [link]"*
3. *"Sherpa Pros built a PM-specific tool. I think it'd save you serious time. Here: [link]"*

#### 5.30 Success metrics

- **Conversion frequency:** 1 signed PM contract per ~50 referrals (target). At Phase 2 maturity with 5,000 homeowners, even a 2% submission rate = 100 PM referrals = ~2 PM contracts. Each PM contract = ~$11K ARR.
- **PM contract LTV / referral cost ratio:** target ≥ 8.0×
- **Referral-to-paid-contract time:** target <90 days

#### 5.31 Implementation sketch

**DB additions:**

```
pm_referral_leads
  id, referral_id (FK referrals), pm_name, pm_email, pm_phone,
  building_address, estimated_units, building_type (multifamily/commercial/mixed),
  bd_owner (FK users), bd_status (enum: new, contacted, demo_booked, negotiating,
            signed, lost, no_show), bd_notes, contract_value_cents (nullable),
  contract_signed_at
```

**API endpoints:**
- `POST /api/referrals/pm-lead` — submit a PM referral (validates client tenure, building type, etc.)
- `GET /api/admin/pm-leads` — BD queue
- `PATCH /api/admin/pm-leads/:id` — BD updates lead status

**UI surfaces:**
- Client dashboard — "Refer your PM" card (gated by qualification rules)
- BD admin — PM lead pipeline (Kanban: New → Contacted → Demo → Negotiating → Signed/Lost)
- Email to homeowner when PM contract signs — "Your PM signed. Your $250 credit is live."

**Phase 1 vs Phase 2:**

- **Phase 1:** **DO NOT LAUNCH.** Phase 1 PM strategy is direct BD with 1 anchor customer (per GTM spec §4.3). Adding a referral loop before there's product-market fit on the PM tier creates noise without signal.
- **Phase 2:** Launch in month 7 — once the PM tier has 1+ paying anchor and the BD pipeline is real. Soft-launch to top 100 most-engaged clients first, then to all clients meeting qualification rules in month 9.
- **Phase 3:** Add tiered escalation (referring 2 PMs = "Connector" perk; referring 5 = lifetime free service tier).

---

## 5.5 Sherpa Rewards integration with referral loops

**Date added:** 2026-04-22 (Sherpa Rewards launch sweep — commits `08b1a5f`, `a4b455a`)

Sherpa Rewards (live at `/pro/rewards`) is the points-redemption store for pros. The earning rules already include a **500 pts per successful referral** line item — this section documents how that integrates with the loop mechanics in §5.

### What stacks (Loop 1 — Pro → Pro)

A successful Pro→Pro referral earns the referrer **all of the following**, in addition to the Loop 1 reward structure in §5.2:

- **500 Sherpa Rewards points** (≈$25 of redemption value at typical catalog price points — Visa gift card, Milwaukee accessories, Sherpa branded apparel)
- The 1-month subscription waiver ($49 value) per §5.2
- The "Bring a Pro" tally + badge progression per §5.2
- The take-rate reduction tier-up at 3 successful referrals per §5.2

This stacks intentionally. The Sherpa Rewards 500 pts is not a substitute for the existing Loop 1 incentive — it's an **additional immediate-gratification layer** that converts the abstract "fee waiver next billing cycle" into a tangible "I'm 1,500 points away from a free Festool drill" loop. Loyalty + retention research consistently shows that points-based loyalty programs lift referral conversion by 15–30% even when the absolute dollar value of the points is small, because the catalog browsing itself creates desire.

### Math check (updates §5.2 cost basis)

- Original Loop 1 cost per successful referral: **$327** (sub waiver + referee waiver + first-3-jobs commission give-back)
- + Sherpa Rewards points cost (500 pts at platform redemption cost ≈ $25): **+$25**
- **New total platform cost per successful Pro→Pro referral: $352**
- Original payback: 1.6 months. New payback: **1.7 months** (still well below the 6-month CAC-payback threshold)
- The +$25 is marginal. The conversion lift is the leverage.

### What does NOT stack (Loops 2, 3, 4)

The 500-pt referral bonus applies **only to the Pro→Pro loop** in Phase 1. Rationale:

- **Loop 2 (Client→Client):** Clients don't have Sherpa Rewards accounts (Rewards is a pro-side surface). Their reward stays the $25 platform credit per §5.10.
- **Loop 3 (Pro→Client):** The reward to the pro is a 0% commission on the first job — already richer than 500 pts. Adding pts here would create a "double-dip" optic that anti-fraud surfaces would have to mediate. Hold for Phase 2 review.
- **Loop 4 (Client→PM):** Client referrer; same as Loop 2 — $250 platform credit, no Rewards points (clients don't have a Rewards account).

### Implementation note

The Sherpa Rewards points grant fires on the same trigger as the Loop 1 sub-waiver — referee's first paid job clears Stripe and `referrals.status` advances to `completed`. The commission engine writes a single `referral_rewards` row per reward type, and the Sherpa Rewards point ledger is an additional `pro_rewards_ledger` insert (separate table, separate audit trail).

### Anti-fraud overlap

The 500 pts inherits the same anti-fraud surface as the Loop 1 reward — no separate fraud queue. If a referral gets flagged and held under §5.3, the Sherpa Rewards points are held in fraud review alongside the sub-waiver until manual review clears.

### Copy update — Loop 1 in-app banner variants (§5.5)

Replace the Loop 1 in-app banner copy with these updated variants that surface the Rewards stack:

1. *"Bring another good pro. Both of you save — and you earn 500 Sherpa Rewards points per successful referral."*
2. *"Half-price forever for the pros you bring on, plus 500 Sherpa Rewards points for you. That's a Festool drill in 24 referrals — or a Visa gift card in 1. Your code: JOSE-NH"*
3. *"Tired of seeing good pros stuck on Angi? Send them your code: JOSE-NH. You both save. You also earn Sherpa Rewards points."*

---

## 5.6 Multi-Trade Project Referral Bonus

**Date added:** 2026-04-25 (Wave 9 — Sherpa Dispatch + Sherpa Materials launch sweep)

Sherpa Dispatch made multi-trade projects (kitchens, baths, additions) a first-class platform primitive. The supply-side referral loop has to follow — pros who bring in another trade for a multi-trade job should be rewarded for completing the orchestration loop.

### What it is

When a pro on the platform brings in another trade for a multi-trade Sherpa Dispatch job — for example, a trim carpenter brings in a finisher for a kitchen renovation, or a plumber brings in an electrician for a heat-pump panel-upgrade combo — **both pros earn a Sherpa Rewards bonus** when the job completes.

- **Reward magnitude:** 200 Sherpa Rewards points per cross-trade referral (≈$20 of redemption value)
- **Trigger:** the referred pro completes a job on a Sherpa Dispatch multi-trade work order, AND the work order's `project_status` advances to `completed`
- **Both sides earn:** the referring pro earns 200 pts, the referred pro earns 200 pts. Symmetric reward, asymmetric origin.

### Why both sides earn

Cross-trade referrals are the platform's organic supply-side densifier. The referring pro is donating their relationship capital; the referred pro is putting their reputation behind the project sequencing. Symmetric rewards make the loop self-sustaining without creating a "spammer pro" failure mode.

### What stacks (and what does not)

- **Stacks with Loop 1.** A cross-trade referral that also brings a NEW pro to the platform (one who didn't have an account before) earns BOTH the 500-pt Loop 1 onboarding bonus AND the 200-pt Multi-Trade bonus when the multi-trade job completes. Total: 700 pts for the referring pro, plus standard Loop 1 fee waivers.
- **Stacks with Sherpa Score.** Cross-trade referrals that complete cleanly count toward the referring pro's "Communication" pillar (the cross-trade hand-off is a communication signal). Climbing Sherpa Score is the long-game compound.
- **Does not stack with itself.** Multi-Trade bonus fires once per (referring_pro, referred_pro, work_order) tuple. A pro can refer the same finisher to 50 different multi-trade jobs and earn 200 pts each time, but cannot earn multiple 200-pt bonuses on the same work order for the same referral.

### Anti-fraud surface

Multi-Trade referrals share the Loop 1 fraud queue — same `referral_fraud_events` table, same review surface, same kill-criteria. Specific signals to monitor:

- Two pros co-referring each other in a tight loop (mutual-reward farming)
- A single pro being referred into >5 multi-trade jobs by the same referring pro within 30 days (relationship laundering)
- Cross-trade referrals that complete the work order in <24 hours from creation (the orchestration is fake)

### Implementation note

The cross-trade referral grant fires on the same trigger as the Loop 1 sub-waiver — work order's `project_status` advances to `completed`. Because Sherpa Dispatch already tags every work order with the `is_multi_trade` boolean and the `participant_pros[]` array, the trigger reads existing fields. New fields needed: `referrals.multi_trade_origin_pro_id` (FK to the referring pro) and `referrals.multi_trade_work_order_id` (FK to the work order).

### Math check

- Cost per successful cross-trade referral: 200 pts × 2 sides = 400 pts × $0.05/pt platform redemption cost = **$20 platform cost per referral**
- Expected lift: cross-trade referrals close 35-50% faster than cold-pro acquisition (the trust transfer is real); platform GMV per multi-trade job averages 2.4× a single-trade job (per Sherpa Dispatch v1 telemetry); payback under 1 month at any reasonable conversion rate
- Recommended Phase 1 launch month: Month 4 (one month after Loop 1 has been running and the analytics pipeline can isolate the cross-trade signal)

---

## 5.7 /flex Acquisition Loop

**Date added:** 2026-04-25 (Wave 9 — /flex landing page launch sweep)

The /flex landing page (`thesherpapros.com/flex`) is the public acquisition funnel for the side-bandwidth tradesperson cohort — day-job framers, electricians, and plumbers with weekend bandwidth who aren't ready to form an LLC. This loop is how full-time pros bring side-bandwidth peers onto the platform.

### What it is

When a full-time pro on the platform refers a side-bandwidth peer to /flex, **the referring pro earns a Sherpa Rewards bonus when the peer completes their first 3 jobs on Sherpa Flex.**

- **Reward magnitude:** 500 Sherpa Rewards points per /flex referral (≈$50 of redemption value)
- **Trigger:** the referred peer signs up via /flex with the referring pro's code, completes the background-check gate, and clears 3 jobs on the platform with `referrals.status = completed`
- **One side earns:** the referring pro earns 500 pts. The referred /flex pro earns nothing additional from this loop (they earn their normal job revenue + their normal Sherpa Rewards points-per-job, which is the standard onboarding incentive).

### Why only one side earns

/flex is itself the on-ramp incentive — $1M per-project liability insurance included in the 18% take rate is a strong intrinsic offer. Adding a referee bonus on top would risk gaming the loop (people referring themselves under different identities). The asymmetric reward keeps the loop honest.

### What stacks

- **Stacks with Multi-Trade (§5.6).** A /flex pro who later participates in a multi-trade Sherpa Dispatch work order earns both bonuses for the originating referrer.
- **Stacks with Sherpa Score.** The 3 completed jobs on /flex count toward the referred pro's own Sherpa Score — which is how they eventually upgrade out of /flex into Standard 12% (form an LLC) and then climb to Gold 8%.
- **Does not stack with Loop 1.** /flex referrals are exclusive to this loop. A pro who refers a /flex peer cannot also claim the Loop 1 onboarding 500-pt bonus on the same referral — the same dollar of platform spend cannot fund two bonuses.

### Anti-fraud surface

/flex referrals inherit the Loop 1 fraud queue. Specific signals to monitor:

- Repeated referrals from the same full-time pro to /flex peers who all share a single residence address or phone-number prefix (household-laundering)
- /flex referees whose 3-job completion velocity is implausibly fast (<14 days from sign-up to 3rd completed job) — manual review required
- /flex referees whose first 3 jobs are all under $200 (gaming the threshold) — auto-flag for review

### Implementation note

The /flex referral grant fires on a different trigger than other loops — the third completed job. New fields: `referrals.is_flex_referral` boolean, `referrals.flex_referee_completed_jobs` integer counter that increments per completed job and locks the bonus when it hits 3. The existing `pro_rewards_ledger` insert pattern handles the 500-pt grant.

### Math check

- Cost per successful /flex referral: 500 pts × $0.05/pt platform redemption cost = **$25 platform cost per referral**
- Expected per-/flex-pro lifetime GMV (Phase 1 estimate): 18 jobs/year × $1,800 avg = $32,400/year × 18% take = $5,832/year platform revenue
- Payback on the $25 incentive: under 1 month at any conversion rate above 1%
- The leverage isn't the math — it's the supply-side densification. /flex pros form a feeder pool for Standard 12% (the LLC upgrade path), which is the platform's long-game retention loop.
- Recommended Phase 1 launch month: Month 3 (same month /flex landing goes public — the loop is dependent on /flex traffic to seed referees)

### Copy — /flex referral in-app banner variants

For pros who have completed 5+ jobs (eligible to refer), surface this banner on the dashboard:

1. *"Know a tradesperson with weekend bandwidth? Send them your /flex code: JOSE-NH. They earn on the side, you earn 500 Sherpa Rewards points when they finish 3 jobs."*
2. *"The framer on your crew has a side hustle but no LLC. /flex is the door — and you earn 500 Sherpa Rewards points (≈$50) when they complete their first 3 jobs."*
3. *"Bring a side-bandwidth peer to thesherpapros.com/flex. Your code: JOSE-NH. 500 Sherpa Rewards points after their 3rd job clears."*

---

## 6. Cross-Loop Implementation Notes

### 6.1 Shared infrastructure

All four loops share:
- The `referrals`, `referral_codes`, `referral_rewards`, `referral_fraud_events` tables
- Attribution attribution endpoints
- Fraud queue + admin review surface
- Analytics dashboard (k-factor by loop, payback period, fraud rate)
- The kill-criteria monitoring job (runs daily, alerts in Slack if any threshold breached)

### 6.2 Stripe Connect Express integration

**The existing payout flow does not change.** Referral rewards integrate at three precise points:
1. **Subscription waivers:** Apply Stripe coupons to the existing $49/mo Sherpa Pros subscription product. Coupon SKUs: `REF-WAIVE-1MO`, `REF-WAIVE-2MO`, `REF-WAIVE-12MO`.
2. **Commission-rate adjustments:** Read from `referral_rewards` at payment-release time inside `src/lib/payments/commission-engine`. If an active reward applies, override the pro's standard rate for that specific payment row.
3. **Client credits:** Apply at PaymentIntent creation; reduce the amount the client is charged. Pro still receives full agreed amount; the credit offsets platform commission.

Stripe Connect Express itself is not aware referrals exist. This isolates the program from payout-flow regressions.

### 6.3 Clerk + user model integration

- New referral fields live in *new* tables, not on `users` directly. The `users` table stays clean.
- A user may have at most one active `referral_codes` row per role (one as a pro, one as a client if they switch roles). Code lookup is `(user_id, role)` not just `user_id`.
- Clerk metadata stores only the user's primary referral code (for fast read on the dashboard); source of truth is the DB.

### 6.4 Observability

Every referral state transition emits an event to the analytics pipeline:
- `referral.clicked`
- `referral.signed_up`
- `referral.first_action`
- `referral.completed`
- `referral.fraud_flagged`
- `referral.rewarded`
- `referral.killed`

This feeds the live k-factor dashboard the data-analytics-reporter agent will build.

---

## 7. Phase 1 vs Phase 2 Rollout Summary

| Loop | Phase 1 month | Phase 2 expansion |
|---|---|---|
| Loop 1 — Pro→Pro | Month 3 (launch with first close) | Month 7: open to all pros at month 1 of tenure, raise velocity cap, add badges |
| Loop 3 — Pro→Client | Month 3 (launch alongside Loop 1) | Month 7: add "Verified Repeat Builder" badge tier |
| Loop 2 — Client→Client | Month 4 (after job pipeline real) | Month 7: add "Trusted Neighbor Gold" tier |
| Loop 4 — Client→PM | **DO NOT LAUNCH IN PHASE 1** | Month 7 launch (after PM tier has 1+ anchor); Month 9 broad-open |

**Sequencing rationale:** Loops 1 and 3 are the supply-side accelerants. Phase 1 is supply-constrained (50 pros target by month 6) — so the Phase 1 referral focus is bringing more pros and converting their existing books. Loop 2 (demand-side) launches once there's enough pro supply to absorb the referred demand without creating frustration. Loop 4 launches only when the PM product has been proven with at least one paying anchor — referring people to a half-baked product burns trust.

---

## 8. Open Questions for Phyrom

1. **Reward magnitudes — confirm or push back.** The math checks above use estimates ($1,200 avg job, 10% take, $49/mo sub). If actual Phase 1 averages diverge >25%, reward levels need re-tuning before launch.
2. **Custom referral codes.** Should pros be able to choose their own suffix (`JOSE-NH`) or get auto-assigned? Custom is more shareable; auto is faster to ship. Recommend custom, admin-approved during Phase 1.
3. **Public referral leaderboard?** The Founding Pro Council mention in Loop 1 (10+ referrals) could be coupled with a public leaderboard. Pro: motivates competition. Con: starts to feel MLM-y. Recommend keeping it private and invitation-only.
4. **Should the Loop 4 reward be cash for the homeowner instead of credit?** Given homeowners may not have $250 of platform jobs to redeem against, a $250 Visa GC could be more compelling. **But this is precisely the reward type that triggers the attorney-review flag in §4.** Recommend: stay in credits during the Reg CF window; revisit post-window.

---

## 9. References

- GTM spec §4 (phased GTM): `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md`
- GTM spec §5 (finance model — 5%→10% take rate, Founding Pro grandfathering)
- GTM spec §6.4 (Wefunder Reg CF — referral compliance dependency)
- Drizzle schema: `src/db/drizzle-schema.ts`
- Commission engine: `src/lib/payments/`
- Brand voice: `CLAUDE.md` + GTM spec §3.3
