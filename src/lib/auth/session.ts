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
    email: 'mike.wilson@example.com',
    name: 'Mike Wilson',
  },
  client: {
    userId: 'c1000000-0000-0000-0000-000000000001',
    role: 'client',
    subtype: 'residential',
    email: 'phyrom@hjd.builders',
    name: 'Phyrom',
  },
  pm: {
    userId: 'p1000000-0000-0000-0000-000000000001',
    role: 'pm',
    subtype: null,
    email: 'dana.pm@example.com',
    name: 'Dana Kim',
  },
};

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
  return MOCK_USERS[role];
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
