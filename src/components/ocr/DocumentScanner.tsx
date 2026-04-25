'use client';

import { useState, useCallback, useRef } from 'react';
import type { DocumentResult } from '@/lib/services/ocr-service';
import { isExpiringSoon, isExpired } from '@/lib/services/ocr-service';

function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(remainder).padStart(2, '0')}`;
}

const DOC_LABELS: Record<string, string> = {
  insurance_certificate: 'Insurance Certificate',
  license: 'Trade License',
  invoice: 'Invoice',
  estimate: 'Estimate',
  contract: 'Contract',
};

interface Props {
  onSave?: (data: DocumentResult) => void;
  onClose?: () => void;
}

export default function DocumentScanner({ onSave, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
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
      fd.append('type', 'document');
      const res = await fetch('/api/ocr?type=document', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Scan failed');
      setResult(json.data as DocumentResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const confidenceColor = (c: number) =>
    c >= 0.9 ? 'text-emerald-600 dark:text-emerald-400' : c >= 0.8 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500';

  const expirationWarning = (date: string) => {
    if (isExpired(date)) return <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">Expired</span>;
    if (isExpiringSoon(date)) return <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Expiring soon</span>;
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Scan Document</h3>
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {file ? file.name : 'Upload license, insurance, invoice, or contract'}
          </p>
          <p className="text-xs text-zinc-400">JPG, PNG, PDF, HEIC up to 10MB</p>
          <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}

      {preview && !result && (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Document preview" className="max-h-48 w-full object-contain bg-zinc-100 dark:bg-zinc-800" />
        </div>
      )}

      {file && !result && (
        <button type="button" onClick={handleScan} disabled={scanning} className="w-full rounded-lg bg-[#00a9e0] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0090c0] disabled:opacity-60">
          {scanning ? 'Scanning...' : 'Scan Document'}
        </button>
      )}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

      {/* Results */}
      {result && (
        <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              {DOC_LABELS[result.type] ?? result.type}
            </span>
            <span className={`text-xs font-medium ${confidenceColor(result.confidence)}`}>
              {(result.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>

          {/* Dynamic fields based on type */}
          <div className="space-y-2 text-sm">
            {result.type === 'insurance_certificate' && (
              <>
                <Field label="Insurer" value={result.insurer} />
                <Field label="Policy Number" value={result.policyNumber} />
                <Field label="Holder" value={result.holder} />
                <Field label="General Liability" value={formatCents(result.coverage.generalLiability)} />
                <Field label="Aggregate" value={formatCents(result.coverage.aggregate)} />
                <Field label="Effective" value={result.effective} />
                <Field label="Expiration" value={result.expiration} extra={expirationWarning(result.expiration)} />
              </>
            )}
            {result.type === 'license' && (
              <>
                <Field label="License Number" value={result.licenseNumber} />
                <Field label="Holder" value={result.holder} />
                <Field label="Issuer" value={result.issuer} />
                <Field label="Trade" value={result.trade} />
                <Field label="Expiration" value={result.expiration} extra={expirationWarning(result.expiration)} />
              </>
            )}
            {result.type === 'invoice' && (
              <>
                <Field label="Vendor" value={result.vendor} />
                <Field label="Invoice #" value={result.invoiceNumber} />
                <Field label="Date" value={result.date} />
                <Field label="Due" value={result.dueDate} />
                <Field label="Total" value={formatCents(result.total)} />
              </>
            )}
            {result.type === 'estimate' && (
              <>
                <Field label="Vendor" value={result.vendor} />
                <Field label="Estimate #" value={result.estimateNumber} />
                <Field label="Date" value={result.date} />
                <Field label="Total" value={formatCents(result.total)} />
                <Field label="Valid Until" value={result.validUntil} />
              </>
            )}
            {result.type === 'contract' && (
              <>
                <Field label="Parties" value={result.parties.join(', ')} />
                <Field label="Date" value={result.date} />
                <Field label="Scope" value={result.scope} />
                <Field label="Value" value={formatCents(result.totalValue)} />
              </>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => onSave?.(result)} className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700">
              Verify &amp; Save
            </button>
            <button type="button" onClick={() => { setResult(null); setFile(null); setPreview(null); }} className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
              Scan Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, extra }: { label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white">
        {value} {extra}
      </span>
    </div>
  );
}
