import { currentUser } from "@clerk/nextjs/server";

/**
 * Investor data room access check.
 *
 * Orthogonal to the pro/client/pm role hierarchy — investors aren't operating
 * the marketplace. Granted via Clerk publicMetadata: `{ dataroom: true }`.
 *
 * To grant access:
 *   1. Open Clerk dashboard → Users → select investor
 *   2. Edit Public metadata → add: { "dataroom": true }
 *   3. Save. Access is immediate; no server restart needed.
 *
 * To revoke: set `dataroom: false` or remove the key.
 */
export async function hasDataroomAccess(): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return false;

  try {
    const user = await currentUser();
    if (!user) return false;
    return user.publicMetadata?.dataroom === true;
  } catch {
    return false;
  }
}
