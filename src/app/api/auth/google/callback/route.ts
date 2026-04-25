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

    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

    // Redirect to a client-side bridge that sets localStorage from the cookie,
    // then forwards to role selection
    const params = new URLSearchParams({
      name: profile.name,
      email: profile.email,
      picture: profile.picture ?? '',
      provider: 'google',
    });

    const response = NextResponse.redirect(
      new URL(`/auth/callback?${params.toString()}`, base),
    );

    // Set auth cookie for server-side checks
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
