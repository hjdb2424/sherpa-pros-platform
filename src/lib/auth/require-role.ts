import { redirect } from "next/navigation";
import type { UserRole } from "./roles";
import { getAppUser } from "./get-user";

/**
 * Require a specific role for a page. Redirects if:
 * - User is not signed in -> /sign-in
 * - User has no role selected -> /select-role
 * - User has wrong role -> their correct dashboard
 */
export async function requireRole(requiredRole: UserRole) {
  const user = await getAppUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.role) {
    redirect("/select-role");
  }

  if (user.role !== requiredRole) {
    redirect(
      user.role === "pro" ? "/pro/dashboard" : "/client/dashboard"
    );
  }

  return user;
}
