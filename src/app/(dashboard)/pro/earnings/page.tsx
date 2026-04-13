import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earnings",
};

export default function ProEarningsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Earnings
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Track your income, view payment history, and manage payout settings.
      </p>
      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500">
          Earnings chart, payment history table, payout method settings
        </p>
      </div>
    </div>
  );
}
