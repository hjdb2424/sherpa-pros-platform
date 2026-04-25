'use client';

import { useState, useCallback, useRef } from 'react';
import type { PhotoResult } from '@/lib/services/ocr-service';

interface Props {
  onAddToJob?: (data: PhotoResult) => void;
  onClose?: () => void;
}

export default function PhotoAnalyzer({ onAddToJob, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<PhotoResult | null>(null);
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
      fd.append('type', 'photo');
      const res = await fetch('/api/ocr?type=photo', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Analysis failed');
      setResult(json.data as PhotoResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setScanning(false);
    }
  };

  const confidenceColor = (c: number) =>
    c >= 0.9 ? 'text-emerald-600 dark:text-emerald-400' : c >= 0.8 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Analyze Photo</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" aria-label="Close">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

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
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 0 1 2.25-2.25h15A2.25 2.25 0 0 1 21.75 6v12A2.25 2.25 0 0 1 19.5 20.25H4.5A2.25 2.25 0 0 1 2.25 18Z" />
          </svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {file ? file.name : 'Upload a project photo for analysis'}
          </p>
          <p className="text-xs text-zinc-400">Before/after shots, progress photos, material deliveries</p>
          <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}

      {preview && !result && (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Photo preview" className="max-h-48 w-full object-contain bg-zinc-100 dark:bg-zinc-800" />
        </div>
      )}

      {file && !result && (
        <button type="button" onClick={handleScan} disabled={scanning} className="w-full rounded-lg bg-[#00a9e0] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0090c0] disabled:opacity-60">
          {scanning ? 'Analyzing...' : 'Analyze Photo'}
        </button>
      )}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

      {result && (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {preview && (
            <div className="overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Analyzed photo" className="max-h-40 w-full object-contain bg-zinc-100 dark:bg-zinc-800" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              {result.workPhase}
            </span>
            <span className={`text-xs font-medium ${confidenceColor(result.confidence)}`}>
              {(result.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Description</h4>
            <p className="mt-1 text-sm text-zinc-900 dark:text-white">{result.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Materials Detected</h4>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {result.materialsDetected.map((m) => (
                <span key={m} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Condition Assessment</h4>
            <p className="mt-1 text-sm text-zinc-900 dark:text-white">{result.conditionAssessment}</p>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => onAddToJob?.(result)} className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700">
              Add to Job
            </button>
            <button type="button" onClick={() => { setResult(null); setFile(null); setPreview(null); }} className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
              Analyze Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
