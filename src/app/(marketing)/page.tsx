import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sherpa Pros — Uber for Construction",
};

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center bg-[#1a1a2e] px-6 text-center text-white">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Find trusted pros.
          <br />
          Get the job done.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-300">
          Sherpa Pros connects you with verified contractors, handymen, and
          tradespeople in your area — instantly.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/sign-up"
            className="rounded-full bg-white px-8 py-3 font-semibold text-[#1a1a2e] transition-opacity hover:opacity-90"
          >
            Get Started
          </a>
          <a
            href="/for-pros"
            className="rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Join as a Pro
          </a>
        </div>
      </section>

      {/* How it works summary */}
      <section className="bg-white px-6 py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Post your job",
                desc: "Describe the work, set your budget, and choose a timeline.",
              },
              {
                step: "2",
                title: "Get matched",
                desc: "Our dispatch system finds the best available pros near you.",
              },
              {
                step: "3",
                title: "Job done",
                desc: "Track progress, pay securely, and leave a review.",
              },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a2e] text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
