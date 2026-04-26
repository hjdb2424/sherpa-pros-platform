import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// RBAC Middleware — Sherpa Pros Platform
//
// Intercepts dashboard routes and enforces role-based access.
// For MVP, the role is read from the `sherpa-role` cookie set during
// auth callback / role selection.
// ---------------------------------------------------------------------------

/** Route prefix → required role (or 'admin' for is_admin check) */
const ROUTE_ROLES: Record<string, string> = {
  "/pro": "pro",
  "/client": "client",
  "/pm": "pm",
  "/admin": "admin",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Determine which role prefix this path falls under
  const prefix = Object.keys(ROUTE_ROLES).find((p) => pathname.startsWith(p));
  if (!prefix) return NextResponse.next();

  const requiredRole = ROUTE_ROLES[prefix];

  // Read role from cookie (set during auth callback / role selection)
  const currentRole = request.cookies.get("sherpa-role")?.value;

  // No auth at all → redirect to sign-in
  if (!currentRole) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Admin routes: check is_admin flag cookie
  if (requiredRole === "admin") {
    const isAdmin = request.cookies.get("sherpa-is-admin")?.value === "true";
    if (!isAdmin) {
      // Not admin → send to their own dashboard
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = `/${currentRole}/dashboard`;
      return NextResponse.redirect(dashUrl);
    }
    return NextResponse.next();
  }

  // No role selected yet → redirect to role selection
  if (!["pro", "client", "pm"].includes(currentRole)) {
    const roleUrl = request.nextUrl.clone();
    roleUrl.pathname = "/select-role";
    return NextResponse.redirect(roleUrl);
  }

  // Wrong role → redirect to correct dashboard
  if (currentRole !== requiredRole) {
    const correctUrl = request.nextUrl.clone();
    correctUrl.pathname = `/${currentRole}/dashboard`;
    return NextResponse.redirect(correctUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pro/:path*", "/client/:path*", "/pm/:path*", "/admin/:path*"],
};
