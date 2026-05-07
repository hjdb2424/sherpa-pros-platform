/**
 * Sherpa Pros Platform — Email OTP tests
 *
 * Covers:
 *  - Pure helpers in src/lib/auth/email-codes.ts
 *  - POST /api/auth/email/request-code lifecycle (rate limit, enum protection)
 *  - POST /api/auth/email/verify-code lifecycle (wrong / expired / consumed / locked)
 *
 * Spec: docs/superpowers/specs/2026-05-07-email-otp-auth-design.md
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateCode, hashCode, validateCode } from '@/lib/auth/email-codes';

// ─────────────────────────────────────────────────────────────────────
// Pure-function tests
// ─────────────────────────────────────────────────────────────────────

describe('generateCode', () => {
  it('returns a 6-digit string', () => {
    for (let i = 0; i < 50; i++) {
      const code = generateCode();
      expect(code).toMatch(/^\d{6}$/);
      expect(code.length).toBe(6);
    }
  });

  it('zero-pads small numbers to 6 digits', () => {
    // Exhaust enough samples that we likely get a small one; statistical but
    // robust enough — and the regex above already enforces the invariant.
    const samples = new Set<string>();
    for (let i = 0; i < 200; i++) samples.add(generateCode());
    samples.forEach((c) => expect(c.length).toBe(6));
  });

  it('produces varied output (not constant)', () => {
    const samples = new Set<string>();
    for (let i = 0; i < 20; i++) samples.add(generateCode());
    expect(samples.size).toBeGreaterThan(1);
  });
});

describe('hashCode', () => {
  it('is deterministic for the same input', () => {
    expect(hashCode('123456')).toBe(hashCode('123456'));
  });

  it('returns SHA-256 hex (64 chars)', () => {
    const hash = hashCode('123456');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('differs across inputs', () => {
    expect(hashCode('123456')).not.toBe(hashCode('123457'));
    expect(hashCode('000000')).not.toBe(hashCode('000001'));
  });

  it('matches the well-known sha256 of "123456"', () => {
    // sha256("123456") = 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
    expect(hashCode('123456')).toBe(
      '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
    );
  });
});

describe('validateCode', () => {
  it('returns true when input matches the stored hash', () => {
    const stored = hashCode('420420');
    expect(validateCode('420420', stored)).toBe(true);
  });

  it('returns false when input does not match', () => {
    const stored = hashCode('420420');
    expect(validateCode('420421', stored)).toBe(false);
  });

  it('returns false for non-6-digit input', () => {
    const stored = hashCode('420420');
    expect(validateCode('42042', stored)).toBe(false);
    expect(validateCode('4204200', stored)).toBe(false);
    expect(validateCode('', stored)).toBe(false);
  });

  it('returns false for non-string input', () => {
    const stored = hashCode('420420');
    // @ts-expect-error — testing runtime guard
    expect(validateCode(420420, stored)).toBe(false);
    // @ts-expect-error — testing runtime guard
    expect(validateCode(null, stored)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Endpoint tests — mock @/db/connection and the Resend HTTP call
// ─────────────────────────────────────────────────────────────────────

const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
}));

vi.mock('@/db/connection', () => ({
  query: mockQuery,
}));

const originalNodeEnv = process.env.NODE_ENV;
const originalResendKey = process.env.RESEND_API_KEY;

beforeEach(() => {
  mockQuery.mockReset();
  // Force prod-ish behavior so the hardcoded fixture fallback is bypassed
  // and we exercise pure DB-backed logic.
  process.env.NODE_ENV = 'production';
  // Drop Resend key so sendOtpEmail uses the dev console fallback (no real
  // network call from the test suite).
  delete process.env.RESEND_API_KEY;
  vi.resetModules();
});

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  if (originalResendKey !== undefined) {
    process.env.RESEND_API_KEY = originalResendKey;
  }
});

function makeRequest(url: string, body: unknown): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ── /api/auth/email/request-code ─────────────────────────────────────

describe('POST /api/auth/email/request-code', () => {
  it('rejects malformed body with 400 invalid_email', async () => {
    const { POST } = await import('@/app/api/auth/email/request-code/route');
    const req = new Request('https://x.test/api/auth/email/request-code', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('invalid_email');
  });

  it('rejects invalid email format with 400', async () => {
    const { POST } = await import('@/app/api/auth/email/request-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/request-code', {
        email: 'nope',
      }) as never
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('invalid_email');
  });

  it('returns 200 ok:true silently when email is NOT on access_list (no enumeration)', async () => {
    // 1st query: rate limit count → 0
    // 2nd query: access_list lookup → empty
    mockQuery
      .mockResolvedValueOnce([{ count: '0' }])
      .mockResolvedValueOnce([]);
    const { POST } = await import('@/app/api/auth/email/request-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/request-code', {
        email: 'unknown@example.com',
      }) as never
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    // Confirms: no INSERT was made for unknown emails.
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });

  it('returns 200 ok:true and inserts a code row for known emails', async () => {
    mockQuery
      .mockResolvedValueOnce([{ count: '0' }]) // rate limit
      .mockResolvedValueOnce([
        { email: 'phyrom@example.com', name: 'Phyrom', default_role: 'res_multi' },
      ]) // access_list hit
      .mockResolvedValueOnce([]); // INSERT
    const { POST } = await import('@/app/api/auth/email/request-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/request-code', {
        email: 'phyrom@example.com',
      }) as never
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(mockQuery).toHaveBeenCalledTimes(3);
    const insertArgs = mockQuery.mock.calls[2];
    expect(insertArgs[0]).toMatch(/INSERT INTO email_codes/);
    expect(insertArgs[1]?.[0]).toBe('phyrom@example.com');
    // The code hash is a SHA-256 hex digest:
    expect(insertArgs[1]?.[1]).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns 429 too_many_requests when rate limit exceeded', async () => {
    mockQuery.mockResolvedValueOnce([{ count: '5' }]);
    const { POST } = await import('@/app/api/auth/email/request-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/request-code', {
        email: 'phyrom@example.com',
      }) as never
    );
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toBe('too_many_requests');
  });

  it('normalizes email to lowercase before storage and lookup', async () => {
    mockQuery
      .mockResolvedValueOnce([{ count: '0' }])
      .mockResolvedValueOnce([
        { email: 'phyrom@example.com', name: 'Phyrom', default_role: null },
      ])
      .mockResolvedValueOnce([]);
    const { POST } = await import('@/app/api/auth/email/request-code/route');
    await POST(
      makeRequest('https://x.test/api/auth/email/request-code', {
        email: '  Phyrom@Example.COM  ',
      }) as never
    );
    expect(mockQuery.mock.calls[1][1]?.[0]).toBe('phyrom@example.com');
  });
});

// ── /api/auth/email/verify-code ──────────────────────────────────────

describe('POST /api/auth/email/verify-code', () => {
  it('rejects malformed body with 400', async () => {
    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const req = new Request('https://x.test/api/auth/email/verify-code', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('rejects invalid email with 400 invalid_email', async () => {
    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/verify-code', {
        email: 'bad',
        code: '123456',
      }) as never
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('invalid_email');
  });

  it('returns invalid_code for non-numeric code', async () => {
    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/verify-code', {
        email: 'phyrom@example.com',
        code: 'abcdef',
      }) as never
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe('invalid_code');
  });

  it('returns no_code when no row exists for the email', async () => {
    mockQuery.mockResolvedValueOnce([]);
    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/verify-code', {
        email: 'phyrom@example.com',
        code: '123456',
      }) as never
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe('no_code');
  });

  it('returns code_consumed when the latest row is already consumed', async () => {
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        email: 'phyrom@example.com',
        code_hash: hashCode('123456'),
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        consumed_at: new Date().toISOString(),
        attempts: 0,
        created_at: new Date().toISOString(),
      },
    ]);
    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/verify-code', {
        email: 'phyrom@example.com',
        code: '123456',
      }) as never
    );
    const json = await res.json();
    expect(json.error).toBe('code_consumed');
  });

  it('returns code_expired when the latest row is past expiry', async () => {
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        email: 'phyrom@example.com',
        code_hash: hashCode('123456'),
        expires_at: new Date(Date.now() - 60_000).toISOString(),
        consumed_at: null,
        attempts: 0,
        created_at: new Date(Date.now() - 11 * 60_000).toISOString(),
      },
    ]);
    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/verify-code', {
        email: 'phyrom@example.com',
        code: '123456',
      }) as never
    );
    const json = await res.json();
    expect(json.error).toBe('code_expired');
  });

  it('returns code_locked when attempts already at max', async () => {
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        email: 'phyrom@example.com',
        code_hash: hashCode('123456'),
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        consumed_at: null,
        attempts: 5,
        created_at: new Date().toISOString(),
      },
    ]);
    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/verify-code', {
        email: 'phyrom@example.com',
        code: '123456',
      }) as never
    );
    const json = await res.json();
    expect(json.error).toBe('code_locked');
  });

  it('increments attempts and returns invalid_code with attemptsLeft on wrong code', async () => {
    mockQuery
      .mockResolvedValueOnce([
        {
          id: 1,
          email: 'phyrom@example.com',
          code_hash: hashCode('123456'),
          expires_at: new Date(Date.now() + 60_000).toISOString(),
          consumed_at: null,
          attempts: 0,
          created_at: new Date().toISOString(),
        },
      ])
      .mockResolvedValueOnce([]); // UPDATE attempts

    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/verify-code', {
        email: 'phyrom@example.com',
        code: '999999',
      }) as never
    );
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe('invalid_code');
    expect(json.attemptsLeft).toBe(4);
    // Confirm UPDATE was called with attempts=1
    const updateCall = mockQuery.mock.calls[1];
    expect(updateCall[0]).toMatch(/UPDATE email_codes SET attempts/);
    expect(updateCall[1]?.[0]).toBe(1);
  });

  it('locks the code after the 5th wrong attempt (attempts becomes 5)', async () => {
    mockQuery
      .mockResolvedValueOnce([
        {
          id: 1,
          email: 'phyrom@example.com',
          code_hash: hashCode('123456'),
          expires_at: new Date(Date.now() + 60_000).toISOString(),
          consumed_at: null,
          attempts: 4, // Next wrong attempt will be the 5th
          created_at: new Date().toISOString(),
        },
      ])
      .mockResolvedValueOnce([]); // UPDATE attempts

    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/verify-code', {
        email: 'phyrom@example.com',
        code: '999999',
      }) as never
    );
    const json = await res.json();
    expect(json.error).toBe('code_locked');
  });

  it('on correct code: marks consumed, looks up access_list, returns user info', async () => {
    mockQuery
      .mockResolvedValueOnce([
        {
          id: 7,
          email: 'phyrom@example.com',
          code_hash: hashCode('246810'),
          expires_at: new Date(Date.now() + 60_000).toISOString(),
          consumed_at: null,
          attempts: 1,
          created_at: new Date().toISOString(),
        },
      ])
      .mockResolvedValueOnce([]) // UPDATE consumed_at
      .mockResolvedValueOnce([
        { email: 'phyrom@example.com', name: 'Phyrom', default_role: 'res_multi' },
      ]); // access_list

    const { POST } = await import('@/app/api/auth/email/verify-code/route');
    const res = await POST(
      makeRequest('https://x.test/api/auth/email/verify-code', {
        email: 'phyrom@example.com',
        code: '246810',
      }) as never
    );
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.name).toBe('Phyrom');
    expect(json.defaultRole).toBe('res_multi');

    const updateCall = mockQuery.mock.calls[1];
    expect(updateCall[0]).toMatch(/UPDATE email_codes SET consumed_at/);
    expect(updateCall[1]?.[0]).toBe(7);
  });
});
