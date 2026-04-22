/**
 * Mock Tax Data
 *
 * Realistic data for development and testing.
 * Pro: Mike Rodriguez (plumber, sole proprietor)
 * PM: Lisa Park (property manager, 5 vendors)
 *
 * All monetary values in integer cents.
 */

// ---------------------------------------------------------------------------
// MOCK USER IDS (deterministic UUIDs for consistency)
// ---------------------------------------------------------------------------

export const MOCK_PRO_USER_ID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
export const MOCK_PM_USER_ID = "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e";
export const MOCK_CLIENT_1_ID = "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f";
export const MOCK_CLIENT_2_ID = "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a";
export const MOCK_CLIENT_3_ID = "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b";

// PM's vendor pros
export const MOCK_VENDOR_1_ID = "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c";
export const MOCK_VENDOR_2_ID = "a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d";
export const MOCK_VENDOR_3_ID = "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e";
export const MOCK_VENDOR_4_ID = "c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f";
export const MOCK_VENDOR_5_ID = "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a";

// ---------------------------------------------------------------------------
// MOCK TIN ENCRYPTION (base64 encoding for dev — NOT real encryption)
// ---------------------------------------------------------------------------

function mockEncryptTin(tin: string): string {
  // DEV ONLY: simple base64 encoding. Production must use AES-256-GCM.
  if (typeof Buffer !== "undefined") {
    return `mock_enc:${Buffer.from(tin).toString("base64")}`;
  }
  return `mock_enc:${btoa(tin)}`;
}

// ---------------------------------------------------------------------------
// W-9 PROFILES
// ---------------------------------------------------------------------------

export interface MockW9Profile {
  id: string;
  proId: string;
  legalName: string;
  businessName: string | null;
  entityType: string;
  tinLastFour: string;
  tinEncrypted: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zip: string;
  tinVerified: boolean;
  tinVerifiedAt: string | null;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mockW9Profiles: MockW9Profile[] = [
  {
    id: "w9-001",
    proId: MOCK_PRO_USER_ID,
    legalName: "Michael A. Rodriguez",
    businessName: "Rodriguez Plumbing LLC",
    entityType: "sole_proprietor",
    tinLastFour: "4589",
    tinEncrypted: mockEncryptTin("123-45-4589"),
    addressLine1: "142 Maple Street",
    addressLine2: null,
    city: "Manchester",
    state: "NH",
    zip: "03104",
    tinVerified: true,
    tinVerifiedAt: "2025-02-15T14:30:00Z",
    status: "verified",
    submittedAt: "2025-02-10T09:00:00Z",
    createdAt: "2025-02-10T09:00:00Z",
    updatedAt: "2025-02-15T14:30:00Z",
  },
];

// ---------------------------------------------------------------------------
// 1099-NEC RECORDS — Pro (Mike) receives from 3 clients
// ---------------------------------------------------------------------------

export interface Mock1099Record {
  id: string;
  payerUserId: string;
  payeeUserId: string;
  taxYear: number;
  totalCents: number;
  thresholdMet: boolean;
  status: string;
  payerName: string;
  payeeName: string;
  payeeTinLastFour: string | null;
  generatedAt: string | null;
  filedAt: string | null;
  filingReference: string | null;
  correctionOfId: string | null;
  createdAt: string;
}

export const mockPro1099Records: Mock1099Record[] = [
  {
    id: "1099-pro-001",
    payerUserId: MOCK_CLIENT_1_ID,
    payeeUserId: MOCK_PRO_USER_ID,
    taxYear: 2026,
    totalCents: 3240000, // $32,400 — largest client
    thresholdMet: true,
    status: "tracking",
    payerName: "Granite State Property Mgmt",
    payeeName: "Michael A. Rodriguez",
    payeeTinLastFour: "4589",
    generatedAt: null,
    filedAt: null,
    filingReference: null,
    correctionOfId: null,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "1099-pro-002",
    payerUserId: MOCK_CLIENT_2_ID,
    payeeUserId: MOCK_PRO_USER_ID,
    taxYear: 2026,
    totalCents: 2160000, // $21,600
    thresholdMet: true,
    status: "tracking",
    payerName: "Sarah Chen (Homeowner)",
    payeeName: "Michael A. Rodriguez",
    payeeTinLastFour: "4589",
    generatedAt: null,
    filedAt: null,
    filingReference: null,
    correctionOfId: null,
    createdAt: "2026-02-03T00:00:00Z",
  },
  {
    id: "1099-pro-003",
    payerUserId: MOCK_CLIENT_3_ID,
    payeeUserId: MOCK_PRO_USER_ID,
    taxYear: 2026,
    totalCents: 1440000, // $14,400
    thresholdMet: true,
    status: "tracking",
    payerName: "Lakes Region Builders",
    payeeName: "Michael A. Rodriguez",
    payeeTinLastFour: "4589",
    generatedAt: null,
    filedAt: null,
    filingReference: null,
    correctionOfId: null,
    createdAt: "2026-01-22T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// 1099-NEC RECORDS — PM (Lisa) pays 5 vendors, 3 over threshold
// ---------------------------------------------------------------------------

export const mockPm1099Records: Mock1099Record[] = [
  {
    id: "1099-pm-001",
    payerUserId: MOCK_PM_USER_ID,
    payeeUserId: MOCK_VENDOR_1_ID,
    taxYear: 2026,
    totalCents: 1560000, // $15,600 — over threshold
    thresholdMet: true,
    status: "threshold_met",
    payerName: "Lisa Park / Park Property Management",
    payeeName: "Jake Thompson Electrical",
    payeeTinLastFour: "7721",
    generatedAt: null,
    filedAt: null,
    filingReference: null,
    correctionOfId: null,
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "1099-pm-002",
    payerUserId: MOCK_PM_USER_ID,
    payeeUserId: MOCK_VENDOR_2_ID,
    taxYear: 2026,
    totalCents: 1240000, // $12,400 — over threshold
    thresholdMet: true,
    status: "threshold_met",
    payerName: "Lisa Park / Park Property Management",
    payeeName: "Carlos Mendez HVAC",
    payeeTinLastFour: "3345",
    generatedAt: null,
    filedAt: null,
    filingReference: null,
    correctionOfId: null,
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "1099-pm-003",
    payerUserId: MOCK_PM_USER_ID,
    payeeUserId: MOCK_VENDOR_3_ID,
    taxYear: 2026,
    totalCents: 870000, // $8,700 — over threshold
    thresholdMet: true,
    status: "tracking",
    payerName: "Lisa Park / Park Property Management",
    payeeName: "NH Painting Pros",
    payeeTinLastFour: "9912",
    generatedAt: null,
    filedAt: null,
    filingReference: null,
    correctionOfId: null,
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "1099-pm-004",
    payerUserId: MOCK_PM_USER_ID,
    payeeUserId: MOCK_VENDOR_4_ID,
    taxYear: 2026,
    totalCents: 52000, // $520 — approaching threshold
    thresholdMet: false,
    status: "tracking",
    payerName: "Lisa Park / Park Property Management",
    payeeName: "Quick Clean Janitorial",
    payeeTinLastFour: null,
    generatedAt: null,
    filedAt: null,
    filingReference: null,
    correctionOfId: null,
    createdAt: "2026-03-05T00:00:00Z",
  },
  {
    id: "1099-pm-005",
    payerUserId: MOCK_PM_USER_ID,
    payeeUserId: MOCK_VENDOR_5_ID,
    taxYear: 2026,
    totalCents: 48000, // $480 — approaching threshold
    thresholdMet: false,
    status: "tracking",
    payerName: "Lisa Park / Park Property Management",
    payeeName: "Green Thumb Landscaping",
    payeeTinLastFour: null,
    generatedAt: null,
    filedAt: null,
    filingReference: null,
    correctionOfId: null,
    createdAt: "2026-03-12T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// EXPENSES — Mike Rodriguez YTD $23,100
// ---------------------------------------------------------------------------

export interface MockExpense {
  id: string;
  userId: string;
  taxYear: number;
  category: string;
  scheduleCLine: string;
  description: string;
  amountCents: number;
  source: string;
  sourceRefId: string | null;
  receiptUrl: string | null;
  isDeductible: boolean;
  date: string;
  createdAt: string;
}

export const mockExpenses: MockExpense[] = [
  // Supplies: $14,000
  { id: "exp-001", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "supplies", scheduleCLine: "line_22", description: "Home Depot — PEX pipe and fittings", amountCents: 345000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-01-08", createdAt: "2026-01-08T16:00:00Z" },
  { id: "exp-002", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "supplies", scheduleCLine: "line_22", description: "Home Depot — copper pipe, solder, flux", amountCents: 287000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-01-22", createdAt: "2026-01-22T17:00:00Z" },
  { id: "exp-003", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "supplies", scheduleCLine: "line_22", description: "F.W. Webb — water heater + expansion tank", amountCents: 189000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-02-05", createdAt: "2026-02-05T10:00:00Z" },
  { id: "exp-004", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "supplies", scheduleCLine: "line_22", description: "Lowes — toilet, wax ring, supply lines", amountCents: 156000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-02-18", createdAt: "2026-02-18T14:00:00Z" },
  { id: "exp-005", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "supplies", scheduleCLine: "line_22", description: "F.W. Webb — SharkBite fittings, valves", amountCents: 134000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-03-02", createdAt: "2026-03-02T09:00:00Z" },
  { id: "exp-006", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "supplies", scheduleCLine: "line_22", description: "Home Depot — drain parts, ABS pipe", amountCents: 289000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-03-20", createdAt: "2026-03-20T11:00:00Z" },

  // Vehicle: $4,000
  { id: "exp-007", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "vehicle", scheduleCLine: "line_9", description: "Shell gas — work truck", amountCents: 127000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-01-15", createdAt: "2026-01-15T18:00:00Z" },
  { id: "exp-008", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "vehicle", scheduleCLine: "line_9", description: "Jiffy Lube — oil change + tire rotation", amountCents: 12500, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-02-10", createdAt: "2026-02-10T15:00:00Z" },
  { id: "exp-009", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "vehicle", scheduleCLine: "line_9", description: "Shell gas — work truck", amountCents: 134000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-03-01", createdAt: "2026-03-01T19:00:00Z" },
  { id: "exp-010", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "vehicle", scheduleCLine: "line_9", description: "NTB — new tires (4x)", amountCents: 126500, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-03-25", createdAt: "2026-03-25T10:00:00Z" },

  // Insurance: $2,000
  { id: "exp-011", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "insurance", scheduleCLine: "line_15", description: "State Farm — general liability Q1", amountCents: 125000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-01-05", createdAt: "2026-01-05T08:00:00Z" },
  { id: "exp-012", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "insurance", scheduleCLine: "line_15", description: "NEXT Insurance — workers comp", amountCents: 75000, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-01-05", createdAt: "2026-01-05T08:05:00Z" },

  // Tools: $1,500
  { id: "exp-013", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "tools", scheduleCLine: "line_22", description: "Milwaukee — M18 press tool kit", amountCents: 89900, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-02-22", createdAt: "2026-02-22T12:00:00Z" },
  { id: "exp-014", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "tools", scheduleCLine: "line_22", description: "RIDGID — pipe wrench set + tubing cutter", amountCents: 60100, source: "manual", sourceRefId: null, receiptUrl: null, isDeductible: true, date: "2026-03-10", createdAt: "2026-03-10T13:00:00Z" },

  // Commissions: $1,600
  { id: "exp-015", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "commissions", scheduleCLine: "line_10", description: "Sherpa Pros — platform commission Jan", amountCents: 52000, source: "platform", sourceRefId: "pmt-jan-2026", receiptUrl: null, isDeductible: true, date: "2026-01-31", createdAt: "2026-01-31T23:59:00Z" },
  { id: "exp-016", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "commissions", scheduleCLine: "line_10", description: "Sherpa Pros — platform commission Feb", amountCents: 56000, source: "platform", sourceRefId: "pmt-feb-2026", receiptUrl: null, isDeductible: true, date: "2026-02-28", createdAt: "2026-02-28T23:59:00Z" },
  { id: "exp-017", userId: MOCK_PRO_USER_ID, taxYear: 2026, category: "commissions", scheduleCLine: "line_10", description: "Sherpa Pros — platform commission Mar", amountCents: 52000, source: "platform", sourceRefId: "pmt-mar-2026", receiptUrl: null, isDeductible: true, date: "2026-03-31", createdAt: "2026-03-31T23:59:00Z" },
];

// Total expenses: 345000+287000+189000+156000+134000+289000 + 127000+12500+134000+126500 + 125000+75000 + 89900+60100 + 52000+56000+52000 = 2310000 ($23,100) ✓

// ---------------------------------------------------------------------------
// MILEAGE LOGS — 4,200 miles YTD
// ---------------------------------------------------------------------------

export interface MockMileageLog {
  id: string;
  proId: string;
  jobId: string | null;
  date: string;
  originAddress: string;
  destinationAddress: string;
  miles: number;
  irsRateCents: number;
  deductionCents: number;
  source: string;
  isBusiness: boolean;
  notes: string | null;
  createdAt: string;
}

export const mockMileageLogs: MockMileageLog[] = [
  { id: "mile-001", proId: MOCK_PRO_USER_ID, jobId: "job-101", date: "2026-01-06", originAddress: "142 Maple St, Manchester NH", destinationAddress: "45 Elm St, Concord NH", miles: 22.4, irsRateCents: 67, deductionCents: 1501, source: "manual", isBusiness: true, notes: "Water heater install", createdAt: "2026-01-06T07:30:00Z" },
  { id: "mile-002", proId: MOCK_PRO_USER_ID, jobId: "job-101", date: "2026-01-06", originAddress: "45 Elm St, Concord NH", destinationAddress: "142 Maple St, Manchester NH", miles: 22.4, irsRateCents: 67, deductionCents: 1501, source: "manual", isBusiness: true, notes: "Return from Concord job", createdAt: "2026-01-06T16:30:00Z" },
  { id: "mile-003", proId: MOCK_PRO_USER_ID, jobId: "job-102", date: "2026-01-08", originAddress: "142 Maple St, Manchester NH", destinationAddress: "789 Lake Rd, Laconia NH", miles: 38.6, irsRateCents: 67, deductionCents: 2586, source: "manual", isBusiness: true, notes: "Bathroom remodel — rough plumbing", createdAt: "2026-01-08T06:45:00Z" },
  { id: "mile-004", proId: MOCK_PRO_USER_ID, jobId: "job-102", date: "2026-01-08", originAddress: "789 Lake Rd, Laconia NH", destinationAddress: "142 Maple St, Manchester NH", miles: 38.6, irsRateCents: 67, deductionCents: 2586, source: "manual", isBusiness: true, notes: "Return from Laconia", createdAt: "2026-01-08T17:00:00Z" },
  { id: "mile-005", proId: MOCK_PRO_USER_ID, jobId: null, date: "2026-01-10", originAddress: "142 Maple St, Manchester NH", destinationAddress: "Home Depot, 80 Huse Rd, Manchester NH", miles: 4.2, irsRateCents: 67, deductionCents: 281, source: "manual", isBusiness: true, notes: "Supply pickup", createdAt: "2026-01-10T09:00:00Z" },
  // ... condensed: show summary trips for remaining months
  { id: "mile-006", proId: MOCK_PRO_USER_ID, jobId: "job-103", date: "2026-01-15", originAddress: "142 Maple St, Manchester NH", destinationAddress: "220 Main St, Nashua NH", miles: 18.5, irsRateCents: 67, deductionCents: 1240, source: "manual", isBusiness: true, notes: "Kitchen sink install", createdAt: "2026-01-15T07:00:00Z" },
  { id: "mile-007", proId: MOCK_PRO_USER_ID, jobId: null, date: "2026-01-20", originAddress: "142 Maple St, Manchester NH", destinationAddress: "F.W. Webb, Bedford NH", miles: 8.3, irsRateCents: 67, deductionCents: 556, source: "manual", isBusiness: true, notes: "Parts pickup", createdAt: "2026-01-20T10:00:00Z" },
  // January subtotal sample + aggregate for remaining months
  { id: "mile-008", proId: MOCK_PRO_USER_ID, jobId: "job-110", date: "2026-02-03", originAddress: "142 Maple St, Manchester NH", destinationAddress: "15 River Rd, Dover NH", miles: 52.0, irsRateCents: 67, deductionCents: 3484, source: "manual", isBusiness: true, notes: "Emergency pipe burst", createdAt: "2026-02-03T05:30:00Z" },
  { id: "mile-009", proId: MOCK_PRO_USER_ID, jobId: "job-115", date: "2026-02-14", originAddress: "142 Maple St, Manchester NH", destinationAddress: "88 Oak Ave, Exeter NH", miles: 35.0, irsRateCents: 67, deductionCents: 2345, source: "manual", isBusiness: true, notes: "Sewer line repair", createdAt: "2026-02-14T07:00:00Z" },
  { id: "mile-010", proId: MOCK_PRO_USER_ID, jobId: "job-120", date: "2026-03-05", originAddress: "142 Maple St, Manchester NH", destinationAddress: "402 Willow Ln, Keene NH", miles: 72.0, irsRateCents: 67, deductionCents: 4824, source: "manual", isBusiness: true, notes: "New construction rough-in", createdAt: "2026-03-05T06:00:00Z" },
  { id: "mile-011", proId: MOCK_PRO_USER_ID, jobId: "job-120", date: "2026-03-06", originAddress: "142 Maple St, Manchester NH", destinationAddress: "402 Willow Ln, Keene NH", miles: 72.0, irsRateCents: 67, deductionCents: 4824, source: "manual", isBusiness: true, notes: "New construction rough-in day 2", createdAt: "2026-03-06T06:00:00Z" },
  { id: "mile-012", proId: MOCK_PRO_USER_ID, jobId: "job-125", date: "2026-03-18", originAddress: "142 Maple St, Manchester NH", destinationAddress: "55 Pine St, Portsmouth NH", miles: 48.5, irsRateCents: 67, deductionCents: 3250, source: "manual", isBusiness: true, notes: "Commercial bathroom renovation", createdAt: "2026-03-18T07:00:00Z" },
];

// Approx total from logged trips: ~4,200 miles across Q1
// Total mileage deduction: 4200 * 67 = 281,400 cents ($2,814.00)

export const mockMileageSummary = {
  totalMiles: 4200,
  totalDeductionCents: 281400, // $2,814
  avgMilesPerDay: 46.7,
  tripCount: mockMileageLogs.length,
};

// ---------------------------------------------------------------------------
// QUARTERLY ESTIMATES — Mike Rodriguez 2026
// ---------------------------------------------------------------------------

export interface MockQuarterlyEstimate {
  id: string;
  proId: string;
  taxYear: number;
  quarter: number;
  ytdIncomeCents: number;
  ytdExpensesCents: number;
  taxableIncomeCents: number;
  seTaxCents: number;
  incomeTaxCents: number;
  totalEstimatedCents: number;
  deadline: string;
  reminderSent: boolean;
  paymentMade: boolean;
  paymentAmountCents: number | null;
  createdAt: string;
}

export const mockQuarterlyEstimates: MockQuarterlyEstimate[] = [
  {
    id: "qe-001",
    proId: MOCK_PRO_USER_ID,
    taxYear: 2026,
    quarter: 1,
    ytdIncomeCents: 2280000, // $22,800 (Q1 income)
    ytdExpensesCents: 770000, // $7,700 (Q1 expenses)
    taxableIncomeCents: 1510000,
    seTaxCents: 2132865, // annualized: $60,400 net -> SE on $55,740 = $8,528
    incomeTaxCents: 700000, // simplified estimate
    totalEstimatedCents: 1680000, // ~$16,800 annual est
    deadline: "2026-04-15",
    reminderSent: true,
    paymentMade: true,
    paymentAmountCents: 420000, // $4,200 paid
    createdAt: "2026-03-31T00:00:00Z",
  },
  {
    id: "qe-002",
    proId: MOCK_PRO_USER_ID,
    taxYear: 2026,
    quarter: 2,
    ytdIncomeCents: 4560000, // $45,600 (through Q2 projected)
    ytdExpensesCents: 1540000, // $15,400 (through Q2 projected)
    taxableIncomeCents: 3020000,
    seTaxCents: 2132865,
    incomeTaxCents: 750000,
    totalEstimatedCents: 1800000, // ~$18,000 annual est
    deadline: "2026-06-15",
    reminderSent: false,
    paymentMade: false,
    paymentAmountCents: null,
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "qe-003",
    proId: MOCK_PRO_USER_ID,
    taxYear: 2026,
    quarter: 3,
    ytdIncomeCents: 0, // not yet calculated
    ytdExpensesCents: 0,
    taxableIncomeCents: 0,
    seTaxCents: 0,
    incomeTaxCents: 0,
    totalEstimatedCents: 0,
    deadline: "2026-09-15",
    reminderSent: false,
    paymentMade: false,
    paymentAmountCents: null,
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "qe-004",
    proId: MOCK_PRO_USER_ID,
    taxYear: 2026,
    quarter: 4,
    ytdIncomeCents: 0,
    ytdExpensesCents: 0,
    taxableIncomeCents: 0,
    seTaxCents: 0,
    incomeTaxCents: 0,
    totalEstimatedCents: 0,
    deadline: "2027-01-15",
    reminderSent: false,
    paymentMade: false,
    paymentAmountCents: null,
    createdAt: "2026-04-01T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// CLIENTS APPROACHING $600 THRESHOLD (for pro's view)
// ---------------------------------------------------------------------------

export interface MockThresholdAlert {
  clientName: string;
  clientId: string;
  totalPaidCents: number;
  thresholdCents: number;
  percentToThreshold: number;
  needsW9: boolean;
}

export const mockThresholdAlerts: MockThresholdAlert[] = [
  {
    clientName: "Tom Wilson (Handyman jobs)",
    clientId: "client-approaching-1",
    totalPaidCents: 52000, // $520
    thresholdCents: 60000,
    percentToThreshold: 86.7,
    needsW9: false,
  },
  {
    clientName: "Merrimack Valley Rentals",
    clientId: "client-approaching-2",
    totalPaidCents: 48000, // $480
    thresholdCents: 60000,
    percentToThreshold: 80.0,
    needsW9: false,
  },
  {
    clientName: "Dave's Property Services",
    clientId: "client-approaching-3",
    totalPaidCents: 35000, // $350
    thresholdCents: 60000,
    percentToThreshold: 58.3,
    needsW9: false,
  },
];

// ---------------------------------------------------------------------------
// TAX OVERVIEW SUMMARY — Mike Rodriguez YTD
// ---------------------------------------------------------------------------

export interface MockTaxOverview {
  proId: string;
  proName: string;
  taxYear: number;
  ytdIncomeCents: number;
  ytdExpensesCents: number;
  ytdMileageDeductionCents: number;
  netIncomeCents: number;
  estimatedSeTaxCents: number;
  estimatedIncomeTaxCents: number;
  totalEstimatedTaxCents: number;
  quarterlyPaidCents: number;
  remainingOwedCents: number;
  nextDeadline: string;
  nextPaymentCents: number;
  jobsCompleted: number;
  w9Status: string;
  num1099sReceived: number;
  num1099sIssued: number;
  thresholdAlerts: number;
}

export const mockProTaxOverview: MockTaxOverview = {
  proId: MOCK_PRO_USER_ID,
  proName: "Mike Rodriguez",
  taxYear: 2026,
  ytdIncomeCents: 6840000,      // $68,400 from 47 jobs
  ytdExpensesCents: 2310000,    // $23,100
  ytdMileageDeductionCents: 281400, // $2,814
  netIncomeCents: 4248600,      // $42,486 ($68,400 - $23,100 - $2,814)
  estimatedSeTaxCents: 601200,  // ~$6,012 SE tax on annualized
  estimatedIncomeTaxCents: 380000, // ~$3,800 income tax estimate
  totalEstimatedTaxCents: 981200, // ~$9,812 total
  quarterlyPaidCents: 420000,   // $4,200 (Q1 paid)
  remainingOwedCents: 561200,   // ~$5,612 still owed
  nextDeadline: "2026-06-15",
  nextPaymentCents: 450000,     // $4,500 Q2 estimate
  jobsCompleted: 47,
  w9Status: "verified",
  num1099sReceived: 3,
  num1099sIssued: 0,
  thresholdAlerts: 3,
};

// ---------------------------------------------------------------------------
// PM OVERVIEW — Lisa Park
// ---------------------------------------------------------------------------

export interface MockPmTaxOverview {
  pmId: string;
  pmName: string;
  taxYear: number;
  totalVendorPaymentsCents: number;
  vendorCount: number;
  vendorsOverThreshold: number;
  vendorsApproachingThreshold: number;
  vendorsNeedingW9: number;
  num1099sToFile: number;
  num1099sFiled: number;
}

export const mockPmTaxOverview: MockPmTaxOverview = {
  pmId: MOCK_PM_USER_ID,
  pmName: "Lisa Park",
  taxYear: 2026,
  totalVendorPaymentsCents: 4870000, // $48,700
  vendorCount: 5,
  vendorsOverThreshold: 3,
  vendorsApproachingThreshold: 2,
  vendorsNeedingW9: 2, // vendors 4 and 5 don't have TIN on file
  num1099sToFile: 3,
  num1099sFiled: 0,
};
