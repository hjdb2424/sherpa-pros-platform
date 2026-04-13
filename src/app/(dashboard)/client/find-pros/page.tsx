import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Pros",
};

export default function FindProsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Find Pros
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Browse verified contractors and handymen by trade, location, rating, and
        availability.
      </p>
      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500">
          Pro search with map view, filters, and profile cards
        </p>
      </div>
    </div>
  );
}
