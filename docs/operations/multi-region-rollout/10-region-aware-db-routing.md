---
title: Region-Aware Database Routing for International Rollout
date: 2026-04-25
status: draft
owner: Phyrom + future SRE hire
references:
  - 01-drizzle-replica-aware-client.md
  - 11-canadian-region-setup.md
  - 12-gdpr-readiness-and-dsar-flow.md
  - 14-cross-border-anonymized-analytics-pipeline.md
phase: 4 international (Canada Q3 2027 onward)
---

# Region-Aware Database Routing

## Goal

When users in Canada, the EU, the UK, and Australia come online (Phase 4 international), their personal data must stay in their own jurisdiction's database. This requires routing every read and write to the correct regional database based on the user's home region, with strict prohibitions against personal information (PII) crossing borders.

## Per-jurisdiction database endpoint mapping

| Region | Postgres host | Vercel function regions |
| --- | --- | --- |
| US (default) | Neon `us-east-2` primary + `us-west-2` replica | `iad1`, `sfo1` |
| Canada | Neon `ca-central-1` primary | `iad1` (no Canadian Vercel region today; data round-trips to/from Toronto) |
| EU | Neon `eu-west-1` (Frankfurt) | `cdg1` (Paris) |
| UK | Neon `eu-west-2` (London) — separate from EU post-Brexit data residency | `lhr1` (London) |
| Australia | Neon `ap-southeast-2` (Sydney) | `syd1` |

These are extensions to the env vars already established in `01-drizzle-replica-aware-client.md`.

```
DATABASE_URL_US                       # primary US-East
DATABASE_URL_CA                       # primary Canada
DATABASE_URL_EU                       # primary EU
DATABASE_URL_UK                       # primary UK
DATABASE_URL_AU                       # primary Australia
DATABASE_READ_URL_US_WEST             # US replica
DATABASE_READ_URL_EU_REPLICA          # EU replica (Phase 4D+)
```

## User-region detection

The user's region is determined at sign-up and persisted in Clerk user metadata. It does not change without a deliberate migration (rare; e.g., a user moves country).

```typescript
// lib/auth/region.ts
import { auth, clerkClient } from "@clerk/nextjs/server";

export type UserRegion = "us" | "ca" | "eu" | "uk" | "au";

export async function getUserRegion(): Promise<UserRegion> {
  const { userId } = auth();
  if (!userId) return "us"; // unauthenticated → US default
  const user = await clerkClient.users.getUser(userId);
  const region = user.publicMetadata?.region as UserRegion | undefined;
  return region ?? "us";
}
```

Region is set during sign-up by:

1. **IP geolocation** (Vercel `request.geo.country`) as the first guess.
2. **Phone number country code** (overrides IP if mismatch).
3. **Explicit user choice** in onboarding (always wins).

## Code stub: region-aware Drizzle client

Builds on the replica-aware client from doc 01.

```typescript
// lib/db/region-client.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "@/db/drizzle-schema";
import type { UserRegion } from "@/lib/auth/region";

const REGIONAL_WRITE_URLS: Record<UserRegion, string> = {
  us: process.env.DATABASE_URL_US!,
  ca: process.env.DATABASE_URL_CA!,
  eu: process.env.DATABASE_URL_EU!,
  uk: process.env.DATABASE_URL_UK!,
  au: process.env.DATABASE_URL_AU!,
};

const writePools = new Map<UserRegion, Pool>();

export function getRegionalWriteDb(region: UserRegion) {
  let pool = writePools.get(region);
  if (!pool) {
    pool = new Pool({ connectionString: REGIONAL_WRITE_URLS[region] });
    writePools.set(region, pool);
  }
  return drizzle(pool, { schema });
}

// Convenience wrapper that resolves region from Clerk session.
import { getUserRegion } from "@/lib/auth/region";

export async function getDbForCurrentUser() {
  const region = await getUserRegion();
  return { db: getRegionalWriteDb(region), region };
}
```

## Cross-jurisdiction prohibitions

**Hard rules** enforced at the application layer. Violations are bugs that get hot-fixed.

- [ ] **PII never crosses borders.** Names, addresses, emails, phone numbers, payment details — all stay in the user's home regional DB.
- [ ] **Audit log writes go to the user's home region.** Not a global audit log.
- [ ] **Cross-region foreign keys are forbidden.** A Canadian user's job cannot reference a US `pro_id` directly. Cross-region work uses an opaque bridge ID (UUID) and a separate cross-region work_orders table that holds only non-PII metadata.
- [ ] **Backups stay in-region.** Each region's Neon takes its own snapshots. Snapshots never replicate cross-region.
- [ ] **Search indexes are per-region.** No global Elasticsearch / Algolia cluster with PII.

## Cross-region work orders (the bridge pattern)

When a Canadian client books a US pro for cross-border consult work (rare but possible for design/architectural review):

1. Canadian DB stores the client-side record.
2. US DB stores the pro-side record.
3. Both reference a shared `cross_region_work_order_id` (UUID).
4. The two records sync via a constrained set of non-PII fields (start time, scope, status, payment amount in cents, currency code).
5. PII required for execution is shared by user consent at the point of use, not by automatic replication.

This pattern preserves data residency while enabling rare cross-border interaction.

## Aggregate analytics (cross-border, anonymized only)

Cross-border data flow is allowed only for **anonymized aggregates** that pass a privacy review (see `14-cross-border-anonymized-analytics-pipeline.md`). Examples:

- Weekly job counts per metro.
- Monthly GMV (Gross Merchandise Volume) per region.
- Pro count per region.

Examples of what is **not** allowed cross-border:

- Individual user records.
- Individual job details.
- Pro-level performance data tied to identifiable pros.

## Routing in Vercel functions — region pinning

Vercel functions ideally execute in the same region as their primary DB:

- US user request → routed to `iad1` or `sfo1` function → connects to US Neon.
- Canadian user request → routed to `iad1` function (no Vercel YYZ today) → connects to Canadian Neon (cross-region DB hop, ~80ms latency).
- EU user request → routed to `cdg1` function → connects to EU Neon.

For Phase 4 international, accept the Canadian latency hit; revisit when Vercel adds a Canadian region.

## Migration: how a US user becomes a Canadian user (rare)

User physically relocates and asks for data residency to change. Process:

1. Open privacy support ticket.
2. Privacy officer approves migration.
3. Off-hours batch job: copy user's records from US Neon to Canadian Neon, deactivate US records (keep for audit retention), update Clerk metadata.
4. User notified by email when complete.

Out-of-scope for general engineering work — handled as a privacy operation.

## Failure modes

- **Wrong-region write attempt:** application asserts region match before write; wrong-region throws. Surfaced as a SEV2 bug.
- **Region DB unreachable:** users in that region see service degradation; users in other regions unaffected.
- **Clerk metadata missing region:** defaults to US. Bad for Canadians; mitigated by setting region during onboarding and a one-time backfill.
