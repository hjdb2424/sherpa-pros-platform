import { cookies } from "next/headers";
import RoleSwitcherFab from "./RoleSwitcherFab";
import { isValidRole, type UserRole } from "@/lib/auth/roles";
import { isPowerTesterEmail } from "@/lib/auth/power-testers";

/**
 * Renders the Super Beta Tester role switcher FAB if (and only if) the
 * caller is an admin or a multi-view beta tester.
 *
 * Two gates, in priority order:
 *   1. `sherpa-is-admin=true` cookie — full admin (sees Admin Home link).
 *   2. `sherpa-user` cookie email matches POWER_TESTER_EMAILS — multi-view
 *      beta tester (no admin link, role-switcher only).
 *
 * Read entirely server-side so non-privileged users never receive the
 * FAB markup at all.
 */
export default async function RoleSwitcherMount() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("sherpa-is-admin")?.value === "true";

  const roleCookie = cookieStore.get("sherpa-role")?.value;
  const currentRole: UserRole | null = isValidRole(roleCookie) ? roleCookie : null;

  if (isAdmin) {
    return <RoleSwitcherFab currentRole={currentRole} isAdmin={true} />;
  }

  // Power-tester gate: read email from sherpa-user cookie only.
  const email = getSignedInEmail(cookieStore);
  if (isPowerTesterEmail(email)) {
    return <RoleSwitcherFab currentRole={currentRole} isAdmin={false} />;
  }

  return null;
}

function getSignedInEmail(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): string | null {
  const userRaw = cookieStore.get("sherpa-user")?.value;
  if (!userRaw) return null;
  try {
    const parsed = JSON.parse(userRaw) as { email?: string };
    return parsed.email ?? null;
  } catch {
    return null;
  }
}
