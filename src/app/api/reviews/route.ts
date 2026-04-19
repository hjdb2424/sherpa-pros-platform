import { NextResponse } from 'next/server';

interface ReviewRecord {
  id: string;
  jobId: string;
  proId: string;
  reviewerName: string;
  rating: number;
  text: string;
  date: string;
  role: 'client' | 'pro';
}

const MOCK_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev-001',
    jobId: 'job-030',
    proId: 'pro-001',
    reviewerName: 'Patricia G.',
    rating: 5,
    text: 'Marcus did excellent work on our window trim. On time, clean work area, and professional throughout. Highly recommend.',
    date: '2026-03-14T12:00:00Z',
    role: 'client',
  },
  {
    id: 'rev-002',
    jobId: 'job-031',
    proId: 'pro-001',
    reviewerName: 'Frank H.',
    rating: 4,
    text: 'Good work overall on the basement waterproofing. Took a day longer than quoted but the result is solid. Would use again.',
    date: '2026-02-26T12:00:00Z',
    role: 'client',
  },
  {
    id: 'rev-003',
    jobId: 'job-004',
    proId: 'pro-001',
    reviewerName: 'Marcus Rivera',
    rating: 5,
    text: 'Great client to work with. Clear communication about expectations and prompt with payments.',
    date: '2026-04-03T12:00:00Z',
    role: 'pro',
  },
  {
    id: 'rev-004',
    jobId: 'job-6',
    proId: 'pro-1',
    reviewerName: 'Phyrom',
    rating: 5,
    text: 'Mike responded to our emergency pipe burst within 30 minutes. Fixed the issue quickly and even helped with the insurance documentation. Outstanding service.',
    date: '2026-03-30T12:00:00Z',
    role: 'client',
  },
  {
    id: 'rev-005',
    jobId: 'job-4',
    proId: 'pro-5',
    reviewerName: 'Phyrom',
    rating: 4,
    text: 'James diagnosed the garage door issue quickly and fixed it on the spot. Good value for money.',
    date: '2026-04-02T14:00:00Z',
    role: 'client',
  },
  {
    id: 'rev-006',
    jobId: 'job-030',
    proId: 'pro-001',
    reviewerName: 'Marcus Rivera',
    rating: 5,
    text: 'Patricia was a wonderful client. Clear about what she wanted and let me do my work. Highly recommend.',
    date: '2026-03-14T14:00:00Z',
    role: 'pro',
  },
  {
    id: 'rev-007',
    jobId: 'job-5',
    proId: 'pro-3',
    reviewerName: 'Tom Bradley',
    rating: 5,
    text: 'Phyrom is a great homeowner to work with. Clear communication and the deck came out beautiful.',
    date: '2026-03-19T12:00:00Z',
    role: 'pro',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const proId = searchParams.get('proId');

  let filtered = MOCK_REVIEWS;
  if (jobId) {
    filtered = filtered.filter((r) => r.jobId === jobId);
  }
  if (proId) {
    filtered = filtered.filter((r) => r.proId === proId);
  }

  return NextResponse.json({ reviews: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();

  const newReview: ReviewRecord = {
    id: `rev-${Date.now()}`,
    jobId: body.jobId ?? '',
    proId: body.proId ?? '',
    reviewerName: body.reviewerName ?? 'Anonymous',
    rating: body.rating ?? 5,
    text: body.text ?? '',
    date: new Date().toISOString(),
    role: body.role ?? 'client',
  };

  // Mock save — in production this writes to the database
  return NextResponse.json({ success: true, review: newReview }, { status: 201 });
}
