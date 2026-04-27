#!/usr/bin/env node
/**
 * Sherpa Pros — list users with data room access.
 *
 * Audits which Clerk users currently have `publicMetadata.dataroom === true`.
 * Prints a table: email · name · last sign-in · created · OAuth provider.
 *
 * Usage:
 *   npm run list:dataroom
 *
 * Requires CLERK_SECRET_KEY in .env.local (auto-loaded via the npm script's
 * --env-file flag). Uses the Clerk Backend REST API directly — no SDK
 * dependency, so this works identically on Vercel and DO.
 *
 * Pagination: handles up to 5,000 users (50 pages × 100/page).
 */

const SECRET = process.env.CLERK_SECRET_KEY;
if (!SECRET) {
  console.error(
    "CLERK_SECRET_KEY missing. Run via `npm run list:dataroom` (loads .env.local), or set it inline."
  );
  process.exit(1);
}

const PER_PAGE = 100;
const MAX_PAGES = 50;

async function fetchPage(offset) {
  const url = `https://api.clerk.com/v1/users?limit=${PER_PAGE}&offset=${offset}&order_by=-created_at`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SECRET}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Clerk API error ${res.status}: ${body}`);
  }
  return res.json();
}

function formatDate(ms) {
  if (!ms) return "—";
  const d = new Date(ms);
  return d.toISOString().slice(0, 10);
}

function primaryEmail(user) {
  const id = user.primary_email_address_id;
  const email = user.email_addresses?.find((e) => e.id === id);
  return email?.email_address ?? user.email_addresses?.[0]?.email_address ?? "—";
}

function provider(user) {
  if (!user.external_accounts?.length) return "email";
  return user.external_accounts.map((a) => a.provider).join(", ");
}

function fullName(user) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";
}

(async () => {
  let offset = 0;
  let totalUsers = 0;
  const granted = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const users = await fetchPage(offset);
    if (!Array.isArray(users) || users.length === 0) break;

    totalUsers += users.length;
    for (const user of users) {
      if (user.public_metadata?.dataroom === true) {
        granted.push(user);
      }
    }

    if (users.length < PER_PAGE) break;
    offset += PER_PAGE;
  }

  console.log("");
  console.log("Sherpa Pros — Data Room Access Audit");
  console.log("=".repeat(72));
  console.log(`Total users in production:        ${totalUsers}`);
  console.log(`Users with dataroom access:       ${granted.length}`);
  console.log("=".repeat(72));
  console.log("");

  if (granted.length === 0) {
    console.log("No users currently have publicMetadata.dataroom = true.");
    console.log(
      "Grant access via Clerk dashboard → Users → Public metadata → { \"dataroom\": true }"
    );
    return;
  }

  // Sort by most-recent created
  granted.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));

  const rows = granted.map((u) => ({
    email: primaryEmail(u),
    name: fullName(u),
    lastSignIn: formatDate(u.last_sign_in_at),
    created: formatDate(u.created_at),
    auth: provider(u),
  }));

  // Print as a tab-separated table for easy copy/paste
  console.log(
    ["EMAIL", "NAME", "LAST SIGN-IN", "CREATED", "AUTH"].join("\t")
  );
  for (const r of rows) {
    console.log([r.email, r.name, r.lastSignIn, r.created, r.auth].join("\t"));
  }

  console.log("");
  console.log(`(${rows.length} record${rows.length === 1 ? "" : "s"})`);
})().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
