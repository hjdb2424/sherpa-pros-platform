'use client';

import type { ParticipantRole } from '@/lib/communication/types';

interface MessageBubbleProps {
  body: string;
  role: ParticipantRole;
  isSender: boolean;
  timestamp: Date;
}

export function MessageBubble({
  body,
  role,
  isSender,
  timestamp,
}: MessageBubbleProps) {
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(timestamp);

  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3 animate-[fadeSlideIn_0.2s_ease-out]`}
    >
      <div className={`max-w-[80%] ${isSender ? 'items-end' : 'items-start'}`}>
        {/* Role label */}
        <span
          className={`block text-xs font-medium mb-1 ${
            isSender ? 'text-right text-[#00a9e0]' : 'text-left text-gray-500'
          }`}
        >
          {role === 'pro' ? 'Pro' : 'Client'}
        </span>

        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
            isSender
              ? 'bg-[#00a9e0] text-white rounded-br-md'
              : 'bg-zinc-100 text-zinc-900 rounded-bl-md'
          }`}
        >
          {body}
        </div>

        {/* Timestamp */}
        <span
          className={`block text-[10px] mt-1 text-gray-400 ${
            isSender ? 'text-right' : 'text-left'
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  );
}
