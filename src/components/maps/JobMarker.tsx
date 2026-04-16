'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import type { MockJobLocation } from '@/lib/mock-data/map-data';

const URGENCY_COLORS: Record<MockJobLocation['urgency'], string> = {
  emergency: '#ff4500',
  standard: '#00a9e0',
  flexible: '#94a3b8',
};

const URGENCY_LABELS: Record<MockJobLocation['urgency'], string> = {
  emergency: 'Emergency',
  standard: 'Standard',
  flexible: 'Flexible',
};

function formatBudget(amount: number): string {
  if (amount >= 1000) {
    const k = amount / 1000;
    return `$${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `$${amount}`;
}

interface JobMarkerProps {
  job: MockJobLocation;
  zoom: number;
  selected?: boolean;
  onClick?: () => void;
}

export default function JobMarker({
  job,
  zoom,
  selected = false,
  onClick,
}: JobMarkerProps) {
  if (zoom < 10) return null;

  const color = URGENCY_COLORS[job.urgency];
  const showCard = zoom > 14 || selected;

  return (
    <AdvancedMarker
      position={{ lat: job.lat, lng: job.lng }}
      onClick={onClick}
    >
      {showCard ? (
        /* ---- Mini-card ---- */
        <div
          className={`w-52 cursor-pointer rounded-xl bg-white p-3 shadow-lg transition-transform dark:bg-zinc-800 ${
            selected
              ? 'scale-105 border-2 border-[#00a9e0] ring-2 ring-[#00a9e0]/30'
              : 'border border-zinc-100 dark:border-zinc-700'
          }`}
        >
          {/* Title + urgency */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">
              {job.title}
            </h4>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: color }}
            >
              {URGENCY_LABELS[job.urgency]}
            </span>
          </div>

          {/* Meta */}
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
            <span>{job.category}</span>
            <span>&middot;</span>
            <span>{job.distance}</span>
            <span>&middot;</span>
            <span>{job.postedAgo}</span>
          </div>

          {/* Budget + CTA */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {formatBudget(job.budget)}
            </span>
            <button
              type="button"
              className="rounded-lg bg-[#00a9e0] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0090c0]"
            >
              Bid
            </button>
          </div>
        </div>
      ) : (
        /* ---- Price circle ---- */
        <div
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
          style={{ border: `3px solid ${color}` }}
        >
          <span className="text-[10px] font-bold text-slate-900">
            {formatBudget(job.budget)}
          </span>
        </div>
      )}
    </AdvancedMarker>
  );
}
