'use client';

import { useState, useMemo, useCallback } from 'react';
import Form1099Preview from '@/components/tax/Form1099Preview';
import CapitalVsRepairHelper from '@/components/tax/CapitalVsRepairHelper';
import { generateAll1099s } from '@/lib/services/tax-1099-generator';
import type { Form1099NEC } from '@/lib/services/tax-1099-generator';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtDollars(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  return `$${dollars.toLocaleString('en-US')}.${String(remainder).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Mock vendor payment data                                            */
/* ------------------------------------------------------------------ */

interface VendorPayment {
  id: string;
  name: string;
  trade: string;
  ytdCents: number;
  over600: boolean;
  form1099Generated: boolean;
}

const vendors: VendorPayment[] = [
  { id: 'v1', name: 'Mike Rodriguez Plumbing LLC', trade: 'Plumbing', ytdCents: 1_280_000, over600: true, form1099Generated: false },
  { id: 'v2', name: 'Sarah Chen Electric', trade: 'Electrical', ytdCents: 890_000, over600: true, form1099Generated: false },
  { id: 'v3', name: 'Carlos Rivera General Contracting', trade: 'General', ytdCents: 2_100_000, over600: true, form1099Generated: true },
  { id: 'v4', name: 'Diana Brooks Painting', trade: 'Painting', ytdCents: 450_000, over600: false, form1099Generated: false },
  { id: 'v5', name: 'James Wilson HVAC Services', trade: 'HVAC', ytdCents: 3_400_000, over600: true, form1099Generated: false },
  { id: 'v6', name: 'Tom Parker Landscaping', trade: 'Landscaping', ytdCents: 72_000, over600: true, form1099Generated: false },
  { id: 'v7', name: 'Nancy Cooper Cleaning', trade: 'Cleaning', ytdCents: 35_000, over600: false, form1099Generated: false },
];

/* Schedule E data per property */
const scheduleEProperties = [
  {
    name: 'Maple Ridge',
    rentsCents: 86_400_000,
    expenses: [
      { line: '7', desc: 'Cleaning & maintenance', cents: 6_120_000 },
      { line: '9', desc: 'Insurance', cents: 5_040_000 },
      { line: '11', desc: 'Management fees', cents: 2_592_000 },
      { line: '12', desc: 'Mortgage interest', cents: 19_200_000 },
      { line: '14', desc: 'Repairs', cents: 1_320_000 },
      { line: '16', desc: 'Taxes', cents: 15_000_000 },
      { line: '18', desc: 'Depreciation', cents: 3_090_909 },
    ],
  },
  {
    name: '220 Main St',
    rentsCents: 25_200_000,
    expenses: [
      { line: '7', desc: 'Cleaning & maintenance', cents: 2_160_000 },
      { line: '9', desc: 'Insurance', cents: 2_160_000 },
      { line: '11', desc: 'Management fees', cents: 756_000 },
      { line: '12', desc: 'Mortgage interest', cents: 8_400_000 },
      { line: '14', desc: 'Repairs', cents: 960_000 },
      { line: '16', desc: 'Taxes', cents: 6_480_000 },
      { line: '18', desc: 'Depreciation', cents: 1_076_923 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Tabs                                                               */
/* ------------------------------------------------------------------ */

const tabs = [
  { id: 'vendors', label: 'Vendor Payments' },
  { id: '1099s', label: '1099 Generator' },
  { id: 'schedule-e', label: 'Schedule E' },
  { id: 'capital-repair', label: 'Capital vs Repair' },
] as const;

type TabId = (typeof tabs)[number]['id'];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function PMTaxPageClient() {
  const [activeTab, setActiveTab] = useState<TabId>('vendors');
  const [selectedForm, setSelectedForm] = useState<Form1099NEC | null>(null);
  const [bulkGenerated, setBulkGenerated] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'ytdCents'>('ytdCents');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const allForms = useMemo(() => generateAll1099s('pm-user', 2025), []);
  const totalPaidCents = vendors.reduce((s, v) => s + v.ytdCents, 0);
  const vendorsOver600 = vendors.filter((v) => v.over600).length;

  const sortedVendors = useMemo(() => {
    return [...vendors].sort((a, b) => {
      if (sortBy === 'name') {
        return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return sortDir === 'asc' ? a.ytdCents - b.ytdCents : b.ytdCents - a.ytdCents;
    });
  }, [sortBy, sortDir]);

  const handleSort = useCallback((key: 'name' | 'ytdCents') => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  }, [sortBy]);

  const handleBulkGenerate = useCallback(() => {
    setBulkGenerated(true);
    setTimeout(() => setBulkGenerated(false), 4000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            Tax Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Vendor payments, 1099 generation, and Schedule E data for your properties.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Vendors</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{vendors.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Paid (YTD)</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{fmtDollars(totalPaidCents)}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">1099 Required</p>
          <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">{vendorsOver600}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">1099s Generated</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{vendors.filter((v) => v.form1099Generated).length}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedForm(null);
            }}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'vendors' && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Vendor Payment Totals</h2>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Click column headers to sort</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Vendor payments">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th
                    className="cursor-pointer px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    onClick={() => handleSort('name')}
                  >
                    Vendor {sortBy === 'name' && (sortDir === 'asc' ? '\u2191' : '\u2193')}
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Trade</th>
                  <th
                    className="cursor-pointer px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    onClick={() => handleSort('ytdCents')}
                  >
                    YTD Paid {sortBy === 'ytdCents' && (sortDir === 'asc' ? '\u2191' : '\u2193')}
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">1099 Status</th>
                  <th className="px-6 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedVendors.map((v) => (
                  <tr key={v.id} className="border-b border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-3 font-medium text-zinc-900 dark:text-white">{v.name}</td>
                    <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">{v.trade}</td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums text-zinc-900 dark:text-white">{fmtDollars(v.ytdCents)}</td>
                    <td className="px-3 py-3 text-center">
                      {v.over600 ? (
                        v.form1099Generated ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Generated</span>
                        ) : (
                          <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">Required</span>
                        )
                      ) : (
                        <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">Under $600</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {v.over600 && (
                        <button
                          type="button"
                          onClick={() => {
                            const form = allForms.find((f) => f.recipientName === v.name);
                            if (form) {
                              setSelectedForm(form);
                              setActiveTab('1099s');
                            }
                          }}
                          className="text-xs font-medium text-[#00a9e0] hover:underline"
                        >
                          View 1099
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === '1099s' && (
        <div className="space-y-6">
          {/* Bulk action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBulkGenerate}
              className="flex items-center gap-2 rounded-lg bg-[#00a9e0] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0090c0]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Generate All 1099s ({vendorsOver600} vendors)
            </button>
            {bulkGenerated && (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                All {vendorsOver600} 1099-NECs generated successfully.
              </span>
            )}
          </div>

          {/* Preview a selected 1099 or the first one */}
          {(selectedForm || allForms.length > 0) && (
            <div>
              {/* Selector */}
              {!selectedForm && (
                <div className="mb-4">
                  <label htmlFor="select-1099" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Select vendor</label>
                  <select
                    id="select-1099"
                    onChange={(e) => {
                      const form = allForms.find((f) => f.recipientName === e.target.value);
                      if (form) setSelectedForm(form);
                    }}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-[#00a9e0] focus:ring-1 focus:ring-[#00a9e0] focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="">-- Choose a vendor --</option>
                    {allForms.map((f) => (
                      <option key={f.recipientTin} value={f.recipientName}>{f.recipientName}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedForm && (
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedForm(null)}
                    className="mb-4 text-sm text-[#00a9e0] hover:underline"
                  >
                    &larr; Back to list
                  </button>
                  <Form1099Preview form={selectedForm} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'schedule-e' && (
        <div className="space-y-6">
          {scheduleEProperties.map((prop) => {
            const totalExpenses = prop.expenses.reduce((s, e) => s + e.cents, 0);
            const netIncome = prop.rentsCents - totalExpenses;
            return (
              <div key={prop.name} className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">{prop.name} -- Schedule E</h3>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export
                  </button>
                </div>
                <div className="p-6">
                  <table className="w-full text-sm" role="table" aria-label={`Schedule E for ${prop.name}`}>
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <th className="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Line</th>
                        <th className="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Description</th>
                        <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-50 bg-emerald-50/50 dark:border-zinc-800/50 dark:bg-emerald-500/5">
                        <td className="py-2 pr-3 font-mono text-xs text-zinc-400">3</td>
                        <td className="py-2 pr-3 font-bold text-zinc-900 dark:text-white">Rents received</td>
                        <td className="py-2 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">{fmtDollars(prop.rentsCents)}</td>
                      </tr>
                      {prop.expenses.map((e) => (
                        <tr key={e.line} className="border-b border-zinc-50 dark:border-zinc-800/50">
                          <td className="py-2 pr-3 font-mono text-xs text-zinc-400">{e.line}</td>
                          <td className="py-2 pr-3 text-zinc-700 dark:text-zinc-300">{e.desc}</td>
                          <td className="py-2 text-right font-mono tabular-nums text-zinc-600 dark:text-zinc-400">{fmtDollars(e.cents)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-zinc-200 dark:border-zinc-700">
                        <td className="py-2 pr-3 font-mono text-xs text-zinc-400">21</td>
                        <td className="py-2 pr-3 font-bold text-zinc-900 dark:text-white">Net rental income (loss)</td>
                        <td className={`py-2 text-right font-mono tabular-nums font-bold ${netIncome >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {fmtDollars(netIncome)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'capital-repair' && <CapitalVsRepairHelper />}
    </div>
  );
}
