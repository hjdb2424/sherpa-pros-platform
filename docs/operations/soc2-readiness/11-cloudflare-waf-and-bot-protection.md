---
title: Cloudflare WAF + Vercel BotID + Upstash Rate Limiting
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - src/middleware.ts (Sherpa Guard)
  - docs/operations/soc2-readiness/04-vendor-risk-register.md
  - docs/operations/soc2-readiness/06-incident-response-procedures.md
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
soc2_controls: [CC6.6, CC6.7, CC7.1, CC7.2]
---

# Cloudflare WAF + Vercel BotID + Upstash Rate Limiting

## 1. Purpose

Defines the layered edge-protection stack for Sherpa Pros: Cloudflare Pro WAF for L7 attacks, Vercel BotID (GA Jun 2025) for managed bot challenges, and Upstash Redis for sliding-window rate limiting integrated into the Sherpa Guard middleware. Satisfies SOC 2 CC6.6 (network access), CC6.7 (transmission integrity), CC7.1/CC7.2 (anomaly detection).

## 2. Stack Architecture

```
[User / bot]
     │
     ▼
[Cloudflare edge — WAF managed rules + custom rules + bot management]
     │
     ▼
[Vercel edge — BotID managed challenge + Sherpa Guard middleware]
     │
     ├─── [Upstash Redis — sliding-window rate limit check]
     │
     ▼
[Route handler]
```

## 3. Cloudflare Pro Plan Configuration

### 3.1 Account + plan

- [ ] Cloudflare account: `sherpa-pros`
- [ ] Plan: **Pro** ($25/mo) Phase 1; **Business** ($250/mo) at >100K MAU
- [ ] Domains: `thesherpapros.com`, `app.thesherpapros.com`, `api.thesherpapros.com`, `status.thesherpapros.com`, `trust.thesherpapros.com`
- [ ] DNS proxy (orange cloud) enabled on all subdomains

### 3.2 Managed rule sets

Enabled at Pro plan level:

- [ ] **Cloudflare Managed Ruleset** (default sensitivity: Medium)
- [ ] **OWASP Core Rule Set** (paranoia level 2; score threshold 30)
- [ ] **Cloudflare Specials** (Cloudflare-curated zero-day rules)
- [ ] **Cloudflare WordPress** (disabled — not WordPress)

Override actions:

- Default: **Log mode** for first 24 hours after enabling new rule
- Promote to **Block** after Phyrom + on-call review of false positives
- Document each promotion in change-management log per `05-change-management-policy.md`

### 3.3 Custom WAF rules

```
# Rule 1: SQL injection extended patterns (defense-in-depth on top of OWASP CRS)
Expression: (http.request.uri.query contains "UNION SELECT")
            or (http.request.uri.query contains "INFORMATION_SCHEMA")
            or (http.request.body.raw matches "(?i)(or|and)\s+\d+\s*=\s*\d+")
Action: Block
Log: Yes

# Rule 2: XSS pattern enforcement
Expression: (http.request.uri.query contains "<script")
            or (http.request.body.raw matches "(?i)javascript:")
            or (http.request.body.raw matches "(?i)onerror\s*=")
Action: Managed Challenge
Log: Yes

# Rule 3: Request smuggling
Expression: (http.request.headers["transfer-encoding"][0] eq "chunked"
             and http.request.headers["content-length"][0] ne "")
Action: Block

# Rule 4: API abuse — high-volume POST without auth
Expression: (http.request.method eq "POST"
             and not http.cookie contains "__session"
             and not http.request.uri.path matches "^/api/(public|webhooks)/")
Action: Managed Challenge
Log: Yes

# Rule 5: Geographic restriction (optional, off by default)
Expression: (ip.geoip.country in {"KP" "IR" "SY"})
Action: Block
Notes: Tune per business need; disable if expanding internationally

# Rule 6: Known abuse-source ASNs
Expression: (ip.geoip.asnum in {known_abuse_asns_list})
Action: Managed Challenge

# Rule 7: User-agent fingerprint anomalies
Expression: (http.user_agent eq ""
             or http.user_agent contains "curl/"
             or http.user_agent contains "python-requests/")
            and not http.request.uri.path matches "^/api/(integrations|webhooks)/"
Action: Managed Challenge

# Rule 8: Path traversal
Expression: (http.request.uri.path contains "../"
             or http.request.uri.path contains "%2e%2e")
Action: Block

# Rule 9: Auth endpoint brute force
Expression: (http.request.uri.path eq "/api/auth/sign-in"
             and http.request.method eq "POST")
Action: Managed Challenge if rate >5 per IP per minute
Notes: Cloudflare Rate Limiting product OR Upstash check (preferred at Sherpa Guard layer)

# Rule 10: Webhook endpoint protection (verify Stripe/Twilio source IPs OR signature only)
Expression: (http.request.uri.path matches "^/api/webhooks/"
             and not ip.src in {stripe_ip_ranges} {twilio_ip_ranges})
Action: Block
Notes: Combined with HMAC signature verification at app layer
```

### 3.4 Bot management

- [ ] **Cloudflare Bot Fight Mode**: enabled
- [ ] **Bot Management Score** (Pro+): exposed via header `cf-bot-score` (1-99); used by Sherpa Guard middleware
- [ ] Bot scores ≥30 (likely automated): Managed Challenge on POST endpoints
- [ ] Bot scores ≥50 (very likely automated): Block on POST endpoints
- [ ] **Verified bots** (Googlebot, Bingbot) allowlisted

### 3.5 Cloudflare Rate Limiting (account-level)

| Endpoint pattern | Limit | Window | Action |
|------------------|-------|--------|--------|
| `/api/auth/sign-in` | 5 | per minute per IP | Managed Challenge |
| `/api/auth/sign-up` | 3 | per minute per IP | Managed Challenge |
| `/api/auth/reset-password` | 3 | per 5 minutes per IP | Managed Challenge |
| `/api/jobs` POST | 10 | per minute per session | Block |
| `/api/bids` POST | 30 | per minute per session | Block |
| `/api/*` aggregate | 1000 | per minute per IP | Managed Challenge |

These complement Upstash sliding-window limits at the application layer (Section 5).

## 4. Vercel BotID Configuration

Per Vercel platform reminder: BotID is GA as of Jun 2025; provides managed challenge + behavior analysis at edge.

### 4.1 Setup

- [ ] Enable BotID in Vercel project settings
- [ ] Default action: **Managed Challenge** for suspicious traffic
- [ ] Whitelist: known good user-agents + verified bots
- [ ] Integration: BotID verdict available to Vercel middleware via `request.headers.get('x-vercel-bot-id-verdict')`

### 4.2 Sherpa Guard middleware integration

```typescript
// src/middleware.ts (extension - illustrative)
import { rateLimit } from './lib/edge/rate-limit';
import { auditEdge } from './lib/edge/audit';

export async function middleware(request: NextRequest) {
  // 1. Vercel BotID verdict check
  const botVerdict = request.headers.get('x-vercel-bot-id-verdict'); // e.g., "human", "bot", "uncertain"
  if (botVerdict === 'bot' && isMutatingMethod(request.method)) {
    await auditEdge('edge.blocked.botid', { ip: clientIp(request), path: request.nextUrl.pathname });
    return new Response('Forbidden', { status: 403 });
  }

  // 2. Cloudflare bot score additional check
  const cfBotScore = parseInt(request.headers.get('cf-bot-score') ?? '99', 10);
  if (cfBotScore <= 30 && isMutatingMethod(request.method)) {
    await auditEdge('edge.blocked.cf_bot', { ip: clientIp(request), score: cfBotScore });
    return new Response('Forbidden', { status: 403 });
  }

  // 3. Upstash rate limit (per Section 5)
  const rl = await rateLimit(request);
  if (!rl.allowed) {
    await auditEdge('edge.rate_limited', { ip: clientIp(request), tier: rl.tier, path: request.nextUrl.pathname });
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'retry-after': String(rl.retryAfterSec),
        'x-ratelimit-limit': String(rl.limit),
        'x-ratelimit-remaining': String(rl.remaining),
        'x-ratelimit-reset': String(rl.resetAt),
      },
    });
  }

  // 4. Sherpa Guard role-tier check (existing)
  // ... existing tier enforcement
}
```

### 4.3 Fraud detection

- BotID + behavior analysis surfaces session anomalies (rapid form submissions, headless-browser patterns)
- High-risk scores feed Datadog `D6: Error Rate per Route` and trigger #alerts-security Slack channel

## 5. Upstash Redis Rate Limiting

### 5.1 Per-tier limits (sliding window)

| Tier | Limit | Window | Notes |
|------|-------|--------|-------|
| **anonymous** (no session) | **60 req/min** | per IP | Pre-auth / public pages |
| **homeowner** (authenticated client) | **300 req/min** | per user | Standard customer usage |
| **pro** | **1000 req/min** | per user | Higher because dispatch-loop activity |
| **pm_admin** | **3000 req/min** | per user + per org | Bulk operations expected |
| **internal_eng** / `sherpa_admin` | **10000 req/min** | per user | Operational |
| **api_integration** (B2B per-contract) | **per-contract custom** | per API key | Set per MSA, default 600 req/min |

### 5.2 Endpoint-class overrides

| Endpoint class | Limit (overrides tier) | Window |
|----------------|------------------------|--------|
| `POST /api/auth/*` | 10 req/min | per IP (regardless of tier — pre-auth) |
| `POST /api/jobs` | 30 req/min | per user |
| `POST /api/bids` | 100 req/min | per user |
| `POST /api/payments/*` | 60 req/min | per user |
| Webhooks `POST /api/webhooks/*` | per source: 10000/min | bypass user tier |

### 5.3 Implementation

```typescript
// src/lib/edge/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const limiters = {
  anonymous: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'rl:anon' }),
  homeowner: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(300, '1 m'), prefix: 'rl:home' }),
  pro: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(1000, '1 m'), prefix: 'rl:pro' }),
  pm_admin: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3000, '1 m'), prefix: 'rl:pm' }),
  internal_eng: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10000, '1 m'), prefix: 'rl:eng' }),
  authPost: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m'), prefix: 'rl:auth' }),
};

export async function rateLimit(request: NextRequest): Promise<{
  allowed: boolean;
  tier: string;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}> {
  const path = request.nextUrl.pathname;
  const tier = getUserTier(request); // homeowner | pro | pm_admin | internal_eng | anonymous
  const userOrIp = getUserId(request) ?? clientIp(request);

  // Endpoint-class override
  if (path.startsWith('/api/auth/')) {
    const result = await limiters.authPost.limit(clientIp(request));
    return mapResult(result, 'auth');
  }

  // Tier-based
  const limiter = limiters[tier as keyof typeof limiters] ?? limiters.anonymous;
  const result = await limiter.limit(userOrIp);
  return mapResult(result, tier);
}

function mapResult(r: any, tier: string) {
  return {
    allowed: r.success,
    tier,
    limit: r.limit,
    remaining: r.remaining,
    resetAt: r.reset,
    retryAfterSec: Math.max(0, Math.ceil((r.reset - Date.now()) / 1000)),
  };
}
```

### 5.4 Fail-open vs fail-closed

- **Phase 1**: Fail-open if Upstash unreachable (log to Datadog, do not block users) — Cloudflare provides redundant rate limiting
- **Phase 4**: Fail-closed for write endpoints; fail-open for read endpoints
- Datadog alert on Upstash failure rate >1%

## 6. Implementation Order

```
[Phase 1.A — Q2 2026]
□ Cloudflare Pro plan + DNS proxy
□ Managed rule sets enabled in Log mode
□ Cloudflare Bot Fight Mode + bot scores exposed
□ Upstash Redis provisioned (us-east-1 + us-west-2 multi-region)
□ Sherpa Guard middleware extended with rate-limit + bot-verdict checks
□ Audit log entries for edge.blocked.* and edge.rate_limited
□ Datadog dashboard pulls metrics from rate-limit emit

[Phase 1.B — Q3 2026]
□ Promote managed WAF rules from Log → Block after FP review
□ Custom WAF rules 1-10 deployed in Log mode
□ Vercel BotID enabled with Managed Challenge
□ Cloudflare Rate Limiting layer activated for auth endpoints

[Phase 2 — Q4 2026]
□ Promote custom WAF rules to Block after FP review
□ Tune bot-score thresholds based on 90 days of telemetry
□ API integration rate limits negotiated per B2B contract
□ Geographic restrictions enabled if business case

[Phase 4 — 2027]
□ Cloudflare Business plan upgrade
□ Cloudflare Bot Management (paid tier) for advanced ML scoring
□ Fail-closed rate limiting on write endpoints
```

## 7. Monitoring + Telemetry

- All edge actions emit Datadog metrics:
  - `sherpa.edge.cloudflare.block`
  - `sherpa.edge.cloudflare.challenge`
  - `sherpa.edge.botid.verdict` (tags: verdict, action_taken)
  - `sherpa.edge.rate_limit.exceeded` (tags: tier, endpoint_class)
- All edge actions emit Sherpa Guard audit log entries
- `D6: Error Rate per Route` shows 429 trends
- Dedicated `Edge Protection` dashboard tracks rule efficacy

## 8. Cost

| Component | Phase 1 monthly |
|-----------|-----------------|
| Cloudflare Pro | $25 |
| Upstash Redis (Pay-as-you-go) | $20-$80 (depending on req volume) |
| Vercel BotID | included with Vercel Pro/Enterprise |
| **Total Phase 1** | **<$150/mo** |

## 9. Maintenance

- **Owner**: SRE / Compliance lead (Phyrom interim)
- **Review cadence**: Monthly rule efficacy review; quarterly threshold tuning
- **Effective date**: 2026-06-15
