/**
 * Drizzle ORM Schema Definitions
 *
 * Mirrors the SQL in schema.sql. PostGIS geography columns are typed as
 * `text` here — spatial operations use raw SQL via the query() helper.
 * All monetary values are stored as integer cents.
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  date,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// USERS & AUTH
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }),
    role: varchar("role", { length: 10 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    subtype: varchar("subtype", { length: 20 }),
    stripeAccountId: varchar("stripe_account_id", { length: 64 }),
    stripeAccountStatus: varchar("stripe_account_status", { length: 20 })
      .notNull()
      .default('none'),
    stripeOnboardedAt: timestamp("stripe_onboarded_at", {
      withTimezone: true,
    }),
    isAdmin: boolean("is_admin").default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_users_clerk_id").on(table.clerkId),
    index("idx_users_email").on(table.email),
    index("idx_users_role").on(table.role),
    index("idx_users_stripe_account_id").on(table.stripeAccountId),
  ],
);

// ---------------------------------------------------------------------------
// HUBS
// ---------------------------------------------------------------------------

export const hubs = pgTable(
  "hubs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    region: varchar("region", { length: 10 }).notNull(),
    center: text("center").notNull(), // PostGIS GEOGRAPHY(Point, 4326)
    radiusKm: decimal("radius_km", { precision: 8, scale: 2 }).notNull(),
    dispatchThresholdCents: integer("dispatch_threshold_cents")
      .notNull()
      .default(0),
    isActive: boolean("is_active").notNull().default(true),
    config: jsonb("config").default({}),
    metroLabel: varchar("metro_label", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_hubs_region").on(table.region),
    index("idx_hubs_is_active").on(table.isActive),
  ],
);

// ---------------------------------------------------------------------------
// PRO PROFILES
// ---------------------------------------------------------------------------

export const pros = pgTable(
  "pros",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    bio: text("bio"),
    homeHubId: uuid("home_hub_id").references(() => hubs.id, {
      onDelete: "set null",
    }),
    travelRadiusKm: decimal("travel_radius_km", {
      precision: 8,
      scale: 2,
    }).default("50.00"),
    onboardingStatus: varchar("onboarding_status", { length: 25 })
      .notNull()
      .default("draft"),
    licenseNumber: varchar("license_number", { length: 100 }),
    licenseState: varchar("license_state", { length: 5 }),
    insuranceProvider: varchar("insurance_provider", { length: 255 }),
    insuranceExpiry: date("insurance_expiry"),
    insuranceVerified: boolean("insurance_verified").notNull().default(false),
    backgroundCheckStatus: varchar("background_check_status", { length: 20 }).default(
      "none",
    ),
    backgroundCheckDate: date("background_check_date"),
    ratingScore: integer("rating_score").default(0),
    visibilityScore: integer("visibility_score").default(0),
    badgeTier: varchar("badge_tier", { length: 10 }).default("bronze"),
    isFoundingPro: boolean("is_founding_pro").notNull().default(false),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    location: text("location"), // PostGIS GEOGRAPHY(Point, 4326)
    verificationStatus: varchar("verification_status", { length: 20 }).default(
      "pending",
    ),
    verificationReviewedAt: timestamp("verification_reviewed_at", {
      withTimezone: true,
    }),
    verificationNotes: text("verification_notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pros_user_id").on(table.userId),
    index("idx_pros_home_hub_id").on(table.homeHubId),
    index("idx_pros_onboarding_status").on(table.onboardingStatus),
    index("idx_pros_badge_tier").on(table.badgeTier),
    index("idx_pros_rating_score").on(table.ratingScore),
    index("idx_pros_visibility_score").on(table.visibilityScore),
  ],
);

export const proTrades = pgTable(
  "pro_trades",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    tradeCategory: varchar("trade_category", { length: 100 }).notNull(),
    specialty: varchar("specialty", { length: 255 }),
    experienceYears: integer("experience_years").default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pro_trades_pro_id").on(table.proId),
    index("idx_pro_trades_category").on(table.tradeCategory),
  ],
);

export const proCertifications = pgTable(
  "pro_certifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    certType: varchar("cert_type", { length: 100 }).notNull(),
    certNumber: varchar("cert_number", { length: 100 }),
    issuer: varchar("issuer", { length: 255 }).notNull(),
    issuedDate: date("issued_date").notNull(),
    expiryDate: date("expiry_date"),
    verified: boolean("verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pro_certifications_pro_id").on(table.proId),
    index("idx_pro_certifications_expiry").on(table.expiryDate),
  ],
);

export const proPortfolio = pgTable(
  "pro_portfolio",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    photos: jsonb("photos").default([]),
    projectValue: integer("project_value"), // cents
    category: varchar("category", { length: 100 }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pro_portfolio_pro_id").on(table.proId),
    index("idx_pro_portfolio_category").on(table.category),
  ],
);

export const proAvailability = pgTable(
  "pro_availability",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    date: date("date"),
    status: varchar("status", { length: 15 }).notNull().default("available"),
    recurringDayOfWeek: integer("recurring_day_of_week"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pro_availability_pro_id").on(table.proId),
    index("idx_pro_availability_date").on(table.date),
    index("idx_pro_availability_status").on(table.status),
  ],
);

// ---------------------------------------------------------------------------
// HUB-PRO JUNCTION
// ---------------------------------------------------------------------------

export const hubPros = pgTable(
  "hub_pros",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hubId: uuid("hub_id")
      .notNull()
      .references(() => hubs.id, { onDelete: "cascade" }),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    isHomeHub: boolean("is_home_hub").notNull().default(false),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("hub_pros_hub_id_pro_id_unique").on(table.hubId, table.proId),
    index("idx_hub_pros_hub_id").on(table.hubId),
    index("idx_hub_pros_pro_id").on(table.proId),
  ],
);

// ---------------------------------------------------------------------------
// JOBS
// ---------------------------------------------------------------------------

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientUserId: uuid("client_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }),
    urgency: varchar("urgency", { length: 15 }).notNull().default("standard"),
    budgetMinCents: integer("budget_min_cents"),
    budgetMaxCents: integer("budget_max_cents"),
    location: text("location"), // PostGIS GEOGRAPHY(Point, 4326)
    address: text("address"),
    hubId: uuid("hub_id").references(() => hubs.id, { onDelete: "set null" }),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    dispatchType: varchar("dispatch_type", { length: 10 }).default("bid"),
    permitRequired: boolean("permit_required").notNull().default(false),
    permitDetails: jsonb("permit_details").default({}),
    wisemanValidation: jsonb("wiseman_validation").default({}),
    matchedAt: timestamp("matched_at", { withTimezone: true }),
    parentJobId: uuid("parent_job_id").references((): any => jobs.id),
    sequenceOrder: integer("sequence_order").default(0),
    tradeRequired: varchar("trade_required", { length: 60 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_jobs_client_user_id").on(table.clientUserId),
    index("idx_jobs_hub_id").on(table.hubId),
    index("idx_jobs_status").on(table.status),
    index("idx_jobs_urgency").on(table.urgency),
    index("idx_jobs_category").on(table.category),
    index("idx_jobs_created_at").on(table.createdAt),
    index("idx_jobs_matched_at").on(table.matchedAt),
    index("idx_jobs_parent").on(table.parentJobId),
  ],
);

export const jobMilestones = pgTable(
  "job_milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    amountCents: integer("amount_cents").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    status: varchar("status", { length: 15 }).notNull().default("pending"),
    fundedAt: timestamp("funded_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_job_milestones_job_id").on(table.jobId),
    index("idx_job_milestones_status").on(table.status),
  ],
);

export const jobPhotos = pgTable(
  "job_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    milestoneId: uuid("milestone_id").references(() => jobMilestones.id, {
      onDelete: "set null",
    }),
    phase: varchar("phase", { length: 10 }).notNull(),
    url: text("url").notNull(),
    caption: varchar("caption", { length: 500 }),
    uploadedBy: uuid("uploaded_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_job_photos_job_id").on(table.jobId),
    index("idx_job_photos_milestone_id").on(table.milestoneId),
    index("idx_job_photos_phase").on(table.phase),
  ],
);

// ---------------------------------------------------------------------------
// BIDDING & DISPATCH
// ---------------------------------------------------------------------------

export const bids = pgTable(
  "bids",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    amountCents: integer("amount_cents").notNull(),
    message: text("message"),
    estimatedDurationDays: integer("estimated_duration_days"),
    wisemanDeviationPct: decimal("wiseman_deviation_pct", {
      precision: 5,
      scale: 2,
    }),
    status: varchar("status", { length: 15 }).notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("bids_job_id_pro_id_unique").on(table.jobId, table.proId),
    index("idx_bids_job_id").on(table.jobId),
    index("idx_bids_pro_id").on(table.proId),
    index("idx_bids_status").on(table.status),
  ],
);

export const dispatchAttempts = pgTable(
  "dispatch_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    dispatchScore: decimal("dispatch_score", { precision: 8, scale: 4 }),
    notifiedAt: timestamp("notified_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    response: varchar("response", { length: 10 }),
    attemptOrder: integer("attempt_order").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_dispatch_attempts_job_id").on(table.jobId),
    index("idx_dispatch_attempts_pro_id").on(table.proId),
    index("idx_dispatch_attempts_response").on(table.response),
  ],
);

// ---------------------------------------------------------------------------
// RATINGS & TRUST
// ---------------------------------------------------------------------------

export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    fromUserId: uuid("from_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toUserId: uuid("to_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    overallScore: integer("overall_score").notNull(),
    quality: integer("quality"),
    communication: integer("communication"),
    timeliness: integer("timeliness"),
    value: integer("value"),
    reviewText: text("review_text"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("ratings_job_id_from_user_id_unique").on(
      table.jobId,
      table.fromUserId,
    ),
    index("idx_ratings_job_id").on(table.jobId),
    index("idx_ratings_from_user_id").on(table.fromUserId),
    index("idx_ratings_to_user_id").on(table.toUserId),
    index("idx_ratings_overall_score").on(table.overallScore),
  ],
);

export const ratingResponses = pgTable(
  "rating_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ratingId: uuid("rating_id")
      .notNull()
      .unique()
      .references(() => ratings.id, { onDelete: "cascade" }),
    responderId: uuid("responder_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_rating_responses_rating_id").on(table.ratingId),
    index("idx_rating_responses_responder_id").on(table.responderId),
  ],
);

export const strikes = pgTable(
  "strikes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    severity: varchar("severity", { length: 10 }).notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    notes: text("notes"),
  },
  (table) => [
    index("idx_strikes_pro_id").on(table.proId),
    index("idx_strikes_severity").on(table.severity),
  ],
);

// ---------------------------------------------------------------------------
// PAYMENTS
// ---------------------------------------------------------------------------

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    milestoneId: uuid("milestone_id").references(() => jobMilestones.id, {
      onDelete: "set null",
    }),
    payerUserId: uuid("payer_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    payeeUserId: uuid("payee_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amountCents: integer("amount_cents").notNull(),
    commissionCents: integer("commission_cents").notNull().default(0),
    serviceFeeCents: integer("service_fee_cents").notNull().default(0),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
    status: varchar("status", { length: 15 }).notNull().default("pending"),
    heldAt: timestamp("held_at", { withTimezone: true }),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_payments_job_id").on(table.jobId),
    index("idx_payments_milestone_id").on(table.milestoneId),
    index("idx_payments_payer_user_id").on(table.payerUserId),
    index("idx_payments_payee_user_id").on(table.payeeUserId),
    index("idx_payments_status").on(table.status),
    index("idx_payments_stripe_pi").on(table.stripePaymentIntentId),
  ],
);

export const paymentDisputes = pgTable(
  "payment_disputes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    paymentId: uuid("payment_id")
      .notNull()
      .references(() => payments.id, { onDelete: "cascade" }),
    raisedBy: uuid("raised_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    evidence: jsonb("evidence").default({}),
    status: varchar("status", { length: 15 }).notNull().default("open"),
    resolution: text("resolution"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_payment_disputes_payment_id").on(table.paymentId),
    index("idx_payment_disputes_raised_by").on(table.raisedBy),
    index("idx_payment_disputes_status").on(table.status),
  ],
);

// ---------------------------------------------------------------------------
// COMMUNICATION
// ---------------------------------------------------------------------------

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    proUserId: uuid("pro_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clientUserId: uuid("client_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    twilioConversationSid: varchar("twilio_conversation_sid", { length: 255 }),
    status: varchar("status", { length: 10 }).notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    closedAt: timestamp("closed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("conversations_job_pro_client_unique").on(
      table.jobId,
      table.proUserId,
      table.clientUserId,
    ),
    index("idx_conversations_job_id").on(table.jobId),
    index("idx_conversations_pro_user_id").on(table.proUserId),
    index("idx_conversations_client_user_id").on(table.clientUserId),
    index("idx_conversations_status").on(table.status),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderUserId: uuid("sender_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_messages_conversation_id").on(table.conversationId),
    index("idx_messages_sender_user_id").on(table.senderUserId),
    index("idx_messages_created_at").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// CHECKLISTS
// ---------------------------------------------------------------------------

export const jobChecklists = pgTable(
  "job_checklists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 15 }).notNull(),
    items: jsonb("items").notNull().default([]),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    required: boolean("required").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_job_checklists_job_id").on(table.jobId),
    index("idx_job_checklists_type").on(table.type),
  ],
);

// ---------------------------------------------------------------------------
// BETA TELEMETRY — Phase 0 traction surfaces (NPS, Wiseman events)
// ---------------------------------------------------------------------------

export const npsResponses = pgTable(
  "nps_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 10 }).notNull(),
    score: integer("score").notNull(),
    comment: text("comment"),
    weekOf: date("week_of").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_nps_responses_user_id").on(table.userId),
    index("idx_nps_responses_role").on(table.role),
    index("idx_nps_responses_week_of").on(table.weekOf),
  ],
);

export const wisemanEvents = pgTable(
  "wiseman_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventType: varchar("event_type", { length: 25 }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
    latencyMs: integer("latency_ms"),
    payload: jsonb("payload").default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_wiseman_events_event_type").on(table.eventType),
    index("idx_wiseman_events_user_id").on(table.userId),
    index("idx_wiseman_events_job_id").on(table.jobId),
    index("idx_wiseman_events_created_at").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// PRO SKILLS (Migration 007)
// ---------------------------------------------------------------------------

export const proSkills = pgTable(
  "pro_skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    skillKey: varchar("skill_key", { length: 60 }).notNull(),
    skillCategory: varchar("skill_category", { length: 40 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("pro_skills_pro_id_skill_key_unique").on(
      table.proId,
      table.skillKey,
    ),
    index("idx_pro_skills_pro").on(table.proId),
    index("idx_pro_skills_key").on(table.skillKey),
  ],
);

// ---------------------------------------------------------------------------
// PRO WORK PHOTOS (Migration 007)
// ---------------------------------------------------------------------------

export const proWorkPhotos = pgTable("pro_work_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  proId: uuid("pro_id")
    .notNull()
    .references(() => pros.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: text("caption"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// PRO REFERENCES (Migration 007)
// ---------------------------------------------------------------------------

export const proReferences = pgTable("pro_references", {
  id: uuid("id").primaryKey().defaultRandom(),
  proId: uuid("pro_id")
    .notNull()
    .references(() => pros.id, { onDelete: "cascade" }),
  refName: varchar("ref_name", { length: 100 }).notNull(),
  refPhone: varchar("ref_phone", { length: 20 }).notNull(),
  refRelationship: varchar("ref_relationship", { length: 60 }),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// AUDIT LOGS (Migration 008)
// ---------------------------------------------------------------------------

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    email: text("email"),
    action: varchar("action", { length: 40 }).notNull(),
    targetType: varchar("target_type", { length: 30 }),
    targetId: uuid("target_id"),
    metadata: jsonb("metadata").default({}),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_audit_logs_user").on(table.userId),
    index("idx_audit_logs_action").on(table.action),
    index("idx_audit_logs_created").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// JOB MATERIALS (Migration 010)
// ---------------------------------------------------------------------------

export const jobMaterials = pgTable(
  "job_materials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    materialName: varchar("material_name", { length: 200 }).notNull(),
    quantity: decimal("quantity", { precision: 10, scale: 2 })
      .notNull()
      .default("1"),
    unit: varchar("unit", { length: 20 }).default("each"),
    estimatedCostCents: integer("estimated_cost_cents"),
    supplierSource: varchar("supplier_source", { length: 20 }).default(
      "manual",
    ),
    supplierProductId: text("supplier_product_id"),
    status: varchar("status", { length: 20 }).default("recommended"),
    wisemanNote: text("wiseman_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_job_materials_job").on(table.jobId),
    index("idx_job_materials_status").on(table.status),
  ],
);

// ---------------------------------------------------------------------------
// MATERIAL ORDERS (Migration 010)
// ---------------------------------------------------------------------------

export const materialOrders = pgTable(
  "material_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    supplierApi: varchar("supplier_api", { length: 20 }).notNull(),
    externalOrderId: text("external_order_id"),
    status: varchar("status", { length: 30 }).default("pending"),
    totalCents: integer("total_cents"),
    itemsCount: integer("items_count"),
    pickupAddress: text("pickup_address"),
    pickupInstructions: text("pickup_instructions"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_material_orders_job").on(table.jobId)],
);

// ---------------------------------------------------------------------------
// DELIVERY REQUESTS (Migration 010)
// ---------------------------------------------------------------------------

export const deliveryRequests = pgTable(
  "delivery_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    materialOrderId: uuid("material_order_id")
      .notNull()
      .references(() => materialOrders.id, { onDelete: "cascade" }),
    uberDeliveryId: text("uber_delivery_id"),
    pickupAddress: text("pickup_address").notNull(),
    dropoffAddress: text("dropoff_address").notNull(),
    status: varchar("status", { length: 20 }).default("requested"),
    etaMinutes: integer("eta_minutes"),
    actualDeliveryAt: timestamp("actual_delivery_at", { withTimezone: true }),
    costCents: integer("cost_cents"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_delivery_requests_order").on(table.materialOrderId),
  ],
);
