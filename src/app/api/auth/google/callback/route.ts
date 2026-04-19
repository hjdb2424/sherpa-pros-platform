import { NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCode, getGoogleProfile } from '@/lib/auth/oauth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/sign-in?error=no_code', request.url),
    );
  }

  try {
    const tokens = await exchangeGoogleCode(code);
    const profile = await getGoogleProfile(tokens.accessToken);

    // In production, create/find user in DB and set a session cookie.
    // For now, redirect to role selection or dashboard with profile info
    // stored in a short-lived cookie.
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
    const response = NextResponse.redirect(new URL('/pro/dashboard', base));

    // Set auth session data as cookies (in production, use encrypted sessions)
    response.cookies.set('sherpa-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    response.cookies.set('sherpa-user', JSON.stringify({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      provider: 'google',
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/sign-in?error=google_auth_failed', request.url),
    );
  }
}
