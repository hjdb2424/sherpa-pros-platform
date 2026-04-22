// Re-export shared types from the web app
export type {
  MockProLocation,
  MockJobLocation,
  MockRoute,
} from '../../src/lib/mock-data/map-data';

export { MOCK_PROS, MOCK_JOBS, DEFAULT_CENTER, MOCK_DISPATCH_ROUTE } from '../../src/lib/mock-data/map-data';

// Re-export service area config
export { SERVICE_AREA, isWithinServiceArea, distanceFromCenter } from '../../src/lib/config/service-area';

export type { ClientTier, FeeBreakdown } from '../../src/lib/pricing/fee-calculator';
export { calculateFeeBreakdown, formatCents } from '../../src/lib/pricing/fee-calculator';
