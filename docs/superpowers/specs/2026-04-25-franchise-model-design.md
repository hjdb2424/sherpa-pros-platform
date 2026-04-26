# Sherpa Pros — Franchise Model Design Spec

**Date:** 2026-04-25
**Author:** Phyrom (via brainstorming with Claude)
**Status:** Approved — ready for implementation planning
**Phase:** 4+ infrastructure layer (Phase 3 = "franchise design begins"; Phase 4 = "10-20 Hubs via franchise model — Northeast corridor")
**Companion specs (parallel work):**
- International Expansion: `docs/superpowers/specs/2026-04-25-international-expansion-design.md`
- Platform Scale Architecture: `docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md`
- Sherpa Hub Integration: `docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md`
**Source dependencies:**
- `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` (§4.5 Phase 3, §4.6 Phase 4)
- `docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md` (the franchise unit's underlying physical + digital model)
- `docs/operations/sherpa-product-portfolio.md` (Phase 3 + Phase 4 entries reference franchise)
**Next:** `superpowers:writing-plans` companion plan at `docs/superpowers/plans/2026-04-25-franchise-model-plan.md`

---

## 1. Executive Summary

Sherpa Pros is a national licensed-trade marketplace with an international roadmap. Owning every physical pickup point — every Sherpa Hub — under one corporate balance sheet is capital-intensive: each Hub is a $185,000–$420,000 build-out (real estate, fit-out, equipment, opening inventory, licensing, soft costs). At the Phase 4 target of 10–20 Hubs along the Northeast corridor, that is $1.85–$8.4 million of capital tied up in real estate and fit-out before a single corporate dollar is spent on software, marketing, or pro recruiting at the network level. **Franchising solves the capital constraint, and it solves it well.** A franchisee writes a $45,000 initial check, qualifies for $140,000–$375,000 of personal-balance-sheet bank or Small Business Administration (SBA) financing, signs a ten-year operating commitment, brings deep local-market knowledge (the kind a corporate operator parachuting into Vermont or upstate New York cannot replicate cold), and pays Sherpa Pros 6–8 percent of gross revenue forever. Franchising converts a capital-intensive corporate Hub rollout into a **capital-light, royalty-stream rollout** — and the cash flywheel (initial fees fund the next round of Franchise Disclosure Document (FDD) work and master-franchisee acquisition; ongoing royalties fund corporate operations and software development) is the same cash flywheel McDonald's, Marriott, Anytime Fitness, and Servpro have all used to scale faster than any corporate-owned competitor in their categories.

**The franchise-able Sherpa unit is the Sherpa Hub** — the physical pickup point for licensed pros, originally designed in `docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md`. The Hub has a defined footprint (3,000 square feet baseline), a defined product mix (job kits, equipment rentals, training, branded gear), a defined revenue model (kit margin + rental utilization + training fees + Sherpa Materials orchestration commissions), a defined customer (the licensed pro within a 5–30 mile radius), and a defined operating playbook. **The pure-digital pieces of Sherpa Pros — Sherpa Marketplace, Sherpa Home, Sherpa Success Manager, Sherpa Rewards, Sherpa Flex — are NOT franchised.** Those remain corporate-owned national products; the Hub franchisee gets a protected territory in which to operate the Hub and earn the per-job pro-engagement bonus the platform pays Hubs for keeping their local pro network active. This split (digital national, physical local) keeps the two-sided marketplace economics intact (a franchisee cannot fragment the marketplace by going rogue on take-rate or matching) while giving local operators the unit they can profitably own.

---

## 2. Franchise Unit Definition

Three candidate franchise units were evaluated. The recommendation is **Option A (Sherpa Hub franchise) as the primary unit**, with Options B and C available as secondary entry paths.

### 2.1 Option A — Sherpa Hub Franchise (RECOMMENDED PRIMARY)

**What the franchisee owns:** one Sherpa Hub physical location (3,000 square feet baseline; 1,800 square feet warehouse + 600 square feet showroom + 600 square feet training facility) plus the protected pro-recruiting territory around it (5-mile radius in metro markets, 15-mile in suburban, 30-mile in rural — see §8 Territory Model).

**What the franchisee runs:** the Hub physical operations — kit assembly, equipment rentals, training events, branded gear retail, walk-in pro support, local pro recruiting and onboarding, local pro-engagement programming, local marketing co-op spend.

**What the franchisee does NOT run:** the Sherpa Marketplace platform (corporate), pricing decisions on platform take-rate (corporate), the Sherpa Score algorithm (corporate), the codes intelligence layer (corporate, internally referred to as the Sherpa codes engine), the Sherpa Materials orchestration (corporate), the Dispatch matching algorithm (corporate), the customer support escalation tier (corporate), the brand creative (corporate, with regional co-op), or the financial flow (corporate Stripe Connect — the franchisee receives a per-job pro-engagement royalty plus all Hub-direct revenue).

**Why this is the right primary unit:** the Hub is a self-contained physical-business unit with a defined footprint, a defined product mix, defined economics, and a defined operating playbook (already designed in the 2026-04-15 Hub model spec). It is the only Sherpa Pros component that has a physical premises a local operator can profitably own and run. It is also the only component where local-market knowledge (which landlord to negotiate with, which trade school to partner with, which supply house already sells to local pros, which town-hall politics affect zoning, which trade associations matter) creates real economic advantage over a corporate operator.

**Initial investment range:** $185,000–$420,000 (see §5 Item 7).

### 2.2 Option B — Sherpa Pro Network Franchise (SECONDARY)

**What the franchisee owns:** an exclusive metro license to recruit, onboard, and manage the Sherpa Pros pro roster within a defined territory — but **no physical Hub**. Digital-only franchise.

**What the franchisee runs:** local pro recruiting events, local trade-show presence, local pro retention activities, local pro-side customer support escalation, local marketing co-op spend.

**Why offer it as secondary:** lower-cost entry for an operator who has the local-recruiting connections (former trade-association executive, former big-box pro-desk manager, former trade-supply-house owner) but does not have the capital or appetite for a $185,000+ physical buildout. Useful in Phase 4 cities where the local market does not yet support the Hub volume but the pro density is real.

**Initial investment range:** $45,000–$95,000 (no real estate, no inventory, no fit-out — just the territory rights, the training, the technology access fee, and 12–24 months of operating capital).

**Initial franchise fee:** $25,000.

**Royalty:** 4 percent of gross marketplace revenue generated within the territory (lower than Hub franchise because the franchisee captures less of the value chain).

**Risk:** without a physical Hub, the franchisee has fewer levers to differentiate locally — they cannot host training events that attract pros, they cannot stage materials for same-day pickup, they cannot provide a physical place for a pro to walk in and ask a question. The retention rate of franchise-recruited pros is empirically lower in digital-only territories (industry comparable: ServiceMaster ServiceMaster Restore digital-only franchisees retain technicians at roughly 60 percent the rate of franchisees who run a physical depot). Useful as a stepping stone — a Pro Network franchisee who hits revenue targets gets right-of-first-refusal to convert to a Hub franchise within 24 months by paying the difference in initial fees.

### 2.3 Option C — Sherpa Metro Master (TERTIARY)

**What the franchisee owns:** an entire Metropolitan Statistical Area (MSA) — for example, the Greater Boston Combined Statistical Area, the Greater New York City Metro, Greater Philadelphia. The Master Franchisee operates a flagship Hub themselves and sub-franchises additional Hubs to qualified sub-franchisees within their MSA.

**What the Master Franchisee runs:** the flagship Hub (full Hub franchise responsibilities), sub-franchisee recruiting and screening within the MSA, sub-franchisee onboarding and training, sub-franchisee performance management, MSA-level marketing strategy, MSA-level pro-recruiting programs.

**What the Master Franchisee does NOT run:** any of the corporate-owned digital pieces, FDD compliance (Sherpa Pros corporate retains all FDD obligations to sub-franchisees), Sherpa Score, codes engine, etc.

**Why offer it as tertiary:** for very-high-capital operators (typically a former multi-unit franchise operator from another category — Anytime Fitness, Servpro, RestorePro, FastFrame multi-unit owners, or a private-equity-backed franchise consolidator) who want to own an entire metro and accept the operational complexity of running a flagship + recruiting and managing sub-franchisees.

**Initial investment range:** $750,000–$2,400,000 depending on metro size, sub-franchise count target, and flagship Hub buildout cost.

**Initial Master Franchise Fee:** $300,000 (covers MSA exclusivity, Master Franchisee training, sub-franchisee recruiting playbook, dedicated Sherpa Pros corporate liaison).

**Master Franchisee revenue share:** the Master Franchisee splits the 6–8 percent Hub royalty with corporate (recommended split: Master Franchisee 30 percent / corporate 70 percent on sub-franchise royalties) plus collects the full flagship Hub revenue.

### 2.4 International Master Franchisee Overlay

For international rollout (deferred to the international-expansion spec for full detail), the model is **one Master Franchisee per country** — the international equivalent of Option C above, with country-wide rather than metro-wide exclusivity. Master Franchisee assumes country-level FDD-equivalent compliance (Canada provincial Franchise Acts, United Kingdom British Franchise Association (BFA) voluntary code, Australian Franchising Code of Conduct mandatory, European Union member-state-level franchise law). See §13 below for the international franchising overlay summary; see the international-expansion spec for full country-by-country regulatory mapping.

### 2.5 Recommended Phase 4 Unit Mix

- **Years 1–2 of Phase 4:** Sherpa Hub franchise only (Option A). Five to seven Hubs sold in Northeast non-registration states (New Hampshire, Maine, Massachusetts, Vermont). Goal: prove the Hub franchise economics with five to seven units before opening Pro Network or Metro Master tracks.
- **Year 3 of Phase 4:** add Pro Network franchise (Option B) for outer-Northeast cities that do not yet support Hub economics but have pro density (Burlington Vermont, Bangor Maine, Western Massachusetts, Albany New York).
- **Years 4+ of Phase 4 / entering Phase 5:** offer Metro Master (Option C) for Greater Boston, Greater New York City, Greater Philadelphia, Greater Washington DC.
- **Phase 5+:** International Master Franchisee for Canada, then UK, then Australia (defer to international-expansion spec).

---

## 3. Federal Trade Commission (FTC) Franchise Rule + State Registration Mapping

### 3.1 Federal layer (the FTC Franchise Rule)

The FTC Franchise Rule (16 Code of Federal Regulations Part 436) governs every franchise sale in the United States. The rule requires the franchisor to deliver a Franchise Disclosure Document (FDD) to every prospective franchisee at least **fourteen calendar days** before the prospect signs any binding agreement or pays any money. The FDD is a 23-Item disclosure document (see §4 below). The FTC does not register or pre-approve FDDs — the FTC enforces the disclosure requirement.

### 3.2 State registration layer (the 14 registration states + 4 business-opportunity states)

Fourteen states require pre-sale registration of the FDD with the state regulator before any franchise may be sold to a resident of that state. An additional four states require business-opportunity registration (a lighter-touch filing that may apply depending on whether the offering meets the state's business-opportunity definition). One state (Florida) requires only a notice filing (called "Annual Business Opportunity Filing"), and one (Indiana) is a registration state but with a streamlined process.

**Fourteen FDD-registration states:**

| State | Filing Fee (initial) | Renewal Fee | Renewal Cadence | Notes |
|---|---|---|---|---|
| California | $675 | $450 | Annual | California Department of Financial Protection and Innovation; reviewer comments common |
| Hawaii | $250 | $250 | Annual | Hawaii Department of Commerce and Consumer Affairs |
| Illinois | $500 | $100 | Annual | Illinois Attorney General |
| Indiana | $500 | $250 | Annual | Indiana Securities Division; streamlined review |
| Maryland | $500 | $100 | Annual | Maryland Securities Division |
| Michigan | $250 (notice) | $250 | Annual | Notice filing — lighter than full registration |
| Minnesota | $400 | $200 | Annual | Minnesota Department of Commerce |
| New York | $750 | $150 | Annual | New York Attorney General; reviewer comments common |
| North Dakota | $250 | $100 | Annual | North Dakota Securities Department |
| Rhode Island | $500 | $250 | Annual | Rhode Island Department of Business Regulation |
| South Dakota | $250 | $250 | Annual | South Dakota Division of Insurance |
| Virginia | $500 | $250 | Annual | Virginia State Corporation Commission |
| Washington | $600 | $100 | Annual | Washington Department of Financial Institutions |
| Wisconsin | $400 | $400 | Annual | Wisconsin Department of Financial Institutions |

**Four business-opportunity states (may apply depending on offering structure):**

| State | Filing Fee (initial) | Renewal | Notes |
|---|---|---|---|
| Connecticut | $400 | Annual | Business-opportunity statute — Sherpa Hub franchise likely qualifies for franchise exemption |
| Florida | $100 (notice) | Annual | Business-opportunity notice filing only |
| Kentucky | $0 | N/A | One-time notice |
| Nebraska | $100 | Annual | Business-opportunity statute |
| Texas | $0 | One-time | Texas Business Opportunity Act notice |
| Utah | $100 | Annual | Utah Business Opportunity Disclosure Act |

(The user-provided list mixed registration and business-opportunity states; the breakdown above reflects current 2026 regulatory state.)

**Recommended phasing:**

1. **Phase 4 Year 1 launch:** sell franchises only in non-registration states — New Hampshire (corporate Hub #1 home state), Maine, Massachusetts, Vermont, New Jersey, Pennsylvania, Ohio, Tennessee, North Carolina, Georgia, Florida (notice-only), Texas (notice-only). This avoids the $20,000–$45,000 of state-by-state registration costs and 90-day-plus state review delays during the franchise program's earliest stage.
2. **Phase 4 Year 2:** file in the four most-strategic registration states — New York (essential — Northeast metro density), Rhode Island (essential — Northeast contiguity), Maryland (Mid-Atlantic gateway), Virginia (Mid-Atlantic gateway).
3. **Phase 4 Year 3:** file in the remaining ten registration states for full national coverage. Total estimated registration cost across all 14 registration states: $5,825 in initial filing fees + $20,000–$30,000 in attorney fees per state for the first filing + $2,800 in annual renewal fees.

### 3.3 State-level franchise relationship laws (separate from registration)

Twenty-three states have franchise relationship laws governing termination, non-renewal, and transfer of franchises (different from registration laws). These apply whether or not the state requires FDD registration. The FDD's Item 17 (Renewal, Termination, Transfer, Dispute Resolution) must comply with each state's relationship law for franchisees domiciled in that state. Franchise attorney engagement (see WS1 in the companion plan) covers state-by-state compliance review.

---

## 4. Franchise Disclosure Document (FDD) Design — All 23 Required Items

The FDD is the single most important regulatory document the franchisor produces. Federal law requires all 23 Items in the FTC-defined order; each Item has prescribed content. The summary below specifies the Sherpa Pros approach Item by Item. Full FDD drafting is a 90-to-180-day project led by a qualified franchise attorney (see WS1 in the companion plan); this section is the strategic content brief the attorney is given.

### Item 1 — The Franchisor and any Parents, Predecessors, and Affiliates

Sherpa Pros LLC (the franchisor entity), incorporated in Delaware, principal office at HJD Builders headquarters in Atkinson NH (until Phase 4 corporate office relocation). Affiliates: HJD Builders LLC (predecessor in interest — Phyrom's working general contracting business that originated the marketplace need). No parent company. Disclose that the franchisor and its affiliates engage in licensed-trade contracting; explain why this is a competitive advantage (founder-built, contractor-empathetic) rather than a competitive conflict (corporate-owned Hubs serve the franchise system, not the contracting business).

### Item 2 — Business Experience

Lead biography: Phyrom (founder, Chief Executive Officer; surname omitted in this internal spec — to be completed by Phyrom for the actual FDD). Founded HJD Builders LLC in New Hampshire; built Sherpa Pros as a working general contractor. List every executive officer, director, and franchise broker with five-year work history. Each Phase 4 executive hire (Chief Operating Officer, Chief Financial Officer, Vice President of Franchise Development, Vice President of Operations) gets a full five-year biography. Anyone with a franchise-industry violation in the past ten years must be disclosed.

### Item 3 — Litigation

Disclose every pending or concluded litigation matter involving the franchisor, its affiliates, or its executives in the past ten years. Material categories: franchise litigation, securities violations, fraud, racketeering, intellectual property infringement. Sherpa Pros target state at FDD launch: zero disclosable litigation. Hub #1 corporate operations must be litigation-free; HJD Builders contracting-business litigation must be reviewed for materiality — if any single matter exceeds $50,000 in claimed damages or involves alleged fraud, it likely requires disclosure even though it predates the franchise system.

### Item 4 — Bankruptcy

Ten-year lookback on the franchisor, its affiliates, and any executive officer or director. Sherpa Pros target: zero disclosable bankruptcies.

### Item 5 — Initial Fees

Initial Franchise Fee: **$45,000** for a single Sherpa Hub franchise; **$125,000** for an Area Development Agreement covering three Hubs to open over five years; **$300,000** for a Metro Master franchise. Recommended Pro Network franchise initial fee: **$25,000**. International Master Franchise: **$500,000–$2,000,000** (country-size dependent — see international-expansion spec).

### Item 6 — Other Fees

| Fee | Amount | Frequency | Notes |
|---|---|---|---|
| Royalty | 6 percent of gross revenue (Years 1) / 8 percent (Year 2+) | Monthly | Lower Year 1 as ramp incentive |
| Marketing Fund Contribution | 2 percent of gross revenue | Monthly | National + regional brand campaigns; some used for franchise-system lead generation |
| Technology Fee | $200 | Monthly | Platform access, Sherpa codes engine, Sherpa Materials engine, Dispatch, Sherpa Smart Scan, Sherpa Threads, Sherpa Mobile |
| Franchise Renewal Fee | $15,000 | Per renewal | 10-year initial term, 10-year renewal |
| Transfer Fee | $7,500 | Per transfer | When franchisee sells |
| Audit Fee | Cost of audit | If audit reveals underreporting >2 percent | Standard franchise term |
| Training Fee (additional staff) | $2,500 per attendee | As incurred | Initial training of franchisee + manager included; additional staff fee |
| Annual Convention Fee | $1,500 | Annual | Mandatory franchisee summit |
| Local Marketing Minimum | 1.5 percent of gross revenue | Monthly | Spend at franchisee's discretion in approved channels; verified via reporting |

### Item 7 — Estimated Initial Investment

Total range: **$185,000 (low) to $420,000 (high)** depending on Hub size, market real estate cost, and existing franchisee resources.

| Line Item | Low | High | Notes |
|---|---|---|---|
| Initial Franchise Fee | $45,000 | $45,000 | Fixed |
| Real Estate (security deposit + first 3 months rent) | $18,000 | $72,000 | $6 per square foot rural to $24 per square foot major metro |
| Leasehold Improvements / Fit-out | $45,000 | $135,000 | Warehouse racking, showroom, training facility, office |
| Equipment (Point of Sale, computers, security) | $12,000 | $24,000 | Standard Hub kit |
| Initial Inventory (kits + retail gear) | $35,000 | $65,000 | Standard kit catalog + branded apparel + consumables |
| Equipment Rental Inventory (initial fleet) | $0 | $40,000 | Optional — can defer to Year 2 |
| Branded Signage | $4,500 | $12,000 | Exterior + interior |
| Insurance (3 months prepaid) | $2,500 | $4,500 | General liability, property, workers' comp |
| Permits + Licenses | $1,500 | $4,500 | Local zoning, business license, sales tax |
| Initial Marketing (grand opening) | $7,500 | $15,000 | Launch campaign required by franchise standards |
| Training Travel + Lodging | $3,500 | $5,500 | Travel to Hub #1 in Atkinson NH for initial training |
| Working Capital (3 months operating expenses) | $10,000 | $20,000 | Conservative cushion |
| **Total** | **$185,000** | **$442,500** | Round up to $185,000–$420,000 disclosed range |

### Item 8 — Restrictions on Sources of Products and Services

The franchisee is required to source materials through Sherpa Materials orchestration (the platform's materials engine) for all kit assembly inventory. Approved supplier list includes the Sherpa Pros corporate national accounts (FW Webb partnership for plumbing supply, Wurth Louis and Company for hardware, Best Tile for tile, others). Branded gear must be sourced through the corporate-approved vendor. Franchisees may source non-branded ancillary inventory (snacks, coffee, branded-water) from any vendor. **Disclosure required:** Sherpa Pros LLC may receive a rebate, override commission, or other payment from approved suppliers; estimated material rebate income to franchisor: approximately 2–4 percent of franchisee inventory purchases through approved suppliers, which the franchisor uses to subsidize technology development that benefits all franchisees.

### Item 9 — Franchisee's Obligations

Cross-reference table summarizing every obligation of the franchisee throughout the FDD. Major obligation categories:
- Site selection and approval
- Lease execution
- Hub buildout to corporate specifications
- Initial training completion (80-hour Hub HQ training plus 40-hour on-site Hub-opening support)
- Ongoing operations standards compliance (Sherpa Brand Standards Manual)
- Brand compliance (signage, uniforms, customer touchpoints)
- Software adoption (Sherpa codes engine, Sherpa Materials, Dispatch, Sherpa Threads, Sherpa Smart Scan, Sherpa Mobile)
- Franchisee or designated manager full-time on-site (Item 15)
- Royalty + Marketing Fund + Technology Fee timely payment
- Local marketing minimum spend
- Insurance maintenance
- Annual convention attendance
- Records and reporting (monthly Profit and Loss statement to corporate within 15 days of month-end)

### Item 10 — Financing

Sherpa Pros LLC does **not** offer direct financing in Phase 4 Year 1. Disclose the franchisor's plan to pursue Small Business Administration (SBA) Approved Franchisor status by Phase 4 Year 2 (which streamlines SBA 7(a) loans to qualified franchisees). Disclose third-party financing introductions to franchise-friendly lenders (BoeFly, ApplePie Capital, Live Oak Bank); explicitly disclose any referral fee Sherpa Pros receives (initially zero — no referral arrangements to start).

### Item 11 — Franchisor's Assistance, Advertising, Computer Systems, and Training

**Pre-opening assistance:**
- Site selection criteria + market data + landlord negotiation guidance
- Hub layout architectural plans (3,000 square foot template + 4,500 square foot expansion template)
- Equipment manifest + vendor list
- Initial inventory order through Sherpa Materials
- Initial pro recruiting playbook

**Opening assistance:**
- 80-hour initial training at Hub #1 in Atkinson NH (Phase 4 Year 1; later moves to dedicated Sherpa University facility)
- 40-hour on-site Hub-opening support (corporate trainer on-site for the first 2 weeks of operations)
- Grand-opening marketing co-funding (50 percent corporate / 50 percent franchisee, capped at $7,500 corporate contribution)

**Ongoing assistance:**
- Monthly Performance Review with regional Vice President of Operations
- Quarterly Business Review (in-person or video; revenue, profitability, pro-recruiting metrics, customer-satisfaction metrics)
- Annual Franchisee Summit (3 days at corporate office or rotating franchise market)
- 24/7 platform support
- Brand Standards Manual updates
- Marketing campaign templates (regional + national)
- Pro recruiting playbook updates
- Compliance monitoring (Item 17 violations addressed within written cure-period framework)

**Computer systems / technology:**
- Sherpa codes engine access (the codes intelligence layer — internally referred to as the codes engine; never exposed externally as "Wiseman")
- Sherpa Materials engine access (materials orchestration; internally Wiseman Materials, externally Sherpa Materials or Smart Materials)
- Dispatch matching system access
- Sherpa Threads (in-app + Short Message Service messaging)
- Sherpa Smart Scan (Optical Character Recognition for documents, photos, receipts)
- Sherpa Mobile (native iOS + Android)
- Sherpa Guard (Role-Based Access Control + audit logs)
- Hub-specific Point of Sale system (corporate-licensed, integrated with Sherpa Materials)
- Required hardware: 2 desktop computers, 1 tablet, 2 barcode scanners, 1 receipt printer, security camera system

**Training:**
- Initial: 80 hours at Hub #1 / Sherpa University; topics include platform operations, Hub operations, pro recruiting and onboarding, codes literacy, materials orchestration, customer service, compliance, marketing, financial management
- Ongoing: 8 quarterly online courses (2 hours each), annual summit (24 contact hours), regional ride-alongs (4 per year)

### Item 12 — Territory

Each Sherpa Hub franchise gets a **protected territory** within which Sherpa Pros LLC will not open another corporate-owned or franchise-owned Hub. Territory radius:
- **Major metro** (population density > 5,000 per square mile, e.g., New York City, Boston): 5-mile protected radius
- **Suburban** (1,500–5,000 per square mile, e.g., suburbs of Boston, Manchester NH metro): 15-mile protected radius
- **Rural** (< 1,500 per square mile, e.g., Vermont, rural Maine): 30-mile protected radius

**Non-exclusive overlap zones** beyond the protected radius — Sherpa Pros corporate retains the right to operate the digital Marketplace, Home, Manager, Rewards, and Flex products in any geography (no franchisee can claim exclusivity over digital products). Pros and clients in overlap zones may freely transact on the platform regardless of which franchisee's territory they fall into.

**Right of First Refusal (ROFR)** on adjacent territories — when Sherpa Pros is preparing to award an adjacent territory, the existing franchisee gets 30 days to match any qualified prospect's offer. Encourages franchisee growth into Area Development Agreements over time.

**International Master Franchisee** gets country-wide exclusivity (see §13).

### Item 13 — Trademarks

Disclose registered trademarks and pending applications:
- "Sherpa Pros" (wordmark) — U.S. Patent and Trademark Office (USPTO) application pending
- "Sherpa Hub" (wordmark) — USPTO application pending
- Sherpa Pros logo — USPTO application pending
- "Old-House Verified" certification mark — USPTO application pending
- "Sherpa Marketplace," "Sherpa Home," "Sherpa Success Manager," "Sherpa Rewards," "Sherpa Flex," "Sherpa Threads," "Sherpa Smart Scan," "Sherpa Mobile," "Sherpa Guard," "Sherpa Dispatch," "Sherpa Materials" — USPTO applications pending or planned
- Disclose any opposition or cancellation proceedings (target: zero)
- Disclose insurance coverage for trademark infringement claims defense

### Item 14 — Patents, Copyrights, and Proprietary Information

Disclose:
- The codes intelligence layer (internally referred to as the Sherpa codes engine) — proprietary trade secret; the engine ingests national, state, and municipal building codes and produces code-aware quotes and dispatch matches. Source code, training data, and matching logic are confidential.
- The Sherpa Materials engine — proprietary materials orchestration; Application Programming Interface (API) integrations with Zinc, Uber Direct, supplier catalogs.
- Dispatch matching algorithm — proprietary trade secret; 7-factor scoring (license, certification, geography, availability, Sherpa Score tier, specialty match, customer history).
- Sherpa Score algorithm — proprietary trade secret; multi-factor pro reputation score (job completion rate, on-time arrival, customer rating, code-compliance violation rate, photo upload completion, dispute rate).
- Sherpa Brand Standards Manual — copyrighted; franchisee receives license to use in operating the Hub.
- Sherpa Operations Manual — copyrighted; franchisee receives license.
- Pending patent applications: matching algorithm patent (filed Phase 3); materials orchestration patent (planned Phase 4 Year 1).

### Item 15 — Obligation to Participate in the Actual Operation of the Franchise Business

The franchisee or a designated full-time manager must be on-site at the Hub during operating hours. Sherpa Pros does **not** permit absentee ownership in Phase 4 Years 1–3 — every Hub franchisee is an operator. Master Franchisees (Option C) may delegate the flagship Hub day-to-day operation to a full-time manager but must devote full-time effort to the MSA Master Franchisee responsibilities. Disclose: "lifestyle franchisees" who intend to delegate operations to a hired manager from day one are not approved.

### Item 16 — Restrictions on What the Franchisee May Sell

Franchisee may sell only Sherpa-branded services, Sherpa-approved kit catalog inventory, Sherpa-approved equipment rentals, Sherpa-approved branded gear, and Sherpa-approved training programs. Franchisee may not operate any competing licensed-trade marketplace, competing job-kit assembly business, competing equipment rental, or competing trade-training facility within the protected territory or for two years after termination within the same territory.

### Item 17 — Renewal, Termination, Transfer, and Dispute Resolution

**Initial term:** 10 years from Hub opening date.
**Renewal:** one 10-year renewal term, conditional on (a) good standing, (b) Brand Standards compliance, (c) facility upgrade to then-current corporate specifications, (d) payment of $15,000 renewal fee.
**Termination by franchisor for cause:** insolvency, material default not cured within 30 days written notice, repeated minor defaults, fraud, criminal conviction, abandonment.
**Termination by franchisee:** 90 days written notice; transfer fee waived if assigning to qualified buyer.
**Transfer:** franchisor approval required; franchisor right of first refusal; $7,500 transfer fee; new franchisee must meet then-current qualification standards.
**Dispute Resolution:** mandatory mediation in Boston MA; if mediation fails, binding arbitration under American Arbitration Association (AAA) Commercial Arbitration Rules; venue Boston MA. State-specific franchise relationship laws may override (e.g., New Jersey, California, Minnesota mandate state-court venue for franchisees domiciled in those states).

### Item 18 — Public Figures

None initially. If Sherpa Pros engages a celebrity contractor endorser in Phase 4+ (e.g., a national HGTV-personality partnership), disclosure is required.

### Item 19 — Financial Performance Representations

See §5 below. This is the single most important Item for prospective franchisee decision-making.

### Item 20 — Outlets and Franchisee Information

Tables disclosing: (a) number of franchised outlets at year-end for each of the last three years, (b) projected openings, (c) franchisee transfers, terminations, non-renewals, reacquisitions, ceased-operations. List every current franchisee with contact information (the prospect's right to contact existing franchisees is core to FTC due-diligence intent). For Year 1, this table will be sparse — Hub #1 (Atkinson NH, corporate-owned) and the first 1–3 sold franchises.

### Item 21 — Financial Statements

Audited financial statements of Sherpa Pros LLC for the most recent three fiscal years (or fewer if franchisor has been in business < 3 years; Sherpa Pros LLC will likely have 1–2 audited years at FDD launch). Audited by an independent Certified Public Accountant (CPA) firm. **Cost: $35,000–$60,000 per year for first 3 years of audited financials.**

### Item 22 — Contracts

Sample contracts attached as exhibits:
- Sherpa Hub Franchise Agreement (10-year initial term)
- Area Development Agreement (3 Hubs over 5 years)
- Sherpa Pro Network Franchise Agreement
- Metro Master Franchise Agreement
- Sherpa Hub Site Selection Addendum
- Sherpa Hub Lease Rider (corporate-required lease language for landlord)
- Sherpa Brand License Agreement
- Sherpa Software License Agreement
- Confidentiality Agreement
- Personal Guaranty Agreement (franchisee principal personally guarantees franchise obligations)

### Item 23 — Receipts

Two tear-out receipt pages: (a) prospective franchisee acknowledges receipt of FDD on a specific date (triggers the 14-day waiting period), (b) prospective franchisee acknowledges receipt of any state-required addenda. Franchisor must retain executed receipts for at least three years.

---

## 5. Item 19 Financial Performance Representations (Per-Hub Economics)

Item 19 is **optional** under the FTC Franchise Rule — but franchisors that omit it from their FDD are at a major sales disadvantage because prospective franchisees cannot make any earnings claim due-diligence. Sherpa Pros will include Item 19 from FDD Version 1.0. The Item 19 disclosure must be substantiated by historical financial data; Hub #1 (Atkinson NH, corporate-owned, opening Phase 1) will provide the substantiation base for Year 1 of Item 19. Subsequent Hubs add to the data set.

### 5.1 Per-Hub Annual Gross Revenue (target ranges)

| Year | Low | Mid | High | Source |
|---|---|---|---|---|
| Year 1 (ramp) | $385,000 | $580,000 | $740,000 | Hub #1 actual + comparable industry data |
| Year 2 | $720,000 | $1,050,000 | $1,400,000 | Comparable franchisee build-up curve |
| Year 3 (mature) | $850,000 | $1,250,000 | $1,650,000 | Comparable mature-Hub franchise data |

Revenue mix at maturity (Year 3 target):
- Job kit sales: 38 percent
- Equipment rentals: 12 percent
- Training fees: 6 percent
- Branded gear retail: 4 percent
- Per-pro engagement royalty (paid by Sherpa Pros corporate to the Hub for active local pros): 24 percent
- Sherpa Materials orchestration commission (paid by corporate to the Hub for materials orders dispatched through the Hub): 16 percent

### 5.2 Cost of Goods Sold (COGS) Breakdown

| Line | Percent of Revenue | Notes |
|---|---|---|
| Kit inventory | 28 percent | Sherpa Materials + corporate accounts get 18–24 percent below retail wholesale |
| Equipment rental depreciation + maintenance | 4 percent | 60 percent target utilization |
| Training program direct costs (instructor, materials) | 2 percent | Most training co-sponsored with vendors (free or low-fee) |
| Branded gear COGS | 2 percent | High-margin retail |
| **Total COGS** | **36 percent** | |

### 5.3 Operating Expense Breakdown

| Line | Percent of Revenue | Notes |
|---|---|---|
| Rent | 8 percent | Real estate + Common Area Maintenance |
| Wages (1 manager + 2 part-time staff) | 18 percent | Manager $52,000 base + commission; PT staff $18 per hour |
| Utilities | 1.5 percent | Electric, gas, water, internet |
| Insurance | 1.2 percent | General liability, property, workers' comp |
| Royalty (corporate) | 8 percent | At Year 2+ rate |
| Marketing Fund (corporate) | 2 percent | |
| Local Marketing | 1.5 percent | Required minimum |
| Technology Fee | 0.3 percent | $200/month flat |
| Repairs + Maintenance | 0.8 percent | |
| Professional Fees (accounting, legal) | 0.5 percent | |
| Other (office, supplies, training travel, etc.) | 1.0 percent | |
| **Total Operating Expenses** | **42.8 percent** | |

### 5.4 Earnings Before Interest, Taxes, Depreciation, Amortization (EBITDA) Per Hub

| Year | Revenue (Mid) | COGS (36%) | OpEx (42.8%) | EBITDA | EBITDA Margin |
|---|---|---|---|---|---|
| Year 1 | $580,000 | $208,800 | $248,240 | $122,960 | 21.2 percent |
| Year 2 | $1,050,000 | $378,000 | $449,400 | $222,600 | 21.2 percent |
| Year 3 | $1,250,000 | $450,000 | $535,000 | $265,000 | 21.2 percent |

**EBITDA target band for Item 19 disclosure:** 18–25 percent at maturity.

### 5.5 Time to Breakeven

**Target: 14–22 months** from Hub opening to monthly cash-flow positive operations. Driven primarily by pro-recruiting velocity (the per-pro engagement royalty becomes the most consistent revenue line by Month 9–12) and ramp of equipment rental utilization (slowest line to mature; typically not at 60 percent utilization until Month 12–18).

### 5.6 Net Profit to Franchisee at Maturity

After EBITDA, the franchisee owes:
- Debt service on initial-investment loan (estimated $185,000 SBA 7(a) loan at 9 percent for 10 years = $28,200/year)
- Personal income tax (varies)

**Franchisee's pre-personal-tax annual cash flow at maturity (Year 3+):**
- Mid-case: $265,000 EBITDA − $28,200 debt service = $236,800
- Low-case: $185,000 EBITDA − $28,200 debt service = $156,800
- High-case: $345,000 EBITDA − $28,200 debt service = $316,800

This compares favorably to the comparable home-services franchise category (Servpro, Mr. Handyman, Five Star Painting all average $135,000–$245,000 franchisee cash flow at maturity), because the Sherpa Hub captures both retail Hub revenue AND a per-pro-and-per-job royalty share from the corporate-owned digital marketplace.

### 5.7 Royalty + Marketing Fund + Technology Fee Burden

At Year 2+ rates: 8 percent royalty + 2 percent marketing fund + $200/month technology fee = approximately **10.3 percent of gross revenue** to corporate. This is on the low end of the home-services franchise category (Servpro 10 percent, Five Star Painting 6 percent, Mr. Handyman 7 percent + 2 percent marketing). Sherpa Pros' justification for the rate: the franchisee receives the entire technology stack (codes engine, materials engine, Dispatch, Threads, Smart Scan, Mobile, Guard) plus the platform's national pro-recruiting funnel plus the platform's national customer-acquisition funnel — substantially more software value per royalty dollar than competing home-services franchises.

### 5.8 Hub #1 Atkinson NH as the Substantiation Reference

Hub #1 is corporate-owned (Phase 1). It opens approximately mid-Phase 1 (target Quarter 3 of 2026). By Phase 3 (when franchise design begins), Hub #1 will have 12–18 months of operating data; by Phase 4 Year 1 (when franchise sales begin), 18–30 months. This is the empirical foundation for every Item 19 number above. Subsequent Hubs (corporate-owned in launch markets, franchised in Phase 4 outer markets) add to the data set; by Phase 4 Year 3, Item 19 should be substantiated by 5–7 Hubs of operating data and the disclosure can move from "single-Hub reference + industry comparable" to "multi-Hub blended average."

---

## 6. Franchisee Profile + Qualification Matrix + Screening Process

### 6.1 Ideal Franchisee Profile

- **Industry experience:** 5–15 years in construction-adjacent industries. Strongest profiles: licensed General Contractor with 10+ years of business operating experience; ex-trade-supply-house owner (Carrier, FW Webb, Ferguson, ABC Supply branch managers); ex-Big-Box pro-desk manager (Home Depot Pro, Lowe's Pro Services); ex-property-manager with multi-property portfolio operations experience; ex-trade-association executive director.
- **Net worth:** $200,000+ liquid (cash + marketable securities not encumbered by other obligations); $400,000+ total net worth.
- **Cash to invest:** $185,000+ available for the franchise investment (covers Year 1 low-case Initial Investment if no debt financing; covers SBA 7(a) down payment requirement if leveraged).
- **Community connections:** active in local trade associations, local chambers of commerce, local building-industry circles. Reference checks include a minimum of three local-market professional references.
- **Operator mindset:** prepared to be on-site at the Hub full-time for at least the first 24 months (Item 15 obligation).
- **Brand alignment:** values verified-licensed-trade quality over scale-at-any-cost growth; understands the contractor-centered positioning; will not undermine national brand standards for short-term local gain.
- **Financial sophistication:** can read a Profit and Loss statement, can manage to a cash-flow forecast, can interact constructively with a corporate compliance team.

### 6.2 Disqualification Criteria (Reject)

- Any franchise litigation history (plaintiff or defendant).
- Personal bankruptcy in the last 7 years.
- No construction-adjacent experience (the platform is specialized; an Anytime-Fitness multi-unit operator with zero construction context is reject).
- Lifestyle franchisee intent (must be operator, not absentee owner — see Item 15).
- Currently operating a competing licensed-trade marketplace, equipment rental business, or job-kit business (conflict of interest).
- Felony conviction in the last 10 years (case-by-case; certain non-violent financial crimes outside 10-year window may be reviewed).
- Failed credit check or undisclosed material liabilities.
- Negative reference from any of three required professional references.

### 6.3 Seven-Stage Screening Process

1. **Inquiry** — prospect submits Franchise Inquiry Form on `franchise.thesherpapros.com`. Auto-response with FDD Frequently Asked Questions (FAQ) and Discovery Day calendar.
2. **Discovery Call** (45 minutes, video) — Vice President of Franchise Development qualifies prospect on industry experience, net worth, cash to invest, market interest. Prospect signs Franchise Development Mutual Confidentiality Agreement before next stage.
3. **Mutual Non-Disclosure Agreement (NDA)** — both parties sign before any non-public information is exchanged.
4. **FDD Delivery** (mandatory 14-calendar-day FTC waiting period begins) — prospect receives full FDD with all 23 Items + sample franchise agreement + receipt page. Prospect signs receipt acknowledging delivery date.
5. **Discovery Day On-Site** at Hub #1 (Atkinson NH) — full-day in-person visit. Phyrom hosts; prospect meets Vice President of Franchise Development, Vice President of Operations, Hub #1 manager, at least one founding pro. Prospect tours the Hub, observes operations, gets to ask any question. Prospect cannot sign any binding agreement at Discovery Day per FTC waiting period.
6. **References + Background Check + Credit Check** — three professional references contacted by Sherpa Pros corporate; credit check via standard franchise-industry vendor (FranchiseGrade, BoeFly); background check via standard third party (HireRight or similar). Cost reimbursed by prospect ($550 application processing fee).
7. **Final Approval + Signing** — Sherpa Pros Franchise Approval Committee (Phyrom + Vice President of Franchise Development + Vice President of Operations + Chief Financial Officer) reviews complete file and votes. Approval requires unanimous vote. If approved, signing scheduled at Hub #1; franchisee delivers Initial Franchise Fee at signing.

**Estimated cycle time:** 60–120 days from inquiry to signed Franchise Agreement.

---

## 7. Initial Franchise Fee + Ongoing Royalty + Marketing Fund + Technology Fee Structure

Already specified in Item 5 and Item 6 (§4 above). Summary table for executive reference:

| Fee | Amount | Cadence |
|---|---|---|
| Initial Franchise Fee — single Hub | $45,000 | One-time at signing |
| Initial Franchise Fee — Area Development (3 Hubs / 5 yr) | $125,000 | One-time at signing |
| Initial Franchise Fee — Metro Master | $300,000 | One-time at signing |
| Initial Franchise Fee — Pro Network | $25,000 | One-time at signing |
| Initial Franchise Fee — International Master | $500K–$2M | One-time at signing |
| Royalty | 6% Year 1 / 8% Year 2+ of gross revenue | Monthly |
| Marketing Fund | 2% of gross revenue | Monthly |
| Local Marketing Minimum | 1.5% of gross revenue | Monthly (verified) |
| Technology Fee | $200 flat | Monthly |
| Renewal Fee (10-year renewal) | $15,000 | Per renewal |
| Transfer Fee | $7,500 | Per transfer |
| Annual Convention Fee | $1,500 | Annual |
| Audit Fee | Cost of audit | If underreporting >2% |
| International Master royalty | 4–6% of gross revenue | Monthly |
| International Master marketing fund | 1% of gross revenue | Monthly |

---

## 8. Territory Model

Already specified in Item 12 (§4 above). Additional operational notes:

**Protected Radius (no other corporate-owned or franchise-owned Hub may be opened):**
- Major metro: 5-mile radius
- Suburban: 15-mile radius
- Rural: 30-mile radius

**Population-density tier triggers:** Sherpa Pros Vice President of Franchise Development determines the tier at Discovery Day based on United States Census Bureau population density data for the proposed Hub location's census tract. Reclassification (e.g., a suburban tier later densifies to metro) does not retroactively shrink an existing franchisee's territory.

**Right of First Refusal (ROFR)** on adjacent territories — see Item 12.

**Overlap zones** beyond the protected radius — Sherpa Pros corporate retains all digital-product rights; pros and clients may transact on the platform regardless of which franchisee's territory they fall into. Overlap-zone pros and clients are tracked to the nearest Hub for the per-pro-engagement royalty (so no two Hubs receive duplicate engagement royalties on the same pro).

**Area Development Agreements** — a franchisee may commit to opening 3 Hubs over 5 years for the discounted $125,000 Initial Franchise Fee (versus $135,000 if purchased one-by-one). Area development territory is a multi-Hub region (e.g., "Greater Manchester NH metro") rather than a single 15-mile radius.

**International master-franchisee territory** — country-wide exclusivity (defer to international-expansion spec).

---

## 9. Support Package

### 9.1 Training

- **Initial:** 80 hours at Hub #1 (Atkinson NH) — operations, pro recruiting, codes literacy, materials orchestration, customer service, compliance, marketing, financial management. Scheduled across 10 business days. Corporate covers training delivery; franchisee covers travel and lodging.
- **Hub-Opening Support:** 40 hours on-site at the new Hub during Weeks 1–2 of operations. Corporate trainer travels to franchisee's Hub.
- **Quarterly Online Courses:** 8 courses per year, 2 hours each (32 hours annual continuing education). Topics rotate (advanced pro retention, code-update bulletins, materials-supplier negotiation, marketing campaign templates, financial benchmarking).
- **Annual Franchisee Summit:** 3 days per year, rotating between Sherpa University and franchisee-host markets. 24 contact hours.
- **Regional Ride-Alongs:** 4 per year — Vice President of Operations or designated corporate trainer visits the Hub for a half-day operational review.

### 9.2 Operations Support

- **Monthly Performance Review:** 60-minute video call with regional Vice President of Operations. Reviews Profit and Loss, pro-recruiting metrics, customer-satisfaction metrics, compliance status. Documented in shared performance dashboard.
- **Quarterly Business Review:** in-person at the Hub or at Sherpa University. 4-hour deep dive on Hub strategy, market opportunities, operational issues. Includes regional Vice President of Operations + Vice President of Franchise Development.
- **Annual Strategic Plan:** franchisee submits annual operating plan by November 15 for the following calendar year; corporate reviews and approves by December 31. Plan covers revenue goals, pro-recruiting goals, capital investments, marketing spend.

### 9.3 Marketing Support

- **National Brand Fund** (funded by 2 percent Marketing Fund contributions across all Hubs): runs national brand campaigns (television, podcast, paid social, public relations, search engine marketing) that benefit every Hub.
- **Regional Co-op:** matching funds from Marketing Fund for regional campaigns when 3+ adjacent Hubs co-fund a regional marketing initiative.
- **Per-Franchisee Playbook:** Sherpa Brand Standards Manual + Marketing Asset Library + monthly campaign templates.
- **Lead Generation:** Sherpa Pros corporate-generated marketplace leads in the franchisee's territory are routed into the franchisee's pro recruiting pipeline. Corporate does not charge per-lead for in-territory leads.

### 9.4 Technology Support

- 24/7 platform support (chat + phone + email).
- Sherpa codes engine access — every code change pushed to franchisee dashboards in near-real-time.
- Sherpa Materials engine access — full materials orchestration with corporate-negotiated supplier rates.
- Dispatch, Sherpa Threads, Sherpa Smart Scan, Sherpa Mobile, Sherpa Guard — all included in the $200 monthly Technology Fee.
- Hub-specific Point of Sale + Inventory Management system — corporate-licensed and integrated.

### 9.5 Legal Support

- Sample contracts: lease, employment, contractor, vendor — provided in Brand Standards Manual.
- Employment law guidance — quarterly bulletins on federal + applicable state employment law changes.
- Franchisee-customer dispute escalation path — corporate Legal team backstops franchisees on disputes that exceed the franchisee's standard resolution authority.
- Compliance-with-FDD support — corporate Legal team reviews any franchisee question on FDD interpretation.
- (NOT included: representation of franchisee in litigation against the franchisor — franchisees retain their own counsel for such matters.)

---

## 10. Franchise-vs-Corporate Hub Decision Matrix

The decision of whether a given metro should be served by a corporate-owned Hub or a franchised Hub follows a per-metro decision matrix.

| Metro Tier | Recommended Model | Rationale |
|---|---|---|
| Phase 1 launch markets (Portsmouth NH, Manchester NH, Portland ME, Boston MA) | Corporate-owned | Brand-building markets; need full corporate operational control while the platform is still maturing |
| Phase 2 markets (Worcester MA, Springfield MA, Lowell MA, Lawrence MA) | Corporate-owned | Adjacent to Phase 1; corporate operational learnings still being captured |
| Phase 3 markets (Providence RI, Hartford CT) | Corporate-owned | Northeast-corridor expansion under corporate control |
| Phase 4 markets — outer-Northeast (Burlington VT, Bangor ME, Albany NY upstate, Western MA) | **Franchised** | Capital-light expansion; local-operator advantage in smaller markets |
| Phase 4 markets — Mid-Atlantic (Hartford CT secondary, Long Island NY, Northern NJ secondary) | Franchised | Capital-light expansion; the unit economics are proven by Phase 4 Year 1 data |
| Phase 5 markets — Mid-Atlantic + Southeast | Franchised (mostly) + Metro Master in major metros | Metro Master for NYC, Philadelphia, DC, Atlanta — corporate keeps a flagship Hub in each |
| International | International Master Franchisee | See international-expansion spec |

**Default rule:** when in doubt, default to franchised in any Phase 4 outer market and beyond. Corporate operates the brand-building flagship Hubs; franchisees operate everything else.

**Conversion rule:** a corporate-owned Hub may be sold to a qualified franchisee at any time if a strategically-fit operator becomes available. Conversion sale price = book value of fixed assets + 8x trailing twelve months EBITDA + Initial Franchise Fee. Conversion is a discretionary corporate decision — not a franchisee right.

---

## 11. Franchisee Onboarding Playbook

90-day ramp from signed Franchise Agreement to Hub Grand Opening.

### Days 1–14: Real Estate Selection

- Vice President of Franchise Development sends Site Selection Criteria document.
- Franchisee identifies 3–5 candidate locations within approved territory.
- Corporate Real Estate consultant reviews candidates, ranks by foot traffic, parking, signage visibility, loading-dock access, lease terms, landlord quality.
- Top candidate selected.

### Days 15–30: Lease Negotiation + Permits

- Franchisee negotiates lease (Sherpa Pros corporate Lease Rider must be included).
- Corporate Legal reviews lease before signing.
- Lease executed.
- Local zoning + business license + sales tax registration.
- Insurance (general liability, property, workers' comp) bound effective lease commencement date.

### Days 31–60: Buildout + Equipment + Hiring

- Architectural plans (corporate template adapted to space) finalized with franchisee.
- General contractor (franchisee's choice from Sherpa Pros pre-vetted national list, or franchisee's own selection subject to corporate approval) executes buildout.
- Equipment ordered (Point of Sale, computers, security, signage).
- Initial Inventory ordered through Sherpa Materials.
- Manager hired (corporate provides job description template + interview guide).
- 2 part-time staff hired.
- Initial training begins (franchisee + manager travel to Hub #1 for 80-hour training).

### Days 61–80: Pre-Launch Marketing + Soft Open

- Local marketing campaign launches (corporate provides templates).
- Pro recruiting begins — franchisee starts attending local trade association meetings, hosting "Sherpa Hub coming soon" coffee mornings.
- Soft open (invite-only) for first cohort of 5–10 founding pros — they preview the Hub, give feedback, get founding-pro discount on first kit purchase.

### Days 81–90: Grand Open

- Public Grand Opening event.
- Corporate Vice President of Operations + Vice President of Franchise Development on-site.
- Press release + local media outreach.
- 30-day Grand Opening promotion (kit discounts, free training enrollment, equipment-rental free trial day).
- 40-hour on-site corporate trainer support across the Grand Opening + first 2 weeks.

---

## 12. Franchise Advisory Council (FAC) Structure

Once the franchise system reaches **5 active franchisees**, Sherpa Pros LLC will charter a Franchise Advisory Council (FAC).

**Composition:**
- 5 elected franchisee representatives (one per region as the system grows; initially 5 at-large)
- Phyrom (Chief Executive Officer) — non-voting Chair
- Vice President of Operations — non-voting
- Vice President of Franchise Development — non-voting
- Chief Marketing Officer — non-voting

**Voting structure:**
- Franchisee representatives vote on FAC recommendations.
- FAC recommendations are advisory — corporate retains final decision authority.
- Recommendations on Brand Standards changes, Marketing Fund spend, technology priorities, and franchisee-impacting policy changes carry significant weight; corporate commits in writing to either adopt FAC recommendations or provide a written reasoned explanation if rejected.

**Term limits:**
- Initial FAC term: 2 years.
- Maximum consecutive terms: 2 (4 years total).
- Election cadence: annual.

**Meeting cadence:**
- Quarterly (4 per year) — 1 in-person at Sherpa University, 3 video.
- Annual at Annual Franchisee Summit — full-FAC + open franchisee-feedback session.

**Standing agenda:**
1. Marketing Fund quarterly report (income + expenditure)
2. Brand Standards review (proposed changes + rationale)
3. Technology roadmap (next-quarter releases + franchisee-priority requests)
4. Pro recruiting + retention metrics (system-wide + per-franchisee benchmarks)
5. Open franchisee issues (prioritized list with corporate response committed)

---

## 13. International Franchising Overlay

**Defer to:** `docs/superpowers/specs/2026-04-25-international-expansion-design.md` for full international rollout, country-by-country regulatory mapping, country-by-country market entry sequence, country-by-country Master Franchisee economics.

**Summary for franchise-program reference (this spec):**

- **Model:** one Master Franchisee per country (international equivalent of Metro Master — Option C). Master Franchisee assumes country-level FDD-equivalent compliance.
- **Initial Master Franchise Fee:** $500,000–$2,000,000 depending on country market size (Canada $750K, UK $1.2M, Australia $850K, Mexico $500K reference points).
- **Royalty:** 4–6 percent of gross revenue (lower than US to compensate Master Franchisee for taking on country-level regulatory and operational complexity).
- **Marketing Fund:** 1 percent of gross revenue (lower than US 2 percent because the Master Franchisee runs country-level marketing rather than contributing to a US national fund).

**Country-level franchise regulatory regimes the Master Franchisee handles:**
- **Canada:** provincial Franchise Acts in Ontario (Arthur Wishart Act), Alberta (Franchises Act), Prince Edward Island, Manitoba, New Brunswick. Each requires province-specific disclosure document.
- **United Kingdom:** voluntary British Franchise Association (BFA) Code of Ethics. No statutory franchise law; common-law contract law governs.
- **Australia:** mandatory Franchising Code of Conduct (under Competition and Consumer Act). Requires Australian Disclosure Document (analogous to FDD), mandatory cooling-off period, mandatory dispute-resolution mechanism.
- **European Union:** member-state-level franchise law varies. France (Loi Doubin) requires pre-contractual disclosure; Spain, Italy, Belgium have similar regimes; Germany has no statutory franchise law but voluntary Deutscher Franchise-Verband (DFV) Code.
- **Mexico:** Industrial Property Law requires franchise registration with Mexican Institute of Industrial Property (IMPI) and Spanish-language disclosure document.

The international-expansion spec is the authoritative reference for international-rollout sequencing and per-country execution detail; this section is the franchise-program-specific summary.

---

## 14. Capital Required + Return on Investment (ROI) for Franchisor

### 14.1 One-Time Franchise Program Setup Cost

| Line | Cost |
|---|---|
| Franchise attorney engagement (FDD development through Version 1.0) | $80,000–$120,000 |
| Audit firm engagement (initial 3 years of audited financial statements) | $60,000–$90,000 (3 years × $20K–$30K per year) |
| State registrations (initial filing in 14 registration states) | $5,825 in filing fees + $15,000–$25,000 in attorney state-amendment fees |
| FDD design + production | $8,000–$12,000 |
| Sherpa University / training facility setup (initial Hub #1 expansion) | $35,000–$60,000 |
| Operations Manual development | $25,000–$40,000 |
| Brand Standards Manual development | $15,000–$25,000 |
| Sherpa Hub Franchise marketing materials (website, brochure, video) | $30,000–$50,000 |
| Recruiting + screening tooling (FranchiseGrade subscription, BoeFly account, background check vendor) | $5,000–$10,000 |
| **Total one-time setup** | **$280,000–$432,000** |

### 14.2 Annual Recurring Compliance Cost

| Line | Annual Cost |
|---|---|
| State registration renewals (14 states + 4 biz-opp) | $2,800–$4,500 in fees + $8,000–$15,000 in attorney maintenance |
| Annual FDD update (required under FTC rule within 120 days of fiscal year end) | $20,000–$35,000 in attorney + audit |
| Annual financial audit | $30,000–$45,000 |
| Compliance monitoring + reporting | $25,000–$40,000 (Vice President of Franchise Development part-time + outside compliance counsel) |
| FAC operations | $15,000–$25,000 (meeting costs, travel reimbursement) |
| **Total annual recurring** | **~$100,000–$165,000** |

### 14.3 Per-Franchise-Sale Revenue to Franchisor

| Revenue Line | Year 1 | Year 2 | Year 3+ |
|---|---|---|---|
| Initial Franchise Fee (one-time) | $45,000 | $0 | $0 |
| Royalty (6% Y1, 8% Y2+, on Mid revenue) | $34,800 | $84,000 | $100,000 |
| Marketing Fund | $11,600 | $21,000 | $25,000 |
| Technology Fee | $2,400 | $2,400 | $2,400 |
| Material rebate share (estimated 2% of franchisee inventory through approved suppliers) | $4,400 | $8,000 | $9,500 |
| **Total per-Hub per-year revenue to franchisor** | **$98,200** | **$115,400** | **$136,900** |

### 14.4 Breakeven on the Franchise Program

Franchise program one-time setup of $280,000–$432,000 is recovered after **3 to 5 sold franchises** (at $45K Initial Franchise Fee + first-year royalty contribution). Annual recurring compliance cost of $100K–$165K is covered by ongoing royalty + tech fee + marketing fund contributions from approximately **2–4 mature Hubs**.

**Bottom line:** the franchise program is cash-flow positive at 5 sold franchises, contributes meaningfully to corporate operating cash by 10 sold, and becomes the dominant capital-light expansion engine by 15+ sold franchises. The Phase 4 target of 10–20 franchised Hubs aligns directly with this economic threshold.

---

## 15. Risk Register

Top 10 risks ranked by combined likelihood × impact.

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | FDD legal exposure — drafting error or material omission triggers FTC enforcement or franchisee rescission claim | Medium | High | Engage tier-1 franchise attorney; second-opinion review by independent franchise counsel before Version 1.0 release; quarterly FDD compliance audit |
| 2 | Franchisee underperformance reflecting on the Sherpa Pros brand | High | High | Rigorous 7-stage screening (§6.3); monthly performance review; clear cure-period framework; right to terminate for repeated default |
| 3 | Royalty collection challenges — franchisee underreporting or late-paying | Medium | Medium | Direct integration of franchisee Point of Sale with Sherpa Materials reporting; monthly auto-debit Automated Clearing House (ACH) of royalty + technology fee; audit fee penalty for >2% underreporting |
| 4 | Franchisee litigation against franchisor (most common: territory dispute, Item 19 reliance claim, brand-standards-enforcement dispute) | Medium | High | Tight Item 12 territory definitions; conservative Item 19 numbers with explicit caveats; documented Brand Standards enforcement process; mandatory mediation before arbitration |
| 5 | FTC compliance audit | Low | High | Comprehensive FDD attorney review; audited financials; documented disclosure-receipt process; experienced franchise attorney on retainer |
| 6 | State registration delays preventing market entry | Medium | Medium | File in highest-priority states first (NY, RI, MD, VA); conservative 4-month assumption for state review; ready-to-go Phase 4 launch markets in non-registration states first |
| 7 | Master Franchisee mismanagement internationally (Phase 5+) | High | High | Master Franchisee deeply vetted; corporate retains audit + termination rights; reserved corporate flagship Hub in each country gives leverage |
| 8 | Brand inconsistency across franchisees (signage, customer service, kit assembly quality, training program quality) | High | Medium | Strict Brand Standards Manual; quarterly mystery-shopper audit; FAC-driven Brand Standards updates; Brand Compliance Score tied to franchise renewal eligibility |
| 9 | Technology adoption resistance (franchisee fails to adopt Sherpa codes engine, Sherpa Materials, Dispatch, etc.) | Medium | High | Software adoption metrics included in Performance Review; technology adoption tied to Marketing Fund matching; franchise renewal contingent on adoption compliance |
| 10 | Franchisor-franchisee channel conflict (corporate sells digital Marketplace product into franchisee's territory at terms franchisee finds unfair) | Medium | High | Documented channel rules in Item 12; FAC reviews any pricing change to digital products that affects franchisee economics; per-pro engagement royalty from corporate to Hub for any in-territory pro keeps channel aligned |

---

## 16. Open Decisions

1. **Lead franchise unit option:** confirm Option A (Sherpa Hub franchise) as the primary unit — or revisit if Phase 3 due-diligence reveals stronger Option B (Pro Network) demand from prospective franchisees.
2. **Area Development Agreement aggressiveness:** push for Area Development with most Phase 4 Year 1 prospects (encourages multi-Hub commitment) — or accept single-Hub-only and convert to Area Development at first renewal?
3. **FDD attorney selection:** evaluate Spadea Lanard & Lignana, DLA Piper Franchise Group, Faegre Drinker Biddle & Reath, Lathrop GPM. Vice President of Franchise Development to scope by Phase 3 Quarter 2.
4. **Audit firm selection:** evaluate Marcum, BDO USA, RSM US, Aprio. Chief Financial Officer to scope by Phase 3 Quarter 2.
5. **Franchise broker engagement:** engage IFPG (International Franchise Professionals Group) or FranNet for franchisee-prospect lead generation, paying broker commission of $15K–$25K per sale — or build organic franchise sales funnel and capture full Initial Franchise Fee?
6. **International Master Franchise Fee structure:** $500K floor seems low for established markets (UK, Canada); $2M ceiling seems low for Australia given market size. Re-validate with international-expansion spec authors.
7. **Sherpa University location:** stay at Hub #1 (Atkinson NH) through Phase 4 Year 2 — or invest in dedicated training facility in Manchester NH or Boston MA earlier?
8. **Franchise Advisory Council (FAC) charter timing:** FAC at 5 active franchisees (per §12) — or accelerate to FAC at 3 active franchisees to bake in franchisee voice from the earliest stage?
9. **Conversion of existing corporate Hubs to franchise:** policy on selling Phase 1–3 corporate-owned Hubs to qualified franchisees — and at what valuation multiple?
10. **Sherpa Pro Network franchise launch timing:** Phase 4 Year 3 (per §2.5) — or earlier if Phase 4 Year 1 surfaces prospects who want digital-only territory rights immediately?

---

## Appendix A — Brand-Bible Compliance Footer

This spec adheres to the Sherpa Pros brand bible documented in `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` §3.3 (Voice & Principles).

- **All abbreviations spelled out on first use:** Federal Trade Commission (FTC), Franchise Disclosure Document (FDD), Limited Liability Company (LLC), Small Business Administration (SBA), Mass Statistical Area (MSA), Earnings Before Interest, Taxes, Depreciation, Amortization (EBITDA), Cost of Goods Sold (COGS), Operating Expenses (OpEx), Capital Expenditures (CapEx), American Arbitration Association (AAA), United States Patent and Trademark Office (USPTO), Application Programming Interface (API), Optical Character Recognition (OCR), Short Message Service (SMS), Service Organization Control 2 (SOC 2), Role-Based Access Control (RBAC), Profit and Loss (P&L), Common Area Maintenance (CAM), Frequently Asked Questions (FAQ), Non-Disclosure Agreement (NDA), Right of First Refusal (ROFR), Franchise Advisory Council (FAC), British Franchise Association (BFA), Deutscher Franchise-Verband (DFV), Mexican Institute of Industrial Property (IMPI), Annual Business Opportunity Filing, Automated Clearing House (ACH), Certified Public Accountant (CPA).
- **"Wiseman" never exposed externally** — the codes intelligence layer is referenced as the Sherpa codes engine; Wiseman Materials is referenced as the Sherpa Materials engine or Smart Materials.
- **Founder reference:** Phyrom (founder of Sherpa Pros LLC; founder of HJD Builders LLC in New Hampshire). Surname omitted in this internal spec — to be provided by Phyrom for the actual FDD.
- **8th-grade reading level on human-facing summary sections** (Executive Summary, Franchisee Profile narrative); legally precise / technical language acceptable in Items 1–23 disclosure detail.
- **Geographic brand rule:** the Sherpa Pros brand is national (with international roadmap). Launch geography (Northeast corridor for Phase 4) is operational; the brand remains national in every external surface. Phyrom's New Hampshire General Contractor identity is biography, not a brand cap.
- **Product naming convention:** "Sherpa" + ProductName for every product reference (Sherpa Marketplace, Sherpa Hub, Sherpa Home, Sherpa Success Manager, Sherpa Rewards, Sherpa Flex, Sherpa Threads, Sherpa Smart Scan, Sherpa Mobile, Sherpa Guard, Sherpa Dispatch, Sherpa Materials).
- **No contractor jargon in human-facing sections** — Initial Investment, not "II"; Initial Franchise Fee, not "IFF"; Cost of Goods Sold, not "COGS" without spelling out first.

---

## Appendix B — Referenced Sources

- FTC Franchise Rule, 16 Code of Federal Regulations Part 436
- North American Securities Administrators Association (NASAA) 2008 Franchise Registration and Disclosure Guidelines (as updated)
- Servpro Franchise Disclosure Document 2025 (publicly available, used as franchise economics comparable)
- Anytime Fitness Franchise Disclosure Document 2025 (publicly available, used as multi-unit franchise structure comparable)
- ServiceMaster Restore Franchise Disclosure Document 2025 (publicly available, used as digital-only territory franchise comparable)
- IFA (International Franchise Association) 2026 Industry Outlook
- BoeFly Franchise Lending Marketplace data (used for SBA financing benchmarks)
- Hadfield Gray Franchise Industry Compliance Quarterly (used for state registration cost benchmarks)
- Sherpa Pros internal — Hub #1 (Atkinson NH) operating financials (Phase 1, used as Item 19 substantiation reference)
- Sherpa Pros internal — `docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md` (the Hub physical + digital model)
- Sherpa Pros internal — `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` (GTM phasing + brand bible)
- Sherpa Pros internal — `docs/operations/sherpa-product-portfolio.md` (product portfolio reference)
