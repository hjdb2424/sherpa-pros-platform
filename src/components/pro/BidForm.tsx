'use client';

import { useState } from 'react';

interface BidFormProps {
  jobId: string;
  budgetMin: number;
  budgetMax: number;
}

export default function BidForm({ jobId, budgetMin, budgetMax }: BidFormProps) {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Wire to API
    console.log('Bid submitted:', { jobId, amount, duration, message });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center dark:border-emerald-700 dark:bg-emerald-950/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-bold text-emerald-800 dark:text-emerald-300">Bid Submitted</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          You will be notified when the client responds.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Submit Your Bid</h3>

      <div>
        <label htmlFor="bid-amount" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Bid Amount
        </label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
          <input
            id="bid-amount"
            type="number"
            min={0}
            step={50}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`${budgetMin} - ${budgetMax}`}
            required
            className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-7 pr-3 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <p className="mt-1 text-xs text-zinc-500">Client budget: ${budgetMin.toLocaleString()} - ${budgetMax.toLocaleString()}</p>
      </div>

      <div>
        <label htmlFor="bid-duration" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Estimated Duration
        </label>
        <select
          id="bid-duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="">Select duration</option>
          <option value="Less than 1 day">Less than 1 day</option>
          <option value="1 day">1 day</option>
          <option value="2-3 days">2-3 days</option>
          <option value="4-5 days">4-5 days</option>
          <option value="1 week">1 week</option>
          <option value="2 weeks">2 weeks</option>
          <option value="3+ weeks">3+ weeks</option>
        </select>
      </div>

      <div>
        <label htmlFor="bid-message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Message to Client
        </label>
        <textarea
          id="bid-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your approach, relevant experience, and availability..."
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-amber-500 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-amber-600 active:bg-amber-700"
      >
        Submit Bid
      </button>
    </form>
  );
}
