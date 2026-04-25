# Sherpa Pros — Ideogram.ai Brand Asset Prompt Library

**Date:** 2026-04-22
**Owner:** Phyrom
**Tool:** [Ideogram.ai](https://ideogram.ai/)
**Brand bible:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` §3 + `docs/slides/06-brand-bible.md`
**Use:** Copy any prompt below directly into Ideogram. Each prompt is ready to paste with no edits required.

---

## How to read this doc

Phyrom — this is your prompt library for generating every visual asset Sherpa Pros needs in Phase 0. Each section gives you 2–6 prompt variants so you can A/B in one Ideogram session. None of these prompts invent new brand elements: they all reuse the canonical sky blue / dark navy / amber / emerald palette and the diagonal-cut wordmark concept. Use the workflow at the bottom (Section 12) to sequence the work — generate the app icon and favicon first, because they anchor the rest of the visual identity.

A few rules before you start:
- Generate 4 at a time, save the prompt with each generation.
- Try with **Magic Prompt OFF first** when you want exact control. Turn it ON for surprise / variation passes.
- Use **v_2** or the latest Ideogram model for icon work.
- Generate icons at **2048×2048** and downscale to 1024×1024 in Preview / Pixelmator — it produces sharper edges than asking Ideogram for 1024 directly.
- For favicons, keep it simple. Anything with more than 2 elements dies at 16 pixels.

---

## 1. Brand visual identity reference (paste at top of any custom prompt)

Use this as the brand context block whenever you write your own prompt for an asset not covered below.

```
Sherpa Pros is a national licensed-trade marketplace built by a working New Hampshire general contractor. Visual identity is tradesperson-credible, not corporate-enterprise. Think Mailchimp's mascot energy meets construction-industry credibility — bold, simple, memorable, plainspoken.

Brand colors (use exactly):
- Sky blue #00a9e0 (primary, used in the SHERPA wordmark)
- Dark navy #1a1a2e (secondary, body text and dark backgrounds)
- Amber #f59e0b (accent, used in the PROS wordmark and CTAs)
- Emerald #10b981 (success, used for verified badges)

Logo style: a two-block wordmark — sky-blue "SHERPA" + amber "PROS" with a diagonal cut between the two words. Modern, geometric, no serifs. The diagonal cut is the signature visual element across the entire brand.

Tone: clean, professional, tradesperson-friendly. NOT slick startup. NOT corporate enterprise. NOT tech-bro. NOT generic stock-construction. Construction-industry credible without being construction-industry generic.

Avoid: stock-photo construction worker imagery, generic blue gradients, tool icons that look like Microsoft clipart, overly slick Silicon Valley aesthetic, hardhat clipart, generic wrench-and-house compositions, lens flares, glossy 3D renders, Shutterstock vibes.
```

---

## 2. App Icon prompts (1024×1024, iOS App Store)

Generate at 2048×2048 in Ideogram and downscale to 1024×1024. iOS auto-rounds the corners — do NOT add rounded corners in the icon itself. Use a solid background (no transparency) — App Store rejects transparent app icons.

### App Icon — Style 1: Bold "S" with diagonal cut

```
A bold geometric letter "S" as an iOS app icon, 1024 by 1024 pixels, square format with sharp corners (iOS will round automatically). The "S" is split diagonally — the upper-left portion is solid sky blue #00a9e0, the lower-right portion is solid amber #f59e0b, with a clean diagonal cut between the two halves. Background is solid dark navy #1a1a2e. The S is centered with comfortable padding (about 12% on each side). Modern sans-serif construction, geometric, slightly heavy weight. Flat design, no gradients, no shadows, no bevels, no glossy effects. Tradesperson-credible, not corporate. Think Mailchimp app icon energy — bold, simple, memorable. No text outside the S itself.
```

### App Icon — Style 2: Hard-hat with diagonal cut

```
A minimalist construction hard-hat silhouette as an iOS app icon, 1024 by 1024 pixels, square format with sharp corners. The hard-hat is split diagonally — left half solid sky blue #00a9e0, right half solid amber #f59e0b, with a clean diagonal cut down the center. Background is solid dark navy #1a1a2e. Hard-hat is centered with 15% padding. Flat geometric design, two colors only inside the hat, no gradients, no shadows, no bevels, no realistic rendering. Construction-credible without being clipart. No face, no body, just the hat shape. Think modern Scandinavian icon design — bold, simple, confident. No text.
```

### App Icon — Style 3: Sherpa mountain peak (the namesake)

```
A stylized mountain peak as an iOS app icon, 1024 by 1024 pixels, square format with sharp corners. Two overlapping triangular peaks — the larger left peak in solid sky blue #00a9e0, the smaller right peak in solid amber #f59e0b, separated by a clean diagonal cut where they meet. Background is solid dark navy #1a1a2e. Peaks are centered with comfortable padding. Flat geometric design, no snow detail, no shading, no gradients, no realistic mountain rendering. Bold, simple, memorable. Subtle reference to Himalayan sherpa — the guide who knows the way — translated to construction trades guidance. Think Patagonia logo simplicity meets app-store icon clarity. No text.
```

### App Icon — Style 4: Geometric tool composition (level + plumb-line + framing square)

```
A geometric composition of three construction tools as an iOS app icon, 1024 by 1024 pixels, square format with sharp corners. Centered: a framing square (L-shape) in sky blue #00a9e0, a level (horizontal bar with bubble) in amber #f59e0b crossing it diagonally, and a plumb line (vertical line with weight) in white. All three tools meet at a central point and are cut diagonally where they overlap. Background is solid dark navy #1a1a2e. Flat design, geometric line-art style, no realistic rendering, no gradients, no shadows. Modern industrial design aesthetic. Think Field Notes brand simplicity. No text.
```

### App Icon — Style 5: Friendly construction-helmet character

```
A friendly minimalist construction-helper mascot as an iOS app icon, 1024 by 1024 pixels, square format with sharp corners. A simple round character wearing a hard hat — head and hat only, no body. Hard hat is split diagonally — left half sky blue #00a9e0, right half amber #f59e0b. Face is two simple dots for eyes and a small confident smile, drawn in dark navy #1a1a2e. Background is a clean cream #f5f1ea (warm off-white) for friendliness. Character is centered with 15% padding. Flat vector style, no gradients, no shadows, no bevels. Approachable and trustworthy — think Mailchimp's Freddie the chimp energy applied to a construction guide character. No text.
```

### App Icon — Style 6: Modernist "SP" monogram with diagonal cut

```
A modernist "SP" monogram as an iOS app icon, 1024 by 1024 pixels, square format with sharp corners. The letters S and P are interlocked geometrically — S in sky blue #00a9e0, P in amber #f59e0b — with a clean diagonal cut where they meet. Background is solid dark navy #1a1a2e. Monogram is centered with comfortable padding (12% on each side). Modern geometric sans-serif, slightly heavy weight, custom-drawn ligature feel. Flat design, no gradients, no shadows, no bevels, no glossy effects. Confident and tradesperson-credible. Think Stripe-quality typography meets construction-industry boldness. No additional text outside the SP.
```

---

## 3. Favicon prompts (32×32 ICO + 16×16 ICO + 512×512 PNG Apple touch icon)

Favicons live or die by simplicity. Anything with more than two visual elements becomes mush at 16 pixels. Generate at 512×512, then export at 32×32 and 16×16 to test legibility before committing.

### Favicon — Style 1: Single letter "S" monogram

```
A single bold letter "S" as a favicon, 512 by 512 pixels, square format. The "S" is split diagonally — upper-left half sky blue #00a9e0, lower-right half amber #f59e0b, with a clean diagonal cut between. Background is solid dark navy #1a1a2e. The S is large, fills 80% of the frame, centered. Heavy geometric sans-serif, optimized to be legible even at 16 pixels. Flat design, no gradients, no shadows, no fine details. The image must remain readable when scaled down to a 16-pixel browser tab favicon. No additional text or elements.
```

### Favicon — Style 2: Single-color silhouette mark

```
A single-color minimal mark as a favicon, 512 by 512 pixels, square format. A bold geometric "S" shape in solid sky blue #00a9e0 on a solid white background. The S has a small diagonal notch cut from the lower-right corner in amber #f59e0b — a single tiny detail that subtly references the brand's diagonal-cut wordmark. Bold weight, fills 75% of the frame, centered. Flat design, no gradients, no shadows. Must remain crisp and recognizable at 16 pixels. No text or other elements.
```

### Favicon — Style 3: Geometric mountain-peak symbol

```
A simple geometric mountain peak as a favicon, 512 by 512 pixels, square format. Two overlapping triangular peaks — left peak sky blue #00a9e0, right peak amber #f59e0b, separated by a clean diagonal cut. Background is solid white. Peaks fill 70% of the frame, centered. Flat design, no shading, no gradients, no detail beyond the two triangle shapes. Must remain legible at 16 pixels in a browser tab. Bold, confident, memorable. No text.
```

---

## 4. Social avatar prompts (400×400 square — LinkedIn / Twitter / Instagram / Facebook)

Same direction as the app icon, but with extra padding so the design survives circular cropping on Twitter and Instagram. Keep the central element inside a 75%-of-frame safe zone.

### Social avatar — Style A: SP monogram for circular crop

```
A modernist "SP" monogram as a social media avatar, 400 by 400 pixels, square format optimized for circular cropping. The letters S and P are interlocked — S in sky blue #00a9e0, P in amber #f59e0b — with a clean diagonal cut where they meet. Background is solid dark navy #1a1a2e. Monogram is centered with extra-generous 18% padding on all sides so the full mark remains visible inside a circular crop on platforms like Twitter and Instagram. Modern geometric sans-serif, slightly heavy weight. Flat design, no gradients, no shadows. Bold and tradesperson-credible. No text outside the SP.
```

### Social avatar — Style B: Single "S" with diagonal cut, circular safe

```
A bold geometric letter "S" as a social media avatar, 400 by 400 pixels, square format optimized for circular cropping. The "S" is split diagonally — upper-left half sky blue #00a9e0, lower-right half amber #f59e0b. Background is solid dark navy #1a1a2e. The S is centered with 18% padding so it remains fully visible inside a circular crop. Heavy geometric sans-serif. Flat design, no gradients, no shadows, no bevels. Memorable at small sizes (down to 32 pixel profile thumbnails on Twitter). No text outside the S.
```

### Social avatar — Style C: Mountain peak in circular safe zone

```
A stylized mountain-peak symbol as a social media avatar, 400 by 400 pixels, square format optimized for circular cropping. Two overlapping triangular peaks — left peak sky blue #00a9e0, right peak amber #f59e0b, separated by a clean diagonal cut. Background is solid dark navy #1a1a2e. Peaks are centered with 18% padding to remain fully visible in a circular crop. Flat geometric design, no shading, no detail. Subtle Himalayan-sherpa-as-construction-guide reference. Bold and confident. No text.
```

### Social avatar — Style D: Friendly mascot for circular crop

```
A friendly minimalist construction-helper mascot as a social media avatar, 400 by 400 pixels, square format optimized for circular cropping. A simple round character wearing a hard hat (head and hat only) — hard hat split diagonally, left half sky blue #00a9e0 right half amber #f59e0b. Face is two dot eyes and a small smile in dark navy #1a1a2e. Background is warm cream #f5f1ea. Character is centered with 18% padding so the full face remains visible inside a circular crop. Approachable and trustworthy. Flat vector style, no gradients. Mailchimp-mascot energy applied to a tradesperson guide. No text.
```

---

## 5. Company logo prompts (wordmark — for landing page header, deck, business cards)

These are wordmark explorations. The current logo (sky-blue SHERPA + amber PROS with diagonal cut) is canonical — these prompts are for the case where Phyrom wants to refresh or generate alternate lockups (stacked, single-color, dark-mode).

### Logo — Style 1: Cleaner version of current wordmark

```
A clean modern wordmark logo for "SHERPA PROS", horizontal lockup, 1600 by 600 pixels, transparent PNG. The word "SHERPA" is in bold sky blue #00a9e0, the word "PROS" is in bold amber #f59e0b. Between the two words is a clean diagonal cut — a sharp angled line that visually separates SHERPA from PROS while implying they're cut from the same block. Modern geometric sans-serif typeface (think Inter, GT America, or Söhne — clean and tradesperson-credible, not corporate). Both words are the same x-height. No additional taglines, no icon, no flourishes. White space around the wordmark. Flat design, no gradients, no shadows, no bevels.
```

### Logo — Style 2: Single-color variant for engraving / one-color print

```
A single-color version of the "SHERPA PROS" wordmark logo, horizontal lockup, 1600 by 600 pixels, transparent PNG. Both "SHERPA" and "PROS" are in solid dark navy #1a1a2e — same color, same weight. The diagonal cut between the two words is preserved as a thin negative-space gap (transparent), so the diagonal is the only visual differentiator between the two words. Modern geometric sans-serif typeface, bold weight. Use this on light backgrounds, embroidery, single-color print, hard-hat stickers. Flat design, no gradients, no shadows.
```

### Logo — Style 3: Stacked variant for dark backgrounds

```
A stacked vertical wordmark logo for "SHERPA PROS", 1000 by 1000 pixels, transparent PNG, optimized for dark backgrounds. "SHERPA" sits on the top line in sky blue #00a9e0; "PROS" sits on the bottom line in amber #f59e0b. A clean diagonal cut (a thin angled line in white) separates the two stacked words horizontally — angled from upper-left to lower-right. Modern geometric sans-serif, bold weight, both words the same x-height. Centered, white space all around. Flat design, no gradients, no shadows. Use on dark navy or black backgrounds, app splash screen, dark-mode site header, hoodie chest print.
```

---

## 6. Hero / header image prompts (landing page hero, social cover photos)

For the landing page above-the-fold image and Twitter / LinkedIn cover photos. Anti-stock-photo guardrails are critical — Phyrom is a working contractor and the imagery has to feel earned, not licensed.

### Hero — Style 1: Photorealistic anonymous tradesperson

```
A photorealistic medium-format photograph of a working tradesperson on a residential construction jobsite, 1920 by 1080 pixels, landscape. Composition: shoulders-down view, no face visible — focus on weathered hands holding a clipboard, a tape measure clipped to a leather tool belt, sawdust on a flannel sleeve. Background is softly out-of-focus residential interior framing — visible 2x4 wall studs and a partial window opening. Natural daylight from a window, golden-hour warmth, slight haze. Color palette is muted earth tones with a small accent of sky blue #00a9e0 (a tape measure or pencil). Documentary photo style, not stock. Think Magnum Photos meets construction trade. NOT generic Shutterstock construction-worker imagery. NOT a smiling person looking at the camera. NOT high-vis vests. Real working hands, real materials, real light. No text in the image.
```

### Hero — Style 2: Illustrated abstract construction scene

```
An illustrated abstract construction scene as a landing page hero image, 1920 by 1080 pixels, landscape. Geometric flat-design illustration of a residential house cross-section — visible studs, plumbing lines, electrical wiring, a roof peak — composed of overlapping geometric shapes in the brand palette: sky blue #00a9e0 for primary structures, amber #f59e0b for accent details (windows, electrical), dark navy #1a1a2e for shadow and outline, emerald #10b981 for verified-check accents, warm cream #f5f1ea background. A subtle diagonal cut runs through the composition. Modern editorial illustration style — think New York Times opinion-page illustrations or The Atlantic feature graphics. Confident, clean, NOT clipart. No people. No text in the image.
```

### Hero — Style 3: Dark navy with floating tools

```
A dark navy editorial composition as a landing page hero, 1920 by 1080 pixels, landscape. Solid dark navy #1a1a2e background. Floating in the composition: a level (in sky blue #00a9e0), a framing square (in amber #f59e0b), a plumb line (in white), and a small emerald #10b981 checkmark badge — each tool slightly tilted, arranged in a loose diagonal that runs from upper-left to lower-right (echoing the brand's diagonal cut). Tools are stylized flat geometric shapes, not photorealistic. Subtle drop shadows. Generous negative space around the tools so headline text can be overlaid in post. Modern editorial design — think Stripe, Linear, or Vercel hero compositions translated to construction trades. No text in the image.
```

---

## 7. Product-specific icons (the 4-product portfolio per Wave 6.2)

These icons must feel like a family — same construction grammar, same color palette — while being instantly distinguishable. Generate all four in a single Ideogram session so the family resemblance holds. Use the same overall framing (square, padded, flat geometric, two-color-plus-accent) for all four.

### Product Icon — Sherpa Marketplace

```
A flat geometric icon for the "Sherpa Marketplace" product, 512 by 512 pixels, square format. Two interlocking shapes: a stylized contractor toolbelt silhouette in sky blue #00a9e0 on the left, a small house silhouette in amber #f59e0b on the right, joined by a clean diagonal cut between them. Background is warm cream #f5f1ea. Flat geometric design, single-line-weight, no gradients, no shadows. Centered with 12% padding. Modern, tradesperson-credible, instantly readable. The visual concept: pros (toolbelt) connecting with homes (house) through a clean diagonal exchange. Part of a 4-icon product family — share the same flat geometric grammar as Hub, Home, and Manager icons. No text.
```

### Product Icon — Sherpa Hub (warehouse / pickup location)

```
A flat geometric icon for "Sherpa Hub" — a physical pickup location for pros, 512 by 512 pixels, square format. A simple warehouse / depot silhouette: a wide low building with a slanted roof and a single roll-up door in the center, drawn in sky blue #00a9e0 outline with the door in amber #f59e0b. A small diagonal cut runs across the building's facade as a brand-consistent detail. Background is warm cream #f5f1ea. Flat geometric design, single-line-weight, no gradients, no shadows. Centered with 12% padding. Part of a 4-icon product family with Marketplace, Home, and Manager — share the same grammar. The visual concept: physical pickup point where pros grab materials. No text.
```

### Product Icon — Sherpa Home (subscription / homeowner)

```
A flat geometric icon for "Sherpa Home" — a homeowner subscription service, 512 by 512 pixels, square format. A simple residential house silhouette (peaked roof, single door, single window), drawn in sky blue #00a9e0 outline with a small amber #f59e0b heart or shield in the upper window — implying ongoing care and protection. A subtle diagonal cut runs across the roof line as a brand-consistent detail. Background is warm cream #f5f1ea. Flat geometric design, single-line-weight, no gradients, no shadows. Centered with 12% padding. Part of a 4-icon product family — share the grammar of Marketplace, Hub, and Manager. The visual concept: ongoing care for the home itself. No text.
```

### Product Icon — Sherpa Manager (concierge / human service)

```
A flat geometric icon for "Sherpa Manager" — a human concierge service for property managers, 512 by 512 pixels, square format. A simple stylized person silhouette (head and shoulders, no facial features) wearing a small headset, drawn in sky blue #00a9e0, with a small amber #f59e0b clipboard or checkmark badge to the right of the figure. A subtle diagonal cut behind the figure as a brand-consistent detail. Background is warm cream #f5f1ea. Flat geometric design, single-line-weight, no gradients, no shadows. Centered with 12% padding. Part of a 4-icon product family — share the grammar of Marketplace, Hub, and Home. The visual concept: a real human guide managing the work for a property manager. No text.
```

---

## 8. Founding Pro badge (in-app + marketing)

The "Founding Pro" badge is the permanent visual marker for the beta cohort. It needs to feel earned — like a varsity letter or a guild patch — not like a participation trophy.

### Founding Pro — Style 1: Mountain peak + wordmark

```
A circular badge for "Founding Pro" status, 800 by 800 pixels, transparent PNG. Outer ring: solid dark navy #1a1a2e with the words "FOUNDING PRO" in white bold sans-serif arched along the top of the ring and "EST. 2026" arched along the bottom. Inner field: a stylized mountain peak — left peak sky blue #00a9e0, right peak amber #f59e0b, with a clean diagonal cut between. Below the peak inside the ring: a small emerald #10b981 checkmark. Heavy geometric sans-serif typography, tradesperson-credible. Think a guild patch or a varsity letter — earned, not decorative. Flat design, no gradients, no shadows, no glossy effects. Small enough for a profile-card chip; large enough for a hoodie embroidery file.
```

### Founding Pro — Style 2: Shield with "F" + diagonal cut

```
A shield-shaped badge for "Founding Pro" status, 800 by 800 pixels, transparent PNG. Classic shield silhouette in solid dark navy #1a1a2e. Inside the shield: a large bold letter "F" split diagonally — upper-left half sky blue #00a9e0, lower-right half amber #f59e0b. A small banner across the bottom of the shield reads "FOUNDING PRO" in white bold sans-serif, with "EST. 2026" in smaller text below. Heavy geometric typography, slightly retro tradesperson-club aesthetic. Flat design, no gradients, no realistic shading, no metallic effects. Think a fire-department badge or a steelworker union patch. Earned, not decorative. Suitable for in-app profile chip and embroidered hoodie patch.
```

### Founding Pro — Style 3: Hard-hat with mountain accent

```
A circular badge for "Founding Pro" status, 800 by 800 pixels, transparent PNG. Outer ring: solid dark navy #1a1a2e with "FOUNDING PRO" arched along the top and "SHERPA PROS" arched along the bottom in white bold sans-serif. Inner field: a hard-hat silhouette in sky blue #00a9e0 with a small mountain peak in amber #f59e0b rising behind it — combining the construction-trades hard hat with the Himalayan-sherpa namesake. A small emerald #10b981 checkmark on the hat itself. Flat geometric design, no gradients, no shadows. Tradesperson-club aesthetic — guild patch, not Silicon Valley sticker. Suitable for in-app profile chip, embroidered patch, sticker.
```

---

## 9. Old-House Verified badge (the trademark we're filing — USPTO)

This badge appears on listings, in marketing, and ultimately on a USPTO trademark filing. It needs to be visually distinct from the Founding Pro badge so the two never get confused, and it needs to convey "this pro understands plaster, lath, knob-and-tube, slate, and pre-1950 housing." Hyphenated as "Old-House Verified" — the hyphen is canonical.

### Old-House Verified — Style 1: Vintage seal

```
A vintage-seal-style badge for "Old-House Verified", 800 by 800 pixels, transparent PNG. Circular seal with a dark-navy #1a1a2e ribbon ring containing the words "OLD-HOUSE VERIFIED" arched along the top in white bold sans-serif and "SHERPA PROS" arched along the bottom. Inner field: a small Victorian-style house silhouette (steep gabled roof, ornamental gingerbread trim, a single chimney) in sky blue #00a9e0, with a small emerald #10b981 checkmark in the lower-right of the house. A subtle amber #f59e0b accent on the chimney smoke or the front door. Heavy bold typography, slightly retro craftsmanship feel — think a state historical-society plaque crossed with a modern verification badge. Flat design, no gradients, no realistic shading. The hyphen in "Old-House" is mandatory and must be visible.
```

### Old-House Verified — Style 2: Modern minimal badge

```
A modern minimal verification badge for "Old-House Verified", 800 by 800 pixels, transparent PNG. Rounded rectangle in solid sky blue #00a9e0. Inside the rectangle, left-aligned: a small Victorian-house silhouette icon in white. Right of the icon: the words "OLD-HOUSE VERIFIED" stacked on two lines in white bold sans-serif. A small amber #f59e0b diagonal accent line runs vertically between the icon and the text — echoing the brand's diagonal-cut signature. A small emerald #10b981 checkmark in the upper-right corner of the badge. Modern, clean, tradesperson-credible. Flat design, no gradients, no shadows. The hyphen in "Old-House" is mandatory and must be visible. Suitable for use on listing cards, landing page social proof, and marketing materials.
```

### Old-House Verified — Style 3: Brick + window + checkmark composition

```
A composition-style badge for "Old-House Verified", 800 by 800 pixels, transparent PNG. Square format with rounded corners. Inside the badge: a small section of historic brick wall in muted brick red, with a single double-hung window with divided lights drawn over it in sky blue #00a9e0. Below the window: the words "OLD-HOUSE VERIFIED" in dark navy #1a1a2e bold sans-serif, with "SHERPA PROS" in smaller amber #f59e0b text below. An emerald #10b981 checkmark sits in the upper-right corner of the badge as a verification mark. The hyphen in "Old-House" is mandatory and must be visible. Flat geometric design with subtle texture on the brick only — no realistic shading on anything else, no gradients, no glossy effects. Think Pre-War-NYC building plaque crossed with a modern verification badge.
```

---

## 10. General Ideogram prompt template (adapt for any future asset)

When you need to generate something not covered above, paste this as a starting block and fill in the bracketed sections.

```
[Asset type — e.g., "A flat geometric icon for X" or "A photorealistic image of Y"] for Sherpa Pros, [size in pixels, e.g., 1024 by 1024], [format — square / landscape / portrait], [transparency — solid background or transparent PNG].

Sherpa Pros is a national licensed-trade marketplace built by a working New Hampshire general contractor. Visual identity is tradesperson-credible, not corporate-enterprise.

Brand colors (use exactly):
- Sky blue #00a9e0 (primary)
- Dark navy #1a1a2e (secondary)
- Amber #f59e0b (accent)
- Emerald #10b981 (success / verified)

Visual signature: a clean diagonal cut between two color blocks (echoes the SHERPA + PROS wordmark).

Style: clean, modern, bold, simple, memorable. Flat design, no gradients, no shadows, no bevels, no glossy effects, no realistic 3D rendering unless explicitly required.

[SPECIFIC DIRECTION: describe the actual subject of the image here — what's in it, where it's positioned, what colors go where, what the visual concept is.]

Avoid: stock-photo construction worker imagery, generic blue gradients, tool icons that look like Microsoft clipart, overly slick Silicon Valley aesthetic, hardhat clipart, generic wrench-and-house compositions, lens flares, glossy 3D renders, Shutterstock vibes, smiling-person-looking-at-camera tropes.

[Additional constraints — e.g., "must remain legible at 16 pixels" / "no text in the image" / "centered with 15% padding" / "transparent background"]
```

---

## 11. Tips for using Ideogram

- **Model:** use v_2 or the latest Ideogram model for icon work — earlier models produce mushier edges.
- **Magic Prompt:** turn it OFF when you want exact control (rare for refinements), turn it ON when you want surprise / stylistic variation (common for first-pass exploration).
- **Generate 4 at a time.** Ideogram batches by default. Save the prompt with each generation so you can iterate from the strongest variant.
- **For app icons:** generate at 2048×2048 and downscale to 1024×1024 in Preview / Pixelmator. Direct-to-1024 generation produces softer edges.
- **For favicons:** simpler is better. Anything more than 2 visual elements becomes mush at 16 pixels. Test the export at 16×16 in your browser tab before shipping.
- **For badges / wordmarks:** generate with transparent background (Ideogram supports it via prompt — say "transparent PNG"). Verify in Preview that the alpha channel is preserved.
- **For photorealistic hero images:** use detailed lighting and composition direction. Anti-stock-photo guardrails matter — explicitly say "documentary style, not stock" and "no faces visible" if you want anonymous-tradesperson framing.
- **Iterate by remixing:** Ideogram lets you "remix" an existing generation with a tweaked prompt. Use this to refine the strongest variant from a batch instead of starting from scratch.
- **Save the prompt history.** Build a per-asset markdown file with each prompt + which generation Phyrom picked. Future-you will thank present-you.
- **Stay on palette.** When Ideogram drifts off-palette (it sometimes adds purple or teal), append: *"Use ONLY these four colors and white/cream: #00a9e0, #1a1a2e, #f59e0b, #10b981. No other colors."*

---

## 12. Workflow recommendation (3-day sequence)

**Day 1 — Anchor the brand visually (the one-day push).**
1. Generate 4 variants per category for: app icon, favicon, social avatar = 12+ images.
2. Phyrom picks the top 2 in each category.
3. Lock the app-icon direction first — it cascades into favicon, social avatar, and product icons.

**Day 2 — Refine + extend to product family.**
1. Generate 4 refinements of each top-2 variant per category = 8 more images.
2. Pick the winner per category (app icon, favicon, social avatar).
3. Once the app icon is locked, generate the 4 product-specific icons in a single batch so the family resemblance holds.
4. Generate the Founding Pro badge variants (3 styles × 1 batch each = 12 images, pick 1).
5. Generate the Old-House Verified badge variants (3 styles × 1 batch each = 12 images, pick 1).

**Day 3 — Brand Guardian review + ship.**
1. Brand Guardian agent runs visual-consistency audit across all 6 final assets (app icon, favicon, social avatar, product family, Founding Pro badge, Old-House Verified badge).
2. Verify against bible §3.5 (visual identity — colors, diagonal cut, no off-palette drift).
3. Export and integrate into `public/icons/`, `public/manifest.json`, social profiles, landing page header, in-app badge components.

**Total:** 40+ images generated, 6–8 final assets shipped. Estimated Phyrom time: 4–6 hours over 3 days.

**Sequencing reasoning:** the app icon is the highest-leverage asset because it sets the visual grammar for everything else. Generate it first. Once it's locked, every downstream asset (favicon, social avatar, product icons, badges) has a fixed reference point. Generating the product-icon family after the app icon is locked also reduces the risk that the four product icons feel disconnected from the parent brand.

---

## 13. Brand-bible compliance notes (read before generating)

- **Plainspoken, founder-voiced** — these prompts intentionally read like Phyrom wrote them (because they're *for* Phyrom). Don't dress them up with marketing-speak in future revisions.
- **Always say:** Licensed · Verified · Code-aware · Built by a contractor · Local · National. (If you're writing alt text or filenames, lean on these words.)
- **Never say:** "Wiseman" externally · "AI-powered" as headline · Disrupt · Revolutionize · Region-anchored brand language ("New England marketplace"). Ideogram doesn't generate copy in the image (we're prompting visual-only) but if you're naming files, naming generations, or writing alt text, hold the line.
- **Phyrom's surname is UNKNOWN** — don't invent one in any filename or alt text. "Phyrom" only.
- **Tradesperson-credible visual style is non-negotiable** — no startup-bro polish, no glossy 3D renders, no Shutterstock smiling-construction-worker imagery, no Silicon Valley aesthetic.

---

**End of prompt library. Questions or revisions: ping the Brand Guardian agent.**
