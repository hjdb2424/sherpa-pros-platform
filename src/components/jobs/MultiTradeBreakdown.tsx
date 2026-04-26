'use client';

import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type TradeStatus = 'pending' | 'assigned' | 'in_progress' | 'completed';

export interface TradeEntry {
  tradeKey: string;
  tradeLabel: string;
  estimatedHours: number;
  sequenceOrder: number;
  assignedPro?: string;
  status: TradeStatus;
}

interface MultiTradeBreakdownProps {
  trades: TradeEntry[];
}

/* ------------------------------------------------------------------ */
/*  Status config                                                      */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<TradeStatus, { label: string; classes: string; dotColor: string }> = {
  pending: {
    label: 'Finding Pro...',
    classes: 'text-zinc-500 dark:text-zinc-400',
    dotColor: 'bg-zinc-300 dark:bg-zinc-600',
  },
  assigned: {
    label: 'Assigned',
    classes: 'text-blue-600 dark:text-blue-400',
    dotColor: 'bg-blue-500',
  },
  in_progress: {
    label: 'In Progress',
    classes: 'text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  completed: {
    label: 'Completed',
    classes: 'text-emerald-600 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
};

/* ------------------------------------------------------------------ */
/*  Trade icons                                                        */
/* ------------------------------------------------------------------ */

function TradeIcon({ tradeKey }: { tradeKey: string }) {
  const key = tradeKey.toLowerCase();

  if (key.includes('electric') || key.includes('smart')) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    );
  }
  if (key.includes('plumb')) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    );
  }
  if (key.includes('paint')) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    );
  }
  if (key.includes('tile') || key.includes('floor')) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    );
  }
  if (key.includes('carpent') || key.includes('drywall')) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.194-.14 1.743" />
      </svg>
    );
  }
  // Default handyman icon
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MultiTradeBreakdown({ trades }: MultiTradeBreakdownProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const sorted = [...trades].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  if (sorted.length <= 1) return null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </span>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          Multi-Trade Job ({sorted.length} trades)
        </h3>
      </div>

      <div className="space-y-0">
        {sorted.map((trade, idx) => {
          const isExpanded = expandedIdx === idx;
          const statusCfg = STATUS_CONFIG[trade.status];
          const isLast = idx === sorted.length - 1;
          const prevTrade = idx > 0 ? sorted[idx - 1] : null;

          return (
            <div key={trade.tradeKey}>
              {/* Sequence connector */}
              {idx > 0 && (
                <div className="ml-5 flex items-center gap-2 py-1.5">
                  <div className="h-5 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    {prevTrade?.tradeLabel} must complete first
                  </span>
                </div>
              )}

              {/* Trade card */}
              <button
                type="button"
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  isExpanded
                    ? 'border-[#00a9e0]/30 bg-[#00a9e0]/5 dark:border-[#00a9e0]/20 dark:bg-[#00a9e0]/5'
                    : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Sequence number */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    trade.status === 'completed'
                      ? 'bg-emerald-500 text-white'
                      : trade.status === 'in_progress'
                        ? 'bg-[#00a9e0] text-white'
                        : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'
                  }`}>
                    {trade.status === 'completed' ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold">{trade.sequenceOrder}</span>
                    )}
                  </div>

                  {/* Trade info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        <TradeIcon tradeKey={trade.tradeKey} />
                      </span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {trade.tradeLabel}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs">
                      <span className={`flex items-center gap-1 ${statusCfg.classes}`}>
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusCfg.dotColor}`} />
                        {trade.assignedPro || statusCfg.label}
                      </span>
                      <span className="text-zinc-400 dark:text-zinc-500">
                        ~{trade.estimatedHours}h
                      </span>
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <svg
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-3 border-t border-zinc-200/50 pt-3 dark:border-zinc-700/50">
                    <dl className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <dt className="text-zinc-500 dark:text-zinc-400">Trade</dt>
                        <dd className="font-medium text-zinc-800 dark:text-zinc-200">{trade.tradeLabel}</dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500 dark:text-zinc-400">Est. Hours</dt>
                        <dd className="font-medium text-zinc-800 dark:text-zinc-200">{trade.estimatedHours}h</dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500 dark:text-zinc-400">Assigned</dt>
                        <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                          {trade.assignedPro ?? 'Matching in progress...'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500 dark:text-zinc-400">Sequence</dt>
                        <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                          Step {trade.sequenceOrder} of {sorted.length}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Total hours */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Total Estimated
        </span>
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          {sorted.reduce((sum, t) => sum + t.estimatedHours, 0)}h across {sorted.length} trades
        </span>
      </div>
    </div>
  );
}
