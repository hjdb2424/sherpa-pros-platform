// ---------------------------------------------------------------------------
// Uber Connect (Direct) — Gig Delivery Service
// Reads UBER_CONNECT_CLIENT_ID and UBER_CONNECT_CLIENT_SECRET from process.env.
// If no keys: returns mock delivery result.
// If keys set: calls Uber Direct API.
// ---------------------------------------------------------------------------

// ---- Shared Types (imported by doordash-drive.ts and gig-dispatcher.ts) ----

export interface DeliveryPickup {
  storeName: string;
  storeAddress: string;
  contactName: string;
  contactPhone: string;
  pickupNotes?: string;
}

export interface DeliveryDropoff {
  address: string;
  contactName: string;
  contactPhone: string;
  dropoffNotes?: string;
}

export interface GigDeliveryRequest {
  pickup: DeliveryPickup;
  dropoff: DeliveryDropoff;
  itemDescription: string;
  estimatedWeightLbs: number;
  estimatedItemCount: number;
}

export interface GigDeliveryResult {
  deliveryId: string;
  provider: 'uber' | 'doordash';
  status:
    | 'pending'
    | 'accepted'
    | 'picked_up'
    | 'in_transit'
    | 'delivered'
    | 'cancelled'
    | 'mock';
  estimatedPickupTime: string;
  estimatedDeliveryTime: string;
  estimatedCostCents: number;
  trackingUrl?: string;
  driverName?: string;
  driverPhone?: string;
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Config check
// ---------------------------------------------------------------------------

export function isUberConfigured(): boolean {
  return !!(
    process.env.UBER_CONNECT_CLIENT_ID &&
    process.env.UBER_CONNECT_CLIENT_SECRET
  );
}

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function generateMockId(): string {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `uber_mock_${rand}`;
}

function computeMockCostCents(weightLbs: number): number {
  // Base $12 + $0.50/lb → result in cents
  const dollars = 12 + 0.5 * weightLbs;
  // Clamp to $15–$25 range
  const clamped = Math.min(25, Math.max(15, dollars));
  return Math.round(clamped * 100);
}

function buildMockResult(
  request: GigDeliveryRequest,
  deliveryId?: string,
): GigDeliveryResult {
  const now = new Date();
  const pickupTime = new Date(now.getTime() + 25 * 60_000); // 25 min
  const deliveryTime = new Date(now.getTime() + 60 * 60_000); // 60 min

  return {
    deliveryId: deliveryId ?? generateMockId(),
    provider: 'uber',
    status: 'mock',
    estimatedPickupTime: pickupTime.toISOString(),
    estimatedDeliveryTime: deliveryTime.toISOString(),
    estimatedCostCents: computeMockCostCents(request.estimatedWeightLbs),
    trackingUrl: 'https://uber.com/track/mock',
    driverName: 'Alex M.',
    driverPhone: '+16035550142',
    isMock: true,
  };
}

// ---------------------------------------------------------------------------
// OAuth2 token cache (real mode)
// ---------------------------------------------------------------------------

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getUberAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 30_000) {
    return cachedToken.token;
  }

  const res = await fetch('https://login.uber.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.UBER_CONNECT_CLIENT_ID!,
      client_secret: process.env.UBER_CONNECT_CLIENT_SECRET!,
      grant_type: 'client_credentials',
      scope: 'eats.deliveries',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Uber OAuth failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function requestUberDelivery(
  request: GigDeliveryRequest,
): Promise<GigDeliveryResult> {
  if (!isUberConfigured()) {
    return buildMockResult(request);
  }

  const token = await getUberAccessToken();

  const body = {
    pickup_name: request.pickup.storeName,
    pickup_address: request.pickup.storeAddress,
    pickup_phone_number: request.pickup.contactPhone,
    pickup_notes: request.pickup.pickupNotes ?? '',
    dropoff_name: request.dropoff.contactName,
    dropoff_address: request.dropoff.address,
    dropoff_phone_number: request.dropoff.contactPhone,
    dropoff_notes: request.dropoff.dropoffNotes ?? '',
    manifest_items: [
      {
        name: request.itemDescription,
        quantity: request.estimatedItemCount,
        weight: request.estimatedWeightLbs,
        dimensions: { length: 12, height: 12, depth: 12 },
      },
    ],
  };

  const res = await fetch('https://api.uber.com/v1/deliveries', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Uber delivery request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    id: string;
    status: string;
    pickup_eta: string;
    dropoff_eta: string;
    fee: number;
    tracking_url?: string;
    courier?: { name?: string; phone_number?: string };
  };

  return {
    deliveryId: data.id,
    provider: 'uber',
    status: mapUberStatus(data.status),
    estimatedPickupTime: data.pickup_eta,
    estimatedDeliveryTime: data.dropoff_eta,
    estimatedCostCents: data.fee, // Uber returns fee in cents
    trackingUrl: data.tracking_url,
    driverName: data.courier?.name,
    driverPhone: data.courier?.phone_number,
    isMock: false,
  };
}

export async function getUberDeliveryStatus(
  deliveryId: string,
): Promise<GigDeliveryResult> {
  if (!isUberConfigured() || deliveryId.startsWith('uber_mock_')) {
    return {
      deliveryId,
      provider: 'uber',
      status: 'mock',
      estimatedPickupTime: new Date(
        Date.now() + 15 * 60_000,
      ).toISOString(),
      estimatedDeliveryTime: new Date(
        Date.now() + 45 * 60_000,
      ).toISOString(),
      estimatedCostCents: 1800,
      trackingUrl: 'https://uber.com/track/mock',
      driverName: 'Alex M.',
      driverPhone: '+16035550142',
      isMock: true,
    };
  }

  const token = await getUberAccessToken();

  const res = await fetch(`https://api.uber.com/v1/deliveries/${deliveryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Uber status check failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    id: string;
    status: string;
    pickup_eta: string;
    dropoff_eta: string;
    fee: number;
    tracking_url?: string;
    courier?: { name?: string; phone_number?: string };
  };

  return {
    deliveryId: data.id,
    provider: 'uber',
    status: mapUberStatus(data.status),
    estimatedPickupTime: data.pickup_eta,
    estimatedDeliveryTime: data.dropoff_eta,
    estimatedCostCents: data.fee,
    trackingUrl: data.tracking_url,
    driverName: data.courier?.name,
    driverPhone: data.courier?.phone_number,
    isMock: false,
  };
}

export async function cancelUberDelivery(
  deliveryId: string,
): Promise<{ success: boolean; isMock: boolean }> {
  if (!isUberConfigured() || deliveryId.startsWith('uber_mock_')) {
    return { success: true, isMock: true };
  }

  const token = await getUberAccessToken();

  const res = await fetch(
    `https://api.uber.com/v1/deliveries/${deliveryId}/cancel`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return { success: res.ok, isMock: false };
}

// ---------------------------------------------------------------------------
// Status mapping
// ---------------------------------------------------------------------------

function mapUberStatus(
  uberStatus: string,
): GigDeliveryResult['status'] {
  const map: Record<string, GigDeliveryResult['status']> = {
    pending: 'pending',
    pickup: 'accepted',
    pickup_complete: 'picked_up',
    dropoff: 'in_transit',
    delivered: 'delivered',
    canceled: 'cancelled',
    returned: 'cancelled',
  };
  return map[uberStatus] ?? 'pending';
}
