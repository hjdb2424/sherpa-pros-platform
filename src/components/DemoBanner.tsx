"use client";

import { useState, useEffect } from "react";

export default function DemoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isDemo = localStorage.getItem("sherpa-test-auth") === "true";
    const dismissed = sessionStorage.getItem("sherpa-demo-banner-dismissed");
    if (isDemo && !dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="relative z-50 flex items-center justify-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800">
      <svg
        className="h-3.5 w-3.5 shrink-0 text-amber-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
      <span>
        <strong>Demo Mode</strong> — You&apos;re exploring with sample data.
        Ready to go live?{" "}
        <a
          href="mailto:poum@hjd.builders"
          className="font-semibold underline hover:text-amber-900"
        >
          Contact us
        </a>
        .
      </span>
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem("sherpa-demo-banner-dismissed", "true");
          setVisible(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-amber-400 hover:text-amber-600 transition-colors"
        aria-label="Dismiss demo banner"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
