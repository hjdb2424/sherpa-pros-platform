'use client';

import { useState, useRef, useCallback } from 'react';
import type { Form1099NEC } from '@/lib/services/tax-1099-generator';

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

function maskTin(tin: string): string {
  const digits = tin.replace(/\D/g, '');
  if (digits.length < 4) return '***-**-****';
  return `***-**-${digits.slice(-4)}`;
}

type FormStatus = 'Draft' | 'Filed' | 'Corrected';

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function Form1099Preview({
  form,
  initialStatus = 'Draft',
}: {
  form: Form1099NEC;
  initialStatus?: FormStatus;
}) {
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [eFileSuccess, setEFileSuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadPDF = useCallback(() => {
    // In production: call a server action that returns a real PDF.
    // For now: open a new window with print-ready HTML.
    const { generate1099PDF } = require('@/lib/services/tax-1099-generator');
    const html = generate1099PDF(form);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
  }, [form]);

  const handleEFile = useCallback(() => {
    setEFileSuccess(true);
    setStatus('Filed');
    setTimeout(() => setEFileSuccess(false), 4000);
  }, []);

  const statusStyles: Record<FormStatus, string> = {
    Draft: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    Filed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    Corrected: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            1099-NEC Preview
          </h3>
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m0 0a48.003 48.003 0 0 1 12.5 0m-12.5 0V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v3.284" />
            </svg>
            Print
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </button>
          <button
            type="button"
            onClick={handleEFile}
            disabled={status === 'Filed'}
            className="flex items-center gap-1.5 rounded-lg bg-[#00a9e0] px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0090c0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            E-File
          </button>
        </div>
      </div>

      {/* E-file success banner */}
      {eFileSuccess && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            1099-NEC for {form.recipientName} submitted successfully to the IRS e-file system.
          </p>
        </div>
      )}

      {/* Form preview */}
      <div
        ref={previewRef}
        className="overflow-hidden rounded-xl border-2 border-zinc-300 bg-white font-mono text-xs text-black dark:border-zinc-600"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b-2 border-black bg-zinc-50 px-6 py-3">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-red-600">CORRECTED (if checked) &#9744;</span>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold tracking-widest">1099-NEC</p>
            <p className="text-[10px]">Nonemployee Compensation</p>
            <p className="text-[9px] text-zinc-500">Department of the Treasury -- Internal Revenue Service</p>
          </div>
          <div className="text-right">
            <p className="font-bold">Tax Year {form.taxYear}</p>
            <p className="text-[9px] text-zinc-500">Copy B -- For Recipient</p>
          </div>
        </div>

        {/* Payer + Recipient grid */}
        <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black">
          {/* Payer */}
          <div className="border-b-2 border-black p-4">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">Payer&apos;s Name, Address</p>
            <p className="font-bold">{form.payerName}</p>
            <p>{form.payerAddress}</p>
          </div>
          {/* Payer TIN */}
          <div className="border-b-2 border-black p-4">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">Payer&apos;s TIN</p>
            <p className="text-base font-bold">{maskTin(form.payerTin)}</p>
          </div>
          {/* Recipient */}
          <div className="p-4">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">Recipient&apos;s Name, Address</p>
            <p className="font-bold">{form.recipientName}</p>
            <p>{form.recipientAddress}</p>
          </div>
          {/* Recipient TIN */}
          <div className="p-4">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">Recipient&apos;s TIN</p>
            <p className="text-base font-bold">{maskTin(form.recipientTin)}</p>
          </div>
        </div>

        {/* Amount boxes */}
        <div className="grid grid-cols-4 divide-x-2 divide-black">
          {/* Box 1 */}
          <div className="p-4 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">1. Nonemployee Compensation</p>
            <p className="mt-3 text-2xl font-bold">{fmtDollars(form.nonemployeeCompensation)}</p>
          </div>
          {/* Box 4 */}
          <div className="p-4 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">4. Federal Tax Withheld</p>
            <p className="mt-3 text-lg font-bold">{fmtDollars(form.federalTaxWithheld)}</p>
          </div>
          {/* Box 5 */}
          <div className="p-4 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">5. State Tax Withheld</p>
            <p className="mt-3 text-lg font-bold">{fmtDollars(form.stateTaxWithheld)}</p>
          </div>
          {/* Box 6 + 7 */}
          <div className="p-4 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">6. State/Payer No.</p>
            <p className="mt-1 font-bold">{form.statePayerNumber || 'N/A'}</p>
            <div className="mt-3 border-t border-zinc-300 pt-2">
              <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">7. State Income</p>
              <p className="font-bold">{fmtDollars(form.stateIncome)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-2 text-center text-[8px] text-zinc-400">
          Form 1099-NEC (Rev. 1-2024) &bull; Cat. No. 72590N
        </div>
      </div>
    </div>
  );
}
