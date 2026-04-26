---
title: FW Webb × Sherpa Pros Partnership — FAQ
date: 2026-04-25
status: draft
owner: Phyrom (Founder, Sherpa Pros LLC)
audience: FW Webb leadership, FW Webb branch managers, internal Sherpa Pros team
references:
  - /Users/poum/sherpa-pros-platform/docs/operations/fw-webb-partnership/02-intro-pitch-deck.md
  - /Users/poum/sherpa-pros-platform/docs/operations/fw-webb-partnership/03-pilot-loi-template.md
  - /Users/poum/sherpa-pros-platform/docs/operations/fw-webb-partnership/04-fw-webb-economic-model.md
---

# FW Webb × Sherpa Pros Partnership — FAQ

## Strategic / Why-FW-Webb

### Q1. Why FW Webb specifically?

FW Webb is the **dominant trade-supply distributor in New England** with ~100 branches concentrated in NH, MA, ME, RI, VT, CT — the exact geography where Sherpa Pros is launching. FW Webb already brings the trade pro to its branches every morning. Sherpa Pros captures the workflow + dispatch side those same pros need. The two stacks compose without overlap. FW Webb is also a privately-held, founder-friendly culture — meaningfully easier to do a 12-month pilot with than a publicly-traded distributor that has quarterly-EPS pressure.

### Q2. Why a co-located Hub instead of a digital-only partnership?

Pros are physical-world workers. The morning ritual is **walk into the supply house at 6:30 a.m.**, not "open an app." Putting the Sherpa Hub 30 ft from the FW Webb counter means the Sherpa workflow attaches to the existing pro habit at zero adoption friction. Digital-only would require us to acquire pros from scratch and would deny FW Webb the foot-traffic + retention upside.

### Q3. Why 5 pilot Hubs and not 1 or 50?

One Hub is too small to validate the model — too many idiosyncratic-branch effects. Fifty Hubs is too much capital risk for an unproven format. Five Hubs gives statistically defensible per-branch evidence across 3 NE states with 4 distinct trade mixes (urban + suburban + dense-MA + ME-style spread).

### Q4. How does Sherpa Pros compete with FW Webb's pro counter?

It doesn't. FW Webb's pro counter is the **fulfillment layer for the materials**. Sherpa Pros' Hub is the **workflow layer for the pro's day** — dispatch, scheduling, payments, training, lounge, materials *staging* (not selling). Sherpa Pros sources the materials *through* FW Webb (preferred-vendor in pilot regions). The pro experience is "I went to FW Webb and got my whole morning sorted," not "I picked between FW Webb and Sherpa."

## Operational / Branch-impact

### Q5. What happens if a pilot Hub underperforms?

Three scenarios per LOI §9.3:

1. **Below 50% of gates** — joint review at QBR, root-cause analysis, corrective action plan
2. **50-70% of gates** — same as above + extension option for 6 months at revised gates
3. **Above 70%, below 100%** — meet/almost-meet path; expand selectively (some Hubs replicated, some held)
4. **Below 50% in two consecutive QBRs** — pilot wind-down for the underperforming Hub specifically (not the whole partnership) per LOI §10

Each individual Pilot Branch can be wound down without unwinding the whole partnership.

### Q6. Who hires and manages the Hub Manager?

Sherpa Pros — fully. The Hub Manager is a Sherpa Pros W-2 employee. They report into Sherpa Pros Regional Ops. FW Webb has zero HR / payroll / compliance / liability exposure on Sherpa Pros staff. The Hub Manager and FW Webb branch manager will coordinate on day-to-day branch operations (loading dock, materials staging) but are independent organizations.

### Q7. How does this affect existing FW Webb branch staff?

Modest **positive** impact:

- Branch staff bandwidth gets a small assist on bagging / counter staging via Sherpa Materials staging workflows
- Branch staff have a new resource (Hub Manager next door) for tough customer escalations
- Counter sales lift (+15%) creates more activity but also more revenue-sharing opportunity
- Modeled at $8K incremental staff cost per branch (covered by net incremental EBITDA of $165-210K)

A handful of high-performing FW Webb branch staff may be Sherpa Hub Manager candidates over time — this is a recruiting opportunity, not a threat.

### Q8. Does the Hub take parking spaces?

Hub uses ~5 dedicated parking spots for member-priority parking + 1 loading dock slot for Uber Direct staging. Each Pilot Branch will be evaluated in the Branch Site Schedule (LOI Exhibit B) for parking adequacy.

### Q9. What about insurance + liability for members on the FW Webb premises?

Sherpa Pros carries commercial general liability with FW Webb named additional insured ($2M per occurrence / $4M aggregate minimum per LOI §5). All Sherpa Pros members go through onboarding that includes a premises-liability waiver covering both the Sherpa Hub footprint and FW Webb branch.

### Q10. How are after-hours member visits managed?

Pilot Hubs offer 24/7 member access via QR scan to the Hub footprint. Member access does not include the FW Webb branch interior outside FW Webb branch hours. The Sherpa Hub footprint is physically separated by an interior wall + secured door + cameras. Members who need supplies after hours can grab from buffer-stocked Sherpa Hub inventory only.

## Data / Tech

### Q11. How is data shared between Sherpa Pros and FW Webb?

Per LOI §6.3 + §11.4:

- FW Webb gives Sherpa Pros: monthly aggregate Pilot-Branch sales data attributable to Sherpa Materials orchestration (no individual customer detail)
- Sherpa Pros gives FW Webb: monthly aggregate Hub member count, Materials throughput metrics, NPS scores
- Per-pro identifiable cross-data (e.g. "this specific pro is both an FW Webb account and a Sherpa member") requires the pro's prior written consent
- The FW Webb partner counterpart sees a **scoped, redacted slice** of the network-wide Hub Ops dashboard (per dashboard spec §7)

### Q12. What about FW Webb's existing pro-account data — does Sherpa Pros get it?

No. FW Webb's pro-account customer data is FW Webb's exclusive property (LOI §11.3). Sherpa Pros has no access to FW Webb pro-account names, contact info, or purchase history beyond aggregate Pilot-Branch reporting. Co-marketing campaigns to FW Webb pros must be initiated by FW Webb (Sherpa-Pros-funded co-mailers go through FW Webb's CRM).

### Q13. Where does the Sherpa Materials engine live? Does FW Webb need to integrate with it?

The Sherpa Materials engine (internally `Wiseman Materials engine`, externally always `Sherpa Materials`) is hosted by Sherpa Pros. FW Webb integrates via:

- **Phase 1 (manual)**: weekly inventory levels emailed by Sherpa Hub Manager to FW Webb branch
- **Phase 2 (semi-automated)**: EDI 850 / 855 / 856 for replenishment POs, advance ship notices
- **Phase 3 (real-time)**: FW Webb wholesale-order API integration for live inventory + pricing (target Pilot Month 9)

FW Webb investment in Phase 3 is optional — Phases 1+2 cover the pilot.

## Competitive / Strategic

### Q14. What if a competing marketplace (HomeAdvisor, Angi, Thumbtack, Amazon Business Trade) approaches FW Webb during the pilot?

Per LOI §7.1, FW Webb is **exclusive to Sherpa Pros for trade-pro marketplace co-locations** during the Pilot Term within 25 miles of any Pilot Branch. FW Webb retains freedom to do all other partnerships (training providers, fleet services, financing partners, single-trade specialty distributors, etc.). The exclusivity is narrowly scoped to the trade-marketplace lane that Sherpa Pros occupies.

### Q15. What if Sherpa Pros wants to expand to a market where FW Webb has no branch?

Per LOI §9.2, FW Webb has a 30-day right of first refusal to host any new Hub Sherpa Pros opens. If FW Webb declines or has no branch in the market, Sherpa Pros is free to pursue a standalone Hub or alternate-host partnership.

## Future / Scale

### Q16. Post-pilot, how does this scale?

The post-pilot path is laid out in LOI §9.1:

- **Year 2** (post-pilot): 25 co-located Hubs across NE
- **Year 3-4**: 50+ co-located Hubs across full FW Webb footprint (all 100 branches assessed)
- **Year 5+**: Expansion to non-FW-Webb markets via standalone Hubs + franchise model (separate spec — `franchise-model-design.md`)

Year-2 expansion negotiation begins at Pilot Month 10 to allow for definitive Master Services Agreement before Pilot end.

### Q17. International rollout — does FW Webb participate?

FW Webb's footprint is US-only (NE-concentrated). International rollout (Canada Year 3-4, Europe Year 5+) will use:

- **Canada**: similar partnership model with Wolseley / EMCO (FW Webb does not have right-of-first-refusal in Canada, but conversation expected)
- **Europe / UK**: similar model with Travis Perkins / Plumbase
- FW Webb retains right of first negotiation if it expands internationally during Sherpa Pros' international rollout window

### Q18. Could FW Webb acquire Sherpa Pros at some point?

Optional addendum referenced in LOI: FW Webb has right of first negotiation to acquire Sherpa Pros' Hub network at end of Pilot Year 5, on terms to be negotiated in good faith. This is an *option*, not an obligation, and either Party can decline. The intent is mutual optionality, not a forced exit.

## Internal-only (Sherpa Pros team)

### Q19. Why are we never saying "Wiseman" externally?

The internal engine is named `Wiseman Materials engine`. Externally — in any FW Webb-facing material, member-facing material, marketing material, dashboard label, email — we call it the **Sherpa Materials engine** (or just "Sherpa Materials"). Reason: the Wiseman name is not customer-positioned and would dilute the Sherpa Pros brand. CI lint should fail any external string containing "Wiseman."

### Q20. What's the LOI deadline and why is it hard?

**Phase 1 Month 4 — HARD DEADLINE.** Reason: the GTM Phase 0 fundraise narrative (Series Seed) depends on the FW Webb LOI as the proof-point that the partnership-anchored Hub model is real. Without a signed LOI by Month 4, the fundraise narrative slips by 2 quarters and Hub #1 buildout (Wave A) loses its planned revenue ramp. The deadline is forcing the pace deliberately.
