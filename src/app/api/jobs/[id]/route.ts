import { NextResponse } from "next/server";
import { getJobByIdWithDetails } from "@/db/queries/jobs";
import { getSessionFromRequest } from "@/lib/auth/session";
import { canAccessJob } from "@/lib/auth/ownership";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = getSessionFromRequest(request);

  try {
    // Ownership check (MVP: always true, structure ready for real auth)
    if (!canAccessJob(id, session)) {
      return NextResponse.json(
        { error: "You do not have access to this job" },
        { status: 403 },
      );
    }

    const job = await getJobByIdWithDetails(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      job,
      session: { userId: session.userId, role: session.role },
    });
  } catch (error) {
    console.error("[api/jobs/[id]] GET failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 },
    );
  }
}
