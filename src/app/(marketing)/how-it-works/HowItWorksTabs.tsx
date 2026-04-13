'use client';

import { useState } from 'react';

interface Step {
  step: string;
  title: string;
  description: string;
  detail: string;
}

interface HowItWorksTabsProps {
  clientSteps: Step[];
  proSteps: Step[];
}

export default function HowItWorksTabs({
  clientSteps,
  proSteps,
}: HowItWorksTabsProps) {
  const [activeTab, setActiveTab] = useState<'client' | 'pro'>('client');
  const steps = activeTab === 'client' ? clientSteps : proSteps;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-100 p-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'client'}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'client'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
            onClick={() => setActiveTab('client')}
          >
            I Need Work Done
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pro'}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'pro'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
            onClick={() => setActiveTab('pro')}
          >
            I Am a Pro
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-12 space-y-0" role="tabpanel">
        {steps.map((step, i) => (
          <div key={step.step} className="relative flex gap-6 pb-12 last:pb-0">
            {/* Timeline line */}
            {i < steps.length - 1 && (
              <div
                className="absolute left-[19px] top-10 h-full w-[2px] bg-zinc-200"
                aria-hidden="true"
              />
            )}
            {/* Step number */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1a2e] text-xs font-bold text-amber-500">
              {step.step}
            </div>
            {/* Content */}
            <div className="flex-1 pb-2 pt-1">
              <h3 className="text-lg font-semibold text-zinc-900">
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-600">
                {step.description}
              </p>
              <p className="mt-2 text-sm font-medium text-amber-600">
                {step.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
