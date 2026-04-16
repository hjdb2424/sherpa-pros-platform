import { MapPinIcon } from '@heroicons/react/24/outline';

interface MapPlaceholderProps {
  onListView?: () => void;
  className?: string;
}

export default function MapPlaceholder({
  onListView,
  className = '',
}: MapPlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-sky-50 via-blue-50/30 to-slate-50 dark:from-zinc-900 dark:via-zinc-800/30 dark:to-zinc-900 ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00a9e0]/10">
        <MapPinIcon className="h-10 w-10 text-[#00a9e0]" />
      </div>

      <div className="text-center">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Map View
        </h3>
        <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-zinc-400">
          Add a Google Maps API key to enable the interactive map experience
        </p>
      </div>

      {onListView && (
        <button
          type="button"
          onClick={onListView}
          className="rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          View as List
        </button>
      )}
    </div>
  );
}
