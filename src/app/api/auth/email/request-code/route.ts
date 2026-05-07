import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/db/connection';
import { getAccessEntry } from '@/lib/access-list';
import { generateCode, hashCode } from '@/lib/auth/email-codes';
import { sendOtpEmail } from '@/lib/auth/email-sender';

/**
 * POST /api/auth/email/request-code
 *
 * Body: { email: string }
 *
 * Generates a 6-digit OTP, hashes it, stores the hash with a 10-minute
 * expiry, and emails the plaintext code to the user via Resend — but ONLY
 * if the email is on the active access_list. Returns 200 `{ ok: true }`
 * regardless of access_list membership to prevent email enumeration.
 *
 * Rate limit: 5 requests per email per hour.
 *
 * Errors:
 *   400 { error: 'invalid_email' }       — malformed email
 *   429 { error: 'too_many_requests' }   — rate-limit hit
 *   503 { error: 'service_unavailable' } — DB error in prod
 *
 * Spec: docs/superpowers/specs/2026-05-07-email-otp-auth-design.md
 */

const EXPIRY_MINUTES = 10;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_HOURS = 1;
// Loose RFC-5322-ish format check — a syntactic gate, not a verifier.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AccessRow {
  email: string;
  name: string;
  default_role: string | null;
}

interface RateRow {
  count: string;
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_email' },
      { status: 400 }
    );
  }

  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_email' },
      { status: 400 }
    );
  }

  const isProd = process.env.NODE_ENV === 'production';

  // ── Rate limit check ──────────────────────────────────────────────
  try {
    const rate = await query<RateRow>(
      `SELECT COUNT(*)::text AS count FROM email_codes
       WHERE email = $1
         AND created_at > NOW() - INTERVAL '${RATE_LIMIT_WINDOW_HOURS} hour'`,
      [email]
    );
    const count = rate.length > 0 ? Number(rate[0].count) : 0;
    if (count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { ok: false, error: 'too_many_requests' },
        { status: 429 }
      );
    }
  } catch (err) {
    if (isProd) {
      console.error('[request-code] rate-limit query failed:', err);
      return NextResponse.json(
        { ok: false, error: 'service_unavailable' },
        { status: 503 }
      );
    }
    // Dev: continue past rate-limit failure
  }

  // ── Look up access_list (don't leak membership) ───────────────────
  let onAccessList = false;
  let displayName: string | undefined;
  try {
    const rows = await query<AccessRow>(
      'SELECT email, name, default_role FROM access_list WHERE email = $1 AND status = $2',
      [email, 'active']
    );
    if (rows.length > 0) {
      onAccessList = true;
      displayName = rows[0].name;
    } else if (!isProd) {
      const fixture = getAccessEntry(email);
      if (fixture) {
        onAccessList = true;
        displayName = fixture.name;
      }
    }
  } catch (err) {
    if (isProd) {
      console.error('[request-code] access_list query failed:', err);
      return NextResponse.json(
        { ok: false, error: 'service_unavailable' },
        { status: 503 }
      );
    }
    const fixture = getAccessEntry(email);
    if (fixture) {
      onAccessList = true;
      displayName = fixture.name;
    }
  }

  // ── If not on access list, return ok:true silently (no DB write, no email) ──
  if (!onAccessList) {
    return NextResponse.json({ ok: true });
  }

  // ── Generate, hash, store, send ───────────────────────────────────
  const code = generateCode();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  try {
    await query(
      `INSERT INTO email_codes (email, code_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [email, codeHash, expiresAt.toISOString()]
    );
  } catch (err) {
    if (isProd) {
      console.error('[request-code] insert failed:', err);
      return NextResponse.json(
        { ok: false, error: 'service_unavailable' },
        { status: 503 }
      );
    }
    // Dev: surface as ok so flow continues with console-logged code below
  }

  // Resend failure does NOT change the response — fail-soft per spec.
  await sendOtpEmail({ to: email, code, name: displayName });

  return NextResponse.json({ ok: true });
}
