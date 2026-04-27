/**
 * Sherpa Pros — Service Interfaces
 *
 * Single import point for all integration interfaces.
 * Each `services/<name>/index.ts` exports a `getXService()` function that
 * picks a real or mock implementation based on env.
 *
 * Pattern from spec: 2026-04-25-production-launch-hub-architecture-design.md
 */

// Messaging — already implemented in src/lib/communication/
export type {
  CommunicationService as MessagingService,
  Conversation,
  Message,
  ConversationStatus,
  ConversationEvent,
  ConversationEventType,
  ParticipantRole,
} from '@/lib/communication/types';

// Payments — new in this plan (Stripe Connect onboarding only; money flow Plan 2)
export type {
  PaymentService,
  StripeAccountStatus,
  ConnectedAccountResult,
  AccountSessionResult,
} from '@/lib/services/payments/types';

// Future interfaces — these get filled in as each integration lands.
// Each interface lives next to its implementation, then is re-exported here.
//
// Tracked in followup plans:
// - StorageService     (Cloudflare R2)
// - DeliveryService    (Uber Connect / DoorDash Drive)
// - QueueService       (in-process → QStash)
// - HubService         (warehouse inventory)
