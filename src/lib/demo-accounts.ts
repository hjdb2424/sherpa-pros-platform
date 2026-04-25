// ---------------------------------------------------------------------------
// Shared demo account definitions — used by web sign-in, mobile sign-in,
// and demo entry routes. Keep this as the single source of truth.
// ---------------------------------------------------------------------------

export type DemoRole = 'pm' | 'pro' | 'client';

export interface DemoAccount {
  name: string;
  email: string;
  role: DemoRole;
  badge: string;
  badgeColor: string;
  description: string;
  location: string;
}

// ── Property Managers (3) ──────────────────────────────────────────────────

export const PM_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Lisa Park',
    email: 'lisa.park@test.com',
    role: 'pm',
    badge: 'PM',
    badgeColor: '#8b5cf6',
    description: 'Seacoast Property Management — 48 units, 4 properties',
    location: 'Portsmouth, NH',
  },
  {
    name: 'David Chen',
    email: 'david.chen@test.com',
    role: 'pm',
    badge: 'PM',
    badgeColor: '#8b5cf6',
    description: 'Granite State Realty — 120 units, 8 properties',
    location: 'Manchester, NH',
  },
  {
    name: 'Rachel Torres',
    email: 'rachel.torres@test.com',
    role: 'pm',
    badge: 'PM',
    badgeColor: '#8b5cf6',
    description: 'Coastal Living Properties — 36 units, 3 properties',
    location: 'Dover, NH',
  },
];

// ── Service Pros (10) ──────────────────────────────────────────────────────

export const PRO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Licensed Plumber — 4.9 stars, Gold tier',
    location: 'Portsmouth, NH',
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'HVAC Technician — 4.8 stars, Silver tier',
    location: 'Dover, NH',
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Master Electrician — 4.9 stars, Gold tier',
    location: 'Exeter, NH',
  },
  {
    name: 'Carlos Rivera',
    email: 'carlos.rivera@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'General Contractor — 4.7 stars, Silver tier',
    location: 'Newmarket, NH',
  },
  {
    name: 'Diana Brooks',
    email: 'diana.brooks@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Interior Painter — 4.8 stars, Bronze tier',
    location: 'Kittery, ME',
  },
  {
    name: 'Tom Sullivan',
    email: 'tom.sullivan@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Roofer — 4.6 stars, Silver tier',
    location: 'Hampton, NH',
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Landscaper — 4.9 stars, Gold tier',
    location: 'Rye, NH',
  },
  {
    name: 'Kevin O\'Brien',
    email: 'kevin.obrien@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Carpenter / Finish Work — 4.7 stars, Bronze tier',
    location: 'Somersworth, NH',
  },
  {
    name: 'Andre Mitchell',
    email: 'andre.mitchell@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'Appliance Repair — 4.5 stars, Bronze tier',
    location: 'Rochester, NH',
  },
  {
    name: 'Jenny Kim',
    email: 'jenny.kim@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: '#ff4500',
    description: 'General Handyman — 4.8 stars, Silver tier',
    location: 'Newburyport, MA',
  },
];

// ── Clients (10) ───────────────────────────────────────────────────────────

export const CLIENT_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Jamie Davis',
    email: 'jamie.davis@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Homeowner — 3 projects completed',
    location: 'Portsmouth, NH',
  },
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Property owner — new user',
    location: 'Dover, NH',
  },
  {
    name: 'Morgan Lee',
    email: 'morgan.lee@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Homeowner — 1 active project',
    location: 'Kittery, ME',
  },
  {
    name: 'Sam Patel',
    email: 'sam.patel@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Condo owner — 2 projects',
    location: 'Hampton, NH',
  },
  {
    name: 'Chris Thompson',
    email: 'chris.thompson@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Homeowner — new user',
    location: 'Exeter, NH',
  },
  {
    name: 'Taylor Kim',
    email: 'taylor.kim@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Rental property owner — 5 projects',
    location: 'Newmarket, NH',
  },
  {
    name: 'Jordan Williams',
    email: 'jordan.williams@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'First-time homebuyer — new user',
    location: 'Rochester, NH',
  },
  {
    name: 'Casey Martin',
    email: 'casey.martin@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Homeowner — 2 active projects',
    location: 'Rye, NH',
  },
  {
    name: 'Riley Anderson',
    email: 'riley.anderson@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Condo owner — new user',
    location: 'Somersworth, NH',
  },
  {
    name: 'Avery Brown',
    email: 'avery.brown@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: '#00a9e0',
    description: 'Homeowner — 4 projects completed',
    location: 'Newburyport, MA',
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
