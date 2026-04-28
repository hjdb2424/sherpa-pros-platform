# Investor Day 1: What a Phase 0 / Series A Investor Actually Wants on First Visit

**Audience:** Sherpa Pros orchestrator deciding what `thesherpapros.com/dataroom` should expose by default to a newly-granted investor (Clerk `publicMetadata.dataroom: true`).
**Question:** A Tier-1 construction-tech VC (MetaProp, Brick & Mortar Ventures, Building Ventures, Suffolk Technologies) has clicked the access link for the first time. What do they expect to see? What turns them off?
**Date:** 2026-04-26
**Phase:** Phase 0 — pre-seed Wefunder + 10-pro beta cohort, Series A target close M12.

---

## 1. What investors want on Day 1 — the "first meeting" data set

Day 1 is **not** diligence. It is a **screening pass**. A partner spends 5–15 minutes deciding whether to take a second meeting. They are answering three questions: (a) is this market real and large enough? (b) is this team able to execute? (c) is there enough early signal to keep the conversation going?

The standard Day 1 set, consistent across the YC Series A guide, NextDealAdvisor's "Investor Data Room Checklist," and Carta's data-room template, is roughly:

1. **Pitch deck (current version)** — single most-clicked file, every time. 12–25 slides. Should stand alone without a narrator.
2. **One-page executive summary** — the partner forwards this to the rest of the firm before the second meeting.
3. **Market sizing (TAM / SAM / SOM)** — bottoms-up, with sources.
4. **Competitive landscape** — a matrix, not a paragraph. Where do you win, where do you lose, why is the market under-served.
5. **Traction snapshot** — even at pre-seed: pilots, LOIs, waitlist, beta sign-ups, paying customers. Numbers, not adjectives.
6. **Founder bio + why-this-team** — for a single-founder company like Sherpa Pros (Phyrom), this is load-bearing. Domain credibility matters disproportionately in construction tech.
7. **Brand / product feel** — investors at this stage are also evaluating *taste*. A polished brand identity signals product judgment. (Building Ventures explicitly screens for design quality in early-stage construction-tech.)

That is roughly **5–8 documents**, not 50.

---

## 2. What investors expect *later* — diligence after they're interested

Once the firm is past the screen and into the "we're considering an investment" stage, the document set expands toward what Carta and NextDealAdvisor call **light commercial diligence**:

- Detailed financial model + 3-year forecast + unit economics (CAC / LTV / contribution margin per Hub).
- Cap table + previous round terms + SAFE notes outstanding.
- Customer pipeline detail (named accounts, stage, ACV).
- Technology / product roadmap with quarterly milestones.
- Strategic specs that show the company has thought beyond the current round (Series-A-funded company should have a credible Series-B story; Sherpa Pros' Phase 4 specs serve exactly this purpose).
- Hiring plan + key roles needed post-round.
- Regulatory / licensing posture (critical for construction tech — see §4).
- Letters of intent from distribution partners, channel partners, design partners.

Reasonable sources for this sequencing: YC's *Series A Guide* (ycombinator.com/library), Carta's *VC Data Room Template*, NextDealAdvisor's *Pre-Seed Data Room Checklist*, and the Brick & Mortar Ventures publicly-discussed diligence cadence on the *Built Worlds* podcast.

---

## 3. What investors *never* want to see in a first-look data room

This is where most founder-built data rooms fail. The current Sherpa Pros index (168+ documents across 11 sections) trips every one of these:

- **Engineering specs, RFPs, ADRs, Citus-vs-pgpartman trade-off memos** — these signal "we're confused about what stage we're at." A Series A investor reading a multi-region database partitioning ADR before they've seen a pitch deck will close the tab.
- **Internal runbooks, drift audits, migration plans, build pipelines** — this is operating telemetry, not investor material.
- **TODO files, parallel-execution handoffs, terminal scripts** — these are *internal team artifacts*. Surfacing them screams "we have not curated this for you."
- **Phase-4 deep dives presented as Phase-0 priorities** — sequencing matters. International expansion specs in a pre-seed deck feel like over-reaching.
- **Drift / audit / debt documents** — even when the audit is good news (showing rigor), labeling something "drift" or "audit" in a public investor view reads as risk surface.
- **Multiple versions of the same document** — "deck v1" *and* "deck v2" both linked, with no signal which is current. Always show one current version; archive the rest.

The rule, per the YC partner advice cited in *The Ultimate VC Data Room Guide* (2024), is: **a Day 1 data room should look like a curated PowerPoint binder, not a GitHub tree.**

---

## 4. Construction-tech-specific items investors expect

Construction-tech VCs (Brick & Mortar, Building Ventures, MetaProp, Suffolk Tech, Greentown) ask for category-specific items that generic-SaaS investors don't:

- **Licensing / regulatory posture** — for a marketplace touching trades, who is the contractor of record? Are pros independent contractors or W-2? How is each state's licensing handled? This is the single most common diligence blocker.
- **Insurance + liability framework** — GL coverage, additional insured language, claims handling. Sherpa Pros has a strong artifact here; surface it for diligence (not Day 1).
- **Codes / standards engine evidence** — for a marketplace claiming a software moat, "Sherpa Materials engine" needs a credible technical narrative. One pager + screenshots > full spec.
- **Distributor / supply-house partnership LOIs** — FW Webb, regional distributors. These are the *unlock* for construction-tech marketplaces and investors know it.
- **Hub / physical-footprint plan** — most software VCs are wary of physical assets; Building Ventures and Suffolk are *not*, but they want to see Hub unit economics. Hub #1 milestone calendar belongs in diligence, not Day 1.
- **GC / founder field credibility** — investors will ask "has the founder run a job?" Phyrom's HJD Builders track record is the strongest single asset; foreground it in the founder bio.

---

## 5. Format expectations

Investors read pitch decks in **PDF or slide format**, not in a navigation tree of HTML pages. The Day 1 view should:

- Lead with **pitch deck v2** as the largest, most-prominent card.
- Offer **PDF + PPTX** for every deck (PDF is the default; PPTX is the "save me a copy" option).
- Hide HTML-only documents from Day 1 unless they are explicitly designed as one-pagers (e.g. one-page executive summary HTML is fine; a 30-page strategic spec HTML is not).
- Use a **clean section grid with ≤ 8 cards**, not 11 sections × 6 cards = 66 entry points.
- Avoid internal jargon: no "Wave 11," no "drift audit," no "execution kit," no "superpowers/specs." Investor-facing labels only.

The North Star: a partner should be able to read the entire Day 1 view in **under 30 minutes** and walk into the next meeting with a clear story.
