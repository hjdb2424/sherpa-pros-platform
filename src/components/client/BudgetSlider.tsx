'use client';

import { useState, useCallback } from 'react';

interface BudgetSliderProps {
  min: number;
  max: number;
  suggestedMin: number;
  suggestedMax: number;
  absoluteMin?: number;
  absoluteMax?: number;
  onChange: (min: number, max: number) => void;
  category?: string;
  letProsSuggest: boolean;
  onLetProsSuggestChange: (value: boolean) => void;
}

export function BudgetSlider({
  min,
  max,
  suggestedMin,
  suggestedMax,
  absoluteMin = 50,
  absoluteMax = 25000,
  onChange,
  category,
  letProsSuggest,
  onLetProsSuggestChange,
}: BudgetSliderProps) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  const isBelowMarket = localMax < suggestedMin;
  const isRealistic = localMin >= suggestedMin * 0.7 && localMax <= suggestedMax * 1.5;

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Number(e.target.value), localMax - 50);
      setLocalMin(value);
      onChange(value, localMax);
    },
    [localMax, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(Number(e.target.value), localMin + 50);
      setLocalMax(value);
      onChange(localMin, value);
    },
    [localMin, onChange]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-700">Your budget range</h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-zinc-900">
              ${localMin.toLocaleString()} &ndash; ${localMax.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="relative mt-8 h-2">
          <div className="absolute inset-0 rounded-full bg-zinc-200" />
          <div
            className="absolute inset-y-0 rounded-full bg-[#00a9e0]"
            style={{
              left: `${((localMin - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%`,
              right: `${100 - ((localMax - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={absoluteMin}
            max={absoluteMax}
            step={25}
            value={localMin}
            onChange={handleMinChange}
            className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00a9e0] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
            aria-label="Minimum budget"
          />
          <input
            type="range"
            min={absoluteMin}
            max={absoluteMax}
            step={25}
            value={localMax}
            onChange={handleMaxChange}
            className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00a9e0] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
            aria-label="Maximum budget"
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-zinc-400">
          <span>${absoluteMin}</span>
          <span>${absoluteMax.toLocaleString()}</span>
        </div>

        <div className="mt-4 rounded-lg bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
          Typical range for {category || 'this category'}:{' '}
          <span className="font-medium text-zinc-700">
            ${suggestedMin.toLocaleString()} &ndash; ${suggestedMax.toLocaleString()}
          </span>
        </div>

        {isRealistic && !letProsSuggest && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Budget looks realistic for this type of project
          </div>
        )}

        {isBelowMarket && !letProsSuggest && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-xs font-medium text-[#ff4500]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            This budget is below typical rates for {category || 'this category'}
          </div>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-white p-4">
        <div>
          <span className="text-sm font-medium text-zinc-700">Not sure? Let Pros suggest pricing</span>
          <p className="text-xs text-zinc-400">Pros will include their recommended price with their bid</p>
        </div>
        <div className="relative">
          <input
            type="checkbox"
            checked={letProsSuggest}
            onChange={(e) => onLetProsSuggestChange(e.target.checked)}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-zinc-200 transition-colors peer-checked:bg-[#00a9e0] peer-focus-visible:ring-2 peer-focus-visible:ring-[#00a9e0]/30" />
          <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </div>
      </label>
    </div>
  );
}
