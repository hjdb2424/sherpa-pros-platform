'use client';

import { useState, useRef } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      inputRef.current?.focus();
      return;
    }

    try {
      const existing: string[] = JSON.parse(
        localStorage.getItem('sherpa-waitlist') || '[]'
      );
      if (!existing.includes(trimmed)) {
        existing.push(trimmed);
        localStorage.setItem('sherpa-waitlist', JSON.stringify(existing));
      }
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-5 backdrop-blur-sm">
        <svg
          className="h-8 w-8 text-emerald-400"
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
        <p className="text-center text-sm font-medium text-emerald-300">
          You are on the list. We will notify you when Sherpa Pros launches in your
          area.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email for early access"
          aria-label="Email address"
          className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-5 text-base text-white placeholder-white/40 outline-none backdrop-blur-sm transition-all duration-300 focus:border-[#00a9e0]/60 focus:bg-white/[0.08] focus:shadow-[0_0_24px_rgba(0,169,224,0.15)] focus:ring-1 focus:ring-[#00a9e0]/40"
        />
        {error && (
          <p className="absolute -bottom-6 left-1 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="relative h-14 shrink-0 overflow-hidden rounded-xl bg-[#00a9e0] px-7 text-base font-semibold text-white shadow-lg shadow-[#00a9e0]/20 transition-all duration-200 hover:bg-[#0098ca] hover:shadow-xl hover:shadow-[#00a9e0]/30 active:scale-[0.97]"
      >
        <span className="relative z-10">Notify Me</span>
        <span className="absolute inset-0 animate-[glow-pulse_3s_ease-in-out_infinite] rounded-xl bg-[#00a9e0]/30 blur-md" />
      </button>
    </form>
  );
}
