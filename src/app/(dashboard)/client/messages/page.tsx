import type { Metadata } from 'next';
import { MessagesLayout } from '@/components/chat/MessagesLayout';

export const metadata: Metadata = {
  title: 'Messages',
};

/**
 * Client Messages Page
 *
 * Split-pane layout: conversation list (left) + chat window (right).
 * On mobile, shows list first, tapping a conversation pushes to chat view.
 *
 * Uses mock user ID "client-john" in development (matches chat-data.ts).
 * In production this would come from the authenticated session.
 */
export default function ClientMessagesPage() {
  // TODO: Get from Clerk session
  const currentUserId = 'client-john';

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Communicate with pros about your projects. All messages are private and secure.
        </p>
      </div>

      <MessagesLayout
        currentUserId={currentUserId}
        currentUserRole="client"
      />
    </div>
  );
}
