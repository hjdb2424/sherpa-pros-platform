# Services Layer

Migration-ready integration umbrella. Each external integration lives in its
own subdirectory and exports a `getXService()` function that picks the
implementation based on environment variables.

## Adding a new integration

1. Define the interface in `<name>/types.ts` (or re-export an existing one in
   `interfaces.ts`).
2. Implement the real adapter in `<name>/<provider>-service.ts`.
3. Implement the mock in `<name>/mock-service.ts`.
4. Export `getXService()` from `<name>/index.ts` that returns real if creds
   are set, mock otherwise.
5. Add the interface to `interfaces.ts`.
6. Add the service to `/api/health/route.ts`.

## Why this pattern?

Vercel → containers migration is a config flip, not a refactor. No business
logic touches infrastructure directly — every page/component imports from
`@/lib/services/...` not from a vendor SDK.
