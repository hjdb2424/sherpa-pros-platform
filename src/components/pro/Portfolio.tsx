'use client';

import { useState, useCallback, useEffect } from 'react';

interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

interface PortfolioProps {
  editable?: boolean;
}

export default function Portfolio({ editable = false }: PortfolioProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        setItems(data.items ?? []);
      } catch {
        // Use empty array on error
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  const handleAddPhoto = useCallback(async () => {
    // Mock upload — add a new random photo
    const newId = `photo-${Date.now()}`;
    const randomSeed = Math.floor(Math.random() * 1000);
    const newItem: PortfolioItem = {
      id: newId,
      imageUrl: `https://picsum.photos/400/300?random=${randomSeed}`,
      title: 'New Project Photo',
      description: 'Added via portfolio upload',
    };

    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch {
      // Mock save — continue anyway
    }

    setItems((prev) => [...prev, newItem]);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-700"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="p-3">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 text-xs text-white/80">{item.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Photo button */}
        {editable && (
          <button
            type="button"
            onClick={handleAddPhoto}
            className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 text-zinc-400 transition-colors hover:border-[#00a9e0] hover:text-[#00a9e0] dark:border-zinc-600 dark:hover:border-[#00a9e0]"
            aria-label="Add photo to portfolio"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        )}
      </div>

      {items.length === 0 && !editable && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 py-12 text-center dark:border-zinc-700">
          <svg
            className="h-10 w-10 text-zinc-300 dark:text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">No portfolio photos yet.</p>
        </div>
      )}
    </div>
  );
}
