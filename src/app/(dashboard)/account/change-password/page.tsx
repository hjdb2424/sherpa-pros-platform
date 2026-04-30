"use client";

import { useEffect, useRef } from "react";
import { UserProfile } from "@clerk/nextjs";

// Brand color
const BRAND_BLUE = "#00a9e0";

/**
 * /account/change-password
 *
 * Renders Clerk's <UserProfile> (which natively handles password change).
 * On mount and on unmount we ping /api/account/password-changed so that
 * once the user actually swaps their temp password (Clerk handles the
 * password write itself), our access_list.password_changed flips to true
 * and the proxy stops force-redirecting them here.
 *
 * We can't directly observe Clerk's "password updated" event from outside
 * the iframe-style component, so we use a simple "mark-on-leave" heuristic:
 *   1. ping once on mount (covers the case where Clerk reports "already
 *      changed" before this page even loaded — defensive no-op for fresh
 *      temp pws)
 *   2. ping again on unmount / pagehide (the user navigating away after
 *      saving is the strongest signal we'll get without webhooks)
 *
 * The endpoint is idempotent — calling it when nothing changed is harmless.
 */
export default function ChangePasswordPage() {
  const pingedRef = useRef(false);

  useEffect(() => {
    const ping = () => {
      // Best-effort fire-and-forget. keepalive lets it survive unload.
      try {
        fetch("/api/account/password-changed", {
          method: "POST",
          keepalive: true,
        }).catch(() => {});
      } catch {
        // ignore
      }
    };

    // Mount-time ping (handles "changed in another tab" edge cases).
    if (!pingedRef.current) {
      pingedRef.current = true;
      ping();
    }

    // Unload / route-away ping.
    const onPageHide = () => ping();
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      ping();
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">
            Change your password
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your temporary password has expired (or is about to). Set a new
            one below to keep using Sherpa Pros.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm sm:p-4">
          <UserProfile
            appearance={{
              variables: {
                colorPrimary: BRAND_BLUE,
                borderRadius: "0.75rem",
              },
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0",
              },
            }}
            routing="hash"
          />
        </div>
      </div>
    </div>
  );
}
