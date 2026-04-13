'use client';

import { SEVERITY_OPTIONS, type SeverityLevel } from '@/lib/mock-data/emergency-data';

interface SeveritySelectorProps {
  onSelect: (severity: SeverityLevel) => void;
  onBack: () => void;
}

export function SeveritySelector({ onSelect, onBack }: SeveritySelectorProps) {
  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
        aria-label="Go back to category selection"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <h2 className="mb-2 text-center text-2xl font-bold text-white">
        How severe is it?
      </h2>
      <p className="mb-6 text-center text-sm text-zinc-400">
        This helps us prioritize your request
      </p>

      <div className="flex flex-col gap-3">
        {SEVERITY_OPTIONS.map((opt) => (
          <button
            key={opt.level}
            onClick={() => onSelect(opt.level)}
            className={`flex items-center gap-4 rounded-2xl border-2 ${opt.borderColor} ${opt.bgColor} p-5 text-left transition-all active:scale-[0.98] hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d1a]`}
            aria-label={`${opt.label}: ${opt.description}`}
          >
            <div className={`h-5 w-5 shrink-0 rounded-full ${opt.dot} shadow-lg`} aria-hidden="true" />
            <div>
              <span className="block text-lg font-bold text-white">
                {opt.label}
              </span>
              <span className="block text-sm text-zinc-300">
                {opt.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
