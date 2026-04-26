// ---------------------------------------------------------------------------
// Role + Subtype Model — Sherpa Pros Platform
//
// 3 base roles: pro, client, pm
// Subtypes add granularity for commission rates, UI, and routing.
// ---------------------------------------------------------------------------

export type UserRole = "pro" | "client" | "pm";
export type ClientSubtype = "residential" | "residential_pro" | "commercial";
export type ProSubtype = "standard" | "flex";
export type UserSubtype = ClientSubtype | ProSubtype | null;

export const ROLES = {
  PRO: "pro" as const,
  CLIENT: "client" as const,
  PM: "pm" as const,
};

export const SUBTYPES = {
  CLIENT_RESIDENTIAL: "residential" as const,
  CLIENT_RESIDENTIAL_PRO: "residential_pro" as const,
  CLIENT_COMMERCIAL: "commercial" as const,
  PRO_STANDARD: "standard" as const,
  PRO_FLEX: "flex" as const,
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_ROLES: ReadonlySet<string> = new Set([ROLES.PRO, ROLES.CLIENT, ROLES.PM]);

const VALID_SUBTYPES: ReadonlySet<string> = new Set([
  SUBTYPES.CLIENT_RESIDENTIAL,
  SUBTYPES.CLIENT_RESIDENTIAL_PRO,
  SUBTYPES.CLIENT_COMMERCIAL,
  SUBTYPES.PRO_STANDARD,
  SUBTYPES.PRO_FLEX,
]);

const ROLE_SUBTYPES: Record<UserRole, ReadonlySet<string> | null> = {
  pro: new Set([SUBTYPES.PRO_STANDARD, SUBTYPES.PRO_FLEX]),
  client: new Set([SUBTYPES.CLIENT_RESIDENTIAL, SUBTYPES.CLIENT_RESIDENTIAL_PRO, SUBTYPES.CLIENT_COMMERCIAL]),
  pm: null, // PM has no subtypes
};

export function isValidRole(role: unknown): role is UserRole {
  return typeof role === "string" && VALID_ROLES.has(role);
}

export function isValidSubtype(subtype: unknown): subtype is UserSubtype {
  if (subtype === null || subtype === undefined) return true;
  return typeof subtype === "string" && VALID_SUBTYPES.has(subtype);
}

export function isValidSubtypeForRole(role: UserRole, subtype: UserSubtype): boolean {
  const allowed = ROLE_SUBTYPES[role];
  if (!allowed) return subtype === null;
  if (subtype === null) return true; // subtype not yet selected is OK
  return allowed.has(subtype);
}

// ---------------------------------------------------------------------------
// Dashboard routing
// ---------------------------------------------------------------------------

export function getDashboardPath(role: UserRole): string {
  if (role === ROLES.PM) return "/pm/dashboard";
  return role === ROLES.PRO ? "/pro/dashboard" : "/client/dashboard";
}

export function getRoutePrefix(role: UserRole): string {
  return `/${role}`;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const ROLE_LABELS: Record<UserRole, string> = {
  pro: "Pro",
  client: "Client",
  pm: "Property Manager",
};

const SUBTYPE_LABELS: Record<string, string> = {
  residential: "Homeowner",
  residential_pro: "Investor",
  commercial: "Commercial",
  standard: "Standard Pro",
  flex: "Flex Pro",
};

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role;
}

export function getSubtypeLabel(subtype: UserSubtype): string {
  if (!subtype) return "";
  return SUBTYPE_LABELS[subtype] ?? subtype;
}

// ---------------------------------------------------------------------------
// Commission rates
// ---------------------------------------------------------------------------

const COMMISSION_RATES: Record<string, number> = {
  standard: 0.12,
  flex: 0.18,
};

/**
 * Returns the platform commission rate for a given subtype.
 * - standard pro → 12%
 * - flex pro → 18% (includes insurance coverage)
 * - clients / PM → 0
 */
export function getCommissionRate(subtype: UserSubtype): number {
  if (!subtype) return 0;
  return COMMISSION_RATES[subtype] ?? 0;
}
