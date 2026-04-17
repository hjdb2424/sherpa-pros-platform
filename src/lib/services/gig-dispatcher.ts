// ---------------------------------------------------------------------------
// Gig Dispatcher — Smart routing between Uber Connect and DoorDash Drive
// Main entry point for all gig delivery operations.
// ---------------------------------------------------------------------------

import {
  isUberConfigured,
  requestUberDelivery,
  getUberDeliveryStatus,
  cancelUberDelivery,
} from './uber-connect';
import type { GigDeliveryRequest, GigDeliveryResult } from './uber-connect';
import {
  isDoorDashConfigured,
  requestDoorDashDelivery,
  getDoorDashDeliveryStatus,
  cancelDoorDashDelivery,
} from './doordash-drive';

export type { GigDeliveryRequest, GigDeliveryResult };

export interface DispatchDecision {
  provider: 'uber' | 'doordash';
  reason: string;
  estimate: GigDeliveryResult;
  alternative?: GigDeliveryResult;
}

// ---------------------------------------------------------------------------
// Scoring — 60% cost, 40% ETA
// ---------------------------------------------------------------------------

function scoreEstimate(result: GigDeliveryResult): number {
  const costScore = 1 / (result.estimatedCostCents || 1); // lower cost = higher score
  const etaMs =
    new Date(result.estimatedDeliveryTime).getTime() - Date.now();
  const etaScore = 1 / (etaMs || 1); // faster = higher score
  return 0.6 * costScore + 0.4 * etaScore;
}

function buildReason(
  winner: GigDeliveryResult,
  loser?: GigDeliveryResult,
): string {
  if (!loser) {
    return `${winner.provider === 'uber' ? 'Uber' : 'DoorDash'} selected — only configured provider`;
  }

  const costDiff = Math.abs(
    winner.estimatedCostCents - loser.estimatedCostCents,
  );
  const costDiffDollars = (costDiff / 100).toFixed(2);

  const winnerEta = new Date(winner.estimatedDeliveryTime).getTime();
  const loserEta = new Date(loser.estimatedDeliveryTime).getTime();
  const etaDiffMin = Math.round(Math.abs(winnerEta - loserEta) / 60_000);

  const providerName = winner.provider === 'uber' ? 'Uber' : 'DoorDash';

  const parts: string[] = [`${providerName} selected`];
  if (costDiff > 0) parts.push(`$${costDiffDollars} cheaper`);
  if (etaDiffMin > 0) parts.push(`${etaDiffMin} min faster`);
  if (parts.length === 1) parts.push('comparable pricing and ETA');

  return parts.join(' — ');
}

// ---------------------------------------------------------------------------
// Mock alternation state (when neither provider is configured)
// ---------------------------------------------------------------------------

let mockToggle = false;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get quotes from both providers and return the best option with reasoning.
 */
export async function getBestGigDelivery(
  request: GigDeliveryRequest,
): Promise<DispatchDecision> {
  const uberReady = isUberConfigured();
  const ddReady = isDoorDashConfigured();

  // Neither configured — mock mode, alternate providers
  if (!uberReady && !ddReady) {
    mockToggle = !mockToggle;
    if (mockToggle) {
      const estimate = await requestUberDelivery(request);
      const alt = await requestDoorDashDelivery(request);
      return {
        provider: 'uber',
        reason: 'Uber selected — mock mode (no API keys configured)',
        estimate,
        alternative: alt,
      };
    } else {
      const estimate = await requestDoorDashDelivery(request);
      const alt = await requestUberDelivery(request);
      return {
        provider: 'doordash',
        reason: 'DoorDash selected — mock mode (no API keys configured)',
        estimate,
        alternative: alt,
      };
    }
  }

  // Only one provider configured
  if (uberReady && !ddReady) {
    const estimate = await requestUberDelivery(request);
    return {
      provider: 'uber',
      reason: buildReason(estimate),
      estimate,
    };
  }

  if (!uberReady && ddReady) {
    const estimate = await requestDoorDashDelivery(request);
    return {
      provider: 'doordash',
      reason: buildReason(estimate),
      estimate,
    };
  }

  // Both configured — race for quotes, pick best
  const [uberResult, ddResult] = await Promise.allSettled([
    requestUberDelivery(request),
    requestDoorDashDelivery(request),
  ]);

  const uberOk =
    uberResult.status === 'fulfilled' ? uberResult.value : null;
  const ddOk =
    ddResult.status === 'fulfilled' ? ddResult.value : null;

  // Fallback if one fails
  if (uberOk && !ddOk) {
    return {
      provider: 'uber',
      reason: 'Uber selected — DoorDash unavailable',
      estimate: uberOk,
    };
  }

  if (!uberOk && ddOk) {
    return {
      provider: 'doordash',
      reason: 'DoorDash selected — Uber unavailable',
      estimate: ddOk,
    };
  }

  if (!uberOk && !ddOk) {
    throw new Error('Both delivery providers failed');
  }

  // Compare scores
  const uberScore = scoreEstimate(uberOk!);
  const ddScore = scoreEstimate(ddOk!);

  if (uberScore >= ddScore) {
    return {
      provider: 'uber',
      reason: buildReason(uberOk!, ddOk!),
      estimate: uberOk!,
      alternative: ddOk!,
    };
  }

  return {
    provider: 'doordash',
    reason: buildReason(ddOk!, uberOk!),
    estimate: ddOk!,
    alternative: uberOk!,
  };
}

/**
 * Dispatch a delivery with optional provider preference.
 * Falls back to the other provider on failure.
 */
export async function dispatchGigDelivery(
  request: GigDeliveryRequest,
  preferredProvider?: 'uber' | 'doordash',
): Promise<GigDeliveryResult> {
  // If no preference, use smart routing
  if (!preferredProvider) {
    const decision = await getBestGigDelivery(request);
    return decision.estimate;
  }

  // Try preferred provider first
  try {
    if (preferredProvider === 'uber') {
      return await requestUberDelivery(request);
    }
    return await requestDoorDashDelivery(request);
  } catch {
    // Fallback to the other provider
    try {
      if (preferredProvider === 'uber') {
        return await requestDoorDashDelivery(request);
      }
      return await requestUberDelivery(request);
    } catch {
      throw new Error(
        'Both delivery providers failed. Please try again later.',
      );
    }
  }
}

/**
 * Check delivery status — auto-detects provider from ID prefix.
 */
export async function getGigDeliveryStatus(
  deliveryId: string,
): Promise<GigDeliveryResult> {
  if (
    deliveryId.startsWith('uber_mock_') ||
    deliveryId.startsWith('uber_')
  ) {
    return getUberDeliveryStatus(deliveryId);
  }

  if (
    deliveryId.startsWith('dd_mock_') ||
    deliveryId.startsWith('dd_') ||
    deliveryId.startsWith('sherpa_')
  ) {
    return getDoorDashDeliveryStatus(deliveryId);
  }

  // Unknown prefix — try both
  try {
    return await getUberDeliveryStatus(deliveryId);
  } catch {
    return getDoorDashDeliveryStatus(deliveryId);
  }
}

/**
 * Cancel delivery — auto-detects provider from ID prefix.
 */
export async function cancelGigDelivery(
  deliveryId: string,
): Promise<{ success: boolean; isMock: boolean }> {
  if (
    deliveryId.startsWith('uber_mock_') ||
    deliveryId.startsWith('uber_')
  ) {
    return cancelUberDelivery(deliveryId);
  }

  if (
    deliveryId.startsWith('dd_mock_') ||
    deliveryId.startsWith('dd_') ||
    deliveryId.startsWith('sherpa_')
  ) {
    return cancelDoorDashDelivery(deliveryId);
  }

  // Unknown — try Uber first
  try {
    return await cancelUberDelivery(deliveryId);
  } catch {
    return cancelDoorDashDelivery(deliveryId);
  }
}
