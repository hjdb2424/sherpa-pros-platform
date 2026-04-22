import { NextResponse } from 'next/server';
import { MOCK_REVIEWS } from '../route';

/* ------------------------------------------------------------------ */
/*  GET — aggregate review stats for a pro                             */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proId = searchParams.get('proId');

  if (!proId) {
    return NextResponse.json(
      { error: 'proId query parameter is required' },
      { status: 400 },
    );
  }

  const proReviews = MOCK_REVIEWS.filter(
    (r) => r.proId === proId && r.role === 'client' && r.status !== 'removed',
  );

  if (proReviews.length === 0) {
    return NextResponse.json({
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      responseRate: 0,
      avgResponseTimeHours: 0,
      wouldHireAgainPercent: 0,
    });
  }

  // Rating distribution
  const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;
  let responsesCount = 0;
  let totalResponseTimeMs = 0;
  let hireAgainYes = 0;
  let hireAgainTotal = 0;

  for (const review of proReviews) {
    totalRating += review.rating;
    ratingDistribution[review.rating] = (ratingDistribution[review.rating] ?? 0) + 1;

    if (review.response) {
      responsesCount++;
      const reviewDate = new Date(review.date).getTime();
      const responseDate = new Date(review.response.date).getTime();
      totalResponseTimeMs += responseDate - reviewDate;
    }

    if (review.wouldHireAgain !== null) {
      hireAgainTotal++;
      if (review.wouldHireAgain) hireAgainYes++;
    }
  }

  const averageRating = Math.round((totalRating / proReviews.length) * 10) / 10;
  const responseRate = Math.round((responsesCount / proReviews.length) * 100);
  const avgResponseTimeHours =
    responsesCount > 0
      ? Math.round(totalResponseTimeMs / responsesCount / (1000 * 60 * 60))
      : 0;
  const wouldHireAgainPercent =
    hireAgainTotal > 0 ? Math.round((hireAgainYes / hireAgainTotal) * 100) : 0;

  return NextResponse.json({
    averageRating,
    totalReviews: proReviews.length,
    ratingDistribution,
    responseRate,
    avgResponseTimeHours,
    wouldHireAgainPercent,
  });
}
