'use client';

import { useState, useMemo, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtDollars(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString('en-US')}.${String(remainder).padStart(2, '0')}`;
}

const IRS_RATE_CENTS = 67; // $0.67 per mile (2024 rate)

/** Mock distance calculator — returns a plausible mileage based on address strings */
function mockDistance(origin: string, destination: string): number {
  // Deterministic-ish based on combined string length for consistent results
  const seed = (origin.length + destination.length) * 7;
  return 5 + (seed % 26); // 5–30 miles
}

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface MileageTrip {
  id: string;
  date: string;
  origin: string;
  destination: string;
  miles: number;
  deductionCents: number;
}

/* ------------------------------------------------------------------ */
/* Sample trips                                                       */
/* ------------------------------------------------------------------ */

const sampleTrips: MileageTrip[] = [
  { id: '1', date: '2026-04-14', origin: '100 Main St, Manchester NH', destination: '45 Oak St, Concord NH', miles: 22, deductionCents: 22 * IRS_RATE_CENTS },
  { id: '2', date: '2026-04-12', origin: '100 Main St, Manchester NH', destination: 'Home Depot, Nashua NH', miles: 18, deductionCents: 18 * IRS_RATE_CENTS },
  { id: '3', date: '2026-04-10', origin: '100 Main St, Manchester NH', destination: '78 Pine Rd, Nashua NH', miles: 15, deductionCents: 15 * IRS_RATE_CENTS },
  { id: '4', date: '2026-04-08', origin: '100 Main St, Manchester NH', destination: '210 Maple Dr, Portsmouth NH', miles: 28, deductionCents: 28 * IRS_RATE_CENTS },
  { id: '5', date: '2026-04-05', origin: '100 Main St, Manchester NH', destination: '33 Birch Ln, Dover NH', miles: 24, deductionCents: 24 * IRS_RATE_CENTS },
  { id: '6', date: '2026-03-28', origin: '100 Main St, Manchester NH', destination: '120 Elm Ave, Concord NH', miles: 20, deductionCents: 20 * IRS_RATE_CENTS },
  { id: '7', date: '2026-03-20', origin: '100 Main St, Manchester NH', destination: '15 Cedar Way, Keene NH', miles: 30, deductionCents: 30 * IRS_RATE_CENTS },
  { id: '8', date: '2026-03-15', origin: '100 Main St, Manchester NH', destination: '88 Walnut Ct, Laconia NH', miles: 26, deductionCents: 26 * IRS_RATE_CENTS },
];

const monthlyData = [
  { month: 'Jan', miles: 248, deductionCents: 248 * IRS_RATE_CENTS },
  { month: 'Feb', miles: 310, deductionCents: 310 * IRS_RATE_CENTS },
  { month: 'Mar', miles: 425, deductionCents: 425 * IRS_RATE_CENTS },
  { month: 'Apr', miles: 183, deductionCents: 183 * IRS_RATE_CENTS },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function MileageCalculator() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [trips, setTrips] = useState<MileageTrip[]>(sampleTrips);
  const [calculatedMiles, setCalculatedMiles] = useState<number | null>(null);

  const handleCalculate = useCallback(() => {
    if (!origin.trim() || !destination.trim()) return;
    const miles = mockDistance(origin, destination);
    setCalculatedMiles(miles);
  }, [origin, destination]);

  const handleLogTrip = useCallback(() => {
    if (calculatedMiles === null) return;
    const newTrip: MileageTrip = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      origin: origin.trim(),
      destination: destination.trim(),
      miles: calculatedMiles,
      deductionCents: calculatedMiles * IRS_RATE_CENTS,
    };
    setTrips((prev) => [newTrip, ...prev]);
    setOrigin('');
    setDestination('');
    setCalculatedMiles(null);
  }, [origin, destination, calculatedMiles]);

  const annualMiles = useMemo(
    () => monthlyData.reduce((s, m) => s + m.miles, 0) + trips.reduce((s, t) => s + t.miles, 0),
    [trips]
  );
  const annualDeductionCents = annualMiles * IRS_RATE_CENTS;
  const maxMonthlyMiles = Math.max(...monthlyData.map((m) => m.miles));

  return (
    <div className="space-y-6">
      {/* Annual summary card */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Annual Mileage Summary</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              {annualMiles.toLocaleString()} miles
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Total Deduction</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              {fmtDollars(annualDeductionCents)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-emerald-800 dark:text-emerald-400">
          You saved {fmtDollars(annualDeductionCents)} on taxes from mileage tracking at $0.67/mile (IRS standard rate).
        </p>
      </div>

      {/* Trip calculator */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">Log a Trip</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="trip-origin" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Origin
            </label>
            <input
              id="trip-origin"
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setCalculatedMiles(null);
              }}
              placeholder="e.g. 100 Main St, Manchester NH"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:ring-1 focus:ring-[#00a9e0] focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="trip-dest" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Destination
            </label>
            <input
              id="trip-dest"
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setCalculatedMiles(null);
              }}
              placeholder="e.g. 45 Oak St, Concord NH"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:ring-1 focus:ring-[#00a9e0] focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Calculate button */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={!origin.trim() || !destination.trim()}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
            </svg>
            Calculate Distance
          </button>

          {calculatedMiles !== null && (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-[#00a9e0]/30 bg-[#00a9e0]/5 px-4 py-2.5 dark:border-[#00a9e0]/20 dark:bg-[#00a9e0]/10">
                <span className="text-sm font-bold text-[#00a9e0]">{calculatedMiles} miles</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">=</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmtDollars(calculatedMiles * IRS_RATE_CENTS)}</span>
                <span className="text-xs text-zinc-400">deduction</span>
              </div>

              <button
                type="button"
                onClick={handleLogTrip}
                className="flex items-center gap-2 rounded-lg bg-[#00a9e0] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0090c0]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Log Trip
              </button>
            </>
          )}
        </div>
      </div>

      {/* Monthly chart */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">Monthly Summary</h3>
        <div className="flex items-end gap-3" style={{ height: '140px' }}>
          {monthlyData.map((m) => {
            const pct = (m.miles / maxMonthlyMiles) * 100;
            return (
              <div key={m.month} className="group relative flex flex-1 flex-col items-center justify-end" style={{ height: '100%' }}>
                <div
                  className="w-full rounded-t bg-[#00a9e0]/70 transition-all group-hover:bg-[#00a9e0] dark:bg-[#00a9e0]/50 dark:group-hover:bg-[#00a9e0]/80"
                  style={{ height: `${pct}%` }}
                />
                <span className="mt-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">{m.month}</span>
                <span className="text-[10px] text-zinc-400">{m.miles} mi</span>
                {/* Tooltip */}
                <div className="pointer-events-none absolute -top-10 left-1/2 z-10 w-28 -translate-x-1/2 rounded bg-zinc-900 px-2 py-1.5 text-center text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-700">
                  <p>{m.miles} miles</p>
                  <p className="text-emerald-300">{fmtDollars(m.deductionCents)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent trips */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Recent Trips</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Mileage trips">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Origin</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Destination</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Miles</th>
                <th className="px-6 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Deduction</th>
              </tr>
            </thead>
            <tbody>
              {trips.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-b border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-3 text-xs text-zinc-500 dark:text-zinc-400">{t.date}</td>
                  <td className="px-3 py-3 text-zinc-700 dark:text-zinc-300">{t.origin}</td>
                  <td className="px-3 py-3 text-zinc-700 dark:text-zinc-300">{t.destination}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums text-zinc-900 dark:text-white">{t.miles}</td>
                  <td className="px-6 py-3 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{fmtDollars(t.deductionCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
