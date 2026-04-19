import { NextResponse } from "next/server";
import { getJobs, createJobPosting } from "@/db/queries/jobs";

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

  try {
    const jobs = await getJobs({ status, category, hubId, urgency, limit, offset });
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("[api/jobs] GET failed:", error);
    return NextResponse.json({ jobs: [], error: "Failed to fetch jobs" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.clientUserId || !body.title) {
      return NextResponse.json(
        { error: "Missing required fields: clientUserId, title" },
        { status: 400 },
      );
    }

    const job = await createJobPosting({
      clientUserId: body.clientUserId,
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
