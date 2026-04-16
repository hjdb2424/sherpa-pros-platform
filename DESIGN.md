# Sherpa Pros Design System

## 1. Visual Theme & Atmosphere

Sherpa Pros is a construction marketplace that moves like a ride-share app — fast, trustworthy, no friction. The visual language blends Uber's confident density with the atmospheric depth of a premium SaaS platform. Dark navy surfaces establish authority and trust (you're hiring someone to enter your home), while amber accents create warmth and urgency (the work needs doing now).

The overall feel is **commanding but approachable** — a platform that's clearly built by people who understand construction, not a generic marketplace template. Every screen should feel like opening a well-built tool: weighty, precise, satisfying to use. The mobile experience is primary — contractors are on job sites, clients are standing in their flooded basements. Every tap matters.

**Key Characteristics:**
- Dark navy (`#1a1a2e`) hero and CTA sections with atmospheric gradient depth
- Amber (`#f59e0b`) as the primary action color — warm, urgent, impossible to miss
- Pill-shaped buttons (rounded-full) for all primary actions — thumb-friendly, Uber-inspired
- Atmospheric glow effects (radial gradients, blur-3xl) for visual depth without clutter
- Glass morphism on sticky nav (backdrop-blur-md, bg-opacity)
- Card-based layouts with subtle ring borders and hover state transitions
- Gradient text for hero headlines (amber-400 → amber-500 clip)
- White content sections between dark anchoring sections — alternating rhythm
- 8px spacing grid, compact and efficient — construction pros don't scroll for fun

## 2. Color Palette & Roles

### Brand Core
- **Sherpa Navy** (`#1a1a2e`): The defining brand surface — hero backgrounds, navbar, footer, CTA sections. Deep, authoritative, trustworthy.
- **Navy Mid** (`#16213e`): Hover state for navy surfaces. Subtle lightening for interactive feedback.
- **Navy Deep** (`#0f172a`): Emergency/insurance sections. Darker than brand navy for high-stakes contexts.
- **Pure White** (`#ffffff`): Primary content surface. Clean, open, breathable.

### Action Colors
- **Amber Primary** (`#f59e0b`): THE action color. Primary CTAs, logo accent, slider thumbs, badge highlights. Warm, urgent, unmissable.
- **Amber Light** (`#fbbf24`): Hover state for amber buttons. Slightly brighter, more energetic.
- **Amber Glow** (`rgba(245, 158, 11, 0.25)`): Shadow color for amber CTAs. Creates warmth beneath buttons.
- **Amber Soft** (`rgba(245, 158, 11, 0.10)`): Badge backgrounds, subtle amber tinting, glow effects.

### Status & Semantic
- **Emerald** (`#10b981`): Success, verified, positive trends, "For Pros" sections. Trust signal.
- **Emerald Light** (`#d1fae5` / `bg-emerald-50`): Soft background for emerald badges and positive callouts.
- **Red Alert** (`#ef4444`): Emergency dispatch, urgent states, destructive actions.
- **Red Soft** (`rgba(239, 68, 68, 0.10)`): Emergency badge backgrounds, red glow effects.
- **Blue Info** (`#2563eb`): Service area, maps, informational badges.
- **Blue Soft** (`#eff6ff` / `bg-blue-50`): Info badge backgrounds, map section tinting.

### Neutral Scale
- **Zinc 900** (`#18181b`): Primary text on light surfaces. Near-black for maximum readability.
- **Zinc 700** (`#3f3f46`): Secondary body text on light surfaces.
- **Zinc 600** (`#52525b`): Descriptive text, longer paragraphs.
- **Zinc 500** (`#71717a`): Tertiary text, labels, metadata.
- **Zinc 400** (`#a1a1aa`): Body text on dark surfaces. Light enough to read, not white.
- **Zinc 300** (`#d4d4d8`): Nav links on dark backgrounds. Interactive text on dark.
- **Zinc 200** (`#e4e4e7`): Light borders, dividers on white surfaces.
- **Zinc 100** (`#f4f4f5`): Card borders, subtle separation.
- **Zinc 50** (`#fafafa` / `bg-zinc-50`): Alternate section backgrounds (testimonials).
- **Slate 50** (`#f8fafc` / `bg-slate-50`): Card gradient start, subtle warm-cool shift.

### Borders & Separation
- **White/10** (`rgba(255, 255, 255, 0.10)`): Borders on dark surfaces (navbar, dark cards).
- **Zinc 100 border** (`border-zinc-100`): Card borders on white surfaces. Ghost-light.
- **Zinc 200 border** (`border-zinc-200`): Stronger card borders, map containers, city pills.
- **Amber 200 border** (`border-amber-200`): Hover state for cards, expansion CTA callouts.
- **Zinc 800 border** (`border-zinc-800`): Card borders on dark sections (emergency cards).

### Shadows & Depth
- **Shadow SM** (`shadow-sm`): Default card elevation on white — barely there.
- **Shadow MD** (`shadow-md`): Hover state elevation — noticeable lift.
- **Shadow LG** (`shadow-lg`): Primary CTAs, important cards, Pro earnings preview.
- **Shadow XL** (`shadow-xl`): Hover state for primary CTAs — dramatic lift on interaction.
- **Amber Shadow** (`shadow-amber-500/25`): Amber CTA glow — warm pool beneath the button.
- **Amber Shadow Hover** (`shadow-amber-500/30`): Intensified glow on hover.

### Gradient System
- **Hero gradient**: `bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e]` — subtle navy depth
- **Headline gradient**: `bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent` — amber text glow
- **Card gradient**: `bg-gradient-to-br from-slate-50 to-white` — warm-to-cool subtle card fill
- **Map gradient**: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50` — geographic coolness
- **Atmospheric glow**: Radial amber/blue circles with `blur-3xl` for depth without weight

## 3. Typography Rules

### Font Family
- **Primary**: `Geist Sans` (Next.js default via `next/font/local`)
- **Mono**: `Geist Mono` (code, data values)
- **Fallback**: `system-ui, -apple-system, sans-serif`

*Geist is geometric, contemporary, and highly legible at small sizes — ideal for a mobile-first tool. Do NOT substitute Inter (too generic) or serif fonts (wrong energy).*

### Hierarchy

| Role | Size | Weight | Line Height | Tracking | Color (light bg) | Color (dark bg) |
|------|------|--------|-------------|----------|-------------------|-----------------|
| Hero Display | 48-60px (`text-4xl sm:text-5xl lg:text-6xl`) | 700 (bold) | tight (1.1-1.2) | `tracking-tight` | zinc-900 | white |
| Section Heading | 30-36px (`text-3xl sm:text-4xl`) | 700 (bold) | tight | — | zinc-900 | white |
| Card Title | 20px (`text-xl`) | 700 (bold) | normal | — | zinc-900 | white |
| Subsection | 18px (`text-lg`) | 600 (semibold) | normal | — | zinc-900 | white |
| Body Large | 18-20px (`text-lg sm:text-xl`) | 400 (normal) | relaxed (1.625) | — | zinc-600 | zinc-400 |
| Body | 16px (`text-base`) | 400-500 | relaxed | — | zinc-700 | zinc-300 |
| Body Small | 14px (`text-sm`) | 400-500 | relaxed | — | zinc-600 | zinc-400 |
| Caption | 12px (`text-xs`) | 500 (medium) | normal | — | zinc-500 | zinc-400 |
| Badge Text | 12-14px (`text-xs sm:text-sm`) | 500 (medium) | normal | — | contextual | contextual |
| Stat Value | 18px (`text-lg`) | 700 (bold) | normal | — | zinc-900 | white |
| Step Number | 12px (`text-xs`) | 700 (bold) | normal | — | amber-500 on navy | — |

### Principles
- **Bold headlines, regular body**: Headlines are always 700. Body text is 400-500. Never use bold for paragraphs.
- **Tight headline spacing**: Hero and section headings use `leading-tight` or `tracking-tight`. Compact and punchy.
- **Relaxed body spacing**: Body text uses `leading-relaxed` (1.625). Readable at mobile sizes.
- **Gradient headlines**: Hero H1 uses amber gradient clip for the key phrase. ONE gradient span per heading maximum.
- **No decorative type**: No letter-spacing tricks, no text-transform except badges (uppercase + tracking-wider for state abbreviations).

## 4. Component Stylings

### Buttons

**Primary Amber (Main CTA)**
- Background: Amber Primary (`bg-amber-500`)
- Text: Sherpa Navy (`text-[#1a1a2e]`) — dark on bright, not white
- Padding: `px-8 py-3.5`
- Radius: `rounded-full` (pill)
- Shadow: `shadow-lg shadow-amber-500/25`
- Hover: `hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/30`
- Font: `text-base font-semibold`
- Width: `w-full sm:w-auto` (full on mobile, auto on desktop)

**Secondary Navy**
- Background: Sherpa Navy (`bg-[#1a1a2e]`)
- Text: White (`text-white`)
- Padding: `px-8 py-3.5`
- Radius: `rounded-full` (pill)
- Shadow: `shadow-lg`
- Hover: `hover:bg-[#16213e] hover:shadow-xl`
- Font: `text-base font-semibold`

**Ghost (on dark surfaces)**
- Background: transparent
- Text: White (`text-white`)
- Border: `border border-zinc-600`
- Padding: `px-8 py-3.5`
- Radius: `rounded-full` (pill)
- Hover: `hover:border-zinc-400 hover:bg-white/5`
- Font: `text-base font-semibold`

**Chip / City Pill**
- Background: `bg-zinc-50`
- Text: `text-zinc-700`
- Border: `border border-zinc-200`
- Padding: `px-4 py-1.5`
- Radius: `rounded-full`
- Font: `text-sm font-medium`

**Nav CTA (compact)**
- Background: `bg-amber-500`
- Text: `text-[#1a1a2e]`
- Padding: `px-5 py-2`
- Radius: `rounded-full`
- Hover: `hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25`
- Font: `text-sm font-semibold`

### Cards & Containers

**Standard Card (light surface)**
- Background: `bg-white`
- Border: `border border-zinc-100`
- Radius: `rounded-2xl`
- Shadow: `shadow-sm`
- Padding: `p-8`
- Hover: `hover:border-amber-200 hover:shadow-md` (when interactive)

**Dark Card (emergency/dark sections)**
- Background: `bg-zinc-900/50`
- Border: `border border-zinc-800`
- Radius: `rounded-2xl`
- Padding: `p-6`
- Backdrop: `backdrop-blur-sm`
- Hover: `hover:border-zinc-700`

**Preview/Feature Card (gradient)**
- Background: `bg-gradient-to-br from-slate-50 to-white`
- Border: `border border-zinc-200`
- Radius: `rounded-2xl`
- Shadow: `shadow-lg`
- Padding: `p-8 sm:p-10`

**Stat Row (inside cards)**
- Background: `bg-white`
- Ring: `ring-1 ring-zinc-100`
- Radius: `rounded-lg`
- Shadow: `shadow-sm`
- Padding: `px-4 py-3`

### Badges & Pills

**Status Badge (generic pattern)**
- Container: `inline-flex items-center gap-2`
- Background: contextual-50 (amber-50, emerald-50, blue-50, red-50)
- Border: contextual-200 (amber-200, emerald-200, blue-200, red-500/30)
- Radius: `rounded-full`
- Padding: `px-4 py-1.5`
- Text: `text-xs sm:text-sm font-medium` in contextual-700 (or contextual-400 on dark)
- Optional: icon (h-4 w-4) + dot indicator (h-2 w-2 rounded-full)

**Step Counter**
- Container: `absolute -top-4 left-8`
- Background: `bg-[#1a1a2e]`
- Size: `h-8 w-14`
- Radius: `rounded-full`
- Text: `text-xs font-bold text-amber-500`

### Inputs & Forms
- Text: `text-zinc-900`
- Background: `bg-white`
- Border: `border border-zinc-200` (light), `border border-zinc-700` (dark)
- Radius: `rounded-lg` (standard inputs), `rounded-2xl` (search/hero inputs)
- Focus: `focus:ring-2 focus:ring-amber-500 focus:border-amber-500`
- Placeholder: `text-zinc-400`

### Navigation

**Sticky Navbar**
- Position: `sticky top-0 z-50`
- Background: `bg-[#1a1a2e]/95 backdrop-blur-md`
- Border bottom: `border-b border-white/10`
- Logo: amber square (rounded-lg) + "Sherpa" white + "Pros" amber
- Links: `text-sm font-medium text-zinc-300 hover:text-white`
- Mobile: hamburger → slide-down panel with `bg-[#1a1a2e]`

**Icon Styling**
- Use `@heroicons/react/24/outline` for UI icons
- Standard size: `h-6 w-6` (nav/cards), `h-4 w-4` (badges/inline), `h-8 w-8` (feature blocks), `h-10 w-10` (hero icons)
- Feature icon containers: `rounded-xl bg-amber-50 text-amber-600` (light) or `rounded-2xl bg-amber-500 text-[#1a1a2e]` (accent)
- Hover: `group-hover:bg-amber-100` for icon backgrounds in interactive cards
- NEVER use emojis — always use Heroicons or custom SVG

### Image & Illustration Treatment
- Map containers: gradient bg with centered icon placeholder until Mapbox loads
- Card imagery: `rounded-2xl` for hero, `rounded-lg` for thumbnails
- Avatar/Pro photos: `rounded-full` with ring border
- Decorative elements: radial glow blobs (`rounded-full bg-amber-500/10 blur-2xl`)

## 5. Layout Principles

### Spacing System
- Base unit: 4px (Tailwind default)
- Component internal padding: `p-6` (compact) to `p-8` (standard) to `p-10` (featured)
- Section vertical padding: `py-20 sm:py-28` — generous breathing room
- Section horizontal padding: `px-4 sm:px-6 lg:px-8`
- Card gaps: `gap-8` (grid), `gap-4` (stat rows), `gap-6` (dark cards)
- Badge/pill gaps: `gap-2` (inline), `flex-wrap gap-2` (city pills)
- CTA button gaps: `gap-4` (stacked on mobile, row on desktop)

### Grid & Container
- Max width: `max-w-7xl mx-auto` (1280px)
- Content max: `max-w-5xl` (grids), `max-w-3xl` (hero text), `max-w-2xl` (section headers)
- Standard grid: `grid sm:grid-cols-3 gap-8` (3-col features)
- Feature grid: `grid lg:grid-cols-2 gap-12 lg:gap-16` (text + visual)
- Testimonials: `grid sm:grid-cols-2 lg:grid-cols-3 gap-8`

### Section Rhythm (top to bottom)
1. **Dark hero** (navy) — gradient bg, centered text, dual CTAs, stats
2. **White section** — How It Works cards
3. **White section** — Comparison table
4. **White section** — For Pros (2-col with feature card)
5. **Dark section** (deep navy) — Emergency/Insurance
6. **White section** — Hub Map / Service Area
7. **Light section** (zinc-50) — Testimonials
8. **Dark CTA** (navy) — Final call-to-action
9. **Dark footer** (navy) — Links, brand, legal

### Whitespace Philosophy
- **Efficient, not airy**: Like Uber, density is intentional. Construction pros are busy. Don't waste screen space.
- **Generous section breaks**: Sections breathe (`py-20 sm:py-28`), but within sections content is compact.
- **Mobile-first stacking**: 2-3 column grids collapse to single column. Buttons go full-width. Cards stack vertically.

### Border Radius Scale
- Inputs / stat rows: `rounded-lg` (8px)
- Standard cards: `rounded-2xl` (16px)
- Logo icon: `rounded-lg` (8px)
- Feature icon bg: `rounded-xl` (12px)
- Buttons / badges / pills: `rounded-full` (9999px)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Text sections, dark surfaces, inline content |
| Whisper | `shadow-sm` + `ring-1 ring-zinc-100` | Stat rows, subtle cards |
| Standard | `shadow-sm` + `border border-zinc-100` | Feature cards on white |
| Lifted | `shadow-md` | Card hover state |
| Prominent | `shadow-lg` | Feature preview cards, amber CTAs |
| Dramatic | `shadow-xl` | CTA hover state |
| Glow | `shadow-lg shadow-amber-500/25` | Amber buttons — warm light pool |
| Glass | `bg-[#1a1a2e]/95 backdrop-blur-md` | Sticky navbar |
| Atmospheric | `blur-3xl` radial circles | Background ambiance — navy, amber, blue, red |
| Backdrop | `backdrop-blur-sm bg-zinc-900/50` | Dark surface cards over glow effects |

**Depth Philosophy**: Sherpa Pros uses shadow AND atmospheric glow — not one or the other. White surfaces use traditional shadow for card lift. Dark surfaces use colored radial blurs for depth. The amber CTA glow (`shadow-amber-500/25`) is a signature detail — buttons feel like they emit warmth.

## 7. Motion & Interaction

### Transitions
- **All interactive elements**: `transition-all` as the default. Never skip transitions.
- **Button hover**: background color shift + shadow intensification (150-200ms)
- **Card hover**: border color change (`hover:border-amber-200`) + shadow lift (`hover:shadow-md`)
- **Nav links**: `transition-colors` for text color shifts
- **Icon containers**: `transition-colors group-hover:bg-amber-100`

### Animations
- **fadeSlideIn**: Messages/cards entering — `translateY(6px)` to `0` with opacity
- **slideUp**: Chat windows, bottom sheets — `translateY(100%)` to `0`
- **bounceIn**: Notifications, badges appearing — `scale(0.3)` → `scale(1.1)` → `scale(1)`
- **Range slider thumb**: `transform: scale(1.15)` on hover

### Motion Principles
- Every state change should be visible — no instant swaps
- Hover states always provide feedback (color, shadow, or border change)
- Page transitions should feel snappy — 150-300ms max
- Emergency flows use faster, more urgent transitions
- Mobile: respect `prefers-reduced-motion`

## 8. Do's and Don'ts

### Do
- Use Sherpa Navy (`#1a1a2e`) for hero and CTA sections — it IS the brand
- Use amber-500 for ALL primary action buttons — the warm glow is a signature
- Put dark text (`text-[#1a1a2e]`) on amber buttons — not white
- Use `rounded-full` for every button and badge — the pill shape is identity
- Add atmospheric glow (radial gradients + blur-3xl) behind dark sections
- Use gradient text (`from-amber-400 to-amber-500 bg-clip-text`) for hero emphasis
- Keep the glass nav (`backdrop-blur-md bg-opacity-95`)
- Use Heroicons outline (24px) for all UI icons
- Design mobile-first — every layout starts as single column
- Use `shadow-amber-500/25` on primary CTAs — the warm shadow is a signature detail
- Alternate dark/white sections for visual rhythm

### Don't
- Don't use pure black (`#000000`) — Sherpa Navy is always the dark color
- Don't use Inter or generic sans-serif — Geist Sans is the font
- Don't use emojis for icons — always Heroicons or custom SVG
- Don't make buttons without rounded-full — square buttons break the identity
- Don't put white text on amber buttons — it's always navy text
- Don't skip hover states — every interactive element needs visible feedback
- Don't use flat shadows on dark surfaces — use atmospheric glow instead
- Don't over-animate — construction audience values speed over spectacle
- Don't create airy, spacious layouts — density is intentional, like Uber
- Don't use gradients on body text — gradient clip is for hero headlines only
- Don't mix shadow systems — shadow-sm/md/lg for light surfaces, glow for dark
- Don't use color for color's sake — amber=action, emerald=success, red=emergency, blue=info. No other colors.

## 9. Responsive Behavior

### Breakpoints
| Name | Width | Tailwind | Key Changes |
|------|-------|----------|-------------|
| Mobile | 0-639px | default | Single column, full-width buttons, stacked cards, hamburger nav |
| Tablet | 640-767px | `sm:` | 2-3 column grids begin, inline buttons, expanded padding |
| Tablet Large | 768-1023px | `md:` | Desktop nav visible, side-by-side layouts |
| Desktop | 1024-1279px | `lg:` | Full grid layouts, 2-col features, generous gaps |
| Desktop Large | 1280px+ | `xl:` | Max container reached (max-w-7xl = 1280px) |

### Touch Targets
- All pill buttons: minimum 44px touch height (py-3.5 achieves this)
- Nav CTA: `px-5 py-2` (compact but touchable)
- Mobile hamburger: `h-10 w-10` explicit sizing
- City pills: `px-4 py-1.5` — comfortable tap targets
- Card surfaces: entire card is tappable on mobile

### Collapsing Strategy
- **Navigation**: Desktop horizontal links → mobile hamburger with slide-down panel
- **Hero CTAs**: Side-by-side → full-width stacked (`flex-col sm:flex-row`)
- **Feature grids**: 3-column → single column stacked
- **2-col features**: Side-by-side text+visual → stacked (text above visual)
- **Testimonials**: 3-col → 2-col → single column
- **City pills**: `flex-wrap` — they naturally flow to next line
- **Section headings**: 36px → 30px responsive scaling (`text-3xl sm:text-4xl`)
- **Hero text**: 48px → 36px → 60px (`text-4xl sm:text-5xl lg:text-6xl`)

## 10. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: `bg-amber-500 text-[#1a1a2e] shadow-lg shadow-amber-500/25`
- Secondary CTA: `bg-[#1a1a2e] text-white shadow-lg`
- Ghost CTA: `border border-zinc-600 text-white hover:bg-white/5`
- Dark surface: `bg-[#1a1a2e]` (standard) or `bg-[#0f172a]` (emergency)
- Light surface: `bg-white` (standard) or `bg-zinc-50/bg-slate-50` (alternate)
- Navbar: `bg-[#1a1a2e]/95 backdrop-blur-md border-b border-white/10`
- Text on light: `text-zinc-900` (heading), `text-zinc-600` (body)
- Text on dark: `text-white` (heading), `text-zinc-400` (body), `text-zinc-300` (links)

### Example Component Prompts
- "Create a hero section with `bg-[#1a1a2e]` and gradient overlay `from-[#1a1a2e] via-[#16213e] to-[#1a1a2e]`. Add atmospheric amber glow (rounded-full, blur-3xl, amber-500/10). Centered text: H1 in `text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight`, with one phrase in `bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent`. Body in `text-lg text-zinc-400`. Two pill CTAs: amber primary + ghost secondary."
- "Build a feature card grid with 3 cards. Each: `rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm hover:border-amber-200 hover:shadow-md`. Step counter: `absolute -top-4 left-8 rounded-full bg-[#1a1a2e] text-xs font-bold text-amber-500`. Icon in `rounded-xl bg-amber-50 text-amber-600`. Title in `text-lg font-semibold text-zinc-900`. Description in `text-sm text-zinc-600 leading-relaxed`."
- "Design a dark emergency section with `bg-[#0f172a]`. Add red and amber atmospheric glow blobs (blur-3xl). Badge: `rounded-full border border-red-500/30 bg-red-500/10 text-red-400`. Cards: `rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700`."
- "Create the sticky navbar: `sticky top-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-md border-b border-white/10`. Logo: amber square (rounded-lg) with mountain/layer SVG icon. Brand text: `text-lg font-bold` — 'Sherpa' in white, 'Pros' in amber-500. Links: `text-sm font-medium text-zinc-300 hover:text-white`. CTA pill: `rounded-full bg-amber-500 text-[#1a1a2e] px-5 py-2 text-sm font-semibold`."

### Iteration Guide
1. Start with mobile layout, then add breakpoint overrides
2. Always specify the full button pattern — `rounded-full bg-amber-500 text-[#1a1a2e] shadow-lg shadow-amber-500/25`
3. Dark sections need atmospheric glow — add 1-2 radial blur blobs
4. Cards on white use `border + shadow-sm + hover:shadow-md`
5. Cards on dark use `border-zinc-800 bg-zinc-900/50 backdrop-blur-sm`
6. Badges always: `rounded-full border px-4 py-1.5 text-xs font-medium` with contextual colors
7. Section headings: `text-3xl sm:text-4xl font-bold` + descriptive subtitle in `text-lg text-zinc-600`
8. Every section gets `px-4 sm:px-6 lg:px-8` horizontal padding and `py-20 sm:py-28` vertical
9. Use `mx-auto max-w-7xl` as the standard container
10. Gradient text is reserved for hero headlines — one span only
