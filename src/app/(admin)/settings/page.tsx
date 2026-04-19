import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function AdminSettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Settings
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Platform configuration and preferences
      </p>

      <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
        <Cog6ToothIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
        <p className="mt-4 text-sm text-zinc-500">
          Admin settings coming soon.
        </p>
      </div>
    </>
  );
}
