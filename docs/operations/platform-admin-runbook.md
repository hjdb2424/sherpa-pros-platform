# Sherpa Pros — Platform Admin Runbook

**Owner:** Phyrom
**Updated:** 2026-04-27
**Use:** Day-to-day operation of the live platform without an AI assistant. Bookmark and refresh as the platform evolves.

---

## 1. Service inventory

The whole stack at a glance:

| Service | What it does | Where to log in | Cost |
|---|---|---|---|
| **GitHub** (`hjdb2424/sherpa-pros-platform`) | Code source-of-truth | `github.com` | Free |
| **Vercel** | Hosts the Next.js app, builds on every git push | `vercel.com` | Hobby/Pro tier |
| **Clerk** (Production instance) | User auth — sign-up, sign-in, sessions | `dashboard.clerk.com` | Free up to 10K MAU |
| **Neon Postgres** | Production database | `neon.tech` | Free tier |
| **Wix** | DNS authoritative for `thesherpapros.com` | `wix.com` | Domain registration |
| **Cloudflare** | (Set up but NOT authoritative) — could later be DNS+CDN | `dash.cloudflare.com` | Free |
| **Stripe Connect** | Marketplace payments + escrow | `dashboard.stripe.com` | 2.9% + 30¢ per txn |
| **Twilio** | SMS / masked-number messaging | `console.twilio.com` | Pay-as-you-go |
| **Zinc API** | Cross-retailer materials orders (Sherpa Materials engine) | `zinc.io` | Per-order fee |
| **Uber Direct** | Same-day materials delivery | `direct.uber.com` | Per-delivery fee |
| **QuickBooks Online (QBO)** | Bookkeeping integration | Phyrom's QBO account | QBO subscription |
| **Google Cloud (Maps + OAuth)** | Maps API, Google sign-in | `console.cloud.google.com` | API quota |

All credentials live in **Vercel → Settings → Environment Variables** (Production tier).

---

## 2. Common operations

### Grant a user data room access

1. `dashboard.clerk.com` → Production instance → **Users**
2. Find user by email → click → **Public metadata** → Edit
3. Set: `{ "dataroom": true }` (merge with existing keys if any)
4. Save → access is immediate, no restart needed

### Audit who has data room access

```bash
cd ~/sherpa-pros-platform
vercel env pull --environment=production .env.local
npm run list:dataroom
```

Prints a table of every user with `dataroom: true`. Note: `CLERK_SECRET_KEY` is marked Sensitive in Vercel — `vercel env pull` returns it empty. To run the script you'll either need to:
- Temporarily un-mark Sensitive in Vercel UI (then re-mark after the pull), OR
- Grab the secret from Clerk dashboard → Production → API Keys → reveal Secret, paste inline:
  ```bash
  CLERK_SECRET_KEY=sk_live_xxx npm run list:dataroom
  ```

### Revoke data room access

Same as grant — set `{ "dataroom": false }` or delete the key entirely from public metadata. Effective immediately.

### Update the data room content

The data room serves rendered HTML from `docs-pdf/` (committed to git). When you add/change content under `docs/`:

```bash
cd ~/sherpa-pros-platform
# 1. Edit/add markdown files under docs/
# 2. Regenerate HTML output
npm run docs:all
# 3. Commit the refreshed output
git add docs/ docs-pdf/
git commit -m "build: refresh data room with [topic]"
git push origin main
# 4. Vercel auto-builds and deploys (~5 min). /dataroom shows the new content.
```

If you change the data room navigation (`docs-pdf/index.html`), edit that file directly and commit. It's hand-curated, not regenerated.

### Deploy a code change

Any push to `main` triggers a Vercel deploy. So:

```bash
git commit -am "your message"
git push origin main
```

Build takes ~3-5 min. Watch progress at `vercel.com` → project → Deployments. Latest entry should match your commit hash.

To force a rebuild without changing code (e.g., after editing env vars):

```bash
git commit --allow-empty -m "chore: redeploy with new env"
git push origin main
```

### Roll back a bad deploy

`vercel.com` → project → Deployments → find the last good deployment → ⋯ → **Promote to Production**. Instant, no rebuild.

### View production logs

`vercel.com` → project → top right **Logs** tab. Filter by route or function name. Last 24-72 hr depending on plan.

### Reset a forgotten password / unlock a user

Clerk dashboard → Users → click user → Sessions / Authentication tab → revoke sessions or send password reset email.

### Update an environment variable

1. `vercel.com` → project → Settings → Environment Variables
2. Edit the value
3. **You must redeploy** for changes to take effect (env vars bake in at build time for `NEXT_PUBLIC_*` and at function-init for server vars)
4. Push an empty commit (see "Deploy a code change" above)

⚠️ Don't mark `NEXT_PUBLIC_*` vars as **Sensitive** — Sensitive vars don't always populate in client bundles correctly. Only mark server-only secrets (like `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`) Sensitive.

---

## 3. File map — where to find things

```
~/sherpa-pros-platform/
├── src/
│   ├── app/                          Next.js routes (App Router)
│   │   ├── (auth)/sign-in            Clerk sign-in page
│   │   ├── (auth)/sign-up            Clerk sign-up page
│   │   ├── (auth)/select-role        Role selection after sign-up
│   │   ├── (dashboard)/admin         Admin pages (gated by sherpa-is-admin cookie)
│   │   ├── (dashboard)/pro           Pro dashboard
│   │   ├── (dashboard)/client        Client dashboard
│   │   ├── (dashboard)/pm            Property manager dashboard
│   │   ├── dataroom/[[...path]]/     Investor data room file server
│   │   ├── api/                      API routes
│   │   └── layout.tsx                Root layout (Clerk provider wraps here)
│   ├── components/
│   │   ├── brand/Logo.tsx            Sherpa Pros wordmark component
│   │   └── ...                       Feature components
│   ├── lib/
│   │   ├── auth/                     Auth helpers
│   │   │   ├── dataroom.ts           Data room access check
│   │   │   ├── get-user.ts           Current user lookup
│   │   │   ├── roles.ts              Role definitions
│   │   │   └── require-role.ts       Server-side role gate
│   │   └── ...                       Other libraries
│   ├── db/                           Drizzle ORM schemas, queries, migrations
│   └── proxy.ts                      Next.js 16 middleware (Clerk + RBAC)
├── docs/                             Markdown source for data room
│   ├── operations/                   Operational artifacts (this runbook lives here)
│   ├── pitch/                        Investor pitch materials
│   ├── superpowers/                  Specs, plans, audits
│   ├── strategy/                     Strategic extensions
│   └── ...
├── docs-pdf/                         Rendered HTML (committed); PDFs gitignored
├── scripts/
│   ├── build-docs-pdf.mjs            Renders markdown → HTML + PDF
│   ├── build-docs-binders.mjs        Stitches PDFs into binders
│   ├── build-docs-slides.mjs         Renders Marp slide decks
│   └── list-dataroom-access.mjs      Prints users with dataroom:true
├── public/
│   └── brand/                        Sherpa Pros logo + icon
├── package.json                      npm scripts: dev / build / docs:all / list:dataroom
├── next.config.ts                    Next.js config (file tracing for /dataroom/**)
└── .gitignore                        Note: docs-pdf/**/*.pdf and *.pptx ignored; HTMLs tracked
```

Key files to know:
- **`src/proxy.ts`** — controls which routes are auth-protected and which roles can access them. Edit `ROUTE_ROLES` to change RBAC.
- **`src/app/dataroom/[[...path]]/route.ts`** — the data room file server with the access-denied page. Edit the `FORBIDDEN_HTML` to change the "request access" page.
- **`src/lib/auth/dataroom.ts`** — the `hasDataroomAccess()` / `getDataroomAccessState()` helpers. Edit if you change the access mechanism.
- **`docs-pdf/index.html`** — the data room navigation hub. Hand-edit to add/remove/reorganize sections.

---

## 4. The build pipeline

`npm run build` runs `next build`. That's it. (Earlier we tried running `docs:all` on Vercel — Puppeteer can't run there, so we don't.)

`docs:all` is local-only:
- `docs:pdf` — markdown → HTML + PDF (Puppeteer required)
- `docs:binders` — stitches multiple PDFs into binders
- `docs:slides` — Marp slide decks

When the data room content changes:
1. Local: `npm run docs:all` (runs Puppeteer, takes ~7 min, generates `docs-pdf/`)
2. Commit the HTML files: `git add docs-pdf/ && git commit -m "build: refresh"` 
3. Push → Vercel deploys with the new HTML

---

## 5. Recurring maintenance tasks

| Cadence | Task |
|---|---|
| Weekly | Review Clerk → Users for spam sign-ups; revoke if needed |
| Weekly | Run `npm run list:dataroom` to verify access list matches who you intended |
| Monthly | Check Vercel → Usage for build-minute / function-invocation budget |
| Monthly | Check Stripe Connect for stuck transfers (look for `requires_action` status) |
| Quarterly | Review GitHub for dependency security alerts (Dependabot) — bump versions |
| As needed | Update `docs/operations/dataroom-setup.md` if you change the access flow |

---

## 6. Troubleshooting

### "Sign-in form doesn't render"

Most likely Clerk issue. Check, in order:
1. `dig clerk.thesherpapros.com +short` returns `frontend-api.clerk.services.` — DNS works
2. `curl -sI https://clerk.thesherpapros.com/` returns HTTP 405 (or any 2xx/4xx that's not a TLS error) — cert is live
3. `curl -s https://thesherpapros.com/sign-in | grep -oE 'pk_(live|test)_[a-zA-Z0-9]{10}'` — publishable key is in the build
4. If all 3 pass and form still doesn't render, open browser DevTools Console — look for Clerk errors

### "Build fails on Vercel"

Check the build log. Common causes:
- TypeScript error → fix locally with `npm run build`, push
- Missing env var → add it in Vercel Settings → redeploy
- Out-of-memory → reduce dependencies or contact Vercel support

### "User can't sign in"

1. Clerk dashboard → Users → search by email
2. If user exists, click → check Sessions tab — any active session blocking?
3. If user doesn't exist, they need to sign up first
4. If user exists but can't sign in, send password reset from the user detail page

### "/dataroom redirects to /pro/dashboard"

User is signed in but lacks `publicMetadata.dataroom: true`. Set it in Clerk dashboard.

### "Data room shows old content"

Vercel cache. Deploy a fresh build (empty commit) to bust it:
```bash
git commit --allow-empty -m "chore: refresh dataroom cache"
git push origin main
```

---

## 7. What's NOT automated yet (manual today, automate later)

- **Granting data room access** — manual via Clerk dashboard. A `/admin/dataroom` UI could surface this in your own admin panel. Backlog.
- **Per-investor file-view tracking** — no audit trail of who viewed which doc. Could log to DB on each request. Backlog.
- **Data room PDF generation** — gitignored to keep repo small. If an investor wants a PDF, generate locally and email. A "download PDF" button on each doc could trigger on-demand generation via Vercel Blob. Backlog.
- **Docs build on Vercel** — currently rendered locally and committed. Could move to a GitHub Action that runs Puppeteer in Linux containers. Backlog.
- **Migrating BetaPortal users to Clerk** — none currently exist (no beta invites sent yet), so this is a non-issue. If you ever sent BetaPortal invites and need to migrate, plan a one-shot script.
- **Admin role wiring** — `users.is_admin = true` exists in the DB schema but nothing reads it. Manual cookie-set is required (see "Set admin cookie" below).

### Set admin cookie (for accessing `/admin/*` routes)

Open `thesherpapros.com` (any page), then DevTools Console:

```js
document.cookie = "sherpa-is-admin=true; path=/; max-age=2592000; samesite=lax";
location.href = "/admin/access-list";
```

30-day cookie. Manual override since there's no UI yet to grant admin status.

---

## 8. Working with an AI assistant in a new session

When you open a new Claude / AI session and want to work on the platform:

### Step 1: Paste this priming prompt

```
I'm working on Sherpa Pros — a national licensed-trade marketplace.
Repo: ~/sherpa-pros-platform (also github.com/hjdb2424/sherpa-pros-platform)
Live: thesherpapros.com (Vercel) + Clerk auth + Neon Postgres + Wix DNS
Founder: Phyrom (poum@hjd.builders)

Read these to ground state:
1. ~/sherpa-pros-platform/CLAUDE.md (tech stack, conventions)
2. ~/sherpa-pros-platform/docs/operations/platform-admin-runbook.md (this file)
3. ~/.claude/projects/-Users-poum/memory/MEMORY.md (memory index)
4. Any specific spec under docs/superpowers/specs/ relevant to today's task

Then I want to work on: [DESCRIBE TASK]
```

### Step 2: For specific feature work, also point them at the relevant spec

The repo has structured specs under `docs/superpowers/specs/` — the AI should read the most recent / relevant one. The drift audit (`docs/superpowers/audits/2026-04-26-migration-vs-platform-scale-drift.md`) is also worth flagging if architectural decisions are involved.

### Step 3: Common conventions the AI should know

- **Don't touch `src/` without explicit approval** — that's the active development surface. Stick to `docs/` unless told otherwise.
- **NEXT_PUBLIC_*** env vars are inlined at build time. Server-only secrets (CLERK_SECRET_KEY, STRIPE_SECRET_KEY) are read at runtime.
- **The data room (`/dataroom`) is gated by Clerk publicMetadata.dataroom: true** — not by role.
- **The 3 marketplace roles are pro/client/pm.** Investors are orthogonal to those (they get the dataroom flag).
- **DNS is on Wix**, not Cloudflare. Don't try to use the Cloudflare panel for DNS changes.
- **Use `Phyrom` as the founder name** — never invent a surname.
- **External-facing copy uses "Sherpa Materials engine"** — never "Wiseman" externally.

### Step 4: Memory

Memory entries persist across sessions at `~/.claude/projects/-Users-poum/memory/`. The most relevant memory file for Sherpa Pros work is `project_sherpa_pros_gtm_phase_0.md` (full session history through Wave 12).

---

## 9. Useful URLs (bookmark these)

- Live site: https://www.thesherpapros.com/
- Data room: https://www.thesherpapros.com/dataroom
- GitHub repo: https://github.com/hjdb2424/sherpa-pros-platform
- Vercel project: https://vercel.com/hjdb2424s-projects/sherpa-pros-platform
- Clerk dashboard: https://dashboard.clerk.com
- Neon DB: https://console.neon.tech
- Wix DNS: https://manage.wix.com → your domain
- Stripe: https://dashboard.stripe.com
- Twilio: https://console.twilio.com

---

## 10. Last updated

2026-04-27 — Phase 0 (pre-seed Wefunder + 10-pro beta + investor data room launch).

Edit this file directly when:
- A new service is added to the stack
- A common operation gains a new step
- A "manual today" item gets automated
- Conventions change

Keep it tight. This file is your future self's first read when something's broken.
