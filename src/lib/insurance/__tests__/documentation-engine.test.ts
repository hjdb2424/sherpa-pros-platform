// =============================================================================
// Documentation Engine — Unit Tests
// =============================================================================

import { describe, test, expect, beforeEach } from 'vitest';
import {
  createDocPackage,
  getDocPackage,
  addTimelineEvent,
  addPhoto,
  addMoistureReading,
  addDryingLogEntry,
  generateMitigationReport,
  generateRestorationEstimate,
  addPermitRequirements,
  finalizePackage,
  markSubmittedToCarrier,
  getPackageSummary,
  _resetStore,
} from '../documentation-engine';
import {
  validateMitigationProtocol,
  generateComplianceReport,
  getDryingGoals,
} from '../iicrc-compliance';
import type { MitigationAction } from '../iicrc-compliance';

// Reset store between tests for isolation
beforeEach(() => {
  _resetStore();
});

// =============================================================================
// 1. Package Creation
// =============================================================================

describe('createDocPackage', () => {
  test('creates a package with correct initial state', () => {
    const pkg = createDocPackage({
      job_id: 'job-123',
      category: 'water_damage',
      severity: 'critical',
      description: 'Burst pipe flooded basement',
      cause: 'Frozen pipe burst in upstairs bathroom',
      claim_number: 'CLM-001',
      carrier: 'Amica Mutual',
    });

    expect(pkg.id).toBeTruthy();
    expect(pkg.job_id).toBe('job-123');
    expect(pkg.status).toBe('draft');
    expect(pkg.incident.category).toBe('water_damage');
    expect(pkg.incident.severity).toBe('critical');
    expect(pkg.claim_number).toBe('CLM-001');
    expect(pkg.carrier).toBe('Amica Mutual');
    expect(pkg.photos).toHaveLength(0);
    expect(pkg.moisture_data).toHaveLength(0);
    expect(pkg.drying_log).toHaveLength(0);
    expect(pkg.mitigation_report).toBeNull();
    expect(pkg.restoration_estimate).toBeNull();
  });

  test('automatically adds incident_reported timeline event', () => {
    const pkg = createDocPackage({
      job_id: 'job-123',
      category: 'water_damage',
      severity: 'urgent',
      description: 'Pipe leak in kitchen',
      cause: 'Corroded pipe joint',
    });

    expect(pkg.timeline).toHaveLength(1);
    expect(pkg.timeline[0].type).toBe('incident_reported');
    expect(pkg.timeline[0].description).toContain('Water Damage');
  });

  test('retrieves created package by ID', () => {
    const pkg = createDocPackage({
      job_id: 'job-456',
      category: 'fire_smoke',
      severity: 'critical',
      description: 'Kitchen fire',
      cause: 'Grease fire on stovetop',
    });

    const retrieved = getDocPackage(pkg.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe(pkg.id);
    expect(retrieved!.incident.category).toBe('fire_smoke');
  });

  test('returns null for non-existent package', () => {
    expect(getDocPackage('nonexistent-id')).toBeNull();
  });
});

// =============================================================================
// 2. Timeline Events
// =============================================================================

describe('addTimelineEvent', () => {
  test('adds events in chronological order', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'urgent',
      description: 'Leak',
      cause: 'Pipe',
      reported_at: new Date('2026-04-12T10:00:00Z'),
    });

    addTimelineEvent(pkg.id, {
      type: 'dispatched',
      description: 'Pro dispatched',
      timestamp: new Date('2026-04-12T10:05:00Z'),
    });

    addTimelineEvent(pkg.id, {
      type: 'arrived_on_site',
      description: 'Pro arrived on site',
      timestamp: new Date('2026-04-12T10:30:00Z'),
    });

    addTimelineEvent(pkg.id, {
      type: 'pro_accepted',
      description: 'Pro accepted job',
      timestamp: new Date('2026-04-12T10:06:00Z'),
    });

    const updated = getDocPackage(pkg.id)!;
    // Should be sorted: incident_reported (10:00), dispatched (10:05), pro_accepted (10:06), arrived_on_site (10:30)
    expect(updated.timeline).toHaveLength(4);
    expect(updated.timeline[0].type).toBe('incident_reported');
    expect(updated.timeline[1].type).toBe('dispatched');
    expect(updated.timeline[2].type).toBe('pro_accepted');
    expect(updated.timeline[3].type).toBe('arrived_on_site');
  });

  test('throws for non-existent package', () => {
    expect(() =>
      addTimelineEvent('bad-id', {
        type: 'dispatched',
        description: 'test',
      })
    ).toThrow('not found');
  });
});

// =============================================================================
// 3. Photo Documentation
// =============================================================================

describe('addPhoto', () => {
  test('adds photos with correct phase tagging', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'urgent',
      description: 'Leak',
      cause: 'Pipe',
    });

    addPhoto(pkg.id, {
      url: '/photos/initial-1.jpg',
      phase: 'initial',
      area: 'Basement - North Wall',
      caption: 'Water staining on drywall',
      tagged_damage: ['water damage', 'drywall damage'],
    });

    addPhoto(pkg.id, {
      url: '/photos/during-1.jpg',
      phase: 'during_mitigation',
      area: 'Basement - North Wall',
      caption: 'Equipment deployed for drying',
    });

    addPhoto(pkg.id, {
      url: '/photos/post-1.jpg',
      phase: 'post_mitigation',
      area: 'Basement - North Wall',
      caption: 'Wall dried and ready for restoration',
    });

    const updated = getDocPackage(pkg.id)!;
    expect(updated.photos).toHaveLength(3);

    const initialPhotos = updated.photos.filter((p) => p.phase === 'initial');
    expect(initialPhotos).toHaveLength(1);
    expect(initialPhotos[0].tagged_damage).toContain('water damage');
    expect(initialPhotos[0].area).toBe('Basement - North Wall');

    const duringPhotos = updated.photos.filter((p) => p.phase === 'during_mitigation');
    expect(duringPhotos).toHaveLength(1);
  });
});

// =============================================================================
// 4. Moisture Reading Tracking
// =============================================================================

describe('moisture readings', () => {
  test('adds and tracks moisture readings', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'urgent',
      description: 'Flood',
      cause: 'Pipe burst',
    });

    addMoistureReading(pkg.id, {
      location: 'Living Room - North Wall',
      reading: 45,
      equipment: 'Protimeter Surveymaster',
    });

    addMoistureReading(pkg.id, {
      location: 'Living Room - North Wall',
      reading: 22,
      equipment: 'Protimeter Surveymaster',
    });

    const updated = getDocPackage(pkg.id)!;
    expect(updated.moisture_data).toHaveLength(2);
    expect(updated.moisture_data[0].reading).toBe(45);
    expect(updated.moisture_data[1].reading).toBe(22);
  });

  test('drying log entries also populate moisture_data', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'urgent',
      description: 'Flood',
      cause: 'Pipe burst',
    });

    addDryingLogEntry(pkg.id, {
      readings: [
        { location: 'Kitchen - Floor', reading: 30, timestamp: new Date(), equipment: 'Delmhorst BD-2100' },
        { location: 'Kitchen - Wall', reading: 25, timestamp: new Date(), equipment: 'Delmhorst BD-2100' },
      ],
      equipment_placed: ['4x LGR Dehumidifiers', '12x Air Movers'],
      notes: 'Day 1 setup complete',
    });

    const updated = getDocPackage(pkg.id)!;
    expect(updated.drying_log).toHaveLength(1);
    expect(updated.drying_log[0].equipment_placed).toContain('4x LGR Dehumidifiers');
    // Readings should also be in moisture_data
    expect(updated.moisture_data).toHaveLength(2);
  });
});

// =============================================================================
// 5. Mitigation Report Generation
// =============================================================================

describe('generateMitigationReport', () => {
  test('calculates equipment costs correctly', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'critical',
      description: 'Major flood',
      cause: 'Main water line break',
    });

    // Add low moisture readings so drying goals pass
    addMoistureReading(pkg.id, { location: 'Room A', reading: 8, equipment: 'Meter' });

    const report = generateMitigationReport(pkg.id, {
      affected_areas: [
        {
          name: 'Basement',
          square_footage: 800,
          damage_type: ['water damage'],
          damage_class: 'Class 3',
          damage_category: 'Category 2',
          materials_affected: ['carpet', 'drywall', 'hardwood'],
        },
      ],
      equipment_deployed: [
        {
          type: 'LGR Dehumidifier',
          quantity: 4,
          placed_date: new Date('2026-04-01'),
          removed_date: new Date('2026-04-04'), // 3 days
          daily_rate_cents: 7_500,
        },
        {
          type: 'Air Mover',
          quantity: 12,
          placed_date: new Date('2026-04-01'),
          removed_date: new Date('2026-04-04'),
          daily_rate_cents: 3_500,
        },
      ],
      labor_hours: 24,
      labor_rate_cents: 8_500, // $85/hr
      materials_cost_cents: 15_000,
    });

    // 4 dehumidifiers x 3 days x $75/day = $900 = 90,000 cents
    // 12 air movers x 3 days x $35/day = $1,260 = 126,000 cents
    expect(report.total_equipment_cost_cents).toBe(90_000 + 126_000);
    expect(report.total_equipment_days).toBe(4 * 3 + 12 * 3); // 48
    expect(report.labor_cost_cents).toBe(24 * 8_500); // 204,000
    expect(report.total_mitigation_cost_cents).toBe(
      90_000 + 126_000 + 204_000 + 15_000
    );
    expect(report.summary).toContain('Water Damage');
    expect(report.summary).toContain('800 SF');
  });
});

// =============================================================================
// 6. Restoration Estimate
// =============================================================================

describe('generateRestorationEstimate', () => {
  test('calculates O&P and totals correctly', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'urgent',
      description: 'Flood damage',
      cause: 'Pipe',
    });

    const estimate = generateRestorationEstimate(pkg.id, {
      line_items: [
        { category: 'Drywall', description: 'Drywall R&R', quantity: 200, unit: 'SF', unit_price_cents: 425, total_cents: 85_000 },
        { category: 'Flooring', description: 'Hardwood R&R', quantity: 150, unit: 'SF', unit_price_cents: 1_200, total_cents: 180_000 },
      ],
      overhead_percent: 10,
      profit_percent: 10,
      tax_percent: 0,
    });

    expect(estimate.subtotal_cents).toBe(265_000);
    expect(estimate.overhead_cents).toBe(26_500);
    expect(estimate.profit_cents).toBe(26_500);
    expect(estimate.total_cents).toBe(318_000);
    expect(estimate.line_items).toHaveLength(2);
  });
});

// =============================================================================
// 7. Package Finalization
// =============================================================================

describe('finalizePackage', () => {
  test('warns when required documentation is missing', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'urgent',
      description: 'Flood',
      cause: 'Pipe',
    });

    const { warnings } = finalizePackage(pkg.id);

    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.includes('photos'))).toBe(true);
    expect(warnings.some((w) => w.includes('moisture'))).toBe(true);
    expect(warnings.some((w) => w.includes('mitigation report'))).toBe(true);

    const updated = getDocPackage(pkg.id)!;
    expect(updated.status).toBe('complete');
  });

  test('no moisture warning for non-water categories', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'electrical',
      severity: 'same_day',
      description: 'Electrical issue',
      cause: 'Short circuit',
    });

    const { warnings } = finalizePackage(pkg.id);
    expect(warnings.some((w) => w.includes('moisture'))).toBe(false);
  });

  test('markSubmittedToCarrier requires complete status', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'urgent',
      description: 'Flood',
      cause: 'Pipe',
    });

    // Should throw — still in draft status
    expect(() => markSubmittedToCarrier(pkg.id)).toThrow('finalize first');

    finalizePackage(pkg.id);
    const submitted = markSubmittedToCarrier(pkg.id);
    expect(submitted.status).toBe('submitted_to_carrier');
  });
});

// =============================================================================
// 8. Package Summary
// =============================================================================

describe('getPackageSummary', () => {
  test('produces readable summary with all sections', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'critical',
      description: 'Major basement flood',
      cause: 'Hot water heater burst',
      claim_number: 'CLM-999',
      carrier: 'Liberty Mutual',
    });

    addPhoto(pkg.id, {
      url: '/photos/1.jpg',
      phase: 'initial',
      area: 'Basement',
      caption: 'Flood damage',
    });

    const summary = getPackageSummary(pkg.id);
    expect(summary).toContain('Insurance Documentation Package');
    expect(summary).toContain('DRAFT');
    expect(summary).toContain('Water Damage');
    expect(summary).toContain('CLM-999');
    expect(summary).toContain('Liberty Mutual');
    expect(summary).toContain('Photos: 1');
  });
});

// =============================================================================
// 9. IICRC Compliance Validation
// =============================================================================

describe('validateMitigationProtocol', () => {
  test('water damage — all actions performed passes', () => {
    const actions: MitigationAction[] = [
      { action: 'moisture_mapping_performed', performed: true },
      { action: 'water_source_identified', performed: true },
      { action: 'water_source_stopped', performed: true },
      { action: 'standing_water_extracted', performed: true },
      { action: 'affected_materials_identified', performed: true },
      { action: 'damage_class_determined', performed: true },
      { action: 'damage_category_determined', performed: true },
      { action: 'drying_goals_established', performed: true },
      { action: 'drying_equipment_placed', performed: true },
      { action: 'daily_moisture_monitoring', performed: true },
      { action: 'antimicrobial_applied', performed: true },
      { action: 'contents_protected_or_moved', performed: true },
    ];

    const checks = validateMitigationProtocol('water_damage', actions);
    expect(checks.every((c) => c.passed)).toBe(true);
    expect(checks.length).toBe(12); // water_damage has 12 protocol steps
  });

  test('missing actions are flagged as failures', () => {
    const actions: MitigationAction[] = [
      { action: 'moisture_mapping_performed', performed: true },
      { action: 'water_source_identified', performed: false },
    ];

    const checks = validateMitigationProtocol('water_damage', actions);
    const failed = checks.filter((c) => !c.passed);
    expect(failed.length).toBeGreaterThan(0);
    expect(failed.some((c) => c.details.includes('Not performed'))).toBe(true);
  });
});

// =============================================================================
// 10. Drying Goals
// =============================================================================

describe('getDryingGoals', () => {
  test('hardwood target is 6-9%', () => {
    const goals = getDryingGoals('hardwood', [7, 12]);
    expect(goals).toHaveLength(2);
    expect(goals[0].target_min_percent).toBe(6);
    expect(goals[0].target_max_percent).toBe(9);
    expect(goals[0].met).toBe(true); // 7 is within 6-9
    expect(goals[1].met).toBe(false); // 12 is above 9
  });

  test('drywall target is <1%', () => {
    const goals = getDryingGoals('drywall', [0.5, 3]);
    expect(goals[0].target_max_percent).toBe(1);
    expect(goals[0].met).toBe(true); // 0.5 is within 0-1
    expect(goals[1].met).toBe(false); // 3 is above 1
  });

  test('concrete target is <5%', () => {
    const goals = getDryingGoals('concrete', [3]);
    expect(goals[0].target_max_percent).toBe(5);
    expect(goals[0].met).toBe(true);
  });

  test('unknown material uses conservative 15% default', () => {
    const goals = getDryingGoals('exotic_bamboo', [10]);
    expect(goals[0].target_max_percent).toBe(15);
    expect(goals[0].met).toBe(true);
  });

  test('no readings returns unmet goal', () => {
    const goals = getDryingGoals('hardwood');
    expect(goals).toHaveLength(1);
    expect(goals[0].met).toBe(false);
  });
});

// =============================================================================
// 11. Compliance Report
// =============================================================================

describe('generateComplianceReport', () => {
  test('generates report with gaps for incomplete water damage package', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'water_damage',
      severity: 'critical',
      description: 'Flood',
      cause: 'Pipe burst',
    });

    const report = generateComplianceReport(pkg.id);

    expect(report.package_id).toBe(pkg.id);
    expect(report.category).toBe('water_damage');
    expect(report.overall_pass).toBe(false);
    expect(report.gaps.length).toBeGreaterThan(0);
    expect(report.gaps.some((g) => g.includes('moisture'))).toBe(true);
  });

  test('throws for non-existent package', () => {
    expect(() => generateComplianceReport('bad-id')).toThrow('not found');
  });
});

// =============================================================================
// 12. Permit Requirements
// =============================================================================

describe('addPermitRequirements', () => {
  test('adds permits to package', () => {
    const pkg = createDocPackage({
      job_id: 'job-1',
      category: 'structural',
      severity: 'urgent',
      description: 'Structural damage',
      cause: 'Tree fell on roof',
    });

    const permits = addPermitRequirements(pkg.id, [
      {
        type: 'Building',
        jurisdiction: 'Manchester, NH',
        required: true,
        estimated_cost_cents: 15_000,
        estimated_days: 5,
      },
    ]);

    expect(permits).toHaveLength(1);
    expect(permits[0].type).toBe('Building');

    const updated = getDocPackage(pkg.id)!;
    expect(updated.permit_requirements).toHaveLength(1);
  });
});
