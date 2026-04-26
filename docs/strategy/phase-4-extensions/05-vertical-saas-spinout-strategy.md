---
title: Sherpa Pros — Trades-Vertical Software-as-a-Service Spinout Strategy (Phase 5+)
date: 2026-04-25
status: draft
owner: Phyrom (founder), Chief Financial Officer (Phase 4 Month 6 hire), Vice President Engineering (Phase 4 Month 0 promotion), future Head of Software-as-a-Service Platform (Phase 5 Year 1 hire)
references:
  - docs/superpowers/handoff/2026-04-25-phase-4-parallel-execution.md
  - docs/strategy/phase-4-extensions/01-series-c-pitch-deck-design.md (Slide 17)
  - docs/strategy/phase-4-extensions/02-acquisition-track-strategic-analysis.md
  - docs/operations/sherpa-product-portfolio.md
classification: Confidential — board materials
---

# Trades-Vertical Software-as-a-Service Spinout Strategy

## Purpose

Sherpa Pros is built first as a marketplace + Hub network + embedded fintech platform. But underneath the consumer-and-pro-facing surfaces are four engineering platforms — Sherpa codes engine, Sherpa Materials engine, Sherpa Score, and Dispatch matching — that are best-in-class Business-to-Business Software-as-a-Service products in their own right. This document is the strategy for productizing those engines as Application Programming Interface-first Software as a Service offerings sold to other platforms (Procore, BuilderTrend, JobNimbus, ServiceTitan, Housecall Pro, insurance carriers, and adjacent vertical marketplaces) starting in Phase 5.

**The core thesis.** Building a code-aware, materials-aware, score-aware, dispatch-aware platform takes 4-6 years and $50M-$100M of investment. Competitors in adjacent verticals (commercial construction Software as a Service, residential service trades Software as a Service, restoration Software as a Service) would rather pay $2-$25/month/seat to license these capabilities than rebuild them. The Software-as-a-Service spinouts monetize that build-vs-buy gap.

**Phyrom's stated preference.** The Software-as-a-Service spinouts are Phase 5 surfaces, not Phase 4 surfaces. Phase 4 stays focused on international + franchise + embedded fintech. The spinouts are spec'd here so that Phase 4 engineering decisions (Application Programming Interface design, modularization, monitoring) keep the Phase 5 spinout option alive instead of foreclosing it.

---

## 1. The four spinout-candidate engines, ranked

### 1.1 Sherpa codes engine — the highest-value spinout

**What it does.** Application Programming Interface for code-aware permit and bid generation. Given a job description (square footage, scope, jurisdiction), the engine returns:

- Applicable codes (National Electrical Code, International Residential Code, state codes, municipal amendments, fire-rated assembly requirements).
- Required permits (which jurisdictions, which permit types, which fees, which inspection schedule).
- Permit-application paperwork (auto-filled per jurisdiction).
- Code-violation flags on the bid (e.g., "this scope requires a 20-amp circuit on a dedicated branch per National Electrical Code 210.11(C)(2)").
- Rebate eligibility (Mass Save, National Grid, Inflation Reduction Act federal tax credits).

**Why it spins out.** Code intelligence is the single hardest moat to build in the Sherpa Pros stack. It took 12+ years of working-contractor experience (Phyrom + advisors) plus 192 codes × 480K entries × 284 NH municipal amendments to assemble. No competitor will build this from scratch — they will license it.

**Targets.**
- **Procore.** Procore's commercial customers desperately want code intelligence inside their bid workflow. Procore pays Sherpa Application Programming Interface fees per call, embeds in their existing user interface.
- **BuilderTrend / JobNimbus / CoConstruct.** Residential general contractor Software as a Service tools. Same value prop, smaller seat base.
- **ServiceTitan.** Service-trades Software as a Service. Code intelligence for HVAC + electrical + plumbing is high-value; ServiceTitan's customer base is large.
- **Code-research tools (UpCodes, BSDcodes, ICCsafe).** Lower value (these are competitors at the document layer, not at the bid-generation layer) but possible licensing partners.

**Pricing model.** Two pricing tiers:
- **Per-Application-Programming-Interface-call:** $0.05-$0.50 per call depending on jurisdiction complexity (NH municipal vs. simple state-only). Best for low-volume customers.
- **Enterprise tier:** $5K-$25K per month for unlimited Application Programming Interface usage + Service Level Agreement + dedicated support. Best for Procore-tier customers.

**Estimated revenue at scale.** $8M-$15M Annual Recurring Revenue by Phase 5 Year 3 if Procore + BuilderTrend + 1-2 other strategic customers sign on.

### 1.2 Sherpa Materials engine — the second-highest-value spinout

**What it does.** Application Programming Interface for materials orchestration. Given a job (or kit specification), the engine:

- Identifies the optimal supplier (price, distance, in-stock availability, delivery time).
- Routes the order across multiple rails: Zinc Application Programming Interface (Home Depot Pro Desk + Lowe's For Pros), Uber Direct (last-mile delivery), First Webb partnership network (regional supply houses), direct-from-manufacturer (Schluter, Laticrete).
- Returns a single tracking surface and Application Programming Interface for the calling platform.

**Why it spins out.** Materials orchestration is a multi-rail integration problem that takes 18-24 months to build per major supplier. Sherpa already built it for the Sherpa Marketplace + Sherpa Hub use case; spinning it out to other platforms is leverage on existing infrastructure.

**Targets.**
- **Home Depot Pro Desk + Lowe's For Pros.** Both want their pro customers to order materials from anywhere (mobile, third-party software) and have the order routed to the optimal store. Sherpa Materials engine is the routing layer they'd license.
- **Procore.** Procore Materials is a Procore product line. Sherpa Materials engine could power it (or compete with it; partnership economics depend).
- **Regional supply houses (Lansing Building Products, US LBM Holdings).** Large regional supply distributors want Application Programming Interface access to Sherpa's pro demand and Sherpa Hub network.

**Pricing model.** Percentage of materials moved through the Application Programming Interface: 1%-3% take rate. Higher than competitor margins but justified by orchestration value (the calling platform doesn't need to build supplier integrations).

**Estimated revenue at scale.** $12M-$25M Annual Recurring Revenue by Phase 5 Year 3 (assumes $400M-$800M Gross Merchandise Value flowing through Application Programming Interface at 3% take).

### 1.3 Sherpa Score Application Programming Interface — the third-highest-value spinout

**What it does.** Application Programming Interface for pro-trust scoring. Given a pro identifier (license number, business name, business address), returns Sherpa Score (0-100) + breakdown by pillar (Quality, Communication, Reviews) + per-trade-category sub-scores.

**Why it spins out.** Sherpa Score is a proprietary trust signal that no other platform has access to. Insurance carriers, home-services platforms, trade-school placement programs, and any platform that needs to vet trade pros would license the Score rather than build their own.

**Targets.**
- **Insurance carriers (Travelers, Chubb, Liberty Mutual, Hippo).** Sherpa Score as input to commercial-general-liability underwriting for trade pros. Higher Score = lower premium = competitive advantage for the carrier.
- **Home-services platforms (HomeAdvisor, Houzz Pro, Porch).** Pro-vetting input. These are quasi-competitors to Sherpa Marketplace, but they'd license the Score for vetting their pros even while competing with us on demand-side.
- **Trade-school placement programs (NCCER, ABC, AGC).** Recent graduate placement programs use Sherpa Score for outcomes tracking.
- **Real-estate-maintenance platforms (Latchel, Maintenance Made Simple).** Pro-vetting for property-management pro networks.

**Pricing model.** $1-$10 per scored pro per month depending on use case (insurance underwriting commands premium pricing; bulk vetting is lower-tier).

**Estimated revenue at scale.** $5M-$10M Annual Recurring Revenue by Phase 5 Year 3.

### 1.4 Dispatch Wiseman matching engine Application Programming Interface — the fourth-highest-value spinout

**What it does.** Application Programming Interface for best-pro-for-job matching. Given a job (description, location, budget) and a pool of pros (loaded by the calling platform), the engine returns a ranked list of pros most likely to accept + complete the job successfully, with explanation.

**Why it spins out.** Dispatch is the Phase 4 Machine Learning model with built-in fairness constraints. Smaller marketplaces and insurance restoration networks benefit from Sherpa's matching expertise without building the model themselves.

**Targets.**
- **Smaller vertical marketplaces.** Pet-services marketplaces, beauty-services marketplaces, etc., where matching is a non-trivial problem and the marketplace is sub-scale to invest in their own model.
- **Insurance restoration networks (Servpro, ServiceMaster, Belfor).** When insurance claim opens, restoration network needs to dispatch a pro fast. Sherpa Dispatch as Application Programming Interface accelerates this.
- **Real-estate-maintenance platforms.** Maintenance request comes in; platform dispatches via Sherpa Dispatch.

**Pricing model.** Percentage of Gross Merchandise Value transacted via Application Programming Interface (0.5%-2%) OR per-match fee ($5-$25 per successful match). Customer chooses based on volume profile.

**Estimated revenue at scale.** $3M-$6M Annual Recurring Revenue by Phase 5 Year 3 (smaller market than codes/Materials/Score).

### Combined Software-as-a-Service spinout revenue at Phase 5 Year 3

| Spinout | Estimated Annual Recurring Revenue | Margin profile |
| --- | --- | --- |
| Sherpa codes engine Application Programming Interface | $8M-$15M | 70%-80% gross margin |
| Sherpa Materials engine Application Programming Interface | $12M-$25M | 30%-40% gross margin (volume-pass-through) |
| Sherpa Score Application Programming Interface | $5M-$10M | 80%-90% gross margin |
| Dispatch Wiseman Application Programming Interface | $3M-$6M | 80%-90% gross margin |
| **Combined** | **$28M-$56M** | **Blended ~55%-65% gross margin** |

By Series C+24 months (Phase 5 Year 2-3), Software-as-a-Service spinouts contribute meaningful revenue + high-quality margin profile that improves overall company unit economics.

---

## 2. Spinout structure decision

The board decides between three structures for the Software-as-a-Service spinouts. The recommendation evolves with revenue scale.

### Structure A: Software-as-a-Service revenue line inside Sherpa Pros LLC

**Description.** Spinout engines are productized but stay inside Sherpa Pros LLC as a Business-to-Business Software-as-a-Service revenue line. Same balance sheet, same equity, same tax filings.

**Pros.**
- Simplest structure. No new entity creation.
- Tightest integration with the marketplace + Hub + fintech surfaces.
- Cross-sell easier (a Procore customer who licenses Sherpa codes engine is a candidate for Sherpa Marketplace integration on the consumer side).
- Tax-loss-carryforward and credit utilization stays consolidated.

**Cons.**
- Software-as-a-Service revenue gets blended into marketplace revenue at investor reporting time, possibly suppressing the Software-as-a-Service multiple.
- Software-as-a-Service customer-acquisition motion (sales team, customer-success team) sits inside a marketplace company, which is operationally awkward.
- A future Software-as-a-Service spinout exit is harder to extract.

**When this is the right structure.** Phase 5 Year 1-2, when Software-as-a-Service revenue is <$30M Annual Recurring Revenue and the marketplace + Hub remain the primary growth engine.

### Structure B: Spin out as separate Delaware C-corporation with Sherpa Pros as 80% owner

**Description.** Sherpa Pros LLC creates a new Delaware C-corp, "Sherpa Platforms Inc." (working name; subject to brand review). Sherpa Pros LLC owns 80%; the remaining 20% is reserved for the new Sherpa Platforms Inc. employee equity pool (incentivizes Software-as-a-Service-dedicated employees with equity in the company they build).

**Pros.**
- Clean separation between marketplace economics and Software-as-a-Service economics. Investors can value each separately.
- Software-as-a-Service-dedicated equity pool incentivizes Software-as-a-Service team without diluting Sherpa Pros LLC cap table.
- A future Software-as-a-Service spinout sale or Initial Public Offering is structurally cleaner.
- Possible to take outside investment into Sherpa Platforms Inc. without diluting Sherpa Pros LLC.

**Cons.**
- Significant legal + accounting overhead to set up and maintain (transfer pricing between entities, intercompany agreements, separate audits).
- Complicates Sherpa Pros LLC's own Initial Public Offering pathway if the parent company wants to take Sherpa Pros LLC public including the Software-as-a-Service surfaces.
- Cap-table complexity on a future combined exit.

**When this is the right structure.** Phase 5 Year 2-3, when Software-as-a-Service revenue exceeds $30M Annual Recurring Revenue and the Software-as-a-Service business has its own meaningful P&L profile.

### Structure C: Full divestiture (spin out + sell to a Software-as-a-Service-focused buyer)

**Description.** Sherpa Pros LLC spins out the Software-as-a-Service engine as a separate entity and either sells it outright to a strategic buyer or takes it public separately.

**Pros.**
- Maximum value extraction if a Software-as-a-Service-focused buyer values the spinout above what the integrated structure prices it at.
- Full focus for the spinout team — they're not constrained by marketplace decisions.
- Simplifies the Sherpa Pros LLC story for its own exit (smaller, cleaner business).

**Cons.**
- Loses the integration moat (Sherpa codes engine is more valuable when it's connected to Sherpa Marketplace + Sherpa Hub data).
- Loses the cross-sell flywheel.
- Risk that the divested entity competes with Sherpa Pros LLC over time (e.g., Procore acquires the Sherpa codes engine spinout and then builds a competing residential marketplace).

**When this is the right structure.** Only if a strategic buyer values the Software-as-a-Service spinout at a price that exceeds the present value of keeping it integrated. Likely Phase 5 Year 4+ scenario.

---

## 3. Phasing

### Phase 4 Year 2 (Months 24-30): Software-as-a-Service-readiness investments inside Sherpa Pros engineering

These are not spinouts yet — they are engineering decisions made during Phase 4 that keep the Phase 5 spinout option alive:

- **Sherpa codes engine Application Programming Interface beta** released to 2-3 friendly partners (Procore corporate development relationship from `02-acquisition-track-strategic-analysis.md` provides a natural channel). Goal: validate that an external customer can integrate the Application Programming Interface and that the Application Programming Interface design is portable beyond Sherpa Pros' own use cases.
- **Application Programming Interface design and documentation discipline** baked into all four candidate engines. Even when used internally, treat the Application Programming Interface as a public contract.
- **Modularization** of code that today is tightly coupled to Sherpa Pros' own database and authentication. Refactor toward portable cores.
- **Monitoring and observability** at the Application Programming Interface layer (separate from product-feature monitoring), so that spinout customers can be served at Software-as-a-Service-grade reliability.

### Phase 5 Year 1 (Months 36-48): Sherpa codes engine Application Programming Interface to General Availability

- Sherpa codes engine Application Programming Interface released to General Availability.
- 5-10 paying customers, $1M-$3M Annual Recurring Revenue at year-end.
- Sherpa Materials engine Application Programming Interface to closed-beta with 2-3 friendly partners.
- Hire Head of Software-as-a-Service Platform (estimated Phase 5 Month 6).

### Phase 5 Year 2 (Months 48-60): Sherpa Materials engine Application Programming Interface to General Availability

- Sherpa Materials engine Application Programming Interface to General Availability.
- $5M-$15M combined Software-as-a-Service Annual Recurring Revenue.
- Sherpa Score Application Programming Interface to closed-beta with insurance-carrier partner.
- Evaluate Structure B (separate Delaware C-corp) at Phase 5 Year 2 board meeting.

### Phase 5 Year 3 (Months 60-72): Full Software-as-a-Service portfolio

- All four spinout engines available as Application Programming Interface products.
- $28M-$56M combined Software-as-a-Service Annual Recurring Revenue.
- Software-as-a-Service-dedicated sales team (3-5 enterprise account executives).
- Customer-success team for Software-as-a-Service customers.
- Marketing motion for developer-and-platform audience (separate from consumer-and-pro marketing).

### Phase 5 Year 4+ (Months 72+): Strategic optionality

- Decide between Structure A (continue inside Sherpa Pros LLC), Structure B (separate Delaware C-corp), or Structure C (divestiture).
- Decision drivers: combined Software-as-a-Service revenue, Sherpa Pros LLC's own exit path (strategic acquisition vs Initial Public Offering), strategic buyer interest in Software-as-a-Service spinouts.

---

## 4. Risk and counter-arguments

### Counter-argument 1: "Software-as-a-Service spinouts compete with Sherpa Marketplace."

If Procore licenses Sherpa codes engine and uses it inside their Software-as-a-Service to support residential general contractors, are they competing with Sherpa Marketplace? Possibly yes — the codes-engine licensee might use the Application Programming Interface to power a competing residential marketplace.

**Mitigation.** Application Programming Interface license terms can include non-compete clauses that prohibit using the codes engine to power a competing trade marketplace. This is contractually enforceable; whether it's strategically wise depends on the customer.

### Counter-argument 2: "Software-as-a-Service spinouts dilute focus."

Sherpa Pros' founder and executive team should focus on marketplace + Hub + international + franchise. Software-as-a-Service spinouts are a different motion (Application Programming Interface developer relations, enterprise sales, multi-tenant operations).

**Mitigation.** Defer Software-as-a-Service spinouts to Phase 5. Don't launch any of them in Phase 4. Hire a dedicated Head of Software-as-a-Service Platform (Phase 5 Year 1) so they have an owner with separate Profit and Loss accountability.

### Counter-argument 3: "Software-as-a-Service spinouts give competitors our moat."

Sherpa codes engine is the deepest moat. Licensing it to Procore shrinks Sherpa's competitive advantage in the long run.

**Mitigation.** Phyrom's read is that the moat is the integrated stack (codes + materials + score + dispatch + marketplace), not codes alone. Licensing one component doesn't cede the whole. And: charging Procore for the Application Programming Interface generates revenue we can reinvest into widening the moat (better Machine Learning models, more code coverage, more jurisdictions).

### Risk: insurance carrier locks in exclusive license to Sherpa Score Application Programming Interface

**Scenario.** Travelers offers Sherpa $50M for an exclusive 5-year license to Sherpa Score Application Programming Interface. Tempting, but exclusivity locks out other carriers + reduces optionality.

**Mitigation.** Default to non-exclusive licensing. Only consider exclusive deals with significant premium and short tenor (12-18 months max).

---

## 5. Phase 4 commitments to keep Phase 5 spinout option alive

The Phase 4 engineering team makes the following commitments now so that Phase 5 spinouts are possible:

1. **Application Programming Interface contract discipline.** All four engines expose stable Application Programming Interfaces. Breaking changes require deprecation periods.
2. **Multi-tenancy readiness.** Code is built with future multi-tenant operation in mind, even when used internally for Sherpa Pros only.
3. **Documentation.** Application Programming Interface documentation is maintained at Software-as-a-Service-grade (OpenAPI specifications, SDK examples, error references).
4. **Authentication separation.** Application Programming Interface authentication is decoupled from Sherpa Pros user authentication so external customers can authenticate as their own organization.
5. **Rate limiting + Service Level Agreement infrastructure.** Built into the Application Programming Interface gateway from day one.
6. **Logging + audit trail.** Per-customer Application Programming Interface usage logging for billing + Service Level Agreement tracking.

These commitments cost engineering ~10%-15% extra effort in Phase 4. They are paid back many times over in Phase 5.

---

## Owner sign-off

This strategy is owned by:
- Phyrom (founder)
- Chief Financial Officer (Phase 4 Month 6 hire)
- Vice President Engineering (Phase 4 Month 0 promotion)
- Head of Software-as-a-Service Platform (Phase 5 Year 1 hire)

Reviewed semi-annually at board meeting beginning Phase 4 Year 2.
