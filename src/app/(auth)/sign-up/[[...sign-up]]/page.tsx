"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheckIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Clerk-based sign-up (only rendered when Clerk env vars are present)
// ---------------------------------------------------------------------------
function ClerkSignUp() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { SignUp } = require("@clerk/nextjs");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-zinc-900">SHERPA</span>{" "}
            <span className="text-[#ff4500]">PROS</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Create your account</p>
        </div>
        <SignUp
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
// Test sign-up form (used when Clerk is not configured)
// ---------------------------------------------------------------------------
function TestSignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !role) return;
    setLoading(true);

    localStorage.setItem("sherpa-test-role", role);
    localStorage.setItem("sherpa-test-auth", "true");
    localStorage.setItem("sherpa-test-email", email);
    localStorage.setItem("sherpa-test-name", name);

    const destination =
      role === "client" ? "/client/dashboard" : "/pro/dashboard";
    router.push(destination);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-zinc-900">SHERPA</span>{" "}
            <span className="text-[#ff4500]">PROS</span>
          </h1>
          <h2 className="mt-3 text-xl font-semibold text-zinc-900">
            Join the Beta
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Create a test account to explore the platform
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

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">
            Create Test Account
          </h3>

          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="signup-name"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 transition-colors"
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label
              htmlFor="signup-role"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              I am a...
            </label>
            <select
              id="signup-role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 transition-colors"
            >
              <option value="" disabled>
                Select your role...
              </option>
              <option value="client">Property Owner</option>
              <option value="pro">Pro / Service Provider</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name || !email || !role || loading}
            className="w-full rounded-lg bg-[#00a9e0] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0090c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Creating account...
              </span>
            ) : (
              "Join Beta"
            )}
          </button>

          {/* Link to sign-in */}
          <p className="mt-4 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-400">
          This is a testing environment. No real accounts are created.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------
const clerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function SignUpPage() {
  if (clerkAvailable) {
    return <ClerkSignUp />;
  }
  return <TestSignUp />;
}
