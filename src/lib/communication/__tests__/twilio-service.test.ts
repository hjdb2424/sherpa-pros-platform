import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoisted mock — twilio SDK swap before twilio-service.ts imports it
vi.mock('twilio', () => {
  const participantsCreate = vi.fn().mockResolvedValue({ sid: 'PA_mock' });
  const participantUpdate = vi.fn().mockResolvedValue({ identity: 'mock' });

  const conversationsCreate = vi.fn().mockResolvedValue({
    sid: 'CH_mock_sid',
    friendlyName: 'mock',
  });
  const messagesCreate = vi.fn().mockResolvedValue({
    sid: 'IM_mock',
    body: 'hi',
    author: 'user_1',
    dateCreated: new Date('2026-04-26T00:00:00Z'),
  });
  const messagesList = vi.fn().mockResolvedValue([]);
  const conversationUpdate = vi.fn().mockResolvedValue({ sid: 'CH_mock_sid' });

  // Path accessor: client.conversations.v1.conversations(sid).<resource>
  const conversationsAccessor = (sid: string) => {
    // participants(identity) returns a context with .update;
    // participants.create(...) creates a new participant.
    // The real Twilio SDK overloads these on the same accessor.
    const participantsAccessor = (_identity: string) => ({
      update: participantUpdate,
    });
    (participantsAccessor as unknown as { create: typeof participantsCreate }).create =
      participantsCreate;

    return {
      sid,
      messages: { create: messagesCreate, list: messagesList },
      participants: participantsAccessor,
      update: conversationUpdate,
    };
  };
  // The .create method on the accessor is reached as conversations.create(...)
  // (no SID arg) — a separate pattern from conversations(sid)
  (conversationsAccessor as unknown as { create: typeof conversationsCreate }).create =
    conversationsCreate;

  const factory = vi.fn().mockReturnValue({
    conversations: {
      v1: {
        conversations: conversationsAccessor,
      },
    },
  });
  return { default: factory, __esModule: true };
});

beforeEach(() => {
  process.env.TWILIO_ACCOUNT_SID = 'AC_test';
  process.env.TWILIO_AUTH_TOKEN = 'token_test';
});

describe('twilioService.createConversation', () => {
  it('creates a Twilio Conversation and returns a typed Conversation', async () => {
    const { twilioService } = await import('../twilio-service');
    const conv = await twilioService.createConversation('job_1', 'pro_1', 'client_1');

    expect(conv.jobId).toBe('job_1');
    expect(conv.proUserId).toBe('pro_1');
    expect(conv.clientUserId).toBe('client_1');
    expect(conv.twilioSid).toBe('CH_mock_sid');
    expect(conv.status).toBe('active');
  });

  it('throws when credentials are missing', async () => {
    delete process.env.TWILIO_ACCOUNT_SID;
    vi.resetModules();
    const { twilioService } = await import('../twilio-service');
    await expect(
      twilioService.createConversation('job_1', 'pro_1', 'client_1'),
    ).rejects.toThrow(/credentials not configured/i);
  });
});

describe('twilioService.sendMessage', () => {
  beforeEach(() => {
    process.env.TWILIO_ACCOUNT_SID = 'AC_test';
    process.env.TWILIO_AUTH_TOKEN = 'token_test';
    vi.resetModules();
  });

  it('posts the message via Conversations.messages.create', async () => {
    const { twilioService } = await import('../twilio-service');
    const conv = await twilioService.createConversation('job_2', 'pro_2', 'client_2');
    const msg = await twilioService.sendMessage(conv.id, 'pro_2', 'hello');

    expect(msg.body).toBe('hi'); // from the mock
    expect(msg.senderId).toBe('user_1'); // mock returns author='user_1'
    expect(msg.conversationId).toBe(conv.id);
  });

  it('throws when conversation does not exist', async () => {
    const { twilioService } = await import('../twilio-service');
    await expect(
      twilioService.sendMessage('does_not_exist', 'pro_2', 'hello'),
    ).rejects.toThrow(/Conversation not found/);
  });
});

describe('twilioService.getMessages', () => {
  beforeEach(() => {
    process.env.TWILIO_ACCOUNT_SID = 'AC_test';
    process.env.TWILIO_AUTH_TOKEN = 'token_test';
    vi.resetModules();
  });

  it('returns mapped messages from the Twilio API', async () => {
    // Adjust the mock to return one message
    vi.doMock('twilio', () => {
      const factory = vi.fn().mockReturnValue({
        conversations: {
          v1: {
            conversations: Object.assign(
              (sid: string) => ({
                sid,
                messages: {
                  list: vi.fn().mockResolvedValue([
                    {
                      sid: 'IM_one',
                      body: 'hello',
                      author: 'pro_x',
                      dateCreated: new Date('2026-04-26T01:00:00Z'),
                    },
                  ]),
                  create: vi.fn(),
                },
                update: vi.fn(),
                participants: { create: vi.fn() },
              }),
              {
                create: vi.fn().mockResolvedValue({
                  sid: 'CH_x',
                }),
              },
            ),
          },
        },
      });
      return { default: factory, __esModule: true };
    });

    const { twilioService } = await import('../twilio-service');
    const conv = await twilioService.createConversation('job_3', 'pro_3', 'client_3');
    const msgs = await twilioService.getMessages(conv.id);

    expect(msgs).toHaveLength(1);
    expect(msgs[0].body).toBe('hello');
    expect(msgs[0].senderId).toBe('pro_x');
  });
});
