import { NextResponse } from "next/server";
import { getJobs, getClientJobs, createJobPosting } from "@/db/queries/jobs";
import { getSessionFromRequest } from "@/lib/auth/session";
import { parsePagination, paginationMeta } from "@/db/config/performance";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const hubId = searchParams.get("hubId") ?? undefined;
  const urgency = searchParams.get("urgency") ?? undefined;
  const { page, limit, offset } = parsePagination(searchParams);

  const session = getSessionFromRequest(request);

  try {
    let jobs;
    let total = 0;

    switch (session.role) {
      case "client": {
        // Client sees only their posted jobs
        const allClientJobs = await getClientJobs(session.userId);
        // Apply additional filters on the client's jobs
        let filtered = allClientJobs;
        if (status) filtered = filtered.filter((j) => j.status === status);
        if (category) filtered = filtered.filter((j) => j.category === category);
        total = filtered.length;
        jobs = filtered.slice(offset, offset + limit);
        break;
      }

      case "pro":
        // Pro sees all available jobs (marketplace) + their assigned jobs
        jobs = await getJobs({ status, category, hubId, urgency, limit, offset });
        total = jobs.length < limit ? offset + jobs.length : offset + limit + 1;
        break;

      case "pm":
        // PM sees jobs on their managed properties
        jobs = await getJobs({ status, category, hubId, urgency, limit, offset });
        total = jobs.length < limit ? offset + jobs.length : offset + limit + 1;
        break;

      default:
        jobs = await getJobs({ status, category, hubId, urgency, limit, offset });
        total = jobs.length < limit ? offset + jobs.length : offset + limit + 1;
    }

    return NextResponse.json({
      data: jobs,
      pagination: paginationMeta(page, limit, total),
      session: { userId: session.userId, role: session.role },
    });
  } catch (error) {
    console.error("[api/jobs] GET failed:", error);
    return NextResponse.json({
      data: [],
      pagination: paginationMeta(page, limit, 0),
      error: "Failed to fetch jobs",
    });
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
