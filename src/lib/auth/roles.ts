export type UserRole = "pro" | "client" | "pm";

export const ROLES = {
  PRO: "pro" as const,
  CLIENT: "client" as const,
  PM: "pm" as const,
};

export function isValidRole(role: unknown): role is UserRole {
  return role === ROLES.PRO || role === ROLES.CLIENT || role === ROLES.PM;
}

export function getDashboardPath(role: UserRole): string {
  if (role === ROLES.PM) return "/pm/dashboard";
  return role === ROLES.PRO ? "/pro/dashboard" : "/client/dashboard";
}

export function getRoleLabel(role: UserRole): string {
  if (role === ROLES.PM) return "Property Manager";
  return role === ROLES.PRO ? "Pro" : "Client";
}
