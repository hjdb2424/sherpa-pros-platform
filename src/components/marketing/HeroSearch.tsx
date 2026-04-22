'use client';

import GlobalSearch from '@/components/search/GlobalSearch';

export default function HeroSearch() {
  return (
    <section className="bg-gradient-to-b from-zinc-50 to-white px-4 pb-16 dark:from-zinc-950 dark:to-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Search 37 categories with 150+ verified services
        </p>
        <GlobalSearch
          variant="hero"
          placeholder="What do you need help with?"
        />
      </div>
    </section>
  );
}
