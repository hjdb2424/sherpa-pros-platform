"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/brand/Logo";
import { seedUserData } from "@/lib/seed-user-data";
import type { UserRole, UserSubtype } from "@/lib/auth/roles";
import { getDashboardPath } from "@/lib/auth/roles";

type Step = "role" | "subtype";

export default function SelectRolePage() {
  const [isPending, setIsPending] = useState(false);
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const router = useRouter();

  function commit(role: UserRole, subtype: UserSubtype) {
    setIsPending(true);
    const email = localStorage.getItem("sherpa-test-email") ?? "user@test.com";

    // localStorage keys
    localStorage.setItem("sherpa-test-role", role);
    localStorage.setItem(`sherpa:${email}:role`, role);
    if (subtype) {
      localStorage.setItem(`sherpa:${email}:subtype`, subtype);
    }

    // Cookie for middleware (expires in 30 days)
    document.cookie = `sherpa-role=${role}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;

    seedUserData(email, role);
    router.replace(getDashboardPath(role));
  }

  function handleRoleSelect(role: UserRole) {
    if (role === "pm") {
      // PM has no subtype — commit immediately
      commit("pm", null);
      return;
    }
    setSelectedRole(role);
    setStep("subtype");
  }

  function handleSubtypeSelect(subtype: UserSubtype) {
    if (!selectedRole) return;
    commit(selectedRole, subtype);
  }

  function handleBack() {
    setStep("role");
    setSelectedRole(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Welcome to Sherpa Pros
          </h1>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 sm:text-lg">
            {step === "role" ? "What brings you here?" : "Tell us a bit more"}
          </p>
        </div>

        {/* ── Step 1: Role selection ─────────────────────────────── */}
        {step === "role" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* I need a Pro — client role */}
              <button
                type="button"
                onClick={() => handleRoleSelect("client")}
                disabled={isPending}
                className="group relative flex flex-col items-center rounded-2xl border-2 border-[#00a9e0]/30 bg-[#00a9e0]/5 px-6 py-10
                           text-center shadow-sm transition-all duration-200
                           hover:border-[#00a9e0] hover:bg-[#00a9e0]/10 hover:shadow-lg hover:shadow-[#00a9e0]/15
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2
                           disabled:cursor-not-allowed disabled:opacity-50
                           dark:border-[#0ea5e9]/30 dark:bg-[#0ea5e9]/5 dark:hover:border-[#0ea5e9] dark:hover:bg-[#0ea5e9]/10"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00a9e0]/15 text-[#00a9e0]
                                transition-colors group-hover:bg-[#00a9e0]/25 dark:text-[#0ea5e9]">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </div>
                <h2 className="mb-1.5 text-xl font-bold text-zinc-900 dark:text-white">
                  I need a Pro
                </h2>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Find trusted contractors for your project
                </p>
                <div className="mt-5 flex items-center text-sm font-semibold text-[#00a9e0] transition-transform group-hover:translate-x-0.5 dark:text-[#0ea5e9]">
                  Get started
                  <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>

              {/* I'm a Pro — pro role */}
              <button
                type="button"
                onClick={() => handleRoleSelect("pro")}
                disabled={isPending}
                className="group relative flex flex-col items-center rounded-2xl border-2 border-zinc-200 bg-white px-6 py-10
                           text-center shadow-sm transition-all duration-200
                           hover:border-zinc-900 hover:shadow-lg hover:shadow-zinc-900/10
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2
                           disabled:cursor-not-allowed disabled:opacity-50
                           dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-white dark:hover:shadow-white/10"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700
                                transition-colors group-hover:bg-zinc-900 group-hover:text-white
                                dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-white dark:group-hover:text-zinc-900">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                    />
                  </svg>
                </div>
                <h2 className="mb-1.5 text-xl font-bold text-zinc-900 dark:text-white">
                  I&apos;m a Pro
                </h2>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Find jobs and grow your business
                </p>
                <div className="mt-5 flex items-center text-sm font-semibold text-zinc-900 transition-transform group-hover:translate-x-0.5 dark:text-white">
                  Get started
                  <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Property Manager — prominent third option */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => handleRoleSelect("pm")}
                disabled={isPending}
                className="group flex w-full items-center gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4
                           text-left transition-all duration-200
                           hover:border-zinc-300 hover:bg-zinc-50
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2
                           disabled:cursor-not-allowed disabled:opacity-50
                           dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/70"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500
                                transition-colors group-hover:bg-[#00a9e0]/10 group-hover:text-[#00a9e0]
                                dark:bg-zinc-800 dark:text-zinc-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    I manage properties
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Work orders, vendors, and compliance
                  </p>
                </div>
                <svg className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Client subtype ─────────────────────────────── */}
        {step === "subtype" && selectedRole === "client" && (
          <>
            <button
              type="button"
              onClick={handleBack}
              className="mb-6 flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>

            <div className="grid grid-cols-1 gap-4">
              {/* Homeowner */}
              <button
                type="button"
                onClick={() => handleSubtypeSelect("residential")}
                disabled={isPending}
                className="group flex items-center gap-4 rounded-xl border-2 border-[#00a9e0]/20 bg-[#00a9e0]/5 px-5 py-5
                           text-left transition-all duration-200
                           hover:border-[#00a9e0] hover:bg-[#00a9e0]/10 hover:shadow-md
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2
                           disabled:cursor-not-allowed disabled:opacity-50
                           dark:border-[#0ea5e9]/20 dark:bg-[#0ea5e9]/5 dark:hover:border-[#0ea5e9] dark:hover:bg-[#0ea5e9]/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00a9e0]/15 text-[#00a9e0] dark:text-[#0ea5e9]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Homeowner</h3>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Single property, personal projects</p>
                </div>
                <svg className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00a9e0] dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* Investor (multi-property) */}
              <button
                type="button"
                onClick={() => handleSubtypeSelect("residential_pro")}
                disabled={isPending}
                className="group flex items-center gap-4 rounded-xl border-2 border-[#00a9e0]/20 bg-[#00a9e0]/5 px-5 py-5
                           text-left transition-all duration-200
                           hover:border-[#00a9e0] hover:bg-[#00a9e0]/10 hover:shadow-md
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2
                           disabled:cursor-not-allowed disabled:opacity-50
                           dark:border-[#0ea5e9]/20 dark:bg-[#0ea5e9]/5 dark:hover:border-[#0ea5e9] dark:hover:bg-[#0ea5e9]/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00a9e0]/15 text-[#00a9e0] dark:text-[#0ea5e9]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m4.5-18v18m4.5-18v18m4.5-18v18m3-18v18M5.25 6h.008v.008H5.25V6Zm0 3h.008v.008H5.25V9Zm0 3h.008v.008H5.25V12Zm4.5-6h.008v.008H9.75V6Zm0 3h.008v.008H9.75V9Zm0 3h.008v.008H9.75V12Zm4.5-6h.008v.008h-.008V6Zm0 3h.008v.008h-.008V9Zm0 3h.008v.008h-.008V12Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Investor (multi-property)</h3>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Rental properties, flips, portfolios</p>
                </div>
                <svg className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00a9e0] dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* Commercial */}
              <button
                type="button"
                onClick={() => handleSubtypeSelect("commercial")}
                disabled={isPending}
                className="group flex items-center gap-4 rounded-xl border-2 border-[#00a9e0]/20 bg-[#00a9e0]/5 px-5 py-5
                           text-left transition-all duration-200
                           hover:border-[#00a9e0] hover:bg-[#00a9e0]/10 hover:shadow-md
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2
                           disabled:cursor-not-allowed disabled:opacity-50
                           dark:border-[#0ea5e9]/20 dark:bg-[#0ea5e9]/5 dark:hover:border-[#0ea5e9] dark:hover:bg-[#0ea5e9]/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00a9e0]/15 text-[#00a9e0] dark:text-[#0ea5e9]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Commercial</h3>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Office, retail, or industrial spaces</p>
                </div>
                <svg className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00a9e0] dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Pro subtype ────────────────────────────────── */}
        {step === "subtype" && selectedRole === "pro" && (
          <>
            <button
              type="button"
              onClick={handleBack}
              className="mb-6 flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>

            <div className="grid grid-cols-1 gap-4">
              {/* Standard Pro */}
              <button
                type="button"
                onClick={() => handleSubtypeSelect("standard")}
                disabled={isPending}
                className="group flex items-center gap-4 rounded-xl border-2 border-zinc-200 bg-white px-5 py-5
                           text-left transition-all duration-200
                           hover:border-zinc-900 hover:shadow-md hover:shadow-zinc-900/10
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2
                           disabled:cursor-not-allowed disabled:opacity-50
                           dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-white dark:hover:shadow-white/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700
                                transition-colors group-hover:bg-zinc-900 group-hover:text-white
                                dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-white dark:group-hover:text-zinc-900">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Standard Pro</h3>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Own insurance, licensed &mdash; 12% platform fee</p>
                </div>
                <svg className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* Flex Pro */}
              <button
                type="button"
                onClick={() => handleSubtypeSelect("flex")}
                disabled={isPending}
                className="group flex items-center gap-4 rounded-xl border-2 border-zinc-200 bg-white px-5 py-5
                           text-left transition-all duration-200
                           hover:border-zinc-900 hover:shadow-md hover:shadow-zinc-900/10
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2
                           disabled:cursor-not-allowed disabled:opacity-50
                           dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-white dark:hover:shadow-white/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700
                                transition-colors group-hover:bg-zinc-900 group-hover:text-white
                                dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-white dark:group-hover:text-zinc-900">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Flex Pro</h3>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Side-hustle friendly &mdash; 18% fee includes insurance</p>
                </div>
                <svg className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Loading spinner */}
        {isPending && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <svg className="h-5 w-5 animate-spin text-[#00a9e0]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Setting up your account...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
