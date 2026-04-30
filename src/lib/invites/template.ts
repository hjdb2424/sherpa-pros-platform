/**
 * Beta-invite email templates — single source of truth.
 *
 * Both the server-side Resend sender (src/app/api/admin/send-invite/route.ts)
 * and the client-side Email button (src/app/(dashboard)/admin/access-list/page.tsx)
 * import from this module so the two paths stay in sync.
 *
 * Three role-specific variants (Pro / Client / PM), each in Phyrom's
 * first-person voice. Pain-led headline, founding-tester perks, dual CTA
 * (Sign in + Install on phone), short and email-skimmable.
 *
 * If you change the copy here, both the auto-sent email AND the
 * copy-to-clipboard fallback update at the same time.
 */

export type InviteAppRole = "client" | "pm" | "pro" | "multi_view";

export interface InviteOpts {
  name: string;
  role: InviteAppRole;
  to: string;
}

// ── Subjects ──────────────────────────────────────────────────────────

const SUBJECTS: Record<InviteAppRole, string> = {
  pro:        "Stop paying for leads that ghost — your Sherpa Pros beta seat",
  client:     "Stop paying contractors and praying — your Sherpa Pros beta access",
  pm:         "Stop chasing vendors — your PM beta seat at Sherpa Pros",
  multi_view: "You're a Multi-View Beta Tester — see every Sherpa Pros viewpoint",
};

export function inviteSubject(role: InviteAppRole = "client"): string {
  return SUBJECTS[role];
}

// ── Shared vision (used by all 3 role variants) ───────────────────────

const VISION =
  "Sherpa Pros is the first on-demand local logistics and trade-job delivery platform — connecting consumers with a network of independent contractors through a marketplace built so trade work actually works for everyone in it. Code-verified quotes go in, payment protection holds the money until the work passes the Sherpa Pros checklist and inspection, and a real human owns coordination and disputes.";

// ── Per-role copy ─────────────────────────────────────────────────────

interface RoleCopy {
  hero: string;          // bold one-liner, the hook
  pain: string;          // 1-sentence pain statement
  fix: { name: string; desc: string }[]; // 3-4 bullets — features that solve the pain
  perks: string[];       // 3 founding-tester perks (concrete, persona-specific)
  cohort: string;        // honest cohort size for "you're 1 of N" trust signal
  signoff: string;       // Phyrom's sign-off line
}

const COPY: Record<InviteAppRole, RoleCopy> = {
  pro: {
    hero: "Stop paying for leads that ghost. Get paid when the work passes.",
    pain:
      "Paying $35 every time a homeowner clicks your name and never picks up. Bidding wars with lowballers. Chasing invoices after the job's done.",
    fix: [
      { name: "Marketplace Payment Protection", desc: "Client funds the job up front. Money releases on milestones. You don't chase invoices." },
      { name: "Code-Verified Quotes", desc: "Every bid is checked against local building codes before it hits the client. The cheapest guess doesn't auto-win." },
      { name: "Sherpa Success Manager", desc: "Real human handles disputes and no-shows. Not a chatbot, not an offshore reviewer." },
      { name: "Zero lead fees, ever", desc: "You only pay a service fee when the homeowner pays you. No leads-that-ghost tax." },
    ],
    perks: [
      "Free Sherpa Home subscription for life (the homeowner perk, on the house)",
      "\"Founding Pro\" badge on your profile — permanent trust marker for clients",
      "Direct line to me (text/WhatsApp) — tell me what's broken, I'll fix it fast",
    ],
    cohort: "You're 1 of 10 Pros in this beta cohort.",
    signoff: "Holler if anything's confusing. I built this for you.",
  },

  client: {
    hero: "Stop getting three quotes you can't compare. Stop paying and praying.",
    pain:
      "Three bids, three different scopes, no way to tell who's padding and who forgot something. Pay the deposit, hope the contractor shows up, hope the work is good. Most of the time it isn't.",
    fix: [
      { name: "Marketplace Payment Protection", desc: "Your money is held until the work passes inspection. No more deposit-and-ghost." },
      { name: "Code-Verified Quotes", desc: "Every bid is validated against local building codes and market pricing. You see apples-to-apples comparisons, not guesses." },
      { name: "Sherpa Success Manager", desc: "A real human handles vendor coordination and disputes. Not a chatbot." },
      { name: "Materials Dispatch", desc: "Materials delivered straight to the job site. Your job goes faster, the pro doesn't disappear for supply runs." },
    ],
    perks: [
      "Free Sherpa Home subscription for life (when it launches — discounted rates, priority matching, faster SLAs)",
      "\"Founding Member\" badge on your account — visible to pros bidding your jobs",
      "Direct line to me (text/WhatsApp) — if anything goes sideways, I want to hear about it",
    ],
    cohort: "You're 1 of 11 Clients in this beta cohort.",
    signoff: "Reply to this email if anything's unclear — I read every one.",
  },

  pm: {
    hero: "Stop chasing vendors. Stop paying for bad work.",
    pain:
      "Vendor coordination is on you. Per-property cost visibility happens at month-end (too late). When work is bad, you have no leverage — the vendor invoiced, you pay anyway.",
    fix: [
      { name: "Marketplace Payment Protection", desc: "Funds hold until the work passes inspection. Milestone-based release. You don't pay for bad work." },
      { name: "Combined Maintenance kanban", desc: "One board across every property. Drill into any unit for full work-order history." },
      { name: "Multi-Trade Coordination", desc: "One job, multiple trades — we sequence the handoffs so you don't play project manager." },
      { name: "Sherpa Success Manager (LIVE)", desc: "Dedicated human owns project oversight and dispute resolution. Day-one assignment for beta PMs." },
    ],
    perks: [
      "Free Sherpa Home for life across every unit you manage (when it launches)",
      "\"Founding PM\" badge on your account, visible to vendors bidding your work",
      "White-glove portfolio migration — we move your vendor list and active work orders for you",
    ],
    cohort: "You're 1 of only 3 PMs in this beta cohort.",
    signoff: "Tell me what's missing. Your feedback shapes what ships next quarter.",
  },

  multi_view: {
    hero: "You're not just a user — you're testing every viewpoint on Sherpa Pros.",
    pain:
      "Most beta tools dump you into one role. You can't see what the other side sees, can't catch bugs in the persona handoffs, can't tell us when a flow feels weird from the contractor's chair vs the homeowner's. We need eyes across the whole marketplace, not just one corner.",
    fix: [
      { name: "Floating Profile Switcher", desc: "Hit the 🦸 button bottom-left to flip between Pro / Client / PM / Tenant views in one click. Same identity, every dashboard." },
      { name: "Test the handoffs", desc: "Post a job as a Client → switch to Pro → bid on it. See exactly how the marketplace looks from both sides of the same trade." },
      { name: "Code-Verified Quote flows in every view", desc: "The same quote is rendered four different ways depending on who's looking at it. Tell us where it breaks." },
      { name: "Direct line to me", desc: "Text/WhatsApp for fast feedback. Bug reports, copy nits, missing edge cases — send everything you find." },
    ],
    perks: [
      "\"Multi-View Tester\" badge across every dashboard you visit",
      "Free Sherpa Home subscription for life when it launches",
      "First look at unreleased Wisemen and roadmap bets — your input shapes what we build next",
    ],
    cohort: "You're 1 of only 2-3 Multi-View Testers in this cohort.",
    signoff: "Tell me where the seams are. Where does it feel weird going from one role to another? That's the gold I'm looking for.",
  },
};

// ── "Who else is on the platform" cards (the other personas) ──────────

type StandardRole = "client" | "pm" | "pro";
const STANDARD_ROLES: StandardRole[] = ["client", "pm", "pro"];

interface OtherRoleCard {
  role: StandardRole;
  label: string;        // "Pros" / "Homeowners & Clients" / "Property Managers"
  oneLiner: string;     // value prop in one sentence
}

const OTHER_ROLE_CARDS: Record<StandardRole, OtherRoleCard> = {
  pro:    { role: "pro",    label: "Pros",                    oneLiner: "Licensed trades, handymen, and skilled carpenters get vetted jobs with zero lead fees and milestone-based payment protection." },
  client: { role: "client", label: "Homeowners & Clients",    oneLiner: "Homeowners and small-property owners get code-verified quotes from licensed pros, with payment held until the work passes inspection." },
  pm:     { role: "pm",     label: "Property Managers",       oneLiner: "Commercial PMs get a Combined Maintenance kanban, Multi-Trade Coordination, and per-property cost tracking — no more chasing vendors." },
};

/**
 * Returns the persona cards the recipient should see.
 * - Standard roles (pro/client/pm): the OTHER two personas
 * - multi_view: ALL three personas (they test every viewpoint)
 */
function otherRoleCards(myRole: InviteAppRole): OtherRoleCard[] {
  if (myRole === "multi_view") {
    return STANDARD_ROLES.map((r) => OTHER_ROLE_CARDS[r]);
  }
  return STANDARD_ROLES.filter((r) => r !== myRole).map((r) => OTHER_ROLE_CARDS[r]);
}

/** Every role has a public landing page at /invite/{role}, including multi_view. */
function hasPublicInvitePage(_role: InviteAppRole): boolean {
  return true;
}

// ── Plain text ────────────────────────────────────────────────────────

export function buildInvitePlainText({ name, role, to }: InviteOpts): string {
  const c = COPY[role];
  const others = otherRoleCards(role);

  const lines = [
    `Hi ${name},`,
    "",
    VISION,
    "",
    `${c.hero}`,
    "",
    `THE PROBLEM`,
    c.pain,
    "",
    `WHAT FIXES IT`,
    ...c.fix.map((f) => `• ${f.name} — ${f.desc}`),
    "",
    `FOUNDING-TESTER PERKS`,
    `${c.cohort} What you get that later joiners don't:`,
    ...c.perks.map((p) => `• ${p}`),
    "",
    `WHO ELSE IS ON THE PLATFORM`,
    "Sherpa Pros is a real two-sided market. While you're testing, the other roles are too:",
    ...others.flatMap((o) => [
      `• ${o.label} — ${o.oneLiner}`,
      `  (more: https://www.thesherpapros.com/invite/${o.role})`,
    ]),
    "",
    `Full platform overview: https://www.thesherpapros.com`,
    "",
    `→ Sign up:    https://www.thesherpapros.com/sign-up`,
    `→ Already have an account? Sign in: https://www.thesherpapros.com/sign-in`,
    `→ Install on phone: https://www.thesherpapros.com/install`,
  ];

  if (hasPublicInvitePage(role)) {
    lines.push(`→ Read your role-specific page: https://www.thesherpapros.com/invite/${role}`);
  }

  lines.push(
    "",
    `Use this email (${to}) when you sign in.`,
    "",
    c.signoff,
    "",
    "— Phyrom",
    "Founder, Sherpa Pros",
    "info@thesherpapros.com",
  );

  return lines.join("\n");
}

// ── HTML ──────────────────────────────────────────────────────────────

const BRAND_BLUE = "#00a9e0";
const BRAND_ORANGE = "#ff4500";

function ctaButton(href: string, label: string, color: string): string {
  return `
    <a href="${href}" style="display: inline-block; background: ${color}; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 8px; text-decoration: none; line-height: 1;">
      ${label}
    </a>
  `;
}

export function buildInviteHtml({ name, role, to }: InviteOpts): string {
  const c = COPY[role];
  const showRolePageLink = hasPublicInvitePage(role);
  const inviteUrl = showRolePageLink ? `https://www.thesherpapros.com/invite/${role}` : "";

  const fixList = c.fix
    .map(
      (f) => `
      <li style="margin: 0 0 12px 0;">
        <strong style="color: #18181b;">${f.name}</strong>
        <span style="color: #3f3f46;"> — ${f.desc}</span>
      </li>`,
    )
    .join("");

  const perksList = c.perks
    .map(
      (p) => `
      <li style="margin: 0 0 8px 0; color: #18181b;">
        <span style="color: ${BRAND_ORANGE};">→</span> ${p}
      </li>`,
    )
    .join("");

  return `
    <!-- Outer wrapper: table for Outlook compatibility -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fafafa; padding: 24px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background: #ffffff; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <tr>
              <td style="padding: 40px 32px;">

                <!-- Brand header (logo + tagline) -->
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src="https://www.thesherpapros.com/logo.png" alt="Sherpa Pros" width="180" style="display: block; margin: 0 auto 6px; height: auto; max-width: 60%;" />
                  <p style="color: ${BRAND_BLUE}; font-size: 13px; margin: 4px 0 0 0; font-weight: 500;">Trade work, done right.</p>
                </div>

                <!-- Greeting -->
                <p style="font-size: 16px; color: #18181b; margin: 0 0 16px 0;">Hi ${name},</p>

                <!-- Vision -->
                <p style="font-size: 15px; color: #3f3f46; line-height: 1.6; margin: 0 0 24px 0;">
                  ${VISION}
                </p>

                <!-- Hero hook -->
                <div style="background: linear-gradient(135deg, ${BRAND_BLUE}10 0%, ${BRAND_BLUE}05 100%); border-left: 4px solid ${BRAND_BLUE}; padding: 16px 20px; margin: 0 0 24px 0; border-radius: 4px;">
                  <p style="font-size: 17px; font-weight: 600; color: #18181b; margin: 0; line-height: 1.4;">
                    ${c.hero}
                  </p>
                </div>

                <!-- The problem -->
                <p style="font-size: 13px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">
                  The problem
                </p>
                <p style="font-size: 15px; color: #3f3f46; line-height: 1.6; margin: 0 0 24px 0;">
                  ${c.pain}
                </p>

                <!-- What fixes it -->
                <p style="font-size: 13px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">
                  What fixes it
                </p>
                <ul style="font-size: 14px; line-height: 1.6; margin: 0 0 28px 0; padding-left: 20px;">
                  ${fixList}
                </ul>

                <!-- Founding perks -->
                <div style="background: ${BRAND_ORANGE}08; border: 1px solid ${BRAND_ORANGE}30; border-radius: 12px; padding: 20px; margin: 0 0 28px 0;">
                  <p style="font-size: 14px; font-weight: 700; color: #18181b; margin: 0 0 4px 0;">
                    Founding-tester perks
                  </p>
                  <p style="font-size: 13px; color: #71717a; margin: 0 0 14px 0; font-style: italic;">
                    ${c.cohort} What you get that later joiners don&apos;t:
                  </p>
                  <ul style="font-size: 14px; line-height: 1.5; margin: 0; padding-left: 0; list-style: none;">
                    ${perksList}
                  </ul>
                </div>

                <!-- Primary CTA -->
                <div style="text-align: center; margin: 0 0 16px 0;">
                  ${ctaButton("https://www.thesherpapros.com/sign-up", "Get started — sign up &rarr;", BRAND_BLUE)}
                </div>

                <!-- Sign-in helper -->
                <p style="font-size: 13px; color: #71717a; text-align: center; margin: 0 0 28px 0;">
                  Use <strong style="color: #18181b;">${to}</strong> &middot; takes about 30 seconds
                </p>
                <p style="font-size: 13px; color: #71717a; text-align: center; margin: 0 0 28px 0;">Already have an account? <a href="https://www.thesherpapros.com/sign-in" style="color: ${BRAND_BLUE}; text-decoration: none; font-weight: 600;">Sign in &rarr;</a></p>

                <!-- Mobile install secondary CTA -->
                <div style="background: ${BRAND_ORANGE}08; border: 1px solid ${BRAND_ORANGE}30; border-radius: 12px; padding: 20px; margin: 0 0 24px 0; text-align: center;">
                  <p style="font-size: 14px; font-weight: 600; color: #9a3412; margin: 0 0 6px 0;">
                    📱 Want it on your phone?
                  </p>
                  <p style="font-size: 13px; color: #7c2d12; line-height: 1.5; margin: 0 0 14px 0;">
                    iPhone via TestFlight, Android as a PWA. The /install page walks you through it.
                  </p>
                  ${ctaButton("https://www.thesherpapros.com/install", "Install on phone &rarr;", BRAND_ORANGE)}
                </div>

                <!-- Read more / role page (omitted for multi_view — no public page) -->
                ${showRolePageLink ? `
                <p style="font-size: 13px; color: #71717a; text-align: center; margin: 0 0 28px 0;">
                  Want the full picture for your role first?
                  <a href="${inviteUrl}" style="color: ${BRAND_BLUE}; text-decoration: none; font-weight: 600;">
                    Read your beta page &rarr;
                  </a>
                </p>` : ""}

                <!-- Who else is on the platform -->
                <p style="font-size: 13px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">
                  Who else is on the platform
                </p>
                <p style="font-size: 13px; color: #71717a; line-height: 1.5; margin: 0 0 14px 0;">
                  Sherpa Pros is a real two-sided market &mdash; while you&apos;re testing, the other roles are testing alongside you:
                </p>
                ${otherRoleCards(role)
                  .map(
                    (o) => `
                <div style="border: 1px solid #e4e4e7; border-radius: 8px; padding: 14px 16px; margin: 0 0 10px 0; background: #fafafa;">
                  <p style="font-size: 14px; font-weight: 700; color: #18181b; margin: 0 0 4px 0;">${o.label}</p>
                  <p style="font-size: 13px; color: #3f3f46; line-height: 1.5; margin: 0 0 8px 0;">${o.oneLiner}</p>
                  <a href="https://www.thesherpapros.com/invite/${o.role}" style="font-size: 12px; color: ${BRAND_BLUE}; text-decoration: none; font-weight: 600;">
                    See the ${o.label.toLowerCase()} beta page &rarr;
                  </a>
                </div>`,
                  )
                  .join("")}

                <p style="font-size: 13px; color: #71717a; text-align: center; margin: 16px 0 28px 0;">
                  Curious about the whole platform?
                  <a href="https://www.thesherpapros.com" style="color: ${BRAND_BLUE}; text-decoration: none; font-weight: 600;">
                    See the full Sherpa Pros overview &rarr;
                  </a>
                </p>

                <!-- Sign-off -->
                <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 28px 0 24px 0;" />

                <p style="font-size: 14px; color: #3f3f46; line-height: 1.6; margin: 0 0 16px 0;">
                  ${c.signoff}
                </p>

                <p style="font-size: 14px; color: #18181b; margin: 0; line-height: 1.4;">
                  &mdash; <strong>Phyrom</strong><br />
                  <span style="color: #71717a; font-size: 13px;">Founder, Sherpa Pros &middot; <a href="mailto:info@thesherpapros.com" style="color: ${BRAND_BLUE}; text-decoration: none;">info@thesherpapros.com</a></span>
                </p>

                <!-- Footer -->
                <p style="font-size: 11px; color: #d4d4d8; text-align: center; margin: 32px 0 0 0;">
                  &copy; 2026 Sherpa Pros &middot; www.thesherpapros.com
                </p>

              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// ── Clipboard-only variants ───────────────────────────────────────────
//
// The /admin/access-list "Email" button copies the invite to the clipboard
// when Resend isn't configured. These wrappers prepend a subject-line block
// so Phyrom can cut/paste the subject into Gmail's Subject field after pasting
// the body. Resend's send-path keeps using the plain builders above — its API
// call passes `subject` separately, so a redundant in-body subject would
// pollute the auto-sent email.

export function buildInviteHtmlForClipboard(opts: InviteOpts): string {
  const subject = inviteSubject(opts.role);
  const subjectBlock = `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fef3c7; border: 2px dashed #f59e0b; padding: 14px 18px; margin: 0 0 16px 0; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <tr>
        <td>
          <p style="font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 6px 0;">
            ✂ Cut this line and paste into the Subject field above
          </p>
          <p style="font-size: 16px; font-weight: 600; color: #18181b; margin: 0; line-height: 1.4;">
            ${subject}
          </p>
        </td>
      </tr>
    </table>
  `;
  return subjectBlock + buildInviteHtml(opts);
}

export function buildInvitePlainTextForClipboard(opts: InviteOpts): string {
  const subject = inviteSubject(opts.role);
  return [
    `--- SUBJECT LINE (cut and paste into Subject field) ---`,
    subject,
    `------------------------------------------------------`,
    ``,
    buildInvitePlainText(opts),
  ].join("\n");
}
