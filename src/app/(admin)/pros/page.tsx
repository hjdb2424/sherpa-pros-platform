import { query } from "@/db/connection";
import { ProsTable } from "./ProsTable";

/* ---------- types ---------- */
export interface AdminPro {
  id: string;
  display_name: string;
  trade: string;
  hub: string;
  badge_tier: string;
  rating_score: number;
  onboarding_status: string;
  verified: boolean;
}

/* ---------- mock ---------- */
const MOCK_PROS: AdminPro[] = [
  { id: "p1", display_name: "Jake Rivera", trade: "Electrician", hub: "Manchester NH", badge_tier: "gold", rating_score: 4.9, onboarding_status: "active", verified: true },
  { id: "p2", display_name: "Sarah Chen", trade: "Plumber", hub: "Nashua NH", badge_tier: "silver", rating_score: 4.7, onboarding_status: "active", verified: true },
  { id: "p3", display_name: "Marcus Bell", trade: "HVAC", hub: "Concord NH", badge_tier: "bronze", rating_score: 4.3, onboarding_status: "pending_verification", verified: false },
  { id: "p4", display_name: "Amy Torres", trade: "Painter", hub: "Manchester NH", badge_tier: "silver", rating_score: 4.6, onboarding_status: "active", verified: true },
  { id: "p5", display_name: "Devon Park", trade: "Carpenter", hub: "Portsmouth NH", badge_tier: "gold", rating_score: 4.8, onboarding_status: "active", verified: true },
  { id: "p6", display_name: "Lin Wu", trade: "Roofer", hub: "Nashua NH", badge_tier: "bronze", rating_score: 4.1, onboarding_status: "paused", verified: true },
  { id: "p7", display_name: "Carlos Mendez", trade: "Mason", hub: "Manchester NH", badge_tier: "silver", rating_score: 4.5, onboarding_status: "pending_verification", verified: false },
  { id: "p8", display_name: "Tina Ross", trade: "Electrician", hub: "Concord NH", badge_tier: "gold", rating_score: 4.9, onboarding_status: "active", verified: true },
];

/* ---------- data ---------- */
async function getPros(): Promise<AdminPro[]> {
  try {
    const rows = await query<{
      id: string;
      display_name: string;
      badge_tier: string;
      rating_score: number;
      onboarding_status: string;
      insurance_verified: boolean;
    }>(
      `SELECT p.id, p.display_name, p.badge_tier, p.rating_score,
              p.onboarding_status, p.insurance_verified
       FROM pros p
       ORDER BY p.created_at DESC
       LIMIT 100`
    );
    if (!rows.length) return MOCK_PROS;
    return rows.map((r) => ({
      id: r.id,
      display_name: r.display_name,
      trade: "General",
      hub: "—",
      badge_tier: r.badge_tier,
      rating_score: r.rating_score,
      onboarding_status: r.onboarding_status,
      verified: r.insurance_verified,
    }));
  } catch {
    return MOCK_PROS;
  }
}

/* ---------- page ---------- */
export default async function AdminProsPage() {
  const pros = await getPros();

  return (
    <>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Manage Pros
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {pros.length} pros registered on the platform
      </p>

      <ProsTable pros={pros} />
    </>
  );
}
