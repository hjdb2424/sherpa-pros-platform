import { getAppUser } from "./get-user";

export type DataroomAccessState =
  | "granted"
  | "signed_in_no_access"
  | "not_signed_in";

/**
 * Investor data room access check.
 *
 * Orthogonal to the pro/client/pm role hierarchy — investors aren't operating
 * the marketplace. Granted by `sherpa-dataroom=true` cookie (set by the OAuth
 * callback for emails on the dataroom allow-list).
 *
 * Returns three states so the route handler can render the right UI:
 *   - "granted"             → serve the requested file
 *   - "signed_in_no_access" → show a 403 "request access" page
 *   - "not_signed_in"       → redirect to /sign-in
 */
export async function getDataroomAccessState(): Promise<DataroomAccessState> {
  const user = await getAppUser();
  if (!user) return "not_signed_in";

  // Cookie-based gate. Mirrors the pattern used by sherpa-is-admin.
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const granted = cookieStore.get("sherpa-dataroom")?.value === "true";
  return granted ? "granted" : "signed_in_no_access";
}

/** Convenience boolean check; preserved for backward compat. */
export async function hasDataroomAccess(): Promise<boolean> {
  return (await getDataroomAccessState()) === "granted";
}
