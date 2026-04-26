import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('twilio', () => {
  const validateRequest = vi.fn();
  const factory = vi.fn();
  // expose validateRequest on default export to match `Twilio.validateRequest`
  return {
    default: Object.assign(factory, { validateRequest }),
    __esModule: true,
    validateRequest,
  };
});

beforeEach(() => {
  process.env.TWILIO_AUTH_TOKEN = 'token_test';
  vi.resetModules();
});

describe('POST /api/chat/webhook signature validation', () => {
  it('rejects requests without a valid Twilio signature', async () => {
    const twilio = await import('twilio');
    (twilio.validateRequest as ReturnType<typeof vi.fn>).mockReturnValue(false);

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/chat/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-twilio-signature': 'bad',
      },
      body: 'EventType=onMessageAdded&ConversationSid=CH_x',
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('accepts requests with a valid Twilio signature', async () => {
    const twilio = await import('twilio');
    (twilio.validateRequest as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/chat/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-twilio-signature': 'good',
      },
      body: 'EventType=onMessageAdded&ConversationSid=CH_x&Author=pro&Body=hi',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });
});
