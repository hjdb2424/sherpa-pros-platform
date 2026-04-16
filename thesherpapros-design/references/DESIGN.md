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
