'use client';

import { useState, useMemo } from 'react';
import { JOB_CATEGORIES, type JobCategory } from '@/lib/mock-data/client-data';

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
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
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
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                isSelected
                  ? 'border-amber-400 bg-amber-50 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-amber-200 hover:bg-amber-50/30'
              }`}
              aria-pressed={isSelected}
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {category.icon}
              </span>
              <span
                className={`text-sm font-semibold ${
                  isSelected ? 'text-amber-700' : 'text-zinc-800'
                }`}
              >
                {category.name}
              </span>
              <span className="text-[11px] leading-tight text-zinc-400">
                {category.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
