'use client';

import { useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import SherpaConcierge from './SherpaConcierge';

export interface SCPBannerProps {
  clientName: string;
  isSubscribed?: boolean;
}

export default function SCPBanner({ clientName, isSubscribed = false }: SCPBannerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-[#00a9e0]/20 bg-gradient-to-r from-[#00a9e0]/5 to-sky-50 p-4 dark:from-[#00a9e0]/10 dark:to-sky-950/30 dark:border-sky-800/40">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white">
            M
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Your Sherpa Client Pro
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Maya — {isSubscribed ? 'Premium Support' : 'AI-Assisted'}
              </p>
              {isSubscribed && (
                <span className="inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  PREMIUM
                </span>
              )}
            </div>
          </div>

          {/* Chat button */}
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#00a9e0] px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30 active:scale-95"
          >
            <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
            Chat
          </button>
        </div>

        {isSubscribed ? (
          <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
            AI-powered with dedicated human support
          </p>
        ) : (
          <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
            AI-powered with human support available{' '}
            <span className="font-medium text-[#00a9e0] dark:text-sky-400 cursor-pointer hover:underline">
              Upgrade to Sherpa Plan for dedicated human support
            </span>
          </p>
        )}
      </div>

      <SherpaConcierge
        role="scp"
        userName={clientName}
        agentName="Maya"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
