"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidRole, getDashboardPath, type UserRole } from "./roles";

/**
 * Power-User profile switcher. Lets a Sherpa Pros admin (Phyrom + future
 * staff) view any role's dashboard without losing their admin identity.
 *
 * Why a separate action from `setUserRole`: the public select-role flow
 * mutates Clerk publicMetadata so the user's "real" role is updated. The
 * admin switcher only flips the `sherpa-role` cookie — the underlying
 * Clerk identity stays whatever it is, and `sherpa-is-admin=true` keeps
 * /admin/* accessible from any role view.
 *
 * Gated entirely on the `sherpa-is-admin=true` cookie. The cookie is set
 * by /api/dev/grant-admin in development and by the admin-promotion path
 * in production. Non-admins calling this action get a 403-equivalent
 * (thrown error) — there is no UI surface that exposes it to them.
 */
export async function switchToRoleAsAdmin(role: UserRole) {
  if (!isValidRole(role)) {
    throw new Error("Invalid role");
  }

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("sherpa-is-admin")?.value === "true";
  if (!isAdmin) {
    throw new Error("Forbidden: admin cookie required");
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
