---
marp: true
theme: sherpa-pros-editorial
title: Sherpa Pros + {{partner_name}} — Sticky Pro Customers, Co-Located
date: {{date_of_meeting}}
status: template
owner: Phyrom (Founder, Sherpa Pros LLC)
parameters:
  - $partner_name        # e.g. "FW Webb", "Ferguson", "84 Lumber", "Rexel"
  - $partner_category    # e.g. "plumbing/HVAC PVF", "electrical", "lumber & building materials", "multi-trade pro"
  - $branch_count        # public branch count
  - $date_of_meeting
  - $partner_decision_maker
references:
  - docs/operations/fw-webb-partnership/04-fw-webb-economic-model.md
  - docs/operations/fw-webb-partnership/03-pilot-loi-template.md
  - docs/operations/distribution-partners/loi-template-distribution-partner.md
  - docs/operations/distribution-partners/evaluation-metric-memo.md
paginate: true
---

<!-- _class: hero -->

# Sherpa Pros + {{partner_name}}
## Your pro counter customers are about to become sticky.

Phyrom, Founder — Sherpa Pros LLC
{{date_of_meeting}}

---

## 2 — Why this meeting

Three forces are converging on the {{partner_category}} pro counter:

- **Amazon Business Trade, HD Pro Xtra, and Lowe's Pro** are spending nine figures a year to peel pros off your counter
- The **median {{partner_category}} pro shops 2-3 distributors per job** — share of wallet is bleeding
- Pros increasingly choose distributors based on **what happens around the materials**, not the materials themselves

{{partner_name}} owns the materials moment. Sherpa Pros owns the **rest of the pro's day**. Co-locate them and the pro never leaves.

---

## 3 — The thesis: one Hub, one default distributor

A pro who buys at {{partner_name}} today buys 30-50% of their job's materials there. The other half walks across the parking lot.

When a Sherpa Hub sits **inside** a {{partner_name}} branch, the pro's morning becomes:

1. Pull into the {{partner_name}} lot at 6:30 a.m.
2. Materials are pre-staged at the Sherpa Hub (ordered the night before through Sherpa Materials)
3. Pro grabs coffee, takes a call, prints a permit, picks up dispatched jobs
4. Add-on materials? **30 feet to the {{partner_name}} counter** — not 12 miles to a competitor

**One co-located partner becomes the structural default supplier for that pro.** That is the flywheel.

---

## 4 — The headline ROI: incremental pro revenue per branch

This is what {{partner_name}} earns from hosting one Sherpa Hub, per branch, in Year 1 (modeled in `04-fw-webb-economic-model.md`):

| Line | Per branch / Year 1 |
|---|---|
| Incremental counter foot-traffic spend (+15% on baseline pro counter sales) | **+$420,000** |
| Sherpa Materials orchestrated purchase volume (Year-1 ramp avg) | **+$240,000** |
| Will-call / delivery service uplift | **+$36,000** |
| Sub-lease revenue (~95% margin) | **+$18,000** |
| **Gross incremental revenue per branch** | **+$714,000** |
| **Net incremental EBITDA per branch (Year 1)** | **+$165K - $210K** |

Conservative. Breakeven on counter lift is **+3.5%** vs the +15% planned.

---

## 5 — The 5-year compounding picture

Per pilot branch, conservative ramp (Hub members 40 → 250 over 5 yrs):

| Year | Net incremental EBITDA per branch |
|---|---|
| 1 | $165K - $210K |
| 2 | $285K - $340K |
| 3 | $415K - $475K |
| 4 | $510K - $580K |
| 5 | $590K - $660K |
| **5-yr cumulative per branch** | **$1.97M - $2.27M** |

**Across 5 pilot branches: $9.85M - $11.35M cumulative incremental EBITDA.**

If you're paying Amazon-like CAC to defend pro share today, this is the same dollar redirected to a structural moat instead.

---

## 6 — The carrying-cost / dead-stock secondary benefit

Beyond top-line: Sherpa Materials orchestration intelligently pulls **slow-moving SKUs** out of {{partner_name}} branches before they age into write-down territory.

- Sherpa Materials engine (live in production today) routes pros toward in-stock SKUs at the partner branch when price is within 7% of next-best
- Buffer-stocked Hub mode absorbs 40% of orchestrated volume — turns shelf-time into staged-pickup-time
- Reduces partner-branch dead-stock exposure and improves inventory turn rate [VERIFY by partner-branch]

Headline = sticky pros. Secondary = a healthier branch P&L on the inventory side.

---

## 7 — The Sherpa Hub footprint inside your branch

Each Hub occupies **~800-1,500 sq ft co-located** within or directly adjacent to a {{partner_name}} branch:

- Pro lounge / coffee / printing / phone area
- Sherpa Materials staging area (Top-200 SKU buffer)
- Sherpa Pros member check-in counter
- Hub Manager workstation
- Member meeting / training space (sized per branch)

**{{partner_name}} provides:** floor space, security extension, utilities, restroom + breakroom access, parking.
**Sherpa Pros provides:** ~$80K capex per Hub, Hub Manager + staff, equipment, software, marketing, all member acquisition.

Hub opens **8 weeks** from buildout-start vs 16-20 weeks standalone.

---

## 8 — Why co-location beats every alternative

|  | Co-located inside {{partner_name}} | Standalone Hub | Pure-digital marketplace |
|---|---|---|---|
| Capex per location | **$80K** | $185K | n/a |
| Time to revenue | **8 weeks** | 16-20 weeks | infinite (no physical anchor) |
| Pro acquisition cost | **~$0** (anchor foot traffic) | $300-450/member | $400-700/member |
| Materials integration | **Same building** | Off-site (Zinc + Uber Direct) | None |
| Defensibility vs Amazon Business | **High** | Medium | Low |

Co-location is the **only** model where partner economics and pro economics compound on the same square footage.

---

## 9 — Sherpa Materials engine (live in production)

The Hub is the front door. The **engine** behind it is what makes {{partner_name}} the default supplier:

- **Sherpa Materials engine** — orchestrates SKU sourcing across partner inventory in real time
- **Zinc API** — landed-cost arbitration; reweighted to favor {{partner_name}} when within 7% of next-best
- **Uber Direct dispatch** — 4 daily waves (6:30 / 8:00 / 10:00 / 12:00) from Hub to job site
- **Three fulfillment modes per Hub**: 40% buffer-stocked / 35% counter-pickup / 25% staged-and-Uber-Direct

**During pilot, in pilot regions, {{partner_name}} is the preferred-vendor primary.** That is contractually locked in the LOI (§3.3, §6).

---

## 10 — The 5-Hub pilot structure

A 12-month pilot, 5 co-located Hubs across {{partner_name}} pilot branches selected by mutual agreement:

- **5 Hubs operational by Month 6** from LOI signature
- **Pilot Term**: 12 months from Hub #1 soft-open
- **Sub-lease**: $1,500/Hub/month inclusive of CAM (= $90K/yr revenue at near-100% margin across 5 Hubs)
- **Materials volume floor**: $20K/Hub/mo by M6 → $40K/Hub/mo by M12
- **Performance gates**: per-Hub + network-wide + partner-side (Layer 3 validates the slide-4 economic model)

Standardized template — same LOI structure deployed across {{partner_category}} category. See `loi-template-distribution-partner.md`.

---

## 11 — Pilot exclusivity (mutual)

During the 12-month Pilot Term:

- **{{partner_name}} side**: does not host or sub-lease to any competing pro-marketplace platform within 25 mi of any Pilot Branch
- **Sherpa Pros side**: does not co-locate with any competing {{partner_category}} multi-branch wholesale distributor ($100M+ rev) within 25 mi of any Pilot Branch
- **Carve-outs**: single-trade specialty distributors and DIY retail (Home Depot, Lowe's) are not "competing"

This is geographic exclusivity, not category exclusivity — Sherpa Pros runs parallel pilots in non-overlapping {{partner_category}} categories nationally.

---

## 12 — The 6-phase engagement runbook

| Phase | Weeks | Milestone |
|---|---|---|
| 1. Alignment | 0-2 | Today's meeting + strategic logic confirmed |
| 2. Regional intro | 2-4 | Regional VP + branch-manager introductions |
| 3. Site walks | 5-8 | On-site visits to 5 candidate {{partner_name}} branches with Phyrom |
| 4. LOI drafting | 9-14 | Joint legal review on `loi-template-distribution-partner.md` |
| 5. **LOI signed** | **16** | **Hard deadline: Phase 1 Month 4** |
| 6. Hub buildout | 17-26 | Hub #1 soft-open by Week 26 |

Founder-led from Phyrom's side throughout. Single point of accountability.

---

## 13 — Success metrics (joint review)

The headline metric — **incremental pro-account revenue per pilot branch vs control branches** — is reviewed quarterly (see `evaluation-metric-memo.md`):

- **90 days**: instrumentation live; member onboarding tracking
- **180 days (M6)**: Hub #1-#3 operational; per-Hub gates checked at floor
- **365 days (M12)**: full network rolling; expansion go/no-go decision

3 secondary metrics: pro-account churn reduction, share-of-wallet capture, materials orchestration GM%. All instrumented through Sherpa Pros' Per-Hub P&L Dashboard (`06-per-hub-pl-dashboard-spec.md`) + a {{partner_name}} monthly data feed.

---

## 14 — The ask

**Pilot LOI signed by Phase 1 Month 4 — HARD DEADLINE.**

Sequence:

1. Today: alignment meeting — does the strategic logic land for {{partner_name}}?
2. Weeks 2-4: Regional VP + branch-manager introductions
3. Weeks 5-8: On-site walks at 5 candidate branches
4. Weeks 9-14: LOI drafting + legal review (both sides)
5. **Week 16: LOI signed**
6. Weeks 17-26: Hub buildouts begin

**Decision-maker we need in the room next:** {{partner_decision_maker}}

Phyrom — poum@hjd.builders — {{phone}}

---

## 15 — Why now, why us

- Sherpa Materials engine is **live in production today** (materials engine + Zinc API + Uber Direct) — this is not vaporware
- 175+ commits, 640+ files shipped on Sherpa Pros platform; RBAC, dispatch, Hub spec all complete
- Founder is a working {{partner_category}} customer — Phyrom buys at the counter weekly and built the platform he wished existed
- {{partner_name}}'s pro relationships are the moat. We are the lock that makes the moat permanent.

**The pro who walks into {{partner_name}} at 6:30 a.m. is the same pro who needs everything we built. Let's give them one frictionless morning.**
