import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';
import { parsePagination, paginationMeta } from '@/db/config/performance';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ReviewPhoto {
  id: string;
  url: string;
  alt: string;
}

export interface ProResponse {
  text: string;
  date: string;
  proName: string;
}

export interface ReviewRecord {
  id: string;
  jobId: string;
  proId: string;
  clientId: string;
  reviewerName: string;
  rating: number;
  text: string;
  date: string;
  role: 'client' | 'pro';
  projectType: string;
  verified: boolean;
  photos: ReviewPhoto[];
  response: ProResponse | null;
  helpfulCount: number;
  wouldHireAgain: boolean | null;
  tipsForOthers: string;
  status: 'published' | 'flagged' | 'removed';
}

/* ------------------------------------------------------------------ */
/*  Mock data -- 15 diverse reviews                                    */
/* ------------------------------------------------------------------ */

export const MOCK_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev-001',
    jobId: 'job-030',
    proId: 'pro-001',
    clientId: 'client-001',
    reviewerName: 'Patricia G.',
    rating: 5,
    text: 'Marcus did excellent work on our window trim. On time, clean work area, and professional throughout. Highly recommend for any finish carpentry work.',
    date: '2026-03-14T12:00:00Z',
    role: 'client',
    projectType: 'Carpentry',
    verified: true,
    photos: [
      { id: 'ph-001', url: '/mock/review-trim-1.jpg', alt: 'Completed window trim' },
      { id: 'ph-002', url: '/mock/review-trim-2.jpg', alt: 'Detail of corner joints' },
    ],
    response: {
      text: 'Thank you Patricia! It was a pleasure working with you. The trim design you chose really elevated the room.',
      date: '2026-03-15T09:00:00Z',
      proName: 'Marcus Rivera',
    },
    helpfulCount: 12,
    wouldHireAgain: true,
    tipsForOthers: 'Have your paint color picked out before the trim goes in.',
    status: 'published',
  },
  {
    id: 'rev-002',
    jobId: 'job-031',
    proId: 'pro-001',
    clientId: 'client-002',
    reviewerName: 'Frank H.',
    rating: 4,
    text: 'Good work overall on the basement waterproofing. Took a day longer than quoted but the result is solid. Would use again for similar work.',
    date: '2026-02-26T12:00:00Z',
    role: 'client',
    projectType: 'Waterproofing',
    verified: true,
    photos: [],
    response: {
      text: 'Thanks Frank. The extra day was due to unexpected moisture behind the east wall -- wanted to make sure we addressed it properly rather than cut corners.',
      date: '2026-02-27T10:30:00Z',
      proName: 'Marcus Rivera',
    },
    helpfulCount: 7,
    wouldHireAgain: true,
    tipsForOthers: '',
    status: 'published',
  },
  {
    id: 'rev-003',
    jobId: 'job-004',
    proId: 'pro-001',
    clientId: 'client-003',
    reviewerName: 'Marcus Rivera',
    rating: 5,
    text: 'Great client to work with. Clear communication about expectations and prompt with payments. The kitchen remodel scope was well-defined.',
    date: '2026-04-03T12:00:00Z',
    role: 'pro',
    projectType: 'Kitchen Remodel',
    verified: true,
    photos: [],
    response: null,
    helpfulCount: 3,
    wouldHireAgain: null,
    tipsForOthers: '',
    status: 'published',
  },
  {
    id: 'rev-004',
    jobId: 'job-006',
    proId: 'pro-002',
    clientId: 'client-001',
    reviewerName: 'Phyrom',
    rating: 5,
    text: 'Mike responded to our emergency pipe burst within 30 minutes. Fixed the issue quickly and even helped with the insurance documentation. Outstanding service when we needed it most.',
    date: '2026-03-30T12:00:00Z',
    role: 'client',
    projectType: 'Plumbing',
    verified: true,
    photos: [
      { id: 'ph-003', url: '/mock/review-plumb-1.jpg', alt: 'Repaired pipe section' },
    ],
    response: {
      text: 'Glad I could help in that emergency situation. Always important to act fast with water damage.',
      date: '2026-03-31T08:00:00Z',
      proName: 'Mike Chen',
    },
    helpfulCount: 18,
    wouldHireAgain: true,
    tipsForOthers: 'Know where your main water shutoff valve is. It saved us from way more damage.',
    status: 'published',
  },
  {
    id: 'rev-005',
    jobId: 'job-007',
    proId: 'pro-003',
    clientId: 'client-001',
    reviewerName: 'Phyrom',
    rating: 4,
    text: 'James diagnosed the garage door issue quickly and fixed it on the spot. Good value for money. Only small issue was a 20 min delay at start.',
    date: '2026-04-02T14:00:00Z',
    role: 'client',
    projectType: 'Garage Door',
    verified: true,
    photos: [],
    response: null,
    helpfulCount: 4,
    wouldHireAgain: true,
    tipsForOthers: '',
    status: 'published',
  },
  {
    id: 'rev-006',
    jobId: 'job-030',
    proId: 'pro-001',
    clientId: 'client-004',
    reviewerName: 'Sarah Mitchell',
    rating: 5,
    text: 'Incredible attention to detail on our crown molding installation. Marcus measured everything twice and the joints are seamless. Our living room looks like a completely different space.',
    date: '2026-03-20T16:00:00Z',
    role: 'client',
    projectType: 'Carpentry',
    verified: true,
    photos: [
      { id: 'ph-004', url: '/mock/review-crown-1.jpg', alt: 'Crown molding corner detail' },
      { id: 'ph-005', url: '/mock/review-crown-2.jpg', alt: 'Full room with crown molding' },
      { id: 'ph-006', url: '/mock/review-crown-3.jpg', alt: 'Before and after comparison' },
    ],
    response: {
      text: 'Sarah, thank you for the kind words! Crown molding is one of my favorite projects -- the transformation is always dramatic.',
      date: '2026-03-21T11:00:00Z',
      proName: 'Marcus Rivera',
    },
    helpfulCount: 22,
    wouldHireAgain: true,
    tipsForOthers: 'Go with real wood molding, not MDF. It makes a huge difference in the final look.',
    status: 'published',
  },
  {
    id: 'rev-007',
    jobId: 'job-008',
    proId: 'pro-003',
    clientId: 'client-005',
    reviewerName: 'Tom Bradley',
    rating: 5,
    text: 'Phyrom is a great homeowner to work with. Clear communication and the deck came out beautiful. Always had materials ready when I showed up.',
    date: '2026-03-19T12:00:00Z',
    role: 'pro',
    projectType: 'Decking',
    verified: true,
    photos: [],
    response: null,
    helpfulCount: 2,
    wouldHireAgain: null,
    tipsForOthers: '',
    status: 'published',
  },
  {
    id: 'rev-008',
    jobId: 'job-009',
    proId: 'pro-004',
    clientId: 'client-006',
    reviewerName: 'Dana K.',
    rating: 3,
    text: 'The electrical panel upgrade was done correctly but communication could have been better. Had to call twice for updates. Work quality itself is fine.',
    date: '2026-02-15T10:00:00Z',
    role: 'client',
    projectType: 'Electrical',
    verified: true,
    photos: [],
    response: {
      text: 'Dana, I apologize for the communication gaps. I was managing multiple emergency calls that week. I have since hired an assistant to handle updates. Thank you for the feedback.',
      date: '2026-02-16T14:00:00Z',
      proName: 'Ray Gonzalez',
    },
    helpfulCount: 9,
    wouldHireAgain: false,
    tipsForOthers: 'Set clear expectations about communication frequency up front.',
    status: 'published',
  },
  {
    id: 'rev-009',
    jobId: 'job-010',
    proId: 'pro-002',
    clientId: 'client-007',
    reviewerName: 'Lisa W.',
    rating: 5,
    text: 'Mike installed our new water heater in under 3 hours. Explained everything, showed me how to adjust the temperature, and cleaned up after himself. Five stars all day.',
    date: '2026-04-05T09:00:00Z',
    role: 'client',
    projectType: 'Plumbing',
    verified: true,
    photos: [
      { id: 'ph-007', url: '/mock/review-heater-1.jpg', alt: 'New water heater installed' },
    ],
    response: null,
    helpfulCount: 6,
    wouldHireAgain: true,
    tipsForOthers: 'Ask about tankless options -- they cost more upfront but save a lot on energy.',
    status: 'published',
  },
  {
    id: 'rev-010',
    jobId: 'job-011',
    proId: 'pro-001',
    clientId: 'client-008',
    reviewerName: 'Robert J.',
    rating: 2,
    text: 'The drywall patch was okay but not great. You can still see the seam in certain lighting. Expected better for the price.',
    date: '2026-01-28T11:00:00Z',
    role: 'client',
    projectType: 'Drywall',
    verified: false,
    photos: [],
    response: {
      text: 'Robert, I am sorry it did not meet your expectations. I would be happy to come back and apply another skim coat at no charge. Please reach out through the platform.',
      date: '2026-01-29T08:00:00Z',
      proName: 'Marcus Rivera',
    },
    helpfulCount: 5,
    wouldHireAgain: false,
    tipsForOthers: '',
    status: 'published',
  },
  {
    id: 'rev-011',
    jobId: 'job-012',
    proId: 'pro-005',
    clientId: 'client-009',
    reviewerName: 'Amanda C.',
    rating: 5,
    text: 'Best painting crew I have ever hired. They taped everything perfectly, used premium paint, and finished our 4-bedroom house in just 2 days. The color consultation was a bonus I did not expect.',
    date: '2026-04-08T15:00:00Z',
    role: 'client',
    projectType: 'Painting',
    verified: true,
    photos: [
      { id: 'ph-008', url: '/mock/review-paint-1.jpg', alt: 'Freshly painted living room' },
      { id: 'ph-009', url: '/mock/review-paint-2.jpg', alt: 'Detail of paint edge' },
    ],
    response: {
      text: 'Amanda, we really appreciate the review! Color consultation is something we love doing -- it makes such a big difference in the final result.',
      date: '2026-04-09T10:00:00Z',
      proName: 'Steve Park',
    },
    helpfulCount: 15,
    wouldHireAgain: true,
    tipsForOthers: 'Test paint samples on the wall and look at them in different lighting before committing.',
    status: 'published',
  },
  {
    id: 'rev-012',
    jobId: 'job-013',
    proId: 'pro-004',
    clientId: 'client-010',
    reviewerName: 'Chris N.',
    rating: 4,
    text: 'Solid work installing the EV charger in our garage. Ray knew exactly what amperage we needed and pulled the permit himself. Minor scheduling hiccup but all good in the end.',
    date: '2026-03-25T13:00:00Z',
    role: 'client',
    projectType: 'Electrical',
    verified: true,
    photos: [
      { id: 'ph-010', url: '/mock/review-ev-1.jpg', alt: 'EV charger installed in garage' },
    ],
    response: null,
    helpfulCount: 11,
    wouldHireAgain: true,
    tipsForOthers: 'Make sure your panel has enough capacity before calling for an EV charger install.',
    status: 'published',
  },
  {
    id: 'rev-013',
    jobId: 'job-014',
    proId: 'pro-002',
    clientId: 'client-011',
    reviewerName: 'Kevin D.',
    rating: 1,
    text: 'Showed up 2 hours late, then said the job would cost double what was quoted. Had to cancel and find someone else. Very frustrating experience.',
    date: '2026-02-10T08:00:00Z',
    role: 'client',
    projectType: 'Plumbing',
    verified: false,
    photos: [],
    response: {
      text: 'Kevin, I apologize for the experience. The scope changed significantly when I arrived on site, which required re-quoting. I understand the frustration and have improved how I communicate scope changes.',
      date: '2026-02-11T09:00:00Z',
      proName: 'Mike Chen',
    },
    helpfulCount: 8,
    wouldHireAgain: false,
    tipsForOthers: 'Get the scope in writing with a not-to-exceed clause.',
    status: 'flagged',
  },
  {
    id: 'rev-014',
    jobId: 'job-015',
    proId: 'pro-005',
    clientId: 'client-012',
    reviewerName: 'Jennifer M.',
    rating: 5,
    text: 'Steve and his team did an incredible job on our exterior paint. They pressure washed first, scraped all peeling areas, primed bare wood, and applied two coats. Our 1920s colonial looks brand new.',
    date: '2026-04-10T11:00:00Z',
    role: 'client',
    projectType: 'Painting',
    verified: true,
    photos: [
      { id: 'ph-011', url: '/mock/review-exterior-1.jpg', alt: 'Freshly painted house exterior' },
      { id: 'ph-012', url: '/mock/review-exterior-2.jpg', alt: 'Close-up of trim detail' },
    ],
    response: null,
    helpfulCount: 20,
    wouldHireAgain: true,
    tipsForOthers: 'Schedule exterior painting for spring or early fall -- the paint adheres best in mild weather.',
    status: 'published',
  },
  {
    id: 'rev-015',
    jobId: 'job-016',
    proId: 'pro-001',
    clientId: 'client-013',
    reviewerName: 'David L.',
    rating: 5,
    text: 'Marcus built custom built-in bookshelves for our home office. The craftsmanship is museum quality. Every shelf is perfectly level, the finish is flawless, and he even added hidden cable management.',
    date: '2026-04-12T14:00:00Z',
    role: 'client',
    projectType: 'Carpentry',
    verified: true,
    photos: [
      { id: 'ph-013', url: '/mock/review-shelves-1.jpg', alt: 'Custom built-in bookshelves' },
      { id: 'ph-014', url: '/mock/review-shelves-2.jpg', alt: 'Cable management detail' },
    ],
    response: {
      text: 'David, thank you! Built-ins are my specialty and your office had the perfect layout for them. Enjoy the space!',
      date: '2026-04-12T18:00:00Z',
      proName: 'Marcus Rivera',
    },
    helpfulCount: 14,
    wouldHireAgain: true,
    tipsForOthers: 'Bring photos of built-ins you like. It helps the carpenter understand your vision.',
    status: 'published',
  },
];

/* ------------------------------------------------------------------ */
/*  GET -- filtered, sorted reviews with session scoping               */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const proId = searchParams.get('proId');
  const clientId = searchParams.get('clientId');
  const ratingFilter = searchParams.get('rating');
  const sort = searchParams.get('sort') ?? 'recent';
  const withPhotos = searchParams.get('withPhotos');
  const withResponse = searchParams.get('withResponse');
  const status = searchParams.get('status');

  const session = getSessionFromRequest(request);

  let filtered = MOCK_REVIEWS.filter((r) => r.status !== 'removed');

  // Role-based scoping when no explicit filters provided
  // If proId/clientId/jobId are specified, those take precedence
  if (!proId && !clientId && !jobId) {
    switch (session.role) {
      case 'pro':
        // Pro sees reviews about them (as reviewee) or by them (as reviewer)
        filtered = filtered.filter(
          (r) => r.proId === 'pro-001' || (r.role === 'pro' && r.reviewerName.includes('Marcus')),
        );
        break;
      case 'client':
        // Client sees reviews they wrote or reviews about pros on their jobs
        filtered = filtered.filter(
          (r) => r.clientId === 'client-001' || r.reviewerName === 'Phyrom',
        );
        break;
      case 'pm':
        // PM sees all reviews (oversight role)
        break;
    }
  }

  // Apply explicit filters
  if (jobId) filtered = filtered.filter((r) => r.jobId === jobId);
  if (proId) filtered = filtered.filter((r) => r.proId === proId);
  if (clientId) filtered = filtered.filter((r) => r.clientId === clientId);
  if (ratingFilter) filtered = filtered.filter((r) => r.rating === Number(ratingFilter));
  if (withPhotos === 'true') filtered = filtered.filter((r) => r.photos.length > 0);
  if (withResponse === 'true') filtered = filtered.filter((r) => r.response !== null);
  if (status) filtered = filtered.filter((r) => r.status === status);

  // Sort
  switch (sort) {
    case 'highest':
      filtered.sort((a, b) => b.rating - a.rating || new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'lowest':
      filtered.sort((a, b) => a.rating - b.rating || new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'helpful':
      filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
      break;
    case 'recent':
    default:
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
  }

  // Pagination
  const { page, limit, offset } = parsePagination(searchParams);
  const total = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    data: paged,
    pagination: paginationMeta(page, limit, total),
    session: { userId: session.userId, role: session.role },
  });
}

/* ------------------------------------------------------------------ */
/*  POST -- create review with validation + session                    */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const body = await request.json();
  const session = getSessionFromRequest(request);

  // Validation
  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json(
      { error: 'Rating must be between 1 and 5' },
      { status: 400 },
    );
  }

  if (!body.text || body.text.trim().length < 10) {
    return NextResponse.json(
      { error: 'Review text must be at least 10 characters' },
      { status: 400 },
    );
  }

  if (body.text.length > 500) {
    return NextResponse.json(
      { error: 'Review text must be 500 characters or less' },
      { status: 400 },
    );
  }

  const newReview: ReviewRecord = {
    id: `rev-${Date.now()}`,
    jobId: body.jobId ?? '',
    proId: body.proId ?? '',
    clientId: body.clientId || session.userId,
    reviewerName: body.reviewerName || session.name,
    rating: body.rating,
    text: body.text.trim(),
    date: new Date().toISOString(),
    role: body.role || session.role === 'pro' ? 'pro' : 'client',
    projectType: body.projectType ?? 'General',
    verified: body.verified ?? false,
    photos: body.photos ?? [],
    response: null,
    helpfulCount: 0,
    wouldHireAgain: body.wouldHireAgain ?? null,
    tipsForOthers: body.tipsForOthers ?? '',
    status: 'published',
  };

  return NextResponse.json({ success: true, review: newReview }, { status: 201 });
}
