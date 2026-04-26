import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Mock data — will be replaced with DB queries when wired
// ---------------------------------------------------------------------------

const MOCK_VERIFICATIONS = [
  {
    id: "v1",
    name: "Marcus Rivera",
    email: "marcus@email.com",
    skills: [
      "faucet_fixture",
      "toilet_repair",
      "garbage_disposal",
      "caulking_grouting",
      "light_fixture",
      "outlet_switch",
    ],
    photos: [
      { description: "Kitchen faucet replacement — before and after" },
      { description: "Bathroom toilet rebuild with new wax ring" },
      { description: "Full electrical panel outlet upgrade" },
    ],
    references: [
      { name: "Sarah Chen", phone: "(603) 555-1234", relationship: "Previous client" },
      { name: "Tom Bradley", phone: "(603) 555-5678", relationship: "General contractor" },
    ],
    submittedAt: "2026-04-23T14:30:00Z",
    status: "pending" as const,
  },
  {
    id: "v2",
    name: "Elena Vasquez",
    email: "elena.v@email.com",
    skills: [
      "interior_painting",
      "exterior_painting",
      "drywall_install",
      "drywall_repair",
      "wallpaper",
      "texture_skim",
      "crown_molding",
      "wainscoting",
    ],
    photos: [
      { description: "Victorian home exterior repaint — 3 colors" },
      { description: "Living room accent wall with custom texture" },
      { description: "Crown molding install in master bedroom" },
      { description: "Wallpaper removal and skim coat in dining room" },
    ],
    references: [
      { name: "David Park", phone: "(603) 555-9012", relationship: "Property manager" },
      { name: "Lisa Nguyen", phone: "(603) 555-3456", relationship: "Repeat client" },
    ],
    submittedAt: "2026-04-24T09:15:00Z",
    status: "pending" as const,
  },
  {
    id: "v3",
    name: "Jake Thompson",
    email: "jake.t@email.com",
    skills: [
      "lawn_care",
      "mulching_edging",
      "shrub_tree_trimming",
      "garden_bed",
      "leaf_cleanup",
      "irrigation_repair",
      "fence_repair",
      "deck_repair",
      "power_washing",
    ],
    photos: [
      { description: "Full yard renovation with new garden beds" },
      { description: "Cedar fence repair — 40ft section" },
      { description: "Composite deck power wash and seal" },
    ],
    references: [
      { name: "Mary Collins", phone: "(603) 555-7890", relationship: "HOA board member" },
      { name: "Robert Kim", phone: "(603) 555-2345", relationship: "Landscaping mentor" },
    ],
    submittedAt: "2026-04-24T16:45:00Z",
    status: "pending" as const,
  },
  {
    id: "v4",
    name: "Aisha Johnson",
    email: "aisha.j@email.com",
    skills: [
      "smart_devices",
      "tv_projector_mount",
      "surround_sound",
      "network_setup",
      "doorbell_camera",
      "ceiling_fan",
    ],
    photos: [
      { description: "Home theater install — 7.1 surround with 85\" TV" },
      { description: "Whole-home mesh network + smart lock setup" },
      { description: "Ring doorbell + 4 camera security system" },
      { description: "Outdoor projector mount with weatherproof enclosure" },
      { description: "Ceiling fan install with smart switch integration" },
    ],
    references: [
      { name: "Chris Patel", phone: "(603) 555-6789", relationship: "Home builder" },
      { name: "Nina Ramirez", phone: "(603) 555-0123", relationship: "Previous client" },
    ],
    submittedAt: "2026-04-25T08:00:00Z",
    status: "pending" as const,
  },
];

// ---------------------------------------------------------------------------
// GET — return pending verifications
// ---------------------------------------------------------------------------

export async function GET() {
  return NextResponse.json({ verifications: MOCK_VERIFICATIONS });
}

// ---------------------------------------------------------------------------
// POST — approve or reject a verification
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action, notes } = body as {
      id: string;
      action: "approve" | "reject";
      notes?: string;
    };

    if (!id || !action) {
      return NextResponse.json(
        { error: "id and action (approve|reject) are required" },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Log to console for now — will write to DB when wired
    console.log(`[Verification] ${action.toUpperCase()} id=${id} notes="${notes || ""}"`);

    return NextResponse.json({
      success: true,
      id,
      action,
      message: `Verification ${action}d successfully`,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
