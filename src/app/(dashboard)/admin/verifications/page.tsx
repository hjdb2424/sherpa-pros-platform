"use client";

import { useEffect, useState, useMemo } from "react";
import { getSkillLabels } from "@/lib/skills-catalog";

// ── Types ───────────────────────────────────────────────────────────

interface PhotoEntry {
  description: string;
}

interface ReferenceEntry {
  name: string;
  phone: string;
  relationship: string;
}

interface Verification {
  id: string;
  name: string;
  email: string;
  skills: string[];
  photos: PhotoEntry[];
  references: ReferenceEntry[];
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

// ── Helpers ─────────────────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status] ?? "bg-zinc-100 text-zinc-600"}`}
    >
      {status}
    </span>
  );
}

// ── Main Page ───────────────────────────────────────────────────────

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const [actionStatus, setActionStatus] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  // ── Fetch ───────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/verifications");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setVerifications(data.verifications ?? []);
      } catch {
        setError("Could not load verifications");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Filtered ───────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return verifications;
    return verifications.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q)
    );
  }, [verifications, search]);

  const pendingCount = verifications.filter((v) => v.status === "pending").length;

  // ── Actions ────────────────────────────────────────────────────

  async function handleAction(id: string, action: "approve" | "reject") {
    try {
      const res = await fetch("/api/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, notes: actionNotes[id] || "" }),
      });
      if (!res.ok) throw new Error("Failed");
      setActionStatus((prev) => ({ ...prev, [id]: action === "approve" ? "approved" : "rejected" }));
      setVerifications((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: action === "approve" ? "approved" : "rejected" } : v
        )
      );
    } catch {
      setActionStatus((prev) => ({ ...prev, [id]: "error" }));
    }
  }

  // ── Render ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00a9e0] border-t-transparent" />
      </div>
    );
  }

  if (error && verifications.length === 0) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Pro Verifications</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {pendingCount} pending review
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0] sm:max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Skills</th>
              <th className="px-4 py-3">Photos</th>
              <th className="px-4 py-3">References</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => {
              const isExpanded = expandedId === v.id;
              const skillLabels = getSkillLabels(v.skills);

              return (
                <tr key={v.id} className="group">
                  {/* Main row */}
                  <td
                    colSpan={7}
                    className="p-0"
                  >
                    <div
                      className={`grid cursor-pointer grid-cols-[1fr_1fr_80px_80px_80px_120px_100px] items-center border-b border-zinc-50 px-4 py-3 transition ${
                        i % 2 === 1 ? "bg-zinc-50/50" : "bg-white"
                      } hover:bg-zinc-100/50`}
                      onClick={() => setExpandedId(isExpanded ? null : v.id)}
                    >
                      <span className="font-medium text-zinc-900">{v.name}</span>
                      <span className="text-zinc-700">{v.email}</span>
                      <span className="text-zinc-600">{v.skills.length}</span>
                      <span className="text-zinc-600">{v.photos.length}</span>
                      <span className="text-zinc-600">{v.references.length}</span>
                      <span className="text-zinc-500">{fmtDate(v.submittedAt)}</span>
                      <span><StatusBadge status={actionStatus[v.id] || v.status} /></span>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-b border-zinc-200 bg-zinc-50/80 px-6 py-5">
                        <div className="grid gap-6 lg:grid-cols-3">
                          {/* Skills */}
                          <div>
                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                              Skills ({skillLabels.length})
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                              {skillLabels.map((label) => (
                                <span
                                  key={label}
                                  className="rounded-full border border-[#00a9e0]/20 bg-[#00a9e0]/10 px-2.5 py-0.5 text-xs font-medium text-[#00a9e0]"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Photos */}
                          <div>
                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                              Work Photos ({v.photos.length})
                            </h3>
                            <ul className="space-y-1.5">
                              {v.photos.map((p, pi) => (
                                <li
                                  key={pi}
                                  className="flex items-start gap-2 text-sm text-zinc-700"
                                >
                                  <span className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded bg-zinc-200 text-center text-[10px] font-bold leading-4 text-zinc-500">
                                    {pi + 1}
                                  </span>
                                  {p.description}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* References */}
                          <div>
                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                              References ({v.references.length})
                            </h3>
                            <ul className="space-y-2">
                              {v.references.map((r, ri) => (
                                <li key={ri} className="text-sm">
                                  <div className="font-medium text-zinc-900">{r.name}</div>
                                  <div className="text-zinc-500">
                                    {r.phone} &middot; {r.relationship}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Actions */}
                        {v.status === "pending" && !actionStatus[v.id] && (
                          <div className="mt-5 flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-end">
                            <div className="flex-1">
                              <label className="mb-1 block text-xs font-medium text-zinc-500">
                                Notes (optional)
                              </label>
                              <input
                                type="text"
                                value={actionNotes[v.id] || ""}
                                onChange={(e) =>
                                  setActionNotes((prev) => ({
                                    ...prev,
                                    [v.id]: e.target.value,
                                  }))
                                }
                                placeholder="Reason for approval/rejection..."
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(v.id, "approve");
                                }}
                                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                              >
                                Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(v.id, "reject");
                                }}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}

                        {actionStatus[v.id] === "approved" && (
                          <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                            Approved successfully
                          </div>
                        )}
                        {actionStatus[v.id] === "rejected" && (
                          <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                            Rejected
                          </div>
                        )}
                        {actionStatus[v.id] === "error" && (
                          <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                            Action failed — please try again
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  {search ? "No matching verifications" : "No pending verifications"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
