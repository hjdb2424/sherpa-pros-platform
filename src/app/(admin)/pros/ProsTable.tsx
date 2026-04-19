"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { AdminPro } from "./page";

const STATUS_TABS = ["All", "Active", "Pending", "Suspended"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const statusFilter: Record<StatusTab, (p: AdminPro) => boolean> = {
  All: () => true,
  Active: (p) => p.onboarding_status === "active",
  Pending: (p) => p.onboarding_status === "pending_verification",
  Suspended: (p) => p.onboarding_status === "paused" || p.onboarding_status === "archived",
};

const badgeColors: Record<string, string> = {
  gold: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  silver: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  bronze: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  pending_verification: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  paused: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  archived: "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400",
};

export function ProsTable({ pros }: { pros: AdminPro[] }) {
  const [tab, setTab] = useState<StatusTab>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return pros
      .filter(statusFilter[tab])
      .filter(
        (p) =>
          !q ||
          p.display_name.toLowerCase().includes(q) ||
          p.trade.toLowerCase().includes(q) ||
          p.hub.toLowerCase().includes(q)
      );
  }, [pros, tab, search]);

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

        {/* Search */}
        <div className="relative ml-auto">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search pros..."
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Trade</th>
              <th className="px-4 py-3">Hub</th>
              <th className="px-4 py-3">Badge</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {p.display_name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {p.trade}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {p.hub}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badgeColors[p.badge_tier] ?? "bg-zinc-100 text-zinc-500"}`}
                  >
                    {p.badge_tier}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {p.rating_score.toFixed(1)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[p.onboarding_status] ?? "bg-zinc-100 text-zinc-500"}`}
                  >
                    {p.onboarding_status.replace("_", " ")}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  {p.verified ? (
                    <span className="text-emerald-500" title="Verified">&#10003;</span>
                  ) : (
                    <span className="text-zinc-300" title="Not verified">&mdash;</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                      View
                    </button>
                    {!p.verified && (
                      <button className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20">
                        Verify
                      </button>
                    )}
                    {p.onboarding_status === "active" && (
                      <button className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-zinc-400">
                  No pros match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
