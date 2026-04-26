/**
 * Delivery Service
 * Mock implementation of delivery coordination (Uber Connect-style).
 * Structured so real APIs can drop in later.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DeliveryStatus =
  | 'requested'
  | 'driver_assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface DeliveryRequest {
  id: string;
  orderId: string;
  pickupAddress: string;
  dropoffAddress: string;
  status: DeliveryStatus;
  driverName: string | null;
  driverPhone: string | null;
  estimatedMinutes: number;
  costCents: number;
  createdAt: string;
  updatedAt: string;
  events: DeliveryEvent[];
}

export interface DeliveryEvent {
  status: DeliveryStatus;
  timestamp: string;
  note?: string;
}

export interface DeliveryEstimate {
  estimatedMinutes: number;
  costCents: number;
  distanceMiles: number;
  available: boolean;
}

/* ------------------------------------------------------------------ */
/*  In-memory store (mock persistence)                                 */
/* ------------------------------------------------------------------ */

const deliveries = new Map<string, DeliveryRequest>();

function generateId(): string {
  return `del_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/* ------------------------------------------------------------------ */
/*  Mock driver names                                                  */
/* ------------------------------------------------------------------ */

const DRIVER_NAMES = [
  'Marcus T.',
  'Sarah K.',
  'James R.',
  'Maria L.',
  'David W.',
  'Ashley P.',
];

function pickDriver(): { name: string; phone: string } {
  const idx = Math.floor(Math.random() * DRIVER_NAMES.length);
  return {
    name: DRIVER_NAMES[idx],
    phone: `(603) 555-${String(1000 + idx).slice(1)}`,
  };
}

/* ------------------------------------------------------------------ */
/*  Simulated cost + distance                                          */
/* ------------------------------------------------------------------ */

function mockDistance(pickup: string, dropoff: string): number {
  // Deterministic pseudo-distance based on string lengths
  const combined = pickup.length + dropoff.length;
  return 1.5 + (combined % 10) * 0.8; // 1.5 to 9.5 miles
}

function mockCost(distanceMiles: number): number {
  // Base $5 + $1.20/mile, in cents
  return Math.round(500 + distanceMiles * 120);
}

function mockEta(distanceMiles: number): number {
  // 15 min base + 3 min/mile
  return Math.round(15 + distanceMiles * 3);
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function createDeliveryRequest(
  orderId: string,
  pickupAddress: string,
  dropoffAddress: string,
): DeliveryRequest {
  const id = generateId();
  const distance = mockDistance(pickupAddress, dropoffAddress);
  const now = new Date().toISOString();

  const delivery: DeliveryRequest = {
    id,
    orderId,
    pickupAddress,
    dropoffAddress,
    status: 'requested',
    driverName: null,
    driverPhone: null,
    estimatedMinutes: mockEta(distance),
    costCents: mockCost(distance),
    createdAt: now,
    updatedAt: now,
    events: [
      { status: 'requested', timestamp: now, note: 'Delivery request created' },
    ],
  };

  deliveries.set(id, delivery);

  // Simulate driver assignment after a short "delay" (immediate for mock)
  const driver = pickDriver();
  delivery.status = 'driver_assigned';
  delivery.driverName = driver.name;
  delivery.driverPhone = driver.phone;
  delivery.updatedAt = new Date(Date.now() + 120_000).toISOString();
  delivery.events.push({
    status: 'driver_assigned',
    timestamp: delivery.updatedAt,
    note: `Driver ${driver.name} assigned`,
  });

  return delivery;
}

export function getDeliveryStatus(deliveryId: string): DeliveryRequest | null {
  const delivery = deliveries.get(deliveryId);
  if (!delivery) return null;

  // Simulate status progression based on elapsed time
  const elapsed = Date.now() - new Date(delivery.createdAt).getTime();
  const totalMs = delivery.estimatedMinutes * 60_000;

  if (elapsed > totalMs) {
    if (delivery.status !== 'delivered') {
      delivery.status = 'delivered';
      delivery.updatedAt = new Date().toISOString();
      if (!delivery.events.find((e) => e.status === 'delivered')) {
        delivery.events.push({
          status: 'delivered',
          timestamp: delivery.updatedAt,
          note: 'Materials delivered to job site',
        });
      }
    }
  } else if (elapsed > totalMs * 0.6) {
    if (delivery.status !== 'in_transit' && delivery.status !== 'delivered') {
      delivery.status = 'in_transit';
      delivery.updatedAt = new Date().toISOString();
      if (!delivery.events.find((e) => e.status === 'in_transit')) {
        delivery.events.push({
          status: 'in_transit',
          timestamp: delivery.updatedAt,
          note: 'Driver is en route to job site',
        });
      }
    }
  } else if (elapsed > totalMs * 0.3) {
    if (
      delivery.status !== 'picked_up' &&
      delivery.status !== 'in_transit' &&
      delivery.status !== 'delivered'
    ) {
      delivery.status = 'picked_up';
      delivery.updatedAt = new Date().toISOString();
      if (!delivery.events.find((e) => e.status === 'picked_up')) {
        delivery.events.push({
          status: 'picked_up',
          timestamp: delivery.updatedAt,
          note: 'Materials picked up from supplier',
        });
      }
    }
  }

  // Update remaining ETA
  const remaining = Math.max(0, totalMs - elapsed);
  delivery.estimatedMinutes = Math.ceil(remaining / 60_000);

  return delivery;
}

export function estimateDelivery(
  pickup: string,
  dropoff: string,
): DeliveryEstimate {
  const distance = mockDistance(pickup, dropoff);
  return {
    estimatedMinutes: mockEta(distance),
    costCents: mockCost(distance),
    distanceMiles: Math.round(distance * 10) / 10,
    available: true,
  };
}
