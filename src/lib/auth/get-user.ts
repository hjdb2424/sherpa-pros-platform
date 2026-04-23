import { currentUser } from "@clerk/nextjs/server";
import type { UserRole } from "./roles";
import { isValidRole } from "./roles";

export interface AppUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole | null;
  imageUrl: string;
}

export async function getAppUser(): Promise<AppUser | null> {
  // Skip Clerk call when not configured (dev/preview)
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;

  try {
    const user = await currentUser();
    if (!user) return null;

    const role = user.publicMetadata?.role;

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      firstName: user.firstName,
      lastName: user.lastName,
      role: isValidRole(role) ? role : null,
      imageUrl: user.imageUrl,
    };
  } catch {
    return null;
  }
}

export async function getUserRole(): Promise<UserRole | null> {
  // Skip Clerk call when not configured (dev/preview)
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;

  try {
    const user = await currentUser();
    if (!user) return null;

    const role = user.publicMetadata?.role;
    return isValidRole(role) ? role : null;
  } catch {
    return null;
  }
}
