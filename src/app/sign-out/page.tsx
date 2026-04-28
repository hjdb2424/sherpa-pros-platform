"use client";

import { useEffect, useState } from "react";

const clerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Sign-out page. Calls Clerk's signOut() then redirects home.
 * Linked from the data room nav so investors can cleanly end a session.
 */
export default function SignOutPage() {
  if (clerkAvailable) {
    return <ClerkSignOut />;
  }
  return <FallbackSignOut />;
}

function ClerkSignOut() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useClerk } = require("@clerk/nextjs");
  const clerk = useClerk();
  const [status, setStatus] = useState("Signing you out…");

  useEffect(() => {
    clerk
      .signOut()
      .then(() => {
        setStatus("Signed out. Redirecting…");
        window.location.href = "/";
      })
      .catch(() => {
        // Fallback — clear local cookies and redirect anyway.
        document.cookie = "sherpa-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "sherpa-is-admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/";
      });
  }, [clerk]);

  return <Status text={status} />;
}

function FallbackSignOut() {
  const [status, setStatus] = useState("Signing you out…");

  useEffect(() => {
    document.cookie = "sherpa-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "sherpa-is-admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setStatus("Signed out. Redirecting…");
    window.location.href = "/";
  }, []);

  return <Status text={status} />;
}

function Status({ text }: { text: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-700 dark:bg-[#0a0a0f] dark:text-zinc-300">
      <p className="text-sm">{text}</p>
    </div>
  );
}
