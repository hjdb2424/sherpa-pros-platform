// ---------------------------------------------------------------------------
// Tiered Fee Calculator — Pure Functions, Integer Cents
// ---------------------------------------------------------------------------

export type ClientTier = 'subscribed' | 'one_time' | 'emergency';

export interface FeeBreakdown {
  materialsTotalCents: number;
  serviceFeePct: number;
  serviceFeeCents: number;
  /** Internal only — folded into service fee, NOT shown to client */
  deliveryProtectionReserveCents: number;
  grandTotalCents: number;
}

const SERVICE_FEE_MAP: Record<ClientTier, number> = {
  subscribed: 12,
  one_time: 18,
  emergency: 25,
};

const DELIVERY_PROTECTION_CENTS = 299; // $2.99

export function getServiceFeePct(tier: ClientTier): number {
  return SERVICE_FEE_MAP[tier];
}

export function calculateFeeBreakdown(
  materialsTotalCents: number,
  tier: ClientTier,
): FeeBreakdown {
  const pct = SERVICE_FEE_MAP[tier];
  const serviceFeeCents = Math.round((materialsTotalCents * pct) / 100);
  return {
    materialsTotalCents,
    serviceFeePct: pct,
    serviceFeeCents,
    // Delivery protection reserve is tracked internally for accounting
    // but NOT added to client-facing grand total (bundled into service fee)
    deliveryProtectionReserveCents: DELIVERY_PROTECTION_CENTS,
    grandTotalCents: materialsTotalCents + serviceFeeCents,
  };
}

export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
}
