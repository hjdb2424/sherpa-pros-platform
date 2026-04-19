"use client";

import { useTransition } from "react";
import { setUserRole } from "./actions";
import Logo from "@/components/brand/Logo";

export default function SelectRolePage() {
  const [isPending, startTransition] = useTransition();

  function handleSelect(role: "pro" | "client") {
    startTransition(() => {
      setUserRole(role);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-zinc-950">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Welcome to Sherpa Pros
          </h1>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 sm:text-lg">
            How will you be using the platform?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Pro Card */}
          <button
            type="button"
            onClick={() => handleSelect("pro")}
            disabled={isPending}
            className="group relative rounded-2xl border border-zinc-200 bg-white p-8 text-left
                       shadow-sm transition-all duration-200
                       hover:border-[#00a9e0]/50 hover:bg-[#00a9e0]/5 hover:shadow-lg hover:shadow-[#00a9e0]/10
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2
                       disabled:cursor-not-allowed disabled:opacity-50
                       dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#0ea5e9]/50 dark:hover:bg-[#0ea5e9]/5"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#00a9e0]/10 text-[#00a9e0]
                            transition-colors group-hover:bg-[#00a9e0]/20">
              <svg
                className="h-7 w-7"
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
            <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
              I&apos;m a Pro
            </h2>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              I&apos;m a contractor or handyman looking for work. Find jobs,
              manage clients, and grow my business.
            </p>
            <div className="mt-6 flex items-center text-sm font-medium text-[#00a9e0] opacity-0 transition-opacity group-hover:opacity-100">
              Get started
              <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </button>

          {/* Client Card */}
          <button
            type="button"
            onClick={() => handleSelect("client")}
            disabled={isPending}
            className="group relative rounded-2xl border border-zinc-200 bg-white p-8 text-left
                       shadow-sm transition-all duration-200
                       hover:border-[#00a9e0]/50 hover:bg-[#00a9e0]/5 hover:shadow-lg hover:shadow-[#00a9e0]/10
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2
                       disabled:cursor-not-allowed disabled:opacity-50
                       dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#0ea5e9]/50 dark:hover:bg-[#0ea5e9]/5"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#00a9e0]/10 text-[#00a9e0]
                            transition-colors group-hover:bg-[#00a9e0]/20">
              <svg
                className="h-7 w-7"
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
            <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
              I need a Pro
            </h2>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              I need a Pro for my project. Post jobs, find trusted contractors,
              and manage my home projects.
            </p>
            <div className="mt-6 flex items-center text-sm font-medium text-[#00a9e0] opacity-0 transition-opacity group-hover:opacity-100">
              Get started
              <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </button>
        </div>

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
