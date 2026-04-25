# Companies with Employees with Available Time — Segment Brief

**Date:** 2026-04-22
**Author:** Claude (drafted for Phyrom review)
**Status:** Draft — pending Phyrom decision on interpretation
**Owner:** Phyrom (founder)
**Companion docs:**
- `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` (current GTM spec — this segment is not yet wired in)
- `docs/operations/sherpa-home-subscription.md` (Wave 6.3 — Sherpa Home product spec, **not yet written**; this brief assumes it)
- `docs/operations/sherpa-product-portfolio.md` (Wave 6.2 — 4-product brand context, **not yet written**; this brief assumes it)
- `docs/operations/attorney-engagement-package.md` (Phase 0 attorney scope; does not currently cover the deeper employer-of-record questions raised by Interpretation B)

---

## Open Questions for Phyrom (Top of Doc — Please Answer Before We Build)

1. **Which interpretation did you mean — A (employee benefit / B2B2C demand-side), B (workforce utilization / B2B supply-side), or C (both)?**
2. **If A: target Phase 1 launch month?** (Today implies Phase 1 starts Months 3–6 per the GTM spec — does the benefits motion ride that wave or wait until Phase 2 when Sherpa Home itself is mature?)
3. **If B: are you OK with deferring to Phase 2 because of the worker-classification legal complexity?** (See Section 6 risk assessment.)
4. **Pricing for A: $12 / employee / month flat? Or tiered (50–500 = $14, 500–2,000 = $12, 2,000+ = $10)?**
5. **Naming: "Sherpa for Companies", "Sherpa Pros Benefits", or "Sherpa Home Enterprise"?** (My pick: **Sherpa for Companies** — plainspoken, founder-voiced, and works for both A and B if we ever combine.)
6. **Sales lead: founder-led (Phyrom) for first 10 logos, then a B2B AE in Phase 2 — or hire BD on day one?**

---

## 1. The Ambiguity (and Why It Matters)

Phyrom flagged "Companies with employees with available time" as a new audience segment on 2026-04-24. The phrase admits at least three readings, and they imply very different products, sales motions, and legal exposure. **We need to lock the interpretation before building anything**, because the wrong commitment burns Phase 0 oxygen on legal scope or sales channels we cannot yet support.

| Interpretation | Side of marketplace | Buyer | Product | Legal risk | Time to revenue |
|---|---|---|---|---|---|
| **A — Employee Benefit** | Demand-side (B2B2C) | HR / Total Rewards | Bulk Sherpa Home subscription | Low | 60–90 days |
| **B — Workforce Utilization** | Supply-side (B2B) | Operations / Facilities | Employer-managed pro fleet | **High** | 90–180 days |
| **C — Both** | Both sides | HR + Operations | Combined offering | Highest | 12+ months |

**Recommendation up front:** lead with **Interpretation A in Phase 1**, defer **Interpretation B to Phase 2** (or later) until the Sherpa Marketplace is stable and the attorney has scoped the deeper employer-of-record questions. Full reasoning in Section 5.

---

## 2. Interpretation A — Employee Benefit (B2B2C Demand-Side)

### 2.1 What it is

Companies offer Sherpa Pros memberships as a benefit or perk to their employees. Think ClassPass for home services, or the way some employers offer pet insurance, identity theft protection, legal services, or a stipend for fitness apps. The employee uses Sherpa Pros on the homeowner side — booking a plumber, an electrician, a handyman — and the employer pays the Sherpa Home subscription as part of the total rewards package.

### 2.2 Audience

HR leaders, Total Rewards directors, and Benefits Managers at companies with **50–5,000 employees** in the **white-collar Northeast** where home ownership is high (suburbs of Boston, Portsmouth, Portland, southern NH, MetroWest). Vertical fit: technology, financial services, life sciences, healthcare administration, professional services, insurance.

Buyer titles to target on LinkedIn:
- VP People / Chief People Officer
- Director, Total Rewards
- Director, Benefits
- Benefits Manager
- HR Business Partner (warm-intro path, not closer)

### 2.3 Product

**"Sherpa for Companies — Home Edition"** *(working name; Phyrom to confirm naming)*

A bulk Sherpa Home subscription billed to the employer, delivered to the employee's personal account. Employee gets the same homeowner experience as a retail Sherpa Home subscriber (license-verified pros, code-aware quotes, capped work guarantee, in-app messaging, emergency dispatch lane). Employer gets a clean monthly invoice and an opt-in usage dashboard (anonymized — never per-employee detail).

Required platform changes (Wave 6.3 dependency, plus this segment):
- Employer-billed account model (one invoice, many seats)
- Seat provisioning (HRIS integration via Workday / BambooHR / Rippling — Phase 2; CSV upload — Phase 1)
- Anonymized usage reporting dashboard
- White-glove onboarding for the first 10 enterprise logos

### 2.4 Pricing

| Tier | Headcount | Per-employee / month | Notes |
|---|---|---|---|
| Pilot | 50–249 | $14 | Annual contract, founder-led close |
| Growth | 250–999 | $12 | Annual or 2-year |
| Enterprise | 1,000–4,999 | $10 | Multi-year, executive sponsor required |

Retail Sherpa Home is assumed at $19/month (pending Wave 6.3 confirmation). The 50%-off-at-scale framing is the same playbook ClassPass, Headspace for Work, and One Medical use.

**Annual Contract Value (ACV) examples:**
- 250-employee pilot: 250 × $144 = **$36,000 ACV**
- 1,000-employee Growth: 1,000 × $144 = **$144,000 ACV**
- 4,000-employee Enterprise: 4,000 × $120 = **$480,000 ACV**

10 Pilot/Growth logos in Phase 1 = roughly **$500K–$1.5M ARR**, which is meaningful Seed-stage traction in addition to the consumer Sherpa Home book.

### 2.5 Sales motion

Classic B2B SaaS sale, founder-led for the first 10 logos:

1. **Outbound LinkedIn** (Phyrom voice) — "I built this because I'm a working contractor and I watched Angi and Thumbtack waste my clients' time. We're a licensed-trade marketplace. I'd love to give your employees a benefit they'll actually use." 60–90 second voice-note follow-up.
2. **Benefits broker channel** — Mercer, Aon, Marsh McLennan Agency, Lockton, Gallagher, NFP. These firms control most mid-market benefits decisions. One broker relationship can unlock 10+ logos.
3. **Inbound from PR** — when Sherpa Home press lands, HR teams will see it and ask. Capture demand with a `/companies` landing page.
4. **HR conferences** — SHRM Annual, NEHRA (Northeast HR Association), Total Rewards regional events.

**Sales cycle:** 60–90 days typical for a benefits add-on (not a core medical / 401k decision; lower internal scrutiny).

### 2.6 Why this works

- **Leverages existing Sherpa Home product.** No new platform surface; just billing and seat management.
- **Buyer is well-mapped.** HR has a known purchasing process and a known channel (benefits brokers).
- **Legal exposure is low.** This is a benefits product, not a labor product. The employee uses Sherpa Pros as a homeowner; classification questions don't apply.
- **Compounding LTV.** Once a company subscribes, retention is high (benefits churn is low — typically 95%+ annual retention) and seat counts grow with hiring.
- **Free distribution.** Every employee at a customer becomes a homeowner-side warm lead; many will tell friends and family.

### 2.7 Channels for Interpretation A

- LinkedIn outbound (founder voice, sequenced)
- Benefits broker direct outreach (Mercer, Aon, Marsh McLennan Agency, Lockton, NFP, Gallagher, Hub International)
- HR-focused PR (Boston Globe Workplace, Boston Business Journal, SHRM publications)
- NEHRA membership + sponsorship
- Total Rewards Association (WorldatWork) sponsorship in Phase 2
- Co-marketing with adjacent benefits products (One Medical, Carrot Fertility, Headspace for Work)

---

## 3. Interpretation B — Workforce Utilization (B2B Supply-Side)

### 3.1 What it is

Companies whose employees have downtime, underutilized capacity, or scheduled gaps — facilities maintenance staff at large institutions, in-house tradespeople at multi-family operators, or construction company tradespeople between projects — can take Sherpa Pros jobs as additional revenue. The employer enables the access (and may take a cut), gets a workforce-retention story, and may offload some maintenance overflow to the same pool.

### 3.2 Audience

Two sub-segments:

**B1 — Facilities operators with in-house maintenance staff:**
- Large universities (facilities departments often run 200–800+ trades)
- Hospital systems (facilities + biomedical maintenance crews)
- Multi-family operators (in-house maintenance technicians per portfolio)
- Manufacturing plants (skilled-trade maintenance teams)
- Class-A office REITs (Boston Properties tier — though their counts are leaner than expected; see [VERIFY] note below)

**B2 — Construction companies with trade workforce:**
- Mid-size GC firms with crews between projects
- Specialty trade contractors (electrical, HVAC, plumbing) with capacity gaps
- Subcontractor businesses looking to diversify revenue

### 3.3 Product

**"Sherpa for Companies — Workforce Edition"** *(working name)*

A managed pro account for the employer. The company onboards its tradespeople under one umbrella — the company is the pro of record (or a clearly defined relationship is structured), and the company takes a cut of the per-job revenue. Employees clock Sherpa Pros work as approved side income (or, in some configurations, as a covered employer-paid hour).

Required platform changes (much heavier than A):
- Multi-pro account hierarchy (one company, many seats)
- Employer-employee revenue split engine
- Tax withholding handling — the hardest piece, see legal risk below
- Job-eligibility filters (no compete-with-employer rules; geography fences)
- Insurance reconciliation (whose policy covers what)

### 3.4 Pricing

Two-part:
- **Platform fee:** $50–$150 / employee / month (covers the SaaS + dispatch)
- **Take rate:** Sherpa Pros standard 5–10% of GMV per job + employer share (typically 10–30% of pro earnings)

Per-employee economics will vary wildly by role (facilities maintenance vs. licensed electrician vs. handyman). Estimate: **$2,000–$8,000 GMV per active worker per year**, of which Sherpa Pros captures ~10% and employer captures ~15–25%.

### 3.5 Sales motion

Long-cycle B2B operational sale. Buyer is **VP Facilities / Director of Operations / Chief Operating Officer**, with **HR + Legal sign-off required**. Sales cycle: **90–180 days minimum** — and that assumes the legal questions in Section 6 are already answered.

### 3.6 Channels for Interpretation B

- IFMA (International Facility Management Association) regional chapters — Boston, NE chapter
- BOMA (Building Owners and Managers Association)
- AGC (Associated General Contractors of America) chapters — NH, ME, MA
- Direct outreach to named accounts (university facilities, hospital systems)
- Supply-house referrals (FW Webb, Lowe's Pro, Home Depot Pro)

### 3.7 Why this is harder

- New platform surface (multi-pro accounts, splits, withholding) competes with core Phase 1 platform-stability work.
- Buyer is operations + HR + legal — three stakeholders, three sales cycles in parallel.
- Legal exposure is high (Section 6).
- Even after legal greenlights, **employee buy-in is its own gate** — employees may not want their employer involved in their side income. Pilots that look great on paper can stall on enrollment.

---

## 4. Interpretation C — Both

A combined offering: the company that buys Sherpa Home for its employees can also opt in to the workforce-utilization product for its tradespeople workforce. Same logo, two products.

This is the right end-state vision but the wrong starting point. The two motions have different buyers (HR vs. Operations), different sales cycles, different legal scopes, and different platform requirements. Bundling them at launch dilutes the message and slows both.

**Phased approach (recommended):**
- **Phase 1 (Months 3–6):** Launch A only. Sign 10 logos. Prove the model.
- **Phase 2 (Months 6–12):** Add B as an upsell to existing A customers that have in-house tradespeople — once attorney has scoped the legal envelope. Most A customers (white-collar tech, finance, healthcare admin) won't want B anyway. The overlap is real but narrow: hospitals, universities, large multi-family operators.
- **Phase 3+ (12+ months):** Cross-sell becomes part of standard enterprise motion.

---

## 5. Recommendation: Lead with A, Defer B

**Phase 1 priority: Interpretation A — Employee Benefit.**

Reasoning:

1. **Faster sales cycle.** 60–90 days vs 90–180 days. Phase 1's Seed-raise gate (Month 5–6) needs visible enterprise traction, not pipeline.
2. **Leverages existing product.** Sherpa Home (Wave 6.3) is the vehicle. We add billing + seat management, not a whole new product surface.
3. **Known buyer pattern.** HR / Total Rewards / Benefits Managers are a well-mapped sales motion with a clean broker channel. We don't have to invent the playbook.
4. **Low legal exposure.** A is a benefits product. B requires labor-law work the attorney hasn't scoped (see Section 6).
5. **Compounding distribution.** Every covered employee is a homeowner-side warm lead. The benefits motion seeds the consumer marketplace.
6. **Fits founder bandwidth.** Phyrom can credibly close the first 10 logos himself in Phase 1 — "working contractor pitching HR" is a story that lands.

**Defer Interpretation B to Phase 2 minimum**, ideally Phase 3, conditional on:
- Attorney engagement (Section 6) explicitly scoped to cover employer-of-record / multi-pro classification questions
- Sherpa Marketplace stable at 200+ pros across 4 metros
- A clear customer pull from existing A logos asking for the workforce-side product

---

## 6. Risk + Complexity Assessment

### 6.1 Interpretation A risks (LOW)

| Risk | Severity | Mitigation |
|---|---|---|
| Slow HR sales cycles | Medium | Founder-led close for first 10 logos; broker channel for scale |
| Employees don't activate | Medium | White-glove employer onboarding kit; in-app activation flow; first-job credit |
| Benefits broker friction (they want a cut) | Low | Standard 10–15% broker commission baked into pricing model |
| Sherpa Home product not ready | High | **This is a Wave 6.3 dependency.** Cannot sell A before Sherpa Home consumer launch. |

### 6.2 Interpretation B risks (HIGH)

| Risk | Severity | Mitigation |
|---|---|---|
| **Worker classification ambiguity** | **Critical** | Requires net-new attorney scope. Is the worker still 1099? Does the employer's involvement convert them to W-2 of Sherpa Pros? Of the company? Joint employer liability? |
| State-by-state employment law variance | Critical | MA ABC test, NH employment law, ME employment law, plus every state we expand to. Each state requires a separate legal opinion. |
| Federal IRS scrutiny on employer take | Critical | Employer taking a cut of employee 1099 earnings is a structure the IRS may treat as wage redirection — unpaid payroll tax exposure. |
| Employee push-back on employer involvement in side income | High | Pilot enrollment can stall. Conservative employees may opt out, which kills unit economics. |
| Insurance gap (whose policy covers the job) | High | Each employer engagement requires bespoke insurance reconciliation. The Layer 1–4 stack in `liability-insurance-framework.md` does not currently anticipate this. |
| Conflict with employer's existing labor agreements | Medium | Union shops, collective bargaining agreements, FLSA overtime calculations all complicate B materially. |

**The single biggest blocker on B is worker classification.** The current Phase 0 attorney scope (`docs/operations/attorney-engagement-package.md`) covers 1099 vs. W-2 for the standard marketplace pro — independently licensed, own insurance, sets own bid prices, can use other platforms. Interpretation B introduces the **employer of record** as a third party in the relationship. That changes the legal analysis materially. We would need a new legal scope item, likely a separate engagement and likely $15K–$40K of incremental legal fees, before we could even pilot.

### 6.3 Interpretation C risks

All of A's risks plus all of B's risks plus the integration complexity of running both motions concurrently. Phase 1 burn rate ($25–35K/month) cannot absorb the legal scope, the engineering work, and a second sales motion. This is a Phase 3 conversation at earliest.

---

## 7. First 10 Named Target Companies (Phase 1, NE-Anchored)

All companies are real and headquartered or anchored in the NE (Phase 1 launch geography). Brand stays national; targeting NE-anchored companies just reflects launch sequencing. **`[VERIFY]`** flags facts I could not fully confirm in this draft and that need confirmation before outreach.

| # | Company | HQ / NE Office | Approx. Employees | Why They Fit | A or B? | Recommended Contact Path |
|---|---|---|---|---|---|---|
| 1 | **HubSpot** | Cambridge, MA | ~8,200–8,700 globally `[VERIFY exact 2026]` | Tech, suburban Boston commuters, high homeownership; perks-forward culture | **A** | LinkedIn → VP People; warm intro via Boston tech network |
| 2 | **Wayfair** | Boston, MA (Boylston St.) | ~2,500 in Boston | E-commerce, white-collar, home-adjacent product fit (the obvious narrative) | **A** | Direct CEO route via founder-to-founder; CHRO via LinkedIn |
| 3 | **DraftKings** | Boston, MA (moving to 225 Franklin in 2027) | ~5,500 globally | Tech, urban + suburban Boston homeowners | **A** | LinkedIn → Director, Total Rewards |
| 4 | **Liberty Mutual Insurance** | Boston, MA | ~45,000 globally `[VERIFY 2026]` | Insurance, large NE workforce, generous benefits philosophy ($6,480/employee benefits value), 8% 401k match starting 2026 → committed to expanding total rewards | **A** | Benefits broker (likely Marsh or Mercer); LinkedIn to VP Benefits |
| 5 | **Fidelity Investments** | Boston, MA (Commonwealth Pier 2026) | ~79,000 globally | Financial services, hybrid workforce (2 weeks/month in office) → strong homeowner profile in suburbs | **A** | LinkedIn → Director, Workplace Benefits; broker via Mercer |
| 6 | **Vertex Pharmaceuticals** | Boston, MA | ~6,100 globally | Biotech, high-comp white-collar, Boston/Cambridge homeowners | **A** | LinkedIn → CHRO or VP People |
| 7 | **Mass General Brigham** | Boston, MA | ~70,000+ in MA | Healthcare; massive workforce; admin staff = A fit; **also has 800+ facilities tradespeople** = B candidate when ready | **A first, B Phase 2** | HR contact via NEHRA network; facilities contact via IFMA |
| 8 | **Eversource** | Hartford CT / Westwood MA / Manchester NH | ~9,500 in NE `[VERIFY]` | Utility — natural co-marketing fit (Mass Save); employees are NE homeowners; existing CVC interest noted in GTM spec | **A** (with strategic angle) | Existing GTM spec lists Eversource Ventures (CVC) as Tier 3 strategic — same relationship, different door |
| 9 | **Dartmouth Health (Dartmouth-Hitchcock)** | Lebanon, NH | ~13,000 in NH/VT | Largest NH-based employer outside Walmart; healthcare admin = A; **has facilities trades** = B candidate | **A first, B Phase 2** | Direct via NHHBA contacts; CHRO via LinkedIn |
| 10 | **Boston Properties (BXP)** | Boston, MA | ~519 globally `[VERIFY]` | Smaller than expected — REIT staff is lean. **Better as a B2B PM-tier customer than a B2B2C benefits customer.** Listed here as a flag: research said Boston-anchored REITs run leaner than the original brief assumed. Replace with **Akamai** (~10,800 globally, Cambridge HQ) or **Wellington Management** (~3,000 in Boston) for Phase 1 outreach | **A** (replace BXP with Akamai or Wellington) | LinkedIn → VP People |

**Companies intentionally not in the top 10 but worth noting:**
- **Bose** (Framingham, MA) — strong NE brand, ~7,000 globally `[VERIFY]`. Worth adding once we have one tech logo closed.
- **Raytheon (RTX)** — 195,000 globally; defense procurement and security clearances make benefits onboarding slow; Phase 2.
- **MIT** — ~17,000 employees including facilities trades; institutional buying cycle is glacial; Phase 2 minimum.
- **Harvard University** — same as MIT.
- **MFS Investment Management** — listed in original brief; ~3,000 globally, conservative culture, plausible Phase 2.

---

## 8. Sample Outreach Email — Interpretation A

**To:** VP People / CHRO
**From:** Phyrom (Founder, Sherpa Pros)
**Subject line options:**
- *I built this because Angi was wasting my clients' time*
- *A new home-services benefit, built by a working contractor*
- *Quick question on your home-services benefits coverage*

**Body:**

> Hi [First name],
>
> I'm Phyrom — a working general contractor in New Hampshire. I built Sherpa Pros because I watched too many of my clients waste hours on Angi and Thumbtack getting bad quotes from pros who were never going to call back.
>
> Sherpa Pros is the licensed-trade marketplace that thinks like a contractor. Every pro is license-verified, insurance-verified, and code-aware. Homeowners get real quotes, fast matches, and a capped work guarantee.
>
> I'm reaching out because we're rolling out a benefits version — Sherpa for Companies — and I think [Company] would be a great fit. Your employees are homeowners. They're going to call a plumber or an electrician this year. We can make sure that experience doesn't suck, for $12 per employee per month.
>
> 15-minute call this week or next? I'm happy to walk you through it founder-to-leader.
>
> Phyrom
> Founder · Sherpa Pros
> NH General Contractor · HJD Builders LLC
> poum@hjd.builders · www.thesherpapros.com

**CTA:** "15-minute call this week or next?" + Calendly link in signature.

---

## 9. Brand Bible Compliance Check

- **Plainspoken, founder-voiced** — yes ("I built this because Angi was wasting my clients' time")
- **National brand framing** — yes (companies are positioned by HQ, not as a regional play; the launch geography is operational)
- **Phyrom-as-NH-GC origin** — leads, doesn't cap (origin story in line one of every email)
- **No "Wiseman" externally** — confirmed (this doc uses "code-aware", "license-verified" externally)
- **No surname** — confirmed (Phyrom, Founder · Sherpa Pros)
- **No jargon abbreviations on first use** — spelled out: Annual Contract Value (ACV), Total Rewards, Chief Human Resources Officer (CHRO), International Facility Management Association (IFMA), Building Owners and Managers Association (BOMA), Associated General Contractors (AGC), Northeast HR Association (NEHRA)
- **No "New England-only" framing in sales material** — the company is national; we're targeting NE-headquartered companies because that's where the platform launches first (operational), not because the offering is regional

---

## 10. Next Steps (If Phyrom Approves Interpretation A as Phase 1 Priority)

1. **Phyrom decision:** answer the six questions in Section 0
2. **Sherpa Home (Wave 6.3) confirmation:** confirm Wave 6.3 retail product spec ($19/month, feature set) before pricing the bulk version. **Sherpa for Companies cannot sell before Sherpa Home is live.**
3. **Naming decision:** "Sherpa for Companies" (recommended) vs "Sherpa Home Enterprise" vs "Sherpa Pros Benefits"
4. **Landing page:** add `/companies` route with the pitch above
5. **Outreach kit:** finalize this email + a 1-page PDF leave-behind + a 5-slide sales deck (extract from `docs/pitch/sherpa-pros-deck-v1.md`, with HR-focused framing)
6. **Sales target:** 3 logos signed by end of Phase 1 (Month 6); 10 logos by end of Phase 2 (Month 12)
7. **Add to GTM spec:** at next spec revision, integrate the "Companies with Employees" segment into Section 3 (audience-specific sub-positioning) and Section 4 (phased GTM execution)
8. **Attorney scope:** **NO new legal scope required for Interpretation A.** (If Phyrom decides to also pursue B, add to attorney engagement explicitly — this is where the cost lives.)
9. **Broker channel:** Phyrom warm intro to one mid-market benefits broker by Month 4 (Mercer regional, Marsh McLennan Agency, Lockton, or NFP); broker-introduced logos count toward Phase 1 traction

---

## Appendix A — Unanswered Questions for Wave 6.3 (Sherpa Home)

This brief assumes Sherpa Home retail exists at $19/month. If Wave 6.3 lands at a different price point, the bulk pricing in Section 2.4 needs to be re-modeled. Open questions for Wave 6.3 spec:

- Sherpa Home retail price (assumed $19/month)
- Feature set (assumed: license-verified pros, code-aware quotes, capped work guarantee, in-app messaging, emergency dispatch lane)
- Geographic coverage (assumed: 4 Phase 1 metros at launch, expanding with marketplace footprint)
- Cancellation / pause mechanics
- Family plan vs individual

---

## Appendix B — Sources

- [Largest Companies in Massachusetts 2026 — Zippia](https://www.zippia.com/advice/largest-companies-in-massachusetts/)
- [Largest Companies in New Hampshire 2026 — Zippia](https://www.zippia.com/advice/largest-companies-in-new-hampshire/)
- [Mass General Brigham — Wikipedia](https://en.wikipedia.org/wiki/Mass_General_Brigham)
- [HubSpot Employee Count 2026 — MPI Resolutions](https://mpiresolutions.com/blog/how-many-employees-does-hubspot-have/)
- [DraftKings & Wayfair Boston HQ Plans — Boston Globe](https://www.bostonglobe.com/2025/12/11/business/draftkings-wayfair-office-headquarters-lease/)
- [Liberty Mutual Foundation $600M Endowment — Boston Today](https://nationaltoday.com/us/ma/boston/news/2026/04/08/liberty-mutual-launches-600m-endowment-for-nonprofit-partners/)
- [Liberty Mutual Employee Benefits — Built In Boston](https://www.builtinboston.com/company/liberty-mutual-insurance/benefits)
- [Fidelity Investments — Wikipedia](https://en.wikipedia.org/wiki/Fidelity_Investments)
- [Vertex Pharmaceuticals — Wikipedia](https://en.wikipedia.org/wiki/Vertex_Pharmaceuticals)
- [Boston Properties (BXP) Employee Count — MacroTrends](https://www.macrotrends.net/stocks/charts/BXP/boston-properties/number-of-employees)
- [ClassPass Corporate Wellness Program](https://classpass.com/corporate-wellness)
- [1099 vs W-2 Employees Guide — ADP](https://www.adp.com/spark/articles/2021/05/1099-vs-w2-what-you-dont-know-could-cost-you.aspx)
- [Misclassification of Independent Contractors — Rooney Law](https://rooney.law/blog/misclassification-of-independent-contractors-a-risk-not-worth-taking/)
- [Independent Contractor vs. Employee — IRS](https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee)

---

*Draft prepared for Phyrom review 2026-04-22. Do not act on Section 7 outreach list until Sherpa Home (Wave 6.3) product spec is locked.*
