"use client";

import { useState, useTransition } from "react";
import { switchToRoleAsAdmin } from "@/lib/auth/admin-switch-role";
import { ROLES, type UserRole } from "@/lib/auth/roles";

type Props = {
  currentRole: UserRole | null;
};

const OPTIONS: { role: UserRole; label: string; emoji: string }[] = [
  { role: ROLES.PRO, label: "Pro", emoji: "🛠️" },
  { role: ROLES.CLIENT, label: "Client", emoji: "🏠" },
  { role: ROLES.PM, label: "PM", emoji: "🏢" },
  { role: ROLES.TENANT, label: "Tenant", emoji: "🔑" },
];

export default function RoleSwitcherFab({ currentRole }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSwitch(role: UserRole) {
    startTransition(async () => {
      await switchToRoleAsAdmin(role);
    });
  }

  return (
    <div className="fixed left-4 bottom-4 z-[60] print:hidden">
      {open && (
        <div
          className="mb-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          role="menu"
          aria-label="Switch profile"
        >
          <div className="border-b border-zinc-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Super Beta Tester
          </div>
          {OPTIONS.map((opt) => {
            const active = opt.role === currentRole;
            return (
              <button
                key={opt.role}
                type="button"
                role="menuitem"
                disabled={isPending || active}
                onClick={() => handleSwitch(opt.role)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                  active
                    ? "cursor-default bg-amber-50 font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                } ${isPending ? "opacity-50" : ""}`}
              >
                <span aria-hidden="true">{opt.emoji}</span>
                <span className="flex-1">View as {opt.label}</span>
                {active && <span className="text-[10px] uppercase tracking-wide">current</span>}
              </button>
            );
          })}
          <a
            href="/admin/access-list"
            className="block border-t border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            ⚙️ Admin home
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Super Beta Tester profile switcher"
        aria-expanded={open}
        className="flex h-12 items-center gap-2 rounded-full bg-[#1a1a2e] px-4 text-sm font-semibold text-white shadow-lg ring-2 ring-amber-500/60 transition hover:scale-105 hover:bg-[#2a2a4e]"
      >
        <span aria-hidden="true">🦸</span>
        <span>{currentRole ? `As ${labelFor(currentRole)}` : "Pick role"}</span>
      </button>
    </div>
  );
}

function labelFor(role: UserRole): string {
  switch (role) {
    case "pro": return "Pro";
    case "client": return "Client";
    case "pm": return "PM";
    case "tenant": return "Tenant";
  }
}
