---
title: Sherpa Pros — Embedded Fintech Roadmap (Phase 4)
date: 2026-04-25
status: draft
owner: Phyrom (founder), Chief Financial Officer (Phase 4 Month 6 hire), General Counsel (Phase 4 Month 12 hire), future Head of Embedded Fintech (Phase 4 Year 2 hire)
references:
  - docs/superpowers/handoff/2026-04-25-phase-4-parallel-execution.md
  - docs/strategy/phase-4-extensions/06-phase-4-okrs-and-measurement-framework.md
  - docs/operations/sherpa-product-portfolio.md (Sherpa Rewards live, Sherpa Flex live)
  - src/lib/payments/ (existing Stripe Connect integration)
classification: Internal — executive + finance team
---

# Embedded Fintech Roadmap — Phase 4

## Purpose

Phase 0-3 stood up the foundational fintech rails: Stripe Connect for marketplace splits and payment protection, Tremendous for Sherpa Rewards real-money fulfillment, and per-project liability insurance bundled into Sherpa Flex tier. Phase 4 expands from "fintech that supports the marketplace" to "fintech as a category of revenue." Five new product surfaces, phased over Years 1-3 of Phase 4, that together turn Sherpa Pros into an embedded financial-services platform for the licensed-trade economy.

**The thesis.** Pros and trade-professional clients move through Sherpa Pros workflows that already touch the most expensive moments in their financial lives: paying for materials before invoicing the client (working capital), warranting work quality (insurance), receiving job payouts (banking), and large client purchases (consumer financing). Each moment is a fintech revenue opportunity that Sherpa Pros is uniquely positioned to capture because we already own the workflow, the trust signal (Sherpa Score), and the customer relationship.

**Vendor strategy default.** Partner-bank model first; own state licenses only when scale demands it. Reduces regulatory burden and time-to-market by 18-24 months per product. Trades partner-margin for speed.

---

## 1. Sherpa Lending — working-capital line of credit for pros

### The problem

Pros front materials, labor, and overhead before they invoice the client. On a $30K kitchen remodel, a pro might have $12K in materials and $4K in payroll out the door before the client's first deposit clears. For Founding/Gold tier pros, this working-capital gap is the #1 reason jobs slow down or get declined.

### The product

A working-capital line of credit, available exclusively to Founding/Gold tier pros (Sherpa Score >= 75), underwritten on:

- Sherpa Score (proprietary trust signal — top 5 features by predictive importance per the Phase 4 Machine Learning model).
- Trailing 6-month revenue through Sherpa Marketplace.
- Job pipeline (signed bids waiting to start).
- Repayment behavior on prior Sherpa Lending draws.
- Standard FICO / business credit pull (with pro consent).

**Tenor.** 90-day max per draw, tied to a specific job invoice. Auto-collected from Stripe Connect payouts when the client pays.

**Pricing.** Annual Percentage Rate 6%-12% based on Sherpa Score tier + draw size + tenor. Origination fee 2%-4% per draw. Comparable: Pipe (2%-4% origination, 0% interest on short-tenor), Capchase (1%-2% origination + 6%-12% Annual Percentage Rate), Brex Buy Now Pay Later for materials (~1.5% per transaction).

**Use of proceeds.** Restricted to Sherpa Materials engine purchases initially (proves the loop: pro draws against a Sherpa-routed materials order, the materials show up at the Sherpa Hub, the client pays, the loan auto-repays). Phase 5 Year 1 expands to general working-capital use.

### Vendor and partner strategy

**Year 1 pilot: partner with regional bank or specialty lender for white-label loan origination.** Candidates: First Republic Bank successor (now JPMorgan Chase), Live Oak Bank (small-business lending specialist), Cross River Bank (fintech-partner specialist). Sherpa originates the application, the partner-bank holds the receivable on their balance sheet, Sherpa earns origination fee + servicing fee + revenue-share on interest.

**Year 2-3 expansion: evaluate own state lending licenses.** Once loan volume exceeds $25M originated annually, evaluate licensing Sherpa Lending as a regulated lender in priority states (NH, MA, ME, NY, NJ, CA). Decision criteria: total partner-bank margin given up vs cost of compliance + loss reserves.

### Risk model

**Short-tenor, job-invoice-collateralized.** Default risk is bounded because every loan repays from a specific Stripe Connect payout that Sherpa controls. Sherpa is in payment-flow position (not just a lender chasing a receivable). Loss-given-default expected <2% on portfolio basis.

**Loss reserve target.** 4%-6% of outstanding portfolio. Funded from origination fee revenue + Series C balance-sheet allocation ($2M-$4M earmarked).

### Revenue model

- Origination fee: 2%-4% of draw amount (paid by pro at draw).
- Annual Percentage Rate: 6%-12% (revenue-shared with partner-bank ~50/50 in Year 1).
- Servicing fee: $5-$15/month per active draw.
- Cross-sell uplift: pros with active Sherpa Lending lines pull 30%+ more Sherpa Materials engine orders (estimated based on industry benchmarks; validate in pilot).

### Phasing

- Phase 4 Year 1 (Month 18-30): Pilot in Portsmouth NH + Manchester NH + Portland ME with 25-50 Founding/Gold pros, $500K-$1M originated.
- Phase 4 Year 2 (Month 30-36): Roll out to all metros, $5M-$10M originated.
- Phase 5 Year 1: $25M+ originated, evaluate own-license expansion.

---

## 2. Sherpa Insurance — embedded service-warranty + completion-guarantee for clients

### The problem

Homeowners hiring a contractor through any platform — Sherpa included — face two anxieties: (a) what if the pro disappears mid-job, and (b) what if the work fails after completion. These anxieties drive bid-comparison paralysis and reduce job-conversion rates.

### The product

An embedded insurance product available at job checkout. Client adds 5%-8% to job total for coverage. Coverage scope:

- **Completion guarantee.** If the assigned pro fails to complete the job to spec, Sherpa Insurance underwrites the cost of routing a replacement pro and finishing the work.
- **Quality remediation.** Within 12 months of completion, if the work fails (leak, electrical fault, code-violation discovered post-permit-close), Sherpa Insurance underwrites the remediation cost up to the original job value.
- **Property damage during job.** Limited property-damage coverage during job execution (excess to pro's commercial general liability policy).

**Underwriting partner.** Travelers, Chubb, or Hippo. Sherpa originates the policy at checkout, the partner-carrier underwrites the risk, Sherpa earns insurance commission + cross-sell into other carrier products. Partner-carrier preference: Travelers (largest commercial-lines carrier, history of working with marketplace embedded distribution).

### Why a carrier wants to partner

- **Distribution.** Sherpa puts insurance products in front of buyers at the moment of buying a job, when buying-mode is at peak. No carrier has access to that distribution surface organically.
- **Underwriting data.** Sherpa Score and historical job-outcome data feed back into the carrier's underwriting model. Better underwriting reduces loss ratio over time.
- **Cross-sell.** Once a client buys Sherpa Insurance on a job, the carrier can cross-sell homeowners insurance, umbrella policies, etc.

### Risk model

**Underwriting risk sits with the partner-carrier.** Sherpa is the distribution layer, not the risk-bearing entity. This is a critical structural decision — Sherpa does not want to become a regulated insurance underwriter (different state-by-state licensing regime, different capital requirements).

**Loss ratio expectation.** Industry-comparable for service-warranty products: 30%-50%. Carrier earns the spread; Sherpa earns commission.

### Revenue model

- Insurance commission: 15%-25% of premium (industry-standard).
- Claims-data feedback loop: revenue-share on improved underwriting precision year-over-year.
- Cross-sell affiliate revenue from carrier on adjacent-product conversions.

**Estimated unit economics.** On a $20K average job with 6% insurance attach ($1,200 premium), Sherpa earns 20% commission = $240 per attached policy. At 30% attach rate across 10K jobs/year by Phase 4 Year 3 = 3,000 policies × $240 = $720K commission revenue, growing with job volume.

### Phasing

- Phase 4 Year 2 (Month 24-30): Negotiate partner-carrier Master Services Agreement (12-18 months legal + product-fit lead time).
- Phase 4 Year 2 end (Month 30-36): Pilot at Marketplace checkout in Portsmouth NH + Manchester NH.
- Phase 5 Year 1: Roll out across all US metros + Canada (Canada requires separate carrier partnership; recommend Intact Insurance).

---

## 3. Sherpa Banking — pro-focused business banking

### The problem

Pros who run their work as Limited Liability Companies struggle to get good business banking: traditional banks treat trade businesses as high-risk, neobanks (Mercury, Brex) cater to technology-startup customers, and the pro's banking flow doesn't connect to job payouts, expense management, or the Sherpa Pros ecosystem.

### The product

A Sherpa-branded business banking account, white-labeled via Mercury or Brex partnership. Features:

- **Account opens at Sherpa pro onboarding.** New pros optionally open a Sherpa Banking account as part of the onboarding flow. Single Know Your Customer pass.
- **Instant access to Stripe Connect payouts.** Job payments hit the Sherpa Banking account same-day instead of the standard 2-day Stripe payout window. Payment timing is a top pro-pain-point and a clear value prop.
- **Expense management integration.** Sherpa Smart Scan auto-categorizes receipts and reconciles them against the Sherpa Banking account transactions. Pros get a one-click Schedule C-ready expense report at year end.
- **Cross-sell to Sherpa Lending.** Pros with Sherpa Banking accounts get pre-qualified for Sherpa Lending lines (no separate application) and lower Annual Percentage Rate (banking relationship reduces credit risk).

### Vendor and partner strategy

**Mercury or Brex partnership.** Both offer white-label business banking via their Banking-as-a-Service Application Programming Interfaces. Mercury preferred for trade-business fit (less startup-coded brand voice). Brex preferred if Sherpa wants integrated corporate cards. Decision deferred to Phase 4 Year 2.

**Banking-as-a-Service partner under the hood.** Mercury and Brex use their own bank-partners (Choice Financial Group, Column NA, Evolve Bank). Sherpa Pros is two layers from the Federal Deposit Insurance Corporation-insured bank but does not need to be a bank itself.

### Revenue model

- **Interchange fees.** Each card transaction pays Sherpa ~1.5%-2.5% of swipe volume (industry-standard interchange revenue-share with Banking-as-a-Service partner).
- **Interest on float.** Cash held in Sherpa Banking accounts earns interest; revenue-shared with Banking-as-a-Service partner.
- **Cross-sell to Sherpa Lending.** Banking accounts as a Sherpa Lending acquisition channel — lower Customer Acquisition Cost, higher conversion.
- **Subscription tier (optional Phase 5).** Premium Sherpa Banking tier with higher Federal Deposit Insurance Corporation-sweep limits, dedicated banker, integrated tax services. $25-$50/month.

### Phasing

- Phase 4 Year 2 (Month 24-30): Partner selection (Mercury vs Brex) + Master Services Agreement.
- Phase 4 Year 2 end (Month 30-36): Pilot launch with 100-200 Founding pros.
- Phase 5 Year 1: Roll out to all pros nationally.

---

## 4. Sherpa Pay-Later — Buy Now Pay Later on jobs >$2K

### The problem

Large jobs (kitchen remodel $30K, full bath remodel $18K, exterior siding $25K) get held back by client cash-flow constraints. Clients want the work done; clients can't write a $30K check today. Today the workaround is the pro accepting payment in installments — which means the pro absorbs the financing risk.

### The product

Buy Now Pay Later option at Marketplace job checkout for jobs >$2K. Client splits payment 4 months (interest-free, lender absorbs cost) or 12 months (interest-bearing, client pays). Pro receives full payment upfront from the lender.

**Vendor partner.** Affirm or Klarna. Both have established Buy Now Pay Later infrastructure for high-ticket purchases. Affirm preferred for North American focus + transparent-finance brand alignment. Klarna preferred if Sherpa expands internationally where Klarna has stronger presence (United Kingdom, European Union).

### Revenue model

- **No transaction fee to client (4-month interest-free).** Lender absorbs cost; lender is paid by Sherpa via Sherpa-Pay-Later partner kickback.
- **Standard Buy Now Pay Later kickback to Sherpa.** Industry-standard 2%-4% of transaction value paid by Affirm/Klarna to merchant for Buy Now Pay Later origination.
- **Pro paid in full upfront.** Pro experience improves; conversion lifts on larger jobs (industry benchmark: 20%-40% conversion lift on >$2K transactions when Buy Now Pay Later is offered).

### Phasing

- Phase 4 Year 3 (Month 30-36): Partner selection + integration (3-6 months work).
- Phase 5 Year 1: Pilot in 3 metros, measure conversion lift on >$2K jobs.
- Phase 5 Year 2: Roll out nationally + Canada (Canada via Affirm Canada).

---

## 5. Hub-side payment processing

### The problem

Sherpa Hubs accept multiple payment streams: per-transaction kit sales, equipment rental fees, training-event registration fees, materials pickup payments, manufacturer-sponsored event ticketing. Phase 0-3 used a patchwork of Stripe Checkout links, manual invoicing, and Square card readers.

### The product

Unified Hub-side payment processing using Stripe Terminal (preferred — same Stripe Connect infrastructure already in place for Marketplace) or Square (if Stripe Terminal hardware availability is constrained in international markets).

Each Hub gets a Stripe Terminal hardware kit, integrated with Sherpa Hub's existing inventory + training + rental software modules. Single payment pipeline, single reconciliation surface, single chargeback workflow.

### Revenue model

- **Standard payment processing margin.** Sherpa nets 20-50 basis points on Hub transaction volume (above the Stripe processing cost of 2.6% + $0.10).
- **Membership tier.** Hub franchisees pay Sherpa for the integrated payment + Point-of-Sale solution as part of the franchise package; bundled into franchise royalty.

### Phasing

- Phase 4 Year 1 (Month 18-21): Stripe Terminal deployed at Hub #1 (Portsmouth NH).
- Phase 4 Year 1 end (Month 21-30): Roll out across all 6 hubs.
- Phase 4 Year 2: Standard for all new franchisee hubs.

---

## 6. Phasing summary table

| Product | Pilot launch | Production launch | Estimated Year-2 revenue contribution |
| --- | --- | --- | --- |
| Sherpa Lending | Phase 4 Year 1 (M18-30) | Phase 4 Year 2 (M30-36) | $1.5M-$3.5M (origination fees + interest share) |
| Sherpa Insurance | Phase 4 Year 2 (M30-36) | Phase 5 Year 1 | $0.5M-$1M Year 1, $2M-$5M at Phase 5 Year 2 |
| Sherpa Banking | Phase 4 Year 2 (M30-36) | Phase 5 Year 1 | $0.3M-$0.7M Year 1, $1.5M-$3M at Phase 5 Year 2 |
| Sherpa Pay-Later | Phase 4 Year 3 (M30-36) integration | Phase 5 Year 1 pilot | $0.4M-$1M Year 1, $2M-$4M at Phase 5 Year 2 |
| Hub-side payment processing | Phase 4 Year 1 (M18-21) | Phase 4 Year 1 end (M21-30) | $0.2M-$0.5M (low-margin, high-strategic-value) |
| **Embedded fintech total** | --- | --- | **~$3M-$7M Year 1, ~$8M-$15M Year 2** |

Embedded fintech becomes ~10% of Phase 4 Year 2 revenue, ~15% of Phase 5 Year 1 revenue (per Series C deck Slide 6 take-rate cluster mix).

---

## 7. Compliance and risk

### Regulatory map

- **Sherpa Lending.** State-by-state lending licenses (Department of Banking and Insurance per state). Truth in Lending Act disclosures. Equal Credit Opportunity Act fair-lending compliance. Phase 4 Year 1 partner-bank model defers Sherpa's own licensing burden; Phase 5 Year 2+ may require Sherpa to license in priority states.
- **Sherpa Insurance.** Insurance producer license per state (where Sherpa earns commission). Partner-carrier holds underwriting risk; Sherpa is the distribution layer.
- **Sherpa Banking.** Money Transmitter License analysis per state (depends on whether Sherpa "holds" customer funds — partner-bank model designed to avoid this). Bank Secrecy Act / Anti-Money-Laundering compliance falls to partner-bank.
- **Sherpa Pay-Later.** Lender (Affirm/Klarna) holds the loan; Sherpa is merchant-of-record, not lender. Compliance burden falls primarily to the Buy Now Pay Later partner.

### General Counsel hire

General Counsel (Phase 4 Month 12 hire) leads regulatory map maintenance + outside counsel coordination + state-by-state licensing matrix. Embedded fintech is the #1 reason General Counsel hire is essential by Phase 4 Year 1.

### Director of Compliance hire

Director of Compliance (Phase 4 Year 2 hire, estimated M30) reports to General Counsel. Owns ongoing compliance operations: state license renewals, Anti-Money-Laundering monitoring, bias-audit coordination with Artificial Intelligence team, Sarbanes-Oxley Section 404 readiness for Initial Public Offering pathway.

---

## 8. Out of scope (deferred to Phase 5+)

- **Cryptocurrency payment rails.** Deferred — regulatory and brand-trust risks outweigh demand from pro and client base.
- **Sherpa Wealth (pro retirement / SEP IRA / Solo 401k).** Deferred to Phase 5 Year 2; logical extension of Sherpa Banking.
- **Sherpa Tax (integrated tax filing for pros).** Deferred to Phase 5 Year 2; partnership candidate: Keeper Tax or Collective.
- **Sherpa-branded payment cards (Sherpa Card).** Deferred to Phase 5 Year 1 if Sherpa Banking adoption supports it; physical card cost + fraud risk currently exceed projected revenue.
- **International embedded fintech.** Each country requires separate fintech partnerships and regulatory analysis. Phase 4 Year 2 Canada-only embedded fintech evaluation; Phase 5 Year 1+ for other countries.

---

## Owner sign-off

This roadmap is owned by:
- Phyrom (founder)
- Chief Financial Officer (Phase 4 Month 6 hire)
- General Counsel (Phase 4 Month 12 hire)
- Head of Embedded Fintech (Phase 4 Year 2 hire, reports to Chief Financial Officer)

Reviewed quarterly at executive team meeting. Compliance component reviewed monthly with outside counsel.
