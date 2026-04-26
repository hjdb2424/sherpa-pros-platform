// =============================================================================
// Project Vetter — Tests
// =============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectVetter } from '../project-vetter';
import { WisemanClient } from '../client';
import type { JobPosting } from '@/lib/dispatch-wiseman/types';
import type {
  PricingValidationResult,
  PermitCheckResult,
  BidValidationResult,
} from '../types';

// -----------------------------------------------------------------------------
// Mock Setup
// -----------------------------------------------------------------------------

vi.mock('../client', () => ({
  WisemanClient: class {
    validateBudget = vi.fn();
    validateBid = vi.fn();
    checkPermits = vi.fn();
    generateChecklist = vi.fn();
    healthCheck = vi.fn();
  },
}));

function createMockClient() {
  return new WisemanClient() as unknown as {
    validateBudget: ReturnType<typeof vi.fn>;
    validateBid: ReturnType<typeof vi.fn>;
    checkPermits: ReturnType<typeof vi.fn>;
    generateChecklist: ReturnType<typeof vi.fn>;
    healthCheck: ReturnType<typeof vi.fn>;
  };
}

function createTestJob(overrides: Partial<JobPosting> = {}): JobPosting {
  return {
    id: 'job-001',
    title: 'Bathroom Remodel',
    category: 'plumbing',
    urgency: 'standard',
    budget: 20000,
    location: { lat: 42.99, lng: -71.46 },
    hub_id: 'hub-nh-01',
    threshold_type: 'dispatch',
    description: 'Full bathroom remodel including new plumbing fixtures, toilet replacement, and faucet installation.',
    permit_required: false,
    scope: {
      estimated_hours: 40,
      interior: true,
      exterior: false,
      requirements: ['Licensed plumber required'],
    },
    client_id: 'client-001',
    posted_at: '2026-04-12T10:00:00Z',
    ...overrides,
  };
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('ProjectVetter', () => {
  let mockClient: ReturnType<typeof createMockClient>;
  let vetter: ProjectVetter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = createMockClient();
    vetter = new ProjectVetter(mockClient as unknown as WisemanClient);
  });

  // -------------------------------------------------------------------------
  // Budget Validation
  // -------------------------------------------------------------------------

  describe('vetProject — budget validation', () => {
    it('should approve a project with a realistic budget', async () => {
      const pricingResult: PricingValidationResult = {
        is_realistic: true,
        suggested_range_min: 1500000,
        suggested_range_max: 2500000,
        deviation_pct: 5,
        flags: [],
      };

      const permitResult: PermitCheckResult = {
        permit_required: false,
        permit_types: [],
        code_sections: [],
        estimated_cost_cents: 0,
      };

      mockClient.validateBudget.mockResolvedValue(pricingResult);
      mockClient.checkPermits.mockResolvedValue(permitResult);

      const result = await vetter.vetProject(createTestJob());

      expect(result.verdict).toBe('approved');
      expect(result.pricing).toEqual(pricingResult);
      expect(result.coaching_messages.length).toBe(0);
    });

    it('should flag an unrealistic low budget with coaching message', async () => {
      const pricingResult: PricingValidationResult = {
        is_realistic: false,
        suggested_range_min: 1800000,
        suggested_range_max: 2400000,
        deviation_pct: -45,
        flags: ['below_market'],
      };

      const permitResult: PermitCheckResult = {
        permit_required: false,
        permit_types: [],
        code_sections: [],
        estimated_cost_cents: 0,
      };

      mockClient.validateBudget.mockResolvedValue(pricingResult);
      mockClient.checkPermits.mockResolvedValue(permitResult);

      const job = createTestJob({ budget: 5000 });
      const result = await vetter.vetProject(job);

      expect(result.verdict).toBe('needs_adjustment');
      expect(result.coaching_messages.length).toBeGreaterThan(0);
      expect(result.coaching_messages[0]).toContain('below the typical range');
      expect(result.coaching_messages[0]).toContain('45%');
    });

    it('should reject a wildly unrealistic budget (>60% below market)', async () => {
      const pricingResult: PricingValidationResult = {
        is_realistic: false,
        suggested_range_min: 1800000,
        suggested_range_max: 2400000,
        deviation_pct: -75,
        flags: ['below_market'],
      };

      const permitResult: PermitCheckResult = {
        permit_required: false,
        permit_types: [],
        code_sections: [],
        estimated_cost_cents: 0,
      };

      mockClient.validateBudget.mockResolvedValue(pricingResult);
      mockClient.checkPermits.mockResolvedValue(permitResult);

      const job = createTestJob({ budget: 2000 });
      const result = await vetter.vetProject(job);

      expect(result.verdict).toBe('rejected');
    });

    it('should handle budget above market with appropriate message', async () => {
      const pricingResult: PricingValidationResult = {
        is_realistic: false,
        suggested_range_min: 1500000,
        suggested_range_max: 2500000,
        deviation_pct: 40,
        flags: ['above_market'],
      };

      const permitResult: PermitCheckResult = {
        permit_required: false,
        permit_types: [],
        code_sections: [],
        estimated_cost_cents: 0,
      };

      mockClient.validateBudget.mockResolvedValue(pricingResult);
      mockClient.checkPermits.mockResolvedValue(permitResult);

      const job = createTestJob({ budget: 40000 });
      const result = await vetter.vetProject(job);

      expect(result.verdict).toBe('needs_adjustment');
      expect(result.coaching_messages[0]).toContain('above the typical range');
      expect(result.coaching_messages[0]).toContain('no trouble finding quality professionals');
    });

    it('should include material cost spike and labor shortage flags in coaching', async () => {
      const pricingResult: PricingValidationResult = {
        is_realistic: true,
        suggested_range_min: 1800000,
        suggested_range_max: 2400000,
        deviation_pct: 10,
        flags: ['material_cost_spike', 'labor_shortage'],
      };

      const permitResult: PermitCheckResult = {
        permit_required: false,
        permit_types: [],
        code_sections: [],
        estimated_cost_cents: 0,
      };

      mockClient.validateBudget.mockResolvedValue(pricingResult);
      mockClient.checkPermits.mockResolvedValue(permitResult);

      const result = await vetter.vetProject(createTestJob());

      expect(result.verdict).toBe('approved');
      const msgs = result.coaching_messages.join(' ');
      expect(msgs).toContain('Material costs');
      expect(msgs).toContain('labor shortage');
    });
  });

  // -------------------------------------------------------------------------
  // Permit Check
  // -------------------------------------------------------------------------

  describe('vetProject — permit detection', () => {
    it('should detect permit requirements and include in coaching', async () => {
      const pricingResult: PricingValidationResult = {
        is_realistic: true,
        suggested_range_min: 1500000,
        suggested_range_max: 2500000,
        deviation_pct: 0,
        flags: [],
      };

      const permitResult: PermitCheckResult = {
        permit_required: true,
        permit_types: ['Building Permit', 'Plumbing Permit'],
        code_sections: ['IRC P2503', 'IRC P2719'],
        estimated_cost_cents: 35000,
      };

      mockClient.validateBudget.mockResolvedValue(pricingResult);
      mockClient.checkPermits.mockResolvedValue(permitResult);

      const result = await vetter.vetProject(createTestJob());

      expect(result.verdict).toBe('approved');
      expect(result.permits?.permit_required).toBe(true);
      const msgs = result.coaching_messages.join(' ');
      expect(msgs).toContain('Building Permit');
      expect(msgs).toContain('Plumbing Permit');
      expect(msgs).toContain('$350');
    });
  });

  // -------------------------------------------------------------------------
  // Scope Analysis
  // -------------------------------------------------------------------------

  describe('vetProject — scope analysis', () => {
    it('should detect scope mismatch when description does not match category', async () => {
      const pricingResult: PricingValidationResult = {
        is_realistic: true,
        suggested_range_min: 1500000,
        suggested_range_max: 2500000,
        deviation_pct: 0,
        flags: [],
      };

      const permitResult: PermitCheckResult = {
        permit_required: false,
        permit_types: [],
        code_sections: [],
        estimated_cost_cents: 0,
      };

      mockClient.validateBudget.mockResolvedValue(pricingResult);
      mockClient.checkPermits.mockResolvedValue(permitResult);

      // Description is about painting, but category is plumbing
      const job = createTestJob({
        description: 'Need to paint the entire interior of the house, two coats of primer and paint on all walls.',
        category: 'plumbing',
      });

      const result = await vetter.vetProject(job);

      expect(result.scope_analysis.description_matches_category).toBe(false);
      expect(result.scope_analysis.suggested_category).toBe('painting');
      expect(result.coaching_messages.some((m) => m.includes('painting'))).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // API Failure Resilience
  // -------------------------------------------------------------------------

  describe('vetProject — API failure resilience', () => {
    it('should handle pricing API failure gracefully', async () => {
      mockClient.validateBudget.mockRejectedValue({
        code: 'TIMEOUT',
        message: 'Request timed out',
        status_code: null,
        retryable: true,
      });
      mockClient.checkPermits.mockResolvedValue({
        permit_required: false,
        permit_types: [],
        code_sections: [],
        estimated_cost_cents: 0,
      });

      const result = await vetter.vetProject(createTestJob());

      expect(result.verdict).toBe('approved');
      expect(result.pricing).toBeNull();
      expect(result.coaching_messages.some((m) => m.includes('Budget validation unavailable'))).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Bid Validation
  // -------------------------------------------------------------------------

  describe('vetBid', () => {
    it('should approve a bid within 15% of market rate', async () => {
      const bidResult: BidValidationResult = {
        deviation_pct: 8,
        status: 'acceptable',
        market_rate_cents: 2000000,
      };

      mockClient.validateBid.mockResolvedValue(bidResult);

      const result = await vetter.vetBid(
        { bid_cents: 2160000, job_id: 'job-001', category: 'plumbing' },
        createTestJob()
      );

      expect(result.status).toBe('acceptable');
      expect(result.flagged).toBe(false);
      expect(result.explanation).toContain('within normal market range');
    });

    it('should warn on a bid 15-30% above market rate', async () => {
      const bidResult: BidValidationResult = {
        deviation_pct: 22,
        status: 'warning',
        market_rate_cents: 2000000,
      };

      mockClient.validateBid.mockResolvedValue(bidResult);

      const result = await vetter.vetBid(
        { bid_cents: 2440000, job_id: 'job-001', category: 'plumbing' },
        createTestJob()
      );

      expect(result.status).toBe('warning');
      expect(result.flagged).toBe(false);
      expect(result.explanation).toContain('22%');
      expect(result.explanation).toContain('above');
    });

    it('should flag a bid >30% above market rate as suspicious', async () => {
      const bidResult: BidValidationResult = {
        deviation_pct: 45,
        status: 'suspicious',
        market_rate_cents: 2000000,
      };

      mockClient.validateBid.mockResolvedValue(bidResult);

      const result = await vetter.vetBid(
        { bid_cents: 2900000, job_id: 'job-001', category: 'plumbing' },
        createTestJob()
      );

      expect(result.status).toBe('suspicious');
      expect(result.flagged).toBe(true);
      expect(result.explanation).toContain('significant deviation');
    });

    it('should flag a bid >30% below market rate', async () => {
      const bidResult: BidValidationResult = {
        deviation_pct: -35,
        status: 'suspicious',
        market_rate_cents: 2000000,
      };

      mockClient.validateBid.mockResolvedValue(bidResult);

      const result = await vetter.vetBid(
        { bid_cents: 1300000, job_id: 'job-001', category: 'plumbing' },
        createTestJob()
      );

      expect(result.status).toBe('suspicious');
      expect(result.flagged).toBe(true);
      expect(result.explanation).toContain('below');
    });

    it('should handle bid validation API failure gracefully', async () => {
      mockClient.validateBid.mockRejectedValue({
        code: 'SERVER_ERROR',
        message: 'Internal server error',
        status_code: 500,
        retryable: true,
      });

      const result = await vetter.vetBid(
        { bid_cents: 2000000, job_id: 'job-001', category: 'plumbing' },
        createTestJob()
      );

      expect(result.status).toBe('warning');
      expect(result.explanation).toContain('unavailable');
      expect(result.flagged).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // Composite Vetting
  // -------------------------------------------------------------------------

  describe('vetProject — composite result', () => {
    it('should return a complete vetting result with all fields', async () => {
      mockClient.validateBudget.mockResolvedValue({
        is_realistic: true,
        suggested_range_min: 1500000,
        suggested_range_max: 2500000,
        deviation_pct: 5,
        flags: [],
      });

      mockClient.checkPermits.mockResolvedValue({
        permit_required: true,
        permit_types: ['Building Permit'],
        code_sections: ['IRC R105'],
        estimated_cost_cents: 15000,
      });

      const result = await vetter.vetProject(createTestJob());

      expect(result).toHaveProperty('verdict');
      expect(result).toHaveProperty('pricing');
      expect(result).toHaveProperty('permits');
      expect(result).toHaveProperty('scope_analysis');
      expect(result).toHaveProperty('coaching_messages');
      expect(result).toHaveProperty('vetted_at');
      expect(typeof result.vetted_at).toBe('string');
      expect(result.scope_analysis).toHaveProperty('description_matches_category');
      expect(result.scope_analysis).toHaveProperty('confidence');
    });
  });
});
