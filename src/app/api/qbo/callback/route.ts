import { NextRequest, NextResponse } from 'next/server';
import { exchangeQBOCode } from '@/lib/services/quickbooks';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const realmId = searchParams.get('realmId');

  if (!code) {
    return NextResponse.redirect(
      new URL('/pro/dashboard?qbo=error&reason=no_code', request.url),
    );
  }

  try {
    const tokens = await exchangeQBOCode(code);

    // Override realmId from URL if present
    if (realmId) {
      tokens.realmId = realmId;
    }

    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
    const response = NextResponse.redirect(
      new URL('/pro/dashboard?qbo=connected', base),
    );

    // Store QBO tokens in a cookie (in production, store encrypted in DB)
    response.cookies.set('sherpa-qbo', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90, // 90 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('QBO OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/pro/dashboard?qbo=error&reason=auth_failed', request.url),
    );
  }
}
