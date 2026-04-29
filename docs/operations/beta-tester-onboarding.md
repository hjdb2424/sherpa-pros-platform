# Sherpa Pros — Beta Tester Onboarding

Copy-paste-ready onboarding text for emailing/Slacking/DMing testers outside the system.
The same content lives at `https://thesherpapros.com/install` if you'd rather just send a link.

---

## Short version (Slack / SMS / DM)

> Hey [Name] — you're in the Sherpa Pros beta. Two ways to use it:
>
> **Web (any device):** thesherpapros.com/sign-in
> **iPhone app:** thesherpapros.com/install (TestFlight setup walks you through it)
> **Android:** use the web app for now — install it to your home screen via Chrome menu → Install
>
> Sign in with this exact email — it's already on the access list. Reply if you hit anything weird.

---

## Long version (email or Notion)

**Subject:** You're in — Sherpa Pros beta access

Hi [Name],

Thanks for agreeing to test Sherpa Pros. You're one of ~24 people we're inviting in this first round, so your feedback actually shapes what ships.

### Where to use it

You have **three options** — pick whichever you prefer. They all read/write the same data, so you can mix and match.

**1. Web (works everywhere, zero install):**
Visit https://thesherpapros.com/sign-in and sign in with this email. Works on iPhone, Android, laptop — anything with a browser.

**2. iPhone app (recommended for Pros):**
Apple's TestFlight is the official way to install beta apps on iPhone. It's free and lives next to your other apps.
- Install TestFlight from the App Store: https://apps.apple.com/us/app/testflight/id899247664
- Then visit our walkthrough: https://thesherpapros.com/install
- It will show you our TestFlight invite link + step-by-step screenshots

**3. Android (web app for now):**
A native Android app is coming. For now, the web app installs to your home screen with full-screen icon + push notifications. Open https://thesherpapros.com in Chrome → menu (⋮) → "Install app".

### What you'll see when you sign in

The app picks your role on first launch — choose **Pro**, **Client**, or **Property Manager**. You can switch later if you wear multiple hats.

**As a Pro you'll see:**
- A live job feed (jobs near you)
- Map dispatch with GPS routing
- Masked chat with clients (your real number stays private)
- Stripe-deposited payouts (1–2 business days)

**As a Client:**
- One-screen job posting (Sherpa Materials suggests parts automatically)
- Smart matching — verified pros bid on your job
- Materials + same-day delivery (where available)
- Two-way ratings

**As a Property Manager:**
- Property dashboard (filter work orders by site)
- Recurring work-order templates
- Per-property budgets, QuickBooks export
- Trade reports (which trades cost you the most)

### What we want from you

1. **Use it like you'd use any other app** — post a real job, accept a real bid, see what breaks.
2. **Tell us when something's confusing or wrong** — reply to this email, or hit the feedback button in-app.
3. **Don't share your invite link** — the access list is closed during this round.

### Common issues

- **"I can't sign in":** make sure you're using the exact email this invite went to. Different email = won't work yet.
- **"I'm on Android, where's the app?":** install the web app (Chrome → menu → Install). Native Android coming soon.
- **"TestFlight says the build is expired":** Apple expires beta builds after 90 days. Open TestFlight, tap Update.

### Help

Reply to this email, or write to info@thesherpapros.com. We're a small team — you'll usually hear back the same day.

Welcome aboard.

— Phyrom & the Sherpa Pros team

---

## Notes for Phyrom (internal — don't send)

- TestFlight public link is **wired live**: `https://testflight.apple.com/join/92511Beu` (hardcoded as the fallback in `src/app/install/page.tsx`). Override via `NEXT_PUBLIC_TESTFLIGHT_URL` env var in Vercel if you ever need to swap (e.g. for a private/internal-testing-only link).
- The `Install the app →` button in the Resend HTML email points at `/install`. The plain-text fallback (clipboard mode if Resend isn't configured) also includes the `/install` URL.
- 24 testers seeded in `access_list`; see `/admin/access-list` for the live editable list. Click `Email` on any row to fire the invite (Resend if `RESEND_API_KEY` is set, otherwise copies to clipboard for manual paste).
- When you push fresh TestFlight builds, the existing `/install` link doesn't change — testers just open TestFlight and tap Update.
