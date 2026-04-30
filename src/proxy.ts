import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ROLES,
  isValidRole,
  getDashboardPath,
  type UserRole,
} from "@/lib/auth/roles";

// Routes the temp-password check must NOT redirect (otherwise the user
// gets stuck in a loop on the very page they're supposed to use).
const TEMP_PW_BYPASS_PATHS = new Set<string>([
  "/account/change-password",
  "/api/account/password-changed",
]);

// Per-runtime memo so we don't hammer the DB on every request for the
// same email. Tiny TTL (60s) — enough to amortize across navigation
// bursts but short enough that flipping password_changed=true takes
// effect quickly. Process-level only, no cross-instance coherence
// required.
type TempPwCacheEntry = { mustChange: boolean; cachedAt: number };
const tempPwCache = new Map<string, TempPwCacheEntry>();
const TEMP_PW_CACHE_TTL_MS = 60 * 1000;

async function userMustChangeTempPassword(email: string): Promise<boolean> {
  const now = Date.now();
  const cached = tempPwCache.get(email);
  if (cached && now - cached.cachedAt < TEMP_PW_CACHE_TTL_MS) {
    return cached.mustChange;
  }

  try {
    const { query } = await import("@/db/connection");
    // Force change on every sign-in until password_changed=TRUE.
    // temp_password_set_at is the source-of-truth signal that the user has
    // been issued a temp password. temp_password_expires_at is record-keeping
    // only (audit/tracking) and is NOT used by this query — gating on expiry
    // would let users sign in with a temp password indefinitely until it
    // "expires" and then trap them on a password they may no longer be able
    // to use.
    const rows = await query<{ must_change: boolean }>(
      `SELECT (password_changed = FALSE
               AND temp_password_set_at IS NOT NULL) AS must_change
         FROM access_list
        WHERE email = $1`,
      [email],
    );
    const mustChange = rows[0]?.must_change === true;
    tempPwCache.set(email, { mustChange, cachedAt: now });
    return mustChange;
  } catch {
    // Fail-open: if DB is unreachable, don't trap the user in a redirect.
    return false;
  }
}

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
  [`/${ROLES.TENANT}`]: ROLES.TENANT,
  "/admin": "admin",
};

const ROUTE_PREFIXES = Object.keys(ROUTE_ROLES);

// ---- RBAC enforcement (runs after Clerk auth) ----
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
    `/${ROLES.TENANT}(.*)`,
    "/admin(.*)",
    "/select-role",
    // Migration 014: account section (force-redirect target for expired temp pws)
    "/account(.*)",
  ]);

  const handler = clerkMiddleware(
    async (auth, request) => {
      if (isProtectedRoute(request)) {
        // Preserve original path so Clerk's <SignIn> returns the user
        // there after authentication.
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("redirect_url", request.url);
        await auth.protect({ unauthenticatedUrl: signInUrl.toString() });

        // Temp-password expiry check (migration 014). Runs only AFTER
        // auth.protect() — at this point the user is signed in. Skip
        // entirely on /account/change-password and its API counterpart
        // to avoid a redirect loop.
        const { pathname } = request.nextUrl;
        if (!TEMP_PW_BYPASS_PATHS.has(pathname)) {
          try {
            const { userId, sessionClaims } = await auth();
            if (userId) {
              // Try sessionClaims first (zero round-trip). Fall back to
              // a Clerk lookup if the email isn't on the JWT.
              type EmailClaims = {
                email?: string;
                primaryEmail?: string;
                primary_email?: string;
              };
              const claims = (sessionClaims ?? {}) as EmailClaims;
              let email: string | undefined =
                claims.email ??
                claims.primaryEmail ??
                claims.primary_email;

              if (!email) {
                const { clerkClient } = await import("@clerk/nextjs/server");
                const client = await clerkClient();
                const user = await client.users.getUser(userId);
                const primary = user.emailAddresses.find(
                  (e) => e.id === user.primaryEmailAddressId,
                );
                email = primary?.emailAddress
                  ?? user.emailAddresses[0]?.emailAddress;
              }

              if (email) {
                const mustChange = await userMustChangeTempPassword(
                  email.trim().toLowerCase(),
                );
                if (mustChange) {
                  const redirectUrl = request.nextUrl.clone();
                  redirectUrl.pathname = "/account/change-password";
                  redirectUrl.search = "";
                  return NextResponse.redirect(redirectUrl);
                }
              }
            }
          } catch {
            // Fail-open: never trap the user if the check itself errors.
          }
        }
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
