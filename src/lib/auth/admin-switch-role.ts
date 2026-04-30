"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidRole, getDashboardPath, type UserRole } from "./roles";
import { isPowerTesterEmail } from "./power-testers";

/**
 * Profile switcher for admins + multi-view beta testers. Lets a privileged
 * user view any role's dashboard without losing their underlying identity.
 *
 * Two acceptable signals (either is sufficient):
 *   1. `sherpa-is-admin=true` cookie — full admin.
 *   2. Signed-in email (from `sherpa-user` cookie) matches POWER_TESTER_EMAILS.
 *
 * Non-privileged callers get a thrown error. There is no UI surface that
 * exposes the FAB to them.
 */
export async function switchToRoleAsAdmin(role: UserRole) {
  if (!isValidRole(role)) {
    throw new Error("Invalid role");
  }

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("sherpa-is-admin")?.value === "true";
  const allowed = isAdmin || (await isCallerPowerTester(cookieStore));
  if (!allowed) {
    throw new Error("Forbidden: admin or multi-view tester required");
  }

  cookieStore.set("sherpa-role", role, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: true,
    httpOnly: false,
  });

  redirect(getDashboardPath(role));
}

async function isCallerPowerTester(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<boolean> {
  // Cookie-based email lookup. The Google/Apple OAuth callback writes
  // `sherpa-user` as JSON; if it's missing/unparseable, return false.
  const userRaw = cookieStore.get("sherpa-user")?.value;
  if (!userRaw) return false;
  try {
    const parsed = JSON.parse(userRaw) as { email?: string };
    return isPowerTesterEmail(parsed.email);
  } catch {
    return false;
  }
}
