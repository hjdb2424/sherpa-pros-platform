"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/brand/Logo";
import { seedUserData } from "@/lib/seed-user-data";

export default function DemoProPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("sherpa-test-role", "pro");
    localStorage.setItem("sherpa-test-auth", "true");
    localStorage.setItem("sherpa-test-email", "mike.rodriguez@test.com");
    // Seed user-scoped data on demo entry
    seedUserData("mike.rodriguez@test.com", "pro");

    const timer = setTimeout(() => {
      router.replace("/pro/dashboard");
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 gap-6">
      <Logo size="xl" />
      <div className="flex items-center gap-3">
        <svg
          className="h-5 w-5 animate-spin text-[#ff4500]"
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
        <p className="text-sm text-zinc-500">Setting up your Pro demo...</p>
      </div>
    </div>
  );
}
