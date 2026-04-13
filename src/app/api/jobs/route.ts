import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Query jobs from database
  return NextResponse.json({
    jobs: [],
    message: "Jobs API — list and search jobs",
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Validate and create job posting
  return NextResponse.json(
    { message: "Job created", data: body },
    { status: 201 }
  );
}
