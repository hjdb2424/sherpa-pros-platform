'use client';

import { useMemo } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import type { MaterialItem } from '@/lib/mock-data/checklist-data';
import {
  calculateFeeBreakdown,
  formatCents,
  type ClientTier,
} from '@/lib/pricing/fee-calculator';

interface MaterialsApprovalProps {
  materials: MaterialItem[];
  clientTier: ClientTier;
  onApprove: () => void;
}

const DELIVERY_PROTECTION_CENTS = 299;

export default function MaterialsApproval({
  materials,
  clientTier,
  onApprove,
}: MaterialsApprovalProps) {
  const materialsSubtotal = useMemo(
    () =>
      materials.reduce(
        (sum, m) => sum + (m.priceCents ?? 0) * (m.quantity ?? 1),
        0
      ),
    [materials]
  );

  const feeBreakdown = useMemo(
    () => calculateFeeBreakdown(materialsSubtotal, clientTier),
    [materialsSubtotal, clientTier]
  );

  const grandTotal =
    materialsSubtotal + feeBreakdown.serviceFeeCents + DELIVERY_PROTECTION_CENTS;

  const feePercentage = feeBreakdown.serviceFeePct;

  return (
    <section
      className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
      aria-label="Materials Approval"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Approve Materials
      </h2>

      {/* Transparency framing */}
      <p className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-400">
        Typical contractor markup: 15-30% (hidden). Sherpa: {feePercentage}%
        (transparent, guaranteed correct parts, delivered).
      </p>

      {/* Cost breakdown */}
      <div className="mt-5 space-y-3">
        {/* Materials subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">
            Materials Subtotal
          </span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {formatCents(materialsSubtotal)}
          </span>
        </div>

        {/* Sherpa Service Fee */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">
            Sherpa Service Fee: {feePercentage}%
          </span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {formatCents(feeBreakdown.serviceFeeCents)}
          </span>
        </div>

        {/* Delivery Protection */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">
            Delivery Protection
          </span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {formatCents(DELIVERY_PROTECTION_CENTS)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* Grand Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Grand Total
          </span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {formatCents(grandTotal)}
          </span>
        </div>
      </div>

      {/* Approve CTA */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onApprove}
          className="w-full rounded-full bg-[#00a9e0] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 active:scale-[0.98] dark:hover:bg-[#0ea5e9]"
        >
          Approve Materials
        </button>
      </div>

      {/* Trust callout */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        <LockClosedIcon className="h-4 w-4 text-emerald-500" aria-hidden="true" />
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Payment protected in escrow
        </span>
      </div>
    </section>
  );
}
