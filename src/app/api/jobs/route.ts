import { NextResponse } from "next/server";
import { getJobs, getClientJobs, createJobPosting } from "@/db/queries/jobs";
import { getSessionFromRequest } from "@/lib/auth/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const hubId = searchParams.get("hubId") ?? undefined;
  const urgency = searchParams.get("urgency") ?? undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!, 10)
    : undefined;
  const offset = searchParams.get("offset")
    ? parseInt(searchParams.get("offset")!, 10)
    : undefined;

  const session = getSessionFromRequest(request);

  try {
    let jobs;

    switch (session.role) {
      case "client":
        // Client sees only their posted jobs
        jobs = await getClientJobs(session.userId);
        // Apply additional filters on the client's jobs
        if (status) jobs = jobs.filter((j) => j.status === status);
        if (category) jobs = jobs.filter((j) => j.category === category);
        break;

      case "pro":
        // Pro sees all available jobs (marketplace) + their assigned jobs
        // For MVP: show all with filters — real impl will add bid/assignment check
        jobs = await getJobs({ status, category, hubId, urgency, limit, offset });
        break;

      case "pm":
        // PM sees jobs on their managed properties
        // For MVP: show all with filters — real impl will join on property ownership
        jobs = await getJobs({ status, category, hubId, urgency, limit, offset });
        break;

      default:
        jobs = await getJobs({ status, category, hubId, urgency, limit, offset });
    }

    return NextResponse.json({ jobs, session: { userId: session.userId, role: session.role } });
  } catch (error) {
    console.error("[api/jobs] GET failed:", error);
    return NextResponse.json({ jobs: [], error: "Failed to fetch jobs" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = getSessionFromRequest(request);

    // Use session userId if clientUserId not explicitly provided
    const clientUserId = body.clientUserId || session.userId;

    if (!clientUserId || !body.title) {
      return NextResponse.json(
        { error: "Missing required fields: clientUserId, title" },
        { status: 400 },
      );
    }

    const job = await createJobPosting({
      clientUserId,
      title: body.title,
      description: body.description,
      category: body.category,
      urgency: body.urgency,
      budgetMinCents: body.budgetMinCents,
      budgetMaxCents: body.budgetMaxCents,
      address: body.address,
      hubId: body.hubId,
      dispatchType: body.dispatchType,
      permitRequired: body.permitRequired,
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("[api/jobs] POST failed:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
