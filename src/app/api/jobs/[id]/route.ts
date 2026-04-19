import { NextResponse } from "next/server";
import { getJobByIdWithDetails } from "@/db/queries/jobs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const job = await getJobByIdWithDetails(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("[api/jobs/[id]] GET failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 },
    );
  }
}
