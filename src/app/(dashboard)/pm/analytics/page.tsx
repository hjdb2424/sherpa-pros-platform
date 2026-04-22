'use client';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const noiData = {
  grossRevenue: 25600,
  operatingExpenses: 8200,
  expenseBreakdown: [
    { label: 'Maintenance', amount: 5100 },
    { label: 'Utilities', amount: 1800 },
    { label: 'Insurance', amount: 1300 },
  ],
  noi: 17400,
  noiMargin: 68,
};

const noiTrend = [
  { month: 'Nov', noi: 16200 },
  { month: 'Dec', noi: 15800 },
  { month: 'Jan', noi: 16900 },
  { month: 'Feb', noi: 17100 },
  { month: 'Mar', noi: 17000 },
  { month: 'Apr', noi: 17400 },
];

const costPerUnit = {
  average: 47.12,
  benchmark: 43.80,
  byProperty: [
    { name: 'Maple Ridge', cost: 52.08 },
    { name: '220 Main St', cost: 45.33 },
    { name: 'Harbor View', cost: 37.50 },
    { name: 'Elm Street', cost: 25.00 },
  ],
};

const budgetVariance = {
  budget: 7500,
  actual: 8200,
  variance: 700,
  variancePct: 9.3,
};

const capexOpex = {
  opex: { amount: 6400, pct: 78 },
  capex: { amount: 1800, pct: 22 },
};

const vendorSpend = [
  { name: 'Mike Rodriguez', amount: 2340 },
  { name: 'Sarah Chen', amount: 1890 },
  { name: 'James Wilson', amount: 1560 },
  { name: 'Diana Brooks', amount: 1280 },
  { name: 'Carlos Rivera', amount: 1130 },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function fmt(n: number) {
  return '$' + n.toLocaleString();
}

/** Simple horizontal bar, all Tailwind (no chart library). */
function HBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-4 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
      <div
        className={`h-4 rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  const trendMax = Math.max(...noiTrend.map((d) => d.noi));
  const cpuMax = Math.max(...costPerUnit.byProperty.map((p) => p.cost));
  const vendorMax = Math.max(...vendorSpend.map((v) => v.amount));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Financial performance across your portfolio.
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* NOI Dashboard                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-5 text-lg font-semibold text-zinc-900 dark:text-white">Net Operating Income</h2>

        {/* Top metrics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Gross Revenue</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{fmt(noiData.grossRevenue)}<span className="text-xs font-normal text-zinc-500">/mo</span></p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Operating Expenses</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{fmt(noiData.operatingExpenses)}<span className="text-xs font-normal text-zinc-500">/mo</span></p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">NOI</p>
            <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(noiData.noi)}<span className="text-xs font-normal text-zinc-500">/mo</span></p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">NOI Margin</p>
            <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{noiData.noiMargin}%</p>
            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
              Healthy
            </span>
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Expense Breakdown</p>
          <div className="space-y-2">
            {noiData.expenseBreakdown.map((e) => (
              <div key={e.label} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-zinc-600 dark:text-zinc-400">{e.label}</span>
                <HBar value={e.amount} max={noiData.operatingExpenses} color="bg-[#00a9e0]" />
                <span className="w-16 shrink-0 text-right font-medium text-zinc-900 dark:text-white">{fmt(e.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* NOI Trend (bar chart) */}
        <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <p className="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">6-Month Trend</p>
          <div className="flex items-end gap-2" style={{ height: '120px' }}>
            {noiTrend.map((d) => {
              const heightPct = (d.noi / trendMax) * 100;
              return (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-zinc-900 dark:text-white">{fmt(d.noi / 1000)}k</span>
                  <div
                    className="w-full rounded-t-md bg-[#00a9e0] transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-zinc-500">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Two-column row                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Cost Per Unit */}
        <section className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-white">Cost Per Unit</h2>
          <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
            Portfolio avg: <span className="font-semibold text-zinc-900 dark:text-white">${costPerUnit.average}/unit/mo</span>
            <span className="ml-2 text-xs text-zinc-400">Industry avg: ${costPerUnit.benchmark}</span>
          </p>

          <div className="space-y-3">
            {costPerUnit.byProperty.map((p) => (
              <div key={p.name} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 text-zinc-600 dark:text-zinc-400">{p.name}</span>
                <div className="relative flex-1">
                  <HBar value={p.cost} max={cpuMax + 10} color={p.cost > costPerUnit.benchmark ? 'bg-amber-400' : 'bg-emerald-400'} />
                  {/* Benchmark line */}
                  <div
                    className="absolute top-0 h-full w-px border-l-2 border-dashed border-red-400"
                    style={{ left: `${(costPerUnit.benchmark / (cpuMax + 10)) * 100}%` }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right font-medium text-zinc-900 dark:text-white">${p.cost}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-zinc-400">Dashed line = industry benchmark (${costPerUnit.benchmark})</p>
        </section>

        {/* Budget Variance */}
        <section className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-lg font-semibold text-zinc-900 dark:text-white">Budget Variance</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Budget</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{fmt(budgetVariance.budget)}/mo</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Actual</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{fmt(budgetVariance.actual)}/mo</span>
            </div>
            <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Variance</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  +{fmt(budgetVariance.variance)} (+{budgetVariance.variancePct}%)
                </span>
              </div>
              <div className="mt-2 rounded-full bg-amber-50 px-3 py-1.5 text-center text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                Over budget -- review maintenance spend
              </div>
            </div>
          </div>

          {/* CapEx vs OpEx */}
          <div className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-800">
            <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">CapEx vs OpEx</h3>
            <div className="flex gap-2">
              <div
                className="flex items-center justify-center rounded-lg bg-[#00a9e0] py-3 text-xs font-bold text-white"
                style={{ width: `${capexOpex.opex.pct}%` }}
              >
                OpEx {capexOpex.opex.pct}%
              </div>
              <div
                className="flex items-center justify-center rounded-lg bg-[#ff4500] py-3 text-xs font-bold text-white"
                style={{ width: `${capexOpex.capex.pct}%` }}
              >
                CapEx {capexOpex.capex.pct}%
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>{fmt(capexOpex.opex.amount)} operating</span>
              <span>{fmt(capexOpex.capex.amount)} capital</span>
            </div>
          </div>
        </section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Vendor Spend                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-5 text-lg font-semibold text-zinc-900 dark:text-white">Vendor Spend (MTD)</h2>
        <div className="space-y-3">
          {vendorSpend.map((v, i) => (
            <div key={v.name} className="flex items-center gap-3 text-sm">
              <span className="w-5 shrink-0 text-xs font-bold text-zinc-400">{i + 1}</span>
              <span className="w-32 shrink-0 font-medium text-zinc-900 dark:text-white">{v.name}</span>
              <HBar value={v.amount} max={vendorMax + 200} color="bg-[#00a9e0]" />
              <span className="w-16 shrink-0 text-right font-semibold text-zinc-900 dark:text-white">{fmt(v.amount)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
