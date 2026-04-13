import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Run dispatch algorithm — match job to nearby available pros
  // Factors: trade match, distance, rating, availability, response time
  return NextResponse.json({
    message: "Dispatch API — match jobs to pros",
    matches: [],
    data: body,
  });
}

export async function GET() {
  // TODO: Get dispatch status for a job
  return NextResponse.json({
    message: "Dispatch status API",
    status: "idle",
  });
}
