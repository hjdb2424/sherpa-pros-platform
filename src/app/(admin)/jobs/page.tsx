import { query } from "@/db/connection";
import { JobsTable } from "./JobsTable";

/* ---------- types ---------- */
export interface AdminJob {
  id: string;
  title: string;
  client: string;
  category: string;
  status: string;
  budget_min_cents: number | null;
  budget_max_cents: number | null;
  bids_count: number;
  created_at: string;
}

/* ---------- mock ---------- */
const MOCK_JOBS: AdminJob[] = [
  { id: "j1", title: "Kitchen sink replacement", client: "Tom Harris", category: "Plumbing", status: "posted", budget_min_cents: 40000, budget_max_cents: 80000, bids_count: 3, created_at: "2026-04-14T10:00:00Z" },
  { id: "j2", title: "Deck repair & staining", client: "Lisa Wang", category: "Carpentry", status: "accepting_bids", budget_min_cents: 200000, budget_max_cents: 350000, bids_count: 5, created_at: "2026-04-13T15:30:00Z" },
  { id: "j3", title: "Bathroom remodel", client: "Mike Johnson", category: "General", status: "in_progress", budget_min_cents: 800000, budget_max_cents: 1200000, bids_count: 7, created_at: "2026-04-10T09:00:00Z" },
  { id: "j4", title: "Electrical panel upgrade", client: "Sara Patel", category: "Electrical", status: "completed", budget_min_cents: 150000, budget_max_cents: 250000, bids_count: 4, created_at: "2026-04-08T14:00:00Z" },
  { id: "j5", title: "Roof patching", client: "Dan Morales", category: "Roofing", status: "posted", budget_min_cents: 50000, budget_max_cents: 90000, bids_count: 1, created_at: "2026-04-14T08:00:00Z" },
  { id: "j6", title: "Interior painting — 3BR", client: "Karen Lee", category: "Painting", status: "cancelled", budget_min_cents: 180000, budget_max_cents: 250000, bids_count: 2, created_at: "2026-04-07T11:00:00Z" },
  { id: "j7", title: "HVAC unit installation", client: "Brian Chen", category: "HVAC", status: "assigned", budget_min_cents: 400000, budget_max_cents: 600000, bids_count: 6, created_at: "2026-04-12T16:45:00Z" },
];

/* ---------- data ---------- */
async function getJobs(): Promise<AdminJob[]> {
  try {
    const rows = await query<{
      id: string;
      title: string;
      category: string | null;
      status: string;
      budget_min_cents: number | null;
      budget_max_cents: number | null;
      created_at: string;
    }>(
      `SELECT id, title, category, status, budget_min_cents, budget_max_cents, created_at
       FROM jobs ORDER BY created_at DESC LIMIT 100`
    );
    if (!rows.length) return MOCK_JOBS;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      client: "—",
      category: r.category ?? "General",
      status: r.status,
      budget_min_cents: r.budget_min_cents,
      budget_max_cents: r.budget_max_cents,
      bids_count: 0,
      created_at: r.created_at,
    }));
  } catch {
    return MOCK_JOBS;
  }
}

/* ---------- page ---------- */
export default async function AdminJobsPage() {
  const jobs = await getJobs();

  return (
    <>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Manage Jobs
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {jobs.length} jobs on the platform
      </p>

      <JobsTable jobs={jobs} />
    </>
  );
}
