export type UserRole = "pro" | "client";

export const ROLES = {
  PRO: "pro" as const,
  CLIENT: "client" as const,
};

export function isValidRole(role: unknown): role is UserRole {
  return role === ROLES.PRO || role === ROLES.CLIENT;
}

export function getDashboardPath(role: UserRole): string {
  return role === ROLES.PRO ? "/pro/dashboard" : "/client/dashboard";
}

export function getRoleLabel(role: UserRole): string {
  return role === ROLES.PRO ? "Pro" : "Client";
}
