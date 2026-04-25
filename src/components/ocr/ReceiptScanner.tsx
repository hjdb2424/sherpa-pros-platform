'use client';

import { useState, useCallback, useRef } from 'react';
import type { ReceiptResult } from '@/lib/services/ocr-service';

function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(remainder).padStart(2, '0')}`;
}

interface Props {
  onAddExpense?: (data: ReceiptResult) => void;
  onClose?: () => void;
}

export default function ReceiptScanner({ onAddExpense, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ReceiptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'receipt');
      const res = await fetch('/api/ocr?type=receipt', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Scan failed');
      setResult(json.data as ReceiptResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const confidenceColor = (c: number) =>
    c >= 0.9 ? 'text-emerald-600 dark:text-emerald-400' : c >= 0.8 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Scan Receipt</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" aria-label="Close">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Upload area */}
      {!result && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center transition-colors hover:border-sky-400 hover:bg-sky-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-sky-600 dark:hover:bg-sky-900/10"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <svg className="h-10 w-10 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
          </svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {file ? file.name : 'Tap to take photo or drop receipt image'}
          </p>
          <p className="text-xs text-zinc-400">JPG, PNG, PDF, HEIC up to 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Preview */}
      {preview && !result && (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Receipt preview" className="max-h-48 w-full object-contain bg-zinc-100 dark:bg-zinc-800" />
        </div>
      )}

      {/* Scan button */}
      {file && !result && (
        <button
          type="button"
          onClick={handleScan}
          disabled={scanning}
          className="w-full rounded-lg bg-[#00a9e0] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0090c0] disabled:opacity-60"
        >
          {scanning ? 'Scanning...' : 'Scan Receipt'}
        </button>
      )}

      {/* Error */}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

      {/* Results */}
      {result && (
        <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-zinc-900 dark:text-white">{result.vendor}</h4>
            <span className={`text-xs font-medium ${confidenceColor(result.confidence)}`}>
              {(result.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{result.date} &middot; {result.paymentMethod}</p>

          {/* Line items */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {result.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="text-zinc-700 dark:text-zinc-300">
                  {item.description} <span className="text-zinc-400">x{item.quantity}</span>
                </span>
                <span className="font-medium text-zinc-900 dark:text-white">{formatCents(item.amount)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-200 pt-2 dark:border-zinc-700">
            <span className="text-sm text-zinc-500">Tax</span>
            <span className="text-sm font-medium text-zinc-900 dark:text-white">{formatCents(result.tax)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-900 dark:text-white">Total</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">{formatCents(result.total)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => onAddExpense?.(result)}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            >
              Add to Expenses
            </button>
            <button
              type="button"
              onClick={() => { setResult(null); setFile(null); setPreview(null); }}
              className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Scan Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
