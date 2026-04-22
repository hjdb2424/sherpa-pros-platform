'use client';

import { useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/* Decision tree                                                       */
/* ------------------------------------------------------------------ */

interface Question {
  id: number;
  text: string;
  yesResult: 'capital' | number; // 'capital' or next question id
  noResult: 'repair' | number;
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Does this project extend the useful life of the property beyond its original expected life?',
    yesResult: 'capital',
    noResult: 2,
  },
  {
    id: 2,
    text: 'Does this project adapt the property to a new or different use?',
    yesResult: 'capital',
    noResult: 3,
  },
  {
    id: 3,
    text: 'Does this project make the property materially better than it was before (betterment)?',
    yesResult: 'capital',
    noResult: 'repair',
  },
];

const examples = [
  { item: 'Kitchen remodel', classification: 'Capital Improvement', reason: 'Betterment — materially improves the property. Depreciate over 15 years.' },
  { item: 'Faucet replacement', classification: 'Repair', reason: 'Restores to original condition. Deduct in current tax year.' },
  { item: 'Roof replacement (full)', classification: 'Capital Improvement', reason: 'Extends useful life of the structure. Depreciate over 27.5 years.' },
  { item: 'Roof patch (small area)', classification: 'Repair', reason: 'Routine maintenance, no betterment. Deduct in current tax year.' },
  { item: 'HVAC system replacement', classification: 'Capital Improvement', reason: 'Betterment — new system exceeds original. Depreciate over 27.5 years.' },
  { item: 'HVAC filter change + tune-up', classification: 'Repair', reason: 'Routine maintenance. Deduct in current tax year.' },
  { item: 'Bathroom addition', classification: 'Capital Improvement', reason: 'Adapts property to new use (additional bathroom). Depreciate over 27.5 years.' },
  { item: 'Broken window pane', classification: 'Repair', reason: 'Restores to original condition. Deduct in current tax year.' },
  { item: 'LED lighting upgrade', classification: 'Capital Improvement', reason: 'Betterment — materially increases energy efficiency. Depreciate over 7 years.' },
  { item: 'Light bulb replacement', classification: 'Repair', reason: 'Routine maintenance. Deduct in current tax year.' },
];

type Result = 'capital' | 'repair' | null;

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function CapitalVsRepairHelper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<Result>(null);
  const [answers, setAnswers] = useState<Record<number, 'yes' | 'no'>>({});

  const currentQuestion = questions.find((q) => q.id === currentStep);

  const handleAnswer = useCallback((answer: 'yes' | 'no') => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));

    const next = answer === 'yes' ? currentQuestion.yesResult : currentQuestion.noResult;
    if (next === 'capital' || next === 'repair') {
      setResult(next);
    } else {
      setCurrentStep(next);
    }
  }, [currentQuestion]);

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setResult(null);
    setAnswers({});
  }, []);

  return (
    <div className="space-y-6">
      {/* Decision flow */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-1 text-base font-bold text-zinc-900 dark:text-white">Capital Improvement vs. Repair</h3>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Answer these questions to determine the IRS classification for your expense.
        </p>

        {result === null && currentQuestion ? (
          <div>
            {/* Progress */}
            <div className="mb-6 flex items-center gap-2">
              {questions.map((q) => {
                const answered = answers[q.id] !== undefined;
                const active = q.id === currentStep;
                return (
                  <div key={q.id} className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      answered
                        ? answers[q.id] === 'yes'
                          ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                          : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        : active
                          ? 'bg-[#00a9e0]/10 text-[#00a9e0] ring-2 ring-[#00a9e0]/30'
                          : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                    }`}>
                      {answered ? (answers[q.id] === 'yes' ? 'Y' : 'N') : q.id}
                    </div>
                    {q.id < questions.length && (
                      <div className={`h-0.5 w-8 ${answered ? 'bg-zinc-300 dark:bg-zinc-600' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Question */}
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-800/50">
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                Question {currentStep} of {questions.length}
              </p>
              <p className="mt-2 text-base text-zinc-700 dark:text-zinc-300">
                {currentQuestion.text}
              </p>
            </div>

            {/* Answer buttons */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => handleAnswer('yes')}
                className="flex-1 rounded-lg border-2 border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700 transition-colors hover:border-violet-300 hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:border-violet-500/50 dark:hover:bg-violet-500/20"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleAnswer('no')}
                className="flex-1 rounded-lg border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
              >
                No
              </button>
            </div>
          </div>
        ) : result !== null ? (
          <div>
            {/* Result */}
            <div className={`rounded-lg border-2 p-6 text-center ${
              result === 'capital'
                ? 'border-violet-200 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/10'
                : 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
            }`}>
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                result === 'capital'
                  ? 'bg-violet-100 dark:bg-violet-500/20'
                  : 'bg-emerald-100 dark:bg-emerald-500/20'
              }`}>
                {result === 'capital' ? (
                  <svg className="h-8 w-8 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                  </svg>
                )}
              </div>

              <h4 className={`mt-4 text-xl font-bold ${
                result === 'capital'
                  ? 'text-violet-700 dark:text-violet-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}>
                {result === 'capital' ? 'Capital Improvement' : 'Repair'}
              </h4>

              <p className={`mt-2 text-sm ${
                result === 'capital'
                  ? 'text-violet-800 dark:text-violet-300'
                  : 'text-emerald-800 dark:text-emerald-300'
              }`}>
                {result === 'capital'
                  ? 'This expense should be capitalized and depreciated over its useful life (typically 5-39 years depending on the asset type). It cannot be deducted in full this year.'
                  : 'This expense qualifies as a repair and can be fully deducted in the current tax year. It restores the property to its original condition without adding value.'
                }
              </p>

              <div className="mt-4 rounded-lg bg-white/60 p-3 text-left text-xs text-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-400">
                <p className="font-bold">IRS Rationale (Reg. 1.263(a)-3):</p>
                <p className="mt-1">
                  {result === 'capital'
                    ? 'Under the IRS improvement rules, an amount paid for a betterment, restoration, or adaptation of a unit of property must be capitalized. This includes amounts that extend the useful life, adapt the property to a new use, or make the property materially better.'
                    : 'Under the IRS repair regulations, amounts paid for incidental repairs and maintenance that keep property in ordinarily efficient operating condition are deductible as business expenses in the year paid.'
                  }
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-4 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Start Over
            </button>
          </div>
        ) : null}
      </div>

      {/* Examples reference */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Common Examples</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Capital vs repair examples">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Item</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Classification</th>
                <th className="px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Reason</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((ex) => (
                <tr key={ex.item} className="border-b border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-3 font-medium text-zinc-900 dark:text-white">{ex.item}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      ex.classification === 'Capital Improvement'
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                    }`}>
                      {ex.classification}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-zinc-600 dark:text-zinc-400">{ex.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
