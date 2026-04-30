"use client";

import { useEffect, useState } from "react";

/**
 * Sign-out page. Clears all sherpa cookies + localStorage, then redirects home.
 * Linked from the data room nav so investors can cleanly end a session.
 */
export default function SignOutPage() {
  const [status, setStatus] = useState("Signing you out…");

  useEffect(() => {
    const cookieNames = [
      "sherpa-role",
      "sherpa-is-admin",
      "sherpa-user",
      "sherpa-auth",
      "sherpa-dev-bypass",
    ];
    for (const name of cookieNames) {
      document.cookie = `${name}=; max-age=0; path=/;`;
    }

    try {
      localStorage.clear();
    } catch {
      // ignore — Safari private mode can throw
    }

    setStatus("Signed out. Redirecting…");
    window.location.href = "/";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-700 dark:bg-[#0a0a0f] dark:text-zinc-300">
      <p className="text-sm">{status}</p>
    </div>
  );
}
