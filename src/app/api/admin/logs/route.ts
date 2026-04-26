import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuditLogs, ALL_AUDIT_ACTIONS } from '@/lib/audit';
import type { AuditAction } from '@/lib/audit';

// ── Auth check (matches access-list pattern) ────────────────────────

async function requireAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('sherpa-auth')?.value === 'true') return true;
    if (cookieStore.get('sherpa-user')?.value) return true;
  } catch {
    // cookies() can fail in some contexts
  }
  // For beta: allow access
  return true;
}

// ── GET: return filtered audit logs ─────────────────────────────────

export async function GET(request: NextRequest) {
  const authed = await requireAuth();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;

  const actionParam = searchParams.get('action') ?? undefined;
  const action = actionParam && ALL_AUDIT_ACTIONS.includes(actionParam as AuditAction)
    ? (actionParam as AuditAction)
    : undefined;

  const email = searchParams.get('email') ?? undefined;
  const days = searchParams.get('days') ? Number(searchParams.get('days')) : undefined;
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 25;

  const result = getAuditLogs({ action, email, days, page, limit });

  return NextResponse.json(result);
}
