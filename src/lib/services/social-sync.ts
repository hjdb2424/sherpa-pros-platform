// Social Sync Service — imports photos & reviews from Google, Instagram, Facebook, Yelp, Nextdoor
// All mock mode when no API keys are set

export type SocialPlatform = 'google' | 'instagram' | 'facebook' | 'yelp' | 'nextdoor';

export interface SocialPhoto {
  id: string;
  platform: SocialPlatform;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  postedAt: string;
  likes?: number;
  imported: boolean;
}

export interface SocialReview {
  id: string;
  platform: SocialPlatform;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number; // 1-5
  text: string;
  date: string;
  responseText?: string; // pro's reply
  imported: boolean;
  verified: boolean; // platform-verified review
}

export interface SocialConnection {
  platform: SocialPlatform;
  connected: boolean;
  accountName?: string;
  lastSynced?: string;
  photoCount?: number;
  reviewCount?: number;
  avgRating?: number;
}

// ---------------------------------------------------------------------------
// In-memory state (mock)
// ---------------------------------------------------------------------------

const importedPhotoIds = new Set<string>();
const importedReviewIds = new Set<string>();

let connections: SocialConnection[] = [
  {
    platform: 'google',
    connected: true,
    accountName: "Mike's Plumbing",
    lastSynced: '2026-04-14T18:30:00Z',
    photoCount: 24,
    reviewCount: 18,
    avgRating: 4.8,
  },
  {
    platform: 'instagram',
    connected: true,
    accountName: '@mikesplumbing',
    lastSynced: '2026-04-14T16:00:00Z',
    photoCount: 47,
  },
  {
    platform: 'facebook',
    connected: false,
  },
  {
    platform: 'yelp',
    connected: true,
    accountName: 'Mike Rodriguez Plumbing',
    lastSynced: '2026-04-13T10:00:00Z',
    reviewCount: 12,
    avgRating: 4.7,
  },
  {
    platform: 'nextdoor',
    connected: false,
  },
];

// ---------------------------------------------------------------------------
// Mock photo data
// ---------------------------------------------------------------------------

const MOCK_PHOTOS: Record<SocialPlatform, SocialPhoto[]> = {
  google: [
    { id: 'gp-1', platform: 'google', url: 'https://picsum.photos/seed/gp1/800/600', thumbnailUrl: 'https://picsum.photos/seed/gp1/400/300', caption: 'Kitchen sink installation — before', postedAt: '2026-03-28T10:00:00Z', likes: 12, imported: false },
    { id: 'gp-2', platform: 'google', url: 'https://picsum.photos/seed/gp2/800/600', thumbnailUrl: 'https://picsum.photos/seed/gp2/400/300', caption: 'Kitchen sink installation — after', postedAt: '2026-03-28T14:00:00Z', likes: 18, imported: false },
    { id: 'gp-3', platform: 'google', url: 'https://picsum.photos/seed/gp3/800/600', thumbnailUrl: 'https://picsum.photos/seed/gp3/400/300', caption: 'Water heater replacement', postedAt: '2026-03-15T09:00:00Z', likes: 8, imported: false },
    { id: 'gp-4', platform: 'google', url: 'https://picsum.photos/seed/gp4/800/600', thumbnailUrl: 'https://picsum.photos/seed/gp4/400/300', caption: 'Bathroom remodel — copper piping', postedAt: '2026-02-20T11:00:00Z', likes: 22, imported: false },
    { id: 'gp-5', platform: 'google', url: 'https://picsum.photos/seed/gp5/800/600', thumbnailUrl: 'https://picsum.photos/seed/gp5/400/300', caption: 'Emergency pipe repair', postedAt: '2026-02-10T08:00:00Z', likes: 6, imported: false },
    { id: 'gp-6', platform: 'google', url: 'https://picsum.photos/seed/gp6/800/600', thumbnailUrl: 'https://picsum.photos/seed/gp6/400/300', caption: 'Sump pump install', postedAt: '2026-01-22T13:00:00Z', likes: 9, imported: false },
    { id: 'gp-7', platform: 'google', url: 'https://picsum.photos/seed/gp7/800/600', thumbnailUrl: 'https://picsum.photos/seed/gp7/400/300', caption: 'Whole-house re-pipe complete', postedAt: '2026-01-05T15:00:00Z', likes: 31, imported: false },
  ],
  instagram: [
    { id: 'ig-1', platform: 'instagram', url: 'https://picsum.photos/seed/ig1/800/800', thumbnailUrl: 'https://picsum.photos/seed/ig1/400/400', caption: 'Another day, another clean install. #plumbinglife', postedAt: '2026-04-10T18:00:00Z', likes: 87, imported: false },
    { id: 'ig-2', platform: 'instagram', url: 'https://picsum.photos/seed/ig2/800/800', thumbnailUrl: 'https://picsum.photos/seed/ig2/400/400', caption: 'Before and after — tankless water heater upgrade', postedAt: '2026-04-05T12:00:00Z', likes: 124, imported: false },
    { id: 'ig-3', platform: 'instagram', url: 'https://picsum.photos/seed/ig3/800/800', thumbnailUrl: 'https://picsum.photos/seed/ig3/400/400', caption: 'Custom shower valve trim. Chef\'s kiss.', postedAt: '2026-03-30T16:00:00Z', likes: 95, imported: false },
    { id: 'ig-4', platform: 'instagram', url: 'https://picsum.photos/seed/ig4/800/800', thumbnailUrl: 'https://picsum.photos/seed/ig4/400/400', caption: 'Job site sunrise. Early bird gets the wrench.', postedAt: '2026-03-22T06:30:00Z', likes: 63, imported: false },
    { id: 'ig-5', platform: 'instagram', url: 'https://picsum.photos/seed/ig5/800/800', thumbnailUrl: 'https://picsum.photos/seed/ig5/400/400', caption: 'Backflow preventer install for commercial client', postedAt: '2026-03-14T14:00:00Z', likes: 42, imported: false },
    { id: 'ig-6', platform: 'instagram', url: 'https://picsum.photos/seed/ig6/800/800', thumbnailUrl: 'https://picsum.photos/seed/ig6/400/400', caption: 'The team after finishing a 3-day whole-house', postedAt: '2026-03-06T17:00:00Z', likes: 156, imported: false },
    { id: 'ig-7', platform: 'instagram', url: 'https://picsum.photos/seed/ig7/800/800', thumbnailUrl: 'https://picsum.photos/seed/ig7/400/400', caption: 'Copper is art. Fight me.', postedAt: '2026-02-28T11:00:00Z', likes: 201, imported: false },
    { id: 'ig-8', platform: 'instagram', url: 'https://picsum.photos/seed/ig8/800/800', thumbnailUrl: 'https://picsum.photos/seed/ig8/400/400', caption: 'New van wrap just dropped', postedAt: '2026-02-14T10:00:00Z', likes: 312, imported: false },
  ],
  facebook: [],
  yelp: [],
  nextdoor: [],
};

// ---------------------------------------------------------------------------
// Mock review data
// ---------------------------------------------------------------------------

const MOCK_REVIEWS: Record<SocialPlatform, SocialReview[]> = {
  google: [
    { id: 'gr-1', platform: 'google', reviewerName: 'Sarah M.', rating: 5, text: 'Mike replaced our water heater same day. Honest pricing and clean work. Highly recommend!', date: '2026-04-08T12:00:00Z', imported: false, verified: true },
    { id: 'gr-2', platform: 'google', reviewerName: 'James K.', rating: 5, text: 'Had a burst pipe emergency at 2am. Mike answered and was here in 45 minutes. Saved us from major water damage.', date: '2026-03-29T03:00:00Z', imported: false, verified: true },
    { id: 'gr-3', platform: 'google', reviewerName: 'Linda P.', rating: 4, text: 'Good work on our bathroom remodel plumbing. Took slightly longer than quoted but the quality is excellent.', date: '2026-03-18T14:00:00Z', responseText: 'Thanks Linda! The extra day was due to a code issue we found behind the wall — wanted to make sure it was done right.', imported: false, verified: true },
    { id: 'gr-4', platform: 'google', reviewerName: 'Robert T.', rating: 5, text: 'Third time using Mike for plumbing work. Always professional, always fair pricing. Our go-to plumber now.', date: '2026-03-05T10:00:00Z', imported: false, verified: true },
    { id: 'gr-5', platform: 'google', reviewerName: 'Amanda W.', rating: 5, text: 'Installed a new garbage disposal and fixed a slow drain. In and out in under 2 hours. Very reasonable.', date: '2026-02-22T16:00:00Z', imported: false, verified: true },
    { id: 'gr-6', platform: 'google', reviewerName: 'David C.', rating: 4, text: 'Solid work replacing our sump pump. Explained everything clearly and left the area spotless.', date: '2026-02-10T11:00:00Z', imported: false, verified: true },
  ],
  yelp: [
    { id: 'yr-1', platform: 'yelp', reviewerName: 'Jennifer B.', rating: 5, text: 'FINALLY a plumber who shows up when they say they will. Mike was on time, professional, and his pricing was exactly what he quoted. No surprises. Will absolutely use again.', date: '2026-04-02T09:00:00Z', imported: false, verified: true },
    { id: 'yr-2', platform: 'yelp', reviewerName: 'Carlos R.', rating: 5, text: 'Mike installed a whole-house water filtration system for us. Incredible work — you can taste the difference. He even came back to check on it a week later.', date: '2026-03-20T15:00:00Z', imported: false, verified: true },
    { id: 'yr-3', platform: 'yelp', reviewerName: 'Patricia H.', rating: 4, text: 'Had some kitchen plumbing issues. Mike diagnosed the problem quickly and fixed it at a fair price. Only reason for 4 stars is the scheduling took a few days.', date: '2026-03-08T11:00:00Z', responseText: 'Thanks Patricia! We were slammed that week but glad we could get you taken care of.', imported: false, verified: true },
    { id: 'yr-4', platform: 'yelp', reviewerName: 'Thomas L.', rating: 5, text: 'Emergency gas line leak. Mike prioritized us and had it fixed within hours. Cannot recommend enough for anyone needing a reliable plumber in the area.', date: '2026-02-18T08:00:00Z', imported: false, verified: true },
    { id: 'yr-5', platform: 'yelp', reviewerName: 'Michelle D.', rating: 4, text: 'Replaced an old toilet and fixed a running faucet. Quick, professional, fair pricing. Good experience overall.', date: '2026-01-30T13:00:00Z', imported: false, verified: true },
  ],
  instagram: [],
  facebook: [],
  nextdoor: [],
};

// ---------------------------------------------------------------------------
// OAuth connect/disconnect (mock)
// ---------------------------------------------------------------------------

export async function connectPlatform(platform: SocialPlatform): Promise<SocialConnection> {
  // Simulate OAuth delay
  await new Promise((r) => setTimeout(r, 800));

  const mockNames: Record<SocialPlatform, string> = {
    google: "Mike's Plumbing",
    instagram: '@mikesplumbing',
    facebook: "Mike's Plumbing LLC",
    yelp: 'Mike Rodriguez Plumbing',
    nextdoor: 'Mike R. — Plumber',
  };

  const existing = connections.find((c) => c.platform === platform);
  if (existing) {
    existing.connected = true;
    existing.accountName = mockNames[platform];
    existing.lastSynced = new Date().toISOString();
    if (platform === 'facebook') {
      existing.photoCount = 15;
      existing.reviewCount = 8;
      existing.avgRating = 4.6;
    }
    if (platform === 'nextdoor') {
      existing.reviewCount = 5;
      existing.avgRating = 4.9;
    }
    return { ...existing };
  }

  const conn: SocialConnection = {
    platform,
    connected: true,
    accountName: mockNames[platform],
    lastSynced: new Date().toISOString(),
  };
  connections.push(conn);
  return conn;
}

export async function disconnectPlatform(platform: SocialPlatform): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  const conn = connections.find((c) => c.platform === platform);
  if (conn) {
    conn.connected = false;
    conn.lastSynced = undefined;
  }
}

export function getConnections(): SocialConnection[] {
  return connections.map((c) => ({ ...c }));
}

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

export async function fetchPhotos(platform: SocialPlatform): Promise<SocialPhoto[]> {
  await new Promise((r) => setTimeout(r, 400));
  const photos = MOCK_PHOTOS[platform] ?? [];
  return photos.map((p) => ({
    ...p,
    imported: importedPhotoIds.has(p.id),
  }));
}

export async function importPhotos(photoIds: string[]): Promise<{ imported: number }> {
  await new Promise((r) => setTimeout(r, 600));
  let count = 0;
  for (const id of photoIds) {
    if (!importedPhotoIds.has(id)) {
      importedPhotoIds.add(id);
      count++;
    }
  }
  return { imported: count };
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function fetchReviews(platform: SocialPlatform): Promise<SocialReview[]> {
  await new Promise((r) => setTimeout(r, 400));
  const reviews = MOCK_REVIEWS[platform] ?? [];
  return reviews.map((r) => ({
    ...r,
    imported: importedReviewIds.has(r.id),
  }));
}

export async function importReviews(reviewIds: string[]): Promise<{ imported: number }> {
  await new Promise((r) => setTimeout(r, 600));
  let count = 0;
  for (const id of reviewIds) {
    if (!importedReviewIds.has(id)) {
      importedReviewIds.add(id);
      count++;
    }
  }
  return { imported: count };
}

// ---------------------------------------------------------------------------
// Aggregate rating
// ---------------------------------------------------------------------------

export async function getAggregateRating(): Promise<{
  avg: number;
  total: number;
  byPlatform: Record<SocialPlatform, { avg: number; count: number }>;
}> {
  await new Promise((r) => setTimeout(r, 200));

  const byPlatform = {} as Record<SocialPlatform, { avg: number; count: number }>;
  let totalSum = 0;
  let totalCount = 0;

  for (const conn of connections) {
    if (conn.connected && conn.reviewCount && conn.avgRating) {
      byPlatform[conn.platform] = {
        avg: conn.avgRating,
        count: conn.reviewCount,
      };
      totalSum += conn.avgRating * conn.reviewCount;
      totalCount += conn.reviewCount;
    }
  }

  // Fill in zeros for non-connected platforms
  const allPlatforms: SocialPlatform[] = ['google', 'instagram', 'facebook', 'yelp', 'nextdoor'];
  for (const p of allPlatforms) {
    if (!byPlatform[p]) {
      byPlatform[p] = { avg: 0, count: 0 };
    }
  }

  return {
    avg: totalCount > 0 ? Math.round((totalSum / totalCount) * 10) / 10 : 0,
    total: totalCount,
    byPlatform,
  };
}
