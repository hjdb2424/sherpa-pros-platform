"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/brand/Logo";
import { seedUserData } from "@/lib/seed-user-data";

export default function SelectRolePage() {
  const [isPending, setIsPending] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  function handleSelect(role: "pro" | "client" | "pm" | "tenant") {
    setIsPending(true);
    const email = localStorage.getItem("sherpa-test-email") ?? "user@test.com";
    localStorage.setItem("sherpa-test-role", role);
    localStorage.setItem(`sherpa:${email}:role`, role);
    seedUserData(email, role);

    if (role === "pm") {
      router.replace("/pm/dashboard");
    } else if (role === "pro") {
      router.replace("/pro/dashboard");
    } else if (role === "tenant") {
      router.replace("/tenant/dashboard");
    } else {
      router.replace("/client/dashboard");
    }
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
            What brings you here?
          </p>
        </div>

        {/* Two hero choices */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* I need a Pro — client role */}
          <button
            type="button"
            onClick={() => handleSelect("client")}
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
            onClick={() => handleSelect("pro")}
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

        {/* Divider with "More options" */}
        <div className="mt-10">
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="group flex w-full items-center gap-3 text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span className="flex items-center gap-1.5 font-medium">
              More options
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </button>

          {/* Secondary options */}
          {showMore && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Property Manager */}
              <button
                type="button"
                onClick={() => handleSelect("pm")}
                disabled={isPending}
                className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4
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
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    I manage properties
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Work orders, vendors, and compliance
                  </p>
                </div>
              </button>

              {/* Tenant */}
              <button
                type="button"
                onClick={() => handleSelect("tenant")}
                disabled={isPending}
                className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4
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
                      d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    I&apos;m a tenant
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Submit and track maintenance requests
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

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
