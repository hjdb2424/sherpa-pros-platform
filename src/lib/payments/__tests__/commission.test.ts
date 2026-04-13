/**
 * Sherpa Pros Platform — Commission Calculation Tests
 *
 * All values in INTEGER CENTS. No floating-point currency math.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCommission,
  calculateServiceFee,
  calculateEmergencyPremium,
  calculateInsuranceCommission,
  calculateInstantPayoutFee,
  calculatePayout,
  calculatePlatformRevenue,
} from '../commission';

// ---------------------------------------------------------------------------
// Commission Tiers
// ---------------------------------------------------------------------------

describe('calculateCommission', () => {
  // Tier 1: < $500 (< 50,000¢) → 15%
  it('charges 15% for $0 job', () => {
    expect(calculateCommission(0)).toBe(0);
  });

  it('charges 15% for $100 job (10,000¢)', () => {
    expect(calculateCommission(10_000)).toBe(1_500); // $15.00
  });

  it('charges 15% at $499.99 (49,999¢) — top of Tier 1', () => {
    expect(calculateCommission(49_999)).toBe(Math.round(49_999 * 0.15)); // 7500
  });

  // Tier 2: $500–$5K (50,000¢–499,999¢) → 12%
  it('charges 12% at $500.00 (50,000¢) — bottom of Tier 2', () => {
    expect(calculateCommission(50_000)).toBe(6_000); // $60.00
  });

  it('charges 12% at $2,500 (250,000¢)', () => {
    expect(calculateCommission(250_000)).toBe(30_000); // $300.00
  });

  it('charges 12% at $4,999.99 (499,999¢) — top of Tier 2', () => {
    expect(calculateCommission(499_999)).toBe(Math.round(499_999 * 0.12)); // 60000
  });

  // Tier 3: $5K–$25K (500,000¢–2,499,999¢) → 10%
  it('charges 10% at $5,000.00 (500,000¢) — bottom of Tier 3', () => {
    expect(calculateCommission(500_000)).toBe(50_000); // $500.00
  });

  it('charges 10% at $15,000 (1,500,000¢)', () => {
    expect(calculateCommission(1_500_000)).toBe(150_000); // $1,500.00
  });

  it('charges 10% at $24,999.99 (2,499,999¢) — top of Tier 3', () => {
    expect(calculateCommission(2_499_999)).toBe(Math.round(2_499_999 * 0.10)); // 250000
  });

  // Tier 4: $25K+ (2,500,000¢+) → 8%
  it('charges 8% at $25,000.00 (2,500,000¢) — bottom of Tier 4', () => {
    expect(calculateCommission(2_500_000)).toBe(200_000); // $2,000.00
  });

  it('charges 8% at $100,000 (10,000,000¢)', () => {
    expect(calculateCommission(10_000_000)).toBe(800_000); // $8,000.00
  });

  it('throws for negative amounts', () => {
    expect(() => calculateCommission(-100)).toThrow('non-negative');
  });
});

// ---------------------------------------------------------------------------
// Service Fee
// ---------------------------------------------------------------------------

describe('calculateServiceFee', () => {
  it('charges 5% on $100 (10,000¢)', () => {
    expect(calculateServiceFee(10_000)).toBe(500); // $5.00
  });

  it('charges 5% on $1,000 (100,000¢)', () => {
    expect(calculateServiceFee(100_000)).toBe(5_000); // $50.00
  });

  it('returns 0 for $0', () => {
    expect(calculateServiceFee(0)).toBe(0);
  });

  it('throws for negative amounts', () => {
    expect(() => calculateServiceFee(-1)).toThrow('non-negative');
  });
});

// ---------------------------------------------------------------------------
// Emergency Premium
// ---------------------------------------------------------------------------

describe('calculateEmergencyPremium', () => {
  it('calculates 20% of 50% surge on $200 base', () => {
    // base = 20,000¢, multiplier = 1.5
    // surge markup = 20,000 * 0.5 = 10,000¢
    // platform share = 10,000 * 0.20 = 2,000¢ ($20)
    expect(calculateEmergencyPremium(20_000, 1.5)).toBe(2_000);
  });

  it('calculates 20% of 100% surge on $500 base', () => {
    // surge = 50,000¢, platform = 10,000¢ ($100)
    expect(calculateEmergencyPremium(50_000, 2.0)).toBe(10_000);
  });

  it('returns 0 when multiplier is exactly 1 (no surge)', () => {
    expect(calculateEmergencyPremium(50_000, 1)).toBe(0);
  });

  it('throws for multiplier < 1', () => {
    expect(() => calculateEmergencyPremium(10_000, 0.8)).toThrow('multiplier must be >= 1');
  });

  it('throws for negative base', () => {
    expect(() => calculateEmergencyPremium(-1, 1.5)).toThrow('non-negative');
  });
});

// ---------------------------------------------------------------------------
// Insurance Commission
// ---------------------------------------------------------------------------

describe('calculateInsuranceCommission', () => {
  it('calculates 7% (default) on $1,000 premium', () => {
    expect(calculateInsuranceCommission(100_000)).toBe(7_000); // $70
  });

  it('calculates 6% on $1,000 premium', () => {
    expect(calculateInsuranceCommission(100_000, 0.06)).toBe(6_000); // $60
  });

  it('calculates 8% on $1,000 premium', () => {
    expect(calculateInsuranceCommission(100_000, 0.08)).toBe(8_000); // $80
  });

  it('returns 0 for $0 premium', () => {
    expect(calculateInsuranceCommission(0)).toBe(0);
  });

  it('throws for rate below 6%', () => {
    expect(() => calculateInsuranceCommission(100_000, 0.05)).toThrow('between 0.06 and 0.08');
  });

  it('throws for rate above 8%', () => {
    expect(() => calculateInsuranceCommission(100_000, 0.09)).toThrow('between 0.06 and 0.08');
  });
});

// ---------------------------------------------------------------------------
// Instant Payout Fee
// ---------------------------------------------------------------------------

describe('calculateInstantPayoutFee', () => {
  it('charges 1% on $1,000 payout', () => {
    expect(calculateInstantPayoutFee(100_000)).toBe(1_000); // $10
  });

  it('returns 0 for $0', () => {
    expect(calculateInstantPayoutFee(0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Full Payout Calculation
// ---------------------------------------------------------------------------

describe('calculatePayout', () => {
  it('calculates standard payout for a $300 job (Tier 1)', () => {
    const result = calculatePayout(30_000, 'standard');
    // commission = 30,000 * 0.15 = 4,500
    expect(result.grossAmountCents).toBe(30_000);
    expect(result.commissionCents).toBe(4_500);
    expect(result.emergencyPremiumCents).toBe(0);
    expect(result.insuranceCommissionCents).toBe(0);
    expect(result.instantPayoutFeeCents).toBe(0);
    expect(result.netPayoutCents).toBe(25_500); // $255
  });

  it('deducts instant payout fee when requested', () => {
    const result = calculatePayout(30_000, 'standard', { isInstantPayout: true });
    // after commission: 25,500
    // instant fee: 25,500 * 0.01 = 255
    // net: 25,500 - 255 = 25,245
    expect(result.instantPayoutFeeCents).toBe(255);
    expect(result.netPayoutCents).toBe(25_245);
  });

  it('calculates emergency payout with surge deduction', () => {
    // $300 job with 1.5x surge → total = $300 (amount already includes surge)
    // base = 300 / 1.5 = $200
    // emergency premium = $200 * 0.5 * 0.20 = $20
    const result = calculatePayout(30_000, 'emergency', {
      emergencyMultiplier: 1.5,
    });
    const baseCents = Math.round(30_000 / 1.5); // 20_000
    const surgeMarkup = Math.round(baseCents * 0.5); // 10_000
    const expectedPremium = Math.round(surgeMarkup * 0.20); // 2_000
    const commission = Math.round(30_000 * 0.15); // 4_500

    expect(result.commissionCents).toBe(commission);
    expect(result.emergencyPremiumCents).toBe(expectedPremium);
    expect(result.netPayoutCents).toBe(30_000 - commission - expectedPremium);
  });

  it('calculates insurance payout with insurance commission', () => {
    const result = calculatePayout(100_000, 'insurance', {
      insurancePremiumCents: 50_000,
      insuranceRate: 0.07,
    });
    // commission = 100,000 * 0.12 = 12,000 (Tier 2)
    // insurance = 50,000 * 0.07 = 3,500
    expect(result.commissionCents).toBe(12_000);
    expect(result.insuranceCommissionCents).toBe(3_500);
    expect(result.netPayoutCents).toBe(100_000 - 12_000 - 3_500);
  });

  it('throws for negative amount', () => {
    expect(() => calculatePayout(-1)).toThrow('non-negative');
  });
});

// ---------------------------------------------------------------------------
// Platform Revenue
// ---------------------------------------------------------------------------

describe('calculatePlatformRevenue', () => {
  it('calculates revenue for a $1,000 standard job', () => {
    const result = calculatePlatformRevenue(100_000, 'standard');
    // commission = 100,000 * 0.12 = 12,000 (Tier 2)
    // service fee = 100,000 * 0.05 = 5,000
    // total = 17,000
    expect(result.commissionCents).toBe(12_000);
    expect(result.serviceFeeCents).toBe(5_000);
    expect(result.emergencyPremiumCents).toBe(0);
    expect(result.totalRevenueCents).toBe(17_000);
  });

  it('includes emergency premium in platform revenue', () => {
    const result = calculatePlatformRevenue(30_000, 'emergency', {
      emergencyMultiplier: 1.5,
    });
    const baseCents = Math.round(30_000 / 1.5);
    const surgeMarkup = Math.round(baseCents * 0.5);
    const expectedPremium = Math.round(surgeMarkup * 0.20);

    expect(result.emergencyPremiumCents).toBe(expectedPremium);
    expect(result.totalRevenueCents).toBe(
      result.commissionCents + result.serviceFeeCents + result.emergencyPremiumCents,
    );
  });

  it('returns all zeros for $0 job', () => {
    const result = calculatePlatformRevenue(0);
    expect(result.totalRevenueCents).toBe(0);
  });

  it('throws for negative amount', () => {
    expect(() => calculatePlatformRevenue(-1)).toThrow('non-negative');
  });
});
