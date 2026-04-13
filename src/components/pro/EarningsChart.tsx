import type { MonthlyEarning } from '@/lib/mock-data/pro-data';

interface EarningsChartProps {
  data: MonthlyEarning[];
}

export default function EarningsChart({ data }: EarningsChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Monthly Earnings</h3>

      <div className="flex items-end gap-2" style={{ height: 180 }} role="img" aria-label="Bar chart showing monthly earnings">
        {data.map((item) => {
          const heightPct = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
          return (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                ${(item.amount / 1000).toFixed(1)}k
              </span>
              <div className="relative w-full" style={{ height: 140 }}>
                <div
                  className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-700"
                  style={{ height: `${heightPct}%`, minHeight: heightPct > 0 ? 4 : 0 }}
                />
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
