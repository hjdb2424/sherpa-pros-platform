/**
 * Sherpa Pros Platform — Insurance Documentation Engine
 *
 * Generates insurance-ready documentation packages from job data.
 * Tracks timeline, photos, moisture readings, drying logs, and
 * compiles everything into carrier-submission-ready packages.
 */

import type {
  InsuranceDocPackage,
  TimelineEvent,
  TimelineEventType,
  DocumentedPhoto,
  PhotoPhase,
  MoistureReading,
  DryingLogEntry,
  MitigationReport,
  RestorationEstimate,
  RestorationLineItem,
  PermitRequirement,
  EmergencyCategory,
  EmergencySeverity,
  AffectedArea,
  EquipmentDeployed,
  DocPackageStatus,
} from './types';

// ---------------------------------------------------------------------------
// In-memory store (will be replaced with database persistence)
// ---------------------------------------------------------------------------

const packages = new Map<string, InsuranceDocPackage>();

// ---------------------------------------------------------------------------
// ID Generation
// ---------------------------------------------------------------------------

let idCounter = 0;

function generateId(prefix: string): string {
  idCounter++;
  const timestamp = Date.now().toString(36);
  const counter = idCounter.toString(36).padStart(4, '0');
  return `${prefix}_${timestamp}_${counter}`;
}

/** Reset internal state — for testing only */
export function _resetStore(): void {
  packages.clear();
  idCounter = 0;
}

// ---------------------------------------------------------------------------
// Package CRUD
// ---------------------------------------------------------------------------

export interface CreateDocPackageInput {
  job_id: string;
  category: EmergencyCategory;
  severity: EmergencySeverity;
  description: string;
  cause: string;
  reported_at?: Date;
  claim_number?: string;
  carrier?: string;
  policy_number?: string;
}

/**
 * Creates a new insurance documentation package for a job.
 * Automatically adds an "incident_reported" timeline event.
 */
export function createDocPackage(input: CreateDocPackageInput): InsuranceDocPackage {
  const now = new Date();
  const reportedAt = input.reported_at ?? now;
  const packageId = generateId('idp');

  const initialEvent: TimelineEvent = {
    id: generateId('evt'),
    type: 'incident_reported',
    timestamp: reportedAt,
    description: `${formatCategory(input.category)} incident reported: ${input.description}`,
    actor: 'system',
  };

  const pkg: InsuranceDocPackage = {
    id: packageId,
    job_id: input.job_id,
    claim_number: input.claim_number,
    carrier: input.carrier,
    policy_number: input.policy_number,

    incident: {
      category: input.category,
      severity: input.severity,
      reported_at: reportedAt,
      description: input.description,
      cause: input.cause,
    },

    timeline: [initialEvent],
    photos: [],
    moisture_data: [],
    drying_log: [],

    mitigation_report: null,
    restoration_estimate: null,
    permit_requirements: [],

    generated_at: now,
    updated_at: now,
    status: 'draft',
  };

  packages.set(packageId, pkg);
  return pkg;
}

/**
 * Retrieves a documentation package by ID.
 */
export function getDocPackage(packageId: string): InsuranceDocPackage | null {
  return packages.get(packageId) ?? null;
}

// ---------------------------------------------------------------------------
// Timeline Management
// ---------------------------------------------------------------------------

export interface AddTimelineEventInput {
  type: TimelineEventType;
  description: string;
  timestamp?: Date;
  actor?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Adds a timeline event to the documentation package.
 * Events are stored chronologically.
 */
export function addTimelineEvent(
  packageId: string,
  input: AddTimelineEventInput
): TimelineEvent {
  const pkg = getPackageOrThrow(packageId);

  const event: TimelineEvent = {
    id: generateId('evt'),
    type: input.type,
    timestamp: input.timestamp ?? new Date(),
    description: input.description,
    actor: input.actor,
    metadata: input.metadata,
  };

  pkg.timeline.push(event);
  pkg.timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  pkg.updated_at = new Date();

  return event;
}

// ---------------------------------------------------------------------------
// Photo Documentation
// ---------------------------------------------------------------------------

export interface AddPhotoInput {
  url: string;
  phase: PhotoPhase;
  area: string;
  caption: string;
  timestamp?: Date;
  tagged_damage?: string[];
}

/**
 * Adds a documented photo to the package with area/phase tagging.
 * Photos are critical for carrier claims — every area should have
 * initial, during, and post-mitigation shots.
 */
export function addPhoto(packageId: string, input: AddPhotoInput): DocumentedPhoto {
  const pkg = getPackageOrThrow(packageId);

  const photo: DocumentedPhoto = {
    id: generateId('pht'),
    url: input.url,
    phase: input.phase,
    area: input.area,
    caption: input.caption,
    timestamp: input.timestamp ?? new Date(),
    tagged_damage: input.tagged_damage ?? [],
  };

  pkg.photos.push(photo);
  pkg.updated_at = new Date();

  return photo;
}

// ---------------------------------------------------------------------------
// Moisture Data
// ---------------------------------------------------------------------------

export interface AddMoistureReadingInput {
  location: string;
  reading: number;
  equipment: string;
  timestamp?: Date;
}

/**
 * Adds a moisture reading to the package.
 * Readings track drying progress and are required by IICRC standards
 * for water damage claims.
 */
export function addMoistureReading(
  packageId: string,
  input: AddMoistureReadingInput
): MoistureReading {
  const pkg = getPackageOrThrow(packageId);

  const reading: MoistureReading = {
    id: generateId('mst'),
    location: input.location,
    reading: input.reading,
    timestamp: input.timestamp ?? new Date(),
    equipment: input.equipment,
  };

  pkg.moisture_data.push(reading);
  pkg.updated_at = new Date();

  return reading;
}

// ---------------------------------------------------------------------------
// Drying Log
// ---------------------------------------------------------------------------

export interface AddDryingLogEntryInput {
  date?: Date;
  readings: Omit<MoistureReading, 'id'>[];
  equipment_placed: string[];
  notes: string;
}

/**
 * Adds a drying log entry. Each entry represents a daily check-in
 * with moisture readings and equipment status.
 */
export function addDryingLogEntry(
  packageId: string,
  input: AddDryingLogEntryInput
): DryingLogEntry {
  const pkg = getPackageOrThrow(packageId);

  const entry: DryingLogEntry = {
    id: generateId('drl'),
    date: input.date ?? new Date(),
    readings: input.readings.map((r) => ({
      ...r,
      id: generateId('mst'),
    })),
    equipment_placed: input.equipment_placed,
    notes: input.notes,
  };

  pkg.drying_log.push(entry);
  // Also add readings to the main moisture_data array
  for (const reading of entry.readings) {
    pkg.moisture_data.push(reading);
  }
  pkg.updated_at = new Date();

  return entry;
}

// ---------------------------------------------------------------------------
// Mitigation Report Generation
// ---------------------------------------------------------------------------

export interface GenerateMitigationReportInput {
  affected_areas: AffectedArea[];
  equipment_deployed: EquipmentDeployed[];
  labor_hours: number;
  labor_rate_cents: number; // per hour
  materials_cost_cents: number;
  iicrc_standards_followed?: string[];
}

/**
 * Compiles all collected data into an IICRC-compliant mitigation report.
 * Calculates equipment costs based on daily rates and deployment duration.
 */
export function generateMitigationReport(
  packageId: string,
  input: GenerateMitigationReportInput
): MitigationReport {
  const pkg = getPackageOrThrow(packageId);

  // Calculate equipment costs and total days
  let totalEquipmentDays = 0;
  let totalEquipmentCostCents = 0;

  for (const equip of input.equipment_deployed) {
    const removedDate = equip.removed_date ?? new Date();
    const days = Math.max(
      1,
      Math.ceil(
        (removedDate.getTime() - equip.placed_date.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const equipCost = days * equip.quantity * equip.daily_rate_cents;
    totalEquipmentDays += days * equip.quantity;
    totalEquipmentCostCents += equipCost;
  }

  const laborCostCents = Math.round(input.labor_hours * input.labor_rate_cents);
  const totalMitigationCostCents =
    totalEquipmentCostCents + laborCostCents + input.materials_cost_cents;

  // Check if drying goals are met (latest readings should be below targets)
  const dryingGoalsMet = checkDryingGoalsMet(pkg);

  // Find the completion event in timeline
  const completionEvent = pkg.timeline.find((e) => e.type === 'mitigation_complete');

  const report: MitigationReport = {
    summary: buildMitigationSummary(pkg, input),
    affected_areas: input.affected_areas,
    equipment_deployed: input.equipment_deployed,
    total_equipment_days: totalEquipmentDays,
    total_equipment_cost_cents: totalEquipmentCostCents,
    labor_hours: input.labor_hours,
    labor_cost_cents: laborCostCents,
    materials_cost_cents: input.materials_cost_cents,
    total_mitigation_cost_cents: totalMitigationCostCents,
    iicrc_standards_followed: input.iicrc_standards_followed ?? [
      'IICRC S500 - Water Damage',
    ],
    drying_goals_met: dryingGoalsMet,
    completion_date: completionEvent?.timestamp,
  };

  pkg.mitigation_report = report;
  pkg.updated_at = new Date();

  return report;
}

// ---------------------------------------------------------------------------
// Restoration Estimate Generation
// ---------------------------------------------------------------------------

export interface GenerateRestorationEstimateInput {
  line_items: Omit<RestorationLineItem, 'id'>[];
  overhead_percent?: number;
  profit_percent?: number;
  tax_percent?: number;
  notes?: string;
}

/**
 * Generates a restoration estimate from line items.
 * Applies standard O&P (overhead & profit) and tax calculations.
 */
export function generateRestorationEstimate(
  packageId: string,
  input: GenerateRestorationEstimateInput
): RestorationEstimate {
  const pkg = getPackageOrThrow(packageId);

  const overheadPercent = input.overhead_percent ?? 10;
  const profitPercent = input.profit_percent ?? 10;
  const taxPercent = input.tax_percent ?? 0;

  const lineItems: RestorationLineItem[] = input.line_items.map((item) => ({
    ...item,
    id: generateId('rli'),
  }));

  const subtotalCents = lineItems.reduce((sum, item) => sum + item.total_cents, 0);
  const overheadCents = Math.round(subtotalCents * (overheadPercent / 100));
  const profitCents = Math.round(subtotalCents * (profitPercent / 100));
  const taxableCents = subtotalCents + overheadCents + profitCents;
  const taxCents = Math.round(taxableCents * (taxPercent / 100));
  const totalCents = taxableCents + taxCents;

  const estimate: RestorationEstimate = {
    line_items: lineItems,
    subtotal_cents: subtotalCents,
    overhead_percent: overheadPercent,
    overhead_cents: overheadCents,
    profit_percent: profitPercent,
    profit_cents: profitCents,
    tax_percent: taxPercent,
    tax_cents: taxCents,
    total_cents: totalCents,
    notes: input.notes ?? '',
  };

  pkg.restoration_estimate = estimate;
  pkg.updated_at = new Date();

  return estimate;
}

// ---------------------------------------------------------------------------
// Permit Requirements
// ---------------------------------------------------------------------------

/**
 * Adds permit requirements to the package.
 */
export function addPermitRequirements(
  packageId: string,
  permits: PermitRequirement[]
): PermitRequirement[] {
  const pkg = getPackageOrThrow(packageId);
  pkg.permit_requirements.push(...permits);
  pkg.updated_at = new Date();
  return pkg.permit_requirements;
}

// ---------------------------------------------------------------------------
// Finalize Package
// ---------------------------------------------------------------------------

/**
 * Marks the documentation package as complete.
 * Validates that required sections exist before finalizing.
 * Returns a list of warnings if optional sections are missing.
 */
export function finalizePackage(
  packageId: string
): { package: InsuranceDocPackage; warnings: string[] } {
  const pkg = getPackageOrThrow(packageId);
  const warnings: string[] = [];

  // Required sections check
  if (pkg.timeline.length < 2) {
    warnings.push('Timeline has fewer than 2 events — consider adding dispatch and arrival events');
  }

  if (pkg.photos.length === 0) {
    warnings.push('No photos documented — photos are critical for carrier approval');
  } else {
    const phases = new Set(pkg.photos.map((p) => p.phase));
    if (!phases.has('initial')) {
      warnings.push('Missing initial damage photos — add pre-mitigation documentation');
    }
    if (!phases.has('post_mitigation')) {
      warnings.push('Missing post-mitigation photos — add completion documentation');
    }
  }

  if (
    pkg.incident.category === 'water_damage' &&
    pkg.moisture_data.length === 0
  ) {
    warnings.push('Water damage claim has no moisture readings — IICRC requires moisture mapping');
  }

  if (!pkg.mitigation_report) {
    warnings.push('No mitigation report generated — run generateMitigationReport before finalizing');
  }

  if (!pkg.restoration_estimate) {
    warnings.push('No restoration estimate — consider generating one for complete documentation');
  }

  pkg.status = 'complete';
  pkg.updated_at = new Date();

  return { package: pkg, warnings };
}

/**
 * Marks the package as submitted to carrier.
 */
export function markSubmittedToCarrier(packageId: string): InsuranceDocPackage {
  const pkg = getPackageOrThrow(packageId);
  if (pkg.status !== 'complete') {
    throw new Error(
      `Cannot submit package in "${pkg.status}" status — finalize first`
    );
  }
  pkg.status = 'submitted_to_carrier';
  pkg.updated_at = new Date();
  return pkg;
}

// ---------------------------------------------------------------------------
// Package Summary
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable summary of the documentation package.
 * Useful for dashboard display and quick review.
 */
export function getPackageSummary(packageId: string): string {
  const pkg = getPackageOrThrow(packageId);

  const lines: string[] = [
    `Insurance Documentation Package — ${pkg.id}`,
    `Status: ${pkg.status.toUpperCase()}`,
    `Job: ${pkg.job_id}`,
    '',
    `--- Incident ---`,
    `Category: ${formatCategory(pkg.incident.category)}`,
    `Severity: ${pkg.incident.severity}`,
    `Cause: ${pkg.incident.cause}`,
    `Reported: ${pkg.incident.reported_at.toISOString()}`,
    `Description: ${pkg.incident.description}`,
  ];

  if (pkg.claim_number) {
    lines.push(`Claim #: ${pkg.claim_number}`);
  }
  if (pkg.carrier) {
    lines.push(`Carrier: ${pkg.carrier}`);
  }

  lines.push('');
  lines.push(`--- Documentation ---`);
  lines.push(`Timeline events: ${pkg.timeline.length}`);
  lines.push(`Photos: ${pkg.photos.length}`);
  lines.push(`Moisture readings: ${pkg.moisture_data.length}`);
  lines.push(`Drying log entries: ${pkg.drying_log.length}`);

  if (pkg.mitigation_report) {
    lines.push('');
    lines.push('--- Mitigation Report ---');
    lines.push(
      `Affected areas: ${pkg.mitigation_report.affected_areas.length}`
    );
    lines.push(
      `Equipment deployed: ${pkg.mitigation_report.equipment_deployed.length} types`
    );
    lines.push(
      `Total equipment days: ${pkg.mitigation_report.total_equipment_days}`
    );
    lines.push(`Labor hours: ${pkg.mitigation_report.labor_hours}`);
    lines.push(
      `Total mitigation cost: $${(pkg.mitigation_report.total_mitigation_cost_cents / 100).toFixed(2)}`
    );
    lines.push(
      `Drying goals met: ${pkg.mitigation_report.drying_goals_met ? 'Yes' : 'No'}`
    );
  }

  if (pkg.restoration_estimate) {
    lines.push('');
    lines.push('--- Restoration Estimate ---');
    lines.push(
      `Line items: ${pkg.restoration_estimate.line_items.length}`
    );
    lines.push(
      `Total: $${(pkg.restoration_estimate.total_cents / 100).toFixed(2)}`
    );
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPackageOrThrow(packageId: string): InsuranceDocPackage {
  const pkg = packages.get(packageId);
  if (!pkg) {
    throw new Error(`Documentation package "${packageId}" not found`);
  }
  return pkg;
}

function formatCategory(category: EmergencyCategory): string {
  const labels: Record<EmergencyCategory, string> = {
    water_damage: 'Water Damage',
    fire_smoke: 'Fire & Smoke',
    storm: 'Storm Damage',
    hvac: 'HVAC Emergency',
    electrical: 'Electrical Emergency',
    gas_leak: 'Gas Leak',
    structural: 'Structural Damage',
  };
  return labels[category];
}

/**
 * Check if the latest moisture readings are within acceptable ranges.
 * Uses simplified IICRC drying goals.
 */
function checkDryingGoalsMet(pkg: InsuranceDocPackage): boolean {
  if (pkg.moisture_data.length === 0) return false;

  // Group readings by location, take the latest for each
  const latestByLocation = new Map<string, MoistureReading>();
  for (const reading of pkg.moisture_data) {
    const existing = latestByLocation.get(reading.location);
    if (!existing || reading.timestamp > existing.timestamp) {
      latestByLocation.set(reading.location, reading);
    }
  }

  // All latest readings should be below 15% (general acceptable threshold)
  const latestReadings = Array.from(latestByLocation.values());
  for (const reading of latestReadings) {
    if (reading.reading > 15) return false;
  }

  return true;
}

function buildMitigationSummary(
  pkg: InsuranceDocPackage,
  input: GenerateMitigationReportInput
): string {
  const areaCount = input.affected_areas.length;
  const totalSF = input.affected_areas.reduce(
    (sum, a) => sum + a.square_footage,
    0
  );
  const equipCount = input.equipment_deployed.reduce(
    (sum, e) => sum + e.quantity,
    0
  );

  return (
    `${formatCategory(pkg.incident.category)} mitigation performed for ${areaCount} affected area(s) ` +
    `totaling approximately ${totalSF} SF. ${equipCount} pieces of equipment deployed. ` +
    `${input.labor_hours} labor hours logged. ` +
    `Cause: ${pkg.incident.cause}. ` +
    `${pkg.moisture_data.length} moisture readings collected across ${pkg.drying_log.length} drying log entries.`
  );
}
