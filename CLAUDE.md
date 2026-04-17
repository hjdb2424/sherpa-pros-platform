# Sherpa Pros Platform

Construction marketplace (Uber for contractors) connecting clients with verified pros for on-demand trade work.

**Live:** https://sherpa-pros-platform.vercel.app
**Repo:** https://github.com/hjdb2424/sherpa-pros-platform

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Auth:** Clerk (Pro/Client role selection)
- **Payments:** Stripe Connect (marketplace splits, escrow)
- **Database:** Neon PostgreSQL + PostGIS (Drizzle ORM)
- **Maps:** Google Maps JavaScript API (@vis.gl/react-google-maps) — Uber-like map interface
- **Communication:** Twilio masked messaging (mock mode for dev)
- **Deployment:** Vercel (PWA, mobile-first)
- **Linting:** ESLint + Prettier

## Key Conventions

- **Server Components by default.** Only add `'use client'` when the component needs browser APIs, event handlers, or React hooks like useState/useEffect.
- **App Router only.** No Pages Router. All routes live in `src/app/`.
- **Route groups** `(auth)`, `(dashboard)`, `(marketing)` organize routes without affecting URL paths.
- **API routes** live in `src/app/api/` and export named HTTP method handlers (GET, POST, etc.).
- **Mobile-first.** All UI is designed for mobile screens first, then scales up. The app is a PWA with `public/manifest.json`.
- **Import alias:** `@/*` maps to `./src/*`.
- **Integer cents** for all monetary values. Never use floating point for money.
- **Lazy SDK initialization** — Stripe, Twilio, and other SDKs must use getter functions, not module-level `new Stripe()`. Build must pass without env vars.
- **Brand colors:** Dark navy (#1a1a2e), Amber (#f59e0b), Emerald (#10b981), Slate (#64748b)
- **"Wiseman" is internal only** — never expose in client-facing UI.

## Directory Structure

```
src/
  app/
    (auth)/              Sign-in, sign-up, role selection (Clerk)
    (dashboard)/
      pro/               Pro dashboard, jobs, profile, earnings, payments
      client/            Client dashboard, post-job wizard, my-jobs, find-pros
    (marketing)/         Landing page, how-it-works, for-pros
    api/
      jobs/              Job CRUD and search
      pros/              Pro profile CRUD and search
      dispatch/          Job-to-pro matching algorithm
      payments/          Payment processing
      stripe/            Stripe Connect + webhooks
      chat/              Twilio chat API
  components/
    marketing/           Landing page components (Navbar, Hero, Footer, etc.)
    pro/                 Pro dashboard components (Sidebar, JobCard, BidForm, etc.)
    client/              Client components (JobWizard, BidCard, RatingForm, etc.)
    payments/            Stripe Connect UI components
    chat/                Chat window, FAB, conversation list
    maps/                Google Maps (MapView, BottomSheet, ProMarker, JobMarker, DispatchTracker)
  lib/
    auth/                Clerk helpers (roles, get-user, require-role)
    dispatch-wiseman/    7-factor matching algorithm (scoring, dispatcher, anti-gaming)
    payments/            Commission engine, Stripe Connect, dispute resolution
    wiseman-bridge/      BldSync API client, project vetter, checklist generator
    communication/       Twilio service + mock service
    mock-data/           Sample data for development
  db/
    schema.sql           20-table PostgreSQL + PostGIS schema
    migrations/          SQL migrations
    seed.sql             Development seed data (3 hubs, 5 pros, 5 jobs)
    drizzle-schema.ts    Drizzle ORM table definitions
    queries/             Query helpers (pros, jobs, bids, payments, ratings)
    types.ts             TypeScript types matching schema
public/
  manifest.json          PWA manifest
  icons/                 App icons
```

## Integration Notes

- Consumes BldSync Wiseman APIs via `src/lib/wiseman-bridge/client.ts` (env: BLDSYNC_API_URL)
- Dispatch Wiseman is the first Wiseman living OUTSIDE BldSync
- Twilio auto-falls back to mock service when TWILIO_ACCOUNT_SID is not set
- Stripe SDK uses lazy initialization (getStripe()) to avoid build failures without env vars

## Commands

- `npm run dev` -- Start development server
- `npm run build` -- Production build
- `npm run start` -- Start production server
- `npm run lint` -- Run ESLint
- `npx vitest` -- Run tests

## Design Skills

This project uses four design skill systems to ensure design-forward, anti-AI-slop UI/UX:

- **DESIGN.md** — Uber-inspired design system (colors, typography, components, spacing). Read this BEFORE writing any UI code.
- **Impeccable** — 7 reference files (typography, color, spatial, motion, interaction, responsive, UX writing) + skills: `/audit`, `/polish`, `/animate`, `/distill`, `/layout`, `/typeset`, `/critique`, `/delight`, `/harden`, `/bolder`, `/adapt`, `/shape`, `/clarify`, `/optimize`, `/quieter`, `/colorize`, `/overdrive`
- **Taste Skill** — Design engineering with anti-slop bias correction. Tuned for construction marketplace: DESIGN_VARIANCE=5 (confident, not experimental), MOTION_INTENSITY=7 (emergency dispatch urgency), VISUAL_DENSITY=6 (Uber-density, no wasted space). Also: `/redesign-skill`, `/soft-skill`, `/output-skill`
- **UI/UX Pro Max** — 161 reasoning rules, 67 UI styles, design system generator. Skills: `/ui-ux-pro-max`, `/design`, `/ui-styling`, `/design-system`, `/brand`

**Design-forward mandate:** Every UI component must be reviewed against DESIGN.md before shipping. Prioritize simplicity, thumb-friendly interactions, and zero-friction access.

## Spec

Full platform design: `docs/superpowers/specs/2026-04-13-sherpa-pros-platform-design.md`
