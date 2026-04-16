'use client';

import {
  FireIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
  WrenchScrewdriverIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { EMERGENCY_CATEGORIES, type EmergencyCategory } from '@/lib/mock-data/emergency-data';
import type { ComponentType, SVGProps } from 'react';

const CATEGORY_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  water_damage: ExclamationCircleIcon,
  fire_smoke: FireIcon,
  storm_damage: BoltIcon,
  hvac_emergency: SunIcon,
  electrical: BoltIcon,
  gas_leak: ExclamationTriangleIcon,
  structural: WrenchScrewdriverIcon,
};

interface EmergencyCategoryGridProps {
  onSelect: (category: EmergencyCategory) => void;
}

export function EmergencyCategoryGrid({ onSelect }: EmergencyCategoryGridProps) {
  return (
    <div className="w-full">
      <h2 className="mb-2 text-center text-2xl font-bold text-white">
        What is the emergency?
      </h2>
      <p className="mb-6 text-center text-sm text-zinc-400">
        Tap one to get matched with a Pro immediately
      </p>

      <div className="grid grid-cols-2 gap-3">
        {EMERGENCY_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.icon] ?? ExclamationCircleIcon;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 ${cat.borderColor} ${cat.bgColor} p-5 text-center transition-all active:scale-[0.97] hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d1a]`}
              aria-label={`${cat.label} emergency${cat.warning ? `. Warning: ${cat.warning}` : ''}`}
            >
              <Icon className="h-8 w-8" aria-hidden="true" />
              <span className={`text-base font-bold ${cat.color}`}>
                {cat.label}
              </span>
              <span className="text-[11px] text-zinc-500">
                {cat.responseTime}
              </span>
              {cat.warning && (
                <span className="mt-1 rounded-md bg-red-600/30 px-2 py-0.5 text-[10px] font-bold text-red-300">
                  {cat.warning}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
