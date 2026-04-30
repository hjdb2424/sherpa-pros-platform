"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidRole, getDashboardPath, type UserRole } from "./roles";
import { isPowerTesterEmail } from "./power-testers";

/**
 * Profile switcher for admins + multi-view beta testers. Lets a privileged
 * user view any role's dashboard without losing their underlying identity.
 *
 * Why a separate action from `setUserRole`: the public select-role flow
 * mutates Clerk publicMetadata so the user's "real" role is updated. This
 * action only flips the `sherpa-role` cookie — the underlying Clerk
 * identity stays whatever it is.
 *
 * Two acceptable signals (either is sufficient):
 *   1. `sherpa-is-admin=true` cookie — full admin.
 *   2. Signed-in email matches POWER_TESTER_EMAILS — beta multi-view tester.
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
  // Same email-resolution order as RoleSwitcherMount: sherpa-user cookie
  // first (Google/Apple OAuth path), then Clerk currentUser() if configured.
  const userRaw = cookieStore.get("sherpa-user")?.value;
  if (userRaw) {
    try {
      const parsed = JSON.parse(userRaw) as { email?: string };
      if (isPowerTesterEmail(parsed.email)) return true;
    } catch {
      // fall through
    }
  }

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return false;
  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    if (!user) return false;
    // Prefer the verified primary email; fall back to first address.
    const primary = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId,
    );
    const email =
      primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
    return isPowerTesterEmail(email);
  } catch {
    return false;
  }
}
