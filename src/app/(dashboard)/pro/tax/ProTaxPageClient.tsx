'use client';

import { useState } from 'react';
import TaxPackageGenerator from '@/components/tax/TaxPackageGenerator';
import ExpenseAutoCategorizor from '@/components/tax/ExpenseAutoCategorizor';
import MileageCalculator from '@/components/tax/MileageCalculator';
import QuarterlyReminder from '@/components/tax/QuarterlyReminder';
import CapitalVsRepairHelper from '@/components/tax/CapitalVsRepairHelper';
import Form1099Preview from '@/components/tax/Form1099Preview';
import type { Form1099NEC } from '@/lib/services/tax-1099-generator';

/* ------------------------------------------------------------------ */
/* Tabs                                                               */
/* ------------------------------------------------------------------ */

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'mileage', label: 'Mileage' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: '1099s', label: '1099s' },
  { id: 'capital', label: 'Capital vs Repair' },
] as const;

type TabId = (typeof tabs)[number]['id'];

/* ------------------------------------------------------------------ */
/* Sample 1099 for preview                                             */
/* ------------------------------------------------------------------ */

const sample1099: Form1099NEC = {
  taxYear: 2025,
  payerName: 'Sherpa Property Management LLC',
  payerAddress: '100 Main St, Suite 200, Manchester, NH 03101',
  payerTin: '99-8765432',
  recipientName: 'Marcus Rivera',
  recipientAddress: '55 Contractor Way, Manchester, NH 03101',
  recipientTin: '11-2233445',
  nonemployeeCompensation: 8_200_000,
  federalTaxWithheld: 0,
  stateTaxWithheld: 0,
  statePayerNumber: 'NH-12345',
  stateIncome: 8_200_000,
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProTaxPageClient() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          Finance Hub
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Expenses, mileage, quarterly payments, tax documents, and financial insights.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
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
      {activeTab === 'overview' && <TaxPackageGenerator />}
      {activeTab === 'expenses' && <ExpenseAutoCategorizor />}
      {activeTab === 'mileage' && <MileageCalculator />}
      {activeTab === 'quarterly' && <QuarterlyReminder />}
      {activeTab === '1099s' && <Form1099Preview form={sample1099} />}
      {activeTab === 'capital' && <CapitalVsRepairHelper />}
    </div>
  );
}
