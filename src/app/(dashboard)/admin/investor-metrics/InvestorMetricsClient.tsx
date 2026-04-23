"use client";

/**
 * Client-side interactive bits for the investor metrics dashboard.
 * Kept tiny so the rest of the page stays as a Server Component.
 */

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function InvestorMetricsClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
      setLastRefresh(new Date().toISOString().slice(11, 16) + " UTC");
    });
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
      aria-label="Refresh dashboard data"
    >
      <svg
        className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h5M20 20v-5h-5M5.5 9A7 7 0 0118.5 9M18.5 15A7 7 0 015.5 15"
        />
      </svg>
      {isPending ? "Refreshing…" : lastRefresh ? `Refreshed ${lastRefresh}` : "Refresh"}
    </button>
  );
}
