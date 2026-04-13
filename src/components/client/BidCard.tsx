'use client';

import type { Bid } from '@/lib/mock-data/client-data';

const VALIDATION_CONFIG = {
  verified: { label: 'Quote verified', icon: '✓', color: 'text-emerald-600 bg-emerald-50' },
  above_market: { label: 'Above market rate', icon: '⚠', color: 'text-amber-600 bg-amber-50' },
  below_market: { label: 'Below market rate', icon: '⚠', color: 'text-orange-600 bg-orange-50' },
};

const BADGE_CONFIG: Record<string, { label: string; color: string }> = {
  gold: { label: 'Gold Pro', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  silver: { label: 'Silver Pro', color: 'text-zinc-500 bg-zinc-50 border-zinc-200' },
  bronze: { label: 'Bronze Pro', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  new: { label: 'New Pro', color: 'text-blue-600 bg-blue-50 border-blue-200' },
};

interface BidCardProps {
  bid: Bid;
  onAccept?: () => void;
}

export function BidCard({ bid, onAccept }: BidCardProps) {
  const validation = VALIDATION_CONFIG[bid.wisdomValidation];
  const badge = BADGE_CONFIG[bid.pro.badge];
  const initials = bid.pro.name.split(' ').map((n) => n[0]).join('');

  return (
    <div
      className={`relative rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${
        bid.recommended ? 'border-amber-300 ring-1 ring-amber-200' : 'border-zinc-200'
      }`}
    >
      {bid.recommended && (
        <div className="absolute -top-3 left-4 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
          Recommended
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a1a2e] text-sm font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900">{bid.pro.name}</h3>
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-sm">
            <span className="text-amber-500">{'★'.repeat(Math.floor(bid.pro.rating))}</span>
            <span className="font-medium text-zinc-700">{bid.pro.rating}</span>
            <span className="text-zinc-400">({bid.pro.reviewCount} reviews)</span>
          </div>
          {bid.pro.backgroundChecked && (
            <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Background Checked
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-zinc-900">${bid.amount.toLocaleString()}</div>
          <div className="text-xs text-zinc-500">{bid.estimatedDays} day{bid.estimatedDays > 1 ? 's' : ''}</div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{bid.message}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${validation.color}`}>
          {validation.icon} {validation.label}
        </span>
        <div className="flex gap-2">
          <button className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
            Message
          </button>
          <button
            onClick={onAccept}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
          >
            Accept Bid
          </button>
        </div>
      </div>
    </div>
  );
}
