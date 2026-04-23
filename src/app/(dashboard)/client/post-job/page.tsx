import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JobWizard } from '@/components/client/JobWizard';
import { SkipToDashboardLink } from '@/components/client/SkipToDashboardLink';

export const metadata: Metadata = {
  title: 'Post a Job',
};

export default function PostJobPage() {
  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Post a Job</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Describe what you need done and get bids from verified Pros nearby.
            </p>
          </div>
          <Suspense>
            <SkipToDashboardLink />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<div className="mx-auto max-w-2xl animate-pulse space-y-4"><div className="h-8 rounded bg-zinc-200" /><div className="h-64 rounded bg-zinc-100" /></div>}>
        <JobWizard />
      </Suspense>
    </div>
  );
}
