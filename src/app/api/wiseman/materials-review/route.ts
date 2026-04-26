import { NextResponse } from 'next/server';
import {
  validateMaterials,
  getSupplierOptions,
  type MaterialItem,
} from '@/lib/dispatch/materials-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { materials } = body as { materials?: MaterialItem[] };

    if (!materials || !Array.isArray(materials) || materials.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: materials (non-empty array)' },
        { status: 400 },
      );
    }

    const validation = validateMaterials(materials);

    const supplierOptions = materials.map((m) => ({
      materialName: m.name,
      options: getSupplierOptions(m.name),
    }));

    const totalEstimatedCents = materials.reduce(
      (sum, m) => sum + m.estimatedCostCents * m.quantity,
      0,
    );

    return NextResponse.json({
      validation,
      supplierOptions,
      totalEstimatedCents,
      itemCount: materials.length,
      recommendation: validation.valid
        ? 'All materials validated. Ready for ordering.'
        : `${validation.flaggedItems.length} item(s) flagged for review. Please verify before ordering.`,
    });
  } catch (error) {
    console.error('[api/wiseman/materials-review] POST failed:', error);
    return NextResponse.json(
      { error: 'Failed to review materials' },
      { status: 500 },
    );
  }
}
