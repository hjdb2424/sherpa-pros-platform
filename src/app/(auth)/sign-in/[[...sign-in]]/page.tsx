"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Clerk-based sign-in (only rendered when Clerk env vars are present)
// ---------------------------------------------------------------------------
function ClerkSignIn() {
  // Dynamic import avoids build errors when Clerk is not installed or
  // env vars are missing.  The component is only rendered when
  // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set (see below).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { SignIn } = require("@clerk/nextjs");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-zinc-900">SHERPA</span>{" "}
            <span className="text-[#ff4500]">PROS</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Sign in to your account</p>
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
// Test user definitions
// ---------------------------------------------------------------------------
const TEST_USERS = [
  {
    name: "John Smith",
    label: "Standard User",
    email: "testclient@test.com",
    description: "Property owner seeking maintenance services",
    role: "client" as const,
    icon: UserIcon,
    color: "bg-[#00a9e0]/10 text-[#00a9e0]",
  },
  {
    name: "Sarah Johnson",
    label: "Pro Manager",
    email: "promanager@test.com",
    description: "Managing multiple residential properties",
    role: "pro" as const,
    icon: BuildingOfficeIcon,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Mike Rodriguez",
    label: "Service Provider",
    email: "contractor@test.com",
    description: "Licensed contractor providing services",
    role: "pro" as const,
    icon: WrenchScrewdriverIcon,
    color: "bg-amber-50 text-amber-600",
  },
];

// ---------------------------------------------------------------------------
// Test Portal (used when Clerk is not configured)
// ---------------------------------------------------------------------------
function TestPortal() {
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleAccess() {
    if (!userType) return;
    setLoading(true);

    // Persist chosen role to localStorage so dashboard pages can read it
    localStorage.setItem("sherpa-test-role", userType);
    localStorage.setItem("sherpa-test-auth", "true");

    const destination =
      userType === "client" ? "/client/dashboard" : "/pro/dashboard";
    router.push(destination);
  }

  function handleTestUser(role: "pro" | "client", email: string) {
    setLoading(true);
    localStorage.setItem("sherpa-test-role", role);
    localStorage.setItem("sherpa-test-auth", "true");
    localStorage.setItem("sherpa-test-email", email);

    const destination =
      role === "client" ? "/client/dashboard" : "/pro/dashboard";
    router.push(destination);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-zinc-900">SHERPA</span>{" "}
            <span className="text-[#ff4500]">PROS</span>
          </h1>
          <h2 className="mt-3 text-xl font-semibold text-zinc-900">
            Testing Environment
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Sherpa Pros Development &amp; Field Testing Portal
          </p>

          {/* Badges */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#00a9e0]/10 px-3 py-1 text-xs font-medium text-[#00a9e0]">
              <BeakerIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Beta Testing
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Secure Environment
            </span>
          </div>
        </div>

        {/* OAuth Sign-In Buttons */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 mb-6">
          <div className="space-y-3 mb-6">
            <a
              href="/api/auth/google"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </a>
            <a
              href="/api/auth/apple"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </a>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-zinc-400">or continue with test portal</span>
            </div>
          </div>
        </div>

        {/* Access Portal Card */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">
            Access Portal
          </h3>

          {/* User Type Select */}
          <label htmlFor="user-type" className="sr-only">
            Select user type
          </label>
          <select
            id="user-type"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 transition-colors"
          >
            <option value="" disabled>
              Select user type to test...
            </option>
            <option value="client">Property Owner</option>
            <option value="pro">Pro / Service Provider</option>
            <option value="pro-manager">Pro Manager</option>
          </select>

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleAccess}
            disabled={!userType || loading}
            className="mt-4 w-full rounded-lg bg-[#00a9e0] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0090c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Accessing...
              </span>
            ) : (
              "Access Testing Portal"
            )}
          </button>
        </div>

        {/* Test Users Section */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Available Test Users
          </h3>

          <div className="space-y-3">
            {TEST_USERS.map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => handleTestUser(user.role, user.email)}
                disabled={loading}
                className="w-full text-left bg-white border border-zinc-200 rounded-lg p-4 shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${user.color}`}
                  >
                    <user.icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900">
                        {user.name}
                      </span>
                      <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                        {user.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">{user.email}</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {user.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-400">
          This is a testing environment. No real accounts are used.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export — Clerk when available, Test Portal otherwise
// ---------------------------------------------------------------------------
const clerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function SignInPage() {
  if (clerkAvailable) {
    return <ClerkSignIn />;
  }
  return <TestPortal />;
}
