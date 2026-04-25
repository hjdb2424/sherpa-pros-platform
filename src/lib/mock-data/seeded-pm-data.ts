/**
 * Seeded Per-User PM Data
 *
 * Pre-built property data for each beta PM account.
 * All monetary values in integer cents.
 */

export interface SeededProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRentCents: number;
  monthlyExpensesCents: number;
  openWorkOrders: number;
  lastInspection: string;
}

// ── Lisa Park — Seacoast PM, 48 units, 4 properties ─────────────

const LISA_PROPERTIES: SeededProperty[] = [
  {
    id: 'lp-prop-001',
    name: 'Maple Ridge Apartments',
    address: '45 Maple Ridge Dr, Portsmouth, NH 03801',
    city: 'Portsmouth',
    state: 'NH',
    totalUnits: 24,
    occupiedUnits: 22,
    monthlyRentCents: 3960000,
    monthlyExpensesCents: 1440000,
    openWorkOrders: 3,
    lastInspection: '2026-03-15',
  },
  {
    id: 'lp-prop-002',
    name: 'Harbor View Condos',
    address: '8 Harbor View Ln, Portsmouth, NH 03801',
    city: 'Portsmouth',
    state: 'NH',
    totalUnits: 12,
    occupiedUnits: 11,
    monthlyRentCents: 2640000,
    monthlyExpensesCents: 960000,
    openWorkOrders: 1,
    lastInspection: '2026-04-01',
  },
  {
    id: 'lp-prop-003',
    name: '220 Main Street',
    address: '220 Main St, Portsmouth, NH 03801',
    city: 'Portsmouth',
    state: 'NH',
    totalUnits: 8,
    occupiedUnits: 7,
    monthlyRentCents: 2800000,
    monthlyExpensesCents: 1050000,
    openWorkOrders: 2,
    lastInspection: '2026-02-20',
  },
  {
    id: 'lp-prop-004',
    name: 'College Park Student Housing',
    address: '312 College Ave, Durham, NH 03824',
    city: 'Durham',
    state: 'NH',
    totalUnits: 4,
    occupiedUnits: 4,
    monthlyRentCents: 520000,
    monthlyExpensesCents: 180000,
    openWorkOrders: 0,
    lastInspection: '2026-01-10',
  },
];

// ── David Chen — Granite State Realty, 120 units, 8 properties ──

const DAVID_PROPERTIES: SeededProperty[] = [
  {
    id: 'dc-prop-001',
    name: 'Skyline Tower',
    address: '1200 Congress Ave, Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    totalUnits: 40,
    occupiedUnits: 37,
    monthlyRentCents: 7200000,
    monthlyExpensesCents: 2800000,
    openWorkOrders: 5,
    lastInspection: '2026-04-05',
  },
  {
    id: 'dc-prop-002',
    name: 'Westfield Commons',
    address: '800 Westfield Blvd, Austin, TX 78745',
    city: 'Austin',
    state: 'TX',
    totalUnits: 20,
    occupiedUnits: 18,
    monthlyRentCents: 3400000,
    monthlyExpensesCents: 1200000,
    openWorkOrders: 3,
    lastInspection: '2026-03-20',
  },
  {
    id: 'dc-prop-003',
    name: 'Parkside Residences',
    address: '450 Parkside Dr, Round Rock, TX 78664',
    city: 'Round Rock',
    state: 'TX',
    totalUnits: 18,
    occupiedUnits: 16,
    monthlyRentCents: 2880000,
    monthlyExpensesCents: 1080000,
    openWorkOrders: 2,
    lastInspection: '2026-04-10',
  },
  {
    id: 'dc-prop-004',
    name: 'Downtown Lofts',
    address: '315 E 6th St, Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    totalUnits: 15,
    occupiedUnits: 14,
    monthlyRentCents: 3375000,
    monthlyExpensesCents: 1200000,
    openWorkOrders: 1,
    lastInspection: '2026-03-28',
  },
  {
    id: 'dc-prop-005',
    name: 'Cedar Ridge',
    address: '220 Cedar Ridge Rd, Georgetown, TX 78626',
    city: 'Georgetown',
    state: 'TX',
    totalUnits: 12,
    occupiedUnits: 11,
    monthlyRentCents: 1920000,
    monthlyExpensesCents: 720000,
    openWorkOrders: 1,
    lastInspection: '2026-02-15',
  },
  {
    id: 'dc-prop-006',
    name: 'Riverside Apartments',
    address: '90 River Rd, San Marcos, TX 78666',
    city: 'San Marcos',
    state: 'TX',
    totalUnits: 8,
    occupiedUnits: 7,
    monthlyRentCents: 1120000,
    monthlyExpensesCents: 440000,
    openWorkOrders: 2,
    lastInspection: '2026-01-30',
  },
  {
    id: 'dc-prop-007',
    name: 'Oak Hill Duplexes',
    address: '45 Oak Hill Ln, Buda, TX 78610',
    city: 'Buda',
    state: 'TX',
    totalUnits: 4,
    occupiedUnits: 4,
    monthlyRentCents: 640000,
    monthlyExpensesCents: 240000,
    openWorkOrders: 0,
    lastInspection: '2026-03-01',
  },
  {
    id: 'dc-prop-008',
    name: 'The Station',
    address: '12 Depot St, Dripping Springs, TX 78620',
    city: 'Dripping Springs',
    state: 'TX',
    totalUnits: 3,
    occupiedUnits: 3,
    monthlyRentCents: 540000,
    monthlyExpensesCents: 195000,
    openWorkOrders: 0,
    lastInspection: '2026-04-12',
  },
];

// ── Rachel Torres — Coastal Living, 36 units, 3 properties ─────

const RACHEL_PROPERTIES: SeededProperty[] = [
  {
    id: 'rt-prop-001',
    name: 'Ocean Breeze Apartments',
    address: '1500 Blake St, Denver, CO 80202',
    city: 'Denver',
    state: 'CO',
    totalUnits: 18,
    occupiedUnits: 16,
    monthlyRentCents: 3240000,
    monthlyExpensesCents: 1260000,
    openWorkOrders: 4,
    lastInspection: '2026-03-22',
  },
  {
    id: 'rt-prop-002',
    name: 'Mountain View Condos',
    address: '800 Pearl St, Boulder, CO 80302',
    city: 'Boulder',
    state: 'CO',
    totalUnits: 12,
    occupiedUnits: 11,
    monthlyRentCents: 2640000,
    monthlyExpensesCents: 960000,
    openWorkOrders: 2,
    lastInspection: '2026-04-08',
  },
  {
    id: 'rt-prop-003',
    name: 'Pine Street Townhomes',
    address: '42 Pine St, Golden, CO 80401',
    city: 'Golden',
    state: 'CO',
    totalUnits: 6,
    occupiedUnits: 5,
    monthlyRentCents: 1080000,
    monthlyExpensesCents: 420000,
    openWorkOrders: 1,
    lastInspection: '2026-02-28',
  },
];

// ── Export map by email ─────────────────────────────────────────

export const PM_SEEDED_DATA: Record<string, SeededProperty[]> = {
  'lisa.park@test.com': LISA_PROPERTIES,
  'david.chen@test.com': DAVID_PROPERTIES,
  'rachel.torres@test.com': RACHEL_PROPERTIES,
};

/** Get properties for a given PM email, returns empty array if unknown */
export function getSeededProperties(email: string): SeededProperty[] {
  return PM_SEEDED_DATA[email] ?? [];
}
