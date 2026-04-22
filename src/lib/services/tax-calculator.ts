/**
 * Tax Calculation Service
 *
 * Self-employment tax, federal income tax brackets, quarterly estimates,
 * expense auto-categorization, mileage deductions, and Schedule C mapping.
 *
 * All monetary values in integer cents.
 * SE tax rate: 15.3% on 92.35% of net self-employment income.
 * IRS mileage rate: 67c/mile (2024).
 */

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface QuarterlyEstimate {
  quarter: number;
  taxYear: number;
  ytdIncomeCents: number;
  ytdExpensesCents: number;
  netIncomeCents: number;
  taxableIncomeCents: number;
  seTaxCents: number;
  incomeTaxCents: number;
  totalEstimatedCents: number;
  quarterlyPaymentCents: number;
  deadline: string; // ISO date
}

export interface ExpenseCategory {
  category: string;
  scheduleCLine: string;
}

export interface ScheduleCLine {
  line: string;
  label: string;
  description: string;
}

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

/** Self-employment tax rate: 15.3% (12.4% Social Security + 2.9% Medicare) */
const SE_TAX_RATE = 0.153;

/** Only 92.35% of net SE income is subject to SE tax */
const SE_TAXABLE_FACTOR = 0.9235;

/** Half of SE tax is deductible from income tax */
const SE_DEDUCTION_FACTOR = 0.5;

/** IRS standard mileage rates by year (cents per mile) */
const IRS_MILEAGE_RATES: Record<number, number> = {
  2024: 67,
  2025: 70, // projected
  2026: 70, // projected
};

/** 2024 Federal income tax brackets — single filer */
const BRACKETS_SINGLE_2024 = [
  { min: 0, max: 1160000, rate: 0.10 },       // $0 - $11,600
  { min: 1160000, max: 4725000, rate: 0.12 },  // $11,600 - $47,150 (note: actual bracket is $47,150)
  { min: 4725000, max: 10052500, rate: 0.22 }, // $47,150 - $100,525
  { min: 10052500, max: 19190000, rate: 0.24 },
  { min: 19190000, max: 24367500, rate: 0.32 },
  { min: 24367500, max: 57862500, rate: 0.35 },
  { min: 57862500, max: Infinity, rate: 0.37 },
];

/** 2024 Federal income tax brackets — married filing jointly */
const BRACKETS_MFJ_2024 = [
  { min: 0, max: 2320000, rate: 0.10 },
  { min: 2320000, max: 9450000, rate: 0.12 },
  { min: 9450000, max: 20105000, rate: 0.22 },
  { min: 20105000, max: 38380000, rate: 0.24 },
  { min: 38380000, max: 48735000, rate: 0.32 },
  { min: 48735000, max: 69325000, rate: 0.35 },
  { min: 69325000, max: Infinity, rate: 0.37 },
];

/** Standard deduction 2024 (cents) */
const STANDARD_DEDUCTION_2024: Record<string, number> = {
  single: 1460000,        // $14,600
  married_joint: 2920000, // $29,200
};

/** Quarterly estimated tax deadlines */
const QUARTERLY_DEADLINES: Record<number, string[]> = {
  2024: ["2024-04-15", "2024-06-17", "2024-09-16", "2025-01-15"],
  2025: ["2025-04-15", "2025-06-16", "2025-09-15", "2026-01-15"],
  2026: ["2026-04-15", "2026-06-15", "2026-09-15", "2027-01-15"],
};

// ---------------------------------------------------------------------------
// SELF-EMPLOYMENT TAX
// ---------------------------------------------------------------------------

/**
 * Calculate self-employment tax.
 * SE tax = 15.3% of 92.35% of net self-employment income.
 */
export function calculateSelfEmploymentTax(netIncomeCents: number): number {
  if (netIncomeCents <= 0) return 0;
  const taxableBase = Math.round(netIncomeCents * SE_TAXABLE_FACTOR);
  return Math.round(taxableBase * SE_TAX_RATE);
}

// ---------------------------------------------------------------------------
// FEDERAL INCOME TAX
// ---------------------------------------------------------------------------

/**
 * Estimate federal income tax using progressive brackets.
 * Applies standard deduction and SE tax deduction.
 */
export function estimateIncomeTax(
  taxableIncomeCents: number,
  filingStatus: "single" | "married_joint" = "single",
): number {
  if (taxableIncomeCents <= 0) return 0;

  const brackets =
    filingStatus === "married_joint" ? BRACKETS_MFJ_2024 : BRACKETS_SINGLE_2024;

  let remaining = taxableIncomeCents;
  let totalTax = 0;

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
    totalTax += Math.round(taxableInBracket * bracket.rate);
    remaining -= taxableInBracket;
  }

  return totalTax;
}

// ---------------------------------------------------------------------------
// QUARTERLY PAYMENT ESTIMATE
// ---------------------------------------------------------------------------

/**
 * Calculate quarterly estimated tax payment.
 * Uses annualized method: projects full-year tax from YTD data,
 * then divides by 4 for even quarterly payments.
 */
export function calculateQuarterlyPayment(
  ytdIncomeCents: number,
  ytdExpensesCents: number,
  quarter: number,
  taxYear: number = 2026,
  filingStatus: "single" | "married_joint" = "single",
): QuarterlyEstimate {
  const netIncomeCents = Math.max(0, ytdIncomeCents - ytdExpensesCents);

  // Annualize based on quarter: Q1 = x4, Q2 = x2, Q3 = x(4/3), Q4 = x1
  const annualizeFactor = 4 / quarter;
  const annualizedNet = Math.round(netIncomeCents * annualizeFactor);

  // SE tax on annualized income
  const seTaxCents = calculateSelfEmploymentTax(annualizedNet);

  // Income tax: subtract standard deduction and half of SE tax
  const standardDeduction = STANDARD_DEDUCTION_2024[filingStatus] || 1460000;
  const seDeduction = Math.round(seTaxCents * SE_DEDUCTION_FACTOR);
  const taxableForIncome = Math.max(
    0,
    annualizedNet - standardDeduction - seDeduction,
  );
  const incomeTaxCents = estimateIncomeTax(taxableForIncome, filingStatus);

  const totalEstimatedCents = seTaxCents + incomeTaxCents;
  const quarterlyPaymentCents = Math.round(totalEstimatedCents / 4);

  const deadlines = QUARTERLY_DEADLINES[taxYear] || QUARTERLY_DEADLINES[2026];

  return {
    quarter,
    taxYear,
    ytdIncomeCents,
    ytdExpensesCents,
    netIncomeCents,
    taxableIncomeCents: taxableForIncome,
    seTaxCents,
    incomeTaxCents,
    totalEstimatedCents,
    quarterlyPaymentCents,
    deadline: deadlines[quarter - 1] || `${taxYear}-04-15`,
  };
}

// ---------------------------------------------------------------------------
// EXPENSE AUTO-CATEGORIZATION
// ---------------------------------------------------------------------------

/** Keyword-to-category mapping for auto-categorization */
const EXPENSE_KEYWORDS: Array<{
  keywords: string[];
  category: string;
  scheduleCLine: string;
}> = [
  {
    keywords: ["home depot", "lowes", "lowe's", "lumber", "plywood", "drywall", "nails", "screws", "concrete", "pipe", "fitting", "supplies", "material"],
    category: "supplies",
    scheduleCLine: "line_22",
  },
  {
    keywords: ["gas", "fuel", "diesel", "oil change", "tire", "car wash", "parking", "toll", "vehicle"],
    category: "vehicle",
    scheduleCLine: "line_9",
  },
  {
    keywords: ["insurance", "liability", "workers comp", "bond", "surety"],
    category: "insurance",
    scheduleCLine: "line_15",
  },
  {
    keywords: ["drill", "saw", "hammer", "wrench", "level", "tool", "equipment", "dewalt", "milwaukee", "makita", "ridgid"],
    category: "tools",
    scheduleCLine: "line_22",
  },
  {
    keywords: ["commission", "referral", "finder", "platform fee", "sherpa"],
    category: "commissions",
    scheduleCLine: "line_10",
  },
  {
    keywords: ["subcontractor", "sub", "contract labor", "day labor", "helper"],
    category: "contract_labor",
    scheduleCLine: "line_11",
  },
  {
    keywords: ["office", "printer", "ink", "paper", "desk", "computer", "software", "quickbooks", "subscription"],
    category: "office",
    scheduleCLine: "line_18",
  },
  {
    keywords: ["rent", "lease", "shop", "storage", "warehouse"],
    category: "rent",
    scheduleCLine: "line_20b",
  },
  {
    keywords: ["repair", "maintenance", "fix", "replace"],
    category: "repairs",
    scheduleCLine: "line_21",
  },
  {
    keywords: ["electric", "water", "internet", "phone", "cell", "utility"],
    category: "utilities",
    scheduleCLine: "line_25",
  },
];

/**
 * Auto-categorize an expense based on description keywords.
 * Falls back to "other" / "line_27a" if no match.
 */
export function categorizeExpense(
  description: string,
): ExpenseCategory {
  const lower = description.toLowerCase();

  for (const mapping of EXPENSE_KEYWORDS) {
    if (mapping.keywords.some((kw) => lower.includes(kw))) {
      return {
        category: mapping.category,
        scheduleCLine: mapping.scheduleCLine,
      };
    }
  }

  return { category: "other", scheduleCLine: "line_27a" };
}

// ---------------------------------------------------------------------------
// MILEAGE DEDUCTION
// ---------------------------------------------------------------------------

/**
 * Calculate mileage deduction using IRS standard rate.
 * Returns deduction in cents.
 */
export function calculateMileageDeduction(
  miles: number,
  year: number = 2024,
): number {
  const rateCents = IRS_MILEAGE_RATES[year] || 67;
  return Math.round(miles * rateCents);
}

// ---------------------------------------------------------------------------
// SCHEDULE C LINE MAPPING
// ---------------------------------------------------------------------------

/**
 * Full IRS Schedule C line mapping for construction/trade professionals.
 */
export function getScheduleCMapping(): Record<string, ScheduleCLine> {
  return {
    line_8: {
      line: "8",
      label: "Advertising",
      description: "Business advertising and marketing expenses",
    },
    line_9: {
      line: "9",
      label: "Car and truck expenses",
      description: "Vehicle expenses using standard mileage rate or actual expenses",
    },
    line_10: {
      line: "10",
      label: "Commissions and fees",
      description: "Platform fees, referral commissions, broker fees",
    },
    line_11: {
      line: "11",
      label: "Contract labor",
      description: "Payments to subcontractors and day laborers (1099-NEC required if >= $600)",
    },
    line_15: {
      line: "15",
      label: "Insurance (other than health)",
      description: "Business liability, workers comp, vehicle insurance, surety bonds",
    },
    line_16a: {
      line: "16a",
      label: "Mortgage interest paid to banks",
      description: "Interest on business property mortgages",
    },
    line_17: {
      line: "17",
      label: "Legal and professional services",
      description: "Accountant, attorney, CPA fees",
    },
    line_18: {
      line: "18",
      label: "Office expense",
      description: "Office supplies, software subscriptions, computer equipment",
    },
    line_20b: {
      line: "20b",
      label: "Rent — other business property",
      description: "Shop rent, storage unit, equipment rental",
    },
    line_21: {
      line: "21",
      label: "Repairs and maintenance",
      description: "Equipment repairs, vehicle maintenance, tool sharpening",
    },
    line_22: {
      line: "22",
      label: "Supplies",
      description: "Materials, consumables, and small tools not capitalized",
    },
    line_23: {
      line: "23",
      label: "Taxes and licenses",
      description: "Business licenses, permits, state/local business taxes",
    },
    line_25: {
      line: "25",
      label: "Utilities",
      description: "Phone, internet, electric for business space",
    },
    line_27a: {
      line: "27a",
      label: "Other expenses",
      description: "Business expenses not listed above (itemize on line 48)",
    },
  };
}

// ---------------------------------------------------------------------------
// 1099 THRESHOLD CHECK
// ---------------------------------------------------------------------------

/** The IRS 1099-NEC filing threshold in cents ($600.00) */
export const THRESHOLD_1099_CENTS = 60000;

/**
 * Check if total payments meet the 1099-NEC filing threshold ($600).
 */
export function meets1099Threshold(totalCents: number): boolean {
  return totalCents >= THRESHOLD_1099_CENTS;
}

/**
 * Get the current tax year.
 */
export function getCurrentTaxYear(): number {
  return new Date().getFullYear();
}

/**
 * Get quarterly deadline dates for a given tax year.
 */
export function getQuarterlyDeadlines(taxYear: number): string[] {
  return QUARTERLY_DEADLINES[taxYear] || [
    `${taxYear}-04-15`,
    `${taxYear}-06-15`,
    `${taxYear}-09-15`,
    `${taxYear + 1}-01-15`,
  ];
}

/**
 * Determine which quarter a date falls into for estimated tax purposes.
 * Q1: Jan-Mar, Q2: Apr-May, Q3: Jun-Aug, Q4: Sep-Dec
 * (Note: IRS quarters for estimated tax don't align with calendar quarters)
 */
export function getEstimatedTaxQuarter(date: Date): number {
  const month = date.getMonth(); // 0-indexed
  if (month <= 2) return 1;  // Jan-Mar
  if (month <= 4) return 2;  // Apr-May
  if (month <= 7) return 3;  // Jun-Aug
  return 4;                  // Sep-Dec
}
