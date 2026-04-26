# Investor Data Room — Setup & Operating Notes

**Route:** `https://www.thesherpapros.com/dataroom`
**Auth:** Clerk (your existing auth) + `publicMetadata.dataroom: true` flag
**Files served from:** `docs-pdf/` (the build output of `npm run docs:all`)
**Code:** `src/app/dataroom/[[...path]]/route.ts` + `src/lib/auth/dataroom.ts`

## How it works

1. Investor visits `https://www.thesherpapros.com/dataroom`.
2. If not signed in → redirected to `/sign-in?redirect=/dataroom`.
3. If signed in but `publicMetadata.dataroom !== true` → redirected to `/sign-in` with the same redirect (treated as unauthorized).
4. If authorized → catch-all route reads the requested file from `docs-pdf/` and streams it back with `Cache-Control: private, no-store` and `X-Robots-Tag: noindex`.

The route handler resolves paths safely (path-traversal blocked) and rewrites the build's `../public/` references in HTML responses on-the-fly so assets resolve to `/...` (Next.js public folder served from root).

## Granting access to an investor

1. Investor signs up at `https://www.thesherpapros.com/sign-up` (or sign-in if they already have an account).
2. Open Clerk dashboard → **Users** → find the investor's email → click them.
3. Edit **Public metadata** (JSON):
   ```json
   {
     "dataroom": true
   }
   ```
   (If they also have a marketplace role, just add the key alongside it: `{ "role": "client", "dataroom": true }`.)
4. Save. Access is immediate; no server restart needed.

To **revoke**: set `dataroom: false` or remove the key.

You can grant yourself access the same way to test before sharing.

## How `docs-pdf/` gets onto the live site

`docs-pdf/` is gitignored. Production deployments need it present at build time so the Vercel File Tracer (configured in `next.config.ts`) bundles it into the serverless function.

Three deploy strategies, ranked by simplicity:

### Option 1 — Generate during Vercel build (recommended for now)

Update `package.json` build script:
```json
{
  "scripts": {
    "build": "npm run docs:all && next build"
  }
}
```

Adds ~7 min to every deploy. Fine for low-frequency releases. Output is fresh on every deploy.

### Option 2 — Commit `docs-pdf/` to git

Remove `docs-pdf/` from `.gitignore` and commit. ~50 MB binary content tracked in git but deploys are fast.

Best if you regenerate locally weekly and want consistent investor-facing snapshots between weekly updates.

### Option 3 — DO migration target (future)

When you move to a Droplet:
- `npm run docs:all` runs on the Droplet (Node + system fonts already there)
- Files live in `/srv/sherpa-pros/docs-pdf/` (or wherever the app root is)
- Same route handler code reads them via `process.cwd()`-relative path
- No Vercel-specific config needed; the `outputFileTracingIncludes` line in `next.config.ts` is a no-op outside Vercel and harmless

The route handler reads from `docs-pdf/` via `process.cwd()` only — no Vercel APIs, no Vercel Blob. **Migrating to DO requires zero code changes for the data room.**

## Local testing

1. `npm run docs:all` — generate `docs-pdf/`
2. Set `publicMetadata.dataroom: true` for your Clerk user (in dev Clerk environment)
3. `npm run dev`
4. Sign in at `http://localhost:3000/sign-in`
5. Visit `http://localhost:3000/dataroom`

## Security model

- **Defense in depth:**
  - Clerk session cookie required (httpOnly, signed)
  - Public metadata check on every request (no caching of auth result)
  - Path traversal blocked at the route handler
  - `Cache-Control: private, no-store` prevents CDN/proxy caching
  - `X-Robots-Tag: noindex, nofollow, noarchive` prevents indexing if a URL leaks
  - Files live outside `public/` so they cannot be served bypassing auth

- **Threat NOT covered:** authorized investor screenshots / PDF downloads — once an investor has access, they can save copies. Standard data-room limitation; mitigate via NDA, not technical controls.

- **Audit trail:** Clerk logs every sign-in. To log per-file access, add logging inside the route handler before returning the response (e.g., write to Postgres or a logging service).

## What investors see

The same `index.html` you view locally — phase-anchored navigation:
- I. Phase 0 Strategy
- II. Phase 0 Pitch
- III. Phase 0 Fundraising
- IV. Phase 1 Lean Launch ★ (latest Wave 12 build)
- V.A Phase 4 Strategic Foundation
- V.B Phase 4 Execution Kits
- VI. Operations · VII. Marketing · VIII. Brand · IX. Slides · X. Binders · XI. Pipelines

All HTML / PDF / slide deck files are reachable from the index.

## Files added this commit

- `src/lib/auth/dataroom.ts` — `hasDataroomAccess()` helper
- `src/app/dataroom/[[...path]]/route.ts` — auth-gated catch-all file server
- `next.config.ts` — `outputFileTracingIncludes` for `docs-pdf/**`
- `docs/operations/dataroom-setup.md` — this file
