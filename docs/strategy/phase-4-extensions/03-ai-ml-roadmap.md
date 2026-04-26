---
title: Sherpa Pros — Artificial Intelligence and Machine Learning Roadmap (Phase 4)
date: 2026-04-25
status: draft
owner: Phyrom (founder), Vice President Engineering (Phase 4 Month 0 promotion), future Head of Machine Learning (Phase 4 Year 2 hire)
references:
  - docs/superpowers/handoff/2026-04-25-phase-4-parallel-execution.md
  - docs/strategy/phase-4-extensions/06-phase-4-okrs-and-measurement-framework.md
  - src/lib/dispatch-wiseman/ (existing rule-based matching algorithm)
  - CLAUDE.md (Wiseman is internal only — never expose externally)
classification: Internal — engineering + executive team
---

# Artificial Intelligence and Machine Learning Roadmap — Phase 4

## Purpose

This document is the Phase 4 Artificial Intelligence and Machine Learning roadmap. Phase 0-3 used Artificial Intelligence in narrow, rule-based ways (Sherpa Score scoring rubric, Dispatch matching with hand-tuned weights, Sherpa Smart Scan basic Optical Character Recognition). Phase 4 evolves the platform from "rule-based with some Machine Learning sprinkled on top" to "Machine Learning at the core of every high-leverage decision," while maintaining the brand-locked rule that "Wiseman" is the internal label and never appears in user-facing surfaces.

**Vendor and infrastructure default.** Per session reminder and `CLAUDE.md` design discipline, Large Language Model calls flow through Vercel Artificial Intelligence Gateway with Anthropic Claude Sonnet (latest production-grade model) as the default model family. Specialized Machine Learning workloads (anomaly detection, time-series forecasting, vision) run on Amazon Web Services SageMaker or Google Cloud Vertex AI depending on team familiarity at hire time.

**Bias and fairness mandate.** Every Machine Learning model that influences pro outcomes (Sherpa Score, Dispatch, Pricing intelligence) is subject to quarterly bias audits with quantified fairness metrics surfaced on the Datadog dashboard. Annual external bias review by an independent third-party auditor (recommend Parity AI or O'Neil Risk Consulting and Algorithmic Auditing).

---

## 1. Sherpa Score evolution

### Current state (Phase 0-3)

Sherpa Score is a deterministic scoring rubric: 12 metrics across 3 pillars (Quality 50% / Communication 25% / Reviews 25%) combined with hand-tuned weights to produce a 0-100 score per pro. The rubric is explainable, gameable in narrow ways, and uniformly weighted across all trade categories.

### Phase 4 evolution

**Per-trade-category Machine Learning-trained weighting.** Different trades have different success-defining metrics. Electrical work weights "code-pass rate on first inspection" higher than plumbing, which weights "leak-back-call rate within 30 days" higher. The Phase 4 model:

- Trains a separate weight vector for each of the 37 service categories.
- Training data: 5,000+ completed jobs per category by Phase 4 Year 1, 25,000+ by Year 2.
- Loss function: predicted vs actual job-outcome rating (5-star) within 30 days of completion.
- Model class: gradient-boosted trees (XGBoost or LightGBM) for explainability + ability to surface feature importance to pros.

**Pre-dispatch performance prediction.** Before Dispatch routes a job to a specific pro, the platform predicts the probability that this specific pro completes this specific job successfully (5-star, on-time, no rework). The prediction surfaces inside the Dispatch decision engine and feeds back into the routing weight.

**Anomaly detection on Score manipulation.** Pros who climb the Score abnormally fast, who get suspicious cluster-of-5-star reviews from new client accounts, or whose review IP-address pattern looks coordinated are auto-flagged for human review. Model: isolation forest + manual rules layered. Owner: Trust + Safety team (formed Phase 4 Year 1).

### Vendor and build-vs-buy

**Build internally.** Sherpa Score is a strategic moat; outsourcing the scoring engine to a third party is unacceptable. Build with in-house Machine Learning team (Head of Machine Learning hire Phase 4 Year 2, supported by 2-3 Machine Learning engineers).

### Phasing

- Phase 4 Year 1 (Month 18-30): Per-category weighting model trained and shadow-tested against rule-based baseline.
- Phase 4 Year 2 (Month 30-36): Per-category Machine Learning model becomes production primary; rule-based fallback maintained for explainability.
- Phase 5 Year 1: Pre-dispatch performance prediction goes live in Dispatch decision engine.
- Phase 5 Year 2: Anomaly detection goes live with Trust and Safety team triage workflow.

---

## 2. Dispatch Wiseman Machine Learning uplift

### Current state

Dispatch Wiseman uses 7-factor rule-based scoring: license + certification + skill + geography + Sherpa Score + responsiveness + recent activity. Weights are hand-tuned and uniform across job types.

### Phase 4 evolution

**Predicted job-completion success per pro-job pairing.** Instead of "best pro within radius by composite score," Dispatch optimizes "highest probability of job-completion success across all candidate pros, weighted by Gross Merchandise Value contribution." Training data: prior job outcomes joined to pro Score + job complexity + geography + time-of-day + weather + seasonality + pro recent-load. Model class: deep neural network (PyTorch via SageMaker) — moves beyond gradient-boosted trees because feature interactions are complex.

**Routing optimization to maximize platform Gross Merchandise Value, not just pro acceptance rate.** Today Dispatch routes to the pro most likely to accept; tomorrow Dispatch routes to the pro most likely to accept AND complete AND drive ancillary revenue (materials uplift, Sherpa Hub kit pull, Sherpa Lending working-capital draw). Multi-objective optimization with weights tunable by metro and product mix.

**Fairness constraint.** Routing must not systematically disadvantage minority-owned pros, women-owned pros, or other protected categories. Fairness constraint: per-category match rate within +/- 10% of baseline match rate across protected groups. Constraint enforced at training time (fairness loss term added) and audited monthly.

### Vendor and build-vs-buy

**Build internally.** Dispatch is a strategic moat. Vendor consideration ruled out.

### Phasing

- Phase 4 Year 1 (M18-30): Predicted job-completion success model trained on Phase 0-3 data, shadow-tested.
- Phase 4 Year 2 (M30-36): Production rollout per metro (start: Portsmouth NH, then Manchester NH, then Boston, then everywhere).
- Phase 5 Year 1: Multi-objective Gross Merchandise Value optimization layered on top.
- Ongoing: Quarterly fairness audit cadence.

---

## 3. Predictive materials demand forecasting

### Current state

Sherpa Materials engine is reactive: pro orders kit, Materials engine routes order to closest supplier with stock. No forecasting layer.

### Phase 4 evolution

**Per-Hub + per-metro materials demand forecasting.** Forecasting model predicts kit demand 7, 30, and 90 days ahead per Hub. Reduces inventory carrying cost (less safety stock needed) and improves Sherpa Materials on-time delivery rate (kits pre-positioned at Hub before pro orders).

**Inputs.** Historical job-materials lists (Sherpa Marketplace job → Sherpa Materials kit pulls), seasonality (heating-season kits spike October-January, cooling-season kits spike May-August), weather forecast (storm-prep kits spike before forecast severe weather), permit data (large permits filed in metro = upcoming materials demand).

**Outputs.** Per-Hub-per-Stock-Keeping-Unit demand forecast. Auto-generated reorder recommendations to Hub Operations Manager. Sherpa Materials engine pre-positions inventory accordingly.

### Vendor and build-vs-buy

**Hybrid: build core forecasting in-house, buy retail-forecasting horizontal product if scale demands it.** Initial build with internal Machine Learning team (time-series models: Prophet or Temporal Fusion Transformer). At Phase 5 scale (30+ hubs), evaluate buying RELEX Solutions or Blue Yonder for retail demand forecasting at scale. Cost-benefit at evaluation time.

### Phasing

- Phase 4 Year 1 (M18-30): In-house Prophet-baseline forecast for Hub #1 and #2.
- Phase 4 Year 2 (M30-36): Roll out to all 6 hubs.
- Phase 5 Year 1: Evaluate vendor (RELEX or Blue Yonder) when network scales beyond 12 hubs.

---

## 4. Sherpa Smart Scan Optical Character Recognition + entity extraction

### Current state

Sherpa Smart Scan uses commodity Optical Character Recognition (Amazon Textract) to extract text from receipts, blueprints, permits. No structured entity extraction; pro manually categorizes each scan.

### Phase 4 evolution

**Trained models for permit number extraction.** Permit documents have structure (permit number, property address, jurisdiction, expiration date, work-type code). Train a fine-tuned model to extract these fields with confidence scoring. When confidence < threshold, route to human review.

**Trained models for blueprint dimension extraction.** Blueprint dimensions (square footage, ceiling height, room counts) feed directly into Sherpa codes engine for code-aware bid generation. Extracting these reliably eliminates a multi-hour manual takeoff per blueprint.

**Receipt categorization auto-tagging.** For pros: auto-tag receipts with Schedule C codes (Internal Revenue Service business expense categories). For Property Manager tier: auto-tag receipts as Capital Expenditure vs Operating Expense. Powered by fine-tuned Large Language Model (Claude Sonnet via Vercel Artificial Intelligence Gateway) reading the OCR'd text + image context.

### Vendor and build-vs-buy

**Buy + customize.** Amazon Web Services Textract for Optical Character Recognition core (already integrated). Anthropic Claude Sonnet (via Vercel Artificial Intelligence Gateway) for entity extraction and categorization. Custom fine-tuning on Sherpa Pros' own labeled corpus (1,000+ receipts, 500+ permits, 200+ blueprints by Phase 4 Year 1).

### Phasing

- Phase 4 Year 1 (M18-30): Permit number extraction + blueprint dimension extraction in beta.
- Phase 4 Year 2 (M30-36): Receipt categorization auto-tagging in production for all pros + Property Manager tier customers.
- Phase 5 Year 1: Schedule C auto-tag accuracy >95% (current baseline: manual ~80%).

---

## 5. Customer support Artificial Intelligence

### Current state

Sherpa Success Manager team handles Property Manager + white-glove customer relationships manually. Sherpa Marketplace standard-tier support handled by a small Customer Support team via Intercom.

### Phase 4 evolution

**Sherpa Success Manager Artificial Intelligence co-pilot.** Sherpa Success Manager team gets an Artificial Intelligence co-pilot that:

- Drafts email and Short Message Service responses to common questions, reviewed by human before sending.
- Summarizes customer-conversation history before each call.
- Flags churn-risk signals (response-time elongation, sentiment shift, payment-method failure pattern).
- Auto-tracks ticket status and escalation cadence.

**Customer Support Tier 1 Artificial Intelligence.** For Sherpa Marketplace standard tier, Tier 1 questions (password reset, payment status, dispatch tracking) handled by Artificial Intelligence agent with 80%+ resolution rate without human escalation. Escalations to human Tier 2 routed with full conversation context.

### Vendor and build-vs-buy

**Buy.** Use Intercom Fin (Intercom's AI agent product) or Decagon for Customer Support Tier 1. Build the Sherpa Success Manager co-pilot in-house on Anthropic Claude Sonnet via Vercel Artificial Intelligence Gateway because Sherpa Success Manager workflow is too custom for commodity vendors.

### Phasing

- Phase 4 Year 1 (M18-30): Customer Support Tier 1 Artificial Intelligence pilot via Intercom Fin.
- Phase 4 Year 2 (M30-36): Sherpa Success Manager co-pilot in production.
- Phase 5 Year 1: Customer Support Tier 1 Artificial Intelligence handling 80%+ of inbound at <30-second response time.

---

## 6. Pricing intelligence

### Current state

Job pricing is largely set by pros bidding into a job posting (Project mode) or pulled from a pre-priced flat-rate menu (Quick Job mode). No per-metro-per-trade fair-pricing intelligence layer.

### Phase 4 evolution

**Per-job-per-metro-per-trade fair-pricing Machine Learning model.** Train on historical data: job acceptance rates as a function of bid price, completed-job prices, job outcomes, customer-satisfaction scores. The model predicts the "fair" price band per job class per metro. Three downstream uses:

1. **Help clients price jobs correctly.** When a homeowner posts a job, surface a price band ("similar jobs in your area cost $X-$Y") to set expectations and reduce time-to-first-bid.
2. **Help pros bid competitively.** When a pro views a job, surface "you'll likely win with a bid in $X-$Y range" suggestion (opt-in; respects pro autonomy).
3. **Increase match rate.** Jobs priced too low get no bids; jobs priced too high get rejected by clients. Pricing intelligence reduces both failure modes.

**Quick Job mode pricing.** Quick Job pre-priced flat-rate menu refreshes quarterly per metro using the same Machine Learning model. Auto-adjusts for inflation, supply-demand imbalance, seasonality.

### Vendor and build-vs-buy

**Build internally.** Pricing data is proprietary and the model touches every job. Build with in-house Machine Learning team.

### Phasing

- Phase 4 Year 1 (M18-30): Beta in Portsmouth NH for top 10 service categories.
- Phase 4 Year 2 (M30-36): Roll out to all metros for all 37 service categories.
- Phase 5 Year 1: Auto-adjusting Quick Job menu refresh quarterly.

---

## 7. Artificial Intelligence safety + bias monitoring

### The risk

As Machine Learning models proliferate across Sherpa Score, Dispatch, Pricing, and Customer Support, the risk of systematically disadvantaging minority-owned pros, women-owned pros, or other protected categories grows. This is not just a regulatory risk (Equal Credit Opportunity Act for Sherpa Lending; Fair Housing for any geographic pricing decisions); it is a brand-trust risk and a moral obligation.

### The framework

**Quarterly bias audit cadence.** Every Machine Learning model in production runs a quarterly fairness audit. Metrics tracked:

- **Demographic parity** — Does the model assign positive outcomes (high Score, frequent dispatch, favorable pricing) at equal rates across protected groups?
- **Equal opportunity** — Among pros who would succeed at a job, do all groups have equal chance of being matched to that job?
- **Calibration** — Does a Score of 80 mean the same expected job-outcome quality across all groups?

**Datadog dashboard.** Bias metrics surface on a dedicated Datadog dashboard reviewed monthly by Vice President Engineering, Head of Machine Learning, and General Counsel. Threshold breaches trigger immediate model rollback to the previous version while the team investigates.

**Annual external bias review.** An independent third-party auditor (recommend Parity AI or O'Neil Risk Consulting and Algorithmic Auditing) conducts an annual deep-dive bias review. Findings are summarized in a public-facing transparency report (published on `thesherpapros.com/transparency` per Phase 4 Year 2 commitment).

**Human-in-the-loop review for high-stakes decisions.** Any Machine Learning decision that suspends a pro account, lowers a Score below the Founding/Gold tier threshold, or denies a Sherpa Lending application is auto-routed to human review before taking effect. No fully-automated adverse decisions against pros.

### Vendor and build-vs-buy

**Build internal monitoring infrastructure, partner with external auditor annually.** Internal monitoring: in-house team. External annual audit: Parity AI or equivalent.

### Phasing

- Phase 4 Year 1 (M18-30): Bias-audit framework defined, Datadog dashboard built, baseline metrics established.
- Phase 4 Year 2 (M30-36): First annual external bias review published.
- Phase 5 ongoing: Quarterly internal audits + annual external review become standard operating procedure.

---

## 8. Phase 4 Artificial Intelligence and Machine Learning team build-out

### Hires

| Role | Phase 4 timing | Compensation range | Reports to |
| --- | --- | --- | --- |
| Head of Machine Learning | Year 2 (M24) | $250K-$320K + 0.5%-0.75% equity | Vice President Engineering |
| Senior Machine Learning Engineer (Sherpa Score / Dispatch) | Year 2 (M24) | $200K-$260K + 0.15%-0.25% equity | Head of Machine Learning |
| Senior Machine Learning Engineer (Materials forecasting / Pricing) | Year 2 (M30) | $200K-$260K + 0.15%-0.25% equity | Head of Machine Learning |
| Machine Learning Engineer (Optical Character Recognition / Smart Scan) | Year 2 (M30) | $170K-$220K + 0.10%-0.15% equity | Head of Machine Learning |
| Trust + Safety Engineer | Year 2 (M30) | $170K-$220K + 0.10%-0.15% equity | Head of Machine Learning |

**Headcount at Phase 4 Year 2 end (Month 36):** 5 Artificial Intelligence and Machine Learning team members. Phase 5 Year 1 grows to ~10.

### Infrastructure budget

- Vercel Artificial Intelligence Gateway (Anthropic Claude Sonnet usage): estimated $40K-$80K/year at Phase 4 Year 2 scale.
- Amazon Web Services SageMaker training + inference: estimated $120K-$200K/year.
- Datadog Machine Learning monitoring add-on: $30K/year.
- External annual bias audit: $80K-$150K/year (Parity AI or equivalent).
- **Total Phase 4 Year 2 Artificial Intelligence and Machine Learning infrastructure budget: ~$300K-$450K/year.**

---

## 9. Out of scope (deferred to Phase 5+)

- Generative job-matching (Large Language Model-driven natural-language job intake → structured job posting). Deferred because manual structured intake is working and Large Language Model intake costs more per job than the marginal lift.
- Voice agent for inbound pro phone support. Deferred because Customer Support Artificial Intelligence handles text channels first.
- Computer vision for job-completion verification (photo comparison pre/post). Deferred because Smart Scan handles document-class vision and on-job photo verification needs a separate product surface.
- Generative content for marketing (Large Language Model-drafted blog posts, social copy). Deferred because Vice President Marketing owns content strategy and Large Language Model-content quality at scale is not yet brand-safe.

---

## Owner sign-off

This roadmap is owned by:
- Phyrom (founder)
- Vice President Engineering (Phase 4 Month 0 promotion)
- Head of Machine Learning (Phase 4 Year 2 hire)

Reviewed quarterly at engineering all-hands. Bias-monitoring component reviewed monthly by Vice President Engineering + General Counsel.
