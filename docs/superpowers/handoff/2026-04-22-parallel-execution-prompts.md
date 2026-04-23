# Sherpa Pros Phase 0 — Parallel Execution Handoff

**Purpose:** Run the remaining Phase 0 work across multiple Claude Code terminal sessions in parallel. Each terminal owns one workstream, has a clear scope, knows what files it owns, and knows what NOT to touch.

**Source plan:** `docs/superpowers/plans/2026-04-22-phase-0-fundraise-and-beta.md` (47 tasks, 9 workstreams)
**Source spec:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md`
**Brand audit:** `docs/pitch/brand-audit.md`

---

## How to use this document

1. Open 6 terminal windows in `/Users/poum/sherpa-pros-platform/`
2. In each terminal, run `claude` to start a Claude Code session
3. Paste the corresponding prompt (T1–T6 below) into each terminal
4. Each session works independently in its own scope — minimal coordination overhead
5. Re-converge once a week (or when blocked) — point all sessions to update the **Weekly Status** doc at `docs/operations/weekly-status/<YYYY-WW>.md`

**Coordination rules (apply to all terminals):**
- ✅ Each terminal commits to `main` after completing a discrete task
- ✅ Each terminal pulls before pushing to avoid conflicts (`git pull --rebase origin main`)
- ❌ Do NOT modify files outside your declared scope (listed per terminal below)
- ❌ Do NOT touch `docs/superpowers/specs/` or `docs/superpowers/plans/` — those are source-of-truth, never modified by execution
- ✅ If you discover something the spec needs, add a `## Open Questions` section to your terminal's status file and flag it to Phyrom

**Phyrom's open decisions (block some terminal work):**
- Surname: still UNKNOWN — never write a Phyrom surname until confirmed
- Canonical email: `phyrom@thesherpapros.com` vs `poum@hjd.builders` — pick one
- Canonical domain: `thesherpapros.com` vs `sherpa-pros-platform.vercel.app` — pick one
- Mass Save 2026 rebate: spec says "$10K+", verify against current program docs

---

## T1 — Engineering / Code Work

**Scope:** Phase 0 critical-path code from plan §A and §B (data scoping, beta finance backend, dashboard live queries).

**Owns these files:**
- `src/app/api/**` (data scoping fixes per `docs/TODO-MVP-FIXES.md`)
- `src/app/api/beta-feedback/route.ts` (new — per plan Task B4)
- `src/app/(dashboard)/pro/feedback/page.tsx` (new — per plan Task B4)
- `src/lib/payments/stripe.ts` (Stripe Connect live keys per plan Task A1)
- `src/db/migrations/006_*.sql` and onward (any new migrations needed)
- `tests/api/**` (TDD coverage)

**Will NOT touch:**
- `docs/**` (other terminals own docs)
- `src/app/(marketing)/**` (T5 owns marketing pages)
- `src/app/(dashboard)/admin/investor-metrics/**` (already shipped, leave alone)

**Prompt to paste:**

```
I'm taking over the Engineering workstream for Sherpa Pros Phase 0.

Read these for full context (in this order):
1. docs/superpowers/specs/2026-04-22-gtm-marketing-design.md (the GTM spec)
2. docs/superpowers/plans/2026-04-22-phase-0-fundraise-and-beta.md (47-task plan, focus on Workstream A and B)
3. docs/TODO-MVP-FIXES.md (the existing data-scoping checklist)
4. CLAUDE.md (project conventions — Server Components default, App Router only, lazy SDK init, etc.)
5. src/db/drizzle-schema.ts (current schema — already has migration 005 additions)

Tasks I own (in priority order):
1. Plan Task A1 — switch src/lib/payments/stripe.ts to live Stripe Connect keys (test in test mode first; coordinate Vercel env var add with Phyrom)
2. Plan Task A3 — apply data scoping per docs/TODO-MVP-FIXES.md, TDD-style. Write failing scoping test → fix route → green test → commit per route.
3. Plan Task B4 — beta feedback API + in-app form (use the schema already added in migration 005: nps_responses table)
4. Deploy migration 005 to Neon production (via psql or drizzle-kit push) — coordinate timing with Phyrom

Use superpowers:test-driven-development for each code task. Use superpowers:verification-before-completion before claiming any task done.

Files I own: src/app/api/**, src/lib/**, src/db/migrations/006_*.sql onward, tests/**.
Files I DON'T touch: docs/**, src/app/(marketing)/**, src/app/(dashboard)/admin/investor-metrics/**.

Commit per task. Push to origin/main after each. Pull --rebase before push.

Track my progress in docs/operations/weekly-status/<YYYY-WW>.md (create the file if missing). Format: ## T1 Engineering — section with date, completed tasks, blockers.

When I'm blocked or done with the in-flight task, post a status update and wait for Phyrom or other terminal coordination.
```

---

## T2 — Grant Application Submissions

**Scope:** Take the 6 grant drafts in `docs/fundraising/grants/`, edit each into Phyrom's voice (he reviews), submit, track status.

**Owns these files:**
- `docs/fundraising/grants/*.md` (edit drafts to submission-ready)
- `docs/fundraising/status/grants.md` (NEW — submission tracker)

**Will NOT touch:**
- Anything in `src/`, `mobile/`, `public/`
- Other `docs/fundraising/` subdirectories (T3, T4 own those)
- Spec or plan files

**Prompt to paste:**

```
I'm taking over the Grant Submissions workstream for Sherpa Pros Phase 0.

Read these for full context:
1. docs/superpowers/specs/2026-04-22-gtm-marketing-design.md (especially §6.1 non-dilutive tracks)
2. docs/superpowers/plans/2026-04-22-phase-0-fundraise-and-beta.md (Workstream E, tasks E1-E6)
3. docs/pitch/sherpa-pros-deck-v1.md, sherpa-pros-onepager-v1.md (the canonical narrative)
4. docs/pitch/competitive-analysis.md, tam-sam-som.md (sourced numbers + claims)
5. docs/pitch/brand-audit.md (P0 + P1 issues that may apply to grant copy too)
6. docs/fundraising/grants/ (the 6 existing drafts)

Tasks I own (in this order — highest ROI first per Wave 2 agent recommendation):
1. NH BFA microloan + Innovation Voucher (rolling, easiest, ~30 day approval)
2. MA SBTA via nonprofit partner (after Phyrom picks the partner — Asian American Civic Association recommended over BECMA per Wave 2 finding)
3. MassDev Biz-M-Power (file in parallel with Wefunder pre-launch)
4. NSF SBIR Phase I — Project Pitch first, then full proposal if invited (requires SAM.gov registration first)
5. MassCEC Catalyst (next round — confirm dates with masscec.com)
6. MassCEC InnovateMass (next round)

For EACH grant, my workflow:
  a) Re-read the existing draft at docs/fundraising/grants/<name>.md
  b) Apply Phyrom voice edits (plainspoken, founder-led, no marketing speak per spec §3.3)
  c) Run the brand-audit checklist (no "Wiseman" externally, no jargon abbreviations on first use, no surname for Phyrom)
  d) Verify eligibility blockers from Wave 2 agent's eligibility list (MA foreign-LLC reg, SAM.gov reg, BECMA fit, etc.)
  e) Output the FINAL submission text + a step-by-step "how to submit" runbook (URLs, login flow, attachments needed)
  f) Update docs/fundraising/status/grants.md with: program, status (drafting/awaiting-Phyrom/submitted/awarded/rejected), submission date, decision date, $ committed
  g) Commit with message "docs(fundraising): grant <name> ready for submission" or "docs(fundraising): grant <name> submitted [date]"

Files I own: docs/fundraising/grants/*.md, docs/fundraising/status/grants.md (create if missing).
Files I DON'T touch: anywhere in src/, mobile/, public/, other docs/fundraising/ subdirs.

Important constraints:
- Phyrom's surname is UNKNOWN — never write "Phyrom Doung" or any surname. Use "Phyrom" or "P" only.
- Never use "Wiseman" externally — call it "code-aware quote validation" or "code intelligence layer"
- Spell out abbreviations on first use (CO → Change Order, GMV → Gross Merchandise Value, etc.)
- Use real numbers from tam-sam-som.md; placeholder beta cohort metrics as [X beta pros, $Y GMV]

Pull --rebase before each commit. Commit + push per grant ready for submission.

When a grant draft is "ready for Phyrom review," stop and post a status update — do NOT try to submit on his behalf.
```

---

## T3 — Accelerator Application Submissions

**Scope:** 5 accelerator drafts in `docs/fundraising/accelerators/` — edit to submission-ready, track.

**Owns these files:**
- `docs/fundraising/accelerators/*.md`
- `docs/fundraising/status/accelerators.md` (NEW)

**Prompt to paste:**

```
I'm taking over the Accelerator Submissions workstream for Sherpa Pros Phase 0.

Read these for full context:
1. docs/superpowers/specs/2026-04-22-gtm-marketing-design.md (especially §6.2 accelerators)
2. docs/superpowers/plans/2026-04-22-phase-0-fundraise-and-beta.md (Workstream F, tasks F1-F5)
3. docs/pitch/sherpa-pros-deck-v1.md, sherpa-pros-onepager-v1.md (canonical narrative)
4. docs/pitch/brand-audit.md (P0 + P1 brand issues — esp. Wiseman/BldSync internal-name leaks already cleaned)
5. docs/fundraising/accelerators/ (the 5 existing drafts)

Tasks I own (in optimal submission order per Wave 2 agent recommendation):
1. Y Combinator (rolling, shortest application, highest brand-halo) — submit Week 1
2. Suffolk Technologies (Boston Built Environment — bullseye fit, mentors include Suffolk Construction execs) — submit Week 1
3. MassChallenge (zero equity, up to $1M cash prize, MA-impact thesis fit) — submit Week 1-2
4. Techstars ConstructionTech (vertical-specific, $220K @ 5%) — submit Week 2
5. Greentown Labs (membership inquiry first, then formal app) — Week 2-3

For EACH accelerator, my workflow:
  a) Re-read the existing draft
  b) Verify cycle window is open (visit URL listed in draft)
  c) Apply Phyrom voice edits — every accelerator has a different reviewer bias (Suffolk = operator-first, YC = short and specific, MassChallenge = impact-first, Techstars = traction-first, Greentown = climate-impact)
  d) Run brand-audit checklist — no Wiseman, no surname, no AI-powered headline
  e) Output FINAL submission text + step-by-step "how to submit" runbook (URLs, format requirements, supplemental materials needed)
  f) Update docs/fundraising/status/accelerators.md per submission
  g) Commit + push

Files I own: docs/fundraising/accelerators/*.md, docs/fundraising/status/accelerators.md.
Files I DON'T touch: src/, mobile/, public/, other docs/fundraising/ subdirs.

Critical reminder from Wave 2 agent: each accelerator needs different supplemental materials Phyrom may not have:
- Founder video shot on a real NH jobsite (Suffolk, Techstars, YC, Greentown all want this)
- Real beta cohort numbers (every draft has [X beta pros, $Y GMV] placeholders — cannot submit until beta is live with real Stripe transactions)
- Climate-impact one-pager variant for Greentown
- Cap table PDF (Phyrom 100% common, no SAFEs yet)
- Cycle date verification per accelerator

Stop and ask Phyrom before submitting any application. My job is to get drafts into "ready for Phyrom approval and submission" state.

Pull --rebase before commit. Commit + push per accelerator ready.
```

---

## T4 — Wefunder Community Round Launch

**Scope:** Wefunder kit in `docs/fundraising/wefunder/` — pre-launch list build, page setup, launch day execution.

**Owns these files:**
- `docs/fundraising/wefunder/*.md`
- `docs/fundraising/wefunder/prelaunch-list.md` (NEW)
- `docs/fundraising/status/wefunder.md` (NEW)

**Prompt to paste:**

```
I'm taking over the Wefunder Community Round workstream for Sherpa Pros Phase 0.

Read these for full context:
1. docs/superpowers/specs/2026-04-22-gtm-marketing-design.md (especially §6.4 Wefunder track)
2. docs/superpowers/plans/2026-04-22-phase-0-fundraise-and-beta.md (Workstream H, tasks H1-H6)
3. docs/fundraising/wefunder/faq.md (30-question investor FAQ — already drafted)
4. docs/fundraising/wefunder/page-content.md (full Wefunder page — 12 sections drafted)
5. docs/fundraising/wefunder/pr-launch-plan.md (press release + 30 named reporters + podcast pitches)
6. docs/pitch/brand-audit.md (P0 + P1 brand issues)

Tasks I own (sequenced):
1. WEEKS 1-2: Pre-launch list build
   - Create docs/fundraising/wefunder/prelaunch-list.md
   - Outreach to HJD client network (script: "Building something new — would mean a lot if you'd be among the first to look at it. No commitment yet.")
   - Outreach to beta pros + their clients (permissioned)
   - Outreach to local press readers (Seacoast Online, NHPR, NHBR editors)
   - Goal: 100+ "interested" signups before public launch

2. WEEKS 2-4: Wefunder page setup
   - Phyrom edit pass on faq.md and page-content.md
   - Build the page in Wefunder admin (will require Phyrom login)
   - Submit to Wefunder for compliance review (5-10 business days)
   - Lock SAFE terms (valuation cap, discount, MFN) per attorney review — flag MFN side-letter question to attorney before publishing

3. WEEKS 5-6: Soft-launch (private mode)
   - Activate Wefunder page in private mode
   - Share link only with pre-launch list
   - Goal: $100K+ soft-committed before public

4. WEEKS 7-8: Public launch + PR push
   - Flip page to public when $100K+ soft-committed
   - Execute pr-launch-plan.md: press release, podcast pitches, social launch playbook
   - Use the Banker & Tradesman housing-decline story as primary newsjack angle

5. WEEKS 9-12: Drive to $250K+ committed by W12
   - Daily LinkedIn cadence highlighting raise progress
   - Weekly investor updates to commit-watchers
   - Close Reg CF campaign at W12 (90-day max)

Files I own: docs/fundraising/wefunder/**, docs/fundraising/status/wefunder.md.
Files I DON'T touch: src/, mobile/, public/, other docs/fundraising/ subdirs, docs/marketing/ (T5 owns LinkedIn).

Critical pre-launch items:
- Attorney must review SAFE template (Wefunder standard) — specifically the MFN side-letter shutdown question flagged by Wave 2 agent
- MassDev Biz-M-Power application must be filed BEFORE Wefunder closes (so the $50K state match is captured)
- Every public-facing artifact must run brand-audit checklist (no Wiseman, no surname, no jargon)
- Mass Save rebate amount in page-content.md is "$10,000+" — verify against current Mass Save 2026 program docs before publish

Coordinate with T5 (marketing) for LinkedIn-driven Wefunder traffic.

Pull --rebase before commit. Status updates to docs/fundraising/status/wefunder.md weekly.
```

---

## T5 — Marketing Channel Execution

**Scope:** Daily LinkedIn posting cadence, supply-house flyer distribution, NHHBA + MEHBA outreach, content calendar execution.

**Owns these files:**
- `docs/marketing/*.md` (read-only on existing files; create new content as needed)
- `docs/marketing/posted/<YYYY-MM-DD>-linkedin.md` (NEW per post — paste the published version)
- `docs/marketing/supply-house-distribution.md` (NEW — flyer drop log)
- `docs/marketing/trade-association-outreach.md` (NEW — partnership tracker)

**Prompt to paste:**

```
I'm taking over the Marketing Channel Execution workstream for Sherpa Pros Phase 0.

Read these for full context:
1. docs/superpowers/specs/2026-04-22-gtm-marketing-design.md (§3 brand voice, §8 channels)
2. docs/superpowers/plans/2026-04-22-phase-0-fundraise-and-beta.md (Workstream D, tasks D1-D5)
3. docs/marketing/linkedin-editorial.md (39 posts already drafted, 90-day calendar)
4. docs/marketing/email-sequences/ (4 email sequences ready to send)
5. docs/marketing/referral-mechanics-design.md (4 referral loops — implement copy as feedback flows)
6. docs/pitch/brand-audit.md (Phyrom voice rules)

Tasks I own (3-week rolling cadence):
1. LINKEDIN POSTING (3x/week, Mon/Wed/Fri)
   - Pull next post from docs/marketing/linkedin-editorial.md
   - Phyrom voice-pass (he reviews, may edit, posts manually OR via Buffer/Hypefury if connected)
   - After post is live, save the published version to docs/marketing/posted/<YYYY-MM-DD>-linkedin.md with engagement metrics added 48hr later
   - Capture insights worth flagging back to Phyrom (high-engagement post types, audience comments worth replying to, viral threads to amplify)

2. SUPPLY-HOUSE FLYER DISTRIBUTION (Weeks 2-6)
   - Use docs/marketing/supply-house-flyer.pdf if it exists; if not, design one (Phyrom approves)
   - Track distribution at docs/marketing/supply-house-distribution.md (column: store name, manager contact, drop date, return-for-refill date, scan QR analytics if available)
   - Target: 20 supply houses (FW Webb, Lowe's Pro Desk, Rockler, Best Tile, Riverhead Building Supply)

3. NHHBA + MEHBA PARTNERSHIP OUTREACH (Weeks 1-4)
   - Identify ED + board chair at each
   - Customized pitch: "free Founding Pro for any member"
   - Track at docs/marketing/trade-association-outreach.md
   - Goal: featured in member newsletter, table at next member meeting, intro to top 10 active members

4. EMAIL SEQUENCE EXECUTION
   - Pro-recruiting (5 emails): triggered when a cold contractor contact is added to outreach
   - Client-recruiting (3 emails): for HJD existing clients onboarding
   - Pro re-engagement (3 emails): triggered for inactive Founding Pros
   - PM outbound (4 emails): B2B to property managers

Files I own: docs/marketing/posted/, docs/marketing/supply-house-distribution.md, docs/marketing/trade-association-outreach.md.
Files I DON'T touch: docs/fundraising/ (T2/T3/T4/T6), src/, mobile/, public/.

Critical:
- Phyrom voice rules: plainspoken, 8th-grade reading level, founder hook leads, no Wiseman externally, no surname
- Coordinate with T4 (Wefunder) for raise-momentum LinkedIn posts in W7-12
- Coordinate with T6 (VC outreach) when an investor signal worth amplifying appears

Status updates to docs/operations/weekly-status/<YYYY-WW>.md weekly. Section header: "## T5 Marketing".
```

---

## T6 — VC Outreach + Building Ventures Push

**Scope:** Work the 53-firm investor pipeline, run the Building Ventures warm intro, manage CVC conversations, track meetings + follow-ups.

**Owns these files:**
- `docs/fundraising/vc/*.md`
- `docs/fundraising/status/vc-meetings.md` (NEW — meeting log)

**Prompt to paste:**

```
I'm taking over the VC Outreach workstream for Sherpa Pros Phase 0.

Read these for full context:
1. docs/superpowers/specs/2026-04-22-gtm-marketing-design.md (especially §6.3 VC tracks)
2. docs/superpowers/plans/2026-04-22-phase-0-fundraise-and-beta.md (Workstream G, tasks G1-G5)
3. docs/fundraising/vc/investor-pipeline.md (53 firms across 4 tiers — Built World, marketplace, strategic CVC, NE-local angels)
4. docs/fundraising/vc/building-ventures-warm-intro.md (3 voices + cold backup — top priority outreach)
5. docs/fundraising/vc/cvc-outreach.md (National Grid Partners pitch — note: Eversource has NO branded CVC arm, treat as utility partnership not equity)
6. docs/pitch/sherpa-pros-deck-v1.md (the deck)
7. docs/pitch/competitive-analysis.md, tam-sam-som.md (sourced numbers for pitch follow-ups)
8. docs/pitch/brand-audit.md (Phyrom voice rules)

Tasks I own (in priority order):
1. WEEK 1: Building Ventures warm intro
   - Identify warm-intro path (per Wave 2 agent: NHHBA → MA AGC → Suffolk Construction → Building Ventures via BOOST accelerator network)
   - Phyrom sends warm-intro request email to mutual contact (use one of 3 voice variants in building-ventures-warm-intro.md)
   - Log every touch in docs/fundraising/status/vc-meetings.md
   - If no warm path materializes within 2 weeks, use cold backup email

2. WEEKS 1-2: Tier 0 NE-local angels (lowest friction, fastest signal)
   - HJD network high-net-worth GCs/developers (Phyrom names them)
   - NHHBA + MEHBA board members
   - Coordinate with T4 (Wefunder) — these angels can also become Wefunder soft-commit lead investors
   - Goal: 5+ angel checks ($25K-$150K each) by W4

3. WEEKS 3-6: Tier 1 Built-World VCs (warm intros)
   - Building Ventures (in flight from #1)
   - Brick & Mortar Ventures (research warm path through Phyrom's NHHBA + Suffolk network)
   - Foundamental (Adam Zobler, NA partner — engagement hook: his "generalist vs specialist VC" essay per Wave 2 agent)
   - Zacua Ventures, Schematic Ventures, Nine Four Ventures
   - Goal: 5 first-meetings booked by W6

4. WEEKS 5-8: Tier 2 marketplace + general pre-seed (NFX, Version One, Hustle Fund, Pear, Forum, Precursor)
   - Each meeting: send 24hr follow-up with requested materials
   - Update docs/fundraising/vc/investor-pipeline.md per touch

5. WEEKS 7-10: Strategic CVC (National Grid Partners is the primary target)
   - Lisa Lambert at National Grid Partners (per Wave 2 agent research)
   - Entry path: NextGrid Alliance (100-member network) is the natural waypoint
   - Realistic check size: $1M-$1.5M strategic
   - Pitch: "Mass Save heat-pump installer wait times are 3-6 months. We solve that."
   - Eversource is NOT a CVC target — pursue as utility partnership instead

6. WEEKS 9-12: First close target
   - Term sheet negotiation if any Tier 1/2 VC commits
   - Phyrom + attorney handle SAFE/priced-round mechanics
   - Coordinate with T4 (Wefunder) — VC term sheet validates Wefunder valuation cap

Files I own: docs/fundraising/vc/*.md, docs/fundraising/status/vc-meetings.md.
Files I DON'T touch: src/, mobile/, public/, other docs/fundraising/ subdirs, docs/marketing/.

Critical:
- Use REAL partner names + recent investments in outreach. Don't invent. Cite sources.
- No Wiseman externally — call it "code-aware quote validation" or "code intelligence layer"
- No Phyrom surname — just "Phyrom" or "P"
- Mark any partner whose name isn't 100% verified as [VERIFY: name]
- Building Ventures is the FIRST CALL — this is the highest-leverage single conversation in the entire VC pipeline

Pull --rebase before commit. Status updates to docs/operations/weekly-status/<YYYY-WW>.md weekly. Section header: "## T6 VC Outreach".
```

---

## Daily Standup (5-min, all terminals)

**Cadence:** Every weekday morning. Each terminal posts in `docs/operations/weekly-status/<YYYY-WW>.md`:

```markdown
## YYYY-MM-DD Standup

### T1 Engineering
- Yesterday: <one-liner>
- Today: <one-liner>
- Blockers: <none / specific item>

### T2 Grants
- (same format)

### T3 Accelerators
- (same format)

### T4 Wefunder
- (same format)

### T5 Marketing
- (same format)

### T6 VC
- (same format)
```

When a terminal hits a blocker that requires Phyrom decision, the blocker line should be:
`Blocker: <specific decision needed> — Phyrom`

---

## Weekly Phase-0 Review (60 min, Phyrom-led)

**Cadence:** Every Monday. Phyrom reviews progress against Phase 0 exit gate criteria:

| Metric | Target | Current | On Track? |
|---|---|---|---|
| Beta pros active | 10+ | TBD | TBD |
| Jobs in pipeline | 30+ in 60 days | TBD | TBD |
| GMV captured | $24K+ in 60 days | TBD | TBD |
| Non-dilutive committed | $250K+ | TBD | TBD |
| Wefunder soft-commit | $100K+ | TBD | TBD |
| Tier-1 accelerator status | Accept / Reject / Pending | TBD | TBD |
| VC term sheets | 1+ | TBD | TBD |

**Phase 1 trigger:** Hit ANY ONE of (a) $250K+ non-dilutive committed, (b) $500K+ Wefunder+angel soft-circled, (c) Tier-1 accelerator acceptance.

When Phase 1 triggers, Phyrom opens a new spec + plan: `docs/superpowers/specs/<date>-phase-1-lean-launch-design.md`. Each terminal pivots from Phase 0 workstream to Phase 1 workstream per the new plan.

---

## Things NOT in this Handoff (Phyrom Personal Action Required)

These cannot be delegated to a terminal:

| Action | Owner | Deadline |
|---|---|---|
| Stripe Connect live setup for Sherpa Pros LLC | Phyrom | 48hr |
| Apple Developer account ($99/yr) | Phyrom | 48hr |
| MA foreign-LLC registration for Sherpa Pros LLC ($500) | Phyrom | Week 1 |
| SAM.gov + Research.gov registration | Phyrom | Week 1 (gates SBIR) |
| Surname decision (use one or strip everywhere) | Phyrom | Week 1 |
| Canonical email decision | Phyrom | Week 1 |
| Canonical domain decision | Phyrom | Week 1 |
| Mass Save 2026 rebate amount verification | Phyrom | Before any Mass Save mention publishes |
| Attorney engagement (1099 classification + SAFE review + Wefunder MFN side-letter question) | Phyrom | Week 4 |
| Founder video on NH jobsite (for Suffolk, Techstars, YC, Greentown apps) | Phyrom | Week 2-3 |
| Founder professional headshot (~$300 NH photographer) | Phyrom | Week 2-3 |
| HJD network beta pro asks (close 6-7 to commitment) | Phyrom | Weeks 1-3 |
| Schema migration 005 deploy to Neon production | Phyrom + T1 | Week 1 |
| Vercel env var add for live Stripe keys | Phyrom + T1 | Week 1 (after Stripe Connect approves) |

---

## Quick Reference — Where Everything Lives

```
sherpa-pros-platform/
├── docs/
│   ├── superpowers/
│   │   ├── specs/2026-04-22-gtm-marketing-design.md     ← source-of-truth GTM design
│   │   ├── plans/2026-04-22-phase-0-fundraise-and-beta.md ← 47-task implementation plan
│   │   └── handoff/2026-04-22-parallel-execution-prompts.md ← THIS FILE
│   ├── pitch/
│   │   ├── sherpa-pros-deck-v1.md                       ← 10-slide investor deck
│   │   ├── sherpa-pros-onepager-v1.md                   ← exec one-pager
│   │   ├── competitive-analysis.md                      ← competitive matrix
│   │   ├── tam-sam-som.md                               ← market sizing
│   │   ├── metrics-dashboard-design.md                  ← admin/investor-metrics design
│   │   └── brand-audit.md                               ← Brand Guardian P0/P1/P2 punch list
│   ├── marketing/
│   │   ├── linkedin-editorial.md                        ← 39-post 90-day calendar (T5)
│   │   ├── referral-mechanics-design.md                 ← 4 loops, fraud controls
│   │   └── email-sequences/                             ← 4 sequences (T5)
│   ├── fundraising/
│   │   ├── grants/                                      ← 6 drafts (T2)
│   │   ├── accelerators/                                ← 5 drafts (T3)
│   │   ├── vc/                                          ← 53-firm pipeline + outreach (T6)
│   │   ├── wefunder/                                    ← FAQ + page + PR plan (T4)
│   │   └── status/                                      ← submission tracking (created by terminals)
│   └── operations/
│       └── weekly-status/                               ← daily standups + weekly reviews
├── src/
│   ├── app/(dashboard)/admin/investor-metrics/         ← live dashboard (already shipped)
│   ├── app/(marketing)/                                 ← landing pages (already refreshed)
│   ├── db/migrations/005_phase_0_traction_telemetry.sql ← needs deploy to Neon
│   └── ...                                              ← T1 territory
└── .npmrc                                               ← legacy-peer-deps=true (DO NOT DELETE)
```

---

**Source plan + spec are immutable execution-time references.** Update them only when Phase 1 triggers or when Phyrom explicitly approves a spec amendment.
