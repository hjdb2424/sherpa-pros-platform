"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheckIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Logo from "@/components/brand/Logo";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";
import {
  PM_ACCOUNTS,
  PRO_ACCOUNTS,
  CLIENT_ACCOUNTS,
  type DemoAccount,
  type DemoRole,
  getDestination,
} from "@/lib/demo-accounts";

// ---------------------------------------------------------------------------
// Clerk-based sign-in (only rendered when Clerk env vars are present)
// ---------------------------------------------------------------------------
function ClerkSignIn() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { SignIn } = require("@clerk/nextjs");
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Logo size="xl" />
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            {t("auth.signInToAccount")}
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-white border border-zinc-200 shadow-sm",
              headerTitle: "text-zinc-900",
              headerSubtitle: "text-zinc-500",
              formButtonPrimary:
                "bg-[#00a9e0] hover:bg-[#0090c0] text-white font-semibold",
              formFieldInput:
                "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400",
              formFieldLabel: "text-zinc-700",
              footerActionLink: "text-[#00a9e0] hover:text-[#0090c0]",
              identityPreviewEditButton: "text-[#00a9e0]",
              socialButtonsBlockButton:
                "border-zinc-200 text-zinc-900 hover:bg-zinc-50",
              socialButtonsBlockButtonText: "text-zinc-900",
              dividerLine: "bg-zinc-200",
              dividerText: "text-zinc-400",
            },
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badge colors by role
// ---------------------------------------------------------------------------
const BADGE_STYLES: Record<DemoRole, string> = {
  pm: "bg-[#8b5cf6] text-white",
  pro: "bg-[#ff4500] text-white",
  client: "bg-[#00a9e0] text-white",
};

// ---------------------------------------------------------------------------
// Account groups
// ---------------------------------------------------------------------------
const SECTIONS: { title: string; count: number; accounts: DemoAccount[] }[] = [
  { title: "Property Managers", count: PM_ACCOUNTS.length, accounts: PM_ACCOUNTS },
  { title: "Service Pros", count: PRO_ACCOUNTS.length, accounts: PRO_ACCOUNTS },
  { title: "Clients", count: CLIENT_ACCOUNTS.length, accounts: CLIENT_ACCOUNTS },
];

// ---------------------------------------------------------------------------
// Test Portal (used when Clerk is not configured)
// ---------------------------------------------------------------------------
function TestPortal() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { t } = useI18n();

  function handleTestUser(user: DemoAccount) {
    setLoading(true);
    localStorage.setItem("sherpa-test-role", user.role);
    localStorage.setItem("sherpa-test-auth", "true");
    localStorage.setItem("sherpa-test-email", user.email);
    router.push(getDestination(user.role));
  }

  const filteredSections = useMemo(() => {
    if (!search.trim()) return SECTIONS;
    const q = search.toLowerCase();
    return SECTIONS.map((section) => ({
      ...section,
      accounts: section.accounts.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.badge.toLowerCase().includes(q)
      ),
    })).filter((s) => s.accounts.length > 0);
  }, [search]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <Logo size="xl" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-zinc-900">
            {t("auth.testingEnvironment")}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {t("auth.testPortalDesc")}
          </p>

          {/* Badges */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#00a9e0]/10 px-3 py-1 text-xs font-medium text-[#00a9e0]">
              <BeakerIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {t("auth.betaTesting")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {t("auth.secureEnvironment")}
            </span>
          </div>
        </div>

        {/* OAuth Sign-In Buttons */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-5 mb-5">
          <div className="space-y-3 mb-5">
            <a
              href="/api/auth/google"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t("auth.continueWithGoogle")}
            </a>
            <a
              href="/api/auth/apple"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              {t("auth.continueWithApple")}
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-zinc-400">
                {t("auth.orContinueWith")}
              </span>
            </div>
          </div>
        </div>

        {/* Search / Filter */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search accounts by name, trade, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-1"
          />
        </div>

        {/* Test Users grouped by role */}
        <div className="space-y-5">
          {filteredSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                {section.title} ({section.accounts.length})
              </h3>
              <div className="space-y-2">
                {section.accounts.map((user) => (
                  <button
                    key={user.email}
                    type="button"
                    onClick={() => handleTestUser(user)}
                    disabled={loading}
                    className="w-full text-left bg-white border border-zinc-200 rounded-lg px-4 py-3 shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-900">
                            {user.name}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${BADGE_STYLES[user.role]}`}
                          >
                            {user.badge}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-600 truncate">
                          {user.description}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {user.location}
                        </p>
                      </div>

                      {/* Arrow */}
                      <span className="text-lg text-zinc-300">&rsaquo;</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <p className="text-center text-sm text-zinc-400 py-8">
              No accounts match &ldquo;{search}&rdquo;
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <LanguageSwitcher variant="full" />
          <p className="text-center text-xs text-zinc-400">
            {t("auth.testEnvDisclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------
const clerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function SignInPage() {
  if (clerkAvailable) {
    return <ClerkSignIn />;
  }
  return <TestPortal />;
}
