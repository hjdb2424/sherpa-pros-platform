import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Job",
};

export default function PostJobPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Post a Job
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Describe the work you need done, set your budget, and get matched with
        qualified pros nearby.
      </p>
      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500">
          Job posting form — category, description, location, budget, timeline
        </p>
      </div>
    </div>
  );
}
