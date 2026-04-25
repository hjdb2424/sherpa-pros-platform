'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatHeader } from './ChatHeader';
import type { ChatMessage } from '@/lib/communication/chat-service';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  currentUserRole?: 'pro' | 'client' | 'pm';
  /** Info about the other participant (for header display) */
  participant?: {
    name: string;
    initials: string;
    role: 'pro' | 'client' | 'pm';
    avatarColor?: string;
    isOnline?: boolean;
    phone?: string;
  };
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
  participant,
  jobTitle = 'Job Chat',
  onClose,
  inline = false,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Mark as read when conversation opens
  useEffect(() => {
    fetch(`/api/chat/${conversationId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId }),
    }).catch(() => {});
  }, [conversationId, currentUserId]);

  // -----------------------------------------------------------------------
  // Auto-scroll on new messages
  // -----------------------------------------------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // -----------------------------------------------------------------------
  // Auto-grow textarea
  // -----------------------------------------------------------------------
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    // Reset height then set to scrollHeight
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  // -----------------------------------------------------------------------
  // Send message
  // -----------------------------------------------------------------------
  const handleSend = async () => {
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    setDraft('');

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Optimistic insert
    const optimistic: ChatMessage = {
      id: `optimistic_${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      senderName: 'You',
      senderRole: 'client',
      text: body,
      timestamp: new Date().toISOString(),
      readBy: [currentUserId],
      deliveryMethod: 'app',
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
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? data.message : m)),
        );
      }
    } catch {
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
  // Group messages by date for separator display
  // -----------------------------------------------------------------------
  function getDateLabel(ts: string): string {
    const date = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / 86_400_000,
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  // -----------------------------------------------------------------------
  // Container classes
  // -----------------------------------------------------------------------
  const containerClass = inline
    ? 'flex flex-col h-full w-full rounded-xl overflow-hidden shadow-xl border border-zinc-200'
    : 'flex flex-col fixed inset-0 z-50 bg-white md:relative md:inset-auto md:h-full md:w-full md:rounded-xl md:shadow-xl md:border md:border-zinc-200';

  return (
    <div className={containerClass}>
      {/* Header */}
      {participant ? (
        <ChatHeader
          participantName={participant.name}
          participantRole={participant.role}
          participantInitials={participant.initials}
          avatarColor={participant.avatarColor}
          isOnline={participant.isOnline}
          phone={participant.phone}
          onBack={onClose}
        />
      ) : (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-100 shrink-0">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate text-zinc-900">
              {jobTitle}
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-3 p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-[#00a9e0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
            No messages yet. Start the conversation.
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              // Show date separator between different days
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const showDateSep =
                !prevMsg ||
                getDateLabel(msg.timestamp) !==
                  getDateLabel(prevMsg.timestamp);

              return (
                <div key={msg.id}>
                  {showDateSep && (
                    <div className="flex items-center justify-center my-4">
                      <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
                        {getDateLabel(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    body={msg.text}
                    senderName={msg.senderName}
                    isSender={msg.senderId === currentUserId}
                    timestamp={new Date(msg.timestamp)}
                    deliveryMethod={msg.deliveryMethod}
                    attachments={msg.attachments}
                    showSenderName={false}
                  />
                </div>
              );
            })}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-zinc-200 bg-zinc-50 px-3 py-2">
        <div className="flex items-end gap-2">
          {/* Attach photo button */}
          <button
            className="shrink-0 p-2 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 transition-colors"
            aria-label="Attach photo"
            title="Attach photo (coming soon)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Auto-growing textarea */}
          <textarea
            ref={inputRef}
            value={draft}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-2.5 text-sm rounded-2xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/30 focus:border-[#00a9e0] placeholder:text-zinc-400 resize-none overflow-hidden transition-colors"
            style={{ maxHeight: 120 }}
            disabled={sending}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#00a9e0] text-white hover:bg-[#0ea5e9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
