'use client';

import { useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtDollars(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString('en-US')}.${String(remainder).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Mock data for tax-year summary                                      */
/* ------------------------------------------------------------------ */

const taxYear = 2025;

const incomeSummaryCents = 18_450_000; // $184,500 total income
const expenseSummaryCents = 7_280_000; // $72,800 total expenses
const netProfitCents = incomeSummaryCents - expenseSummaryCents;

// Self-employment tax: 15.3% x 92.35% of net
const seTaxRate = 0.153 * 0.9235;
const seTaxCents = Math.round(netProfitCents * seTaxRate);

// Estimated income tax (22% bracket for illustration)
const incomeTaxRate = 0.22;
const incomeTaxCents = Math.round(netProfitCents * incomeTaxRate);
const totalEstimatedTaxCents = seTaxCents + incomeTaxCents;

/* Schedule C line items */
const scheduleCLines = [
  { line: '1', description: 'Gross receipts or sales', amountCents: incomeSummaryCents },
  { line: '7', description: 'Gross income', amountCents: incomeSummaryCents },
  { line: '9', description: 'Car and truck expenses', amountCents: 1_120_000 },
  { line: '10', description: 'Commissions and fees', amountCents: 460_000 },
  { line: '11', description: 'Contract labor', amountCents: 1_850_000 },
  { line: '15', description: 'Insurance (other than health)', amountCents: 380_000 },
  { line: '17', description: 'Legal and professional services', amountCents: 250_000 },
  { line: '18', description: 'Office expense', amountCents: 180_000 },
  { line: '22', description: 'Supplies', amountCents: 2_340_000 },
  { line: '24a', description: 'Travel', amountCents: 320_000 },
  { line: '27', description: 'Other expenses (tools, etc.)', amountCents: 380_000 },
  { line: '28', description: 'Total deductions', amountCents: expenseSummaryCents },
  { line: '31', description: 'Net profit (or loss)', amountCents: netProfitCents },
];

/* Mileage */
const totalMiles = 12_480;
const mileageRate = 67; // $0.67/mile in cents
const mileageDeductionCents = totalMiles * mileageRate;

/* 1099s received */
const received1099s = [
  { payer: 'Sherpa Property Mgmt LLC', amountCents: 8_200_000 },
  { payer: 'ABC General Contracting', amountCents: 6_100_000 },
  { payer: 'HomeServe Partners', amountCents: 4_150_000 },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function TaxPackageGenerator() {
  const [exported, setExported] = useState<string | null>(null);

  const handleExport = useCallback((target: string) => {
    setExported(target);
    setTimeout(() => setExported(null), 3000);
  }, []);

  const handleEmailCPA = useCallback(() => {
    const subject = encodeURIComponent(`Tax Package — ${taxYear} — Self-Employed Pro`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease find my ${taxYear} tax summary below:\n\n` +
      `Total Income: ${fmtDollars(incomeSummaryCents)}\n` +
      `Total Expenses: ${fmtDollars(expenseSummaryCents)}\n` +
      `Net Profit: ${fmtDollars(netProfitCents)}\n` +
      `Estimated Tax: ${fmtDollars(totalEstimatedTaxCents)}\n\n` +
      `Mileage: ${totalMiles.toLocaleString()} miles (${fmtDollars(mileageDeductionCents)} deduction)\n\n` +
      `1099-NECs received: ${received1099s.length}\n\n` +
      `Full details attached.\n\nBest regards`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Income', value: fmtDollars(incomeSummaryCents), color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total Expenses', value: fmtDollars(expenseSummaryCents), color: 'text-red-600 dark:text-red-400' },
          { label: 'Net Profit', value: fmtDollars(netProfitCents), color: 'text-[#00a9e0]' },
          { label: 'Estimated Tax', value: fmtDollars(totalEstimatedTaxCents), color: 'text-amber-600 dark:text-amber-400' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Schedule C preview */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Schedule C Preview</h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Profit or Loss From Business (Sole Proprietorship)</p>
        </div>
        <div className="overflow-x-auto px-6 py-4">
          <table className="w-full text-sm" role="table" aria-label="Schedule C line items">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Line</th>
                <th className="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Description</th>
                <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              {scheduleCLines.map((row) => {
                const isTotal = row.line === '28' || row.line === '31';
                const isIncome = row.line === '1' || row.line === '7';
                return (
                  <tr
                    key={row.line}
                    className={`border-b border-zinc-50 dark:border-zinc-800/50 ${
                      isTotal ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''
                    }`}
                  >
                    <td className="py-2 pr-3 font-mono text-xs text-zinc-400">{row.line}</td>
                    <td className={`py-2 pr-3 ${isTotal ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {row.description}
                    </td>
                    <td className={`py-2 text-right font-mono tabular-nums ${
                      isTotal
                        ? 'font-bold text-zinc-900 dark:text-white'
                        : isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {fmtDollars(row.amountCents)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mileage + 1099s side-by-side */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mileage summary */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Mileage Summary</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Business Miles</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white">{totalMiles.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">IRS Rate ({taxYear})</span>
              <span className="font-mono text-zinc-600 dark:text-zinc-400">$0.67/mile</span>
            </div>
            <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-zinc-900 dark:text-white">Total Deduction</span>
                <span className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">{fmtDollars(mileageDeductionCents)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1099s received */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">1099-NECs Received</h3>
          <div className="mt-4 space-y-3">
            {received1099s.map((f) => (
              <div key={f.payer} className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{f.payer}</span>
                <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{fmtDollars(f.amountCents)}</span>
              </div>
            ))}
            <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-zinc-900 dark:text-white">Total 1099 Income</span>
                <span className="font-mono text-lg font-bold text-zinc-900 dark:text-white">
                  {fmtDollars(received1099s.reduce((s, f) => s + f.amountCents, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export actions */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">Export Tax Package</h3>

        {exported && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Tax package exported to {exported} successfully.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-2 rounded-lg bg-[#00a9e0] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0090c0]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Generate PDF
          </button>
          <button
            type="button"
            onClick={() => handleExport('QuickBooks')}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Export to QuickBooks
          </button>
          <button
            type="button"
            onClick={() => handleExport('TurboTax (.txf)')}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export to TurboTax
          </button>
          <button
            type="button"
            onClick={handleEmailCPA}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Email to CPA
          </button>
        </div>
      </div>
    </div>
  );
}
