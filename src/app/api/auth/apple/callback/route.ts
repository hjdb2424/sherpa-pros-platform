import { NextRequest, NextResponse } from 'next/server';
import { exchangeAppleCode, getAppleProfile } from '@/lib/auth/oauth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/sign-in?error=no_code', request.url),
    );
  }

  try {
    const tokens = await exchangeAppleCode(code);
    const profile = await getAppleProfile(tokens.idToken ?? '');

    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
    const response = NextResponse.redirect(new URL('/pro/dashboard', base));

    response.cookies.set('sherpa-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    response.cookies.set('sherpa-user', JSON.stringify({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      provider: 'apple',
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Apple OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/sign-in?error=apple_auth_failed', request.url),
    );
  }
}
