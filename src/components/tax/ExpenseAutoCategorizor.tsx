'use client';

import { useState, useMemo, useCallback } from 'react';
import ReceiptScanner from '@/components/ocr/ReceiptScanner';
import type { ReceiptResult } from '@/lib/services/ocr-service';

/* ------------------------------------------------------------------ */
/* Category rules                                                      */
/* ------------------------------------------------------------------ */

interface CategoryRule {
  category: string;
  scheduleCLine: string;
  lineLabel: string;
  keywords: string[];
  color: string;
}

const rules: CategoryRule[] = [
  {
    category: 'Supplies',
    scheduleCLine: '22',
    lineLabel: 'Supplies',
    keywords: ['home depot', 'lowes', 'lumber', 'pipe', 'plywood', 'drywall', 'screw', 'nail', 'wire', 'cement', 'mortar', 'tile', 'grout', 'caulk', 'adhesive', 'hardware'],
    color: 'bg-amber-500',
  },
  {
    category: 'Vehicle',
    scheduleCLine: '9',
    lineLabel: 'Car and truck expenses',
    keywords: ['gas', 'fuel', 'exxon', 'shell', 'bp', 'sunoco', 'chevron', 'diesel', 'oil change', 'car wash', 'tire', 'auto repair', 'jiffy lube'],
    color: 'bg-sky-500',
  },
  {
    category: 'Commissions',
    scheduleCLine: '10',
    lineLabel: 'Commissions and fees',
    keywords: ['sherpa', 'commission', 'platform fee', 'referral fee', 'booking fee', 'service fee'],
    color: 'bg-violet-500',
  },
  {
    category: 'Insurance',
    scheduleCLine: '15',
    lineLabel: 'Insurance (other than health)',
    keywords: ['state farm', 'geico', 'insurance', 'allstate', 'progressive', 'liberty mutual', 'usaa', 'farmers', 'liability', 'workers comp'],
    color: 'bg-emerald-500',
  },
  {
    category: 'Tools & Equipment',
    scheduleCLine: '27',
    lineLabel: 'Other expenses',
    keywords: ['milwaukee', 'dewalt', 'drill', 'saw', 'makita', 'bosch', 'ridgid', 'ryobi', 'tool', 'compressor', 'ladder', 'generator', 'scaffolding'],
    color: 'bg-red-500',
  },
  {
    category: 'Contract Labor',
    scheduleCLine: '11',
    lineLabel: 'Contract labor',
    keywords: ['subcontractor', 'helper', 'labor', 'day labor', 'temp worker', 'crew', 'assistant'],
    color: 'bg-orange-500',
  },
  {
    category: 'Office Expense',
    scheduleCLine: '18',
    lineLabel: 'Office expense',
    keywords: ['office', 'staples', 'printer', 'ink', 'paper', 'quickbooks', 'software', 'subscription', 'adobe', 'microsoft'],
    color: 'bg-zinc-500',
  },
  {
    category: 'Travel',
    scheduleCLine: '24a',
    lineLabel: 'Travel',
    keywords: ['hotel', 'motel', 'airfare', 'flight', 'uber', 'lyft', 'rental car', 'parking', 'toll'],
    color: 'bg-pink-500',
  },
];

function matchCategory(description: string): CategoryRule | null {
  const lower = description.toLowerCase();
  for (const rule of rules) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) return rule;
    }
  }
  return null;
}

function fmtDollars(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  return `$${dollars.toLocaleString('en-US')}.${String(remainder).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

interface LoggedExpense {
  id: string;
  description: string;
  amountCents: number;
  date: string;
  category: string;
  scheduleCLine: string;
  lineLabel: string;
}

export default function ExpenseAutoCategorizor() {
  const [showScanner, setShowScanner] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [overrideCategory, setOverrideCategory] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<LoggedExpense[]>([
    { id: '1', description: 'Home Depot - lumber and screws', amountCents: 28_750, date: '2026-04-10', category: 'Supplies', scheduleCLine: '22', lineLabel: 'Supplies' },
    { id: '2', description: 'Shell gas station', amountCents: 6_500, date: '2026-04-09', category: 'Vehicle', scheduleCLine: '9', lineLabel: 'Car and truck expenses' },
    { id: '3', description: 'DeWalt impact driver', amountCents: 19_900, date: '2026-04-08', category: 'Tools & Equipment', scheduleCLine: '27', lineLabel: 'Other expenses' },
    { id: '4', description: 'Sherpa platform fee', amountCents: 4_500, date: '2026-04-07', category: 'Commissions', scheduleCLine: '10', lineLabel: 'Commissions and fees' },
  ]);

  const suggestion = useMemo(() => {
    if (!description.trim()) return null;
    return matchCategory(description);
  }, [description]);

  const activeCategory = overrideCategory
    ? rules.find((r) => r.category === overrideCategory) ?? null
    : suggestion;

  const handleAddExpense = useCallback(() => {
    if (!description.trim() || !amount.trim()) return;
    const amountCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountCents) || amountCents <= 0) return;

    const cat = activeCategory;
    const newExpense: LoggedExpense = {
      id: Date.now().toString(),
      description: description.trim(),
      amountCents,
      date: new Date().toISOString().split('T')[0],
      category: cat?.category ?? 'Uncategorized',
      scheduleCLine: cat?.scheduleCLine ?? '-',
      lineLabel: cat?.lineLabel ?? 'Not mapped',
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setDescription('');
    setAmount('');
    setOverrideCategory(null);
  }, [description, amount, activeCategory]);

  const totalCents = expenses.reduce((s, e) => s + e.amountCents, 0);

  const handleReceiptScanned = useCallback((data: ReceiptResult) => {
    const newExpense: LoggedExpense = {
      id: Date.now().toString(),
      description: `${data.vendor} - ${data.items.map((i) => i.description).join(', ')}`,
      amountCents: data.total,
      date: data.date,
      category: matchCategory(data.vendor)?.category ?? 'Supplies',
      scheduleCLine: matchCategory(data.vendor)?.scheduleCLine ?? '22',
      lineLabel: matchCategory(data.vendor)?.lineLabel ?? 'Supplies',
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setShowScanner(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Receipt Scanner Modal */}
      {showScanner && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <ReceiptScanner onAddExpense={handleReceiptScanned} onClose={() => setShowScanner(false)} />
        </div>
      )}

      {/* Input form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Add Expense</h3>
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#00a9e0]/10 px-3 py-1.5 text-xs font-bold text-[#00a9e0] transition-colors hover:bg-[#00a9e0]/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
            </svg>
            Scan Receipt
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Description */}
          <div>
            <label htmlFor="expense-desc" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <input
              id="expense-desc"
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setOverrideCategory(null);
              }}
              placeholder="e.g. Home Depot lumber purchase"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:ring-1 focus:ring-[#00a9e0] focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="expense-amount" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Amount ($)
            </label>
            <input
              id="expense-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:ring-1 focus:ring-[#00a9e0] focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Auto-suggestion */}
        {description.trim() && (
          <div className="mt-4">
            {activeCategory ? (
              <div className="flex items-start gap-3 rounded-lg border border-[#00a9e0]/30 bg-[#00a9e0]/5 p-3 dark:border-[#00a9e0]/20 dark:bg-[#00a9e0]/10">
                <div className={`mt-0.5 h-3 w-3 shrink-0 rounded-sm ${activeCategory.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    Suggested: <span className="font-bold">{activeCategory.category}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    This will appear on Schedule C, Line {activeCategory.scheduleCLine} ({activeCategory.lineLabel})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOverrideCategory(null)}
                  className="text-xs text-[#00a9e0] hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  No category match found. Select one below:
                </p>
              </div>
            )}

            {/* Override / manual selection */}
            {(!activeCategory || overrideCategory === null) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {rules.map((r) => (
                  <button
                    key={r.category}
                    type="button"
                    onClick={() => setOverrideCategory(r.category)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      overrideCategory === r.category
                        ? 'border-[#00a9e0] bg-[#00a9e0]/10 text-[#00a9e0]'
                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${r.color}`} />
                    {r.category}
                    <span className="text-zinc-400 dark:text-zinc-500">L{r.scheduleCLine}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddExpense}
          disabled={!description.trim() || !amount.trim()}
          className="mt-4 flex items-center gap-2 rounded-lg bg-[#00a9e0] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0090c0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Expense
        </button>
      </div>

      {/* Logged expenses */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Recent Expenses</h3>
          <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{fmtDollars(totalCents)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Logged expenses">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Description</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Category</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Schedule C</th>
                <th className="px-6 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => {
                const rule = rules.find((r) => r.category === e.category);
                return (
                  <tr key={e.id} className="border-b border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-3 text-xs text-zinc-500 dark:text-zinc-400">{e.date}</td>
                    <td className="px-3 py-3 font-medium text-zinc-900 dark:text-white">{e.description}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        <span className={`h-2 w-2 rounded-full ${rule?.color ?? 'bg-zinc-400'}`} />
                        {e.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                      Line {e.scheduleCLine}
                    </td>
                    <td className="px-6 py-3 text-right font-mono tabular-nums text-zinc-900 dark:text-white">
                      {fmtDollars(e.amountCents)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
