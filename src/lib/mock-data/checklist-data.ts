// ---------------------------------------------------------------------------
// Wiseman-Generated Job Checklist Mock Data
// ---------------------------------------------------------------------------

export type WisemanReview = 'approved' | 'warning' | 'flagged';

export type MaterialCategory =
  | 'plumbing'
  | 'electrical'
  | 'lumber'
  | 'hardware'
  | 'insulation'
  | 'drywall'
  | 'paint'
  | 'hvac'
  | 'general';

export type ChecklistPhase =
  | 'prep'
  | 'rough_in'
  | 'inspection'
  | 'finish'
  | 'closeout';

// --- Interfaces -------------------------------------------------------------

export interface ScopeDocument {
  jobId: string;
  summary: string;
  codeReferences: { code: string; section: string; description: string }[];
  permitRequirements: string[];
  generatedBy: string;
}

export interface ProcessStep {
  id: string;
  phase: ChecklistPhase;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  safetyNotes: string[];
}

export interface ChecklistItem {
  id: string;
  phase: ChecklistPhase;
  label: string;
  completed: boolean;
  photoRequired: boolean;
  photoUrl?: string;
  isQualityGate: boolean;
}

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  spec: string;
  category: MaterialCategory;
  phase: ChecklistPhase;
  priceCents: number;
  addedBy: 'wiseman' | 'pro';
  proNotes?: string;
  wisemanReview: WisemanReview;
  wisemanNotes?: string;
}

export interface JobChecklist {
  jobId: string;
  scope: ScopeDocument;
  process: ProcessStep[];
  checklist: ChecklistItem[];
  materials: MaterialItem[];
}

// --- Job 1: Kitchen Faucet Replacement (Plumbing) ---------------------------

const plumbingJob: JobChecklist = {
  jobId: 'job-1',
  scope: {
    jobId: 'job-1',
    summary:
      'Replace existing kitchen faucet with new single-handle pull-down model. Fixture-for-fixture swap on existing supply lines.',
    codeReferences: [
      {
        code: 'IRC',
        section: 'P2801',
        description: 'Fixtures — general requirements for plumbing fixtures',
      },
      {
        code: 'IRC',
        section: 'P2705',
        description:
          'Fixture connections — proper connection of supply and waste',
      },
    ],
    permitRequirements: [
      'No permit required for like-for-like fixture replacement',
    ],
    generatedBy: 'Code Wiseman v2.1',
  },
  process: [
    {
      id: 'p1-step-1',
      phase: 'prep',
      order: 1,
      title: 'Shut off water supply',
      description:
        'Turn off hot and cold shut-off valves under the sink. Open faucet to relieve pressure and verify flow stops completely.',
      estimatedMinutes: 10,
      safetyNotes: [
        'Place bucket under connections to catch residual water',
        'Verify shut-off valves close fully before disconnecting lines',
      ],
    },
    {
      id: 'p1-step-2',
      phase: 'rough_in',
      order: 2,
      title: 'Remove old faucet',
      description:
        'Disconnect supply lines from old faucet. Remove mounting hardware and lift old faucet from sink deck. Clean mounting surface.',
      estimatedMinutes: 25,
      safetyNotes: [
        'Wear gloves — old supply lines may have mineral buildup',
      ],
    },
    {
      id: 'p1-step-3',
      phase: 'rough_in',
      order: 3,
      title: 'Install new faucet',
      description:
        'Apply plumber\'s putty to base plate. Set new faucet through deck hole. Secure mounting nut. Connect supply lines with Teflon tape on threaded fittings.',
      estimatedMinutes: 35,
      safetyNotes: [
        'Hand-tighten supply connections first, then snug with wrench — do not overtighten',
      ],
    },
    {
      id: 'p1-step-4',
      phase: 'finish',
      order: 4,
      title: 'Test for leaks',
      description:
        'Turn on shut-off valves slowly. Run hot and cold water for 2 minutes. Inspect all connections for drips. Test pull-down sprayer operation.',
      estimatedMinutes: 20,
      safetyNotes: [
        'Keep bucket in place during initial test',
        'Check connections again after 10 minutes under pressure',
      ],
    },
  ],
  checklist: [
    {
      id: 'c1-1',
      phase: 'prep',
      label: 'Water supply shut off and depressurized',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c1-2',
      phase: 'prep',
      label: 'Work area protected with drop cloth',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c1-3',
      phase: 'rough_in',
      label: 'Old faucet removed and mounting surface cleaned',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c1-4',
      phase: 'rough_in',
      label: 'Supply lines connected with Teflon tape',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c1-5',
      phase: 'finish',
      label: 'Leak test passed — no drips after 10 minutes',
      completed: false,
      photoRequired: true,
      isQualityGate: true,
    },
    {
      id: 'c1-6',
      phase: 'finish',
      label: 'Area cleaned and client walkthrough complete',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
  ],
  materials: [
    {
      id: 'm1-1',
      name: 'Moen Adler Single-Handle Pull-Down Kitchen Faucet',
      quantity: 1,
      unit: 'ea',
      spec: 'Chrome finish, 1.5 GPM aerator, 68" braided hose',
      category: 'plumbing',
      phase: 'rough_in',
      priceCents: 18900,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm1-2',
      name: 'Braided Stainless Steel Supply Lines 3/8" x 20"',
      quantity: 2,
      unit: 'ea',
      spec: '3/8" comp x 1/2" FIP, stainless braided',
      category: 'plumbing',
      phase: 'rough_in',
      priceCents: 1299,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm1-3',
      name: "Oatey Plumber's Putty 14 oz",
      quantity: 1,
      unit: 'ea',
      spec: 'Stain-free formula, 14 oz tub',
      category: 'plumbing',
      phase: 'rough_in',
      priceCents: 549,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm1-4',
      name: 'PTFE Thread Seal Tape 1/2" x 260"',
      quantity: 2,
      unit: 'roll',
      spec: 'Standard density, 1/2" width',
      category: 'plumbing',
      phase: 'rough_in',
      priceCents: 199,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm1-5',
      name: '5-Gallon Bucket',
      quantity: 1,
      unit: 'ea',
      spec: 'Standard utility bucket for water catch',
      category: 'general',
      phase: 'prep',
      priceCents: 499,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm1-6',
      name: 'Shop Towels (Pack of 6)',
      quantity: 1,
      unit: 'pack',
      spec: 'Reusable blue shop towels',
      category: 'general',
      phase: 'prep',
      priceCents: 899,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
  ],
};

// --- Job 4: Panel Upgrade 100A to 200A (Electrical) -------------------------

const electricalJob: JobChecklist = {
  jobId: 'job-4',
  scope: {
    jobId: 'job-4',
    summary:
      'Upgrade residential electrical service from 100-amp to 200-amp. Replace main panel, service entrance cable, and grounding system. Utility coordination required.',
    codeReferences: [
      {
        code: 'NEC',
        section: '230.79',
        description:
          'Rating of service disconnect — minimum 200A for dwelling units with electric heating or A/C',
      },
      {
        code: 'NEC',
        section: '110.26',
        description:
          'Working space requirements — minimum 36" clear in front of panel, 30" wide, illuminated',
      },
      {
        code: 'NEC',
        section: '250.66',
        description:
          'Grounding electrode conductor sizing — #6 copper minimum for 200A service',
      },
      {
        code: 'NEC',
        section: '408.36',
        description:
          'Overcurrent protection of panelboards — each panelboard shall be protected by overcurrent device',
      },
    ],
    permitRequirements: [
      'Electrical permit required — submit load calculation and panel schedule',
      'Utility disconnect/reconnect coordination with Eversource',
      'Final inspection required before utility restores power',
    ],
    generatedBy: 'Code Wiseman v2.1',
  },
  process: [
    {
      id: 'p4-step-1',
      phase: 'prep',
      order: 1,
      title: 'Utility coordination and disconnect',
      description:
        'Submit service upgrade request to Eversource. Schedule meter pull and temporary disconnect. Verify utility has de-energized service drop.',
      estimatedMinutes: 60,
      safetyNotes: [
        'NEVER work on service entrance conductors until utility confirms de-energized',
        'Use non-contact voltage tester to verify dead before touching any conductor',
        'Lock out/tag out meter socket',
      ],
    },
    {
      id: 'p4-step-2',
      phase: 'rough_in',
      order: 2,
      title: 'Remove old 100A panel',
      description:
        'Document existing circuit layout with photos and labels. Disconnect all branch circuits. Remove old panel and service entrance cable.',
      estimatedMinutes: 90,
      safetyNotes: [
        'Label every circuit wire before disconnecting',
        'Assume all conductors are live until tested',
        'Wear rated electrical gloves (Class 00 minimum)',
      ],
    },
    {
      id: 'p4-step-3',
      phase: 'rough_in',
      order: 3,
      title: 'Mount new 200A panel and run service entrance cable',
      description:
        'Install new 200A main breaker panel at code-compliant height. Run 4/0 aluminum or 2/0 copper SE cable from weather head to panel. Install PVC conduit for exterior run.',
      estimatedMinutes: 120,
      safetyNotes: [
        'Maintain NEC 110.26 working clearances — 36" front, 30" wide',
        'Secure SE cable with listed straps every 4.5 feet',
      ],
    },
    {
      id: 'p4-step-4',
      phase: 'rough_in',
      order: 4,
      title: 'Wire branch circuits to new panel',
      description:
        'Reconnect all existing branch circuits per documented layout. Install AFCI/GFCI breakers where required by NEC 210.12 and 210.8. Torque all connections to manufacturer specs.',
      estimatedMinutes: 90,
      safetyNotes: [
        'Use calibrated torque wrench — improper torque is a fire hazard',
        'Verify wire gauge matches breaker amperage for every circuit',
      ],
    },
    {
      id: 'p4-step-5',
      phase: 'rough_in',
      order: 5,
      title: 'Install grounding and bonding system',
      description:
        'Drive two 8-foot ground rods minimum 6 feet apart. Run #6 copper grounding electrode conductor from panel to rods. Bond water pipe and gas pipe per NEC 250.104.',
      estimatedMinutes: 60,
      safetyNotes: [
        'Ground rods must be driven full depth — minimum 8 feet',
        'Use listed clamps for all grounding connections',
      ],
    },
    {
      id: 'p4-step-6',
      phase: 'finish',
      order: 6,
      title: 'Final testing and inspection',
      description:
        'Perform point-to-point continuity testing on all circuits. Verify grounding impedance. Test all AFCI/GFCI breakers. Schedule final inspection with AHJ.',
      estimatedMinutes: 60,
      safetyNotes: [
        'Test GFCI/AFCI breakers with both test button and external tester',
        'Verify voltage at panel — 240V line-to-line, 120V line-to-neutral',
      ],
    },
  ],
  checklist: [
    {
      id: 'c4-1',
      phase: 'prep',
      label: 'Utility confirmed service is de-energized',
      completed: false,
      photoRequired: false,
      isQualityGate: true,
    },
    {
      id: 'c4-2',
      phase: 'prep',
      label: 'Existing circuit layout documented with photos',
      completed: false,
      photoRequired: true,
      isQualityGate: false,
    },
    {
      id: 'c4-3',
      phase: 'rough_in',
      label: 'Old panel removed and conductors labeled',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c4-4',
      phase: 'rough_in',
      label: 'New 200A panel mounted with NEC 110.26 clearances',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c4-5',
      phase: 'rough_in',
      label: 'Service entrance cable installed and secured',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c4-6',
      phase: 'rough_in',
      label: 'All branch circuits reconnected and torqued',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c4-7',
      phase: 'rough_in',
      label: 'Grounding electrode system installed — #6 copper to ground rods',
      completed: false,
      photoRequired: true,
      isQualityGate: true,
    },
    {
      id: 'c4-8',
      phase: 'rough_in',
      label: 'Bonding jumpers installed on water and gas pipes',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c4-9',
      phase: 'inspection',
      label: 'Panel interior photo taken for inspector review',
      completed: false,
      photoRequired: true,
      isQualityGate: true,
    },
    {
      id: 'c4-10',
      phase: 'inspection',
      label: 'AHJ final inspection passed',
      completed: false,
      photoRequired: false,
      isQualityGate: true,
    },
    {
      id: 'c4-11',
      phase: 'finish',
      label: 'All AFCI/GFCI breakers tested and operational',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c4-12',
      phase: 'finish',
      label: 'Panel schedule completed and posted inside panel door',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
  ],
  materials: [
    {
      id: 'm4-1',
      name: 'Square D Homeline 200A 40-Space Main Breaker Panel',
      quantity: 1,
      unit: 'ea',
      spec: 'HOM4080M200PC, indoor rated, copper bus',
      category: 'electrical',
      phase: 'rough_in',
      priceCents: 42900,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm4-2',
      name: 'Square D Homeline 20A Single-Pole AFCI Breaker',
      quantity: 8,
      unit: 'ea',
      spec: 'HOM120CAFIC, combination AFCI',
      category: 'electrical',
      phase: 'rough_in',
      priceCents: 4599,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm4-3',
      name: 'Square D Homeline 20A GFCI Breaker',
      quantity: 4,
      unit: 'ea',
      spec: 'HOM120GFI, Class A GFCI',
      category: 'electrical',
      phase: 'rough_in',
      priceCents: 3999,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm4-4',
      name: '4/0 Aluminum SE Cable (per foot)',
      quantity: 25,
      unit: 'ft',
      spec: '4/0-4/0-2/0 aluminum SEU cable',
      category: 'electrical',
      phase: 'rough_in',
      priceCents: 699,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm4-5',
      name: '#8 Copper Ground Wire',
      quantity: 20,
      unit: 'ft',
      spec: '#8 AWG bare solid copper',
      category: 'electrical',
      phase: 'rough_in',
      priceCents: 189,
      addedBy: 'pro',
      proNotes: 'Swapped from #6 — had #8 on the truck, should be fine',
      wisemanReview: 'warning',
      wisemanNotes:
        'NEC 250.66 requires #6 copper minimum for 200A service. #8 is undersized and will fail inspection. Replace with #6 AWG bare copper.',
    },
    {
      id: 'm4-6',
      name: '8-Foot Copper-Bonded Ground Rod 5/8"',
      quantity: 2,
      unit: 'ea',
      spec: '5/8" x 8\' copper-bonded steel, UL listed',
      category: 'electrical',
      phase: 'rough_in',
      priceCents: 1899,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm4-7',
      name: '2" PVC Schedule 40 Conduit (10\' stick)',
      quantity: 2,
      unit: 'ea',
      spec: '2" Schedule 40 PVC, UL listed for electrical',
      category: 'electrical',
      phase: 'rough_in',
      priceCents: 1299,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm4-8',
      name: '2" PVC Conduit Connectors and Fittings Kit',
      quantity: 1,
      unit: 'kit',
      spec: 'Includes LBs, couplings, straps, and PVC cement',
      category: 'electrical',
      phase: 'rough_in',
      priceCents: 2499,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm4-9',
      name: 'Cable Staples for SE Cable (box of 25)',
      quantity: 1,
      unit: 'box',
      spec: '2-hole galvanized straps for 4/0 SEU',
      category: 'electrical',
      phase: 'rough_in',
      priceCents: 1299,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm4-10',
      name: 'Circuit Breaker Label Kit',
      quantity: 1,
      unit: 'ea',
      spec: 'Pre-printed + blank adhesive labels for panel schedule',
      category: 'electrical',
      phase: 'finish',
      priceCents: 899,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
  ],
};

// --- Job 3: Bathroom Remodel ------------------------------------------------

const bathroomJob: JobChecklist = {
  jobId: 'job-3',
  scope: {
    jobId: 'job-3',
    summary:
      'Full bathroom remodel — demo to studs, new shower with tile surround, new vanity, toilet, and fixtures. Plumbing relocated for walk-in shower conversion.',
    codeReferences: [
      {
        code: 'IRC',
        section: 'R305',
        description:
          'Minimum ceiling height — 80" minimum above shower and tub areas',
      },
      {
        code: 'IRC',
        section: 'R307',
        description:
          'Bathroom design requirements — clearances, ventilation, lighting',
      },
      {
        code: 'IRC',
        section: 'P2708',
        description:
          'Shower requirements — minimum 900 sq in floor area, waterproof membrane required',
      },
      {
        code: 'NEC',
        section: '210.8',
        description:
          'GFCI protection required for all 125V 15/20A receptacles in bathrooms',
      },
    ],
    permitRequirements: [
      'Building permit required — plumbing relocation triggers full permit',
      'Plumbing rough-in inspection before closing walls',
      'Final inspection for occupancy approval',
    ],
    generatedBy: 'Code Wiseman v2.1',
  },
  process: [
    {
      id: 'p3-step-1',
      phase: 'prep',
      order: 1,
      title: 'Demolition',
      description:
        'Remove existing tub, vanity, toilet, and tile. Demo to studs and subfloor. Inspect framing and subfloor for rot or damage. Repair as needed.',
      estimatedMinutes: 360,
      safetyNotes: [
        'Shut off water and cap all supply and drain lines before demo',
        'Wear N95 respirator — older tile may have mastic containing asbestos',
        'Test for lead paint if home is pre-1978',
      ],
    },
    {
      id: 'p3-step-2',
      phase: 'rough_in',
      order: 2,
      title: 'Rough plumbing',
      description:
        'Relocate drain and supply lines for walk-in shower configuration. Install new shower valve at proper height. Run new supply lines to vanity. Install vent per IRC P3104.',
      estimatedMinutes: 300,
      safetyNotes: [
        'Pressure-test new supply lines at 80 PSI for 30 minutes before closing walls',
        'Verify shower valve temp is set to 120\u00b0F max per IRC P2708.4',
      ],
    },
    {
      id: 'p3-step-3',
      phase: 'rough_in',
      order: 3,
      title: 'Cement board and waterproofing',
      description:
        'Install 1/2" cement board on shower walls. Apply waterproof membrane (Kerdi or RedGard) to all wet areas. Tape and waterproof all seams and fastener heads.',
      estimatedMinutes: 240,
      safetyNotes: [
        'Score and snap cement board — do not cut with power saw indoors without HEPA vac',
        'Waterproof membrane must extend 3" past shower opening on all sides',
      ],
    },
    {
      id: 'p3-step-4',
      phase: 'finish',
      order: 4,
      title: 'Tile installation and grouting',
      description:
        'Set wall and floor tile with modified thinset. Allow 24-hour cure. Grout all joints. Seal grout after 72-hour cure. Install corner and edge trim.',
      estimatedMinutes: 360,
      safetyNotes: [
        'Use modified thinset rated for cement board substrate',
        'Maintain 1/8" grout joints minimum per TCNA guidelines',
      ],
    },
    {
      id: 'p3-step-5',
      phase: 'finish',
      order: 5,
      title: 'Fixture installation and final',
      description:
        'Install vanity, toilet, showerhead, trim, mirrors, and accessories. Caulk all fixture-to-tile joints with mildew-resistant silicone. Final test all plumbing.',
      estimatedMinutes: 180,
      safetyNotes: [
        'Use 100% silicone caulk at all fixture-to-tile joints — no latex caulk in wet areas',
        'Verify GFCI outlet is operational before completing',
      ],
    },
  ],
  checklist: [
    {
      id: 'c3-1',
      phase: 'prep',
      label: 'Water shut off and all lines capped',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c3-2',
      phase: 'prep',
      label: 'Demo complete — framing and subfloor inspected',
      completed: false,
      photoRequired: false,
      isQualityGate: true,
    },
    {
      id: 'c3-3',
      phase: 'rough_in',
      label: 'Plumbing rough-in complete and pressure-tested',
      completed: false,
      photoRequired: false,
      isQualityGate: true,
    },
    {
      id: 'c3-4',
      phase: 'rough_in',
      label: 'Plumbing rough-in inspection passed',
      completed: false,
      photoRequired: false,
      isQualityGate: true,
    },
    {
      id: 'c3-5',
      phase: 'rough_in',
      label: 'Cement board installed and seams taped',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c3-6',
      phase: 'rough_in',
      label: 'Waterproof membrane applied and flood-tested',
      completed: false,
      photoRequired: true,
      isQualityGate: true,
    },
    {
      id: 'c3-7',
      phase: 'finish',
      label: 'Wall and floor tile set with proper thinset coverage',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c3-8',
      phase: 'finish',
      label: 'Grout and sealant applied per TCNA guidelines',
      completed: false,
      photoRequired: false,
      isQualityGate: false,
    },
    {
      id: 'c3-9',
      phase: 'finish',
      label: 'All fixtures installed and tested for leaks',
      completed: false,
      photoRequired: true,
      isQualityGate: false,
    },
    {
      id: 'c3-10',
      phase: 'closeout',
      label: 'Final inspection passed and client walkthrough complete',
      completed: false,
      photoRequired: false,
      isQualityGate: true,
    },
  ],
  materials: [
    {
      id: 'm3-1',
      name: 'Durock 1/2" Cement Board 3\' x 5\'',
      quantity: 8,
      unit: 'sheet',
      spec: '1/2" x 3\' x 5\' cement backer board',
      category: 'drywall',
      phase: 'rough_in',
      priceCents: 1499,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm3-2',
      name: 'Schluter Kerdi Waterproof Membrane (108 sq ft roll)',
      quantity: 1,
      unit: 'roll',
      spec: 'Kerdi 108 sq ft, polyethylene membrane',
      category: 'general',
      phase: 'rough_in',
      priceCents: 15900,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm3-3',
      name: 'Porcelain Floor & Wall Tile 12" x 24"',
      quantity: 120,
      unit: 'sq ft',
      spec: 'Matte finish, PEI Class 4, frost-resistant',
      category: 'general',
      phase: 'finish',
      priceCents: 399,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm3-4',
      name: 'Mapei Kerabond Modified Thinset 50 lb',
      quantity: 3,
      unit: 'bag',
      spec: '50 lb bag, gray, polymer-modified for cement board',
      category: 'general',
      phase: 'finish',
      priceCents: 2999,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm3-5',
      name: 'Mapei Keracolor U Unsanded Grout 10 lb',
      quantity: 2,
      unit: 'bag',
      spec: '10 lb bag, color: Warm Gray, for joints 1/8" or less',
      category: 'general',
      phase: 'finish',
      priceCents: 1899,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm3-6',
      name: 'Delta Monitor 14-Series Shower Valve',
      quantity: 1,
      unit: 'ea',
      spec: 'T14278-SS, stainless finish, pressure-balance cartridge',
      category: 'plumbing',
      phase: 'rough_in',
      priceCents: 12900,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm3-7',
      name: 'Delta 8" Rain Showerhead',
      quantity: 1,
      unit: 'ea',
      spec: 'RP52382SS, 1.75 GPM, stainless finish',
      category: 'plumbing',
      phase: 'finish',
      priceCents: 7900,
      addedBy: 'wiseman',
      wisemanReview: 'approved',
    },
    {
      id: 'm3-8',
      name: 'GFCI Outlet — REMOVED by pro',
      quantity: 0,
      unit: 'ea',
      spec: 'Existing 20A GFCI receptacle removed during demo, not scheduled for replacement',
      category: 'electrical',
      phase: 'prep',
      priceCents: 0,
      addedBy: 'pro',
      proNotes: 'Removed outlet during demo — vanity will cover that wall anyway',
      wisemanReview: 'flagged',
      wisemanNotes:
        'NEC 210.8 requires GFCI protection in all bathrooms. Receptacle cannot be removed — must be reinstalled or relocated. Vanity does not eliminate requirement. This will fail final inspection.',
    },
  ],
};

// --- Lookup Map & Helper ----------------------------------------------------

const MOCK_CHECKLISTS: Record<string, JobChecklist> = {
  'job-1': plumbingJob,
  'job-4': electricalJob,
  'job-3': bathroomJob,
};

export function getChecklistForJob(jobId: string): JobChecklist | null {
  return MOCK_CHECKLISTS[jobId] ?? null;
}

export { MOCK_CHECKLISTS };
