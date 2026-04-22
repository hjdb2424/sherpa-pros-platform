/**
 * Tax Compliance Module — Drizzle Schema
 *
 * W-9 collection, 1099-NEC tracking, expense categorization,
 * mileage logs, quarterly estimates, and year-end tax packages.
 *
 * All monetary values stored as integer cents.
 * TIN data: last-4 stored in plaintext for display,
 * full TIN stored encrypted (AES-256-GCM required in production).
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  date,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "../drizzle-schema";
import { jobs } from "../drizzle-schema";

// Re-export for convenience
export { users, jobs };

// ---------------------------------------------------------------------------
// W-9 PROFILES — encrypted contractor tax data
// ---------------------------------------------------------------------------

export const taxW9Profiles = pgTable(
  "tax_w9_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    legalName: text("legal_name").notNull(),
    businessName: text("business_name"),
    entityType: varchar("entity_type", { length: 30 }).notNull(), // sole_proprietor | llc_single | llc_multi | c_corp | s_corp | partnership | trust
    tinLastFour: varchar("tin_last_four", { length: 4 }).notNull(),
    tinEncrypted: text("tin_encrypted").notNull(), // AES-256-GCM in production
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    city: text("city").notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    zip: varchar("zip", { length: 10 }).notNull(),
    tinVerified: boolean("tin_verified").notNull().default(false),
    tinVerifiedAt: timestamp("tin_verified_at", { withTimezone: true }),
    status: varchar("status", { length: 15 }).notNull().default("draft"), // draft | submitted | verified | rejected
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_tax_w9_profiles_pro_id").on(table.proId),
    index("idx_tax_w9_profiles_status").on(table.status),
    index("idx_tax_w9_profiles_entity_type").on(table.entityType),
  ],
);

// ---------------------------------------------------------------------------
// 1099-NEC RECORDS — auto-generated per payer/payee/year
// ---------------------------------------------------------------------------

export const tax1099Records = pgTable(
  "tax_1099_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    payerUserId: uuid("payer_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    payeeUserId: uuid("payee_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taxYear: integer("tax_year").notNull(),
    totalCents: integer("total_cents").notNull().default(0),
    thresholdMet: boolean("threshold_met").notNull().default(false), // true when >= 60000 ($600.00)
    status: varchar("status", { length: 15 }).notNull().default("tracking"), // tracking | threshold_met | generated | reviewed | filed | corrected
    payerName: text("payer_name").notNull(),
    payeeName: text("payee_name").notNull(),
    payeeTinLastFour: varchar("payee_tin_last_four", { length: 4 }),
    generatedAt: timestamp("generated_at", { withTimezone: true }),
    filedAt: timestamp("filed_at", { withTimezone: true }),
    filingReference: text("filing_reference"),
    correctionOfId: uuid("correction_of_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_tax_1099_payer_payee_year").on(
      table.payerUserId,
      table.payeeUserId,
      table.taxYear,
    ),
    index("idx_tax_1099_payer_user_id").on(table.payerUserId),
    index("idx_tax_1099_payee_user_id").on(table.payeeUserId),
    index("idx_tax_1099_tax_year").on(table.taxYear),
    index("idx_tax_1099_status").on(table.status),
    index("idx_tax_1099_threshold_met").on(table.thresholdMet),
  ],
);

// ---------------------------------------------------------------------------
// EXPENSES — categorized with Schedule C line mapping
// ---------------------------------------------------------------------------

export const taxExpenses = pgTable(
  "tax_expenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taxYear: integer("tax_year").notNull(),
    category: varchar("category", { length: 30 }).notNull(), // supplies | commissions | vehicle | insurance | tools | contract_labor | office | rent | repairs | utilities | other
    scheduleCLine: varchar("schedule_c_line", { length: 10 }).notNull(), // line_9 | line_10 | line_11 | line_15 | line_22 | etc
    description: text("description").notNull(),
    amountCents: integer("amount_cents").notNull(),
    source: varchar("source", { length: 15 }).notNull().default("manual"), // platform | manual | qbo_sync
    sourceRefId: text("source_ref_id"),
    receiptUrl: text("receipt_url"),
    isDeductible: boolean("is_deductible").notNull().default(true),
    date: date("date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_tax_expenses_user_id").on(table.userId),
    index("idx_tax_expenses_tax_year").on(table.taxYear),
    index("idx_tax_expenses_category").on(table.category),
    index("idx_tax_expenses_date").on(table.date),
    index("idx_tax_expenses_source").on(table.source),
  ],
);

// ---------------------------------------------------------------------------
// MILEAGE LOGS — IRS standard rate deduction
// ---------------------------------------------------------------------------

export const taxMileageLogs = pgTable(
  "tax_mileage_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
    date: date("date").notNull(),
    originAddress: text("origin_address").notNull(),
    destinationAddress: text("destination_address").notNull(),
    miles: numeric("miles", { precision: 8, scale: 2 }).notNull(),
    irsRateCents: integer("irs_rate_cents").notNull().default(67), // 2024 rate: $0.67/mile
    deductionCents: integer("deduction_cents").notNull(), // miles * rate, auto-calculated
    source: varchar("source", { length: 15 }).notNull().default("manual"), // gps_auto | manual
    isBusiness: boolean("is_business").notNull().default(true),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_tax_mileage_pro_id").on(table.proId),
    index("idx_tax_mileage_job_id").on(table.jobId),
    index("idx_tax_mileage_date").on(table.date),
    index("idx_tax_mileage_source").on(table.source),
  ],
);

// ---------------------------------------------------------------------------
// QUARTERLY ESTIMATED TAX
// ---------------------------------------------------------------------------

export const taxQuarterlyEstimates = pgTable(
  "tax_quarterly_estimates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taxYear: integer("tax_year").notNull(),
    quarter: integer("quarter").notNull(), // 1-4
    ytdIncomeCents: integer("ytd_income_cents").notNull().default(0),
    ytdExpensesCents: integer("ytd_expenses_cents").notNull().default(0),
    taxableIncomeCents: integer("taxable_income_cents").notNull().default(0),
    seTaxCents: integer("se_tax_cents").notNull().default(0), // 15.3% of 92.35% of net
    incomeTaxCents: integer("income_tax_cents").notNull().default(0),
    totalEstimatedCents: integer("total_estimated_cents").notNull().default(0),
    deadline: date("deadline").notNull(),
    reminderSent: boolean("reminder_sent").notNull().default(false),
    paymentMade: boolean("payment_made").notNull().default(false),
    paymentAmountCents: integer("payment_amount_cents"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_tax_quarterly_pro_year_q").on(
      table.proId,
      table.taxYear,
      table.quarter,
    ),
    index("idx_tax_quarterly_pro_id").on(table.proId),
    index("idx_tax_quarterly_tax_year").on(table.taxYear),
    index("idx_tax_quarterly_deadline").on(table.deadline),
  ],
);

// ---------------------------------------------------------------------------
// YEAR-END TAX PACKAGES
// ---------------------------------------------------------------------------

export const taxYearPackages = pgTable(
  "tax_year_packages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taxYear: integer("tax_year").notNull(),
    role: varchar("role", { length: 10 }).notNull(), // pro | client | pm
    totalIncomeCents: integer("total_income_cents").notNull().default(0),
    totalExpensesCents: integer("total_expenses_cents").notNull().default(0),
    totalMileageDeductionCents: integer("total_mileage_deduction_cents")
      .notNull()
      .default(0),
    total1099sIssued: integer("total_1099s_issued").notNull().default(0),
    total1099sReceived: integer("total_1099s_received").notNull().default(0),
    packageData: jsonb("package_data").default({}), // full summary JSON
    pdfUrl: text("pdf_url"),
    exportedTo: varchar("exported_to", { length: 15 }), // turbotax | qbo | cpa | null
    generatedAt: timestamp("generated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_tax_year_pkg_user_year_role").on(
      table.userId,
      table.taxYear,
      table.role,
    ),
    index("idx_tax_year_packages_user_id").on(table.userId),
    index("idx_tax_year_packages_tax_year").on(table.taxYear),
  ],
);
