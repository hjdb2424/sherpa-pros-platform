import { NextResponse } from 'next/server';
import { MOCK_REVIEWS } from '../../route';

/* ------------------------------------------------------------------ */
/*  POST — pro responds to a review (one response per review max)      */
/* ------------------------------------------------------------------ */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const review = MOCK_REVIEWS.find((r) => r.id === id);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.response) {
      return NextResponse.json(
        { error: 'This review already has a response' },
        { status: 409 },
      );
    }

    const body = await request.json();

    if (!body.text || body.text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Response text is required' },
        { status: 400 },
      );
    }

    if (body.text.length > 300) {
      return NextResponse.json(
        { error: 'Response must be 300 characters or less' },
        { status: 400 },
      );
    }

    const response = {
      text: body.text.trim(),
      date: new Date().toISOString(),
      proName: body.proName ?? 'Pro',
    };

    const updated = { ...review, response };

    return NextResponse.json({ success: true, review: updated }, { status: 201 });
  } catch (error) {
    console.error('[api/reviews/respond] POST failed:', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 },
    );
  }
}
