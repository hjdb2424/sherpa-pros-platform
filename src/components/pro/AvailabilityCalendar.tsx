'use client';

import { useState } from 'react';
import type { WeeklyAvailability, DayAvailability } from '@/lib/mock-data/pro-data';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

interface AvailabilityCalendarProps {
  initialAvailability: WeeklyAvailability;
}

export default function AvailabilityCalendar({ initialAvailability }: AvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<WeeklyAvailability>(initialAvailability);

  function toggleDay(day: typeof DAYS[number]) {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
      } as DayAvailability,
    }));
  }

  function updateTime(day: typeof DAYS[number], field: 'startTime' | 'endTime', value: string) {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      } as DayAvailability,
    }));
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Weekly Availability</h3>

      <div className="space-y-2">
        {DAYS.map((day) => {
          const dayData = availability[day];
          return (
            <div
              key={day}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                dayData.available
                  ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20'
                  : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleDay(day)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  dayData.available
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-300 text-zinc-500 dark:bg-zinc-600 dark:text-zinc-400'
                }`}
                aria-label={`Toggle ${DAY_LABELS[day]} availability`}
                aria-pressed={dayData.available}
              >
                {DAY_LABELS[day]}
              </button>

              {dayData.available ? (
                <div className="flex flex-1 items-center gap-2 text-sm">
                  <label className="sr-only" htmlFor={`${day}-start`}>Start time</label>
                  <input
                    id={`${day}-start`}
                    type="time"
                    value={dayData.startTime}
                    onChange={(e) => updateTime(day, 'startTime', e.target.value)}
                    className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <span className="text-zinc-500">to</span>
                  <label className="sr-only" htmlFor={`${day}-end`}>End time</label>
                  <input
                    id={`${day}-end`}
                    type="time"
                    value={dayData.endTime}
                    onChange={(e) => updateTime(day, 'endTime', e.target.value)}
                    className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              ) : (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Unavailable</span>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="w-full rounded-lg bg-[#00a9e0] py-2.5 text-sm font-bold text-white shadow-lg shadow-[#00a9e0]/25 transition-colors hover:bg-[#0ea5e9] active:scale-[0.98]"
        onClick={() => console.log('Saving availability:', availability)}
      >
        Save Availability
      </button>
    </div>
  );
}
