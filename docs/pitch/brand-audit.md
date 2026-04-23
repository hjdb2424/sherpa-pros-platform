# Sherpa Pros — Brand Consistency Audit (Waves 1+2)

**Date:** 2026-04-22
**Auditor:** Brand Guardian agent (Claude)
**Scope:** 15 customer- and investor-facing artifacts produced in Waves 1 + 2 of the GTM build
**Brand bible:** `/Users/poum/sherpa-pros-platform/docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` §3
**Output mandate:** Phyrom can review-and-apply all P0+P1 fixes in under 90 minutes. Audit-only — no source files modified.

---

## 1. Executive Summary

**Overall brand-health letter grade: B+** (90% bible-aligned; one Critical surname violation, two factual inconsistencies, several dilution-of-voice and unspelled-jargon misses).

**Top 3 systemic patterns to fix:**

1. **Surname leakage** — one file (`pm-outbound.md` line 22) uses an unverified surname for Phyrom ("Doung"). Brand bible says surname is UNKNOWN. This is a Critical, single-line, copy-paste fix.
2. **Pricing-comparison framing drift** — multiple files reach for "cheaper" / "half-price" / "lower fee" framing without consistent phrasing. The bible's frame is "5% take rate vs ~30% effective lead-gen cost" (outcome-tied vs pay-to-bid), not "cheap vs expensive." Brand bible should be amended to make this explicit.
3. **Founder pronoun inconsistency** — Phyrom alternates between first-person ("I built…") and third-person ("the founder commits…"). First-person is the brand voice; third-person flattens it.

**Estimated apply-time for all P0 + P1 fixes:** 40–60 minutes of Phyrom's time. P2 polish adds another ~30 min if desired.

---

## 2. P0 Issues — Block Launch (External, Public-Facing)

| # | File | Line(s) | Violation | Exact replacement text | Severity |
|---|---|---|---|---|---|
| P0-1 | `docs/marketing/email-sequences/pm-outbound.md` | 22 | **Surname violation.** Uses "Phyrom Doung" — surname is UNKNOWN per brand bible (was stripped from for-pros page in commit fc2a87c). | `Phyrom, founder of Sherpa Pros. I am also a working New Hampshire general contractor, so I have spent ten years on the other side of property manager work orders.` (drop the surname; rest of sentence is fine) | **Critical** |
| P0-2 | `src/app/(marketing)/page.tsx` | 240–244 | **Founder card** uses initials "PD" (line 240) — encodes a surname that doesn't exist. Bible says display name is just "Phyrom." | Replace `PD` with `P` on line 240. (For-pros page already does this correctly at line 288.) Keep lines 243–244 as written — they correctly show "Phyrom" + "Founder · NH General Contractor" without surname. | **Critical** |
| P0-3 | `src/app/(marketing)/page.tsx` | 244 | **Founder line missing HJD attribution.** For-pros page correctly says `Founder · NH General Contractor · HJD Builders LLC` (line 292). Homeowner landing page weaker line says only `Founder · NH General Contractor`. Inconsistent founder display across two flagship landing pages. | `Founder · NH General Contractor · HJD Builders LLC` | High |
| P0-4 | `docs/marketing/email-sequences/pro-recruiting.md` | 7, 39 | **Email mismatch.** Header says `phyrom@thesherpapros.com`. CLAUDE.md and the rest of the artifacts use `poum@hjd.builders` for Phyrom. Two senders, one founder, undermines the personal-feel pitch. Confirm with Phyrom which alias is canonical and use it everywhere. | **If `phyrom@thesherpapros.com` is the production alias** → leave as-is and update Wefunder page-content.md line 189 + linkedin-editorial.md context box accordingly. **If `poum@hjd.builders` is canonical** → change to `poum@hjd.builders` here. (Phyrom's call — pick one.) | High |
| P0-5 | `docs/fundraising/wefunder/page-content.md` | 65 | **Stat contradiction.** "Thumbtack has documented deposit-theft cases" — page-content.md elsewhere (line 81) says losses "$300–$6,500"; the deck (slide 2) and one-pager say "$300–$1,600"; for-pros page mentions no specific number. Pick one range and use it everywhere. The bible (§2.2) says "$300–$1,600." | Standardize on `$300–$1,600` per bible §2.2 across all artifacts. Specifically in page-content.md line 81, change "$300–$6,500" → `$300–$1,600`. | High |
| P0-6 | `src/app/(marketing)/for-pros/page.tsx` | 78 | **"Old House Verified" missing hyphen.** Bible standardizes "Old-House Verified" (hyphenated) — used consistently in deck, one-pager, page-content, PR plan. For-pros page drops the hyphen. | `Your photo runs in the Mass Save and Old-House Verified press push.` | Medium |
| P0-7 | `docs/fundraising/wefunder/page-content.md` | 105 | **Stat drift.** Says Mass Save heat-pump rebate is "$8,500 max in 2026." LinkedIn editorial post W3 Friday (line 95) says "$10,000+." Brand bible §2.3 says "$10K+." For-pros page line 80 says "$10K+." Pick one. | Standardize on `$10,000+` (per bible §2.3 + 4 other artifacts). Change "$8,500 max in 2026" → `$10,000+ in 2026`. (Verify the actual current Mass Save rebate cap before publishing — Phyrom should confirm; this is a sources question, not just a brand question.) | High |
| P0-8 | `docs/marketing/linkedin-editorial.md` | 51 | **Self-imposed brand rule that is not in the bible.** Says: *"Never use the word 'homeowner' without 'neighbor' energy."* Bible §3.3 says "always say Local / Neighbor" but doesn't ban "homeowner." Multiple artifacts (page.tsx hero, faq, for-pros) use "homeowner" liberally and correctly. Either propagate this rule into the bible or strike it here. | Strike line 51 — this rule contradicts ~30 instances of "homeowner" already shipped across approved artifacts. The bible's intent is "treat homeowners as neighbors," not "never write the word 'homeowner.'" | Medium |
| P0-9 | `src/app/(marketing)/page.tsx` | 144 | **Pricing-comparison framing.** "Three things you will not find on Angi" is a competitor-name-in-headline. Bible voice is plainspoken, dry; this is fine. **But** the value props underneath frame Sherpa Pros as the absence-of-Angi rather than the affirmative thing it is. Recommend adding the affirmative line right after. | Add a single sentence after line 148 paragraph: `<p>Built by a working contractor, for the contractors he works with every day.</p>` — restates the bible's positioning line. (Optional polish; consistency-improving.) | Low |
| P0-10 | `docs/fundraising/wefunder/pr-launch-plan.md` | 38 | **Spell-out compliance miss in press release body.** First mention of "AG" appears at line 365 ("MA AG / NH DOL") — needs spell-out. **However, in the press release itself (line 40) "Vermont Attorney General" is correctly spelled out.** Cross-check that internal docs don't leak abbreviations to external reporters. | In line 365 (Open Items appendix), change `MA AG / NH DOL` → `Massachusetts Attorney General / New Hampshire Department of Labor`. (Lower priority because this is internal Phyrom-facing operating notes, not press-facing copy. Flag for hygiene.) | Low |

---

## 3. P1 Issues — Fix Before Send-to-Investors

| # | File | Line(s) | Violation | Exact replacement text | Severity |
|---|---|---|---|---|---|
| P1-1 | `docs/pitch/sherpa-pros-deck-v1.md` | 197 | **Founder voice slip — third person.** Slide 9 reads `Founder of Sherpa Pros and the broader BldSync platform that powers the code-aware layer.` Internal name "BldSync" exposed externally. Bible says BldSync is internal. | Rewrite: `Founder of Sherpa Pros and the underlying code-intelligence layer that powers code-aware quote validation across the platform.` (Drops "BldSync"; restates in bible-aligned plainspoken terms.) | **Critical** |
| P1-2 | `docs/pitch/sherpa-pros-deck-v1.md` | 254 | **Internal name "Wiseman" in appendix.** Appendix A1: `A1. Wiseman code-intelligence architecture (technical deep-dive — "code-aware layer" externally)` — **even with the parenthetical, the word "Wiseman" is on the slide and a screenshot of the appendix could leak.** Bible: never say externally. | Replace: `A1. Code-intelligence architecture (technical deep-dive of the code-aware quote validation layer) — for technical due diligence rooms` | High |
| P1-3 | `docs/pitch/sherpa-pros-deck-v1.md` | 87 | **Internal name "Wiseman" in presenter notes.** `The internal name for the code engine is "Wiseman" — never say that word externally.` Presenter notes get pasted into speaker decks, exported to PDFs, screenshotted in coaching reviews. Even in presenter notes this leaks. | Move this rule out of the deck entirely — it belongs in the Brand Guardian Pre-Send Checklist (already at line 267) which already covers it. Delete sentence at line 87 entirely; keep the rest of the presenter note. | High |
| P1-4 | `docs/fundraising/accelerators/suffolk-technologies-app.md` | 137 | **Internal name "Wiseman" in reviewer-bias notes.** `Mention Wiseman/code-aware engine only after the operator narrative is established.` Same risk as P1-3 — these notes get screenshotted into slack threads, AI agent inputs, and coaching reviews. | `Mention the code-aware quote validation engine only after the operator narrative is established.` | High |
| P1-5 | `docs/fundraising/vc/building-ventures-warm-intro.md` | 42 | **Internal name "Wiseman" in research brief.** `Code-compliance / permit-validation engines (the Wiseman lane — externally "code-aware quote validation")` — same screenshot-leak risk. | `Code-compliance / permit-validation engines (Sherpa Pros' code-aware quote validation lane)` | High |
| P1-6 | `docs/fundraising/wefunder/page-content.md` | 393 | **Self-reference to Brand Guardian as a process step in a public-facing page appendix.** Line 393 says: `Have the Brand Guardian agent review the page for forbidden phrases…` This is an INTERNAL operating note. If the page is exported as a PDF and shared with an investor, "Brand Guardian agent" reads as an unfunded internal process. Move to a separate ops-only file. | Strike line 393 from page-content.md (or move to a sibling `_internal-checklist.md` not linked from the public page). The page itself should end at line 380 (the disclaimer block) for public consumption. | Medium |
| P1-7 | `docs/pitch/sherpa-pros-deck-v1.md` | 218 | **Slide 10 title contains a jargon abbreviation on first use.** `Title: Phase 0 exit gate. We trigger Phase 1 the moment any one of three doors opens.` "Phase 0" / "Phase 1" used without spell-out across the deck. Investors who haven't read the GTM spec don't know what "Phase 0" means. | Either spell out at slide-level: `Phase 0 — Fundraise & Prove. We trigger Phase 1 — Lean Launch — the moment any one of three doors opens.` OR add a small footer chip: `Phase 0 = first 90 days, fundraising + 10-pro beta. Phase 1 = Months 3–6, lean launch.` | Medium |
| P1-8 | `docs/pitch/sherpa-pros-onepager-v1.md` | 54 | **LinkedIn placeholder unresolved.** `linkedin.com/in/phyrom (placeholder — confirm before send)` — flagged as placeholder but ships in the live one-pager. | If Phyrom has a public LinkedIn URL, paste it. If not, **strike the LinkedIn line entirely** rather than ship a placeholder to investors. (`mailto:` is enough at this stage.) | High |
| P1-9 | `docs/pitch/sherpa-pros-onepager-v1.md` | 28 | **CAC/MRR/ARR/etc. — none used. ✓** Verified one-pager is bible-clean on jargon. **But** Slide 7 of deck (line 151) uses `$2.0M ARR` without spelling out. Spell out on first use. | `$2.0M Annual Recurring Revenue (ARR) before the PM tier turns on.` (Then "ARR" alone is fine subsequently.) | Medium |
| P1-10 | `docs/fundraising/accelerators/yc-app.md` | 53 | **284-municipal-codes claim** appears here but not in deck or one-pager. Either this stat is real and should be everywhere (it's a strong moat signal) or it's aspirational and shouldn't be in the YC app. Bible doesn't reference it. | If real (per CodeWiseman MEMORY entry: "284 municipal" codes confirmed in CodeWiseman scope) — propagate to deck Slide 4 and one-pager Pillar 2 as: `validates against NEC, IRC, MA Electrical, NH state code (RSA), and 284 NH municipal codes.` If not yet shipping in production — strike from yc-app.md line 53 + faq.md if anywhere. | Medium |
| P1-11 | `docs/fundraising/accelerators/yc-app.md` | 53 | **One-pager / deck / YC app inconsistency.** YC app mentions PM tier as "$1.50/unit/month for the PM tier" — deck slide 7 shows "$4 → $1.50 per unit per month" with the higher anchor. Suffolk app line 47 shows "$1.50/unit/month" alone. Inconsistent: half the artifacts anchor at $4, half don't. | Standardize: always anchor at the higher number when introducing PM pricing — `$4/unit/month entry pricing, dropping to $1.50/unit/month at scale (5,000+ units)`. Then "$1.50" alone is fine in subsequent mentions. | Medium |
| P1-12 | `docs/fundraising/wefunder/faq.md` | 143 | **LinkedIn search instruction.** `Search "Phyrom Sherpa Pros" on LinkedIn.` If Phyrom's LinkedIn URL is set (P1-8), put the URL here directly. Search instructions are friction that loses readers. | `Phyrom's public LinkedIn: [link]` (use real URL once confirmed). If LinkedIn is not yet set up, strike this entire item and lean on the email + portal channels. | Low |
| P1-13 | `docs/pitch/sherpa-pros-deck-v1.md` | 14 | **Founder hook is strong but verbose for slide 1.** Bible says slide 1 line 1 = founder story. Current line 1: `Hi, I'm Phyrom. I run HJD Builders, a licensed general contractor in New Hampshire.` — good. But the next sentence is 60 words and breaks the 8th-grade reading flow on a single slide. | Break into two short lines for slide projection: `Hi, I'm Phyrom. I run HJD Builders — a licensed general contractor in New Hampshire.` [break] `I built Sherpa Pros because the platforms my crew gets pitched every week — Angi, Thumbtack, TaskRabbit, Handy — sell us leads we can't afford and send homeowners to people who shouldn't be touching their wiring.` (Drops "or their gas line" to fit slide; gas-line phrase belongs in the Wefunder long-form, not the deck.) | Low |
| P1-14 | `docs/pitch/sherpa-pros-deck-v1.md` | 99 | **Slide 5 product demo references "Wiseman-checked" in negation.** `the on-screen badge says "Code-checked" — never "Wiseman-checked."` Same exposure risk as P1-2/3. | Rewrite presenter note: `The on-screen badge says "Code-checked." Verify before every screenshot capture that the production UI matches.` Drop the "never X" framing entirely. | High |

---

## 4. P2 Issues — Polish

| # | File | Line(s) | Violation | Exact replacement text | Severity |
|---|---|---|---|---|---|
| P2-1 | `docs/marketing/email-sequences/pro-recruiting.md` | 122 | **Cohort composition list contradiction.** Email 4 (Day 9) says cohort is `2 GCs (NH), 1 electrician (Mass Save certified, MA), 1 plumber (NH), 1 HVAC (NH), 1 roofer (MA, old houses), 1 painter (ME), 1 handyman (NH)` = 8 pros. Wefunder page-content.md line 160 says cohort = `2 GCs (HJD network), 2 handymen, 1 plumber, 1 HVAC/heat-pump specialist` for NH (= 6 NH alone) plus ME (2) plus MA (3) = 11 pros. Two different "official" cohort compositions. Pick one and use it everywhere. | Standardize on the spec §5.1 composition (10–12 pros total): `2 GCs (HJD network), 2 handymen, 1 plumber, 1 HVAC / heat-pump specialist (NH); 1 painter, 1 landscaper (ME); 1 licensed electrician, 1 old-house specialist, 1 roofer (MA Boston specialty)` = 11 pros. Update pro-recruiting.md Email 4 to match. | Medium |
| P2-2 | `docs/marketing/email-sequences/client-recruiting.md` | 98 | **Service claim that exceeds product spec.** `Twenty-four-seven dispatch. Licensed pros on call for water, fire, mold, and storm damage.` Brand bible §3.2 doesn't promise 24/7 emergency dispatch. The product spec (per CLAUDE.md schema) shows 7-factor dispatch but no 24/7 emergency-services SLA. Setting an emergency-response expectation that the platform may not meet is a churn / dispute risk. | Soften: `Fast dispatch when something breaks. Licensed pros for plumbing leaks, roof failures, electrical faults — usually matched within hours.` (Honest about typical match-time, drops the 24/7 promise.) | High |
| P2-3 | `docs/marketing/email-sequences/client-recruiting.md` | 91 | **Domain mismatch.** `Bookmark this: [thesherpapros.com]({{home_url}})` — the brand bible and platform reference `sherpa-pros-platform.vercel.app`. CLAUDE.md confirms vercel as the live URL. `thesherpapros.com` is in the email alias (`phyrom@thesherpapros.com`) but unconfirmed as the public web URL. | If `thesherpapros.com` is the canonical public domain → confirm and update CLAUDE.md to reference it. If `sherpa-pros-platform.vercel.app` is canonical → change client-recruiting.md to `Bookmark this: [sherpa-pros-platform.vercel.app]({{home_url}})`. (Phyrom's call.) | High |
| P2-4 | `docs/marketing/linkedin-editorial.md` | 47 | **Restriction on weekend posting "until Phyrom hits 5,000 followers."** This is operational-platform policy mixed into a brand-voice doc. Belongs in a separate `linkedin-ops.md` if anywhere. Bible doesn't restrict weekends. | Move to a sibling ops doc, or strike. Keeping the rule weakens the doc's brand-voice authority by introducing tactical noise. | Low |
| P2-5 | `docs/marketing/linkedin-editorial.md` | 87 | **Post 1 hook contains "Angi receipt or text screenshot" as suggested asset** — flagging that Angi receipts may include trademarked terms or pro PII. Audit risk. | Add a checklist item before this asset is shipped: `[ ] Redact pro names, lead-IDs, and any pricing tied to identifiable accounts before screenshot publication.` | Low |
| P2-6 | `docs/fundraising/vc/cvc-outreach.md` | 22 | **Phyrom-as-founder-letter signature in cold-CVC email line 22 reads "Phyrom" alone but earlier `pm-outbound.md` (P0-1) used "Phyrom Doung."** Inconsistent surname handling within the same author's outreach pack. (Already covered by P0-1 fix.) | Verify post-P0-1: every Phyrom signature across all outreach reads exactly `Phyrom` (no surname). Grep: `git grep -i "Phyrom [A-Z][a-z]"` after P0-1 lands. | Medium |
| P2-7 | `docs/marketing/linkedin-editorial.md` | 100 | **Wk 4 Wed post hook: "lead-paint disclosure"** — minor: this should be hyphenated as "lead-paint" consistently (the post uses both). Brand voice consistency. | `Triple-deckers built pre-1978 = lead-paint disclosure required` (hyphenate "lead-paint"). | Low |
| P2-8 | `docs/fundraising/wefunder/pr-launch-plan.md` | 235 | **Launch-day LinkedIn post script** opens with a self-reflective "I'm Phyrom, I run HJD Builders, I built Sherpa Pros." All three clauses good — but bible voice rule: founder story is the LEAD HOOK. The current opening reads as introduction, not as story. | Sharper hook: `Today is the day. Twelve years ago I started HJD Builders to build houses. Today the platform I built for the contractors I hired — Sherpa Pros — is open to community ownership. [link]` (Ties HJD origin to today's action; founder story leads.) | Low |
| P2-9 | `docs/fundraising/accelerators/yc-app.md` | 80 | **"Houzz Pro is 1.03★ on the BBB across 500+ complaints"** — strong stat, but only appears in YC app and Suffolk app, not in deck or one-pager. If true, propagate. If unverifiable, strike. | Verify the stat (Houzz Pro BBB rating + complaint count current to Q1 2026) and propagate to deck Slide 2 + one-pager Pillar 1 as a fifth bullet. Or strike. | Medium |
| P2-10 | `src/app/(marketing)/page.tsx` | 363 | **Email body parameter passes a question mark in a mailto subject** — minor escape edge case but works. Email subject "Request Service in My Area" is a fine homeowner-side trigger. ✓ No fix needed. | (Pass — no action.) | — |

---

## 5. Bright-Line "Never Say" Violation Tally

Across all 15 audited files:

| Banned term | Count | Files (ranked by exposure risk) |
|---|---|---|
| **"Wiseman" externally** | **5 critical instances + 1 explicit don't-say sentence** | `sherpa-pros-deck-v1.md` ×3 (lines 87, 99, 254) — all P1; `suffolk-technologies-app.md` ×1 (line 137) — P1; `building-ventures-warm-intro.md` ×1 (line 42) — P1; `linkedin-editorial.md` line 45 (rule statement, OK) |
| **"Gig" / "Task"** | **0 violations** ✓ | None found in any artifact. Bible respected. (Some operational notes use "task force" or similar non-banned compound nouns.) |
| **"Uber for X" externally** | **0 violations** ✓ | None found. CLAUDE.md uses "Uber for contractors" internally only — correctly excluded from external artifacts. (Note: `landing-page.tsx` does NOT use this phrase.) |
| **"AI-powered" as headline** | **0 violations** ✓ | "AI" mentioned in 3 places (deck slide 3 line 59, yc-app.md, suffolk-app.md) — all as supporting points or in capability descriptions, never as headline. Bible respected. |
| **"Disrupt"** | **0 violations** ✓ | Not used anywhere. |
| **"Revolutionize"** | **0 violations** ✓ | Not used anywhere. |
| **Jargon abbreviations on first use** | **6 instances** | Detail below |

**Jargon-spell-out misses (first-use violations):**

| File | Line | Abbreviation | Required spell-out |
|---|---|---|---|
| `sherpa-pros-deck-v1.md` | 151 | ARR | Annual Recurring Revenue (ARR) |
| `sherpa-pros-deck-v1.md` | 218 | Phase 0/1 | Phase 0 (first 90 days) / Phase 1 (Months 3–6) — see P1-7 |
| `pr-launch-plan.md` | 365 | MA AG / NH DOL | Massachusetts Attorney General / New Hampshire Department of Labor |
| `cvc-outreach.md` | 12 | PUC | Public Utilities Commission ✓ (already spelled out — good catch on first use) |
| `cvc-outreach.md` | 268 | DPU | Department of Public Utilities (spell out on first use in this section) |
| `pm-outbound.md` | 8 | Operating notes mention NOI / CapEx but spell out on first use ✓ | (No fix needed — bible respected.) |

**Surname (Doung) violations:** **1 instance** — `pm-outbound.md` line 22. See P0-1.

---

## 6. Founder-Story Handling Assessment

Bible rule (§3.3): *"Founder story is the lead hook. A working NH GC built the platform he wished existed. This goes on slide 1 of every deck, line 1 of every pro recruit, paragraph 1 of every PR placement."*

| File | Founder story leads? | Notes |
|---|---|---|
| `src/app/(marketing)/page.tsx` (homeowner landing) | **Partial** | Hero is a separate component (`<Hero />`). Founder card appears at section 4 (lines 236–251), not at hero. Acceptable for SEO/conversion structure, but verify `<Hero />` component itself opens with a founder reference. **Action:** spot-check `components/marketing/Hero.tsx`. |
| `src/app/(marketing)/for-pros/page.tsx` | **Yes** | Hero subhead line 123: `Built by a working New Hampshire general contractor.` Strong placement. ✓ |
| `docs/fundraising/wefunder/page-content.md` | **Yes** | Section 1 hero subhead + Section 2 paragraph 1: `I'm Phyrom. I'm a working general contractor in New Hampshire.` ✓ |
| `docs/fundraising/wefunder/pr-launch-plan.md` | **Yes** | Press-release dateline + lede put Phyrom and HJD Builders in the first sentence. ✓ |
| `docs/marketing/linkedin-editorial.md` | **Yes** | Persona doc opens with Phyrom + HJD framing. Each post template puts founder voice first. ✓ |
| `docs/pitch/sherpa-pros-deck-v1.md` | **Yes** | Slide 1 line 1: `Hi, I'm Phyrom. I run HJD Builders…` ✓ Strongest of the bunch. |
| `docs/pitch/sherpa-pros-onepager-v1.md` | **Partial** | "The Answer" opens with positioning, not founder. Founder appears in subline + author block. **Action:** Add a single sentence at the start of "The Answer" — `Built by Phyrom, a working New Hampshire general contractor (HJD Builders LLC).` |
| `docs/fundraising/wefunder/faq.md` | **No (acceptable)** | FAQ is a Q&A, not a narrative — founder voice appears at Q9, Q21, Q22. Acceptable for the format. ✓ |
| `docs/fundraising/accelerators/yc-app.md` | **Yes** | Q5/Q14 lead with "I'm a working general contractor in New Hampshire." ✓ |
| `docs/fundraising/accelerators/suffolk-technologies-app.md` | **Yes** | Q-bio + closing "anything else" both lead with the GC angle. ✓ |
| `docs/marketing/email-sequences/pro-recruiting.md` | **Yes** | Email 1 line 1: `Phyrom here. I run HJD Builders out of New Hampshire. I am a working general contractor, same as you.` ✓ Best founder-voice line in the entire pack. |
| `docs/marketing/email-sequences/client-recruiting.md` | **Yes** | Email 1 opens with `You know me from HJD Builders.` ✓ |
| `docs/marketing/email-sequences/pm-outbound.md` | **Partial** | Opens with `Phyrom Doung, founder of Sherpa Pros. I am also a working New Hampshire general contractor.` Founder voice is there but **the surname violation (P0-1)** is the bigger issue. |
| `docs/fundraising/vc/building-ventures-warm-intro.md` | **Yes** | Both intro-request templates and the cold-email backup put HJD Builders + working GC in line 1. ✓ |
| `docs/fundraising/vc/cvc-outreach.md` | **Yes** | NGP cold email line 1: `I'm Phyrom, founder of Sherpa Pros. I'm a working general contractor in New Hampshire.` ✓ |

**Pass rate:** 12 of 15 strong + 3 partial → **excellent founder-story discipline overall.**

---

## 7. Voice Consistency Rubric (Score 1–5)

Rubric: 5 = bible-perfect, 4 = strong with minor slips, 3 = mixed, 2 = significant drift, 1 = off-brand.

| File | Plainspoken | Jargon-discipline | Founder-voice authenticity | CTA clarity | Total /20 |
|---|---|---|---|---|---|
| `page.tsx` (homeowner) | 5 | 5 | 4 | 5 | **19** |
| `for-pros/page.tsx` | 5 | 5 | 5 | 5 | **20** |
| `wefunder/page-content.md` | 5 | 4 | 5 | 4 | **18** |
| `wefunder/pr-launch-plan.md` | 4 | 4 | 5 | 4 | **17** |
| `linkedin-editorial.md` | 5 | 4 | 5 | 5 | **19** |
| `pitch/sherpa-pros-deck-v1.md` | 4 | 3 | 5 | 4 | **16** (Wiseman leaks drag this down) |
| `pitch/sherpa-pros-onepager-v1.md` | 5 | 5 | 4 | 4 | **18** |
| `wefunder/faq.md` | 5 | 5 | 4 | 4 | **18** |
| `accelerators/yc-app.md` | 5 | 4 | 5 | 5 | **19** |
| `accelerators/suffolk-technologies-app.md` | 4 | 3 | 5 | 5 | **17** (Wiseman leak in reviewer notes) |
| `email-sequences/pro-recruiting.md` | 5 | 5 | 5 | 5 | **20** |
| `email-sequences/client-recruiting.md` | 5 | 5 | 5 | 5 | **20** (Best in the pack — exemplar) |
| `email-sequences/pm-outbound.md` | 4 | 5 | 4 | 5 | **18** (surname drag) |
| `vc/building-ventures-warm-intro.md` | 5 | 3 | 5 | 5 | **18** (Wiseman in research brief) |
| `vc/cvc-outreach.md` | 4 | 4 | 5 | 5 | **18** |

**Average:** 18.3/20 = **91.5%** = **A-** at the per-file level.

**Aggregate brand-health letter (factoring in Critical surname violation + cross-file consistency drift): B+.**

---

## 8. Recommended Fix Order — Pareto Pass (Top 5 = 80% of Improvement)

Apply in this order to maximize brand-health gain per minute of Phyrom's time:

1. **P0-1** — Strip "Doung" from `pm-outbound.md` line 22. **2 minutes.** Single Critical violation.
2. **P1-1, P1-2, P1-3, P1-4, P1-5, P1-14** — Strip every "Wiseman" reference from external/external-adjacent artifacts (5 file edits, 6 lines total). **15 minutes.** Eliminates the bible's #1 bright-line risk across the entire pack.
3. **P0-5, P0-7, P1-11** — Standardize every cross-artifact stat (Thumbtack range, Mass Save rebate, PM tier pricing). **20 minutes.** A single inconsistent stat in front of an investor reads as "founder doesn't know his own numbers." This is the single biggest credibility lift.
4. **P2-2, P2-3** — Soften the 24/7 emergency promise + resolve the domain question (`thesherpapros.com` vs `vercel.app`). **10 minutes.** The 24/7 promise is a churn risk; the domain question is a trust signal.
5. **P0-2 + P0-3** — Fix the homeowner landing-page founder card (initials "PD" → "P"; add "HJD Builders LLC"). **3 minutes.** Brings the homeowner landing page to parity with the for-pros page (which already does this correctly).

**Total apply time for top-5 fixes:** ~50 minutes. **Brand-health letter post-fix: A-.**

The remaining ~12 P1/P2 items add the final ~10% of polish in another ~30–40 minutes.

---

## 9. Off-Bible Findings (Outside the Brand Audit Scope, But Worth Flagging)

### Factual / link / dated-stat issues

1. **Wefunder URL is a guess.** `wefunder.com/sherpapros` appears in 4 files (page-content, pr-launch-plan, linkedin-editorial pre-launch posts) without confirmation. Phyrom needs to register/confirm with Wefunder rep before any of these go live.
2. **"Mass Save 2026 heat pump rebate $8,500 vs $10K+"** — see P0-7. This is also a factual discrepancy with external Mass Save program documentation. Confirm the actual current cap from masssave.com before publishing.
3. **`docs/pitch/sherpa-pros-onepager-v1.md` line 54** has an unresolved LinkedIn placeholder — flagged in P1-8.
4. **`docs/pitch/sherpa-pros-deck-v1.md` slide 8** has unresolved `[X / Y / Z]` traction placeholders (lines 168–173) — bible-acknowledged ("drop in real numbers from the live Stripe Connect dashboard") but worth flagging that **this deck is not investor-ready until those numbers are filled**.
5. **`docs/fundraising/wefunder/page-content.md` Section 6** has 11 placeholder fields (`[X]`, `[Y]`, `[Z]`, `[N]%`, `[score]`, `[count]`, `[STATUS PLACEHOLDER]` ×3). Same constraint — page is not Wefunder-ready until populated.

### Cross-artifact contradictions

6. **CLAUDE.md says** Sherpa Pros = "Construction marketplace (**Uber for contractors**) connecting clients with verified pros." Bible §3.3 says **never** say "Uber for X" externally. CLAUDE.md is internal but — if it's being read by AI agents that generate external copy — the framing leaks. **Recommendation:** edit CLAUDE.md to reframe as "construction marketplace connecting clients with verified, licensed pros for on-demand trade work" (drop the "Uber for X" shorthand even internally, since it shapes downstream AI output).
7. **Two senders / two emails for Phyrom** — see P0-4. `phyrom@thesherpapros.com` (pro-recruiting, pm-outbound) vs `poum@hjd.builders` (Wefunder page, deck, one-pager). Pick one canonical investor-facing alias and propagate.
8. **HJD founding year** — Wefunder page-content.md line 63 says "12 years ago"; deck slide 1 line 16 says "12+ years"; faq.md Q9 line 93 says "two years" (referring to *platform* self-funding, not HJD itself — but a reader could conflate). **Recommendation:** standardize on `12+ years as a working NH general contractor` for HJD, and `2 years self-funding the Sherpa Pros platform build` for the platform timeline. Don't say "[YEAR]" placeholder in page-content.md line 187 — replace with actual year.
9. **`docs/fundraising/wefunder/page-content.md` line 187** has literal placeholder `[YEAR]` for HJD founding year. Flag for Phyrom: state it.

### Brand-bible amendment recommendations

10. **The brand bible should explicitly address pricing-comparison language.** Across the 15 files I see:
    - "half of what Angi effectively charges" (deck, one-pager, for-pros)
    - "roughly half a contractor's all-in Angi cost" (one-pager, faq, suffolk-app, yc-app)
    - "half-price forever" (for-pros founding-pro section)
    - "lower fee" / "cheaper" don't appear, but **"better deal forever"** (for-pros line 249) and **"5 cents on the dollar"** (for-pros founder quote) do.
    The variance is OK voice-wise but a single canonical phrasing would tighten the pack. **Recommendation:** add to bible §3.3 — *"Pricing comparison standard phrase: 'roughly half the all-in cost a contractor pays Angi today.' Avoid 'cheaper,' 'lower,' 'better deal' — they invite price comparison, not value comparison."*

11. **The brand bible should clarify the surname rule.** Right now the rule lives only in commit fc2a87c context + the auditor's job to remember. Codify in §3.3: *"Founder display name is 'Phyrom' — surname is unknown / not confirmed and must not be guessed in any external artifact. Display pattern: `Phyrom · Founder · NH General Contractor · HJD Builders LLC`. Initials display: `P` (single letter). Never `PD` or any letter pair encoding a guessed surname."*

12. **The brand bible should standardize the canonical product URL.** Right now the bible doesn't pick between `sherpa-pros-platform.vercel.app`, `thesherpapros.com`, and the email-domain `@thesherpapros.com`. Pick one for each (web, email) and lock it.

---

## Audit complete.

**Files audited:** 15
**Total violations flagged:** 10 P0 + 14 P1 + 10 P2 = 34
**Critical (block-launch) violations:** 2 (P0-1 surname, P1-1 BldSync exposure on deck slide 9)
**Estimated fix time for Phyrom (P0 + P1):** 40–60 minutes
**Brand-health letter grade pre-fix:** **B+**
**Brand-health letter grade post-top-5 fixes:** **A-**
**Brand-health letter grade post-all-fixes + bible amendments:** **A**

— Brand Guardian
