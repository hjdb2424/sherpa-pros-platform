import { db } from '@/db';
import { stripeEventsProcessed } from '@/db/drizzle-schema';

/**
 * Insert a Stripe event ID into stripe_events_processed.
 * Returns true if this is the first time we've seen the event_id (we should
 * process it), false if a duplicate (skip processing — Stripe at-least-once).
 */
export async function markEventProcessed(
  eventId: string,
  eventType: string,
): Promise<boolean> {
  const inserted = await db
    .insert(stripeEventsProcessed)
    .values({ eventId, eventType })
    .onConflictDoNothing()
    .returning();
  return inserted.length > 0;
}
