import { NextResponse } from "next/server";
import { getPros, searchPros } from "@/db/queries/pros";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const hubId = searchParams.get("hubId") ?? undefined;
  const badgeTier = searchParams.get("badgeTier") ?? undefined;
  const tradeCategory = searchParams.get("tradeCategory") ?? undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!, 10)
    : undefined;
  const offset = searchParams.get("offset")
    ? parseInt(searchParams.get("offset")!, 10)
    : undefined;

  try {
    // If search query provided, use text search
    if (search) {
      const pros = await searchPros(search, hubId);
      return NextResponse.json({ pros });
    }

    const pros = await getPros({ badgeTier, tradeCategory, hubId, limit, offset });
    return NextResponse.json({ pros });
  } catch (error) {
    console.error("[api/pros] GET failed:", error);
    return NextResponse.json({ pros: [], error: "Failed to fetch pros" });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Validate and create/update pro profile
  return NextResponse.json(
    { message: "Pro profile created", data: body },
    { status: 201 },
  );
}
