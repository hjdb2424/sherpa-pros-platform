"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/lib/auth/roles";
import { isValidRole, getDashboardPath } from "@/lib/auth/roles";

export async function setUserRole(role: UserRole) {
  if (!isValidRole(role)) {
    throw new Error("Invalid role");
  }

  const [{ userId }, client] = await Promise.all([auth(), clerkClient()]);
  if (!userId) {
    redirect("/sign-in");
  }

  await client.users.updateUser(userId, {
    publicMetadata: { role },
  });

  // TODO(auth): Clerk publicMetadata is the source of truth; this cookie is
  // a perf cache so proxy.ts can authorize without round-tripping. Sign-ins
  // on a fresh device will lack the cookie — middleware should read the
  // role from auth().sessionClaims and lazily backfill the cookie.
  // Other writers (sign-out, auth/callback) use document.cookie, so keep
  // httpOnly off here for symmetry until that migration happens.
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
