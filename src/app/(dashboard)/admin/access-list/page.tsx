"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

// ── Types ───────────────────────────────────────────────────────────

interface Entry {
  id: number;
  email: string;
  name: string;
  defaultRole: string | null;
  status: string;
  invitedBy: string | null;
  notes: string;
  createdAt: string | null;
  lastSignIn: string | null;
}

type SortKey = "name" | "email" | "defaultRole" | "createdAt" | "lastSignIn";
type SortDir = "asc" | "desc";

// ── Helpers ─────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  pm: "bg-purple-100 text-purple-700",
  pro: "bg-orange-100 text-orange-700",
  client: "bg-blue-100 text-blue-700",
  tenant: "bg-teal-100 text-teal-700",
};

function RoleBadge({ role }: { role: string | null }) {
  if (!role) return <span className="text-xs text-zinc-400">--</span>;
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${ROLE_COLORS[role] ?? "bg-zinc-100 text-zinc-600"}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
    >
      {active ? "Active" : "Revoked"}
    </span>
  );
}

function fmtDate(d: string | null) {
  if (!d) return "--";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Main Page ───────────────────────────────────────────────────────

export default function AccessListPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [readonly, setReadonly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search / sort
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [addError, setAddError] = useState("");

  // Inline edit
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // ── Fetch ───────────────────────────────────────────────────────

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/access-list");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(data.entries ?? []);
      setReadonly(!!data.readonly);
    } catch {
      setError("Could not load access list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // ── Counts ──────────────────────────────────────────────────────

  const activeCount = useMemo(
    () => entries.filter((e) => e.status === "active").length,
    [entries]
  );
  const revokedCount = useMemo(
    () => entries.filter((e) => e.status === "revoked").length,
    [entries]
  );

  // ── Filtered + sorted ──────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = entries;
    if (q) {
      list = list.filter(
        (e) =>
          e.email.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          (e.defaultRole ?? "").toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      const av = (a[sortKey] ?? "") as string;
      const bv = (b[sortKey] ?? "") as string;
      const cmp = av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [entries, search, sortKey, sortDir]);

  // ── Sort toggle ────────────────────────────────────────────────

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u25B2" : " \u25BC";
  }

  // ── Add entry ──────────────────────────────────────────────────

  async function handleAdd() {
    setAddError("");
    if (!addEmail.includes("@")) {
      setAddError("Valid email required");
      return;
    }
    try {
      const res = await fetch("/api/admin/access-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: addEmail,
          name: addName,
          defaultRole: addRole || null,
          notes: addNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error ?? "Failed");
        return;
      }
      setShowAdd(false);
      setAddEmail("");
      setAddName("");
      setAddRole("");
      setAddNotes("");
      fetchEntries();
    } catch {
      setAddError("Network error");
    }
  }

  // ── Toggle revoke / restore ────────────────────────────────────

  async function toggleStatus(entry: Entry) {
    const newStatus = entry.status === "active" ? "revoked" : "active";
    if (newStatus === "revoked") {
      await fetch("/api/admin/access-list", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: entry.email }),
      });
    } else {
      await fetch("/api/admin/access-list", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: entry.email, status: "active" }),
      });
    }
    fetchEntries();
  }

  // ── Save inline edit ───────────────────────────────────────────

  async function saveEdit(entry: Entry) {
    await fetch("/api/admin/access-list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: entry.email,
        name: editName,
        defaultRole: editRole || null,
        notes: editNotes,
      }),
    });
    setEditId(null);
    fetchEntries();
  }

  function startEdit(entry: Entry) {
    setEditId(entry.id);
    setEditName(entry.name);
    setEditRole(entry.defaultRole ?? "");
    setEditNotes(entry.notes);
  }

  // ── Render ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00a9e0] border-t-transparent" />
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className="p-8 text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Access List</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {activeCount} active{revokedCount > 0 ? `, ${revokedCount} revoked` : ""}
            {readonly && (
              <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                Read-only (DB offline)
              </span>
            )}
          </p>
        </div>
        {!readonly && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#00a9e0] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0090c0]"
          >
            <span className="text-lg leading-none">+</span> Add User
          </button>
        )}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-700">Add New User</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Email *</label>
              <input
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Name</label>
              <input
                type="text"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Default Role</label>
              <select
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
              >
                <option value="">None (choose on sign-in)</option>
                <option value="pm">PM</option>
                <option value="pro">Pro</option>
                <option value="client">Client</option>
                <option value="tenant">Tenant</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Notes</label>
              <input
                type="text"
                value={addNotes}
                onChange={(e) => setAddNotes(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
                placeholder="Optional notes"
              />
            </div>
          </div>
          {addError && <p className="mt-2 text-sm text-red-500">{addError}</p>}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAdd}
              className="rounded-lg bg-[#00a9e0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0090c0]"
            >
              Add to List
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search / filter */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email, name, or role..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0] sm:max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <th
                className="cursor-pointer px-4 py-3 hover:text-zinc-700"
                onClick={() => toggleSort("email")}
              >
                Email{sortIcon("email")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-zinc-700"
                onClick={() => toggleSort("name")}
              >
                Name{sortIcon("name")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-zinc-700"
                onClick={() => toggleSort("defaultRole")}
              >
                Role{sortIcon("defaultRole")}
              </th>
              <th className="px-4 py-3">Status</th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-zinc-700"
                onClick={() => toggleSort("lastSignIn")}
              >
                Last Sign-in{sortIcon("lastSignIn")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-zinc-700"
                onClick={() => toggleSort("createdAt")}
              >
                Created{sortIcon("createdAt")}
              </th>
              {!readonly && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => {
              const isEditing = editId === entry.id;
              return (
                <tr
                  key={entry.id}
                  className={`border-b border-zinc-50 transition ${i % 2 === 1 ? "bg-zinc-50/50" : "bg-white"} hover:bg-zinc-100/50`}
                >
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {entry.email}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {isEditing ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
                      />
                    ) : (
                      entry.name || "--"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="rounded border border-zinc-300 px-2 py-1 text-sm"
                      >
                        <option value="">None</option>
                        <option value="pm">PM</option>
                        <option value="pro">Pro</option>
                        <option value="client">Client</option>
                        <option value="tenant">Tenant</option>
                      </select>
                    ) : (
                      <RoleBadge role={entry.defaultRole} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {fmtDate(entry.lastSignIn)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {fmtDate(entry.createdAt)}
                  </td>
                  {!readonly && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(entry)}
                              className="rounded bg-[#00a9e0] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#0090c0]"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="rounded border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(entry)}
                              className="rounded border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleStatus(entry)}
                              className={`rounded px-2.5 py-1 text-xs font-medium text-white ${
                                entry.status === "active"
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-emerald-500 hover:bg-emerald-600"
                              }`}
                            >
                              {entry.status === "active" ? "Revoke" : "Restore"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={readonly ? 6 : 7}
                  className="px-4 py-8 text-center text-zinc-400"
                >
                  {search ? "No matching entries" : "No entries yet"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notes inline edit */}
      {editId !== null && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Notes for editing entry
          </label>
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
            placeholder="Add notes..."
          />
        </div>
      )}
    </div>
  );
}
