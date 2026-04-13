# Sherpa Pros Platform

Construction marketplace (Uber for contractors) connecting clients with verified pros for on-demand trade work.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel (PWA, mobile-first)
- **Linting:** ESLint + Prettier

## Key Conventions

- **Server Components by default.** Only add `'use client'` when the component needs browser APIs, event handlers, or React hooks like useState/useEffect.
- **App Router only.** No Pages Router. All routes live in `src/app/`.
- **Route groups** `(auth)`, `(dashboard)`, `(marketing)` organize routes without affecting URL paths.
- **API routes** live in `src/app/api/` and export named HTTP method handlers (GET, POST, etc.).
- **Mobile-first.** All UI is designed for mobile screens first, then scales up. The app is a PWA with `public/manifest.json`.
- **Import alias:** `@/*` maps to `./src/*`.

## Directory Structure

```
src/app/
  (auth)/              Sign-in and sign-up flows
  (dashboard)/
    pro/               Pro-facing pages (dashboard, jobs, profile, earnings)
    client/            Client-facing pages (dashboard, post-job, my-jobs, find-pros)
  (marketing)/         Landing page, how-it-works, for-pros
  api/
    jobs/              Job CRUD and search
    pros/              Pro profile CRUD and search
    dispatch/          Job-to-pro matching algorithm
    payments/          Payment processing and history
public/
  manifest.json        PWA manifest
  icons/               App icons (192x192, 512x512)
```

## Integration Notes

- Consumes BldSync Wiseman APIs for pricing/code/checklist intelligence
- Auth provider: TBD (placeholder routes ready)
- Payments provider: TBD (placeholder routes ready)
- Maps/location: TBD (placeholder for pro search and dispatch)

## Commands

- `npm run dev` -- Start development server
- `npm run build` -- Production build
- `npm run start` -- Start production server
- `npm run lint` -- Run ESLint
