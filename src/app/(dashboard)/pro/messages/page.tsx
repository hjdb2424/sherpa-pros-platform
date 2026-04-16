import type { Metadata } from 'next';
import {
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import EmptyState from '@/components/EmptyState';

export const metadata: Metadata = {
  title: 'Messages',
};

export default function ProMessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Communicate with clients about jobs and bids.
      </p>

      <div className="mt-8">
        <EmptyState
          icon={
            <ChatBubbleLeftRightIcon className="h-8 w-8" aria-hidden="true" />
          }
          title="No messages yet"
          description="When you bid on jobs or get dispatched, conversations with clients will appear here. All communication is private and secure."
          ctaLabel="Browse Jobs"
          ctaHref="/pro/jobs"
        />
      </div>
    </div>
  );
}
