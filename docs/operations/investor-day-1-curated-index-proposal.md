# Investor Data Room — Three-Tier Curated Index Proposal

**Goal:** Replace the current 168-doc / 11-section `docs-pdf/index.html` with a tier-gated investor view. Default access shows Day 1 only; deeper tiers unlock as the relationship progresses.

**Gating mechanism:** Clerk `publicMetadata.dataroom_tier` with three values:
- `preview` — Day 1 (View A) — auto-granted on first investor invite
- `diligence` — Mid-stage (View B) — granted after first meeting
- `deep` — Late-stage (View C) — granted after term sheet conversations begin

Implementation note: a single `index.html` can render all three tiers conditionally based on the Clerk metadata read in the page wrapper, OR three separate HTML files (`index.html`, `index-diligence.html`, `index-deep.html`) routed by middleware. **Recommend three files** — easier to audit, easier to send a direct link to a specific tier, and avoids client-side gating that a curious investor could bypass via DevTools.

---

## VIEW A — DAY 1 (`preview` tier, default)

**Goal:** A partner clicks the access link, spends 15 minutes, walks out with a clear story and wants the next meeting. 7 cards, single section.

**Section header:**
> **Sherpa Pros — Investor Overview**
> *The licensed-trade marketplace, built by a working contractor. Phase 0: pre-seed Wefunder + 10-pro beta cohort. Series A target close M12.*

**Cards (in order):**

1. **`pitch/sherpa-pros-deck-v2.html`** — *lead card, full-width feature*
   - Title: "Pitch Deck"
   - Description: "30-slide investor deck, current version. Series A narrative."
   - Tag: "Start here"
   - Also link the PDF + PPTX from this card's meta line.

2. **`pitch/sherpa-pros-onepager-v1.html`**
   - Title: "Executive Summary"
   - Description: "One-page overview — the document you forward to your partners before the next meeting."

3. **`pitch/tam-sam-som.html`**
   - Title: "Market Sizing"
   - Description: "Bottoms-up TAM / SAM / SOM for the licensed-trade marketplace."

4. **`pitch/competitive-analysis.html`**
   - Title: "Competitive Landscape"
   - Description: "Matrix vs. Angi, Thumbtack, TaskRabbit, ServiceTitan, and direct field-trade plays."

5. **`operations/brand-portfolio.html`**
   - Title: "Brand Portfolio"
   - Description: "Sherpa Pros brand system, product family, and design language."

6. **`slides/01-investor-pitch.html`** *(only if different from deck v2 — verify with founder; if redundant, REMOVE this card)*
   - Title: "Pitch Deck — Marp Format"
   - Description: "Same narrative, presentation-optimized layout. PDF + PPTX in meta line."

7. **`pitch/metrics-dashboard-design.html`** OR live link to `thesherpapros.com/admin/investor-metrics`
   - Title: "Traction Dashboard"
   - Description: "Live metrics: Founding Pros signed, jobs dispatched, Hub #1 timeline, Wefunder commitments."

**Excluded from Day 1 (with reasoning):**

- *Pitch deck v1* — outdated, having two decks visible signals confusion. Hide.
- *Speaker notes* — internal artifact. Move to diligence.
- *Brand audit* — internal QA artifact. Move to deep.
- *All Phase 0 strategy docs* (GTM spec, implementation plan, parallel-execution handoff) — internal sequencing/team artifacts. Move to deep.
- *All fundraising pills* (NH BFA, MassCEC, NSF SBIR, accelerator apps, VC pipeline, Wefunder FAQ) — these are *operator tools*, not investor materials. Hide entirely from investor data room. Investors don't need to see your grant applications. Move to deep, and consider hiding even there.
- *AI/ML roadmap design* — diligence-tier.
- *Migration drift audit* — never show to investors. Internal-only. Move to deep with a renamed label, or hide entirely.
- *Phase 1 Lean Launch operational docs* (Hub #1 buildout, FW Webb pitch, distribution partners, Sherpa Materials launch announcement) — diligence-tier.
- *Phase 4 Foundation & Execution Kits* — diligence + deep tier.
- *Operations Frameworks* (liability, insurance, Quick Job, beta cohort recruiting) — diligence-tier.
- *Marketing kit* (LinkedIn editorial, social plan, email sequences) — internal. Move to deep.
- *Brand assets* (icons, favicons, PWA) — never investor-facing. Hide entirely.
- *Slide decks #2-#6* (Founding Pro Recruit, PM Tier B2B, Wefunder, BV Meeting, Brand Bible) — these are *audience-specific* sales tools, not investor pitch material. The BV deck shouldn't even be in another VC's data room. Hide from Day 1; move BV-meeting deck to a separate gated link (don't put it in any tier of the general data room).
- *Stitched binders* — diligence-tier as convenience PDF.
- *Build pipelines* — never show. Hide entirely.

**Day 1 footer copy:**
> Want to go deeper? Reply to the access email and we'll open the diligence room.

---

## VIEW B — DILIGENCE (`diligence` tier)

**Goal:** Investor is interested. They want to see the operating substance before a partner meeting. Adds ~12 cards in 4 new sections. Total ~19 cards.

**Inherits all 7 Day 1 cards, plus:**

### New section: "Phase 1 — Lean Launch Plan"
8. `superpowers/specs/2026-04-26-ai-ml-roadmap-design.html` — "AI/ML Roadmap" — "How the Sherpa Materials engine and dispatch get smarter quarter-over-quarter."
9. `operations/hub-1-atkinson/milestone-calendar-m0-m4.html` — "Hub #1 Milestone Calendar" — "Atkinson, NH: M0–M4 buildout, soft-open, grand-open."
10. `operations/fw-webb-partnership/02-intro-pitch-deck.html` — "FW Webb Partnership" — "Anchor distributor partnership pitch + status."
11. `operations/distribution-partners/distribution-partner-pitch-deck.html` — "Distribution Partner Strategy" — "Multi-distributor LOI program."
12. `marketing/sherpa-materials-launch/launch-announcement.html` — "Sherpa Materials Engine — Launch Brief"

### New section: "Operating Frameworks"
13. `operations/sherpa-product-portfolio.html` — "4-Product Portfolio" — "Sherpa Pros, Sherpa Home, Quick Job, Companies-with-Employees."
14. `operations/liability-insurance-framework.html` — "Liability + Insurance" — "Marketplace liability posture, GL/E&O coverage, claims framework."
15. `operations/embedded-protection-products.html` — "Embedded Protection Products" — "Insurance attach + warranty model."
16. `operations/beta-cohort-recruiting-kit.html` — "10-Pro Beta Cohort" — "Founding Pros recruiting funnel + status."

### New section: "Strategic Roadmap (Series B+ Story)"
17. `superpowers/specs/2026-04-25-platform-scale-architecture-design.html` — "Platform Scale Architecture" — "Path from 1 Hub to 50 Hubs."
18. `superpowers/specs/2026-04-25-franchise-model-design.html` — "Franchise Model Design" — "Hub franchising path post-Series-B."
19. `superpowers/specs/2026-04-25-international-expansion-design.html` — "International Expansion Design" — "Post-Series-C playbook."

### New: convenience binder
20. `binders/strategy.pdf` — "Strategy Binder (PDF)" — "Spec, plan, deck, one-pager, competitive, TAM/SAM in a single bound PDF."

**Renamed for investor view:**
- "Migration vs Platform-Scale Drift Audit" → either RENAME to "Platform Scale Readiness Review" or hide. Recommend hide; investors don't need this.

---

## VIEW C — DEEP DILIGENCE (`deep` tier)

**Goal:** Term-sheet adjacent. Investor's analyst wants every operating artifact. Add ~25 cards. Total ~44 cards.

**Inherits all View B cards, plus:**

### New section: "Phase 0 Strategy & Sequencing"
- GTM & Fundraising Design Spec
- Phase 0 Implementation Plan
- (Skip the parallel-execution handoff — internal team artifact; if asked, share separately.)

### New section: "Phase 4 Execution Kits"
- Hub #1 Atkinson full kit
- FW Webb Partnership full kit
- SOC 2 Readiness (12 files) — *signal: we know what enterprise-readiness costs*
- Franchise FDD Prep (12 files)
- Multi-Region Engineering (14 files)
- International Launch Kits (12 files)
- Distribution Partners full kit

### New section: "Strategic Extensions (Phase 4)"
- Series C Pitch Deck Design
- Acquisition Track Analysis
- Embedded Fintech Roadmap
- Vertical SaaS Spinout Strategy
- Phase 4 OKRs & Measurement Framework
- Phase 4 Org Design
- AI/ML Roadmap (full)
- RBAC, Roles, Dispatch + Marketing Design

### New section: "Operations Reference Library"
- Sherpa Home Subscription
- Companies-with-Employee-Time Segment
- Quick Job Lane + 47-task catalog
- Insurance Broker Outreach
- Attorney Engagement Package
- Brand asset prompts + social media library

### New section: "Marketing Operations"
- 30-Day Social Content Plan
- LinkedIn Editorial — 39 posts
- Two-Sided Referral Mechanics
- Email sequences (4 sequences)

### New section: "Convenience Binders"
- Phase 0 Master Binder (54 MB)
- Operations, Fundraising, Marketing binders

**Still excluded even at deep tier:**
- Build pipelines (`scripts/build-docs-*.mjs`) — engineering artifact, no investor value.
- TODO-MVP-FIXES — internal triage.
- Drift / audit documents with "drift" or "audit" in the title — rename to "Readiness Review" if surfaced at all.
- Brand assets folder (icons, favicons, PWA images) — irrelevant to investors.
- Marp themes / editorial CSS — engineering artifact.
- All BV-specific or Suffolk-specific decks — keep these out of the general data room. Share via direct link to that specific firm only.
- Wefunder-specific materials (FAQ, page content, PR launch plan) — public investor channel, not VC-channel material.
- Grant applications — operator tools.
- All accelerator applications — operator tools.

---

## Implementation Translation Notes (for the orchestrator)

1. **Three HTML files**, not one with client-side gating:
   - `docs-pdf/index.html` (renamed View A — the default investor preview)
   - `docs-pdf/index-diligence.html` (View B)
   - `docs-pdf/index-deep.html` (View C)

2. **Middleware gating** (`src/proxy.ts` or the dataroom route handler) reads Clerk `publicMetadata.dataroom_tier` and:
   - `preview` → only `index.html` accessible; redirect deeper paths to `index.html`.
   - `diligence` → `index.html` and `index-diligence.html` accessible.
   - `deep` → all three accessible.
   - No tier set → 404 the entire `/dataroom` route.

3. **Cross-links between tiers** at the footer of each:
   - View A footer: "Want the operating detail? Email phyrom@thesherpapros.com to open the diligence room."
   - View B footer: "Reviewing for a term sheet? We'll open full-diligence access on request."

4. **Founder name everywhere** must read **Phyrom**, never Hunter, never HJD-as-operator. Tagline can keep "built by a working contractor" — that's Phyrom's contractor identity (HJD Builders), and it's an asset, not a brand collision.

5. **Never expose "Wiseman" anywhere** in any tier. Use "Sherpa Materials engine," "Dispatch engine," etc.

6. **Pull the deck v1 link entirely.** Two pitch decks visible to investors looks unfinished. v2 only.

7. **The current top-nav** (Phase 0 · Strategy / Phase 0 · Pitch / Phase 0 · Fundraising / Phase 1 · Lean Launch / Phase 4 · Foundation / Phase 4 · Execution Kits / Operations / Marketing / Brand / Slide Decks / Binders / Pipelines) **is investor-hostile.** Replace with View A's flat single-section layout. View B's nav can show 4 tabs (Overview / Phase 1 / Operating / Strategic Roadmap). View C can keep most of the current nav, but rename "Phase 4 — Execution Kits" → "Operating Detail," and drop the "Phase 0 / Phase 1 / Phase 4" Wave-jargon — investors don't know your internal phase taxonomy.

8. **Pipelines section: delete entirely from all investor tiers.** This belongs on an internal team page, not in any external view.

---

## Verification asks for the founder

Before implementation, confirm:

1. Is `slides/01-investor-pitch.html` (View A card #6) duplicative of `pitch/sherpa-pros-deck-v2.html`? If yes, drop card #6 — Day 1 should be 6 cards, not 7.
2. Does `pitch/metrics-dashboard-design.html` show real traction or design-only? If design-only, prefer the live `/admin/investor-metrics` link or replace with a screenshot doc.
3. Confirm `marketing/sherpa-materials-launch/launch-announcement.html` is investor-friendly (not internal-only language).

---

## Last updated
2026-04-27 — Phase 0 (pre-seed Wefunder + 10-pro beta + investor data room launch).
