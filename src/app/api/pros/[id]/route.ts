import { NextResponse } from "next/server";
import { getProByIdWithDetails } from "@/db/queries/pros";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const pro = await getProByIdWithDetails(id);

    if (!pro) {
      return NextResponse.json({ error: "Pro not found" }, { status: 404 });
    }

    return NextResponse.json({ pro });
  } catch (error) {
    console.error("[api/pros/[id]] GET failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch pro" },
      { status: 500 },
    );
  }
}
