'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/for-pros', label: 'For Pros' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 focus-visible:ring-offset-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00a9e0]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-white"
              aria-hidden="true"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-zinc-900">
            Sherpa<span className="text-[#ff4500]">Pros</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sign-in"
            className="rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Sign In
          </Link>
          <Link
            href="/client/post-job"
            className="rounded-full bg-[#00a9e0] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0ea5e9] hover:shadow-lg hover:shadow-[#00a9e0]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Post a Job
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-100 bg-white md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <div className="pt-2">
              <Link
                href="/client/post-job"
                className="block rounded-full bg-[#00a9e0] px-5 py-2.5 text-center text-base font-semibold text-white transition-all hover:bg-[#0ea5e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={() => setMobileOpen(false)}
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
