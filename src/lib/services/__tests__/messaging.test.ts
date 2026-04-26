import { describe, it, expect, afterEach } from 'vitest';
import { getMessagingService } from '../messaging';
import { mockService } from '@/lib/communication/mock-service';
import { twilioService } from '@/lib/communication/twilio-service';

describe('getMessagingService', () => {
  const originalSid = process.env.TWILIO_ACCOUNT_SID;

  afterEach(() => {
    if (originalSid === undefined) {
      delete process.env.TWILIO_ACCOUNT_SID;
    } else {
      process.env.TWILIO_ACCOUNT_SID = originalSid;
    }
  });

  it('returns the mock service when TWILIO_ACCOUNT_SID is unset', () => {
    delete process.env.TWILIO_ACCOUNT_SID;
    expect(getMessagingService()).toBe(mockService);
  });

  it('returns the Twilio service when TWILIO_ACCOUNT_SID is set', () => {
    process.env.TWILIO_ACCOUNT_SID = 'AC_test_sid';
    expect(getMessagingService()).toBe(twilioService);
  });
});
