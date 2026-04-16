import type { Metadata } from 'next';
import {
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import EmptyState from '@/components/EmptyState';

export const metadata: Metadata = {
  title: 'Messages',
};

export default function ClientMessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Communicate with pros about your projects.
      </p>

      <div className="mt-8">
        <EmptyState
          icon={
            <ChatBubbleLeftRightIcon className="h-8 w-8" aria-hidden="true" />
          }
          title="No messages yet"
          description="When you post a job and receive bids, you can message pros directly. All communication is masked for your privacy."
          ctaLabel="Post a Job"
          ctaHref="/client/post-job"
          secondaryLabel="Find Pros"
          secondaryHref="/client/find-pros"
        />
      </div>
    </div>
  );
}
