// Mock data for Pro dashboard pages
// All data is realistic sample data for development and testing

export type BadgeTierType = 'bronze' | 'silver' | 'gold';

export interface ProProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  badgeTier: BadgeTierType;
  memberSince: string;
  overallRating: number;
  totalReviews: number;
  trades: TradeSkill[];
  serviceArea: ServiceArea;
  certifications: Certification[];
  licenses: LicenseInsurance[];
  portfolio: PortfolioItem[];
  availability: WeeklyAvailability;
}

export interface TradeSkill {
  id: string;
  name: string;
  category: string;
  yearsExperience: number;
  verified: boolean;
}

export interface ServiceArea {
  homeHub: string;
  homeHubCoords: { lat: number; lng: number };
  travelRadiusMiles: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string | null;
  isIICRC: boolean;
  verified: boolean;
}

export interface LicenseInsurance {
  id: string;
  type: 'license' | 'insurance';
  name: string;
  number: string;
  expiryDate: string;
  verified: boolean;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

export interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface DayAvailability {
  available: boolean;
  startTime: string;
  endTime: string;
}

export interface DashboardStats {
  activeJobs: number;
  pendingBids: number;
  monthEarnings: number;
  visibilityScore: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  budgetMin: number;
  budgetMax: number;
  distanceMiles: number;
  postedAt: string;
  clientRating: number | null;
  clientName: string;
  status: 'available' | 'bid_pending' | 'bid_accepted' | 'bid_rejected' | 'active' | 'completed';
  dispatchScore?: number;
  address: string;
  scope: string;
  photos: string[];
  permitsRequired: string[];
  budgetVerified: boolean;
  type: 'bid' | 'auto-dispatch';
  milestones: Milestone[];
  onboardingChecklist: ChecklistItem[];
  offboardingChecklist: ChecklistItem[];
  ratingReceived?: number;
  reviewText?: string;
  skill_tags?: string[]; // matches skill_key from skills-catalog.ts
}

export interface Milestone {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  completedDate?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Bid {
  id: string;
  jobId: string;
  jobTitle: string;
  amount: number;
  message: string;
  estimatedDuration: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'pending_materials_review';
  rejectionReason?: string;
  completionDate?: string;
}

export interface Dispatch {
  id: string;
  jobId: string;
  jobTitle: string;
  category: string;
  urgency: 'high' | 'emergency';
  budgetMax: number;
  distanceMiles: number;
  expiresAt: string;
  clientName: string;
  address: string;
}

export interface ActivityItem {
  id: string;
  type: 'dispatch' | 'bid_accepted' | 'payment' | 'rating' | 'bid_rejected' | 'job_completed';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  rating?: number;
}

export interface Transaction {
  id: string;
  date: string;
  jobTitle: string;
  grossAmount: number;
  commission: number;
  netAmount: number;
  status: 'released' | 'pending' | 'held';
}

export interface MonthlyEarning {
  month: string;
  amount: number;
}

export interface CommissionTier {
  currentTier: string;
  currentRate: number;
  nextTier: string;
  nextRate: number;
  amountToNext: number;
  totalEarned: number;
}

// ---------- MOCK DATA ----------

export const mockProProfile: ProProfile = {
  id: 'pro-001',
  name: 'Marcus Rivera',
  email: 'marcus@riveratrades.com',
  phone: '(603) 555-0142',
  avatar: '',
  badgeTier: 'silver',
  memberSince: '2024-03-15',
  overallRating: 4.7,
  totalReviews: 38,
  trades: [
    { id: 't1', name: 'General Carpentry', category: 'Carpentry', yearsExperience: 12, verified: true },
    { id: 't2', name: 'Deck Building', category: 'Carpentry', yearsExperience: 8, verified: true },
    { id: 't3', name: 'Bathroom Remodel', category: 'Remodeling', yearsExperience: 6, verified: false },
    { id: 't4', name: 'Drywall Installation', category: 'Interior', yearsExperience: 10, verified: true },
    { id: 't5', name: 'Trim & Molding', category: 'Carpentry', yearsExperience: 12, verified: true },
  ],
  serviceArea: {
    homeHub: 'Portsmouth, NH',
    homeHubCoords: { lat: 42.9956, lng: -71.4548 },
    travelRadiusMiles: 35,
  },
  certifications: [
    { id: 'c1', name: 'OSHA 30-Hour Construction', issuer: 'OSHA', issuedDate: '2023-06-01', expiryDate: null, isIICRC: false, verified: true },
    { id: 'c2', name: 'Lead-Safe Renovator (RRP)', issuer: 'EPA', issuedDate: '2024-01-15', expiryDate: '2029-01-15', isIICRC: false, verified: true },
    { id: 'c3', name: 'Water Damage Restoration', issuer: 'IICRC', issuedDate: '2023-09-20', expiryDate: '2026-09-20', isIICRC: true, verified: true },
  ],
  licenses: [
    { id: 'l1', type: 'license', name: "NH Contractor's License", number: 'NH-GC-28491', expiryDate: '2027-03-31', verified: true },
    { id: 'l2', type: 'insurance', name: 'General Liability Insurance', number: 'GL-20240315-A', expiryDate: '2027-03-15', verified: true },
    { id: 'l3', type: 'insurance', name: "Worker's Compensation", number: 'WC-20240315-B', expiryDate: '2027-03-15', verified: true },
  ],
  portfolio: [
    { id: 'p1', imageUrl: '', title: 'Custom Deck Build — Concord, NH', description: '800 sq ft composite deck with built-in planters and lighting' },
    { id: 'p2', imageUrl: '', title: 'Kitchen Remodel — Manchester, NH', description: 'Full gut renovation with custom cabinetry and island' },
    { id: 'p3', imageUrl: '', title: 'Bathroom Renovation — Nashua, NH', description: 'Primary bath with walk-in tile shower and heated floors' },
    { id: 'p4', imageUrl: '', title: 'Basement Finish — Bedford, NH', description: 'Full basement finish with rec room, bathroom, and wet bar' },
    { id: 'p5', imageUrl: '', title: 'Crown Molding Install — Derry, NH', description: 'Whole-house crown molding with custom corner details' },
    { id: 'p6', imageUrl: '', title: 'Fence Build — Merrimack, NH', description: '200 linear ft cedar privacy fence with custom gate' },
  ],
  availability: {
    monday: { available: true, startTime: '07:00', endTime: '17:00' },
    tuesday: { available: true, startTime: '07:00', endTime: '17:00' },
    wednesday: { available: true, startTime: '07:00', endTime: '17:00' },
    thursday: { available: true, startTime: '07:00', endTime: '17:00' },
    friday: { available: true, startTime: '07:00', endTime: '15:00' },
    saturday: { available: true, startTime: '08:00', endTime: '12:00' },
    sunday: { available: false, startTime: '', endTime: '' },
  },
};

export const mockDashboardStats: DashboardStats = {
  activeJobs: 4,
  pendingBids: 8,
  monthEarnings: 8450,
  visibilityScore: 87,
};

export const mockDispatch: Dispatch = {
  id: 'disp-001',
  jobId: 'job-010',
  jobTitle: 'Emergency Pipe Burst Repair',
  category: 'Plumbing',
  urgency: 'emergency',
  budgetMax: 2500,
  distanceMiles: 4.2,
  expiresAt: new Date(Date.now() + 14 * 60 * 1000).toISOString(), // 14 min from now
  clientName: 'Sarah M.',
  address: '142 Elm St, Manchester, NH',
};

// Marcus Rivera's skill keys — used for skill-based job filtering
export const mockProSkillKeys: string[] = [
  'drywall_install', 'drywall_repair', 'texture_skim',
  'door_install', 'door_repair',
  'deck_repair', 'fence_repair',
  'crown_molding', 'wainscoting', 'built_in_shelving', 'cabinet_hardware', 'window_door_casing', 'stair_railing',
  'trim_baseboard',
  'interior_painting',
  'tile_install_repair',
];

export const mockAvailableJobs: Job[] = [
  {
    id: 'job-001',
    title: 'Kitchen Cabinet Installation',
    description: 'Install pre-fabricated kitchen cabinets in a newly renovated kitchen. Upper and lower cabinets, including island base. All materials provided on-site.',
    category: 'Carpentry',
    urgency: 'medium',
    budgetMin: 2000,
    budgetMax: 3500,
    distanceMiles: 8.3,
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.8,
    clientName: 'James T.',
    status: 'available',
    dispatchScore: 94,
    address: '88 Oak Ridge Dr, Bedford, NH',
    scope: 'Install 14 pre-fab cabinets (8 upper, 6 lower) plus island base. Level, shim, and secure. Client provides all materials. Must have own tools.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['cabinet_hardware', 'built_in_shelving'],
  },
  {
    id: 'job-002',
    title: 'Deck Repair & Staining',
    description: 'Repair damaged deck boards and apply stain to entire 400 sq ft deck. Some boards need replacement.',
    category: 'Carpentry',
    urgency: 'low',
    budgetMin: 1200,
    budgetMax: 2000,
    distanceMiles: 12.1,
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.5,
    clientName: 'Linda P.',
    status: 'available',
    dispatchScore: 88,
    address: '55 Pine View Ln, Merrimack, NH',
    scope: 'Replace 6-8 damaged composite boards, sand rough spots, apply two coats of semi-transparent stain. Deck is 20x20.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['deck_repair'],
  },
  {
    id: 'job-003',
    title: 'Bathroom Tile Installation',
    description: 'Install floor and shower wall tile in primary bathroom renovation. Approximately 120 sq ft total.',
    category: 'Remodeling',
    urgency: 'medium',
    budgetMin: 3000,
    budgetMax: 4500,
    distanceMiles: 6.7,
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    clientRating: null,
    clientName: 'Robert K.',
    status: 'available',
    dispatchScore: 91,
    address: '201 Maple Ave, Hooksett, NH',
    scope: 'Tile installation on shower walls and bathroom floor. Waterproofing membrane required. Client supplies tile and grout.',
    photos: [],
    permitsRequired: ['Building Permit'],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['tile_install_repair', 'caulking_grouting'],
  },
  {
    id: 'job-004',
    title: 'Emergency Water Damage Dryout',
    description: 'Water damage from burst pipe in basement. Need immediate extraction and drying equipment setup.',
    category: 'Restoration',
    urgency: 'emergency',
    budgetMin: 1500,
    budgetMax: 3000,
    distanceMiles: 3.2,
    postedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    clientRating: 4.9,
    clientName: 'Angela D.',
    status: 'available',
    dispatchScore: 97,
    address: '33 River Rd, Manchester, NH',
    scope: 'Water extraction from basement, set up dehumidifiers and air movers. Monitor moisture levels over 3 days. Insurance claim documentation.',
    photos: [],
    permitsRequired: [],
    budgetVerified: false,
    type: 'auto-dispatch',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['drywall_repair'],
  },
  {
    id: 'job-005',
    title: 'Fence Installation — Cedar Privacy',
    description: '150 linear feet of 6ft cedar privacy fence with one gate.',
    category: 'Carpentry',
    urgency: 'low',
    budgetMin: 4000,
    budgetMax: 6500,
    distanceMiles: 18.5,
    postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.2,
    clientName: 'Tom W.',
    status: 'available',
    dispatchScore: 76,
    address: '410 Country Club Dr, Londonderry, NH',
    scope: '150 LF of 6ft dog-ear cedar privacy fence. Includes one 4ft walk gate. Post holes need digging — check for underground utilities.',
    photos: [],
    permitsRequired: ['Fence Permit'],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['fence_repair'],
  },
  // --- 10 new jobs ---
  {
    id: 'job-006',
    title: 'Smart Thermostat Installation',
    description: 'Install a Nest Learning Thermostat to replace old mercury unit. Includes wiring check and Wi-Fi setup.',
    category: 'Smart Home',
    urgency: 'low',
    budgetMin: 150,
    budgetMax: 300,
    distanceMiles: 5.4,
    postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.6,
    clientName: 'Mike S.',
    status: 'available',
    dispatchScore: 82,
    address: '14 Chestnut St, Exeter, NH',
    scope: 'Remove old thermostat, verify C-wire present, install Nest unit, connect to Wi-Fi, test heating and cooling cycles.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['smart_devices'],
  },
  {
    id: 'job-007',
    title: 'Interior Door Replacement (3 Doors)',
    description: 'Replace three hollow-core interior doors with solid-core pre-hung units. Trim and paint to match existing.',
    category: 'Carpentry',
    urgency: 'medium',
    budgetMin: 400,
    budgetMax: 800,
    distanceMiles: 9.7,
    postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.3,
    clientName: 'Beth A.',
    status: 'available',
    dispatchScore: 90,
    address: '72 Mammoth Rd, Londonderry, NH',
    scope: 'Remove 3 old doors, install pre-hung solid-core replacements, shim and level, install hardware, touch-up paint on trim.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['door_install', 'trim_baseboard'],
  },
  {
    id: 'job-008',
    title: 'Gutter Cleaning & Minor Repair',
    description: 'Clean gutters on a 2-story colonial and repair one sagging section. Approximately 180 LF total.',
    category: 'Exterior',
    urgency: 'medium',
    budgetMin: 200,
    budgetMax: 400,
    distanceMiles: 7.2,
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.7,
    clientName: 'Carol F.',
    status: 'available',
    dispatchScore: 85,
    address: '309 Main St, Newmarket, NH',
    scope: 'Clean all gutters and downspouts, flush with hose, re-secure one sagging 10ft section with new hangers.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['gutter_cleaning', 'gutter_install'],
  },
  {
    id: 'job-009',
    title: 'TV Wall Mount + Cable Management',
    description: 'Mount a 65" TV on living room wall and run cables through wall for clean look. Drywall patch included.',
    category: 'Smart Home',
    urgency: 'low',
    budgetMin: 150,
    budgetMax: 350,
    distanceMiles: 4.1,
    postedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    clientRating: null,
    clientName: 'Derek J.',
    status: 'available',
    dispatchScore: 79,
    address: '88 Union St, Manchester, NH',
    scope: 'Install articulating wall mount for 65" TV, fish HDMI and power through wall, patch any drywall holes, test mount stability.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['tv_projector_mount', 'drywall_repair'],
  },
  {
    id: 'job-010',
    title: 'Bathroom Faucet Replacement',
    description: 'Replace outdated bathroom faucet with new Moen single-handle unit. Re-caulk vanity backsplash.',
    category: 'Plumbing',
    urgency: 'low',
    budgetMin: 200,
    budgetMax: 400,
    distanceMiles: 6.3,
    postedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.4,
    clientName: 'Janet R.',
    status: 'available',
    dispatchScore: 83,
    address: '56 High St, Hampton, NH',
    scope: 'Disconnect old faucet, install new Moen Align single-handle, check for leaks, re-caulk vanity-to-wall seam.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'auto-dispatch',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['faucet_fixture', 'caulking_grouting'],
  },
  {
    id: 'job-011',
    title: 'Crown Molding Installation — Living Room',
    description: 'Install 4.5" crown molding in open-concept living/dining area. Approximately 85 LF with 6 inside corners.',
    category: 'Finish Carpentry',
    urgency: 'medium',
    budgetMin: 500,
    budgetMax: 1200,
    distanceMiles: 10.8,
    postedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.9,
    clientName: 'Susan W.',
    status: 'available',
    dispatchScore: 93,
    address: '22 Sagamore Rd, Rye, NH',
    scope: '85 LF of 4.5" pine crown molding. Cope inside corners, miter outside corners. Prime and paint to match walls. Client provides molding.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['crown_molding'],
  },
  {
    id: 'job-012',
    title: 'Lawn Cleanup & Mulching',
    description: 'Spring cleanup of 1/3 acre yard. Rake, edge beds, spread 4 yards of mulch.',
    category: 'Landscaping',
    urgency: 'low',
    budgetMin: 300,
    budgetMax: 600,
    distanceMiles: 14.5,
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.1,
    clientName: 'Paul B.',
    status: 'available',
    dispatchScore: 72,
    address: '198 River Rd, Tyngsborough, MA',
    scope: 'Rake leaves and debris, edge 6 garden beds, spread 4 yards of dark mulch (delivered on-site). Bag and remove debris.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['lawn_care', 'mulching_edging'],
  },
  {
    id: 'job-013',
    title: 'Drywall Patch & Paint (Water Damage)',
    description: 'Repair water-damaged drywall section in kitchen ceiling and repaint to match. Approximately 4x6 ft area.',
    category: 'Interior',
    urgency: 'high',
    budgetMin: 400,
    budgetMax: 900,
    distanceMiles: 3.8,
    postedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.8,
    clientName: 'Kevin M.',
    status: 'available',
    dispatchScore: 92,
    address: '41 Elm St, Dover, NH',
    scope: 'Cut out damaged drywall, install new piece, tape and mud, texture match, prime and paint. Leak already fixed by plumber.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['drywall_repair', 'interior_painting'],
  },
  {
    id: 'job-014',
    title: 'Ceiling Fan Installation (2 Fans)',
    description: 'Install two new ceiling fans in bedrooms, replacing existing light fixtures. Wiring in place.',
    category: 'Electrical',
    urgency: 'low',
    budgetMin: 200,
    budgetMax: 450,
    distanceMiles: 11.2,
    postedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.5,
    clientName: 'Rachel D.',
    status: 'available',
    dispatchScore: 80,
    address: '65 Central Ave, Rochester, NH',
    scope: 'Remove 2 existing light fixtures, install fan-rated boxes if needed, wire and mount 2 ceiling fans, test all speeds and light.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'auto-dispatch',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['ceiling_fan'],
  },
  {
    id: 'job-015',
    title: 'Fence Gate Repair + New Latch',
    description: 'Fix sagging fence gate and install new self-closing latch. Gate drags on ground when opening.',
    category: 'Exterior',
    urgency: 'medium',
    budgetMin: 250,
    budgetMax: 500,
    distanceMiles: 8.9,
    postedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.6,
    clientName: 'Maria L.',
    status: 'available',
    dispatchScore: 87,
    address: '130 Lowell Rd, Windham, NH',
    scope: 'Re-level gate post, replace hinges, plane bottom of gate for clearance, install new self-closing latch with padlock loop.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [],
    onboardingChecklist: [],
    offboardingChecklist: [],
    skill_tags: ['fence_repair', 'lock_hardware'],
  },
];

export const mockMyBids: Bid[] = [
  { id: 'bid-001', jobId: 'job-016', jobTitle: 'Closet Built-In Shelving', amount: 1800, message: 'Custom built-ins are my specialty. See portfolio for similar work.', estimatedDuration: '1 day', submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 'bid-002', jobId: 'job-017', jobTitle: 'Baseboard Replacement — 3 Rooms', amount: 950, message: 'Have matching baseboard in stock. Can do all three rooms in one day.', estimatedDuration: '1 day', submittedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 'bid-003', jobId: 'job-018', jobTitle: 'Crown Molding — Dining Room', amount: 750, message: 'Includes all materials and coping cuts. 15 years experience with crown.', estimatedDuration: '1 day', submittedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), status: 'accepted', completionDate: '2026-04-28' },
  { id: 'bid-004', jobId: 'job-019', jobTitle: 'Deck Board Replacement (8 Boards)', amount: 650, message: 'Matching composite in stock. Half-day job with cleanup.', estimatedDuration: 'Half day', submittedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), status: 'accepted', completionDate: '2026-04-30' },
  { id: 'bid-005', jobId: 'job-020a', jobTitle: 'Garage Door Trim Replacement', amount: 950, message: 'Rot-resistant PVC trim. Lifetime warranty on materials.', estimatedDuration: '1 day', submittedAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(), status: 'rejected', rejectionReason: 'Client chose lower bid' },
  { id: 'bid-006', jobId: 'job-021a', jobTitle: 'Window Casing — 4 Windows', amount: 1200, message: 'Can match existing colonial profile. Will use PVC for exterior durability.', estimatedDuration: '1 day', submittedAt: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(), status: 'rejected', rejectionReason: 'Pro unavailable on requested date' },
  { id: 'bid-007', jobId: 'job-022a', jobTitle: 'Bathroom Vanity Swap', amount: 550, message: 'Straightforward swap, will handle plumbing reconnection and caulk.', estimatedDuration: 'Half day', submittedAt: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(), status: 'rejected', rejectionReason: 'Client postponed project' },
  { id: 'bid-008', jobId: 'job-023a', jobTitle: 'Fence Staining — 120 LF', amount: 480, message: 'Will power wash first, then two coats of semi-transparent stain. Materials included.', estimatedDuration: '1 day', submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), status: 'pending_materials_review' },
];

export const mockActiveJobs: Job[] = [
  {
    id: 'job-020',
    title: 'Kitchen Faucet + Garbage Disposal Install',
    description: 'Replace kitchen faucet and install new garbage disposal unit. Existing plumbing in good shape.',
    category: 'Plumbing',
    urgency: 'medium',
    budgetMin: 350,
    budgetMax: 600,
    distanceMiles: 5.1,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.9,
    clientName: 'Karen S.',
    status: 'active',
    address: '77 Birch Hill Rd, Goffstown, NH',
    scope: 'Remove old faucet, install new Delta pull-down. Remove old disposal, install InSinkErator 1/2 HP. Test for leaks.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    skill_tags: ['faucet_fixture', 'garbage_disposal'],
    milestones: [
      { id: 'm1', title: 'Faucet Replacement', status: 'completed', dueDate: '2026-04-25', completedDate: '2026-04-25' },
      { id: 'm2', title: 'Disposal Install & Test', status: 'in_progress', dueDate: '2026-04-25' },
    ],
    onboardingChecklist: [
      { id: 'on1', label: 'Verify scope with client', completed: true },
      { id: 'on2', label: 'Confirm material delivery', completed: true },
      { id: 'on3', label: 'Take before photos', completed: true },
    ],
    offboardingChecklist: [
      { id: 'off1', label: 'Test for leaks', completed: false },
      { id: 'off2', label: 'Take completion photos', completed: false },
      { id: 'off3', label: 'Clean up job site', completed: false },
    ],
  },
  {
    id: 'job-021',
    title: 'Interior Paint — 2 Bedrooms',
    description: 'Paint two bedrooms including ceilings. Walls prepped and ready. Client provides paint.',
    category: 'Interior',
    urgency: 'low',
    budgetMin: 500,
    budgetMax: 900,
    distanceMiles: 3.4,
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.6,
    clientName: 'David M.',
    status: 'active',
    address: '302 Summit Dr, Bedford, NH',
    scope: 'Cut in, roll walls and ceilings for 2 bedrooms (~250 sqft each). Two coats on walls, one on ceilings. Client provides Benjamin Moore paint.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'auto-dispatch',
    skill_tags: ['interior_painting'],
    milestones: [
      { id: 'm1', title: 'Room 1 — Cut In & Roll', status: 'completed', dueDate: '2026-04-25', completedDate: '2026-04-25' },
      { id: 'm2', title: 'Room 2 — Cut In & Roll', status: 'in_progress', dueDate: '2026-04-25' },
    ],
    onboardingChecklist: [
      { id: 'on1', label: 'Verify paint colors with client', completed: true },
      { id: 'on2', label: 'Take before photos', completed: true },
    ],
    offboardingChecklist: [
      { id: 'off1', label: 'Touch-up inspection', completed: false },
      { id: 'off2', label: 'Take completion photos', completed: false },
    ],
  },
  {
    id: 'job-022',
    title: 'Smart Lock + Doorbell Camera Install',
    description: 'Install Schlage Encode smart lock on front door and Ring doorbell camera. Connect both to Wi-Fi.',
    category: 'Smart Home',
    urgency: 'low',
    budgetMin: 150,
    budgetMax: 350,
    distanceMiles: 2.4,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.3,
    clientName: 'Nancy L.',
    status: 'active',
    address: '19 Central St, Manchester, NH',
    scope: 'Remove existing deadbolt, install Schlage Encode, program 4 user codes. Mount Ring doorbell, run low-voltage wire, connect to app.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'auto-dispatch',
    skill_tags: ['lock_hardware', 'doorbell_camera', 'smart_devices'],
    milestones: [
      { id: 'm1', title: 'Smart Lock Install', status: 'completed', dueDate: '2026-04-25', completedDate: '2026-04-25' },
      { id: 'm2', title: 'Doorbell Camera + Setup', status: 'in_progress', dueDate: '2026-04-25' },
    ],
    onboardingChecklist: [
      { id: 'on1', label: 'Verify scope with client', completed: true },
      { id: 'on2', label: 'Take before photos', completed: true },
    ],
    offboardingChecklist: [
      { id: 'off1', label: 'Test all access codes', completed: false },
      { id: 'off2', label: 'Take completion photos', completed: false },
    ],
  },
  {
    id: 'job-023',
    title: 'Deck Board Replacement (6 Boards)',
    description: 'Replace 6 cracked composite deck boards and sand transitions. Boards on-site.',
    category: 'Carpentry',
    urgency: 'low',
    budgetMin: 300,
    budgetMax: 600,
    distanceMiles: 7.3,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.7,
    clientName: 'Diane R.',
    status: 'active',
    address: '89 Elm Terrace, Nashua, NH',
    scope: 'Remove 6 cracked Trex boards, install matching replacements, sand and blend edges. Materials on-site.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    skill_tags: ['deck_repair'],
    milestones: [
      { id: 'm1', title: 'Remove Damaged Boards', status: 'completed', dueDate: '2026-04-25', completedDate: '2026-04-25' },
      { id: 'm2', title: 'Install Replacements', status: 'in_progress', dueDate: '2026-04-25' },
      { id: 'm3', title: 'Sand & Blend', status: 'pending', dueDate: '2026-04-25' },
    ],
    onboardingChecklist: [
      { id: 'on1', label: 'Verify scope with client', completed: true },
      { id: 'on2', label: 'Confirm materials match', completed: true },
    ],
    offboardingChecklist: [
      { id: 'off1', label: 'Final walkthrough with client', completed: false },
      { id: 'off2', label: 'Take completion photos', completed: false },
    ],
  },
];

export const mockCompletedJobs: Job[] = [
  {
    id: 'job-030',
    title: 'Bathroom Exhaust Fan Replacement',
    description: 'Replace noisy bathroom exhaust fan with quiet Panasonic WhisperCeiling unit.',
    category: 'Electrical',
    urgency: 'low',
    budgetMin: 200,
    budgetMax: 400,
    distanceMiles: 5.2,
    postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 5.0,
    clientName: 'Patricia G.',
    status: 'completed',
    ratingReceived: 5,
    reviewText: 'Marcus was in and out in two hours. Fan is whisper quiet now. Excellent work.',
    address: '45 Lakewood Dr, Hooksett, NH',
    scope: 'Remove old fan, install Panasonic FV-0811VF5 with existing ductwork. Test airflow.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    skill_tags: ['ceiling_fan'],
    milestones: [
      { id: 'm1', title: 'Remove old fan', status: 'completed', dueDate: '2026-04-10', completedDate: '2026-04-10' },
      { id: 'm2', title: 'Install & test new fan', status: 'completed', dueDate: '2026-04-10', completedDate: '2026-04-10' },
    ],
    onboardingChecklist: [],
    offboardingChecklist: [],
  },
  {
    id: 'job-031',
    title: 'TV Mount + Surround Sound Setup',
    description: 'Wall mount 75" TV and set up 5.1 surround sound system in living room.',
    category: 'Smart Home',
    urgency: 'low',
    budgetMin: 300,
    budgetMax: 550,
    distanceMiles: 4.8,
    postedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.7,
    clientName: 'Greg W.',
    status: 'completed',
    ratingReceived: 5,
    reviewText: 'Clean cable management and the surround sound is incredible. Very professional.',
    address: '67 Pinecrest Rd, Bedford, NH',
    scope: 'Mount 75" Samsung on full-motion bracket. Run cables in-wall. Wire 5 speakers + subwoofer. Program receiver.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    skill_tags: ['tv_projector_mount', 'surround_sound'],
    milestones: [
      { id: 'm1', title: 'TV mount + cable run', status: 'completed', dueDate: '2026-04-04', completedDate: '2026-04-04' },
      { id: 'm2', title: 'Speaker install + calibrate', status: 'completed', dueDate: '2026-04-04', completedDate: '2026-04-04' },
    ],
    onboardingChecklist: [],
    offboardingChecklist: [],
  },
  {
    id: 'job-032',
    title: 'Gutter Guard Installation',
    description: 'Install micro-mesh gutter guards on entire house. Approximately 160 LF.',
    category: 'Exterior',
    urgency: 'low',
    budgetMin: 400,
    budgetMax: 800,
    distanceMiles: 7.0,
    postedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.4,
    clientName: 'Ben K.',
    status: 'completed',
    ratingReceived: 4,
    reviewText: 'Good work. One section needed re-securing after a storm but Marcus came back same day.',
    address: '220 Lake Ave, Manchester, NH',
    scope: 'Clean all gutters, install LeafFilter-style micro-mesh guards on 160 LF. Secure with stainless screws.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    skill_tags: ['gutter_cleaning', 'gutter_install'],
    milestones: [
      { id: 'm1', title: 'Clean gutters', status: 'completed', dueDate: '2026-03-28', completedDate: '2026-03-28' },
      { id: 'm2', title: 'Install guards', status: 'completed', dueDate: '2026-03-28', completedDate: '2026-03-28' },
    ],
    onboardingChecklist: [],
    offboardingChecklist: [],
  },
  {
    id: 'job-033',
    title: 'Drywall Repair + Texture Match',
    description: 'Repair 3 drywall holes from old TV mounts and match existing orange peel texture.',
    category: 'Interior',
    urgency: 'low',
    budgetMin: 200,
    budgetMax: 450,
    distanceMiles: 3.5,
    postedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.8,
    clientName: 'Amy C.',
    status: 'completed',
    ratingReceived: 5,
    reviewText: 'You cannot tell where the patches are. Perfect texture match. Highly recommend.',
    address: '15 Orchard Hill, Goffstown, NH',
    scope: 'Patch 3 holes (2 large anchor holes, 1 fist-sized), skim coat, match orange peel texture, prime and paint.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'auto-dispatch',
    skill_tags: ['drywall_repair', 'texture_skim', 'interior_painting'],
    milestones: [
      { id: 'm1', title: 'Patch & mud', status: 'completed', dueDate: '2026-03-20', completedDate: '2026-03-20' },
      { id: 'm2', title: 'Texture, prime & paint', status: 'completed', dueDate: '2026-03-20', completedDate: '2026-03-20' },
    ],
    onboardingChecklist: [],
    offboardingChecklist: [],
  },
  {
    id: 'job-034',
    title: 'Laminate Flooring — Bedroom',
    description: 'Install click-lock laminate flooring in one 12x14 bedroom. Includes transitions and baseboards.',
    category: 'Flooring',
    urgency: 'low',
    budgetMin: 500,
    budgetMax: 900,
    distanceMiles: 6.1,
    postedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.6,
    clientName: 'Frank H.',
    status: 'completed',
    ratingReceived: 4,
    reviewText: 'Floor looks great. Transitions are clean. Would have liked more communication during the day.',
    address: '128 River View Terrace, Goffstown, NH',
    scope: 'Remove old carpet, install underlayment, lay Pergo click-lock laminate in 12x14 room. Install quarter-round and transitions.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    skill_tags: ['laminate_vinyl', 'trim_baseboard'],
    milestones: [
      { id: 'm1', title: 'Demo carpet + prep', status: 'completed', dueDate: '2026-03-14', completedDate: '2026-03-14' },
      { id: 'm2', title: 'Install laminate', status: 'completed', dueDate: '2026-03-14', completedDate: '2026-03-14' },
      { id: 'm3', title: 'Transitions + baseboards', status: 'completed', dueDate: '2026-03-14', completedDate: '2026-03-14' },
    ],
    onboardingChecklist: [],
    offboardingChecklist: [],
  },
];

export const mockActivity: ActivityItem[] = [
  { id: 'a1', type: 'dispatch', title: 'New Dispatch', description: 'Emergency pipe burst repair — 4.2 mi away', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: 'a2', type: 'bid_accepted', title: 'Bid Accepted', description: 'Crown Molding — Whole House', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'a3', type: 'payment', title: 'Payment Received', description: 'Window Trim Replacement — 8 Windows', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), amount: 2850 },
  { id: 'a4', type: 'rating', title: 'New Rating', description: 'Patricia G. left a 5-star review', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), rating: 5 },
  { id: 'a5', type: 'bid_rejected', title: 'Bid Not Selected', description: 'Garage Door Trim Replacement', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 'a6', type: 'job_completed', title: 'Job Completed', description: 'Basement Waterproofing — Interior', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
  { id: 'a7', type: 'payment', title: 'Payment Received', description: 'Basement Waterproofing — Interior', timestamp: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(), amount: 6400 },
];

export const mockTransactions: Transaction[] = [
  { id: 'tx-001', date: '2026-04-11', jobTitle: 'Window Trim Replacement', grossAmount: 3000, commission: 150, netAmount: 2850, status: 'released' },
  { id: 'tx-002', date: '2026-04-08', jobTitle: 'Basement Waterproofing', grossAmount: 6800, commission: 400, netAmount: 6400, status: 'released' },
  { id: 'tx-003', date: '2026-04-05', jobTitle: 'Drywall Patch (deposit)', grossAmount: 500, commission: 25, netAmount: 475, status: 'released' },
  { id: 'tx-004', date: '2026-04-02', jobTitle: 'Crown Molding Install', grossAmount: 3500, commission: 175, netAmount: 3325, status: 'pending' },
  { id: 'tx-005', date: '2026-03-28', jobTitle: 'Closet Shelving', grossAmount: 1800, commission: 90, netAmount: 1710, status: 'released' },
  { id: 'tx-006', date: '2026-03-22', jobTitle: 'Deck Board Replacement', grossAmount: 2200, commission: 110, netAmount: 2090, status: 'released' },
  { id: 'tx-007', date: '2026-03-15', jobTitle: 'Kitchen Cabinet Adjust', grossAmount: 800, commission: 40, netAmount: 760, status: 'released' },
  { id: 'tx-008', date: '2026-03-10', jobTitle: 'Fence Gate Repair', grossAmount: 450, commission: 22.50, netAmount: 427.50, status: 'released' },
];

export const mockMonthlyEarnings: MonthlyEarning[] = [
  { month: 'Oct', amount: 3200 },
  { month: 'Nov', amount: 4800 },
  { month: 'Dec', amount: 2100 },
  { month: 'Jan', amount: 5600 },
  { month: 'Feb', amount: 7200 },
  { month: 'Mar', amount: 9100 },
  { month: 'Apr', amount: 8450 },
];

export const mockCommissionTier: CommissionTier = {
  currentTier: 'Silver',
  currentRate: 5,
  nextTier: 'Gold',
  nextRate: 3,
  amountToNext: 16550,
  totalEarned: 33450,
};

export const mockEarningsSummary = {
  thisWeek: 2850,
  thisMonth: 8450,
  thisYear: 33450,
  allTime: 67800,
};
