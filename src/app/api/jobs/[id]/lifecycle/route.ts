import { NextResponse } from 'next/server';
import {
  getJobTimeline,
  dispatchLifecycleAction,
  type LifecycleAction,
} from '@/lib/services/job-lifecycle';

/**
 * GET /api/jobs/[id]/lifecycle
 * Returns the timeline of lifecycle events for a job.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const events = getJobTimeline(id);
    return NextResponse.json({ events });
  } catch (error) {
    console.error('[api/jobs/[id]/lifecycle] GET failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job timeline' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/jobs/[id]/lifecycle
 * Trigger a lifecycle action on a job.
 *
 * Body: { action: 'accept_bid', bidId: '...' }
 *     | { action: 'approve_materials' }
 *     | { action: 'start_work' }
 *     | { action: 'complete_milestone', milestoneId: '...' }
 *     | { action: 'complete_job' }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = (await request.json()) as LifecycleAction;

    if (!body.action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 },
      );
    }

    const events = await dispatchLifecycleAction(id, body);

    return NextResponse.json({ events, triggered: events.length });
  } catch (error) {
    console.error('[api/jobs/[id]/lifecycle] POST failed:', error);
    return NextResponse.json(
      { error: 'Failed to process lifecycle action' },
      { status: 500 },
    );
  }
}
