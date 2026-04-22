// Mock data for client dashboard pages
// Realistic sample data for the Sherpa Pros construction marketplace

export interface Job {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  status: 'draft' | 'open' | 'bidding' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  budget: { min: number; max: number };
  urgency: 'emergency' | 'standard' | 'flexible';
  description: string;
  location: string;
  postedAt: string;
  bidsCount: number;
  assignedPro?: Pro;
  nextMilestone?: string;
  milestones?: Milestone[];
  photos?: string[];
  rated?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'paid';
}

export interface Pro {
  id: string;
  name: string;
  avatar: string;
  badge: 'gold' | 'silver' | 'bronze' | 'new';
  rating: number;
  reviewCount: number;
  trades: string[];
  distance: string;
  completedJobs: number;
  responseTime: string;
  backgroundChecked: boolean;
  available: boolean;
}

export interface Bid {
  id: string;
  pro: Pro;
  amount: number;
  message: string;
  submittedAt: string;
  estimatedDays: number;
  wisdomValidation: 'verified' | 'above_market' | 'below_market';
  recommended: boolean;
}

export interface Activity {
  id: string;
  type: 'bid_received' | 'pro_assigned' | 'milestone_completed' | 'payment_released' | 'job_posted' | 'message';
  title: string;
  description: string;
  timestamp: string;
  jobId?: string;
}

export interface JobCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  avgBudget: { min: number; max: number };
}

// ─── Categories ───────────────────────────────────────────────────

export const JOB_CATEGORIES: JobCategory[] = [
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', description: 'Pipes, fixtures, water heaters, drains', avgBudget: { min: 150, max: 2500 } },
  { id: 'electrical', name: 'Electrical', icon: '⚡', description: 'Wiring, outlets, panels, lighting', avgBudget: { min: 200, max: 3000 } },
  { id: 'carpentry', name: 'Carpentry', icon: '🪚', description: 'Framing, trim, custom woodwork', avgBudget: { min: 300, max: 5000 } },
  { id: 'painting', name: 'Painting', icon: '🎨', description: 'Interior, exterior, staining', avgBudget: { min: 200, max: 4000 } },
  { id: 'hvac', name: 'HVAC', icon: '❄️', description: 'Heating, cooling, ventilation, ductwork', avgBudget: { min: 300, max: 8000 } },
  { id: 'roofing', name: 'Roofing', icon: '🏠', description: 'Shingles, repairs, gutters, flashing', avgBudget: { min: 500, max: 15000 } },
  { id: 'landscaping', name: 'Landscaping', icon: '🌿', description: 'Lawn care, gardens, hardscaping', avgBudget: { min: 200, max: 10000 } },
  { id: 'flooring', name: 'Flooring', icon: '🪵', description: 'Hardwood, tile, vinyl, carpet', avgBudget: { min: 500, max: 8000 } },
  { id: 'concrete', name: 'Concrete', icon: '🧱', description: 'Driveways, patios, foundations, steps', avgBudget: { min: 1000, max: 12000 } },
  { id: 'drywall', name: 'Drywall', icon: '🔨', description: 'Installation, repair, finishing', avgBudget: { min: 200, max: 4000 } },
  { id: 'tile', name: 'Tile', icon: '🔲', description: 'Bathroom, kitchen, backsplash, floor', avgBudget: { min: 400, max: 6000 } },
  { id: 'siding', name: 'Siding', icon: '🏗️', description: 'Vinyl, wood, fiber cement repair', avgBudget: { min: 1000, max: 15000 } },
  { id: 'windows-doors', name: 'Windows & Doors', icon: '🪟', description: 'Installation, replacement, repair', avgBudget: { min: 300, max: 5000 } },
  { id: 'insulation', name: 'Insulation', icon: '🧤', description: 'Attic, walls, spray foam, blown-in', avgBudget: { min: 500, max: 4000 } },
  { id: 'demolition', name: 'Demolition', icon: '💥', description: 'Tear-outs, removals, clean-up', avgBudget: { min: 300, max: 5000 } },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', description: 'Post-construction, deep clean, move-out', avgBudget: { min: 100, max: 1000 } },
  { id: 'moving', name: 'Moving', icon: '📦', description: 'Local moves, heavy lifting, assembly', avgBudget: { min: 200, max: 2000 } },
  { id: 'appliance', name: 'Appliance', icon: '🔌', description: 'Installation, repair, maintenance', avgBudget: { min: 100, max: 800 } },
  { id: 'handyman', name: 'General Handyman', icon: '🛠️', description: 'Odd jobs, repairs, small projects', avgBudget: { min: 75, max: 500 } },
  { id: 'fencing', name: 'Fencing', icon: '🏡', description: 'Wood, vinyl, chain-link, repair', avgBudget: { min: 500, max: 8000 } },
  { id: 'decks', name: 'Decks', icon: '🪜', description: 'Build, repair, staining, railing', avgBudget: { min: 1000, max: 15000 } },
  { id: 'gutters', name: 'Gutters', icon: '🌧️', description: 'Install, clean, repair, guards', avgBudget: { min: 150, max: 2000 } },
  { id: 'pressure-washing', name: 'Pressure Washing', icon: '💦', description: 'Decks, siding, driveways, patios', avgBudget: { min: 100, max: 500 } },
  { id: 'snow-removal', name: 'Snow Removal', icon: '❄️', description: 'Plowing, shoveling, salting, ice dams', avgBudget: { min: 50, max: 500 } },
  { id: 'tree-service', name: 'Tree Service', icon: '🌳', description: 'Trimming, removal, stump grinding', avgBudget: { min: 200, max: 3000 } },
  { id: 'pest-control', name: 'Pest Control', icon: '🐛', description: 'Termites, rodents, insects, wildlife', avgBudget: { min: 100, max: 1000 } },
  { id: 'security', name: 'Security', icon: '🔒', description: 'Cameras, alarms, locks, access control', avgBudget: { min: 200, max: 3000 } },
  { id: 'smart-home', name: 'Smart Home', icon: '📱', description: 'Automation, wiring, thermostats, speakers', avgBudget: { min: 150, max: 2000 } },
];

// ─── Mock Pros ────────────────────────────────────────────────────

export const MOCK_PROS: Pro[] = [
  {
    id: 'pro-1',
    name: 'Mike Rodriguez',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'gold',
    rating: 4.9,
    reviewCount: 127,
    trades: ['Plumbing', 'HVAC'],
    distance: '2.3 mi',
    completedJobs: 234,
    responseTime: '< 1 hour',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-2',
    name: 'Sarah Chen',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'gold',
    rating: 4.8,
    reviewCount: 89,
    trades: ['Electrical', 'Smart Home'],
    distance: '3.1 mi',
    completedJobs: 156,
    responseTime: '< 2 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-3',
    name: 'Tom Bradley',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'silver',
    rating: 4.7,
    reviewCount: 64,
    trades: ['Carpentry', 'Decks', 'Fencing'],
    distance: '4.5 mi',
    completedJobs: 98,
    responseTime: '< 3 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-4',
    name: 'Ana Morales',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'silver',
    rating: 4.6,
    reviewCount: 45,
    trades: ['Painting', 'Drywall'],
    distance: '1.8 mi',
    completedJobs: 78,
    responseTime: '< 1 hour',
    backgroundChecked: true,
    available: false,
  },
  {
    id: 'pro-5',
    name: 'James Wilson',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'bronze',
    rating: 4.4,
    reviewCount: 23,
    trades: ['General Handyman', 'Pressure Washing'],
    distance: '5.2 mi',
    completedJobs: 45,
    responseTime: '< 4 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-6',
    name: 'David Park',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'gold',
    rating: 4.9,
    reviewCount: 201,
    trades: ['Roofing', 'Siding', 'Gutters'],
    distance: '6.0 mi',
    completedJobs: 312,
    responseTime: '< 2 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-7',
    name: 'Lisa Thompson',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'new',
    rating: 5.0,
    reviewCount: 4,
    trades: ['Cleaning', 'Moving'],
    distance: '0.8 mi',
    completedJobs: 8,
    responseTime: '< 30 min',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-8',
    name: 'Roberto Diaz',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'silver',
    rating: 4.5,
    reviewCount: 56,
    trades: ['Flooring', 'Tile', 'Carpentry'],
    distance: '3.7 mi',
    completedJobs: 112,
    responseTime: '< 2 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-9',
    name: 'Kevin O\'Brien',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'gold',
    rating: 4.8,
    reviewCount: 134,
    trades: ['Landscaping', 'Fencing', 'Concrete'],
    distance: '2.9 mi',
    completedJobs: 198,
    responseTime: '< 2 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-10',
    name: 'Maria Gonzalez',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'silver',
    rating: 4.6,
    reviewCount: 42,
    trades: ['Landscaping', 'Tree Service'],
    distance: '5.8 mi',
    completedJobs: 67,
    responseTime: '< 3 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-11',
    name: 'Derek Thornton',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'bronze',
    rating: 4.3,
    reviewCount: 18,
    trades: ['Landscaping', 'Snow Removal'],
    distance: '7.1 mi',
    completedJobs: 32,
    responseTime: '< 4 hours',
    backgroundChecked: true,
    available: false,
  },
  {
    id: 'pro-12',
    name: 'Hank Petersen',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'gold',
    rating: 4.9,
    reviewCount: 178,
    trades: ['General Contractor', 'Carpentry', 'Concrete'],
    distance: '4.2 mi',
    completedJobs: 287,
    responseTime: '< 1 hour',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-13',
    name: 'Nate Simmons',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'silver',
    rating: 4.7,
    reviewCount: 61,
    trades: ['General Contractor', 'Demolition'],
    distance: '6.5 mi',
    completedJobs: 93,
    responseTime: '< 2 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-14',
    name: 'Paul Dubois',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'bronze',
    rating: 4.4,
    reviewCount: 29,
    trades: ['Masonry', 'Concrete'],
    distance: '8.3 mi',
    completedJobs: 54,
    responseTime: '< 4 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-15',
    name: 'Rick Salazar',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'silver',
    rating: 4.5,
    reviewCount: 37,
    trades: ['Insulation', 'Drywall'],
    distance: '3.4 mi',
    completedJobs: 71,
    responseTime: '< 3 hours',
    backgroundChecked: true,
    available: true,
  },
  {
    id: 'pro-16',
    name: 'Yuki Tanaka',
    avatar: '/icons/avatar-placeholder.svg',
    badge: 'new',
    rating: 5.0,
    reviewCount: 7,
    trades: ['Smart Home', 'Security'],
    distance: '1.2 mi',
    completedJobs: 12,
    responseTime: '< 1 hour',
    backgroundChecked: true,
    available: true,
  },
];

// ─── Mock Jobs ────────────────────────────────────────────────────

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Kitchen faucet leaking — needs replacement',
    category: 'Plumbing',
    categoryIcon: '🔧',
    status: 'in_progress',
    budget: { min: 150, max: 400 },
    urgency: 'standard',
    description: 'Kitchen faucet has been dripping for a week. Likely needs a full replacement. Single-handle faucet, standard sink.',
    location: '45 Maple St, Concord, NH',
    postedAt: '2026-04-10T14:30:00Z',
    bidsCount: 4,
    assignedPro: MOCK_PROS[0],
    nextMilestone: 'Faucet installation',
    milestones: [
      { id: 'm1', title: 'Assessment & parts ordering', amount: 75, status: 'paid' },
      { id: 'm2', title: 'Faucet installation', amount: 200, status: 'in_progress' },
      { id: 'm3', title: 'Final inspection & cleanup', amount: 75, status: 'pending' },
    ],
  },
  {
    id: 'job-2',
    title: 'Install ceiling fan in master bedroom',
    category: 'Electrical',
    categoryIcon: '⚡',
    status: 'bidding',
    budget: { min: 200, max: 500 },
    urgency: 'flexible',
    description: 'Want to install a ceiling fan where there is currently a standard light fixture. Fan already purchased.',
    location: '45 Maple St, Concord, NH',
    postedAt: '2026-04-11T09:00:00Z',
    bidsCount: 3,
  },
  {
    id: 'job-3',
    title: 'Paint living room and hallway',
    category: 'Painting',
    categoryIcon: '🎨',
    status: 'open',
    budget: { min: 800, max: 1500 },
    urgency: 'flexible',
    description: 'Living room is approx 16x20, hallway is about 30 ft long. Walls and trim. We\'ll supply the paint.',
    location: '45 Maple St, Concord, NH',
    postedAt: '2026-04-12T08:00:00Z',
    bidsCount: 0,
  },
  {
    id: 'job-4',
    title: 'Fix garage door — won\'t close fully',
    category: 'General Handyman',
    categoryIcon: '🛠️',
    status: 'completed',
    budget: { min: 100, max: 300 },
    urgency: 'standard',
    description: 'Garage door stops about 6 inches from the ground and reverses. Sensors look aligned but something is off.',
    location: '45 Maple St, Concord, NH',
    postedAt: '2026-04-01T10:00:00Z',
    bidsCount: 5,
    assignedPro: MOCK_PROS[4],
    rated: true,
    milestones: [
      { id: 'm1', title: 'Diagnosis', amount: 50, status: 'paid' },
      { id: 'm2', title: 'Repair & adjustment', amount: 150, status: 'paid' },
    ],
  },
  {
    id: 'job-5',
    title: 'Deck staining — 400 sq ft composite deck',
    category: 'Decks',
    categoryIcon: '🪜',
    status: 'completed',
    budget: { min: 500, max: 1200 },
    urgency: 'flexible',
    description: 'Composite deck needs cleaning and staining before summer. Approx 400 sq ft with railing.',
    location: '45 Maple St, Concord, NH',
    postedAt: '2026-03-15T12:00:00Z',
    bidsCount: 6,
    assignedPro: MOCK_PROS[2],
    rated: false,
    milestones: [
      { id: 'm1', title: 'Power wash & prep', amount: 300, status: 'paid' },
      { id: 'm2', title: 'Staining & finish', amount: 600, status: 'paid' },
    ],
  },
  {
    id: 'job-6',
    title: 'Emergency: Burst pipe in basement',
    category: 'Plumbing',
    categoryIcon: '🔧',
    status: 'completed',
    budget: { min: 500, max: 2000 },
    urgency: 'emergency',
    description: 'Pipe burst in the basement. Water is shut off but there is standing water. Need emergency repair ASAP.',
    location: '45 Maple St, Concord, NH',
    postedAt: '2026-03-28T22:00:00Z',
    bidsCount: 2,
    assignedPro: MOCK_PROS[0],
    rated: true,
    milestones: [
      { id: 'm1', title: 'Emergency response & shutoff', amount: 300, status: 'paid' },
      { id: 'm2', title: 'Pipe repair', amount: 800, status: 'paid' },
      { id: 'm3', title: 'Water cleanup & inspection', amount: 400, status: 'paid' },
    ],
  },
  {
    id: 'job-7',
    title: 'Retaining wall — stone veneer, 40 linear ft',
    category: 'Masonry',
    categoryIcon: '\uD83E\uDDF1',
    status: 'open',
    budget: { min: 3000, max: 8000 },
    urgency: 'flexible',
    description: 'Need a retaining wall along the backyard slope. Prefer natural stone veneer look. Approx 40 linear ft, 3 ft average height.',
    location: '12 Granite Way, Dover, NH',
    postedAt: '2026-04-13T10:00:00Z',
    bidsCount: 0,
  },
  {
    id: 'job-8',
    title: 'Landscape design — front yard overhaul',
    category: 'Landscaping',
    categoryIcon: '\uD83C\uDF3F',
    status: 'in_progress',
    budget: { min: 2000, max: 5000 },
    urgency: 'standard',
    description: 'Remove overgrown shrubs, install new plantings, mulch beds, and add landscape lighting along walkway.',
    location: '45 Maple St, Concord, NH',
    postedAt: '2026-04-08T09:00:00Z',
    bidsCount: 3,
    assignedPro: MOCK_PROS[8], // Kevin O'Brien
    nextMilestone: 'Planting & mulch',
    milestones: [
      { id: 'm1', title: 'Removal & grading', amount: 800, status: 'paid' },
      { id: 'm2', title: 'Planting & mulch', amount: 1500, status: 'in_progress' },
      { id: 'm3', title: 'Lighting & cleanup', amount: 700, status: 'pending' },
    ],
  },
  {
    id: 'job-9',
    title: 'Cancelled: Attic insulation blow-in',
    category: 'Insulation',
    categoryIcon: '\uD83E\uDDE4',
    status: 'cancelled',
    budget: { min: 1500, max: 3000 },
    urgency: 'flexible',
    description: 'Was going to do blown-in cellulose insulation in the attic. Decided to defer to next year.',
    location: '45 Maple St, Concord, NH',
    postedAt: '2026-03-20T14:00:00Z',
    bidsCount: 2,
  },
];

// ─── Mock Bids ────────────────────────────────────────────────────

export const MOCK_BIDS: Record<string, Bid[]> = {
  'job-2': [
    {
      id: 'bid-1',
      pro: MOCK_PROS[1],
      amount: 350,
      message: 'I can install your ceiling fan this week. I\'ve done hundreds of fan installations and always make sure the wiring is up to code. Price includes mounting, wiring, and testing.',
      submittedAt: '2026-04-11T11:00:00Z',
      estimatedDays: 1,
      wisdomValidation: 'verified',
      recommended: true,
    },
    {
      id: 'bid-2',
      pro: MOCK_PROS[4],
      amount: 275,
      message: 'Happy to help with the fan install. I can come by Saturday morning. Straightforward job if there\'s existing wiring.',
      submittedAt: '2026-04-11T13:30:00Z',
      estimatedDays: 1,
      wisdomValidation: 'verified',
      recommended: false,
    },
    {
      id: 'bid-3',
      pro: MOCK_PROS[7],
      amount: 550,
      message: 'I can install the fan and also check all bedroom electrical while I\'m there. Includes a full safety inspection of the circuit.',
      submittedAt: '2026-04-11T15:00:00Z',
      estimatedDays: 1,
      wisdomValidation: 'above_market',
      recommended: false,
    },
  ],
};

// ─── Mock Activity ────────────────────────────────────────────────

export const MOCK_ACTIVITY: Activity[] = [
  {
    id: 'act-1',
    type: 'job_posted',
    title: 'Job posted',
    description: 'Paint living room and hallway is now live',
    timestamp: '2026-04-12T08:00:00Z',
    jobId: 'job-3',
  },
  {
    id: 'act-2',
    type: 'bid_received',
    title: 'New bid received',
    description: 'Roberto Diaz bid $550 on ceiling fan installation',
    timestamp: '2026-04-11T15:00:00Z',
    jobId: 'job-2',
  },
  {
    id: 'act-3',
    type: 'bid_received',
    title: 'New bid received',
    description: 'James Wilson bid $275 on ceiling fan installation',
    timestamp: '2026-04-11T13:30:00Z',
    jobId: 'job-2',
  },
  {
    id: 'act-4',
    type: 'milestone_completed',
    title: 'Milestone completed',
    description: 'Assessment & parts ordering — Kitchen faucet',
    timestamp: '2026-04-11T10:00:00Z',
    jobId: 'job-1',
  },
  {
    id: 'act-5',
    type: 'pro_assigned',
    title: 'Pro assigned',
    description: 'Mike Rodriguez accepted your kitchen faucet job',
    timestamp: '2026-04-10T16:00:00Z',
    jobId: 'job-1',
  },
  {
    id: 'act-6',
    type: 'payment_released',
    title: 'Payment released',
    description: '$75 released to Mike Rodriguez for assessment',
    timestamp: '2026-04-11T10:05:00Z',
    jobId: 'job-1',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────

export function getJobsByStatus(status: Job['status']): Job[] {
  return MOCK_JOBS.filter((j) => j.status === status);
}

export function getActiveJobs(): Job[] {
  return MOCK_JOBS.filter((j) => ['open', 'bidding', 'in_progress', 'assigned'].includes(j.status));
}

export function getCompletedJobs(): Job[] {
  return MOCK_JOBS.filter((j) => j.status === 'completed');
}

export function getJobsWithBids(): Job[] {
  return MOCK_JOBS.filter((j) => j.bidsCount > 0 && ['open', 'bidding'].includes(j.status));
}

export function getJobById(id: string): Job | undefined {
  return MOCK_JOBS.find((j) => j.id === id);
}

export function getBidsForJob(jobId: string): Bid[] {
  return MOCK_BIDS[jobId] ?? [];
}

export function formatBudget(budget: { min: number; max: number }): string {
  return `$${budget.min.toLocaleString()} – $${budget.max.toLocaleString()}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const CLIENT_STATS = {
  activeProjects: getActiveJobs().length,
  completedProjects: getCompletedJobs().length,
  escrowBalance: 275, // sum of in_progress milestone amounts
};
