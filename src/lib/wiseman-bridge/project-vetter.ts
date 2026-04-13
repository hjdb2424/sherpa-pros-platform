// =============================================================================
// Wiseman Bridge — Project Vetter
// AI project validation pipeline using BldSync Wiseman APIs
// =============================================================================

import type { JobPosting, TradeCategory } from '@/lib/dispatch-wiseman/types';
import type {
  VettingResult,
  VettingVerdict,
  ScopeAnalysis,
  PricingValidationResult,
  PermitCheckResult,
  BidVettingResult,
  BidValidationResult,
  WisemanError,
} from './types';
import { WisemanClient } from './client';

// -----------------------------------------------------------------------------
// Category Keyword Map — used for scope analysis
// -----------------------------------------------------------------------------

const CATEGORY_KEYWORDS: Record<TradeCategory, string[]> = {
  plumbing: ['pipe', 'plumb', 'faucet', 'drain', 'toilet', 'water heater', 'sewer', 'leak', 'fixture', 'valve'],
  electrical: ['wire', 'wiring', 'electric', 'outlet', 'panel', 'breaker', 'circuit', 'light', 'switch', 'generator'],
  hvac: ['hvac', 'heating', 'cooling', 'furnace', 'air condition', 'ac unit', 'duct', 'thermostat', 'heat pump', 'ventilation'],
  carpentry: ['wood', 'carpent', 'frame', 'framing', 'trim', 'cabinet', 'shelf', 'door', 'molding', 'stair'],
  painting: ['paint', 'stain', 'primer', 'coat', 'wall finish', 'wallpaper', 'color', 'brush', 'roller'],
  roofing: ['roof', 'shingle', 'gutter', 'flashing', 'soffit', 'fascia', 'leak', 'slate', 'metal roof'],
  flooring: ['floor', 'tile', 'hardwood', 'laminate', 'vinyl', 'carpet', 'subfloor', 'grout'],
  landscaping: ['landscap', 'lawn', 'garden', 'tree', 'shrub', 'irrigation', 'patio', 'retaining wall', 'mulch', 'sod'],
  general_handyman: ['handyman', 'repair', 'fix', 'install', 'mount', 'assemble', 'general', 'maintenance'],
  masonry: ['mason', 'brick', 'stone', 'mortar', 'block', 'chimney', 'tuck point', 'veneer'],
  drywall: ['drywall', 'sheetrock', 'plaster', 'texture', 'mud', 'tape', 'joint compound', 'patch'],
  insulation: ['insulation', 'insulate', 'r-value', 'spray foam', 'batt', 'blown-in', 'vapor barrier', 'thermal'],
  siding: ['siding', 'vinyl siding', 'clapboard', 'fiber cement', 'hardie', 'exterior panel'],
  gutters: ['gutter', 'downspout', 'leaf guard', 'drainage', 'rain'],
  windows_doors: ['window', 'door', 'glass', 'pane', 'storm door', 'sliding door', 'replacement window', 'screen'],
  appliance_repair: ['appliance', 'dishwasher', 'washer', 'dryer', 'refrigerator', 'oven', 'stove', 'microwave', 'garbage disposal'],
  pest_control: ['pest', 'termite', 'rodent', 'mice', 'ant', 'roach', 'exterminator', 'insect', 'bed bug'],
  cleaning: ['clean', 'janitorial', 'pressure wash', 'power wash', 'deep clean', 'sanitize'],
  moving: ['move', 'moving', 'relocat', 'haul', 'transport', 'pack', 'storage'],
  demolition: ['demo', 'demolit', 'tear down', 'remove', 'gut', 'strip', 'abatement'],
  concrete: ['concrete', 'cement', 'pour', 'slab', 'foundation', 'sidewalk', 'driveway', 'footing'],
  fencing: ['fence', 'fencing', 'gate', 'post', 'chain link', 'privacy fence', 'picket'],
  decking: ['deck', 'decking', 'porch', 'composite', 'railing', 'pergola', 'gazebo', 'trex'],
  tile: ['tile', 'grout', 'backsplash', 'ceramic', 'porcelain', 'natural stone', 'mosaic'],
  cabinetry: ['cabinet', 'vanity', 'cupboard', 'pantry', 'built-in', 'custom cabinet'],
  countertops: ['counter', 'countertop', 'granite', 'quartz', 'marble', 'butcher block', 'laminate counter'],
  water_damage: ['water damage', 'flood', 'water restor', 'moisture', 'dry out', 'dehumidif', 'water extract'],
  fire_damage: ['fire damage', 'fire restor', 'smoke damage', 'soot', 'char', 'burn'],
  mold_remediation: ['mold', 'mildew', 'remediat', 'spore', 'mycotoxin', 'containment'],
};

// -----------------------------------------------------------------------------
// Scope Analysis — local keyword matching
// -----------------------------------------------------------------------------

function analyzeScope(description: string, category: TradeCategory): ScopeAnalysis {
  const desc = description.toLowerCase();
  const flags: string[] = [];

  // Score current category match
  const currentKeywords = CATEGORY_KEYWORDS[category] ?? [];
  const currentHits = currentKeywords.filter((kw) => desc.includes(kw)).length;
  const currentScore = currentKeywords.length > 0 ? currentHits / currentKeywords.length : 0;

  // Find best matching category
  let bestCategory: TradeCategory = category;
  let bestScore = currentScore;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [TradeCategory, string[]][]) {
    if (cat === category) continue;
    const hits = keywords.filter((kw) => desc.includes(kw)).length;
    const score = keywords.length > 0 ? hits / keywords.length : 0;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  const description_matches_category = currentScore >= 0.1 || bestCategory === category;
  const confidence = description_matches_category ? Math.min(currentScore * 3, 1.0) : bestScore;

  if (!description_matches_category) {
    flags.push(`Description better matches "${bestCategory}" than "${category}"`);
  }

  if (desc.length < 20) {
    flags.push('Description is very short — may lack sufficient detail for accurate vetting');
  }

  if (currentScore === 0 && bestScore === 0) {
    flags.push('Could not determine trade category from description');
  }

  return {
    description_matches_category,
    confidence: Math.round(confidence * 100) / 100,
    suggested_category: description_matches_category ? undefined : bestCategory,
    flags,
  };
}

// -----------------------------------------------------------------------------
// Coaching Messages
// -----------------------------------------------------------------------------

function buildBudgetCoachingMessages(
  pricing: PricingValidationResult,
  category: TradeCategory,
  location: { state: string; municipality: string }
): string[] {
  const messages: string[] = [];
  const minDollars = (pricing.suggested_range_min / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const maxDollars = (pricing.suggested_range_max / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const categoryLabel = category.replace(/_/g, ' ');
  const locationLabel = `${location.municipality}, ${location.state.toUpperCase()}`;

  if (!pricing.is_realistic && pricing.deviation_pct < 0) {
    messages.push(
      `Based on market data, a ${categoryLabel} project in ${locationLabel} typically costs ${minDollars}-${maxDollars}. ` +
      `Your budget is ${Math.abs(pricing.deviation_pct)}% below the typical range.`
    );
    messages.push(
      'Consider adjusting your budget to attract qualified professionals, or reducing the scope to fit within your budget.'
    );
  }

  if (!pricing.is_realistic && pricing.deviation_pct > 0) {
    messages.push(
      `Your budget is ${pricing.deviation_pct}% above the typical range of ${minDollars}-${maxDollars} for ${categoryLabel} in ${locationLabel}. ` +
      `You should have no trouble finding quality professionals at this price point.`
    );
  }

  if (pricing.flags.includes('material_cost_spike')) {
    messages.push('Note: Material costs in this category are currently elevated due to market conditions.');
  }

  if (pricing.flags.includes('labor_shortage')) {
    messages.push('Note: There is currently a labor shortage in this trade, which may affect availability and pricing.');
  }

  if (pricing.flags.includes('seasonal_adjustment')) {
    messages.push('Pricing may vary due to seasonal demand in your area.');
  }

  if (pricing.flags.includes('no_data_for_region')) {
    messages.push('Limited market data is available for your specific area. Estimates are based on regional averages.');
  }

  return messages;
}

function buildPermitCoachingMessages(permits: PermitCheckResult): string[] {
  const messages: string[] = [];

  if (permits.permit_required) {
    const types = permits.permit_types.join(', ');
    messages.push(`This project requires permits: ${types}. Your assigned professional can help navigate the permit process.`);

    if (permits.estimated_cost_cents > 0) {
      const costDollars = (permits.estimated_cost_cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
      messages.push(`Estimated permit fees: ${costDollars}. This is in addition to the project cost.`);
    }
  }

  return messages;
}

// -----------------------------------------------------------------------------
// Verdict Logic
// -----------------------------------------------------------------------------

function determineVerdict(
  pricing: PricingValidationResult | null,
  permits: PermitCheckResult | null,
  scope: ScopeAnalysis
): VettingVerdict {
  // Hard reject: wildly unrealistic budget (>60% below market)
  if (pricing && !pricing.is_realistic && pricing.deviation_pct < -60) {
    return 'rejected';
  }

  // Needs adjustment: budget is unrealistic but not absurd, or scope mismatch
  if (pricing && !pricing.is_realistic) {
    return 'needs_adjustment';
  }

  if (!scope.description_matches_category && scope.confidence < 0.15) {
    return 'needs_adjustment';
  }

  return 'approved';
}

// -----------------------------------------------------------------------------
// Project Vetter
// -----------------------------------------------------------------------------

export class ProjectVetter {
  constructor(private client: WisemanClient) {}

  /**
   * Vet a project before Pros see it.
   * Validates budget, checks permits, and analyzes scope.
   */
  async vetProject(job: JobPosting): Promise<VettingResult> {
    const coachingMessages: string[] = [];
    let pricing: PricingValidationResult | null = null;
    let permits: PermitCheckResult | null = null;

    // Run budget validation and permit check in parallel
    const [pricingResult, permitResult] = await Promise.allSettled([
      this.client.validateBudget({
        budget_cents: Math.round(job.budget * 100),
        scope_description: job.description,
        category: job.category,
        location: {
          state: 'NH', // Default; will be derived from job location in production
          municipality: 'Manchester',
        },
      }),
      this.client.checkPermits({
        category: job.category,
        state: 'NH',
        municipality: 'Manchester',
      }),
    ]);

    // Process pricing result
    if (pricingResult.status === 'fulfilled') {
      pricing = pricingResult.value;
      const budgetMessages = buildBudgetCoachingMessages(pricing, job.category, {
        state: 'NH',
        municipality: 'Manchester',
      });
      coachingMessages.push(...budgetMessages);
    } else {
      const err = pricingResult.reason as WisemanError;
      coachingMessages.push(
        `Budget validation unavailable (${err?.code ?? 'UNKNOWN'}). Project will be reviewed manually.`
      );
    }

    // Process permit result
    if (permitResult.status === 'fulfilled') {
      permits = permitResult.value;
      const permitMessages = buildPermitCoachingMessages(permits);
      coachingMessages.push(...permitMessages);
    } else {
      const err = permitResult.reason as WisemanError;
      coachingMessages.push(
        `Permit check unavailable (${err?.code ?? 'UNKNOWN'}). Verify permit requirements locally.`
      );
    }

    // Scope analysis is local — no API call needed
    const scopeAnalysis = analyzeScope(job.description, job.category);
    if (!scopeAnalysis.description_matches_category && scopeAnalysis.suggested_category) {
      coachingMessages.push(
        `Your project description appears to better match "${scopeAnalysis.suggested_category.replace(/_/g, ' ')}" ` +
        `rather than "${job.category.replace(/_/g, ' ')}". Consider updating the category for better Pro matches.`
      );
    }

    const verdict = determineVerdict(pricing, permits, scopeAnalysis);

    return {
      verdict,
      pricing,
      permits,
      scope_analysis: scopeAnalysis,
      coaching_messages: coachingMessages,
      vetted_at: new Date().toISOString(),
    };
  }

  /**
   * Vet a bid from a Pro against market rates.
   */
  async vetBid(
    bid: { bid_cents: number; job_id: string; category: TradeCategory },
    _job: JobPosting
  ): Promise<BidVettingResult> {
    let result: BidValidationResult;

    try {
      result = await this.client.validateBid({
        bid_cents: bid.bid_cents,
        job_id: bid.job_id,
        category: bid.category,
      });
    } catch (err) {
      const wisemanErr = err as WisemanError;
      return {
        status: 'warning',
        deviation_pct: 0,
        market_rate_cents: 0,
        explanation: `Bid validation unavailable (${wisemanErr?.code ?? 'UNKNOWN'}). Manual review recommended.`,
        flagged: false,
      };
    }

    const absDev = Math.abs(result.deviation_pct);
    const flagged = absDev > 30;
    let explanation: string;

    const marketDollars = (result.market_rate_cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

    if (absDev <= 15) {
      explanation = `Bid is within normal market range. Market rate: ${marketDollars}.`;
    } else if (absDev <= 30) {
      const direction = result.deviation_pct > 0 ? 'above' : 'below';
      explanation = `Bid is ${absDev}% ${direction} market rate (${marketDollars}). Within acceptable range but worth noting.`;
    } else {
      const direction = result.deviation_pct > 0 ? 'above' : 'below';
      explanation = `Bid is ${absDev}% ${direction} market rate (${marketDollars}). This is a significant deviation and may warrant review.`;
    }

    return {
      status: result.status,
      deviation_pct: result.deviation_pct,
      market_rate_cents: result.market_rate_cents,
      explanation,
      flagged,
    };
  }
}
