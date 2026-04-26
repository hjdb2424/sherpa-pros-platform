---
title: Migration Architecture vs Phase 4 Platform Scale — Drift Audit
date: 2026-04-26
scope: Compare commit `6045f43` (Phyrom — production launch + Hub beta + migration architecture spec) against commit `65c70cd` (orchestrator — Phase 4 Platform Scale Architecture spec + plan)
status: read-only audit, do-not-act-without-joint-review
authors: orchestrator (parallel-agent dispatch, Wave 12)
---

# Drift Audit — Migration Spec vs Platform Scale

This audit cross-checks Phyrom's production-launch / Hub-beta / migration architecture spec (`docs/superpowers/specs/2026-04-25-production-launch-hub-architecture-design.md`, shipped in commit `6045f43`) against the orchestrator's Phase 4 Platform Scale Architecture spec + plan (shipped in commit `65c70cd`). The goal is to surface drift before either thread advances further so reconciliation happens proactively, not after a P0 lands in production.

This is a **read-only audit**. No source spec is edited. Reconciliation actions require a joint Phyrom + orchestrator decision and should be tracked as their own follow-on commits.

---

## Executive summary

Two **P0 contradictions** that need a joint architectural decision before either spec can be acted on further:

1. **Migration target architecture is incompatible.** Phyrom commits to extracting `src/lib/services/*` to standalone Node.js containers with Vercel demoted to a thin proxy and BullMQ as the queue. Phase 4 commits to Vercel Fluid Compute through 5M MAU and explicitly defers any container move. These are mutually exclusive end-states.
2. **Object storage vendor split.** Phyrom selects Cloudflare R2 (zero egress). Phase 4 writes AWS S3 + Glacier Deep Archive into cold-tier and DR. Two clouds, two billing relationships, two operational surfaces.

One **P1 cheap-now-expensive-later**: Hub tables in migration 011 lack `metro_id` columns, which the Phase 4 sharding plan assumes. Adding the column today is trivial. Retrofitting after Citus rollout is expensive.

Five additional **P1-P3 items** detailed below. Most are reconcilable with wording changes; a handful require small spec patches.

---

## Source files reviewed

| File | Owner | Lines | Commit |
|---|---|---|---|
| `docs/superpowers/specs/2026-04-25-production-launch-hub-architecture-design.md` | Phyrom | 564 | `6045f43` |
| `docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md` | orchestrator | 798 | `65c70cd` |
| `docs/superpowers/plans/2026-04-25-platform-scale-architecture-plan.md` | orchestrator | 801 | `65c70cd` |

---

## Section-by-section drift table

| Topic | Phyrom (6045f43) | Phase 4 (65c70cd) | Drift type | Severity | Recommended reconciliation |
|---|---|---|---|---|---|
| Compute platform | Extract `src/lib/services/*` to standalone Node.js containers, Vercel becomes thin proxy (§9) | Vercel Fluid Compute through 5M MAU, defer container move (§13, Open Decision #5) | **Contradiction** | **P0** | Vercel-native wins through 5M MAU. Reframe Phyrom §9 as "optionality preserved — service abstraction allows future container extraction if scale demands it" rather than a committed end-state. |
| Object storage | Cloudflare R2 (zero egress) | AWS S3 + Glacier Deep Archive (cold-tier, DR sections) | **Contradiction** | **P0** | Rewrite Phase 4 cold-tier + DR sections as "S3-compatible (R2 or AWS S3, decision pending — see Open Decision #X)". Preserves Phyrom's vendor choice without forcing dual-cloud. |
| Hub table sharding readiness | New 9 Hub tables in migration 011 (`hub_inventory`, `hub_access_log`, `hub_inventory_transactions`, et al.) lack `metro_id` columns | Phase 4 partitioning table assumes `metro_id` shard key on all tenant-scoped tables (§7.2) | **Silent (Phyrom side)** | **P1** | Add `metro_id` column to migration 011 NOW, default-populated for Atkinson Hub via single-row UPDATE. Cheap pre-Citus, expensive post-Citus. |
| Queue technology | BullMQ (requires long-running container — coupled to compute-platform decision above) | Silent on queue technology | **Silent (Phase 4 side) + sequencing-conflict** | **P1** | If Vercel-native wins (P0 #1): pick QStash or Workflow DevKit, retire BullMQ commitment. If containers win: Phase 4 must add a queue section. Either way, decide queue tech downstream of the compute-platform decision. |
| Edge protection / WAF | Silent | Cloudflare Pro WAF + Vercel BotID + Upstash rate limiting at edge (WS4 of plan) | **Silent (Phyrom side)** | **P1** | Beta is invite-only so deferring WAF is fine. Public launch must follow WS4 — add an explicit gate to Phyrom's launch checklist: "WAF + BotID live before public-facing routes ship." |
| Region rollout / data residency | NH-only (Atkinson Hub physical, no multi-region modeling) | US-East primary → US-West Q3 2026 → Canada Q3 2027 → EU Q4 2027 → UK/AU 2028 (5-region phased) | **Silent (Phyrom side), no contradiction** | **P2** | No reconciliation needed today. WS3.1 (replica-aware Drizzle client) must NOT bypass Phyrom's service abstraction layer when implemented — this is a Phase 4 implementation note, not a Phyrom-spec change. |
| Uptime / RPO / RTO targets | Silent (no SLA committed) | 99.95% uptime / P95 dispatch <500ms / RPO 15-min / RTO 4-hr regional / 24-hr full DR | **Silent (Phyrom side)** | **P2** | During beta, externally commit to "best-effort 99.5%" with no contractual SLA. Phase 4 targets activate at Phase 1 launch. Add a beta SLA disclosure clause to Phyrom's launch comms. |
| Physical Hub data residency | Atkinson NH Hub modeled as physical site | Phase 4 doesn't model physical Hub locations as data-residency entities | **Silent (Phase 4 side)** | **P2** | Phase 4 needs an addendum: "Physical Hub locations remain US-only through Phase 1; Toronto Hub at Phase 4B is the first international-physical and triggers Canadian data-region routing." |
| Stripe Connect account type | **Standard** | **Express** | **Contradiction** | **P3** | Recommend Express (lower platform liability, controller properties cleaner, faster onboarding). Update Phyrom spec to align. |
| `/api/health` endpoint | Defined as required for launch | Silent | **Silent (Phase 4 side)** | **P3** | Keep Phyrom's spec — `/api/health` becomes the Datadog synthetic source-of-truth in WS2 of Phase 4 plan. Add explicit reference in Phase 4 §8 (observability). |
| Database current state | Neon Postgres (dev + prod) | Neon Postgres + Citus extension target | **Agreement** | — | No drift. |
| Twilio messaging | Per-region masked-number pattern | Inherits Twilio per-region as Phase 4 multi-region routes traffic | **Agreement** | — | No drift. |
| `audit_logs` table | Sherpa Guard output (RBAC + audit logging shipped) | Phase 4 SOC 2 spec requires audit logging — assumes Sherpa Guard satisfies | **Agreement** | — | No drift. Worth confirming in joint review that Sherpa Guard schema matches SOC 2 audit retention requirements (7yr default, 10yr opt-in). |

---

## Reconciliation actions — prioritized

### P0 (joint decision required before either spec advances)

**P0.1 — Lock the compute platform.** Joint Phyrom + orchestrator decision. Recommendation: Vercel Fluid Compute through 5M MAU. Action: edit Phyrom spec §9 to reframe container extraction as "optionality, not commitment." Write follow-on ADR at `docs/architecture/adr/2026-04-XX-vercel-fluid-through-5m-mau.md`.

**P0.2 — Lock object storage vendor.** Joint decision. Recommendation: Cloudflare R2 if Phyrom's cost model holds at scale, with S3-compatible interface to preserve flexibility. Action: rewrite Phase 4 cold-tier + DR sections as vendor-agnostic ("S3-compatible") and pin the vendor choice in a separate ADR.

### P1 (must reconcile within Phase 1)

**P1.1 — Add `metro_id` to migration 011.** Single migration patch. Cheap today.

**P1.2 — Pick queue technology** (downstream of P0.1). If Vercel-native: QStash + Workflow DevKit. If containers: BullMQ. Update both specs.

**P1.3 — WAF + BotID gate on public launch.** Add explicit checklist item to Phyrom's launch readiness. No spec change needed; just a launch-blocker entry.

### P2 (reconcile within Phase 1)

**P2.1 — Beta SLA disclosure.** Add "best-effort 99.5%, no contractual commitment during beta" clause to Phyrom's launch comms. Phase 4 targets activate at Phase 1 launch.

**P2.2 — Physical Hub data-residency addendum.** Phase 4 spec needs a half-page addendum modeling physical Hubs as residency entities. Trigger date = Toronto Hub Phase 4B.

**P2.3 — Replica-aware Drizzle client must respect service abstraction.** Implementation note for WS3.1, no spec change.

### P3 (cosmetic / wording)

**P3.1 — Stripe Connect type.** Pick Express, update Phyrom spec.

**P3.2 — `/api/health` reference in Phase 4 §8.** One-line addition.

---

## Open questions for joint Phyrom + orchestrator review

1. **Compute platform commitment:** Vercel Fluid Compute through 5M MAU? Or eventually containers?
2. **Object storage:** R2 or S3 — single-vendor decision?
3. **Toronto Hub timing:** Phase 4B (per Phase 4 spec)? Or franchise-only (no orchestrator-direct international physical Hub)?
4. **Beta SLA disclosure:** 99.5% best-effort with disclosure, or no commitment at all?
5. **SOC 2 / Vanta kickoff timing:** Day 1 of live payments, or after Y1 first revenue cohort closes?
6. **Hub sharding key:** `metro_id` (recommended — aligns with Phase 4 sharding plan) or `hub_id` (more granular but mismatches the spec)?
7. **Service abstraction enforcement:** Add a lint rule to mechanically enforce that no `@/db` imports occur outside `src/lib/services/` and `src/db/queries/`? Cheap insurance against future drift.

---

## Recommended next step

Schedule a 30-minute joint Phyrom + orchestrator architectural review specifically on P0.1 and P0.2. These two decisions cascade into queue tech, observability instrumentation, SOC 2 vendor scope, multi-region routing, and the entire Phase 4 plan execution sequence. Defer P1-P3 reconciliation until the P0s are locked.

---

## Last updated
2026-04-26 — Wave 12, parallel-agent dispatch (audit thread).
