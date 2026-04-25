'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ChatConversation } from '@/lib/communication/chat-service';

interface ConversationListProps {
  currentUserId: string;
  onSelect: (conversationId: string) => void;
  selectedId?: string;
}

const ROLE_LABELS: Record<string, string> = {
  pro: 'Pro',
  client: 'Client',
  pm: 'PM',
};

export function ConversationList({
  currentUserId,
  onSelect,
  selectedId,
}: ConversationListProps) {
  const [items, setItems] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  // Filter by search term
  const filtered = search.trim()
    ? items.filter(
        (item) =>
          item.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
          item.otherParticipant?.name
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
    : items;

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="px-4 py-3">
          <div className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 py-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-100 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-zinc-50 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-zinc-100">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/30 focus:border-[#00a9e0] placeholder:text-zinc-400 transition-colors"
          />
        </div>
      </div>

      {/* Conversation list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 text-sm">
          {search ? 'No matching conversations.' : 'No conversations yet.'}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
          {filtered.map((item) => {
            const isSelected = selectedId === item.id;
            const hasUnread = item.unreadCount > 0;
            const other = item.otherParticipant;
            const lastMsg = item.lastMessage;

            const timeLabel = lastMsg
              ? formatRelativeTime(new Date(lastMsg.timestamp))
              : '';

            const displayName = other?.name ?? item.jobTitle;
            const initials = other?.initials ?? item.jobTitle.charAt(0);
            const avatarColor = other?.avatarColor ?? '#6366f1';
            const isOnline = other?.isOnline ?? false;

            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-zinc-50 ${
                  isSelected
                    ? 'bg-sky-50/70 border-l-[3px] border-[#00a9e0]'
                    : 'border-l-[3px] border-transparent'
                }`}
              >
                {/* Avatar with online dot */}
                <div className="relative shrink-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initials}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? 'bg-emerald-500' : 'bg-zinc-300'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-sm truncate ${
                        hasUnread
                          ? 'font-semibold text-zinc-900'
                          : 'font-medium text-zinc-700'
                      }`}
                    >
                      {displayName}
                    </span>
                    <span className="text-[11px] text-zinc-400 shrink-0">
                      {timeLabel}
                    </span>
                  </div>

                  {/* Job title (if different from display name) */}
                  {other && (
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {item.jobTitle}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                      className={`text-xs truncate ${
                        hasUnread
                          ? 'text-zinc-800 font-medium'
                          : 'text-zinc-500'
                      }`}
                    >
                      {lastMsg
                        ? lastMsg.senderId === currentUserId
                          ? `You: ${lastMsg.text}`
                          : lastMsg.text
                        : 'No messages yet'}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* SMS indicator */}
                      {lastMsg?.deliveryMethod === 'sms' ||
                      lastMsg?.deliveryMethod === 'both' ? (
                        <span className="text-[9px] text-zinc-400 bg-zinc-100 px-1 rounded" title="SMS synced">
                          SMS
                        </span>
                      ) : null}
                      {/* Unread badge */}
                      {hasUnread && (
                        <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#00a9e0] text-white text-[10px] font-bold px-1">
                          {item.unreadCount > 99 ? '99+' : item.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Role badge */}
                  {other && (
                    <span className="inline-flex mt-1 items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-500">
                      {ROLE_LABELS[other.role] ?? other.role}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
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
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}
