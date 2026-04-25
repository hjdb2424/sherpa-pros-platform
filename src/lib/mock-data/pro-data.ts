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
  status: 'pending' | 'accepted' | 'rejected';
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
  activeJobs: 3,
  pendingBids: 5,
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
  },
];

export const mockMyBids: Bid[] = [
  { id: 'bid-001', jobId: 'job-006', jobTitle: 'Basement Framing — 800 sqft', amount: 4200, message: 'Can start next Monday. Have all framing materials in stock.', estimatedDuration: '5 days', submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 'bid-002', jobId: 'job-007', jobTitle: 'Closet Built-In Shelving', amount: 1800, message: 'Custom built-ins are my specialty. See portfolio for similar work.', estimatedDuration: '2 days', submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 'bid-003', jobId: 'job-008', jobTitle: 'Crown Molding — Whole House', amount: 3500, message: 'Includes all materials and coping cuts. 15 years experience.', estimatedDuration: '3 days', submittedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), status: 'accepted' },
  { id: 'bid-004', jobId: 'job-009', jobTitle: 'Garage Door Trim Replacement', amount: 950, message: 'Rot-resistant PVC trim. Lifetime warranty on materials.', estimatedDuration: '1 day', submittedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), status: 'rejected' },
];

export const mockActiveJobs: Job[] = [
  {
    id: 'job-020',
    title: 'Master Bath Remodel — Phase 2',
    description: 'Complete tile work and vanity installation for primary bathroom renovation.',
    category: 'Remodeling',
    urgency: 'medium',
    budgetMin: 5000,
    budgetMax: 7500,
    distanceMiles: 5.1,
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.9,
    clientName: 'Karen S.',
    status: 'active',
    address: '77 Birch Hill Rd, Goffstown, NH',
    scope: 'Phase 2: Tile shower walls, install vanity and fixtures, paint.',
    photos: [],
    permitsRequired: ['Building Permit'],
    budgetVerified: true,
    type: 'bid',
    milestones: [
      { id: 'm1', title: 'Tile Installation', status: 'completed', dueDate: '2026-04-08', completedDate: '2026-04-07' },
      { id: 'm2', title: 'Vanity & Fixtures', status: 'in_progress', dueDate: '2026-04-14' },
      { id: 'm3', title: 'Paint & Finish', status: 'pending', dueDate: '2026-04-16' },
      { id: 'm4', title: 'Final Walkthrough', status: 'pending', dueDate: '2026-04-17' },
    ],
    onboardingChecklist: [
      { id: 'on1', label: 'Verify scope with client', completed: true },
      { id: 'on2', label: 'Confirm material delivery', completed: true },
      { id: 'on3', label: 'Take before photos', completed: true },
    ],
    offboardingChecklist: [
      { id: 'off1', label: 'Final walkthrough with client', completed: false },
      { id: 'off2', label: 'Take completion photos', completed: false },
      { id: 'off3', label: 'Clean up job site', completed: false },
      { id: 'off4', label: 'Submit final invoice', completed: false },
    ],
  },
  {
    id: 'job-021',
    title: 'Deck Build — Composite 500sqft',
    description: 'New composite deck with stairs and railing system.',
    category: 'Carpentry',
    urgency: 'low',
    budgetMin: 12000,
    budgetMax: 15000,
    distanceMiles: 9.8,
    postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.6,
    clientName: 'David M.',
    status: 'active',
    address: '302 Summit Dr, Bedford, NH',
    scope: 'Build 500sqft composite deck. Includes stairs, railing, and ledger board attachment.',
    photos: [],
    permitsRequired: ['Building Permit', 'Zoning Approval'],
    budgetVerified: true,
    type: 'bid',
    milestones: [
      { id: 'm1', title: 'Foundation & Posts', status: 'completed', dueDate: '2026-04-02', completedDate: '2026-04-01' },
      { id: 'm2', title: 'Framing & Joists', status: 'completed', dueDate: '2026-04-06', completedDate: '2026-04-05' },
      { id: 'm3', title: 'Decking & Stairs', status: 'in_progress', dueDate: '2026-04-14' },
      { id: 'm4', title: 'Railing & Trim', status: 'pending', dueDate: '2026-04-18' },
      { id: 'm5', title: 'Inspection & Handoff', status: 'pending', dueDate: '2026-04-20' },
    ],
    onboardingChecklist: [
      { id: 'on1', label: 'Pull building permit', completed: true },
      { id: 'on2', label: 'Call Dig Safe', completed: true },
      { id: 'on3', label: 'Verify material delivery', completed: true },
      { id: 'on4', label: 'Take before photos', completed: true },
    ],
    offboardingChecklist: [
      { id: 'off1', label: 'Schedule final inspection', completed: false },
      { id: 'off2', label: 'Final walkthrough with client', completed: false },
      { id: 'off3', label: 'Take completion photos', completed: false },
      { id: 'off4', label: 'Clean up job site', completed: false },
    ],
  },
  {
    id: 'job-022',
    title: 'Drywall Patch & Paint — 3 Rooms',
    description: 'Repair drywall damage and repaint three rooms.',
    category: 'Interior',
    urgency: 'low',
    budgetMin: 800,
    budgetMax: 1200,
    distanceMiles: 2.4,
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.3,
    clientName: 'Nancy L.',
    status: 'active',
    address: '19 Central St, Manchester, NH',
    scope: 'Patch holes (6 total), skim coat, prime and paint 3 rooms. Client selected paint colors.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'auto-dispatch',
    milestones: [
      { id: 'm1', title: 'Drywall Repair', status: 'in_progress', dueDate: '2026-04-13' },
      { id: 'm2', title: 'Prime & Paint', status: 'pending', dueDate: '2026-04-15' },
    ],
    onboardingChecklist: [
      { id: 'on1', label: 'Verify scope with client', completed: true },
      { id: 'on2', label: 'Take before photos', completed: true },
    ],
    offboardingChecklist: [
      { id: 'off1', label: 'Touch-up inspection', completed: false },
      { id: 'off2', label: 'Take completion photos', completed: false },
    ],
  },
  {
    id: 'job-023',
    title: 'Kitchen Cabinet Refacing',
    description: 'Reface existing kitchen cabinets with new doors and veneer. 22 doors total.',
    category: 'Carpentry',
    urgency: 'low',
    budgetMin: 4500,
    budgetMax: 6000,
    distanceMiles: 7.3,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.7,
    clientName: 'Diane R.',
    status: 'active',
    address: '89 Elm Terrace, Nashua, NH',
    scope: 'Remove old doors, apply new veneer to boxes, install 22 new doors and pulls.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [
      { id: 'm1', title: 'Demo old doors & prep', status: 'completed', dueDate: '2026-04-10', completedDate: '2026-04-10' },
      { id: 'm2', title: 'Veneer & new doors install', status: 'in_progress', dueDate: '2026-04-16' },
      { id: 'm3', title: 'Hardware & final touch-up', status: 'pending', dueDate: '2026-04-18' },
    ],
    onboardingChecklist: [
      { id: 'on1', label: 'Verify scope with client', completed: true },
      { id: 'on2', label: 'Confirm material delivery', completed: true },
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
    title: 'Window Trim Replacement — 8 Windows',
    description: 'Replace rotted exterior window trim on 8 windows.',
    category: 'Carpentry',
    urgency: 'medium',
    budgetMin: 2400,
    budgetMax: 3200,
    distanceMiles: 7.0,
    postedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 5.0,
    clientName: 'Patricia G.',
    status: 'completed',
    ratingReceived: 5,
    reviewText: 'Marcus did excellent work. On time, clean, and professional.',
    address: '45 Lakewood Dr, Hooksett, NH',
    scope: 'Replace all exterior window trim with PVC. Caulk and paint to match.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [
      { id: 'm1', title: 'Remove Old Trim', status: 'completed', dueDate: '2026-03-10', completedDate: '2026-03-10' },
      { id: 'm2', title: 'Install New Trim', status: 'completed', dueDate: '2026-03-12', completedDate: '2026-03-11' },
      { id: 'm3', title: 'Caulk & Paint', status: 'completed', dueDate: '2026-03-13', completedDate: '2026-03-13' },
    ],
    onboardingChecklist: [],
    offboardingChecklist: [],
  },
  {
    id: 'job-031',
    title: 'Basement Waterproofing — Interior',
    description: 'Install interior French drain and sump pump.',
    category: 'Restoration',
    urgency: 'high',
    budgetMin: 5000,
    budgetMax: 8000,
    distanceMiles: 11.3,
    postedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.0,
    clientName: 'Frank H.',
    status: 'completed',
    ratingReceived: 4,
    reviewText: 'Good work overall. Took a day longer than quoted but result is solid.',
    address: '128 River View Terrace, Goffstown, NH',
    scope: 'Jackhammer perimeter, install perforated pipe, gravel bed, sump pit and pump. Patch concrete.',
    photos: [],
    permitsRequired: ['Building Permit'],
    budgetVerified: true,
    type: 'bid',
    milestones: [
      { id: 'm1', title: 'Demo & Excavation', status: 'completed', dueDate: '2026-02-20', completedDate: '2026-02-20' },
      { id: 'm2', title: 'Drain & Sump Install', status: 'completed', dueDate: '2026-02-22', completedDate: '2026-02-23' },
      { id: 'm3', title: 'Concrete Patch', status: 'completed', dueDate: '2026-02-24', completedDate: '2026-02-25' },
    ],
    onboardingChecklist: [],
    offboardingChecklist: [],
  },
  {
    id: 'job-032',
    title: 'Deck Board Replacement — 12 Boards',
    description: 'Replace 12 warped composite deck boards and sand transitions.',
    category: 'Carpentry',
    urgency: 'low',
    budgetMin: 1200,
    budgetMax: 2000,
    distanceMiles: 4.8,
    postedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.8,
    clientName: 'Greg W.',
    status: 'completed',
    ratingReceived: 5,
    reviewText: 'Fast turnaround and the deck looks brand new. Highly recommend.',
    address: '67 Pinecrest Rd, Bedford, NH',
    scope: 'Remove 12 damaged boards, install matching replacements, sand and blend.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [
      { id: 'm1', title: 'Remove damaged boards', status: 'completed', dueDate: '2026-03-25', completedDate: '2026-03-25' },
      { id: 'm2', title: 'Install new boards', status: 'completed', dueDate: '2026-03-26', completedDate: '2026-03-26' },
    ],
    onboardingChecklist: [],
    offboardingChecklist: [],
  },
  {
    id: 'job-033',
    title: 'Emergency Roof Tarp — Storm Damage',
    description: 'Emergency tarping after tree limb punctured garage roof section.',
    category: 'Restoration',
    urgency: 'emergency',
    budgetMin: 500,
    budgetMax: 1200,
    distanceMiles: 3.5,
    postedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.5,
    clientName: 'Ben K.',
    status: 'completed',
    ratingReceived: 5,
    reviewText: 'Showed up within an hour of the storm. Saved us from serious water damage.',
    address: '220 Lake Ave, Manchester, NH',
    scope: 'Install emergency tarp over punctured roof section, remove loose debris, secure perimeter.',
    photos: [],
    permitsRequired: [],
    budgetVerified: false,
    type: 'auto-dispatch',
    milestones: [
      { id: 'm1', title: 'Emergency response', status: 'completed', dueDate: '2026-03-08', completedDate: '2026-03-08' },
      { id: 'm2', title: 'Tarp & secure', status: 'completed', dueDate: '2026-03-08', completedDate: '2026-03-08' },
    ],
    onboardingChecklist: [],
    offboardingChecklist: [],
  },
  {
    id: 'job-034',
    title: 'Closet Built-In Shelving — Walk-In',
    description: 'Custom built-in shelving system for primary walk-in closet.',
    category: 'Carpentry',
    urgency: 'low',
    budgetMin: 1500,
    budgetMax: 2200,
    distanceMiles: 6.1,
    postedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    clientRating: 4.9,
    clientName: 'Amy C.',
    status: 'completed',
    ratingReceived: 4,
    reviewText: 'Great craftsmanship. Took slightly longer than expected but the result is perfect.',
    address: '15 Orchard Hill, Goffstown, NH',
    scope: 'Design and build floor-to-ceiling shelving, double hang rods, shoe rack, and drawer unit.',
    photos: [],
    permitsRequired: [],
    budgetVerified: true,
    type: 'bid',
    milestones: [
      { id: 'm1', title: 'Measure & design', status: 'completed', dueDate: '2026-02-10', completedDate: '2026-02-10' },
      { id: 'm2', title: 'Build & install', status: 'completed', dueDate: '2026-02-14', completedDate: '2026-02-15' },
      { id: 'm3', title: 'Finish & hardware', status: 'completed', dueDate: '2026-02-16', completedDate: '2026-02-17' },
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
