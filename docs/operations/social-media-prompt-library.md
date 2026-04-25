# Sherpa Pros Social Media Prompt Library

**v1.0 · 2026-04-25 · For Ideogram.ai (paste-ready)**

**Owner:** Phyrom
**Coordinator:** Wave 8 — Marketing/Brand parallel build
**Pairs with:**
- `docs/operations/brand-asset-prompts.md` (icon family — extends, does not duplicate)
- `docs/marketing/social-content-plan.md` (30-day calendar, Day 1–30)
- `docs/marketing/linkedin-editorial.md` (39-post LinkedIn editorial)
- `docs/operations/brand-portfolio.md` (Wave 8.1 in flight — sibling doc being written in parallel)
- `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` §3 (positioning + brand voice)

---

## How to use this doc

**Universal Ideogram settings (lock for ALL generations):**
- **Style:** Design
- **Magic Prompt:** OFF
- **Speed:** Default or Slow
- **Model:** v3 (or latest)
- **Character reference:** upload `/Users/poum/sherpa-pros-platform/public/brand/sherpa-pros-icon-1024.png` for ALL prompts. This locks brand color discipline + visual family consistency across the library.
- **Aspect Ratio:** per-prompt (specified in each section)

**Brand wordmark logo (canonical reference for any prompt that includes the wordmark):**
- Path: `/Users/poum/Library/Mobile Documents/com~apple~CloudDocs/Cranston Holdings DBA North Forge Construction/HJD Company/Marketing/Logos/Sherpa Pros/Sherpa Pros New.png`
- Visual description: two horizontal blocks. LEFT sky blue (#00A9E0) "SHERPA" in bold white condensed sans-serif. RIGHT orange-red (#FF4500) "PROS" in same white type. Diagonal seam between them slants from upper-right to lower-left at ~70°.

**Locked brand color hex values (use exactly — never substitute):**
- Sky blue `#00A9E0` — primary brand identifier
- Orange-red `#FF4500` — accent + CTAs only (sparingly)
- White `#FFFFFF`
- Dark navy `#1A1A2E` — body text + dark surfaces
- Warm cream `#FBF7EE` — primary background for most surfaces

**Workflow (per asset):**
1. Open Ideogram, set Style to Design, Magic Prompt OFF, Model v3.
2. Upload Sherpa Pros icon as Character reference.
3. Paste the prompt below.
4. Set Aspect Ratio per the prompt header.
5. Generate 4 variants → pick the strongest → download at full resolution.
6. Open in Canva or Figma to add the Sherpa Pros wordmark overlay, burned-in captions, or other text per the asset's caption-overlay strategy.
7. Schedule in Metricool. Save the source PNG to `public/social/`.

**Anti-drift reminder:** Ideogram occasionally drifts to teal, purple, or generic blues. If any generation drifts off-palette, append this sentence to the prompt: *"Use ONLY these five colors: #00A9E0, #FF4500, #FFFFFF, #1A1A2E, #FBF7EE. No other colors."*

---

## SECTION 1 — LinkedIn

LinkedIn drives the founder-led thought-leadership track per `social-content-plan.md` §1.1. All LinkedIn assets live on **Phyrom personal account**, not a Sherpa Pros brand page.

### 1A. LinkedIn Personal Profile Banner (Phyrom's account, 1584×396 px, 4:1 ratio)

This is the highest-leverage single asset in the library — every investor, beta pro, and journalist who clicks through to Phyrom's profile sees it first.

```
A documentary-style 35mm film photograph of a working New Hampshire general contractor on a residential framing jobsite, shot landscape format, ultra-wide 4:1 aspect ratio. Composition: shoulders-down view of a tradesperson in a faded flannel and worn leather tool belt walking through visible 2x4 wall framing toward a partially-finished window opening on the right side of the frame. The LEFT 25% of the canvas is intentionally near-empty — a soft out-of-focus stretch of subfloor and stud wall — leaving room for a circular profile photo overlay. Natural late-afternoon light streaming in from the right, golden-hour warmth, slight haze, fine film grain. Color palette: muted warm cream tones #FBF7EE in the wood and natural light, dark navy #1A1A2E shadows in the framing cavities, a single quiet accent of sky blue #00A9E0 (a tape measure clipped to the belt or a chalk-line reel). NO orange-red in the photo itself — reserve that for any text overlay added later in Canva. NO face visible. NO high-vis vest. NO smiling-construction-worker stock-photo energy. Documentary realism — Magnum Photos meets construction trade. The mood: a working contractor walking onto a jobsite to start the day, building something national from a New Hampshire stud wall.
```

- **Aspect Ratio:** 4:1 (1584×396 px)
- **Style:** Design (with photographic descriptors in prompt)
- **Character reference:** upload Sherpa Pros icon
- **Caption overlay (add in Canva):** Top-right corner, white Fraunces serif italic, ~32pt: *"Building Sherpa Pros — the licensed-trade marketplace that thinks like a contractor."* Sub-line below in Manrope 18pt: *"Phyrom · HJD Builders LLC · NH"*
- **Asset placement:** LinkedIn personal profile background (Phyrom)
- **Refresh cadence:** every 60 days, or after every Wefunder milestone announcement

### 1B. LinkedIn Company Page Banner (Sherpa Pros brand page, 1128×191 px, ~5.9:1 ratio)

```
A clean editorial brand banner for Sherpa Pros, 1128 by 191 pixels, ultra-wide 5.9:1 landscape format. Composition: warm cream #FBF7EE background fills the full canvas. A bold diagonal seam slashes across the canvas from upper-right to lower-left at approximately 70 degrees, dividing the canvas into two slightly unequal blocks — the LEFT block (about 65% of the canvas) is solid sky blue #00A9E0; the RIGHT block (about 35% of the canvas) is solid orange-red #FF4500. Inside the LEFT sky-blue block, on the left edge with generous padding, is a stylized line-art icon of a contractor's framing square in white at about 80px tall. Inside the RIGHT orange-red block, vertical centered, is a small white star/burst at about 60px. The MIDDLE-CENTER of the canvas, where the diagonal seam crosses, is intentionally clean — leave 600px of horizontal negative space here for company-name and tagline overlay added later in Canva. Flat design, no gradients, no shadows, no glossy effects, no photographic elements. The mood: confident, tradesperson-credible, unmistakably Sherpa Pros at first glance.
```

- **Aspect Ratio:** custom 1128×191 (use 6:1 in Ideogram, crop in Canva)
- **Caption overlay:** Center, white Fraunces serif 64pt: *"Sherpa Pros"* — sub-line Manrope 22pt: *"Licensed · Verified · Code-aware. Jobs, not leads."*
- **Asset placement:** Sherpa Pros LinkedIn company page

### 1C. LinkedIn Post Visual Templates (1200×627 px, 1.91:1)

Six templates pair to the six recurring LinkedIn editorial themes from `linkedin-editorial.md`. Each template is paste-ready as a backdrop; Phyrom adds the headline copy in Canva using the per-post hook from the editorial.

#### 1C.1 — "Jobs, Not Leads" hook (founder-rant theme)

Pairs with: Wk 1 Mon · Wk 4 Mon · Wk 5 Mon · Wk 7 Mon · Wk 9 Mon · Wk 10 Mon · Wk 12 Mon · Wk 13 Mon (any "Jobs, not leads" post in the editorial).

```
A bold editorial post template for a LinkedIn founder-voice post, 1200 by 627 pixels, landscape 1.91:1. Composition: warm cream #FBF7EE background fills the canvas. A solid sky blue #00A9E0 vertical bar runs down the LEFT edge, 80 pixels wide, full height. The RIGHT 90% of the canvas is intentionally empty cream — leave clean negative space for headline copy added later in Canva (the headline will be a quote-style line like "I just paid $87 for a lead that ghosted me"). In the LOWER-RIGHT corner, with 40px padding from both edges, place a small dark navy #1A1A2E line-art icon of a torn paper receipt at about 80px tall. In the LOWER-LEFT corner of the canvas (overlapping the blue bar), place a small white circular badge at about 60px diameter containing the letters "S P" in dark navy bold sans-serif (this is the Sherpa Pros mark). Flat editorial design, no gradients, no shadows, no photographic elements. The mood: serious, founder-voiced, plainspoken — a contractor's notebook page, not a tech-startup ad.
```

- **Caption overlay (Canva):** large Fraunces serif headline 56pt dark navy, dropped into the right-90% empty space. Sub-line in Manrope 20pt slate.
- **When to use:** Mon LinkedIn editorial slots flagged "Jobs, not leads."

#### 1C.2 — MA Labor Shortage stat (data-viz friendly)

Pairs with: Wk 2 Mon · Wk 7 Wed (labor-shortage posts).

```
A clean editorial stat-graphic template for a LinkedIn data post, 1200 by 627 pixels, landscape. Composition: solid dark navy #1A1A2E background fills the entire canvas. CENTERED horizontally and vertically: a single oversized number "2.5%" rendered in bold white condensed sans-serif at approximately 320pt — large enough to dominate the canvas. Directly BELOW the number, in much smaller white Manrope sans-serif at 28pt, the words "Massachusetts construction unemployment" with the line "Lowest in 17 years" beneath in slate gray. To the RIGHT of the number, a small vertical bar chart in sky blue #00A9E0 — three bars at varying heights with no labels (purely decorative data-viz texture). In the LOWER-RIGHT corner with 32px padding, the words "via WBJournal" in slate 14pt italic. In the UPPER-LEFT corner with 32px padding, a small "Sherpa Pros" wordmark in white 18pt sans-serif (the small mark, not the full logo). Flat editorial design, no gradients, no shadows, no glow effects. The mood: serious, sourced, journalistic — like a New York Times opinion-page graphic.
```

- **Caption overlay:** the "2.5%" placeholder is generated as part of the image — for any other stat (e.g., "30%" for over-55 workforce), regenerate by swapping the number in the prompt.
- **When to use:** any LinkedIn post citing a specific labor or industry statistic.

#### 1C.3 — Code-aware moment (abstract code-validation visual)

Pairs with: Wk 2 Wed · Wk 4 Wed · Wk 6 Wed · Wk 9 Wed · Wk 12 Wed (code-aware posts).

```
A clean editorial template visualizing real-time code validation for a LinkedIn build-in-public post, 1200 by 627 pixels, landscape. Composition: warm cream #FBF7EE background. CENTERED in the canvas, four small horizontal pill-shaped checklist rows stacked vertically with 24px gap between them — each pill is approximately 480px wide by 56px tall. Each pill has a small sky blue #00A9E0 outline circle on its LEFT containing a white checkmark, then a placeholder horizontal slate-gray bar where text would later be added in Canva (the bar represents a check item like "MA Electrical 2023" or "ISD permit triggered"). The TOPMOST pill has a small green dot before the checkmark indicating it just completed. To the RIGHT of the four-pill stack, a vertical timer ring in sky blue #00A9E0 with the number "18s" centered inside in dark navy bold sans-serif. In the UPPER-LEFT corner, a small dark navy "Sherpa Pros" wordmark at 18pt. Flat editorial design, no gradients, no shadows. The mood: a contractor watching the platform do four hours of paperwork in 18 seconds.
```

- **Caption overlay:** Canva text headline above the pills: *"4 code checks. 18 seconds."* — and label each pill with the actual check item from the post's body.
- **When to use:** any LinkedIn post about code validation, permit assist, or rebate lookup.

#### 1C.4 — Beta Pro spotlight placeholder (Founding Pro feature)

Pairs with: Wk 3 Wed · Wk 5 Wed · Wk 8 Wed · Wk 10 Wed · Wk 12 Fri (Founding Pro spotlights). **Note:** for real Founding Pro spotlights, ALWAYS use a real photo of the pro with written permission. This template is the BACKDROP into which Phyrom drops the real photo in Canva.

```
A photo-frame template for a Founding Pro spotlight post, 1200 by 627 pixels, landscape. Composition: warm cream #FBF7EE background. The LEFT 50% of the canvas (600px wide) is a clean rectangular placeholder area in light slate gray with a subtle dashed dark-navy outline — this is where Phyrom will drop the real Founding Pro photo in Canva. The RIGHT 50% of the canvas is empty cream space for the pro's name, trade, and city to be typed in Canva. In the LOWER-LEFT corner of the right-50% empty area, place a small "FOUNDING PRO" badge — a horizontal pill in dark navy #1A1A2E containing the words "FOUNDING PRO" in white bold sans-serif 16pt with a small orange-red #FF4500 star to the left of the text. In the UPPER-RIGHT corner of the canvas, a small "Sherpa Pros" wordmark in dark navy 18pt. A thin sky blue #00A9E0 horizontal accent line, 4px tall, runs across the bottom edge of the canvas. Flat editorial design, no gradients, no shadows. The mood: a guild-patch yearbook entry — earned, not decorative.
```

- **Caption overlay:** drop the real photo into the left placeholder. Right side: name in Fraunces serif 48pt, trade + city in Manrope 22pt slate.
- **When to use:** every Founding Pro feature LinkedIn post.

#### 1C.5 — Mass Save / EV / Heat Pump education (informational visual)

Pairs with: Wk 3 Fri · Wk 11 Wed (utility rebate / EV / heat pump posts).

```
A clean editorial education template for a LinkedIn utility-rebate post, 1200 by 627 pixels, landscape. Composition: warm cream #FBF7EE background. LEFT 60% of the canvas: a stylized flat-illustration of a small residential house silhouette in dark navy #1A1A2E outline, with a sky blue #00A9E0 heat pump unit on the right side of the house and a small orange-red #FF4500 EV charger on the left. Above the house, a stylized sun/cloud composition in soft cream and slate gray. RIGHT 40% of the canvas: empty cream space for headline + dollar-amount overlay added later in Canva. In the LOWER-RIGHT corner with 32px padding, place a small "Mass Save · National Grid · Eversource" line of text in slate 12pt italic. In the UPPER-LEFT corner, a small "Sherpa Pros" wordmark in dark navy 18pt. Flat editorial design — Atlantic-magazine-feature illustration energy. No gradients, no glossy 3D, no realistic rendering. The mood: trustworthy public-service-announcement explainer.
```

- **Caption overlay:** large Fraunces serif headline in the right-40% space — e.g., *"$10,000 Mass Save heat pump rebate"* — sub-line Manrope 20pt slate.
- **When to use:** any LinkedIn post about utility rebates, EV chargers, heat pumps, or energy programs.

#### 1C.6 — Build-in-public / Wefunder progress (chart-friendly visual)

Pairs with: Wk 1 Wed · Wk 6 Fri · Wk 8 Mon · Wk 11 Fri · Wk 13 Wed (build-in-public + Wefunder + traction posts).

```
A clean editorial build-in-public template for a LinkedIn fundraise update, 1200 by 627 pixels, landscape. Composition: warm cream #FBF7EE background. CENTERED horizontally, an oversized stylized progress bar — 800px wide by 64px tall — with rounded ends. The LEFT 60% of the bar is filled in sky blue #00A9E0; the RIGHT 40% is empty light slate gray. Inside the filled portion, in white bold sans-serif 24pt centered, a placeholder text "60%" (Phyrom will edit this to match real progress in Canva). ABOVE the bar with 48px gap, empty cream space for headline overlay. BELOW the bar with 32px gap, three small placeholder stat callouts in horizontal row — each one is a small dark navy #1A1A2E square at 80x80px containing a placeholder number and label space (Phyrom adds real numbers like "$112K committed", "230 backers", "10 founding pros" in Canva). In the UPPER-LEFT corner, a small "Sherpa Pros" wordmark in dark navy 18pt. In the LOWER-RIGHT corner, a small "Wefunder · Building in public · Day NN" line in slate 12pt. Flat editorial design, no gradients, no glow. The mood: founder showing receipts, not a glossy investor-pitch deck.
```

- **Caption overlay:** large Fraunces headline above the bar — e.g., *"Day 60. Here are the receipts."* — and update the three stat callouts with real numbers.
- **When to use:** every Wefunder progress update, every "what we shipped this week" Friday post, every milestone announcement.

### 1D. LinkedIn Carousel Templates (1080×1080 px each slide)

LinkedIn carousels (PDF format) get 1.5–3× the reach of single-image posts per `linkedin-editorial.md`. Generate ALL slides of a carousel in a single Ideogram session so the family resemblance holds.

#### 1D.1 — 5-slide "Hiring a contractor in 2026" homeowner carousel

Pairs with: a homeowner-side carousel slot the editorial doesn't yet have but will recur quarterly. Pair to Wk 4 Fri "What makes a good contractor" slot or generate fresh.

**Slide 1 (HOOK):**
```
LinkedIn carousel hero slide, 1080 by 1080 pixels square. Solid warm cream #FBF7EE background. CENTERED: large Fraunces serif headline in dark navy #1A1A2E reading "Hiring a contractor in 2026" rendered as part of the image at approximately 96pt, bold weight. BELOW the headline with 48px gap, a smaller line in Manrope sans-serif 28pt slate gray reading "4 things every homeowner should check first." In the LOWER-LEFT corner with 32px padding, a small sky blue #00A9E0 arrow icon pointing right at 48px. In the UPPER-RIGHT corner, a small "Sherpa Pros" wordmark in dark navy 18pt. A thin orange-red #FF4500 horizontal accent line, 4px tall, runs across the bottom edge of the canvas. Flat editorial design, no gradients, no photographic elements.
```

**Slide 2 (CHECK 1):**
```
LinkedIn carousel content slide, 1080 by 1080 pixels square. Solid warm cream #FBF7EE background. UPPER-LEFT with 64px padding: a large numeral "01" in sky blue #00A9E0 outlined Fraunces serif at 240pt. BELOW the numeral with 32px gap, a placeholder dark navy #1A1A2E headline area (Canva will add: "License current and verifiable"). BELOW the headline, empty space for body copy added in Canva. CENTERED on the right side of the canvas, a small flat-design icon in dark navy #1A1A2E line-art at 200px tall depicting a state-license card / certificate. In the LOWER-RIGHT corner, the page number "2 / 5" in slate 14pt. In the UPPER-RIGHT corner, a small "Sherpa Pros" wordmark in dark navy 18pt. Same accent line pattern as Slide 1.
```

**Slides 3, 4 (CHECK 2, CHECK 3):** regenerate the Slide 2 prompt swapping the numeral and the icon. For Slide 3 ("02"): swap icon to a flat-design shield with a checkmark (insurance). For Slide 4 ("03"): swap icon to a flat-design contract document with signature line (written scope).

**Slide 5 (CTA / SHERPA PROS):**
```
LinkedIn carousel CTA slide, 1080 by 1080 pixels square. Solid sky blue #00A9E0 background fills the full canvas. CENTERED horizontally and vertically: a large Fraunces serif headline in white reading "Or just use Sherpa Pros." rendered at approximately 88pt bold. BELOW the headline with 32px gap, in white Manrope sans-serif 24pt: "We check all 4 by default. Comment 'PRO' below for the beta link." In the UPPER-RIGHT corner with 32px padding, the full Sherpa Pros wordmark mark in white at 64px tall — diagonal seam visible. In the LOWER-RIGHT corner, the URL "thesherpapros.com" in white Manrope 16pt. A small orange-red #FF4500 arrow icon pointing right at 48px in the LOWER-LEFT corner. Flat editorial design, no gradients, no glow.
```

#### 1D.2 — 5-slide "What's broken about Angi" comparison carousel

Pairs with: Wk 2 Fri · Wk 5 Mon · Wk 8 Fri (counter-positioning posts).

**Slide 1 (HOOK):**
```
LinkedIn carousel hero slide, 1080 by 1080 pixels square. Solid dark navy #1A1A2E background. CENTERED: large Fraunces serif headline in white reading "What's actually broken about Angi" at approximately 84pt bold. BELOW with 48px gap, smaller Manrope 24pt in slate gray: "5 slides. Then a different model." In the LOWER-LEFT corner, a small orange-red #FF4500 broken-chain icon at 64px. In the UPPER-RIGHT, a small "Sherpa Pros" wordmark in white 18pt. Thin sky blue #00A9E0 accent line, 4px tall, across the bottom.
```

**Slide 2 (THE LEAD-RESALE PROBLEM):**
```
LinkedIn carousel content slide, 1080 by 1080 pixels square. Warm cream #FBF7EE background. UPPER-LEFT: large numeral "01" in orange-red #FF4500 outlined Fraunces serif at 240pt. BELOW: empty space for headline (Canva: "The same lead is sold 4 times."). CENTERED on the right side, a flat-design icon: 4 small dark-navy contractor silhouettes facing the same lead document in the center, with sky-blue arrows pointing from each silhouette to the document. Page number "2 / 5" lower-right in slate 14pt. "Sherpa Pros" wordmark upper-right in dark navy 18pt.
```

**Slides 3, 4 (other Angi failures):** regenerate Slide 2 prompt swapping numeral and icon. Slide 3 ("02"): icon = a stopwatch with a red X over it (timed responses penalize good contractors). Slide 4 ("03"): icon = a phone with a ghost emoji bubble (lead never replies).

**Slide 5 (THE SHERPA PROS DIFFERENCE):**
```
LinkedIn carousel CTA slide, 1080 by 1080 pixels square. Solid sky blue #00A9E0 background. CENTERED: large Fraunces serif headline in white reading "Sherpa Pros: 1 lead. 1 pro. 1 job." at approximately 76pt bold. BELOW with 32px gap, in white Manrope 22pt: "5% take. Instant Stripe payout. Built by a contractor." UPPER-RIGHT: full Sherpa Pros wordmark in white at 64px tall. LOWER-RIGHT: "thesherpapros.com" in white Manrope 16pt. LOWER-LEFT: small orange-red #FF4500 arrow icon. Flat editorial design.
```

#### 1D.3 — 5-slide "How Sherpa Pros works" explainer carousel

Pairs with: a recurring quarterly explainer slot (good for cold audiences). Pair to Wk 6 Mon ("Two-sided marketplaces") or generate fresh.

**Slide 1 (HOOK):**
```
LinkedIn carousel hero slide, 1080 by 1080 pixels square. Warm cream #FBF7EE background. CENTERED: large Fraunces serif headline in dark navy #1A1A2E reading "How Sherpa Pros works" at 96pt bold. BELOW with 48px gap, Manrope 24pt slate: "5 slides. Then you'll know more than most contractors." LOWER-LEFT: a small flat-design icon in sky blue #00A9E0 of a stylized hand-shake at 80px. UPPER-RIGHT: small "Sherpa Pros" wordmark in dark navy 18pt. Thin sky blue accent line bottom edge.
```

**Slide 2 (HOMEOWNER POSTS):**
```
LinkedIn carousel content slide, 1080 by 1080 pixels square. Warm cream #FBF7EE background. UPPER-LEFT: numeral "01" in sky blue #00A9E0 outlined Fraunces serif at 240pt. CENTERED on the right side, a flat-design icon at 200px tall: a small house silhouette in dark navy #1A1A2E with a small sky-blue speech bubble emerging from its roof containing a wrench icon. Below the numeral, empty space for headline (Canva: "Homeowner posts a job."). Page number "2 / 5" lower-right slate. Wordmark upper-right.
```

**Slide 3 (CODE-AWARE MATCH):**
```
LinkedIn carousel content slide, 1080 by 1080 pixels square. Warm cream #FBF7EE background. UPPER-LEFT: numeral "02" in sky blue #00A9E0. CENTERED right: a flat-design icon at 200px tall showing four small horizontal pill checklist rows in sky blue with white checkmarks (echoing template 1C.3). Below numeral, empty headline space (Canva: "Sherpa Pros runs 4 code checks in 18 seconds."). Page number "3 / 5" lower-right. Wordmark upper-right.
```

**Slide 4 (PRO ACCEPTS):**
```
LinkedIn carousel content slide, 1080 by 1080 pixels square. Warm cream #FBF7EE background. UPPER-LEFT: numeral "03" in sky blue #00A9E0. CENTERED right: a flat-design icon at 200px tall: a small contractor silhouette in dark navy #1A1A2E with a small sky-blue thumbs-up next to it and a stylized job-card pinned to a clipboard in their hand. Below numeral, empty headline space (Canva: "One pro accepts. Confirmed in 30 minutes."). Page number "4 / 5" lower-right. Wordmark upper-right.
```

**Slide 5 (PAID + RATED):**
```
LinkedIn carousel CTA slide, 1080 by 1080 pixels square. Solid sky blue #00A9E0 background. CENTERED: large Fraunces serif headline in white reading "Job done. Pro paid. 5% to Sherpa Pros." at approximately 64pt bold. BELOW with 32px gap, in white Manrope 22pt: "Jobs, not leads. Comment WORKS for the beta link." UPPER-RIGHT: full Sherpa Pros wordmark in white at 64px tall. LOWER-RIGHT: "thesherpapros.com" in white Manrope 16pt. LOWER-LEFT: orange-red #FF4500 arrow icon at 48px.
```

---

## SECTION 2 — Instagram

Instagram drives visual-first brand presence per `social-content-plan.md` §1.2. Account: `@sherpapros` brand IG.

### 2A. Instagram Profile Avatar — REUSE

The Instagram avatar is already covered in `docs/operations/brand-asset-prompts.md` Section 4 (social avatar Style A or B). Use the SP monogram or single "S" with diagonal cut variant. **Do not generate a new avatar prompt here** — that file is canonical.

**Note:** the existing brand-asset-prompts §4 avatars use the OLD palette (#f59e0b amber). For consistency with the new wordmark + icon, swap "amber #f59e0b" to "orange-red #FF4500" when regenerating. All other prompt elements stay.

### 2B. Instagram Profile Highlights Cover Set (1080×1920 px, 5 covers)

Five highlight cover icons for the `@sherpapros` Instagram profile. Generate all five in a single Ideogram session so they form a unified set.

#### 2B.1 — ABOUT cover

```
A minimalist Instagram highlight cover icon, 1080 by 1920 pixels vertical 9:16. Solid sky blue #00A9E0 background fills the entire canvas. CENTERED both horizontally and vertically (with the visual element placed in the upper 60% of the canvas to account for the highlight thumbnail crop): a single white line-art icon at approximately 380px tall depicting a small stylized contractor's hard-hat in flat outline style, 4px stroke weight, no fill. BELOW the icon with 80px gap, the word "ABOUT" in white Manrope sans-serif bold uppercase at 64pt, letter-spacing 0.1em. No other elements. Flat design, no gradients, no shadows, no realistic rendering. The mood: a clean modern app-store style icon that scales down cleanly to the 75px highlight thumbnail circle.
```

#### 2B.2 — PROS cover

Same prompt as 2B.1, replace icon and label:
```
[same setup as 2B.1] ... CENTERED: a single white line-art icon at approximately 380px tall depicting two small stylized contractor silhouettes (head and shoulders only, side by side) in flat outline style. BELOW: the word "PROS" in white Manrope sans-serif bold uppercase at 64pt.
```

#### 2B.3 — JOBS cover

```
[same setup] ... CENTERED: a single white line-art icon at approximately 380px tall depicting a small stylized clipboard with a checkmark inside it. BELOW: the word "JOBS" in white Manrope sans-serif bold uppercase at 64pt.
```

#### 2B.4 — SPECIALTY cover (Boston specialty lanes)

```
[same setup] ... CENTERED: a single white line-art icon at approximately 380px tall depicting a small stylized old-house silhouette — Victorian peaked roof with a chimney and a single window. BELOW: the word "SPECIALTY" in white Manrope sans-serif bold uppercase at 56pt (smaller to fit the longer word).
```

#### 2B.5 — WEFUNDER cover

```
[same setup, but background switches to orange-red #FF4500 instead of sky blue — this single highlight is the CTA / urgency cover]. CENTERED: a single white line-art icon at approximately 380px tall depicting a small stylized rising-bar-chart with three bars ascending to the right. BELOW: the word "WEFUNDER" in white Manrope sans-serif bold uppercase at 56pt.
```

### 2C. Instagram Feed Post Templates (1080×1080 px square; or 1080×1350 px 4:5 portrait for max feed real estate)

Eight post templates aligned to the 30-day social content plan. Phyrom batch-generates these once and reuses across the calendar.

#### 2C.1 — Founder quote post (Phyrom voice)

Pairs with: Day 6 (founder voice), Day 13 (founder voice), Day 20 (founder voice), Day 27 (founder voice).

```
An Instagram feed post template for a founder quote post, 1080 by 1350 pixels portrait 4:5. Composition: solid warm cream #FBF7EE background. CENTERED both horizontally and vertically, a large empty quote area — leave the central 800px wide by 700px tall as clean negative space for a Fraunces serif quote line to be added in Canva. ABOVE the empty quote area with 64px padding, a large oversized opening quotation mark "" in sky blue #00A9E0 outlined Fraunces serif at 320pt. BELOW the empty quote area with 64px padding, an attribution line area (Canva: "— Phyrom · Founder, Sherpa Pros"). UPPER-LEFT corner with 48px padding: small "Sherpa Pros" wordmark in dark navy #1A1A2E at 22pt. LOWER-RIGHT corner with 48px padding: a small orange-red #FF4500 hand-drawn underline accent at 120px wide, 4px tall. Flat editorial design, no gradients, no shadows. The mood: a contractor's notebook page — plainspoken, weighty, founder-voiced.
```

- **Caption overlay (Canva):** drop the quote into the center — Fraunces serif 56pt dark navy. Attribution line in Manrope 22pt slate.
- **When to use:** any time Phyrom has a quotable line from a LinkedIn post worth excerpting to IG.

#### 2C.2 — Stat callout post

Pairs with: Day 6 (MA labor shortage), Day 8 (code-aware demo), Day 13 (lead-gen math), Day 22 (triple-decker stat).

```
An Instagram feed stat-callout post template, 1080 by 1350 pixels portrait 4:5. Composition: solid dark navy #1A1A2E background fills the canvas. CENTERED horizontally and slightly upper-third vertically: a single oversized number placeholder area — leave clean empty space approximately 800px wide by 400px tall for a large white numeral to be added in Canva (e.g., "$10,000" or "2.5%" or "30%"). DIRECTLY BELOW the number area with 48px gap, leave empty space for a single line of context in Manrope 28pt to be added in Canva. NEAR THE BOTTOM with 96px padding from the bottom edge, a thin sky blue #00A9E0 horizontal accent line at 4px tall stretching 60% of the canvas width centered. Below the line, a single line of attribution in slate Manrope 18pt italic placeholder area (Canva: "via WBJournal" or "via MassCEC"). UPPER-LEFT corner: small "Sherpa Pros" wordmark in white 18pt. Flat editorial design, no gradients.
```

- **Caption overlay:** large white Manrope condensed 240pt for the numeral. Sub-line Manrope 28pt white. Source italic 18pt slate.
- **When to use:** any post anchored to a single statistic.

#### 2C.3 — Before/After job post (pro spotlight format)

Pairs with: Day 12 (Sun inspiration kitchens), Day 19 (Sun inspiration bathrooms), Day 26 (Sun inspiration NE renovations).

```
An Instagram feed before/after split post template, 1080 by 1350 pixels portrait 4:5. Composition: warm cream #FBF7EE background. CANVAS DIVIDED HORIZONTALLY at 50%: the TOP HALF (1080 x 675px) is a clean rectangular placeholder area in light slate gray with a subtle dashed dark-navy outline labeled "BEFORE" in dark navy 28pt sans-serif uppercase in the upper-left corner of the placeholder with 24px padding. The BOTTOM HALF (1080 x 675px) is an identical placeholder area labeled "AFTER" in the same upper-left position. BETWEEN the two halves runs a thin sky blue #00A9E0 horizontal divider line at 4px tall with a small white circle in the dead center containing a small orange-red #FF4500 arrow pointing downward. UPPER-RIGHT corner of the canvas: small "Sherpa Pros" wordmark in dark navy 18pt. LOWER-RIGHT corner: a small "Old-House Verified" badge or "Founding Pro" badge placeholder area at 120px wide. Flat editorial design.
```

- **Caption overlay:** drop real before/after photos into the placeholders. Add pro name + city in Manrope 22pt below the AFTER label.
- **When to use:** every Sunday inspiration post, every pro work-spotlight.

#### 2C.4 — Beta cohort milestone post

Pairs with: Day 30 (30-day recap), any milestone announcement.

```
An Instagram feed milestone post template, 1080 by 1350 pixels portrait 4:5. Composition: solid sky blue #00A9E0 background fills the canvas. CENTERED both horizontally and vertically: leave a large empty placeholder area approximately 880px wide by 600px tall for milestone copy added in Canva. ABOVE the empty area with 64px padding, in small white Manrope sans-serif uppercase 22pt letter-spacing 0.2em: the line "MILESTONE" centered. BELOW the empty area with 64px padding, a horizontal row of three small white circular badges, each 80px diameter, with empty interiors (Canva will add stat numbers like "10", "$112K", "230"). LOWER-LEFT corner with 48px padding: small "Sherpa Pros" wordmark in white 22pt. LOWER-RIGHT corner: "thesherpapros.com" in white Manrope 16pt. UPPER-RIGHT corner: a small white star burst at 48px. Flat editorial design.
```

- **Caption overlay:** large Fraunces serif headline 80pt white in the center area. Three milestone numbers in the badges below in Fraunces serif 28pt sky blue (against white circle).
- **When to use:** every Wefunder progress milestone, every beta cohort growth post, every "X days in" recap.

#### 2C.5 — Code-checked badge feature post (educational)

Pairs with: Day 1 (Wed education), Day 8 (Wed education), Day 15 (Mass Save), Day 22 (triple-decker), Day 29 (Wed education).

```
An Instagram feed educational post template, 1080 by 1350 pixels portrait 4:5. Composition: warm cream #FBF7EE background. CENTERED in the upper-third of the canvas: a large stylized circular "Code-checked" badge at 360px diameter — outer ring solid dark navy #1A1A2E with the words "CODE CHECKED" arched along the top in white bold sans-serif 24pt and "BY SHERPA PROS" arched along the bottom in white 16pt; inner field warm cream #FBF7EE containing a sky blue #00A9E0 checkmark at 200px tall. BELOW the badge with 80px gap, a clean horizontal divider line in dark navy 2px tall stretching 60% canvas width centered. BELOW the divider, empty placeholder space for a 2-line headline added in Canva (e.g., "MA Electrical 2023 — checked in 18 seconds"). LOWER-RIGHT corner: small "Sherpa Pros" wordmark in dark navy 18pt. UPPER-LEFT corner: a small line of slate Manrope 14pt italic placeholder ("Real beta job — Newton MA"). Flat editorial design.
```

- **Caption overlay:** large Fraunces serif headline 44pt dark navy below the divider. Detail line in Manrope 22pt slate.
- **When to use:** every educational post about platform capability (code-aware, permit-assist, rebate lookup).

#### 2C.6 — Wefunder community-round announcement post

Pairs with: Day 24 (Wefunder launch), Day 25 (Wefunder AMA), any Wefunder push.

```
An Instagram feed Wefunder announcement post template, 1080 by 1350 pixels portrait 4:5. Composition: split background — TOP 70% solid sky blue #00A9E0; BOTTOM 30% solid orange-red #FF4500. Where the two colors meet, a single sharp diagonal seam slants from upper-right to lower-left at approximately 70 degrees (echoing the Sherpa Pros wordmark seam). CENTERED in the sky-blue top portion: large Fraunces serif headline placeholder area in white (Canva: "Own a piece of the platform you use."). LOWER orange-red portion: a horizontal row containing on the LEFT the word "WEFUNDER" in white Manrope bold uppercase 32pt letter-spacing 0.15em, and on the RIGHT a small white arrow icon at 48px. UPPER-RIGHT corner of the canvas: full Sherpa Pros wordmark in white at 80px tall (the diagonal seam visible). LOWER-LEFT corner of the orange-red portion: "thesherpapros.com / wefunder" in white Manrope 16pt. Flat editorial design, no gradients.
```

- **Caption overlay:** white Fraunces 64pt headline in the upper sky-blue portion.
- **When to use:** every Wefunder-related Instagram post.

#### 2C.7 — Founding Pro recruit post ("10 spots open" urgency)

Pairs with: Day 1 (founder kickoff), Day 7 (Founding Pro #1 spotlight), recurring weekly recruit pushes.

```
An Instagram feed Founding Pro recruit post template, 1080 by 1350 pixels portrait 4:5. Composition: warm cream #FBF7EE background. CENTERED in the upper-third: a large bold orange-red #FF4500 star burst at 240px diameter with a placeholder number area in the center (Canva: "9" or "8" or "7" — the spots remaining). BELOW the star with 64px gap, large Fraunces serif headline placeholder area in dark navy #1A1A2E (Canva: "Founding Pro spots open"). BELOW that with 32px gap, smaller Manrope 24pt slate placeholder ("NH · ME · MA licensed contractors"). NEAR THE BOTTOM with 80px padding from the bottom edge: a horizontal row of three small dark-navy pill chips, each 220px wide by 56px tall with rounded ends, containing in white Manrope 18pt the words "5% TAKE", "INSTANT PAY", "JOBS NOT LEADS". LOWER-RIGHT corner: small "Sherpa Pros" wordmark in dark navy 18pt. UPPER-LEFT corner: small "DM 'PRO'" placeholder line in dark navy Manrope 16pt. Flat editorial design.
```

- **Caption overlay:** the spots-remaining number in the star center — white Fraunces serif 120pt. Headline in Fraunces 64pt below.
- **When to use:** every Founding Pro recruiting push, urgency posts.

#### 2C.8 — Friday team / behind-the-scenes post

Pairs with: Day 4 (Sat engagement), Day 18 (Sat engagement), Day 25 (Sat engagement), any Friday HJD-jobsite content.

```
An Instagram feed behind-the-scenes post template, 1080 by 1350 pixels portrait 4:5. Composition: warm cream #FBF7EE background. CENTERED: a large rectangular photo placeholder area approximately 880px wide by 1080px tall — light slate gray with subtle dashed dark-navy outline. ABOVE the photo placeholder with 32px padding from the top edge: small slate Manrope 16pt italic placeholder ("Behind the scenes · HJD Builders LLC · NH"). BELOW the photo placeholder with 32px padding: a horizontal row containing on the LEFT a small "Sherpa Pros" wordmark in dark navy 18pt, and on the RIGHT a small placeholder line of slate Manrope 16pt for date / location. A small sky blue #00A9E0 polaroid-corner detail in the upper-left of the photo placeholder at 40x40px. Flat editorial design, no gradients. The mood: a contractor's instax photo book page.
```

- **Caption overlay:** drop the real Phyrom-on-jobsite or beta-pro photo into the placeholder. Add date + location.
- **When to use:** every Friday HJD jobsite post, every behind-the-scenes Phyrom selfie post.

### 2D. Instagram Story Templates (1080×1920 px vertical, 9:16)

Ten story templates. Stories run 5–7/day per `social-content-plan.md`. Phyrom batch-generates these once and uses as template scaffolds.

#### 2D.1 — "Today on Sherpa Pros" daily activity update

```
An Instagram story template, 1080 by 1920 pixels vertical 9:16. Solid warm cream #FBF7EE background. UPPER 30% of the canvas: a horizontal sky blue #00A9E0 banner at approximately 320px tall containing centered the words "TODAY ON SHERPA PROS" in white Manrope sans-serif bold uppercase 48pt letter-spacing 0.1em. BELOW the banner with 64px gap, large empty placeholder space for daily content — leave 800px wide by 800px tall of clean cream space for Canva-added text + sticker. LOWER 20% of the canvas: a horizontal dark navy #1A1A2E footer bar at 240px tall containing the date placeholder area on the LEFT (Canva: "DAY 15 · MAY 6") and a small "swipe up" arrow on the RIGHT in white at 48px. Mid-canvas RIGHT EDGE: a small orange-red #FF4500 vertical accent bar at 320px tall, 8px wide. Flat editorial design.
```

- **Sticker recommendations:** add Metricool's "swipe up" sticker over the lower bar; add poll or question stickers in the empty middle.
- **Schedule:** post 2 of these per day in Metricool — one morning (8am ET), one evening (7pm ET).

#### 2D.2 — "Beta cohort week N" thermometer

```
An Instagram story progress-thermometer template, 1080 by 1920 pixels vertical 9:16. Solid dark navy #1A1A2E background. CENTERED both horizontally and vertically: a large vertical thermometer-style progress visual — a tall vertical pill shape 240px wide by 1200px tall, rounded ends, outlined in white 4px stroke. The LOWER 60% of the pill is filled solid sky blue #00A9E0; the UPPER 40% is empty. Inside the pill at the boundary between filled and empty, a horizontal white line at 4px tall with a small white circle marker on the left side. To the LEFT of the thermometer with 48px gap: a vertical scale of small white tick marks with placeholder labels (Canva: "10", "8", "6", "4", "2", "0"). To the RIGHT of the thermometer: a placeholder text area (Canva: "6 of 10 Founding Pros signed"). UPPER 15% of canvas: small "Sherpa Pros · Beta cohort" line in white Manrope 22pt centered. LOWER 10% of canvas: a placeholder week-counter line (Canva: "Week 3 · 90-day fundraise"). Flat editorial design.
```

- **Schedule:** post 1x per week (Friday recap day).

#### 2D.3 — "Wefunder progress" raise-amount tracker

```
An Instagram story Wefunder-tracker template, 1080 by 1920 pixels vertical 9:16. Split background: UPPER 60% solid sky blue #00A9E0; LOWER 40% solid orange-red #FF4500, with a sharp diagonal seam at the boundary running upper-right to lower-left at 70 degrees (echoing the wordmark). UPPER sky-blue portion: large empty placeholder area for a dollar-amount display (Canva: "$112K" in white Fraunces 240pt) and below it a smaller line "COMMITTED" in white Manrope uppercase 28pt letter-spacing 0.15em. LOWER orange-red portion: a horizontal placeholder area for backer count + average check (Canva: "230 backers · $480 avg") in white Manrope 28pt. The full Sherpa Pros wordmark appears UPPER-LEFT corner at 80px tall in white. LOWER-RIGHT corner: "thesherpapros.com / wefunder" in white Manrope 18pt. Flat editorial design.
```

- **Schedule:** post 1x per week minimum during active raise; 2x per week after milestones.

#### 2D.4 — "Question for the audience" poll sticker template

```
An Instagram story question template, 1080 by 1920 pixels vertical 9:16. Solid warm cream #FBF7EE background. CENTERED in upper-third: a large empty placeholder area for a question headline added in Canva (Canva: "What's the worst contractor experience you've had?"). BELOW with 96px gap, a clean rectangular empty area approximately 880px wide by 320px tall — this is where the IG poll sticker will be placed by Phyrom in the IG composer. ABOVE the question with 80px padding from the top edge: a single small dark navy #1A1A2E pill containing "ASK PHYROM" in white Manrope 18pt uppercase letter-spacing 0.1em. LOWER-LEFT: small Sherpa Pros wordmark in dark navy 22pt. LOWER-RIGHT: small sky-blue #00A9E0 question-mark icon at 64px. Flat editorial design.
```

- **Sticker recommendations:** drop IG poll sticker (2-option or 4-option) in the lower placeholder area.
- **Schedule:** Saturday engagement days, AMA pushes.

#### 2D.5 — "This week's Founding Pro" spotlight

```
An Instagram story Founding Pro spotlight template, 1080 by 1920 pixels vertical 9:16. Solid warm cream #FBF7EE background. UPPER 60% of canvas: a large rectangular photo placeholder area approximately 880px wide by 1080px tall, light slate gray with dashed dark-navy outline — for the real Founding Pro photo. ABOVE the photo placeholder with 48px padding from the top edge: in dark navy Manrope uppercase 28pt letter-spacing 0.1em centered, the words "FOUNDING PRO". LOWER 40% of canvas: empty placeholder area for pro's name (Canva: "Mike · HVAC · Dover NH") in dark navy Fraunces serif 56pt centered, with a smaller line below in slate Manrope 24pt for trade specialty. NEAR BOTTOM EDGE: a horizontal sky blue #00A9E0 thin accent line 4px tall stretching 60% width centered. Below the line, a small "tap to read more" placeholder in dark navy Manrope 16pt. UPPER-LEFT corner: small "Sherpa Pros" wordmark in dark navy 18pt. Flat editorial design.
```

- **Schedule:** Tuesday pro-spotlight days.

#### 2D.6 — "Behind the scenes" jobsite Phyrom

```
An Instagram story BTS template, 1080 by 1920 pixels vertical 9:16. Solid dark navy #1A1A2E background. CENTERED: a large rectangular photo placeholder area approximately 880px wide by 1320px tall — this is where Phyrom drops the real selfie or jobsite photo. UPPER 12% of canvas above the photo: a small horizontal banner in sky blue #00A9E0 at 80px tall containing centered the words "BEHIND THE SCENES" in white Manrope bold uppercase 32pt letter-spacing 0.1em. LOWER 12% of canvas below the photo: a small placeholder line for caption (Canva: "Manchester NH · 6:42am · before coffee #2") in white Manrope 22pt. LOWER-RIGHT corner: small "Sherpa Pros" wordmark in white 18pt. Flat editorial design.
```

- **Schedule:** daily during Phase 0; tapers in Phase 1.

#### 2D.7 — "Code-checked moment" in-app screen recording template

```
An Instagram story screen-recording frame template, 1080 by 1920 pixels vertical 9:16. Solid warm cream #FBF7EE background. UPPER 12%: a sky blue #00A9E0 banner at 240px tall containing centered "CODE CHECKED IN 18 SECONDS" in white Manrope bold uppercase 32pt. CENTERED in the middle 60% of the canvas: a placeholder rectangular frame approximately 720px wide by 1280px tall with rounded corners and a subtle dark-navy outline — this is where the Loom / screen-recording video clip is dropped. AROUND the frame: clean cream negative space. LOWER 12%: a small placeholder caption area (Canva: "Real beta job · Newton MA · MA Electrical 2023") in dark navy Manrope 22pt centered. LOWER-RIGHT: small "Sherpa Pros" wordmark in dark navy 18pt. Flat editorial design.
```

- **Sticker recommendations:** add a small countdown sticker over the frame ("18s") for emphasis.
- **Schedule:** Wednesday education days.

#### 2D.8 — "How it works" 3-frame explainer

This is a 3-frame story sequence — generate three connected frames. Each frame has the same template; Phyrom changes the numeral and headline per frame.

```
An Instagram story explainer-frame template, 1080 by 1920 pixels vertical 9:16. Solid warm cream #FBF7EE background. CENTERED in upper-third: a large numeral placeholder area for a step number (Canva: "01" or "02" or "03") in sky blue #00A9E0 outlined Fraunces serif at 380pt. BELOW the numeral with 96px gap, a placeholder headline area (Canva: "Homeowner posts a job" / "Sherpa Pros matches the right pro" / "Pro gets paid"). BELOW the headline with 64px gap, a placeholder body line in slate Manrope 22pt (Canva: short explainer per frame). LOWER 20% of canvas: a horizontal progress indicator with 3 small horizontal pills, each 280px wide by 12px tall with rounded ends, the corresponding pill solid sky blue and the others light slate gray (frame 1 = first pill blue; frame 2 = first two; frame 3 = all three). LOWER-RIGHT: small "Sherpa Pros" wordmark in dark navy 18pt. Flat editorial design.
```

- **Schedule:** Wednesday education days; recurring monthly.

#### 2D.9 — "Save this" infographic-style tip

```
An Instagram story save-this-tip template, 1080 by 1920 pixels vertical 9:16. Solid warm cream #FBF7EE background. UPPER 15%: a small orange-red #FF4500 horizontal pill at 80px tall containing centered the words "SAVE THIS" in white Manrope bold uppercase 28pt letter-spacing 0.1em. BELOW the pill with 48px gap, a placeholder headline area for a 2-line tip headline added in Canva (e.g., "4 things every homeowner should check before hiring a contractor"). BELOW the headline with 64px gap, a numbered list area — 4 horizontal rows each containing a small sky blue #00A9E0 numeral bullet ("01", "02", "03", "04") in Fraunces serif 28pt and an empty horizontal placeholder line in dark navy 24pt for tip content. LOWER 12%: a small "Tap save · Forward to a friend" line in slate Manrope 18pt centered. LOWER-RIGHT: small "Sherpa Pros" wordmark in dark navy 18pt. Flat editorial design.
```

- **Schedule:** Wednesday education days; high-shareability content.

#### 2D.10 — "Link in bio" redirect template

```
An Instagram story link-in-bio template, 1080 by 1920 pixels vertical 9:16. Solid sky blue #00A9E0 background. CENTERED: a large placeholder area for headline (Canva: "Wefunder is live" / "Beta is open" / "DM 'PRO' for the link"). BELOW with 64px gap, a small white horizontal pill at 64px tall containing centered "LINK IN BIO" in dark navy Manrope bold uppercase 24pt letter-spacing 0.1em. LOWER 25% of canvas: a large white arrow icon pointing upward at 240px tall — pointing to where the link sticker will be placed by Phyrom in the IG composer. UPPER-LEFT: small "Sherpa Pros" wordmark in white 18pt. Flat editorial design.
```

- **Sticker recommendations:** drop the IG link sticker in the upper portion above the white arrow.
- **Schedule:** every Wefunder push, every product-launch day, every recruit push.

### 2E. Instagram Reel Cover Thumbnails (1080×1920 px, 9:16)

Six reel cover templates. Reel covers are the static frame Instagram displays in the grid — strong text-overlay readability is critical for autoplay-muted scroll.

#### 2E.1 — "Watch a real toilet install in 2 minutes"

Pairs with: Day 17 (viral Quick Job toilet install).

```
An Instagram reel cover thumbnail template, 1080 by 1920 pixels vertical 9:16. Composition: TOP 50% of the canvas is a placeholder photo area with light slate gray and dashed dark-navy outline — for a real bathroom photo (the Quick Job pro at work). BOTTOM 50% solid dark navy #1A1A2E. AT THE TRANSITION between the two halves, a thin sky blue #00A9E0 horizontal accent line at 6px tall stretching full canvas width. WITHIN THE BOTTOM dark-navy half, CENTERED: large white Fraunces serif headline placeholder area for the line "Watch a real toilet install in 2 minutes" — leave clean empty space approximately 880px wide by 480px tall for headline added in Canva. BELOW the headline area with 48px gap, a small placeholder line for sub-detail (Canva: "$325 · MA · Confirmed in 30 min") in slate Manrope 22pt. LOWER-LEFT corner of the bottom half: a small orange-red #FF4500 play-button triangle icon at 80px. LOWER-RIGHT corner: small "Sherpa Pros" wordmark in white 18pt. Flat editorial design.
```

- **Caption overlay:** large white Fraunces serif 64pt headline, dropped in the empty bottom-half space.

#### 2E.2 — "Why I built Sherpa Pros"

Pairs with: Day 1 (founder kickoff selfie reel).

```
An Instagram reel cover thumbnail template, 1080 by 1920 pixels vertical 9:16. Composition: full-canvas placeholder area in light slate gray with dashed dark-navy outline — for a real Phyrom selfie photo on jobsite. OVERLAY a dark navy #1A1A2E gradient-free flat color block on the LOWER 35% of the canvas (sharp top edge, no gradient). WITHIN the lower color block, CENTERED: large white Fraunces serif headline placeholder area for "Why I built Sherpa Pros" — leave empty space approximately 880px wide by 320px tall. BELOW the headline area with 32px gap: a small attribution line placeholder in white Manrope 22pt italic ("— Phyrom · NH GC · Founder"). UPPER-RIGHT corner of the canvas: a small sky blue #00A9E0 horizontal pill at 64px tall containing "FOUNDER" in white Manrope bold uppercase 22pt letter-spacing 0.1em. LOWER-RIGHT: small "Sherpa Pros" wordmark in white 18pt. Flat editorial design.
```

#### 2E.3 — "What does code-checked mean?"

Pairs with: Day 1 (Wed education product demo), Day 8 (Wed education).

```
An Instagram reel cover thumbnail template, 1080 by 1920 pixels vertical 9:16. Solid warm cream #FBF7EE background. CENTERED in upper-third: a large stylized "Code Checked" badge at 480px diameter — outer ring solid dark navy #1A1A2E with arched white "CODE CHECKED" text and "BY SHERPA PROS" along the bottom; inner field cream containing a sky blue #00A9E0 oversized checkmark at 280px. BELOW the badge with 80px gap, large dark navy Fraunces serif headline placeholder area for "What does code-checked mean?" — leave empty space approximately 880px wide by 320px tall. NEAR BOTTOM: a small "tap to watch" line in dark navy Manrope 22pt centered. LOWER-RIGHT: small "Sherpa Pros" wordmark in dark navy 18pt. Flat editorial design.
```

#### 2E.4 — "Founding Pro spotlight"

Pairs with: Day 7, 14, 21, 28 (Tuesday pro spotlights).

```
An Instagram reel cover thumbnail template, 1080 by 1920 pixels vertical 9:16. Composition: TOP 60% of canvas is a placeholder photo area with light slate gray and dashed dark-navy outline — for the real Founding Pro photo. BOTTOM 40% solid warm cream #FBF7EE. WITHIN the cream bottom, CENTERED: a small "FOUNDING PRO" pill at 280px wide by 56px tall in solid dark navy #1A1A2E with white Manrope bold uppercase 22pt text. BELOW the pill with 32px gap, a placeholder name area in dark navy Fraunces serif 64pt for the pro's name (Canva: "Mike Rodriguez"). BELOW the name with 16px gap, a placeholder line in slate Manrope 24pt for trade + city (Canva: "HVAC · Dover NH"). LOWER-RIGHT corner: small "Sherpa Pros" wordmark in dark navy 18pt. A small orange-red #FF4500 star icon to the LEFT of the FOUNDING PRO pill at 32px. Flat editorial design.
```

#### 2E.5 — "Inside the Wefunder raise"

Pairs with: Day 24 (Wefunder launch reel).

```
An Instagram reel cover thumbnail template, 1080 by 1920 pixels vertical 9:16. Composition: split background — TOP 60% solid sky blue #00A9E0; BOTTOM 40% solid orange-red #FF4500. Where the two colors meet, a single sharp diagonal seam slants from upper-right to lower-left at 70 degrees. WITHIN the sky-blue top, CENTERED: large white Fraunces serif headline placeholder area for "Inside the Wefunder raise" — empty space approximately 880px wide by 320px tall. BELOW with 32px gap, a small placeholder line in white Manrope 24pt italic ("Day 24 · 60 days to first close"). WITHIN the orange-red bottom, CENTERED: large oversized white Manrope condensed display number placeholder area for the current raise total (Canva: "$112K"). LOWER-LEFT: small "Sherpa Pros" wordmark in white 18pt. LOWER-RIGHT: "thesherpapros.com / wefunder" in white Manrope 16pt. Flat editorial design.
```

#### 2E.6 — "Behind the scenes — week N"

Pairs with: weekly recap reel content.

```
An Instagram reel cover thumbnail template, 1080 by 1920 pixels vertical 9:16. Composition: full-canvas placeholder area in light slate gray with dashed dark-navy outline — for a real Phyrom-on-jobsite or BTS photo. OVERLAY a sky blue #00A9E0 horizontal banner at the TOP of the canvas at 240px tall containing centered the words "BEHIND THE SCENES" in white Manrope bold uppercase 36pt letter-spacing 0.15em. OVERLAY a dark navy #1A1A2E horizontal banner at the BOTTOM of the canvas at 240px tall, containing centered a large white Manrope condensed display headline placeholder area for the week label (Canva: "WEEK 3 · 7 DAYS · 12 SHIPS"). LOWER-RIGHT: small Sherpa Pros wordmark in white 18pt. Flat editorial design.
```

---

## SECTION 3 — TikTok

### 3A. TikTok Profile Avatar — REUSE Instagram avatar

Same square SP-monogram avatar from `brand-asset-prompts.md` §4 (with palette swap to #FF4500). Fits TikTok's circular crop with 18% padding.

### 3B. TikTok Cover Thumbnails — REUSE Section 2E

TikTok and Instagram Reels share 9:16 (1080×1920 px) format. The six reel cover templates in Section 2E work identically on TikTok. Save once, deploy on both.

### 3C. TikTok Post Cover Stills (the static frame TikTok displays in grid)

Four templates for the most-likely-viral content types from `social-content-plan.md`. These differ from reel covers in that TikTok rewards bigger, louder, more on-screen text — so type is heavier and more dominant.

#### 3C.1 — "Real toilet install · $325 · 2 minutes"

Pairs with: Day 17 (viral Quick Job toilet install).

```
A TikTok cover still template, 1080 by 1920 pixels vertical 9:16. Composition: full-canvas placeholder area in light slate gray with dashed dark-navy outline for a real bathroom Quick Job photo. OVERLAY: across the CENTER of the canvas, three stacked horizontal bands each at 200px tall — the TOP band solid sky blue #00A9E0, the MIDDLE band solid white, the BOTTOM band solid orange-red #FF4500. WITHIN each band, CENTERED, large white-outlined Manrope condensed display heavy text on placeholder areas: TOP band placeholder for "REAL TOILET INSTALL" in white 64pt, MIDDLE band for "$325 · MA · 90 MIN" in dark navy 64pt, BOTTOM band for "WATCH" in white 96pt. UPPER-LEFT: small "Sherpa Pros" wordmark in white 22pt with white drop-text-shadow for legibility on photo. LOWER-RIGHT corner: a small orange-red #FF4500 play-button triangle icon at 96px. Flat design — TikTok style means LOUD and on-screen-text-heavy.
```

#### 3C.2 — "Watch me catch a code violation in 18 seconds"

Pairs with: Day 8 (Wed code-aware demo).

```
A TikTok cover still template, 1080 by 1920 pixels vertical 9:16. Solid dark navy #1A1A2E background. CENTERED: a massive bold white Manrope condensed display headline area, leave empty space approximately 1000px wide by 1200px tall — for the line "WATCH ME CATCH A CODE VIOLATION IN 18 SECONDS" (rendered in large white type at approximately 96-120pt with tight line height, all caps). BELOW the headline area with 64px gap: a small placeholder line in sky blue #00A9E0 Manrope 28pt uppercase letter-spacing 0.15em ("ANGI CAN'T DO THIS"). UPPER-RIGHT corner: a small orange-red #FF4500 horizontal pill containing "18s" in white Manrope bold 32pt at approximately 200px wide by 80px tall. LOWER-LEFT: small "Sherpa Pros" wordmark in white 22pt. Flat design.
```

#### 3C.3 — "A NH GC's response to Angi's $400 lead"

Pairs with: Day 13 (Mon "lead-gen math is brutal" carousel/reel), Day 20 (Mon "$1,840 in lead spend" reel), Day 27 (Mon "lead-gen makes money when contractors lose").

```
A TikTok cover still template, 1080 by 1920 pixels vertical 9:16. Solid warm cream #FBF7EE background. CENTERED in upper-third: a large stylized cracked / torn paper receipt graphic in dark navy #1A1A2E line-art at 480px tall, with a small orange-red #FF4500 "$87" stamped diagonally across it. BELOW with 64px gap, a massive bold dark-navy Fraunces serif display headline area, leave empty space approximately 1000px wide by 800px tall — for the line "A NH GC'S RESPONSE TO ANGI'S $400 LEAD" (rendered in dark navy type approximately 96pt). NEAR BOTTOM: a small placeholder line in sky blue #00A9E0 Manrope 28pt uppercase ("PHYROM RESPONDS · 60 SECONDS"). LOWER-RIGHT: small "Sherpa Pros" wordmark in dark navy 22pt. Flat design.
```

#### 3C.4 — "How Sherpa Pros works in 30 seconds"

Pairs with: any explainer reel; recurring evergreen content.

```
A TikTok cover still template, 1080 by 1920 pixels vertical 9:16. Solid sky blue #00A9E0 background. CENTERED: a massive bold white Manrope condensed display headline area, leave empty space approximately 1000px wide by 1300px tall — for the line "HOW SHERPA PROS WORKS IN 30 SECONDS" (rendered in white type approximately 96pt). UPPER-LEFT: a small white "30s" timer pill at 200px wide by 80px tall containing dark navy text Manrope bold 32pt. UPPER-RIGHT: full Sherpa Pros wordmark in white at 80px tall. LOWER-CENTER: a horizontal row of three small white circles each 64px diameter, each containing a tiny dark navy numeral ("1", "2", "3") indicating the 3 steps in the explainer video. LOWER-LEFT: small orange-red #FF4500 play-button triangle at 80px. Flat design.
```

---

## SECTION 4 — Facebook

Facebook drives the older homeowner demographic per `social-content-plan.md` §1.4. Most Facebook visuals reuse Instagram square / 4:5 templates. Two unique assets follow.

### 4A. Facebook Page Cover (820×312 px desktop, 640×360 mobile-safe area)

```
A Facebook page cover banner for Sherpa Pros, 820 by 312 pixels, landscape ~2.6:1. Composition: warm cream #FBF7EE background fills the canvas. A bold diagonal seam slashes the canvas from upper-right to lower-left at 70 degrees, dividing the canvas into two slightly unequal blocks — the LEFT block (about 60% of canvas) is solid sky blue #00A9E0; the RIGHT block (about 40%) is solid orange-red #FF4500. CRITICAL: keep all text + logo within the CENTER 640x360 mobile-safe area (the Facebook mobile crop trims the outer edges). Inside the LEFT sky-blue block, vertically centered with 48px padding from the diagonal seam: empty placeholder area for headline added in Canva (e.g., "The licensed-trade marketplace built by a contractor"). Inside the RIGHT orange-red block, vertically centered: a small white star/burst at 80px and below it empty placeholder for sub-line ("Jobs, not leads"). UPPER-LEFT corner of the canvas with 24px padding: small "Sherpa Pros" wordmark in white 18pt. LOWER-RIGHT corner: "thesherpapros.com" in white Manrope 14pt. Flat design.
```

- **Caption overlay (Canva):** white Fraunces 36pt headline in the left sky-blue block. Sub-line in white Manrope 18pt in the right orange-red block.

### 4B. Facebook Post Templates — REUSE Section 2C

All eight Instagram square / 4:5 post templates work identically on Facebook. Two differences vs Instagram:
1. Facebook supports more text in image overlay without engagement penalty (Instagram historically penalized >20% text — that's relaxed but Facebook is more forgiving).
2. Link previews dominate Facebook reach. For any post linking to thesherpapros.com, ensure the OG image (Section 8C) is set on the destination page so Facebook auto-generates a strong card.

---

## SECTION 5 — X (Twitter)

### 5A. X Profile Banner (1500×500 px, 3:1)

```
A clean editorial X profile banner for Sherpa Pros, 1500 by 500 pixels, landscape 3:1. Composition: warm cream #FBF7EE background fills the canvas. A bold diagonal seam slashes the canvas from upper-right to lower-left at 70 degrees, dividing the canvas into two slightly unequal blocks — the LEFT block (about 65%) is solid sky blue #00A9E0; the RIGHT block (about 35%) is solid orange-red #FF4500. CRITICAL: keep all text + logo within the CENTER 1300x400 area (X's mobile crop trims edges; the bottom 80px is also obscured by profile-photo overlap on the bottom-left). Inside the LEFT sky-blue block, vertically centered with 64px padding from the diagonal seam, leave empty placeholder area for the @sherpapros handle and tagline added in Canva (e.g., "@sherpapros · The licensed-trade marketplace built by a contractor"). Inside the RIGHT orange-red block, vertically centered, leave empty placeholder for "thesherpapros.com" line added in Canva. UPPER-LEFT corner with 24px padding: small white "Sherpa Pros" wordmark at 22pt. Flat design.
```

- **Caption overlay:** white Fraunces 32pt handle line in the left sky-blue block. URL in white Manrope 22pt in the right orange-red block.

### 5B. X Post Image Templates (1600×900 px, 16:9)

Three templates for inline X images (X's preview crop is 16:9 landscape).

#### 5B.1 — Founder quote (X-formatted)

Pairs with: any X post that excerpts a Phyrom quote from a longer LinkedIn or Wefunder update.

```
An X (Twitter) post image template for a founder quote, 1600 by 900 pixels landscape 16:9. Composition: solid warm cream #FBF7EE background. CENTERED both horizontally and vertically: leave a large empty quote placeholder area approximately 1280px wide by 480px tall for the quote line added in Canva. ABOVE the placeholder with 48px gap, an oversized opening quotation mark "" in sky blue #00A9E0 outlined Fraunces serif at 200pt. BELOW the placeholder with 48px gap, a placeholder attribution line area (Canva: "— Phyrom · Founder, Sherpa Pros · NH GC"). UPPER-LEFT: small "Sherpa Pros" wordmark in dark navy #1A1A2E 22pt. LOWER-RIGHT: small orange-red #FF4500 hand-drawn underline accent at 160px wide, 4px tall. Flat design.
```

- **Caption overlay:** Fraunces serif 56pt dark navy. Attribution Manrope 22pt slate.

#### 5B.2 — Build-in-public stat update (mini-dashboard)

Pairs with: any X post with traction numbers, weekly recap thread images.

```
An X post image template for a build-in-public stat update, 1600 by 900 pixels landscape 16:9. Composition: solid dark navy #1A1A2E background. CANVAS DIVIDED INTO 4 EQUAL QUADRANTS by thin sky blue #00A9E0 cross-hair lines at 2px tall. WITHIN each quadrant: empty placeholder area for a single stat (Canva fills with: top-left "10 / 10 Founding Pros", top-right "$112K Wefunder", bottom-left "62 days in", bottom-right "11 VC convos"). Each quadrant has a small label area in slate Manrope 18pt uppercase letter-spacing 0.1em centered at the top, and a large numeral area in white Fraunces serif 96pt centered. UPPER-LEFT corner outside the cross-hair grid: small "Sherpa Pros · Build in public" line in white Manrope 22pt. LOWER-RIGHT corner: "Day 62 · thesherpapros.com" in white Manrope 18pt. Flat design.
```

- **Caption overlay:** fill all 4 quadrants with current stats.

#### 5B.3 — News + commentary (Phyrom take on industry article)

Pairs with: any X post quoting a WBJournal / Bisnow / industry article.

```
An X post image template for news + commentary, 1600 by 900 pixels landscape 16:9. Composition: solid warm cream #FBF7EE background. LEFT 50% of canvas: a placeholder rectangular area approximately 720px wide by 720px tall in light slate gray with dashed dark-navy outline — for a screenshot of the article headline (Phyrom drops in Canva). RIGHT 50% of canvas: empty placeholder area for Phyrom's commentary headline added in Canva (e.g., "This is the pipeline problem in 1 chart"). UPPER-RIGHT corner: small "Sherpa Pros · Phyrom's take" line in dark navy #1A1A2E 22pt. LOWER-LEFT corner: a small "via WBJournal" placeholder line in slate 14pt italic. LOWER-RIGHT: small orange-red #FF4500 horizontal pill at 120px wide by 48px tall containing "READ" in white Manrope bold uppercase 18pt. A thin sky blue #00A9E0 vertical divider line at 4px tall between the LEFT and RIGHT halves. Flat design.
```

---

## SECTION 6 — YouTube

### 6A. YouTube Channel Banner (2560×1440 px, with mobile-safe area in middle 1546×423)

```
A YouTube channel banner for Sherpa Pros, 2560 by 1440 pixels landscape 16:9. CRITICAL safe-zone rule: only the CENTER 1546x423 area is guaranteed visible across all devices (mobile, tablet, TV, desktop). Treat the outer area as decorative bleed only. Composition: warm cream #FBF7EE background fills the full canvas. Across the FULL CANVAS, a bold diagonal seam slashes from upper-right to lower-left at 70 degrees, dividing the canvas into two unequal blocks — the LEFT block (about 60%) is solid sky blue #00A9E0; the RIGHT block (about 40%) is solid orange-red #FF4500. WITHIN the safe-zone center 1546x423 area: CENTERED, leave empty placeholder area for the channel name + tagline (Canva: "SHERPA PROS" in massive white Manrope condensed display 200pt, with sub-line "The licensed-trade marketplace that thinks like a contractor" in white Manrope 36pt). To the RIGHT of the centered text within the safe zone, in the orange-red half: a small white star/burst at 96px. UPPER-LEFT corner of the safe zone with 32px padding: small white "Sherpa Pros" wordmark at 32pt. LOWER-RIGHT corner of safe zone: "thesherpapros.com" in white Manrope 22pt. Flat design — most brand-forward asset in the library.
```

- **Caption overlay:** all text added in Canva inside the safe zone.

### 6B. YouTube Video Thumbnail Templates (1280×720 px, 16:9)

Five thumbnail templates aligned to YouTube content types from `social-content-plan.md` §1.6. **YouTube CTR is 80% driven by thumbnail + title** — these are heavy on type and contrast.

#### 6B.1 — Founder explainer (Phyrom on jobsite + big text overlay)

Pairs with: Day 1 long-form ("I'm raising $250K…"), recurring founder long-form videos.

```
A YouTube thumbnail template for a founder explainer video, 1280 by 720 pixels landscape 16:9. Composition: full-canvas placeholder area in light slate gray with dashed dark-navy outline — for a real Phyrom-on-jobsite photo (Phyrom drops in Canva, ideally a confident expression with face partially visible, jobsite background). OVERLAY: a dark navy #1A1A2E flat color block on the LEFT 45% of the canvas (sharp right edge, no gradient, no fade). WITHIN the dark-navy block, CENTERED, leave a large empty placeholder area approximately 480px wide by 480px tall for a 2-3 line bold white headline added in Canva (e.g., "I'M RAISING $250K. HERE'S WHY."). BELOW the headline area with 32px gap, a small placeholder line in sky blue #00A9E0 Manrope bold uppercase 22pt letter-spacing 0.15em ("FOUNDER STORY · 5 MIN"). UPPER-RIGHT corner with 24px padding: small white "Sherpa Pros" wordmark at 22pt with subtle drop-shadow for legibility. LOWER-RIGHT corner: a small orange-red #FF4500 play-button triangle at 80px. Flat editorial design — bold contrast for high CTR.
```

#### 6B.2 — Product demo (screen recording + branded overlay)

Pairs with: Day 8 long-form (code-aware walkthrough), product demo content.

```
A YouTube thumbnail template for a product demo video, 1280 by 720 pixels landscape 16:9. Composition: solid warm cream #FBF7EE background. LEFT 55% of canvas: a placeholder rectangular frame approximately 640px wide by 600px tall with rounded corners and subtle dark-navy outline — for a screen-recording still (Phyrom drops in Canva). RIGHT 45% of canvas: leave empty placeholder area for headline (Canva: "WATCH 4 CODE CHECKS IN 18 SEC"). BELOW the headline area with 32px gap, a small "DEMO · 30 SEC TO 5 MIN" placeholder line in sky blue #00A9E0 Manrope bold uppercase 22pt letter-spacing 0.15em. UPPER-RIGHT corner: a small orange-red #FF4500 horizontal pill at 200px wide by 64px tall containing "WATCH" in white Manrope bold uppercase 24pt. LOWER-RIGHT: small "Sherpa Pros" wordmark in dark navy 22pt. Flat editorial design.
```

#### 6B.3 — Educational / tutorial (Mass Save / EV / heat pump)

Pairs with: Day 15 long-form (Mass Save heat pump rebate), Day 22 long-form (Boston triple-decker), recurring education content.

```
A YouTube thumbnail template for an educational tutorial video, 1280 by 720 pixels landscape 16:9. Composition: solid warm cream #FBF7EE background. LEFT 50% of canvas: a flat-illustration of a small residential house silhouette in dark navy #1A1A2E outline at 480px tall, with a sky blue #00A9E0 heat pump unit visible on the right side and an orange-red #FF4500 dollar-amount badge visible above the house at approximately 200px diameter (Canva fills with "$10K" or actual rebate amount). RIGHT 50% of canvas: leave empty placeholder area for headline (Canva: "MASS SAVE HEAT PUMP REBATE: FULL WALKTHROUGH"). BELOW headline area: a small "BOSTON HOMEOWNERS · 8 MIN" placeholder line in sky blue Manrope bold uppercase 22pt. UPPER-RIGHT: small orange-red play-button pill at 200px wide by 64px tall containing "WATCH" in white. LOWER-RIGHT: small "Sherpa Pros" wordmark in dark navy 22pt. Flat editorial design.
```

#### 6B.4 — Beta cohort update (data-driven dashboard-style)

Pairs with: weekly / monthly beta cohort recap long-forms.

```
A YouTube thumbnail template for a beta cohort update video, 1280 by 720 pixels landscape 16:9. Composition: solid dark navy #1A1A2E background. CENTERED in upper-third: a horizontal row of three large stat areas separated by thin sky blue #00A9E0 vertical dividers — each stat area contains an empty large numeral placeholder area in white Fraunces serif 120pt (Canva: "10", "$112K", "62"). BELOW each numeral area: a small label placeholder in slate Manrope uppercase 18pt ("FOUNDING PROS", "WEFUNDER", "DAYS"). LOWER 35% of canvas: leave empty placeholder area for headline (Canva: "62 DAYS IN. HERE'S WHAT WE SHIPPED."). UPPER-LEFT: small "Sherpa Pros · Build in Public" in white Manrope 22pt. LOWER-RIGHT: small orange-red play-button pill containing "WATCH" in white. Flat editorial design.
```

#### 6B.5 — Wefunder milestone (raise-progress hero shot)

Pairs with: Wefunder milestone long-forms.

```
A YouTube thumbnail template for a Wefunder milestone video, 1280 by 720 pixels landscape 16:9. Composition: split background — TOP 60% solid sky blue #00A9E0; BOTTOM 40% solid orange-red #FF4500, with a sharp diagonal seam at 70 degrees from upper-right to lower-left. WITHIN the sky-blue top, LEFT side: large empty placeholder area for headline (Canva: "WEFUNDER HIT $250K"). WITHIN the sky-blue top, RIGHT side: a placeholder rectangular area approximately 400px wide by 400px tall in light slate gray with dashed dark-navy outline — for a real Phyrom selfie photo. WITHIN the orange-red bottom, CENTERED: a placeholder line for milestone detail (Canva: "230 BACKERS · DAY 62 · 30 DAYS TO FIRST CLOSE") in white Manrope bold uppercase 24pt letter-spacing 0.1em. UPPER-RIGHT corner: full Sherpa Pros wordmark in white at 64px tall. LOWER-RIGHT: small white play-button triangle at 80px. Flat editorial design — most brand-forward of the YouTube thumbnail set.
```

### 6C. YouTube Shorts Cover — REUSE Sections 2E + 3C

YouTube Shorts use 9:16 (1080×1920 px), identical to TikTok and IG Reel covers. Reuse those template sets directly. Save once, deploy three times.

---

## SECTION 7 — Email Headers

### 7A. Pro-recruiting email header banner (600×200 px)

```
An email header banner for Sherpa Pros pro-recruiting email sequence, 600 by 200 pixels, landscape 3:1. Composition: warm cream #FBF7EE background. A bold diagonal seam slashes the canvas from upper-right to lower-left at 70 degrees, dividing into two unequal blocks — LEFT block (about 60%) solid sky blue #00A9E0; RIGHT block (about 40%) solid orange-red #FF4500. INSIDE the LEFT sky-blue block, centered: empty placeholder area for the line "FOUNDING PRO PROGRAM" in white Manrope bold uppercase 22pt letter-spacing 0.1em. INSIDE the RIGHT orange-red block, centered: a small white star burst at 48px. UPPER-LEFT corner: small white Sherpa Pros wordmark at 18pt. LOWER-RIGHT corner: "Built by a contractor" in white Manrope italic 12pt. Flat design.
```

- **Use case:** top-of-email banner for the Founding Pro recruit email sequence in `docs/marketing/email-sequences/`.

### 7B. Client / homeowner-recruiting email header banner (600×200 px)

```
An email header banner for Sherpa Pros homeowner email sequence, 600 by 200 pixels, landscape 3:1. Composition: warm cream #FBF7EE background fills the canvas. CENTERED: large dark navy #1A1A2E Fraunces serif headline placeholder area for the line "Your neighborhood. Your contractor." (added in Canva). LEFT side with 24px padding: a small flat-illustration of a small house silhouette in dark navy line-art at 80px tall. RIGHT side with 24px padding: a small flat-illustration of a small contractor silhouette in dark navy line-art at 80px tall. BETWEEN them: a thin sky blue #00A9E0 horizontal connecting line at 4px tall. UPPER-LEFT corner: small Sherpa Pros wordmark in dark navy at 16pt. LOWER-RIGHT: a small orange-red #FF4500 hand-drawn checkmark accent at 48px. Flat editorial design — softer, neighbor-credibility style.
```

### 7C. Investor / Wefunder email header banner (600×200 px)

```
An email header banner for Sherpa Pros investor / Wefunder email sequence, 600 by 200 pixels, landscape 3:1. Composition: solid dark navy #1A1A2E background. CENTERED: large white Fraunces serif headline placeholder area for the line "Build it with us." LEFT side with 32px padding: a small white line-art icon of an ascending bar chart at 64px tall. RIGHT side with 32px padding: a small sky blue #00A9E0 line-art icon of a stylized handshake at 64px tall. UPPER-LEFT corner: small white Sherpa Pros wordmark at 16pt. LOWER-RIGHT: small white "WEFUNDER · thesherpapros.com" in Manrope 12pt italic. Flat editorial design — more polished, financial-credible style.
```

---

## SECTION 8 — Editorial / Press Kit

### 8A. Press headshot of Phyrom (style-guide prompt for photographer + AI stand-in)

**This is a STAND-IN prompt only.** Phyrom should commission a real NH photographer when budget allows ($300–500/session). Press placements deserve real photography. This Ideogram prompt produces a placeholder press-quality image for use until real photography is captured.

```
A documentary-style 35mm press headshot of a working New Hampshire general contractor, 2400 by 3000 pixels portrait 4:5, ultra-realistic. Subject: a man in his early-to-mid thirties standing on a partially-finished residential framing jobsite, wearing a faded navy flannel shirt and a worn leather tool belt, holding a clipboard in one hand and a pencil in the other. Composition: 3/4 mid-action pose — looking slightly off-camera as if mid-thought, NOT smiling at camera, NOT posed. Background: out-of-focus stud-wall framing with golden-hour late-afternoon natural light streaming in from the right. Color palette: muted warm tones — flannel navy, leather brown, sawdust beige, with a single sky blue #00A9E0 accent (a tape measure clipped to the belt). Skin tones authentic and unretouched. Fine 35mm film grain visible. NO corporate-portrait energy. NO stock-photo smile. NO high-vis vest. NO branded clothing. Documentary realism — Magnum Photos meets construction trade. The mood: a working contractor caught mid-thought on his own jobsite — earned dignity, not posed marketing.
```

- **Note:** when commissioning a real photographer, share THIS prompt as the visual brief — it captures the tone Phyrom wants.

### 8B. Hero image for landing pages (3000×1200 px, 5:2 wide)

```
A documentary-style hero image for the Sherpa Pros landing page, 3000 by 1200 pixels ultra-wide 5:2 landscape. Composition: a soft-focus 35mm photograph of an early-morning residential framing jobsite in New Hampshire — visible 2x4 wall studs, partial window opening on the right, sawdust on the subfloor, a leather tool belt resting on a sawhorse in the LEFT third of the frame. NO people visible. Natural soft pre-dawn light from the right with cool blue-gray shadows in the framing cavities and warm cream highlights on the wood. Color palette: dominant warm cream #FBF7EE in the wood and natural light, dark navy #1A1A2E shadows, a single quiet sky blue #00A9E0 accent (the tape measure clipped to the tool belt). NO orange-red in the photo. The CENTER 40% of the canvas is intentionally calm — clean negative space for headline + CTA overlay added later in Canva or in the landing-page hero component. Fine 35mm film grain. The mood: ambient brand atmosphere — blue-collar dignity, the quiet before the work day starts.
```

### 8C. Social-share Open Graph image (1200×630 px, 1.91:1)

```
An Open Graph social-share image for thesherpapros.com, 1200 by 630 pixels landscape 1.91:1. Composition: warm cream #FBF7EE background fills the canvas. A bold diagonal seam slashes the canvas from upper-right to lower-left at 70 degrees, dividing into two unequal blocks — LEFT block (about 65%) solid sky blue #00A9E0; RIGHT block (about 35%) solid orange-red #FF4500. INSIDE the LEFT sky-blue block, vertically centered with 64px padding from the diagonal seam: large empty placeholder area for the brand wordmark + tagline (added directly in this generation as: "SHERPA PROS" in massive white Manrope condensed display 120pt, with sub-line "The licensed-trade marketplace that thinks like a contractor." in white Manrope 28pt). INSIDE the RIGHT orange-red block, vertically centered: a small white star burst at 64px and below it the text "thesherpapros.com" in white Manrope bold uppercase 22pt letter-spacing 0.1em. UPPER-LEFT corner: small white "Built by a contractor · National" line in Manrope italic 16pt. LOWER-RIGHT corner: a small white play-button or arrow icon at 32px. Flat design — the OG image is a brand-front-door, must be unmistakably Sherpa Pros at thumbnail size.
```

- **Use case:** drop into the Next.js app's `app/layout.tsx` `metadata.openGraph.images` config so every shared `thesherpapros.com` URL renders this card on LinkedIn / X / Facebook / iMessage.

---

## SECTION 9 — Tactical Best Practices

### Caption-overlay strategy

For images that need text overlaid (post templates, reel covers, story templates), the recommended workflow:

- **Generate the visual scaffold in Ideogram** (per the prompts above) — most prompts intentionally leave clean placeholder space for headline / caption / data overlay.
- **Add text in Canva or Figma** using the brand typography:
  - **Display lines (headlines):** Fraunces serif (10pt+ in the final app, 28pt+ in social images)
  - **Body lines (sub-copy, attribution, sourcing):** Manrope sans-serif
- **Color rules for text:**
  - White text on color blocks (sky blue, orange-red, dark navy backgrounds)
  - Dark navy text on cream backgrounds
  - Slate gray for secondary / sub-line copy on cream backgrounds
- **Brand mark on every shareable image:**
  - Small primary wordmark in lower-right OR upper-right corner
  - 18pt minimum
  - Always legible, never decorative-only
- **Caption padding:** minimum 8% from canvas edge (96px on a 1080-wide image, 64px on a 720-wide image)

### Color discipline reminders

- **Sky blue #00A9E0 and orange-red #FF4500 are brand-identification anchors** — use sparingly, never as background washes that overwhelm the eye
- **Most surfaces:** warm cream #FBF7EE background + dark navy #1A1A2E body text + thin sky-blue accent rule for hierarchy
- **Orange-red #FF4500:** reserved for CTAs, "★ NEW" badges, urgent callouts (Wefunder, Founding Pro recruit, milestone announcements). Never as a background wash.
- **NEVER gradient backgrounds** — gradients signal bro-startup / Web3 / SaaS slop. Sherpa Pros is contractor-credible.
- **NEVER neon variants** — a neon sky-blue is not the brand sky-blue. Hold the line on hex values.
- **NEVER drop-shadows on flat-design elements** — only add subtle drop-shadows on text overlaid on photographic backgrounds for legibility (e.g., wordmark over Phyrom-on-jobsite photo).

### When NOT to use AI imagery

AI imagery is for: **backgrounds, atmospheric stills, abstract concepts, template scaffolds.**

AI imagery is NOT for:

- **Real Founding Pro spotlights** → use REAL pro photo + written permission. Permission is in the beta agreement (`docs/operations/beta-cohort-recruiting-kit.md`). Save the screenshot of the DM permission.
- **Phyrom's actual face** → real photo, not AI. The AI press headshot stand-in (Section 8A) is a placeholder ONLY.
- **Real beta cohort milestones** → use real data screenshots (Wefunder dashboard, Stripe Connect screen, beta cohort sign-up tracker), not AI mockups.
- **Real jobsite photos** → use real HJD jobsite captures. Phyrom should block 30 minutes every Sunday for the week's photo capture (per `linkedin-editorial.md` content-capture checklist).
- **Real testimonials / quotes** → use real client / pro language with permission, never AI-generated quotes attributed to a real person.

### Where finished assets live

- `public/social/` — all production-ready social-image PNGs (Phyrom creates this folder; export from Canva at 2x retina)
- `public/social/templates/` — the Ideogram-generated scaffold PNGs before Canva text overlay (so Phyrom can re-template)
- Canva project templates → save in shared Canva workspace under `Sherpa Pros — Social — 2026-Q2`
- Metricool media library → upload winners after Phyrom approves; tag with platform + content pillar for searchable retrieval

### Generation-batching strategy (Ideogram credit efficiency)

- **Batch 4 variants per prompt** in Ideogram (default behavior) — saves credits + makes A/B selection easier
- **Generate template families together** (e.g., all 5 IG Highlight covers in one session, all 8 IG square post templates in one session) — visual family resemblance holds tighter
- **Save prompt history** in a per-asset markdown log → next-quarter Phyrom thanks present-quarter Phyrom
- **Re-generate when palette drifts** — append the locked-color sentence to the prompt and regenerate, do NOT manually color-correct in Photoshop (drift is a sign the prompt needs sharpening)

---

## Brand-bible compliance (read before generating anything)

**Always say** (in any caption, sub-line, or alt text added to these visuals):
- Licensed
- Verified
- Code-aware
- Built by a contractor
- Local / Neighbor
- Jobs, not leads
- National

**Never say** (hard rule per `2026-04-22-gtm-marketing-design.md` §3.3):
- "Wiseman" (internal-only term — externally call it "code validation," "permit assist," "rebate lookup," or "the matching engine")
- Gig / Task
- "Uber for X" externally
- "AI-powered" as a headline
- Disrupt / Revolutionize
- Jargon abbreviations without spelling out (CO, SOV, AR, RFI, etc.)
- "New England marketplace" / "NE-only" / region-anchored brand language (the brand is national; launch geography is operational)
- "the Sherpa Pros app" (ambiguous now that we have multiple products — always specify which: Sherpa Marketplace, Sherpa Hub, Sherpa Home, Sherpa Manager)

**Phyrom's surname is UNKNOWN** — never invent one in any caption, alt text, filename, or attribution line. "Phyrom" only.

**Domain:** every visual that includes a brand-mark URL must use `thesherpapros.com` (never `sherpa-pros-platform.vercel.app`, deprecated as of 2026-04-24).

---

## Constraints (operational rules for this library)

- All prompts use the locked brand color hex values: `#00A9E0` sky blue, `#FF4500` orange-red, `#FFFFFF` white, `#1A1A2E` dark navy, `#FBF7EE` warm cream.
- Every prompt is ready-to-paste into Ideogram with no `[fill in]` placeholders.
- Reference the canonical Sherpa Pros wordmark + icon paths above for any asset where the wordmark appears in the generated image (vs. added in Canva post-generation).
- Cross-references to `social-content-plan.md` Day 1–30 and `linkedin-editorial.md` Wk 1–13 are paired in each section so prompts map directly to scheduled content slots.

---

**End of prompt library v1.0. Iterate via the Brand Guardian agent or pair with a fresh Marketing Content Creator agent run for v2 refinements.**
