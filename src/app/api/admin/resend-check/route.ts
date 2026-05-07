import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/resend-check?debug=1&to=email
 *
 * Calls Resend's API directly with a tiny test send and returns the
 * actual response from Resend. Lets us see exactly what error Resend
 * returns when sends are failing. Temporary diagnostic — remove before
 * public launch.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('debug') !== '1') {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const to = searchParams.get('to') ?? 'poum@hjd.builders';

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ stage: 'no-key', RESEND_API_KEY_present: false });
  }

  let resendStatus: number | null = null;
  let resendBody: string | null = null;
  let fetchErr: string | null = null;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Sherpa Pros <invite@thesherpapros.com>',
        to: [to],
        subject: '[debug] Resend diagnostic test',
        html: '<p>This is a diagnostic test from /api/admin/resend-check. Safe to ignore.</p>',
      }),
    });
    resendStatus = res.status;
    resendBody = await res.text();
  } catch (err) {
    fetchErr = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    stage: 'sent',
    to,
    from: 'Sherpa Pros <invite@thesherpapros.com>',
    resendStatus,
    resendBody: resendBody ? resendBody.slice(0, 500) : null,
    fetchErr,
  });
}
