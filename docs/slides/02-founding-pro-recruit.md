---
marp: true
size: 16:9
theme: default
paginate: true
backgroundColor: '#ffffff'
color: '#1a1a2e'
header: ''
footer: 'Sherpa Pros · For Founding Pros · 5% take · Half-price forever'
style: |
  /* ===========================================================
     FOUNDING PRO RECRUITMENT DECK — TRUCK / PROJECTOR / BOARDROOM
     Larger fonts. More white space. Big numeric contrast.
     Read on a phone. Project at NHHBA. Pass across a table.
     =========================================================== */

  :root {
    --navy: #1a1a2e;
    --sky: #00a9e0;
    --amber: #f59e0b;
    --emerald: #10b981;
    --slate: #64748b;
    --bg: #ffffff;
    --bg-soft: #f8fafc;
    --line: #e2e8f0;
    --rust: #b91c1c;
  }

  section {
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    font-size: 32px;
    line-height: 1.5;
    padding: 80px 96px;
    background: var(--bg);
    color: var(--navy);
  }

  /* Cover + ask slides — full color */
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
    font-size: 96px;
    line-height: 1.05;
    color: #ffffff;
    margin-bottom: 24px;
  }
  section.lead h1 .accent { color: var(--sky); }
  section.lead h2 {
    font-size: 36px;
    color: var(--amber);
    font-weight: 600;
  }
  section.lead p { font-size: 32px; color: #cbd5e1; }

  /* Standard headers — big, no decoration */
  section h1 {
    font-size: 64px;
    line-height: 1.1;
    color: var(--navy);
    margin: 0 0 32px 0;
    font-weight: 700;
  }
  section h2 {
    font-size: 44px;
    line-height: 1.2;
    color: var(--navy);
    margin: 0 0 20px 0;
    font-weight: 700;
  }
  section h3 {
    font-size: 32px;
    color: var(--slate);
    font-weight: 600;
  }

  section p, section li { font-size: 32px; line-height: 1.5; }
  section ul, section ol { margin: 24px 0; padding-left: 32px; }
  section li { margin-bottom: 16px; }

  strong { color: var(--navy); font-weight: 700; }
  em { color: var(--sky); font-style: normal; font-weight: 600; }

  /* Footer + page number — small, out of the way */
  footer {
    font-size: 16px;
    color: var(--slate);
  }
  section::after {
    color: var(--slate);
    font-size: 16px;
  }

  /* Founder rant — one big paragraph, big text, breathing room */
  section.rant p {
    font-size: 44px;
    line-height: 1.45;
    max-width: 900px;
    margin: 40px auto;
    color: var(--navy);
  }
  section.rant .signoff {
    font-size: 24px;
    color: var(--slate);
    margin-top: 48px;
  }

  /* Tile grid — 4 plain tiles, no slick animation */
  .tiles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    margin-top: 32px;
  }
  .tile {
    background: var(--bg-soft);
    border: 2px solid var(--line);
    border-left: 6px solid var(--sky);
    padding: 28px 32px;
    border-radius: 8px;
  }
  .tile .label {
    font-size: 22px;
    color: var(--slate);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }
  .tile .value {
    font-size: 30px;
    color: var(--navy);
    font-weight: 700;
    margin-top: 8px;
    line-height: 1.3;
  }

  /* MATH SLIDE — the conversion driver. Loud contrast. */
  .math-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin-top: 24px;
    border: 3px solid var(--navy);
    border-radius: 12px;
    overflow: hidden;
  }
  .math-col { padding: 32px 36px; }
  .math-col.angi {
    background: #fef2f2;
    border-right: 3px solid var(--navy);
  }
  .math-col.sherpa {
    background: #ecfdf5;
  }
  .math-col h3 {
    font-size: 28px;
    margin: 0 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .math-col.angi h3 { color: var(--rust); }
  .math-col.sherpa h3 { color: #047857; }

  .math-row {
    margin: 20px 0;
    padding-bottom: 16px;
    border-bottom: 1px dashed rgba(0,0,0,0.15);
  }
  .math-row:last-child { border-bottom: none; }
  .math-row .job {
    font-size: 22px;
    color: var(--slate);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .math-row .cost {
    font-size: 56px;
    font-weight: 800;
    line-height: 1;
    margin-top: 8px;
  }
  .math-col.angi .cost { color: var(--rust); }
  .math-col.sherpa .cost { color: #047857; }
  .math-row .note {
    font-size: 20px;
    color: var(--slate);
    margin-top: 6px;
  }

  .math-callout {
    text-align: center;
    margin-top: 28px;
    font-size: 30px;
    font-weight: 700;
    color: var(--navy);
  }

  /* Two-column layout (commit slide, modes slide) */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 36px;
    margin-top: 24px;
  }
  .col {
    padding: 28px 32px;
    background: var(--bg-soft);
    border: 2px solid var(--line);
    border-radius: 8px;
  }
  .col.amber { border-top: 6px solid var(--amber); }
  .col.sky { border-top: 6px solid var(--sky); }
  .col h2 {
    font-size: 36px;
    margin: 0 0 12px 0;
  }
  .col .price {
    font-size: 24px;
    color: var(--slate);
    margin-bottom: 16px;
  }
  .col ul { margin: 0; padding-left: 24px; }
  .col li { font-size: 26px; margin-bottom: 12px; }

  /* Perks list — generous spacing */
  ul.perks { list-style: none; padding: 0; margin: 32px 0; }
  ul.perks li {
    font-size: 32px;
    padding: 16px 0 16px 48px;
    border-bottom: 1px solid var(--line);
    position: relative;
  }
  ul.perks li::before {
    content: '✓';
    position: absolute;
    left: 0;
    top: 16px;
    color: var(--emerald);
    font-weight: 800;
    font-size: 32px;
  }

  /* Tools row */
  .tools {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 28px;
  }
  .tool {
    border-left: 4px solid var(--sky);
    padding: 16px 20px;
    background: var(--bg-soft);
  }
  .tool .name { font-size: 28px; font-weight: 700; color: var(--navy); }
  .tool .what { font-size: 22px; color: var(--slate); margin-top: 4px; }

  /* Lane callout — Mass Save / EV / old-house */
  .lane-callout {
    margin-top: 28px;
    padding: 20px 24px;
    background: #fffbeb;
    border-left: 6px solid var(--amber);
    font-size: 24px;
    color: var(--navy);
  }
  .lane-callout strong { color: var(--amber); }

  /* Walkthrough placeholder slide */
  .screenshot-placeholder {
    margin-top: 24px;
    border: 3px dashed var(--slate);
    border-radius: 12px;
    padding: 64px 32px;
    text-align: center;
    background: var(--bg-soft);
    color: var(--slate);
    font-size: 28px;
  }

  /* Step list — what happens next */
  ol.steps { list-style: none; padding: 0; margin: 32px 0; counter-reset: step; }
  ol.steps li {
    counter-increment: step;
    font-size: 32px;
    padding: 20px 0 20px 80px;
    border-bottom: 1px solid var(--line);
    position: relative;
  }
  ol.steps li::before {
    content: counter(step);
    position: absolute;
    left: 0;
    top: 16px;
    width: 56px;
    height: 56px;
    background: var(--sky);
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 28px;
  }
  ol.steps li .time { color: var(--slate); font-size: 24px; margin-left: 8px; }

  /* Phyrom intro layout */
  .intro {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 48px;
    align-items: center;
    margin-top: 24px;
  }
  .avatar {
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--sky), var(--navy));
    color: #ffffff;
    font-size: 120px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .intro p { font-size: 34px; line-height: 1.4; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Stop paying for leads.
# <span class="accent">Start getting jobs.</span>

## Sherpa Pros

<br>

Phyrom · HJD Builders LLC · New Hampshire

---

# Hi, I'm Phyrom.

<div class="intro">
  <div class="avatar">P</div>
  <div>
    <p>I run <strong>HJD Builders</strong> out of New Hampshire. Working general contractor, same as you.</p>
    <p>I built <strong>Sherpa Pros</strong> for the contractors I hire every day.</p>
    <p>Today I want 30 minutes to show you what I built and ask if you want one of the founding spots.</p>
  </div>
</div>

---

<!-- _class: rant -->

# Why I built this.

<p>I got tired of watching good subs pay <strong>$500 a month</strong> to Angi for shared leads that ghosted. The platforms got rich. The pros got squeezed. So I built the one I wished existed — built by a contractor, for contractors. <em>Jobs. Not leads.</em></p>

<div class="signoff">— Phyrom · HJD Builders LLC</div>

---

# What you get on Sherpa Pros.

<div class="tiles">
  <div class="tile">
    <div class="label">Real jobs</div>
    <div class="value">The job is yours when you accept it. Not sold to 5 other pros.</div>
  </div>
  <div class="tile">
    <div class="label">Instant payout</div>
    <div class="value">Stripe Connect drops the money in your bank in days, not Net 30.</div>
  </div>
  <div class="tile">
    <div class="label">Code-checked quotes</div>
    <div class="value">Every bid checked against your state and town code before it goes out.</div>
  </div>
  <div class="tile">
    <div class="label">No lead-blast</div>
    <div class="value">License + insurance verified by us. Direct match. No bidding wars on shared leads.</div>
  </div>
</div>

---

# The math: Sherpa Pros vs Angi.

<div class="math-grid">
  <div class="math-col angi">
    <h3>Angi (lead fees)</h3>
    <div class="math-row">
      <div class="job">$500 paint job</div>
      <div class="cost">$400–$800</div>
      <div class="note">Lead fees + subscription, even on jobs you lose</div>
    </div>
    <div class="math-row">
      <div class="job">$5,000 panel upgrade</div>
      <div class="cost">$400–$800</div>
      <div class="note">Same lead cost. Doesn't scale with your work.</div>
    </div>
  </div>
  <div class="math-col sherpa">
    <h3>Sherpa Pros (take rate)</h3>
    <div class="math-row">
      <div class="job">$500 paint job</div>
      <div class="cost">$25</div>
      <div class="note">5% beta · $50 at standard 10% rate</div>
    </div>
    <div class="math-row">
      <div class="job">$5,000 panel upgrade</div>
      <div class="cost">$250</div>
      <div class="note">5% beta · $500 at standard 10% rate</div>
    </div>
  </div>
</div>

<div class="math-callout">You only pay when the client pays you. No subscription. No lead fees.</div>

---

# Founding Pro perks.

<ul class="perks">
  <li><strong>Half-price forever.</strong> 5% take rate locked in for life if you stay. New pros pay 10% + $49/mo subscription.</li>
  <li><strong>Founding Pro badge.</strong> Permanent. Shows on every quote, every match, every search.</li>
  <li><strong>Direct line to me.</strong> My cell. Real product feedback shapes what ships next.</li>
  <li><strong>Free promo video.</strong> I come to one of your jobsites and shoot a walk-the-job video. Yours to use.</li>
  <li><strong>Press push.</strong> Mass Save and Old-House Verified pro spotlights name you first.</li>
</ul>

---

# What you commit to.

<ul class="perks" style="margin-top:24px;">
  <li><strong>90-day beta minimum.</strong> Real licensed work only.</li>
  <li><strong>License + insurance verified</strong> on file before your first job.</li>
  <li><strong>Reply to clients inside 24 hours.</strong> Hold your rating above 4 stars. That's the bar.</li>
  <li><strong>10-min weekly feedback.</strong> Call or text. One short video testimonial when you're ready.</li>
</ul>

<div class="lane-callout" style="margin-top:32px;">
Tone: direct, not soft. You know how this works. We don't waste each other's time.
</div>

---

# The two modes. Pick one or both.

<div class="two-col">
  <div class="col amber">
    <h2>Project</h2>
    <div class="price">$1,500 and up · you bid</div>
    <ul>
      <li>Multi-bid jobs — 2 to 3 pros</li>
      <li>Code-aware quote validation</li>
      <li>Permit-aware workflow</li>
      <li>7-day Stripe hold</li>
      <li>Kitchens · panels · heat pumps · roofs · old-house work</li>
    </ul>
  </div>
  <div class="col sky">
    <h2>Quick Job</h2>
    <div class="price">$200–$1,500 · pre-priced menu</div>
    <ul>
      <li>Pick from a flat-rate menu — no bidding</li>
      <li>Match-and-go in under 30 minutes</li>
      <li>24-hour Stripe payout</li>
      <li>Toilets · faucets · ceiling fans · drywall patches · single-wall paint</li>
    </ul>
  </div>
</div>

---

# Tools you get for free.

<div class="tools">
  <div class="tool">
    <div class="name">QuickBooks Online sync</div>
    <div class="what">1099 (subcontractor tax form) reporting on autopilot</div>
  </div>
  <div class="tool">
    <div class="name">Stripe Connect</div>
    <div class="what">Instant payouts to your bank when the job clears</div>
  </div>
  <div class="tool">
    <div class="name">Wisetack</div>
    <div class="what">Offer your client financing on bigger jobs</div>
  </div>
  <div class="tool">
    <div class="name">Zinc</div>
    <div class="what">Materials at contractor pricing, delivered</div>
  </div>
  <div class="tool">
    <div class="name">Uber Connect / DoorDash Drive</div>
    <div class="what">Same-day deliveries when you need them</div>
  </div>
  <div class="tool">
    <div class="name">Platform liability insurance</div>
    <div class="what">We carry coverage on every job. You stay the licensed pro.</div>
  </div>
</div>

<div class="lane-callout">
<strong>Boston pros:</strong> Mass Save heat-pump certified · EV charger work · old-house specialty — these lanes have their own client pipeline. Built for you.
</div>

---

# Live walkthrough.

<div class="screenshot-placeholder">
[ Screenshot 1 — client posts a job, system already knows the building code for their address ]
</div>

<div class="screenshot-placeholder" style="margin-top:16px;">
[ Screenshot 2 — Dispatch matches the job to you in under 2 minutes ]
</div>

<div class="screenshot-placeholder" style="margin-top:16px;">
[ Screenshot 3 — code-aware quote flags missing scope before client sees it ]
</div>

<p style="font-size:22px;color:var(--slate);margin-top:24px;">Phyrom replaces these with real screen recordings before each demo.</p>

---

# What happens next.

<ol class="steps">
  <li>Sign the Founding Pro Agreement <span class="time">— 5 min, electronic via OpenSign</span></li>
  <li>Upload your license + insurance <span class="time">— 5 min</span></li>
  <li>Build your profile <span class="time">— 15 min</span></li>
  <li>First job within 7 days <span class="time">— I drive demand from my own client list if I have to</span></li>
</ol>

<p style="text-align:center; font-size:48px; color:var(--sky); font-weight:800; margin-top:32px;">You're live by Friday.</p>

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Are you in?

<br>

<h2 style="font-size:48px; color:#ffffff; font-weight:600;">5% take · Half-price forever · 10 founding spots</h2>

<br>
<br>

<p style="font-size:36px; color:#cbd5e1;">thesherpapros.com/sign-up</p>
<p style="font-size:36px; color:var(--amber); font-weight:700;">Or text Phyrom direct.</p>

<br>

<p style="font-size:24px; color:#94a3b8;">Got questions? I read every one myself.</p>
