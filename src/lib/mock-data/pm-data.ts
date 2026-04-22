/**
 * PM (Property Management) Tier — Mock Data
 *
 * Realistic sample data for development when DB is not connected.
 * 4 properties, 12 work orders, 5 vendors, 6 schedules,
 * 3 make-readies, 8 compliance items, and analytics.
 */

// ---------------------------------------------------------------------------
// Stable UUIDs for referential integrity
// ---------------------------------------------------------------------------

const PM_USER_ID = "a1000000-0000-0000-0000-000000000001";
const TENANT_IDS = {
  t1: "b1000000-0000-0000-0000-000000000001",
  t2: "b1000000-0000-0000-0000-000000000002",
  t3: "b1000000-0000-0000-0000-000000000003",
  t4: "b1000000-0000-0000-0000-000000000004",
};
const PRO_IDS = {
  p1: "c1000000-0000-0000-0000-000000000001",
  p2: "c1000000-0000-0000-0000-000000000002",
  p3: "c1000000-0000-0000-0000-000000000003",
  p4: "c1000000-0000-0000-0000-000000000004",
  p5: "c1000000-0000-0000-0000-000000000005",
};
const PROPERTY_IDS = {
  maple: "d1000000-0000-0000-0000-000000000001",
  main: "d1000000-0000-0000-0000-000000000002",
  harbor: "d1000000-0000-0000-0000-000000000003",
  student: "d1000000-0000-0000-0000-000000000004",
};
const UNIT_IDS = {
  maple101: "e1000000-0000-0000-0000-000000000001",
  maple102: "e1000000-0000-0000-0000-000000000002",
  maple201: "e1000000-0000-0000-0000-000000000003",
  maple202: "e1000000-0000-0000-0000-000000000004",
  main1a: "e1000000-0000-0000-0000-000000000005",
  main1b: "e1000000-0000-0000-0000-000000000006",
  harbor101: "e1000000-0000-0000-0000-000000000007",
  harbor102: "e1000000-0000-0000-0000-000000000008",
  student1a: "e1000000-0000-0000-0000-000000000009",
  student1b: "e1000000-0000-0000-0000-000000000010",
};
const WO_IDS = {
  wo1: "f1000000-0000-0000-0000-000000000001",
  wo2: "f1000000-0000-0000-0000-000000000002",
  wo3: "f1000000-0000-0000-0000-000000000003",
  wo4: "f1000000-0000-0000-0000-000000000004",
  wo5: "f1000000-0000-0000-0000-000000000005",
  wo6: "f1000000-0000-0000-0000-000000000006",
  wo7: "f1000000-0000-0000-0000-000000000007",
  wo8: "f1000000-0000-0000-0000-000000000008",
  wo9: "f1000000-0000-0000-0000-000000000009",
  wo10: "f1000000-0000-0000-0000-000000000010",
  wo11: "f1000000-0000-0000-0000-000000000011",
  wo12: "f1000000-0000-0000-0000-000000000012",
};
const VENDOR_IDS = {
  v1: "71000000-0000-0000-0000-000000000001",
  v2: "71000000-0000-0000-0000-000000000002",
  v3: "71000000-0000-0000-0000-000000000003",
  v4: "71000000-0000-0000-0000-000000000004",
  v5: "71000000-0000-0000-0000-000000000005",
};
const SCHED_IDS = {
  s1: "81000000-0000-0000-0000-000000000001",
  s2: "81000000-0000-0000-0000-000000000002",
  s3: "81000000-0000-0000-0000-000000000003",
  s4: "81000000-0000-0000-0000-000000000004",
  s5: "81000000-0000-0000-0000-000000000005",
  s6: "81000000-0000-0000-0000-000000000006",
};
const MR_IDS = {
  mr1: "91000000-0000-0000-0000-000000000001",
  mr2: "91000000-0000-0000-0000-000000000002",
  mr3: "91000000-0000-0000-0000-000000000003",
};
const COMP_IDS = {
  c1: "a2000000-0000-0000-0000-000000000001",
  c2: "a2000000-0000-0000-0000-000000000002",
  c3: "a2000000-0000-0000-0000-000000000003",
  c4: "a2000000-0000-0000-0000-000000000004",
  c5: "a2000000-0000-0000-0000-000000000005",
  c6: "a2000000-0000-0000-0000-000000000006",
  c7: "a2000000-0000-0000-0000-000000000007",
  c8: "a2000000-0000-0000-0000-000000000008",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MockProperty {
  id: string;
  pm_user_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  property_type: string;
  unit_count: number;
  total_sqft: number;
  year_built: number;
  monthly_budget_cents: number;
  reserve_fund_cents: number;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockUnit {
  id: string;
  property_id: string;
  unit_number: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  tenant_user_id: string | null;
  monthly_rent_cents: number;
  lease_start: string | null;
  lease_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockWorkOrder {
  id: string;
  property_id: string;
  unit_id: string | null;
  pm_user_id: string;
  tenant_user_id: string | null;
  assigned_pro_id: string | null;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  sla_hours: number;
  budget_cents: number;
  actual_cost_cents: number | null;
  expense_type: string;
  po_number: string | null;
  submitted_by: string;
  photos: unknown[];
  created_at: string;
  dispatched_at: string | null;
  completed_at: string | null;
}

export interface MockPreferredVendor {
  id: string;
  pm_user_id: string;
  pro_id: string;
  trade_category: string;
  negotiated_rate_cents: number | null;
  priority_rank: number;
  insurance_verified: boolean;
  insurance_expiry: string;
  notes: string;
  created_at: string;
}

export interface MockMaintenanceSchedule {
  id: string;
  property_id: string;
  unit_id: string | null;
  title: string;
  description: string;
  category: string;
  frequency: string;
  next_due: string;
  last_completed: string | null;
  estimated_cost_cents: number;
  preferred_vendor_id: string | null;
  auto_dispatch: boolean;
  created_at: string;
}

export interface MockMakeReady {
  id: string;
  unit_id: string;
  property_id: string;
  vacate_date: string;
  target_ready_date: string;
  actual_ready_date: string | null;
  status: string;
  punch_list: Array<{ item: string; status: string }>;
  total_cost_cents: number;
  work_order_ids: string[];
  created_at: string;
}

export interface MockComplianceItem {
  id: string;
  property_id: string;
  item_type: string;
  description: string;
  due_date: string;
  completed_date: string | null;
  status: string;
  certificate_url: string | null;
  notes: string;
  created_at: string;
}

export interface MockPmAnalytics {
  total_properties: number;
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  monthly_gross_rent_cents: number;
  monthly_opex_cents: number;
  noi_cents: number;
  avg_cost_per_unit_cents: number;
  budget_variance_pct: number;
  open_work_orders: number;
  avg_completion_days: number;
  overdue_compliance: number;
}

// ---------------------------------------------------------------------------
// PROPERTIES (4)
// ---------------------------------------------------------------------------

export const mockProperties: MockProperty[] = [
  {
    id: PROPERTY_IDS.maple,
    pm_user_id: PM_USER_ID,
    name: "Maple Ridge Apartments",
    address: "45 Maple Ridge Dr",
    city: "Manchester",
    state: "NH",
    zip: "03101",
    property_type: "multi_family",
    unit_count: 48,
    total_sqft: 52800,
    year_built: 1992,
    monthly_budget_cents: 2400000,
    reserve_fund_cents: 18000000,
    location: null,
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
  {
    id: PROPERTY_IDS.main,
    pm_user_id: PM_USER_ID,
    name: "220 Main St Mixed-Use",
    address: "220 Main St",
    city: "Nashua",
    state: "NH",
    zip: "03060",
    property_type: "mixed_use",
    unit_count: 15,
    total_sqft: 28500,
    year_built: 1968,
    monthly_budget_cents: 950000,
    reserve_fund_cents: 7500000,
    location: null,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2026-03-28T00:00:00Z",
  },
  {
    id: PROPERTY_IDS.harbor,
    pm_user_id: PM_USER_ID,
    name: "Harbor View Condos",
    address: "8 Harbor View Ln",
    city: "Portsmouth",
    state: "NH",
    zip: "03801",
    property_type: "hoa",
    unit_count: 24,
    total_sqft: 36000,
    year_built: 2005,
    monthly_budget_cents: 1600000,
    reserve_fund_cents: 12000000,
    location: null,
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2026-04-10T00:00:00Z",
  },
  {
    id: PROPERTY_IDS.student,
    pm_user_id: PM_USER_ID,
    name: "Elm Street Student Housing",
    address: "312 Elm St",
    city: "Durham",
    state: "NH",
    zip: "03824",
    property_type: "multi_family",
    unit_count: 36,
    total_sqft: 27000,
    year_built: 1985,
    monthly_budget_cents: 1800000,
    reserve_fund_cents: 9500000,
    location: null,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2026-04-05T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// UNITS (10 sample — real properties would have more)
// ---------------------------------------------------------------------------

export const mockUnits: MockUnit[] = [
  {
    id: UNIT_IDS.maple101,
    property_id: PROPERTY_IDS.maple,
    unit_number: "101",
    sqft: 850,
    bedrooms: 2,
    bathrooms: 1,
    status: "occupied",
    tenant_user_id: TENANT_IDS.t1,
    monthly_rent_cents: 165000,
    lease_start: "2025-09-01",
    lease_end: "2026-08-31",
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2025-09-01T00:00:00Z",
  },
  {
    id: UNIT_IDS.maple102,
    property_id: PROPERTY_IDS.maple,
    unit_number: "102",
    sqft: 900,
    bedrooms: 2,
    bathrooms: 1,
    status: "make_ready",
    tenant_user_id: null,
    monthly_rent_cents: 170000,
    lease_start: null,
    lease_end: null,
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
  {
    id: UNIT_IDS.maple201,
    property_id: PROPERTY_IDS.maple,
    unit_number: "201",
    sqft: 1100,
    bedrooms: 3,
    bathrooms: 2,
    status: "occupied",
    tenant_user_id: TENANT_IDS.t2,
    monthly_rent_cents: 195000,
    lease_start: "2025-06-01",
    lease_end: "2026-05-31",
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2025-06-01T00:00:00Z",
  },
  {
    id: UNIT_IDS.maple202,
    property_id: PROPERTY_IDS.maple,
    unit_number: "202",
    sqft: 1100,
    bedrooms: 3,
    bathrooms: 2,
    status: "vacant",
    tenant_user_id: null,
    monthly_rent_cents: 195000,
    lease_start: null,
    lease_end: null,
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: UNIT_IDS.main1a,
    property_id: PROPERTY_IDS.main,
    unit_number: "1A",
    sqft: 2200,
    bedrooms: 0,
    bathrooms: 2,
    status: "occupied",
    tenant_user_id: TENANT_IDS.t3,
    monthly_rent_cents: 350000,
    lease_start: "2025-01-15",
    lease_end: "2028-01-14",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: UNIT_IDS.main1b,
    property_id: PROPERTY_IDS.main,
    unit_number: "1B",
    sqft: 1800,
    bedrooms: 0,
    bathrooms: 1,
    status: "vacant",
    tenant_user_id: null,
    monthly_rent_cents: 285000,
    lease_start: null,
    lease_end: null,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2026-02-28T00:00:00Z",
  },
  {
    id: UNIT_IDS.harbor101,
    property_id: PROPERTY_IDS.harbor,
    unit_number: "101",
    sqft: 1500,
    bedrooms: 2,
    bathrooms: 2,
    status: "occupied",
    tenant_user_id: TENANT_IDS.t4,
    monthly_rent_cents: 225000,
    lease_start: "2025-07-01",
    lease_end: "2026-06-30",
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-07-01T00:00:00Z",
  },
  {
    id: UNIT_IDS.harbor102,
    property_id: PROPERTY_IDS.harbor,
    unit_number: "102",
    sqft: 1500,
    bedrooms: 2,
    bathrooms: 2,
    status: "occupied",
    tenant_user_id: null,
    monthly_rent_cents: 225000,
    lease_start: "2025-08-01",
    lease_end: "2026-07-31",
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-08-01T00:00:00Z",
  },
  {
    id: UNIT_IDS.student1a,
    property_id: PROPERTY_IDS.student,
    unit_number: "1A",
    sqft: 600,
    bedrooms: 1,
    bathrooms: 1,
    status: "occupied",
    tenant_user_id: null,
    monthly_rent_cents: 125000,
    lease_start: "2025-08-15",
    lease_end: "2026-05-15",
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2025-08-15T00:00:00Z",
  },
  {
    id: UNIT_IDS.student1b,
    property_id: PROPERTY_IDS.student,
    unit_number: "1B",
    sqft: 600,
    bedrooms: 1,
    bathrooms: 1,
    status: "make_ready",
    tenant_user_id: null,
    monthly_rent_cents: 125000,
    lease_start: null,
    lease_end: null,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2026-04-10T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// WORK ORDERS (12)
// ---------------------------------------------------------------------------

export const mockWorkOrders: MockWorkOrder[] = [
  {
    id: WO_IDS.wo1,
    property_id: PROPERTY_IDS.maple,
    unit_id: UNIT_IDS.maple101,
    pm_user_id: PM_USER_ID,
    tenant_user_id: TENANT_IDS.t1,
    assigned_pro_id: PRO_IDS.p1,
    title: "Kitchen faucet leaking",
    description: "Tenant reports persistent drip from kitchen faucet, worsening over past week.",
    category: "plumbing",
    priority: "routine",
    status: "completed",
    sla_hours: 72,
    budget_cents: 25000,
    actual_cost_cents: 18500,
    expense_type: "opex",
    po_number: "PO-2026-0041",
    submitted_by: "tenant",
    photos: [],
    created_at: "2026-03-15T10:00:00Z",
    dispatched_at: "2026-03-15T14:30:00Z",
    completed_at: "2026-03-17T11:00:00Z",
  },
  {
    id: WO_IDS.wo2,
    property_id: PROPERTY_IDS.maple,
    unit_id: UNIT_IDS.maple201,
    pm_user_id: PM_USER_ID,
    tenant_user_id: TENANT_IDS.t2,
    assigned_pro_id: PRO_IDS.p2,
    title: "HVAC not cooling",
    description: "AC unit blowing warm air. System is 8 years old.",
    category: "hvac",
    priority: "urgent",
    status: "in_progress",
    sla_hours: 24,
    budget_cents: 50000,
    actual_cost_cents: null,
    expense_type: "opex",
    po_number: "PO-2026-0058",
    submitted_by: "tenant",
    photos: [],
    created_at: "2026-04-12T08:15:00Z",
    dispatched_at: "2026-04-12T09:00:00Z",
    completed_at: null,
  },
  {
    id: WO_IDS.wo3,
    property_id: PROPERTY_IDS.maple,
    unit_id: null,
    pm_user_id: PM_USER_ID,
    tenant_user_id: null,
    assigned_pro_id: PRO_IDS.p3,
    title: "Parking lot pothole repair",
    description: "Three large potholes near building B entrance. Safety hazard.",
    category: "exterior",
    priority: "routine",
    status: "approved",
    sla_hours: 168,
    budget_cents: 350000,
    actual_cost_cents: null,
    expense_type: "capex",
    po_number: null,
    submitted_by: "pm",
    photos: [],
    created_at: "2026-04-10T14:00:00Z",
    dispatched_at: null,
    completed_at: null,
  },
  {
    id: WO_IDS.wo4,
    property_id: PROPERTY_IDS.main,
    unit_id: UNIT_IDS.main1a,
    pm_user_id: PM_USER_ID,
    tenant_user_id: TENANT_IDS.t3,
    assigned_pro_id: PRO_IDS.p4,
    title: "Commercial tenant buildout - new walls",
    description: "Build two partition walls for new dental office layout per approved plans.",
    category: "general_construction",
    priority: "routine",
    status: "dispatched",
    sla_hours: 336,
    budget_cents: 1200000,
    actual_cost_cents: null,
    expense_type: "capex",
    po_number: "PO-2026-0060",
    submitted_by: "pm",
    photos: [],
    created_at: "2026-04-08T09:00:00Z",
    dispatched_at: "2026-04-09T10:00:00Z",
    completed_at: null,
  },
  {
    id: WO_IDS.wo5,
    property_id: PROPERTY_IDS.main,
    unit_id: UNIT_IDS.main1b,
    pm_user_id: PM_USER_ID,
    tenant_user_id: null,
    assigned_pro_id: null,
    title: "Suite 1B make-ready — paint and carpet",
    description: "Full repaint and carpet replacement for new tenant move-in.",
    category: "make_ready",
    priority: "routine",
    status: "new",
    sla_hours: 168,
    budget_cents: 450000,
    actual_cost_cents: null,
    expense_type: "capex",
    po_number: null,
    submitted_by: "pm",
    photos: [],
    created_at: "2026-04-13T08:00:00Z",
    dispatched_at: null,
    completed_at: null,
  },
  {
    id: WO_IDS.wo6,
    property_id: PROPERTY_IDS.harbor,
    unit_id: UNIT_IDS.harbor101,
    pm_user_id: PM_USER_ID,
    tenant_user_id: TENANT_IDS.t4,
    assigned_pro_id: PRO_IDS.p1,
    title: "Dishwasher replacement",
    description: "Existing dishwasher failed. Owner approved replacement with Bosch 300 series.",
    category: "appliance",
    priority: "routine",
    status: "completed",
    sla_hours: 72,
    budget_cents: 85000,
    actual_cost_cents: 79500,
    expense_type: "opex",
    po_number: "PO-2026-0045",
    submitted_by: "tenant",
    photos: [],
    created_at: "2026-03-20T12:00:00Z",
    dispatched_at: "2026-03-21T09:00:00Z",
    completed_at: "2026-03-23T16:00:00Z",
  },
  {
    id: WO_IDS.wo7,
    property_id: PROPERTY_IDS.harbor,
    unit_id: null,
    pm_user_id: PM_USER_ID,
    tenant_user_id: null,
    assigned_pro_id: PRO_IDS.p5,
    title: "Common area landscaping — spring cleanup",
    description: "Spring cleanup: mulch beds, trim shrubs, edge walkways, fertilize lawn.",
    category: "landscaping",
    priority: "routine",
    status: "completed",
    sla_hours: 336,
    budget_cents: 280000,
    actual_cost_cents: 265000,
    expense_type: "opex",
    po_number: "PO-2026-0052",
    submitted_by: "pm",
    photos: [],
    created_at: "2026-03-25T10:00:00Z",
    dispatched_at: "2026-03-26T08:00:00Z",
    completed_at: "2026-04-02T17:00:00Z",
  },
  {
    id: WO_IDS.wo8,
    property_id: PROPERTY_IDS.student,
    unit_id: UNIT_IDS.student1a,
    pm_user_id: PM_USER_ID,
    tenant_user_id: null,
    assigned_pro_id: PRO_IDS.p1,
    title: "Clogged bathroom drain",
    description: "Bathroom sink slow drain. Likely hair buildup.",
    category: "plumbing",
    priority: "routine",
    status: "completed",
    sla_hours: 48,
    budget_cents: 15000,
    actual_cost_cents: 12500,
    expense_type: "opex",
    po_number: "PO-2026-0055",
    submitted_by: "tenant",
    photos: [],
    created_at: "2026-04-05T16:00:00Z",
    dispatched_at: "2026-04-06T08:00:00Z",
    completed_at: "2026-04-06T10:30:00Z",
  },
  {
    id: WO_IDS.wo9,
    property_id: PROPERTY_IDS.student,
    unit_id: null,
    pm_user_id: PM_USER_ID,
    tenant_user_id: null,
    assigned_pro_id: null,
    title: "Fire alarm panel inspection",
    description: "Annual fire alarm panel inspection and testing per code.",
    category: "fire_safety",
    priority: "urgent",
    status: "new",
    sla_hours: 48,
    budget_cents: 120000,
    actual_cost_cents: null,
    expense_type: "opex",
    po_number: null,
    submitted_by: "auto",
    photos: [],
    created_at: "2026-04-14T06:00:00Z",
    dispatched_at: null,
    completed_at: null,
  },
  {
    id: WO_IDS.wo10,
    property_id: PROPERTY_IDS.maple,
    unit_id: UNIT_IDS.maple102,
    pm_user_id: PM_USER_ID,
    tenant_user_id: null,
    assigned_pro_id: PRO_IDS.p2,
    title: "Unit 102 make-ready — full turnover",
    description: "Paint, clean, replace carpet in bedrooms, patch drywall in living room.",
    category: "make_ready",
    priority: "routine",
    status: "in_progress",
    sla_hours: 168,
    budget_cents: 380000,
    actual_cost_cents: null,
    expense_type: "capex",
    po_number: "PO-2026-0062",
    submitted_by: "pm",
    photos: [],
    created_at: "2026-04-03T09:00:00Z",
    dispatched_at: "2026-04-04T08:00:00Z",
    completed_at: null,
  },
  {
    id: WO_IDS.wo11,
    property_id: PROPERTY_IDS.harbor,
    unit_id: UNIT_IDS.harbor102,
    pm_user_id: PM_USER_ID,
    tenant_user_id: null,
    assigned_pro_id: PRO_IDS.p4,
    title: "Bathroom exhaust fan replacement",
    description: "Exhaust fan noisy and underperforming. Replace with 110 CFM unit.",
    category: "electrical",
    priority: "routine",
    status: "invoiced",
    sla_hours: 72,
    budget_cents: 35000,
    actual_cost_cents: 32000,
    expense_type: "opex",
    po_number: "PO-2026-0059",
    submitted_by: "tenant",
    photos: [],
    created_at: "2026-04-07T11:00:00Z",
    dispatched_at: "2026-04-08T09:00:00Z",
    completed_at: "2026-04-09T14:00:00Z",
  },
  {
    id: WO_IDS.wo12,
    property_id: PROPERTY_IDS.maple,
    unit_id: null,
    pm_user_id: PM_USER_ID,
    tenant_user_id: null,
    assigned_pro_id: null,
    title: "Emergency — burst pipe in basement",
    description: "Water main burst in basement mechanical room. Active flooding.",
    category: "plumbing",
    priority: "emergency",
    status: "new",
    sla_hours: 2,
    budget_cents: 500000,
    actual_cost_cents: null,
    expense_type: "opex",
    po_number: null,
    submitted_by: "pm",
    photos: [],
    created_at: "2026-04-15T05:30:00Z",
    dispatched_at: null,
    completed_at: null,
  },
];

// ---------------------------------------------------------------------------
// PREFERRED VENDORS (5)
// ---------------------------------------------------------------------------

export const mockPreferredVendors: MockPreferredVendor[] = [
  {
    id: VENDOR_IDS.v1,
    pm_user_id: PM_USER_ID,
    pro_id: PRO_IDS.p1,
    trade_category: "plumbing",
    negotiated_rate_cents: 9500,
    priority_rank: 1,
    insurance_verified: true,
    insurance_expiry: "2027-03-15",
    notes: "Go-to plumber. Fast response, fair pricing. Licensed master plumber.",
    created_at: "2025-06-01T00:00:00Z",
  },
  {
    id: VENDOR_IDS.v2,
    pm_user_id: PM_USER_ID,
    pro_id: PRO_IDS.p2,
    trade_category: "hvac",
    negotiated_rate_cents: 11000,
    priority_rank: 1,
    insurance_verified: true,
    insurance_expiry: "2026-12-31",
    notes: "Carrier certified. Handles all HVAC for Maple Ridge and Student Housing.",
    created_at: "2025-04-15T00:00:00Z",
  },
  {
    id: VENDOR_IDS.v3,
    pm_user_id: PM_USER_ID,
    pro_id: PRO_IDS.p3,
    trade_category: "paving",
    negotiated_rate_cents: null,
    priority_rank: 1,
    insurance_verified: true,
    insurance_expiry: "2027-01-31",
    notes: "Bid-based. Good for parking lots and sidewalks. Seasonal availability.",
    created_at: "2025-08-01T00:00:00Z",
  },
  {
    id: VENDOR_IDS.v4,
    pm_user_id: PM_USER_ID,
    pro_id: PRO_IDS.p4,
    trade_category: "general_construction",
    negotiated_rate_cents: 8500,
    priority_rank: 1,
    insurance_verified: true,
    insurance_expiry: "2026-11-30",
    notes: "Reliable GC for buildouts and renovations. Handles own permits.",
    created_at: "2025-09-01T00:00:00Z",
  },
  {
    id: VENDOR_IDS.v5,
    pm_user_id: PM_USER_ID,
    pro_id: PRO_IDS.p5,
    trade_category: "landscaping",
    negotiated_rate_cents: 6500,
    priority_rank: 1,
    insurance_verified: true,
    insurance_expiry: "2027-04-01",
    notes: "Full-service landscaping. Seasonal contracts for Harbor View and Maple Ridge.",
    created_at: "2025-03-01T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// MAINTENANCE SCHEDULES (6)
// ---------------------------------------------------------------------------

export const mockMaintenanceSchedules: MockMaintenanceSchedule[] = [
  {
    id: SCHED_IDS.s1,
    property_id: PROPERTY_IDS.maple,
    unit_id: null,
    title: "HVAC filter replacement — all units",
    description: "Replace HVAC filters in all 48 units. Use MERV 11 pleated.",
    category: "hvac",
    frequency: "quarterly",
    next_due: "2026-07-01",
    last_completed: "2026-04-01",
    estimated_cost_cents: 96000,
    preferred_vendor_id: VENDOR_IDS.v2,
    auto_dispatch: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: SCHED_IDS.s2,
    property_id: PROPERTY_IDS.maple,
    unit_id: null,
    title: "Boiler annual service",
    description: "Annual boiler inspection and maintenance. Clean burners, check safety valves.",
    category: "hvac",
    frequency: "annual",
    next_due: "2026-09-15",
    last_completed: "2025-09-15",
    estimated_cost_cents: 180000,
    preferred_vendor_id: VENDOR_IDS.v2,
    auto_dispatch: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: SCHED_IDS.s3,
    property_id: PROPERTY_IDS.harbor,
    unit_id: null,
    title: "Lawn mowing and edging",
    description: "Weekly mowing, edging, and blowing of all common areas.",
    category: "landscaping",
    frequency: "monthly",
    next_due: "2026-05-01",
    last_completed: "2026-04-01",
    estimated_cost_cents: 45000,
    preferred_vendor_id: VENDOR_IDS.v5,
    auto_dispatch: true,
    created_at: "2025-04-01T00:00:00Z",
  },
  {
    id: SCHED_IDS.s4,
    property_id: PROPERTY_IDS.main,
    unit_id: null,
    title: "Fire extinguisher inspection",
    description: "Inspect and tag all fire extinguishers per NFPA 10.",
    category: "fire_safety",
    frequency: "annual",
    next_due: "2026-06-01",
    last_completed: "2025-06-01",
    estimated_cost_cents: 35000,
    preferred_vendor_id: null,
    auto_dispatch: false,
    created_at: "2025-06-01T00:00:00Z",
  },
  {
    id: SCHED_IDS.s5,
    property_id: PROPERTY_IDS.student,
    unit_id: null,
    title: "Pest control treatment",
    description: "Quarterly interior and exterior pest treatment for all buildings.",
    category: "pest_control",
    frequency: "quarterly",
    next_due: "2026-07-01",
    last_completed: "2026-04-01",
    estimated_cost_cents: 65000,
    preferred_vendor_id: null,
    auto_dispatch: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: SCHED_IDS.s6,
    property_id: PROPERTY_IDS.harbor,
    unit_id: null,
    title: "Gutter cleaning",
    description: "Clean all gutters and downspouts. Check for damage.",
    category: "exterior",
    frequency: "semi_annual",
    next_due: "2026-05-15",
    last_completed: "2025-11-01",
    estimated_cost_cents: 55000,
    preferred_vendor_id: null,
    auto_dispatch: false,
    created_at: "2025-05-01T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// MAKE-READIES (3)
// ---------------------------------------------------------------------------

export const mockMakeReadies: MockMakeReady[] = [
  {
    id: MR_IDS.mr1,
    unit_id: UNIT_IDS.maple102,
    property_id: PROPERTY_IDS.maple,
    vacate_date: "2026-03-31",
    target_ready_date: "2026-04-21",
    actual_ready_date: null,
    status: "in_progress",
    punch_list: [
      { item: "Paint all rooms — Benjamin Moore OC-17", status: "completed" },
      { item: "Replace bedroom carpets", status: "in_progress" },
      { item: "Patch drywall — living room south wall", status: "completed" },
      { item: "Deep clean kitchen and bathrooms", status: "pending" },
      { item: "Replace range drip pans", status: "pending" },
      { item: "Test all smoke/CO detectors", status: "pending" },
    ],
    total_cost_cents: 380000,
    work_order_ids: [WO_IDS.wo10],
    created_at: "2026-03-15T00:00:00Z",
  },
  {
    id: MR_IDS.mr2,
    unit_id: UNIT_IDS.main1b,
    property_id: PROPERTY_IDS.main,
    vacate_date: "2026-02-28",
    target_ready_date: "2026-05-01",
    actual_ready_date: null,
    status: "pending",
    punch_list: [
      { item: "Remove previous tenant fixtures", status: "pending" },
      { item: "Paint — commercial white", status: "pending" },
      { item: "Replace carpet tiles", status: "pending" },
      { item: "Install new signage bracket", status: "pending" },
    ],
    total_cost_cents: 450000,
    work_order_ids: [WO_IDS.wo5],
    created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: MR_IDS.mr3,
    unit_id: UNIT_IDS.student1b,
    property_id: PROPERTY_IDS.student,
    vacate_date: "2026-05-15",
    target_ready_date: "2026-06-15",
    actual_ready_date: null,
    status: "pending",
    punch_list: [
      { item: "Paint all walls and ceiling", status: "pending" },
      { item: "Steam clean carpet", status: "pending" },
      { item: "Repair closet door track", status: "pending" },
      { item: "Replace bathroom mirror", status: "pending" },
      { item: "Full appliance check", status: "pending" },
    ],
    total_cost_cents: 220000,
    work_order_ids: [],
    created_at: "2026-04-10T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// COMPLIANCE ITEMS (8)
// ---------------------------------------------------------------------------

export const mockComplianceItems: MockComplianceItem[] = [
  // 2 overdue
  {
    id: COMP_IDS.c1,
    property_id: PROPERTY_IDS.maple,
    item_type: "boiler_inspection",
    description: "Annual boiler inspection — Certificate of Compliance required by NH Fire Marshal.",
    due_date: "2026-03-01",
    completed_date: null,
    status: "overdue",
    certificate_url: null,
    notes: "Vendor scheduled then cancelled. Needs immediate reschedule.",
    created_at: "2025-09-01T00:00:00Z",
  },
  {
    id: COMP_IDS.c2,
    property_id: PROPERTY_IDS.student,
    item_type: "fire_extinguisher",
    description: "Annual fire extinguisher inspection and tagging — all buildings.",
    due_date: "2026-03-15",
    completed_date: null,
    status: "overdue",
    certificate_url: null,
    notes: "26 extinguishers across 4 buildings. Quote received from SafeGuard Fire.",
    created_at: "2025-03-15T00:00:00Z",
  },
  // 3 due soon
  {
    id: COMP_IDS.c3,
    property_id: PROPERTY_IDS.harbor,
    item_type: "elevator",
    description: "Semi-annual elevator inspection — required by NH RSA 157-B.",
    due_date: "2026-05-01",
    completed_date: null,
    status: "due_soon",
    certificate_url: null,
    notes: "Otis contract includes inspection. Confirm date with rep.",
    created_at: "2025-11-01T00:00:00Z",
  },
  {
    id: COMP_IDS.c4,
    property_id: PROPERTY_IDS.main,
    item_type: "backflow",
    description: "Annual backflow preventer test — required by Nashua Water.",
    due_date: "2026-05-15",
    completed_date: null,
    status: "due_soon",
    certificate_url: null,
    notes: "Need certified backflow tester. Results filed with city.",
    created_at: "2025-05-15T00:00:00Z",
  },
  {
    id: COMP_IDS.c5,
    property_id: PROPERTY_IDS.maple,
    item_type: "fire_alarm",
    description: "Annual fire alarm system test — NFPA 72 compliance.",
    due_date: "2026-06-01",
    completed_date: null,
    status: "due_soon",
    certificate_url: null,
    notes: "SimpliSafe commercial monitoring. Schedule with vendor.",
    created_at: "2025-06-01T00:00:00Z",
  },
  // 3 current
  {
    id: COMP_IDS.c6,
    property_id: PROPERTY_IDS.harbor,
    item_type: "lead_paint",
    description: "Lead paint disclosure — pre-1978 exemption. Built 2005, no lead paint.",
    due_date: "2027-03-01",
    completed_date: "2026-03-01",
    status: "current",
    certificate_url: "/docs/harbor-view-lead-exemption-2026.pdf",
    notes: "Property built 2005 — exempt. Disclosure on file.",
    created_at: "2025-03-01T00:00:00Z",
  },
  {
    id: COMP_IDS.c7,
    property_id: PROPERTY_IDS.main,
    item_type: "fire_alarm",
    description: "Annual fire alarm system test completed.",
    due_date: "2027-02-15",
    completed_date: "2026-02-15",
    status: "current",
    certificate_url: "/docs/220-main-fire-alarm-cert-2026.pdf",
    notes: "Passed. Next test due Feb 2027.",
    created_at: "2025-02-15T00:00:00Z",
  },
  {
    id: COMP_IDS.c8,
    property_id: PROPERTY_IDS.student,
    item_type: "lead_paint",
    description: "Lead paint inspection — building constructed 1985, pre-1978 materials possible in renovation areas.",
    due_date: "2027-01-15",
    completed_date: "2026-01-15",
    status: "current",
    certificate_url: "/docs/elm-st-lead-inspection-2026.pdf",
    notes: "XRF testing completed. No actionable lead levels found. Re-test at next renovation.",
    created_at: "2025-01-15T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// ANALYTICS
// ---------------------------------------------------------------------------

export const mockPmAnalytics: MockPmAnalytics = {
  total_properties: 4,
  total_units: 123,
  occupied_units: 105,
  occupancy_rate: 85.4,
  monthly_gross_rent_cents: 1837500000, // $18,375/mo across sample units, scaled to 123
  monthly_opex_cents: 675000000,
  noi_cents: 1162500000,
  avg_cost_per_unit_cents: 548780,
  budget_variance_pct: -3.2, // 3.2% under budget (good)
  open_work_orders: 5,
  avg_completion_days: 3.4,
  overdue_compliance: 2,
};
