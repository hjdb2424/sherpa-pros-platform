'use client';

import { useEffect, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import type { EmergencyCategory, SeverityLevel } from '@/lib/mock-data/emergency-data';
import { EMERGENCY_CATEGORIES, SEVERITY_OPTIONS } from '@/lib/mock-data/emergency-data';
import {
  FireIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
  WrenchScrewdriverIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const CATEGORY_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  water_damage: ExclamationCircleIcon,
  fire_smoke: FireIcon,
  storm_damage: BoltIcon,
  hvac_emergency: SunIcon,
  electrical: BoltIcon,
  gas_leak: ExclamationTriangleIcon,
  structural: WrenchScrewdriverIcon,
};

interface MatchingRadarProps {
  category: EmergencyCategory;
  severity: SeverityLevel;
  onMatchFound: () => void;
}

export function MatchingRadar({ category, severity, onMatchFound }: MatchingRadarProps) {
  const [dots, setDots] = useState(1);

  const catInfo = EMERGENCY_CATEGORIES.find((c) => c.id === category);
  const sevInfo = SEVERITY_OPTIONS.find((s) => s.level === severity);

  const CenterIcon = catInfo ? (CATEGORY_ICONS[catInfo.icon] ?? ExclamationCircleIcon) : ExclamationCircleIcon;

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 500);

    const matchTimer = setTimeout(() => {
      onMatchFound();
    }, 2500);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(matchTimer);
    };
  }, [onMatchFound]);

  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      {/* Pulsing radar */}
      <div className="relative mb-8 flex h-48 w-48 items-center justify-center">
        {/* Outer rings */}
        <div className="absolute inset-0 animate-ping rounded-full border-2 border-red-500/20" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-4 animate-ping rounded-full border-2 border-red-500/30" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
        <div className="absolute inset-8 animate-ping rounded-full border-2 border-red-500/40" style={{ animationDuration: '1s', animationDelay: '0.6s' }} />
        {/* Static rings */}
        <div className="absolute inset-0 rounded-full border border-red-500/10" />
        <div className="absolute inset-4 rounded-full border border-red-500/15" />
        <div className="absolute inset-8 rounded-full border border-red-500/20" />
        <div className="absolute inset-12 rounded-full border border-red-500/25" />
        {/* Center icon */}
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-600/40">
          <CenterIcon className="h-10 w-10 text-white" aria-hidden="true" />
        </div>
      </div>

      <h2 className="mb-2 text-xl font-bold text-white" aria-live="polite">
        Finding Emergency Pros{'.'.repeat(dots)}
      </h2>
      <p className="mb-6 text-sm text-zinc-400">
        Scanning pros near your location
      </p>

      {/* Request summary */}
      <div className="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Category</span>
          <span className="flex items-center gap-1.5 font-medium text-white">
            {catInfo && <CenterIcon className="h-4 w-4" aria-hidden="true" />}
            {catInfo?.label}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-zinc-400">Severity</span>
          <span className="flex items-center gap-2 font-medium text-white">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${sevInfo?.dot}`} />
            {sevInfo?.label}
          </span>
        </div>
      </div>
    </div>
  );
}
