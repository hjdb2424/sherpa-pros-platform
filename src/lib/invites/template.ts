/**
 * Beta-invite email templates — single source of truth.
 *
 * Both the server-side Resend sender (src/app/api/admin/send-invite/route.ts)
 * and the client-side Email button (src/app/(dashboard)/admin/access-list/page.tsx)
 * import from this module so the two paths stay in sync.
 *
 * If you change the copy here, both the auto-sent email AND the
 * copy-to-clipboard fallback update at the same time.
 */

export type InviteAppRole = "client" | "pm" | "pro";

export interface InviteOpts {
  name: string;
  role: InviteAppRole;
  to: string;
}

const SUBJECT = "You're invited to Sherpa Pros Beta";

export function inviteSubject(): string {
  return SUBJECT;
}

function roleLabel(role: InviteAppRole): string {
  return role === "pm" ? "Property Manager" : role === "pro" ? "Trade Professional" : "Client";
}

export function buildInvitePlainText({ name, role, to }: InviteOpts): string {
  const inviteUrl = `https://www.thesherpapros.com/invite/${role}`;
  return [
    `Hi ${name},`,
    "",
    "You've been invited to test Sherpa Pros — trade work, done right.",
    "One place for the hire, the work, and the money.",
    "",
    "WHAT YOU'LL GET INSIDE",
    "• Sherpa Marketplace — vetted pros, on-demand dispatch, real-time tracking",
    "• Code-Verified Quotes — every bid validated against local building codes",
    "• Marketplace Payment Protection — your money is held until the work passes inspection",
    "• Materials Dispatch — materials ordered + delivered straight to the job site",
    "• Sherpa Success Manager — a real human (not a chatbot) manages your project",
    "• Smart Scan OCR, In-App Messaging, Sherpa Score, Rewards Program, Finance Hub",
    "",
    "🌐 WEB ACCESS",
    "Sign in: https://www.thesherpapros.com/sign-in",
    `Use this email (${to}) to access the platform.`,
    "",
    "📱 MOBILE APP",
    "Walkthrough: https://www.thesherpapros.com/install",
    "iPhone uses TestFlight (Apple's beta app). Android uses the web app for now —",
    "/install has step-by-step instructions for both.",
    "",
    `Your role-specific guide: ${inviteUrl}`,
    "",
    "Questions? Reply to this email or contact info@thesherpapros.com",
    "",
    "— The Sherpa Pros Team",
  ].join("\n");
}

export function buildInviteHtml({ name, role, to }: InviteOpts): string {
  const inviteUrl = `https://www.thesherpapros.com/invite/${role}`;
  const label = roleLabel(role);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #18181b; margin: 0;">Sherpa Pros</h1>
        <p style="color: #71717a; font-size: 14px; margin-top: 4px;">Trade work, done right.</p>
      </div>

      <p style="font-size: 16px; color: #27272a;">Hi ${name},</p>

      <p style="font-size: 15px; color: #3f3f46; line-height: 1.6;">
        You've been invited to test <strong>Sherpa Pros</strong> as a <strong>${label}</strong>.
        <em>Trade work, done right — one place for the hire, the work, and the money.</em>
        We want your feedback before we launch in your area.
      </p>

      <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <p style="font-size: 14px; font-weight: 600; color: #18181b; margin: 0 0 12px 0;">What you'll see inside:</p>
        <ul style="font-size: 14px; color: #3f3f46; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li><strong>Sherpa Marketplace</strong> — vetted pros, on-demand dispatch, real-time tracking</li>
          <li><strong>Code-Verified Quotes</strong> — every bid validated against local building codes</li>
          <li><strong>Marketplace Payment Protection</strong> — your money is held until the work passes inspection</li>
          <li><strong>Materials Dispatch</strong> — materials ordered + delivered to the job site</li>
          <li><strong>Sherpa Success Manager</strong> — a real human (not a chatbot) on your project</li>
          <li><strong>Smart Scan OCR, In-App Messaging, Sherpa Score, Rewards, Finance Hub</strong></li>
        </ul>
      </div>

      <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <p style="font-size: 14px; font-weight: 600; color: #18181b; margin: 0 0 16px 0;">Quick Start (web):</p>
        <ol style="font-size: 14px; color: #3f3f46; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Visit <a href="https://www.thesherpapros.com/sign-in" style="color: #00a9e0; text-decoration: none; font-weight: 600;">www.thesherpapros.com/sign-in</a></li>
          <li>Click "Continue with Google" or enter your email: <strong>${to}</strong></li>
          <li>Complete the 30-second setup</li>
          <li>Take the guided tour</li>
        </ol>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://www.thesherpapros.com/sign-in"
           style="display: inline-block; background: #00a9e0; color: white; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
          Sign In Now
        </a>
      </div>

      <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <p style="font-size: 14px; font-weight: 600; color: #9a3412; margin: 0 0 8px 0;">📱 Want it on your phone?</p>
        <p style="font-size: 14px; color: #7c2d12; line-height: 1.6; margin: 0 0 12px 0;">
          <strong>iPhone:</strong> install via Apple TestFlight (free Apple beta app).
          <strong>Android:</strong> use the web app for now — installs to your home screen like a real app.
        </p>
        <a href="https://www.thesherpapros.com/install"
           style="display: inline-block; background: #ff4500; color: white; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
          Install the app →
        </a>
        <p style="font-size: 12px; color: #9a3412; margin: 12px 0 0 0;">
          The install page walks you through the steps and shows what you'll see in the app.
        </p>
      </div>

      <p style="font-size: 14px; color: #71717a; line-height: 1.6;">
        Your role-specific guide: <a href="${inviteUrl}" style="color: #00a9e0; text-decoration: none;">${inviteUrl}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />

      <p style="font-size: 13px; color: #a1a1aa; text-align: center;">
        Questions? Reply to this email or contact
        <a href="mailto:info@thesherpapros.com" style="color: #00a9e0; text-decoration: none;">info@thesherpapros.com</a>
      </p>
      <p style="font-size: 12px; color: #d4d4d8; text-align: center; margin-top: 8px;">
        &copy; 2026 Sherpa Pros. All rights reserved.
      </p>
    </div>
  `;
}
