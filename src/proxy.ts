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
// Combines Clerk auth protection with RBAC role enforcement.
// In Next.js 16, proxy.ts replaces middleware.ts.
// ---------------------------------------------------------------------------

const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

/** Route prefix → required role ("admin" sentinel triggers is_admin check). */
const ROUTE_ROLES: Record<string, UserRole | "admin"> = {
  [`/${ROLES.PRO}`]: ROLES.PRO,
  [`/${ROLES.CLIENT}`]: ROLES.CLIENT,
  [`/${ROLES.PM}`]: ROLES.PM,
  "/admin": "admin",
};

const ROUTE_PREFIXES = Object.keys(ROUTE_ROLES);

// ---- RBAC enforcement (runs after Clerk auth) ----
function enforceRBAC(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  const prefix = ROUTE_PREFIXES.find((p) => pathname.startsWith(p));
  if (!prefix) return null;

  const requiredRole = ROUTE_ROLES[prefix];
  const currentRole = request.cookies.get("sherpa-role")?.value;

  // When Clerk is configured, by the time this runs the user has already
  // passed auth.protect() — they ARE signed in. A missing/invalid role cookie
  // means they haven't picked a role yet; send them to /select-role
  // (NOT /sign-in, which would loop signed-in users forever).
  if (!isValidRole(currentRole)) {
    if (pathname === "/select-role") return null;
    const roleUrl = request.nextUrl.clone();
    roleUrl.pathname = "/select-role";
    // Note: param name `redirect` differs from Clerk's `redirect_url` — this
    // is the internal post-role-pick destination, read by /select-role.
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

// ---- Clerk handler — built once on first request, then reused ----
//
// `clerkMiddleware()` returns a request handler. The previous version rebuilt
// it (plus `createRouteMatcher` and the dynamic import await) on every
// request. Memoize at module scope so cold-start pays the cost once.
async function loadClerkHandler() {
  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );

  const isProtectedRoute = createRouteMatcher([
    `/${ROLES.PRO}(.*)`,
    `/${ROLES.CLIENT}(.*)`,
    `/${ROLES.PM}(.*)`,
    "/admin(.*)",
    "/select-role",
  ]);

  const handler = clerkMiddleware(
    async (auth, request) => {
      if (isProtectedRoute(request)) {
        // Preserve original path so Clerk's <SignIn> returns the user
        // there after authentication.
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("redirect_url", request.url);
        await auth.protect({ unauthenticatedUrl: signInUrl.toString() });
      }
      const rbacResponse = enforceRBAC(request as NextRequest);
      if (rbacResponse) return rbacResponse;
    },
    {
      // Required at runtime: the next.config `env` override only inlines
      // NEXT_PUBLIC_CLERK_SIGN_IN_URL into the client bundle; server-side
      // middleware on Vercel Edge reads process.env separately.
      signInUrl: "/sign-in",
      signUpUrl: "/sign-up",
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: NextRequest) => handler(req, {} as any);
}

let clerkHandlerPromise: ReturnType<typeof loadClerkHandler> | null = null;

function getClerkHandler() {
  if (!clerkHandlerPromise) clerkHandlerPromise = loadClerkHandler();
  return clerkHandlerPromise;
}

// ---- Main proxy handler ----
export default async function proxy(req: NextRequest) {
  // Dev-only Clerk bypass: lets local /admin/* testing skip the Clerk
  // sign-in flow on localhost. Cookie is set by /api/dev/grant-admin which
  // is itself NODE_ENV-guarded — both layers must be in development.
  const devBypass =
    process.env.NODE_ENV === "development" &&
    req.cookies.get("sherpa-dev-bypass")?.value === "true";

  if (clerkConfigured && !devBypass) {
    const handler = await getClerkHandler();
    return handler(req);
  }

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
