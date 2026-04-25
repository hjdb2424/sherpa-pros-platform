import type { Metadata } from 'next';
import { MessagesLayout } from '@/components/chat/MessagesLayout';

export const metadata: Metadata = {
  title: 'Messages',
};

/**
 * PM Messages Page
 *
 * Property managers message pros (about work orders) and tenants (about requests).
 * Split-pane layout matching pro/client messages.
 *
 * Uses mock user ID "pm-lisa" in development (matches chat-data.ts).
 */
export default function PMMessagesPage() {
  // TODO: Get from Clerk session
  const currentUserId = 'pm-lisa';

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Communicate with pros and tenants about work orders and maintenance requests.
        </p>
      </div>

      <MessagesLayout
        currentUserId={currentUserId}
        currentUserRole="pm"
      />
    </div>
  );
}
