"use client";

interface HelpAndSupportProps {
  role: "pm" | "pro" | "client";
}

export default function HelpAndSupport({ role }: HelpAndSupportProps) {
  function startTour() {
    // Remove completed flag so tour re-triggers
    localStorage.removeItem(`sherpa-tour-completed-${role}`);
    // Dispatch event that OnboardingTour listens for
    window.dispatchEvent(
      new CustomEvent("sherpa-start-tour", { detail: { role } })
    );
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
        Help &amp; Support
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Resources and guided walkthroughs.
      </p>
      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={startTour}
          className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-[#00a9e0]/40 hover:bg-sky-50 hover:text-[#00a9e0] dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-[#00a9e0]/40 dark:hover:bg-[#00a9e0]/10"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
            />
          </svg>
          Take a Guided Tour
        </button>
        <a
          href="mailto:poum@hjd.builders"
          className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-[#00a9e0]/40 hover:bg-sky-50 hover:text-[#00a9e0] dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-[#00a9e0]/40 dark:hover:bg-[#00a9e0]/10"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
          Contact Support
        </a>
      </div>
    </section>
  );
}
