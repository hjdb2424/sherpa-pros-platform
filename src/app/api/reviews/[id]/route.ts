import { NextResponse } from 'next/server';
import { MOCK_REVIEWS } from '../route';

/* ------------------------------------------------------------------ */
/*  GET — single review by ID                                          */
/* ------------------------------------------------------------------ */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const review = MOCK_REVIEWS.find((r) => r.id === id);

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  return NextResponse.json({ review });
}

/* ------------------------------------------------------------------ */
/*  PATCH — update review (only within 48hrs of creation)              */
/* ------------------------------------------------------------------ */

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const review = MOCK_REVIEWS.find((r) => r.id === id);

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  // Check 48-hour window
  const createdAt = new Date(review.date).getTime();
  const now = Date.now();
  const hoursElapsed = (now - createdAt) / (1000 * 60 * 60);

  if (hoursElapsed > 48) {
    return NextResponse.json(
      { error: 'Reviews can only be edited within 48 hours of creation' },
      { status: 403 },
    );
  }

  const body = await request.json();

  // Validate if rating is being updated
  if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
    return NextResponse.json(
      { error: 'Rating must be between 1 and 5' },
      { status: 400 },
    );
  }

  // Validate if text is being updated
  if (body.text !== undefined && body.text.trim().length < 10) {
    return NextResponse.json(
      { error: 'Review text must be at least 10 characters' },
      { status: 400 },
    );
  }

  const updated = {
    ...review,
    ...(body.rating !== undefined && { rating: body.rating }),
    ...(body.text !== undefined && { text: body.text.trim() }),
    ...(body.wouldHireAgain !== undefined && { wouldHireAgain: body.wouldHireAgain }),
    ...(body.tipsForOthers !== undefined && { tipsForOthers: body.tipsForOthers }),
  };

  return NextResponse.json({ success: true, review: updated });
}

/* ------------------------------------------------------------------ */
/*  DELETE — soft delete (set status to 'removed')                     */
/* ------------------------------------------------------------------ */

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const review = MOCK_REVIEWS.find((r) => r.id === id);

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  const removed = { ...review, status: 'removed' as const };

  return NextResponse.json({ success: true, review: removed });
}
