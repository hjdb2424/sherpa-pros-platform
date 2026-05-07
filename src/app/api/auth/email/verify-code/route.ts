import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/db/connection';
import { getAccessEntry, updateLastSignIn } from '@/lib/access-list';
import { validateCode } from '@/lib/auth/email-codes';

/**
 * POST /api/auth/email/verify-code
 *
 * Body: { email: string, code: string }
 *
 * Looks up the most-recent active row in `email_codes` for the email and
 * compares its hash against the supplied code. On success returns the
 * same shape as /api/auth/check-email so the existing client-side
 * sign-in flow can drop straight in.
 *
 * Errors (all 200 unless noted):
 *   400 { error: 'invalid_email' }                    — malformed email
 *   400 { error: 'invalid_body' }                     — missing fields
 *   200 { ok: false, error: 'code_expired' }          — newest active row past expiry
 *   200 { ok: false, error: 'code_consumed' }         — last issued code already used
 *   200 { ok: false, error: 'code_locked' }           — 5+ wrong attempts on this code
 *   200 { ok: false, error: 'invalid_code', attemptsLeft } — wrong code, attempts remain
 *   200 { ok: false, error: 'no_code' }               — no code requested for this email
 *   503 { error: 'service_unavailable' }              — DB error in prod
 *
 * Spec: docs/superpowers/specs/2026-05-07-email-otp-auth-design.md
 */

const MAX_ATTEMPTS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^\d{6}$/;

interface CodeRow {
  id: number;
  email: string;
  code_hash: string;
  expires_at: string;
  consumed_at: string | null;
  attempts: number;
  created_at: string;
}

interface AccessRow {
  email: string;
  name: string;
  default_role: string | null;
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown; code?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_body' },
      { status: 400 }
    );
  }

  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const code = typeof body.code === 'string' ? body.code.trim() : '';

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_email' },
      { status: 400 }
    );
  }
  if (!code || !CODE_RE.test(code)) {
    return NextResponse.json({ ok: false, error: 'invalid_code', attemptsLeft: 0 });
  }

  const isProd = process.env.NODE_ENV === 'production';

  // ── Find the most-recent code for this email ─────────────────────
  let row: CodeRow | null = null;
  try {
    const rows = await query<CodeRow>(
      `SELECT id, email, code_hash, expires_at, consumed_at, attempts, created_at
       FROM email_codes
       WHERE email = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );
    row = rows[0] ?? null;
  } catch (err) {
    if (isProd) {
      console.error('[verify-code] select failed:', err);
      return NextResponse.json(
        { ok: false, error: 'service_unavailable' },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: 'no_code' });
  }

  if (!row) {
    return NextResponse.json({ ok: false, error: 'no_code' });
  }

  // ── Lifecycle gates ──────────────────────────────────────────────
  if (row.consumed_at !== null) {
    return NextResponse.json({ ok: false, error: 'code_consumed' });
  }

  if (new Date(row.expires_at).getTime() <= Date.now()) {
    return NextResponse.json({ ok: false, error: 'code_expired' });
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json({ ok: false, error: 'code_locked' });
  }

  // ── Compare hashes ───────────────────────────────────────────────
  if (!validateCode(code, row.code_hash)) {
    const newAttempts = row.attempts + 1;
    try {
      await query(
        'UPDATE email_codes SET attempts = $1 WHERE id = $2',
        [newAttempts, row.id]
      );
    } catch (err) {
      console.error('[verify-code] increment attempts failed:', err);
      // Continue — better to over-grant attempts than lock the user out from
      // a transient DB blip. Spec prioritizes user-recoverable behavior.
    }
    if (newAttempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ ok: false, error: 'code_locked' });
    }
    return NextResponse.json({
      ok: false,
      error: 'invalid_code',
      attemptsLeft: MAX_ATTEMPTS - newAttempts,
    });
  }

  // ── Match: mark consumed, look up access_list, return user info ──
  try {
    await query(
      'UPDATE email_codes SET consumed_at = NOW() WHERE id = $1',
      [row.id]
    );
  } catch (err) {
    console.error('[verify-code] mark consumed failed:', err);
    // Don't bail — the user already authenticated. Worst case the same code
    // could be replayed within the 10-min window; rate limit + replay race
    // is acceptable per spec's threat model.
  }

  try {
    const accessRows = await query<AccessRow>(
      'SELECT email, name, default_role FROM access_list WHERE email = $1 AND status = $2',
      [email, 'active']
    );
    if (accessRows.length > 0) {
      const ar = accessRows[0];
      void updateLastSignIn(email);
      return NextResponse.json({
        ok: true,
        name: ar.name,
        defaultRole: ar.default_role ?? null,
      });
    }
    if (!isProd) {
      const fixture = getAccessEntry(email);
      if (fixture) {
        return NextResponse.json({
          ok: true,
          name: fixture.name,
          defaultRole: fixture.defaultRole,
        });
      }
    }
    // Edge case: code was issued but access entry was revoked between
    // request and verify. Treat as locked rather than leaking.
    return NextResponse.json({ ok: false, error: 'code_locked' });
  } catch (err) {
    if (isProd) {
      console.error('[verify-code] access_list lookup failed:', err);
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
    return NextResponse.json({ ok: false, error: 'code_locked' });
  }
}
