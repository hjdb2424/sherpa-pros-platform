import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
};

export default function HowItWorksPage() {
  return (
    <div className="flex-1 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          How Sherpa Pros Works
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Whether you need a quick repair or a full renovation, Sherpa Pros
          connects you with the right professional in minutes.
        </p>

        <div className="mt-12 space-y-10">
          {[
            {
              title: "For Clients",
              steps: [
                "Post a job with details, photos, and your budget",
                "Get matched with verified pros based on trade, location, and rating",
                "Review profiles, accept a match, and track the job in real time",
                "Pay securely through the platform and leave a review",
              ],
            },
            {
              title: "For Pros",
              steps: [
                "Create your profile with trades, certifications, and service area",
                "Receive dispatch notifications for nearby jobs",
                "Accept jobs, communicate with clients, and log progress",
                "Get paid fast with transparent earnings tracking",
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {section.title}
              </h2>
              <ol className="mt-4 list-inside list-decimal space-y-3 text-zinc-600 dark:text-zinc-400">
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
