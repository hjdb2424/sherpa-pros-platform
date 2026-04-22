/**
 * PM (Property Management) Tier — Drizzle Schema
 *
 * Supports property-centric navigation for commercial accounts:
 * portfolio management, work orders, vendor relationships,
 * recurring maintenance, make-readies, and compliance tracking.
 *
 * All monetary values stored as integer cents.
 * PostGIS geography columns typed as text — spatial ops use raw SQL.
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
} from "drizzle-orm/pg-core";
import { users } from "../drizzle-schema";

// Re-export users so routes can import from one place
export { users };

// ---------------------------------------------------------------------------
// PROPERTIES
// ---------------------------------------------------------------------------

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pmUserId: uuid("pm_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    zip: text("zip"),
    propertyType: varchar("property_type", { length: 30 }).notNull(),
    unitCount: integer("unit_count").notNull().default(0),
    totalSqft: integer("total_sqft"),
    yearBuilt: integer("year_built"),
    monthlyBudgetCents: integer("monthly_budget_cents"),
    reserveFundCents: integer("reserve_fund_cents"),
    location: text("location"), // PostGIS GEOGRAPHY(Point, 4326)
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_properties_pm_user_id").on(table.pmUserId),
    index("idx_properties_property_type").on(table.propertyType),
    index("idx_properties_city_state").on(table.city, table.state),
  ],
);

// ---------------------------------------------------------------------------
// UNITS
// ---------------------------------------------------------------------------

export const units = pgTable(
  "units",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    unitNumber: text("unit_number").notNull(),
    sqft: integer("sqft"),
    bedrooms: integer("bedrooms"),
    bathrooms: numeric("bathrooms", { precision: 3, scale: 1 }),
    status: varchar("status", { length: 15 }).notNull().default("vacant"),
    tenantUserId: uuid("tenant_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    monthlyRentCents: integer("monthly_rent_cents"),
    leaseStart: date("lease_start"),
    leaseEnd: date("lease_end"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_units_property_id").on(table.propertyId),
    index("idx_units_status").on(table.status),
    index("idx_units_tenant_user_id").on(table.tenantUserId),
  ],
);

// ---------------------------------------------------------------------------
// WORK ORDERS
// ---------------------------------------------------------------------------

export const workOrders = pgTable(
  "work_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    unitId: uuid("unit_id").references(() => units.id, {
      onDelete: "set null",
    }),
    pmUserId: uuid("pm_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tenantUserId: uuid("tenant_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    assignedProId: uuid("assigned_pro_id"),
    title: text("title").notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }),
    priority: varchar("priority", { length: 15 }).notNull().default("routine"),
    status: varchar("status", { length: 20 }).notNull().default("new"),
    slaHours: integer("sla_hours"),
    budgetCents: integer("budget_cents"),
    actualCostCents: integer("actual_cost_cents"),
    expenseType: varchar("expense_type", { length: 10 }),
    poNumber: varchar("po_number", { length: 50 }),
    submittedBy: varchar("submitted_by", { length: 10 }).notNull().default("pm"),
    photos: jsonb("photos").default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    dispatchedAt: timestamp("dispatched_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_work_orders_property_id").on(table.propertyId),
    index("idx_work_orders_unit_id").on(table.unitId),
    index("idx_work_orders_pm_user_id").on(table.pmUserId),
    index("idx_work_orders_assigned_pro_id").on(table.assignedProId),
    index("idx_work_orders_status").on(table.status),
    index("idx_work_orders_priority").on(table.priority),
    index("idx_work_orders_category").on(table.category),
    index("idx_work_orders_created_at").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// PREFERRED VENDORS
// ---------------------------------------------------------------------------

export const preferredVendors = pgTable(
  "preferred_vendors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pmUserId: uuid("pm_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    proId: uuid("pro_id").notNull(),
    tradeCategory: varchar("trade_category", { length: 100 }).notNull(),
    negotiatedRateCents: integer("negotiated_rate_cents"),
    priorityRank: integer("priority_rank").notNull().default(1),
    insuranceVerified: boolean("insurance_verified").notNull().default(false),
    insuranceExpiry: date("insurance_expiry"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_preferred_vendors_pm_user_id").on(table.pmUserId),
    index("idx_preferred_vendors_pro_id").on(table.proId),
    index("idx_preferred_vendors_trade_category").on(table.tradeCategory),
  ],
);

// ---------------------------------------------------------------------------
// MAINTENANCE SCHEDULES
// ---------------------------------------------------------------------------

export const maintenanceSchedules = pgTable(
  "maintenance_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    unitId: uuid("unit_id").references(() => units.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }),
    frequency: varchar("frequency", { length: 20 }).notNull(),
    nextDue: date("next_due").notNull(),
    lastCompleted: date("last_completed"),
    estimatedCostCents: integer("estimated_cost_cents"),
    preferredVendorId: uuid("preferred_vendor_id").references(
      () => preferredVendors.id,
      { onDelete: "set null" },
    ),
    autoDispatch: boolean("auto_dispatch").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_maintenance_schedules_property_id").on(table.propertyId),
    index("idx_maintenance_schedules_next_due").on(table.nextDue),
    index("idx_maintenance_schedules_frequency").on(table.frequency),
  ],
);

// ---------------------------------------------------------------------------
// MAKE-READIES
// ---------------------------------------------------------------------------

export const makeReadies = pgTable(
  "make_readies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    unitId: uuid("unit_id")
      .notNull()
      .references(() => units.id, { onDelete: "cascade" }),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    vacateDate: date("vacate_date").notNull(),
    targetReadyDate: date("target_ready_date").notNull(),
    actualReadyDate: date("actual_ready_date"),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    punchList: jsonb("punch_list").default([]),
    totalCostCents: integer("total_cost_cents"),
    workOrderIds: jsonb("work_order_ids").default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_make_readies_unit_id").on(table.unitId),
    index("idx_make_readies_property_id").on(table.propertyId),
    index("idx_make_readies_status").on(table.status),
    index("idx_make_readies_target_ready_date").on(table.targetReadyDate),
  ],
);

// ---------------------------------------------------------------------------
// COMPLIANCE ITEMS
// ---------------------------------------------------------------------------

export const complianceItems = pgTable(
  "compliance_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    itemType: varchar("item_type", { length: 50 }).notNull(),
    description: text("description"),
    dueDate: date("due_date").notNull(),
    completedDate: date("completed_date"),
    status: varchar("status", { length: 15 }).notNull().default("current"),
    certificateUrl: text("certificate_url"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_compliance_items_property_id").on(table.propertyId),
    index("idx_compliance_items_item_type").on(table.itemType),
    index("idx_compliance_items_status").on(table.status),
    index("idx_compliance_items_due_date").on(table.dueDate),
  ],
);
