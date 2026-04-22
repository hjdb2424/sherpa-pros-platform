'use client';

import { useState, useMemo } from 'react';
import {
  SERVICE_CATALOG,
  getCategoryConfidence,
  getCategoryWisemanSource,
  type ServiceCategory,
} from '@/lib/config/service-catalog';

// Emoji mapping for Ionicon names (service catalog uses Ionicon identifiers)
const CATEGORY_EMOJI: Record<string, string> = {
  'water-outline': '\uD83D\uDD27',
  'flash-outline': '\u26A1',
  'hammer-outline': '\uD83E\uDE9A',
  'color-palette-outline': '\uD83C\uDFA8',
  'thermometer-outline': '\u2744\uFE0F',
  'home-outline': '\uD83C\uDFE0',
  'leaf-outline': '\uD83C\uDF3F',
  'layers-outline': '\uD83E\uDEB5',
  'cube-outline': '\uD83E\uDDF1',
  'construct-outline': '\uD83D\uDD28',
  'grid-outline': '\uD83D\uDD32',
  'business-outline': '\uD83C\uDFD7\uFE0F',
  'albums-outline': '\uD83E\uDE9F',
  'shirt-outline': '\uD83E\uDDE4',
  'trash-outline': '\uD83D\uDCA5',
  'sparkles-outline': '\uD83E\uDDF9',
  'car-outline': '\uD83D\uDCE6',
  'hardware-chip-outline': '\uD83D\uDD0C',
  'build-outline': '\uD83D\uDEE0\uFE0F',
  'warning-outline': '\u26A0\uFE0F',
  'shield-checkmark-outline': '\uD83D\uDEE1\uFE0F',
  'flame-outline': '\uD83D\uDD25',
  'rainy-outline': '\uD83D\uDCA7',
  'bug-outline': '\uD83D\uDC1E',
  'lock-closed-outline': '\uD83D\uDD12',
  'camera-outline': '\uD83D\uDCF7',
  'sunny-outline': '\u2600\uFE0F',
  'snow-outline': '\u2744\uFE0F',
  'fitness-outline': '\uD83C\uDFCB\uFE0F',
  'medical-outline': '\uD83C\uDFE5',
  'cafe-outline': '\u2615',
  'boat-outline': '\u26F5',
  'trail-sign-outline': '\uD83E\uDEA7',
  'earth-outline': '\uD83C\uDF0D',
  'telescope-outline': '\uD83D\uDD2D',
  'briefcase-outline': '\uD83D\uDCBC',
  'receipt-outline': '\uD83E\uDDFE',
};

function getCategoryEmoji(icon: string): string {
  return CATEGORY_EMOJI[icon] ?? '\uD83D\uDD27';
}

export default function CategoryBrowser() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return SERVICE_CATALOG;
    const q = search.toLowerCase();
    return SERVICE_CATALOG.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.subServices.some(
          (s) => s.name.toLowerCase().includes(q) || s.scope.toLowerCase().includes(q),
        ),
    );
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
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
          placeholder="Search categories or services..."
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          aria-label="Search service categories"
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{filtered.length} categories</span>
        <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-700" />
        <span>
          {filtered.reduce((sum, c) => sum + c.subServices.length, 0)} sub-services
        </span>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No categories match &ldquo;{search}&rdquo;
          </p>
        </div>
      )}

      {/* Category grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            expanded={expandedId === cat.id}
            onToggle={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  expanded,
  onToggle,
}: {
  category: ServiceCategory;
  expanded: boolean;
  onToggle: () => void;
}) {
  const confidence = getCategoryConfidence(category.id);
  const source = getCategoryWisemanSource(category.id);
  const top3 = category.subServices.slice(0, 3);

  return (
    <div
      className={`rounded-xl border transition-all ${
        expanded
          ? 'border-[#00a9e0]/30 bg-sky-50/50 shadow-md dark:border-[#00a9e0]/20 dark:bg-sky-950/20'
          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600'
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left"
        aria-expanded={expanded}
      >
        <span className="mt-0.5 text-2xl" role="img" aria-hidden="true">
          {getCategoryEmoji(category.icon)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {category.name}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {category.subServices.length} service{category.subServices.length !== 1 ? 's' : ''}
          </p>
          {/* Top 3 sub-services preview */}
          {!expanded && (
            <div className="mt-2 flex flex-wrap gap-1">
              {top3.map((s) => (
                <span
                  key={s.id}
                  className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {s.name}
                </span>
              ))}
              {category.subServices.length > 3 && (
                <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  +{category.subServices.length - 3} more
                </span>
              )}
            </div>
          )}
          {/* Regional tags */}
          {category.regional && category.regional.length > 0 && !category.regional.includes('national') && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {category.regional.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium uppercase text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Confidence badge */}
        {confidence > 0 && (
          <span
            className="mt-0.5 shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            title={`Validated by ${source}`}
          >
            {confidence}%
          </span>
        )}
        <svg
          className={`mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expanded sub-services */}
      {expanded && (
        <div className="border-t border-zinc-200 px-4 pb-4 pt-3 dark:border-zinc-700">
          <div className="space-y-3">
            {category.subServices.map((sub) => (
              <div
                key={sub.id}
                className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-800 dark:ring-zinc-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {sub.name}
                  </h4>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {sub.wisemanConfidence}%
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {sub.scope}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    ${sub.budgetRange.min.toLocaleString()} - ${sub.budgetRange.max.toLocaleString()}
                  </span>
                  <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-700" />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {sub.typicalDuration}
                  </span>
                  {sub.urgency === 'emergency' && (
                    <>
                      <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-700" />
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
                        </svg>
                        Emergency
                      </span>
                    </>
                  )}
                  {sub.permitRequired && (
                    <>
                      <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-700" />
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">Permit Required</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
