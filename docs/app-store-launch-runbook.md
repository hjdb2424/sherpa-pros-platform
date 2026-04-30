# Sherpa Pros iOS — App Store Launch & Maintenance Runbook

**Owner:** Phyrom (poum@hjd.builders)
**App:** Sherpa Pros (`com.thesherpapros.app`)
**Apple Team ID:** `VKU3W26WK7`
**App Store Connect App ID:** `6763805815`
**EAS Project ID:** `aeeb92fa-2d32-4259-a800-f2e2fe2048a7`
**Mobile dir:** `/Users/poum/sherpa-pros-platform/mobile/`
**Submit profile (already wired in `mobile/eas.json`):** `production` → Apple ID `phyrom24@gmail.com`

---

## Table of Contents

1. [Section 1 — Immediate path: TestFlight build today](#section-1--immediate-path-testflight-build-today)
2. [Section 2 — Path to App Store live (next 2–4 weeks)](#section-2--path-to-app-store-live-next-24-weeks)
3. [Section 3 — Ongoing 60-day rotation (keep TestFlight alive)](#section-3--ongoing-60-day-rotation-keep-testflight-alive)
4. [Section 4 — Version-bump strategy](#section-4--version-bump-strategy)
5. [Section 5 — Common pitfalls + fixes](#section-5--common-pitfalls--fixes)
6. [Section 6 — Decision matrix](#section-6--decision-matrix)
7. [Appendix A — Required secrets cheat-sheet](#appendix-a--required-secrets-cheat-sheet)
8. [Appendix B — One-page TL;DR](#appendix-b--one-page-tldr)

---

## Section 1 — Immediate path: TestFlight build today

Goal: go from "no build in TestFlight" to "build live for external testers" within ~24–48 h.

### 1.1 Pre-flight checklist (do these before anything else)

Confirm each item; if any fails, stop and resolve before running the build.

- [ ] **Apple Developer Program membership** is active (https://developer.apple.com/account → Membership; check expiry). $99/yr.
- [ ] **App Store Connect access** for `phyrom24@gmail.com` confirmed (https://appstoreconnect.apple.com). Confirm the app `Sherpa Pros` (App ID `6763805815`) is visible.
- [ ] **Apple ID app-specific password** generated for EAS Submit
  (https://account.apple.com → Sign-In and Security → App-Specific Passwords → "Generate Password" → label it `eas-submit`). Save in 1Password.
  *Alternative (preferred long-term)*: an App Store Connect API key (see [Appendix A](#appendix-a--required-secrets-cheat-sheet)).
- [ ] **Expo account** active (`phyrom24@gmail.com` or wherever the EAS project lives). Confirm at https://expo.dev.
- [ ] **Working tree clean** in `/Users/poum/sherpa-pros-platform/mobile/`:
      ```bash
      cd /Users/poum/sherpa-pros-platform/mobile && git status
      ```
      Commit or stash anything in flight before kicking off a remote build.
- [ ] **Node + npm working** — Node ≥ 20.x recommended:
      ```bash
      node -v && npm -v
      ```
- [ ] **Bundle identifier matches App Store Connect**: `com.thesherpapros.app` (already set in `mobile/app.json`).

### 1.2 Login to EAS

```bash
cd /Users/poum/sherpa-pros-platform/mobile
npx eas-cli@latest login
npx eas-cli@latest whoami     # confirm the logged-in account
```

If the project isn't yet linked locally:

```bash
npx eas-cli@latest init --id aeeb92fa-2d32-4259-a800-f2e2fe2048a7
```

### 1.3 Configure iOS credentials (let EAS manage)

```bash
cd /Users/poum/sherpa-pros-platform/mobile
npx eas-cli@latest credentials --platform ios
```

When prompted:

- Profile: **production**
- "What do you want to do?" → **Set up a new Distribution Certificate / Provisioning Profile** (or "Use existing" if EAS already has them).
- Sign in with the Apple ID `phyrom24@gmail.com` when EAS prompts. If 2FA is on, paste the SMS/Authenticator code.
- Let EAS auto-generate the **Distribution Certificate** and **Provisioning Profile**. Choose "Yes" when EAS asks to manage them on your behalf — this is the supported path and avoids manual cert juggling.
- Confirm Push Notification key creation is **skipped for now** (we are not using APNs in v1; can be added later).

Verify:

```bash
npx eas-cli@latest credentials --platform ios   # then choose 'View credentials'
```

You should see a Distribution Certificate and a Provisioning Profile bound to `com.thesherpapros.app`.

### 1.4 Build the .ipa on EAS cloud

```bash
cd /Users/poum/sherpa-pros-platform/mobile
npx eas-cli@latest build --platform ios --profile production
```

Notes:

- This runs in Expo's cloud (~15–20 min). The CLI prints a build URL like `https://expo.dev/accounts/.../builds/<id>`. Watch progress there or in the terminal.
- Because `mobile/eas.json` has `"appVersionSource": "remote"` and `"autoIncrement": true` for the production iOS profile, EAS will automatically bump `ios.buildNumber`. The user-visible `expo.version` (`1.0.0`) stays the same unless you change it.
- If the build errors out with a credentials issue, re-run `eas credentials` and fix; otherwise re-run `eas build`.

When the build finishes, EAS gives you the .ipa URL. Do **not** download it manually — `eas submit` will pick it up directly.

### 1.5 Submit to App Store Connect

```bash
cd /Users/poum/sherpa-pros-platform/mobile
npx eas-cli@latest submit --platform ios --profile production --latest
```

`--latest` tells EAS to submit the most recent successful production build. EAS reads `submit.production.ios` from `mobile/eas.json` (already wired). It will prompt for the **app-specific password** the first time; subsequent submits cache the credential.

Expected: ~5 min for the upload + Apple processing handoff. The CLI exits when Apple has accepted the binary (status `Submitted`).

### 1.6 Configure TestFlight in App Store Connect

Once `eas submit` succeeds:

1. Open https://appstoreconnect.apple.com → **My Apps** → **Sherpa Pros** → **TestFlight** tab.
2. Wait ~10–30 min for Apple to finish processing the binary. The build will appear under **iOS Builds** with status "Processing", then move to "Ready to Submit" or "Missing Compliance".
3. **Export Compliance**: click the build, answer the encryption question. (`mobile/app.json` already sets `"ITSAppUsesNonExemptEncryption": false` so this should be auto-answered. If Apple still asks, choose "No, my app does not use encryption.")
4. **Test Information** (left sidebar under TestFlight):
   - Beta App Description (what the testers should know)
   - Email address (`poum@hjd.builders` or `phyrom24@gmail.com`)
   - Privacy Policy URL (must be live and reachable)
   - Marketing URL (optional)
5. **External Testing → Add Group** (or use the existing one tied to the public link, if it already exists):
   - Name: `Beta Testers` (or your existing group)
   - Add the build → click **Save**.
   - Apple will trigger **Beta App Review** automatically once the first build is added to an external group.
6. **Public Link**: in the External Group, toggle **Enable Public Link**. Copy the URL — this is the link that appears in `/install` and the persuasion-rewritten `/invite/{role}` pages. As long as a non-expired build is bound to this group, the link works.

### 1.7 Wait for Beta App Review

- First-time review: **24–48 h typical**, occasionally up to 72 h.
- Subsequent reviews on the same app: usually **<24 h**, sometimes minutes for trivial bumps.
- Watch status under TestFlight → the build → its status row.
- When approved, the build flips to **Ready to Test** and the public link starts handing out the build to anyone who opens it.

### 1.8 Done — what "live" looks like

- Public TestFlight link returns a working install page (testers tap → opens TestFlight app → install).
- The 24+ testers in your access list can install via the link.
- The build is valid for **90 days from upload** — start the 60-day rotation clock (Section 3).

---

## Section 2 — Path to App Store live (next 2–4 weeks)

Phased plan with clear decision points. The default cadence is **Week 1–2 = stabilize via TestFlight, Week 3 = submit to App Store, Week 4 = approval + phased release**.

### Phase 1 — Week 1: TestFlight live, gather feedback

**Goal:** get the build in front of the existing 24+ access-list testers and start collecting bugs.

Tasks:

- Confirm public link delivers the build (test from a clean iPhone with no prior install).
- Send announcement to the access-list cohort (use the per-role founder-voice email templates already drafted in `docs/marketing/`).
- Set up a simple feedback channel — TestFlight's built-in Feedback (testers shake the device) flows directly into App Store Connect → TestFlight → **Feedback**.
- Triage bugs daily; categorize **P0 (blocks usage)** / **P1 (annoying)** / **P2 (polish)**.

Decision point at end of Week 1: Are there P0s? If yes → ship a patch build (Phase 2). If no → start Phase 3 prep in parallel with Week 2 testing.

### Phase 2 — Week 2–3: ship 1–2 patch builds

**Goal:** burn down P0/P1 bugs without breaking flow.

For each patch build:

```bash
# 1. Land fixes on main (or a release branch)
cd /Users/poum/sherpa-pros-platform/mobile
# ... commit fixes ...

# 2. Bump user-visible version if testers should see something changed
#    Edit mobile/app.json: "version": "1.0.1"  (semver patch)
#    Build number is auto-bumped by EAS.

# 3. Build + submit
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios --profile production --latest
```

- Each new build needs a **What to Test** note in App Store Connect → TestFlight → the build → **Test Information** (single sentence per fix is fine).
- Apple **does not** re-review minor patch builds in most cases — typical turnaround on patch builds for an app already in external testing is minutes to a few hours.
- Cap at 2 patch builds in this phase. If you're still finding P0s after 2, defer the App Store submission by a week.

### Phase 3 — Week 3 (or earlier): prepare App Store submission

**Goal:** flip the latest TestFlight-tested build into a submitted App Store version.

Pre-submission gate (every box must be checked):

- [ ] Latest TestFlight build has been live and stable for at least 48 h with no new P0s.
- [ ] **Privacy Policy URL** is live (must be a public, persistent URL — not a localhost preview). Test from a fresh browser.
- [ ] **Support URL** is live and answers basic "how do I get help" questions.
- [ ] **Screenshots** for all required device sizes are uploaded to App Store Connect → App Store tab → 1.0 Prepare for Submission. Required at minimum:
  - 6.9" iPhone (iPhone 16 Pro Max) — REQUIRED
  - 6.5" iPhone (iPhone 11 Pro Max) — REQUIRED
  - 13" iPad Pro — required only if `supportsTablet: true` (it is — see `mobile/app.json`)
- [ ] **App description** (max 4000 chars), **keywords** (max 100 chars, comma-separated), **promotional text** (max 170 chars).
- [ ] **App category** (Primary + optional Secondary). For Sherpa Pros: Primary = **Business**, Secondary = **Productivity**.
- [ ] **Age rating** questionnaire complete.
- [ ] **App Privacy** disclosures (data collection answers) complete.
- [ ] **Sign-in info** for the reviewer if any auth is required (likely yes — Sherpa Pros gates most flows behind login). Provide a test account.
- [ ] **Notes for reviewer** (1–2 paragraphs explaining what the app does and how to test it). Mention there's no IAP, no escrow language anywhere (Stripe history matters here — see CLAUDE.md note `feedback_marketplace_not_escrow.md`).
- [ ] All required content from `docs/app-store-submission.md` (Team B's deliverable) has been transcribed into App Store Connect.

Submission steps:

1. App Store Connect → My Apps → Sherpa Pros → **App Store** tab.
2. Under **iOS App** → click the version row (`1.0 Prepare for Submission` if first release).
3. Under **Build**, click **+ Select a build** and pick the TestFlight-tested build you want to ship.
4. Set release option (see Phase 5).
5. Click **Add for Review** → confirm → **Submit to App Review**.

### Phase 4 — Week 4: Apple App Review

**Expected:** 24–48 h is typical; up to 7 days in rare cases.

Status flow you'll see in App Store Connect:
`Waiting for Review` → `In Review` → (`Approved` | `Rejected` | `Metadata Rejected`).

#### Rejection-recovery mini-runbook

Most-common rejection causes for a v1 marketplace app:

| Reason | Fix |
|---|---|
| **Privacy Policy URL broken or doesn't match the App Privacy disclosures** | Check the URL renders for an unauthenticated user; verify every data-collection claim in App Privacy maps to a section in the policy. |
| **Guideline 5.1.1 — data collection without clear purpose** | Add a one-line explanation next to each Info.plist usage description (we have one for `NSLocationWhenInUseUsageDescription` already; double-check it's user-facing). |
| **Reviewer can't log in / test** | Provide a working test account with seeded data in **Sign-in info**. Confirm the account isn't locked. |
| **Guideline 4.3 — minimum functionality / spam** | Beef up the app description to make the value proposition obvious. Add screenshots that demonstrate workflow, not splash screens. |
| **Mentions "escrow" anywhere** | Hard rule per `feedback_marketplace_not_escrow.md` — search the binary's strings + all metadata for the word; replace with "marketplace settlement" / "payment protection". |
| **Support URL is broken** | Make sure the URL renders a real page with a contact path. |
| **Crashes on launch / black screen for reviewer** | Reproduce on a clean device. Often a missing env var that works locally but not for the reviewer. Ship a fixed build via `eas build` + `eas submit`, then resubmit. |

Workflow on rejection:

1. Read the **Resolution Center** message in App Store Connect carefully.
2. If it's metadata-only: edit the metadata, click **Resubmit**. No new build needed.
3. If it's a binary issue: fix code → bump version (e.g., `1.0.0` → `1.0.1`) → `eas build` → `eas submit` → in App Store Connect, attach the new build to the version → resubmit.
4. Reply to the reviewer in Resolution Center if you need to clarify or push back. Be polite and concise — they read it.
5. Subsequent reviews are usually faster (often <24 h).

### Phase 5 — Week 4+: approved → choose release strategy

When status flips to **Pending Developer Release** or **Pending Apple Release** (depending on the option you set), you've passed review.

Three release options:

| Option | What it does | When to use |
|---|---|---|
| **Manual release** | You click "Release this version" when ready | Coordinated launch, marketing email going out the same day |
| **Automatic release** | Apple releases immediately on approval | You don't want to babysit; release timing doesn't matter |
| **Phased release** (recommended for v1.0.0) | Rolls out to 1% → 100% over 7 days; you can pause/resume | First launch; lets you spot crash spikes before everyone has it |

**Recommendation for Sherpa Pros v1.0.0: Phased Release.** Set it in App Store Connect → the version → **Version Release** → **Phased Release for automatic updates**. Day-1 = 1%, ramps daily, day-7 = 100%. Pause if Sentry/Crashlytics shows a spike.

After release:

- Watch crash dashboards daily for the first 7 days.
- TestFlight continues to work in parallel — same External Group keeps getting future beta builds, while App Store users get released versions. They can coexist forever.

---

## Section 3 — Ongoing 60-day rotation (keep TestFlight alive)

**The constraint:** TestFlight builds expire **90 days after upload**. Once the active build expires, the public link stops handing out installs. To stay continuously live, upload a fresh build at least every **60 days** (gives a 30-day safety buffer).

Two ways to handle this. **Option B (GitHub Actions) is the recommended default** — set it once, forget about it. **Option A** is the fallback if the cron infra isn't ready.

### Option A — Manual cadence (simple, no infra)

Set a recurring calendar reminder.

**Calendar reminder text** (paste into Google Calendar / Apple Calendar / Reclaim, set to repeat every **60 days**):

> **Sherpa Pros TestFlight rotation due**
>
> A new build is needed every 60 days to keep the public TestFlight link working (90-day Apple expiry, 30-day buffer). Run:
>
> ```
> cd ~/sherpa-pros-platform/mobile
> npx eas-cli@latest build --platform ios --profile production
> npx eas-cli@latest submit --platform ios --profile production --latest
> ```
>
> Then App Store Connect → TestFlight → confirm new build attaches to External Group. Beta Review usually <24h on rotation builds.
>
> Runbook: docs/app-store-launch-runbook.md (Section 3)

**Cadence:** every 60 days. First reminder: **60 days from the day you ship the first TestFlight build**.

**Time cost per rotation:** ~10 min hands-on (kicking off the build + checking the External Group) + ~24 h passive wait for review.

### Option B — GitHub Actions automated builds (recommended)

A workflow runs on the 1st of every other month, builds, and submits. You only intervene if the run fails.

**File:** `.github/workflows/eas-build-rotation.yml`

```yaml
name: TestFlight Rotation Build

on:
  schedule:
    # 9am UTC on the 1st of every other month (Jan, Mar, May, Jul, Sep, Nov)
    - cron: '0 9 1 */2 *'
  workflow_dispatch:        # allow manual trigger from GitHub UI

jobs:
  build-and-submit:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: mobile

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: mobile/package-lock.json

      - name: Install deps
        run: npm ci

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build iOS (production)
        run: npx eas-cli@latest build --platform ios --profile production --non-interactive --no-wait
        # --no-wait returns as soon as the build is queued; use --wait if you want to gate submit on build success in the same job

      - name: Wait for build to finish
        run: npx eas-cli@latest build:list --platform ios --status finished --limit 1 --json --non-interactive
        # In practice, prefer to split into two jobs OR use --wait above.
        # Simpler: drop --no-wait above so the build step blocks until success, then submit runs.

      - name: Submit to App Store Connect
        env:
          EXPO_APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
          # OR use API key auth (preferred):
          EXPO_ASC_API_KEY_PATH: ${{ runner.temp }}/AuthKey.p8
          EXPO_ASC_API_KEY_ID: ${{ secrets.APPLE_API_KEY_ID }}
          EXPO_ASC_API_ISSUER_ID: ${{ secrets.APPLE_API_ISSUER_ID }}
        run: |
          # Materialize the .p8 key from secret if using API key auth
          echo "${{ secrets.APPLE_API_KEY }}" > "${{ runner.temp }}/AuthKey.p8"
          npx eas-cli@latest submit --platform ios --profile production --non-interactive --latest

      - name: Notify on failure
        if: failure()
        run: |
          echo "::error::TestFlight rotation build failed. Run manually from /Users/poum/sherpa-pros-platform/mobile."
          # Optional: add a Slack webhook step here.
```

**Simpler version** (recommended unless you need to split jobs) — drop `--no-wait` so the build step blocks until done, then submit runs in the same job:

```yaml
      - name: Build iOS (production, blocking)
        run: npx eas-cli@latest build --platform ios --profile production --non-interactive

      - name: Submit to App Store Connect
        env:
          EXPO_ASC_API_KEY_PATH: ${{ runner.temp }}/AuthKey.p8
          EXPO_ASC_API_KEY_ID: ${{ secrets.APPLE_API_KEY_ID }}
          EXPO_ASC_API_ISSUER_ID: ${{ secrets.APPLE_API_ISSUER_ID }}
        run: |
          echo "${{ secrets.APPLE_API_KEY }}" > "${{ runner.temp }}/AuthKey.p8"
          npx eas-cli@latest submit --platform ios --profile production --non-interactive --latest
```

**Required GitHub repo secrets** (Settings → Secrets and variables → Actions → New repository secret):

| Secret | How to obtain | Purpose |
|---|---|---|
| `EXPO_TOKEN` | Run `npx eas-cli@latest whoami` locally to confirm logged in, then https://expo.dev/accounts/[account]/settings/access-tokens → **Create token** → name `github-actions-rotation` → copy. | Lets the runner authenticate to EAS. |
| `APPLE_API_KEY_ID` | https://appstoreconnect.apple.com → Users and Access → Integrations → App Store Connect API → **Generate API Key** → role **Admin** or **App Manager**. The key's "Key ID" (10-char string). | Identifies the API key. |
| `APPLE_API_ISSUER_ID` | Same page as above, header banner: "Issuer ID". | Identifies your App Store Connect tenant. |
| `APPLE_API_KEY` | The `.p8` file you download immediately when generating the API key (only available at creation — save it). Paste **the full contents** of the file (including `-----BEGIN PRIVATE KEY-----`) as the secret value. | The actual signing key. |

(Alternative: `APPLE_APP_SPECIFIC_PASSWORD` instead of the three API-key secrets. Less robust — passwords can be revoked, expire, or fail with 2FA edge cases. API key is the durable choice.)

**Cron schedule cheat-sheet:**

- `0 9 1 */2 *` — 9 am UTC, 1st day, every 2nd month. Yields ~6 builds/year. (Recommended.)
- `0 9 1 * *` — every month. Wasteful but bulletproof.
- `0 9 */45 * *` — every 45 days. Cron's day-of-month semantics make this fragile; don't use.

**To test the workflow without waiting for the cron:** push the file to the default branch, then GitHub → Actions → "TestFlight Rotation Build" → **Run workflow**. Verify the .ipa lands in App Store Connect.

**Recommendation:** ship Option B. The first run replaces ~6 manual rotation cycles per year and removes the human single-point-of-failure.

---

## Section 4 — Version-bump strategy

Two version numbers exist on iOS, and they mean different things:

| Field | Source | What Apple uses it for | Who sees it |
|---|---|---|---|
| `expo.version` | `mobile/app.json` | Marketing version (semver) | End users (App Store listing, Settings → app info) |
| `expo.ios.buildNumber` | `mobile/app.json` (or auto-managed by EAS when `appVersionSource: "remote"`) | Disambiguate builds within a marketing version. Must strictly increase. | Reviewers, debug tools, TestFlight |

### Current state of this repo

`mobile/eas.json` is set to:

```json
{
  "cli": { "appVersionSource": "remote" },
  "build": { "production": { "ios": { "autoIncrement": true } } }
}
```

This means **EAS manages `buildNumber` for you** — you never edit it manually. Each `eas build --profile production` increments the previous build number by 1, regardless of what's in `app.json`.

**You are still responsible for `expo.version`.** EAS does not change that.

### When to bump `expo.version`

Use semver. For Sherpa Pros v1:

| Change type | Bump | Example |
|---|---|---|
| Bug fix, no new behavior | Patch | `1.0.0` → `1.0.1` |
| New feature, no breaking changes | Minor | `1.0.1` → `1.1.0` |
| Major UX overhaul / breaking API contract | Major | `1.1.0` → `2.0.0` |

Rules of thumb:

- **TestFlight-only patch builds** during stabilization (Phase 2) — bump patch (`1.0.0` → `1.0.1`) so testers see "what changed".
- **First App Store submission** — keep at `1.0.0`. The first store version is a fresh marketing number.
- **Post-launch hotfix** — patch bump (`1.0.0` → `1.0.1`).
- **New feature shipped to store** — minor bump (`1.0.1` → `1.1.0`).
- **Rotation build with no code changes** (Section 3) — *don't* bump `expo.version`. Apple will accept the same marketing version with an incremented build number indefinitely.

### How to bump

Edit `mobile/app.json`:

```json
{
  "expo": {
    "version": "1.0.1"
  }
}
```

Commit:

```bash
cd /Users/poum/sherpa-pros-platform
git add mobile/app.json CHANGELOG.md
git commit -m "chore(mobile): bump version to 1.0.1"
```

Then `eas build` + `eas submit` as usual. EAS will auto-increment the build number under the new marketing version (TestFlight shows `1.0.1 (1)` for the first build of `1.0.1`).

### CHANGELOG.md pattern

Maintain `mobile/CHANGELOG.md` (Keep a Changelog format). One section per version released to TestFlight or the App Store:

```markdown
# Changelog

All notable changes to the Sherpa Pros iOS app.

## [Unreleased]

## [1.0.1] - 2026-05-15
### Fixed
- Crash when opening Map view without location permission.
- Stripe Connect onboarding link broken on cold launch.

### Changed
- Onboarding copy clarifies "marketplace settlement" (was: ambiguous).

## [1.0.0] - 2026-05-01
### Added
- Initial public release: marketplace dispatch, RBAC, 6 roles, Hub spec, Stripe Connect Plan 1.
```

For each new build pushed to TestFlight, paste the matching `### Added/Changed/Fixed` bullets into the **What to Test** field in App Store Connect — it's literally the same content.

---

## Section 5 — Common pitfalls + fixes

### "Beta App Review still pending after 3 days"

- App Store Connect → My Apps → Sherpa Pros → TestFlight → click the build row.
- Look at the build's **status detail** column. If it says "Apple is requesting more info" or similar, check the email tied to the Apple ID — Apple sometimes sends a question via email, not in the dashboard.
- If still silent after 4+ days: contact Apple Developer Support (https://developer.apple.com/contact/) → "App Review" → reference the App ID `6763805815` and the build number. Response within a business day.

### "Build expired before I could submit"

- Builds expire 90 days after upload. If you missed the rotation, the public link 404s.
- Fix: just run `eas build` + `eas submit` again. ~15–20 min build + ~24 h Beta Review (faster on subsequent builds). The link starts working again as soon as the new build is approved and bound to the External Group.

### "Tester gets 'not accepting more testers' error"

- App Store Connect → TestFlight → External Testing → the group → **Testers**.
- Top-right shows current count vs. the cap. External public-link groups have a per-group cap (currently 10,000 — you're nowhere near it, so this error usually means the group's *iteration* limit is hit).
- Workaround: bump the group's tester limit, or create a second External Group for overflow with the same build attached.
- Hard cap: an app can have **10,000 external testers total** across all groups.

### "Public link doesn't work in incognito"

- Expected behavior. The link redirects through `testflight.apple.com` which assumes Safari + the TestFlight app installed.
- On first install, testers must:
  1. Tap the link in Safari (not Chrome — TestFlight ignores Chrome's universal-link handler reliably).
  2. Install the **TestFlight** app from the App Store if not already installed.
  3. Tap the link again — this time it opens TestFlight, which lets them install the build.
- Add this to the install instructions on `/install` and in the persuasion-rewritten `/invite/{role}` pages.

### "EAS build fails with 'Invalid Apple credentials'"

- Apple ID 2FA token expired. Run `npx eas-cli@latest credentials --platform ios` and re-auth.
- If you switched Apple IDs recently, EAS may have cached the wrong one. Run `eas credentials` → "Remove" → re-create.

### "EAS submit fails with 'Invalid app-specific password'"

- App-specific passwords expire if the underlying Apple ID password changes. Generate a new one at https://account.apple.com → Sign-In and Security → App-Specific Passwords. Replace the cached value: `eas submit` will prompt again.

### "Crash on first launch in production but works in Expo Go"

- Almost always a missing/wrong env var. Production builds bundle env vars at build time, not runtime.
- Check `mobile/app.json` `extra` block and any `EXPO_PUBLIC_*` vars used in code. Run `npx expo config --type public` to see what got bundled.
- Fix → bump build → `eas build` → `eas submit`.

### "EAS Submit succeeds but build never appears in App Store Connect"

- Apple processing can take up to 60 min. Don't panic for the first hour.
- After 60 min, check the build's status in App Store Connect → TestFlight → look for a yellow "Missing Compliance" or "Invalid Binary" warning. Click it — Apple tells you exactly what's wrong (almost always Export Compliance).
- "Invalid Binary" emails sometimes land in the Apple ID's inbox before showing in the dashboard. Search Gmail for "App Store Connect".

---

## Section 6 — Decision matrix

| Situation | Action | Section |
|---|---|---|
| "I just want testers in this week" | TestFlight only — Section 1. Skip App Store. | §1 |
| "We're ready for paying customers" | TestFlight first, then App Store v1.0.0 with Phased Release | §2 |
| "I want testers to keep using TestFlight while v1 is on the App Store" | They coexist by default. External Group keeps getting beta builds; App Store users get released builds. Just keep the rotation alive. | §2 + §3 |
| "Build went sideways, need to ship a hotfix" | Patch the code → bump version (`1.0.0` → `1.0.1`) → `eas build` → `eas submit` → in App Store Connect, request **Expedited Review** (https://developer.apple.com/contact/app-store/?topic=expedite). Apple grants ~24 h turnaround for genuine user-impacting bugs. | §2 + §5 |
| "Apple rejected v1, what now" | Read Resolution Center → metadata fix or binary fix → resubmit. Most v1 rejections clear in one round. | §2 Phase 4 |
| "TestFlight link suddenly stopped working" | Check expiry — 90 days since upload? Run rotation build (Section 3). | §3 + §5 |
| "I missed the 60-day rotation" | Same as above. Build + submit ASAP. ~24 h to recover. | §3 |
| "Need to add iPad-specific changes" | `supportsTablet: true` is already set. Build + submit normally; reviewer will test on iPad. Make sure iPad screenshots are uploaded for the App Store version. | §2 Phase 3 |
| "Want to share builds with internal Apple-ID-holding teammates" | Use **TestFlight Internal Testing** (different from External). Up to 100 internal testers, no Beta App Review needed, builds available within minutes of upload. App Store Connect → TestFlight → Internal Testing → Add Group. | §1 (out of scope but easy add) |
| "Ship Android too" | Same flow with `--platform android`. EAS Submit pushes to Google Play Console. Configure `submit.production.android` in `mobile/eas.json` first. Out of scope for this runbook. | n/a |

---

## Appendix A — Required secrets cheat-sheet

| Secret | Where it lives | Used by | How to rotate |
|---|---|---|---|
| Apple ID password (`phyrom24@gmail.com`) | 1Password | Manual logins, EAS credentials prompts | https://account.apple.com (changes invalidate app-specific passwords) |
| Apple ID app-specific password | 1Password (label `eas-submit`) | EAS Submit (Option A) | https://account.apple.com → App-Specific Passwords → revoke + regenerate |
| App Store Connect API Key (.p8) | 1Password (file attachment) + GitHub secret `APPLE_API_KEY` | EAS Submit, GitHub Actions rotation | App Store Connect → Users and Access → Integrations → revoke + regenerate; download new .p8 immediately (only chance) |
| API Key ID | 1Password + GitHub secret `APPLE_API_KEY_ID` | Same as above | New ID issued with each new key |
| API Issuer ID | 1Password + GitHub secret `APPLE_API_ISSUER_ID` | Same as above | Tied to the App Store Connect account; doesn't rotate unless you switch accounts |
| Expo access token | 1Password + GitHub secret `EXPO_TOKEN` | GitHub Actions rotation | https://expo.dev/settings/access-tokens → revoke + regenerate |
| EAS-managed iOS Distribution Cert + Provisioning Profile | Stored in EAS (not local) | EAS Build | `eas credentials` → "Remove" → re-create. EAS handles everything. |

**Rotation cadence:**

- App Store Connect API Key — rotate annually or whenever an admin leaves.
- Expo token — rotate annually.
- App-specific password — only if you suspect leak; otherwise indefinite.
- Distribution cert — Apple expires automatically (~1 year); EAS auto-renews when you run `eas build` against an expired cert.

---

## Appendix B — One-page TL;DR

**Today (TestFlight up):**

```bash
cd /Users/poum/sherpa-pros-platform/mobile
npx eas-cli@latest login
npx eas-cli@latest credentials --platform ios          # one-time, EAS-managed
npx eas-cli@latest build --platform ios --profile production    # ~15-20 min
npx eas-cli@latest submit --platform ios --profile production --latest    # ~5 min
# Then App Store Connect → TestFlight → External Group → wait 24-48h for Beta Review
```

**Week 3–4 (App Store live):**

1. Latest TestFlight build is stable for ≥48 h.
2. Privacy Policy + Support URL live, screenshots + metadata in App Store Connect.
3. App Store tab → 1.0 Prepare for Submission → Select TestFlight build → Phased Release → Add for Review.
4. Wait 24–48 h. On approval, Phased Release rolls out 1% → 100% over 7 days.

**Every 60 days forever (TestFlight rotation):**

Either GitHub Actions (`.github/workflows/eas-build-rotation.yml`, schedule `0 9 1 */2 *`) does it, or calendar reminder fires and you run the same two `eas` commands above.

**Version bumps:** edit `mobile/app.json` → `expo.version` (semver). EAS auto-increments `buildNumber`. Update `mobile/CHANGELOG.md`.

**On rejection:** read Resolution Center → metadata fix or binary fix → resubmit. Usually clears in 1 round.

**On hotfix:** patch code → bump patch version → `eas build` → `eas submit` → request Expedited Review.

---

*Last updated: 2026-04-30. Owner: Phyrom (poum@hjd.builders). Source-of-truth: `/Users/poum/sherpa-pros-platform/docs/app-store-launch-runbook.md`.*
