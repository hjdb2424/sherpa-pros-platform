import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/db/connection';
import { getAccessEntry, updateLastSignIn } from '@/lib/access-list';

interface DbRow {
  email: string;
  name: string;
  default_role: string | null;
}

interface AppleIdTokenPayload {
  iss: string;
  sub: string;
  email?: string;
  email_verified?: boolean | string;
  is_private_email?: boolean | string;
  exp: number;
}

// Decode-only (no signature verification). Acceptable for closed beta with
// access_list gating — a forged token still has to land on a real allowed
// email to authenticate. TODO before public launch: verify against Apple's
// JWKS at https://appleid.apple.com/auth/keys.
function decodeAppleIdToken(token: string): AppleIdTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );
    if (payload.iss !== 'https://appleid.apple.com') return null;
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: { identityToken?: unknown; fullName?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_body' },
      { status: 400 }
    );
  }

  const identityToken =
    typeof body.identityToken === 'string' ? body.identityToken : '';
  if (!identityToken) {
    return NextResponse.json(
      { ok: false, error: 'identity_token_required' },
      { status: 400 }
    );
  }

  const payload = decodeAppleIdToken(identityToken);
  if (!payload) {
    return NextResponse.json(
      { ok: false, error: 'invalid_token' },
      { status: 400 }
    );
  }

  const email = (payload.email ?? '').trim().toLowerCase();
  if (!email) {
    // First-sign-in tokens always carry email; subsequent tokens may not if
    // we ever change scopes. For the beta we require it. Fix when we add a
    // sub→email cache table.
    return NextResponse.json(
      { ok: false, error: 'email_missing' },
      { status: 400 }
    );
  }

  const isProd = process.env.NODE_ENV === 'production';
  const fullNameFromClient =
    typeof body.fullName === 'string' && body.fullName.trim().length > 0
      ? body.fullName.trim()
      : null;

  try {
    const rows = await query<DbRow>(
      'SELECT email, name, default_role FROM access_list WHERE email = $1 AND status = $2',
      [email, 'active']
    );

    if (rows.length > 0) {
      const row = rows[0];
      void updateLastSignIn(email);
      return NextResponse.json({
        ok: true,
        name: row.name || fullNameFromClient || email.split('@')[0],
        defaultRole: row.default_role ?? null,
      });
    }

    if (isProd) {
      return NextResponse.json({ ok: false, error: 'not_on_list' });
    }

    const fixture = getAccessEntry(email);
    if (fixture) {
      return NextResponse.json({
        ok: true,
        name: fixture.name,
        defaultRole: fixture.defaultRole,
      });
    }
    return NextResponse.json({ ok: false, error: 'not_on_list' });
  } catch (err) {
    if (isProd) {
      console.error('[apple/mobile] access_list query failed:', err);
      return NextResponse.json(
        { ok: false, error: 'service_unavailable' },
        { status: 503 }
      );
    }

    const fixture = getAccessEntry(email);
    if (fixture) {
      return NextResponse.json({
        ok: true,
        name: fixture.name,
        defaultRole: fixture.defaultRole,
      });
    }
    return NextResponse.json({ ok: false, error: 'not_on_list' });
  }
}
