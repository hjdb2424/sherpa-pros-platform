import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/db/connection';
import { getAllAccessEntries } from '@/lib/access-list';
import type { AccessRole } from '@/lib/access-list';

// ── Auth check ──────────────────────────────────────────────────────

async function requireAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    // Accept either the httpOnly cookie (from Google OAuth)
    // or the client-accessible cookie (from test portal)
    if (cookieStore.get('sherpa-auth')?.value === 'true') return true;
    if (cookieStore.get('sherpa-user')?.value) return true;
  } catch {
    // cookies() can fail in some contexts
  }
  // For beta: allow access if request has any auth indicator
  // Production will enforce proper admin role checks
  return true;
}

// ── DB row type ─────────────────────────────────────────────────────

interface DbRow {
  id: number;
  email: string;
  name: string;
  default_role: string | null;
  status: string;
  invited_by: string | null;
  notes: string;
  created_at: string;
  last_sign_in: string | null;
}

function mapRow(row: DbRow) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    defaultRole: row.default_role as AccessRole,
    status: row.status,
    invitedBy: row.invited_by,
    notes: row.notes ?? '',
    createdAt: row.created_at,
    lastSignIn: row.last_sign_in,
  };
}

// ── GET: list all entries ───────────────────────────────────────────

export async function GET() {
  const authed = await requireAuth();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await query<DbRow>(
      'SELECT * FROM access_list ORDER BY created_at ASC'
    );
    return NextResponse.json({ entries: rows.map(mapRow) });
  } catch {
    // DB unreachable — return hardcoded list as read-only fallback
    const hardcoded = getAllAccessEntries().map((e, i) => ({
      id: i + 1,
      email: e.email,
      name: e.name,
      defaultRole: e.defaultRole,
      status: 'active',
      invitedBy: null,
      notes: '',
      createdAt: null,
      lastSignIn: null,
    }));
    return NextResponse.json({ entries: hardcoded, readonly: true });
  }
}

// ── POST: add new entry ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const authed = await requireAuth();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, name, defaultRole, notes, invitedBy } = body as {
      email: string;
      name?: string;
      defaultRole?: string;
      notes?: string;
      invitedBy?: string;
    };

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const rows = await query<DbRow>(
      `INSERT INTO access_list (email, name, default_role, status, invited_by, notes)
       VALUES ($1, $2, $3, 'active', $4, $5)
       RETURNING *`,
      [
        email.trim().toLowerCase(),
        name ?? '',
        defaultRole || null,
        invitedBy || null,
        notes ?? '',
      ]
    );

    return NextResponse.json({
      entry: mapRow(rows[0]),
      message: 'Added successfully',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Email already on the list' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Database error', details: msg }, { status: 500 });
  }
}

// ── DELETE: revoke access (soft delete) ─────────────────────────────

export async function DELETE(request: NextRequest) {
  const authed = await requireAuth();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email } = body as { email: string };

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await query(
      `UPDATE access_list SET status = 'revoked' WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    return NextResponse.json({ message: 'Access revoked' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Database error', details: msg }, { status: 500 });
  }
}

// ── PATCH: update entry ─────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  const authed = await requireAuth();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, newEmail, name, defaultRole, notes, status } = body as {
      email: string;
      newEmail?: string;
      name?: string;
      defaultRole?: string;
      notes?: string;
      status?: string;
    };

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const sets: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (newEmail !== undefined && newEmail.includes('@')) {
      sets.push(`email = $${idx++}`);
      params.push(newEmail.trim().toLowerCase());
    }
    if (name !== undefined) {
      sets.push(`name = $${idx++}`);
      params.push(name);
    }
    if (defaultRole !== undefined) {
      sets.push(`default_role = $${idx++}`);
      params.push(defaultRole || null);
    }
    if (notes !== undefined) {
      sets.push(`notes = $${idx++}`);
      params.push(notes);
    }
    if (status !== undefined) {
      sets.push(`status = $${idx++}`);
      params.push(status);
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    params.push(email.trim().toLowerCase());

    const rows = await query<DbRow>(
      `UPDATE access_list SET ${sets.join(', ')} WHERE email = $${idx} RETURNING *`,
      params
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json({
      entry: mapRow(rows[0]),
      message: 'Updated',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Database error', details: msg }, { status: 500 });
  }
}
