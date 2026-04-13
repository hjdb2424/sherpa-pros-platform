import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Process payment through payment provider
  return NextResponse.json({
    message: "Payments API — process and track payments",
    data: body,
  });
}

export async function GET() {
  // TODO: Get payment history for authenticated user
  return NextResponse.json({
    message: "Payment history API",
    payments: [],
  });
}
