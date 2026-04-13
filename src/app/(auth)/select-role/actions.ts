"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
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

  redirect(getDashboardPath(role));
}
