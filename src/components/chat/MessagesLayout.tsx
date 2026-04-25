'use client';

import { useCallback, useEffect, useState } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import type { ChatConversation } from '@/lib/communication/chat-service';

interface MessagesLayoutProps {
  currentUserId: string;
  currentUserRole: 'pro' | 'client' | 'pm';
}

export function MessagesLayout({
  currentUserId,
  currentUserRole,
}: MessagesLayoutProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch conversations for participant lookup
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations ?? []);
      }
    } catch {
      // silent
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const otherParticipant = selectedConv?.otherParticipant;

  // Mobile: show either list or chat, not both
  if (isMobile) {
    if (selectedId) {
      return (
        <div className="h-[calc(100vh-8rem)]">
          <ChatWindow
            conversationId={selectedId}
            currentUserId={currentUserId}
            participant={
              otherParticipant
                ? {
                    name: otherParticipant.name,
                    initials: otherParticipant.initials,
                    role: otherParticipant.role,
                    avatarColor: otherParticipant.avatarColor,
                    isOnline: otherParticipant.isOnline,
                    phone: otherParticipant.phone,
                  }
                : undefined
            }
            jobTitle={selectedConv?.jobTitle}
            onClose={() => setSelectedId(null)}
          />
        </div>
      );
    }

    return (
      <div className="h-[calc(100vh-8rem)]">
        <ConversationList
          currentUserId={currentUserId}
          onSelect={setSelectedId}
          selectedId={selectedId ?? undefined}
        />
      </div>
    );
  }

  // Desktop: split pane
  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-xl border border-zinc-200 overflow-hidden bg-white">
      {/* Left: conversation list */}
      <div className="w-[360px] shrink-0 border-r border-zinc-200 overflow-hidden flex flex-col">
        <ConversationList
          currentUserId={currentUserId}
          onSelect={setSelectedId}
          selectedId={selectedId ?? undefined}
        />
      </div>

      {/* Right: chat window or empty state */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedId ? (
          <ChatWindow
            conversationId={selectedId}
            currentUserId={currentUserId}
            participant={
              otherParticipant
                ? {
                    name: otherParticipant.name,
                    initials: otherParticipant.initials,
                    role: otherParticipant.role,
                    avatarColor: otherParticipant.avatarColor,
                    isOnline: otherParticipant.isOnline,
                    phone: otherParticipant.phone,
                  }
                : undefined
            }
            jobTitle={selectedConv?.jobTitle}
            inline
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
            <svg
              className="w-16 h-16 mb-4 text-zinc-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm font-medium">Select a conversation</p>
            <p className="text-xs mt-1">
              Choose from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
