---
title: Franchise Prospect Website — Wireframes + Copy
date: 2026-04-25
status: draft
owner: Phyrom + future Vice President of Franchise Development (VPFD) + future Marketing Director
phase: Phase 4 (M18+) — Franchise Sales Funnel Top-of-Funnel
target_url: thesherpapros.com/franchise (subdomain franchise.thesherpapros.com optional)
references:
  - docs/superpowers/specs/2026-04-25-franchise-model-design.md (§4 Items 5-7, §6 screening)
  - docs/superpowers/plans/2026-04-25-franchise-model-plan.md (WS3-1)
  - docs/operations/franchise-fdd-prep/03-item-19-economics-spreadsheet.md
  - docs/operations/brand-portfolio.md (typography + color tokens)
  - docs/operations/franchise-fdd-prep/05-7-stage-screening-templates.md
typography:
  - Display: Fraunces (italic for headlines + accents)
  - Body: Manrope (400/500/600/700)
  - Mono: JetBrains Mono (for stats + numbers)
brand_colors:
  - Sky Blue #00A9E0 (primary brand accent + CTAs)
  - Orange Red #FF4500 (secondary accent — used sparingly)
  - Dark Navy #1A1A2E (text + dark backgrounds)
  - Warm Cream #FAF7F0 (light backgrounds — editorial feel)
  - White #FFFFFF
---

# Franchise Prospect Website — Wireframes + Copy

## 0. Page-Level Information Architecture

Single long-scroll page with 9 sections + sticky CTA. Mobile-first per Sherpa Pros design conventions. Page weight target: < 1.2 MB. Time to Interactive target: < 2.5 seconds on mobile 4G.

```
+-------------------------------------------------+
|  [STICKY HEADER]  Sherpa Pros logo  | [Apply]   |
+-------------------------------------------------+
|  SECTION 1 — HERO                               |
|  Headline + subhead + primary CTA + hero image  |
+-------------------------------------------------+
|  SECTION 2 — WHY SHERPA HUB FRANCHISE           |
|  6-product portfolio + 8 platform capabilities  |
+-------------------------------------------------+
|  SECTION 3 — WHO FITS                           |
|  Ideal franchisee profile + qualification bar   |
+-------------------------------------------------+
|  SECTION 4 — ITEM 19 ECONOMICS TEASER           |
|  5-year revenue + EBITDA chart + disclaimer     |
+-------------------------------------------------+
|  SECTION 5 — THE 7-STAGE PROCESS                |
|  Inquiry to signed Franchise Agreement timeline |
+-------------------------------------------------+
|  SECTION 6 — FOUNDER STORY                      |
|  Phyrom + HJD Builders + working contractor     |
+-------------------------------------------------+
|  SECTION 7 — INQUIRY FORM                       |
|  8-field form + privacy + auto-response promise |
+-------------------------------------------------+
|  SECTION 8 — FAQ (15 questions)                 |
|  Accordion list                                 |
+-------------------------------------------------+
|  SECTION 9 — REQUIRED FDD DISCLOSURE FOOTER     |
|  Legal disclaimer + state regulator language    |
+-------------------------------------------------+
```

---

## Section 1 — Hero

### Wireframe

```
+-------------------------------------------------+
|  [Sherpa Pros wordmark logo, top-left]          |
|                                                 |
|  ╔═════════════════════════════════════════╗   |
|  ║                                         ║   |
|  ║  Headline (Fraunces italic, 64-72px)    ║   |
|  ║                                         ║   |
|  ║  Subhead (Manrope 500, 18-22px,         ║   |
|  ║  3-line max, dark navy)                 ║   |
|  ║                                         ║   |
|  ║  [PRIMARY CTA: sky blue button]         ║   |
|  ║  Inquire about a Sherpa Hub franchise   ║   |
|  ║                                         ║   |
|  ║  [SECONDARY LINK: text link]            ║   |
|  ║  Watch the 90-second walkthrough →      ║   |
|  ╚═════════════════════════════════════════╝   |
|                                                 |
|  [HERO IMAGE: photo of Hub #1 Atkinson NH       |
|   exterior — overcast NE light, branded sign    |
|   visible, working pro loading kit into truck]  |
+-------------------------------------------------+
```

### Copy — Headline (3 alternatives for A/B test)

**Alternative A (RECOMMENDED PRIMARY):**
> Own a Sherpa Hub. Build community wealth in the trades.

**Alternative B (founder-story angle):**
> The contractor's marketplace, owned by contractors — one Hub at a time.

**Alternative C (economics angle):**
> A franchise built for the working contractor. $185K to $420K in. $236K cash flow at maturity.

### Copy — Subhead (paired with all three)

> Sherpa Hub is the physical pickup point and community center for verified pros in your local market. You own the Hub. You serve the pros. Sherpa Pros corporate runs the national platform. Your franchise sits at the intersection of physical infrastructure and the largest licensed-trade marketplace in New England.

### Copy — Primary CTA

> Inquire about a Sherpa Hub franchise

(Sky-blue button — `#00A9E0`. Anchors to inquiry form. Hover state: 5% darker `#0095C7`. Disabled state: 40% opacity.)

### Copy — Secondary Link

> Watch the 90-second walkthrough →

(Triggers in-page video modal. Video is the founder Phyrom giving a 90-second tour of Hub #1 Atkinson NH. Required production deliverable before site goes live.)

---

## Section 2 — Why Sherpa Hub Franchise

### Wireframe

```
+-------------------------------------------------+
|  Section eyebrow: WHY SHERPA HUB                |
|  Section headline (Fraunces italic, 48px):      |
|  "A franchise built on a platform, not a logo." |
|                                                 |
|  +-----------------+  +-----------------+       |
|  | 6 PRODUCTS      |  | 8 PLATFORM      |       |
|  | ICON GRID       |  | CAPABILITIES    |       |
|  | (Sherpa Hub,    |  | (Codes engine,  |       |
|  |  Marketplace,   |  |  Materials      |       |
|  |  Materials,     |  |  engine,        |       |
|  |  Home, Manager, |  |  Dispatch,      |       |
|  |  Rewards/Flex)  |  |  Threads, Smart |       |
|  +-----------------+  |  Scan, Mobile,  |       |
|                       |  Guard, Score)  |       |
|                       +-----------------+       |
|                                                 |
|  [3-column why-this-matters callout strip]      |
|  Vertical integration | Stripe Connect moment | |
|  Northeast density                              |
+-------------------------------------------------+
```

### Copy — Section Headline

> A franchise built on a platform, not a logo.

### Copy — Subhead

> Most franchises sell you a brand. Sherpa Pros sells you brand plus an integrated technology platform — the Sherpa codes engine, the Sherpa Materials engine, the Dispatch matching layer, the Sherpa Mobile app, the Sherpa Smart Scan optical character recognition stack, the Sherpa Threads in-app messaging system, the Sherpa Guard role-based access and audit log layer, and the Sherpa Score reputation algorithm. Every franchisee gets the entire stack from day one. You compete locally with national-platform leverage.

### Copy — 6-Product Portfolio Bullets

| Product | One-line Description |
|---|---|
| **Sherpa Hub** | Your physical franchise — 1,500–3,000 sq ft pickup point + training facility + community center for licensed pros |
| **Sherpa Marketplace** | The corporate-run national matchmaking platform; routes jobs to your local pros and pays you the per-pro engagement royalty |
| **Sherpa Materials** | Materials orchestration — sources kits and equipment from supplier network, stages them at your Hub, dispatches via Uber Direct or pro pickup |
| **Sherpa Home** | The homeowner-facing entry point; corporate-owned funnel that drives demand into your territory |
| **Sherpa Success Manager** | Concierge-style success management; corporate-owned but routes high-value clients to your local pros |
| **Sherpa Rewards + Flex** | Pro acquisition + retention; lifetime grandfather pricing for Founding Pros, hourly side-bandwidth pros via Flex |

### Copy — 8 Platform Capabilities Bullets

> Every Sherpa Hub franchisee gets full platform access included in the $200/month technology fee.

| Capability | What It Does for the Franchisee |
|---|---|
| Sherpa codes engine (internal codes intelligence layer) | Automatic code-aware quotes and dispatch routing — your pros price against current code, not memory |
| Sherpa Materials engine | Materials lists generated from job scope; supplier orders placed via Application Programming Interface (API) |
| Dispatch matching algorithm | 7-factor pro selection (license, certification, geography, availability, Sherpa Score tier, specialty match, customer history) |
| Sherpa Threads | In-app and Short Message Service messaging between pros, clients, and your Hub team |
| Sherpa Smart Scan | Optical character recognition for receipts, permits, photos — reduces pro paperwork to seconds |
| Sherpa Mobile | Native iOS and Android apps for pros and clients |
| Sherpa Guard | Role-Based Access Control + audit logs across the entire platform |
| Sherpa Score | Multi-factor pro reputation score that drives dispatch priority |

### Copy — 3-Column Why-This-Matters Strip

**Vertical integration**
> Sherpa Pros is the only national licensed-trade marketplace that owns the materials orchestration layer end-to-end. Your Hub captures margin on every materials line that flows through it — a revenue stream that grows with platform-wide adoption.

**The Stripe Connect moment**
> The marketplace runs on Stripe Connect. Pros get paid faster than any competing platform. Your Hub sits inside that flow — every transaction is auditable, every margin line is traceable, every royalty payment is automated.

**Northeast density**
> Phase 4 launches in non-registration states first (New Hampshire, Maine, Massachusetts, Vermont) — the same territory that already supports Sherpa Pros' active pro network. You inherit a recruiting pipeline, not a cold start.

---

## Section 3 — Who Fits

### Wireframe

```
+-------------------------------------------------+
|  Section eyebrow: WHO FITS                      |
|  Section headline (Fraunces italic, 48px):      |
|  "We approve operators, not investors."         |
|                                                 |
|  [Two-column layout]                            |
|  LEFT: "You are a strong fit if..."             |
|  • bullet                                       |
|  • bullet                                       |
|  • bullet                                       |
|                                                 |
|  RIGHT: "We will not approve..."                |
|  • bullet                                       |
|  • bullet                                       |
|  • bullet                                       |
|                                                 |
|  [Self-screening calculator: optional widget]   |
|  3 yes/no questions → fit-score green/yellow/red|
+-------------------------------------------------+
```

### Copy — Headline

> We approve operators, not investors.

### Copy — Subhead

> Sherpa Pros does not permit absentee ownership in Phase 4 Years 1 through 3. Every Sherpa Hub franchisee is an operator — present at the Hub full-time during the first 24 months, hands-on with pro recruiting, hands-on with member service, hands-on with your local trade community. If you are looking for a passive franchise investment, this is not the right opportunity for you.

### Copy — "Strong Fit" Bullets

> **You are a strong fit if you can answer YES to all of these:**

- 5–15 years of construction-adjacent industry experience (licensed General Contractor, trade-supply-house operator or branch manager, big-box pro-desk leader, multi-property property manager, or trade-association executive)
- $200,000+ in liquid net worth (cash and marketable securities not encumbered by other obligations)
- $400,000+ total net worth
- $185,000+ in cash available for the franchise investment (covers Year 1 low-case Initial Investment without debt; or covers Small Business Administration 7(a) down payment if you finance)
- Active in your local trade association, chamber of commerce, or building-industry circles
- Prepared to be on-site at your Hub full-time for at least the first 24 months
- Comfortable reading a Profit and Loss statement, managing to a cash-flow forecast, and working constructively with a corporate compliance team

### Copy — "We Will Not Approve" Bullets

> **We will not approve a franchise application that includes:**

- Any franchise litigation history (plaintiff or defendant)
- Personal bankruptcy in the last 7 years
- No construction-adjacent industry experience (the Sherpa Pros platform is specialized; multi-unit franchise experience in unrelated categories does not substitute)
- Lifestyle-franchisee intent — anyone who plans to delegate operations to a hired manager from day one
- Currently operating a competing licensed-trade marketplace, equipment-rental business, or job-kit business (conflict of interest)
- Felony conviction in the last 10 years (case-by-case review for non-violent financial crimes outside the 10-year window)
- Failed credit check or undisclosed material liabilities
- Negative reference from any of three required professional references

---

## Section 4 — Item 19 Economics Teaser

### Wireframe

```
+-------------------------------------------------+
|  Section eyebrow: THE ECONOMICS                 |
|  Section headline (Fraunces italic, 48px):      |
|  "Item 19 Financial Performance Representations"|
|                                                 |
|  [REQUIRED DISCLAIMER BOX — top of section]     |
|  Some outlets have earned this amount. Your     |
|  individual results may differ. There is no     |
|  assurance that you will earn as much...        |
|                                                 |
|  [Bar chart: 5-year revenue Mid Case]           |
|  Y1 $580K | Y2 $1.05M | Y3 $1.25M | Y5 $1.42M  |
|                                                 |
|  [Bar chart: 5-year EBITDA Mid Case]            |
|  Y1 $94K | Y2 $204K | Y3 $269K | Y5 $320K       |
|                                                 |
|  [3-tile callout strip]                         |
|  $185K-$420K | 14-22 months | $236K cash flow   |
|  Initial Inv | to breakeven  | at maturity      |
|                                                 |
|  [LINK: Read the full Item 19 in the FDD →]     |
|  (Triggers FDD-request flow per 7-stage screen) |
+-------------------------------------------------+
```

### Copy — Required Disclaimer (must appear before any earnings number)

> The Federal Trade Commission's Franchise Rule permits a franchisor to provide information about the actual or potential financial performance of its franchised and franchisor-owned outlets, if there is a reasonable basis for the information, and if the information is included in the disclosure document. Sherpa Pros LLC is providing the information set forth below.
>
> **Some outlets have earned this amount. Your individual results may differ. There is no assurance that you will earn as much.**
>
> Written substantiation for the financial performance representation will be made available to the prospective franchisee upon reasonable request.

### Copy — Headline

> Item 19 Financial Performance Representations

### Copy — Subhead

> Sherpa Pros' Item 19 disclosure is grounded in operating data from Hub #1 (Atkinson NH, corporate-owned) and industry-comparable home-services franchise benchmarks. Three-tier scenarios — Low (P25), Mid (P50), High (P75) — are disclosed for every revenue and Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) line.

### Copy — 3-Tile Callout

| Tile | Number | Caption |
|---|---|---|
| 1 | $185K–$420K | Total Initial Investment Range (per FDD Item 7) |
| 2 | 14–22 months | Time to monthly cash-flow positive operations |
| 3 | $236K | Mid-case franchisee pre-tax cash flow at Year 3 maturity |

### Copy — Closing Link

> Read the full Item 19 disclosure in the Franchise Disclosure Document — request the FDD via inquiry form below. The FDD will be delivered after Discovery Call and signed mutual Non-Disclosure Agreement, in compliance with the Federal Trade Commission Franchise Rule's 14-calendar-day waiting period. →

---

## Section 5 — The 7-Stage Process

### Wireframe

```
+-------------------------------------------------+
|  Section eyebrow: THE PROCESS                   |
|  Section headline (Fraunces italic, 48px):      |
|  "Seven stages. 60-120 days. Then you build."   |
|                                                 |
|  [Vertical timeline — 7 numbered cards]         |
|  Each card: number + stage name + 2-line        |
|  description + duration estimate                |
+-------------------------------------------------+
```

### Copy — Headline

> Seven stages. 60–120 days. Then you build.

### Copy — Subhead

> The Federal Trade Commission Franchise Rule mandates a 14-day waiting period between Franchise Disclosure Document (FDD) delivery and any binding signature. Add Discovery Day, references, and Approval Committee deliberation, and the typical inquiry-to-signed-Franchise-Agreement cycle is 60 to 120 days.

### Copy — Stage Cards

| Stage | Name | What Happens | Typical Duration |
|---|---|---|---|
| 1 | Inquiry | You submit the form below. Auto-response with FDD Frequently Asked Questions and Discovery Day calendar. | < 1 day |
| 2 | Discovery Call | 45-minute video call with our Vice President of Franchise Development. We qualify your industry experience, net worth, cash to invest, and territory interest. You ask any questions about the business. | Week 1–2 |
| 3 | Mutual Non-Disclosure Agreement (NDA) | Both parties sign before any non-public information is exchanged. | Week 2 |
| 4 | FDD Delivery | We deliver the full Franchise Disclosure Document — all 23 Items, sample franchise agreement, financial statements. **The Federal Trade Commission's mandatory 14-calendar-day waiting period begins.** No binding signatures during this window. | Week 2–4 |
| 5 | Discovery Day On-Site | Full-day visit to Hub #1 in Atkinson, New Hampshire. Phyrom hosts. You meet our Vice President of Operations, our Hub Manager, and at least one founding pro. You walk the Hub, observe daily operations, get every question answered. | Week 4–6 |
| 6 | References + Background Check + Credit Check | We contact your three professional references. We run a credit check via standard franchise-industry vendor. We run a background check via standard third party. Cost reimbursed by you ($550 application processing fee). | Week 6–10 |
| 7 | Final Approval + Signing | Sherpa Pros Franchise Approval Committee reviews your complete file and votes. Approval requires unanimous vote. If approved, signing scheduled at Hub #1; you deliver the $45,000 Initial Franchise Fee at signing. | Week 10–14 |

---

## Section 6 — Founder Story

### Wireframe

```
+-------------------------------------------------+
|  [Editorial 2-column layout — image + text]     |
|                                                 |
|  LEFT: Founder portrait (Phyrom at HJD HQ       |
|  Atkinson NH; working contractor lens — boots,  |
|  blueprint, half-built deck visible behind)     |
|                                                 |
|  RIGHT: Founder story copy                      |
|  Section eyebrow: FROM THE FOUNDER              |
|  Headline (Fraunces italic, 36-44px):           |
|  "I built this for the contractor I wish I had  |
|  on speed-dial when I started."                 |
|                                                 |
|  Body copy (Manrope 400, 17-19px, 5-7 paras)    |
+-------------------------------------------------+
```

### Copy — Headline

> I built this for the contractor I wish I had on speed-dial when I started.

### Copy — Body (5 paragraphs)

> I am Phyrom, a working General Contractor in Atkinson, New Hampshire. I founded HJD Builders LLC because I wanted to build the kinds of New England homes that last 200 years — the kind of build I learned to respect from the older trades who taught me. I started Sherpa Pros because every working contractor I knew was getting clobbered by the same set of problems: pros with great trade skills but no platform to find work, materials orchestration so manual it ate half the profit on every job, code complexity that varied by town, dispatch logic that rewarded the loudest aggregator instead of the verified pro.
>
> Sherpa Pros is the platform I wish HJD Builders had on speed-dial in the early years. The Sherpa codes engine reads every state and town code change automatically and surfaces it as part of the quote. The Sherpa Materials engine pulls from the supplier network and stages everything at the right Hub for the right job. The Sherpa Score algorithm rewards verified pros for showing up, doing clean work, and keeping their licenses current — not for paying the platform the highest take-rate. The whole thing runs on the assumption that the working pro is the customer, and the homeowner is the demand.
>
> Sherpa Hub is the physical pickup point that holds the whole thing together. The Hub is where pros walk in for kits, equipment, training, and a place to belong. The Hub is where Sherpa Materials orders get staged the night before a job and dispatched in the morning. The Hub is the local community center for verified-licensed-trade work in its market. We opened Hub #1 in Atkinson, New Hampshire — colocated at HJD Builders' headquarters — as the proof point. Hub #1 is corporate-owned. Every other Hub from Hub #2 forward is built for franchise.
>
> Why franchise? Because the local market knowledge that makes a Hub work — knowing which landlord to negotiate with, which trade school to partner with, which supply house already sells to local pros, which town-hall politics affect zoning, which trade associations matter — is not the kind of knowledge you can airdrop into a market from corporate. It belongs to the operator on the ground. The franchise model is how Sherpa Pros respects that knowledge and pays for it directly. The franchisee writes the check, runs the Hub, owns the local relationships, and keeps the cash flow. Sherpa Pros corporate runs the platform, the brand, the technology, the national pro-recruiting funnel, and the national customer-acquisition funnel — and earns the royalty.
>
> If you are a working contractor, a former trade-supply-house owner, a former big-box pro-desk manager, or a former trade-association executive — and you have $200,000+ in liquid net worth and $185,000+ in cash to invest — you are exactly who I built this for. The application form is below. I read every inquiry personally for the first 25 franchisees. — Phyrom

---

## Section 7 — Inquiry Form

### Wireframe

```
+-------------------------------------------------+
|  Section eyebrow: APPLY                         |
|  Section headline (Fraunces italic, 48px):      |
|  "Tell us about you."                           |
|                                                 |
|  [8-field form, 2 fields per row on desktop]    |
|                                                 |
|  First Name [____________]  Last Name [_______] |
|  Email      [____________]  Phone     [_______] |
|  City of interest [______]  State [▼ dropdown ] |
|  Construction industry experience [▼ years ▼]   |
|  Liquid capital available [▼ ranges ▼]          |
|  Current role [▼ dropdown ▼]                    |
|  How did you hear about us [▼ dropdown ▼]       |
|  [Optional textarea] Anything else? [______]    |
|                                                 |
|  [Required checkbox] I acknowledge that the     |
|  Sherpa Pros franchise opportunity is governed  |
|  by the Federal Trade Commission Franchise Rule |
|  and applicable state franchise registration    |
|  laws. I understand that submission of this     |
|  inquiry does not constitute an offer or        |
|  acceptance of any franchise...                 |
|                                                 |
|  [PRIMARY CTA: sky blue button]                 |
|  Submit Inquiry                                 |
|                                                 |
|  Privacy: We use your information solely to     |
|  evaluate your franchise inquiry. We do not     |
|  sell or share your data. Read our privacy      |
|  policy →                                       |
+-------------------------------------------------+
```

### Form Fields (per FDD inquiry intake requirements)

| Field | Type | Required | Notes |
|---|---|---|---|
| First Name | Text | Yes | |
| Last Name | Text | Yes | |
| Email | Email | Yes | Validated; auto-response triggered |
| Phone | Phone (with country code) | Yes | E.164 format; for Discovery Call scheduling |
| City of interest | Text | Yes | Free-form for territory mapping |
| State of interest | Dropdown | Yes | Pre-filtered to allowed-sales states based on registration status (Phase 4 Year 1: NH/ME/MA/VT only initially) |
| Construction industry experience | Dropdown | Yes | < 5 years / 5–10 years / 10–15 years / 15+ years |
| Liquid capital available | Dropdown | Yes | < $100K (auto-disqualify with respectful response) / $100K–$200K (review) / $200K–$500K (proceed) / $500K+ (priority) |
| Current role | Dropdown | Yes | Licensed General Contractor / Trade-supply-house owner or manager / Big-box Pro-Desk leader / Property manager / Trade-association executive / Other (specify) |
| How did you hear about us | Dropdown | No | Referral / Conference / Search / Trade publication / Existing pro / Other |
| Anything else | Textarea | No | Open response |
| Acknowledgment checkbox | Checkbox | Yes | FTC + state franchise law acknowledgment |

### Copy — Submit Button

> Submit Inquiry

### Copy — Auto-Response Promise

> A Sherpa Pros team member will reach out within 2 business days to schedule your Discovery Call. Phyrom personally reads every inquiry for the first 25 franchisees.

### Copy — Privacy Footer

> We use your information solely to evaluate your franchise inquiry. We do not sell or share your data with third parties. Background and credit checks are run only after Stage 6 of the screening process and only with your written consent. Read our [Privacy Policy] and [Franchise Inquiry Terms].

---

## Section 8 — FAQ (15 Questions)

### Wireframe

Standard accordion. Each FAQ is a row that expands on click. First 3 expanded by default.

### FAQ Content

**Q1: What is the total cost to open a Sherpa Hub franchise?**
> $185,000 to $420,000 depending on Hub size, market real estate cost, and existing franchisee resources. The $45,000 Initial Franchise Fee is included in this range. The full breakdown is disclosed in Item 7 of the Franchise Disclosure Document.

**Q2: How much can I expect to earn?**
> Item 19 of the Franchise Disclosure Document discloses Year 1 through Year 5 revenue and Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) at three scenarios — Low (P25), Mid (P50), and High (P75). Mid-case franchisee pre-tax cash flow at Year 3 maturity is approximately $236,000. **Some outlets have earned this amount. Your individual results may differ. There is no assurance that you will earn as much.**

**Q3: What is the royalty rate?**
> 6% of gross revenue in Year 1, 8% in Year 2 and onward. Marketing Fund contribution is an additional 2% of gross revenue. Technology fee is a flat $200/month. Local marketing minimum is 1.5% of gross revenue (spent at the franchisee's discretion in approved channels).

**Q4: What is the protected territory?**
> 5-mile radius in major-metro markets, 15-mile radius in suburban markets, 30-mile radius in rural markets. Sherpa Pros LLC will not open another corporate-owned or franchise-owned Hub within your protected radius for the duration of your Franchise Agreement.

**Q5: How long is the initial term?**
> 10 years from Hub Grand Opening. One 10-year renewal term available, conditional on good standing, Brand Standards compliance, facility upgrade to then-current corporate specifications, and payment of the $15,000 renewal fee.

**Q6: How long does the application process take?**
> Typically 60–120 days from inquiry to signed Franchise Agreement, including the mandatory Federal Trade Commission 14-calendar-day waiting period after FDD delivery.

**Q7: Where can I open a Sherpa Hub?**
> Phase 4 Year 1: New Hampshire, Maine, Massachusetts, Vermont (non-registration states). Phase 4 Year 2: New York, Rhode Island, Maryland, Virginia (priority registration states). Phase 4 Year 3: remaining 10 registration states for full national coverage.

**Q8: Do I need construction-industry experience?**
> Yes. We require 5–15 years in construction-adjacent industries — licensed General Contractor, trade-supply-house operator, big-box pro-desk leader, multi-property property manager, or trade-association executive. Multi-unit franchise experience in unrelated categories does not substitute.

**Q9: Can I be an absentee owner?**
> No. Sherpa Pros does not permit absentee ownership in Phase 4 Years 1 through 3. Every Sherpa Hub franchisee is an operator — present at the Hub full-time during the first 24 months.

**Q10: What does the 80-hour initial training cover?**
> Hub operations, pro recruiting and onboarding, codes literacy, materials orchestration, customer service, compliance, marketing, and financial management. Delivered at Hub #1 in Atkinson, New Hampshire. You also receive 40 hours of on-site Hub-opening support during Weeks 1–2 of your operations.

**Q11: Do you offer financing?**
> Sherpa Pros LLC does not offer direct financing in Phase 4 Year 1. We are pursuing Small Business Administration (SBA) Approved Franchisor status by Phase 4 Year 2. We can introduce you to franchise-friendly lenders (BoeFly, ApplePie Capital, Live Oak Bank).

**Q12: What technology platform do I get?**
> The full Sherpa Pros stack — Sherpa codes engine (codes intelligence layer), Sherpa Materials engine, Dispatch matching algorithm, Sherpa Threads (in-app and Short Message Service messaging), Sherpa Smart Scan (optical character recognition), Sherpa Mobile (native iOS and Android), Sherpa Guard (Role-Based Access Control and audit logs), and the Hub-specific Point of Sale system.

**Q13: How does the materials margin share work?**
> Every materials line that flows through your Hub generates a per-line margin share. Hub buffer stock (you stock it, you fulfill it): 40% margin share. Hub staged plus Uber Direct (you receive, stage, dispatch): 25%. Hub staged plus pro pickup (you receive, stage, pro picks up — no Uber Direct cost): 35%. Supplier-direct (Hub not involved): 0%.

**Q14: Can I open more than one Hub?**
> Yes. Area Development Agreements are available for franchisees who commit to opening 3 Hubs over 5 years for a discounted $125,000 Initial Franchise Fee (versus $135,000 if purchased one-by-one). Existing franchisees also have Right of First Refusal on adjacent territories.

**Q15: What if my application is rejected?**
> We provide written feedback on the rejection rationale. The most common rejection reasons are: insufficient construction-industry experience, lifestyle-franchisee intent (absentee ownership plan), franchise litigation history, undisclosed material liabilities, or negative professional references. We may invite you to reapply after 12 months if circumstances change materially.

---

## Section 9 — Required FDD Disclosure Footer

### Wireframe

```
+-------------------------------------------------+
|  [Full-width dark-navy band, white type]        |
|                                                 |
|  REQUIRED LEGAL DISCLOSURE                      |
|                                                 |
|  This website does not constitute an offer to   |
|  sell a franchise. The offer of a franchise can |
|  only be made through the delivery of a         |
|  Franchise Disclosure Document. Certain states  |
|  require that we register the Franchise         |
|  Disclosure Document in those states. The       |
|  communications on this web site are not        |
|  directed by us to the residents of any of      |
|  those states. Moreover, we will not offer or   |
|  sell franchises in those states until we have  |
|  registered the franchise (or obtained an       |
|  applicable exemption from registration) and    |
|  delivered the Franchise Disclosure Document    |
|  to the prospective franchisee in compliance    |
|  with applicable law.                           |
|                                                 |
|  © 2026 Sherpa Pros LLC. All rights reserved.   |
|  Privacy Policy | Terms of Use | Sitemap        |
+-------------------------------------------------+
```

### Copy — Required Federal + State Disclosure Footer

> **REQUIRED LEGAL DISCLOSURE**
>
> This website does not constitute an offer to sell a franchise. The offer of a franchise can only be made through the delivery of a Franchise Disclosure Document. Certain states require that we register the Franchise Disclosure Document in those states. The communications on this website are not directed by us to the residents of any of those states. Moreover, we will not offer or sell franchises in those states until we have registered the franchise (or obtained an applicable exemption from registration) and delivered the Franchise Disclosure Document to the prospective franchisee in compliance with applicable law.
>
> Minnesota residents: MN Franchise Registration #_________ (placeholder — populate post-Minnesota registration in Phase 4 Year 3).
>
> New York residents: NY Franchise Registration #_________ (placeholder — populate post-New York registration in Phase 4 Year 2).
>
> California residents: CA Franchise Registration #_________ (placeholder — populate post-California registration in Phase 4 Year 3).
>
> © 2026 Sherpa Pros LLC. All rights reserved. [Privacy Policy] | [Terms of Use] | [Sitemap]

---

## 10. Designer Handoff Notes

### Typography (per `docs/operations/brand-portfolio.md`)

| Use | Font | Weight | Size Range |
|---|---|---|---|
| Section eyebrow | Manrope | 600 small caps | 12–14px / 0.18em letter-spacing |
| Section headline | Fraunces italic | 400 | 48–72px / -0.015em letter-spacing |
| Subhead | Manrope | 500 | 18–22px |
| Body | Manrope | 400 | 17–19px / 1.6 line-height |
| Stats / numbers | JetBrains Mono | 500 | 14–24px |
| CTA | Manrope | 600 | 16–18px |

### Color Tokens

| Use | Token | Hex |
|---|---|---|
| Primary CTA background | sky-blue | #00A9E0 |
| Primary CTA hover | sky-blue-dark | #0095C7 |
| Headline text | dark-navy | #1A1A2E |
| Body text | dark-navy-soft | #2A2A40 |
| Background (light editorial sections) | warm-cream | #FAF7F0 |
| Background (dark hero / footer) | dark-navy | #1A1A2E |
| Section rule above headline | sky-blue | #00A9E0 (3px high) |
| Required disclaimer box border | dark-navy | #1A1A2E (1px, dotted) |
| Required disclaimer box background | warm-cream | #FAF7F0 |

### Mobile Adaptations

- Hero stacks vertically; image moves below headline/CTA.
- 6-product portfolio + 8-platform-capability sections become single-column accordions.
- Item 19 charts stack vertically; bar charts become horizontal bars on mobile for readability.
- 7-stage timeline becomes vertical stack with connecting line on left edge.
- FAQ accordion remains accordion.
- Form fields stack to single column.

### Performance Budget

- Total page weight: < 1.2 MB
- Hero image: < 250 KB (WebP, lazy-loaded for below-fold versions)
- Founder portrait: < 180 KB
- Total HTTP requests: < 30
- Time to Interactive on mobile 4G: < 2.5 seconds
- Lighthouse Performance score: 90+
- Lighthouse Accessibility score: 100

### Required Pre-Launch Production Deliverables

1. Hero photograph — Hub #1 Atkinson NH exterior with branded sign
2. Founder portrait — Phyrom at HJD HQ in editorial style
3. 90-second walkthrough video (Phyrom voiceover, Hub #1 interior tour)
4. 6-product portfolio iconography (custom — match brand portfolio iconography)
5. 8-platform-capability iconography (custom)
6. Bar chart illustrations for Item 19 teaser (matched to brand color palette)
7. 7-stage timeline graphic (custom illustration matching editorial brand)
