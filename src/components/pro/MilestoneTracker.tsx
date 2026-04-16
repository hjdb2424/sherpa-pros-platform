import type { Milestone } from '@/lib/mock-data/pro-data';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  compact?: boolean;
}

const statusConfig = {
  completed: {
    bg: 'bg-emerald-500',
    ring: 'ring-emerald-200 dark:ring-emerald-900',
    line: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Completed',
  },
  in_progress: {
    bg: 'bg-[#00a9e0]',
    ring: 'ring-sky-200 dark:ring-sky-900',
    line: 'bg-zinc-300 dark:bg-zinc-600',
    text: 'text-[#00a9e0] dark:text-sky-400',
    label: 'In Progress',
  },
  pending: {
    bg: 'bg-zinc-300 dark:bg-zinc-600',
    ring: 'ring-zinc-100 dark:ring-zinc-800',
    line: 'bg-zinc-300 dark:bg-zinc-600',
    text: 'text-zinc-500 dark:text-zinc-400',
    label: 'Pending',
  },
};

export default function MilestoneTracker({ milestones, compact = false }: MilestoneTrackerProps) {
  if (milestones.length === 0) return null;

  const completed = milestones.filter((m) => m.status === 'completed').length;
  const percentage = Math.round((completed / milestones.length) * 100);

  return (
    <div>
      {!compact && (
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Progress: {completed}/{milestones.length} milestones
          </span>
          <span className="font-semibold text-[#00a9e0] dark:text-sky-400">{percentage}%</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Job progress: ${percentage}%`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00a9e0] to-emerald-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stepper */}
      <ol className="relative space-y-0" aria-label="Milestone steps">
        {milestones.map((milestone, idx) => {
          const config = statusConfig[milestone.status];
          const isLast = idx === milestones.length - 1;

          return (
            <li key={milestone.id} className="relative flex gap-3 pb-4 last:pb-0">
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`absolute top-5 left-[11px] h-[calc(100%-12px)] w-0.5 ${config.line}`}
                  aria-hidden="true"
                />
              )}

              {/* Step circle */}
              <div className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ${config.bg} ${config.ring}`}>
                {milestone.status === 'completed' ? (
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : milestone.status === 'in_progress' ? (
                  <div className="h-2 w-2 rounded-full bg-white" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${config.text}`}>
                  {milestone.title}
                </p>
                {!compact && (
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{config.label}</span>
                    {milestone.completedDate ? (
                      <span>Completed {new Date(milestone.completedDate).toLocaleDateString()}</span>
                    ) : (
                      <span>Due {new Date(milestone.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
