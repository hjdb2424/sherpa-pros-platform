import type { Metadata } from 'next';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import EmptyState from '@/components/EmptyState';

export const metadata: Metadata = {
  title: 'Messages',
};

export default function TenantMessagesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Messages
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Communicate with your property manager and service pros.
      </p>
      <div className="mt-8">
        <EmptyState
          icon={<ChatBubbleLeftRightIcon className="h-8 w-8" />}
          title="No messages yet"
          description="When you submit a maintenance request, you can message your property manager and assigned pros here."
          ctaLabel="Submit Request"
          ctaHref="/tenant/submit-request"
        />
      </div>
    </div>
  );
}
