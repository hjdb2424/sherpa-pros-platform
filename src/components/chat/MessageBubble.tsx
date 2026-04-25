'use client';

interface MessageBubbleProps {
  body: string;
  senderName?: string;
  isSender: boolean;
  timestamp: Date;
  deliveryMethod?: 'app' | 'sms' | 'both';
  attachments?: { type: 'photo'; url: string; caption?: string }[];
  showSenderName?: boolean;
}

export function MessageBubble({
  body,
  senderName,
  isSender,
  timestamp,
  deliveryMethod,
  attachments,
  showSenderName = false,
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
      <div
        className={`max-w-[80%] ${isSender ? 'items-end' : 'items-start'}`}
      >
        {/* Sender name (for group contexts) */}
        {showSenderName && senderName && !isSender && (
          <span className="block text-[11px] font-medium mb-1 text-zinc-500">
            {senderName}
          </span>
        )}

        {/* Attachments */}
        {attachments?.map((att, i) => (
          <div
            key={i}
            className={`mb-1 rounded-xl overflow-hidden ${
              isSender ? 'rounded-br-md' : 'rounded-bl-md'
            }`}
          >
            <div className="w-48 h-32 bg-zinc-200 flex items-center justify-center text-zinc-400 text-xs">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {att.caption ?? 'Photo'}
              </div>
            </div>
          </div>
        ))}

        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
            isSender
              ? 'bg-[#00a9e0] text-white rounded-br-md'
              : 'bg-[#f4f4f5] text-zinc-900 rounded-bl-md'
          }`}
        >
          {body}
        </div>

        {/* Footer: timestamp + delivery indicator */}
        <div
          className={`flex items-center gap-1.5 mt-1 ${
            isSender ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-[10px] text-zinc-400">{time}</span>
          {deliveryMethod && deliveryMethod !== 'app' && (
            <span
              className="text-[9px] text-zinc-400 bg-zinc-100 px-1 rounded"
              title={
                deliveryMethod === 'sms'
                  ? 'Sent via SMS'
                  : 'Sent via app + SMS'
              }
            >
              {deliveryMethod === 'sms' ? 'SMS' : 'SMS synced'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
