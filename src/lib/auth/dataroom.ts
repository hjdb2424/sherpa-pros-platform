import { currentUser } from "@clerk/nextjs/server";

export type DataroomAccessState =
  | "granted"
  | "signed_in_no_access"
  | "not_signed_in";

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
 *
 * Returns three states so the route handler can render the right UI:
 *   - "granted"             → serve the requested file
 *   - "signed_in_no_access" → show a 403 "request access" page
 *   - "not_signed_in"       → redirect to /sign-in
 */
export async function getDataroomAccessState(): Promise<DataroomAccessState> {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return "not_signed_in";

  try {
    const user = await currentUser();
    if (!user) return "not_signed_in";
    return user.publicMetadata?.dataroom === true
      ? "granted"
      : "signed_in_no_access";
  } catch {
    return "not_signed_in";
  }
}

/** Convenience boolean check; preserved for backward compat. */
export async function hasDataroomAccess(): Promise<boolean> {
  return (await getDataroomAccessState()) === "granted";
}
