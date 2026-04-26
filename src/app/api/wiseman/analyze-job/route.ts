import { NextResponse } from 'next/server';
import {
  generateMaterialsList,
  type TradeInfo,
} from '@/lib/dispatch/materials-engine';

/* ------------------------------------------------------------------ */
/*  Trade detection via smart pattern matching                         */
/* ------------------------------------------------------------------ */

interface AnalyzeResult {
  isMultiTrade: boolean;
  trades: TradeInfo[];
  materials: {
    name: string;
    quantity: number;
    unit: string;
    estimatedCostCents: number;
    supplierSource: string;
  }[];
  totalEstimatedHours: number;
  recommendation: string;
}

const TRADE_MAP: Record<string, Omit<TradeInfo, 'sequenceOrder'>> = {
  electrician: { tradeKey: 'electrician', tradeLabel: 'Electrician', estimatedHours: 2 },
  smart_home: { tradeKey: 'smart_home', tradeLabel: 'Smart Home Tech', estimatedHours: 1.5 },
  plumber: { tradeKey: 'plumber', tradeLabel: 'Plumber', estimatedHours: 3 },
  tile: { tradeKey: 'tile_flooring', tradeLabel: 'Tile / Flooring', estimatedHours: 6 },
  carpenter: { tradeKey: 'carpenter', tradeLabel: 'Carpenter', estimatedHours: 4 },
  painter: { tradeKey: 'painter', tradeLabel: 'Painter', estimatedHours: 4 },
  handyman: { tradeKey: 'handyman', tradeLabel: 'Handyman', estimatedHours: 2 },
  drywall: { tradeKey: 'drywall', tradeLabel: 'Drywall Specialist', estimatedHours: 3 },
  general: { tradeKey: 'general', tradeLabel: 'General Contractor', estimatedHours: 4 },
};

const CATEGORY_TRADE: Record<string, string> = {
  electrical: 'electrician',
  plumbing: 'plumber',
  painting: 'painter',
  carpentry: 'carpenter',
  handyman: 'handyman',
  flooring: 'tile',
  drywall: 'drywall',
  smart_home: 'smart_home',
};

function detectTrades(description: string, category?: string): TradeInfo[] {
  const desc = description.toLowerCase();
  const tradeKeys: string[] = [];

  // Smart switch / smart install → electrician + smart_home
  if (desc.includes('smart') && (desc.includes('install') || desc.includes('switch'))) {
    tradeKeys.push('electrician', 'smart_home');
  }

  // Bathroom or kitchen → plumber + tile
  if (desc.includes('bathroom') || desc.includes('kitchen')) {
    if (!tradeKeys.includes('plumber')) tradeKeys.push('plumber');
    tradeKeys.push('tile');
  }

  // Deck + stain/paint → carpenter + painter
  if (desc.includes('deck') && (desc.includes('stain') || desc.includes('paint') || desc.includes('refinish'))) {
    tradeKeys.push('carpenter', 'painter');
  }

  // Drywall + paint → drywall + painter
  if (desc.includes('drywall') && desc.includes('paint')) {
    tradeKeys.push('drywall', 'painter');
  }

  // Single-trade fallback based on description keywords
  if (tradeKeys.length === 0) {
    if (desc.includes('paint')) tradeKeys.push('painter');
    else if (desc.includes('plumb') || desc.includes('faucet') || desc.includes('toilet') || desc.includes('sink')) tradeKeys.push('plumber');
    else if (desc.includes('electric') || desc.includes('outlet') || desc.includes('wiring')) tradeKeys.push('electrician');
    else if (desc.includes('drywall') || desc.includes('patch')) tradeKeys.push('drywall');
    else if (desc.includes('tile') || desc.includes('floor')) tradeKeys.push('tile');
    else if (desc.includes('door') || desc.includes('trim') || desc.includes('carpent')) tradeKeys.push('carpenter');
    else if (desc.includes('mount') || desc.includes('assemble') || desc.includes('hang')) tradeKeys.push('handyman');
  }

  // Category fallback
  if (tradeKeys.length === 0 && category) {
    const mapped = CATEGORY_TRADE[category.toLowerCase()];
    if (mapped) tradeKeys.push(mapped);
  }

  // Absolute fallback
  if (tradeKeys.length === 0) {
    tradeKeys.push('handyman');
  }

  // Deduplicate and build TradeInfo with sequence
  const seen = new Set<string>();
  const trades: TradeInfo[] = [];
  let seq = 1;

  for (const key of tradeKeys) {
    if (seen.has(key)) continue;
    seen.add(key);
    const base = TRADE_MAP[key] ?? TRADE_MAP.general;
    trades.push({ ...base, sequenceOrder: seq++ });
  }

  return trades;
}

function buildRecommendation(trades: TradeInfo[], isMultiTrade: boolean): string {
  if (!isMultiTrade) {
    const trade = trades[0];
    return `Single-trade job. Assign one ${trade.tradeLabel} (~${trade.estimatedHours}h estimated).`;
  }

  const tradeNames = trades.map((t) => t.tradeLabel).join(' then ');
  return `Multi-trade job detected. Recommended sequence: ${tradeNames}. Each trade should complete before the next begins.`;
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, category } = body;

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: description' },
        { status: 400 },
      );
    }

    const trades = detectTrades(description, category);
    const isMultiTrade = trades.length > 1;
    const materials = generateMaterialsList(description, trades);
    const totalEstimatedHours = trades.reduce((sum, t) => sum + t.estimatedHours, 0);
    const recommendation = buildRecommendation(trades, isMultiTrade);

    const result: AnalyzeResult = {
      isMultiTrade,
      trades,
      materials: materials.map((m) => ({
        name: m.name,
        quantity: m.quantity,
        unit: m.unit,
        estimatedCostCents: m.estimatedCostCents,
        supplierSource: m.supplierSource,
      })),
      totalEstimatedHours,
      recommendation,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('[api/wiseman/analyze-job] POST failed:', error);
    return NextResponse.json(
      { error: 'Failed to analyze job' },
      { status: 500 },
    );
  }
}
