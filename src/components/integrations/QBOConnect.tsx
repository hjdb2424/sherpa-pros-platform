'use client';

import { useState, useEffect } from 'react';

export default function QBOConnect() {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    // Check for QBO connection cookie or URL param
    const params = new URLSearchParams(window.location.search);
    if (params.get('qbo') === 'connected') {
      setConnected(true);
      setLastSync(new Date().toISOString());
    }

    // Check cookie for existing connection
    const cookies = document.cookie.split(';').map((c) => c.trim());
    const qboCookie = cookies.find((c) => c.startsWith('sherpa-qbo='));
    if (qboCookie) {
      setConnected(true);
      if (!lastSync) {
        setLastSync(new Date().toISOString());
      }
    }
  }, [lastSync]);

  async function handleSync() {
    setSyncing(true);
    try {
      await fetch('/api/qbo/invoices');
      setLastSync(new Date().toISOString());
    } catch {
      // silently fail in mock mode
    } finally {
      setSyncing(false);
    }
  }

  function handleDisconnect() {
    document.cookie = 'sherpa-qbo=; path=/; max-age=0';
    setConnected(false);
    setLastSync(null);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-3">
        {/* QBO Logo */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2CA01C]/10">
          <svg className="h-6 w-6 text-[#2CA01C]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              QuickBooks Online
            </h3>
            {connected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Connected
              </span>
            )}
          </div>

          {connected ? (
            <div className="mt-1">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Invoices and expenses sync automatically.
              </p>
              {lastSync && (
                <p className="mt-0.5 text-xs text-zinc-400">
                  Last synced: {new Date(lastSync).toLocaleString()}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing}
                  className="rounded-lg bg-[#2CA01C] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#248a17] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-xs font-medium text-zinc-500 underline underline-offset-2 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-1">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Connect QuickBooks to sync invoices and track expenses.
              </p>
              <a
                href="/api/qbo/connect"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#2CA01C] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#248a17]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                Connect QuickBooks
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
