// Emergency dispatch mock data

export type EmergencyCategory =
  | 'water_damage'
  | 'fire_smoke'
  | 'storm_damage'
  | 'hvac_emergency'
  | 'electrical'
  | 'gas_leak'
  | 'structural';

export type SeverityLevel = 'critical' | 'urgent' | 'same_day';

export interface EmergencyPro {
  id: string;
  name: string;
  initials: string;
  badgeTier: 'Gold' | 'Silver' | 'Platinum';
  rating: number;
  reviewCount: number;
  certifications: string[];
  responseTimeMinutes: number;
  distanceMiles: number;
  backgroundChecked: boolean;
  licensed: boolean;
  insured: boolean;
  specialties: EmergencyCategory[];
  phone: string;
  yearsExperience: number;
}

export interface EmergencyPricing {
  category: EmergencyCategory;
  label: string;
  rangeLow: number;
  rangeHigh: number;
  description: string;
}

export interface EmergencyTip {
  category: EmergencyCategory;
  tips: string[];
}

export interface CategoryInfo {
  id: EmergencyCategory;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  responseTime: string;
  warning?: string;
}

export const EMERGENCY_CATEGORIES: CategoryInfo[] = [
  {
    id: 'water_damage',
    label: 'Water Damage',
    icon: '\u{1F30A}',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950',
    borderColor: 'border-blue-700',
    responseTime: 'Pros respond in ~30 min',
  },
  {
    id: 'fire_smoke',
    label: 'Fire / Smoke',
    icon: '\u{1F525}',
    color: 'text-red-400',
    bgColor: 'bg-red-950',
    borderColor: 'border-red-700',
    responseTime: 'Pros respond in ~30 min',
  },
  {
    id: 'storm_damage',
    label: 'Storm Damage',
    icon: '\u26C8\uFE0F',
    color: 'text-purple-400',
    bgColor: 'bg-purple-950',
    borderColor: 'border-purple-700',
    responseTime: 'Pros respond in ~45 min',
  },
  {
    id: 'hvac_emergency',
    label: 'HVAC Emergency',
    icon: '\u2744\uFE0F',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950',
    borderColor: 'border-cyan-700',
    responseTime: 'Pros respond in ~45 min',
  },
  {
    id: 'electrical',
    label: 'Electrical',
    icon: '\u26A1',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-950',
    borderColor: 'border-yellow-700',
    responseTime: 'Pros respond in ~30 min',
  },
  {
    id: 'gas_leak',
    label: 'Gas Leak',
    icon: '\u{1F4A8}',
    color: 'text-orange-400',
    bgColor: 'bg-orange-950',
    borderColor: 'border-orange-700',
    responseTime: 'Pros respond in ~20 min',
    warning: 'Call 911 first if you smell gas',
  },
  {
    id: 'structural',
    label: 'Structural',
    icon: '\u{1F3D7}\uFE0F',
    color: 'text-zinc-400',
    bgColor: 'bg-zinc-800',
    borderColor: 'border-zinc-600',
    responseTime: 'Pros respond in ~1 hr',
  },
];

export const SEVERITY_OPTIONS: {
  level: SeverityLevel;
  label: string;
  description: string;
  dot: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    level: 'critical',
    label: 'CRITICAL',
    description: 'Immediate danger. Active flooding, fire, or gas.',
    dot: 'bg-red-500',
    bgColor: 'bg-red-950',
    borderColor: 'border-red-600',
  },
  {
    level: 'urgent',
    label: 'URGENT',
    description: 'Damage is spreading. Needs attention within hours.',
    dot: 'bg-orange-500',
    bgColor: 'bg-orange-950',
    borderColor: 'border-orange-600',
  },
  {
    level: 'same_day',
    label: 'SAME DAY',
    description: 'Needs repair today but no active danger.',
    dot: 'bg-yellow-500',
    bgColor: 'bg-yellow-950',
    borderColor: 'border-yellow-600',
  },
];

export const EMERGENCY_PROS: EmergencyPro[] = [
  {
    id: 'ep-001',
    name: 'Mike Williams',
    initials: 'MW',
    badgeTier: 'Platinum',
    rating: 4.9,
    reviewCount: 214,
    certifications: ['WRT', 'FSRT', 'ASD'],
    responseTimeMinutes: 12,
    distanceMiles: 3.2,
    backgroundChecked: true,
    licensed: true,
    insured: true,
    specialties: ['water_damage', 'fire_smoke', 'storm_damage'],
    phone: '+1 (603) 555-0142',
    yearsExperience: 18,
  },
  {
    id: 'ep-002',
    name: 'Sarah Chen',
    initials: 'SC',
    badgeTier: 'Gold',
    rating: 4.8,
    reviewCount: 156,
    certifications: ['WRT', 'AMRT', 'CCT'],
    responseTimeMinutes: 18,
    distanceMiles: 5.1,
    backgroundChecked: true,
    licensed: true,
    insured: true,
    specialties: ['water_damage', 'hvac_emergency'],
    phone: '+1 (603) 555-0198',
    yearsExperience: 12,
  },
  {
    id: 'ep-003',
    name: 'James Rodriguez',
    initials: 'JR',
    badgeTier: 'Platinum',
    rating: 4.95,
    reviewCount: 312,
    certifications: ['FSRT', 'OCT', 'WRT', 'ASD'],
    responseTimeMinutes: 8,
    distanceMiles: 1.8,
    backgroundChecked: true,
    licensed: true,
    insured: true,
    specialties: ['fire_smoke', 'structural', 'storm_damage'],
    phone: '+1 (603) 555-0267',
    yearsExperience: 22,
  },
  {
    id: 'ep-004',
    name: 'Tony Russo',
    initials: 'TR',
    badgeTier: 'Gold',
    rating: 4.7,
    reviewCount: 98,
    certifications: ['WRT', 'HVAC-R'],
    responseTimeMinutes: 22,
    distanceMiles: 7.4,
    backgroundChecked: true,
    licensed: true,
    insured: true,
    specialties: ['hvac_emergency', 'electrical', 'gas_leak'],
    phone: '+1 (603) 555-0334',
    yearsExperience: 15,
  },
  {
    id: 'ep-005',
    name: 'Dave Patterson',
    initials: 'DP',
    badgeTier: 'Silver',
    rating: 4.6,
    reviewCount: 64,
    certifications: ['WRT', 'FSRT'],
    responseTimeMinutes: 25,
    distanceMiles: 8.9,
    backgroundChecked: true,
    licensed: true,
    insured: true,
    specialties: ['water_damage', 'storm_damage', 'structural'],
    phone: '+1 (603) 555-0401',
    yearsExperience: 9,
  },
];

export const EMERGENCY_PRICING: EmergencyPricing[] = [
  {
    category: 'water_damage',
    label: 'Water Extraction & Mitigation',
    rangeLow: 280000,
    rangeHigh: 420000,
    description: 'Includes water extraction, drying equipment, and initial mold prevention',
  },
  {
    category: 'fire_smoke',
    label: 'Fire & Smoke Damage Assessment',
    rangeLow: 350000,
    rangeHigh: 680000,
    description: 'Board-up, smoke removal, and damage assessment',
  },
  {
    category: 'storm_damage',
    label: 'Storm Damage Mitigation',
    rangeLow: 200000,
    rangeHigh: 500000,
    description: 'Emergency tarping, debris removal, and temporary repairs',
  },
  {
    category: 'hvac_emergency',
    label: 'Emergency HVAC Repair',
    rangeLow: 150000,
    rangeHigh: 350000,
    description: 'Emergency heating/cooling diagnosis and repair',
  },
  {
    category: 'electrical',
    label: 'Emergency Electrical',
    rangeLow: 120000,
    rangeHigh: 280000,
    description: 'Emergency power restoration and hazard elimination',
  },
  {
    category: 'gas_leak',
    label: 'Gas Leak Response',
    rangeLow: 180000,
    rangeHigh: 400000,
    description: 'Gas line isolation, leak detection, and repair',
  },
  {
    category: 'structural',
    label: 'Structural Emergency',
    rangeLow: 300000,
    rangeHigh: 750000,
    description: 'Emergency shoring, bracing, and structural assessment',
  },
];

export const EMERGENCY_TIPS: EmergencyTip[] = [
  {
    category: 'water_damage',
    tips: [
      'Turn off the water main if you can safely reach it',
      'Move electronics and valuables to dry areas',
      'Do NOT enter standing water near electrical outlets',
      'Document damage with photos for insurance',
      'Open windows for ventilation if safe to do so',
    ],
  },
  {
    category: 'fire_smoke',
    tips: [
      'Do NOT re-enter the building until cleared by fire department',
      'Keep windows closed to prevent smoke spread',
      'Turn off HVAC system if safely accessible',
      'Document all visible damage from outside',
      'Contact your insurance company as soon as possible',
    ],
  },
  {
    category: 'storm_damage',
    tips: [
      'Stay away from downed power lines',
      'Cover broken windows with plastic or tarps',
      'Turn off electricity to damaged areas',
      'Watch for signs of structural damage before entering',
      'Document all damage with photos and video',
    ],
  },
  {
    category: 'hvac_emergency',
    tips: [
      'Check thermostat batteries and settings first',
      'Keep doors to unused rooms closed to conserve heat',
      'Use space heaters safely with proper clearance',
      'Do NOT try to repair the system yourself',
      'Open faucets to a drip to prevent pipe freezing',
    ],
  },
  {
    category: 'electrical',
    tips: [
      'Do NOT touch exposed wires or sparking outlets',
      'Turn off the main breaker if safely accessible',
      'Keep everyone away from the affected area',
      'Use flashlights, NOT candles, during outages',
      'Unplug sensitive electronics to prevent surge damage',
    ],
  },
  {
    category: 'gas_leak',
    tips: [
      'EVACUATE IMMEDIATELY - do not use phones inside',
      'Do NOT turn on/off any electrical switches',
      'Open doors and windows as you exit',
      'Call 911 from outside the building',
      'Wait for fire department clearance before re-entering',
    ],
  },
  {
    category: 'structural',
    tips: [
      'Evacuate the building if you see cracks widening',
      'Do NOT prop up sagging structures yourself',
      'Take photos from a safe distance',
      'Listen for creaking or shifting sounds',
      'Keep away from exterior walls that may be compromised',
    ],
  },
];

export function getEmergencyPricing(
  category: EmergencyCategory,
): EmergencyPricing | undefined {
  return EMERGENCY_PRICING.find((p) => p.category === category);
}

export function getEmergencyTips(
  category: EmergencyCategory,
): string[] {
  return (
    EMERGENCY_TIPS.find((t) => t.category === category)?.tips ?? []
  );
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function findMatchingPros(
  category: EmergencyCategory,
): EmergencyPro[] {
  return EMERGENCY_PROS.filter((p) => p.specialties.includes(category)).sort(
    (a, b) => a.responseTimeMinutes - b.responseTimeMinutes,
  );
}
