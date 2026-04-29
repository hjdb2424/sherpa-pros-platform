import { describe, it, expect } from 'vitest';
import { mockPaymentService } from '../mock-service';

describe('mockPaymentService.capturePayment', () => {
  it('returns deterministic pi_mock_* IDs derived from paymentRowId', async () => {
    const result = await mockPaymentService.capturePayment({
      paymentRowId: 'pay_abc123',
      amountCents: 25000,
      description: 'Milestone 1: Prep',
      metadata: { jobId: 'job_1', milestoneId: 'ms_1', paymentRowId: 'pay_abc123' },
    });
    expect(result.paymentIntentId).toBe('pi_mock_pay_abc123');
    expect(result.clientSecret).toBe('pi_mock_pay_abc123_secret');
  });
});
