import { cookies } from "next/headers";
import RoleSwitcherFab from "./RoleSwitcherFab";
import { isValidRole, type UserRole } from "@/lib/auth/roles";

/**
 * Renders the Super Beta Tester role switcher FAB if (and only if) the
 * caller has the `sherpa-is-admin=true` cookie. Read on the server so the
 * FAB markup never reaches non-admin users.
 */
export default async function RoleSwitcherMount() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("sherpa-is-admin")?.value === "true";
  if (!isAdmin) return null;

  const roleCookie = cookieStore.get("sherpa-role")?.value;
  const currentRole: UserRole | null = isValidRole(roleCookie) ? roleCookie : null;

  return <RoleSwitcherFab currentRole={currentRole} />;
}
