import { NextResponse, type NextRequest } from "next/server";
import { isValidRole } from "@/lib/auth/roles";

/**
 * DEV-ONLY: sets the cookies needed to access /admin/* in local development:
 *   - sherpa-is-admin=true   (legacy admin grant; honored by proxy.ts)
 *   - sherpa-role=client     (proxy needs a role cookie to even reach the admin gate)
 *                             — only set if no valid role cookie already exists,
 *                             so we don't clobber a developer's existing pro/pm/tenant role.
 *   - sherpa-dev-bypass=true (skips Clerk middleware on localhost when NODE_ENV=development)
 *
 * Then redirects to /admin/access-list.
 *
 * Refused in production (returns 403). Don't expose this endpoint anywhere
 * customer-facing. The proxy.ts honor for sherpa-dev-bypass is also gated
 * behind NODE_ENV !== "production", so flipping ENABLED on a deploy still
 * doesn't grant access — both layers must be in dev.
 *
 * Visit: http://localhost:3000/api/dev/grant-admin
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "dev-only" }, { status: 403 });
  }

  const res = NextResponse.redirect("http://localhost:3000/admin/access-list");
  const opts = { path: "/", maxAge: 2592000, sameSite: "lax" as const };
  res.cookies.set("sherpa-is-admin", "true", opts);
  res.cookies.set("sherpa-dev-bypass", "true", opts);

  // Preserve any existing valid role cookie; only default to "client" when
  // there is no role yet (or it's malformed).
  const existingRole = req.cookies.get("sherpa-role")?.value;
  if (!isValidRole(existingRole)) {
    res.cookies.set("sherpa-role", "client", opts);
  }

  return res;
}
