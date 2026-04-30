import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ROLES,
  isValidRole,
  getDashboardPath,
  type UserRole,
} from "@/lib/auth/roles";

// ---------------------------------------------------------------------------
// Proxy — Sherpa Pros Platform (Next.js 16)
//
// Cookie-based RBAC role enforcement only. Clerk has been removed; auth is
// handled by the Google OAuth callback (sets sherpa-user/sherpa-auth cookies)
// and the BetaPortal client login (sets sherpa-role + localStorage).
// In Next.js 16, proxy.ts replaces middleware.ts.
// ---------------------------------------------------------------------------

/** Route prefix → required role ("admin" sentinel triggers is_admin check). */
const ROUTE_ROLES: Record<string, UserRole | "admin"> = {
  [`/${ROLES.PRO}`]: ROLES.PRO,
  [`/${ROLES.CLIENT}`]: ROLES.CLIENT,
  [`/${ROLES.PM}`]: ROLES.PM,
  [`/${ROLES.TENANT}`]: ROLES.TENANT,
  "/admin": "admin",
};

const ROUTE_PREFIXES = Object.keys(ROUTE_ROLES);

// ---- RBAC enforcement ----
function enforceRBAC(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Segment-aware prefix match: a raw startsWith would let `/pro` match
  // `/protect`, `/profile`, or `/project/123`. Require the pathname to be
  // exactly the prefix, or the prefix followed by a `/` boundary, so we
  // only fire RBAC on the actual role/admin route trees.
  const prefix = ROUTE_PREFIXES.find(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (!prefix) return null;

  const requiredRole = ROUTE_ROLES[prefix];
  const currentRole = request.cookies.get("sherpa-role")?.value;

  // Missing/invalid role cookie → send to /select-role
  // (NOT /sign-in, which would loop signed-in users forever).
  if (!isValidRole(currentRole)) {
    if (pathname === "/select-role") return null;
    const roleUrl = request.nextUrl.clone();
    roleUrl.pathname = "/select-role";
    roleUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(roleUrl);
  }

  // Admin routes: gated by the separate sherpa-is-admin flag cookie.
  if (requiredRole === "admin") {
    const isAdmin = request.cookies.get("sherpa-is-admin")?.value === "true";
    if (!isAdmin) {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = getDashboardPath(currentRole);
      return NextResponse.redirect(dashUrl);
    }
    return null;
  }

  if (currentRole !== requiredRole) {
    const correctUrl = request.nextUrl.clone();
    correctUrl.pathname = getDashboardPath(currentRole);
    return NextResponse.redirect(correctUrl);
  }

  return null;
}

// ---- Main proxy handler ----
export default async function proxy(req: NextRequest) {
  const rbacResponse = enforceRBAC(req);
  if (rbacResponse) return rbacResponse;

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
