import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/db/connection';
import { getAccessEntry } from '@/lib/access-list';

interface DbRow {
  email: string;
  name: string;
  default_role: string | null;
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown };
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
  if (!email) {
    return NextResponse.json(
      { ok: false, error: 'email_required' },
      { status: 400 }
    );
  }

  const isProd = process.env.NODE_ENV === 'production';

  try {
    const rows = await query<DbRow>(
      'SELECT email, name, default_role FROM access_list WHERE email = $1 AND status = $2',
      [email, 'active']
    );

    if (rows.length > 0) {
      const row = rows[0];
      return NextResponse.json({
        ok: true,
        name: row.name,
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
      console.error('[check-email] access_list query failed:', err);
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
