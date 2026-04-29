import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockOnConflictDoNothing, mockReturning, mockValues, mockInsert } = vi.hoisted(() => {
  const mockReturning = vi.fn();
  const mockOnConflictDoNothing = vi.fn();
  const mockValues = vi.fn(() => ({
    onConflictDoNothing: mockOnConflictDoNothing,
  }));
  const mockInsert = vi.fn(() => ({ values: mockValues }));
  return { mockOnConflictDoNothing, mockReturning, mockValues, mockInsert };
});

vi.mock('@/db', () => ({
  db: { insert: mockInsert },
}));

vi.mock('@/db/drizzle-schema', () => ({
  stripeEventsProcessed: { eventId: 'event_id' },
}));

import { markEventProcessed } from '../stripe-events';

describe('markEventProcessed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnConflictDoNothing.mockReturnValue({ returning: mockReturning });
  });

  it('returns true when the event_id is new (first time)', async () => {
    mockReturning.mockResolvedValue([{ eventId: 'evt_123' }]);
    const result = await markEventProcessed('evt_123', 'payment_intent.succeeded');
    expect(result).toBe(true);
    expect(mockInsert).toHaveBeenCalledOnce();
    expect(mockValues).toHaveBeenCalledWith({
      eventId: 'evt_123',
      eventType: 'payment_intent.succeeded',
    });
  });

  it('returns false when the event_id was already processed (ON CONFLICT skipped)', async () => {
    mockReturning.mockResolvedValue([]);
    const result = await markEventProcessed('evt_123', 'payment_intent.succeeded');
    expect(result).toBe(false);
  });
});
