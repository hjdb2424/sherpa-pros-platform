'use client';

import { useState } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

// ---------------------------------------------------------------------------
// Types & Mock Data
// ---------------------------------------------------------------------------

interface ProPayment {
  id: string;
  name: string;
  trade: string;
  totalPaidCents: number;
  w9Status: 'Verified' | 'Pending' | 'Not Submitted';
  status1099: 'Threshold Met' | 'Tracking' | 'Approaching';
}

interface HomeImprovement {
  id: string;
  description: string;
  proName: string;
  completedDate: string;
  amountCents: number;
  classification: 'Capital Improvement' | 'Repair' | 'Unclassified';
  irsRationale: string;
}

const MOCK_PROS: ProPayment[] = [
  { id: 'p1', name: 'Mike Rodriguez', trade: 'Plumber', totalPaidCents: 485000, w9Status: 'Verified', status1099: 'Threshold Met' },
  { id: 'p2', name: 'Sarah Chen', trade: 'Electrician', totalPaidCents: 250000, w9Status: 'Verified', status1099: 'Tracking' },
  { id: 'p3', name: 'James Wilson', trade: 'HVAC', totalPaidCents: 52000, w9Status: 'Pending', status1099: 'Approaching' },
  { id: 'p4', name: 'Lisa Thompson', trade: 'Painter', totalPaidCents: 380000, w9Status: 'Verified', status1099: 'Tracking' },
  { id: 'p5', name: 'David Kim', trade: 'Carpenter', totalPaidCents: 720000, w9Status: 'Verified', status1099: 'Threshold Met' },
  { id: 'p6', name: 'Maria Santos', trade: 'Tile Installer', totalPaidCents: 195000, w9Status: 'Not Submitted', status1099: 'Tracking' },
];

const MOCK_HOME_IMPROVEMENTS: HomeImprovement[] = [
  { id: 'h1', description: 'Kitchen remodel - new cabinets & countertops', proName: 'Mike Rodriguez', completedDate: '2026-02-15', amountCents: 1250000, classification: 'Capital Improvement', irsRationale: 'Adds value, prolongs life, or adapts property to new use (IRS Pub 523)' },
  { id: 'h2', description: 'Bathroom faucet replacement', proName: 'Mike Rodriguez', completedDate: '2026-03-10', amountCents: 35000, classification: 'Repair', irsRationale: 'Restores property to original condition without adding value (IRS Pub 523)' },
  { id: 'h3', description: 'New deck construction', proName: 'David Kim', completedDate: '2026-04-01', amountCents: 480000, classification: 'Capital Improvement', irsRationale: 'Adds value, prolongs life, or adapts property to new use (IRS Pub 523)' },
  { id: 'h4', description: 'Electrical panel upgrade', proName: 'Sarah Chen', completedDate: '2026-03-25', amountCents: 185000, classification: 'Unclassified', irsRationale: '' },
];

function cents(amount: number): string {
  return '$' + (amount / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ClientTaxPage() {
  const [improvements, setImprovements] = useState(MOCK_HOME_IMPROVEMENTS);

  const approachingCount = MOCK_PROS.filter(p => p.status1099 === 'Approaching').length;
  const thresholdMetCount = MOCK_PROS.filter(p => p.status1099 === 'Threshold Met').length;
  const totalPaid = MOCK_PROS.reduce((s, p) => s + p.totalPaidCents, 0);

  function updateClassification(id: string, classification: HomeImprovement['classification']) {
    setImprovements(prev =>
      prev.map(imp =>
        imp.id === id
          ? {
              ...imp,
              classification,
              irsRationale:
                classification === 'Capital Improvement'
                  ? 'Adds value, prolongs life, or adapts property to new use (IRS Pub 523)'
                  : classification === 'Repair'
                    ? 'Restores property to original condition without adding value (IRS Pub 523)'
                    : '',
            }
          : imp,
      ),
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Tax &amp; 1099s</h1>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          Track contractor payments, W-9 status, and 1099 filing requirements.
        </p>
      </div>

      {/* Threshold Alert Banner */}
      {(approachingCount > 0 || thresholdMetCount > 0) && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <ExclamationTriangleIcon className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">1099 Filing Alert</p>
            <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-300">
              {thresholdMetCount} contractor{thresholdMetCount !== 1 ? 's have' : ' has'} exceeded the $600 threshold — 1099-NEC forms will be required.
              {approachingCount > 0 && ` ${approachingCount} more approaching $600.`}
            </p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Paid to Pros</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{cents(totalPaid)}</p>
          <p className="mt-1 text-xs text-zinc-400">{MOCK_PROS.length} contractors YTD</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">1099s Required</p>
          <p className="mt-1 text-3xl font-bold text-amber-600 dark:text-amber-400">{thresholdMetCount}</p>
          <p className="mt-1 text-xs text-zinc-400">Exceeded $600 threshold</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">W-9s Pending</p>
          <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
            {MOCK_PROS.filter(p => p.w9Status !== 'Verified').length}
          </p>
          <p className="mt-1 text-xs text-zinc-400">Need collection</p>
        </div>
      </div>

      {/* Pros Paid Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Pros Paid This Year</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Pro Name</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Trade</th>
                <th className="px-5 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Total Paid</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">W-9 Status</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">1099 Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {MOCK_PROS.map(pro => (
                <tr key={pro.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {pro.name}
                  </td>
                  <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{pro.trade}</td>
                  <td className="px-5 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                    {cents(pro.totalPaidCents)}
                  </td>
                  <td className="px-5 py-3">
                    {pro.w9Status === 'Verified' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircleIcon className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    ) : pro.w9Status === 'Pending' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <ClockIcon className="h-3.5 w-3.5" />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                        Not Submitted
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {pro.status1099 === 'Threshold Met' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                        Threshold Met
                      </span>
                    ) : pro.status1099 === 'Approaching' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                        <ClockIcon className="h-3.5 w-3.5" />
                        Approaching ($600)
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Tracking
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate 1099s */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Generate 1099-NEC Forms</h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Available after December 31 for the tax year. Must be filed by January 31.
          </p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 rounded-lg bg-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
          title="Available after Dec 31, 2026"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Generate 1099s
        </button>
      </div>

      {/* Home Improvement Tracker */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-start gap-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Home Improvement Tracker</h2>
            <div className="group relative">
              <InformationCircleIcon className="h-4 w-4 cursor-help text-zinc-400" />
              <div className="absolute left-0 top-6 z-10 hidden w-64 rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-600 shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                Capital improvements add to your cost basis and reduce capital gains when you sell. Repairs are not deductible for personal residences. (IRS Publication 523)
              </div>
            </div>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Tag jobs as Capital Improvement or Repair for tax basis tracking.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Job</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Pro</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Date</th>
                <th className="px-5 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Amount</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {improvements.map(imp => (
                <tr key={imp.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="max-w-[200px] px-5 py-3">
                    <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{imp.description}</p>
                    {imp.irsRationale && (
                      <p className="mt-0.5 truncate text-xs text-zinc-400">{imp.irsRationale}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{imp.proName}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-zinc-600 dark:text-zinc-400">
                    {new Date(imp.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                    {cents(imp.amountCents)}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={imp.classification}
                      onChange={e => updateClassification(imp.id, e.target.value as HomeImprovement['classification'])}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors focus:border-[#00a9e0] focus:ring-1 focus:ring-[#00a9e0]/20 focus:outline-none ${
                        imp.classification === 'Capital Improvement'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : imp.classification === 'Repair'
                            ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      <option value="Unclassified">Unclassified</option>
                      <option value="Capital Improvement">Capital Improvement</option>
                      <option value="Repair">Repair</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
