"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/brand/Logo";

export default function DemoClientPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("sherpa-test-role", "client");
    localStorage.setItem("sherpa-test-auth", "true");
    localStorage.setItem("sherpa-test-email", "jamie.davis@test.com");
    localStorage.removeItem("sherpa-tour-completed-client");

    const timer = setTimeout(() => {
      router.replace("/client/dashboard");
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 gap-6">
      <Logo size="xl" />
      <div className="flex items-center gap-3">
        <svg
          className="h-5 w-5 animate-spin text-[#00a9e0]"
          viewBox="0 0 24 24"
          fill="none"
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
        <p className="text-sm text-zinc-500">Setting up your Client demo...</p>
      </div>
    </div>
  );
}
