'use client';

import { useState, useCallback } from 'react';

const tiers = [
  { min: 0, max: 10000, rate: 15, label: 'Starter' },
  { min: 10000, max: 50000, rate: 12, label: 'Established' },
  { min: 50000, max: 100000, rate: 10, label: 'Top Pro' },
  { min: 100000, max: 250000, rate: 8, label: 'Elite' },
];

export default function CommissionSlider() {
  const [revenue, setRevenue] = useState(25000);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRevenue(Number(e.target.value));
    },
    [],
  );

  const currentTier = tiers.find((t) => revenue >= t.min && revenue < t.max) || tiers[tiers.length - 1];
  const commission = revenue * (currentTier.rate / 100);
  const earnings = revenue - commission;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <div className="text-sm font-medium text-zinc-500">
          Annual Revenue
        </div>
        <div className="mt-1 text-3xl font-bold text-zinc-900 sm:text-4xl">
          ${revenue.toLocaleString()}
        </div>
        <div className="mt-1 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          {currentTier.label} Tier — {currentTier.rate}% Commission
        </div>
      </div>

      <div className="mt-8">
        <input
          type="range"
          min={5000}
          max={250000}
          step={5000}
          value={revenue}
          onChange={handleChange}
          className="w-full cursor-pointer accent-amber-500"
          aria-label="Annual revenue slider"
        />
        <div className="mt-2 flex justify-between text-xs text-zinc-400">
          <span>$5K</span>
          <span>$250K</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-zinc-50 p-4 text-center">
          <div className="text-xs font-medium text-zinc-500">Commission</div>
          <div className="mt-1 text-xl font-bold text-zinc-900">
            ${commission.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-400">{currentTier.rate}%</div>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-xs font-medium text-emerald-700">You Keep</div>
          <div className="mt-1 text-xl font-bold text-emerald-700">
            ${earnings.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600">
            {(100 - currentTier.rate)}%
          </div>
        </div>
      </div>

      {/* Tiers legend */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiers.map((tier) => (
          <div
            key={tier.label}
            className={`rounded-lg border p-3 text-center transition-colors ${
              currentTier.label === tier.label
                ? 'border-amber-300 bg-amber-50'
                : 'border-zinc-100 bg-zinc-50'
            }`}
          >
            <div className="text-xs font-medium text-zinc-500">
              {tier.label}
            </div>
            <div className="mt-1 text-lg font-bold text-zinc-900">
              {tier.rate}%
            </div>
            <div className="text-[10px] text-zinc-400">
              {tier.min === 0
                ? `Under $${(tier.max / 1000).toFixed(0)}K`
                : tier.max === 250000
                  ? `$${(tier.min / 1000).toFixed(0)}K+`
                  : `$${(tier.min / 1000).toFixed(0)}-${(tier.max / 1000).toFixed(0)}K`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
