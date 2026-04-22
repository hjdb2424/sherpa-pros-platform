'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ALL_SUB_SERVICES,
  SERVICE_CATALOG,
} from '@/lib/config/service-catalog';

interface GlobalSearchProps {
  /** Placeholder text override */
  placeholder?: string;
  /** Large hero variant with rounded-full styling */
  variant?: 'default' | 'hero';
  /** Callback when a sub-service is selected (instead of navigating) */
  onSelect?: (subService: (typeof ALL_SUB_SERVICES)[number]) => void;
  /** Callback when search text changes */
  onSearchChange?: (query: string) => void;
}

export default function GlobalSearch({
  placeholder = 'Search for a service...',
  variant = 'default',
  onSelect,
  onSearchChange,
}: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search input at 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Search results grouped by category
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    const matches = ALL_SUB_SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q) ||
        s.scope.toLowerCase().includes(q),
    );
    return matches;
  }, [debouncedQuery]);

  // Group results by category
  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const r of results) {
      const existing = map.get(r.categoryId) ?? [];
      existing.push(r);
      map.set(r.categoryId, existing);
    }
    return Array.from(map.entries()).map(([catId, items]) => ({
      category: SERVICE_CATALOG.find((c) => c.id === catId),
      items,
    }));
  }, [results]);

  const handleSelect = useCallback(
    (sub: (typeof ALL_SUB_SERVICES)[number]) => {
      setQuery('');
      setOpen(false);
      if (onSelect) {
        onSelect(sub);
      } else {
        // Navigate to post-job with pre-filled sub-service
        router.push(`/client/post-job?service=${sub.id}`);
      }
    },
    [onSelect, router],
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    setOpen(value.trim().length > 0);
    onSearchChange?.(value);
  };

  const isHero = variant === 'hero';

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Search input */}
      <div className="relative">
        <svg
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 ${
            isHero ? 'h-6 w-6' : 'h-5 w-5'
          }`}
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
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder={placeholder}
          className={`w-full border bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${
            isHero
              ? 'rounded-full border-zinc-200 py-4 pl-14 pr-6 text-base shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 sm:text-lg'
              : 'rounded-xl border-zinc-200 py-3 pl-11 pr-4 text-sm'
          }`}
          aria-label="Search services"
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setOpen(false);
              onSearchChange?.('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && debouncedQuery.trim() && (
        <div
          className="absolute left-0 right-0 z-50 mt-2 max-h-[400px] overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg
                className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600"
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
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                No services found -- try a different term
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
              </div>
              {grouped.map(({ category, items }) => (
                <div key={category?.id ?? 'unknown'}>
                  <div className="sticky top-0 border-b border-zinc-100 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {category?.name ?? 'Other'}
                    </span>
                  </div>
                  {items.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSelect(sub)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-sky-50 dark:hover:bg-sky-950/30"
                      role="option"
                      aria-selected={false}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {sub.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                            {sub.categoryName}
                          </span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                            ${sub.budgetRange.min.toLocaleString()} - ${sub.budgetRange.max.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                            {sub.typicalDuration}
                          </span>
                        </div>
                      </div>
                      <svg
                        className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
