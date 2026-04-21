'use client';

import { useMemo, useCallback, useState } from 'react';
import { formatCents } from '@/lib/pricing/fee-calculator';
import type { Quote, QuoteLineItem } from '@/lib/services/quote-builder';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface QuotePreviewProps {
  quote: Quote;
  mode: 'pro' | 'client';
  onAccept?: () => void;
  onDecline?: () => void;
  onRequestChanges?: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<string, string> = {
  labor: 'Labor',
  materials: 'Materials',
  equipment: 'Equipment',
  permit: 'Permits & Fees',
  disposal: 'Disposal',
  other: 'Other',
};

const CATEGORY_ORDER: QuoteLineItem['category'][] = [
  'labor',
  'materials',
  'equipment',
  'permit',
  'disposal',
  'other',
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function QuotePreview({
  quote,
  mode,
  onAccept,
  onDecline,
  onRequestChanges,
}: QuotePreviewProps) {
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  // Group line items
  const groupedItems = useMemo(() => {
    const groups: Record<string, QuoteLineItem[]> = {};
    for (const item of quote.lineItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [quote.lineItems]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleAccept = useCallback(async () => {
    setAccepting(true);
    try {
      await fetch(`/api/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      onAccept?.();
    } catch {
      // silent
    } finally {
      setAccepting(false);
    }
  }, [quote.id, onAccept]);

  const handleDecline = useCallback(async () => {
    setDeclining(true);
    try {
      await fetch(`/api/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'declined' }),
      });
      onDecline?.();
    } catch {
      // silent
    } finally {
      setDeclining(false);
    }
  }, [quote.id, onDecline]);

  return (
    <div className="mx-auto max-w-3xl print:max-w-none">
      {/* Print button (hidden in print) */}
      <div className="mb-4 flex justify-end gap-2 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="Print quote"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m0 0a48.159 48.159 0 018.5 0m0 0V6a2.25 2.25 0 00-2.25-2.25H9a2.25 2.25 0 00-2.25 2.25v.894" />
          </svg>
          Print
        </button>
      </div>

      {/* Document */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm print:border-0 print:shadow-none dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#00a9e0] to-[#0284c7] px-6 py-8 text-white sm:px-8">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">ESTIMATE</h1>
          <p className="mt-1 text-sm text-white/80">Quote #{quote.id}</p>
        </div>

        {/* Meta */}
        <div className="grid gap-4 border-b border-zinc-100 px-6 py-5 sm:grid-cols-3 sm:px-8 dark:border-zinc-800">
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Prepared For</h3>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{quote.clientName}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{quote.jobTitle}</p>
          </div>
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Date</h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              {new Date(quote.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Valid Until</h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              {new Date(quote.validUntil).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Line Items */}
        <div className="px-6 py-5 sm:px-8">
          <table className="w-full" role="table" aria-label="Quote line items">
            <thead>
              <tr className="border-b-2 border-zinc-100 dark:border-zinc-800">
                <th className="pb-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">Description</th>
                <th className="pb-2 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400">Qty</th>
                <th className="hidden pb-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400 sm:table-cell">Unit Price</th>
                <th className="pb-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">Total</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORY_ORDER.map((cat) => {
                const items = groupedItems[cat];
                if (!items || items.length === 0) return null;
                return (
                  <CategoryGroup key={cat} category={cat} items={items} />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-zinc-100 px-6 py-5 sm:px-8 dark:border-zinc-800">
          <div className="ml-auto max-w-xs space-y-1.5">
            <SummaryRow label="Labor" cents={quote.laborSubtotalCents} />
            <SummaryRow label="Materials" cents={quote.materialsSubtotalCents} />
            <SummaryRow label="Other" cents={quote.otherSubtotalCents} />
            <div className="border-t border-zinc-100 pt-1.5 dark:border-zinc-800">
              <SummaryRow label="Subtotal" cents={quote.subtotalCents} bold />
            </div>
            {quote.discountPct > 0 && (
              <SummaryRow label={`Discount (${quote.discountPct}%)`} cents={-quote.discountCents} />
            )}
            {quote.taxPct > 0 && (
              <SummaryRow label={`Tax (${quote.taxPct}%)`} cents={quote.taxCents} />
            )}
            <div className="border-t-2 border-[#00a9e0] pt-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">Total</span>
                <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {formatCents(quote.totalCents)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scope */}
        <div className="border-t border-zinc-100 px-6 py-5 sm:px-8 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Scope of Work</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {quote.scopeOfWork}
          </p>
        </div>

        {/* Timeline & Terms */}
        <div className="grid gap-4 border-t border-zinc-100 px-6 py-5 sm:grid-cols-2 sm:px-8 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Timeline</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{quote.timeline}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Payment Terms</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{quote.paymentTerms}</p>
          </div>
        </div>

        {/* Client Actions (only in client mode) */}
        {mode === 'client' && quote.status === 'sent' && (
          <div className="border-t border-zinc-100 px-6 py-6 sm:px-8 dark:border-zinc-800 print:hidden">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAccept}
                disabled={accepting}
                className="flex-1 rounded-full bg-[#00a9e0] py-3 text-sm font-bold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] active:scale-[0.98] disabled:opacity-50 sm:flex-none sm:px-8"
              >
                {accepting ? 'Accepting...' : 'Accept Quote'}
              </button>
              <button
                type="button"
                onClick={handleDecline}
                disabled={declining}
                className="flex-1 rounded-full border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 sm:flex-none sm:px-8"
              >
                {declining ? 'Declining...' : 'Decline'}
              </button>
              {onRequestChanges && (
                <button
                  type="button"
                  onClick={onRequestChanges}
                  className="text-sm font-medium text-[#00a9e0] hover:text-[#0090c0]"
                >
                  Request Changes
                </button>
              )}
            </div>
          </div>
        )}

        {/* Accepted/Declined Status */}
        {quote.status === 'accepted' && (
          <div className="border-t border-emerald-200 bg-emerald-50 px-6 py-4 sm:px-8 dark:border-emerald-800 dark:bg-emerald-900/20 print:hidden">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Quote accepted
              </p>
            </div>
          </div>
        )}

        {quote.status === 'declined' && (
          <div className="border-t border-red-200 bg-red-50 px-6 py-4 sm:px-8 dark:border-red-800 dark:bg-red-900/20 print:hidden">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                Quote declined
              </p>
            </div>
          </div>
        )}

        {/* Signature Lines (print only) */}
        <div className="hidden border-t border-zinc-100 px-6 py-8 sm:px-8 dark:border-zinc-800 print:flex print:gap-12">
          <div className="flex-1">
            <div className="mt-12 border-t border-zinc-300 pt-2 text-xs text-zinc-400">
              Client Signature / Date
            </div>
          </div>
          <div className="flex-1">
            <div className="mt-12 border-t border-zinc-300 pt-2 text-xs text-zinc-400">
              Contractor Signature / Date
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CategoryGroup({ category, items }: { category: string; items: QuoteLineItem[] }) {
  return (
    <>
      <tr>
        <td
          colSpan={4}
          className="bg-sky-50/50 px-0 py-2 text-xs font-bold text-[#0284c7] dark:bg-sky-900/10 dark:text-sky-400"
        >
          {CATEGORY_LABELS[category]}
        </td>
      </tr>
      {items.map((item) => (
        <tr key={item.id} className="border-b border-zinc-50 dark:border-zinc-800/50">
          <td className="py-2 pr-2 text-sm text-zinc-700 dark:text-zinc-300">{item.description}</td>
          <td className="py-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {item.quantity} {item.unit}
          </td>
          <td className="hidden py-2 text-right text-sm text-zinc-500 sm:table-cell dark:text-zinc-400">
            {formatCents(item.unitCostCents)}
          </td>
          <td className="py-2 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {formatCents(item.totalCents)}
          </td>
        </tr>
      ))}
    </>
  );
}

function SummaryRow({ label, cents, bold }: { label: string; cents: number; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? 'font-semibold text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'}>
        {label}
      </span>
      <span className={bold ? 'font-semibold text-zinc-900 dark:text-zinc-50' : 'text-zinc-600 dark:text-zinc-300'}>
        {cents < 0 ? `-${formatCents(Math.abs(cents))}` : formatCents(cents)}
      </span>
    </div>
  );
}
