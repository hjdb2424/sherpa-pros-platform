---
marp: true
size: 16:9
theme: default
paginate: true
backgroundColor: '#ffffff'
color: '#1a1a2e'
header: ''
footer: 'Sherpa Pros · Community Round · Wefunder · Reg CF'
style: |
  /* ===========================================================
     WEFUNDER COMMUNITY-ROUND DECK — PUBLIC, WARM, STORY-FIRST
     Phone screen. Wefunder embed. Email attachment.
     For homeowners, contractors, and small-biz folks anywhere — launching in NH/ME/MA first.
     Tone: a working contractor at a kitchen table, not a CEO at a podium.
     =========================================================== */

  :root {
    --navy: #1a1a2e;
    --sky: #00a9e0;
    --amber: #f59e0b;
    --emerald: #10b981;
    --slate: #64748b;
    --bg: #ffffff;
    --bg-soft: #f8fafc;
    --bg-warm: #fffbeb;
    --line: #e2e8f0;
    --rust: #b91c1c;
    --ink: #1a1a2e;
  }

  section {
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    font-size: 30px;
    line-height: 1.55;
    padding: 80px 96px;
    background: var(--bg);
    color: var(--navy);
  }

  /* Cover + ask slides — full color, warm */
  section.lead {
    background: var(--navy);
    color: #ffffff;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  section.lead h1 {
    font-size: 88px;
    line-height: 1.05;
    color: #ffffff;
    margin-bottom: 24px;
    max-width: 1100px;
  }
  section.lead h1 .accent { color: var(--amber); }
  section.lead h2 {
    font-size: 36px;
    color: var(--amber);
    font-weight: 600;
  }
  section.lead p {
    font-size: 28px;
    color: #cbd5e1;
    max-width: 900px;
  }
  section.lead .meta {
    font-size: 22px;
    color: #94a3b8;
    margin-top: 32px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  /* Standard headers */
  section h1 {
    font-size: 60px;
    line-height: 1.1;
    color: var(--navy);
    margin: 0 0 28px 0;
    font-weight: 700;
  }
  section h2 {
    font-size: 40px;
    line-height: 1.2;
    color: var(--navy);
    margin: 0 0 20px 0;
    font-weight: 700;
  }
  section h3 {
    font-size: 28px;
    color: var(--slate);
    font-weight: 600;
  }

  section p, section li { font-size: 28px; line-height: 1.55; }
  section ul, section ol { margin: 20px 0; padding-left: 32px; }
  section li { margin-bottom: 14px; }

  strong { color: var(--navy); font-weight: 700; }
  em { color: var(--sky); font-style: normal; font-weight: 600; }

  footer {
    font-size: 16px;
    color: var(--slate);
  }
  section::after {
    color: var(--slate);
    font-size: 16px;
  }

  /* Founder quote — the heart of slide 3 */
  section.story blockquote {
    font-size: 42px;
    line-height: 1.4;
    color: var(--navy);
    border-left: 8px solid var(--amber);
    padding: 16px 0 16px 36px;
    margin: 36px 0;
    max-width: 1000px;
    font-weight: 500;
    font-style: normal;
  }
  section.story .signoff {
    font-size: 22px;
    color: var(--slate);
    margin-top: 24px;
    letter-spacing: 0.04em;
  }
  section.story p {
    font-size: 28px;
    max-width: 1000px;
    color: var(--slate);
  }

  /* Plain-English explainer (slide 2) */
  .plain {
    background: var(--bg-soft);
    border: 2px solid var(--line);
    border-left: 8px solid var(--sky);
    padding: 28px 36px;
    margin: 24px 0;
    border-radius: 8px;
    font-size: 28px;
    line-height: 1.55;
  }
  .plain strong { color: var(--sky); }

  /* Big-number tile grid */
  .tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 32px;
  }
  .tile {
    background: var(--bg-soft);
    border: 2px solid var(--line);
    border-top: 6px solid var(--sky);
    padding: 24px 28px;
    border-radius: 8px;
    text-align: left;
  }
  .tile .label {
    font-size: 18px;
    color: var(--slate);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }
  .tile .value {
    font-size: 44px;
    color: var(--navy);
    font-weight: 800;
    margin-top: 8px;
    line-height: 1.1;
  }
  .tile .note {
    font-size: 20px;
    color: var(--slate);
    margin-top: 8px;
    line-height: 1.35;
  }

  /* Why-now urgency facts */
  .urgency {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 24px;
  }
  .urgency-card {
    background: #fffbeb;
    border: 2px solid #fde68a;
    border-left: 6px solid var(--amber);
    padding: 24px 28px;
    border-radius: 8px;
  }
  .urgency-card .head {
    font-size: 22px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--amber);
    font-weight: 700;
  }
  .urgency-card .body {
    font-size: 26px;
    color: var(--navy);
    margin-top: 10px;
    line-height: 1.4;
  }

  /* Two-column comparison (Wefunder vs VC) */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    margin-top: 24px;
  }
  .col {
    padding: 24px 28px;
    background: var(--bg-soft);
    border: 2px solid var(--line);
    border-radius: 8px;
  }
  .col.amber { border-top: 6px solid var(--amber); }
  .col.sky { border-top: 6px solid var(--sky); }
  .col h2 { font-size: 32px; margin: 0 0 14px 0; }
  .col li { font-size: 24px; margin-bottom: 10px; }

  /* Use-of-funds bars */
  .uof {
    margin-top: 28px;
  }
  .uof-row {
    display: grid;
    grid-template-columns: 90px 1fr 4fr;
    align-items: center;
    gap: 20px;
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
  }
  .uof-row .pct {
    font-size: 36px;
    font-weight: 800;
    color: var(--amber);
  }
  .uof-row .name {
    font-size: 26px;
    font-weight: 700;
    color: var(--navy);
  }
  .uof-row .what {
    font-size: 22px;
    color: var(--slate);
    line-height: 1.4;
  }

  /* Terms slide — clear, scannable */
  .terms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 32px;
    margin-top: 24px;
  }
  .term {
    padding: 16px 0;
    border-bottom: 1px solid var(--line);
  }
  .term .key {
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--slate);
    font-weight: 600;
  }
  .term .val {
    font-size: 26px;
    color: var(--navy);
    font-weight: 700;
    margin-top: 4px;
  }

  /* SEC risk disclosure box */
  .risk {
    margin-top: 28px;
    padding: 24px 28px;
    background: #fef2f2;
    border: 3px solid var(--rust);
    border-radius: 8px;
    color: var(--navy);
  }
  .risk .label {
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--rust);
    font-weight: 800;
    margin-bottom: 10px;
  }
  .risk p {
    font-size: 22px;
    line-height: 1.5;
    color: var(--navy);
    margin: 0;
  }
  .risk strong { color: var(--rust); }

  /* What-different list — checkmarks */
  ul.checks { list-style: none; padding: 0; margin: 28px 0; }
  ul.checks li {
    font-size: 28px;
    padding: 14px 0 14px 48px;
    border-bottom: 1px solid var(--line);
    position: relative;
  }
  ul.checks li::before {
    content: '✓';
    position: absolute;
    left: 0;
    top: 14px;
    color: var(--emerald);
    font-weight: 800;
    font-size: 30px;
  }
  ul.checks li strong { color: var(--navy); }

  /* Step list — how to invest */
  ol.steps { list-style: none; padding: 0; margin: 24px 0; counter-reset: step; }
  ol.steps li {
    counter-increment: step;
    font-size: 28px;
    padding: 18px 0 18px 80px;
    border-bottom: 1px solid var(--line);
    position: relative;
  }
  ol.steps li::before {
    content: counter(step);
    position: absolute;
    left: 0;
    top: 14px;
    width: 56px;
    height: 56px;
    line-height: 56px;
    text-align: center;
    background: var(--amber);
    color: white;
    border-radius: 50%;
    font-weight: 800;
    font-size: 28px;
  }
  ol.steps li strong { color: var(--navy); }

  /* Tag strip (Licensed · Verified · Code-aware) */
  .tags {
    margin-top: 32px;
    font-size: 22px;
    color: var(--slate);
    letter-spacing: 0.05em;
  }
  .tags strong { color: var(--navy); font-weight: 700; }

  /* Big inline number for ask slide */
  .big-number {
    font-size: 140px;
    font-weight: 800;
    color: var(--amber);
    line-height: 1;
    margin: 24px 0;
  }
---

<!-- _class: lead -->

# Own a piece of the platform <span class="accent">you use.</span>

## Sherpa Pros community round on Wefunder.

The licensed-trade marketplace built by a working New Hampshire contractor — now opening up to the homeowners, pros, and neighbors who use it.

<p class="meta">Reg CF · Minimum $100 · Anyone can invest · sherpa-pros-platform.vercel.app</p>

---

# What this is, in plain English.

<div class="plain">
Sherpa Pros is opening a <strong>community round on Wefunder</strong>. You invest as little as <strong>$100</strong> and get a SAFE — a <strong>Simple Agreement for Future Equity</strong> — that converts into shares of Sherpa Pros stock at our next priced fundraising round.
</div>

- **Anyone can invest.** You do not need to be an accredited (high-income or high-net-worth) investor.
- **Offered under SEC Reg CF** — Regulation Crowdfunding from the U.S. Securities and Exchange Commission.
- **Wefunder calculates your investment cap at checkout** based on the SEC's annual income and net-worth rules.
- **You can lose your entire investment.** This is an early-stage startup. Read the SAFE and the Form C before you invest.

<p class="tags"><strong>Licensed · Verified · Code-aware · Built by a contractor · Local · Jobs, not leads · Community ownership</strong></p>

---

<!-- _class: story -->

# Why community ownership matters.

> "I built Sherpa Pros for the contractors I hire every day. The clients I serve. The neighbors I see at the supply house. They should own part of it too."

<p class="signoff">— Phyrom, founder, Sherpa Pros · 12-year working NH general contractor (HJD Builders LLC)</p>

Most marketplaces start with venture capital from San Francisco or New York. The platform gets built, scales, exits — and the people who built liquidity on it (the contractors who took the jobs, the homeowners who hired them) get nothing.

**This round is different.** If you're a homeowner who hires licensed pros, or a pro who takes jobs through us, or a neighbor who believes the next ten years of home-services money should come back to the people doing the work — **this is your seat at the table.**

---

# What Sherpa Pros actually is.

A **licensed-trade marketplace for New Hampshire, Maine, and Massachusetts** — built by a working general contractor — that connects homeowners and property managers with verified licensed pros for everything from a $250 wall paint job to a $25,000 kitchen remodel.

<ul class="checks">
  <li><strong>Jobs, not leads.</strong> Pros get paid for completed work, not for the chance to bid.</li>
  <li><strong>Licensed only.</strong> License and insurance verified at onboarding, re-checked on renewal.</li>
  <li><strong>Code-aware quote validation.</strong> Every quote is checked against the right code book before the homeowner sees it.</li>
  <li><strong>Permit-aware and rebate-aware.</strong> The platform knows which jobs need a permit, which qualify for Mass Save heat-pump rebates, and walks both sides through it.</li>
</ul>

<p class="tags">Live today at <strong>sherpa-pros-platform.vercel.app</strong></p>

---

# Why now. The window is open.

<div class="urgency">
  <div class="urgency-card">
    <div class="head">Labor shortage</div>
    <div class="body">Massachusetts has the <strong>largest construction labor shortage in the nation</strong>. 2.5% construction unemployment — the lowest in 17 years. Project completion times have stretched from 7 to 11 months.</div>
  </div>
  <div class="urgency-card">
    <div class="head">Rebate dollars hitting</div>
    <div class="body"><strong>Mass Save heat-pump rebates</strong> of $10,000+ per home are activating in 2026. National platforms cannot filter for "Mass Save certified." We can.</div>
  </div>
  <div class="urgency-card">
    <div class="head">Incumbents are losing grip</div>
    <div class="body"><strong>Angi (NASDAQ: ANGI)</strong> revenue fell 13% in fiscal year 2025. The Vermont Attorney General settled with them in October 2025 for $100,000 over misleading "Certified Pro" language.</div>
  </div>
  <div class="urgency-card">
    <div class="head">An aging workforce</div>
    <div class="body"><strong>30% of Massachusetts residential construction workers are 55 or older</strong> (vs. 26% nationally). The trades need a platform that delivers jobs, not pay-to-bid noise.</div>
  </div>
</div>

---

# The traction so far.

<div class="tiles">
  <div class="tile">
    <div class="label">Active pros</div>
    <div class="value">[X]</div>
    <div class="note">Across 9 trade categories in NH, ME, MA</div>
  </div>
  <div class="tile">
    <div class="label">Jobs posted</div>
    <div class="value">[Y]</div>
    <div class="note">In the first 60 days of beta</div>
  </div>
  <div class="tile">
    <div class="label">Gross Merchandise Value</div>
    <div class="value">$[Z]</div>
    <div class="note">Total transacted on the platform</div>
  </div>
</div>

- **Live web platform:** sherpa-pros-platform.vercel.app — kick the tires today.
- **Mobile:** iOS via TestFlight (request access). Android via PWA.
- **Beta cohort:** 2 GCs, 2 handymen, 1 plumber, 1 HVAC/heat-pump pro, 1 painter, 1 landscaper, 1 Boston licensed electrician, 1 old-house specialist, 1 roofer.

<p class="tags">Numbers updated by Phyrom within 7 days of launch · GMV = Gross Merchandise Value</p>

---

# The plan with your money.

<div class="uof">
  <div class="uof-row">
    <div class="pct">~40%</div>
    <div class="name">Engineering<br/>and product</div>
    <div class="what">iOS App Store launch, Android PWA polish, code-aware quote validation expansion to more state codes, Property Manager tier features, dispute and escrow refinement.</div>
  </div>
  <div class="uof-row">
    <div class="pct">~30%</div>
    <div class="name">Phase 1 launch<br/>operations</div>
    <div class="what">First Pro Success Manager hire (NH and ME), Boston specialty-lane launch (Mass Save heat pumps, EV chargers, panel upgrades, old-house specialists), supply-house partnerships, NHHBA + MEHBA partnership execution.</div>
  </div>
  <div class="uof-row">
    <div class="pct">~20%</div>
    <div class="name">Marketing<br/>and acquisition</div>
    <div class="what">Paid social testing on Meta and TikTok, Google Ads on Boston specialty keywords, local PR push (NHPR, Boston Globe, Banker & Tradesman, Portland Press Herald), trade show presence at JLC LIVE New England.</div>
  </div>
  <div class="uof-row">
    <div class="pct">~10%</div>
    <div class="name">Reserves<br/>and legal</div>
    <div class="what">Platform liability insurance, 1099-vs-W-2 worker classification legal opinion, USPTO trademark filing, Wefunder fee (7.5%), SAFE legal (~$5K).</div>
  </div>
</div>

**90-day milestones:** Stripe Connect live · 15+ beta pros transacting · first Property Manager anchor signed · Wefunder + grant + venture capital tracks all closed.

---

# The terms.

<div class="terms-grid">
  <div class="term">
    <div class="key">Security</div>
    <div class="val">SAFE (Simple Agreement for Future Equity)</div>
  </div>
  <div class="term">
    <div class="key">Valuation cap</div>
    <div class="val">$5M–$8M (final cap set with attorney before launch)</div>
  </div>
  <div class="term">
    <div class="key">Discount</div>
    <div class="val">20% off the next priced round</div>
  </div>
  <div class="term">
    <div class="key">MFN (Most Favored Nation)</div>
    <div class="val">Yes — your SAFE auto-upgrades if a later SAFE has better terms</div>
  </div>
  <div class="term">
    <div class="key">Minimum investment</div>
    <div class="val">$100</div>
  </div>
  <div class="term">
    <div class="key">Voting rights</div>
    <div class="val">None (standard for community rounds)</div>
  </div>
</div>

<div class="risk">
  <div class="label">SEC-required risk disclosure</div>
  <p><strong>SAFEs are unsecured. There is no scheduled payback date. There is no interest. You can lose 100% of your investment.</strong> Most early-stage startups fail. Only invest money you can fully afford to lose. The U.S. Securities and Exchange Commission has not passed on the accuracy or adequacy of this offering. Read the SAFE document and the Form C filed with the SEC before investing.</p>
</div>

---

# Why Wefunder, not VC?

## Both, actually.

<div class="two-col">
  <div class="col amber">
    <h2>Wefunder community round</h2>
    <ul>
      <li>Open to anyone — $100 minimum</li>
      <li>You join the journey early</li>
      <li>Same SAFE terms a venture capital investor would get</li>
      <li>Quarterly investor updates from the founder</li>
      <li>You become a <strong>founding investor</strong></li>
    </ul>
  </div>
  <div class="col sky">
    <h2>Venture capital (parallel)</h2>
    <ul>
      <li>Building Ventures, Brick & Mortar, Foundamental conversations open</li>
      <li>Will follow if our metrics work</li>
      <li>Triggers the priced round that converts your SAFE</li>
      <li>You benefit from VC-negotiated terms automatically (via MFN)</li>
    </ul>
  </div>
</div>

We are running **four parallel funding tracks**: non-dilutive grants, accelerators, venture capital, and this Wefunder round. **Whichever closes first triggers Phase 1.** The Wefunder round is the only one where the community gets a seat at the table. That's why we're doing it.

---

# What's different about Sherpa Pros.

<ul class="checks">
  <li><strong>Licensed-only pros.</strong> If the trade requires a license in NH, ME, or MA, the pro on the platform has it. Verified at onboarding. Re-checked on renewal.</li>
  <li><strong>Code-aware quote validation.</strong> Every quote is checked against NEC, IRC, MA Electrical Code, NH state code (RSA), and Boston ISD permits before the homeowner sees it.</li>
  <li><strong>Jobs, not leads.</strong> 5% take rate during beta, 10% at scale — about half what a contractor pays Angi today, and tied to completed work, not $400–$800-per-lead pay-to-bid clicks.</li>
  <li><strong>Built by a working contractor.</strong> The code-intelligence layer required a working GC plus a 3-year codebase to build. Lead-gen platforms cannot copy it without a structural rebuild.</li>
  <li><strong>National marketplace, launching where the founder lives.</strong> Phase 1 launch metros (Portsmouth, Manchester, Portland) get the full marketplace. Boston enters with specialty lanes — the playbook we'll template into every metro after.</li>
</ul>

---

# How to invest. Four steps, ten minutes.

<ol class="steps">
  <li><strong>Visit our Wefunder page.</strong> Search "Sherpa Pros" on wefunder.com or use the link your friend forwarded you.</li>
  <li><strong>Pick your investment amount.</strong> $100 minimum. Wefunder calculates your SEC-set cap at checkout based on your income and net worth — you don't have to do that math.</li>
  <li><strong>Sign the SAFE electronically.</strong> Standard SAFE template. ACH bank transfer is the default (no credit card fees). Whole process is under 10 minutes.</li>
  <li><strong>We update you quarterly</strong> with real numbers — pros, jobs, GMV, runway, hires, wins, and misses. Founder-direct access by email at <strong>poum@hjd.builders</strong>. Investors writing $1K+ get optional 15-minute Zoom time with Phyrom.</li>
</ol>

<p class="tags">Plan to hold for <strong>5–10 years</strong>. SAFEs are illiquid. There is no secondary market.</p>

---

<!-- _class: lead -->

# Will you be one of our <span class="accent">first 100 investors?</span>

<p class="big-number">$250K – $500K</p>

## We're raising from the community by [LAUNCH DATE].

Visit **wefunder.com/sherpapros** · Email Phyrom directly at **poum@hjd.builders** · Tour the live platform at **sherpa-pros-platform.vercel.app**

<p class="meta">Reg CF · $100 minimum · Anyone can invest · You can lose your entire investment · Read the Form C before investing</p>
