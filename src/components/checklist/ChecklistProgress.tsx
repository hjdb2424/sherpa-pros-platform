'use client';

import { useMemo } from 'react';
import {
  CheckCircleIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import type { ChecklistItem, ChecklistPhase } from '@/lib/mock-data/checklist-data';

interface ChecklistProgressProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  onPhotoUpload?: (id: string) => void;
}

const phaseLabels: Record<ChecklistPhase, string> = {
  prep: 'Preparation',
  rough_in: 'Rough-In',
  inspection: 'Inspection',
  finish: 'Finish',
  closeout: 'Closeout',
};

const phaseOrder: ChecklistPhase[] = ['prep', 'rough_in', 'inspection', 'finish', 'closeout'];

export default function ChecklistProgress({
  items,
  onToggle,
  onPhotoUpload,
}: ChecklistProgressProps) {
  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const groupedByPhase = useMemo(() => {
    const groups: Partial<Record<ChecklistPhase, ChecklistItem[]>> = {};
    for (const item of items) {
      if (!groups[item.phase]) groups[item.phase] = [];
      groups[item.phase]!.push(item);
    }
    return groups;
  }, [items]);

  return (
    <section
      className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
      aria-label="Checklist Progress"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Checklist
      </h2>

      {/* Overall progress bar */}
      <div className="mt-3 mb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {completedCount} of {totalCount} complete
          </span>
          <span className="font-semibold text-[#00a9e0]">{percentage}%</span>
        </div>
        <div
          className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percentage}% complete`}
        >
          <div
            className="h-full rounded-full bg-[#00a9e0] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Phase groups */}
      <div className="space-y-5">
        {phaseOrder.map((phase) => {
          const phaseItems = groupedByPhase[phase];
          if (!phaseItems || phaseItems.length === 0) return null;

          const phaseCompleted = phaseItems.filter((i) => i.completed).length;
          const phaseTotal = phaseItems.length;

          return (
            <div key={phase}>
              {/* Phase header */}
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {phaseLabels[phase]}
                </h3>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {phaseCompleted}/{phaseTotal}
                </span>
              </div>

              {/* Items */}
              <ul className="space-y-1" role="list">
                {phaseItems.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                      item.isQualityGate
                        ? 'border-l-4 border-[#ff4500] bg-orange-50/50 dark:bg-orange-900/10'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggle(item.id)}
                      className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 rounded-sm active:scale-[0.98] transition-all"
                      aria-label={`${item.completed ? 'Uncheck' : 'Check'} ${item.label}`}
                    >
                      {item.completed ? (
                        <CheckCircleSolid className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <div className="h-5 w-5 rounded border-2 border-zinc-300 transition-colors hover:border-[#00a9e0] dark:border-zinc-600" />
                      )}
                    </button>

                    {/* Label */}
                    <span
                      className={`flex-1 text-sm ${
                        item.completed
                          ? 'text-zinc-400 line-through dark:text-zinc-500'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      {item.isQualityGate && (
                        <span className="rounded-full bg-[#ff4500]/10 px-2 py-0.5 text-[10px] font-semibold text-[#ff4500]">
                          Quality Gate
                        </span>
                      )}

                      {item.photoRequired && onPhotoUpload && (
                        <button
                          type="button"
                          onClick={() => onPhotoUpload(item.id)}
                          className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-[#00a9e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] active:scale-[0.98] dark:hover:bg-zinc-700"
                          aria-label={`Upload photo for ${item.label}`}
                        >
                          <CameraIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
