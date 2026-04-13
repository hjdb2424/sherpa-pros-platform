import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Jobs",
};

export default function ClientMyJobsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        My Jobs
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Track all your posted jobs, review proposals, and manage active
        projects.
      </p>
      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500">
          Job list with status filters — draft, open, in progress, completed
        </p>
      </div>
    </div>
  );
}
