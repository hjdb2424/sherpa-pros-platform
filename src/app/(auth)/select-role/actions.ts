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

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role },
  });

  // Mirror role to a cookie so proxy.ts's enforceRBAC can authorize the
  // immediately-following request without round-tripping to Clerk for metadata.
  const cookieStore = await cookies();
  cookieStore.set("sherpa-role", role, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: true,
    httpOnly: false,
  });

  redirect(getDashboardPath(role));
}
