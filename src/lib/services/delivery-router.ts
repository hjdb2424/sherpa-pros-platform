// ---------------------------------------------------------------------------
// Delivery Tier Selection — determines which delivery options are available
// based on material characteristics (weight, size, category).
// ---------------------------------------------------------------------------

import type { MaterialItem, MaterialCategory } from '@/lib/mock-data/checklist-data';
import type { DeliveryTier } from './zinc';

export interface DeliveryOption {
  tier: DeliveryTier;
  label: string;
  description: string;
  estimatedTime: string;
  eligible: boolean;
  reason?: string;
}

// ---------------------------------------------------------------------------
// Heuristics for gig delivery eligibility
// ---------------------------------------------------------------------------

/** Categories that are too heavy/bulky for gig delivery */
const GIG_INELIGIBLE_CATEGORIES: MaterialCategory[] = [
  'lumber',
  'drywall',
  'hvac',
];

/** Estimated weight per unit by category (lbs) — rough heuristics */
const CATEGORY_WEIGHT_MAP: Record<MaterialCategory, number> = {
  plumbing: 2,
  electrical: 1.5,
  lumber: 15,
  hardware: 0.5,
  insulation: 3,
  drywall: 12,
  paint: 10,
  hvac: 25,
  general: 2,
};

function estimateTotalWeight(materials: MaterialItem[]): number {
  return materials.reduce((total, item) => {
    const unitWeight = CATEGORY_WEIGHT_MAP[item.category] ?? 2;
    return total + unitWeight * item.quantity;
  }, 0);
}

function hasOversizedItems(materials: MaterialItem[]): boolean {
  // Items likely > 4ft: lumber, drywall, conduit, SE cable by the foot
  return materials.some(
    (m) =>
      GIG_INELIGIBLE_CATEGORIES.includes(m.category) ||
      m.name.toLowerCase().includes('conduit') ||
      m.name.toLowerCase().includes('10 ft') ||
      m.name.toLowerCase().includes("10'") ||
      m.name.toLowerCase().includes('8 ft') ||
      m.name.toLowerCase().includes("8'"),
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getDeliveryOptions(materials: MaterialItem[]): DeliveryOption[] {
  const totalWeight = estimateTotalWeight(materials);
  const totalItems = materials.reduce((sum, m) => sum + m.quantity, 0);
  const oversized = hasOversizedItems(materials);

  // Determine gig eligibility
  let gigEligible = true;
  let gigReason: string | undefined;

  if (totalWeight >= 50) {
    gigEligible = false;
    gigReason = `Total estimated weight is ${Math.round(totalWeight)} lbs (max 50 lbs for gig delivery)`;
  } else if (totalItems >= 10) {
    gigEligible = false;
    gigReason = `${totalItems} total items exceeds gig delivery limit of 10 items`;
  } else if (oversized) {
    gigEligible = false;
    gigReason = 'Order contains oversized items (lumber, drywall, or items > 4 ft)';
  }

  return [
    {
      tier: 'bopis',
      label: 'Store Pickup (BOPIS)',
      description: 'Order online, pick up at your nearest Home Depot',
      estimatedTime: 'Ready in 30 min',
      eligible: true,
    },
    {
      tier: 'hd_delivery',
      label: 'Home Depot Delivery',
      description: 'Standard delivery to job site or address',
      estimatedTime: '1-3 business days',
      eligible: true,
    },
    {
      tier: 'gig',
      label: 'Gig Delivery',
      description: 'Fast delivery via local driver',
      estimatedTime: '60-90 min',
      eligible: gigEligible,
      reason: gigReason,
    },
    {
      tier: 'pro_choice',
      label: "Pro's Choice",
      description: 'Let the assigned pro source and deliver materials',
      estimatedTime: 'Included in job schedule',
      eligible: true,
    },
  ];
}
