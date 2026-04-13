// =============================================================================
// Xactimate Bridge — Integration Tests
// =============================================================================

import { describe, test, expect } from 'vitest';
import {
  parseESCFile,
  compareWithMarketRates,
  generateSupplementReport,
  estimateSupplementValue,
} from '../xactimate-bridge';
import {
  getEmergencyPriceRange,
  getEmergencyMultiplier,
  isAfterHours,
} from '../emergency-pricing';
import { getRequiredCerts } from '../iicrc-compliance';
import {
  checkSLACompliance,
  validateProForTier,
  calculateRetainerFee,
} from '../subscription';
import type { DocumentedPhoto, XactimateLineItem } from '../types';

// -----------------------------------------------------------------------------
// Sample ESC File Content
// -----------------------------------------------------------------------------

const SAMPLE_ESC = `!CLAIM
CLM-2026-001234|Amica Mutual|John Smith|2026-03-15|Mike Johnson|POL-789456
!ITEMS
1|Drywall|DRY001|Drywall R&R - 1/2" standard|200|SF|2.50|500.00
2|Flooring|FLR001|Hardwood Floor R&R - Oak 3/4"|150|SF|8.50|1275.00
3|Painting|PNT001|Paint Interior - 2 coats|350|SF|2.00|700.00
4|Mitigation|MIT001|Water Extraction - truck mount|400|SF|1.50|600.00
5|Equipment|EQP001|Dehumidifier - LGR daily|10|DAY|50.00|500.00
6|Equipment|EQP002|Air Mover daily|20|DAY|25.00|500.00
7|Plumbing|PLB001|Plumbing Repair - pipe splice|1|EA|120.00|120.00
!TOTALS
4195.00|419.50|419.50|0.00|5034.00
!END`;

const MINIMAL_ESC = `!CLAIM
CLM-2026-999|State Farm|Jane Doe|2026-04-01
!ITEMS
1|Drywall|DRY001|Drywall R&R|100|SF|2.00|200.00
!TOTALS
200.00|20.00|20.00|0.00|240.00
!END`;

// =============================================================================
// 1. ESC File Parsing
// =============================================================================

describe('parseESCFile', () => {
  test('parses complete ESC file with all sections', () => {
    const result = parseESCFile(SAMPLE_ESC);

    expect(result.metadata.claim_number).toBe('CLM-2026-001234');
    expect(result.metadata.carrier).toBe('Amica Mutual');
    expect(result.metadata.insured_name).toBe('John Smith');
    expect(result.metadata.date_of_loss).toBe('2026-03-15');
    expect(result.metadata.adjuster_name).toBe('Mike Johnson');
    expect(result.metadata.policy_number).toBe('POL-789456');

    expect(result.line_items).toHaveLength(7);
    expect(result.line_items[0].description).toBe('Drywall R&R - 1/2" standard');
    expect(result.line_items[0].quantity).toBe(200);
    expect(result.line_items[0].unit).toBe('SF');
    expect(result.line_items[0].unit_price_cents).toBe(250);
    expect(result.line_items[0].total_cents).toBe(50_000);
  });

  test('parses totals section correctly', () => {
    const result = parseESCFile(SAMPLE_ESC);

    expect(result.subtotal_cents).toBe(419_500);
    expect(result.overhead_cents).toBe(41_950);
    expect(result.profit_cents).toBe(41_950);
    expect(result.tax_cents).toBe(0);
    expect(result.total_cents).toBe(503_400);
  });

  test('parses minimal ESC file without optional claim fields', () => {
    const result = parseESCFile(MINIMAL_ESC);

    expect(result.metadata.claim_number).toBe('CLM-2026-999');
    expect(result.metadata.carrier).toBe('State Farm');
    expect(result.metadata.adjuster_name).toBeUndefined();
    expect(result.metadata.policy_number).toBeUndefined();
    expect(result.line_items).toHaveLength(1);
  });

  test('throws on empty file', () => {
    expect(() => parseESCFile('')).toThrow('ESC file is empty');
  });

  test('throws on file missing CLAIM section', () => {
    const noClaimESC = `!ITEMS
1|Drywall|DRY001|Drywall R&R|100|SF|2.00|200.00
!END`;
    expect(() => parseESCFile(noClaimESC)).toThrow('missing CLAIM section');
  });

  test('handles dollar values with commas and dollar signs', () => {
    const escWithFormatting = `!CLAIM
CLM-001|Carrier|Name|2026-01-01
!ITEMS
1|Drywall|D1|Drywall R&R|500|SF|$4.25|$2,125.00
!TOTALS
$2,125.00|$212.50|$212.50|$0.00|$2,550.00
!END`;

    const result = parseESCFile(escWithFormatting);
    expect(result.line_items[0].unit_price_cents).toBe(425);
    expect(result.line_items[0].total_cents).toBe(212_500);
    expect(result.total_cents).toBe(255_000);
  });
});

// =============================================================================
// 2. Market Rate Comparison
// =============================================================================

describe('compareWithMarketRates', () => {
  test('identifies underpaid items (>15% below market)', () => {
    // Drywall at $2.50/SF vs market ~$4.25/SF = ~41% below market
    const items: XactimateLineItem[] = [
      {
        line_number: 1,
        category: 'Drywall',
        description: 'Drywall R&R - 1/2"',
        quantity: 200,
        unit: 'SF',
        unit_price_cents: 250,
        total_cents: 50_000,
      },
    ];

    const result = compareWithMarketRates(items, 'Manchester, NH');
    expect(result.items).toHaveLength(1);
    expect(result.items[0].status).toBe('underpaid');
    expect(result.items[0].supplement_opportunity).toBe(true);
    expect(result.items[0].deviation_percent).toBeLessThan(-15);
  });

  test('marks items within 15% as fair', () => {
    // Drywall at $4.00/SF vs market ~$4.25/SF = ~6% below
    const items: XactimateLineItem[] = [
      {
        line_number: 1,
        category: 'Drywall',
        description: 'Drywall R&R',
        quantity: 100,
        unit: 'SF',
        unit_price_cents: 400,
        total_cents: 40_000,
      },
    ];

    const result = compareWithMarketRates(items, 'Manchester, NH');
    expect(result.items).toHaveLength(1);
    expect(result.items[0].status).toBe('fair');
    expect(result.items[0].supplement_opportunity).toBe(false);
  });

  test('detects overpaid items (>15% above market)', () => {
    // Drywall at $6.00/SF vs market ~$4.25/SF = ~41% above
    const items: XactimateLineItem[] = [
      {
        line_number: 1,
        category: 'Drywall',
        description: 'Drywall R&R',
        quantity: 100,
        unit: 'SF',
        unit_price_cents: 600,
        total_cents: 60_000,
      },
    ];

    const result = compareWithMarketRates(items, 'Manchester, NH');
    expect(result.items).toHaveLength(1);
    expect(result.items[0].status).toBe('overpaid');
  });

  test('applies location adjustment for Boston (1.35x)', () => {
    const items: XactimateLineItem[] = [
      {
        line_number: 1,
        category: 'Drywall',
        description: 'Drywall R&R',
        quantity: 100,
        unit: 'SF',
        unit_price_cents: 500,
        total_cents: 50_000,
      },
    ];

    const nhResult = compareWithMarketRates(items, 'Manchester, NH');
    const bostonResult = compareWithMarketRates(items, 'Boston');

    // Boston market rate should be higher, making the same Xactimate price
    // appear more underpaid
    expect(bostonResult.items[0].market_price_cents).toBeGreaterThan(
      nhResult.items[0].market_price_cents
    );
  });

  test('calculates total supplement value correctly', () => {
    const parsed = parseESCFile(SAMPLE_ESC);
    const result = compareWithMarketRates(parsed.line_items, 'Manchester, NH');

    expect(result.supplement_items_count).toBeGreaterThanOrEqual(0);
    expect(result.estimated_supplement_value_cents).toBeGreaterThanOrEqual(0);

    // Verify supplement value equals sum of individual underpaid differences
    const manualSum = result.items
      .filter((i) => i.supplement_opportunity)
      .reduce(
        (sum, i) => sum + (i.market_price_cents - i.xactimate_price_cents),
        0
      );
    expect(result.estimated_supplement_value_cents).toBe(manualSum);
  });

  test('handles items with no market rate match', () => {
    const items: XactimateLineItem[] = [
      {
        line_number: 1,
        category: 'Custom',
        description: 'Exotic purple marble countertop installation',
        quantity: 1,
        unit: 'EA',
        unit_price_cents: 500_000,
        total_cents: 500_000,
      },
    ];

    const result = compareWithMarketRates(items);
    // No comparison items since no market match
    expect(result.items).toHaveLength(0);
    // But totals should still include the item
    expect(result.total_xactimate_cents).toBe(500_000);
  });
});

// =============================================================================
// 3. Supplement Report Generation
// =============================================================================

describe('generateSupplementReport', () => {
  test('generates supplement report for underpaid items', () => {
    const parsed = parseESCFile(SAMPLE_ESC);
    const comparison = compareWithMarketRates(parsed.line_items, 'Manchester, NH');

    const photos: DocumentedPhoto[] = [
      {
        id: 'pht-1',
        url: '/photos/damage-1.jpg',
        phase: 'initial',
        area: 'Living Room',
        caption: 'Water damage to drywall',
        timestamp: new Date(),
        tagged_damage: ['water damage'],
      },
    ];

    const report = generateSupplementReport(
      comparison,
      photos,
      'CLM-2026-001234',
      'Amica Mutual'
    );

    expect(report.claim_number).toBe('CLM-2026-001234');
    expect(report.carrier).toBe('Amica Mutual');
    expect(report.supporting_photo_count).toBe(1);
    expect(report.total_supplement_value_cents).toBeGreaterThanOrEqual(0);
    expect(report.summary).toContain('Amica Mutual');
  });

  test('supplement report items include justification with market data', () => {
    const items: XactimateLineItem[] = [
      {
        line_number: 1,
        category: 'Drywall',
        description: 'Drywall R&R',
        quantity: 200,
        unit: 'SF',
        unit_price_cents: 250,
        total_cents: 50_000,
      },
    ];

    const comparison = compareWithMarketRates(items, 'Manchester, NH');
    const report = generateSupplementReport(comparison, [], 'CLM-001', 'Carrier');

    if (report.items.length > 0) {
      expect(report.items[0].justification).toContain('Xactimate line');
      expect(report.items[0].justification).toContain('Market rate');
      expect(report.items[0].justification).toContain('below market');
      expect(report.items[0].justification).toContain('regional comparables');
    }
  });
});

// =============================================================================
// 4. Supplement Value Estimation
// =============================================================================

describe('estimateSupplementValue', () => {
  test('returns total potential recovery', () => {
    const parsed = parseESCFile(SAMPLE_ESC);
    const comparison = compareWithMarketRates(parsed.line_items, 'Manchester, NH');

    const value = estimateSupplementValue(comparison);
    expect(value).toBe(comparison.estimated_supplement_value_cents);
    expect(typeof value).toBe('number');
  });
});

// =============================================================================
// 5. Emergency Pricing with Premiums
// =============================================================================

describe('emergency pricing', () => {
  test('critical severity applies 2x multiplier', () => {
    const estimate = getEmergencyPriceRange('water_damage', 'critical');
    expect(estimate.emergency_multiplier).toBe(2.0);
    expect(estimate.adjusted_range.min_cents).toBeGreaterThan(
      estimate.base_range.min_cents
    );
  });

  test('urgent severity applies 1.5x multiplier', () => {
    const estimate = getEmergencyPriceRange('water_damage', 'urgent');
    expect(estimate.emergency_multiplier).toBe(1.5);
  });

  test('same_day severity applies 1x (no premium)', () => {
    const estimate = getEmergencyPriceRange('water_damage', 'same_day');
    expect(estimate.emergency_multiplier).toBe(1.0);
  });

  test('after-hours surcharge added when outside 7AM-6PM', () => {
    const dayEstimate = getEmergencyPriceRange(
      'water_damage', 'urgent', undefined, undefined, 12
    );
    const nightEstimate = getEmergencyPriceRange(
      'water_damage', 'urgent', undefined, undefined, 22
    );

    expect(dayEstimate.after_hours_surcharge_cents).toBe(0);
    expect(nightEstimate.after_hours_surcharge_cents).toBeGreaterThan(0);
    expect(nightEstimate.adjusted_range.min_cents).toBeGreaterThan(
      dayEstimate.adjusted_range.min_cents
    );
  });

  test('larger square footage increases price range', () => {
    const small = getEmergencyPriceRange('water_damage', 'same_day', 300);
    const large = getEmergencyPriceRange('water_damage', 'same_day', 3000);

    expect(large.adjusted_range.max_cents).toBeGreaterThan(
      small.adjusted_range.max_cents
    );
  });

  test('Boston location applies higher multiplier than Manchester', () => {
    const nh = getEmergencyPriceRange('water_damage', 'same_day', undefined, 'Manchester, NH');
    const boston = getEmergencyPriceRange('water_damage', 'same_day', undefined, 'Boston');

    expect(boston.adjusted_range.min_cents).toBeGreaterThan(
      nh.adjusted_range.min_cents
    );
  });

  test('getEmergencyMultiplier returns correct values', () => {
    expect(getEmergencyMultiplier('critical')).toBe(2.0);
    expect(getEmergencyMultiplier('urgent')).toBe(1.5);
    expect(getEmergencyMultiplier('same_day')).toBe(1.0);
  });

  test('isAfterHours correctly identifies business vs after hours', () => {
    expect(isAfterHours(6)).toBe(true); // 6 AM — before 7
    expect(isAfterHours(7)).toBe(false); // 7 AM — business hours start
    expect(isAfterHours(12)).toBe(false); // noon
    expect(isAfterHours(17)).toBe(false); // 5 PM
    expect(isAfterHours(18)).toBe(true); // 6 PM — after hours start
    expect(isAfterHours(23)).toBe(true); // 11 PM
    expect(isAfterHours(undefined)).toBe(false);
  });
});

// =============================================================================
// 6. IICRC Cert Requirements per Category
// =============================================================================

describe('IICRC cert requirements', () => {
  test('water damage requires WRT', () => {
    const certs = getRequiredCerts('water_damage');
    const required = certs.filter((c) => c.required);
    expect(required.map((c) => c.cert)).toContain('WRT');
  });

  test('water damage recommends ASD', () => {
    const certs = getRequiredCerts('water_damage');
    const recommended = certs.filter((c) => !c.required);
    expect(recommended.map((c) => c.cert)).toContain('ASD');
  });

  test('fire/smoke requires FSRT', () => {
    const certs = getRequiredCerts('fire_smoke');
    const required = certs.filter((c) => c.required);
    expect(required.map((c) => c.cert)).toContain('FSRT');
  });

  test('HVAC has no IICRC cert requirements', () => {
    const certs = getRequiredCerts('hvac');
    expect(certs).toHaveLength(0);
  });

  test('storm requires WRT (water intrusion)', () => {
    const certs = getRequiredCerts('storm');
    const required = certs.filter((c) => c.required);
    expect(required.map((c) => c.cert)).toContain('WRT');
  });
});

// =============================================================================
// 7. SLA Compliance Checking
// =============================================================================

describe('SLA compliance', () => {
  const periodStart = new Date('2026-03-01');
  const periodEnd = new Date('2026-03-31');

  test('100% on-time responses yields compliant status', () => {
    const dispatches = Array.from({ length: 10 }, (_, i) => ({
      dispatched_at: new Date(`2026-03-${String(i + 1).padStart(2, '0')}T10:00:00Z`),
      responded_at: new Date(`2026-03-${String(i + 1).padStart(2, '0')}T10:05:00Z`), // 5 min
      accepted: true,
    }));

    const result = checkSLACompliance('pro-1', dispatches, 'standard', periodStart, periodEnd);
    expect(result.compliant).toBe(true);
    expect(result.compliance_rate).toBe(100);
    expect(result.on_time_responses).toBe(10);
    expect(result.late_responses).toBe(0);
    expect(result.missed_responses).toBe(0);
  });

  test('missed responses counted correctly', () => {
    const dispatches = [
      {
        dispatched_at: new Date('2026-03-01T10:00:00Z'),
        responded_at: new Date('2026-03-01T10:05:00Z'),
        accepted: true,
      },
      {
        dispatched_at: new Date('2026-03-02T10:00:00Z'),
        responded_at: null, // missed
        accepted: false,
      },
    ];

    const result = checkSLACompliance('pro-1', dispatches, 'standard', periodStart, periodEnd);
    expect(result.missed_responses).toBe(1);
    expect(result.on_time_responses).toBe(1);
    expect(result.compliance_rate).toBe(50);
    expect(result.compliant).toBe(false);
  });

  test('late responses detected based on tier max response time', () => {
    // emergency_ready tier has max 30 min response time
    const dispatches = [
      {
        dispatched_at: new Date('2026-03-01T10:00:00Z'),
        responded_at: new Date('2026-03-01T10:45:00Z'), // 45 min — late for emergency_ready
        accepted: true,
      },
    ];

    const result = checkSLACompliance('pro-1', dispatches, 'emergency_ready', periodStart, periodEnd);
    expect(result.late_responses).toBe(1);
    expect(result.on_time_responses).toBe(0);
    expect(result.compliant).toBe(false);
  });

  test('empty dispatch list yields compliant (no violations)', () => {
    const result = checkSLACompliance('pro-1', [], 'standard', periodStart, periodEnd);
    expect(result.compliant).toBe(true);
    expect(result.compliance_rate).toBe(100);
  });
});

// =============================================================================
// 8. Pro Tier Validation
// =============================================================================

describe('validateProForTier', () => {
  test('qualified Pro passes standard tier', () => {
    const result = validateProForTier(
      {
        rating: 400,
        certs: [],
        avg_response_minutes: 30,
        accept_rate: 85,
        completed_jobs: 20,
        has_insurance: true,
        background_check_passed: true,
      },
      'standard'
    );
    expect(result.eligible).toBe(true);
    expect(result.gaps).toHaveLength(0);
  });

  test('missing certs blocks emergency_ready tier', () => {
    const result = validateProForTier(
      {
        rating: 400,
        certs: [],
        avg_response_minutes: 20,
        accept_rate: 90,
        completed_jobs: 30,
        has_insurance: true,
        background_check_passed: true,
      },
      'emergency_ready'
    );
    expect(result.eligible).toBe(false);
    expect(result.gaps).toContain('Missing required IICRC certification: WRT');
  });

  test('restoration_certified requires WRT and FSRT', () => {
    const result = validateProForTier(
      {
        rating: 450,
        certs: ['WRT'], // missing FSRT
        avg_response_minutes: 10,
        accept_rate: 95,
        completed_jobs: 100,
        has_insurance: true,
        background_check_passed: true,
      },
      'restoration_certified'
    );
    expect(result.eligible).toBe(false);
    expect(result.gaps.some((g) => g.includes('FSRT'))).toBe(true);
  });
});

// =============================================================================
// 9. Retainer Fee Calculation
// =============================================================================

describe('calculateRetainerFee', () => {
  test('Boston hub has higher fee than Manchester', () => {
    const bostonFee = calculateRetainerFee('standard', 'hub-boston');
    const manchesterFee = calculateRetainerFee('standard', 'hub-manchester');
    expect(bostonFee).toBeGreaterThan(manchesterFee);
  });

  test('higher tiers have higher fees', () => {
    const standardFee = calculateRetainerFee('standard', 'hub-manchester');
    const emergencyFee = calculateRetainerFee('emergency_ready', 'hub-manchester');
    const restorationFee = calculateRetainerFee('restoration_certified', 'hub-manchester');

    expect(emergencyFee).toBeGreaterThan(standardFee);
    expect(restorationFee).toBeGreaterThan(emergencyFee);
  });

  test('unknown hub defaults to 1.0 multiplier', () => {
    const fee = calculateRetainerFee('standard', 'hub-unknown');
    const manchesterFee = calculateRetainerFee('standard', 'hub-manchester');
    expect(fee).toBe(manchesterFee); // both use 1.0 multiplier
  });
});
