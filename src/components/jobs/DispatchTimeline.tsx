'use client';

/* ------------------------------------------------------------------ */
/*  Dispatch Timeline — vertical timeline for materials delivery flow  */
/* ------------------------------------------------------------------ */

export type DispatchStepStatus = 'completed' | 'active' | 'pending';

export interface DispatchStep {
  key: string;
  label: string;
  timestamp?: string;
  status: DispatchStepStatus;
  detail?: string;
}

interface DispatchTimelineProps {
  steps: DispatchStep[];
}

/* ------------------------------------------------------------------ */
/*  Default steps template                                             */
/* ------------------------------------------------------------------ */

export function buildDefaultSteps(overrides?: Partial<Record<string, Partial<Pick<DispatchStep, 'timestamp' | 'status' | 'detail'>>>>): DispatchStep[] {
  const defaults: DispatchStep[] = [
    { key: 'recommended', label: 'Materials Recommended', status: 'pending' },
    { key: 'pro_approved', label: 'Pro Approved', status: 'pending' },
    { key: 'client_approved', label: 'Client Approved', status: 'pending' },
    { key: 'order_placed', label: 'Order Placed', status: 'pending' },
    { key: 'ready_pickup', label: 'Ready for Pickup', status: 'pending' },
    { key: 'driver_assigned', label: 'Driver Assigned', status: 'pending' },
    { key: 'in_transit', label: 'In Transit', status: 'pending' },
    { key: 'delivered', label: 'Delivered to Job Site', status: 'pending' },
  ];

  if (!overrides) return defaults;

  return defaults.map((step) => {
    const override = overrides[step.key];
    if (!override) return step;
    return { ...step, ...override };
  });
}

/* ------------------------------------------------------------------ */
/*  Icons per step key                                                 */
/* ------------------------------------------------------------------ */

const STEP_ICONS: Record<string, React.ReactNode> = {
  recommended: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  ),
  pro_approved: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.194-.14 1.743" />
    </svg>
  ),
  client_approved: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  order_placed: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  ),
  ready_pickup: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  ),
  driver_assigned: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  in_transit: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  delivered: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Time formatting                                                    */
/* ------------------------------------------------------------------ */

function formatTime(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DispatchTimeline({ steps }: DispatchTimelineProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-5 text-sm font-bold text-zinc-900 dark:text-zinc-50">
        Delivery Timeline
      </h3>

      <div className="relative" role="list" aria-label="Delivery progress timeline">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const icon = STEP_ICONS[step.key] ?? STEP_ICONS.recommended;

          // Color scheme per status
          let dotClasses: string;
          let lineClasses: string;
          let textClasses: string;

          switch (step.status) {
            case 'completed':
              dotClasses = 'bg-emerald-500 text-white';
              lineClasses = 'bg-emerald-300 dark:bg-emerald-700';
              textClasses = 'text-zinc-700 dark:text-zinc-300';
              break;
            case 'active':
              dotClasses = 'bg-[#00a9e0] text-white ring-4 ring-[#00a9e0]/20';
              lineClasses = 'bg-zinc-200 dark:bg-zinc-700';
              textClasses = 'text-zinc-900 font-semibold dark:text-zinc-50';
              break;
            default:
              dotClasses = 'bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500';
              lineClasses = 'bg-zinc-200 dark:bg-zinc-700';
              textClasses = 'text-zinc-400 dark:text-zinc-500';
          }

          return (
            <div
              key={step.key}
              className="relative flex gap-3 pb-6 last:pb-0"
              role="listitem"
            >
              {/* Vertical line */}
              {!isLast && (
                <div
                  className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${
                    step.status === 'completed' ? lineClasses : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
              )}

              {/* Icon circle */}
              <div className="relative z-10 flex shrink-0">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${dotClasses}`}>
                  {step.status === 'completed' ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    icon
                  )}
                </div>
                {/* Pulse for active step */}
                {step.status === 'active' && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full bg-[#00a9e0]/30"
                    style={{ animationDuration: '2s' }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-1">
                <p className={`text-sm ${textClasses}`}>
                  {step.label}
                </p>
                {step.detail && (
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {step.detail}
                  </p>
                )}
                {step.timestamp && (
                  <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                    {formatTime(step.timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
