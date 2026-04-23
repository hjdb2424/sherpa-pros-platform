# Sherpa Pros Phase 0 — Fundraise & Beta — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the first 90 days of the Sherpa Pros GTM plan — launch a 10+ pro live-transacting beta cohort, produce all pitch materials, and trigger Phase 1 by closing on any one of: $250K+ non-dilutive, $500K+ Wefunder+angel soft-circled, or Tier-1 accelerator acceptance.

**Architecture:** Nine parallel workstreams (A through I) executed concurrently by Phyrom + 2 Upwork US contractors + Claude sub-agents. Each workstream has its own owner and weekly cadence. Critical-path dependencies: Stripe Connect (gates beta), Pitch Deck v1 (gates VC), Wefunder soft-commit (gates public launch). Workstream review happens every Monday with traction metrics, fundraise pipeline, and risk-register update.

**Tech Stack:** Next.js 16, Tailwind 4, Drizzle/Neon Postgres, Stripe Connect, Twilio, QBO, Apple Developer + TestFlight, OpenSign, Wefunder, Notion (data room), Loom (demo video), Claude Agent catalog (Executive Summary Generator, marketing-content-creator, marketing-social-media-strategist, marketing-growth-hacker, product-trend-researcher, data-analytics-reporter, Brand Guardian, App Store Optimizer).

**Source spec:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md`

**Owners:**
- **P** = Phyrom (founder, all-in, 60-hr/wk hard cap)
- **SDR** = Upwork US contractor #1 (~15 hr/wk, sales/recruiting)
- **CONTENT** = Upwork US contractor #2 (~10 hr/wk, content/deck polish)
- **AI** = Claude sub-agent dispatch (parallelized in waves)

---

## Workstream A — Tech & Legal Foundation (Weeks 1–2)

**Goal:** Unblock everything downstream. Stripe Connect, Apple Dev, data-scoping fixes, beta agreement, insurance, IP, legal opinion.

### Task A1: Stripe Connect live for Sherpa Pros LLC

**Owner:** P
**Files:**
- Modify: `src/lib/payments/stripe.ts` (replace test keys with live keys via env)
- Modify: `.env.local` (NEW Sherpa Pros LLC live keys — never commit)
- Modify: `.env.example` (document required env vars without values)

- [ ] **Step 1: Create Sherpa Pros LLC Stripe Connect account**

Open https://dashboard.stripe.com/register. Use Sherpa Pros LLC EIN (DBA Cranston Holdings). Submit:
- Business name: Sherpa Pros LLC
- Business type: LLC, single-member
- Industry: Online marketplaces (MCC 7372 software platform)
- Tax ID: Sherpa Pros LLC EIN
- Bank account: BlueVine business account
- Owner ID: Phyrom NH driver's license + SSN
- Expected volume: $5K/mo (beta)

Expected: Stripe approval within 24–48 hours. Reach test-mode dashboard immediately.

- [ ] **Step 2: Enable Stripe Connect (Express)**

In Stripe Dashboard → Connect → Get Started. Choose **Express** (not Standard, not Custom — Express is right for marketplace pros).
- Country: US
- Connect type: Express
- Business model: Marketplace
- Funds flow: We collect from clients, payout to pros

- [ ] **Step 3: Get live keys + webhook secret**

Dashboard → Developers → API keys → Reveal live secret key.
Dashboard → Developers → Webhooks → Add endpoint:
- URL: `https://sherpa-pros-platform.vercel.app/api/stripe/webhook`
- Events: `account.updated`, `payout.created`, `payment_intent.succeeded`, `transfer.created`, `charge.dispute.created`

Copy webhook signing secret.

- [ ] **Step 4: Add live keys to Vercel project**

```bash
cd /Users/poum/sherpa-pros-platform
vercel env add STRIPE_SECRET_KEY production
# paste live secret
vercel env add STRIPE_WEBHOOK_SECRET production
# paste webhook secret
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# paste publishable key
```

- [ ] **Step 5: Verify lazy initialization still works**

Read `src/lib/payments/stripe.ts`. Confirm getStripe() pattern (no module-level `new Stripe()`). Build must pass without env vars. If module-level init exists, refactor to getter.

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 6: Test Connect onboarding flow with one fake pro**

```bash
npm run dev
```
Open http://localhost:3000/onboarding/pro → trigger Stripe Connect onboarding. Complete the test account flow with Stripe's test SSN `000-00-0000`. Confirm redirect back to platform with `account.updated` webhook firing.

- [ ] **Step 7: Commit**

```bash
git add .env.example src/lib/payments/stripe.ts
git commit -m "chore(payments): switch Stripe to live keys, document env vars"
```

---

### Task A2: Apple Developer account + TestFlight setup

**Owner:** P
**Files:**
- Modify: `mobile/app.json` (bundle identifier, version)
- Create: `mobile/eas.json` (EAS Build config if not present)

- [ ] **Step 1: Enroll in Apple Developer Program**

https://developer.apple.com/programs/enroll/ → Individual or Organization (Sherpa Pros LLC if D-U-N-S obtained, else Individual under Phyrom). $99/yr.
Expected: approval within 24–48 hours.

- [ ] **Step 2: Create App ID + provisioning profile**

Apple Developer → Certificates, IDs & Profiles → Identifiers → App IDs → New.
- Bundle ID: `com.sherpapros.app`
- Capabilities: Push Notifications (off — not paying for APNS yet), Associated Domains (for deep links)

- [ ] **Step 3: Update mobile bundle identifier**

Read `mobile/app.json`. Update `expo.ios.bundleIdentifier` to `com.sherpapros.app`. Bump `expo.version` to `1.0.0-beta.1`.

- [ ] **Step 4: Build release for TestFlight**

```bash
cd /Users/poum/sherpa-pros-platform/mobile
npx expo prebuild --platform ios
eas build --platform ios --profile production
```
Expected: EAS Build queues; ~20-min wait; outputs .ipa.

- [ ] **Step 5: Upload to TestFlight**

```bash
eas submit --platform ios --latest
```
Expected: Build appears in TestFlight within 30 minutes after Apple processing.

- [ ] **Step 6: Create internal TestFlight group "Founding Pros"**

App Store Connect → TestFlight → Internal Testing → New Group → "Founding Pros". Add Phyrom + first 3 HJD beta pros' Apple IDs.

- [ ] **Step 7: Commit**

```bash
git add mobile/app.json mobile/eas.json
git commit -m "feat(mobile): production bundle id + TestFlight beta build config"
```

---

### Task A3: TODO-MVP data scoping fixes

**Owner:** P
**Files:**
- Read first: `docs/TODO-MVP-FIXES.md` (the existing TODO checklist)
- Modify: API routes in `src/app/api/jobs/`, `src/app/api/pros/`, `src/app/api/payments/` (per checklist)
- Test: `tests/api/scoping.test.ts` (NEW)

- [ ] **Step 1: Read the TODO checklist**

```bash
cat /Users/poum/sherpa-pros-platform/docs/TODO-MVP-FIXES.md
```
Expected: list of unscoped API routes that leak cross-account data.

- [ ] **Step 2: Write a failing scoping test for jobs API**

Create `tests/api/scoping.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/jobs/route';

describe('GET /api/jobs scoping', () => {
  it('returns only jobs owned by the requesting user', async () => {
    const userAJobs = await fetchJobsAs('user-a-clerk-id');
    const userBJobs = await fetchJobsAs('user-b-clerk-id');

    expect(userAJobs.every(j => j.client_id === 'user-a-clerk-id')).toBe(true);
    expect(userBJobs.every(j => j.client_id === 'user-b-clerk-id')).toBe(true);
    expect(userAJobs.find(j => j.client_id === 'user-b-clerk-id')).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run the failing test**

```bash
npx vitest run tests/api/scoping.test.ts
```
Expected: FAIL — currently returns all jobs.

- [ ] **Step 4: Add scoping in `src/app/api/jobs/route.ts`**

Modify GET handler to require Clerk userId and filter `db.jobs.where(eq(jobs.clientId, userId))`.

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/drizzle-schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const result = await db.select().from(jobs).where(eq(jobs.clientId, userId));
  return NextResponse.json({ jobs: result });
}
```

- [ ] **Step 5: Run test to verify pass**

```bash
npx vitest run tests/api/scoping.test.ts
```
Expected: PASS.

- [ ] **Step 6: Repeat for each route in `docs/TODO-MVP-FIXES.md`**

For each unscoped endpoint, write failing test → fix → green test. One commit per route.

- [ ] **Step 7: Commit**

```bash
git add src/app/api tests/api
git commit -m "fix(api): scope all queries to authenticated user (closes data leak)"
```

---

### Task A4: OpenSign beta agreement template

**Owner:** P + CONTENT
**Files:**
- Create: `docs/legal/founding-pro-agreement.md` (source markdown)
- Create: OpenSign template (external — record template ID)
- Modify: `src/app/onboarding/pro/page.tsx` (insert OpenSign embed after profile completion)

- [ ] **Step 1: Draft the Founding Pro Agreement**

Create `docs/legal/founding-pro-agreement.md` containing the beta terms from spec §5.3:
- 90-day beta minimum
- Real work only (no simulated jobs)
- Weekly 10-min in-app feedback
- 1 video testimonial + logo use rights
- <24-hour client inquiry response
- Verified license + insurance uploaded
- Founding Pro badge (permanent)
- Half-price (5% take) grandfathered forever if pro stays past beta
- Mutual termination right
- 1099 contractor classification (not employee)

- [ ] **Step 2: Run draft through legal review (Task A7 attorney)**

Send to attorney (see Task A7) for review. Budget: 1 hr @ $250–400/hr = ~$300.

- [ ] **Step 3: Build OpenSign template**

Open https://opensignlabs.com → New Template → upload PDF version of approved agreement. Add signature fields, date, license number, insurance certificate upload field. Save template ID to env var `OPENSIGN_FOUNDING_PRO_TEMPLATE_ID`.

- [ ] **Step 4: Embed OpenSign in pro onboarding flow**

Read `src/app/onboarding/pro/page.tsx`. Add a step after profile-completion that triggers OpenSign signature request via API, blocks pro from "go live" status until signed.

- [ ] **Step 5: Commit**

```bash
git add docs/legal/founding-pro-agreement.md src/app/onboarding/pro
git commit -m "feat(onboarding): require Founding Pro Agreement signature via OpenSign"
```

---

### Task A5: Platform liability insurance

**Owner:** P
**Files:**
- Create: `docs/operations/insurance-policy.md` (record carrier, policy #, coverage, renewal date)

- [ ] **Step 1: Get 3 quotes for platform liability**

Carriers to quote:
- Hiscox Small Business
- Next Insurance
- The Hartford

Coverage spec:
- General liability: $1M per occurrence / $2M aggregate
- Professional liability / E&O: $1M
- Cyber liability: $500K (data breach for pro/client PII)
- Marketplace endorsement (third-party-contractor exposure carve-out)

Expected: $700–$1,200/yr.

- [ ] **Step 2: Bind policy with chosen carrier**

Pick best price + marketplace-endorsement coverage. Pay annually. Save policy PDF in `docs/operations/`.

- [ ] **Step 3: Commit policy summary**

```bash
git add docs/operations/insurance-policy.md
git commit -m "docs(ops): record platform liability insurance policy"
```

---

### Task A6: Old-House Verified USPTO trademark filing

**Owner:** P
**Files:**
- Create: `docs/legal/trademark-old-house-verified.md`

- [ ] **Step 1: USPTO TESS clearance search**

Open https://tmsearch.uspto.gov/ → search exact phrase "OLD-HOUSE VERIFIED" and "OLD HOUSE VERIFIED". Verify no live registrations. Save screenshot.

- [ ] **Step 2: File TEAS Plus application**

Open https://www.uspto.gov/trademarks/apply → TEAS Plus ($250 per class).
- Mark: OLD-HOUSE VERIFIED
- Class 35: Online marketplace services for licensed contractors
- Class 42: Software platform for matching homeowners with verified contractors
- Specimen: screenshot of in-app badge from Sherpa Pros
- Owner: Sherpa Pros LLC
- Filing basis: 1(b) Intent-to-Use (since beta hasn't shipped Old-House Verified yet)

Total cost: $500 (2 classes).

- [ ] **Step 3: Record application serial number**

Write to `docs/legal/trademark-old-house-verified.md`: serial number, filing date, classes, specimen URL.

- [ ] **Step 4: Commit**

```bash
git add docs/legal/trademark-old-house-verified.md
git commit -m "docs(legal): file Old-House Verified trademark (USPTO Class 35 + 42)"
```

---

### Task A7: 1099 vs W-2 worker-classification legal opinion

**Owner:** P
**Files:**
- Create: `docs/legal/1099-classification-opinion.md` (final attorney memo)

- [ ] **Step 1: Identify MA + NH employment attorney**

Search for MA/NH-licensed attorney with marketplace/gig-economy experience. Recommended firms: Foley Hoag (Boston), Devine Millimet (NH), Pierce Atwood (ME). Budget: $1,500–3,000 flat fee for opinion memo.

- [ ] **Step 2: Engage attorney with brief**

Send Sherpa Pros pro classification facts:
- Pros are independently licensed by their state
- Pros carry their own general liability + workers' comp insurance
- Pros own their own tools and vehicles
- Pros set their own bid prices and accept/decline jobs
- Sherpa Pros provides matching, payment processing, and dispute resolution only
- Sherpa Pros does not direct work hours, work location, or work methods
- Pros may use other platforms simultaneously

Ask: 1099 contractor classification defensible under (a) MA AB-style ABC test, (b) NH employment law, (c) IRS 20-factor test.

- [ ] **Step 3: Receive + file memo**

Save attorney opinion as `docs/legal/1099-classification-opinion.md`. This document is the defensive artifact in case of state action.

- [ ] **Step 4: Commit**

```bash
git add docs/legal/1099-classification-opinion.md
git commit -m "docs(legal): attorney memo on 1099 contractor classification (MA + NH + IRS)"
```

---

## Workstream B — Beta Cohort Recruiting & Activation (Weeks 2–12)

**Goal:** 10+ pros active and transacting by Week 6. 30+ jobs and $24K+ GMV by Week 12.

### Task B1: Define ICP + outreach script

**Owner:** P + SDR
**Files:**
- Create: `docs/operations/beta-pro-icp.md`
- Create: `docs/operations/beta-outreach-script.md`

- [ ] **Step 1: Write the ICP (Ideal Customer Profile)**

Per spec §5.1, document the cohort composition:
- NH/Seacoast (6–7): 2 GCs, 2 handymen, 1 plumber, 1 HVAC/heat-pump
- ME/Portland (1–2): 1 painter, 1 landscaper
- MA/Boston specialty (2–3): 1 licensed electrician, 1 old-house specialist, 1 roofer

For each, document: license type required, insurance threshold, years in business minimum (2+), avg ticket range, willingness to test new platform.

- [ ] **Step 2: Write outreach script (call + email + DM versions)**

Script must lead with founder story ("I'm Phyrom, I run HJD Builders here in NH, I built this platform because Angi was wasting our time"). Three variants:
- (A) HJD network warm: "You've worked with HJD — I'm building something for our crowd"
- (B) Cold supply-house: "Saw you at FW Webb — got 30 seconds for what I'm doing?"
- (C) LinkedIn DM: short, direct, link to founder LinkedIn post

Each version must end with: "5% take rate during beta. Half-price forever if you stay. 90-day commitment. Full platform access. Want to see it?"

- [ ] **Step 3: Commit**

```bash
git add docs/operations/beta-pro-icp.md docs/operations/beta-outreach-script.md
git commit -m "docs(ops): beta pro ICP + outreach script (3 variants)"
```

---

### Task B2: Recruit 10 beta pros (rolling Weeks 2–6)

**Owner:** SDR (P closes high-value warm leads personally)
**Files:**
- Create: `docs/operations/beta-cohort-pipeline.md` (pipeline tracker)

- [ ] **Step 1: Seed pipeline with HJD warm contacts**

P provides SDR with list of 20+ HJD network contractors meeting ICP. SDR enters into `beta-cohort-pipeline.md` table with columns: Name, Trade, Metro, Status (cold/contacted/demo/onboarding/active), Last touch, Notes.

- [ ] **Step 2: 30 cold outreach contacts/week from W2–W5**

SDR runs script B1 against:
- W2: HJD warm (target: 6 demos booked)
- W3: NH/ME supply-house referrals (FW Webb, Lowe's Pro, Rockler) (target: 8 demos)
- W4: MA Boston specialty (Mass Save Network listings, NECA member directory, MA Roofing Contractors Assoc) (target: 8 demos)
- W5: NHHBA + MEHBA member outreach (target: 6 demos)

- [ ] **Step 3: P runs every demo personally**

30-min Zoom or in-person. Walk through: post a job → match → bid → quote → close → payout. Show Wiseman code-check. Show Stripe payout. Close with: "Sign the agreement now and I'll have you live by Friday."

- [ ] **Step 4: Onboard each pro in <72 hours of agreement signed**

Pro-side checklist:
- License verified via state board API or manual
- Insurance certificate uploaded
- Profile completed (photo, bio, services, service area)
- Stripe Connect Express onboarding complete
- First job posted to them within 7 days (P drives demand from HJD client list if needed)

- [ ] **Step 5: Track to 10+ active pros by W6**

"Active" = signed agreement + Stripe Connect complete + ≥1 job in pipeline. If short by W5, P personally calls 5 more HJD warm contacts.

- [ ] **Step 6: Update pipeline weekly + commit**

Every Monday SDR updates `beta-cohort-pipeline.md`.

```bash
git add docs/operations/beta-cohort-pipeline.md
git commit -m "docs(ops): beta cohort weekly pipeline update — W<N>"
```

---

### Task B3: Drive first job per pro within 14 days of activation

**Owner:** P
**Files:** None (operational)

- [ ] **Step 1: Identify demand source per pro**

For each newly active pro, identify which HJD client or contact has a relevant job. P personally connects them ("Bob, posted your job to a guy I trust on a new platform — Mike will call you tomorrow").

- [ ] **Step 2: If no warm demand, post a placeholder job from a friendly client**

P recruits 5 HJD friends/family to be "founding clients" who post real (not simulated) small jobs ($150–500). Real money flows; testimonials built.

- [ ] **Step 3: Hand-hold first transaction end-to-end**

P shadows first job: post → match → bid → accept → schedule → completion → payout → review. Captures pain points in `docs/operations/beta-friction-log.md`.

- [ ] **Step 4: Commit friction log weekly**

```bash
git add docs/operations/beta-friction-log.md
git commit -m "docs(ops): beta friction log W<N>"
```

---

### Task B4: Weekly NPS + structured feedback survey

**Owner:** P
**Files:**
- Create: `src/app/api/beta-feedback/route.ts` (POST endpoint)
- Create: `src/app/(dashboard)/pro/feedback/page.tsx` (in-app weekly form)

- [ ] **Step 1: Write failing test for feedback POST**

Create `tests/api/beta-feedback.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/beta-feedback/route';

describe('POST /api/beta-feedback', () => {
  it('records nps, friction, ask_for from authenticated pro', async () => {
    const req = new Request('http://test/api/beta-feedback', {
      method: 'POST',
      body: JSON.stringify({ nps: 9, friction: 'slow payouts', ask_for: 'PWA push' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Run test, see it fail**

```bash
npx vitest run tests/api/beta-feedback.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implement POST route**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { betaFeedback } from '@/db/drizzle-schema';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  await db.insert(betaFeedback).values({
    userId,
    nps: body.nps,
    friction: body.friction,
    askFor: body.ask_for,
    weekOf: new Date().toISOString().slice(0, 10),
  });

  return NextResponse.json({ ok: true });
}
```

Add `betaFeedback` table to `src/db/drizzle-schema.ts`:
```typescript
export const betaFeedback = pgTable('beta_feedback', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  nps: integer('nps').notNull(),
  friction: text('friction'),
  askFor: text('ask_for'),
  weekOf: date('week_of').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

Generate migration:
```bash
npx drizzle-kit generate
npx drizzle-kit push
```

- [ ] **Step 4: Run test to verify pass**

```bash
npx vitest run tests/api/beta-feedback.test.ts
```
Expected: PASS.

- [ ] **Step 5: Build the in-app weekly form**

Create `src/app/(dashboard)/pro/feedback/page.tsx` — simple 3-question form (NPS slider, "biggest friction this week" textarea, "what would you ask me to build" textarea). POSTs to `/api/beta-feedback`.

Send weekly Twilio SMS reminder every Monday morning to active beta pros: "Quick 3-question check-in: [link]. Takes 90 seconds."

- [ ] **Step 6: Commit**

```bash
git add tests/api/beta-feedback.test.ts src/app/api/beta-feedback src/app/\(dashboard\)/pro/feedback src/db/drizzle-schema.ts src/db/migrations
git commit -m "feat(beta): weekly NPS + friction feedback API and in-app form"
```

---

## Workstream C — Pitch Materials (Weeks 1–4)

**Goal:** Investor-ready deck, one-pager, demo video, founder bio, data room — all in 4 weeks.

### Task C1: Dispatch Executive Summary Generator agent for pitch deck

**Owner:** AI (P reviews)
**Files:**
- Output: `docs/pitch/sherpa-pros-deck-v1.md` (markdown deck draft)
- Output: `docs/pitch/sherpa-pros-onepager-v1.md`

- [ ] **Step 1: Dispatch the agent with full context**

Use `Agent` tool with `subagent_type: "Executive Summary Generator"`. Prompt:

> Build a 10-slide investor pitch deck and 1-page executive summary for Sherpa Pros — a licensed-trade marketplace for New England, built by a working GC. Read the full GTM design at `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md` for context.
>
> Use SCQA (Situation-Complication-Question-Answer) for the deck arc and BCG Pyramid Principle for the one-pager. Slides:
> 1. Hero / founder hook (Phyrom built it for himself)
> 2. Problem (lead-gen platforms, MA labor shortage, code-aware gap)
> 3. Why now (Mass Save tailwind, contractor retirements, AI moment)
> 4. Solution (jobs not leads, Wiseman code intelligence)
> 5. Product demo (live platform screenshots, Wiseman, mobile)
> 6. Market (TAM/SAM/SOM — NE first, national specialty later)
> 7. Business model (5%→10% take + $49 sub, PM tier $4–$1.50/unit)
> 8. Traction (beta cohort numbers — placeholder for live metrics)
> 9. Team + advisors (Phyrom + planned hires)
> 10. Ask + use of funds + 90-day milestones
>
> Output as markdown to `docs/pitch/sherpa-pros-deck-v1.md` and `docs/pitch/sherpa-pros-onepager-v1.md`. Plain prose for now — design comes later.

- [ ] **Step 2: P reviews + iterates with agent**

Read agent output. Mark issues. Re-prompt agent with specific revisions until satisfied.

- [ ] **Step 3: Hand to CONTENT for design polish**

Once language is locked, CONTENT contractor uses Pitch.com / Slidebean / Figma to produce visual deck. Final outputs: `docs/pitch/sherpa-pros-deck-v1.pdf` + `.pptx`.

- [ ] **Step 4: Commit drafts**

```bash
git add docs/pitch/
git commit -m "docs(pitch): v1 investor deck + one-pager (text drafts via Executive Summary Generator)"
```

---

### Task C2: Dispatch product-trend-researcher for competitive deep-dive + market sizing

**Owner:** AI (P reviews)
**Files:**
- Output: `docs/pitch/competitive-analysis.md`
- Output: `docs/pitch/tam-sam-som.md`

- [ ] **Step 1: Dispatch the agent**

Use `Agent` tool with `subagent_type: "product-trend-researcher"`. Prompt:

> Produce two artifacts for the Sherpa Pros pitch:
> 1. Competitive analysis matrix — Angi (ANGI ticker, public financials), Thumbtack (private, latest valuation), TaskRabbit (IKEA-owned, segment data), Handy (ANGI-owned). For each: revenue, take-rate model, market share in NE, weaknesses, our advantage.
> 2. TAM/SAM/SOM sizing for licensed home services in New England + Boston metro. Use US Census construction spending, NAHB residential remodeling expenditure data, and Mass Save / National Grid heat pump install pipeline data (cite sources).
>
> Read context at `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md`. Output to `docs/pitch/competitive-analysis.md` and `docs/pitch/tam-sam-som.md`.

- [ ] **Step 2: P reviews + commits**

```bash
git add docs/pitch/competitive-analysis.md docs/pitch/tam-sam-som.md
git commit -m "docs(pitch): competitive analysis + TAM/SAM/SOM sizing"
```

---

### Task C3: Dispatch data-analytics-reporter for investor metrics dashboard

**Owner:** AI (P reviews)
**Files:**
- Output: `docs/pitch/metrics-dashboard-design.md`
- Output: implementation in `src/app/(dashboard)/admin/investor-metrics/page.tsx`

- [ ] **Step 1: Dispatch the agent**

Use `Agent` tool with `subagent_type: "data-analytics-reporter"`. Prompt:

> Design the investor-facing metrics dashboard for Sherpa Pros admin panel. Required metrics:
> - GMV (total + by-metro + by-trade, 7d/30d/90d windows)
> - Take-rate capture (5% beta vs 10% standard)
> - Pro liquidity ratio (matched-to-posted within 2 hours, by metro)
> - Avg bids per job
> - Pro retention cohort curve (% active at week 4, 8, 12)
> - Client repeat rate
> - NPS time series (pro + client)
> - Wiseman usage (validations / day, code checks / day)
> - Funnel: posted → matched → bid → accepted → completed → paid → reviewed
>
> Existing: Neon Postgres, Drizzle ORM, the schema in `src/db/drizzle-schema.ts`. Output: a design doc at `docs/pitch/metrics-dashboard-design.md` (mock data + chart specs) and an implementation at `src/app/(dashboard)/admin/investor-metrics/page.tsx` using Tremor + TanStack Table + shadcn/ui.

- [ ] **Step 2: P reviews; CONTENT polishes if needed**

- [ ] **Step 3: Commit**

```bash
git add docs/pitch/metrics-dashboard-design.md src/app/\(dashboard\)/admin/investor-metrics
git commit -m "feat(admin): investor metrics dashboard (live + mock data fallback)"
```

---

### Task C4: Founder bio + headshot + photo

**Owner:** P
**Files:**
- Create: `docs/pitch/founder-bio.md`
- Create: `public/founder/phyrom-headshot.jpg` + `phyrom-on-site.jpg`

- [ ] **Step 1: Write 3 bio versions (50w, 150w, 300w)**

Tagline format: "Working GC, NH-based, founder of HJD Builders since [year]. Built Sherpa Pros after [N] years of fighting Angi for leads."

- [ ] **Step 2: Get pro photos**

Hire NH photographer (~$300, 2-hour session). Two shots required:
- Headshot: Phyrom in clean shirt, neutral background
- On-site: Phyrom on a job site in HJD branded gear, tools visible

- [ ] **Step 3: Commit**

```bash
git add docs/pitch/founder-bio.md public/founder
git commit -m "docs(pitch): founder bio (3 lengths) + headshot + on-site photo"
```

---

### Task C5: 3-min demo video (Loom)

**Owner:** P
**Files:**
- Create: `docs/pitch/demo-video.md` (script + Loom URL)

- [ ] **Step 1: Write 90-second script**

Show:
1. (10s) Phyrom intro — "Hi, I'm Phyrom, I run HJD Builders. Here's the platform I built."
2. (30s) Client posts job → matched in 90 seconds → 3 bids returned with Wiseman code-validated quotes
3. (30s) Pro perspective — accepts job, schedules, completes, instant Stripe payout
4. (10s) Mass Save / Old-House Verified specialty filter demo
5. (10s) "If you're a contractor or homeowner, [URL]. If you're an investor, [URL]."

- [ ] **Step 2: Record via Loom**

Use Loom desktop app. Screen-record + webcam picture-in-picture. Re-take until under 3 minutes.

- [ ] **Step 3: Save URL + commit script**

```bash
git add docs/pitch/demo-video.md
git commit -m "docs(pitch): 3-min Loom demo video script + URL"
```

---

### Task C6: Data room (Notion or DocSend)

**Owner:** P
**Files:**
- Create: `docs/pitch/data-room-index.md` (manifest of what's in the data room)

- [ ] **Step 1: Set up Notion data-room workspace**

Create new Notion workspace "Sherpa Pros Investors". Required pages:
- Cover (logo, one-line, founder photo)
- Pitch deck (linked PDF)
- One-pager
- Demo video (Loom embed)
- Live metrics dashboard (link)
- Cap table
- Financial model (5-year)
- Founder bio + LinkedIn
- Beta cohort progress
- Press / media kit
- Legal (incorporation cert, EIN, IP filings)
- Contact

Set permissions: link-only, view-only, password-protected. Track who opens what via DocSend if budget allows ($60/mo).

- [ ] **Step 2: Document the index**

Write `docs/pitch/data-room-index.md` listing every page + Notion URL.

- [ ] **Step 3: Commit**

```bash
git add docs/pitch/data-room-index.md
git commit -m "docs(pitch): data room index (Notion link-only)"
```

---

### Task C7: Brand Guardian consistency audit

**Owner:** AI (P reviews)
**Files:**
- Output: `docs/pitch/brand-audit.md`

- [ ] **Step 1: Dispatch Brand Guardian agent**

Use `Agent` tool with `subagent_type: "Brand Guardian"`. Prompt:

> Audit brand consistency across these Sherpa Pros artifacts. Read each, then write a punch list of inconsistencies in voice, visual, and message:
> - `docs/pitch/sherpa-pros-deck-v1.md`
> - `docs/pitch/sherpa-pros-onepager-v1.md`
> - `docs/pitch/founder-bio.md`
> - `src/app/page.tsx` (landing page)
> - `mobile/app.json` (mobile app description)
> - `README.md`
>
> Brand bible (from spec §3): Hero is "The licensed-trade marketplace that thinks like a contractor." Voice is plainspoken, 8th-grade reading level. Always say: Licensed, Verified, Code-aware, Built by a contractor, Local, Jobs not leads. Never say: Wiseman externally, Gig, Task, Uber for X externally, AI-powered as headline, Disrupt, Revolutionize. Spell out abbreviations.
>
> Output to `docs/pitch/brand-audit.md` with prioritized fixes.

- [ ] **Step 2: P applies the fixes**

- [ ] **Step 3: Commit**

```bash
git add docs/pitch/brand-audit.md
git commit -m "docs(pitch): Brand Guardian audit + applied fixes"
```

---

## Workstream D — Marketing & Content (Weeks 2–12)

**Goal:** Founder LinkedIn presence + landing page conversion + pro recruiting copy. AI agents draft, Phyrom is the voice.

### Task D1: Dispatch marketing-content-creator agent for landing copy + email sequences

**Owner:** AI (P reviews)
**Files:**
- Modify: `src/app/page.tsx` (homeowner landing)
- Modify: `src/app/for-pros/page.tsx` (pro landing)
- Output: `docs/marketing/email-sequences/` (drafts)

- [ ] **Step 1: Dispatch the agent**

Use `Agent` tool with `subagent_type: "marketing-content-creator"`. Prompt:

> Write Sherpa Pros copy for:
> 1. Homeowner landing page — convert visitors into job-posters. Hero, 3-section value prop, social proof slot, trust signals (license verification, Wiseman code-check, real reviews), CTA "Post a job free."
> 2. Pro landing page — convert contractors into Founding Pros. Hero, "5% take vs Angi's effective 30%" comparison table, Founding Pro benefits, founder Phyrom quote, CTA "Apply for the beta."
> 3. Pro recruiting email sequence (5 emails over 14 days for cold contractors who didn't respond to first outreach)
> 4. Client recruiting email sequence (3 emails for HJD clients onboarding to Sherpa Pros)
>
> Brand bible attached: spec §3.3. Voice is plainspoken, 8th-grade reading level. Always say "Jobs. Not leads."
>
> Read existing landing at `src/app/page.tsx`. Output landing TSX changes inline; output email sequences to `docs/marketing/email-sequences/`.

- [ ] **Step 2: P reviews + commits**

```bash
git add src/app/page.tsx src/app/for-pros docs/marketing
git commit -m "feat(marketing): landing copy refresh + 4 email sequences (via marketing-content-creator)"
```

---

### Task D2: Dispatch marketing-social-media-strategist for LinkedIn 90-day editorial

**Owner:** AI (P reviews + posts)
**Files:**
- Output: `docs/marketing/linkedin-editorial.md` (90-day calendar with topics + hooks)

- [ ] **Step 1: Dispatch agent**

Use `Agent` tool with `subagent_type: "marketing-social-media-strategist"`. Prompt:

> Build a 90-day LinkedIn editorial calendar for Phyrom (founder of Sherpa Pros, NH-based GC). Cadence: 3 posts/week (Mon/Wed/Fri).
>
> Themes:
> - "Jobs. Not leads." narrative — call out Angi/Thumbtack pain points contractors share
> - Founder build-in-public — daily progress on Sherpa Pros + beta cohort
> - Construction labor shortage commentary (cite stats)
> - Wiseman moments — show code-aware matching (without naming Wiseman externally)
> - Beta pro spotlights (with their permission)
> - Mass Save / EV charger / heat pump "education" content
>
> Output: `docs/marketing/linkedin-editorial.md` — table with date, theme, hook, suggested first 2 lines, suggested CTA.

- [ ] **Step 2: P posts daily; SDR drafts when P is slammed**

- [ ] **Step 3: Commit calendar + weekly cadence updates**

```bash
git add docs/marketing/linkedin-editorial.md
git commit -m "docs(marketing): 90-day Phyrom LinkedIn editorial calendar"
```

---

### Task D3: Dispatch marketing-growth-hacker for referral mechanics

**Owner:** AI (P reviews; engineering implements)
**Files:**
- Output: `docs/marketing/referral-mechanics-design.md`

- [ ] **Step 1: Dispatch agent**

Use `Agent` tool with `subagent_type: "marketing-growth-hacker"`. Prompt:

> Design two-sided referral mechanics for Sherpa Pros marketplace.
>
> Loops to design:
> 1. Pro → Pro (Founding Pro refers another contractor; both get [reward])
> 2. Client → Client (homeowner refers neighbor; both get [reward])
> 3. Pro → Client (pro brings their existing client onto the platform)
> 4. Client → PM (homeowner refers a property manager — high-value referral)
>
> Constraints: Must work with existing Stripe Connect payout flow. Cannot offer cash directly (Reg CF / SEC concerns during fundraise). Use platform credits or fee waivers instead. Design for fraud-resistance (one referrer per signup, must complete first job).
>
> Output to `docs/marketing/referral-mechanics-design.md` with: reward structure, fraud controls, attribution method, copy for in-app + email, success metrics.

- [ ] **Step 2: P reviews; engineering implements in Phase 1 (deferred)**

- [ ] **Step 3: Commit design**

```bash
git add docs/marketing/referral-mechanics-design.md
git commit -m "docs(marketing): two-sided referral mechanics design (implementation in Phase 1)"
```

---

### Task D4: Supply-house flyer design + distribution

**Owner:** CONTENT (design) + SDR (distribution)
**Files:**
- Create: `docs/marketing/supply-house-flyer.pdf` + source

- [ ] **Step 1: CONTENT designs flyer**

8.5×11 single-sided. Hero: "Jobs. Not leads. 5% when you get paid. Built by a NH GC." QR code → for-pros landing. Phyrom photo on site. Sherpa Pros logo. Founding Pro CTA.

- [ ] **Step 2: SDR distributes to 20 supply houses**

Target list:
- FW Webb (Portsmouth, Manchester, Portland, Boston)
- Lowe's Pro Desk (4 NH/MA stores)
- Rockler (Cambridge MA)
- Best Tile (multiple)
- Local independent supply (e.g., Riverhead Building Supply)

Get manager permission, leave 25 flyers per location, return weekly to refill.

- [ ] **Step 3: Commit design**

```bash
git add docs/marketing/supply-house-flyer.pdf
git commit -m "docs(marketing): supply-house flyer (Founding Pro recruit)"
```

---

### Task D5: NHHBA + MEHBA partnership pitches

**Owner:** P
**Files:**
- Create: `docs/marketing/trade-association-outreach.md`

- [ ] **Step 1: Identify board members + executive directors**

NH Home Builders Association: https://www.nhhba.com/
ME Home Builders & Remodelers: https://www.mehba.com/

Find ED + board chair. Add to outreach tracker.

- [ ] **Step 2: Send custom pitch — "free Founding Pro for any member"**

Offer: any NHHBA/MEHBA member who joins as Founding Pro gets the 5% lifetime rate AND the association gets co-branded marketing. Ask for: featured in member newsletter, table at next member meeting, intro to top 10 active members.

- [ ] **Step 3: Track responses + close partnerships**

```bash
git add docs/marketing/trade-association-outreach.md
git commit -m "docs(marketing): NHHBA + MEHBA partnership pitch and outreach tracker"
```

---

## Workstream E — Fundraising: Non-Dilutive (Weeks 2–10)

**Goal:** Submit 6+ grant applications. Target: $525K confirmed stack + $1.18M in pipeline.

### Task E1: MassCEC InnovateMass application (up to $350K)

**Owner:** P + CONTENT
**Files:**
- Create: `docs/fundraising/grants/masscec-innovatemass-app.md`

- [ ] **Step 1: Confirm next application round**

Open https://www.masscec.com/program/innovatemass. March 2026 round was March 9 deadline. Next round typically September. Confirm exact dates.

- [ ] **Step 2: Prepare required documents**

Per program: project narrative (≤8 pages), budget (≤$350K matching grant), MA-deployment plan, technology demonstration plan, milestones, team bios.

Frame: "Sherpa Pros + Wiseman accelerates Mass Save heat-pump installation throughput by matching homeowners to certified installers, validating quotes against MA Electrical Code, and surfacing rebate eligibility — addressing the documented MA installer-supply bottleneck."

- [ ] **Step 3: Submit + record confirmation**

```bash
git add docs/fundraising/grants/masscec-innovatemass-app.md
git commit -m "docs(fundraising): MassCEC InnovateMass application submitted"
```

---

### Task E2: MassCEC Catalyst application (up to $75K)

**Owner:** P + CONTENT
**Files:**
- Create: `docs/fundraising/grants/masscec-catalyst-app.md`

- [ ] **Step 1: Confirm fall 2026 round dates**

https://www.masscec.com/program/catalyst-and-dices

Spring 2026 closed March 13. Fall round typically Aug–Oct.

- [ ] **Step 2: Prepare prototype demo brief**

Per program: prototype demonstration grant for ≤4 FTE MA-based climatetech early-stage. Sherpa Pros qualifies (≤4 FTE). Frame: Wiseman matching engine + Mass Save lane prototype.

- [ ] **Step 3: Submit + commit**

```bash
git add docs/fundraising/grants/masscec-catalyst-app.md
git commit -m "docs(fundraising): MassCEC Catalyst application submitted"
```

---

### Task E3: MassDev Biz-M-Power application (up to $50K crowdfund match)

**Owner:** P
**Files:**
- Create: `docs/fundraising/grants/massdev-biz-m-power-app.md`

- [ ] **Step 1: Verify eligibility + match formula**

https://www.massdevelopment.com/products-and-services/funding-and-tools/grant-programs/

Confirm: Sherpa Pros LLC must be MA-registered or operating in MA (Boston deployment qualifies). Match $1-for-$1 up to $50K of Wefunder raised.

- [ ] **Step 2: Submit application**

Run in parallel with Wefunder pre-launch (Workstream H). Application typically requires: business plan, crowdfund campaign URL, projected raise, MA jobs created.

- [ ] **Step 3: Commit**

```bash
git add docs/fundraising/grants/massdev-biz-m-power-app.md
git commit -m "docs(fundraising): MassDev Biz-M-Power crowdfund-match application submitted"
```

---

### Task E4: NSF SBIR Phase I application (up to $305K)

**Owner:** P + CONTENT
**Files:**
- Create: `docs/fundraising/grants/nsf-sbir-phase-i-app.md`

- [ ] **Step 1: Submit Project Pitch**

NSF SBIR has a free Project Pitch step before full proposal. https://seedfund.nsf.gov/. Frame: Wiseman as AI/ML research commercialization — building code intelligence + matching algorithms for residential construction.

Wait for invitation to submit full proposal (~3 weeks).

- [ ] **Step 2: Full proposal if invited**

If invited: 15-page proposal, technical R&D plan, commercialization plan, budget. Engage NSF SBIR consultant if needed (~$5K, often worth it for first-time applicants).

- [ ] **Step 3: Commit submission record**

```bash
git add docs/fundraising/grants/nsf-sbir-phase-i-app.md
git commit -m "docs(fundraising): NSF SBIR Phase I Project Pitch submitted"
```

---

### Task E5: MA SBTA via nonprofit partner (up to $150K)

**Owner:** P
**Files:**
- Create: `docs/fundraising/grants/ma-sbta-app.md`

- [ ] **Step 1: Identify SBTA nonprofit partner**

https://www.empoweringsmallbusiness.org/sbta — list of 73 funded nonprofits providing technical assistance. Find Boston-area or NH-MA-region SBTA grantee that supports tech startups (e.g., CommonWealth Kitchen, EforAll Boston, Black Economic Council MA).

- [ ] **Step 2: Apply through partner**

Sherpa Pros applies to the nonprofit partner for SBTA-funded technical assistance. Partner provides services (legal, accounting, marketing) up to grant cap.

- [ ] **Step 3: Commit**

```bash
git add docs/fundraising/grants/ma-sbta-app.md
git commit -m "docs(fundraising): MA SBTA partner identified + application initiated"
```

---

### Task E6: NH Innovation Voucher + NH BFA microloan

**Owner:** P
**Files:**
- Create: `docs/fundraising/grants/nh-bfa-app.md`

- [ ] **Step 1: NH Innovation Voucher application**

https://www.nheconomy.com/working-here/innovation-research/innovation-research-and-development-voucher-program — up to $15K matching grant for innovative R&D.

- [ ] **Step 2: NH BFA microloan inquiry**

NH Business Finance Authority — small-business loan up to $25K. Cheap capital if VC route slow.

- [ ] **Step 3: Commit**

```bash
git add docs/fundraising/grants/nh-bfa-app.md
git commit -m "docs(fundraising): NH Innovation Voucher + NH BFA applications submitted"
```

---

## Workstream F — Fundraising: Accelerators (Weeks 3–8)

**Goal:** Apply to 5 high-fit accelerators. Target: 1+ acceptance.

### Task F1: Suffolk Technologies application

**Owner:** P
**Files:**
- Create: `docs/fundraising/accelerators/suffolk-technologies-app.md`

- [ ] **Step 1: Apply**

https://www.suffolktechnologies.com/. Boston-based, Built Environment, 8-week accelerator + VC arm. Target #1 fit.

Application typically: company overview, problem/solution, traction, team, ask. Submit with deck v1 + demo video.

- [ ] **Step 2: Commit**

```bash
git add docs/fundraising/accelerators/suffolk-technologies-app.md
git commit -m "docs(fundraising): Suffolk Technologies accelerator application"
```

---

### Task F2: Techstars ConstructionTech application

**Owner:** P
**Files:**
- Create: `docs/fundraising/accelerators/techstars-constructiontech-app.md`

- [ ] **Step 1: Apply**

https://www.techstars.com/accelerators — find ConstructionTech vertical. $220K @ 5%. Application is rolling for some cohorts.

- [ ] **Step 2: Commit**

```bash
git add docs/fundraising/accelerators/techstars-constructiontech-app.md
git commit -m "docs(fundraising): Techstars ConstructionTech application"
```

---

### Task F3: MassChallenge application (zero-equity, up to $1M cash prize)

**Owner:** P
**Files:**
- Create: `docs/fundraising/accelerators/masschallenge-app.md`

- [ ] **Step 1: Apply**

https://masschallenge.org/programs. Boston-based, zero equity, no-brainer for any MA-deploying startup.

- [ ] **Step 2: Commit**

```bash
git add docs/fundraising/accelerators/masschallenge-app.md
git commit -m "docs(fundraising): MassChallenge application (zero equity)"
```

---

### Task F4: Y Combinator application (rolling)

**Owner:** P
**Files:**
- Create: `docs/fundraising/accelerators/yc-app.md`

- [ ] **Step 1: Apply via YC application form**

https://www.ycombinator.com/apply. $500K @ 7%. Cheap to apply, high signal value if accepted.

YC's questions are short — focus on founder story, problem, traction. Phyrom-as-working-GC is the differentiator vs. typical YC marketplace founders.

- [ ] **Step 2: Commit**

```bash
git add docs/fundraising/accelerators/yc-app.md
git commit -m "docs(fundraising): Y Combinator application (rolling)"
```

---

### Task F5: Greentown Labs membership inquiry

**Owner:** P
**Files:**
- Create: `docs/fundraising/accelerators/greentown-labs-inquiry.md`

- [ ] **Step 1: Inquire about membership**

https://greentownlabs.com/membership/. Somerville climate-tech incubator. Membership-based (not equity). Mass Save lane fits.

- [ ] **Step 2: Commit**

```bash
git add docs/fundraising/accelerators/greentown-labs-inquiry.md
git commit -m "docs(fundraising): Greentown Labs membership inquiry"
```

---

## Workstream G — Fundraising: VC Pipeline (Weeks 2–12)

**Goal:** 50-firm investor pipeline, 5+ active conversations, 1+ term sheet by W12.

### Task G1: Build 50-firm investor list

**Owner:** P + SDR
**Files:**
- Create: `docs/fundraising/vc/investor-pipeline.md`

- [ ] **Step 1: Compile from spec §6.3 + supplementary research**

Pipeline schema: Firm, Stage, Sector fit, Lead partner, Connection (cold/warm), Status, Last touch, Notes.

Tier 1 (Built World): Building Ventures, Brick & Mortar Ventures, Foundamental, Zacua Ventures, Schematic Ventures, Nine Four Ventures.

Tier 2 (Marketplace): NFX, Version One, Hustle Fund, Pear VC, Forum Ventures, Precursor.

Tier 3 (CVC): Eversource Ventures, National Grid Partners, Home Depot Ventures, Lowe's Ventures, Travelers Ventures.

Tier 0 (NE Angels): HJD network HNW (Phyrom names), NHHBA/MEHBA board, Boston angels via AngelList.

SDR enriches each row with partner name, LinkedIn, recent investments, warm-intro path.

- [ ] **Step 2: Commit**

```bash
git add docs/fundraising/vc/investor-pipeline.md
git commit -m "docs(fundraising): 50-firm VC investor pipeline"
```

---

### Task G2: Building Ventures warm intro request (FIRST CALL)

**Owner:** P
**Files:**
- Modify: `docs/fundraising/vc/investor-pipeline.md`

- [ ] **Step 1: Identify warm-intro path to Building Ventures**

Building Ventures partners: research who has connections to Phyrom's HJD network, NHHBA, Suffolk Construction (Suffolk Tech parent — possible bridge).

If no warm path: cold email Building Ventures via partner email + LinkedIn DM. Subject: "NH GC built a marketplace investors keep saying doesn't exist."

- [ ] **Step 2: Send the email + book the meeting**

- [ ] **Step 3: Update pipeline + commit**

---

### Task G3: First 5 VC meetings (Weeks 5–6)

**Owner:** P
**Files:**
- Modify: `docs/fundraising/vc/investor-pipeline.md` (notes per meeting)

- [ ] **Step 1: Book 5 meetings via warm intros + cold from pipeline**

Targets: Building Ventures, Brick & Mortar, Foundamental, NFX, one CVC (Eversource preferred).

- [ ] **Step 2: Run meetings — 30 min each, deck-led**

Bring deck v1 + live demo. Capture meeting notes + asks per investor.

- [ ] **Step 3: Send follow-up within 24hr** with requested materials.

- [ ] **Step 4: Update pipeline + commit weekly**

---

### Task G4: Tier-1 + Tier-2 outreach batch (Weeks 7–10)

**Owner:** P + SDR
**Files:**
- Modify: `docs/fundraising/vc/investor-pipeline.md`

- [ ] **Step 1: SDR sends warm-intro requests to remaining Tier-1/2 firms**

Use Phyrom's network + LinkedIn first-degree. Soften with "founder is a working GC" hook.

- [ ] **Step 2: P runs 10–15 meetings over 4 weeks**

Target conversion: 1–2 term sheet conversations.

- [ ] **Step 3: Update pipeline + commit weekly**

---

### Task G5: Strategic CVC outreach — Eversource Ventures, National Grid Partners

**Owner:** P
**Files:**
- Create: `docs/fundraising/vc/cvc-outreach.md`

- [ ] **Step 1: Customize pitch for utility CVCs**

Lead with: "Mass Save heat-pump installer wait times are 3–6 months. We solve that. We can become your installer-acceleration layer."

- [ ] **Step 2: Cold email + LinkedIn outreach**

Eversource Ventures: identify investing partner. Same for National Grid Partners.

- [ ] **Step 3: Commit**

```bash
git add docs/fundraising/vc/cvc-outreach.md
git commit -m "docs(fundraising): utility CVC outreach to Eversource + National Grid Partners"
```

---

## Workstream H — Wefunder Community Round (Weeks 1–12)

**Goal:** $250K+ Wefunder raised by W12, $50K MassDev match secured.

### Task H1: Wefunder researcher + FAQ

**Owner:** P + CONTENT
**Files:**
- Create: `docs/fundraising/wefunder/faq.md`

- [ ] **Step 1: Read Wefunder docs**

https://wefunder.com/start. Understand SAFE structure, 7.5% platform fee, Reg CF $5M cap, KYC/AML requirements.

- [ ] **Step 2: Draft FAQ for community investors**

Q&A: who can invest, minimum check, SAFE explanation, timeline, what happens if you fail to close, conversion to equity event.

- [ ] **Step 3: Commit**

```bash
git add docs/fundraising/wefunder/faq.md
git commit -m "docs(fundraising): Wefunder community-round FAQ"
```

---

### Task H2: Wefunder page builder + SAFE legal review

**Owner:** P + CONTENT + attorney
**Files:**
- Create: `docs/fundraising/wefunder/page-content.md`

- [ ] **Step 1: Draft Wefunder page content**

Sections: Hero (founder hook), Problem, Solution, Traction (beta cohort numbers), Team, Use of funds, Q&A. Reuse pitch deck content.

- [ ] **Step 2: SAFE template review by attorney**

Wefunder provides SAFE templates. Attorney (~$1K, 2hr review) confirms valuation cap, discount, MFN clauses, conversion mechanics.

- [ ] **Step 3: Build the page in Wefunder admin**

Upload videos, photos, content. Submit to Wefunder for compliance review (typically 5–10 business days).

- [ ] **Step 4: Commit page content**

```bash
git add docs/fundraising/wefunder/page-content.md
git commit -m "docs(fundraising): Wefunder page content + SAFE legal review"
```

---

### Task H3: Pre-launch list build (100+ interested)

**Owner:** P + SDR
**Files:**
- Create: `docs/fundraising/wefunder/prelaunch-list.md`

- [ ] **Step 1: Outreach to HJD client network**

HJD has [N] active clients. SDR sends personal note from Phyrom: "Building something new — would mean a lot if you'd be among the first to look at it. No commitment yet."

- [ ] **Step 2: Outreach to beta pros + their clients**

Pros may forward to their own clients. Permissioned only.

- [ ] **Step 3: Outreach to local press readers**

Seacoast Online, NHPR, NHBR — invite editors to soft-launch preview.

- [ ] **Step 4: Track pre-launch sign-ups + commit weekly**

```bash
git add docs/fundraising/wefunder/prelaunch-list.md
git commit -m "docs(fundraising): Wefunder pre-launch list update W<N>"
```

---

### Task H4: Soft-launch (signal-gather, no public)

**Owner:** P
**Files:** None (operational)

- [ ] **Step 1: Activate Wefunder page in private mode**

Share link only with pre-launch list. Goal: $100K+ soft-committed before public launch.

- [ ] **Step 2: Track conversion rate from list-to-commit**

If <10% of list converts, revisit page content + run feedback survey.

---

### Task H5: Public launch + PR push (Weeks 7–8)

**Owner:** P + CONTENT
**Files:**
- Create: `docs/fundraising/wefunder/pr-launch-plan.md`

- [ ] **Step 1: Activate public Wefunder page**

When $100K+ soft-committed, flip to public. Wefunder badges $100K+ committed automatically.

- [ ] **Step 2: PR push**

Press releases to: Seacoast Online, NHPR, NH Business Review, Boston Globe Real Estate, Banker & Tradesman, NHBR.

Phyrom does podcast interviews — NH Business Review podcast, The Contractor Fight, JLC Live podcast.

- [ ] **Step 3: Commit launch plan**

```bash
git add docs/fundraising/wefunder/pr-launch-plan.md
git commit -m "docs(fundraising): Wefunder public launch + PR plan"
```

---

### Task H6: Drive to $250K+ committed by W12

**Owner:** P
**Files:** None (operational)

- [ ] **Step 1: Daily LinkedIn cadence highlighting raise progress**

- [ ] **Step 2: Weekly investor update emails to commit-watchers**

- [ ] **Step 3: Close Reg CF campaign at W12 (90-day max)**

Convert pledges to wires. If short of $250K, extend if Wefunder permits, or close with what's raised.

---

## Workstream I — Mass Save & Strategic Partnerships (Weeks 3–12)

**Goal:** Submit Mass Save Network application, National Grid Turnkey inquiry, NHHBA/MEHBA partnerships (overlap with D5).

### Task I1: Mass Save Heat Pump Installer Network application

**Owner:** P
**Files:**
- Create: `docs/partnerships/mass-save-application.md`

- [ ] **Step 1: Apply for Sherpa Pros to be a Mass Save Network platform**

https://www.masssave.com/residential/find-a-contractor/find-a-heat-pump-installer

Mass Save typically lists individual contractors, not platforms. Frame: Sherpa Pros is the *platform that connects homeowners to Mass Save Network installers* — request listing as "find a Mass Save installer through Sherpa Pros."

- [ ] **Step 2: Verify our beta heat-pump pro is Mass Save certified**

Beta cohort includes 1 HVAC / heat-pump specialist. Confirm their Mass Save Network status. Sherpa Pros leverages their cert for the partnership pitch.

- [ ] **Step 3: Commit**

```bash
git add docs/partnerships/mass-save-application.md
git commit -m "docs(partnerships): Mass Save Heat Pump Installer Network application"
```

---

### Task I2: National Grid Turnkey EV Charging program

**Owner:** P
**Files:**
- Create: `docs/partnerships/national-grid-turnkey.md`

- [ ] **Step 1: Inquire about partnership**

https://www.nationalgridus.com/electric-vehicle-hub/Programs/Massachusetts/Turnkey-EV-Charging-Installation-Program

Frame: Sherpa Pros provides the homeowner-facing UX + installer matching. National Grid provides the rebate + utility coordination.

- [ ] **Step 2: Commit**

```bash
git add docs/partnerships/national-grid-turnkey.md
git commit -m "docs(partnerships): National Grid Turnkey EV charging program inquiry"
```

---

## Weekly Operating Cadence

Every Monday, P runs a 60-min review:

- [ ] **Beta cohort:** active count, jobs in pipeline, GMV WoW, NPS, friction log
- [ ] **Fundraise pipeline:** new conversations, advancing conversations, decisions due, dollar-weighted close-probability total
- [ ] **Workstream blockers:** anything not on track gets a re-plan
- [ ] **Risk register:** any R1–R10 signals tripped this week (per spec §10)
- [ ] **Update tasks:** TaskUpdate / TaskCreate for newly-discovered work

Commit a weekly snapshot to `docs/operations/weekly-status/2026-WW-NN.md`.

---

## Phase 0 Exit Criteria (per spec §12)

**Phase 1 triggers when ANY ONE of:**

- [ ] $250K+ non-dilutive committed (any combination of: MassCEC InnovateMass + Catalyst + MassDev + NSF SBIR + NH BFA), OR
- [ ] $500K+ Wefunder + angel soft-circled, OR
- [ ] Tier-1 accelerator acceptance (YC / Techstars ConstructionTech / Suffolk Technologies / Building Ventures Studio)

**On trigger:**
- [ ] Open new spec + plan: `docs/superpowers/specs/<date>-phase-1-lean-launch-design.md` and corresponding plan file
- [ ] Begin Phase 1 hires (PSM NH/ME, PT Client Concierge)
- [ ] Convert beta cohort to founding paying customers (5% take grandfathered forever)
- [ ] Public launch in Northern Triangle + Boston specialty
