---
name: thesherpapros-design
description: Design system skill for thesherpapros. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# thesherpapros Design System

You are building UI for **thesherpapros**. Dark-themed, warm palette, monospace typography (SFMono-Regular), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![thesherpapros Homepage](screenshots/homepage.png)

> Read `references/DESIGN.md` for full token details.

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **warm palette** — the color temperature runs warm, matching the monospace typography.
- **Restrained accent** — `#ff4500` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#1a1a1a` | Page/app background |
| Surface | `--surface` | `#000000` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#ffffff` | Headings, body text |
| Text Muted | `--text-muted` | `#374151` | Captions, placeholders |
| Accent | `--accent` | `#ff4500` | CTAs, links, focus rings |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#10b981` | Confirmations, positive trends |
| Warning | `#f59e0b` | Caution states, pending items |
| Danger | `#dc2626` | Errors, destructive actions |

### Extended Palette

- **primary:** `#00a9e0`
- **secondary:** `#f0f9ff` — Secondary text, placeholder text
- **primary:** `#0ea5e9`
- **switch-background:** `#cbd5e1`
- **chart-3:** `#0891b2`
- **background:** `#0f172a` — Deep background layer or shadow color

### CSS Variable Tokens

```css
--background: #fff;
--foreground: #1a1a1a;
--card: #fff;
--card-foreground: #1a1a1a;
--popover: #fff;
--popover-foreground: #1a1a1a;
--primary: #00a9e0;
--primary-foreground: #fff;
--secondary: #f0f9ff;
--secondary-foreground: #0066a3;
--muted: #f8fafc;
--muted-foreground: #475569;
--accent: #ff4500;
--accent-foreground: #fff;
--destructive: #dc2626;
--destructive-foreground: #fff;
--border: #00a9e033;
--input-background: #f8fafc;
--input-foreground: #1a1a1a;
--switch-background: #cbd5e1;
```

## Typography

### Font Stack

- **SFMono-Regular** — Heading 1, Heading 2, Heading 3, Body, Caption, Code

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | SFMono-Regular | 16px | 700 |
| Heading 2 | SFMono-Regular | .875rem | 700 |
| Heading 3 | SFMono-Regular | 14px | 700 |
| Body | SFMono-Regular | inherit | 400 |
| Caption | SFMono-Regular | 1em | 400 |
| Code | SFMono-Regular | 14px | 400 |

### Typography Rules

- All text uses **SFMono-Regular** — never add another font family
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`4, 8, 12, 16` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `.25rem, 2px, 4px, inherit`
Default: `4px`

### Container

Max-width: `96rem`, centered with auto margins.

## Component Patterns

### Card

```css
.card {
  background: #000000;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 4px #0000001a;
}
```

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Button

```css
/* Primary */
.btn-primary {
  background: #ff4500;
  color: #ffffff;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #444444;
  color: #ffffff;
  border-radius: 4px;
  padding: 8px 16px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #1a1a1a;
  border: 1px solid #444444;
  border-radius: 4px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
}
.input:focus { border-color: #ff4500; outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #000000;
  color: #374151;
}
```

```html
<span class="badge">New</span>
<span class="badge">Beta</span>
```

### Modal / Dialog

```css
.modal-backdrop { background: rgba(0, 0, 0, 0.6); }
.modal {
  background: #000000;
  border-radius: inherit;
  padding: 16px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 4px 12px #00a9e026;
}
```

```html
<div class="modal-backdrop">
  <div class="modal">
    <h2>Dialog Title</h2>
    <p>Dialog content.</p>
    <button class="btn-primary">Confirm</button>
    <button class="btn-ghost">Cancel</button>
  </div>
</div>
```

### Table

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 12px;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #444444;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #444444;
}
```

```html
<table class="table">
  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Item One</td><td>Active</td><td>Jan 1</td></tr>
    <tr><td>Item Two</td><td>Pending</td><td>Jan 2</td></tr>
  </tbody>
</table>
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
}
.nav-link {
  color: #374151;
  padding: 8px 12px;
  border-radius: 4px;
  transition: color 150ms;
}
.nav-link:hover { color: #ffffff; }
.nav-link.active { color: #ff4500; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

## Page Structure

The following page sections were detected:

- **Hero** — Hero section (detected from heading structure)

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `slideDown`
- `slideUp`
- `spin`
- `pulse`
- `bounce`

### Motion Tokens

- **Duration scale:** `.01ms`, `.15s`, `.2s`, `0.2s`, `.3s`, `.5s`, `200ms`, `300ms`
- **Easing functions:** `cubic-bezier(.4,0,.2,1)`, `cubic-bezier(.8,0,1,1)`, `cubic-bezier(0,0,.2,1)`, `ease-in-out`
- **Animated properties:** `color`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (.01ms) for micro-interactions, long (300ms) for page transitions
- **Easing:** Use `cubic-bezier(.4,0,.2,1)` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Dark Mode

This project supports **light and dark mode** via CSS variables.

### Token Mapping

| Variable | Light | Dark |
|----------|-------|------|
| `--background` | `#fff` | `#0f172a` |
| `--foreground` | `#1a1a1a` | `#f1f5f9` |
| `--card` | `#fff` | `#1e293b` |
| `--card-foreground` | `#1a1a1a` | `#f1f5f9` |
| `--popover` | `#fff` | `#1e293b` |
| `--popover-foreground` | `#1a1a1a` | `#f1f5f9` |
| `--primary` | `#00a9e0` | `#0ea5e9` |
| `--secondary` | `#f0f9ff` | `#334155` |
| `--secondary-foreground` | `#0066a3` | `#e2e8f0` |
| `--muted` | `#f8fafc` | `#334155` |
| `--muted-foreground` | `#475569` | `#cbd5e1` |
| `--accent` | `#ff4500` | `#ff6b35` |
| `--destructive` | `#dc2626` | `#ef4444` |
| `--border` | `#00a9e033` | `#334155` |
| `--input` | `transparent` | `#334155` |

### Implementation

- Toggle via `.dark` class on `<html>` or `[data-theme="dark"]`
- Always use CSS variables for colors — never hardcode hex values
- Test both modes for contrast and readability

## Depth & Elevation

### Shadow Tokens

- Raised (cards, buttons): `0 2px 4px #0000001a`
- Raised (cards, buttons): `0 2px 4px #00a9e040`
- Raised (cards, buttons): `0 0 0 4px var(--primary)`
- Raised (cards, buttons): `0 0 0 4px color-mix(in srgb,var(--primary) 20%,transparent)`
- Raised (cards, buttons): `0 4px 6px -1px #0000001a,0 2px 4px -1px #0000000f,0 0 0 1px var(--border)`
- Raised (cards, buttons): `0 4px 6px -1px #0000001a,0 2px 4px -1px #0000000f,0 0 0 1px color-mix(in srgb,var(--border) 50%,transparent)`

### Z-Index Scale

`10, 20, 30, 40, 50`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only SFMono-Regular are allowed
- **No arbitrary border-radius** — use the scale: .25rem, 2px, 4px
- **No opacity for disabled states** — use muted colors instead
- **No pill shapes** — this design doesn't use rounded-full / 9999px radius

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — SFMono-Regular only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `/favicon.ico`
- **Site URL:** `https://www.thesherpapros.com`
- **Brand color:** `#ff4500`

## Quick Reference

```
Background:     #1a1a1a
Surface:        #000000
Text:           #ffffff / #374151
Accent:         #ff4500
Border:         (not extracted)
Font:           SFMono-Regular
Spacing:        4px grid
Radius:         4px
Components:     1 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for thesherpapros
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "thesherpapros" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# thesherpapros DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 1 · Components: 1
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: yes · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![thesherpapros Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a warm tone. Depth is expressed through layered shadows and subtle surface color variation. Typography uses **SFMono-Regular** throughout — a technical, developer-focused choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 4, 8, 12, 16px. The accent color **#ff4500** anchors interactive elements (buttons, links, focus rings). Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| foreground | `#1a1a1a` | background | Page background, darkest surface |
| color-black | `#000000` | surface | Card and panel backgrounds |
| card | `#1e293b` | surface | Card and panel backgrounds |
| tw-ring-offset-color | `#ffffff` | text-primary | Headings and body text |
| text-secondary | `#374151` | text-muted | Captions, placeholders, secondary info |
| secondary-foreground | `#0066a3` | text-muted | Captions, placeholders, secondary info |
| secondary-foreground | `#e2e8f0` | text-muted | Captions, placeholders, secondary info |
| muted-foreground | `#475569` | text-muted | Captions, placeholders, secondary info |
| text-muted | `#6b7280` | text-muted | Captions, placeholders, secondary info |
| accent | `#ff4500` | accent | CTAs, links, focus rings, active states |
| accent | `#ff6b35` | accent | CTAs, links, focus rings, active states |
| destructive | `#dc2626` | danger | Error states, destructive actions |
| chart-5 | `#10b981` | success | Success states, positive indicators |
| chart-4 | `#f59e0b` | warning | Warning states, caution indicators |
| primary | `#00a9e0` | info | Informational highlights |
| secondary | `#f0f9ff` | unknown | Palette color |
| primary | `#0ea5e9` | unknown | Palette color |
| switch-background | `#cbd5e1` | unknown | Palette color |
| chart-3 | `#0891b2` | unknown | Palette color |
| background | `#0f172a` | unknown | Palette color |

### Dark Mode Token Mapping

| Variable | Light | Dark |
|---|---|---|
| `--background` | `#fff` | `#0f172a` |
| `--foreground` | `#1a1a1a` | `#f1f5f9` |
| `--card` | `#fff` | `#1e293b` |
| `--card-foreground` | `#1a1a1a` | `#f1f5f9` |
| `--popover` | `#fff` | `#1e293b` |
| `--popover-foreground` | `#1a1a1a` | `#f1f5f9` |
| `--primary` | `#00a9e0` | `#0ea5e9` |
| `--secondary` | `#f0f9ff` | `#334155` |
| `--secondary-foreground` | `#0066a3` | `#e2e8f0` |
| `--muted` | `#f8fafc` | `#334155` |
| `--muted-foreground` | `#475569` | `#cbd5e1` |
| `--accent` | `#ff4500` | `#ff6b35` |
| `--destructive` | `#dc2626` | `#ef4444` |
| `--border` | `#00a9e033` | `#334155` |
| `--input` | `transparent` | `#334155` |
| `--input-foreground` | `#1a1a1a` | `#f1f5f9` |
| `--ring` | `#00a9e0` | `#0ea5e9` |
| `--chart-1` | `#00a9e0` | `#0ea5e9` |
| `--chart-2` | `#ff4500` | `#ff6b35` |
| `--chart-3` | `#0891b2` | `#06b6d4` |

### CSS Variable Tokens

```css
--tw-border-style: solid;
--tw-border-style: dashed;
--tw-border-style: none;
--background: #fff;
--foreground: #1a1a1a;
--card: #fff;
--card-foreground: #1a1a1a;
--popover: #fff;
--popover-foreground: #1a1a1a;
--primary: #00a9e0;
--primary-foreground: #fff;
--secondary: #f0f9ff;
--secondary-foreground: #0066a3;
--muted: #f8fafc;
--muted-foreground: #475569;
--accent: #ff4500;
--accent-foreground: #fff;
--destructive: #dc2626;
--destructive-foreground: #fff;
--border: #00a9e033;
```


---

## 3. Typography Rules

**Font Stack:**
- **SFMono-Regular** — Heading 1, Heading 2, Heading 3, Body, Caption, Code

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | SFMono-Regular | 16px | 700 |
| Heading 2 | SFMono-Regular | .875rem | 700 |
| Heading 3 | SFMono-Regular | 14px | 700 |
| Body | SFMono-Regular | inherit | 400 |
| Caption | SFMono-Regular | 1em | 400 |
| Code | SFMono-Regular | 14px | 400 |

**Typographic Rules:**
- Use **SFMono-Regular** for all text — do not mix font families
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Data Input (1)

**Button** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 4, 8, 12, 16
- **Border radius:** .25rem, 2px, 4px, inherit
- **Max content width:** 96rem

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Raised — cards, buttons, interactive elements

- `0 2px 4px #0000001a`
- `0 2px 4px #00a9e040`
- `0 0 0 4px var(--primary)`

### Floating — dropdowns, popovers, modals

- `0 4px 12px #00a9e026`

### Z-Index Scale

`10, 20, 30, 40, 50`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes slideDown`
- `@keyframes slideUp`
- `@keyframes spin`
- `@keyframes pulse`
- `@keyframes bounce`
- `@keyframes enter`
- `@keyframes exit`
- `@keyframes accordion-down`

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#ff4500` for interactive elements (buttons, links, focus rings)
- Use `#1a1a1a` as the primary page background
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: .25rem, 2px, 4px, inherit
- Reuse existing components from Section 4 before creating new ones
- Always use CSS variables for colors — never hardcode hex
- Test both light and dark modes for contrast

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

No breakpoints detected. Consider adding responsive breakpoints to the design system.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #000000
Border: 1px solid var(--border)
Radius: 4px
Padding: 16px
Font: SFMono-Regular
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #ff4500, text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 4px
Hover: opacity 0.9 or lighter shade
Focus: ring with #ff4500
```

### Build a Page Layout

```
Background: #1a1a1a
Max-width: 96rem, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #000000
Label: #374151 (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #1a1a1a
Input border: 1px solid var(--border)
Focus: border-color #ff4500
Label: #374151 12px
Spacing: 16px between fields
Radius: 4px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: SFMono-Regular, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

