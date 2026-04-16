'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { ShieldCheckIcon, StarIcon } from '@heroicons/react/24/solid';
import type { MockProLocation } from '@/lib/mock-data/map-data';

interface ProMarkerProps {
  pro: MockProLocation;
  zoom: number;
  selected?: boolean;
  onClick?: () => void;
}

export default function ProMarker({
  pro,
  zoom,
  selected = false,
  onClick,
}: ProMarkerProps) {
  if (zoom < 10) return null;

  const showCard = zoom > 14 || selected;

  return (
    <AdvancedMarker
      position={{ lat: pro.lat, lng: pro.lng }}
      onClick={onClick}
    >
      {showCard ? (
        /* ---- Mini-card ---- */
        <div
          className={`w-48 cursor-pointer rounded-xl bg-white p-3 shadow-lg transition-transform dark:bg-zinc-800 ${
            selected
              ? 'scale-105 border-2 border-[#00a9e0] ring-2 ring-[#00a9e0]/30'
              : 'border border-zinc-100 dark:border-zinc-700'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">
              {pro.initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {pro.name}
                </span>
                {pro.verified && (
                  <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-[#00a9e0]" />
                )}
              </div>
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.round(pro.rating)
                        ? 'text-[#ff4500]'
                        : 'text-zinc-200 dark:text-zinc-600'
                    }`}
                  />
                ))}
                <span className="ml-1 text-[10px] text-slate-500 dark:text-zinc-400">
                  {pro.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>{pro.trade}</span>
            <span>{pro.distance}</span>
          </div>

          {/* CTA */}
          <button
            type="button"
            className="mt-2 w-full rounded-lg bg-[#00a9e0] py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0090c0]"
          >
            Request
          </button>
        </div>
      ) : (
        /* ---- Avatar circle ---- */
        <div
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white shadow-md ${
            selected
              ? 'ring-3 ring-[#00a9e0]/40'
              : ''
          }`}
          style={{ border: '3px solid white' }}
        >
          {pro.initials}
        </div>
      )}
    </AdvancedMarker>
  );
}
