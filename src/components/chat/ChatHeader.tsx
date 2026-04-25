'use client';

interface ChatHeaderProps {
  participantName: string;
  participantRole: 'pro' | 'client' | 'pm';
  participantInitials: string;
  avatarColor?: string;
  isOnline?: boolean;
  phone?: string;
  onBack?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  pro: 'Pro',
  client: 'Client',
  pm: 'Property Manager',
};

export function ChatHeader({
  participantName,
  participantRole,
  participantInitials,
  avatarColor = '#6366f1',
  isOnline = false,
  phone,
  onBack,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-zinc-100 shrink-0">
      {/* Back button (mobile) */}
      {onBack && (
        <button
          onClick={onBack}
          className="shrink-0 p-1.5 -ml-1.5 rounded-full hover:bg-zinc-100 transition-colors md:hidden"
          aria-label="Back to conversations"
        >
          <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Avatar with online dot */}
      <div className="relative shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ backgroundColor: avatarColor }}
        >
          {participantInitials}
        </div>
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isOnline ? 'bg-emerald-500' : 'bg-zinc-300'
          }`}
        />
      </div>

      {/* Name + role */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-zinc-900 truncate">
          {participantName}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600">
            {ROLE_LABELS[participantRole] ?? participantRole}
          </span>
          {isOnline && (
            <span className="text-[10px] text-emerald-600 font-medium">Online</span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Call button */}
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-[#00a9e0]"
            aria-label="Call"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        ) : (
          <button
            className="p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 cursor-not-allowed"
            disabled
            aria-label="Call unavailable"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        )}

        {/* Video button (placeholder) */}
        <button
          className="p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 cursor-not-allowed"
          disabled
          aria-label="Video call (coming soon)"
          title="Video call coming soon"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
