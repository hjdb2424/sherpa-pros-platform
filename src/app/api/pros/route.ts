import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Query pro profiles from database
  return NextResponse.json({
    pros: [],
    message: "Pros API — list and search professionals",
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Validate and create/update pro profile
  return NextResponse.json(
    { message: "Pro profile created", data: body },
    { status: 201 }
  );
}
