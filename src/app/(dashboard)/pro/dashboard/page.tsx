import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Dashboard",
};

export default function ProDashboardPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Pro Dashboard
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Overview of active jobs, earnings, ratings, and incoming dispatch
        requests.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Active Jobs", "Pending Requests", "This Week Earnings", "Rating"].map(
          (label) => (
            <div
              key={label}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-sm font-medium text-zinc-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                --
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
