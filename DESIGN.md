# Sherpa Pros Design System

## 1. Visual Theme & Atmosphere

Sherpa Pros is a construction marketplace that moves like a ride-share app -- fast, trustworthy, no friction. The visual language is **light-themed and professional**, built on clean white surfaces that let content breathe, with sky blue primary actions that communicate trust and reliability, and orange-red accents that create brand identity and urgency. The platform feels modern, open, and confident -- a marketplace that construction professionals and homeowners trust immediately.

The overall feel is **clean but commanding** -- a platform that's clearly built by people who understand construction, not a generic marketplace template. Every screen should feel like a well-organized workspace: bright, precise, purposeful. The mobile experience is primary -- contractors are on job sites, clients are standing in their flooded basements. Every tap matters.

**Key Characteristics:**
- White (`#ffffff`) primary surfaces with subtle blue-tinted borders for depth
- Sky blue (`#00a9e0`) as the primary action color -- trustworthy, professional, impossible to miss
- Orange-red (`#ff4500`) as the brand accent -- logo highlight, emergency indicators, brand identity
- Pill-shaped buttons (rounded-full) for all primary actions -- thumb-friendly, Uber-inspired
- Light shadows with blue-tinted borders (`#00a9e033`) for card elevation
- Card-based layouts with clean borders and smooth hover transitions
- White content sections with a dark footer anchor at the bottom
- 4px spacing grid, compact and efficient -- construction pros don't scroll for fun

## 2. Color Palette & Roles

### Brand Core
- **White Surface** (`#ffffff`): The defining brand surface -- content areas, cards, navbar. Clean, open, professional.
- **Foreground** (`#1a1a1a`): Primary text color on light surfaces. Near-black for maximum readability.
- **Slate Background** (`#f8fafc`): Alternate section backgrounds. Subtle warmth without competing.
- **Dark Anchor** (`#0f172a`): Footer background, dark mode base. Deep and authoritative.

### Primary (Sky Blue)
- **Primary** (`#00a9e0`): THE action color. Primary CTAs, links, focus rings, slider thumbs, active states. Trustworthy and professional.
- **Primary Hover** (`#0090c0`): Hover state for primary buttons. Slightly darker for feedback.
- **Primary Dark** (`#0ea5e9`): Dark mode primary. Brighter sky blue for contrast on dark surfaces.
- **Primary Glow** (`rgba(0, 169, 224, 0.25)`): Shadow color for primary CTAs. Creates cool depth beneath buttons.
- **Primary Soft** (`rgba(0, 169, 224, 0.10)`): Badge backgrounds, subtle blue tinting, feature icon containers.
- **Primary Border** (`#00a9e033`): Blue-tinted borders for cards and containers. Signature detail.

### Accent (Orange-Red)
- **Accent** (`#ff4500`): Brand highlight. Logo "PROS" text, emergency dispatch, urgent indicators, brand moments.
- **Accent Hover** (`#e63e00`): Hover state for accent elements. Slightly darker.
- **Accent Dark** (`#ff6b35`): Dark mode accent. Warmer orange for contrast on dark surfaces.
- **Accent Soft** (`rgba(255, 69, 0, 0.10)`): Accent badge backgrounds, subtle orange tinting.

### Status & Semantic
- **Success / Emerald** (`#10b981`): Verified badges, positive trends, "For Pros" sections. Trust signal.
- **Success Light** (`#d1fae5` / `bg-emerald-50`): Soft background for success badges and positive callouts.
- **Warning / Amber** (`#f59e0b`): Caution states, pending actions, time-sensitive notices.
- **Warning Light** (`#fef3c7` / `bg-amber-50`): Soft background for warning badges.
- **Danger / Red** (`#dc2626`): Emergency dispatch, destructive actions, error states.
- **Danger Soft** (`rgba(220, 38, 38, 0.10)`): Emergency badge backgrounds, red glow effects.
- **Info / Blue** (`#2563eb`): Service area, maps, informational badges.
- **Info Light** (`#eff6ff` / `bg-blue-50`): Info badge backgrounds, map section tinting.

### Neutral Scale
- **Zinc 900** (`#18181b`): Primary text on light surfaces. Near-black for maximum readability.
- **Zinc 700** (`#3f3f46`): Secondary body text on light surfaces.
- **Zinc 600** (`#52525b`): Descriptive text, longer paragraphs.
- **Zinc 500** (`#71717a`): Tertiary text, labels, metadata.
- **Muted Foreground** (`#475569`): Muted text, secondary descriptions on light surfaces.
- **Zinc 200** (`#e4e4e7`): Light borders, dividers on white surfaces.
- **Zinc 100** (`#f4f4f5`): Card borders, subtle separation, navbar bottom border.
- **Zinc 50** (`#fafafa`): Alternate section backgrounds (testimonials, features).
- **Slate 50** (`#f8fafc`): Card gradient start, muted surface.

### Dark Mode Neutrals
- **Dark BG** (`#0f172a`): Base background in dark mode.
- **Dark Card** (`#1e293b`): Card surface in dark mode.
- **Dark Muted** (`#334155`): Muted backgrounds and borders in dark mode.
- **Dark Text** (`#f1f5f9`): Primary text in dark mode.
- **Dark Muted Text** (`#cbd5e1`): Secondary text in dark mode.

### Borders & Separation
- **Primary Border** (`#00a9e033`): Blue-tinted card borders on light surfaces. Signature detail.
- **Zinc 100 border** (`border-zinc-100`): Navbar bottom border, subtle card borders.
- **Zinc 200 border** (`border-zinc-200`): Stronger card borders, input borders, ghost button borders.
- **Dark Border** (`#334155`): Card and input borders in dark mode.

### Shadows & Depth
- **Shadow SM** (`shadow-sm`): Default card elevation on white -- barely there.
- **Shadow MD** (`shadow-md`): Hover state elevation -- noticeable lift.
- **Shadow LG** (`shadow-lg`): Primary CTAs, important cards, Pro earnings preview.
- **Shadow XL** (`shadow-xl`): Hover state for primary CTAs -- dramatic lift on interaction.
- **Primary Shadow** (`shadow-[#00a9e0]/25`): Primary CTA glow -- cool trust signal beneath the button.
- **Primary Shadow Hover** (`shadow-[#00a9e0]/30`): Intensified glow on hover.

### Gradient System
- **Hero gradient**: `bg-gradient-to-b from-white via-slate-50 to-white` -- subtle light depth
- **Headline gradient**: `bg-gradient-to-r from-[#00a9e0] to-[#0ea5e9] bg-clip-text text-transparent` -- blue text accent
- **Card gradient**: `bg-gradient-to-br from-slate-50 to-white` -- subtle card fill
- **Map gradient**: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50` -- geographic coolness
- **Accent gradient**: `bg-gradient-to-r from-[#ff4500] to-[#ff6b35]` -- brand accent gradient for special moments

## 3. Typography Rules

### Font Family
- **Primary**: `Geist Sans` (Next.js default via `next/font/local`)
- **Mono**: `Geist Mono` (code, data values)
- **Fallback**: `system-ui, -apple-system, sans-serif`

*Geist is geometric, contemporary, and highly legible at small sizes -- ideal for a mobile-first tool. Do NOT substitute Inter (too generic) or serif fonts (wrong energy).*

### Hierarchy

| Role | Size | Weight | Line Height | Tracking | Color (light bg) | Color (dark bg) |
|------|------|--------|-------------|----------|-------------------|-----------------|
| Hero Display | 48-60px (`text-4xl sm:text-5xl lg:text-6xl`) | 700 (bold) | tight (1.1-1.2) | `tracking-tight` | zinc-900 | white |
| Section Heading | 30-36px (`text-3xl sm:text-4xl`) | 700 (bold) | tight | -- | zinc-900 | white |
| Card Title | 20px (`text-xl`) | 700 (bold) | normal | -- | zinc-900 | white |
| Subsection | 18px (`text-lg`) | 600 (semibold) | normal | -- | zinc-900 | white |
| Body Large | 18-20px (`text-lg sm:text-xl`) | 400 (normal) | relaxed (1.625) | -- | zinc-600 | slate-300 |
| Body | 16px (`text-base`) | 400-500 | relaxed | -- | zinc-700 | slate-200 |
| Body Small | 14px (`text-sm`) | 400-500 | relaxed | -- | zinc-600 | slate-300 |
| Caption | 12px (`text-xs`) | 500 (medium) | normal | -- | zinc-500 | slate-400 |
| Badge Text | 12-14px (`text-xs sm:text-sm`) | 500 (medium) | normal | -- | contextual | contextual |
| Stat Value | 18px (`text-lg`) | 700 (bold) | normal | -- | zinc-900 | white |
| Step Number | 12px (`text-xs`) | 700 (bold) | normal | -- | primary on white | -- |

### Principles
- **Bold headlines, regular body**: Headlines are always 700. Body text is 400-500. Never use bold for paragraphs.
- **Tight headline spacing**: Hero and section headings use `leading-tight` or `tracking-tight`. Compact and punchy.
- **Relaxed body spacing**: Body text uses `leading-relaxed` (1.625). Readable at mobile sizes.
- **Gradient headlines**: Hero H1 can use primary gradient clip for the key phrase. ONE gradient span per heading maximum.
- **No decorative type**: No letter-spacing tricks, no text-transform except badges (uppercase + tracking-wider for state abbreviations).

## 4. Component Stylings

### Buttons

**Primary (Main CTA)**
- Background: Sky Blue (`bg-[#00a9e0]`)
- Text: White (`text-white`)
- Padding: `px-8 py-3.5`
- Radius: `rounded-full` (pill)
- Shadow: `shadow-lg shadow-[#00a9e0]/25`
- Hover: `hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30`
- Font: `text-base font-semibold`
- Width: `w-full sm:w-auto` (full on mobile, auto on desktop)

**Secondary**
- Background: White (`bg-white`)
- Text: Zinc 900 (`text-zinc-900`)
- Border: `border border-[#00a9e033]`
- Padding: `px-8 py-3.5`
- Radius: `rounded-full` (pill)
- Shadow: `shadow-sm`
- Hover: `hover:border-[#00a9e0]/40 hover:shadow-md`
- Font: `text-base font-semibold`

**Ghost**
- Background: transparent
- Text: Zinc 700 (`text-zinc-700`)
- Border: `border border-zinc-200`
- Padding: `px-8 py-3.5`
- Radius: `rounded-full` (pill)
- Hover: `hover:border-zinc-300 hover:bg-zinc-50`
- Font: `text-base font-semibold`

**Accent (Brand / Emergency)**
- Background: Orange-Red (`bg-[#ff4500]`)
- Text: White (`text-white`)
- Padding: `px-8 py-3.5`
- Radius: `rounded-full` (pill)
- Shadow: `shadow-lg shadow-[#ff4500]/25`
- Hover: `hover:bg-[#e63e00] hover:shadow-xl`
- Font: `text-base font-semibold`

**Chip / City Pill**
- Background: `bg-zinc-50`
- Text: `text-zinc-700`
- Border: `border border-zinc-200`
- Padding: `px-4 py-1.5`
- Radius: `rounded-full`
- Font: `text-sm font-medium`

**Nav CTA (compact)**
- Background: `bg-[#00a9e0]`
- Text: `text-white`
- Padding: `px-5 py-2`
- Radius: `rounded-full`
- Hover: `hover:bg-[#0090c0] hover:shadow-lg hover:shadow-[#00a9e0]/25`
- Font: `text-sm font-semibold`

### Cards & Containers

**Standard Card (light surface)**
- Background: `bg-white`
- Border: `border border-[#00a9e033]`
- Radius: `rounded-xl`
- Shadow: `shadow-sm`
- Padding: `p-8`
- Hover: `hover:border-[#00a9e0]/40 hover:shadow-md` (when interactive)

**Dark Card (dark mode / footer sections)**
- Background: `bg-[#1e293b]`
- Border: `border border-[#334155]`
- Radius: `rounded-xl`
- Padding: `p-6`
- Hover: `hover:border-[#475569]`

**Preview/Feature Card (gradient)**
- Background: `bg-gradient-to-br from-slate-50 to-white`
- Border: `border border-[#00a9e033]`
- Radius: `rounded-xl`
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
- Background: contextual-50 (primary-50, emerald-50, amber-50, red-50)
- Border: contextual-200 (blue-200, emerald-200, amber-200, red-200)
- Radius: `rounded-full`
- Padding: `px-4 py-1.5`
- Text: `text-xs sm:text-sm font-medium` in contextual-700
- Optional: icon (h-4 w-4) + dot indicator (h-2 w-2 rounded-full)

**Step Counter**
- Container: `absolute -top-4 left-8`
- Background: `bg-[#00a9e0]`
- Size: `h-8 w-14`
- Radius: `rounded-full`
- Text: `text-xs font-bold text-white`

### Inputs & Forms
- Text: `text-zinc-900`
- Background: `bg-white`
- Border: `border border-zinc-200` (light), `border border-[#334155]` (dark mode)
- Radius: `rounded-lg` (standard inputs), `rounded-2xl` (search/hero inputs)
- Focus: `focus:ring-2 focus:ring-[#00a9e0] focus:border-[#00a9e0]`
- Placeholder: `text-zinc-400`

### Navigation

**Sticky Navbar**
- Position: `sticky top-0 z-50`
- Background: `bg-white`
- Border bottom: `border-b border-zinc-100`
- Logo: "SHERPA" in dark (`text-[#1a1a1a] font-bold`) + "PROS" in orange-red (`text-[#ff4500] font-bold`)
- Links: `text-sm font-medium text-zinc-600 hover:text-[#00a9e0]`
- Mobile: hamburger with slide-down panel `bg-white`

**Icon Styling**
- Use `@heroicons/react/24/outline` for UI icons
- Standard size: `h-6 w-6` (nav/cards), `h-4 w-4` (badges/inline), `h-8 w-8` (feature blocks), `h-10 w-10` (hero icons)
- Feature icon containers: `rounded-xl bg-[#00a9e0]/10 text-[#00a9e0]` (light) or `rounded-xl bg-[#00a9e0] text-white` (accent)
- Hover: `group-hover:bg-[#00a9e0]/20` for icon backgrounds in interactive cards
- NEVER use emojis -- always use Heroicons or custom SVG

### Footer
- Background: `bg-zinc-900`
- Text: `text-zinc-400` (body), `text-white` (headings)
- Links: `text-zinc-400 hover:text-white`
- Border top: none (dark anchor, clean edge)
- Logo: "SHERPA" in white + "PROS" in `text-[#ff4500]`

### Image & Illustration Treatment
- Map containers: gradient bg with centered icon placeholder until Mapbox loads
- Card imagery: `rounded-xl` for hero, `rounded-lg` for thumbnails
- Avatar/Pro photos: `rounded-full` with ring border
- Decorative elements: radial glow blobs (`rounded-full bg-[#00a9e0]/10 blur-2xl`)

## 5. Layout Principles

### Spacing System
- Base unit: 4px (Tailwind default)
- Component internal padding: `p-6` (compact) to `p-8` (standard) to `p-10` (featured)
- Section vertical padding: `py-20 sm:py-28` -- generous breathing room
- Section horizontal padding: `px-4 sm:px-6 lg:px-8`
- Card gaps: `gap-8` (grid), `gap-4` (stat rows), `gap-6` (feature cards)
- Badge/pill gaps: `gap-2` (inline), `flex-wrap gap-2` (city pills)
- CTA button gaps: `gap-4` (stacked on mobile, row on desktop)

### Grid & Container
- Max width: `max-w-7xl mx-auto` (1280px)
- Content max: `max-w-5xl` (grids), `max-w-3xl` (hero text), `max-w-2xl` (section headers)
- Standard grid: `grid sm:grid-cols-3 gap-8` (3-col features)
- Feature grid: `grid lg:grid-cols-2 gap-12 lg:gap-16` (text + visual)
- Testimonials: `grid sm:grid-cols-2 lg:grid-cols-3 gap-8`

### Section Rhythm (top to bottom)
1. **White hero** -- clean white bg, centered text, sky blue primary CTA + ghost secondary
2. **White section** -- How It Works cards with blue-tinted borders
3. **Light section** (slate-50) -- Comparison table or features
4. **White section** -- For Pros (2-col with feature card)
5. **White section** -- Emergency/Insurance with accent badges
6. **White section** -- Hub Map / Service Area
7. **Light section** (zinc-50) -- Testimonials
8. **White section** -- Final call-to-action with primary CTA
9. **Dark footer** (zinc-900) -- Links, brand, legal

### Whitespace Philosophy
- **Efficient, not airy**: Like Uber, density is intentional. Construction pros are busy. Don't waste screen space.
- **Generous section breaks**: Sections breathe (`py-20 sm:py-28`), but within sections content is compact.
- **Mobile-first stacking**: 2-3 column grids collapse to single column. Buttons go full-width. Cards stack vertically.

### Border Radius Scale
- Inputs / stat rows: `rounded-lg` (8px)
- Standard cards: `rounded-xl` (12px)
- Logo icon: `rounded-lg` (8px)
- Feature icon bg: `rounded-xl` (12px)
- Buttons / badges / pills: `rounded-full` (9999px)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Text sections, inline content |
| Whisper | `shadow-sm` + `ring-1 ring-zinc-100` | Stat rows, subtle cards |
| Standard | `shadow-sm` + `border border-[#00a9e033]` | Feature cards on white |
| Lifted | `shadow-md` | Card hover state |
| Prominent | `shadow-lg` | Feature preview cards, primary CTAs |
| Dramatic | `shadow-xl` | CTA hover state |
| Glow | `shadow-lg shadow-[#00a9e0]/25` | Primary buttons -- cool trust glow |
| Accent Glow | `shadow-lg shadow-[#ff4500]/25` | Accent buttons -- urgent warmth |
| Glass | `bg-white/95 backdrop-blur-md` | Sticky navbar (light glass) |
| Subtle Depth | `border border-[#00a9e033]` | Blue-tinted borders for signature card style |

**Depth Philosophy**: Sherpa Pros uses light shadows with blue-tinted borders as a signature look. White surfaces get traditional shadow for card lift. The primary CTA glow (`shadow-[#00a9e0]/25`) is a signature detail -- buttons feel like they radiate trust. The blue-tinted border (`#00a9e033`) ties cards to the brand without being heavy.

## 7. Motion & Interaction

### Transitions
- **All interactive elements**: `transition-all` as the default. Never skip transitions.
- **Button hover**: background color shift + shadow intensification (150-200ms)
- **Card hover**: border color change (`hover:border-[#00a9e0]/40`) + shadow lift (`hover:shadow-md`)
- **Nav links**: `transition-colors` for text color shifts
- **Icon containers**: `transition-colors group-hover:bg-[#00a9e0]/20`

### Animations
- **fadeSlideIn**: Messages/cards entering -- `translateY(6px)` to `0` with opacity
- **slideUp**: Chat windows, bottom sheets -- `translateY(100%)` to `0`
- **bounceIn**: Notifications, badges appearing -- `scale(0.3)` to `scale(1.1)` to `scale(1)`
- **fadeSlideUp**: Section reveals on scroll -- `translateY(16px)` to `0` with opacity, staggered
- **subtlePulse**: Live indicators -- opacity pulse between 1 and 0.7
- **shimmer**: Loading skeletons -- horizontal gradient sweep
- **Range slider thumb**: `transform: scale(1.15)` on hover

### Stagger System
- `.stagger-1` through `.stagger-6` with 100ms increments
- Applied to `.animate-fade-slide-up` elements for sequential reveals
- Respects `prefers-reduced-motion`

### Motion Principles
- Every state change should be visible -- no instant swaps
- Hover states always provide feedback (color, shadow, or border change)
- Page transitions should feel snappy -- 150-300ms max
- Emergency flows use faster, more urgent transitions
- Mobile: respect `prefers-reduced-motion`
- Spring physics feel: slight overshoot on bounceIn, smooth ease-out on reveals

## 8. Do's and Don'ts

### Do
- Use white (`#ffffff`) as the primary background -- light and professional
- Use sky blue (`#00a9e0`) for ALL primary action buttons -- the trust signal is the brand
- Put white text on primary buttons -- clean contrast
- Use orange-red (`#ff4500`) for brand moments: logo "PROS", emergency indicators, accent highlights
- Use `rounded-full` for every button and badge -- the pill shape is identity
- Add blue-tinted borders (`#00a9e033`) to cards for the signature look
- Keep the clean white nav with `border-b border-zinc-100`
- Use Heroicons outline (24px) for all UI icons
- Design mobile-first -- every layout starts as single column
- Use `shadow-[#00a9e0]/25` on primary CTAs -- the cool shadow is a signature detail
- Use dark footer (`bg-zinc-900`) as the visual anchor at the bottom
- Support both light and dark mode with proper token mapping

### Don't
- Don't use dark navy (`#1a1a2e`) for hero sections -- the brand is now light-themed
- Don't use amber/gold as the primary action color -- sky blue is the new primary
- Don't use Inter or generic sans-serif -- Geist Sans is the font
- Don't use emojis for icons -- always Heroicons or custom SVG
- Don't make buttons without rounded-full -- square buttons break the identity
- Don't skip hover states -- every interactive element needs visible feedback
- Don't use heavy shadows -- keep elevation subtle with `shadow-sm` default
- Don't over-animate -- construction audience values speed over spectacle
- Don't create dark hero sections -- the whole page is light with a dark footer anchor
- Don't use gradients on body text -- gradient clip is for hero headlines only
- Don't mix the primary and accent colors in buttons -- primary is for actions, accent is for brand identity
- Don't use color for color's sake -- primary=action, accent=brand/urgent, emerald=success, amber=warning, red=danger, blue=info. No other colors.

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
- City pills: `px-4 py-1.5` -- comfortable tap targets
- Card surfaces: entire card is tappable on mobile

### Collapsing Strategy
- **Navigation**: Desktop horizontal links to mobile hamburger with slide-down panel
- **Hero CTAs**: Side-by-side to full-width stacked (`flex-col sm:flex-row`)
- **Feature grids**: 3-column to single column stacked
- **2-col features**: Side-by-side text+visual to stacked (text above visual)
- **Testimonials**: 3-col to 2-col to single column
- **City pills**: `flex-wrap` -- they naturally flow to next line
- **Section headings**: 36px to 30px responsive scaling (`text-3xl sm:text-4xl`)
- **Hero text**: 48px to 36px to 60px (`text-4xl sm:text-5xl lg:text-6xl`)

## 10. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: `bg-[#00a9e0] text-white shadow-lg shadow-[#00a9e0]/25`
- Secondary CTA: `bg-white border border-[#00a9e033] text-zinc-900`
- Ghost CTA: `border border-zinc-200 text-zinc-700 hover:bg-zinc-50`
- Accent CTA: `bg-[#ff4500] text-white shadow-lg shadow-[#ff4500]/25`
- Light surface: `bg-white` (standard) or `bg-zinc-50/bg-slate-50` (alternate)
- Dark surface (footer only): `bg-zinc-900`
- Navbar: `bg-white border-b border-zinc-100`
- Card: `bg-white border border-[#00a9e033] rounded-xl shadow-sm`
- Text on light: `text-zinc-900` (heading), `text-zinc-600` (body), `text-[#475569]` (muted)
- Text on dark: `text-white` (heading), `text-zinc-400` (body)
- Logo: "SHERPA" in `text-[#1a1a1a] font-bold` + "PROS" in `text-[#ff4500] font-bold`

### Example Component Prompts
- "Create a hero section with `bg-white`. Centered text: H1 in `text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 tracking-tight`, with one phrase in `bg-gradient-to-r from-[#00a9e0] to-[#0ea5e9] bg-clip-text text-transparent`. Body in `text-lg text-zinc-600`. Two pill CTAs: sky blue primary (`bg-[#00a9e0] text-white shadow-lg shadow-[#00a9e0]/25`) + ghost secondary (`border border-zinc-200 text-zinc-700`)."
- "Build a feature card grid with 3 cards. Each: `rounded-xl border border-[#00a9e033] bg-white p-8 shadow-sm hover:border-[#00a9e0]/40 hover:shadow-md`. Step counter: `absolute -top-4 left-8 rounded-full bg-[#00a9e0] text-xs font-bold text-white`. Icon in `rounded-xl bg-[#00a9e0]/10 text-[#00a9e0]`. Title in `text-lg font-semibold text-zinc-900`. Description in `text-sm text-zinc-600 leading-relaxed`."
- "Design an emergency section on white bg. Badge: `rounded-full border border-red-200 bg-red-50 text-red-700`. Cards: `rounded-xl border border-[#00a9e033] bg-white shadow-sm`. Accent CTA: `bg-[#ff4500] text-white shadow-lg shadow-[#ff4500]/25 rounded-full`."
- "Create the sticky navbar: `sticky top-0 z-50 bg-white border-b border-zinc-100`. Logo: 'SHERPA' in `text-[#1a1a1a] font-bold`, 'PROS' in `text-[#ff4500] font-bold`. Links: `text-sm font-medium text-zinc-600 hover:text-[#00a9e0]`. CTA pill: `rounded-full bg-[#00a9e0] text-white px-5 py-2 text-sm font-semibold`."

### Iteration Guide
1. Start with mobile layout, then add breakpoint overrides
2. Always specify the full button pattern -- `rounded-full bg-[#00a9e0] text-white shadow-lg shadow-[#00a9e0]/25`
3. Cards on white use `border border-[#00a9e033] + shadow-sm + hover:shadow-md`
4. Only the footer uses dark surfaces (`bg-zinc-900`)
5. Badges always: `rounded-full border px-4 py-1.5 text-xs font-medium` with contextual colors
6. Section headings: `text-3xl sm:text-4xl font-bold text-zinc-900` + descriptive subtitle in `text-lg text-zinc-600`
7. Every section gets `px-4 sm:px-6 lg:px-8` horizontal padding and `py-20 sm:py-28` vertical
8. Use `mx-auto max-w-7xl` as the standard container
9. Gradient text is reserved for hero headlines -- one span only
10. Logo is always: SHERPA (dark/white depending on surface) + PROS (orange-red `#ff4500`)
