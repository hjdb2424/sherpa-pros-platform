"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  BriefcaseIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  GiftIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Pros", href: "/pros", icon: WrenchScrewdriverIcon },
  { label: "Jobs", href: "/jobs", icon: BriefcaseIcon },
  { label: "Payments", href: "/payments", icon: CreditCardIcon },
  {
    label: "Disputes",
    href: "/disputes",
    icon: ExclamationTriangleIcon,
  },
  { label: "Access List", href: "/admin/access-list", icon: UserGroupIcon },
  { label: "Rewards", href: "/admin/rewards", icon: GiftIcon },
  { label: "Audit Logs", href: "/admin/logs", icon: ClipboardDocumentListIcon },
  { label: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-3 top-12 z-40 rounded-lg bg-zinc-900 p-2 text-white shadow-lg lg:hidden"
        aria-label="Open admin menu"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-zinc-900 pt-8 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-zinc-400 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="px-5 pb-6">
          <Logo size="md" />
          <div className="mt-1">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-zinc-500">
              ADMIN
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sky-500/20 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-sky-400" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-5 py-4">
          <p className="text-[10px] text-zinc-600">
            Sherpa Pros v0.1.0
          </p>
        </div>
      </aside>
    </>
  );
}
