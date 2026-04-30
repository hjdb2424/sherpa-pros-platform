"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/lib/auth/roles";
import { isValidRole, getDashboardPath } from "@/lib/auth/roles";

export async function setUserRole(role: UserRole) {
  if (!isValidRole(role)) {
    throw new Error("Invalid role");
  }

  // Cookie-only role write. Other writers (sign-out, auth/callback) use
  // document.cookie, so keep httpOnly off here for symmetry.
  const cookieStore = await cookies();
  cookieStore.set("sherpa-role", role, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });

  redirect(getDashboardPath(role));
}
