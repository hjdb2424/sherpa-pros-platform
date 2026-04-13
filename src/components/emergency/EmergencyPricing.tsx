import type { EmergencyCategory } from '@/lib/mock-data/emergency-data';
import { getEmergencyPricing, formatCents } from '@/lib/mock-data/emergency-data';

interface EmergencyPricingProps {
  category: EmergencyCategory;
}

export function EmergencyPricing({ category }: EmergencyPricingProps) {
  const pricing = getEmergencyPricing(category);

  if (!pricing) return null;

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
        Estimated Cost Range
      </p>
      <p className="text-xl font-bold text-white">
        {formatCents(pricing.rangeLow)} &ndash; {formatCents(pricing.rangeHigh)}
      </p>
      <p className="mt-1 text-xs text-zinc-400">{pricing.description}</p>
      <p className="mt-2 text-[10px] text-zinc-500">
        Final price determined after on-site assessment. Payment collected after service.
      </p>
    </div>
  );
}
