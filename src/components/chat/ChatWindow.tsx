'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import type { Message, ParticipantRole } from '@/lib/communication/types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  currentUserRole: ParticipantRole;
  jobTitle?: string;
  onClose?: () => void;
  /** Inline mode (panel) vs full-screen mobile */
  inline?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatWindow({
  conversationId,
  currentUserId,
  currentUserRole,
  jobTitle = 'Job Chat',
  onClose,
  inline = false,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // -----------------------------------------------------------------------
  // Fetch messages
  // -----------------------------------------------------------------------
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    } catch {
      // Silently retry on next poll
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3s (WebSocket upgrade is a future TODO)
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // -----------------------------------------------------------------------
  // Auto-scroll on new messages
  // -----------------------------------------------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // -----------------------------------------------------------------------
  // Send message
  // -----------------------------------------------------------------------
  const handleSend = async () => {
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    setDraft('');

    // Optimistic insert
    const optimistic: Message = {
      id: `optimistic_${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      body,
      createdAt: new Date(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch(`/api/chat/${conversationId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: currentUserId, body }),
      });

      if (res.ok) {
        const data = await res.json();
        // Replace optimistic with real message
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? data.message : m)),
        );
      }
    } catch {
      // Revert optimistic on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setDraft(body);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // -----------------------------------------------------------------------
  // Determine sender role for each message
  // -----------------------------------------------------------------------
  const otherRole: ParticipantRole =
    currentUserRole === 'pro' ? 'client' : 'pro';

  function roleForMessage(msg: Message): ParticipantRole {
    return msg.senderId === currentUserId ? currentUserRole : otherRole;
  }

  // -----------------------------------------------------------------------
  // Container classes
  // -----------------------------------------------------------------------
  const containerClass = inline
    ? 'flex flex-col h-full w-full rounded-xl overflow-hidden shadow-xl border border-gray-200'
    : 'flex flex-col fixed inset-0 z-50 bg-white md:relative md:inset-auto md:h-[600px] md:w-[400px] md:rounded-xl md:shadow-xl md:border md:border-gray-200';

  return (
    <div className={containerClass}>
      {/* Header — dark navy */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a2e] text-white shrink-0">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{jobTitle}</h3>
          <p className="text-xs text-gray-300">
            Chatting with {otherRole === 'pro' ? 'Pro' : 'Client'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No messages yet. Start the conversation.
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                body={msg.body}
                role={roleForMessage(msg)}
                isSender={msg.senderId === currentUserId}
                timestamp={
                  msg.createdAt instanceof Date
                    ? msg.createdAt
                    : new Date(msg.createdAt)
                }
              />
            ))}
          </>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1 px-3 py-2 text-gray-400 text-xs">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            <span className="ml-1">
              {otherRole === 'pro' ? 'Pro' : 'Client'} is typing...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsTyping(false)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 text-sm rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder:text-gray-400"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
