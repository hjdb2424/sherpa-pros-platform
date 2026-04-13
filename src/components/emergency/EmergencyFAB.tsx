'use client';

import Link from 'next/link';

export function EmergencyFAB() {
  return (
    <Link
      href="/client/emergency"
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/30 transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 animate-[pulse_3s_ease-in-out_infinite] lg:bottom-8 lg:right-8"
      aria-label="Emergency - Get a Pro now"
    >
      <span className="text-sm font-black tracking-wide">SOS</span>
    </Link>
  );
}
