import { NextResponse } from 'next/server';
import {
  findMatchingPros,
  getEmergencyPricing,
  type EmergencyCategory,
  type SeverityLevel,
} from '@/lib/mock-data/emergency-data';

interface EmergencyRequest {
  category: EmergencyCategory;
  severity: SeverityLevel;
  location: { lat: number; lng: number } | { address: string };
  description?: string;
  photos?: string[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EmergencyRequest;

    if (!body.category || !body.severity || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields: category, severity, location' },
        { status: 400 },
      );
    }

    // Simulate Dispatch Wiseman scoring
    const matchedPros = findMatchingPros(body.category);
    const pricing = getEmergencyPricing(body.category);

    if (matchedPros.length === 0) {
      return NextResponse.json(
        {
          error: 'No emergency pros available for this category',
          category: body.category,
        },
        { status: 404 },
      );
    }

    // Simulate scoring delay
    const topPro = matchedPros[0];

    return NextResponse.json({
      dispatchId: `emg-${Date.now()}`,
      status: 'pro_matched',
      matchedPro: {
        id: topPro.id,
        name: topPro.name,
        initials: topPro.initials,
        badgeTier: topPro.badgeTier,
        rating: topPro.rating,
        reviewCount: topPro.reviewCount,
        certifications: topPro.certifications,
        etaMinutes: topPro.responseTimeMinutes,
        distanceMiles: topPro.distanceMiles,
        backgroundChecked: topPro.backgroundChecked,
        licensed: topPro.licensed,
        insured: topPro.insured,
      },
      alternativePros: matchedPros.slice(1, 4).map((p) => ({
        id: p.id,
        name: p.name,
        rating: p.rating,
        etaMinutes: p.responseTimeMinutes,
      })),
      pricing: pricing
        ? {
            rangeLow: pricing.rangeLow,
            rangeHigh: pricing.rangeHigh,
            description: pricing.description,
          }
        : null,
      request: {
        category: body.category,
        severity: body.severity,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
