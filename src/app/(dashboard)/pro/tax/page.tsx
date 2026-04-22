'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DocumentTextIcon,
  TruckIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TabKey = 'overview' | 'w9' | 'expenses' | 'mileage' | 'quarterly' | 'yearend';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  amountCents: number;
  source: 'Platform' | 'Manual' | 'QBO';
  hasReceipt: boolean;
  scheduleCLine: string;
}

type ExpenseCategory = 'Supplies' | 'Commissions' | 'Vehicle' | 'Insurance' | 'Tools' | 'Contract Labor' | 'Other';

interface Trip {
  id: string;
  date: string;
  from: string;
  to: string;
  miles: number;
  source: 'GPS' | 'Manual';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cents(amount: number): string {
  return '$' + (amount / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function centsExact(amount: number): string {
  return '$' + (amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', date: '2026-01-15', description: 'Home Depot - Lumber & fasteners', category: 'Supplies', amountCents: 120000, source: 'Platform', hasReceipt: true, scheduleCLine: 'Line 22' },
  { id: 'e2', date: '2026-02-03', description: 'Home Depot - Plumbing supplies', category: 'Supplies', amountCents: 89000, source: 'QBO', hasReceipt: true, scheduleCLine: 'Line 22' },
  { id: 'e3', date: '2026-03-20', description: 'Home Depot - Electrical wire', category: 'Supplies', amountCents: 45000, source: 'Manual', hasReceipt: false, scheduleCLine: 'Line 22' },
  { id: 'e4', date: '2026-01-31', description: 'Sherpa Pros commission - Kitchen remodel', category: 'Commissions', amountCents: 18000, source: 'Platform', hasReceipt: true, scheduleCLine: 'Line 10' },
  { id: 'e5', date: '2026-02-28', description: 'Sherpa Pros commission - Bathroom reno', category: 'Commissions', amountCents: 15000, source: 'Platform', hasReceipt: true, scheduleCLine: 'Line 10' },
  { id: 'e6', date: '2026-03-15', description: 'Sherpa Pros commission - Deck build', category: 'Commissions', amountCents: 12000, source: 'Platform', hasReceipt: true, scheduleCLine: 'Line 10' },
  { id: 'e7', date: '2026-04-10', description: 'Sherpa Pros commission - Drywall patch', category: 'Commissions', amountCents: 9500, source: 'Platform', hasReceipt: true, scheduleCLine: 'Line 10' },
  { id: 'e8', date: '2026-02-10', description: 'Shell gas station - job travel', category: 'Vehicle', amountCents: 34000, source: 'Manual', hasReceipt: true, scheduleCLine: 'Line 9' },
  { id: 'e9', date: '2026-03-22', description: 'Sunoco - job site fuel', category: 'Vehicle', amountCents: 28000, source: 'Manual', hasReceipt: false, scheduleCLine: 'Line 9' },
  { id: 'e10', date: '2026-01-05', description: 'NEXT Insurance - GL policy annual', category: 'Insurance', amountCents: 200000, source: 'QBO', hasReceipt: true, scheduleCLine: 'Line 15' },
  { id: 'e11', date: '2026-02-18', description: 'Milwaukee M18 impact driver', category: 'Tools', amountCents: 45000, source: 'Manual', hasReceipt: true, scheduleCLine: 'Line 13 / Depreciation' },
  { id: 'e12', date: '2026-03-05', description: 'Milwaukee circular saw', category: 'Tools', amountCents: 32000, source: 'Manual', hasReceipt: true, scheduleCLine: 'Line 13 / Depreciation' },
  { id: 'e13', date: '2026-02-25', description: 'Tony Martinez - tile subcontractor', category: 'Contract Labor', amountCents: 80000, source: 'Platform', hasReceipt: true, scheduleCLine: 'Line 11' },
  { id: 'e14', date: '2026-03-30', description: 'Office supplies & printer ink', category: 'Other', amountCents: 8500, source: 'Manual', hasReceipt: false, scheduleCLine: 'Line 27a' },
  { id: 'e15', date: '2026-04-05', description: 'Fuel surcharge - delivery run', category: 'Vehicle', amountCents: 15000, source: 'Manual', hasReceipt: true, scheduleCLine: 'Line 9' },
];

const MOCK_TRIPS: Trip[] = [
  { id: 't1', date: '2026-01-06', from: 'Manchester, NH', to: 'Nashua, NH', miles: 36, source: 'GPS' },
  { id: 't2', date: '2026-01-12', from: 'Manchester, NH', to: 'Concord, NH', miles: 22, source: 'GPS' },
  { id: 't3', date: '2026-01-18', from: 'Manchester, NH', to: 'Derry, NH', miles: 18, source: 'Manual' },
  { id: 't4', date: '2026-01-25', from: 'Manchester, NH', to: 'Salem, NH', miles: 28, source: 'GPS' },
  { id: 't5', date: '2026-01-30', from: 'Manchester, NH', to: 'Londonderry, NH', miles: 14, source: 'GPS' },
  { id: 't6', date: '2026-02-04', from: 'Manchester, NH', to: 'Bedford, NH', miles: 12, source: 'Manual' },
  { id: 't7', date: '2026-02-10', from: 'Manchester, NH', to: 'Merrimack, NH', miles: 20, source: 'GPS' },
  { id: 't8', date: '2026-02-17', from: 'Manchester, NH', to: 'Nashua, NH', miles: 36, source: 'GPS' },
  { id: 't9', date: '2026-02-22', from: 'Manchester, NH', to: 'Concord, NH', miles: 22, source: 'GPS' },
  { id: 't10', date: '2026-02-28', from: 'Manchester, NH', to: 'Hooksett, NH', miles: 10, source: 'Manual' },
  { id: 't11', date: '2026-03-03', from: 'Manchester, NH', to: 'Goffstown, NH', miles: 16, source: 'GPS' },
  { id: 't12', date: '2026-03-08', from: 'Manchester, NH', to: 'Nashua, NH', miles: 36, source: 'GPS' },
  { id: 't13', date: '2026-03-15', from: 'Manchester, NH', to: 'Salem, NH', miles: 28, source: 'GPS' },
  { id: 't14', date: '2026-03-20', from: 'Manchester, NH', to: 'Derry, NH', miles: 18, source: 'Manual' },
  { id: 't15', date: '2026-03-26', from: 'Manchester, NH', to: 'Milford, NH', miles: 30, source: 'GPS' },
  { id: 't16', date: '2026-04-01', from: 'Manchester, NH', to: 'Concord, NH', miles: 22, source: 'GPS' },
  { id: 't17', date: '2026-04-05', from: 'Manchester, NH', to: 'Londonderry, NH', miles: 14, source: 'GPS' },
  { id: 't18', date: '2026-04-08', from: 'Manchester, NH', to: 'Bedford, NH', miles: 12, source: 'Manual' },
  { id: 't19', date: '2026-04-11', from: 'Manchester, NH', to: 'Nashua, NH', miles: 36, source: 'GPS' },
  { id: 't20', date: '2026-04-14', from: 'Manchester, NH', to: 'Merrimack, NH', miles: 20, source: 'GPS' },
];

const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string; darkBg: string; darkText: string }> = {
  Supplies: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400' },
  Commissions: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400' },
  Vehicle: { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400' },
  Insurance: { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400' },
  Tools: { bg: 'bg-orange-100', text: 'text-orange-700', darkBg: 'dark:bg-orange-900/30', darkText: 'dark:text-orange-400' },
  'Contract Labor': { bg: 'bg-red-100', text: 'text-red-700', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-400' },
  Other: { bg: 'bg-zinc-100', text: 'text-zinc-700', darkBg: 'dark:bg-zinc-800', darkText: 'dark:text-zinc-400' },
};

const ENTITY_TYPES = [
  'Individual/sole proprietor',
  'C Corporation',
  'S Corporation',
  'Partnership',
  'Trust/estate',
  'LLC - C Corporation',
  'LLC - S Corporation',
  'LLC - Partnership',
  'LLC - Disregarded entity',
  'Other',
] as const;

// ---------------------------------------------------------------------------
// Tab Definitions
// ---------------------------------------------------------------------------

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <ChartBarIcon className="h-4 w-4" /> },
  { key: 'w9', label: 'W-9', icon: <DocumentTextIcon className="h-4 w-4" /> },
  { key: 'expenses', label: 'Expenses', icon: <BanknotesIcon className="h-4 w-4" /> },
  { key: 'mileage', label: 'Mileage', icon: <TruckIcon className="h-4 w-4" /> },
  { key: 'quarterly', label: 'Quarterly', icon: <CalendarDaysIcon className="h-4 w-4" /> },
  { key: 'yearend', label: 'Year-End', icon: <ArchiveBoxIcon className="h-4 w-4" /> },
];

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ProTaxPage() {
  // Tab from URL search params or default
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [w9Submitted, setW9Submitted] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState<ExpenseCategory | 'All'>('All');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [pushReminders, setPushReminders] = useState(true);

  // Computed
  const ytdIncomeCents = 6840000; // $68,400
  const ytdExpensesCents = MOCK_EXPENSES.reduce((sum, e) => sum + e.amountCents, 0);
  const estimatedTaxCents = 1285000; // $12,850

  const totalMiles = MOCK_TRIPS.reduce((sum, t) => sum + t.miles, 0);
  const mileageRate = 67; // cents per mile (2026 IRS rate)
  const mileageDeductionCents = totalMiles * mileageRate;

  const effectiveTaxRate = ((estimatedTaxCents / ytdIncomeCents) * 100).toFixed(1);
  const totalDeductionsCents = ytdExpensesCents + mileageDeductionCents;

  const filteredExpenses = expenseFilter === 'All'
    ? MOCK_EXPENSES
    : MOCK_EXPENSES.filter(e => e.category === expenseFilter);

  const expensesByCategory = useMemo(() => {
    const map = new Map<ExpenseCategory, number>();
    for (const e of MOCK_EXPENSES) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amountCents);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const maxCategoryAmount = expensesByCategory.length > 0 ? expensesByCategory[0][1] : 1;

  const tripsByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of MOCK_TRIPS) {
      const month = t.date.slice(0, 7); // YYYY-MM
      map.set(month, (map.get(month) ?? 0) + t.miles);
    }
    return Array.from(map.entries()).sort();
  }, []);

  const maxMonthMiles = tripsByMonth.length > 0 ? Math.max(...tripsByMonth.map(([, m]) => m)) : 1;

  const deadlineDays = daysUntil('2026-06-15');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Tax Center</h1>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          Track income, expenses, mileage, and quarterly tax payments in one place.
        </p>
      </div>

      {/* W-9 Banner (if not submitted) */}
      {!w9Submitted && activeTab !== 'w9' && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <ExclamationTriangleIcon className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">W-9 Required</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">Submit your W-9 to receive payments over $600.</p>
          </div>
          <button
            onClick={() => setActiveTab('w9')}
            className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Submit W-9
          </button>
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-[#00a9e0] text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Big Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">YTD Income</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{cents(ytdIncomeCents)}</p>
              <p className="mt-1 text-xs text-zinc-400">Platform earnings + external</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">YTD Expenses</p>
              <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">{cents(ytdExpensesCents)}</p>
              <p className="mt-1 text-xs text-zinc-400">{MOCK_EXPENSES.length} transactions tracked</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Estimated Tax Owed</p>
              <p className="mt-1 text-3xl font-bold text-amber-600 dark:text-amber-400">{cents(estimatedTaxCents)}</p>
              <p className="mt-1 text-xs text-zinc-400">Federal + SE tax estimate</p>
            </div>
          </div>

          {/* Deadline Card */}
          <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Next Quarterly Deadline</p>
                <p className="mt-1 text-xl font-bold text-amber-900 dark:text-amber-100">Jun 15, 2026 — $4,500 due</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{deadlineDays}</p>
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400">days left</p>
              </div>
            </div>
          </div>

          {/* Set-aside Recommendation */}
          <div className="rounded-xl border border-[#00a9e0]/20 bg-sky-50 p-5 dark:border-sky-800 dark:bg-sky-900/20">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00a9e0]/10 text-[#00a9e0]">
                <BanknotesIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Set aside per job</p>
                <p className="mt-0.5 text-2xl font-bold text-[#00a9e0]">$273 per $1,000 earned</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Based on your effective rate of {effectiveTaxRate}% (income tax + 15.3% SE tax). Adjust as income changes.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Effective Tax Rate</p>
              <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{effectiveTaxRate}%</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Deductions</p>
              <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{cents(totalDeductionsCents)}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Mileage Deduction</p>
              <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{centsExact(mileageDeductionCents)}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{totalMiles.toLocaleString()} mi x $0.67</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'w9' && (
        <div className="space-y-6">
          {w9Submitted ? (
            /* W-9 Submitted State */
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">W-9 on File</h2>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Verified
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Submitted Apr 15, 2026</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Legal Name</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Marcus Rivera</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Business Name</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Rivera Plumbing LLC</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">TIN</p>
                  <p className="mt-0.5 text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-100">**-*****87</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Entity Type</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">LLC - Disregarded entity</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Address</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    123 Elm St, Manchester, NH 03101
                  </p>
                </div>
              </div>

              <button
                onClick={() => setW9Submitted(false)}
                className="mt-6 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Update W-9
              </button>
            </div>
          ) : (
            /* W-9 Form */
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">W-9 Tax Information</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Required before receiving payments over $600. Your information is encrypted and stored securely.
              </p>

              <form
                className="mt-6 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setW9Submitted(true);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="w9-legal-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="w9-legal-name"
                      type="text"
                      required
                      placeholder="As shown on tax return"
                      className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-[#00a9e0] focus:ring-2 focus:ring-[#00a9e0]/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="w9-biz-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Business Name <span className="text-xs text-zinc-400">(optional)</span>
                    </label>
                    <input
                      id="w9-biz-name"
                      type="text"
                      placeholder="If different from above"
                      className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-[#00a9e0] focus:ring-2 focus:ring-[#00a9e0]/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="w9-tin" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      TIN (SSN or EIN) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="w9-tin"
                      type="password"
                      required
                      maxLength={11}
                      placeholder="XX-XXXXXXX"
                      className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-mono text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-[#00a9e0] focus:ring-2 focus:ring-[#00a9e0]/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="w9-entity" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Entity Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="w9-entity"
                      required
                      className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 transition-colors focus:border-[#00a9e0] focus:ring-2 focus:ring-[#00a9e0]/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      <option value="">Select entity type</option>
                      {ENTITY_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="w9-address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="w9-address"
                    type="text"
                    required
                    placeholder="123 Main St"
                    className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-[#00a9e0] focus:ring-2 focus:ring-[#00a9e0]/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="w9-city" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="w9-city"
                      type="text"
                      required
                      className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-[#00a9e0] focus:ring-2 focus:ring-[#00a9e0]/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="w9-state" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="w9-state"
                      type="text"
                      required
                      maxLength={2}
                      placeholder="NH"
                      className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-[#00a9e0] focus:ring-2 focus:ring-[#00a9e0]/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="w9-zip" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      ZIP <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="w9-zip"
                      type="text"
                      required
                      maxLength={10}
                      placeholder="03101"
                      className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-[#00a9e0] focus:ring-2 focus:ring-[#00a9e0]/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200 pt-5 dark:border-zinc-700">
                  <p className="text-xs text-zinc-400">
                    Your TIN is encrypted at rest and never stored in plain text.
                  </p>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0098ca]"
                  >
                    Submit W-9
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="space-y-6">
          {/* Filter Chips + Add */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Supplies', 'Commissions', 'Vehicle', 'Insurance', 'Tools', 'Contract Labor', 'Other'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setExpenseFilter(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  expenseFilter === cat
                    ? 'bg-[#00a9e0] text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setShowAddExpense(true)}
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-[#00a9e0] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0098ca]"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Add Expense
            </button>
          </div>

          {/* Expense Table */}
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Date</th>
                    <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Description</th>
                    <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Category</th>
                    <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Amount</th>
                    <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Source</th>
                    <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Sched. C</th>
                    <th className="px-4 py-3 text-center font-medium text-zinc-500 dark:text-zinc-400">
                      <PaperClipIcon className="mx-auto h-4 w-4" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredExpenses.map(exp => {
                    const cc = CATEGORY_COLORS[exp.category];
                    return (
                      <tr key={exp.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="max-w-[240px] truncate px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                          {exp.description}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cc.bg} ${cc.text} ${cc.darkBg} ${cc.darkText}`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                          {cents(exp.amountCents)}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{exp.source}</td>
                        <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{exp.scheduleCLine}</td>
                        <td className="px-4 py-3 text-center">
                          {exp.hasReceipt ? (
                            <PaperClipIcon className="mx-auto h-4 w-4 text-emerald-500" />
                          ) : (
                            <span className="text-xs text-zinc-300 dark:text-zinc-600">--</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Total ({filteredExpenses.length} transactions)
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {cents(filteredExpenses.reduce((s, e) => s + e.amountCents, 0))}
                    </td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* YTD by Category (Horizontal bars) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">YTD Expenses by Category</h3>
            <div className="mt-4 space-y-3">
              {expensesByCategory.map(([category, amountCents]) => {
                const cc = CATEGORY_COLORS[category];
                const pct = (amountCents / maxCategoryAmount) * 100;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{category}</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{cents(amountCents)}</span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${cc.bg.replace('100', '500')} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule C Preview */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Schedule C Line Mapping</h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">How your expenses map to IRS Schedule C (Form 1040)</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="pb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">IRS Line</th>
                    <th className="pb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</th>
                    <th className="pb-2 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {[
                    { line: 'Line 9', desc: 'Car and truck expenses', amount: MOCK_EXPENSES.filter(e => e.category === 'Vehicle').reduce((s, e) => s + e.amountCents, 0) },
                    { line: 'Line 10', desc: 'Commissions and fees', amount: MOCK_EXPENSES.filter(e => e.category === 'Commissions').reduce((s, e) => s + e.amountCents, 0) },
                    { line: 'Line 11', desc: 'Contract labor', amount: MOCK_EXPENSES.filter(e => e.category === 'Contract Labor').reduce((s, e) => s + e.amountCents, 0) },
                    { line: 'Line 13', desc: 'Depreciation (tools/equipment)', amount: MOCK_EXPENSES.filter(e => e.category === 'Tools').reduce((s, e) => s + e.amountCents, 0) },
                    { line: 'Line 15', desc: 'Insurance (other than health)', amount: MOCK_EXPENSES.filter(e => e.category === 'Insurance').reduce((s, e) => s + e.amountCents, 0) },
                    { line: 'Line 22', desc: 'Supplies', amount: MOCK_EXPENSES.filter(e => e.category === 'Supplies').reduce((s, e) => s + e.amountCents, 0) },
                    { line: 'Line 27a', desc: 'Other expenses', amount: MOCK_EXPENSES.filter(e => e.category === 'Other').reduce((s, e) => s + e.amountCents, 0) },
                  ].map(row => (
                    <tr key={row.line}>
                      <td className="py-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">{row.line}</td>
                      <td className="py-2 text-zinc-700 dark:text-zinc-300">{row.desc}</td>
                      <td className="py-2 text-right font-semibold text-zinc-900 dark:text-zinc-100">{cents(row.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Expense Modal */}
          {showAddExpense && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Add Expense</h3>
                  <button onClick={() => setShowAddExpense(false)} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <form className="mt-4 space-y-4" onSubmit={e => { e.preventDefault(); setShowAddExpense(false); }}>
                  <div>
                    <label htmlFor="exp-desc" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                    <input id="exp-desc" type="text" required className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="exp-amount" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Amount</label>
                      <input id="exp-amount" type="number" step="0.01" min="0" required className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                    </div>
                    <div>
                      <label htmlFor="exp-date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date</label>
                      <input id="exp-date" type="date" required className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="exp-cat" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                    <select id="exp-cat" required className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                      {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="exp-receipt" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Receipt</label>
                    <input id="exp-receipt" type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium dark:text-zinc-400 dark:file:bg-zinc-800" />
                  </div>
                  <button type="submit" className="w-full rounded-lg bg-[#00a9e0] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0098ca]">
                    Save Expense
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'mileage' && (
        <div className="space-y-6">
          {/* YTD Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">YTD Miles</p>
              <p className="mt-1 text-3xl font-bold text-[#00a9e0]">{totalMiles.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">IRS Rate (2026)</p>
              <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">$0.67<span className="text-base font-normal text-zinc-400">/mi</span></p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">YTD Deduction</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{centsExact(mileageDeductionCents)}</p>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Miles by Month</h3>
            <div className="mt-4 flex items-end gap-3" style={{ height: 120 }}>
              {tripsByMonth.map(([month, miles]) => {
                const pct = (miles / maxMonthMiles) * 100;
                const label = new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' });
                return (
                  <div key={month} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{miles}</span>
                    <div className="w-full rounded-t-md bg-[#00a9e0]/80 transition-all" style={{ height: `${pct}%`, minHeight: 4 }} />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Trip button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddTrip(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#00a9e0] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0098ca]"
            >
              <PlusIcon className="h-4 w-4" />
              Add Trip
            </button>
          </div>

          {/* Trip Table */}
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Date</th>
                    <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Route</th>
                    <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Miles</th>
                    <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Deduction</th>
                    <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {MOCK_TRIPS.map(trip => (
                    <tr key={trip.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                        {trip.from} <span className="text-zinc-400">&rarr;</span> {trip.to}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">{trip.miles}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                        {centsExact(trip.miles * mileageRate)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          trip.source === 'GPS'
                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          {trip.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Trip Modal */}
          {showAddTrip && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Add Trip</h3>
                  <button onClick={() => setShowAddTrip(false)} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <form className="mt-4 space-y-4" onSubmit={e => { e.preventDefault(); setShowAddTrip(false); }}>
                  <div>
                    <label htmlFor="trip-from" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">From</label>
                    <input id="trip-from" type="text" required placeholder="Starting address" className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                  </div>
                  <div>
                    <label htmlFor="trip-to" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">To</label>
                    <input id="trip-to" type="text" required placeholder="Destination address" className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="trip-miles" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Miles</label>
                      <input id="trip-miles" type="number" step="0.1" min="0" required className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                    </div>
                    <div>
                      <label htmlFor="trip-date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date</label>
                      <input id="trip-date" type="date" required className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                    </div>
                  </div>
                  <button type="submit" className="w-full rounded-lg bg-[#00a9e0] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0098ca]">
                    Save Trip
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'quarterly' && (
        <div className="space-y-6">
          {/* Quarter Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { q: 'Q1', period: 'Jan - Mar 2026', amount: 420000, status: 'paid' as const, deadline: 'Apr 15, 2026' },
              { q: 'Q2', period: 'Apr - Jun 2026', amount: 450000, status: 'due' as const, deadline: 'Jun 15, 2026' },
              { q: 'Q3', period: 'Jul - Sep 2026', amount: 430000, status: 'estimated' as const, deadline: 'Sep 15, 2026' },
              { q: 'Q4', period: 'Oct - Dec 2026', amount: 410000, status: 'estimated' as const, deadline: 'Jan 15, 2027' },
            ].map(q => {
              const statusStyles = {
                paid: { border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-emerald-50 dark:bg-emerald-900/10', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'PAID' },
                due: { border: 'border-amber-200 dark:border-amber-800', bg: 'bg-amber-50 dark:bg-amber-900/10', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: `DUE ${q.deadline}` },
                estimated: { border: 'border-zinc-200 dark:border-zinc-700', bg: 'bg-white dark:bg-zinc-900', badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400', label: 'ESTIMATED' },
              }[q.status];

              return (
                <div key={q.q} className={`rounded-xl border p-5 shadow-sm ${statusStyles.border} ${statusStyles.bg}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{q.q} &middot; {q.period}</p>
                      <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{cents(q.amount)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles.badge}`}>
                      {q.status === 'paid' && <CheckCircleIcon className="mr-1 inline h-3.5 w-3.5" />}
                      {q.status === 'due' && <ClockIcon className="mr-1 inline h-3.5 w-3.5" />}
                      {statusStyles.label}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Due: {q.deadline}</p>
                  {q.status === 'due' && (
                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href="https://directpay.irs.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                      >
                        Pay Now
                        <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                      </a>
                      <span className="text-xs text-amber-600 dark:text-amber-400">{deadlineDays} days left</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Push Reminder Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Payment Reminders</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Push notifications 30, 14, and 3 days before each deadline</p>
            </div>
            <button
              onClick={() => setPushReminders(!pushReminders)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushReminders ? 'bg-[#00a9e0]' : 'bg-zinc-300 dark:bg-zinc-600'}`}
              role="switch"
              aria-checked={pushReminders}
              aria-label="Toggle payment reminders"
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${pushReminders ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Calculation Breakdown */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">How Q2 is Calculated</h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Based on annualized income and standard SE tax formula</p>
            <div className="mt-4 space-y-2 text-sm">
              {[
                { label: 'Projected annual income', value: '$91,200' },
                { label: 'Projected annual expenses', value: '($30,800)', color: 'text-red-600 dark:text-red-400' },
                { label: 'Net profit (Schedule C)', value: '$60,400', bold: true },
                { label: 'Self-employment tax (15.3% x 92.35%)', value: '$8,530' },
                { label: 'Income tax (est. 12% bracket)', value: '$6,130' },
                { label: 'SE tax deduction (50%)', value: '($4,265)', color: 'text-red-600 dark:text-red-400' },
                { label: 'Total estimated annual tax', value: '$10,395', bold: true },
                { label: 'Already paid (Q1)', value: '($4,200)', color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Remaining / 3 quarters', value: '$4,500', bold: true, color: 'text-amber-600 dark:text-amber-400' },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between ${row.bold ? 'border-t border-zinc-200 pt-2 font-semibold dark:border-zinc-700' : ''}`}>
                  <span className="text-zinc-600 dark:text-zinc-400">{row.label}</span>
                  <span className={row.color ?? 'text-zinc-900 dark:text-zinc-100'}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'yearend' && (
        <div className="space-y-6">
          {/* Current Year Package */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">2026 Tax Package</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Generate your complete tax package with income, expenses, mileage, and 1099 data.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Income</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{cents(ytdIncomeCents)}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Expenses</p>
                <p className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">{cents(ytdExpensesCents)}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Mileage Deduction</p>
                <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{centsExact(mileageDeductionCents)}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">1099s Received</p>
                <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">2</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg bg-[#00a9e0] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0098ca]">
                <ArchiveBoxIcon className="h-4 w-4" />
                Generate Tax Package
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Export to QuickBooks
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Export to TurboTax
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Send to CPA
              </button>
            </div>
          </div>

          {/* Schedule C Preview */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Schedule C Preview (2026 YTD)</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-zinc-200 pb-2 dark:border-zinc-700">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Line 1 - Gross receipts</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{cents(ytdIncomeCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Line 9 - Car and truck expenses</span>
                <span className="text-zinc-900 dark:text-zinc-100">{cents(MOCK_EXPENSES.filter(e => e.category === 'Vehicle').reduce((s, e) => s + e.amountCents, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Line 10 - Commissions and fees</span>
                <span className="text-zinc-900 dark:text-zinc-100">{cents(MOCK_EXPENSES.filter(e => e.category === 'Commissions').reduce((s, e) => s + e.amountCents, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Line 11 - Contract labor</span>
                <span className="text-zinc-900 dark:text-zinc-100">{cents(MOCK_EXPENSES.filter(e => e.category === 'Contract Labor').reduce((s, e) => s + e.amountCents, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Line 13 - Depreciation</span>
                <span className="text-zinc-900 dark:text-zinc-100">{cents(MOCK_EXPENSES.filter(e => e.category === 'Tools').reduce((s, e) => s + e.amountCents, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Line 15 - Insurance</span>
                <span className="text-zinc-900 dark:text-zinc-100">{cents(MOCK_EXPENSES.filter(e => e.category === 'Insurance').reduce((s, e) => s + e.amountCents, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Line 22 - Supplies</span>
                <span className="text-zinc-900 dark:text-zinc-100">{cents(MOCK_EXPENSES.filter(e => e.category === 'Supplies').reduce((s, e) => s + e.amountCents, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Line 27a - Other expenses</span>
                <span className="text-zinc-900 dark:text-zinc-100">{cents(MOCK_EXPENSES.filter(e => e.category === 'Other').reduce((s, e) => s + e.amountCents, 0))}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 dark:border-zinc-700">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Line 28 - Total expenses</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{cents(ytdExpensesCents)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 dark:border-zinc-700">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Line 31 - Net profit</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{cents(ytdIncomeCents - ytdExpensesCents)}</span>
              </div>
            </div>
          </div>

          {/* Past Years */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Past Years</h3>
            <div className="mt-3 space-y-2">
              {[
                { year: 2025, income: '$72,300', expenses: '$28,400', status: 'Filed' },
                { year: 2024, income: '$55,100', expenses: '$21,800', status: 'Filed' },
              ].map(yr => (
                <div key={yr.year} className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{yr.year}</span>
                    <span className="text-xs text-zinc-500">Income: {yr.income}</span>
                    <span className="text-xs text-zinc-500">Expenses: {yr.expenses}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{yr.status}</span>
                    <button className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
