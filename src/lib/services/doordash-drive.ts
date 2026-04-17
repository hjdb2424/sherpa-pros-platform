// ---------------------------------------------------------------------------
// DoorDash Drive — Gig Delivery Service (Backup)
// Reads DOORDASH_DEVELOPER_ID, DOORDASH_KEY_ID, DOORDASH_SIGNING_SECRET.
// If no keys: returns mock delivery result.
// If keys set: calls DoorDash Drive API with JWT auth.
// ---------------------------------------------------------------------------

import type {
  GigDeliveryRequest,
  GigDeliveryResult,
} from './uber-connect';

// Re-export shared types for convenience
export type { GigDeliveryRequest, GigDeliveryResult };

// ---------------------------------------------------------------------------
// Config check
// ---------------------------------------------------------------------------

export function isDoorDashConfigured(): boolean {
  return !!(
    process.env.DOORDASH_DEVELOPER_ID &&
    process.env.DOORDASH_KEY_ID &&
    process.env.DOORDASH_SIGNING_SECRET
  );
}

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function generateMockId(): string {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `dd_mock_${rand}`;
}

function computeMockCostCents(weightLbs: number): number {
  // DoorDash is slightly cheaper: base $10 + $0.50/lb → clamp $12–$22
  const dollars = 10 + 0.5 * weightLbs;
  const clamped = Math.min(22, Math.max(12, dollars));
  return Math.round(clamped * 100);
}

function buildMockResult(
  request: GigDeliveryRequest,
  deliveryId?: string,
): GigDeliveryResult {
  const now = new Date();
  const pickupTime = new Date(now.getTime() + 30 * 60_000); // 30 min
  const deliveryTime = new Date(now.getTime() + 70 * 60_000); // 70 min

  return {
    deliveryId: deliveryId ?? generateMockId(),
    provider: 'doordash',
    status: 'mock',
    estimatedPickupTime: pickupTime.toISOString(),
    estimatedDeliveryTime: deliveryTime.toISOString(),
    estimatedCostCents: computeMockCostCents(request.estimatedWeightLbs),
    trackingUrl: 'https://doordash.com/track/mock',
    driverName: 'Jordan K.',
    driverPhone: '+16035550198',
    isMock: true,
  };
}

// ---------------------------------------------------------------------------
// JWT signing for DoorDash Drive API
// ---------------------------------------------------------------------------

async function createDoorDashJWT(): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    'dd-ver': 'DD-JWT-V1',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: 'doordash',
    iss: process.env.DOORDASH_DEVELOPER_ID!,
    kid: process.env.DOORDASH_KEY_ID!,
    exp: now + 300, // 5 min expiry
    iat: now,
  };

  const enc = new TextEncoder();

  const toBase64Url = (data: Uint8Array): string => {
    let binary = '';
    for (const byte of data) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const headerB64 = toBase64Url(enc.encode(JSON.stringify(header)));
  const payloadB64 = toBase64Url(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  // Decode the base64 signing secret
  const secretBytes = Uint8Array.from(
    atob(process.env.DOORDASH_SIGNING_SECRET!),
    (c) => c.charCodeAt(0),
  );

  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(signingInput),
  );

  const sigB64 = toBase64Url(new Uint8Array(signature));
  return `${signingInput}.${sigB64}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function requestDoorDashDelivery(
  request: GigDeliveryRequest,
): Promise<GigDeliveryResult> {
  if (!isDoorDashConfigured()) {
    return buildMockResult(request);
  }

  const jwt = await createDoorDashJWT();

  const body = {
    external_delivery_id: `sherpa_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    pickup_address: request.pickup.storeAddress,
    pickup_business_name: request.pickup.storeName,
    pickup_phone_number: request.pickup.contactPhone,
    pickup_instructions: request.pickup.pickupNotes ?? '',
    dropoff_address: request.dropoff.address,
    dropoff_contact_given_name: request.dropoff.contactName.split(' ')[0],
    dropoff_contact_family_name:
      request.dropoff.contactName.split(' ').slice(1).join(' ') || '',
    dropoff_phone_number: request.dropoff.contactPhone,
    dropoff_instructions: request.dropoff.dropoffNotes ?? '',
    order_value: 0, // materials already paid for
    items: [
      {
        name: request.itemDescription,
        quantity: request.estimatedItemCount,
        external_id: 'materials',
      },
    ],
  };

  const res = await fetch(
    'https://openapi.doordash.com/drive/v2/deliveries',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DoorDash delivery request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    external_delivery_id: string;
    delivery_status: string;
    pickup_time_estimated: string;
    dropoff_time_estimated: string;
    fee: number;
    tracking_url?: string;
    dasher?: { first_name?: string; phone_number?: string };
  };

  return {
    deliveryId: data.external_delivery_id,
    provider: 'doordash',
    status: mapDoorDashStatus(data.delivery_status),
    estimatedPickupTime: data.pickup_time_estimated,
    estimatedDeliveryTime: data.dropoff_time_estimated,
    estimatedCostCents: data.fee,
    trackingUrl: data.tracking_url,
    driverName: data.dasher?.first_name
      ? `${data.dasher.first_name}`
      : undefined,
    driverPhone: data.dasher?.phone_number,
    isMock: false,
  };
}

export async function getDoorDashDeliveryStatus(
  deliveryId: string,
): Promise<GigDeliveryResult> {
  if (!isDoorDashConfigured() || deliveryId.startsWith('dd_mock_')) {
    return {
      deliveryId,
      provider: 'doordash',
      status: 'mock',
      estimatedPickupTime: new Date(
        Date.now() + 20 * 60_000,
      ).toISOString(),
      estimatedDeliveryTime: new Date(
        Date.now() + 50 * 60_000,
      ).toISOString(),
      estimatedCostCents: 1600,
      trackingUrl: 'https://doordash.com/track/mock',
      driverName: 'Jordan K.',
      driverPhone: '+16035550198',
      isMock: true,
    };
  }

  const jwt = await createDoorDashJWT();

  const res = await fetch(
    `https://openapi.doordash.com/drive/v2/deliveries/${deliveryId}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DoorDash status check failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    external_delivery_id: string;
    delivery_status: string;
    pickup_time_estimated: string;
    dropoff_time_estimated: string;
    fee: number;
    tracking_url?: string;
    dasher?: { first_name?: string; phone_number?: string };
  };

  return {
    deliveryId: data.external_delivery_id,
    provider: 'doordash',
    status: mapDoorDashStatus(data.delivery_status),
    estimatedPickupTime: data.pickup_time_estimated,
    estimatedDeliveryTime: data.dropoff_time_estimated,
    estimatedCostCents: data.fee,
    trackingUrl: data.tracking_url,
    driverName: data.dasher?.first_name,
    driverPhone: data.dasher?.phone_number,
    isMock: false,
  };
}

export async function cancelDoorDashDelivery(
  deliveryId: string,
): Promise<{ success: boolean; isMock: boolean }> {
  if (!isDoorDashConfigured() || deliveryId.startsWith('dd_mock_')) {
    return { success: true, isMock: true };
  }

  const jwt = await createDoorDashJWT();

  const res = await fetch(
    `https://openapi.doordash.com/drive/v2/deliveries/${deliveryId}/cancel`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${jwt}` },
    },
  );

  return { success: res.ok, isMock: false };
}

// ---------------------------------------------------------------------------
// Status mapping
// ---------------------------------------------------------------------------

function mapDoorDashStatus(
  ddStatus: string,
): GigDeliveryResult['status'] {
  const map: Record<string, GigDeliveryResult['status']> = {
    created: 'pending',
    confirmed: 'accepted',
    enroute_to_pickup: 'accepted',
    arrived_at_pickup: 'accepted',
    picked_up: 'picked_up',
    enroute_to_dropoff: 'in_transit',
    arrived_at_dropoff: 'in_transit',
    delivered: 'delivered',
    cancelled: 'cancelled',
    returned: 'cancelled',
  };
  return map[ddStatus] ?? 'pending';
}
