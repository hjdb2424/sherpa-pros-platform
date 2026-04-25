"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/brand/Logo";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";
import {
  PM_ACCOUNTS,
  PRO_ACCOUNTS,
  CLIENT_ACCOUNTS,
  type DemoAccount,
  getDestination,
} from "@/lib/demo-accounts";

// All demo accounts keyed by email for lookup
const ALL_ACCOUNTS: DemoAccount[] = [
  ...PM_ACCOUNTS,
  ...PRO_ACCOUNTS,
  ...CLIENT_ACCOUNTS,
];

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
// Beta Sign-In Portal — clean email-based login
// ---------------------------------------------------------------------------
function BetaPortal() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useI18n();

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const account = ALL_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === normalizedEmail
    );

    if (!account) {
      setError(
        "No account found with that email. Please check your invite or contact info@thesherpapros.com."
      );
      return;
    }

    setLoading(true);
    localStorage.setItem("sherpa-test-role", account.role);
    localStorage.setItem("sherpa-test-auth", "true");
    localStorage.setItem("sherpa-test-email", account.email);
    localStorage.setItem("sherpa-test-name", account.name);
    router.push(getDestination(account.role));
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Logo size="xl" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-zinc-900">
            Welcome to the beta
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Sign in with the email from your invite to explore the platform.
          </p>
        </div>

        {/* Sign-in card */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8">
          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-zinc-400">
                or sign in with your invite email
              </span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-1 transition-shadow"
                autoComplete="email"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full rounded-lg bg-[#00a9e0] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-center text-xs text-zinc-400">
            Don&apos;t have an invite? Visit{" "}
            <a href="/" className="text-[#00a9e0] hover:underline">
              thesherpapros.com
            </a>{" "}
            to join the waitlist.
          </p>
          <LanguageSwitcher variant="full" />
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
  return <BetaPortal />;
}
