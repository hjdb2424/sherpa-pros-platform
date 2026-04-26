---
title: AI/ML Roadmap — Implementation Plan
date: 2026-04-26
status: plan — pending priority-order lock (Spec §7)
source_spec: docs/superpowers/specs/2026-04-26-ai-ml-roadmap-design.md
phase: 4 (foundation in 1-3)
authors: orchestrator (Wave 12 parallel-agent dispatch)
---

# AI/ML Roadmap — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Sherpa Pros from rule-based heuristics to a five-pillar ML platform that compounds three proprietary data assets (job outcomes, materials demand, codes/permit telemetry) into a category-defining moat. Execution window: Y1 (Q3 2026 — Q2 2027) instrument + first model; Y2 (Q3 2027 — Q2 2028) two production models + third in shadow; Y3 (Q3 2028 — Q2 2029) all five pillars in production or shadow. ~24 tasks across 8 work streams.

**Source spec:** `docs/superpowers/specs/2026-04-26-ai-ml-roadmap-design.md`

**Owners:**
- **P** = Phyrom (founder, decision authority on every vendor + budget)
- **VPE** = VP Engineering (hired Phase 4 Month 0; until then Phyrom)
- **HML** = Head of ML (hired Y3; until then VPE)
- **MLE** = ML Engineer (Y1 first hire, Y2 second hire, Y3 third hire)
- **DE** = Data Engineer (hired Y2)
- **GC** = General Counsel (bias audit + ethics review co-authority)

**Critical-path dependencies:**
- WS0 (data infrastructure) gates every ML work stream — no model without a feature store
- WS1 (Sherpa Score) and WS2 (Dispatch ML) are the Y1 candidate pair; spec §7 priority decision selects two of five
- WS6 (bias audit infrastructure) gates any production ML deployment that affects pro outcomes
- WS7 (hiring) gates everything — no engineer, no model

---

## Executive summary

- Five ML pillars (Sherpa Score, Dispatch ML, Predictive Materials, Codes RAG, Smart Scan multimodal) sequenced over 36 months against three proprietary data assets.
- Y1 spend ~$300-400K loaded for one MLE plus modest data plumbing; Y2 doubles with second MLE and a Data Engineer; Y3 adds Head of ML and an applied research role.
- Recommended Y1 pillar pair: Dispatch ML (revenue compound) + Predictive Materials (Hub margin compound). Sherpa Score, Codes RAG, Smart Scan defer to Y2.
- Build internal where the moat is the model (Score, Dispatch). Hybrid where the moat is the data (Materials, Codes). Buy where there is no moat (Smart Scan).
- Bias audit cadence is quarterly internal, annual external, with VPE+GC joint rollback authority. Mirrors platform-scale plan.

---

## Workstream 0 (WS0) — Data Infrastructure Foundation

**Goal:** Feature store + outcome telemetry + ML warehouse live by end of Y1 Q1. No model can be trained without this.

### Task WS0.1: Outcome telemetry schema + emit hooks

**Owner:** VPE + MLE
**Files:**
- Create: `src/lib/ml/outcomes/schema.ts` (NEW — typed outcome record)
- Modify: `src/app/api/jobs/[id]/complete/route.ts` (emit outcome on job completion)
- Modify: `src/app/api/dispatch/decide/route.ts` (emit dispatch decision record)
- Create: `src/db/migrations/100_ml_outcomes.sql` (NEW — outcomes + dispatch_decisions tables)

- [ ] **Step 1:** Define typed outcome schema (5-star rating, on-time, rework, callback-30d, code-pass, payment-clean, comm-score)
- [ ] **Step 2:** Emit outcome record on every job completion + every dispatch decision
- [ ] **Step 3:** Backfill outcomes from existing completed-job rows
- [ ] **Step 4:** Verify outcome capture rate >99% via dashboard

**Acceptance:** 30 consecutive days of >99% outcome capture across all metros
**Phase:** Y1 Q1
**Dependencies:** None

---

### Task WS0.2: Feature store on top of Neon + S3

**Owner:** MLE + DE (when hired)
**Files:**
- Create: `src/lib/ml/feature-store/index.ts` (NEW)
- Create: `src/lib/ml/feature-store/registry.ts` (NEW — feature definitions)
- Create: `docs/ml/feature-store.md` (NEW)

- [ ] **Step 1:** Define feature schema (entity, feature name, value, timestamp, source)
- [ ] **Step 2:** Implement online store (Redis via Upstash) for sub-100ms feature lookup at dispatch time
- [ ] **Step 3:** Implement offline store (S3 Parquet) for batch training jobs
- [ ] **Step 4:** Build feature registry (which features exist, who owns them, freshness SLO)
- [ ] **Step 5:** Wire offline-online consistency check (drift alert)

**Acceptance:** Feature store serves >100 features, p95 online lookup <50ms, drift alert green for 30 days
**Phase:** Y1 Q2
**Dependencies:** WS0.1

---

### Task WS0.3: ML training warehouse + experiment tracking

**Owner:** MLE
**Files:**
- Create: `docs/ml/warehouse-architecture.md` (NEW)
- Create: `src/lib/ml/experiments/tracker.ts` (NEW — MLflow client wrapper)

- [ ] **Step 1:** Provision SageMaker Studio + S3 ML bucket
- [ ] **Step 2:** Set up MLflow tracking server (managed via SageMaker)
- [ ] **Step 3:** Document model lifecycle: experiment → registry → shadow → production
- [ ] **Step 4:** Onboard first MLE through end-to-end experiment → registry round-trip

**Acceptance:** First MLE runs full lifecycle without infra escalation
**Phase:** Y1 Q2
**Dependencies:** WS0.2

---

## Workstream 1 (WS1) — Sherpa Score Evolution

**Goal:** Per-category ML-trained Score in shadow by end of Y2; production by end of Y3. Recommended Y2 priority.

### Task WS1.1: Score outcome calibration baseline

**Owner:** MLE
**Files:**
- Create: `src/lib/ml/score/baseline.ts` (NEW)
- Create: `docs/ml/score-baseline-report.md` (NEW)

- [ ] **Step 1:** Compute current rule-based Score vs actual outcomes (calibration curve)
- [ ] **Step 2:** Quantify miscalibration per service category
- [ ] **Step 3:** Identify the top 10 categories with the worst calibration as ML training priority
- [ ] **Step 4:** Publish baseline report to VPE + Phyrom

**Acceptance:** Baseline report signed off; top-10 categories selected
**Phase:** Y2 Q1
**Dependencies:** WS0.3

---

### Task WS1.2: Per-category gradient-boosted model v1

**Owner:** MLE
**Files:**
- Create: `src/lib/ml/score/model.py` (NEW — XGBoost training script)
- Create: `src/lib/ml/score/predict.ts` (NEW — Node inference wrapper via SageMaker endpoint)

- [ ] **Step 1:** Train XGBoost model per top-10 category against outcome label
- [ ] **Step 2:** Hold-out evaluation: AUC, calibration, fairness across protected groups
- [ ] **Step 3:** Deploy SageMaker endpoint with auto-scaling
- [ ] **Step 4:** Wire shadow inference (run alongside rule-based, log both)

**Acceptance:** Shadow model live for 10 categories, AUC > rule-based baseline by 5+ points, fairness within +/- 10%
**Phase:** Y2 Q2
**Dependencies:** WS1.1, WS0.2, WS6.1

---

### Task WS1.3: Score model production replacement

**Owner:** MLE + VPE
**Files:**
- Modify: `src/lib/dispatch-wiseman/score-resolver.ts` (route to ML model with rule-based fallback)
- Create: `docs/ml/score-rollout-runbook.md` (NEW)

- [ ] **Step 1:** Run shadow vs rule-based for one full quarter; demonstrate stability
- [ ] **Step 2:** Roll out ML primary to top-3 categories; rule-based fallback retained
- [ ] **Step 3:** Expand to top-10 categories
- [ ] **Step 4:** Quarterly fairness audit
- [ ] **Step 5:** Communicate to pros via in-app feature card explaining the change

**Acceptance:** ML Score primary in 10 categories, no fairness breach for 90 days, pro-NPS unchanged or improved
**Phase:** Y3 Q1-Q2
**Dependencies:** WS1.2, WS6.2

---

## Workstream 2 (WS2) — Dispatch ML Uplift

**Goal:** Learned ranker in shadow by end of Y1, production by end of Y2. Recommended Y1 priority pair member.

### Task WS2.1: Dispatch decision telemetry

**Owner:** MLE + VPE
**Files:**
- Modify: `src/lib/dispatch-wiseman/dispatcher.ts` (emit full feature vector + decision per dispatch)
- Create: `src/db/migrations/101_dispatch_decisions.sql` (NEW)

- [ ] **Step 1:** Log full feature vector (license, skill, distance, score, response, activity, load) per candidate considered
- [ ] **Step 2:** Log chosen pro + acceptance + eventual outcome (joined post-hoc from WS0.1)
- [ ] **Step 3:** Verify telemetry capture rate >99% across all dispatches

**Acceptance:** 30 days of >99% capture; first counterfactual analysis demo possible
**Phase:** Y1 Q2
**Dependencies:** WS0.1

---

### Task WS2.2: LambdaMART ranker offline evaluation

**Owner:** MLE
**Files:**
- Create: `src/lib/ml/dispatch/ranker.py` (NEW)
- Create: `docs/ml/dispatch-offline-eval.md` (NEW)

- [ ] **Step 1:** Build labeled training set from outcome-joined dispatches
- [ ] **Step 2:** Train LambdaMART ranker against completion-success label
- [ ] **Step 3:** Counterfactual evaluation: NDCG, completion lift at iso-acceptance
- [ ] **Step 4:** Fairness evaluation across protected groups
- [ ] **Step 5:** Publish offline eval report

**Acceptance:** 10%+ NDCG lift, fairness within +/- 10%, report signed off
**Phase:** Y1 Q3-Q4
**Dependencies:** WS2.1, WS0.2

---

### Task WS2.3: Dispatch ML shadow + production

**Owner:** MLE + VPE
**Files:**
- Modify: `src/lib/dispatch-wiseman/dispatcher.ts` (shadow mode → primary mode toggle)
- Create: `docs/ml/dispatch-rollout-runbook.md` (NEW)

- [ ] **Step 1:** Deploy ranker as SageMaker endpoint with p95 inference <100ms
- [ ] **Step 2:** Run shadow mode (rule-based decides, model logged) for one full quarter
- [ ] **Step 3:** Promote ML primary in Portsmouth NH; observe 30 days
- [ ] **Step 4:** Expand metro-by-metro; rule-based fallback retained
- [ ] **Step 5:** Quarterly fairness audit + outcome-lift report

**Acceptance:** ML ranker primary in 5+ metros, completion-rate lift sustained 90 days
**Phase:** Y2 Q1-Q4
**Dependencies:** WS2.2, WS6.2

---

## Workstream 3 (WS3) — Predictive Materials Demand

**Goal:** Per-Hub demand forecast in production by end of Y2; closed-loop pre-stage by end of Y3. Recommended Y1 priority pair member.

### Task WS3.1: Materials event stream + warehouse

**Owner:** DE (when hired) + MLE
**Files:**
- Create: `src/lib/ml/materials/events.ts` (NEW)
- Create: `src/db/migrations/102_materials_events.sql` (NEW)

- [ ] **Step 1:** Define event schema for kit pulls, supplier inbounds, job-to-materials linkages
- [ ] **Step 2:** Wire event emission across the Materials engine
- [ ] **Step 3:** Build daily aggregation into per-Hub-per-SKU time series
- [ ] **Step 4:** Backfill from existing Hub data

**Acceptance:** 12 months of clean per-Hub-per-SKU time series available for backtest
**Phase:** Y1 Q2-Q3
**Dependencies:** WS0.2

---

### Task WS3.2: Prophet-baseline forecast for two pilot Hubs

**Owner:** MLE
**Files:**
- Create: `src/lib/ml/materials/forecast.py` (NEW)
- Create: `docs/ml/materials-forecast-pilot.md` (NEW)

- [ ] **Step 1:** Train Prophet forecast for Portsmouth + Manchester Hubs at 30/60/90-day horizons
- [ ] **Step 2:** Backtest against last 12 months; measure MAPE per SKU family
- [ ] **Step 3:** Surface forecast in Hub Operations dashboard
- [ ] **Step 4:** Hub Operations Manager review + feedback loop

**Acceptance:** MAPE <20% for top-100 SKUs, Hub OM uses forecast in weekly reorder decision
**Phase:** Y1 Q4 / Y2 Q1
**Dependencies:** WS3.1

---

### Task WS3.3: Forecast rollout + closed-loop pre-stage

**Owner:** MLE + Hub Operations
**Files:**
- Create: `src/lib/ml/materials/reorder-rec.ts` (NEW)
- Create: `docs/ml/materials-prestage-runbook.md` (NEW)

- [ ] **Step 1:** Roll out forecast to all 6 Hubs
- [ ] **Step 2:** Auto-generate reorder recommendations from forecast + safety-stock policy
- [ ] **Step 3:** Closed-loop: rec → PO → inbound → stock measured against next-period demand
- [ ] **Step 4:** Vendor-evaluation gate at Y3 (RELEX vs Blue Yonder vs continue in-house)

**Acceptance:** OTIF rate >97%, safety stock reduced 15%+ vs baseline
**Phase:** Y2 Q3 / Y3 Q1
**Dependencies:** WS3.2

---

## Workstream 4 (WS4) — Codes RAG

**Goal:** Internal codes RAG MVP by end of Y2; production with cite-back by end of Y3. Y2 priority.

### Task WS4.1: Codes corpus indexing

**Owner:** MLE
**Files:**
- Create: `src/lib/ml/codes/index.ts` (NEW — embedding index management)
- Create: `docs/ml/codes-corpus.md` (NEW)

- [ ] **Step 1:** Ingest IRC, IBC, NEC, IPC, IMC + top-200 jurisdiction amendments
- [ ] **Step 2:** Build embedding index (Anthropic embeddings via Vercel AI Gateway)
- [ ] **Step 3:** Layer permit precedent + inspector notes (from existing Wiseman Codes data)
- [ ] **Step 4:** Quarterly amendment refresh cron

**Acceptance:** Index covers 200+ jurisdictions, refresh runs without manual intervention for 90 days
**Phase:** Y1 Q4 / Y2 Q1
**Dependencies:** WS0.3

---

### Task WS4.2: LLM-RAG MVP with mandatory cite-back

**Owner:** MLE + applied research
**Files:**
- Create: `src/lib/ml/codes/rag.ts` (NEW)
- Create: `src/app/api/codes/ask/route.ts` (NEW)

- [ ] **Step 1:** Build retrieval-grounded generation chain (Claude Sonnet via Vercel AI Gateway)
- [ ] **Step 2:** Enforce cite-back to specific code section + permit + inspector note
- [ ] **Step 3:** Confidence scoring with floor below which answer is "consult AHJ"
- [ ] **Step 4:** Internal-only access for pilot pros + Wiseman team
- [ ] **Step 5:** Inspector-validated benchmark set + accuracy measurement

**Acceptance:** 90%+ relevance, 95%+ accuracy on benchmark set
**Phase:** Y2 Q2-Q4
**Dependencies:** WS4.1

---

### Task WS4.3: Codes RAG production rollout

**Owner:** MLE + VPE
**Files:**
- Modify: `src/app/api/codes/ask/route.ts` (production-grade rate limit + audit)
- Create: `docs/ml/codes-rag-rollout-runbook.md` (NEW)

- [ ] **Step 1:** Production rate limits + audit logging
- [ ] **Step 2:** Roll out to all pros in pilot metro (Portsmouth NH)
- [ ] **Step 3:** Expand metro-by-metro
- [ ] **Step 4:** Liability disclaimer reviewed by GC

**Acceptance:** Codes RAG live in 5+ metros, no liability incident, pro NPS-positive
**Phase:** Y3 Q1-Q4
**Dependencies:** WS4.2

---

## Workstream 5 (WS5) — Smart Scan Multimodal

**Goal:** Multimodal extraction in production for permits + blueprints by end of Y3. Y2 priority.

### Task WS5.1: OCR confidence floor + labeled corpus

**Owner:** MLE
**Files:**
- Modify: `src/lib/smart-scan/extract.ts` (return confidence per field)
- Create: `docs/ml/smart-scan-corpus.md` (NEW)

- [ ] **Step 1:** Surface confidence per extracted field; route below-threshold to human review
- [ ] **Step 2:** Build labeled corpus (1,000 receipts, 500 permits, 200 blueprints)
- [ ] **Step 3:** Validate label quality via inter-annotator agreement

**Acceptance:** Corpus signed off, confidence floor enforced in production
**Phase:** Y1 Q4 / Y2 Q1
**Dependencies:** WS0.1

---

### Task WS5.2: Multimodal model fine-tune for permits + blueprints

**Owner:** MLE
**Files:**
- Create: `src/lib/ml/smart-scan/model.py` (NEW — fine-tune wrapper)
- Create: `docs/ml/smart-scan-fine-tune.md` (NEW)

- [ ] **Step 1:** Fine-tune commercial vision-language model on labeled corpus
- [ ] **Step 2:** Hold-out evaluation: field-level accuracy
- [ ] **Step 3:** Deploy SageMaker endpoint with tiered routing (cheap OCR for clean docs, multimodal only on low confidence)

**Acceptance:** 95%+ permit accuracy, 90%+ blueprint accuracy
**Phase:** Y2 Q3 / Y3 Q1
**Dependencies:** WS5.1

---

### Task WS5.3: Closed-loop with PM workflows

**Owner:** MLE + product
**Files:**
- Modify: `src/lib/smart-scan/extract.ts` (emit structured entities to PM module)
- Create: `docs/ml/smart-scan-pm-integration.md` (NEW)

- [ ] **Step 1:** Wire permit-to-takeoff round-trip
- [ ] **Step 2:** Wire receipt-to-Schedule-C tagging at 95%+ accuracy
- [ ] **Step 3:** Wire blueprint-to-estimate seed
- [ ] **Step 4:** Pro retention measurement (does Smart Scan reduce time-to-bid?)

**Acceptance:** Permit round-trip <10 sec, time-to-bid down 20%+, retention positive
**Phase:** Y3 Q2-Q4
**Dependencies:** WS5.2

---

## Workstream 6 (WS6) — Bias Audit + Safety Infrastructure

**Goal:** Quarterly internal + annual external audit cadence with model-rollback authority before any production deployment that affects pro outcomes.

### Task WS6.1: Bias audit framework + Datadog dashboard

**Owner:** VPE + GC + MLE
**Files:**
- Create: `src/lib/ml/audit/fairness.ts` (NEW)
- Create: `docs/ml/bias-audit-framework.md` (NEW)

- [ ] **Step 1:** Define metrics: demographic parity, equal opportunity, calibration
- [ ] **Step 2:** Implement audit job that runs against any production model
- [ ] **Step 3:** Build Datadog dashboard with breach alerting
- [ ] **Step 4:** Document rollback authority: VPE + GC, either-can-rollback

**Acceptance:** Dashboard live, first quarterly audit run, breach simulation rolls back successfully
**Phase:** Y2 Q1
**Dependencies:** WS0.3

---

### Task WS6.2: Annual external audit + ethics advisory board

**Owner:** P + GC
**Files:**
- Create: `docs/ml/external-audit-engagement.md` (NEW)
- Create: `docs/ml/ethics-advisory-board.md` (NEW)

- [ ] **Step 1:** Engage external auditor (Parity AI or O'Neil Risk Consulting)
- [ ] **Step 2:** Run first annual audit, publish public transparency report
- [ ] **Step 3:** Recruit 3-member ethics advisory board (Y2 commitment)
- [ ] **Step 4:** Quarterly board review meetings

**Acceptance:** First public transparency report published, board seated
**Phase:** Y2 Q4 / Y3 Q1
**Dependencies:** WS6.1

---

## Workstream 7 (WS7) — Hiring Ramp

**Goal:** Y1 one MLE; Y2 add MLE + DE; Y3 add Head of ML + applied research + third MLE.

### Task WS7.1: Y1 senior ML engineer hire

**Owner:** P + VPE
**Files:**
- Create: `docs/hiring/ml-engineer-y1.md` (NEW — JD + scorecard)

- [ ] **Step 1:** Lock Y1 priority pair (per Spec §7) before opening req
- [ ] **Step 2:** Open req, target 90-day fill
- [ ] **Step 3:** Onboard against WS0 + WS2 + WS3 priorities (per recommended pair)

**Acceptance:** Hired by Y1 Q1
**Phase:** Y1 Q1
**Dependencies:** Spec §7 lock

---

### Task WS7.2: Y2 second MLE + Data Engineer

**Owner:** P + VPE
**Files:**
- Create: `docs/hiring/ml-engineer-y2.md` (NEW)
- Create: `docs/hiring/data-engineer.md` (NEW)

- [ ] **Step 1:** Open both reqs Y2 Q1
- [ ] **Step 2:** MLE covers second priority pillar (Y2 priority)
- [ ] **Step 3:** DE hardens data pipelines + warehouse

**Acceptance:** Both filled by Y2 Q2
**Phase:** Y2 Q1-Q2
**Dependencies:** WS7.1 success

---

### Task WS7.3: Y3 Head of ML + applied research + third MLE

**Owner:** P + VPE
**Files:**
- Create: `docs/hiring/head-of-ml.md` (NEW)
- Create: `docs/hiring/applied-research.md` (NEW)
- Create: `docs/hiring/ml-engineer-y3.md` (NEW)

- [ ] **Step 1:** Open Head of ML req Y3 Q1; target 120-day fill given seniority
- [ ] **Step 2:** Applied research role focused on Codes RAG + multimodal Smart Scan
- [ ] **Step 3:** Third MLE for ongoing pillar coverage

**Acceptance:** Team of ~5-6 ML + 2 data by Y3 Q4
**Phase:** Y3 Q1-Q3
**Dependencies:** WS7.2 success

---

## Cross-Workstream Dependencies Summary

```
WS0 (data infrastructure) ──> every other WS

WS6 (bias audit) ──> WS1.3 (Score production)
                ──> WS2.3 (Dispatch production)

WS7.1 (Y1 hire) ──> WS0 + WS2 + WS3 (Y1 priorities)
WS7.2 (Y2 hires) ──> WS1 + WS4 + WS5 (Y2 priorities)
WS7.3 (Y3 hires) ──> all pillars production

Spec §7 (priority lock) ──> WS7.1 (req scope)
                       ──> Y1 pillar pair selection
```

## Phasing Summary

| Quarter | Milestones |
|---|---|
| Y1 Q1 | WS0.1 outcome telemetry, WS7.1 first MLE hired |
| Y1 Q2 | WS0.2 feature store, WS0.3 warehouse, WS2.1 dispatch telemetry, WS3.1 materials events |
| Y1 Q3 | WS2.2 dispatch ranker offline eval |
| Y1 Q4 | WS3.2 Prophet pilot, WS4.1 codes corpus, WS5.1 Smart Scan corpus |
| Y2 Q1 | WS6.1 bias audit framework, WS7.2 hires, WS1.1 Score baseline |
| Y2 Q2 | WS1.2 Score shadow, WS4.2 Codes RAG MVP |
| Y2 Q3 | WS2.3 Dispatch primary rollout begins, WS5.2 multimodal fine-tune |
| Y2 Q4 | WS6.2 first external audit, WS3.3 forecast rollout |
| Y3 Q1 | WS1.3 Score production, WS4.3 Codes RAG production, WS7.3 Head of ML |
| Y3 Q2-Q4 | WS5.3 Smart Scan PM closed-loop, WS3.3 closed-loop pre-stage, vendor evaluation gate |

## Success Metrics Per Workstream

| WS | Y1 success metric | Y3 success metric |
|---|---|---|
| WS0 | Outcome capture >99%, feature store p95 <50ms | Warehouse hosts 5 production models |
| WS1 | Baseline calibration report published | Score ML primary in 10 categories, fairness clean 90 days |
| WS2 | NDCG +10% offline | Dispatch ML primary in 5+ metros, completion lift sustained |
| WS3 | MAPE <20% top-100 SKUs in pilot | OTIF >97%, safety stock -15% |
| WS4 | Codes corpus indexed 200+ jurisdictions | RAG live in 5+ metros, no liability incident |
| WS5 | Confidence floor enforced, corpus labeled | 95% permit / 90% blueprint accuracy |
| WS6 | Dashboard live, first audit run | Annual external audit + transparency report published |
| WS7 | First MLE hired Y1 Q1 | 5-6 ML + 2 data team |

---

**End of plan — full strategic context: `docs/superpowers/specs/2026-04-26-ai-ml-roadmap-design.md`**
