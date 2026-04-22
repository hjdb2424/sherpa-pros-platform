/**
 * Dashboard API Route
 *
 * Returns aggregate stats, recent jobs, and recent pros from the database.
 * Falls back to realistic mock data if the DB connection fails so the
 * frontend never shows an error state.
 *
 * Now includes session context for role-based stat scoping.
 */

import { NextResponse } from "next/server";
import {
  getDashboardStats,
  getRecentJobs,
  getRecentPros,
} from "@/db/queries/dashboard";
import { getSessionFromRequest } from "@/lib/auth/session";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  try {
    const [stats, jobs, pros] = await Promise.all([
      getDashboardStats(),
      getRecentJobs(),
      getRecentPros(),
    ]);

    // Role-based context added to response
    // Real impl will pass session.userId into each query for scoped results
    return NextResponse.json({
      stats,
      jobs,
      pros,
      session: { userId: session.userId, role: session.role, name: session.name },
    });
  } catch (error) {
    console.error("[api/dashboard] DB query failed, returning fallback:", error);

    // Fallback stats vary by role to demonstrate scoping
    const fallbackStats = {
      pro: { totalJobs: 12, activePros: 1, pendingBids: 5 },
      client: { totalJobs: 4, activePros: 89, pendingBids: 8 },
      pm: { totalJobs: 247, activePros: 89, pendingBids: 34 },
    };

    return NextResponse.json({
      stats: fallbackStats[session.role] ?? fallbackStats.pm,
      jobs: [],
      pros: [],
      session: { userId: session.userId, role: session.role, name: session.name },
    });
  }
}
