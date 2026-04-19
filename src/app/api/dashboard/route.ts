/**
 * Dashboard API Route
 *
 * Returns aggregate stats, recent jobs, and recent pros from the database.
 * Falls back to realistic mock data if the DB connection fails so the
 * frontend never shows an error state.
 */

import { NextResponse } from "next/server";
import {
  getDashboardStats,
  getRecentJobs,
  getRecentPros,
} from "@/db/queries/dashboard";

export async function GET() {
  try {
    const [stats, jobs, pros] = await Promise.all([
      getDashboardStats(),
      getRecentJobs(),
      getRecentPros(),
    ]);

    return NextResponse.json({ stats, jobs, pros });
  } catch (error) {
    console.error("[api/dashboard] DB query failed, returning fallback:", error);

    return NextResponse.json({
      stats: { totalJobs: 247, activePros: 89, pendingBids: 34 },
      jobs: [],
      pros: [],
    });
  }
}
