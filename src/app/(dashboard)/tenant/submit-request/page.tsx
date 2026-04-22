'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

const categories = [
  { value: 'plumbing', label: 'Plumbing Leak', icon: '🔧' },
  { value: 'electrical', label: 'Electrical / Outlet', icon: '⚡' },
  { value: 'hvac', label: 'HVAC Not Working', icon: '🌡' },
  { value: 'appliance', label: 'Appliance Broken', icon: '🏠' },
  { value: 'pest', label: 'Pest Issue', icon: '🐜' },
  { value: 'lock', label: 'Lock / Key', icon: '🔑' },
  { value: 'other', label: 'Other', icon: '📝' },
];

const urgencyOptions = [
  {
    value: 'routine',
    label: 'Routine',
    description: 'Can wait a few days',
    color: 'border-zinc-300 peer-checked:border-[#00a9e0] peer-checked:bg-[#00a9e0]/5 dark:border-zinc-700 dark:peer-checked:border-[#0ea5e9]',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    description: 'Needs attention within 24 hours',
    color: 'border-zinc-300 peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:border-zinc-700 dark:peer-checked:border-amber-400 dark:peer-checked:bg-amber-500/10',
  },
  {
    value: 'emergency',
    label: 'Emergency',
    description: 'Immediate safety concern',
    color: 'border-zinc-300 peer-checked:border-red-500 peer-checked:bg-red-50 dark:border-zinc-700 dark:peer-checked:border-red-400 dark:peer-checked:bg-red-500/10',
  },
];

const accessTimes = ['Morning (8-12)', 'Afternoon (12-5)', 'Evening (5-8)', 'Anytime'];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SubmitRequestPage() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('routine');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [canEnter, setCanEnter] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function toggleTime(time: string) {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  /* Success screen */
  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
          <svg className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Request Submitted
        </h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          Your property manager will review it shortly. You will receive a notification when it is approved and a pro is assigned.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/tenant/my-requests"
            className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            View My Requests
          </Link>
          <Link
            href="/tenant/dashboard"
            className="rounded-lg bg-[#00a9e0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/tenant/dashboard"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Submit Maintenance Request
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Unit 102 &middot; Maple Ridge Apartments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
            What is the issue?
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                  category === cat.value
                    ? 'border-[#00a9e0] bg-[#00a9e0]/5 shadow-sm dark:border-[#0ea5e9] dark:bg-[#0ea5e9]/10'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600'
                }`}
              >
                <span className="text-xl" aria-hidden="true">{cat.icon}</span>
                <span className={`text-xs font-medium ${
                  category === cat.value
                    ? 'text-[#00a9e0] dark:text-[#0ea5e9]'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-zinc-900 dark:text-white">
            Describe the issue
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe what is happening, where in your unit, and when it started..."
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm transition-colors focus-visible:border-[#00a9e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Urgency */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
            How urgent is this?
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {urgencyOptions.map((opt) => (
              <label key={opt.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value={opt.value}
                  checked={urgency === opt.value}
                  onChange={() => setUrgency(opt.value)}
                  className="peer sr-only"
                />
                <div className={`rounded-xl border p-3 transition-all ${opt.color}`}>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{opt.description}</p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Photos */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-zinc-900 dark:text-white">
            Photos (optional)
          </label>
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white p-8 transition-colors hover:border-[#00a9e0]/50 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25a1.5 1.5 0 0 0 1.5 1.5Z" />
              </svg>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Tap to upload photos of the issue
              </p>
              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                JPG, PNG up to 10MB each
              </p>
            </div>
          </div>
        </div>

        {/* Preferred Access Times */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
            Preferred access times
          </legend>
          <div className="flex flex-wrap gap-2">
            {accessTimes.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => toggleTime(time)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  selectedTimes.includes(time)
                    ? 'border-[#00a9e0] bg-[#00a9e0]/10 text-[#00a9e0] dark:border-[#0ea5e9] dark:bg-[#0ea5e9]/10 dark:text-[#0ea5e9]'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Permission to Enter */}
        <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <button
            type="button"
            role="switch"
            aria-checked={canEnter}
            onClick={() => setCanEnter(!canEnter)}
            className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
              canEnter ? 'bg-[#00a9e0]' : 'bg-zinc-300 dark:bg-zinc-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                canEnter ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              Permission to enter
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Can maintenance enter your unit if you are not home?
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!category || !description.trim()}
          className="w-full rounded-xl bg-[#00a9e0] px-6 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
