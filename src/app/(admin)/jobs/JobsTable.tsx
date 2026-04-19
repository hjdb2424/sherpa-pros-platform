"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { AdminJob } from "./page";

const STATUS_TABS = ["All", "Open", "In Progress", "Completed", "Cancelled"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const tabMap: Record<StatusTab, string[]> = {
  All: [],
  Open: ["posted", "accepting_bids", "dispatching"],
  "In Progress": ["assigned", "in_progress"],
  Completed: ["completed", "reviewed", "closed"],
  Cancelled: ["cancelled"],
};

const statusColors: Record<string, string> = {
  draft: "bg-zinc-200 text-zinc-600",
  posted: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  accepting_bids: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  dispatching: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  assigned: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  reviewed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  closed: "bg-zinc-200 text-zinc-600",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

function fmtBudget(min: number | null, max: number | null): string {
  if (!min && !max) return "—";
  const fmt = (c: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(c / 100);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt((min ?? max)!);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function JobsTable({ jobs }: { jobs: AdminJob[] }) {
  const [tab, setTab] = useState<StatusTab>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const statuses = tabMap[tab];
    return jobs
      .filter((j) => !statuses.length || statuses.includes(j.status))
      .filter(
        (j) =>
          !q ||
          j.title.toLowerCase().includes(q) ||
          j.client.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
      );
  }, [jobs, tab, search]);

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-primary text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {t}
          </button>
        ))}

        <div className="relative ml-auto">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white py-1.5 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Bids</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((j) => (
              <tr key={j.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {j.title}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {j.client}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {j.category}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[j.status] ?? "bg-zinc-100 text-zinc-500"}`}
                  >
                    {j.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {fmtBudget(j.budget_min_cents, j.budget_max_cents)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {j.bids_count}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                  {fmtDate(j.created_at)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                      View
                    </button>
                    {!["completed", "cancelled", "closed", "reviewed"].includes(j.status) && (
                      <button className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-zinc-400">
                  No jobs match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
