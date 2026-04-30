import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { query } from "@/db/connection";

/**
 * POST /api/account/password-changed
 *
 * Called from /account/change-password (on mount + on unload) to flip
 * access_list.password_changed = TRUE for the signed-in user. Idempotent:
 * calling it when the flag is already TRUE is a harmless no-op.
 *
 * We pull the email from Clerk's currentUser() — never trust client input.
 */
export async function POST() {
  let email: string | null = null;
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Prefer the verified primary email; fall back to first verified address.
    const primary = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId,
    );
    email = (primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "")
      .trim()
      .toLowerCase();
  } catch {
    return NextResponse.json({ error: "Auth lookup failed" }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json(
      { error: "No email on Clerk session" },
      { status: 400 },
    );
  }

  try {
    await query(
      `UPDATE access_list
          SET password_changed = TRUE
        WHERE email = $1`,
      [email],
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "DB error";
    return NextResponse.json(
      { error: "Database error", details: msg },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
