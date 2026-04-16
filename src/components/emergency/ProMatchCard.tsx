'use client';

import type { EmergencyPro } from '@/lib/mock-data/emergency-data';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

interface ProMatchCardProps {
  pro: EmergencyPro;
  onConfirm: () => void;
  onSeeOthers: () => void;
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < fullStars ? 'text-amber-400' : i === fullStars && hasHalf ? 'text-amber-400' : 'text-zinc-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-zinc-300">{rating}</span>
      <span className="text-xs text-zinc-500">({reviewCount})</span>
    </div>
  );
}

const BADGE_COLORS: Record<string, string> = {
  Platinum: 'bg-purple-600/30 text-purple-300 border-purple-500/40',
  Gold: 'bg-amber-600/30 text-amber-300 border-amber-500/40',
  Silver: 'bg-zinc-600/30 text-zinc-300 border-zinc-500/40',
};

export function ProMatchCard({ pro, onConfirm, onSeeOthers }: ProMatchCardProps) {
  return (
    <div className="w-full animate-[slideUp_0.4s_ease-out] rounded-2xl border border-zinc-700 bg-zinc-800 p-5">
      {/* Header row */}
      <div className="mb-4 flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1a1a2e] text-xl font-bold text-amber-400">
          {pro.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{pro.name}</h3>
            {pro.backgroundChecked && (
              <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-950/50 px-2 py-0.5 text-xs font-medium text-emerald-400">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                Verified
              </span>
            )}
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${BADGE_COLORS[pro.badgeTier]}`}>
              {pro.badgeTier}
            </span>
          </div>
          <StarRating rating={pro.rating} reviewCount={pro.reviewCount} />
          <p className="mt-1 text-sm text-zinc-400">
            {pro.yearsExperience} years experience
          </p>
        </div>
      </div>

      {/* ETA */}
      <div className="mb-4 rounded-xl bg-emerald-950/50 border border-emerald-700/50 p-3 text-center">
        <span className="text-2xl font-black text-emerald-400">
          {pro.responseTimeMinutes} minutes away
        </span>
        <p className="text-xs text-emerald-300/70">
          {pro.distanceMiles} miles from your location
        </p>
      </div>

      {/* Certifications */}
      <div className="mb-4">
        <p className="mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          IICRC Certifications
        </p>
        <div className="flex flex-wrap gap-1.5">
          {pro.certifications.map((cert) => (
            <span
              key={cert}
              className="rounded-md bg-blue-950/50 border border-blue-800/40 px-2 py-0.5 text-xs font-semibold text-blue-300"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mb-5 flex flex-wrap gap-3">
        {pro.backgroundChecked && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Background Checked
          </div>
        )}
        {pro.licensed && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Licensed
          </div>
        )}
        {pro.insured && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Insured
          </div>
        )}
      </div>

      {/* Actions */}
      <button
        onClick={onConfirm}
        className="mb-2 w-full rounded-xl bg-emerald-600 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-emerald-500 active:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800"
      >
        Confirm &mdash; Dispatch {pro.name.split(' ')[0]}
      </button>
      <button
        onClick={onSeeOthers}
        className="w-full py-2 text-center text-sm text-zinc-400 underline underline-offset-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
      >
        See Other Pros
      </button>
    </div>
  );
}
