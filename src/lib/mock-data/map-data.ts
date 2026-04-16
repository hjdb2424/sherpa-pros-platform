export interface MockProLocation {
  id: string;
  name: string;
  initials: string;
  trade: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  verified: boolean;
  distance: string;
  responseTime: string;
  jobsCompleted: number;
}

export interface MockJobLocation {
  id: string;
  title: string;
  category: string;
  budget: number;
  urgency: 'emergency' | 'standard' | 'flexible';
  lat: number;
  lng: number;
  distance: string;
  postedAgo: string;
}

export interface MockRoute {
  proStart: { lat: number; lng: number };
  clientLocation: { lat: number; lng: number };
  etaMinutes: number;
  distanceMiles: number;
}

// Portsmouth, NH area — default hub center
export const DEFAULT_CENTER = { lat: 43.0718, lng: -70.7626 };
export const DEFAULT_ZOOM = 12;

export const MOCK_PROS: MockProLocation[] = [
  { id: 'pro-1', name: 'Mike Rodriguez', initials: 'MR', trade: 'Plumber', rating: 4.9, reviewCount: 142, lat: 43.0766, lng: -70.7581, verified: true, distance: '0.3 mi', responseTime: '< 1 hr', jobsCompleted: 47 },
  { id: 'pro-2', name: 'Sarah Chen', initials: 'SC', trade: 'Electrician', rating: 4.8, reviewCount: 98, lat: 43.0654, lng: -70.7712, verified: true, distance: '0.8 mi', responseTime: '< 2 hr', jobsCompleted: 63 },
  { id: 'pro-3', name: 'James Wilson', initials: 'JW', trade: 'HVAC', rating: 4.7, reviewCount: 76, lat: 43.0821, lng: -70.7445, verified: true, distance: '1.2 mi', responseTime: '< 1 hr', jobsCompleted: 35 },
  { id: 'pro-4', name: 'Maria Santos', initials: 'MS', trade: 'General Contractor', rating: 5.0, reviewCount: 201, lat: 43.0588, lng: -70.7834, verified: true, distance: '1.5 mi', responseTime: 'Same day', jobsCompleted: 89 },
  { id: 'pro-5', name: 'Tom Baker', initials: 'TB', trade: 'Roofer', rating: 4.6, reviewCount: 54, lat: 43.0903, lng: -70.7392, verified: true, distance: '2.1 mi', responseTime: '< 4 hr', jobsCompleted: 28 },
  { id: 'pro-6', name: 'Linda Park', initials: 'LP', trade: 'Painter', rating: 4.9, reviewCount: 112, lat: 43.0512, lng: -70.7956, verified: true, distance: '2.8 mi', responseTime: '< 2 hr', jobsCompleted: 71 },
  { id: 'pro-7', name: 'Dave Nelson', initials: 'DN', trade: 'Carpenter', rating: 4.5, reviewCount: 43, lat: 43.0978, lng: -70.7289, verified: true, distance: '3.4 mi', responseTime: 'Next day', jobsCompleted: 19 },
  { id: 'pro-8', name: 'Ana Rivera', initials: 'AR', trade: 'Plumber', rating: 4.8, reviewCount: 87, lat: 43.0445, lng: -70.8067, verified: true, distance: '3.9 mi', responseTime: '< 1 hr', jobsCompleted: 56 },
];

export const MOCK_JOBS: MockJobLocation[] = [
  { id: 'job-1', title: 'Kitchen Faucet Replacement', category: 'Plumbing', budget: 350, urgency: 'standard', lat: 43.0734, lng: -70.7598, distance: '0.4 mi', postedAgo: '2h ago' },
  { id: 'job-2', title: 'Emergency Water Heater Leak', category: 'Plumbing', budget: 800, urgency: 'emergency', lat: 43.0689, lng: -70.7656, distance: '0.6 mi', postedAgo: '15m ago' },
  { id: 'job-3', title: 'Bathroom Remodel', category: 'General', budget: 12000, urgency: 'flexible', lat: 43.0812, lng: -70.7423, distance: '1.1 mi', postedAgo: '1d ago' },
  { id: 'job-4', title: 'Panel Upgrade 100A to 200A', category: 'Electrical', budget: 2500, urgency: 'standard', lat: 43.0567, lng: -70.7801, distance: '1.7 mi', postedAgo: '5h ago' },
  { id: 'job-5', title: 'Furnace Not Heating', category: 'HVAC', budget: 600, urgency: 'emergency', lat: 43.0623, lng: -70.7734, distance: '0.9 mi', postedAgo: '30m ago' },
  { id: 'job-6', title: 'Deck Staining & Repair', category: 'Carpentry', budget: 1800, urgency: 'flexible', lat: 43.0945, lng: -70.7312, distance: '3.2 mi', postedAgo: '3d ago' },
];

export const MOCK_DISPATCH_ROUTE: MockRoute = {
  proStart: { lat: 43.0766, lng: -70.7581 },
  clientLocation: { lat: 43.0689, lng: -70.7656 },
  etaMinutes: 8,
  distanceMiles: 2.3,
};
