'use client';

import { useMemo } from 'react';
import {
  BuildingStorefrontIcon,
  TruckIcon,
  BoltIcon,
  UserIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { MaterialItem } from '@/lib/mock-data/checklist-data';
import type { DeliveryTier } from '@/lib/services/zinc';
import { getDeliveryOptions, type DeliveryOption } from '@/lib/services/delivery-router';

interface DeliverySelectorProps {
  materials: MaterialItem[];
  onSelect: (tier: DeliveryTier) => void;
  selectedTier?: DeliveryTier;
}

const TIER_ICONS: Record<DeliveryTier, typeof BuildingStorefrontIcon> = {
  bopis: BuildingStorefrontIcon,
  hd_delivery: TruckIcon,
  gig: BoltIcon,
  pro_choice: UserIcon,
};

const TIER_COLORS: Record<DeliveryTier, { selected: string; icon: string }> = {
  bopis: {
    selected: 'border-[#00a9e0] bg-sky-50 dark:bg-sky-950/30',
    icon: 'text-[#00a9e0]',
  },
  hd_delivery: {
    selected: 'border-[#00a9e0] bg-sky-50 dark:bg-sky-950/30',
    icon: 'text-[#00a9e0]',
  },
  gig: {
    selected: 'border-[#ff4500] bg-orange-50 dark:bg-orange-950/30',
    icon: 'text-[#ff4500]',
  },
  pro_choice: {
    selected: 'border-[#00a9e0] bg-sky-50 dark:bg-sky-950/30',
    icon: 'text-[#00a9e0]',
  },
};

export default function DeliverySelector({
  materials,
  onSelect,
  selectedTier,
}: DeliverySelectorProps) {
  const options = useMemo(() => getDeliveryOptions(materials), [materials]);

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Delivery method">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
        Delivery Method
      </h3>

      {options.map((option: DeliveryOption) => {
        const Icon = TIER_ICONS[option.tier];
        const colors = TIER_COLORS[option.tier];
        const isSelected = selectedTier === option.tier;
        const isDisabled = !option.eligible;

        return (
          <button
            key={option.tier}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => onSelect(option.tier)}
            className={`
              relative w-full flex items-start gap-3 rounded-xl border-2 p-4
              transition-all duration-200 text-left
              ${
                isDisabled
                  ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50'
                  : isSelected
                    ? `${colors.selected} border-2 shadow-sm`
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
              }
            `}
          >
            {/* Icon */}
            <div
              className={`
                mt-0.5 flex-shrink-0 rounded-lg p-2
                ${
                  isDisabled
                    ? 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                    : isSelected
                      ? `${colors.icon} bg-white dark:bg-slate-800`
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm font-semibold ${
                    isDisabled
                      ? 'text-slate-400 dark:text-slate-500'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {option.label}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                    isDisabled
                      ? 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                      : option.tier === 'gig'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                  }`}
                >
                  {option.estimatedTime}
                </span>
              </div>

              <p
                className={`mt-0.5 text-xs ${
                  isDisabled
                    ? 'text-slate-400 dark:text-slate-500'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {option.description}
              </p>

              {/* Ineligible reason */}
              {isDisabled && option.reason && (
                <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                  {option.reason}
                </p>
              )}
            </div>

            {/* Selected checkmark */}
            {isSelected && (
              <div className="absolute top-3 right-3 flex-shrink-0 rounded-full bg-[#00a9e0] p-0.5">
                <CheckIcon className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
