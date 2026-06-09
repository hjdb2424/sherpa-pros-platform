# Sherpa Pros Platform · First Provenance Sweep · 2026-05-15

> First MNEMOS-driven provenance sweep of the Sherpa Pros repo. Result: ~85 tickets across 9 Epics identified for ingestion into the SHRP Jira Space.

---

## Methodology

A research subagent was dispatched to read the high-signal docs and surface every actionable item (completed / in-progress / to-do / implied). Output structured per-file with file:line provenance citations.

11 high-signal files read in full:
- `handoff.md`, `.mnemos-state.json` (MNEMOS-curated)
- `docs/HANDOFF.md`, `docs/TODO-MVP-FIXES.md`
- `CLAUDE.md`, `README.md`, `AGENTS.md`
- `docs/app-store-launch-runbook.md`, `docs/app-store-submission.md`, `docs/stripe-connect-platform-setup.md`
- 4× `docs/superpowers/handoff/*` + 1× `docs/superpowers/audits/*`

1,543 checklist lines surveyed across the wider docs tree via grep.

---

## Headline findings

1. **SHRP-1 and SHRP-2 cover only ~2.5% of the actionable backlog.** The repo contains years of well-organized planning that has never been promoted to Jira.
2. **`docs/TODO-MVP-FIXES.md` is the single highest-density action source** — 13 launch-relevant items, all already in `.mnemos-state.json` but unfiled.
3. **App Store submission has 10 distinct gate items beyond SHRP-2** (privacy/support pages, 3× screenshot sets, App Privacy questionnaire, demo accounts, etc.).
4. **Plan 2b (Stripe release path) is a large epic-sized body of work** — 6 core tickets + 11 deferred Plan 2a followups, none tracked.
5. **The drift audit (E8) is dormant but contains P0 architectural decisions** that block both the Phase 4 plan and the migration spec.
6. **The IT admin console (E9) is vision-only** but has 9 well-defined surfaces. Filing as an Epic with sub-tasks preserves the work even if scoping is deferred.
7. **SOC2 / hub-1 / international launch / franchise checklists (1,500+ items)** were intentionally NOT proposed for individual Jira tickets — they are far-future reference checklists, not Q2 2026 action items. They should remain in-doc and be promoted in batches when those phases activate.

---

## Proposed Jira structure for SHRP

### 9 Epics

| Epic | Theme |
|---|---|
| E1 · Launch blockers | Resend DNS, Apple review submit, P0 fixes blocking the closed beta cohort |
| E2 · MVP data scoping | 9 data-scoping + 4 auth-scoping items from TODO-MVP-FIXES.md |
| E3 · Build pipeline / release management | TestFlight rotation automation, CHANGELOG, Phased Release |
| E4 · Auth & access | Clerk proxy, SIWA hardening, JWKS verification, cookie sync, diagnostic endpoint removal |
| E5 · Marketplace functionality | Plan 2b release path + deferred Plan 2a followups |
| E6 · GTM & business | Fundraising deck completion, data room, demo video, advisor pipeline |
| E7 · Operations runbooks | Insurance + dispute infrastructure, /support /privacy pages, App Store package |
| E8 · Architecture & scale | P0/P1 reconciliations from the drift audit |
| E9 · IT admin console | 9 surfaces of `/sysadmin/*` vision (spec needed) |

### ~85 Tasks across the 9 Epics

Full breakdown captured at filing time. See SHRP Jira board for the live state.

---

## What this sweep establishes

This is Sherpa Pros' first run through MNEMOS' provenance sweep cycle (defined in `docs/PROJECT_MANAGEMENT.md` of the mnemos repo). It demonstrates that:

1. **A repo with years of evolving docs benefits enormously from one comprehensive sweep**. The maintenance debt accumulates silently in well-curated planning artifacts; the sweep surfaces it once.
2. **Most extracted items are NOT "new work"** — they were always commitments, just commitments that never made it onto a tracked surface. Filing them doesn't expand scope; it visualizes existing scope.
3. **Some items are NOT promoted** (1,500+ SOC2/hub-1/franchise checklist items intentionally kept in-doc). The sweep is selective, not exhaustive.

---

## Cross-references

- mnemos repo `docs/PROJECT_MANAGEMENT.md` — the methodology behind this sweep
- mnemos repo `docs/audit/2026-05-15-provenance-sweep.md` — the sister sweep on the mnemos codebase, run the same day
- SHRP Jira board: https://bldsync.atlassian.net/browse/SHRP
