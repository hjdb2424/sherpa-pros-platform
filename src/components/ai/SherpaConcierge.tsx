'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export interface SherpaConciergeProps {
  role: 'ssp' | 'scp';
  userName: string;
  agentName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  from: 'agent' | 'user';
  text: string;
}

const SSP_CHIPS = [
  'Review materials list',
  'Check job status',
  'Get pricing update',
  'Contact support',
] as const;

const SCP_CHIPS = [
  'Approve materials',
  'Track delivery',
  'View project status',
  'Talk to a human',
] as const;

const MOCK_RESPONSES: Record<string, string> = {
  'Review materials list':
    'I pulled up the materials list for your active project. You have 24 items across 3 categories — framing lumber, fasteners, and insulation. Two items are flagged for price changes since last week. Want me to break it down?',
  'Check job status':
    'Your Kitchen Remodel project is 68% complete. The current milestone is "Cabinet Installation" which is on track for completion by Friday. No blockers reported by the crew.',
  'Get pricing update':
    'Lumber prices dropped 3.2% this week in your region. I have updated estimates for your pending bids. Your Garage Build estimate went from $14,200 to $13,750. Want me to update the bid?',
  'Contact support':
    'Connecting you with a team member... A Sherpa specialist will reach out within 1 hour.',
  'Approve materials':
    'You have 3 material selections pending approval for your Bathroom Renovation. The contractor recommends Carrara marble tile ($8.50/sqft) and brushed nickel fixtures. Want to review each item?',
  'Track delivery':
    'Your cabinet order from Belle Vie is in transit. Estimated delivery: Thursday, April 17th between 9 AM - 12 PM. The driver will call 30 minutes before arrival.',
  'View project status':
    'Your Bathroom Renovation is 45% complete. Demo is done, plumbing rough-in passed inspection yesterday. Next up: tile installation starts Monday. Everything is on schedule.',
  'Talk to a human':
    'Connecting you with a team member... A Sherpa specialist will reach out within 1 hour.',
};

export default function SherpaConcierge({
  role,
  userName,
  agentName,
  isOpen,
  onClose,
}: SherpaConciergeProps) {
  const chips = role === 'ssp' ? SSP_CHIPS : SCP_CHIPS;
  const badge = role === 'ssp' ? 'Sherpa Success Pro' : 'Sherpa Client Pro';
  const initial = agentName[0];

  const welcomeMessage: Message = {
    id: 'welcome',
    from: 'agent',
    text:
      role === 'ssp'
        ? `Hey ${userName}! I'm ${agentName}, your Sherpa Success Pro. I'm here to help manage your projects, review materials, and make sure everything runs smoothly. What can I help with?`
        : `Hi ${userName}! I'm ${agentName}, your Sherpa Client Pro. I'm here to help with your projects — from approving materials to tracking deliveries. How can I help today?`,
  };

  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [showChips, setShowChips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when panel opens
  useEffect(() => {
    if (isOpen) {
      setMessages([welcomeMessage]);
      setInput('');
      setShowChips(true);
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAgentResponse = useCallback(
    (responseText: string) => {
      // Thinking message
      const thinkingId = `thinking-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: thinkingId,
          from: 'agent',
          text: "I'm looking into that for you. Give me a moment...",
        },
      ]);

      // Replace with real response after delay
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId
              ? { ...m, text: responseText }
              : m,
          ),
        );
      }, 2000);
    },
    [],
  );

  const handleChipClick = useCallback(
    (chip: string) => {
      setShowChips(false);
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        from: 'user',
        text: chip,
      };
      setMessages((prev) => [...prev, userMsg]);
      addAgentResponse(
        MOCK_RESPONSES[chip] ?? "I've pulled up the latest information for you.",
      );
    },
    [addAgentResponse],
  );

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setShowChips(false);
    setInput('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Generic canned response for typed messages
    addAgentResponse(
      "I've pulled up the latest information. Based on your current projects, everything is tracking on schedule. Want me to dig into any specific details?",
    );
  }, [input, addAgentResponse]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-label={`${agentName} — ${badge}`}
        className={`fixed z-50 flex flex-col bg-white shadow-xl transition-transform duration-300 ease-out dark:bg-zinc-900 dark:border-zinc-800
          /* Mobile: bottom sheet */
          inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl
          /* Desktop: right panel */
          lg:inset-x-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-[400px] lg:max-h-full lg:rounded-t-none lg:rounded-l-2xl lg:border-l lg:border-zinc-200 lg:dark:border-zinc-800
          ${isOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {agentName}
            </p>
            <span className="inline-block rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-[#00a9e0] dark:bg-sky-900/30 dark:text-sky-400">
              {badge}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Close chat"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-[#00a9e0] text-white'
                    : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Quick action chips */}
          {showChips && (
            <div className="flex flex-wrap gap-2 pt-1">
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:border-[#00a9e0]/40 hover:bg-sky-50 hover:text-[#00a9e0] active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-sky-600 dark:hover:bg-sky-900/20 dark:hover:text-sky-400"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${agentName}...`}
              className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-sky-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30 disabled:opacity-40 disabled:shadow-none active:scale-95"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
