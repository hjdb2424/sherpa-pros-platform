import type { Metadata } from 'next';
import { JobWizard } from '@/components/client/JobWizard';

export const metadata: Metadata = {
  title: 'Post a Job',
};

export default function PostJobPage() {
  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Post a Job</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Describe what you need done and get bids from verified Pros nearby.
        </p>
      </div>
      <JobWizard />
    </div>
  );
}
