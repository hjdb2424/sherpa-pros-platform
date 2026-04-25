'use client';

import { useState, useMemo } from 'react';
import { type Pro } from '@/lib/mock-data/client-data';
import { SEEDED_PROS, toClientPro } from '@/lib/mock-data/seeded-pros';
import { ProCard } from '@/components/client/ProCard';
import EmptyState from '@/components/EmptyState';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import GlobalSearch from '@/components/search/GlobalSearch';
import GoogleMapProvider from '@/components/maps/GoogleMapProvider';
import MapView from '@/components/maps/MapView';
import BottomSheet from '@/components/maps/BottomSheet';
import ProMarker from '@/components/maps/ProMarker';
import {
  MOCK_PROS as MAP_PROS,
  DEFAULT_CENTER,
} from '@/lib/mock-data/map-data';
import { getProScoreNumber } from '@/lib/incentives/mock-metrics';

// Convert all 70 seeded pros to the client-data Pro shape
const ALL_PROS: Pro[] = SEEDED_PROS.map(toClientPro);

type ViewMode = 'list' | 'map';
type BadgeFilter = 'all' | 'gold' | 'silver' | 'bronze' | 'new';
type SortOption = 'rating' | 'reviews' | 'sherpa-score';

export function FindProsContent() {
  const [search, setSearch] = useState('');
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>('all');
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [view, setView] = useState<ViewMode>('map');
  const [currentZoom, setCurrentZoom] = useState(12);
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const filtered = useMemo(() => {
    let pros = [...ALL_PROS];

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

    // Sort
    if (sortBy === 'sherpa-score') {
      pros.sort((a, b) => getProScoreNumber(b.id) - getProScoreNumber(a.id));
    } else if (sortBy === 'reviews') {
      pros.sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      pros.sort((a, b) => b.rating - a.rating);
    }

    return pros;
  }, [search, badgeFilter, minRating, availableOnly, sortBy]);

  const tradeOptions = useMemo(() => {
    const trades = new Set<string>();
    ALL_PROS.forEach((p) => p.trades.forEach((t) => trades.add(t)));
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
        <GlobalSearch
          placeholder="Search by service, trade, or pro name..."
          onSearchChange={(q) => setSearch(q)}
          onSelect={(sub) => {
            // Filter pros by the selected sub-service's category name
            setSearch(sub.categoryName);
          }}
        />

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
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 focus:border-[#00a9e0] focus:outline-none"
            aria-label="Minimum rating"
          >
            <option value={0}>Any rating</option>
            <option value={4}>4+ stars</option>
            <option value={4.5}>4.5+ stars</option>
            <option value={4.8}>4.8+ stars</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 focus:border-[#00a9e0] focus:outline-none"
            aria-label="Sort by"
          >
            <option value="rating">Sort: Rating</option>
            <option value="reviews">Sort: Reviews</option>
            <option value="sherpa-score">Sort: Sherpa Score</option>
          </select>

          {/* Available toggle */}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-zinc-300 text-[#00a9e0] focus:ring-[#00a9e0]"
            />
            Available now
          </label>

          {/* View toggle */}
          <div className="ml-auto flex items-center rounded-lg border border-zinc-200 p-0.5">
            <button
              onClick={() => setView('map')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                view === 'map' ? 'bg-[#00a9e0] text-white' : 'text-zinc-500 hover:text-zinc-700'
              }`}
              aria-label="Map view"
            >
              Map
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                view === 'list' ? 'bg-[#00a9e0] text-white' : 'text-zinc-500 hover:text-zinc-700'
              }`}
              aria-label="List view"
            >
              List
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
                  ? 'border-[#00a9e0]/30 bg-sky-50 text-[#00a9e0]'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-[#00a9e0]/20'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>
      </div>

      {view === 'map' ? (
        <GoogleMapProvider>
          <div className="fixed inset-0 top-16 z-20 lg:flex lg:left-64">
            <BottomSheet
              peekContent={
                <p className="text-sm font-semibold text-zinc-900">
                  {filtered.length} Pro{filtered.length !== 1 ? 's' : ''} Nearby
                </p>
              }
            >
              <div className="p-4 space-y-3">
                {filtered.length === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-400">
                    No pros match your filters.
                  </p>
                ) : (
                  filtered.map((pro) => (
                    <ProCard
                      key={pro.id}
                      pro={pro}
                      sherpaScore={getProScoreNumber(pro.id)}
                      onViewProfile={() => {
                        /* placeholder */
                      }}
                      onRequestQuote={() => {
                        /* placeholder */
                      }}
                    />
                  ))
                )}
              </div>
            </BottomSheet>
            <div className="h-full flex-1">
              <MapView
                center={DEFAULT_CENTER}
                className="h-full w-full"
                onZoomChanged={(z) => setCurrentZoom(z)}
                onListView={() => setView('list')}
              >
                {MAP_PROS.map((pro) => (
                  <ProMarker
                    key={pro.id}
                    pro={pro}
                    zoom={currentZoom}
                    selected={selectedProId === pro.id}
                    onClick={() => setSelectedProId(pro.id)}
                  />
                ))}
              </MapView>
            </div>
          </div>
        </GoogleMapProvider>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-4 text-sm text-zinc-500">
            {filtered.length} Pro{filtered.length !== 1 ? 's' : ''} found
          </div>

          {filtered.length === 0 ? (
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
        </>
      )}
    </div>
  );
}
