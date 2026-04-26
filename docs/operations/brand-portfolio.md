# Sherpa Pros Brand Portfolio

**v1.0 · 2026-04-25**

**Maintainer:** Phyrom (founder, HJD Builders LLC) · **Audit owner:** Brand Guardian agent
**Source-of-truth chain:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` §3 → this portfolio → all derivative artifacts (decks, pages, ads, signatures, wraps, gear)
**Companion docs:**
- `docs/slides/06-brand-bible.md` (internal teaching deck — do not duplicate; this portfolio extends)
- `docs/pitch/brand-audit.md` (Brand Guardian audit findings, Waves 1+2)
- `docs/operations/sherpa-product-portfolio.md` (4-product brand architecture)
- `docs/operations/brand-asset-prompts.md` (Ideogram prompt library)
- `docs/operations/social-media-prompt-library.md` (Wave 8.2 — generated in parallel)
- `scripts/marp-themes/sherpa-pros-editorial.css` (slide theme — locked typography)
- `scripts/docs-pdf-editorial.css` (print theme — locked typography)

This document is the canonical, source-of-truth brand book for Sherpa Pros. Internal teams, contracted designers, the social-media manager, future agency partners, web and mobile developers — anyone who applies the brand without daily founder oversight — reads this first. It exists so that ten people in five cities can produce work that reads as if one person made it.

It is intentionally substantive. A brand book that fits on one page does not survive its first contact with an agency. This one is built to.

---

## 1. Brand Story

Sherpa Pros is the national licensed-trade marketplace built by a working New Hampshire general contractor. It is one umbrella brand and **six products**: Sherpa Marketplace (the dispatch and match engine), Sherpa Hub (the physical pickup point for pros), Sherpa Home (the homeowner subscription), Sherpa Success Manager (the managed-service tier for property managers and white-glove homeowners), Sherpa Rewards (the points-based loyalty program for pros, fulfilled in real money via the Tremendous API), and Sherpa Flex (the side-hustle pro tier with per-project platform liability insurance built into the service fee — no LLC required).

The company started as a problem the founder lived. Phyrom runs HJD Builders LLC out of New Hampshire and has been a working general contractor for twelve-plus years. Every week his crew gets pitched the same platforms — Angi, Thumbtack, TaskRabbit, Handy — and every week the same two things go wrong. The leads are sold three or four times before they reach the contractor's phone, so the homeowner already feels harassed and the contractor pays to bid against people who shouldn't be touching the wiring. And nobody on those platforms checks code. A heat pump install in Massachusetts has to clear NEC, MA Electrical, and a municipal inspection, plus a Mass Save rebate paperwork chain. None of the existing platforms know that. Phyrom's crew does.

The name is the namesake. A Himalayan sherpa is the guide who knows the route — the one local who's done the climb a hundred times so the visitor doesn't die on it. That is the contractor's relationship to the homeowner: the local who's done the climb. Sherpa Pros is the platform that elevates the working contractor into that role and pays them for it, instead of selling their attention as a lead.

The promise is five words long and we say all five every time:

- **Jobs, not leads** — pros pay only when work happens.
- **Licensed only** — every pro on the platform has a current state license we verified.
- **Code-aware** — quotes get checked against NEC, IRC, state, and 284 NH municipal codes before they're sent.
- **Permit-aware** — the platform knows which jobs need permits in which jurisdictions.
- **Rebate-aware** — Mass Save, National Grid, and state-program rebates surface inside the quote, not after.

We are not a lead-generation platform with better marketing. We are a different model. The homeowner gets a verified licensed pro. The pro gets a job, not a sales lead. The platform takes a cut only when work happens. Built by a contractor, for the contractors he works with every day.

### 1.1 Two canonical hero messages — when to use which

**Public splash + paid acquisition** (homeowner-facing, conversion-anchored):

> *Where every project finds the right pro.*

This is what runs at `https://www.thesherpapros.com/` (live), in paid social, and in any homeowner outreach. **Locked 2026-04-25** per backend production deployment.

**Investor + partner + press kit + decks** (strategic positioning anchor):

> *The licensed-trade marketplace that thinks like a contractor.*
> *Built by a working GC. Code-aware. Permit-aware. Rebate-aware.*

This is what appears on slide 1 of every pitch deck, the executive one-pager, the Wefunder page, and all founder-voice press placements.

**Seven rotating taglines** also live on the splash (`<HeroTagline>` component, 5-second rotation). Reuse-per-context is fine for social copy; do not substitute them for the canonical splash hero. Full list in spec §3.1.1.

---

## 2. Logo System

### 2.1 Primary wordmark — the canonical horizontal logo

The primary wordmark is the canonical Sherpa Pros mark and the one to use in every situation where horizontal real estate is available.

**Visual description.** Two horizontal blocks side-by-side, both with rounded outer corners. The left block is sky blue (`#00A9E0`) and contains the word **SHERPA** in bold, condensed, white sans-serif lettering. The right block is orange-red (`#FF4500`) and contains the word **PROS** in the same bold, condensed, white sans-serif lettering. The seam between the two blocks is a forward-slanting diagonal cut: a notch is taken out of the upper-right corner of the SHERPA block, a matching notch is taken out of the lower-left corner of the PROS block, and the two notches meet at approximately seventy degrees from horizontal.

The diagonal cut is not decorative — it is the brand signature. Every other visual element in the system (corner accents on covers, list-item bullets, section dividers, app-icon construction) repeats it.

**Master file.** `/Users/poum/Library/Mobile Documents/com~apple~CloudDocs/Cranston Holdings DBA North Forge Construction/HJD Company/Marketing/Logos/Sherpa Pros/Sherpa Pros New.png`
**Project copy required:** `public/brand/sherpa-pros-wordmark.png` (see §10 — the master needs to be copied into the repo so deployments don't depend on iCloud).

**Use the primary wordmark for:**
- Website header (`thesherpapros.com` and all subdomains)
- Marketing landing pages, hero composition
- Business cards (front, full bleed)
- Vehicle wraps (door panel, side panel)
- Presentation cover slides (Marp `.lead` slide class)
- Print collateral covers (binders, one-pagers, decks)
- Press releases (header lockup)
- Email signatures (above the rule)
- App splash screen (mobile, when wide enough)
- Trade-show booth banners

### 2.2 App icon variant — the square form

When horizontal real estate is not available — anywhere a square or circle is required — use the icon variant.

**Visual description.** A square iOS-style app icon with rounded outer corners and a white background. Inside the icon: two parallelogram-shaped color blocks, slightly skewed clockwise, separated by a diagonal white gap that matches the wordmark's diagonal seam. The left parallelogram is sky blue (`#00A9E0`) and contains a bold white **S**. The right parallelogram is orange-red (`#FF4500`) and contains a bold white **P**. The white background gives the mark room to breathe inside circular crops on social platforms.

**Master file.** `/Users/poum/Library/Mobile Documents/com~apple~CloudDocs/Cranston Holdings DBA North Forge Construction/HJD Company/Marketing/Logos/Sherpa Pros/Sherpa Pros Icon.png`
**Project copy:** `public/brand/sherpa-pros-icon-1024.png` (already in repo)

**Use the app icon variant for:**
- iOS and Android app icons (every standard size — see §10)
- PWA `manifest.json` icons
- Browser favicon (`public/favicon.ico`)
- Apple touch icon (`public/apple-touch-icon.png`)
- Social media avatars (LinkedIn, Twitter / X, Instagram, Facebook, TikTok, YouTube, Threads)
- Email avatar (Gmail, Outlook profile pictures)
- Slack workspace icon, Notion workspace icon, GitHub organization avatar
- Loyalty / Founding Pro badge backgrounds (when the badge needs a brand anchor and there isn't room for the wordmark)
- Mobile app store screenshots (corner watermark)
- Vehicle decals where the wrap surface is square or circular (steering wheel hub, hubcap centers if ever produced)

### 2.3 Single-color variants

Production constraints — embroidery, single-plate printing, dark backgrounds — require single-color variants. There are three.

#### All-sky-blue variant (one-color brand)

Both the SHERPA and PROS blocks become solid sky blue (`#00A9E0`) with white text. The diagonal seam is preserved as a thin white gap. Use this when only one brand color is allowed (single-thread embroidery on apparel, single-plate offset printing, etched glass, branded coffee-cup sleeves).

#### All-white reversed variant (dark-background brand)

Both blocks become solid white. The lettering is knocked out of the white blocks (so the lettering is the dark background showing through). The diagonal seam is preserved as a thin gap of the dark background. Use this on dark navy hero sections, black hoodies, vehicle wraps with dark base colors, dark-mode website headers, late-night ad placements (TikTok, Instagram dark theme).

#### All-black variant (printing constraints)

Both blocks become solid black with white text. The diagonal seam is preserved. Use when the brand has to print to a single black plate — fax cover sheets, cheap black-and-white flyers, photocopier-distributed handouts at supply houses, low-cost newspaper inserts.

**Single-color variants are never decorative choices.** Use the full-color primary wordmark wherever you can. The single-color variants exist because of production constraints, not because someone preferred the look.

### 2.4 Clearspace rules

The minimum padding around the wordmark on all sides equals the height of one full letter **S** in the SHERPA block.

If the SHERPA block letters are 60 pixels tall, the clearspace is 60 pixels on every side — top, right, bottom, left. Nothing intrudes on this clearspace: no other logos, no body copy, no decorative elements, no other graphics. This rule is non-negotiable on covers, signage, and every print application.

For the app icon variant, the clearspace inside iOS / Android adaptive-icon containers is whatever the OS requires — do not add extra padding inside the icon file itself, because the OS handles the safe zone. For social avatars, leave 18 percent of the frame as padding so the mark survives circular crops on Twitter and Instagram.

### 2.5 Minimum sizes

| Application | Minimum |
|---|---|
| Wordmark, digital | 120 px wide |
| Wordmark, print | 1.0 in / 25 mm wide |
| App icon, digital | 32 px square |
| App icon, print | 0.4 in / 10 mm square |
| Favicon | 16 px square (test legibility — see §2.6) |

Below these sizes, the diagonal seam stops resolving cleanly and the wordmark becomes mush. If you need to go smaller, switch to the icon variant. If you need to go smaller than 32 px, switch to the favicon style (a single bold **S** with the diagonal cut).

### 2.6 Lockups

A lockup is the wordmark plus a fixed companion element, treated as one inseparable unit.

#### Wordmark + tagline lockup

Primary wordmark on top. One blank line below (height equal to the SHERPA block letters). The tagline below in **Fraunces italic**, color **dark navy** (`#1A1A2E`), letter-spacing -0.015em, sized so the tagline is approximately one-third the height of the SHERPA block.

> *The licensed-trade marketplace that thinks like a contractor.*

Use on landing-page hero, business-card front, vehicle-wrap rear panel, presentation cover slide, deck slide 1.

#### Wordmark + product name lockup

Primary wordmark, then a thin sky-blue vertical rule (1.5 px digital / 0.6 pt print), then the product name in Manrope 600 small caps with letter-spacing 0.18em, color dark navy. The product name sits on the same baseline as the SHERPA block letters.

The four allowed product names:

- **SHERPA MARKETPLACE**
- **SHERPA HUB**
- **SHERPA HOME**
- **SHERPA MANAGER**

Use on product-specific landing pages (`/marketplace`, `/home`, etc.), product spec sheets, product-specific email signatures, in-app product headers.

**Do not invent new product names** for ad-hoc lockups. Coordinate with Phyrom before any new product gets a lockup. Internal product names (Wiseman, Dispatch Wiseman, BldSync) never appear in any lockup, ever.

#### Wordmark + founder credit lockup

Primary wordmark, then a thin amber vertical rule, then **Built by HJD Builders LLC** in Manrope 500 at the same height as the tagline-lockup tagline. Color dark navy.

Use on the press kit, the investor data room cover, the trade-show banner, and Phyrom's email signature.

This lockup is the visible link between Sherpa Pros and the founder's working construction company. It is on-brand to use it; it is the proof point behind the "built by a working contractor" claim.

### 2.7 Things to NEVER do with the logo

Each of these is a violation of the brand. The Brand Guardian agent treats them as P0 issues during pre-send audits.

- **Never recolor outside the palette.** The SHERPA block is sky blue (`#00A9E0`). The PROS block is orange-red (`#FF4500`). No purple, no teal, no green, no holiday-themed recoloring, no client-color adaptation, no agency-creative-test recoloring. The single-color variants in §2.3 are the only allowed alternatives.
- **Never rotate the wordmark.** Not 5°, not 15°, not 90° for vertical signage. If you need a vertical lockup, use the icon variant stacked above the product name in Manrope.
- **Never stretch or squash the wordmark.** Both blocks must scale proportionally. If you need a different aspect ratio, request a new lockup from the brand owner — do not improvise.
- **Never apply drop shadows.** The wordmark is a flat geometric mark. Drop shadows make it look like a 1998 PowerPoint clip-art logo.
- **Never apply glow effects, outer-glow, inner-glow, or bevels.** Same reason.
- **Never separate SHERPA from PROS.** They are one mark. Do not put SHERPA on the left side of a layout and PROS on the right side. Do not animate them flying together. Do not use SHERPA alone. Do not use PROS alone.
- **Never remove or alter the diagonal cut.** The diagonal cut is the brand signature. A version without it is not the Sherpa Pros logo.
- **Never use the wordmark on a photographic background without proper contrast.** If the photo is busy, place the wordmark on a solid color block (warm cream, dark navy, or white) layered over the photo. If the photo is dark, use the all-white reversed variant. If the photo is light, use the primary wordmark with a 30 percent dark-navy gradient behind it.
- **Never crop the wordmark.** Both blocks always appear in full.
- **Never animate the diagonal cut.** Don't have it sliding in, splitting apart, glitching, or transforming. Animation reads as gimmick. The cut is a constant.
- **Never use a competitor-platform color in any Sherpa Pros context.** No Angi-purple accents. No Thumbtack-blue accents. No TaskRabbit-green accents. Even if the design "works," the association is off-brand.
- **Never combine the wordmark with another brand's logo in a single lockup** without explicit approval from Phyrom. Co-branded lockups (e.g., Mass Save × Sherpa Pros) require their own custom design, not an ad-hoc side-by-side placement.

---

## 3. Color Palette

### 3.1 Primary brand colors (used in the logo)

These three colors are the brand-identification anchors. The first two appear in every wordmark application. The third is the negative space that lets them breathe.

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0;">

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 16px; border-radius: 4px;">
<div style="background: #00A9E0; height: 96px; border-radius: 4px; margin-bottom: 12px;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 14px;">SKY BLUE</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #475569; margin-top: 4px;">HEX <strong>#00A9E0</strong><br>RGB(0, 169, 224)<br>CMYK(80, 20, 0, 0)<br>Pantone 299 C</div>
</div>

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 16px; border-radius: 4px;">
<div style="background: #FF4500; height: 96px; border-radius: 4px; margin-bottom: 12px;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 14px;">ORANGE RED</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #475569; margin-top: 4px;">HEX <strong>#FF4500</strong><br>RGB(255, 69, 0)<br>CMYK(0, 80, 100, 0)<br>Pantone Orange 021 C</div>
</div>

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 16px; border-radius: 4px;">
<div style="background: #FFFFFF; height: 96px; border-radius: 4px; margin-bottom: 12px; border: 1px solid #E8E0CC;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 14px;">WHITE</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #475569; margin-top: 4px;">HEX <strong>#FFFFFF</strong><br>RGB(255, 255, 255)<br>CMYK(0, 0, 0, 0)<br>—</div>
</div>

</div>

**Sky Blue · `#00A9E0`** is the SHERPA wordmark block, the primary brand accent everywhere, the color of every hyperlink, the color of every primary call-to-action button, the color of section rules above headlines, the color of the small diagonal-cut bullet that appears next to every h1, and the color of the favicon's S-shape background.

**Orange Red · `#FF4500`** is the PROS wordmark block, the secondary brand accent, the color of secondary calls-to-action, the color of "★ NEW" tags, and the color of attention-needing badges (urgent, expiring, new release). It is reserved — orange-red appears sparingly in the supporting design so it stays loud when it shows up. Do not use it for body text. Do not use it for backgrounds.

**White · `#FFFFFF`** is the text color inside both wordmark blocks, and an alternative page background when warm cream is not appropriate (for example, on screens where the cream tone clashes with surrounding UI).

### 3.2 Supporting colors (for typography, surfaces, supporting UI)

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0;">

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 12px; border-radius: 4px;">
<div style="background: #1A1A2E; height: 64px; border-radius: 4px; margin-bottom: 8px;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 12px;">DARK NAVY</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; margin-top: 4px;"><strong>#1A1A2E</strong><br>Body text, headings</div>
</div>

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 12px; border-radius: 4px;">
<div style="background: #475569; height: 64px; border-radius: 4px; margin-bottom: 8px;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 12px;">SOFT SLATE</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; margin-top: 4px;"><strong>#475569</strong><br>Captions, metadata</div>
</div>

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 12px; border-radius: 4px;">
<div style="background: #94A3B8; height: 64px; border-radius: 4px; margin-bottom: 8px;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 12px;">FAINT SLATE</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; margin-top: 4px;"><strong>#94A3B8</strong><br>Tertiary, disabled</div>
</div>

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 12px; border-radius: 4px;">
<div style="background: #10B981; height: 64px; border-radius: 4px; margin-bottom: 8px;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 12px;">EMERALD</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; margin-top: 4px;"><strong>#10B981</strong><br>Success only</div>
</div>

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 12px; border-radius: 4px;">
<div style="background: #FBF7EE; height: 64px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #E8E0CC;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 12px;">WARM CREAM PAPER</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; margin-top: 4px;"><strong>#FBF7EE</strong><br>Editorial bg</div>
</div>

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 12px; border-radius: 4px;">
<div style="background: #E8E0CC; height: 64px; border-radius: 4px; margin-bottom: 8px;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 12px;">WARM EDGE</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; margin-top: 4px;"><strong>#E8E0CC</strong><br>Borders, dividers</div>
</div>

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 12px; border-radius: 4px;">
<div style="background: #F2EBD9; height: 64px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #E8E0CC;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 12px;">CREAM DEEP</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; margin-top: 4px;"><strong>#F2EBD9</strong><br>Table stripe, code tint</div>
</div>

<div style="background: #FBF7EE; border: 1px solid #E8E0CC; padding: 12px; border-radius: 4px;">
<div style="background: #BE1E3C; height: 64px; border-radius: 4px; margin-bottom: 8px;"></div>
<div style="font-family: Manrope, sans-serif; font-weight: 700; color: #1A1A2E; font-size: 12px;">ROSE (alert)</div>
<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; margin-top: 4px;"><strong>#BE1E3C</strong><br>Errors, NEVER decorative</div>
</div>

</div>

**Dark Navy · `#1A1A2E`** is the primary body-text color in print and on light backgrounds. It is the heading color on light backgrounds. It is the default ink. It is also the brand's "lead section" background — when an editorial layout calls for a dark band, dark navy is the right black, not pure `#000000`. Pure black is a print error in this brand; it reads as cold and corporate. Dark navy is warmer and feels considered.

**Soft Slate · `#475569`** is the secondary text color — image captions, timestamps, byline metadata, the small line under a stat block. It is also the right color for inactive tab labels.

**Faint Slate · `#94A3B8`** is the tertiary text color — disabled buttons, placeholder text, the "5 of 12" counter under a paginated list, footnote markers. Use sparingly.

**Warm Cream Paper · `#FBF7EE`** is the preferred page background for every editorial material. It is not pure white. The cream tone reads as designed, intentional, magazine-like. Pure white reads as default browser stylesheet. Both the slide deck and the print theme already ship with this background. Honor it.

**Warm Edge · `#E8E0CC`** is the border color for cards, dividers, and table rows. Subtle. Visible. Never harsh.

**Cream Deep · `#F2EBD9`** is the table-stripe color and the inline code tint. It's a quarter-step deeper than the page background.

**Emerald · `#10B981`** is success-only. Use for: "Verified" badges, "Code-checked" markers, "Job completed" indicators, "Pro is online now" pulses, OAuth success states. Never decorative. Never as a brand accent. Never "let's add a pop of green" — that is a banned design move.

**Rose · `#BE1E3C`** is errors-only. Form validation failures, dispute-flagged jobs, declined payment states. Never decorative. Never a brand accent.

### 3.3 Color usage discipline

The discipline is more important than the swatches. Most agencies fail this brand by over-using the loud colors and under-using the cream paper.

- **Sky blue and orange-red appear ALWAYS in the logo, but use SPARINGLY in surrounding design.** Let them stay as the brand-identification anchors. A landing page with the wordmark in the header, two sky-blue rules separating sections, and one orange-red call-to-action button is on-brand. A landing page with sky-blue gradient backgrounds, orange-red cards, sky-blue dividers, orange-red headers, and sky-blue body links is off-brand — every color is shouting and nothing is loud.
- **Most surfaces are WARM CREAM with DARK NAVY text + thin SKY BLUE accent rules.** That is the editorial baseline. The Marp slide theme and the print theme both default to this. Designers should default to it too.
- **Orange-red is reserved for accents that need attention.** Calls-to-action, urgent badges, "★ NEW" tags, the lower-third metadata strip on the cover slide. If orange-red appears more than three times on a screen, the design is overusing it.
- **Emerald is success-only.** Never decorative. The instinct to add "a fresh pop of green" to balance the warm-cream layout is wrong. Resist it.
- **Rose is errors-only.** Same rule.
- **NEVER use gradients on body backgrounds.** Gradient backgrounds signal bro-startup. The Marp theme explicitly forbids them. The print theme explicitly forbids them. The website should never use them.
- **NEVER use drop shadows on text.** Text shadows are a 2003 web design tic. The brand is flat geometric design. Type sits on the page.
- **NEVER use neon variants of the brand colors.** No `#00FFFF` "electric sky blue." No `#FF8800` "neon orange." The hex values in §3.1 are exact. Off-palette neon variants drift the brand toward gaming-startup energy and away from tradesperson-credible.
- **NEVER add a sixth or seventh "supporting" color** without explicit Brand Guardian sign-off. Designers love to add "a touch of teal" or "a deeper purple for premium." This brand has the colors it has. Adding a color dilutes the system.
- **NEVER use brand colors at low opacity to "soften" them.** A 30 percent opacity sky blue is a different color. Use the supporting palette for softer values, not opacity tricks on brand colors.

---

### 3.5 The four-phase brand growth arc

The brand identity is national + international from Day 1. The operational footprint expands across four phases — but the brand story compounds, it does not pivot. The Brand Guardian's job is to defend that consistency: every phase should feel like the same Sherpa Pros, just operating in more places, serving more cohorts, with more product surfaces live.

**Why this matters.** The most common mistake premium B2B marketplaces make is rebranding when they expand — adding a "Sherpa Pros National" sub-brand at Phase 3, then a "Sherpa Pros Global" mark at Phase 4, then a franchise sub-mark at Phase 4. That fragmentation kills the equity built in Phase 1. The discipline is: ONE wordmark, ONE color palette, ONE voice — operating across an expanding footprint.

**The four operational phases:**

- **Phase 1 — Lean Launch (Months 3 to 6).** First close signed, beta cohort converts to founding paying customers (5 percent beta-pricing grandfathered forever), 50+ active pros across the Northern Triangle (Portsmouth + Manchester + Portland), Boston specialty lanes proven (20+ jobs in 5 lanes), 1 commercial Project Manager anchor signed, 500+ homeowner accounts. Seed round teed up.
- **Phase 2 — Scaled Launch (Months 6 to 12).** Seed closed, 4-metro parallel execution (Portsmouth + Manchester + Portland + Boston), 200+ active pros, 1,000+ jobs and $1M+ Gross Merchandise Value, 3+ Project Manager anchors, 5,000+ homeowner accounts. Series A conversations open Months 10 to 11. Take rate stable at 10 percent.
- **Phase 3 — Regional Expansion (Months 12 to 18, hard 6-month bound).** Series A closed, +2 metros (Providence Months 13 to 14, Hartford Months 15 to 16), New York City specialty beachhead (Brooklyn brownstones + Manhattan pre-war, Months 14 to 18), 1 utility white-label live (Eversource Massachusetts/Connecticut or National Grid New York), 3 Project Manager chain anchors, $5M+ annualized Gross Merchandise Value. Series B prep complete Month 17. Take rate 12 to 15 percent.
- **Phase 4 — National + International + Franchise + Scale (Month 18+).** Series B closed (target $20M to $40M), national United States footprint (Philadelphia + Washington DC + San Francisco + Chicago specialty lanes), international expansion Canada Year 1 → United Kingdom Year 2 → Australia Year 3 → European Union pilot Years 4 to 5, franchise model live (Hub #2 to #10 FW Webb co-located + Hub #11+ via franchise), Service Organization Control 2 Type 2 certified by Month 30, multi-region infrastructure (US-East / US-West / Canada / EU), enterprise Project Manager chains + insurance carrier partnerships. Path to Series C Months 27 to 30 or strategic acquisition.

**What changes per phase, and what does NOT change:**

| Element | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---|---|---|---|---|
| Wordmark | Same | Same | Same | Same |
| Color palette | Same | Same | Same | Same |
| Typography | Same | Same | Same | Same |
| Voice + tone | Same | Same | Same | Same |
| Founder origin story (Phyrom, working New Hampshire general contractor at HJD Builders LLC) | Same | Same | Same | Same |
| Footprint mention in copy | "Launching in NH/ME/MA" | "4 metros across New England" | "6 metros across New England + New York City specialty" | "6+ metros across the United States, plus Canada / United Kingdom / Australia" |
| Audience cohorts addressed | Pros + homeowners + 1 Project Manager anchor | + 3 Project Manager anchors + utility pilots starting | + utility white-label + 3 Project Manager chains + franchise FDD prospects | + insurance carriers + enterprise Project Manager chains + international cohorts + franchisees |
| Product surfaces LIVE (see §1 of `sherpa-product-portfolio.md`) | Marketplace + Hub #1 build | Marketplace + Hubs #1–3 + Home + Success Manager + Rewards + Flex + all platform capabilities | All 6 products LIVE in 6 metros + NYC specialty beachhead | Full national + 4 international countries + franchised Hubs |

**Voice example — same brand, expanding footprint:**

- Phase 1 lead hook: "Built by a working New Hampshire general contractor. Launching in Portsmouth, Manchester, and Portland."
- Phase 2 lead hook: "Built by a working New Hampshire general contractor. Now serving 4 metros across New England."
- Phase 3 lead hook: "Built by a working New Hampshire general contractor. Serving 6 metros plus a Brooklyn + Manhattan specialty beachhead."
- Phase 4 lead hook: "Built by a working New Hampshire general contractor. Now serving 6+ United States metros, plus Canada, United Kingdom, and Australia."

The hook compounds. It never resets. A Phase 4 prospect in Toronto reads the same brand story a Phase 1 pro in Portsmouth read — and that continuity is the equity.

**Brand Guardian rules during phase expansion:**

- NEVER spin up sub-brands per phase. No "Sherpa Pros National," "Sherpa Pros International," "Sherpa Pros Franchise." It is one brand.
- NEVER drop the founder credit when expanding. Phyrom's working-contractor origin is the trust anchor in every phase, including Phase 4 international.
- NEVER change the color palette to "feel more national" or "feel more international." The colors stay.
- DO add the new metro / country to existing copy when it goes live. Update the lead hook footprint mention. Do not invent new copy frameworks.
- DO grandfather Phase 1 founding pros' pricing forever, and tell that story in Phase 2/3/4 marketing as proof the brand keeps its promises.

---

## 4. Typography System

The typography stack is locked. It ships in the Marp slide theme (`scripts/marp-themes/sherpa-pros-editorial.css`) and the print theme (`scripts/docs-pdf-editorial.css`). Designers do not pick the typefaces — they apply them.

### 4.1 Display Typeface — Fraunces

**Fraunces** is a free Google Fonts variable serif by Undercase Type. Variable axes:
- `opsz` (optical size) — 9 to 144
- `wght` (weight) — 100 to 900
- `SOFT` (softness of letterforms) — 0 to 100
- `WONK` (alternate "wonky" letterforms — `g`, `e`, swashes) — 0 to 1

**Use Fraunces for:**
- Page titles and section headers
- Big-number callouts (the canonical `.bignumber` slide)
- Pull quotes
- Marketing hero typography
- Drop caps in long-form editorial

**Why this font.** Fraunces brings real editorial character without being precious. The optical-size axis means it looks like a different (better) typeface at body italic vs. 96-point display. The WONK axis is the secret weapon: turning it on adds a single distinctive flourish to a few letters that differentiates this brand from the Inter/Söhne/GT America homogeneity of every other 2026 startup. Pairing rationale: editorial gravitas without bro-startup flatness.

**Sample (Fraunces display, opsz 144, SOFT 80, WONK 1):**

<div style="background: #FBF7EE; padding: 32px; border: 1px solid #E8E0CC; border-radius: 4px; margin: 16px 0;">
<h1 style="font-family: 'Fraunces', Georgia, serif; font-variation-settings: 'opsz' 144, 'SOFT' 80, 'WONK' 1; font-size: 56px; font-weight: 500; color: #1A1A2E; line-height: 0.95; letter-spacing: -0.025em; margin: 0;">Built by a working contractor.</h1>
</div>

**Sample (Fraunces italic, opsz 48, SOFT 50, WONK 0) — body italic emphasis:**

<div style="background: #FBF7EE; padding: 24px; border: 1px solid #E8E0CC; border-radius: 4px; margin: 16px 0;">
<p style="font-family: 'Fraunces', Georgia, serif; font-variation-settings: 'opsz' 48, 'SOFT' 50; font-style: italic; font-size: 18px; color: #1A1A2E; margin: 0;">The licensed-trade marketplace that thinks like a contractor — built by a working New Hampshire general contractor, for the contractors he hires every week.</p>
</div>

### 4.2 Body Typeface — Manrope

**Manrope** is a free Google Fonts geometric grotesque by Mikhail Sharanda. Weights used: 300, 400, 500, 600, 700.

**Use Manrope for:**
- All body text
- Captions, metadata, footers
- Button labels, navigation, form labels
- Longer-form reading (more than two paragraphs in a row)
- Small-caps section labels (h4, eyebrows, chip badges)

**Why this font.** Open apertures, distinctive `g` and `a` (a true two-story `a`, not the geometric mono-story Inter `a`), modern but not trendy. Critically: NOT Inter — Inter is overused to the point that any design using it reads as "competent SaaS startup." NOT Roboto — Roboto reads as "default Android app." Manrope has personality at body weight, holds up at small-caps weight, and renders crisp on every device including older Windows machines. JetBrains designed this with screens in mind, and it shows.

**Sample (Manrope 500, 16pt body):**

<div style="background: #FBF7EE; padding: 24px; border: 1px solid #E8E0CC; border-radius: 4px; margin: 16px 0;">
<p style="font-family: 'Manrope', sans-serif; font-weight: 500; font-size: 16px; line-height: 1.55; color: #1A1A2E; margin: 0;">The licensed-trade marketplace that thinks like a contractor. Pros pay only when work happens. Quotes get checked against state and municipal codes before they're sent. Built by a working contractor, for the contractors he works with every day.</p>
</div>

**Sample (Manrope 700 small caps, 11pt label):**

<div style="background: #FBF7EE; padding: 24px; border: 1px solid #E8E0CC; border-radius: 4px; margin: 16px 0;">
<div style="font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #0284B6;">Section · Brand Voice</div>
</div>

### 4.3 Mono Typeface — JetBrains Mono

**JetBrains Mono** is a free Google Fonts distinctive monospace by JetBrains. Weights used: 400, 500, 700.

**Use JetBrains Mono for:**
- Code blocks and inline code
- File paths and URLs
- Technical data, API responses, JSON snippets
- Dashboard numerals (where tabular alignment matters)
- Legal-disclaimer fine print where a typewriter feel reinforces "this is the actual contract text"

**Why this font.** Stronger personality in numerals than IBM Plex Mono — the `4`, `7`, and `0` all have distinctive treatment. Programming ligatures via `font-feature-settings: 'calt'` produce nicer `=>` and `!=` sequences in code. Legible at 9 pt where many monospace fonts collapse.

**Sample (JetBrains Mono 400, 11pt code):**

<div style="background: #F2EBD9; padding: 16px; border: 1px solid #E8E0CC; border-left: 3px solid #00A9E0; border-radius: 4px; margin: 16px 0;">
<pre style="font-family: 'JetBrains Mono', 'SF Mono', monospace; font-weight: 400; font-size: 13px; color: #1A1A2E; margin: 0; line-height: 1.55;">// Brand color tokens — locked
const sky    = '#00A9E0';   // SHERPA block + primary accent
const orange = '#FF4500';   // PROS block + secondary accent
const navy   = '#1A1A2E';   // body text + dark sections
const cream  = '#FBF7EE';   // page background</pre>
</div>

### 4.4 Type scale (locked)

The type scale is sized for both 16:9 slide layouts (1280×720) and 8.5×11 print pages. Rendering may differ; the relative hierarchy stays the same.

| Role | Size | Family | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| h1 display (cover, hero) | 48–96 pt | Fraunces | 500–600 | 0.95 | -0.025em |
| h1 body (page title) | 32–52 pt | Fraunces | 500 | 1.05 | -0.020em |
| h2 section | 22–34 pt | Fraunces | 500 | 1.10 | -0.015em |
| h3 subsection | 16–24 pt | Manrope | 600 | 1.25 | -0.010em |
| h4 small-caps label | 9–12 pt | Manrope | 700 | 1.20 | 0.18em (uppercase) |
| Body | 11–21 pt | Manrope | 400 | 1.55 | -0.005em |
| Body emphasis | 11–21 pt | Manrope | 600 | 1.55 | -0.005em |
| Body italic | 11–21 pt | Fraunces (italic) | 400 | 1.55 | -0.005em |
| Caption | 10–16 pt | Manrope | 500 | 1.45 | 0.000em |
| Mono / code | 9–17 pt | JetBrains Mono | 400 | 1.55 | -0.020em |
| Bignumber slide | 200–320 pt | Fraunces | 500 | 0.85 | -0.055em |

**Note on Fraunces variation settings.** At display sizes (40 pt and up), use `'opsz' 144, 'SOFT' 80, 'WONK' 1` for the canonical brand voice. At medium sizes (24–40 pt), use `'opsz' 96, 'SOFT' 30, 'WONK' 0`. At body sizes, use `'opsz' 24, 'SOFT' 30` for body italic emphasis. The Marp theme and print theme both encode this.

### 4.5 Type rules

- **Never use more than 2 typeface families on a single layout.** Fraunces + Manrope is the canonical pair. JetBrains Mono only enters when actual code, file paths, or technical data is shown.
- **Never set body text below 11 pt.** Below 11 pt, accessibility falls off and reading load spikes. The print theme uses 11 pt as the body floor; the slide theme uses 21 pt.
- **Always use proper smart quotes.** `"like this"` (`U+201C` and `U+201D`), not `"like this"` (straight quotes). For apostrophes, `it's` not `it's`. The print theme has `font-feature-settings: 'kern' 1, 'liga' 1` to enable proper typography; respect it in source content too.
- **Always use em-dash for parenthetical asides.** `Built by a working contractor — and used by him every week.` Never `--` (double hyphen). Never `-` (single hyphen between spaces). The em-dash is `U+2014`.
- **Never set body text in all-caps.** All-caps body is unreadable above one line. The only all-caps treatment in this brand is the h4 small-caps label (Manrope 700, 0.18em letter-spacing).
- **Justify only print body text, never web body text.** Web hyphenation is unreliable across browsers; left-aligned body with proper line breaks reads better. The print theme justifies body. The web should not.
- **Tabular figures for numbers in tables and dashboards.** Use `font-variant-numeric: lining-nums tabular-nums` on every column that contains numbers to keep them aligned. Both themes enable this.
- **Never use Comic Sans, Papyrus, Brush Script, Times New Roman 12 pt single-spaced, or any other "default Word document" typography for any Sherpa Pros surface.** This brand is editorially considered. There is no "quick and dirty" version of it.

---

## 5. Voice & Tone

This section reproduces the brand voice rules from `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` §3.3, with examples for each. Voice is the thing that stays the same across products, audiences, and surfaces.

### 5.1 Tone

Plainspoken. Direct. Tradesperson-friendly. Dry. Zero marketing-speak. 8th-grade reading level.

He talks like a guy who actually swung a hammer this morning — because he did.

**Good — on voice:**

> *I just paid $87 for a lead that ghosted me. The plumber I called paid $112 for the same lead. The "homeowner" was never real.*

> *A homeowner called me yesterday. She'd had three contractors no-show in two weeks.*

**Bad — off voice:**

> *Sherpa Pros leverages an AI-powered, next-generation marketplace solution to disrupt the legacy lead-generation paradigm and unlock unprecedented value for the construction ecosystem.*

The bad example fails seven different ways: AI-powered as a headline, "leverages," "disrupt," "next-generation," "unprecedented value," "ecosystem," and a 30-word sentence with zero specific facts. The good examples win because they have a real number, a real person, a real story.

### 5.2 ALWAYS say

#### Licensed

Every pro on the platform has a current state license we verified.

- **Good:** *"Every electrician on Sherpa Pros has a current state license we pulled from the state board last week."*
- **Good:** *"Licensed only — we don't take pros without a verified license."*
- **Bad:** *"Sherpa Pros connects you with experienced professionals."* (Experienced is unverifiable. Licensed is verifiable. Use the verifiable word.)

#### Verified

License, insurance, and certificate of insurance with the homeowner named as additional insured.

- **Good:** *"Verified license, verified insurance, verified COI naming you as additional insured before the pro shows up."*
- **Good:** *"Pro background and insurance get re-verified every 90 days."*
- **Bad:** *"All our pros are vetted."* (Vetted is vague. Verified with a list of what's verified is specific.)

#### Code-aware

Quotes get checked against NEC, IRC, MA Electrical, NH RSA, and 284 NH municipal codes.

- **Good:** *"Quotes get checked against NEC, IRC, MA Electrical, NH state code, and 284 NH municipal codes before they're sent."*
- **Good:** *"Code-aware means the platform knows that a Boston heat pump install needs a different scope than a Manchester one."*
- **Bad:** *"AI-powered code intelligence."* (AI-powered is banned as a headline. Code-aware describes the user value, not the technology.)

#### Built by a contractor

Phyrom runs HJD Builders. He uses the platform himself.

- **Good:** *"Built by a working New Hampshire general contractor — and used by his crew every week."*
- **Good:** *"Hi, I'm Phyrom. I run HJD Builders. I built Sherpa Pros because the platforms my crew gets pitched every week sell us leads we can't afford."*
- **Bad:** *"Founded by industry experts."* (Industry experts is a tell — the founder voice is missing. Always lead with Phyrom's working-contractor identity.)

#### Local

These are the pros down the street. Treat homeowners as neighbors.

- **Good:** *"The plumber on the platform lives twelve miles from your house."*
- **Good:** *"Local pros, fast match, no national call center."*
- **Bad:** *"Hyper-local on-demand service network."* (Hyper-local and on-demand are buzzwords. Just say local.)

#### Jobs, not leads

Pros pay only when work happens.

- **Good:** *"Jobs, not leads. The whole model in three words."*
- **Good:** *"Pros pay only when work happens. Angi sells the same lead four times."*
- **Bad:** *"Premium lead-generation alternatives."* (We are not a lead-gen alternative. We are a different model. Don't accept the lead-gen frame.)

#### National

The brand is national, with international roadmap. Launch geography (NH/ME/MA, Boston specialty) is a Phase 1/2/3 sequence, not the brand identity.

- **Good:** *"Sherpa Pros is the national licensed-trade marketplace, launching in NH, ME, and MA — expanding nationally."*
- **Good:** *"National platform. Local pros. Built by a working contractor in New Hampshire."*
- **Bad:** *"The New England licensed-trade marketplace."* (Region-anchored brand language is banned. The launch is in New England; the brand is national.)

### 5.3 NEVER say

#### "Wiseman" externally

Internal product name. If it leaks externally we look like an AI gimmick instead of a contractor's tool.

- **Bad:** *"Powered by Wiseman code intelligence."*
- **Good:** *"Powered by code-aware quote validation."*
- **Why it matters:** Wiseman is an internal name for the AI engine. Externally we describe what it does for the user (code-aware quote validation), not what it is internally (Wiseman). The Brand Guardian audit found Wiseman leaks in five external-facing artifacts in Wave 1+2; eliminating these was the single biggest improvement.

#### Gig / Task

Frames our pros as TaskRabbit-style unskilled labor. They are licensed trade.

- **Bad:** *"Gig workers. On-demand tasks."*
- **Good:** *"Licensed trade pros. Pre-priced jobs."*
- **Why it matters:** TaskRabbit owns "task." Uber owns "gig." Our pros are skilled licensed tradespeople. Calling their work a gig or task is both inaccurate and a category-defining mistake.

#### "Uber for X" externally

Internal shorthand only. Externally it cheapens the licensed-trade positioning.

- **Bad:** *"We're the Uber for licensed contractors."*
- **Good:** *"The licensed-trade marketplace that thinks like a contractor."*
- **Why it matters:** "Uber for X" is investor shorthand inside the company. Externally it reduces a multi-product, code-aware platform to a tired startup metaphor. (Note: even our internal CLAUDE.md uses "Uber for contractors" as shorthand — we should fix that too because AI agents reading CLAUDE.md propagate the framing into external copy.)

#### "AI-powered" as headline

Investors and pros tune out. AI is supporting cast. The contractor is the lead.

- **Bad:** *"AI-powered marketplace for contractors."*
- **Good:** *"The licensed-trade marketplace that thinks like a contractor."*
- **Why it matters:** Every other 2026 pitch deck headlines AI. Headlining the contractor — not the AI — differentiates the brand and respects the user. AI can appear later in the body as supporting capability, never as the lead.

#### Disrupt / Revolutionize

Buzzword tax. We do not pay it.

- **Bad:** *"Disrupting the home-services industry."*
- **Good:** *"Sending jobs, not leads. Built by a working contractor."*
- **Why it matters:** Disrupt and revolutionize are tells. They mark a writer who couldn't think of a specific verb. Use specific verbs. ("Sending jobs," "checking codes," "matching pros.")

#### Jargon abbreviations on first use

CO, SOV, AR, RFI, ARR, NPS, CAC, GMV — spell out on first use, then abbreviation is fine.

- **Bad:** *"$2.0M ARR before the PM tier turns on."*
- **Good:** *"$2.0 million Annual Recurring Revenue (ARR) before the PM tier turns on."* — then `ARR` alone is fine subsequently.
- **Why it matters:** Investors who haven't read the spec don't know what "Phase 0" or "ARR" means at first encounter. Spelling out builds trust. Internal team can still abbreviate; external materials must spell out.

#### Region-anchored brand language

The brand is national. Launch geography (NH/ME/MA, Boston specialty) is a Phase 1/2/3 sequence, not the brand identity.

- **Bad:** *"The New England licensed-trade marketplace."*
- **Bad:** *"Sherpa Pros for NH/ME/MA."*
- **Bad:** *"The Northern Triangle marketplace."*
- **Good:** *"The national licensed-trade marketplace, launching in New England Phase 1."*
- **Good:** *"Phyrom is a working New Hampshire general contractor running HJD Builders LLC."* (Founder biography — true and specific. Phyrom's NH-GC identity is biography, not a brand cap.)
- **Why it matters:** Region-anchored brand language caps the brand at the launch market. In five years when we operate in Texas, "the New England marketplace" is wrong. The test: if you removed the region word, would the sentence still make sense in five years when we operate in Texas? If yes, the word is operational and stays. If no, it's brand-capping and goes.

#### "The Sherpa Pros app"

Ambiguous now that we have multiple products (Marketplace, Hub, Home, Manager).

- **Bad:** *"Download the Sherpa Pros app."*
- **Good:** *"Download Sherpa Marketplace."* (Or whichever specific product is relevant.)
- **Why it matters:** With four products under one brand, "the Sherpa Pros app" doesn't tell the user which app. Always specify.

### 5.4 Founder voice — the lead hook

Always. Slide 1 of every deck. Line 1 of every pro recruit. Paragraph 1 of every PR placement.

> *"Hi, I'm Phyrom. I run HJD Builders — a licensed general contractor in New Hampshire."*
>
> *"I built Sherpa Pros because the platforms my crew gets pitched every week — Angi, Thumbtack, TaskRabbit, Handy — sell us leads we can't afford and send homeowners to people who shouldn't be touching their wiring."*

Why this works: people follow people. Logo posts underperform Phyrom's face by 3–5×. Investors back founders, not decks. Pros trust other pros, not platforms. If your copy does not have Phyrom's voice in the first paragraph, rewrite it.

### 5.5 Phyrom-specific rules

His surname is **UNKNOWN** until he confirms it. Until then, never write a surname. Do not guess.

- **Right:** *Phyrom · Founder · NH General Contractor · HJD Builders LLC*
- **Right:** Founder card initials display: **P** (single letter)
- **Wrong:** *Phyrom Doung, founder of Sherpa Pros* (surname guessed — caught in Brand Guardian audit P0-1)
- **Wrong:** Founder card initials: **PD** (encodes a guessed surname — caught in audit P0-2)

**Pre-send check:** run `git grep -i "Phyrom [A-Z][a-z]"` before any external send. Must return zero hits.

### 5.6 Pricing-comparison framing

Pricing is a value comparison, not a price-shopping comparison.

- **Always:** *"5% take rate vs Angi's effective $400–$800 per closed job."*
- **Always:** *"Roughly half the all-in cost a contractor pays Angi today."*
- **Always:** *"Pros pay only when work happens. Angi sells the same lead four times."*
- **Never:** *"Cheaper than Angi"*
- **Never:** *"Lower fees"*
- **Never:** *"Better deal forever"* · *"5 cents on the dollar"*

Why: "cheaper / lower / better deal" invites price-shopping. We invite value comparison. The numbers tell the story; we don't editorialize them.

---

## 6. Visual Language

The brand has a consistent visual grammar that extends beyond logo and color. Designers internalizing this grammar produce on-brand work even when they invent new compositions.

### 6.1 Diagonal cut motif

The logo's diagonal seam is the brand signature. It appears at approximately 70 degrees from horizontal, slanting forward (lower-left to upper-right). It shows up everywhere:

- **Corner accents on covers.** A small sky-blue triangle in the upper-right or upper-left corner of cover slides, business card backs, deck title pages. Built with a `clip-path: polygon(100% 0, 100% 100%, 0 0)` (upper-right) or mirrored variants.
- **Section dividers in editorial materials.** A short diagonal amber rule (skewed -24 degrees) below H1 headings in print, echoing the wordmark seam.
- **List bullets.** Every `<li>` bullet in the slide and print themes is a tiny sky-blue diagonal-cut block (`clip-path: polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)`). The same shape as the wordmark seam, miniaturized.
- **Color-block transitions.** When two color blocks meet on a layout (e.g., a sky-blue section flowing into a dark-navy section), the seam is a diagonal cut, not a horizontal line.
- **Swatch shapes in this document.** The `.swatch` class uses the same diagonal-cut polygon.

Apply the diagonal cut consciously. It should feel like a thread running through every brand surface, not like a randomly-placed decoration.

### 6.2 Geometry

Clean geometric shapes. Rounded outer corners on icon-style elements. Sharp inner corners on diagonal seams. No organic shapes (no swirls, no blobs, no hand-drawn lines, no painterly textures).

The brand is built with a ruler and a 70-degree angle template, not a paintbrush.

### 6.3 Negative space

Generous white and cream space around primary elements. Don't over-fill. The brand is confident; it doesn't need to fill every pixel.

The 72-pixel slide margin in the Marp theme and the 0.85-inch print margin are floors, not ceilings. When in doubt, leave more white space, not less. The reader's eye needs the rest.

### 6.4 Photography style

When photography is used:

- **Documentary, not stock.** Real people, real moments. No posed group photos with arms crossed. No smiling-at-camera "we love our customers" energy.
- **35mm equivalent focal length, shallow depth of field.** Wide enough to show context (the jobsite, the materials, the room), shallow enough to focus attention on hands or tools.
- **Mid-action moments.** Someone tightening a fitting. Drilling a pilot hole. Taping drywall. Reading a measurement. Never a frozen "here is a contractor standing still" pose.
- **Real jobsites.** Mid-renovation. Mid-install. Mid-repair. Sawdust on the floor, a half-hung sheet of drywall, a real toolbelt with worn leather. Not a clean Instagram-staged "photo studio with a hardhat on a stand."
- **Phyrom on jobsites is the canonical founder portrait.** Real NH jobsite, real work clothes, no studio lighting. The founder photo on the about page should look like a frame from a documentary, not a corporate headshot.
- **Natural light strongly preferred.** Golden hour or overcast diffuse. Avoid harsh midday sun (washes out skin tones, blows out highlights on metal tools).
- **Cool jobsite tones.** Concrete, denim, copper, sky. These harmonize with the sky-blue brand. Avoid heavily warm or saturated photos that fight brand colors. Avoid the teal-and-orange grading common in stock photos.

### 6.5 Iconography style

- **Flat geometric.** Single line weight. Brand color OR dark navy. No gradients on icons.
- **No Material Design tropes.** No filled-circle backgrounds behind every icon. No Google-style "outlined" / "filled" toggle pairs. The brand has its own iconography vocabulary.
- **No 3D rendering.** No isometric construction-equipment renders. No 3D-shaded toolbelts.
- **No clip-art tools.** No Microsoft-clipart wrenches and houses. The Ideogram prompt library (`docs/operations/brand-asset-prompts.md`) gives concrete starting prompts that avoid these tropes.

### 6.6 Illustration style

Minimal. Editorial line-art when illustrations are needed. Think New York Times opinion-page illustrations, The Atlantic feature graphics, Stripe Press cover art.

- **Never cartoon mascots.** No Mailchimp Freddie equivalent for Sherpa Pros. (The brand-asset-prompts library includes one mascot variant for exploration — it has not been adopted and is not approved for production use.)
- **Never construction clip-art hardhats.** No generic yellow hardhat icons. No wrench-and-house compositions.
- **Never bloated infographics.** Information design follows the same editorial discipline as everything else: simple, considered, generous whitespace.

---

## 7. Photography Direction

This is the brief for any photographer or AI image generator working on Sherpa Pros visuals. Hand it to them with the project, and ask them to acknowledge each section before they shoot.

### 7.1 Subject matter

- Real licensed contractors at work. Electricians wiring a panel. Plumbers sweating a copper joint. GCs walking a framed-up addition. Painters cutting in a corner. HVAC techs setting a heat-pump head.
- Real jobsites. Mid-renovation. Mid-install. Mid-repair. The jobsite mid-process is more visually interesting than a finished room.
- Tools, materials, hands at work. Close-up of a tape measure on a 2×4. Hand on a pencil marking a stud. Worn leather toolbelt with the actual scuffs from real use.
- Phyrom on jobsites — the canonical founder portrait. Real NH project, real work clothes, real light.

### 7.2 Style

- Documentary, not staged. The photographer should be invisible. The contractor should be working, not posing.
- 35mm equivalent focal length. Sometimes 50mm for closer detail. Avoid wide-angle distortion (24mm or wider) and telephoto compression (85mm or longer) — they make the work feel less immediate.
- Shallow depth of field for detail shots. Deeper depth for context shots (the whole jobsite). Mix both in any series.
- Natural light strongly preferred. Golden hour OR overcast diffuse. If artificial light is required, soft and warm, not direct flash.
- Authentic skin tones. Real lighting. No over-saturation. No teal-and-orange Hollywood color grading.
- Mid-action moments. Someone tightening a fitting, drilling a pilot hole, taping drywall, reading a measurement. Never a frozen stock-photo pose.
- Color palette in the photograph should harmonize with the brand. Cool jobsite tones — concrete, denim, copper, sky — work well. Avoid heavily warm or saturated photos that fight brand colors.

### 7.3 Avoid

- Stock-photo orange-vest construction worker stereotypes. We are not a highway construction company.
- Posed group photos of "the team" with arms crossed in front of a building.
- Empty-jobsite hero shots without people. The brand is about the people doing the work.
- Heavy color grading, especially the teal-and-orange grade common in stock photos.
- Smiling-at-camera "we love our customers" energy. The contractor should be focused on the work, not on the camera.
- Hardhat-and-clipboard cliché. Hardhats appear when the job requires them, not as a costume.
- Lens flares. Glossy 3D renders. Generic Shutterstock vibes.
- Anything that looks like an Angi or Thumbtack ad. We are intentionally a different visual brand.

### 7.4 Releases and rights

Every person photographed signs a model release before publication. Every jobsite photographed has the homeowner's written permission (or is one of Phyrom's HJD Builders projects where permission is built into the contract). The Brand Guardian agent verifies this before any photo ships externally.

---

## 8. Brand Applications

How the brand applies to specific surfaces. Each is a brief — not a full design spec, but enough that a designer with the rest of this portfolio can produce on-brand work.

### 8.1 Website (thesherpapros.com)

The web surface has THREE distinct contexts. Brand application differs per context.

**8.1a — Public splash + waitlist (`/`, `/about`, `/invite`, `/invite/pro`, `/invite/pm`, `/invite/client`)**

This is the live pre-launch acquisition surface (`src/app/page.tsx`, deployed). Dark navy background (`#0a0a0f`-ish near-black, NOT pure black) with white text. Primary wordmark in header, left-aligned, with 24 px clearspace from the navigation. Hero canonical: *"Where every project finds the right pro."* with seven rotating taglines via `<HeroTagline>` (5-second rotation — see §1.1 + spec §3.1.1). Components in use: `<Logo>`, `<HeroTagline>`, `<WaitlistForm>`, `<ZipCapture>`, `<ScrollFadeIn>`, `<CountUp>`. Above-the-fold contains the waitlist email capture; below-the-fold contains competitor comparison + Sherpa ecosystem section.

The About page (`/about`) uses the same dark theme but switches to hero text *"Built by a contractor. For everyone in the trade."* — founder-origin story. No personal info, no HJD references in body copy (HJD identity used only on the wordmark and where the founder is named).

Invite pages are role-specific (pro / pm / client) — same dark theme, role-specific value props, prefilled mailto for sharing.

**8.1b — Post-auth dashboards (`/(dashboard)/client/...`, `/(dashboard)/pm/...`, `/(dashboard)/pro/...`, `/(dashboard)/admin/...`)**

The signed-in product surface. Brand applies as: warm cream sections (`#FBF7EE`) alternating with dark navy "lead" sections (used sparingly — once or twice per page, for hero or CTA-band). Sky-blue accent rules above section titles. Fraunces for h1 page titles (44–56 pt). Manrope for body (15 pt minimum). Editorial-magazine layout. Sidebar navigation uses Manrope small caps with sky-blue active-state rule. Investor metrics dashboard at `/admin/investor-metrics` follows the same editorial discipline.

**8.1c — Marketing landing pages (NOT yet shipped — Phase 1 work)**

The aspirational homeowner / pro / PM marketing landing pages drafted in `docs/marketing/email-sequences/` and the original Wave 1 `marketing-content-creator` agent output are NOT live yet. They were drafted for post-launch when the public splash flips from waitlist to full marketplace. When they ship, they'll inherit the same warm-cream + dark-navy editorial discipline as the dashboards (§8.1b above) — not the pre-launch dark-navy splash style of §8.1a.

**Universal button rules (apply across all 3 contexts):**
- Primary action: sky-blue background with white text
- Secondary action: orange-red background with white text  
- Tertiary action: text link with sky-blue underline
- Never more than one primary action visible on a single screen

**Universal footer rules:**
- Dark navy background, warm-cream text, sky-blue accent rule above
- Links underlined in sky-blue
- Canonical domain (thesherpapros.com) and contact (Phyrom email) visible
- About page link, invite page link, sign-in link in nav

### 8.2 Mobile app (Sherpa Marketplace)

App icon at every standard size — 16, 32, 48, 72, 96, 144, 192, 512, 1024 px (see §10 asset library). Brand color theming respects iOS adaptive icon guidelines (the dark-navy variant for iOS 17+ dark / tinted modes) and Android adaptive icon foreground/background separation.

In-app type uses Fraunces for screen titles and Manrope for everything else. Same type scale as the editorial system, scaled down for mobile.

In-app sky blue is the primary accent. In-app orange-red is reserved for badges and urgent actions (a red pulse on a job that needs response within 2 hours, for example). In-app emerald is reserved for success states (job completed, payment received).

### 8.3 Email signature

Phyrom's signature template:

> **Phyrom**
> *Founder · NH General Contractor · HJD Builders LLC*
>
> Sherpa Pros · The licensed-trade marketplace that thinks like a contractor.
> [thesherpapros.com](https://www.thesherpapros.com/) · poum@hjd.builders

Format: name in Manrope 600 dark navy. Role + company in Manrope 400 small-caps with letter-spacing 0.18em, soft-slate color. One blank line. Tagline in Fraunces italic 14pt, dark navy. Domain and email on the same line, JetBrains Mono 12pt, sky-blue underline on the domain.

A 2-pixel sky-blue rule sits above the signature, full-width to the email body's right edge.

For team emails, replace `Phyrom · Founder · NH General Contractor · HJD Builders LLC` with the team member's name and role. Keep everything else identical.

### 8.4 Business card

**Front:** primary wordmark, full bleed. Sky-blue and orange-red blocks running edge-to-edge with the diagonal cut centered. No text on the front. The wordmark IS the front.

**Back:** warm cream background. Dark navy type. Sky-blue accent rule along the top edge. Phyrom's name in Fraunces 18pt with the wonky axis on. Role in Manrope 600 small caps below. Three lines of contact info in JetBrains Mono 9pt: email, phone, and `thesherpapros.com`. A single sky-blue diagonal-cut block sits in the lower-right corner as the brand signature.

Card stock: 16 pt, soft-touch matte finish, cream paper (`#FBF7EE` or closest match Pantone). Spot-color print for the brand colors when possible.

### 8.5 Vehicle wrap (HJD trucks → Sherpa Pros work vehicles)

**Side panels:** primary wordmark large, occupying roughly the upper third of the door panel and extending forward onto the front fender. Tagline in Fraunces italic 200 pt below the wordmark, dark navy on cream-painted vehicle base.

**Rear panel:** `thesherpapros.com` in Manrope 700 condensed, 8-inch tall letters, sky blue. Phone number below in same style, half size.

**Hood:** clean. No wordmark, no tagline. The brand reads at a glance from the side; the hood is for the driver's sightline, not for marketing.

If the vehicle base is dark (black or dark navy), use the all-white reversed wordmark variant.

### 8.6 Pro branded gear (Phase 2 launch — Sherpa Hub merchandise)

Logo embroidery on hats, t-shirts, work jackets. Single-color brand variant (sky blue OR white reversed) for embroidery legibility — the diagonal seam in two colors does not stitch cleanly at small sizes.

- **Hats:** wordmark in white reversed, embroidered on dark navy hat front.
- **T-shirts:** wordmark in sky blue, screen-printed on cream-colored shirt body. (Avoid pure white shirts — too cold for the brand.) "Founding Pro" tag on left chest in Manrope 700 small caps.
- **Work jackets:** wordmark embroidered on right chest in white reversed. Founding Pro shield-style badge embroidered on left chest. HJD Builders attribution embroidered on inside neck label.

Vendor specifications, thread Pantone matches, and embroidery file types live in `docs/operations/brand-asset-prompts.md` (Sections 8 and 9 — Founding Pro badge and Old-House Verified badge prompts) and the eventual `docs/operations/sherpa-hub-merch-spec.md` (to be written for Phase 2 Hub launch).

### 8.7 Print collateral (binders, one-pagers, decks)

The editorial print theme already shipped at `scripts/docs-pdf-editorial.css` is canonical for all PDF rendering. Cover-page composition (sky-blue rule above, amber diagonal below H1, page-one drop cap on the chapter opener) is the canonical binder cover.

For one-pagers: warm cream background, primary wordmark in the upper-left, single-column body in Manrope, pull quote in Fraunces italic, footer with `thesherpapros.com` in JetBrains Mono and a sky-blue rule above.

### 8.8 Slide presentations

The Marp editorial theme already shipped at `scripts/marp-themes/sherpa-pros-editorial.css` is canonical for all decks. Ten slide-class layouts are available:

- `lead` — hero / cover slide (dark navy paper with cream type, diagonal sky wedge upper-right, amber lower-third strip)
- `bignumber` — the signature slide. ONE number is the entire slide. Used for traction stats, headline numbers.
- `quote` — pull-quote slide with oversized opening glyph watermark
- `split` — left half visual, right half text (asymmetric 0.55/0.45)
- `contents` — chapter list / table of contents
- `divider` — section break with sky-blue diagonal corner accent
- `image` — full-bleed image with text overlay
- `compare` — two-column comparison (Sherpa Pros vs competitors)
- `timeline` — phase 0/1/2/3/4 horizontal timeline
- `metric` — investor metrics dashboard

Use the right class for the right job. Don't recreate a `.bignumber` slide as a regular content slide with a giant number.

### 8.9 Social media

See companion doc: `docs/operations/social-media-prompt-library.md` (Wave 8.2 — generated in parallel with this portfolio).

Key principles that apply to social regardless of platform:

- Founder voice leads. Phyrom's face outperforms the logo by 3–5× on every platform.
- Brand-consistent square avatar across LinkedIn, Twitter / X, Instagram, Facebook, TikTok, YouTube, Threads.
- Posts use the same color discipline as the rest of the brand: warm-cream backgrounds, dark-navy text, sky-blue accents, orange-red sparingly.
- Never Comic Sans-style "fun" overlays. Even on TikTok, the brand stays editorially considered.

---

## 9. Brand Hierarchy (for the 6-product portfolio)

Per `docs/operations/sherpa-product-portfolio.md`:

- **Sherpa Pros** is the umbrella brand. Always say "Sherpa Pros" when referring to the company.
- The six products in canonical order are: **Sherpa Marketplace · Sherpa Hub · Sherpa Home · Sherpa Success Manager · Sherpa Rewards · Sherpa Flex**. Always say "Sherpa [Product]" when referring to a specific one.
- **NEVER say** "the Sherpa Pros app" — which app? Always specify the product. This is the most common naming violation now that the portfolio has expanded from one product to six.
- **NEVER say** "Flex" alone or "the Flex tier" alone in external surfaces — always **Sherpa Flex** or **the Sherpa Flex tier**.
- **Sherpa Rewards** (capitalized, as a program name) refers to the loyalty program. Lowercase "rewards" refers to individual catalog items the pro can redeem. Don't blur the two.
- Visual treatment: each product can have its own sub-icon (per Wave 6.4 brand-asset prompts in `docs/operations/brand-asset-prompts.md` §7), all derived from the canonical wordmark and icon family. The six product icons share a single visual grammar so they read as a family.

The umbrella voice is one founder, one tone, one set of always-say words. Product voices specialize within that:

- **Sherpa Marketplace** voice: transactional + urgent. "Match in 30 minutes. Pre-priced. Confirmed."
- **Sherpa Hub** voice: pro-to-pro, gritty, equipment-and-supplies tone. "Pick up the kit. Rent the saw. Earn the cert."
- **Sherpa Home** voice: warm + savings-focused. "Membership that pays for itself. Faster pros. Five percent off every job."
- **Sherpa Success Manager** voice: enterprise + trust + relationship. "A real person owns your account. Not a chatbot. Not a portal."
- **Sherpa Rewards** voice: pro-to-pro, plainspoken, payoff-focused. "Every job earns points. Real points, real money. The things working pros actually want."
- **Sherpa Flex** voice: matter-of-fact, on-ramp-focused. "For skilled tradespeople who do work on the side. No LLC required. Insurance built in." (Use "side-hustle" — it's the contractor-credible word. Never "gig" or "task.")

The umbrella brand voice is what unifies them. The product voices specialize within it. Never let the product voices contradict the umbrella voice (no "AI-powered Hub experience," no "disrupt-the-PM-software Sherpa Success Manager service," no "gig economy" framing for Sherpa Flex).

### 9.1 Platform Capability Layer (shipped 2026-04-25)

Underneath the six products are **eight** platform-level capabilities — features that span every product, not standalone products themselves. They have locked names, locked colors, and locked usage rules so that Brand Guardian audits treat them with the same care as the six products. The first three (Sherpa Threads, Sherpa Smart Scan, Sherpa Mobile) shipped in earlier waves; the five additions below shipped in the 2026-04-25 wave (Sherpa Guard, Sherpa Flex Landing, Sherpa Splash, Sherpa Dispatch, Sherpa Materials). Total brand surface count: **6 products + 8 platform capabilities = 14 brand surfaces** under the Sherpa Pros umbrella.

- **Sherpa Threads** — the in-app chat surface that bridges to Short Message Service (SMS) via Twilio. Always **Sherpa Threads**, never "the chat," never "messages," never "the messaging feature." The "Sherpa" prefix is non-negotiable here because **"Threads" alone is a Meta product** (the social network) — dropping the prefix invites brand confusion. Color: **sky blue (#00A9E0)** to match the SHERPA block in the wordmark — Threads is *connection*, sky blue is *connection*. Marketing line: *"Work-order-attached messaging that bridges to text. Both parties stay on-platform without forcing the client to install anything."*
- **Sherpa Smart Scan** — the Optical Character Recognition (OCR) surface for receipts, invoices, permits, blueprints, and job-site photos. Always **Sherpa Smart Scan**, never "the scanner," never "OCR," never "the AI scanner." OCR is the underlying tech, never the headline. Color: **orange-red (#FF4500)** to match the PROS block — Smart Scan is *action*, orange-red is *action / capture*. Marketing line: *"Snap a receipt, snap a permit, snap a blueprint — Sherpa Smart Scan reads it, files it, and tags it for tax."*
- **Sherpa Mobile** — the native iOS + Android app shell. Always **Sherpa Mobile** when the conversation is about the native-app surface across products. Bundle ID `com.thesherpapros.app`. Currently in **TestFlight beta** (iOS) — say "in TestFlight beta" in marketing copy through Phase 0; drop the qualifier once it ships to the App Store. Android via Expo. Color treatment for app screenshots, mockups, and store-listing assets: **warm cream paper (#FBF7EE)** background — matches the editorial system, reads designed and intentional rather than default-browser. Marketing line: *"Sherpa Marketplace and Sherpa Home in your pocket. Native iOS and Android. In TestFlight beta now."*
- **Sherpa Guard** — Role-Based Access Control (RBAC) middleware + audit logs. Always **Sherpa Guard**, never "the middleware," never "RBAC layer," never "the security feature." The "Sherpa" prefix is non-negotiable. Color: **emerald (#10b981)** for trust + security — already a brand-system color (Brand Pros checked: emerald is in the supporting palette per §3.2 and is the existing trust signal in tier badges + the Sherpa Score Gold-tier ribbon). Marketing line: *"Every action logged. Every role enforced. Service Organization Control 2 (SOC 2) audit trail built in."*
- **Sherpa Flex Landing** — the `/flex` route and the side-hustle acquisition funnel. Always **Sherpa Flex Landing** when discussing the landing page itself; the underlying tier remains **Sherpa Flex** per §9 product-list naming rules. Color: **orange-red (#FF4500)** to match the PROS block — Flex Landing is *action / on-ramp*, orange-red is *action*. (Same color as Sherpa Smart Scan because both are activation-focused surfaces; Brand Guardian disambiguates by surface context — Smart Scan is a feature inside the app, Flex Landing is a marketing landing page.) Marketing line: *"Do work on the side? We've got you covered. No LLC required. Insurance built in."*
- **Sherpa Splash** — the public capability showcase on the splash page. Always **Sherpa Splash** when discussing the public marketing front door; the splash page itself can be called "the splash page" in casual copy but **Sherpa Splash** is the locked Brand Guardian name for the showcase surface. Color: **dark navy (#1a1a2e)** — editorial gravity, matches the print + slide editorial system, signals "this is the front door" rather than "this is the app." Marketing line: *"Everything Sherpa Pros does, in one place. Code-verified quotes, multi-trade dispatch, materials orchestration, escrow, 37 trades."*
- **Sherpa Dispatch** — multi-trade coordination + timeline. Always **Sherpa Dispatch**, never "the timeline," never "the coordination feature," never "the orchestration layer." The "Sherpa" prefix is non-negotiable. Color: **sky blue (#00A9E0)** to match the SHERPA block — Dispatch is *coordination*, and coordination is the connective tissue between trades, so the connection-blue from Threads carries forward. (Same color as Sherpa Threads; Brand Guardian disambiguates by surface — Threads is messaging, Dispatch is timeline. Both belong to the "connection" color story.) Marketing line: *"Multi-trade jobs, one timeline. Demo to plumbing to electrical to drywall — handed off automatically."*
- **Sherpa Materials** — Wiseman Materials + Zinc + Uber Direct stack. **Internal name "Wiseman Materials" — never expose externally.** Customer-facing always **Sherpa Materials engine** (canonical; lifts to Sherpa Materials short-form after first reference). Brand Guardian default: **Sherpa Materials engine**. Never "internal materials engine," never "the Zinc integration," never "Uber for materials" externally. Color: **warm cream paper (#FBF7EE)** — matches Sherpa Mobile's screenshot treatment because both surfaces are about *intentional design* — Materials is the receipt + invoice + delivery-slip surface, and the cream-paper color reads "real document" rather than "spreadsheet row." Marketing line: *"Materials list, ordered, delivered to the job site. Same day. Pro and client approve before checkout. No supply-house run."*

> **CALLOUT — EXTERNAL NAMING RULE (LOCKED, REINFORCED 2026-04-26):**
>
> External-facing copy uses **"Sherpa Materials engine"** as the canonical first reference. Acceptable short-form variants after first mention: "the Materials engine," "Sherpa Pros' materials coordination layer," "the materials surface."
>
> Internal/code references: "Wiseman Materials" is acceptable inside repos, commit messages, internal architecture docs, engineering Slack, and SQL/migration files.
>
> **Never expose "Wiseman" to clients, partners, or investors.** This includes screenshots in decks, hover-text in mockups, error messages surfaced to users, URLs, email subjects, and press releases. If a "Wiseman" reference leaks into external copy, file it as a P0 issue and fix before next public touch. Brand Guardian audits this on every external send.

**Naming-conflict flags (resolved):**
- The word **"Threads" alone** refers to **Meta's social network** elsewhere in this portfolio (§2.2 social-avatar usage list, §8.9 social-media presence list — both correct uses of Meta Threads). To prevent any confusion when the same document discusses both **Sherpa Threads** (our product capability) and **Threads** (Meta's social network), the rule is: always use the **full "Sherpa Threads" name** for our capability, and always reserve the bare word **"Threads"** for the Meta social network. Brand Guardian audits this on every external send.
- The word **"Guard" alone** has commercial-security industry overlap (e.g., Allied Universal Guard) and consumer-software overlap (e.g., Norton Security Guard). Always **Sherpa Guard** in copy — never bare "Guard" — to keep the marketplace context clear and avoid implying a physical-security service.
- The word **"Dispatch" alone** is generic operations vocabulary (911 dispatch, taxi dispatch, freight dispatch). Always **Sherpa Dispatch** in copy — never bare "Dispatch" — to keep the multi-trade-coordination meaning specific to Sherpa Pros.
- The word **"Materials" alone** is generic procurement vocabulary. Always **Sherpa Materials** (or, in an existing-product surface, **Smart Materials**) in copy — never bare "Materials" outside an internal engineering context.
- The word **"Splash" alone** is generic web-marketing vocabulary (any landing page is "a splash page"). Always **Sherpa Splash** when referring to *our* public capability showcase — the team can still call any landing page in general "a splash page," but **Sherpa Splash** is the locked surface name for our showcase.
- The phrase **"Flex Landing" alone** could be read as a feature inside an unrelated product. Always **Sherpa Flex Landing** for the funnel; the underlying tier is always **Sherpa Flex**.

The rule across all six naming flags: **always use the "Sherpa" prefix in customer-facing copy**, no exceptions.

**Capability-layer voice rules.** All eight capabilities inherit the umbrella voice (plainspoken, founder-anchored, 8th-grade reading level). Capability voices are **modifiers** to product voices, not standalone voices: when Sherpa Marketplace promotes a job match in Sherpa Threads, the voice is Marketplace's (transactional + urgent), with Threads as the surface, not the speaker. Same for Smart Scan inside Sherpa Hub (the voice stays pro-to-pro / equipment-and-supplies; Smart Scan is the verb). Same for Sherpa Dispatch inside Sherpa Marketplace (the voice stays transactional + urgent; Dispatch is the timeline that makes the urgency credible). Same for Sherpa Materials inside Sherpa Hub (the voice stays pro-to-pro; Materials is the noun for the parts list). **Sherpa Guard** is the one exception that almost has its own voice — compliance + trust language sits a half-shade more formal than the rest of the brand — but Brand Guardian still rejects "Sherpa Guard delivers enterprise-grade security" type slop in favor of "Every action gets logged. Every role gets enforced." Never invent a "Threads voice," "Smart Scan voice," "Guard voice," "Dispatch voice," or "Materials voice" as a standalone — they enable, they don't speak.

**Status-disclosure rules** (avoid investor / customer over-promising):
- Sherpa Threads is **LIVE** — describe in present tense.
- Sherpa Smart Scan is **LIVE** — describe in present tense.
- Sherpa Mobile is **in TestFlight beta on iOS, Expo build on Android** — always disclose the beta status until App Store / Play Store launch. Never say "available in the App Store" before that day. Investor decks: "Sherpa Mobile in TestFlight beta — App Store launch Phase 1." Customer marketing: "Sherpa Mobile — invite-only beta, full launch coming."
- Sherpa Guard is **LIVE** — describe in present tense ("every action logged, every role enforced"). Service Organization Control 2 (SOC 2) certification itself is **not yet earned** — never say "SOC 2 certified" until the certification is in hand. Until then, the lock-up is "SOC 2 audit-trail control satisfied" or "SOC 2-ready architecture" — both true, neither overpromising.
- Sherpa Flex Landing is **LIVE** at `/flex` — describe in present tense.
- Sherpa Splash is **LIVE** on the splash page — describe in present tense.
- Sherpa Dispatch is **LIVE** for multi-trade jobs — describe in present tense. Single-trade jobs run the existing Marketplace match flow (no Dispatch timeline shown).
- Sherpa Materials is **LIVE** — describe in present tense. The Zinc API and Uber Direct integrations are **active** but volume is still ramping; investor decks can disclose "Sherpa Materials live in beta volume" as a Phase 0 traction milestone if the customer-facing copy stays simple ("approve, order, delivered same-day").

---

## 10. Asset Library Reference

| Asset | Where it lives | When to use |
|---|---|---|
| Primary wordmark (master, Phyrom's archive) | `~/Library/Mobile Documents/com~apple~CloudDocs/Cranston Holdings DBA North Forge Construction/HJD Company/Marketing/Logos/Sherpa Pros/Sherpa Pros New.png` | Source-of-truth — never edit directly |
| Primary wordmark (project copy, REQUIRED — see §11 ambiguity) | `public/brand/sherpa-pros-wordmark.png` (copy from master) | All horizontal applications shipped from this repo |
| App icon master (Phyrom's archive) | `~/Library/Mobile Documents/com~apple~CloudDocs/Cranston Holdings DBA North Forge Construction/HJD Company/Marketing/Logos/Sherpa Pros/Sherpa Pros Icon.png` | Source-of-truth — never edit directly |
| App icon (project copy, in repo) | `public/brand/sherpa-pros-icon-1024.png` | Square applications |
| Favicon | `public/favicon.ico` | Browser tabs |
| iOS app icon set | `public/icons/icon-{16,32,48,72,...,1024}x{}.png` | Native app + PWA |
| Apple touch icon | `public/apple-touch-icon.png` | iOS home screen |
| Generic logo (legacy) | `public/logo.png` | Audit and confirm: replace or remove |
| **Sherpa Score + Sherpa Flex tier badges** *(needs to be populated)* | `public/badges/` (Gold / Silver / Bronze Sherpa Score badges + Sherpa Flex tier badge + Founding Pro badge) | Pro profile cards, score-detail page, marketplace listings, recruit collateral, Sherpa Rewards Gold-Exclusive lock visuals |
| PWA manifest | `public/manifest.json` | PWA configuration (icon references) |
| Marp editorial slide theme | `scripts/marp-themes/sherpa-pros-editorial.css` | Every slide deck. Includes 10 layout classes. |
| Print editorial PDF theme | `scripts/docs-pdf-editorial.css` | Every PDF rendered from markdown |
| Brand bible deck (internal teaching) | `docs/slides/06-brand-bible.md` | Internal training, contractor onboarding, AI-agent priming |
| **This portfolio (THE source-of-truth)** | `docs/operations/brand-portfolio.md` | Reference before any external work. Update on every brand decision. |
| Brand audit (Brand Guardian findings) | `docs/pitch/brand-audit.md` | Read before fixing any artifact found in violation |
| Product portfolio architecture | `docs/operations/sherpa-product-portfolio.md` | Reference before working on any specific product |
| Brand asset prompts (Ideogram) | `docs/operations/brand-asset-prompts.md` | Generating new icons, badges, hero images |
| Social media prompt library (Wave 8.2) | `docs/operations/social-media-prompt-library.md` | Generating social assets |
| GTM master spec | `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` | Brand voice §3 is the canonical bible |
| Sherpa Hub design spec | `docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md` | Hub product brand specifics |
| Sherpa Home design spec | `docs/operations/sherpa-home-subscription.md` | Home product brand specifics |

### 10.1 Asset workflow

1. Before generating any new visual asset, check if it already exists in the library above.
2. If it doesn't, use the relevant Ideogram prompt from `docs/operations/brand-asset-prompts.md`.
3. Generate at 2× target resolution and downscale in Preview / Pixelmator for sharper edges.
4. Save the prompt and the chosen variant to `docs/operations/brand-asset-prompts.md` (§7 product icons or §8/§9 badges) so future generations stay consistent.
5. Run the new asset through the Brand Guardian agent for a visual-consistency audit before using it externally.
6. Add it to this portfolio's §10 table once approved.

---

## 11. Versioning & Maintenance

- This document is **v1.0 · 2026-04-25**.
- Update whenever the brand bible (`docs/slides/06-brand-bible.md`) adds a new rule.
- Update whenever the GTM spec §3 is revised.
- Major version bumps when the product portfolio changes (a fifth product is added, a product is sunset, the umbrella brand is renamed).
- Minor version bumps when typography, color, or photography rules change.
- Patch version bumps for clarifications, examples, or asset-library updates that do not change brand law.
- Brand Guardian agent reviews this document quarterly and after every major external send (investor close, press release, app-store launch).

### 11.1 Source-of-truth chain

When two documents disagree, the higher-precedence document wins:

1. `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` §3 — the canonical brand spec, owner Phyrom.
2. `docs/operations/brand-portfolio.md` (this document) — the canonical brand portfolio, owner Phyrom + Brand Guardian.
3. `docs/slides/06-brand-bible.md` — the internal teaching deck, derived from the above.
4. `docs/operations/brand-asset-prompts.md` — the asset generation library, derived from the above.
5. All other materials — derived from the above.

When you find a conflict, fix the lower-precedence document to match the higher-precedence one — never the reverse, unless Phyrom explicitly approves a brand revision (which then propagates upward to spec §3 first, then down through everything else).

### 11.2 Open ambiguities at v1.0 (flagged for resolution)

- **Wordmark color secondary value: orange-red vs amber.** The canonical wordmark Phyrom shared uses orange-red (`#FF4500`) for the PROS block. The currently-shipped editorial themes (`scripts/marp-themes/sherpa-pros-editorial.css` and `scripts/docs-pdf-editorial.css`) and the existing brand bible deck use amber (`#F59E0B`) as the secondary brand color. This portfolio treats orange-red as the canonical wordmark color and reserves amber as a secondary editorial-theme accent (used in print-theme amber underlines, the lower-third strip on cover slides, and rule callouts). **Decision needed:** Phyrom should confirm whether (a) orange-red is canonical and the editorial themes need an update to swap amber for orange-red across the supporting design, or (b) amber stays as the print-and-deck secondary while orange-red lives only in the wordmark itself. This portfolio assumes (b) until Phyrom rules.
- **Wordmark master file lives in iCloud, not the repo.** The primary wordmark master is in Phyrom's iCloud Drive, not in the project repository. **Recommendation:** copy the master to `public/brand/sherpa-pros-wordmark.png` (and a `sherpa-pros-wordmark.svg` if a vector source is available) before the next deployment so production builds don't depend on iCloud being mounted.
- **Sherpa Success Manager human-role title.** The product name is **Sherpa Success Manager** (locked 2026-04-25 per backend deployment commit `6097f83`). The role title for the dedicated human staffing the product (Account Manager vs Success Manager vs simply "your Sherpa Manager") is still being decided. This portfolio uses "Sherpa Success Manager" as the product name and leaves the human-role title TBD.
- **Email canonical alias.** Brand audit P0-4 flagged that two email aliases appear in shipped materials (`phyrom@thesherpapros.com` and `poum@hjd.builders`). Phyrom needs to lock one as canonical for investor-facing materials and use it everywhere. This portfolio uses `poum@hjd.builders` in the §8.3 example signature per the CLAUDE.md project memory, but Phyrom should confirm.
- **Domain canonical form.** `www.thesherpapros.com` vs `thesherpapros.com`. Spec §3.4 confirms `https://www.thesherpapros.com/` as canonical. This portfolio honors that. Update CLAUDE.md to drop the `sherpa-pros-platform.vercel.app` reference (deprecated as of 2026-04-24).
- **~~Sherpa Flex naming~~** — **CLOSED 2026-04-25.** "Sherpa Flex" is locked as the canonical name for the 5th pro tier (18% fee, per-project insurance included, no LLC required, jobs <$5K only). Always use "Sherpa Flex" or "Sherpa Flex tier" in external surfaces — never "Flex" alone, never "the Flex tier" alone. Live page: `/pro/flex`. Position the 18% fee as a *feature, not a bug* — when you factor in the cost of carrying personal general-liability insurance (the alternative on Standard tier), the 6% premium over Standard is *less than* what the pro would pay out-of-pocket for their own policy. The headline is **"insurance included,"** not "higher fee."
- **Sherpa Rewards visual treatment** *(NEW — flagged for resolution).* Sherpa Rewards shipped LIVE 2026-04-25 (`/pro/rewards`) but the visual identity is still using stock heroicons and Tailwind palette tokens. Needed: (1) **branded gift-category icons** for the 5 catalog categories (apparel, tools, gift cards, personal items, experiences) that share the diagonal-cut visual grammar of the Sherpa Pros wordmark; (2) **point-value display** treatment that pairs cleanly with the Manrope numeric scale used in score / earnings dashboards; (3) **Gold-Exclusive lock badge** that uses amber (`#F59E0B`) plus the Sherpa Score Gold tier visual cue without competing with the wordmark's orange-red; (4) **redemption-success modal animation** — quiet, contractor-credible (no confetti, no "you're a winner!" copy — match the plainspoken founder voice). Brand Guardian to spec these with Phyrom approval before any non-Phyrom designer touches the page.
- **Sherpa Flex page color audit** *(NEW — flagged for resolution).* The shipped `/pro/flex` page uses **violet** (`violet-50`, `violet-100`, `violet-600` Tailwind tokens) as the dominant tier color. Violet is **not** in the canonical Sherpa Pros palette (sky blue `#00A9E0`, orange-red `#FF4500`, amber `#F59E0B`, dark navy `#1A1A2E`). Decision needed: should Sherpa Flex pick up an existing brand color (likely sky blue, since amber is reserved for Gold-tier and orange-red for the wordmark / urgency states) or should the brand palette officially expand to add a fifth tier-color for Sherpa Flex? Brand Guardian to recommend before Phase 1 marketing assets are produced.

---

## Brand bible compliance (this portfolio doc itself)

This document is written to its own rules:

- **Plainspoken, founder-voiced, 8th-grade reading level.** No jargon, no abbreviations on first use, no "leverages" or "ecosystem" or "next-generation."
- **Always say:** Licensed · Verified · Code-aware · Built by a contractor · Local · Jobs, not leads · National.
- **Never say:** Wiseman externally · Gig / Task · "Uber for X" externally · "AI-powered" as headline · Disrupt · Revolutionize. (The audit findings in §11 reference "Wiseman" as an internal name being audited out of external materials — this is acceptable because the discussion is itself the audit; the term does not appear as a brand claim.)
- **Phyrom's surname UNKNOWN** — used "Phyrom" only throughout.
- **Domain:** `https://www.thesherpapros.com/` — used the canonical form everywhere external.
- **Founder voice leads** in the Brand Story (§1), the application briefs (§8), and the example email signature.

---

**End of brand portfolio · v1.0 · 2026-04-25**

For revisions, propose edits to this document via pull request. Coordinate with Phyrom on any change to color, type, voice, or naming rules. Brand Guardian agent runs the final audit before merging.
