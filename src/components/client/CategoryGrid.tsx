'use client';

import { useState, useMemo } from 'react';
import { JOB_CATEGORIES, type JobCategory } from '@/lib/mock-data/client-data';
import { getCategoryConfidence, getCategoryWisemanSource } from '@/lib/config/service-catalog';

interface CategoryGridProps {
  selected: string | null;
  onSelect: (category: JobCategory) => void;
}

export function CategoryGrid({ selected, onSelect }: CategoryGridProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return JOB_CATEGORIES;
    const q = search.toLowerCase();
    return JOB_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-4">
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
          placeholder="Search categories... (e.g. plumbing, painting, deck)"
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/10 focus-visible:ring-[#00a9e0]"
          aria-label="Search job categories"
        />
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="text-sm text-zinc-500">
            No categories match &ldquo;{search}&rdquo;. Try a different search term.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((category) => {
          const isSelected = selected === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category)}
              className={`flex min-h-[44px] flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-[#00a9e0] bg-sky-50 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-[#00a9e0]/30 hover:bg-sky-50/30'
              }`}
              aria-pressed={isSelected}
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {category.icon}
              </span>
              <span
                className={`text-sm font-semibold ${
                  isSelected ? 'text-[#00a9e0]' : 'text-zinc-800'
                }`}
              >
                {category.name}
              </span>
              <span className="text-[11px] leading-tight text-zinc-400">
                {category.description}
              </span>
              <WisemanBadge categoryId={category.id} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WisemanBadge({ categoryId }: { categoryId: string }) {
  const confidence = getCategoryConfidence(categoryId);
  const source = getCategoryWisemanSource(categoryId);

  if (confidence === 0) return null;

  return (
    <span
      className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      title={`Validated by ${source} with ${confidence}% confidence`}
    >
      <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-1.257-1.257 3 3 0 01-5.304 0 3 3 0 00-1.257 1.257 3 3 0 010 5.304 3 3 0 001.257 1.257 3 3 0 015.304 0 3 3 0 001.257-1.257zM12.002 14a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
      {confidence}% Verified
    </span>
  );
}
