/**
 * W-9 Profile API
 *
 * GET  — Retrieve current user's W-9 status and profile
 * POST — Submit or update W-9 data
 */

import { NextResponse } from "next/server";
import {
  mockW9Profiles,
  MOCK_PRO_USER_ID,
} from "@/lib/mock-data/tax-data";

// ---------------------------------------------------------------------------
// GET /api/tax/w9 — get W-9 profile for authenticated user
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || MOCK_PRO_USER_ID;

  // TODO: Replace with DB query + auth check
  const profile = mockW9Profiles.find((p) => p.proId === userId);

  if (!profile) {
    return NextResponse.json({
      data: null,
      status: "not_started",
      message: "No W-9 on file. Submit your W-9 to receive 1099s.",
    });
  }

  // Never return encrypted TIN over the wire
  const safeProfile = {
    ...profile,
    tinEncrypted: undefined,
    tinDisplay: `***-**-${profile.tinLastFour}`,
  };

  return NextResponse.json({
    data: safeProfile,
    status: profile.status,
  });
}

// ---------------------------------------------------------------------------
// POST /api/tax/w9 — submit W-9 data
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const body = await request.json();

  const {
    legalName,
    businessName,
    entityType,
    tin,
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
  } = body;

  // Validate required fields
  if (!legalName || !entityType || !tin || !addressLine1 || !city || !state || !zip) {
    return NextResponse.json(
      { error: "Missing required W-9 fields", code: "W9_VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  // Validate entity type
  const validEntityTypes = [
    "sole_proprietor", "llc_single", "llc_multi",
    "c_corp", "s_corp", "partnership", "trust",
  ];
  if (!validEntityTypes.includes(entityType)) {
    return NextResponse.json(
      { error: "Invalid entity type", code: "INVALID_ENTITY_TYPE" },
      { status: 400 },
    );
  }

  // Validate TIN format (SSN: 123-45-6789 or EIN: 12-3456789)
  const tinClean = tin.replace(/[-\s]/g, "");
  if (tinClean.length !== 9 || !/^\d{9}$/.test(tinClean)) {
    return NextResponse.json(
      { error: "Invalid TIN format. Must be 9 digits (SSN or EIN).", code: "INVALID_TIN" },
      { status: 400 },
    );
  }

  const tinLastFour = tinClean.slice(-4);

  // TODO: Encrypt TIN with AES-256-GCM before storing
  // TODO: Save to database via Drizzle
  // TODO: Authenticate request via Clerk

  const newProfile = {
    id: crypto.randomUUID(),
    proId: body.userId || MOCK_PRO_USER_ID,
    legalName,
    businessName: businessName || null,
    entityType,
    tinLastFour,
    tinDisplay: `***-**-${tinLastFour}`,
    addressLine1,
    addressLine2: addressLine2 || null,
    city,
    state: state.toUpperCase(),
    zip,
    tinVerified: false,
    tinVerifiedAt: null,
    status: "submitted",
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    data: newProfile,
    message: "W-9 submitted successfully. Verification pending.",
  }, { status: 201 });
}
