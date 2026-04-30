import { cookies } from "next/headers";
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

/**
 * Cookie-based user lookup. Reads `sherpa-user` (JSON, set by Google OAuth
 * callback) for identity and `sherpa-role` for the active role.
 *
 * Returns null when the user cookie is missing or unparseable.
 */
export async function getAppUser(): Promise<AppUser | null> {
  try {
    const cookieStore = await cookies();
    const userRaw = cookieStore.get("sherpa-user")?.value;
    if (!userRaw) return null;

    let parsed: {
      id?: string;
      email?: string;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      imageUrl?: string;
      picture?: string;
    };
    try {
      parsed = JSON.parse(userRaw);
    } catch {
      return null;
    }

    if (!parsed.email) return null;

    const roleCookie = cookieStore.get("sherpa-role")?.value;
    const role = isValidRole(roleCookie) ? roleCookie : null;

    // Best-effort first/last split if only `name` is present.
    let firstName: string | null = parsed.firstName ?? null;
    let lastName: string | null = parsed.lastName ?? null;
    if (!firstName && !lastName && parsed.name) {
      const parts = parsed.name.trim().split(/\s+/);
      firstName = parts[0] ?? null;
      lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;
    }

    return {
      id: parsed.id ?? parsed.email,
      email: parsed.email,
      firstName,
      lastName,
      role,
      imageUrl: parsed.imageUrl ?? parsed.picture ?? "",
    };
  } catch {
    return null;
  }
}

export async function getUserRole(): Promise<UserRole | null> {
  try {
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get("sherpa-role")?.value;
    return isValidRole(roleCookie) ? roleCookie : null;
  } catch {
    return null;
  }
}
