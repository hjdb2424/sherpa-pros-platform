import { NextResponse } from "next/server";

/**
 * DEV-ONLY: sets the cookies needed to access /admin/* in local development:
 *   - sherpa-is-admin=true   (legacy admin grant; honored by proxy.ts)
 *   - sherpa-role=client     (proxy needs a role cookie to even reach the admin gate)
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
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "dev-only" }, { status: 403 });
  }

  const res = NextResponse.redirect("http://localhost:3000/admin/access-list");
  const opts = { path: "/", maxAge: 2592000, sameSite: "lax" as const };
  res.cookies.set("sherpa-is-admin", "true", opts);
  res.cookies.set("sherpa-role", "client", opts);
  res.cookies.set("sherpa-dev-bypass", "true", opts);
  return res;
}
