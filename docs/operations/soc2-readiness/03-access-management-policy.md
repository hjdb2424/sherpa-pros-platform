---
title: Access Management Policy
date: 2026-04-25
status: draft
owner: Phyrom + future SRE / Compliance lead
references:
  - src/middleware.ts (Sherpa Guard RBAC)
  - src/db/migrations/008_audit_logs.sql
  - src/lib/audit.ts
  - docs/superpowers/specs/2026-04-25-platform-scale-architecture-design.md
soc2_controls: [CC6.1, CC6.2, CC6.3, CC6.6, CC6.7, CC6.8]
---

# Access Management Policy

## 1. Purpose

This policy defines how Sherpa Pros provisions, reviews, modifies, and revokes access to systems, data, and infrastructure. It satisfies SOC 2 Common Criteria CC6 (Logical and Physical Access Controls).

## 2. Scope

Applies to:

- All employees, contractors, advisors, and interns of Sherpa Pros
- All systems containing customer or company data: production application (Sherpa Guard middleware-protected), Neon Postgres, Vercel, Clerk admin, Stripe Connect dashboard, AWS console, GitHub org, Linear, PagerDuty, Datadog, Cloudflare, Vanta, internal tools
- All third-party SaaS vendors with access to customer data

## 3. Roles + Responsibilities

| Role | Responsibility |
|------|----------------|
| **HR (Phyrom until hire)** | Triggers all provisioning + termination workflows |
| **Hiring manager** | Approves access requests with documented business justification |
| **IT / SRE (future hire)** | Executes provisioning + termination; runs quarterly access reviews |
| **System owner** (e.g., DB admin for Neon) | Maintains role-to-permission mapping for their system |
| **All employees** | Report suspected unauthorized access within 1 hour |

## 4. Account Provisioning Workflow

```
[HR triggers] → [Hiring manager approves] → [IT/SRE executes] → [Audit log entry]
```

### 4.1 New employee onboarding (Day 0 — Day 1)

- [ ] HR creates onboarding ticket in Linear with role + start date + manager
- [ ] Hiring manager submits access request listing every system + role tier required
- [ ] IT/SRE provisions: SSO account (Okta or Google Workspace), GitHub org seat, Linear seat, PagerDuty seat (if on-call), Datadog seat, system-specific roles via Sherpa Guard tier mapping
- [ ] Account creation triggers **MFA enrollment within 24 hours** (mandatory)
- [ ] Manager assigns least-privilege role tier per `src/middleware.ts` Sherpa Guard taxonomy (homeowner, pro, pm_admin, sherpa_admin, internal_eng)
- [ ] Audit log entry written to `audit_logs` table via `src/lib/audit.ts` with action `account.provisioned`
- [ ] Employee completes security training within 7 days (CC1.4 evidence)

### 4.2 Role change (promotion / lateral move)

- [ ] Manager submits role-change request in Linear with effective date
- [ ] IT/SRE removes old role tier first, adds new role tier second (no role-stacking)
- [ ] Audit log entry with action `role.changed` capturing old + new tier

## 5. Role Tiers (Sherpa Guard RBAC)

Reference: `src/middleware.ts`

| Tier | Description | Production access | Audit log read |
|------|-------------|-------------------|----------------|
| **homeowner** | Customer end-user | Own data only | No |
| **pro** | Verified trade pro | Own jobs + dispatched data | No |
| **pm_admin** | Property manager admin | Org-scoped data | Org-scoped |
| **sherpa_admin** | Internal Sherpa Pros admin | Read-most production data | Yes |
| **internal_eng** | Engineering staff | Staging full / Production via PR + CI/CD only | Yes |
| **internal_finance** | Finance / bookkeeper | Read Stripe + reporting; no app-level edit | Yes |
| **internal_compliance** | Compliance / SRE | Audit log read + control evidence read; no production write | Yes |

## 6. Access Review Cadence

### 6.1 Quarterly access review (mandatory — CC6.2)

Performed within 30 days of each calendar quarter end (Jan 31, Apr 30, Jul 31, Oct 31).

- [ ] IT/SRE exports current role assignments per system using Vanta integration pulls
- [ ] Each system owner reviews assignments and confirms or flags for removal
- [ ] Manager validates each direct report's access still matches job duties
- [ ] All flags resolved within 7 days; revocations executed and audit-logged
- [ ] Vanta records review completion as evidence
- [ ] Sample access review template stored in `docs/operations/soc2-readiness/templates/quarterly-access-review.csv`

### 6.2 Annual privileged access review

- [ ] All `sherpa_admin`, `internal_eng`, `internal_compliance` accounts re-justified annually
- [ ] All AWS IAM users with production access re-justified
- [ ] All GitHub org admins re-justified
- [ ] Findings reported to Phyrom with action items

## 7. Termination Workflow

```
[Termination decision] → [Same-day access revocation] → [30-day deactivation] → [90-day data retention review]
```

### 7.1 Day 0 — Same-day immediate revocation

- [ ] HR notifies IT/SRE within 1 hour of termination decision
- [ ] IT/SRE executes the **revocation runbook** (see Section 7.4) within 4 business hours
- [ ] **All MFA tokens revoked**
- [ ] **SSO session terminated**; all OAuth grants revoked
- [ ] GitHub org seat removed; PRs reassigned
- [ ] PagerDuty rotation updated to remove user
- [ ] Audit log entry `account.terminated` written via `src/lib/audit.ts` with reason code

### 7.2 Day 30 — Deactivation

- [ ] Account marked deactivated (not deleted) in all systems
- [ ] Email forwarding configured to manager for 30 days post-termination
- [ ] Personal devices wiped (MDM-enforced if BYOD enrolled)

### 7.3 Day 90 — Data retention review

- [ ] Personal data exported per departing employee request (GDPR-aligned even though we are US-only)
- [ ] Account deletion executed except where retention required by audit log policy (7 years for security-relevant events)
- [ ] Compliance lead signs off

### 7.4 Termination Revocation Runbook (Day 0)

```
□ Clerk: revoke session, disable MFA, lock account
□ Okta / Google Workspace SSO: suspend user
□ GitHub: remove from org, revoke PATs, transfer ownership of any repos
□ Vercel: remove team member
□ Neon: revoke DB user (no employees should have direct DB user — escalate if found)
□ Stripe Connect dashboard: remove user
□ AWS IAM: disable user, rotate any access keys, transfer ownership of resources
□ Cloudflare: remove user from team
□ Datadog: remove user from organization
□ Vanta: mark employee terminated → triggers Vanta access cleanup workflow
□ PagerDuty: remove from rotation, deactivate user
□ Linear: archive seat
□ 1Password / LastPass: remove from shared vaults; force re-encryption of secrets accessed by user
□ Slack / messaging: deactivate
□ Twilio sub-account access: remove
□ Tremendous, Zinc API, Uber Direct admin consoles: remove user
□ Audit log: write account.terminated entry with reason code, executor, timestamp
```

## 8. Authentication Standards

### 8.1 Mandatory controls

- **MFA required for all employee accounts** — TOTP or hardware token; SMS allowed only as fallback
- **SSO via Clerk + Okta or Google Workspace** — single identity provider source of truth
- **Password policy** (where SSO not possible): minimum 16 characters, no rotation requirement (per NIST 800-63B), breach-list checked via Have I Been Pwned API
- **Session timeout**: 12 hours idle, 30 days max
- **Conditional access**: country restrictions (US + approved travel only), device posture check (MDM compliant), risky-sign-in blocking

### 8.2 Privileged access controls

- All `internal_eng`, `sherpa_admin`, `internal_compliance` tier accounts require **hardware MFA** (YubiKey)
- All AWS IAM access requires hardware MFA
- All GitHub admin actions require commit signing via SSH or GPG key tied to hardware token
- Production database access via Neon admin requires break-glass procedure (see Section 10)

## 9. Principle of Least Privilege + Separation of Duties

### 9.1 Least privilege

- New accounts default to **homeowner tier**; elevated tiers granted only with documented business justification
- Role tiers cannot be combined; user holds exactly one role tier at a time
- Vendor third-party access scoped to minimum required (e.g., Tremendous account access limited to fulfillment team)

### 9.2 Separation of duties (CC6.3)

- **No developer has direct production database access.** All schema changes flow through PR + CI/CD migration runner.
- **No developer can deploy to production.** Vercel production deploys gated by CI/CD pipeline that requires PR merge to `main`.
- **The same person cannot both write a payment-related code change and approve its PR.** Senior engineer + Phyrom rotation enforces this.
- **Finance access is read-only at the app level.** Finance modifies via Stripe dashboard with audit trail.

## 10. Credentials Management

### 10.1 Mandatory rules

- **Credentials never committed to source code.** Pre-commit hook scans for AWS / Stripe / Clerk / Twilio key patterns; CI fails on detection.
- **All production secrets stored in AWS Secrets Manager** (migration plan in `12-aws-secrets-manager-migration.md`)
- **Tier 3 / non-sensitive config stored in Vercel Edge Config**
- **Local dev secrets stored in 1Password** team vault; never in `.env` files committed to repo
- **Rotation policy**: Tier 1 secrets every 90 days; Tier 2 every 180 days

### 10.2 Break-glass procedure (production database direct access)

Used only for incident response when application-layer access is insufficient.

- [ ] On-call engineer raises break-glass request in PagerDuty incident channel
- [ ] Phyrom (or future CTO) approves in writing within incident channel
- [ ] Temporary Neon admin credentials issued via AWS Secrets Manager with **4-hour TTL**
- [ ] All queries logged via Neon query log + Datadog APM
- [ ] Post-incident: credentials rotated, audit log reviewed, postmortem documents what was accessed

## 11. Sample Access Review Template

`docs/operations/soc2-readiness/templates/quarterly-access-review.csv` (to be created)

```csv
quarter,system,user_email,role_tier,last_login,manager_review_status,manager_signoff_date,system_owner_review_status,system_owner_signoff_date,action_taken,action_date,audit_log_id
2026-Q3,vercel,phyrom@hjd.builders,owner,2026-09-29,confirmed,2026-10-15,confirmed,2026-10-15,no_change,,
2026-Q3,neon,sre@thesherpapros.com,admin,2026-09-28,confirmed,2026-10-15,confirmed,2026-10-15,no_change,,
2026-Q3,github,contractor1@thesherpapros.com,write,2026-09-15,flag_for_removal,2026-10-15,confirmed,2026-10-15,access_revoked,2026-10-16,al_a3f9e2b1
```

## 12. Quarterly Access Review Runbook

```
T-30: Calendar reminder fires for IT/SRE owner
T-21: IT/SRE pulls role exports from each integrated system via Vanta
T-21: Spreadsheet auto-populated with template above; emailed to each manager
T-14: Managers + system owners complete reviews; flag rows for removal
T-7:  IT/SRE executes flagged removals; audit log entries written
T-7:  Vanta records review completion as evidence
T-0:  Phyrom signs off in Vanta; report archived for auditor
T+7:  Any remediation gaps escalated to next-quarter remediation backlog
```

## 13. Policy Maintenance

- **Owner**: Phyrom (until SRE/Compliance hire); thereafter SRE/Compliance lead
- **Review cadence**: Annual (every 2026-04-25 anniversary)
- **Change control**: Edits via PR with compliance lead approval; version history in Vanta
- **Effective date**: 2026-06-01 (post-Vanta + Schellman engagement)
