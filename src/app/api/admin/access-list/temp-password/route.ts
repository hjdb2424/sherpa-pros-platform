import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { clerkClient } from "@clerk/nextjs/server";
import { query } from "@/db/connection";

// ── Auth check (mirrors access-list/route.ts) ───────────────────────

async function requireAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("sherpa-auth")?.value === "true") return true;
    if (cookieStore.get("sherpa-user")?.value) return true;
  } catch {
    // cookies() can fail in some contexts
  }
  // Beta posture: matches sibling routes. Production will enforce admin role.
  return true;
}

// ── POST: generate temp password, set on Clerk, persist expiry ──────
//
// Body:    { email: string }
// Returns: { password, expiresAt }   (plaintext password ONCE — never logged or stored)

export async function POST(request: NextRequest) {
  const authed = await requireAuth();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let email: string;
  try {
    const body = (await request.json()) as { email?: string };
    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 },
      );
    }
    email = body.email.trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ~11-char URL-safe password (8 random bytes → base64url).
  // High entropy (~64 bits) and copy/paste safe in emails.
  const password = randomBytes(8).toString("base64url");

  // Look up the Clerk user by email. If not found, the tester hasn't
  // signed up yet — they need a Clerk account before we can set a
  // password on it.
  let userId: string;
  try {
    const client = await clerkClient();
    const list = await client.users.getUserList({ emailAddress: [email] });
    const user = list.data?.[0];
    if (!user) {
      return NextResponse.json(
        {
          error:
            "No Clerk user found for this email. Have the tester sign up first, then generate a temp password.",
        },
        { status: 404 },
      );
    }
    userId = user.id;

    await client.users.updateUser(userId, { password });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Clerk error";
    return NextResponse.json(
      { error: "Failed to set password on Clerk", details: msg },
      { status: 502 },
    );
  }

  // Persist expiry on our side. Plaintext is NEVER stored.
  let expiresAt: string;
  try {
    const rows = await query<{ temp_password_expires_at: string }>(
      `UPDATE access_list
          SET temp_password_set_at     = NOW(),
              temp_password_expires_at = NOW() + INTERVAL '5 days',
              password_changed         = FALSE
        WHERE email = $1
        RETURNING temp_password_expires_at`,
      [email],
    );
    if (rows.length === 0) {
      // Clerk update succeeded but we have no access_list row. Surface
      // a clear error — admin should add the email to the access list
      // first via the regular Add User flow.
      return NextResponse.json(
        {
          error:
            "Email not found on access list. Add it via Add User first, then retry.",
        },
        { status: 404 },
      );
    }
    expiresAt = rows[0].temp_password_expires_at;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "DB error";
    return NextResponse.json(
      { error: "Database error", details: msg },
      { status: 500 },
    );
  }

  return NextResponse.json({ password, expiresAt });
}
