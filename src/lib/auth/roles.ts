export type UserRole = "pro" | "client" | "pm" | "tenant";

export const ROLES = {
  PRO: "pro" as const,
  CLIENT: "client" as const,
  PM: "pm" as const,
  TENANT: "tenant" as const,
};

export function isValidRole(role: unknown): role is UserRole {
  return role === ROLES.PRO || role === ROLES.CLIENT || role === ROLES.PM || role === ROLES.TENANT;
}

export function getDashboardPath(role: UserRole): string {
  if (role === ROLES.PM) return "/pm/dashboard";
  if (role === ROLES.TENANT) return "/tenant/dashboard";
  return role === ROLES.PRO ? "/pro/dashboard" : "/client/dashboard";
}

export function getRoleLabel(role: UserRole): string {
  if (role === ROLES.PM) return "Property Manager";
  if (role === ROLES.TENANT) return "Tenant";
  return role === ROLES.PRO ? "Pro" : "Client";
}
