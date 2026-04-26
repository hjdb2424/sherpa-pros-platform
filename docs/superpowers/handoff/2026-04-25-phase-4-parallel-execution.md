# Phase 4 Strategic Build — Parallel Execution Handoff

**Date:** 2026-04-25
**Status:** Specs + Plans complete, ready for execution
**Total scope:** 4 specs + 4 plans = 165 implementation tasks across 25 work streams

---

## Executive summary

Phase 0 → Phase 3 covered the path from beta cohort to Series A + Series B (M0–M18, US Northeast 4-metro + 2-metro expansion + NYC specialty beachhead). Phase 4 is the **forever-business infrastructure layer** — the strategic systems that turn Sherpa Pros from a regional Series-B-stage marketplace into a national + international + capital-light franchise platform.

Four strategic threads, designed in parallel, cross-referenced where they touch:

| # | Thread | Spec | Plan | Tasks | Phase |
|---|---|---|---|---|---|
| 1 | International Expansion | [`2026-04-25-international-expansion-design.md`](../specs/2026-04-25-international-expansion-design.md) | [`2026-04-25-international-expansion-plan.md`](../plans/2026-04-25-international-expansion-plan.md) | 36 | M19+ |
| 2 | Franchise Model | [`2026-04-25-franchise-model-design.md`](../specs/2026-04-25-franchise-model-design.md) | [`2026-04-25-franchise-model-plan.md`](../plans/2026-04-25-franchise-model-plan.md) | 38 | M12+ |
| 3 | Platform Scale Architecture | [`2026-04-25-platform-scale-architecture-design.md`](../specs/2026-04-25-platform-scale-architecture-design.md) | [`2026-04-25-platform-scale-architecture-plan.md`](../plans/2026-04-25-platform-scale-architecture-plan.md) | 50 | M9+ |
| 4 | Sherpa Hub Integration | [`2026-04-25-sherpa-hub-integration-design.md`](../specs/2026-04-25-sherpa-hub-integration-design.md) | [`2026-04-25-sherpa-hub-integration-plan.md`](../plans/2026-04-25-sherpa-hub-integration-plan.md) | 41 | M0+ (Hub #1 immediate) |

---

## Decisions LOCKED in this build

The four agents resolved several long-standing open decisions. These are now canonical:

### Sherpa Hub Integration

- **FW Webb partnership:** **Option C Hybrid** — Hub #1 standalone at HJD HQ Atkinson NH (zero-cost colocation, Phase 1 proof point), Hubs #2–#10 co-located inside FW Webb branches via 5-Hub pilot Letter of Intent (LOI signature deadline: Phase 1 Month 4 — HARD DATE), Hubs #11+ via franchise model per franchise spec
- **Bundle pricing:** **Option C Tiered** — Founding Pro and Gold tier include Hub access in subscription, Silver and Bronze tiers pay $25/month Hub upgrade, Sherpa Flex tier pays $39/month Hub access (or no access by default)
- **Hub revenue line beyond memberships:** Per-line Sherpa Materials gross margin share — 40% buffer / 35% pickup / 25% staged-and-Uber-Direct
- **Per-Hub breakeven:** Standalone Year 3, FW Webb co-located Year 2, franchised passes risk to franchisee

### Franchise Model

- **Primary franchise unit:** **Sherpa Hub franchise** ($45K initial fee, $185K–$420K total franchisee investment, 6–8% royalty, 5/15/30-mile protected radius by metro density)
- **Secondary franchise unit:** Sherpa Pro Network license ($25K, digital-only, exclusive metro pro-recruiting rights)
- **Tertiary franchise unit:** Sherpa Metro Master ($300K, sub-franchise individual Hubs underneath)
- **International franchise unit:** Master Franchisee per country ($500K–$2M depending on market, 4–6% royalty)
- **State registration sequence:** Launch in non-registration states first (NH, ME, MA — Phase 3), then file in priority registration states (NY, RI, MD, VA — Phase 4 Year 2), then remaining 10 registration states (Phase 4 Year 3)
- **FDD economics (Item 19):** Year 2 mid-case Hub gross revenue $1.05M, EBITDA 21%, 14–22 month franchisee breakeven, $236K franchisee cash flow at maturity

### International Expansion

- **Country sequence:** **Canada (Y1, M19–30) → United Kingdom (Y2, M31–42) → Australia (Y3, M43–54) → European Union pilot (Y4–5, Berlin only, M55–78)**
- **Codes ingestion budget:** ~$80–150K per country (Canada: National Building Code + provincial; UK: BS 7671 + Building Regulations; Australia: AS/NZS 3000 + National Construction Code; EU: EN harmonized + per-Member-State)
- **Per-country talent model:** 4 hires (country GM + ops + support + business development), $400–600K loaded annual cost per country
- **International take rates:** Canada parity with United States, UK 7–10% (cultural margin ceiling), Australia slight premium, materials coordination 8–12% holds globally
- **Localization sequence:** English-default for Canada / UK / Australia, Quebec French Y2, German Y4–5, Spanish + Italian deferred
- **International rollout model:** Master-franchisee per country (capital-light, regulatory-localized, lower direct burn)

### Platform Scale Architecture

- **Compliance vendor stack:** Vanta (compliance automation) + Schellman (auditor) — SOC 2 Type 1 in 90 days, Type 2 in 12 months
- **Multi-region rollout sequence:** US-East primary → add US-West Q3 2026 → add Canadian region Q3 2027 → add EU region Q4 2027 → UK + Australia 2028
- **Database scaling:** Citus extension on Postgres for sharding by metro_id (alternative pg_partman + foreign data wrapper), read replicas per region, hot/warm/cold tiering at 90/365/365+ days
- **Observability vendor:** Datadog (APM + logs + metrics + RUM + synthetics) until 1M MAU, then evaluate switching to OpenTelemetry → Grafana Cloud
- **Edge protection:** Cloudflare Pro WAF in front of Vercel + Upstash Redis rate limiting at edge + Vercel BotID (just GA Jun 2025)
- **Targets:** 99.95% uptime, P95 dispatch latency <500ms, RPO 15-min, RTO 4-hr regional / 24-hr full DR, $0.03–$0.06 per Monthly Active User cost-of-scale at 1M+ MAU

---

## Decisions still OPEN (carry forward to next session)

Across the 4 specs, ~33 decisions remain pending. Highest-priority:

### Hub
- Hub #1 grand-open date (target Phase 1 Month 4)
- FW Webb pilot LOI signature deadline (HARD: Phase 1 Month 4)
- Hub Manager #1 hiring start (target Phase 1 Month 2)
- Sherpa Materials top-200 SKU list lock

### Franchise
- FDD attorney selection (recommend Spadea Lignana, Cheng Cohen, or DLA Piper Franchise Practice)
- Audit firm selection (BDO USA Franchise Practice or Marcum Franchise Group)
- Lead-with: Hub franchise alone, or Hub + Pro Network simultaneously?
- International master fee structure exact tier per country

### International
- Quebec French localization timing (Y2 alongside English Canada, or deferred to Y3?)
- Australia vs New Zealand split (single ANZ market or separate launches?)
- EU pilot country choice (Berlin recommended; alternatives Amsterdam, Stockholm, Munich)
- Greenfield Hub deployment internationally vs international-master-franchise-only

### Platform Scale
- Datadog vs OpenTelemetry / Grafana Cloud crossover criteria
- Snyk vs Dependabot for dependency scanning
- When to hire dedicated DBA (recommend Phase 4A)
- When to hire dedicated SRE (recommend Phase 3 Month 5)

---

## Cross-spec dependency graph

```
                    ┌──────────────────────────────┐
                    │  Sherpa Hub Integration      │
                    │  (operational, M0+)          │
                    └────────┬─────────────────────┘
                             │ feeds Item 19 economics
                             ▼
        ┌────────────────────────────────────────────┐
        │  Franchise Model                           │
        │  (FDD development M12+, sales M18+)        │
        └────────┬───────────────────────────────────┘
                 │ international master-franchisee model
                 ▼
        ┌────────────────────────────────────────────┐
        │  International Expansion                   │
        │  (country GM hires M19, beta M22+)         │
        └────────┬───────────────────────────────────┘
                 │ data residency + multi-region required
                 ▼
        ┌────────────────────────────────────────────┐
        │  Platform Scale Architecture               │
        │  (SOC 2 M9+, multi-region M18+)            │
        └────────────────────────────────────────────┘
```

**Critical-path interpretation:** Hub Integration is execution-ready NOW (Hub #1 can break ground Phase 1 Month 1). Franchise Model FDD development starts Month 12 and gates Phase 4 Hub expansion. Platform Scale SOC 2 Type 1 work starts Month 9 and gates international launch. International Expansion country GM hire starts Month 19 (post-Series B close).

---

## Parallel implementation handoff

When you're ready to execute the 165 tasks across the four plans, here's the parallel-agent dispatch pattern that has worked for prior waves (Wave 1–9 of GTM build):

### Pattern

- One Agent message dispatches multiple Agent calls in parallel
- Each agent gets ONE plan + ONE work stream within that plan
- Agents commit nothing, push nothing, return summary only
- Orchestrator (you) commits, renders, pushes after all agents return

### Recommended execution waves

**Wave A — Hub #1 Atkinson buildout (immediate, M0–4)**

Single-agent execution. WS1 of `2026-04-25-sherpa-hub-integration-plan.md`:
- Real estate confirm at HJD HQ
- Fit-out plan (architect engagement, contractor selection, permit pull)
- Equipment manifest + opening inventory list
- Hub Manager #1 job spec + hiring kickoff
- Soft-open + grand-open milestones

**Wave B — FW Webb partnership chain (parallel, M2–6)**

3 agents:
- Agent 1: WS2 of Hub plan (FW Webb target contact list, intro deck, pilot LOI structure)
- Agent 2: WS3 of Hub plan (Sherpa Materials integration — Zinc API ship-to-Hub config, Uber Direct dispatch-from-Hub)
- Agent 3: WS6 of Hub plan (Hub data telemetry — per-Hub P&L dashboard, network-wide ops dashboard)

**Wave C — SOC 2 readiness foundation (parallel, M9–18)**

4 agents:
- Agent 1: WS1 of Platform Scale plan (Vanta + Schellman engagement, access management, vendor risk register)
- Agent 2: WS2 of Platform Scale plan (Datadog provisioning, APM instrumentation, 8 Day-1 dashboards)
- Agent 3: WS4 of Platform Scale plan (Cloudflare Pro WAF, Upstash rate limiting, Vercel BotID)
- Agent 4: WS6 of Platform Scale plan (AWS Secrets Manager migration, Snyk + auto-PRs, SBOM generation)

**Wave D — Franchise FDD development (parallel, M12–18)**

3 agents:
- Agent 1: WS1 of Franchise plan (attorney + audit firm engagement, Item-by-Item drafting through V1.0)
- Agent 2: WS3 of Franchise plan (franchise prospect website, 7-stage screening templates, Hub #2 candidate identification)
- Agent 3: WS4 of Franchise plan (80-hour curriculum, Brand + Operations Manuals, training facility buildout at Hub #1)

**Wave E — Multi-region rollout (parallel, M18–24)**

4 agents:
- Agent 1: WS3 of Platform Scale plan (replica-aware Drizzle client, US-West replica, sharding pilot)
- Agent 2: WS5 of Platform Scale plan (PagerDuty on-call, runbook templates, incident response, feature flags)
- Agent 3: WS7 of Platform Scale plan (region-aware DB routing, Canadian region, GDPR readiness, EU region)
- Agent 4: WS2 of Franchise plan (state registration filings — NY, RI, MD, VA priority + FL/TX notices)

**Wave F — International country launches (parallel, M19+, post-Series B)**

6 agents (one per work stream of International Expansion plan, plus 1 Hub coordination):
- Agent 1: WS1 (Country GM hires — generic template + 4 country job specs + recruiting playbook)
- Agent 2: WS2 (Codes ingestion — vendor framework + 4 country runbooks + validation test set)
- Agent 3: WS3 (Payment rails — Stripe Connect per country + FX hedging)
- Agent 4: WS4 (Regulatory readiness — 4 country entity formations, insurance brokers, worker-class opinions)
- Agent 5: WS5 (Localization — currency, language, units, dates, trade nomenclature, trademarks)
- Agent 6: WS6 (Per-country launch playbook — template + 4 country playbooks + traction-metric dashboard)

---

## What this Phase 4 build does NOT cover

These are intentionally deferred — flag for future spec work if they become priority:

- **Phase 4 GTM marketing kit refresh** (analogous to Phase 0 marketing kit but for international + franchise + scaled-product brand) — defer until first international country launch is 6 months out
- **Phase 4 Series B + Series C pitch deck** — defer until Phase 3 Series A close is in hand (target M12)
- **Acquisition-track strategic analysis** (Home Depot / Lowe's / insurance carrier / Procore acquisition pathway) — defer until Phase 4B revenue and unit economics are proven
- **AI/ML roadmap** (Sherpa Score evolution, Dispatch Wiseman ML uplift, predictive materials demand forecasting) — defer to dedicated AI spec
- **Embedded financial products beyond Sherpa Rewards + Tremendous** (Sherpa Lending for pros, Sherpa Insurance for clients, embedded payments beyond Stripe Connect) — defer to dedicated Fintech spec
- **Trades-industry vertical SaaS spinout** (Sherpa codes engine + Sherpa Materials engine licensed as standalone B2B SaaS to Procore / BuilderTrend / JobNimbus) — defer until Phase 5

---

## Build outputs

This Phase 4 build session produced:

- 4 strategic specs in `docs/superpowers/specs/` (~28K words combined)
- 4 implementation plans in `docs/superpowers/plans/` (~32K words combined, 165 tasks across 25 work streams)
- This handoff document
- Updates to project memory (`project_sherpa_pros_gtm_phase_0.md` Session 8)

All 8 docs render to PDF + HTML automatically via `npm run docs:pdf` (already in build pipeline). Slide-deck conversion of any spec available via `npm run docs:slides` if needed for board presentation.

---

## Last updated
2026-04-25 — Wave 10 Phase 4 strategic build complete.
