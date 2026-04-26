"use client";

import { useEffect, useState, useCallback } from "react";
import type { AuditAction, AuditEntry } from "@/lib/audit";
import { ALL_AUDIT_ACTIONS } from "@/lib/audit";

// ── Action badge colors ─────────────────────────────────────────────

const ACTION_COLORS: Record<string, string> = {
  // Green — positive completions
  sign_in: "bg-emerald-100 text-emerald-700",
  pro_verified: "bg-emerald-100 text-emerald-700",
  job_completed: "bg-emerald-100 text-emerald-700",
  delivery_completed: "bg-emerald-100 text-emerald-700",
  access_granted: "bg-emerald-100 text-emerald-700",
  // Blue — creation / triggers
  job_created: "bg-blue-100 text-blue-700",
  material_approved: "bg-blue-100 text-blue-700",
  dispatch_triggered: "bg-blue-100 text-blue-700",
  multi_trade_created: "bg-blue-100 text-blue-700",
  job_assigned: "bg-blue-100 text-blue-700",
  // Orange — changes / in-progress
  role_change: "bg-orange-100 text-orange-700",
  subtype_change: "bg-orange-100 text-orange-700",
  material_ordered: "bg-orange-100 text-orange-700",
  delivery_requested: "bg-orange-100 text-orange-700",
  reward_redeemed: "bg-orange-100 text-orange-700",
  // Red — negative / revocations
  sign_out: "bg-red-100 text-red-700",
  pro_rejected: "bg-red-100 text-red-700",
  access_revoked: "bg-red-100 text-red-700",
};

// ── Helpers ──────────────────────────────────────────────────────────

function formatAction(action: string): string {
  return action.replace(/_/g, " ");
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

function absoluteTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTarget(entry: AuditEntry): string {
  if (!entry.targetType && !entry.targetId) return "--";
  const parts: string[] = [];
  if (entry.targetType) parts.push(entry.targetType);
  if (entry.targetId) parts.push(entry.targetId);
  return parts.join(" / ");
}

type DateRange = "1" | "7" | "30" | "all";

// ── Main Page ───────────────────────────────────────────────────────

export default function AuditLogsPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [actionFilter, setActionFilter] = useState<AuditAction | "">("");
  const [emailSearch, setEmailSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("7");

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 25;

  // Expanded row
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.set("action", actionFilter);
      if (emailSearch.trim()) params.set("email", emailSearch.trim());
      if (dateRange !== "all") params.set("days", dateRange);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/admin/logs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      const data = await res.json();
      setEntries(data.entries ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setError("Could not load audit logs");
    } finally {
      setLoading(false);
    }
  }, [actionFilter, emailSearch, dateRange, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [actionFilter, emailSearch, dateRange]);

  // ── Debounced email search ────────────────────────────────────────

  const [emailInput, setEmailInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setEmailSearch(emailInput), 300);
    return () => clearTimeout(timer);
  }, [emailInput]);

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Platform activity trail — {total} event{total !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Action dropdown */}
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value as AuditAction | "")}
          className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0] sm:w-52"
        >
          <option value="">All actions</option>
          {ALL_AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {formatAction(a)}
            </option>
          ))}
        </select>

        {/* Email search */}
        <input
          type="text"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Search by email or name..."
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0] sm:w-64"
        />

        {/* Date range */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
          className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0] sm:w-44"
        >
          <option value="1">Last 24 hours</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00a9e0] border-t-transparent" />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Desktop table (lg+) */}
      {!loading && !error && (
        <>
          {/* Desktop */}
          <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const isExpanded = expandedId === entry.id;
                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-zinc-50 transition ${i % 2 === 1 ? "bg-zinc-50/50" : "bg-white"} hover:bg-zinc-100/50`}
                    >
                      <td className="px-4 py-3 text-zinc-500" title={absoluteTime(entry.createdAt)}>
                        <span className="font-medium text-zinc-700">{relativeTime(entry.createdAt)}</span>
                        <br />
                        <span className="text-xs text-zinc-400">{absoluteTime(entry.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900">{entry.userName ?? "--"}</div>
                        <div className="text-xs text-zinc-400">{entry.email ?? "--"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ACTION_COLORS[entry.action] ?? "bg-zinc-100 text-zinc-600"}`}
                        >
                          {formatAction(entry.action)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 font-mono text-xs">
                        {formatTarget(entry)}
                      </td>
                      <td className="px-4 py-3">
                        {entry.metadata && Object.keys(entry.metadata).length > 0 ? (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                            className="rounded border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                          >
                            {isExpanded ? "Hide" : "View"}
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-400">--</span>
                        )}
                        {isExpanded && entry.metadata && (
                          <div className="mt-2 max-w-md rounded-lg bg-zinc-900 p-3 text-xs text-zinc-200">
                            <pre className="whitespace-pre-wrap break-all font-mono">
                              {JSON.stringify(entry.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">
                      No audit logs match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards (< lg) */}
          <div className="flex flex-col gap-3 lg:hidden">
            {entries.length === 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white px-4 py-12 text-center text-zinc-400">
                No audit logs match your filters
              </div>
            )}
            {entries.map((entry) => {
              const isExpanded = expandedId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ACTION_COLORS[entry.action] ?? "bg-zinc-100 text-zinc-600"}`}
                      >
                        {formatAction(entry.action)}
                      </span>
                      <div className="mt-2 text-sm font-medium text-zinc-900">
                        {entry.userName ?? "--"}
                      </div>
                      <div className="text-xs text-zinc-400">{entry.email ?? "--"}</div>
                    </div>
                    <div className="text-right text-xs text-zinc-400">
                      <div className="font-medium text-zinc-600">{relativeTime(entry.createdAt)}</div>
                      <div>{absoluteTime(entry.createdAt)}</div>
                    </div>
                  </div>

                  {(entry.targetType || entry.targetId) && (
                    <div className="mt-2 text-xs text-zinc-500 font-mono">
                      {formatTarget(entry)}
                    </div>
                  )}

                  {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                    <>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                        className="mt-2 rounded border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                      >
                        {isExpanded ? "Hide details" : "View details"}
                      </button>
                      {isExpanded && (
                        <div className="mt-2 rounded-lg bg-zinc-900 p-3 text-xs text-zinc-200">
                          <pre className="whitespace-pre-wrap break-all font-mono">
                            {JSON.stringify(entry.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-sm text-zinc-500">
                Page {page} of {totalPages} ({total} total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
