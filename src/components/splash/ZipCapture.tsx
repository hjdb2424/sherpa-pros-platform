'use client';

import { useState, useRef } from 'react';

export default function ZipCapture() {
  const [zip, setZip] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const trimmed = zip.trim();
    if (!trimmed || !/^\d{5}(-\d{4})?$/.test(trimmed)) {
      setError('Please enter a valid 5-digit zip code.');
      inputRef.current?.focus();
      return;
    }

    try {
      const existing: string[] = JSON.parse(
        localStorage.getItem('sherpa-zip-interest') || '[]'
      );
      if (!existing.includes(trimmed)) {
        existing.push(trimmed);
        localStorage.setItem('sherpa-zip-interest', JSON.stringify(existing));
      }
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  if (submitted) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-[#00a9e0]/30 bg-[#00a9e0]/10 px-5 py-3 backdrop-blur-sm">
        <svg
          className="h-5 w-5 text-[#00a9e0]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm font-medium text-[#00a9e0]">
          We will notify you when Sherpa Pros launches in your area.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={10}
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter your zip code"
          aria-label="Zip code"
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-5 text-base text-white placeholder-white/40 outline-none backdrop-blur-sm transition-all duration-300 focus:border-[#00a9e0]/60 focus:bg-white/[0.08] focus:shadow-[0_0_24px_rgba(0,169,224,0.15)] focus:ring-1 focus:ring-[#00a9e0]/40"
        />
        {error && (
          <p className="absolute -bottom-6 left-1 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="h-12 shrink-0 rounded-xl bg-white/10 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 active:scale-[0.97]"
      >
        Check Availability
      </button>
    </form>
  );
}
