import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Pros",
};

export default function ForProsPage() {
  return (
    <div className="flex-1 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Grow your business with Sherpa Pros
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Stop chasing leads. Get dispatched to jobs that match your skills,
          schedule, and location.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "Instant dispatch",
              desc: "Get notified of nearby jobs the moment they're posted.",
            },
            {
              title: "Fair pricing",
              desc: "Set your own rates. No bidding wars.",
            },
            {
              title: "Verified reviews",
              desc: "Build your reputation with real client reviews and ratings.",
            },
            {
              title: "Fast payments",
              desc: "Get paid directly through the platform. No chasing invoices.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/sign-up"
            className="inline-block rounded-full bg-[#1a1a2e] px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Join as a Pro
          </a>
        </div>
      </div>
    </div>
  );
}
