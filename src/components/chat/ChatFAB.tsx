'use client';

import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import type { ParticipantRole } from '@/lib/communication/types';

interface ChatFABProps {
  conversationId: string;
  currentUserId: string;
  currentUserRole: ParticipantRole;
  jobTitle?: string;
  unreadCount?: number;
}

export function ChatFAB({
  conversationId,
  currentUserId,
  currentUserRole,
  jobTitle,
  unreadCount = 0,
}: ChatFABProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Slide-up chat panel */}
      {open && (
        <div className="fixed inset-0 z-40 md:inset-auto md:bottom-24 md:right-6 md:w-[400px] md:h-[600px]">
          {/* Backdrop on mobile */}
          <div
            className="absolute inset-0 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full md:h-auto animate-[slideUp_0.3s_ease-out]">
            <ChatWindow
              conversationId={conversationId}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              jobTitle={jobTitle}
              onClose={() => setOpen(false)}
              inline
            />
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-[#1a1a2e] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}

        {/* Unread badge */}
        {!open && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold px-1.5 animate-[bounceIn_0.3s_ease-out]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </>
  );
}
