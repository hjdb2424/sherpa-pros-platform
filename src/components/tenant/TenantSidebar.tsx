'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/brand/Logo';

const navItems = [
  {
    label: 'Dashboard',
    href: '/tenant/dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'My Requests',
    href: '/tenant/my-requests',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
  },
  {
    label: 'Messages',
    href: '/tenant/messages',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/tenant/profile',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
];

export default function TenantSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/tenant/dashboard') return pathname === '/tenant/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop sidebar — slim, minimal */}
      <aside className="fixed top-0 left-0 z-40 hidden h-full w-56 flex-col border-r border-zinc-100 bg-white lg:flex dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-16 items-center px-5">
          <Logo size="sm" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Tenant navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sky-50 text-[#00a9e0] dark:bg-[#00a9e0]/10'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">Alex Rivera</p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">Tenant</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top header */}
      <header className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b border-zinc-100 bg-white px-4 lg:left-56 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center lg:hidden">
          <Logo size="sm" />
        </div>
        <div className="hidden lg:block">
          <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tenant Portal</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            AR
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed right-0 bottom-0 left-0 z-40 flex items-stretch border-t border-zinc-200 bg-white safe-area-pb lg:hidden dark:border-zinc-800 dark:bg-zinc-950"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors ${
                active
                  ? 'text-[#00a9e0]'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="flex h-7 w-7 items-center justify-center">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
