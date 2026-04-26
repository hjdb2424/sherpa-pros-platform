// ---------------------------------------------------------------------------
// Shared demo account definitions — used by web sign-in, mobile sign-in,
// and demo entry routes. Keep this as the single source of truth.
// ---------------------------------------------------------------------------

import type { UserRole, UserSubtype } from './auth/roles';

export type DemoRole = UserRole;

export interface DemoAccount {
  name: string;
  email: string;
  role: DemoRole;
  subtype: UserSubtype;
  badge: string;
  badgeColor: string;
  description: string;
  location: string;
}

// ── Property Managers (3) — subtype: null ─────────────────────────────────

export const PM_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Lisa Park',
    email: 'lisa.park@test.com',
    role: 'pm',
    subtype: null,
    badge: 'PM',
    badgeColor: '#8b5cf6',
    description: 'Seacoast Property Management — 48 units, 4 properties',
    location: 'Portsmouth, NH',
  },
  {
    name: 'David Chen',
    email: 'david.chen@test.com',
    role: 'pm',
    subtype: null,
    badge: 'PM',
    badgeColor: '#8b5cf6',
    description: 'Lone Star Realty — 120 units, 8 properties',
    location: 'Austin, TX',
  },
  {
    name: 'Rachel Torres',
    email: 'rachel.torres@test.com',
    role: 'pm',
    subtype: null,
    badge: 'PM',
    badgeColor: '#8b5cf6',
    description: 'Mile High Properties — 36 units, 3 properties',
    location: 'Denver, CO',
  },
];

// ── Service Pros (10) — 7 standard + 3 flex ──────────────────────────────

export const PRO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@test.com',
    role: 'pro',
    subtype: 'standard',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Licensed Plumber — 4.9 stars, Gold tier, 12% fee',
    location: 'Portsmouth, NH',
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@test.com',
    role: 'pro',
    subtype: 'standard',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'HVAC Technician — 4.8 stars, Silver tier, 12% fee',
    location: 'Tampa, FL',
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@test.com',
    role: 'pro',
    subtype: 'standard',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Master Electrician — 4.9 stars, Gold tier, 12% fee',
    location: 'Austin, TX',
  },
  {
    name: 'Carlos Rivera',
    email: 'carlos.rivera@test.com',
    role: 'pro',
    subtype: 'standard',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'General Contractor — 4.7 stars, Silver tier, 12% fee',
    location: 'Los Angeles, CA',
  },
  {
    name: 'Tom Sullivan',
    email: 'tom.sullivan@test.com',
    role: 'pro',
    subtype: 'standard',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Roofer — 4.6 stars, Silver tier, 12% fee',
    location: 'Chicago, IL',
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos@test.com',
    role: 'pro',
    subtype: 'standard',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Landscaper — 4.9 stars, Gold tier, 12% fee',
    location: 'Atlanta, GA',
  },
  {
    name: "Kevin O'Brien",
    email: 'kevin.obrien@test.com',
    role: 'pro',
    subtype: 'standard',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Carpenter / Finish Work — 4.7 stars, Bronze tier, 12% fee',
    location: 'Seattle, WA',
  },
  // ── Flex Pros (3) ──
  {
    name: 'Jenny Kim',
    email: 'jenny.kim@test.com',
    role: 'pro',
    subtype: 'flex',
    badge: 'Flex',
    badgeColor: '#f59e0b',
    description: 'General Handyman — 4.8 stars, Flex (18% incl. insurance)',
    location: 'Phoenix, AZ',
  },
  {
    name: 'Andre Mitchell',
    email: 'andre.mitchell@test.com',
    role: 'pro',
    subtype: 'flex',
    badge: 'Flex',
    badgeColor: '#f59e0b',
    description: 'Appliance Repair — 4.5 stars, Flex (18% incl. insurance)',
    location: 'Brooklyn, NY',
  },
  {
    name: 'Diana Brooks',
    email: 'diana.brooks@test.com',
    role: 'pro',
    subtype: 'flex',
    badge: 'Flex',
    badgeColor: '#f59e0b',
    description: 'Interior Painter — 4.8 stars, Flex (18% incl. insurance)',
    location: 'Denver, CO',
  },
];

// ── Clients (10) — 6 residential + 2 residential_pro + 2 commercial ──────

export const CLIENT_ACCOUNTS: DemoAccount[] = [
  // ── Residential (6) ──
  {
    name: 'Jamie Davis',
    email: 'jamie.davis@test.com',
    role: 'client',
    subtype: 'residential',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Homeowner — 3 projects completed',
    location: 'Portsmouth, NH',
  },
  {
    name: 'Morgan Lee',
    email: 'morgan.lee@test.com',
    role: 'client',
    subtype: 'residential',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Homeowner — 1 active project',
    location: 'Dallas, TX',
  },
  {
    name: 'Sam Patel',
    email: 'sam.patel@test.com',
    role: 'client',
    subtype: 'residential',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Condo owner — 2 projects',
    location: 'San Diego, CA',
  },
  {
    name: 'Chris Thompson',
    email: 'chris.thompson@test.com',
    role: 'client',
    subtype: 'residential',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Homeowner — new user',
    location: 'Exeter, NH',
  },
  {
    name: 'Jordan Williams',
    email: 'jordan.williams@test.com',
    role: 'client',
    subtype: 'residential',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'First-time homebuyer — new user',
    location: 'Charlotte, NC',
  },
  {
    name: 'Casey Martin',
    email: 'casey.martin@test.com',
    role: 'client',
    subtype: 'residential',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Homeowner — 2 active projects',
    location: 'Portland, OR',
  },
  // ── Residential Pro / Investor (2) ──
  {
    name: 'Taylor Kim',
    email: 'taylor.kim@test.com',
    role: 'client',
    subtype: 'residential_pro',
    badge: 'Investor',
    badgeColor: '#10b981',
    description: 'Rental property investor — 5 properties, multi-unit',
    location: 'Nashville, TN',
  },
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@test.com',
    role: 'client',
    subtype: 'residential_pro',
    badge: 'Investor',
    badgeColor: '#10b981',
    description: 'Property investor — 3 flip projects in progress',
    location: 'Miami, FL',
  },
  // ── Commercial (2) ──
  {
    name: 'Riley Anderson',
    email: 'riley.anderson@test.com',
    role: 'client',
    subtype: 'commercial',
    badge: 'Commercial',
    badgeColor: '#6366f1',
    description: 'Retail space owner — 2 build-outs',
    location: 'Minneapolis, MN',
  },
  {
    name: 'Avery Brown',
    email: 'avery.brown@test.com',
    role: 'client',
    subtype: 'commercial',
    badge: 'Commercial',
    badgeColor: '#6366f1',
    description: 'Office building manager — 4 tenant improvements',
    location: 'Scottsdale, AZ',
  },
];

// ── All accounts ───────────────────────────────────────────────────────────

export const ALL_ACCOUNTS: DemoAccount[] = [
  ...PM_ACCOUNTS,
  ...PRO_ACCOUNTS,
  ...CLIENT_ACCOUNTS,
];

export function getDestination(role: DemoRole): string {
  if (role === 'pm') return '/pm/dashboard';
  if (role === 'pro') return '/pro/dashboard';
  return '/client/dashboard';
}
