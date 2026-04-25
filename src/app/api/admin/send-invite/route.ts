import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/send-invite
 * Sends a beta invite email. Currently supports:
 * - Resend (set RESEND_API_KEY env var)
 * - Falls back to 501 if no email service is configured
 *   (client-side will copy to clipboard instead)
 */
export async function POST(request: NextRequest) {
  try {
    const { to, name, role } = await request.json();

    if (!to || !name) {
      return NextResponse.json({ error: 'Missing to or name' }, { status: 400 });
    }

    const roleLabel = role === 'pm' ? 'Property Manager' : role === 'pro' ? 'Trade Professional' : 'Client';
    const inviteUrl = `https://thesherpapros.com/invite/${role === 'pm' ? 'pm' : role === 'pro' ? 'pro' : 'client'}`;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #18181b; margin: 0;">Sherpa Pros</h1>
          <p style="color: #71717a; font-size: 14px; margin-top: 4px;">Trade work, done right.</p>
        </div>

        <p style="font-size: 16px; color: #27272a;">Hi ${name},</p>

        <p style="font-size: 15px; color: #3f3f46; line-height: 1.6;">
          You've been invited to test <strong>Sherpa Pros</strong> as a <strong>${roleLabel}</strong>.
          We're building the smart platform for trade work and we want your feedback before we launch.
        </p>

        <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="font-size: 14px; font-weight: 600; color: #18181b; margin: 0 0 16px 0;">Quick Start:</p>
          <ol style="font-size: 14px; color: #3f3f46; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Visit <a href="https://thesherpapros.com/sign-in" style="color: #00a9e0; text-decoration: none; font-weight: 600;">thesherpapros.com/sign-in</a></li>
            <li>Click "Continue with Google" or enter your email: <strong>${to}</strong></li>
            <li>Complete the 30-second setup</li>
            <li>Take the guided tour</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://thesherpapros.com/sign-in"
             style="display: inline-block; background: #00a9e0; color: white; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
            Sign In Now
          </a>
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

    // Try Resend
    if (process.env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Sherpa Pros <invite@thesherpapros.com>',
          to: [to],
          subject: "You're invited to Sherpa Pros Beta",
          html: htmlBody,
        }),
      });

      if (res.ok) {
        return NextResponse.json({ sent: true, method: 'resend' });
      }
      console.error('Resend error:', await res.text());
    }

    // No email service configured
    return NextResponse.json(
      { sent: false, error: 'No email service configured. Invite copied to clipboard instead.' },
      { status: 501 },
    );
  } catch (err) {
    console.error('Send invite error:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
