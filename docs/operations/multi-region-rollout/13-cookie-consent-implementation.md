---
title: Cookie Consent + Tracking Transparency
date: 2026-04-25
status: draft
owner: Phyrom + future privacy counsel
references:
  - 12-gdpr-readiness-and-dsar-flow.md
  - 10-region-aware-db-routing.md
phase: 4 international (Q3 2027 onward)
---

# Cookie Consent Implementation

## Goal

A cookie consent banner that meets GDPR + ePrivacy Directive (EU), UK GDPR, CCPA / CPRA (California), PIPEDA (Canada), and LGPD (Brazil — Lei Geral de Proteção de Dados, the Brazilian general data protection law) requirements without dark patterns and without breaking the user experience for low-risk regions like the US (where opt-out, not opt-in, is the default).

## Vendor recommendation

- **OneTrust** — full-featured, used by enterprises, expensive (~$1500/mo). Overkill for Phase 4 Year 1.
- **Cookiebot** by Usercentrics — solid mid-market, ~$50–$300/mo depending on monthly visitor volume. **Recommended for Phase 4 Year 1.**
- **Self-built** — possible but ongoing maintenance is real (cookie inventory drift, regulator changes). Not recommended unless our scale demands it Phase 5+.

Decision: **Cookiebot** Phase 4 international launch; revisit at 1M monthly visitors.

## Banner UX

Per EU regulator guidance (notably CNIL France and the EDPB — European Data Protection Board), the banner must:

- [ ] Show on first visit before any non-essential cookie is set.
- [ ] Have **Accept all**, **Reject all**, and **Customize** options of equal visual weight (no dark patterns — Reject must not be smaller, paler, or hidden).
- [ ] Allow granular toggles by category in Customize (strictly necessary, functional, analytics, marketing).
- [ ] Allow withdrawal of consent at any time via a persistent footer link `Cookie preferences`.
- [ ] Default all non-essential categories to OFF in opt-in regions (EU/UK/Brazil); ON in opt-out regions (US/Canada with reject for sale of personal info).
- [ ] Be accessible (keyboard navigation, screen reader labels, sufficient color contrast).

## Cookie inventory + categorization

Maintain a live inventory in `docs/operations/multi-region-rollout/cookie-inventory.md` (to be drafted). Sample categorization:

| Category | Examples | GDPR consent required? |
| --- | --- | --- |
| Strictly necessary | Clerk session cookies, CSRF (Cross-Site Request Forgery) tokens, load-balancer affinity | No |
| Functional | Locale preference, theme preference, "remember me" | Yes (opt-in EU) |
| Analytics | Datadog RUM (Real User Monitoring), Vercel Analytics, internal funnel tracking | Yes |
| Marketing | Future: ad pixels, retargeting tags | Yes |

Cookiebot scans our site weekly and flags any new cookie that isn't in the inventory — we triage within 7 days.

## Per-jurisdiction logic

Cookiebot supports geo-aware behavior. Our configuration:

- **EU / UK** (GDPR + UK GDPR + ePrivacy): opt-in for all non-essential. Default OFF.
- **California** (CCPA / CPRA): "Do Not Sell or Share My Personal Information" link on every page. Default ON for analytics, with easy opt-out.
- **Canada** (PIPEDA + Quebec Law 25): implied consent acceptable for low-risk processing; explicit opt-in for sensitive categories. Cookie banner shown but lighter-touch than EU.
- **Brazil** (LGPD): similar to GDPR, opt-in for analytics + marketing.
- **Australia + others**: notice without consent banner is generally compliant Phase 4 Year 1; revisit per jurisdiction.

Geo determination:

- IP geolocation via Vercel `request.geo.country`.
- User can override via "Change region" link (rare, but supported for accuracy).

## Integration with analytics tools

- **Datadog RUM:** loaded conditionally based on consent state. If user has not granted analytics consent, `datadogRum.init()` is never called.
- **Vercel Analytics:** Vercel exposes `<Analytics>` component; we wrap it in a `ConsentGate` that returns null unless consent granted.
- **Future ad pixels:** never load until marketing consent granted.

```typescript
// components/analytics/consent-gate.tsx
"use client";
import { useConsent } from "@/lib/consent/use-consent";

export function ConsentGate({
  category,
  children,
}: {
  category: "functional" | "analytics" | "marketing";
  children: React.ReactNode;
}) {
  const { consents } = useConsent();
  if (!consents[category]) return null;
  return <>{children}</>;
}
```

## Audit log entry on every consent change

Every accept / reject / customize action emits a Sherpa Guard audit entry:

```json
{
  "event_type": "consent.changed",
  "user_id": "anon-<sessionId>", // or actual userId if logged in
  "before": { "functional": false, "analytics": false, "marketing": false },
  "after": { "functional": true, "analytics": true, "marketing": false },
  "ip_country": "FR",
  "user_agent": "..."
}
```

Used for compliance audits — proves consent was given (or refused) at a specific timestamp from a specific country.

## Implementation timeline

- [ ] **T-12 weeks:** Cookiebot account setup, cookie inventory scan.
- [ ] **T-8 weeks:** banner UX designed and reviewed with privacy counsel.
- [ ] **T-6 weeks:** ConsentGate wired into analytics tools on staging.
- [ ] **T-4 weeks:** geo-aware behavior tested per jurisdiction with VPN.
- [ ] **T-2 weeks:** legal sign-off + final audit log integration.
- [ ] **T-0:** ship to production aligned with EU launch (Q4 2027).

## Cost

- Cookiebot: $50–$300/mo (scales with monthly visitor count).
- Privacy counsel review: ~$2,000 one-time.
- **Ongoing total: ~$300/mo Phase 4 Year 1.**

## Out of scope (revisit later)

- Server-side consent enforcement for non-cookie tracking (e.g., conversion API events sent server-to-server). Required for full ad-tech consent compliance Phase 5+.
- IAB Transparency and Consent Framework (TCF) v2 — required if we run ad inventory; not applicable Phase 4.
