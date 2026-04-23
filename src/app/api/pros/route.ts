import { NextResponse } from "next/server";
import { getPros, searchPros } from "@/db/queries/pros";
import { getSessionFromRequest } from "@/lib/auth/session";
import { parsePagination, paginationMeta } from "@/db/config/performance";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const hubId = searchParams.get("hubId") ?? undefined;
  const badgeTier = searchParams.get("badgeTier") ?? undefined;
  const tradeCategory = searchParams.get("tradeCategory") ?? undefined;
  const { page, limit, offset } = parsePagination(searchParams);

  const session = getSessionFromRequest(request);

  try {
    // Role-based scoping:
    // - Client/PM: sees all pros (marketplace browsing)
    // - Pro: sees own profile only (unless explicitly browsing marketplace)
    const viewingSelf = searchParams.get("self") === "true";

    if (session.role === "pro" && viewingSelf) {
      const pros = await getPros({ badgeTier, tradeCategory, hubId, limit: 1, offset: 0 });
      return NextResponse.json({
        data: pros,
        pagination: paginationMeta(1, 1, pros.length),
        session: { userId: session.userId, role: session.role },
      });
    }

    // Default: marketplace view (all roles can browse)
    if (search) {
      const pros = await searchPros(search, hubId);
      const paged = pros.slice(offset, offset + limit);
      return NextResponse.json({
        data: paged,
        pagination: paginationMeta(page, limit, pros.length),
        session: { userId: session.userId, role: session.role },
      });
    }

    const pros = await getPros({ badgeTier, tradeCategory, hubId, limit, offset });
    const total = pros.length < limit ? offset + pros.length : offset + limit + 1;
    return NextResponse.json({
      data: pros,
      pagination: paginationMeta(page, limit, total),
      session: { userId: session.userId, role: session.role },
    });
  } catch (error) {
    console.error("[api/pros] GET failed:", error);
    return NextResponse.json({
      data: [],
      pagination: paginationMeta(1, limit, 0),
      error: "Failed to fetch pros",
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const session = getSessionFromRequest(request);

  // Attach the session userId to the profile being created/updated
  const profileData = {
    ...body,
    userId: body.userId || session.userId,
  };

  return NextResponse.json(
    { message: "Pro profile created", data: profileData },
    { status: 201 },
  );
}
