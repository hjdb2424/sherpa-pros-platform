'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { ProcessStep, ChecklistPhase } from '@/lib/mock-data/checklist-data';

interface WorkProcessProps {
  steps: ProcessStep[];
}

const phaseStyles: Record<ChecklistPhase, { bg: string; text: string; label: string }> = {
  prep: {
    bg: 'bg-zinc-100 dark:bg-zinc-700',
    text: 'text-zinc-700 dark:text-zinc-300',
    label: 'Prep',
  },
  rough_in: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    label: 'Rough-In',
  },
  inspection: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'Inspection',
  },
  finish: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    label: 'Finish',
  },
  closeout: {
    bg: 'bg-zinc-100 dark:bg-zinc-700',
    text: 'text-zinc-600 dark:text-zinc-400',
    label: 'Closeout',
  },
};

export default function WorkProcess({ steps }: WorkProcessProps) {
  return (
    <section
      className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
      aria-label="Work Process"
    >
      <h2 className="mb-5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Work Process
      </h2>

      <div className="relative">
        {/* Vertical timeline line */}
        <div
          className="absolute bottom-0 left-4 top-0 w-0.5 bg-zinc-200 dark:bg-zinc-700"
          aria-hidden="true"
        />

        <ol className="space-y-6" role="list">
          {steps.map((step, idx) => {
            const phase = phaseStyles[step.phase] ?? phaseStyles.prep;

            return (
              <li key={step.id ?? idx} className="relative pl-12">
                {/* Step number circle */}
                <div
                  className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {idx + 1}
                </div>

                {/* Content */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {step.title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${phase.bg} ${phase.text}`}
                    >
                      {phase.label}
                    </span>
                    {step.estimatedMinutes > 0 && (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {step.estimatedMinutes >= 60
                          ? `${Math.floor(step.estimatedMinutes / 60)}h ${step.estimatedMinutes % 60 > 0 ? `${step.estimatedMinutes % 60}m` : ''}`
                          : `${step.estimatedMinutes}m`}
                      </span>
                    )}
                  </div>

                  {step.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {step.description}
                    </p>
                  )}

                  {/* Safety notes callout */}
                  {step.safetyNotes && step.safetyNotes.length > 0 && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                      <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon
                          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                            Safety Notes
                          </p>
                          <ul className="mt-1 space-y-1">
                            {step.safetyNotes.map((note, nIdx) => (
                              <li
                                key={nIdx}
                                className="text-xs text-amber-700 dark:text-amber-400"
                              >
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
