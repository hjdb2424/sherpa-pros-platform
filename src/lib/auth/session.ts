/**
 * Session Helper — MVP Data Scoping
 *
 * Returns the current user context for filtering data.
 * For MVP: returns a mock session. In production this will
 * read from Clerk auth + database to resolve the full context.
 *
 * The 'sherpa-test-role' cookie/header can override the default
 * mock role for testing different user flows.
 */

import type { UserRole, UserSubtype } from './roles';

export interface UserSession {
  userId: string;
  role: UserRole;
  subtype: UserSubtype;
  email: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Mock user directory — maps roles to default test users
// ---------------------------------------------------------------------------

const MOCK_USERS: Record<UserRole, UserSession> = {
  pro: {
    userId: 'b1000000-0000-0000-0000-000000000001',
    role: 'pro',
    subtype: 'standard',
    email: 'user@test.com',
    name: 'Pro User',
  },
  client: {
    userId: 'c1000000-0000-0000-0000-000000000001',
    role: 'client',
    subtype: 'residential',
    email: 'user@test.com',
    name: 'Client User',
  },
  pm: {
    userId: 'p1000000-0000-0000-0000-000000000001',
    role: 'pm',
    subtype: null,
    email: 'user@test.com',
    name: 'PM User',
  },
};

import { userStorage } from '@/lib/user-storage';

function getStoredIdentity(): { name: string | null; email: string | null } {
  if (typeof window === 'undefined') return { name: null, email: null };
  try {
    const profile = userStorage.get('user-profile') as Record<string, string> | null;
    const name = profile?.fullName || profile?.name || profile?.companyName
      || localStorage.getItem('sherpa-test-name') || null;
    const email = localStorage.getItem('sherpa-test-email') || null;
    return { name, email };
  } catch {
    return { name: null, email: null };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get the current user session.
 *
 * For MVP this returns a mock user based on role.
 * Accepts an optional role override (e.g. from a request header or cookie)
 * so different dashboards can be tested.
 *
 * @param roleOverride - Force a specific role for testing
 */
export function getCurrentSession(roleOverride?: UserRole): UserSession {
  const role = roleOverride ?? 'pro';
  const base = MOCK_USERS[role];
  const { name, email } = getStoredIdentity();
  return {
    ...base,
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
  };
}

/**
 * Extract a role hint from a Request object.
 * Checks the 'x-sherpa-test-role' header first,
 * then falls back to the 'sherpa-test-role' cookie.
 */
export function getRoleFromRequest(request: Request): UserRole | undefined {
  // Header check
  const headerRole = request.headers.get('x-sherpa-test-role');
  if (headerRole === 'pro' || headerRole === 'client' || headerRole === 'pm') {
    return headerRole;
  }

  // Cookie check
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(/sherpa-test-role=(pro|client|pm)/);
  if (match) {
    return match[1] as UserRole;
  }

  return undefined;
}

/**
 * Get session from a request — combines role extraction + session lookup.
 */
export function getSessionFromRequest(request: Request): UserSession {
  const role = getRoleFromRequest(request);
  return getCurrentSession(role);
}

/**
 * Check if the session user owns a given resource.
 */
export function isOwner(resourceUserId: string, session: UserSession): boolean {
  return resourceUserId === session.userId;
}
