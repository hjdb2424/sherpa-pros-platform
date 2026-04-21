'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SocialPhoto, SocialPlatform } from '@/lib/services/social-sync';
import { PlatformBadge } from './PlatformIcons';

type FilterTab = 'all' | 'recent' | 'most-liked';

interface PhotoImporterProps {
  platform: SocialPlatform;
}

export default function PhotoImporter({ platform }: PhotoImporterProps) {
  const [photos, setPhotos] = useState<SocialPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [toast, setToast] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/social/photos?platform=${platform}`);
      const data = await res.json();
      setPhotos(data.photos ?? []);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }, [platform]);

  useEffect(() => {
    fetchPhotos();
    setSelected(new Set());
    setFilter('all');
  }, [fetchPhotos]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filteredPhotos = (() => {
    const sorted = [...photos];
    switch (filter) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      case 'most-liked':
        return sorted.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
      default:
        return sorted;
    }
  })();

  const selectablePhotos = filteredPhotos.filter((p) => !p.imported);

  const handleToggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelected(new Set(selectablePhotos.map((p) => p.id)));
  };

  const handleDeselectAll = () => {
    setSelected(new Set());
  };

  const handleImport = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    try {
      const res = await fetch('/api/social/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (data.success) {
        setToast(`Imported ${data.imported} photo${data.imported !== 1 ? 's' : ''} to portfolio`);
        setSelected(new Set());
        await fetchPhotos();
      }
    } catch {
      setToast('Import failed. Try again.');
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 py-12 text-center dark:border-zinc-700">
        <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">No photos found on this platform.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter tabs */}
        <div className="flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
          {(['all', 'recent', 'most-liked'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === tab
                  ? 'bg-[#00a9e0] text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'recent' ? 'Recent' : 'Most Liked'}
            </button>
          ))}
        </div>

        {/* Selection controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs font-medium text-[#00a9e0] transition-colors hover:text-[#0098ca]"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Deselect All
          </button>
          {selected.size > 0 && (
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              {selected.size} selected
            </span>
          )}
        </div>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filteredPhotos.map((photo) => {
          const isSelected = selected.has(photo.id);
          const isImported = photo.imported;

          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => !isImported && handleToggle(photo.id)}
              disabled={isImported}
              className={`group relative aspect-square overflow-hidden rounded-lg transition-all ${
                isImported
                  ? 'opacity-60 cursor-default'
                  : isSelected
                    ? 'ring-2 ring-[#00a9e0] ring-offset-2 dark:ring-offset-zinc-900'
                    : 'hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.thumbnailUrl}
                alt={photo.caption ?? 'Social photo'}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Checkbox overlay */}
              {!isImported && (
                <div className={`absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected
                    ? 'border-[#00a9e0] bg-[#00a9e0]'
                    : 'border-white/80 bg-black/30'
                }`}>
                  {isSelected && (
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              )}

              {/* Imported badge */}
              {isImported && (
                <div className="absolute top-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Imported
                </div>
              )}

              {/* Caption + likes overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 pt-8">
                {photo.caption && (
                  <p className="truncate text-xs font-medium text-white">{photo.caption}</p>
                )}
                <div className="mt-0.5 flex items-center gap-2">
                  <PlatformBadge platform={photo.platform} />
                  {photo.likes != null && (
                    <span className="text-[10px] text-white/70">{photo.likes} likes</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Import button */}
      {selected.size > 0 && (
        <div className="sticky bottom-16 z-30 flex justify-center lg:bottom-4">
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="rounded-full bg-[#00a9e0] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#0098ca] hover:shadow-xl disabled:opacity-50"
          >
            {importing
              ? 'Importing...'
              : `Import ${selected.size} Photo${selected.size !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 bottom-20 z-50 animate-fade-slide-up rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900 lg:bottom-4">
          {toast}
        </div>
      )}
    </div>
  );
}
