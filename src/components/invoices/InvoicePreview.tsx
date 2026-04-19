'use client';

import { useState, useCallback } from 'react';
import type { Invoice } from '@/lib/services/invoices';

interface InvoicePreviewProps {
  invoice: Invoice;
}

function formatCents(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handlePrint = useCallback(async () => {
    try {
      const res = await fetch(`/api/invoices/${invoice.id}?format=html`);
      const html = await res.text();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      }
    } catch {
      // Fallback: just print current page
      window.print();
    }
  }, [invoice.id]);

  const handleSend = useCallback(() => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  }, []);

  const statusConfig = {
    draft: { label: 'Draft', bg: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300' },
    sent: { label: 'Sent', bg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
    paid: { label: 'Paid', bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
  };

  const status = statusConfig[invoice.status];
  const createdDate = new Date(invoice.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      {/* Header */}
      <div className="border-b border-zinc-100 p-5 dark:border-zinc-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Invoice</h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {invoice.id.toUpperCase()} &middot; {createdDate}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.bg}`}>
            {status.label}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              From
            </p>
            <p className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">{invoice.proName}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Bill To
            </p>
            <p className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">{invoice.clientName}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Job: {invoice.jobTitle}</p>
      </div>

      {/* Line Items */}
      <div className="p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-600">
              <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Item
              </th>
              <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Qty
              </th>
              <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Price
              </th>
              <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, idx) => (
              <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-700">
                <td className="py-2.5 text-zinc-700 dark:text-zinc-300">{item.description}</td>
                <td className="py-2.5 text-center text-zinc-500 dark:text-zinc-400">{item.quantity}</td>
                <td className="py-2.5 text-right text-zinc-500 dark:text-zinc-400">
                  {formatCents(item.unitPrice)}
                </td>
                <td className="py-2.5 text-right font-medium text-zinc-900 dark:text-zinc-100">
                  {formatCents(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Subtotals */}
        <div className="mt-4 flex justify-end">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Materials</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCents(invoice.materialsSubtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Labor</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCents(invoice.laborSubtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                Service Fee ({invoice.serviceFeePct}%)
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCents(invoice.serviceFeeCents)}
              </span>
            </div>
            <div className="flex justify-between border-t-2 border-zinc-900 pt-2 dark:border-zinc-300">
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">Total</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {formatCents(invoice.totalCents)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t border-zinc-100 p-5 dark:border-zinc-700">
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
        >
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </span>
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || sent}
          className="flex-1 rounded-full bg-[#00a9e0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sent ? 'Sent!' : sending ? 'Sending...' : 'Send to Client'}
        </button>
      </div>
    </div>
  );
}
