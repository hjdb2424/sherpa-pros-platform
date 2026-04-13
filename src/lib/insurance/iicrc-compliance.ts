/**
 * Sherpa Pros Platform — IICRC Standards Compliance Engine
 *
 * Enforces IICRC (Institute of Inspection Cleaning and Restoration Certification)
 * standards for emergency restoration work. Validates that mitigation protocols
 * were followed correctly and generates compliance reports for carrier submission.
 *
 * Key standards referenced:
 *  - S500 — Standard for Professional Water Damage Restoration
 *  - S520 — Standard for Professional Mold Remediation
 *  - S540 — Standard for Professional Fire and Smoke Damage Remediation
 */

import type {
  EmergencyCategory,
  IICRCCert,
  CertRequirement,
  ComplianceCheckItem,
  ComplianceReport,
  DryingGoal,
  InsuranceDocPackage,
} from './types';
import { getDocPackage } from './documentation-engine';

// ---------------------------------------------------------------------------
// Certification Requirements by Emergency Category
// ---------------------------------------------------------------------------

const CERT_REQUIREMENTS: Record<EmergencyCategory, CertRequirement[]> = {
  water_damage: [
    { cert: 'WRT', required: true, reason: 'IICRC S500 requires WRT-certified technician for water damage restoration' },
    { cert: 'ASD', required: false, reason: 'Applied Structural Drying recommended for Class 3-4 water damage' },
  ],
  fire_smoke: [
    { cert: 'FSRT', required: true, reason: 'IICRC S540 requires FSRT-certified technician for fire/smoke restoration' },
    { cert: 'OCT', required: false, reason: 'Odor Control Technician recommended for smoke odor remediation' },
  ],
  storm: [
    { cert: 'WRT', required: true, reason: 'Storm damage often involves water intrusion requiring WRT certification' },
  ],
  hvac: [],
  electrical: [],
  gas_leak: [],
  structural: [
    { cert: 'WRT', required: false, reason: 'Water Restoration Technician recommended if structural damage involves water' },
  ],
};

/**
 * Returns which IICRC certifications are required and recommended
 * for the given emergency category.
 */
export function getRequiredCerts(category: EmergencyCategory): CertRequirement[] {
  return CERT_REQUIREMENTS[category] ?? [];
}

// ---------------------------------------------------------------------------
// Mitigation Protocol Validation
// ---------------------------------------------------------------------------

export interface MitigationAction {
  action: string;
  performed: boolean;
  timestamp?: Date;
  notes?: string;
}

/**
 * Protocol checklists by emergency category.
 * Each action maps to an IICRC standard requirement.
 */
const PROTOCOL_CHECKLISTS: Record<EmergencyCategory, string[]> = {
  water_damage: [
    'moisture_mapping_performed',
    'water_source_identified',
    'water_source_stopped',
    'standing_water_extracted',
    'affected_materials_identified',
    'damage_class_determined',  // Class 1-4
    'damage_category_determined', // Category 1-3
    'drying_goals_established',
    'drying_equipment_placed',
    'daily_moisture_monitoring',
    'antimicrobial_applied',
    'contents_protected_or_moved',
  ],
  fire_smoke: [
    'air_quality_tested',
    'structural_integrity_assessed',
    'contents_inventoried',
    'soot_type_identified',
    'affected_materials_categorized',
    'ventilation_established',
    'source_odor_treated',
    'contents_cleaned_or_removed',
    'hvac_system_inspected',
  ],
  storm: [
    'temporary_protection_installed', // tarp, board-up
    'water_intrusion_assessed',
    'moisture_mapping_performed',
    'debris_removed',
    'structural_integrity_assessed',
    'utility_safety_verified',
  ],
  hvac: [
    'system_shut_down',
    'diagnostic_performed',
    'safety_check_completed',
  ],
  electrical: [
    'power_disconnected',
    'hazard_assessment_completed',
    'safety_check_completed',
  ],
  gas_leak: [
    'gas_shut_off',
    'area_ventilated',
    'leak_source_identified',
    'gas_level_testing_performed',
    'safety_clearance_obtained',
  ],
  structural: [
    'structural_integrity_assessed',
    'temporary_shoring_installed',
    'engineer_consultation_completed',
    'affected_area_secured',
  ],
};

/**
 * Validates whether mitigation actions followed IICRC standards
 * for the given emergency category.
 *
 * Returns a list of compliance check results indicating which
 * protocol steps passed and which were missed.
 */
export function validateMitigationProtocol(
  category: EmergencyCategory,
  actions: MitigationAction[]
): ComplianceCheckItem[] {
  const requiredActions = PROTOCOL_CHECKLISTS[category] ?? [];
  const performedSet = new Set(
    actions.filter((a) => a.performed).map((a) => a.action)
  );

  return requiredActions.map((action) => {
    const passed = performedSet.has(action);
    const matchingAction = actions.find((a) => a.action === action);

    return {
      standard: getStandardForCategory(category),
      description: formatActionName(action),
      passed,
      details: passed
        ? `Completed${matchingAction?.timestamp ? ` at ${matchingAction.timestamp.toISOString()}` : ''}${matchingAction?.notes ? ` — ${matchingAction.notes}` : ''}`
        : `Not performed — required by ${getStandardForCategory(category)}`,
    };
  });
}

// ---------------------------------------------------------------------------
// Compliance Report Generation
// ---------------------------------------------------------------------------

/**
 * Generates a full compliance report for a documentation package.
 * Evaluates timeline completeness, photo documentation, moisture data,
 * and mitigation protocol adherence.
 */
export function generateComplianceReport(
  packageId: string,
  actions?: MitigationAction[]
): ComplianceReport {
  const pkg = getDocPackage(packageId);
  if (!pkg) {
    throw new Error(`Documentation package "${packageId}" not found`);
  }

  const checks: ComplianceCheckItem[] = [];
  const gaps: string[] = [];
  const recommendations: string[] = [];

  // --- Timeline checks ---
  checks.push({
    standard: 'Documentation',
    description: 'Response timeline documented',
    passed: pkg.timeline.length >= 2,
    details:
      pkg.timeline.length >= 2
        ? `${pkg.timeline.length} timeline events recorded`
        : 'Insufficient timeline documentation — minimum 2 events required',
  });

  const hasArrival = pkg.timeline.some((e) => e.type === 'arrived_on_site');
  checks.push({
    standard: 'Documentation',
    description: 'On-site arrival documented',
    passed: hasArrival,
    details: hasArrival
      ? 'Arrival time recorded in timeline'
      : 'Missing arrival event — add arrived_on_site to timeline',
  });

  if (!hasArrival) gaps.push('Missing on-site arrival documentation');

  // --- Photo checks ---
  const photoPhases = new Set(pkg.photos.map((p) => p.phase));
  checks.push({
    standard: 'Documentation',
    description: 'Initial damage photos taken',
    passed: photoPhases.has('initial'),
    details: photoPhases.has('initial')
      ? `${pkg.photos.filter((p) => p.phase === 'initial').length} initial photos`
      : 'No initial damage photos — required before mitigation begins',
  });

  if (!photoPhases.has('initial')) {
    gaps.push('No initial damage photos');
  }

  checks.push({
    standard: 'Documentation',
    description: 'Post-mitigation photos taken',
    passed: photoPhases.has('post_mitigation'),
    details: photoPhases.has('post_mitigation')
      ? `${pkg.photos.filter((p) => p.phase === 'post_mitigation').length} post-mitigation photos`
      : 'No post-mitigation photos — required to demonstrate work completed',
  });

  if (!photoPhases.has('post_mitigation')) {
    gaps.push('No post-mitigation photos');
  }

  // --- Category-specific checks ---
  if (pkg.incident.category === 'water_damage') {
    addWaterDamageChecks(pkg, checks, gaps, recommendations);
  } else if (pkg.incident.category === 'fire_smoke') {
    addFireSmokeChecks(pkg, checks, gaps, recommendations);
  }

  // --- Mitigation protocol checks ---
  if (actions && actions.length > 0) {
    const protocolChecks = validateMitigationProtocol(
      pkg.incident.category,
      actions
    );
    checks.push(...protocolChecks);

    const failedProtocol = protocolChecks.filter((c) => !c.passed);
    for (const failed of failedProtocol) {
      gaps.push(`Protocol gap: ${failed.description}`);
    }
  }

  // --- Mitigation report check ---
  checks.push({
    standard: 'Documentation',
    description: 'Mitigation report generated',
    passed: pkg.mitigation_report !== null,
    details: pkg.mitigation_report
      ? 'Mitigation report is present'
      : 'No mitigation report — generate before submission',
  });

  if (!pkg.mitigation_report) {
    gaps.push('Mitigation report not yet generated');
  }

  const overallPass = checks.every((c) => c.passed);

  if (!overallPass) {
    recommendations.push(
      'Address all gaps before submitting to carrier for fastest claim processing'
    );
  }

  return {
    package_id: packageId,
    category: pkg.incident.category,
    overall_pass: overallPass,
    checks,
    gaps,
    recommendations,
    generated_at: new Date(),
  };
}

// ---------------------------------------------------------------------------
// Drying Goals
// ---------------------------------------------------------------------------

/**
 * IICRC target moisture levels by material type.
 * Values represent acceptable equilibrium moisture content (EMC).
 */
const DRYING_TARGETS: Record<string, { min: number; max: number }> = {
  hardwood: { min: 6, max: 9 },
  softwood: { min: 8, max: 12 },
  drywall: { min: 0, max: 1 },
  plaster: { min: 0, max: 1 },
  concrete: { min: 0, max: 5 },
  carpet: { min: 0, max: 1 },
  carpet_pad: { min: 0, max: 1 },
  insulation: { min: 0, max: 1 },
  osb: { min: 7, max: 12 },
  plywood: { min: 7, max: 12 },
  laminate: { min: 4, max: 8 },
};

/**
 * Calculates target moisture levels for a given material type.
 * Optionally evaluates current readings against the target.
 *
 * @param materialType - Material being dried (e.g., "hardwood", "drywall", "concrete")
 * @param readings - Optional current moisture readings to evaluate
 * @returns Drying goals with pass/fail status per reading
 */
export function getDryingGoals(
  materialType: string,
  readings?: number[]
): DryingGoal[] {
  const normalizedType = materialType.toLowerCase().replace(/[\s-]/g, '_');
  const target = DRYING_TARGETS[normalizedType];

  if (!target) {
    // Unknown material — use conservative defaults
    return (readings ?? [undefined]).map((reading) => ({
      material: materialType,
      target_min_percent: 0,
      target_max_percent: 15,
      current_reading: reading,
      met: reading !== undefined ? reading <= 15 : false,
    }));
  }

  if (!readings || readings.length === 0) {
    return [
      {
        material: materialType,
        target_min_percent: target.min,
        target_max_percent: target.max,
        met: false,
      },
    ];
  }

  return readings.map((reading) => ({
    material: materialType,
    target_min_percent: target.min,
    target_max_percent: target.max,
    current_reading: reading,
    met: reading >= target.min && reading <= target.max,
  }));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStandardForCategory(category: EmergencyCategory): string {
  switch (category) {
    case 'water_damage':
      return 'IICRC S500';
    case 'fire_smoke':
      return 'IICRC S540';
    case 'storm':
      return 'IICRC S500/General';
    default:
      return 'General Standards';
  }
}

function formatActionName(action: string): string {
  return action
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function addWaterDamageChecks(
  pkg: InsuranceDocPackage,
  checks: ComplianceCheckItem[],
  gaps: string[],
  recommendations: string[]
): void {
  // Moisture readings
  const hasMoistureData = pkg.moisture_data.length > 0;
  checks.push({
    standard: 'IICRC S500',
    description: 'Moisture mapping performed',
    passed: hasMoistureData,
    details: hasMoistureData
      ? `${pkg.moisture_data.length} moisture readings recorded`
      : 'No moisture readings — S500 requires moisture mapping before and during drying',
  });

  if (!hasMoistureData) {
    gaps.push('No moisture readings recorded — required by IICRC S500');
  }

  // Drying log
  const hasDryingLog = pkg.drying_log.length > 0;
  checks.push({
    standard: 'IICRC S500',
    description: 'Daily drying log maintained',
    passed: hasDryingLog,
    details: hasDryingLog
      ? `${pkg.drying_log.length} drying log entries`
      : 'No drying log entries — S500 requires daily monitoring',
  });

  if (!hasDryingLog) {
    gaps.push('No drying log entries — daily monitoring required by S500');
    recommendations.push(
      'Add daily drying log entries with moisture readings and equipment status'
    );
  }

  // Multiple days of readings
  if (hasDryingLog && pkg.drying_log.length < 3) {
    recommendations.push(
      'Drying log has fewer than 3 entries — typical water damage requires 3-5 days of monitoring'
    );
  }
}

function addFireSmokeChecks(
  pkg: InsuranceDocPackage,
  checks: ComplianceCheckItem[],
  gaps: string[],
  _recommendations: string[]
): void {
  // Check for during_mitigation photos (documenting cleanup process)
  const hasDuringPhotos = pkg.photos.some(
    (p) => p.phase === 'during_mitigation'
  );
  checks.push({
    standard: 'IICRC S540',
    description: 'In-progress documentation maintained',
    passed: hasDuringPhotos,
    details: hasDuringPhotos
      ? 'During-mitigation photos present'
      : 'No during-mitigation photos — S540 requires process documentation',
  });

  if (!hasDuringPhotos) {
    gaps.push('No during-mitigation photos for fire/smoke restoration');
  }
}
