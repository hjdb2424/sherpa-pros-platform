import type { Pro } from '@/lib/mock-data/client-data';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const BADGE_CONFIG: Record<Pro['badge'], { label: string; color: string; icon: string }> = {
  gold: { label: 'Gold Pro', color: 'text-[#ff4500] bg-orange-50 border-orange-200', icon: '★' },
  silver: { label: 'Silver Pro', color: 'text-zinc-500 bg-zinc-50 border-zinc-200', icon: '★' },
  bronze: { label: 'Bronze Pro', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: '★' },
  new: { label: 'New Pro', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: '●' },
};

interface ProCardProps {
  pro: Pro;
  compact?: boolean;
  sherpaScore?: number;
  onViewProfile?: () => void;
  onRequestQuote?: () => void;
}

export function ProCard({ pro, compact = false, sherpaScore, onViewProfile, onRequestQuote }: ProCardProps) {
  const badge = BADGE_CONFIG[pro.badge];

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white">
          {pro.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-zinc-900">{pro.name}</span>
            {pro.backgroundChecked && (
              <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                Verified
              </span>
            )}
            <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${badge.color}`}>
              {badge.icon} {badge.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="text-[#ff4500]">{'★'.repeat(Math.floor(pro.rating))}</span>
            <span>{pro.rating}</span>
            <span>({pro.reviewCount})</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-[#00a9e0]/30 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-lg font-bold text-white">
          {pro.name.split(' ').map((n) => n[0]).join('')}
          {sherpaScore != null && sherpaScore > 0 && (
            <span
              className={`absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${
                sherpaScore >= 80
                  ? 'bg-amber-500'
                  : sherpaScore >= 60
                    ? 'bg-slate-400'
                    : 'bg-orange-600'
              }`}
              title={`Sherpa Score: ${sherpaScore}`}
            >
              {sherpaScore}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-zinc-900">{pro.name}</h3>
            {pro.backgroundChecked && (
              <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                Verified
              </span>
            )}
            {pro.available && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Available
              </span>
            )}
          </div>

          <span className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${badge.color}`}>
            {badge.icon} {badge.label}
          </span>

          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="text-[#ff4500]">{'★'.repeat(Math.floor(pro.rating))}</span>
            <span className="font-medium text-zinc-900">{pro.rating}</span>
            <span className="text-zinc-400">({pro.reviewCount} reviews)</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {pro.trades.map((trade) => (
              <span key={trade} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                {trade}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
            <span>{pro.distance} away</span>
            <span>{pro.completedJobs} jobs done</span>
            <span>Responds {pro.responseTime}</span>
          </div>

          {pro.backgroundChecked && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
              Licensed & Insured
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onViewProfile}
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          View Profile
        </button>
        <button
          onClick={onRequestQuote}
          className="flex-1 rounded-lg bg-[#00a9e0] px-3 py-2 text-sm font-medium text-white shadow-lg shadow-[#00a9e0]/25 transition-colors hover:bg-[#0ea5e9]"
        >
          Request Quote
        </button>
      </div>
    </div>
  );
}
