/**
 * Sherpa Pros — Messaging Service
 *
 * Picks Twilio if TWILIO_ACCOUNT_SID is set, mock otherwise.
 * Returns the canonical CommunicationService implementation from
 * src/lib/communication/ (which already conforms to the interface).
 */

import type { MessagingService } from '@/lib/services/interfaces';
import { mockService } from '@/lib/communication/mock-service';
import { twilioService } from '@/lib/communication/twilio-service';

export function getMessagingService(): MessagingService {
  if (process.env.TWILIO_ACCOUNT_SID) {
    return twilioService;
  }
  return mockService;
}
