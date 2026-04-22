// ---------------------------------------------------------------------------
// Wiseman Validator Service
// Validates sub-service data against Wiseman sources for confidence scoring
// ---------------------------------------------------------------------------

import {
  getSubService,
  getCategoryConfidence,
  getCategoryWisemanSource,
  ALL_SUB_SERVICES,
} from '@/lib/config/service-catalog';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WisemanValidation {
  subServiceId: string;
  subServiceName: string;
  confidence: number;
  sources: string[];
  budgetValidated: boolean;
  scopeValidated: boolean;
  codeCompliant: boolean;
  lastValidated: string;
  warnings: string[];
  permitRequired: boolean;
  inspectionRequired: boolean;
  licensedTradeRequired: boolean;
}

export interface QuoteValidation {
  overallConfidence: number;
  itemValidations: WisemanValidation[];
  warnings: string[];
  summary: string;
}

export interface MarketRate {
  min: number;
  max: number;
  confidence: number;
  source: string;
  lastUpdated: string;
}

// ---------------------------------------------------------------------------
// Validation Functions
// ---------------------------------------------------------------------------

/**
 * Validates a sub-service against Wiseman data sources.
 * Returns pre-computed validation based on the catalog data.
 */
export function validateSubService(subServiceId: string): WisemanValidation {
  const sub = getSubService(subServiceId);

  if (!sub) {
    return {
      subServiceId,
      subServiceName: 'Unknown',
      confidence: 0,
      sources: [],
      budgetValidated: false,
      scopeValidated: false,
      codeCompliant: false,
      lastValidated: new Date().toISOString(),
      warnings: [`Sub-service '${subServiceId}' not found in catalog`],
      permitRequired: false,
      inspectionRequired: false,
      licensedTradeRequired: false,
    };
  }

  const warnings: string[] = [];

  // Generate warnings based on confidence
  if (sub.wisemanConfidence < 95) {
    warnings.push(
      `Confidence below target (${sub.wisemanConfidence}% vs 95% target). Manual review recommended.`,
    );
  }
  if (sub.permitRequired) {
    warnings.push('Building permit required. Ensure permit is pulled before work begins.');
  }
  if (sub.licensedTradeRequired) {
    warnings.push(
      'Licensed trade required. Verify pro has valid NH license before dispatch.',
    );
  }
  if (sub.inspectionRequired) {
    warnings.push('Inspection required. Schedule with local building department.');
  }

  return {
    subServiceId: sub.id,
    subServiceName: sub.name,
    confidence: sub.wisemanConfidence,
    sources: sub.wisemanSource.split(' + ').map((s) => s.trim()),
    budgetValidated: sub.wisemanConfidence >= 93,
    scopeValidated: sub.wisemanConfidence >= 93,
    codeCompliant:
      (sub.codeReferences?.length ?? 0) > 0 && sub.wisemanConfidence >= 95,
    lastValidated: '2026-04-15T00:00:00.000Z',
    warnings,
    permitRequired: sub.permitRequired ?? false,
    inspectionRequired: sub.inspectionRequired ?? false,
    licensedTradeRequired: sub.licensedTradeRequired ?? false,
  };
}

/**
 * Validates an entire quote's line items against Wiseman data.
 * Used by the quote builder to show confidence scores.
 */
export function validateQuote(
  quoteLineItems: Array<{ subServiceId?: string; description: string; category: string }>,
): QuoteValidation {
  const itemValidations: WisemanValidation[] = [];
  const warnings: string[] = [];

  for (const item of quoteLineItems) {
    if (item.subServiceId) {
      const validation = validateSubService(item.subServiceId);
      itemValidations.push(validation);
    } else {
      // Try to find a matching sub-service by description keywords
      const desc = item.description.toLowerCase();
      const match = ALL_SUB_SERVICES.find(
        (s) =>
          desc.includes(s.name.toLowerCase()) ||
          s.name.toLowerCase().includes(desc.slice(0, 20)),
      );

      if (match) {
        itemValidations.push(validateSubService(match.id));
      } else {
        // No match found - return low confidence
        itemValidations.push({
          subServiceId: 'unknown',
          subServiceName: item.description,
          confidence: 70,
          sources: [],
          budgetValidated: false,
          scopeValidated: false,
          codeCompliant: false,
          lastValidated: new Date().toISOString(),
          warnings: [
            'No matching catalog entry found. Manual validation recommended.',
          ],
          permitRequired: false,
          inspectionRequired: false,
          licensedTradeRequired: false,
        });
        warnings.push(
          `Line item "${item.description}" could not be matched to catalog. Low confidence.`,
        );
      }
    }
  }

  // Calculate overall confidence
  const totalConfidence =
    itemValidations.length > 0
      ? Math.round(
          itemValidations.reduce((sum, v) => sum + v.confidence, 0) /
            itemValidations.length,
        )
      : 0;

  // Add overall warnings
  if (totalConfidence < 90) {
    warnings.push(
      'Overall quote confidence is below 90%. Manual review strongly recommended.',
    );
  }

  const highConfCount = itemValidations.filter(
    (v) => v.confidence >= 95,
  ).length;
  const summary =
    totalConfidence >= 95
      ? `Quote validated with ${totalConfidence}% confidence. ${highConfCount}/${itemValidations.length} items fully verified.`
      : totalConfidence >= 90
        ? `Quote confidence at ${totalConfidence}%. Some items need review. ${highConfCount}/${itemValidations.length} items fully verified.`
        : `Quote confidence at ${totalConfidence}%. Manual review required for accuracy.`;

  return {
    overallConfidence: totalConfidence,
    itemValidations,
    warnings,
    summary,
  };
}

/**
 * Returns market rate for a sub-service in a specific area.
 * Mock: returns the catalog budget range with confidence score.
 */
export function getMarketRate(
  subServiceId: string,
  _zipCode: string = '03801',
): MarketRate {
  const sub = getSubService(subServiceId);

  if (!sub) {
    return {
      min: 0,
      max: 0,
      confidence: 0,
      source: 'No data available',
      lastUpdated: new Date().toISOString(),
    };
  }

  return {
    min: sub.budgetRange.min,
    max: sub.budgetRange.max,
    confidence: Math.min(sub.wisemanConfidence, 96),
    source: `Pricing Wiseman v1.3 — 2026 RS Means + local market data for Portsmouth-Dover-Rochester MSA`,
    lastUpdated: '2026-04-15T00:00:00.000Z',
  };
}

/**
 * Get confidence level label and color class for a given confidence score.
 */
export function getConfidenceLevel(confidence: number): {
  label: string;
  colorClass: string;
  bgClass: string;
} {
  if (confidence >= 95) {
    return {
      label: `${confidence}% Verified`,
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    };
  }
  if (confidence >= 90) {
    return {
      label: `${confidence}% — Review Recommended`,
      colorClass: 'text-amber-700 dark:text-amber-400',
      bgClass: 'bg-amber-100 dark:bg-amber-900/30',
    };
  }
  return {
    label: 'Low Confidence — Manual Review Required',
    colorClass: 'text-red-700 dark:text-red-400',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
  };
}

/**
 * Get a formatted source summary for display.
 */
export function formatWisemanSources(sources: string[]): string {
  if (sources.length === 0) return 'Unvalidated';
  const names = sources.map((s) => s.replace(/\s*v[\d.]+/, ''));
  const unique = [...new Set(names)];
  return unique.join(' + ');
}

/**
 * Get category-level validation summary.
 */
export function getCategoryValidation(categoryId: string): {
  confidence: number;
  source: string;
  subServiceCount: number;
} {
  return {
    confidence: getCategoryConfidence(categoryId),
    source: getCategoryWisemanSource(categoryId),
    subServiceCount:
      ALL_SUB_SERVICES.filter((s) => s.categoryId === categoryId).length,
  };
}
