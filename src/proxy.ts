import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Proxy — Sherpa Pros Platform (Next.js 16)
//
// Combines Clerk auth protection with RBAC role enforcement.
// In Next.js 16, proxy.ts replaces middleware.ts.
// ---------------------------------------------------------------------------

// Clerk middleware is only active when CLERK_SECRET_KEY is set.
const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

/** Route prefix → required role (or 'admin' for is_admin check) */
const ROUTE_ROLES: Record<string, string> = {
  "/pro": "pro",
  "/client": "client",
  "/pm": "pm",
  "/admin": "admin",
};

// ---- RBAC enforcement (runs after Clerk auth) ----
function enforceRBAC(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  const prefix = Object.keys(ROUTE_ROLES).find((p) => pathname.startsWith(p));
  if (!prefix) return null; // not a role-gated route

  const requiredRole = ROUTE_ROLES[prefix];
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
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = `/${currentRole}/dashboard`;
      return NextResponse.redirect(dashUrl);
    }
    return null;
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

  return null; // access granted
}

// ---- Clerk auth wrapper ----
async function withClerk(req: NextRequest) {
  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );

  const isProtectedRoute = createRouteMatcher([
    "/pro(.*)",
    "/client(.*)",
    "/pm(.*)",
    "/admin(.*)",
    "/select-role",
  ]);

  return clerkMiddleware(async (auth, request) => {
    if (isProtectedRoute(request)) {
      await auth.protect();
    }
    // After Clerk auth passes, enforce RBAC
    const rbacResponse = enforceRBAC(request as NextRequest);
    if (rbacResponse) return rbacResponse;
  })(req, {} as any);
}

// ---- Main proxy handler ----
export default async function proxy(req: NextRequest) {
  // Dev-only Clerk bypass: lets local /admin/* testing skip the Clerk
  // sign-in flow when working on localhost. The cookie is set by
  // /api/dev/grant-admin which itself is NODE_ENV-guarded. This bypass
  // is also NODE_ENV-guarded so flipping the cookie on a production
  // deploy does nothing — both layers must be in development.
  const devBypass =
    process.env.NODE_ENV === "development" &&
    req.cookies.get("sherpa-dev-bypass")?.value === "true";

  if (clerkConfigured && !devBypass) {
    return withClerk(req);
  }

  // No Clerk configured (or dev bypass active) — still enforce RBAC via cookies
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
