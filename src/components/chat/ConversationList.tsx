'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ConversationListItem } from '@/lib/communication/types';

interface ConversationListProps {
  currentUserId: string;
  onSelect: (conversationId: string) => void;
  selectedId?: string;
}

export function ConversationList({
  currentUserId,
  onSelect,
  selectedId,
}: ConversationListProps) {
  const [items, setItems] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.conversations ?? []);
      }
    } catch {
      // Silent retry on next poll
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[#00a9e0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {items.map((item) => {
        const isSelected = selectedId === item.conversation.id;
        const hasUnread = item.unreadCount > 0;
        const lastMsg = item.lastMessage;

        const timeLabel = lastMsg
          ? formatRelativeTime(
              lastMsg.createdAt instanceof Date
                ? lastMsg.createdAt
                : new Date(lastMsg.createdAt),
            )
          : '';

        return (
          <button
            key={item.conversation.id}
            onClick={() => onSelect(item.conversation.id)}
            className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-gray-50 ${
              isSelected ? 'bg-sky-50 border-l-3 border-[#00a9e0]' : ''
            }`}
          >
            {/* Avatar placeholder */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-[#00a9e0] flex items-center justify-center text-white text-sm font-semibold">
              {item.otherPartyRole === 'pro' ? 'P' : 'C'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm truncate ${hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}
                >
                  {item.jobTitle}
                </span>
                <span className="text-[11px] text-gray-400 shrink-0">
                  {timeLabel}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p
                  className={`text-xs truncate ${hasUnread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}
                >
                  {lastMsg
                    ? lastMsg.body
                    : 'No messages yet'}
                </p>
                {hasUnread && (
                  <span className="shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#00a9e0] text-white text-[10px] font-bold px-1">
                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                  </span>
                )}
              </div>

              <span className="text-[10px] text-gray-400 mt-0.5 block">
                {item.otherPartyRole === 'pro' ? 'Pro' : 'Client'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}
