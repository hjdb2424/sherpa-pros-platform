/**
 * Multi-View Beta Tester allow-list.
 *
 * Emails listed here can flip between Pro / Client / PM / Tenant dashboards
 * via the Super Beta Tester FAB — the same switcher admins get — but they
 * do NOT get /admin/* access. Intended for 2-5 trusted IT / dev testers
 * during the beta window.
 *
 * Adding a tester:
 *   1. Append their (lowercased) email to POWER_TESTER_EMAILS.
 *   2. Commit + deploy. They'll see the FAB the next time they sign in.
 *
 * If this list outgrows ~5 entries, migrate to a DB column on access_list
 * and surface a checkbox on /admin/access-list.
 */

export const POWER_TESTER_EMAILS: ReadonlySet<string> = new Set<string>([
  // Add tester emails here, lowercased. Example:
  // "alice@example.com",
  // "bob@example.com",
]);

export function isPowerTesterEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return POWER_TESTER_EMAILS.has(email.trim().toLowerCase());
}
