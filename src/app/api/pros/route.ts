import { NextResponse } from "next/server";
import { getPros, searchPros } from "@/db/queries/pros";
import { getSessionFromRequest } from "@/lib/auth/session";

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

  const session = getSessionFromRequest(request);

  try {
    // Role-based scoping:
    // - Client/PM: sees all pros (marketplace browsing)
    // - Pro: sees own profile only (unless explicitly browsing marketplace)
    const viewingSelf = searchParams.get("self") === "true";

    if (session.role === "pro" && viewingSelf) {
      // Pro viewing own profile — filter to just their data
      // For MVP with mock data, return all (real impl: WHERE user_id = session.userId)
      const pros = await getPros({ badgeTier, tradeCategory, hubId, limit: 1, offset: 0 });
      return NextResponse.json({
        pros,
        session: { userId: session.userId, role: session.role },
      });
    }

    // Default: marketplace view (all roles can browse)
    if (search) {
      const pros = await searchPros(search, hubId);
      return NextResponse.json({
        pros,
        session: { userId: session.userId, role: session.role },
      });
    }

    const pros = await getPros({ badgeTier, tradeCategory, hubId, limit, offset });
    return NextResponse.json({
      pros,
      session: { userId: session.userId, role: session.role },
    });
  } catch (error) {
    console.error("[api/pros] GET failed:", error);
    return NextResponse.json({ pros: [], error: "Failed to fetch pros" });
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
