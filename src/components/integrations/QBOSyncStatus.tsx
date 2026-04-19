'use client';

import { useState } from 'react';

interface QBOSyncStatusProps {
  jobId: string;
  jobTitle?: string;
  /** Show compact inline variant */
  compact?: boolean;
}

export default function QBOSyncStatus({ jobId, jobTitle, compact = false }: QBOSyncStatusProps) {
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch('/api/qbo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.invoice) {
        setSynced(true);
        setInvoiceId(data.invoice.id);
      }
    } catch {
      // silently fail in mock mode
    } finally {
      setSyncing(false);
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {synced ? (
          <>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#2CA01C]/10 px-2 py-0.5 text-xs font-medium text-[#2CA01C]">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              QBO Synced
            </span>
            {invoiceId && (
              <span className="text-xs text-zinc-400">#{invoiceId}</span>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-1 rounded-md bg-[#2CA01C] px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#248a17] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {syncing ? (
              <>
                <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
                Sync to QuickBooks
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2CA01C]/10">
            <svg className="h-4 w-4 text-[#2CA01C]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              QuickBooks Sync
            </h4>
            {jobTitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{jobTitle}</p>
            )}
          </div>
        </div>

        {synced ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#2CA01C]/10 px-2.5 py-1 text-xs font-semibold text-[#2CA01C]">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Synced
          </span>
        ) : (
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            Not synced
          </span>
        )}
      </div>

      {synced && invoiceId && (
        <div className="mt-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            QBO Invoice: <span className="font-mono font-semibold">{invoiceId}</span>
          </p>
        </div>
      )}

      {!synced && (
        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          className="mt-3 w-full rounded-lg bg-[#2CA01C] py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#248a17] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {syncing ? 'Syncing to QuickBooks...' : 'Sync to QuickBooks'}
        </button>
      )}
    </div>
  );
}
