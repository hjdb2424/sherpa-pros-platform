import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/env-check?debug=1
 *
 * Returns boolean presence of selected env vars (never values) so we can
 * verify which env vars are reaching the production runtime. Intended as
 * a temporary diagnostic — remove before public launch.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('debug') !== '1') {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    RESEND_API_KEY_length: (process.env.RESEND_API_KEY ?? '').length,
    DATABASE_URL: !!process.env.DATABASE_URL,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? null,
  });
}
