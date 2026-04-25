/**
 * Beta Access List — database-backed with hardcoded fallback.
 *
 * Exports:
 *   isEmailAllowed(email)       — sync, uses hardcoded list (for client-side / fast checks)
 *   isEmailAllowedAsync(email)  — async, queries DB first, falls back to hardcoded
 *   getAccessEntry(email)       — sync, from hardcoded list
 *   getAccessEntryAsync(email)  — async, full entry from DB with fallback
 *   getAllAccessEntries()        — sync, hardcoded list
 *   getAllAccessEntriesAsync()   — async, from DB with fallback
 *   updateLastSignIn(email)     — async, updates last_sign_in in DB
 */

import { query } from '@/db/connection';

export type AccessRole = 'pm' | 'pro' | 'client' | 'tenant' | null;

export interface AccessEntry {
  email: string;
  name: string;
  defaultRole: AccessRole; // null = let them choose at /select-role
}

export interface AccessEntryFull extends AccessEntry {
  id: number;
  status: 'active' | 'revoked';
  invitedBy: string | null;
  notes: string;
  createdAt: string;
  lastSignIn: string | null;
}

// ── Hardcoded fallback list (never remove) ──────────────────────────

const ACCESS_LIST: AccessEntry[] = [
  // ── Founders / Team ──
  { email: 'poum@hjd.builders', name: 'Phyrom', defaultRole: null },

  // ── PM Beta Testers ──
  { email: 'lisa.park@test.com', name: 'Lisa Park', defaultRole: 'pm' },
  { email: 'david.chen@test.com', name: 'David Chen', defaultRole: 'pm' },
  { email: 'rachel.torres@test.com', name: 'Rachel Torres', defaultRole: 'pm' },

  // ── Pro Beta Testers ──
  { email: 'mike.rodriguez@test.com', name: 'Mike Rodriguez', defaultRole: 'pro' },
  { email: 'james.wilson@test.com', name: 'James Wilson', defaultRole: 'pro' },
  { email: 'sarah.chen@test.com', name: 'Sarah Chen', defaultRole: 'pro' },
  { email: 'carlos.rivera@test.com', name: 'Carlos Rivera', defaultRole: 'pro' },
  { email: 'diana.brooks@test.com', name: 'Diana Brooks', defaultRole: 'pro' },
  { email: 'tom.sullivan@test.com', name: 'Tom Sullivan', defaultRole: 'pro' },
  { email: 'maria.santos@test.com', name: 'Maria Santos', defaultRole: 'pro' },
  { email: 'kevin.obrien@test.com', name: "Kevin O'Brien", defaultRole: 'pro' },
  { email: 'andre.mitchell@test.com', name: 'Andre Mitchell', defaultRole: 'pro' },
  { email: 'jenny.kim@test.com', name: 'Jenny Kim', defaultRole: 'pro' },

  // ── Client Beta Testers ──
  { email: 'jamie.davis@test.com', name: 'Jamie Davis', defaultRole: 'client' },
  { email: 'alex.rivera@test.com', name: 'Alex Rivera', defaultRole: 'client' },
  { email: 'morgan.lee@test.com', name: 'Morgan Lee', defaultRole: 'client' },
  { email: 'sam.patel@test.com', name: 'Sam Patel', defaultRole: 'client' },
  { email: 'chris.thompson@test.com', name: 'Chris Thompson', defaultRole: 'client' },
  { email: 'taylor.kim@test.com', name: 'Taylor Kim', defaultRole: 'client' },
  { email: 'jordan.williams@test.com', name: 'Jordan Williams', defaultRole: 'client' },
  { email: 'casey.martin@test.com', name: 'Casey Martin', defaultRole: 'client' },
  { email: 'riley.anderson@test.com', name: 'Riley Anderson', defaultRole: 'client' },
  { email: 'avery.brown@test.com', name: 'Avery Brown', defaultRole: 'client' },
];

// Normalized lookup map
const EMAIL_MAP = new Map<string, AccessEntry>(
  ACCESS_LIST.map((entry) => [entry.email.toLowerCase(), entry])
);

// ── DB row → AccessEntryFull mapper ─────────────────────────────────

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

function mapRow(row: DbRow): AccessEntryFull {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    defaultRole: (row.default_role as AccessRole) ?? null,
    status: row.status as 'active' | 'revoked',
    invitedBy: row.invited_by,
    notes: row.notes ?? '',
    createdAt: row.created_at,
    lastSignIn: row.last_sign_in,
  };
}

// ── Sync functions (hardcoded fallback, safe for client-side) ───────

/** Check if an email is on the access list (sync, hardcoded) */
export function isEmailAllowed(email: string): boolean {
  return EMAIL_MAP.has(email.trim().toLowerCase());
}

/** Get the access entry for an email (sync, hardcoded) */
export function getAccessEntry(email: string): AccessEntry | null {
  return EMAIL_MAP.get(email.trim().toLowerCase()) ?? null;
}

/** Get all entries (sync, hardcoded) */
export function getAllAccessEntries(): AccessEntry[] {
  return [...ACCESS_LIST];
}

// ── Async functions (DB-first with hardcoded fallback) ──────────────

/** Check if an email is allowed (async, DB-first) */
export async function isEmailAllowedAsync(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  try {
    const rows = await query<DbRow>(
      'SELECT * FROM access_list WHERE email = $1 AND status = $2',
      [normalized, 'active']
    );
    if (rows.length > 0) return true;
    // DB reachable but email not found — still check hardcoded as fallback
    return EMAIL_MAP.has(normalized);
  } catch {
    // DB unreachable — fall back to hardcoded list
    return EMAIL_MAP.has(normalized);
  }
}

/** Get the full access entry (async, DB-first) */
export async function getAccessEntryAsync(email: string): Promise<AccessEntryFull | AccessEntry | null> {
  const normalized = email.trim().toLowerCase();
  try {
    const rows = await query<DbRow>(
      'SELECT * FROM access_list WHERE email = $1 AND status = $2',
      [normalized, 'active']
    );
    if (rows.length > 0) return mapRow(rows[0]);
    // DB reachable but not found — check hardcoded
    return EMAIL_MAP.get(normalized) ?? null;
  } catch {
    return EMAIL_MAP.get(normalized) ?? null;
  }
}

/** Get all access entries (async, DB-first) */
export async function getAllAccessEntriesAsync(): Promise<AccessEntryFull[]> {
  try {
    const rows = await query<DbRow>(
      'SELECT * FROM access_list ORDER BY created_at ASC'
    );
    return rows.map(mapRow);
  } catch {
    // Return hardcoded list shaped as AccessEntryFull
    return ACCESS_LIST.map((entry, i) => ({
      ...entry,
      id: i + 1,
      status: 'active' as const,
      invitedBy: null,
      notes: '',
      createdAt: new Date().toISOString(),
      lastSignIn: null,
    }));
  }
}

/** Update last_sign_in timestamp (fire and forget) */
export async function updateLastSignIn(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  try {
    await query(
      'UPDATE access_list SET last_sign_in = NOW() WHERE email = $1',
      [normalized]
    );
  } catch {
    // Silently fail — sign-in should not block on telemetry
  }
}
