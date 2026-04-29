import { NextRequest, NextResponse } from 'next/server';
import { buildInviteHtml, inviteSubject, type InviteAppRole } from '@/lib/invites/template';

/**
 * POST /api/admin/send-invite
 * Sends a beta invite email. Currently supports:
 * - Resend (set RESEND_API_KEY env var)
 * - Falls back to 501 if no email service is configured
 *   (client-side will copy HTML+plain-text to clipboard instead)
 *
 * The email body is rendered from the shared template at
 * src/lib/invites/template.ts so the auto-sent path and the clipboard
 * fallback stay in lockstep.
 */
export async function POST(request: NextRequest) {
  try {
    const { to, name, role } = await request.json();

    if (!to || !name) {
      return NextResponse.json({ error: 'Missing to or name' }, { status: 400 });
    }

    const appRole: InviteAppRole = role === 'pm' ? 'pm' : role === 'pro' ? 'pro' : 'client';
    const htmlBody = buildInviteHtml({ name, role: appRole, to });

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
          subject: inviteSubject(),
          html: htmlBody,
        }),
      });

      if (res.ok) {
        return NextResponse.json({ sent: true, method: 'resend' });
      }
      console.error('Resend error:', await res.text());
    }

    return NextResponse.json(
      { sent: false, error: 'No email service configured. Invite copied to clipboard instead.' },
      { status: 501 },
    );
  } catch (err) {
    console.error('Send invite error:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
