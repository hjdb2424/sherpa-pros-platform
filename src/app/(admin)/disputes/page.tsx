"use client";

import { useState } from "react";
import {
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

/* ---------- types ---------- */
interface Dispute {
  id: string;
  job_title: string;
  client: string;
  pro: string;
  amount_cents: number;
  reason: string;
  status: "open" | "under_review" | "resolved";
  opened_at: string;
}

/* ---------- mock ---------- */
const MOCK_DISPUTES: Dispute[] = [
  {
    id: "d1",
    job_title: "Drywall finishing",
    client: "Mike Johnson",
    pro: "Carlos Mendez",
    amount_cents: 75000,
    reason: "Quality not meeting expectations — visible seams and uneven texture on main wall.",
    status: "open",
    opened_at: "2026-04-13T14:30:00Z",
  },
  {
    id: "d2",
    job_title: "HVAC service call",
    client: "Brian Chen",
    pro: "Marcus Bell",
    amount_cents: 180000,
    reason: "Pro did not complete the job. Unit still not cooling after service visit.",
    status: "under_review",
    opened_at: "2026-04-11T09:15:00Z",
  },
  {
    id: "d3",
    job_title: "Deck staining",
    client: "Karen Lee",
    pro: "Devon Park",
    amount_cents: 120000,
    reason: "Job was marked complete but only 60% of deck surface was stained.",
    status: "open",
    opened_at: "2026-04-12T16:00:00Z",
  },
  {
    id: "d4",
    job_title: "Bathroom tile replacement",
    client: "Tom Harris",
    pro: "Lin Wu",
    amount_cents: 95000,
    reason: "Pro used different tile material than what was agreed upon in the bid.",
    status: "resolved",
    opened_at: "2026-04-08T10:00:00Z",
  },
];

/* ---------- helpers ---------- */
function fmtCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const disputeStatusColors: Record<string, string> = {
  open: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  under_review: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
};

const statusLabel: Record<string, string> = {
  open: "Open",
  under_review: "Under Review",
  resolved: "Resolved",
};

/* ---------- page ---------- */
export default function AdminDisputesPage() {
  const [disputes] = useState(MOCK_DISPUTES);

  const handleReview = (d: Dispute) => {
    alert(
      `Dispute: ${d.job_title}\n\nClient: ${d.client}\nPro: ${d.pro}\nAmount: ${fmtCents(d.amount_cents)}\n\nReason:\n${d.reason}\n\nStatus: ${statusLabel[d.status]}\nOpened: ${fmtDate(d.opened_at)}`
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Disputes
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {disputes.filter((d) => d.status !== "resolved").length} open disputes requiring attention
      </p>

      <div className="mt-6 space-y-4">
        {disputes.map((d) => (
          <div
            key={d.id}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              {/* Left */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {d.job_title}
                  </h3>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${disputeStatusColors[d.status]}`}
                  >
                    {statusLabel[d.status]}
                  </span>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {d.reason}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-500">
                  <span>
                    <strong className="text-zinc-700 dark:text-zinc-300">Client:</strong> {d.client}
                  </span>
                  <span>
                    <strong className="text-zinc-700 dark:text-zinc-300">Pro:</strong> {d.pro}
                  </span>
                  <span>
                    <strong className="text-zinc-700 dark:text-zinc-300">Amount:</strong> {fmtCents(d.amount_cents)}
                  </span>
                  <span>
                    <strong className="text-zinc-700 dark:text-zinc-300">Opened:</strong> {fmtDate(d.opened_at)}
                  </span>
                </div>
              </div>

              {/* Right */}
              {d.status !== "resolved" && (
                <button
                  onClick={() => handleReview(d)}
                  className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors"
                >
                  Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
