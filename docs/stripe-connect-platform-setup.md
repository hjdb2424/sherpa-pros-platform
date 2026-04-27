# Stripe Connect Platform Setup — Step-by-Step

**Purpose:** One-time activation of your Stripe Connect platform so Sherpa Pros can create real connected accounts for pros and route payments through them. This runbook is asynchronous from the code work — start it in parallel.

**Owner:** Phyrom
**Estimated time:** 30-45 min of your work + 1-3 days of Stripe's review

---

## Phase 1 — Test mode setup (do today, unblocks development)

You can wire and test the entire onboarding flow against Stripe's test environment without any platform activation. Stripe gives you test keys out of the box.

### Step 1.1 — Get your test secret key

1. Go to https://dashboard.stripe.com/test/apikeys
2. Under "Standard keys," click "Reveal test key" next to "Secret key"
3. Copy the value (starts with `sk_test_`)

### Step 1.2 — Add to local development

Edit `~/sherpa-pros-platform/.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...   # from step 1.1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   # from same dashboard page, "Publishable key"
```

### Step 1.3 — Add to Vercel preview environment

1. Go to https://vercel.com/dashboard → sherpa-pros-platform → Settings → Environment Variables
2. Add `STRIPE_SECRET_KEY` = `sk_test_...` for **Preview** environment only (NOT Production yet)
3. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...` for **Preview**

This keeps prod safe while preview deploys exercise the real flow.

### Step 1.4 — Webhook test forwarding (for local dev)

Install the Stripe CLI if you haven't:
```bash
brew install stripe/stripe-cli/stripe
stripe login
```

Then in a terminal while developing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

It prints a `whsec_...` value — your test webhook signing secret. Add to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

Now Stripe events from test transactions get forwarded to your local server with valid signatures.

---

## Phase 2 — Platform activation (do in parallel, blocks live mode)

This is the activation flow at the URL you showed me. It enables your account to issue connected accounts in live mode.

### Step 2.1 — Navigate to Connect onboarding

Go to https://dashboard.stripe.com/connect/onboarding (you may need to switch from test to live mode using the toggle in the upper-right of the dashboard).

### Step 2.2 — Choose platform type

Select **"Standard"** (matches our spec). NOT "Express" or "Custom."

Reasoning: Standard means pros own their Stripe dashboards, manage their own data, pull funds out themselves. Cleanest liability separation for your business and most flexible for the pros.

### Step 2.3 — Business information

Fill in:
- **Legal business name:** the legal entity that runs Sherpa Pros (likely "North Forge Construction Group" or whatever the parent entity is — confirm with your accountant)
- **Business address:** the legal entity's registered address
- **EIN or SSN:** business tax ID
- **Business website:** `https://sherpa-pros-platform.vercel.app` (or your custom domain when set)
- **Industry:** "Software" or "Marketplaces"
- **Description of what your platform does:** one sentence — e.g., "On-demand marketplace connecting clients with verified contractors for trade work."

### Step 2.4 — Connect-specific branding

This is what pros see during their onboarding flow:
- **Platform name:** "Sherpa Pros" (this is the brand pros see, separate from your legal business name)
- **Platform logo:** upload the SP logo (you have this in the repo at `public/icons/`)
- **Brand color:** `#1a1a2e` (your dark navy, per CLAUDE.md)
- **Support URL or email:** support inbox or page (confirm what exists)
- **Privacy policy URL:** required by Stripe — needed publicly accessible
- **Terms of service URL:** required — needed publicly accessible

⚠️ **Privacy policy + ToS are blockers.** If you don't have them yet, this is the thing that will hold up activation. If they exist on your marketing site already (`/privacy`, `/terms`), use those URLs. If not, you need to draft them — generic templates exist at termly.io or you can have legal review.

### Step 2.5 — Connect platform agreement

Stripe shows the platform agreement. Read it (genuinely — it's the contract for marketplace operations). Accept.

### Step 2.6 — Submit for review

Click "Submit for review."

Stripe's review:
- **Best case:** auto-approved within an hour (clean info, established entity)
- **Typical:** 1-2 business days (manual review if anything looks new or unusual)
- **Worst case:** 3-7 days if Stripe asks for clarification (corporate structure, anti-money-laundering questions)

You'll get email at the address on the account when reviewed.

### Step 2.7 — While you wait

Nothing is blocked. The code work continues against test mode.

---

## Phase 3 — Live mode cutover (do after Stripe approval)

When Stripe emails you that the platform is approved:

### Step 3.1 — Get live keys

1. Toggle dashboard to **Live mode** (top-right)
2. Go to https://dashboard.stripe.com/apikeys
3. Reveal the live secret key (starts with `sk_live_`)

### Step 3.2 — Add live keys to Vercel production env

1. Vercel dashboard → sherpa-pros-platform → Settings → Environment Variables
2. Add `STRIPE_SECRET_KEY` = `sk_live_...` for **Production** environment only
3. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` for **Production**

### Step 3.3 — Configure live webhook endpoint

1. Go to https://dashboard.stripe.com/webhooks (live mode)
2. Click "Add endpoint"
3. **Endpoint URL:** `https://sherpa-pros-platform.vercel.app/api/stripe/webhook` (or your custom prod domain)
4. **Events to send:**
   - For Plan 1: `account.updated`
   - For Plan 2 (when shipped): also `payment_intent.succeeded`, `transfer.created`, `charge.dispute.created`, `payout.failed`
5. Click "Add endpoint"
6. On the new endpoint's page, copy the "Signing secret" (`whsec_...`)
7. Add to Vercel prod env: `STRIPE_WEBHOOK_SECRET` = `whsec_...`

### Step 3.4 — Trigger a redeploy

Vercel doesn't auto-redeploy on env var changes. Either:
- Push any commit to `main`, or
- Vercel dashboard → Deployments → most recent → "Redeploy"

### Step 3.5 — Smoke test with real account

1. Create a test pro signup against the production app
2. Click "Get verified to start earning"
3. Complete onboarding with REAL identity + bank info (this is your account, not a customer's)
4. Verify the dashboard banner flips to "Verified ✓" within ~30 seconds (webhook latency)
5. Check `users` table — `stripe_account_id` should be a real `acct_*` (not `acct_*_test_*`), `stripe_account_status` should be `active`

### Step 3.6 — You're live

Now invite real beta pros. They'll create real connected accounts. Plan 2 will let actual money flow through them.

---

## Reference: env var summary

| Variable | Scope | Local (`.env.local`) | Vercel Preview | Vercel Production |
|---|---|---|---|---|
| `STRIPE_SECRET_KEY` | Server only | `sk_test_...` | `sk_test_...` | `sk_live_...` (after Phase 3) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | **Client + Server** (Next.js exposes `NEXT_PUBLIC_*` to browser) | `pk_test_...` | `pk_test_...` | `pk_live_...` (after Phase 3) |
| `STRIPE_WEBHOOK_SECRET` | Server only | from `stripe listen` output | from Vercel preview webhook | from prod webhook (Step 3.3) |

## Common gotchas

- **Test connected accounts are throwaway.** Pros who onboard in test mode have to re-onboard in live mode. Don't invite real beta pros until live keys are deployed.
- **Live mode webhook signing secret is different from test.** Each webhook endpoint gets its own `whsec_*`. Don't copy the test one to prod.
- **Privacy policy / ToS are commonly the activation blocker.** If you don't have them, get them written and hosted before submitting in Step 2.6. Otherwise Stripe's review will reject and re-queue you.
- **Don't share `sk_live_*` anywhere.** It's the equivalent of a bank account password. Never paste it in chat, code, screenshots, or git history.
