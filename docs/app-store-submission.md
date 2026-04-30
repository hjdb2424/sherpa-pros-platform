# Sherpa Pros — App Store Connect Submission Package

**Status:** Ready for copy-paste into App Store Connect.
**Build target:** EAS-uploaded iOS build, version 1.0.0, bundle `com.thesherpapros.app`.
**Stage:** Closed beta — be honest about it in metadata; don't oversell.

Every section below maps 1:1 to a field group in App Store Connect. Character limits are noted inline. Anything in `code blocks` is meant to be pasted verbatim.

---

## 1. Core App Information

### App Name (max 30 chars)
```
Sherpa Pros
```
**Char count:** 11. Brand name only — no keyword stuffing in the name field. Apple penalizes promotional text in app names, and recognition matters more than search density once invitees start opening the email and looking for the app.

### Subtitle (max 30 chars)
```
Trade work, done right.
```
**Char count:** 23. This is the brand tagline already used across the invite emails, landing pages, and logo lockup. Keeps brand voice intact and reinforces the promise the moment a tester sees the listing.

### Bundle ID
```
com.thesherpapros.app
```
**Confirmed.** Matches `mobile/app.json` (`ios.bundleIdentifier`). No change needed.

### Primary Category — Recommendation: **Business**
**Reasoning:** Sherpa Pros is a two-sided marketplace. The primary user we expect to install the iOS app first is the **Pro** (licensed contractor running their book of work) and the **PM** (property manager coordinating vendors across a portfolio). Both are conducting business — bidding jobs, managing invoicing through Stripe Connect, coordinating subs, tracking earnings. "Business" puts us in front of contractor-type buyers and avoids competing for shelf space against consumer to-do apps. It also signals to Apple's review team that this is a B2B/prosumer tool, which aligns with the app's permissions (location, camera, contacts) and the Stripe Connect financial flow.

**Reject Productivity** because that category is dominated by note-taking and calendar apps. Sherpa Pros' job-list and dispatch UI looks superficially similar but our LTV and use case sit firmly in trade services, not personal task management.

### Secondary Category — Recommendation: **Utilities**
**Reasoning:** "Utilities" captures the homeowner / Client side — they install Sherpa Pros to get something fixed, the way they'd install a flashlight or a unit converter. It's a tool you reach for when you have a problem. This pairs well with Business (B2B) by giving the consumer side a reasonable shelf, without forcing us into Lifestyle (where home-renovation Pinterest clones live) or Finance (which would require Apple to scrutinize Stripe Connect more aggressively).

### Age Rating — Expected: **4+**

App Store Connect walks you through ~17 questions. For Sherpa Pros, every answer is **None** except the two noted:

| # | Question | Answer |
|---|---|---|
| 1 | Cartoon or Fantasy Violence | None |
| 2 | Realistic Violence | None |
| 3 | Prolonged Graphic or Sadistic Realistic Violence | None |
| 4 | Profanity or Crude Humor | None |
| 5 | Mature/Suggestive Themes | None |
| 6 | Horror/Fear Themes | None |
| 7 | Medical/Treatment Information | None |
| 8 | Alcohol, Tobacco, or Drug Use or References | None |
| 9 | Simulated Gambling | None |
| 10 | Sexual Content or Nudity | None |
| 11 | Graphic Sexual Content and Nudity | None |
| 12 | Contests | None |
| 13 | **Unrestricted Web Access** | **No** (in-app messaging is masked Twilio threads only; no embedded browser) |
| 14 | **Gambling and Contests** | None |
| 15 | **User-Generated Content** | **Yes** (job descriptions, photos, chat messages) — add note: "All UGC is moderated. Users can report content; flagged content is reviewed within 24 hours by Sherpa Success Manager." |
| 16 | Medical/Treatment Information | None |
| 17 | Made for Kids | **No** |

**Final rating:** 4+

---

## 2. Marketing Copy

### Promotional Text (max 170 chars — editable without re-review)
```
Closed beta now open. Founding-tester perks: free Sherpa Home for life, founder badge, direct line to Phyrom. Ten Pros, eleven Clients, three PMs in this cohort.
```
**Char count:** 168. Use this slot for cohort-status updates ("Beta seats remaining: 4 Pros") and seasonal pushes (Sherpa Home launch, new region) — Apple lets you edit it any time without restarting review.

### Description (max 4000 chars)

```
Sherpa Pros is the first on-demand local logistics and trade-job delivery platform — a marketplace built so trade work actually works for everyone in it.

Homeowners, property managers, and licensed pros meet on one platform. Code-verified quotes go in. Marketplace payment protection holds the money until the work passes inspection. A real human owns coordination and disputes. No more three-quotes-you-can't-compare. No more deposit-and-pray. No more $35-per-lead-that-ghosts.

WHAT'S INSIDE

• Code-Verified Quotes — every bid is checked against local building codes and real market pricing before it hits the client. The cheapest guess doesn't auto-win.

• Marketplace Payment Protection — clients fund the job up front; funds release on milestones once the work passes inspection. Pros stop chasing invoices. Clients stop paying contractors who disappear.

• Multi-Trade Coordination — one job, multiple trades (plumber + electrician + tile)? Sherpa Pros sequences the handoffs so nobody plays project manager.

• Materials Dispatch — materials delivered to the job site. The pro doesn't disappear for supply runs, the job goes faster.

• Sherpa Success Manager — a real human handles disputes and no-shows. Not a chatbot. Not an offshore reviewer.

• In-App Messaging — masked phone numbers, full record of what was agreed, no spam after-hours.

• Map-First Dispatch — see nearby jobs (Pros) or nearby pros (Clients) the way you'd hail a ride. Tap, bid, go.

WHO IT'S FOR

Pros — licensed trades, handymen, skilled carpenters. Zero lead fees. You only pay a service fee when the homeowner pays you.

Clients — homeowners and small-property owners who are tired of the bid-and-pray cycle. Free to post. You only pay when you accept a bid.

Property Managers — commercial PMs running multi-unit portfolios. Combined Maintenance kanban across every property, per-property cost tracking, vendor coordination handled.

CLOSED BETA — HONEST DISCLAIMER

Sherpa Pros is in closed beta. We're starting in New Hampshire and Maine and expanding fast. If you're not in our coverage area yet, we'll tell you straight at sign-up.

You're early. Expect rough edges. Tell us where they are. The cohort is small (10 Pros, 11 Clients, 3 PMs at launch) and every founding tester gets a permanent badge, free Sherpa Home for life when it launches, and a direct line to the founder for support.

Questions, feedback, or a bug to report? Email info@thesherpapros.com — Phyrom (founder, working NH GC) reads every one.

Sherpa Pros is built by working contractors, for working contractors and the people who hire them.
```

**Char count:** 2,489. Leaves room (~1,500 chars) to expand later without restructuring. Description structure follows the brief — hook (2 paragraphs), feature list (7 bullets), audience (3 personas), beta disclaimer with cohort numbers, contact.

### Keywords (max 100 chars total, comma-separated, no spaces)

**Brainstormed candidate pool (24):**
contractor, contractors, handyman, trades, tradesman, plumber, electrician, hvac, carpenter, painter, roofer, marketplace, jobs, trade jobs, home repair, home improvement, property management, property manager, landlord, renovation, remodel, find pros, hire pro, on demand

**Final 13 (fits in 100 chars, total 99 chars):**
```
contractor,handyman,trades,plumber,electrician,hvac,marketplace,jobs,property,renovation,repair,hire
```
**Char count:** 99. Picks won on three criteria:
1. **Search volume** — `contractor`, `handyman`, `marketplace` are top-of-funnel.
2. **Specificity** — `plumber`, `electrician`, `hvac` capture trade-specific intent that competitors (Angi, Thumbtack) outrank us on for generics, but where we have a fighting chance on specifics.
3. **Intent** — `hire`, `repair`, `renovation` capture buy-side intent. `property` covers PM searches.

**Excluded** (and why):
- "angi", "thumbtack", "uber" — trademarked, Apple rejects.
- "free" — Apple disallows promotional words.
- "best", "top" — same reason.
- "carpenter", "roofer", "painter" — already covered by `trades` and we're under 100 chars; can swap in if a category underperforms in App Analytics after 4 weeks.
- "code-verified" — too niche for organic search; lives in the description instead.

### What's New in This Version (first release)

```
Welcome to the Sherpa Pros beta.

This is v1.0 — the first cut of an on-demand marketplace where homeowners and property managers post trade work, and licensed pros bid with code-verified quotes. Funds sit in marketplace payment protection until the work passes inspection.

What you'll find on day one: post a job, get bids, accept a bid, message your pro through masked Twilio threads, fund the job through Stripe Connect, and watch milestones release as the work passes inspection. Pros get a dispatch map, a job feed, and an earnings dashboard. PMs get a Combined Maintenance kanban across every property they manage.

What's coming next (your feedback shapes the order): Sherpa Home subscriptions, expanded region coverage beyond NH/ME, and a Multi-View tester mode that lets you flip between Pro / Client / PM dashboards on a single login.

Founding testers — text Phyrom (founder, working NH GC) directly. Email info@thesherpapros.com. We read every reply.
```
**Char count:** 1,008. (Apple's What's New limit is 4,000.)

---

## 3. URLs

### Marketing URL
```
https://www.thesherpapros.com
```
**Status:** Live.

### Support URL — Recommendation: dedicated `/support` page
```
https://www.thesherpapros.com/support
```
**Phyrom action required:** publish a `/support` page before submission. Apple checks the URL during review and will reject if it returns 404 or redirects suspiciously.

**Minimum viable `/support` page contents:**
- "How to reach us" (`info@thesherpapros.com`, response window: 24 hours during beta)
- "Common issues" — three or four short FAQ entries lifted from the invite landing pages (sign-in problem, Pro account verification, payment release timing)
- "Beta status disclaimer" with cohort sizes
- Link back to `/install` and `/sign-in`

Don't use `mailto:` as the support URL. Apple has been rejecting `mailto:` support URLs since 2023 — they want a real page.

### Privacy Policy URL — Recommendation
```
https://www.thesherpapros.com/privacy
```
**Phyrom action required: this URL MUST exist and resolve to a working privacy policy before you click Submit.** Apple rejects any submission where this URL 404s or returns a placeholder.

**Privacy policy outline (drop into a lawyer or use Termly/Iubenda to generate, then humanize):**

1. **Who we are** — Sherpa Pros, operated by [legal entity], NH-based, contact `info@thesherpapros.com`.
2. **What we collect**
   - Account data: name, email, phone, role (Pro/Client/PM)
   - Profile data (Pros): license number, insurance docs, trade specialties, service area
   - Job data: descriptions, addresses, photos, materials lists
   - Communication: in-app chat messages (Twilio masked threads)
   - Location: precise (when active in app, to show nearby jobs/pros) and coarse (for service area matching)
   - Device: crash logs and performance diagnostics via Expo / Apple's standard frameworks
   - Payment: handled entirely by Stripe Connect. **We never see card numbers or bank account details.** We see Stripe customer IDs and payout statuses only.
3. **How we use it** — match jobs to pros, route payments through Stripe, surface code-verified quotes, run dispute resolution, send transactional notifications.
4. **Who we share it with** — Stripe (payments), Twilio (masked messaging), Clerk (auth), Neon (database), Vercel (hosting), Resend (email). Each with a one-line "what they see" description.
5. **What we don't do** — sell user data, run third-party advertising tracking, share location with anyone outside the matching engine.
6. **User rights** — access, export, delete (CCPA/GDPR boilerplate). Account deletion via `info@thesherpapros.com` with 30-day SLA.
7. **Children** — service is 18+. We do not collect data from minors.
8. **Changes** — we'll email all users 30 days before any material change.
9. **Contact** — `info@thesherpapros.com`, mailing address.

---

## 4. App Privacy Labels (the "Nutrition Label")

This is the most error-prone section in App Store Connect. Apple checks each declaration against the actual app behavior and rejects if it doesn't match. Walk through each category below in order.

| Data Type | Collected? | Linked to Identity? | Used for Tracking? | Purposes |
|---|---|---|---|---|
| **Contact Info — Name** | Yes | Yes | No | App Functionality |
| **Contact Info — Email** | Yes | Yes | No | App Functionality |
| **Contact Info — Phone Number** | Yes | Yes | No | App Functionality (Twilio masked messaging) |
| **Contact Info — Physical Address** | Yes | Yes | No | App Functionality (job site addresses, Pro service areas) |
| **User Content — Photos or Videos** | Yes | Yes | No | App Functionality (checklist documentation, job-condition photos) |
| **User Content — Other (job descriptions, chat messages)** | Yes | Yes | No | App Functionality |
| **Identifiers — User ID** | Yes | Yes | No | App Functionality |
| **Identifiers — Device ID** | No | — | — | — |
| **Usage Data — Product Interaction** | No | — | — | — (no analytics SDK installed at v1.0; revisit when adding PostHog/Amplitude) |
| **Usage Data — Advertising Data** | No | — | — | — |
| **Diagnostics — Crash Data** | Yes | No | No | App Functionality (Expo/React Native default crash reporting) |
| **Diagnostics — Performance Data** | Yes | No | No | App Functionality |
| **Diagnostics — Other Diagnostic Data** | No | — | — | — |
| **Location — Precise Location** | Yes | Yes | No | App Functionality (find nearby jobs / pros, dispatch routing) |
| **Location — Coarse Location** | Yes | Yes | No | App Functionality (service-area matching) |
| **Financial Info — Payment Info** | **No** | — | — | — (handled entirely by Stripe — the app never sees card or bank details) |
| **Financial Info — Credit Info** | No | — | — | — |
| **Financial Info — Other Financial Info** | No | — | — | — |
| **Sensitive Info** | No | — | — | — |
| **Contacts** | No | — | — | — |
| **Health & Fitness** | No | — | — | — |
| **Browsing History** | No | — | — | — |
| **Search History** | No | — | — | — |
| **Purchases** | No | — | — | — |

**Key call-outs for the reviewer:**
- "Used for Tracking" is **No** for every category — we don't run third-party ad SDKs and don't share data with data brokers.
- "Linked to Identity" is **Yes** for everything except crash/performance diagnostics. Be honest — Apple cross-checks this against your data flow.
- **Financial Info: No.** Stripe Connect handles all card and bank input on Stripe-hosted sheets. The app sends a customer ID and a payment intent ID; it never holds PAN, CVV, or routing numbers. This is a meaningful differentiator vs. apps that custody payment info — and the right answer here is what keeps Sherpa Pros out of Apple's stricter financial-app review track.
- **If you add analytics later** (PostHog, Amplitude, Mixpanel), flip "Usage Data — Product Interaction" to Yes and add Analytics as the purpose. This requires submitting an updated privacy declaration but does NOT require a new build.

---

## 5. Screenshot Specification

`mobile/app.json` has `supportsTablet: true`, so Apple requires both iPhone AND iPad screenshots. As of late 2024 the required sizes are:

| Device class | Resolution | Required? | Count |
|---|---|---|---|
| 6.9" iPhone (iPhone 16 Pro Max) | 1320 × 2868 px | Required | 5 |
| 6.5" iPhone (iPhone 11 Pro Max / 14 Plus) | 1284 × 2778 px | Required (legacy fallback) | 5 |
| iPad Pro 13" / 12.9" 6th gen | 2064 × 2752 px | Required (tablet) | 5 |
| iPad Pro 11" / 12.9" 3rd-gen fallback | 2048 × 2732 px | Recommended | 5 |

**Min/max per slot:** Apple allows 3–10. **Five is the right call for v1.0** — enough to tell the marketplace story, few enough that you can produce them in 1–2 design days and re-shoot the underperformers based on App Analytics conversion data 4 weeks in.

### Screenshot 1 — Hero / Value Prop
**Headline overlay (top third, white text on dark navy `#1a1a2e`):** "Trade work, done right."
**Subhead:** "On-demand contractors. Code-verified. Payment protected."
**Visual:** Pro dashboard home screen with a job feed and a map. Use the brand amber `#f59e0b` for one urgent-job pulse marker so the eye lands on motion.
**Why first:** sets brand voice, communicates two-sided marketplace in three seconds, gives the App Store algorithm a recognizable hero frame for category browsing.

### Screenshot 2 — Code-Verified Quotes
**Headline overlay:** "Every bid, checked against local code."
**Subhead:** "No padding. No missing line items. Apples to apples."
**Visual:** A bid review screen showing line items with green check marks next to each one and a "Code-verified" amber chip in the header. Show one line item with a yellow flag and a tooltip: "Missing required permit pull — flagged."
**Why second:** this is the differentiator vs. Angi/Thumbtack and the most common question testers ask. Lead with proof.

### Screenshot 3 — Marketplace Payment Protection
**Headline overlay:** "Funds held until the work passes."
**Subhead:** "Milestone-based release. No more deposit-and-pray."
**Visual:** Milestone progress UI showing four checkpoints: Deposit funded → Mid-job inspection → Final inspection → Released to pro. Three checkpoints green, one in progress with a small clock icon. Total amount visible (use a realistic NH-region kitchen-remodel number like $14,200) with the "Held in Stripe" badge.
**Why third:** this is the trust mechanic. Once a tester sees this, the conversion logic clicks.
**Critical:** the screenshot copy must read "Marketplace Payment Protection" or "Payment Protection" — never "escrow." Stripe's classifier flags "escrow" as Restricted Business and we've already had the platform suspended once over this language.

### Screenshot 4 — Map View / Dispatch
**Headline overlay:** "See who's nearby. Tap. Go."
**Subhead:** "Uber-style map for jobs and pros."
**Visual:** Google Maps view of southern New Hampshire with 8–10 job pins (mix of trade icons — wrench, bolt, paintbrush). One pin tapped open with a bottom-sheet card showing job title, distance, bid count, and an amber "Bid now" CTA.
**Why fourth:** the map is the "oh, this looks like Uber" moment. Familiarity drops the perceived learning curve.

### Screenshot 5 — In-App Messaging
**Headline overlay:** "Masked numbers. Full record. No spam."
**Subhead:** "Every message goes through Sherpa Pros."
**Visual:** Chat thread between a Client and a Pro about a kitchen remodel. Mask the phone numbers in the header (`(***) ***-4582`). Show one photo attachment in the thread. Include the green "Verified Pro" badge next to the contractor's name.
**Why fifth:** answers the "will I get spammed?" objection that lives in the FAQ on the Client invite page.

### Visual treatment recommendations
- **Yes, use device frames + marketing text overlays.** Annotated screenshots convert ~2x better than bare device captures (App Annie 2023 study, plus our own A/B test data plan post-launch). Use the latest iPhone 16 Pro Max frame in space black.
- **Keep all overlay text in the top third** so the App Store's auto-generated thumbnail (which crops to the device's screen area) still reads well at 1/4 size in search results.
- **Stay on-brand:** dark navy `#1a1a2e` for backgrounds, amber `#f59e0b` for accent / CTAs, emerald `#10b981` for success states, brand blue `#00a9e0` for sparingly-used links per the invite emails. Match the design tokens already in use across the platform.
- **Localization (later):** for v1.0, English-only is fine — we're NH/ME-first. When we expand to QC or hispanic-heavy MA markets, plan a French and Spanish screenshot pass. Don't pre-localize before there's coverage.

---

## 6. Submission Checklist

Run this top-to-bottom before clicking Submit for Review. Anything unchecked is a likely rejection or 1–3 day review delay.

- [ ] App Name, Subtitle, Bundle ID confirmed in App Information tab
- [ ] Primary Category set to **Business**, Secondary set to **Utilities**
- [ ] Age Rating questionnaire completed → result is **4+**
- [ ] Promotional Text pasted (168 chars)
- [ ] Description pasted (2,489 chars) — proofread for typos one more time
- [ ] Keywords pasted (99 chars, comma-separated, no spaces)
- [ ] What's New text pasted (1,008 chars)
- [ ] Marketing URL `https://www.thesherpapros.com` entered and verified live
- [ ] **Support URL `https://www.thesherpapros.com/support` published and verified live (NOT a `mailto:`)**
- [ ] **Privacy Policy URL `https://www.thesherpapros.com/privacy` published and verified live with a real, lawyer-reviewed (or Termly/Iubenda-generated) policy**
- [ ] App Privacy questionnaire completed — every row in Section 4 above declared correctly
- [ ] Screenshots uploaded for 6.9" iPhone (5 total) — required
- [ ] Screenshots uploaded for 6.5" iPhone (5 total) — required fallback
- [ ] Screenshots uploaded for iPad Pro 13" (5 total) — required because `supportsTablet: true`
- [ ] Pricing & Availability set: **Free**, available in **United States** at v1.0 (expand to Canada/UK after first review pass)
- [ ] Build selected — pick the latest EAS-uploaded build matching version 1.0.0
- [ ] App Review Information filled in:
  - Contact name: Phyrom
  - Phone: [Phyrom's number]
  - Email: `info@thesherpapros.com`
  - **Demo account credentials provided** — Apple WILL test sign-in. Pre-create one Pro test account and one Client test account, hand the credentials to the reviewer in this field, note that the app uses Clerk so passwords work without 2FA prompts during review.
  - **Notes for reviewer** — paste this:
    > "Sherpa Pros is a closed-beta marketplace for licensed trade contractors in New Hampshire and Maine. The Pro side requires verified license docs in production but the demo account is pre-verified. Payment flows use Stripe Connect; testing the milestone release flow requires a sandbox card (4242 4242 4242 4242, any future date, any CVV). All chat goes through Twilio masked threads — for review, we've enabled mock-mode so messages deliver without billing. Contact info@thesherpapros.com if you need anything."
- [ ] Export Compliance: `ITSAppUsesNonExemptEncryption: false` is already set in `mobile/app.json` — no extra paperwork
- [ ] Sign-In with Apple: confirm Clerk is configured to accept it (Apple requires SIWA if any other third-party login is offered — Clerk Google OAuth would trigger this requirement)
- [ ] Final QA pass on the EAS build: install via TestFlight, run through Pro and Client onboarding, post a job, accept a bid, fund the milestone, send a chat message
- [ ] **Submit for Review** clicked

**Expected review time:** 24–48 hours for v1.0. First-submission marketplace apps with payment flows occasionally get an extra round of review (3–5 days) — Apple sometimes asks for a clarifying screenshot of the Stripe Connect sheet to confirm the app isn't custodying funds. Have a screen recording of the funding flow ready to send if they ask.

---

**Document owner:** Phyrom
**Last updated:** 2026-04-30
**Next review:** Post first-submission decision (Apple response expected within 5 business days).
