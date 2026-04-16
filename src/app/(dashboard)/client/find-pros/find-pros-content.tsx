'use client';

import { useState, useMemo } from 'react';
import { MOCK_PROS, JOB_CATEGORIES, type Pro } from '@/lib/mock-data/client-data';
import { ProCard } from '@/components/client/ProCard';
import EmptyState from '@/components/EmptyState';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type ViewMode = 'list' | 'map';
type BadgeFilter = 'all' | 'gold' | 'silver' | 'bronze' | 'new';

export function FindProsContent() {
  const [search, setSearch] = useState('');
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>('all');
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [view, setView] = useState<ViewMode>('list');

  const filtered = useMemo(() => {
    let pros = [...MOCK_PROS];

    if (search.trim()) {
      const q = search.toLowerCase();
      pros = pros.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.trades.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (badgeFilter !== 'all') {
      pros = pros.filter((p) => p.badge === badgeFilter);
    }

    if (minRating > 0) {
      pros = pros.filter((p) => p.rating >= minRating);
    }

    if (availableOnly) {
      pros = pros.filter((p) => p.available);
    }

    return pros;
  }, [search, badgeFilter, minRating, availableOnly]);

  const tradeOptions = useMemo(() => {
    const trades = new Set<string>();
    MOCK_PROS.forEach((p) => p.trades.forEach((t) => trades.add(t)));
    return Array.from(trades).sort();
  }, []);

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Find Pros</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Browse verified contractors and tradespeople in your area.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or trade (e.g. plumbing, electrical)..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            aria-label="Search Pros"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Badge filter */}
          <div className="flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
            {(['all', 'gold', 'silver', 'bronze'] as BadgeFilter[]).map((badge) => (
              <button
                key={badge}
                onClick={() => setBadgeFilter(badge)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  badgeFilter === badge
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {badge === 'all'
                  ? 'All'
                  : badge === 'gold'
                    ? '★ Gold'
                    : badge === 'silver'
                      ? '★ Silver'
                      : '★ Bronze'}
              </button>
            ))}
          </div>

          {/* Rating filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 focus:border-amber-400 focus:outline-none"
            aria-label="Minimum rating"
          >
            <option value={0}>Any rating</option>
            <option value={4}>4+ stars</option>
            <option value={4.5}>4.5+ stars</option>
            <option value={4.8}>4.8+ stars</option>
          </select>

          {/* Available toggle */}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-zinc-300 text-amber-500 focus:ring-amber-400"
            />
            Available now
          </label>

          {/* View toggle */}
          <div className="ml-auto flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
            <button
              onClick={() => setView('list')}
              className={`rounded-md p-1.5 transition-colors ${
                view === 'list' ? 'bg-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
              }`}
              aria-label="List view"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
            <button
              onClick={() => setView('map')}
              className={`rounded-md p-1.5 transition-colors ${
                view === 'map' ? 'bg-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
              }`}
              aria-label="Map view"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick trade filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tradeOptions.slice(0, 8).map((trade) => (
            <button
              key={trade}
              onClick={() => setSearch(search === trade ? '' : trade)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                search === trade
                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-amber-200'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-zinc-500">
        {filtered.length} Pro{filtered.length !== 1 ? 's' : ''} found
      </div>

      {view === 'map' ? (
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <div className="flex h-96 items-center justify-center bg-zinc-100">
            <div className="text-center">
              <svg className="mx-auto h-10 w-10 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              <p className="mt-3 text-sm font-medium text-zinc-600">Map View</p>
              <p className="mt-1 text-xs text-zinc-400">
                MapBox integration will show Pros on a map
              </p>
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<MagnifyingGlassIcon className="h-8 w-8" />}
          title="No pros match your search"
          description="Try a different trade, expand your search area, or lower the minimum rating."
          ctaLabel="Reset Filters"
          ctaHref="/client/find-pros"
          secondaryLabel="Browse All Pros"
          secondaryHref="/client/find-pros"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((pro) => (
            <ProCard
              key={pro.id}
              pro={pro}
              onViewProfile={() => {
                /* placeholder */
              }}
              onRequestQuote={() => {
                /* placeholder */
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
