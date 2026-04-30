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
 *      beta tester (no admin link, role-switcher only). Falls through to
 *      Clerk's `currentUser()` if `sherpa-user` is absent.
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

  // Power-tester gate: read email from sherpa-user cookie or Clerk session.
  const email = await getSignedInEmail(cookieStore);
  if (isPowerTesterEmail(email)) {
    return <RoleSwitcherFab currentRole={currentRole} isAdmin={false} />;
  }

  return null;
}

async function getSignedInEmail(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<string | null> {
  // 1. Google/Apple OAuth path: email is JSON-encoded in the sherpa-user cookie.
  const userRaw = cookieStore.get("sherpa-user")?.value;
  if (userRaw) {
    try {
      const parsed = JSON.parse(userRaw) as { email?: string };
      if (parsed.email) return parsed.email;
    } catch {
      // fall through
    }
  }

  // 2. Clerk path: read from currentUser() if Clerk is configured.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    return user?.emailAddresses[0]?.emailAddress ?? null;
  } catch {
    return null;
  }
}
