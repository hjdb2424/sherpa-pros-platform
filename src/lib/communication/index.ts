/**
 * Sherpa Pros Platform — Communication Module
 *
 * Barrel export for the masked messaging system.
 * Auto-selects mock service when Twilio credentials are absent.
 */

// Types
export type {
  Conversation,
  ConversationStatus,
  Message,
  ConversationEvent,
  ConversationEventType,
  ParticipantRole,
  CommunicationService,
  CreateConversationPayload,
  SendMessagePayload,
  ConversationListItem,
} from './types';

export { roleLabel } from './types';

// Services
import { mockService } from './mock-service';
import { twilioService } from './twilio-service';

/**
 * Active communication service.
 * Uses Twilio in production (when TWILIO_ACCOUNT_SID is set),
 * falls back to in-memory mock for local development.
 */
export const communicationService: import('./types').CommunicationService =
  process.env.TWILIO_ACCOUNT_SID ? twilioService : mockService;

export { mockService } from './mock-service';
export { twilioService } from './twilio-service';
