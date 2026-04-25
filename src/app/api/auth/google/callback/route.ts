import { NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCode, getGoogleProfile } from '@/lib/auth/oauth';
import { isEmailAllowedAsync, getAccessEntryAsync, updateLastSignIn } from '@/lib/access-list';

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

    // Check access list (DB-first with hardcoded fallback)
    const allowed = await isEmailAllowedAsync(profile.email);
    if (!allowed) {
      const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
      return NextResponse.redirect(
        new URL('/sign-in?error=not_on_list', base),
      );
    }

    const entry = await getAccessEntryAsync(profile.email);

    // Update last sign-in timestamp in the DB (fire and forget)
    updateLastSignIn(profile.email);

    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

    const params = new URLSearchParams({
      name: entry?.name ?? profile.name,
      email: profile.email,
      picture: profile.picture ?? '',
      provider: 'google',
      ...(entry?.defaultRole ? { role: entry.defaultRole } : {}),
    });

    const response = NextResponse.redirect(
      new URL(`/auth/callback?${params.toString()}`, base),
    );

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
      name: entry?.name ?? profile.name,
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
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Google OAuth callback error:', msg, err);
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
    return NextResponse.redirect(
      new URL(`/sign-in?error=google_auth_failed&detail=${encodeURIComponent(msg)}`, base),
    );
  }
}
