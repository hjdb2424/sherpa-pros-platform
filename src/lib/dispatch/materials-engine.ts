/**
 * Materials Engine
 * Generates materials lists, validates quantities, and provides supplier options
 * for multi-trade job coordination.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MaterialItem {
  name: string;
  quantity: number;
  unit: string;
  estimatedCostCents: number;
  supplierSource: string;
  category: string;
  wisemanNotes?: string;
}

export interface TradeInfo {
  tradeKey: string;
  tradeLabel: string;
  estimatedHours: number;
  sequenceOrder: number;
}

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  flaggedItems: { name: string; reason: string }[];
}

export interface SupplierOption {
  supplier: string;
  priceCents: number;
  inStock: boolean;
  estimatedDeliveryDays: number;
}

/* ------------------------------------------------------------------ */
/*  Materials Database (common job types)                              */
/* ------------------------------------------------------------------ */

const MATERIALS_DB: Record<string, MaterialItem[]> = {
  smart_switch_install: [
    { name: 'Smart Switch (WiFi)', quantity: 1, unit: 'ea', estimatedCostCents: 4999, supplierSource: 'sherpa_hub', category: 'electrical', wisemanNotes: 'Verify neutral wire availability before purchase' },
    { name: 'Wire Nuts (assorted)', quantity: 1, unit: 'pack', estimatedCostCents: 499, supplierSource: 'sherpa_hub', category: 'electrical' },
    { name: 'Electrical Tape', quantity: 1, unit: 'roll', estimatedCostCents: 399, supplierSource: 'sherpa_hub', category: 'electrical' },
    { name: 'Wall Plate Cover', quantity: 1, unit: 'ea', estimatedCostCents: 799, supplierSource: 'sherpa_hub', category: 'electrical' },
  ],
  painting: [
    { name: 'Interior Paint (1 gal)', quantity: 2, unit: 'gal', estimatedCostCents: 4299, supplierSource: 'zinc', category: 'paint', wisemanNotes: 'Coverage: ~350 sqft per gallon, 2 coats' },
    { name: 'Primer (1 gal)', quantity: 1, unit: 'gal', estimatedCostCents: 2999, supplierSource: 'zinc', category: 'paint' },
    { name: 'Roller Cover 9"', quantity: 3, unit: 'ea', estimatedCostCents: 899, supplierSource: 'sherpa_hub', category: 'tools' },
    { name: 'Paint Brushes (2" angled)', quantity: 2, unit: 'ea', estimatedCostCents: 1299, supplierSource: 'sherpa_hub', category: 'tools' },
    { name: 'Painters Tape (1.5")', quantity: 2, unit: 'roll', estimatedCostCents: 799, supplierSource: 'sherpa_hub', category: 'supplies' },
    { name: 'Drop Cloth (9x12)', quantity: 2, unit: 'ea', estimatedCostCents: 1499, supplierSource: 'sherpa_hub', category: 'supplies' },
  ],
  drywall_repair: [
    { name: 'Drywall Patch Kit', quantity: 1, unit: 'ea', estimatedCostCents: 1299, supplierSource: 'sherpa_hub', category: 'drywall' },
    { name: 'Joint Compound (quart)', quantity: 1, unit: 'ea', estimatedCostCents: 999, supplierSource: 'sherpa_hub', category: 'drywall' },
    { name: 'Mesh Drywall Tape', quantity: 1, unit: 'roll', estimatedCostCents: 599, supplierSource: 'sherpa_hub', category: 'drywall' },
    { name: 'Sandpaper 120-grit', quantity: 1, unit: 'pack', estimatedCostCents: 699, supplierSource: 'sherpa_hub', category: 'supplies' },
    { name: 'Putty Knife 6"', quantity: 1, unit: 'ea', estimatedCostCents: 899, supplierSource: 'sherpa_hub', category: 'tools', wisemanNotes: 'Pro may already have this' },
  ],
  faucet_replacement: [
    { name: 'Kitchen Faucet (single handle)', quantity: 1, unit: 'ea', estimatedCostCents: 15999, supplierSource: 'zinc', category: 'plumbing', wisemanNotes: 'Confirm sink hole count before ordering' },
    { name: 'Supply Lines (braided SS)', quantity: 2, unit: 'ea', estimatedCostCents: 1299, supplierSource: 'sherpa_hub', category: 'plumbing' },
    { name: "Plumber's Putty", quantity: 1, unit: 'ea', estimatedCostCents: 499, supplierSource: 'sherpa_hub', category: 'plumbing' },
    { name: 'Teflon Tape', quantity: 1, unit: 'roll', estimatedCostCents: 299, supplierSource: 'sherpa_hub', category: 'plumbing' },
  ],
  tv_mounting: [
    { name: 'TV Wall Mount (full-motion)', quantity: 1, unit: 'ea', estimatedCostCents: 5999, supplierSource: 'zinc', category: 'hardware', wisemanNotes: 'Verify TV weight and VESA pattern' },
    { name: 'Lag Bolts (5/16" x 3")', quantity: 4, unit: 'ea', estimatedCostCents: 199, supplierSource: 'sherpa_hub', category: 'hardware' },
    { name: 'HDMI Cable 6ft', quantity: 1, unit: 'ea', estimatedCostCents: 1499, supplierSource: 'sherpa_hub', category: 'av' },
    { name: 'Cable Cover Kit', quantity: 1, unit: 'ea', estimatedCostCents: 1999, supplierSource: 'sherpa_hub', category: 'av' },
    { name: 'Stud Finder', quantity: 1, unit: 'ea', estimatedCostCents: 2499, supplierSource: 'sherpa_hub', category: 'tools', wisemanNotes: 'Pro may already have this' },
  ],
  bathroom_remodel: [
    { name: 'Toilet (elongated, comfort height)', quantity: 1, unit: 'ea', estimatedCostCents: 29999, supplierSource: 'zinc', category: 'plumbing' },
    { name: 'Vanity with Sink (36")', quantity: 1, unit: 'ea', estimatedCostCents: 44999, supplierSource: 'zinc', category: 'fixtures' },
    { name: 'Bathroom Faucet', quantity: 1, unit: 'ea', estimatedCostCents: 12999, supplierSource: 'zinc', category: 'plumbing' },
    { name: 'Floor Tile (porcelain, per sqft)', quantity: 50, unit: 'sqft', estimatedCostCents: 399, supplierSource: 'zinc', category: 'tile', wisemanNotes: 'Order 10% extra for cuts/waste' },
    { name: 'Tile Mortar (50 lb bag)', quantity: 2, unit: 'bag', estimatedCostCents: 2499, supplierSource: 'sherpa_hub', category: 'tile' },
    { name: 'Grout (25 lb bag)', quantity: 1, unit: 'bag', estimatedCostCents: 1999, supplierSource: 'sherpa_hub', category: 'tile' },
    { name: 'Wax Ring', quantity: 1, unit: 'ea', estimatedCostCents: 599, supplierSource: 'sherpa_hub', category: 'plumbing' },
  ],
  kitchen_remodel: [
    { name: 'Backsplash Tile (subway)', quantity: 30, unit: 'sqft', estimatedCostCents: 599, supplierSource: 'zinc', category: 'tile' },
    { name: 'Tile Mortar', quantity: 1, unit: 'bag', estimatedCostCents: 2499, supplierSource: 'sherpa_hub', category: 'tile' },
    { name: 'Grout (sanded)', quantity: 1, unit: 'bag', estimatedCostCents: 1499, supplierSource: 'sherpa_hub', category: 'tile' },
    { name: 'Kitchen Faucet (pull-down)', quantity: 1, unit: 'ea', estimatedCostCents: 22999, supplierSource: 'zinc', category: 'plumbing' },
    { name: 'Garbage Disposal (1/2 HP)', quantity: 1, unit: 'ea', estimatedCostCents: 12999, supplierSource: 'zinc', category: 'plumbing' },
    { name: 'Under-Cabinet LED Lights', quantity: 1, unit: 'set', estimatedCostCents: 4999, supplierSource: 'sherpa_hub', category: 'electrical' },
  ],
  deck_stain: [
    { name: 'Deck Stain (5 gal)', quantity: 1, unit: 'bucket', estimatedCostCents: 17999, supplierSource: 'zinc', category: 'stain', wisemanNotes: 'Coverage: ~250 sqft per gallon. Verify deck size.' },
    { name: 'Deck Cleaner (1 gal)', quantity: 1, unit: 'gal', estimatedCostCents: 1999, supplierSource: 'sherpa_hub', category: 'prep' },
    { name: 'Stain Applicator Pad', quantity: 2, unit: 'ea', estimatedCostCents: 1299, supplierSource: 'sherpa_hub', category: 'tools' },
    { name: 'Paint Stir Sticks', quantity: 5, unit: 'ea', estimatedCostCents: 50, supplierSource: 'sherpa_hub', category: 'supplies' },
    { name: 'Painters Tape', quantity: 2, unit: 'roll', estimatedCostCents: 799, supplierSource: 'sherpa_hub', category: 'supplies' },
  ],
  outlet_install: [
    { name: 'Electrical Outlet (GFCI)', quantity: 1, unit: 'ea', estimatedCostCents: 1999, supplierSource: 'sherpa_hub', category: 'electrical', wisemanNotes: 'GFCI required for kitchen/bathroom/outdoor' },
    { name: 'Outlet Box (old work)', quantity: 1, unit: 'ea', estimatedCostCents: 399, supplierSource: 'sherpa_hub', category: 'electrical' },
    { name: 'Romex 14/2 Wire (25ft)', quantity: 1, unit: 'roll', estimatedCostCents: 2499, supplierSource: 'sherpa_hub', category: 'electrical' },
    { name: 'Wall Plate Cover', quantity: 1, unit: 'ea', estimatedCostCents: 199, supplierSource: 'sherpa_hub', category: 'electrical' },
    { name: 'Wire Nuts (assorted)', quantity: 1, unit: 'pack', estimatedCostCents: 499, supplierSource: 'sherpa_hub', category: 'electrical' },
  ],
  furniture_assembly: [
    { name: 'Wood Glue', quantity: 1, unit: 'bottle', estimatedCostCents: 699, supplierSource: 'sherpa_hub', category: 'supplies', wisemanNotes: 'For reinforcing joints if needed' },
    { name: 'Furniture Pads', quantity: 1, unit: 'pack', estimatedCostCents: 499, supplierSource: 'sherpa_hub', category: 'supplies' },
    { name: 'Level (torpedo)', quantity: 1, unit: 'ea', estimatedCostCents: 999, supplierSource: 'sherpa_hub', category: 'tools', wisemanNotes: 'Pro may already have this' },
  ],
  door_install: [
    { name: 'Interior Door (pre-hung 36")', quantity: 1, unit: 'ea', estimatedCostCents: 19999, supplierSource: 'zinc', category: 'doors' },
    { name: 'Door Hinges (3.5")', quantity: 3, unit: 'ea', estimatedCostCents: 599, supplierSource: 'sherpa_hub', category: 'hardware' },
    { name: 'Door Knob Set', quantity: 1, unit: 'ea', estimatedCostCents: 2999, supplierSource: 'sherpa_hub', category: 'hardware' },
    { name: 'Shims (wood)', quantity: 1, unit: 'pack', estimatedCostCents: 499, supplierSource: 'sherpa_hub', category: 'supplies' },
    { name: 'Finish Nails', quantity: 1, unit: 'box', estimatedCostCents: 799, supplierSource: 'sherpa_hub', category: 'supplies' },
    { name: 'Door Casing Trim', quantity: 14, unit: 'ft', estimatedCostCents: 250, supplierSource: 'sherpa_hub', category: 'trim' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Keyword → job type mapping                                         */
/* ------------------------------------------------------------------ */

function detectJobTypes(description: string, trades: TradeInfo[]): string[] {
  const desc = description.toLowerCase();
  const types: string[] = [];

  if ((desc.includes('smart') && (desc.includes('install') || desc.includes('switch'))) || desc.includes('smart switch')) {
    types.push('smart_switch_install');
  }
  if (desc.includes('paint') || desc.includes('painting')) {
    types.push('painting');
  }
  if (desc.includes('drywall') || desc.includes('patch') || desc.includes('hole')) {
    types.push('drywall_repair');
  }
  if (desc.includes('faucet') || desc.includes('sink')) {
    types.push('faucet_replacement');
  }
  if (desc.includes('tv') || desc.includes('mount') || desc.includes('television')) {
    types.push('tv_mounting');
  }
  if (desc.includes('bathroom') || desc.includes('bath remodel')) {
    types.push('bathroom_remodel');
  }
  if (desc.includes('kitchen') || desc.includes('backsplash')) {
    types.push('kitchen_remodel');
  }
  if (desc.includes('deck') && (desc.includes('stain') || desc.includes('paint') || desc.includes('refinish'))) {
    types.push('deck_stain');
  }
  if (desc.includes('outlet') || desc.includes('gfci') || desc.includes('receptacle')) {
    types.push('outlet_install');
  }
  if (desc.includes('furniture') || desc.includes('assembly') || desc.includes('assemble')) {
    types.push('furniture_assembly');
  }
  if (desc.includes('door') && (desc.includes('install') || desc.includes('replace') || desc.includes('hang'))) {
    types.push('door_install');
  }

  // Fallback: pick materials based on trades
  if (types.length === 0) {
    for (const trade of trades) {
      if (trade.tradeKey.includes('electric')) types.push('outlet_install');
      else if (trade.tradeKey.includes('plumb')) types.push('faucet_replacement');
      else if (trade.tradeKey.includes('paint')) types.push('painting');
      else if (trade.tradeKey.includes('carpent') || trade.tradeKey.includes('handyman')) types.push('furniture_assembly');
    }
  }

  return types.length > 0 ? types : ['furniture_assembly'];
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function generateMaterialsList(
  jobDescription: string,
  trades: TradeInfo[],
): MaterialItem[] {
  const jobTypes = detectJobTypes(jobDescription, trades);
  const seen = new Set<string>();
  const materials: MaterialItem[] = [];

  for (const jobType of jobTypes) {
    const items = MATERIALS_DB[jobType] ?? [];
    for (const item of items) {
      if (!seen.has(item.name)) {
        seen.add(item.name);
        materials.push({ ...item });
      }
    }
  }

  return materials;
}

export function validateMaterials(materials: MaterialItem[]): ValidationResult {
  const warnings: string[] = [];
  const flaggedItems: { name: string; reason: string }[] = [];

  for (const item of materials) {
    // Flag unusually high quantities
    if (item.quantity > 100) {
      flaggedItems.push({
        name: item.name,
        reason: `Quantity ${item.quantity} seems unusually high. Verify the amount needed.`,
      });
    }

    // Flag very expensive single items
    if (item.estimatedCostCents > 50000) {
      warnings.push(
        `${item.name} estimated at $${(item.estimatedCostCents / 100).toFixed(2)} -- confirm specification and pricing.`,
      );
    }

    // Flag zero quantity
    if (item.quantity <= 0) {
      flaggedItems.push({
        name: item.name,
        reason: 'Quantity must be at least 1.',
      });
    }

    // Flag zero cost
    if (item.estimatedCostCents <= 0) {
      warnings.push(`${item.name} has no estimated cost -- pricing may need update.`);
    }
  }

  // Check for duplicate categories that might indicate over-ordering
  const categoryCounts = new Map<string, number>();
  for (const item of materials) {
    categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1);
  }
  for (const [cat, count] of categoryCounts) {
    if (count > 5) {
      warnings.push(
        `${count} items in the "${cat}" category -- review for duplicates or unnecessary items.`,
      );
    }
  }

  return {
    valid: flaggedItems.length === 0,
    warnings,
    flaggedItems,
  };
}

export function getSupplierOptions(materialName: string): SupplierOption[] {
  // Mock supplier options with realistic variation
  const baseHash = materialName.length * 17 + materialName.charCodeAt(0);
  const zincMarkup = 90 + (baseHash % 20); // 90-110% of base
  const hubMarkup = 95 + (baseHash % 15); // 95-110% of base

  // Find the material in our DB to get base price
  let baseCents = 1999;
  for (const items of Object.values(MATERIALS_DB)) {
    const found = items.find((i) => i.name === materialName);
    if (found) {
      baseCents = found.estimatedCostCents;
      break;
    }
  }

  return [
    {
      supplier: 'zinc',
      priceCents: Math.round(baseCents * zincMarkup / 100),
      inStock: baseHash % 5 !== 0, // 80% in stock
      estimatedDeliveryDays: 1 + (baseHash % 3),
    },
    {
      supplier: 'sherpa_hub',
      priceCents: Math.round(baseCents * hubMarkup / 100),
      inStock: true, // Hub always in stock
      estimatedDeliveryDays: 0, // Same-day from hub
    },
  ];
}
