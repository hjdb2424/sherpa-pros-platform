'use client';

import { useState } from 'react';
import ReceiptScanner from '@/components/ocr/ReceiptScanner';
import DocumentScanner from '@/components/ocr/DocumentScanner';
import PhotoAnalyzer from '@/components/ocr/PhotoAnalyzer';

type ScanMode = 'menu' | 'receipt' | 'document' | 'photo';

const RECENT_SCANS = [
  { id: '1', type: 'receipt', label: 'Home Depot', date: '2026-04-20', result: '$287.43' },
  { id: '2', type: 'document', label: 'Hartford Insurance COI', date: '2026-04-18', result: 'GL-2026-48291' },
  { id: '3', type: 'receipt', label: "Lowe's", date: '2026-04-15', result: '$142.67' },
  { id: '4', type: 'photo', label: 'Bathroom rough-in', date: '2026-04-14', result: '6 materials detected' },
  { id: '5', type: 'document', label: 'Northeast Supply Invoice', date: '2026-04-12', result: '$3,456.00' },
];

const TYPE_ICONS: Record<string, string> = {
  receipt: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  document: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  photo: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
};

export default function SmartScanPage() {
  const [mode, setMode] = useState<ScanMode>('menu');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          Smart Scan
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Scan receipts, documents, and project photos. Data is extracted automatically.
        </p>
      </div>

      {mode === 'menu' && (
        <>
          {/* Scan cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <ScanCard
              title="Scan Receipt"
              description="Extract vendor, items, total, and tax from receipts"
              color="emerald"
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              }
              onClick={() => setMode('receipt')}
            />
            <ScanCard
              title="Scan Document"
              description="Licenses, insurance, invoices, contracts, and estimates"
              color="sky"
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              }
              onClick={() => setMode('document')}
            />
            <ScanCard
              title="Analyze Photo"
              description="Detect materials, assess conditions, document progress"
              color="violet"
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 0 1 2.25-2.25h15A2.25 2.25 0 0 1 21.75 6v12A2.25 2.25 0 0 1 19.5 20.25H4.5A2.25 2.25 0 0 1 2.25 18Z" />
                </svg>
              }
              onClick={() => setMode('photo')}
            />
          </div>

          {/* Recent scans */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
              Recent Scans
            </h2>
            <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {RECENT_SCANS.map((scan) => (
                <div key={scan.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${TYPE_ICONS[scan.type]}`}>
                    {scan.type === 'receipt' && (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    )}
                    {scan.type === 'document' && (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    )}
                    {scan.type === 'photo' && (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 0 1 2.25-2.25h15A2.25 2.25 0 0 1 21.75 6v12A2.25 2.25 0 0 1 19.5 20.25H4.5A2.25 2.25 0 0 1 2.25 18Z" /></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate dark:text-white">{scan.label}</p>
                    <p className="text-xs text-zinc-400">{scan.date}</p>
                  </div>
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{scan.result}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Scanner views */}
      {mode === 'receipt' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <ReceiptScanner onClose={() => setMode('menu')} />
        </div>
      )}
      {mode === 'document' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <DocumentScanner onClose={() => setMode('menu')} />
        </div>
      )}
      {mode === 'photo' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <PhotoAnalyzer onClose={() => setMode('menu')} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scan card                                                           */
/* ------------------------------------------------------------------ */

const COLOR_MAP = {
  emerald: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-emerald-900/50 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/10',
  sky: 'border-sky-200 hover:border-sky-400 hover:bg-sky-50/50 dark:border-sky-900/50 dark:hover:border-sky-700 dark:hover:bg-sky-900/10',
  violet: 'border-violet-200 hover:border-violet-400 hover:bg-violet-50/50 dark:border-violet-900/50 dark:hover:border-violet-700 dark:hover:bg-violet-900/10',
};

const ICON_BG_MAP = {
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
};

function ScanCard({
  title,
  description,
  color,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  color: 'emerald' | 'sky' | 'violet';
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-3 rounded-xl border-2 bg-white p-6 text-center transition-all active:scale-[0.98] dark:bg-zinc-900 ${COLOR_MAP[color]}`}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${ICON_BG_MAP[color]}`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{title}</h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
    </button>
  );
}
